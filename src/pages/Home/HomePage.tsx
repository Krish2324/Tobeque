import React, { useMemo, useState } from "react";
import { ProductCard, type Product } from "../../components/ProductCard";
import { productsData } from "../../data/products";
import { useCart } from "../../context/CartContext";
import { QuickViewModal } from "../../components/QuickViewModal/QuickViewModal";

export function HomePage() {
  const { setIsCartOpen, addToWishlist, wishlistItems, removeFromWishlist, addToCart } = useCart();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const featuredProducts: Product[] = useMemo(() => {
    const homeProductIds = [
      "square-neck-rib-top",
      "structured-black-blouse",
      "cream-silk-slip-dress",
      "classic-poplin-shirt",
      "fine-knit-linen-tee",
      "vintage-straight-denim",
      "structured-black-blouse",
      "cream-silk-slip-dress",
      "classic-poplin-shirt",
      "fine-knit-linen-tee"
    ];

    return homeProductIds
      .map((id) => productsData.find((p) => p.id === id))
      .filter((p): p is Product => !!p);
  }, []);

  const handleWishlist = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    const exists = wishlistItems.find((p) => p.name === product.name);
    if (exists) {
      removeFromWishlist(product.name);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div className="bg-background text-on-background font-body-md antialiased overflow-x-hidden">
      {/* TopNavBar */}
      <header className="bg-background dark:bg-background fixed top-0 w-full z-50 border-b border-outline-variant flat no shadows">
        <div className="flex justify-between items-center w-full px-outer-margin py-4 max-w-full mx-auto">
          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            <a
              className="text-on-surface-variant dark:text-on-secondary-fixed-variant hover:text-primary dark:hover:text-on-primary-fixed transition-colors duration-300 font-label-caps text-label-caps"
              href="#"
            >
              Shop
            </a>
            <a
              className="text-on-surface-variant dark:text-on-secondary-fixed-variant hover:text-primary dark:hover:text-on-primary-fixed transition-colors duration-300 font-label-caps text-label-caps"
              href="#"
            >
              New Arrivals
            </a>
            <a
              className="text-primary dark:text-on-primary-fixed border-b-2 border-primary pb-1 font-label-caps text-label-caps"
              href="/collection"
            >
              Collections
            </a>
            <a
              className="text-on-surface-variant dark:text-on-secondary-fixed-variant hover:text-primary dark:hover:text-on-primary-fixed transition-colors duration-300 font-label-caps text-label-caps"
              href="#"
            >
              Editorial
            </a>
            <a
              className="text-on-surface-variant dark:text-on-secondary-fixed-variant hover:text-primary dark:hover:text-on-primary-fixed transition-colors duration-300 font-label-caps text-label-caps"
              href="#"
            >
              About
            </a>
          </nav>

          {/* Brand Logo */}
          <div className="flex-1 flex justify-center md:absolute md:left-1/2 md:-translate-x-1/2">
            <a
              className="font-display-lg text-headline-md tracking-widest text-primary dark:text-on-primary-fixed uppercase"
              href="#"
            >
              TOBEQUE
            </a>
          </div>

          {/* Trailing Icons */}
          <div className="flex items-center gap-4 text-primary dark:text-on-primary-fixed">
            <button
              aria-label="Search"
              className="hover:text-primary dark:hover:text-on-primary-fixed transition-colors duration-300"
            >
              <span className="material-symbols-outlined" data-icon="search">
                search
              </span>
            </button>
            <button
              aria-label="Account"
              className="hover:text-primary dark:hover:text-on-primary-fixed transition-colors duration-300"
            >
              <span className="material-symbols-outlined" data-icon="person">
                person
              </span>
            </button>
            <button
              aria-label="Wishlist"
              className="hover:text-primary dark:hover:text-on-primary-fixed transition-colors duration-300"
            >
              <span className="material-symbols-outlined" data-icon="favorite">
                favorite
              </span>
            </button>
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="Shopping Bag"
              className="hover:text-primary dark:hover:text-on-primary-fixed transition-colors duration-300 relative"
            >
              <span
                className="material-symbols-outlined"
                data-icon="shopping_bag"
              >
                shopping_bag
              </span>
              <span className="absolute -top-1 -right-1 bg-primary text-on-primary text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {wishlistItems.length}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Video Section */}
      <section className="relative w-full h-[80vh] md:h-[90vh] mb-8">
        <div className="w-full h-full relative overflow-hidden bg-surface-container">
          <img
            alt="Cinematic fashion campaign showing a model in spring collection."
            className="w-full h-full object-cover object-top absolute inset-0"
            data-alt="A cinematic, high-fashion campaign video still featuring a model in an elegant spring ensemble. The setting is a bright, sunlit minimalist studio with soft, diffused white lighting that creates a pristine, airy atmosphere. The model wears a sophisticated beige trench coat over a white silk dress, exuding effortless luxury. The overall mood is serene, aspirational, and premium, perfectly matching the light-mode editorial aesthetic of a high-end boutique."
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBbucJ8o4Qji59noKKUVzgTupOhTX96PGDzgQpNjJa0bDQd0C2MJy4MO3hRV72-3TTp5JKtwmpZXh3OSoQvrLDnLqjq3iu_aluJ7v2NT3SR3rduv6CGPnvUYRZh2wibuLpAkUUeuO6k9zfcOqSs5D5GA4LTYIOUUZhwC0Me5NS4QCRtoJhSpsyEYZ3p51W9ynwwPx1w3DmhjoyQTz4w9gckAq5iukI8NE9jrqADUufqVg0lUlUWC3UYzyj9ZTqzU80IxbP5zWBEvg"
          />

          {/* Simulated Video Overlay for contrast */}
          <div className="absolute inset-0 bg-primary/20 mix-blend-multiply" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 z-10">
            <h1 className="font-display-lg text-display-lg text-on-primary mb-6 drop-shadow-sm">
              THE SPRING EDIT
            </h1>
            <a
              className="inline-flex items-center justify-center px-8 py-4 border border-on-primary text-on-primary font-label-caps text-label-caps hover:bg-on-primary hover:text-primary transition-colors duration-300 backdrop-blur-sm bg-primary/10"
              href="#"
            >
              Shop Now
            </a>
          </div>
        </div>
      </section>

      {/* Season Collection Carousel */}
      <section className="w-full px-1 md:px-2 mb-8 overflow-hidden">
        <h2 className="text-center font-headline-md text-headline-md text-primary mb-6">
          Season Collection
        </h2>
        <div className="marquee-container w-full">
          <div className="marquee-content flex gap-1 md:gap-1.5 w-max">
            {/* Duplicate set for seamless loop */}
            <div className="flex gap-1 md:gap-1.5 shrink-0">
              <a className="block w-64 md:w-80 group" href="#">
                <div className="aspect-[3/4] relative overflow-hidden bg-surface-container mb-4">
                  <img
                    alt="Fashion top"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    data-alt="A minimalist studio shot of a high-fashion top on an invisible mannequin. The garment is a structured, asymmetrical black blouse crafted from crisp cotton. The background is a stark, clean white, illuminated by soft, even lighting to highlight the fabric's texture and silhouette without harsh shadows. The aesthetic is extremely clean, editorial, and perfectly aligned with a luxury boutique's light-mode visual identity."
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBdnFD8OB8k4gQgVfWnNxIDf4bd3n9x5Rd-NGJpEJjpwZxeW6VUNgebYchAebxqC5gxQXIoaPB1Dx_r2-m6aqfmDUPZa3CFHNMXU98f1YQbsaFuc1Egx8dxsYb-spM3D678AxH7-iLTX5u7I_PAYWThQWoU3p5Knj4GVlqXchVSXBxWM8SkpdHNNQF60oiWIA-u-cIO3KrZjy0QwlFDPVH4RQUPraDyJkPnSSQUVGnSt2m3CDTOe-6peNPoog4RBc_RMFgXCLywQQ"
                  />
                </div>
                <h3 className="text-center font-body-md text-body-md text-primary">
                  Tops
                </h3>
              </a>

              <a className="block w-64 md:w-80 group" href="#">
                <div className="aspect-[3/4] relative overflow-hidden bg-surface-container mb-4">
                  <img
                    alt="Elegant dress"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    data-alt="A striking studio photograph of an elegant midi dress displayed flawlessly. The dress is a soft cream silk slip dress with delicate draping. The lighting is high-key and diffused, casting an almost ethereal glow over the garment against a pristine white background. The image feels airy, sophisticated, and expensive, reflecting the minimalist, high-contrast typography style of the brand's lookbook."
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4nsXD-VV3xeCHrAhaQdW9H_lcBIWfxcR9DDjG9Zhb3rdHLD1VLmjYpWqH87fkGEci-nrn4bYIVr2VZ91_vbkdLP2uzNeaAQvRj5Yq8VtukprI8BwCYr7Q58u7N2ZaRJhnEcVyjnIoCgUPdZ5BbTtHlJJb_dpiUvwx_yXuP9nqpXhhFhzi37hlpO4bhLxQwXIQULPAnJdVkKoHKU1ctsmpRsi9vUvZnO8N_0ZdsR6zVdRkkFDfeTF5ttUW01ga7ck7VcB68Bi8QQ"
                  />
                </div>
                <h3 className="text-center font-body-md text-body-md text-primary">
                  Dresses
                </h3>
              </a>

              <a className="block w-64 md:w-80 group" href="#">
                <div className="aspect-[3/4] relative overflow-hidden bg-surface-container mb-4">
                  <img
                    alt="Shirt and Blouse"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    data-alt="A crisp, editorial style shot of a tailored shirt and blouse pairing. The garment is a pristine white poplin shirt with exaggerated cuffs, styled simply against a light gray background. The lighting is sharp yet soft, emphasizing the clean lines and architectural shape of the shirt. The mood is modern, confident, and inherently feminine, characteristic of high-fashion magazine spreads."
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDlqx12hmbL2Eb7Mk8C4VY2cXxJgk-8ROqb4RCA-H6SKF5sSROG4C0PaZtKBYpVp8MlznO8Ql29yUK76IaOSs-i-xjAi2-I0CbGxv9TZ7T5pbtdi44RxhA6OSE-KkPHMUHPzYuxURgzma3WLcvqSv06rvKWUo83DHWAXKDCY5BRfC6xLA5dpA8t_439QB9qc_OIHlhtVUiK0UnxfOXOqz7wMhSIYQ7bBVHpwLH8fOZbo1qONhGZ2ymesiEgzLzbwY8ROSOHMiXdCA"
                  />
                </div>
                <h3 className="text-center font-body-md text-body-md text-primary">
                  Shirts &amp; Blouses
                </h3>
              </a>

              <a className="block w-64 md:w-80 group" href="#">
                <div className="aspect-[3/4] relative overflow-hidden bg-surface-container mb-4">
                  <img
                    alt="T-Shirt"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    data-alt="A minimal, premium studio image of a luxury essential t-shirt. The tee is a slightly sheer, finely knitted beige linen fabric, draped effortlessly. The background is a soft, tonal cream that complements the garment. Lighting is gentle and ambient, creating a feeling of relaxed sophistication. This fits perfectly within the brand's 'aspirational elegance' narrative and clean, light-mode palette."
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBAoNp2SGWH0iWUzTZzjzaUgBSnSMDhBZOjS-t66W7hDLYCNGQkzT8ahTKTXkJn7DrFM3u06KphOFpfxaDup_SL8eVepfvYpajnV1dYWs_FYJlodhu_zd9LrBMfyBHv-U4tkbaxS_ampNRYscP6YgN5NYJ_kO7N6qYG1r8xwemTXAbq1XpMvJ82QStnoue8me17AuXTN_DUMvjQMKuEgijAGy1zyjw0hDgldWU9q0UNcWUCWC9VNtUn1ayUhA32u8dq9p9SUCtK5Q"
                  />
                </div>
                <h3 className="text-center font-body-md text-body-md text-primary">
                  T-Shirts &amp; Vests
                </h3>
              </a>

              <a className="block w-64 md:w-80 group" href="#">
                <div className="aspect-[3/4] relative overflow-hidden bg-surface-container mb-4">
                  <img
                    alt="Jeans"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    data-alt="A high-end editorial shot focusing on premium denim jeans. The jeans are a classic straight-leg cut in a vintage mid-blue wash. Shot against a stark white studio backdrop, the lighting is bright and directional to highlight the denim's twill texture. The aesthetic is clean, timeless, and completely stripped of unnecessary visual noise, adhering to the fluid grid layout concept."
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGBTKQinrUZy0Vnz7Y_HoaQ57C36_u011zzUxkRfbxfw7ISlyzwG3Llij7oR6LeZZT4OLixEbuEcQ13pWsIroISOR3ucAHT6_yzHWwN36pNzPfOSW8YIhDGqWc2dX_uwXNnZH2rM-uWyu7kWCNoP0XY2taoL5UUmVJCk9Vcgio7pM6FdIk8Gy-m8uGl1g0jAm3F-YOfmideAKDqgwsYYWdNCWZ_RKPNJ8ETTLd6_Eue92bwfPqLvqcZ3bc6-SivuQjvo133u8P1A"
                  />
                </div>
                <h3 className="text-center font-body-md text-body-md text-primary">
                  Jeans &amp; Pants
                </h3>
              </a>
            </div>

            {/* Second duplicate set (minimal for performance; keep same order) */}
            <div className="flex gap-1 md:gap-1.5 shrink-0">
              {/* Tops */}
              <a className="block w-64 md:w-80 group" href="#">
                <div className="aspect-[3/4] relative overflow-hidden bg-surface-container mb-4">
                  <img
                    alt="Fashion top"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDsaRw0f02Iq9lpELWsvP_wyZCEF5tNcZ4R5rvF-yP2LUcO30yKPV8kdULpqtCVapMlHCm1nstGnVEolXj8YaObHg4kzpU_xFnSu-wmI-AyZHz_NQ3fw0b5xKW5DePy_N4KzLHEfn3Fszl8I2fbcyC4JZNfwm74fTFTvFB754LbsUGMiYyEn4JZNm6Z2iBGa2lRamko2jIM-Yx54uUyO9kqF1P1ydp6qICZCu2CL1J2dfVVfSy-5Syw2bYvdUz21z9Nac9kHXZ32g"
                  />
                </div>
                <h3 className="text-center font-body-md text-body-md text-primary">
                  Tops
                </h3>
              </a>
              {/* Dresses */}
              <a className="block w-64 md:w-80 group" href="#">
                <div className="aspect-[3/4] relative overflow-hidden bg-surface-container mb-4">
                  <img
                    alt="Elegant dress"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDcyZIhdnnntTHgHitzmnMe-enVRfS0t8_HTwVvXbi5kvFaeGeg2H0mIVjizisleE2HIOBcy3mkDyaxoO7xsksHInCofVvPzVqP8VJyhrJAc5VnxNORUzL2ioX_9CNqAG8LnRFxzSG7IVKnsADkHR0jir3k9JnO3rFBJ3i-Ajg8ezP6uct9a6o2-q2mOASY9vpn-ctFCGNbV2MZuSPWWQOj6woK4tgmnmWnZrZY6koaYIGullRD7fYHmJQjQnRGlr_cTNqHkVJmLg"
                  />
                </div>
                <h3 className="text-center font-body-md text-body-md text-primary">
                  Dresses
                </h3>
              </a>
              {/* Shirts & Blouses */}
              <a className="block w-64 md:w-80 group" href="#">
                <div className="aspect-[3/4] relative overflow-hidden bg-surface-container mb-4">
                  <img
                    alt="Shirt and Blouse"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDcwcNCJ6ErzKHnABETC8auOXlqTNVwHGQWw1xBgYDnTMolGT0VghRVMbsRvrnT-ZnKTitFLfb6ZtPzTD3WnF_jnA6lh_YGATMGO_t4sAuoDHLXcIAE-UvHTDtftD-F2DkmC9NTgeqESf1HzV6DpOUZoHJmA7ZyFww75_dhErffg5zvry6Xmq9JQZbhMKrPArVvVIduo7DnTifPoJQq_i7VjFZDTw2yZCGjrCy-93j4cbuBQHoAPPBYpEEc6M47FXKs9ZEEcJylAA"
                  />
                </div>
                <h3 className="text-center font-body-md text-body-md text-primary">
                  Shirts &amp; Blouses
                </h3>
              </a>
              {/* T-Shirts & Vests */}
              <a className="block w-64 md:w-80 group" href="#">
                <div className="aspect-[3/4] relative overflow-hidden bg-surface-container mb-4">
                  <img
                    alt="T-Shirt"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-2MA5uCOJMoQa-BTlFghGhKwPmRYqtppiblortzOjj5RHGSQUSo4NVaFJx_Y6CLsC1XQQIdE4svKZn-6vGMGqyZkoTk4A8lENcruP4f37KM9Bi36lym_KPyz1tYgwKBNJKs3BVxsvmt7Deoypo1n3FugNViGeR3YwNA9wXJoROt8URTWsolax3xPDSJjVKPC47qpLdzRJumv9zeA0JUGY8t_qCdDTuKE5o2I-cm4jbjAn9rMYbvmL4AIeGd3y6ebfxW-gVIHJ0Q"
                  />
                </div>
                <h3 className="text-center font-body-md text-body-md text-primary">
                  T-Shirts &amp; Vests
                </h3>
              </a>
              {/* Jeans */}
              <a className="block w-64 md:w-80 group" href="#">
                <div className="aspect-[3/4] relative overflow-hidden bg-surface-container mb-4">
                  <img
                    alt="Jeans"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqJmtNMmrmRdRuGZCag9nhLr1XW7R7nP8nUTFANUVlmEnX4jGpmKPFub4uS2DplitwIdXnuYP5n7BTyLxELTHSQm_inTE2DakOSjSiuvuFKiv3GDkDzZuDU19IxwTOEl6L5-niftZeWa5N3cNbaNwZl8ksTnKyqv2GSQNnt2y9kh7sbEvic1XYA-fapST297RLW94exM0hVv-vtH9oZAPmmVkSqAT2nDXLxswSnzjvBHiggeNxWOUdyHe9tMySB8w0PAvM9eBkSQ"
                  />
                </div>
                <h3 className="text-center font-body-md text-body-md text-primary">
                  Jeans &amp; Pants
                </h3>
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="w-full px-1 md:px-2 mb-6">
        <div className="flex items-center justify-between border-b border-outline-variant pb-4">
          <div className="flex items-center gap-2 cursor-pointer group">
            <h2 className="font-label-caps text-label-caps text-primary uppercase tracking-[0.2em]">
              You are in BEST SELLERS
            </h2>
            <span className="material-symbols-outlined text-sm transition-transform group-hover:rotate-180">
              expand_more
            </span>
          </div>
        </div>
      </div>

      {/* Featured Products Grid */}
      <section className="w-full px-1 md:px-2 mb-section-padding-mobile md:mb-section-padding-desktop">
        <h2 className="text-center font-headline-md text-headline-md text-primary mb-6 hidden">
          Featured Products
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-1 md:gap-1.5">
          {featuredProducts.map((p, idx) => (
            <ProductCard
              key={idx}
              product={p}
              isWishlisted={!!wishlistItems.find(item => item.name === p.name)}
              onWishlistClick={handleWishlist}
              onQuickViewClick={setQuickViewProduct}
              onAddToCartClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addToCart({ ...p, quantity: 1, selectedSize: 'S', selectedColor: 'Default' });
                setIsCartOpen(true);
              }}
            />
          ))}
        </div>
      </section>

      {/* Premium Campaign Section (static, matches structure) */}
      <section className="w-full mb-section-padding-mobile md:mb-section-padding-desktop">
        <div className="relative w-full h-[60vh] md:h-[80vh] flex items-center justify-center overflow-hidden bg-surface-container">
          <img
            alt="Luxury fashion campaign"
            className="absolute inset-0 w-full h-full object-cover object-center"
            data-alt="A wide, immersive fashion campaign banner. The image shows a group of models in elegant, neutral-toned outfits walking down a grand, sunlit architectural corridor. The lighting is dramatic yet soft, creating a rich luxury atmosphere with deep shadows and bright highlights. The overall tone is sophisticated, modern, and timeless, perfectly suited for a high-end brand's primary editorial statement."
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrM4n7-7jgZk0DDqOFSOB2IXMWJrMGJKEb2ft9dahwdydnN5EwNuaxLFNxRvl1azIyzIXGlWiLgcgayqcDi3TMgqyHHw7BsCURq8sfUXmk7tISMK_KnOxBm2kJ0hQQ0i7uBAAofOcygjBiZ0s-Fsz2JezRPlG9rtFyIR7c_CPAnrZEe01dwE6kky_8grztYGpw_Bg8tbkxPD2dgPffnzJRuJew327mHtaCJmOhhF_Imt4Ea_pvEHG6vye9C74w0OyQrDa1cAXXbg"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/40 to-transparent" />
          <div className="relative z-10 max-w-2xl px-8 text-left self-center md:ml-24">
            <span className="font-label-caps text-label-caps text-on-primary tracking-widest block mb-4 uppercase">
              New Season Arrivals
            </span>
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-primary mb-6">
              Designed for Modern Elegance
            </h2>
            <p className="font-body-lg text-body-lg text-on-primary/90 mb-8 max-w-md">
              Elevated essentials crafted for confident women who love timeless
              fashion.
            </p>
            <a
              className="inline-flex items-center justify-center px-8 py-4 border border-on-primary text-on-primary font-label-caps text-label-caps hover:bg-on-primary hover:text-primary transition-colors duration-300"
              href="#"
            >
              Explore Collection
            </a>
          </div>
        </div>
      </section>
      {/* Hot Right Now Section */}
      <section className="w-full px-outer-margin mb-section-padding-mobile md:mb-section-padding-desktop mt-section-padding-desktop flex flex-col items-center">
        <h2 className="font-headline-lg text-headline-lg text-primary mb-2 text-center">
          Hot Right Now
        </h2>
        <p className="font-body-md text-body-md text-secondary mb-12 text-center">
          Trending styles curated for the modern wardrobe.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter w-full">
          {/* Item 1 */}
          <div className="relative group rounded-2xl overflow-hidden aspect-[3/4]">
            <img
              alt="Mesh Maxi Dress"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuALpNq8IOkZqXNhTZ0WFVlHCjZjVi29o6wYONdI1cbUXsDa92sWy22Tt6yBBbEajzJYrOHaGvMBUaG3u3C7khCwFS7TTKFm4tzAu62npYA3P5TlD_V4n923KxOh4JUa5M8lcWel1sI7H0vtjxapAMm9clcZPUbs3PQj-LbwS48V19P-7ZQEaWu39cKq11TAlMH80rbUSbSLmzbO5E3zqVr_kIPgwRDHt5RJTya9UBddlL-vRX31ivlLnt6nX7TI10BENjkEuL7ZUg"
            />
            <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 rounded-full text-xs font-bold z-10">
              Trending Now
            </div>
            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end">
              <div className="flex items-end gap-3 mb-2">
                <div className="w-12 h-12 bg-white rounded flex-shrink-0 overflow-hidden">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuALpNq8IOkZqXNhTZ0WFVlHCjZjVi29o6wYONdI1cbUXsDa92sWy22Tt6yBBbEajzJYrOHaGvMBUaG3u3C7khCwFS7TTKFm4tzAu62npYA3P5TlD_V4n923KxOh4JUa5M8lcWel1sI7H0vtjxapAMm9clcZPUbs3PQj-LbwS48V19P-7ZQEaWu39cKq11TAlMH80rbUSbSLmzbO5E3zqVr_kIPgwRDHt5RJTya9UBddlL-vRX31ivlLnt6nX7TI10BENjkEuL7ZUg" className="w-full h-full object-cover" alt="" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm uppercase tracking-wider">MESH MAXI DRESS</h3>
                  <p className="text-white/80 text-[10px] leading-tight">Elevated silhouettes crafted for modern elegance.</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-white">
                <span className="font-bold">₹1,750</span>
                <span className="text-white/60 line-through text-sm">₹3,999</span>
                <span className="text-green-400 text-sm font-semibold">Save 56%</span>
              </div>
            </div>
          </div>

          {/* Item 2 */}
          <div className="relative group rounded-2xl overflow-hidden aspect-[3/4]">
            <img
              alt="Silk Slip Dress"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4nsXD-VV3xeCHrAhaQdW9H_lcBIWfxcR9DDjG9Zhb3rdHLD1VLmjYpWqH87fkGEci-nrn4bYIVr2VZ91_vbkdLP2uzNeaAQvRj5Yq8VtukprI8BwCYr7Q58u7N2ZaRJhnEcVyjnIoCgUPdZ5BbTtHlJJb_dpiUvwx_yXuP9nqpXhhFhzi37hlpO4bhLxQwXIQULPAnJdVkKoHKU1ctsmpRsi9vUvZnO8N_0ZdsR6zVdRkkFDfeTF5ttUW01ga7ck7VcB68Bi8QQ"
            />
            <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 rounded-full text-xs font-bold z-10">
              Trending Now
            </div>
            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end">
              <div className="flex items-end gap-3 mb-2">
                <div className="w-12 h-12 bg-white rounded flex-shrink-0 overflow-hidden">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4nsXD-VV3xeCHrAhaQdW9H_lcBIWfxcR9DDjG9Zhb3rdHLD1VLmjYpWqH87fkGEci-nrn4bYIVr2VZ91_vbkdLP2uzNeaAQvRj5Yq8VtukprI8BwCYr7Q58u7N2ZaRJhnEcVyjnIoCgUPdZ5BbTtHlJJb_dpiUvwx_yXuP9nqpXhhFhzi37hlpO4bhLxQwXIQULPAnJdVkKoHKU1ctsmpRsi9vUvZnO8N_0ZdsR6zVdRkkFDfeTF5ttUW01ga7ck7VcB68Bi8QQ" className="w-full h-full object-cover" alt="" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm uppercase tracking-wider">SILK SLIP DRESS</h3>
                  <p className="text-white/80 text-[10px] leading-tight">Minimalist luxury in every thread.</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-white">
                <span className="font-bold">₹2,450</span>
                <span className="text-white/60 line-through text-sm">₹4,999</span>
                <span className="text-green-400 text-sm font-semibold">Save 51%</span>
              </div>
            </div>
          </div>

          {/* Item 3 */}
          <div className="relative group rounded-2xl overflow-hidden aspect-[3/4]">
            <img
              alt="Tailored Blazer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDlqx12hmbL2Eb7Mk8C4VY2cXxJgk-8ROqb4RCA-H6SKF5sSROG4C0PaZtKBYpVp8MlznO8Ql29yUK76IaOSs-i-xjAi2-I0CbGxv9TZ7T5pbtdi44RxhA6OSE-KkPHMUHPzYuxURgzma3WLcvqSv06rvKWUo83DHWAXKDCY5BRfC6xLA5dpA8t_439QB9qc_OIHlhtVUiK0UnxfOXOqz7wMhSIYQ7bBVHpwLH8fOZbo1qONhGZ2ymesiEgzLzbwY8ROSOHMiXdCA"
            />
            <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 rounded-full text-xs font-bold z-10">
              Trending Now
            </div>
            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end">
              <div className="flex items-end gap-3 mb-2">
                <div className="w-12 h-12 bg-white rounded flex-shrink-0 overflow-hidden">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDlqx12hmbL2Eb7Mk8C4VY2cXxJgk-8ROqb4RCA-H6SKF5sSROG4C0PaZtKBYpVp8MlznO8Ql29yUK76IaOSs-i-xjAi2-I0CbGxv9TZ7T5pbtdi44RxhA6OSE-KkPHMUHPzYuxURgzma3WLcvqSv06rvKWUo83DHWAXKDCY5BRfC6xLA5dpA8t_439QB9qc_OIHlhtVUiK0UnxfOXOqz7wMhSIYQ7bBVHpwLH8fOZbo1qONhGZ2ymesiEgzLzbwY8ROSOHMiXdCA" className="w-full h-full object-cover" alt="" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm uppercase tracking-wider">TAILORED BLAZER</h3>
                  <p className="text-white/80 text-[10px] leading-tight">Structural perfection for the city.</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-white">
                <span className="font-bold">₹3,150</span>
                <span className="text-white/60 line-through text-sm">₹7,999</span>
                <span className="text-green-400 text-sm font-semibold">Save 60%</span>
              </div>
            </div>
          </div>

          {/* Item 4 */}
          <div className="relative group rounded-2xl overflow-hidden aspect-[3/4]">
            <img
              alt="Straight Denim"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGBTKQinrUZy0Vnz7Y_HoaQ57C36_u011zzUxkRfbxfw7ISlyzwG3Llij7oR6LeZZT4OLixEbuEcQ13pWsIroISOR3ucAHT6_yzHWwN36pNzPfOSW8YIhDGqWc2dX_uwXNnZH2rM-uWyu7kWCNoP0XY2taoL5UUmVJCk9Vcgio7pM6FdIk8Gy-m8uGl1g0jAm3F-YOfmideAKDqgwsYYWdNCWZ_RKPNJ8ETTLd6_Eue92bwfPqLvqcZ3bc6-SivuQjvo133u8P1A"
            />
            <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 rounded-full text-xs font-bold z-10">
              Trending Now
            </div>
            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end">
              <div className="flex items-end gap-3 mb-2">
                <div className="w-12 h-12 bg-white rounded flex-shrink-0 overflow-hidden">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGBTKQinrUZy0Vnz7Y_HoaQ57C36_u011zzUxkRfbxfw7ISlyzwG3Llij7oR6LeZZT4OLixEbuEcQ13pWsIroISOR3ucAHT6_yzHWwN36pNzPfOSW8YIhDGqWc2dX_uwXNnZH2rM-uWyu7kWCNoP0XY2taoL5UUmVJCk9Vcgio7pM6FdIk8Gy-m8uGl1g0jAm3F-YOfmideAKDqgwsYYWdNCWZ_RKPNJ8ETTLd6_Eue92bwfPqLvqcZ3bc6-SivuQjvo133u8P1A" className="w-full h-full object-cover" alt="" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm uppercase tracking-wider">STRAIGHT DENIM</h3>
                  <p className="text-white/80 text-[10px] leading-tight">Timeless cuts for daily ease.</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-white">
                <span className="font-bold">₹1,950</span>
                <span className="text-white/60 line-through text-sm">₹3,499</span>
                <span className="text-green-400 text-sm font-semibold">Save 44%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer (matches provided snippet) */}
      <footer className="w-full px-outer-margin bg-surface dark:bg-primary text-primary dark:text-on-primary full-width border-t border-outline-variant dark:border-on-primary-fixed-variant mt-section-padding-desktop">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-stack-md w-full px-outer-margin py-section-padding-desktop max-w-full mx-auto">
          <div className="col-span-1 md:col-span-1 flex flex-col items-start">
            <h3 className="font-headline-md text-headline-md text-primary dark:text-on-primary mb-6">
              TOBEQUE
            </h3>
            <p className="font-body-md text-body-md text-secondary dark:text-secondary-fixed-dim text-sm max-w-xs mb-8">
              Curated elegance for the modern woman. Discover our latest
              collections.
            </p>
          </div>

          <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-8">
            <div className="flex flex-col gap-4 font-label-caps text-label-caps text-secondary dark:text-secondary-fixed-dim">
              <a
                className="hover:underline transition-all hover:text-primary dark:hover:text-on-primary"
                href="#"
              >
                Journal
              </a>
              <a
                className="hover:underline transition-all hover:text-primary dark:hover:text-on-primary"
                href="#"
              >
                Sustainability
              </a>
              <a
                className="hover:underline transition-all hover:text-primary dark:hover:text-on-primary"
                href="#"
              >
                Boutiques
              </a>
            </div>
            <div className="flex flex-col gap-4 font-label-caps text-label-caps text-secondary dark:text-secondary-fixed-dim">
              <a
                className="hover:underline transition-all hover:text-primary dark:hover:text-on-primary"
                href="#"
              >
                Shipping &amp; Returns
              </a>
              <a
                className="hover:underline transition-all hover:text-primary dark:hover:text-on-primary"
                href="#"
              >
                Privacy Policy
              </a>
              <a
                className="hover:underline transition-all hover:text-primary dark:hover:text-on-primary"
                href="#"
              >
                Contact
              </a>
            </div>
          </div>

          <div className="col-span-1 md:col-span-1 flex flex-col items-start">
            <h4 className="font-label-caps text-label-caps text-primary dark:text-on-primary mb-4 uppercase">
              Newsletter
            </h4>
            <div className="flex w-full border-b border-outline-variant dark:border-on-primary-fixed-variant pb-2">
              <input
                className="w-full bg-transparent border-none focus:ring-0 p-0 font-body-md text-body-md text-primary placeholder:text-secondary italic focus:outline-none"
                placeholder="Email Address"
                type="email"
              />
              <button className="text-primary dark:text-on-primary hover:opacity-70 transition-opacity">
                <span
                  className="material-symbols-outlined"
                  data-icon="arrow_forward"
                >
                  arrow_forward
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="w-full px-outer-margin py-8 border-t border-outline-variant/50 dark:border-on-primary-fixed-variant/50 flex flex-col md:flex-row justify-between items-center text-xs text-secondary dark:text-secondary-fixed-dim">
          <p>© 2024 TOBEQUE LUXE. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a
              className="hover:text-primary dark:hover:text-on-primary transition-colors"
              href="#"
            >
              Instagram
            </a>
            <a
              className="hover:text-primary dark:hover:text-on-primary transition-colors"
              href="#"
            >
              Pinterest
            </a>
            <a
              className="hover:text-primary dark:hover:text-on-primary transition-colors"
              href="#"
            >
              TikTok
            </a>
          </div>
        </div>
      </footer>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />

    </div>
  );
}
