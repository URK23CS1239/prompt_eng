import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  GitCompare, 
  MessageSquare, 
  HeartHandshake, 
  Pill, 
  Stethoscope, 
  FlaskConical, 
  PhoneCall, 
  ShieldCheck, 
  X,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
  reportCount: number;
  onOpenConsent: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpenMobile,
  setIsOpenMobile,
  reportCount,
  onOpenConsent,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'analyzer', label: 'Report Explainer', icon: FileText, count: reportCount },
    { id: 'comparison', label: 'Compare Reports', icon: GitCompare },
    { id: 'chatbot', label: 'Health AI Chat', icon: MessageSquare },
    { id: 'remedies', label: 'Home Remedies', icon: HeartHandshake },
    { id: 'medicines', label: 'Medicine Guide', icon: Pill },
    { id: 'doctor-prep', label: 'Doctor Visit Prep', icon: Stethoscope },
    { id: 'prompt-lab', label: 'Prompt Lab (IA-III)', icon: FlaskConical, isLab: true },
  ];

  const handleSelect = (id: string) => {
    setActiveTab(id);
    setIsOpenMobile(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          onClick={() => setIsOpenMobile(false)}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-sky-100 flex flex-col justify-between transition-transform duration-200 ease-in-out
        ${isOpenMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Top Branding */}
        <div>
          <div className="h-16 px-5 border-b border-sky-100/80 flex items-center justify-between">
            <div 
              onClick={() => handleSelect('dashboard')}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-sky-500 text-white flex items-center justify-center shadow-xs group-hover:bg-sky-600 transition-colors">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-bold text-slate-900 text-base leading-tight">MedExplain AI</h1>
                <span className="text-[11px] text-sky-600 font-medium block">Health Assistant</span>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              onClick={() => setIsOpenMobile(false)}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            <div className="px-3 pt-2 pb-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Main Menu
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-sky-50 text-sky-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.count !== undefined && item.count > 0 && (
                    <span className="text-[10px] bg-sky-100 text-sky-700 font-bold px-1.5 py-0.2 rounded-full">
                      {item.count}
                    </span>
                  )}

                  {item.isLab && !isActive && (
                    <span className="text-[9px] bg-indigo-50 text-indigo-600 font-bold px-1.5 py-0.2 rounded-full border border-indigo-100">
                      IA-III
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Safety & Consent Footer */}
        <div className="p-4 border-t border-sky-100/80 space-y-2.5 bg-slate-50/50">
          <div className="p-2.5 rounded-xl bg-white border border-rose-100 shadow-2xs text-[11px] text-rose-900 flex items-center gap-2">
            <PhoneCall className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <div>
              <span className="font-bold">Emergency Care:</span> Dial <strong>911 / 112</strong>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
            <button
              onClick={onOpenConsent}
              className="text-sky-600 hover:text-sky-800 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Privacy & Consent</span>
            </button>
            <span>v1.2</span>
          </div>
        </div>
      </aside>
    </>
  );
};
