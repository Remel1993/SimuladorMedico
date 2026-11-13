import React, { useState } from 'react';
import { ClinicalCase, EvaluationResult, RubricCategoryDetail } from '../types/clinical';
import {
  Award,
  AlertOctagon,
  CheckCircle2,
  XCircle,
  BookOpen,
  ArrowRight,
  Layers,
  Sparkles,
  Stethoscope,
  FlaskConical,
  Pill,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Target,
} from 'lucide-react';

interface ClinicalAuditTabProps {
  caseData: ClinicalCase;
  evaluation: EvaluationResult;
  onNextCase: () => void;
}

export const ClinicalAuditTab: React.FC<ClinicalAuditTabProps> = ({
  caseData,
  evaluation,
  onNextCase,
}) => {
  const {
    totalScore,
    breakdown,
    categoryDetails,
    classification,
    criticalSafetyErrors,
    feedback,
    differentialExplanations,
    userSummary,
  } = evaluation;
  const { solution } = caseData;
  const [showAllNormalStudies, setShowAllNormalStudies] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'border-blue-400/70 bg-gradient-to-br from-[#0A1D47] via-[#06112B] to-black';
    if (score >= 80) return 'border-blue-500/60 bg-gradient-to-br from-[#09193D] via-[#06112B] to-black';
    if (score >= 70) return 'border-blue-600/50 bg-[#07132B]';
    if (score >= 60) return 'border-amber-500/50 bg-[#07132B]';
    return 'border-rose-500/60 bg-[#07132B]';
  };

  const getScoreBarColor = (score: number, max: number) => {
    const ratio = score / max;
    if (ratio >= 0.85) return 'bg-sky-400';
    if (ratio >= 0.7) return 'bg-blue-500';
    if (ratio >= 0.55) return 'bg-amber-400';
    return 'bg-rose-500';
  };

  const rubricItems: Array<{
    key: keyof EvaluationResult['breakdown'];
    name: string;
    score: number;
    max: number;
    fallbackDesc: string;
    detail?: RubricCategoryDetail;
  }> = [
    {
      key: 'anamnesis',
      name: '1. Anamnesis e Interrogatorio Clínico',
      score: breakdown.anamnesis,
      max: 15,
      fallbackDesc: 'Semiología de síntomas, evolución cronológica y antecedentes.',
      detail: categoryDetails?.anamnesis,
    },
    {
      key: 'physicalExam',
      name: '2. Exploración Física y Maniobras',
      score: breakdown.physicalExam,
      max: 15,
      fallbackDesc: 'Solicitud de maniobras dirigidas y detección de signos positivos.',
      detail: categoryDetails?.physicalExam,
    },
    {
      key: 'studiesInterpretation',
      name: '3. Selección e Interpretación de Estudios',
      score: breakdown.studiesInterpretation,
      max: 15,
      fallbackDesc: 'Paraclínicos pertinentes sin despilfarro ni omisión crítica.',
      detail: categoryDetails?.studiesInterpretation,
    },
    {
      key: 'primaryDiagnosis',
      name: '4. Diagnóstico Principal y Razonamiento',
      score: breakdown.primaryDiagnosis,
      max: 25,
      fallbackDesc: 'Coincidencia con la patología real y especificidad sindromática.',
      detail: categoryDetails?.primaryDiagnosis,
    },
    {
      key: 'differentialDiagnoses',
      name: '5. Diagnósticos Diferenciales',
      score: breakdown.differentialDiagnoses,
      max: 10,
      fallbackDesc: 'Planteamiento de patologías competidoras fundamentadas.',
      detail: categoryDetails?.differentialDiagnoses,
    },
    {
      key: 'treatment',
      name: '6. Tratamiento y Régimen Farmacológico',
      score: breakdown.treatment,
      max: 15,
      fallbackDesc: 'Esquema de fármacos, dosis, vías, frecuencias y medidas de soporte.',
      detail: categoryDetails?.treatment,
    },
    {
      key: 'safetyAndConduct',
      name: '7. Conducta, Triage y Seguridad',
      score: breakdown.safetyAndConduct,
      max: 5,
      fallbackDesc: 'Nivel de hospitalización idóneo y ausencia de contraindicaciones.',
      detail: categoryDetails?.safetyAndConduct,
    },
  ];

  const requestedStudySet = new Set(userSummary?.unlockedStudiesNames || []);
  const requestedExamSet = new Set(userSummary?.unlockedExamsNames || []);

  const allStudies = caseData.studiesPool || [];
  const relevantOrRequestedStudies = allStudies.filter(
    (s) => s.isAbnormal || requestedStudySet.has(s.name)
  );
  const normalUnrequestedStudies = allStudies.filter(
    (s) => !s.isAbnormal && !requestedStudySet.has(s.name)
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Score Header Hero */}
      <div className={`rounded-2xl border p-5 sm:p-8 ${getScoreColor(totalScore)} shadow-xl relative overflow-hidden`}>
        <div className="flex flex-col lg:flex-row items-center justify-between gap-5 sm:gap-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5 text-center sm:text-left">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-black/80 border border-blue-500/50 flex flex-col items-center justify-center shrink-0 shadow-inner">
              <span className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight text-white">
                {totalScore}
              </span>
              <span className="text-[11px] font-semibold uppercase text-blue-300">sobre 100</span>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1 justify-center sm:justify-start">
                <Award className="w-5 h-5 text-blue-400 shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wider text-blue-300">
                  Dictamen Didáctico del Tribunal Evaluador
                </span>
              </div>
              <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">
                {classification}
              </h2>
              <p className="text-xs sm:text-sm text-blue-100 mt-1 max-w-2xl">
                Diagnóstico Real del Caso:{' '}
                <span className="font-bold text-white">{solution.correctDiagnosis}</span>
              </p>
              {userSummary?.primaryDiagnosis && (
                <p className="text-xs text-sky-300 mt-0.5 max-w-2xl">
                  Tu Diagnóstico Propuesto:{' '}
                  <span className="font-semibold text-white">{userSummary.primaryDiagnosis}</span>
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end w-full lg:w-auto">
            <button
              onClick={onNextCase}
              className="w-full sm:w-auto px-5 py-2.5 bg-white hover:bg-blue-100 text-[#030A1C] rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <span>Siguiente Caso Clínico</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
          </div>
        </div>
      </div>

      {/* Critical Safety Errors Banner */}
      {criticalSafetyErrors && criticalSafetyErrors.length > 0 && (
        <div className="bg-rose-950/80 border-2 border-rose-500 rounded-2xl p-4 sm:p-5 text-rose-100 shadow-lg space-y-2">
          <div className="flex items-center gap-2 text-rose-300 font-bold text-sm uppercase tracking-wide">
            <AlertOctagon className="w-5 h-5 shrink-0" />
            <span>Alerta Crítica de Seguridad Detectada:</span>
          </div>
          <ul className="space-y-1.5 text-xs sm:text-sm text-rose-100 pl-6 list-disc">
            {criticalSafetyErrors.map((err, idx) => (
              <li key={idx} className="font-semibold">{err}</li>
            ))}
          </ul>
          <p className="text-[11px] text-rose-200 italic pt-1">
            * Nota docente: En la práctica clínica real, este tipo de error conlleva alto riesgo de morbimortalidad iatrogénica.
          </p>
        </div>
      )}

      {/* Rubric Breakdown Grid (7 Categories WITH Why Score & Missing Items) */}
      <div className="bg-[#07132B] border border-blue-900/60 rounded-2xl p-4 sm:p-6 shadow-md space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-blue-900/60 pb-3">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-400 shrink-0" />
              <span>Desglose Detallado: ¿Por qué obtuviste cada puntaje y qué faltó?</span>
            </h3>
            <p className="text-xs text-blue-200/75 mt-0.5">
              Cada apartado muestra exactamente la justificación de tu calificación, tus aciertos y los puntos específicos por mejorar.
            </p>
          </div>
          <span className="text-xs font-mono text-sky-300 font-semibold shrink-0">
            Total: {totalScore} / 100 pts
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 sm:gap-4">
          {rubricItems.map((item) => {
            const pct = Math.round((item.score / item.max) * 100);
            return (
              <div
                key={item.key}
                className="bg-[#040B1B] p-4 rounded-xl border border-blue-900/70 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-bold text-white text-xs sm:text-sm">{item.name}</span>
                    <span className="font-mono font-bold text-white text-sm shrink-0 bg-[#07132B] px-2.5 py-0.5 rounded-lg border border-blue-800/70">
                      {item.score}{' '}
                      <span className="text-blue-300/70 font-normal text-xs">/ {item.max}</span>
                    </span>
                  </div>

                  <div className="w-full bg-black/70 h-2 rounded-full overflow-hidden border border-blue-950">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${getScoreBarColor(
                        item.score,
                        item.max
                      )}`}
                      style={{ width: `${Math.min(100, pct)}%` }}
                    />
                  </div>

                  {item.detail ? (
                    <div className="space-y-2.5 pt-1 text-xs">
                      <div className="bg-black/40 border border-blue-900/60 rounded-lg p-2.5 text-blue-100 leading-relaxed">
                        <span className="font-bold text-sky-300 block mb-0.5">
                          ¿Por qué este puntaje?
                        </span>
                        {item.detail.whyScore}
                      </div>

                      {item.detail.strengths.length > 0 && (
                        <div className="space-y-1">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                            Lo que hiciste bien
                          </span>
                          <ul className="space-y-1 text-[11px] sm:text-xs text-blue-100/90 pl-1">
                            {item.detail.strengths.map((s, sIdx) => (
                              <li key={sIdx} className="flex items-start gap-1.5">
                                <span className="text-emerald-400 font-bold">·</span>
                                <span>{s}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {item.detail.missingOrImprove.length > 0 && (
                        <div className="space-y-1">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1">
                            <XCircle className="w-3.5 h-3.5 shrink-0" />
                            Qué faltó / Cómo mejorar
                          </span>
                          <ul className="space-y-1 text-[11px] sm:text-xs text-amber-100/90 pl-1">
                            {item.detail.missingOrImprove.map((m, mIdx) => (
                              <li key={mIdx} className="flex items-start gap-1.5">
                                <span className="text-amber-400 font-bold">·</span>
                                <span>{m}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-[11px] text-blue-200/75">{item.fallbackDesc}</p>
                  )}
                </div>

                {item.detail?.expectedStandard && (
                  <div className="pt-2 border-t border-blue-900/50 text-[11px] text-blue-300/85">
                    <span className="font-semibold text-blue-200">Estándar esperado: </span>
                    {item.detail.expectedStandard}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Comprehensive Academic Debriefing Section */}
      <div className="bg-[#07132B] border border-blue-900/60 rounded-2xl p-4 sm:p-6 shadow-md space-y-6">
        <div className="border-b border-blue-900/60 pb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-400 shrink-0" />
            <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
              Sesión Clínico-Patológica Didáctica: Diagnósticos, Estudios y Tratamiento
            </h3>
          </div>
          <span className="text-xs text-blue-300 font-medium">Basado en Guías OMS / OPS / AHA / NICE</span>
        </div>

        {/* 1. Diagnóstico Comparativo y Fisiopatología */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-blue-300 flex items-center gap-1.5">
            <Target className="w-4 h-4 text-blue-400 shrink-0" />
            <span>1. Diagnóstico Definitivo, Comparativa y Fisiopatología</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-[#040B1B] p-4 rounded-xl border border-blue-900/70 space-y-1.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-sky-300">
                Tu Diagnóstico y Justificación
              </div>
              <div className="text-sm font-bold text-white">
                {userSummary?.primaryDiagnosis || 'No registraste diagnóstico principal'}
              </div>
              <p className="text-xs text-blue-200/85 leading-relaxed">
                {userSummary?.clinicalJustification
                  ? userSummary.clinicalJustification
                  : 'No ingresaste justificación clínica escrita.'}
              </p>
            </div>

            <div className="bg-blue-950/40 p-4 rounded-xl border border-blue-500/60 space-y-1.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
                Diagnóstico Real de Referencia
              </div>
              <div className="text-sm font-bold text-white">{solution.correctDiagnosis}</div>
              <p className="text-xs text-blue-100 leading-relaxed">
                {feedback.diagnosisAccuracyComment}
              </p>
            </div>
          </div>

          <div className="bg-[#040B1B] p-4 rounded-xl border border-blue-900/70 space-y-2">
            <div className="text-xs font-bold text-blue-300 uppercase tracking-wider">
              ¿Por qué ocurre esta enfermedad? (Fisiopatología)
            </div>
            <p className="text-xs sm:text-sm text-white leading-relaxed">{solution.pathophysiology}</p>
            {feedback.reasoningEvaluation && (
              <div className="pt-2 border-t border-blue-900/60 text-xs text-sky-200">
                <span className="font-semibold text-blue-300">Evaluación de tu razonamiento: </span>
                {feedback.reasoningEvaluation}
              </div>
            )}
          </div>
        </div>

        {/* 2. Pistas Cardinales y Signos Característicos */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-blue-300 flex items-center gap-1.5">
            <Stethoscope className="w-4 h-4 text-blue-400 shrink-0" />
            <span>2. Claves Clínicas y Signos Característicos del Cuadro</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-[#040B1B] p-4 rounded-xl border border-blue-900/70 space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-sky-300">
                Pistas que Orientaban al Diagnóstico
              </div>
              <ul className="space-y-1.5 text-xs text-white">
                {solution.keyClinicalClues.map((clue, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <span>{clue}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#040B1B] p-4 rounded-xl border border-blue-900/70 space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-sky-300">
                Signos y Síntomas Típicos & Hallazgos Físicos Clave
              </div>
              <ul className="space-y-1.5 text-xs text-white">
                {(solution.characteristicSignsSymptoms || []).map((s, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-sky-400 font-bold">·</span>
                    <span>{s}</span>
                  </li>
                ))}
                {(caseData.physicalExamPool || [])
                  .filter((pe) => pe.isAbnormal)
                  .slice(0, 4)
                  .map((pe) => (
                    <li key={pe.id} className="flex items-start gap-2 text-blue-100">
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 mt-0.5 ${
                          requestedExamSet.has(pe.name)
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/60'
                            : 'bg-amber-950 text-amber-300 border border-amber-700/60'
                        }`}
                      >
                        {requestedExamSet.has(pe.name) ? 'Explorado' : 'Omitido'}
                      </span>
                      <span>
                        <strong className="text-white">{pe.name}:</strong> {pe.finding}
                      </span>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>

        {/* 3. Diagnósticos Diferenciales Didácticos */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-blue-300">
            3. Análisis de Diagnósticos Diferenciales y Claves para Descartarlos
          </h4>

          <div className="bg-[#040B1B] p-4 rounded-xl border border-blue-900/70 space-y-2">
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="text-blue-300 font-semibold">Tus diferenciales:</span>
              {userSummary?.differentialDiagnoses && userSummary.differentialDiagnoses.length > 0 ? (
                userSummary.differentialDiagnoses.map((d, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-[#07132B] border border-blue-800/70 text-white">
                    {d}
                  </span>
                ))
              ) : (
                <span className="text-amber-300 italic">No registraste diagnósticos diferenciales.</span>
              )}
            </div>
            <p className="text-xs text-sky-200">{feedback.differentialEvaluation}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {(differentialExplanations && differentialExplanations.length > 0
              ? differentialExplanations
              : (solution.differentialDiagnoses || []).map((d, i) => ({
                  diagnosis: d,
                  rationale:
                    (solution.criticalRulingOutFactors && solution.criticalRulingOutFactors[i]) ||
                    `Comparte presentación clínica inicial, pero se descarta con el interrogatorio dirigido, exploración física y paraclínicos.`,
                }))
            ).map((item, idx) => (
              <div key={idx} className="bg-[#040B1B] p-3.5 rounded-xl border border-blue-900/70 space-y-1">
                <div className="text-xs font-bold text-white">{item.diagnosis}</div>
                <p className="text-xs text-blue-200/85 leading-relaxed">{item.rationale}</p>
              </div>
            ))}
          </div>

          {(solution.criticalRulingOutFactors || []).length > 0 && (
            <div className="bg-[#040B1B] p-4 rounded-xl border border-blue-900/70 space-y-1.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-blue-300">
                Pautas Semiológicas Adicionales de Descarte
              </div>
              <ul className="space-y-1 text-xs text-blue-100">
                {solution.criticalRulingOutFactors.map((factor, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-blue-400 font-bold">·</span>
                    <span>{factor}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* 4. Interpretación Docente de Estudios (Primarios, Solicitados y Relacionados como TAC/Rx/US) */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-300 flex items-center gap-1.5">
              <FlaskConical className="w-4 h-4 text-blue-400 shrink-0" />
              <span>4. Interpretación de Estudios e Imágenes (Hallazgos Primarios y Relacionados)</span>
            </h4>
            {normalUnrequestedStudies.length > 0 && (
              <button
                type="button"
                onClick={() => setShowAllNormalStudies((prev) => !prev)}
                className="text-[11px] text-sky-300 hover:text-white font-semibold flex items-center gap-1 cursor-pointer"
              >
                {showAllNormalStudies ? (
                  <>
                    <ChevronUp className="w-3.5 h-3.5" />
                    <span>Ocultar estudios normales no solicitados ({normalUnrequestedStudies.length})</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3.5 h-3.5" />
                    <span>Ver también estudios normales no solicitados ({normalUnrequestedStudies.length})</span>
                  </>
                )}
              </button>
            )}
          </div>

          <div className="bg-black/40 border border-blue-900/60 rounded-xl p-3.5 text-xs text-blue-100 space-y-1">
            <div>
              <span className="font-bold text-sky-300">Auditoría de tu solicitud de estudios: </span>
              {feedback.workupCritique}
            </div>
            {(solution.recommendedWorkup || []).length > 0 && (
              <div className="text-blue-200/85">
                <span className="font-semibold text-white">Abordaje paraclínico recomendado: </span>
                {solution.recommendedWorkup.join(' · ')}
              </div>
            )}
          </div>

          <div className="bg-[#040B1B] p-3.5 sm:p-4 rounded-xl border border-blue-900/70 space-y-2.5">
            {(showAllNormalStudies ? allStudies : relevantOrRequestedStudies).map((std) => {
              const wasRequested = requestedStudySet.has(std.name);
              return (
                <div
                  key={std.id}
                  className={`p-3 rounded-lg border text-xs ${
                    std.isAbnormal
                      ? 'bg-[#07132B] border-amber-500/50'
                      : 'bg-[#07132B] border-blue-900/60'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                    <span className="text-white font-bold">{std.name}</span>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          wasRequested
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-700/60'
                            : 'bg-slate-900 text-blue-300 border-blue-800/60'
                        }`}
                      >
                        {wasRequested ? 'Solicitado por ti' : 'No solicitado'}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          std.isAbnormal
                            ? 'bg-amber-950 text-amber-300 border-amber-600/60'
                            : 'bg-blue-950 text-blue-300 border-blue-800/60'
                        }`}
                      >
                        {std.isAbnormal ? 'Hallazgo Alterado / Relacionado' : 'Normal / Descarte'}
                      </span>
                    </div>
                  </div>
                  <div className="text-blue-100 font-mono text-[11px] mb-1 break-words">{std.result}</div>
                  {std.interpretation && (
                    <div className="text-sky-200 italic pt-1 border-t border-blue-900/60 text-[11px]">
                      <span className="font-semibold text-blue-300 not-italic">Interpretación clínica: </span>
                      {std.interpretation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 5. Esquema Terapéutico Completo y Conducta Médica (Tu Plan vs Ideal) */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-blue-300 flex items-center gap-1.5">
            <Pill className="w-4 h-4 text-blue-400 shrink-0" />
            <span>5. Clase Magistral de Tratamiento, Dosis y Conducta Integral</span>
          </h4>

          {/* Comparativa rápida de lo que propuso el usuario vs lo óptimo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-[#040B1B] p-4 rounded-xl border border-blue-900/70 space-y-2 text-xs">
              <div className="text-[11px] font-bold uppercase tracking-wider text-sky-300">
                Lo que Tú Propusiste
              </div>
              {userSummary?.pharmacologicalPlan && userSummary.pharmacologicalPlan.length > 0 ? (
                <ul className="space-y-1 text-white">
                  {userSummary.pharmacologicalPlan.map((m) => (
                    <li key={m.id} className="bg-[#07132B] px-2.5 py-1.5 rounded border border-blue-900/60">
                      <span className="font-bold">{m.drug || 'Fármaco sin nombre'}</span>{' '}
                      <span className="text-blue-200">
                        — {[m.dose, m.route, m.frequency, m.duration].filter(Boolean).join(' · ') || 'Sin posología detallada'}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-amber-300 italic">No prescribiste ningún fármaco.</p>
              )}
              <div className="pt-1.5 border-t border-blue-900/50 space-y-1 text-blue-100">
                <p>
                  <span className="font-semibold text-blue-300">Destino propuesto:</span>{' '}
                  {userSummary?.hospitalizationDecision || 'Sin definir'}
                </p>
                <p>
                  <span className="font-semibold text-blue-300">Medidas generales:</span>{' '}
                  {userSummary?.generalMeasures || 'No especificadas'}
                </p>
              </div>
            </div>

            <div className="bg-blue-950/35 p-4 rounded-xl border border-blue-500/60 space-y-2 text-xs">
              <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
                Retroalimentación Terapéutica Directa
              </div>
              <p className="text-white leading-relaxed">{feedback.treatmentCritique}</p>
              <div className="pt-1.5 border-t border-blue-800/60 space-y-1 text-blue-100">
                <p>
                  <span className="font-semibold text-emerald-300">Destino óptimo indicado:</span>{' '}
                  {solution.optimalTreatment.hospitalizationDecision}
                </p>
                {(solution.criticalSafetyAlerts || []).length > 0 && (
                  <div className="flex items-start gap-1.5 text-amber-200 pt-1">
                    <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>
                      <strong>Precaución terapéutica clave:</strong>{' '}
                      {solution.criticalSafetyAlerts[0]}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-[#040B1B] p-4 rounded-xl border border-blue-900/70 space-y-3">
            <div className="text-[11px] font-bold uppercase tracking-wider text-blue-300">
              Esquema Terapéutico Óptimo de Referencia (Fármaco por Fármaco)
            </div>

            {/* Mobile view */}
            <div className="md:hidden space-y-2.5">
              {solution.optimalTreatment.pharmacological.map((rx, idx) => (
                <div key={idx} className="bg-[#07132B] border border-blue-900/60 rounded-lg p-3 text-xs space-y-1">
                  <div className="font-bold text-white">{rx.drug}</div>
                  <div className="text-blue-100">
                    <span className="text-blue-300">Dosis:</span> {rx.dose}
                  </div>
                  <div className="text-sky-300">
                    {rx.route} · {rx.frequency} · {rx.duration}
                  </div>
                  <div className="text-blue-200/85 italic">{rx.rationale}</div>
                </div>
              ))}
            </div>

            {/* Desktop view */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-blue-900/70 text-blue-300 uppercase text-[10px]">
                    <th className="py-2 px-2">Fármaco</th>
                    <th className="py-2 px-2">Dosis Recomendada</th>
                    <th className="py-2 px-2">Vía / Frecuencia / Duración</th>
                    <th className="py-2 px-2">¿Por qué se indica? (Racional Clínico)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-900/50 font-sans">
                  {solution.optimalTreatment.pharmacological.map((rx, idx) => (
                    <tr key={idx}>
                      <td className="py-2.5 px-2 font-bold text-white">{rx.drug}</td>
                      <td className="py-2.5 px-2 text-blue-100">{rx.dose}</td>
                      <td className="py-2.5 px-2 text-sky-300">
                        {rx.route} · {rx.frequency}
                        {rx.duration ? ` · ${rx.duration}` : ''}
                      </td>
                      <td className="py-2.5 px-2 text-blue-200/85 italic">{rx.rationale}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pt-3 border-t border-blue-900/60 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-blue-100">
              <div className="space-y-1">
                <span className="font-semibold text-blue-300 block">Medidas Generales y Soporte:</span>
                <ul className="space-y-1 pl-4 list-disc">
                  {solution.optimalTreatment.generalMeasures.map((gm, idx) => (
                    <li key={idx}>{gm}</li>
                  ))}
                </ul>
              </div>
              <div className="space-y-2">
                <div>
                  <span className="font-semibold text-blue-300 block">Criterios de Referencia / UCI:</span>
                  <ul className="space-y-1 pl-4 list-disc">
                    {(solution.optimalTreatment.referralCriteria || []).map((rc, idx) => (
                      <li key={idx}>{rc}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="font-semibold text-blue-300 block">Plan de Seguimiento Clínico:</span>
                  <p className="text-blue-100/90">{solution.optimalTreatment.followUp}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 6. Perlas Pedagógicas y Alertas de Seguridad */}
        <div className="bg-blue-950/50 border border-blue-700/60 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-blue-300 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
            <span>Perlas Clínicas y Puntos Clave para el Examen y la Guardia</span>
          </div>
          <ul className="space-y-1.5 text-xs text-white pl-5 list-disc">
            {feedback.pedagogicalPearls.map((pearl, idx) => (
              <li key={idx}>{pearl}</li>
            ))}
            {(solution.criticalSafetyAlerts || []).map((alert, idx) => (
              <li key={`alert-${idx}`} className="text-amber-200">
                <strong>Alerta de seguridad:</strong> {alert}
              </li>
            ))}
          </ul>
        </div>

        {/* 7. Guías y Literatura Médica */}
        <div className="text-[11px] text-blue-200/80 border-t border-blue-900/60 pt-3">
          <span className="font-semibold text-white uppercase tracking-wide block mb-1">
            Referencias Bibliográficas y Guías de Práctica Clínica:
          </span>
          <ul className="space-y-0.5 text-blue-200/80 pl-4 list-disc">
            {solution.guidelineReferences.map((ref, idx) => (
              <li key={idx}>{ref}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
