import React, { useState, useRef, useEffect } from 'react';
import { ClinicalCase, GameMode, Specialty } from '../types/clinical';
import { ALL_CURATED_CASES } from '../data/allCases';
import { buildCustomLocalCase } from '../engine/caseGenerator';
import { X, Sparkles, Stethoscope, Shield, Flame, GraduationCap, Check, ChevronRight, PlusCircle, Trash2 } from 'lucide-react';

interface NewCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCase: (mode: GameMode, specialty: Specialty, caseId?: string) => Promise<void>;
  isLoading: boolean;
  customCases?: ClinicalCase[];
  onSaveCustomCase?: (newCase: ClinicalCase) => Promise<void>;
  onDeleteCustomCase?: (caseId: string) => Promise<void>;
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
    title: 'Modo Urgencias (Sala de Choque)',
    short: 'Urgencias',
    desc: 'Ventana crítica de 8 min, estabilización STAT en vivo y emergencias con amenaza vital.',
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
  customCases = [],
  onSaveCustomCase,
  onDeleteCustomCase,
}) => {
  const [selectedMode, setSelectedMode] = useState<GameMode>('medico_general');
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty>('aleatorio');
  const [activeTab, setActiveTab] = useState<'custom' | 'presets' | 'add_case'>('custom');
  const [presetFilter, setPresetFilter] = useState<'all' | 'outpatient' | 'principiante' | 'medico_general' | 'complex' | 'custom_only'>('all');
  const modalBodyRef = useRef<HTMLDivElement>(null);

  // Local extensible library builder state
  const [newPatientName, setNewPatientName] = useState('');
  const [newAge, setNewAge] = useState('34');
  const [newSex, setNewSex] = useState<'Masculino' | 'Femenino'>('Masculino');
  const [newSpecialty, setNewSpecialty] = useState<Exclude<Specialty, 'aleatorio'>>('medicina_interna');
  const [newMode, setNewMode] = useState<GameMode>('medico_general');
  const [newReason, setNewReason] = useState('');
  const [newIllness, setNewIllness] = useState('');
  const [newDiagnosis, setNewDiagnosis] = useState('');
  const [newDifferentials, setNewDifferentials] = useState('');
  const [newDrug, setNewDrug] = useState('');
  const [newDose, setNewDose] = useState('');
  const [newSource, setNewSource] = useState('Guía clínica OMS/OPS / protocolo institucional vigente');
  const [newAlert, setNewAlert] = useState('');
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    if (isOpen && modalBodyRef.current) {
      modalBodyRef.current.scrollTop = 0;
    }
  }, [isOpen, activeTab, presetFilter]);

  if (!isOpen) return null;

  const combinedCases = [...customCases, ...ALL_CURATED];

  const filteredPresets = combinedCases.filter((c) => {
    if (presetFilter === 'custom_only') return Boolean(c.clinicalMetadata?.isCustom);
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
    const preset = combinedCases.find((p) => p.id === presetId);
    if (preset) {
      await onSelectCase(preset.mode, preset.specialty, preset.id);
    }
  };

  const handleCreateLocalCase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatientName.trim() || !newReason.trim() || !newIllness.trim() || !newDiagnosis.trim()) {
      setSaveError('Completa al menos nombre del paciente, motivo de consulta, enfermedad actual y diagnóstico definitivo.');
      return;
    }
    setSaveError('');
    const created = buildCustomLocalCase({
      mode: newMode,
      specialty: newSpecialty,
      patientName: newPatientName,
      age: Number(newAge) || 35,
      sex: newSex,
      occupation: 'Paciente local',
      consultReason: newReason,
      evolutionTime: '24 horas de evolución',
      currentIllness: newIllness,
      triageLevel: newMode === 'urgencias' ? 'Nivel II (Emergencia)' : 'Nivel III (Urgencia)',
      bloodPressure: '120/80 mmHg',
      heartRate: 86,
      respiratoryRate: 18,
      temperature: 37.0,
      oxygenSaturation: 98,
      glasgow: 15,
      correctDiagnosis: newDiagnosis,
      differentialDiagnoses: newDifferentials
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      pathophysiology: `Cuadro clínico compatible con ${newDiagnosis.trim()} según la historia clínica ingresada.`,
      keyClinicalClues: [newReason.trim()],
      expectedDrug: newDrug || 'Manejo terapéutico dirigido según diagnóstico',
      expectedDose: newDose || 'Dosis estándar',
      expectedRoute: 'Oral / Intravenosa según criterio clínico',
      expectedFrequency: 'Según evolución clínica',
      hospitalizationDecision: newMode === 'urgencias' ? 'Observación Urgencias' : 'Ambulatorio',
      guidelineReference: newSource,
      criticalSafetyAlert: newAlert || 'Verificar alergias, dosis y signos de alarma antes del egreso.',
    });
    await onSaveCustomCase?.(created);
    setNewPatientName('');
    setNewReason('');
    setNewIllness('');
    setNewDiagnosis('');
    setNewDifferentials('');
    setNewDrug('');
    setNewDose('');
    setNewAlert('');
    setActiveTab('presets');
    setPresetFilter('custom_only');
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
        <div className="px-4 sm:px-6 py-3 border-b border-blue-900/70 grid grid-cols-1 sm:grid-cols-3 gap-2 shrink-0 bg-[#050E22]">
          <button
            onClick={() => setActiveTab('custom')}
            className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer text-center ${
              activeTab === 'custom'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-[#07132B] border border-blue-900/60 text-blue-200 hover:text-white'
            }`}
          >
            Configuración Offline
          </button>
          <button
            onClick={() => setActiveTab('presets')}
            className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer text-center ${
              activeTab === 'presets'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-[#07132B] border border-blue-900/60 text-blue-200 hover:text-white'
            }`}
          >
            Biblioteca Local ({combinedCases.length})
          </button>
          <button
            onClick={() => setActiveTab('add_case')}
            className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5 ${
              activeTab === 'add_case'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-[#07132B] border border-blue-900/60 text-blue-200 hover:text-white'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Ampliar Biblioteca</span>
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
          ) : activeTab === 'presets' ? (
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-blue-300 block">
                  Casos Clínicos Curados y Locales ({filteredPresets.length})
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: 'all', label: `Todos (${combinedCases.length})` },
                    ...(customCases.length > 0
                      ? [{ id: 'custom_only', label: `Mis Casos (${customCases.length})` }]
                      : []),
                    {
                      id: 'outpatient',
                      label: `Consulta Externa (${combinedCases.filter((c) => c.solution.optimalTreatment.hospitalizationDecision === 'Ambulatorio').length})`,
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
                        {preset.clinicalMetadata?.isCustom && (
                          <>
                            <span>·</span>
                            <span className="text-amber-300">Caso Local</span>
                          </>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-white mt-0.5 group-hover:text-blue-300 transition-colors">
                        {preset.patientInfo.name} ({preset.patientInfo.age} años, {preset.patientInfo.sex})
                      </h4>
                      <p className="text-xs text-blue-100/80 mt-1 line-clamp-2 italic">
                        "{preset.patientInfo.consultReason}"
                      </p>
                    </div>

                    <div className="shrink-0 flex items-center gap-2 text-xs font-semibold text-blue-300 group-hover:text-white">
                      {preset.clinicalMetadata?.isCustom && onDeleteCustomCase && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            void onDeleteCustomCase(preset.id);
                          }}
                          className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/60 cursor-pointer"
                          title="Eliminar caso local"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <span>Cargar Caso</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <form onSubmit={handleCreateLocalCase} className="space-y-4 text-xs">
              <div className="bg-[#040B1B] border border-blue-900/70 rounded-xl p-4 space-y-1">
                <h4 className="font-bold text-white text-sm">Agregar Caso Clínico a la Biblioteca Offline</h4>
                <p className="text-blue-200/80 text-[11px]">
                  Los casos guardados aquí se almacenan en IndexedDB en tu dispositivo y quedan disponibles sin conexión.
                </p>
              </div>

              {saveError && (
                <div className="bg-rose-950/60 border border-rose-600/70 rounded-lg px-3 py-2 text-rose-200">
                  {saveError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-blue-300 font-semibold mb-1">Nombre del paciente *</label>
                  <input
                    type="text"
                    value={newPatientName}
                    onChange={(e) => setNewPatientName(e.target.value)}
                    placeholder="Ej. Luis Herrera Gómez"
                    className="w-full bg-[#040B1B] border border-blue-900/70 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-blue-300 font-semibold mb-1">Edad (años)</label>
                  <input
                    type="number"
                    min={0}
                    max={110}
                    value={newAge}
                    onChange={(e) => setNewAge(e.target.value)}
                    className="w-full bg-[#040B1B] border border-blue-900/70 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-blue-300 font-semibold mb-1">Sexo</label>
                  <select
                    value={newSex}
                    onChange={(e) => setNewSex(e.target.value as any)}
                    className="w-full bg-[#040B1B] border border-blue-900/70 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-400"
                  >
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-blue-300 font-semibold mb-1">Especialidad</label>
                  <select
                    value={newSpecialty}
                    onChange={(e) => setNewSpecialty(e.target.value as any)}
                    className="w-full bg-[#040B1B] border border-blue-900/70 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-400"
                  >
                    {SPECIALTIES.filter((s) => s.id !== 'aleatorio').map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-blue-300 font-semibold mb-1">Dificultad / Modalidad</label>
                  <select
                    value={newMode}
                    onChange={(e) => setNewMode(e.target.value as GameMode)}
                    className="w-full bg-[#040B1B] border border-blue-900/70 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-400"
                  >
                    {MODES.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.short}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-blue-300 font-semibold mb-1">Motivo de consulta *</label>
                <input
                  type="text"
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                  placeholder="Ej. Dolor torácico opresivo de 2 horas de evolución"
                  className="w-full bg-[#040B1B] border border-blue-900/70 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-400"
                />
              </div>

              <div>
                <label className="block text-blue-300 font-semibold mb-1">Enfermedad actual (historia clínica para el paciente virtual) *</label>
                <textarea
                  rows={3}
                  value={newIllness}
                  onChange={(e) => setNewIllness(e.target.value)}
                  placeholder="Describe inicio, localización, intensidad, irradiación y síntomas asociados..."
                  className="w-full bg-[#040B1B] border border-blue-900/70 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-blue-300 font-semibold mb-1">Diagnóstico definitivo (oculto en simulación) *</label>
                  <input
                    type="text"
                    value={newDiagnosis}
                    onChange={(e) => setNewDiagnosis(e.target.value)}
                    placeholder="Ej. Pielonefritis aguda no complicada"
                    className="w-full bg-[#040B1B] border border-blue-900/70 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-blue-300 font-semibold mb-1">Diferenciales (separados por coma)</label>
                  <input
                    type="text"
                    value={newDifferentials}
                    onChange={(e) => setNewDifferentials(e.target.value)}
                    placeholder="Ej. Litiasis renal, Cistitis aguda"
                    className="w-full bg-[#040B1B] border border-blue-900/70 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-blue-300 font-semibold mb-1">Fármaco esperado</label>
                  <input
                    type="text"
                    value={newDrug}
                    onChange={(e) => setNewDrug(e.target.value)}
                    placeholder="Ej. Ceftriaxona"
                    className="w-full bg-[#040B1B] border border-blue-900/70 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-blue-300 font-semibold mb-1">Dosis esperada</label>
                  <input
                    type="text"
                    value={newDose}
                    onChange={(e) => setNewDose(e.target.value)}
                    placeholder="Ej. 1 g IV cada 24 h"
                    className="w-full bg-[#040B1B] border border-blue-900/70 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-blue-300 font-semibold mb-1">Fuente / Guía clínica</label>
                  <input
                    type="text"
                    value={newSource}
                    onChange={(e) => setNewSource(e.target.value)}
                    className="w-full bg-[#040B1B] border border-blue-900/70 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-blue-300 font-semibold mb-1">Error frecuente / Alerta de seguridad</label>
                  <input
                    type="text"
                    value={newAlert}
                    onChange={(e) => setNewAlert(e.target.value)}
                    placeholder="Ej. No retrasar antibioticoterapia en sepsis"
                    className="w-full bg-[#040B1B] border border-blue-900/70 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-400"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl flex items-center gap-2 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Guardar Caso en Biblioteca Offline</span>
                </button>
              </div>
            </form>
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
