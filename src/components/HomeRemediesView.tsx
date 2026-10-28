import React, { useState } from 'react';
import { 
  HeartHandshake, 
  Search, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Sparkles, 
  HelpCircle,
  ShieldCheck,
  Stethoscope
} from 'lucide-react';
import { HomeRemedy } from '../types';
import { HOME_REMEDIES } from '../data/mockData';

export const HomeRemediesView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [customSymptom, setCustomSymptom] = useState('');
  const [customRemedyResult, setCustomRemedyResult] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const categories = ['All', 'Respiratory', 'Digestion', 'Neurological & Stress', 'First Aid & Skin'];

  const filteredRemedies = HOME_REMEDIES.filter((item) => {
    const matchesSearch = item.ailment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  const handleGenerateCustom = async () => {
    if (!customSymptom.trim() || isGenerating) return;
    setIsGenerating(true);
    setCustomRemedyResult(null);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMessage: `Provide safe, evidence-based home-care suggestions for: "${customSymptom}". Include:
1. Safe home remedy steps with clear instructions
2. Scientific evidence or rationale
3. What NOT to do (precautions & contraindications)
4. Red flags: When to consult a doctor immediately`
        })
      });
      const data = await res.json();
      setCustomRemedyResult(data.reply);
    } catch (err) {
      console.error('Error generating home remedy:', err);
      setCustomRemedyResult('Unable to retrieve home remedies. Please speak with your healthcare provider.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-sky-100 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-emerald-600" />
              Evidence-Based Home Care & Safe Remedies
            </h2>
            <p className="text-xs text-slate-500">
              Reliable, clinically safe home guidance for minor self-limiting symptoms with clear precautions and doctor consultation thresholds.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full self-start sm:self-auto">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Non-Prescriptive Self-Care Guide</span>
          </div>
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by symptom or ailment (e.g. sore throat, heartburn, headache)..."
              className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-3 py-2 rounded-xl font-medium whitespace-nowrap cursor-pointer transition-colors ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Custom Symptom AI Remedy Box */}
      <div className="bg-linear-to-r from-emerald-50/60 to-sky-50/60 rounded-2xl border border-emerald-200/80 p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-2 text-emerald-950 font-bold text-sm">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>Ask for Evidence-Based Guidance on Any Minor Ailment</span>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={customSymptom}
            onChange={(e) => setCustomSymptom(e.target.value)}
            placeholder="Type a minor symptom (e.g. mild ankle sprain, hiccups, chapped lips, dry eye strain)..."
            className="flex-1 text-xs sm:text-sm bg-white border border-emerald-200 rounded-xl px-4 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
          />
          <button
            onClick={handleGenerateCustom}
            disabled={!customSymptom.trim() || isGenerating}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs cursor-pointer transition-colors shrink-0 flex items-center justify-center gap-1.5"
          >
            {isGenerating ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Reviewing Guidelines...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Find Safe Care Steps
              </>
            )}
          </button>
        </div>

        {customRemedyResult && (
          <div className="mt-4 p-4 rounded-xl bg-white border border-emerald-200 text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line shadow-xs">
            {customRemedyResult}
          </div>
        )}
      </div>

      {/* Catalog Cards */}
      <div className="space-y-5">
        {filteredRemedies.map((remedy) => (
          <div
            key={remedy.id}
            className="bg-white rounded-2xl border border-sky-100 p-6 shadow-xs space-y-4"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                    {remedy.category}
                  </span>
                  <span className="text-xs text-slate-400">Severity: {remedy.severity}</span>
                </div>
                <h3 className="text-base font-extrabold text-slate-900">{remedy.ailment}</h3>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {remedy.description}
            </p>

            {/* Remedies list */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                Recommended Evidence-Based Steps:
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {remedy.remedies.map((r, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-xs text-slate-900">{r.name}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {r.evidenceLevel}
                      </span>
                    </div>

                    <ol className="text-xs text-slate-600 space-y-1 pl-4 list-decimal">
                      {r.steps.map((st, sIdx) => (
                        <li key={sIdx}>{st}</li>
                      ))}
                    </ol>

                    <div className="text-[11px] text-sky-800 bg-sky-50/60 p-2 rounded-lg">
                      <strong>Clinical note:</strong> {r.safetyNote}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Do NOTs & Red Flags Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Do Nots */}
              <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-200/80 space-y-2">
                <h5 className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                  <XCircle className="w-4 h-4 text-rose-600" />
                  What NOT to Do (Precautions):
                </h5>
                <ul className="text-xs text-rose-950 space-y-1.5 pl-4 list-disc">
                  {remedy.doNots.map((d, dIdx) => (
                    <li key={dIdx}>{d}</li>
                  ))}
                </ul>
              </div>

              {/* When to see doctor */}
              <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80 space-y-2">
                <h5 className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  When to Consult a Doctor Immediately:
                </h5>
                <ul className="text-xs text-amber-950 space-y-1.5 pl-4 list-disc">
                  {remedy.whenToSeeDoctor.map((w, wIdx) => (
                    <li key={wIdx}>{w}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
