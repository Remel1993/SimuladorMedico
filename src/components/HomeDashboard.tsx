import React, { useState } from 'react';
import { GameMode, Specialty, SavedCaseRecord } from '../types/clinical';
import { ALL_CURATED_CASES } from '../data/allCases';
import {
  Stethoscope,
  Sparkles,
  GraduationCap,
  Shield,
  Flame,
  Check,
  History,
  BookOpen,
  Award,
  FlaskConical,
  MessageSquare,
  ChevronRight,
  Shuffle,
} from 'lucide-react';

interface HomeDashboardProps {
  onStartSimulation: (mode: GameMode, specialty: Specialty, caseId?: string) => Promise<void>;
  onOpenPresetsModal: () => void;
  onOpenHistoryModal: () => void;
  onOpenGuideModal: () => void;
  isLoading: boolean;
  history: SavedCaseRecord[];
  totalCasesCount?: number;
  initialMode?: GameMode;
  initialSpecialty?: Specialty;
  onPreferencesChange?: (mode: GameMode, specialty: Specialty) => void;
}

const ALL_CURATED = ALL_CURATED_CASES;

const MODES: Array<{ id: GameMode; title: string; short: string; desc: string; icon: any }> = [
  {
    id: 'principiante',
    title: 'Principiante',
    short: 'Principiante',
    desc: 'Cuadros clásicos frecuentes y presentación semiológica directa.',
    icon: GraduationCap,
  },
  {
    id: 'medico_general',
    title: 'Médico General',
    short: 'Médico General',
    desc: 'Consulta externa y guardia con diagnósticos diferenciales habituales.',
    icon: Stethoscope,
  },
  {
    id: 'residente',
    title: 'Residente',
    short: 'Residente',
    desc: 'Comorbilidades múltiples, interacciones farmacológicas y cuadros complejos.',
    icon: Shield,
  },
  {
    id: 'urgencias',
    title: 'Urgencias (Sala de Choque)',
    short: 'Urgencias',
    desc: 'Ventana crítica de 8 min, estabilización STAT en vivo y emergencias con riesgo vital.',
    icon: Flame,
  },
  {
    id: 'examen',
    title: 'Examen Clínico',
    short: 'Modo Examen',
    desc: 'Estación de 12 min sin preguntas sugeridas, sin atajos ni resaltado de hallazgos.',
    icon: Check,
  },
];

const SPECIALTIES: Array<{ id: Specialty; name: string }> = [
  { id: 'aleatorio', name: 'Aleatorio (Sorpresa)' },
  { id: 'infectologia', name: 'Infectología' },
  { id: 'cardiologia', name: 'Cardiología' },
  { id: 'cirugia_general', name: 'Cirugía General' },
  { id: 'endocrinologia', name: 'Endocrinología' },
  { id: 'neurologia', name: 'Neurología' },
  { id: 'neumologia', name: 'Neumología' },
  { id: 'medicina_interna', name: 'Medicina Interna' },
  { id: 'urgencias', name: 'Urgencias' },
  { id: 'pediatria', name: 'Pediatría' },
  { id: 'gastroenterologia', name: 'Gastroenterología' },
  { id: 'nefrologia', name: 'Nefrología' },
  { id: 'ginecologia', name: 'Ginecología' },
  { id: 'traumatologia', name: 'Traumatología' },
  { id: 'dermatologia', name: 'Dermatología' },
  { id: 'psiquiatria', name: 'Psiquiatría' },
];

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  onStartSimulation,
  onOpenPresetsModal,
  onOpenHistoryModal,
  onOpenGuideModal,
  isLoading,
  history,
  totalCasesCount,
  initialMode = 'medico_general',
  initialSpecialty = 'aleatorio',
  onPreferencesChange,
}) => {
  const [selectedMode, setSelectedMode] = useState<GameMode>(initialMode);
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty>(initialSpecialty);

  React.useEffect(() => {
    setSelectedMode(initialMode);
  }, [initialMode]);

  React.useEffect(() => {
    setSelectedSpecialty(initialSpecialty);
  }, [initialSpecialty]);

  const libraryCount = totalCasesCount ?? ALL_CURATED.length;

  const avgScore =
    history.length > 0
      ? Math.round(history.reduce((acc, cur) => acc + cur.score, 0) / history.length)
      : null;

  const selectedModeTitle = MODES.find((m) => m.id === selectedMode)?.title || selectedMode;
  const selectedSpecTitle = SPECIALTIES.find((s) => s.id === selectedSpecialty)?.name || selectedSpecialty;

  return (
    <main className="flex-1 max-w-7xl w-full min-w-0 mx-auto px-3 sm:px-4 py-5 sm:py-8 space-y-6">
      {/* Hero Banner */}
      <section className="rounded-2xl border border-blue-800/70 bg-gradient-to-br from-[#0A1D47] via-[#06122E] to-black p-5 sm:p-8 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-blue-300">
              <Stethoscope className="w-4 h-4 text-blue-400 shrink-0" />
              <span>Simulador Clínico Interactivo Universitario</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
              Entrena tu Razonamiento Clínico antes de entrar a Consulta
            </h1>
            <p className="text-xs sm:text-sm text-blue-100/85 leading-relaxed">
              Configura la clasificación y especialidad del caso clínico que deseas abordar. El reloj de consulta y la atención del paciente iniciarán únicamente cuando comiences la simulación.
            </p>
          </div>

          {/* Quick Stats & Tools */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-2.5 shrink-0 lg:w-64">
            <button
              onClick={() => onStartSimulation('medico_general', 'aleatorio')}
              disabled={isLoading}
              className="col-span-2 sm:col-span-1 w-full px-4 py-3 bg-white hover:bg-blue-100 disabled:opacity-50 text-[#030A1C] font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <Shuffle className="w-4 h-4 text-blue-700 shrink-0" />
              <span>Caso Rápido Aleatorio</span>
            </button>

            <button
              onClick={onOpenHistoryModal}
              className="w-full px-3.5 py-2.5 bg-[#07132B] hover:bg-[#0D2149] border border-blue-800/70 text-white rounded-xl text-xs font-semibold flex items-center justify-between gap-2 transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-1.5 min-w-0">
                <History className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span className="truncate">Historial ({history.length})</span>
              </span>
              {avgScore !== null && (
                <span className="font-mono text-sky-300 shrink-0">{avgScore} pts</span>
              )}
            </button>

            <button
              onClick={onOpenGuideModal}
              className="w-full px-3.5 py-2.5 bg-[#07132B] hover:bg-[#0D2149] border border-blue-800/70 text-white rounded-xl text-xs font-semibold flex items-center justify-between gap-2 transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-1.5 min-w-0">
                <BookOpen className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span className="truncate">Guías MINSA / OMS</span>
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            </button>
          </div>
        </div>
      </section>

      {/* Direct Case Configurator Panel */}
      <section className="bg-[#07132B] border border-blue-900/70 rounded-2xl p-4 sm:p-6 shadow-lg space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-blue-900/60 pb-3.5">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Configurar Simulación de Caso Clínico
            </h2>
            <p className="text-xs text-blue-200/80">
              Elige la clasificación de dificultad y el área médica antes de recibir al paciente.
            </p>
          </div>
          <button
            onClick={onOpenPresetsModal}
            className="w-full sm:w-auto px-3.5 py-2 bg-[#040B1B] hover:bg-[#0D2149] border border-blue-700/70 text-blue-200 hover:text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer text-center shrink-0"
          >
            Explorar {libraryCount} Casos Validados
          </button>
        </div>

        {/* 1. Clasificación / Modalidad */}
        <div className="space-y-2.5">
          <label className="text-xs font-bold uppercase tracking-wider text-blue-300 block">
            1. Clasificación / Nivel de Complejidad
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
            {MODES.map((mode) => {
              const Icon = mode.icon;
              const isSelected = selectedMode === mode.id;

              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => {
                    setSelectedMode(mode.id);
                    onPreferencesChange?.(mode.id, selectedSpecialty);
                  }}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                    isSelected
                      ? 'bg-blue-600/25 border-blue-400 text-white shadow-sm ring-1 ring-blue-400/40'
                      : 'bg-[#040B1B] border-blue-900/70 text-blue-200 hover:border-blue-700'
                  }`}
                >
                  <div
                    className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
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

        {/* 2. Especialidad */}
        <div className="space-y-2.5">
          <label className="text-xs font-bold uppercase tracking-wider text-blue-300 block">
            2. Especialidad Médica
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-2">
            {SPECIALTIES.map((spec) => (
              <button
                key={spec.id}
                type="button"
                onClick={() => {
                  setSelectedSpecialty(spec.id);
                  onPreferencesChange?.(selectedMode, spec.id);
                }}
                className={`px-3 py-2.5 text-xs font-medium rounded-lg border text-left transition-all cursor-pointer truncate ${
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

        {/* Launch Action Footer */}
        <div className="pt-3 border-t border-blue-900/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="text-xs text-blue-200/85 text-center sm:text-left">
            <span className="text-blue-300 font-semibold">Configuración lista:</span>{' '}
            <span className="text-white font-semibold">{selectedModeTitle}</span> ·{' '}
            <span className="text-sky-300 font-semibold">{selectedSpecTitle}</span>
          </div>

          <button
            onClick={() => onStartSimulation(selectedMode, selectedSpecialty)}
            disabled={isLoading}
            className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
          >
            <Sparkles className={`w-4 h-4 shrink-0 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Preparando Paciente Virtual...' : 'Entrar a Consulta Médica'}</span>
          </button>
        </div>
      </section>

      {/* Workflow Overview Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
        <div className="bg-[#040B1B] border border-blue-900/60 rounded-xl p-4 sm:p-5 space-y-2">
          <div className="flex items-center gap-2 text-blue-300 font-bold text-xs uppercase tracking-wider">
            <MessageSquare className="w-4 h-4 text-blue-400 shrink-0" />
            <span>1. Anamnesis y Semiología</span>
          </div>
          <p className="text-xs text-blue-100/80 leading-relaxed">
            Interroga libremente al paciente sobre su evolución, cronología y antecedentes sin pistas reveladoras, y solicita maniobras de exploración física estandarizadas.
          </p>
        </div>

        <div className="bg-[#040B1B] border border-blue-900/60 rounded-xl p-4 sm:p-5 space-y-2">
          <div className="flex items-center gap-2 text-blue-300 font-bold text-xs uppercase tracking-wider">
            <FlaskConical className="w-4 h-4 text-blue-400 shrink-0" />
            <span>2. Paraclínicos Sin Pistas</span>
          </div>
          <p className="text-xs text-blue-100/80 leading-relaxed">
            Accede a un catálogo hospitalario uniforme de laboratorio, gabinete e imagen. Solo solicita los estudios realmente justificados para confirmar tu hipótesis.
          </p>
        </div>

        <div className="bg-[#040B1B] border border-blue-900/60 rounded-xl p-4 sm:p-5 space-y-2">
          <div className="flex items-center gap-2 text-blue-300 font-bold text-xs uppercase tracking-wider">
            <Award className="w-4 h-4 text-blue-400 shrink-0" />
            <span>3. Diagnóstico y Rúbrica (100 Pts)</span>
          </div>
          <p className="text-xs text-blue-100/80 leading-relaxed">
            Sustenta diagnósticos diferenciales, prescribe esquema farmacológico con dosis y recibe retroalimentación académica basada en normativa MINSA y guías OMS, OPS, AHA y NICE.
          </p>
        </div>
      </section>

      {/* Offline & Educational Disclaimer */}
      <footer className="rounded-xl border border-blue-900/50 bg-[#040B1B]/80 px-4 py-3 text-[11px] text-blue-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <span>
          <strong className="text-sky-300">Motor Clínico 100 % Offline:</strong> Funciona sin internet, sin API Keys y sin consumo de tokens. Datos guardados en IndexedDB local.
        </span>
        <span className="text-blue-300/75">
          Uso exclusivamente educativo; no sustituye el juicio clínico ni los protocolos locales vigentes.
        </span>
      </footer>
    </main>
  );
};
