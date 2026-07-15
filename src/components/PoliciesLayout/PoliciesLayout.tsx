import React from 'react';
import { NavLink } from 'react-router-dom';
import { Navbar } from '../Navbar/Navbar';
import { Footer } from '../Footer/Footer';

interface PoliciesLayoutProps {
  children: React.ReactNode;
  title: string;
}

export function PoliciesLayout({ children, title }: PoliciesLayoutProps) {
  const navItems = [
    { name: 'Privacy Policy', path: '/privacy-policy' },
    { name: 'Terms & Conditions', path: '/terms-conditions' },
    { name: 'Cookie Policy', path: '/cookie-policy' }
  ];

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col font-body-md antialiased">
      <Navbar />

      <main className="flex-1 mt-[64px] bg-white">
        {/* Page Header */}
        <div className="bg-surface-container-lowest border-b border-outline-variant/30 py-12 px-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="font-display text-4xl md:text-5xl font-semibold text-primary tracking-tight">
              {title}
            </h1>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 flex flex-col md:flex-row gap-12 lg:gap-24">
          
          {/* Left Sidebar Navigation */}
          <aside className="w-full md:w-64 shrink-0">
            <div className="sticky top-24">
              <h3 className="text-xs font-bold uppercase tracking-widest text-secondary mb-6">Legal & Policies</h3>
              <nav className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) => `
                      px-4 py-3 rounded-lg text-sm font-medium transition-colors
                      ${isActive 
                        ? 'bg-primary text-on-primary shadow-sm' 
                        : 'text-secondary hover:bg-surface-container hover:text-primary'
                      }
                    `}
                  >
                    {item.name}
                  </NavLink>
                ))}
              </nav>
            </div>
          </aside>

          {/* Right Content Pane */}
          <div className="flex-1 min-w-0">
            {children}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
