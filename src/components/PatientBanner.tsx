import React from 'react';
import { ClinicalCase } from '../types/clinical';
import { User, AlertTriangle, Pill, Clock } from 'lucide-react';

interface PatientBannerProps {
  caseData: ClinicalCase;
  revealSpecialty?: boolean;
}

const SPECIALTY_NAMES: Record<string, string> = {
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

const MODE_NAMES: Record<string, string> = {
  principiante: 'Principiante',
  medico_general: 'Médico General',
  residente: 'Residente',
  urgencias: 'Urgencias',
  examen: 'Modo Examen',
};

export const PatientBanner: React.FC<PatientBannerProps> = ({ caseData, revealSpecialty = false }) => {
  const { patientInfo, background } = caseData;
  const hasAllergies =
    background.allergies &&
    background.allergies.length > 0 &&
    !background.allergies[0].toLowerCase().includes('sin alergias');

  return (
    <div className="bg-[#050D21] border-b border-blue-900/60">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3.5 sm:py-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4">
          {/* Patient Core Identity */}
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#0A1A3A] border border-blue-700/60 flex items-center justify-center text-blue-300 shrink-0 mt-0.5">
              <User className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                  {patientInfo.name}
                </h1>
                <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs text-blue-200/80 font-medium">
                  <span aria-hidden="true">·</span>
                  <span>{patientInfo.age} años</span>
                  <span aria-hidden="true">·</span>
                  <span>{patientInfo.sex}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-white/90">{patientInfo.occupation}</span>
                </div>
              </div>

              {/* Chief complaint, Evolution & Area/Mode */}
              <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-blue-100">
                <span className="font-semibold text-blue-300">Motivo de consulta:</span>
                <span className="text-white">{patientInfo.consultReason}</span>
                <span aria-hidden="true" className="text-blue-700 hidden sm:inline">
                  ·
                </span>
                <span className="inline-flex items-center gap-1 text-blue-200/80">
                  <Clock className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  {patientInfo.evolutionTime}
                </span>
                <span aria-hidden="true" className="text-blue-700">
                  ·
                </span>
                <span className="text-sky-300 font-semibold">
                  {revealSpecialty
                    ? `${SPECIALTY_NAMES[caseData.specialty] || caseData.specialty} (${MODE_NAMES[caseData.mode] || caseData.mode})`
                    : `Modo ${MODE_NAMES[caseData.mode] || caseData.mode}`}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Clinical Background Indicators */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            {hasAllergies ? (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950/60 border border-rose-600/70 text-rose-100 max-w-full">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span className="font-semibold text-[11px] uppercase tracking-wide text-rose-300 shrink-0">
                  Alergia:
                </span>
                <span className="font-medium break-words">{background.allergies.join(', ')}</span>
              </div>
            ) : (
              <div className="text-blue-200/80 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#07132B] border border-blue-900/60">
                <span className="text-blue-300">Alergias:</span>
                <span className="text-white font-medium">Sin alergias conocidas</span>
              </div>
            )}

            {background.currentMedications && background.currentMedications.length > 0 && (
              <div className="hidden sm:flex items-center gap-1.5 text-blue-200/80 border-l border-blue-900/70 pl-3">
                <Pill className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span className="text-blue-300">Fármacos:</span>
                <span
                  className="text-white max-w-xs truncate"
                  title={background.currentMedications.join(' · ')}
                >
                  {background.currentMedications.join(' · ')}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
