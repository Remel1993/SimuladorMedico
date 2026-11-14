import React, { useState, useRef, useEffect } from 'react';
import { SavedCaseRecord, Specialty } from '../types/clinical';
import {
  X,
  History,
  Trophy,
  Award,
  Trash2,
  Calendar,
  CheckCircle2,
  BarChart3,
  TrendingUp,
  Layers,
  Target,
} from 'lucide-react';

interface CaseHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: SavedCaseRecord[];
  onClearHistory: () => void;
  onReviewCase: (record: SavedCaseRecord) => void;
}

const SPECIALTY_LABELS: Record<Specialty, string> = {
  aleatorio: 'General',
  infectologia: 'Infectología',
  cardiologia: 'Cardiología',
  cirugia_general: 'Cirugía General',
  endocrinologia: 'Endocrinología',
  neurologia: 'Neurología',
  neumologia: 'Neumología',
  medicina_interna: 'Medicina Interna',
  urgencias: 'Medicina de Emergencias',
  pediatria: 'Pediatría',
  gastroenterologia: 'Gastroenterología',
  nefrologia: 'Nefrología',
  ginecologia: 'Ginecología y Obstetricia',
  traumatologia: 'Traumatología',
  dermatologia: 'Dermatología',
  psiquiatria: 'Psiquiatría',
};

const MODE_LABELS: Record<string, string> = {
  principiante: 'Principiante',
  medico_general: 'Médico General',
  residente: 'Residente',
  urgencias: 'Urgencias',
  examen: 'Modo Examen',
};

function getScoreBarTone(score: number): string {
  if (score >= 90) return 'bg-sky-400';
  if (score >= 75) return 'bg-blue-500';
  if (score >= 60) return 'bg-amber-400';
  return 'bg-rose-500';
}

function getScoreTextTone(score: number): string {
  if (score >= 90) return 'text-sky-300';
  if (score >= 75) return 'text-blue-300';
  if (score >= 60) return 'text-amber-300';
  return 'text-rose-300';
}

export const CaseHistoryModal: React.FC<CaseHistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onClearHistory,
  onReviewCase,
}) => {
  const [activeView, setActiveView] = useState<'list' | 'analytics'>('list');
  const modalBodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && modalBodyRef.current) {
      modalBodyRef.current.scrollTop = 0;
    }
  }, [isOpen, activeView]);

  if (!isOpen) return null;

  const averageScore =
    history.length > 0
      ? Math.round(history.reduce((acc, curr) => acc + curr.score, 0) / history.length)
      : 0;

  const excellentCount = history.filter((h) => h.score >= 90).length;

  // Aggregate scores by specialty
  const specialtyStats = Object.values(
    history.reduce<
      Record<
        string,
        {
          specialty: Specialty;
          label: string;
          count: number;
          total: number;
          best: number;
          latest: number;
        }
      >
    >((acc, rec) => {
      const key = rec.specialty || 'medicina_interna';
      if (!acc[key]) {
        acc[key] = {
          specialty: key,
          label: SPECIALTY_LABELS[key] || key.replace('_', ' '),
          count: 0,
          total: 0,
          best: 0,
          latest: rec.score,
        };
      }
      acc[key].count += 1;
      acc[key].total += rec.score;
      acc[key].best = Math.max(acc[key].best, rec.score);
      return acc;
    }, {})
  )
    .map((item) => ({
      ...item,
      avg: Math.round(item.total / item.count),
    }))
    .sort((a, b) => b.avg - a.avg || b.count - a.count);

  const strongestSpecialty = specialtyStats.length > 0 ? specialtyStats[0] : null;
  const weakestSpecialty =
    specialtyStats.length > 1 ? specialtyStats[specialtyStats.length - 1] : null;

  // Chronological progression (last 10 cases oldest -> newest)
  const recentChronological = [...history].slice(0, 10).reverse();

  // Rubric competency averages (across all 7 categories)
  const rubricDomains = [
    { key: 'anamnesis' as const, label: 'Anamnesis', max: 15 },
    { key: 'physicalExam' as const, label: 'Examen Físico', max: 15 },
    { key: 'studiesInterpretation' as const, label: 'Estudios', max: 15 },
    { key: 'primaryDiagnosis' as const, label: 'Diagnóstico', max: 25 },
    { key: 'differentialDiagnoses' as const, label: 'Diferenciales', max: 10 },
    { key: 'treatment' as const, label: 'Tratamiento', max: 15 },
    { key: 'safetyAndConduct' as const, label: 'Conducta/Seguridad', max: 5 },
  ].map((domain) => {
    const validRecords = history.filter((h) => h.evaluation?.breakdown);
    if (validRecords.length === 0) {
      return { ...domain, avgScore: 0, pct: 0 };
    }
    const avgRaw =
      validRecords.reduce((sum, r) => sum + (r.evaluation.breakdown[domain.key] || 0), 0) /
      validRecords.length;
    return {
      ...domain,
      avgScore: Number(avgRaw.toFixed(1)),
      pct: Math.min(100, Math.round((avgRaw / domain.max) * 100)),
    };
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-1.5 sm:p-3 lg:p-4 bg-black/85 backdrop-blur-sm">
      <div className="relative w-full max-w-[98vw] sm:max-w-[95vw] lg:max-w-6xl h-[94dvh] sm:h-[90dvh] max-h-[960px] flex flex-col bg-[#07132B] border border-blue-800/70 rounded-2xl shadow-2xl overflow-hidden">
        {/* Compact Header */}
        <div className="px-4 sm:px-6 py-3 bg-[#040B1B] border-b border-blue-900/70 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#0D2149] border border-blue-600/60 flex items-center justify-center text-blue-300 shrink-0">
              <History className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-bold text-white tracking-tight truncate">
                Historial y Progreso Clínico
              </h3>
              <p className="text-[11px] text-blue-300/80 truncate hidden sm:block">
                Registro de casos, puntajes por especialidad y evolución
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-blue-200 hover:text-white rounded-lg hover:bg-[#0D2149] transition-colors shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-Tabs Switcher */}
        {history.length > 0 && (
          <div className="px-3 sm:px-6 py-2 bg-[#050E22] border-b border-blue-900/70 grid grid-cols-2 gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setActiveView('list')}
              className={`px-2.5 sm:px-3 py-2 rounded-lg text-[11px] sm:text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                activeView === 'list'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-[#07132B] text-blue-200 hover:text-white border border-blue-900/60'
              }`}
            >
              <History className="w-3.5 h-3.5 shrink-0" />
              <span>Casos ({history.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveView('analytics')}
              className={`px-2.5 sm:px-3 py-2 rounded-lg text-[11px] sm:text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                activeView === 'analytics'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-[#07132B] text-blue-200 hover:text-white border border-blue-900/60'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 shrink-0" />
              <span className="sm:hidden">Especialidades y Gráficos</span>
              <span className="hidden sm:inline">Puntaje por Especialidad y Gráficos</span>
            </button>
          </div>
        )}

        {/* Generous Scrollable Body (Stats + Content together) */}
        <div
          ref={modalBodyRef}
          className="p-3.5 sm:p-6 flex-1 min-h-0 overflow-y-auto space-y-4"
        >
          {/* Compact 3-Column Stats Strip */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <div className="bg-[#040B1B] p-2.5 sm:p-3.5 rounded-xl border border-blue-900/60 flex items-center gap-2 sm:gap-3 min-w-0">
              <Trophy className="w-5 h-5 sm:w-7 sm:h-7 text-amber-400 shrink-0" />
              <div className="min-w-0">
                <div className="text-[10px] sm:text-[11px] text-blue-300 uppercase font-semibold truncate">
                  Casos
                </div>
                <div className="text-base sm:text-xl font-bold font-mono text-white leading-tight">
                  {history.length}
                </div>
              </div>
            </div>

            <div className="bg-[#040B1B] p-2.5 sm:p-3.5 rounded-xl border border-blue-900/60 flex items-center gap-2 sm:gap-3 min-w-0">
              <Award className="w-5 h-5 sm:w-7 sm:h-7 text-blue-400 shrink-0" />
              <div className="min-w-0">
                <div className="text-[10px] sm:text-[11px] text-blue-300 uppercase font-semibold truncate">
                  Promedio
                </div>
                <div className="text-base sm:text-xl font-bold font-mono text-white leading-tight">
                  {averageScore}
                  <span className="text-[10px] sm:text-xs font-normal text-blue-300/80">/100</span>
                </div>
              </div>
            </div>

            <div className="bg-[#040B1B] p-2.5 sm:p-3.5 rounded-xl border border-blue-900/60 flex items-center gap-2 sm:gap-3 min-w-0">
              <CheckCircle2 className="w-5 h-5 sm:w-7 sm:h-7 text-sky-400 shrink-0" />
              <div className="min-w-0">
                <div className="text-[10px] sm:text-[11px] text-blue-300 uppercase font-semibold truncate">
                  ≥90 pts
                </div>
                <div className="text-base sm:text-xl font-bold font-mono text-sky-300 leading-tight">
                  {excellentCount}
                </div>
              </div>
            </div>
          </div>

          {history.length === 0 ? (
            <div className="text-center py-10 text-blue-200/75 text-xs">
              Aún no has completado ningún caso clínico. Atiende a tu primer paciente y somete tu diagnóstico para ver tu historial y gráficas de progreso.
            </div>
          ) : activeView === 'list' ? (
            <div className="space-y-3">
              {history.map((record) => (
                <div
                  key={record.id}
                  className="bg-[#040B1B] p-4 rounded-xl border border-blue-900/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-blue-600 transition-colors"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-blue-300/80">
                      <Calendar className="w-3 h-3 shrink-0" />
                      <span>{new Date(record.date).toLocaleDateString('es-ES', { dateStyle: 'medium' })}</span>
                      <span>·</span>
                      <span className="text-sky-300 font-semibold">
                        {SPECIALTY_LABELS[record.specialty] || record.specialty.replace('_', ' ')}
                      </span>
                      <span>·</span>
                      <span className="text-white/80">{MODE_LABELS[record.mode] || record.mode}</span>
                    </div>

                    <h4 className="text-sm font-bold text-white mt-1 break-words">
                      {record.patientName} — {record.correctDiagnosis}
                    </h4>
                    <p className="text-xs text-blue-200/80 mt-0.5 break-words">
                      Tu diagnóstico: <span className="text-white">"{record.userDiagnosis}"</span>
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-blue-900/50">
                    <div className="sm:text-right">
                      <div className={`text-lg font-bold font-mono ${getScoreTextTone(record.score)}`}>
                        {record.score} <span className="text-xs text-blue-300 font-normal">pts</span>
                      </div>
                      <div className="text-[10px] text-blue-300 font-medium">
                        {record.evaluation.classification}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        onReviewCase(record);
                        onClose();
                      }}
                      className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Ver Dictamen
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-5">
              {/* Quick Highlights */}
              {strongestSpecialty && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-[#040B1B] border border-blue-800/70 rounded-xl p-3.5 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-[10px] uppercase tracking-wider font-bold text-sky-300">
                        Especialidad más fuerte
                      </div>
                      <div className="text-sm font-bold text-white truncate mt-0.5">
                        {strongestSpecialty.label}
                      </div>
                      <div className="text-[11px] text-blue-200/75">
                        {strongestSpecialty.count} {strongestSpecialty.count === 1 ? 'caso' : 'casos'} · Máx {strongestSpecialty.best} pts
                      </div>
                    </div>
                    <div className="text-xl font-extrabold font-mono text-sky-300 shrink-0">
                      {strongestSpecialty.avg}
                    </div>
                  </div>

                  {weakestSpecialty ? (
                    <div className="bg-[#040B1B] border border-amber-700/50 rounded-xl p-3.5 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-[10px] uppercase tracking-wider font-bold text-amber-300">
                          Área recomendada a reforzar
                        </div>
                        <div className="text-sm font-bold text-white truncate mt-0.5">
                          {weakestSpecialty.label}
                        </div>
                        <div className="text-[11px] text-blue-200/75">
                          {weakestSpecialty.count} {weakestSpecialty.count === 1 ? 'caso' : 'casos'} · Máx {weakestSpecialty.best} pts
                        </div>
                      </div>
                      <div className={`text-xl font-extrabold font-mono shrink-0 ${getScoreTextTone(weakestSpecialty.avg)}`}>
                        {weakestSpecialty.avg}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-[#040B1B] border border-blue-900/70 rounded-xl p-3.5 flex items-center gap-2.5 text-xs text-blue-200/80">
                      <Target className="w-5 h-5 text-blue-400 shrink-0" />
                      <span>Resuelve casos de otras especialidades para comparar tus fortalezas y áreas a reforzar.</span>
                    </div>
                  )}
                </div>
              )}

              {/* 1. Gráfico de Evolución Reciente */}
              <div className="bg-[#040B1B] border border-blue-900/70 rounded-xl p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-sky-400 shrink-0" />
                    <h4 className="text-xs sm:text-sm font-bold text-white">
                      Evolución de Puntaje (Últimos {recentChronological.length} casos)
                    </h4>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-blue-200/80">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-sky-400 inline-block" /> ≥90
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" /> 75-89
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" /> 60-74
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" /> &lt;60
                    </span>
                  </div>
                </div>

                <div className="relative pt-4 pb-1">
                  {/* Reference line at 70 pts */}
                  <div
                    className="absolute left-0 right-0 border-t border-dashed border-blue-700/60 pointer-events-none"
                    style={{ bottom: 'calc(28px + 0.70 * 116px)' }}
                  >
                    <span className="text-[9px] font-mono text-blue-400/80 bg-[#040B1B] pr-1 -mt-2 inline-block">
                      70 pts
                    </span>
                  </div>

                  <div className="flex items-end gap-2 sm:gap-3 h-[144px] overflow-x-auto pb-1 no-scrollbar">
                    {recentChronological.map((rec, idx) => {
                      const barHeight = Math.max(8, Math.round((rec.score / 100) * 116));
                      const specShort = (SPECIALTY_LABELS[rec.specialty] || rec.specialty).slice(0, 8);
                      return (
                        <div
                          key={rec.id}
                          className="flex-1 min-w-[38px] flex flex-col items-center justify-end h-full group"
                          title={`${SPECIALTY_LABELS[rec.specialty] || rec.specialty}: ${rec.score}/100 pts (${rec.correctDiagnosis})`}
                        >
                          <span className={`text-[11px] font-mono font-bold mb-1 ${getScoreTextTone(rec.score)}`}>
                            {rec.score}
                          </span>
                          <div
                            className={`w-full max-w-[36px] rounded-t-md transition-all ${getScoreBarTone(rec.score)}`}
                            style={{ height: `${barHeight}px` }}
                          />
                          <span className="text-[9px] text-blue-300/80 mt-1.5 truncate max-w-full">
                            #{idx + 1} · {specShort}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 2. Puntaje por Especialidad Médica */}
              <div className="bg-[#040B1B] border border-blue-900/70 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-blue-400 shrink-0" />
                    <h4 className="text-xs sm:text-sm font-bold text-white">
                      Promedio por Especialidad Médica
                    </h4>
                  </div>
                  <span className="text-[11px] text-blue-300/80 font-mono">
                    {specialtyStats.length} {specialtyStats.length === 1 ? 'área' : 'áreas'}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {specialtyStats.map((spec) => (
                    <div
                      key={spec.specialty}
                      className="bg-[#07132B] border border-blue-900/60 rounded-lg p-3 space-y-1.5"
                    >
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="font-bold text-white truncate">{spec.label}</span>
                          <span className="text-[10px] text-blue-300/80 bg-[#040B1B] px-2 py-0.5 rounded border border-blue-900/70 shrink-0">
                            {spec.count} {spec.count === 1 ? 'caso' : 'casos'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 font-mono">
                          <span className="text-[10px] text-blue-300/75 hidden sm:inline">
                            Máx: {spec.best}
                          </span>
                          <span className={`text-sm font-bold ${getScoreTextTone(spec.avg)}`}>
                            {spec.avg} <span className="text-[10px] text-blue-300/70 font-normal">/ 100</span>
                          </span>
                        </div>
                      </div>
                      <div className="w-full h-2 rounded-full bg-black/70 overflow-hidden border border-blue-950">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${getScoreBarTone(spec.avg)}`}
                          style={{ width: `${Math.min(100, spec.avg)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Dominio por Competencia Clínica (Rúbrica) */}
              <div className="bg-[#040B1B] border border-blue-900/70 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-400 shrink-0" />
                  <h4 className="text-xs sm:text-sm font-bold text-white">
                    Rendimiento Promedio por Competencia Clínica
                  </h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {rubricDomains.map((dom) => (
                    <div
                      key={dom.key}
                      className="bg-[#07132B] border border-blue-900/60 rounded-lg p-2.5 space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-blue-100">{dom.label}</span>
                        <span className="font-mono font-bold text-white">
                          {dom.avgScore} <span className="text-blue-300/70 font-normal">/ {dom.max} ({dom.pct}%)</span>
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-black/70 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${getScoreBarTone(dom.pct)}`}
                          style={{ width: `${dom.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div className="px-4 sm:px-6 py-3.5 bg-[#040B1B] border-t border-blue-900/70 flex flex-wrap items-center justify-between gap-2 shrink-0">
            <span className="text-xs text-blue-300/80">
              Datos guardados localmente en este dispositivo
            </span>
            <button
              onClick={onClearHistory}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Limpiar Historial</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
