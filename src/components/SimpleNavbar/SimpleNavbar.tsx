import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { SearchModal } from "../SearchModal/SearchModal";
import type { Product } from "../ProductCard";
import logoImage from "../../assets/Tobeque-Logo-290x57.webp";

interface SimpleNavbarProps {
  onSearchProductSelect?: (product: Product) => void;
}

export function SimpleNavbar({ onSearchProductSelect }: SimpleNavbarProps) {
  const navigate = useNavigate();
  const { cart, setIsCartOpen } = useCart();
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

  const isTopTransparentPage = window.location.pathname === '/' || window.location.pathname === '/collection' || window.location.pathname.startsWith('/product/');
  const isTransparent = isTopTransparentPage && !isScrolled;

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 flex justify-between items-center px-4 md:px-8 py-1.5 md:py-4 ${isTransparent ? 'bg-transparent border-transparent backdrop-blur-none' : 'bg-white/40 backdrop-blur-lg border-b border-outline-variant/20'}`}>
        
        {/* Mobile Hamburger - Left */}
        <div className="flex md:hidden flex-1 justify-start">
          <button 
            onClick={() => setIsMobileMenuOpen(true)} 
            className="text-secondary p-1 -ml-1 transition-transform active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined font-light !text-[22px]">menu</span>
          </button>
        </div>

        {/* Logo - Centered */}
        <div className="flex-1 flex justify-center">
          <Link to="/">
            <img src={logoImage} alt="Tobeque Logo" className="h-[14px] md:h-[24px] object-contain opacity-90" />
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex flex-1 justify-center space-x-8">
          <Link className="text-secondary hover:text-primary transition-colors duration-300 text-label-caps font-label-caps" to="/collection">NEW ARRIVAL</Link>
          <Link className="text-secondary hover:text-primary transition-colors duration-300 text-label-caps font-label-caps" to="/collection?category=Tops">TOPS</Link>
          <Link className="text-secondary hover:text-primary transition-colors duration-300 text-label-caps font-label-caps" to="/collection?category=Dresses">DRESSES</Link>
          <Link className="text-secondary hover:text-primary transition-colors duration-300 text-label-caps font-label-caps" to="/collection?category=Jeans and Pants">JEANS AND PANTS</Link>
          <Link className="text-secondary hover:text-primary transition-colors duration-300 text-label-caps font-label-caps" to="/collection?category=Skirts and Shorts">SKIRTS AND SHORTS</Link>
          <Link className="text-secondary hover:text-primary transition-colors duration-300 text-label-caps font-label-caps" to="/collection">BEST SELLERS</Link>
        </div>

        {/* Trailing Actions - Right (Desktop) */}
        <div className="hidden md:flex flex-1 justify-end items-center space-x-6 text-primary">
          
          {isAuthenticated ? (
            <div className="relative">
              <button
                aria-label="Account"
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="hover:opacity-70 transition-opacity cursor-pointer flex items-center"
              >
                <span className="material-symbols-outlined">person</span>
              </button>
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg border border-outline-variant py-2 z-50">
                  <Link to="/profile" className="block px-4 py-2 text-sm text-on-background hover:bg-surface-container transition-colors">My Profile</Link>
                  <button 
                    onClick={() => { logout?.(); setIsProfileDropdownOpen(false); }} 
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-surface-container transition-colors cursor-pointer"
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
              className="hover:opacity-70 transition-opacity cursor-pointer flex items-center"
            >
              <span className="material-symbols-outlined">person</span>
            </button>
          )}

          {/* Cart Icon trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            aria-label="shopping_bag"
            className="hover:opacity-70 transition-opacity relative"
          >
            <span className="material-symbols-outlined">shopping_bag</span>
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-2 bg-primary text-on-primary text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                {cart.reduce((qty, item) => qty + item.quantity, 0)}
              </span>
            )}
          </button>
          
          <button onClick={() => setIsSearchOpen(true)} aria-label="search" className="hover:opacity-70 transition-opacity cursor-pointer">
            <span className="material-symbols-outlined">search</span>
          </button>
        </div>

        {/* Mobile Cart Icon - Right (Visible only on mobile) */}
        <div className="flex md:hidden flex-1 items-center justify-end">
          <button
            onClick={() => setIsCartOpen(true)}
            className="text-secondary p-1 -mr-1 relative transition-transform active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined font-light !text-[20px]">shopping_bag</span>
            {cart.length > 0 && (
              <span className="absolute top-0.5 right-0.5 bg-red-500 text-white text-[8px] w-2.5 h-2.5 rounded-full flex items-center justify-center font-bold">
                {cart.reduce((qty, item) => qty + item.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </nav>

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
                <Link to="/collection" onClick={() => setIsMobileMenuOpen(false)} className="text-[13px] font-bold tracking-widest uppercase text-primary flex items-center justify-between">
                  New Arrival
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
