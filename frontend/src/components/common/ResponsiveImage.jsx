import React, { useState } from 'react';
import { ImageOff } from 'lucide-react';

/**
 * Image with a skeleton while loading, a graceful fallback on error, and
 * layout-shift-free sizing via aspectRatio. Use fetchPriority="high" for the
 * one hero image above the fold; leave loading="lazy" (default) everywhere else.
 */
const ResponsiveImage = ({
  src,
  alt,
  aspectRatio, // e.g. '4 / 3', '1 / 1', '16 / 9'
  sizes,
  loading = 'lazy',
  fetchPriority = 'auto',
  className = '',
  imgClassName = '',
  rounded = 'rounded-2xl',
  overlay,
  objectPosition,
}) => {
  const [status, setStatus] = useState('loading'); // 'loading' | 'loaded' | 'error'

  return (
    <div
      className={`relative overflow-hidden ${rounded} ${className}`}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      {status === 'loading' && (
        <div className={`absolute inset-0 bg-surface-container-high animate-pulse ${rounded}`} />
      )}

      {status === 'error' || !src ? (
        <div className={`absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-surface-container text-on-surface-variant ${rounded}`}>
          <ImageOff className="w-6 h-6 opacity-60" aria-hidden="true" />
          <span className="text-[11px] font-medium opacity-70">Image unavailable</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          sizes={sizes}
          loading={fetchPriority === 'high' ? 'eager' : loading}
          fetchPriority={fetchPriority}
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            status === 'loaded' ? 'opacity-100' : 'opacity-0'
          } ${imgClassName}`}
          style={objectPosition ? { objectPosition } : undefined}
        />
      )}

      {overlay && <div className="absolute inset-0 pointer-events-none">{overlay}</div>}
    </div>
  );
};

export default ResponsiveImage;
