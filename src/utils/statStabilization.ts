import {
  ClinicalCase,
  MedicationItem,
  StatEffectSeverity,
  StatInterventionRecord,
  StatVitalDelta,
  VitalSigns,
} from '../types/clinical';

export interface StatPreset {
  id: string;
  category: 'Vía Aérea / O₂' | 'Hemodinamia / Líquidos' | 'Cardio / Crisis' | 'Metabólico / Síntomas';
  label: string;
  drug: string;
  dose: string;
  route: string;
  frequency: string;
  duration: string;
}

export const STAT_QUICK_PRESETS: StatPreset[] = [
  {
    id: 'stat-o2',
    category: 'Vía Aérea / O₂',
    label: 'Oxígeno',
    drug: 'Oxígeno suplementario',
    dose: '6 L/min',
    route: 'Inhalatoria',
    frequency: 'Continuo STAT',
    duration: 'Hasta SpO₂ meta',
  },
  {
    id: 'stat-salbutamol',
    category: 'Vía Aérea / O₂',
    label: 'Salbutamol NBZ',
    drug: 'Salbutamol',
    dose: '5 mg',
    route: 'Inhalatoria',
    frequency: 'STAT nebulizado',
    duration: 'Fase aguda',
  },
  {
    id: 'stat-corticoide',
    category: 'Vía Aérea / O₂',
    label: 'Hidrocortisona IV',
    drug: 'Hidrocortisona',
    dose: '200 mg',
    route: 'Intravenosa (IV)',
    frequency: 'Dosis única STAT',
    duration: 'Fase aguda',
  },
  {
    id: 'stat-ssn',
    category: 'Hemodinamia / Líquidos',
    label: 'Bolo SSN 0.9%',
    drug: 'Solución Salina Normal 0.9%',
    dose: '500 mL',
    route: 'Intravenosa (IV)',
    frequency: 'Bolo STAT',
    duration: 'Reanimación inicial',
  },
  {
    id: 'stat-adrenalina',
    category: 'Hemodinamia / Líquidos',
    label: 'Adrenalina IM',
    drug: 'Adrenalina (Epinefrina)',
    dose: '0.5 mg',
    route: 'Intramuscular (IM)',
    frequency: 'Dosis STAT muslo anterolateral',
    duration: 'Emergencia',
  },
  {
    id: 'stat-furosemida',
    category: 'Hemodinamia / Líquidos',
    label: 'Furosemida IV',
    drug: 'Furosemida',
    dose: '40 mg',
    route: 'Intravenosa (IV)',
    frequency: 'Bolo lento STAT',
    duration: 'Fase aguda',
  },
  {
    id: 'stat-labetalol',
    category: 'Cardio / Crisis',
    label: 'Labetalol IV',
    drug: 'Labetalol',
    dose: '20 mg',
    route: 'Intravenosa (IV)',
    frequency: 'Bolo lento STAT',
    duration: 'Control crisis HTA',
  },
  {
    id: 'stat-hidralazina',
    category: 'Cardio / Crisis',
    label: 'Hidralazina IV',
    drug: 'Hidralazina',
    dose: '5 mg',
    route: 'Intravenosa (IV)',
    frequency: 'Bolo lento STAT',
    duration: 'Control crisis HTA',
  },
  {
    id: 'stat-ntg',
    category: 'Cardio / Crisis',
    label: 'Nitroglicerina SL',
    drug: 'Nitroglicerina',
    dose: '0.4 mg',
    route: 'Sublingual (SL)',
    frequency: 'STAT (valorar PA previa)',
    duration: 'Fase aguda',
  },
  {
    id: 'stat-asa',
    category: 'Cardio / Crisis',
    label: 'Aspirina (ASA)',
    drug: 'Ácido Acetilsalicílico (Aspirina)',
    dose: '300 mg',
    route: 'Oral (VO)',
    frequency: 'Dosis de carga masticable',
    duration: 'Dosis única inicial',
  },
  {
    id: 'stat-dextrosa',
    category: 'Metabólico / Síntomas',
    label: 'Dextrosa 50% IV',
    drug: 'Dextrosa al 50%',
    dose: '25 g',
    route: 'Intravenosa (IV)',
    frequency: 'Bolo STAT',
    duration: 'Corrección inmediata',
  },
  {
    id: 'stat-insulina',
    category: 'Metabólico / Síntomas',
    label: 'Insulina Cristalina IV',
    drug: 'Insulina Cristalina (Regular)',
    dose: '6 UI',
    route: 'Intravenosa (IV)',
    frequency: 'Bolo / infusión STAT',
    duration: 'Control glucémico',
  },
  {
    id: 'stat-paracetamol',
    category: 'Metabólico / Síntomas',
    label: 'Paracetamol IV',
    drug: 'Paracetamol (Acetaminofén)',
    dose: '1000 mg',
    route: 'Intravenosa (IV)',
    frequency: 'Dosis STAT',
    duration: 'Control febril/dolor',
  },
  {
    id: 'stat-antiemetico',
    category: 'Metabólico / Síntomas',
    label: 'Ondansetrón IV',
    drug: 'Ondansetrón',
    dose: '4 mg',
    route: 'Intravenosa (IV)',
    frequency: 'Dosis STAT',
    duration: 'Control emético',
  },
  {
    id: 'stat-mgso4',
    category: 'Metabólico / Síntomas',
    label: 'Sulfato de Magnesio IV',
    drug: 'Sulfato de Magnesio',
    dose: '4 g',
    route: 'Intravenosa (IV)',
    frequency: 'Impregnación en 20 min',
    duration: 'Neuroprotección / broncodilatación',
  },
  {
    id: 'stat-benzodiazepina',
    category: 'Metabólico / Síntomas',
    label: 'Diazepam IV',
    drug: 'Diazepam',
    dose: '10 mg',
    route: 'Intravenosa (IV)',
    frequency: 'Dosis STAT lenta',
    duration: 'Yugulación crisis',
  },
  {
    id: 'stat-naloxona',
    category: 'Metabólico / Síntomas',
    label: 'Naloxona IV',
    drug: 'Naloxona',
    dose: '0.4 mg',
    route: 'Intravenosa (IV)',
    frequency: 'Rescate opioide STAT',
    duration: 'Reversión depresión SNC',
  },
  {
    id: 'stat-flumazenil',
    category: 'Metabólico / Síntomas',
    label: 'Flumazenil IV',
    drug: 'Flumazenil',
    dose: '0.2 mg',
    route: 'Intravenosa (IV)',
    frequency: 'Rescate benzodiacepina STAT',
    duration: 'Reversión sedación',
  },
  {
    id: 'stat-calcio',
    category: 'Cardio / Crisis',
    label: 'Gluconato de Calcio IV',
    drug: 'Gluconato de Calcio al 10%',
    dose: '1 g',
    route: 'Intravenosa (IV)',
    frequency: 'Bolo lento 3-5 min STAT',
    duration: 'Cardioprotección / hipermagnesemia',
  },
];

function norm(value: string): string {
  return (value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function parseBP(bp: string): { sys: number; dia: number } {
  const match = (bp || '').match(/(\d+)\s*\/\s*(\d+)/);
  if (!match) return { sys: 120, dia: 80 };
  return {
    sys: parseInt(match[1], 10),
    dia: parseInt(match[2], 10),
  };
}

function calcMAP(sys: number, dia: number): number {
  return Math.round(dia + (sys - dia) / 3);
}

function clamp(val: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, val));
}

export interface ParsedDose {
  mg: number | null;
  ml: number | null;
  ui: number | null;
  lpm: number | null;
  meq: number | null;
  puffs: number | null;
  percent: number | null;
  perKg: boolean;
}

/**
 * Normaliza separadores de miles ("1,000", "2,500") y decimales con coma ("0,5", "1,25")
 * sin destruir dosis en miles.
 */
function normalizeNumericSeparators(raw: string): string {
  let s = raw;
  // Quitar comas de miles reiteradas: 1,000,000 -> 1000000
  let prev = '';
  while (prev !== s) {
    prev = s;
    s = s.replace(/(\d),(\d{3})(?!\d)/g, '$1$2');
  }
  // Comas decimales europeas/latinas: 0,5 -> 0.5 | 1,25 -> 1.25
  s = s.replace(/(\d),(\d{1,2})(?!\d)/g, '$1.$2');
  return s;
}

/**
 * Extrae dosis numéricas reales de cadenas como "100 UI", "1,000 mg", "1.5 L",
 * "50 mcg", "40 mEq", "0.1 UI/kg/h", "10 L/min", "2 disparos", etc.
 */
export function parseNumericDose(doseStr: string, weightKg: number): ParsedDose {
  const clean = normalizeNumericSeparators(norm(doseStr));
  const empty: ParsedDose = {
    mg: null,
    ml: null,
    ui: null,
    lpm: null,
    meq: null,
    puffs: null,
    percent: null,
    perKg: false,
  };

  if (!clean) return empty;

  const perKgGlobal = /\/\s*kg\b/.test(clean);

  const extractUnitValue = (unitPattern: string): number | null => {
    const regex = new RegExp(
      `(\\d+(?:\\.\\d+)?)\\s*(?:(?:-|–|\\ba\\b)\\s*(\\d+(?:\\.\\d+)?))?\\s*(?:${unitPattern})(?:\\s*\\/\\s*kg)?\\b`,
      'i'
    );
    const m = clean.match(regex);
    if (!m) return null;
    const v1 = parseFloat(m[1]);
    const v2 = m[2] ? parseFloat(m[2]) : null;
    if (Number.isNaN(v1) || v1 <= 0) return null;
    const rawVal = v2 && !Number.isNaN(v2) && v2 >= v1 ? (v1 + v2) / 2 : v1;
    const isThisPerKg = new RegExp(
      `(?:${unitPattern})\\s*\\/\\s*kg\\b`,
      'i'
    ).test(m[0]);
    return isThisPerKg || (perKgGlobal && !clean.includes('peso')) ? rawVal * weightKg : rawVal;
  };

  const mcgVal = extractUnitValue('mcg|ug');
  const mgVal = extractUnitValue('mg');
  const gVal = extractUnitValue('g|gr|gramos?');
  const mlVal = extractUnitValue('ml|cc');
  const lpmVal = extractUnitValue('l\\s*\\/\\s*min|lpm|litros\\s*\\/\\s*min');
  const lVal = extractUnitValue('l|litros?');
  const uiVal = extractUnitValue('ui|u|unidades');
  const meqVal = extractUnitValue('meq|mmol');
  const puffsVal = extractUnitValue('puffs?|disparos?|inhalaciones?|atomizaciones?');
  const pctMatch = clean.match(/(\d+(?:\.\d+)?)\s*%/);
  const percent = pctMatch ? parseFloat(pctMatch[1]) : null;

  let mg: number | null = null;
  if (mgVal !== null) mg = mgVal;
  else if (gVal !== null) mg = gVal * 1000;
  else if (mcgVal !== null) mg = mcgVal / 1000;

  let ml: number | null = null;
  if (mlVal !== null) ml = mlVal;
  else if (lVal !== null && lpmVal === null) ml = lVal * 1000;

  const lpm = lpmVal ?? (lVal !== null ? lVal : null);

  if (
    mg !== null ||
    ml !== null ||
    uiVal !== null ||
    lpmVal !== null ||
    lVal !== null ||
    meqVal !== null ||
    puffsVal !== null
  ) {
    return {
      mg,
      ml,
      ui: uiVal,
      lpm,
      meq: meqVal,
      puffs: puffsVal,
      percent,
      perKg: perKgGlobal,
    };
  }

  // Sin unidad explícita (ej. el clínico escribió solo "100" o "20"): intentar número suelto
  const bareMatch = clean.match(/\b(\d+(?:\.\d+)?)\b/);
  if (bareMatch) {
    const rawVal = parseFloat(bareMatch[1]);
    if (!Number.isNaN(rawVal) && rawVal > 0 && percent === null) {
      const val = perKgGlobal ? rawVal * weightKg : rawVal;
      return {
        mg: val,
        ml: val,
        ui: val,
        lpm: val,
        meq: val,
        puffs: val,
        percent,
        perKg: perKgGlobal,
      };
    }
  }

  return { ...empty, percent };
}

function getEffectiveWeightKg(caseData: ClinicalCase, vitals: VitalSigns): number {
  if (vitals.weightKg && vitals.weightKg > 0) return vitals.weightKg;
  const age = caseData.patientInfo.age;
  if (age < 1) return 6;
  if (age < 12) return Math.max(8, age * 2 + 8);
  return 70;
}

function buildMetricDeltas(before: VitalSigns, after: VitalSigns): StatVitalDelta[] {
  const deltas: StatVitalDelta[] = [];
  const bpBefore = parseBP(before.bloodPressure);
  const bpAfter = parseBP(after.bloodPressure);

  if (bpBefore.sys !== bpAfter.sys || bpBefore.dia !== bpAfter.dia) {
    const sysDiff = bpAfter.sys - bpBefore.sys;
    const diaDiff = bpAfter.dia - bpBefore.dia;
    const signSys = sysDiff >= 0 ? `+${sysDiff}` : `${sysDiff}`;
    const signDia = diaDiff >= 0 ? `+${diaDiff}` : `${diaDiff}`;
    deltas.push({
      metric: 'PA',
      before: `${bpBefore.sys}/${bpBefore.dia}`,
      after: `${bpAfter.sys}/${bpAfter.dia} mmHg`,
      direction: sysDiff > 0 ? 'up' : sysDiff < 0 ? 'down' : 'neutral',
      deltaText: `${signSys}/${signDia} mmHg`,
    });
  }

  if (before.heartRate !== after.heartRate) {
    const diff = after.heartRate - before.heartRate;
    deltas.push({
      metric: 'FC',
      before: `${before.heartRate}`,
      after: `${after.heartRate} lpm`,
      direction: diff > 0 ? 'up' : 'down',
      deltaText: `${diff > 0 ? '+' : ''}${diff} lpm`,
    });
  }

  if (before.respiratoryRate !== after.respiratoryRate) {
    const diff = after.respiratoryRate - before.respiratoryRate;
    deltas.push({
      metric: 'FR',
      before: `${before.respiratoryRate}`,
      after: `${after.respiratoryRate} rpm`,
      direction: diff > 0 ? 'up' : 'down',
      deltaText: `${diff > 0 ? '+' : ''}${diff} rpm`,
    });
  }

  if (Math.abs(before.temperature - after.temperature) >= 0.05) {
    const diff = Number((after.temperature - before.temperature).toFixed(1));
    deltas.push({
      metric: 'Temp',
      before: `${before.temperature.toFixed(1)}`,
      after: `${after.temperature.toFixed(1)} °C`,
      direction: diff > 0 ? 'up' : 'down',
      deltaText: `${diff > 0 ? '+' : ''}${diff.toFixed(1)} °C`,
    });
  }

  if (before.oxygenSaturation !== after.oxygenSaturation) {
    const diff = after.oxygenSaturation - before.oxygenSaturation;
    deltas.push({
      metric: 'SpO₂',
      before: `${before.oxygenSaturation}%`,
      after: `${after.oxygenSaturation}%`,
      direction: diff > 0 ? 'up' : 'down',
      deltaText: `${diff > 0 ? '+' : ''}${diff}%`,
    });
  }

  if (
    typeof before.bloodGlucose === 'number' &&
    typeof after.bloodGlucose === 'number' &&
    before.bloodGlucose !== after.bloodGlucose
  ) {
    const diff = after.bloodGlucose - before.bloodGlucose;
    deltas.push({
      metric: 'Glucemia',
      before: `${before.bloodGlucose}`,
      after: `${after.bloodGlucose} mg/dL`,
      direction: diff > 0 ? 'up' : 'down',
      deltaText: `${diff > 0 ? '+' : ''}${diff} mg/dL`,
    });
  }

  if (before.glasgow !== after.glasgow) {
    const diff = after.glasgow - before.glasgow;
    deltas.push({
      metric: 'Glasgow',
      before: `${before.glasgow}/15`,
      after: `${after.glasgow}/15`,
      direction: diff > 0 ? 'up' : 'down',
      deltaText: `${diff > 0 ? '+' : ''}${diff} pts`,
    });
  }

  return deltas;
}

export interface StatApplyInput {
  presetId?: string;
  label?: string;
  drug: string;
  dose?: string;
  route?: string;
  frequency?: string;
  duration?: string;
}

export interface StatApplyOutcome {
  updatedVitals: VitalSigns;
  record: StatInterventionRecord;
  medicationItem: MedicationItem;
  isImmediateDeath: boolean;
  immediateDeathReason?: string;
}

interface CaseClinicalFlags {
  diagNorm: string;
  fullCaseNorm: string;
  bgMedsNorm: string;
  allergiesNorm: string;
  isPediatric: boolean;
  weightKg: number;
  isDengue: boolean;
  isActiveBleed: boolean;
  isHemorrhagicStroke: boolean;
  isEctopicRuptured: boolean;
  isRenalFailureOrHyperK: boolean;
  isHyperkalemia: boolean;
  isObstructiveAirway: boolean;
  isCopd: boolean;
  isAnaphylaxis: boolean;
  isPulmonaryEdemaOrFluidOverload: boolean;
  isInferiorStemi: boolean;
  isIschemicChestPain: boolean;
  isSeizureOrEclampsia: boolean;
  isBowelObstruction: boolean;
  isOrganophosphate: boolean;
  isAlcoholWithdrawal: boolean;
  usesPde5: boolean;
}

function extractCaseClinicalFlags(caseData: ClinicalCase, vitals: VitalSigns): CaseClinicalFlags {
  const diagNorm = norm(caseData.solution.correctDiagnosis || '');
  const fullCaseNorm = norm(
    `${caseData.solution.correctDiagnosis} ${caseData.solution.pathophysiology} ${caseData.patientInfo.consultReason} ${caseData.patientInfo.currentIllness}`
  );
  const bgMedsNorm = norm(
    `${(caseData.background.currentMedications || []).join(' ')} ${(caseData.background.pathological || []).join(' ')} ${caseData.patientInfo.currentIllness}`
  );
  const allergiesNorm = norm((caseData.background.allergies || []).join(' '));
  const isPediatric = caseData.patientInfo.age < 12;
  const weightKg = getEffectiveWeightKg(caseData, vitals);

  const isDengue = diagNorm.includes('dengue') || fullCaseNorm.includes('dengue');
  const isHemorrhagicStroke =
    diagNorm.includes('hemorragia subaracnoidea') ||
    diagNorm.includes('ictus hemorragico') ||
    diagNorm.includes('hemorragia intracerebral') ||
    fullCaseNorm.includes('ictus hemorragico');
  const isEctopicRuptured = diagNorm.includes('ectopico') && (diagNorm.includes('roto') || fullCaseNorm.includes('hemoperitoneo'));
  const isActiveBleed =
    diagNorm.includes('hemorragia digestiva') ||
    diagNorm.includes('ulcera peptica') ||
    isHemorrhagicStroke ||
    isEctopicRuptured ||
    fullCaseNorm.includes('hematemesis') ||
    fullCaseNorm.includes('melena');
  const isHyperkalemia =
    fullCaseNorm.includes('hiperpotasemia') ||
    fullCaseNorm.includes('hiperkalemia') ||
    diagNorm.includes('lesion renal') ||
    diagNorm.includes('insuficiencia renal');
  const isRenalFailureOrHyperK =
    isHyperkalemia || diagNorm.includes('renal') || fullCaseNorm.includes('rabdomiolisis');
  const isObstructiveAirway =
    diagNorm.includes('asma') ||
    diagNorm.includes('epoc') ||
    diagNorm.includes('bronquiolitis') ||
    diagNorm.includes('broncoespasmo') ||
    diagNorm.includes('crup') ||
    diagNorm.includes('anafilax');
  const isCopd = diagNorm.includes('epoc') || diagNorm.includes('enfisema') || bgMedsNorm.includes('epoc');
  const isAnaphylaxis = diagNorm.includes('anafilax');
  const isPulmonaryEdemaOrFluidOverload =
    diagNorm.includes('edema agudo de pulmon') ||
    diagNorm.includes('insuficiencia cardiaca descompensada') ||
    diagNorm.includes('sobrecarga hidrica');
  const isInferiorStemi =
    (diagNorm.includes('infarto') || diagNorm.includes('iamcest')) &&
    (fullCaseNorm.includes('inferior') || fullCaseNorm.includes('ventriculo derecho'));
  const isIschemicChestPain =
    diagNorm.includes('infarto') ||
    diagNorm.includes('angina') ||
    diagNorm.includes('sindrome coronario') ||
    diagNorm.includes('iamcest');
  const isSeizureOrEclampsia =
    diagNorm.includes('convuls') ||
    diagNorm.includes('estatus epileptico') ||
    diagNorm.includes('eclampsia') ||
    diagNorm.includes('preeclampsia');
  const isBowelObstruction =
    diagNorm.includes('obstruccion intestinal') ||
    diagNorm.includes('invaginacion') ||
    diagNorm.includes('apendicitis') ||
    diagNorm.includes('perforacion');
  const isOrganophosphate =
    diagNorm.includes('organofosforad') ||
    diagNorm.includes('colinergico') ||
    fullCaseNorm.includes('organofosforad');
  const isAlcoholWithdrawal =
    diagNorm.includes('delirium tremens') || diagNorm.includes('abstinencia alcoholica');
  const usesPde5 = /\b(sildenafil|tadalafil|vardenafil|viagra|cialis)\b/.test(bgMedsNorm);

  return {
    diagNorm,
    fullCaseNorm,
    bgMedsNorm,
    allergiesNorm,
    isPediatric,
    weightKg,
    isDengue,
    isActiveBleed,
    isHemorrhagicStroke,
    isEctopicRuptured,
    isRenalFailureOrHyperK,
    isHyperkalemia,
    isObstructiveAirway,
    isCopd,
    isAnaphylaxis,
    isPulmonaryEdemaOrFluidOverload,
    isInferiorStemi,
    isIschemicChestPain,
    isSeizureOrEclampsia,
    isBowelObstruction,
    isOrganophosphate,
    isAlcoholWithdrawal,
    usesPde5,
  };
}

function getCumulativePriorDoses(
  previousHistory: StatInterventionRecord[],
  weightKg: number,
  matcher: RegExp
): { mg: number; ml: number; ui: number; meq: number; count: number } {
  let mg = 0;
  let ml = 0;
  let ui = 0;
  let meq = 0;
  let count = 0;
  for (const rec of previousHistory) {
    const recText = norm(`${rec.drug} ${rec.label}`);
    if (!matcher.test(recText)) continue;
    count += 1;
    const p = parseNumericDose(rec.dose || '', weightKg);
    if (p.mg) mg += p.mg;
    if (p.ml) ml += p.ml;
    if (p.ui) ui += p.ui;
    if (p.meq) meq += p.meq;
  }
  return { mg, ml, ui, meq, count };
}

export function applyStatIntervention(
  currentVitals: VitalSigns,
  _baselineVitals: VitalSigns,
  caseData: ClinicalCase,
  input: StatApplyInput,
  previousHistory: StatInterventionRecord[],
  elapsedSeconds: number
): StatApplyOutcome {
  const cleanDrug = input.drug.trim();
  const cleanDose = (input.dose || '').trim() || 'Dosis STAT estándar';
  const cleanRoute = (input.route || '').trim() || 'Intravenosa (IV)';
  const label = (input.label || cleanDrug).trim();

  const drugNorm = norm(`${cleanDrug} ${label} ${input.presetId || ''}`);
  const doseNorm = norm(cleanDose);
  const freqNorm = norm(`${input.frequency || ''} ${input.duration || ''}`);
  const routeNorm = norm(cleanRoute);

  const flags = extractCaseClinicalFlags(caseData, currentVitals);
  const {
    fullCaseNorm: diagNorm,
    allergiesNorm,
    isPediatric,
    weightKg,
    isDengue,
    isActiveBleed,
    isRenalFailureOrHyperK,
    isHyperkalemia,
    isObstructiveAirway,
    isCopd,
    isAnaphylaxis,
    isPulmonaryEdemaOrFluidOverload,
    isInferiorStemi,
    isIschemicChestPain,
    isSeizureOrEclampsia,
    isBowelObstruction,
    isOrganophosphate,
    isAlcoholWithdrawal,
    usesPde5,
  } = flags;

  const parsedDose = parseNumericDose(cleanDose, weightKg);

  const bp = parseBP(currentVitals.bloodPressure);
  const mapBefore = calcMAP(bp.sys, bp.dia);
  let sys = bp.sys;
  let dia = bp.dia;
  let hr = currentVitals.heartRate;
  let rr = currentVitals.respiratoryRate;
  let temp = currentVitals.temperature;
  let spo2 = currentVitals.oxygenSaturation;
  let glasgow = currentVitals.glasgow;
  let glucose = currentVitals.bloodGlucose;

  const isIV = routeNorm.includes('intravenosa') || /\biv\b/.test(routeNorm);
  const isIM = routeNorm.includes('intramuscular') || /\bim\b/.test(routeNorm);
  const isInhaled =
    routeNorm.includes('inhalat') ||
    routeNorm.includes('nebuliz') ||
    doseNorm.includes('nebuliz') ||
    drugNorm.includes('nebuliz');

  const sameDrugCount = previousHistory.filter(
    (item) =>
      (input.presetId && item.presetId === input.presetId) ||
      norm(item.drug) === norm(cleanDrug)
  ).length;

  let effectSeverity: StatEffectSeverity = 'mejoria';
  let summary = '';
  let patientFeelingNote = '';
  let isImmediateDeath = false;
  let immediateDeathReason: string | undefined = undefined;

  const isAllergicToPenicillin =
    allergiesNorm.includes('penicilin') || allergiesNorm.includes('betalactam');
  const isAllergicToSulfa = allergiesNorm.includes('sulfa') || allergiesNorm.includes('trimetoprim');
  const isAllergicToAine =
    allergiesNorm.includes('aine') || allergiesNorm.includes('aspirina') || allergiesNorm.includes('ibuprofeno');

  const isPenicillinDrug =
    /\b(penicilina|amoxicilina|ampicilina|piperacilina|oxacilina|dicloxacilina|amoxiclav)\b/.test(drugNorm);
  const isSulfaDrug = /\b(sulfa|trimetoprim|cotrimoxazol|bactrim)\b/.test(drugNorm);
  const isAsaDrug = /\b(aspirina|acetilsalicilico|acido acetilsalicilico|aas|asa)\b/.test(drugNorm);
  const isNsaidDrug =
    /\b(ibuprofeno|diclofenaco|ketorolaco|naproxeno|metamizol|dipirona|piroxicam|indometacina|meloxicam|celecoxib)\b/.test(
      drugNorm
    );

  const isShockOrHypovolemic =
    sys < 100 ||
    hr >= 105 ||
    diagNorm.includes('shock') ||
    diagNorm.includes('choque') ||
    diagNorm.includes('sepsis') ||
    diagNorm.includes('cetoacidosis') ||
    diagNorm.includes('deshidrat') ||
    diagNorm.includes('hemorrag') ||
    isDengue;

  const isHypertensiveCrisis =
    sys >= 165 ||
    dia >= 100 ||
    diagNorm.includes('preeclampsia') ||
    diagNorm.includes('eclampsia') ||
    diagNorm.includes('emergencia hipertensiva') ||
    diagNorm.includes('diseccion aortica');

  // 1. CONTRAINDICACIONES INMUNOLÓGICAS / PATOLÓGICAS ABSOLUTAS
  if (
    (isAllergicToPenicillin && isPenicillinDrug) ||
    (isAllergicToSulfa && isSulfaDrug) ||
    (isAllergicToAine && (isNsaidDrug || isAsaDrug))
  ) {
    effectSeverity = 'reaccion_adversa';
    sys = clamp(sys - 30, 48, 220);
    dia = clamp(dia - 18, 28, 130);
    hr = clamp(hr + 30, 50, 182);
    rr = clamp(rr + 8, 12, 46);
    spo2 = clamp(spo2 - 9, 66, 100);
    glasgow = clamp(glasgow - (sys < 75 ? 6 : 3), 5, 15);
    if (bp.sys < 90 || sameDrugCount >= 1 || sys <= 54 || spo2 <= 72) {
      isImmediateDeath = true;
      immediateDeathReason = `Choque anafiláctico fulminante y edema laríngeo asfíctico por administrar ${cleanDrug} en paciente con alergia documentada e inestabilidad hemodinámica.`;
      summary = `Muerte inmediata por anafilaxia fulminante tras ${cleanDrug} en paciente alérgico.`;
    } else {
      summary =
        'Reacción anafiláctica / hipersensibilidad inmediata tras administrar fármaco con alergia registrada: caída brusca de PA, taquicardia compensadora y desaturación.';
    }
    patientFeelingNote = isPediatric
      ? '¡Doctor, mi niño se empezó a brotar todo, está respirando muy agitado y se puso pálido justo después de ese medicamento!'
      : '¡Doctor, me picó la garganta de golpe, me falta el aire y siento que me voy a desmayar después de que me pusieron ese medicamento!';
  } else if ((isDengue || isActiveBleed) && (isNsaidDrug || isAsaDrug)) {
    effectSeverity = 'reaccion_adversa';
    sys = clamp(sys - 18, 56, 220);
    dia = clamp(dia - 10, 35, 130);
    hr = clamp(hr + 18, 50, 178);
    if (sys < 85) glasgow = clamp(glasgow - 2, 6, 15);
    summary = isDengue
      ? 'Hemorragia / deterioro hemodinámico grave tras AINE o salicilato en Dengue: disfunción plaquetaria y riesgo de choque hemorrágico fatal.'
      : 'Agravamiento de hemorragia digestiva / sangrado activo por AINE o Ácido Acetilsalicílico: aumenta sangrado e inestabilidad hemodinámica.';
    patientFeelingNote = isPediatric
      ? 'Doctor, después de esa medicina mi niño siguió con más dolor en la pancita y se ve más pálido y frío.'
      : '¡Doctor, me empezó un ardor horrible en el estómago, náuseas con sangre y mucho mareo después de eso!';
  } else if (isAsaDrug && isPediatric) {
    effectSeverity = 'reaccion_adversa';
    summary =
      'Contraindicación pediátrica de Ácido Acetilsalicílico (riesgo de Síndrome de Reye en menores de 12 años con enfermedad febril/viral).';
    patientFeelingNote = 'Doctor, ¿seguro que esa aspirina es adecuada para un niño pequeño?';
  } else if (isRenalFailureOrHyperK && isNsaidDrug) {
    effectSeverity = 'reaccion_adversa';
    sys = clamp(sys - 8, 65, 220);
    summary =
      'Nefrotoxicidad aguda por AINE en paciente con Lesión Renal Aguda: vasoconstricción de arteriola aferente, caída adicional de TFG y empeoramiento de hiperpotasemia.';
    patientFeelingNote = 'Me duele un poco la espalda baja y sigo sintiéndome muy decaído, doctor.';
  } else if (
    (isActiveBleed || isDengue) &&
    /\b(alteplasa|tenecteplasa|estreptoquinasa|heparina|enoxaparina|warfarina|apixaban|rivaroxaban|clopidogrel|ticagrelor)\b/.test(
      drugNorm
    )
  ) {
    const isFibrinolytic = /\b(alteplasa|tenecteplasa|estreptoquinasa)\b/.test(drugNorm);
    effectSeverity = 'reaccion_adversa';
    sys = clamp(sys - 36, 48, 220);
    dia = clamp(dia - 20, 30, 130);
    hr = clamp(hr + 34, 50, 185);
    rr = clamp(rr + 6, 12, 42);
    spo2 = clamp(spo2 - 5, 70, 100);
    glasgow = sys < 80 ? clamp(glasgow - 6, 5, 9) : clamp(glasgow - 4, 6, 11);
    if (isFibrinolytic || (/\b(heparina|enoxaparina)\b/.test(drugNorm) && bp.sys < 90)) {
      isImmediateDeath = true;
      immediateDeathReason = `Exanguinación catastrófica irreversible e hipovolemia refractaria tras administrar ${cleanDrug} (${cleanDose}) en paciente con sangrado activo o contraindicación hemorrágica absoluta.`;
      summary = `Muerte inmediata por exanguinación catastrófica tras ${cleanDrug} en hemorragia activa.`;
    } else {
      summary = `Hemorragia catastrófica iatrogénica tras administrar ${cleanDrug} en paciente con sangrado activo / contraindicación hemorrágica absoluta: choque hipovolémico agudo y riesgo letal inmediato.`;
    }
    patientFeelingNote =
      '[Alerta crítica: sangrado masivo súbito, palidez extrema, diaforesis y deterioro brusco de conciencia tras anticoagulante/fibrinolítico]';
  } else if (
    isObstructiveAirway &&
    /\b(propranolol|nadolol|timolol|carvedilol|labetalol|sotalol|betabloqueador)\b/.test(drugNorm)
  ) {
    effectSeverity = 'reaccion_adversa';
    spo2 = clamp(spo2 - 8, 68, 100);
    rr = clamp(rr + 7, 12, 46);
    hr = clamp(hr - 18, 36, 170);
    if (drugNorm.includes('labetalol')) {
      const labMg = parsedDose.mg ?? 20;
      sys = clamp(sys - Math.round(18 + labMg * 0.6), 52, 220);
      dia = clamp(dia - Math.round(10 + labMg * 0.35), 32, 130);
    }
    summary =
      'Broncoespasmo severo paradójico por bloqueo beta-2 no selectivo en paciente con hiperreactividad bronquial / asma / EPOC: caída de SpO₂ e incremento de taquipnea.';
    patientFeelingNote = isPediatric
      ? '¡Doctor, mi hijo empezó a silbar muchísimo del pecho y le cuesta mucho más meter aire!'
      : '¡Doctor, se me cerró el pecho de golpe y siento que me ahogo después de esa dosis!';
  } else if (
    isBowelObstruction &&
    /\b(metoclopramida|domperidona|loperamida)\b/.test(drugNorm)
  ) {
    effectSeverity = 'reaccion_adversa';
    hr = clamp(hr + 18, 55, 175);
    sys = clamp(sys - 10, 65, 220);
    summary = `Empeoramiento clínico por ${cleanDrug} en obstrucción intestinal / abdomen agudo quirúrgico: riesgo grave de perforación de víscera hueca o megacolon.`;
    patientFeelingNote =
      '¡Ay, doctor! Con esa medicina me empezaron unos retorcijones terribles y el dolor de panza se volvió insoportable.';
  }
  // 2. CLORURO DE POTASIO (KCl) IV — Alto riesgo de paro cardíaco por hiperkalemia
  else if (/\b(cloruro de potasio|kcl|potasio)\b/.test(drugNorm) && !drugNorm.includes('losartan')) {
    const meq = parsedDose.meq ?? (parsedDose.mg ? parsedDose.mg / 74.5 : 20);
    const isDilutedInfusion =
      /\b(diluid|en 1000|en 500|por litro|infusion|mantenimiento|bomba)\b/.test(
        `${doseNorm} ${freqNorm} ${routeNorm}`
      ) && !/\b(bolo|directa|push|stat rapido)\b/.test(`${doseNorm} ${freqNorm}`);

    if (isHyperkalemia || !isDilutedInfusion || meq >= 30 || (isIV && meq >= 15 && !isDilutedInfusion)) {
      effectSeverity = 'reaccion_adversa';
      isImmediateDeath = true;
      immediateDeathReason = isHyperkalemia
        ? `Fibrilación ventricular inmediata y asistolia por administrar Cloruro de Potasio (${cleanDose}) en paciente con hiperpotasemia severa / lesión renal aguda.`
        : `Paro cardíaco inmediato por fibrilación ventricular tras bolo IV directo / infusión sin dilución segura de Cloruro de Potasio (${cleanDose}).`;
      hr = 0;
      sys = 0;
      dia = 0;
      rr = 0;
      spo2 = 0;
      glasgow = 3;
      summary = isHyperkalemia
        ? `Muerte inmediata por paro cardíaco / fibrilación ventricular al administrar potasio (${cleanDose}) en hiperpotasemia / lesión renal aguda.`
        : `Muerte inmediata por fibrilación ventricular / paro cardíaco tras bolo IV directo o sin dilución segura de Cloruro de Potasio (${cleanDose}).`;
      patientFeelingNote =
        '[CÓDIGO AZUL · MUERTE INMEDIATA: arritmia ventricular maligna y asistolia súbita tras bolo de potasio IV]';
    } else {
      effectSeverity = 'parcial';
      summary = `Reposición diluida cautelosa de KCl (${cleanDose}) en infusión lenta con monitoreo.`;
      patientFeelingNote = 'Siento un leve ardor en la vena por donde pasa el suero, doctor, pero me siento estable.';
    }
  }
  // 3. INSULINA (sensible a dosis real en UI, peso, acumulación, formulación IV vs SC y glucemia)
  else if (/\b(insulina)\b/.test(drugNorm)) {
    const isBasalFormulation = /\b(nph|glargina|lantus|detemir|degludec|tresiba|levemir|intermedia|prolongada)\b/.test(
      drugNorm
    );
    if (isIV && isBasalFormulation) {
      effectSeverity = 'reaccion_adversa';
      if (typeof glucose === 'number') {
        glucose = clamp(glucose - 95, 22, 650);
      }
      hr = clamp(hr + 24, 50, 178);
      glasgow = clamp(glasgow - 3, 6, 15);
      summary = `Error crítico farmacológico: administración intravenosa de insulina de acción intermedia/prolongada (${cleanDrug}), contraindicada por vía IV por riesgo de precipitación, hipoglucemia prolongada grave e impredecible.`;
      patientFeelingNote =
        '¡Doctor, me siento muy mareado, sudoroso y confundido después de que me inyectaron esa insulina en la vena!';
    } else {
      const prevInsulin = getCumulativePriorDoses(previousHistory, weightKg, /\binsulina\b/);
      const priorDextrose = getCumulativePriorDoses(previousHistory, weightKg, /\b(dextrosa|glucosa)\b/);
      const ui = parsedDose.ui ?? 6;
      const totalUi = ui + prevInsulin.ui;
      const uiPerKg = ui / weightKg;
      const isPolarizingDose =
        isHyperkalemia && ui <= 15 && (priorDextrose.mg !== null && priorDextrose.mg >= 15000 || /\bpolariz/.test(drugNorm));

      if (isPolarizingDose) {
        if (typeof glucose === 'number') {
          glucose = clamp(glucose - Math.round(ui * 2.2), 75, 650);
        }
        effectSeverity = 'mejoria';
        summary = `Solución polarizante (${cleanDose}) en hiperkalemia con cobertura glucosada: favorece desplazamiento intracelular de K⁺ manteniendo normoglucemia.`;
        patientFeelingNote = 'Me siento un poco más tranquilo, doctor, sin temblor ni sudoración.';
      } else if (typeof glucose === 'number') {
        const beforeGlucose = glucose;
        const sensitivity = beforeGlucose >= 350 ? 5.2 : beforeGlucose >= 200 ? 6.0 : 6.8;
        const isMassiveSingle = ui >= 35 || uiPerKg >= 0.45;
        const isMassiveCumulative = totalUi >= 50 || totalUi / weightKg >= 0.65;
        const isHighDose = ui >= 20 || uiPerKg >= 0.25;

        // Cálculo fisiológico sin tope protector irreal: 100 UI IV tiene potencial hipoglucemiante >600 mg/dL
        const rawDrop =
          ui <= 16 && uiPerKg <= 0.22 && !isMassiveCumulative
            ? Math.round(clamp(ui * sensitivity, 12, 85))
            : Math.round(ui * sensitivity * (isMassiveSingle || isMassiveCumulative ? 1.15 : 1.0));

        glucose = clamp(beforeGlucose - rawDrop, 14, 700);
        const actualDrop = beforeGlucose - glucose;

        if (glucose < 35 || isMassiveSingle || isMassiveCumulative) {
          effectSeverity = 'reaccion_adversa';
          const isInstantInsulinArrest =
            ui >= 150 ||
            uiPerKg >= 2.0 ||
            (beforeGlucose < 65 && ui >= 25) ||
            (beforeGlucose <= 25 && sameDrugCount >= 1 && ui >= 25);

          if (isInstantInsulinArrest) {
            isImmediateDeath = true;
            immediateDeathReason = `Choque neuroglucopénico fulminante, hipopotasemia crítica y paro cardiorrespiratorio irreversible tras sobredosis extrema de insulina (${cleanDose}, acumulado ${Math.round(totalUi)} UI) con glucemia ${beforeGlucose} mg/dL.`;
            summary = `Muerte inmediata por sobredosis extrema de insulina (${cleanDose}, acumulado ${Math.round(totalUi)} UI): paro por neuroglucopenia e hipopotasemia severa.`;
          } else if (glucose < 30 || ui >= 70 || uiPerKg >= 0.85 || isMassiveCumulative) {
            glasgow = clamp(glasgow - 10, 3, 6);
            sys = clamp(sys - 38, 52, 200);
            dia = clamp(dia - 22, 30, 120);
            hr = glucose <= 22 || ui >= 80 ? clamp(40, 32, 48) : clamp(hr + 42, 60, 178);
            rr = clamp(rr - 6, 6, 36);
            spo2 = clamp(spo2 - 9, 72, 100);
            summary = `Sobredosis masiva de insulina (${cleanDose}, acumulado ${Math.round(totalUi)} UI): hipoglucemia iatrogénica catastrófica (glucemia cae de ${beforeGlucose} a ${glucose} mg/dL), coma neuroglucopénico (Glasgow ${glasgow}/15), hipokalemia aguda severa y colapso cardiorrespiratorio — requiere rescate inmediato o será letal.`;
            patientFeelingNote =
              '[Alerta crítica: el paciente perdió la conciencia súbitamente con convulsiones, diaforesis profusa y bradicardia/shock tras sobredosis masiva de insulina — requiere Dextrosa IV inmediata]';
          } else {
            glasgow = clamp(glasgow - 6, 6, 9);
            sys = clamp(sys - 20, 68, 210);
            dia = clamp(dia - 12, 40, 125);
            hr = clamp(hr + 32, 55, 176);
            spo2 = clamp(spo2 - 4, 80, 100);
            summary = `Hipoglucemia iatrogénica severa por sobredosis de insulina (${cleanDose}): glucemia cae bruscamente a ${glucose} mg/dL con coma/estupor agudo (Glasgow ${glasgow}/15) y riesgo letal.`;
            patientFeelingNote = isPediatric
              ? '[El niño quedó inconsciente, flácido y sudando frío tras la dosis alta de insulina]'
              : '[El paciente quedó inconsciente / en estupor profundo con sudoración fría tras la sobredosis de insulina]';
          }
        } else if (glucose < 54) {
          effectSeverity = 'reaccion_adversa';
          hr = clamp(hr + 28, 55, 176);
          glasgow = clamp(glasgow - 3, 7, 13);
          summary = `Hipoglucemia iatrogénica clínicamente significativa (<54 mg/dL) tras ${cleanDose} de insulina (cae a ${glucose} mg/dL): neuroglucopenia aguda.`;
          patientFeelingNote =
            '¡Doctor, me siento muy mareado, sudando frío, me tiembla todo el cuerpo y me cuesta hablar claro!';
        } else if (glucose < 70) {
          effectSeverity = 'reaccion_adversa';
          hr = clamp(hr + 18, 55, 172);
          glasgow = clamp(glasgow - 1, 10, 15);
          summary = `Descenso glucémico excesivo tras ${cleanDose} de insulina: cayó a ${glucose} mg/dL causando hipoglucemia iatrogénica sintomática.`;
          patientFeelingNote = isPediatric
            ? '¡Doctor, mi niño empezó a sudar frío, está temblando mucho y se ve muy dormido!'
            : '¡Doctor, empecé a temblar muchísimo, tengo sudor frío, palpitaciones y la vista nublada!';
        } else if (actualDrop >= 95 || isHighDose) {
          effectSeverity = 'reaccion_adversa';
          hr = clamp(hr + 12, 55, 172);
          summary = `Descenso glucémico y osmolar demasiado brusco (-${actualDrop} mg/dL tras ${cleanDose} de insulina): alto riesgo de edema cerebral, hipokalemia aguda e hipoglucemia tardía.`;
          patientFeelingNote =
            'Doctor, me siento débil, mareado y con palpitaciones rápidas desde que me pasaron esa dosis tan alta de insulina.';
        } else if (beforeGlucose < 180) {
          effectSeverity = 'reaccion_adversa';
          summary = `Insulina (${cleanDose}) administrada sin hiperglucemia de urgencia (${beforeGlucose} → ${glucose} mg/dL): riesgo injustificado de hipoglucemia iatrogénica.`;
          patientFeelingNote = 'Me siento un poco flojo y con hambre rara desde esa inyección, doctor.';
        } else if (diagNorm.includes('cetoacidosis') || diagNorm.includes('hiperosmolar') || beforeGlucose >= 280) {
          rr = clamp(rr - (rr > 22 ? 3 : 0), 14, 42);
          hr = clamp(hr - (hr > 105 ? 6 : 2), 55, 170);
          effectSeverity = ui < 2 ? 'parcial' : 'mejoria';
          summary =
            ui < 2
              ? `Dosis subterapéutica de insulina (${cleanDose}) en hiperglucemia severa (-${actualDrop} mg/dL); requiere titulación a 0.1 UI/kg/h.`
              : `Descenso gradual y seguro de glucemia (-${actualDrop} mg/dL) tras ${cleanDose} de insulina, dentro de meta (50-75 mg/dL/h).`;
          patientFeelingNote =
            'Ya siento un poquito menos de pesadez y menos agitación al respirar, doctor.';
        } else {
          // Hiperglucemia moderada ambulatoria (ej. DM2 con 224 mg/dL sin cetosis) y dosis pequeña segura
          effectSeverity = 'parcial';
          summary = `Descenso de glucemia (-${actualDrop} mg/dL a ${glucose} mg/dL) tras ${cleanDose}; en DM2 estable sin cetoacidosis la prioridad es el manejo oral progresivo y no bolo IV.`;
          patientFeelingNote = 'Me siento estable, doctor, aunque todavía tengo algo de sed.';
        }
      } else {
        effectSeverity = 'sin_cambio';
        summary = 'No se dispone de hiperglucemia basal documentada para titular insulina.';
        patientFeelingNote = 'No noto cambio claro todavía con esa dosis, doctor.';
      }
    }
  }
  // 4. LABETALOL y ANTIHIPERTENSIVOS IV/VO
  else if (
    /\b(labetalol|hidralazina|nifedipin|nitroprusiato|nicardipin|enalaprilat|enalapril|antihipertensiv|losartan|captopril|amlodipino|esmolol|metoprolol|atenolol)\b/.test(
      drugNorm
    )
  ) {
    const isOralOnlyDrug = /\b(losartan|amlodipino|captopril|nifedipin)\b/.test(drugNorm);
    const isLabetalol = drugNorm.includes('labetalol');
    const isHidralazina = drugNorm.includes('hidralazina');
    const isNitroprusiato = drugNorm.includes('nitroprusiato');
    const isBetaBlocker = /\b(labetalol|esmolol|metoprolol|atenolol)\b/.test(drugNorm);

    if (isIV && isOralOnlyDrug) {
      effectSeverity = 'reaccion_adversa';
      sys = clamp(sys - 24, 58, 220);
      dia = clamp(dia - 14, 34, 130);
      summary = `Error crítico farmacológico: administración intravenosa de formulación exclusivamente oral (${cleanDrug}). Riesgo de embolismo o toxicidad vascular grave.`;
      patientFeelingNote = '¡Doctor, me ardió horrible la vena y me siento muy mareado!';
    } else if (isBetaBlocker && (sys < 92 || hr < 52)) {
      effectSeverity = 'reaccion_adversa';
      sys = clamp(sys - 26, 48, 220);
      dia = clamp(dia - 16, 28, 130);
      hr = clamp(hr - 18, 30, 165);
      glasgow = clamp(glasgow - 6, 4, 9);
      if (bp.sys < 80 || currentVitals.heartRate < 45) {
        isImmediateDeath = true;
        immediateDeathReason = `Bloqueo AV completo y asistolia por administrar betabloqueador (${cleanDrug}) en paciente ya en choque profundo o bradicardia extrema.`;
        summary = `Muerte inmediata por choque cardiogénico / asistolia tras ${cleanDrug} en paciente en colapso.`;
      } else {
        summary = `Choque cardiogénico / bradicardia severa agravada por betabloqueador (${cleanDrug}) en paciente ya hipotenso o bradicárdico: riesgo vital inmediato.`;
      }
      patientFeelingNote =
        '[El paciente quedó inconsciente y frío con hipotensión severa y bradicardia extrema tras el betabloqueador]';
    } else {
      const prevAht = getCumulativePriorDoses(
        previousHistory,
        weightKg,
        /\b(labetalol|hidralazina|nitroprusiato|nicardipin|enalaprilat|nifedipin)\b/
      );
      let rawSysDrop = 20;
      let rawDiaDrop = 11;
      let hrDelta = -4;
      let isMassiveOverdose = false;
      let isInstantFatalAht = false;

      if (isLabetalol) {
        const mg = parsedDose.mg ?? 20;
        const totalMg = mg + prevAht.mg;
        const mgPerKg = mg / weightKg;
        const potencyRatio = mg / 20;
        isMassiveOverdose = mg >= 120 || totalMg >= 300 || mgPerKg >= 2.0;
        isInstantFatalAht = mg >= 300;
        const baselineFactor = sys >= 180 ? 1.18 : sys >= 150 ? 1.0 : 0.9;
        rawSysDrop = Math.round(25 * Math.pow(potencyRatio, 0.85) * baselineFactor);
        rawDiaDrop = Math.round(rawSysDrop * 0.56);
        hrDelta = -Math.round(10 * Math.pow(potencyRatio, 0.72));
      } else if (isHidralazina) {
        const mg = parsedDose.mg ?? 5;
        const mgPerKg = mg / weightKg;
        const ratio = mg / 5;
        isMassiveOverdose = mg >= 30 || mgPerKg >= 0.5;
        isInstantFatalAht = mg >= 100;
        rawSysDrop = Math.round(22 * Math.pow(ratio, 0.8));
        rawDiaDrop = Math.round(rawSysDrop * 0.54);
        hrDelta = Math.round(11 * Math.pow(ratio, 0.65));
      } else if (isNitroprusiato) {
        const mg = parsedDose.mg ?? 0.05;
        isMassiveOverdose = mg >= 2;
        isInstantFatalAht = mg >= 10;
        const ratio = clamp(mg / 0.05, 0.5, 40);
        rawSysDrop = Math.round(28 * Math.pow(ratio, 0.55));
        rawDiaDrop = Math.round(rawSysDrop * 0.56);
        hrDelta = Math.round(10 * Math.pow(ratio, 0.4));
      } else if (drugNorm.includes('nifedipin')) {
        const mg = parsedDose.mg ?? 10;
        const isSL = routeNorm.includes('sublingual') || /\bsl\b/.test(routeNorm);
        isMassiveOverdose = mg >= 30 || (isSL && mg >= 10);
        rawSysDrop = Math.round((isSL ? 38 : 22) * (mg / 10));
        rawDiaDrop = Math.round(rawSysDrop * 0.55);
        hrDelta = Math.round(12 * (mg / 10));
      } else {
        const mg = parsedDose.mg ?? 10;
        const ratio = mg / 10;
        isMassiveOverdose = mg >= 80 || mg / weightKg >= 1.5;
        rawSysDrop = Math.round(18 * Math.pow(ratio, 0.72));
        rawDiaDrop = Math.round(rawSysDrop * 0.55);
        hrDelta = -2;
      }

      if (sameDrugCount >= 1 && !isMassiveOverdose) {
        rawSysDrop = Math.round(rawSysDrop * 0.9);
        rawDiaDrop = Math.round(rawDiaDrop * 0.9);
      }

      sys = clamp(sys - rawSysDrop, 45, 240);
      dia = clamp(dia - rawDiaDrop, 26, 140);
      hr = clamp(hr + hrDelta, 30, 180);

      const mapAfter = calcMAP(sys, dia);
      const mapDropPct = Math.round(((mapBefore - mapAfter) / Math.max(1, mapBefore)) * 100);
      const isIatrogenicHypotension = sys < 95 || mapAfter < 65 || hr < 50 || isMassiveOverdose;
      const isExcessiveDrop = mapDropPct >= 25;

      if (isInstantFatalAht) {
        effectSeverity = 'reaccion_adversa';
        isImmediateDeath = true;
        immediateDeathReason = `Colapso vasopléjico / choque cardiogénico irreversible o toxicidad fulminante tras bolo masivo de ${cleanDrug} (${cleanDose}).`;
        summary = `Muerte inmediata por colapso vasopléjico irreversible tras sobredosis letal de ${cleanDrug} (${cleanDose}).`;
        patientFeelingNote = '[CÓDIGO AZUL · Colapso súbito irreversible tras bolo letal antihipertensivo]';
      } else if (isIatrogenicHypotension) {
        effectSeverity = 'reaccion_adversa';
        if (sys < 75 || isMassiveOverdose) {
          glasgow = clamp(glasgow - 6, 4, 9);
          spo2 = clamp(spo2 - 6, 74, 100);
        } else if (sys < 88) {
          glasgow = clamp(glasgow - 1, 8, 15);
        }
        summary = `Hipotensión iatrogénica / shock vasopléjico tras sobredosis (${cleanDose} de ${cleanDrug}): descenso de PAM del ${mapDropPct}% (${bp.sys}/${bp.dia} → ${sys}/${dia} mmHg)${hr < 50 ? ' con bradicardia severa' : ''}${isMassiveOverdose ? ' y riesgo letal por hipoperfusión orgánica' : ''}.`;
        patientFeelingNote =
          glasgow <= 9
            ? '[El paciente perdió la lucidez y está inconsciente, frío y en choque profundo tras la sobredosis antihipertensiva]'
            : '¡Doctor, me dio un mareo terrible y siento que se me oscurece la vista, el cuerpo helado y mucha debilidad desde que me pasaron esa dosis tan fuerte!';
      } else if (isExcessiveDrop) {
        effectSeverity = 'reaccion_adversa';
        summary = `Descenso tensional demasiado brusco (caída de PAM del ${mapDropPct}%, superando la meta segura ≤25% en la primera hora) tras ${cleanDose} de ${cleanDrug}: riesgo de hipoperfusión cerebral/renal o placentaria.`;
        patientFeelingNote =
          'Doctor, me bajó rapidísimo la presión y aunque se me quitó el dolor de cabeza, ahora me siento muy mareado, sudoroso y con náuseas.';
      } else if (isHypertensiveCrisis || bp.sys >= 150) {
        effectSeverity = 'mejoria';
        summary = `Descenso tensional titulado y seguro (caída de PAM del ${mapDropPct}% dentro de meta ≤25%) tras ${cleanDose} de ${cleanDrug}.`;
        patientFeelingNote =
          'Doctor, ya siento menos presión en la cabeza y me disminuyó el zumbido de oídos sin marearme.';
      } else {
        effectSeverity = 'parcial';
        summary = `Descenso tensional leve en paciente normotenso (${bp.sys}/${bp.dia} → ${sys}/${dia} mmHg) sin hipotensión crítica.`;
        patientFeelingNote =
          'Siento un poco de flojera ligera después de esa medicina, doctor, pero estoy estable.';
      }
    }
  }
  // 5. NITROGLICERINA SL / IV
  else if (/\b(nitroglicerina|nitrat|isosorbide)\b/.test(drugNorm)) {
    const mg = parsedDose.mg ?? 0.4;
    const isMassiveNtg = mg >= 5;
    if (usesPde5 || sys < 100 || isInferiorStemi || isMassiveNtg) {
      const dropSys = isMassiveNtg ? Math.round(35 + mg * 4) : usesPde5 ? 48 : Math.round(24 * clamp(mg / 0.4, 0.7, 4));
      sys = clamp(sys - dropSys, 48, 220);
      dia = clamp(dia - Math.round(dropSys * 0.58), 28, 130);
      hr = clamp(hr + 20, 50, 180);
      if (sys < 80) glasgow = clamp(glasgow - (sys < 65 ? 6 : 3), 5, 9);
      effectSeverity = 'reaccion_adversa';
      if ((usesPde5 && bp.sys < 95) || mg >= 20) {
        isImmediateDeath = true;
        immediateDeathReason = usesPde5
          ? 'Choque vasopléjico refractario e irreversible por interacción mortal entre nitrato e inhibidor PDE5 en paciente ya hipotenso.'
          : `Colapso vasopléjico fulminante tras sobredosis masiva de nitrato (${cleanDose}).`;
      }
      summary = usesPde5
        ? 'Hipotensión refractaria severa por interacción mortal entre nitrato e inhibidor de PDE5 (sildenafil/tadalafil).'
        : isMassiveNtg
          ? `Colapso vasopléjico por sobredosis masiva de nitrato (${cleanDose}): caída crítica de PA a ${sys}/${dia} mmHg.`
          : 'Hipotensión marcada dependiente de precarga tras nitrato en paciente hipotenso o con probable compromiso de ventrículo derecho.';
      patientFeelingNote =
        glasgow <= 9
          ? '[Síncope brusco con inconsciencia, hipotensión severa y diaforesis tras nitrato]'
          : '¡Doctor, se me nubló la vista y siento un mareo muy fuerte con debilidad desde que me pusieron ese nitrato!';
    } else {
      const scale = clamp(mg / 0.4, 0.7, 4.5);
      sys = clamp(sys - Math.round(14 * scale), 70, 220);
      dia = clamp(dia - Math.round(8 * scale), 42, 130);
      if (isIschemicChestPain && sys >= 95) {
        hr = clamp(hr - (hr > 95 ? 8 : 0), 55, 165);
        effectSeverity = 'mejoria';
        summary = `Vasodilatación coronaria tras ${cleanDose} de nitroglicerina: alivio parcial de angina con descenso tensional esperado.`;
        patientFeelingNote =
          'Siento que me aflojó un poco esa presión que me apretaba el pecho, aunque todavía me queda algo de molestia y leve dolor de cabeza.';
      } else {
        effectSeverity = sys < 95 ? 'reaccion_adversa' : 'parcial';
        summary =
          sys < 95
            ? `Hipotensión iatrogénica tras ${cleanDose} de nitroglicerina (PA cae a ${sys}/${dia} mmHg).`
            : `Descenso tensional tras ${cleanDose} de nitroglicerina.`;
        patientFeelingNote =
          sys < 95
            ? 'Me siento muy mareado y flojo después de esa dosis, doctor.'
            : 'Me empezó a latir un poquito la sien con la nitroglicerina, pero mi molestia principal sigue.';
      }
    }
  }
  // 6. VASOPRESORES (Norepinefrina, Dopamina, Vasopresina, Dobutamina)
  else if (/\b(norepinefrina|noradrenalina|dopamina|dobutamina|vasopresina)\b/.test(drugNorm)) {
    const mg = parsedDose.mg ?? 0.02;
    const isMassiveBolus = mg >= 2;
    if (sys >= 115 || isMassiveBolus) {
      sys = clamp(sys + (isMassiveBolus ? 90 : 45), 70, 248);
      dia = clamp(dia + (isMassiveBolus ? 48 : 24), 45, 148);
      hr = clamp(hr + (isMassiveBolus ? 48 : 24), 45, 188);
      if (sys >= 220) glasgow = clamp(glasgow - 6, 5, 9);
      effectSeverity = 'reaccion_adversa';
      if (mg >= 10) {
        isImmediateDeath = true;
        immediateDeathReason = `Fibrilación ventricular / hemorragia intracerebral fulminante por bolo masivo de vasopresor (${cleanDose} de ${cleanDrug}).`;
      }
      summary = `Crisis hipertensiva severa y riesgo de isquemia/arritmia maligna por vasopresor (${cleanDose} ${cleanDrug})${sys >= 115 && !isMassiveBolus ? ' en paciente sin hipotensión' : ' a dosis excesiva'}.`;
      patientFeelingNote =
        glasgow <= 9
          ? '[Crisis hipertensiva maligna con pérdida brusca de la conciencia y arritmia]'
          : '¡Doctor, me estalla la cabeza y siento un dolor opresivo horrible en el pecho y palpitaciones rápidas!';
    } else {
      const gainSys = clamp(Math.round(24 + mg * 40), 18, 42);
      sys = clamp(sys + gainSys, 75, 138);
      dia = clamp(dia + Math.round(gainSys * 0.55), 48, 88);
      hr = clamp(hr - (hr > 125 ? 10 : -8), 55, 175);
      if (glasgow < 15 && bp.sys < 85) glasgow = clamp(glasgow + 1, 3, 15);
      effectSeverity = 'mejoria';
      summary = `Soporte vasopresor titulado con ${cleanDrug}: recuperación de PAM ≥65 mmHg y perfusión orgánica.`;
      patientFeelingNote = 'Parece que está reaccionando un poco mejor, doctor, la presión subió en el monitor.';
    }
  }
  // 7. OXÍGENO SUPLEMENTARIO
  else if (/\b(oxigeno|o2|mascarilla|canula)\b/.test(drugNorm)) {
    const targetSpo2 = isCopd ? 92 : 97;
    const lpm =
      parsedDose.lpm ??
      (parsedDose.percent ? Math.round((parsedDose.percent - 21) / 4) : 6);
    if (spo2 >= targetSpo2) {
      const isNarcosisRisk = isCopd && lpm >= 10;
      if (isNarcosisRisk) {
        rr = clamp(rr - 5, 7, 40);
        glasgow = clamp(glasgow - 2, 7, 15);
        spo2 = clamp(spo2 + 2, 70, 100);
        effectSeverity = 'reaccion_adversa';
        summary = `Flujo excesivo de O₂ (${lpm} L/min) en paciente con EPOC ya en meta: narcosis hipercápnica progresiva (cae FR y estado de alerta).`;
        patientFeelingNote = 'Con tanto oxígeno me siento muy somnoliento y aturdido, doctor...';
      } else {
        effectSeverity = isCopd && lpm >= 6 ? 'parcial' : 'sin_cambio';
        spo2 = clamp(spo2 + (spo2 < 99 ? 1 : 0), 70, 100);
        summary =
          isCopd && lpm >= 6
            ? `Flujo alto de O₂ (${lpm} L/min) en EPOC ya en meta (${spo2}%): conviene titular a 1-3 L/min para mantener meta 88-92%.`
            : 'Oxigenación suplementaria aplicada; la saturación ya se encontraba en rango objetivo.';
        patientFeelingNote = isPediatric
          ? 'Mi niño tolera bien la mascarilla de oxígeno, aunque sus molestias principales siguen igual.'
          : 'Siento el aire fresco de la mascarilla, doctor, aunque ya respiraba casi normal.';
      }
    } else {
      const flowFactor = clamp(lpm / 4, 0.7, 1.6);
      const rawGain = Math.round(5 * flowFactor);
      const gain = isCopd ? Math.min(4, targetSpo2 - spo2) : Math.min(rawGain, 99 - spo2);
      spo2 = clamp(spo2 + Math.max(2, gain), 70, 99);
      rr = clamp(rr - (rr > 22 ? 4 : 2), 14, 45);
      hr = clamp(hr - (hr > 100 ? 8 : 3), 55, 170);
      effectSeverity = gain >= 4 ? 'mejoria' : 'parcial';
      summary = isCopd
        ? `Mejoría de oxigenación titulada (${lpm} L/min) buscando meta segura 88-92% en EPOC; disminuye la taquipnea.`
        : `Incremento de SpO₂ tras oxígeno a ${lpm} L/min y reducción del trabajo respiratorio.`;
      patientFeelingNote = isPediatric
        ? '¡Qué alivio, doctor! Con el oxígeno mi niño dejó de respirar tan desesperado y se ve con mejor color.'
        : '¡Ay, qué alivio, doctor! Con el oxígeno siento que ya me entra mejor el aire y no me ahogo tanto.';
    }
  }
  // 8. SALBUTAMOL / BRONCODILATADORES
  else if (/\b(salbutamol|albuterol|ipratropio|broncodilat)\b/.test(drugNorm)) {
    const mg =
      parsedDose.mg ??
      (parsedDose.puffs ? parsedDose.puffs * 0.1 : 5);
    const prevSaba = getCumulativePriorDoses(previousHistory, weightKg, /\b(salbutamol|albuterol)\b/);
    const totalMg = mg + prevSaba.mg;
    const isToxicInhaled = !isHyperkalemia && (mg >= 20 || mg / weightKg >= 0.6 || totalMg >= 35);
    const isToxicIV = isIV && mg >= 0.8;

    if (isToxicInhaled || isToxicIV) {
      hr = clamp(hr + clamp(Math.round(mg * 2.5), 28, 70), 75, 188);
      sys = clamp(sys - 12, 72, 210);
      effectSeverity = 'reaccion_adversa';
      summary = `Toxicidad beta-adrenérgica severa por sobredosis o vía inadecuada de Salbutamol (${cleanDose}, ${cleanRoute}): taquiarritmia (${hr} lpm), temblor intenso, hipokalemia aguda e isquemia demandante.`;
      patientFeelingNote =
        '¡Doctor, el corazón me va a estallar, me tiemblan muchísimo las manos y siento un mareo horrible!';
    } else if (isObstructiveAirway || spo2 < 95 || rr > 22 || isHyperkalemia) {
      const effectiveDoseMg = parsedDose.puffs ? Math.max(2.5, parsedDose.puffs * 1.2) : mg;
      const doseRatio = clamp(effectiveDoseMg / 5, 0.5, 2.2);
      const gain = clamp(Math.round((sameDrugCount >= 2 ? 2 : 5) * Math.min(1.4, doseRatio)), 2, 8);
      spo2 = clamp(spo2 + gain, 72, isCopd ? 94 : 99);
      rr = clamp(rr - clamp(Math.round(5 * doseRatio), 2, 8), 14, 44);
      hr = clamp(hr + Math.round((sameDrugCount >= 2 ? 5 : 8) * doseRatio), 55, 175);
      effectSeverity = effectiveDoseMg < 1 ? 'parcial' : 'mejoria';
      summary = isHyperkalemia
        ? `Broncodilatador beta-2 (${cleanDose}) favorece entrada celular de potasio como medida puente en hiperkalemia.`
        : `Broncodilatación dosis-dependiente (${cleanDose}): mejora SpO₂ y baja la frecuencia respiratoria, con taquicardia beta-2 adrenérgica proporcional.`;
      patientFeelingNote = isPediatric
        ? 'Después de la nebulización mi niño ya no chilla tanto al respirar y se le hunden menos las costillas, aunque está un poquito inquieto.'
        : 'Siento el pecho mucho más abierto después de la nebulización, doctor; respiro con menos silbido, aunque siento el corazón acelerado.';
    } else {
      hr = clamp(hr + 10, 55, 175);
      effectSeverity = 'sin_cambio';
      summary = 'Broncodilatador administrado sin broncoespasmo previo; se observa taquicardia beta-adrenérgica y temblor fino.';
      patientFeelingNote =
        'Doctor, con esa nebulización solo sentí temblor en las manos y el corazón más rápido, pero el malestar por el que vine sigue igual.';
    }
  }
  // 9. ADRENALINA / EPINEFRINA (IM vs IV vs Nebulizada en Crup)
  else if (/\b(adrenalina|epinefrina)\b/.test(drugNorm)) {
    const mg = parsedDose.mg ?? 0.5;
    const isCrup = diagNorm.includes('crup') || diagNorm.includes('laringotraque');

    if (isInhaled && isCrup) {
      if (mg > 6) {
        hr = clamp(hr + 32, 60, 185);
        effectSeverity = 'reaccion_adversa';
        summary = `Dosis excesiva de Adrenalina nebulizada (${cleanDose}) en crup pediátrico: taquicardia marcada.`;
        patientFeelingNote = 'Mi niño se puso muy agitado y con el corazón acelerado después de esa nebulización, doctor.';
      } else {
        spo2 = clamp(spo2 + 6, 75, 99);
        rr = clamp(rr - 6, 16, 46);
        hr = clamp(hr + 8, 60, 170);
        effectSeverity = 'mejoria';
        summary = `Vasoconstricción subglótica rápida tras Adrenalina nebulizada (${cleanDose}): disminuye el estridor laríngeo y mejora SpO₂.`;
        patientFeelingNote = '¡Doctor, la nebulización le ayudó muchísimo! Ya no ronca tan feo al meter aire.';
      }
    } else {
      const pedMaxSafeIm = Math.min(0.5, Math.max(0.15, Number((weightKg * 0.015).toFixed(2))));
      const isOverdoseIM = isPediatric ? mg >= pedMaxSafeIm * 2.5 : mg >= 1.2;
      if (isIV || isOverdoseIM) {
        const overdoseScale = clamp(mg / 0.5, 1.5, 8);
        sys = clamp(sys + Math.round(45 + overdoseScale * 12), 70, 250);
        dia = clamp(dia + Math.round(24 + overdoseScale * 7), 40, 150);
        hr = clamp(hr + Math.round(35 + overdoseScale * 10), 55, 192);
        if (mg >= 2 || sys >= 230) glasgow = clamp(glasgow - 6, 5, 9);
        effectSeverity = 'reaccion_adversa';
        if ((isIV && mg >= 2) || mg >= 5) {
          isImmediateDeath = true;
          immediateDeathReason = `Fibrilación ventricular refractaria y hemorragia intracerebral masiva por administrar ${cleanDose} (${cleanRoute}) de Adrenalina fuera de paro cardiorrespiratorio.`;
          summary = `Muerte inmediata por arritmia ventricular letal y crisis hipertensiva fulminante tras ${cleanDose} (${cleanRoute}) de Adrenalina.`;
        } else {
          summary = `Crisis adrenérgica / hipertensiva letal por dosis o vía inadecuada de Adrenalina (${cleanDose} ${cleanRoute}) fuera de paro cardiorrespiratorio: PA ${sys}/${dia} mmHg, taquiarritmia (${hr} lpm) y riesgo de hemorragia intracerebral.`;
        }
        patientFeelingNote =
          glasgow <= 9
            ? '[Crisis hipertensiva severa e inconsciencia súbita tras sobredosis/bolo IV de adrenalina]'
            : '¡Doctor, me dio un dolor fuertísimo en el pecho y la cabeza, siento que el corazón se me va a salir del pecho!';
      } else if (isAnaphylaxis || sys < 85) {
        if (mg < (isPediatric ? 0.08 : 0.15)) {
          sys = clamp(sys + 8, 65, 175);
          effectSeverity = 'parcial';
          summary = `Dosis subterapéutica de Adrenalina IM (${cleanDose}); en adulto administrar 0.3-0.5 mg IM (0.01 mg/kg en pediatría).`;
          patientFeelingNote = 'Mejoró apenitas, doctor, pero todavía siento la garganta apretada y mareo.';
        } else {
          sys = clamp(sys + 28, 75, 180);
          dia = clamp(dia + 16, 45, 115);
          spo2 = clamp(spo2 + 6, 75, 99);
          rr = clamp(rr - 4, 14, 42);
          hr = clamp(hr + (hr < 70 ? 22 : -4), 55, 165);
          glasgow = clamp(glasgow + (glasgow < 15 ? 1 : 0), 3, 15);
          effectSeverity = 'mejoria';
          summary =
            'Reversión alfa/beta adrenérgica de anafilaxia/choque distributivo con Adrenalina IM: recuperación rápida de la PA y permeabilidad aérea.';
          patientFeelingNote = isPediatric
            ? '¡Doctor, la inyección en la pierna le ayudó rapidísimo! Ya respira más despejado y volvió a abrir bien los ojos.'
            : '¡Doctor, siento que se me destapó la garganta y ya no me siento tan mareado después de la inyección en el muslo!';
        }
      } else {
        sys = clamp(sys + 30, 70, 225);
        dia = clamp(dia + 16, 40, 130);
        hr = clamp(hr + 30, 55, 180);
        effectSeverity = 'reaccion_adversa';
        summary =
          'Descarga adrenérgica intensa sin indicación de anafilaxia o paro: hipertensión reactiva y taquicardia marcada.';
        patientFeelingNote =
          '¡Doctor, me late rapidísimo el corazón y me duele fuerte la cabeza después de esa inyección!';
      }
    }
  }
  // 10. CRISTALOIDES IV (SSN 0.9% / HARTMANN / RINGER)
  else if (/\b(salina|ssn|hartmann|ringer|cristaloide|bolo|suero)\b/.test(drugNorm)) {
    const ml = parsedDose.ml ?? (isPediatric ? Math.round(weightKg * 20) : 500);
    const prevFluid = getCumulativePriorDoses(previousHistory, weightKg, /\b(salina|ssn|hartmann|ringer|cristaloide)\b/);
    const mlPerKg = ml / weightKg;
    const totalMlPerKg = (ml + prevFluid.ml) / weightKg;
    const isExcessiveFluidLoad =
      (isPulmonaryEdemaOrFluidOverload && sys >= 95) ||
      mlPerKg >= (isPediatric ? 45 : 50) ||
      totalMlPerKg >= 75 ||
      ml >= 3000;

    if (isExcessiveFluidLoad) {
      const overloadScale = clamp(ml / (isPediatric ? 500 : 1500), 1, 4);
      spo2 = clamp(spo2 - Math.round(5 * overloadScale), 65, 100);
      rr = clamp(rr + Math.round(5 * overloadScale), 12, 46);
      sys = clamp(sys + Math.round(8 * overloadScale), 65, 230);
      if (spo2 < 82) glasgow = clamp(glasgow - 2, 6, 15);
      effectSeverity = 'reaccion_adversa';
      summary = `Sobrecarga hídrica / edema pulmonar agudo iatrogénico tras ${ml} mL (${Math.round(mlPerKg)} mL/kg) de cristaloide: caída de SpO₂ a ${spo2}% y taquipnea severa.`;
      patientFeelingNote = isPediatric
        ? '¡Doctor, con tanto suero tan rápido mi niño empezó a respirar agitadísimo y se oye encharcado!'
        : '¡Doctor, siento que me ahogo muchísimo más desde que me pasaron tanto suero tan rápido!';
    } else if (isShockOrHypovolemic || sys < 110 || hr >= 98) {
      const refVol = isPediatric ? Math.max(150, weightKg * 20) : 500;
      const volRatio = clamp(ml / refVol, 0.3, 2.5);
      const baseSysGain = sys < 95 ? 16 : 11;
      const sysGain = Math.round(baseSysGain * Math.pow(volRatio, 0.72) * (sameDrugCount >= 2 ? 0.45 : 1));
      const diaGain = Math.round(sysGain * 0.58);
      const hrDrop = Math.round((hr > 100 ? 13 : 5) * Math.pow(volRatio, 0.7) * (sameDrugCount >= 2 ? 0.5 : 1));
      sys = clamp(sys + sysGain, 65, 175);
      dia = clamp(dia + diaGain, 42, 108);
      hr = clamp(hr - hrDrop, 55, 170);
      if (glasgow < 15 && bp.sys < 95) glasgow = clamp(glasgow + 1, 3, 15);
      effectSeverity = sysGain >= 8 ? 'mejoria' : 'parcial';
      summary = `Expansión intravascular con ${ml} mL de cristaloide: aumento de PA (+${sysGain}/+${diaGain} mmHg) y reducción refleja de la taquicardia compensadora.`;
      patientFeelingNote = isPediatric
        ? 'Con el suero en la venita mi niño ya no está tan frío ni decaído, se ve un poco más despejado.'
        : 'Con el suero intravenoso siento menos mareo al mover la cabeza y menos boca seca, doctor.';
    } else if (ml >= 2000) {
      spo2 = clamp(spo2 - 4, 72, 100);
      rr = clamp(rr + 4, 12, 42);
      sys = clamp(sys + 10, 70, 210);
      effectSeverity = 'reaccion_adversa';
      summary = `Carga masiva de volumen (${ml} mL) en paciente normotenso: riesgo de sobrecarga hídrica y congestión pulmonar.`;
      patientFeelingNote = 'Me siento agitado del pecho con tanto líquido que me pasaron rápido, doctor.';
    } else {
      effectSeverity = ml >= 1200 ? 'parcial' : 'sin_cambio';
      sys = clamp(sys + 3, 70, 210);
      summary =
        ml >= 1200
          ? `Infusión de ${ml} mL en paciente normotenso: aporte amplio sin beneficio hemodinámico adicional; vigilar balance hídrico.`
          : `Infusión de ${ml} mL en paciente hemodinámicamente estable.`;
      patientFeelingNote = 'El suero sigue pasando bien en la vena, doctor, me siento estable.';
    }
  }
  // 11. FUROSEMIDA IV
  else if (/\b(furosemida|diuretico)\b/.test(drugNorm)) {
    const mg = parsedDose.mg ?? 40;
    const isOverdoseFuro = mg >= 240 || (isPediatric && mg / weightKg >= 4);
    if ((isShockOrHypovolemic && !isPulmonaryEdemaOrFluidOverload) || isOverdoseFuro) {
      const ratio = clamp(mg / 40, 0.8, 5);
      sys = clamp(sys - Math.round(18 * ratio), 52, 220);
      dia = clamp(dia - Math.round(10 * ratio), 30, 130);
      hr = clamp(hr + Math.round(14 * ratio), 55, 180);
      if (sys < 80) glasgow = clamp(glasgow - 2, 6, 15);
      effectSeverity = 'reaccion_adversa';
      summary = isOverdoseFuro
        ? `Sobredosis de Furosemida (${cleanDose}): depleción intravascular severa, hipotensión aguda y riesgo de ototoxicidad/arritmia.`
        : `Contraindicación hemodinámica: Furosemida (${cleanDose}) en paciente con choque/hipovolemia/cetoacidosis agrava hipoperfusión e insuficiencia prerrenal.`;
      patientFeelingNote =
        '¡Doctor, me siento muchísimo más mareado, débil y con palpitaciones después de ese diurético!';
    } else if (isPulmonaryEdemaOrFluidOverload || spo2 < 94) {
      const ratio = clamp(mg / 40, 0.4, 3.0);
      spo2 = clamp(spo2 + Math.round(5 * Math.min(1.5, ratio)), 74, 99);
      rr = clamp(rr - Math.round(5 * Math.min(1.4, ratio)), 14, 42);
      sys = clamp(sys - Math.round((sys > 130 ? 12 : 6) * ratio), 78, 220);
      hr = clamp(hr - (sys >= 95 ? 6 : -8), 55, 170);
      effectSeverity = sys < 90 ? 'reaccion_adversa' : 'mejoria';
      summary =
        sys < 90
          ? `Diuresis y venodilatación intensa tras ${cleanDose} de furosemida con caída excesiva de presión arterial.`
          : `Venodilatación y diuresis tras ${cleanDose} de furosemida: reduce precarga pulmonar y mejora SpO₂.`;
      patientFeelingNote =
        sys < 90
          ? 'Ya respiro un poco mejor pero me siento muy mareado y flojo desde que me pusieron esa dosis alta, doctor.'
          : 'Ya siento menos ahogo en el pecho y ganas de orinar después de la ampolla, doctor.';
    } else {
      const ratio = clamp(mg / 40, 0.4, 3.0);
      sys = clamp(sys - Math.round(14 * ratio), 64, 220);
      dia = clamp(dia - Math.round(8 * ratio), 38, 130);
      hr = clamp(hr + Math.round(10 * ratio), 55, 170);
      effectSeverity = sys < 90 ? 'reaccion_adversa' : 'sin_cambio';
      summary = `Diurético (${cleanDose}) aplicado sin sobrecarga hídrica: depleción intravascular y descenso tensional.`;
      patientFeelingNote =
        sys < 90
          ? 'Me dieron muchas ganas de orinar y me siento muy mareado y débil, doctor.'
          : 'Solo me dieron ganas de ir al baño, doctor, pero el problema principal sigue igual.';
    }
  }
  // 12. DEXTROSA IV
  else if (/\b(dextrosa|glucosa|glucosada)\b/.test(drugNorm)) {
    let grams = parsedDose.mg ? parsedDose.mg / 1000 : 25;
    if (!parsedDose.mg && parsedDose.ml) {
      const pct = parsedDose.percent ?? (drugNorm.includes('50') ? 50 : drugNorm.includes('10') ? 10 : drugNorm.includes('5') ? 5 : 50);
      grams = (parsedDose.ml * pct) / 100;
    }
    const scale = clamp(grams / 25, 0.3, 4.5);
    const gaveThiamine = previousHistory.some((h) => /\b(tiamina|vitamina b1)\b/.test(norm(h.drug)));

    if (isAlcoholWithdrawal && !gaveThiamine) {
      if (typeof glucose === 'number') {
        glucose = clamp(glucose + Math.round(60 * scale), 40, 650);
      }
      glasgow = clamp(glasgow - 2, 6, 15);
      effectSeverity = 'reaccion_adversa';
      summary =
        'Riesgo crítico: administración de Dextrosa IV sin Tiamina (Vitamina B1) previa en paciente con abstinencia alcohólica/Delirium Tremens; puede precipitar Encefalopatía de Wernicke aguda.';
      patientFeelingNote =
        'Doctor, me siento más desorientado, veo doble y me cuesta enfocar la vista...';
    } else if (typeof glucose === 'number' && glucose < 75) {
      const gain = Math.round(85 * clamp(grams / 25, 0.4, 2.5));
      glucose = clamp(glucose + gain, 35, 340);
      hr = clamp(hr - (hr > 95 ? 16 : 4), 58, 160);
      if (sys < 90) sys = clamp(sys + 16, 65, 160);
      glasgow = clamp(Math.max(glasgow + 4, 14), 3, 15);
      effectSeverity = 'mejoria';
      summary = `Corrección rápida de hipoglucemia (+${gain} mg/dL → ${glucose} mg/dL) tras ${cleanDose} de dextrosa: recuperación del estado de alerta (Glasgow ${glasgow}/15).`;
      patientFeelingNote = isPediatric
        ? '¡Doctor, despertó enseguida con el suero dulce! Ya me mira y dejó de temblar.'
        : '¡Qué cambio, doctor! Se me quitó el temblor, el sudor frío y ya pienso con claridad otra vez.';
    } else {
      if (typeof glucose === 'number') {
        glucose = clamp(glucose + Math.round(52 * scale), 40, 700);
      }
      const hyperComa = typeof glucose === 'number' && glucose >= 350;
      effectSeverity = hyperComa || grams >= 80 ? 'reaccion_adversa' : 'sin_cambio';
      summary =
        typeof glucose === 'number' && glucose >= 250
          ? `Aporte contraindicado de dextrosa (${cleanDose}) en paciente hiperglucémico: empeora hiperosmolaridad (glucemia sube a ${glucose} mg/dL).`
          : 'Aporte de dextrosa sin hipoglucemia previa; elevación glucémica sin beneficio clínico.';
      patientFeelingNote = hyperComa
        ? 'Doctor, tengo muchísima sed, la boca seca y me siento muy embotado...'
        : 'Sentí un poco de ardor en la vena con el suero, doctor, pero mis molestias siguen igual.';
    }
  }
  // 13. OPIOIDES / BENZODIACEPINAS (Morfina, Fentanilo, Tramadol, Diazepam, Lorazepam, Midazolam)
  else if (/\b(morfina|fentanilo|tramadol|diazepam|lorazepam|midazolam|clonazepam|alprazolam)\b/.test(drugNorm)) {
    const isFentanyl = drugNorm.includes('fentanilo');
    const isMorphine = drugNorm.includes('morfina');
    const isTramadol = drugNorm.includes('tramadol');
    const isLorazOrMidaz = /\b(lorazepam|midazolam|clonazepam)\b/.test(drugNorm);
    const isDiazepam = drugNorm.includes('diazepam');

    const defaultMg = isFentanyl ? 0.05 : isMorphine ? 4 : isLorazOrMidaz ? 2 : isTramadol ? 50 : 10;
    const mg = parsedDose.mg ?? defaultMg;
    const prevSed = getCumulativePriorDoses(
      previousHistory,
      weightKg,
      /\b(morfina|fentanilo|diazepam|lorazepam|midazolam)\b/
    );
    const mgPerKg = mg / weightKg;

    // Umbrales toxicológicos reales diferenciados por potencia (Fentanilo 100x más potente que morfina)
    const severeOpioid =
      (isFentanyl && (mg >= 0.25 || mgPerKg >= 0.004)) ||
      (isMorphine && (mg >= 10 || mgPerKg >= 0.22 || mg + prevSed.mg >= 20)) ||
      (isTramadol && (mg >= 350 || mgPerKg >= 6));
    const lethalOpioid =
      (isFentanyl && mg >= 0.5) ||
      (isMorphine && mg >= 25) ||
      (isTramadol && mg >= 600);

    const severeBenzo =
      (isLorazOrMidaz && (mg >= 8 || mgPerKg >= 0.25)) ||
      (isDiazepam && (mg >= 25 || mgPerKg >= 0.55));
    const lethalBenzo =
      (isLorazOrMidaz && mg >= 18) ||
      (isDiazepam && mg >= 50);

    const isObstructiveContra = isObstructiveAirway && !isFentanyl && !isTramadol ? true : isObstructiveAirway && (isMorphine || isFentanyl || isDiazepam || isLorazOrMidaz);
    const isHypotensiveContra = sys < 90 && (isMorphine || isDiazepam || isLorazOrMidaz);

    const fulminantArrest =
      (isFentanyl && mg >= 2.0) ||
      (isMorphine && mg >= 60) ||
      (isLorazOrMidaz && mg >= 40) ||
      (isDiazepam && mg >= 100);

    if (lethalOpioid || lethalBenzo || severeOpioid || severeBenzo || isObstructiveContra || isHypotensiveContra) {
      const isApneaLevel = lethalOpioid || lethalBenzo;
      rr = clamp(rr - (isApneaLevel ? 14 : 8), isApneaLevel ? 4 : 7, 40);
      spo2 = clamp(spo2 - (isApneaLevel ? 22 : 8), 65, 100);
      sys = clamp(sys - (isApneaLevel ? 36 : 20), 54, 220);
      dia = clamp(dia - (isApneaLevel ? 20 : 12), 32, 130);
      hr = clamp(hr - (isApneaLevel ? 28 : 10), 36, 170);
      glasgow = clamp(glasgow - (isApneaLevel || spo2 < 86 ? 9 : 6), 3, isApneaLevel || spo2 < 86 ? 8 : 9);
      effectSeverity = 'reaccion_adversa';
      if (fulminantArrest) {
        isImmediateDeath = true;
        immediateDeathReason = `Apnea fulminante y paro cardiorrespiratorio hipóxico irreversible tras sobredosis extrema de ${cleanDrug} (${cleanDose}).`;
        summary = `Muerte inmediata por apnea fulminante y paro hipóxico tras sobredosis extrema de ${cleanDrug} (${cleanDose}).`;
      } else {
        summary = isApneaLevel
          ? `Sobredosis letal y paro respiratorio inminente por ${cleanDrug} (${cleanDose}): bradipnea extrema (FR ${rr} rpm), hipoxemia grave (SpO₂ ${spo2}%), coma (Glasgow ${glasgow}/15) — requiere Naloxona/Flumazenil y ventilación asistida inmediata.`
          : `Depresión respiratoria y hemodinámica aguda tras ${cleanDose} de ${cleanDrug}${isObstructiveContra ? ' en paciente con insuficiencia respiratoria obstructiva' : isHypotensiveContra ? ' en paciente con choque/hipotensión' : ''}: FR cae a ${rr} rpm, SpO₂ a ${spo2}% y paciente inconsciente (Glasgow ${glasgow}/15).`;
      }
      patientFeelingNote =
        glasgow <= 9
          ? '[Alerta crítica: paciente inconsciente en coma con pausas apneicas y cianosis tras dosis depresora del SNC]'
          : 'Doctor... tengo muchísimo sueño... siento los párpados muy pesados y respiro muy lento...';
    } else if (isSeizureOrEclampsia || diagNorm.includes('ansiedad') || diagNorm.includes('abstinencia') || isIschemicChestPain || isMorphine || isFentanyl || isTramadol) {
      hr = clamp(hr - (hr > 96 ? 12 : 5), 55, 165);
      rr = clamp(rr - (rr > 20 ? 3 : 1), 12, 38);
      if ((isMorphine || isFentanyl) && sys > 105) sys = clamp(sys - 6, 85, 220);
      effectSeverity = 'mejoria';
      summary = `Control sintomático adecuado tras ${cleanDose} de ${cleanDrug} sin compromiso ventilatorio.`;
      patientFeelingNote = isPediatric
        ? 'Ya se quedó más calmadito y sin tanto dolor o sacudidas, doctor.'
        : 'Ya me calmó bastante el dolor y la angustia, doctor; me siento más tranquilo.';
    } else {
      rr = clamp(rr - 2, 11, 38);
      effectSeverity = 'parcial';
      summary = `Sedación/analgesia administrada (${cleanDose}); vigilar frecuencia respiratoria.`;
      patientFeelingNote = 'Me siento algo más relajado y con un poco de sueño, doctor.';
    }
  }
  // 14. ÁCIDO ACETILSALICÍLICO (ASA)
  else if (isAsaDrug || drugNorm.includes('clopidogrel')) {
    if (isIschemicChestPain) {
      effectSeverity = 'mejoria';
      summary = 'Antiagregación plaquetaria de carga iniciada en ventana coronaria.';
      patientFeelingNote =
        'Ya mastiqué la pastilla, doctor. Todavía siento molestia en el pecho pero estoy atento.';
    } else {
      effectSeverity = 'sin_cambio';
      summary = 'Antiagregante administrado; sin variación inmediata en signos vitales.';
      patientFeelingNote = 'Ya me tragué la pastilla, doctor, sigo esperando sentir alivio.';
    }
  }
  // 15. PARACETAMOL / METAMIZOL
  else if (/\b(paracetamol|acetaminofen|antipiret|metamizol|dipirona)\b/.test(drugNorm)) {
    const mg = parsedDose.mg ?? 1000;
    const isParacetamol = /\b(paracetamol|acetaminofen)\b/.test(drugNorm);
    const isMetamizol = /\b(metamizol|dipirona)\b/.test(drugNorm);
    const isHepatotoxicOverdose = isParacetamol && (mg >= 4000 || (isPediatric && mg / weightKg >= 75));

    if (isMetamizol && sys < 100) {
      sys = clamp(sys - 22, 54, 220);
      dia = clamp(dia - 12, 32, 130);
      hr = clamp(hr + 18, 50, 178);
      effectSeverity = 'reaccion_adversa';
      summary = `Hipotensión severa agravada por Metamizol (${cleanDose}) en paciente hemodinámicamente inestable (PA cae a ${sys}/${dia} mmHg).`;
      patientFeelingNote = '¡Doctor, me dio mucho mareo y sudor frío después de esa ampolla!';
    } else if (isHepatotoxicOverdose) {
      effectSeverity = 'reaccion_adversa';
      summary = `Sobredosis aguda de Paracetamol (${cleanDose}, ${Math.round(mg / weightKg)} mg/kg): alto riesgo de necrosis hepática aguda fulminante — requiere N-acetilcisteína.`;
      patientFeelingNote =
        'Doctor, me siento con náuseas fuertes y dolor en la boca del estómago tras esa dosis tan grande.';
    } else if (temp >= 37.8) {
      const scale = clamp(mg / 1000, 0.5, 1.3);
      const tempDrop = Number((0.8 * scale * (sameDrugCount >= 1 ? 0.5 : 1)).toFixed(1));
      temp = Number(clamp(temp - tempDrop, 36.4, 41.5).toFixed(1));
      hr = clamp(hr - (hr > 95 ? 8 : 4), 55, 165);
      effectSeverity = 'mejoria';
      summary = `Descenso térmico progresivo (-${tempDrop.toFixed(1)} °C) y alivio de taquicardia febril tras ${cleanDose} de ${cleanDrug}.`;
      patientFeelingNote = isPediatric
        ? 'Ya le empezó a bajar un poco la calentura al niño, doctor; empezó a sudar suave y se queja menos.'
        : 'Ya siento que me está bajando la calentura y el dolor de cuerpo, doctor.';
    } else {
      effectSeverity = 'parcial';
      hr = clamp(hr - (hr > 95 ? 4 : 0), 55, 165);
      summary = 'Analgésico administrado en paciente afebril; leve mejoría de malestar.';
      patientFeelingNote = 'Siento un alivio ligero del malestar general, doctor.';
    }
  }
  // 16. ANTIEMÉTICOS
  else if (/\b(ondansetron|metoclopramida|dimenhidrinato|antiemet)\b/.test(drugNorm)) {
    const mg = parsedDose.mg ?? 4;
    if (drugNorm.includes('ondansetron') && (mg >= 24 || (isPediatric && mg / weightKg >= 0.6))) {
      hr = clamp(hr + 30, 55, 182);
      effectSeverity = 'reaccion_adversa';
      summary = `Sobredosis de Ondansetrón (${cleanDose}): riesgo grave de prolongación del intervalo QT y arritmia ventricular (Torsades de Pointes).`;
      patientFeelingNote = 'Doctor, siento palpitaciones irregulares y mucho mareo después de esa dosis tan alta.';
    } else {
      hr = clamp(hr - (hr > 98 ? 5 : 2), 55, 165);
      effectSeverity = 'mejoria';
      summary = 'Control del reflejo emético y disminución leve del tono autonómico nauseoso.';
      patientFeelingNote = isPediatric
        ? 'Parece que ya se le calmó el asco al niño, doctor; no ha vuelto a tener arcadas.'
        : 'Ya se me asentó bastante el estómago y se me quitó esa sensación de querer vomitar, doctor.';
    }
  }
  // 17. CORTICOIDES SISTÉMICOS
  else if (/\b(hidrocortisona|dexametasona|metilprednisolona|prednisona|corticoide|esteroide)\b/.test(drugNorm)) {
    if (isDengue) {
      effectSeverity = 'reaccion_adversa';
      summary =
        'Uso no indicado / perjudicial de corticoides sistémicos en Dengue: no reducen la fuga plasmática y aumentan el riesgo de sangrado digestivo e inmunosupresión.';
      patientFeelingNote = 'Siento ardor en el estómago y sigo igual de decaído, doctor.';
    } else if (isObstructiveAirway || isAnaphylaxis || diagNorm.includes('meningitis') || diagNorm.includes('crup') || diagNorm.includes('suprarrenal')) {
      if (diagNorm.includes('suprarrenal') && sys < 95) {
        sys = clamp(sys + 16, 65, 165);
        dia = clamp(dia + 10, 40, 100);
        effectSeverity = 'mejoria';
        summary = 'Reemplazo glucocorticoide de urgencia en crisis suprarrenal: restaura sensibilidad vascular a catecolaminas y estabiliza PA.';
      } else {
        rr = clamp(rr - (rr > 22 ? 2 : 0), 14, 42);
        spo2 = clamp(spo2 + (spo2 < 95 ? 2 : 0), 74, 99);
        effectSeverity = 'parcial';
        summary = 'Corticoide sistémico administrado: inicio de efecto antiinflamatorio (efecto pleno en 1-4 h).';
      }
      patientFeelingNote = isPediatric
        ? 'Ya le pasaron la dosis para desinflamar; mi niño parece tolerarla bien mientras respira más tranquilo.'
        : 'Sentí un poquito de calor al pasar el medicamento, doctor, sigo esperando que desinflame más.';
    } else {
      effectSeverity = 'sin_cambio';
      summary = 'Corticoide sistémico administrado sin cambios agudos inmediatos en monitor.';
      patientFeelingNote = 'Ya me pusieron esa dosis, doctor; por ahora me siento muy parecido.';
    }
  }
  // 18. SULFATO DE MAGNESIO IV
  else if (/\b(sulfato de magnesio|magnesio|mgso4)\b/.test(drugNorm)) {
    const grams = parsedDose.mg ? parsedDose.mg / 1000 : 4;
    const prevMg = getCumulativePriorDoses(previousHistory, weightKg, /\b(sulfato de magnesio|mgso4|magnesio)\b/);
    const totalGrams = grams + prevMg.mg / 1000;
    const renalRisk = isRenalFailureOrHyperK && totalGrams >= 4;
    const severeMg = grams >= 8 || totalGrams >= 10 || (isPediatric && (grams * 1000) / weightKg >= 100) || renalRisk;
    const lethalMg = grams >= 12 || totalGrams >= 16;

    if (severeMg) {
      const scale = lethalMg ? 2.2 : 1.0;
      rr = clamp(rr - Math.round(7 * scale), 5, 40);
      spo2 = clamp(spo2 - Math.round(6 * scale), 70, 100);
      sys = clamp(sys - Math.round(18 * scale), 56, 220);
      dia = clamp(dia - Math.round(11 * scale), 32, 130);
      hr = clamp(hr - Math.round(16 * scale), 36, 170);
      glasgow = clamp(glasgow - Math.round(6 * scale), 4, 9);
      effectSeverity = 'reaccion_adversa';
      if (grams >= 20 || totalGrams >= 24) {
        isImmediateDeath = true;
        immediateDeathReason = `Parálisis respiratoria completa y bloqueo auriculoventricular total irreversible por hipermagnesemia extrema tras ${cleanDose} de Sulfato de Magnesio.`;
        summary = `Muerte inmediata por hipermagnesemia letal tras ${cleanDose} de Sulfato de Magnesio.`;
      } else {
        summary = `Hipermagnesemia severa / bloqueo neuromuscular por ${lethalMg ? 'sobredosis grave de' : renalRisk ? 'acumulación renal de' : 'dosis excesiva de'} Sulfato de Magnesio (${cleanDose}): arreflexia, bradipnea (FR ${rr} rpm), hipotensión e inconsciencia (Glasgow ${glasgow}/15; antídoto: Gluconato de Calcio IV).`;
      }
      patientFeelingNote =
        glasgow <= 9
          ? '[Alerta crítica: paciente inconsciente con flacidez muscular generalizada y bradipnea severa por hipermagnesemia]'
          : 'Doctor, siento mucho bochorno, muchísima pesadez muscular y me cuesta trabajo mantener los ojos abiertos o respirar hondo...';
    } else if (isSeizureOrEclampsia || isObstructiveAirway) {
      sys = clamp(sys - (sys > 140 ? 10 : 4), 85, 220);
      dia = clamp(dia - (dia > 90 ? 6 : 2), 50, 130);
      rr = clamp(rr - (rr > 22 ? 3 : 1), 12, 40);
      spo2 = clamp(spo2 + (spo2 < 94 ? 3 : 0), 74, 99);
      effectSeverity = 'mejoria';
      summary = 'Neuroprotección y estabilización neuromuscular/bronquial tras impregnación con Sulfato de Magnesio.';
      patientFeelingNote =
        'Sentí bastante calor en la cara y el brazo mientras pasaba el suero, doctor, pero ya me siento más tranquila.';
    } else {
      effectSeverity = 'sin_cambio';
      summary = 'Sulfato de magnesio administrado sin cambios agudos relevantes.';
      patientFeelingNote = 'Sentí calor en el cuerpo al pasar el suero, doctor.';
    }
  }
  // 19. ATROPINA / ANTIARRÍTMICOS / GLUCONATO DE CALCIO / TROMBOLÍTICOS
  else if (/\b(atropina)\b/.test(drugNorm)) {
    const mg = parsedDose.mg ?? 1;
    if (!isOrganophosphate && (mg >= 4 || hr >= 115)) {
      hr = clamp(hr + 46, 70, 186);
      glasgow = clamp(glasgow - 2, 7, 15);
      effectSeverity = 'reaccion_adversa';
      summary = `Toxicidad anticolinérgica / taquiarritmia severa tras ${cleanDose} de Atropina (${hr} lpm) sin bradicardia ni intoxicación colinérgica.`;
      patientFeelingNote = '¡Doctor, tengo la boca completamente seca, veo borroso y el corazón me galopa rapidísimo!';
    } else if (hr < 58 || isOrganophosphate) {
      hr = clamp(hr + 28, 55, 130);
      spo2 = clamp(spo2 + (isOrganophosphate ? 4 : 0), 75, 100);
      effectSeverity = 'mejoria';
      summary = isOrganophosphate
        ? `Atropinización efectiva (${cleanDose}): disminuye broncorrea colinérgica y mejora FC (${hr} lpm).`
        : `Incremento cronotrópico tras Atropina (${cleanDose}): FC sube a ${hr} lpm.`;
      patientFeelingNote = 'Ya siento la respiración más limpia y menos mareo, doctor.';
    } else {
      hr = clamp(hr + 22, 60, 170);
      effectSeverity = 'sin_cambio';
      summary = 'Atropina aplicada con taquicardia leve esperada sin beneficio hemodinámico adicional.';
      patientFeelingNote = 'Siento la boca un poco seca y el pulso más rápido, doctor.';
    }
  } else if (/\b(gluconato de calcio|cloruro de calcio)\b/.test(drugNorm)) {
    const hasRecentMgToxicity = previousHistory.some(
      (h) => h.effectSeverity === 'reaccion_adversa' && /\b(magnesio|mgso4)\b/.test(norm(h.drug))
    );
    if (hasRecentMgToxicity) {
      rr = clamp(Math.max(rr + 7, 15), 12, 36);
      spo2 = clamp(Math.max(spo2 + 8, 95), 75, 99);
      sys = clamp(sys + (sys < 95 ? 20 : 6), 70, 180);
      dia = clamp(dia + (dia < 60 ? 12 : 4), 42, 110);
      hr = clamp(Math.max(hr + 16, 68), 55, 160);
      glasgow = clamp(Math.max(glasgow + 6, 14), 3, 15);
      effectSeverity = 'mejoria';
      summary = `Reversión rápida de bloqueo neuromuscular por hipermagnesemia tras ${cleanDose} de Calcio IV: recuperación ventilatoria (FR ${rr} rpm) y neurológica (Glasgow ${glasgow}/15).`;
      patientFeelingNote = 'Ya puedo abrir los ojos y respirar mejor, doctor; se me quitó esa debilidad paralizante.';
    } else if (isHyperkalemia) {
      hr = clamp(hr + (hr < 55 ? 12 : 0), 50, 155);
      effectSeverity = 'mejoria';
      summary = 'Estabilización inmediata de membrana miocárdica con Calcio IV en hiperkalemia severa.';
      patientFeelingNote = 'Sentí un calorcito breve en el cuerpo al pasar la ampolla, doctor, sigo vigilado.';
    } else {
      effectSeverity = 'sin_cambio';
      summary = 'Calcio IV administrado sin alteración hidroelectrolítica hiperkalémica aguda documentada.';
      patientFeelingNote = 'Sentí calor ligero al pasar la medicina por la vena, doctor.';
    }
  } else if (/\b(naloxona|flumazenil|acetilcisteina|n acetilcisteina|nac)\b/.test(drugNorm)) {
    if (drugNorm.includes('naloxona')) {
      const hadOpioidDepression =
        rr <= 11 ||
        glasgow <= 11 ||
        previousHistory.some((h) => /\b(morfina|fentanilo|tramadol)\b/.test(norm(h.drug)));
      if (hadOpioidDepression) {
        rr = clamp(Math.max(rr + 9, 16), 14, 34);
        spo2 = clamp(Math.max(spo2 + 16, 96), 80, 99);
        sys = clamp(sys + (sys < 95 ? 22 : 6), 75, 175);
        hr = clamp(Math.max(hr + 18, 72), 55, 165);
        glasgow = clamp(Math.max(glasgow + 8, 14), 3, 15);
        effectSeverity = 'mejoria';
        summary = `Antagonismo opioide inmediato con Naloxona (${cleanDose}): recuperación rápida del impulso respiratorio (FR ${rr} rpm, SpO₂ ${spo2}%) y del estado de alerta (Glasgow ${glasgow}/15).`;
        patientFeelingNote = '¡Ay, doctor, desperté de golpe! Ya puedo respirar hondo otra vez.';
      } else {
        effectSeverity = 'sin_cambio';
        summary = 'Naloxona administrada sin depresión opioide documentada.';
        patientFeelingNote = 'Ya me pasaron ese medicamento, doctor, sigo igual.';
      }
    } else if (drugNorm.includes('flumazenil')) {
      const hadBenzoDepression =
        rr <= 11 ||
        glasgow <= 11 ||
        previousHistory.some((h) => /\b(diazepam|lorazepam|midazolam|clonazepam)\b/.test(norm(h.drug)));
      if (hadBenzoDepression) {
        rr = clamp(Math.max(rr + 7, 15), 14, 34);
        spo2 = clamp(Math.max(spo2 + 12, 95), 80, 99);
        glasgow = clamp(Math.max(glasgow + 8, 14), 3, 15);
        effectSeverity = 'mejoria';
        summary = `Reversión de sedación profunda por benzodiacepinas con Flumazenil (${cleanDose}): recuperación ventilatoria y de conciencia (Glasgow ${glasgow}/15; vigilar resedación).`;
        patientFeelingNote = 'Ya se me despejó la cabeza y ya no siento los párpados tan pesados, doctor.';
      } else {
        effectSeverity = 'sin_cambio';
        summary = 'Flumazenil administrado sin intoxicación aguda por benzodiacepinas documentada.';
        patientFeelingNote = 'No siento un cambio claro con esa dosis, doctor.';
      }
    } else {
      effectSeverity = 'mejoria';
      summary = `Antídoto N-acetilcisteína (${cleanDose}) iniciado oportunamente para protección hepática por glutatión.`;
      patientFeelingNote = 'Sigo bajo cuidado con el suero protector, doctor, algo menos de náusea.';
    }
  } else if (/\b(amiodarona|lidocaina|digoxina)\b/.test(drugNorm)) {
    const mg = parsedDose.mg ?? 150;
    const isToxic =
      (drugNorm.includes('digoxina') && mg >= 1.5) ||
      (drugNorm.includes('lidocaina') && mg >= 300) ||
      (drugNorm.includes('amiodarona') && mg >= 900);
    const isFatalAntiarrhythmic =
      (drugNorm.includes('digoxina') && mg >= 5) ||
      (drugNorm.includes('lidocaina') && mg >= 1000) ||
      (drugNorm.includes('amiodarona') && mg >= 2000);
    if (isFatalAntiarrhythmic) {
      isImmediateDeath = true;
      effectSeverity = 'reaccion_adversa';
      immediateDeathReason = `Asistolia / fibrilación ventricular refractaria por dosis fulminante de ${cleanDrug} (${cleanDose}).`;
      summary = `Muerte inmediata por paro cardíaco tóxico tras sobredosis letal de ${cleanDrug} (${cleanDose}).`;
    } else if (isToxic) {
      hr = clamp(hr - 36, 32, 160);
      sys = clamp(sys - 32, 54, 210);
      glasgow = clamp(glasgow - 6, 5, 9);
      effectSeverity = 'reaccion_adversa';
      summary = `Toxicidad antiarrítmica severa tras sobredosis de ${cleanDrug} (${cleanDose}): bradicardia extrema (${hr} lpm), hipotensión e inconsciencia (Glasgow ${glasgow}/15).`;
      patientFeelingNote = '[Alerta crítica: paciente inconsciente con bradicardia severa e hipotensión aguda tras dosis tóxica de antiarrítmico]';
    } else {
      hr = clamp(hr - (hr > 110 ? 22 : 4), 52, 165);
      effectSeverity = hr >= 52 ? 'mejoria' : 'reaccion_adversa';
      summary = `Antiarrítmico (${cleanDose} de ${cleanDrug}) administrado con control de frecuencia cardíaca.`;
      patientFeelingNote = 'Siento el pecho un poco más calmado ahora, doctor.';
    }
  } else if (/\b(alteplasa|tenecteplasa|estreptoquinasa|heparina|enoxaparina)\b/.test(drugNorm)) {
    const isAltepFatal = /\b(alteplasa|tenecteplasa)\b/.test(drugNorm) && parsedDose.mg !== null && parsedDose.mg >= 200;
    const isAltepOverdose = /\b(alteplasa|tenecteplasa)\b/.test(drugNorm) && parsedDose.mg !== null && parsedDose.mg >= 120;
    const isHeparinOverdose = drugNorm.includes('heparina') && parsedDose.ui !== null && parsedDose.ui >= 20000;
    if (isAltepFatal) {
      isImmediateDeath = true;
      effectSeverity = 'reaccion_adversa';
      immediateDeathReason = `Hemorragia intracerebral masiva irreversible por sobredosis extrema de trombolítico (${cleanDose} de ${cleanDrug}).`;
      summary = `Muerte inmediata por hemorragia masiva tras sobredosis letal de ${cleanDrug} (${cleanDose}).`;
    } else if (isAltepOverdose || isHeparinOverdose) {
      effectSeverity = 'reaccion_adversa';
      sys = clamp(sys - 28, 56, 220);
      hr = clamp(hr + 28, 55, 180);
      glasgow = clamp(glasgow - 6, 5, 9);
      summary = `Sobredosis de anticoagulante/fibrinolítico (${cleanDose} de ${cleanDrug}): riesgo crítico de hemorragia intracerebral o sistémica mayor e inconsciencia (Glasgow ${glasgow}/15).`;
      patientFeelingNote = '[El paciente presentó cefalea explosiva súbita y pérdida de conciencia tras sobredosis fibrinolítica/anticoagulante]';
    } else {
      effectSeverity = isIschemicChestPain || diagNorm.includes('ictus isquemico') || diagNorm.includes('tromboembolia') ? 'mejoria' : 'parcial';
      summary = `Terapia antitrombótica/reperfusión (${cleanDose} de ${cleanDrug}) administrada bajo vigilancia estricta de sangrado.`;
      patientFeelingNote = 'Ya me pasaron la medicación por la vena, doctor, sigo quieto y vigilado.';
    }
  }
  // 20. OTROS FÁRMACOS ESCRITOS POR EL CLÍNICO
  else {
    if (/\b(clorfeniramina|difenhidramina|loratadina|cetirizina)\b/.test(drugNorm) && (isAnaphylaxis || diagNorm.includes('urticaria') || diagNorm.includes('alerg'))) {
      hr = clamp(hr - (hr > 100 ? 6 : 2), 55, 165);
      effectSeverity = 'parcial';
      summary = 'Antihistamínico H1 administrado: alivio de prurito/urticaria (recordar que en anafilaxia no sustituye a la adrenalina IM).';
      patientFeelingNote = 'Ya me pica un poquito menos la piel y siento algo de sueño, doctor.';
    } else if (/\b(ceftriaxona|ampicilina|amoxicilina|azitromicina|levofloxacino|meropenem|vancomicina|clindamicina|metronidazol|piperacilina|gentamicina|amikacina)\b/.test(drugNorm)) {
      const isAminoglycoside = /\b(gentamicina|amikacina)\b/.test(drugNorm);
      const isGiantDose = parsedDose.mg !== null && parsedDose.mg >= 10000;
      if ((isAminoglycoside && isRenalFailureOrHyperK) || isGiantDose) {
        effectSeverity = 'reaccion_adversa';
        summary = isGiantDose
          ? `Sobredosis masiva de antimicrobiano (${cleanDose} de ${cleanDrug}): riesgo agudo de neurotoxicidad/convulsiones o toxicidad vascular.`
          : `Nefrotoxicidad aguda por aminoglucósido (${cleanDrug}) en paciente con Lesión Renal Aguda.`;
        patientFeelingNote = '¡Doctor, me siento muy mal y mareado desde que me empezaron a pasar ese antibiótico!';
      } else {
        effectSeverity = 'parcial';
        summary = 'Primera dosis antimicrobiana administrada en ventana oportuna; requiere horas para respuesta térmica/hemodinámica.';
        patientFeelingNote = isPediatric
          ? 'Ya le pasaron la primera dosis del antibiótico por la vena, doctor; el niño sigue vigilado.'
          : 'Ya me pasaron ese antibiótico por la vena, doctor; por ahora me siento parecido mientras hace efecto.';
      }
    } else if (/\b(butilhioscina|buscapina|omeprazol|pantoprazol)\b/.test(drugNorm)) {
      hr = clamp(hr - (hr > 96 ? 8 : 3), 55, 165);
      rr = clamp(rr - (rr > 20 ? 2 : 0), 12, 38);
      effectSeverity = 'mejoria';
      summary = `Alivio sintomático tras ${cleanDose} de ${cleanDrug} con reducción de taquicardia secundaria al dolor.`;
      patientFeelingNote = isPediatric
        ? 'Parece que le calmó bastante el dolorcito, doctor; ya no llora con tanta fuerza.'
        : 'Sí me calmó bastante la intensidad de la molestia, doctor, ya me siento más aliviado.';
    } else {
      effectSeverity = 'sin_cambio';
      summary = `Orden STAT "${cleanDrug} (${cleanDose}, ${cleanRoute})" administrada; sin variación hemodinámica inmediata en monitor.`;
      patientFeelingNote = isPediatric
        ? `Ya le aplicaron ${cleanDrug}, doctor. Mi niño sigue bajo observación sin cambios bruscos por ahora.`
        : `Ya me aplicaron ${cleanDrug}, doctor; por ahora sigo atento a ver cómo evoluciono.`;
    }
  }

  if (isImmediateDeath) {
    sys = 0;
    dia = 0;
    hr = 0;
    rr = 0;
    spo2 = 0;
    glasgow = 3;
    effectSeverity = 'reaccion_adversa';
    patientFeelingNote =
      '[CÓDIGO AZUL · MUERTE INMEDIATA: El paciente entró en asistolia irreversible sin pulso ni ventilación espontánea.]';
  }

  const updatedVitals: VitalSigns = {
    ...currentVitals,
    bloodPressure: `${sys}/${dia} mmHg`,
    heartRate: Math.round(hr),
    respiratoryRate: Math.round(rr),
    temperature: Number(temp.toFixed(1)),
    oxygenSaturation: Math.round(spo2),
    glasgow: Math.round(glasgow),
    ...(typeof glucose === 'number' ? { bloodGlucose: Math.round(glucose) } : {}),
  };

  const deltas = buildMetricDeltas(currentVitals, updatedVitals);
  const mapAfter = calcMAP(sys, dia);
  if (mapBefore !== mapAfter && !deltas.some((d) => d.metric === 'PA')) {
    deltas.push({
      metric: 'PAM',
      before: `${mapBefore}`,
      after: `${mapAfter} mmHg`,
      direction: mapAfter > mapBefore ? 'up' : 'down',
      deltaText: `${mapAfter - mapBefore > 0 ? '+' : ''}${mapAfter - mapBefore} mmHg`,
    });
  }

  const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const record: StatInterventionRecord = {
    id: `stat-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    presetId: input.presetId,
    label,
    drug: cleanDrug,
    dose: cleanDose,
    route: cleanRoute,
    appliedAt: nowStr,
    elapsedSeconds,
    effectSeverity,
    physiologicalEffectSummary: summary,
    deltas,
    patientFeelingNote,
    ...(isImmediateDeath ? { isImmediateDeath: true, immediateDeathReason } : {}),
  };

  const medicationItem: MedicationItem = {
    id: `med-stat-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    drug: cleanDrug,
    dose: cleanDose,
    route: cleanRoute,
    frequency: input.frequency || 'Dosis STAT (Urgencias)',
    duration: input.duration || 'Aplicación inmediata',
  };

  return {
    updatedVitals,
    record,
    medicationItem,
    isImmediateDeath,
    immediateDeathReason,
  };
}

export interface PlanMedicationAuditResult {
  unsafeMedicationIds: Set<string>;
  errors: string[];
}

const COMPOUND_DRUG_NAMES_REGEX =
  /\b(paracetamol|acetaminofen|tramadol|morfina|fentanilo|buprenorfina|labetalol|hidralazina|nifedipin[oa]?|metoprolol|amiodarona|digoxina|insulina|dextrosa|glucosa|salina|ringer|hartmann|kcl|potasio|ketorolaco|ibuprofeno|metamizol|magnesio|atropina|enoxaparina|heparina)\b/;

function extractDrugSpecificDose(
  drugPattern: RegExp,
  item: MedicationItem,
  weightKg: number
): ParsedDose | null {
  const doseRaw = item.dose || '';
  const doseN = norm(doseRaw);
  if (!COMPOUND_DRUG_NAMES_REGEX.test(doseN)) {
    return parseNumericDose(doseRaw, weightKg);
  }
  const segments = doseRaw.split(/\s*[+;/]\s*|\s+\bo\b\s+/i);
  const matchingSegments = segments.filter((seg) => drugPattern.test(norm(seg)));
  if (matchingSegments.length > 0) {
    return parseNumericDose(matchingSegments[0], weightKg);
  }
  // La cadena de dosis nombra explícitamente otros fármacos (p. ej. "Paracetamol 1 g + Tramadol 50 mg"), no éste
  return null;
}

/**
 * Audita cada fármaco del plan terapéutico propuesto para detectar sobredosis letales/tóxicas,
 * vías incompatibles o contraindicaciones críticas dependientes de dosis y contexto clínico.
 */
export function auditMedicationPlanSafety(
  medications: MedicationItem[],
  caseData: ClinicalCase
): PlanMedicationAuditResult {
  const errors: string[] = [];
  const unsafeMedicationIds = new Set<string>();
  const flags = extractCaseClinicalFlags(caseData, caseData.vitalSigns);
  const { weightKg, isPediatric, isHyperkalemia, isActiveBleed, isDengue, isOrganophosphate, isObstructiveAirway, isPulmonaryEdemaOrFluidOverload, isBowelObstruction } =
    flags;

  const baseBP = parseBP(caseData.vitalSigns.bloodPressure);
  const baseGlu = caseData.vitalSigns.bloodGlucose;
  const baseHr = caseData.vitalSigns.heartRate;

  const fullPlanNorm = norm(
    medications.map((m) => `${m.drug} ${m.dose} ${m.route} ${m.frequency}`).join(' ')
  );
  const hasConcomitantDextrose = /\b(dextrosa|glucosa|dw50|dw10|dw5)\b/.test(fullPlanNorm);

  const negationRegex =
    /\b(suspender|suspendase|retirar|retiro|omitir|evitar|prohibid[oa]|contraindicad[oa]|descontinuar|no\s+(?:administrar|usar|dar|indicar|prescribir))\b/;

  for (const item of medications) {
    const drugNorm = norm(item.drug || '');
    const doseNorm = norm(item.dose || '');
    const routeNorm = norm(item.route || '');
    const freqNorm = norm(`${item.frequency || ''} ${item.duration || ''}`);
    if (!drugNorm) continue;
    if (negationRegex.test(`${drugNorm} ${doseNorm}`)) continue;

    const p = parseNumericDose(item.dose || '', weightKg);
    const isIV = routeNorm.includes('intravenosa') || /\biv\b/.test(routeNorm);
    const isInhaled =
      routeNorm.includes('inhalat') ||
      routeNorm.includes('nebuliz') ||
      doseNorm.includes('nebuliz') ||
      drugNorm.includes('nebuliz');

    const flagError = (msg: string) => {
      unsafeMedicationIds.add(item.id);
      if (!errors.some((e) => norm(e) === norm(msg))) {
        errors.push(msg);
      }
    };

    // 1. Insulina: sobredosis letal, vía IV en basal, o insulina en normoglucemia sin dextrosa
    if (/\binsulina\b/.test(drugNorm)) {
      const pIns = extractDrugSpecificDose(/\binsulina\b/, item, weightKg);
      const isBasal = /\b(nph|glargina|lantus|detemir|degludec|tresiba|levemir|intermedia|prolongada)\b/.test(drugNorm);
      if (isIV && isBasal) {
        flagError(
          `¡ERROR CRÍTICO FARMACOLÓGICO!: Indicaste insulina de acción intermedia/prolongada (${item.drug}) por vía intravenosa (${item.route}); riesgo de hipoglucemia prolongada grave y embolismo.`
        );
        continue;
      }
      if (pIns && pIns.ui !== null) {
        const uiPerKg = pIns.ui / weightKg;
        const isPolarizing =
          isHyperkalemia &&
          pIns.ui <= 15 &&
          (hasConcomitantDextrose || /\b(polariz|dextrosa|glucosa)\b/.test(`${drugNorm} ${doseNorm}`));

        if (pIns.ui >= 30 || uiPerKg >= 0.45) {
          flagError(
            `¡ERROR CRÍTICO DE SOBREDOSIS LETAL!: Prescripción de ${item.dose} de ${item.drug} (${item.route}). Excede ampliamente las dosis terapéuticas (0.05-0.15 UI/kg) y provoca hipoglucemia neuroglucopénica catastrófica, hipokalemia severa y riesgo letal inmediato.`
          );
          continue;
        }
        if (!isPolarizing && typeof baseGlu === 'number' && baseGlu < 160 && pIns.ui >= 6) {
          flagError(
            `¡ERROR CRÍTICO DE SEGURIDAD!: Prescripción de ${item.dose} de ${item.drug} en paciente sin hiperglucemia significativa (glucemia basal ${baseGlu} mg/dL) sin cobertura polarizante; riesgo de hipoglucemia iatrogénica severa.`
          );
          continue;
        }
        if (typeof baseGlu === 'number' && baseGlu >= 160 && baseGlu < 250 && isIV && pIns.ui >= 15) {
          flagError(
            `¡ERROR CRÍTICO DE DOSIFICACIÓN!: Bolo IV excesivo de insulina (${item.dose}) para glucemia de ${baseGlu} mg/dL; riesgo grave de hipoglucemia iatrogénica.`
          );
          continue;
        }
      }
    }

    // 2. Cloruro de Potasio (KCl) en bolo IV directo o sin dilución segura
    if (/\b(cloruro de potasio|kcl)\b/.test(drugNorm)) {
      const hasCarrierOrDilution =
        /\b(diluid|en 1000|en 500|por litro|infusion|mantenimiento|bomba|solucion|ringer|salina|hartmann|reposicion)\b/.test(
          `${drugNorm} ${doseNorm} ${routeNorm} ${freqNorm}`
        ) && !/\b(bolo|directa|push|stat rapido)\b/.test(`${doseNorm} ${freqNorm}`);
      const pKcl = extractDrugSpecificDose(/\b(potasio|kcl)\b/, item, weightKg);
      if (isIV && (!hasCarrierOrDilution || (pKcl && pKcl.meq !== null && pKcl.meq >= 45 && !/\b(por dia|24|en 1000|en 2 litros)\b/.test(`${doseNorm} ${freqNorm}`)))) {
        flagError(
          `¡ERROR CRÍTICO DE RIESGO LETAL!: Administración de Cloruro de Potasio (${item.dose}) en bolo/vía IV directa o sin dilución segura. Provoca hiperpotasemia cardíaca súbita, fibrilación ventricular y paro cardíaco.`
        );
        continue;
      }
    }

    // 3. Adrenalina / Epinefrina IV fuera de paro o sobredosis IM (excluyendo nebulizada en crup)
    if (/\b(adrenalina|epinefrina)\b/.test(drugNorm) && !isInhaled) {
      const pAdr = extractDrugSpecificDose(/\b(adrenalina|epinefrina)\b/, item, weightKg);
      const mg = pAdr?.mg ?? null;
      if (isIV && mg !== null && mg >= 0.3) {
        flagError(
          `¡ERROR CRÍTICO FARMACOLÓGICO!: Adrenalina ${item.dose} por vía IV fuera de paro cardiorrespiratorio; riesgo de crisis adrenérgica letal, arritmia ventricular y hemorragia intracerebral (en anafilaxia la vía segura es Intramuscular).`
        );
        continue;
      }
      if (mg !== null && (isPediatric ? mg >= 0.8 : mg >= 1.5)) {
        flagError(
          `¡ERROR CRÍTICO DE SOBREDOSIS!: Dosis excesiva de Adrenalina (${item.dose}); provoca crisis hipertensiva severa y taquiarritmia potencialmente fatal.`
        );
        continue;
      }
    }

    // 4. Antihipertensivos sobredosis / vía incompatible / betabloqueador en shock
    if (
      /\b(labetalol|hidralazina|nitroprusiato|nifedipin|enalaprilat|nicardipin|losartan|amlodipino|captopril|metoprolol)\b/.test(
        drugNorm
      )
    ) {
      if (isIV && /\b(losartan|amlodipino|captopril|nifedipin)\b/.test(drugNorm) && !/\b(o|\/)\b/.test(routeNorm)) {
        flagError(
          `¡ERROR CRÍTICO FARMACOLÓGICO!: Formulación oral (${item.drug}) prescrita por vía intravenosa (${item.route}).`
        );
        continue;
      }
      const pLab = extractDrugSpecificDose(/\blabetalol\b/, item, weightKg);
      if (drugNorm.includes('labetalol') && pLab && pLab.mg !== null && (pLab.mg >= 120 || pLab.mg / weightKg >= 2.0)) {
        flagError(
          `¡ERROR CRÍTICO DE SOBREDOSIS!: Bolo de Labetalol excesivo (${item.dose}); la dosis inicial segura es 10-20 mg IV. Riesgo de shock vasopléjico, bradicardia severa e hipoperfusión orgánica.`
        );
        continue;
      }
      const pNtp = extractDrugSpecificDose(/\bnitroprusiato\b/, item, weightKg);
      if (drugNorm.includes('nitroprusiato') && pNtp && pNtp.mg !== null && pNtp.mg >= 2 && !/\b(mcg)\b/.test(doseNorm)) {
        flagError(
          `¡ERROR CRÍTICO DE SOBREDOSIS!: Dosis letal de Nitroprusiato (${item.dose}); debe titularse en mcg/kg/min. Riesgo de colapso tensional y toxicidad por cianuro.`
        );
        continue;
      }
      if (/\b(labetalol|metoprolol|esmolol|atenolol)\b/.test(drugNorm) && (baseBP.sys < 92 || baseHr < 52)) {
        flagError(
          `¡ERROR CRÍTICO!: Betabloqueador (${item.drug}) prescrito en paciente hipotenso o con bradicardia severa; riesgo de choque cardiogénico.`
        );
        continue;
      }
    }

    // 5. Opioides y Benzodiacepinas (control de mcg vs mg en Fentanilo y depresores respiratorios)
    if (/\b(fentanilo|morfina|tramadol|lorazepam|midazolam|diazepam|clonazepam)\b/.test(drugNorm)) {
      const pSed = extractDrugSpecificDose(
        /\b(fentanilo|morfina|tramadol|lorazepam|midazolam|diazepam|clonazepam)\b/,
        item,
        weightKg
      );
      const mg = pSed?.mg ?? null;
      const isFent = drugNorm.includes('fentanilo');
      const isMorph = drugNorm.includes('morfina');
      const isLorazMidaz = /\b(lorazepam|midazolam|clonazepam)\b/.test(drugNorm);
      const isDiaz = drugNorm.includes('diazepam');
      if (
        mg !== null &&
        ((isFent && (mg >= 0.4 || mg / weightKg >= 0.006)) ||
          (isMorph && !drugNorm.includes('tramadol') && (mg >= 20 || mg / weightKg >= 0.3)) ||
          (isLorazMidaz && (mg >= 12 || mg / weightKg >= 0.3)) ||
          (isDiaz && (mg >= 35 || mg / weightKg >= 0.8)) ||
          (drugNorm.includes('tramadol') && mg >= 400))
      ) {
        flagError(
          `¡ERROR CRÍTICO DE SOBREDOSIS LETAL!: Dosis tóxica de ${item.drug} (${item.dose}); causa depresión respiratoria severa, apnea y paro ventilatorio.`
        );
        continue;
      }
    }

    // 6. Sulfato de Magnesio sobredosis
    if (/\b(sulfato de magnesio|mgso4)\b/.test(drugNorm)) {
      const pMag = extractDrugSpecificDose(/\b(sulfato de magnesio|magnesio|mgso4)\b/, item, weightKg);
      if (pMag && pMag.mg !== null) {
        const grams = pMag.mg / 1000;
        if (grams >= 10 || (isPediatric && pMag.mg / weightKg >= 100)) {
          flagError(
            `¡ERROR CRÍTICO DE SOBREDOSIS!: Dosis excesiva de Sulfato de Magnesio (${item.dose}); provoca hipermagnesemia severa, parálisis respiratoria y paro cardíaco.`
          );
          continue;
        }
      }
    }

    // 7. Paracetamol dosis hepatotóxica
    if (/\b(paracetamol|acetaminofen)\b/.test(drugNorm)) {
      const pPara = extractDrugSpecificDose(/\b(paracetamol|acetaminofen)\b/, item, weightKg);
      if (pPara && pPara.mg !== null) {
        const isDaily = /\b(dia|24\s*h|cada 6|cada 8|c\/\s*6|c\/\s*8)\b/.test(`${doseNorm} ${freqNorm}`);
        if (!isDaily && (pPara.mg >= 4000 || (isPediatric && pPara.mg / weightKg >= 75))) {
          flagError(
            `¡ERROR CRÍTICO DE SOBREDOSIS!: Dosis única tóxica de Paracetamol (${item.dose}); supera el umbral seguro y provoca necrosis hepática aguda.`
          );
          continue;
        }
      }
    }

    // 8. Furosemida en choque / hipovolemia / sobredosis
    if (/\b(furosemida)\b/.test(drugNorm)) {
      const pFuro = extractDrugSpecificDose(/\bfurosemida\b/, item, weightKg);
      if ((baseBP.sys < 95 && !isPulmonaryEdemaOrFluidOverload) || (pFuro && pFuro.mg !== null && pFuro.mg >= 240)) {
        flagError(
          `¡ERROR CRÍTICO!: Prescripción riesgosa de Furosemida (${item.dose}) en hipotensión/hipovolemia o a dosis excesiva.`
        );
        continue;
      }
    }

    // 9. Anticoagulantes / Fibrinolíticos en sangrado activo o sobredosis
    if (
      /\b(alteplasa|tenecteplasa|estreptoquinasa|heparina|enoxaparina|warfarina|apixaban|rivaroxaban)\b/.test(
        drugNorm
      )
    ) {
      if (isActiveBleed || isDengue) {
        flagError(
          `¡ERROR CRÍTICO DE SEGURIDAD!: Prescripción de anticoagulante o fibrinolítico (${item.drug}) en paciente con hemorragia activa o dengue; riesgo de exanguinación fatal.`
        );
        continue;
      }
      const pAltep = extractDrugSpecificDose(/\b(alteplasa|tenecteplasa)\b/, item, weightKg);
      if (/\b(alteplasa|tenecteplasa)\b/.test(drugNorm) && pAltep && pAltep.mg !== null && pAltep.mg >= 120) {
        flagError(
          `¡ERROR CRÍTICO DE SOBREDOSIS!: Dosis supraterapéutica de fibrinolítico (${item.dose}, máx 90 mg en Alteplasa); alto riesgo de hemorragia intracerebral fatal.`
        );
        continue;
      }
    }

    // 10. Atropina tóxica fuera de organofosforados / Metoclopramida en obstrucción
    if (drugNorm.includes('atropina') && !isOrganophosphate && p.mg !== null && p.mg >= 4) {
      flagError(
        `¡ERROR CRÍTICO DE SOBREDOSIS!: Dosis tóxica de Atropina (${item.dose}) fuera de intoxicación por organofosforados.`
      );
    }
    if (isBowelObstruction && /\b(metoclopramida|domperidona|loperamida)\b/.test(drugNorm)) {
      flagError(
        `¡ERROR CRÍTICO!: Uso de procinético/antidiarreico (${item.drug}) en obstrucción intestinal mecánica; riesgo de perforación intestinal.`
      );
    }
    if (isObstructiveAirway && /\b(metoprolol|atenolol|esmolol)\b/.test(drugNorm) && p.mg !== null && p.mg >= 50 && isIV) {
      flagError(
        `¡ERROR CRÍTICO!: Dosis alta IV de betabloqueador en paciente con asma/EPOC.`
      );
    }
  }

  return { unsafeMedicationIds, errors };
}
