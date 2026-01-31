import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster"
import { 
  Home, 
  Settings as SettingsIcon, 
  ClipboardCheck, 
  Activity, 
  Lightbulb, 
  Menu, 
  X,
  Sparkles
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { getStore } from "@/lib/store";

const Layout = ({ children }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [projectName, setProjectName] = useState("New Project");

  useEffect(() => {
    const store = getStore();
    if (store.answers && store.answers['brand_name']) {
      setProjectName(store.answers['brand_name']);
    } else if (store.answers && Object.keys(store.answers).length > 0) {
      setProjectName("In Progress");
    }
  }, [location]);

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/questionnaire', label: 'Brand Audit', icon: ClipboardCheck },
    { path: '/brand-health', label: 'Brand Health', icon: Activity },
    { path: '/strategy', label: 'IBE Strategy', icon: Lightbulb },
    { path: '/settings', label: 'Settings', icon: SettingsIcon },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-slate-900 text-white">
      <div className="p-6 border-b border-slate-800">
        <Link to="/" className="text-2xl font-bold flex items-center gap-2 text-indigo-400">
          <Sparkles className="w-6 h-6" />
          <span>Immersify</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                isActive 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800/50 rounded-lg p-4">
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Current Project</p>
          <p className="text-sm font-semibold text-slate-200 truncate">{projectName}</p>
        </div>
        <div className="mt-4 text-center">
          <p className="text-[10px] text-slate-600">v2.0.0 &bull; Immersify AI</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 fixed inset-y-0 left-0 z-50">
        <SidebarContent />
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-slate-900 text-white p-4 flex items-center justify-between shadow-md">
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
        <div className="md:hidden fixed inset-0 z-40 bg-slate-900 pt-16 animate-in slide-in-from-top-10 duration-200">
          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
               const isActive = location.pathname === item.path;
               const Icon = item.icon;
               return (
                 <Link
                   key={item.path}
                   to={item.path}
                   onClick={() => setIsMobileMenuOpen(false)}
                   className={`flex items-center gap-3 px-4 py-4 rounded-lg transition-all ${
                     isActive ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                   }`}
                 >
                   <Icon className="w-5 h-5" />
                   <span className="font-medium text-lg">{item.label}</span>
                 </Link>
               );
            })}
          </nav>
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
