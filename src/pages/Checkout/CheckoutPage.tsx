import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { createOrder, validateCouponAPI, getRazorpayConfig, createRazorpayOrder, verifyRazorpayPayment } from '../../services/userAuthService';
import { Navbar } from '../../components/Navbar/Navbar';
import { Footer } from '../../components/Footer/Footer';
import { useCurrency } from '../../context/CurrencyContext';
interface PostOffice {
  Name: string;
  Block: string;
  District: string;
  State: string;
  Country: string;
  Pincode: string;
}

interface PincodeApiResponse {
  Status: string;
  PostOffice: PostOffice[] | null;
}

/* ─── Helpers ─── */
const COUNTRY = 'India';

/* ════════════════════════════════════════════════════════════════
   Render Helpers
════════════════════════════════════════════════════════════════ */
const FloatingInput = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  required = false,
  readOnly = false,
  hint,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange?: (v: string) => void;
  required?: boolean;
  readOnly?: boolean;
  hint?: string;
}) => (
  <div className="relative">
    <input
      id={id}
      type={type}
      required={required}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      readOnly={readOnly}
      placeholder=" "
      className={`peer w-full border-b ${readOnly
          ? 'border-outline-variant/60 bg-transparent text-secondary/70 cursor-not-allowed'
          : 'border-secondary/40 bg-transparent text-primary focus:border-primary focus:border-b-2'
        } pt-5 pb-2 text-sm focus:outline-none transition-colors duration-200 placeholder-transparent`}
    />
    <label
      htmlFor={id}
      className="absolute left-0 top-5 text-secondary/70 text-sm transition-all duration-200 pointer-events-none
        peer-focus:top-0 peer-focus:text-[10px] peer-focus:text-primary peer-focus:font-bold peer-focus:tracking-widest peer-focus:uppercase
        peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:text-[10px] peer-not-placeholder-shown:font-bold peer-not-placeholder-shown:tracking-widest peer-not-placeholder-shown:uppercase peer-not-placeholder-shown:text-secondary"
    >
      {label}{required && ' *'}
    </label>
    {hint && <p className="text-[10px] text-secondary/70 mt-1">{hint}</p>}
  </div>
);

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[10px] uppercase tracking-[0.18em] font-bold text-secondary mb-4 mt-1">
    {children}
  </p>
);

const CustomSelect = ({
  id,
  label,
  value,
  onChange,
  options,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="relative w-full"
      tabIndex={-1}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setIsOpen(false);
        }
      }}
    >
      <label className="absolute left-0 top-0 text-[10px] font-bold tracking-widest uppercase text-secondary">
        {label}
      </label>
      <button
        type="button"
        id={id}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left border-b border-secondary/40 bg-transparent pt-5 pb-2 text-sm focus:outline-none focus:border-primary focus:border-b-2 transition-colors cursor-pointer flex justify-between items-center"
      >
        <span className={value ? 'text-primary' : 'text-secondary/50'}>
          {value || placeholder}
        </span>
        <span className={`material-symbols-outlined text-[18px] text-secondary/60 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          expand_more
        </span>
      </button>

      {isOpen && (
        <ul className="absolute z-[100] w-full mt-1 bg-white border border-outline-variant/30 rounded-xl shadow-xl max-h-60 overflow-auto py-2 animate-in fade-in slide-in-from-top-1 duration-200">
          {options.map((opt) => (
            <li
              key={opt}
              onClick={() => {
                onChange(opt);
                setIsOpen(false);
              }}
              className={`px-4 py-2.5 text-sm cursor-pointer hover:bg-neutral-50 transition-colors ${value === opt ? 'bg-primary/5 text-primary font-medium' : 'text-secondary/80'
                }`}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════
   CheckoutPage Component
════════════════════════════════════════════════════════════════ */
export function CheckoutPage() {
  const navigate = useNavigate();
  const { currencySymbol } = useCurrency();
  const {
    cart,
    clearCart,
    appliedCoupon,
    removeFromCart,
    updateCartItemQty,
    applyCoupon,
    removeCoupon,
  } = useCart();
  const { isAuthenticated, openLoginModal, logout, user, token } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('online');

  useEffect(() => {
    if (document.getElementById('razorpay-checkout-script')) return;
    const script = document.createElement('script');
    script.id = 'razorpay-checkout-script';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  /* ─── Fetch fresh taxRates from the API to avoid stale cart data ─── */
  const [liveTaxRates, setLiveTaxRates] = useState<Record<string, number>>({});
  const fetchedIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const idsToFetch = cart
      .map(item => item.id)
      .filter(id => !fetchedIdsRef.current.has(String(id)));

    if (idsToFetch.length === 0) return;

    idsToFetch.forEach(id => fetchedIdsRef.current.add(String(id)));

    Promise.all(
      idsToFetch.map(id =>
        fetch(`/api/products/${id}`)
          .then(r => r.json())
          .then(data => ({ id: String(id), taxRate: data?.product?.taxRate ?? 0 }))
          .catch(() => ({ id: String(id), taxRate: 0 }))
      )
    ).then(results => {
      const map: Record<string, number> = {};
      results.forEach(r => { map[r.id] = r.taxRate; });
      setLiveTaxRates(prev => ({ ...prev, ...map }));
    });
  }, [cart]);

  /* ─── Billing form ─── */
  const fullName = user?.firstName
    ? `${user.firstName} ${user.lastName || ''}`.trim()
    : '';

  const [billingName, setBillingName] = useState(fullName);
  const [billingEmail, setBillingEmail] = useState(user?.email || '');
  const [billingPhone, setBillingPhone] = useState(user?.phone || '');
  const [billingStreet, setBillingStreet] = useState(user?.address || '');
  const [billingPincode, setBillingPincode] = useState(user?.zipCode || '');
  const [billingArea, setBillingArea] = useState('');
  const [billingCity, setBillingCity] = useState(user?.city || '');
  const [billingState, setBillingState] = useState(user?.state || '');
  const [companyName, setCompanyName] = useState('');
  const [companyGst, setCompanyGst] = useState('');

  /* ─── Pincode lookup ─── */
  const [pincodeAreas, setPincodeAreas] = useState<PostOffice[]>([]);
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [pincodeError, setPincodeError] = useState('');

  /* ─── Shipping toggle ─── */
  const [shipDifferent, setShipDifferent] = useState(false);
  const [shippingName, setShippingName] = useState('');
  const [shippingStreet, setShippingStreet] = useState('');
  const [shippingPincode, setShippingPincode] = useState('');
  const [shippingArea, setShippingArea] = useState('');
  const [shippingCity, setShippingCity] = useState('');
  const [shippingState, setShippingState] = useState('');
  const [shippingPincodeAreas, setShippingPincodeAreas] = useState<PostOffice[]>([]);
  const [shippingPincodeLoading, setShippingPincodeLoading] = useState(false);

  /* ─── UI state ─── */
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [orderNotes, setOrderNotes] = useState('');

  /* ─── Shipping state ─── */
  const [shippingCost, setShippingCost] = useState<number>(0);
  const [codFee, setCodFee] = useState<number>(0);
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
  const [shippingSource, setShippingSource] = useState<'shiprocket' | 'fallback' | 'free' | null>(null);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState<number>(0);

  // Fetch public settings on mount to get free shipping threshold
  useEffect(() => {
    fetch('/api/settings/public')
      .then(r => r.json())
      .then(data => {
        if (data?.settings?.freeShippingThreshold) {
          setFreeShippingThreshold(parseFloat(data.settings.freeShippingThreshold) || 0);
        }
      })
      .catch(() => { });
  }, []);

  /* ─── Coupon state ─── */
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);


  /* ─── Sync user data on open ─── */
  useEffect(() => {
    if (user) {
      setBillingName(
        user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : ''
      );
      setBillingEmail(user.email || '');
      setBillingPhone(user.phone || '');
      setBillingStreet(user.address || '');
      setBillingPincode(user.zipCode || '');
      setBillingCity(user.city || '');
      setBillingState(user.state || '');
      setPincodeAreas([]);
      setBillingArea('');
    }
  }, [user]);

  /* ─── Auth gate ─── */
  useEffect(() => {
    if (!isAuthenticated) {
      openLoginModal(() => navigate('/checkout'));
      navigate('/');
    }
  }, [isAuthenticated, navigate, openLoginModal]);


  /* ─── Pincode lookup helper ─── */
  const lookupPincode = useCallback(
    async (
      pin: string,
      setAreas: (a: PostOffice[]) => void,
      setCity: (c: string) => void,
      setState: (s: string) => void,
      setLoading: (b: boolean) => void,
      setError?: (e: string) => void
    ) => {
      if (pin.length !== 6) {
        setAreas([]);
        return;
      }
      setLoading(true);
      setError?.('');
      try {
        const res = await fetch(
          `https://api.postalpincode.in/pincode/${pin}`
        );
        const json: PincodeApiResponse[] = await res.json();
        const result = json[0];
        if (result.Status === 'Success' && result.PostOffice?.length) {
          setAreas(result.PostOffice);
          // Pre-fill city & state from first entry
          setCity(result.PostOffice[0].District);
          setState(result.PostOffice[0].State);
        } else {
          setAreas([]);
          setError?.('No areas found for this pincode.');
        }
      } catch {
        setAreas([]);
        setError?.('Failed to fetch pincode data.');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /* ─── Billing pincode change ─── */
  const handleBillingPincodeChange = async (val: string) => {
    const clean = val.replace(/\D/g, '').slice(0, 6);
    setBillingPincode(clean);
    setBillingArea('');
    if (clean.length === 6) {
      await lookupPincode(
        clean,
        setPincodeAreas,
        setBillingCity,
        setBillingState,
        setPincodeLoading,
        setPincodeError
      );
    } else {
      setPincodeAreas([]);
      setPincodeError('');
    }
  };

  /* ─── Billing area select ─── */
  const handleBillingAreaChange = (areaName: string) => {
    setBillingArea(areaName);
    const found = pincodeAreas.find((p) => p.Name === areaName);
    if (found) {
      setBillingCity(found.District);
      setBillingState(found.State);
    }
  };

  /* ─── Shipping pincode change ─── */
  const handleShippingPincodeChange = async (val: string) => {
    const clean = val.replace(/\D/g, '').slice(0, 6);
    setShippingPincode(clean);
    setShippingArea('');
    if (clean.length === 6) {
      await lookupPincode(
        clean,
        setShippingPincodeAreas,
        setShippingCity,
        setShippingState,
        setShippingPincodeLoading
      );
    } else {
      setShippingPincodeAreas([]);
    }
  };

  /* ─── Shipping area select ─── */
  const handleShippingAreaChange = (areaName: string) => {
    setShippingArea(areaName);
    const found = shippingPincodeAreas.find((p) => p.Name === areaName);
    if (found) {
      setShippingCity(found.District);
      setShippingState(found.State);
    }
  };

  /* ─── Cart totals ─── */
  const cartSubtotal = cart.reduce((total, item) => {
    const priceStr = String(item.price || '').replace(/[^0-9.-]+/g, '');
    return total + (parseFloat(priceStr) || 0) * item.quantity;
  }, 0);

  const totalGst = cart.reduce((total, item) => {
    const priceStr = String(item.price || '').replace(/[^0-9.-]+/g, '');
    const price = parseFloat(priceStr) || 0;
    const qty = item.quantity;
    // Prefer the live (freshly fetched) taxRate, fall back to cart item's taxRate
    const taxRate = (liveTaxRates[String(item.id)] !== undefined)
      ? liveTaxRates[String(item.id)]
      : (item.taxRate || 0);

    // Tax Inclusive Math
    const lineTotal = price * qty;
    const basePrice = lineTotal / (1 + (taxRate / 100));
    const gst = lineTotal - basePrice;

    return total + gst;
  }, 0);

  const distinctTaxRates = [...new Set(cart.map(item => {
    return (liveTaxRates[String(item.id)] !== undefined)
      ? liveTaxRates[String(item.id)]
      : (item.taxRate || 0);
  }))];
  const taxRateLabel = distinctTaxRates.length === 1 ? `(${distinctTaxRates[0]}%)` : '(Mixed)';


  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percentage') {
      discountAmount = (cartSubtotal * parseFloat(appliedCoupon.discountValue as any)) / 100;
    } else {
      discountAmount = parseFloat(appliedCoupon.discountValue as any);
    }
    if (discountAmount > cartSubtotal) discountAmount = cartSubtotal;
  }

  const discountRatio = cartSubtotal > 0 ? (discountAmount / cartSubtotal) : 0;
  const finalGst = totalGst * (1 - discountRatio);
  const exTaxSubtotal = cartSubtotal - totalGst;
  const finalExTaxSubtotal = exTaxSubtotal * (1 - discountRatio);

  const cartTotal = cartSubtotal - discountAmount + shippingCost;

  /* ─── Calculate shipping whenever pincode or payment method changes ─── */
  const deliveryPincode = shipDifferent ? shippingPincode : billingPincode;
  useEffect(() => {
    const pincode = String(deliveryPincode || '').trim();
    if (pincode.length < 6) {
      setShippingCost(0);
      setCodFee(0);
      setShippingSource(null);
      return;
    }

    // Check free shipping threshold first (applied to subtotal after discount)
    if (freeShippingThreshold > 0 && cartSubtotal - discountAmount >= freeShippingThreshold) {
      // Note: If free shipping is met, we still need to know the COD fee if they selected COD.
      // For now, let's fetch it anyway if it's COD, or just waive everything.
      // The API handles adding COD to shippingCost even if base is 0. 
      // We will let the API handle the logic so we get the accurate codFee.
    }

    let cancelled = false;
    setIsCalculatingShipping(true);
    fetch('/api/shipping/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pincode, paymentMethod, weight: 0.5 })
    })
      .then(r => r.json())
      .then(data => {
        if (cancelled) return;
        if (data.success) {
          // If free shipping threshold met, waive the base shipping but KEEP the codFee
          let finalShipping = data.shippingCost;
          let source = data.source;

          if (freeShippingThreshold > 0 && cartSubtotal - discountAmount >= freeShippingThreshold) {
            finalShipping = data.codFee || 0; // Waive base, only charge COD if applicable
            source = 'free';
          }

          setShippingCost(finalShipping);
          setCodFee(data.codFee || 0);
          setShippingSource(source);
        }
      })
      .catch(() => { })
      .finally(() => { if (!cancelled) setIsCalculatingShipping(false); });

    return () => { cancelled = true; };
  }, [deliveryPincode, paymentMethod, freeShippingThreshold, cartSubtotal, discountAmount]);

  /* ─── Apply Coupon ─── */
  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setIsApplyingCoupon(true);
    setCouponError('');
    try {
      const coupon = await validateCouponAPI(couponInput, cartSubtotal);
      applyCoupon({
        code: coupon.code,
        discountValue: coupon.discountValue,
        type: coupon.type
      });
      setCouponInput('');
    } catch (err: any) {
      setCouponError(err.message || 'Invalid coupon');
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  /* ─── Submit ─── */
  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    const billingAddressObj = {
      name: billingName,
      phone: billingPhone,
      street: billingStreet,
      city: billingCity,
      state: billingState,
      zip: billingPincode,
      country: COUNTRY
    };

    const shippingAddressObj = shipDifferent
      ? {
        name: shippingName || billingName,
        phone: billingPhone,
        street: shippingStreet,
        city: shippingCity,
        state: shippingState,
        zip: shippingPincode,
        country: COUNTRY
      }
      : billingAddressObj;

    if (!billingName || !billingStreet || !billingPincode) {
      setErrorMessage('Please fill in all required billing fields.');
      return;
    }

    setIsSubmittingOrder(true);
    setErrorMessage('');

    try {
      const items = cart.map((item) => {
        const priceStr = String(item.price || '').replace(/[^0-9.-]+/g, '');
        return {
          productId: item.id,
          price: parseFloat(priceStr) || 0,
          quantity: item.quantity,
          variantDetails: { size: item.selectedSize, color: item.selectedColor },
        };
      });

      if (paymentMethod === 'cod') {
        await createOrder(token, {
          customerName: billingName,
          customerPhone: billingPhone,
          shippingAddress: shippingAddressObj,
          billingAddress: billingAddressObj,
          items,
          couponCode: appliedCoupon?.code,
          paymentMethod: 'cod',
          notes: orderNotes,
          shippingCost,
        });

        setIsSubmittingOrder(false);
        setCheckoutSuccess(true);
        setTimeout(() => {
          clearCart();
          setCheckoutSuccess(false);
          navigate('/');
        }, 3500);
      } else {
        const keyId = await getRazorpayConfig();
        const rpOrder = await createRazorpayOrder(token, {
          items,
          couponCode: appliedCoupon?.code,
        });

        const options = {
          key: keyId,
          amount: rpOrder.amount,
          currency: rpOrder.currency,
          name: "Tobeque",
          description: "Order Payment",
          order_id: rpOrder.orderId,
          handler: async function (response: any) {
            try {
              setIsSubmittingOrder(true);
              await verifyRazorpayPayment(token, {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                customerName: billingName,
                customerPhone: billingPhone,
                shippingAddress: shippingAddressObj,
                billingAddress: billingAddressObj,
                items,
                couponCode: appliedCoupon?.code,
                notes: orderNotes,
                shippingCost,
              });

              setIsSubmittingOrder(false);
              setCheckoutSuccess(true);
              setTimeout(() => {
                clearCart();
                setCheckoutSuccess(false);
                navigate('/');
              }, 3500);
            } catch (err: any) {
              setIsSubmittingOrder(false);
              setErrorMessage(err.message || 'Payment verification failed.');
            }
          },
          prefill: {
            name: billingName,
            email: billingEmail,
            contact: billingPhone,
          },
          theme: {
            color: "#1A1A1A",
          },
          modal: {
            ondismiss: function () {
              setIsSubmittingOrder(false);
            }
          }
        };

        const rzp1 = new (window as any).Razorpay(options);
        rzp1.on('payment.failed', function (response: any) {
          setIsSubmittingOrder(false);
          setErrorMessage('Payment failed. ' + response.error.description);
        });
        rzp1.open();
      }
    } catch (error: any) {
      setIsSubmittingOrder(false);

      const errMsg = error.message || '';
      if (errMsg.includes('token failed or expired') || errMsg.includes('Not authorized')) {
        setErrorMessage('Your session has expired. Please log in again.');
        logout();
      } else {
        setErrorMessage(errMsg || 'An error occurred while placing the order.');
      }
    }
  };



  if (!isAuthenticated) {
    const isExpired = errorMessage && errorMessage.includes('expired');

    return (
      <div className="bg-background min-h-screen text-on-background font-body-md antialiased flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">

          {isExpired && (
            <div className="mb-6 px-5 py-3 bg-red-50 border border-red-200 text-red-600 text-sm font-bold rounded-xl flex items-center gap-2 shadow-sm animate-in slide-in-from-top-4">
              <span className="material-symbols-outlined text-[20px]">warning</span>
              {errorMessage}
            </div>
          )}

          <div className="w-24 h-24 bg-surface-container rounded-full flex items-center justify-center mb-6 text-primary shadow-sm border border-outline-variant/30">
            <span className="material-symbols-outlined text-[40px]">lock_person</span>
          </div>
          <h2 className="font-headline-md text-2xl text-primary mb-3 font-bold tracking-tight">
            {isExpired ? 'Session Expired' : 'Login Required'}
          </h2>
          <p className="text-sm text-secondary/70 max-w-sm leading-relaxed mb-8">
            {isExpired
              ? 'Please log in again to continue placing your order securely.'
              : 'Please log in or create an account to proceed with your secure checkout.'}
          </p>
          <button
            onClick={() => openLoginModal()}
            className="px-8 h-12 bg-primary text-on-primary text-[11px] font-bold tracking-[0.15em] uppercase rounded-full hover:bg-neutral-800 transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">login</span>
            Login / Sign Up
          </button>
        </div>
        <Footer />
      </div>
    );
  }
  /* ────────────────────────────────────────────────────────────────
     JSX
  ──────────────────────────────────────────────────────────────── */
  return (
    <div className="bg-background min-h-screen text-on-background font-body-md antialiased overflow-x-hidden flex flex-col">
      <Navbar />
      <div className="flex-1 pt-[70px] pb-12 px-4 sm:px-6 flex justify-center w-full">
        <div
          className="bg-white w-full max-w-5xl shadow-xl border border-outline-variant/30 relative flex flex-col rounded-2xl"
        >

          {/* ── Success Overlay ── */}
          {checkoutSuccess && (
            <div className="absolute inset-0 bg-white z-50 flex flex-col items-center justify-center p-10 text-center animate-in fade-in duration-300 rounded-2xl">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-5 text-green-500 shadow-sm border border-green-100">
                <span className="material-symbols-outlined text-[48px]">check_circle</span>
              </div>
              <h3 className="font-headline-md text-2xl text-primary mb-3 font-bold tracking-tight">
                Order Placed!
              </h3>
              <p className="text-sm text-secondary/70 max-w-xs leading-relaxed">
                Thank you, <strong>{billingName.split(' ')[0]}</strong>! Your order is confirmed and will be processed shortly.
              </p>
              <div className="w-10 h-1 bg-primary mt-6 animate-pulse rounded-full" />
            </div>
          )}

          {/* ── Header ── */}
          <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-outline-variant/30 shrink-0">
            <div>
              <h2 className="text-base font-bold tracking-widest uppercase text-primary">Secure Checkout</h2>
              {user && (
                <p className="text-[9px] text-secondary/90 mt-0.5 flex items-center gap-1 font-medium">
                  <span className="material-symbols-outlined text-[11px]">verified_user</span>
                  Logged in as {billingPhone && `+91 ${billingPhone}`}
                </p>
              )}
            </div>
            <button
              onClick={() => navigate(-1)}
              className="w-auto px-4 h-9 flex items-center justify-center hover:bg-neutral-100 rounded-full transition-colors text-secondary/80 font-label-caps text-[10px] tracking-widest font-bold cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px] mr-1">arrow_back</span>
              Back
            </button>
          </div>

          {/* ── Scrollable body ── */}
          <div className="overflow-y-auto flex-1">
            <form onSubmit={handleCheckoutSubmit} className="flex flex-col lg:flex-row">

              {/* ═══ LEFT — FORM ═══ */}
              <div className="flex-1 px-6 py-5 flex flex-col gap-6 border-b lg:border-b-0 lg:border-r border-outline-variant/30">

                {/* Error */}
                {errorMessage && (
                  <div className="flex items-start gap-2 text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-xs">
                    <span className="material-symbols-outlined text-[16px] shrink-0 mt-0.5">error</span>
                    {errorMessage}
                  </div>
                )}

                {/* ─── BILLING DETAILS ─── */}
                <div>
                  <SectionLabel>Billing Details</SectionLabel>

                  <div className="flex flex-col gap-5">
                    {/* Full Name */}
                    <FloatingInput
                      id="billing-name"
                      label="Full Name"
                      required
                      value={billingName}
                      onChange={setBillingName}
                    />

                    {/* Phone + Email */}
                    <div className="grid grid-cols-2 gap-4">
                      <FloatingInput
                        id="billing-phone"
                        label="Phone"
                        type="tel"
                        required
                        value={billingPhone}
                        onChange={setBillingPhone}
                      />
                      <FloatingInput
                        id="billing-email"
                        label="Email"
                        type="email"
                        value={billingEmail}
                        onChange={setBillingEmail}
                      />
                    </div>

                    {/* Company Name */}
                    <FloatingInput
                      id="company-name"
                      label="Company Name (optional)"
                      value={companyName}
                      onChange={setCompanyName}
                    />

                    {/* Company GST — conditional */}
                    {companyName.trim().length > 0 && (
                      <div className="animate-in slide-in-from-top-2 fade-in duration-200">
                        <FloatingInput
                          id="company-gst"
                          label="Company GST Number"
                          value={companyGst}
                          onChange={setCompanyGst}
                        />
                      </div>
                    )}

                    {/* Street Address */}
                    <FloatingInput
                      id="billing-street"
                      label="Street Address"
                      required
                      value={billingStreet}
                      onChange={setBillingStreet}
                    />

                    {/* Pincode */}
                    <div>
                      <div className="relative">
                        <input
                          id="billing-pincode"
                          type="text"
                          inputMode="numeric"
                          maxLength={6}
                          required
                          value={billingPincode}
                          onChange={(e) => handleBillingPincodeChange(e.target.value)}
                          placeholder=" "
                          className="peer w-full border-b border-secondary/40 bg-transparent text-primary pt-5 pb-2 text-sm focus:outline-none focus:border-primary focus:border-b-2 transition-colors placeholder-transparent"
                        />
                        <label
                          htmlFor="billing-pincode"
                          className="absolute left-0 top-5 text-secondary/70 text-sm transition-all duration-200 pointer-events-none
                          peer-focus:top-0 peer-focus:text-[10px] peer-focus:text-primary peer-focus:font-bold peer-focus:tracking-widest peer-focus:uppercase
                          peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:text-[10px] peer-not-placeholder-shown:font-bold peer-not-placeholder-shown:tracking-widest peer-not-placeholder-shown:uppercase peer-not-placeholder-shown:text-secondary"
                        >
                          Pincode *
                        </label>
                        {pincodeLoading && (
                          <div className="absolute right-0 bottom-2">
                            <svg className="animate-spin h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      {pincodeError && (
                        <p className="text-[10px] text-red-500 mt-1">{pincodeError}</p>
                      )}
                    </div>

                    {/* Area dropdown — shows after pincode lookup */}
                    {pincodeAreas.length > 0 && (
                      <div className="relative animate-in slide-in-from-top-2 fade-in duration-200">
                        <CustomSelect
                          id="billing-area"
                          label="Area / Locality *"
                          value={billingArea}
                          onChange={handleBillingAreaChange}
                          options={pincodeAreas.map(po => po.Name)}
                          placeholder="Select your area / locality"
                        />
                      </div>
                    )}

                    {/* City + State (read-only after pincode auto-fill) */}
                    <div className="grid grid-cols-2 gap-4">
                      <FloatingInput
                        id="billing-city"
                        label="City"
                        required
                        value={billingCity}
                        onChange={setBillingCity}
                        readOnly={pincodeAreas.length > 0 && !!billingArea}
                      />
                      <FloatingInput
                        id="billing-state"
                        label="State"
                        required
                        value={billingState}
                        onChange={setBillingState}
                        readOnly={pincodeAreas.length > 0 && !!billingArea}
                      />
                    </div>

                    {/* Country — always India */}
                    <div className="relative">
                      <input
                        id="billing-country"
                        type="text"
                        value={COUNTRY}
                        readOnly
                        placeholder=" "
                        className="peer w-full border-b border-outline-variant/60 bg-transparent text-secondary/70 pt-5 pb-2 text-sm cursor-not-allowed placeholder-transparent"
                      />
                      <label
                        htmlFor="billing-country"
                        className="absolute left-0 top-0 text-[10px] font-bold tracking-widest uppercase text-secondary/70"
                      >
                        Country
                      </label>
                      <span className="material-symbols-outlined absolute right-0 bottom-2 text-[16px] text-secondary/50">flag</span>
                    </div>
                  </div>
                </div>

                {/* ─── SHIP TO DIFFERENT ADDRESS ─── */}
                <div>
                  <label className="flex items-center gap-3 cursor-pointer select-none group">
                    <div
                      onClick={() => setShipDifferent((v) => !v)}
                      className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-colors duration-200 shrink-0 ${shipDifferent
                          ? 'bg-primary border-primary'
                          : 'border-outline-variant bg-white group-hover:border-primary/50'
                        }`}
                    >
                      {shipDifferent && (
                        <span className="material-symbols-outlined text-white text-[14px]">check</span>
                      )}
                    </div>
                    <span className="text-sm text-secondary/80 group-hover:text-primary transition-colors">
                      Ship to a different address?
                    </span>
                  </label>
                </div>

                {/* ─── SHIPPING ADDRESS (conditional) ─── */}
                {shipDifferent && (
                  <div className="animate-in slide-in-from-top-4 fade-in duration-300 bg-neutral-50/70 rounded-xl p-4 border border-outline-variant/30">
                    <SectionLabel>Shipping Address</SectionLabel>
                    <div className="flex flex-col gap-5">
                      <FloatingInput
                        id="shipping-name"
                        label="Recipient Full Name"
                        required
                        value={shippingName}
                        onChange={setShippingName}
                      />
                      <FloatingInput
                        id="shipping-street"
                        label="Street Address"
                        required
                        value={shippingStreet}
                        onChange={setShippingStreet}
                      />

                      {/* Shipping Pincode */}
                      <div className="relative">
                        <input
                          id="shipping-pincode"
                          type="text"
                          inputMode="numeric"
                          maxLength={6}
                          required
                          value={shippingPincode}
                          onChange={(e) => handleShippingPincodeChange(e.target.value)}
                          placeholder=" "
                          className="peer w-full border-b border-secondary/40 bg-transparent text-primary pt-5 pb-2 text-sm focus:outline-none focus:border-primary focus:border-b-2 transition-colors placeholder-transparent"
                        />
                        <label
                          htmlFor="shipping-pincode"
                          className="absolute left-0 top-5 text-secondary/70 text-sm transition-all duration-200 pointer-events-none
                          peer-focus:top-0 peer-focus:text-[10px] peer-focus:text-primary peer-focus:font-bold peer-focus:tracking-widest peer-focus:uppercase
                          peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:text-[10px] peer-not-placeholder-shown:font-bold peer-not-placeholder-shown:tracking-widest peer-not-placeholder-shown:uppercase peer-not-placeholder-shown:text-secondary"
                        >
                          Pincode *
                        </label>
                        {shippingPincodeLoading && (
                          <div className="absolute right-0 bottom-2">
                            <svg className="animate-spin h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                          </div>
                        )}
                      </div>

                      {shippingPincodeAreas.length > 0 && (
                        <div className="relative animate-in slide-in-from-top-2 fade-in duration-200">
                          <CustomSelect
                            id="shipping-area"
                            label="Area / Locality *"
                            value={shippingArea}
                            onChange={handleShippingAreaChange}
                            options={shippingPincodeAreas.map(po => po.Name)}
                            placeholder="Select area / locality"
                          />
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                        <FloatingInput
                          id="shipping-city"
                          label="City"
                          required
                          value={shippingCity}
                          onChange={setShippingCity}
                          readOnly={shippingPincodeAreas.length > 0 && !!shippingArea}
                        />
                        <FloatingInput
                          id="shipping-state"
                          label="State"
                          required
                          value={shippingState}
                          onChange={setShippingState}
                          readOnly={shippingPincodeAreas.length > 0 && !!shippingArea}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* ─── ORDER NOTES ─── */}
                <div className="flex flex-col gap-1">
                  <p className="text-[9px] uppercase tracking-widest font-bold text-secondary">Order Notes (optional)</p>
                  <textarea
                    rows={2}
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="Any special delivery instructions..."
                    className="w-full border border-secondary/40 rounded-lg px-3 py-2.5 text-sm text-primary focus:outline-none focus:border-primary/50 resize-none bg-transparent placeholder-secondary/60 transition-colors"
                  />
                </div>
              </div>

              {/* ═══ RIGHT — ORDER SUMMARY + PAYMENT ═══ */}
              <div className="w-full lg:w-72 shrink-0 px-6 py-5 flex flex-col gap-5 bg-neutral-50/60">

                {/* Order items */}
                <div>
                  <SectionLabel>Your Order</SectionLabel>
                  <div className="flex flex-col gap-3">
                    {cart.length === 0 ? (
                      <p className="text-xs text-secondary/50 italic">Your cart is empty.</p>
                    ) : (
                      cart.map((item) => (
                        <div key={item.cartId} className="flex items-center gap-3">
                          {item.imageSrc && (
                            <div className="w-12 h-14 rounded-lg overflow-hidden bg-surface-container shrink-0 relative group">
                              {item.imageSrc.match(/\.(mp4|webm|ogg)$/i) ? (
                                <video src={item.imageSrc} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                              ) : (
                                <img src={item.imageSrc} alt={item.name} className="w-full h-full object-cover" />
                              )}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-primary line-clamp-2 leading-snug">{item.name}</p>
                            <p className="text-[10px] text-secondary/60 mt-0.5 flex items-center gap-1.5">
                              <span>{item.selectedSize}</span>
                              {item.selectedColor && item.selectedColor !== 'DEFAULT' && (
                                <>
                                  <span className="w-0.5 h-0.5 rounded-full bg-secondary/40"></span>
                                  <span>{item.selectedColor}</span>
                                </>
                              )}
                            </p>
                            <div className="flex items-center gap-3 mt-1.5">
                              <div className="flex items-center border border-outline-variant/60 rounded h-5">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    updateCartItemQty(item.cartId, Math.max(1, item.quantity - 1));
                                  }}
                                  className="w-5 h-full flex items-center justify-center text-secondary hover:text-primary hover:bg-neutral-50 transition-colors"
                                >
                                  <span style={{ fontSize: '10px', lineHeight: 1 }}>&#8722;</span>
                                </button>
                                <span className="w-5 text-center text-primary text-[9px] font-medium">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    updateCartItemQty(item.cartId, item.quantity + 1);
                                  }}
                                  className="w-5 h-full flex items-center justify-center text-secondary hover:text-primary hover:bg-neutral-50 transition-colors"
                                >
                                  <span style={{ fontSize: '10px', lineHeight: 1 }}>&#43;</span>
                                </button>
                              </div>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  removeFromCart(item.cartId);
                                }}
                                className="text-[9px] text-secondary/60 hover:text-red-500 font-medium uppercase tracking-widest transition-colors flex items-center gap-0.5"
                              >
                                <span className="material-symbols-outlined text-[10px]">delete</span>
                                Remove
                              </button>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-primary shrink-0">{item.price}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-outline-variant/30" />

                {/* Promo Code Section */}
                {cart.length > 0 && (
                  <>
                    <div className="flex flex-col gap-2">
                      {!appliedCoupon ? (
                        <>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={couponInput}
                              onChange={(e) => setCouponInput(e.target.value)}
                              placeholder="Enter Promo Code"
                              className="flex-1 border border-outline-variant/60 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-primary transition-colors bg-white"
                            />
                            <button
                              type="button"
                              onClick={handleApplyCoupon}
                              disabled={isApplyingCoupon || !couponInput.trim()}
                              className="bg-primary text-white px-4 py-2 text-[10px] rounded-lg tracking-widest font-bold disabled:opacity-50 transition-colors"
                            >
                              {isApplyingCoupon ? '...' : 'APPLY'}
                            </button>
                          </div>
                          {couponError && <p className="text-red-500 text-[10px]">{couponError}</p>}
                        </>
                      ) : (
                        <div className="flex justify-between items-center bg-green-50 px-3 py-2 border border-green-200 rounded-lg">
                          <div className="flex items-center gap-2 text-green-700">
                            <span className="material-symbols-outlined text-[16px]">check_circle</span>
                            <span className="text-[10px] font-bold tracking-wide">{appliedCoupon.code} APPLIED</span>
                          </div>
                          <button type="button" onClick={removeCoupon} className="text-secondary/60 hover:text-red-500 transition-colors flex items-center justify-center">
                            <span className="material-symbols-outlined text-[16px]">close</span>
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="h-px bg-outline-variant/30 my-4" />
                  </>
                )}

                {/* Totals */}
                <div className="flex flex-col gap-2 text-xs">
                  <div className="flex justify-between text-secondary/70">
                    <span>Subtotal (ex. tax)</span>
                    <span>{currencySymbol}{finalExTaxSubtotal.toFixed(2)}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({appliedCoupon.code})</span>
                      <span>−{currencySymbol}{discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-secondary/70">
                    <span>Shipping {codFee > 0 ? '(Base)' : ''}</span>
                    {isCalculatingShipping ? (
                      <span className="text-secondary/40 animate-pulse">Calculating...</span>
                    ) : shippingSource === 'free' ? (
                      <span className="text-green-600 font-medium">🎉 Free</span>
                    ) : (shippingCost - codFee) > 0 ? (
                      <span className="font-medium">
                        {currencySymbol}{(shippingCost - codFee).toFixed(2)}
                        {shippingSource === 'fallback' && (
                          <span className="text-[9px] text-secondary/40 ml-1">(est.)</span>
                        )}
                      </span>
                    ) : (
                      <span className="text-secondary/40">Enter pincode</span>
                    )}
                  </div>
                  {codFee > 0 && (
                    <div className="flex justify-between text-amber-600 font-medium">
                      <span>COD Extra Charge</span>
                      <span>+{currencySymbol}{codFee.toFixed(2)}</span>
                    </div>
                  )}
                  {freeShippingThreshold > 0 && shippingSource !== 'free' && (cartSubtotal - discountAmount) < freeShippingThreshold && (
                    <div className="text-[10px] text-amber-600 bg-amber-50 rounded-lg px-2 py-1.5">
                      Add {currencySymbol}{(freeShippingThreshold - (cartSubtotal - discountAmount)).toFixed(0)} more for <strong>Free Shipping!</strong>
                    </div>
                  )}
                  <div className="flex justify-between text-secondary/70">
                    <span>GST {taxRateLabel}</span>
                    <span>{currencySymbol}{finalGst.toFixed(2)}</span>
                  </div>
                  <div className="h-px bg-outline-variant/30 my-1" />
                  <div className="flex justify-between text-sm font-bold text-primary">
                    <span>Total</span>
                    <span>{currencySymbol}{cartTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-outline-variant/30" />

                {/* Payment */}
                <div>
                  <SectionLabel>Payment Method</SectionLabel>
                  <div className="flex flex-col gap-3">
                    <label
                      className={`flex items-center gap-3 bg-white border ${paymentMethod === 'online' ? 'border-primary' : 'border-outline-variant/50'} rounded-xl px-4 py-3 cursor-pointer transition-colors`}
                      onClick={() => setPaymentMethod('online')}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 ${paymentMethod === 'online' ? 'border-primary' : 'border-secondary/40'} flex items-center justify-center shrink-0 transition-colors`}>
                        {paymentMethod === 'online' && <div className="w-2 h-2 rounded-full bg-primary" />}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-primary">Pay Online (Razorpay)</p>
                        <p className="text-[10px] text-secondary/50">Credit/Debit Card, UPI, NetBanking</p>
                      </div>
                      <span className="material-symbols-outlined text-[20px] text-secondary/30 ml-auto">credit_card</span>
                    </label>

                    <label
                      className={`flex items-center gap-3 bg-white border ${paymentMethod === 'cod' ? 'border-primary' : 'border-outline-variant/50'} rounded-xl px-4 py-3 cursor-pointer transition-colors`}
                      onClick={() => setPaymentMethod('cod')}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 ${paymentMethod === 'cod' ? 'border-primary' : 'border-secondary/40'} flex items-center justify-center shrink-0 transition-colors`}>
                        {paymentMethod === 'cod' && <div className="w-2 h-2 rounded-full bg-primary" />}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-primary">Cash on Delivery</p>
                        <p className="text-[10px] text-secondary/50">Pay when your order arrives</p>
                      </div>
                      <span className="material-symbols-outlined text-[20px] text-secondary/30 ml-auto">local_shipping</span>
                    </label>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  form="checkout-form"
                  disabled={isSubmittingOrder || cart.length === 0}
                  onClick={handleCheckoutSubmit}
                  className="w-full h-12 bg-primary text-on-primary text-xs font-bold tracking-[0.15em] uppercase rounded-xl hover:bg-neutral-800 transition-all duration-200 shadow-md hover:shadow-lg disabled:bg-neutral-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer mt-auto"
                >
                  {isSubmittingOrder ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">verified_user</span>
                      Place Order
                    </>
                  )}
                </button>

                {/* Trust badge */}
                <p className="text-[10px] text-secondary/80 font-medium text-center flex items-center justify-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">shield</span>
                  100% Secure · SSL Encrypted
                </p>
              </div>

            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
