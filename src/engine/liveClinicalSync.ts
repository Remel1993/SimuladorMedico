import {
  ClinicalCase,
  ClinicalEvolutionState,
  ComplementaryStudy,
  PhysicalExamFinding,
  StatInterventionRecord,
  VitalSigns,
} from '../types/clinical';

function normText(value: string): string {
  return (value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseBP(bp: string): { sys: number; dia: number } {
  const m = (bp || '').match(/(\d+)\s*\/\s*(\d+)/);
  return {
    sys: m ? parseInt(m[1], 10) : 120,
    dia: m ? parseInt(m[2], 10) : 80,
  };
}

function parseDoseAmount(doseText: string): number {
  const m = (doseText || '').replace(',', '.').match(/(\d+(?:\.\d+)?)/);
  return m ? parseFloat(m[1]) : 0;
}

function lastIndexMatching(
  list: StatInterventionRecord[],
  predicate: (r: StatInterventionRecord) => boolean
): number {
  for (let i = list.length - 1; i >= 0; i--) {
    if (predicate(list[i])) return i;
  }
  return -1;
}

export interface LiveClinicalSnapshot {
  isDeceased: boolean;
  deathAgent?: StatInterventionRecord;
  baseBP: { sys: number; dia: number };
  liveBP: { sys: number; dia: number };
  baseVitals: VitalSigns;
  liveVitals: VitalSigns;
  opioidExposure: boolean;
  opioidActive: boolean;
  opioidReversed: boolean;
  benzoExposure: boolean;
  benzoActive: boolean;
  benzoReversed: boolean;
  mgExposure: boolean;
  mgActive: boolean;
  mgReversed: boolean;
  kclToxicity: boolean;
  insulinGiven: boolean;
  dextroseGiven: boolean;
  hypoglycemiaActive: boolean;
  hypoglycemiaResolved: boolean;
  anaphylaxisActive: boolean;
  anaphylaxisResolved: boolean;
  fluidOverloadActive: boolean;
  bleedingIatrogenesis: boolean;
  bronchospasmIatrogenic: boolean;
  iatrogenicShock: boolean;
  adrenergicCrisis: boolean;
  hepatotoxicityRisk: boolean;
  nacProtected: boolean;
  hypercapnicNarcosis: boolean;
  improvedRespiratory: boolean;
  improvedHemodynamics: boolean;
  improvedFever: boolean;
  hasMeaningfulVitalShift: boolean;
}

export function deriveLiveClinicalSnapshot(
  caseData: ClinicalCase,
  liveVitals: VitalSigns,
  statInterventions: StatInterventionRecord[],
  evolutionState?: ClinicalEvolutionState
): LiveClinicalSnapshot {
  const baseVitals = caseData.vitalSigns;
  const baseBP = parseBP(baseVitals.bloodPressure);
  const liveBP = parseBP(liveVitals.bloodPressure);

  const deathAgent = statInterventions.find((s) => s.isImmediateDeath);
  const isDeceased = Boolean(
    deathAgent || liveVitals.heartRate === 0 || (liveVitals.bloodPressure || '').startsWith('0/')
  );

  const isOpioid = (r: StatInterventionRecord) =>
    /\b(morfina|fentanil[oa]?|tramadol|meperidina|petidina|oxicodona|buprenorfina)\b/.test(normText(r.drug));
  const isNaloxone = (r: StatInterventionRecord) => /\bnaloxon/.test(normText(r.drug));
  const isBenzo = (r: StatInterventionRecord) =>
    /\b(diazepam|midazolam|lorazepam|clonazepam|alprazolam)\b/.test(normText(r.drug));
  const isFlumazenil = (r: StatInterventionRecord) => /\bflumazenil/.test(normText(r.drug));
  const isMg = (r: StatInterventionRecord) =>
    /\b(magnesio|mgso4|sulfato de magnesio)\b/.test(normText(r.drug));
  const isCa = (r: StatInterventionRecord) =>
    /\b(gluconato de calcio|cloruro de calcio|calcio)\b/.test(normText(r.drug));

  const lastOpioidIdx = lastIndexMatching(statInterventions, isOpioid);
  const lastNaloxoneIdx = lastIndexMatching(statInterventions, isNaloxone);
  const lastBenzoIdx = lastIndexMatching(statInterventions, isBenzo);
  const lastFlumazenilIdx = lastIndexMatching(statInterventions, isFlumazenil);
  const lastMgIdx = lastIndexMatching(statInterventions, isMg);
  const lastCaIdx = lastIndexMatching(statInterventions, isCa);

  const opioidExposure = lastOpioidIdx >= 0;
  const opioidAdverse =
    lastOpioidIdx >= 0 && statInterventions[lastOpioidIdx].effectSeverity === 'reaccion_adversa';
  const opioidActive =
    opioidExposure &&
    lastOpioidIdx > lastNaloxoneIdx &&
    (opioidAdverse || liveVitals.respiratoryRate <= 11 || liveVitals.glasgow <= 12);
  const opioidReversed = opioidExposure && lastNaloxoneIdx > lastOpioidIdx && liveVitals.glasgow >= 13;

  const benzoExposure = lastBenzoIdx >= 0;
  const benzoAdverse =
    lastBenzoIdx >= 0 && statInterventions[lastBenzoIdx].effectSeverity === 'reaccion_adversa';
  const benzoActive =
    benzoExposure &&
    lastBenzoIdx > lastFlumazenilIdx &&
    (benzoAdverse || liveVitals.respiratoryRate <= 11 || liveVitals.glasgow <= 12);
  const benzoReversed = benzoExposure && lastFlumazenilIdx > lastBenzoIdx && liveVitals.glasgow >= 13;

  const mgExposure = lastMgIdx >= 0;
  const mgAdverse =
    lastMgIdx >= 0 &&
    (statInterventions[lastMgIdx].effectSeverity === 'reaccion_adversa' ||
      /hipermagnesemia|arreflexia|depresion/.test(normText(statInterventions[lastMgIdx].physiologicalEffectSummary)));
  const mgActive =
    mgExposure &&
    lastMgIdx > lastCaIdx &&
    (mgAdverse || liveVitals.respiratoryRate <= 11 || liveVitals.glasgow <= 12);
  const mgReversed = mgExposure && lastCaIdx > lastMgIdx && liveVitals.glasgow >= 13;

  const kclToxicity = statInterventions.some(
    (s) =>
      /\b(potasio|kcl)\b/.test(normText(s.drug)) &&
      (s.effectSeverity === 'reaccion_adversa' || s.isImmediateDeath)
  );

  const lastInsulinIdx = lastIndexMatching(statInterventions, (r) => /\binsulin/.test(normText(r.drug)));
  const lastDextroseIdx = lastIndexMatching(statInterventions, (r) =>
    /\b(dextrosa|glucosa|glucosada|dw50|dw10)\b/.test(normText(r.drug))
  );
  const insulinGiven = lastInsulinIdx >= 0;
  const dextroseGiven = lastDextroseIdx >= 0;
  const hypoglycemiaActive =
    typeof liveVitals.bloodGlucose === 'number' && liveVitals.bloodGlucose < 70;
  const hypoglycemiaResolved =
    !hypoglycemiaActive &&
    dextroseGiven &&
    ((typeof baseVitals.bloodGlucose === 'number' && baseVitals.bloodGlucose < 70) ||
      statInterventions.some(
        (s) =>
          s.effectSeverity === 'reaccion_adversa' &&
          /hipoglucem|neuroglucopen/.test(normText(s.physiologicalEffectSummary))
      ));

  const lastAllergyIdx = lastIndexMatching(statInterventions, (r) =>
    r.effectSeverity === 'reaccion_adversa' &&
    /anafil|alergi|angioedema|urticaria/.test(normText(r.physiologicalEffectSummary))
  );
  const lastEpiIdx = lastIndexMatching(statInterventions, (r) =>
    /\b(adrenalina|epinefrina)\b/.test(normText(r.drug)) && r.effectSeverity !== 'reaccion_adversa'
  );
  const anaphylaxisActive =
    lastAllergyIdx >= 0 &&
    (lastEpiIdx < lastAllergyIdx || liveBP.sys < 85 || liveVitals.oxygenSaturation < 92);
  const anaphylaxisResolved =
    lastAllergyIdx >= 0 && lastEpiIdx > lastAllergyIdx && liveBP.sys >= 85 && liveVitals.oxygenSaturation >= 92;

  const fluidOverloadActive = statInterventions.some(
    (s) =>
      s.effectSeverity === 'reaccion_adversa' &&
      /edema pulmonar|sobrecarga hidrica|congestion pulmonar/.test(normText(s.physiologicalEffectSummary))
  );

  const bleedingIatrogenesis = statInterventions.some(
    (s) =>
      s.effectSeverity === 'reaccion_adversa' &&
      /hemorrag|sangr|exsanguin|fibrinol|anticoag/.test(normText(s.physiologicalEffectSummary))
  );

  const bronchospasmIatrogenic = statInterventions.some(
    (s) =>
      s.effectSeverity === 'reaccion_adversa' &&
      /broncoespasmo/.test(normText(s.physiologicalEffectSummary))
  );

  const iatrogenicShock =
    !anaphylaxisActive &&
    statInterventions.some(
      (s) =>
        s.effectSeverity === 'reaccion_adversa' &&
        /hipotension iatrogenica|vasoplej|choque cardiogenico|bradicardia extrema|bloqueo av|descenso tensional/.test(
          normText(s.physiologicalEffectSummary)
        )
    ) &&
    (liveBP.sys < 92 || liveVitals.heartRate < 50);

  const adrenergicCrisis = statInterventions.some(
    (s) =>
      s.effectSeverity === 'reaccion_adversa' &&
      /crisis adrenergica|crisis hipertensiva|descarga adrenergica/.test(normText(s.physiologicalEffectSummary))
  );

  const lastParaIdx = lastIndexMatching(
    statInterventions,
    (r) =>
      /\b(paracetamol|acetaminofen)\b/.test(normText(r.drug)) &&
      (r.effectSeverity === 'reaccion_adversa' || parseDoseAmount(r.dose) >= 3500)
  );
  const lastNacIdx = lastIndexMatching(statInterventions, (r) =>
    /\b(n-acetilcisteina|acetilcisteina|nac|fluimucil)\b/.test(normText(r.drug))
  );
  const hepatotoxicityRisk = lastParaIdx >= 0;
  const nacProtected = lastNacIdx > lastParaIdx && lastNacIdx >= 0;

  const hypercapnicNarcosis = statInterventions.some(
    (s) =>
      s.effectSeverity === 'reaccion_adversa' &&
      /narcosis hipercapnica|hipercapnia/.test(normText(s.physiologicalEffectSummary))
  );

  const improvedRespiratory =
    !isDeceased &&
    !opioidActive &&
    !benzoActive &&
    !fluidOverloadActive &&
    !bronchospasmIatrogenic &&
    ((baseVitals.oxygenSaturation < 93 && liveVitals.oxygenSaturation - baseVitals.oxygenSaturation >= 3) ||
      (baseVitals.respiratoryRate > 22 && baseVitals.respiratoryRate - liveVitals.respiratoryRate >= 3));

  const improvedHemodynamics =
    !isDeceased &&
    !anaphylaxisActive &&
    !iatrogenicShock &&
    !bleedingIatrogenesis &&
    ((baseBP.sys < 95 && liveBP.sys - baseBP.sys >= 12) ||
      (baseBP.sys >= 160 && baseBP.sys - liveBP.sys >= 15) ||
      (baseVitals.heartRate > 115 && baseVitals.heartRate - liveVitals.heartRate >= 14));

  const improvedFever =
    !isDeceased &&
    baseVitals.temperature >= 38.0 &&
    baseVitals.temperature - liveVitals.temperature >= 0.6;

  const hasMeaningfulVitalShift =
    isDeceased ||
    statInterventions.length > 0 ||
    Math.abs(liveBP.sys - baseBP.sys) >= 8 ||
    Math.abs(liveVitals.heartRate - baseVitals.heartRate) >= 10 ||
    Math.abs(liveVitals.respiratoryRate - baseVitals.respiratoryRate) >= 3 ||
    Math.abs(liveVitals.oxygenSaturation - baseVitals.oxygenSaturation) >= 3 ||
    Math.abs(liveVitals.temperature - baseVitals.temperature) >= 0.5 ||
    liveVitals.glasgow !== baseVitals.glasgow ||
    (typeof liveVitals.bloodGlucose === 'number' &&
      typeof baseVitals.bloodGlucose === 'number' &&
      Math.abs(liveVitals.bloodGlucose - baseVitals.bloodGlucose) >= 20) ||
    evolutionState?.trajectory === 'deterioro' ||
    evolutionState?.trajectory === 'critico' ||
    evolutionState?.trajectory === 'mejorando';

  return {
    isDeceased,
    deathAgent,
    baseBP,
    liveBP,
    baseVitals,
    liveVitals,
    opioidExposure,
    opioidActive,
    opioidReversed,
    benzoExposure,
    benzoActive,
    benzoReversed,
    mgExposure,
    mgActive,
    mgReversed,
    kclToxicity,
    insulinGiven,
    dextroseGiven,
    hypoglycemiaActive,
    hypoglycemiaResolved,
    anaphylaxisActive,
    anaphylaxisResolved,
    fluidOverloadActive,
    bleedingIatrogenesis,
    bronchospasmIatrogenic,
    iatrogenicShock,
    adrenergicCrisis,
    hepatotoxicityRisk,
    nacProtected,
    hypercapnicNarcosis,
    improvedRespiratory,
    improvedHemodynamics,
    improvedFever,
    hasMeaningfulVitalShift,
  };
}

function replaceStaleVitalsInText(text: string, liveVitals: VitalSigns): string {
  let out = text;
  if (liveVitals.glasgow < 15) {
    out = out
      .replace(/Glasgow\s*(?:pedi[aá]trico\s*)?\d{1,2}\s*\/\s*15/gi, `Glasgow ${liveVitals.glasgow}/15`)
      .replace(/consciente y orientado en las tres esferas/gi, `con compromiso del estado de alerta (Glasgow ${liveVitals.glasgow}/15)`)
      .replace(/paciente vigil[^.,;]*/gi, `paciente con alteración del alerta (Glasgow ${liveVitals.glasgow}/15)`);
  }
  return out;
}

export function buildLivePhysicalExams(
  caseData: ClinicalCase,
  liveVitals: VitalSigns,
  statInterventions: StatInterventionRecord[],
  evolutionState?: ClinicalEvolutionState
): PhysicalExamFinding[] {
  const snap = deriveLiveClinicalSnapshot(caseData, liveVitals, statInterventions, evolutionState);

  if (!snap.hasMeaningfulVitalShift && statInterventions.length === 0) {
    return caseData.physicalExamPool;
  }

  const bpDisplay = (liveVitals.bloodPressure || '0/0 mmHg').split(' ')[0];
  const gcs = liveVitals.glasgow;

  return (caseData.physicalExamPool || []).map((pe) => {
    const nameN = normText(pe.name);
    let finding = replaceStaleVitalsInText(pe.finding, liveVitals);
    let isAbnormal = pe.isAbnormal;
    let liveStatus: PhysicalExamFinding['liveStatus'] = undefined;
    let liveUpdateNote: string | undefined = undefined;
    const notes: string[] = [];

    // 1. MUERTE INMEDIATA / ASISTOLIA
    if (snap.isDeceased) {
      const agentTag = snap.deathAgent
        ? ` tras administración de ${snap.deathAgent.drug} (${snap.deathAgent.dose})`
        : '';

      if (pe.system === 'General') {
        finding = `PARO CARDIORRESPIRATORIO / FALLECIDO${agentTag}. Paciente arreactivo (Glasgow 3/15), en apnea completa (FR 0 rpm), cianosis central/palidez cérea extrema, sin pulso ni signos de perfusión.`;
        isAbnormal = true;
        liveStatus = 'critico';
        liveUpdateNote = 'Fallecimiento en sala · Asistolia';
      } else if (pe.system === 'Cabeza y Cuello' && /pupila|ocular|via aerea|orofaring|cuello|carotid/.test(nameN)) {
        finding = `Pupilas midriáticas (>6 mm) bilateralmente y arreactivas a la luz. Ausencia total de pulso carotídeo bilateral. Mucosas cianóticas/pálidas sin reflejo tusígeno ni nauseoso.`;
        isAbnormal = true;
        liveStatus = 'critico';
        liveUpdateNote = 'Midriasis arreactiva · Sin pulso carotídeo';
      } else if (pe.system === 'Tórax y Pulmones') {
        finding = `Apnea absoluta (FR 0 rpm, SpO₂ 0%). Sin amplexación torácica ni ruidos respiratorios audibles (silencio auscultatorio completo).`;
        isAbnormal = true;
        liveStatus = 'critico';
        liveUpdateNote = 'Apnea completa';
      } else if (pe.system === 'Cardiovascular') {
        finding = `ASISTOLIA: Ausencia absoluta de ruidos cardíacos a la auscultación precordial. Pulsos centrales y periféricos completamente ausentes (PA 0/0 mmHg, FC 0 lpm).`;
        isAbnormal = true;
        liveStatus = 'critico';
        liveUpdateNote = 'Sin ruidos cardíacos ni pulsos';
      } else if (pe.system === 'Neurológico') {
        finding = `Coma profundo arreactivo (Glasgow 3/15: O1 V1 M1). Ausencia de reflejos de tronco encefálico, fotomotor y osteotendinosos; flacidez muscular generalizada.`;
        isAbnormal = true;
        liveStatus = 'critico';
        liveUpdateNote = 'Arreactividad total (Glasgow 3/15)';
      }
      return { ...pe, finding, isAbnormal, liveStatus, liveUpdateNote };
    }

    // 2. INSPECCIÓN GENERAL
    if (pe.system === 'General' && /inspeccion|aspecto|estado general|hidratacion|facies|actitud/.test(nameN)) {
      if (snap.hypoglycemiaActive) {
        notes.push(
          `HIPOGLUCEMIA AGUDA EN CURSO (Gluc ${liveVitals.bloodGlucose} mg/dL): diaforesis fría marcada, palidez y ${gcs <= 9 ? `estupor/coma neuroglucopénico (Glasgow ${gcs}/15 — no responde preguntas)` : `temblor fino/agitación (Glasgow ${gcs}/15)`}.`
        );
        isAbnormal = true;
        liveStatus = 'iatrogenia';
      } else if (snap.hypoglycemiaResolved) {
        notes.push(
          `Rescate glucémico efectivo: tras administración de Dextrosa IV la glucemia ascendió a ${liveVitals.bloodGlucose} mg/dL, remitió la diaforesis fría y el paciente recuperó el estado de alerta (Glasgow ${gcs}/15).`
        );
        liveStatus = 'mejoria';
      }

      if (snap.anaphylaxisActive) {
        notes.push(
          `CHOQUE ANAFILÁCTICO ACTIVO tras fármaco STAT: edema facial progresivo, eritema difuso, ansiedad intensa/disfonía e inestabilidad hemodinámica (PA ${bpDisplay} mmHg, SpO₂ ${liveVitals.oxygenSaturation}%).`
        );
        isAbnormal = true;
        liveStatus = 'iatrogenia';
      } else if (snap.anaphylaxisResolved) {
        notes.push(
          `Estabilización post-Adrenalina IM: mejoría del estado general, remisión del edema facial agudo y recuperación hemodinámica (PA ${bpDisplay} mmHg).`
        );
        liveStatus = 'mejoria';
      }

      if (snap.opioidActive || snap.benzoActive) {
        notes.push(
          `DEPRESIÓN DEL SNC POR SOBREDOSIS STAT: paciente ${gcs <= 9 ? 'inconsciente / no responde al llamado verbal' : 'profundamente somnoliento'} (Glasgow ${gcs}/15) con respiración superficial (FR ${liveVitals.respiratoryRate} rpm, SpO₂ ${liveVitals.oxygenSaturation}%).`
        );
        isAbnormal = true;
        liveStatus = 'iatrogenia';
      } else if (snap.opioidReversed || snap.benzoReversed) {
        notes.push(
          `Reversión exitosa tras antídoto específico: recuperación del estado de alerta (Glasgow ${gcs}/15) y patrón respiratorio regular.`
        );
        liveStatus = 'mejoria';
      }

      if (snap.bleedingIatrogenesis) {
        notes.push(
          `HEMORRAGIA IATROGÉNICA EN CURSO: palidez mucocutánea progresiva, diaforesis y sangrado activo en sitios de venopunción o mucosas (PA ${bpDisplay} mmHg, FC ${liveVitals.heartRate} lpm).`
        );
        isAbnormal = true;
        liveStatus = 'iatrogenia';
      }

      if (snap.improvedFever) {
        notes.push(
          `Descenso térmico documentado (Temp actual ${liveVitals.temperature.toFixed(1)} °C vs ${snap.baseVitals.temperature.toFixed(1)} °C al ingreso) con menor malestar general.`
        );
        liveStatus = liveStatus || 'mejoria';
      }

      if (notes.length === 0 && (gcs !== snap.baseVitals.glasgow || Math.abs(snap.liveBP.sys - snap.baseBP.sys) >= 12)) {
        notes.push(
          `Evolución clínica en tiempo real: PA ${bpDisplay} mmHg, FC ${liveVitals.heartRate} lpm, SpO₂ ${liveVitals.oxygenSaturation}%, Glasgow ${gcs}/15.`
        );
        isAbnormal = isAbnormal || gcs < 15 || snap.liveBP.sys < 90;
        liveStatus = evolutionState?.trajectory === 'mejorando' ? 'mejoria' : 'evolucion';
      }
    }

    // 3. CABEZA, PUPILAS Y VÍA AÉREA SUPERIOR
    if (pe.system === 'Cabeza y Cuello') {
      if (/ocular|pupila|via aerea|orofaring/.test(nameN)) {
        if (snap.opioidActive) {
          finding = `Pupilas MIÓTICAS PUNTIFORMES (< 2 mm) bilateralmente, escasamente reactivas a la luz, secundario a intoxicación aguda por opioide STAT. Vía aérea con riesgo de obstrucción por hipotonía faríngea (Glasgow ${gcs}/15).`;
          isAbnormal = true;
          liveStatus = 'iatrogenia';
          liveUpdateNote = 'Miosis puntiforme por opioides';
        } else if (snap.opioidReversed) {
          notes.push(
            `Pupilas nuevamente isocóricas (3 mm) y normorreactivas tras administración de Naloxona IV; vía aérea permeable.`
          );
          liveStatus = 'mejoria';
        }

        if (snap.anaphylaxisActive) {
          notes.push(
            `ANGIOEDEMA AGUDO DE VÍA AÉREA: edema labial y lingual progresivo, edema de úvula/paladar blando y estridor inspiratorio audible tras exposición alergénica STAT.`
          );
          isAbnormal = true;
          liveStatus = 'iatrogenia';
        } else if (snap.anaphylaxisResolved) {
          notes.push(`Disminución del edema de mucosas y desaparición del estridor laríngeo tras Adrenalina IM.`);
          liveStatus = 'mejoria';
        }
      }

      if (/cuello|yugular|carotid/.test(nameN)) {
        if (snap.fluidOverloadActive) {
          notes.push(
            `INGURGITACIÓN YUGULAR FRANCA a 45° y reflujo hepatoyugular positivo secundario a sobrecarga hídrica iatrogénica.`
          );
          isAbnormal = true;
          liveStatus = 'iatrogenia';
        }
      }
    }

    // 4. TÓRAX Y PULMONES
    if (pe.system === 'Tórax y Pulmones') {
      if (snap.anaphylaxisActive || snap.bronchospasmIatrogenic) {
        notes.push(
          `BRONCOESPASMO AGUDO IATROGÉNICO: sibilancias espiratorias intensas y difusas en ambos hemotórax, espiración prolongada, tiraje supraclavicular/intercostal y desaturación (FR ${liveVitals.respiratoryRate} rpm, SpO₂ ${liveVitals.oxygenSaturation}%).`
        );
        isAbnormal = true;
        liveStatus = 'iatrogenia';
      } else if (snap.anaphylaxisResolved) {
        notes.push(
          `Mejoría significativa del broncoespasmo tras Adrenalina IM: menor sibilancia espiratoria y recuperación de SpO₂ (${liveVitals.oxygenSaturation}%).`
        );
        liveStatus = 'mejoria';
      }

      if (snap.fluidOverloadActive) {
        notes.push(
          `EDEMA PULMONAR POR SOBRECARGA HÍDRICA: crepitantes/estertores húmedos bibasales en ascenso (>50% de ambos campos pulmonares), taquipnea (${liveVitals.respiratoryRate} rpm), ortopnea y caída de SpO₂ a ${liveVitals.oxygenSaturation}%.`
        );
        isAbnormal = true;
        liveStatus = 'iatrogenia';
      }

      if (snap.opioidActive || snap.benzoActive || snap.mgActive || snap.hypercapnicNarcosis) {
        notes.push(
          `HIPOVENTILACIÓN ALVEOLAR CENTRAL IATROGÉNICA: bradipnea marcada (${liveVitals.respiratoryRate} rpm), respiración superficial de baja amplitud y murmullo vesicular globalmente disminuido (SpO₂ ${liveVitals.oxygenSaturation}%).`
        );
        isAbnormal = true;
        liveStatus = 'iatrogenia';
      } else if (snap.opioidReversed || snap.benzoReversed || snap.mgReversed) {
        notes.push(
          `Restauración del impulso ventilatorio espontáneo tras antídoto (FR actual ${liveVitals.respiratoryRate} rpm, SpO₂ ${liveVitals.oxygenSaturation}%).`
        );
        liveStatus = 'mejoria';
      }

      if (notes.length === 0 && snap.improvedRespiratory) {
        notes.push(
          `Respuesta respiratoria favorable en curso: mejoría del esfuerzo ventilatorio y oxigenación (FR ${liveVitals.respiratoryRate} rpm, SpO₂ ${liveVitals.oxygenSaturation}%).`
        );
        liveStatus = 'mejoria';
      } else if (notes.length === 0 && (liveVitals.oxygenSaturation < 92 || Math.abs(liveVitals.respiratoryRate - snap.baseVitals.respiratoryRate) >= 4)) {
        notes.push(
          `Revaloración pulmonar en curso: FR actual ${liveVitals.respiratoryRate} rpm, SpO₂ ${liveVitals.oxygenSaturation}%.`
        );
        isAbnormal = isAbnormal || liveVitals.oxygenSaturation < 93 || liveVitals.respiratoryRate > 22 || liveVitals.respiratoryRate <= 11;
        liveStatus = liveVitals.oxygenSaturation < snap.baseVitals.oxygenSaturation ? 'evolucion' : liveStatus;
      }
    }

    // 5. CARDIOVASCULAR
    if (pe.system === 'Cardiovascular') {
      if (snap.kclToxicity) {
        notes.push(
          `CARDIOTOXICIDAD POR POTASIO IV: ritmo cardíaco inestable y deterioro hemodinámico severo con riesgo inminente de fibrilación ventricular o asistolia (PA ${bpDisplay} mmHg, FC ${liveVitals.heartRate} lpm).`
        );
        isAbnormal = true;
        liveStatus = 'iatrogenia';
      }

      if (snap.anaphylaxisActive || snap.iatrogenicShock || snap.bleedingIatrogenesis) {
        notes.push(
          `HIPOPERFUSIÓN / CHOQUE AGUDO EN CURSO (PA ${bpDisplay} mmHg, FC ${liveVitals.heartRate} lpm): pulsos periféricos débiles/filiformes, extremidades frías y llenado capilar enlentecido (> 3 s).`
        );
        isAbnormal = true;
        liveStatus = 'iatrogenia';
      } else if (snap.adrenergicCrisis) {
        notes.push(
          `DESCARGA ADRENÉRGICA / CRISIS HIPERTENSIVA IATROGÉNICA: taquicardia intensa (${liveVitals.heartRate} lpm), hipertensión crítica (${bpDisplay} mmHg), ruidos cardíacos hiperdinámicos.`
        );
        isAbnormal = true;
        liveStatus = 'iatrogenia';
      } else if (snap.fluidOverloadActive) {
        notes.push(
          `Sobrecarga aguda de cavidades cardíacas: aparición de tercer ruido (R3 / ritmo de galope) por hipervolemia iatrogénica.`
        );
        isAbnormal = true;
        liveStatus = 'iatrogenia';
      } else if (snap.improvedHemodynamics || snap.anaphylaxisResolved) {
        notes.push(
          `Estabilización hemodinámica en curso: PA ${bpDisplay} mmHg, FC ${liveVitals.heartRate} lpm, pulsos periféricos de mejor amplitud y llenado capilar < 2 s.`
        );
        liveStatus = 'mejoria';
      } else if (
        Math.abs(snap.liveBP.sys - snap.baseBP.sys) >= 12 ||
        Math.abs(liveVitals.heartRate - snap.baseVitals.heartRate) >= 14
      ) {
        notes.push(
          `Revaloración cardiovascular actual: PA ${bpDisplay} mmHg, FC ${liveVitals.heartRate} lpm.`
        );
        isAbnormal = isAbnormal || snap.liveBP.sys < 90 || liveVitals.heartRate > 110 || liveVitals.heartRate < 50;
        liveStatus = 'evolucion';
      }
    }

    // 6. NEUROLÓGICO
    if (pe.system === 'Neurológico') {
      if (/reflejo|clonus|sensibil|tono|hunter/.test(nameN)) {
        if (snap.mgActive) {
          finding = `ARREFLEXIA OSTEOTENDINOSA GENERALIZADA (0/++++ en reflejos patelar y aquiliano) e hipotonía muscular flácida aguda secundaria a toxicidad por Sulfato de Magnesio (hipermagnesemia iatrogénica).`;
          isAbnormal = true;
          liveStatus = 'iatrogenia';
          liveUpdateNote = 'Arreflexia por hipermagnesemia';
        } else if (snap.mgReversed) {
          notes.push(
            `Reaparición progresiva de reflejos osteotendinosos (+/++++ a ++/++++) y tono muscular tras antagonismo con Gluconato de Calcio IV.`
          );
          liveStatus = 'mejoria';
        }
      }

      if (/conciencia|glasgow|pares|motor|estado mental|neurologic/.test(nameN)) {
        if (gcs <= 9) {
          const causeHint = snap.hypoglycemiaActive
            ? `coma neuroglucopénico por hipoglucemia iatrogénica (${liveVitals.bloodGlucose} mg/dL)`
            : snap.opioidActive
              ? 'coma con depresión respiratoria por opioide STAT'
              : snap.benzoActive
                ? 'sedación profunda / coma por benzodiacepina STAT'
                : snap.mgActive
                  ? 'encefalopatía severa e hipotonía por hipermagnesemia'
                  : 'deterioro neurológico grave en curso';
          finding = `PACIENTE INCONSCIENTE (Glasgow ${gcs}/15): no emite respuesta verbal coherente ni atiende órdenes; presenta ${causeHint}. Priorizar protección de vía aérea y rescate STAT.`;
          isAbnormal = true;
          liveStatus = statInterventions.some((s) => s.effectSeverity === 'reaccion_adversa') ? 'iatrogenia' : 'critico';
          liveUpdateNote = `Inconsciente · Glasgow ${gcs}/15`;
        } else if (snap.opioidReversed || snap.benzoReversed || snap.mgReversed || snap.hypoglycemiaResolved) {
          notes.push(
            `Recuperación neurológica tras antídoto/rescate: paciente nuevamente reactivo (Glasgow ${gcs}/15), obedece órdenes y responde al interrogatorio.`
          );
          liveStatus = 'mejoria';
        } else if (gcs !== snap.baseVitals.glasgow) {
          notes.push(`Estado neurológico actualizado en tiempo real: Glasgow ${gcs}/15.`);
          isAbnormal = isAbnormal || gcs < 15;
          liveStatus = gcs > snap.baseVitals.glasgow ? 'mejoria' : 'evolucion';
        }
      }
    }

    // 7. PIEL / OSTEOMUSCULAR
    if (pe.system === 'Osteomuscular y Piel') {
      if (/nikolsky|piel|cutane|exantema|habon|urticar|torniquete|petequia|extremidad/.test(nameN)) {
        if (snap.anaphylaxisActive) {
          notes.push(
            `REACCIÓN CUTÁNEA ANAFILÁCTICA AGUDA: aparición súbita de habones urticariformes eritematosos confluentes en tronco, cuello y extremidades con prurito intenso y angioedema tras fármaco contraindicado por alergia.`
          );
          isAbnormal = true;
          liveStatus = 'iatrogenia';
        } else if (snap.anaphylaxisResolved) {
          notes.push(`Atenuación progresiva del eritema y habones urticariformes tras Adrenalina IM.`);
          liveStatus = 'mejoria';
        }
      }

      if (/torniquete|petequia|extremidad|vascular|perfusion/.test(nameN)) {
        if (snap.bleedingIatrogenesis) {
          notes.push(
            `Aumento de equimosis espontáneas, sangrado en napa en sitios de punción venosa y frialdad acra por hemorragia iatrogénica activa.`
          );
          isAbnormal = true;
          liveStatus = 'iatrogenia';
        } else if (snap.iatrogenicShock) {
          notes.push(
            `Palidez y frialdad distal en extremidades con llenado capilar > 3 segundos por hipoperfusión farmacológica.`
          );
          isAbnormal = true;
          liveStatus = 'iatrogenia';
        }
      }
    }

    if (notes.length > 0) {
      const prefix =
        liveStatus === 'iatrogenia'
          ? '⚠️ REPORTE EN TIEMPO REAL (EVENTO / IATROGENIA)'
          : liveStatus === 'mejoria'
            ? '✓ EVOLUCIÓN TRAS RESPUESTA TERAPÉUTICA'
            : '↻ EVOLUCIÓN EN TIEMPO REAL';
      const joined = `${finding}\n\n[${prefix}]: ${notes.join(' ')}`;
      return {
        ...pe,
        finding: joined,
        isAbnormal,
        liveStatus,
        liveUpdateNote:
          liveUpdateNote ||
          (liveStatus === 'iatrogenia'
            ? 'Alteración aguda / Iatrogenia en curso'
            : liveStatus === 'mejoria'
              ? 'Mejoría tras tratamiento'
              : 'Actualizado en vivo'),
      };
    }

    return {
      ...pe,
      finding,
      isAbnormal,
      ...(liveStatus ? { liveStatus } : {}),
      ...(liveUpdateNote ? { liveUpdateNote } : {}),
    };
  });
}

export function buildLiveStudies(
  caseData: ClinicalCase,
  liveVitals: VitalSigns,
  statInterventions: StatInterventionRecord[],
  evolutionState?: ClinicalEvolutionState
): ComplementaryStudy[] {
  const snap = deriveLiveClinicalSnapshot(caseData, liveVitals, statInterventions, evolutionState);

  if (!snap.hasMeaningfulVitalShift && statInterventions.length === 0) {
    return caseData.studiesPool;
  }

  const bpDisplay = (liveVitals.bloodPressure || '0/0 mmHg').split(' ')[0];

  return (caseData.studiesPool || []).map((st) => {
    const nameN = normText(st.name);
    let result = st.result;
    let interpretation = st.interpretation || '';
    let isAbnormal = st.isAbnormal;
    let liveStatus: ComplementaryStudy['liveStatus'] = undefined;
    let liveUpdateNote: string | undefined = undefined;

    // 1. ELECTROCARGIOGRAMA 12 DERIVACIONES & HOLTER
    if (nameN.includes('electrocardiograma') || /\becg\b/.test(nameN) || /\bekg\b/.test(nameN)) {
      if (snap.isDeceased) {
        result = `TRAZO ISOELÉCTRICO CONTINUO (ASISTOLIA). Frecuencia cardíaca: 0 lpm. Ausencia total de ondas P, complejos QRS y ondas T en las 12 derivaciones.${snap.kclToxicity ? ' (Paro eléctrico terminal secundario a hiperkalemia masiva por KCl IV).' : ''}`;
        interpretation = `ASISTOLIA IRREVERSIBLE en monitoreo electrocardiográfico${snap.deathAgent ? ` tras ${snap.deathAgent.drug} (${snap.deathAgent.dose})` : ''}.`;
        isAbnormal = true;
        liveStatus = 'critico';
        liveUpdateNote = 'Asistolia (0 lpm) en vivo';
      } else if (snap.kclToxicity) {
        result = `Ritmo nodal / ventricular inestable. FC: ${liveVitals.heartRate} lpm. Ondas T altas, picudas y simétricas ("en tienda de campaña") en V2-V5, aplanamiento de onda P, prolongación del intervalo PR y ensanchamiento marcado del QRS (>140 ms) con tendencia a patrón sinusoidal.`;
        interpretation = `URGENCIA ELECTROCARDIOGRÁFICA POR HIPERKALEMIA IATROGÉNICA (tras KCl IV): riesgo inmediato de fibrilación ventricular o asistolia.`;
        isAbnormal = true;
        liveStatus = 'iatrogenia';
        liveUpdateNote = 'Cambios agudos de hiperkalemia';
      } else if (snap.hypoglycemiaActive) {
        const rhythmLabel =
          liveVitals.heartRate < 60
            ? 'Bradicardia sinusal severa / ritmo lento pre-colapso'
            : liveVitals.heartRate >= 100
              ? 'Taquicardia sinusal marcada'
              : 'Ritmo sinusal con trastorno de repolarización';
        result = `${rhythmLabel}. Frecuencia cardíaca: ${liveVitals.heartRate} lpm. Intervalo QTc prolongado (475 ms) con aplanamiento de onda T secundario a hipokalemia/estrés metabólico por hipoglucemia severa.`;
        interpretation = `Alteración electrocardiográfica (QTc prolongado, FC ${liveVitals.heartRate} lpm) inducida por hipoglucemia crítica e insulina (${liveVitals.bloodGlucose} mg/dL).`;
        isAbnormal = true;
        liveStatus = 'iatrogenia';
        liveUpdateNote = `FC ${liveVitals.heartRate} lpm · Efecto insulina`;
      } else if (snap.iatrogenicShock && liveVitals.heartRate < 50) {
        result = `Bradicardia sinusal severa / bloqueo nodal. Frecuencia cardíaca: ${liveVitals.heartRate} lpm. Intervalo PR prolongado (230 ms).`;
        interpretation = `Bradiarritmia e inestabilidad hemodinámica iatrogénica (PA ${bpDisplay} mmHg).`;
        isAbnormal = true;
        liveStatus = 'iatrogenia';
        liveUpdateNote = `Bradicardia ${liveVitals.heartRate} lpm`;
      } else if (snap.adrenergicCrisis) {
        result = `Taquicardia sinusal severa a ${liveVitals.heartRate} lpm con extrasístoles ventriculares frecuentes y descenso del segmento ST de sobrecarga/demanda en cara anterolateral.`;
        interpretation = `Sobrecarga adrenérgica severa e isquemia subendocárdica por demanda tras exceso vasopresor/adrenalina.`;
        isAbnormal = true;
        liveStatus = 'iatrogenia';
        liveUpdateNote = `Taquicardia crítica (${liveVitals.heartRate} lpm)`;
      } else if (Math.abs(liveVitals.heartRate - snap.baseVitals.heartRate) >= 15) {
        result = `${result}\n\n[ACTUALIZACIÓN EN TIEMPO REAL]: Frecuencia cardíaca actual en tira de control: ${liveVitals.heartRate} lpm (PA ${bpDisplay} mmHg).`;
        liveStatus = snap.improvedHemodynamics ? 'mejoria' : 'evolucion';
        liveUpdateNote = `FC en vivo: ${liveVitals.heartRate} lpm`;
      }
      return { ...st, result, interpretation, isAbnormal, liveStatus, liveUpdateNote };
    }

    // 2. QUÍMICA SANGUÍNEA BÁSICA (Glucosa / Glucemia, Creatinina, Urea)
    if (
      (st.subcategory === 'Bioquímica' &&
        !nameN.includes('hba1c') &&
        !nameN.includes('lipid') &&
        (nameN.includes('quimica sanguinea') ||
          nameN.includes('glucosa') ||
          nameN.includes('glucemia') ||
          nameN.includes('creatinina'))) ||
      nameN.includes('quimica sanguinea')
    ) {
      const gluNow =
        typeof liveVitals.bloodGlucose === 'number' ? liveVitals.bloodGlucose : undefined;
      const gluChanged =
        gluNow !== undefined &&
        (snap.insulinGiven ||
          snap.dextroseGiven ||
          typeof snap.baseVitals.bloodGlucose !== 'number' ||
          Math.abs(gluNow - snap.baseVitals.bloodGlucose) >= 15);
      const prerenalAki =
        snap.iatrogenicShock || snap.bleedingIatrogenesis || snap.anaphylaxisActive || snap.liveBP.sys < 85;

      if (gluChanged || prerenalAki || snap.isDeceased) {
        const gluText =
          gluNow !== undefined
            ? gluNow < 54
              ? `${gluNow} mg/dL (HIPOGLUCEMIA CRÍTICA IATROGÉNICA)`
              : gluNow < 70
                ? `${gluNow} mg/dL (HIPOGLUCEMIA)`
                : gluNow >= 250
                  ? `${gluNow} mg/dL (HIPERGLUCEMIA SEVERA)`
                  : `${gluNow} mg/dL`
            : 'Según control actual';
        const creatText = prerenalAki
          ? '1.95 mg/dL (EN ASCENSO AGUDO por hipoperfusión renal / choque)'
          : 'Acorde a basal';
        result = `${result}\n\n[CONTROL BIOQUÍMICO EN TIEMPO REAL]: Glucosa sérica actual: ${gluText} | Perfusión renal / Creatinina estimada: ${creatText}.`;
        if (gluNow !== undefined && gluNow < 70) {
          interpretation = `ALERTA METABÓLICA EN CURSO: Hipoglucemia aguda (${gluNow} mg/dL)${snap.insulinGiven ? ' secundaria a dosis excesiva de insulina' : ''}. Requiere Dextrosa hipertónica IV inmediata.`;
          isAbnormal = true;
          liveStatus = 'iatrogenia';
          liveUpdateNote = `Glucosa actual: ${gluNow} mg/dL`;
        } else if (snap.hypoglycemiaResolved && gluNow !== undefined) {
          interpretation = `Corrección metabólica tras Dextrosa IV: glucemia actual ${gluNow} mg/dL fuera de riesgo neuroglucopénico inmediato.`;
          liveStatus = 'mejoria';
          liveUpdateNote = `Glucemia corregida (${gluNow} mg/dL)`;
        } else if (prerenalAki) {
          interpretation = `Deterioro agudo de perfusión renal secundario a hipotensión/choque en evolución (PA ${bpDisplay} mmHg).`;
          isAbnormal = true;
          liveStatus = 'iatrogenia';
          liveUpdateNote = 'Injuria renal prerrenal en curso';
        } else if (gluNow !== undefined) {
          liveStatus = gluNow < (snap.baseVitals.bloodGlucose ?? gluNow) ? 'mejoria' : 'evolucion';
          liveUpdateNote = `Glucosa actual: ${gluNow} mg/dL`;
        }
      }
      return { ...st, result, interpretation, isAbnormal, liveStatus, liveUpdateNote };
    }

    // 3. ELECTROLITOS SÉRICOS
    if (st.subcategory === 'Electrolitos' || nameN.includes('electrolito')) {
      const kDropByInsulin =
        snap.insulinGiven &&
        statInterventions.some(
          (s) =>
            /\binsulin/.test(normText(s.drug)) &&
            (s.effectSeverity === 'reaccion_adversa' || parseDoseAmount(s.dose) >= 25)
        );
      if (snap.kclToxicity || snap.mgExposure || kDropByInsulin) {
        const kVal = snap.kclToxicity
          ? '8.4 mEq/L (HIPERKALEMIA LETAL IATROGÉNICA tras KCl IV)'
          : kDropByInsulin
            ? '2.5 mEq/L (HIPOKALEMIA AGUDA por desplazamiento intracelular masivo tras dosis alta de insulina)'
            : '4.1 mEq/L';
        const mgVal = snap.mgActive
          ? '7.8 mg/dL (HIPERMAGNESEMIA TÓXICA tras Sulfato de Magnesio)'
          : snap.mgReversed
            ? '5.2 mg/dL (en descenso; toxicidad antagonizada con Gluconato de Calcio)'
            : '2.0 mg/dL';
        const caVal = snap.mgReversed ? '10.6 mg/dL (post-Gluconato de Calcio IV)' : '9.2 mg/dL';
        result = `${result}\n\n[ELECTROLITOS SERIADOS EN TIEMPO REAL]: Potasio (K⁺): ${kVal} | Magnesio (Mg²⁺): ${mgVal} | Calcio total: ${caVal}.`;
        isAbnormal = isAbnormal || snap.kclToxicity || snap.mgActive || kDropByInsulin;
        if (snap.kclToxicity || snap.mgActive || kDropByInsulin) {
          liveStatus = 'iatrogenia';
          liveUpdateNote = snap.kclToxicity
            ? 'K⁺ 8.4 mEq/L (Hiperkalemia crítica)'
            : snap.mgActive
              ? 'Mg²⁺ 7.8 mg/dL (Hipermagnesemia)'
              : 'K⁺ 2.5 mEq/L (Hipokalemia por insulina)';
          interpretation = `${interpretation ? interpretation + ' · ' : ''}Alteración electrolítica aguda iatrogénica documentada en tiempo real.`;
        } else if (snap.mgReversed) {
          liveStatus = 'mejoria';
          liveUpdateNote = 'Antagonismo de Mg²⁺ con Calcio';
        }
      }
      return { ...st, result, interpretation, isAbnormal, liveStatus, liveUpdateNote };
    }

    // 4. GASOMETRÍA ARTERIAL Y LACTATO
    if (st.subcategory === 'Gases' || nameN.includes('gasometria')) {
      const spo2 = liveVitals.oxygenSaturation;
      const rr = liveVitals.respiratoryRate;
      const shockPresent =
        snap.anaphylaxisActive || snap.iatrogenicShock || snap.bleedingIatrogenesis || snap.liveBP.sys < 88;
      const respDep = snap.opioidActive || snap.benzoActive || snap.mgActive || snap.hypercapnicNarcosis || rr <= 10;

      if (snap.isDeceased || respDep || shockPresent || spo2 < 92 || snap.improvedRespiratory || snap.improvedHemodynamics) {
        let ph = '7.39';
        let paco2 = '38';
        let pao2 = String(Math.max(40, Math.min(105, Math.round(spo2 * 0.94))));
        let hco3 = '23.0';
        let lactato = '1.3';
        let gasNote = '';

        if (snap.isDeceased) {
          ph = '6.92';
          paco2 = '82';
          pao2 = '18';
          hco3 = '14.5';
          lactato = '11.8';
          gasNote = 'Acidosis mixta extrema e hipoxemia crítica terminal post-parada cardiorrespiratoria.';
          liveStatus = 'critico';
          liveUpdateNote = 'Acidosis crítica · Lactato 11.8';
        } else if (respDep) {
          ph = '7.19';
          paco2 = rr <= 7 ? '72' : '60';
          pao2 = String(Math.max(38, Math.round(spo2 * 0.62)));
          hco3 = '25.0';
          lactato = shockPresent ? '4.8' : '2.4';
          gasNote = 'ACIDOSIS RESPIRATORIA AGUDA HIPERCÁPNICA E HIPOXEMIA por depresión ventilatoria / narcosis iatrogénica.';
          liveStatus = 'iatrogenia';
          liveUpdateNote = `pH ${ph} · PaCO₂ ${paco2} mmHg`;
        } else if (shockPresent) {
          ph = '7.23';
          paco2 = String(Math.max(24, Math.min(36, 40 - Math.max(0, rr - 18))));
          pao2 = String(Math.max(50, Math.round(spo2 * 0.78)));
          hco3 = '14.8';
          lactato = '5.6';
          gasNote = 'ACIDOSIS METABÓLICA HIPERLACTATÉMICA AGUDA por hipoperfusión sistémica y estado de choque en evolución.';
          liveStatus = 'iatrogenia';
          liveUpdateNote = `pH ${ph} · Lactato ${lactato} mmol/L`;
        } else if (spo2 < 92) {
          ph = '7.34';
          paco2 = '34';
          pao2 = String(Math.max(46, Math.round(spo2 * 0.68)));
          hco3 = '20.5';
          lactato = '2.7';
          gasNote = `Insuficiencia respiratoria hipoxémica aguda en curso (SaO₂ ${spo2}%) ${snap.fluidOverloadActive ? 'por edema pulmonar agudo' : snap.bronchospasmIatrogenic ? 'por broncoespasmo agudo' : ''}.`;
          liveStatus = snap.fluidOverloadActive || snap.bronchospasmIatrogenic ? 'iatrogenia' : 'evolucion';
          liveUpdateNote = `PaO₂ ${pao2} · SaO₂ ${spo2}%`;
        } else if (snap.improvedRespiratory || snap.improvedHemodynamics || snap.opioidReversed || snap.benzoReversed) {
          ph = '7.38';
          paco2 = '39';
          pao2 = String(Math.max(76, Math.round(spo2 * 0.92)));
          hco3 = '22.8';
          lactato = '1.6';
          gasNote = `Mejoría gasométrica documentada tras estabilización STAT (SaO₂ ${spo2}%, descenso de lactato).`;
          liveStatus = 'mejoria';
          liveUpdateNote = `Oxigenación recuperada (${spo2}%)`;
        }

        if (gasNote) {
          result = `${result}\n\n[GASOMETRÍA ARTERIAL ACTUALIZADA EN TIEMPO REAL]: pH: ${ph} | PaCO₂: ${paco2} mmHg | PaO₂: ${pao2} mmHg | HCO₃⁻: ${hco3} mEq/L | SaO₂: ${spo2}% | Lactato: ${lactato} mmol/L — ${gasNote}`;
          interpretation = gasNote;
          isAbnormal = liveStatus !== 'mejoria';
        }
      }
      return { ...st, result, interpretation, isAbnormal, liveStatus, liveUpdateNote };
    }

    // 5. HEMOGRAMA & TIEMPOS DE COAGULACIÓN (Hemorragia / Fibrinólisis / Anticoagulación)
    if ((st.subcategory === 'Hematología' && nameN.includes('hemograma')) || nameN.includes('biometria hematica')) {
      if (snap.bleedingIatrogenesis) {
        result = `${result}\n\n[CONTROL HEMATIMÉTRICO EN TIEMPO REAL]: Descenso agudo de Hemoglobina (-2.4 a -3.5 g/dL respecto al basal) y caída progresiva del Hematocrito secundario a hemorragia activa desencadenada por tratamiento antitrombótico/AINE contraindicado.`;
        interpretation = 'Anemia aguda hemorrágica en evolución por iatrogenia hemorrágica.';
        isAbnormal = true;
        liveStatus = 'iatrogenia';
        liveUpdateNote = 'Descenso agudo de Hb/Hto';
      }
      return { ...st, result, interpretation, isAbnormal, liveStatus, liveUpdateNote };
    }

    if (st.subcategory === 'Hematología' && (nameN.includes('coagulacion') || (nameN.includes('tp') && nameN.includes('ttpa')))) {
      const hasAnticoagOrThrombolytic = statInterventions.some((s) =>
        /\b(alteplasa|tenecteplasa|estreptoquinasa|heparina|enoxaparina)\b/.test(normText(s.drug))
      );
      if (hasAnticoagOrThrombolytic || snap.bleedingIatrogenesis) {
        const isLytic = statInterventions.some((s) =>
          /\b(alteplasa|tenecteplasa|estreptoquinasa)\b/.test(normText(s.drug))
        );
        result = `${result}\n\n[COAGULACIÓN DE CONTROL EN TIEMPO REAL]: ${
          isLytic
            ? 'TP > 32 seg (INR > 3.1) | TTPa > 85 seg | Fibrinógeno consumido < 95 mg/dL (hipofibrinogenemia severa post-fibrinólisis).'
            : 'TTPa prolongado (> 68 seg) | INR > 1.8 por anticoagulación aguda / consumo de factores.'
        }`;
        interpretation = snap.bleedingIatrogenesis
          ? 'COAGULOPATÍA IATROGÉNICA SEVERA con hemorragia activa en curso.'
          : 'Anticoagulación/fibrinólisis sistémica activa reflejada en tiempos de coagulación.';
        isAbnormal = true;
        liveStatus = snap.bleedingIatrogenesis ? 'iatrogenia' : 'evolucion';
        liveUpdateNote = 'Alteración aguda de coagulación';
      }
      return { ...st, result, interpretation, isAbnormal, liveStatus, liveUpdateNote };
    }

    // 6. TROPONINA & CK-MB (Crisis adrenérgica, choque grave, paro)
    if (st.subcategory === 'Cardiovascular' && (nameN.includes('troponina') || nameN.includes('ck-mb'))) {
      if (snap.adrenergicCrisis || snap.isDeceased || snap.iatrogenicShock) {
        result = `${result}\n\n[BIOMARCADOR SERIADO EN TIEMPO REAL]: Elevación aguda secundaria (Troponina I en ascenso > 0.35 ng/mL) por estrés miocárdico / injuria isquémica secundaria a ${snap.adrenergicCrisis ? 'tormenta adrenérgica iatrogénica' : snap.isDeceased ? 'paro cardíaco' : 'hipoperfusión severa (PA ' + bpDisplay + ' mmHg)'}.`;
        isAbnormal = true;
        liveStatus = 'iatrogenia';
        liveUpdateNote = 'Injuria miocárdica secundaria';
      }
      return { ...st, result, interpretation, isAbnormal, liveStatus, liveUpdateNote };
    }

    // 7. PERFIL HEPÁTICO (Hepatotoxicidad paracetamol)
    if (st.subcategory === 'Función Hepática' || nameN.includes('perfil hepatico')) {
      if (snap.hepatotoxicityRisk) {
        result = `${result}\n\n[CONTROL HEPÁTICO EN TIEMPO REAL]: ${
          snap.nacProtected
            ? 'Transaminasas AST/ALT con elevación leve contenida (68 / 74 U/L); N-acetilcisteína iniciada oportunamente protegiendo contra necrosis hepática masiva.'
            : 'Elevación temprana progresiva de AST (285 U/L) y ALT (340 U/L) con tendencia al alargamiento del INR por sobredosis aguda de paracetamol sin antídoto.'
        }`;
        isAbnormal = true;
        liveStatus = snap.nacProtected ? 'mejoria' : 'iatrogenia';
        liveUpdateNote = snap.nacProtected ? 'Protegido con NAC' : 'Hepatotoxicidad aguda en curso';
      }
      return { ...st, result, interpretation, isAbnormal, liveStatus, liveUpdateNote };
    }

    // 8. RADIOGRAFÍA / TAC DE TÓRAX (Edema pulmonar por sobrecarga hídrica)
    if ((nameN.includes('torax') || nameN.includes('pulmon')) && (st.category === 'Imagen')) {
      if (snap.fluidOverloadActive) {
        result = `${result}\n\n[IMAGEN DE CONTROL EN TIEMPO REAL]: Aparición de infiltrado alveolar bilateral simétrico perihiliar en "alas de mariposa", engrosamiento septal (líneas B de Kerley), redistribución vascular hacia vértices y derrame pleural laminar bilateral secundario a EDEMA AGUDO DE PULMÓN por sobrecarga hídrica iatrogénica.`;
        interpretation = 'Congestión venocapilar y edema pulmonar agudo iatrogénico tras reposición volumétrica excesiva.';
        isAbnormal = true;
        liveStatus = 'iatrogenia';
        liveUpdateNote = 'Edema pulmonar en imagen';
      }
      return { ...st, result, interpretation, isAbnormal, liveStatus, liveUpdateNote };
    }

    // 9. TAMIZAJE TOXICOLÓGICO EN ORINA / FÁRMACOS
    if (nameN.includes('toxicol')) {
      if (snap.opioidExposure || snap.benzoExposure || snap.hepatotoxicityRisk) {
        const positives: string[] = [];
        if (snap.opioidExposure) positives.push('Opioides: POSITIVO (administración intrahospitalaria STAT)');
        if (snap.benzoExposure) positives.push('Benzodiacepinas: POSITIVO (administración intrahospitalaria STAT)');
        if (snap.hepatotoxicityRisk) positives.push('Niveles séricos de Paracetamol: EN RANGO TÓXICO');
        result = `${result}\n\n[ACTUALIZACIÓN TOXICOLÓGICA EN TIEMPO REAL]: ${positives.join(' | ')}.`;
        isAbnormal = true;
        liveStatus = 'iatrogenia';
        liveUpdateNote = 'Exposición farmacológica positiva';
      }
      return { ...st, result, interpretation, isAbnormal, liveStatus, liveUpdateNote };
    }

    // 10. EGO (Glucosuria / Hematuria / Oliguria)
    if (st.subcategory === 'Urinario' && (nameN.includes('orina') || nameN.includes('ego'))) {
      if (snap.bleedingIatrogenesis) {
        result = `${result}\n\n[CONTROL URINARIO EN TIEMPO REAL]: Micro/macrohematuria de reciente aparición (> 25 eritrocitos/campo) acorde a síndrome hemorrágico iatrogénico.`;
        isAbnormal = true;
        liveStatus = 'iatrogenia';
        liveUpdateNote = 'Hematuria aguda en EGO';
      } else if (typeof liveVitals.bloodGlucose === 'number' && liveVitals.bloodGlucose >= 200) {
        result = `${result}\n\n[CONTROL URINARIO ACTUAL]: Glucosuria (+++) concordante con hiperglucemia actual (${liveVitals.bloodGlucose} mg/dL).`;
        isAbnormal = true;
        liveStatus = 'evolucion';
      }
      return { ...st, result, interpretation, isAbnormal, liveStatus, liveUpdateNote };
    }

    return st;
  });
}
