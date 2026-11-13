import React from 'react';
import { ClinicalCase } from '../types/clinical';
import { FileText, ShieldAlert, Pill, Scissors, Users, Home, AlertCircle } from 'lucide-react';

interface BackgroundTabProps {
  caseData: ClinicalCase;
}

export const BackgroundTab: React.FC<BackgroundTabProps> = ({ caseData }) => {
  const { background } = caseData;

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
          Revisión minuciosa de la historia médica previa, factores de riesgo epidemiológicos, antecedentes familiares y régimen farmacológico actual.
        </p>
      </div>

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
