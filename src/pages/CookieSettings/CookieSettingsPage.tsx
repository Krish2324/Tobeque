import { useState } from 'react';
import { Navbar } from '../../components/Navbar/Navbar';
import { Footer } from '../../components/Footer/Footer';
import { Link } from 'react-router-dom';

const COOKIE_CATEGORIES = [
  {
    id: 'necessary',
    title: 'Strictly necessary cookies',
    content:
      'These cookies are necessary for the normal functioning of the Platform and cannot be switched off in our systems. They are generally set automatically as a response to actions you have taken—like setting privacy preferences, logging in into your account, or filling out forms. You may set your browser to block or inform you about these cookies if you want, but please be aware that doing this might lead certain parts of the Platform not to work properly.',
  },
  {
    id: 'functionality',
    title: 'Functionality or customisation cookies',
    content:
      'These cookies improve the Platform’s functionality and personalisation. They can be implemented by us or third parties whose services have been integrated into our pages. If you do not accept these cookies, some of our services will not work properly. To enable these cookies or disable them toggle the button above. "Active" indicates that these cookies may be used. "Inactive" indicates that these cookies will not be used.',
  },
  {
    id: 'analysis',
    title: 'Analysis cookies',
    content:
      'These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us to know which pages are the most and least popular and see how visitors move around the site. All information these cookies collect is aggregated and therefore anonymous.',
  },
  {
    id: 'advertising',
    title: 'Cross-Contextual Behavioral Advertising Cookies',
    content:
      'These cookies are placed by our advertising partners and can be found across the Platform. They enable third parties to create a profile of your interests to deliver relevant adverts on other websites. If you opt to turn off these cookies, you might see less tailored advertising. You can control their use by clicking the button above — choosing "Active" turns on these cookies, while "Inactive" turns them off.',
  },
  {
    id: 'social',
    title: 'Social Media Cookies',
    content:
      'These cookies are set by our advertising partners and can be used throughout the Platform. They assist in making a profile based on your interests so that more relevant advertising is displayed to you on other sites. If you do not enable these cookies, the advertisements you are shown may not be as relevant to you. Enable or disable them using the toggle above. When set to "Active," these cookies are permitted. And when set to "Inactive," they are inhibited.',
  },
];

export function CookieSettingsPage() {
  const [openSection, setOpenSection] = useState<string | null>('necessary');

  const toggleSection = (id: string) => {
    setOpenSection(openSection === id ? null : id);
  };

  return (
    <>
      <Navbar />
      <main className="pt-16 bg-white min-h-screen pb-16">
        {/* Page Header */}
        <div className="border-b border-gray-100 bg-[#fafafa]">
          <div className="max-w-4xl mx-auto px-6 py-8 md:py-12">
            <h1 className="text-2xl md:text-3xl font-serif tracking-wide text-[#111] mb-2">
              Privacy Preference Center
            </h1>
          </div>
        </div>

        {/* Intro */}
        <div className="max-w-4xl mx-auto px-6 pt-10 pb-8 space-y-5">
          <p className="text-[13px] leading-relaxed text-gray-500">
            Cookies and other similar technologies are fundamental to the correct functioning of our platform. Their main function is to improve your navigation, enhance performance, and allow us to constantly optimize our services.
          </p>
          <p className="text-[13px] leading-relaxed text-gray-500">
            We respect your device’s privacy settings. Depending on those settings, we might use first-party and third-party cookies for analytical purposes and to provide advertising that is tailored to your interests—displayed across third-party websites and applications—based on your user profile and browsing behavior.
          </p>
          <p className="text-[13px] leading-relaxed text-gray-500">
            This page contains detailed information on the cookies that we use. Here, you can control your cookie preferences by allowing or disallowing particular cookie categories, with the exception of cookies that are necessary for the proper functioning of the platform.
          </p>
          <p className="text-[13px] leading-relaxed text-gray-500">
            Important note: disabling some cookies might impact some performance features or reduce the overall functioning of the platform.
          </p>
          <p className="text-[13px] leading-relaxed text-gray-500">
            To opt out of the "sale" of your personal data, simply untick the box for Behavioural Advertising Cookies.
          </p>
          <p className="text-[13px] leading-relaxed text-gray-500">
            For further information, please see our <Link to="/cookie-policy" className="underline hover:text-primary transition-colors">Cookie Policy</Link>.
          </p>
        </div>

        {/* Accordions */}
        <div className="max-w-4xl mx-auto px-6">
          <div className="space-y-4">
            {COOKIE_CATEGORIES.map((category) => {
              const isOpen = openSection === category.id;
              return (
                <div key={category.id} className="border border-gray-200 bg-white">
                  <button
                    onClick={() => toggleSection(category.id)}
                    className="w-full flex items-center gap-4 px-6 py-4 text-left hover:bg-[#fafafa] transition-colors focus:outline-none"
                  >
                    {isOpen ? (
                      <svg className="w-4 h-4 text-[#111] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" /></svg>
                    ) : (
                      <svg className="w-4 h-4 text-[#111] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                    )}
                    <span className="text-[14px] font-semibold tracking-wide text-[#111]">
                      {category.title}
                    </span>
                  </button>
                  
                  {isOpen && (
                    <div className="px-6 py-5 border-t border-gray-100 bg-white">
                      <p className="text-[13px] leading-relaxed text-gray-500">
                        {category.content}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
