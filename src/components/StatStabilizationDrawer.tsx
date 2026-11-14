import React, { useState, useRef, useEffect } from 'react';
import {
  Zap,
  Syringe,
  Activity,
  TrendingUp,
  TrendingDown,
  Minus,
  Send,
  CornerDownLeft,
  Volume2,
  VolumeX,
  UserRound,
  Baby,
  Stethoscope,
  Sparkles,
  MessageCircleQuestion,
  AlertTriangle,
  CheckCircle2,
  X,
  Clock,
  ShieldCheck,
  Skull,
  AlertOctagon,
} from 'lucide-react';
import {
  ChatMessage,
  ClinicalCase,
  StatInterventionRecord,
  VitalSigns,
} from '../types/clinical';
import {
  STAT_QUICK_PRESETS,
  StatApplyInput,
  StatPreset,
} from '../utils/statStabilization';

interface StatStabilizationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  caseData: ClinicalCase;
  baselineVitals: VitalSigns;
  liveVitals: VitalSigns;
  statInterventions: StatInterventionRecord[];
  messages: ChatMessage[];
  onApplyStat: (input: StatApplyInput) => void;
  onSendMessage: (text: string) => Promise<void>;
  isChatLoading: boolean;
  isDeceased?: boolean;
}

type CategoryFilter = 'Todos' | StatPreset['category'];

const CATEGORY_FILTERS: CategoryFilter[] = [
  'Todos',
  'Vía Aérea / O₂',
  'Hemodinamia / Líquidos',
  'Cardio / Crisis',
  'Metabólico / Síntomas',
];

const POST_STAT_QUESTIONS = [
  '¿Cómo se siente ahora después de lo que le acabamos de aplicar?',
  '¿Siente que respira más fácil o le falta menos el aire?',
  '¿Le disminuyó el dolor, el mareo o la presión en la cabeza?',
  '¿Notó mareo nuevo, visión borrosa, picazón o palpitaciones tras la dosis?',
];

function parseBPNums(bp: string): { sys: number; dia: number } {
  const match = bp.match(/(\d+)\s*\/\s*(\d+)/);
  if (!match) return { sys: 120, dia: 80 };
  return { sys: parseInt(match[1], 10), dia: parseInt(match[2], 10) };
}

export const StatStabilizationDrawer: React.FC<StatStabilizationDrawerProps> = ({
  isOpen,
  onClose,
  caseData,
  baselineVitals,
  liveVitals,
  statInterventions,
  messages,
  onApplyStat,
  onSendMessage,
  isChatLoading,
  isDeceased = false,
}) => {
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('Todos');
  const [selectedPresetId, setSelectedPresetId] = useState<string | undefined>(undefined);
  const [drug, setDrug] = useState('');
  const [dose, setDose] = useState('');
  const [route, setRoute] = useState('Intravenosa (IV)');
  const [chatInput, setChatInput] = useState('');
  const [ttsEnabled, setTtsEnabled] = useState(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const doseInputRef = useRef<HTMLInputElement>(null);
  const lastSpokenIdRef = useRef<string | null>(null);

  const isPediatric = caseData.patientInfo.age < 12;
  const isExamenMode = caseData.mode === 'examen';
  const isUnconscious = !isDeceased && liveVitals.glasgow <= 9;
  const isChatBlocked = Boolean(isDeceased || isUnconscious);

  const filteredPresets =
    categoryFilter === 'Todos'
      ? STAT_QUICK_PRESETS
      : STAT_QUICK_PRESETS.filter((p) => p.category === categoryFilter);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  const speakText = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    lastSpokenIdRef.current = messages[messages.length - 1]?.id ?? null;
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [caseData.id]);

  useEffect(() => {
    if (!isOpen || !ttsEnabled) return;
    const lastPatientMsg = [...messages].reverse().find((m) => m.sender === 'patient');
    if (lastPatientMsg && lastPatientMsg.id !== lastSpokenIdRef.current) {
      lastSpokenIdRef.current = lastPatientMsg.id;
      speakText(lastPatientMsg.text);
    }
  }, [messages, ttsEnabled, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const el = chatContainerRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages, isChatLoading, statInterventions.length, isOpen]);

  if (!isOpen) return null;

  const handleLoadPreset = (preset: StatPreset) => {
    setSelectedPresetId(preset.id);
    setDrug(preset.drug);
    setDose(preset.dose);
    setRoute(preset.route);
    window.setTimeout(() => {
      doseInputRef.current?.focus();
    }, 30);
  };

  const handleApplyOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (isDeceased || !drug.trim()) return;
    onApplyStat({
      presetId: selectedPresetId,
      label: drug.trim(),
      drug: drug.trim(),
      dose: dose.trim() || 'Dosis STAT estándar',
      route,
      frequency: 'Dosis STAT (Urgencias)',
      duration: 'Estabilización aguda',
    });
    setSelectedPresetId(undefined);
    setDrug('');
    setDose('');
  };

  const handleSendChat = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || isChatLoading || isChatBlocked) return;
    const text = chatInput.trim();
    setChatInput('');
    await onSendMessage(text);
  };

  const baseBP = parseBPNums(baselineVitals.bloodPressure);
  const liveBP = parseBPNums(liveVitals.bloodPressure);
  const sysDiff = liveBP.sys - baseBP.sys;
  const diaDiff = liveBP.dia - baseBP.dia;
  const hrDiff = liveVitals.heartRate - baselineVitals.heartRate;
  const rrDiff = liveVitals.respiratoryRate - baselineVitals.respiratoryRate;
  const tempDiff = Number((liveVitals.temperature - baselineVitals.temperature).toFixed(1));
  const spo2Diff = liveVitals.oxygenSaturation - baselineVitals.oxygenSaturation;
  const gcsDiff = liveVitals.glasgow - baselineVitals.glasgow;
  const hasGlucose =
    typeof liveVitals.bloodGlucose === 'number' && typeof baselineVitals.bloodGlucose === 'number';
  const glucDiff = hasGlucose
    ? (liveVitals.bloodGlucose as number) - (baselineVitals.bloodGlucose as number)
    : 0;

  const vitalComparisons: Array<{
    key: string;
    label: string;
    liveValue: string;
    baseValue: string;
    changed: boolean;
    direction: 'up' | 'down' | 'neutral';
    deltaLabel: string;
    isAlert: boolean;
    isImproved: boolean;
  }> = [
    {
      key: 'pa',
      label: 'PA (mmHg)',
      liveValue: `${liveBP.sys}/${liveBP.dia}`,
      baseValue: `${baseBP.sys}/${baseBP.dia}`,
      changed: sysDiff !== 0 || diaDiff !== 0,
      direction: sysDiff > 0 ? 'up' : sysDiff < 0 ? 'down' : 'neutral',
      deltaLabel: `${sysDiff >= 0 ? '+' : ''}${sysDiff}/${diaDiff >= 0 ? '+' : ''}${diaDiff}`,
      isAlert: liveBP.sys < 95 || liveBP.sys >= 165,
      isImproved:
        (baseBP.sys < 95 && sysDiff > 0 && liveBP.sys >= 95) ||
        (baseBP.sys >= 160 && sysDiff < 0 && liveBP.sys >= 110 && liveBP.sys < 160),
    },
    {
      key: 'fc',
      label: 'FC (lpm)',
      liveValue: `${liveVitals.heartRate}`,
      baseValue: `${baselineVitals.heartRate}`,
      changed: hrDiff !== 0,
      direction: hrDiff > 0 ? 'up' : hrDiff < 0 ? 'down' : 'neutral',
      deltaLabel: `${hrDiff > 0 ? '+' : ''}${hrDiff}`,
      isAlert: liveVitals.heartRate > 110 || liveVitals.heartRate < 50,
      isImproved: baselineVitals.heartRate > 100 && hrDiff < 0 && liveVitals.heartRate >= 55,
    },
    {
      key: 'fr',
      label: 'FR (rpm)',
      liveValue: `${liveVitals.respiratoryRate}`,
      baseValue: `${baselineVitals.respiratoryRate}`,
      changed: rrDiff !== 0,
      direction: rrDiff > 0 ? 'up' : rrDiff < 0 ? 'down' : 'neutral',
      deltaLabel: `${rrDiff > 0 ? '+' : ''}${rrDiff}`,
      isAlert: liveVitals.respiratoryRate > 22 || liveVitals.respiratoryRate < 11,
      isImproved: baselineVitals.respiratoryRate > 20 && rrDiff < 0 && liveVitals.respiratoryRate >= 12,
    },
    {
      key: 'spo2',
      label: 'SpO₂ (%)',
      liveValue: `${liveVitals.oxygenSaturation}%`,
      baseValue: `${baselineVitals.oxygenSaturation}%`,
      changed: spo2Diff !== 0,
      direction: spo2Diff > 0 ? 'up' : spo2Diff < 0 ? 'down' : 'neutral',
      deltaLabel: `${spo2Diff > 0 ? '+' : ''}${spo2Diff}%`,
      isAlert: liveVitals.oxygenSaturation < 93,
      isImproved: baselineVitals.oxygenSaturation < 94 && spo2Diff > 0,
    },
    {
      key: 'temp',
      label: 'Temp (°C)',
      liveValue: `${liveVitals.temperature.toFixed(1)}°`,
      baseValue: `${baselineVitals.temperature.toFixed(1)}°`,
      changed: Math.abs(tempDiff) >= 0.05,
      direction: tempDiff > 0 ? 'up' : tempDiff < 0 ? 'down' : 'neutral',
      deltaLabel: `${tempDiff > 0 ? '+' : ''}${tempDiff.toFixed(1)}°`,
      isAlert: liveVitals.temperature >= 38.0,
      isImproved: baselineVitals.temperature >= 38.0 && tempDiff < 0,
    },
    ...(hasGlucose
      ? [
          {
            key: 'gluc',
            label: 'Gluc (mg/dL)',
            liveValue: `${liveVitals.bloodGlucose}`,
            baseValue: `${baselineVitals.bloodGlucose}`,
            changed: glucDiff !== 0,
            direction: (glucDiff > 0 ? 'up' : glucDiff < 0 ? 'down' : 'neutral') as
              | 'up'
              | 'down'
              | 'neutral',
            deltaLabel: `${glucDiff > 0 ? '+' : ''}${glucDiff}`,
            isAlert:
              (liveVitals.bloodGlucose as number) < 70 ||
              (liveVitals.bloodGlucose as number) >= 250,
            isImproved:
              ((baselineVitals.bloodGlucose as number) < 70 &&
                glucDiff > 0 &&
                (liveVitals.bloodGlucose as number) >= 75) ||
              ((baselineVitals.bloodGlucose as number) >= 200 &&
                glucDiff < 0 &&
                (liveVitals.bloodGlucose as number) >= 90),
          },
        ]
      : []),
    {
      key: 'gcs',
      label: 'Glasgow',
      liveValue: `${liveVitals.glasgow}/15`,
      baseValue: `${baselineVitals.glasgow}/15`,
      changed: gcsDiff !== 0,
      direction: gcsDiff > 0 ? 'up' : gcsDiff < 0 ? 'down' : 'neutral',
      deltaLabel: `${gcsDiff > 0 ? '+' : ''}${gcsDiff}`,
      isAlert: liveVitals.glasgow < 14,
      isImproved: baselineVitals.glasgow < 15 && gcsDiff > 0,
    },
  ];

  const renderPatientAvatarIcon = (className: string) =>
    isPediatric ? <Baby className={className} /> : <UserRound className={className} />;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-1.5 sm:p-3 lg:p-4 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Ventana de Aplicación STAT de Emergencias"
    >
      <div className="w-full max-w-[98vw] sm:max-w-[96vw] xl:max-w-[1440px] h-[96dvh] sm:h-[94dvh] bg-[#050E24] border border-blue-800/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="px-4 sm:px-6 py-3.5 bg-[#030917] border-b border-blue-900/70 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-rose-600/20 border border-rose-500/60 flex items-center justify-center text-rose-300 shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base lg:text-lg font-bold text-white truncate">
                Aplicación STAT de Emergencias · {caseData.patientInfo.name}
              </h2>
              <p className="text-[11px] sm:text-xs text-blue-200/80 truncate">
                Seleccione o edite la dosis exacta a administrar, observe los signos vitales en vivo y converse con el paciente.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-3 sm:px-4 py-2 rounded-lg bg-[#07132B] hover:bg-[#0D2149] border border-blue-800/80 text-xs sm:text-sm font-semibold text-blue-100 hover:text-white flex items-center gap-1.5 shrink-0 cursor-pointer transition-colors"
          >
            <X className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">Volver a Consulta</span>
          </button>
        </div>

        {/* Live Vitals Delta Strip */}
        <div className="px-3 sm:px-6 py-2.5 sm:py-3 bg-[#040B1B] border-b border-blue-900/60 shrink-0">
          <div className="flex lg:grid lg:grid-cols-7 gap-2 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0 no-scrollbar font-mono tabular-nums">
            {vitalComparisons.map((item) => (
              <div
                key={item.key}
                className={`min-w-[126px] lg:min-w-0 shrink-0 rounded-lg border px-2.5 py-2 space-y-0.5 ${
                  item.isAlert
                    ? 'bg-rose-950/35 border-rose-700/70'
                    : item.isImproved
                    ? 'bg-emerald-950/30 border-emerald-700/60'
                    : 'bg-[#07132B] border-blue-900/70'
                }`}
              >
                <div className="text-[10px] font-sans uppercase font-semibold text-blue-300">
                  {item.label}
                </div>
                <div className="text-sm sm:text-base font-bold text-white leading-tight">
                  {item.liveValue}
                </div>
                <div className="flex items-center justify-between gap-1 text-[10px]">
                  <span className="text-blue-300/65">Ing: {item.baseValue}</span>
                  {item.changed ? (
                    <span
                      className={`inline-flex items-center gap-0.5 font-bold ${
                        item.isImproved
                          ? 'text-emerald-300'
                          : item.isAlert
                          ? 'text-rose-300'
                          : 'text-sky-300'
                      }`}
                    >
                      {item.direction === 'up' ? (
                        <TrendingUp className="w-3 h-3 shrink-0" />
                      ) : item.direction === 'down' ? (
                        <TrendingDown className="w-3 h-3 shrink-0" />
                      ) : (
                        <Minus className="w-3 h-3 shrink-0" />
                      )}
                      <span>{item.deltaLabel}</span>
                    </span>
                  ) : (
                    <span className="text-blue-300/50">Igual</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Two-Zone Body */}
        <div className="flex-1 min-h-0 overflow-y-auto lg:overflow-hidden p-3.5 sm:p-5 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5">
          {/* LEFT: Unified STAT Order Composer + Applied History (5 cols) */}
          <div className="lg:col-span-5 lg:h-full lg:overflow-y-auto lg:pr-1 space-y-4">
            <div className="bg-[#07132B] border border-blue-900/60 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                  <Syringe className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>1. Preparar y Aplicar Dosis STAT</span>
                </h3>
                <span className="text-[11px] font-mono tabular-nums text-blue-300/80">
                  {statInterventions.length} aplicadas
                </span>
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
                {CATEGORY_FILTERS.map((cat) => {
                  const active = categoryFilter === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap shrink-0 border transition-colors cursor-pointer ${
                        active
                          ? 'bg-blue-600 border-blue-500 text-white'
                          : 'bg-[#040B1B] border-blue-900/70 text-blue-200/80 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>

              {/* Quick-Load Chips */}
              {isDeceased && (
                <div className="bg-rose-950/85 border border-rose-600 rounded-lg px-3 py-2 text-[11px] text-rose-100 flex items-center gap-2">
                  <Skull className="w-4 h-4 text-rose-300 shrink-0" />
                  <span>Paciente en asistolia tras muerte inmediata por iatrogenia. No es posible administrar más dosis STAT.</span>
                </div>
              )}

              <div>
                <div className="text-[11px] sm:text-xs text-blue-300/85 mb-2">
                  Toque una opción rápida para cargarla (puede editar la dosis antes de aplicar):
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 sm:max-h-72 overflow-y-auto pr-1">
                  {filteredPresets.map((preset) => {
                    const isSelected = selectedPresetId === preset.id;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        disabled={isDeceased}
                        onClick={() => handleLoadPreset(preset)}
                        className={`px-3 py-2.5 rounded-xl text-left text-xs font-medium border transition-colors cursor-pointer disabled:opacity-40 disabled:pointer-events-none flex items-center justify-between gap-2 ${
                          isSelected
                            ? 'bg-amber-500/20 border-amber-400 text-amber-200 ring-1 ring-amber-400/40'
                            : 'bg-[#040B1B] hover:bg-[#0D2149] border-blue-900/70 text-blue-100 hover:text-white'
                        }`}
                      >
                        <span className="font-semibold truncate">{preset.label}</span>
                        <span className="text-[11px] text-blue-300/80 font-mono shrink-0">{preset.dose}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Unified Order Composer */}
              <form
                onSubmit={handleApplyOrder}
                className="bg-[#040B1B] border border-blue-900/70 rounded-xl p-3 space-y-2.5"
              >
                <div>
                  <label className="text-[10px] text-blue-200/80 block mb-1">
                    Medicamento o Soporte *
                  </label>
                  <input
                    type="text"
                    value={drug}
                    disabled={isDeceased}
                    onChange={(e) => {
                      setDrug(e.target.value);
                      if (selectedPresetId) setSelectedPresetId(undefined);
                    }}
                    placeholder="Ej. Labetalol, Solución Salina 0.9%, Oxígeno..."
                    className="w-full bg-[#07132B] border border-blue-900/70 rounded-lg px-3 py-2 text-xs text-white placeholder-blue-300/45 focus:outline-none focus:border-blue-400 disabled:opacity-45"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-blue-200/80 block mb-1">
                      Dosis Exacta (editable) *
                    </label>
                    <input
                      ref={doseInputRef}
                      type="text"
                      value={dose}
                      disabled={isDeceased}
                      onChange={(e) => setDose(e.target.value)}
                      placeholder="Ej. 20 mg, 80 mg, 1000 mL..."
                      className="w-full bg-[#07132B] border border-blue-900/70 rounded-lg px-3 py-2 text-xs text-white font-mono placeholder-blue-300/45 focus:outline-none focus:border-amber-400 disabled:opacity-45"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-blue-200/80 block mb-1">Vía</label>
                    <select
                      value={route}
                      disabled={isDeceased}
                      onChange={(e) => setRoute(e.target.value)}
                      className="w-full bg-[#07132B] border border-blue-900/70 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-blue-400 disabled:opacity-45"
                    >
                      <option value="Intravenosa (IV)">Intravenosa (IV)</option>
                      <option value="Intramuscular (IM)">Intramuscular (IM)</option>
                      <option value="Inhalatoria">Inhalatoria</option>
                      <option value="Sublingual (SL)">Sublingual (SL)</option>
                      <option value="Oral (VO)">Oral (VO)</option>
                      <option value="Subcutánea (SC)">Subcutánea (SC)</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isDeceased || !drug.trim()}
                  className="w-full py-2.5 px-3 rounded-lg bg-rose-600 hover:bg-rose-500 disabled:opacity-45 disabled:pointer-events-none text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Zap className="w-4 h-4 shrink-0" />
                  <span>{isDeceased ? 'Paciente Fallecido' : 'Aplicar STAT al Paciente'}</span>
                </button>
              </form>
            </div>

            {/* Applied STAT History */}
            <div className="bg-[#07132B] border border-blue-900/60 rounded-xl p-4 space-y-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span>Registro de Dosis Aplicadas y Efecto</span>
              </h3>

              {statInterventions.length === 0 ? (
                <p className="text-xs text-blue-200/70">
                  Ninguna dosis STAT aplicada aún. Cargue o escriba un medicamento arriba para evaluar la respuesta hemodinámica y respiratoria.
                </p>
              ) : (
                <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                  {[...statInterventions].reverse().map((rec) => {
                    const isAdverse = rec.effectSeverity === 'reaccion_adversa';
                    const isImproved = rec.effectSeverity === 'mejoria';
                    return (
                      <div
                        key={rec.id}
                        className={`rounded-lg border p-2.5 text-xs space-y-1 ${
                          isAdverse
                            ? 'bg-rose-950/40 border-rose-600/70'
                            : isImproved
                            ? 'bg-emerald-950/30 border-emerald-700/60'
                            : 'bg-[#040B1B] border-blue-900/70'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-white flex items-center gap-1.5 min-w-0">
                            {isAdverse ? (
                              <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                            ) : isImproved ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            ) : (
                              <Activity className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                            )}
                            <span className="truncate">
                              {rec.drug} · {rec.dose}
                            </span>
                          </span>
                          <span className="text-[10px] font-mono tabular-nums text-blue-300/80 shrink-0">
                            {rec.appliedAt}
                          </span>
                        </div>
                        <p className="text-[11px] text-blue-100/90 leading-snug">
                          {rec.physiologicalEffectSummary}
                        </p>
                        {rec.deltas.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-0.5 font-mono tabular-nums text-[10px]">
                            {rec.deltas.map((d, idx) => (
                              <span
                                key={idx}
                                className="px-1.5 py-0.5 rounded bg-[#030A1C] border border-blue-900/70 text-sky-200"
                              >
                                {d.metric}: {d.before} → {d.after} ({d.deltaText})
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Live Patient Revaluation Chat (7 cols) */}
          <div className="lg:col-span-7 flex flex-col min-h-[500px] h-[560px] lg:h-full lg:min-h-0 bg-[#07132B] rounded-xl border border-blue-900/60 overflow-hidden">
            <div className="px-4 py-3 bg-[#040B1B] border-b border-blue-900/60 flex items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-[#0D2149] border border-blue-700/70 flex items-center justify-center text-sky-300 shrink-0">
                  {renderPatientAvatarIcon('w-4 h-4')}
                </div>
                <h3 className="text-xs sm:text-sm font-semibold text-white truncate">
                  2. Conversación de Revaloración con {caseData.patientInfo.name}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setTtsEnabled((prev) => !prev)}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md border transition-colors shrink-0 cursor-pointer ${
                  ttsEnabled
                    ? 'bg-blue-600/30 border-blue-500 text-white'
                    : 'bg-[#07132B] border-blue-900/70 text-blue-200 hover:text-white'
                }`}
                title="Activar o desactivar voz del paciente"
              >
                {ttsEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                <span className="text-[11px] font-medium hidden sm:inline">Voz</span>
              </button>
            </div>

            {/* Shared Consultation + STAT Messages */}
            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-3"
            >
              {messages.map((msg) => {
                if (msg.sender === 'system') {
                  return (
                    <div
                      key={msg.id}
                      className="mx-auto max-w-xl bg-[#040B1B] border border-amber-600/50 rounded-lg px-3 py-2 text-[11px] text-amber-100 flex items-start gap-2"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <div className="min-w-0 flex-1">
                        <span className="font-semibold text-amber-300">Aplicación STAT ({msg.timestamp}): </span>
                        <span className="text-blue-100">{msg.text}</span>
                      </div>
                    </div>
                  );
                }

                const isDoctor = msg.sender === 'doctor';
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2 sm:gap-2.5 ${
                      isDoctor ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {!isDoctor && (
                      <div className="w-8 h-8 rounded-full bg-[#0F2859] border border-sky-500/70 flex items-center justify-center text-sky-200 shrink-0 mt-0.5">
                        {renderPatientAvatarIcon('w-4 h-4')}
                      </div>
                    )}

                    <div
                      className={`max-w-[84%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed break-words ${
                        isDoctor
                          ? 'bg-blue-600 text-white rounded-tr-none'
                          : 'bg-[#0C1D42] border border-blue-800/70 text-white rounded-tl-none'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1 text-[10px]">
                        <span className={isDoctor ? 'text-blue-100 font-bold uppercase' : 'text-sky-300 font-bold uppercase'}>
                          {isDoctor ? 'Usted (Médico)' : `${caseData.patientInfo.name} · Paciente`}
                        </span>
                        <span className="text-blue-200/70">{msg.timestamp}</span>
                      </div>
                      <p className="whitespace-pre-line">{msg.text}</p>
                    </div>

                    {isDoctor && (
                      <div className="w-8 h-8 rounded-full bg-blue-700 border border-blue-400/80 flex items-center justify-center text-white shrink-0 mt-0.5">
                        <Stethoscope className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                );
              })}

              {isChatLoading && (
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#0F2859] border border-sky-500/70 flex items-center justify-center text-sky-200 shrink-0">
                    {renderPatientAvatarIcon('w-4 h-4')}
                  </div>
                  <div className="bg-[#0C1D42] border border-blue-800/70 rounded-2xl rounded-tl-none px-4 py-2.5 text-xs text-blue-100 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-sky-400 animate-spin shrink-0" />
                    <span>El paciente está respondiendo...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Unconscious / Deceased Notice in Revaluation Chat */}
            {isDeceased ? (
              <div className="bg-rose-950/90 border-t border-rose-600 px-3.5 py-2 text-[11px] text-rose-100 flex items-center gap-2 shrink-0">
                <Skull className="w-4 h-4 text-rose-300 shrink-0" />
                <span>
                  <strong>PACIENTE FALLECIDO (ASISTOLIA):</strong> No hay respuesta verbal ni neurológica.
                </span>
              </div>
            ) : isUnconscious ? (
              <div className="bg-rose-950/75 border-t border-rose-600/80 px-3.5 py-2 text-[11px] text-rose-100 flex items-center gap-2 shrink-0">
                <AlertOctagon className="w-4 h-4 text-rose-300 shrink-0" />
                <span>
                  <strong>Paciente inconsciente (Glasgow {liveVitals.glasgow}/15):</strong> No responde preguntas hasta que logre estabilizarlo o revertir la toxicidad con un antídoto STAT en el panel izquierdo.
                </span>
              </div>
            ) : null}

            {/* Suggested Post-STAT Prompts */}
            {isExamenMode ? (
              <div className="bg-[#040B1B] border-t border-blue-900/60 px-3.5 py-2 text-[11px] text-amber-200/90 flex items-center gap-2 shrink-0">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Modo Examen: formule directamente sus preguntas de revaloración.</span>
              </div>
            ) : (
              <div className="bg-[#040B1B] border-t border-blue-900/60 px-3 py-2 shrink-0">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
                  {POST_STAT_QUESTIONS.map((q, idx) => (
                    <button
                      key={idx}
                      type="button"
                      disabled={isChatLoading || isChatBlocked}
                      onClick={() => void onSendMessage(q)}
                      className="px-2.5 py-1.5 rounded-lg bg-[#0C1D42] hover:bg-blue-700 text-blue-100 hover:text-white text-xs border border-blue-800/70 transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1.5"
                    >
                      <MessageCircleQuestion className="w-3 h-3 text-sky-300 shrink-0" />
                      <span>{q}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Chat Input */}
            <form
              onSubmit={handleSendChat}
              className="p-2.5 sm:p-3 bg-black border-t border-blue-900/70 flex items-center gap-2 shrink-0"
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder={
                  isDeceased
                    ? 'Paciente fallecido — sin respuesta'
                    : isUnconscious
                      ? `Paciente inconsciente (Glasgow ${liveVitals.glasgow}/15) — administre rescate o antídoto arriba`
                      : 'Pregunte al paciente cómo se siente después del tratamiento STAT...'
                }
                disabled={isChatLoading || isChatBlocked}
                className="flex-1 min-w-0 bg-[#07132B] border border-blue-800/80 rounded-lg px-3 py-2.5 text-xs sm:text-sm text-white placeholder-blue-300/50 focus:outline-none focus:border-blue-400 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!chatInput.trim() || isChatLoading || isChatBlocked}
                className="px-3 sm:px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:pointer-events-none text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                <span className="hidden sm:inline">Enviar</span>
                <CornerDownLeft className="w-3.5 h-3.5 hidden sm:inline" />
                <Send className="w-4 h-4 sm:hidden" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
