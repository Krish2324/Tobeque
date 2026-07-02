import { useState } from "react";
import { Footer } from "../../components/Footer/Footer";
import { Navbar } from "../../components/Navbar/Navbar";

const faqs = [
  {
    id: 1,
    question: "What sizes do you offer?",
    answer:
      "We offer sizes XS to XL across most of our collections. Each product page includes a detailed size guide to help you find your perfect fit. If you're between sizes, we recommend sizing up for a more relaxed look.",
  },
  {
    id: 2,
    question: "How do I track my order?",
    answer:
      "Once your order is shipped, you'll receive a tracking link via email and SMS. You can also track your order from your profile page under 'My Orders'. Delivery typically takes 3–5 business days.",
  },
  {
    id: 3,
    question: "What is your return & exchange policy?",
    answer:
      "We accept returns and exchanges within 7 days of delivery. Items must be unworn, unwashed, and in original packaging with tags attached. Sale items are not eligible for returns. To initiate a return, contact us at care@tobeque.com.",
  },
  {
    id: 4,
    question: "Do you ship internationally?",
    answer:
      "Currently, we ship across India. International shipping is coming soon! Sign up to our newsletter to be the first to know when we expand to your country.",
  },
  {
    id: 5,
    question: "How do I care for my Tobeque garments?",
    answer:
      "Each garment has a care label inside with specific instructions. In general, we recommend machine washing on cold with similar colors, avoiding bleach, and hanging to dry to preserve the quality and shape of your pieces.",
  },
  {
    id: 6,
    question: "Can I change or cancel my order?",
    answer:
      "Orders can be modified or cancelled within 1 hour of placing them. Please contact us immediately at care@tobeque.com or WhatsApp us at +91 84470 00200. After 1 hour, orders may have already been processed for shipping.",
  },
  {
    id: 7,
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit and debit cards, UPI, net banking, Wallets (Paytm, PhonePe), and EMI options. All transactions are secured with SSL encryption.",
  },
  {
    id: 8,
    question: "Is there a loyalty or rewards program?",
    answer:
      "Yes! Every purchase earns you Tobeque points that you can redeem on future orders. Create a free account to start earning and tracking your rewards.",
  },
];

export function FAQPage() {
  const [openId, setOpenId] = useState<number | null>(null);

  const toggle = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="bg-background text-on-background font-body-md antialiased overflow-x-hidden min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 mt-[64px] pt-10 pb-20 px-6 md:px-12 max-w-[820px] mx-auto w-full">
        <h1 className="text-3xl font-semibold text-primary mb-2 tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-[13px] text-secondary mb-10">
          Can't find an answer?{" "}
          <a
            href="mailto:care@tobeque.com"
            className="underline hover:text-primary transition-colors"
          >
            Email us
          </a>{" "}
          or reach us on{" "}
          <a
            href="https://wa.me/918447000200"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-primary transition-colors"
          >
            WhatsApp
          </a>
          .
        </p>

        <div className="divide-y divide-outline-variant border-t border-b border-outline-variant">
          {faqs.map((faq) => (
            <div key={faq.id}>
              <button
                onClick={() => toggle(faq.id)}
                className="w-full flex items-center justify-between py-5 px-0 text-left cursor-pointer hover:text-primary transition-colors group"
              >
                <span className="text-[14px] font-medium text-primary pr-4 group-hover:text-black transition-colors">
                  {faq.question}
                </span>
                <span
                  className={`material-symbols-outlined text-[20px] text-secondary shrink-0 transition-transform duration-300 ${openId === faq.id ? "rotate-180" : ""}`}
                >
                  expand_more
                </span>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${openId === faq.id ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
              >
                <p className="text-[13px] text-secondary leading-relaxed pb-5">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-surface-container border border-outline-variant p-8 text-center">
          <h2 className="text-[15px] font-semibold text-primary mb-2">
            Still have questions?
          </h2>
          <p className="text-[13px] text-secondary mb-4">
            Our team is available Mon–Sat, 10am–7pm IST.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <a
              href="mailto:care@tobeque.com"
              className="inline-block border border-primary text-primary text-[12px] font-semibold uppercase tracking-widest px-6 py-2.5 hover:bg-primary hover:text-on-primary transition-colors"
            >
              Email Us
            </a>
            <a
              href="https://wa.me/918447000200"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#25D366] text-white text-[12px] font-semibold uppercase tracking-widest px-6 py-2.5 hover:bg-[#1da851] transition-colors"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
