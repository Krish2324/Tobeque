import { Navbar } from '../../components/Navbar/Navbar';
import { Footer } from '../../components/Footer/Footer';

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
              Cookie Policy
            </h1>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-6 py-8 md:py-12">
          <div className="prose prose-sm md:prose-base prose-neutral max-w-none prose-headings:font-semibold prose-headings:tracking-[0.15em] prose-headings:uppercase prose-headings:text-[#111] prose-headings:text-sm prose-p:text-gray-500 prose-p:leading-relaxed prose-li:text-gray-500 prose-a:text-[#111] prose-a:underline">
            <p><strong>Last updated: {new Date().toLocaleDateString()}</strong></p>
            
            <h3>1. What Are Cookies</h3>
            <p>
              As is common practice with almost all professional websites, this site uses cookies, which are tiny files that are downloaded to your computer, to improve your experience. This page describes what information they gather, how we use it and why we sometimes need to store these cookies. We will also share how you can prevent these cookies from being stored however this may downgrade or 'break' certain elements of the sites functionality.
            </p>

            <h3>2. How We Use Cookies</h3>
            <p>
              We use cookies for a variety of reasons detailed below. Unfortunately, in most cases, there are no industry standard options for disabling cookies without completely disabling the functionality and features they add to this site. It is recommended that you leave on all cookies if you are not sure whether you need them or not in case they are used to provide a service that you use.
            </p>

            <h3>3. Disabling Cookies</h3>
            <p>
              You can prevent the setting of cookies by adjusting the settings on your browser (see your browser Help for how to do this). Be aware that disabling cookies will affect the functionality of this and many other websites that you visit. Disabling cookies will usually result in also disabling certain functionality and features of this site. Therefore it is recommended that you do not disable cookies.
            </p>

            <h3>4. The Cookies We Set</h3>
            <ul>
              <li><strong>Account related cookies:</strong> If you create an account with us then we will use cookies for the management of the signup process and general administration.</li>
              <li><strong>Login related cookies:</strong> We use cookies when you are logged in so that we can remember this fact. This prevents you from having to log in every single time you visit a new page.</li>
              <li><strong>Orders processing related cookies:</strong> This site offers e-commerce or payment facilities and some cookies are essential to ensure that your order is remembered between pages so that we can process it properly.</li>
              <li><strong>Site preferences cookies:</strong> In order to provide you with a great experience on this site we provide the functionality to set your preferences for how this site runs when you use it.</li>
            </ul>

            <h3>5. Third Party Cookies</h3>
            <p>
              In some special cases we also use cookies provided by trusted third parties. The following section details which third party cookies you might encounter through this site.
            </p>
            <ul>
              <li>This site uses Google Analytics which is one of the most widespread and trusted analytics solution on the web for helping us to understand how you use the site and ways that we can improve your experience.</li>
              <li>From time to time we test new features and make subtle changes to the way that the site is delivered. When we are still testing new features these cookies may be used to ensure that you receive a consistent experience.</li>
            </ul>

            <h3>6. More Information</h3>
            <p>
              Hopefully that has clarified things for you and as was previously mentioned if there is something that you aren't sure whether you need or not it's usually safer to leave cookies enabled in case it does interact with one of the features you use on our site.
            </p>
            <p>
              If you are still looking for more information then you can contact us through our preferred contact method:
              <br/>
              <strong>Email:</strong> support@tobeque.com
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
