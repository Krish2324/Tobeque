import React, { useState, useEffect, useRef, useCallback } from "react";
import { ProductCard, type Product } from "../../components/ProductCard";
import { useCart } from "../../context/CartContext";

import { useProducts } from "../../hooks/useProducts";
import { useSeasonCollection, getSeasonItemImage, resolveImageUrl } from "../../hooks/useSeasonCollection";
import { QuickViewModal } from "../../components/QuickViewModal/QuickViewModal";
import { Navbar } from "../../components/Navbar/Navbar";
import { Footer } from "../../components/Footer/Footer";

import heroBanner from '../../assets/images/hero-spring-edit.jpg';

const isVideoUrl = (url: string | null | undefined) => url && /\.(mp4|webm|ogg|mov)$/i.test(url);

// Number of cards visible at once in the season collection carousel
const SEASON_VISIBLE = 6;

export function HomePage() {
  const { setIsCartOpen, addToWishlist, wishlistItems, removeFromWishlist, addToCart } = useCart();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  // Fetch live featured products from backend
  const { products: featuredProducts, loading: featuredLoading } = useProducts({ status: 'published', featured: true, limit: 10 });
  const { items: seasonItems, loading: seasonLoading } = useSeasonCollection();

  // Season collection carousel state
  const [seasonIndex, setSeasonIndex] = useState(0);
  const seasonTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const seasonNext = useCallback(() => {
    setSeasonIndex(i => (seasonItems.length > 0 ? (i + 1) % seasonItems.length : 0));
  }, [seasonItems.length]);

  const seasonPrev = useCallback(() => {
    setSeasonIndex(i => (seasonItems.length > 0 ? (i - 1 + seasonItems.length) % seasonItems.length : 0));
  }, [seasonItems.length]);

  // Auto-slide every 3 seconds
  useEffect(() => {
    if (seasonItems.length <= 1) return;
    seasonTimer.current = setInterval(seasonNext, 3000);
    return () => { if (seasonTimer.current) clearInterval(seasonTimer.current); };
  }, [seasonNext, seasonItems.length]);

  const resetTimer = useCallback(() => {
    if (seasonTimer.current) clearInterval(seasonTimer.current);
    if (seasonItems.length > 1) {
      seasonTimer.current = setInterval(seasonNext, 3000);
    }
  }, [seasonNext, seasonItems.length]);

  const pauseTimer = useCallback(() => {
    if (seasonTimer.current) clearInterval(seasonTimer.current);
  }, []);

  const resumeTimer = useCallback(() => {
    if (seasonItems.length > 1) {
      seasonTimer.current = setInterval(seasonNext, 3000);
    }
  }, [seasonNext, seasonItems.length]);

  const [currentCategory, setCurrentCategory] = useState('BEST SELLERS');
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  const handleWishlist = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    const exists = wishlistItems.find((p) => p.name === product.name);
    if (exists) {
      removeFromWishlist(product.name);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div className="bg-background text-on-background font-body-md antialiased overflow-x-hidden">
      {/* TopNavBar */}
      <Navbar onSearchProductSelect={(product) => setQuickViewProduct(product)} />

      {/* Hero Video Section */}
      <section className="relative w-full h-[80vh] md:h-[90vh] mb-8">
        <div className="w-full h-full relative overflow-hidden bg-surface-container">
          <img
            alt="Cinematic fashion campaign showing a model in spring collection."
            className="w-full h-full object-cover object-top absolute inset-0"
            data-alt="A cinematic, high-fashion campaign video still featuring a model in an elegant spring ensemble. The setting is a bright, sunlit minimalist studio with soft, diffused white lighting that creates a pristine, airy atmosphere. The model wears a sophisticated beige trench coat over a white silk dress, exuding effortless luxury. The overall mood is serene, aspirational, and premium, perfectly matching the light-mode editorial aesthetic of a high-end boutique."
            src={heroBanner}
          />

          {/* Simulated Video Overlay for contrast */}
          <div className="absolute inset-0 bg-primary/20 mix-blend-multiply" />
          {/* Text and Button removed per user request */}
        </div>
      </section>


      {/* Season Collection Carousel — Dynamic (Admin-managed) */}
      {(seasonLoading || seasonItems.length > 0) && (
        <section className="w-full px-1 md:px-2 mb-8">
          {/* Editorial Fashion Heading */}
          <div className="flex items-center justify-center gap-5 mb-6">
            <span className="flex-1 h-px bg-gradient-to-r from-transparent to-outline-variant max-w-[120px]" />
            <div className="text-center">
              <p className="text-[9px] tracking-[0.35em] text-secondary uppercase font-medium mb-0.5">Curated For You</p>
              <h2 className="text-[13px] tracking-[0.3em] font-light text-primary uppercase">
                Season Collection
              </h2>
            </div>
            <span className="flex-1 h-px bg-gradient-to-l from-transparent to-outline-variant max-w-[120px]" />
          </div>

          {/* Loading skeleton */}
          {seasonLoading && (
            <div className="flex gap-2 overflow-hidden">
              {Array.from({ length: SEASON_VISIBLE }).map((_, i) => (
                <div key={i} className="flex-1">
                  <div className="aspect-[3/4] bg-surface-container animate-pulse" />
                  <div className="h-3 bg-surface-container animate-pulse rounded mt-2 mx-4" />
                </div>
              ))}
            </div>
          )}

          {/* One-by-one slide carousel */}
          {!seasonLoading && seasonItems.length > 0 && (() => {
            // Always display exactly SEASON_VISIBLE slots.
            // Fill from seasonIndex wrapping around; ghost cards fill empty slots.
            const n = seasonItems.length;
            const slots = Array.from({ length: SEASON_VISIBLE }, (_, k) => {
              if (k < n) {
                const idx = (seasonIndex + k) % n;
                return { item: seasonItems[idx], ghost: false, key: `${seasonItems[idx].id}-${idx}-${k}` };
              }
              return { item: null, ghost: true, key: `ghost-${k}` };
            });

            return (
              <div className="relative">
                {/* Arrow — Prev */}
                {seasonItems.length > 1 && (
                  <button
                    aria-label="Previous"
                    className="absolute left-0 top-[40%] -translate-y-1/2 z-10 -translate-x-4 w-8 h-8 flex items-center justify-center bg-white border border-outline-variant shadow-sm hover:bg-surface-container transition-colors"
                    onClick={() => { seasonPrev(); resetTimer(); }}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                )}

                {/* Cards — always exactly SEASON_VISIBLE slots */}
                <div
                  className="grid gap-1"
                  style={{ gridTemplateColumns: `repeat(${SEASON_VISIBLE}, 1fr)` }}
                  onMouseEnter={pauseTimer}
                  onMouseLeave={resumeTimer}
                >
                  {slots.map(({ item, ghost, key }) => {
                    if (ghost || !item) {
                      return (
                        <div key={key} className="opacity-0 pointer-events-none">
                          <div className="aspect-[3/4] bg-[#f0f0f0]" />
                          <div className="h-4 mt-2" />
                        </div>
                      );
                    }

                    const imgUrl = getSeasonItemImage(item);
                    const label = item.displayLabel || item.product?.name || '';
                    const effectiveVideoSrc = item.videoUrl
                      ? resolveImageUrl(item.videoUrl)
                      : (isVideoUrl(imgUrl) ? imgUrl : null);

                    return (
                      <button
                        key={key}
                        className="group text-left cursor-pointer bg-transparent border-none p-0 min-w-0"
                        onClick={() => {
                          if (item.product) {
                            setQuickViewProduct({
                              id: String(item.product.id),
                              name: item.product.name,
                              price: item.product.discountPrice
                                ? `₹${parseFloat(String(item.product.discountPrice)).toFixed(0)}`
                                : `₹${parseFloat(String(item.product.price)).toFixed(0)}`,
                              originalPrice: item.product.discountPrice
                                ? `₹${parseFloat(String(item.product.price)).toFixed(0)}`
                                : undefined,
                              imageSrc: imgUrl,
                              hoverImageSrc: imgUrl,
                              imageAlt: label,
                              sizes: ['S', 'M', 'L'],
                              description: '',
                              galleryImages: item.product.images && item.product.images.length > 0
                                ? item.product.images.map((img) => img.imageUrl)
                                : [imgUrl],
                              fabricCare: '',
                              shippingReturns: 'Orders are processed within 1-2 business days.',
                            });
                          }
                        }}
                      >
                        <div className="aspect-[3/4] relative overflow-hidden bg-[#f0f0f0] mb-2">
                          {effectiveVideoSrc ? (
                            <video
                              src={effectiveVideoSrc}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                              muted
                              loop
                              playsInline
                              autoPlay
                            />
                          ) : (
                            <img
                              alt={label}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                              src={imgUrl}
                            />
                          )}
                        </div>
                        <h3 className="text-center text-[11px] font-medium text-primary tracking-wide uppercase truncate px-1">
                          {label}
                        </h3>
                      </button>
                    );
                  })}
                </div>

                {/* Arrow — Next */}
                {seasonItems.length > 1 && (
                  <button
                    aria-label="Next"
                    className="absolute right-0 top-[40%] -translate-y-1/2 z-10 translate-x-4 w-8 h-8 flex items-center justify-center bg-white border border-outline-variant shadow-sm hover:bg-surface-container transition-colors"
                    onClick={() => { seasonNext(); resetTimer(); }}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 2L10 7L5 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                )}

                {/* Dot indicators */}
                {seasonItems.length > 1 && (
                  <div className="flex justify-center gap-1.5 mt-4">
                    {seasonItems.map((_, i) => (
                      <button
                        key={i}
                        aria-label={`Go to slide ${i + 1}`}
                        className={`h-1.5 rounded-full transition-all duration-300 ${i === seasonIndex ? 'bg-primary w-4' : 'bg-outline-variant w-1.5'}`}
                        onClick={() => { setSeasonIndex(i); resetTimer(); }}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })()}
        </section>
      )}


      <div className="w-full px-1 md:px-2 mb-6">
        <div className="flex items-center justify-between border-b border-outline-variant pb-4">
          <div className="relative">
            <div 
              className="flex items-center gap-2 cursor-pointer group"
              onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
            >
              <h2 className="font-label-caps text-label-caps text-primary uppercase tracking-[0.2em]">
                You are in {currentCategory}
              </h2>
              <span className={`material-symbols-outlined text-sm transition-transform ${isCategoryDropdownOpen ? 'rotate-180' : 'group-hover:rotate-180'}`}>
                expand_more
              </span>
            </div>
            
            {isCategoryDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 bg-surface-container border border-outline-variant shadow-md z-20 py-2 min-w-[200px]">
                {['BEST SELLERS', 'NEW ARRIVALS', 'TRENDING'].map(cat => (
                  <button
                    key={cat}
                    className={`block w-full text-left px-4 py-2 text-sm font-label-caps tracking-wider transition-colors cursor-pointer ${currentCategory === cat ? 'bg-primary/10 text-primary font-bold' : 'text-on-surface hover:bg-surface-container-highest'}`}
                    onClick={() => {
                      setCurrentCategory(cat);
                      setIsCategoryDropdownOpen(false);
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Featured Products Grid */}
      <section className="w-full px-1 md:px-2 mb-section-padding-mobile md:mb-section-padding-desktop">
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
      </section>

      {/* Premium Campaign Section (static, matches structure) */}
      <section className="w-full mb-section-padding-mobile md:mb-section-padding-desktop">
        <div className="relative w-full h-[60vh] md:h-[80vh] flex items-center justify-center overflow-hidden bg-surface-container">
          <img
            alt="Luxury fashion campaign"
            className="absolute inset-0 w-full h-full object-cover object-center"
            data-alt="A wide, immersive fashion campaign banner. The image shows a group of models in elegant, neutral-toned outfits walking down a grand, sunlit architectural corridor. The lighting is dramatic yet soft, creating a rich luxury atmosphere with deep shadows and bright highlights. The overall tone is sophisticated, modern, and timeless, perfectly suited for a high-end brand's primary editorial statement."
            src="/src/assets/images/campaign-banner.jpg"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/40 to-transparent" />
          <div className="relative z-10 max-w-2xl px-8 text-left self-center md:ml-24">
            <span className="font-label-caps text-label-caps text-on-primary tracking-widest block mb-4 uppercase">
              New Season Arrivals
            </span>
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-primary mb-6">
              Designed for Modern Elegance
            </h2>
            <p className="font-body-lg text-body-lg text-on-primary/90 mb-8 max-w-md">
              Elevated essentials crafted for confident women who love timeless
              fashion.
            </p>
            <a
              className="inline-flex items-center justify-center px-8 py-4 border border-on-primary text-on-primary font-label-caps text-label-caps hover:bg-on-primary hover:text-primary transition-colors duration-300"
              href="#"
            >
              Explore Collection
            </a>
          </div>
        </div>
      </section>
      {/* Hot Right Now Section */}
      <section className="w-full px-outer-margin mb-section-padding-mobile md:mb-section-padding-desktop mt-section-padding-desktop flex flex-col items-center">
        <h2 className="font-headline-lg text-headline-lg text-primary mb-2 text-center">
          Hot Right Now
        </h2>
        <p className="font-body-md text-body-md text-secondary mb-12 text-center">
          Trending styles curated for the modern wardrobe.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter w-full">
          {/* Item 1 */}
          <div className="relative group rounded-2xl overflow-hidden aspect-[3/4]">
            <img
              alt="Mesh Maxi Dress"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              src="/src/assets/images/product-rib-top-1.jpg"
            />
            <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 rounded-full text-xs font-bold z-10">
              Trending Now
            </div>
            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end">
              <div className="flex items-end gap-3 mb-2">
                <div className="w-12 h-12 bg-white rounded flex-shrink-0 overflow-hidden">
                  <img src="/src/assets/images/product-rib-top-1.jpg" className="w-full h-full object-cover" alt="" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm uppercase tracking-wider">MESH MAXI DRESS</h3>
                  <p className="text-white/80 text-[10px] leading-tight">Elevated silhouettes crafted for modern elegance.</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-white">
                <span className="font-bold">₹1,750</span>
                <span className="text-white/60 line-through text-sm">₹3,999</span>
                <span className="text-green-400 text-sm font-semibold">Save 56%</span>
              </div>
            </div>
          </div>

          {/* Item 2 */}
          <div className="relative group rounded-2xl overflow-hidden aspect-[3/4]">
            <img
              alt="Silk Slip Dress"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              src="/src/assets/images/product-slip-dress-1.jpg"
            />
            <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 rounded-full text-xs font-bold z-10">
              Trending Now
            </div>
            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end">
              <div className="flex items-end gap-3 mb-2">
                <div className="w-12 h-12 bg-white rounded flex-shrink-0 overflow-hidden">
                  <img src="/src/assets/images/product-slip-dress-1.jpg" className="w-full h-full object-cover" alt="" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm uppercase tracking-wider">SILK SLIP DRESS</h3>
                  <p className="text-white/80 text-[10px] leading-tight">Minimalist luxury in every thread.</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-white">
                <span className="font-bold">₹2,450</span>
                <span className="text-white/60 line-through text-sm">₹4,999</span>
                <span className="text-green-400 text-sm font-semibold">Save 51%</span>
              </div>
            </div>
          </div>

          {/* Item 3 */}
          <div className="relative group rounded-2xl overflow-hidden aspect-[3/4]">
            <img
              alt="Tailored Blazer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              src="/src/assets/images/product-poplin-shirt-1.jpg"
            />
            <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 rounded-full text-xs font-bold z-10">
              Trending Now
            </div>
            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end">
              <div className="flex items-end gap-3 mb-2">
                <div className="w-12 h-12 bg-white rounded flex-shrink-0 overflow-hidden">
                  <img src="/src/assets/images/product-poplin-shirt-1.jpg" className="w-full h-full object-cover" alt="" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm uppercase tracking-wider">TAILORED BLAZER</h3>
                  <p className="text-white/80 text-[10px] leading-tight">Structural perfection for the city.</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-white">
                <span className="font-bold">₹3,150</span>
                <span className="text-white/60 line-through text-sm">₹7,999</span>
                <span className="text-green-400 text-sm font-semibold">Save 60%</span>
              </div>
            </div>
          </div>

          {/* Item 4 */}
          <div className="relative group rounded-2xl overflow-hidden aspect-[3/4]">
            <img
              alt="Straight Denim"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              src="/src/assets/images/product-denim-1.jpg"
            />
            <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 rounded-full text-xs font-bold z-10">
              Trending Now
            </div>
            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end">
              <div className="flex items-end gap-3 mb-2">
                <div className="w-12 h-12 bg-white rounded flex-shrink-0 overflow-hidden">
                  <img src="/src/assets/images/product-denim-1.jpg" className="w-full h-full object-cover" alt="" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm uppercase tracking-wider">STRAIGHT DENIM</h3>
                  <p className="text-white/80 text-[10px] leading-tight">Timeless cuts for daily ease.</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-white">
                <span className="font-bold">₹1,950</span>
                <span className="text-white/60 line-through text-sm">₹3,499</span>
                <span className="text-green-400 text-sm font-semibold">Save 44%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />

    </div>
  );
}
