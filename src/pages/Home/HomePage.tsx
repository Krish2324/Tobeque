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

  // Fetch live featured products
  const [featuredLimit, setFeaturedLimit] = useState(10);
  const { products: featuredProducts, loading: featuredLoading, total: featuredTotal } = useProducts({
    status: 'published',
    featured: true,
    limit: featuredLimit,
  });

  // Fetch On Sale products (products flagged for this section)
  const { products: onSaleProducts, loading: onSaleLoading } = useProducts({
    status: 'published',
    isOnSaleSection: true,
    limit: 50,
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

  useEffect(() => {
    api.get('/api/banners')
      .then(res => {
        if (res.data.success && Array.isArray(res.data.banners)) {
          const activeBanners = res.data.banners.filter((b: any) => b.status);
          // Prefer home_slider over promo_top, or fallback to first
          const promo = activeBanners.find((b: any) => b.position === 'home_slider') ||
            activeBanners.find((b: any) => b.position === 'promo_top') ||
            activeBanners[0];
          if (promo) setHeroBannerData(promo);

          const bottomPromo = activeBanners.find((b: any) => b.position === 'promo_bottom');
          if (bottomPromo) setBottomBannerData(bottomPromo);
        }
      })
      .catch(() => { });
  }, []);

  // ── Season Collection Categories ───────────────────────────────────────────
  const [collectionItems, setCollectionItems] = useState<SeasonCollectionItem[]>([]);
  const [collectionLoading, setCollectionLoading] = useState(true);

  // Slider state
  const [sliderIndex, setSliderIndex] = useState(0);
  const [sliderTransition, setSliderTransition] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6);
  const [isPaused, setIsPaused] = useState(false);

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

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setVisibleCount(6);
      } else if (window.innerWidth >= 768) {
        setVisibleCount(4);
      } else {
        setVisibleCount(2);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (collectionItems.length <= visibleCount) return;
    if (isPaused) return;
    const interval = setInterval(() => {
      setSliderTransition(true);
      setSliderIndex((prev) => prev + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, [collectionItems.length, visibleCount, isPaused]);

  useEffect(() => {
    if (collectionItems.length === 0) return;
    if (sliderIndex >= collectionItems.length) {
      const timeout = setTimeout(() => {
        setSliderTransition(false);
        setSliderIndex(0);
      }, 500); // matches slide duration (500ms)
      return () => clearTimeout(timeout);
    }
  }, [sliderIndex, collectionItems.length]);

  const extendedCollectionItems = React.useMemo(() => {
    if (collectionItems.length === 0) return [];
    if (collectionItems.length <= visibleCount) return collectionItems;
    return [...collectionItems, ...collectionItems.slice(0, visibleCount)];
  }, [collectionItems, visibleCount]);

  const showSlider = collectionItems.length > visibleCount;

  const handleWishlist = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    const exists = wishlistItems.find((p) => p.name === product.name);
    if (exists) removeFromWishlist(product.name);
    else addToWishlist(product);
  };

  return (
    <div className="bg-background text-on-background font-body-md antialiased overflow-x-hidden">
      <Navbar onSearchProductSelect={(product) => setQuickViewProduct(product)} />

      <main>
        {/* ── Hero ───────────────────────────────────────────────────────────── */}
        <section className="relative w-full h-[50vh] md:h-[82.5vh] mb-4">
          <div className="w-full h-full relative overflow-hidden bg-surface-container">
            {(() => {
              const rawUrl = heroBannerData?.imageUrl ? heroBannerData.imageUrl.replace(/\\/g, '/') : '';
              const mediaUrl = rawUrl
                ? (rawUrl.startsWith('http') ? rawUrl : `/${rawUrl.replace(/^\/+/, '')}`)
                : heroBanner;
              const isVideo = mediaUrl.match(/\.(mp4|webm|ogg|mov|m4v)(?:[?#].*)?$/i) || mediaUrl.includes('/video/upload/');
              const titleText = heroBannerData?.title || "Cinematic fashion campaign showing a model in spring collection.";

              return isVideo ? (
                <video
                  key={mediaUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  poster={heroBanner}
                  className="w-full h-full object-cover object-top absolute inset-0"
                >
                  <source src={mediaUrl} type="video/mp4" />
                </video>
              ) : (
                <img
                  alt={titleText}
                  className="w-full h-full object-cover object-top absolute inset-0"
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
              {(heroBannerData?.linkUrl || heroBannerData?.title) && (
                <button
                  onClick={() => navigate(heroBannerData?.linkUrl || '/collection')}
                  className="px-8 py-3 bg-white text-black text-sm font-semibold tracking-widest uppercase hover:bg-black hover:text-white transition-colors duration-500 pointer-events-auto"
                >
                  Shop Now
                </button>
              )}
            </div>
          </div>
        </section>

        {/* ── Season Collection — Category Cards ────────────────────────────── */}
        <section className="w-full px-1 md:px-2 mb-8">
          {/* Editorial heading */}
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
            !showSlider ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-0.5 md:gap-[3px]">
                {collectionItems.map((item, idx) => {
                  const displayName = item.displayLabel || item.category?.name || 'Category';
                  const imageUrl = item.imageOverride || item.category?.image || item.category?.banner;
                  const fallbackUrl = PLACEHOLDER_IMAGES[idx % PLACEHOLDER_IMAGES.length];

                  return (
                    <button
                      key={item.id}
                      className="group relative aspect-[3/4] overflow-hidden bg-surface-container cursor-pointer border-none p-0 text-left w-full block"
                      onClick={() =>
                        navigate(`/collection?category=${item.categoryId}&name=${encodeURIComponent(displayName)}`)
                      }
                    >
                      {/* Background image */}
                      <img
                        src={imageUrl || fallbackUrl}
                        alt={displayName}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />

                      {/* Dark gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                      {/* Category name at bottom */}
                      <div className="absolute bottom-0 inset-x-0 p-3">
                        <p className="text-[11px] font-medium tracking-[0.15em] uppercase text-white truncate">
                          {displayName}
                        </p>
                        <p className="text-[9px] tracking-widest text-white/60 mt-0.5 uppercase flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          Shop Now
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path d="M2 5h6M6 3l2 2-2 2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div
                className="overflow-hidden w-full relative"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                <div
                  className="flex"
                  style={{
                    transform: `translateX(-${sliderIndex * (100 / visibleCount)}%)`,
                    transition: sliderTransition ? 'transform 500ms cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
                  }}
                >
                  {extendedCollectionItems.map((item, idx) => {
                    const displayName = item.displayLabel || item.category?.name || 'Category';
                    const imageUrl = item.imageOverride || item.category?.image || item.category?.banner;
                    const fallbackUrl = PLACEHOLDER_IMAGES[idx % PLACEHOLDER_IMAGES.length];

                    return (
                      <div
                        key={`${item.id}-${idx}`}
                        className="px-[1px] md:px-[1.5px] shrink-0"
                        style={{ width: `${100 / visibleCount}%` }}
                      >
                        <button
                          className="group relative w-full aspect-[3/4] overflow-hidden bg-surface-container cursor-pointer border-none p-0 text-left block"
                          onClick={() =>
                            navigate(`/collection?category=${item.categoryId}&name=${encodeURIComponent(displayName)}`)
                          }
                        >
                          {/* Background image */}
                          <img
                            src={imageUrl || fallbackUrl}
                            alt={displayName}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                          />

                          {/* Dark gradient overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                          {/* Category name at bottom */}
                          <div className="absolute bottom-0 inset-x-0 p-3">
                            <p className="text-[11px] font-medium tracking-[0.15em] uppercase text-white truncate">
                              {displayName}
                            </p>
                            <p className="text-[9px] tracking-widest text-white/60 mt-0.5 uppercase flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
                </div>
              </div>
            )) : (
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
          <section className="relative w-full h-[52vh] md:h-[86vh] mb-8 cursor-pointer" onClick={() => bottomBannerData.linkUrl && navigate(bottomBannerData.linkUrl)}>
            <div className="w-full h-full relative overflow-hidden bg-surface-container">
              {(() => {
                const rawUrl = bottomBannerData?.imageUrl ? bottomBannerData.imageUrl.replace(/\\/g, '/') : '';
                const mediaUrl = rawUrl.startsWith('http') ? rawUrl : `/${rawUrl.replace(/^\/+/, '')}`;
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
                {(bottomBannerData?.linkUrl || bottomBannerData?.title) && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(bottomBannerData?.linkUrl || '/collection');
                    }}
                    className="px-6 py-2.5 bg-white text-black text-xs font-semibold tracking-widest uppercase hover:bg-black hover:text-white transition-colors duration-500 pointer-events-auto"
                  >
                    Discover More
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
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M7.5 10L3.5 6l4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>

            {/* Slider track – full width, arrows overlay edges */}
            {onSaleLoading ? (
              <div className="flex gap-[3px] overflow-hidden">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="shrink-0 aspect-[2/3] bg-surface-container animate-pulse" style={{ width: 'calc((100% - 21px) / 8)' }} />
                ))}
              </div>
            ) : onSaleProducts.length > 0 ? (
              <div
                ref={onSaleScrollRef}
                className="flex gap-[3px] overflow-x-auto no-scrollbar select-none cursor-grab"
                style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}
                onMouseDown={onSaleMouseDown}
                onMouseMove={onSaleMouseMove}
                onMouseUp={onSaleMouseUp}
                onMouseLeave={onSaleMouseUp}
              >
                {onSaleProducts.map((p, idx) => (
                  <div
                    key={idx}
                    className="shrink-0"
                    style={{ width: 'calc((100% - 21px) / 8)', scrollSnapAlign: 'start' }}
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
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M4.5 2L8.5 6l-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        </section>
      </main>

      {/* ── Hot Right Now ─────────────────────────────────────────────────────── */}
      <section className="w-full px-2 mb-12">
        <div className="flex items-center justify-center gap-5 mb-5">
          <span className="flex-1 h-px bg-outline-variant max-w-[120px]" />
          <div className="text-center">
            <h2 className="text-[13px] tracking-[0.3em] font-light text-primary uppercase">See What's Trending</h2>
          </div>
          <span className="flex-1 h-px bg-outline-variant max-w-[120px]" />
        </div>

        {hotRightNowLoading ? (
          <div className="flex gap-[3px] overflow-hidden">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="shrink-0 aspect-[9/16] bg-surface-container animate-pulse" style={{ width: 'calc((100% - 12px) / 5)' }} />
            ))}
          </div>
        ) : hotRightNowProducts.length > 0 ? (
          <div className="flex gap-[3px] overflow-x-auto no-scrollbar" style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}>
            {hotRightNowProducts.map((p, idx) => {
              const mediaUrl = p.hotRightNowMedia || p.imageSrc;
              const isVid = mediaUrl && !!mediaUrl.match(/\.(mp4|webm|ogg|mov)(\?.*)?$/i);
              const oPriceVal = p.originalPrice ? parseFloat(p.originalPrice.replace(/[^0-9.]/g, '')) : 0;
              const priceVal = parseFloat(p.price.replace(/[^0-9.]/g, ''));
              const savePercent = oPriceVal && oPriceVal > priceVal ? Math.round((1 - priceVal / oPriceVal) * 100) : 0;

              return (
                <div key={idx} className="shrink-0 aspect-[9/16] relative group cursor-pointer overflow-hidden" style={{ width: 'calc((100% - 12px) / 5)', minWidth: '240px', scrollSnapAlign: 'start' }} onClick={() => navigate(`/product/${p.id}`)}>
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                  
                  <div className="absolute bottom-0 inset-x-0 p-4 pointer-events-none flex flex-col justify-end h-full">
                    <div className="flex gap-3 mt-auto pointer-events-auto items-end">
                      <img src={p.imageSrc} className="w-14 h-18 object-cover border border-white/20 rounded shadow-md shrink-0 bg-white" alt={p.name} />
                      <div className="flex flex-col text-left mb-1">
                        <h3 className="text-white text-xs font-semibold leading-tight line-clamp-2 mb-1">{p.name}</h3>
                        <p className="text-white/80 text-[10px] line-clamp-2 mb-1">{p.description}</p>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-white font-bold text-sm">{p.price}</span>
                          {p.originalPrice && <span className="text-white/60 line-through text-[10px]">{p.originalPrice}</span>}
                          {savePercent > 0 && (
                            <span className="text-emerald-400 font-bold text-[10px]">Save {savePercent}% off</span>
                          )}
                        </div>
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
