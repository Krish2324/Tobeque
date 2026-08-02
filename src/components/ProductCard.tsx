import React, { useState } from "react";
import { Link } from "react-router-dom";
import { type Product } from "../data/products";
import { ImageWithSkeleton } from "./ImageWithSkeleton";
export type { Product };

export interface ProductCardProps {
  product: Product;
  isWishlisted?: boolean;
  onWishlistClick?: (e: React.MouseEvent, product: Product) => void;
  onQuickViewClick?: (product: Product) => void;
  onAddToCartClick?: (e: React.MouseEvent, product: Product) => void;
  viewMode?: 'grid' | 'list';
  compact?: boolean;
}

const isVideo = (url: string | undefined) => url && !!url.match(/\.(mp4|webm|ogg|mov)(\?.*)?$/i);

export function ProductCard({
  product,
  isWishlisted = false,
  onWishlistClick,
  onQuickViewClick,
  onAddToCartClick,
  viewMode = 'grid',
  compact = false,
}: ProductCardProps) {
  if (viewMode === 'list') {
    return (
      <div className="group relative flex items-start sm:items-center gap-4 sm:gap-8 md:gap-12 border-b border-outline-variant/20 py-6 md:py-8 w-full text-left transition-colors">
        {/* Left Side: Responsive Image Container */}
        <div className="relative w-28 sm:w-56 md:w-72 lg:w-[280px] shrink-0 aspect-[4/5] bg-surface-container overflow-hidden rounded-md">
          <Link 
            to={`/product-category/${product.categorySlug || 'all'}/${product.slug || product.id}`}
            className="absolute inset-0 z-0 block cursor-pointer"
          >
            <ImageWithSkeleton
              alt={product.imageAltTag || product.imageAlt || product.name}
              wrapperClassName="absolute inset-0"
              className="object-center transition-transform duration-700 ease-in-out group-hover:scale-105"
              src={product.imageSrc}
            />
          </Link>
          {/* Badge Overlay - Same as Grid View */}
          {product.badge && (
            <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-10 pointer-events-none">
              <span
                className={`${product.badgeClass || 'bg-primary text-on-primary'} font-label-caps text-[8px] px-1.5 py-0.5 uppercase tracking-wider rounded-sm`}
              >
                {product.badge}
              </span>
            </div>
          )}
        </div>

        {/* Right Side: Info & Actions */}
        <div className="flex-1 flex flex-col justify-center gap-3 sm:gap-4 md:gap-5 min-w-0 py-1">
          <div className="flex flex-col gap-1 sm:gap-2">
            <Link to={`/product-category/${product.categorySlug || 'all'}/${product.slug || product.id}`} className="hover:text-primary cursor-pointer transition-colors inline-block">
              <h2 className="font-body-md text-xs sm:text-sm text-secondary uppercase tracking-[0.1em] font-medium truncate sm:whitespace-normal">
                {product.name}
              </h2>
            </Link>
            <p className="font-body-md text-[11px] sm:text-xs font-bold text-secondary/80">
              {product.price}
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 mt-1">
            <button
              onClick={(e) => onAddToCartClick?.(e, product)}
              className="px-4 py-2 bg-primary text-on-primary hover:bg-neutral-800 transition-colors text-[9px] font-label-caps tracking-widest font-bold cursor-pointer rounded-sm"
            >
              Add to Bag
            </button>
            <button
              onClick={(e) => onWishlistClick?.(e, product)}
              className={`w-8 h-8 flex items-center justify-center transition-colors cursor-pointer rounded-full border ${
                isWishlisted
                  ? "bg-primary border-primary text-on-primary"
                  : "border-outline-variant text-secondary hover:border-primary hover:text-primary"
              }`}
              title="Wishlist"
            >
              <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: isWishlisted ? "'FILL' 1" : "'FILL' 0" }}>
                favorite
              </span>
            </button>
            <button
              onClick={() => onQuickViewClick?.(product)}
              className="w-8 h-8 flex items-center justify-center transition-colors cursor-pointer rounded-full border border-outline-variant text-secondary hover:border-primary hover:text-primary"
              title="Quick View"
            >
              <span className="material-symbols-outlined text-[15px] font-light">visibility</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Color-image swap state ───────────────────────────────────────────────
  const [selectedColorName, setSelectedColorName] = useState<string | null>(null);

  // Display image for desktop webpage (respects selected color or default imageSrc)
  const displayImage = React.useMemo(() => {
    if (selectedColorName) {
      const match = product.galleryImageObjects?.find(
        (g) => g.color && g.color.trim().toLowerCase() === selectedColorName.toLowerCase()
      );
      if (match) return match.url;
    }
    return product.imageSrc;
  }, [product, selectedColorName]);

  const images = React.useMemo(() => {
    if (selectedColorName) {
      const match = product.galleryImageObjects?.find(
        (g) => g.color && g.color.trim().toLowerCase() === selectedColorName.toLowerCase()
      );
      if (match) return [match.url];
    }
    
    if (product.galleryImages && product.galleryImages.length > 0) {
       return product.galleryImages;
    }
    
    if (product.hoverImageSrc) {
       return [product.imageSrc, product.hoverImageSrc];
    }
    return [product.imageSrc];
  }, [product, selectedColorName]);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollPosition = scrollRef.current.scrollLeft;
      const width = scrollRef.current.clientWidth;
      const currentIndex = Math.round(scrollPosition / width);
      setActiveImageIndex(currentIndex);
    }
  };

  return (
    <div className="group relative flex flex-col transition-transform duration-300 ease-out hover:scale-[1.02] hover:z-10">
      {/* Image Container with Separated Link & Button Layers */}
      <div className="relative aspect-[2/3] bg-surface-container overflow-hidden mb-2 block group/carousel">
        {/* Mobile View: Swipable Image Gallery Layer */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="sm:hidden absolute inset-0 flex overflow-x-auto snap-x snap-mandatory no-scrollbar scroll-smooth z-0"
        >
          {images.map((img, idx) => (
            <Link
              key={`${img}-${idx}`}
              to={`/product-category/${product.categorySlug || 'all'}/${product.slug || product.id}`}
              className="snap-center shrink-0 w-full h-full relative block cursor-pointer"
            >
              {isVideo(img) ? (
                <video
                  className="w-full h-full object-cover object-center absolute inset-0 transition-transform duration-700 ease-in-out group-hover:scale-105"
                  src={img}
                  autoPlay loop muted playsInline
                />
              ) : (
                <ImageWithSkeleton
                  alt={`${product.imageAltTag || product.imageAlt || product.name} view ${idx + 1}`}
                  wrapperClassName="absolute inset-0"
                  className="object-center transition-transform duration-700 ease-in-out group-hover:scale-105"
                  src={img}
                />
              )}
            </Link>
          ))}
        </div>

        {/* Desktop View: Old Webpage Flow (Primary Image + Hover Image Transition) */}
        <div className="hidden sm:block absolute inset-0 z-0">
          <Link
            to={`/product-category/${product.categorySlug || 'all'}/${product.slug || product.id}`}
            className="absolute inset-0 block cursor-pointer"
          >
            {isVideo(displayImage) ? (
              <video
                className="w-full h-full object-cover object-center absolute inset-0 transition-transform duration-700 ease-in-out group-hover:scale-105"
                src={displayImage}
                autoPlay loop muted playsInline
              />
            ) : (
              <ImageWithSkeleton
                alt={product.imageAltTag || product.imageAlt || product.name}
                wrapperClassName="absolute inset-0"
                className={`object-center transition-all duration-500 ease-in-out ${!selectedColorName && product.hoverImageSrc ? '' : 'group-hover:scale-105'}`}
                src={displayImage}
              />
            )}

            {/* Old Flow Hover Image Overlay on Webpage */}
            {!selectedColorName && product.hoverImageSrc && (
              isVideo(product.hoverImageSrc) ? (
                <video
                  className="w-full h-full object-cover object-center absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700 ease-in-out"
                  src={product.hoverImageSrc}
                  autoPlay loop muted playsInline
                />
              ) : (
                <ImageWithSkeleton
                  alt={(product.imageAltTag || product.imageAlt || product.name) + " alternate view"}
                  wrapperClassName="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700 ease-in-out"
                  className="object-center"
                  src={product.hoverImageSrc}
                />
              )
            )}
          </Link>
        </div>

        {/* Mobile-Only Pagination Dots */}
        {images.length > 1 && (
          <div className="sm:hidden absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-10 pointer-events-none transition-opacity duration-300 opacity-100">
            {images.map((_, index) => (
              <div
                key={index}
                className={`h-1 rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.5)] transition-all duration-300 ${
                  activeImageIndex === index ? 'bg-white w-3' : 'bg-white/50 w-1'
                }`}
              />
            ))}
          </div>
        )}

        {/* Badge Overlay */}
        {product.badge && (
          <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-10 pointer-events-none">
            <span
              className={`${product.badgeClass || 'bg-primary text-on-primary'} font-label-caps text-[8px] px-1.5 py-0.5 uppercase tracking-wider rounded-sm`}
            >
              {product.badge}
            </span>
          </div>
        )}

        {/* Floating Top Right Icons */}
        <div className={`absolute flex flex-col z-10 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 ${
          compact ? 'top-1.5 right-1.5 gap-1' : 'top-4 right-4 gap-2'
        }`}>
          {/* Wishlist */}
          <button
            onClick={(e) => onWishlistClick?.(e, product)}
            aria-label="Add to Wishlist"
            className={`rounded-full flex items-center justify-center transition-colors shadow-sm cursor-pointer ${
              compact ? 'w-6 h-6' : 'w-8 h-8'
            } ${
              isWishlisted
                ? "bg-primary text-on-primary"
                : "bg-white/95 text-primary hover:bg-primary hover:text-white"
            }`}
          >
            {compact ? (
              <svg width="11" height="11" viewBox="0 0 24 24" fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            ) : (
              <span className="material-symbols-outlined text-[18px]">favorite</span>
            )}
          </button>
          {/* Quick View */}
          <button
            onClick={() => onQuickViewClick?.(product)}
            aria-label="Quick View"
            className={`bg-white/95 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors shadow-sm cursor-pointer ${
              compact ? 'w-6 h-6' : 'w-8 h-8'
            }`}
          >
            {compact ? (
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            ) : (
              <span className="material-symbols-outlined text-[18px]">visibility</span>
            )}
          </button>
          {!compact && (
            <button
              onClick={(e) => onAddToCartClick?.(e, product)}
              aria-label="Add to Bag"
              className="w-8 h-8 bg-surface/90 backdrop-blur-sm rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-colors shadow-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
            </button>
          )}
        </div>

        {/* Hover Size UI — hidden in compact mode */}
        {!compact && product.sizes && product.sizes.length > 0 && (
          <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col gap-2 z-10 pointer-events-none">
            <div className="flex justify-center gap-4 text-[10px] font-label-caps bg-surface/90 backdrop-blur-sm py-2 border border-outline-variant shadow-sm pointer-events-auto">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={(e) => {
                    // Simulate Add to Bag with size
                    onAddToCartClick?.(e, product);
                  }}
                  className="hover:text-primary transition-colors cursor-pointer"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-0 px-0.5 mt-1.5 transition-opacity duration-300 group-hover:opacity-100 opacity-90">
        {/* Clickable Title */}
        <Link 
          to={`/product-category/${product.categorySlug || 'all'}/${product.slug || product.id}`} 
          className="hover:underline cursor-pointer block text-left"
        >
          <h3 className="font-body-md text-[10px] text-secondary truncate tracking-wide leading-tight">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center justify-between mt-0.5">
          <p className="font-body-md text-[11px] font-medium text-primary/80">
            {product.price}
          </p>
          {(() => {
            const maxColors = compact ? 1 : 4;
            if (product.detailedColors && product.detailedColors.length > 0) {
              return (
                <div className="flex items-center gap-1 shrink-0">
                  {product.detailedColors.slice(0, maxColors).map((color, idx) => {
                    const isSelected = selectedColorName === color.name;
                    return (
                      <div
                        key={idx}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          // Toggle off if already selected, otherwise select
                          setSelectedColorName(isSelected ? null : color.name);
                        }}
                        className={`w-3.5 h-3.5 rounded-full border shadow-sm cursor-pointer hover:scale-110 transition-all duration-200 relative ${
                          isSelected
                            ? 'ring-2 ring-offset-1 ring-primary scale-110'
                            : color.name.toLowerCase() === 'white' ? 'border-outline-variant/60' : 'border-black/10'
                        }`}
                        style={color.bgStyle}
                        title={color.name}
                      >
                        {!color.inStock && (
                          <div className="absolute inset-0 w-full h-full border border-red-500/50 rounded-full" />
                        )}
                      </div>
                    );
                  })}
                  {product.detailedColors.length > maxColors && (
                    <span className="text-[9px] text-secondary font-medium ml-0.5 whitespace-nowrap">
                      +{product.detailedColors.length - maxColors}
                    </span>
                  )}
                </div>
              );
            } else if (product.colors && product.colors.length > 0) {
              return (
                <div className="flex items-center gap-1 shrink-0">
                  {product.colors.slice(0, maxColors).map((colorClass, idx) => (
                    <div
                      key={idx}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      className={`w-3.5 h-3.5 rounded-full ${colorClass} border border-outline-variant shadow-sm cursor-pointer hover:scale-110 transition-transform`}
                    ></div>
                  ))}
                  {product.colors.length > maxColors && (
                    <span className="text-[9px] text-secondary font-medium ml-0.5 whitespace-nowrap">
                      +{product.colors.length - maxColors}
                    </span>
                  )}
                </div>
              );
            }
            return null;
          })()}
        </div>
      </div>
    </div>
  );
}
