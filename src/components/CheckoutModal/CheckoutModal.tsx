import { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { createOrder } from '../../services/userAuthService';

export function CheckoutModal() {
  const { 
    isCheckoutOpen, 
    setIsCheckoutOpen, 
    cart, 
    clearCart,
    appliedCoupon
  } = useCart();
  const { isAuthenticated, openLoginModal, user, token } = useAuth();

  const [checkoutName, setCheckoutName] = useState(user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : (user?.phone || ''));
  const [checkoutEmail, setCheckoutEmail] = useState(user?.email || '');
  const [checkoutPhone, setCheckoutPhone] = useState(user?.phone || '');
  const [checkoutAddress, setCheckoutAddress] = useState(user?.address || '');
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Pre-fill from auth user
  const displayName = user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : (user?.phone || '');
  const displayPhone = user?.phone || '';

  // Auth gate via useEffect — avoids calling setState during render
  useEffect(() => {
    if (isCheckoutOpen && !isAuthenticated) {
      setIsCheckoutOpen(false);
      openLoginModal(() => setIsCheckoutOpen(true));
    }
  }, [isCheckoutOpen, isAuthenticated]);

  if (!isCheckoutOpen || !isAuthenticated) return null;

  // Calculate cart total
  const cartSubtotal = cart.reduce((total, item) => {
    const priceStr = item.price.replace(/[^0-9.-]+/g, "");
    const numericPrice = parseFloat(priceStr) || 0;
    return total + numericPrice * item.quantity;
  }, 0);

  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percentage') {
      discountAmount = (cartSubtotal * parseFloat(appliedCoupon.discountValue as any)) / 100;
    } else {
      discountAmount = parseFloat(appliedCoupon.discountValue as any);
    }
    if (discountAmount > cartSubtotal) discountAmount = cartSubtotal;
  }
  const cartTotal = cartSubtotal - discountAmount;

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutName || !checkoutAddress) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }
    
    if (!token) return;

    setIsSubmittingOrder(true);
    setErrorMessage('');
    
    try {
      const items = cart.map(item => {
        const priceStr = item.price.replace(/[^0-9.-]+/g, "");
        return {
          productId: parseInt(item.id, 10),
          price: parseFloat(priceStr) || 0,
          quantity: item.quantity,
          variantDetails: { size: item.selectedSize, color: item.selectedColor }
        };
      });

      await createOrder(token, {
        customerName: checkoutName,
        customerPhone: checkoutPhone,
        shippingAddress: checkoutAddress,
        items,
        couponCode: appliedCoupon?.code
      });

      setIsSubmittingOrder(false);
      setCheckoutSuccess(true);
      
      setTimeout(() => {
        // Clear global cart, close modal, and reset state
        clearCart();
        setIsCheckoutOpen(false);
        setCheckoutSuccess(false);
      }, 3000);
      
    } catch (error: any) {
      setIsSubmittingOrder(false);
      setErrorMessage(error.message || 'An error occurred while placing the order.');
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity duration-300">
      <div className="bg-white w-full max-w-lg shadow-2xl relative flex flex-col max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">

        {/* Success Overlay Banner */}
        {checkoutSuccess && (
          <div className="absolute inset-0 bg-white z-50 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6 text-green-500 shadow-sm border border-green-100">
              <span className="material-symbols-outlined text-[48px] font-bold">check_circle</span>
            </div>
            <h3 className="font-headline-md text-2xl text-primary mb-4 font-bold">ORDER SUCCESSFUL!</h3>
            <p className="text-secondary max-w-sm leading-relaxed mb-6">
              Thank you for your purchase at **TOBEQUE LUXE**. A confirmation email has been sent to your inbox.
            </p>
            <div className="w-12 h-1 bg-primary animate-pulse" />
          </div>
        )}

        {/* Modal Header */}
        <div className="px-6 py-6 border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest">
          <div>
            <h3 className="font-label-caps text-label-caps tracking-widest text-primary text-base font-bold">SECURE CHECKOUT</h3>
            {displayName && (
              <p className="text-xs text-secondary mt-0.5 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">person</span>
                {displayName} {displayPhone && `· +91 ${displayPhone}`}
              </p>
            )}
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="w-10 h-10 flex items-center justify-center hover:bg-neutral-100 rounded-full transition-colors cursor-pointer text-primary"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleCheckoutSubmit} className="p-6 flex flex-col gap-6 text-left">

          {/* Order Summary details */}
          <div className="bg-neutral-50 p-4 border border-outline-variant/60 flex flex-col gap-2">
            <span className="text-[11px] font-label-caps text-secondary tracking-wider">YOUR ORDER SUMMARY</span>
            {cart.length > 0 ? (
              <div className="flex flex-col gap-1.5 mt-2">
                {cart.map((item) => (
                  <div key={item.cartId} className="flex justify-between items-center text-xs text-primary">
                    <span className="truncate max-w-[280px] font-medium">{item.name} ({item.selectedSize}) x{item.quantity}</span>
                    <span>{item.price}</span>
                  </div>
                ))}
                <div className="h-px bg-outline-variant/50 my-2" />
                <div className="flex justify-between items-center text-xs text-secondary">
                  <span>Subtotal</span>
                  <span>₹{cartSubtotal.toFixed(2)}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between items-center text-xs text-green-600">
                    <span>Discount ({appliedCoupon.code})</span>
                    <span>-₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-sm font-bold text-primary mt-1 pt-1 border-t border-outline-variant/30">
                  <span>Total Due</span>
                  <span>₹{cartTotal.toFixed(2)}</span>
                </div>
              </div>
            ) : (
              <div className="text-xs text-secondary py-2">Your cart is empty. Please add items before checking out.</div>
            )}
          </div>

          {/* Form Input fields */}
          <div className="flex flex-col gap-4">
            {errorMessage && (
              <div className="text-red-500 text-xs font-bold bg-red-50 p-2 rounded">{errorMessage}</div>
            )}
            
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-label-caps text-secondary font-bold">FULL NAME *</label>
              <input
                type="text"
                required
                value={checkoutName}
                onChange={(e) => setCheckoutName(e.target.value)}
                placeholder="Enter your full name"
                className="border border-outline-variant px-4 py-3 text-sm focus:outline-none focus:border-primary bg-white text-primary rounded-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-label-caps text-secondary font-bold">SHIPPING ADDRESS *</label>
              <input
                type="text"
                required
                value={checkoutAddress}
                onChange={(e) => setCheckoutAddress(e.target.value)}
                placeholder="Enter your full shipping address"
                className="border border-outline-variant px-4 py-3 text-sm focus:outline-none focus:border-primary bg-white text-primary rounded-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-label-caps text-secondary font-bold">PHONE NUMBER</label>
              <input
                type="text"
                required
                value={checkoutPhone}
                onChange={(e) => setCheckoutPhone(e.target.value)}
                placeholder="Enter your phone number"
                className="border border-outline-variant px-4 py-3 text-sm focus:outline-none focus:border-primary bg-white text-primary rounded-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-label-caps text-secondary font-bold">EMAIL ADDRESS (OPTIONAL)</label>
              <input
                type="email"
                value={checkoutEmail}
                onChange={(e) => setCheckoutEmail(e.target.value)}
                placeholder="you@example.com (for order confirmation)"
                className="border border-outline-variant px-4 py-3 text-sm focus:outline-none focus:border-primary bg-white text-primary rounded-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-label-caps text-secondary font-bold">PAYMENT METHOD</label>
              <div className="border border-outline-variant px-4 py-3 text-sm bg-neutral-50 text-secondary flex items-center gap-2">
                <span className="material-symbols-outlined text-base">local_shipping</span>
                Cash on Delivery (COD)
              </div>
            </div>
          </div>

          {/* Submit / Pay buttons */}
          <button
            type="submit"
            disabled={isSubmittingOrder || cart.length === 0}
            className="w-full bg-primary text-on-primary h-14 text-label-caps font-label-caps tracking-widest hover:bg-neutral-800 transition-colors shadow-md mt-4 cursor-pointer font-bold flex justify-center items-center gap-2 disabled:bg-neutral-600 disabled:cursor-not-allowed"
          >
            {isSubmittingOrder && (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {isSubmittingOrder ? "PROCESSING..." : "SUBMIT ORDER & PAY"}
          </button>
        </form>
      </div>
    </div>
  );
}
