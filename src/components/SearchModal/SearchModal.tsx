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

  const handleProductClick = (product: any) => {
    dismissMobileKeyboard();
    onClose();
    const productId = product.id || product._id;
    navigate(`/product-category/${product.categorySlug || 'all'}/${product.slug || productId}`);
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
              placeholder="Search products, SKU, barcode..."
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
        {(query.trim() !== "" || results.length > 0) && (
          <div className="absolute top-[100%] left-0 w-full bg-white shadow-2xl border-t border-outline-variant max-h-[70vh] overflow-y-auto no-scrollbar z-50">
            
            {query.trim() && !loading && results.length === 0 && (
              <div className="text-center py-8 text-secondary font-body-md">
                No products found matching "{query}"
              </div>
            )}

            {results.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6">
                {results.map((product) => {
                  const thumbUrl = resolveImageUrl(product.thumbnail);
                  const displayPrice = typeof product.price === 'number' ? product.price.toFixed(2) : product.price;

                  return (
                    <button
                      key={product.id || product._id}
                      onClick={() => handleProductClick(product)}
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
