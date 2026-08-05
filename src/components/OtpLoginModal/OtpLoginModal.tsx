import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { sendOtp, verifyOtp } from '../../services/userAuthService';
import logoImage from '../../assets/Tobeque-Logo-290x57.webp';

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
      (document.activeElement as HTMLElement)?.blur();
      login(result.user, result.token);
      if (loginSuccessCallback) {
        loginSuccessCallback();
      }
      closeLoginModal();
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
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto"
      onClick={(e) => { if (e.target === e.currentTarget) closeLoginModal(); }}
    >
      {/* Modal card */}
      <div
        className="bg-white w-full sm:max-w-[380px] relative flex flex-col overflow-hidden m-auto"
        style={{ animation: 'loginSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}
      >
        {/* Close button */}
        <button
          onClick={closeLoginModal}
          className="absolute top-5 right-5 w-6 h-6 flex items-center justify-center text-gray-300 hover:text-gray-600 transition-colors z-10"
          aria-label="Close"
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M1 1L12 12M12 1L1 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
        </button>

        {/* ── Header: logo + subtitle ── */}
        <div className="flex flex-col items-center pt-10 pb-7 px-8 border-b border-gray-100">
          <img src={logoImage} alt="Tobeque" className="h-[17px] w-auto object-contain mb-5" style={{ filter: 'brightness(0)' }} />
          {step === 'phone' ? (
            <>
              <p className="text-[12px] text-gray-800 font-medium tracking-wide">Sign in to your account</p>
              <p className="text-[11px] text-gray-400 font-light mt-1">Enter your mobile number to continue</p>
            </>
          ) : (
            <>
              <p className="text-[12px] text-gray-800 font-medium tracking-wide">Verify your number</p>
              <p className="text-[11px] text-gray-400 font-light mt-1">
                OTP sent to <span className="text-gray-700 font-medium">+91 {phone}</span>
              </p>
            </>
          )}
        </div>

        {/* ── Form ── */}
        <div className="px-8 py-8">
          {step === 'phone' ? (
            <form onSubmit={handleSendOtp} className="flex flex-col gap-7">

              {/* Phone field */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] tracking-[0.22em] uppercase text-gray-400 font-semibold">
                  Mobile Number
                </label>
                <div className="flex items-center border-b border-gray-200 focus-within:border-gray-800 transition-colors duration-200 pb-2.5 pt-1">
                  {/* Flag + code */}
                  <div className="flex items-center gap-1.5 pr-3 mr-3 border-r border-gray-200 shrink-0">
                    <svg width="17" height="12" viewBox="0 0 225 150" className="rounded-[1px]">
                      <rect width="225" height="50" fill="#FF9933"/>
                      <rect y="50" width="225" height="50" fill="#FFFFFF"/>
                      <rect y="100" width="225" height="50" fill="#138808"/>
                      <circle cx="112.5" cy="75" r="17" stroke="#000080" strokeWidth="2" fill="none"/>
                      <circle cx="112.5" cy="75" r="3.5" fill="#000080"/>
                    </svg>
                    <span className="text-[13px] text-gray-500 font-medium select-none">+91</span>
                  </div>
                  <input
                    type="tel"
                    autoFocus
                    maxLength={10}
                    value={phone}
                    onChange={(e) => { setPhone(e.target.value.replace(/\D/g, '')); setError(''); }}
                    placeholder="98765 43210"
                    className="flex-1 text-[16px] text-gray-900 focus:outline-none bg-transparent placeholder-gray-300 font-light tracking-[0.06em]"
                    inputMode="numeric"
                  />
                </div>
              </div>

              {/* Error */}
              {error && (
                <p className="text-red-400 text-[11px] flex items-center gap-1.5 -mt-3">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {error}
                </p>
              )}

              {/* CTA */}
              <button
                type="submit"
                disabled={isLoading || phone.length < 10}
                className="w-full h-11 bg-gray-900 text-white text-[10.5px] tracking-[0.22em] uppercase font-semibold hover:bg-black transition-colors flex items-center justify-center gap-2 disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? (
                  <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                ) : (
                  <>
                    <span>Continue</span>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M13 6l6 6-6 6"/>
                    </svg>
                  </>
                )}
              </button>

              {/* Legal */}
              <p className="text-center text-[10px] text-gray-400 font-light leading-relaxed">
                By continuing, you agree to our{' '}
                <Link to="/terms-and-conditions" onClick={closeLoginModal} className="text-gray-500 hover:text-gray-900 underline underline-offset-2 transition-colors">Terms</Link>
                {' '}&{' '}
                <Link to="/privacy-policy" onClick={closeLoginModal} className="text-gray-500 hover:text-gray-900 underline underline-offset-2 transition-colors">Privacy Policy</Link>.
              </p>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="flex flex-col gap-7">

              {/* Back */}
              <button
                type="button"
                onClick={() => { setStep('phone'); setOtp(['', '', '', '', '', '']); setError(''); }}
                className="self-start flex items-center gap-1.5 text-[11px] text-gray-400 hover:text-gray-800 transition-colors -mt-2"
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M11 6l-6 6 6 6"/>
                </svg>
                Change number
              </button>

              {/* OTP boxes */}
              <div className="flex flex-col gap-2">
                <label className="text-[9px] tracking-[0.22em] uppercase text-gray-400 font-semibold">One-Time Password</label>
                <div className="flex justify-between gap-1.5" onPaste={handleOtpPaste}>
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
                      className="w-10 h-10 text-center text-[16px] font-medium text-gray-900 border-b-2 border-gray-200 focus:border-gray-900 focus:outline-none transition-colors duration-150 bg-transparent"
                    />
                  ))}
                </div>
              </div>

              {/* Error */}
              {error && (
                <p className="text-red-400 text-[11px] flex items-center gap-1.5 -mt-3">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {error}
                </p>
              )}

              {/* Verify CTA */}
              <button
                type="submit"
                disabled={isLoading || otp.join('').length < 6}
                className="w-full h-11 bg-gray-900 text-white text-[10.5px] tracking-[0.22em] uppercase font-semibold hover:bg-black transition-colors flex items-center justify-center gap-2 disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? (
                  <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                ) : (
                  <>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                    </svg>
                    <span>Verify & Sign In</span>
                  </>
                )}
              </button>

              {/* Resend */}
              <p className="text-center text-[11px] text-gray-400 font-light">
                Didn't get it?{' '}
                {resendTimer > 0 ? (
                  <span className="tabular-nums">{resendTimer}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    className="text-gray-700 underline underline-offset-2 hover:text-black transition-colors font-medium"
                  >
                    Resend
                  </button>
                )}
              </p>
            </form>
          )}
        </div>

        {/* Bottom accent */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      </div>

      <style>{`
        @keyframes loginSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (min-width: 640px) {
          @keyframes loginSlideUp {
            from { opacity: 0; transform: scale(0.97) translateY(6px); }
            to   { opacity: 1; transform: scale(1) translateY(0); }
          }
        }
      `}</style>
    </div>
  );
}
