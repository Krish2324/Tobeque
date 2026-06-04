import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { SearchModal } from '../SearchModal/SearchModal';
import type { Product } from '../ProductCard';

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
          <nav className="hidden md:flex items-center gap-6">
            <Link
              className="text-on-surface-variant dark:text-on-secondary-fixed-variant hover:text-primary dark:hover:text-on-primary-fixed transition-colors duration-300 font-label-caps text-label-caps"
              to="/"
            >
              Shop
            </Link>
            <Link
              className="text-on-surface-variant dark:text-on-secondary-fixed-variant hover:text-primary dark:hover:text-on-primary-fixed transition-all duration-300 font-label-caps text-label-caps border-b-2 border-transparent hover:border-primary pb-1"
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
              to="/"
            >
              Editorial
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
