import React, { useState } from 'react';

import { ProductCard, type Product } from '../../components/ProductCard';
import { useCart } from '../../context/CartContext';
import { useProducts } from '../../hooks/useProducts';
import { QuickViewModal } from '../../components/QuickViewModal/QuickViewModal';
import { Navbar } from '../../components/Navbar/Navbar';
import { Footer } from '../../components/Footer/Footer';

import collectionHeroLeft from '../../assets/images/collection-hero-left.jpg';
import collectionHeroRight from '../../assets/images/collection-hero-right.jpg';

export function CollectionPage() {
  const { setIsCartOpen, addToCart, wishlistItems, addToWishlist, removeFromWishlist } = useCart();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const { products: liveProducts, loading, error, total } = useProducts({ status: 'published', limit: 40 });

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
    <div className="bg-surface-container-lowest text-on-surface antialiased selection:bg-primary selection:text-on-primary font-body-md text-body-md overflow-x-hidden min-h-screen">
      {/* TopNavBar */}
      <Navbar onSearchProductSelect={(product) => setQuickViewProduct(product)} />

      <main className="pt-[72px]">
        {/* SECTION 1: PROMOTIONAL HERO BANNER */}
        <section className="w-full bg-[#F5F5F0] min-h-[50vh] md:min-h-[60vh] py-12 md:py-20 px-outer-margin relative overflow-hidden flex items-center justify-center">
          <div className="max-w-[1600px] mx-auto flex flex-col items-center justify-center text-center relative z-10">
            <h1 className="font-display-lg text-display-lg text-primary mb-6 uppercase">
              THE NEW SEASON CURATION
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-8 max-w-2xl">
              Effortless silhouettes for the modern woman.
            </p>
            <a
              className="inline-flex items-center justify-center bg-primary text-on-primary font-label-caps text-label-caps h-14 px-8 uppercase hover:bg-surface-tint transition-colors"
              href="#"
            >
              EXPLORE COLLECTION
            </a>
          </div>
          {/* Decorative Images */}
          <div className="absolute left-0 top-0 bottom-0 w-1/4 hidden lg:block opacity-80 pointer-events-none">
            <div
              className="w-full h-full bg-cover bg-center"
              style={{
                backgroundImage: `url(${collectionHeroLeft})`,
              }}
            ></div>
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-1/4 hidden lg:block opacity-80 pointer-events-none">
            <div
              className="w-full h-full bg-cover bg-center"
              style={{
                backgroundImage: `url(${collectionHeroRight})`,
              }}
            ></div>
          </div>
        </section>

        {/* SECTION 2: COLLECTION HEADER */}
        <div className="sticky top-[72px] z-40 bg-surface-container-lowest border-b border-outline-variant py-4 px-outer-margin md:px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="font-headline-md text-headline-md text-primary">
            ALL PRODUCTS{" "}
            <span className="text-on-surface-variant text-body-md font-body-md ml-2">
              ({loading ? '...' : total})
            </span>
          </div>
          <div className="flex items-center gap-6 font-label-caps text-label-caps text-primary">
            <button className="flex items-center gap-2 hover:opacity-70 transition-opacity">
              <span className="material-symbols-outlined text-[18px]">tune</span>{" "}
              FILTER
            </button>
            <div className="w-[1px] h-4 bg-outline-variant hidden md:block"></div>
            <button className="flex items-center gap-2 hover:opacity-70 transition-opacity">
              SORT: FEATURED{" "}
              <span className="material-symbols-outlined text-[18px]">
                expand_more
              </span>
            </button>
            <div className="w-[1px] h-4 bg-outline-variant hidden md:block"></div>
            <button className="hidden md:flex items-center gap-1 hover:opacity-70 transition-opacity">
              <span className="material-symbols-outlined text-[20px]">
                grid_view
              </span>
            </button>
          </div>
        </div>

        {/* SECTION 3: PRODUCT GRID */}
        <section className="w-full px-1 md:px-2 py-8">
          {/* Loading State */}
          {loading && (
            <div className="w-full flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-on-surface-variant font-body-md text-body-md">Loading products...</p>
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="w-full flex flex-col items-center justify-center py-24 gap-4 text-center px-4">
              <span className="material-symbols-outlined text-5xl text-on-surface-variant">error_outline</span>
              <p className="font-headline-sm text-primary">Could not load products</p>
              <p className="text-on-surface-variant font-body-md text-body-md max-w-sm">{error}</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && liveProducts.length === 0 && (
            <div className="w-full flex flex-col items-center justify-center py-24 gap-4 text-center px-4">
              <span className="material-symbols-outlined text-5xl text-on-surface-variant">inventory_2</span>
              <p className="font-headline-sm text-primary">No products available yet</p>
              <p className="text-on-surface-variant font-body-md text-body-md max-w-sm">
                Products added from the admin panel will appear here once published.
              </p>
            </div>
          )}

          {/* Product Grid */}
          {!loading && !error && liveProducts.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 md:gap-1.5">
              {liveProducts.map((p) => (
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
            </div>
          )}

          {/* Load More — only show when there are products and not loading */}
          {!loading && !error && liveProducts.length > 0 && (
            <div className="w-full flex justify-center mt-16 mb-8">
              <button className="border border-primary text-primary font-label-caps text-label-caps px-8 py-4 uppercase hover:bg-primary hover:text-on-primary transition-colors duration-300">
                Load More Products
              </button>
            </div>
          )}
        </section>
      </main>

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
