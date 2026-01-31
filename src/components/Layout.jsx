import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster"

const Layout = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/settings', label: 'Settings' },
    { path: '/questionnaire', label: 'Brand Audit' },
    { path: '/strategy', label: 'IBE Strategy' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-indigo-600 flex items-center gap-2">
            ✨ Immersify
          </Link>
          
          <nav className="hidden md:flex gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors hover:text-indigo-600 ${
                  location.pathname === item.path ? 'text-indigo-600' : 'text-slate-600'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2026 Immersify AI. All rights reserved.</p>
          <p className="text-xs mt-2">Powered by Gemini &bull; Built for Brand Builders</p>
        </div>
      </footer>
      <Toaster />
    </div>
  );
};

export default Layout;
