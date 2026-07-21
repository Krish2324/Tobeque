import React, { useState } from 'react';

interface ImageWithSkeletonProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  wrapperClassName?: string;
}

export function ImageWithSkeleton({ src, alt, className, wrapperClassName = '', ...props }: ImageWithSkeletonProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className={`${wrapperClassName.includes('absolute') ? '' : 'relative'} w-full h-full bg-surface-container overflow-hidden ${wrapperClassName}`}>
      {/* Skeleton / Pulse effect */}
      {!isLoaded && !error && (
        <div className="absolute inset-0 bg-neutral-200 animate-pulse" />
      )}
      
      {/* Actual Image */}
      <img
        src={src}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setIsLoaded(true);
          setError(true);
        }}
        className={`w-full h-full object-cover transition-all duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className || ''}`}
        {...props}
      />
    </div>
  );
}
