import { ClinicalCase } from '../types/clinical';
import { PRESET_CASES } from './presetCases';
import { SPECIALTY_CASES } from './specialtyCases';
import { EXTENDED_CASES } from './extendedCases';
import { EXTRA_CASES } from './extraCases';
import { OUTPATIENT_CASES } from './outpatientCases';

/**
 * Biblioteca unificada de todos los casos clínicos curados (70 casos).
 */
export const ALL_CURATED_CASES: ClinicalCase[] = [
  ...PRESET_CASES,
  ...SPECIALTY_CASES,
  ...EXTENDED_CASES,
  ...EXTRA_CASES,
  ...OUTPATIENT_CASES,
];
