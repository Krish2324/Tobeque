import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../../components/Navbar/Navbar';
import { Footer } from '../../components/Footer/Footer';

const rawEnvUrl = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
const API_BASE = `${rawEnvUrl}/api`;

// ─── Types ────────────────────────────────────────────────────────────────────
type Step = 'phone' | 'otp' | 'success';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  return digits.slice(-10);
}

function isValidPhone(raw: string): boolean {
  return normalizePhone(raw).length === 10;
}

// ─── Component ────────────────────────────────────────────────────────────────
export function DeleteAccountRequestPage() {
  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [confirmed, setConfirmed] = useState(false); // "I understand" checkbox

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── SEO ─────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const title = 'Delete Tobeque Account | Account Deletion Request';
    const desc =
      'Permanently delete your Tobeque account and associated personal data. Verify your identity via OTP and your account will be removed immediately.';

    document.title = title;

    const setMeta = (attr: string, val: string, content: string) => {
      let tag = document.querySelector(
        `meta[${attr}="${val}"]`
      ) as HTMLMetaElement | null;
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attr, val);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    setMeta('name', 'description', desc);
    setMeta('name', 'robots', 'index,follow');
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', desc);
    setMeta('property', 'og:url', 'https://tobeque.com/delete-account');
    setMeta('property', 'og:type', 'website');
    setMeta('name', 'twitter:card', 'summary');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', desc);

    return () => {
      if (cooldownRef.current) clearInterval(cooldownRef.current);
    };
  }, []);

  // ── Resend cooldown timer ────────────────────────────────────────────────────
  const startCooldown = () => {
    setResendCooldown(60);
    cooldownRef.current = setInterval(() => {
      setResendCooldown((c) => {
        if (c <= 1) {
          clearInterval(cooldownRef.current!);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  };

  // ── Step 1: Send OTP ─────────────────────────────────────────────────────────
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isValidPhone(phone)) {
      setError('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    if (!confirmed) {
      setError('Please confirm that you understand this action is permanent.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/account-deletion/request-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phone.trim() }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send OTP.');

      setStep('otp');
      startCooldown();
    } catch (err: any) {
      setError(err.message || 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: Verify OTP & Delete ───────────────────────────────────────────────
  const handleVerifyAndDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const otpStr = otp.join('');
    if (otpStr.length < 6) {
      setError('Please enter the complete 6-digit OTP.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/account-deletion/verify-and-delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phone.trim(), otp: otpStr }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Verification failed.');

      setStep('success');
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Resend OTP ────────────────────────────────────────────────────────────────
  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setError('');
    setOtp(['', '', '', '', '', '']);
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/account-deletion/request-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phone.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to resend OTP.');
      startCooldown();
    } catch (err: any) {
      setError(err.message || 'Failed to resend OTP.');
    } finally {
      setLoading(false);
    }
  };

  // ── OTP input handlers ────────────────────────────────────────────────────────
  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    if (digit && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (paste.length === 6) {
      setOtp(paste.split(''));
      otpRefs.current[5]?.focus();
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white pt-16 pb-24">

        {/* ── Page Header ──────────────────────────────────────────────────── */}
        <div className="bg-[#fafafa] border-b border-gray-100">
          <div className="max-w-xl mx-auto px-5 py-10 md:py-14">
            <p className="text-[10px] tracking-[0.3em] uppercase text-gray-400 font-medium mb-3">
              Tobeque · Account
            </p>
            <h1 className="text-3xl md:text-4xl font-serif text-[#111] mb-3 tracking-wide leading-snug">
              Delete Your Tobeque Account
            </h1>
            <p className="text-sm text-gray-500 leading-relaxed max-w-lg">
              You can permanently delete your Tobeque account and associated personal data directly
              from this page — no app installation required. Verify your identity with a one-time
              OTP sent to your registered mobile number.
            </p>
          </div>
        </div>

        {/* ── Step Indicator ───────────────────────────────────────────────── */}
        {step !== 'success' && (
          <div className="max-w-xl mx-auto px-5 pt-8">
            <div className="flex items-center gap-3 mb-8">
              {[
                { id: 'phone', label: '1. Verify Phone' },
                { id: 'otp',   label: '2. Enter OTP'   },
              ].map((s, idx) => (
                <div key={s.id} className="flex items-center gap-3">
                  <div className={`flex items-center gap-2 ${step === s.id ? 'opacity-100' : (idx === 0 && step === 'otp') ? 'opacity-100' : 'opacity-40'}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      (idx === 0 && step === 'otp') ? 'bg-emerald-500 text-white' : step === s.id ? 'bg-[#111] text-white' : 'bg-gray-200 text-gray-500'
                    }`}>
                      {idx === 0 && step === 'otp' ? '✓' : idx + 1}
                    </div>
                    <span className="text-xs font-medium text-gray-600">{s.label}</span>
                  </div>
                  {idx === 0 && (
                    <div className="h-px w-8 bg-gray-200" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="max-w-xl mx-auto px-5">

          {/* ══ STEP 1: PHONE ═════════════════════════════════════════════════ */}
          {step === 'phone' && (
            <form onSubmit={handleSendOtp} className="space-y-6" id="da-phone-form" noValidate>

              {/* Warning banner */}
              <div className="border border-rose-100 bg-rose-50 rounded-sm px-5 py-4">
                <p className="text-xs text-rose-800 leading-relaxed">
                  <strong>⚠ This action is permanent and cannot be undone.</strong> All your profile
                  information, saved addresses, and preferences will be permanently deleted.
                  Completed order records will be anonymized for legal purposes. You will not be
                  able to recover this account.
                </p>
              </div>

              {/* What gets deleted */}
              <div className="border border-gray-100 rounded-sm px-5 py-5">
                <p className="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">What will be deleted</p>
                <ul className="space-y-2">
                  {[
                    'Your name, email, and profile details',
                    'Saved addresses and preferences',
                    'Profile photo',
                    'Login credentials and session data',
                    'Push notification tokens',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-xs text-gray-600">
                      <span className="text-rose-500 mt-0.5 shrink-0">✕</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-xs font-semibold text-gray-700 mt-4 mb-3 uppercase tracking-wide">What is retained (anonymized)</p>
                <ul className="space-y-2">
                  {[
                    'Order records (anonymized — required for accounting & legal compliance)',
                    'Refund/return records (anonymized)',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-xs text-gray-500">
                      <span className="text-amber-500 mt-0.5 shrink-0">○</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Phone input */}
              <div>
                <label
                  htmlFor="da-phone"
                  className="block text-xs font-semibold text-gray-700 mb-2 tracking-wide uppercase"
                >
                  Registered Mobile Number <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center border border-gray-200 focus-within:border-[#111] transition-colors">
                  <span className="px-4 text-sm text-gray-400 select-none border-r border-gray-200 h-full py-3">
                    +91
                  </span>
                  <input
                    id="da-phone"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    required
                    placeholder="Enter your 10-digit mobile number"
                    value={phone}
                    onChange={(e) => {
                      setError('');
                      setPhone(e.target.value.replace(/\D/g, '').slice(0, 10));
                    }}
                    className="flex-1 px-4 py-3 text-sm text-[#111] focus:outline-none placeholder-gray-300 bg-white"
                    autoComplete="tel"
                  />
                </div>
                <p className="text-[11px] text-gray-400 mt-1.5">
                  Enter the number registered with your Tobeque account. An OTP will be sent to verify your identity.
                </p>
              </div>

              {/* Confirmation checkbox */}
              <label className="flex items-start gap-3 cursor-pointer select-none group" htmlFor="da-confirm">
                <div className="mt-0.5 shrink-0">
                  <input
                    id="da-confirm"
                    type="checkbox"
                    checked={confirmed}
                    onChange={(e) => { setError(''); setConfirmed(e.target.checked); }}
                    className="w-4 h-4 accent-rose-600 cursor-pointer"
                  />
                </div>
                <span className="text-xs text-gray-600 leading-relaxed group-hover:text-gray-800 transition-colors">
                  I understand that deleting my account is <strong>permanent and irreversible</strong>.
                  All my personal data will be removed from Tobeque's systems.
                </span>
              </label>

              {/* Error */}
              {error && (
                <div className="bg-rose-50 border border-rose-200 px-4 py-3 rounded-sm">
                  <p className="text-xs text-rose-700">{error}</p>
                </div>
              )}

              {/* Submit */}
              <button
                id="da-send-otp-btn"
                type="submit"
                disabled={loading || !confirmed || phone.length < 10}
                className="w-full py-3.5 bg-rose-600 text-white text-sm font-semibold tracking-[0.15em] uppercase transition-all hover:bg-rose-700 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending OTP…' : 'Send Verification OTP'}
              </button>

              {/* Privacy policy link */}
              <p className="text-center text-[11px] text-gray-400 leading-relaxed">
                By proceeding, you acknowledge our{' '}
                <Link
                  to="/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-gray-500 hover:text-[#111] transition-colors"
                >
                  Privacy Policy
                </Link>{' '}
                and data deletion terms. Requests are typically processed immediately upon OTP
                verification.
              </p>
            </form>
          )}

          {/* ══ STEP 2: OTP VERIFICATION ══════════════════════════════════════ */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyAndDelete} className="space-y-6" id="da-otp-form" noValidate>

              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-[#111] flex items-center justify-center mx-auto mb-5">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h2 className="text-xl font-serif text-[#111] mb-2">Verify Your Identity</h2>
                <p className="text-sm text-gray-500 leading-relaxed">
                  An OTP has been sent to{' '}
                  <strong className="text-[#111]">+91 {phone}</strong>.
                  <br />
                  Enter it below to confirm and permanently delete your account.
                </p>
              </div>

              {/* OTP boxes */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-3 tracking-wide uppercase text-center">
                  Enter 6-Digit OTP
                </label>
                <div className="flex justify-center gap-2.5" onPaste={handleOtpPaste}>
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => { otpRefs.current[i] = el; }}
                      id={`da-otp-${i}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className="w-12 h-14 text-center text-xl font-bold text-[#111] border border-gray-200 focus:border-[#111] focus:outline-none transition-colors"
                      autoComplete="one-time-code"
                    />
                  ))}
                </div>
              </div>

              {/* Resend */}
              <p className="text-center text-xs text-gray-400">
                Didn't receive it?{' '}
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendCooldown > 0 || loading}
                  className="underline text-gray-600 hover:text-[#111] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend OTP'}
                </button>
              </p>

              {/* Final warning */}
              <div className="border border-rose-100 bg-rose-50 px-4 py-3 rounded-sm text-center">
                <p className="text-xs text-rose-800">
                  ⚠ Pressing the button below will <strong>immediately and permanently</strong>{' '}
                  delete your Tobeque account. This cannot be reversed.
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="bg-rose-50 border border-rose-200 px-4 py-3 rounded-sm">
                  <p className="text-xs text-rose-700">{error}</p>
                </div>
              )}

              <button
                id="da-verify-delete-btn"
                type="submit"
                disabled={loading || otp.join('').length < 6}
                className="w-full py-3.5 bg-rose-600 text-white text-sm font-semibold tracking-[0.15em] uppercase transition-all hover:bg-rose-700 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? 'Deleting Account…' : 'Verify & Permanently Delete Account'}
              </button>

              <button
                type="button"
                onClick={() => { setStep('phone'); setError(''); setOtp(['', '', '', '', '', '']); }}
                className="w-full py-3 text-xs text-gray-400 hover:text-gray-600 transition-colors underline underline-offset-2"
              >
                ← Go back and change phone number
              </button>
            </form>
          )}

          {/* ══ STEP 3: SUCCESS ═══════════════════════════════════════════════ */}
          {step === 'success' && (
            <div className="text-center py-10" id="da-success-state">
              <div className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-100 flex items-center justify-center mx-auto mb-7">
                <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <h2 className="text-2xl font-serif text-[#111] mb-4">Account Deleted</h2>

              <div className="bg-gray-50 border border-gray-100 rounded-sm px-6 py-6 mb-8 text-left space-y-3 max-w-md mx-auto">
                <p className="text-sm font-semibold text-gray-700">What happened:</p>
                <ul className="space-y-2">
                  {[
                    'Your Tobeque account has been permanently deleted.',
                    'All personal data (profile, address, preferences) has been removed.',
                    'Your login credentials are no longer valid.',
                    'Order records have been anonymized for legal/accounting compliance.',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-xs text-gray-600">
                      <span className="text-emerald-500 mt-0.5 shrink-0">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <p className="text-xs text-gray-400 mb-2 leading-relaxed">
                If you have any questions, contact us at{' '}
                <a href="mailto:care@tobeque.com" className="underline text-gray-600 hover:text-[#111] transition-colors">
                  care@tobeque.com
                </a>
              </p>
              <p className="text-xs text-gray-400 mb-8 leading-relaxed">
                Read our{' '}
                <Link to="/privacy-policy" className="underline text-gray-500 hover:text-[#111] transition-colors">
                  Privacy Policy
                </Link>{' '}
                to learn about our data handling practices.
              </p>

              <a
                href="https://tobeque.com"
                id="da-return-home-btn"
                className="inline-block px-10 py-3.5 bg-[#111] text-white text-xs tracking-[0.2em] uppercase font-semibold hover:bg-[#333] transition-colors"
              >
                Return to Tobeque
              </a>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </>
  );
}
