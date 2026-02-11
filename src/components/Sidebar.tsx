import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Settings as SettingsIcon, 
  ClipboardCheck, 
  Activity, 
  Lightbulb, 
  Sparkles 
} from 'lucide-react';
import { getStore } from "@/lib/store";

interface SidebarProps {
  onMobileClose?: () => void;
  className?: string;
  showLogo?: boolean;
}

const Sidebar = ({ onMobileClose, className = "", showLogo = true }: SidebarProps) => {
  const location = useLocation();
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
    { path: '/audit-summary', label: 'Executive Audit', icon: Sparkles },
    { path: '/strategy', label: 'IBE Strategy', icon: Lightbulb },
    { path: '/settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <div className={`flex flex-col h-full w-full bg-slate-900 text-white border-r border-slate-800 ${className}`}>
      {showLogo && (
        <div className="p-6 border-b border-slate-800">
          <Link to="/" className="text-2xl font-bold flex items-center gap-2 text-indigo-400">
            <Sparkles className="w-6 h-6" />
            <span>Immersify</span>
          </Link>
        </div>
      )}

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onMobileClose}
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
};

export default Sidebar;
