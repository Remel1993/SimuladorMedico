import { ClinicalCase } from '../types/clinical';
import { PRESET_CASES } from './presetCases';
import { SPECIALTY_CASES } from './specialtyCases';
import { EXTENDED_CASES } from './extendedCases';

/**
 * Biblioteca unificada de todos los casos clínicos curados (25 casos).
 */
export const ALL_CURATED_CASES: ClinicalCase[] = [
  ...PRESET_CASES,
  ...SPECIALTY_CASES,
  ...EXTENDED_CASES,
];
