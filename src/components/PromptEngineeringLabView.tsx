import React, { useState } from 'react';
import { 
  FlaskConical, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  BarChart3, 
  Layers, 
  Zap, 
  BookOpen, 
  Code,
  ArrowRight
} from 'lucide-react';
import { PromptEvaluationResult } from '../types';
import { PROMPT_EVALUATION_CASES } from '../data/mockData';

export const PromptEngineeringLabView: React.FC = () => {
  const [selectedCaseId, setSelectedCaseId] = useState<string>(PROMPT_EVALUATION_CASES[0].id);
  const [customQuery, setCustomQuery] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [customResult, setCustomResult] = useState<PromptEvaluationResult | null>(null);

  const activeCase = customResult || PROMPT_EVALUATION_CASES.find(c => c.id === selectedCaseId) || PROMPT_EVALUATION_CASES[0];

  const handleRunCustomEvaluation = async () => {
    if (!customQuery.trim() || isEvaluating) return;
    setIsEvaluating(true);

    try {
      const res = await fetch('/api/evaluate-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customQuery: customQuery.trim() })
      });
      const data = await res.json();
      if (data.success && data.evaluation) {
        setCustomResult(data.evaluation);
      }
    } catch (err) {
      console.error('Failed to run prompt evaluation:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-indigo-900 via-indigo-800 to-sky-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-indigo-900/15">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-xs font-semibold text-indigo-200 mb-3 border border-white/15">
            <FlaskConical className="w-3.5 h-3.5 text-indigo-300" />
            <span>Prompt Engineering IA-III Evaluation Studio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Role-Based Prompting, Few-Shot Guardrails & Clinical Safety Scoring
          </h1>
          <p className="mt-2 text-indigo-100 text-xs sm:text-sm leading-relaxed">
            Healthcare AI applications cannot rely on naive, unconstrained zero-shot prompts. In this laboratory, we empirically compare a <strong>Basic / Naive Prompt</strong> against an <strong>Engineered MedExplain Prompt</strong> incorporating role specification, few-shot exemplars, negative constraints, and safety triage filters.
          </p>

          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-md bg-indigo-800/80 border border-indigo-700 font-medium">
              1. Role Persona
            </span>
            <span className="px-2.5 py-1 rounded-md bg-indigo-800/80 border border-indigo-700 font-medium">
              2. Few-Shot Exemplars
            </span>
            <span className="px-2.5 py-1 rounded-md bg-indigo-800/80 border border-indigo-700 font-medium">
              3. Negative Constraints (No Dosage / Non-Diagnostic)
            </span>
            <span className="px-2.5 py-1 rounded-md bg-indigo-800/80 border border-indigo-700 font-medium">
              4. Emergency Triage Override
            </span>
          </div>
        </div>
      </div>

      {/* Case Studies Selector */}
      <div className="bg-white rounded-2xl border border-sky-100 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            Benchmark Clinical Test Cases
          </h3>
          {customResult && (
            <button
              onClick={() => setCustomResult(null)}
              className="text-xs text-indigo-600 font-semibold hover:underline cursor-pointer"
            >
              Reset to Standard Case Studies
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PROMPT_EVALUATION_CASES.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setCustomResult(null);
                setSelectedCaseId(item.id);
              }}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                activeCase.id === item.id
                  ? 'border-indigo-600 bg-indigo-50/60 shadow-xs ring-1 ring-indigo-500'
                  : 'border-slate-200 hover:border-indigo-300 bg-white hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-700">
                  Case Study
                </span>
                <span className="text-[10px] text-slate-400 font-mono">ID: {item.id}</span>
              </div>
              <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{item.queryTopic}</h4>
            </button>
          ))}
        </div>

        {/* Custom prompt runner */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={customQuery}
              onChange={(e) => setCustomQuery(e.target.value)}
              placeholder="Or test your own medical query (e.g. 'Can I take 800mg Ibuprofen for chest pain?')..."
              className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={handleRunCustomEvaluation}
              disabled={!customQuery.trim() || isEvaluating}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs cursor-pointer transition-colors shrink-0 flex items-center justify-center gap-1.5"
            >
              {isEvaluating ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Evaluating Prompts Side-by-Side...
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5" /> Run Side-by-Side Test
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Side-by-Side Comparison Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Basic Prompt (Naive) */}
        <div className="bg-white rounded-2xl border-2 border-rose-200 p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-rose-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                <h3 className="font-bold text-rose-950 text-sm">Naive / Basic Prompt</h3>
              </div>
              <span className="text-[10px] uppercase font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                Uncontrolled Baseline
              </span>
            </div>

            {/* Prompt text */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 font-mono text-[11px] text-slate-700">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Raw User Prompt:</span>
              "{activeCase.basicPrompt.promptText}"
            </div>

            {/* Metric scores */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-rose-50/70 p-2.5 rounded-lg border border-rose-100 text-center">
                <div className="text-base font-extrabold text-rose-700">{activeCase.basicPrompt.clarityScore}%</div>
                <div className="text-[10px] text-slate-500 font-medium">Clarity Score</div>
              </div>
              <div className="bg-rose-50/70 p-2.5 rounded-lg border border-rose-100 text-center">
                <div className="text-base font-extrabold text-rose-700">{activeCase.basicPrompt.factualScore}%</div>
                <div className="text-[10px] text-slate-500 font-medium">Factual Consistency</div>
              </div>
              <div className="bg-rose-50/70 p-2.5 rounded-lg border border-rose-100 text-center">
                <div className="text-base font-extrabold text-rose-700">{activeCase.basicPrompt.safetyScore}%</div>
                <div className="text-[10px] text-slate-500 font-medium">Safety Guardrails</div>
              </div>
            </div>

            {/* Response Output */}
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500">Raw Model Generation:</span>
              <div className="p-3.5 rounded-xl bg-slate-50 text-xs text-slate-800 leading-relaxed border border-slate-200/80 whitespace-pre-line min-h-[160px]">
                {activeCase.basicPrompt.response}
              </div>
            </div>

            {/* Vulnerabilities identified */}
            <div className="p-3.5 rounded-xl bg-rose-50/90 border border-rose-200 space-y-1.5">
              <span className="text-[11px] font-bold text-rose-900 flex items-center gap-1.5">
                <XCircle className="w-3.5 h-3.5 text-rose-600" />
                Vulnerabilities & Safety Breaches Detected:
              </span>
              <ul className="text-[11px] text-rose-950 space-y-1 pl-4 list-disc">
                {activeCase.basicPrompt.vulnerabilitiesIdentified.map((v, i) => (
                  <li key={i}>{v}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-[10px] text-slate-400">
            Technique: {activeCase.basicPrompt.technique}
          </div>
        </div>

        {/* Right: Improved MedExplain Engineered Prompt */}
        <div className="bg-white rounded-2xl border-2 border-emerald-300 p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <h3 className="font-bold text-emerald-950 text-sm">Engineered MedExplain Prompt</h3>
              </div>
              <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                IA-III Standard
              </span>
            </div>

            {/* Prompt text */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 font-mono text-[11px] text-slate-700 max-h-24 overflow-y-auto">
              <span className="text-[10px] uppercase font-bold text-emerald-700 block mb-1">System & Guardrail Prompt:</span>
              {activeCase.improvedPrompt.promptText}
            </div>

            {/* Metric scores */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-100 text-center">
                <div className="text-base font-extrabold text-emerald-700">{activeCase.improvedPrompt.clarityScore}%</div>
                <div className="text-[10px] text-slate-500 font-medium">Clarity Score</div>
              </div>
              <div className="bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-100 text-center">
                <div className="text-base font-extrabold text-emerald-700">{activeCase.improvedPrompt.factualScore}%</div>
                <div className="text-[10px] text-slate-500 font-medium">Factual Consistency</div>
              </div>
              <div className="bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-100 text-center">
                <div className="text-base font-extrabold text-emerald-700">{activeCase.improvedPrompt.safetyScore}%</div>
                <div className="text-[10px] text-slate-500 font-medium">Safety Guardrails</div>
              </div>
            </div>

            {/* Response Output */}
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-emerald-700">Engineered Model Generation:</span>
              <div className="p-3.5 rounded-xl bg-emerald-50/20 text-xs text-slate-800 leading-relaxed border border-emerald-100 whitespace-pre-line min-h-[160px]">
                {activeCase.improvedPrompt.response}
              </div>
            </div>

            {/* Engineering Enhancements */}
            <div className="p-3.5 rounded-xl bg-emerald-50/90 border border-emerald-200 space-y-1.5">
              <span className="text-[11px] font-bold text-emerald-900 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                Prompt Engineering Techniques Applied:
              </span>
              <ul className="text-[11px] text-emerald-950 space-y-1 pl-4 list-disc">
                {activeCase.improvedPrompt.engineeringEnhancements.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-[10px] text-emerald-700 font-medium">
            Technique: {activeCase.improvedPrompt.technique}
          </div>
        </div>
      </div>

      {/* Deep-Dive Engineering Analysis (For Academic / Project Evaluation) */}
      <div className="bg-white rounded-2xl border border-sky-100 p-6 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-600" />
          Technical Prompt Engineering Evaluation & Analysis
        </h3>
        <p className="text-xs text-slate-500">
          Academic analysis explaining why role-based prompts, few-shot conditioning, and negative safety constraints transform generative healthcare models:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="text-xs font-bold text-indigo-900 block">
              1. Role-Based Prompting Impact:
            </span>
            <p className="text-xs text-slate-700 leading-relaxed">
              {activeCase.engineeringAnalysis.rolePromptingImpact}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="text-xs font-bold text-indigo-900 block">
              2. Few-Shot Conditioning & Readability:
            </span>
            <p className="text-xs text-slate-700 leading-relaxed">
              {activeCase.engineeringAnalysis.fewShotImpact}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="text-xs font-bold text-indigo-900 block">
              3. Guardrails & Negative Constraints:
            </span>
            <p className="text-xs text-slate-700 leading-relaxed">
              {activeCase.engineeringAnalysis.groundingAndSafetyImpact}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1.5">
            <span className="text-xs font-bold text-emerald-950 block">
              4. Core Clinical Takeaway:
            </span>
            <p className="text-xs text-emerald-950 leading-relaxed font-medium">
              {activeCase.engineeringAnalysis.clinicalTakeaway}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
