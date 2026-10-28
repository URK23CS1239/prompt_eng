import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Printer, 
  Copy, 
  Check, 
  FileText, 
  Stethoscope, 
  Sparkles, 
  HelpCircle, 
  Plus, 
  AlertCircle,
  Calendar,
  Building2,
  User
} from 'lucide-react';
import { MedicalReport } from '../types';

interface DoctorPrepViewProps {
  reports: MedicalReport[];
  initialReport?: MedicalReport | null;
}

export const DoctorPrepView: React.FC<DoctorPrepViewProps> = ({ reports, initialReport }) => {
  const [selectedReportId, setSelectedReportId] = useState<string>(
    initialReport?.id || reports[0]?.id || ''
  );
  const [primaryConcern, setPrimaryConcern] = useState(
    'Review my recent blood test results, discuss HbA1c progress, and evaluate if my cholesterol target needs medication adjustment.'
  );
  const [currentSymptoms, setCurrentSymptoms] = useState(
    'Occasional afternoon fatigue; mild knee stiffness in the morning.'
  );
  const [currentMeds, setCurrentMeds] = useState(
    'Metformin 500mg daily, Omega-3 Fish Oil 1000mg, Multivitamin'
  );
  const [copied, setCopied] = useState(false);
  const [checkedQuestions, setCheckedQuestions] = useState<Record<number, boolean>>({});

  const activeReport = reports.find(r => r.id === selectedReportId) || reports[0];

  const defaultQuestions = activeReport ? [
    ...activeReport.doctorQuestions,
    'What specific target range do you recommend for my personal cardiovascular risk profile?',
    'Are there any side effects from my current medication routine I should be mindful of?',
    'When should we schedule my next monitoring lab panel?'
  ] : [
    'What do my recent test findings mean for my overall health?',
    'Should we schedule a follow-up test in 3 to 6 months?',
    'Are there dietary or exercise modifications you suggest?'
  ];

  const [questionsList, setQuestionsList] = useState<string[]>(defaultQuestions);
  const [newQuestionInput, setNewQuestionInput] = useState('');

  const handleAddQuestion = () => {
    if (!newQuestionInput.trim()) return;
    setQuestionsList(prev => [...prev, newQuestionInput.trim()]);
    setNewQuestionInput('');
  };

  const toggleCheck = (index: number) => {
    setCheckedQuestions(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleCopy = () => {
    const text = `--- DOCTOR CONSULTATION PREPARATION BRIEF ---
Patient: ${activeReport?.patientName || 'Patient'}
Date: ${new Date().toLocaleDateString()}
Report Referenced: ${activeReport?.title || 'None'} (${activeReport?.date || ''})

PRIMARY REASON FOR VISIT:
${primaryConcern}

REPORTED SYMPTOMS:
${currentSymptoms}

CURRENT MEDICATIONS & SUPPLEMENTS:
${currentMeds}

KEY LAB OBSERVATIONS & ABNORMALITIES:
${activeReport?.biomarkers?.filter(b => b.status !== 'Normal').map(b => `- ${b.name}: ${b.value} ${b.unit || ''} (${b.status}) - ${b.simpleExplanation}`).join('\n') || 'None'}

PRIORITIZED QUESTIONS FOR MY DOCTOR:
${questionsList.map((q, i) => `${i + 1}. [ ] ${q}`).join('\n')}
`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="bg-white rounded-2xl border border-sky-100 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-sky-600" />
              Doctor Consultation Preparation Sheet
            </h2>
            <p className="text-xs text-slate-500">
              Generate an organized, 1-page clinical visit brief with lab summaries and targeted questions to maximize your consultation time.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Brief' : 'Copy Brief'}</span>
            </button>
            <button
              onClick={() => window.print()}
              className="text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 px-3.5 py-1.5 rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Visit Sheet
            </button>
          </div>
        </div>

        {/* Input Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Select Report to Reference:
            </label>
            <select
              value={selectedReportId}
              onChange={(e) => setSelectedReportId(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-sky-500"
            >
              {reports.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.date} — {r.patientName}: {r.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Primary Reason / Chief Concern for this Visit:
            </label>
            <input
              type="text"
              value={primaryConcern}
              onChange={(e) => setPrimaryConcern(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Recent Symptoms (if any):
            </label>
            <input
              type="text"
              value={currentSymptoms}
              onChange={(e) => setCurrentSymptoms(e.target.value)}
              placeholder="e.g. Mild headache, fatigue after meals, sleep disruption..."
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Current Medications & Supplements:
            </label>
            <input
              type="text"
              value={currentMeds}
              onChange={(e) => setCurrentMeds(e.target.value)}
              placeholder="e.g. Metformin 500mg, Atorvastatin 20mg, Vitamin D..."
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>
      </div>

      {/* Printable Sheet Preview */}
      <div className="bg-white rounded-2xl border-2 border-slate-300 p-6 sm:p-8 shadow-md space-y-6 print:border-none print:shadow-none print:p-0">
        {/* Header Clinical Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b-2 border-slate-900 gap-2">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-sky-800 bg-sky-100 px-2 py-0.5 rounded-sm">
              Clinical Visit Briefing Document
            </span>
            <h1 className="text-xl font-black text-slate-900 mt-1">
              Patient Consultation & Lab Summary
            </h1>
          </div>

          <div className="text-right text-xs text-slate-600">
            <div>Date Generated: <strong>{new Date().toLocaleDateString()}</strong></div>
            <div>Patient: <strong>{activeReport?.patientName || 'Patient'}</strong></div>
          </div>
        </div>

        {/* Section 1: Clinical Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
          <div>
            <span className="font-bold text-slate-500 block uppercase text-[10px]">Reason for Appointment</span>
            <span className="font-semibold text-slate-900">{primaryConcern}</span>
          </div>
          <div>
            <span className="font-bold text-slate-500 block uppercase text-[10px]">Current Symptoms Noted</span>
            <span className="text-slate-800">{currentSymptoms || 'None reported'}</span>
          </div>
          <div>
            <span className="font-bold text-slate-500 block uppercase text-[10px]">Medications & Supplements</span>
            <span className="text-slate-800">{currentMeds || 'None listed'}</span>
          </div>
        </div>

        {/* Section 2: Laboratory Findings Summary */}
        {activeReport && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-sky-600" />
                Referenced Report: {activeReport.title} ({activeReport.date})
              </h3>
              <span className="text-[11px] text-slate-500">{activeReport.facilityName}</span>
            </div>

            {/* Abnormal markers callout */}
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 font-semibold">
                  <tr>
                    <th className="py-2 px-3">Biomarker</th>
                    <th className="py-2 px-3">Result</th>
                    <th className="py-2 px-3">Reference Bound</th>
                    <th className="py-2 px-3">Status</th>
                    <th className="py-2 px-3">Patient Context</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {activeReport.biomarkers?.map((bm) => (
                    <tr key={bm.id} className={bm.status !== 'Normal' ? 'bg-amber-50/40' : ''}>
                      <td className="py-2 px-3 font-semibold text-slate-900">{bm.name}</td>
                      <td className="py-2 px-3 font-bold text-slate-800">{bm.value} {bm.unit || ''}</td>
                      <td className="py-2 px-3 text-slate-500">{bm.referenceRange || 'N/A'}</td>
                      <td className="py-2 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          bm.status === 'Normal' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {bm.status}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-slate-600 text-[11px]">{bm.simpleExplanation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Section 3: Prioritized Questions for the Physician */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-sky-600" />
              Prioritized Discussion Questions to Ask Doctor ({questionsList.length})
            </h3>
            <span className="text-[11px] text-slate-400">Check off as answered during visit</span>
          </div>

          <div className="space-y-2">
            {questionsList.map((q, idx) => {
              const isChecked = !!checkedQuestions[idx];
              return (
                <div
                  key={idx}
                  onClick={() => toggleCheck(idx)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 text-xs ${
                    isChecked
                      ? 'bg-slate-50 border-slate-200 line-through text-slate-400'
                      : 'bg-sky-50/40 border-sky-200/80 text-slate-800 hover:bg-sky-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}}
                    className="mt-0.5 h-4 w-4 text-sky-600 rounded-sm"
                  />
                  <div className="flex-1 font-medium">{q}</div>
                  <span className="text-[10px] text-slate-400 font-mono">Q{idx + 1}</span>
                </div>
              );
            })}
          </div>

          {/* Add custom question */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="text"
              value={newQuestionInput}
              onChange={(e) => setNewQuestionInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddQuestion()}
              placeholder="Add another personalized question for your doctor..."
              className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-sky-500"
            />
            <button
              onClick={handleAddQuestion}
              className="bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1 cursor-pointer transition-colors shrink-0"
            >
              <Plus className="w-3.5 h-3.5" /> Add Question
            </button>
          </div>
        </div>

        {/* Section 4: Physician Instructions & Notes Area */}
        <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
            Doctor's Advice & Next Steps (To be filled during consultation):
          </span>
          <div className="h-20 border-b border-dashed border-slate-300"></div>
          <div className="h-10 border-b border-dashed border-slate-300"></div>
        </div>

        {/* Footer Note */}
        <div className="pt-2 text-[10px] text-slate-400 text-center border-t border-slate-100">
          Generated via MedExplain AI • Patient Self-Advocacy & Health Literacy Tool • Non-Diagnostic
        </div>
      </div>
    </div>
  );
};
