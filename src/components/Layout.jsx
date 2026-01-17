import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils/navigation';
import { Button } from '@/components/ui/button';
import { api } from '@/api/client';
import { 
  ClipboardList, 
  TrendingUp, 
  LogOut,
  Sparkles
} from 'lucide-react';

const navItems = [
  { name: 'Questionnaire', label: 'Brand Audit', icon: ClipboardList },
  { name: 'BrandHealth', label: 'Brand Health', icon: TrendingUp },
];

export default function Layout({ children }) {
  const location = useLocation();
  const currentPageName = location.pathname.substring(1) || 'Questionnaire';

  const handleLogout = () => {
    api.auth.logout();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to={createPageUrl('Questionnaire')} className="flex items-center gap-2">
              <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-sm">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">
                Immersify
              </span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                // Simple check for active state based on URL
                const isActive = location.pathname.toLowerCase().includes(item.name.toLowerCase());
                return (
                  <Link key={item.name} to={createPageUrl(item.name)}>
                    <Button
                      variant={isActive ? 'default' : 'ghost'}
                      className={isActive ? '' : 'text-slate-600'}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </nav>

            {/* Logout */}
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-slate-500">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}