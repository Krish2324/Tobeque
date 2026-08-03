import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

import { Footer } from '../../components/Footer/Footer';
import { Navbar } from '../../components/Navbar/Navbar';
import { getUserOrders, updateUserProfile, uploadProfilePhoto } from '../../services/userAuthService';
import { useCurrency } from '../../context/CurrencyContext';

const rawEnvUrl = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
const API_BASE = `${rawEnvUrl}/api`;

interface Order {
  id: number;
  orderNumber: string;
  totalAmount: string | number;
  orderStatus: string;
  paymentStatus: string;
  shippingStatus: string;
  createdAt: string;
  items?: Array<{
    id: number;
    productName: string;
    quantity: number;
    unitPrice: string | number;
    product?: { name: string; thumbnail: string | null };
  }>;
}

const isVideo = (url: string | undefined) => url && !!url.match(/\.(mp4|webm|ogg|mov)(\?.*)?$/i);

type Tab = 'orders' | 'addresses' | 'details' | 'wishlist';

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700 border border-amber-200',
  confirmed: 'bg-blue-50 text-blue-700 border border-blue-200',
  processing: 'bg-purple-50 text-purple-700 border border-purple-200',
  shipped: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
  delivered: 'bg-green-50 text-green-700 border border-green-200',
  cancelled: 'bg-red-50 text-red-700 border border-red-200',
  returned: 'bg-gray-50 text-gray-600 border border-gray-200',
};

const REQUEST_STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  under_review: 'bg-blue-50 text-blue-700 border-blue-200',
  approved: 'bg-green-50 text-green-700 border-green-200',
  rejected: 'bg-red-50 text-red-700 border-red-200',
  auto_cancelled: 'bg-gray-50 text-gray-600 border-gray-200',
};

const REQUEST_STATUS_LABELS: Record<string, string> = {
  pending: 'Request Pending',
  under_review: 'Under Review',
  approved: 'Approved',
  rejected: 'Rejected',
  auto_cancelled: 'Cancelled',
};

const REQUEST_TYPE_LABELS: Record<string, string> = {
  cancel: 'Cancellation',
  return: 'Return',
};

const RETURN_REASONS = [
  { value: 'wrong_size', label: 'Wrong Size', icon: 'straighten' },
  { value: 'damaged_defective', label: 'Damaged / Defective', icon: 'broken_image' },
  { value: 'not_as_described', label: 'Not as Described', icon: 'help_outline' },
  { value: 'changed_mind', label: 'Changed My Mind', icon: 'sentiment_dissatisfied' },
  { value: 'other', label: 'Other', icon: 'more_horiz' },
] as const;

export function ProfilePage() {
  const { user, token, isAuthenticated, logout, updateUser, openLoginModal } = useAuth();
  const { wishlistItems, removeFromWishlist, addToCart, setIsCartOpen } = useCart();
  const { currencySymbol } = useCurrency();

  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<Tab>(location.state?.activeTab || 'orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState('');

  // Sync tab if navigated from Navbar (e.g. clicking wishlist heart icon while already on profile page)
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  // Request map: keyed by orderNumber → { status, requestType }
  const [requestMap, setRequestMap] = useState<Record<string, { status: string; requestType: string }>>({});

  // Cancel modal state
  const [cancelModal, setCancelModal] = useState<{ open: boolean; order: Order | null }>({ open: false, order: null });
  const [cancelReason, setCancelReason] = useState('');
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelError, setCancelError] = useState('');

  // Return modal state
  const [returnModal, setReturnModal] = useState<{ open: boolean; order: Order | null }>({ open: false, order: null });
  const [returnReason, setReturnReason] = useState('');
  const [returnNote, setReturnNote] = useState('');
  const [returnImage, setReturnImage] = useState<File | null>(null);
  const [returnLoading, setReturnLoading] = useState(false);
  const [returnError, setReturnError] = useState('');
  // Order Details modal state
  const [orderDetailsModal, setOrderDetailsModal] = useState<{ open: boolean; order: Order | null }>({ open: false, order: null });
  
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    shippingAddress: '',
    shippingCity: '',
    shippingState: '',
    shippingZipCode: '',
    gender: '',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        zipCode: user.zipCode || '',
        shippingAddress: user.shippingAddress || '',
        shippingCity: user.shippingCity || '',
        shippingState: user.shippingState || '',
        shippingZipCode: user.shippingZipCode || '',
        gender: user.gender || '',
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setIsSaving(true);
    setSaveError('');
    setSaveSuccess(false);
    try {
      const updatedUser = await updateUserProfile(token, formData);
      updateUser(updatedUser);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setSaveError(err.message || 'Failed to update profile details.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !token) return;
    const file = e.target.files[0];
    
    setIsUploadingPhoto(true);
    try {
      const updatedUser = await uploadProfilePhoto(token, file);
      updateUser(updatedUser);
    } catch (err: any) {
      alert(err.message || 'Failed to upload photo');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Fetch user's requests and build a map keyed by orderNumber
  const fetchRequestMap = useCallback(() => {
    if (!token) return;
    fetch(`${API_BASE}/refund-requests/my`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          const map: Record<string, { status: string; requestType: string }> = {};
          (data.requests as Array<{ orderId: string; status: string; requestType: string }>).forEach(r => {
            map[r.orderId] = { status: r.status, requestType: r.requestType };
          });
          setRequestMap(map);
        }
      })
      .catch(() => {});
  }, [token]);

  // Fetch orders on mount
  useEffect(() => {
    if (!token || !isAuthenticated) return;
    setOrdersLoading(true);
    getUserOrders(token)
      .then((data) => setOrders(data || []))
      .catch((err) => {
        const msg = err.message || 'Failed to load orders';
        setOrdersError(msg.toLowerCase().includes('not authorized') ? 'Login again, session expired' : msg);
      })
      .finally(() => setOrdersLoading(false));

    fetchRequestMap();
  }, [token, isAuthenticated, fetchRequestMap]);

  if (!isAuthenticated || !user) return null;

  const displayName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Guest User';

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  const handleWishlistToCart = (item: any) => {
    addToCart({ ...item, quantity: 1, selectedSize: 'S', selectedColor: 'DEFAULT' });
    removeFromWishlist(item.name);
    setIsCartOpen(true);
  };

  // ── Cancel Order ──────────────────────────────────────────────────────────
  const handleCancelSubmit = async () => {
    if (!cancelModal.order || !token || !user) return;
    setCancelLoading(true);
    setCancelError('');
    try {
      const res = await fetch(`${API_BASE}/refund-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Customer',
          email: user.email || `${user.phone}@guest.local`,
          phone: user.phone || '',
          orderId: cancelModal.order.orderNumber,
          requestType: 'cancel',
          cancelReason,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed to submit cancellation');

      // If auto-cancelled, update the order in the local list immediately
      if (data.orderStatus === 'cancelled') {
        setOrders(prev => prev.map(o =>
          o.orderNumber === cancelModal.order!.orderNumber ? { ...o, orderStatus: 'cancelled' } : o
        ));
      }
      setCancelModal({ open: false, order: null });
      setCancelReason('');
      fetchRequestMap();
    } catch (err: any) {
      setCancelError(err.message || 'Something went wrong.');
    } finally {
      setCancelLoading(false);
    }
  };

  // ── Return / Refund ───────────────────────────────────────────────────────
  const handleReturnSubmit = async () => {
    if (!returnModal.order || !token || !user) return;
    if (!returnReason) { setReturnError('Please select a return reason.'); return; }
    if (!returnNote.trim()) { setReturnError('Please provide additional details in the note field.'); return; }
    setReturnLoading(true);
    setReturnError('');
    try {
      const formData = new FormData();
      formData.append('name', `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Customer');
      formData.append('email', user.email || `${user.phone}@guest.local`);
      formData.append('phone', user.phone || '');
      formData.append('orderId', returnModal.order.orderNumber);
      formData.append('requestType', 'return');
      formData.append('returnReason', returnReason);
      formData.append('reason', returnNote);
      if (returnImage) {
        formData.append('proofImage', returnImage);
      }

      const res = await fetch(`${API_BASE}/refund-requests`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed to submit return request');
      setReturnModal({ open: false, order: null });
      setReturnReason('');
      setReturnNote('');
      setReturnImage(null);
      fetchRequestMap();
    } catch (err: any) {
      setReturnError(err.message || 'Something went wrong.');
    } finally {
      setReturnLoading(false);
    }
  };

  return (
    <div className="bg-surface-container-lowest text-on-surface  antialiased min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-[88px] max-w-7xl mx-auto px-6 py-12 md:py-16 w-full">
        <div className="grid lg:grid-cols-[280px_1fr] gap-12 items-start">
          
          {/* Enhanced Floating Sidebar */}
          <aside className="w-full flex flex-col shrink-0 lg:sticky lg:top-[120px]">
            {/* Profile Header Card */}
            <div className="bg-surface rounded-3xl p-8 mb-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-outline-variant/30 flex flex-col items-center relative overflow-hidden group">
              {/* Subtle background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50 pointer-events-none" />
              
              <div 
                className="w-28 h-28 rounded-full bg-surface-container flex items-center justify-center flex-shrink-0 mb-5 overflow-hidden relative cursor-pointer shadow-inner ring-4 ring-white"
                onClick={() => fileInputRef.current?.click()}
              >
                {user.profilePhoto ? (
                  <img src={`${user.profilePhoto}`} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="material-symbols-outlined text-[64px] text-primary/20">person</span>
                )}
                
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all duration-300 text-white backdrop-blur-[2px]">
                  <span className="material-symbols-outlined text-2xl">photo_camera</span>
                  <span className="text-[9px] uppercase tracking-widest font-bold mt-2">Upload</span>
                </div>
                {isUploadingPhoto && (
                  <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10 backdrop-blur-sm">
                    <span className="material-symbols-outlined animate-spin text-primary">progress_activity</span>
                  </div>
                )}
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handlePhotoChange} 
                accept="image/*" 
                className="hidden" 
              />
              <h2 className="font-light tracking-[0.2em] uppercase text-2xl text-primary text-center tracking-tight">{displayName}</h2>
              <p className="text-xs text-secondary/60 mt-1">{user.email}</p>
            </div>
            
            {/* Pill Navigation */}
            <nav className="flex flex-col gap-2 w-full">
              {[
                { id: 'orders', icon: 'shopping_bag', label: 'Order History' },
                { id: 'addresses', icon: 'location_on', label: 'Saved Addresses' },
                { id: 'details', icon: 'person', label: 'Account Details' },
                { id: 'wishlist', icon: 'favorite', label: 'My Wishlist' }
              ].map((tab) => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as Tab)} 
                  className={`flex items-center gap-4 px-6 py-4 text-sm font-medium rounded-2xl transition-all duration-300 w-full text-left ${activeTab === tab.id ? 'bg-primary text-on-primary shadow-md translate-x-1' : 'text-secondary/70 hover:bg-surface-container hover:text-primary'}`}
                >
                  <span className="material-symbols-outlined text-[20px]">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
              
              <div className="h-px w-full bg-outline-variant/50 my-4" />
              
              <button 
                onClick={handleLogout} 
                className="flex items-center gap-4 px-6 py-4 text-sm font-medium rounded-2xl transition-all duration-300 w-full text-left text-red-500 hover:bg-red-50 hover:translate-x-1"
              >
                <span className="material-symbols-outlined text-[20px]">logout</span>
                Sign Out
              </button>
            </nav>
          </aside>
 
          {/* Content Area */}
          <div className="flex-1 w-full max-w-full">
             
            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="animate-in slide-in-from-bottom-4 fade-in duration-500 w-full">
                <h1 className="text-3xl font-light tracking-[0.2em] uppercase text-primary text-center mt-6 mb-8">Order History</h1>
                
                {ordersLoading ? (
                  <div className="flex flex-col gap-6">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="bg-surface rounded-3xl border border-outline-variant/30 p-8 animate-pulse h-40 shadow-[0_4px_20px_rgb(0,0,0,0.02)]" />
                    ))}
                  </div>
                ) : ordersError ? (
                  <div className="bg-red-50 rounded-3xl p-6 border border-red-100 text-red-600 flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined">error</span>
                      <span>{ordersError}</span>
                    </div>
                    {ordersError.toLowerCase().includes('session expired') && (
                      <button 
                        onClick={() => {
                          logout(); // Clear the expired state
                          openLoginModal(() => {
                            window.location.reload(); // Reload after successful login
                          });
                        }}
                        className="bg-red-600 text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-red-700 transition-colors shadow-lg shadow-red-500/20 whitespace-nowrap"
                      >
                        Login Now
                      </button>
                    )}
                  </div>
                ) : orders.length === 0 ? (
                  <div className="bg-surface rounded-3xl border border-outline-variant/30 p-16 text-center shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex flex-col items-center">
                    <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center mb-6 text-secondary/30">
                      <span className="material-symbols-outlined text-4xl">shopping_basket</span>
                    </div>
                    <h3 className="font-light tracking-[0.2em] uppercase text-2xl text-primary mb-3">No orders yet</h3>
                    <p className="text-secondary/60 mb-8 max-w-sm">When you place an order, it will appear here so you can track its status.</p>
                    <Link to="/collection" className="bg-primary text-on-primary px-8 py-3 rounded-full text-xs font-bold tracking-widest uppercase hover:scale-105 transition-transform shadow-lg shadow-primary/20">
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  <div className="flex flex-col gap-6">
                    {orders.map((order) => {
                      const existingRequest = requestMap[order.orderNumber];
                      const isCancellable = ['pending', 'confirmed', 'processing'].includes(order.orderStatus);
                      const orderDate = new Date(order.createdAt);
                      const daysSinceOrder = (new Date().getTime() - orderDate.getTime()) / (1000 * 3600 * 24);
                      const isReturnWindowOpen = daysSinceOrder <= 7;
                      const isReturnable = order.orderStatus === 'delivered';
                      const isTerminal = ['cancelled', 'returned'].includes(order.orderStatus);

                      return (
                        <div key={order.id} className="bg-surface rounded-3xl border border-outline-variant/30 p-6 sm:p-8 shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-shadow duration-300">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-6 border-b border-outline-variant/40">
                            <div>
                              <p className="text-[10px] uppercase tracking-widest font-bold text-secondary/60 mb-1">Order #{order.orderNumber}</p>
                              <p className="text-sm text-primary font-medium">Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                              <div className={`px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-bold ${STATUS_COLORS[order.orderStatus] || STATUS_COLORS.pending}`}>
                                {order.orderStatus}
                              </div>
                              <span className="text-lg font-light tracking-[0.2em] uppercase text-primary">{currencySymbol}{Number(order.totalAmount).toLocaleString('en-IN')}</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-4 mb-5">
                            {order.items?.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-4 bg-surface-container-lowest rounded-2xl p-3 pr-6 border border-outline-variant/30">
                                <div className="w-16 h-16 rounded-xl overflow-hidden bg-surface-container">
                                  {item.product?.thumbnail ? (
                                    <img src={item.product.thumbnail} alt={item.productName} className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-secondary/30">
                                      <span className="material-symbols-outlined">inventory_2</span>
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-primary line-clamp-1">{item.productName}</p>
                                  <p className="text-xs text-secondary/70 mt-1">Qty: {item.quantity}</p>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Action Row */}
                          <div className="pt-4 border-t border-outline-variant/30 flex flex-wrap items-center gap-3">
                            <button
                              onClick={() => setOrderDetailsModal({ open: true, order })}
                              className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-brand-600 hover:text-brand-700 transition-all border border-brand-200 hover:bg-brand-50 rounded-full px-4 py-2"
                            >
                              <span className="material-symbols-outlined text-[14px]">visibility</span>
                              View Details
                            </button>

                            {existingRequest ? (
                              // Show existing request badge
                              <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold border ${REQUEST_STATUS_COLORS[existingRequest.status] || REQUEST_STATUS_COLORS.pending}`}>
                                <span className="material-symbols-outlined text-[14px]">
                                  {existingRequest.requestType === 'cancel' ? 'cancel' : 'undo'}
                                </span>
                                {REQUEST_TYPE_LABELS[existingRequest.requestType] || ''} — {REQUEST_STATUS_LABELS[existingRequest.status] || existingRequest.status}
                              </div>
                            ) : (
                              <>
                                {/* Cancel button */}
                                {isCancellable && (
                                  <button
                                    onClick={() => { setCancelModal({ open: true, order }); setCancelError(''); setCancelReason(''); }}
                                    className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-red-500 hover:text-white transition-all border border-red-200 hover:bg-red-500 rounded-full px-4 py-2"
                                  >
                                    <span className="material-symbols-outlined text-[14px]">cancel</span>
                                    Cancel Order
                                  </button>
                                )}

                                {/* Return / Refund button */}
                                {isReturnable && (
                                  <button
                                    onClick={() => { setReturnModal({ open: true, order }); setReturnError(''); setReturnReason(''); setReturnNote(''); }}
                                    disabled={!isReturnWindowOpen}
                                    title={!isReturnWindowOpen ? "Return window has closed (7 days limit)" : ""}
                                    className={`flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold border rounded-full px-4 py-2 transition-colors ${
                                      isReturnWindowOpen 
                                        ? 'text-secondary/70 hover:text-primary border-outline-variant/50 hover:border-outline-variant' 
                                        : 'text-secondary/40 border-outline-variant/20 cursor-not-allowed opacity-60'
                                    }`}
                                  >
                                    <span className="material-symbols-outlined text-[14px]">undo</span>
                                    Return / Refund
                                  </button>
                                )}

                                {/* Informational message */}
                                {!isCancellable && !isReturnable && !isTerminal && (
                                  <span className="text-[10px] text-secondary/40 italic">Actions available once delivered or if not yet shipped</span>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div className="animate-in slide-in-from-bottom-4 fade-in duration-500">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 mt-6">
                  <div className="w-full sm:w-auto text-center sm:text-left flex-1">
                    <h1 className="text-3xl font-light tracking-[0.2em] uppercase text-primary text-center">Saved Addresses</h1>
                  </div>
                  <button onClick={() => setActiveTab('details')} className="text-xs font-bold text-primary uppercase tracking-widest hover:text-secondary transition-colors underline underline-offset-4 shrink-0">
                    Edit Addresses
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { type: 'Billing', prefix: '' },
                    { type: 'Shipping', prefix: 'shipping' }
                  ].map(({ type, prefix }) => {
                    const addressKey = prefix ? `${prefix}Address` : 'address';
                    const cityKey = prefix ? `${prefix}City` : 'city';
                    const stateKey = prefix ? `${prefix}State` : 'state';
                    const zipKey = prefix ? `${prefix}ZipCode` : 'zipCode';
                    
                    const addressVal = formData[addressKey as keyof typeof formData];
                    const cityVal = formData[cityKey as keyof typeof formData];
                    const stateVal = formData[stateKey as keyof typeof formData];
                    const zipVal = formData[zipKey as keyof typeof formData];

                    return (
                      <div key={type} className="bg-surface rounded-3xl border border-outline-variant/30 p-8 shadow-[0_4px_20px_rgb(0,0,0,0.02)] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/[0.02] rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform duration-500" />
                        <h3 className="text-[10px] uppercase tracking-widest font-bold text-secondary/60 mb-6 flex items-center gap-2">
                          <span className="material-symbols-outlined text-[16px]">local_shipping</span>
                          {type} Address
                        </h3>
                        
                        <address className="not-italic text-sm text-primary leading-relaxed flex flex-col gap-1">
                          {formData.firstName || formData.lastName ? (
                            <strong className="text-lg font-light tracking-[0.2em] uppercase block mb-2">{formData.firstName} {formData.lastName}</strong>
                          ) : (
                            <span className="italic text-secondary/50">No name provided</span>
                          )}
                          
                          {addressVal ? (
                            <>
                              <span className="text-secondary">{addressVal}</span>
                              {cityVal && <span className="text-secondary">{cityVal}</span>}
                              {stateVal && <span className="text-secondary">{stateVal}, {zipVal}</span>}
                            </>
                          ) : (
                            <span className="italic block mt-4 text-secondary/40">This address hasn't been set up yet.</span>
                          )}
                        </address>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Account Details Tab */}
            {activeTab === 'details' && (
              <div className="animate-in slide-in-from-bottom-4 fade-in duration-500 max-w-3xl mx-auto">
                <h1 className="text-3xl font-light tracking-[0.2em] uppercase text-primary text-center mt-6 mb-2">Account Details</h1>
                <p className="text-sm text-secondary/70 text-center mb-8">Update your personal information and address details here.</p>

                {saveSuccess && (
                  <div className="mb-8 p-4 bg-green-50 rounded-2xl border border-green-100 text-green-700 text-sm flex items-center gap-3 animate-in fade-in">
                    <span className="material-symbols-outlined">check_circle</span>
                    Your account details were saved successfully.
                  </div>
                )}
                {saveError && (
                  <div className="mb-8 p-4 bg-red-50 rounded-2xl border border-red-100 text-red-700 text-sm flex items-center gap-3 animate-in fade-in">
                    <span className="material-symbols-outlined">error</span>
                    {saveError}
                  </div>
                )}

                <form onSubmit={handleSave} className="bg-surface rounded-3xl border border-outline-variant/30 p-8 md:p-10 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex flex-col gap-8">
                  
                  {/* Personal Info Section */}
                  <div>
                    <h3 className="text-[10px] uppercase tracking-widest font-bold text-secondary/60 mb-6">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-2 relative pt-2">
                        <input
                          type="text"
                          name="firstName"
                          id="firstName"
                          required
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="peer w-full bg-transparent border-b border-outline-variant py-2 text-primary text-sm focus:border-primary focus:outline-none transition-colors placeholder-transparent"
                          placeholder="First name"
                        />
                        <label htmlFor="firstName" className="absolute left-0 -top-3.5 text-[10px] font-bold tracking-widest uppercase text-secondary/50 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-secondary/70 peer-placeholder-shown:top-2 peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-placeholder-shown:font-normal peer-focus:-top-3.5 peer-focus:text-[10px] peer-focus:font-bold peer-focus:tracking-widest peer-focus:uppercase peer-focus:text-primary">First name *</label>
                      </div>
                      
                      <div className="flex flex-col gap-2 relative pt-2">
                        <input
                          type="text"
                          name="lastName"
                          id="lastName"
                          required
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="peer w-full bg-transparent border-b border-outline-variant py-2 text-primary text-sm focus:border-primary focus:outline-none transition-colors placeholder-transparent"
                          placeholder="Last name"
                        />
                        <label htmlFor="lastName" className="absolute left-0 -top-3.5 text-[10px] font-bold tracking-widest uppercase text-secondary/50 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-secondary/70 peer-placeholder-shown:top-2 peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-placeholder-shown:font-normal peer-focus:-top-3.5 peer-focus:text-[10px] peer-focus:font-bold peer-focus:tracking-widest peer-focus:uppercase peer-focus:text-primary">Last name *</label>
                      </div>

                      <div className="flex flex-col gap-2 relative md:col-span-2 pt-2">
                        <input
                          type="email"
                          name="email"
                          id="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          className="peer w-full bg-transparent border-b border-outline-variant py-2 text-primary text-sm focus:border-primary focus:outline-none transition-colors placeholder-transparent"
                          placeholder="Email address"
                        />
                        <label htmlFor="email" className="absolute left-0 -top-3.5 text-[10px] font-bold tracking-widest uppercase text-secondary/50 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-secondary/70 peer-placeholder-shown:top-2 peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-placeholder-shown:font-normal peer-focus:-top-3.5 peer-focus:text-[10px] peer-focus:font-bold peer-focus:tracking-widest peer-focus:uppercase peer-focus:text-primary">Email address *</label>
                      </div>

                      <div className="flex flex-col gap-2 relative md:col-span-2 pt-2">
                        <input
                          type="text"
                          value={user.phone || ''}
                          disabled
                          className="w-full bg-surface-container border border-outline-variant/50 rounded-xl px-4 py-3 text-secondary/60 text-sm cursor-not-allowed"
                        />
                        <label className="absolute left-4 -top-2 bg-surface px-1 text-[10px] font-bold tracking-widest uppercase text-secondary/50">Mobile number</label>
                      </div>
                    </div>
                  </div>

                  <div className="h-px w-full bg-outline-variant/40" />

                  {/* Billing Address Section */}
                  <div>
                    <h3 className="text-[10px] uppercase tracking-widest font-bold text-secondary/60 mb-6">Billing Address</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 gap-y-8">
                      <div className="flex flex-col gap-2 relative md:col-span-2 pt-2">
                        <input
                          type="text"
                          name="address"
                          id="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className="peer w-full bg-transparent border-b border-outline-variant py-2 text-primary text-sm focus:border-primary focus:outline-none transition-colors placeholder-transparent"
                          placeholder="Street Address"
                        />
                        <label htmlFor="address" className="absolute left-0 -top-3.5 text-[10px] font-bold tracking-widest uppercase text-secondary/50 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-secondary/70 peer-placeholder-shown:top-2 peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-placeholder-shown:font-normal peer-focus:-top-3.5 peer-focus:text-[10px] peer-focus:font-bold peer-focus:tracking-widest peer-focus:uppercase peer-focus:text-primary">Street Address</label>
                      </div>

                      <div className="flex flex-col gap-2 relative pt-2">
                        <input
                          type="text"
                          name="city"
                          id="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="peer w-full bg-transparent border-b border-outline-variant py-2 text-primary text-sm focus:border-primary focus:outline-none transition-colors placeholder-transparent"
                          placeholder="City"
                        />
                        <label htmlFor="city" className="absolute left-0 -top-3.5 text-[10px] font-bold tracking-widest uppercase text-secondary/50 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-secondary/70 peer-placeholder-shown:top-2 peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-placeholder-shown:font-normal peer-focus:-top-3.5 peer-focus:text-[10px] peer-focus:font-bold peer-focus:tracking-widest peer-focus:uppercase peer-focus:text-primary">City</label>
                      </div>

                      <div className="flex flex-col gap-2 relative pt-2">
                        <input
                          type="text"
                          name="state"
                          id="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className="peer w-full bg-transparent border-b border-outline-variant py-2 text-primary text-sm focus:border-primary focus:outline-none transition-colors placeholder-transparent"
                          placeholder="State / Province"
                        />
                        <label htmlFor="state" className="absolute left-0 -top-3.5 text-[10px] font-bold tracking-widest uppercase text-secondary/50 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-secondary/70 peer-placeholder-shown:top-2 peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-placeholder-shown:font-normal peer-focus:-top-3.5 peer-focus:text-[10px] peer-focus:font-bold peer-focus:tracking-widest peer-focus:uppercase peer-focus:text-primary">State / Province</label>
                      </div>

                      <div className="flex flex-col gap-2 relative md:col-span-2 pt-2">
                        <input
                          type="text"
                          name="zipCode"
                          id="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          className="peer w-full bg-transparent border-b border-outline-variant py-2 text-primary text-sm focus:border-primary focus:outline-none transition-colors placeholder-transparent"
                          placeholder="ZIP / Postal Code"
                        />
                        <label htmlFor="zipCode" className="absolute left-0 -top-3.5 text-[10px] font-bold tracking-widest uppercase text-secondary/50 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-secondary/70 peer-placeholder-shown:top-2 peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-placeholder-shown:font-normal peer-focus:-top-3.5 peer-focus:text-[10px] peer-focus:font-bold peer-focus:tracking-widest peer-focus:uppercase peer-focus:text-primary">ZIP / Postal Code</label>
                      </div>
                    </div>
                  </div>

                  <div className="h-px w-full bg-outline-variant/40" />

                  {/* Shipping Address Section */}
                  <div>
                    <h3 className="text-[10px] uppercase tracking-widest font-bold text-secondary/60 mb-6">Shipping Address</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 gap-y-8">
                      <div className="flex flex-col gap-2 relative md:col-span-2 pt-2">
                        <input
                          type="text"
                          name="shippingAddress"
                          id="shippingAddress"
                          value={formData.shippingAddress}
                          onChange={handleInputChange}
                          className="peer w-full bg-transparent border-b border-outline-variant py-2 text-primary text-sm focus:border-primary focus:outline-none transition-colors placeholder-transparent"
                          placeholder="Street Address"
                        />
                        <label htmlFor="shippingAddress" className="absolute left-0 -top-3.5 text-[10px] font-bold tracking-widest uppercase text-secondary/50 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-secondary/70 peer-placeholder-shown:top-2 peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-placeholder-shown:font-normal peer-focus:-top-3.5 peer-focus:text-[10px] peer-focus:font-bold peer-focus:tracking-widest peer-focus:uppercase peer-focus:text-primary">Street Address</label>
                      </div>

                      <div className="flex flex-col gap-2 relative pt-2">
                        <input
                          type="text"
                          name="shippingCity"
                          id="shippingCity"
                          value={formData.shippingCity}
                          onChange={handleInputChange}
                          className="peer w-full bg-transparent border-b border-outline-variant py-2 text-primary text-sm focus:border-primary focus:outline-none transition-colors placeholder-transparent"
                          placeholder="City"
                        />
                        <label htmlFor="shippingCity" className="absolute left-0 -top-3.5 text-[10px] font-bold tracking-widest uppercase text-secondary/50 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-secondary/70 peer-placeholder-shown:top-2 peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-placeholder-shown:font-normal peer-focus:-top-3.5 peer-focus:text-[10px] peer-focus:font-bold peer-focus:tracking-widest peer-focus:uppercase peer-focus:text-primary">City</label>
                      </div>

                      <div className="flex flex-col gap-2 relative pt-2">
                        <input
                          type="text"
                          name="shippingState"
                          id="shippingState"
                          value={formData.shippingState}
                          onChange={handleInputChange}
                          className="peer w-full bg-transparent border-b border-outline-variant py-2 text-primary text-sm focus:border-primary focus:outline-none transition-colors placeholder-transparent"
                          placeholder="State / Province"
                        />
                        <label htmlFor="shippingState" className="absolute left-0 -top-3.5 text-[10px] font-bold tracking-widest uppercase text-secondary/50 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-secondary/70 peer-placeholder-shown:top-2 peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-placeholder-shown:font-normal peer-focus:-top-3.5 peer-focus:text-[10px] peer-focus:font-bold peer-focus:tracking-widest peer-focus:uppercase peer-focus:text-primary">State / Province</label>
                      </div>

                      <div className="flex flex-col gap-2 relative md:col-span-2 pt-2">
                        <input
                          type="text"
                          name="shippingZipCode"
                          id="shippingZipCode"
                          value={formData.shippingZipCode}
                          onChange={handleInputChange}
                          className="peer w-full bg-transparent border-b border-outline-variant py-2 text-primary text-sm focus:border-primary focus:outline-none transition-colors placeholder-transparent"
                          placeholder="ZIP / Postal Code"
                        />
                        <label htmlFor="shippingZipCode" className="absolute left-0 -top-3.5 text-[10px] font-bold tracking-widest uppercase text-secondary/50 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-secondary/70 peer-placeholder-shown:top-2 peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-placeholder-shown:font-normal peer-focus:-top-3.5 peer-focus:text-[10px] peer-focus:font-bold peer-focus:tracking-widest peer-focus:uppercase peer-focus:text-primary">ZIP / Postal Code</label>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 flex justify-end">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="bg-primary text-on-primary px-10 py-4 rounded-full text-xs tracking-widest uppercase font-bold hover:scale-105 transition-transform shadow-lg shadow-primary/20 disabled:opacity-50 disabled:hover:scale-100"
                    >
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === 'wishlist' && (
              <div className="animate-in slide-in-from-bottom-4 fade-in duration-500 w-full">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 mt-6">
                  <div className="w-full sm:w-auto text-center sm:text-left flex-1">
                    <h1 className="text-3xl font-light tracking-[0.2em] uppercase text-primary text-center">My Wishlist</h1>
                  </div>
                  <span className="text-xs font-bold text-secondary/50 uppercase tracking-widest shrink-0">{wishlistItems.length} Items</span>
                </div>

                {wishlistItems.length === 0 ? (
                  <div className="bg-surface rounded-3xl border border-outline-variant/30 p-16 text-center shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex flex-col items-center">
                    <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center mb-6 text-secondary/30">
                      <span className="material-symbols-outlined text-4xl">favorite_border</span>
                    </div>
                    <h3 className="font-light tracking-[0.2em] uppercase text-2xl text-primary mb-3">Your wishlist is empty</h3>
                    <p className="text-secondary/60 mb-8 max-w-sm">Save your favorite pieces here to easily find them later or add them to your cart.</p>
                    <Link to="/product-category/all" className="bg-primary text-on-primary px-8 py-3 rounded-full text-xs font-bold tracking-widest uppercase hover:scale-105 transition-transform shadow-lg shadow-primary/20">
                      Discover Pieces
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                    {wishlistItems.map((item) => (
                      <div key={item.id} className="group flex flex-col relative overflow-hidden rounded-3xl bg-surface border border-outline-variant/30 shadow-sm hover:shadow-xl transition-all duration-500">
                        {/* Remove Button */}
                        <button 
                          onClick={() => removeFromWishlist(item.name)}
                          className="absolute top-4 right-4 w-10 h-10 bg-surface/80 backdrop-blur-md rounded-full flex items-center justify-center text-secondary/70 hover:text-red-500 hover:bg-white z-10 shadow-sm transition-colors opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
                        >
                          <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                        
                        {/* Image / Video */}
                        <Link to={`/product-category/${item.categorySlug || 'all'}/${item.slug || item.id}`} className="aspect-[3/4] overflow-hidden bg-surface-container block">
                          {isVideo(item.imageSrc) ? (
                            <video
                              src={item.imageSrc}
                              autoPlay
                              loop
                              muted
                              playsInline
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                            />
                          ) : (
                            <img 
                              src={item.imageSrc} 
                              alt={item.name} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                            />
                          )}
                        </Link>
                        
                        {/* Content */}
                        <div className="p-6 flex flex-col items-center text-center gap-2 relative bg-surface">
                          <h3 className="text-sm font-medium text-primary line-clamp-1">{item.name}</h3>
                          <p className="text-sm text-secondary/80 mb-2">{item.price}</p>
                          
                          <button 
                            onClick={() => handleWishlistToCart(item)}
                            className="w-full py-3 rounded-xl bg-primary text-on-primary text-[10px] uppercase tracking-widest font-bold hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
                          >
                            <span className="material-symbols-outlined text-[16px]">shopping_bag</span>
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
          </div>
        </div>
      </main>

      <Footer />

      {/* ── Cancel Order Modal ─────────────────────────────────────────────── */}
      {cancelModal.open && cancelModal.order && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setCancelModal({ open: false, order: null })}>
          <div className="bg-surface rounded-3xl shadow-2xl p-8 max-w-md w-full" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-red-500">remove_shopping_cart</span>
              </div>
              <div>
                <h3 className="font-light tracking-[0.2em] uppercase text-lg text-primary">Cancel Order</h3>
                <p className="text-xs text-secondary/60 mt-0.5">#{cancelModal.order.orderNumber}</p>
              </div>
            </div>

            {cancelModal.order.orderStatus === 'pending' ? (
              <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
                <p className="text-xs text-amber-700 leading-relaxed">
                  <strong>Heads up:</strong> This will immediately cancel your order since it hasn't been confirmed yet. Your refund (if paid online) will be processed within 5–7 business days.
                </p>
              </div>
            ) : (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-2xl">
                <p className="text-xs text-blue-700 leading-relaxed">
                  Your order is currently <strong>{cancelModal.order.orderStatus}</strong>. A cancellation request will be submitted for admin review, and our team will contact you shortly.
                </p>
              </div>
            )}

            <div className="mb-6">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-secondary/60 mb-2">Reason for cancellation (optional)</label>
              <textarea
                rows={3}
                value={cancelReason}
                onChange={e => setCancelReason(e.target.value)}
                placeholder="Let us know why you want to cancel..."
                className="w-full border border-outline-variant rounded-xl px-4 py-3 text-sm text-primary focus:outline-none focus:border-primary transition-colors resize-none placeholder-secondary/30"
              />
            </div>

            {cancelError && (
              <p className="mb-4 text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{cancelError}</p>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setCancelModal({ open: false, order: null })}
                className="flex-1 py-3 rounded-full border border-outline-variant text-sm font-medium text-secondary hover:bg-surface-container transition-colors"
              >
                Keep Order
              </button>
              <button
                onClick={handleCancelSubmit}
                disabled={cancelLoading}
                className="flex-1 py-3 rounded-full bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cancelLoading ? 'Processing...' : 'Confirm Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Return / Refund Modal ──────────────────────────────────────────── */}
      {returnModal.open && returnModal.order && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setReturnModal({ open: false, order: null })}>
          <div className="bg-surface rounded-3xl shadow-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-indigo-500">undo</span>
              </div>
              <div>
                <h3 className="font-light tracking-[0.2em] uppercase text-lg text-primary">Return / Refund</h3>
                <p className="text-xs text-secondary/60 mt-0.5">#{returnModal.order.orderNumber}</p>
              </div>
            </div>

            <div className="mb-6 p-4 bg-indigo-50 border border-indigo-200 rounded-2xl">
              <p className="text-xs text-indigo-700 leading-relaxed">
                Returns are accepted within <strong>7 days of delivery</strong>. Our team will review your request and contact you within 3–5 business days.
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-secondary/60 mb-3">Reason for return <span className="text-red-400">*</span></label>
              <div className="grid grid-cols-1 gap-2">
                {RETURN_REASONS.map(reason => (
                  <button
                    key={reason.value}
                    type="button"
                    onClick={() => setReturnReason(reason.value)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium text-left transition-all ${
                      returnReason === reason.value
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-outline-variant text-secondary/70 hover:border-primary/50 hover:text-primary'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">{reason.icon}</span>
                    {reason.label}
                    {returnReason === reason.value && (
                      <span className="ml-auto material-symbols-outlined text-[16px] text-primary">check_circle</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-secondary/60 mb-2">Additional notes <span className="text-red-400">*</span></label>
              <textarea
                rows={3}
                required
                value={returnNote}
                onChange={e => setReturnNote(e.target.value)}
                placeholder="Any additional details about the issue..."
                className="w-full border border-outline-variant rounded-xl px-4 py-3 text-sm text-primary focus:outline-none focus:border-primary transition-colors resize-none placeholder-secondary/30"
              />
            </div>

            <div className="mb-6">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-secondary/60 mb-2">Proof Image (Optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={e => setReturnImage(e.target.files && e.target.files[0] ? e.target.files[0] : null)}
                className="w-full border border-outline-variant rounded-xl px-4 py-3 text-sm text-secondary/70 file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-surface-container file:text-primary hover:file:bg-outline-variant/30 transition-colors cursor-pointer"
              />
            </div>

            {returnError && (
              <p className="mb-4 text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{returnError}</p>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setReturnModal({ open: false, order: null })}
                className="flex-1 py-3 rounded-full border border-outline-variant text-sm font-medium text-secondary hover:bg-surface-container transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReturnSubmit}
                disabled={returnLoading}
                className="flex-1 py-3 rounded-full bg-primary text-on-primary text-sm font-bold hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {returnLoading ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ── Order Details Modal ────────────────────────────────────────────── */}
      {orderDetailsModal.open && orderDetailsModal.order && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setOrderDetailsModal({ open: false, order: null })}>
          <div className="bg-surface rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-outline-variant/30 flex items-center justify-between sticky top-0 bg-surface z-10">
              <div>
                <h3 className="font-light tracking-[0.2em] uppercase text-lg text-primary">Order Details</h3>
                <p className="text-xs text-secondary/60 mt-0.5 font-mono">#{orderDetailsModal.order.orderNumber}</p>
              </div>
              <button 
                onClick={() => setOrderDetailsModal({ open: false, order: null })}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-container text-secondary hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            
            <div className="p-6 space-y-8">
              {/* Order Status & Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-surface-container/50 p-4 rounded-2xl">
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-secondary/50 mb-1">Date</p>
                  <p className="text-sm font-medium text-primary">{new Date(orderDetailsModal.order.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-secondary/50 mb-1">Status</p>
                  <p className={`text-xs font-bold uppercase tracking-wider ${orderDetailsModal.order.orderStatus === 'delivered' ? 'text-green-600' : 'text-primary'}`}>
                    {orderDetailsModal.order.orderStatus}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-secondary/50 mb-1">Payment</p>
                  <p className="text-sm font-medium text-primary capitalize">{orderDetailsModal.order.paymentStatus}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-secondary/50 mb-1">Total</p>
                  <p className="text-sm font-bold text-primary">{currencySymbol}{Number(orderDetailsModal.order.totalAmount).toLocaleString('en-IN')}</p>
                </div>
              </div>

              {/* Items */}
              <div>
                <h4 className="text-[11px] uppercase tracking-[0.15em] font-bold text-secondary mb-4">Items Ordered</h4>
                <div className="space-y-3">
                  {orderDetailsModal.order.items?.map((item: any, idx: number) => (
                    <div key={idx} className="flex gap-4 p-3 rounded-2xl border border-outline-variant/30">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-surface-container shrink-0">
                        {item.product?.thumbnail ? (
                          <img src={item.product.thumbnail} alt={item.productName} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-secondary/30">
                            <span className="material-symbols-outlined">inventory_2</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-primary truncate">{item.productName}</p>
                        <p className="text-xs text-secondary/70 mt-1">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-primary">{currencySymbol}{(Number(item.price || item.unitPrice || 0) * item.quantity).toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-5">
                <h4 className="text-[11px] uppercase tracking-[0.15em] font-bold text-secondary mb-4">Order Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-secondary">
                    <span>Subtotal</span>
                    <span>{currencySymbol}{Number((orderDetailsModal.order as any).subtotal || orderDetailsModal.order.totalAmount).toLocaleString('en-IN')}</span>
                  </div>
                  {Number((orderDetailsModal.order as any).shippingCost) > 0 && (
                    <div className="flex justify-between text-secondary">
                      <span>Shipping</span>
                      <span>{currencySymbol}{Number((orderDetailsModal.order as any).shippingCost).toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  {Number((orderDetailsModal.order as any).taxAmount) > 0 && (
                    <div className="flex justify-between text-secondary">
                      <span>Tax</span>
                      <span>{currencySymbol}{Number((orderDetailsModal.order as any).taxAmount).toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  {Number((orderDetailsModal.order as any).discountAmount) > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-{currencySymbol}{Number((orderDetailsModal.order as any).discountAmount).toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="pt-3 mt-3 border-t border-outline-variant/30 flex justify-between font-bold text-primary text-base">
                    <span>Total</span>
                    <span>{currencySymbol}{Number(orderDetailsModal.order.totalAmount).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Addresses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {((orderDetailsModal.order as any).shippingAddress) && (
                  <div>
                    <h4 className="text-[11px] uppercase tracking-[0.15em] font-bold text-secondary mb-3 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px]">local_shipping</span>
                      Shipping Address
                    </h4>
                    <address className="not-italic text-sm text-secondary leading-relaxed bg-surface-container/30 p-4 rounded-2xl">
                      <span className="font-medium text-primary block mb-1">
                        {(orderDetailsModal.order as any).shippingAddress.name}
                      </span>
                      {(orderDetailsModal.order as any).shippingAddress.street}<br />
                      {(orderDetailsModal.order as any).shippingAddress.city}, {(orderDetailsModal.order as any).shippingAddress.state} {(orderDetailsModal.order as any).shippingAddress.zip}<br />
                      {(orderDetailsModal.order as any).shippingAddress.country}
                    </address>
                  </div>
                )}
                {((orderDetailsModal.order as any).billingAddress) && (
                  <div>
                    <h4 className="text-[11px] uppercase tracking-[0.15em] font-bold text-secondary mb-3 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px]">receipt_long</span>
                      Billing Address
                    </h4>
                    <address className="not-italic text-sm text-secondary leading-relaxed bg-surface-container/30 p-4 rounded-2xl">
                      <span className="font-medium text-primary block mb-1">
                        {(orderDetailsModal.order as any).billingAddress.name}
                      </span>
                      {(orderDetailsModal.order as any).billingAddress.street}<br />
                      {(orderDetailsModal.order as any).billingAddress.city}, {(orderDetailsModal.order as any).billingAddress.state} {(orderDetailsModal.order as any).billingAddress.zip}<br />
                      {(orderDetailsModal.order as any).billingAddress.country}
                    </address>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-4 border-t border-outline-variant/30 flex justify-end sticky bottom-0 bg-surface z-10">
              <button
                onClick={() => setOrderDetailsModal({ open: false, order: null })}
                className="px-6 py-2.5 bg-primary text-on-primary text-xs font-bold tracking-widest uppercase hover:bg-black transition-colors rounded-full"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
