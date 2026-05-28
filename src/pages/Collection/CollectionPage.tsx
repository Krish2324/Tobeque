import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ProductCard, type Product } from '../../components/ProductCard';
import { useCart } from '../../context/CartContext';

import { productsData } from '../../data/products';
import { QuickViewModal } from '../../components/QuickViewModal/QuickViewModal';

const collectionProductIds = [
  "architectural-silk-blouse",
  "ruched-sheer-print-top",
  "essential-strappy-crop",
  "eyelet-ribbed-vest",
  "asymmetric-fine-knit"
];

const products = collectionProductIds
  .map((id) => productsData.find((p) => p.id === id))
  .filter((p): p is Product => !!p);

// Repeat pattern to get 16 items
const collectionProducts = [
  ...products,
  ...products,
  ...products,
  products[0]!,
].map((p, idx) => ({ ...p, id: `${p.id}-col-${idx + 1}` } as Product));

export function CollectionPage() {
  const { setIsCartOpen, addToCart, wishlistItems, addToWishlist, removeFromWishlist } = useCart();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

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
      <header className="bg-background dark:bg-background fixed top-0 w-full z-50 border-b border-outline-variant flat no shadows">
        <div className="flex justify-between items-center w-full px-outer-margin py-4 max-w-full">
          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              className="text-on-surface-variant dark:text-on-secondary-fixed-variant hover:text-primary dark:hover:text-on-primary-fixed transition-colors duration-300 font-label-caps text-label-caps"
              to="/"
            >
              Home
            </Link>
            <Link
              className="text-on-surface-variant dark:text-on-secondary-fixed-variant hover:text-primary dark:hover:text-on-primary-fixed transition-colors duration-300 font-label-caps text-label-caps"
              to="#"
            >
              New Arrivals
            </Link>
            <Link
              className="text-primary dark:text-on-primary-fixed border-b-2 border-primary pb-1 font-label-caps text-label-caps"
              to="/collection"
            >
              Collections
            </Link>
            <Link
              className="text-on-surface-variant dark:text-on-secondary-fixed-variant hover:text-primary dark:hover:text-on-primary-fixed transition-colors duration-300 font-label-caps text-label-caps"
              to="#"
            >
              Editorial
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
              aria-label="person"
              className="hover:text-primary dark:hover:text-on-primary-fixed transition-colors duration-300"
            >
              <span className="material-symbols-outlined">person</span>
            </button>
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="shopping_bag"
              className="hover:text-primary dark:hover:text-on-primary-fixed transition-colors duration-300"
            >
              <span className="material-symbols-outlined">shopping_bag</span>
            </button>
          </div>
        </div>
      </header>

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
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBrrzAR_qXLevSn61zYuBflMT8cWpuFJ6p7CWHH3Zm17pqBRshLUavBhVZdduWRK_3PulltrYJ-lNmQygLArIFhsrysx1IbAiiigCU55uB9vVmKbzULGiPJtGmvkCHkwjwEIlG4sReshjl7aYcMmJFi_ZTq8mSDwCumg25zUKaIoMP0VY-PtG4CEjh0AKZl-LgJFuA0uxTuOEA1ymNPoUnM_QNyrEYspiu7MCVIkTP9z9GEfHMAalTAu434znMvQf1Vy8Ch9DfSUg')",
              }}
            ></div>
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-1/4 hidden lg:block opacity-80 pointer-events-none">
            <div
              className="w-full h-full bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDmmd03WVpvNiT8bLfo_a3wlJVNevWrAQKgKkfIXiyLGNvBwOYgOcV_ykpxMrp8HpyJBN8g-7YNEZa4stTsxcqtoAdSY_b3Eh5ZYV5HE7UIMzvEzktJjE3CFjNmKclxzrHy3TqjT-JCTyPP9-fw4dbtf7Vaz6mgdXh-XwT2QZnsiljpOfJm-UU3ouwApM2nQfNnZkv39ZfidkBxUWI5DNNHoCk2KGx30Duz4u0IkeA9xj31iSVG0E4ku_4TZkxPPAx3reINxtrg_Q')",
              }}
            ></div>
          </div>
        </section>

        {/* SECTION 2: COLLECTION HEADER */}
        <div className="sticky top-[72px] z-40 bg-surface-container-lowest border-b border-outline-variant py-4 px-outer-margin md:px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="font-headline-md text-headline-md text-primary">
            TOPS{" "}
            <span className="text-on-surface-variant text-body-md font-body-md ml-2">
              (48)
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 md:gap-1.5">
            {collectionProducts.map((p) => (
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

          {/* Load More */}
          <div className="w-full flex justify-center mt-16 mb-8">
            <button className="border border-primary text-primary font-label-caps text-label-caps px-8 py-4 uppercase hover:bg-primary hover:text-on-primary transition-colors duration-300">
              Load More Products
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-lowest dark:bg-surface-container-highest w-full py-section-padding-mobile md:py-section-padding-desktop border-t border-outline-variant flat no shadows">
        <div className="flex flex-col items-center gap-stack-md w-full px-outer-margin">
          {/* Brand Logo */}
          <Link
            className="font-display-lg text-headline-lg-mobile text-primary dark:text-on-primary-fixed uppercase mb-8"
            to="/"
          >
            TOBEQUE
          </Link>
          {/* Links */}
          <nav className="flex flex-wrap justify-center gap-6 md:gap-12 mb-8">
            <a
              className="text-on-surface-variant dark:text-on-secondary-fixed-variant hover:text-primary dark:hover:text-on-primary-fixed transition-colors duration-300 font-label-caps text-label-caps uppercase"
              href="#"
            >
              Sustainability
            </a>
            <a
              className="text-on-surface-variant dark:text-on-secondary-fixed-variant hover:text-primary dark:hover:text-on-primary-fixed transition-colors duration-300 font-label-caps text-label-caps uppercase"
              href="#"
            >
              Contact
            </a>
            <a
              className="text-on-surface-variant dark:text-on-secondary-fixed-variant hover:text-primary dark:hover:text-on-primary-fixed transition-colors duration-300 font-label-caps text-label-caps uppercase"
              href="#"
            >
              Shipping &amp; Returns
            </a>
            <a
              className="text-on-surface-variant dark:text-on-secondary-fixed-variant hover:text-primary dark:hover:text-on-primary-fixed transition-colors duration-300 font-label-caps text-label-caps uppercase"
              href="#"
            >
              Privacy Policy
            </a>
          </nav>
        </div>
      </footer>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
}
