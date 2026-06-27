import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

import { Footer } from '../../components/Footer/Footer';
import { Navbar } from '../../components/Navbar/Navbar';
import { getUserOrders, updateUserProfile, uploadProfilePhoto } from '../../services/userAuthService';

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

export function ProfilePage() {
  const { user, token, isAuthenticated, logout, updateUser } = useAuth();
  const { wishlistItems, removeFromWishlist, addToCart, setIsCartOpen } = useCart();

  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<Tab>(location.state?.activeTab || 'orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState('');
  
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

  // Fetch orders on mount
  useEffect(() => {
    if (!token || !isAuthenticated) return;
    setOrdersLoading(true);
    getUserOrders(token)
      .then((data) => setOrders(data || []))
      .catch((err) => setOrdersError(err.message || 'Failed to load orders'))
      .finally(() => setOrdersLoading(false));
  }, [token, isAuthenticated]);

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

  return (
    <div className="bg-surface-container-lowest text-on-surface font-body-md antialiased min-h-screen flex flex-col">
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
              <h2 className="font-headline-md text-2xl text-primary text-center tracking-tight">{displayName}</h2>
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
                <h1 className="text-3xl font-headline-md text-primary mb-8">Order History</h1>
                
                {ordersLoading ? (
                  <div className="flex flex-col gap-6">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="bg-surface rounded-3xl border border-outline-variant/30 p-8 animate-pulse h-40 shadow-[0_4px_20px_rgb(0,0,0,0.02)]" />
                    ))}
                  </div>
                ) : ordersError ? (
                  <div className="bg-red-50 rounded-3xl p-6 border border-red-100 text-red-600 flex items-center gap-3">
                    <span className="material-symbols-outlined">error</span>
                    {ordersError}
                  </div>
                ) : orders.length === 0 ? (
                  <div className="bg-surface rounded-3xl border border-outline-variant/30 p-16 text-center shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex flex-col items-center">
                    <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center mb-6 text-secondary/30">
                      <span className="material-symbols-outlined text-4xl">shopping_basket</span>
                    </div>
                    <h3 className="font-headline-md text-2xl text-primary mb-3">No orders yet</h3>
                    <p className="text-secondary/60 mb-8 max-w-sm">When you place an order, it will appear here so you can track its status.</p>
                    <Link to="/collection" className="bg-primary text-on-primary px-8 py-3 rounded-full text-xs font-bold tracking-widest uppercase hover:scale-105 transition-transform shadow-lg shadow-primary/20">
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  <div className="flex flex-col gap-6">
                    {orders.map((order) => (
                      <div key={order.id} className="bg-surface rounded-3xl border border-outline-variant/30 p-6 sm:p-8 shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-shadow duration-300">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-6 border-b border-outline-variant/40">
                          <div>
                            <p className="text-[10px] uppercase tracking-widest font-bold text-secondary/60 mb-1">Order #{order.orderNumber}</p>
                            <p className="text-sm text-primary font-medium">Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className={`px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-bold ${STATUS_COLORS[order.orderStatus] || STATUS_COLORS.pending}`}>
                              {order.orderStatus}
                            </div>
                            <span className="text-lg font-headline-md text-primary">₹{Number(order.totalAmount).toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-4">
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
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div className="animate-in slide-in-from-bottom-4 fade-in duration-500">
                <div className="flex justify-between items-end mb-8">
                  <h1 className="text-3xl font-headline-md text-primary">Saved Addresses</h1>
                  <button onClick={() => setActiveTab('details')} className="text-xs font-bold text-primary uppercase tracking-widest hover:text-secondary transition-colors underline underline-offset-4">
                    Edit Addresses
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {['Billing', 'Shipping'].map((type) => (
                    <div key={type} className="bg-surface rounded-3xl border border-outline-variant/30 p-8 shadow-[0_4px_20px_rgb(0,0,0,0.02)] relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/[0.02] rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform duration-500" />
                      <h3 className="text-[10px] uppercase tracking-widest font-bold text-secondary/60 mb-6 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px]">local_shipping</span>
                        {type} Address
                      </h3>
                      
                      <address className="not-italic text-sm text-primary leading-relaxed flex flex-col gap-1">
                        {formData.firstName || formData.lastName ? (
                          <strong className="text-lg font-headline-md block mb-2">{formData.firstName} {formData.lastName}</strong>
                        ) : (
                          <span className="italic text-secondary/50">No name provided</span>
                        )}
                        
                        {formData.address ? (
                          <>
                            <span className="text-secondary">{formData.address}</span>
                            {formData.city && <span className="text-secondary">{formData.city}</span>}
                            {formData.state && <span className="text-secondary">{formData.state}, {formData.zipCode}</span>}
                          </>
                        ) : (
                          <span className="italic block mt-4 text-secondary/40">This address hasn't been set up yet.</span>
                        )}
                      </address>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Account Details Tab */}
            {activeTab === 'details' && (
              <div className="animate-in slide-in-from-bottom-4 fade-in duration-500 max-w-3xl">
                <h1 className="text-3xl font-headline-md text-primary mb-2">Account Details</h1>
                <p className="text-sm text-secondary/70 mb-8">Update your personal information and address details here.</p>

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

                  {/* Address Section */}
                  <div>
                    <h3 className="text-[10px] uppercase tracking-widest font-bold text-secondary/60 mb-6">Address Details</h3>
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
                <div className="flex justify-between items-end mb-8">
                  <h1 className="text-3xl font-headline-md text-primary">My Wishlist</h1>
                  <span className="text-xs font-bold text-secondary/50 uppercase tracking-widest">{wishlistItems.length} Items</span>
                </div>

                {wishlistItems.length === 0 ? (
                  <div className="bg-surface rounded-3xl border border-outline-variant/30 p-16 text-center shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex flex-col items-center">
                    <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center mb-6 text-secondary/30">
                      <span className="material-symbols-outlined text-4xl">favorite_border</span>
                    </div>
                    <h3 className="font-headline-md text-2xl text-primary mb-3">Your wishlist is empty</h3>
                    <p className="text-secondary/60 mb-8 max-w-sm">Save your favorite pieces here to easily find them later or add them to your cart.</p>
                    <Link to="/collection" className="bg-primary text-on-primary px-8 py-3 rounded-full text-xs font-bold tracking-widest uppercase hover:scale-105 transition-transform shadow-lg shadow-primary/20">
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
                        
                        {/* Image */}
                        <Link to={`/product/${item.id}`} className="aspect-[3/4] overflow-hidden bg-surface-container block">
                          <img 
                            src={item.imageSrc} 
                            alt={item.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                          />
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
    </div>
  );
}
