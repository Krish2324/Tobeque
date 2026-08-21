import React, { useState, useEffect } from 'react';

interface ImageWithSkeletonProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  wrapperClassName?: string;
  fallbackSrc?: string;
}

export function ImageWithSkeleton({ src, alt, className, wrapperClassName = '', fallbackSrc, ...props }: ImageWithSkeletonProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    setImgSrc(src);
    setError(false);
    setIsLoaded(false);
  }, [src]);

  return (
    <div className={`${wrapperClassName.includes('absolute') ? '' : 'relative'} w-full h-full bg-surface-container overflow-hidden flex items-center justify-center ${wrapperClassName}`}>
      {/* Skeleton / Pulse effect */}
      {!isLoaded && !error && (
        <div className="absolute inset-0 bg-neutral-200 animate-pulse" />
      )}
      
      {/* Fallback Container for 404 / Missing files */}
      {error && !fallbackSrc && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-400 p-4 text-center select-none">
          <span className="material-symbols-outlined text-2xl mb-1 opacity-40">image_not_supported</span>
          <span className="text-[9px] font-semibold tracking-wider uppercase opacity-50">Image Unavailable</span>
        </div>
      )}

      {/* Actual Image */}
      {(!error || fallbackSrc) && (
        <img
          src={imgSrc}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            if (fallbackSrc && imgSrc !== fallbackSrc) {
              setImgSrc(fallbackSrc);
            } else {
              setIsLoaded(true);
              setError(true);
            }
          }}
          className={`w-full h-full object-cover transition-all duration-500 ${isLoaded && !error ? 'opacity-100' : 'opacity-0'} ${className || ''}`}
          {...props}
        />
      )}
    </div>
  );
}
