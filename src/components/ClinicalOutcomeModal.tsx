import React from 'react';
import { DramaticOutcome } from '../utils/caseEvaluation';
import {
  HeartHandshake,
  HeartPulse,
  AlertTriangle,
  UserX,
  Skull,
  ShieldAlert,
  ArrowRight,
  Activity,
  Quote,
} from 'lucide-react';

interface ClinicalOutcomeModalProps {
  outcome: DramaticOutcome | null;
  patientName: string;
  onContinueToAudit: () => void;
}

export const ClinicalOutcomeModal: React.FC<ClinicalOutcomeModalProps> = ({
  outcome,
  patientName,
  onContinueToAudit,
}) => {
  if (!outcome) return null;

  const themeMap = {
    saved: {
      border: 'border-sky-400/70',
      bg: 'bg-gradient-to-b from-[#0A1F4D] via-[#051029] to-black',
      badge: 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300',
      iconWrap: 'bg-emerald-950/70 border-emerald-400/60 text-emerald-300',
      monitorColor: 'text-emerald-300 border-emerald-800/70 bg-black/60',
      cta: 'bg-white hover:bg-blue-100 text-[#030A1C]',
      icon: <HeartHandshake className="w-10 h-10 sm:w-12 sm:h-12" />,
      ecgStroke: '#34d399',
      ecgPath: 'M 0 24 L 35 24 L 42 20 L 48 24 L 54 6 L 60 40 L 66 24 L 74 19 L 82 24 L 135 24 L 142 20 L 148 24 L 154 6 L 160 40 L 166 24 L 174 19 L 182 24 L 240 24',
    },
    stabilized_morbidity: {
      border: 'border-amber-500/60',
      bg: 'bg-gradient-to-b from-[#17213B] via-[#071126] to-black',
      badge: 'bg-amber-950/70 border-amber-500/60 text-amber-300',
      iconWrap: 'bg-amber-950/60 border-amber-400/60 text-amber-300',
      monitorColor: 'text-amber-200 border-amber-800/60 bg-black/60',
      cta: 'bg-blue-600 hover:bg-blue-500 text-white',
      icon: <HeartPulse className="w-10 h-10 sm:w-12 sm:h-12" />,
      ecgStroke: '#fbbf24',
      ecgPath: 'M 0 24 L 25 24 L 30 14 L 35 34 L 40 24 L 68 24 L 74 10 L 79 38 L 85 24 L 130 24 L 135 16 L 140 32 L 146 24 L 195 24 L 200 11 L 206 36 L 212 24 L 240 24',
    },
    upset_complaint: {
      border: 'border-orange-500/60',
      bg: 'bg-gradient-to-b from-[#1A1A2E] via-[#080F24] to-black',
      badge: 'bg-orange-950/70 border-orange-500/60 text-orange-300',
      iconWrap: 'bg-orange-950/60 border-orange-400/60 text-orange-300',
      monitorColor: 'text-orange-200 border-orange-800/60 bg-black/60',
      cta: 'bg-blue-600 hover:bg-blue-500 text-white',
      icon: <UserX className="w-10 h-10 sm:w-12 sm:h-12" />,
      ecgStroke: '#fb923c',
      ecgPath: 'M 0 24 L 40 24 L 45 16 L 50 32 L 55 24 L 110 24 L 115 16 L 120 32 L 125 24 L 180 24 L 185 16 L 190 32 L 195 24 L 240 24',
    },
    critical_morbidity: {
      border: 'border-rose-500/75',
      bg: 'bg-gradient-to-b from-[#2B0C16] via-[#100918] to-black',
      badge: 'bg-rose-950/80 border-rose-500 text-rose-200',
      iconWrap: 'bg-rose-950/70 border-rose-500 text-rose-300',
      monitorColor: 'text-rose-200 border-rose-800/70 bg-black/70',
      cta: 'bg-white hover:bg-rose-100 text-rose-950',
      icon: <ShieldAlert className="w-10 h-10 sm:w-12 sm:h-12 animate-pulse" />,
      ecgStroke: '#fb7185',
      ecgPath: 'M 0 24 L 15 12 L 22 38 L 28 8 L 35 42 L 42 18 L 52 24 L 78 24 L 84 6 L 90 42 L 96 14 L 105 24 L 145 24 L 150 9 L 157 40 L 165 24 L 210 14 L 218 36 L 225 24 L 240 24',
    },
    deceased: {
      border: 'border-rose-700/80',
      bg: 'bg-gradient-to-b from-[#1C060B] via-[#090306] to-black',
      badge: 'bg-black border-rose-600 text-rose-400',
      iconWrap: 'bg-black border-rose-700 text-rose-400',
      monitorColor: 'text-rose-300 border-rose-900 bg-black/90',
      cta: 'bg-white hover:bg-blue-100 text-[#030A1C]',
      icon: <Skull className="w-10 h-10 sm:w-12 sm:h-12" />,
      ecgStroke: '#e11d48',
      ecgPath: 'M 0 24 L 35 24 L 40 20 L 45 26 L 52 24 L 240 24',
    },
  };

  const t = themeMap[outcome.status];

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div
        className={`w-full max-w-2xl rounded-2xl border-2 ${t.border} ${t.bg} shadow-2xl overflow-hidden my-auto`}
      >
        {/* Top Dramatic Hospital Telemetry Strip */}
        <div className="px-4 sm:px-6 py-3 bg-black/60 border-b border-white/10 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-sky-400 shrink-0" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-blue-200">
              Desenlace Clínico · {patientName}
            </span>
          </div>

          <span className={`px-2.5 py-0.5 rounded-md border text-[10px] font-bold uppercase tracking-wider ${t.badge}`}>
            {outcome.badgeLabel}
          </span>
        </div>

        {/* Main Dramatic Scene */}
        <div className="p-5 sm:p-8 space-y-5 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5">
            <div
              className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-2 ${t.iconWrap} flex items-center justify-center shrink-0 shadow-lg`}
            >
              {t.icon}
            </div>

            <div className="space-y-1.5 min-w-0 flex-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <svg
                  viewBox="0 0 240 48"
                  className="w-44 h-8 bg-black/50 rounded-md border border-white/10 px-1"
                  aria-hidden="true"
                >
                  <path
                    d={t.ecgPath}
                    fill="none"
                    stroke={t.ecgStroke}
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-snug">
                {outcome.headline}
              </h2>
            </div>
          </div>

          {/* Narrative Card */}
          <div className="bg-black/55 border border-white/15 rounded-xl p-4 sm:p-5 space-y-3 text-left">
            <p className="text-xs sm:text-sm text-blue-50 leading-relaxed">
              {outcome.sceneNarrative}
            </p>

            {outcome.patientQuote && (
              <div className="flex items-start gap-2.5 bg-white/5 border border-white/10 rounded-lg p-3 text-xs italic text-sky-100">
                <Quote className="w-4 h-4 text-sky-300 shrink-0 mt-0.5" />
                <span>{outcome.patientQuote}</span>
              </div>
            )}

            <div className={`rounded-lg border px-3 py-2 text-[11px] sm:text-xs font-mono flex items-center gap-2 ${t.monitorColor}`}>
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>{outcome.vitalMonitorStatus}</span>
            </div>

            <p className="text-[11px] sm:text-xs text-blue-200/80">
              {outcome.clinicalPostscript}
            </p>
          </div>

          {/* Action CTA — Reveals score & feedback only after user reads outcome */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-[11px] text-blue-200/70 text-center sm:text-left">
              A continuación podrás revisar tu puntaje desglosado y la retroalimentación académica completa.
            </span>

            <button
              onClick={onContinueToAudit}
              className={`w-full sm:w-auto px-5 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer shrink-0 ${t.cta}`}
            >
              <span>Ver Puntaje y Retroalimentación</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
