import { Navbar } from '../../components/Navbar/Navbar';
import { Footer } from '../../components/Footer/Footer';

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
          </div>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-6 py-8 md:py-12">
          <div className="prose prose-sm md:prose-base prose-neutral max-w-none prose-headings:font-semibold prose-headings:tracking-[0.15em] prose-headings:uppercase prose-headings:text-[#111] prose-headings:text-sm prose-p:text-gray-500 prose-p:leading-relaxed prose-li:text-gray-500 prose-a:text-[#111] prose-a:underline">
            <p><strong>Last updated: {new Date().toLocaleDateString()}</strong></p>
            
            <h3>1. Introduction</h3>
            <p>
              At Tobeque, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or make a purchase from us. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
            </p>

            <h3>2. Information We Collect</h3>
            <p>
              We may collect information about you in a variety of ways. The information we may collect on the Site includes:
            </p>
            <ul>
              <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, shipping address, email address, and telephone number, and demographic information.</li>
              <li><strong>Derivative Data:</strong> Information our servers automatically collect when you access the Site, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Site.</li>
              <li><strong>Financial Data:</strong> Financial information, such as data related to your payment method that we may collect when you purchase, order, return, exchange, or request information about our services from the Site.</li>
            </ul>

            <h3>3. Use of Your Information</h3>
            <p>
              Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:
            </p>
            <ul>
              <li>Create and manage your account.</li>
              <li>Process your transactions and send you related information, including purchase confirmations and invoices.</li>
              <li>Fulfill and manage purchases, orders, payments, and other transactions related to the Site.</li>
              <li>Deliver targeted advertising, coupons, newsletters, and other information regarding promotions and the Site to you.</li>
              <li>Email you regarding your account or order.</li>
            </ul>

            <h3>4. Disclosure of Your Information</h3>
            <p>
              We may share information we have collected about you in certain situations. Your information may be disclosed as follows:
            </p>
            <p>
              <strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.
            </p>

            <h3>5. Security of Your Information</h3>
            <p>
              We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
            </p>

            <h3>6. Contact Us</h3>
            <p>
              If you have questions or comments about this Privacy Policy, please contact us at:
              <br/>
              <strong>Email:</strong> privacy@tobeque.com
              <br/>
              <strong>Address:</strong> 123 Fashion Street, Style City, SC 12345
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
