import React, { useState, useRef, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { type Product, type ProductColor } from "../../data/products";
import { useProduct, useProducts } from "../../hooks/useProducts";

import { ProductCard } from "../../components/ProductCard";
import { useCart } from "../../context/CartContext";
import { QuickViewModal } from "../../components/QuickViewModal/QuickViewModal";
import { SearchModal } from "../../components/SearchModal/SearchModal";
import { Footer } from "../../components/Footer/Footer";

const isVideo = (url: string | undefined) => url && url.match(/\.(mp4|webm|ogg|mov)$/i);

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();

  // Fetch specific product from backend
  const { product, loading, error } = useProduct(id);

  // Fetch related products (e.g. latest 8 published products)
  const { products: relatedProducts } = useProducts({ limit: 8, status: 'published' });
  const styleItWithProducts = relatedProducts.slice(0, 4);
  const youMightAlsoLikeProducts = relatedProducts.slice(4, 8);

  // Interactive States
  const [selectedColor, setSelectedColor] = useState<ProductColor>({ name: "DEFAULT", class: "bg-primary" });
  const [selectedSize, setSelectedSize] = useState<string>("S");

  const { cart, addToCart, setIsCartOpen, setIsCheckoutOpen } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [buttonText, setButtonText] = useState("ADD TO BAG");
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Carousel scroll refs
  const styleItCarouselRef = useRef<HTMLDivElement>(null);
  const likeCarouselRef = useRef<HTMLDivElement>(null);
  const galleryScrollRef = useRef<HTMLDivElement>(null);

  // Sync state if product route changes
  useEffect(() => {
    if (product) {
      if (product.detailedColors && product.detailedColors.length > 0) {
        setSelectedColor(product.detailedColors[0]);
      } else {
        setSelectedColor({ name: "DEFAULT", class: product.colors?.[0] || "bg-primary" });
      }
      if (product.sizes && product.sizes.length > 0) {
        setSelectedSize(product.sizes[0]);
      } else {
        setSelectedSize("S");
      }
    }
  }, [product]);

  // Add primary product to bag
  const handleAddToBag = () => {
    if (!product) return;
    setIsAdding(true);
    setButtonText("ADDING...");

    setTimeout(() => {
      const newItem = {
        id: product.id as string,
        name: product.name,
        price: product.price,
        imageSrc: product.imageSrc,
        selectedSize: selectedSize,
        selectedColor: selectedColor.name,
        quantity: 1
      };

      addToCart(newItem);

      setIsAdding(false);
      setButtonText("ADDED TO BAG! ✓");

      // Slide open the cart drawer for premium interactive feedback
      setTimeout(() => {
        setIsCartOpen(true);
        setButtonText("ADD TO BAG");
      }, 800);
    }, 600);
  };

  // Add accessory/carousel products instantly to bag
  const handleQuickAdd = (e: React.MouseEvent, item: any) => {
    e.preventDefault();
    e.stopPropagation();

    const newItem = {
      id: item.id,
      name: item.name,
      price: item.price,
      imageSrc: item.imageSrc,
      selectedSize: "S",
      selectedColor: "DEFAULT",
      quantity: 1
    };

    addToCart(newItem);
    setIsCartOpen(true);
  };

  // Calculate cart total
  const cartSubtotal = cart.reduce((total, item) => {
    const numericPrice = parseFloat(item.price.replace(/[^0-9.]/g, ""));
    return total + (isNaN(numericPrice) ? 0 : numericPrice) * item.quantity;
  }, 0);

  // Handle Buy It Now: Add to cart immediately and open checkout
  const handleBuyItNow = () => {
    if (!product) return;
    
    const newItem = {
      id: product.id as string,
      name: product.name,
      price: product.price,
      imageSrc: product.imageSrc,
      selectedSize: selectedSize,
      selectedColor: selectedColor.name,
      quantity: 1
    };

    addToCart(newItem);
    setIsCheckoutOpen(true);
  };

  // Smooth Carousel scroll handlers
  const scrollCarousel = (ref: React.RefObject<HTMLDivElement | null>, direction: "left" | "right") => {
    if (ref.current) {
      const scrollAmt = ref.current.offsetWidth * 0.75;
      ref.current.scrollBy({
        left: direction === "left" ? -scrollAmt : scrollAmt,
        behavior: "smooth"
      });
    }
  };

  if (loading) {
    return (
      <div className="bg-surface-container-lowest min-h-screen flex flex-col">
        <nav className="w-full z-50 bg-surface/95 backdrop-blur-md border-b border-outline-variant flex justify-between items-center px-8 py-4">
          <Link className="text-headline-md font-headline-md font-bold tracking-widest text-primary uppercase" to="/">
            TOBEQUE
          </Link>
        </nav>
        <div className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <svg className="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-label-caps font-label-caps text-secondary tracking-widest">LOADING PRODUCT...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="bg-surface-container-lowest min-h-screen flex flex-col">
        <nav className="w-full z-50 bg-surface/95 backdrop-blur-md border-b border-outline-variant flex justify-between items-center px-8 py-4">
          <Link className="text-headline-md font-headline-md font-bold tracking-widest text-primary uppercase" to="/">
            TOBEQUE
          </Link>
        </nav>
        <div className="flex-grow flex flex-col items-center justify-center gap-4">
          <h1 className="text-headline-md font-headline-md text-primary">Product Not Found</h1>
          <Link to="/collection" className="border border-primary text-primary px-6 py-2 text-label-caps font-label-caps hover:bg-neutral-50 transition-colors">
            RETURN TO COLLECTION
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest text-on-surface antialiased selection:bg-primary selection:text-on-primary font-body-md text-body-md min-h-screen flex flex-col">

      {/* TopNavBar */}
      <nav className="w-full z-50 bg-surface/95 backdrop-blur-md border-b border-outline-variant flex justify-between items-center px-8 py-4">
        <div className="flex-shrink-0">
          <Link className="text-headline-md font-headline-md font-bold tracking-widest text-primary uppercase" to="/">
            TOBEQUE
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex flex-1 justify-center space-x-8">
          <Link className="text-secondary hover:text-primary transition-colors duration-300 text-label-caps font-label-caps" to="#">NEW ARRIVAL</Link>
          <Link className="text-secondary hover:text-primary transition-colors duration-300 text-label-caps font-label-caps" to="/collection">TOPS</Link>
          <Link className="text-secondary hover:text-primary transition-colors duration-300 text-label-caps font-label-caps" to="#">DRESSES</Link>
          <Link className="text-secondary hover:text-primary transition-colors duration-300 text-label-caps font-label-caps" to="#">CO-ORD SET</Link>
          <Link className="text-secondary hover:text-primary transition-colors duration-300 text-label-caps font-label-caps" to="#">BODYSUIT</Link>
          <Link className="text-secondary hover:text-primary transition-colors duration-300 text-label-caps font-label-caps" to="#">BEST SELLERS</Link>
        </div>

        {/* Trailing Actions */}
        <div className="flex items-center space-x-6 text-primary">
          <button aria-label="person" className="hover:opacity-70 transition-opacity">
            <span className="material-symbols-outlined">person</span>
          </button>

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

      {/* Main Content Canvas */}
      <main className="flex-grow w-full">

        {/* Product Detail Section (Split Frame) */}
        <section className="flex flex-col lg:flex-row w-full mb-12">

          {/* Left: Split Image Gallery (flush left) */}
          <div
            ref={galleryScrollRef}
            className="w-full lg:w-2/3 flex lg:grid lg:grid-cols-2 gap-0 overflow-x-auto lg:overflow-x-visible snap-x snap-mandatory no-scrollbar h-[60vh] lg:h-auto scroll-smooth"
          >
            {(product.galleryImages && product.galleryImages.length > 0
              ? product.galleryImages
              : [product.imageSrc, product.hoverImageSrc || product.imageSrc]
            ).map((img, index) => (
              <div
                key={index}
                className="snap-center shrink-0 w-[90%] sm:w-[50%] lg:w-full aspect-[2/3] relative overflow-hidden bg-surface-container"
              >
                {isVideo(img) ? (
                  <video
                    className="w-full h-full object-cover"
                    src={img}
                    autoPlay loop muted playsInline
                  />
                ) : (
                  <img
                    alt={`${product.name} detail view ${index + 1}`}
                    className="w-full h-full object-cover"
                    src={img}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Right: Product Info (Sticky, 1/3 width) */}
          <div className="w-full lg:w-1/3 flex flex-col py-4 lg:py-8 px-6 lg:px-12 sticky top-0 self-start">

            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-label-caps font-label-caps text-secondary mb-6">
              <Link className="hover:text-primary transition-colors" to="/">HOME</Link>
              <span>/</span>
              <Link className="hover:text-primary transition-colors" to="/collection">TOPS</Link>
            </div>

            {/* Title */}
            <h1 className="text-headline-lg font-headline-lg text-primary mb-4 leading-tight">
              {product.name}
            </h1>

            {/* Price Row */}
            <div className="flex items-baseline gap-4 mb-8">
              <span className="text-price-lg font-price-lg text-primary text-xl font-bold">{product.price}</span>
              {product.originalPrice && (
                <span className="text-body-md font-body-md text-secondary line-through">{product.originalPrice}</span>
              )}
              {product.badge && (
                <span className="bg-primary text-on-primary text-[10px] font-bold px-2 py-1 tracking-widest uppercase">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Interactive Color Selection */}
            {product.detailedColors && product.detailedColors.length > 0 && (
              <div className="mb-8">
                <div className="flex justify-between items-end mb-3">
                  <span className="text-label-caps font-label-caps text-secondary tracking-wider">
                    COLOR: <span className="text-primary font-bold">{selectedColor.name}</span>
                  </span>
                </div>
                <div className="flex gap-3">
                  {product.detailedColors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color)}
                      aria-label={`Select Color ${color.name}`}
                      className={`w-8 h-8 rounded-full border p-[2px] focus:outline-none transition-all duration-300 ${selectedColor.name === color.name ? "border-primary scale-110" : "border-outline-variant hover:border-secondary"
                        }`}
                    >
                      <span
                        className={`block w-full h-full rounded-full ${color.class}`}
                        style={color.bgStyle}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Interactive Size Selection */}
            <div className="mb-10">
              <div className="flex justify-between items-end mb-3">
                <span className="text-label-caps font-label-caps text-secondary tracking-wider">
                  SIZE: <span className="text-primary font-bold">{selectedSize}</span>
                </span>
                <button className="text-label-caps font-label-caps text-primary underline hover:text-secondary transition-colors">
                  Size Guide
                </button>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {(product.sizes || ["XS", "S", "M", "L"]).map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`border py-3 text-label-caps font-label-caps tracking-wider transition-all duration-300 ${selectedSize === sz
                      ? "border-primary bg-primary text-on-primary font-bold shadow-sm"
                      : "border-outline-variant text-primary hover:border-primary"
                      }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Actions (Add to Bag / Buy It Now) */}
            <div className="flex flex-col gap-3 mb-10">
              <button
                onClick={handleAddToBag}
                disabled={isAdding}
                className="w-full bg-primary text-on-primary h-14 text-label-caps font-label-caps tracking-widest hover:bg-neutral-800 transition-colors flex justify-center items-center gap-2 cursor-pointer shadow-sm disabled:bg-neutral-600"
              >
                {isAdding && (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {buttonText}
              </button>

              <button
                onClick={handleBuyItNow}
                className="w-full bg-transparent border border-primary text-primary h-14 text-label-caps font-label-caps tracking-widest hover:bg-neutral-50 transition-colors cursor-pointer shadow-sm"
              >
                BUY IT NOW
              </button>
            </div>

            {/* Shipping Note */}
            <div className="flex items-center gap-3 text-secondary text-sm mb-10 border-t border-b border-outline-variant py-4">
              <span className="material-symbols-outlined text-[20px]">local_shipping</span>
              <span>Complimentary shipping on all orders over $300.</span>
            </div>

            {/* Interactive Expandable Accordions */}
            <div className="flex flex-col border-t border-outline-variant">
              <details className="group py-4 border-b border-outline-variant cursor-pointer" open>
                <summary className="flex justify-between items-center font-label-caps text-label-caps text-primary list-none font-bold">
                  DESCRIPTION
                  <span className="material-symbols-outlined group-open:rotate-180 transition-transform">expand_more</span>
                </summary>
                <div className="pt-4 text-body-md text-secondary leading-relaxed pr-4 transition-all duration-300">
                  {product.description || "A striking fitted top crafted from luxury materials. Featuring an elegant draping neckline, long sleeves, and a gorgeous tailored structure. Designed to highlight the silhouette, offering a seamless layering option or a standalone statement statement for evening or daytime styling."}
                </div>
              </details>

              <details className="group py-4 border-b border-outline-variant cursor-pointer">
                <summary className="flex justify-between items-center font-label-caps text-label-caps text-primary list-none font-bold">
                  FABRIC &amp; CARE
                  <span className="material-symbols-outlined group-open:rotate-180 transition-transform">expand_more</span>
                </summary>
                <div className="pt-4 text-body-md text-secondary leading-relaxed pr-4">
                  {product.fabricCare || "92% Polyamide, 8% Elastane. Hand wash cold separately. Do not bleach. Lay flat to dry. Do not iron. Dry clean recommended for best results."}
                </div>
              </details>

              <details className="group py-4 border-b border-outline-variant cursor-pointer">
                <summary className="flex justify-between items-center font-label-caps text-label-caps text-primary list-none font-bold">
                  SHIPPING &amp; RETURNS
                  <span className="material-symbols-outlined group-open:rotate-180 transition-transform">expand_more</span>
                </summary>
                <div className="pt-4 text-body-md text-secondary leading-relaxed pr-4">
                  {product.shippingReturns || "Orders are processed within 1-2 business days. Returns are accepted within 14 days of delivery for full-priced items in unworn condition with tags attached."}
                </div>
              </details>
            </div>

          </div>
        </section>

        <div className="px-8 max-w-[1600px] mx-auto w-full">
          {/* Divider */}
          <div className="w-full h-px bg-outline-variant my-12" />

          {/* STYLE IT WITH Carousel */}
          <section className="mb-16 relative">
            <div className="flex flex-col items-center mb-8">
              <h2 className="text-headline-md font-headline-md text-primary uppercase tracking-widest text-center">STYLE IT WITH</h2>
            </div>

            <div className="relative">
              {/* Carousel Container */}
              <div
                ref={styleItCarouselRef}
                className="flex overflow-x-auto snap-x snap-mandatory gap-4 no-scrollbar pb-4 scroll-smooth"
              >
                {styleItWithProducts.map((item) => (
                  <div
                    key={item.id}
                    className="snap-start shrink-0 w-[80%] md:w-[calc(33.333%-12px)] lg:w-[calc(25%-12px)]"
                  >
                    <ProductCard
                      product={item}
                      onAddToCartClick={handleQuickAdd}
                      onQuickViewClick={setQuickViewProduct}
                    />
                  </div>
                ))}
              </div>

              {/* Carousel Controls */}
              <button
                onClick={() => scrollCarousel(styleItCarouselRef, "left")}
                aria-label="Previous items"
                className="hidden lg:flex absolute top-1/2 -left-6 -translate-y-1/2 w-12 h-12 bg-white border border-outline-variant items-center justify-center text-primary hover:bg-neutral-50 hover:scale-105 shadow-sm transition-all z-10 cursor-pointer"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button
                onClick={() => scrollCarousel(styleItCarouselRef, "right")}
                aria-label="Next items"
                className="hidden lg:flex absolute top-1/2 -right-6 -translate-y-1/2 w-12 h-12 bg-white border border-outline-variant items-center justify-center text-primary hover:bg-neutral-50 hover:scale-105 shadow-sm transition-all z-10 cursor-pointer"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </section>

          {/* YOU MIGHT ALSO LIKE Carousel */}
          <section className="mb-16 relative">
            <div className="flex flex-col items-center mb-8">
              <h2 className="text-headline-md font-headline-md text-primary uppercase tracking-widest text-center">YOU MIGHT ALSO LIKE</h2>
            </div>

            <div className="relative">
              {/* Carousel Container */}
              <div
                ref={likeCarouselRef}
                className="flex overflow-x-auto snap-x snap-mandatory gap-4 no-scrollbar pb-4 scroll-smooth"
              >
                {youMightAlsoLikeProducts.map((item) => (
                  <div
                    key={item.id}
                    className="snap-start shrink-0 w-[80%] md:w-[calc(33.333%-12px)] lg:w-[calc(25%-12px)]"
                  >
                    <ProductCard
                      product={item}
                      onAddToCartClick={handleQuickAdd}
                      onQuickViewClick={setQuickViewProduct}
                    />
                  </div>
                ))}
              </div>

              {/* Carousel Controls */}
              <button
                onClick={() => scrollCarousel(likeCarouselRef, "left")}
                aria-label="Previous items"
                className="hidden lg:flex absolute top-1/2 -left-6 -translate-y-1/2 w-12 h-12 bg-white border border-outline-variant items-center justify-center text-primary hover:bg-neutral-50 hover:scale-105 shadow-sm transition-all z-10 cursor-pointer"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button
                onClick={() => scrollCarousel(likeCarouselRef, "right")}
                aria-label="Next items"
                className="hidden lg:flex absolute top-1/2 -right-6 -translate-y-1/2 w-12 h-12 bg-white border border-outline-variant items-center justify-center text-primary hover:bg-neutral-50 hover:scale-105 shadow-sm transition-all z-10 cursor-pointer"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </section>
        </div>

      </main>

      {/* Footer */}
      <Footer />
      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onProductSelect={(product) => {
          setQuickViewProduct(product);
          setIsSearchOpen(false);
        }}
      />
    </div>
  );
}
