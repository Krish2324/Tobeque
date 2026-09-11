import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "../../components/Navbar/Navbar";
import { Footer } from "../../components/Footer/Footer";
import api from "../../services/api";
import { resolveImageUrl } from "../../hooks/useProducts";

export function StyleJournalPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const title = "Teen Fashion Blog | Style Tips & Outfit Ideas | Tobeque";
    const desc = "Read Tobeque fashion blogs for teen style tips, outfit ideas, seasonal trends and easy styling inspiration made for girls who love fresh, modern fashion.";
    const keywords = "Tobeque fashion blog, teen fashion blog, teen style tips, outfit ideas for girls, teenage fashion trends, styling tips for teens";
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
    const fetchBlogs = async () => {
      try {
        const response = await api.get('/api/blogs?status=published');
        setBlogs(response.data.data);
      } catch (err) {
        console.error("Failed to fetch blogs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const featuredArticle = blogs.length > 0 ? blogs[0] : null;
  const gridArticles = blogs.length > 1 ? blogs.slice(1) : [];

  if (loading) {
    return (
      <div className="bg-surface-container-lowest min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest text-on-surface antialiased min-h-screen flex flex-col font-body-md selection:bg-primary selection:text-on-primary">
      <Navbar />

      <main className="flex-grow w-full pb-20">

        {/* Editorial Header */}
        <div className="w-full max-w-[1600px] mx-auto px-6 md:px-12 py-16 md:py-24 text-center animate-fade-in">
          <h1 className="font-display text-4xl md:text-6xl lg:text-[5rem] font-bold tracking-[-0.02em] text-primary mb-6 uppercase leading-none">
            The Style Journal
          </h1>
          <p className="font-body-md text-secondary max-w-2xl mx-auto text-sm md:text-base leading-relaxed tracking-wide">
            Curated editorials, emerging trends, and exclusive styling advice from the vanguard of contemporary fashion.
          </p>
        </div>

        {/* Featured Hero Article */}
        {featuredArticle && (
          <section className="w-full max-w-[1600px] mx-auto px-6 md:px-12 mb-24 md:mb-32">
            <Link to={`/blogs/${featuredArticle.slug || featuredArticle.id || featuredArticle._id}`} className="block group cursor-pointer">
              <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16 relative">
                <div className="w-full lg:w-[65%] overflow-hidden bg-surface-container rounded-sm shadow-2xl">
                  <img
                    src={resolveImageUrl(featuredArticle.image)}
                    alt={featuredArticle.imageAltTag || featuredArticle.title}
                    className="w-full aspect-[4/3] lg:aspect-auto lg:h-[650px] object-cover transition-transform duration-[2s] ease-out group-hover:scale-[1.03]"
                  />
                </div>
                <div className="w-full lg:w-[45%] flex flex-col justify-center px-4 lg:px-10 z-10 lg:-ml-32 lg:bg-white/95 lg:backdrop-blur-xl lg:py-16 lg:px-12 lg:shadow-2xl transition-transform duration-1000 ease-out group-hover:-translate-y-2">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-[10px] tracking-[0.2em] font-bold text-primary uppercase relative before:content-[''] before:absolute before:-bottom-1.5 before:left-0 before:w-0 before:h-px before:bg-primary before:transition-all before:duration-700 group-hover:before:w-full">
                      Editorial
                    </span>
                    <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                    <span className="text-[9px] tracking-widest text-secondary uppercase font-medium">{new Date(featuredArticle.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-primary leading-tight mb-8">
                    {featuredArticle.title}
                  </h2>
                  <p className="text-secondary leading-relaxed mb-10 font-body-md text-sm md:text-base">
                    {featuredArticle.excerpt}
                  </p>
                  <button className="text-[11px] tracking-[0.2em] uppercase font-bold text-primary flex items-center gap-3 group-hover:gap-5 transition-all duration-300 pointer-events-none">
                    Read Article
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                  </button>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* Masonry Grid */}
        <section className="w-full max-w-[1600px] mx-auto px-6 md:px-12">
          <div className="columns-1 md:columns-2 lg:columns-3 gap-12 md:gap-16 space-y-16 md:space-y-24">
            {gridArticles.map((entry) => (
              <Link to={`/blogs/${entry.slug || entry.id || entry._id}`} key={entry.id || entry._id} className="break-inside-avoid flex flex-col group cursor-pointer animate-fade-in relative block">
                <article>
                  {entry.image && (
                    <div className="mb-8 overflow-hidden bg-surface-container rounded-sm shadow-md">
                      <img src={resolveImageUrl(entry.image)} alt={entry.imageAltTag || entry.title} className="w-full h-auto object-cover transition-transform duration-[2s] ease-out group-hover:scale-[1.04]" loading="lazy" />
                    </div>
                  )}

                  <div className="flex flex-col gap-4 px-1 relative z-10">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[9px] tracking-[0.2em] font-bold text-secondary uppercase transition-colors duration-300 group-hover:text-primary">
                        Article
                      </span>
                      <span className="text-[9px] tracking-widest text-secondary/50 uppercase">{new Date(entry.createdAt).toLocaleDateString()}</span>
                    </div>

                    <h3 className="font-display text-xl md:text-2xl lg:text-[1.75rem] font-medium text-primary leading-[1.3] group-hover:text-black transition-colors duration-300 pr-2 decoration-[1.5px] underline-offset-4 group-hover:underline">
                      {entry.title}
                    </h3>
                  </div>

                  {/* Thin, elegant divider line */}
                  <div className="absolute -bottom-8 md:-bottom-12 left-0 w-full h-px bg-outline-variant/40 scale-x-0 group-hover:scale-x-100 transition-transform duration-[1.5s] origin-left" />
                  <div className="w-full h-px bg-outline-variant/20 mt-8 md:mt-12 group-hover:opacity-0 transition-opacity duration-1000" />
                </article>
              </Link>
            ))}
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
