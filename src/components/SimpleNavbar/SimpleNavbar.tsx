import React, { useState } from "react";
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

  return (
    <>
      <nav className="w-full z-50 bg-surface/95 backdrop-blur-md border-b border-outline-variant flex justify-between items-center px-8 py-4">
        <div className="flex-shrink-0">
          <Link to="/">
            <img src={logoImage} alt="Tobeque Logo" style={{ height: '24px', objectFit: 'contain' }} />
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

        {/* Trailing Actions */}
        <div className="flex items-center space-x-6 text-primary">
          
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
      </nav>

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
