import React, { useState } from 'react';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  HelpCircle, 
  Printer, 
  GitCompare, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  Stethoscope,
  Apple,
  Activity,
  Moon
} from 'lucide-react';
import { MedicalReport, Biomarker } from '../types';
import { SAMPLE_REPORTS } from '../data/mockData';

interface ReportExplainerViewProps {
  currentReport: MedicalReport | null;
  onSaveReport: (report: MedicalReport) => void;
  onCompareReport: (report: MedicalReport) => void;
  onGenerateDoctorPrep: (report: MedicalReport) => void;
}

export const ReportExplainerView: React.FC<ReportExplainerViewProps> = ({
  currentReport,
  onSaveReport,
  onCompareReport,
  onGenerateDoctorPrep
}) => {
  const [activeReport, setActiveReport] = useState<MedicalReport>(currentReport || SAMPLE_REPORTS[0]);
  const [inputText, setInputText] = useState('');
  const [reportTitle, setReportTitle] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [selectedBiomarker, setSelectedBiomarker] = useState<Biomarker | null>(null);

  // Sync when currentReport prop updates
  React.useEffect(() => {
    if (currentReport) {
      setActiveReport(currentReport);
    }
  }, [currentReport]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    const reader = new FileReader();

    if (file.type.startsWith('image/')) {
      reader.onload = async () => {
        const base64 = reader.result as string;
        try {
          const res = await fetch('/api/analyze-report', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              imageBase64: base64,
              mimeType: file.type,
              title: file.name.replace(/\.[^/.]+$/, '')
            })
          });
          const result = await res.json();
          if (result.success && result.data) {
            setActiveReport(result.data);
            onSaveReport(result.data);
          }
        } catch (err) {
          console.error('Analysis failed:', err);
        } finally {
          setIsAnalyzing(false);
        }
      };
      reader.readAsDataURL(file);
    } else {
      // Read as text
      reader.onload = async () => {
        const content = reader.result as string;
        await analyzeReportText(content, file.name.replace(/\.[^/.]+$/, ''));
      };
      reader.readAsText(file);
    }
  };

  const analyzeReportText = async (textToAnalyze: string, title?: string) => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/analyze-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToAnalyze,
          title: title || reportTitle || 'Custom Laboratory Analysis'
        })
      });
      const result = await res.json();
      if (result.success && result.data) {
        setActiveReport(result.data);
        onSaveReport(result.data);
      }
    } catch (err) {
      console.error('Error analyzing report text:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadSample = (sample: MedicalReport) => {
    setActiveReport(sample);
    onSaveReport(sample);
  };

  const categories = ['All', ...new Set(activeReport.biomarkers?.map(b => b.category) || [])];
  const filteredBiomarkers = filterCategory === 'All'
    ? activeReport.biomarkers
    : activeReport.biomarkers?.filter(b => b.category === filterCategory);

  const abnormalCount = activeReport.biomarkers?.filter(b => b.status !== 'Normal').length || 0;

  return (
    <div className="space-y-6">
      {/* Upload and Sample Picker Card */}
      <div className="bg-white rounded-2xl border border-sky-100 p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-sky-600" />
              Medical Report Explainer & AI Translator
            </h2>
            <p className="text-xs text-slate-500">
              Upload blood tests, lab panels, MRI impressions, or select a pre-loaded sample to see plain-English explanations.
            </p>
          </div>

          {/* Sample quick selectors */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Quick Samples:</span>
            {SAMPLE_REPORTS.map((sample) => (
              <button
                key={sample.id}
                onClick={() => loadSample(sample)}
                className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium transition-colors cursor-pointer ${
                  activeReport.id === sample.id
                    ? 'bg-sky-50 text-sky-700 border-sky-300'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-sky-300 hover:bg-slate-50'
                }`}
              >
                {sample.patientName} ({sample.reportType})
              </button>
            ))}
          </div>
        </div>

        {/* Input & Upload Zone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Drag & drop file area */}
          <label className="border-2 border-dashed border-sky-200 hover:border-sky-400 bg-sky-50/40 hover:bg-sky-50/70 rounded-xl p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-colors group">
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.txt"
              onChange={handleFileUpload}
              className="hidden"
            />
            <div className="w-10 h-10 rounded-full bg-white shadow-xs flex items-center justify-center text-sky-600 group-hover:scale-110 transition-transform mb-2">
              <UploadCloud className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-900">Upload Report File</span>
            <span className="text-[11px] text-slate-500 mt-0.5">Supports PDF, JPG, PNG or TXT files</span>
            <span className="text-[10px] text-sky-600 font-semibold mt-2 px-2 py-0.5 rounded-full bg-sky-100">
              AI Vision & OCR Enabled
            </span>
          </label>

          {/* Paste report text directly */}
          <div className="flex flex-col gap-2">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Or paste medical report text or lab results here..."
              className="w-full h-24 p-2.5 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 resize-none"
            />
            <div className="flex justify-between items-center">
              <span className="text-[11px] text-slate-400">Paste lab values (e.g. Glucose 110, HbA1c 6.2%)</span>
              <button
                disabled={!inputText.trim() || isAnalyzing}
                onClick={() => analyzeReportText(inputText)}
                className="text-xs font-bold bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white px-3.5 py-1.5 rounded-lg shadow-xs cursor-pointer transition-colors flex items-center gap-1.5"
              >
                {isAnalyzing ? (
                  <>
                    <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    Explain Text
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Loading state indicator */}
      {isAnalyzing && (
        <div className="bg-sky-50/70 border border-sky-200 rounded-2xl p-8 text-center flex flex-col items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-full border-3 border-sky-500 border-t-transparent animate-spin"></div>
          <h3 className="font-bold text-slate-900 text-sm">Processing Medical Document...</h3>
          <p className="text-xs text-slate-500 max-w-sm">
            Extracting biomarkers, referencing clinical ranges, and generating patient-friendly explanations.
          </p>
        </div>
      )}

      {/* Main Report View */}
      {!isAnalyzing && activeReport && (
        <div className="space-y-6">
          {/* Header Card */}
          <div className="bg-white rounded-2xl border border-sky-100 p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800">
                    {activeReport.reportType}
                  </span>
                  <span className="text-xs text-slate-400">Date: {activeReport.date}</span>
                </div>
                <h1 className="text-xl font-extrabold text-slate-900">{activeReport.title}</h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Patient: <strong className="text-slate-700">{activeReport.patientName}</strong> | Facility: {activeReport.facilityName}
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => onCompareReport(activeReport)}
                  className="text-xs font-semibold text-slate-700 hover:text-sky-700 bg-slate-50 hover:bg-sky-50 border border-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <GitCompare className="w-3.5 h-3.5 text-sky-600" />
                  Compare with Previous
                </button>
                <button
                  onClick={() => onGenerateDoctorPrep(activeReport)}
                  className="text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 px-3.5 py-1.5 rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Stethoscope className="w-3.5 h-3.5" />
                  Prep Doctor Visit
                </button>
                <button
                  onClick={() => window.print()}
                  className="p-1.5 text-slate-400 hover:text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
                  title="Print report explanation"
                >
                  <Printer className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Plain-Language Summary Box */}
            <div className="mt-5 p-4 rounded-xl bg-linear-to-r from-sky-50/80 to-blue-50/80 border border-sky-200/70">
              <div className="flex items-center gap-2 text-sky-900 font-bold text-sm mb-1.5">
                <Sparkles className="w-4 h-4 text-sky-600" />
                <span>Executive Summary (In Plain English)</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {activeReport.summary}
              </p>
              <div className="mt-3 flex items-center gap-2 text-xs">
                <span className="font-semibold text-slate-700">Status Snapshot:</span>
                <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-white border border-slate-200 text-slate-700">
                  {activeReport.biomarkers?.length || 0} Total Tests
                </span>
                <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-100 text-emerald-800">
                  {(activeReport.biomarkers?.length || 0) - abnormalCount} Normal
                </span>
                {abnormalCount > 0 && (
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-100 text-amber-800">
                    {abnormalCount} Outside Standard Range
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Biomarkers & Findings Table Section */}
          <div className="bg-white rounded-2xl border border-sky-100 p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <FileText className="w-4 h-4 text-sky-600" />
                  Biomarkers & Test Interpretations
                </h3>
                <p className="text-xs text-slate-500">
                  Click on any biomarker to explore its biological function and clinical context.
                </p>
              </div>

              {/* Category tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`text-xs px-2.5 py-1 rounded-lg font-medium whitespace-nowrap cursor-pointer transition-colors ${
                      filterCategory === cat
                        ? 'bg-sky-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Biomarker cards list */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredBiomarkers?.map((bm) => {
                const isSelected = selectedBiomarker?.id === bm.id;
                const isNormal = bm.status === 'Normal';
                const isHigh = bm.status === 'High';
                const isLow = bm.status === 'Low';

                return (
                  <div
                    key={bm.id}
                    onClick={() => setSelectedBiomarker(isSelected ? null : bm)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-sky-500 bg-sky-50/50 shadow-xs ring-1 ring-sky-500'
                        : 'border-slate-100 hover:border-sky-200 bg-white hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-sm">{bm.name}</h4>
                          <span className="text-[10px] uppercase font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded-xs">
                            {bm.category}
                          </span>
                        </div>
                        {bm.referenceRange && (
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            Ref Range: <span className="font-medium text-slate-700">{bm.referenceRange} {bm.unit || ''}</span>
                          </div>
                        )}
                      </div>

                      {/* Status Badge */}
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                        isNormal
                          ? 'bg-emerald-100 text-emerald-800'
                          : isHigh
                          ? 'bg-amber-100 text-amber-800'
                          : isLow
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-indigo-100 text-indigo-800'
                      }`}>
                        {isNormal ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                        {bm.status}
                      </span>
                    </div>

                    <div className="flex items-baseline gap-1.5 text-base font-extrabold text-slate-900 mb-2">
                      <span>{bm.value}</span>
                      {bm.unit && <span className="text-xs font-normal text-slate-500">{bm.unit}</span>}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      {bm.simpleExplanation}
                    </p>

                    {bm.lifestyleContext && (
                      <div className="mt-2 text-[11px] text-sky-800 flex items-start gap-1">
                        <Info className="w-3 h-3 text-sky-600 shrink-0 mt-0.5" />
                        <span>{bm.lifestyleContext}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Lifestyle Suggestions & Doctor Discussion Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Lifestyle guidance */}
            <div className="bg-white rounded-2xl border border-sky-100 p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Apple className="w-4 h-4 text-emerald-600" />
                Evidence-Based Lifestyle Insights
              </h3>
              <p className="text-xs text-slate-500">
                General non-diagnostic wellness strategies aligned with your test profile:
              </p>

              {activeReport.lifestyleSuggestions?.nutrition && (
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Apple className="w-3.5 h-3.5 text-emerald-600" /> Dietary Focus
                  </span>
                  <ul className="text-xs text-slate-600 space-y-1 pl-4 list-disc">
                    {activeReport.lifestyleSuggestions.nutrition.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {activeReport.lifestyleSuggestions?.physicalActivity && (
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5 text-blue-600" /> Physical Movement
                  </span>
                  <ul className="text-xs text-slate-600 space-y-1 pl-4 list-disc">
                    {activeReport.lifestyleSuggestions.physicalActivity.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {activeReport.lifestyleSuggestions?.sleepAndStress && (
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Moon className="w-3.5 h-3.5 text-indigo-600" /> Sleep & Stress Recovery
                  </span>
                  <ul className="text-xs text-slate-600 space-y-1 pl-4 list-disc">
                    {activeReport.lifestyleSuggestions.sleepAndStress.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Doctor Questions Card */}
            <div className="bg-white rounded-2xl border border-sky-100 p-6 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2 mb-1">
                  <HelpCircle className="w-4 h-4 text-sky-600" />
                  Recommended Questions for Your Doctor
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Take these specific, informed questions to your appointment to facilitate a collaborative consultation:
                </p>

                <div className="space-y-2.5">
                  {activeReport.doctorQuestions?.map((q, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-sky-50/50 border border-sky-100 text-xs text-slate-800 flex items-start gap-2.5"
                    >
                      <span className="w-5 h-5 rounded-full bg-sky-200 text-sky-800 font-bold flex items-center justify-center shrink-0 text-[11px]">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{q}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">Ready for clinical review</span>
                <button
                  onClick={() => onGenerateDoctorPrep(activeReport)}
                  className="text-xs font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1 cursor-pointer"
                >
                  Generate 1-Page Prep Sheet <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
