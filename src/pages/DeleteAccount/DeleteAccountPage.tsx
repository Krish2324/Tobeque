import { useState } from 'react';
import { Navbar } from '../../components/Navbar/Navbar';
import { Footer } from '../../components/Footer/Footer';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const rawEnvUrl = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
const API_BASE = `${rawEnvUrl}/api`;

export function DeleteAccountPage() {
  const { token, logout, isAuthenticated, openLoginModal } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (confirmText !== 'DELETE') {
      setError('Please type DELETE (in caps) to confirm.');
      return;
    }

    if (!isAuthenticated) {
      openLoginModal(() => {});
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/user-auth/account`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed to delete account');

      logout();
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
            <p className="text-[10px] tracking-[0.3em] uppercase text-gray-400 font-medium mb-3">Account</p>
            <h1 className="text-3xl md:text-4xl font-serif tracking-wide text-[#111] mb-2">
              Delete your account
            </h1>
            <p className="text-sm text-gray-400">This action is permanent and cannot be undone.</p>
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
              <h2 className="text-xl font-serif text-[#111] mb-2">Account Deleted</h2>
              <p className="text-sm text-gray-500 mb-8">Your account has been permanently deleted. We're sorry to see you go.</p>
              <button
                onClick={() => navigate('/')}
                className="text-sm text-[#111] underline underline-offset-4 hover:opacity-60 transition-opacity"
              >
                Return to homepage
              </button>
            </div>
          ) : (
            <>
              {/* Warning Banner */}
              <div className="border border-rose-200 bg-rose-50 p-5 mb-8">
                <p className="text-sm font-semibold text-rose-700 mb-1">Warning: This cannot be undone</p>
                <p className="text-xs text-rose-600 leading-relaxed">
                  Deleting your account will permanently remove all your data including order history, profile information, and preferences. This action is irreversible.
                </p>
              </div>

              {!isAuthenticated ? (
                <div className="text-center py-10 border border-gray-100">
                  <p className="text-sm text-gray-500 mb-4">You must be logged in to delete your account.</p>
                  <button
                    onClick={() => openLoginModal(() => {})}
                    className="px-6 py-2.5 bg-[#111] text-white text-sm tracking-widest uppercase hover:bg-[#333] transition-colors"
                  >
                    Log In
                  </button>
                </div>
              ) : (
                <form onSubmit={handleDelete} className="space-y-6">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5 tracking-wide uppercase">
                      Email address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="Confirm your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border border-gray-200 px-4 py-3 text-sm text-[#111] focus:outline-none focus:border-[#111] transition-colors placeholder-gray-300"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5 tracking-wide uppercase">
                      Type <span className="font-bold text-[#111]">DELETE</span> to confirm <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Type DELETE here"
                      value={confirmText}
                      onChange={(e) => setConfirmText(e.target.value)}
                      className="w-full border border-gray-200 px-4 py-3 text-sm text-[#111] focus:outline-none focus:border-[#111] transition-colors placeholder-gray-300"
                    />
                  </div>

                  {error && (
                    <p className="text-xs text-rose-600 bg-rose-50 border border-rose-100 px-4 py-3">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={loading || confirmText !== 'DELETE'}
                    className={`w-full py-3.5 text-sm font-semibold tracking-[0.2em] uppercase transition-all ${
                      confirmText === 'DELETE' && !loading
                        ? 'bg-rose-600 text-white hover:bg-rose-700 cursor-pointer'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {loading ? 'Deleting...' : 'Delete My Account'}
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
