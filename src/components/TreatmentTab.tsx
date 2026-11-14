import React, { useState } from 'react';
import { Pill, Plus, Trash2, Hospital, Stethoscope, AlertTriangle, Send, Sparkles } from 'lucide-react';
import { MedicationItem } from '../types/clinical';

interface TreatmentTabProps {
  medications: MedicationItem[];
  setMedications: (meds: MedicationItem[]) => void;
  generalMeasures: string;
  setGeneralMeasures: (val: string) => void;
  hospitalizationDecision: string;
  setHospitalizationDecision: (val: string) => void;
  referralCriteria: string;
  setReferralCriteria: (val: string) => void;
  followUpPlan: string;
  setFollowUpPlan: (val: string) => void;
  onFinishCase: (pendingDraft?: MedicationItem) => Promise<void>;
  isEvaluating: boolean;
}

export const TreatmentTab: React.FC<TreatmentTabProps> = ({
  medications,
  setMedications,
  generalMeasures,
  setGeneralMeasures,
  hospitalizationDecision,
  setHospitalizationDecision,
  referralCriteria,
  setReferralCriteria,
  followUpPlan,
  setFollowUpPlan,
  onFinishCase,
  isEvaluating,
}) => {
  const [newDrug, setNewDrug] = useState('');
  const [newDose, setNewDose] = useState('');
  const [newRoute, setNewRoute] = useState('Intravenosa (IV)');
  const [newFrequency, setNewFrequency] = useState('Cada 8 horas');
  const [newDuration, setNewDuration] = useState('Fase aguda / 48 horas');

  const handleAddMedication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDrug.trim()) return;

    const newItem: MedicationItem = {
      id: `med-${Date.now()}`,
      drug: newDrug.trim(),
      dose: newDose.trim() || 'Dosis terapéutica estándar',
      route: newRoute,
      frequency: newFrequency,
      duration: newDuration,
    };

    setMedications([...medications, newItem]);
    setNewDrug('');
    setNewDose('');
  };

  const handleRemoveMedication = (id: string) => {
    setMedications(medications.filter((m) => m.id !== id));
  };

  const handleFinishWithPendingDraft = async () => {
    let pendingDraft: MedicationItem | undefined;
    if (newDrug.trim()) {
      pendingDraft = {
        id: `med-${Date.now()}`,
        drug: newDrug.trim(),
        dose: newDose.trim() || 'Dosis terapéutica estándar',
        route: newRoute,
        frequency: newFrequency,
        duration: newDuration,
      };
      setMedications([...medications, pendingDraft]);
      setNewDrug('');
      setNewDose('');
    }
    await onFinishCase(pendingDraft);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Intro Card */}
      <div className="bg-[#07132B] border border-blue-900/60 rounded-xl p-4 sm:p-5 shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <Stethoscope className="w-5 h-5 text-blue-400 shrink-0" />
          <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
            Plan Terapéutico Integral & Conducta Médica
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-blue-100/80 leading-relaxed">
          Establezca el régimen farmacológico específico (fármacos, dosis, vías, frecuencias), las medidas generales de soporte, el nivel de hospitalización y los criterios de referencia según guías clínicas vigentes.
        </p>
      </div>

      {/* 1. Tratamiento Farmacológico Dinámico */}
      <div className="bg-[#07132B] border border-blue-900/60 rounded-xl p-4 sm:p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-blue-900/60 pb-3">
          <label className="text-xs font-bold uppercase tracking-wider text-blue-300 flex items-center gap-2">
            <Pill className="w-4 h-4 text-blue-400 shrink-0" />
            <span>1. Tratamiento Farmacológico Propuesto *</span>
          </label>
          <span className="text-[11px] text-blue-300/80 font-medium">Puntaje: 15 pts</span>
        </div>

        {/* Medications: Mobile Cards + Desktop Table */}
        {medications.length > 0 ? (
          <>
            <div className="md:hidden space-y-2.5">
              {medications.map((med) => (
                <div
                  key={med.id}
                  className="bg-[#040B1B] border border-blue-900/70 rounded-xl p-3.5 space-y-1.5 text-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-white text-sm">
                      {med.drug}
                      {med.id.startsWith('med-stat-') && (
                        <span className="ml-2 text-[10px] font-bold uppercase text-amber-300">
                          · Aplicado STAT
                        </span>
                      )}
                    </span>
                    <button
                      onClick={() => handleRemoveMedication(med.id)}
                      className="text-blue-300/70 hover:text-rose-400 p-1 shrink-0 cursor-pointer"
                      title="Eliminar fármaco"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 text-[11px] pt-1">
                    <div>
                      <span className="text-blue-300/80">Dosis: </span>
                      <span className="text-white font-medium">{med.dose}</span>
                    </div>
                    <div>
                      <span className="text-blue-300/80">Vía: </span>
                      <span className="text-sky-300 font-medium">{med.route}</span>
                    </div>
                    <div>
                      <span className="text-blue-300/80">Frecuencia: </span>
                      <span className="text-white">{med.frequency}</span>
                    </div>
                    <div>
                      <span className="text-blue-300/80">Duración: </span>
                      <span className="text-blue-100">{med.duration}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-blue-900/70 text-blue-300 uppercase text-[10px] font-semibold tracking-wider">
                    <th className="py-2.5 px-3">Fármaco / Principio Activo</th>
                    <th className="py-2.5 px-3">Dosis</th>
                    <th className="py-2.5 px-3">Vía</th>
                    <th className="py-2.5 px-3">Frecuencia</th>
                    <th className="py-2.5 px-3">Duración</th>
                    <th className="py-2.5 px-3 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-900/50 font-sans">
                  {medications.map((med) => (
                    <tr key={med.id} className="hover:bg-[#040B1B]/60">
                      <td className="py-3 px-3 font-semibold text-white">
                        {med.drug}
                        {med.id.startsWith('med-stat-') && (
                          <span className="ml-2 text-[10px] font-bold uppercase text-amber-300">
                            · STAT
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-blue-100">{med.dose}</td>
                      <td className="py-3 px-3 text-sky-300">{med.route}</td>
                      <td className="py-3 px-3 text-blue-100">{med.frequency}</td>
                      <td className="py-3 px-3 text-blue-200/80">{med.duration}</td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => handleRemoveMedication(med.id)}
                          className="text-blue-300/70 hover:text-rose-400 p-1 transition-colors cursor-pointer"
                          title="Eliminar fármaco"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="text-xs text-blue-200/70 italic p-4 bg-[#040B1B] rounded-lg border border-blue-900/60">
            No se han agregado fármacos al esquema. Utilice el formulario inferior para recetar soluciones, analgésicos, antibióticos o medicamentos específicos.
          </div>
        )}

        {/* Add Medication Form */}
        <form
          onSubmit={handleAddMedication}
          className="bg-[#040B1B] p-3.5 sm:p-4 rounded-xl border border-blue-900/70 space-y-3"
        >
          <div className="text-[11px] font-bold uppercase tracking-wider text-blue-300">
            Prescribir Nuevo Fármaco o Infusión:
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div>
              <label className="text-[10px] text-blue-200/80 block mb-1">Nombre del Medicamento *</label>
              <input
                type="text"
                value={newDrug}
                onChange={(e) => setNewDrug(e.target.value)}
                placeholder="Fármaco o solución..."
                className="w-full bg-[#07132B] border border-blue-900/70 rounded-lg px-3 py-2.5 text-xs text-white placeholder-blue-300/45 focus:outline-none focus:border-blue-400"
              />
            </div>

            <div>
              <label className="text-[10px] text-blue-200/80 block mb-1">Dosis Exacta *</label>
              <input
                type="text"
                value={newDose}
                onChange={(e) => setNewDose(e.target.value)}
                placeholder="Dosis (mg, g, mL/kg/h)..."
                className="w-full bg-[#07132B] border border-blue-900/70 rounded-lg px-3 py-2.5 text-xs text-white placeholder-blue-300/45 focus:outline-none focus:border-blue-400"
              />
            </div>

            <div>
              <label className="text-[10px] text-blue-200/80 block mb-1">Vía de Administración</label>
              <select
                value={newRoute}
                onChange={(e) => setNewRoute(e.target.value)}
                className="w-full bg-[#07132B] border border-blue-900/70 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-400"
              >
                <option value="Intravenosa (IV)">Intravenosa (IV)</option>
                <option value="Oral (VO)">Oral (VO)</option>
                <option value="Subcutánea (SC)">Subcutánea (SC)</option>
                <option value="Inhalatoria">Inhalatoria</option>
                <option value="Intramuscular (IM)">Intramuscular (IM)</option>
                <option value="Sublingual (SL)">Sublingual (SL)</option>
                <option value="Tópica">Tópica</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-blue-200/80 block mb-1">Frecuencia</label>
              <input
                type="text"
                value={newFrequency}
                onChange={(e) => setNewFrequency(e.target.value)}
                placeholder="Ej. c/8h, infusión..."
                className="w-full bg-[#07132B] border border-blue-900/70 rounded-lg px-3 py-2.5 text-xs text-white placeholder-blue-300/45 focus:outline-none focus:border-blue-400"
              />
            </div>

            <div>
              <label className="text-[10px] text-blue-200/80 block mb-1">Duración</label>
              <input
                type="text"
                value={newDuration}
                onChange={(e) => setNewDuration(e.target.value)}
                placeholder="Duración del esquema..."
                className="w-full bg-[#07132B] border border-blue-900/70 rounded-lg px-3 py-2.5 text-xs text-white placeholder-blue-300/45 focus:outline-none focus:border-blue-400"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
            {newDrug.trim() ? (
              <span className="text-[11px] text-amber-300">
                Borrador detectado: se agregará automáticamente al esquema al enviar si aún no pulsó «Agregar».
              </span>
            ) : (
              <span />
            )}
            <button
              type="submit"
              disabled={!newDrug.trim()}
              className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4 shrink-0" />
              <span>Agregar al Esquema</span>
            </button>
          </div>
        </form>
      </div>

      {/* 2. Medidas Generales y de Soporte */}
      <div className="bg-[#07132B] border border-blue-900/60 rounded-xl p-4 sm:p-5 space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-blue-300 block">
          2. Medidas Generales y de Soporte (No farmacológicas) *
        </label>
        <textarea
          rows={3}
          value={generalMeasures}
          onChange={(e) => setGeneralMeasures(e.target.value)}
          placeholder="Especifique medidas no farmacológicas, monitorización, dieta o ayuno, posición del paciente y cuidados generales..."
          className="w-full bg-[#040B1B] border border-blue-900/70 rounded-lg p-3 text-xs sm:text-sm text-white placeholder-blue-300/45 focus:outline-none focus:border-blue-400"
        />
      </div>

      {/* 3. Nivel de Atención / Destino Clínico (sin pistas) */}
      <div className="bg-[#07132B] border border-blue-900/60 rounded-xl p-4 sm:p-5 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-blue-300 flex items-center gap-2">
            <Hospital className="w-4 h-4 text-blue-400 shrink-0" />
            <span>3. Conducta y Destino Clínico *</span>
          </label>
          <span className="text-[11px] text-blue-300/80 font-medium">
            {hospitalizationDecision ? '3 pts de destino (5 pts total con ref./seguimiento)' : 'Seleccione una opción · 3 pts'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 sm:gap-3">
          {[
            {
              id: 'Ambulatorio',
              label: 'Manejo Ambulatorio',
            },
            {
              id: 'Observación Urgencias',
              label: 'Observación Urgencias',
            },
            {
              id: 'Hospitalización en Sala',
              label: 'Hospitalización en Sala',
            },
            {
              id: 'Quirófano / Cirugía de Urgencia',
              label: 'Quirófano / Cirugía de Urgencia',
            },
            {
              id: 'Unidad de Cuidados Intensivos (UCI)',
              label: 'Unidad de Cuidados Intensivos (UCI)',
            },
          ].map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setHospitalizationDecision(opt.id)}
              className={`p-3.5 rounded-xl border text-center sm:text-left flex items-center justify-center sm:justify-start transition-all cursor-pointer ${
                hospitalizationDecision === opt.id
                  ? 'bg-blue-600/25 border-blue-400 text-white shadow-sm ring-1 ring-blue-400/40'
                  : 'bg-[#040B1B] border-blue-900/70 text-blue-200 hover:border-blue-700'
              }`}
            >
              <div className="text-xs font-bold text-white">{opt.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 4. Criterios de Referencia y Seguimiento */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
        <div className="bg-[#07132B] border border-blue-900/60 rounded-xl p-4 sm:p-5 space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-blue-300 block">
            4. Criterios de Referencia / Interconsulta
          </label>
          <textarea
            rows={3}
            value={referralCriteria}
            onChange={(e) => setReferralCriteria(e.target.value)}
            placeholder="Indique criterios de gravedad para interconsulta especializada o derivación de urgencia..."
            className="w-full bg-[#040B1B] border border-blue-900/70 rounded-lg p-3 text-xs text-white placeholder-blue-300/45 focus:outline-none focus:border-blue-400"
          />
        </div>

        <div className="bg-[#07132B] border border-blue-900/60 rounded-xl p-4 sm:p-5 space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-blue-300 block">
            5. Plan de Seguimiento y Criterios de Alta
          </label>
          <textarea
            rows={3}
            value={followUpPlan}
            onChange={(e) => setFollowUpPlan(e.target.value)}
            placeholder="Describa los parámetros de vigilancia clínica y metas de respuesta terapéutica esperada..."
            className="w-full bg-[#040B1B] border border-blue-900/70 rounded-lg p-3 text-xs text-white placeholder-blue-300/45 focus:outline-none focus:border-blue-400"
          />
        </div>
      </div>

      {/* Safety alert warning */}
      <div className="bg-amber-950/30 border border-amber-600/50 rounded-xl p-4 flex items-start gap-3 text-xs text-amber-100">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-amber-300">Auditoría de Seguridad del Paciente:</span>
          <p className="mt-0.5 text-blue-100/85 leading-relaxed">
            Al enviar el caso para evaluación, el tribunal docente contrastará su plan con la normativa nacional (MINSA / LBM) y guías internacionales vigentes (OMS, OPS, AHA, NICE), e inspeccionará posibles errores peligrosos.
          </p>
        </div>
      </div>

      {/* Primary Submit Action */}
      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={() => void handleFinishWithPendingDraft()}
          disabled={isEvaluating}
          className="w-full sm:w-auto px-5 py-3.5 bg-white hover:bg-blue-100 disabled:opacity-50 text-[#030A1C] font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center text-center gap-2 shadow-lg transition-all cursor-pointer"
        >
          {isEvaluating ? (
            <>
              <Sparkles className="w-5 h-5 animate-spin text-blue-700 shrink-0" />
              <span>Evaluando Caso y Puntuación (100 Pts)...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4 text-blue-700 shrink-0" />
              <span>Finalizar y Evaluar (100 Puntos)</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
