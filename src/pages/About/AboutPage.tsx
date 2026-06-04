
import { Footer } from "../../components/Footer/Footer";
import { Navbar } from "../../components/Navbar/Navbar";



import heroBanner from "../../assets/images/hero-spring-edit.jpg";
import productSheerTop from "../../assets/images/product-sheer-top-1.jpg";
import productDenim from "../../assets/images/product-denim-1.jpg";
import campaignBanner from "../../assets/images/campaign-banner.jpg";

export function AboutPage() {

  return (
    <div className="bg-background text-on-background font-body-md antialiased overflow-x-hidden">
      {/* TopNavBar */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative w-full h-[60vh] md:h-[70vh] flex items-center justify-center bg-surface-container mt-[72px]">
        <img src={heroBanner} alt="Tobeque About Us" className="absolute inset-0 w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 text-center px-4 pt-16">
          <h1 className="font-display-lg text-[3rem] md:text-[5rem] text-on-primary mb-4 drop-shadow-sm uppercase tracking-widest">
            About Us
          </h1>
          <p className="font-body-lg text-body-lg text-on-primary/90 max-w-2xl mx-auto tracking-wide">
            Confidence is the best outfit. Tobeque just completes it.
          </p>
        </div>
      </section>

      {/* Intro section */}
      <section className="w-full max-w-4xl mx-auto px-6 pt-12 pb-16 md:pt-16 md:pb-24 text-center">
        <h2 className="font-display-md text-display-md text-primary mb-6">
          We Are Tobeque
        </h2>
        <h3 className="font-headline-md text-headline-md text-secondary mb-10 tracking-wide">
          Luxury Teen Wear Designed for the New Generation
        </h3>
        <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed max-w-3xl mx-auto">
          Tobeque is more than just clothing—it's a brand that grows with you. Our designs evolve with changing styles, personalities, and moments, while always staying rooted in comfort and quality. Every piece is styled to help you feel confident, expressive, and ready to shine, no matter where your journey takes you.
        </p>
      </section>

      {/* Structured Sections */}
      {/* 1. Our Craft */}
      <section className="w-full flex flex-col md:flex-row items-stretch bg-[#FAF9F6]">
        <div className="w-full md:w-1/2 aspect-square md:aspect-auto md:min-h-[70vh] relative overflow-hidden">
          <img src={productSheerTop} className="w-full h-full object-cover" alt="Our Craft - Premium Comfort" />
        </div>
        <div className="w-full md:w-1/2 p-12 md:p-24 lg:p-32 flex flex-col justify-center">
          <span className="font-label-caps text-label-caps text-secondary uppercase tracking-[0.3em] mb-6">Our Craft</span>
          <h2 className="font-display-sm text-display-sm text-primary mb-8">Premium Comfort, Everyday Wear</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mb-10 leading-relaxed">
            Tobeque outfits are crafted with high-quality, skin-friendly fabrics that feel soft, breathable, and comfortable all day long. Designed especially for teenage girls, each piece balances premium finishing with easy movement—so you can stay confident, stylish, and comfortable whether it's a school day, a casual outing, or a special moment.
          </p>
          <div className="grid grid-cols-1 gap-6">
            <div className="flex items-start gap-5">
              <span className="material-symbols-outlined text-3xl text-secondary mt-1">cloud</span>
              <div>
                <h4 className="font-headline-sm text-primary mb-2">Premium-Quality Fabrics</h4>
                <p className="font-body-sm text-on-surface-variant leading-relaxed">Soft, breathable materials that feel comfortable all day and last longer.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. The TOBEQUE Woman */}
      <section className="w-full flex flex-col-reverse md:flex-row items-stretch bg-white">
        <div className="w-full md:w-1/2 p-12 md:p-24 lg:p-32 flex flex-col justify-center">
          <span className="font-label-caps text-label-caps text-secondary uppercase tracking-[0.3em] mb-6">The TOBEQUE Woman</span>
          <h2 className="font-display-sm text-display-sm text-primary mb-8">Trend-Forward Designs for Growing Confidence</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mb-10 leading-relaxed">
            Every Tobeque design is inspired by the latest fashion trends while keeping comfort and age-appropriate styling at its core. Our thoughtfully tailored silhouettes and modern details help teenage girls express their individuality with confidence—making every outfit feel stylish, empowering, and effortlessly cool.
          </p>
          <div className="grid grid-cols-1 gap-8">
            <div className="flex items-start gap-5">
              <span className="material-symbols-outlined text-3xl text-secondary mt-1">eco</span>
              <div>
                <h4 className="font-headline-sm text-primary mb-2">Teen-Perfect Fit</h4>
                <p className="font-body-sm text-on-surface-variant leading-relaxed">Designed to move with you, offering comfort without compromising style.</p>
              </div>
            </div>
            <div className="flex items-start gap-5">
              <span className="material-symbols-outlined text-3xl text-secondary mt-1">schedule</span>
              <div>
                <h4 className="font-headline-sm text-primary mb-2">Trend-Led Styling</h4>
                <p className="font-body-sm text-on-surface-variant leading-relaxed">Modern designs inspired by global trends, made age-appropriate for teens.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/2 aspect-square md:aspect-auto md:min-h-[70vh] relative overflow-hidden">
          <img src={productDenim} className="w-full h-full object-cover" alt="The Tobeque Woman - Trend-Forward Designs" />
        </div>
      </section>

      {/* 3. Sustainability */}
      <section className="w-full flex flex-col md:flex-row items-stretch bg-[#FAF9F6]">
        <div className="w-full md:w-1/2 aspect-square md:aspect-auto md:min-h-[70vh] relative overflow-hidden">
          <img src={campaignBanner} className="w-full h-full object-cover" alt="Sustainability - Made to grow with you" />
        </div>
        <div className="w-full md:w-1/2 p-12 md:p-24 lg:p-32 flex flex-col justify-center">
          <span className="font-label-caps text-label-caps text-secondary uppercase tracking-[0.3em] mb-6">Sustainability</span>
          <h2 className="font-display-sm text-display-sm text-primary mb-8">Made to grow with you, styled to shine with confidence.</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mb-10 leading-relaxed">
            We believe in creating pieces that are not only beautiful but also responsible. By focusing on premium-quality, long-lasting fabrics and timeless designs, we ensure our garments remain a cherished part of your wardrobe season after season. It’s our commitment to quality that transcends fast fashion, offering sustainable luxury for the new generation.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
