import React, { useState, useRef, useEffect } from 'react';
import { GameMode, Specialty } from '../types/clinical';
import { ALL_CURATED_CASES } from '../data/allCases';
import { X, Sparkles, Stethoscope, Shield, Flame, GraduationCap, Check, ChevronRight } from 'lucide-react';

interface NewCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCase: (mode: GameMode, specialty: Specialty, caseId?: string) => Promise<void>;
  isLoading: boolean;
}

const ALL_CURATED = ALL_CURATED_CASES;

const MODES: Array<{ id: GameMode; title: string; short: string; desc: string; icon: any }> = [
  {
    id: 'principiante',
    title: 'Modo Principiante',
    short: 'Principiante',
    desc: 'Casos frecuentes, síntomas cardinales característicos y menor número de distractores.',
    icon: GraduationCap,
  },
  {
    id: 'medico_general',
    title: 'Modo Médico General',
    short: 'Médico General',
    desc: 'Patologías frecuentes de consulta externa y guardia con presentaciones clínicas variadas.',
    icon: Stethoscope,
  },
  {
    id: 'residente',
    title: 'Modo Residente',
    short: 'Residente',
    desc: 'Casos complejos, comorbilidades múltiples, presentaciones atípicas y decisiones difíciles.',
    icon: Shield,
  },
  {
    id: 'urgencias',
    title: 'Modo Urgencias (ABCDE)',
    short: 'Urgencias',
    desc: 'Ventana crítica de 8 min, protocolo interactivo ABCDE y emergencias con amenaza vital.',
    icon: Flame,
  },
  {
    id: 'examen',
    title: 'Modo Examen Clínico',
    short: 'Examen Clínico',
    desc: 'Estación de 12 min sin preguntas rápidas, sin atajos ni resaltado de hallazgos.',
    icon: Check,
  },
];

const SPECIALTIES: Array<{ id: Specialty; name: string }> = [
  { id: 'aleatorio', name: 'Aleatorio (Sorpresa Clínica)' },
  { id: 'infectologia', name: 'Infectología' },
  { id: 'cardiologia', name: 'Cardiología' },
  { id: 'cirugia_general', name: 'Cirugía General' },
  { id: 'endocrinologia', name: 'Endocrinología' },
  { id: 'neurologia', name: 'Neurología' },
  { id: 'neumologia', name: 'Neumología' },
  { id: 'medicina_interna', name: 'Medicina Interna' },
  { id: 'urgencias', name: 'Medicina de Emergencias' },
  { id: 'pediatria', name: 'Pediatría' },
  { id: 'gastroenterologia', name: 'Gastroenterología' },
  { id: 'nefrologia', name: 'Nefrología' },
  { id: 'ginecologia', name: 'Ginecología y Obstetricia' },
  { id: 'traumatologia', name: 'Traumatología' },
  { id: 'dermatologia', name: 'Dermatología' },
  { id: 'psiquiatria', name: 'Psiquiatría' },
];

export const NewCaseModal: React.FC<NewCaseModalProps> = ({
  isOpen,
  onClose,
  onSelectCase,
  isLoading,
}) => {
  const [selectedMode, setSelectedMode] = useState<GameMode>('medico_general');
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty>('aleatorio');
  const [activeTab, setActiveTab] = useState<'custom' | 'presets'>('custom');
  const [presetFilter, setPresetFilter] = useState<'all' | 'outpatient' | 'principiante' | 'medico_general' | 'complex'>('all');
  const modalBodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && modalBodyRef.current) {
      modalBodyRef.current.scrollTop = 0;
    }
  }, [isOpen, activeTab, presetFilter]);

  if (!isOpen) return null;

  const filteredPresets = ALL_CURATED.filter((c) => {
    if (presetFilter === 'outpatient') {
      return c.solution.optimalTreatment.hospitalizationDecision === 'Ambulatorio';
    }
    if (presetFilter === 'principiante') return c.mode === 'principiante';
    if (presetFilter === 'medico_general') return c.mode === 'medico_general';
    if (presetFilter === 'complex') {
      return c.mode === 'residente' || c.mode === 'urgencias' || c.mode === 'examen';
    }
    return true;
  });

  const selectedModeObj = MODES.find((m) => m.id === selectedMode);
  const selectedSpecObj = SPECIALTIES.find((s) => s.id === selectedSpecialty);

  const handleGenerate = async () => {
    await onSelectCase(selectedMode, selectedSpecialty);
  };

  const handlePresetSelect = async (presetId: string) => {
    const preset = ALL_CURATED.find((p) => p.id === presetId);
    if (preset) {
      await onSelectCase(preset.mode, preset.specialty, preset.id);
    }
  };

  const getSpecialtyLabel = (id: Specialty) =>
    SPECIALTIES.find((s) => s.id === id)?.name || id.replace('_', ' ');

  const getModeLabel = (id: GameMode) =>
    MODES.find((m) => m.id === id)?.short || id;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-1.5 sm:p-3 lg:p-4 bg-black/85 backdrop-blur-sm">
      <div className="relative w-full max-w-[98vw] sm:max-w-[95vw] lg:max-w-5xl xl:max-w-6xl h-[94dvh] sm:h-[90dvh] max-h-[940px] flex flex-col bg-[#07132B] border border-blue-800/70 rounded-2xl shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 bg-[#040B1B] border-b border-blue-900/70 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#0D2149] border border-blue-600/60 flex items-center justify-center text-blue-300 shrink-0">
              <Stethoscope className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-bold text-white tracking-tight truncate">
                Iniciar Nuevo Caso Clínico
              </h3>
              <p className="text-[11px] text-blue-300/80 truncate">
                Simulador de razonamiento diagnóstico y decisiones médicas
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1.5 text-blue-200 hover:text-white rounded-lg hover:bg-[#0D2149] transition-colors shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-tabs */}
        <div className="px-4 sm:px-6 py-3 border-b border-blue-900/70 grid grid-cols-1 sm:grid-cols-2 gap-2 shrink-0 bg-[#050E22]">
          <button
            onClick={() => setActiveTab('custom')}
            className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer text-center ${
              activeTab === 'custom'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-[#07132B] border border-blue-900/60 text-blue-200 hover:text-white'
            }`}
          >
            Configuración Personalizada & IA
          </button>
          <button
            onClick={() => setActiveTab('presets')}
            className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer text-center ${
              activeTab === 'presets'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-[#07132B] border border-blue-900/60 text-blue-200 hover:text-white'
            }`}
          >
            Casos Clínicos Validados ({ALL_CURATED.length})
          </button>
        </div>

        {/* Modal Body */}
        <div
          ref={modalBodyRef}
          className="p-4 sm:p-6 flex-1 overflow-y-auto space-y-5 sm:space-y-6"
        >
          {activeTab === 'custom' ? (
            <>
              {/* 1. Modalidad de Juego */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-blue-300 block">
                  1. Seleccione la Modalidad de Dificultad
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {MODES.map((mode) => {
                    const Icon = mode.icon;
                    const isSelected = selectedMode === mode.id;

                    return (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => setSelectedMode(mode.id)}
                        className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                          isSelected
                            ? 'bg-blue-600/25 border-blue-400 text-white shadow-sm ring-1 ring-blue-400/40'
                            : 'bg-[#040B1B] border-blue-900/70 text-blue-200 hover:border-blue-700'
                        }`}
                      >
                        <div
                          className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                            isSelected ? 'bg-blue-600 text-white' : 'bg-[#0D2149] text-blue-300'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-white">{mode.title}</div>
                          <div className="text-[11px] text-blue-200/75 mt-0.5 leading-snug">
                            {mode.desc}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Especialidad Médica */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-blue-300 block">
                  2. Seleccione la Especialidad Médica
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                  {SPECIALTIES.map((spec) => (
                    <button
                      key={spec.id}
                      type="button"
                      onClick={() => setSelectedSpecialty(spec.id)}
                      className={`px-3 py-2.5 text-xs font-medium rounded-lg border text-left transition-all cursor-pointer ${
                        selectedSpecialty === spec.id
                          ? 'bg-white text-[#030A1C] font-bold border-white shadow-sm'
                          : 'bg-[#040B1B] border-blue-900/70 text-blue-100 hover:border-blue-600'
                      }`}
                    >
                      {spec.name}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-blue-300 block">
                  Casos Clínicos Curados ({filteredPresets.length})
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: 'all', label: `Todos (${ALL_CURATED.length})` },
                    {
                      id: 'outpatient',
                      label: `Consulta Externa (${ALL_CURATED.filter((c) => c.solution.optimalTreatment.hospitalizationDecision === 'Ambulatorio').length})`,
                    },
                    { id: 'principiante', label: 'Principiante' },
                    { id: 'medico_general', label: 'Médico General' },
                    { id: 'complex', label: 'Urgencias / Complejos' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setPresetFilter(f.id as any)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                        presetFilter === f.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-[#040B1B] border border-blue-900/70 text-blue-200 hover:border-blue-600'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2.5">
                {filteredPresets.map((preset) => (
                  <div
                    key={preset.id}
                    onClick={() => handlePresetSelect(preset.id)}
                    className="p-4 rounded-xl bg-[#040B1B] border border-blue-900/70 hover:border-blue-500 transition-all cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 text-[10px] text-blue-300 font-semibold uppercase tracking-wider">
                        <span>{getSpecialtyLabel(preset.specialty)}</span>
                        <span>·</span>
                        <span className="text-sky-300">{getModeLabel(preset.mode)}</span>
                        <span>·</span>
                        <span className="text-emerald-300">
                          {preset.solution.optimalTreatment.hospitalizationDecision === 'Ambulatorio'
                            ? 'Consulta Externa'
                            : preset.patientInfo.triageLevel}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white mt-0.5 group-hover:text-blue-300 transition-colors">
                        {preset.patientInfo.name} ({preset.patientInfo.age} años, {preset.patientInfo.sex})
                      </h4>
                      <p className="text-xs text-blue-100/80 mt-1 line-clamp-2 italic">
                        "{preset.patientInfo.consultReason}"
                      </p>
                    </div>

                    <div className="shrink-0 flex items-center gap-1.5 text-xs font-semibold text-blue-300 group-hover:text-white">
                      <span>Cargar Caso</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        {activeTab === 'custom' && (
          <div className="px-4 sm:px-6 py-3.5 sm:py-4 bg-[#040B1B] border-t border-blue-900/70 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
            <div className="text-[11px] sm:text-xs text-blue-200/90 text-center sm:text-left">
              <span className="text-blue-300 font-semibold">Selección:</span>{' '}
              <span className="text-white font-semibold">{selectedModeObj?.short}</span> ·{' '}
              <span className="text-sky-300 font-semibold">{selectedSpecObj?.name}</span>
            </div>
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="w-full sm:w-auto px-5 py-2.5 bg-white hover:bg-blue-100 disabled:opacity-50 text-[#030A1C] font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shrink-0"
            >
              {isLoading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-blue-700 shrink-0" />
                  <span>Generando Paciente...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-blue-700 shrink-0" />
                  <span>Comenzar Simulación</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
