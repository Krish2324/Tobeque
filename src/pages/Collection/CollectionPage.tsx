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
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [currentSort, setCurrentSort] = useState('FEATURED');

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
      .catch(() => {})
      .finally(() => setCategoriesLoading(false));
  }, []);

  // Compute what tabs to show based on the tree and current categoryParam
  const { currentContext, siblings } = useMemo(() => {
    if (!categoryParam) return { currentContext: null, siblings: categoriesTree };

    let foundNode: Category | null = null;
    let foundParent: Category | null = null;

    const dfs = (nodes: Category[], parent: Category | null) => {
      for (const n of nodes) {
        if (String(n.id || n._id) === categoryParam) {
          foundNode = n;
          foundParent = parent;
          return true;
        }
        if (n.subcategories && n.subcategories.length > 0) {
          if (dfs(n.subcategories, n)) return true;
        }
      }
      return false;
    };
    dfs(categoriesTree, null);

    if (foundNode) {
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

      <main className="pt-[72px]">
        {/* ── Hero banner ─────────────────────────────────────────────────── */}
        <section className="w-full bg-[#F5F5F0] min-h-[40vh] md:min-h-[50vh] py-10 md:py-16 px-outer-margin relative overflow-hidden flex items-center justify-center">
          <div className="max-w-[1600px] mx-auto flex flex-col items-center justify-center text-center relative z-10">
            <p className="text-[9px] tracking-[0.35em] text-secondary uppercase font-medium mb-2">
              Season Collection
            </p>
            <h1 className="font-display-lg text-display-lg text-primary mb-4 uppercase">
              {displayTitle}
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
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
        <div className="w-full border-b border-outline-variant overflow-x-auto">
          <div className="flex items-center gap-0 min-w-max px-4 md:px-8">
            {categoriesLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="mx-3 h-3 w-16 bg-surface-container animate-pulse rounded my-4" />
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
                  className={`px-5 py-4 text-[10px] font-medium tracking-[0.15em] uppercase border-b-2 transition-colors whitespace-nowrap ${
                    (!categoryParam || (currentContext && categoryParam === String(currentContext.id || currentContext._id)))
                      ? 'border-primary text-primary'
                      : 'border-transparent text-secondary hover:text-primary'
                  }`}
                >
                  {currentContext ? `All ${currentContext.name}` : 'All Products'}
                </button>

                {/* Subcategories / Siblings tabs */}
                {siblings.map(cat => {
                  const catId = String(cat.id || cat._id);
                  return (
                    <button
                      key={catId}
                      onClick={() =>
                        navigate(`/collection?category=${catId}&name=${encodeURIComponent(cat.name)}`)
                      }
                      className={`px-5 py-4 text-[10px] font-medium tracking-[0.15em] uppercase border-b-2 transition-colors whitespace-nowrap ${
                        categoryParam === catId
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
        <div className="sticky top-[72px] z-40 bg-surface-container-lowest border-b border-outline-variant py-3 px-outer-margin md:px-6 flex justify-between items-center gap-4">
          <div className="font-body-sm text-body-sm text-on-surface-variant">
            {loading ? 'Loading…' : `${total} item${total === 1 ? '' : 's'}`}
          </div>
          <div className="flex items-center gap-6 font-label-caps text-label-caps text-primary relative">
            <div className="relative">
              <button
                className="flex items-center gap-2 hover:opacity-70 transition-opacity cursor-pointer"
                onClick={() => setIsSortOpen(!isSortOpen)}
              >
                SORT: {currentSort}
                <span className={`material-symbols-outlined text-[18px] transition-transform ${isSortOpen ? 'rotate-180' : ''}`}>
                  expand_more
                </span>
              </button>
              {isSortOpen && (
                <div className="absolute top-full right-0 mt-4 bg-surface-container border border-outline-variant shadow-lg z-50 min-w-[200px] flex flex-col">
                  {['FEATURED', 'NEWEST', 'PRICE: LOW TO HIGH', 'PRICE: HIGH TO LOW'].map(opt => (
                    <button
                      key={opt}
                      className={`text-left px-6 py-3 text-sm font-label-caps tracking-wider transition-colors cursor-pointer ${
                        currentSort === opt
                          ? 'bg-primary/10 text-primary font-bold'
                          : 'text-on-surface hover:bg-surface-container-highest'
                      }`}
                      onClick={() => { setCurrentSort(opt); setIsSortOpen(false); }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Product Grid ─────────────────────────────────────────────────── */}
        <section className="w-full px-1 md:px-2 py-8">
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

          {!loading && !error && liveProducts.length === 0 && (
            <div className="w-full flex flex-col items-center justify-center py-24 gap-4 text-center px-4">
              <span className="material-symbols-outlined text-5xl text-on-surface-variant">inventory_2</span>
              <p className="font-headline-sm text-primary">
                {categoryNameParam
                  ? `No products in "${decodeURIComponent(categoryNameParam)}" yet`
                  : 'No products available yet'}
              </p>
              <p className="text-on-surface-variant font-body-md text-body-md max-w-sm">
                Products added from the admin panel will appear here once published.
              </p>
            </div>
          )}

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

          {!loading && !error && liveProducts.length > 0 && (
            <div className="w-full flex justify-center mt-16 mb-8">
               <button className="border border-primary text-primary font-label-caps text-label-caps px-8 py-4 uppercase hover:bg-primary hover:text-on-primary transition-colors duration-300">
                Load More Products
              </button>
            </div>
          )}
        </section>
      </main>

      <Footer />

      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </div>
  );
}
