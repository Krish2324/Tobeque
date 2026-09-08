import { useState, useEffect, useRef } from "react";
import { useCurrency } from "../../context/CurrencyContext";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductSelect?: (product: any) => void;
}

const isVideo = (url: string | undefined) => url && typeof url === 'string' && !!url.match(/\.(mp4|webm|ogg|mov)$/i);

function resolveImageUrl(path: string | null | undefined): string {
  if (!path || typeof path !== 'string' || !path.trim()) return 'https://via.placeholder.com/400x500?text=No+Image';
  const trimmed = path.trim();
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:')
  ) return trimmed;
  const normalizedPath = trimmed.replace(/\\/g, '/');
  const cleanPath = normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`;
  let apiBase = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
  
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host && !host.includes('localhost') && !host.includes('127.0.0.1')) {
      if (!apiBase || apiBase.includes('localhost') || apiBase.includes('127.0.0.1')) {
        apiBase = 'https://backend.tobeque.com';
      }
    }
  }

  return apiBase ? `${apiBase}${cleanPath}` : cleanPath;
}

const COLOR_SYNONYMS: Record<string, string[]> = {
  black: ['black', 'dark'],
  white: ['white', 'ivory', 'cream', 'snow', 'off-white'],
  grey: ['grey', 'gray', 'silver', 'charcoal', 'ash', 'slate'],
  beige: ['beige', 'tan', 'sand', 'camel', 'mocha', 'oatmeal', 'nude'],
  brown: ['brown', 'chocolate', 'coffee', 'chestnut'],
  blue: ['blue', 'navy', 'indigo', 'sky', 'denim', 'teal', 'cyan', 'azure', 'sapphire'],
  green: ['green', 'olive', 'mint', 'emerald', 'forest', 'sage', 'khaki'],
  red: ['red', 'maroon', 'burgundy', 'wine', 'crimson', 'ruby'],
  pink: ['pink', 'rose', 'magenta', 'fuchsia', 'peach', 'blush'],
  yellow: ['yellow', 'mustard', 'gold', 'lemon'],
  purple: ['purple', 'violet', 'lavender', 'lilac', 'plum'],
  orange: ['orange', 'coral', 'tangerine'],
};

function getSearchedColors(queryStr: string): string[] {
  if (!queryStr || !queryStr.trim()) return [];
  const words = queryStr.toLowerCase().trim().split(/[\s\-_]+/);
  const matchedColors: string[] = [];

  words.forEach(word => {
    const cleanWord = word.replace(/[^a-z]/g, '');
    if (!cleanWord) return;

    for (const [baseColor, synonyms] of Object.entries(COLOR_SYNONYMS)) {
      if (synonyms.includes(cleanWord)) {
        matchedColors.push(baseColor);
        matchedColors.push(cleanWord);
      }
    }
  });

  return Array.from(new Set(matchedColors));
}

interface ColorResolution {
  isColorSearch: boolean;
  isMatch: boolean;
  matchedColorName: string | null;
  displayImageUrl: string;
}

function resolveProductColorAndImage(product: any, searchedColors: string[]): ColorResolution {
  const defaultThumb = resolveImageUrl(product.thumbnail || product.imageSrc);

  if (!searchedColors || searchedColors.length === 0) {
    return {
      isColorSearch: false,
      isMatch: true,
      matchedColorName: null,
      displayImageUrl: defaultThumb,
    };
  }

  const isTermMatch = (colorStr: string | null | undefined): boolean => {
    if (!colorStr || typeof colorStr !== 'string') return false;
    const lower = colorStr.toLowerCase().trim();
    const tokens = lower.split(/[^a-z0-9]+/);
    return searchedColors.some(sc => tokens.includes(sc) || lower === sc);
  };

  let matchedColorName: string | null = null;
  let matchedImageUrl: string | null = null;

  // 1. Check galleryImageObjects or raw backend images for matching color tag
  const imageList = product.galleryImageObjects || product.images || [];
  if (Array.isArray(imageList) && imageList.length > 0) {
    for (const img of imageList) {
      if (img && img.color && isTermMatch(img.color)) {
        matchedColorName = img.color;
        const rawUrl = img.imageUrl || img.url || img.path;
        if (rawUrl) {
          matchedImageUrl = resolveImageUrl(rawUrl);
          break;
        }
      }
    }
  }

  // 2. Check detailedColors / colorSwatches
  if (!matchedImageUrl) {
    const swatchList = product.colorSwatches || product.detailedColors || [];
    if (Array.isArray(swatchList) && swatchList.length > 0) {
      for (const s of swatchList) {
        const colorName = s.color || s.name;
        if (colorName && isTermMatch(colorName)) {
          if (!matchedColorName) matchedColorName = colorName;
          if (s.image && String(s.image).trim()) {
            matchedImageUrl = resolveImageUrl(s.image);
            break;
          }
        }
      }
    }
  }

  // 3. Check thumbnailColor
  if (product.thumbnailColor && isTermMatch(product.thumbnailColor)) {
    if (!matchedColorName) matchedColorName = product.thumbnailColor;
    if (!matchedImageUrl) matchedImageUrl = defaultThumb;
  }

  // 4. Check colors array or variants
  if (!matchedColorName) {
    if (Array.isArray(product.colors)) {
      const matchCol = product.colors.find((c: string) => isTermMatch(c));
      if (matchCol) matchedColorName = matchCol;
    }
  }

  if (!matchedColorName && Array.isArray(product.variants)) {
    for (const v of product.variants) {
      const colorVal = v.color || v.Color;
      if (colorVal && isTermMatch(colorVal)) {
        matchedColorName = colorVal;
        break;
      }
    }
  }

  const isMatch = !!matchedColorName;
  const displayImageUrl = matchedImageUrl || defaultThumb;

  return {
    isColorSearch: true,
    isMatch,
    matchedColorName,
    displayImageUrl,
  };
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const { currencySymbol } = useCurrency();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const dismissMobileKeyboard = () => {
    if (inputRef.current) {
      inputRef.current.blur();
    }
    if (document.activeElement && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    try {
      const dummy = document.createElement('input');
      dummy.setAttribute('type', 'text');
      dummy.style.position = 'fixed';
      dummy.style.opacity = '0';
      dummy.style.top = '-9999px';
      document.body.appendChild(dummy);
      dummy.focus();
      dummy.blur();
      document.body.removeChild(dummy);
    } catch (e) {
      // ignore
    }
  };

  const handleClose = () => {
    dismissMobileKeyboard();
    onClose();
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dismissMobileKeyboard();
    if (query.trim()) {
      setLoading(true);
      api.get('/api/products', { params: { search: query.trim(), status: 'published', limit: 20 } })
        .then((res) => {
          const data = res.data;
          if (data.success && data.data && Array.isArray(data.data.products)) {
            setResults(data.data.products);
          } else {
            setResults([]);
          }
        })
        .catch((err) => {
          console.error("Search error:", err);
          setResults([]);
        })
        .finally(() => setLoading(false));
    }
  };

  const handleProductClick = (product: any, matchedColor?: string | null) => {
    dismissMobileKeyboard();
    onClose();
    const productId = product.id || product._id;
    const catSlug = product.categorySlug || (product.category && product.category.slug) || 'all';
    const colorParam = matchedColor ? `?color=${encodeURIComponent(matchedColor)}` : '';
    navigate(`/product-category/${catSlug}/${product.slug || productId}${colorParam}`);
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim()) {
        setLoading(true);
        api.get('/api/products', { params: { search: query.trim(), status: 'published', limit: 20 } })
          .then((res) => {
            const data = res.data;
            if (data.success && data.data && Array.isArray(data.data.products)) {
              setResults(data.data.products);
            } else {
              setResults([]);
            }
          })
          .catch((err) => {
            console.error("Search error:", err);
            setResults([]);
          })
          .finally(() => setLoading(false));
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const searchedColors = getSearchedColors(query);

  const seenProductIds = new Set<string>();
  const seenNormalizedNames = new Set<string>();

  const processedResults = results
    .map(product => {
      const colorInfo = resolveProductColorAndImage(product, searchedColors);
      return { product, colorInfo };
    })
    .filter(item => {
      if (!item.colorInfo.isMatch) return false;

      const pid = String(item.product.id || item.product._id || '').trim();

      // Normalize product name strictly (e.g. "ASYMMETRIC DRAPE TOP" -> "asymmetricdrapetop")
      const rawName = String(item.product.name || '').toLowerCase();
      const normName = rawName.replace(/[^a-z]/g, '');

      // Normalize product slug strictly (e.g. "asymmetric-drape-top-1" -> "asymmetricdrapetop")
      const rawSlug = String(item.product.slug || '').toLowerCase().replace(/-\d+$/, '').replace(/\d+$/, '');
      const normSlug = rawSlug.replace(/[^a-z]/g, '');

      const uniqueKey = normName || normSlug;

      if (pid && seenProductIds.has(pid)) return false;
      if (uniqueKey && seenNormalizedNames.has(uniqueKey)) return false;

      if (pid) seenProductIds.add(pid);
      if (uniqueKey) seenNormalizedNames.add(uniqueKey);

      return true;
    });

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 w-full z-[120] bg-white border-b border-outline-variant shadow-md animate-in slide-in-from-top-full duration-300">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex flex-col relative">
        <form action="." onSubmit={handleSearchSubmit} className="flex justify-between items-center gap-4">
          <button type="submit" className="text-secondary hover:text-primary transition-colors cursor-pointer border-none bg-transparent p-0 flex items-center">
            <span className="material-symbols-outlined text-2xl">search</span>
          </button>
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="search"
              enterKeyHint="search"
              inputMode="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.keyCode === 13 || e.which === 13) {
                  e.preventDefault();
                  dismissMobileKeyboard();
                  handleSearchSubmit(e);
                }
              }}
              placeholder="Search products, colors, SKU..."
              className="w-full bg-transparent text-headline-sm font-headline-sm text-primary placeholder:text-outline-variant border-none focus:ring-0 py-2 focus:outline-none [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none"
            />
            {loading && (
              <div className="absolute right-0 top-1/2 -translate-y-1/2">
                <svg className="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-neutral-100 transition-colors text-primary cursor-pointer border-none bg-transparent"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </form>

        {/* Results Dropdown Container */}
        {(query.trim() !== "" || processedResults.length > 0) && (
          <div className="absolute top-[100%] left-0 w-full bg-white shadow-2xl border-t border-outline-variant max-h-[70vh] overflow-y-auto no-scrollbar z-50">
            
            {query.trim() && !loading && processedResults.length === 0 && (
              <div className="text-center py-8 text-secondary font-body-md">
                No products found matching "{query}"
              </div>
            )}

            {processedResults.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6">
                {processedResults.map(({ product, colorInfo }) => {
                  const thumbUrl = colorInfo.displayImageUrl;
                  const displayPrice = typeof product.price === 'number' ? product.price.toFixed(2) : product.price;

                  return (
                    <button
                      key={product.id || product._id}
                      onClick={() => handleProductClick(product, colorInfo.matchedColorName)}
                      className="group flex flex-col items-center text-center cursor-pointer appearance-none bg-transparent border-none p-0 focus:outline-none"
                    >
                      <div className="w-full aspect-[3/4] bg-surface-container overflow-hidden mb-3 relative rounded-md">
                        {isVideo(thumbUrl) ? (
                          <video
                            ref={(el) => {
                              if (el) {
                                el.defaultMuted = true;
                                el.muted = true;
                              }
                            }}
                            src={thumbUrl}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            autoPlay
                            loop
                            muted
                            playsInline
                          />
                        ) : (
                          <img
                            src={thumbUrl}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        )}
                        {colorInfo.isColorSearch && colorInfo.matchedColorName && (
                          <div className="absolute bottom-2 left-2 bg-black/75 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-0.5 rounded tracking-wider uppercase">
                            {colorInfo.matchedColorName}
                          </div>
                        )}
                      </div>
                      <h3 className="font-body-md text-xs text-primary uppercase tracking-wider mb-1 line-clamp-1">{product.name}</h3>
                      <p className="font-bold text-primary text-sm">{currencySymbol}{displayPrice}</p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
