import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster"
import { 
  Menu, 
  X,
  Sparkles
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 fixed inset-y-0 left-0 z-50">
        <Sidebar />
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-slate-900 text-white h-16 px-4 flex items-center justify-between shadow-md">
        <Link to="/" className="text-xl font-bold flex items-center gap-2 text-indigo-400">
          <Sparkles className="w-5 h-5" />
          <span>Immersify</span>
        </Link>
        <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white hover:bg-slate-800">
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </Button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed top-16 left-0 right-0 bottom-0 z-40 animate-in slide-in-from-top-10 duration-200">
          <Sidebar 
            onMobileClose={() => setIsMobileMenuOpen(false)} 
            showLogo={false}
            className="w-full h-full"
          />
        </div>
      )}

      {/* Main Content Wrapper */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen transition-all duration-300">
        <main className="flex-1 p-4 md:p-8 mt-16 md:mt-0 max-w-7xl mx-auto w-full">
          {children}
        </main>
        <Toaster />
      </div>
    </div>
  );
};

export default Layout;
