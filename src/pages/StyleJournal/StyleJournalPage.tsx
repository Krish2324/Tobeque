import { SimpleNavbar } from "../../components/SimpleNavbar/SimpleNavbar";
import { Footer } from "../../components/Footer/Footer";

// Using the mock data matching the screenshot, enhanced for editorial feel
const journalEntries = [
  {
    id: 1,
    tag: "FASHION",
    title: "Trendy Fashion Guide: Clothing for Teens and Stylish Outfit Ideas for Girls",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&auto=format&fit=crop&q=80",
    order: "title-first",
    excerpt: "Discover the latest essential pieces that are defining this season's teenage fashion landscape, blending comfort with undeniable style.",
    readTime: "4 MIN READ",
    isFeatured: true
  },
  {
    id: 2,
    tag: "FASHION",
    title: "Summer Party Wear: Trendy Summer Outfits for Teen Girls & Women",
    image: null,
    order: "title-first",
    readTime: "3 MIN READ"
  },
  {
    id: 4,
    tag: "AESTHETIC LOOK",
    title: "Aesthetic Outfits for Teens — Trendy & Stylish Aesthetic Teen Wear",
    image: "https://images.unsplash.com/photo-1550614000-4b95d466e01d?w=800&auto=format&fit=crop&q=80",
    order: "image-first",
    readTime: "5 MIN READ"
  },
  {
    id: 3,
    tag: "LATEST TREND",
    title: "Get Ready to Glow: Tobeque's Most Exciting Launch Is Coming Soon!",
    image: "https://images.unsplash.com/photo-1434389678232-0268149e917d?w=800&auto=format&fit=crop&q=80",
    order: "title-first",
    readTime: "2 MIN READ"
  },
  {
    id: 5,
    tag: "FASHION",
    title: "Retro Party Outfit Ideas for Teen Girls - Create the Perfect Retro Party Look",
    image: null,
    order: "title-first",
    readTime: "4 MIN READ"
  },
  {
    id: 6,
    tag: "OUTFIT IDEAS",
    title: "Trendy Dresses for Teens: Stylish & Cute Outfit Ideas for Every Occasion",
    image: null,
    order: "title-first",
    readTime: "6 MIN READ"
  },
  {
    id: 7,
    tag: "OUTFIT IDEAS",
    title: "Dresses for Teens — Trendy, Cute & Perfect for Every Occasion",
    image: null,
    order: "title-first",
    readTime: "3 MIN READ"
  },
  {
    id: 8,
    tag: "OUTFIT IDEAS",
    title: "Stylish Outfits for Teens — Trendy Fashion Picks for Modern Teenage Girls",
    image: null,
    order: "title-first",
    readTime: "4 MIN READ"
  },
  {
    id: 9,
    tag: "OUTFIT IDEAS",
    title: "Dresses for Women — Elegant, Trendy & Perfect for Every Occasion",
    image: null,
    order: "title-first",
    readTime: "5 MIN READ"
  }
];

export function StyleJournalPage() {
  const featuredArticle = journalEntries.find(e => e.isFeatured);
  const gridArticles = journalEntries.filter(e => !e.isFeatured);

  return (
    <div className="bg-surface-container-lowest text-on-surface antialiased min-h-screen flex flex-col font-body-md selection:bg-primary selection:text-on-primary">
      <SimpleNavbar />
      
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
            <div className="group cursor-pointer flex flex-col lg:flex-row items-center gap-8 lg:gap-16 relative">
              <div className="w-full lg:w-[65%] overflow-hidden bg-surface-container rounded-sm shadow-2xl">
                <img 
                  src={featuredArticle.image!} 
                  alt={featuredArticle.title} 
                  className="w-full aspect-[4/3] lg:aspect-auto lg:h-[650px] object-cover transition-transform duration-[2s] ease-out group-hover:scale-[1.03]" 
                />
              </div>
              <div className="w-full lg:w-[45%] flex flex-col justify-center px-4 lg:px-10 z-10 lg:-ml-32 lg:bg-white/95 lg:backdrop-blur-xl lg:py-16 lg:px-12 lg:shadow-2xl transition-transform duration-1000 ease-out group-hover:-translate-y-2">
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-[10px] tracking-[0.2em] font-bold text-primary uppercase relative before:content-[''] before:absolute before:-bottom-1.5 before:left-0 before:w-0 before:h-px before:bg-primary before:transition-all before:duration-700 group-hover:before:w-full">
                    {featuredArticle.tag}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                  <span className="text-[9px] tracking-widest text-secondary uppercase font-medium">{featuredArticle.readTime}</span>
                </div>
                <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-primary leading-tight mb-8">
                  {featuredArticle.title}
                </h2>
                <p className="text-secondary leading-relaxed mb-10 font-body-md text-sm md:text-base">
                  {featuredArticle.excerpt}
                </p>
                <button className="text-[11px] tracking-[0.2em] uppercase font-bold text-primary flex items-center gap-3 group-hover:gap-5 transition-all duration-300">
                  Read Article
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </button>
              </div>
            </div>
          </section>
        )}
        
        {/* Masonry Grid */}
        <section className="w-full max-w-[1600px] mx-auto px-6 md:px-12">
          <div className="columns-1 md:columns-2 lg:columns-3 gap-12 md:gap-16 space-y-16 md:space-y-24">
            {gridArticles.map((entry) => (
              <article key={entry.id} className="break-inside-avoid flex flex-col group cursor-pointer animate-fade-in relative">
                
                {entry.order === "image-first" && entry.image && (
                  <div className="mb-8 overflow-hidden bg-surface-container rounded-sm shadow-md">
                    <img src={entry.image} alt={entry.title} className="w-full h-auto object-cover transition-transform duration-[2s] ease-out group-hover:scale-[1.04]" loading="lazy" />
                  </div>
                )}
                
                <div className="flex flex-col gap-4 px-1 relative z-10">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] tracking-[0.2em] font-bold text-secondary uppercase transition-colors duration-300 group-hover:text-primary">
                      {entry.tag}
                    </span>
                    <span className="text-[9px] tracking-widest text-secondary/50 uppercase">{entry.readTime}</span>
                  </div>
                  
                  <h3 className="font-display text-xl md:text-2xl lg:text-[1.75rem] font-medium text-primary leading-[1.3] group-hover:text-black transition-colors duration-300 pr-2 decoration-[1.5px] underline-offset-4 group-hover:underline">
                    {entry.title}
                  </h3>
                </div>

                {entry.order === "title-first" && entry.image && (
                  <div className="mt-8 overflow-hidden bg-surface-container rounded-sm shadow-md">
                    <img src={entry.image} alt={entry.title} className="w-full h-auto object-cover transition-transform duration-[2s] ease-out group-hover:scale-[1.04]" loading="lazy" />
                  </div>
                )}
                
                {/* Thin, elegant divider line */}
                <div className="absolute -bottom-8 md:-bottom-12 left-0 w-full h-px bg-outline-variant/40 scale-x-0 group-hover:scale-x-100 transition-transform duration-[1.5s] origin-left" />
                <div className="w-full h-px bg-outline-variant/20 mt-8 md:mt-12 group-hover:opacity-0 transition-opacity duration-1000" />
              </article>
            ))}
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
