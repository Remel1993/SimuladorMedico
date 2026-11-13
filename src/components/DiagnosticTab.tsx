import React, { useState } from 'react';
import { Target, Plus, Trash2, Brain, AlertCircle, ArrowRight } from 'lucide-react';

interface DiagnosticTabProps {
  primaryDiagnosis: string;
  setPrimaryDiagnosis: (val: string) => void;
  differentialDiagnoses: string[];
  setDifferentialDiagnoses: (val: string[]) => void;
  clinicalJustification: string;
  setClinicalJustification: (val: string) => void;
  additionalStudiesNeeded: string;
  setAdditionalStudiesNeeded: (val: string) => void;
  onProceedToTreatment: () => void;
}

export const DiagnosticTab: React.FC<DiagnosticTabProps> = ({
  primaryDiagnosis,
  setPrimaryDiagnosis,
  differentialDiagnoses,
  setDifferentialDiagnoses,
  clinicalJustification,
  setClinicalJustification,
  additionalStudiesNeeded,
  setAdditionalStudiesNeeded,
  onProceedToTreatment,
}) => {
  const [newDiffText, setNewDiffText] = useState('');

  const handleAddDifferential = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newDiffText.trim()) return;
    setDifferentialDiagnoses([...differentialDiagnoses, newDiffText.trim()]);
    setNewDiffText('');
  };

  const handleRemoveDifferential = (index: number) => {
    setDifferentialDiagnoses(differentialDiagnoses.filter((_, idx) => idx !== index));
  };

  const isFormComplete =
    primaryDiagnosis.trim().length > 3 &&
    differentialDiagnoses.length >= 1 &&
    clinicalJustification.trim().length > 10;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Intro Card */}
      <div className="bg-[#07132B] border border-blue-900/60 rounded-xl p-4 sm:p-5 shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <Brain className="w-5 h-5 text-blue-400 shrink-0" />
          <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
            Razonamiento Diagnóstico & Diferenciales
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-blue-100/80 leading-relaxed">
          Sintetice los datos obtenidos del interrogatorio, exploración física y paraclínicos para fundamentar su diagnóstico principal y descartar patologías competidoras.
        </p>
      </div>

      <div className="space-y-4 sm:space-y-5">
        {/* Diagnóstico Principal */}
        <div className="bg-[#07132B] border border-blue-900/60 rounded-xl p-4 sm:p-5 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-blue-300 flex items-center gap-1.5">
              <Target className="w-4 h-4 text-blue-400 shrink-0" />
              <span>1. Diagnóstico Principal Presuntivo o Definitivo *</span>
            </label>
            <span className="text-[11px] text-blue-300/80 font-medium">Puntaje: 25 pts</span>
          </div>
          <input
            type="text"
            value={primaryDiagnosis}
            onChange={(e) => setPrimaryDiagnosis(e.target.value)}
            placeholder="Escriba el diagnóstico presuntivo o definitivo formulado..."
            className="w-full bg-[#040B1B] border border-blue-900/70 rounded-lg px-3.5 sm:px-4 py-3 text-xs sm:text-sm text-white placeholder-blue-300/45 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
          />
          <p className="text-[11px] text-blue-300/75 italic">
            Especifique el diagnóstico con la mayor precisión clínica posible (incluya subtipo, severidad o fase si corresponde).
          </p>
        </div>

        {/* Diagnósticos Diferenciales */}
        <div className="bg-[#07132B] border border-blue-900/60 rounded-xl p-4 sm:p-5 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-blue-300">
              2. Diagnósticos Diferenciales (Mín. 2 recomendados) *
            </label>
            <span className="text-[11px] text-blue-300/80 font-medium">Puntaje: 10 pts</span>
          </div>

          {differentialDiagnoses.length > 0 ? (
            <div className="space-y-2">
              {differentialDiagnoses.map((diff, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-3 bg-[#040B1B] px-3.5 py-2.5 rounded-lg border border-blue-900/70 text-xs sm:text-sm text-white"
                >
                  <span className="flex items-center gap-2 min-w-0">
                    <span className="text-blue-400 font-bold font-mono shrink-0">#{index + 1}</span>
                    <span className="break-words">{diff}</span>
                  </span>
                  <button
                    onClick={() => handleRemoveDifferential(index)}
                    className="text-blue-300/70 hover:text-rose-400 transition-colors p-1 shrink-0 cursor-pointer"
                    title="Eliminar diagnóstico diferencial"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-blue-300/70 italic p-3 bg-[#040B1B] rounded-lg border border-blue-900/60">
              Aún no ha agregado diagnósticos diferenciales. Agregue al menos 2 diagnósticos competidores.
            </div>
          )}

          {/* Add Differential Input Form */}
          <form onSubmit={handleAddDifferential} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2">
            <input
              type="text"
              value={newDiffText}
              onChange={(e) => setNewDiffText(e.target.value)}
              placeholder="Escriba un diagnóstico diferencial a descartar..."
              className="flex-1 min-w-0 bg-[#040B1B] border border-blue-900/70 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-blue-300/45 focus:outline-none focus:border-blue-400"
            />
            <button
              type="submit"
              disabled={!newDiffText.trim()}
              className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5 shrink-0" />
              <span>Agregar Diferencial</span>
            </button>
          </form>
        </div>

        {/* Justificación Clínica & Razonamiento */}
        <div className="bg-[#07132B] border border-blue-900/60 rounded-xl p-4 sm:p-5 space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-blue-300 block">
            3. Justificación Clínica y Razonamiento Fisiopatológico *
          </label>
          <textarea
            rows={4}
            value={clinicalJustification}
            onChange={(e) => setClinicalJustification(e.target.value)}
            placeholder="Fundamente su razonamiento clínico integrando los hallazgos del interrogatorio, signos y maniobras del examen físico, paraclínicos y la fisiopatología que descarta los diagnósticos diferenciales..."
            className="w-full bg-[#040B1B] border border-blue-900/70 rounded-lg p-3.5 text-xs sm:text-sm text-white placeholder-blue-300/45 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
          />
          <p className="text-[11px] text-blue-300/75 italic">
            El tribunal evaluará la calidad analítica de su razonamiento, no solo la coincidencia del nombre del diagnóstico.
          </p>
        </div>

        {/* Estudios Adicionales */}
        <div className="bg-[#07132B] border border-blue-900/60 rounded-xl p-4 sm:p-5 space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-blue-300 block">
            4. Estudios Adicionales de Monitoreo o Confirmación (Opcional)
          </label>
          <textarea
            rows={2}
            value={additionalStudiesNeeded}
            onChange={(e) => setAdditionalStudiesNeeded(e.target.value)}
            placeholder="Indique paraclínicos de seguimiento o estudios de extensión que solicitaría a continuación..."
            className="w-full bg-[#040B1B] border border-blue-900/70 rounded-lg p-3.5 text-xs sm:text-sm text-white placeholder-blue-300/45 focus:outline-none focus:border-blue-400"
          />
        </div>

        {/* Next step button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          {!isFormComplete && (
            <div className="flex items-start sm:items-center gap-1.5 text-xs text-amber-300">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 sm:mt-0" />
              <span>Complete el diagnóstico principal, al menos 1 diferencial y la justificación para avanzar.</span>
            </div>
          )}

          <div className="w-full sm:w-auto sm:ml-auto">
            <button
              onClick={onProceedToTreatment}
              disabled={!isFormComplete}
              className="w-full sm:w-auto px-5 py-3 bg-white hover:bg-blue-100 disabled:opacity-40 disabled:pointer-events-none text-[#030A1C] rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
            >
              <span>Continuar a Tratamiento & Conducta</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
