import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ProductCard, type Product } from "../../components/ProductCard";
import { useCart } from "../../context/CartContext";
import { useProducts } from "../../hooks/useProducts";
import { QuickViewModal } from "../../components/QuickViewModal/QuickViewModal";
import { Navbar } from "../../components/Navbar/Navbar";
import { Footer } from "../../components/Footer/Footer";
import api from "../../services/api";

import heroBanner from '../../assets/images/hero-spring-edit.jpg';

const PLACEHOLDER_IMAGES = [
  'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&q=80',
  'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80',
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80',
  'https://images.unsplash.com/photo-1509631179647-0c37cb5f0fc9?w=600&q=80',
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80',
  'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&q=80'
];

const isVideo = (url: string | undefined) => url && typeof url === 'string' && !!url.match(/\.(mp4|webm|ogg|mov|m4v)$/i);

const openInNewTab = (url: string | undefined) => {
  if (!url || !url.trim()) return;
  let finalUrl = url.trim();

  if (finalUrl.startsWith('http://') || finalUrl.startsWith('https://')) {
    // Full URL
  } else if (finalUrl.startsWith('www.')) {
    finalUrl = `https://${finalUrl}`;
  } else if (finalUrl.startsWith('/')) {
    finalUrl = `${window.location.origin}${finalUrl}`;
  } else {
    if (finalUrl.includes('.')) {
      finalUrl = `https://${finalUrl}`;
    } else {
      finalUrl = `${window.location.origin}/${finalUrl}`;
    }
  }

  window.open(finalUrl, '_blank', 'noopener,noreferrer');
};

interface SeasonCollectionItem {
  id: string;
  categoryId: string;
  displayLabel: string | null;
  sortOrder: number;
  imageOverride: string | null;
  category?: {
    name: string;
    slug: string;
    image: string | null;
    banner: string | null;
  };
}

export function HomePage() {
  const navigate = useNavigate();
  const { setIsCartOpen, addToWishlist, wishlistItems, removeFromWishlist, addToCart } = useCart();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch live featured products
  const [featuredLimit, setFeaturedLimit] = useState(10);
  const { products: featuredProducts, loading: featuredLoading } = useProducts({
    status: 'published',
    featured: true,
    limit: featuredLimit,
  });

  // Fetch On Sale products (products flagged for this section)
  const { products: onSaleProducts, loading: onSaleLoading } = useProducts({
    status: 'published',
    isOnSaleSection: true,
    limit: 15,
  });

  // Fetch Hot Right Now products
  const { products: hotRightNowProducts, loading: hotRightNowLoading } = useProducts({
    status: 'published',
    isHotRightNow: true,
    limit: 10,
  });

  // On Sale slider
  const onSaleScrollRef = useRef<HTMLDivElement>(null);
  const onSaleDragging = useRef(false);
  const onSaleDragStartX = useRef(0);
  const onSaleDragScrollLeft = useRef(0);

  const scrollOnSale = useCallback((dir: 'left' | 'right') => {
    if (!onSaleScrollRef.current) return;
    // Scroll exactly one card width
    const container = onSaleScrollRef.current;
    const firstCard = container.firstElementChild as HTMLElement | null;
    const cardWidth = firstCard ? firstCard.offsetWidth + 3 : container.offsetWidth / 8;
    container.scrollBy({ left: dir === 'right' ? cardWidth : -cardWidth, behavior: 'smooth' });
  }, []);

  const onSaleMouseDown = (e: React.MouseEvent) => {
    onSaleDragging.current = true;
    onSaleDragStartX.current = e.pageX - (onSaleScrollRef.current?.offsetLeft || 0);
    onSaleDragScrollLeft.current = onSaleScrollRef.current?.scrollLeft || 0;
    if (onSaleScrollRef.current) onSaleScrollRef.current.style.cursor = 'grabbing';
  };
  const onSaleMouseMove = (e: React.MouseEvent) => {
    if (!onSaleDragging.current || !onSaleScrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - (onSaleScrollRef.current.offsetLeft || 0);
    const walk = (x - onSaleDragStartX.current) * 1.5;
    onSaleScrollRef.current.scrollLeft = onSaleDragScrollLeft.current - walk;
  };
  const onSaleMouseUp = () => {
    onSaleDragging.current = false;
    if (onSaleScrollRef.current) onSaleScrollRef.current.style.cursor = 'grab';
  };

  // ── Hero Banner State ────────────────────────────────────────────────────
  const [heroBannerData, setHeroBannerData] = useState<any>(null);
  const [bottomBannerData, setBottomBannerData] = useState<any>(null);
  const [bannersLoading, setBannersLoading] = useState(true);

  useEffect(() => {
    api.get('/api/banners')
      .then(res => {
        if (res.data.success && Array.isArray(res.data.banners)) {
          const activeBanners = res.data.banners.filter((b: any) => b.status);
          const promo = activeBanners.find((b: any) => b.position === 'home_slider') ||
            activeBanners.find((b: any) => b.position === 'promo_top') ||
            activeBanners[0];
          if (promo) setHeroBannerData(promo);

          const bottomPromo = activeBanners.find((b: any) => b.position === 'promo_bottom');
          if (bottomPromo) setBottomBannerData(bottomPromo);
        }
      })
      .catch(() => { })
      .finally(() => setBannersLoading(false));
  }, []);

  // ── Season Collection Categories ───────────────────────────────────────────
  const [collectionItems, setCollectionItems] = useState<SeasonCollectionItem[]>([]);
  const [collectionLoading, setCollectionLoading] = useState(true);

  useEffect(() => {
    api.get('/api/season-collection')
      .then(res => {
        if (res.data.success && Array.isArray(res.data.data)) {
          setCollectionItems(res.data.data);
        }
      })
      .catch(() => { })
      .finally(() => setCollectionLoading(false));
  }, []);

  // Season Collection slider drag state
  const collectionScrollRef = useRef<HTMLDivElement>(null);
  const collectionDragging = useRef(false);
  const collectionIsDragging = useRef(false);
  const collectionDragStartX = useRef(0);
  const collectionDragScrollLeft = useRef(0);

  const collectionMouseDown = (e: React.MouseEvent) => {
    collectionDragging.current = true;
    collectionIsDragging.current = false;
    collectionDragStartX.current = e.pageX - (collectionScrollRef.current?.offsetLeft || 0);
    collectionDragScrollLeft.current = collectionScrollRef.current?.scrollLeft || 0;
    if (collectionScrollRef.current) collectionScrollRef.current.style.cursor = 'grabbing';
  };
  const collectionMouseMove = (e: React.MouseEvent) => {
    if (!collectionDragging.current || !collectionScrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - (collectionScrollRef.current.offsetLeft || 0);
    const walk = (x - collectionDragStartX.current) * 1.5;
    if (Math.abs(walk) > 5) {
      collectionIsDragging.current = true;
    }
    collectionScrollRef.current.scrollLeft = collectionDragScrollLeft.current - walk;
  };
  const collectionMouseUp = () => {
    collectionDragging.current = false;
    if (collectionScrollRef.current) collectionScrollRef.current.style.cursor = 'grab';
  };

  // Season Collection continuous infinite auto-scroll (Safari & cross-browser compatible)
  const animationRef = useRef<number>(0);

  useEffect(() => {
    if (!collectionScrollRef.current || collectionItems.length <= 1) return;
    const container = collectionScrollRef.current;
    let scrollPos = container.scrollLeft;
    const scrollSpeed = 0.6; // pixels per frame

    const animate = () => {
      if (!collectionDragging.current && container) {
        scrollPos += scrollSpeed;

        // Since items are rendered 3 times, one set width is scrollWidth / 3
        const oneSetWidth = container.scrollWidth / 3;

        if (oneSetWidth > 0) {
          if (scrollPos >= oneSetWidth) {
            scrollPos -= oneSetWidth;
          }
          container.scrollLeft = Math.floor(scrollPos);
        }
      } else if (container) {
        // Sync accumulator with manual drag/touch scroll
        scrollPos = container.scrollLeft;
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [collectionItems]);

  const handleWishlist = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    const exists = wishlistItems.find((p) => (p.id && product.id && String(p.id) === String(product.id)) || p.name === product.name);
    if (exists) removeFromWishlist(product.id || product.name);
    else addToWishlist(product);
  };

  const heroBannerTarget = heroBannerData?.bannerLink || heroBannerData?.linkUrl;

  return (
    <div className="bg-background text-on-background font-body-md antialiased overflow-x-hidden">
      <Navbar onSearchProductSelect={(product) => setQuickViewProduct(product)} />

      <main>
        {/* ── Hero ───────────────────────────────────────────────────────────── */}
        <section
          className={`relative w-full h-[90vh] md:h-[92.5vh] mb-4 ${heroBannerTarget ? 'cursor-pointer' : ''}`}
          onClick={() => {
            if (heroBannerTarget) {
              openInNewTab(heroBannerTarget);
            }
          }}
        >
          <div className="w-full h-full relative overflow-hidden bg-black">
            {bannersLoading ? (
              <div className="w-full h-full bg-black animate-pulse absolute inset-0" />
            ) : (() => {
              const rawUrl = heroBannerData?.imageUrl ? heroBannerData.imageUrl.replace(/\\/g, '/') : '';
              let mediaUrl = rawUrl
                ? (rawUrl.startsWith('http') ? rawUrl : `/${rawUrl.replace(/^\/+/, '')}`)
                : heroBanner;
              
              if (isMobile && heroBannerData?.mobileImageUrl) {
                 const mobileRawUrl = heroBannerData.mobileImageUrl.replace(/\\/g, '/');
                 mediaUrl = mobileRawUrl.startsWith('http') ? mobileRawUrl : `/${mobileRawUrl.replace(/^\/+/, '')}`;
              }

              const isVideoContent = isVideo(mediaUrl);
              const titleText = heroBannerData?.title || "Cinematic fashion campaign showing a model in spring collection.";

              return isVideoContent ? (
                <video
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
                  alt={titleText}
                  className="w-[102%] h-[102%] object-cover object-center absolute -top-[1%] -left-[1%] max-w-none"
                  src={mediaUrl}
                />
              );
            })()}
            <div className="absolute inset-0 bg-primary/30 mix-blend-multiply pointer-events-none" />

            {/* Overlay Text Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none">
              {heroBannerData?.title && (
                <h1 className="text-4xl md:text-6xl font-light text-white mb-4 tracking-widest drop-shadow-lg pointer-events-auto">
                  {heroBannerData.title}
                </h1>
              )}
              {heroBannerData?.subtitle && (
                <p className="text-sm md:text-lg text-white/90 mb-8 max-w-2xl font-light tracking-wide drop-shadow pointer-events-auto">
                  {heroBannerData.subtitle}
                </p>
              )}
              {heroBannerData?.linkUrl && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const btnTarget = heroBannerData.linkUrl;
                    if (btnTarget.startsWith('http://') || btnTarget.startsWith('https://') || btnTarget.startsWith('www.')) {
                      openInNewTab(btnTarget);
                    } else {
                      navigate(btnTarget);
                    }
                  }}
                  className="px-8 py-3 bg-white text-black text-sm font-semibold tracking-widest uppercase hover:bg-black hover:text-white transition-colors duration-500 pointer-events-auto cursor-pointer"
                >
                  Shop Now
                </button>
              )}
            </div>
          </div>
        </section>

        {/* ── Season Collection — Category Cards ────────────────────────────── */}
        <section className="w-full px-1 md:px-2 mb-8">
          <div className="flex items-center justify-center gap-5 mb-5">
            <span className="flex-1 h-px bg-gradient-to-r from-transparent to-outline-variant max-w-[120px]" />
            <div className="text-center">
              <p className="text-[9px] tracking-[0.35em] text-secondary uppercase font-medium mb-0.5">
                Shop By
              </p>
              <h2 className="text-[13px] tracking-[0.3em] font-light text-primary uppercase">
                Season Collection
              </h2>
            </div>
            <span className="flex-1 h-px bg-gradient-to-l from-transparent to-outline-variant max-w-[120px]" />
          </div>

          {/* Category Cards slider / grid */}
          {collectionLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-0.5 md:gap-[3px] animate-pulse">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-surface-container rounded" />
              ))}
            </div>
          ) : collectionItems.length > 0 ? (
            <div
              ref={collectionScrollRef}
              className="flex gap-[3px] overflow-x-auto no-scrollbar select-none cursor-grab"
              style={{ WebkitOverflowScrolling: 'touch' }}
              onMouseDown={collectionMouseDown}
              onMouseMove={collectionMouseMove}
              onMouseUp={collectionMouseUp}
              onMouseLeave={collectionMouseUp}
              onTouchStart={() => { collectionDragging.current = true; }}
              onTouchEnd={() => { collectionDragging.current = false; }}
              onTouchCancel={() => { collectionDragging.current = false; }}
            >
              {[...collectionItems, ...collectionItems, ...collectionItems].map((item, idx) => {
                const displayName = item.displayLabel || item.category?.name || 'Category';
                const imageUrl = item.imageOverride || item.category?.image || item.category?.banner;
                const fallbackUrl = PLACEHOLDER_IMAGES[idx % PLACEHOLDER_IMAGES.length];

                return (
                  <div
                    key={`${item.id}-${idx}`}
                    className="shrink-0 aspect-[3/4] w-[calc((100%-6px)/2.5)] sm:w-[calc((100%-9px)/3.5)] md:w-[calc((100%-15px)/6)]"
                  >
                    <button
                      className="group relative w-full h-full overflow-hidden bg-surface-container cursor-pointer border-none p-0 text-left block rounded"
                      onClick={(e) => {
                        if (collectionIsDragging.current) {
                          e.preventDefault();
                          e.stopPropagation();
                          return;
                        }
                        const catId = (item.category as any)?.id || (item.category as any)?._id || (item as any).categoryId;
                        const catName = item.category?.name || item.displayLabel || 'Category';
                        const rawSlug = item.category?.slug ? String(item.category.slug).replace(/-\d+$/, '') : catName;
                        const catSlug = String(rawSlug).toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-');
                        const targetUrl = catId 
                          ? `/product-category/${catSlug}?category=${catId}&name=${encodeURIComponent(catName)}`
                          : `/product-category/${catSlug}`;
                        navigate(targetUrl);
                      }}
                    >
                      {/* Background image */}
                      <img
                        draggable={false}
                        src={imageUrl || fallbackUrl}
                        alt={displayName}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 select-none"
                      />

                      {/* Dark gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                      {/* Category name at bottom */}
                      <div className="absolute bottom-0 inset-x-0 p-3 pointer-events-none">
                        <p className="text-[11px] font-medium tracking-[0.15em] uppercase text-white truncate drop-shadow-md">
                          {displayName}
                        </p>
                        <p className="text-[9px] tracking-widest text-white/80 mt-0.5 uppercase flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-md">
                          Shop Now
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path d="M2 5h6M6 3l2 2-2 2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </p>
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>) : (
            <div className="text-center py-10">
              <p className="text-secondary text-sm">Season Collection is empty. Configure it from the Admin Panel.</p>
            </div>
          )}
        </section>

        {/* ── Featured Products ─────────────────────────────────────────────── */}
        <section className="w-full px-1 md:px-2 mb-6 md:mb-8">
          <div className="flex items-center justify-center gap-5 mb-4">
            <span className="flex-1 h-px bg-gradient-to-r from-transparent to-outline-variant max-w-[120px]" />
            <div className="text-center">
              <p className="text-[9px] tracking-[0.35em] text-secondary uppercase font-medium mb-0.5">Hand-picked</p>
              <h2 className="text-[13px] tracking-[0.3em] font-light text-primary uppercase">Featured Picks</h2>
            </div>
            <span className="flex-1 h-px bg-gradient-to-l from-transparent to-outline-variant max-w-[120px]" />
          </div>

          {featuredLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-1 md:gap-1.5">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-surface-container animate-pulse rounded" />
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-1 md:gap-1.5">
              {featuredProducts.map((p, idx) => (
                <ProductCard
                  key={idx}
                  product={p}
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
            </div>
          ) : (
            <div className="w-full flex flex-col items-center justify-center py-16 gap-3 text-center">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant">inventory_2</span>
              <p className="text-on-surface-variant font-body-md text-body-md">
                No featured products yet — add some from the admin panel!
              </p>
            </div>
          )}

          {/* Load More Button */}
          {featuredProducts.length > 0 && (
            <div className="flex justify-center mt-6">
              {featuredProducts.length >= featuredLimit ? (
                <button
                  onClick={() => setFeaturedLimit(prev => prev + 10)}
                  disabled={featuredLoading}
                  className="px-6 py-2.5 border border-outline-variant/30 text-primary hover:bg-primary hover:text-on-primary transition-colors text-xs font-semibold tracking-widest uppercase disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {featuredLoading ? 'Loading...' : 'Load more'}
                </button>
              ) : (
                <p className="text-xs text-secondary font-medium tracking-wider uppercase">
                  All {featuredProducts.length} featured products loaded
                </p>
              )}
            </div>
          )}
        </section>

        {/* ── Home Bottom Banner ───────────────────────────────────────────── */}
        {bottomBannerData && (
          <section
            className={`relative w-full h-[52vh] md:h-[86vh] mb-8 ${bottomBannerData?.bannerLink ? 'cursor-pointer' : ''}`}
            onClick={() => {
              if (bottomBannerData?.bannerLink) {
                openInNewTab(bottomBannerData.bannerLink);
              }
            }}
          >
            <div className="w-full h-full relative overflow-hidden bg-surface-container">
              {(() => {
                const rawUrl = bottomBannerData?.imageUrl ? bottomBannerData.imageUrl.replace(/\\/g, '/') : '';
                let mediaUrl = rawUrl.startsWith('http') ? rawUrl : `/${rawUrl.replace(/^\/+/, '')}`;
                
                if (isMobile && bottomBannerData?.mobileImageUrl) {
                   const mobileRawUrl = bottomBannerData.mobileImageUrl.replace(/\\/g, '/');
                   mediaUrl = mobileRawUrl.startsWith('http') ? mobileRawUrl : `/${mobileRawUrl.replace(/^\/+/, '')}`;
                }

                const isVideo = mediaUrl.match(/\.(mp4|webm|ogg|mov|m4v)(?:[?#].*)?$/i) || mediaUrl.includes('/video/upload/');
                const titleText = bottomBannerData?.title || "Bottom Banner";

                return isVideo ? (
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover absolute inset-0"
                  >
                    <source src={mediaUrl} type="video/mp4" />
                  </video>
                ) : (
                  <img
                    alt={titleText}
                    className="w-full h-full object-cover absolute inset-0"
                    src={mediaUrl}
                  />
                );
              })()}
              <div className="absolute inset-0 bg-primary/20 mix-blend-multiply pointer-events-none" />

              {/* Overlay Text Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-gradient-to-t from-black/50 via-transparent to-black/10 pointer-events-none">
                {bottomBannerData?.title && (
                  <h2 className="text-3xl md:text-5xl font-light text-white mb-2 tracking-widest drop-shadow-lg pointer-events-auto">
                    {bottomBannerData.title}
                  </h2>
                )}
                {bottomBannerData?.subtitle && (
                  <p className="text-xs md:text-base text-white/90 mb-6 max-w-2xl font-light tracking-wide drop-shadow pointer-events-auto">
                    {bottomBannerData.subtitle}
                  </p>
                )}
                {bottomBannerData?.linkUrl && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const btnTarget = bottomBannerData.linkUrl;
                      if (btnTarget.startsWith('http://') || btnTarget.startsWith('https://') || btnTarget.startsWith('www.')) {
                        openInNewTab(btnTarget);
                      } else {
                        navigate(btnTarget);
                      }
                    }}
                    className="px-6 py-2.5 bg-white text-black text-xs font-semibold tracking-widest uppercase hover:bg-black hover:text-white transition-colors duration-500 pointer-events-auto cursor-pointer"
                  >
                    Shop Now
                  </button>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ── On Sale ─────────────────────────────────────────────────────── */}
        <section className="w-full px-2 mb-12">
          {/* Section Heading – centered with lines, no arrows */}
          <div className="flex items-center justify-center gap-5 mb-5">
            <span className="flex-1 h-px bg-outline-variant max-w-[120px]" />
            <div className="text-center">
              <h2 className="text-[13px] tracking-[0.3em] font-light text-primary uppercase">On Sale</h2>
            </div>
            <span className="flex-1 h-px bg-outline-variant max-w-[120px]" />
          </div>

          {/* Slider with left/right flanking arrow buttons */}
          <div className="relative">
            {/* Left Arrow – overlaps slider edge */}
            <button
              onClick={() => scrollOnSale('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-6 h-10 flex items-center justify-center bg-white/90 backdrop-blur-sm border border-outline-variant/30 shadow text-primary hover:bg-primary hover:text-on-primary transition-all duration-200"
              aria-label="Scroll left"
            >
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M7.5 10L3.5 6l4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>

            {/* Slider track – full width, arrows overlay edges */}
            {onSaleLoading ? (
              <div className="flex gap-[3px] overflow-hidden">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="shrink-0 aspect-[2/3] bg-surface-container animate-pulse w-[calc((100%-6px)/3)] md:w-[calc((100%-21px)/8)]" />
                ))}
              </div>
            ) : onSaleProducts.length > 0 ? (
              <div
                ref={onSaleScrollRef}
                className="flex gap-[3px] overflow-x-auto no-scrollbar select-none cursor-grab py-4"
                style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}
                onMouseDown={onSaleMouseDown}
                onMouseMove={onSaleMouseMove}
                onMouseUp={onSaleMouseUp}
                onMouseLeave={onSaleMouseUp}
              >
                {onSaleProducts.map((p, idx) => (
                  <div
                    key={idx}
                    className="shrink-0 w-[calc((100%-6px)/3)] md:w-[calc((100%-21px)/8)]"
                    style={{ scrollSnapAlign: 'start' }}
                  >
                    <ProductCard
                      product={p}
                      compact={true}
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
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 w-full">
                <p className="text-secondary text-sm">No on-sale products found. Add a discount price to any product in the Admin Panel.</p>
              </div>
            )}

            {/* Right Arrow – overlaps slider edge */}
            <button
              onClick={() => scrollOnSale('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-6 h-10 flex items-center justify-center bg-white/90 backdrop-blur-sm border border-outline-variant/30 shadow text-primary hover:bg-primary hover:text-on-primary transition-all duration-200"
              aria-label="Scroll right"
            >
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M4.5 2L8.5 6l-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </div>
        </section>
      </main>

      {/* ── Hot Right Now ─────────────────────────────────────────────────────── */}
      <section className="w-full px-1.5 mb-12">
        <div className="flex items-center justify-center gap-5 mb-5">
          <span className="flex-1 h-px bg-outline-variant max-w-[120px]" />
          <div className="text-center">
            <h2 className="text-[13px] tracking-[0.3em] font-light text-primary uppercase">See What's Trending</h2>
          </div>
          <span className="flex-1 h-px bg-outline-variant max-w-[120px]" />
        </div>

        {hotRightNowLoading ? (
          <div className="flex gap-1.5 sm:gap-[3px] overflow-hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="shrink-0 w-[calc((100%-6px)/2)] sm:w-[calc((100%-12px)/5)] aspect-[9/16] bg-surface-container animate-pulse rounded-none" />
            ))}
          </div>
        ) : hotRightNowProducts.length > 0 ? (
          <div className="flex gap-1.5 sm:gap-[3px] overflow-x-auto no-scrollbar py-1" style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}>
            {hotRightNowProducts.map((p, idx) => {
              const mediaUrl = p.hotRightNowMedia || p.imageSrc;
              const isVid = mediaUrl && !!mediaUrl.match(/\.(mp4|webm|ogg|mov)(\?.*)?$/i);
              const oPriceVal = p.originalPrice ? parseFloat(p.originalPrice.replace(/[^0-9.]/g, '')) : 0;
              const priceVal = parseFloat(p.price.replace(/[^0-9.]/g, ''));
              const savePercent = oPriceVal && oPriceVal > priceVal ? Math.round((1 - priceVal / oPriceVal) * 100) : 0;

              return (
                <div
                  key={idx}
                  className="shrink-0 w-[calc((100%-6px)/2)] sm:w-[calc((100%-12px)/5)] aspect-[9/16] relative group cursor-pointer overflow-hidden rounded-none shadow-sm"
                  style={{ scrollSnapAlign: 'start' }}
                  onClick={() => navigate(`/product-category/${p.categorySlug || 'all'}/${p.slug || p.id}`)}
                >
                  {isVid ? (
                    <video
                      src={mediaUrl}
                      autoPlay loop muted playsInline
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  ) : (
                    <img
                      src={mediaUrl}
                      alt={p.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

                  <div className="absolute bottom-0 inset-x-0 p-2.5 sm:p-4 pointer-events-none flex flex-col justify-end h-full">
                    <div className="flex gap-2 sm:gap-3 mt-auto pointer-events-auto items-end">
                      <img src={p.imageSrc} className="w-12 h-16 sm:w-14 sm:h-18 object-cover border border-white/30 rounded-md shadow-md shrink-0 bg-white" alt={p.name} />
                      <div className="flex flex-col text-left mb-0.5 sm:mb-1 min-w-0">
                        <h3 className="text-white text-xs font-semibold leading-tight line-clamp-2 mb-0.5">{p.name}</h3>
                        <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                          <span className="text-white font-bold text-xs sm:text-sm">{p.price}</span>
                          {p.originalPrice && <span className="text-white/60 line-through text-[10px] sm:text-[11px]">{p.originalPrice}</span>}
                        </div>
                        {savePercent > 0 && (
                          <span className="text-emerald-400 font-bold text-[10px] sm:text-[11px] whitespace-nowrap mt-0.5 block">Save {savePercent}% off</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-10 w-full">
            <p className="text-secondary text-sm">No trending products found. Flag products as "Hot Right Now" in the Admin Panel.</p>
          </div>
        )}
      </section>

      <Footer />

      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </div>
  );
}
