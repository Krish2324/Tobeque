import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import type { Product } from '../components/ProductCard';

// ─── Types from Backend ───────────────────────────────────────────────────────

interface BackendProduct {
  id: number;
  name: string;
  slug: string;
  sku: string;
  shortDescription: string | null;
  fullDescription: string | null;
  price: string | number;
  discountPrice: string | number | null;
  stockQuantity: number;
  status: 'draft' | 'published';
  isFeatured: boolean;
  thumbnail: string | null;
  colors?: string[];
  variants: Array<{ size?: string; color?: string; stock?: number; price?: number; sku?: string }> | null;
  images?: Array<{ id: number; imageUrl: string }>;
  category?: { id: number; name: string } | null;
  brand?: { id: number; name: string } | null;
}

interface UseProductsOptions {
  status?: 'published' | 'draft';
  featured?: boolean;
  limit?: number;
  page?: number;
  category?: string | number;
}

interface UseProductsResult {
  products: Product[];
  loading: boolean;
  error: string | null;
  total: number;
  refetch: () => void;
}

// ─── Image URL Helper ─────────────────────────────────────────────────────────

/**
 * Resolves a backend image path to a working URL.
 * - /uploads/... paths → proxied through Vite at the same path
 * - full http URLs → used as-is
 * - null/empty → fallback placeholder
 */
function resolveImageUrl(path: string | null | undefined): string {
  if (!path) {
    return 'https://via.placeholder.com/400x500?text=No+Image';
  }
  if (path.startsWith('http')) {
    return path;
  }
  // Vite proxy will forward /uploads/* → http://localhost:5000/uploads/*
  return path;
}

// ─── Data Mapper ─────────────────────────────────────────────────────────────

/**
 * Maps a backend product object to the website's Product type
 * used by ProductCard and related components.
 */
function mapBackendProduct(bp: BackendProduct): Product {
  const price = parseFloat(String(bp.price));
  const discountPrice = bp.discountPrice ? parseFloat(String(bp.discountPrice)) : null;

  // Format price as "₹XX.XX"
  const formattedPrice = `₹${price.toFixed(2)}`;
  
  const displayPrice = discountPrice ? `₹${discountPrice.toFixed(2)}` : formattedPrice;
  const originalPrice = discountPrice ? formattedPrice : undefined;

  // Extract sizes and colors from variants JSON
  const sizes: string[] = [];
  const detailedColors: { name: string; class: string; bgStyle: any; inStock?: boolean }[] = [];
  const colorNames = new Set<string>();
  
  // Aggregate stock per color from variants
  const colorStockMap = new Map<string, number>();
  if (bp.variants && Array.isArray(bp.variants)) {
    bp.variants.forEach((v: any) => {
      const colorKey = Object.keys(v).find(k => k.toLowerCase() === 'color');
      if (colorKey && v[colorKey]) {
        const colorVal = String(v[colorKey]).trim().toLowerCase();
        const stockKey = Object.keys(v).find(k => k.toLowerCase() === 'stock');
        const stockVal = (stockKey && v[stockKey] !== undefined && v[stockKey] !== '') ? Number(v[stockKey]) : 0;
        
        colorStockMap.set(colorVal, (colorStockMap.get(colorVal) || 0) + stockVal);
      }
    });
  }

  // Helper to add color if not present
  const addColor = (colorStr: string) => {
    const cleanColor = String(colorStr).trim();
    if (cleanColor && !colorNames.has(cleanColor.toLowerCase())) {
      colorNames.add(cleanColor.toLowerCase());
      
      let hasStock = true;
      if (bp.variants && Array.isArray(bp.variants) && bp.variants.length > 0) {
        // If they use variants, enforce stock check. If a color has 0 variants with stock > 0, disable it.
        hasStock = colorStockMap.has(cleanColor.toLowerCase()) ? colorStockMap.get(cleanColor.toLowerCase())! > 0 : false;
      }
      
      detailedColors.push({
        name: cleanColor.toUpperCase(),
        class: '',
        bgStyle: { backgroundColor: cleanColor.toLowerCase() },
        inStock: hasStock
      });
    }
  };

  if (bp.colors && Array.isArray(bp.colors)) {
    bp.colors.forEach(addColor);
  }

  if (bp.variants && Array.isArray(bp.variants)) {
    bp.variants.forEach((v: any) => {
      // Find size (case-insensitive key check)
      const sizeKey = Object.keys(v).find(k => k.toLowerCase() === 'size');
      if (sizeKey && v[sizeKey]) {
        const sizeVal = String(v[sizeKey]).trim().toUpperCase();
        if (!sizes.includes(sizeVal)) sizes.push(sizeVal);
      }

      // Find color (case-insensitive key check)
      const colorKey = Object.keys(v).find(k => k.toLowerCase() === 'color');
      if (colorKey && v[colorKey]) {
        addColor(v[colorKey]);
      }
    });
  }

  // Extract gallery images
  const galleryImages: string[] = [];
  const galleryImageObjects: { url: string; color?: string }[] = [];
  if (bp.images && bp.images.length > 0) {
    bp.images.forEach((img) => {
      const url = resolveImageUrl(img.imageUrl);
      galleryImages.push(url);
      galleryImageObjects.push({ url, color: (img as any).color });
    });
  }

  // Badge logic
  let badge: string | undefined;
  let badgeClass: string | undefined;
  if (bp.isFeatured) {
    badge = 'Featured';
    badgeClass = 'bg-primary text-on-primary';
  }

  return {
    id: String(bp.id),
    name: bp.name,
    price: displayPrice,
    originalPrice,
    imageSrc: resolveImageUrl(bp.thumbnail),
    hoverImageSrc: galleryImages[0] ?? resolveImageUrl(bp.thumbnail),
    imageAlt: bp.name,
    badge,
    badgeClass,
    detailedColors: detailedColors.length > 0 ? detailedColors : undefined,
    sizes: sizes.length > 0 ? sizes : undefined,
    description: bp.fullDescription ?? bp.shortDescription ?? '',
    galleryImages: galleryImages.length > 0 ? galleryImages : [resolveImageUrl(bp.thumbnail)],
    galleryImageObjects: galleryImageObjects.length > 0 ? galleryImageObjects : [{ url: resolveImageUrl(bp.thumbnail) }],
    rawVariants: (bp.variants && Array.isArray(bp.variants)) ? bp.variants : undefined,
    fabricCare: '',
    shippingReturns: 'Orders are processed within 1-2 business days.',
    sku: bp.sku || undefined,
  };
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useProducts(options: UseProductsOptions = {}): UseProductsResult {
  const {
    status = 'published',
    featured,
    limit = 20,
    page = 1,
    category,
  } = options;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, string | number | boolean> = {
        status,
        limit,
        page,
      };
      if (featured !== undefined) params.featured = featured;
      if (category !== undefined) params.category = category;

      const response = await api.get('/api/products', { params });
      const data = response.data;

      if (data.success && data.data?.products) {
        const mapped = (data.data.products as BackendProduct[]).map(mapBackendProduct);
        setProducts(mapped);
        setTotal(data.data.pagination?.total ?? mapped.length);
      } else {
        setProducts([]);
        setTotal(0);
      }
    } catch (err: unknown) {
      console.error('[useProducts] Failed to fetch products:', err);
      setError('Could not load products. Make sure the backend is running.');
      setProducts([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [status, featured, limit, page, category]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, error, total, refetch: fetchProducts };
}

// ─── Single Product Hook ──────────────────────────────────────────────────────

interface UseProductResult {
  product: Product | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useProduct(id: string | undefined): UseProductResult {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = useCallback(async () => {
    if (!id) {
      setProduct(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/api/products/${id}`);
      const data = response.data;

      if (data.success && data.product) {
        setProduct(mapBackendProduct(data.product as BackendProduct));
      } else {
        setProduct(null);
        setError('Product not found.');
      }
    } catch (err: unknown) {
      console.error('[useProduct] Failed to fetch product:', err);
      setError('Could not load product. Make sure the backend is running.');
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return { product, loading, error, refetch: fetchProduct };
}
