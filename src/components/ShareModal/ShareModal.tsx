import { useState } from 'react';

export interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  url: string;
}

export function ShareModal({ isOpen, onClose, productName, url }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareUrls = {
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(productName + ' ' + url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(productName)}&url=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(productName)}`,
    email: `mailto:?subject=${encodeURIComponent(productName)}&body=${encodeURIComponent(url)}`
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md transition-opacity duration-300">
      <div className="bg-surface w-full max-w-md relative p-8 shadow-2xl animate-fade-in-up">
        {/* Overlapping Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 w-10 h-10 flex items-center justify-center bg-primary text-on-primary rounded-full hover:scale-105 hover:bg-neutral-800 transition-all shadow-xl border-4 border-surface"
          aria-label="Close"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <h3 className="text-sm font-bold tracking-[0.15em] uppercase text-primary mb-2 text-center">
          Share this piece
        </h3>
        <p className="text-xs text-secondary/70 text-center mb-6">
          {productName}
        </p>

        {/* Copy Link Section */}
        <div className="mb-8">
          <label className="block text-[10px] font-bold tracking-widest uppercase text-secondary mb-2">
            Copy link
          </label>
          <div className="flex items-center border border-outline-variant bg-surface-container-lowest focus-within:border-primary transition-colors">
            <input 
              readOnly 
              value={url} 
              className="flex-1 bg-transparent px-4 py-2.5 text-xs outline-none text-secondary truncate" 
            />
            <button 
              onClick={handleCopy} 
              className="bg-primary text-on-primary px-5 py-2.5 text-[10px] font-bold tracking-widest uppercase hover:bg-neutral-800 transition-colors whitespace-nowrap"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Social Icons Section */}
        <div>
          <label className="block text-[10px] font-bold tracking-widest uppercase text-secondary mb-3 text-center">
            Or share via
          </label>
          <div className="flex justify-center items-center gap-3">
            {/* WhatsApp */}
            <a href={shareUrls.whatsapp} target="_blank" rel="noopener noreferrer" className="w-10 h-10 border border-outline-variant rounded-full flex items-center justify-center text-primary hover:bg-[#25D366] hover:text-white hover:border-[#25D366] transition-all" aria-label="WhatsApp">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
            </a>
            {/* Facebook */}
            <a href={shareUrls.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 border border-outline-variant rounded-full flex items-center justify-center text-primary hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] transition-all" aria-label="Facebook">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </a>
            {/* X / Twitter */}
            <a href={shareUrls.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 border border-outline-variant rounded-full flex items-center justify-center text-primary hover:bg-black hover:text-white hover:border-black transition-all" aria-label="X">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
            </a>
            {/* LinkedIn */}
            <a href={shareUrls.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 border border-outline-variant rounded-full flex items-center justify-center text-primary hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2] transition-all" aria-label="LinkedIn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            </a>
            {/* Email */}
            <a href={shareUrls.email} target="_blank" rel="noopener noreferrer" className="w-10 h-10 border border-outline-variant rounded-full flex items-center justify-center text-primary hover:bg-secondary hover:text-white hover:border-secondary transition-all" aria-label="Email">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
