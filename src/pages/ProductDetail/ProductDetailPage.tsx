import React, { useState, useRef, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { type Product, type ProductColor } from "../../data/products";
import { useProduct, useProducts } from "../../hooks/useProducts";
import api from "../../services/api";

import { ProductCard } from "../../components/ProductCard";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { QuickViewModal } from "../../components/QuickViewModal/QuickViewModal";
import { ShareModal } from '../../components/ShareModal/ShareModal';
import { Navbar } from "../../components/Navbar/Navbar";
import { Footer } from "../../components/Footer/Footer";
import { useCurrency } from "../../context/CurrencyContext";
import { ImageWithSkeleton } from "../../components/ImageWithSkeleton";

const isVideo = (url: string | undefined) => {
  if (!url) return false;
  return !!url.match(/\.(mp4|webm|ogg|mov)(\?.*)?$/i) || url.includes('/video/upload/');
};

const AutoPlayVideo = ({ src, className }: { src: string; className?: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      videoRef.current.playsInline = true;
      // Force play to bypass mobile browser restrictions when possible
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => console.log('Autoplay prevented:', err));
      }
    }
  }, [src]);

  return (
    <video
      ref={videoRef}
      className={className}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
    >
      <source src={src} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
};

// Delivery estimate will be fetched from settings

function useDragScroll() {
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    
    let isDown = false;
    let isDragging = false;
    let startX = 0;
    let scrollLeft = 0;

    const mouseDown = (e: MouseEvent) => {
      isDown = true;
      isDragging = false;
      el.classList.remove('snap-mandatory', 'snap-x', 'scroll-smooth');
      el.classList.add('select-none', '[&_*]:pointer-events-none');
      el.style.cursor = 'grabbing';
      startX = e.pageX - el.offsetLeft;
      scrollLeft = el.scrollLeft;
    };
    
    const mouseLeave = () => {
      isDown = false;
      el.style.cursor = '';
      el.classList.remove('select-none', '[&_*]:pointer-events-none');
      el.classList.add('snap-mandatory', 'snap-x', 'scroll-smooth');
    };
    
    const mouseUp = () => {
      isDown = false;
      el.style.cursor = '';
      el.classList.remove('select-none', '[&_*]:pointer-events-none');
      el.classList.add('snap-mandatory', 'snap-x', 'scroll-smooth');
    };
    
    const mouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      const walk = (x - startX) * 2; 
      if (Math.abs(walk) > 5) {
        isDragging = true;
      }
      el.scrollLeft = scrollLeft - walk;
    };

    const dragStart = (e: DragEvent) => e.preventDefault();
    
    const click = (e: MouseEvent) => {
      if (isDragging) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    el.addEventListener('mousedown', mouseDown);
    el.addEventListener('mouseleave', mouseLeave);
    el.addEventListener('mouseup', mouseUp);
    el.addEventListener('mousemove', mouseMove);
    el.addEventListener('dragstart', dragStart);
    el.addEventListener('click', click, true); // Intercept during capture phase

    return () => {
      el.removeEventListener('mousedown', mouseDown);
      el.removeEventListener('mouseleave', mouseLeave);
      el.removeEventListener('mouseup', mouseUp);
      el.removeEventListener('mousemove', mouseMove);
      el.removeEventListener('dragstart', dragStart);
      el.removeEventListener('click', click, true);
    };
  }, []);

  return ref;
}

export function ProductDetailPage() {
  const { productSlug } = useParams<{ categorySlug?: string; productSlug: string }>();
  const { currencySymbol } = useCurrency();

  // Fetch specific product from backend
  const { product, loading, error } = useProduct(productSlug);

  // Fetch related products (e.g. latest 12 published products)
  const { products: relatedProducts } = useProducts({ limit: 12, status: 'published' });
  
  // 1. Explicitly selected "Style It With" products
  const explicitStyleItWith = product?.styleItWith || [];
  
  // 2. Filter out explicit products and the current product from related products
  const explicitIds = new Set(explicitStyleItWith.map(p => p.id));
  const otherProducts = relatedProducts.filter(p => p.slug !== productSlug && p.id !== productSlug && !explicitIds.has(p.id));
  
  // 3. Merge them for "Style It With" (show up to 8)
  const styleItWithProducts = [...explicitStyleItWith, ...otherProducts].slice(0, 8);
  
  // 4. Use remaining for "You Might Also Like"
  const youMightAlsoLikeProducts = otherProducts.slice(Math.max(0, 8 - explicitStyleItWith.length), Math.max(0, 8 - explicitStyleItWith.length) + 8);

  // Interactive States
  const [selectedColor, setSelectedColor] = useState<ProductColor>({ name: "DEFAULT", class: "bg-primary" });
  const [selectedSize, setSelectedSize] = useState<string>("S");

  const { addToCart, setIsCartOpen, wishlistItems, addToWishlist, removeFromWishlist } = useCart();
  const navigate = useNavigate();
  const { user, isAuthenticated, openLoginModal } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [buttonText, setButtonText] = useState("ADD TO CART");
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const isWishlisted = !!(product && wishlistItems?.some(item => (item.id && product.id && String(item.id) === String(product.id)) || item.name === product.name));

  const [isHeartPopping, setIsHeartPopping] = useState(false);

  const handleToggleWishlist = () => {
    if (!product) return;
    setIsHeartPopping(true);
    setTimeout(() => setIsHeartPopping(false), 400);

    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

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
    ? `${currencySymbol}${Number(currentVariant.price).toFixed(2)}` 
    : product?.price;

  const isOutOfStock = currentVariant && currentVariant.stock !== undefined && currentVariant.stock !== null && currentVariant.stock !== '' && Number(currentVariant.stock) <= 0;

  // Modal states
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isAskQuestionOpen, setIsAskQuestionOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [innerZoom, setInnerZoom] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const swipeStartX = useRef<number | null>(null);
  const [askName, setAskName] = useState('');
  const [askEmail, setAskEmail] = useState('');
  const [askMessage, setAskMessage] = useState('');
  const [askSubmitted, setAskSubmitted] = useState(false);
  const [isSubmittingAsk, setIsSubmittingAsk] = useState(false);
  const [askError, setAskError] = useState('');
  const [deliveryEstimate, setDeliveryEstimate] = useState<string>('');
  const [globalShippingReturns, setGlobalShippingReturns] = useState<string>('Orders are processed within 1-2 business days. Returns accepted within 14 days of delivery.');
  
  // Random Viewer Count
  const [viewers] = useState(() => Math.floor(Math.random() * 40) + 10);

  // Mobile Gallery Scroll State
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const handleGalleryScroll = () => {
    if (galleryScrollRef.current) {
      const scrollPosition = galleryScrollRef.current.scrollLeft;
      const width = galleryScrollRef.current.clientWidth;
      const currentIndex = Math.round(scrollPosition / width);
      setActiveImageIndex(currentIndex);
    }
  };

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
        if (res.data.settings?.shippingReturnsText) {
          setGlobalShippingReturns(res.data.settings.shippingReturnsText);
        }
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

  // Dynamic Head SEO Metadata Management
  useEffect(() => {
    if (!product) return;

    const originalTitle = document.title;
    document.title = product.seoTitle || `${product.name} | Tobeque`;

    // Meta Description Tag
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    const oldDesc = metaDesc.getAttribute('content') || '';
    metaDesc.setAttribute('content', product.seoDescription || product.description || product.name);

    // Meta Keywords Tag
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    const oldKeywords = metaKeywords.getAttribute('content') || '';
    if (product.seoKeywords) {
      metaKeywords.setAttribute('content', product.seoKeywords);
    }

    // JSON-LD Structured Data Schema Injection
    let scriptTag = document.getElementById('product-schema-jsonld') as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'product-schema-jsonld';
      scriptTag.setAttribute('type', 'application/ld+json');
      document.head.appendChild(scriptTag);
    }

    if (product.seoSchema) {
      scriptTag.textContent = product.seoSchema;
    } else {
      const defaultSchema = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": product.name,
        "image": product.galleryImages || [product.imageSrc],
        "description": product.description || product.name,
        "sku": product.sku || product.id,
        "offers": {
          "@type": "Offer",
          "priceCurrency": "INR",
          "price": product.price ? product.price.replace(/[^0-9.]/g, '') : "0",
          "availability": "https://schema.org/InStock"
        }
      };
      scriptTag.textContent = JSON.stringify(defaultSchema);
    }

    return () => {
      document.title = originalTitle;
      if (metaDesc) metaDesc.setAttribute('content', oldDesc);
      if (metaKeywords) metaKeywords.setAttribute('content', oldKeywords);
      if (scriptTag) scriptTag.remove();
    };
  }, [product]);

  // Carousel scroll refs
  const styleItCarouselRef = useDragScroll();
  const likeCarouselRef = useDragScroll();
  const galleryScrollRef = useDragScroll();

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
    
    const primaryImg = product.imageSrc;
    const hoverImg = product.hoverImageSrc;
    
    // If no galleryImageObjects exist, fallback to general gallery images
    if (!product.galleryImageObjects || product.galleryImageObjects.length === 0) {
      if (product.galleryImages && product.galleryImages.length > 0) {
        return product.galleryImages.filter(Boolean);
      }
      return hoverImg && hoverImg !== primaryImg 
        ? [primaryImg, hoverImg].filter(Boolean) 
        : [primaryImg].filter(Boolean);
    }

    const currentSelectedColorName = selectedColor && selectedColor.name ? selectedColor.name.toLowerCase().trim() : '';

    // Filter images tagged with the selected color
    const colorMatches: string[] = [];
    
    product.galleryImageObjects.forEach((imgObj) => {
      if (!imgObj.url) return;
      const imgColor = (imgObj.color || '').toLowerCase().trim();
      
      if (imgColor && currentSelectedColorName && currentSelectedColorName !== 'default') {
        if (imgColor === currentSelectedColorName || currentSelectedColorName.includes(imgColor) || imgColor.includes(currentSelectedColorName)) {
          if (!colorMatches.includes(imgObj.url)) {
            colorMatches.push(imgObj.url);
          }
        }
      }
    });

    // If color-specific images exist for the selected color, return ONLY those color images
    if (colorMatches.length > 0) {
      return colorMatches;
    }

    // Fallback: If no images are tagged with this color, show all gallery images
    if (product.galleryImages && product.galleryImages.length > 0) {
      return product.galleryImages.filter(Boolean);
    }
    return [primaryImg].filter(Boolean);
  }, [product, selectedColor]);

  // Reset gallery scroll index when selected color changes
  useEffect(() => {
    setActiveImageIndex(0);
    if (galleryScrollRef.current) {
      galleryScrollRef.current.scrollLeft = 0;
    }
  }, [selectedColor]);

  // Add primary product to bag
  const handleAddToBag = () => {
    if (!product) return;
    setIsAdding(true);
    setButtonText("ADDING...");

    setTimeout(() => {
      const cartImage = displayedImages.find(img => !img.match(/\.(mp4|webm|ogg)$/i)) || displayedImages[0] || product.imageSrc;
      const newItem = {
        id: product.id as string,
        name: product.name,
        price: displayPrice || product.price,
        imageSrc: cartImage,
        selectedSize: selectedSize,
        selectedColor: selectedColor.name,
        quantity: quantity,
        taxRate: product.taxRate || 0
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
    
    const cartImage = displayedImages.find(img => !img.match(/\.(mp4|webm|ogg)$/i)) || displayedImages[0] || product.imageSrc;
    
    const newItem = {
      id: product.id as string,
      name: product.name,
      price: displayPrice || product.price,
      imageSrc: cartImage,
      selectedSize: selectedSize,
      selectedColor: selectedColor.name,
      quantity: quantity,
      taxRate: product.taxRate || 0
    };

    addToCart(newItem);
    
    if (!isAuthenticated) {
      openLoginModal(() => navigate('/checkout'));
    } else {
      navigate('/checkout');
    }
  };

  // Smooth Carousel scroll handlers
  const scrollCarousel = (ref: React.RefObject<HTMLDivElement | null>, direction: "left" | "right") => {
    if (ref.current) {
      const itemWidth = ref.current.firstElementChild?.clientWidth || ref.current.offsetWidth * 0.5;
      const scrollAmt = itemWidth * 2;
      ref.current.scrollBy({ left: direction === "left" ? -scrollAmt : scrollAmt, behavior: "smooth" });
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
        <Navbar />
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
        <Navbar />
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
      <Navbar onSearchProductSelect={(p) => setQuickViewProduct(p)} />

      {/* Main Content Canvas */}
      <main className="flex-grow w-full">

        {/* Product Detail Section (Split Frame) */}
        <section className="flex flex-col lg:flex-row w-full mb-6 md:mb-8">

          {/* Left: Split Image Gallery */}
          <div className="w-full lg:w-[70%] relative">
            <div
              ref={galleryScrollRef}
              onScroll={handleGalleryScroll}
              className="w-full h-[calc(100svh-64px)] lg:h-auto flex lg:grid lg:grid-cols-2 gap-0 overflow-x-auto lg:overflow-x-visible snap-x snap-mandatory no-scrollbar scroll-smooth"
            >
              {displayedImages.map((img, index) => (
                <div
                  key={`${img}-${index}`}
                  onClick={() => { setZoomedImage(img); setInnerZoom(false); }}
                  className="snap-center shrink-0 w-full h-full lg:h-auto lg:aspect-[2/3] relative overflow-hidden bg-surface-container cursor-zoom-in group"
                >
                  {isVideo(img) ? (
                    <AutoPlayVideo
                      className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                      src={img}
                    />
                  ) : (
                    <ImageWithSkeleton
                      alt={`${product.imageAltTag || product.imageAlt || product.name} detail view ${index + 1}`}
                      wrapperClassName="absolute inset-0"
                      src={img}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Pagination Dots for Mobile */}
            {displayedImages.length > 1 && (
              <div className="lg:hidden absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-10 pointer-events-none">
                {displayedImages.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1.5 rounded-full shadow-[0_1px_3px_rgba(0,0,0,0.5)] transition-all duration-300 ${
                      activeImageIndex === index ? 'bg-white w-4' : 'bg-white/50 w-1.5'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right: Minimal editorial product info — quiet, refined, secondary to imagery */}
          <div className="w-full lg:w-[30%] flex flex-col pb-6 pt-10 lg:pt-16 px-5 lg:pl-10 lg:pr-6 lg:sticky top-0 self-start gap-0">

            {/* Brand label / category hint */}
            {product.badge && (
              <span className="text-[9px] tracking-[0.2em] uppercase text-secondary font-medium mb-2 block">
                {product.badge}
              </span>
            )}

            {/* Product Name & Wishlist Heart Button */}
            {/* Wishlist Particle Keyframes */}
            <style>{`
              @keyframes wishlistFloatUp {
                0% { opacity: 1; transform: translate(-50%, 0) scale(0.7); }
                60% { opacity: 1; transform: translate(-50%, -20px) scale(1.3); }
                100% { opacity: 0; transform: translate(-50%, -34px) scale(0.9); }
              }
              @keyframes wishlistParticle {
                0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                100% { opacity: 0; transform: translate(var(--tx), var(--ty)) scale(0); }
              }
            `}</style>

            {/* Product Name & Wishlist Heart Button */}
            <div className="flex items-start justify-between gap-4 mb-2">
              <h1 className="text-[17px] font-light text-primary leading-snug tracking-[0.01em]">
                {product.name}
              </h1>
              
              <button
                type="button"
                onClick={handleToggleWishlist}
                title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                aria-label={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                className="relative p-1 bg-transparent cursor-pointer shrink-0 group select-none"
              >
                {/* Main Heart Icon with Elastic Spring & Rotation */}
                <span 
                  className={`material-symbols-outlined text-[19px] block transition-all duration-300 transform ${
                    isWishlisted 
                      ? 'text-red-500 drop-shadow-[0_2px_10px_rgba(239,68,68,0.5)]' 
                      : 'text-secondary/60 group-hover:text-red-500 group-hover:scale-110'
                  } ${isHeartPopping ? 'scale-[1.45] -rotate-12' : 'scale-100 rotate-0'}`}
                  style={{ fontVariationSettings: isWishlisted ? "'FILL' 1" : "'FILL' 0" }}
                >
                  favorite
                </span>

                {/* Micro Sparkle Explosion & Floating Heart Animation */}
                {isHeartPopping && (
                  <>
                    {/* Floating Mini Heart */}
                    <span 
                      className="absolute top-0 left-1/2 text-red-500 pointer-events-none z-10"
                      style={{ animation: 'wishlistFloatUp 0.65s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards' }}
                    >
                      <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                        favorite
                      </span>
                    </span>

                    {/* Radial Particle Explosion */}
                    {[
                      { tx: '0px', ty: '-24px', color: 'bg-rose-500' },
                      { tx: '17px', ty: '-17px', color: 'bg-pink-400' },
                      { tx: '24px', ty: '0px', color: 'bg-red-500' },
                      { tx: '17px', ty: '17px', color: 'bg-rose-400' },
                      { tx: '0px', ty: '24px', color: 'bg-pink-500' },
                      { tx: '-17px', ty: '17px', color: 'bg-red-400' },
                      { tx: '-24px', ty: '0px', color: 'bg-rose-500' },
                      { tx: '-17px', ty: '-17px', color: 'bg-pink-400' },
                    ].map((p, idx) => (
                      <span
                        key={idx}
                        className={`absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full ${p.color} pointer-events-none shadow-sm`}
                        style={{
                          animation: 'wishlistParticle 0.55s ease-out forwards',
                          '--tx': p.tx,
                          '--ty': p.ty,
                        } as React.CSSProperties}
                      />
                    ))}
                  </>
                )}
              </button>
            </div>

            {/* Price Row — compact */}
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-sm font-medium text-primary">{displayPrice}</span>
              {product.originalPrice && (
                <span className="text-xs text-secondary/60 line-through">{product.originalPrice}</span>
              )}
            </div>

            {/* Live Viewer Count */}
            <div className="flex items-center gap-1.5 mb-4 text-[10px] text-secondary/70 tracking-wide">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-primary">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              <span>
                <span className="font-medium">{viewers}</span> people are viewing this right now
              </span>
            </div>

            {/* Thin divider */}
            <div className="w-8 h-px bg-outline-variant mb-4" />

            {/* Size Selection & Size Guide — compact, minimal */}
            {(() => {
              const hasSizes = product.sizes && product.sizes.length > 0;
              const hasSizeGuide = product.sizeChart ? product.sizeChart.disabled !== true : false;

              if (!hasSizes && !hasSizeGuide) return null;

              return (
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2.5">
                    <span className="text-[10px] tracking-[0.15em] uppercase text-secondary font-medium">
                      {hasSizes ? "Size" : "Size Guide"}
                    </span>
                    {hasSizeGuide && (
                      <button
                        className="text-[10px] text-secondary/60 hover:text-primary transition-colors underline underline-offset-2 cursor-pointer"
                        onClick={() => setIsSizeGuideOpen(true)}
                      >
                        Size Guide
                      </button>
                    )}
                  </div>
                  {hasSizes && (
                    <div className="flex flex-wrap gap-1.5">
                      {product.sizes?.map((sz) => (
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
                  )}
                </div>
              );
            })()}

            {/* Color Selection — minimal dots */}
            {product.detailedColors && product.detailedColors.length > 0 && (
              <div className="mb-4">
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
            <div className="flex flex-col gap-2 mb-4">
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
            <div className="flex items-center gap-6 mb-4">
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
            <div className="border-t border-outline-variant/50 pt-3 mb-4 space-y-1.5">
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

            {/* Elegant Soft Light Guarantee & Trust Card */}
            {(() => {
              const isBadgeEnabled = (val: any) => {
                if (val === false || val === 'false' || val === 0 || val === '0') return false;
                return true;
              };
              const show7Day = isBadgeEnabled(product.show7DayReturn);
              const showFree = isBadgeEnabled(product.showFreeShipping);
              const showCod = isBadgeEnabled(product.showCodAvailable);
              const activeCount = (show7Day ? 1 : 0) + (showFree ? 1 : 0) + (showCod ? 1 : 0);

              return (
                <div className="bg-[#f7faf8] dark:bg-neutral-900/60 border border-[#dce8df] dark:border-neutral-800 rounded-xl p-3 mb-4 shadow-none">
                  {/* Top: 3 Guarantees with soft icons and high contrast crisp text */}
                  {activeCount > 0 && (
                    <div className={`grid ${activeCount === 1 ? 'grid-cols-1' : activeCount === 2 ? 'grid-cols-2' : 'grid-cols-3'} gap-1.5 text-center divide-x divide-[#cce0d2] dark:divide-neutral-800`}>
                      {show7Day && (
                        <div className="flex flex-col items-center justify-center px-1 py-0.5">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-emerald-700 dark:text-emerald-400 mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                            <path d="M3 3v5h5"/>
                          </svg>
                          <span className="text-[10px] sm:text-[11px] font-bold text-gray-900 dark:text-gray-100 leading-tight">7 Day Return</span>
                          <span className="text-[8px] sm:text-[9px] font-medium text-gray-600 dark:text-gray-300 mt-0.5 leading-tight">No Questions Asked</span>
                        </div>
                      )}
                      {showFree && (
                        <div className="flex flex-col items-center justify-center px-1 py-0.5">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-emerald-700 dark:text-emerald-400 mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="1" y="3" width="15" height="13"/>
                            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                            <circle cx="5.5" cy="18.5" r="2.5"/>
                            <circle cx="18.5" cy="18.5" r="2.5"/>
                          </svg>
                          <span className="text-[10px] sm:text-[11px] font-bold text-gray-900 dark:text-gray-100 leading-tight">Free Shipping</span>
                          <span className="text-[8px] sm:text-[9px] font-medium text-gray-600 dark:text-gray-300 mt-0.5 leading-tight">on pre-paid orders</span>
                        </div>
                      )}
                      {showCod && (
                        <div className="flex flex-col items-center justify-center px-1 py-0.5">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-emerald-700 dark:text-emerald-400 mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="6" width="20" height="12" rx="2"/>
                            <circle cx="12" cy="12" r="2"/>
                            <path d="M6 12h.01M18 12h.01"/>
                          </svg>
                          <span className="text-[10px] sm:text-[11px] font-bold text-gray-900 dark:text-gray-100 leading-tight">COD Available</span>
                          <span className="text-[8px] sm:text-[9px] font-medium text-gray-600 dark:text-gray-300 mt-0.5 leading-tight">On All Orders</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Bottom: Subtle Payment Icons + Trust text */}
                  <div className="flex items-center justify-between border-t border-[#dce8df] dark:border-neutral-800/80 pt-2 mt-2 text-[9px] text-gray-500 dark:text-gray-400">
                    <span className="tracking-wide font-medium">Guaranteed safe checkout</span>
                    <div className="flex items-center gap-1.5">
                      {/* Visa */}
                      <svg viewBox="0 0 48 32" width="24" height="16" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="32" rx="3" fill="#1a1f71"/><path d="M20 22L22.5 10H26L23.5 22H20ZM35 10.4C34.2 10.1 33 9.8 31.5 9.8C28.5 9.8 26.4 11.3 26.4 13.4C26.4 15 27.8 15.9 28.9 16.4C30 16.9 30.4 17.3 30.4 17.8C30.4 18.6 29.3 19 28.3 19C27 19 26.3 18.8 25.2 18.4L24.8 18.2L24.3 21.1C25.3 21.5 27 21.9 28.8 21.9C32 21.9 34 20.4 34 18.1C34 16.9 33.2 16 31.6 15.2C30.6 14.7 29.9 14.4 29.9 13.8C29.9 13.3 30.5 12.7 31.8 12.7C32.9 12.7 33.7 12.9 34.3 13.2L34.6 13.3L35 10.4ZM40.5 10H38.1C37.3 10 36.7 10.2 36.4 11L32 22H35.2L35.9 20H39.7L40.1 22H43L40.5 10ZM36.8 17.5L38.2 13.6L39 17.5H36.8ZM17.5 10L14.5 18.3L14.2 16.9C13.6 15 11.8 12.9 9.8 11.8L12.5 22H15.8L21 10H17.5Z" fill="white"/><path d="M11.4 10H6L5.9 10.3C10.1 11.4 13 13.9 14.2 16.9L13 11C12.7 10.2 12.1 10 11.4 10Z" fill="#f9a51a"/></svg>
                      {/* Mastercard */}
                      <svg viewBox="0 0 48 32" width="24" height="16" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="32" rx="3" fill="#252525"/><circle cx="19" cy="16" r="9" fill="#eb001b"/><circle cx="29" cy="16" r="9" fill="#f79e1b"/><path d="M24 9.57A9 9 0 0 1 28.43 16 9 9 0 0 1 24 22.43 9 9 0 0 1 19.57 16 9 9 0 0 1 24 9.57Z" fill="#ff5f00"/></svg>
                      {/* UPI */}
                      <span className="bg-white dark:bg-neutral-800 text-[7.5px] font-bold tracking-wider text-[#097939] border border-[#cce0d2] dark:border-neutral-700 px-1 py-0.5 rounded">UPI</span>
                      {/* COD */}
                      <span className="bg-white dark:bg-neutral-800 text-[7.5px] font-bold tracking-wider text-gray-600 dark:text-gray-300 border border-[#cce0d2] dark:border-neutral-700 px-1 py-0.5 rounded">COD</span>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Expandable Accordions — ultra-minimal */}
            <div className="flex flex-col border-t border-outline-variant/50">
              {/* 1. Description Section (Top Accordion) */}
              {product.description && (
                <details className="group py-2.5 border-b border-outline-variant/40 cursor-pointer" open>
                  <summary className="flex justify-between items-center text-[10px] tracking-[0.1em] uppercase text-primary/70 list-none font-medium">
                    Description
                    <span className="material-symbols-outlined group-open:rotate-180 transition-transform text-secondary/50" style={{ fontSize: '14px' }}>expand_more</span>
                  </summary>
                  <div className="pt-2 pb-1 text-[11px] text-secondary/70 leading-relaxed pr-2 whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: product.description }} />
                </details>
              )}
              
              {/* 2. Dynamic Product Custom Sections (Middle Accordions, above Shipping & Returns) */}
              {product.customSections && Array.isArray(product.customSections) && product.customSections.map((sec, idx) => (
                <details key={idx} className="group py-2.5 border-b border-outline-variant/40 cursor-pointer">
                  <summary className="flex justify-between items-center text-[10px] tracking-[0.1em] uppercase text-primary/70 list-none font-medium">
                    {sec.title}
                    <span className="material-symbols-outlined group-open:rotate-180 transition-transform text-secondary/50" style={{ fontSize: '14px' }}>expand_more</span>
                  </summary>
                  <div className="pt-2 pb-1 text-[11px] text-secondary/70 leading-relaxed pr-2 whitespace-pre-wrap">
                    {sec.content}
                  </div>
                </details>
              ))}

              {/* 3. Global Shipping & Returns Section (Bottom Accordion, maintained from Admin Settings -> General Branding) */}
              <details className="group py-2.5 border-b border-outline-variant/40 cursor-pointer">
                <summary className="flex justify-between items-center text-[10px] tracking-[0.1em] uppercase text-primary/70 list-none font-medium">
                  Shipping &amp; Returns
                  <span className="material-symbols-outlined group-open:rotate-180 transition-transform text-secondary/50" style={{ fontSize: '14px' }}>expand_more</span>
                </summary>
                <div className="pt-2 pb-1 text-[11px] text-secondary/70 leading-relaxed pr-2 whitespace-pre-wrap">
                  {globalShippingReturns}
                </div>
              </details>
            </div>

          </div>
        </section>

        {/* ─── Size Guide Modal ─── */}
        {isSizeGuideOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto p-4" onClick={() => setIsSizeGuideOpen(false)}>
            <div className="bg-white max-w-lg w-full p-6 md:p-8 relative shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
              <button
                className="absolute top-4 right-4 w-8 h-8 rounded-full border border-outline-variant flex items-center justify-center text-primary hover:bg-neutral-50 transition-colors"
                onClick={() => setIsSizeGuideOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
              <h2 className="text-center text-xl font-light tracking-widest mb-6">Size Chart</h2>
              <h3 className="font-semibold text-sm mb-4">Size Guide</h3>

              {(() => {
                const chart = product?.sizeChart;
                const headers = (chart && Array.isArray(chart.headers) && chart.headers.length > 0) 
                  ? chart.headers 
                  : ['Size', 'Bust', 'Waist', 'Hip'];
                const rows = (chart && Array.isArray(chart.rows) && chart.rows.length > 0)
                  ? chart.rows
                  : [
                      { Size: 'XS', Bust: '30.5', Waist: '24.5', Hip: '34' },
                      { Size: 'S',  Bust: '32',   Waist: '26',   Hip: '35.5' },
                      { Size: 'M',  Bust: '33.5', Waist: '27',   Hip: '37' },
                      { Size: 'L',  Bust: '35',   Waist: '29',   Hip: '38' },
                      { Size: 'XL', Bust: '36.5', Waist: '30.5', Hip: '40' },
                    ];
                const note = chart?.note !== undefined ? chart.note : "All measurements are in inches. If you're between sizes, we recommend sizing up.";

                return (
                  <>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-outline-variant">
                            {headers.map((h: string) => (
                              <th key={h} className="text-center py-2 text-xs font-medium text-secondary tracking-wider uppercase">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {rows.map((row: any, rIdx: number) => (
                            <tr key={rIdx} className="border-b border-outline-variant hover:bg-surface-container/50">
                              {headers.map((h: string) => (
                                <td key={h} className="text-center py-3 text-secondary font-medium">{row[h] !== undefined ? row[h] : (row[h.toLowerCase()] !== undefined ? row[h.toLowerCase()] : '-')}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {note && <p className="text-[11px] text-secondary mt-4">{note}</p>}
                  </>
                );
              })()}
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

        <div className="w-full">
          {/* Divider */}
          <div className="w-full h-px bg-outline-variant my-6" />

          {/* STYLE IT WITH Carousel */}
          <section className="mb-8 md:mb-10 relative">
            <div className="flex flex-col items-center mb-6">
              <h2 className="text-headline-md font-headline-md text-primary uppercase tracking-widest text-center">RELATED PRODUCTS</h2>
            </div>

            <div className="relative group/carousel">
              {/* Carousel Container */}
              <div
                ref={styleItCarouselRef}
                className="flex overflow-x-auto snap-x snap-mandatory gap-2 no-scrollbar pb-4 scroll-smooth px-1"
              >
                {styleItWithProducts.map((item) => (
                  <div
                    key={item.id}
                    className="snap-start shrink-0 w-[calc(50%-4px)] md:w-[calc(33.333%-6px)] lg:w-[calc(25%-6px)]"
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
                type="button"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); scrollCarousel(styleItCarouselRef, "left"); }}
                aria-label="Previous items"
                className="hidden lg:flex absolute top-1/2 left-4 -translate-y-1/2 w-10 h-10 rounded-full bg-white/70 backdrop-blur-md border border-white/40 shadow-[0_4px_12px_rgba(0,0,0,0.05)] text-primary hover:bg-white hover:scale-110 items-center justify-center transition-all z-20 cursor-pointer opacity-0 group-hover/carousel:opacity-100"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>chevron_left</span>
              </button>
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); scrollCarousel(styleItCarouselRef, "right"); }}
                aria-label="Next items"
                className="hidden lg:flex absolute top-1/2 right-4 -translate-y-1/2 w-10 h-10 rounded-full bg-white/70 backdrop-blur-md border border-white/40 shadow-[0_4px_12px_rgba(0,0,0,0.05)] text-primary hover:bg-white hover:scale-110 items-center justify-center transition-all z-20 cursor-pointer opacity-0 group-hover/carousel:opacity-100"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>chevron_right</span>
              </button>
            </div>
          </section>

          {/* YOU MIGHT ALSO LIKE Carousel */}
          <section className="mb-8 md:mb-10 relative">
            <div className="flex flex-col items-center mb-6">
              <h2 className="text-headline-md font-headline-md text-primary uppercase tracking-widest text-center">YOU MIGHT ALSO LIKE</h2>
            </div>

            <div className="relative group/carousel">
              {/* Carousel Container */}
              <div
                ref={likeCarouselRef}
                className="flex overflow-x-auto snap-x snap-mandatory gap-2 no-scrollbar pb-4 scroll-smooth px-1"
              >
                {youMightAlsoLikeProducts.map((item) => (
                  <div
                    key={item.id}
                    className="snap-start shrink-0 w-[calc(50%-4px)] md:w-[calc(33.333%-6px)] lg:w-[calc(25%-6px)]"
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
                type="button"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); scrollCarousel(likeCarouselRef, "left"); }}
                aria-label="Previous items"
                className="hidden lg:flex absolute top-1/2 left-4 -translate-y-1/2 w-10 h-10 rounded-full bg-white/70 backdrop-blur-md border border-white/40 shadow-[0_4px_12px_rgba(0,0,0,0.05)] text-primary hover:bg-white hover:scale-110 items-center justify-center transition-all z-20 cursor-pointer opacity-0 group-hover/carousel:opacity-100"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>chevron_left</span>
              </button>
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); scrollCarousel(likeCarouselRef, "right"); }}
                aria-label="Next items"
                className="hidden lg:flex absolute top-1/2 right-4 -translate-y-1/2 w-10 h-10 rounded-full bg-white/70 backdrop-blur-md border border-white/40 shadow-[0_4px_12px_rgba(0,0,0,0.05)] text-primary hover:bg-white hover:scale-110 items-center justify-center transition-all z-20 cursor-pointer opacity-0 group-hover/carousel:opacity-100"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>chevron_right</span>
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

      {/* Premium Zoom Modal */}
      {zoomedImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-0 sm:p-12 cursor-zoom-out backdrop-blur-md animate-fade-in group/zoommodal"
          onClick={() => { setZoomedImage(null); setInnerZoom(false); }}
        >
          {(() => {
            const currentIndex = displayedImages.indexOf(zoomedImage);
            const hasPrev = currentIndex > 0;
            const hasNext = currentIndex !== -1 && currentIndex < displayedImages.length - 1;
            
            return (
              <>
                {hasPrev && !innerZoom && (
                  <button
                    onClick={(e) => { e.stopPropagation(); setZoomedImage(displayedImages[currentIndex - 1]); setInnerZoom(false); }}
                    className="hidden sm:flex absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-white hover:text-black text-white rounded-full items-center justify-center transition-all duration-300 backdrop-blur-md border border-white/20 cursor-pointer hover:scale-110 z-[110]"
                    aria-label="Previous image"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
                  </button>
                )}
                {hasNext && !innerZoom && (
                  <button
                    onClick={(e) => { e.stopPropagation(); setZoomedImage(displayedImages[currentIndex + 1]); setInnerZoom(false); }}
                    className="hidden sm:flex absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-white hover:text-black text-white rounded-full items-center justify-center transition-all duration-300 backdrop-blur-md border border-white/20 cursor-pointer hover:scale-110 z-[110]"
                    aria-label="Next image"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                  </button>
                )}
              </>
            );
          })()}
          <div 
            className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-none sm:rounded-xl shadow-none sm:shadow-[0_0_50px_rgba(0,0,0,0.3)] bg-transparent sm:bg-black/20"
            onClick={(e) => {
               if (isVideo(zoomedImage)) {
                 e.stopPropagation();
                 return;
               }
               e.stopPropagation(); 
               setInnerZoom(!innerZoom); 
            }}
            onTouchStart={(e) => {
              if (!innerZoom) {
                swipeStartX.current = e.touches[0].clientX;
              }
            }}
            onTouchEnd={(e) => {
              if (!innerZoom && swipeStartX.current !== null && zoomedImage) {
                const swipeEndX = e.changedTouches[0].clientX;
                const diffX = swipeStartX.current - swipeEndX;
                if (Math.abs(diffX) > 50) {
                  const currentIndex = displayedImages.indexOf(zoomedImage);
                  if (diffX > 0 && currentIndex !== -1 && currentIndex < displayedImages.length - 1) {
                    setZoomedImage(displayedImages[currentIndex + 1]);
                  } else if (diffX < 0 && currentIndex > 0) {
                    setZoomedImage(displayedImages[currentIndex - 1]);
                  }
                }
                swipeStartX.current = null;
              }
            }}
            onMouseMove={(e) => {
              if (!innerZoom) return;
              const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
              const x = ((e.clientX - left) / width) * 100;
              const y = ((e.clientY - top) / height) * 100;
              setMousePos({ x, y });
            }}
            onTouchMove={(e) => {
              if (!innerZoom) return;
              // Prevent default to stop page scrolling while panning zoomed image
              if (e.cancelable) e.preventDefault();
              const touch = e.touches[0];
              const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
              // Calculate standard percentages
              const rawX = ((touch.clientX - left) / width) * 100;
              const rawY = ((touch.clientY - top) / height) * 100;
              
              // For touch dragging, we invert the movement so dragging left moves the image left (which means origin moves right)
              // Let's use a standard mapping first:
              setMousePos({ 
                x: Math.max(0, Math.min(100, rawX)), 
                y: Math.max(0, Math.min(100, rawY))
              });
            }}
            onMouseLeave={() => setInnerZoom(false)}
            style={{ cursor: isVideo(zoomedImage) ? 'auto' : (innerZoom ? 'zoom-out' : 'zoom-in') }}
          >
            {isVideo(zoomedImage) ? (
              <video
                className="w-full h-full object-cover sm:object-contain"
                src={zoomedImage}
                autoPlay loop controls playsInline
              />
            ) : (
              <img
                alt="Zoomed view"
                className="w-full h-full object-cover sm:object-contain"
                src={zoomedImage}
                style={{
                  transform: innerZoom ? 'scale(2.2)' : 'scale(1)',
                  transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                  transition: 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)'
                }}
                draggable={false}
              />
            )}
            
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 sm:top-6 sm:right-6 w-12 h-12 bg-black/50 hover:bg-white hover:text-black text-white rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-md border border-white/20 cursor-pointer hover:scale-110 z-10"
              onClick={(e) => { e.stopPropagation(); setZoomedImage(null); setInnerZoom(false); }}
              aria-label="Close zoom"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
            
            {/* Hint text */}
            {!innerZoom && !isVideo(zoomedImage) && (
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/60 text-white/90 px-6 py-2.5 rounded-full text-[10px] font-medium tracking-[0.2em] uppercase backdrop-blur-md border border-white/10 pointer-events-none transition-opacity duration-500 opacity-70">
                Tap to pan & zoom
              </div>
            )}
          </div>
        </div>
      )}

      <ShareModal 
        isOpen={isShareModalOpen} 
        onClose={() => setIsShareModalOpen(false)} 
        productName={product.name}
        url={window.location.href}
      />

    </div>
  );
}
