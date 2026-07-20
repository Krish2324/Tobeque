import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useCurrency } from '../../context/CurrencyContext';
import { Navbar } from '../../components/Navbar/Navbar';

const isVideo = (url: string | undefined) => url && /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url);

export function CartPage() {
  const navigate = useNavigate();
  const { currencySymbol } = useCurrency();
  const {
    cart,
    removeFromCart,
    updateCartItemQty,
    updateCartItemSize,
    appliedCoupon,
    clearCart,
  } = useCart();
  const { isAuthenticated, openLoginModal } = useAuth();

  /* ── Totals ── */
  const subtotal = cart.reduce((sum, item) => {
    const p = parseFloat(String(item.price).replace(/[^0-9.-]+/g, '')) || 0;
    return sum + p * item.quantity;
  }, 0);

  let discount = 0;
  if (appliedCoupon) {
    discount = appliedCoupon.type === 'percentage'
      ? (subtotal * Number(appliedCoupon.discountValue)) / 100
      : Number(appliedCoupon.discountValue);
    if (discount > subtotal) discount = subtotal;
  }
  const total = subtotal - discount;

  const handleCheckout = () => {
    if (!isAuthenticated) {
      openLoginModal(() => navigate('/checkout'));
    } else {
      navigate('/checkout');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 pt-24 pb-14">

        {/* Page heading */}
        <div className="mb-8 border-b border-gray-100 pb-5">
          <h1 className="text-[11px] tracking-[0.3em] uppercase text-gray-400 font-medium mb-1">Your</h1>
          <p className="text-2xl font-serif text-gray-900 tracking-wide">Shopping Bag</p>
        </div>

        {cart.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-24 gap-5 text-center">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.2">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            <p className="text-sm text-gray-400 font-light">Your bag is empty</p>
            <Link
              to="/collection"
              className="text-[10px] tracking-[0.22em] uppercase font-semibold text-gray-900 border-b border-gray-900 pb-0.5 hover:text-gray-500 hover:border-gray-500 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">

            {/* ── Left: Item list ── */}
            <div className="flex-1 w-full flex flex-col divide-y divide-gray-100">
              {cart.map((item) => {
                const price = parseFloat(String(item.price).replace(/[^0-9.-]+/g, '')) || 0;
                const lineTotal = price * item.quantity;
                return (
                  <div key={item.cartId} className="py-6 flex gap-4 sm:gap-6">
                    {/* Image */}
                    <div className="w-20 h-28 sm:w-24 sm:h-32 shrink-0 bg-gray-50 overflow-hidden">
                      {isVideo(item.imageSrc) ? (
                        <video src={item.imageSrc} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                      ) : (
                        <img src={item.imageSrc} alt={item.name} className="w-full h-full object-cover" />
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        {/* Name + remove */}
                        <div className="flex items-start justify-between gap-3">
                          <Link
                            to={`/product/${item.id}`}
                            className="text-[12px] font-medium text-gray-900 uppercase tracking-wide leading-snug hover:text-gray-500 transition-colors line-clamp-2"
                          >
                            {item.name}
                          </Link>
                          <button
                            onClick={() => removeFromCart(item.cartId)}
                            className="text-gray-300 hover:text-gray-700 transition-colors shrink-0 mt-0.5"
                            aria-label="Remove item"
                          >
                            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                              <path d="M1 1L12 12M12 1L1 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                            </svg>
                          </button>
                        </div>

                        {/* Color */}
                        {item.selectedColor && item.selectedColor !== 'DEFAULT' && (
                          <p className="text-[10px] text-gray-400 font-light mt-1 tracking-wide uppercase">{item.selectedColor}</p>
                        )}
                      </div>

                      {/* Size + Qty + Price */}
                      <div className="flex items-end justify-between mt-3 gap-4 flex-wrap">
                        <div className="flex items-center gap-3">
                          {/* Size selector */}
                          <div className="relative">
                            <select
                              value={item.selectedSize || 'S'}
                              onChange={(e) => updateCartItemSize(item.cartId, e.target.value)}
                              className="appearance-none bg-gray-50 border border-gray-200 text-[10px] font-medium tracking-widest uppercase px-2.5 py-1.5 pr-6 focus:outline-none focus:border-gray-700 cursor-pointer text-gray-700"
                            >
                              {['XS', 'S', 'M', 'L', 'XL'].map(s => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                            <svg className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
                          </div>

                          {/* Qty stepper */}
                          <div className="flex items-center border border-gray-200 text-gray-700">
                            <button
                              onClick={() => updateCartItemQty(item.cartId, Math.max(1, item.quantity - 1))}
                              className="w-7 h-7 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-500 hover:text-gray-900"
                            >
                              <span style={{ fontSize: 12, lineHeight: 1 }}>&#8722;</span>
                            </button>
                            <span className="w-7 text-center text-[11px] font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateCartItemQty(item.cartId, item.quantity + 1)}
                              className="w-7 h-7 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-500 hover:text-gray-900"
                            >
                              <span style={{ fontSize: 12, lineHeight: 1 }}>&#43;</span>
                            </button>
                          </div>
                        </div>

                        {/* Line total */}
                        <p className="text-[13px] font-semibold text-gray-900">
                          {currencySymbol}{lineTotal.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Clear bag link */}
              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => clearCart()}
                  className="text-[10px] tracking-[0.18em] uppercase text-gray-400 hover:text-red-400 transition-colors font-medium"
                >
                  Clear Bag
                </button>
              </div>
            </div>

            {/* ── Right: Order summary ── */}
            <div className="w-full lg:w-72 shrink-0 sticky top-6">
              <div className="border border-gray-100 p-6 flex flex-col gap-5">
                <p className="text-[9px] tracking-[0.3em] uppercase text-gray-400 font-semibold">Order Summary</p>

                <div className="flex flex-col gap-3 text-[12px]">
                  <div className="flex justify-between text-gray-600 font-light">
                    <span>Subtotal</span>
                    <span className="font-medium text-gray-900">{currencySymbol}{subtotal.toFixed(2)}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({appliedCoupon.code})</span>
                      <span>−{currencySymbol}{discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-500 font-light text-[11px]">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="border-t border-gray-100 pt-3 flex justify-between font-semibold text-gray-900 text-[13px]">
                    <span>Total</span>
                    <span>{currencySymbol}{total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Checkout CTA */}
                <button
                  onClick={handleCheckout}
                  className="w-full h-11 bg-gray-900 text-white text-[10.5px] tracking-[0.22em] uppercase font-semibold hover:bg-black transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Proceed to Checkout</span>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M13 6l6 6-6 6"/>
                  </svg>
                </button>

                <Link
                  to="/collection"
                  className="text-center text-[10px] tracking-[0.15em] uppercase text-gray-400 hover:text-gray-700 transition-colors font-medium"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}
