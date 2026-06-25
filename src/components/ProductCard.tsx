import React from "react";
import { Link } from "react-router-dom";
import { type Product } from "../data/products";
export type { Product };

export interface ProductCardProps {
  product: Product;
  isWishlisted?: boolean;
  onWishlistClick?: (e: React.MouseEvent, product: Product) => void;
  onQuickViewClick?: (product: Product) => void;
  onAddToCartClick?: (e: React.MouseEvent, product: Product) => void;
}

const isVideo = (url: string | undefined) => url && !!url.match(/\.(mp4|webm|ogg|mov)(\?.*)?$/i);

export function ProductCard({
  product,
  isWishlisted = false,
  onWishlistClick,
  onQuickViewClick,
  onAddToCartClick,
}: ProductCardProps) {
  return (
    <div className="group relative flex flex-col">
      {/* Image Container with Separated Link & Button Layers */}
      <div className="relative aspect-[2/3] bg-surface-container overflow-hidden mb-2 block">
        {/* Clickable Image Layer */}
        <Link 
          to={`/product/${product.id || ""}`}
          className="absolute inset-0 z-0 block cursor-pointer hover:opacity-100"
        >
          {/* Primary Image */}
          {isVideo(product.imageSrc) ? (
            <video
              className={`w-full h-full object-cover object-center absolute inset-0 transition-transform duration-700 ease-in-out ${product.hoverImageSrc ? '' : 'group-hover:scale-105'}`}
              src={product.imageSrc}
              autoPlay loop muted playsInline
            />
          ) : (
            <img
              alt={product.imageAlt || product.name}
              className={`w-full h-full object-cover object-center absolute inset-0 transition-transform duration-700 ease-in-out ${product.hoverImageSrc ? '' : 'group-hover:scale-105'}`}
              src={product.imageSrc}
            />
          )}
          {/* Alternate Image on Hover */}
          {product.hoverImageSrc && (
            isVideo(product.hoverImageSrc) ? (
              <video
                className="w-full h-full object-cover object-center absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700 ease-in-out"
                src={product.hoverImageSrc}
                autoPlay loop muted playsInline
              />
            ) : (
              <img
                alt={(product.imageAlt || product.name) + " alternate view"}
                className="w-full h-full object-cover object-center absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700 ease-in-out"
                src={product.hoverImageSrc}
              />
            )
          )}
        </Link>

        {/* Badge Overlay */}
        {product.badge && (
          <div className="absolute top-4 left-4 flex flex-col gap-2 z-10 pointer-events-none">
            <span
              className={`${product.badgeClass || 'bg-primary text-on-primary'} font-label-caps text-[10px] px-2 py-1 uppercase tracking-wider`}
            >
              {product.badge}
            </span>
          </div>
        )}

        {/* Floating Top Right Icons */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-10 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
          <button
            onClick={(e) => onWishlistClick?.(e, product)}
            aria-label="Add to Wishlist"
            className={`w-8 h-8 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors shadow-sm cursor-pointer ${
              isWishlisted
                ? "bg-primary text-on-primary"
                : "bg-surface/90 text-primary hover:bg-primary hover:text-on-primary"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">favorite</span>
          </button>
          <button
            onClick={() => onQuickViewClick?.(product)}
            aria-label="Quick View"
            className="w-8 h-8 bg-surface/90 backdrop-blur-sm rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-colors shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">visibility</span>
          </button>
          <button
            onClick={(e) => onAddToCartClick?.(e, product)}
            aria-label="Add to Bag"
            className="w-8 h-8 bg-surface/90 backdrop-blur-sm rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-colors shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
          </button>
        </div>

        {/* Hover Size UI */}
        {product.sizes && product.sizes.length > 0 && (
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

      <div className="flex flex-col gap-0.5 px-1 mt-1">
        {/* Clickable Title */}
        <Link 
          to={`/product/${product.id || ""}`} 
          className="hover:underline cursor-pointer block text-left"
        >
          <h3 className="font-body-md text-[11px] text-secondary truncate tracking-wide">
            {product.name}
          </h3>
        </Link>
        <p className="font-body-md text-[12px] font-semibold text-primary">
          {product.price}
        </p>
        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center gap-2 mt-2">
            {product.colors.map((colorClass, idx) => (
              <div
                key={idx}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                className={`w-4 h-4 rounded-full ${colorClass} border border-outline-variant cursor-pointer`}
              ></div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
