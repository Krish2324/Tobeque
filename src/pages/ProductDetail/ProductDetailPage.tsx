import React, { useState, useRef, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { type Product, type ProductColor } from "../../data/products";
import { useProduct, useProducts } from "../../hooks/useProducts";

import { ProductCard } from "../../components/ProductCard";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { QuickViewModal } from "../../components/QuickViewModal/QuickViewModal";
import { SimpleNavbar } from "../../components/SimpleNavbar/SimpleNavbar";
import { Footer } from "../../components/Footer/Footer";

const isVideo = (url: string | undefined) => url && !!url.match(/\.(mp4|webm|ogg|mov)(\?.*)?$/i);

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

  const { addToCart, setIsCartOpen, setIsCheckoutOpen } = useCart();
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [buttonText, setButtonText] = useState("ADD TO CART");
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

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
  }, [product, user]);

  // Derived state for gallery images based on selected color
  const displayedImages = React.useMemo(() => {
    if (!product) return [];
    if (!product.galleryImageObjects || product.galleryImageObjects.length === 0) {
      return product.galleryImages && product.galleryImages.length > 0
        ? product.galleryImages
        : [product.imageSrc, product.hoverImageSrc || product.imageSrc];
    }

    const currentSelectedColorName = selectedColor.name.toLowerCase();
    
    const colorMatches: string[] = [];
    const others: string[] = [];
    
    product.galleryImageObjects.forEach((imgObj) => {
      const imgColor = (imgObj.color || "").toLowerCase();
      if (imgColor && (imgColor === currentSelectedColorName || currentSelectedColorName.includes(imgColor))) {
        colorMatches.push(imgObj.url);
      } else {
        others.push(imgObj.url);
      }
    });

    if (colorMatches.length > 0) {
      return [...colorMatches, ...others];
    } else {
      return product.galleryImages && product.galleryImages.length > 0
        ? product.galleryImages
        : [product.imageSrc, product.hoverImageSrc || product.imageSrc];
    }
  }, [product, selectedColor]);

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
        quantity: quantity
      };

      addToCart(newItem);

      setIsAdding(false);
      setButtonText("ADDED ✓");

      // Slide open the cart drawer for premium interactive feedback
      setTimeout(() => {
        setIsCartOpen(true);
        setButtonText("ADD TO CART");
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
      quantity: quantity
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
        <SimpleNavbar />
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
        <SimpleNavbar />
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
      <SimpleNavbar onSearchProductSelect={(p) => setQuickViewProduct(p)} />

      {/* Main Content Canvas */}
      <main className="flex-grow w-full">

        {/* Product Detail Section (Split Frame) */}
        <section className="flex flex-col lg:flex-row w-full mb-12">

          {/* Left: Split Image Gallery — wider, images first */}
          <div
            ref={galleryScrollRef}
            className="w-full lg:w-3/4 flex lg:grid lg:grid-cols-2 gap-0 overflow-x-auto lg:overflow-x-visible snap-x snap-mandatory no-scrollbar h-[60vh] lg:h-auto scroll-smooth"
          >
            {displayedImages.map((img, index) => (
              <div
                key={`${img}-${index}`}
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

          {/* Right: Compact Product Info — narrow, editorial, visually secondary */}
          <div className="w-full lg:w-1/4 flex flex-col py-4 lg:py-6 px-5 lg:px-8 lg:sticky top-0 self-start">

            {/* Product Name — compact */}
            <h1 className="text-sm font-bold text-primary mb-1 leading-snug tracking-wide uppercase">
              {product.name}
            </h1>

            {/* Price Row — tight */}
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-sm font-bold text-primary">{product.price}</span>
              {product.originalPrice && (
                <span className="text-xs text-secondary line-through">{product.originalPrice}</span>
              )}
              {product.badge && (
                <span className="bg-primary text-on-primary text-[9px] font-bold px-1.5 py-0.5 tracking-widest uppercase">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Color Selection — compact */}
            {product.detailedColors && product.detailedColors.length > 0 && (
              <div className="mb-4">
                <span className="text-[10px] text-secondary tracking-widest uppercase block mb-2">
                  {selectedColor.name}
                </span>
                <div className="flex gap-2">
                  {product.detailedColors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color)}
                      aria-label={`Select Color ${color.name}`}
                      className={`w-6 h-6 rounded-full border p-[2px] focus:outline-none transition-all duration-200 ${selectedColor.name === color.name ? "border-primary scale-110" : "border-outline-variant hover:border-secondary"}`}
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

            {/* Size Selection — compact chips */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-5">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] text-secondary tracking-widest uppercase">
                    SIZE: <span className="text-primary font-bold">{selectedSize}</span>
                  </span>
                  <button className="text-[10px] text-secondary underline hover:text-primary transition-colors tracking-wider uppercase">
                    Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`min-w-[36px] h-8 px-2 text-[10px] tracking-wider uppercase font-bold border transition-all duration-200 ${selectedSize === sz
                        ? "border-primary bg-primary text-on-primary"
                        : "border-outline-variant text-secondary hover:border-primary hover:text-primary"
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* CTA: Quantity + Add to Cart / Buy Now */}
            <div className="flex flex-col gap-2 mb-5">

              {/* Row 1: Quantity Stepper + Add to Cart */}
              <div className="flex gap-2 items-stretch">

                {/* Quantity Stepper */}
                <div className="flex items-center border border-outline-variant h-11 shrink-0">
                  <button
                    id="quantity-decrease"
                    aria-label="Decrease quantity"
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-9 h-full flex items-center justify-center text-primary hover:bg-neutral-100 transition-colors cursor-pointer select-none"
                  >
                    <span style={{ fontSize: '16px', lineHeight: 1 }}>&#8722;</span>
                  </button>
                  <span
                    id="quantity-display"
                    className="w-8 text-center text-primary text-xs font-bold select-none"
                  >
                    {quantity}
                  </span>
                  <button
                    id="quantity-increase"
                    aria-label="Increase quantity"
                    onClick={() => setQuantity(q => q + 1)}
                    className="w-9 h-full flex items-center justify-center text-primary hover:bg-neutral-100 transition-colors cursor-pointer select-none"
                  >
                    <span style={{ fontSize: '16px', lineHeight: 1 }}>&#43;</span>
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button
                  id="add-to-cart-btn"
                  onClick={handleAddToBag}
                  disabled={isAdding}
                  className="flex-1 bg-primary text-on-primary h-11 text-[10px] font-bold tracking-widest uppercase hover:bg-neutral-800 transition-colors flex justify-center items-center gap-2 cursor-pointer disabled:bg-neutral-500"
                >
                  {isAdding && (
                    <svg className="animate-spin h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  {buttonText}
                </button>
              </div>

              {/* Row 2: Buy Now — full width */}
              <button
                id="buy-now-btn"
                onClick={handleBuyItNow}
                className="w-full bg-transparent border border-primary text-primary h-11 text-[10px] font-bold tracking-widest uppercase hover:bg-neutral-50 transition-colors cursor-pointer"
              >
                BUY NOW
              </button>
            </div>

            {/* Shipping note — minimal */}
            <div className="flex items-center gap-2 text-secondary text-[10px] mb-5 border-t border-outline-variant pt-4">
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>local_shipping</span>
              <span>Free shipping on orders over ₹999.</span>
            </div>

            {/* Interactive Expandable Accordions */}
            <div className="flex flex-col border-t border-outline-variant">
              <details className="group py-3 border-b border-outline-variant cursor-pointer" open>
                <summary className="flex justify-between items-center text-[10px] text-primary list-none font-bold tracking-widest uppercase">
                  DESCRIPTION
                  <span className="material-symbols-outlined group-open:rotate-180 transition-transform" style={{ fontSize: '16px' }}>expand_more</span>
                </summary>
                <div className="pt-2 pb-1 text-[11px] text-secondary leading-relaxed pr-2 transition-all duration-300">
                  {product.description || "A striking fitted top crafted from luxury materials. Featuring an elegant draping neckline, long sleeves, and a gorgeous tailored structure."}
                </div>
              </details>

              <details className="group py-3 border-b border-outline-variant cursor-pointer">
                <summary className="flex justify-between items-center text-[10px] text-primary list-none font-bold tracking-widest uppercase">
                  FABRIC &amp; CARE
                  <span className="material-symbols-outlined group-open:rotate-180 transition-transform" style={{ fontSize: '16px' }}>expand_more</span>
                </summary>
                <div className="pt-2 pb-1 text-[11px] text-secondary leading-relaxed pr-2">
                  {product.fabricCare || "92% Polyamide, 8% Elastane. Hand wash cold. Do not bleach. Lay flat to dry."}
                </div>
              </details>

              <details className="group py-3 border-b border-outline-variant cursor-pointer">
                <summary className="flex justify-between items-center text-[10px] text-primary list-none font-bold tracking-widest uppercase">
                  SHIPPING &amp; RETURNS
                  <span className="material-symbols-outlined group-open:rotate-180 transition-transform" style={{ fontSize: '16px' }}>expand_more</span>
                </summary>
                <div className="pt-2 pb-1 text-[11px] text-secondary leading-relaxed pr-2">
                  {product.shippingReturns || "Orders processed in 1-2 days. Returns accepted within 14 days in unworn condition with tags attached."}
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

    </div>
  );
}
