import { useState, useEffect, useRef } from "react";

export interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductSelect?: (product: any) => void;
}

const isVideo = (url: string | undefined) => url && typeof url === 'string' && url.match(/\.(mp4|webm|ogg|mov)$/i);

export function SearchModal({ isOpen, onClose, onProductSelect }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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
        fetch(`/api/products?search=${encodeURIComponent(query)}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.success && data.data && data.data.products) {
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
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 w-full z-[120] bg-white border-b border-outline-variant shadow-md animate-in slide-in-from-top-full duration-300">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex flex-col relative">
        <div className="flex justify-between items-center gap-4">
          <span className="material-symbols-outlined text-secondary text-2xl">search</span>
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products, SKU, barcode..."
              className="w-full bg-transparent text-headline-sm font-headline-sm text-primary placeholder:text-outline-variant border-none focus:ring-0 py-2 focus:outline-none"
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
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-neutral-100 transition-colors text-primary"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        {/* Results Dropdown Container */}
        {(query.trim() !== "" || results.length > 0) && (
          <div className="absolute top-[100%] left-0 w-full bg-white shadow-2xl border-t border-outline-variant max-h-[70vh] overflow-y-auto no-scrollbar">
            
            {query.trim() && !loading && results.length === 0 && (
              <div className="text-center py-8 text-secondary font-body-md">
                No products found matching "{query}"
              </div>
            )}

            {results.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6">
                {results.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => {
                      if (onProductSelect) {
                        onProductSelect(product);
                      } else {
                        onClose();
                      }
                    }}
                    className="group flex flex-col items-center text-center cursor-pointer appearance-none bg-transparent border-none p-0 focus:outline-none"
                  >
                    <div className="w-full aspect-[3/4] bg-surface-container overflow-hidden mb-3 relative">
                      {isVideo(product.thumbnail) ? (
                        <video
                          src={product.thumbnail}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          autoPlay loop muted playsInline
                        />
                      ) : (
                        <img
                          src={product.thumbnail || '/placeholder.png'}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      )}
                    </div>
                    <h3 className="font-body-md text-xs text-primary uppercase tracking-wider mb-1 line-clamp-1">{product.name}</h3>
                    <p className="font-bold text-primary text-sm">${product.price}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
