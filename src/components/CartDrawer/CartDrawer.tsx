import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { productsData, type Product } from '../../data/products';

export function CartDrawer() {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cart, 
    removeFromCart,
    wishlistItems,
    removeFromWishlist,
    addToCart,
    updateCartItemSize,
    updateCartItemQty,
    setIsCheckoutOpen
  } = useCart();
  
  const [activeCartTab, setActiveCartTab] = useState<'cart' | 'wishlist'>('cart');

  // Hardcode cross sell products for now, simulating real data
  const crossSellProducts = [
    productsData.find(p => p.id === "cream-silk-slip-dress"),
    productsData.find(p => p.id === "classic-poplin-shirt"),
    productsData.find(p => p.id === "fine-knit-linen-tee")
  ].filter(Boolean) as Product[];

  const cartTotal = cart.reduce((total, item) => {
    const priceStr = item.price.replace(/[^0-9.-]+/g, "");
    const price = parseFloat(priceStr) || 0;
    return total + (price * item.quantity);
  }, 0);

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[105] transition-opacity duration-300 ${isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div className={`fixed inset-y-0 right-0 w-full sm:w-[450px] bg-surface shadow-2xl z-[110] flex flex-col transform transition-transform duration-300 ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Header */}
        <div className="flex justify-between items-center p-6 pb-4">
          <h2 className="font-headline-md text-2xl tracking-widest">YOUR CART</h2>
          <button onClick={() => setIsCartOpen(false)} className="w-8 h-8 flex items-center justify-center border border-outline-variant border-dashed text-primary hover:border-primary transition-colors">
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex font-label-caps text-xs tracking-widest font-bold">
          <button
            onClick={() => setActiveCartTab('cart')}
            className={`flex-1 py-4 bg-surface text-primary ${activeCartTab === 'cart' ? 'border-b-2 border-primary' : 'border-b border-outline-variant text-secondary'}`}
          >
            YOUR CART
          </button>
          <button
            onClick={() => setActiveCartTab('wishlist')}
            className={`flex-1 py-4 transition-colors ${activeCartTab === 'wishlist' ? 'bg-surface border-b-2 border-primary text-primary' : 'bg-surface-container/30 text-secondary border-b border-outline-variant hover:text-primary'}`}
          >
            WISHLIST
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {activeCartTab === 'cart' ? (
            <>
              {cart.length === 0 ? (
                <div className="text-center text-secondary py-12">Your cart is empty.</div>
              ) : (
                cart.map(item => (
                  <div key={item.cartId} className="p-6 flex gap-4 border-b border-outline-variant/30 relative group">
                    <button onClick={() => removeFromCart(item.cartId)} className="absolute top-6 right-6 text-secondary hover:text-primary transition-opacity">
                      <span className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                    <img src={item.imageSrc} alt={item.name} className="w-24 h-32 object-cover bg-surface-container" />
                    <div className="flex-1 flex flex-col justify-between pr-4">
                      <div>
                        <h3 className="font-body-md text-[13px] font-bold text-primary leading-tight uppercase">{item.name}</h3>
                        <p className="font-price-lg text-lg mt-1 font-semibold">{item.price}</p>
                        <div className="mt-2 bg-surface-container/30 py-2 px-3 text-[11px] font-label-caps text-secondary flex items-center border border-outline-variant/20">
                          COLOR <br /> {item.selectedColor || 'Default'}
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3 font-body-md text-sm pt-2">
                        {/* Interactive Size Selector */}
                        <div className="flex-1 relative">
                          <select
                            value={item.selectedSize || 'S'}
                            onChange={(e) => updateCartItemSize(item.cartId, e.target.value)}
                            className="w-full bg-white border border-outline-variant text-[11px] font-label-caps tracking-wider py-1.5 pl-3 pr-8 rounded-none appearance-none focus:outline-none focus:border-primary cursor-pointer"
                          >
                            {['XS', 'S', 'M', 'L', 'XL'].map(size => (
                              <option key={size} value={size}>{size}</option>
                            ))}
                          </select>
                          <span className="material-symbols-outlined text-[14px] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-secondary">expand_more</span>
                        </div>

                        {/* Interactive Qty Selector */}
                        <div className="flex-1 relative">
                          <select
                            value={item.quantity}
                            onChange={(e) => updateCartItemQty(item.cartId, parseInt(e.target.value))}
                            className="w-full bg-white border border-outline-variant text-[11px] font-label-caps tracking-wider py-1.5 pl-3 pr-8 rounded-none appearance-none focus:outline-none focus:border-primary cursor-pointer"
                          >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(qty => (
                              <option key={qty} value={qty}>Qty {qty}</option>
                            ))}
                          </select>
                          <span className="material-symbols-outlined text-[14px] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-secondary">expand_more</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}

              {/* Shipping Banner */}
              <div className="mx-6 py-4 flex flex-col gap-3 border-b border-outline-variant/30">
                <div className="flex justify-between items-center font-body-md text-sm text-primary">
                  Want free shipping ? You are almost there.
                  <span className="material-symbols-outlined text-[18px]">expand_more</span>
                </div>
                <div className="w-full bg-outline-variant/30 h-1">
                  <div className="bg-primary h-full w-[75%]"></div>
                </div>
              </div>

              {/* Cross Sell */}
              <div className="p-6 relative">
                <h3 className="font-label-caps text-[10px] tracking-widest text-secondary mb-4 uppercase">You might also like</h3>
                <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar relative">
                  {/* Left scroll button overlay */}
                  <button className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-surface shadow-md flex items-center justify-center z-10 text-primary hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-[14px]">chevron_left</span>
                  </button>
                  {/* Right scroll button overlay */}
                  <button className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-surface shadow-md flex items-center justify-center z-10 text-primary hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                  </button>
                  {crossSellProducts.map((p, idx) => (
                    <div key={idx} className="w-[120px] shrink-0 flex flex-col gap-2 group cursor-pointer">
                      <img src={p.imageSrc} alt={p.name} className="w-[120px] h-40 object-cover bg-surface-container group-hover:opacity-90 transition-opacity" />
                      <h4 className="font-label-caps text-[9px] uppercase truncate tracking-widest text-primary font-bold mt-1">{p.name}</h4>
                      <p className="font-body-md text-[11px] text-secondary">{p.price}</p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart({ ...p, quantity: 1, selectedSize: 'S', selectedColor: 'Default' });
                        }}
                        className="font-label-caps text-[10px] font-bold border-b border-primary w-max pb-0.5 mt-1 hover:text-secondary hover:border-secondary transition-colors"
                      >
                        ADD TO BAG
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="p-6">
              {wishlistItems.length === 0 ? (
                <div className="text-center text-secondary py-12">Your wishlist is empty.</div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {wishlistItems.map((p, idx) => (
                    <div key={idx} className="flex flex-col gap-2">
                      <div className="aspect-[2/3] relative bg-surface-container">
                        <img src={p.imageSrc} alt={p.name} className="w-full h-full object-cover" />
                        <button
                          onClick={() => removeFromWishlist(p.name)}
                          className="absolute top-2 right-2 w-6 h-6 bg-surface/90 rounded-full flex items-center justify-center text-primary"
                        >
                          <span className="material-symbols-outlined text-[14px]">close</span>
                        </button>
                      </div>
                      <h4 className="font-label-caps text-[9px] uppercase truncate tracking-widest text-primary">{p.name}</h4>
                      <p className="font-body-md text-[11px]">{p.price}</p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart({ ...p, quantity: 1, selectedSize: 'S', selectedColor: 'Default' });
                          removeFromWishlist(p.name);
                        }}
                        className="font-label-caps text-[10px] font-bold border-b border-primary w-max pb-0.5 mt-1 hover:text-secondary hover:border-secondary transition-colors"
                      >
                        ADD TO BAG
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {activeCartTab === 'cart' && (
          <div className="p-6 bg-surface mt-auto border-t-2 border-surface-container">
            <div className="flex justify-between items-center mb-6">
              <span className="font-label-caps tracking-widest text-secondary text-xs">TOTAL:</span>
              <span className="font-price-lg text-2xl font-bold">${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex gap-4">
              <button className="flex-1 py-4 border border-primary text-primary font-label-caps tracking-widest text-xs hover:bg-surface-container transition-colors font-bold">
                VIEW BAG
              </button>
              <button 
                onClick={() => {
                  setIsCartOpen(false);
                  setIsCheckoutOpen(true);
                }}
                className="flex-1 py-4 bg-primary text-on-primary font-label-caps tracking-widest text-xs hover:bg-on-primary hover:text-primary border border-primary transition-colors font-bold"
              >
                CHECKOUT
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
