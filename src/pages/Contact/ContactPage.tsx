import { useState, useEffect } from "react";
import { Navbar } from "../../components/Navbar/Navbar";
import { Footer } from "../../components/Footer/Footer";
import api from "../../services/api";

interface ContactSettings {
  phone: string;
  whatsapp: string;
  email: string;
  officeAddress: string;
  businessHours: string;
  mapEmbedUrl: string;
  mapAddress: string;
}

const DEFAULT_SETTINGS: ContactSettings = {
  phone: "+91 84470 00200",
  whatsapp: "+918447000200",
  email: "care@tobeque.com",
  officeAddress: "Tobeque Fashion Pvt. Ltd.\n123, Fashion Street, Sector 18,\nNoida, Uttar Pradesh – 201301\nIndia",
  businessHours: "Mon–Fri: 10:00 AM – 7:00 PM\nSaturday: 10:00 AM – 5:00 PM\nSunday: Closed",
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.3395609786165!2d77.32498177504598!3d28.62700818567088!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce5a0b62879d5%3A0x92b1ceebb527c82e!2sSector%2018%2C%20Noida%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1706260000000!5m2!1sen!2sin",
  mapAddress: "Sector 18, Noida, Uttar Pradesh",
};

export function ContactPage() {
  const [settings, setSettings] = useState<ContactSettings>(DEFAULT_SETTINGS);
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [responseMsg, setResponseMsg] = useState("");

  useEffect(() => {
    api.get("/api/contact/settings")
      .then(res => { if (res.data?.data) setSettings(res.data.data); })
      .catch(() => {}); // fallback to defaults
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setResponseMsg("");
    try {
      await api.post("/api/contact/submit", form);
      setStatus("success");
      setResponseMsg("Thank you for reaching out! We'll get back to you within 24 hours.");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch {
      setStatus("error");
      setResponseMsg("Something went wrong. Please try again.");
    }
  };

  // Parse business hours from multi-line string to array
  const hoursLines = settings.businessHours.split("\n").map(line => {
    const parts = line.split(":");
    return { day: parts[0]?.trim() || "", time: parts.slice(1).join(":").trim() };
  });

  return (
    <div className="bg-background text-on-background font-body-md antialiased overflow-x-hidden min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-16 w-full">

        {/* ── Hero Banner ── */}
        <section className="relative bg-[#f9f6f2] border-b border-[#e8e2da] py-14 px-6 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-[#e8d9c8]/40 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-52 h-52 rounded-full bg-[#d4e8d8]/30 blur-2xl pointer-events-none" />
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <p className="text-[11px] tracking-[0.25em] uppercase text-[#a0896e] font-semibold mb-3">We'd love to hear from you</p>
            <h1 className="font-display text-4xl md:text-5xl font-semibold text-[#1c1c1c] mb-4 leading-tight tracking-tight">
              Get In Touch
            </h1>
            <p className="text-[#6b6b6b] text-base md:text-lg leading-relaxed max-w-xl mx-auto">
              Whether you have a question about an order, need styling advice, or just want to say hello — our team is here for you.
            </p>
          </div>
        </section>

        {/* ── Main Content Grid ── */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">

            {/* ─── Left: Contact Info ─── */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-[#f9f6f2] rounded-2xl p-8 border border-[#ede7de] space-y-7">
                <h2 className="font-display text-xl font-semibold text-[#1c1c1c] tracking-tight">Contact Information</h2>

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#1c1c1c] flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.15em] text-[#a0896e] font-semibold mb-1">Phone / WhatsApp</p>
                    <a href={`tel:${settings.phone}`} className="text-[#1c1c1c] font-semibold text-[15px] hover:text-[#a0896e] transition-colors block">{settings.phone}</a>
                    <p className="text-[12px] text-[#888] mt-0.5">Mon – Sat, 10am – 7pm IST</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#1c1c1c] flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.15em] text-[#a0896e] font-semibold mb-1">Email Address</p>
                    <a href={`mailto:${settings.email}`} className="text-[#1c1c1c] font-semibold text-[15px] hover:text-[#a0896e] transition-colors block">{settings.email}</a>
                    <p className="text-[12px] text-[#888] mt-0.5">We reply within 24 hours</p>
                  </div>
                </div>

                {/* Office Address */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#1c1c1c] flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.15em] text-[#a0896e] font-semibold mb-1">Office Address</p>
                    <p className="text-[#1c1c1c] text-[14px] leading-relaxed whitespace-pre-line">{settings.officeAddress}</p>
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className="bg-[#1c1c1c] rounded-2xl p-6 text-white">
                <h3 className="text-[11px] uppercase tracking-[0.2em] text-[#c9b99a] font-semibold mb-4">Business Hours</h3>
                <div className="space-y-2">
                  {hoursLines.map(({ day, time }, idx) => (
                    <div key={idx} className="flex justify-between text-[13px]">
                      <span className="text-[#aaa]">{day}</span>
                      <span className="font-semibold text-white">{time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ─── Right: Contact Form ─── */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl border border-[#ede7de] shadow-sm p-8 md:p-10">
                <h2 className="font-display text-xl font-semibold text-[#1c1c1c] mb-1 tracking-tight">Send Us a Message</h2>
                <p className="text-[13px] text-[#888] mb-8">Fill out the form below and we'll get back to you shortly.</p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] uppercase tracking-[0.15em] font-semibold text-[#555]">Full Name *</label>
                      <input type="text" name="name" required placeholder="Your full name" value={form.name} onChange={handleChange}
                        className="w-full border border-[#ddd] rounded-lg px-4 py-3 text-[14px] text-[#1c1c1c] placeholder-[#bbb] focus:outline-none focus:border-[#1c1c1c] transition-colors bg-[#fafafa] focus:bg-white" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] uppercase tracking-[0.15em] font-semibold text-[#555]">Email Address *</label>
                      <input type="email" name="email" required placeholder="your@email.com" value={form.email} onChange={handleChange}
                        className="w-full border border-[#ddd] rounded-lg px-4 py-3 text-[14px] text-[#1c1c1c] placeholder-[#bbb] focus:outline-none focus:border-[#1c1c1c] transition-colors bg-[#fafafa] focus:bg-white" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] uppercase tracking-[0.15em] font-semibold text-[#555]">Phone Number</label>
                      <input type="tel" name="phone" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={handleChange}
                        className="w-full border border-[#ddd] rounded-lg px-4 py-3 text-[14px] text-[#1c1c1c] placeholder-[#bbb] focus:outline-none focus:border-[#1c1c1c] transition-colors bg-[#fafafa] focus:bg-white" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] uppercase tracking-[0.15em] font-semibold text-[#555]">Subject *</label>
                      <select name="subject" required value={form.subject} onChange={handleChange}
                        className="w-full border border-[#ddd] rounded-lg px-4 py-3 text-[14px] text-[#1c1c1c] focus:outline-none focus:border-[#1c1c1c] transition-colors bg-[#fafafa] focus:bg-white appearance-none cursor-pointer">
                        <option value="">Select a subject</option>
                        <option value="order">Order Enquiry</option>
                        <option value="return">Return / Exchange</option>
                        <option value="shipping">Shipping Issue</option>
                        <option value="product">Product Question</option>
                        <option value="styling">Styling Advice</option>
                        <option value="wholesale">Wholesale / B2B</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] uppercase tracking-[0.15em] font-semibold text-[#555]">Message *</label>
                    <textarea name="message" required rows={5} placeholder="Tell us how we can help you..." value={form.message} onChange={handleChange}
                      className="w-full border border-[#ddd] rounded-lg px-4 py-3 text-[14px] text-[#1c1c1c] placeholder-[#bbb] focus:outline-none focus:border-[#1c1c1c] transition-colors bg-[#fafafa] focus:bg-white resize-none" />
                  </div>

                  <button type="submit" disabled={status === "loading"} id="contact-submit-btn"
                    className="w-full bg-[#1c1c1c] hover:bg-[#333] text-white font-semibold text-[13px] tracking-[0.1em] uppercase py-4 rounded-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer">
                    {status === "loading" ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </>
                    )}
                  </button>

                  {responseMsg && (
                    <div className={`text-[13px] font-medium px-4 py-3 rounded-lg text-center ${status === "success" ? "bg-[#f0faf4] text-[#1a7a3f] border border-[#c3e8d3]" : "bg-[#fff5f5] text-[#c53030] border border-[#fdd]"}`}>
                      {responseMsg}
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* ── Map Section ── */}
        <section className="px-6 md:px-12 pb-16 max-w-7xl mx-auto">
          <div className="rounded-2xl overflow-hidden border border-[#ede7de] shadow-sm">
            <div className="bg-[#f9f6f2] border-b border-[#ede7de] px-6 py-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#1c1c1c] flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-[12px] font-bold text-[#1c1c1c] tracking-wide">Our Location</p>
                <p className="text-[11px] text-[#888]">{settings.mapAddress}</p>
              </div>
              <a href={`https://maps.google.com/?q=${encodeURIComponent(settings.mapAddress)}`}
                target="_blank" rel="noopener noreferrer"
                className="ml-auto text-[11px] font-semibold text-[#1c1c1c] underline underline-offset-2 hover:text-[#a0896e] transition-colors">
                Open in Google Maps →
              </a>
            </div>
            <div className="w-full h-[380px] md:h-[440px]">
              <iframe title="Tobeque Office Location" src={settings.mapEmbedUrl}
                width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
                referrerPolicy="no-referrer-when-downgrade" />
            </div>
          </div>
        </section>

        {/* ── Quick Connect Strip ── */}
        <section className="bg-[#1c1c1c] py-12 px-6">
          <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {[
              {
                icon: (<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12.01 2.014c-5.5 0-9.96 4.46-9.96 9.96 0 1.96.55 3.82 1.54 5.42L2 22l4.75-1.54c1.55.93 3.36 1.45 5.26 1.45 5.5 0 9.96-4.46 9.96-9.96s-4.46-9.96-9.96-9.96zm5.66 14.33c-.24.68-1.4 1.3-1.93 1.38-.5.07-1.16.14-3.32-.75-2.61-1.08-4.29-3.73-4.41-3.9-.13-.16-1.06-1.41-1.06-2.68 0-1.27.66-1.89.9-2.16.23-.26.5-.33.66-.33.17 0 .34 0 .49.02.16.01.37-.06.58.42.21.5.73 1.77.79 1.9.06.13.1.28.02.44-.08.16-.13.26-.26.42-.13.16-.28.35-.4.49-.13.14-.28.3-.13.56.16.26.7 1.14 1.5 1.85.99.91 1.85 1.19 2.11 1.32.26.13.41.11.56-.06.16-.17.68-.79.86-1.06.18-.28.36-.23.6-.14.24.08 1.5.7 1.76.84.26.13.44.2.5.31.06.11.06.66-.18 1.34z"/></svg>),
                label: "WhatsApp", value: "Click here to chat", href: `https://wa.me/${settings.whatsapp}`, color: "#25D366",
              },
              {
                icon: (<svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>),
                label: "Email Us", value: settings.email, href: `mailto:${settings.email}`, color: "#c9b99a",
              },
              {
                icon: (<svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" /></svg>),
                label: "Call Us", value: "Click here to call", href: `tel:${settings.phone}`, color: "#c9b99a",
              },
            ].map(({ icon, label, value, href, color }) => (
              <a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
                className="flex flex-col items-center gap-3 group cursor-pointer">
                <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white group-hover:scale-110 transition-transform" style={{ color }}>
                  {icon}
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-[#888] font-semibold">{label}</p>
                  <p className="text-white font-semibold text-[14px] mt-0.5 group-hover:text-[#c9b99a] transition-colors">{value}</p>
                </div>
              </a>
            ))}
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
