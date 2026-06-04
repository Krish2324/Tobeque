import React, { useState } from "react";
import { ProductCard, type Product } from "../../components/ProductCard";
import { useCart } from "../../context/CartContext";

import { useProducts } from "../../hooks/useProducts";
import { useSeasonCollection, getSeasonItemImage, resolveImageUrl } from "../../hooks/useSeasonCollection";
import { QuickViewModal } from "../../components/QuickViewModal/QuickViewModal";
import { Navbar } from "../../components/Navbar/Navbar";
import { Footer } from "../../components/Footer/Footer";

import heroBanner from '../../assets/images/hero-spring-edit.jpg';

const isVideoUrl = (url: string | null | undefined) => url && /\.(mp4|webm|ogg|mov)$/i.test(url);

export function HomePage() {
  const { setIsCartOpen, addToWishlist, wishlistItems, removeFromWishlist, addToCart } = useCart();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  // Fetch live featured products from backend
  const { products: featuredProducts, loading: featuredLoading } = useProducts({ status: 'published', featured: true, limit: 10 });
  // Fetch dynamic Season Collection managed from admin panel
  const { items: seasonItems, loading: seasonLoading } = useSeasonCollection();

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
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 z-10">
            <h1 className="font-display-lg text-display-lg text-on-primary mb-6 drop-shadow-sm">
              THE SPRING EDIT
            </h1>
            <a
              className="inline-flex items-center justify-center px-8 py-4 border border-on-primary text-on-primary font-label-caps text-label-caps hover:bg-on-primary hover:text-primary transition-colors duration-300 backdrop-blur-sm bg-primary/10"
              href="#"
            >
              Shop Now
            </a>
          </div>
        </div>
      </section>


      {/* Season Collection Carousel — Dynamic (Admin-managed) */}
      {(seasonLoading || seasonItems.length > 0) && (
        <section className="w-full px-1 md:px-2 mb-8 overflow-hidden">
          <h2 className="text-center font-headline-md text-headline-md text-primary mb-6">
            Season Collection
          </h2>

          {/* Loading skeleton */}
          {seasonLoading && (
            <div className="flex gap-1 md:gap-1.5 overflow-hidden">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="w-64 md:w-80 flex-shrink-0">
                  <div className="aspect-[3/4] bg-surface-container animate-pulse rounded" />
                  <div className="h-4 bg-surface-container animate-pulse rounded mt-3 mx-8" />
                </div>
              ))}
            </div>
          )}

          {/* Marquee carousel */}
          {!seasonLoading && seasonItems.length > 0 && (() => {
            // Pad items so the marquee always has enough to fill the loop smoothly.
            // Even 1 item should look like a real carousel, not just 2 duplicates.
            const MIN_VISIBLE = 8;
            const repeat = Math.ceil(MIN_VISIBLE / seasonItems.length);
            const paddedItems = Array.from({ length: repeat }, () => seasonItems).flat();
            return (
              <div className="marquee-container w-full">
                <div className="marquee-content flex gap-1 md:gap-1.5 w-max">
                  {/* First set */}
                  <div className="flex gap-1 md:gap-1.5 shrink-0">
                    {paddedItems.map((item, idx) => {
                      const imgUrl = getSeasonItemImage(item);
                      const label = item.displayLabel || item.product?.name || '';
                      
                      const effectiveVideoSrc = item.videoUrl 
                        ? resolveImageUrl(item.videoUrl)
                        : (isVideoUrl(imgUrl) ? imgUrl : null);

                      return (
                        <button
                          key={`a-${item.id}-${idx}`}
                          className="block w-64 md:w-80 group text-left cursor-pointer bg-transparent border-none p-0"
                          onClick={() => {
                            if (item.product) {
                              setQuickViewProduct({
                                id: String(item.product.id),
                                name: item.product.name,
                                price: item.product.discountPrice
                                  ? `$${parseFloat(String(item.product.discountPrice)).toFixed(2)}`
                                  : `$${parseFloat(String(item.product.price)).toFixed(2)}`,
                                originalPrice: item.product.discountPrice
                                  ? `$${parseFloat(String(item.product.price)).toFixed(2)}`
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
                          <div className="aspect-[3/4] relative overflow-hidden bg-surface-container mb-4">
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
                          <h3 className="text-center font-body-md text-body-md text-primary">
                            {label}
                          </h3>
                        </button>
                      );
                    })}
                  </div>

                  {/* Duplicate set for seamless infinite marquee loop */}
                  <div className="flex gap-1 md:gap-1.5 shrink-0" aria-hidden="true">
                    {paddedItems.map((item, idx) => {
                      const imgUrl = getSeasonItemImage(item);
                      const label = item.displayLabel || item.product?.name || '';
                      
                      const effectiveVideoSrc = item.videoUrl 
                        ? resolveImageUrl(item.videoUrl)
                        : (isVideoUrl(imgUrl) ? imgUrl : null);

                      return (
                        <div
                          key={`b-${item.id}-${idx}`}
                          className="block w-64 md:w-80 group text-left"
                        >
                          <div className="aspect-[3/4] relative overflow-hidden bg-surface-container mb-4">
                            {effectiveVideoSrc ? (
                              <video
                                src={effectiveVideoSrc}
                                className="w-full h-full object-cover"
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
                          <h3 className="text-center font-body-md text-body-md text-primary">
                            {label}
                          </h3>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })()}
        </section>
      )}

      <div className="w-full px-1 md:px-2 mb-6">
        <div className="flex items-center justify-between border-b border-outline-variant pb-4">
          <div className="flex items-center gap-2 cursor-pointer group">
            <h2 className="font-label-caps text-label-caps text-primary uppercase tracking-[0.2em]">
              You are in BEST SELLERS
            </h2>
            <span className="material-symbols-outlined text-sm transition-transform group-hover:rotate-180">
              expand_more
            </span>
          </div>
        </div>
      </div>

      {/* Featured Products Grid */}
      <section className="w-full px-1 md:px-2 mb-section-padding-mobile md:mb-section-padding-desktop">
        <h2 className="text-center font-headline-md text-headline-md text-primary mb-6 hidden">
          Featured Products
        </h2>
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
