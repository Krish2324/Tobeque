import { Footer } from "../../components/Footer/Footer";
import { Navbar } from "../../components/Navbar/Navbar";
import { Link } from "react-router-dom";

// Real curated style images using unsplash-style fashion photography
const styleImages = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80",
    alt: "Street style fashion look",
    tag: "@tobeque",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80",
    alt: "Shopping street style",
    tag: "@tobeque",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&q=80",
    alt: "Casual summer outfit",
    tag: "@tobeque",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80",
    alt: "Editorial fashion",
    tag: "@tobeque",
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&q=80",
    alt: "Trendy teen look",
    tag: "@tobeque",
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=80",
    alt: "Festival fashion",
    tag: "@tobeque",
  },
  {
    id: 7,
    src: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80",
    alt: "Minimal chic outfit",
    tag: "@tobeque",
  },
  {
    id: 8,
    src: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80",
    alt: "Party outfit",
    tag: "@tobeque",
  },
  {
    id: 9,
    src: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=600&q=80",
    alt: "Cozy casual look",
    tag: "@tobeque",
  },
  {
    id: 10,
    src: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&q=80",
    alt: "Denim outfit",
    tag: "@tobeque",
  },
  {
    id: 11,
    src: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=600&q=80",
    alt: "Weekend brunch outfit",
    tag: "@tobeque",
  },
  {
    id: 12,
    src: "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=600&q=80",
    alt: "Evening look",
    tag: "@tobeque",
  },
];

export function StealTheStylePage() {
  return (
    <div className="bg-background text-on-background font-body-md antialiased overflow-x-hidden min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 mt-[64px]">
        {/* Header */}
        <div className="text-center py-10 px-6">
          <h1 className="text-3xl font-semibold text-primary uppercase tracking-[0.15em] mb-3">
            Steal The Style
          </h1>
          <p className="text-[13px] text-secondary max-w-xl mx-auto leading-relaxed">
            Get inspired by real looks from our community. Tag us{" "}
            <span className="font-semibold text-primary">@tobeque</span> on
            Instagram to be featured here.
          </p>
        </div>

        {/* Masonry-style Photo Grid */}
        <div className="columns-2 md:columns-3 lg:columns-4 gap-0 px-0">
          {styleImages.map((img) => (
            <div key={img.id} className="relative group overflow-hidden break-inside-avoid">
              <img
                src={img.src}
                alt={img.alt}
                className="w-full object-cover block transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3">
                <span className="text-white text-[12px] font-semibold tracking-widest uppercase">
                  {img.tag}
                </span>
                <Link
                  to="/collection"
                  className="bg-white text-primary text-[11px] font-bold uppercase tracking-widest px-5 py-2 hover:bg-primary hover:text-on-primary transition-colors"
                >
                  Shop the Look
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center py-14 px-6 border-t border-outline-variant mt-2">
          <h2 className="text-[18px] font-semibold text-primary mb-3 uppercase tracking-wide">
            Share Your Look
          </h2>
          <p className="text-[13px] text-secondary mb-6 max-w-md mx-auto">
            Tag your Tobeque outfits with{" "}
            <strong>#StealTheStyle</strong> and <strong>@tobeque</strong> on
            Instagram for a chance to be featured on this page.
          </p>
          <a
            href="https://instagram.com/tobeque"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block border border-primary text-primary text-[12px] font-semibold uppercase tracking-widest px-8 py-3 hover:bg-primary hover:text-on-primary transition-colors"
          >
            Follow on Instagram
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}
