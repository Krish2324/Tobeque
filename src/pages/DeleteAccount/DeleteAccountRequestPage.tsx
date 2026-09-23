import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../../components/Navbar/Navbar';
import { Footer } from '../../components/Footer/Footer';

const rawEnvUrl = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
const API_BASE = `${rawEnvUrl}/api`;

const DELETE_REASONS = [
  'I no longer use this app',
  'Privacy concerns',
  'Too many notifications',
  'Switching to another service',
  'Account security issue',
  'Other',
] as const;

export function DeleteAccountRequestPage() {
  const [form, setForm] = useState({
    identifier: '',
    reasonSelect: '',
    reasonText: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const title = 'Delete Your Tobeque Account | Account Deletion Request';
    const desc =
      'Request permanent deletion of your Tobeque account and associated personal data. Submit your registered email or phone number to initiate the process.';
    const keywords =
      'delete Tobeque account, account deletion request, remove account, Tobeque data deletion, unsubscribe Tobeque';

    document.title = title;

    const setMeta = (attr: string, val: string, content: string) => {
      let tag = document.querySelector(`meta[${attr}="${val}"]`) as HTMLMetaElement | null;
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attr, val);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    setMeta('name', 'description', desc);
    setMeta('name', 'keywords', keywords);
    setMeta('name', 'robots', 'index,follow');
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', desc);
    setMeta('property', 'og:url', window.location.href);
    setMeta('property', 'og:type', 'website');
    setMeta('name', 'twitter:card', 'summary');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', desc);
  }, []);

  const effectiveReason =
    form.reasonSelect === 'Other'
      ? form.reasonText
      : form.reasonSelect
      ? form.reasonSelect + (form.reasonText ? ` — ${form.reasonText}` : '')
      : form.reasonText;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.identifier.trim()) {
      setError('Please enter your registered email address or phone number.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/account-deletion/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: form.identifier.trim(),
          reason: effectiveReason,
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed to submit request.');
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
      <main className="pt-16 bg-white min-h-screen pb-24">
        {/* Page Header */}
        <div className="border-b border-gray-100 bg-[#fafafa]">
          <div className="max-w-2xl mx-auto px-6 py-8 md:py-12">
            <p className="text-[10px] tracking-[0.3em] uppercase text-gray-400 font-medium mb-3">
              Account
            </p>
            <h1 className="text-3xl md:text-4xl font-serif tracking-wide text-[#111] mb-2">
              Delete Your Tobeque Account
            </h1>
            <p className="text-sm text-gray-500 leading-relaxed">
              If you would like to permanently delete your Tobeque account and associated personal
              data, please submit your registered email or phone number below.
            </p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-6 pt-10">
          {success ? (
            /* ── Success State ── */
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-8 h-8 text-emerald-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-serif text-[#111] mb-3">Request Received</h2>
              <p className="text-sm text-gray-500 max-w-md mx-auto mb-2 leading-relaxed">
                Your account deletion request has been submitted successfully. Our team will process
                it within <strong>30 days</strong> in accordance with Tobeque's data deletion
                policy.
              </p>
              <p className="text-xs text-gray-400 mb-8">
                If you have questions, reach us at{' '}
                <a
                  href="mailto:care@tobeque.com"
                  className="text-[#111] underline underline-offset-2"
                >
                  care@tobeque.com
                </a>
              </p>
              <Link
                to="/"
                className="inline-block px-8 py-3 bg-[#111] text-white text-xs tracking-widest uppercase font-semibold hover:bg-[#333] transition-colors"
              >
                Return to Homepage
              </Link>
            </div>
          ) : (
            /* ── Form State ── */
            <>
              {/* Info Banner */}
              <div className="border border-amber-200 bg-amber-50 px-5 py-4 mb-8">
                <p className="text-xs text-amber-800 leading-relaxed">
                  <strong>Important:</strong> This action is permanent and cannot be undone. All
                  your orders, profile information, and saved preferences will be deleted. If you
                  are logged in, you can also delete your account directly from your{' '}
                  <Link to="/profile" className="underline font-medium">
                    Profile Settings
                  </Link>
                  .
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6" id="delete-account-form">
                {/* Email / Phone */}
                <div>
                  <label
                    htmlFor="da-identifier"
                    className="block text-xs font-medium text-gray-600 mb-1.5 tracking-wide uppercase"
                  >
                    Email / Mobile Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="da-identifier"
                    type="text"
                    required
                    placeholder="Enter your registered email or phone number"
                    value={form.identifier}
                    onChange={(e) => setForm((p) => ({ ...p, identifier: e.target.value }))}
                    className="w-full border border-gray-200 px-4 py-3 text-sm text-[#111] focus:outline-none focus:border-[#111] transition-colors placeholder-gray-300"
                  />
                </div>

                {/* Reason Select */}
                <div>
                  <label
                    htmlFor="da-reason-select"
                    className="block text-xs font-medium text-gray-600 mb-1.5 tracking-wide uppercase"
                  >
                    Reason for Deletion (Optional)
                  </label>
                  <select
                    id="da-reason-select"
                    value={form.reasonSelect}
                    onChange={(e) => setForm((p) => ({ ...p, reasonSelect: e.target.value }))}
                    className="w-full border border-gray-200 px-4 py-3 text-sm text-[#111] focus:outline-none focus:border-[#111] transition-colors bg-white appearance-none"
                    style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center' }}
                  >
                    <option value="">Select a reason…</option>
                    {DELETE_REASONS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Additional notes */}
                <div>
                  <label
                    htmlFor="da-reason-text"
                    className="block text-xs font-medium text-gray-600 mb-1.5 tracking-wide uppercase"
                  >
                    Additional Comments (Optional)
                  </label>
                  <textarea
                    id="da-reason-text"
                    rows={3}
                    placeholder="Tell us more about why you want to delete your account…"
                    value={form.reasonText}
                    onChange={(e) => setForm((p) => ({ ...p, reasonText: e.target.value }))}
                    className="w-full border border-gray-200 px-4 py-3 text-sm text-[#111] focus:outline-none focus:border-[#111] transition-colors placeholder-gray-300 resize-none"
                  />
                </div>

                {error && (
                  <p className="text-xs text-rose-600 bg-rose-50 border border-rose-100 px-4 py-3">
                    {error}
                  </p>
                )}

                <button
                  id="da-submit-btn"
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-rose-600 text-white text-sm font-semibold tracking-[0.2em] uppercase hover:bg-rose-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Submitting…' : 'Request Account Deletion'}
                </button>

                <p className="text-[11px] text-gray-400 text-center leading-relaxed">
                  Your request will be processed according to Tobeque's{' '}
                  <Link to="/privacy-policy" className="underline text-gray-500">
                    data deletion policy
                  </Link>
                  . We aim to complete all requests within 30 days.
                </p>
              </form>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
