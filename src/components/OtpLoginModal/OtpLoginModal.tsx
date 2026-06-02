import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { sendOtp, verifyOtp } from '../../services/userAuthService';

type Step = 'phone' | 'otp';

export function OtpLoginModal() {
  const { isLoginModalOpen, closeLoginModal, login, loginSuccessCallback } = useAuth();

  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isLoginModalOpen) {
      setTimeout(() => {
        setStep('phone');
        setPhone('');
        setOtp(['', '', '', '', '', '']);
        setError('');
        setResendTimer(0);
        setIsLoading(false);
      }, 300);
    }
  }, [isLoginModalOpen]);

  // Countdown timer for resend
  useEffect(() => {
    if (resendTimer > 0) {
      const t = setTimeout(() => setResendTimer((s) => s - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendTimer]);

  if (!isLoginModalOpen) return null;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      await sendOtp(phone.replace(/\D/g, ''));
      setStep('otp');
      setResendTimer(30);
      setTimeout(() => otpInputRefs.current[0]?.focus(), 100);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError('');
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    for (let i = 0; i < pasted.length; i++) newOtp[i] = pasted[i];
    setOtp(newOtp);
    const nextEmpty = newOtp.findIndex((d) => !d);
    otpInputRefs.current[nextEmpty === -1 ? 5 : nextEmpty]?.focus();
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length < 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      const result = await verifyOtp(phone.replace(/\D/g, ''), otpString);
      login(result.user, result.token);
      closeLoginModal();
      // Execute the callback (e.g., reopen checkout) after login
      if (loginSuccessCallback) {
        setTimeout(() => loginSuccessCallback(), 200);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid OTP. Please try again.');
      setOtp(['', '', '', '', '', '']);
      setTimeout(() => otpInputRefs.current[0]?.focus(), 50);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    setError('');
    setOtp(['', '', '', '', '', '']);
    setIsLoading(true);
    try {
      await sendOtp(phone.replace(/\D/g, ''));
      setResendTimer(30);
      setTimeout(() => otpInputRefs.current[0]?.focus(), 100);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to resend OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) closeLoginModal(); }}
    >
      <div className="bg-white w-full max-w-md shadow-2xl relative flex flex-col overflow-hidden"
        style={{ animation: 'modalSlideUp 0.3s ease-out' }}
      >
        {/* Top brand bar */}
        <div className="bg-[#111111] px-8 py-6 flex items-center justify-between">
          <div>
            <p className="text-white/50 text-[10px] tracking-[0.25em] uppercase font-medium mb-1">Welcome to</p>
            <h2 className="text-white font-serif text-2xl tracking-widest uppercase">TOBEQUE</h2>
          </div>
          <button
            onClick={closeLoginModal}
            className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white transition-colors"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="px-8 py-8">
          {step === 'phone' ? (
            <form onSubmit={handleSendOtp} className="flex flex-col gap-6">
              <div>
                <h3 className="font-serif text-xl text-[#111] mb-2 tracking-wide">Sign in to continue</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Enter your mobile number to receive a one-time password.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] text-gray-400 tracking-[0.2em] uppercase font-medium">
                  Mobile Number
                </label>
                <div className="flex border border-gray-200 focus-within:border-[#111] transition-colors">
                  <div className="flex items-center px-4 border-r border-gray-200 bg-gray-50">
                    <span className="text-sm text-gray-500 font-medium select-none">🇮🇳 +91</span>
                  </div>
                  <input
                    type="tel"
                    autoFocus
                    maxLength={10}
                    value={phone}
                    onChange={(e) => { setPhone(e.target.value.replace(/\D/g, '')); setError(''); }}
                    placeholder="98765 43210"
                    className="flex-1 px-4 py-3.5 text-sm text-[#111] focus:outline-none bg-white placeholder-gray-300"
                    inputMode="numeric"
                  />
                </div>
              </div>

              {error && (
                <p className="text-red-500 text-xs flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">error</span>
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#111] text-white h-13 text-xs tracking-[0.2em] uppercase font-medium hover:bg-[#333] transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                style={{ height: '52px' }}
              >
                {isLoading ? (
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <>
                    <span>Send OTP</span>
                    <span className="material-symbols-outlined text-base">arrow_forward</span>
                  </>
                )}
              </button>

              <p className="text-center text-xs text-gray-400 leading-relaxed">
                By continuing, you agree to our{' '}
                <a href="#" className="text-[#111] underline underline-offset-2">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-[#111] underline underline-offset-2">Privacy Policy</a>.
              </p>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="flex flex-col gap-6">
              <div>
                <button
                  type="button"
                  onClick={() => { setStep('phone'); setOtp(['', '', '', '', '', '']); setError(''); }}
                  className="flex items-center gap-1 text-xs text-gray-400 hover:text-[#111] transition-colors mb-4 -ml-1"
                >
                  <span className="material-symbols-outlined text-base">arrow_back</span>
                  Change number
                </button>
                <h3 className="font-serif text-xl text-[#111] mb-2 tracking-wide">Enter OTP</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  We've sent a 6-digit OTP to <span className="text-[#111] font-medium">+91 {phone}</span>.
                </p>
                <p className="text-xs text-amber-600 mt-2 bg-amber-50 px-3 py-2 border border-amber-100">
                  🔒 Dev mode: OTP is always <strong>123456</strong>
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] text-gray-400 tracking-[0.2em] uppercase font-medium">
                  6-Digit OTP
                </label>
                <div className="flex gap-2" onPaste={handleOtpPaste}>
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => { otpInputRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className="flex-1 aspect-square text-center text-xl font-bold text-[#111] border border-gray-200 focus:border-[#111] focus:outline-none transition-colors bg-white"
                      style={{ minWidth: 0 }}
                    />
                  ))}
                </div>
              </div>

              {error && (
                <p className="text-red-500 text-xs flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">error</span>
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isLoading || otp.join('').length < 6}
                className="w-full bg-[#111] text-white text-xs tracking-[0.2em] uppercase font-medium hover:bg-[#333] transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                style={{ height: '52px' }}
              >
                {isLoading ? (
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-base">lock_open</span>
                    <span>Verify & Continue</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                <span>Didn't receive it?</span>
                {resendTimer > 0 ? (
                  <span className="text-gray-400">Resend in {resendTimer}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    className="text-[#111] underline underline-offset-2 font-medium cursor-pointer hover:text-gray-600"
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>

      <style>{`
        @keyframes modalSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
