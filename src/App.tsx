import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { EmergencyBanner, ConsentModal } from './components/EmergencyBanner';
import { DashboardView } from './components/DashboardView';
import { ReportExplainerView } from './components/ReportExplainerView';
import { ReportComparisonView } from './components/ReportComparisonView';
import { AIChatbotView } from './components/AIChatbotView';
import { HomeRemediesView } from './components/HomeRemediesView';
import { MedicineGuideView } from './components/MedicineGuideView';
import { DoctorPrepView } from './components/DoctorPrepView';
import { PromptEngineeringLabView } from './components/PromptEngineeringLabView';
import { MedicalReport } from './types';
import { SAMPLE_REPORTS } from './data/mockData';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isOpenMobile, setIsOpenMobile] = useState<boolean>(false);
  const [reports, setReports] = useState<MedicalReport[]>(() => {
    try {
      const saved = localStorage.getItem('medexplain_reports');
      return saved ? JSON.parse(saved) : SAMPLE_REPORTS;
    } catch {
      return SAMPLE_REPORTS;
    }
  });

  const [selectedReport, setSelectedReport] = useState<MedicalReport | null>(SAMPLE_REPORTS[0]);
  const [compareReportA, setCompareReportA] = useState<MedicalReport | null>(SAMPLE_REPORTS[1]);
  const [compareReportB, setCompareReportB] = useState<MedicalReport | null>(SAMPLE_REPORTS[0]);
  const [showEmergencyNotice, setShowEmergencyNotice] = useState<boolean>(true);
  const [showConsentModal, setShowConsentModal] = useState<boolean>(false);
  const [consentGranted, setConsentGranted] = useState<boolean>(() => {
    return localStorage.getItem('medexplain_consent') === 'true';
  });

  // Persist reports
  useEffect(() => {
    try {
      localStorage.setItem('medexplain_reports', JSON.stringify(reports));
    } catch (err) {
      console.warn('Could not save reports to localStorage:', err);
    }
  }, [reports]);

  // Persist consent
  useEffect(() => {
    localStorage.setItem('medexplain_consent', String(consentGranted));
  }, [consentGranted]);

  const handleSaveReport = (newReport: MedicalReport) => {
    setReports(prev => {
      const existingIdx = prev.findIndex(r => r.id === newReport.id);
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = newReport;
        return updated;
      }
      return [newReport, ...prev];
    });
    setSelectedReport(newReport);
  };

  const handleDeleteReport = (id: string) => {
    setReports(prev => prev.filter(r => r.id !== id));
    if (selectedReport?.id === id) {
      setSelectedReport(reports.find(r => r.id !== id) || null);
    }
  };

  const handleResetSamples = () => {
    setReports(SAMPLE_REPORTS);
    setSelectedReport(SAMPLE_REPORTS[0]);
    setCompareReportA(SAMPLE_REPORTS[1]);
    setCompareReportB(SAMPLE_REPORTS[0]);
  };

  const handleViewReport = (report: MedicalReport) => {
    setSelectedReport(report);
    setActiveTab('analyzer');
  };

  const handleCompareReport = (report: MedicalReport) => {
    setCompareReportA(reports.find(r => r.id !== report.id) || SAMPLE_REPORTS[1]);
    setCompareReportB(report);
    setActiveTab('comparison');
  };

  const handleGenerateDoctorPrep = (report: MedicalReport) => {
    setSelectedReport(report);
    setActiveTab('doctor-prep');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex">
      {/* Clean Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpenMobile={isOpenMobile}
        setIsOpenMobile={setIsOpenMobile}
        reportCount={reports.length}
        onOpenConsent={() => setShowConsentModal(true)}
      />

      {/* Main Content Viewport */}
      <div className="flex-1 lg:ml-64 flex flex-col min-w-0 min-h-screen">
        {/* Top Header */}
        <Header
          activeTab={activeTab}
          onOpenMobileSidebar={() => setIsOpenMobile(true)}
          onNavigateTab={setActiveTab}
        />

        {/* Emergency Triage Notice */}
        {showEmergencyNotice && (
          <EmergencyBanner onDismiss={() => setShowEmergencyNotice(false)} />
        )}

        {/* Page Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              reports={reports}
              onSelectReport={handleViewReport}
              onCompareWith={handleCompareReport}
              onDeleteReport={handleDeleteReport}
              onResetSamples={handleResetSamples}
              onNavigateTab={setActiveTab}
            />
          )}

          {activeTab === 'analyzer' && (
            <ReportExplainerView
              currentReport={selectedReport}
              onSaveReport={handleSaveReport}
              onCompareReport={handleCompareReport}
              onGenerateDoctorPrep={handleGenerateDoctorPrep}
            />
          )}

          {activeTab === 'comparison' && (
            <ReportComparisonView
              reports={reports}
              initialReportA={compareReportA}
              initialReportB={compareReportB}
              onNavigateTab={setActiveTab}
            />
          )}

          {activeTab === 'chatbot' && (
            <AIChatbotView
              currentReport={selectedReport}
              onNavigateTab={setActiveTab}
            />
          )}

          {activeTab === 'remedies' && (
            <HomeRemediesView />
          )}

          {activeTab === 'medicines' && (
            <MedicineGuideView />
          )}

          {activeTab === 'doctor-prep' && (
            <DoctorPrepView
              reports={reports}
              initialReport={selectedReport}
            />
          )}

          {activeTab === 'prompt-lab' && (
            <PromptEngineeringLabView />
          )}
        </main>

        {/* Subtle Minimal Footer */}
        <footer className="py-5 px-6 border-t border-slate-200/80 bg-white text-xs text-slate-400 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>MedExplain AI – Health Assistant • Educational & Non-Diagnostic Tool</span>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowConsentModal(true)}
              className="text-sky-600 hover:underline cursor-pointer"
            >
              Privacy & Consent
            </button>
            <span>•</span>
            <button 
              onClick={() => setActiveTab('prompt-lab')}
              className="text-sky-600 hover:underline cursor-pointer"
            >
              IA-III Prompt Lab
            </button>
          </div>
        </footer>
      </div>

      {/* Consent Modal */}
      <ConsentModal
        isOpen={showConsentModal}
        onClose={() => setShowConsentModal(false)}
        consentGranted={consentGranted}
        setConsentGranted={setConsentGranted}
      />
    </div>
  );
}
