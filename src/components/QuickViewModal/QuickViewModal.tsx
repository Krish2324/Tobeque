import { useState, useMemo, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { type Product } from '../../data/products';
import { useCurrency } from '../../context/CurrencyContext';
import { ShareModal } from '../ShareModal/ShareModal';
import api from '../../services/api';

export interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

const isVideo = (url: string | undefined) => url && typeof url === 'string' && url.match(/\.(mp4|webm|ogg|mov)$/i);

export function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const { addToCart, setIsCartOpen } = useCart();
  const { currencySymbol } = useCurrency();

  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState<number>(1);

  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isAskQuestionOpen, setIsAskQuestionOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const [askName, setAskName] = useState('');
  const [askEmail, setAskEmail] = useState('');
  const [askMessage, setAskMessage] = useState('');
  const [askSubmitted, setAskSubmitted] = useState(false);
  const [isSubmittingAsk, setIsSubmittingAsk] = useState(false);
  const [askError, setAskError] = useState('');

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


  useEffect(() => {
    if (product) {
      const primaryImgColor = product.galleryImageObjects?.find(img => img.color)?.color;
      let initialColor = product.detailedColors && product.detailedColors.length > 0 ? product.detailedColors[0].name : undefined;
      
      if (primaryImgColor && product.detailedColors) {
        const matched = product.detailedColors.find(c => c.name.toLowerCase().trim() === primaryImgColor.toLowerCase().trim());
        if (matched) initialColor = matched.name;
      }

      setSelectedColor(initialColor);
      setSelectedSize(product.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined);
      setQuantity(1);
    }
  }, [product]);

  const currentVariant = useMemo(() => {
    if (!product?.rawVariants) return null;
    return product.rawVariants.find(v => {
      const vColorKey = Object.keys(v).find(k => k.toLowerCase() === 'color');
      const vSizeKey = Object.keys(v).find(k => k.toLowerCase() === 'size');
      
      const matchesColor = !vColorKey || !selectedColor || 
        String(v[vColorKey]).trim().toLowerCase() === selectedColor.toLowerCase();
        
      const matchesSize = !vSizeKey || !selectedSize || 
        String(v[vSizeKey]).trim().toLowerCase() === selectedSize.toLowerCase();
        
      return matchesColor && matchesSize;
    });
  }, [product, selectedColor, selectedSize]);

  const displayPrice = currentVariant && currentVariant.price !== undefined && currentVariant.price !== null && currentVariant.price !== ''
    ? `${currencySymbol}${Number(currentVariant.price).toFixed(2)}` 
    : product?.price;

  const isOutOfStock = currentVariant && currentVariant.stock !== undefined && currentVariant.stock !== null && currentVariant.stock !== '' && Number(currentVariant.stock) <= 0;

  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  const displayedImages = useMemo(() => {
    if (!product) return [];
    
    const primaryImg = product.imageSrc;
    const hoverImg = product.hoverImageSrc;
    
    const targetColor = (selectedColor || product.detailedColors?.[0]?.name || product.colors?.[0] || '').toLowerCase().trim();

    const isColorMatch = (c1: string, c2: string) => {
      if (!c1 || !c2) return false;
      const clean1 = c1.toLowerCase().trim();
      const clean2 = c2.toLowerCase().trim();
      if (clean1 === clean2) return true;
      const words1 = clean1.split(/[\s\-_]+/);
      const words2 = clean2.split(/[\s\-_]+/);
      return words1.some(w => w.length > 2 && words2.includes(w)) || words2.some(w => w.length > 2 && words1.includes(w));
    };

    if (product.galleryImageObjects && product.galleryImageObjects.length > 0) {
      // 1. Strict/fuzzy color matches
      const colorMatches = product.galleryImageObjects
        .filter(imgObj => imgObj.url && imgObj.color && isColorMatch(imgObj.color, targetColor))
        .map(imgObj => imgObj.url);

      if (colorMatches.length > 0) {
        return Array.from(new Set(colorMatches));
      }

      // 2. Filter out images tagged for OTHER colors of this product
      const otherColors = (product.detailedColors || []).map(c => c.name.toLowerCase().trim()).filter(c => c !== targetColor && c !== 'default');

      const filteredUntagged = product.galleryImageObjects
        .filter(imgObj => {
          if (!imgObj.url) return false;
          if (!imgObj.color) return true; // untagged allowed
          const imgColor = imgObj.color.toLowerCase().trim();
          return !otherColors.some(otherC => isColorMatch(imgColor, otherC));
        })
        .map(imgObj => imgObj.url);

      if (filteredUntagged.length > 0) {
        return Array.from(new Set(filteredUntagged));
      }
    }

    if (product.galleryImages && product.galleryImages.length > 0) {
      return product.galleryImages.filter(Boolean);
    }

    return hoverImg && hoverImg !== primaryImg 
      ? [primaryImg, hoverImg].filter(Boolean) 
      : [primaryImg].filter(Boolean);
  }, [product, selectedColor]);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [selectedColor, product]);

  const currentImage = displayedImages[activeImageIndex] || product?.imageSrc || '';

  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    setImageLoaded(false);
  }, [currentImage]);

  if (!product) return null;

  const handleDecreaseQty = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncreaseQty = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setQuantity(quantity + 1);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    addToCart({ 
      ...product, 
      quantity, 
      selectedSize, 
      selectedColor 
    });
    onClose(); 
    setIsCartOpen(true); 
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-surface w-full max-w-5xl flex flex-col md:flex-row relative max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Close Button */}
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onClose(); }}
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-surface hover:bg-surface-container transition-colors z-30 border border-outline-variant shadow-sm"
        >
          <span className="material-symbols-outlined text-primary">close</span>
        </button>

        {/* Left Image Section with Image Slider */}
        <div className="w-full md:w-1/2 relative bg-surface-container aspect-[3/4] overflow-hidden group">
          <div className="absolute top-4 left-4 bg-surface text-primary px-3 py-1 text-xs font-bold font-label-caps border border-outline-variant z-20 shadow-sm">
            NEW IN
          </div>

          {/* Image Counter Pill */}
          {displayedImages.length > 1 && (
            <div className="absolute top-4 right-4 bg-black/60 text-white text-[10px] font-bold px-2.5 py-1 rounded-full z-20 backdrop-blur-sm tracking-wider">
              {activeImageIndex + 1} / {displayedImages.length}
            </div>
          )}

          {/* Navigation Arrows */}
          {displayedImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault(); e.stopPropagation();
                  setActiveImageIndex(prev => (prev === 0 ? displayedImages.length - 1 : prev - 1));
                }}
                aria-label="Previous Image"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-primary flex items-center justify-center shadow-lg z-30 transition-all opacity-90 group-hover:opacity-100 hover:scale-110 active:scale-95 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">chevron_left</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault(); e.stopPropagation();
                  setActiveImageIndex(prev => (prev === displayedImages.length - 1 ? 0 : prev + 1));
                }}
                aria-label="Next Image"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-primary flex items-center justify-center shadow-lg z-30 transition-all opacity-90 group-hover:opacity-100 hover:scale-110 active:scale-95 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">chevron_right</span>
              </button>
            </>
          )}

          {!imageLoaded && (
            <div className="absolute inset-0 bg-surface-container animate-pulse z-10" />
          )}

          {isVideo(currentImage) ? (
            <video
              ref={(el) => {
                if (el) {
                  el.defaultMuted = true;
                  el.muted = true;
                }
              }}
              src={currentImage}
              className={`w-full h-full object-cover object-top transition-opacity duration-500 relative z-10 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              autoPlay
              loop
              muted
              playsInline
              onLoadedData={() => setImageLoaded(true)}
            />
          ) : (
            <img
              src={currentImage}
              alt={product.imageAltTag || product.imageAlt || product.name}
              className={`w-full h-full object-cover object-top transition-opacity duration-500 relative z-10 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImageLoaded(true)}
            />
          )}

          {/* Bottom Thumbnail Strip */}
          {displayedImages.length > 1 && (
            <div className="absolute bottom-3 left-0 right-0 z-30 flex items-center justify-center gap-2 px-4">
              <div className="flex items-center gap-1.5 p-1.5 bg-black/40 backdrop-blur-md rounded-xl max-w-full overflow-x-auto">
                {displayedImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault(); e.stopPropagation();
                      setActiveImageIndex(idx);
                    }}
                    className={`relative w-8 h-11 rounded-lg overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                      activeImageIndex === idx ? 'border-white scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    {isVideo(img) ? (
                      <video
                        ref={(el) => {
                          if (el) {
                            el.defaultMuted = true;
                            el.muted = true;
                          }
                        }}
                        src={img}
                        className="w-full h-full object-cover"
                        autoPlay
                        loop
                        muted
                        playsInline
                      />
                    ) : (
                      <img src={img} alt={product.imageAltTag || product.imageAlt || product.name} className="w-full h-full object-cover" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Details Section */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col overflow-y-auto text-left">
          <h2 className="font-headline-md text-2xl md:text-3xl text-primary pr-10">
            {product.name}
          </h2>
          <p className="font-body-md font-semibold text-lg text-primary mt-2">
            {displayPrice}
          </p>

          <div className="bg-surface-container/50 px-3 py-2 mt-4 flex items-center gap-2 text-xs text-secondary font-body-md border border-outline-variant/50">
            <span className="material-symbols-outlined text-[16px]">visibility</span>
            34 people are viewing this right now
          </div>

          {/* Color Selection */}
          {product.detailedColors && product.detailedColors.length > 0 && (
            <div className="mt-5">
              <p className="font-label-caps text-xs tracking-widest text-primary mb-2 font-bold">
                COLOR : <span className="font-bold">{selectedColor}</span>
              </p>
              <div className="flex gap-3">
                {product.detailedColors.map((color) => {
                  const isOutOfStock = color.inStock === false;
                  return (
                    <button
                      key={color.name}
                      type="button"
                      disabled={isOutOfStock}
                      title={isOutOfStock ? 'Out of Stock' : color.name}
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSelectedColor(color.name); }}
                      className={`relative w-8 h-8 rounded-full border p-0.5 flex items-center justify-center transition-all overflow-hidden ${
                        isOutOfStock ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:border-secondary'
                      } ${
                        selectedColor === color.name && !isOutOfStock ? 'border-primary border-2' : 'border-outline-variant'
                      }`}
                    >
                      {color.image ? (
                        <img src={color.image} alt={color.name} className="w-full h-full object-cover rounded-full" />
                      ) : (
                        <span className={`block w-full h-full rounded-full ${color.class}`} style={color.bgStyle}></span>
                      )}
                      {isOutOfStock && (
                        <div className="absolute inset-0 m-auto w-[120%] h-[1.5px] bg-red-500 -rotate-45 transform origin-center z-10" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Size Selection & Size Guide */}
          {(() => {
            const hasSizes = product.sizes && product.sizes.length > 0;
            const hasSizeGuide = product.sizeChart ? product.sizeChart.disabled !== true : false;
            
            if (!hasSizes && !hasSizeGuide) return null;

            return (
              <div className="mt-5">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-label-caps text-xs tracking-widest text-primary font-bold">
                    {hasSizes ? (
                      <>SIZE : <span className="font-bold">{selectedSize}</span></>
                    ) : (
                      <span>SIZE GUIDE</span>
                    )}
                  </p>
                  {hasSizeGuide && (
                    <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsSizeGuideOpen(true); }} className="font-body-md text-sm text-secondary flex items-center gap-1 hover:text-primary transition-colors cursor-pointer">
                      <span className="material-symbols-outlined text-[16px]">straighten</span>
                      Size Guide
                    </button>
                  )}
                </div>
                {hasSizes && (
                  <div className="grid grid-cols-5 gap-2">
                    {product.sizes?.map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSelectedSize(sz); }}
                        className={`border py-2 font-label-caps text-xs transition-colors ${
                          selectedSize === sz
                            ? 'border-primary bg-primary text-on-primary font-bold'
                            : 'border-outline-variant text-primary hover:border-primary'
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

          {/* Actions */}
          <div className="mt-6 flex flex-col md:flex-row gap-3">
            <div className="flex items-center border border-outline-variant h-12 md:w-28 shrink-0">
              <button 
                onClick={handleDecreaseQty}
                className="flex-1 flex items-center justify-center text-primary hover:bg-surface-container transition-colors h-full"
              >
                <span className="material-symbols-outlined text-[16px]">remove</span>
              </button>
              <span className="font-body-md text-sm font-semibold w-8 text-center">{quantity}</span>
              <button 
                onClick={handleIncreaseQty}
                className="flex-1 flex items-center justify-center text-primary hover:bg-surface-container transition-colors h-full"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
              </button>
            </div>
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="flex-1 bg-primary text-on-primary font-label-caps text-xs tracking-widest h-12 hover:bg-on-primary hover:text-primary border border-primary transition-colors font-bold disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isOutOfStock ? "OUT OF STOCK" : "ADD TO CART"}
            </button>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className="w-full mt-3 bg-transparent text-primary border-2 border-primary font-label-caps text-xs tracking-widest py-3 hover:bg-primary hover:text-on-primary transition-colors font-bold"
          >
            BUY NOW
          </button>

          {/* Footer Links */}
          <div className="mt-5 pt-4 border-t border-outline-variant flex flex-col gap-3 font-body-md text-xs text-secondary">
            <div className="flex gap-6">
              <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setAskSubmitted(false); setIsAskQuestionOpen(true); }} className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-[16px]">mail</span> Ask a Question
              </button>
              <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsShareModalOpen(true); }} className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-[16px]">share</span> Share
              </button>
            </div>
            <p className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">local_shipping</span> Estimated Delivery: Oct 24 - Oct 28
            </p>
          </div>
        </div>
      </div>

      {/* ─── Size Guide Modal ─── */}
      {isSizeGuideOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 overflow-y-auto p-4" onClick={(e) => { e.stopPropagation(); setIsSizeGuideOpen(false); }}>
          <div className="bg-white max-w-lg w-full p-6 md:p-8 relative shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <button
              type="button"
              className="absolute top-4 right-4 w-8 h-8 rounded-full border border-outline-variant flex items-center justify-center text-primary hover:bg-neutral-50 transition-colors"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsSizeGuideOpen(false); }}
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
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50" onClick={(e) => { e.stopPropagation(); setIsAskQuestionOpen(false); }}>
          <div className="bg-white max-w-md w-full mx-4 p-8 relative" onClick={e => e.stopPropagation()}>
            <button
              type="button"
              className="absolute top-4 right-4 w-8 h-8 rounded-full border border-outline-variant flex items-center justify-center text-primary hover:bg-neutral-50 transition-colors"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsAskQuestionOpen(false); }}
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
                  type="button"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAskQuestionSubmit(); }}
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

      {product && (
        <ShareModal 
          isOpen={isShareModalOpen} 
          onClose={() => setIsShareModalOpen(false)} 
          productName={product.name}
          url={`${window.location.origin}/product-category/${product.categorySlug || 'all'}/${product.slug || product.id}`}
        />
      )}

    </div>
  );
}
