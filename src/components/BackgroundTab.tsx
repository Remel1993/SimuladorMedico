import React from 'react';
import {
  ClinicalCase,
  ClinicalEvolutionState,
  StatInterventionRecord,
  VitalSigns,
} from '../types/clinical';
import {
  FileText,
  ShieldAlert,
  Pill,
  Scissors,
  Users,
  Home,
  AlertCircle,
  Activity,
  AlertTriangle,
  Skull,
  Syringe,
} from 'lucide-react';

interface BackgroundTabProps {
  caseData: ClinicalCase;
  liveVitals?: VitalSigns;
  statInterventions?: StatInterventionRecord[];
  evolutionState?: ClinicalEvolutionState;
  isDeceased?: boolean;
}

export const BackgroundTab: React.FC<BackgroundTabProps> = ({
  caseData,
  liveVitals,
  statInterventions = [],
  evolutionState,
  isDeceased = false,
}) => {
  const { background } = caseData;
  const hasLiveRecord =
    statInterventions.length > 0 ||
    isDeceased ||
    Boolean(evolutionState && evolutionState.trajectory !== 'estable');

  const allergicEvents = statInterventions.filter(
    (s) => s.effectSeverity === 'reaccion_adversa' || s.isImmediateDeath
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Intro Card */}
      <div className="bg-[#07132B] border border-blue-900/60 rounded-xl p-4 sm:p-5 shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="w-5 h-5 text-blue-400 shrink-0" />
          <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
            Expediente Clínico y Antecedentes del Paciente
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-blue-100/80 leading-relaxed">
          Revisión minuciosa de la historia médica previa, factores de riesgo epidemiológicos, antecedentes familiares, régimen farmacológico actual y notas de evolución del encuentro.
        </p>
      </div>

      {/* Live Encounter Log: Evolution, STAT Interventions & Iatrogenic Events */}
      {hasLiveRecord && (
        <div
          className={`rounded-xl border p-4 sm:p-5 shadow-md space-y-3 ${
            isDeceased
              ? 'bg-rose-950/60 border-rose-500/80'
              : allergicEvents.length > 0
              ? 'bg-[#190915] border-rose-600/70'
              : 'bg-[#07132B] border-sky-700/60'
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-blue-900/60 pb-2.5">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              {isDeceased ? (
                <Skull className="w-4 h-4 text-rose-300 shrink-0" />
              ) : allergicEvents.length > 0 ? (
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              ) : (
                <Activity className="w-4 h-4 text-sky-400 shrink-0" />
              )}
              <span>
                Registro de Evolución, Intervenciones STAT y Eventos Adversos en Curso
              </span>
            </div>

            {liveVitals && (
              <div className="font-mono text-[11px] text-blue-100 bg-black/50 border border-blue-900/70 px-2.5 py-1 rounded-md">
                {isDeceased
                  ? 'FALLECIDO · ASISTOLIA · PA 0/0 mmHg · FC 0 lpm · Glasgow 3/15'
                  : `PA ${liveVitals.bloodPressure} · FC ${liveVitals.heartRate} lpm · FR ${liveVitals.respiratoryRate} · SpO₂ ${liveVitals.oxygenSaturation}% · Gluc ${liveVitals.bloodGlucose} · Glasgow ${liveVitals.glasgow}/15`}
              </div>
            )}
          </div>

          {evolutionState?.summaryNote && (
            <div className="text-xs text-blue-100 bg-black/40 border border-blue-900/60 rounded-lg px-3 py-2">
              <span className="font-semibold text-sky-300">Nota de Evolución Clínica: </span>
              <span>{evolutionState.summaryNote}</span>
            </div>
          )}

          {allergicEvents.length > 0 && (
            <div className="bg-rose-950/70 border border-rose-500/70 rounded-lg px-3 py-2.5 space-y-1.5">
              <div className="text-xs font-bold text-rose-200 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-300 shrink-0" />
                <span>Reacciones Adversas / Eventos Iatrogénicos Documentados en Sala:</span>
              </div>
              <ul className="space-y-1 text-xs text-rose-100">
                {allergicEvents.map((ev) => (
                  <li key={ev.id} className="leading-relaxed">
                    <span className="font-mono text-[11px] text-rose-300">[{ev.appliedAt}] </span>
                    <strong>
                      {ev.drug} ({ev.dose}, {ev.route}):
                    </strong>{' '}
                    {ev.physiologicalEffectSummary}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {statInterventions.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-blue-300 flex items-center gap-1.5">
                <Syringe className="w-3.5 h-3.5 shrink-0" />
                <span>Bitácora de Órdenes e Intervenciones STAT ({statInterventions.length})</span>
              </div>
              <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                {statInterventions.map((st) => {
                  const sevBadge = st.isImmediateDeath
                    ? 'bg-rose-900/90 text-rose-100 border-rose-400/80'
                    : st.effectSeverity === 'reaccion_adversa'
                    ? 'bg-rose-950/80 text-rose-200 border-rose-600/70'
                    : st.effectSeverity === 'mejoria' || st.effectSeverity === 'parcial'
                    ? 'bg-emerald-950/80 text-emerald-200 border-emerald-600/70'
                    : 'bg-blue-950/80 text-blue-200 border-blue-700/70';

                  return (
                    <div
                      key={st.id}
                      className="text-xs bg-black/45 border border-blue-900/60 rounded-lg px-3 py-2 flex flex-col gap-1"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-semibold text-white">
                          <span className="font-mono text-[11px] text-blue-300 mr-1.5">
                            [{st.appliedAt}]
                          </span>
                          {st.drug} — {st.dose} ({st.route})
                        </span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${sevBadge}`}>
                          {st.isImmediateDeath
                            ? 'Muerte Iatrogénica Inmediata'
                            : st.effectSeverity === 'reaccion_adversa'
                            ? 'Iatrogenia / Evento Adverso'
                            : st.effectSeverity === 'mejoria' || st.effectSeverity === 'parcial'
                            ? 'Respuesta Terapéutica'
                            : 'Registrado'}
                        </span>
                      </div>
                      <p className="text-blue-100/90">{st.physiologicalEffectSummary}</p>
                      {st.deltas.length > 0 && (
                        <div className="font-mono text-[11px] text-sky-300/90">
                          Deltas: {st.deltas.map((d) => `${d.metric} ${d.before}→${d.after}`).join(' · ')}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Grid of Background Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
        {/* Antecedentes Personales Patológicos */}
        <div className="bg-[#07132B] border border-blue-900/60 rounded-xl p-4 sm:p-5 space-y-3">
          <div className="flex items-center gap-2 text-blue-300 text-sm font-semibold border-b border-blue-900/60 pb-2">
            <ShieldAlert className="w-4 h-4 text-blue-400 shrink-0" />
            <span>Antecedentes Personales Patológicos</span>
          </div>
          {background.pathological && background.pathological.length > 0 ? (
            <ul className="space-y-2 text-xs sm:text-sm text-blue-100">
              {background.pathological.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-blue-400 font-bold">·</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-blue-300/70 italic">Sin antecedentes patológicos crónicos referidos.</p>
          )}
        </div>

        {/* Antecedentes Personales No Patológicos y Epidemiológicos */}
        <div className="bg-[#07132B] border border-blue-900/60 rounded-xl p-4 sm:p-5 space-y-3">
          <div className="flex items-center gap-2 text-sky-300 text-sm font-semibold border-b border-blue-900/60 pb-2">
            <Home className="w-4 h-4 text-sky-400 shrink-0" />
            <span>Antecedentes No Patológicos & Epidemiología</span>
          </div>
          {background.nonPathological && background.nonPathological.length > 0 ? (
            <ul className="space-y-2 text-xs sm:text-sm text-blue-100">
              {background.nonPathological.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-blue-400 font-bold">·</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-blue-300/70 italic">No se refieren exposiciones relevantes.</p>
          )}
        </div>

        {/* Antecedentes Heredofamiliares */}
        <div className="bg-[#07132B] border border-blue-900/60 rounded-xl p-4 sm:p-5 space-y-3">
          <div className="flex items-center gap-2 text-blue-200 text-sm font-semibold border-b border-blue-900/60 pb-2">
            <Users className="w-4 h-4 text-blue-400 shrink-0" />
            <span>Antecedentes Heredofamiliares</span>
          </div>
          {background.family && background.family.length > 0 ? (
            <ul className="space-y-2 text-xs sm:text-sm text-blue-100">
              {background.family.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-blue-400 font-bold">·</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-blue-300/70 italic">Sin antecedentes familiares de relevancia referidos.</p>
          )}
        </div>

        {/* Antecedentes Quirúrgicos */}
        <div className="bg-[#07132B] border border-blue-900/60 rounded-xl p-4 sm:p-5 space-y-3">
          <div className="flex items-center gap-2 text-blue-200 text-sm font-semibold border-b border-blue-900/60 pb-2">
            <Scissors className="w-4 h-4 text-blue-400 shrink-0" />
            <span>Antecedentes Quirúrgicos y Traumáticos</span>
          </div>
          {background.surgical && background.surgical.length > 0 ? (
            <ul className="space-y-2 text-xs sm:text-sm text-blue-100">
              {background.surgical.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-blue-400 font-bold">·</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-blue-300/70 italic">Niega intervenciones quirúrgicas previas.</p>
          )}
        </div>

        {/* Medicación Actual */}
        <div className="bg-[#07132B] border border-blue-900/60 rounded-xl p-4 sm:p-5 space-y-3">
          <div className="flex items-center gap-2 text-white text-sm font-semibold border-b border-blue-900/60 pb-2">
            <Pill className="w-4 h-4 text-blue-400 shrink-0" />
            <span>Medicamentos Habituales y Automedicación</span>
          </div>
          {background.currentMedications && background.currentMedications.length > 0 ? (
            <ul className="space-y-2 text-xs sm:text-sm text-blue-100">
              {background.currentMedications.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-blue-400 font-bold">·</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-blue-300/70 italic">Niega consumo habitual de fármacos.</p>
          )}
        </div>

        {/* Alergias Medicamentosas */}
        <div className="bg-[#07132B] border border-blue-900/60 rounded-xl p-4 sm:p-5 space-y-3">
          <div className="flex items-center gap-2 text-rose-400 text-sm font-semibold border-b border-blue-900/60 pb-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>Alergias Medicamentosas & Reacciones Adversas</span>
          </div>
          {background.allergies && background.allergies.length > 0 ? (
            <ul className="space-y-2 text-xs sm:text-sm text-blue-100">
              {background.allergies.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">!</span>
                  <span className="font-medium text-rose-200">{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-blue-300/70 italic">Sin alergias conocidas.</p>
          )}
        </div>
      </div>
    </div>
  );
};
