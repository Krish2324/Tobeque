import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import type { Product } from '../components/ProductCard';
import { useCurrency } from '../context/CurrencyContext';

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
  taxRate?: number;
  colors?: string[];
  variants: Array<{ size?: string; color?: string; stock?: number; price?: number; sku?: string }> | null;
  images?: Array<{ id: number; imageUrl: string }>;
  category?: any;
  brand?: { id: number; name: string } | null;
  isOnSaleSection?: boolean;
  isHotRightNow?: boolean;
  hotRightNowMedia?: string | null;
  styleItWith?: BackendProduct[];
  relatedCategories?: any[];
  show7DayReturn?: boolean;
  showFreeShipping?: boolean;
  showCodAvailable?: boolean;
  sizeChart?: any;
  customSections?: Array<{ title: string; content: string }> | null;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  seoSchema?: string;
  imageAltTag?: string;
}

interface UseProductsOptions {
  status?: 'published' | 'draft';
  featured?: boolean;
  limit?: number;
  page?: number;
  category?: string | number;
  isOnSaleSection?: boolean;
  isHotRightNow?: boolean;
  sortBy?: string;
  sortDir?: string;
}

interface UseProductsResult {
  products: Product[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  total: number;
  hasMore: boolean;
  refetch: () => void;
  loadMore: () => void;
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
function mapBackendProduct(bp: BackendProduct, currencySymbol: string = '₹'): Product {
  const price = parseFloat(String(bp.price));
  const discountPrice = bp.discountPrice ? parseFloat(String(bp.discountPrice)) : null;

  // Format price
  const formattedPrice = `${currencySymbol}${price.toFixed(2)}`;
  
  const displayPrice = discountPrice ? `${currencySymbol}${discountPrice.toFixed(2)}` : formattedPrice;
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

  // Extract gallery images, always ensuring the primary thumbnail is first
  // Treat empty string same as null/undefined (backend defaults thumbnail to '')
  let rawThumbnail: string | null | undefined = bp.thumbnail && bp.thumbnail.trim() !== '' ? bp.thumbnail : null;
  if (!rawThumbnail && bp.images && bp.images.length > 0) {
    rawThumbnail = (bp.images[0] as any).imageUrl || (bp.images[0] as any).url || null;
  }
  const thumbnailUrl = resolveImageUrl(rawThumbnail);
  let thumbnailColor: string | undefined = (bp as any).thumbnailColor;
  const galleryImages: string[] = [];
  const galleryImageObjects: { url: string; color?: string }[] = [];
  if (bp.images && bp.images.length > 0) {
    bp.images.forEach((img: any) => {
      const url = resolveImageUrl(img.imageUrl || img.url || img);
      const imgColor = img.color || undefined;
      // If this image's URL matches the thumbnail, capture its color
      if (url === thumbnailUrl) {
        if (imgColor) thumbnailColor = imgColor;
        return; // Don't add thumbnail again — it will be unshifted below
      }
      galleryImages.push(url);
      galleryImageObjects.push({ url, color: imgColor });
    });
  }
  // Always put the thumbnail first so primary thumbnail is always first in gallery
  galleryImages.unshift(thumbnailUrl);
  galleryImageObjects.unshift({ url: thumbnailUrl, color: thumbnailColor });

  // Badge logic
  let badge: string | undefined;
  let badgeClass: string | undefined;
  
  // Featured badge is hidden as requested

  return {
    id: String(bp.id),
    name: bp.name,
    price: displayPrice,
    originalPrice,
    imageSrc: thumbnailUrl,
    hoverImageSrc: galleryImages[1] ?? thumbnailUrl,
    imageAlt: bp.name,
    badge,
    badgeClass,
    detailedColors: detailedColors.length > 0 ? detailedColors : undefined,
    sizes: sizes.length > 0 ? sizes : undefined,
    description: bp.fullDescription ?? bp.shortDescription ?? '',
    galleryImages,
    galleryImageObjects,
    rawVariants: (bp.variants && Array.isArray(bp.variants)) ? bp.variants : undefined,
    customSections: (bp.customSections && Array.isArray(bp.customSections)) ? bp.customSections : undefined,
    sku: bp.sku || undefined,
    taxRate: bp.taxRate,
    hotRightNowMedia: bp.hotRightNowMedia ? resolveImageUrl(bp.hotRightNowMedia) : undefined,
    styleItWith: bp.styleItWith ? bp.styleItWith.map(p => mapBackendProduct(p, currencySymbol)) : undefined,
    relatedCategories: bp.relatedCategories ? bp.relatedCategories.map((c: any) => typeof c === 'object' ? String(c.id || c._id || c) : String(c)) : undefined,
    category: bp.category ? (typeof bp.category === 'object' ? String(bp.category.id || (bp.category as any)._id || bp.category) : String(bp.category)) : undefined,
    show7DayReturn: bp.show7DayReturn,
    showFreeShipping: bp.showFreeShipping,
    showCodAvailable: bp.showCodAvailable,
    sizeChart: bp.sizeChart,
    slug: bp.slug,
    seoTitle: bp.seoTitle,
    seoDescription: bp.seoDescription,
    seoKeywords: bp.seoKeywords,
    seoSchema: bp.seoSchema,
    imageAltTag: bp.imageAltTag,
    categorySlug: bp.category?.slug || bp.category?.name?.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-') || undefined,
  };
}

// ─── Module-level cache (persists across React navigation) ───────────────────
// Cache survives component unmount/remount so navigating back is instant.

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const productsCache = new Map<string, CacheEntry<{ products: any[]; total: number }>>();
const productCache = new Map<string, CacheEntry<any>>();

function buildCacheKey(options: Record<string, any>): string {
  return JSON.stringify(options, Object.keys(options).sort());
}

function isCacheValid<T>(entry: CacheEntry<T> | undefined): entry is CacheEntry<T> {
  return !!entry && Date.now() - entry.timestamp < CACHE_TTL;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useProducts(options: UseProductsOptions = {}): UseProductsResult {
  const {
    status = 'published',
    featured,
    limit = 20,
    page: initialPage = 1,
    category,
    isOnSaleSection,
    isHotRightNow,
    sortBy,
    sortDir,
  } = options;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(initialPage);
  const { currencySymbol } = useCurrency();

  const fetchProducts = useCallback(async (isLoadMore = false, currentPage = 1) => {
    const cacheKey = buildCacheKey({ status, featured, limit, page: currentPage, category, isOnSaleSection, isHotRightNow, sortBy, sortDir, currencySymbol });

    // Serve from cache instantly if fresh (only for first page, not load-more)
    if (!isLoadMore) {
      const cached = productsCache.get(cacheKey);
      if (isCacheValid(cached)) {
        setProducts(cached.data.products);
        setTotal(cached.data.total);
        setLoading(false);
        return;
      }
    }

    if (isLoadMore) setLoadingMore(true);
    else setLoading(true);
    
    setError(null);
    try {
      const params: Record<string, string | number | boolean> = {
        status,
        limit,
        page: currentPage,
      };
      if (featured !== undefined) params.featured = featured;
      if (category !== undefined) params.category = category;
      if (isOnSaleSection !== undefined) params.isOnSaleSection = isOnSaleSection;
      if (isHotRightNow !== undefined) params.isHotRightNow = isHotRightNow;
      if (sortBy !== undefined) params.sortBy = sortBy;
      if (sortDir !== undefined) params.sortDir = sortDir;

      const response = await api.get('/api/products', { params });
      const data = response.data;

      if (data.success && data.data?.products) {
        const mapped = (data.data.products as BackendProduct[]).map((bp) => mapBackendProduct(bp, currencySymbol));
        const newTotal = data.data.pagination?.total ?? mapped.length;
        if (isLoadMore) {
          setProducts(prev => {
            // Deduplicate products by id
            const newProducts = [...prev];
            mapped.forEach(m => {
              if (!newProducts.find(p => p.id === m.id)) {
                newProducts.push(m);
              }
            });
            return newProducts;
          });
        } else {
          setProducts(mapped);
          setTotal(newTotal);
          // Save to cache
          productsCache.set(cacheKey, { data: { products: mapped, total: newTotal }, timestamp: Date.now() });
        }
        if (isLoadMore) {
          setTotal(data.data.pagination?.total ?? (products.length + mapped.length));
        }
      } else {
        if (!isLoadMore) {
          setProducts([]);
          setTotal(0);
        }
      }
    } catch (err: unknown) {
      console.error('[useProducts] Failed to fetch products:', err);
      setError('Could not load products. Make sure the backend is running.');
      if (!isLoadMore) {
        setProducts([]);
        setTotal(0);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [status, featured, limit, category, isOnSaleSection, isHotRightNow, sortBy, sortDir, currencySymbol]);

  useEffect(() => {
    setPage(1);
    fetchProducts(false, 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, featured, limit, category, isOnSaleSection, isHotRightNow, sortBy, sortDir, currencySymbol]);

  const loadMore = useCallback(() => {
    if (products.length < total) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchProducts(true, nextPage);
    }
  }, [products.length, total, page, fetchProducts]);

  const hasMore = products.length < total;

  return { products, loading, loadingMore, error, total, hasMore, refetch: () => fetchProducts(false, 1), loadMore };
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
  const { currencySymbol } = useCurrency();

  const fetchProduct = useCallback(async () => {
    if (!id) {
      setProduct(null);
      setLoading(false);
      return;
    }

    // Serve from cache instantly if fresh
    const cacheKey = `product:${id}:${currencySymbol}`;
    const cached = productCache.get(cacheKey);
    if (isCacheValid(cached)) {
      setProduct(cached.data);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/api/products/${id}`);
      const data = response.data;

      if (data.success && data.product) {
        const mapped = mapBackendProduct(data.product as BackendProduct, currencySymbol);
        setProduct(mapped);
        // Save to cache
        productCache.set(cacheKey, { data: mapped, timestamp: Date.now() });
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
  }, [id, currencySymbol]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return { product, loading, error, refetch: fetchProduct };
}
