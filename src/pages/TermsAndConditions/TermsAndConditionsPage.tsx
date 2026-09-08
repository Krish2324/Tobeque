import { useEffect } from 'react';
import { Navbar } from '../../components/Navbar/Navbar';
import { Footer } from '../../components/Footer/Footer';

export function TermsAndConditionsPage() {
  useEffect(() => {
    document.title = "Terms & Conditions | Tobeque";
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
              Terms & Conditions
            </h1>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-6 py-8 md:py-12">
          <div className="prose prose-sm md:prose-base prose-neutral max-w-none prose-headings:font-semibold prose-headings:tracking-[0.15em] prose-headings:uppercase prose-headings:text-[#111] prose-headings:text-sm prose-p:text-gray-500 prose-p:leading-relaxed prose-li:text-gray-500 prose-a:text-[#111] prose-a:underline">
            <p><strong>Last updated: {new Date().toLocaleDateString()}</strong></p>
            
            <h3>1. Agreement to Terms</h3>
            <p>
              These Terms and Conditions constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and Tobeque ("we," "us" or "our"), concerning your access to and use of our website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto.
            </p>
            <p>
              You agree that by accessing the site, you have read, understood, and agree to be bound by all of these Terms and Conditions. If you do not agree with all of these Terms and Conditions, then you are expressly prohibited from using the site and you must discontinue use immediately.
            </p>

            <h3>2. Intellectual Property Rights</h3>
            <p>
              Unless otherwise indicated, the site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the site (collectively, the "Content") and the trademarks, service marks, and logos contained therein (the "Marks") are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws and various other intellectual property rights.
            </p>

            <h3>3. User Representations</h3>
            <p>
              By using the Site, you represent and warrant that:
            </p>
            <ul>
              <li>All registration information you submit will be true, accurate, current, and complete.</li>
              <li>You will maintain the accuracy of such information and promptly update such registration information as necessary.</li>
              <li>You have the legal capacity and you agree to comply with these Terms and Conditions.</li>
              <li>You will not access the site through automated or non-human means, whether through a bot, script or otherwise.</li>
              <li>You will not use the site for any illegal or unauthorized purpose.</li>
            </ul>

            <h3>4. Products</h3>
            <p>
              We make every effort to display as accurately as possible the colors, features, specifications, and details of the products available on the Site. However, we do not guarantee that the colors, features, specifications, and details of the products will be accurate, complete, reliable, current, or free of other errors, and your electronic display may not accurately reflect the actual colors and details of the products.
            </p>
            <p>
              All products are subject to availability, and we cannot guarantee that items will be in stock. We reserve the right to discontinue any products at any time for any reason. Prices for all products are subject to change.
            </p>

            <h3>5. Purchases and Payment</h3>
            <p>
              We accept various forms of payment. You agree to provide current, complete, and accurate purchase and account information for all purchases made via the Site. You further agree to promptly update account and payment information, including email address, payment method, and payment card expiration date, so that we can complete your transactions and contact you as needed.
            </p>

            <h3>6. Return Policy</h3>
            <p>
              Please review our Return Policy posted on the Site prior to making any purchases. All returns must be postmarked within 30 days of the purchase date. All returned items must be in new and unused condition, with all original tags and labels attached.
            </p>

            <h3>7. Contact Us</h3>
            <p>
              In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at:
              <br/>
              <strong>Email:</strong> legal@tobeque.com
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
