import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

import { ProductCard, type Product } from '../../components/ProductCard';
import { useCart } from '../../context/CartContext';
import { useProducts } from '../../hooks/useProducts';
import { QuickViewModal } from '../../components/QuickViewModal/QuickViewModal';
import { Navbar } from '../../components/Navbar/Navbar';
import { Footer } from '../../components/Footer/Footer';
import api from '../../services/api';

import collectionHeroLeft from '../../assets/images/collection-hero-left.jpg';
import collectionHeroRight from '../../assets/images/collection-hero-right.jpg';

interface Category {
  id?: string;
  _id?: string;
  name: string;
  subcategories?: Category[];
}

export function CollectionPage() {
  const navigate = useNavigate();
  const { setIsCartOpen, addToCart, wishlistItems, addToWishlist, removeFromWishlist } = useCart();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [currentSort, setCurrentSort] = useState('FEATURED');

  // Filter & Layout states
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid-3' | 'grid-4'>('grid-4');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');

  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const categoryNameParam = searchParams.get('name');

  // ── Live categories tree ──────────────────────────────────────────────────
  const [categoriesTree, setCategoriesTree] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

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

  // Compute what tabs to show based on the tree and current categoryParam
  const { currentContext, siblings } = useMemo<{ currentContext: Category | null, siblings: Category[] }>(() => {
    if (!categoryParam) return { currentContext: null, siblings: categoriesTree };

    const dfs = (nodes: Category[], parent: Category | null): { node: Category, parent: Category | null } | null => {
      for (const n of nodes) {
        if (String(n.id || n._id) === categoryParam || String(n.name).toLowerCase() === String(categoryParam).toLowerCase()) {
          return { node: n, parent };
        }
        if (n.subcategories && n.subcategories.length > 0) {
          const res = dfs(n.subcategories, n);
          if (res) return res;
        }
      }
      return null;
    };
    const result = dfs(categoriesTree, null);

    if (result) {
      const { node: foundNode, parent: foundParent } = result;
      if (foundNode.subcategories && foundNode.subcategories.length > 0) {
        // Node has children -> It's a parent category, show its children as tabs
        return { currentContext: foundNode, siblings: foundNode.subcategories };
      } else if (foundParent) {
        // Node is a leaf -> User requested to ONLY show this specific subcategory, not all siblings
        return { currentContext: foundParent, siblings: [foundNode] };
      } else {
        // Node is a root with no children
        return { currentContext: null, siblings: [foundNode] };
      }
    }

    return { currentContext: null, siblings: categoriesTree };
  }, [categoriesTree, categoryParam]);

  // ── Products ──────────────────────────────────────────────────────────────
  const { products: liveProducts, loading, error, total } = useProducts({
    status: 'published',
    limit: 40,
    category: categoryParam || undefined,
  });

  // Extract all unique sizes and colors from loaded products dynamically
  const { allSizes } = useMemo(() => {
    const sizesSet = new Set<string>();
    const colorsSet = new Set<string>();

    liveProducts.forEach(p => {
      if (p.sizes) {
        p.sizes.forEach(s => sizesSet.add(s));
      }
      if (p.detailedColors) {
        p.detailedColors.forEach(c => colorsSet.add(c.name));
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
      allSizes: sortedSizes.length > 0 ? sortedSizes : ['XS', 'S', 'M', 'L', 'XL'],
      allColors: Array.from(colorsSet).length > 0 ? Array.from(colorsSet) : ['BLACK', 'WHITE', 'CREAM', 'OATMEAL', 'RED']
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

    // Sort products
    if (currentSort === 'PRICE: LOW TO HIGH') {
      result.sort((a, b) => {
        const priceA = parseFloat(a.price.replace(/[^0-9.-]+/g, '')) || 0;
        const priceB = parseFloat(b.price.replace(/[^0-9.-]+/g, '')) || 0;
        return priceA - priceB;
      });
    } else if (currentSort === 'PRICE: HIGH TO LOW') {
      result.sort((a, b) => {
        const priceA = parseFloat(a.price.replace(/[^0-9.-]+/g, '')) || 0;
        const priceB = parseFloat(b.price.replace(/[^0-9.-]+/g, '')) || 0;
        return priceB - priceA;
      });
    } else if (currentSort === 'NEWEST') {
      result.sort((a, b) => b.id.localeCompare(a.id));
    } else if (currentSort === 'FEATURED') {
      result.sort((a, b) => {
        const featA = a.badge?.toLowerCase().includes('featured') || a.badge?.toLowerCase().includes('arrival') ? 1 : 0;
        const featB = b.badge?.toLowerCase().includes('featured') || b.badge?.toLowerCase().includes('arrival') ? 1 : 0;
        return featB - featA;
      });
    }

    return result;
  }, [liveProducts, selectedSizes, minPrice, maxPrice, currentSort]);

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
    : 'ALL PRODUCTS';

  return (
    <div className="bg-surface-container-lowest text-on-surface antialiased selection:bg-primary selection:text-on-primary font-body-md text-body-md overflow-x-hidden min-h-screen">
      <Navbar onSearchProductSelect={(product) => setQuickViewProduct(product)} />

      <main>
        {/* ── Hero banner ─────────────────────────────────────────────────── */}
        <section className="w-full bg-[#F5F5F0] py-12 md:py-20 min-h-[350px] px-outer-margin relative overflow-hidden flex items-center justify-center">
          <div className="max-w-[1600px] mx-auto flex flex-col items-center justify-center text-center relative z-10">
            <p className="text-[9px] tracking-[0.35em] text-secondary uppercase font-medium mb-1">
              Season Collection
            </p>
            <h1 className="font-display-lg text-primary mb-2 uppercase text-2xl md:text-3xl">
              {displayTitle}
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">
              Effortless silhouettes for the modern woman.
            </p>
          </div>
          <div className="absolute left-0 top-0 bottom-0 w-1/4 hidden lg:block opacity-80 pointer-events-none">
            <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${collectionHeroLeft})` }} />
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-1/4 hidden lg:block opacity-80 pointer-events-none">
            <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${collectionHeroRight})` }} />
          </div>
        </section>

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
                    if (currentContext) {
                      const id = currentContext.id || currentContext._id;
                      navigate(`/collection?category=${id}&name=${encodeURIComponent(currentContext.name)}`);
                    } else {
                      navigate('/collection');
                    }
                  }}
                  className={`px-5 py-2.5 text-[10px] font-medium tracking-[0.15em] uppercase border-b-2 transition-colors whitespace-nowrap ${(!categoryParam || (currentContext && (categoryParam === String(currentContext.id || currentContext._id) || String(currentContext.name).toLowerCase() === String(categoryParam).toLowerCase())))
                      ? 'border-primary text-primary'
                      : 'border-transparent text-secondary hover:text-primary'
                    }`}
                >
                  {currentContext ? `All ${currentContext.name}` : 'All Products'}
                </button>

                {/* Subcategories / Siblings tabs */}
                {siblings.map((cat: Category) => {
                  const catId = String(cat.id || cat._id);
                  return (
                    <button
                      key={catId}
                      onClick={() =>
                        navigate(`/collection?category=${catId}&name=${encodeURIComponent(cat.name)}`)
                      }
                      className={`px-5 py-2.5 text-[10px] font-medium tracking-[0.15em] uppercase border-b-2 transition-colors whitespace-nowrap ${(categoryParam === catId || String(cat.name).toLowerCase() === String(categoryParam).toLowerCase())
                          ? 'border-primary text-primary'
                          : 'border-transparent text-secondary hover:text-primary'
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
        <div className="sticky top-[72px] z-40 bg-surface/90 backdrop-blur-md border-b border-outline-variant/30 py-2.5 px-outer-margin md:px-8 flex justify-between items-center gap-4">
          <div className="text-[9px] tracking-[0.18em] font-medium text-secondary uppercase whitespace-nowrap">
            {loading ? 'Loading…' : `Showing ${filteredAndSortedProducts.length} of ${total} products`}
          </div>
          <div className="flex items-center gap-4 font-label-caps text-label-caps text-primary relative">
            {/* Filter Toggle */}
            <button
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center gap-1 hover:text-secondary transition-colors cursor-pointer text-[9px] tracking-[0.2em] font-bold text-primary uppercase"
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

            {/* Grid / List Layout Switcher */}
            <div className="flex items-center gap-1.5">
              {/* List View */}
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center justify-center w-8 h-8 rounded-md transition-colors ${viewMode === 'list'
                    ? 'bg-outline-variant/30 text-primary'
                    : 'bg-outline-variant/10 text-secondary hover:bg-outline-variant/20 hover:text-primary'
                  }`}
                title="List View"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <rect x="1" y="1.75" width="12" height="1.5" rx="0.5" />
                  <rect x="1" y="4.75" width="12" height="1.5" rx="0.5" />
                  <rect x="1" y="7.75" width="12" height="1.5" rx="0.5" />
                  <rect x="1" y="10.75" width="12" height="1.5" rx="0.5" />
                </svg>
              </button>
              {/* 3 Column Grid */}
              <button
                onClick={() => setViewMode('grid-3')}
                className={`flex items-center justify-center w-8 h-8 rounded-md transition-colors ${viewMode === 'grid-3'
                    ? 'bg-outline-variant/30 text-primary'
                    : 'bg-outline-variant/10 text-secondary hover:bg-outline-variant/20 hover:text-primary'
                  }`}
                title="3 Columns Grid"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2.75" y="2" width="1.5" height="10" rx="0.5" />
                  <rect x="6.25" y="2" width="1.5" height="10" rx="0.5" />
                  <rect x="9.75" y="2" width="1.5" height="10" rx="0.5" />
                </svg>
              </button>
              {/* 4 Column Grid */}
              <button
                onClick={() => setViewMode('grid-4')}
                className={`flex items-center justify-center w-8 h-8 rounded-md transition-colors ${viewMode === 'grid-4'
                    ? 'bg-outline-variant/30 text-primary'
                    : 'bg-outline-variant/10 text-secondary hover:bg-outline-variant/20 hover:text-primary'
                  }`}
                title="4 Columns Grid"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
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

          {!loading && !error && filteredAndSortedProducts.length === 0 && (
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
              </div>
            ) : viewMode === 'grid-3' ? (
              <div className="grid grid-cols-3 gap-1 md:gap-1.5 animate-fade-in">
                {filteredAndSortedProducts.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
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
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-1 md:gap-1.5 animate-fade-in">
                {filteredAndSortedProducts.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
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
              </div>
            )
          )}

          {!loading && !error && filteredAndSortedProducts.length > 0 && (
            <div className="w-full flex justify-center mt-6 mb-2">
              <button className="border border-primary text-primary font-label-caps text-label-caps px-6 py-3 uppercase hover:bg-primary hover:text-on-primary transition-colors duration-300">
                Load More Products
              </button>
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
            {(selectedSizes.length > 0 || minPrice || maxPrice || currentSort !== 'FEATURED') && (
              <button
                onClick={() => {
                  setSelectedSizes([]);
                  setMinPrice('');
                  setMaxPrice('');
                  setCurrentSort('FEATURED');
                }}
                className="text-[9px] tracking-widest text-secondary hover:text-primary transition-colors font-label-caps font-bold cursor-pointer"
              >
                CLEAR ALL
              </button>
            )}
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
                        navigate(`/collection?category=${catId}&name=${encodeURIComponent(cat.name)}`);
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
            <h3 className="font-label-caps text-[10px] tracking-widest text-secondary uppercase font-bold mb-3">Price Range</h3>
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-secondary">₹</span>
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
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-secondary">₹</span>
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

        <div className="p-6 border-t border-outline-variant bg-surface mt-auto">
          <button
            onClick={() => setIsFilterOpen(false)}
            className="w-full py-4 bg-primary text-on-primary text-[10px] tracking-widest font-bold hover:bg-neutral-800 transition-colors uppercase font-label-caps cursor-pointer"
          >
            Apply Filters
          </button>
        </div>
      </div>

      <Footer />

      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </div>
  );
}
