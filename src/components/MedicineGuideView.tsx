import React, { useState } from 'react';
import { 
  Pill, 
  Search, 
  AlertTriangle, 
  Info, 
  Sparkles, 
  ShieldAlert, 
  Utensils, 
  Zap, 
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { Medicine } from '../types';
import { MEDICINES_DATABASE } from '../data/mockData';

export const MedicineGuideView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMed, setSelectedMed] = useState<Medicine | null>(MEDICINES_DATABASE[0]);
  const [customMedQuery, setCustomMedQuery] = useState('');
  const [customMedResult, setCustomMedResult] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const filteredMeds = MEDICINES_DATABASE.filter((med) => {
    const term = searchTerm.toLowerCase();
    const matchesGeneric = med.genericName.toLowerCase().includes(term);
    const matchesBrand = med.brandNames.some(b => b.toLowerCase().includes(term));
    const matchesClass = med.drugClass.toLowerCase().includes(term);
    const matchesUse = med.primaryUses.some(u => u.toLowerCase().includes(term));
    return matchesGeneric || matchesBrand || matchesClass || matchesUse;
  });

  const handleCustomSearch = async () => {
    if (!customMedQuery.trim() || isSearching) return;
    setIsSearching(true);
    setCustomMedResult(null);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMessage: `Provide educational medicine information for: "${customMedQuery}".
Include:
1. Drug class and primary uses
2. Plain-language mechanism of action
3. Common side effects vs serious adverse signs
4. Precautions & contraindications
5. Drug and food interactions
STRICT REQUIREMENT: Do NOT recommend specific dosages. Include standard educational disclaimer.`
        })
      });
      const data = await res.json();
      setCustomMedResult(data.reply);
    } catch (err) {
      console.error('Error fetching medicine details:', err);
      setCustomMedResult('Unable to retrieve medicine information. Please consult your physician or pharmacist.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-sky-100 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Pill className="w-5 h-5 text-sky-600" />
              Prescription & OTC Medicine Knowledge Explorer
            </h2>
            <p className="text-xs text-slate-500">
              Learn about drug mechanisms, general uses, side effects, and critical food/drug interactions in plain language.
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full self-start sm:self-auto">
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            <span>Strictly Educational — No Dosages Prescribed</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by generic or brand name (e.g. Metformin, Lipitor, Lisinopril, Omeprazole, Tylenol)..."
            className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
          />
        </div>
      </div>

      {/* Main Grid: Medicine List Sidebar + Medicine Details Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left List */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
            Common Medications Directory ({filteredMeds.length})
          </h3>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredMeds.map((med) => (
              <div
                key={med.id}
                onClick={() => setSelectedMed(med)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  selectedMed?.id === med.id
                    ? 'border-sky-500 bg-sky-50/70 shadow-xs ring-1 ring-sky-500'
                    : 'border-slate-100 hover:border-sky-200 bg-white hover:bg-slate-50/60'
                }`}
              >
                <div className="flex items-start justify-between gap-1 mb-1">
                  <h4 className="font-bold text-slate-900 text-sm">{med.genericName}</h4>
                  <span className="text-[10px] text-sky-700 bg-sky-100/70 px-1.5 py-0.2 rounded-xs font-medium">
                    {med.brandNames[0]}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 line-clamp-1">{med.drugClass}</div>
                <div className="text-[11px] text-slate-600 line-clamp-1 mt-1 font-medium">
                  Uses: {med.primaryUses[0]}
                </div>
              </div>
            ))}

            {filteredMeds.length === 0 && (
              <div className="p-6 text-center text-xs text-slate-400 bg-white rounded-xl border border-slate-100">
                No matching medications found in local database. Try the AI search below.
              </div>
            )}
          </div>

          {/* AI Search Card */}
          <div className="bg-sky-50/50 rounded-xl p-4 border border-sky-200/80 space-y-2 mt-4">
            <span className="text-xs font-bold text-sky-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" /> Search Any Other Medication
            </span>
            <input
              type="text"
              value={customMedQuery}
              onChange={(e) => setCustomMedQuery(e.target.value)}
              placeholder="Enter drug name (e.g. Losartan, Gabapentin)..."
              className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 focus:outline-hidden focus:ring-1 focus:ring-sky-500"
            />
            <button
              onClick={handleCustomSearch}
              disabled={!customMedQuery.trim() || isSearching}
              className="w-full bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white font-bold text-xs py-2 rounded-lg cursor-pointer transition-colors flex items-center justify-center gap-1.5"
            >
              {isSearching ? (
                <>
                  <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Looking up Drug Profile...
                </>
              ) : (
                'Lookup Medication'
              )}
            </button>
          </div>
        </div>

        {/* Right Details Panel */}
        <div className="lg:col-span-8 space-y-6">
          {customMedResult ? (
            <div className="bg-white rounded-2xl border border-sky-100 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-sky-600" />
                  AI Clinical Information for "{customMedQuery}"
                </h3>
                <button
                  onClick={() => setCustomMedResult(null)}
                  className="text-xs text-sky-600 hover:underline cursor-pointer"
                >
                  Return to Standard Profile
                </button>
              </div>
              <div className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-xl border border-slate-100">
                {customMedResult}
              </div>
            </div>
          ) : selectedMed ? (
            <div className="bg-white rounded-2xl border border-sky-100 p-6 shadow-xs space-y-6">
              {/* Header */}
              <div className="pb-4 border-b border-slate-100">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <h3 className="text-xl font-extrabold text-slate-900">{selectedMed.genericName}</h3>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800">
                    {selectedMed.drugClass}
                  </span>
                </div>
                <div className="text-xs text-slate-500">
                  Common Brand Names: <strong className="text-slate-700">{selectedMed.brandNames.join(', ')}</strong>
                </div>
              </div>

              {/* Primary Uses & Mechanism */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-sky-600" /> Primary Indications
                  </h4>
                  <ul className="text-xs text-slate-600 space-y-1 pl-4 list-disc">
                    {selectedMed.primaryUses.map((u, i) => (
                      <li key={i}>{u}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-500" /> How It Works
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {selectedMed.howItWorks}
                  </p>
                </div>
              </div>

              {/* Side Effects */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-sky-50/50 border border-sky-100 space-y-2">
                  <h4 className="text-xs font-bold text-sky-900 flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-sky-600" /> Common Side Effects (Usually Mild)
                  </h4>
                  <ul className="text-xs text-slate-700 space-y-1 pl-4 list-disc">
                    {selectedMed.commonSideEffects.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-200 space-y-2">
                  <h4 className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600" /> Serious Adverse Effects (Contact Doctor)
                  </h4>
                  <ul className="text-xs text-rose-950 space-y-1 pl-4 list-disc">
                    {selectedMed.seriousAdverseEffects.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Interactions & Food */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Utensils className="w-4 h-4 text-purple-600" /> Critical Drug & Food Interactions
                </h4>

                <div className="space-y-2">
                  {selectedMed.interactions.map((inter, i) => (
                    <div key={i} className="p-3 rounded-xl bg-purple-50/40 border border-purple-100 text-xs">
                      <strong className="text-purple-950 font-semibold">{inter.drug}:</strong>{' '}
                      <span className="text-slate-700">{inter.description}</span>
                    </div>
                  ))}

                  {selectedMed.foodInteractions?.map((food, i) => (
                    <div key={`food-${i}`} className="p-3 rounded-xl bg-emerald-50/40 border border-emerald-100 text-xs text-emerald-950">
                      <strong>Food & Dietary Guidelines:</strong> {food}
                    </div>
                  ))}
                </div>
              </div>

              {/* Disclaimer */}
              <div className="p-3.5 rounded-xl bg-slate-100/80 text-[11px] text-slate-500 border border-slate-200 flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>{selectedMed.disclaimer}</span>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
