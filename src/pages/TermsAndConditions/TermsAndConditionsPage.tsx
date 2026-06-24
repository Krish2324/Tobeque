import { Navbar } from '../../components/Navbar/Navbar';
import { Footer } from '../../components/Footer/Footer';

const SECTIONS = [
  {
    title: 'General',
    content: `This website is owned and operated by Tobeque. Throughout the site, the terms "we," "us," and "our" refer to Tobeque. By visiting our site and/or purchasing from us, you are engaging in our "Service" and are agreeing to be bound by these Terms.`,
  },
  {
    title: 'Eligibility',
    content: `You are at least 18 years of age; or you have legal parental or guardian consent to use this site. By using our site, you are representing that you meet these requirements.`,
  },
  {
    title: 'Products & Pricing',
    content: null,
    bullets: [
      'All products and prices are listed in INR (₹) unless otherwise stated.',
      'We reserve the right to change product prices, discontinue products, or update product descriptions at any moment without notice.',
      'All orders are subject to availability.',
    ],
  },
  {
    title: 'Orders & Payments',
    content: null,
    bullets: [
      'Orders will be confirmed via email once your payment has been confirmed.',
      'We accept many secure payment methods through various third-party gateways.',
      'We reserve the right to refuse or cancel any order if fraudulent or suspicious activity is suspected.',
    ],
  },
  {
    title: 'Shipping & Delivery',
    content: null,
    bullets: [
      'We aim to ship products in the time frame stated at checkout.',
      'Shipping times may vary depending on your location or unforeseen delays.',
      'Tobeque is not liable for seller delays on behalf of any third-party shipping provider.',
    ],
  },
  {
    title: 'Return & Exchange',
    content: null,
    bullets: [
      'Products can be exchanged within 3 days of delivery if they meet the conditions of a return.',
      'Products will need to be in unused, unwashed condition, in the original packaging (tags still attached).',
      'For any request for a return/exchange, please email care@tobeque.com.',
      'For any details please see our separate Return & Refund Policy.',
    ],
  },
  {
    title: 'Intellectual Property',
    content: `All content (including text, images, logos, product designs and graphics) on this site belongs to Tobeque and is protected under intellectual property law. You may not copy or use any content on this site without written permission.`,
  },
  {
    title: 'User Conduct',
    content: 'You agree not to:',
    bullets: [
      'Use the website for any unlawful purpose.',
      'Upload files that contain viruses or any other form of malicious code.',
      'Violate another person\'s rights.',
      'Attempt to access another person\'s account or the website\'s systems.',
    ],
  },
  {
    title: 'Limitation of Liability',
    content: `Tobeque is not liable under these Terms for any direct, indirect, incidental, or consequential damages that arise from your use of or the inability to use this site or products purchased from us.`,
  },
  {
    title: 'Governing Law',
    content: `These Terms are governed by the laws of India and any legal action or proceeding will be based out of Indian jurisdiction.`,
  },
  {
    title: 'Modifications to Terms',
    content: `We may revise or modify these Terms at any time. Any modifications to these Terms will be made to this page, and the date of any changes will be updated accordingly.`,
  },
];

export function TermsAndConditionsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16 bg-white min-h-screen">
        {/* Page Header */}
        <div className="border-b border-gray-100 bg-[#fafafa]">
          <div className="max-w-3xl mx-auto px-6 py-14 md:py-20">
            <p className="text-[10px] tracking-[0.3em] uppercase text-gray-400 font-medium mb-3">
              Legal
            </p>
            <h1 className="text-3xl md:text-4xl font-serif tracking-wide text-[#111] mb-4">
              Terms & Conditions
            </h1>
            <p className="text-sm text-gray-400">
              Last updated: June 2025
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-6 py-14 md:py-20">
          <p className="text-sm text-gray-500 leading-relaxed mb-12 border-l-2 border-[#111] pl-5">
            Please read these Terms &amp; Conditions carefully before using our website. By accessing or using Tobeque, you agree to be bound by the terms described below.
          </p>

          <div className="flex flex-col divide-y divide-gray-100">
            {SECTIONS.map((section, index) => (
              <section key={section.title} className="py-8 first:pt-0">
                <div className="flex items-start gap-6">
                  <span className="text-[11px] text-gray-300 font-mono mt-1 select-none w-5 shrink-0">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="flex-1">
                    <h2 className="text-sm font-semibold tracking-[0.15em] uppercase text-[#111] mb-3">
                      {section.title}
                    </h2>
                    {section.content && (
                      <p className="text-sm text-gray-500 leading-relaxed mb-3">
                        {section.content}
                      </p>
                    )}
                    {section.bullets && (
                      <ul className="flex flex-col gap-2">
                        {section.bullets.map((bullet) => (
                          <li key={bullet} className="flex items-start gap-3 text-sm text-gray-500 leading-relaxed">
                            <span className="mt-[7px] w-1 h-1 rounded-full bg-gray-300 shrink-0" />
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </section>
            ))}
          </div>

          {/* Contact Section */}
          <div className="mt-12 pt-10 border-t border-gray-100">
            <h2 className="text-sm font-semibold tracking-[0.15em] uppercase text-[#111] mb-4">
              Communication
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed mb-4">
              If you have questions regarding these Terms &amp; Conditions, please contact us at:
            </p>
            <div className="bg-[#fafafa] border border-gray-100 p-6 inline-flex flex-col gap-1">
              <p className="text-sm font-semibold text-[#111] tracking-wide">Tobeque</p>
              <p className="text-sm text-gray-500">
                Email:{' '}
                <a href="mailto:care@tobeque.com" className="text-[#111] underline underline-offset-2 hover:opacity-70 transition-opacity">
                  care@tobeque.com
                </a>
              </p>
              <p className="text-sm text-gray-500">
                Website:{' '}
                <a href="https://www.tobeque.com" target="_blank" rel="noopener noreferrer" className="text-[#111] underline underline-offset-2 hover:opacity-70 transition-opacity">
                  www.tobeque.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
