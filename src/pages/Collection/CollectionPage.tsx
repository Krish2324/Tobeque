import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams, useNavigate, useParams, useLocation } from 'react-router-dom';

import { ProductCard, type Product } from '../../components/ProductCard';
import { useCart } from '../../context/CartContext';
import { useProducts, resolveImageUrl } from '../../hooks/useProducts';
import { QuickViewModal } from '../../components/QuickViewModal/QuickViewModal';
import { Navbar } from '../../components/Navbar/Navbar';
import { Footer } from '../../components/Footer/Footer';
import { NotFoundPage } from '../NotFound/NotFoundPage';
import api from '../../services/api';
import { useCurrency } from '../../context/CurrencyContext';

const BASE_COLORS = [
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF', border: true },
  { name: 'Grey', hex: '#9CA3AF' },
  { name: 'Beige', hex: '#F5F5DC', border: true },
  { name: 'Brown', hex: '#8B4513' },
  { name: 'Blue', hex: '#3B82F6' },
  { name: 'Navy', hex: '#1E3A8A' },
  { name: 'Green', hex: '#10B981' },
  { name: 'Red', hex: '#EF4444' },
  { name: 'Pink', hex: '#F472B6' },
  { name: 'Yellow', hex: '#FBBF24' },
];

interface Category {
  id?: string;
  _id?: string;
  name: string;
  description?: string;
  descriptionSections?: Array<{ title?: string; content?: string }>;
  subcategories?: Category[];
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  seoSchema?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  twitterCard?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
}

export function CollectionPage() {
  const navigate = useNavigate();
  const { currencySymbol } = useCurrency();
  const { setIsCartOpen, addToCart, wishlistItems, addToWishlist, removeFromWishlist } = useCart();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [currentSort, setCurrentSort] = useState('FEATURED');

  // Filter & Layout states
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid-3' | 'grid-4'>('grid-4');
  // Mobile-only grid column toggle: 2 (default) or 3
  const [mobileGridCols, setMobileGridCols] = useState<2 | 3>(2);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const { categorySlug } = useParams<{ categorySlug?: string }>();

  useEffect(() => {
    setIsDescriptionExpanded(false);
  }, [categorySlug]);
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const stateCategory = (location.state as any)?.category;
  const stateName = (location.state as any)?.name;

  const categoryParam = categorySlug || searchParams.get('category') || stateCategory;
  const categoryNameParam = searchParams.get('name') || stateName;

  // ── Live categories tree ──────────────────────────────────────────────────
  const [categoriesTree, setCategoriesTree] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // ── Hero Banner State ────────────────────────────────────────────────────
  const [heroBannerData, setHeroBannerData] = useState<any>(null);
  const [bannersLoading, setBannersLoading] = useState(true);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    api.get('/api/banners')
      .then(res => {
        if (res.data.success && Array.isArray(res.data.banners)) {
          const activeBanners = res.data.banners.filter((b: any) => b.status);
          const collectionHero = activeBanners.find((b: any) => b.position === 'collection_hero');
          if (collectionHero) setHeroBannerData(collectionHero);
        }
      })
      .catch(() => { })
      .finally(() => setBannersLoading(false));
  }, []);

  useEffect(() => {
    api.get('/api/categories/public')
      .then(res => {
        if (res.data.success && Array.isArray(res.data.categories)) {
          setCategoriesTree(res.data.categories);
        }
      })
      .catch(() => { })
      .finally(() => setCategoriesLoading(false));
  }, []);

  // Infinite scroll sentinel ref
  const infiniteScrollRef = useRef<HTMLDivElement>(null);

const CATEGORY_301_REDIRECTS: Record<string, string> = {
  // Tops -> tops-for-teens
  'tops': 'tops-for-teens',
  'top': 'tops-for-teens',
  'tops-s': 'tops-for-teens',
  'top-s': 'tops-for-teens',
  'tops-for-teen': 'tops-for-teens',
  'tops-for-teens-s': 'tops-for-teens',

  // Summer 26 -> summer-clothes
  'summer-26': 'summer-clothes',
  'summer26': 'summer-clothes',
  'summer-2026': 'summer-clothes',
  'summer-clothe': 'summer-clothes',
  'summer-clothes-s': 'summer-clothes',

  // Shirts and blouses -> shirt-blouses
  'shirts-and-blouses': 'shirt-blouses',
  'shirts-and-blouse': 'shirt-blouses',
  'shirt-and-blouse': 'shirt-blouses',
  'shirt-and-blouses': 'shirt-blouses',
  'shirts-blouses': 'shirt-blouses',
  'shirts-blouse': 'shirt-blouses',
  'shirt-blouse': 'shirt-blouses',
  'shirts-and-blouses-s': 'shirt-blouses',
  'shirts-and-blouse-s': 'shirt-blouses',
  'shirt-blouses-s': 'shirt-blouses',

  // Dresses -> dresses-for-girls
  'dresses': 'dresses-for-girls',
  'dress': 'dresses-for-girls',
  'dresses-for-girl': 'dresses-for-girls',
  'dresses-for-girls-s': 'dresses-for-girls',
  'dresses-s': 'dresses-for-girls',

  // Skirts and shorts -> skirt-shorts
  'skirts-and-shorts': 'skirt-shorts',
  'skirts-and-short': 'skirt-shorts',
  'skirt-and-shorts': 'skirt-shorts',
  'skirt-and-short': 'skirt-shorts',
  'skirts-shorts': 'skirt-shorts',
  'skirts-short': 'skirt-shorts',
  'skirt-shorts-s': 'skirt-shorts',
  'skirts-and-shorts-s': 'skirt-shorts',

  // T-shirts and vests -> t-shirt-vests
  't-shirts-and-vests': 't-shirt-vests',
  't-shirts-and-vest': 't-shirt-vests',
  't-shirt-and-vests': 't-shirt-vests',
  't-shirt-and-vest': 't-shirt-vests',
  't-shirts-vests': 't-shirt-vests',
  't-shirts-vest': 't-shirt-vests',
  't-shirt-vests-s': 't-shirt-vests',
  't-shirts-and-vests-s': 't-shirt-vests',
};

// Compute what tabs to show based on the tree and current categoryParam
  const { currentContext, siblings, canonicalCategory } = useMemo<{ currentContext: Category | null, siblings: Category[], canonicalCategory: Category | null }>(() => {
    const searchId = searchParams.get('category') || stateCategory;
    const searchName = searchParams.get('name') || stateName;

    const normalizeCategoryString = (str: string) =>
      str
        .toLowerCase()
        .trim()
        .replace(/&/g, ' and ')
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter(w => w !== '' && w !== 'and')
        .map(w => w.replace(/s+$/, ''))
        .join('');

    let foundCategory: Category | null = null;
    let parentCategory: Category | null = null;

    if (categoryParam || searchId || searchName) {
      let targetParam = decodeURIComponent(categoryParam || searchName || '').trim();
      const lowerTarget = targetParam.toLowerCase();

      // Check 301 alias redirect map
      if (CATEGORY_301_REDIRECTS[lowerTarget]) {
        targetParam = CATEGORY_301_REDIRECTS[lowerTarget];
      }

      const targetNormalized = normalizeCategoryString(targetParam);

      const dfs = (nodes: Category[], parent: Category | null): { node: Category; parent: Category | null } | null => {
        // 1. Exact & direct slug match pass
        for (const n of nodes) {
          const nodeId = String(n.id || n._id || '');
          const nodeName = String(n.name || '');
          const nodeSlug = (n as any).slug ? String((n as any).slug) : '';

          if (
            (searchId && nodeId === searchId) ||
            (targetParam && (nodeId === targetParam || nodeSlug.toLowerCase() === targetParam.toLowerCase() || nodeName.toLowerCase() === targetParam.toLowerCase())) ||
            (targetNormalized && (
              normalizeCategoryString(nodeName) === targetNormalized ||
              normalizeCategoryString(nodeSlug) === targetNormalized ||
              normalizeCategoryString(nodeName.replace(/and/g, '')) === targetNormalized.replace(/and/g, '') ||
              normalizeCategoryString(nodeSlug.replace(/and/g, '')) === targetNormalized.replace(/and/g, '')
            ))
          ) {
            return { node: n, parent };
          }
          if (n.subcategories && n.subcategories.length > 0) {
            const res = dfs(n.subcategories, n);
            if (res) return res;
          }
        }

        // 2. Partial / Prefix / Plural match pass
        for (const n of nodes) {
          const nodeName = String(n.name || '');
          const nodeSlug = (n as any).slug ? String((n as any).slug) : '';
          const normName = normalizeCategoryString(nodeName);
          const normSlug = normalizeCategoryString(nodeSlug);

          if (
            targetNormalized && targetNormalized.length >= 2 && (
              normSlug.startsWith(targetNormalized) ||
              normName.startsWith(targetNormalized) ||
              targetNormalized.startsWith(normSlug) ||
              targetNormalized.startsWith(normName)
            )
          ) {
            return { node: n, parent };
          }
          if (n.subcategories && n.subcategories.length > 0) {
            const res = dfs(n.subcategories, n);
            if (res) return res;
          }
        }

        return null;
      };
      const res = dfs(categoriesTree, null);
      if (res) {
        foundCategory = res.node;
        parentCategory = res.parent;
      }
    }

    if (foundCategory) {
      // 1. If foundCategory has subcategories, show its subcategories as tabs
      if (foundCategory.subcategories && foundCategory.subcategories.length > 0) {
        return { currentContext: foundCategory, siblings: foundCategory.subcategories, canonicalCategory: foundCategory };
      }
      // 2. If foundCategory is a subcategory, show all sibling subcategories under the same parent
      if (parentCategory && parentCategory.subcategories && parentCategory.subcategories.length > 0) {
        return { currentContext: parentCategory, siblings: parentCategory.subcategories, canonicalCategory: foundCategory };
      }
    }

    // Default: show all main categories
    return { currentContext: foundCategory, siblings: categoriesTree, canonicalCategory: foundCategory };
  }, [categoriesTree, categoryParam, searchParams]);

  // Valid category check: redirect/render 404 if slug is unknown
  const SPECIAL_SLUGS = useMemo(() => new Set(['all', 'new-in', 'summer-clothes', 'customisable', 'collaboration', 'steal-the-style']), []);

  const isValidCategory = useMemo(() => {
    if (categoriesLoading) return true;
    if (!categorySlug) return true;
    const lowerSlug = categorySlug.toLowerCase().trim();
    if (SPECIAL_SLUGS.has(lowerSlug)) return true;
    if (CATEGORY_301_REDIRECTS[lowerSlug]) return true;
    if (currentContext) return true;
    return false;
  }, [categoriesLoading, categorySlug, SPECIAL_SLUGS, currentContext]);

  // Auto-redirect URL to full canonical category slug (301 Redirection rules)
  useEffect(() => {
    if (!categorySlug) return;
    const lowerSlug = categorySlug.toLowerCase().trim();
    if (SPECIAL_SLUGS.has(lowerSlug)) return;

    // 1. Check explicit 301 redirect map first
    if (CATEGORY_301_REDIRECTS[lowerSlug]) {
      const targetSlug = CATEGORY_301_REDIRECTS[lowerSlug];
      if (lowerSlug !== targetSlug) {
        navigate(`/product-category/${targetSlug}`, { replace: true, state: location.state });
        return;
      }
    }

    // 2. Canonical redirect if category matched via fuzzy/partial
    if (!categoriesLoading && canonicalCategory) {
      const rawSlug = (canonicalCategory as any).slug ? String((canonicalCategory as any).slug).replace(/-\d+$/, '') : canonicalCategory.name;
      const canonicalSlug = String(rawSlug).toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-');

      if (canonicalSlug && categorySlug !== canonicalSlug && lowerSlug !== canonicalSlug) {
        navigate(`/product-category/${canonicalSlug}`, { replace: true, state: location.state });
      }
    }
  }, [categoriesLoading, categorySlug, canonicalCategory, SPECIAL_SLUGS, navigate, location.state]);

  if (!categoriesLoading && !isValidCategory) {
    return <NotFoundPage />;
  }

  // ── Products ──────────────────────────────────────────────────────────────
  let sortByParam = 'createdAt';
  let sortDirParam = 'DESC';
  if (currentSort === 'PRICE: LOW TO HIGH') {
    sortByParam = 'price';
    sortDirParam = 'ASC';
  } else if (currentSort === 'PRICE: HIGH TO LOW') {
    sortByParam = 'price';
    sortDirParam = 'DESC';
  } else if (currentSort === 'NEWEST') {
    sortByParam = 'createdAt';
    sortDirParam = 'DESC';
  }

  const searchCategoryId = searchParams.get('category') || stateCategory;
  const effectiveCategory = searchCategoryId || (currentContext ? (currentContext.id || currentContext._id) : (categoryParam && categoryParam.toLowerCase() !== 'all' ? categoryParam : undefined));

  const { products: liveProducts, loading, loadingMore, error, total, hasMore, loadMore } = useProducts({
    status: 'published',
    limit: 20,
    category: effectiveCategory,
    sortBy: sortByParam,
    sortDir: sortDirParam,
  });

  // Infinite Scroll Observer
  useEffect(() => {
    if (!hasMore || loadingMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: '350px' }
    );

    if (infiniteScrollRef.current) {
      observer.observe(infiniteScrollRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loadingMore, loading, loadMore]);

  // Extract all unique sizes from loaded products dynamically
  const { allSizes } = useMemo(() => {
    const sizesSet = new Set<string>();

    liveProducts.forEach(p => {
      if (p.sizes) {
        p.sizes.forEach(s => sizesSet.add(s));
      }
    });

    const standardSizesOrder = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '2XL', 'O/S'];
    const sortedSizes = Array.from(sizesSet).sort((a, b) => {
      const idxA = standardSizesOrder.indexOf(a);
      const idxB = standardSizesOrder.indexOf(b);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.localeCompare(b);
    });

    return {
      allSizes: sortedSizes.length > 0 ? sortedSizes : ['XS', 'S', 'M', 'L', 'XL']
    };
  }, [liveProducts]);

  // Filter and sort products client-side
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...liveProducts];

    // Filter by selected sizes
    if (selectedSizes.length > 0) {
      result = result.filter(p =>
        p.sizes && p.sizes.some(s => selectedSizes.includes(s))
      );
    }

    // Filter by selected colors
    if (selectedColors.length > 0) {
      result = result.filter(p => {
        const pColors: string[] = [];
        if (p.detailedColors) pColors.push(...p.detailedColors.map(c => c.name.toLowerCase()));
        if (p.colors) pColors.push(...p.colors.map(c => c.toLowerCase()));

        return selectedColors.some(selected => {
          const s = selected.toLowerCase();
          const matchTerms = [s];
          if (s === 'blue') matchTerms.push('navy', 'teal', 'cyan', 'denim', 'sapphire', 'azure');
          if (s === 'red') matchTerms.push('maroon', 'burgundy', 'wine', 'crimson', 'ruby');
          if (s === 'green') matchTerms.push('olive', 'mint', 'emerald', 'forest', 'khaki');
          if (s === 'white') matchTerms.push('ivory', 'cream', 'snow', 'off-white');
          if (s === 'grey') matchTerms.push('silver', 'charcoal', 'ash', 'slate', 'gray');
          if (s === 'brown' || s === 'beige') matchTerms.push('tan', 'chocolate', 'camel', 'beige', 'mocha', 'sand', 'oatmeal');
          if (s === 'pink') matchTerms.push('rose', 'magenta', 'fuchsia', 'peach');
          if (s === 'yellow') matchTerms.push('mustard', 'gold', 'lemon');

          return pColors.some(pc => matchTerms.some(term => pc.includes(term)));
        });
      });
    }

    // Filter by price range
    const min = parseFloat(minPrice);
    const max = parseFloat(maxPrice);
    if (!isNaN(min)) {
      result = result.filter(p => {
        const pPrice = parseFloat(p.price.replace(/[^0-9.-]+/g, ''));
        return !isNaN(pPrice) && pPrice >= min;
      });
    }
    if (!isNaN(max)) {
      result = result.filter(p => {
        const pPrice = parseFloat(p.price.replace(/[^0-9.-]+/g, ''));
        return !isNaN(pPrice) && pPrice <= max;
      });
    }

    return result;
  }, [liveProducts, selectedSizes, selectedColors, minPrice, maxPrice]);

  const handleWishlist = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    const exists = wishlistItems.find((p) => p.name === product.name);
    if (exists) removeFromWishlist(product.name);
    else addToWishlist(product);
  };

  // Displayed heading
  const displayTitle = categoryNameParam
    ? decodeURIComponent(categoryNameParam).toUpperCase()
    : currentContext
      ? currentContext.name.toUpperCase()
      : (categorySlug && categorySlug.toLowerCase() !== 'all'
        ? decodeURIComponent(categorySlug).replace(/-/g, ' ').toUpperCase()
        : 'ALL PRODUCTS');

  // Dynamic Head SEO Metadata Management (Title, Description, Keywords, Schema, Twitter, OG)
  useEffect(() => {
    const originalTitle = document.title;

    // Determine Meta Title
    const titleText = currentContext?.seoTitle && currentContext.seoTitle.trim()
      ? currentContext.seoTitle.trim()
      : `${displayTitle} | Tobeque`;

    document.title = titleText;

    // Determine Meta Description
    let descText = '';
    if (currentContext?.seoDescription && currentContext.seoDescription.trim()) {
      descText = currentContext.seoDescription.trim();
    } else if (currentContext?.description && currentContext.description.trim()) {
      descText = currentContext.description.replace(/<[^>]*>/g, '').trim();
    } else {
      descText = `Explore ${displayTitle} collection at Tobeque. Discover effortless silhouettes and timeless fashion.`;
    }

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    const oldDesc = metaDesc.getAttribute('content') || '';
    metaDesc.setAttribute('content', descText);

    // Meta Keywords Tag
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    const oldKeywords = metaKeywords.getAttribute('content') || '';
    if (currentContext?.seoKeywords) {
      metaKeywords.setAttribute('content', currentContext.seoKeywords);
    }

    const injectedMetaElements: Element[] = [];

    // Helper for setting dynamic meta tags (Twitter & OG)
    const setMetaTag = (attrName: string, attrVal: string, content: string) => {
      let tag = document.querySelector(`meta[${attrName}="${attrVal}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attrName, attrVal);
        tag.setAttribute('data-dynamic-meta', 'true');
        document.head.appendChild(tag);
        injectedMetaElements.push(tag);
      }
      tag.setAttribute('content', content);
      return tag;
    };

    const injectRawMetaSyntax = (syntaxText: string | undefined) => {
      if (!syntaxText || !syntaxText.trim()) return false;
      const metaRegex = /<meta\s+([^>]+)>/gi;
      let match;
      let count = 0;
      while ((match = metaRegex.exec(syntaxText)) !== null) {
        const attrs = match[1];
        const nameMatch = attrs.match(/(?:name|property)\s*=\s*["']([^"']+)["']/i);
        const contentMatch = attrs.match(/content\s*=\s*["']([^"']+)["']/i);
        if (nameMatch && contentMatch) {
          const attrName = attrs.toLowerCase().includes('property=') ? 'property' : 'name';
          setMetaTag(attrName, nameMatch[1], contentMatch[1]);
          count++;
        }
      }
      return count > 0;
    };

    const toAbsoluteUrl = (url: string | undefined): string => {
      if (!url) return `${window.location.origin}/2bq Logo2.png`;
      if (url.startsWith('http://') || url.startsWith('https://')) return url;
      return `${window.location.origin}${url.startsWith('/') ? '' : '/'}${url}`;
    };

    // Open Graph (OG) Meta Tags
    const hasCustomOg = injectRawMetaSyntax((currentContext as any)?.ogMeta);
    if (!hasCustomOg) {
      setMetaTag('property', 'og:title', currentContext?.ogTitle || titleText);
      setMetaTag('property', 'og:description', currentContext?.ogDescription || descText);
      setMetaTag('property', 'og:image', toAbsoluteUrl(currentContext?.ogImage));
      setMetaTag('property', 'og:url', window.location.href);
      setMetaTag('property', 'og:type', currentContext?.ogType || 'website');
    }

    // Twitter Card Meta Tags
    const hasCustomTwitter = injectRawMetaSyntax((currentContext as any)?.twitterMeta);
    if (!hasCustomTwitter) {
      setMetaTag('name', 'twitter:card', currentContext?.twitterCard || 'summary_large_image');
      setMetaTag('name', 'twitter:title', currentContext?.twitterTitle || titleText);
      setMetaTag('name', 'twitter:description', currentContext?.twitterDescription || descText);
      setMetaTag('name', 'twitter:image', toAbsoluteUrl(currentContext?.twitterImage));
    }

    // JSON-LD Structured Data Schema Injection
    let scriptTag = document.getElementById('category-schema-jsonld') as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'category-schema-jsonld';
      scriptTag.setAttribute('type', 'application/ld+json');
      document.head.appendChild(scriptTag);
    }

    if (currentContext?.seoSchema) {
      scriptTag.textContent = currentContext.seoSchema;
    } else {
      const defaultSchema = {
        "@context": "https://schema.org/",
        "@type": "CollectionPage",
        "name": displayTitle,
        "description": descText,
        "url": window.location.href
      };
      scriptTag.textContent = JSON.stringify(defaultSchema);
    }

    return () => {
      document.title = originalTitle;
      if (metaDesc) metaDesc.setAttribute('content', oldDesc);
      if (metaKeywords) metaKeywords.setAttribute('content', oldKeywords);
      if (scriptTag) scriptTag.remove();
      // Remove all dynamic injected meta tags to ensure clean head tag on navigation
      document.querySelectorAll('meta[data-dynamic-meta="true"]').forEach(el => el.remove());
    };
  }, [currentContext, displayTitle]);

  return (
    <div className="bg-surface-container-lowest text-on-surface antialiased selection:bg-primary selection:text-on-primary font-body-md text-body-md overflow-x-hidden min-h-screen">
      <Navbar onSearchProductSelect={(product) => setQuickViewProduct(product)} />

      <main>
        {/* ── Hero banner ─────────────────────────────────────────────────── */}
        {(() => {
          const categoryBannerRaw = (currentContext as any)?.banner || (currentContext as any)?.image || '';
          const categoryBannerUrl = categoryBannerRaw ? resolveImageUrl(categoryBannerRaw) : '';

          return (
            <section className={`w-full ${heroBannerData || categoryBannerUrl ? '' : 'bg-[#F5F5F0]'} py-8 md:py-14 min-h-[298px] md:min-h-[350px] px-outer-margin relative overflow-hidden flex items-center justify-center`}>
              {bannersLoading ? (
                <div className="absolute inset-0 w-full h-full animate-pulse bg-surface-container" />
              ) : heroBannerData ? (
                <div className="absolute inset-0 w-full h-full bg-black">
                  {(() => {
                    const rawUrl = heroBannerData.imageUrl ? heroBannerData.imageUrl.replace(/\\/g, '/') : '';
                    let mediaUrl = rawUrl.startsWith('http') ? rawUrl : `/${rawUrl.replace(/^\/+/, '')}`;

                    if (isMobile && heroBannerData.mobileImageUrl) {
                      const mobileRawUrl = heroBannerData.mobileImageUrl.replace(/\\/g, '/');
                      mediaUrl = mobileRawUrl.startsWith('http') ? mobileRawUrl : `/${mobileRawUrl.replace(/^\/+/, '')}`;
                    }

                    const isVideo = mediaUrl.match(/\.(mp4|webm|ogg|mov|m4v)(?:[?#].*)?$/i) || mediaUrl.includes('/video/upload/');

                    return isVideo ? (
                      <video
                        ref={(el) => {
                          if (el) {
                            el.defaultMuted = true;
                            el.muted = true;
                          }
                        }}
                        key={mediaUrl}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-[102%] h-[102%] object-cover object-center absolute -top-[1%] -left-[1%] max-w-none"
                      >
                        <source src={mediaUrl} type="video/mp4" />
                      </video>
                    ) : (
                      <img
                        alt={heroBannerData.title || displayTitle}
                        className="w-[102%] h-[102%] object-cover object-center absolute -top-[1%] -left-[1%] max-w-none"
                        src={mediaUrl}
                        loading="eager"
                        fetchPriority="high"
                        decoding="sync"
                      />
                    );
                  })()}
                  <div className="absolute inset-0 bg-black/40 pointer-events-none" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none z-10">
                    <p className="text-[9px] md:text-xs tracking-[0.35em] text-white/80 uppercase font-medium mb-1 md:mb-2 transition-all">
                      Category
                    </p>
                    <h1 className="font-display-lg text-white mb-2 uppercase text-3xl md:text-5xl drop-shadow-lg">
                      {heroBannerData.title || displayTitle}
                    </h1>
                    {heroBannerData.subtitle && (
                      <p className="font-body-md text-body-md text-white/90 max-w-xl drop-shadow">
                        {heroBannerData.subtitle}
                      </p>
                    )}
                  </div>
                </div>
              ) : categoryBannerUrl ? (
                <div className="absolute inset-0 w-full h-full bg-black">
                  <img
                    alt={displayTitle}
                    className="w-[102%] h-[102%] object-cover object-center absolute -top-[1%] -left-[1%] max-w-none"
                    src={categoryBannerUrl}
                    loading="eager"
                    fetchPriority="high"
                    decoding="sync"
                  />
                  <div className="absolute inset-0 bg-black/45 pointer-events-none" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none z-10">
                    <p className="text-[9px] md:text-xs tracking-[0.35em] text-white/80 uppercase font-medium mb-1 md:mb-2 transition-all">
                      Category Collection
                    </p>
                    <h1 className="font-display-lg text-white mb-2 uppercase text-3xl md:text-5xl drop-shadow-lg">
                      {displayTitle}
                    </h1>
                  </div>
                </div>
              ) : (
                <>
                  <div className="max-w-[1600px] mx-auto flex flex-col items-center justify-center text-center relative z-10 py-6">
                    <p className="text-[9px] md:text-xs tracking-[0.35em] text-secondary uppercase font-medium mb-1 md:mb-2 transition-all">
                      Category Collection
                    </p>
                    <h1 className="font-display-lg text-primary mb-2 uppercase text-2xl md:text-3xl">
                      {displayTitle}
                    </h1>
                    <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">
                      Effortless silhouettes for the modern woman.
                    </p>
                  </div>
                </>
              )}
            </section>
          );
        })()}

        {/* ── Category tab bar ────────────────────────────────────────────── */}
        <div className="w-full border-b border-outline-variant overflow-x-auto flex justify-center">
          <div className="flex items-center justify-center gap-0 min-w-max px-4 md:px-8">
            {categoriesLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="mx-3 h-3 w-16 bg-surface-container animate-pulse rounded my-2.5" />
              ))
            ) : (
              <>
                {/* Parent / All tab */}
                <button
                  onClick={() => {
                    navigate('/product-category/all');
                  }}
                  className={`px-5 py-2.5 text-[10px] tracking-[0.15em] uppercase border-b-2 transition-all whitespace-nowrap ${(!categoryParam || categoryParam.toLowerCase() === 'all') && !searchCategoryId
                      ? 'border-black text-black font-bold border-b-2'
                      : 'border-transparent text-secondary hover:text-primary font-medium'
                    }`}
                >
                  ALL PRODUCTS
                </button>

                {/* Subcategories / Siblings tabs */}
                {siblings.map((cat: Category) => {
                  const catId = String(cat.id || cat._id);
                  const isCatActive = currentContext
                    ? String(currentContext.id || currentContext._id) === catId || currentContext.name.toLowerCase() === cat.name.toLowerCase()
                    : (searchCategoryId ? searchCategoryId === catId : false);

                  const rawSlug = (cat as any).slug ? String((cat as any).slug).replace(/-\d+$/, '') : cat.name;
                  const catSlug = String(rawSlug).toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-');

                  return (
                    <button
                      key={catId}
                      onClick={() => navigate(`/product-category/${catSlug}`, { state: { category: catId, name: cat.name } })}
                      className={`px-5 py-2.5 text-[10px] tracking-[0.15em] uppercase border-b-2 transition-all whitespace-nowrap ${isCatActive
                          ? 'border-black text-black font-bold border-b-2'
                          : 'border-transparent text-secondary hover:text-primary font-medium'
                        }`}
                    >
                      {cat.name}
                    </button>
                  );
                })}
              </>
            )}
          </div>
        </div>

        {/* ── Filter / Sort bar ────────────────────────────────────────────── */}
        <div className="sticky top-[72px] z-40 bg-surface/90 backdrop-blur-md border-b border-outline-variant/30 py-2 sm:py-2.5 px-3 sm:px-outer-margin md:px-8 flex justify-between items-center gap-2 sm:gap-4">
          <div className="text-[7.5px] min-[380px]:text-[8.5px] sm:text-[9px] tracking-normal sm:tracking-[0.18em] font-medium text-secondary uppercase whitespace-nowrap shrink-0">
            {loading ? 'Loading…' : `Showing ${filteredAndSortedProducts.length} of ${total} products`}
          </div>
          <div className="flex items-center gap-2 sm:gap-4 font-label-caps text-label-caps text-primary relative shrink-0">
            {/* Filter Toggle */}
            <button
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center gap-1 hover:text-secondary transition-colors cursor-pointer text-[8px] sm:text-[9px] tracking-[0.1em] sm:tracking-[0.2em] font-bold text-primary uppercase"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="21" x2="4" y2="14"></line>
                <line x1="4" y1="10" x2="4" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12" y2="3"></line>
                <line x1="20" y1="21" x2="20" y2="16"></line>
                <line x1="20" y1="12" x2="20" y2="3"></line>
                <line x1="1" y1="14" x2="7" y2="14"></line>
                <line x1="9" y1="8" x2="15" y2="8"></line>
                <line x1="17" y1="16" x2="23" y2="16"></line>
              </svg>
              Filter
            </button>

            <span className="text-outline-variant/60 text-xs">•</span>

            {/* Mobile-only: 2 / 3 column toggle */}
            <div className="flex items-center gap-0.5 sm:hidden">
              <button
                onClick={() => setMobileGridCols(2)}
                title="2 Columns"
                className={`flex items-center justify-center w-7 h-7 rounded-md transition-colors ${mobileGridCols === 2
                    ? 'bg-outline-variant/30 text-primary'
                    : 'bg-outline-variant/10 text-secondary hover:bg-outline-variant/20 hover:text-primary'
                  }`}
              >
                <svg className="w-3 h-3" viewBox="0 0 14 14" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="2" width="4" height="10" rx="0.5" />
                  <rect x="8" y="2" width="4" height="10" rx="0.5" />
                </svg>
              </button>
              <button
                onClick={() => setMobileGridCols(3)}
                title="3 Columns"
                className={`flex items-center justify-center w-7 h-7 rounded-md transition-colors ${mobileGridCols === 3
                    ? 'bg-outline-variant/30 text-primary'
                    : 'bg-outline-variant/10 text-secondary hover:bg-outline-variant/20 hover:text-primary'
                  }`}
              >
                <svg className="w-3 h-3" viewBox="0 0 14 14" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <rect x="1.5" y="2" width="3" height="10" rx="0.5" />
                  <rect x="5.5" y="2" width="3" height="10" rx="0.5" />
                  <rect x="9.5" y="2" width="3" height="10" rx="0.5" />
                </svg>
              </button>
            </div>

            {/* Desktop: Grid / List Layout Switcher */}
            <div className="hidden sm:flex items-center gap-1 sm:gap-1.5">
              {/* List View */}
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-md transition-colors ${viewMode === 'list'
                  ? 'bg-outline-variant/30 text-primary'
                  : 'bg-outline-variant/10 text-secondary hover:bg-outline-variant/20 hover:text-primary'
                  }`}
                title="List View"
              >
                <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" viewBox="0 0 14 14" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <rect x="1" y="1.75" width="12" height="1.5" rx="0.5" />
                  <rect x="1" y="4.75" width="12" height="1.5" rx="0.5" />
                  <rect x="1" y="7.75" width="12" height="1.5" rx="0.5" />
                  <rect x="1" y="10.75" width="12" height="1.5" rx="0.5" />
                </svg>
              </button>
              {/* 3 Column Grid */}
              <button
                onClick={() => setViewMode('grid-3')}
                className={`flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-md transition-colors ${viewMode === 'grid-3'
                  ? 'bg-outline-variant/30 text-primary'
                  : 'bg-outline-variant/10 text-secondary hover:bg-outline-variant/20 hover:text-primary'
                  }`}
                title="3 Columns Grid"
              >
                <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" viewBox="0 0 14 14" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2.75" y="2" width="1.5" height="10" rx="0.5" />
                  <rect x="6.25" y="2" width="1.5" height="10" rx="0.5" />
                  <rect x="9.75" y="2" width="1.5" height="10" rx="0.5" />
                </svg>
              </button>
              {/* 4 Column Grid */}
              <button
                onClick={() => setViewMode('grid-4')}
                className={`flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-md transition-colors ${viewMode === 'grid-4'
                  ? 'bg-outline-variant/30 text-primary'
                  : 'bg-outline-variant/10 text-secondary hover:bg-outline-variant/20 hover:text-primary'
                  }`}
                title="4 Columns Grid"
              >
                <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" viewBox="0 0 14 14" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <rect x="1.75" y="2" width="1.5" height="10" rx="0.5" />
                  <rect x="4.75" y="2" width="1.5" height="10" rx="0.5" />
                  <rect x="7.75" y="2" width="1.5" height="10" rx="0.5" />
                  <rect x="10.75" y="2" width="1.5" height="10" rx="0.5" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* ── Product Display Section ──────────────────────────────────────── */}
        <section className="w-full px-1 md:px-2 pt-0 pb-4">
          {loading && (
            <div className="w-full flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-on-surface-variant font-body-md text-body-md">Loading products…</p>
            </div>
          )}

          {!loading && error && (
            <div className="w-full flex flex-col items-center justify-center py-24 gap-4 text-center px-4">
              <span className="material-symbols-outlined text-5xl text-on-surface-variant">error_outline</span>
              <p className="font-headline-sm text-primary">Could not load products</p>
              <p className="text-on-surface-variant font-body-md text-body-md max-w-sm">{error}</p>
            </div>
          )}

          {!loading && filteredAndSortedProducts.length === 0 && (
            <div className="w-full flex flex-col items-center justify-center py-24 gap-4 text-center px-4">
              <span className="material-symbols-outlined text-5xl text-on-surface-variant">inventory_2</span>
              <p className="font-headline-sm text-primary">No matching products found</p>
              <p className="text-on-surface-variant font-body-md text-body-md max-w-sm">
                Try adjusting your filters or category selections to find what you are looking for.
              </p>
            </div>
          )}

          {!loading && !error && filteredAndSortedProducts.length > 0 && (
            viewMode === 'list' ? (
              <div className="flex flex-col gap-4 max-w-4xl mx-auto px-4">
                {filteredAndSortedProducts.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    categorySlug={categorySlug}
                    viewMode="list"
                    isWishlisted={!!wishlistItems.find(item => item.name === p.name)}
                    onWishlistClick={handleWishlist}
                    onQuickViewClick={setQuickViewProduct}
                    onAddToCartClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      addToCart({ ...p, quantity: 1, selectedSize: 'S', selectedColor: 'Default' });
                      setIsCartOpen(true);
                    }}
                  />
                ))}
                {loadingMore && Array.from({ length: 2 }).map((_, i) => (
                  <div key={`skel-more-list-${i}`} className="w-full h-48 bg-surface-container animate-pulse rounded-sm" />
                ))}
              </div>
            ) : viewMode === 'grid-3' ? (
              <div className={`grid gap-1 md:gap-1.5 animate-fade-in ${mobileGridCols === 3 ? 'grid-cols-3' : 'grid-cols-2'
                } sm:grid-cols-3`}>
                {filteredAndSortedProducts.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    categorySlug={categorySlug}
                    viewMode="grid"
                    isWishlisted={!!wishlistItems.find(item => item.name === p.name)}
                    onWishlistClick={handleWishlist}
                    onQuickViewClick={setQuickViewProduct}
                    onAddToCartClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      addToCart({ ...p, quantity: 1, selectedSize: 'S', selectedColor: 'Default' });
                      setIsCartOpen(true);
                    }}
                  />
                ))}
                {loadingMore && Array.from({ length: 3 }).map((_, i) => (
                  <div key={`skel-more-grid3-${i}`} className="flex flex-col animate-pulse bg-surface-container aspect-[3/4]" />
                ))}
              </div>
            ) : (
              <div className={`grid gap-0.5 md:gap-1.5 animate-fade-in ${mobileGridCols === 3 ? 'grid-cols-3' : 'grid-cols-2'
                } sm:grid-cols-3 md:grid-cols-4`}>
                {filteredAndSortedProducts.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    categorySlug={categorySlug}
                    viewMode="grid"
                    isWishlisted={!!wishlistItems.find(item => item.name === p.name)}
                    onWishlistClick={handleWishlist}
                    onQuickViewClick={setQuickViewProduct}
                    onAddToCartClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      addToCart({ ...p, quantity: 1, selectedSize: 'S', selectedColor: 'Default' });
                      setIsCartOpen(true);
                    }}
                  />
                ))}
                {loadingMore && Array.from({ length: 4 }).map((_, i) => (
                  <div key={`skel-more-grid4-${i}`} className="flex flex-col animate-pulse bg-surface-container aspect-[3/4]" />
                ))}
              </div>
            )
          )}

          {!loading && !error && filteredAndSortedProducts.length > 0 && (
            <div className="w-full flex flex-col items-center justify-center my-6">
              {/* Invisible sentinel element for infinite scroll */}
              <div ref={infiniteScrollRef} className="h-10 w-full flex items-center justify-center">
                {loadingMore && (
                  <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-secondary uppercase animate-pulse">
                    <svg className="animate-spin h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    LOADING MORE PRODUCTS...
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      </main>

      {/* ── Filter Drawer Slider ────────────────────────────────────────── */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[105] transition-opacity duration-300 ${isFilterOpen ? 'opacity-100 animate-fade-in' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsFilterOpen(false)}
      />

      <div className={`fixed inset-y-0 left-0 w-full sm:w-[380px] bg-surface shadow-2xl z-[110] flex flex-col transform transition-transform duration-300 ease-in-out ${isFilterOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex justify-between items-center p-6 border-b border-outline-variant">
          <div className="flex items-center gap-2 text-primary">
            <span className="material-symbols-outlined text-[18px]">tune</span>
            <h2 className="font-label-caps text-[11px] tracking-widest font-bold uppercase">FILTERS</h2>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsFilterOpen(false)}
              className="w-8 h-8 flex items-center justify-center border border-outline-variant border-dashed text-primary hover:border-primary transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Sort By section */}
          <div>
            <h3 className="font-label-caps text-[10px] tracking-widest text-secondary uppercase font-bold mb-3">Sort By</h3>
            <div className="flex flex-col gap-2">
              {['FEATURED', 'NEWEST', 'PRICE: LOW TO HIGH', 'PRICE: HIGH TO LOW'].map(opt => {
                const isSelected = currentSort === opt;
                return (
                  <button
                    key={opt}
                    onClick={() => setCurrentSort(opt)}
                    className={`text-left text-xs uppercase tracking-wider py-1.5 px-3 border transition-colors flex items-center justify-between cursor-pointer ${isSelected
                      ? 'border-primary bg-primary text-on-primary font-bold'
                      : 'border-outline-variant text-secondary hover:border-primary hover:text-primary'
                      }`}
                  >
                    {opt}
                    {isSelected && (
                      <span className="material-symbols-outlined text-[14px]">check</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {siblings.length > 0 && (
            <div>
              <h3 className="font-label-caps text-[10px] tracking-widest text-secondary uppercase font-bold mb-3">Categories</h3>
              <div className="flex flex-col gap-2">
                {siblings.map((cat: Category) => {
                  const catId = String(cat.id || cat._id);
                  return (
                    <button
                      key={catId}
                      onClick={() => {
                        const rawSlug = (cat as any).slug ? String((cat as any).slug).replace(/-\d+$/, '') : cat.name;
                        const catSlug = String(rawSlug).toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-');
                        navigate(`/product-category/${catSlug}`, { state: { category: catId, name: cat.name } });
                        setIsFilterOpen(false);
                      }}
                      className={`text-left text-xs uppercase tracking-wider py-1 hover:text-primary transition-colors cursor-pointer ${(categoryParam === catId || String(cat.name).toLowerCase() === String(categoryParam).toLowerCase()) ? 'text-primary font-bold border-l-2 border-primary pl-2' : 'text-secondary pl-2'}`}
                    >
                      {cat.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div>
            <h3 className="font-label-caps text-[10px] tracking-widest text-secondary uppercase font-bold mb-3">Sizes</h3>
            <div className="flex flex-wrap gap-2">
              {allSizes.map(size => {
                const isSelected = selectedSizes.includes(size);
                return (
                  <button
                    key={size}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedSizes(selectedSizes.filter(s => s !== size));
                      } else {
                        setSelectedSizes([...selectedSizes, size]);
                      }
                    }}
                    className={`min-w-[40px] h-10 px-3 border text-[10px] font-label-caps font-bold transition-all flex items-center justify-center cursor-pointer ${isSelected
                      ? 'border-primary bg-primary text-on-primary'
                      : 'border-outline-variant bg-surface text-secondary hover:border-primary hover:text-primary'
                      }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="font-label-caps text-[10px] tracking-widest text-secondary uppercase font-bold mb-4">Colors</h3>
            <div className="flex flex-wrap gap-3">
              {BASE_COLORS.map(color => {
                const isSelected = selectedColors.includes(color.name);
                return (
                  <button
                    key={color.name}
                    title={color.name}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedColors(selectedColors.filter(c => c !== color.name));
                      } else {
                        setSelectedColors([...selectedColors, color.name]);
                      }
                    }}
                    className={`w-7 h-7 rounded-full flex items-center justify-center cursor-pointer transition-all ${isSelected ? 'ring-2 ring-offset-2 ring-primary scale-110' : 'hover:scale-110'
                      } ${color.border ? 'border border-outline-variant/60' : 'border border-transparent'}`}
                    style={{ backgroundColor: color.hex }}
                  />
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="font-label-caps text-[10px] tracking-widest text-secondary uppercase font-bold mb-3">Price Range</h3>
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-secondary">{currencySymbol}</span>
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full border border-outline-variant bg-surface pl-6 pr-3 py-2 text-xs focus:outline-none focus:border-primary"
                />
              </div>
              <span className="text-secondary text-xs">-</span>
              <div className="flex-1 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-secondary">{currencySymbol}</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full border border-outline-variant bg-surface pl-6 pr-3 py-2 text-xs focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-outline-variant bg-surface mt-auto flex gap-4">
          <button
            onClick={() => {
              setSelectedSizes([]);
              setSelectedColors([]);
              setMinPrice('');
              setMaxPrice('');
              setCurrentSort('FEATURED');
              navigate('/product-category/all');
              setIsFilterOpen(false);
            }}
            className="w-1/2 py-4 border border-outline-variant text-secondary text-[10px] tracking-widest font-bold hover:text-red-600 hover:border-red-600 transition-colors uppercase font-label-caps cursor-pointer"
          >
            Reset
          </button>
          <button
            onClick={() => setIsFilterOpen(false)}
            className="w-1/2 py-4 bg-primary text-on-primary text-[10px] tracking-widest font-bold hover:bg-neutral-800 transition-colors uppercase font-label-caps cursor-pointer"
          >
            Apply Filters
          </button>
        </div>
      </div>

      {/* ── Category SEO & Description Guide (Above Footer) ───────────────── */}
      {(() => {
        const activeCat = currentContext || categoriesTree.find(c => String(c.id || c._id) === categoryParam || String(c.name).toLowerCase() === String(categoryParam).toLowerCase());

        const hasDesc = !!activeCat?.description;
        const validSections = activeCat?.descriptionSections?.filter(s => s.title?.trim() || s.content?.trim()) || [];
        const hasSections = validSections.length > 0;

        if (!activeCat || (!hasDesc && !hasSections)) return null;

        return (
          <section className="w-full bg-[#FDFDFD] border-t border-slate-200/60 py-12 md:py-16 px-6 md:px-12 mt-12">
            <div className="max-w-5xl mx-auto space-y-8">

              {/* Main Category Article Header */}
              {hasDesc && (
                <div className="space-y-3 max-w-3xl pb-2">
                  <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.25em] text-slate-400 uppercase">
                    <span className="w-2 h-2 rounded-full bg-slate-900 inline-block" />
                    <span>Catalog & Styling Journal</span>
                  </div>

                  <h2 className="text-2xl md:text-3xl font-serif font-medium text-slate-900 tracking-tight leading-snug">
                    About {activeCat.name}
                  </h2>

                  <div
                    className="text-sm md:text-base leading-[1.85] font-normal text-slate-600 space-y-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:text-primary [&_a]:underline"
                    dangerouslySetInnerHTML={{ __html: activeCat.description || '' }}
                  />
                </div>
              )}

              {/* Dynamic Description Sections: Always physically in DOM HTML for SEO/crawlers, hidden visually via CSS until Read More is clicked */}
              {hasSections && (
                <div className={`${isDescriptionExpanded ? 'grid' : 'hidden'} grid-cols-1 ${validSections.length > 1 ? 'md:grid-cols-2' : ''} gap-8 md:gap-12 ${hasDesc ? 'border-t border-slate-200/60 pt-8' : ''} transition-all duration-300`}>
                  {validSections.map((sec, idx) => (
                    <div key={idx} className="space-y-3">
                      {sec.title?.trim() && (
                        <div className="flex items-center gap-2.5">
                          <div className="w-1 h-4 bg-slate-900 rounded-full shrink-0" />
                          <h2 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight">
                            {sec.title}
                          </h2>
                        </div>
                      )}

                      {sec.content?.trim() && (
                        <div
                          className="text-sm text-slate-600 leading-[1.85] font-normal pl-3.5 space-y-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:text-primary [&_a]:underline"
                          dangerouslySetInnerHTML={{ __html: sec.content || '' }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Read More / Read Less Toggle Button */}
              {hasSections && (
                <div className="flex justify-start pt-1">
                  <button
                    type="button"
                    onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                    className="inline-flex items-center gap-1.5 text-xs md:text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors cursor-pointer group"
                  >
                    <span className="underline underline-offset-4 decoration-slate-300 group-hover:decoration-slate-900">
                      {isDescriptionExpanded ? `Read less about ${activeCat.name}` : `Read more about ${activeCat.name}`}
                    </span>
                    <span className="material-symbols-outlined text-[18px] transition-transform duration-300 group-hover:translate-y-0.5">
                      {isDescriptionExpanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
                    </span>
                  </button>
                </div>
              )}

            </div>
          </section>
        );
      })()}

      <Footer />

      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </div>
  );
}
