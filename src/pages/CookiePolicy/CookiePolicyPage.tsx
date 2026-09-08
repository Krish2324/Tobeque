import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../../components/Navbar/Navbar';
import { Footer } from '../../components/Footer/Footer';

export function CookiePolicyPage() {
  useEffect(() => {
    document.title = "Cookie Policy | Tobeque";
  }, []);

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
          </div>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-6 py-8 md:py-12">
          <div className="prose prose-sm md:prose-base prose-neutral max-w-none prose-headings:font-semibold prose-headings:tracking-[0.15em] prose-headings:uppercase prose-headings:text-[#111] prose-headings:text-sm prose-p:text-gray-500 prose-p:leading-relaxed prose-li:text-gray-500 prose-a:text-[#111] prose-a:underline">
            <p className="font-medium text-gray-700">
              Last updated: 30 July 2026
            </p>

            <h3 className="mt-8">1. What Are Cookies</h3>
            <p>
              Cookies are small text files that are placed on your computer, phone, or other device when you visit a website. They are widely used to make websites work efficiently, remember your preferences, and provide information to site owners. This page explains what cookies we use, why we use them, and the choices available to you.
            </p>

            <h3 className="mt-8">2. How We Use Cookies</h3>
            <p>
              We use cookies to operate our Site (tobeque.com) properly, process your orders securely, remember your preferences, and understand how visitors use our Site so that we can improve your experience. Some cookies are strictly necessary for the Site to function: for example, to keep items in your cart or complete a checkout. Others are optional and used for analytics or personalisation, and are set only where you have provided consent, in line with applicable Indian law.
            </p>

            <h3 className="mt-8">3. Managing and Disabling Cookies</h3>
            <p>
              You can manage your cookie preferences at any time through our <Link to="/cookie-settings" className="text-[#111] underline">Cookie Settings</Link> page, or by adjusting the settings in your browser. Most browsers allow you to view, block, or delete cookies through their settings menu: check your browser&apos;s &quot;Help&quot; section for instructions specific to your browser.
            </p>
            <p>
              Please note that blocking or disabling certain cookies, particularly essential cookies, may affect the functionality of the Site: for example, you may be unable to log in, add items to your cart, or complete a purchase.
            </p>

            <h3 className="mt-8">4. Categories of Cookies We Use</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Strictly Necessary / Essential Cookies:</strong> required for core Site functionality, such as securely logging into your account, maintaining your shopping cart, and processing payments during checkout. These cannot be switched off, as the Site cannot function properly without them.
              </li>
              <li>
                <strong>Account and Login Cookies:</strong> used to manage the sign-up process, remember that you are logged in, and keep you authenticated as you move between pages, so you don&apos;t have to log in repeatedly.
              </li>
              <li>
                <strong>Order Processing Cookies:</strong> used to remember your order and cart contents as you move through the checkout process, ensuring your order is processed correctly.
              </li>
              <li>
                <strong>Performance and Analytics Cookies:</strong> help us understand how visitors interact with our Site (e.g., which pages are visited most, how users navigate the Site) so we can improve usability and content. These are set only with your consent.
              </li>
              <li>
                <strong>Preference/Functional Cookie:</strong> remember your choices, such as language, region, or display preferences, to provide a more tailored experience.
              </li>
            </ul>

            <h3 className="mt-8">5. Third-Party Cookies</h3>
            <p>
              In certain cases, we also use cookies set by trusted third parties who provide services to us, including:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Google Analytics:</strong> to help us understand Site traffic and usage patterns.
              </li>
              <li>
                <strong>Meta (Facebook) Pixel and similar advertising tools:</strong> to measure and, where you have consented, deliver more relevant advertising.
              </li>
              <li>
                <strong>Payment gateway providers:</strong> to facilitate secure order processing.
              </li>
            </ul>
            <p className="mt-4">
              These third-party cookies are governed by the respective third party&apos;s own privacy and cookie policies, and we encourage you to review them. We do not control how these third parties use the data collected via their cookies beyond the purposes for which we have engaged them.
            </p>

            <h3 className="mt-8">6. Your Consent</h3>
            <p>
              By continuing to browse or use tobeque.com, you consent to the use of essential cookies necessary for the Site to function. For non-essential cookies (such as analytics and advertising cookies), we will seek your consent through a cookie banner or the <Link to="/cookie-settings" className="text-[#111] underline">Cookie Settings</Link> page, and you may withdraw this consent at any time.
            </p>

            <h3 className="mt-8">7. Changes to This Policy</h3>
            <p>
              We may update this Cookies Policy from time to time to reflect changes in the cookies we use or for legal or regulatory reasons. Any changes will be posted on this page along with a revised &quot;Last updated&quot; date.
            </p>

            <h3 className="mt-8">8. Contact Us</h3>
            <p>
              If you have any questions regarding our use of cookies, please contact us at:
            </p>
            <div className="mt-3 p-4 bg-gray-50 border border-gray-100 rounded-lg text-gray-700 space-y-1">
              <p><strong>Email:</strong> <a href="mailto:care@tobeque.com" className="text-[#111] underline">care@tobeque.com</a></p>
              <p><strong>Website:</strong> <a href="https://www.tobeque.com" target="_blank" rel="noopener noreferrer" className="text-[#111] underline">www.tobeque.com</a></p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

