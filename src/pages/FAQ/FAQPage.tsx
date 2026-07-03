import { useState, useEffect } from "react";
import { Footer } from "../../components/Footer/Footer";
import { Navbar } from "../../components/Navbar/Navbar";

interface FAQItem {
  _id: string;
  question: string;
  answer: string;
  order: number;
  isActive: boolean;
}

export function FAQPage() {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/faqs")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setFaqs(data.faqs);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const toggle = (id: string) => {
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

        {/* Loading skeleton */}
        {loading && (
          <div className="divide-y divide-outline-variant border-t border-b border-outline-variant">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="py-5">
                <div className="h-4 bg-neutral-100 animate-pulse rounded w-3/4 mb-2" />
                <div className="h-3 bg-neutral-50 animate-pulse rounded w-1/2" />
              </div>
            ))}
          </div>
        )}

        {/* FAQs list */}
        {!loading && faqs.length > 0 && (
          <div className="divide-y divide-outline-variant border-t border-b border-outline-variant">
            {faqs.map((faq) => (
              <div key={faq._id}>
                <button
                  onClick={() => toggle(faq._id)}
                  className="w-full flex items-center justify-between py-5 px-0 text-left cursor-pointer hover:text-primary transition-colors group"
                >
                  <span className="text-[14px] font-medium text-primary pr-4 group-hover:text-black transition-colors">
                    {faq.question}
                  </span>
                  <span
                    className={`material-symbols-outlined text-[20px] text-secondary shrink-0 transition-transform duration-300 ${openId === faq._id ? "rotate-180" : ""}`}
                  >
                    expand_more
                  </span>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${openId === faq._id ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
                >
                  <p className="text-[13px] text-secondary leading-relaxed pb-5">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && faqs.length === 0 && (
          <div className="border border-outline-variant p-8 text-center">
            <p className="text-[13px] text-secondary">
              No FAQs available at the moment. Please check back soon or{" "}
              <a href="mailto:care@tobeque.com" className="underline hover:text-primary">
                contact us
              </a>{" "}
              for help.
            </p>
          </div>
        )}

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
