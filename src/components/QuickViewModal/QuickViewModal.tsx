import { useState, useMemo } from 'react';
import { useCart } from '../../context/CartContext';
import { type Product } from '../../data/products';

export interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

const isVideo = (url: string | undefined) => url && typeof url === 'string' && url.match(/\.(mp4|webm|ogg|mov)$/i);

export function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const { addToCart, setIsCartOpen } = useCart();

  const [selectedColor, setSelectedColor] = useState<string | undefined>(product?.detailedColors && product.detailedColors.length > 0 ? product.detailedColors[0].name : undefined);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(product?.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined);

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
    ? `₹${Number(currentVariant.price).toFixed(2)}` 
    : product?.price;

  const isOutOfStock = currentVariant && currentVariant.stock !== undefined && currentVariant.stock !== null && currentVariant.stock !== '' && Number(currentVariant.stock) <= 0;

  // 3. Quantity State
  const [quantity, setQuantity] = useState<number>(1);

  if (!product) return null;

  const handleDecreaseQty = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncreaseQty = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-surface w-full max-w-5xl flex flex-col md:flex-row relative max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-surface hover:bg-surface-container transition-colors z-10 border border-outline-variant"
        >
          <span className="material-symbols-outlined text-primary">close</span>
        </button>

        {/* Left Image Section */}
        <div className="w-full md:w-1/2 relative bg-surface-container aspect-[3/4] md:aspect-auto">
          <div className="absolute top-4 left-4 bg-surface text-primary px-3 py-1 text-xs font-bold font-label-caps border border-outline-variant z-10">
            NEW IN
          </div>
          {isVideo(product.imageSrc) ? (
            <video
              src={product.imageSrc}
              className="w-full h-full object-cover object-top"
              autoPlay loop muted playsInline
            />
          ) : (
            <img
              src={product.imageSrc}
              alt={product.imageAlt || product.name}
              className="w-full h-full object-cover object-top"
            />
          )}
        </div>

        {/* Right Details Section */}
        <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col overflow-y-auto text-left">
          <h2 className="font-headline-md text-3xl md:text-4xl text-primary pr-12">
            {product.name}
          </h2>
          <p className="font-body-md font-semibold text-xl text-primary mt-3">
            {displayPrice}
          </p>

          <div className="bg-surface-container/50 px-4 py-3 mt-6 flex items-center gap-2 text-sm text-secondary font-body-md border border-outline-variant/50">
            <span className="material-symbols-outlined text-[18px]">visibility</span>
            34 people are viewing this right now
          </div>

          {/* Color Selection */}
          {product.detailedColors && product.detailedColors.length > 0 && (
            <div className="mt-8">
              <p className="font-label-caps text-xs tracking-widest text-primary mb-3 font-bold">
                COLOR : <span className="font-bold">{selectedColor}</span>
              </p>
              <div className="flex gap-3">
                {product.detailedColors.map((color) => {
                  const isOutOfStock = color.inStock === false;
                  return (
                    <button
                      key={color.name}
                      disabled={isOutOfStock}
                      title={isOutOfStock ? 'Out of Stock' : color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`relative w-8 h-8 rounded-full border p-0.5 flex items-center justify-center transition-all ${
                        isOutOfStock ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:border-secondary'
                      } ${
                        selectedColor === color.name && !isOutOfStock ? 'border-primary border-2' : 'border-outline-variant'
                      }`}
                    >
                      <span className={`block w-full h-full rounded-full ${color.class}`} style={color.bgStyle}></span>
                      {isOutOfStock && (
                        <div className="absolute inset-0 m-auto w-[120%] h-[1.5px] bg-red-500 -rotate-45 transform origin-center" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Size Selection */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mt-8">
              <div className="flex justify-between items-center mb-3">
                <p className="font-label-caps text-xs tracking-widest text-primary font-bold">
                  SIZE : <span className="font-bold">{selectedSize}</span>
                </p>
                <a href="#" className="font-body-md text-sm text-secondary flex items-center gap-1 hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-[16px]">straighten</span>
                  Size Guide
                </a>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`border py-3 font-label-caps text-xs transition-colors ${
                      selectedSize === sz
                        ? 'border-primary bg-primary text-on-primary font-bold'
                        : 'border-outline-variant text-primary hover:border-primary'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-8 flex flex-col md:flex-row gap-4">
            <div className="flex items-center border border-outline-variant h-14 md:w-32 shrink-0">
              <button 
                onClick={handleDecreaseQty}
                className="flex-1 flex items-center justify-center text-primary hover:bg-surface-container transition-colors h-full"
              >
                <span className="material-symbols-outlined text-[18px]">remove</span>
              </button>
              <span className="font-body-md text-sm font-semibold w-8 text-center">{quantity}</span>
              <button 
                onClick={handleIncreaseQty}
                className="flex-1 flex items-center justify-center text-primary hover:bg-surface-container transition-colors h-full"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="flex-1 bg-primary text-on-primary font-label-caps text-xs tracking-widest h-14 hover:bg-on-primary hover:text-primary border border-primary transition-colors font-bold disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isOutOfStock ? "OUT OF STOCK" : "ADD TO CART"}
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full mt-4 bg-transparent text-primary border-2 border-primary font-label-caps text-sm tracking-widest py-4 hover:bg-primary hover:text-on-primary transition-colors font-bold"
          >
            BUY NOW
          </button>

          {/* Footer Links */}
          <div className="mt-8 pt-6 border-t border-outline-variant flex flex-col gap-4 font-body-md text-sm text-secondary">
            <div className="flex gap-6">
              <a href="#" className="flex items-center gap-2 hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[18px]">mail</span> Ask a Question
              </a>
              <a href="#" className="flex items-center gap-2 hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[18px]">share</span> Share
              </a>
            </div>
            <p className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">local_shipping</span> Estimated Delivery: Oct 24 - Oct 28
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
