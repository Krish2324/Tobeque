import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ProductCard, type Product } from "../../components/ProductCard";
import { useCart } from "../../context/CartContext";
import { useProducts, resolveImageUrl } from "../../hooks/useProducts";
import { QuickViewModal } from "../../components/QuickViewModal/QuickViewModal";
import { Navbar } from "../../components/Navbar/Navbar";
import { Footer } from "../../components/Footer/Footer";
import api from "../../services/api";

import heroBanner from '../../assets/images/hero-spring-edit.jpg';

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
    document.title = "Tobeque | Clothes for Teenagers & Aesthetic Outfits for Teens";

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', 'Explore clothes for teenagers at Tobeque, featuring stylish everyday pieces and aesthetic outfits for teens designed for comfort, confidence, and modern looks.');

    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', 'clothes for teenager, aesthetic outfits for teens, outfits for teens, clothes for teenage girls, aesthetic clothes for girls, trendy teen outfits');

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
              const rawUrl = heroBannerData?.imageUrl || '';
              let mediaUrl = rawUrl ? resolveImageUrl(rawUrl) : heroBanner;
              
              if (isMobile && heroBannerData?.mobileImageUrl) {
                 mediaUrl = resolveImageUrl(heroBannerData.mobileImageUrl);
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
                  loading="eager"
                  fetchPriority="high"
                  decoding="sync"
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
              <h1 className="text-[13px] tracking-[0.3em] font-light text-primary uppercase">
                Category
              </h1>
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
          ) : (() => {
            const validItems = collectionItems.filter((item) => {
              const rawImg = item.imageOverride || item.category?.image || item.category?.banner;
              return !!(rawImg && String(rawImg).trim());
            });

            if (validItems.length === 0) {
              return (
                <div className="text-center py-10">
                  <p className="text-secondary text-sm">Season Collection is empty. Configure it from the Admin Panel.</p>
                </div>
              );
            }

            const itemsToLoop = validItems.length >= 3 ? [...validItems, ...validItems, ...validItems] : validItems;

            return (
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
                {itemsToLoop.map((item, idx) => {
                  const displayName = item.displayLabel || item.category?.name || 'Category';
                  const rawImageUrl = item.imageOverride || item.category?.image || item.category?.banner;
                  const resolvedImg = resolveImageUrl(rawImageUrl);

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
                          navigate(`/product-category/${catSlug}`, { state: { category: catId, name: catName } });
                        }}
                      >
                        {/* Background image */}
                        {resolvedImg && (
                          <img
                            draggable={false}
                            src={resolvedImg}
                            alt={displayName}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 select-none"
                            loading="lazy"
                            decoding="async"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        )}

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
              </div>
            );
          })()}
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

          {/* Initial load skeleton — only shown before we have any products */}
          {featuredLoading && featuredProducts.length === 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-1 md:gap-1.5">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-surface-container animate-pulse rounded" />
              ))}
            </div>
          )}

          {/* Product grid — stays mounted during Load More to prevent flicker */}
          {featuredProducts.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-1 md:gap-1.5">
              {featuredProducts.map((p) => (
                <ProductCard
                  key={p.id}
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
              {/* Append skeleton slots for the next batch while loading more */}
              {featuredLoading && Array.from({ length: 10 }).map((_, i) => (
                <div key={`skel-more-${i}`} className="aspect-[3/4] bg-surface-container animate-pulse rounded" />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!featuredLoading && featuredProducts.length === 0 && (
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
                const rawUrl = bottomBannerData?.imageUrl || '';
                let mediaUrl = rawUrl ? resolveImageUrl(rawUrl) : '';
                
                if (isMobile && bottomBannerData?.mobileImageUrl) {
                   mediaUrl = resolveImageUrl(bottomBannerData.mobileImageUrl);
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
                    loading="lazy"
                    decoding="async"
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
                      loading="lazy"
                      decoding="async"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

                  <div className="absolute bottom-0 inset-x-0 p-2.5 sm:p-4 pointer-events-none flex flex-col justify-end h-full">
                    <div className="flex gap-2 sm:gap-3 mt-auto pointer-events-auto items-end">
                      <img src={p.imageSrc} className="w-12 h-16 sm:w-14 sm:h-18 object-cover border border-white/30 rounded-md shadow-md shrink-0 bg-white" alt={p.name} loading="lazy" decoding="async" />
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

      {/* ── SEO Rich Content Section ─────────────────────────────────────────────── */}
      <HomeSeoSection />

      <Footer />

      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </div>
  );
}

function HomeSeoSection() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  const faqs = [
    {
      q: "1. What clothes are popular with teenage girls?",
      a: "Popular clothes for teenage girls include co-ord sets, oversized tops, crop tops, casual dresses, wide-leg trousers, Y2K-inspired pieces, and versatile streetwear that suits different occasions."
    },
    {
      q: "2. How should teenage girls choose the right outfit?",
      a: "Teenage girls should choose outfits based on comfort, personal style, fit, occasion, and fabric. Versatile pieces that can be mixed, layered, and restyled provide greater everyday value."
    },
    {
      q: "3. What fabrics are best for teenage clothing?",
      a: "Cotton, cotton blends, rayon, linen blends, and soft synthetic fabrics can work well for teenage clothing. The ideal fabric depends on comfort, breathability, durability, season, and design."
    },
    {
      q: "4. What should teenage girls wear for casual outings?",
      a: "Casual outings suit comfortable combinations such as oversized T-shirts, crop tops, denim, relaxed trousers, sneakers, casual dresses, and lightweight layers that allow easy movement."
    },
    {
      q: "5. How can teenage girls create a trendy outfit?",
      a: "Teenage girls can create trendy outfits by combining current silhouettes with wardrobe basics, then adding accessories, footwear, or layers. Mixing textures and proportions can make simple outfits stand out."
    },
    {
      q: "6. Where can I buy trendy clothes for teenage girls online?",
      a: "Trendy clothes for teenage girls can be purchased from online fashion stores offering current styles, clear size information, quality fabrics, secure payments, and reliable delivery across different locations."
    },
    {
      q: "7. What makes a fashion brand suitable for teenagers?",
      a: "A suitable teen fashion brand offers age-appropriate designs, comfortable fabrics, flattering fits, current trends, accessible pricing, and versatile pieces suitable for everyday activities and different occasions."
    },
    {
      q: "8. What outfits are suitable for different occasions?",
      a: "Suitable outfits depend on the occasion, with casual tops and trousers for everyday plans, dresses for parties, co-ord sets for outings, and versatile layers for changing schedules."
    },
    {
      q: "9. Where can I find affordable fashion for teenage girls?",
      a: "Tobeque offers affordable fashion for teenage girls, combining current Gen-Z trends, comfortable fabrics, versatile designs, and accessible pricing for everyday outfits, parties, college, and casual plans."
    },
    {
      q: "10. What clothing styles are available for teenage girls?",
      a: "Teenage girls can explore styles including casual tops, dresses, co-ord sets, crop tops, oversized T-shirts, trousers, streetwear, and statement pieces designed for different moods, seasons, and occasions."
    }
  ];

  return (
    <section className="w-full px-4 md:px-outer-margin max-w-5xl mx-auto mb-16 pt-6 border-t border-outline-variant/30 text-on-surface">
      <div className="relative">

        {/* Read More / Read Less Toggle Button */}
        <div className="flex justify-center mb-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 text-primary hover:text-secondary font-medium text-sm sm:text-base tracking-wide transition-colors cursor-pointer group py-2"
          >
            <span className="underline underline-offset-4 decoration-outline-variant group-hover:decoration-primary">
              {isExpanded ? 'Read less about Clothes for Teenagers' : 'Read more about Clothes for Teenagers'}
            </span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'rotate-0'}`}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </div>

        {/* Expanded Content - All Text inside Read More */}
        {isExpanded && (
          <div className="pt-4 space-y-8 animate-fade-in transition-all">
            <h2 className="text-xl md:text-2xl font-light tracking-wide text-primary mb-4 text-center uppercase">
              Clothes for Teenagers That Feel Like You by Tobeque
            </h2>

            {/* Intro Paragraphs */}
            <div className="space-y-4 text-xs md:text-sm text-secondary/90 leading-relaxed font-body-md text-justify md:text-left">
              <p>
                Your fashion sense should never be about compromising your identity for style. Being born in India and influenced by the youthful vibrancy of modern-day Gen-Z, our collection is all about effortless yet confident and stylish designs. Whatever you're wearing, whether it's for hanging out, going for a coffee, partying, meeting with friends at school or taking photos and posting them on Instagram, we make sure that you will love how you look!
              </p>
              <p>
                Clothes for teenagers should be both cool &amp; comfortable, &amp; all yours. At Tobeque, we offer you the most fashionable designs with unique silhouettes, trendy details, comfy fits and affordable prices. Great style has never been more attainable, because we are here for quality fashion and individuality!
              </p>
              <p>
                Order trendy tops for young girl online and discover styles made to keep up with your plans, moods, and everyday moments. Based in India &amp; serving fashion lovers around the world, we’re here to make finding your next favourite outfit feel effortless.
              </p>
            </div>

            {/* Why Choose Us */}
            <div className="space-y-4">
              <h3 className="text-base md:text-lg font-semibold text-primary uppercase tracking-wider border-b border-outline-variant/30 pb-2">
                Why Choose Us for Aesthetic Outfits for Teens
              </h3>
              <p className="text-xs md:text-sm text-secondary/80 leading-relaxed">
                Style is personal, and there’s no need for it to be anything more complicated than that when choosing items that fit the bill. From materials to cuts and style, we aim for perfection with every aspect.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {[
                  { title: "1. Trend-Led Styles", desc: "Aesthetic outfits for teens must look up-to-date, rather than ripped from a page in a fashion magazine. We tailor to new Gen-Z trends from the Y2K era to contemporary streetwear, making designs that are contemporary, creative & comfortable." },
                  { title: "2. Quality Fabrics", desc: "Every garment is made with materials we consider to be fit for the body, that form to the body & that will look great while in use." },
                  { title: "3. Fits That Feel Right", desc: "The first step to a great style is a great fit. Our silhouettes are carefully chosen to be flattering, comfortable to wear and make a girl feel confident in her outfit, for teen and young girl's clothing." },
                  { title: "4. Fashion Without the Markup", desc: "Even though it looks the part, it doesn't need to cost a lot of money. We always maintain a friendly price spectrum and emphasise fashionable designs, quality materials and practical designs that add value to your wardrobe." },
                  { title: "5. Styles Made to Mix", desc: "Your clothes ought to work harder. Pair a smocked midi dress with sneakers, wear tops with denim or combine them together for more than one outfit from the same pieces." },
                  { title: "6. India to the World", desc: "Based in India & serving customers around the world, we make discovering fresh fashion simple. From everyday outfits to statement looks, your next wardrobe favourite is never far away." }
                ].map((item, idx) => (
                  <div key={idx} className="bg-surface-container/40 border border-outline-variant/30 p-4 rounded-md">
                    <h4 className="text-xs font-bold text-primary mb-1 uppercase tracking-wide">{item.title}</h4>
                    <p className="text-xs text-secondary/80 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* How to Shop */}
            <div className="space-y-4">
              <h3 className="text-base md:text-lg font-semibold text-primary uppercase tracking-wider border-b border-outline-variant/30 pb-2">
                How to Shop for Stylish Clothes for Girls
              </h3>
              <p className="text-xs md:text-sm text-secondary/80 leading-relaxed">
                Finding an outfit you love should be exciting, not exhausting. Our simple shopping process makes it easy to discover new styles, choose the right fit, &amp; get your favourites delivered without the usual hassle.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                {[
                  { title: "1. Explore the Collection", desc: "Start by browsing our latest edits and discover stylish clothes for girls across everyday, party, streetwear, and trend-led collections. Filter by your vibe, occasion, or favourite style." },
                  { title: "2. Find Your Favourite", desc: "Spotted something that instantly feels like you? Take a closer look at the design, fabric, fit, available sizes & styling details before adding your chosen piece to your cart." },
                  { title: "3. Check Your Size", desc: "Use the available size information to select the fit that works best for you. Taking a quick look at measurements can make choosing your perfect outfit much easier." },
                  { title: "4. Place Your Order", desc: "Ready to check out? Add your favourites to the cart, enter your delivery details, & complete your purchase securely. Whether you want a dress or a casual shirt for teenage girls online, ordering stays simple." },
                  { title: "5. Get Ready to Style", desc: "Once your order is on its way, all that’s left is to plan the look. Mix, match, layer, accessorise, & make your new pieces completely your own." }
                ].map((item, idx) => (
                  <div key={idx} className="bg-surface-container/40 border border-outline-variant/30 p-4 rounded-md">
                    <h4 className="text-xs font-bold text-primary mb-1 uppercase tracking-wide">{item.title}</h4>
                    <p className="text-xs text-secondary/80 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Where Can You Find Our Gen Z Fashion */}
            <div className="space-y-4">
              <h3 className="text-base md:text-lg font-semibold text-primary uppercase tracking-wider border-b border-outline-variant/30 pb-2">
                Where Can You Find Our Gen Z Fashion?
              </h3>
              <p className="text-xs md:text-sm text-secondary/80 leading-relaxed">
                Great style should be easy to discover, wherever you are. From our roots in India to customers around the world, we make trend-forward fashion accessible to teens and young girls wherever their style takes them.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                {[
                  { title: "1. Delhi & NCR", desc: "Born in Delhi, we understand the city’s ever-changing youth style. Our collections bring together easy everyday pieces, statement looks & fresh trends inspired by the energy around us." },
                  { title: "2. Major Indian Cities", desc: "From Mumbai & Bengaluru to Hyderabad, Chennai & beyond, we deliver fashion-forward styles to young girls across India, making it easier to refresh your wardrobe from anywhere." },
                  { title: "3. Emerging Indian Locations", desc: "Fashion isn’t limited to major metros. We serve customers across smaller cities and towns too, bringing Gen Z fashion closer to those who love experimenting with their personal style." },
                  { title: "4. Pan-India Online Shopping", desc: "Wherever you’re based in India, you can explore our collections online and find pieces suited to college days, casual plans, parties, holidays, and everything between." },
                  { title: "5. Around the World", desc: "Our journey doesn’t stop at India. We’re growing our reach internationally so more young fashion lovers can discover versatile pieces, from everyday tops to straight leg pants for teen girls." }
                ].map((item, idx) => (
                  <div key={idx} className="bg-surface-container/40 border border-outline-variant/30 p-4 rounded-md">
                    <h4 className="text-xs font-bold text-primary mb-1 uppercase tracking-wide">{item.title}</h4>
                    <p className="text-xs text-secondary/80 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Ready to Shop */}
            <div className="space-y-3 bg-surface-container/50 border border-outline-variant/40 p-6 rounded-lg text-center">
              <h3 className="text-base font-semibold text-primary uppercase tracking-wider">
                Ready to Shop Girls Fashion Online India?
              </h3>
              <p className="text-xs md:text-sm text-secondary/80 leading-relaxed max-w-3xl mx-auto">
                Need any sizing, fabric or order information or just something that matches your vibe? We’re always happy to help. Shopping with the intent of fashion should be enjoyable, hassle-free, and personal, not a game of guessing.
              </p>
              <p className="text-xs md:text-sm text-secondary/80 leading-relaxed max-w-3xl mx-auto">
                At Tobeque, we’re passionate about making girls fashion online India more exciting for teens and young girls who love experimenting with their style. From regular wear to a statement piece to comfortable clothes for teenagers, we're here to help you find the ideal outfit.
              </p>
              <p className="text-xs md:text-sm text-secondary/80 leading-relaxed max-w-3xl mx-auto">
                Want something easy to do on a lazy day? Well then try our trendy oversized t-shirts for teen girls and create your own style using the jeans of your choice.
              </p>
            </div>

            {/* FAQs Accordion */}
            <div className="space-y-4 pt-4">
              <h3 className="text-base md:text-lg font-semibold text-primary uppercase tracking-wider border-b border-outline-variant/30 pb-2 text-center">
                Frequently Asked Questions About Teen Fashion
              </h3>
              <div className="space-y-2 max-w-4xl mx-auto">
                {faqs.map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div key={idx} className="border border-outline-variant/40 rounded-md overflow-hidden bg-surface-container/30">
                      <button
                        onClick={() => toggleFaq(idx)}
                        className="w-full px-4 py-3 text-left flex justify-between items-center hover:bg-surface-container/60 transition-colors cursor-pointer"
                      >
                        <span className="text-xs md:text-sm font-medium text-primary">{faq.q}</span>
                        <span className="material-symbols-outlined text-secondary transition-transform text-[18px]" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                          expand_more
                        </span>
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-3 pt-1 text-xs text-secondary/80 border-t border-outline-variant/20 leading-relaxed animate-fade-in">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Read Less Button */}
            <div className="flex justify-center pt-4">
              <button
                onClick={() => setIsExpanded(false)}
                className="flex items-center gap-2 text-primary hover:text-secondary font-medium text-sm sm:text-base tracking-wide transition-colors cursor-pointer group py-2"
              >
                <span className="underline underline-offset-4 decoration-outline-variant group-hover:decoration-primary">
                  Read less about Clothes for Teenagers
                </span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="rotate-180"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
