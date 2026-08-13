import { useState, useEffect } from "react";
import { Footer } from "../../components/Footer/Footer";
import { Navbar } from "../../components/Navbar/Navbar";
import api from "../../services/api";

const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

export function AboutPage() {
  const [pageData, setPageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const response = await api.get('/api/about-us');
        setPageData(response.data.data);
      } catch (error) {
        console.error("Failed to load about us content", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
  }, []);

  if (loading) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!pageData) {
    return (
      <div className="bg-background text-on-background min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold text-primary mb-4">Content not found</h2>
            <p className="text-secondary">This page is currently being updated. Please check back later.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-background text-on-background font-body-md antialiased overflow-x-hidden min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-16 w-full">
        {/* Hero Section */}
        <section className="bg-surface-container-low py-10 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-primary mb-6 tracking-tight">
              {pageData.heroTitle}
            </h1>
            <p className="text-lg md:text-xl text-secondary max-w-2xl mx-auto leading-relaxed">
              {pageData.heroSubtitle}
            </p>
          </div>
        </section>

        {/* Mission & Image Section */}
        <section className="py-20 px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              {pageData.missionImage ? (
                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-surface-container">
                  <img 
                    src={pageData.missionImage.startsWith('http') ? pageData.missionImage : `${API_URL}${pageData.missionImage}`} 
                    alt="Our Mission" 
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-surface-container flex items-center justify-center">
                  <span className="text-outline-variant">No Image Provided</span>
                </div>
              )}
            </div>
            
            <div className="order-1 lg:order-2 space-y-12">
              <div>
                <h2 className="font-display text-2xl md:text-3xl font-semibold text-primary mb-4">Our Mission</h2>
                <p className="text-secondary leading-relaxed text-lg">
                  {pageData.missionStatement}
                </p>
              </div>
              
              <div>
                <h2 className="font-display text-2xl md:text-3xl font-semibold text-primary mb-4">Our Vision</h2>
                <p className="text-secondary leading-relaxed text-lg">
                  {pageData.visionStatement}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        {pageData.stats && pageData.stats.length > 0 && (
          <section className="bg-primary text-on-primary py-16 px-6">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-on-primary/20">
                {pageData.stats.map((stat: any, idx: number) => (
                  <div key={idx} className="text-center px-4">
                    <div className="font-display text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
                    <div className="text-sm uppercase tracking-widest text-on-primary/80 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Our Story & Sequential Sub-Sections */}
        <section className="py-24 px-6 max-w-4xl mx-auto text-center space-y-16">
          {/* Main Our Story Section */}
          <div className="space-y-6">
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-primary mb-6">
              {pageData.ourStoryTitle || "Our Story"}
            </h2>
            {pageData.ourStoryText && (
              <p className="text-secondary leading-relaxed text-lg md:text-xl whitespace-pre-wrap max-w-3xl mx-auto">
                {pageData.ourStoryText}
              </p>
            )}
            {(!pageData.extraSections || pageData.extraSections.length === 0) && pageData.ourStoryText2 && (
              <p className="text-secondary leading-relaxed text-lg md:text-xl whitespace-pre-wrap max-w-3xl mx-auto mt-6">
                {pageData.ourStoryText2}
              </p>
            )}
          </div>

          {/* Subsequent Story Sections (rendered sequentially one below another) */}
          {pageData.extraSections && pageData.extraSections.length > 0 && (
            pageData.extraSections.map((section: any, idx: number) => (
              (section.title || section.description) && (
                <div key={idx} className="space-y-6 pt-10 border-t border-outline-variant/20">
                  {section.title && (
                    <h3 className="font-display text-2xl md:text-3xl font-semibold text-primary mb-6">
                      {section.title}
                    </h3>
                  )}
                  {section.description && (
                    <p className="text-secondary leading-relaxed text-lg md:text-xl whitespace-pre-wrap max-w-3xl mx-auto">
                      {section.description}
                    </p>
                  )}
                </div>
              )
            ))
          )}
        </section>

      </main>

      <Footer />
    </div>
  );
}
