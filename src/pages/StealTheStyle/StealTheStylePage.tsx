import { Footer } from "../../components/Footer/Footer";
import { Navbar } from "../../components/Navbar/Navbar";
import { Link } from "react-router-dom";

import { useState, useEffect } from "react";
import api from "../../services/api";

const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

export function StealTheStylePage() {
  const [styleImages, setStyleImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const title = "Steal the Style | Teen Outfit Ideas & Looks | Tobeque";
    const desc = "Explore Steal the Style by Tobeque for teen outfit ideas, fresh fashion inspiration and easy ways to recreate stylish everyday and occasion-ready looks.";
    const keywords = "Steal the Style, teen outfit ideas, fashion inspiration for teens, outfit ideas for girls, teen fashion looks, styling ideas for girls, Tobeque style";
    const image = `${window.location.origin}/2bq Logo2.png`;

    document.title = title;

    const setMetaTag = (attrName: string, attrVal: string, content: string) => {
      let tag = document.querySelector(`meta[name="${attrVal}"], meta[property="${attrVal}"]`);
      const canonicalAttr = attrVal.startsWith('og:') ? 'property' : (attrVal.startsWith('twitter:') ? 'name' : attrName);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(canonicalAttr, attrVal);
        document.head.appendChild(tag);
      } else {
        tag.setAttribute(canonicalAttr, attrVal);
      }
      tag.setAttribute('content', content);
      return tag;
    };

    setMetaTag('name', 'description', desc);
    setMetaTag('name', 'keywords', keywords);

    // Open Graph Tags
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', desc);
    setMetaTag('property', 'og:image', image);
    setMetaTag('property', 'og:url', window.location.href);
    setMetaTag('property', 'og:type', 'website');

    // Twitter Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', title);
    setMetaTag('name', 'twitter:description', desc);
    setMetaTag('name', 'twitter:image', image);
  }, []);

  useEffect(() => {
    const fetchStyles = async () => {
      try {
        const response = await api.get('/api/community-styles/public');
        setStyleImages(response.data.data);
      } catch (error) {
        console.error("Failed to load community styles", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStyles();
  }, []);

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
          {!loading && styleImages.length === 0 && (
            <div className="col-span-full py-20 text-center">
              <p className="text-secondary">No community styles available yet.</p>
            </div>
          )}
          {styleImages.map((img) => (
            <div key={img._id} className="relative group overflow-hidden break-inside-avoid">
              <img
                src={img.image.startsWith('http') ? img.image : `${API_URL}${img.image}`}
                alt={img.altText}
                className="w-full object-cover block transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3">
                <span className="text-white text-[12px] font-semibold tracking-widest uppercase">
                  {img.tag}
                </span>
                <Link
                  to={img.productLink || "/collection"}
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
