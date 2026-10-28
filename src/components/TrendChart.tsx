import React, { useState } from 'react';
import { TrendingDown, TrendingUp, Minus, Info } from 'lucide-react';

interface TrendDataPoint {
  label: string;
  baseline: number;
  current: number;
  unit: string;
  optimalRange: string;
  isDesirableLower?: boolean; // For LDL/Glucose: lower is desirable; for HDL/Hemoglobin: higher is desirable
}

interface TrendChartProps {
  dataPoints: TrendDataPoint[];
  title?: string;
  subtitle?: string;
}

export const TrendChart: React.FC<TrendChartProps> = ({
  dataPoints,
  title = 'Biomarker Trajectory & Longitudinal Comparison',
  subtitle = 'Visual tracking between Baseline (Old) and Follow-up (Current) tests'
}) => {
  const [selectedPoint, setSelectedPoint] = useState<TrendDataPoint | null>(dataPoints[0] || null);

  return (
    <div className="bg-white rounded-2xl border border-sky-100 p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <span>{title}</span>
            <span className="text-xs font-normal text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
              Interactive
            </span>
          </h3>
          <p className="text-xs text-slate-500">{subtitle}</p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-slate-400"></span>
            <span className="text-slate-600 font-medium">Previous Baseline</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-sky-600"></span>
            <span className="text-sky-900 font-medium">Current Follow-up</span>
          </div>
        </div>
      </div>

      {/* Chart Bars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dataPoints.map((item, idx) => {
          const maxVal = Math.max(item.baseline, item.current) * 1.25 || 100;
          const baselineHeightPct = Math.min(100, Math.max(12, (item.baseline / maxVal) * 100));
          const currentHeightPct = Math.min(100, Math.max(12, (item.current / maxVal) * 100));

          const delta = Math.round((item.current - item.baseline) * 10) / 10;
          const pct = Math.round(((item.current - item.baseline) / item.baseline) * 1000) / 10;
          
          const isImproving = item.isDesirableLower ? delta < 0 : delta > 0;
          const isNeutral = Math.abs(pct) < 1.5;

          return (
            <div 
              key={idx}
              onClick={() => setSelectedPoint(item)}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                selectedPoint?.label === item.label
                  ? 'border-sky-500 bg-sky-50/40 shadow-xs'
                  : 'border-slate-100 hover:border-sky-200 hover:bg-slate-50/50'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-slate-900 text-sm">{item.label}</h4>
                  <span className="text-[11px] text-slate-500">Ref: {item.optimalRange} {item.unit}</span>
                </div>

                {/* Badge indicator */}
                <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                  isNeutral 
                    ? 'bg-slate-100 text-slate-700' 
                    : isImproving 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {isNeutral ? (
                    <Minus className="w-3 h-3" />
                  ) : isImproving ? (
                    <TrendingDown className={`w-3 h-3 ${item.isDesirableLower ? 'text-emerald-700' : 'rotate-180 text-emerald-700'}`} />
                  ) : (
                    <TrendingUp className={`w-3 h-3 ${item.isDesirableLower ? 'text-amber-700' : 'rotate-180 text-amber-700'}`} />
                  )}
                  {delta > 0 ? `+${delta}` : delta} {item.unit} ({pct > 0 ? `+${pct}` : pct}%)
                </span>
              </div>

              {/* Bar visualization */}
              <div className="h-28 bg-slate-50 rounded-lg p-2 flex items-end justify-center gap-6 border border-slate-100 relative">
                {/* Baseline bar */}
                <div className="flex flex-col items-center gap-1 h-full justify-end">
                  <span className="text-[10px] font-bold text-slate-600">{item.baseline}</span>
                  <div 
                    className="w-7 bg-slate-300 rounded-t-sm transition-all duration-500 relative group"
                    style={{ height: `${baselineHeightPct}%` }}
                  >
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-1.5 py-0.5 rounded-sm whitespace-nowrap z-10 pointer-events-none transition-opacity">
                      Baseline: {item.baseline} {item.unit}
                    </div>
                  </div>
                  <span className="text-[9px] text-slate-400 uppercase tracking-wider font-medium">Prev</span>
                </div>

                {/* Current bar */}
                <div className="flex flex-col items-center gap-1 h-full justify-end">
                  <span className={`text-[10px] font-bold ${isImproving ? 'text-sky-700' : 'text-slate-700'}`}>
                    {item.current}
                  </span>
                  <div 
                    className={`w-7 rounded-t-sm transition-all duration-500 relative group ${
                      isImproving ? 'bg-sky-600' : 'bg-amber-500'
                    }`}
                    style={{ height: `${currentHeightPct}%` }}
                  >
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-7 left-1/2 -translate-x-1/2 bg-sky-900 text-white text-[10px] px-1.5 py-0.5 rounded-sm whitespace-nowrap z-10 pointer-events-none transition-opacity">
                      Current: {item.current} {item.unit}
                    </div>
                  </div>
                  <span className="text-[9px] text-sky-700 uppercase tracking-wider font-bold">Now</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected marker detail note */}
      {selectedPoint && (
        <div className="mt-4 p-3 bg-sky-50/60 rounded-xl border border-sky-100 flex items-start gap-2.5 text-xs text-sky-900">
          <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
          <div>
            <strong>Clinical Perspective on {selectedPoint.label}:</strong> Normal target is{' '}
            <span className="font-semibold">{selectedPoint.optimalRange} {selectedPoint.unit}</span>.
            {selectedPoint.isDesirableLower ? (
              <span> Lower values reflect positive risk mitigation. Continue balanced nutrition and consult your doctor for personalized targets.</span>
            ) : (
              <span> Higher values in this category typically reflect protective health reserves.</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
