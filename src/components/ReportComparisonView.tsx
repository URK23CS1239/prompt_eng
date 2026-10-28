import React, { useState, useEffect } from 'react';
import { 
  GitCompare, 
  TrendingDown, 
  TrendingUp, 
  Minus, 
  FileText, 
  Calendar, 
  HelpCircle, 
  Printer, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { MedicalReport, ReportComparison } from '../types';
import { TrendChart } from './TrendChart';

interface ReportComparisonViewProps {
  reports: MedicalReport[];
  initialReportA?: MedicalReport | null;
  initialReportB?: MedicalReport | null;
  onNavigateTab: (tab: string) => void;
}

export const ReportComparisonView: React.FC<ReportComparisonViewProps> = ({
  reports,
  initialReportA,
  initialReportB,
  onNavigateTab
}) => {
  // Default to first two reports if available
  const [selectedReportAId, setSelectedReportAId] = useState<string>(
    initialReportA?.id || reports[1]?.id || reports[0]?.id || ''
  );
  const [selectedReportBId, setSelectedReportBId] = useState<string>(
    initialReportB?.id || reports[0]?.id || ''
  );
  const [comparisonResult, setComparisonResult] = useState<ReportComparison | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Trigger comparison when IDs change
  useEffect(() => {
    const reportA = reports.find(r => r.id === selectedReportAId);
    const reportB = reports.find(r => r.id === selectedReportBId);

    if (reportA && reportB) {
      runComparison(reportA, reportB);
    }
  }, [selectedReportAId, selectedReportBId, reports]);

  const runComparison = async (repA: MedicalReport, repB: MedicalReport) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/compare-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportA: repA, reportB: repB })
      });
      const data = await res.json();
      if (data.success) {
        setComparisonResult(data);
      }
    } catch (err) {
      console.error('Failed to compare reports:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const reportA = reports.find(r => r.id === selectedReportAId);
  const reportB = reports.find(r => r.id === selectedReportBId);

  // Build trend chart points from comparison
  const chartPoints = comparisonResult?.comparisons
    ?.filter(c => typeof c.baselineValue === 'number' && typeof c.currentValue === 'number')
    ?.map(c => ({
      label: c.biomarkerName,
      baseline: Number(c.baselineValue),
      current: Number(c.currentValue),
      unit: c.unit || '',
      optimalRange: 'Reference Bound',
      isDesirableLower: !/hdl|filtration|egfr|hemoglobin|ferritin/i.test(c.biomarkerName)
    })) || [];

  return (
    <div className="space-y-6">
      {/* Header & Report Selection Selector */}
      <div className="bg-white rounded-2xl border border-sky-100 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <GitCompare className="w-5 h-5 text-sky-600" />
              Previous & Current Report Comparison
            </h2>
            <p className="text-xs text-slate-500">
              Select two timeline records to contrast matching biomarkers, monitor deltas, and review unbiased clinical explanations.
            </p>
          </div>

          <button
            onClick={() => window.print()}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Comparison
          </button>
        </div>

        {/* Dual Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              1. Baseline (Previous / Older) Report
            </label>
            <select
              value={selectedReportAId}
              onChange={(e) => setSelectedReportAId(e.target.value)}
              className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2 text-slate-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-sky-500"
            >
              {reports.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.date} — {r.patientName}: {r.title}
                </option>
              ))}
            </select>
            {reportA && (
              <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-2">
                <span>Facility: {reportA.facilityName}</span>
                <span>•</span>
                <span>Type: {reportA.reportType}</span>
              </div>
            )}
          </div>

          <div className="p-3.5 rounded-xl bg-sky-50/60 border border-sky-200">
            <label className="block text-xs font-bold text-sky-900 mb-1.5">
              2. Follow-up (Current / Recent) Report
            </label>
            <select
              value={selectedReportBId}
              onChange={(e) => setSelectedReportBId(e.target.value)}
              className="w-full text-xs bg-white border border-sky-300 rounded-lg p-2 text-slate-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-sky-500"
            >
              {reports.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.date} — {r.patientName}: {r.title}
                </option>
              ))}
            </select>
            {reportB && (
              <div className="mt-2 text-[11px] text-sky-700 flex items-center gap-2">
                <span>Facility: {reportB.facilityName}</span>
                <span>•</span>
                <span>Type: {reportB.reportType}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="bg-white rounded-2xl border border-sky-100 p-8 text-center flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 rounded-full border-3 border-sky-600 border-t-transparent animate-spin"></div>
          <span className="text-xs font-bold text-slate-700">Calculating Biomarker Shifts...</span>
        </div>
      )}

      {/* Visual Chart If comparison has numeric values */}
      {!isLoading && chartPoints.length > 0 && (
        <TrendChart 
          dataPoints={chartPoints} 
          title="Matching Biomarker Shift Visualization"
          subtitle={`Contrasting ${reportA?.date || 'Baseline'} with ${reportB?.date || 'Current'}`}
        />
      )}

      {/* Comparison Matrix Table */}
      {!isLoading && comparisonResult && (
        <div className="space-y-6">
          {/* Clinical Change Narrative */}
          <div className="bg-white rounded-2xl border border-sky-100 p-6 shadow-xs">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base mb-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Longitudinal Clinical Summary</span>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ml-auto ${
                comparisonResult.overallTrend === 'Improving' ? 'bg-emerald-100 text-emerald-800' :
                comparisonResult.overallTrend === 'Stable' ? 'bg-sky-100 text-sky-800' :
                'bg-amber-100 text-amber-800'
              }`}>
                Overall: {comparisonResult.overallTrend}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
              {comparisonResult.clinicalSummary}
            </p>
          </div>

          {/* Detailed Table */}
          <div className="bg-white rounded-2xl border border-sky-100 p-6 shadow-xs overflow-hidden">
            <h3 className="font-bold text-slate-900 text-base mb-1">
              Matching Biomarkers Comparison Grid
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Detailed tracking showing baseline numbers, current values, absolute change, percentage shift, and neutral clinical explanations.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px] bg-slate-50/60">
                    <th className="py-3 px-3">Biomarker</th>
                    <th className="py-3 px-3">Baseline ({reportA?.date})</th>
                    <th className="py-3 px-3">Current ({reportB?.date})</th>
                    <th className="py-3 px-3">Delta / % Shift</th>
                    <th className="py-3 px-3">Trend Direction</th>
                    <th className="py-3 px-3 min-w-[240px]">Plain Explanation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {comparisonResult.comparisons.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3 font-semibold text-slate-900">
                        {row.biomarkerName}
                        <div className="text-[10px] text-slate-400 uppercase font-normal">{row.category}</div>
                      </td>
                      <td className="py-3 px-3 text-slate-700">
                        <span className="font-semibold">{row.baselineValue}</span> {row.unit}
                        <div className="text-[10px] text-slate-400">{row.baselineStatus}</div>
                      </td>
                      <td className="py-3 px-3 text-slate-900">
                        <span className="font-bold">{row.currentValue}</span> {row.unit}
                        <div className={`text-[10px] font-semibold ${
                          row.currentStatus === 'Normal' ? 'text-emerald-600' : 'text-amber-600'
                        }`}>
                          {row.currentStatus}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        {row.changeNumericDelta !== undefined ? (
                          <span className="font-bold text-slate-800">
                            {row.changeNumericDelta > 0 ? `+${row.changeNumericDelta}` : row.changeNumericDelta} {row.unit}
                            <span className="block text-[10px] text-slate-500 font-normal">
                              ({row.changePercentage! > 0 ? `+${row.changePercentage}` : row.changePercentage}%)
                            </span>
                          </span>
                        ) : (
                          <span className="text-slate-400">Qualitative</span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          row.changeDirection === 'improved' ? 'bg-emerald-100 text-emerald-800' :
                          row.changeDirection === 'worsened' ? 'bg-amber-100 text-amber-800' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {row.changeDirection === 'improved' ? <TrendingDown className="w-3 h-3" /> :
                           row.changeDirection === 'worsened' ? <TrendingUp className="w-3 h-3" /> :
                           <Minus className="w-3 h-3" />}
                          {row.changeDirection}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-600 leading-relaxed text-[11px]">
                        {row.plainExplanation}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Doctor Discussion Points */}
          <div className="bg-sky-50/60 rounded-2xl border border-sky-100 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-sky-950 text-sm flex items-center gap-2 mb-1">
                <HelpCircle className="w-4 h-4 text-sky-700" />
                Suggested Physician Inquiries for this Comparison
              </h4>
              <ul className="text-xs text-sky-900 space-y-1 pl-4 list-disc">
                {comparisonResult.doctorDiscussionPoints.map((pt, i) => (
                  <li key={i}>{pt}</li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => onNavigateTab('doctor-prep')}
              className="text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-xl shadow-xs shrink-0 cursor-pointer flex items-center gap-1.5 transition-colors"
            >
              Prepare Visit Brief <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
