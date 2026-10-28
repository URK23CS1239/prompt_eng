import React from 'react';
import { 
  ShieldAlert, 
  PhoneCall, 
  FileText, 
  Activity, 
  GitCompare, 
  MessageSquare, 
  Sparkles, 
  Pill, 
  HeartHandshake, 
  CheckCircle2, 
  FlaskConical 
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  reportCount: number;
  onOpenConsent: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  activeTab, 
  setActiveTab, 
  reportCount,
  onOpenConsent 
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'analyzer', label: 'Report Explainer', icon: FileText, badge: reportCount > 0 ? reportCount : undefined },
    { id: 'comparison', label: 'Compare & Trends', icon: GitCompare },
    { id: 'chatbot', label: 'Health AI Chat', icon: MessageSquare },
    { id: 'remedies', label: 'Home Remedies', icon: HeartHandshake },
    { id: 'medicines', label: 'Medicine Guide', icon: Pill },
    { id: 'doctor-prep', label: 'Doctor Visit Prep', icon: CheckCircle2 },
    { id: 'prompt-lab', label: 'Prompt Lab (IA-III)', icon: FlaskConical, highlight: true },
  ];

  return (
    <header className="bg-white border-b border-sky-100 sticky top-0 z-40 shadow-xs">
      {/* Top emergency warning bar */}
      <div className="bg-linear-to-r from-sky-900 via-blue-900 to-indigo-950 text-white px-4 py-1.5 text-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>
            <strong className="text-sky-200">Medical Notice:</strong> MedExplain AI provides health education only and cannot replace clinical judgment.
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 font-semibold text-rose-300">
            <PhoneCall className="w-3 h-3" /> Emergency: Dial 911 / 112
          </span>
          <button 
            onClick={onOpenConsent}
            className="text-sky-200 hover:text-white underline cursor-pointer"
          >
            Privacy & Consent
          </button>
        </div>
      </div>

      {/* Main Nav header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Branding */}
          <div 
            onClick={() => setActiveTab('dashboard')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight">MedExplain</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-100 text-sky-700 border border-sky-200">
                  AI Health Assistant
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">Plain-language medical reports & patient education</p>
            </div>
          </div>

          {/* Quick status pill */}
          <div className="hidden lg:flex items-center gap-2 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Gemini 3.8-Flash Engine</span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-500">Safe Clinical Guardrails Active</span>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <nav className="flex space-x-1 overflow-x-auto pb-2 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-sky-50 text-sky-700 border border-sky-200/80 shadow-xs'
                    : item.highlight
                    ? 'text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 border border-transparent'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-sky-600' : item.highlight ? 'text-indigo-500' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span className="text-xs bg-sky-600 text-white px-1.5 py-0.2 rounded-full font-bold">
                    {item.badge}
                  </span>
                )}
                {item.highlight && !isActive && (
                  <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.2 rounded-full font-semibold">
                    New
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
