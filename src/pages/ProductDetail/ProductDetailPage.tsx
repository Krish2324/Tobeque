import React, { useState, useRef, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductById, productsData, type Product, type ProductColor } from "../../data/products";

import { ProductCard } from "../../components/ProductCard";
import { useCart } from "../../context/CartContext";
import { QuickViewModal } from "../../components/QuickViewModal/QuickViewModal";

// Real product IDs to look up from the centralized database for related carousels
const styleItWithIds = [
  "high-waisted-tailored-trousers",
  "structured-mini-leather-tote",
  "oversized-wool-blend-blazer",
  "minimalist-strappy-sandal"
];

const youMightAlsoLikeIds = [
  "sheer-panelled-bodysuit",
  "asymmetric-polka-dot-slip-dress",
  "cut-out-ribbed-knit-top",
  "draped-chiffon-mini-dress"
];



export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();

  // Fetch specific product, fall back to leopard print top if not found
  const product = getProductById(id) || productsData[0];

  // Resolve related products from the central database
  const styleItWithProducts = styleItWithIds.map(prodId => getProductById(prodId)).filter(Boolean) as Product[];
  const youMightAlsoLikeProducts = youMightAlsoLikeIds.map(prodId => getProductById(prodId)).filter(Boolean) as Product[];

  // Interactive States
  const [selectedColor, setSelectedColor] = useState<ProductColor>(
    product.detailedColors && product.detailedColors.length > 0
      ? product.detailedColors[0]
      : { name: "DEFAULT", class: product.colors?.[0] || "bg-primary" }
  );

  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : "S"
  );

  const { cart, addToCart, setIsCartOpen } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [buttonText, setButtonText] = useState("ADD TO BAG");
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Checkout Dialog State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutName, setCheckoutName] = useState("");
  const [checkoutEmail, setCheckoutEmail] = useState("");
  const [checkoutCard, setCheckoutCard] = useState("");
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  // Carousel scroll refs
  const styleItCarouselRef = useRef<HTMLDivElement>(null);
  const likeCarouselRef = useRef<HTMLDivElement>(null);
  const galleryScrollRef = useRef<HTMLDivElement>(null);

  // Sync state if product route changes
  useEffect(() => {
    const updatedProduct = getProductById(id) || productsData[0];
    if (updatedProduct.detailedColors && updatedProduct.detailedColors.length > 0) {
      setSelectedColor(updatedProduct.detailedColors[0]);
    } else {
      setSelectedColor({ name: "DEFAULT", class: updatedProduct.colors?.[0] || "bg-primary" });
    }
    if (updatedProduct.sizes && updatedProduct.sizes.length > 0) {
      setSelectedSize(updatedProduct.sizes[0]);
    } else {
      setSelectedSize("S");
    }
  }, [id]);

  // Add primary product to bag
  const handleAddToBag = () => {
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

  // Trigger Checkout Modal
  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutName || !checkoutEmail || !checkoutCard) return;

    setIsSubmittingOrder(true);
    setTimeout(() => {
      setIsSubmittingOrder(false);
      setCheckoutSuccess(true);
      setTimeout(() => {
        // Clear cart and close modal
        // Optionally empty cart globally, but let's just close for now
        setIsCheckoutOpen(false);
        setCheckoutSuccess(false);
        setIsCartOpen(false);
        setCheckoutName("");
        setCheckoutEmail("");
        setCheckoutCard("");
      }, 3000);
    }, 1500);
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
          <button aria-label="search" className="hover:opacity-70 transition-opacity">
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
                <img
                  alt={`${product.name} detail view ${index + 1}`}
                  className="w-full h-full object-cover"
                  src={img}
                />
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
                onClick={() => setIsCheckoutOpen(true)}
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
      <footer className="w-full py-12 bg-white border-t border-outline-variant flex flex-col items-center gap-6 px-4 max-w-7xl mx-auto">
        <h2 className="text-headline-md font-headline-md text-primary font-bold tracking-widest">TOBEQUE</h2>
        <div className="flex flex-wrap justify-center gap-6 md:gap-8">
          <Link className="text-secondary hover:text-primary transition-all text-label-caps font-label-caps" to="#">PRIVACY POLICY</Link>
          <Link className="text-secondary hover:text-primary transition-all text-label-caps font-label-caps" to="#">TERMS OF SERVICE</Link>
          <Link className="text-secondary hover:text-primary transition-all text-label-caps font-label-caps" to="#">SHIPPING &amp; RETURNS</Link>
          <Link className="text-secondary hover:text-primary transition-all text-label-caps font-label-caps" to="#">CONTACT US</Link>
          <Link className="text-secondary hover:text-primary transition-all text-label-caps font-label-caps" to="#">CAREERS</Link>
        </div>
        <p className="text-body-md text-secondary mt-4">© 2024 TOBEQUE. ALL RIGHTS RESERVED.</p>
      </footer>

      {/* ========================================================================= */}
      {/* 2. MODERN CHECKOUT & ORDER SUCCESS MODAL */}
      {/* ========================================================================= */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity duration-300">

          <div className="bg-white w-full max-w-lg shadow-2xl relative flex flex-col max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">

            {/* Success Overlay Banner */}
            {checkoutSuccess && (
              <div className="absolute inset-0 bg-white z-50 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6 text-green-500 shadow-sm border border-green-100">
                  <span className="material-symbols-outlined text-[48px] font-bold">check_circle</span>
                </div>
                <h3 className="font-headline-md text-2xl text-primary mb-4 font-bold">ORDER SUCCESSFUL!</h3>
                <p className="text-secondary max-w-sm leading-relaxed mb-6">
                  Thank you for your purchase at **TOBEQUE LUXE**. A confirmation email has been sent to your inbox.
                </p>
                <div className="w-12 h-1 bg-primary animate-pulse" />
              </div>
            )}

            {/* Modal Header */}
            <div className="px-6 py-6 border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest">
              <h3 className="font-label-caps text-label-caps tracking-widest text-primary text-base font-bold">SECURE CHECKOUT</h3>
              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="w-10 h-10 flex items-center justify-center hover:bg-neutral-100 rounded-full transition-colors cursor-pointer text-primary"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCheckoutSubmit} className="p-6 flex flex-col gap-6">

              {/* Order Summary details */}
              <div className="bg-neutral-50 p-4 border border-outline-variant/60 flex flex-col gap-2">
                <span className="text-[11px] font-label-caps text-secondary tracking-wider">YOUR ORDER SUMMARY</span>
                {cart.length > 0 ? (
                  <div className="flex flex-col gap-1.5 mt-2">
                    {cart.map((item) => (
                      <div key={item.cartId} className="flex justify-between items-center text-xs text-primary">
                        <span className="truncate max-w-[280px] font-medium">{item.name} ({item.selectedSize}) x{item.quantity}</span>
                        <span>{item.price}</span>
                      </div>
                    ))}
                    <div className="h-px bg-outline-variant/50 my-2" />
                    <div className="flex justify-between items-center text-sm font-bold text-primary">
                      <span>Total Due</span>
                      <span>${cartSubtotal.toFixed(2)}</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center text-sm font-bold text-primary mt-2">
                    <span>{product.name} ({selectedSize}) x1</span>
                    <span>{product.price}</span>
                  </div>
                )}
              </div>

              {/* Form Input fields */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-label-caps text-secondary font-bold">FULL NAME</label>
                  <input
                    type="text"
                    required
                    value={checkoutName}
                    onChange={(e) => setCheckoutName(e.target.value)}
                    placeholder="Enter your full name"
                    className="border border-outline-variant px-4 py-3 text-sm focus:outline-none focus:border-primary bg-white text-primary rounded-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-label-caps text-secondary font-bold">EMAIL ADDRESS</label>
                  <input
                    type="email"
                    required
                    value={checkoutEmail}
                    onChange={(e) => setCheckoutEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="border border-outline-variant px-4 py-3 text-sm focus:outline-none focus:border-primary bg-white text-primary rounded-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-label-caps text-secondary font-bold">CREDIT CARD DETAILS (SIMULATED)</label>
                  <input
                    type="text"
                    required
                    value={checkoutCard}
                    onChange={(e) => setCheckoutCard(e.target.value)}
                    placeholder="4111 2222 3333 4444"
                    maxLength={19}
                    className="border border-outline-variant px-4 py-3 text-sm focus:outline-none focus:border-primary bg-white text-primary rounded-none"
                  />
                </div>
              </div>

              {/* Submit / Pay buttons */}
              <button
                type="submit"
                disabled={isSubmittingOrder}
                className="w-full bg-primary text-on-primary h-14 text-label-caps font-label-caps tracking-widest hover:bg-neutral-800 transition-colors shadow-md mt-4 cursor-pointer font-bold flex justify-center items-center gap-2 disabled:bg-neutral-600"
              >
                {isSubmittingOrder && (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {isSubmittingOrder ? "PROCESSING..." : "SUBMIT ORDER & PAY"}
              </button>
            </form>
          </div>
        </div>
      )}
      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
}
