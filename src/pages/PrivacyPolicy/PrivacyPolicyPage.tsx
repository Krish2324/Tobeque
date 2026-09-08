import { useEffect } from 'react';
import { Navbar } from '../../components/Navbar/Navbar';
import { Footer } from '../../components/Footer/Footer';

export function PrivacyPolicyPage() {
  useEffect(() => {
    document.title = "Privacy Policy | Tobeque";
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
              Privacy Policy
            </h1>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-6 py-8 md:py-12">
          <div className="prose prose-sm md:prose-base prose-neutral max-w-none prose-headings:font-semibold prose-headings:tracking-[0.15em] prose-headings:uppercase prose-headings:text-[#111] prose-headings:text-sm prose-p:text-gray-500 prose-p:leading-relaxed prose-li:text-gray-500 prose-a:text-[#111] prose-a:underline">
            <p className="font-medium text-gray-700">
              Last updated: 30 July 2026
            </p>

            <h3 className="mt-8">1. Introduction</h3>
            <p>
              At Tobeque (&quot;Tobeque,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit tobeque.com (the &quot;Site&quot;), use our mobile application, or make a purchase from us.
            </p>
            <p>
              This Policy is published in accordance with the provisions of the Information Technology Act, 2000, the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011 (&quot;SPDI Rules&quot;), and, where applicable, the Digital Personal Data Protection Act, 2023 (&quot;DPDPA&quot;) and rules issued thereunder.
            </p>
            <p>
              By accessing or using the Site, you consent to the collection, use, and disclosure of your information as described in this Policy. If you do not agree with the terms of this Privacy Policy, please do not access or use the Site.
            </p>

            <h3 className="mt-8">2. Information We Collect</h3>
            <p>
              We may collect the following categories of information about you:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Personal Data:</strong> such as your name, shipping and billing address, email address, telephone number, date of birth, and gender/demographic information, typically collected when you create an account, place an order, or contact us.
              </li>
              <li>
                <strong>Financial Data:</strong> limited data relating to your payment method (e.g., last four digits of a card, UPI ID, transaction reference), collected when you purchase, return, or exchange a product. Full payment card details are collected and processed directly by our RBI-authorized payment gateway partners and are not stored on our servers.
              </li>
              <li>
                <strong>Derivative/Usage Data:</strong> information our servers or analytics tools automatically collect when you access the Site, such as your IP address, device and browser type, operating system, access times, referring URLs, and pages viewed.
              </li>
              <li>
                <strong>Order and Transaction Data:</strong> your purchase history, wishlist, cart contents, returns, exchanges, and refund requests.
              </li>
              <li>
                <strong>Communications Data:</strong> information you provide when you contact customer care, WhatsApp support, or respond to surveys, reviews, or feedback requests.
              </li>
              <li>
                <strong>Cookies and Tracking Data:</strong> as described in our separate Cookies Policy.
              </li>
            </ul>
            <p className="mt-4">
              We do not intentionally collect any sensitive personal data or information (as defined under the SPDI Rules), such as health data, biometric data, or religious/political beliefs, and request that you do not submit such information to us.
            </p>

            <h3 className="mt-8">3. How We Use Your Information</h3>
            <p>
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Create, verify, and manage your account.</li>
              <li>Process and fulfil your orders, payments, returns, exchanges, and refunds, and send related communications (order confirmations, invoices, shipping updates).</li>
              <li>Respond to customer service requests and support tickets.</li>
              <li>Personalise your shopping experience and recommend products.</li>
              <li>Send you marketing communications, offers, and newsletters, where you have opted in: you may unsubscribe at any time using the link in any marketing email or by contacting us.</li>
              <li>Improve the Site, detect and prevent fraud, and maintain security.</li>
              <li>Comply with applicable Indian laws, regulations, and lawful requests from government or regulatory authorities.</li>
            </ul>
            <p className="mt-4">
              We process your Personal Data based on your consent (given at the time of registration, checkout, or opt-in), for the performance of a contract with you (fulfilling your orders), and to comply with our legal obligations.
            </p>

            <h3 className="mt-8">4. Disclosure of Your Information</h3>
            <p>
              We do not sell your personal information. We may share your information in the following circumstances:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Service Providers:</strong> with third parties who perform services on our behalf, including payment gateways, logistics and courier partners, cloud hosting providers, SMS/email service providers, and analytics or advertising platforms (such as Google Analytics or Meta Pixel), solely for the purposes described in this Policy.
              </li>
              <li>
                <strong>Business Transfers:</strong> in connection with a merger, acquisition, or sale of assets, where your information may be transferred as part of that transaction.
              </li>
              <li>
                <strong>Legal Requirements:</strong> where disclosure is necessary to comply with applicable law, court order, or governmental request, or to protect the rights, property, or safety of Tobeque, our customers, or others.
              </li>
              <li>
                <strong>With Your Consent:</strong> for any other purpose disclosed to you at the time you provide the information, or with your consent.
              </li>
            </ul>
            <p className="mt-4">
              Where your information is transferred outside India (for example, to a cloud service provider), we take reasonable steps to ensure it continues to be protected in accordance with this Policy and applicable Indian law.
            </p>

            <h3 className="mt-8">5. Data Retention</h3>
            <p>
              We retain your personal information for as long as necessary to fulfil the purposes described in this Policy, including to comply with our legal, accounting, tax, or reporting obligations (such as those under Indian company and consumer protection law), resolve disputes, and enforce our agreements. Order and transaction records are typically retained for the period mandated under applicable Indian tax and consumer protection regulations.
            </p>

            <h3 className="mt-8">6. Your Rights</h3>
            <p>
              Subject to applicable law, you have the right to:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Access the personal data we hold about you.</li>
              <li>Request correction of inaccurate or incomplete data.</li>
              <li>Request erasure of your personal data or withdraw consent, subject to our legitimate need to retain certain data for legal, accounting, or order-fulfilment purposes.</li>
              <li>Object to or opt out of marketing communications at any time.</li>
              <li>Lodge a grievance with our Grievance Officer (see Section 9) if you believe your data has been misused.</li>
            </ul>
            <p className="mt-4">
              To exercise any of these rights, please write to us at the contact details below. You can also manage or delete your account directly via the &quot;Delete Account&quot; option on the Site, or request this by writing to us.
            </p>

            <h3 className="mt-8">7. Children&apos;s Privacy</h3>
            <p>
              The Site is not directed at children under the age of 18. We do not knowingly collect personal data from children without verifiable consent from a parent or legal guardian. If you believe a child has provided us with personal data without such consent, please contact us so we can remove it.
            </p>

            <h3 className="mt-8">8. Security of Your Information</h3>
            <p>
              We implement reasonable security practices and procedures, including administrative, technical, and physical safeguards, in line with the SPDI Rules, to help protect your personal information from unauthorised access, alteration, disclosure, or destruction. Payment transactions are encrypted and processed through PCI-DSS-compliant, RBI-authorized payment gateways.
            </p>
            <p>
              While we strive to use commercially acceptable means to protect your information, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>

            <h3 className="mt-8">9. Changes to This Policy</h3>
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our practices or applicable law. Any changes will be posted on this page with a revised &quot;Last updated&quot; date. We encourage you to review this Policy periodically.
            </p>

            <h3 className="mt-8">10. Contact Us</h3>
            <p>
              If you have questions or comments about this Privacy Policy, please contact us at:
            </p>
            <div className="mt-3 p-4 bg-gray-50 border border-gray-100 rounded-lg text-gray-700 space-y-1">
              <p><strong>Email:</strong> <a href="mailto:care@tobeque.com" className="text-[#111] underline">care@tobeque.com</a></p>
              <p><strong>Phone:</strong> <a href="tel:+91844700200" className="text-[#111] underline">+91 844700200</a></p>
              <p><strong>Address:</strong> 399, Electronic City, Phase IV, Udyog Vihar, Sector 18, Gurugram, Haryana 122015</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

