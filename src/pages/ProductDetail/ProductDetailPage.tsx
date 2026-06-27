import React, { useState, useRef, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { type Product, type ProductColor } from "../../data/products";
import { useProduct, useProducts } from "../../hooks/useProducts";
import api from "../../services/api";

import { ProductCard } from "../../components/ProductCard";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { QuickViewModal } from "../../components/QuickViewModal/QuickViewModal";
import { ShareModal } from '../../components/ShareModal/ShareModal';
import { SimpleNavbar } from "../../components/SimpleNavbar/SimpleNavbar";
import { Footer } from "../../components/Footer/Footer";

const isVideo = (url: string | undefined) => url && !!url.match(/\.(mp4|webm|ogg|mov)(\?.*)?$/i);

// Delivery estimate will be fetched from settings

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

  const currentVariant = React.useMemo(() => {
    if (!product?.rawVariants) return null;
    return product.rawVariants.find(v => {
      const vColorKey = Object.keys(v).find(k => k.toLowerCase() === 'color');
      const vSizeKey = Object.keys(v).find(k => k.toLowerCase() === 'size');
      
      const matchesColor = !vColorKey || !selectedColor || selectedColor.name === "DEFAULT" || 
        String(v[vColorKey]).trim().toLowerCase() === selectedColor.name.toLowerCase();
        
      const matchesSize = !vSizeKey || !selectedSize || 
        String(v[vSizeKey]).trim().toLowerCase() === selectedSize.toLowerCase();
        
      return matchesColor && matchesSize;
    });
  }, [product, selectedColor, selectedSize]);

  const displayPrice = currentVariant && currentVariant.price !== undefined && currentVariant.price !== null && currentVariant.price !== ''
    ? `₹${Number(currentVariant.price).toFixed(2)}` 
    : product?.price;

  const isOutOfStock = currentVariant && currentVariant.stock !== undefined && currentVariant.stock !== null && currentVariant.stock !== '' && Number(currentVariant.stock) <= 0;

  // Modal states
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isAskQuestionOpen, setIsAskQuestionOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [askName, setAskName] = useState('');
  const [askEmail, setAskEmail] = useState('');
  const [askMessage, setAskMessage] = useState('');
  const [askSubmitted, setAskSubmitted] = useState(false);
  const [isSubmittingAsk, setIsSubmittingAsk] = useState(false);
  const [askError, setAskError] = useState('');
  const [deliveryEstimate, setDeliveryEstimate] = useState<string>('');
  
  // Random Viewer Count
  const [viewers] = useState(() => Math.floor(Math.random() * 40) + 10);

  useEffect(() => {
    api.get('/api/settings/public')
      .then(res => {
        const min = parseInt(res.data.settings?.deliveryEstimateMin || '3', 10);
        const max = parseInt(res.data.settings?.deliveryEstimateMax || '5', 10);
        const now = new Date();
        const from = new Date(now); from.setDate(now.getDate() + min);
        const to = new Date(now); to.setDate(now.getDate() + max);
        const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        const fmt = (d: Date) => `${d.getDate()} ${months[d.getMonth()]}`;
        setDeliveryEstimate(`${fmt(from)} - ${fmt(to)}, ${to.getFullYear()}`);
      })
      .catch(() => {
        const now = new Date();
        const from = new Date(now); from.setDate(now.getDate() + 3);
        const to = new Date(now); to.setDate(now.getDate() + 5);
        const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        const fmt = (d: Date) => `${d.getDate()} ${months[d.getMonth()]}`;
        setDeliveryEstimate(`${fmt(from)} - ${fmt(to)}, ${to.getFullYear()}`);
      });
  }, []);

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
        price: displayPrice || product.price,
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
      price: displayPrice || product.price,
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

  const handleAskQuestionSubmit = async () => {
    if (!askName || !askEmail || !askMessage) {
      setAskError('Please fill in all fields.');
      return;
    }
    setAskError('');
    setIsSubmittingAsk(true);
    try {
      const response = await api.post('/api/inquiries', {
        productId: product?.id,
        productName: product?.name,
        name: askName,
        email: askEmail,
        message: askMessage
      });
      const data = response.data;
      if (data.success) {
        setAskSubmitted(true);
        setAskName('');
        setAskEmail('');
        setAskMessage('');
      } else {
        setAskError(data.message || 'Failed to submit inquiry.');
      }
    } catch (err) {
      console.error(err);
      setAskError('An error occurred. Please try again later.');
    } finally {
      setIsSubmittingAsk(false);
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
        <section className="flex flex-col lg:flex-row w-full mb-6 md:mb-8">

          {/* Left: Split Image Gallery — wider, images first */}
          <div
            ref={galleryScrollRef}
            className="w-full lg:w-3/4 flex lg:grid lg:grid-cols-2 gap-0 overflow-x-auto lg:overflow-x-visible snap-x snap-mandatory no-scrollbar h-[calc(100svh-64px)] lg:h-auto scroll-smooth"
          >
            {displayedImages.map((img, index) => (
              <div
                key={`${img}-${index}`}
                className="snap-center shrink-0 w-full h-full lg:h-auto lg:aspect-[2/3] relative overflow-hidden bg-surface-container"
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

          {/* Right: Minimal editorial product info — quiet, refined, secondary to imagery */}
          <div className="w-full lg:w-1/4 flex flex-col py-6 lg:py-10 px-5 lg:px-7 lg:sticky top-0 self-start gap-0">

            {/* Brand label / category hint */}
            {product.badge && (
              <span className="text-[9px] tracking-[0.2em] uppercase text-secondary font-medium mb-3 block">
                {product.badge}
              </span>
            )}

            {/* Product Name — refined, light weight */}
            <h1 className="text-[17px] font-light text-primary mb-2 leading-snug tracking-[0.01em]">
              {product.name}
            </h1>

            {/* Price Row — compact */}
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-sm font-medium text-primary">{displayPrice}</span>
              {product.originalPrice && (
                <span className="text-xs text-secondary/60 line-through">{product.originalPrice}</span>
              )}
            </div>

            {/* Live Viewer Count */}
            <div className="flex items-center gap-1.5 mb-6 text-[10px] text-secondary/70 tracking-wide">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-primary">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              <span>
                <span className="font-medium">{viewers}</span> people are viewing this right now
              </span>
            </div>

            {/* Thin divider */}
            <div className="w-8 h-px bg-outline-variant mb-6" />

            {/* Size Selection — compact, minimal */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-5">
                <div className="flex justify-between items-center mb-2.5">
                  <span className="text-[10px] tracking-[0.15em] uppercase text-secondary font-medium">
                    Size
                  </span>
                  <button
                    className="text-[10px] text-secondary/60 hover:text-primary transition-colors underline underline-offset-2"
                    onClick={() => setIsSizeGuideOpen(true)}
                  >
                    Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`w-8 h-8 text-[10px] tracking-wider uppercase font-medium border transition-all duration-200 ${
                        selectedSize === sz
                          ? 'border-primary bg-primary text-on-primary'
                          : 'border-outline-variant text-secondary/70 hover:border-primary/50 hover:text-primary'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection — minimal dots */}
            {product.detailedColors && product.detailedColors.length > 0 && (
              <div className="mb-6">
                <span className="text-[10px] tracking-[0.15em] uppercase text-secondary font-medium block mb-2.5">
                  Colour — <span className="text-primary">{selectedColor.name}</span>
                </span>
                <div className="flex gap-2">
                  {product.detailedColors.map((color) => {
                    const isOutOfStock = color.inStock === false;
                    return (
                      <button
                        key={color.name}
                        disabled={isOutOfStock}
                        onClick={() => setSelectedColor(color)}
                        aria-label={`Select Color ${color.name}`}
                        className={`relative w-5 h-5 rounded-full border transition-all duration-200 ${
                          isOutOfStock ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer hover:scale-105'
                        } ${
                          selectedColor.name === color.name && !isOutOfStock
                            ? 'ring-1 ring-offset-1 ring-primary scale-110'
                            : 'border-outline-variant'
                        }`}
                        style={color.bgStyle}
                        title={isOutOfStock ? 'Out of Stock' : color.name}
                      >
                        {isOutOfStock && (
                          <div className="absolute inset-0 m-auto w-full h-[1px] bg-red-500 rotate-45 transform origin-center" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity + Add to Cart */}
            <div className="flex flex-col gap-2 mb-5">
              <div className="flex gap-2 items-stretch">
                <div className="flex items-center border border-outline-variant h-10 shrink-0">
                  <button
                    id="quantity-decrease"
                    aria-label="Decrease quantity"
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-8 h-full flex items-center justify-center text-secondary hover:text-primary transition-colors cursor-pointer select-none"
                  >
                    <span style={{ fontSize: '13px', lineHeight: 1 }}>&#8722;</span>
                  </button>
                  <span id="quantity-display" className="w-7 text-center text-primary text-[11px] font-medium select-none">
                    {quantity}
                  </span>
                  <button
                    id="quantity-increase"
                    aria-label="Increase quantity"
                    onClick={() => setQuantity(q => q + 1)}
                    className="w-8 h-full flex items-center justify-center text-secondary hover:text-primary transition-colors cursor-pointer select-none"
                  >
                    <span style={{ fontSize: '13px', lineHeight: 1 }}>&#43;</span>
                  </button>
                </div>
                <button
                  id="add-to-cart-btn"
                  onClick={handleAddToBag}
                  disabled={isAdding || isOutOfStock}
                  className="flex-1 border border-primary text-primary h-10 text-[10px] font-medium tracking-[0.15em] uppercase hover:bg-neutral-50 transition-colors flex justify-center items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isAdding && (
                    <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  {isOutOfStock ? "OUT OF STOCK" : buttonText}
                </button>
              </div>
              <button
                id="buy-now-btn"
                onClick={handleBuyItNow}
                disabled={isOutOfStock}
                className="w-full bg-primary text-on-primary h-10 text-[10px] font-medium tracking-[0.15em] uppercase hover:bg-neutral-800 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Buy Now
              </button>
            </div>

            {/* Ask a Question + Share */}
            <div className="flex items-center gap-6 mb-6">
              <button
                className="flex items-center gap-1.5 hover:text-primary transition-colors text-[10px] text-secondary/60 tracking-wide w-fit font-bold uppercase"
                onClick={() => { setAskSubmitted(false); setIsAskQuestionOpen(true); }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                Ask a Question
              </button>
              
              <button
                className="flex items-center gap-1.5 hover:text-primary transition-colors text-[10px] text-secondary/60 tracking-wide w-fit font-bold uppercase"
                onClick={() => setIsShareModalOpen(true)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                Share
              </button>
            </div>

            {/* Estimated Delivery + SKU — ultra-light meta info */}
            <div className="border-t border-outline-variant/50 pt-4 mb-5 space-y-2">
              <div className="flex items-center gap-2 text-[10px] text-secondary/70">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-secondary/50"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                <span>Delivery:</span>
                <span className="text-primary/80">{deliveryEstimate}</span>
              </div>
              {product.sku && (
                <div className="flex items-center gap-2 text-[10px] text-secondary/70">
                  <span className="w-14 shrink-0">Sku:</span>
                  <span className="text-primary/70 tracking-wider font-light">{product.sku}</span>
                </div>
              )}
            </div>

            {/* Payment Trust Badge — very subtle */}
            <div className="border border-outline-variant/40 rounded px-3 py-2.5 mb-5">
              <div className="flex items-center gap-2 justify-center mb-1">
                {/* Visa */}
                <svg viewBox="0 0 48 32" width="30" height="20" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="32" rx="4" fill="#1a1f71"/><path d="M20 22L22.5 10H26L23.5 22H20ZM35 10.4C34.2 10.1 33 9.8 31.5 9.8C28.5 9.8 26.4 11.3 26.4 13.4C26.4 15 27.8 15.9 28.9 16.4C30 16.9 30.4 17.3 30.4 17.8C30.4 18.6 29.3 19 28.3 19C27 19 26.3 18.8 25.2 18.4L24.8 18.2L24.3 21.1C25.3 21.5 27 21.9 28.8 21.9C32 21.9 34 20.4 34 18.1C34 16.9 33.2 16 31.6 15.2C30.6 14.7 29.9 14.4 29.9 13.8C29.9 13.3 30.5 12.7 31.8 12.7C32.9 12.7 33.7 12.9 34.3 13.2L34.6 13.3L35 10.4ZM40.5 10H38.1C37.3 10 36.7 10.2 36.4 11L32 22H35.2L35.9 20H39.7L40.1 22H43L40.5 10ZM36.8 17.5L38.2 13.6L39 17.5H36.8ZM17.5 10L14.5 18.3L14.2 16.9C13.6 15 11.8 12.9 9.8 11.8L12.5 22H15.8L21 10H17.5Z" fill="white"/><path d="M11.4 10H6L5.9 10.3C10.1 11.4 13 13.9 14.2 16.9L13 11C12.7 10.2 12.1 10 11.4 10Z" fill="#f9a51a"/></svg>
                {/* Mastercard */}
                <svg viewBox="0 0 48 32" width="30" height="20" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="32" rx="4" fill="#252525"/><circle cx="19" cy="16" r="9" fill="#eb001b"/><circle cx="29" cy="16" r="9" fill="#f79e1b"/><path d="M24 9.57A9 9 0 0 1 28.43 16 9 9 0 0 1 24 22.43 9 9 0 0 1 19.57 16 9 9 0 0 1 24 9.57Z" fill="#ff5f00"/></svg>
                {/* UPI */}
                <div className="bg-neutral-100 rounded px-1 py-0.5 text-[8px] font-bold text-[#097939]">UPI</div>
                {/* COD */}
                <div className="bg-neutral-100 rounded px-1 py-0.5 text-[8px] font-bold text-gray-600">COD</div>
              </div>
              <p className="text-center text-[9px] text-secondary/50 tracking-wide">Guaranteed safe &amp; secure checkout</p>
            </div>

            {/* Expandable Accordions — ultra-minimal */}
            <div className="flex flex-col border-t border-outline-variant/50">
              <details className="group py-2.5 border-b border-outline-variant/40 cursor-pointer" open>
                <summary className="flex justify-between items-center text-[10px] tracking-[0.1em] uppercase text-primary/70 list-none font-medium">
                  Description
                  <span className="material-symbols-outlined group-open:rotate-180 transition-transform text-secondary/50" style={{ fontSize: '14px' }}>expand_more</span>
                </summary>
                <div className="pt-2 pb-1 text-[11px] text-secondary/70 leading-relaxed pr-2">
                  {product.description || 'A striking fitted top crafted from luxury materials.'}
                </div>
              </details>
              <details className="group py-2.5 border-b border-outline-variant/40 cursor-pointer">
                <summary className="flex justify-between items-center text-[10px] tracking-[0.1em] uppercase text-primary/70 list-none font-medium">
                  Fabric &amp; Care
                  <span className="material-symbols-outlined group-open:rotate-180 transition-transform text-secondary/50" style={{ fontSize: '14px' }}>expand_more</span>
                </summary>
                <div className="pt-2 pb-1 text-[11px] text-secondary/70 leading-relaxed pr-2">
                  {product.fabricCare || '92% Polyamide, 8% Elastane. Hand wash cold.'}
                </div>
              </details>
              <details className="group py-2.5 border-b border-outline-variant/40 cursor-pointer">
                <summary className="flex justify-between items-center text-[10px] tracking-[0.1em] uppercase text-primary/70 list-none font-medium">
                  Shipping &amp; Returns
                  <span className="material-symbols-outlined group-open:rotate-180 transition-transform text-secondary/50" style={{ fontSize: '14px' }}>expand_more</span>
                </summary>
                <div className="pt-2 pb-1 text-[11px] text-secondary/70 leading-relaxed pr-2">
                  {product.shippingReturns || 'Orders processed in 1-2 days. Returns accepted within 14 days.'}
                </div>
              </details>
            </div>

          </div>
        </section>

        {/* ─── Size Guide Modal ─── */}
        {isSizeGuideOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setIsSizeGuideOpen(false)}>
            <div className="bg-white max-w-lg w-full mx-4 p-8 relative" onClick={e => e.stopPropagation()}>
              <button
                className="absolute top-4 right-4 w-8 h-8 rounded-full border border-outline-variant flex items-center justify-center text-primary hover:bg-neutral-50 transition-colors"
                onClick={() => setIsSizeGuideOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
              <h2 className="text-center text-xl font-light tracking-widest mb-6">Size Chart</h2>
              <h3 className="font-semibold text-sm mb-4">Size Guide</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-outline-variant">
                    {['Size', 'Bust', 'Waist', 'Hip'].map(h => (
                      <th key={h} className="text-center py-2 text-xs font-medium text-secondary tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { size: 'XS', bust: '30.5', waist: '24.5', hip: '34' },
                    { size: 'S',  bust: '32',   waist: '26',   hip: '35.5' },
                    { size: 'M',  bust: '33.5', waist: '27',   hip: '37' },
                    { size: 'L',  bust: '35',   waist: '29',   hip: '38' },
                    { size: 'XL', bust: '36.5', waist: '30.5', hip: '40' },
                  ].map(row => (
                    <tr key={row.size} className="border-b border-outline-variant hover:bg-surface-container/50">
                      <td className="text-center py-3 font-medium text-primary">{row.size}</td>
                      <td className="text-center py-3 text-secondary">{row.bust}</td>
                      <td className="text-center py-3 text-secondary">{row.waist}</td>
                      <td className="text-center py-3 text-secondary">{row.hip}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-[11px] text-secondary mt-4">All measurements are in inches. If you're between sizes, we recommend sizing up.</p>
            </div>
          </div>
        )}

        {/* ─── Ask a Question Modal ─── */}
        {isAskQuestionOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setIsAskQuestionOpen(false)}>
            <div className="bg-white max-w-md w-full mx-4 p-8 relative" onClick={e => e.stopPropagation()}>
              <button
                className="absolute top-4 right-4 w-8 h-8 rounded-full border border-outline-variant flex items-center justify-center text-primary hover:bg-neutral-50 transition-colors"
                onClick={() => setIsAskQuestionOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
              <h2 className="text-center text-xl font-light tracking-widest mb-6">Ask a Question</h2>
              {askSubmitted ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-600"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <p className="text-sm text-secondary">Thank you! We'll get back to you soon.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {askError && <div className="text-red-500 text-xs text-center">{askError}</div>}
                  <input
                    type="text" placeholder="Your Name"
                    value={askName} onChange={e => setAskName(e.target.value)}
                    className="w-full border border-outline-variant px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                    disabled={isSubmittingAsk}
                  />
                  <input
                    type="email" placeholder="Your Email"
                    value={askEmail} onChange={e => setAskEmail(e.target.value)}
                    className="w-full border border-outline-variant px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                    disabled={isSubmittingAsk}
                  />
                  <textarea
                    placeholder="Your Message"
                    rows={5}
                    value={askMessage} onChange={e => setAskMessage(e.target.value)}
                    className="w-full border border-outline-variant px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors resize-none"
                    disabled={isSubmittingAsk}
                  />
                  <button
                    onClick={handleAskQuestionSubmit}
                    disabled={isSubmittingAsk}
                    className="w-full bg-primary text-on-primary py-3 text-[11px] font-bold tracking-widest uppercase hover:bg-neutral-800 transition-colors flex justify-center items-center gap-2"
                  >
                    {isSubmittingAsk && (
                      <svg className="animate-spin h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    )}
                    {isSubmittingAsk ? 'SUBMITTING...' : 'Submit Now'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="px-8 max-w-[1600px] mx-auto w-full">
          {/* Divider */}
          <div className="w-full h-px bg-outline-variant my-6" />

          {/* STYLE IT WITH Carousel */}
          <section className="mb-8 md:mb-10 relative">
            <div className="flex flex-col items-center mb-4">
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
          <section className="mb-8 md:mb-10 relative">
            <div className="flex flex-col items-center mb-4">
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

      <ShareModal 
        isOpen={isShareModalOpen} 
        onClose={() => setIsShareModalOpen(false)} 
        productName={product.name}
        url={window.location.href}
      />

    </div>
  );
}
