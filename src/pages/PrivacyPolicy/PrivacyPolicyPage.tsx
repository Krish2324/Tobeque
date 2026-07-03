import { Navbar } from '../../components/Navbar/Navbar';
import { Footer } from '../../components/Footer/Footer';
import { Link } from 'react-router-dom';

const SECTIONS = [
  {
    number: '01',
    title: 'Information We Collect',
    intro: 'We collect the following types of information to provide and improve our services:',
    subsections: [
      {
        label: 'a. Personal Information',
        text: 'When you make a purchase, create an account, or contact us, we may collect:',
        bullets: [
          'Name',
          'Email address',
          'Phone number',
          'Billing and shipping address',
          'Payment details (processed securely via payment gateways; we do not store card details)',
        ],
      },
      {
        label: 'b. Non-Personal Information',
        text: 'Automatically collected data may include:',
        bullets: [
          'IP address',
          'Browser type',
          'Device information',
          'Pages visited and time spent',
          'Cookies and tracking technologies',
        ],
      },
      {
        label: 'c. Optional Information',
        text: 'If you choose to participate in surveys, offers, or giveaways, we may collect:',
        bullets: [
          'Age group',
          'Style preferences',
          'Feedback or reviews',
        ],
      },
    ],
  },
  {
    number: '02',
    title: 'How We Use Your Information',
    intro: 'We use your information to:',
    bullets: [
      'Process and deliver orders',
      'Provide customer support',
      'Improve product offerings and website functionality',
      'Send order confirmations, updates, and important notifications',
      'Communicate offers, promotions, and brand updates (only with your consent)',
      'Conduct analytics to enhance user experience',
      'Prevent fraud and ensure website security',
    ],
  },
  {
    number: '03',
    title: 'Sharing Your Information',
    intro: 'We never sell your personal information. We may share information only with the following:',
    bullets: [
      'Trusted third-party service providers (payment gateways, courier partners, analytics tools)',
      'Legal authorities, if required to comply with the law',
      'Business partners, in case of a merger or acquisition (with prior notice to you)',
    ],
    note: 'All third parties are required to follow strict privacy practices.',
  },
  {
    number: '04',
    title: 'Cookies & Tracking Technologies',
    intro: 'We use cookies to:',
    bullets: [
      'Remember your preferences',
      'Improve website performance',
      'Analyze website traffic',
      'Personalize your shopping experience',
    ],
    note: 'You may disable cookies in your browser settings, but certain features may not function properly.',
  },
  {
    number: '05',
    title: 'Data Security',
    intro: 'We implement industry-standard security measures to protect your information. This includes:',
    bullets: [
      'Encrypted payment processing',
      'Secure server connections',
      'Regular system audits',
    ],
    note: 'However, no online method is 100% secure, and we cannot guarantee absolute protection.',
  },
  {
    number: '06',
    title: 'Your Rights',
    intro: 'Depending on your region, you may have the right to:',
    bullets: [
      'Access your personal data',
      'Request correction or deletion of your data',
      'Withdraw consent from email marketing',
      'Request data portability',
      'Disable cookies',
    ],
    note: 'To exercise any of these rights, contact us at care@tobeque.com.',
  },
  {
    number: '07',
    title: 'Email & SMS Communication',
    intro: 'By signing up, you agree to receive:',
    bullets: [
      'Order-related notifications',
      'Promotional emails or SMS (optional)',
    ],
    note: 'You may unsubscribe anytime using the link provided in the email or by contacting us.',
  },
  {
    number: '08',
    title: "Children's Privacy",
    intro:
      "Tobeque does not knowingly collect personal information from individuals under 13 years of age. If we learn that data has been collected from a minor, we will delete it promptly.",
  },
  {
    number: '09',
    title: 'Policy Updates',
    intro:
      'We may update this Privacy Policy from time to time. Any changes will be posted on this page with a revised "Effective Date."',
  },
];

export function PrivacyPolicyPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16 bg-white min-h-screen">
        {/* Page Header */}
        <div className="border-b border-gray-100 bg-[#fafafa]">
          <div className="max-w-3xl mx-auto px-6 py-8 md:py-12">
            <p className="text-[10px] tracking-[0.3em] uppercase text-gray-400 font-medium mb-3">
              Legal
            </p>
            <h1 className="text-3xl md:text-4xl font-serif tracking-wide text-[#111] mb-4">
              Privacy Policy
            </h1>
            <p className="text-sm text-gray-400">Last updated: June 2025</p>
          </div>
        </div>

        {/* Intro */}
        <div className="max-w-3xl mx-auto px-6 pt-8 pb-1">
          <p className="text-sm text-gray-500 leading-relaxed border-l-2 border-[#111] pl-5">
            Welcome to Tobeque. We are committed to protecting your privacy and ensuring a safe
            shopping experience. This Privacy Policy explains how we collect, use, share, and
            safeguard your information when you visit our website, make a purchase, or interact with
            us.
          </p>
          <p className="text-sm text-gray-500 leading-relaxed mt-4 pl-5 border-l-2 border-gray-200">
            By accessing or using our website, you agree to the practices described in this Privacy
            Policy.
          </p>
        </div>

        {/* Sections */}
        <div className="max-w-3xl mx-auto px-6 py-6">
          <div className="flex flex-col divide-y divide-gray-100">
            {SECTIONS.map((section) => (
              <section key={section.number} className="py-6">
                <div className="flex items-start gap-6">
                  {/* Section number */}
                  <span className="text-sm text-gray-400 font-bold font-mono mt-0.5 select-none w-7 shrink-0">
                    {section.number}
                  </span>

                  <div className="flex-1">
                    <h2 className="text-sm font-semibold tracking-[0.15em] uppercase text-[#111] mb-3">
                      {section.title}
                    </h2>

                    {section.intro && (
                      <p className="text-sm text-gray-500 leading-relaxed mb-3">
                        {section.intro}
                      </p>
                    )}

                    {/* Top-level bullets */}
                    {'bullets' in section && section.bullets && (
                      <ul className="flex flex-col gap-2 mb-3">
                        {(section.bullets as string[]).map((bullet) => (
                          <li
                            key={bullet}
                            className="flex items-start gap-3 text-sm text-gray-500 leading-relaxed"
                          >
                            <span className="mt-[7px] w-1 h-1 rounded-full bg-gray-300 shrink-0" />
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Note */}
                    {'note' in section && section.note && (
                      <p className="text-sm text-gray-400 leading-relaxed italic mt-2">
                        {section.note}
                      </p>
                    )}

                    {/* Subsections (for Information We Collect) */}
                    {'subsections' in section && section.subsections && (
                      <div className="flex flex-col gap-6 mt-2">
                        {section.subsections.map((sub) => (
                          <div key={sub.label}>
                            <p className="text-xs font-semibold tracking-wide text-[#333] mb-1">
                              {sub.label}
                            </p>
                            <p className="text-sm text-gray-500 leading-relaxed mb-2">{sub.text}</p>
                            <ul className="flex flex-col gap-2">
                              {sub.bullets.map((bullet) => (
                                <li
                                  key={bullet}
                                  className="flex items-start gap-3 text-sm text-gray-500 leading-relaxed"
                                >
                                  <span className="mt-[7px] w-1 h-1 rounded-full bg-gray-300 shrink-0" />
                                  {bullet}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </section>
            ))}
          </div>

          {/* Contact Section */}
          <div className="pt-10 border-t border-gray-100 mt-4">
            <div className="flex items-start gap-6">
              <span className="text-sm text-gray-400 font-bold font-mono mt-0.5 select-none w-7 shrink-0">
                10
              </span>
              <div className="flex-1">
                <h2 className="text-sm font-semibold tracking-[0.15em] uppercase text-[#111] mb-3">
                  Contact Us
                </h2>
                <p className="text-sm text-gray-500 leading-relaxed mb-5">
                  For any questions, concerns, or requests related to this Privacy Policy, please
                  contact:
                </p>
                <div className="bg-[#fafafa] border border-gray-100 p-6 inline-flex flex-col gap-2">
                  <p className="text-sm font-semibold text-[#111] tracking-wide">
                    Tobeque – Women's Clothing Brand
                  </p>
                  <p className="text-sm text-gray-500">
                    Email:{' '}
                    <a
                      href="mailto:care@tobeque.com"
                      className="text-[#111] underline underline-offset-2 hover:opacity-70 transition-opacity"
                    >
                      care@tobeque.com
                    </a>
                  </p>
                  <p className="text-sm text-gray-500">
                    Phone:{' '}
                    <a
                      href="tel:+919811143979"
                      className="text-[#111] underline underline-offset-2 hover:opacity-70 transition-opacity"
                    >
                      +91 98111 43979
                    </a>
                  </p>
                  <p className="text-sm text-gray-500">
                    Website:{' '}
                    <Link
                      to="/"
                      className="text-[#111] underline underline-offset-2 hover:opacity-70 transition-opacity cursor-pointer"
                    >
                      www.tobeque.com
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
