import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar } from '../../components/Navbar/Navbar';
import { Footer } from '../../components/Footer/Footer';
import { useAuth } from '../../context/AuthContext';

export function RefundRequestPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', orderId: '', reason: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { user, openLoginModal } = useAuth();
  const location = useLocation();

  // Pre-fill form from URL query param + logged-in user details
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const prefilledOrderId = params.get('orderId') || '';
    setForm(prev => ({
      ...prev,
      orderId: prefilledOrderId || prev.orderId,
      name: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : prev.name,
      email: user?.email || prev.email,
      phone: user?.phone || prev.phone,
    }));
  }, [location.search, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    // Check localStorage directly to avoid stale React closure state after the modal callback
    const currentToken = localStorage.getItem('tobeque_user_token');
    
    if (!currentToken) {
      openLoginModal(() => handleSubmit());
      return;
    }

    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/refund-requests', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentToken}` 
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed to submit request');
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="pt-16 bg-white min-h-screen pb-20">
        {/* Page Header */}
        <div className="border-b border-gray-100 bg-[#fafafa]">
          <div className="max-w-2xl mx-auto px-6 py-8 md:py-12">
            <p className="text-[10px] tracking-[0.3em] uppercase text-gray-400 font-medium mb-3">Support</p>
            <h1 className="text-3xl md:text-4xl font-serif tracking-wide text-[#111] mb-2">
              Refund Request
            </h1>
            <p className="text-sm text-gray-400">We'll review your request and get back to you within 3–5 business days.</p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-6 pt-10">
          {success ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-serif text-[#111] mb-2">Request Submitted</h2>
              <p className="text-sm text-gray-500 mb-2">Your refund request has been received.</p>
              <p className="text-sm text-gray-400">Our team will review it and contact you at <strong>{form.email}</strong> within 3–5 business days.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Info Note */}
              <div className="border border-amber-200 bg-amber-50 px-5 py-4 mb-2">
                <p className="text-xs text-amber-700 leading-relaxed">
                  Please ensure your Order ID matches exactly as shown in your order confirmation email or profile page. Refunds are only processed for eligible orders within 7 days of delivery.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5 tracking-wide uppercase">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Your full name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full border border-gray-200 px-4 py-3 text-sm text-[#111] focus:outline-none focus:border-[#111] transition-colors placeholder-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5 tracking-wide uppercase">
                    Email <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="Your email address"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full border border-gray-200 px-4 py-3 text-sm text-[#111] focus:outline-none focus:border-[#111] transition-colors placeholder-gray-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5 tracking-wide uppercase">
                    Phone <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="+91 XXXXX XXXXX"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full border border-gray-200 px-4 py-3 text-sm text-[#111] focus:outline-none focus:border-[#111] transition-colors placeholder-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5 tracking-wide uppercase">
                    Order ID <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="orderId"
                    required
                    placeholder="e.g. ORD-20250101-1234"
                    value={form.orderId}
                    onChange={handleChange}
                    className="w-full border border-gray-200 px-4 py-3 text-sm text-[#111] focus:outline-none focus:border-[#111] transition-colors placeholder-gray-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5 tracking-wide uppercase">
                  Reason for refund
                </label>
                <textarea
                  name="reason"
                  rows={4}
                  placeholder="Briefly describe why you're requesting a refund..."
                  value={form.reason}
                  onChange={handleChange}
                  className="w-full border border-gray-200 px-4 py-3 text-sm text-[#111] focus:outline-none focus:border-[#111] transition-colors placeholder-gray-300 resize-none"
                />
              </div>

              {error && (
                <p className="text-xs text-rose-600 bg-rose-50 border border-rose-100 px-4 py-3">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#111] text-white text-sm font-semibold tracking-[0.2em] uppercase hover:bg-[#333] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Submit Refund Request'}
              </button>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
