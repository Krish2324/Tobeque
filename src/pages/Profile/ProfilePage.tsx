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

  const initials = user.firstName
    ? `${user.firstName[0]}${user.lastName ? user.lastName[0] : ''}`.toUpperCase()
    : 'TQ';

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
    <div className="bg-[#FAFAF8] text-on-background font-body-md antialiased min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-[72px] max-w-7xl mx-auto px-6 py-12 md:py-16 w-full">
        <div className="flex flex-col md:flex-row gap-8 bg-white border border-outline-variant/60 shadow-sm min-h-[600px]">
          
          {/* Sidebar */}
          <aside className="w-full md:w-64 border-r border-outline-variant/60 flex flex-col shrink-0">
            <div className="p-8 flex flex-col items-center border-b border-outline-variant/60 relative">
              <div 
                className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 mb-4 overflow-hidden relative group cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                {user.profilePhoto ? (
                  <img src={`http://localhost:5000${user.profilePhoto}`} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="material-symbols-outlined text-[64px] text-white">person</span>
                )}
                
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity text-white">
                  <span className="material-symbols-outlined text-xl">photo_camera</span>
                  <span className="text-[10px] uppercase font-medium mt-1">Upload</span>
                </div>
                {isUploadingPhoto && (
                  <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
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
              <h2 className="font-serif text-xl text-[#111] text-center break-words">{displayName}</h2>
            </div>
            
            <nav className="flex flex-col py-4 w-full">

              <button 
                onClick={() => setActiveTab('orders')} 
                className={`flex items-center gap-3 px-8 py-4 text-sm font-medium transition-colors w-full text-left ${activeTab === 'orders' ? 'bg-gray-100 text-[#111] border-l-4 border-[#111]' : 'text-gray-500 hover:bg-gray-50 border-l-4 border-transparent'}`}
              >
                <span className="material-symbols-outlined text-xl">shopping_cart</span>
                Orders
              </button>
              <button 
                onClick={() => setActiveTab('addresses')} 
                className={`flex items-center gap-3 px-8 py-4 text-sm font-medium transition-colors w-full text-left ${activeTab === 'addresses' ? 'bg-gray-100 text-[#111] border-l-4 border-[#111]' : 'text-gray-500 hover:bg-gray-50 border-l-4 border-transparent'}`}
              >
                <span className="material-symbols-outlined text-xl">location_on</span>
                Addresses
              </button>
              <button 
                onClick={() => setActiveTab('details')} 
                className={`flex items-center gap-3 px-8 py-4 text-sm font-medium transition-colors w-full text-left ${activeTab === 'details' ? 'bg-gray-100 text-[#111] border-l-4 border-[#111]' : 'text-gray-500 hover:bg-gray-50 border-l-4 border-transparent'}`}
              >
                <span className="material-symbols-outlined text-xl">person</span>
                Account details
              </button>
              <button 
                onClick={() => setActiveTab('wishlist')} 
                className={`flex items-center gap-3 px-8 py-4 text-sm font-medium transition-colors w-full text-left ${activeTab === 'wishlist' ? 'bg-gray-100 text-[#111] border-l-4 border-[#111]' : 'text-gray-500 hover:bg-gray-50 border-l-4 border-transparent'}`}
              >
                <span className="material-symbols-outlined text-xl">favorite</span>
                Wishlist
              </button>
              <button 
                onClick={handleLogout} 
                className="flex items-center gap-3 px-8 py-4 text-sm font-medium transition-colors w-full text-left text-gray-500 hover:bg-red-50 hover:text-red-600 border-l-4 border-transparent"
              >
                <span className="material-symbols-outlined text-xl">logout</span>
                Log out
              </button>
            </nav>
          </aside>

          {/* Content Area */}
          <div className="flex-1 p-8 md:p-12 w-full max-w-full overflow-hidden">
            


            {/* Orders */}
            {activeTab === 'orders' && (
              <div className="animate-in fade-in duration-300 w-full">
                {ordersLoading ? (
                  <div className="flex flex-col gap-4">
                    {[1, 2].map((i) => (
                      <div key={i} className="bg-gray-50 border border-outline-variant/60 p-6 animate-pulse h-28" />
                    ))}
                  </div>
                ) : ordersError ? (
                  <div className="bg-red-50 p-6 border border-red-200 text-red-600">{ordersError}</div>
                ) : orders.length === 0 ? (
                  <div className="bg-gray-50 border border-outline-variant/60 p-12 text-center">
                    <div className="inline-flex w-16 h-16 bg-white items-center justify-center rounded-full mb-4 shadow-sm border border-gray-200">
                      <span className="material-symbols-outlined text-gray-400 text-3xl">shopping_bag</span>
                    </div>
                    <h3 className="font-serif text-xl text-[#111] mb-2">No orders has been made yet.</h3>
                    <Link to="/collection" className="inline-block mt-4 bg-[#111] text-white px-8 py-3 text-xs tracking-widest uppercase hover:bg-gray-800 transition-colors">
                      Browse Products
                    </Link>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                      <thead>
                        <tr className="border-b border-outline-variant/60 text-gray-500 font-medium">
                          <th className="pb-4 pr-6">Order</th>
                          <th className="pb-4 pr-6">Date</th>
                          <th className="pb-4 pr-6">Status</th>
                          <th className="pb-4">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr key={order.id} className="border-b border-outline-variant/60 hover:bg-gray-50 transition-colors">
                            <td className="py-4 pr-6 font-medium text-[#111]">#{order.orderNumber}</td>
                            <td className="py-4 pr-6 text-gray-600">
                              {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </td>
                            <td className="py-4 pr-6">
                              <span className={`px-2 py-1 text-[10px] uppercase tracking-wider font-medium rounded-sm ${STATUS_COLORS[order.orderStatus] || STATUS_COLORS.pending}`}>
                                {order.orderStatus}
                              </span>
                            </td>
                            <td className="py-4 text-gray-600">
                              ₹{Number(order.totalAmount).toLocaleString('en-IN')} for {order.items?.length || 0} items
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Addresses */}
            {activeTab === 'addresses' && (
              <div className="animate-in fade-in duration-300">
                <p className="text-gray-600 mb-8">The following addresses will be used on the checkout page by default.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-serif text-lg text-[#111] border-b border-outline-variant/60 pb-2 mb-4">Billing address</h3>
                    <button onClick={() => setActiveTab('details')} className="text-xs font-medium text-[#111] uppercase tracking-wider underline underline-offset-4 hover:text-gray-600 mb-4 block">Edit</button>
                    <address className="not-italic text-sm text-gray-600 leading-relaxed">
                      {formData.firstName || formData.lastName ? <strong className="text-[#111] block mb-1">{formData.firstName} {formData.lastName}</strong> : <span className="italic">No name provided</span>}
                      {formData.address ? (
                        <>
                          {formData.address}<br />
                          {formData.city && <>{formData.city}<br /></>}
                          {formData.state && <>{formData.state} {formData.zipCode}<br /></>}
                        </>
                      ) : (
                        <span className="italic block mt-2 text-gray-400">You have not set up this type of address yet.</span>
                      )}
                    </address>
                  </div>
                  <div>
                    <h3 className="font-serif text-lg text-[#111] border-b border-outline-variant/60 pb-2 mb-4">Shipping address</h3>
                    <button onClick={() => setActiveTab('details')} className="text-xs font-medium text-[#111] uppercase tracking-wider underline underline-offset-4 hover:text-gray-600 mb-4 block">Edit</button>
                    <address className="not-italic text-sm text-gray-600 leading-relaxed">
                      {formData.firstName || formData.lastName ? <strong className="text-[#111] block mb-1">{formData.firstName} {formData.lastName}</strong> : <span className="italic">No name provided</span>}
                      {formData.address ? (
                        <>
                          {formData.address}<br />
                          {formData.city && <>{formData.city}<br /></>}
                          {formData.state && <>{formData.state} {formData.zipCode}<br /></>}
                        </>
                      ) : (
                        <span className="italic block mt-2 text-gray-400">You have not set up this type of address yet.</span>
                      )}
                    </address>
                  </div>
                </div>
              </div>
            )}

            {/* Account Details */}
            {activeTab === 'details' && (
              <div className="animate-in fade-in duration-300 max-w-2xl">
                {saveSuccess && (
                  <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 text-sm">
                    Account details changed successfully.
                  </div>
                )}
                {saveError && (
                  <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
                    {saveError}
                  </div>
                )}
                <form onSubmit={handleSave} className="flex flex-col gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-medium text-[#111]">First name *</label>
                      <input
                        type="text"
                        name="firstName"
                        required
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="px-4 py-3 border border-outline-variant focus:border-[#111] focus:outline-none text-sm transition-colors"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-medium text-[#111]">Last name *</label>
                      <input
                        type="text"
                        name="lastName"
                        required
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="px-4 py-3 border border-outline-variant focus:border-[#111] focus:outline-none text-sm transition-colors"
                      />
                    </div>
                    <div className="flex flex-col gap-2 md:col-span-2">
                      <label className="text-xs font-medium text-[#111]">Email address *</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="px-4 py-3 border border-outline-variant focus:border-[#111] focus:outline-none text-sm transition-colors"
                      />
                    </div>
                    <div className="flex flex-col gap-2 md:col-span-2">
                      <label className="text-xs font-medium text-[#111]">Mobile number <span className="text-gray-400 font-normal">(Read Only)</span></label>
                      <input
                        type="text"
                        value={user.phone}
                        disabled
                        className="px-4 py-3 border border-gray-100 bg-gray-50 text-gray-500 text-sm cursor-not-allowed"
                      />
                    </div>
                    <div className="flex flex-col gap-2 md:col-span-2 pt-4 border-t border-outline-variant/60">
                      <label className="text-xs font-medium text-[#111]">Street Address</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="px-4 py-3 border border-outline-variant focus:border-[#111] focus:outline-none text-sm transition-colors"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-medium text-[#111]">City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="px-4 py-3 border border-outline-variant focus:border-[#111] focus:outline-none text-sm transition-colors"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-medium text-[#111]">State</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="px-4 py-3 border border-outline-variant focus:border-[#111] focus:outline-none text-sm transition-colors"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-medium text-[#111]">ZIP / Postal Code</label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        className="px-4 py-3 border border-outline-variant focus:border-[#111] focus:outline-none text-sm transition-colors"
                      />
                    </div>
                  </div>
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="bg-[#111] text-white px-8 py-4 text-xs tracking-widest uppercase font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
                    >
                      {isSaving ? 'Saving...' : 'Save changes'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Wishlist */}
            {activeTab === 'wishlist' && (
              <div className="animate-in fade-in duration-300">
                {wishlistItems.length === 0 ? (
                  <div className="bg-gray-50 border border-outline-variant/60 p-12 text-center">
                    <div className="inline-flex w-16 h-16 bg-white items-center justify-center rounded-full mb-4 shadow-sm border border-gray-200">
                      <span className="material-symbols-outlined text-gray-400 text-3xl">favorite_border</span>
                    </div>
                    <h3 className="font-serif text-xl text-[#111] mb-2">Your wishlist is currently empty.</h3>
                    <Link to="/collection" className="inline-block mt-4 bg-[#111] text-white px-8 py-3 text-xs tracking-widest uppercase hover:bg-gray-800 transition-colors">
                      Browse Products
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlistItems.map((item) => (
                      <div key={item.id} className="group flex flex-col border border-outline-variant/60 bg-white hover:border-[#111] transition-all overflow-hidden relative">
                        <button 
                          onClick={() => removeFromWishlist(item.name)}
                          className="absolute top-2 right-2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center text-gray-500 hover:text-red-500 hover:bg-white z-10"
                        >
                          <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                        <div className="aspect-[3/4] overflow-hidden bg-gray-50">
                          <img src={item.imageSrc} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="p-4 flex flex-col gap-2">
                          <h3 className="text-sm font-medium text-[#111] truncate">{item.name}</h3>
                          <p className="text-sm text-gray-600">{item.price}</p>
                          <button 
                            onClick={() => handleWishlistToCart(item)}
                            className="mt-2 w-full py-2 border border-[#111] text-[#111] text-xs uppercase tracking-wider font-medium hover:bg-[#111] hover:text-white transition-colors"
                          >
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
