import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { SearchModal } from '../SearchModal/SearchModal';
import type { Product } from '../ProductCard';

const CATEGORIES = [
  { name: 'Tops', path: '/collection' },
  { name: 'Dresses', path: '/collection' },
  { name: 'Shirts and Blouses', path: '/collection' },
  { name: 'T-Shirts and Vests', path: '/collection' },
  { name: 'Jeans and Pants', path: '/collection' },
  { name: 'Skirts and Shorts', path: '/collection' },
];

const NEW_COLLECTION = [
  { name: 'New In', path: '/collection' },
  { name: 'Summer-26', path: '/collection' },
  { name: 'Customisable', path: '/collection' },
  { name: 'Collaboration', path: '/collection' },
];

const RECOMMENDED = [
  { name: 'Style Journal', path: '/' },
  { name: 'Steal The Style', path: '/' },
];

interface NavbarProps {
  onSearchProductSelect?: (product: Product) => void;
}

export function Navbar({ onSearchProductSelect }: NavbarProps) {
  const { setIsCartOpen, wishlistItems } = useCart();
  const { isAuthenticated, openLoginModal, logout } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  return (
    <>
      <header className="bg-background dark:bg-background fixed top-0 w-full z-50 border-b border-outline-variant flat no shadows">
        <div className="flex justify-between items-center w-full px-outer-margin py-4 max-w-full mx-auto">
          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">

            {/* Shop — Mega Menu trigger */}
            <div className="relative group py-4">
              <button className="text-on-surface-variant dark:text-on-secondary-fixed-variant group-hover:text-primary dark:group-hover:text-on-primary-fixed transition-colors duration-300 font-label-caps text-label-caps flex items-center gap-1 cursor-default">
                Shop
                <span className="material-symbols-outlined text-[15px] transition-transform duration-300 group-hover:rotate-180">keyboard_arrow_down</span>
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
                          className="text-[11px] tracking-wider font-label-caps text-secondary dark:text-gray-400 hover:text-primary dark:hover:text-white transition-colors uppercase"
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
                          className="text-[11px] tracking-wider font-label-caps text-secondary dark:text-gray-400 hover:text-primary dark:hover:text-white transition-colors uppercase flex items-center gap-2"
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
                          className="text-[11px] tracking-wider font-label-caps text-secondary dark:text-gray-400 hover:text-primary dark:hover:text-white transition-colors uppercase"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>

                    {/* View All CTA at bottom */}
                    <div className="mt-auto pt-6 border-t border-outline-variant">
                      <Link
                        to="/collection"
                        className="text-[10px] font-label-caps tracking-widest uppercase text-primary hover:opacity-70 transition-opacity flex items-center gap-1"
                      >
                        View All
                        <span className="material-symbols-outlined text-sm">arrow_right_alt</span>
                      </Link>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* New Arrivals */}
            <Link
              className="text-on-surface-variant dark:text-on-secondary-fixed-variant hover:text-primary dark:hover:text-on-primary-fixed transition-colors duration-300 font-label-caps text-label-caps"
              to="/"
            >
              New Arrivals
            </Link>
            <Link
              className="text-on-surface-variant dark:text-on-secondary-fixed-variant hover:text-primary dark:hover:text-on-primary-fixed transition-all duration-300 font-label-caps text-label-caps border-b-2 border-transparent hover:border-primary pb-1"
              to="/collection"
            >
              Collections
            </Link>

            <Link
              className="text-on-surface-variant dark:text-on-secondary-fixed-variant hover:text-primary dark:hover:text-on-primary-fixed transition-all duration-300 font-label-caps text-label-caps border-b-2 border-transparent hover:border-primary pb-1"
              to="/about"
            >
              About
            </Link>
          </nav>

          {/* Brand Logo */}
          <div className="flex-1 flex justify-center md:absolute md:left-1/2 md:-translate-x-1/2">
            <Link
              className="font-display-lg text-headline-md tracking-widest text-primary dark:text-on-primary-fixed uppercase"
              to="/"
            >
              TOBEQUE
            </Link>
          </div>

          {/* Trailing Icons */}
          <div className="flex items-center gap-4 text-primary dark:text-on-primary-fixed">
            <button
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search"
              className="hover:text-primary dark:hover:text-on-primary-fixed transition-colors duration-300 cursor-pointer"
            >
              <span className="material-symbols-outlined" data-icon="search">
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
                  <span className="material-symbols-outlined" data-icon="person">
                    person
                  </span>
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
                onClick={() => openLoginModal()}
                className="text-[10px] font-label-caps uppercase tracking-widest hover:text-primary transition-colors border border-outline-variant px-3 py-1.5 cursor-pointer"
              >
                Login
              </button>
            )}
            <button
              aria-label="Wishlist"
              className="hover:text-primary dark:hover:text-on-primary-fixed transition-colors duration-300"
            >
              <span className="material-symbols-outlined" data-icon="favorite">
                favorite
              </span>
            </button>
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="Shopping Bag"
              className="hover:text-primary dark:hover:text-on-primary-fixed transition-colors duration-300 relative"
            >
              <span
                className="material-symbols-outlined"
                data-icon="shopping_bag"
              >
                shopping_bag
              </span>
              <span className="absolute -top-1 -right-1 bg-primary text-on-primary text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {wishlistItems?.length || 0}
              </span>
            </button>
          </div>
        </div>
      </header>

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
