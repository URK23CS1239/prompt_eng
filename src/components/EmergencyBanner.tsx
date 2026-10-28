import React from 'react';
import { ShieldAlert, AlertTriangle, PhoneCall, X } from 'lucide-react';

interface EmergencyBannerProps {
  onDismiss?: () => void;
}

export const EmergencyBanner: React.FC<EmergencyBannerProps> = ({ onDismiss }) => {
  return (
    <div className="bg-rose-50/80 border-b border-rose-100 px-4 py-2 text-rose-900 text-xs">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
          <span>
            <strong className="text-rose-800">Emergency Reminder:</strong> For chest pain, severe shortness of breath, or sudden weakness, call <strong>911 / 112</strong> immediately.
          </span>
        </div>
        {onDismiss && (
          <button 
            onClick={onDismiss} 
            className="text-rose-400 hover:text-rose-600 p-0.5 shrink-0 cursor-pointer text-[11px] underline"
          >
            Dismiss
          </button>
        )}
      </div>
    </div>
  );
};

interface ConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
  consentGranted: boolean;
  setConsentGranted: (granted: boolean) => void;
}

export const ConsentModal: React.FC<ConsentModalProps> = ({
  isOpen,
  onClose,
  consentGranted,
  setConsentGranted,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-sky-100 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5 text-sky-700">
            <ShieldAlert className="w-6 h-6 text-sky-600" />
            <h3 className="font-bold text-lg text-slate-900">Patient Privacy & Clinical Consent</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p>
            Welcome to <strong>MedExplain AI</strong>. Before uploading personal health records or using AI-assisted explanations, please review and accept our clinical transparency terms:
          </p>

          <div className="bg-sky-50/70 border border-sky-100 rounded-xl p-3.5 space-y-2 text-slate-700">
            <div className="flex items-start gap-2">
              <span className="font-bold text-sky-800">1. Educational Scope:</span>
              <span>This tool explains medical terms, provides lifestyle education, and prepares you for doctor visits. It does <strong>not</strong> make clinical diagnoses or prescribe personalized medication dosages.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-sky-800">2. Data Security:</span>
              <span>All uploaded lab records are processed with zero persistent external retention. Medical text and images are translated using secure Gemini API channels or processed locally in your browser.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-sky-800">3. Physician Consultation:</span>
              <span>Always consult a qualified doctor or licensed healthcare specialist before starting, stopping, or altering any medication or medical treatment.</span>
            </div>
          </div>

          <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
            <input 
              type="checkbox"
              checked={consentGranted}
              onChange={(e) => setConsentGranted(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded-sm border-slate-300 text-sky-600 focus:ring-sky-500"
            />
            <span className="text-xs text-slate-700">
              I understand that MedExplain AI is an educational assistant and agree to have my report text processed for patient-friendly explanation.
            </span>
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            onClick={() => {
              setConsentGranted(true);
              onClose();
            }}
            className="px-4 py-2 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-xs cursor-pointer transition-colors"
          >
            Acknowledge & Continue
          </button>
        </div>
      </div>
    </div>
  );
};
