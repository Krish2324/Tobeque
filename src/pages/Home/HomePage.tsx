import React, { useState, useEffect } from "react";
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
  const { products: featuredProducts, loading: featuredLoading } = useProducts({
    status: 'published',
    featured: true,
    limit: 10,
  });

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
      .catch(() => {})
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

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="relative w-full h-[80vh] md:h-[90vh] mb-4">
        <div className="w-full h-full relative overflow-hidden bg-surface-container">
          <img
            alt="Cinematic fashion campaign showing a model in spring collection."
            className="w-full h-full object-cover object-top absolute inset-0"
            src={heroBanner}
          />
          <div className="absolute inset-0 bg-primary/20 mix-blend-multiply" />
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
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-1 md:gap-1.5 animate-pulse">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-surface-container rounded" />
            ))}
          </div>
        ) : collectionItems.length > 0 ? (
          !showSlider ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-1 md:gap-1.5">
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
                          <path d="M2 5h6M6 3l2 2-2 2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
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
                      className="px-0.5 md:px-0.75 shrink-0"
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
                              <path d="M2 5h6M6 3l2 2-2 2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </p>
                        </div>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ) ) : (
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
      </section>

      <Footer />

      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </div>
  );
}
