import React from 'react';
import { VitalSigns } from '../types/clinical';
import { Activity, Heart, Thermometer, Wind, Droplets, Droplet, ShieldAlert, Brain, Zap } from 'lucide-react';

interface VitalSignsMonitorProps {
  vitals: VitalSigns;
  baselineVitals?: VitalSigns;
  statCount?: number;
  triageLevel: string;
  onOpenStat?: () => void;
  showStatButton?: boolean;
}

export const VitalSignsMonitor: React.FC<VitalSignsMonitorProps> = ({
  vitals,
  baselineVitals,
  statCount = 0,
  onOpenStat,
  showStatButton = false,
}) => {
  const bpMatch = vitals.bloodPressure.match(/(\d+)\/(\d+)/);
  const baseBpMatch = baselineVitals?.bloodPressure.match(/(\d+)\/(\d+)/);
  let mapText = '--';
  if (bpMatch) {
    const sys = parseInt(bpMatch[1], 10);
    const dia = parseInt(bpMatch[2], 10);
    const map = Math.round(dia + (sys - dia) / 3);
    mapText = `${map} mmHg`;
  }

  const sysDiff =
    bpMatch && baseBpMatch ? parseInt(bpMatch[1], 10) - parseInt(baseBpMatch[1], 10) : 0;
  const hrDiff = baselineVitals ? vitals.heartRate - baselineVitals.heartRate : 0;
  const rrDiff = baselineVitals ? vitals.respiratoryRate - baselineVitals.respiratoryRate : 0;
  const tempDiff = baselineVitals
    ? Number((vitals.temperature - baselineVitals.temperature).toFixed(1))
    : 0;
  const spo2Diff = baselineVitals ? vitals.oxygenSaturation - baselineVitals.oxygenSaturation : 0;
  const hasGlucose = typeof vitals.bloodGlucose === 'number' && !Number.isNaN(vitals.bloodGlucose);
  const glucDiff =
    hasGlucose && typeof baselineVitals?.bloodGlucose === 'number'
      ? (vitals.bloodGlucose as number) - baselineVitals.bloodGlucose
      : 0;
  const gcsDiff = baselineVitals ? vitals.glasgow - baselineVitals.glasgow : 0;

  const isTachycardic = vitals.heartRate > 100;
  const isHypotensive = bpMatch && parseInt(bpMatch[1], 10) < 90;
  const isFebrile = vitals.temperature >= 38.0;
  const isHypoxemic = vitals.oxygenSaturation < 94;
  const isTachypneic = vitals.respiratoryRate > 20;

  const isHypoglycemic = hasGlucose && (vitals.bloodGlucose as number) < 70;
  const isSevereHyperglycemic = hasGlucose && (vitals.bloodGlucose as number) >= 250;
  const isModerateHyperglycemic =
    hasGlucose && (vitals.bloodGlucose as number) >= 180 && (vitals.bloodGlucose as number) < 250;

  return (
    <div className="bg-[#030917] border-b border-blue-900/60 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 sm:gap-3">
          {/* Monitor Lead / Status + Single STAT Button */}
          <div className="flex flex-wrap items-center justify-between sm:justify-start gap-2 sm:gap-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-[11px] sm:text-xs tracking-wider uppercase font-semibold text-blue-400">
                <Activity className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Signos Vitales</span>
              </div>
              <div className="h-3.5 w-px bg-blue-900/70 hidden sm:block" />
              <div className="hidden sm:flex items-center gap-1.5 text-[11px] sm:text-xs text-blue-200 min-w-0">
                <ShieldAlert className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span className="font-medium text-white truncate">
                  {statCount > 0 ? `Monitor en Vivo · ${statCount} STAT` : 'Monitorización Clínica'}
                </span>
              </div>
            </div>

            {showStatButton && onOpenStat && (
              <button
                type="button"
                onClick={onOpenStat}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 whitespace-nowrap shrink-0 shadow-sm transition-colors cursor-pointer"
                title="Aplicar tratamiento STAT de emergencia y conversar con el paciente"
              >
                <Zap className="w-3.5 h-3.5 shrink-0" />
                <span>Aplicación STAT</span>
                {statCount > 0 && (
                  <span className="text-[10px] font-mono tabular-nums bg-black/30 px-1.5 py-0.5 rounded">
                    {statCount}
                  </span>
                )}
              </button>
            )}
          </div>

          {/* Vitals Readings Grid (2 cols on mobile, flex on desktop) */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 font-mono tabular-nums text-xs">
            {/* Presión Arterial */}
            <div
              className={`col-span-2 sm:col-span-1 flex items-center justify-between sm:justify-start gap-2 px-2.5 py-1.5 rounded-lg border transition-colors ${
                isHypotensive
                  ? 'bg-rose-950/50 border-rose-700/70 text-rose-200'
                  : 'bg-[#07132B] border-blue-900/70 text-white'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] uppercase font-sans text-blue-300 font-semibold">PA</span>
                <span className="text-sm font-bold font-mono tracking-tight">
                  {vitals.bloodPressure.split(' ')[0]}
                </span>
                <span className="text-[10px] text-blue-300/80">mmHg</span>
                {sysDiff !== 0 && (
                  <span className="text-[10px] font-bold text-sky-300">
                    ({sysDiff > 0 ? '+' : ''}{sysDiff})
                  </span>
                )}
              </div>
              <div className="text-[10px] text-blue-300/80 font-sans border-l border-blue-800/70 pl-2">
                PAM: <span className="font-mono text-white font-semibold">{mapText}</span>
              </div>
            </div>

            {/* Frecuencia Cardíaca */}
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-colors ${
                isTachycardic
                  ? 'bg-amber-950/40 border-amber-700/60 text-amber-200'
                  : 'bg-[#07132B] border-blue-900/70 text-blue-200'
              }`}
            >
              <Heart className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span className="text-[10px] uppercase font-sans text-blue-300">FC</span>
              <span className="text-sm font-bold font-mono tracking-tight text-white">{vitals.heartRate}</span>
              <span className="text-[10px] text-blue-300/80">lpm</span>
              {hrDiff !== 0 && (
                <span className="text-[10px] font-bold text-sky-300">
                  ({hrDiff > 0 ? '+' : ''}{hrDiff})
                </span>
              )}
            </div>

            {/* Frecuencia Respiratoria */}
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-colors ${
                isTachypneic
                  ? 'bg-amber-950/40 border-amber-700/60 text-amber-200'
                  : 'bg-[#07132B] border-blue-900/70 text-white'
              }`}
            >
              <Wind className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span className="text-[10px] uppercase font-sans text-blue-300">FR</span>
              <span className="text-sm font-bold font-mono tracking-tight">{vitals.respiratoryRate}</span>
              <span className="text-[10px] text-blue-300/80">rpm</span>
              {rrDiff !== 0 && (
                <span className="text-[10px] font-bold text-sky-300">
                  ({rrDiff > 0 ? '+' : ''}{rrDiff})
                </span>
              )}
            </div>

            {/* Temperatura */}
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-colors ${
                isFebrile
                  ? 'bg-rose-950/50 border-rose-700/70 text-rose-200'
                  : 'bg-[#07132B] border-blue-900/70 text-white'
              }`}
            >
              <Thermometer className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span className="text-[10px] uppercase font-sans text-blue-300">Temp</span>
              <span className="text-sm font-bold font-mono tracking-tight">{vitals.temperature.toFixed(1)}</span>
              <span className="text-[10px] text-blue-300/80">°C</span>
              {Math.abs(tempDiff) >= 0.05 && (
                <span className="text-[10px] font-bold text-sky-300">
                  ({tempDiff > 0 ? '+' : ''}{tempDiff.toFixed(1)})
                </span>
              )}
            </div>

            {/* SpO2 */}
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-colors ${
                isHypoxemic
                  ? 'bg-rose-950/50 border-rose-700/70 text-rose-200'
                  : 'bg-[#07132B] border-blue-900/70 text-white'
              }`}
            >
              <Droplets className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span className="text-[10px] uppercase font-sans text-blue-300">SpO₂</span>
              <span className="text-sm font-bold font-mono tracking-tight">{vitals.oxygenSaturation}</span>
              <span className="text-[10px] text-blue-300/80">%</span>
              {spo2Diff !== 0 && (
                <span className="text-[10px] font-bold text-emerald-300">
                  ({spo2Diff > 0 ? '+' : ''}{spo2Diff})
                </span>
              )}
            </div>

            {/* Glucemia Capilar (Glucometría) */}
            <div
              title="Glucemia capilar (Glucometría)"
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-colors ${
                isHypoglycemic || isSevereHyperglycemic
                  ? 'bg-rose-950/50 border-rose-700/70 text-rose-200'
                  : isModerateHyperglycemic
                  ? 'bg-amber-950/40 border-amber-700/60 text-amber-200'
                  : 'bg-[#07132B] border-blue-900/70 text-white'
              }`}
            >
              <Droplet className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="text-[10px] uppercase font-sans text-blue-300">Gluc</span>
              <span className="text-sm font-bold font-mono tracking-tight">
                {hasGlucose ? vitals.bloodGlucose : '--'}
              </span>
              <span className="text-[10px] text-blue-300/80">mg/dL</span>
              {glucDiff !== 0 && (
                <span className="text-[10px] font-bold text-sky-300">
                  ({glucDiff > 0 ? '+' : ''}{glucDiff})
                </span>
              )}
            </div>

            {/* Glasgow */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border bg-[#07132B] border-blue-900/70 text-white">
              <Brain className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span className="text-[10px] uppercase font-sans text-blue-300">Glasgow</span>
              <span
                className={`text-sm font-bold font-mono tracking-tight ${
                  vitals.glasgow < 15 ? 'text-amber-400' : 'text-white'
                }`}
              >
                {vitals.glasgow}/15
              </span>
              {gcsDiff !== 0 && (
                <span className="text-[10px] font-bold text-emerald-300">
                  ({gcsDiff > 0 ? '+' : ''}{gcsDiff})
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
