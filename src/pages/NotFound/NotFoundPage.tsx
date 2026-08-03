import { Link } from 'react-router-dom';
import { Navbar } from '../../components/Navbar/Navbar';
import { Footer } from '../../components/Footer/Footer';

export function NotFoundPage() {
  return (
    <div className="min-h-[100dvh] bg-surface flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center p-8 pt-32 pb-16 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1 className="text-8xl md:text-9xl font-light tracking-widest text-primary mb-6">404</h1>
        <h2 className="text-2xl md:text-3xl font-light tracking-[0.2em] uppercase text-primary mb-4">
          Page Not Found
        </h2>
        <p className="text-secondary/60 max-w-md mx-auto mb-10 text-sm leading-relaxed">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link 
          to="/"
          className="bg-primary text-on-primary px-10 py-4 rounded-full text-xs font-bold tracking-widest uppercase hover:scale-105 transition-transform shadow-lg shadow-primary/20"
        >
          Back to Home
        </Link>
      </main>
      <Footer />
    </div>
  );
}
