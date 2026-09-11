import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Navbar } from '../../components/Navbar/Navbar';
import { Footer } from '../../components/Footer/Footer';
import { useAuth } from '../../context/AuthContext';

const rawEnvUrl = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
const API_BASE = `${rawEnvUrl}/api`;

const RETURN_REASONS = [
  { value: 'wrong_size', label: 'Wrong Size / Fit', icon: 'straighten', desc: 'The item doesn\'t fit as expected' },
  { value: 'damaged_defective', label: 'Damaged / Defective', icon: 'broken_image', desc: 'The item arrived damaged or has a defect' },
  { value: 'not_as_described', label: 'Not as Described', icon: 'help_outline', desc: 'The item looks different from the listing' },
  { value: 'changed_mind', label: 'Changed My Mind', icon: 'sentiment_dissatisfied', desc: 'I no longer need this item' },
  { value: 'other', label: 'Other', icon: 'more_horiz', desc: 'Something else — please describe below' },
] as const;

export function RefundRequestPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    orderId: '',
    returnReason: '' as string,
    reason: '',
  });
  const [proofImage, setProofImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { user, openLoginModal } = useAuth();
  const location = useLocation();

  // Pre-fill form from URL query param + logged-in user details
  useEffect(() => {
    const title = "Refund Request | Returns & Refund Support | Tobeque";
    const desc = "Submit a refund request to Tobeque for eligible orders. Get guidance on returns, refund status and required order details through our customer support process.";
    const keywords = "Tobeque refund request, request refund Tobeque, Tobeque returns, refund status, order refund support, return and refund help";
    const image = `${window.location.origin}/2bq Logo2.png`;

    document.title = title;

    const setMetaTag = (attrName: string, attrVal: string, content: string) => {
      let tag = document.querySelector(`meta[name="${attrVal}"], meta[property="${attrVal}"]`);
      const canonicalAttr = attrVal.startsWith('og:') ? 'property' : (attrVal.startsWith('twitter:') ? 'name' : attrName);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(canonicalAttr, attrVal);
        document.head.appendChild(tag);
      } else {
        tag.setAttribute(canonicalAttr, attrVal);
      }
      tag.setAttribute('content', content);
      return tag;
    };

    setMetaTag('name', 'description', desc);
    setMetaTag('name', 'keywords', keywords);

    // Open Graph Tags
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', desc);
    setMetaTag('property', 'og:image', image);
    setMetaTag('property', 'og:url', window.location.href);
    setMetaTag('property', 'og:type', 'website');

    // Twitter Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', title);
    setMetaTag('name', 'twitter:description', desc);
    setMetaTag('name', 'twitter:image', image);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProofImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const currentToken = localStorage.getItem('tobeque_user_token');
    if (!currentToken) {
      openLoginModal(() => handleSubmit());
      return;
    }

    if (!form.returnReason) {
      setError('Please select a reason for the return.');
      return;
    }

    if (!form.reason.trim()) {
      setError('Please provide additional details in the note field.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('email', form.email);
      formData.append('phone', form.phone);
      formData.append('orderId', form.orderId);
      formData.append('requestType', 'return');
      formData.append('returnReason', form.returnReason);
      formData.append('reason', form.reason);
      if (proofImage) {
        formData.append('proofImage', proofImage);
      }

      const res = await fetch(`${API_BASE}/refund-requests`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentToken}`
        },
        body: formData,
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
            <Link to="/profile" className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase text-gray-400 font-medium mb-4 hover:text-gray-600 transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              Back to Profile
            </Link>
            <p className="text-[10px] tracking-[0.3em] uppercase text-gray-400 font-medium mb-3">Support</p>
            <h1 className="text-3xl md:text-4xl font-serif tracking-wide text-[#111] mb-2">Return Request</h1>
            <p className="text-sm text-gray-400">We'll review your request and get back to you within 3–5 business days.</p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-6 pt-10">
          {success ? (
            <div className="bg-white border border-gray-100 rounded-2xl p-8 md:p-12 shadow-sm text-[#111] space-y-8 my-6">
              {/* Header & Icon */}
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-100">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl md:text-3xl font-serif tracking-wide text-[#111] mb-2">
                  Return Request Received
                </h2>
                <p className="text-sm text-gray-600 max-w-md mx-auto">
                  Thank you for submitting your return request! We&apos;ve got it, and here&apos;s what happens next:
                </p>
              </div>

              <div className="border-t border-b border-gray-100 py-6 space-y-6 text-sm text-gray-600 leading-relaxed">
                {/* What to expect */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <h3 className="font-semibold text-gray-900 uppercase tracking-wider text-xs mb-1.5 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span>
                    What to expect:
                  </h3>
                  <p className="text-gray-600">
                    Our team is reviewing your request right now. You&apos;ll hear back from us within <strong>3–5 business days</strong> with an update on whether your return has been approved.
                  </p>
                </div>

                {/* Once approved */}
                <div>
                  <h3 className="font-semibold text-gray-900 uppercase tracking-wider text-xs mb-3">
                    Once approved, here&apos;s how it works:
                  </h3>
                  <ol className="space-y-2.5 pl-5 list-decimal text-gray-600">
                    <li>You&apos;ll receive a confirmation email with your return authorization and pickup/drop-off instructions.</li>
                    <li>Pack the item securely in its original packaging, with tags intact.</li>
                    <li>Our courier partner will pick it up from your registered address (or you can drop it off, depending on the option you choose).</li>
                    <li>Once we receive and inspect the item, your refund or exchange will be processed within the timeline mentioned in our Return Policy.</li>
                  </ol>
                </div>

                {/* Need to check on something */}
                <div className="pt-2">
                  <h3 className="font-semibold text-gray-900 uppercase tracking-wider text-xs mb-1">
                    Need to check on something in the meantime?
                  </h3>
                  <p className="text-gray-600">
                    Reach out to us at <a href="mailto:care@tobeque.com" className="text-[#111] font-medium underline">care@tobeque.com</a> or call/WhatsApp us at <a href="tel:+918447000200" className="text-[#111] font-medium underline">+91 8447000200</a>: we&apos;re happy to help.
                  </p>
                </div>
              </div>

              {/* Footer thanks & CTA */}
              <div className="text-center space-y-4 pt-2">
                <p className="text-sm font-medium text-gray-800">
                  Thanks for shopping with Tobeque. We&apos;ll be in touch soon!
                </p>
                <div>
                  <Link to="/profile" className="inline-flex items-center gap-2 bg-[#111] text-white px-8 py-3.5 text-xs tracking-widest uppercase font-semibold hover:bg-[#333] transition-colors rounded-lg">
                    Back to My Orders
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-7">
              {/* Info Note */}
              <div className="border border-amber-200 bg-amber-50 px-5 py-4 rounded-lg">
                <p className="text-xs text-amber-700 leading-relaxed">
                  Returns are accepted within <strong>7 days of delivery</strong>. Please ensure your Order ID matches exactly as shown in your order confirmation. Only delivered orders are eligible for returns.
                </p>
              </div>

              {/* Order ID */}
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

              {/* Contact Details */}
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
                <div className="sm:col-span-2">
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
              </div>

              {/* Return Reason */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-3 tracking-wide uppercase">
                  Reason for Return <span className="text-rose-500">*</span>
                </label>
                <div className="space-y-2">
                  {RETURN_REASONS.map(reason => (
                    <button
                      key={reason.value}
                      type="button"
                      onClick={() => setForm(prev => ({ ...prev, returnReason: reason.value }))}
                      className={`w-full flex items-center gap-4 px-5 py-4 border text-left transition-all ${
                        form.returnReason === reason.value
                          ? 'border-[#111] bg-gray-50'
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        form.returnReason === reason.value ? 'bg-[#111] text-white' : 'bg-gray-100 text-gray-500'
                      }`}>
                        <span className="material-symbols-outlined text-[16px]">{reason.icon}</span>
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${form.returnReason === reason.value ? 'text-[#111]' : 'text-gray-700'}`}>
                          {reason.label}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">{reason.desc}</p>
                      </div>
                      {form.returnReason === reason.value && (
                        <svg className="ml-auto w-5 h-5 text-[#111] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Additional Notes */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5 tracking-wide uppercase">
                  Additional Details <span className="text-rose-500">*</span>
                </label>
                <textarea
                  name="reason"
                  rows={4}
                  required
                  placeholder="Please describe the issue in more detail."
                  value={form.reason}
                  onChange={handleChange}
                  className="w-full border border-gray-200 px-4 py-3 text-sm text-[#111] focus:outline-none focus:border-[#111] transition-colors placeholder-gray-300 resize-none"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5 tracking-wide uppercase">
                  Proof Image (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full border border-gray-200 px-4 py-3 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100 transition-colors"
                />
                <p className="text-[10px] text-gray-400 mt-1">Upload a photo showing the issue (e.g. damaged item).</p>
              </div>

              {error && (
                <p className="text-xs text-rose-600 bg-rose-50 border border-rose-100 px-4 py-3">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#111] text-white text-sm font-semibold tracking-[0.2em] uppercase hover:bg-[#333] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Submit Return Request'}
              </button>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
