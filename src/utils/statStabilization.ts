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
];

function norm(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function parseBP(bp: string): { sys: number; dia: number } {
  const match = bp.match(/(\d+)\s*\/\s*(\d+)/);
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

interface ParsedDose {
  mg: number | null;
  ml: number | null;
  ui: number | null;
  lpm: number | null;
}

/**
 * Extrae dosis numéricas reales de cadenas como "80 mg", "1 g", "1000 mL", "1.5 L", "0.1 UI/kg/h", "10 L/min".
 */
function parseNumericDose(doseStr: string, weightKg: number): ParsedDose {
  const clean = norm(doseStr).replace(',', '.');
  const match = clean.match(/(\d+(?:\.\d+)?)\s*(?:-|a\s*\d+(?:\.\d+)?\s*)?(mcg|ug|mg|g|ml|l\/min|l|ui|u|litros|cc)?\s*(\/\s*kg)?/);
  if (!match) {
    return { mg: null, ml: null, ui: null, lpm: null };
  }
  let rawVal = parseFloat(match[1]);
  if (Number.isNaN(rawVal) || rawVal <= 0) {
    return { mg: null, ml: null, ui: null, lpm: null };
  }
  const unit = match[2] || '';
  const perKg = Boolean(match[3]);
  if (perKg) {
    rawVal *= weightKg;
  }

  if (unit === 'mcg' || unit === 'ug') {
    return { mg: rawVal / 1000, ml: null, ui: null, lpm: null };
  }
  if (unit === 'mg') {
    return { mg: rawVal, ml: null, ui: null, lpm: null };
  }
  if (unit === 'g') {
    return { mg: rawVal * 1000, ml: null, ui: null, lpm: null };
  }
  if (unit === 'ml' || unit === 'cc') {
    return { mg: null, ml: rawVal, ui: null, lpm: null };
  }
  if (unit === 'l' || unit === 'litros') {
    return { mg: null, ml: rawVal * 1000, ui: null, lpm: null };
  }
  if (unit === 'l/min') {
    return { mg: null, ml: null, ui: null, lpm: rawVal };
  }
  if (unit === 'ui' || unit === 'u') {
    return { mg: null, ml: null, ui: rawVal, lpm: null };
  }

  // Sin unidad explícita: devolver valor crudo en mg/ml/ui heurístico según contexto
  return { mg: rawVal, ml: rawVal, ui: rawVal, lpm: rawVal };
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
  const routeNorm = norm(cleanRoute);
  const diagNorm = norm(
    `${caseData.solution.correctDiagnosis} ${caseData.solution.pathophysiology} ${caseData.patientInfo.consultReason} ${caseData.patientInfo.currentIllness}`
  );
  const allergiesNorm = norm((caseData.background.allergies || []).join(' '));
  const isPediatric = caseData.patientInfo.age < 12;
  const weightKg = currentVitals.weightKg || (isPediatric ? Math.max(8, caseData.patientInfo.age * 2 + 8) : 70);
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

  const sameDrugCount = previousHistory.filter(
    (item) =>
      (input.presetId && item.presetId === input.presetId) ||
      norm(item.drug) === norm(cleanDrug)
  ).length;

  let effectSeverity: StatEffectSeverity = 'mejoria';
  let summary = '';
  let patientFeelingNote = '';

  const isAllergicToPenicillin =
    allergiesNorm.includes('penicilina') || allergiesNorm.includes('betalactam');
  const isAllergicToSulfa = allergiesNorm.includes('sulfa') || allergiesNorm.includes('trimetoprim');
  const isAllergicToAine =
    allergiesNorm.includes('aine') || allergiesNorm.includes('aspirina') || allergiesNorm.includes('ibuprofeno');

  const isPenicillinDrug =
    /\b(penicilina|amoxicilina|ampicilina|piperacilina|oxacilina|dicloxacilina)\b/.test(drugNorm);
  const isSulfaDrug = /\b(sulfa|trimetoprim|cotrimoxazol|bactrim)\b/.test(drugNorm);
  const isAineDrug =
    /\b(ibuprofeno|diclofenaco|ketorolaco|naproxeno|metamizol|dipirona|piroxicam|indometacina|meloxicam)\b/.test(
      drugNorm
    ) || (/\b(aspirina|acetilsalicilico|asa)\b/.test(drugNorm) && diagNorm.includes('dengue'));

  const isDengue = diagNorm.includes('dengue');
  const isObstructiveAirway =
    diagNorm.includes('asma') ||
    diagNorm.includes('epoc') ||
    diagNorm.includes('bronquiolitis') ||
    diagNorm.includes('broncoespasmo') ||
    diagNorm.includes('crup') ||
    diagNorm.includes('anafilax');
  const isCopd = diagNorm.includes('epoc') || diagNorm.includes('enfisema');
  const isAnaphylaxis = diagNorm.includes('anafilax');
  const isPulmonaryEdemaOrFluidOverload =
    diagNorm.includes('edema agudo de pulmon') ||
    diagNorm.includes('insuficiencia cardiaca descompensada') ||
    diagNorm.includes('sobrecarga hidrica');
  const isInferiorStemi =
    (diagNorm.includes('infarto') || diagNorm.includes('iamcest')) &&
    (diagNorm.includes('inferior') || diagNorm.includes('ventriculo derecho'));
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

  // 1. Contraindicaciones inmunológicas / patológicas absolutas
  if (
    (isAllergicToPenicillin && isPenicillinDrug) ||
    (isAllergicToSulfa && isSulfaDrug) ||
    (isAllergicToAine && isAineDrug)
  ) {
    effectSeverity = 'reaccion_adversa';
    sys = clamp(sys - 26, 60, 220);
    dia = clamp(dia - 15, 36, 130);
    hr = clamp(hr + 26, 50, 175);
    rr = clamp(rr + 7, 12, 44);
    spo2 = clamp(spo2 - 7, 70, 100);
    glasgow = clamp(glasgow - 1, 8, 15);
    summary =
      'Reacción anafiláctica / hipersensibilidad inmediata tras administrar fármaco con alergia registrada: caída brusca de PA, taquicardia compensadora y desaturación.';
    patientFeelingNote = isPediatric
      ? '¡Doctor, mi niño se empezó a brotar todo, está respirando muy agitado y se puso pálido justo después de ese medicamento!'
      : '¡Doctor, me picó la garganta de golpe, me falta el aire y siento que me voy a desmayar después de que me pusieron ese medicamento!';
  } else if (isDengue && isAineDrug) {
    effectSeverity = 'reaccion_adversa';
    sys = clamp(sys - 12, 65, 220);
    dia = clamp(dia - 8, 40, 130);
    hr = clamp(hr + 12, 50, 170);
    summary =
      'Deterioro hemodinámico y riesgo hemorrágico gastrointestinal/plaquetario tras exposición a AINE/salicilato en paciente con dengue.';
    patientFeelingNote = isPediatric
      ? 'Doctor, después de esa medicina mi niño siguió con más dolor en la pancita y se ve más pálido y decaído.'
      : 'Doctor, me empezó ardor fuerte en la boca del estómago, náuseas y más mareo desde que me pusieron eso.';
  } else if (
    isObstructiveAirway &&
    /\b(propranolol|nadolol|timolol|carvedilol|labetalol|betabloqueador)\b/.test(drugNorm)
  ) {
    effectSeverity = 'reaccion_adversa';
    spo2 = clamp(spo2 - 6, 72, 100);
    rr = clamp(rr + 6, 12, 44);
    hr = clamp(hr - 14, 42, 170);
    if (drugNorm.includes('labetalol')) {
      const labMg = parsedDose.mg ?? 20;
      sys = clamp(sys - Math.round(18 + labMg * 0.45), 62, 220);
      dia = clamp(dia - Math.round(10 + labMg * 0.25), 38, 130);
    }
    summary =
      'Broncoespasmo severo paradójico por bloqueo beta-2 no selectivo en paciente con hiperreactividad bronquial / asma / EPOC: caída de SpO₂ e incremento de taquipnea.';
    patientFeelingNote = isPediatric
      ? '¡Doctor, mi hijo empezó a silbar muchísimo del pecho y le cuesta mucho más meter aire!'
      : '¡Doctor, se me cerró el pecho de golpe y siento que me ahogo después de esa dosis!';
  }
  // 2. Farmacodinamia realista dependiente de dosis: LABETALOL y ANTIHIPERTENSIVOS IV/VO
  else if (
    /\b(labetalol|hidralazina|nifedipin|nitroprusiato|nicardipin|enalaprilat|antihipertensiv|losartan|captopril|amlodipino)\b/.test(
      drugNorm
    )
  ) {
    const isLabetalol = drugNorm.includes('labetalol');
    const isHidralazina = drugNorm.includes('hidralazina');
    const isNitroprusiato = drugNorm.includes('nitroprusiato');

    let rawSysDrop = 20;
    let rawDiaDrop = 11;
    let hrDelta = -4;

    if (isLabetalol) {
      // Estándar en bolo inicial: 10-20 mg IV. Un bolo de 80 mg equivale a 4x dosis inicial (dosis acumulativa máxima inicial ~20-80 mg escalonados).
      const mg = parsedDose.mg ?? 20;
      const potencyRatio = clamp(mg / 20, 0.4, 4.5);
      // Curva realista: 20 mg baja ~24-32 mmHg en HTA severa; 80 mg en bolo único baja ~58-72 mmHg (con alto riesgo de hipotensión/bradicardia!)
      const baselineFactor = sys >= 180 ? 1.18 : sys >= 150 ? 1.0 : 0.85;
      rawSysDrop = Math.round(25 * Math.pow(potencyRatio, 0.78) * baselineFactor);
      rawDiaDrop = Math.round(rawSysDrop * 0.56);
      hrDelta = -Math.round(9 * Math.pow(potencyRatio, 0.68));
    } else if (isHidralazina) {
      const mg = parsedDose.mg ?? 5;
      const ratio = clamp(mg / 5, 0.5, 4.0);
      rawSysDrop = Math.round(22 * Math.pow(ratio, 0.72));
      rawDiaDrop = Math.round(rawSysDrop * 0.54);
      hrDelta = Math.round(10 * Math.pow(ratio, 0.6)); // Taquicardia refleja
    } else if (isNitroprusiato) {
      rawSysDrop = 38;
      rawDiaDrop = 22;
      hrDelta = 8;
    } else {
      const mg = parsedDose.mg ?? 10;
      const ratio = clamp(mg / 10, 0.5, 3.0);
      rawSysDrop = Math.round(18 * Math.pow(ratio, 0.65));
      rawDiaDrop = Math.round(rawSysDrop * 0.55);
      hrDelta = -2;
    }

    // Si ya se aplicaron dosis repetidas sin esperar, el efecto acumulado baja más rápido
    if (sameDrugCount >= 1) {
      rawSysDrop = Math.round(rawSysDrop * 0.85);
      rawDiaDrop = Math.round(rawDiaDrop * 0.85);
    }

    sys = clamp(sys - rawSysDrop, 62, 240);
    dia = clamp(dia - rawDiaDrop, 38, 140);
    hr = clamp(hr + hrDelta, 40, 175);

    const mapAfter = calcMAP(sys, dia);
    const mapDropPct = Math.round(((mapBefore - mapAfter) / Math.max(1, mapBefore)) * 100);
    const isIatrogenicHypotension = sys < 95 || mapAfter < 65 || hr < 50;
    const isExcessiveDrop = mapDropPct >= 25;

    if (isIatrogenicHypotension) {
      effectSeverity = 'reaccion_adversa';
      if (sys < 85) glasgow = clamp(glasgow - 1, 8, 15);
      summary = `Hipotensión iatrogénica tras dosis elevada (${cleanDose} de ${cleanDrug}): descenso de PAM del ${mapDropPct}% (${bp.sys}/${bp.dia} → ${sys}/${dia} mmHg)${hr < 55 ? ' con bradicardia beta-bloqueada' : ''}.`;
      patientFeelingNote =
        '¡Doctor, me dio un mareo terrible y siento que se me oscurece la vista, el cuerpo helado y mucha debilidad desde que me pasaron esa dosis tan fuerte!';
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
  // 3. INSULINA CRISTALINA IV (sensible a UI administradas)
  else if (/\b(insulina)\b/.test(drugNorm)) {
    const isPerKgInfusion = /\/\s*kg/.test(norm(cleanDose));
    const ui = isPerKgInfusion ? clamp(Math.round(0.1 * weightKg), 4, 12) : (parsedDose.ui ?? 6);
    if (typeof glucose === 'number' && glucose < 150) {
      const drop = Math.round(clamp(ui * 8, 35, 110));
      glucose = clamp(glucose - drop, 32, 650);
      hr = clamp(hr + 18, 50, 175);
      if (glucose < 60) glasgow = clamp(glasgow - 2, 8, 15);
      effectSeverity = 'reaccion_adversa';
      summary = `Hipoglucemia iatrogénica severa tras administrar ${cleanDose} de insulina en paciente sin hiperglucemia significativa (glucemia cae a ${glucose} mg/dL).`;
      patientFeelingNote = isPediatric
        ? '¡Doctor, mi niño empezó a sudar frío, está temblando mucho y se ve muy dormido!'
        : '¡Doctor, empecé a temblar muchísimo, tengo sudor frío, palpitaciones y la vista nublada!';
    } else if (typeof glucose === 'number' && glucose >= 200) {
      const drop = Math.round(clamp(ui * 8.5, 35, 145));
      glucose = clamp(glucose - drop, 48, 650);
      if (glucose < 70) {
        effectSeverity = 'reaccion_adversa';
        hr = clamp(hr + 16, 50, 175);
        glasgow = clamp(glasgow - 1, 8, 15);
        summary = `Descenso glucémico excesivo tras dosis alta de insulina (${cleanDose}): cayó a ${glucose} mg/dL causando hipoglucemia sintomática.`;
        patientFeelingNote =
          'Doctor, primero me sentí mejor pero enseguida empecé a temblar y a sentir un hambre desesperada con sudor frío.';
      } else {
        rr = clamp(rr - (rr > 22 ? 3 : 0), 14, 42);
        hr = clamp(hr - (hr > 105 ? 6 : 2), 55, 170);
        effectSeverity = drop >= 95 ? 'parcial' : 'mejoria';
        summary =
          drop >= 95
            ? `Descenso rápido de glucemia (-${drop} mg/dL) tras ${cleanDose} de insulina; vigilar riesgo de hipokalemia y caída osmolar brusca.`
            : `Descenso gradual y seguro de glucemia (-${drop} mg/dL) tras ${cleanDose} de insulina, con mejoría progresiva de la taquipnea.`;
        patientFeelingNote =
          'Ya siento un poquito menos de pesadez y menos agitación al respirar, doctor.';
      }
    } else {
      effectSeverity = 'sin_cambio';
      summary = 'No se dispone de hiperglucemia basal documentada para titular descenso con insulina.';
      patientFeelingNote = 'No noto cambio claro todavía con esa dosis, doctor.';
    }
  }
  // 4. NITROGLICERINA SL / IV
  else if (/\b(nitroglicerina|nitrat|isosorbide)\b/.test(drugNorm)) {
    const mg = parsedDose.mg ?? 0.4;
    const scale = clamp(mg / 0.4, 0.7, 3.0);
    if (sys < 100 || isInferiorStemi) {
      sys = clamp(sys - Math.round(24 * scale), 60, 220);
      dia = clamp(dia - Math.round(14 * scale), 38, 130);
      hr = clamp(hr + 14, 50, 175);
      effectSeverity = 'reaccion_adversa';
      summary = 'Hipotensión marcada dependiente de precarga tras nitrato en paciente hipotenso o con probable compromiso de ventrículo derecho.';
      patientFeelingNote =
        '¡Doctor, se me nubló la vista y siento un mareo muy fuerte con debilidad desde que me pusieron la pastilla debajo de la lengua!';
    } else {
      sys = clamp(sys - Math.round(14 * scale), 84, 220);
      dia = clamp(dia - Math.round(8 * scale), 50, 130);
      if (isIschemicChestPain && sys >= 95) {
        hr = clamp(hr - (hr > 95 ? 8 : 0), 55, 165);
        effectSeverity = 'mejoria';
        summary = `Vasodilatación coronaria tras ${cleanDose} de nitroglicerina: alivio parcial de angina con descenso tensional esperado.`;
        patientFeelingNote =
          'Siento que me aflojó un poco esa presión que me apretaba el pecho, aunque todavía me queda algo de molestia y leve dolor de cabeza.';
      } else {
        effectSeverity = sys < 95 ? 'reaccion_adversa' : 'parcial';
        summary = `Descenso tensional tras ${cleanDose} de nitroglicerina.`;
        patientFeelingNote =
          sys < 95
            ? 'Me siento muy mareado y flojo después de esa dosis, doctor.'
            : 'Me empezó a latir un poquito la sien con la nitroglicerina, pero mi molestia principal sigue.';
      }
    }
  }
  // 5. OXÍGENO SUPLEMENTARIO
  else if (/\b(oxigeno|o2|mascarilla|canula)\b/.test(drugNorm)) {
    const targetSpo2 = isCopd ? 92 : 97;
    const lpm = parsedDose.lpm ?? 6;
    if (spo2 >= targetSpo2) {
      effectSeverity = isCopd && lpm >= 12 ? 'reaccion_adversa' : isCopd && lpm >= 8 ? 'parcial' : 'sin_cambio';
      spo2 = clamp(spo2 + (spo2 < 99 ? 1 : 0), 70, 100);
      summary =
        isCopd && lpm >= 12
          ? `Flujo excesivo de O₂ (${lpm} L/min) en paciente con EPOC ya en meta (${spo2}%): riesgo de narcosis hipercápnica.`
          : isCopd && lpm >= 8
            ? `Flujo alto de O₂ (${lpm} L/min) en EPOC ya en meta (${spo2}%): conviene titular a 1-3 L/min para mantener meta 88-92%.`
            : 'Oxigenación suplementaria aplicada; la saturación ya se encontraba en rango objetivo.';
      patientFeelingNote =
        isCopd && lpm >= 12
          ? 'Con tanto oxígeno me siento muy somnoliento y aturdido, doctor.'
          : isPediatric
            ? 'Mi niño tolera bien la mascarilla de oxígeno, aunque sus molestias principales siguen igual.'
            : 'Siento el aire fresco de la mascarilla, doctor, aunque ya respiraba casi normal.';
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
  // 6. SALBUTAMOL NEBULIZADO
  else if (/\b(salbutamol|albuterol|ipratropio|nebuliz|broncodilat)\b/.test(drugNorm)) {
    const mg = parsedDose.mg ?? 5;
    const doseRatio = clamp(mg / 5, 0.5, 2.5);
    if (isObstructiveAirway || spo2 < 95 || rr > 22) {
      const gain = clamp(Math.round((sameDrugCount >= 2 ? 2 : 5) * Math.min(1.4, doseRatio)), 2, 8);
      spo2 = clamp(spo2 + gain, 72, isCopd ? 94 : 99);
      rr = clamp(rr - clamp(Math.round(5 * doseRatio), 2, 8), 14, 44);
      hr = clamp(hr + Math.round((sameDrugCount >= 2 ? 5 : 8) * doseRatio), 55, 175);
      effectSeverity = mg >= 12 ? 'parcial' : 'mejoria';
      summary = `Broncodilatación dosis-dependiente (${cleanDose}): mejora SpO₂ y baja la frecuencia respiratoria, con taquicardia beta-2 adrenérgica proporcional.`;
      patientFeelingNote = isPediatric
        ? 'Después de la nebulización mi niño ya no chilla tanto al respirar y se le hunden menos las costillas, aunque está un poquito inquieto.'
        : 'Siento el pecho mucho más abierto después de la nebulización, doctor; respiro con menos silbido, aunque siento el corazón acelerado.';
    } else {
      hr = clamp(hr + Math.round(9 * doseRatio), 55, 175);
      effectSeverity = 'sin_cambio';
      summary = 'Broncodilatador nebulizado sin broncoespasmo previo; se observa taquicardia beta-adrenérgica y temblor fino.';
      patientFeelingNote =
        'Doctor, con esa nebulización solo sentí temblor en las manos y el corazón más rápido, pero el malestar por el que vine sigue igual.';
    }
  }
  // 7. ADRENALINA (IM vs IV y dosis)
  else if (/\b(adrenalina|epinefrina)\b/.test(drugNorm)) {
    const mg = parsedDose.mg ?? 0.5;
    const isIV = routeNorm.includes('intravenosa') || /\biv\b/.test(routeNorm);
    if (isIV || mg >= 1.2) {
      sys = clamp(sys + 52, 70, 235);
      dia = clamp(dia + 28, 40, 140);
      hr = clamp(hr + 42, 55, 185);
      effectSeverity = 'reaccion_adversa';
      summary = `Crisis adrenérgica aguda por dosis/vía inadecuada de adrenalina (${cleanDose} ${cleanRoute}) fuera de paro cardiorrespiratorio: hipertensión severa y taquiarritmia.`;
      patientFeelingNote =
        '¡Doctor, me dio un dolor fuertísimo en el pecho y la cabeza, siento que el corazón se me va a salir del pecho!';
    } else if (isAnaphylaxis || sys < 85) {
      sys = clamp(sys + 28, 75, 180);
      dia = clamp(dia + 16, 45, 115);
      spo2 = clamp(spo2 + 6, 75, 99);
      rr = clamp(rr - 4, 14, 42);
      hr = clamp(hr + (hr < 70 ? 22 : -4), 55, 165);
      glasgow = clamp(glasgow + (glasgow < 15 ? 1 : 0), 3, 15);
      effectSeverity = 'mejoria';
      summary = 'Reversión alfa/beta adrenérgica de anafilaxia/choque distributivo con Adrenalina IM: recuperación rápida de la PA y permeabilidad aérea.';
      patientFeelingNote = isPediatric
        ? '¡Doctor, la inyección en la pierna le ayudó rapidísimo! Ya respira más despejado y volvió a abrir bien los ojos.'
        : '¡Doctor, siento que se me destapó la garganta y ya no me siento tan mareado después de la inyección en el muslo!';
    } else {
      sys = clamp(sys + 26, 70, 225);
      dia = clamp(dia + 14, 40, 130);
      hr = clamp(hr + 28, 55, 180);
      effectSeverity = 'reaccion_adversa';
      summary = 'Descarga adrenérgica intensa sin indicación de anafilaxia o paro: hipertensión reactiva y taquicardia marcada.';
      patientFeelingNote =
        '¡Doctor, me late rapidísimo el corazón y me duele fuerte la cabeza después de esa inyección!';
    }
  }
  // 8. CRISTALOIDES IV (SSN 0.9% / HARTMANN / RINGER)
  else if (/\b(salina|ssn|hartmann|ringer|cristaloide|bolo|suero)\b/.test(drugNorm)) {
    const ml = parsedDose.ml ?? 500;
    const volRatio = clamp(ml / 500, 0.4, 3.5);
    if (isPulmonaryEdemaOrFluidOverload && sys >= 100) {
      spo2 = clamp(spo2 - Math.round(3 * volRatio), 70, 100);
      rr = clamp(rr + Math.round(4 * volRatio), 12, 46);
      sys = clamp(sys + Math.round(6 * volRatio), 70, 230);
      effectSeverity = 'reaccion_adversa';
      summary = `Agravamiento de edema/congestión pulmonar tras ${ml} mL de cristaloide en paciente con sobrecarga hídrica: cae la SpO₂ y aumenta la disnea.`;
      patientFeelingNote =
        '¡Doctor, siento que me ahogo muchísimo más desde que me pasaron ese suero rápido!';
    } else if (isShockOrHypovolemic || sys < 110 || hr >= 98) {
      const baseSysGain = sys < 95 ? 16 : 11;
      const sysGain = Math.round(baseSysGain * Math.pow(volRatio, 0.72) * (sameDrugCount >= 2 ? 0.45 : 1));
      const diaGain = Math.round(sysGain * 0.58);
      const hrDrop = Math.round((hr > 100 ? 13 : 5) * Math.pow(volRatio, 0.7) * (sameDrugCount >= 2 ? 0.5 : 1));
      sys = clamp(sys + sysGain, 70, 175);
      dia = clamp(dia + diaGain, 45, 108);
      hr = clamp(hr - hrDrop, 55, 170);
      if (glasgow < 15 && bp.sys < 95) glasgow = clamp(glasgow + 1, 3, 15);
      effectSeverity = sysGain >= 8 ? 'mejoria' : 'parcial';
      summary = `Expansión intravascular con ${ml} mL de cristaloide: aumento de PA (+${sysGain}/+${diaGain} mmHg) y reducción refleja de la taquicardia compensadora.`;
      patientFeelingNote = isPediatric
        ? 'Con el suero en la venita mi niño ya no está tan frío ni decaído, se ve un poco más despejado.'
        : 'Con el suero intravenoso siento menos mareo al mover la cabeza y menos boca seca, doctor.';
    } else if (ml >= 2500) {
      spo2 = clamp(spo2 - 3, 75, 100);
      rr = clamp(rr + 3, 12, 42);
      sys = clamp(sys + 10, 70, 210);
      effectSeverity = 'reaccion_adversa';
      summary = `Carga masiva de volumen (${ml} mL) en paciente normotenso: riesgo de sobrecarga hídrica y congestión pulmonar.`;
      patientFeelingNote = 'Me siento agitado del pecho con tanto líquido que me pasaron rápido, doctor.';
    } else {
      effectSeverity = ml >= 1500 ? 'parcial' : 'sin_cambio';
      sys = clamp(sys + 3, 70, 210);
      summary =
        ml >= 1500
          ? `Infusión de ${ml} mL en paciente normotenso: aporte amplio sin beneficio hemodinámico adicional; vigilar balance hídrico.`
          : `Infusión de ${ml} mL en paciente hemodinámicamente estable.`;
      patientFeelingNote = 'El suero sigue pasando bien en la vena, doctor, me siento estable.';
    }
  }
  // 9. FUROSEMIDA IV
  else if (/\b(furosemida|diuretico)\b/.test(drugNorm)) {
    const mg = parsedDose.mg ?? 40;
    const ratio = clamp(mg / 40, 0.4, 3.0);
    if (isPulmonaryEdemaOrFluidOverload || spo2 < 94) {
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
      sys = clamp(sys - Math.round(14 * ratio), 68, 220);
      dia = clamp(dia - Math.round(8 * ratio), 40, 130);
      hr = clamp(hr + Math.round(10 * ratio), 55, 170);
      effectSeverity = sys < 90 ? 'reaccion_adversa' : 'sin_cambio';
      summary = `Diurético (${cleanDose}) aplicado sin sobrecarga hídrica: depleción intravascular y descenso tensional.`;
      patientFeelingNote =
        sys < 90
          ? 'Me dieron muchas ganas de orinar y me siento muy mareado y débil, doctor.'
          : 'Solo me dieron ganas de ir al baño, doctor, pero el problema principal sigue igual.';
    }
  }
  // 10. DEXTROSA IV
  else if (/\b(dextrosa|glucosa|glucosada)\b/.test(drugNorm)) {
    const grams = parsedDose.mg ? parsedDose.mg / 1000 : 25;
    const scale = clamp(grams / 25, 0.4, 2.2);
    if (typeof glucose === 'number' && glucose < 75) {
      const gain = Math.round(80 * scale);
      glucose = clamp(glucose + gain, 40, 320);
      hr = clamp(hr - (hr > 95 ? 14 : 4), 58, 155);
      glasgow = clamp(Math.max(glasgow, 14) + (glasgow < 15 ? 1 : 0), 3, 15);
      effectSeverity = 'mejoria';
      summary = `Corrección rápida de hipoglucemia (+${gain} mg/dL) tras ${cleanDose} de dextrosa: mejoría inmediata del estado de alerta (Glasgow ${glasgow}/15).`;
      patientFeelingNote = isPediatric
        ? '¡Doctor, despertó enseguida con el suero dulce! Ya me mira y dejó de temblar.'
        : '¡Qué cambio, doctor! Se me quitó el temblor, el sudor frío y ya pienso con claridad otra vez.';
    } else {
      if (typeof glucose === 'number') {
        glucose = clamp(glucose + Math.round(45 * scale), 40, 680);
      }
      effectSeverity = typeof glucose === 'number' && glucose >= 350 ? 'reaccion_adversa' : 'sin_cambio';
      summary =
        typeof glucose === 'number' && glucose >= 250
          ? `Aporte de dextrosa (${cleanDose}) sin indicación en paciente hiperglucémico (${glucose} mg/dL).`
          : 'Aporte de dextrosa sin hipoglucemia previa; elevación glucémica sin beneficio clínico.';
      patientFeelingNote = 'Sentí un poco de ardor en la vena con el suero, doctor, pero mis molestias siguen igual.';
    }
  }
  // 11. OPIOIDES / BENZODIACEPINAS (Morfina, Fentanilo, Diazepam, Lorazepam, Midazolam)
  else if (/\b(morfina|fentanilo|tramadol|diazepam|lorazepam|midazolam)\b/.test(drugNorm)) {
    const mg = parsedDose.mg ?? 5;
    const isMorphine = drugNorm.includes('morfina');
    const isBenzo = /\b(diazepam|lorazepam|midazolam)\b/.test(drugNorm);
    const highDoseSedative =
      (isMorphine && mg >= 8) || (isBenzo && mg >= 20) || (isObstructiveAirway && (isMorphine || isBenzo));

    if (highDoseSedative) {
      rr = clamp(rr - 7, 7, 40);
      spo2 = clamp(spo2 - 6, 72, 100);
      sys = clamp(sys - 18, 70, 220);
      dia = clamp(dia - 10, 42, 130);
      glasgow = clamp(glasgow - 2, 6, 15);
      effectSeverity = 'reaccion_adversa';
      summary = `Depresión respiratoria y del estado de alerta tras ${cleanDose} de ${cleanDrug}${isObstructiveAirway ? ' en paciente con insuficiencia respiratoria obstructiva' : ''}: FR cae a ${rr} rpm y SpO₂ a ${spo2}%.`;
      patientFeelingNote =
        'Doctor... tengo muchísimo sueño... siento los párpados muy pesados y respiro muy lento...';
    } else if (isSeizureOrEclampsia || diagNorm.includes('ansiedad') || diagNorm.includes('abstinencia') || isIschemicChestPain || isMorphine) {
      hr = clamp(hr - (hr > 96 ? 12 : 5), 55, 165);
      rr = clamp(rr - (rr > 20 ? 3 : 1), 12, 38);
      if (isMorphine && sys > 105) sys = clamp(sys - 6, 85, 220);
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
  // 12. ÁCIDO ACETILSALICÍLICO (ASA)
  else if (/\b(acetilsalicilico|aspirina|asa|clopidogrel)\b/.test(drugNorm)) {
    if (isIschemicChestPain) {
      effectSeverity = 'mejoria';
      summary = 'Antiagregación plaquetaria de carga iniciada en ventana coronaria.';
      patientFeelingNote =
        'Ya mastiqué la aspirina, doctor. Todavía siento molestia en el pecho pero estoy atento.';
    } else {
      effectSeverity = 'sin_cambio';
      summary = 'Antiagregante administrado; sin variación inmediata en signos vitales.';
      patientFeelingNote = 'Ya me tragué la pastilla, doctor, sigo esperando sentir alivio.';
    }
  }
  // 13. PARACETAMOL / ANTIPIRÉTICOS
  else if (/\b(paracetamol|acetaminofen|antipiret|metamizol)\b/.test(drugNorm)) {
    const mg = parsedDose.mg ?? 1000;
    const scale = clamp(mg / 1000, 0.5, 1.3);
    if (temp >= 37.8) {
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
  // 14. ANTIEMÉTICOS
  else if (/\b(ondansetron|metoclopramida|dimenhidrinato|antiemet)\b/.test(drugNorm)) {
    hr = clamp(hr - (hr > 98 ? 5 : 2), 55, 165);
    effectSeverity = 'mejoria';
    summary = 'Control del reflejo emético y disminución leve del tono autonómico nauseoso.';
    patientFeelingNote = isPediatric
      ? 'Parece que ya se le calmó el asco al niño, doctor; no ha vuelto a tener arcadas.'
      : 'Ya se me asentó bastante el estómago y se me quitó esa sensación de querer vomitar, doctor.';
  }
  // 15. CORTICOIDES SISTÉMICOS
  else if (/\b(hidrocortisona|dexametasona|metilprednisolona|prednisona|corticoide|esteroide)\b/.test(drugNorm)) {
    if (isObstructiveAirway || isAnaphylaxis || diagNorm.includes('meningitis') || diagNorm.includes('crup')) {
      rr = clamp(rr - (rr > 22 ? 2 : 0), 14, 42);
      spo2 = clamp(spo2 + (spo2 < 95 ? 2 : 0), 74, 99);
      effectSeverity = 'parcial';
      summary = 'Corticoide sistémico administrado: inicio de efecto antiinflamatorio (efecto pleno en 1-4 h).';
      patientFeelingNote = isPediatric
        ? 'Ya le pasaron la dosis para desinflamar; mi niño parece tolerarla bien mientras respira más tranquilo.'
        : 'Sentí un poquito de calor al pasar el medicamento, doctor, sigo esperando que desinflame más.';
    } else {
      effectSeverity = 'sin_cambio';
      summary = 'Corticoide sistémico administrado sin cambios agudos inmediatos en monitor.';
      patientFeelingNote = 'Ya me pusieron esa dosis, doctor; por ahora me siento muy parecido.';
    }
  }
  // 16. SULFATO DE MAGNESIO IV
  else if (/\b(sulfato de magnesio|magnesio|mgso4)\b/.test(drugNorm)) {
    const grams = parsedDose.mg ? parsedDose.mg / 1000 : 4;
    if (grams >= 8) {
      rr = clamp(rr - 6, 9, 40);
      sys = clamp(sys - 16, 75, 220);
      effectSeverity = 'reaccion_adversa';
      summary = `Signos de hipermagnesemia / depresión neuromuscular por dosis excesiva (${cleanDose}): bradipnea e hipotensión.`;
      patientFeelingNote =
        'Doctor, siento mucho bochorno, muchísima pesadez muscular y me cuesta trabajo mantener los ojos abiertos...';
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
  // 17. OTROS FÁRMACOS ESCRITOS POR EL CLÍNICO
  else {
    if (/\b(clorfeniramina|difenhidramina|loratadina|cetirizina)\b/.test(drugNorm) && (isAnaphylaxis || diagNorm.includes('urticaria') || diagNorm.includes('alerg'))) {
      hr = clamp(hr - (hr > 100 ? 6 : 2), 55, 165);
      effectSeverity = 'parcial';
      summary = 'Antihistamínico H1 administrado: alivio de prurito/urticaria (recordar que en anafilaxia no sustituye a la adrenalina IM).';
      patientFeelingNote = 'Ya me pica un poquito menos la piel y siento algo de sueño, doctor.';
    } else if (/\b(ceftriaxona|ampicilina|amoxicilina|azitromicina|levofloxacino|meropenem|vancomicina|clindamicina|metronidazol|piperacilina)\b/.test(drugNorm)) {
      effectSeverity = 'parcial';
      summary = 'Primera dosis antimicrobiana administrada en ventana oportuna; requiere horas para respuesta térmica/hemodinámica.';
      patientFeelingNote = isPediatric
        ? 'Ya le pasaron la primera dosis del antibiótico por la vena, doctor; el niño sigue vigilado.'
        : 'Ya me pasaron ese antibiótico por la vena, doctor; por ahora me siento parecido mientras hace efecto.';
    } else if (/\b(ketorolaco|butilhioscina|buscapina|tramadol|omeprazol)\b/.test(drugNorm)) {
      hr = clamp(hr - (hr > 96 ? 8 : 3), 55, 165);
      rr = clamp(rr - (rr > 20 ? 2 : 0), 12, 38);
      effectSeverity = 'mejoria';
      summary = `Alivio sintomático tras ${cleanDose} de ${cleanDrug} con reducción de taquicardia secundaria al dolor.`;
      patientFeelingNote = isPediatric
        ? 'Parece que le calmó bastante el dolorcito, doctor; ya no llora con tanta fuerza.'
        : 'Sí me calmó bastante la intensidad del dolor, doctor, ya me siento más aliviado.';
    } else {
      effectSeverity = 'sin_cambio';
      summary = `Orden STAT "${cleanDrug} (${cleanDose}, ${cleanRoute})" administrada; sin variación hemodinámica inmediata en monitor.`;
      patientFeelingNote = isPediatric
        ? `Ya le aplicaron ${cleanDrug}, doctor. Mi niño sigue bajo observación sin cambios bruscos por ahora.`
        : `Ya me aplicaron ${cleanDrug}, doctor; por ahora sigo atento a ver cómo evoluciono.`;
    }
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
  };
}
