import React, { useState, useEffect, useRef } from 'react';

interface ImageWithSkeletonProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  wrapperClassName?: string;
  fallbackSrc?: string;
  /** When true, image loads eagerly with high priority (use for above-the-fold images) */
  priority?: boolean;
}

export function ImageWithSkeleton({
  src,
  alt,
  className,
  wrapperClassName = '',
  fallbackSrc,
  priority = false,
  ...props
}: ImageWithSkeletonProps) {
  // Track whether the *current* src has finished loading
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [imgSrc, setImgSrc] = useState(src);

  // Keep the previously-loaded src so we can show it while the new one loads
  // This eliminates the blank flash when src changes (e.g. color-dot click)
  const prevLoadedSrcRef = useRef<string | undefined>(undefined);


  useEffect(() => {
    if (src === imgSrc) return; // Same src — no change needed

    // Update to new src but keep the old image visible until new one is ready
    setImgSrc(src);
    setError(false);

    // Only show skeleton if there is no previously-loaded fallback to show
    if (!prevLoadedSrcRef.current) {
      setIsLoaded(false);
    }
    // else: keep isLoaded=true so the old image stays visible (no flash)
  }, [src]);

  const handleLoad = () => {
    prevLoadedSrcRef.current = imgSrc;
    setIsLoaded(true);
  };

  const handleError = () => {
    if (fallbackSrc && imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc);
    } else {
      setIsLoaded(true);
      setError(true);
    }
  };

  return (
    <div
      className={`${wrapperClassName.includes('absolute') ? '' : 'relative'} w-full h-full bg-surface-container overflow-hidden flex items-center justify-center ${wrapperClassName}`}
    >
      {/* Skeleton pulse — only shown when there is nothing to display yet */}
      {!isLoaded && !error && !prevLoadedSrcRef.current && (
        <div className="absolute inset-0 bg-neutral-200 animate-pulse" />
      )}

      {/* Fallback container for 404 / missing files */}
      {error && !fallbackSrc && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-400 p-4 text-center select-none">
          <span className="material-symbols-outlined text-2xl mb-1 opacity-40">image_not_supported</span>
          <span className="text-[9px] font-semibold tracking-wider uppercase opacity-50">Image Unavailable</span>
        </div>
      )}

      {/* Actual image — always present in DOM; opacity reveals it after load */}
      {(!error || fallbackSrc) && (
        <img
          src={imgSrc}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          fetchPriority={priority ? 'high' : 'auto'}
          onLoad={handleLoad}
          onError={handleError}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded && !error ? 'opacity-100' : 'opacity-0'
          } ${className || ''}`}
          {...props}
        />
      )}

      {/*
        Ghost layer: shows the previously-loaded image while the new src is loading.
        This prevents a blank flash during color-swap or re-render.
        It sits below the main image and fades out when main image loads.
      */}
      {prevLoadedSrcRef.current && !isLoaded && !error && (
        <img
          src={prevLoadedSrcRef.current}
          alt={alt}
          aria-hidden="true"
          className={`absolute inset-0 w-full h-full object-cover ${className || ''}`}
        />
      )}
    </div>
  );
}
