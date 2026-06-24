import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

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
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [currentSort, setCurrentSort] = useState('FEATURED');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const { products: liveProducts, loading, error, total } = useProducts({ 
    status: 'published', 
    limit: 40,
    category: categoryParam || undefined
  });

  // If a category param is present and not already selected in UI, auto-select it
  useEffect(() => {
    if (categoryParam && !selectedFilters.includes(categoryParam)) {
      setSelectedFilters([categoryParam]);
    }
  }, [categoryParam]);

  const toggleFilter = (filter: string) => {
    setSelectedFilters(prev => 
      prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
    );
  };

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
          <div className="flex items-center gap-6 font-label-caps text-label-caps text-primary relative">
            <div className="relative">
              <button 
                className="flex items-center gap-2 hover:opacity-70 transition-opacity cursor-pointer"
                onClick={() => { setIsFilterOpen(!isFilterOpen); setIsSortOpen(false); }}
              >
                <span className="material-symbols-outlined text-[18px]">tune</span>{" "}
                FILTER
                {selectedFilters.length > 0 && (
                  <span className="bg-primary text-on-primary rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                    {selectedFilters.length}
                  </span>
                )}
              </button>
              
              {isFilterOpen && (
                <div className="absolute top-full left-0 mt-4 bg-surface-container border border-outline-variant shadow-lg z-50 p-6 min-w-[250px] flex flex-col gap-4">
                  <div className="flex justify-between items-center mb-2 border-b border-outline-variant pb-2">
                    <h3 className="font-bold tracking-widest text-sm">CATEGORIES</h3>
                    <button className="text-[10px] underline cursor-pointer" onClick={() => setSelectedFilters([])}>Clear</button>
                  </div>
                  <div className="flex flex-col gap-3">
                    {['Dresses', 'Tops', 'Pants', 'Outerwear', 'Accessories'].map(cat => (
                      <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 accent-primary cursor-pointer"
                          checked={selectedFilters.includes(cat)}
                          onChange={() => toggleFilter(cat)}
                        />
                        <span className="text-sm font-body-md group-hover:text-primary transition-colors">{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="w-[1px] h-4 bg-outline-variant hidden md:block"></div>
            
            <div className="relative">
              <button 
                className="flex items-center gap-2 hover:opacity-70 transition-opacity cursor-pointer"
                onClick={() => { setIsSortOpen(!isSortOpen); setIsFilterOpen(false); }}
              >
                SORT: {currentSort}{" "}
                <span className={`material-symbols-outlined text-[18px] transition-transform ${isSortOpen ? 'rotate-180' : ''}`}>
                  expand_more
                </span>
              </button>

              {isSortOpen && (
                <div className="absolute top-full right-0 mt-4 bg-surface-container border border-outline-variant shadow-lg z-50 min-w-[200px] flex flex-col">
                  {['FEATURED', 'NEWEST', 'PRICE: LOW TO HIGH', 'PRICE: HIGH TO LOW'].map(sortOption => (
                    <button
                      key={sortOption}
                      className={`text-left px-6 py-3 text-sm font-label-caps tracking-wider transition-colors cursor-pointer ${currentSort === sortOption ? 'bg-primary/10 text-primary font-bold' : 'text-on-surface hover:bg-surface-container-highest'}`}
                      onClick={() => {
                        setCurrentSort(sortOption);
                        setIsSortOpen(false);
                      }}
                    >
                      {sortOption}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="w-[1px] h-4 bg-outline-variant hidden md:block"></div>
            <button className="hidden md:flex items-center gap-1 hover:opacity-70 transition-opacity cursor-pointer" title="Grid View">
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
