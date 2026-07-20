import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { SearchModal } from '../SearchModal/SearchModal';
import type { Product } from '../ProductCard';
import logoImage from '../../assets/Tobeque-Logo-290x57.webp';

const CATEGORIES = [
  { name: 'Tops', path: '/collection?category=Tops&name=Tops' },
  { name: 'Dresses', path: '/collection?category=Dresses&name=Dresses' },
  { name: 'Shirts and Blouses', path: '/collection?category=Shirts and Blouses&name=Shirts and Blouses' },
  { name: 'T-Shirts and Vests', path: '/collection?category=T-Shirts and Vests&name=T-Shirts and Vests' },
  { name: 'Jeans and Pants', path: '/collection?category=Jeans and Pants&name=Jeans and Pants' },
  { name: 'Skirts and Shorts', path: '/collection?category=Skirts and Shorts&name=Skirts and Shorts' },
];

const NEW_COLLECTION = [
  { name: 'New In', path: '/collection?category=New In&name=New In' },
  { name: 'Summer-26', path: '/collection?category=Summer-26&name=Summer-26' },
  { name: 'Customisable', path: '/collection?category=Customisable&name=Customisable' },
  { name: 'Collaboration', path: '/collection?category=Collaboration&name=Collaboration' },
];

const RECOMMENDED = [
  { name: 'Style Journal', path: '/collection?category=Style Journal&name=Style Journal' },
  { name: 'Steal The Style', path: '/collection?category=Steal The Style&name=Steal The Style' },
];

interface NavbarProps {
  onSearchProductSelect?: (product: Product) => void;
}

export function Navbar({ onSearchProductSelect }: NavbarProps) {
  const navigate = useNavigate();
  const { setIsCartOpen, wishlistItems } = useCart();
  const { isAuthenticated, openLoginModal, logout } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isTopTransparentPage = window.location.pathname === '/' || window.location.pathname === '/collection';
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
                onClick={() => navigate('/collection')}
                className="text-on-surface-variant dark:text-on-secondary-fixed-variant group-hover:text-primary dark:group-hover:text-on-primary-fixed transition-colors duration-300 font-label-caps text-[10px] tracking-wider uppercase flex items-center gap-1 cursor-pointer"
              >
                Shop
                <span className="material-symbols-outlined !text-[13px] transition-transform duration-300 group-hover:rotate-180">keyboard_arrow_down</span>
              </button>

              {/* Mega Menu Dropdown */}
              <div className="absolute top-full -left-4 w-max min-w-[540px] bg-background dark:bg-neutral-900 border border-outline-variant shadow-[0_8px_32px_-8px_rgba(0,0,0,0.12)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-50">
                {/* Thin accent bar on top */}
                <div className="h-[2px] w-full bg-primary" />
                <div className="p-10 grid grid-cols-3 gap-10">

                  {/* Col 1: Categories */}
                  <div className="flex flex-col gap-5">
                    <h4 className="font-label-caps text-[10px] tracking-[0.25em] text-primary dark:text-white font-bold uppercase border-b border-outline-variant pb-3">
                      Categories
                    </h4>
                    <div className="flex flex-col gap-3">
                      {CATEGORIES.map(item => (
                        <Link
                          key={item.name}
                          to={item.path}
                          className="text-[10px] tracking-wider font-label-caps text-secondary dark:text-gray-400 hover:text-primary dark:hover:text-white transition-colors uppercase"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Col 2: New Collection */}
                  <div className="flex flex-col gap-5">
                    <h4 className="font-label-caps text-[10px] tracking-[0.25em] text-primary dark:text-white font-bold uppercase border-b border-outline-variant pb-3">
                      New Collection
                    </h4>
                    <div className="flex flex-col gap-3">
                      {NEW_COLLECTION.map((item, i) => (
                        <Link
                          key={item.name}
                          to={item.path}
                          className="text-[10px] tracking-wider font-label-caps text-secondary dark:text-gray-400 hover:text-primary dark:hover:text-white transition-colors uppercase flex items-center gap-2"
                        >
                          {item.name}
                          {i === 0 && (
                            <span className="text-[8px] font-bold tracking-widest bg-primary text-white px-1.5 py-[2px] uppercase">
                              New
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Col 3: Recommended + View All CTA */}
                  <div className="flex flex-col gap-5">
                    <h4 className="font-label-caps text-[10px] tracking-[0.25em] text-primary dark:text-white font-bold uppercase border-b border-outline-variant pb-3">
                      Recommended
                    </h4>
                    <div className="flex flex-col gap-3">
                      {RECOMMENDED.map(item => (
                        <Link
                          key={item.name}
                          to={item.path}
                          className="text-[10px] tracking-wider font-label-caps text-secondary dark:text-gray-400 hover:text-primary dark:hover:text-white transition-colors uppercase"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>

                    {/* View All CTA at bottom */}
                    <div className="mt-auto pt-6 border-t border-outline-variant">
                      <Link
                        to="/collection"
                        className="text-[9px] font-label-caps tracking-widest uppercase text-primary hover:opacity-70 transition-opacity flex items-center gap-1"
                      >
                        View All
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

          {/* Logo - Centered on Mobile, Left on Desktop */}
          <div className="flex-1 flex justify-center md:justify-start">
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
              aria-label="Wishlist"
              className="hover:text-primary dark:hover:text-on-primary-fixed transition-colors duration-300 cursor-pointer flex items-center"
              onClick={() => {
                if (isAuthenticated) {
                  navigate('/profile', { state: { activeTab: 'wishlist' } });
                } else {
                  openLoginModal();
                }
              }}
            >
              <span className="material-symbols-outlined !text-[18px]" data-icon="favorite">
                favorite
              </span>
            </button>
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
              <span className="absolute -top-1.5 -right-1.5 bg-primary text-on-primary text-[8px] w-3 h-3 rounded-full flex items-center justify-center font-bold">
                {wishlistItems?.length || 0}
              </span>
            </button>
          </div>

          {/* Mobile Cart Icon - Right (Visible only on mobile) */}
          <div className="flex md:hidden flex-1 items-center justify-end">
            <button
              onClick={() => setIsCartOpen(true)}
              className="text-secondary p-1 -mr-1 relative transition-transform active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined font-light !text-[20px]">shopping_bag</span>
              <span className="absolute top-0.5 right-0.5 bg-red-500 text-white text-[8px] w-2.5 h-2.5 rounded-full flex items-center justify-center font-bold">
                {wishlistItems?.length || 0}
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
          <div className="absolute top-0 left-0 bottom-0 w-[85%] max-w-[320px] bg-white/60 backdrop-blur-2xl shadow-2xl flex flex-col animate-in slide-in-from-left duration-300 border-r border-white/40">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-outline-variant/50">
              <img src={logoImage} alt="Logo" className="h-[22px]" />
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-secondary hover:text-primary cursor-pointer p-1 transition-transform active:scale-90">
                <span className="material-symbols-outlined text-[24px]">close</span>
              </button>
            </div>
            
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto py-6 px-6 flex flex-col gap-8">
              
              {/* Navigation Links */}
              <div className="flex flex-col gap-6">
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-[13px] font-bold tracking-widest uppercase text-primary flex items-center justify-between">
                  New Arrivals
                  <span className="material-symbols-outlined text-[16px] text-secondary">chevron_right</span>
                </Link>
                
                {/* Categories */}
                <div className="flex flex-col gap-4 mt-2">
                  <h4 className="text-[10px] uppercase tracking-[0.25em] text-gray-800 font-bold flex items-center gap-2">
                    <span className="w-8 h-[1px] bg-gray-400"></span> Shop By Category
                  </h4>
                  <div className="grid grid-cols-1 gap-3 pl-4 border-l-2 border-outline-variant/30">
                    <Link to="/collection?category=Tops" onClick={() => setIsMobileMenuOpen(false)} className="text-[11px] font-bold tracking-widest uppercase text-gray-800 hover:text-primary">
                      Tops
                    </Link>
                    <Link to="/collection?category=Dresses" onClick={() => setIsMobileMenuOpen(false)} className="text-[11px] font-bold tracking-widest uppercase text-gray-800 hover:text-primary">
                      Dresses
                    </Link>
                    <Link to="/collection?category=Jeans and Pants" onClick={() => setIsMobileMenuOpen(false)} className="text-[11px] font-bold tracking-widest uppercase text-gray-800 hover:text-primary">
                      Jeans and Pants
                    </Link>
                    <Link to="/collection?category=Skirts and Shorts" onClick={() => setIsMobileMenuOpen(false)} className="text-[11px] font-bold tracking-widest uppercase text-gray-800 hover:text-primary">
                      Skirts and Shorts
                    </Link>
                  </div>
                </div>

                <Link to="/collection" onClick={() => setIsMobileMenuOpen(false)} className="text-[13px] font-bold tracking-widest uppercase text-primary flex items-center justify-between mt-4">
                  Best Sellers
                  <span className="material-symbols-outlined text-[16px] text-secondary">chevron_right</span>
                </Link>
              </div>

              {/* Quick Icons */}
              <div className="flex items-center justify-between bg-slate-50/50 p-4 rounded-2xl border border-outline-variant/30">
                <button
                  onClick={() => { setIsMobileMenuOpen(false); setIsSearchOpen(true); }}
                  className="flex flex-col items-center gap-1.5 text-secondary hover:text-primary transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[24px]">search</span>
                  <span className="text-[9px] font-bold uppercase tracking-widest">Search</span>
                </button>
                <button
                  onClick={() => { 
                    setIsMobileMenuOpen(false);
                    if (isAuthenticated) navigate('/profile');
                    else openLoginModal();
                  }}
                  className="flex flex-col items-center gap-1.5 text-secondary hover:text-primary transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[24px]">person</span>
                  <span className="text-[9px] font-bold uppercase tracking-widest">{isAuthenticated ? 'Profile' : 'Login'}</span>
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    if (isAuthenticated) navigate('/profile', { state: { activeTab: 'wishlist' } });
                    else openLoginModal();
                  }}
                  className="flex flex-col items-center gap-1.5 text-secondary hover:text-primary transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[24px]">favorite</span>
                  <span className="text-[9px] font-bold uppercase tracking-widest">Wishlist</span>
                </button>
              </div>
              
              {/* Logout Button */}
              {isAuthenticated && (
                <button 
                  onClick={() => { logout?.(); setIsMobileMenuOpen(false); }}
                  className="mt-auto flex items-center justify-center gap-2 text-red-600 border border-red-200 bg-red-50/50 py-3.5 rounded-xl uppercase tracking-widest text-[11px] font-bold cursor-pointer active:scale-95 transition-transform"
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                  Logout
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
