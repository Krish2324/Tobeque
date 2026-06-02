import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { getUserOrders, updateUserProfile } from '../../services/userAuthService';
import { Footer } from '../../components/Footer/Footer';

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

type Tab = 'orders' | 'details';

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
  const { user, token, isAuthenticated, logout, openLoginModal, updateUser } = useAuth();
  const { setIsCartOpen } = useCart();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState('');
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    gender: '',
    sizePreference: '',
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
        sizePreference: user.sizePreference || '',
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
      setIsEditing(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setSaveError(err.message || 'Failed to update profile details.');
    } finally {
      setIsSaving(false);
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

  const displayName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Enter your name';

  const initials = user.firstName
    ? `${user.firstName[0]}${user.lastName ? user.lastName[0] : ''}`.toUpperCase()
    : 'TQ';

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <div className="bg-[#FAFAF8] text-on-background font-body-md antialiased overflow-x-hidden min-h-screen">
      {/* Header */}
      <header className="bg-white fixed top-0 w-full z-50 border-b border-outline-variant">
        <div className="flex justify-between items-center w-full px-outer-margin py-4 max-w-full mx-auto">
          <nav className="hidden md:flex items-center gap-6">
            <Link className="text-on-surface-variant hover:text-primary transition-colors font-label-caps text-label-caps" to="/">Shop</Link>
            <Link className="text-on-surface-variant hover:text-primary transition-all font-label-caps text-label-caps border-b-2 border-transparent hover:border-primary pb-1" to="/">New Arrivals</Link>
            <Link className="text-on-surface-variant hover:text-primary transition-all font-label-caps text-label-caps border-b-2 border-transparent hover:border-primary pb-1" to="/collection">Collections</Link>
            <Link className="text-on-surface-variant hover:text-primary transition-all font-label-caps text-label-caps border-b-2 border-transparent hover:border-primary pb-1" to="/">Editorial</Link>
            <Link className="text-on-surface-variant hover:text-primary transition-all font-label-caps text-label-caps border-b-2 border-transparent hover:border-primary pb-1" to="/about">About</Link>
          </nav>

          <div className="flex-1 flex justify-center md:absolute md:left-1/2 md:-translate-x-1/2">
            <Link className="font-display-lg text-headline-md tracking-widest text-primary uppercase" to="/">TOBEQUE</Link>
          </div>

          <div className="flex items-center gap-4 text-primary">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  aria-label="Profile"
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="hover:text-primary transition-colors cursor-pointer flex items-center"
                >
                  <span className="material-symbols-outlined" style={{ color: '#111' }}>person</span>
                </button>
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg border border-gray-100 rounded-sm py-2 z-50">
                    <Link to="/profile" onClick={() => setIsProfileDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">My Profile</Link>
                    <button 
                      onClick={() => { handleLogout(); setIsProfileDropdownOpen(false); }} 
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 cursor-pointer"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={openLoginModal} 
                className="text-xs font-label-caps uppercase tracking-widest hover:text-primary transition-colors border border-outline-variant px-3 py-1.5"
              >
                Login
              </button>
            )}
            <button aria-label="Wishlist" className="hover:text-primary transition-colors">
              <span className="material-symbols-outlined">favorite</span>
            </button>
            <button onClick={() => setIsCartOpen(true)} aria-label="Shopping Bag" className="hover:text-primary transition-colors relative">
              <span className="material-symbols-outlined">shopping_bag</span>
            </button>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <div className="pt-[72px] max-w-4xl mx-auto px-6 py-12 md:py-20">

        {/* Profile Header Card */}
        <div className="bg-white border border-outline-variant/60 p-8 md:p-12 mb-8 flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Monogram Avatar */}
          <div className="w-24 h-24 rounded-full bg-[#111] flex items-center justify-center flex-shrink-0 shadow-md">
            <span className="text-white font-serif text-2xl tracking-widest">{initials}</span>
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2 justify-center md:justify-start">
              <span className="text-[10px] text-gray-400 tracking-[0.25em] uppercase">Member Account</span>
              <span className="inline-flex items-center gap-1 text-[9px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-sm uppercase tracking-wider w-fit mx-auto md:mx-0">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"></span>
                {user.status}
              </span>
            </div>
            <h1 className="font-serif text-3xl text-[#111] mb-1">{displayName}</h1>
            {user.phone && (
              <p className="text-sm text-gray-500 flex items-center justify-center md:justify-start gap-1.5 mt-1">
                <span className="material-symbols-outlined text-base">phone</span>
                +91 {user.phone}
              </p>
            )}
            {user.email && (
              <p className="text-sm text-gray-500 flex items-center justify-center md:justify-start gap-1.5 mt-1">
                <span className="material-symbols-outlined text-base">mail</span>
                {user.email}
              </p>
            )}
            {!isEditing && (
              <button
                onClick={() => {
                  setActiveTab('details');
                  setIsEditing(true);
                }}
                className="mt-3 inline-flex items-center gap-1.5 text-xs text-primary underline underline-offset-4 cursor-pointer hover:text-gray-600"
              >
                <span className="material-symbols-outlined text-sm">edit</span>
                Edit Profile Details
              </button>
            )}
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-3 border border-gray-200 text-gray-500 text-xs tracking-[0.15em] uppercase font-medium hover:border-red-300 hover:text-red-500 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">logout</span>
            Sign Out
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-outline-variant mb-8">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-4 text-xs tracking-[0.2em] uppercase font-medium transition-colors ${
              activeTab === 'orders'
                ? 'border-b-2 border-[#111] text-[#111]'
                : 'text-gray-400 hover:text-gray-700'
            }`}
          >
            My Orders
          </button>
          <button
            onClick={() => setActiveTab('details')}
            className={`px-6 py-4 text-xs tracking-[0.2em] uppercase font-medium transition-colors ${
              activeTab === 'details'
                ? 'border-b-2 border-[#111] text-[#111]'
                : 'text-gray-400 hover:text-gray-700'
            }`}
          >
            My Details
          </button>
        </div>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            {ordersLoading ? (
              <div className="flex flex-col gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white border border-outline-variant/60 p-6 animate-pulse h-28 rounded-sm" />
                ))}
              </div>
            ) : ordersError ? (
              <div className="bg-white border border-red-100 p-8 text-center">
                <span className="material-symbols-outlined text-3xl text-red-400 mb-3 block">error_outline</span>
                <p className="text-sm text-red-500">{ordersError}</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white border border-outline-variant/60 p-16 text-center flex flex-col items-center gap-4">
                <span className="material-symbols-outlined text-5xl text-gray-200">shopping_bag</span>
                <h3 className="font-serif text-xl text-gray-400">No orders yet</h3>
                <p className="text-sm text-gray-400 max-w-xs">
                  You haven't placed any orders yet. Start exploring our collections.
                </p>
                <Link
                  to="/collection"
                  className="mt-4 px-8 py-3 bg-[#111] text-white text-xs tracking-[0.2em] uppercase font-medium hover:bg-[#333] transition-colors"
                >
                  Shop Now
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white border border-outline-variant/60 p-6 hover:border-gray-300 transition-colors">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <p className="text-[10px] text-gray-400 tracking-[0.2em] uppercase mb-1">Order</p>
                        <h3 className="font-medium text-[#111] text-sm">#{order.orderNumber}</h3>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric', month: 'long', year: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-3 py-1 text-[10px] uppercase tracking-wider font-medium rounded-full ${STATUS_COLORS[order.orderStatus] || STATUS_COLORS.pending}`}>
                          {order.orderStatus}
                        </span>
                        <span className="font-medium text-[#111] text-sm">
                          ₹{Number(order.totalAmount).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    {order.items && order.items.length > 0 && (
                      <div className="border-t border-outline-variant/40 pt-4 flex flex-col gap-2">
                        {order.items.slice(0, 2).map((item) => (
                          <div key={item.id} className="flex items-center gap-3 text-xs text-gray-600">
                            <div className="w-8 h-8 bg-gray-100 rounded-sm flex-shrink-0 overflow-hidden">
                              {item.product?.thumbnail && (
                                <img src={`http://localhost:5000${item.product.thumbnail}`} alt={item.product.name} className="w-full h-full object-cover" />
                              )}
                            </div>
                            <span className="flex-1 truncate">{item.product?.name || item.productName}</span>
                            <span className="text-gray-400">×{item.quantity}</span>
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <p className="text-[10px] text-gray-400 mt-1">+{order.items.length - 2} more items</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Details Tab */}
        {activeTab === 'details' && (
          <div className="bg-white border border-outline-variant/60 p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="font-serif text-xl text-[#111]">Account Details</h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 text-xs tracking-wider uppercase font-medium hover:bg-gray-50 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">edit</span>
                  Edit
                </button>
              )}
            </div>

            {saveSuccess && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 text-sm flex items-center gap-2">
                <span className="material-symbols-outlined">check_circle</span>
                Profile updated successfully!
              </div>
            )}

            {saveError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
                <span className="material-symbols-outlined">error</span>
                {saveError}
              </div>
            )}

            {isEditing ? (
              <form onSubmit={handleSave} className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* First Name */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] text-gray-400 tracking-[0.2em] uppercase font-medium">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="px-4 py-3 border border-gray-200 focus:border-[#111] focus:outline-none text-sm bg-white"
                      placeholder="e.g. Jane"
                    />
                  </div>

                  {/* Last Name */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] text-gray-400 tracking-[0.2em] uppercase font-medium">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="px-4 py-3 border border-gray-200 focus:border-[#111] focus:outline-none text-sm bg-white"
                      placeholder="e.g. Doe"
                    />
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] text-gray-400 tracking-[0.2em] uppercase font-medium">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="px-4 py-3 border border-gray-200 focus:border-[#111] focus:outline-none text-sm bg-white"
                      placeholder="e.g. jane.doe@example.com"
                    />
                  </div>

                  {/* Phone (Read Only) */}
                  <div className="flex flex-col gap-2 opacity-60">
                    <label className="text-[10px] text-gray-400 tracking-[0.2em] uppercase font-medium">Mobile Number</label>
                    <input
                      type="text"
                      value={'+91 ' + user.phone}
                      disabled
                      className="px-4 py-3 border border-gray-100 bg-gray-50 text-sm cursor-not-allowed"
                    />
                  </div>

                  {/* Gender */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] text-gray-400 tracking-[0.2em] uppercase font-medium">Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="px-4 py-3 border border-gray-200 focus:border-[#111] focus:outline-none text-sm bg-white"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Size Preference */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] text-gray-400 tracking-[0.2em] uppercase font-medium">Size Preference</label>
                    <select
                      name="sizePreference"
                      value={formData.sizePreference}
                      onChange={handleInputChange}
                      className="px-4 py-3 border border-gray-200 focus:border-[#111] focus:outline-none text-sm bg-white"
                    >
                      <option value="">Select Size</option>
                      <option value="XS">XS (Extra Small)</option>
                      <option value="S">S (Small)</option>
                      <option value="M">M (Medium)</option>
                      <option value="L">L (Large)</option>
                      <option value="XL">XL (Extra Large)</option>
                      <option value="XXL">XXL (Double Extra Large)</option>
                    </select>
                  </div>

                  {/* Address */}
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-[10px] text-gray-400 tracking-[0.2em] uppercase font-medium">Street Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="px-4 py-3 border border-gray-200 focus:border-[#111] focus:outline-none text-sm bg-white"
                      placeholder="Street name, building/apartment number"
                    />
                  </div>

                  {/* City */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] text-gray-400 tracking-[0.2em] uppercase font-medium">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="px-4 py-3 border border-gray-200 focus:border-[#111] focus:outline-none text-sm bg-white"
                      placeholder="e.g. Mumbai"
                    />
                  </div>

                  {/* State */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] text-gray-400 tracking-[0.2em] uppercase font-medium">State</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="px-4 py-3 border border-gray-200 focus:border-[#111] focus:outline-none text-sm bg-white"
                      placeholder="e.g. Maharashtra"
                    />
                  </div>

                  {/* Zip Code */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] text-gray-400 tracking-[0.2em] uppercase font-medium">ZIP / Postal Code</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className="px-4 py-3 border border-gray-200 focus:border-[#111] focus:outline-none text-sm bg-white"
                      placeholder="e.g. 400001"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4 border-t border-outline-variant/40">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-8 py-3 bg-[#111] text-white text-xs tracking-wider uppercase font-medium hover:bg-[#333] transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        firstName: user.firstName || '',
                        lastName: user.lastName || '',
                        email: user.email || '',
                        address: user.address || '',
                        city: user.city || '',
                        state: user.state || '',
                        zipCode: user.zipCode || '',
                        gender: user.gender || '',
                        sizePreference: user.sizePreference || '',
                      });
                    }}
                    className="px-8 py-3 border border-gray-200 text-gray-500 text-xs tracking-wider uppercase font-medium hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-gray-400 tracking-[0.2em] uppercase font-medium">Mobile Number</label>
                    <p className="text-sm text-[#111] py-3 border-b border-outline-variant/40">
                      +91 {user.phone || '—'}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-gray-400 tracking-[0.2em] uppercase font-medium">First Name</label>
                    <p className="text-sm text-[#111] py-3 border-b border-outline-variant/40">
                      {user.firstName || <span className="text-amber-500 italic font-medium">Pending</span>}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-gray-400 tracking-[0.2em] uppercase font-medium">Last Name</label>
                    <p className="text-sm text-[#111] py-3 border-b border-outline-variant/40">
                      {user.lastName || <span className="text-amber-500 italic font-medium">Pending</span>}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-gray-400 tracking-[0.2em] uppercase font-medium">Email Address</label>
                    <p className="text-sm text-[#111] py-3 border-b border-outline-variant/40">
                      {user.email || <span className="text-amber-500 italic font-medium">Pending</span>}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-gray-400 tracking-[0.2em] uppercase font-medium">Gender</label>
                    <p className="text-sm text-[#111] py-3 border-b border-outline-variant/40">
                      {user.gender || <span className="text-amber-500 italic font-medium">Pending</span>}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-gray-400 tracking-[0.2em] uppercase font-medium">Size Preference</label>
                    <p className="text-sm text-[#111] py-3 border-b border-outline-variant/40">
                      {user.sizePreference || <span className="text-amber-500 italic font-medium">Pending</span>}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 md:col-span-2">
                    <label className="text-[10px] text-gray-400 tracking-[0.2em] uppercase font-medium">Street Address</label>
                    <p className="text-sm text-[#111] py-3 border-b border-outline-variant/40">
                      {user.address || <span className="text-amber-500 italic font-medium">Pending</span>}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-gray-400 tracking-[0.2em] uppercase font-medium">City</label>
                    <p className="text-sm text-[#111] py-3 border-b border-outline-variant/40">
                      {user.city || <span className="text-amber-500 italic font-medium">Pending</span>}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-gray-400 tracking-[0.2em] uppercase font-medium">State</label>
                    <p className="text-sm text-[#111] py-3 border-b border-outline-variant/40">
                      {user.state || <span className="text-amber-500 italic font-medium">Pending</span>}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-gray-400 tracking-[0.2em] uppercase font-medium">ZIP / Postal Code</label>
                    <p className="text-sm text-[#111] py-3 border-b border-outline-variant/40">
                      {user.zipCode || <span className="text-amber-500 italic font-medium">Pending</span>}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-outline-variant/40">
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Your account is secured with mobile OTP. You can update your fashion profile and shipping preferences above to streamline your checkout process.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
