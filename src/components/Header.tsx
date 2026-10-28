import React from 'react';
import { Menu, PlusCircle, Shield, FileText } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  onOpenMobileSidebar: () => void;
  onNavigateTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onOpenMobileSidebar,
  onNavigateTab
}) => {
  const titles: Record<string, { title: string; subtitle: string }> = {
    dashboard: { 
      title: 'Health Overview Dashboard', 
      subtitle: 'Simple overview of your medical reports and key healthcare tools' 
    },
    analyzer: { 
      title: 'Medical Report Explainer', 
      subtitle: 'Upload any test report to receive plain-language summaries and biomarker breakdowns' 
    },
    comparison: { 
      title: 'Compare Medical Reports', 
      subtitle: 'Track changes between old and new test results with tables and trends' 
    },
    chatbot: { 
      title: 'Health AI Chat Assistant', 
      subtitle: 'Ask general health questions and learn about symptoms with safe guardrails' 
    },
    remedies: { 
      title: 'Safe Home Remedies', 
      subtitle: 'Evidence-based home-care suggestions for common minor symptoms' 
    },
    medicines: { 
      title: 'Medicine Information Guide', 
      subtitle: 'Learn about indications, mechanisms, side effects, and precautions' 
    },
    'doctor-prep': { 
      title: 'Doctor Consultation Preparation', 
      subtitle: 'Generate a short summary and questions to discuss with your doctor' 
    },
    'prompt-lab': { 
      title: 'Prompt Engineering Lab (IA-III)', 
      subtitle: 'Evaluate basic versus improved prompt architectures side-by-side' 
    },
  };

  const current = titles[activeTab] || titles.dashboard;

  return (
    <header className="h-16 bg-white border-b border-sky-100/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="p-2 -ml-1 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg lg:hidden"
          title="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="font-bold text-slate-900 text-base leading-tight">{current.title}</h2>
          <p className="text-xs text-slate-400 hidden sm:block">{current.subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-500 bg-sky-50 border border-sky-100 px-3 py-1.5 rounded-full font-medium">
          <Shield className="w-3.5 h-3.5 text-sky-600" />
          <span>Non-Diagnostic • Educational Only</span>
        </div>

        {activeTab !== 'analyzer' && (
          <button
            onClick={() => onNavigateTab('analyzer')}
            className="flex items-center gap-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 px-3.5 py-1.5 rounded-lg shadow-2xs transition-colors cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Upload Report</span>
            <span className="sm:hidden">Upload</span>
          </button>
        )}
      </div>
    </header>
  );
};
