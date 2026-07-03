import { Navbar } from '../../components/Navbar/Navbar';
import { Footer } from '../../components/Footer/Footer';
import { Link } from 'react-router-dom';

const SECTIONS = [
  {
    number: '01',
    title: 'What are cookies?',
    intro: 'Cookies are small text files that are saved on your device (computer, tablet, or smartphone) when you visit websites. They help us remember your preferences, improve site performance, and generally create a better shopping experience.',
  },
  {
    number: '02',
    title: 'Types of cookies we use',
    intro: 'We use different types of cookies to ensure our website functions correctly and to provide you with the best possible experience:',
    subsections: [
      {
        label: 'a. Essential Cookies',
        text: 'Some cookies are required for a website to work properly. These cookies enable the website to function properly, e.g., securely logging in to the site, a shopping cart, allowing payment processing.',
      },
      {
        label: 'b. Performance and Analytics Cookies',
        text: 'These are cookies that help us measure how visitors are interacting with our site – which pages have the most visits, how do people get to their desired pages, etc... This allows us to improve our website’s usability and content.',
      },
      {
        label: 'c. Functional Cookies',
        text: 'These cookies remember things like your choices (for example, username, language, or region) and provide tailored and enhanced features.',
      },
      {
        label: 'd. Advertising and Targeting Cookies',
        text: 'These cookies are placed by third-party advertisers. The data collected from these cookies helps advertisers show you targeted advertising based on your current browsing behavior.',
      },
    ],
  },
  {
    number: '03',
    title: 'Third-party Cookies',
    intro: 'You may come across third-party cookies we have given permission to save on your device (for example, Google’s Analytics, Facebook Pixel, etc.). These cookies are governed by the privacy policy of the respective third party and are often required to facilitate things like advertising, analytics, and other purposes.',
  },
  {
    number: '04',
    title: 'Cookies Management',
    intro: 'You can manage or disable cookies with your browser settings. Keep in mind that if you block certain cookies, it may affect your experience of our website and might not work well with some features.',
    subsections: [
      {
        label: 'For Chrome',
        text: 'Go to chrome://settings/cookies',
      },
      {
        label: 'For Firefox',
        text: 'Go to about:preferences#privacy',
      },
      {
        label: 'For Safari',
        text: 'Go to Preferences > Privacy',
      },
      {
        label: 'For Edge',
        text: 'Go to Settings > Site permissions > Cookies and site data',
      },
    ],
  },
  {
    number: '05',
    title: 'Changes to our Policy',
    intro: 'From time to time, we may update this Cookies Policy. Any changes will be posted on this page and updated with an effective date.',
  }
];

export function CookiePolicyPage() {
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
              Cookies Policy
            </h1>
            <p className="text-sm text-gray-400">Last updated: June 2025</p>
          </div>
        </div>

        {/* Intro */}
        <div className="max-w-3xl mx-auto px-6 pt-8 pb-1">
          <p className="text-sm text-gray-500 leading-relaxed border-l-2 border-[#111] pl-5">
            This Cookies Policy explains how and why cookies and other tracking technologies 
            are used on our website. Please read this policy carefully to understand how we 
            collect and use your data through these technologies.
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

                    {/* Subsections */}
                    {'subsections' in section && section.subsections && (
                      <div className="flex flex-col gap-6 mt-4">
                        {section.subsections.map((sub) => (
                          <div key={sub.label}>
                            <p className="text-xs font-semibold tracking-wide text-[#333] mb-1">
                              {sub.label}
                            </p>
                            <p className="text-sm text-gray-500 leading-relaxed mb-2">{sub.text}</p>
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
                06
              </span>
              <div className="flex-1">
                <h2 className="text-sm font-semibold tracking-[0.15em] uppercase text-[#111] mb-3">
                  Contact Us
                </h2>
                <p className="text-sm text-gray-500 leading-relaxed mb-5">
                  If you have any questions regarding our use of cookies, please contact:
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
