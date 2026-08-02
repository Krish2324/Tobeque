import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { SearchModal } from '../SearchModal/SearchModal';
import type { Product } from '../ProductCard';
import logoImage from '../../assets/Tobeque-Logo-290x57.webp';
import api from '../../services/api';

interface SubCategoryItem {
  id: string;
  name: string;
  slug: string;
  path: string;
}

interface MainCategoryItem {
  id: string;
  name: string;
  slug: string;
  path: string;
  subcategories?: SubCategoryItem[];
}

const FALLBACK_CATEGORIES: MainCategoryItem[] = [
  { id: 'tops', name: 'TOPS', slug: 'tops', path: '/product-category/tops' },
  { id: 'dresses', name: 'DRESSES', slug: 'dresses', path: '/product-category/dresses' },
  { id: 'shirts-and-blouses', name: 'SHIRTS AND BLOUSES', slug: 'shirts-and-blouses', path: '/product-category/shirts-and-blouses' },
  { id: 't-shirts-and-vests', name: 'T-SHIRTS AND VESTS', slug: 't-shirts-and-vests', path: '/product-category/t-shirts-and-vests' },
  { id: 'jeans-and-pants', name: 'JEANS AND PANTS', slug: 'jeans-and-pants', path: '/product-category/jeans-and-pants' },
  { id: 'skirts-and-shorts', name: 'SKIRTS AND SHORTS', slug: 'skirts-and-shorts', path: '/product-category/skirts-and-shorts' },
];

const NEW_COLLECTION = [
  { name: 'NEW IN', path: '/product-category/new-in' },
  { name: 'SUMMER-26', path: '/product-category/summer-26' },
  { name: 'CUSTOMISABLE', path: '/product-category/customisable' },
  { name: 'COLLABORATION', path: '/product-category/collaboration' },
];

const RECOMMENDED = [
  { name: 'STYLE JOURNAL', path: '/product-category/style-journal' },
  { name: 'STEAL THE STYLE', path: '/product-category/steal-the-style' },
];

const EXCLUDED_CATEGORIES = new Set([
  'NEW IN',
  'SUMMER-26',
  'CUSTOMISABLE',
  'COLLABORATION',
  'STYLE JOURNAL',
  'STEAL THE STYLE',
  'FASHION',
]);

const normalizeCategoryName = (name: string): string => {
  return name
    .toUpperCase()
    .replace(/\s*&\s*/g, ' AND ')
    .replace(/\s+/g, ' ')
    .trim();
};

interface NavbarProps {
  onSearchProductSelect?: (product: Product) => void;
}

export function Navbar({ onSearchProductSelect }: NavbarProps) {
  const navigate = useNavigate();
  const { setIsCartOpen, cartCount } = useCart();
  const { isAuthenticated, openLoginModal, logout } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mainCategories, setMainCategories] = useState<MainCategoryItem[]>([]);

  useEffect(() => {
    api.get('/api/categories/public')
      .then(res => {
        if (res.data.success && Array.isArray(res.data.categories)) {
          const items: MainCategoryItem[] = res.data.categories.map((cat: any) => {
            const catId = cat.id || cat._id;
            const catSlug = cat.slug || cat.name;
            const path = `/product-category/${encodeURIComponent(String(catSlug).toLowerCase())}?category=${catId}&name=${encodeURIComponent(cat.name)}`;
            
            return {
              id: catId,
              name: cat.name,
              slug: catSlug,
              path
            };
          });
          setMainCategories(items);
        }
      })
      .catch(() => {});
  }, []);

  const combinedList = [...FALLBACK_CATEGORIES, ...mainCategories];
  const displayMainCategories: MainCategoryItem[] = [];
  const seenNames = new Set<string>();

  combinedList.forEach(item => {
    const norm = normalizeCategoryName(item.name);
    if (!EXCLUDED_CATEGORIES.has(norm) && !norm.includes('>') && !seenNames.has(norm)) {
      seenNames.add(norm);
      displayMainCategories.push({
        ...item,
        name: item.name.toUpperCase().replace(/\s*&\s*/g, ' AND ')
      });
    }
  });

  // Sort displayMainCategories alphabetically for a clean menu
  displayMainCategories.sort((a, b) => a.name.localeCompare(b.name));

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isTopTransparentPage = window.location.pathname === '/' || window.location.pathname === '/collection' || window.location.pathname.startsWith('/product-category/');
  const isTransparent = isTopTransparentPage && !isScrolled;

  return (
    <>
      <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isTransparent ? 'bg-transparent border-transparent backdrop-blur-none' : 'bg-white/40 backdrop-blur-lg border-b border-outline-variant/20'}`}>
        <div className="flex justify-between items-center w-full px-4 md:px-outer-margin py-1.5 md:py-1.5 max-w-full mx-auto">

          {/* Mobile Menu Toggle - Left (Visible only on mobile) */}
          <div className="flex md:hidden flex-1 items-center justify-start">
            <button 
              onClick={() => setIsMobileMenuOpen(true)} 
              className="text-secondary p-1 -ml-1 transition-transform active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined font-light !text-[22px]">menu</span>
            </button>
          </div>

          {/* Navigation Links - Left (Desktop) */}
          <nav className="hidden md:flex flex-1 items-center justify-start gap-8">

            {/* Shop — Mega Menu trigger */}
            <div className="relative group py-4">
              <button 
                onClick={() => navigate('/product-category/all')}
                className="text-on-surface-variant dark:text-on-secondary-fixed-variant group-hover:text-primary dark:group-hover:text-on-primary-fixed transition-colors duration-300 font-label-caps text-[10px] tracking-wider uppercase flex items-center gap-1 cursor-pointer"
              >
                Shop
                <span className="material-symbols-outlined !text-[13px] transition-transform duration-300 group-hover:rotate-180">keyboard_arrow_down</span>
              </button>

              {/* Mega Menu Dropdown */}
              <div className="absolute top-full -left-4 w-max min-w-[620px] bg-[#181818] text-white border border-neutral-800 shadow-[0_16px_40px_rgba(0,0,0,0.5)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-50 p-10">
                <div className="grid grid-cols-3 gap-12">

                  {/* Col 1: CATEGORIES */}
                  <div className="flex flex-col">
                    <h4 className="font-label-caps text-[11px] tracking-[0.22em] text-white font-bold uppercase border-b border-white/20 pb-3 mb-5">
                      CATEGORIES
                    </h4>
                    <div className="flex flex-col gap-3 max-h-[360px] overflow-y-auto pr-2">
                      {displayMainCategories.map(item => (
                        <Link
                          key={item.id || item.name}
                          to={item.path}
                          className="text-[10px] tracking-[0.18em] font-label-caps text-gray-300 hover:text-white transition-colors uppercase font-medium"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Col 2: NEW COLLECTION */}
                  <div className="flex flex-col">
                    <h4 className="font-label-caps text-[11px] tracking-[0.22em] text-white font-bold uppercase border-b border-white/20 pb-3 mb-5">
                      NEW COLLECTION
                    </h4>
                    <div className="flex flex-col gap-3">
                      {NEW_COLLECTION.map((item, i) => (
                        <Link
                          key={item.name}
                          to={item.path}
                          className="text-[10px] tracking-[0.18em] font-label-caps text-gray-300 hover:text-white transition-colors uppercase font-medium flex items-center gap-2"
                        >
                          {item.name}
                          {i === 0 && (
                            <span className="text-[8px] font-bold tracking-widest bg-black text-white px-1.5 py-[2px] uppercase border border-white/30">
                              NEW
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Col 3: RECOMMENDED + View All CTA */}
                  <div className="flex flex-col justify-between">
                    <div className="flex flex-col">
                      <h4 className="font-label-caps text-[11px] tracking-[0.22em] text-white font-bold uppercase border-b border-white/20 pb-3 mb-5">
                        RECOMMENDED
                      </h4>
                      <div className="flex flex-col gap-3">
                        {RECOMMENDED.map(item => (
                          <Link
                            key={item.name}
                            to={item.path}
                            className="text-[10px] tracking-[0.18em] font-label-caps text-gray-300 hover:text-white transition-colors uppercase font-medium"
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* View All CTA at bottom */}
                    <div className="pt-6 border-t border-white/20 mt-6">
                      <Link
                        to="/product-category/all"
                        className="text-[9px] font-label-caps tracking-[0.25em] uppercase text-gray-400 hover:text-white transition-colors flex items-center gap-1.5"
                      >
                        VIEW ALL
                        <span className="material-symbols-outlined text-[13px]">arrow_right_alt</span>
                      </Link>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* New Arrivals */}
            <Link
              className="text-on-surface-variant dark:text-on-secondary-fixed-variant hover:text-primary dark:hover:text-on-primary-fixed transition-colors duration-300 font-label-caps text-[10px] tracking-wider uppercase"
              to="/"
            >
              New Arrivals
            </Link>
            <Link
              className="text-on-surface-variant dark:text-on-secondary-fixed-variant hover:text-primary dark:hover:text-on-primary-fixed transition-colors duration-300 font-label-caps text-[10px] tracking-wider uppercase"
              to="/collection"
            >
              Collections
            </Link>

            <Link
              className="text-on-surface-variant dark:text-on-secondary-fixed-variant hover:text-primary dark:hover:text-on-primary-fixed transition-colors duration-300 font-label-caps text-[10px] tracking-wider uppercase"
              to="/about"
            >
              About
            </Link>
          </nav>

          {/* Logo - Centered */}
          <div className="flex-1 flex justify-center">
            <Link to="/">
              <img src={logoImage} alt="Tobeque Logo" className="h-[14px] md:h-[24px] object-contain opacity-90" />
            </Link>
          </div>

          {/* Trailing Icons - Right (Desktop) */}
          <div className="hidden md:flex flex-1 shrink-0 items-center justify-end gap-3 text-secondary dark:text-on-primary-fixed">
            <button
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search"
              className="hover:text-primary dark:hover:text-on-primary-fixed transition-colors duration-300 cursor-pointer flex items-center"
            >
              <span className="material-symbols-outlined !text-[18px]" data-icon="search">
                search
              </span>
            </button>
            {isAuthenticated ? (
              <div className="relative">
                <button
                  aria-label="Account"
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="hover:text-primary dark:hover:text-on-primary-fixed transition-colors duration-300 cursor-pointer flex items-center"
                >
                  <span className="material-symbols-outlined !text-[18px]" data-icon="person">
                    person
                  </span>
                </button>
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg border border-outline-variant py-2 z-50">
                    <Link to="/profile" className="block px-4 py-2 text-[11px] tracking-wider uppercase text-on-background hover:bg-surface-container transition-colors">My Profile</Link>
                    <button
                      onClick={() => { logout?.(); setIsProfileDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2 text-[11px] tracking-wider uppercase text-red-600 hover:bg-surface-container transition-colors cursor-pointer"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                aria-label="Login"
                onClick={() => openLoginModal()}
                className="hover:text-primary dark:hover:text-on-primary-fixed transition-colors duration-300 cursor-pointer flex items-center"
              >
                <span className="material-symbols-outlined !text-[18px]" data-icon="person">
                  person
                </span>
              </button>
            )}
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="Shopping Bag"
              className="hover:text-primary dark:hover:text-on-primary-fixed transition-colors duration-300 relative cursor-pointer flex items-center"
            >
              <span
                className="material-symbols-outlined !text-[18px]"
                data-icon="shopping_bag"
              >
                shopping_bag
              </span>
              <span className="absolute -top-1.5 -right-1.5 bg-primary text-on-primary text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
                {cartCount}
              </span>
            </button>
          </div>

          {/* Mobile Right Icons (Search & Cart) - Visible only on mobile */}
          <div className="flex md:hidden flex-1 items-center justify-end gap-2.5">
            {/* Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search"
              className="text-secondary p-1 transition-transform active:scale-95 cursor-pointer flex items-center justify-center"
            >
              <span className="material-symbols-outlined font-light !text-[20px]">search</span>
            </button>

            {/* Shopping Bag Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="Shopping Bag"
              className="text-secondary p-1 -mr-1 relative transition-transform active:scale-95 cursor-pointer flex items-center justify-center"
            >
              <span className="material-symbols-outlined font-light !text-[20px]">shopping_bag</span>
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold shadow-md">
                {cartCount}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[9999] md:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          {/* Drawer */}
          <div className="absolute top-0 left-0 bottom-0 w-[85%] max-w-[320px] bg-[#dcdcdc] text-black shadow-2xl flex flex-col animate-in slide-in-from-left duration-300 border-r border-gray-300">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-300/70">
              <img src={logoImage} alt="Logo" className="h-[22px]" />
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-700 hover:text-black cursor-pointer p-1 transition-transform active:scale-90">
                <span className="material-symbols-outlined text-[24px]">close</span>
              </button>
            </div>
            
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto py-5 px-6 flex flex-col gap-6">
              
              {/* Professional Account / Profile Card */}
              {isAuthenticated ? (
                <button
                  onClick={() => { setIsMobileMenuOpen(false); navigate('/profile'); }}
                  className="w-full flex items-center justify-between bg-white/90 hover:bg-white border border-gray-300/80 p-3.5 rounded-2xl transition-all cursor-pointer shadow-sm group text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs shadow-sm">
                      <span className="material-symbols-outlined text-[18px]">person</span>
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-black">My Account</span>
                      <span className="text-[9px] text-gray-500">Orders & Profile Details</span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-[16px] text-gray-500 group-hover:text-black group-hover:translate-x-0.5 transition-all">chevron_right</span>
                </button>
              ) : (
                <button
                  onClick={() => { setIsMobileMenuOpen(false); openLoginModal(); }}
                  className="w-full flex items-center justify-between bg-black text-white p-3.5 rounded-2xl transition-all cursor-pointer shadow-md hover:bg-neutral-800 active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[20px]">person</span>
                    <span className="text-[11px] font-bold uppercase tracking-widest">Sign In / Register</span>
                  </div>
                  <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </button>
              )}

              {/* Navigation Links */}
              <div className="flex flex-col gap-5 pt-1">
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-[12px] font-bold tracking-widest uppercase text-black flex items-center justify-between hover:text-gray-700 transition-colors">
                  NEW ARRIVALS
                  <span className="material-symbols-outlined text-[16px] text-gray-600">chevron_right</span>
                </Link>

                <Link to="/collection" onClick={() => setIsMobileMenuOpen(false)} className="text-[12px] font-bold tracking-widest uppercase text-black flex items-center justify-between hover:text-gray-700 transition-colors">
                  COLLECTIONS
                  <span className="material-symbols-outlined text-[16px] text-gray-600">chevron_right</span>
                </Link>
                
                {/* Shop By Category */}
                <div className="flex flex-col gap-3 mt-1">
                  <h4 className="text-[10px] uppercase tracking-[0.25em] text-gray-700 font-bold flex items-center gap-2">
                    <span className="w-6 h-[1px] bg-gray-500"></span> SHOP BY CATEGORY
                  </h4>
                  <div className="grid grid-cols-1 gap-2.5 pl-4 border-l-2 border-gray-400/40">
                    {displayMainCategories.map((cat) => (
                      <Link 
                        key={cat.id || cat.name} 
                        to={cat.path} 
                        onClick={() => setIsMobileMenuOpen(false)} 
                        className="text-[11px] font-bold tracking-widest uppercase text-gray-800 hover:text-black transition-colors block py-0.5"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* New Collection */}
                <div className="flex flex-col gap-3 mt-1">
                  <h4 className="text-[10px] uppercase tracking-[0.25em] text-gray-700 font-bold flex items-center gap-2">
                    <span className="w-6 h-[1px] bg-gray-500"></span> NEW COLLECTION
                  </h4>
                  <div className="grid grid-cols-1 gap-2.5 pl-4 border-l-2 border-gray-400/40">
                    {NEW_COLLECTION.map((item, i) => (
                      <Link 
                        key={item.name} 
                        to={item.path} 
                        onClick={() => setIsMobileMenuOpen(false)} 
                        className="text-[11px] font-bold tracking-widest uppercase text-gray-800 hover:text-black transition-colors flex items-center gap-2 py-0.5"
                      >
                        {item.name}
                        {i === 0 && (
                          <span className="text-[8px] font-bold tracking-widest bg-black text-white px-1.5 py-[2px] uppercase border border-white/30 rounded-none">
                            NEW
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Recommended */}
                <div className="flex flex-col gap-3 mt-1">
                  <h4 className="text-[10px] uppercase tracking-[0.25em] text-gray-700 font-bold flex items-center gap-2">
                    <span className="w-6 h-[1px] bg-gray-500"></span> RECOMMENDED
                  </h4>
                  <div className="grid grid-cols-1 gap-2.5 pl-4 border-l-2 border-gray-400/40">
                    {RECOMMENDED.map((item) => (
                      <Link 
                        key={item.name} 
                        to={item.path} 
                        onClick={() => setIsMobileMenuOpen(false)} 
                        className="text-[11px] font-bold tracking-widest uppercase text-gray-800 hover:text-black transition-colors block py-0.5"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>

                <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-[12px] font-bold tracking-widest uppercase text-black flex items-center justify-between hover:text-gray-700 transition-colors">
                  ABOUT
                  <span className="material-symbols-outlined text-[16px] text-gray-600">chevron_right</span>
                </Link>

                <Link to="/product-category/all" onClick={() => setIsMobileMenuOpen(false)} className="text-[12px] font-bold tracking-widest uppercase text-black flex items-center justify-between mt-1 hover:text-gray-700 transition-colors">
                  BEST SELLERS
                  <span className="material-symbols-outlined text-[16px] text-gray-600">chevron_right</span>
                </Link>
              </div>

              {/* Logout Button (if logged in) */}
              {isAuthenticated && (
                <button 
                  onClick={() => { logout?.(); setIsMobileMenuOpen(false); }}
                  className="mt-auto flex items-center justify-center gap-2 text-red-600 border border-red-300 bg-red-50 py-3 rounded-xl uppercase tracking-widest text-[10px] font-bold cursor-pointer active:scale-95 transition-transform"
                >
                  <span className="material-symbols-outlined text-[16px]">logout</span>
                  Sign Out
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onProductSelect={(product) => {
          setIsSearchOpen(false);
          if (onSearchProductSelect) {
            onSearchProductSelect(product);
          }
        }}
      />
    </>
  );
}
