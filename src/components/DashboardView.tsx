import React from 'react';
import { 
  FileText, 
  GitCompare, 
  MessageSquare, 
  HeartHandshake, 
  Pill, 
  Stethoscope, 
  FlaskConical, 
  UploadCloud, 
  ArrowRight, 
  Eye, 
  Trash2, 
  Calendar,
  Sparkles,
  RefreshCw,
  CheckCircle2
} from 'lucide-react';
import { MedicalReport } from '../types';

interface DashboardViewProps {
  reports: MedicalReport[];
  onSelectReport: (report: MedicalReport) => void;
  onCompareWith: (report: MedicalReport) => void;
  onDeleteReport: (id: string) => void;
  onResetSamples: () => void;
  onNavigateTab: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  reports,
  onSelectReport,
  onCompareWith,
  onDeleteReport,
  onResetSamples,
  onNavigateTab
}) => {
  const quickCards = [
    {
      id: 'analyzer',
      title: 'Report Explainer',
      desc: 'Upload blood tests, CT scans, or MRI reports to get simple explanations.',
      icon: FileText,
      color: 'text-sky-600 bg-sky-50 border-sky-100',
    },
    {
      id: 'comparison',
      title: 'Compare Reports',
      desc: 'Compare old and new test results with a clear table and simple charts.',
      icon: GitCompare,
      color: 'text-blue-600 bg-blue-50 border-blue-100',
    },
    {
      id: 'chatbot',
      title: 'Health AI Chat',
      desc: 'Ask questions about symptoms, lab terms, and general health education.',
      icon: MessageSquare,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
    },
    {
      id: 'remedies',
      title: 'Home Remedies',
      desc: 'Evidence-based home-care suggestions with precautions and doctor red flags.',
      icon: HeartHandshake,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    },
    {
      id: 'medicines',
      title: 'Medicine Guide',
      desc: 'Learn about indications, mechanisms, side effects, and precautions.',
      icon: Pill,
      color: 'text-amber-600 bg-amber-50 border-amber-100',
    },
    {
      id: 'doctor-prep',
      title: 'Doctor Visit Prep',
      desc: 'Generate a short summary and prioritized questions to discuss with your doctor.',
      icon: Stethoscope,
      color: 'text-purple-600 bg-purple-50 border-purple-100',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-linear-to-r from-sky-50 via-white to-blue-50/70 border border-sky-200/80 rounded-2xl p-6 sm:p-7 shadow-2xs">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-100/80 text-[11px] font-semibold text-sky-800 mb-3 border border-sky-200/60">
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            <span>MedExplain AI – Health Assistant</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Clear, Simple Health Explanations
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
            Understand medical reports, ask health questions, explore safe home remedies, and prepare for your doctor visits in plain language.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateTab('analyzer')}
              className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
            >
              <UploadCloud className="w-4 h-4" />
              Upload Medical Report
            </button>
            <button
              onClick={() => onNavigateTab('chatbot')}
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-sky-600" />
              Ask Health Assistant
            </button>
          </div>
        </div>
      </div>

      {/* Main Features Grid */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Health Assistant Features
          </h3>
          <button
            onClick={() => onNavigateTab('prompt-lab')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
          >
            <FlaskConical className="w-3.5 h-3.5" />
            <span>Open Prompt Lab (IA-III)</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                onClick={() => onNavigateTab(card.id)}
                className="bg-white border border-slate-200/80 hover:border-sky-300 rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3.5 border ${card.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm group-hover:text-sky-700 transition-colors">
                    {card.title}
                  </h4>
                  <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                    {card.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-sky-600 group-hover:text-sky-700">
                  <span>Open Feature</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stored Reports Section */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
              <FileText className="w-4 h-4 text-sky-600" />
              Your Medical Reports ({reports.length})
            </h3>
            <p className="text-xs text-slate-400">
              Select any report to view its simple explanation or compare it with another test.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onResetSamples}
              className="text-xs text-slate-500 hover:text-slate-800 border border-slate-200 hover:bg-slate-50 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Reset demonstration reports"
            >
              <RefreshCw className="w-3 h-3" />
              Reset Samples
            </button>
            <button
              onClick={() => onNavigateTab('analyzer')}
              className="text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              + Add Report
            </button>
          </div>
        </div>

        {/* Reports Table / Card List */}
        <div className="divide-y divide-slate-100">
          {reports.map((report) => (
            <div
              key={report.id}
              className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 px-2 rounded-xl transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-sky-50 border border-sky-100 text-sky-600 flex items-center justify-center shrink-0 mt-0.5">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{report.title}</h4>
                    <span className="text-[10px] font-semibold text-sky-700 bg-sky-50 border border-sky-200 px-1.5 py-0.2 rounded-md">
                      {report.reportType}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {report.date}
                    </span>
                    <span>•</span>
                    <span>{report.facilityName}</span>
                    <span>•</span>
                    <span>{report.biomarkers?.length || 0} biomarkers</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => onSelectReport(report)}
                  className="text-xs font-semibold text-sky-600 hover:text-sky-800 bg-sky-50 hover:bg-sky-100 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  View Explanation
                </button>
                <button
                  onClick={() => onCompareWith(report)}
                  className="text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                  title="Compare with another report"
                >
                  Compare
                </button>
                <button
                  onClick={() => onDeleteReport(report.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Delete report"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {reports.length === 0 && (
            <div className="py-8 text-center text-xs text-slate-400">
              No reports stored yet. Click "Upload Report" or "Reset Samples" to get started.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
