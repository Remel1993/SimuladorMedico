import React, { useState } from 'react';
import { ClinicalCase, PhysicalExamFinding, VitalSigns } from '../types/clinical';
import {
  Stethoscope,
  CheckCircle2,
  Eye,
  HeartPulse,
  Wind,
  Brain,
  UserRound,
  Hand,
  LayoutGrid,
  ClipboardList,
  Activity,
  AlertTriangle,
  Sparkles,
  Skull,
} from 'lucide-react';

interface PhysicalExamTabProps {
  caseData: ClinicalCase;
  unlockedExamIds: string[];
  onUnlockExam: (examId: string) => void;
  onUnlockAllExams: () => void;
  liveExams?: PhysicalExamFinding[];
  liveVitals?: VitalSigns;
  isDeceased?: boolean;
}

function getSystemIcon(system: string, className = 'w-4 h-4 shrink-0') {
  switch (system) {
    case 'todos':
      return <LayoutGrid className={className} />;
    case 'General':
      return <UserRound className={className} />;
    case 'Cabeza y Cuello':
      return <Eye className={className} />;
    case 'Tórax y Pulmones':
      return <Wind className={className} />;
    case 'Cardiovascular':
      return <HeartPulse className={className} />;
    case 'Abdomen':
      return <Activity className={className} />;
    case 'Neurológico':
      return <Brain className={className} />;
    case 'Osteomuscular y Piel':
      return <Hand className={className} />;
    default:
      return <Stethoscope className={className} />;
  }
}

export const PhysicalExamTab: React.FC<PhysicalExamTabProps> = ({
  caseData,
  unlockedExamIds,
  onUnlockExam,
  onUnlockAllExams,
  liveExams,
  liveVitals,
  isDeceased = false,
}) => {
  const [selectedSystem, setSelectedSystem] = useState<string>('todos');

  const systems = [
    'todos',
    'General',
    'Cabeza y Cuello',
    'Tórax y Pulmones',
    'Cardiovascular',
    'Abdomen',
    'Neurológico',
    'Osteomuscular y Piel',
  ];

  const examPool = liveExams || caseData.physicalExamPool;

  const filteredPool = examPool.filter((pe) => {
    if (selectedSystem === 'todos') return true;
    return pe.system === selectedSystem;
  });

  const isExamMode = caseData.mode === 'examen';
  const totalPoolCount = examPool.length;
  const unlockedCount = examPool.filter((pe) => unlockedExamIds.includes(pe.id)).length;
  const hasLiveEvents = isDeceased || examPool.some((pe) => Boolean(pe.liveStatus));

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header and stats */}
      <div className="bg-[#07132B] border border-blue-900/60 rounded-xl p-4 sm:p-5 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-blue-400 shrink-0" />
              <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
                Exploración Física & Maniobras Semiológicas
              </h2>
            </div>
            <p className="text-xs text-blue-200/80 mt-1">
              {isExamMode
                ? 'Modo Examen: seleccione manualmente únicamente las maniobras pertinentes. Los hallazgos reflejan el estado clínico actual del paciente.'
                : 'Priorice y ejecute las maniobras clínicas dirigidas a los sistemas pertinentes. Los hallazgos se actualizan en tiempo real con la evolución e intervenciones.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 shrink-0">
            <div className="text-xs text-blue-100 font-medium">
              Exploradas: <span className="font-mono text-white font-bold">{unlockedCount}</span> / {totalPoolCount}
            </div>
            {!isExamMode && (
              <button
                onClick={onUnlockAllExams}
                className="w-full sm:w-auto px-3.5 py-2 text-xs font-semibold text-white bg-[#0D2149] hover:bg-blue-700 border border-blue-700/70 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <ClipboardList className="w-3.5 h-3.5 text-sky-300 shrink-0" />
                <span>Explorar Todo el Cuerpo</span>
              </button>
            )}
          </div>
        </div>

        {/* Real-time clinical status banner */}
        {hasLiveEvents && (
          <div
            className={`mt-3 rounded-lg border px-3 py-2 text-xs flex flex-wrap items-center justify-between gap-2 ${
              isDeceased
                ? 'bg-rose-950/70 border-rose-500/80 text-rose-100'
                : 'bg-[#040B1B] border-sky-700/60 text-sky-100'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              {isDeceased ? (
                <Skull className="w-4 h-4 text-rose-300 shrink-0" />
              ) : (
                <Activity className="w-4 h-4 text-sky-400 shrink-0" />
              )}
              <span>
                {isDeceased
                  ? 'Registro post-paro / asistolia: la exploración física refleja el estado terminal actual del paciente (sin pulso ni respiraciones).'
                  : 'Reevaluación en tiempo real activa: las maniobras desbloqueadas y nuevas exploraciones reflejan cambios fisiológicos, fármacos STAT o eventos adversos actuales.'}
              </span>
            </div>
            {liveVitals && (
              <span className="font-mono text-[11px] text-white/90 shrink-0">
                PA {liveVitals.bloodPressure} · FC {liveVitals.heartRate} · SpO₂ {liveVitals.oxygenSaturation}% · Glasgow {liveVitals.glasgow}/15
              </span>
            )}
          </div>
        )}

        {/* System Filter Segmented Tabs */}
        <div className="mt-4 flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar border-t border-blue-900/60 pt-3">
          {systems.map((sys) => (
            <button
              key={sys}
              onClick={() => setSelectedSystem(sys)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 transition-colors cursor-pointer flex items-center gap-1.5 ${
                selectedSystem === sys
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'bg-[#040B1B] hover:bg-[#0D2149] text-blue-200 hover:text-white border border-blue-900/70'
              }`}
            >
              {getSystemIcon(sys, 'w-3.5 h-3.5 shrink-0')}
              <span>{sys === 'todos' ? 'Todos los Sistemas' : sys}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Physical Exams */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
        {filteredPool.map((exam: PhysicalExamFinding) => {
          const isUnlocked = unlockedExamIds.includes(exam.id);
          const liveTag = exam.liveStatus;
          const cardBorderClass = !isUnlocked
            ? 'bg-[#040B1B] border-blue-900/60 hover:border-blue-700/70'
            : !isExamMode && (liveTag === 'iatrogenia' || liveTag === 'critico')
            ? 'bg-[#07132B] border-rose-500/80 shadow-md'
            : !isExamMode && liveTag === 'mejoria'
            ? 'bg-[#07132B] border-emerald-500/60 shadow-md'
            : !isExamMode && exam.isAbnormal
            ? 'bg-[#07132B] border-amber-500/60 shadow-md'
            : 'bg-[#07132B] border-blue-700/70';

          return (
            <div key={exam.id} className={`rounded-xl border transition-all ${cardBorderClass}`}>
              <div className="p-4 sm:p-5 flex flex-col h-full justify-between">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-[#0D2149] border border-blue-700/70 flex items-center justify-center text-sky-300 shrink-0">
                        {getSystemIcon(exam.system, 'w-3.5 h-3.5')}
                      </span>
                      <span className="text-[11px] font-semibold tracking-wider text-blue-300 uppercase">
                        {exam.system}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {isUnlocked && liveTag && (
                        isExamMode ? (
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-[#040B1B] text-sky-200 border border-sky-700/70">
                            Actualizado en vivo
                          </span>
                        ) : (
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded border inline-flex items-center gap-1 ${
                              liveTag === 'iatrogenia' || liveTag === 'critico'
                                ? 'bg-rose-950/80 text-rose-200 border-rose-500/70'
                                : liveTag === 'mejoria'
                                ? 'bg-emerald-950/80 text-emerald-200 border-emerald-500/70'
                                : 'bg-sky-950/80 text-sky-200 border-sky-500/70'
                            }`}
                          >
                            {(liveTag === 'iatrogenia' || liveTag === 'critico') && (
                              <AlertTriangle className="w-2.5 h-2.5 shrink-0" />
                            )}
                            {liveTag === 'mejoria' && <Sparkles className="w-2.5 h-2.5 shrink-0" />}
                            <span>{exam.liveUpdateNote || 'Reevaluado en vivo'}</span>
                          </span>
                        )
                      )}
                      {isUnlocked && (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-blue-950 text-blue-200 border border-blue-700/70">
                          Explorado
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-white mb-2">{exam.name}</h3>

                  {isUnlocked ? (
                    <div className="space-y-2 mt-2">
                      <p className="text-xs sm:text-sm text-white leading-relaxed font-sans bg-black/50 p-3 rounded-lg border border-blue-900/60">
                        {exam.finding}
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-blue-300/60 italic mt-1">
                      Maniobra pendiente. Toque para examinar al paciente y documentar el hallazgo actual.
                    </p>
                  )}
                </div>

                {/* Action button */}
                <div className="mt-4 pt-3 border-t border-blue-900/50 flex items-center justify-end">
                  {isUnlocked ? (
                    <div className="flex items-center gap-1.5 text-xs text-blue-300 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                      <span>Explorado y documentado</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => onUnlockExam(exam.id)}
                      className="w-full sm:w-auto px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {getSystemIcon(exam.system, 'w-3.5 h-3.5 shrink-0')}
                      <span>Realizar Exploración</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
