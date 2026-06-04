import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="w-full bg-[#f4f4f4] text-[#333] pt-16 pb-8 border-t border-outline-variant font-body-md relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-[#e5e5e5] pb-16">
          
          {/* Column 1: About */}
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-[13px] tracking-wide mb-2 text-black">About Tobeque</h3>
            <p className="text-[13px] text-[#555] leading-relaxed">
              Find a location nearest you. <a href="#" className="underline hover:text-primary transition-colors">See Our Stores</a>
            </p>
            <div className="flex items-center gap-2 mt-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#555]">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              <span className="font-bold text-[13px] text-[#333]">Whatsapp</span>
            </div>
            <p className="text-[13px] text-[#555]">+918447000200</p>
            <a href="mailto:care@tobeque.com" className="text-[13px] text-[#555] hover:text-primary transition-colors mt-2">care@tobeque.com</a>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col gap-3">
            <h3 className="font-bold text-[13px] tracking-wide mb-2 text-black">Quick Links</h3>
            <Link to="#" className="text-[13px] text-[#555] hover:text-primary transition-colors">About Us</Link>
            <Link to="#" className="text-[13px] text-[#555] hover:text-primary transition-colors">Style Journal</Link>
            <Link to="#" className="text-[13px] text-[#555] hover:text-primary transition-colors">Career</Link>
            <Link to="#" className="text-[13px] text-[#555] hover:text-primary transition-colors">FAQs</Link>
            <Link to="#" className="text-[13px] text-[#555] hover:text-primary transition-colors">Steal the Style</Link>
          </div>

          {/* Column 3: Policies */}
          <div className="flex flex-col gap-3">
            <h3 className="font-bold text-[13px] tracking-wide mb-2 text-black">Policies</h3>
            <Link to="#" className="text-[13px] text-[#555] hover:text-primary transition-colors">Terms and conditions</Link>
            <Link to="#" className="text-[13px] text-[#555] hover:text-primary transition-colors">Privacy policy</Link>
            <Link to="#" className="text-[13px] text-[#555] hover:text-primary transition-colors">Cookies policy</Link>
            <Link to="#" className="text-[13px] text-[#555] hover:text-primary transition-colors">Cookie settings</Link>
            <Link to="#" className="text-[13px] text-[#555] hover:text-primary transition-colors">Delete Account</Link>
            <Link to="#" className="text-[13px] text-[#555] hover:text-primary transition-colors">Refund Request</Link>
          </div>

          {/* Column 4: Subscribe */}
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-[13px] tracking-wide mb-2 text-black">Subscribe</h3>
            <p className="text-[13px] text-[#555] leading-relaxed pr-4">
              Enter your email below to be the first to know about new collections and product launches.
            </p>
            <form className="flex mt-2" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Email" 
                required
                className="flex-1 bg-white border border-[#ccc] px-4 py-2.5 text-[13px] focus:outline-none focus:border-[#666] transition-colors"
              />
              <button 
                type="submit" 
                className="bg-[#6b7280] hover:bg-[#4b5563] text-white px-6 py-2.5 text-[13px] font-semibold transition-colors cursor-pointer"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-6 gap-6">
          {/* Payment Icons */}
          <div className="flex items-center gap-2">
            <div className="h-6 w-9 bg-[#1e73be] rounded-[2px] flex items-center justify-center text-[7px] text-white font-bold tracking-tighter">AMEX</div>
            <div className="h-6 w-9 bg-white border border-[#e0e0e0] rounded-[2px] flex items-center justify-center text-[9px] font-bold text-[#5f6368]"><span className="text-[#ea4335]">G</span><span className="font-normal tracking-tight">Pay</span></div>
            <div className="h-6 w-9 bg-[#f79e1b] rounded-[2px] flex items-center justify-center relative overflow-hidden">
              <div className="w-[14px] h-[14px] bg-[#eb001b] rounded-full absolute -left-1 opacity-90 mix-blend-multiply"></div>
              <div className="w-[14px] h-[14px] bg-[#f79e1b] rounded-full absolute -right-1 opacity-90 mix-blend-multiply"></div>
            </div>
            <div className="h-6 w-9 bg-[#003087] rounded-[2px] flex items-center justify-center text-white font-bold italic text-[8px] tracking-tighter">PayPal</div>
            <div className="h-6 w-9 bg-[#5a31f4] rounded-[2px] flex items-center justify-center text-white font-semibold text-[8px]">Shop<span className="font-light">Pay</span></div>
            <div className="h-6 w-9 bg-[#172b4d] rounded-[2px] flex items-center justify-center text-white font-bold text-[8px] tracking-widest"><span className="text-[#00d6fe]">V</span>ISA</div>
          </div>

          {/* Copyright */}
          <div className="text-[10px] font-bold tracking-widest text-black uppercase text-center md:absolute md:left-1/2 md:-translate-x-1/2">
            © TOBEQUE 2026. ALL RIGHTS RESERVED.
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-4">
            {/* Instagram */}
            <a href="#" className="text-black hover:text-[#555] transition-colors">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            {/* Facebook */}
            <a href="#" className="text-black hover:text-[#555] transition-colors">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </a>
            {/* Twitter / X */}
            <a href="#" className="text-black hover:text-[#555] transition-colors">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
            </a>
            {/* Pinterest */}
            <a href="#" className="text-black hover:text-[#555] transition-colors">
               <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </a>
            {/* Youtube */}
            <a href="#" className="text-black hover:text-[#555] transition-colors">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
            </a>
            {/* LinkedIn */}
            <a href="#" className="text-black hover:text-[#555] transition-colors">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            </a>
          </div>
        </div>
      </div>

      {/* Floating Whatsapp Button */}
      <a href="https://wa.me/918447000200" className="fixed bottom-6 right-6 w-[52px] h-[52px] bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-xl hover:bg-[#1da851] hover:scale-105 transition-all z-50">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.01 2.014c-5.5 0-9.96 4.46-9.96 9.96 0 1.96.55 3.82 1.54 5.42L2 22l4.75-1.54c1.55.93 3.36 1.45 5.26 1.45 5.5 0 9.96-4.46 9.96-9.96s-4.46-9.96-9.96-9.96zm5.66 14.33c-.24.68-1.4 1.3-1.93 1.38-.5.07-1.16.14-3.32-.75-2.61-1.08-4.29-3.73-4.41-3.9-.13-.16-1.06-1.41-1.06-2.68 0-1.27.66-1.89.9-2.16.23-.26.5-.33.66-.33.17 0 .34 0 .49.02.16.01.37-.06.58.42.21.5.73 1.77.79 1.9.06.13.1.28.02.44-.08.16-.13.26-.26.42-.13.16-.28.35-.4.49-.13.14-.28.3-.13.56.16.26.7 1.14 1.5 1.85.99.91 1.85 1.19 2.11 1.32.26.13.41.11.56-.06.16-.17.68-.79.86-1.06.18-.28.36-.23.6-.14.24.08 1.5.7 1.76.84.26.13.44.2.5.31.06.11.06.66-.18 1.34z"/>
        </svg>
      </a>
    </footer>
  );
}
