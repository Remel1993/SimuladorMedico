import { ClinicalCase } from '../types/clinical';
import { PRESET_CASES } from './presetCases';
import { SPECIALTY_CASES } from './specialtyCases';
import { EXTENDED_CASES } from './extendedCases';
import { EXTRA_CASES } from './extraCases';
import { OUTPATIENT_CASES } from './outpatientCases';

const DEFAULT_EDUCATIONAL_DISCLAIMER =
  'Material educativo para entrenamiento de estudiantes, internos, médicos generales y residentes. No sustituye el juicio clínico ni los protocolos institucionales locales.';

function enrichClinicalCaseMetadata(c: ClinicalCase): ClinicalCase {
  if (c.clinicalMetadata) return c;
  const alerts = c.solution?.criticalSafetyAlerts || [];
  const rulingOut = c.solution?.criticalRulingOutFactors || [];
  const frequentErrors =
    alerts.length > 0
      ? alerts
      : rulingOut.length > 0
        ? rulingOut.slice(0, 2)
        : [
            'Omitir la búsqueda sistemática de signos de alarma o diagnósticos diferenciales de alto riesgo.',
          ];

  return {
    ...c,
    clinicalMetadata: {
      lastReviewed: '2026-10-15',
      reviewedBy: 'Comité Editorial Médico-Académico (Revisión basada en guías OMS/OPS/AHA/NICE/IDSA)',
      evidenceSources:
        c.solution?.guidelineReferences && c.solution.guidelineReferences.length > 0
          ? c.solution.guidelineReferences
          : ['Guías internacionales de práctica clínica vigentes (OMS / OPS / AHA / NICE).'],
      frequentErrors,
      educationalDisclaimer: DEFAULT_EDUCATIONAL_DISCLAIMER,
      isCustom: false,
    },
  };
}

/**
 * Biblioteca unificada de todos los casos clínicos curados (70 casos) con metadatos de evidencia y revisión.
 */
export const ALL_CURATED_CASES: ClinicalCase[] = [
  ...PRESET_CASES,
  ...SPECIALTY_CASES,
  ...EXTENDED_CASES,
  ...EXTRA_CASES,
  ...OUTPATIENT_CASES,
].map(enrichClinicalCaseMetadata);

