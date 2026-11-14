import {
  ClinicalCase,
  EvaluationResult,
  RubricCategoryDetail,
  StatAuditSummary,
  StatInterventionAuditItem,
  UserEvaluationInput,
  VitalSigns,
} from '../types/clinical';

function normStr(s: string): string {
  return (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const STOP_WORDS = new Set([
  'de', 'del', 'la', 'el', 'los', 'las', 'en', 'con', 'sin', 'por', 'para',
  'tipo', 'grado', 'fase', 'aguda', 'agudo', 'grave', 'severa', 'severo',
  'leve', 'moderada', 'moderado', 'cronica', 'cronico', 'sec', 'secundaria',
  'secundario', 'asociada', 'asociado', 'probable', 'posible', 'presuntivo',
  'cuadro', 'sindrome', 'enfermedad', 'alta', 'baja', 'extenso', 'no', 'complicada',
  'complicado', 'reciente', 'primario', 'primaria', 'idiopatica', 'idiopatico',
  'simple', 'tipica', 'tipico', 'estable', 'activa', 'activo', 'esencial',
  'consulta', 'externa', 'nivel', 'primer', 'ventana', 'territorio',
]);

export const EVALUATION_FRAMEWORK_LABEL =
  'Normativa Nicaragüense (MINSA / Lista Básica) + Estándar Internacional (OMS / OPS / AHA / IDSA / NICE)';

interface DiagnosisSynonymGroup {
  label: string;
  terms: string[];
}

const DIAGNOSIS_SYNONYM_GROUPS: DiagnosisSynonymGroup[] = [
  {
    label: 'IVU / Cistitis (ITU baja)',
    terms: ['cistitis', 'ivu baja', 'itu baja', 'infeccion urinaria baja', 'infeccion de vias urinarias baja', 'infeccion vias urinarias', 'infeccion tracto urinario'],
  },
  {
    label: 'Pielonefritis / IVU alta',
    terms: ['pielonefritis', 'ivu alta', 'itu alta', 'infeccion urinaria alta'],
  },
  {
    label: 'ACV / EVC / Ictus',
    terms: ['acv', 'evc', 'ictus', 'stroke', 'evento vascular cerebral', 'evento cerebrovascular', 'accidente cerebrovascular', 'infarto cerebral', 'isquemia cerebral'],
  },
  {
    label: 'IAMCEST / SCACEST',
    terms: ['iamcest', 'scacest', 'iam con elevacion', 'ima con elevacion', 'infarto agudo de miocardio', 'infarto agudo del miocardio', 'infarto al miocardio', 'sindrome coronario agudo con elevacion'],
  },
  {
    label: 'Neumonía Adquirida en la Comunidad (NAC)',
    terms: ['nac', 'neumonia adquirida en la comunidad', 'neumonia comunitaria', 'neumonia bacteriana'],
  },
  {
    label: 'Enfermedad Diarreica Aguda (EDA / GEPI)',
    terms: ['eda', 'edas', 'gepi', 'gastroenteritis', 'diarrea aguda', 'enfermedad diarreica aguda'],
  },
  {
    label: 'Lesión / Insuficiencia Renal Aguda (LRA / AKI)',
    terms: ['lra', 'aki', 'lesion renal aguda', 'insuficiencia renal aguda', 'injuria renal aguda', 'falla renal aguda'],
  },
  {
    label: 'Dengue con Signos de Alarma (Grupo B2)',
    terms: ['dengue con signos de alarma', 'dengue signos de alarma', 'dengue grupo b2', 'dengue b2', 'dengue con alarma'],
  },
  {
    label: 'Tromboembolia Pulmonar (TEP)',
    terms: ['tep', 'tromboembolia pulmonar', 'embolia pulmonar', 'tromboembolismo pulmonar'],
  },
  {
    label: 'Cetoacidosis Diabética (CAD)',
    terms: ['cad', 'cetoacidosis diabetica'],
  },
  {
    label: 'Estado Hiperosmolar Hiperglucémico (EHH)',
    terms: ['ehh', 'estado hiperosmolar'],
  },
  {
    label: 'Hipertensión Arterial (HTA)',
    terms: ['hta', 'hipertension arterial', 'hipertension esencial'],
  },
  {
    label: 'Diabetes Mellitus Tipo 2 (DM2)',
    terms: ['dm2', 'dm 2', 'diabetes mellitus tipo 2', 'diabetes tipo 2'],
  },
  {
    label: 'EPOC',
    terms: ['epoc', 'enfermedad pulmonar obstructiva cronica'],
  },
  {
    label: 'ERGE / Reflujo Gastroesofágico',
    terms: ['erge', 'reflujo gastroesofagico', 'enfermedad por reflujo'],
  },
  {
    label: 'Síndrome de Intestino Irritable (SII)',
    terms: ['sii', 'intestino irritable', 'colon irritable'],
  },
  {
    label: 'Síndrome de Ovario Poliquístico (SOP)',
    terms: ['sop', 'ovario poliquistico'],
  },
  {
    label: 'Vértigo Posicional Paroxístico Benigno (VPPB)',
    terms: ['vppb', 'vertigo posicional', 'vertigo benigno'],
  },
  {
    label: 'Otitis Media Aguda (OMA)',
    terms: ['oma', 'otitis media aguda'],
  },
  {
    label: 'Faringoamigdalitis Estreptocócica',
    terms: ['faringoamigdalitis', 'amigdalitis estreptococica', 'faringitis estreptococica'],
  },
  {
    label: 'Laringotraqueobronquitis / Crup',
    terms: ['crup', 'croup', 'laringotraqueobronquitis', 'laringotraqueitis'],
  },
  {
    label: 'Herpes Zóster',
    terms: ['herpes zoster', 'zoster', 'culebrilla'],
  },
  {
    label: 'Tiña Corporal / Dermatofitosis',
    terms: ['tina corporal', 'tinea corporis', 'dermatofitosis', 'micosis superficial'],
  },
  {
    label: 'Parálisis Facial Periférica (Bell)',
    terms: ['paralisis de bell', 'paralisis facial periferica', 'paralisis facial idiopatica'],
  },
  {
    label: 'Síndrome de Stevens-Johnson (SSJ)',
    terms: ['ssj', 'stevens johnson', 'necrolisis epidermica'],
  },
  {
    label: 'Preeclampsia / Trastorno Hipertensivo Gestacional',
    terms: ['preeclampsia', 'sindrome hipertensivo gestacional', 'trastorno hipertensivo del embarazo'],
  },
  {
    label: 'Choque Anafiláctico / Anafilaxia',
    terms: ['anafilaxia', 'choque anafilactico', 'shock anafilactico'],
  },
  {
    label: 'Choque Séptico / Sepsis',
    terms: ['sepsis', 'choque septico', 'shock septico', 'urosepsis'],
  },
  {
    label: 'Lumbalgia Mecánica / Radiculopatía',
    terms: ['lumbalgia', 'lumbago', 'dolor lumbar'],
  },
  {
    label: 'Radiculopatía Lumbar / Ciática',
    terms: ['radiculopatia', 'lumbociatica', 'ciatica', 'hernia discal'],
  },
  {
    label: 'Anemia Ferropénica',
    terms: ['anemia ferropenica', 'anemia por deficiencia de hierro', 'anemia microcitica ferropenica'],
  },
  {
    label: 'Anemia Megaloblástica / Déficit B12',
    terms: ['anemia megaloblastica', 'deficiencia de vitamina b12', 'deficit de b12', 'cobalamina'],
  },
];

function expandClinicalAbbreviations(rawText: string, targetContextNorm = ''): string {
  let text = normStr(rawText);
  if (!text) return '';

  const isRenalTarget = /renal|rinon|nefro|hiperpotas|hiperkal/.test(targetContextNorm);
  const replacements: Array<[RegExp, string]> = [
    [/\bivu\b/g, 'infeccion vias urinarias cistitis pielonefritis'],
    [/\bitu\b/g, 'infeccion tracto urinario cistitis pielonefritis'],
    [/\bedas?\b/g, 'enfermedad diarreica aguda gastroenteritis diarrea'],
    [/\bgepi\b/g, 'gastroenteritis infecciosa diarrea aguda'],
    [/\bnac\b/g, 'neumonia adquirida comunidad'],
    [/\b(?:acv|evc|ictus|stroke)\b/g, 'evento vascular cerebral cerebrovascular ictus isquemia'],
    [/\b(?:iamcest|scacest)\b/g, 'infarto agudo miocardio elevacion segmento st'],
    [/\bima\b/g, 'infarto agudo miocardio'],
    [/\bsca\b/g, 'sindrome coronario agudo'],
    [/\b(?:lra|aki)\b/g, 'lesion insuficiencia renal aguda'],
    [/\bira\b/g, isRenalTarget ? 'insuficiencia lesion renal aguda' : 'infeccion respiratoria aguda'],
    [/\bcad\b/g, 'cetoacidosis diabetica'],
    [/\behh\b/g, 'estado hiperosmolar hiperglucemico'],
    [/\btep\b/g, 'tromboembolia pulmonar embolia'],
    [/\bhta\b/g, 'hipertension arterial sistemica'],
    [/\bdm2\b|\bdm\s*2\b/g, 'diabetes mellitus tipo 2'],
    [/\bepoc\b/g, 'enfermedad pulmonar obstructiva cronica'],
    [/\bvppb\b/g, 'vertigo posicional paroxistico benigno'],
    [/\berge\b/g, 'enfermedad reflujo gastroesofagico'],
    [/\bsii\b/g, 'sindrome intestino irritable'],
    [/\bsop\b/g, 'sindrome ovario poliquistico'],
    [/\boma\b/g, 'otitis media aguda'],
    [/\bssj\b/g, 'sindrome stevens johnson'],
    [/\bles\b/g, 'lupus eritematoso sistemico'],
    [/\bhda\b/g, 'hemorragia digestiva alta'],
    [/\btvp\b/g, 'trombosis venosa profunda'],
    [/\bculebrilla\b/g, 'herpes zoster'],
    [/\blumbago\b/g, 'lumbalgia'],
    [/\bciatica\b|\blumbociatica\b/g, 'radiculopatia lumbar ciatica'],
    [/\bshock\b/g, 'choque'],
    [/\bgrupo\s*b2\b/g, 'dengue signos alarma'],
    [/\bbell\b/g, 'paralisis facial periferica bell'],
    [/\bcrup\b|\bcroup\b/g, 'laringotraqueobronquitis crup'],
    [/\btina\b|\btinea\b/g, 'tina tinea dermatofitosis'],
  ];

  for (const [pattern, expansion] of replacements) {
    if (pattern.test(text)) {
      text = `${text} ${expansion}`;
    }
  }
  return text.trim();
}

function stripParentheticalQualifiers(text: string): string {
  return (text || '')
    .replace(/\([^)]*\)/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function significantTokens(s: string): string[] {
  return normStr(s)
    .split(' ')
    .filter((w) => w.length >= 3 && !STOP_WORDS.has(w));
}

function tokenMatchRatio(userText: string, targetText: string): number {
  const tTokens = significantTokens(targetText);
  if (tTokens.length === 0) return 0;
  const targetNorm = normStr(targetText);
  const uNorm = expandClinicalAbbreviations(userText, targetNorm);
  if (!uNorm) return 0;

  let hits = 0;
  for (const tk of tTokens) {
    const stem = tk.slice(0, Math.max(4, tk.length - 1));
    if (uNorm.includes(tk) || uNorm.includes(stem)) {
      hits += 1;
    }
  }
  return hits / tTokens.length;
}

function hasClinicalTerm(normHaystack: string, normTerm: string): boolean {
  if (!normHaystack || !normTerm) return false;
  const escaped = normTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+');
  return new RegExp(`(?:^|\\s)${escaped}(?=\\s|$)`).test(normHaystack);
}

function computeClinicalDiagnosisMatch(
  userText: string,
  targetText: string
): { ratio: number; matchedSynonymLabel?: string } {
  const uRawNorm = normStr(userText);
  const tRawNorm = normStr(targetText);
  if (!uRawNorm || !tRawNorm) return { ratio: 0 };

  const coreTarget = stripParentheticalQualifiers(targetText);
  const fullRatio = tokenMatchRatio(userText, targetText);
  const coreRatio = coreTarget ? tokenMatchRatio(userText, coreTarget) : 0;
  let bestRatio = Math.max(fullRatio, coreRatio >= 0.7 ? Math.max(fullRatio, 0.85) : coreRatio);
  let matchedSynonymLabel: string | undefined;

  // Check if both user diagnosis and target belong to the same recognized clinical synonym/acronym group
  const uExpanded = expandClinicalAbbreviations(userText, tRawNorm);
  const tExpanded = expandClinicalAbbreviations(targetText, tRawNorm);
  for (const group of DIAGNOSIS_SYNONYM_GROUPS) {
    const targetInGroup = group.terms.some(
      (term) => hasClinicalTerm(tRawNorm, term) || hasClinicalTerm(tExpanded, term)
    );
    if (!targetInGroup) continue;
    const userInGroup = group.terms.some(
      (term) => hasClinicalTerm(uRawNorm, term) || hasClinicalTerm(uExpanded, term)
    );
    if (userInGroup) {
      // Preserve subtype accuracy when target explicitly specifies "baja" vs "alta" or "isquemico" vs "hemorragico"
      const targetLower = tRawNorm;
      const userLower = uRawNorm;
      const subtypeConflict =
        (targetLower.includes('baja') && userLower.includes('alta')) ||
        (targetLower.includes('alta') && userLower.includes('baja')) ||
        (targetLower.includes('isquem') && userLower.includes('hemorrag')) ||
        (targetLower.includes('hemorrag') && userLower.includes('isquem'));
      if (!subtypeConflict) {
        if (bestRatio < 0.82) {
          bestRatio = 0.82;
          matchedSynonymLabel = group.label;
        }
      }
    }
  }

  return { ratio: bestRatio, matchedSynonymLabel };
}

/**
 * Elimina cláusulas donde el médico indica explícitamente SUSPENDER, RETIRAR, EVITAR o NO USAR
 * un medicamento (por ejemplo: "Suspender Enalapril y Naproxeno de inmediato").
 */
function stripNegatedMedicationClauses(text: string): string {
  if (!text) return '';
  const noAccents = text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    // Elimina menciones de alergia o alternativa segura incluidas en notas de dosis/racional (p. ej. "con alergia grave a penicilinas")
    .replace(
      /(?:\b(?:por|con|ante|debido\s+a|en)\s+)?alergi[ao]s?\s+(?:grave\s+|severa\s+|documentada\s+)?(?:tipo\s*\d+\s+)?(?:anafilactic[ao]\s+)?a\s+[^.,;)]+/gi,
      ' '
    )
    .replace(/\balternativa\s+(?:segura\s+)?(?:a|ante|por)\s+[^.,;)]+/gi, ' ');
  const sentences = noAccents.split(/[.;\n]+/);
  const kept = sentences.map((seg) =>
    seg.replace(
      /\b(?:suspender|suspendase|suspenderse|suspension|retirar|retirese|retiro|omitir|evitar|evitese|prohibid[oa]s?|contraindicad[oa]s?|descontinuar|no\s+(?:administrar|usar|dar|indicar|prescribir|iniciar|mantener|reintroducir))\b.*?(?=(?:\b(?:e\s+iniciar|y\s+administrar|y\s+iniciar|y\s+dar|y\s+prescribir|en\s+su\s+lugar|reemplazar\s+por|sustituir\s+por)\b)|$)/gi,
      ' '
    )
  );
  return normStr(kept.join(' '));
}

function checkCriticalSafetyErrors(
  submission: UserEvaluationInput,
  caseData: ClinicalCase
): string[] {
  const errors: string[] = [];
  const rawRxJson = (submission.pharmacologicalPlan || [])
    .map((r) => `${r.drug || ''} ${r.dose || ''} ${r.route || ''} ${r.frequency || ''}`)
    .join('. ');
  const activeRxOnly = stripNegatedMedicationClauses(rawRxJson);
  const activeGeneral = stripNegatedMedicationClauses(submission.generalMeasures || '');
  const lowerTreatment = `${activeRxOnly} ${activeGeneral}`.trim();

  const hospDecision = normStr(submission.hospitalizationDecision || '');
  const allergiesNorm = normStr((caseData.background?.allergies || []).join(' '));
  const diagNorm = normStr(caseData.solution?.correctDiagnosis || '');

  // 1. Alergia documentada a penicilina / betalactámicos (diferenciación farmacológica real AAAAI 2022 / NICE)
  // Nota: Carbapenémicos (meropenem, imipenem, ertapenem) y monobactámicos (aztreonam) tienen reactividad
  // cruzada <1% / 0% con penicilinas y NO desencadenan anafilaxia cruzada por alergia a penicilina.
  const hasExplicitAllBetaLactamAllergy =
    allergiesNorm.includes('todos los betalactamic') ||
    allergiesNorm.includes('panbetalactam') ||
    (allergiesNorm.includes('betalactam') && !allergiesNorm.includes('penicilin'));
  const hasCephalosporinAllergy = allergiesNorm.includes('cefalosporin');
  const hasCarbapenemAllergy =
    allergiesNorm.includes('carbapenem') ||
    allergiesNorm.includes('meropenem') ||
    allergiesNorm.includes('imipenem') ||
    allergiesNorm.includes('ertapenem');

  if (allergiesNorm.includes('penicilin') || hasExplicitAllBetaLactamAllergy) {
    const highCrossRiskRegex =
      /\b(amoxicilin[a-z]*|ampicilin[a-z]*|penicilin[a-z]*|piperacilin[a-z]*|oxacilin[a-z]*|dicloxacilin[a-z]*|cloxacilin[a-z]*|flucloxacilin[a-z]*|nafcilin[a-z]*|ticarcilin[a-z]*|sultamicilin[a-z]*|amoxiclav|augmentin|cefalexin[a-z]*|cefadroxil[a-z]*|cefaclor|cefradin[a-z]*|cefprozil|cefalotin[a-z]*)\b/;
    const dissimilarCephalosporinRegex =
      /\b(ceftriaxon[a-z]*|cefotaxim[a-z]*|cefepim[a-z]*|ceftazidim[a-z]*|cefuroxim[a-z]*|cefazolina)\b/;
    const carbapenemRegex = /\b(meropenem|imipenem|ertapenem|doripenem)\b/;

    if (
      highCrossRiskRegex.test(lowerTreatment) ||
      ((hasExplicitAllBetaLactamAllergy || hasCephalosporinAllergy) &&
        dissimilarCephalosporinRegex.test(lowerTreatment)) ||
      ((hasExplicitAllBetaLactamAllergy || hasCarbapenemAllergy) && carbapenemRegex.test(lowerTreatment))
    ) {
      errors.push(
        '¡ERROR CRÍTICO DE SEGURIDAD!: Prescripción de penicilina o betalactámico con alta reactividad cruzada en un paciente con alergia/anafilaxia documentada a penicilina. Riesgo vital de choque anafiláctico.'
      );
    }
  } else if (hasCephalosporinAllergy) {
    if (/\bcefa[a-z]+|\bceft[a-z]+/.test(lowerTreatment)) {
      errors.push(
        '¡ERROR CRÍTICO DE SEGURIDAD!: Prescripción de cefalosporina en paciente con alergia documentada a cefalosporinas.'
      );
    }
  }

  // 2. Alergia a sulfamidas antimicrobianas (evita falsos positivos con sulfonamidas no antibióticas como furosemida/tiazidas)
  if (allergiesNorm.includes('sulfa')) {
    if (/\b(trimetoprim[a-z]*|sulfametoxazol[a-z]*|cotrimoxazol|bactrim|sulfadi[a-z]*|sulfasalazin[a-z]*|dapsona)\b/.test(lowerTreatment)) {
      errors.push(
        '¡ERROR CRÍTICO DE SEGURIDAD!: Prescripción de sulfamida antimicrobiana en paciente alérgico conocido a las sulfas.'
      );
    }
  }

  // 3. Dengue con signos de alarma + AINEs / AAS / Corticoides sistémicos
  if (diagNorm.includes('dengue')) {
    if (
      /\b(ibuprofeno|aspirina|acido acetilsalicilico|aas|ketorolaco|diclofenaco|naproxeno|metamizol|dipirona|meloxicam|celecoxib|indometacina|piroxicam)\b/.test(
        lowerTreatment
      )
    ) {
      errors.push(
        '¡ERROR CRÍTICO!: Prescripción de AINEs o Aspirina en Dengue con signos de alarma. Aumenta gravemente la disfunción plaquetaria y el riesgo de hemorragia digestiva o choque fatal.'
      );
    }
  }

  // 4. Lesión renal aguda + nefrotóxicos o administración de potasio IV en hiperkalemia severa
  if (diagNorm.includes('lesion renal') || diagNorm.includes('insuficiencia renal')) {
    if (
      /\b(ibuprofeno|ketorolaco|diclofenaco|naproxeno|meloxicam|celecoxib|indometacina|losartan|valsartan|irbesartan|telmisartan|enalapril|captopril|lisinopril|ramipril|gentamicina|amikacina)\b/.test(
        lowerTreatment
      )
    ) {
      errors.push(
        '¡ERROR CRÍTICO!: Uso de fármacos nefrotóxicos (AINEs, IECA/ARA-II o aminoglucósidos) en Lesión Renal Aguda con hiperpotasemia.'
      );
    }
    if (/\b(cloruro de potasio|kcl|gluconato de potasio|potasio iv)\b/.test(activeRxOnly)) {
      errors.push(
        '¡ERROR CRÍTICO!: Administración de potasio en paciente con hiperpotasemia severa (6.4 mEq/L) y ondas T picudas; riesgo inminente de fibrilación ventricular/asistolia.'
      );
    }
  }

  // 5. Embarazo ectópico roto e inestable + Metotrexato
  if (diagNorm.includes('ectopico') && diagNorm.includes('roto')) {
    if (/\b(metotrexato|methotrexate|mtx)\b/.test(lowerTreatment)) {
      errors.push(
        '¡ERROR CRÍTICO!: Uso de Metotrexato en embarazo ectópico roto con hemoperitoneo e inestabilidad hemodinámica. Requiere resolución quirúrgica inmediata.'
      );
    }
  }

  // 6. Síndrome de Stevens-Johnson + Carbamazepina o anticonvulsivantes aromáticos cruzados
  if (diagNorm.includes('stevens johnson') || diagNorm.includes('stevens-johnson')) {
    if (/\b(carbamazepina|oxcarbazepina|fenitoina|fenobarbital|lamotrigina)\b/.test(activeRxOnly)) {
      errors.push(
        '¡ERROR CRÍTICO!: Mantenimiento o prescripción de Carbamazepina o anticonvulsivantes aromáticos con reactividad cruzada en Síndrome de Stevens-Johnson.'
      );
    }
  }

  // 7. Síndrome serotoninérgico + fármacos serotoninérgicos o haloperidol/succinilcolina
  if (diagNorm.includes('serotoninergico')) {
    if (
      /\b(sertralina|fluoxetina|paroxetina|citalopram|escitalopram|venlafaxina|tramadol|dextrometorfano|linezolid|haloperidol|succinilcolina)\b/.test(
        activeRxOnly
      )
    ) {
      errors.push(
        '¡ERROR CRÍTICO!: Prescripción de fármacos serotoninérgicos, antipsicóticos (haloperidol) o succinilcolina en Síndrome Serotoninérgico agudo.'
      );
    }
  }

  // 8. Emergencias quirúrgicas / vitales manejadas como Ambulatorio
  const expectedHosp = caseData.solution?.optimalTreatment?.hospitalizationDecision || '';
  if (
    (expectedHosp.includes('UCI') ||
      expectedHosp.includes('Hospitalización') ||
      expectedHosp.includes('Quirófano')) &&
    hospDecision.includes('ambulatorio')
  ) {
    errors.push(
      `¡ERROR CRÍTICO DE CONDUCTA!: Indicaste manejo "Ambulatorio" en una patología de alto riesgo vital (${caseData.solution?.correctDiagnosis}), donde las guías exigen "${expectedHosp}".`
    );
  }

  // 9. Anafilaxia sin adrenalina (solo si sí prescribió algo pero omitió adrenalina)
  if (
    diagNorm.includes('anafilax') &&
    (submission.pharmacologicalPlan?.length || 0) > 0 &&
    !/\b(adrenalina|epinefrina)\b/.test(lowerTreatment)
  ) {
    errors.push(
      '¡ERROR CRÍTICO!: Omisión de Adrenalina (Epinefrina) intramuscular en choque anafiláctico con compromiso de vía aérea. Es el único tratamiento salvador de primera línea.'
    );
  }

  // 10. IAMCEST con prescripción errónea sin antiagregación
  if (
    diagNorm.includes('infarto') &&
    (submission.pharmacologicalPlan?.length || 0) > 0 &&
    !/\b(aspirina|acido acetilsalicilico|aas|clopidogrel|ticagrelor|prasugrel)\b/.test(lowerTreatment)
  ) {
    errors.push(
      '¡ERROR CRÍTICO!: Ausencia de terapia antiagregante plaquetaria inicial (Aspirina + inhibidor P2Y12) y estrategia de reperfusión en IAMCEST.'
    );
  }

  // 11. Tiña corporal / dermatofitosis + corticoide (produce Tiña Incógnita)
  if (diagNorm.includes('tina') || diagNorm.includes('tinea') || diagNorm.includes('dermatofitosis')) {
    if (
      /\b(hidrocortisona|betametasona|clobetasol|dexametasona|prednisona|prednisolona|mometasona|triamcinolona|fluocinolona|barmicil|quadriderm|corticoide[s]?)\b/.test(
        activeRxOnly
      )
    ) {
      errors.push(
        '¡ERROR CRÍTICO DE PRIMER NIVEL!: Prescripción de corticoide tópico o sistémico (o crema combinada con betametasona) en Tiña corporal. Suprime la inmunidad local y genera Tiña Incógnita.'
      );
    }
  }

  // 12. Hemorragia digestiva alta / Úlcera péptica / Colitis ulcerosa + AINEs o AAS
  if (
    diagNorm.includes('hemorragia digestiva') ||
    diagNorm.includes('ulcera peptica') ||
    diagNorm.includes('colitis ulcerosa')
  ) {
    if (
      /\b(ibuprofeno|ketorolaco|diclofenaco|naproxeno|meloxicam|celecoxib|indometacina|piroxicam|aspirina|acido acetilsalicilico|aas)\b/.test(
        activeRxOnly
      )
    ) {
      errors.push(
        '¡ERROR CRÍTICO!: Prescripción de AINEs o Ácido Acetilsalicílico en paciente con Hemorragia Digestiva Alta, Úlcera Péptica o Colitis Ulcerosa activa; agrava la lesión mucosa y el sangrado.'
      );
    }
  }

  // 13. Epilepsia en mujer en edad fértil + Ácido Valproico (riesgo teratogénico mayor)
  if (
    diagNorm.includes('epilep') &&
    caseData.patientInfo?.sex === 'Femenino' &&
    (caseData.patientInfo?.age ?? 30) < 48
  ) {
    if (/\b(valproato|acido valproico|valproico|divalproex|depakene)\b/.test(activeRxOnly)) {
      errors.push(
        '¡ERROR CRÍTICO DE SEGURIDAD TERATOGÉNICA!: Prescripción de Ácido Valproico en mujer en edad fértil con epilepsia. Alto riesgo de defectos del tubo neural y trastornos del neurodesarrollo (preferir Levetiracetam o Lamotrigina).'
      );
    }
  }

  // 14. Asma / EPOC + Betabloqueador no selectivo o depresor respiratorio
  if (diagNorm.includes('asma') || diagNorm.includes('epoc') || diagNorm.includes('obstructiva cronica')) {
    if (/\b(propranolol|nadolol|carvedilol|timolol|sotalol)\b/.test(activeRxOnly)) {
      errors.push(
        '¡ERROR CRÍTICO!: Prescripción de betabloqueador no selectivo en paciente con Asma o EPOC; riesgo de broncoespasmo grave refractario.'
      );
    }
  }
  if (diagNorm.includes('crisis asmatica') || diagNorm.includes('epoc')) {
    if (/\b(alprazolam|diazepam|lorazepam|clonazepam|midazolam|morfina|fentanilo|codeina)\b/.test(activeRxOnly)) {
      errors.push(
        '¡ERROR CRÍTICO!: Prescripción de benzodiacepinas u opioides en Crisis Asmática o EPOC; riesgo de depresión respiratoria hipercápnica y paro ventilatorio.'
      );
    }
  }

  // 15. Bronquiectasias infectadas + antitusígenos supresores (codeína / dextrometorfano)
  if (diagNorm.includes('bronquiectas')) {
    if (/\b(codeina|dextrometorfano|levodropropizina)\b/.test(activeRxOnly)) {
      errors.push(
        '¡ERROR CRÍTICO!: Uso de antitusígenos supresores (codeína/dextrometorfano) en Bronquiectasias; impide la depuración mucociliar y agrava el tapón mucopurulento.'
      );
    }
  }

  // 16. Delirium Tremens / Abstinencia alcohólica + Dextrosa IV sin Tiamina
  if (diagNorm.includes('delirium tremens') || diagNorm.includes('abstinencia alcoholica')) {
    if (/\b(dextrosa|glucosa|glucosada)\b/.test(activeRxOnly) && !/\b(tiamina|vitamina b1|b1)\b/.test(lowerTreatment)) {
      errors.push(
        '¡ERROR CRÍTICO!: Administración de solución glucosada IV sin Tiamina (Vitamina B1) previa en paciente con abstinencia alcohólica / Delirium Tremens; puede precipitar Encefalopatía de Wernicke aguda.'
      );
    }
  }

  // 17. Preeclampsia con severidad + IECA/ARA-II/AINEs
  if (diagNorm.includes('preeclampsia')) {
    if (
      /\b(enalapril|captopril|lisinopril|ramipril|losartan|valsartan|irbesartan|telmisartan|ibuprofeno|ketorolaco|naproxeno|diclofenaco)\b/.test(
        activeRxOnly
      )
    ) {
      errors.push(
        '¡ERROR CRÍTICO MATERNO-FETAL!: Uso de IECA, ARA-II o AINEs en Preeclampsia con criterios de severidad (contraindicación obstétrica y nefrotoxicidad).'
      );
    }
  }

  return errors;
}

const SYSTEMIC_ANTIBIOTIC_REGEX =
  /\b(amoxicilin[a-z]*|ampicilin[a-z]*|azitromicina|claritromicina|eritromicina|ciprofloxacino|levofloxacino|moxifloxacino|ceftriaxona|cefalexina|cefuroxima|cefixima|clindamicina|metronidazol|doxiciclina|trimetoprim|sulfametoxazol|nitrofurantoina|fosfomicina|vancomicina|meropenem|piperacilina|gentamicina|amikacina)\b/;

function isNonBacterialPrimaryCase(diagNorm: string): boolean {
  if (
    /\b(bacteriana|estreptococica|pielonefritis|cistitis|colangitis|meningitis|neumonia|apendicitis|colecistitis|erisipela|endocarditis|absceso|sepsis|urosepsis)\b/.test(
      diagNorm
    ) ||
    diagNorm.includes('bronquiectasias infectadas')
  ) {
    return false;
  }
  return /\b(bronquiolitis|gastroenteritis|laringotraqueobronquitis|crup|dengue|herpes zoster|pancreatitis aguda|reflujo gastroesofagico|erge|intestino irritable|esguince|lumbalgia mecanica|vertigo posicional|vppb|migrana|ansiedad|tunel del carpo|vitamina b12|vitamina d|ferropenica|hipotiroidismo|hipertension arterial|diabetes mellitus|ovario poliquistico|tina corporal|tinea corporis|candidiasis|paralisis facial|radiculopatia|hernia inguinal|asma bronquial|epoc.*estable|pericarditis aguda|cefalea tensional)\b/.test(
    diagNorm
  );
}

function isSimplePrimaryWorkupCase(diagNorm: string): boolean {
  return /\b(lumbalgia mecanica|esguince lateral|vertigo posicional|vppb|faringoamigdalitis|cistitis aguda|tina corporal|tinea corporis|herpes zoster|otitis media|gastroenteritis aguda probable viral|candidiasis)\b/.test(
    diagNorm
  );
}

function getDispositionRank(decisionNorm: string): number {
  if (!decisionNorm) return 0;
  if (decisionNorm.includes('ambulatorio')) return 1;
  if (decisionNorm.includes('observacion')) return 2;
  if (decisionNorm.includes('hospitalizacion')) return 3;
  if (decisionNorm.includes('quirofano') || decisionNorm.includes('cirugia')) return 4;
  if (decisionNorm.includes('uci') || decisionNorm.includes('intensivos')) return 5;
  return 0;
}

function isSurgicalOrProceduralCase(caseData: ClinicalCase): boolean {
  const opt = caseData.solution?.optimalTreatment;
  const expectedHospNorm = normStr(opt?.hospitalizationDecision || '');
  if (expectedHospNorm.includes('ambulatorio')) {
    return false;
  }
  if (expectedHospNorm.includes('quirofano') || expectedHospNorm.includes('cirugia')) {
    return true;
  }
  if (caseData.specialty === 'cirugia_general') {
    return true;
  }
  const positiveSurgicalText = normStr(
    [
      caseData.solution?.correctDiagnosis || '',
      ...(opt?.generalMeasures || []),
      ...(opt?.referralCriteria || []),
    ].join(' ')
  );
  return /\b(quirofano|cirugia|quirurgic[ao]|apendicectomia|colecistectomia|salpingectomia|fasciotomia|artroplastia|laparoscopia|laparotomia|adhesiolisis|toracostomia|pericardiocentesis|drenaje|descompresion|reduccion)\b/.test(
    positiveSurgicalText
  );
}

function parseBloodPressurePair(bp?: string): { sys: number; dia: number } {
  const m = (bp || '').match(/(\d+)\s*\/\s*(\d+)/);
  return {
    sys: m ? parseInt(m[1], 10) : 120,
    dia: m ? parseInt(m[2], 10) : 80,
  };
}

function getAbnormalVitalSignDescriptions(caseData: ClinicalCase): string[] {
  const v = caseData.vitalSigns;
  if (!v) return [];
  const age = caseData.patientInfo?.age ?? 30;
  const { sys, dia } = parseBloodPressurePair(v.bloodPressure);
  const findings: string[] = [];

  if (age < 2) {
    if (sys < 70) findings.push(`hipotensión (${v.bloodPressure})`);
  } else if (age < 12) {
    if (sys < 80) findings.push(`hipotensión (${v.bloodPressure})`);
    else if (sys >= 130) findings.push(`hipertensión (${v.bloodPressure})`);
  } else {
    if (sys < 90) findings.push(`hipotensión (${v.bloodPressure})`);
    else if (sys >= 160 || dia >= 100) findings.push(`hipertensión severa (${v.bloodPressure})`);
    else if (sys >= 140 || dia >= 90) findings.push(`hipertensión (${v.bloodPressure})`);
  }

  const hrUpper = age < 2 ? 160 : age < 6 ? 140 : age < 12 ? 120 : 100;
  const hrLower = age < 2 ? 90 : age < 12 ? 70 : 55;
  if (v.heartRate > hrUpper) findings.push(`taquicardia (${v.heartRate} lpm)`);
  else if (v.heartRate < hrLower) findings.push(`bradicardia (${v.heartRate} lpm)`);

  const rrUpper = age < 2 ? 45 : age < 6 ? 34 : age < 12 ? 26 : 20;
  if (v.respiratoryRate > rrUpper) findings.push(`taquipnea (${v.respiratoryRate} rpm)`);
  else if (v.respiratoryRate < 11) findings.push(`bradipnea (${v.respiratoryRate} rpm)`);

  if (v.temperature >= 38.0) findings.push(`fiebre (${v.temperature} °C)`);
  else if (v.temperature >= 37.6) findings.push(`febrícula (${v.temperature} °C)`);
  else if (v.temperature < 35.5) findings.push(`hipotermia (${v.temperature} °C)`);

  if (v.oxygenSaturation < 94) findings.push(`hipoxemia/desaturación (SpO₂ ${v.oxygenSaturation}%)`);
  if (v.glasgow < 15) findings.push(`alteración neurológica (Glasgow ${v.glasgow}/15)`);

  return findings;
}

function hasUnstableBaselineVitals(caseData: ClinicalCase): boolean {
  const v = caseData.vitalSigns;
  if (!v) return false;
  const age = caseData.patientInfo?.age ?? 30;
  const { sys } = parseBloodPressurePair(v.bloodPressure);
  const lowSys = age < 2 ? sys < 70 : age < 12 ? sys < 80 : sys < 90;
  const extremeHr = age < 12 ? v.heartRate >= 175 || v.heartRate <= 55 : v.heartRate >= 145 || v.heartRate <= 44;
  const extremeRr = age < 12 ? v.respiratoryRate >= 52 : v.respiratoryRate >= 32 || v.respiratoryRate <= 9;
  return lowSys || v.oxygenSaturation < 90 || v.glasgow <= 12 || extremeHr || extremeRr;
}

function hasImmediateVitalThreat(caseData: ClinicalCase): boolean {
  const triage = caseData.patientInfo?.triageLevel || '';
  if (/\bNivel I\b/.test(triage)) return true;
  if (hasUnstableBaselineVitals(caseData)) return true;

  const expectedHosp = normStr(caseData.solution?.optimalTreatment?.hospitalizationDecision || '');
  const diagNorm = normStr(caseData.solution?.correctDiagnosis || '');
  if (
    expectedHosp.includes('uci') &&
    /\b(infarto|iamcest|anafilax|choque|meningitis|cetoacidosis|ectopico.*roto|hemorragia digestiva|hiperpotasemia|stevens|serotoninergico|taponamiento|colangitis|crisis suprarrenal|delirium tremens|tormenta tiroidea|organofosforados|asma grave|ictus|guillain|preeclampsia)\b/.test(
      diagNorm
    )
  ) {
    return true;
  }
  if (/\b(ectopico.*roto|choque hipovolemico|choque anafilactico)\b/.test(diagNorm)) {
    return true;
  }
  return false;
}

function isLethalSafetyError(errMsg: string, caseData: ClinicalCase): boolean {
  const nErr = normStr(errMsg);
  // Errores claramente no letales de forma aguda (no causan muerte súbita ni paro en paciente estable)
  if (
    /\b(tina|tinea|teratogen|valproico|bronquiectas|antitusigen)\b/.test(nErr)
  ) {
    return false;
  }

  // Egreso ambulatorio es letal solo cuando el paciente sí cursa con amenaza vital aguda o UCI
  if (nErr.includes('error critico de conducta') && nErr.includes('ambulatorio')) {
    return hasImmediateVitalThreat(caseData);
  }

  return /\b(alergi|anafilax|choque anafilactico|hiperpotasemia|fibrilacion ventricular|asistolia|omision de adrenalina|antiagregante|dengue.*(aines|aspirina|hemorragia)|metotrexato|stevens|serotoninergico|depresion respiratoria|paro ventilatorio|wernicke|crisis adrenergica|broncoespasmo severo|hipotension iatrogenica|hipoglucemia iatrogenica|descenso glucemico excesivo|hipermagnesemia|hemorragia digestiva)\b/.test(
    nErr
  );
}

interface TherapeuticEquivalenceGroup {
  label: string;
  note: string;
  terms: string[];
  excludeIfDiag?: RegExp;
  onlyIfDiag?: RegExp;
}

const THERAPEUTIC_EQUIVALENCE_GROUPS: TherapeuticEquivalenceGroup[] = [
  {
    label: 'Ácido Acetilsalicílico (ASA / Aspirina)',
    note: 'Equivalencia directa de nomenclatura',
    terms: ['aspirina', 'acido acetilsalicilico', 'aas', 'asa'],
  },
  {
    label: 'Epinefrina / Adrenalina',
    note: 'Equivalencia directa de nomenclatura',
    terms: ['adrenalina', 'epinefrina'],
  },
  {
    label: 'Acetaminofén / Paracetamol (LBM MINSA)',
    note: 'Acetaminofén y Paracetamol son la misma molécula',
    terms: ['paracetamol', 'acetaminofen'],
  },
  {
    label: 'Analgésico / Antipirético no opioide (MINSA)',
    note: 'Metamizol/Dipirona aceptado como alternativa antipirética/analgésica cuando no existe contraindicación hemorrágica o por Dengue',
    terms: ['paracetamol', 'acetaminofen', 'metamizol', 'dipirona'],
    excludeIfDiag: /dengue|hemorrag|ulcera|colitis|stevens/,
  },
  {
    label: 'AINEs antiinflamatorios/analgésicos',
    note: 'Equivalencia de clase AINE según disponibilidad (MINSA / Internacional)',
    terms: ['ibuprofeno', 'naproxeno', 'diclofenaco', 'ketoprofeno', 'ketorolaco', 'meloxicam', 'celecoxib', 'indometacina'],
    excludeIfDiag: /dengue|hemorrag|ulcera|lesion renal|insuficiencia renal|preeclampsia|colitis/,
  },
  {
    label: 'Cristaloides Isotónicos (SSN 0.9% / Hartmann / Ringer)',
    note: 'Cristaloide isotónico equivalente para reanimación o hidratación IV',
    terms: ['salina', 'ssn', 'cloruro de sodio', 'fisiologica', 'cristaloides', 'hartmann', 'ringer', 'lactato de ringer'],
  },
  {
    label: 'Sales de Rehidratación Oral (SRO / Suero Oral)',
    note: 'SRO estándar OMS / Plan A-B MINSA',
    terms: ['suero oral', 'sro', 'sales de rehidratacion', 'rehidratacion oral', 'vida suero oral', 'suero de rehidratacion'],
  },
  {
    label: 'Insulina Cristalina / Rápida / Regular',
    note: 'Insulina regular (cristalina) para manejo agudo',
    terms: ['insulina', 'insulina rapida', 'insulina regular', 'insulina cristalina'],
  },
  {
    label: 'Anticoagulación Parenteral (HBPM / HNF)',
    note: 'Equivalencia HBPM (Enoxaparina) o Heparina No Fraccionada (LBM MINSA)',
    terms: ['enoxaparina', 'heparina', 'hbpm', 'hnf', 'dalteparina', 'fondaparinux'],
  },
  {
    label: 'Fluoroquinolona Respiratoria',
    note: 'Fluoroquinolona antineumocócica equivalente',
    terms: ['levofloxacino', 'moxifloxacino', 'fluoroquinolona'],
  },
  {
    label: 'Oxigenoterapia suplementaria',
    note: 'Soporte de oxígeno titulado',
    terms: ['oxigeno', 'oxigenoterapia', 'o2', 'canula nasal', 'mascarilla'],
  },
  {
    label: 'Benzodiacepinas de urgencia',
    note: 'Benzodiacepina equivalente según disponibilidad (Diazepam LBM MINSA / Lorazepam / Midazolam)',
    terms: ['lorazepam', 'diazepam', 'midazolam', 'clonazepam', 'benzodiacepina'],
  },
  {
    label: 'Inhibidor P2Y12 (Clopidogrel LBM MINSA / Ticagrelor / Prasugrel)',
    note: 'Antiagregante P2Y12 equivalente según disponibilidad (Clopidogrel en LBM MINSA; Ticagrelor/Prasugrel en guías ESC/AHA)',
    terms: ['ticagrelor', 'prasugrel', 'clopidogrel', 'p2y12'],
  },
  {
    label: 'Terapia de Reperfusión / Trombólisis (Estreptoquinasa / Alteplasa / ICP)',
    note: 'Reperfusión coronaria o trombólisis disponible según nivel resolutivo',
    terms: ['alteplasa', 'tenecteplasa', 'estreptoquinasa', 'trombolisis', 'fibrinolisis', 'angioplastia', 'icp'],
  },
  {
    label: 'Analgésicos Opioides / Rescate de Dolor Severo',
    note: 'Opioide titulado equivalente',
    terms: ['tramadol', 'buprenorfina', 'morfina', 'fentanilo'],
  },
  {
    label: 'Soluciones Glucosadas (Dextrosa)',
    note: 'Dextrosa / solución glucosada equivalente',
    terms: ['dextrosa', 'glucosa', 'solucion glucosada', 'dw5', 'dw10', 'dw50'],
  },
  {
    label: 'Inhibidores de Bomba de Protones (Omeprazol LBM MINSA)',
    note: 'IBP equivalente de clase (Omeprazol LBM MINSA / Pantoprazol / Esomeprazol)',
    terms: ['omeprazol', 'esomeprazol', 'pantoprazol', 'lansoprazol', 'rabeprazol'],
  },
  {
    label: 'IECA (Enalapril LBM MINSA)',
    note: 'IECA equivalente de clase',
    terms: ['enalapril', 'captopril', 'lisinopril', 'ramipril'],
  },
  {
    label: 'ARA-II (Irbesartán / Losartán LBM MINSA)',
    note: 'ARA-II equivalente de clase',
    terms: ['losartan', 'irbesartan', 'valsartan', 'telmisartan', 'candesartan'],
  },
  {
    label: 'Bloqueo SRAA Primera Línea en HTA Crónica / Nefropatía',
    note: 'En HTA crónica o nefropatía diabética estable, IECA, ARA-II o calcioantagonista de primera línea son alternativas válidas (MINSA / ESC / ACC)',
    terms: ['enalapril', 'lisinopril', 'losartan', 'irbesartan', 'valsartan', 'amlodipino', 'hidroclorotiazida'],
    onlyIfDiag: /hipertension arterial|nefropatia|microalbuminuria|diabetes/,
  },
  {
    label: 'Calcioantagonistas Dihidropiridínicos',
    note: 'Calcioantagonista equivalente (Amlodipino LBM MINSA / Nifedipino)',
    terms: ['amlodipino', 'nifedipino', 'felodipino'],
  },
  {
    label: 'Diuréticos Tiazídicos',
    note: 'Tiazida equivalente (Hidroclorotiazida LBM MINSA / Clortalidona)',
    terms: ['hidroclorotiazida', 'clortalidona', 'indapamida'],
  },
  {
    label: 'Betabloqueadores Cardioselectivos / Falla Cardíaca',
    note: 'Betabloqueador equivalente según ficha terapéutica',
    terms: ['metoprolol', 'bisoprolol', 'carvedilol', 'atenolol', 'nebivolol'],
    excludeIfDiag: /asma|epoc/,
  },
  {
    label: 'Estatinas de Alta/Moderada Intensidad',
    note: 'Estatina equivalente (Atorvastatina / Simvastatina LBM MINSA / Rosuvastatina)',
    terms: ['atorvastatina', 'rosuvastatina', 'simvastatina', 'pravastatina'],
  },
  {
    label: 'Antidiabéticos Orales Primera Línea (Metformina / Sulfonilurea LBM / iSGLT2)',
    note: 'Metformina en primera línea o combinación según LBM MINSA / ADA',
    terms: ['metformina', 'glibenclamida', 'glimepirida', 'empagliflozina', 'dapagliflozina', 'sitagliptina'],
  },
  {
    label: 'Antihistamínicos H1 (Loratadina / Clorfeniramina LBM MINSA)',
    note: 'Antihistamínico H1 equivalente (Loratadina, Cetirizina, Clorfeniramina)',
    terms: ['loratadina', 'cetirizina', 'desloratadina', 'fexofenadina', 'clorfeniramina', 'difenhidramina'],
  },
  {
    label: 'Corticoides Inhalados (Beclometasona LBM MINSA / Budesonida)',
    note: 'Corticoide inhalado equivalente (Beclometasona es estándar en LBM MINSA)',
    terms: ['beclometasona', 'budesonida', 'fluticasona', 'mometasona'],
  },
  {
    label: 'Corticoides Sistémicos (Prednisona / Hidrocortisona / Dexametasona)',
    note: 'Corticoide sistémico equivalente según vía (Prednisona VO / Hidrocortisona o Dexametasona IV)',
    terms: ['prednisona', 'prednisolona', 'hidrocortisona', 'metilprednisolona', 'dexametasona'],
    excludeIfDiag: /tina|tinea|dermatofitosis|dengue/,
  },
  {
    label: 'Broncodilatadores SABA / Rescate (Salbutamol LBM MINSA)',
    note: 'Broncodilatador inhalado equivalente',
    terms: ['salbutamol', 'albuterol', 'fenoterol', 'ipratropio', 'bromuro de ipratropio'],
  },
  {
    label: 'Antieméticos / Procinéticos',
    note: 'Antiemético equivalente (Metoclopramida LBM MINSA / Ondansetrón / Dimenhidrinato)',
    terms: ['metoclopramida', 'ondansetron', 'domperidona', 'dimenhidrinato'],
  },
  {
    label: 'Antiespasmódicos (Butilhioscina / Hioscina)',
    note: 'Antiespasmódico equivalente',
    terms: ['hioscina', 'butilhioscina', 'butilbromuro', 'trimebutina', 'pinaverio'],
  },
  {
    label: 'Antimicrobianos IVU Baja / Cistitis (MINSA + IDSA)',
    note: 'Esquema válido para IVU no complicada (Nitrofurantoína, TMP/SMX, Fosfomicina o Cefalexina)',
    terms: ['nitrofurantoina', 'fosfomicina', 'trimetoprim', 'sulfametoxazol', 'cotrimoxazol', 'tmp smx', 'tmp', 'smx', 'bactrim', 'cefalexina', 'cefadroxilo'],
    onlyIfDiag: /cistitis|urinaria|ivu|itu/,
  },
  {
    label: 'Trimetoprim / Sulfametoxazol (TMP-SMX / Cotrimoxazol)',
    note: 'Misma combinación antimicrobiana',
    terms: ['trimetoprim', 'sulfametoxazol', 'cotrimoxazol', 'tmp', 'smx'],
  },
  {
    label: 'Antiestafilocócico / Piel y Partes Blandas (Dicloxacilina / Cefalexina MINSA)',
    note: 'Cobertura grampositiva equivalente (Dicloxacilina, Cefalexina, Clindamicina o Amoxicilina/Clavulanato)',
    terms: ['dicloxacilina', 'cefalexina', 'cefadroxilo', 'clindamicina', 'amoxiclav', 'amoxicilina'],
    onlyIfDiag: /impetigo|celulitis|erisipela|piel|absceso|foliculitis/,
  },
  {
    label: 'Antimicrobiano Faringoamigdalitis Estreptocócica (Penicilina Benzatínica MINSA / Amoxicilina)',
    note: 'Penicilina G benzatínica IM o Amoxicilina VO como primera línea equivalente (MINSA / IDSA)',
    terms: ['penicilina benzatinica', 'penicilina g', 'amoxicilina', 'azitromicina', 'claritromicina', 'cefalexina', 'clindamicina'],
    onlyIfDiag: /faringoamigdalitis|amigdalitis|estreptococ/,
  },
  {
    label: 'Cefalosporina de 3.ª Generación Parenteral (Ceftriaxona / Cefotaxima)',
    note: 'Cefalosporina 3.ª gen equivalente para meningitis, sepsis o pielonefritis',
    terms: ['ceftriaxona', 'cefotaxima'],
  },
  {
    label: 'Macrólidos Respiratorios',
    note: 'Macrólido equivalente (Azitromicina / Claritromicina / Eritromicina)',
    terms: ['azitromicina', 'claritromicina', 'eritromicina'],
  },
  {
    label: 'Antivirales Antiherpéticos (Aciclovir LBM MINSA / Valaciclovir)',
    note: 'Aciclovir oral/IV (LBM MINSA) equivalente a Valaciclovir/Famciclovir',
    terms: ['aciclovir', 'valaciclovir', 'famciclovir'],
  },
  {
    label: 'Antimicóticos Tópicos / Sistémicos Azólicos o Alilaminas',
    note: 'Antimicótico válido según vía (Clotrimazol, Fluconazol, Miconazol, Terbinafina, Ketoconazol)',
    terms: ['clotrimazol', 'fluconazol', 'miconazol', 'ketoconazol', 'terbinafina', 'itraconazol', 'nistatina'],
  },
  {
    label: 'Nitroimidazoles (Metronidazol LBM MINSA)',
    note: 'Nitroimidazol equivalente',
    terms: ['metronidazol', 'tinidazol', 'secnidazol'],
  },
  {
    label: 'Antihipertensivos en Preeclampsia / Obstetricia (Normativa MINSA)',
    note: 'Antihipertensivo seguro en embarazo/preeclampsia (Hidralazina, Labetalol, Nifedipino, Alfametildopa)',
    terms: ['labetalol', 'hidralazina', 'nifedipino', 'alfametildopa', 'metildopa'],
    onlyIfDiag: /preeclampsia|eclampsia|embarazo|gestacional/,
  },
  {
    label: 'Sulfato de Magnesio (MgSO4)',
    note: 'Neuroprotección y profilaxis de eclampsia',
    terms: ['sulfato de magnesio', 'mgso4', 'magnesio'],
  },
  {
    label: 'Antiepilépticos (Fenitoína DFH LBM MINSA / Levetiracetam)',
    note: 'Anticomicial equivalente (respetando restricción teratogénica de Valproato en mujer fértil)',
    terms: ['fenitoina', 'dfh', 'difenilhidantoina', 'levetiracetam', 'carbamazepina', 'lamotrigina'],
  },
  {
    label: 'Suplementación de Hierro (Sulfato Ferroso LBM MINSA)',
    note: 'Sal ferrosa oral equivalente',
    terms: ['sulfato ferroso', 'hierro polimaltosado', 'fumarato ferroso', 'gluconato ferroso', 'hierro'],
  },
  {
    label: 'Vitamina B12 / Complejo B Neurotrópico',
    note: 'Cobalamina equivalente (Cianocobalamina / Hidroxicobalamina / Complejo B)',
    terms: ['cianocobalamina', 'hidroxicobalamina', 'vitamina b12', 'b12', 'complejo b'],
  },
  {
    label: 'Vitamina D (Colecalciferol / Ergocalciferol)',
    note: 'Suplemento de Vitamina D equivalente',
    terms: ['vitamina d', 'colecalciferol', 'ergocalciferol', 'calcitriol'],
  },
  {
    label: 'ISRS Primera Línea (Fluoxetina / Sertralina LBM MINSA)',
    note: 'Inhibidor selectivo de recaptación de serotonina equivalente',
    terms: ['sertralina', 'fluoxetina', 'escitalopram', 'paroxetina', 'citalopram'],
  },
  {
    label: 'Aminosalicilatos 5-ASA (Sulfasalazina LBM MINSA / Mesalazina)',
    note: 'Sulfasalazina disponible en LBM MINSA como equivalente de 5-ASA a Mesalazina en colitis ulcerosa',
    terms: ['mesalazina', 'sulfasalazina', '5 asa', 'asacol'],
  },
  {
    label: 'Anticoagulación Oral en Fibrilación Auricular (Warfarina LBM MINSA / ACOD)',
    note: 'Warfarina ajustada por INR (LBM MINSA) y anticoagulantes directos (Apixabán/Rivaroxabán) aceptados según disponibilidad',
    terms: ['apixaban', 'rivaroxaban', 'dabigatran', 'edoxaban', 'warfarina', 'acenocumarol'],
    onlyIfDiag: /fibrilacion auricular/,
  },
  {
    label: 'Broncodilatadores de Mantenimiento LAMA / LABA en EPOC',
    note: 'Anticolinérgico (Ipratropio LBM MINSA / Tiotropio) o LABA aceptado en mantenimiento de EPOC',
    terms: [
      'tiotropio',
      'ipratropio',
      'bromuro de ipratropio',
      'salmeterol',
      'formoterol',
      'indacaterol',
      'vilanterol',
      'umeclidinio',
      'olodaterol',
      'glicopirronio',
    ],
    onlyIfDiag: /epoc|obstructiva cronica/,
  },
  {
    label: 'Neuromoduladores de Dolor Neuropático (MINSA / Internacional)',
    note: 'Gabapentina, Pregabalina, Amitriptilina o Carbamazepina (evitar Carbamazepina si historia de alergia/SSJ)',
    terms: ['pregabalina', 'gabapentina', 'amitriptilina', 'carbamazepina', 'duloxetina'],
    onlyIfDiag: /radiculopatia|neuropat|zoster|tunel/,
  },
];

function matchesOptimalDrug(
  userRxText: string,
  expectedDrugLabel: string,
  diagNorm = ''
): { matched: boolean; equivalentNote?: string } {
  const normExpected = normStr(expectedDrugLabel);
  if (!userRxText || !normExpected) return { matched: false };

  // 1. Coincidencia directa por tokens del fármaco esperado
  const directTokens = significantTokens(normExpected);
  if (directTokens.length > 0) {
    const directHits = directTokens.filter((tk) => {
      const stem = tk.slice(0, Math.max(4, tk.length - 1));
      return userRxText.includes(tk) || userRxText.includes(stem);
    }).length;
    if (directHits / directTokens.length >= 0.55) {
      return { matched: true };
    }
  }

  // 2. Equivalencia terapéutica (MINSA Nicaragua LBM + Guías Internacionales)
  for (const group of THERAPEUTIC_EQUIVALENCE_GROUPS) {
    if (group.excludeIfDiag && diagNorm && group.excludeIfDiag.test(diagNorm)) continue;
    if (group.onlyIfDiag && diagNorm && !group.onlyIfDiag.test(diagNorm)) continue;

    const expInGroup = group.terms.some((syn) => hasClinicalTerm(normExpected, syn));
    const matchedUserTerm = group.terms.find((syn) => hasClinicalTerm(userRxText, syn));
    if (expInGroup && matchedUserTerm) {
      return {
        matched: true,
        equivalentNote: `${group.label}: se validó "${matchedUserTerm}" como equivalente a "${expectedDrugLabel}" (${group.note}).`,
      };
    }
  }

  // 3. Alternativas separadas por " o ", "/", "+" o paréntesis en la solución óptima
  const alternatives = normExpected
    .split(/\s+(?:o|y)\s+|[,/+()]/)
    .map((part) => part.trim())
    .filter((part) => part.length >= 4);

  for (const alt of alternatives) {
    const tokens = significantTokens(alt);
    if (tokens.length > 0) {
      const hits = tokens.filter((tk) => {
        const stem = tk.slice(0, Math.max(4, tk.length - 1));
        return userRxText.includes(tk) || userRxText.includes(stem);
      }).length;
      if (hits / tokens.length >= 0.5) return { matched: true };
    }
  }

  return { matched: tokenMatchRatio(userRxText, expectedDrugLabel) >= 0.45 };
}

function analyzeAnamnesisPillars(questions: string[] = []) {
  const joined = normStr(questions.join(' '));
  return [
    {
      label: 'Inicio, duración y cronología (o evolución del día previo)',
      hit: /cuando|desde|hora|dia anterior|ayer|anoche|empezo|inicio|evolucion|cuanto tiempo|subito|hace cuanto|cuantos dias|principio/.test(joined),
    },
    {
      label: 'Localización, irradiación e intensidad del síntoma principal',
      hit: /donde|duele|dolor|irradia|corre|intensidad|fuerte|siente|caracteristica|molestia|ardor|escala|tipo de|opresivo|punzante|pulsatil/.test(joined),
    },
    {
      label: 'Síntomas asociados y signos de alarma (fiebre, vómitos, disnea, sangrado)',
      hit: /fiebre|calentura|escalofrio|vomit|basca|nausea|aire|ahog|respir|sangr|mareo|orina|ardor al orinar|diarrea|churria|cabeza|mancha|roncha|picazon|prurito|hinchazon|vision|desmayo/.test(joined),
    },
    {
      label: 'Antecedentes patológicos, quirúrgicos y familiares',
      hit: /enfermedad|hipertension|presion|diabetes|azucar|antecedente|operad|cirugia|familia|padece|sufre|asma|rinon|corazon|cronica/.test(joined),
    },
    {
      label: 'Medicamentos actuales y alergias conocidas',
      hit: /medicament|pastilla|toma|tomo|remedio|alergi|penicilina|insulina|tratamiento|inyect|receta/.test(joined),
    },
    {
      label: 'Hábitos, exposición epidemiológica o historia sexual/ginecológica',
      hit: /fuma|alcohol|licor|viaj|zancudo|mosquito|agua|sexo|sexual|regla|menstrua|ultima regla|fum\b|embaraz|pareja|trabajo|ocupacion|vive|comio/.test(joined),
    },
  ];
}

export function buildDidacticEvaluation(
  submission: UserEvaluationInput,
  caseData: ClinicalCase
): EvaluationResult {
  const solution = caseData.solution;
  const qCount = submission.questionCount || 0;
  const doctorQuestions = submission.doctorQuestions || [];

  const diagNormCore = normStr(solution.correctDiagnosis || '');
  const isFocusedPrimaryCase =
    isSimplePrimaryWorkupCase(diagNormCore) || caseData.mode === 'principiante';
  const recognizedEquivalents: string[] = [];

  // 1. ANAMNESIS (0 a 15 pts) — Cero preguntas = 0 puntos; adaptada a complejidad del cuadro
  const pillars = analyzeAnamnesisPillars(doctorQuestions);
  const coveredPillars = pillars.filter((p) => p.hit).map((p) => p.label);
  const missedPillars = pillars.filter((p) => !p.hit).map((p) => p.label);

  let anamScore = 0;
  if (qCount === 0) {
    anamScore = 0;
  } else if (doctorQuestions.length > 0) {
    if (coveredPillars.length === 0) {
      anamScore = 1;
    } else if (isFocusedPrimaryCase) {
      // En primer nivel o casos simples, un interrogatorio dirigido de 4 pilares y 3-4 preguntas alcanza 14-15 pts
      anamScore = Math.min(
        15,
        Math.round((Math.min(coveredPillars.length, 4) / 4) * 13 + Math.min(qCount, 4) * 0.5)
      );
    } else {
      // En casos complejos/urgencias, 5 pilares cubiertos + >=5 preguntas alcanza 15/15
      anamScore = Math.min(
        15,
        Math.round((Math.min(coveredPillars.length, 5) / 5) * 13 + Math.min(qCount, 5) * 0.4)
      );
    }
  } else {
    anamScore = Math.min(15, Math.round(qCount * 2.2));
  }

  const anamDetail: RubricCategoryDetail = {
    whyScore:
      qCount === 0
        ? 'Obtuviste 0/15 porque no realizaste ninguna pregunta al paciente durante la anamnesis.'
        : coveredPillars.length === 0 && doctorQuestions.length > 0
          ? `Realizaste ${qCount} intervención(es), pero ninguna exploró los pilares semiológicos del caso (${anamScore}/15 pts).`
          : isFocusedPrimaryCase
            ? `Realizaste ${qCount} pregunta(s) focalizadas cubriendo ${coveredPillars.length} pilares semiológicos en un motivo de atención primaria (${anamScore}/15 pts).`
            : `Realizaste ${qCount} pregunta(s) cubriendo ${coveredPillars.length} de 6 pilares semiológicos (${anamScore}/15 pts).`,
    strengths:
      coveredPillars.length > 0
        ? coveredPillars.map((c) => `Exploraste: ${c}`)
        : qCount > 0
          ? ['Iniciaste diálogo con el paciente, aunque faltó profundidad clínica.']
          : ['No se registraron preguntas en el interrogatorio clínico.'],
    missingOrImprove:
      missedPillars.length > 0 && !(isFocusedPrimaryCase && coveredPillars.length >= 4)
        ? missedPillars.map((m) => `Faltó interrogar sobre: ${m}`)
        : ['Interrogatorio clínico oportuno y bien focalizado según la complejidad del caso.'],
    expectedStandard: isFocusedPrimaryCase
      ? 'En consulta general focalizada (14-15 pts) basta explorar cronología, características del síntoma, signos de alarma y antecedentes/alergias.'
      : 'Una anamnesis completa (14-15 pts) indaga cronología exacta, semiología del síntoma, signos de alarma, antecedentes/alergias y contexto epidemiológico o fármacos.',
  };

  // 2. EXPLORACIÓN FÍSICA (0 a 15 pts) — Separar maniobras nativas del caso vs sincronización general del catálogo
  const unlockedExamIds = new Set(submission.unlockedExams || []);
  const allExams = caseData.physicalExamPool || [];
  const allAbnormalExams = allExams.filter((pe) => pe.isAbnormal);
  const nativeAbnormalExams = allAbnormalExams.filter((pe) => !pe.id.startsWith('std-pe-'));
  const abnormalExams = nativeAbnormalExams.length > 0 ? nativeAbnormalExams : allAbnormalExams;
  const foundAbnormalExams = abnormalExams.filter((pe) => unlockedExamIds.has(pe.id));
  const missedAbnormalExams = abnormalExams.filter((pe) => !unlockedExamIds.has(pe.id));
  const totalUnlockedExams = allExams.filter((pe) => unlockedExamIds.has(pe.id));
  const exploredAllBlindly =
    allExams.length >= 10 && totalUnlockedExams.length >= allExams.length - 1;

  const nativeExams = allExams.filter((pe) => !pe.id.startsWith('std-pe-'));
  const foundNativeExams = nativeExams.filter((pe) => unlockedExamIds.has(pe.id));
  const missedNativeExams = nativeExams.filter((pe) => !unlockedExamIds.has(pe.id));

  let examScore = 0;
  if (totalUnlockedExams.length === 0) {
    examScore = 0;
  } else if (abnormalExams.length > 0) {
    if (foundAbnormalExams.length === 0) {
      examScore = Math.min(4, totalUnlockedExams.length + 1);
    } else {
      const recallRatio = foundAbnormalExams.length / abnormalExams.length;
      const selectiveBonus = !exploredAllBlindly && totalUnlockedExams.length >= 2 ? 2 : 0;
      const shotgunPenalty = exploredAllBlindly ? 3 : 0;
      examScore = Math.min(
        15,
        Math.max(1, Math.round(recallRatio * 13) + selectiveBonus - shotgunPenalty)
      );
    }
  } else if (nativeExams.length > 0) {
    // Cuadro con examen físico sin hallazgos alterados (negativos pertinentes clave)
    const shotgunPenalty = exploredAllBlindly ? 3 : 0;
    if (foundNativeExams.length === 0) {
      examScore = Math.max(1, Math.min(5, totalUnlockedExams.length + 1) - shotgunPenalty);
    } else {
      const nativeRecall = foundNativeExams.length / nativeExams.length;
      const selectiveBonus = !exploredAllBlindly ? 1 : 0;
      examScore = Math.min(
        15,
        Math.max(1, Math.round(nativeRecall * 14) + selectiveBonus - shotgunPenalty)
      );
    }
  } else {
    examScore = Math.max(1, Math.min(15, totalUnlockedExams.length * 4) - (exploredAllBlindly ? 3 : 0));
  }

  const examDetail: RubricCategoryDetail = {
    whyScore:
      totalUnlockedExams.length === 0
        ? 'Obtuviste 0/15 porque no realizaste ninguna maniobra de exploración física al paciente.'
        : exploredAllBlindly
          ? `Desbloqueaste casi todo el catálogo físico (${totalUnlockedExams.length}/${allExams.length}) de forma indiscriminada; se aplicó ajuste por falta de priorización dirigida (${examScore}/15 pts).`
          : abnormalExams.length > 0
            ? `Ejecutaste ${totalUnlockedExams.length} maniobra(s) dirigida(s) y detectaste ${foundAbnormalExams.length} de ${abnormalExams.length} hallazgo(s) alterados clave del cuadro (${examScore}/15 pts).`
            : nativeExams.length > 0
              ? `Ejecutaste ${totalUnlockedExams.length} maniobra(s) dirigida(s) y verificaste ${foundNativeExams.length} de ${nativeExams.length} maniobra(s) clave de descarte (negativos pertinentes) (${examScore}/15 pts).`
              : `Ejecutaste ${totalUnlockedExams.length} maniobra(s) de exploración física dirigida (${examScore}/15 pts).`,
    strengths:
      foundAbnormalExams.length > 0
        ? foundAbnormalExams.map((e) => `Hallazgo clave detectado: ${e.name}`)
        : abnormalExams.length === 0 && foundNativeExams.length > 0
          ? foundNativeExams.map((e) => `Negativo pertinente confirmado: ${e.name}`)
          : totalUnlockedExams.length > 0
            ? [`Realizaste ${totalUnlockedExams.length} maniobra(s), aunque faltaron las maniobras clave del caso.`]
            : ['No se ejecutaron maniobras de exploración física.'],
    missingOrImprove: [
      ...(abnormalExams.length > 0
        ? missedAbnormalExams.map((e) => `Maniobra clave omitida: ${e.name} (${e.system})`)
        : missedNativeExams.map((e) => `Maniobra de descarte sugerida: ${e.name} (${e.system})`)),
      ...(exploredAllBlindly
        ? ['Evita pulsar "Explorar Todo" sin criterio; prioriza primero los sistemas comprometidos por la anamnesis (-3 pts).']
        : []),
    ],
    expectedStandard:
      abnormalExams.length > 0
        ? 'Se evalúa priorizar maniobras dirigidas a los sistemas sospechosos para detectar los signos positivos sin realizar exploración indiscriminada.'
        : 'En cuadros con exploración física normal, se evalúa confirmar los negativos pertinentes de los sistemas clave sin exploración indiscriminada.',
  };
  if (examDetail.missingOrImprove.length === 0) {
    examDetail.missingOrImprove.push('Exploración física dirigida sobresaliente: captaste todos los signos clave.');
  }

  // 3. SELECCIÓN E INTERPRETACIÓN DE ESTUDIOS (0 a 15 pts) — Separar estudios confirmatorios del caso vs hallazgos secundarios del catálogo
  const unlockedStudyIds = new Set(submission.unlockedStudies || []);
  const allStudies = caseData.studiesPool || [];
  const nativeStudies = allStudies.filter((st) => !st.id.startsWith('hosp-'));
  const foundNativeStudies = nativeStudies.filter((st) => unlockedStudyIds.has(st.id));
  const missedNativeStudies = nativeStudies.filter((st) => !unlockedStudyIds.has(st.id));
  const allAbnormalStudies = allStudies.filter((st) => st.isAbnormal);
  const nativeAbnormalStudies = allAbnormalStudies.filter((st) => !st.id.startsWith('hosp-'));
  const workupNorm = normStr((solution.recommendedWorkup || []).join(' '));
  const workupMatchedStudies = allAbnormalStudies.filter(
    (st) => workupNorm && tokenMatchRatio(workupNorm, st.name) >= 0.45
  );
  const coreAbnormalStudies =
    nativeAbnormalStudies.length > 0
      ? nativeAbnormalStudies
      : nativeStudies.length > 0
        ? []
        : workupMatchedStudies.length > 0
          ? workupMatchedStudies
          : allAbnormalStudies.slice(0, 3);

  const foundCoreStudies = coreAbnormalStudies.filter((st) => unlockedStudyIds.has(st.id));
  const missedCoreStudies = coreAbnormalStudies.filter((st) => !unlockedStudyIds.has(st.id));
  const foundAllAbnormalStudies = allAbnormalStudies.filter((st) => unlockedStudyIds.has(st.id));
  const secondaryAbnormalHits = foundAllAbnormalStudies.filter(
    (st) => !coreAbnormalStudies.some((c) => c.id === st.id)
  );
  const totalUnlockedStudies = allStudies.filter((st) => unlockedStudyIds.has(st.id));
  const orderedAllBlindly =
    allStudies.length >= 12 && totalUnlockedStudies.length >= allStudies.length - 2;
  const relevantHitCount =
    coreAbnormalStudies.length > 0 ? foundAllAbnormalStudies.length : foundNativeStudies.length;
  const unnecessaryCount = Math.max(0, totalUnlockedStudies.length - relevantHitCount - 4);

  const diagNormForStudies = normStr(solution.correctDiagnosis || '');
  const preDiagMatchRatio = (submission.primaryDiagnosis || '').trim()
    ? computeClinicalDiagnosisMatch(submission.primaryDiagnosis || '', solution.correctDiagnosis || '').ratio
    : 0;
  const highCostUnneededStudies = isSimplePrimaryWorkupCase(diagNormForStudies)
    ? totalUnlockedStudies.filter(
        (s) =>
          !s.isAbnormal &&
          /\b(tomografia|tac |resonancia|rmn|endoscopia|colonoscopia|broncoscopia)\b/.test(
            normStr(s.name)
          )
      )
    : [];

  const isPureClinicalStewardshipCase =
    coreAbnormalStudies.length === 0 &&
    (isSimplePrimaryWorkupCase(diagNormForStudies) ||
      nativeStudies.length === 0 ||
      nativeStudies.every((s) => !s.isAbnormal));

  let studyScore = 0;
  if (totalUnlockedStudies.length === 0) {
    if (isPureClinicalStewardshipCase && preDiagMatchRatio >= 0.45) {
      // Diagnóstico clínico puro donde evitar paraclínicos innecesarios es buena práctica clínica
      studyScore = 13;
    } else {
      studyScore = 0;
    }
  } else if (coreAbnormalStudies.length > 0) {
    const excessPenalty = orderedAllBlindly ? 4 : Math.min(3, Math.floor(unnecessaryCount / 3));
    const highCostPenalty = highCostUnneededStudies.length > 0 ? Math.min(2, highCostUnneededStudies.length) : 0;

    if (foundCoreStudies.length === 0 && secondaryAbnormalHits.length === 0) {
      studyScore = Math.min(4, totalUnlockedStudies.length + 1);
    } else if (foundCoreStudies.length === 0) {
      studyScore = Math.max(1, Math.min(10, 5 + secondaryAbnormalHits.length * 2) - excessPenalty - highCostPenalty);
    } else {
      const ratio = foundCoreStudies.length / coreAbnormalStudies.length;
      const bonusFromTargetedSecondary =
        !orderedAllBlindly && secondaryAbnormalHits.length > 0 ? 1 : 0;
      studyScore = Math.min(
        15,
        Math.max(1, Math.round(ratio * 14 + 1) + bonusFromTargetedSecondary - excessPenalty - highCostPenalty)
      );
    }
  } else {
    // Casos donde los estudios propios del caso son negativos pertinentes de descarte o el diagnóstico es puramente clínico
    const excessPenalty = orderedAllBlindly ? 4 : Math.min(3, Math.floor(unnecessaryCount / 3));
    const highCostPenalty = highCostUnneededStudies.length > 0 ? Math.min(2, highCostUnneededStudies.length) : 0;
    if (nativeStudies.length > 0) {
      if (foundNativeStudies.length > 0) {
        const nativeRatio = foundNativeStudies.length / nativeStudies.length;
        const targetedBonus = !orderedAllBlindly ? 1 : 0;
        studyScore = Math.max(
          1,
          Math.min(15, Math.round(nativeRatio * 14) + targetedBonus - excessPenalty - highCostPenalty)
        );
      } else {
        studyScore = Math.max(
          1,
          Math.min(10, 4 + totalUnlockedStudies.length * 2) - excessPenalty - highCostPenalty
        );
      }
    } else {
      studyScore = Math.max(
        1,
        Math.min(13, totalUnlockedStudies.length * 3) - excessPenalty - highCostPenalty
      );
    }
  }

  const workupStewardshipNote =
    totalUnlockedStudies.length === 0
      ? studyScore >= 12
        ? 'Uso racional excelente: abordaste un diagnóstico clínico sin indicar estudios paraclínicos innecesarios.'
        : 'No se solicitaron estudios complementarios.'
      : highCostUnneededStudies.length > 0
        ? `Uso racional de recursos: solicitaste estudio de alta complejidad/irradiación no indicado inicialmente en primer nivel (${highCostUnneededStudies.map((s) => s.name).join(', ')}).`
        : orderedAllBlindly || unnecessaryCount >= 4
          ? 'Se detectó solicitud excesiva de estudios ("escopetazo diagnóstico") sin discriminación clínica pre-test.'
          : 'Selección racional de estudios sin sobreutilización de imagen avanzada o pruebas innecesarias.';

  const studyDetail: RubricCategoryDetail = {
    whyScore:
      totalUnlockedStudies.length === 0
        ? studyScore >= 12
          ? `Abordaje clínico racional en un diagnóstico de resolución clínica sin paraclínicos obligatorios (${studyScore}/15 pts).`
          : 'Obtuviste 0/15 porque no solicitaste ningún estudio de laboratorio, imagen o gabinete.'
        : orderedAllBlindly
          ? `Solicitaste prácticamente toda la batería hospitalaria (${totalUnlockedStudies.length}/${allStudies.length}) sin discriminación pre-test, recibiendo penalización por uso excesivo de recursos (${studyScore}/15 pts).`
          : coreAbnormalStudies.length > 0
            ? `Solicitaste ${totalUnlockedStudies.length} estudio(s), acertando en ${foundCoreStudies.length} de ${coreAbnormalStudies.length} prueba(s) confirmatorias clave${secondaryAbnormalHits.length > 0 ? ` (+${secondaryAbnormalHits.length} estudio(s) complementario(s) útil(es))` : ''} (${studyScore}/15 pts).`
            : nativeStudies.length > 0
              ? `Solicitaste ${totalUnlockedStudies.length} estudio(s) e incluiste ${foundNativeStudies.length} de ${nativeStudies.length} estudio(s) pertinentes de descarte del cuadro (${studyScore}/15 pts).`
              : `Solicitaste ${totalUnlockedStudies.length} estudio(s) de apoyo clínico en un cuadro esencialmente clínico (${studyScore}/15 pts).`,
    strengths:
      foundAllAbnormalStudies.length > 0
        ? foundAllAbnormalStudies.slice(0, 6).map((s) => `Estudio pertinente solicitado: ${s.name}`)
        : coreAbnormalStudies.length === 0 && foundNativeStudies.length > 0
          ? foundNativeStudies.slice(0, 6).map((s) => `Estudio de descarte pertinente (negativo clave): ${s.name}`)
          : totalUnlockedStudies.length === 0 && studyScore >= 12
            ? ['Evitaste sobreestudio innecesario en un cuadro de diagnóstico primordialmente clínico.']
            : totalUnlockedStudies.length > 0
              ? [`Solicitaste ${totalUnlockedStudies.length} estudio(s), aunque faltaron los confirmatorios clave.`]
              : ['No se solicitaron estudios complementarios.'],
    missingOrImprove: [
      ...(coreAbnormalStudies.length > 0
        ? missedCoreStudies.slice(0, 5).map((s) => `Faltó solicitar estudio confirmatorio clave: ${s.name}`)
        : totalUnlockedStudies.length > 0
          ? missedNativeStudies.slice(0, 4).map((s) => `Estudio de descarte pertinente del caso: ${s.name}`)
          : []),
      ...(highCostUnneededStudies.length > 0
        ? [
            `Uso racional (MINSA / 1.er nivel): evita solicitar ${highCostUnneededStudies.map((s) => s.name).join(', ')} de entrada en un cuadro ambulatorio sin banderas rojas.`,
          ]
        : []),
      ...(orderedAllBlindly || unnecessaryCount >= 4
        ? ['Se solicitaron estudios innecesarios sin justificación clínica ("escopetazo diagnóstico").']
        : []),
    ],
    expectedStandard: `Abordaje recomendado por guías: ${(solution.recommendedWorkup || []).slice(0, 4).join(' · ') || 'Estudios dirigidos de confirmación y estratificación de gravedad.'}`,
  };
  if (studyDetail.missingOrImprove.length === 0) {
    studyDetail.missingOrImprove.push('Excelente selección racional de estudios confirmatorios sin sobreutilización.');
  }

  // 4. DIAGNÓSTICO PRINCIPAL Y RAZONAMIENTO (0 a 25 pts) — Con sinónimos y siglas nacionales/internacionales
  const userDiag = submission.primaryDiagnosis || '';
  const correctDiag = solution.correctDiagnosis || '';
  const diagMatchResult = computeClinicalDiagnosisMatch(userDiag, correctDiag);
  const diagMatchRatio = diagMatchResult.ratio;
  if (diagMatchResult.matchedSynonymLabel) {
    recognizedEquivalents.push(
      `Nomenclatura / sigla diagnóstica validada: "${userDiag}" ↔ "${correctDiag}" (${diagMatchResult.matchedSynonymLabel}).`
    );
  }
  const diffHitRatio = Math.max(
    0,
    ...(solution.differentialDiagnoses || []).map((d) => computeClinicalDiagnosisMatch(userDiag, d).ratio)
  );
  const justifLen = (submission.clinicalJustification || '').trim().length;
  const justifBonus = justifLen >= 50 ? 2 : justifLen >= 20 ? 1 : 0;

  let diagScore = 0;
  if (!userDiag.trim()) {
    diagScore = 0;
  } else if (diagMatchRatio >= 0.72) {
    diagScore = Math.min(25, 23 + justifBonus);
  } else if (diagMatchRatio >= 0.45) {
    diagScore = Math.min(22, 19 + justifBonus);
  } else if (diagMatchRatio >= 0.25 || diffHitRatio >= 0.45) {
    diagScore = Math.min(15, 12 + justifBonus);
  } else {
    diagScore = justifLen >= 40 ? 2 : 0;
  }

  const diagDetail: RubricCategoryDetail = {
    whyScore: !userDiag.trim()
      ? 'Obtuviste 0/25 porque dejaste en blanco el diagnóstico principal.'
      : diagMatchRatio >= 0.72
        ? `Tu diagnóstico ("${userDiag}") coincide de forma precisa con la patología real "${correctDiag}" (${diagScore}/25 pts).`
        : diagMatchRatio >= 0.45
          ? `Tu diagnóstico ("${userDiag}") identificó el proceso patológico central, aunque podía precisar mayor especificidad (gravedad o etiología) frente a "${correctDiag}" (${diagScore}/25 pts).`
          : diffHitRatio >= 0.45
            ? `Tu propuesta ("${userDiag}") corresponde a un diagnóstico diferencial cercano, pero no al diagnóstico definitivo real "${correctDiag}" (${diagScore}/25 pts).`
            : `Tu propuesta ("${userDiag}") no coincide con el diagnóstico definitivo "${correctDiag}" (${diagScore}/25 pts).`,
    strengths: [
      ...(diagMatchRatio >= 0.45 ? [`Aproximación clínica acertada hacia "${correctDiag}".`] : []),
      ...(diagMatchResult.matchedSynonymLabel
        ? [`Se reconoció tu terminología/sigla clínica (${diagMatchResult.matchedSynonymLabel}).`]
        : []),
      ...(justifLen >= 25 ? ['Redactaste una justificación clínica para argumentar tu hipótesis.'] : []),
    ],
    missingOrImprove: [
      ...(diagMatchRatio < 0.72
        ? [`El diagnóstico completo esperado es: "${correctDiag}". Especifica etiología, fase clínica o signos de alarma.`]
        : []),
      ...(justifLen < 35
        ? ['Faltó redactar una justificación clínica breve que integre anamnesis, examen físico y paraclínicos.']
        : []),
    ],
    expectedStandard: `Diagnóstico de referencia: ${correctDiag}.`,
  };
  if (diagDetail.strengths.length === 0) {
    diagDetail.strengths.push('Sin aciertos diagnósticos relevantes en el diagnóstico principal.');
  }
  if (diagDetail.missingOrImprove.length === 0) {
    diagDetail.missingOrImprove.push('Precisión diagnóstica sobresaliente y fundamentación clínica sólida.');
  }

  // 5. DIAGNÓSTICOS DIFERENCIALES (0 a 10 pts)
  const userDiffs = (submission.differentialDiagnoses || []).filter((d) => d.trim().length >= 2);
  const expectedDiffs = solution.differentialDiagnoses || [];
  const matchedDiffs: string[] = [];
  const missedDiffs: string[] = [];

  for (const expD of expectedDiffs) {
    const matched = userDiffs.some((uD) => computeClinicalDiagnosisMatch(uD, expD).ratio >= 0.35);
    if (matched) matchedDiffs.push(expD);
    else missedDiffs.push(expD);
  }

  let diffScore = 0;
  if (userDiffs.length === 0) {
    diffScore = 0;
  } else if (expectedDiffs.length > 0) {
    if (matchedDiffs.length === 0) {
      diffScore = 1;
    } else {
      diffScore = Math.min(
        10,
        Math.round((matchedDiffs.length / Math.min(3, expectedDiffs.length)) * 8 + Math.min(matchedDiffs.length, 2))
      );
    }
  } else {
    diffScore = Math.min(10, userDiffs.length * 3);
  }

  const diffDetail: RubricCategoryDetail = {
    whyScore:
      userDiffs.length === 0
        ? 'Obtuviste 0/10 porque no formulaste ningún diagnóstico diferencial.'
        : `Planteaste ${userDiffs.length} diagnóstico(s) diferencial(es), acertando en ${matchedDiffs.length} de las alternativas prioritarias del síndrome (${diffScore}/10 pts).`,
    strengths:
      matchedDiffs.length > 0
        ? matchedDiffs.map((d) => `Diferencial pertinente planteado: ${d}`)
        : userDiffs.length > 0
          ? [`Propusiste ${userDiffs.length} opción(es), pero ninguna coincidió con los diferenciales prioritarios del cuadro.`]
          : ['No se ingresaron diagnósticos diferenciales.'],
    missingOrImprove:
      missedDiffs.length > 0
        ? missedDiffs.map((d) => `Diferencial clave que faltó considerar: ${d}`)
        : ['Excelente cobertura de las principales patologías competidoras de este cuadro.'],
    expectedStandard: `Diferenciales principales esperados: ${expectedDiffs.join(' · ')}.`,
  };

  // 6. TRATAMIENTO Y RÉGIMEN FARMACOLÓGICO (0 a 15 pts) — Normativa Nicaragüense (MINSA LBM) + Estándar Internacional
  const userRx = (submission.pharmacologicalPlan || []).filter((r) => (r.drug || '').trim().length >= 2);
  const optRx = solution.optimalTreatment?.pharmacological || [];
  const activeGeneralForRx = stripNegatedMedicationClauses(submission.generalMeasures || '');
  const userRxAndMeasuresText = normStr(
    `${userRx.map((r) => `${r.drug} ${r.dose} ${r.route}`).join(' ')} ${activeGeneralForRx}`
  );
  const userRxOnlyNorm = normStr(userRx.map((r) => `${r.drug} ${r.dose} ${r.route}`).join(' '));
  const diagNormForRx = normStr(solution.correctDiagnosis || '');

  const matchedDrugs: string[] = [];
  const missedDrugs: string[] = [];

  for (const rx of optRx) {
    const matchRes = matchesOptimalDrug(userRxAndMeasuresText, rx.drug, diagNormForRx);
    if (matchRes.matched) {
      matchedDrugs.push(`${rx.drug} (${rx.dose})`);
      if (matchRes.equivalentNote) {
        recognizedEquivalents.push(matchRes.equivalentNote);
      }
    } else {
      missedDrugs.push(`${rx.drug} — ${rx.dose}, ${rx.route}, ${rx.frequency} (${rx.duration})`);
    }
  }

  const completeRxCount = userRx.filter(
    (r) => (r.drug || '').trim() && (r.dose || '').trim() && (r.route || '').trim() && (r.frequency || '').trim()
  ).length;
  const generalTextTrimmed = (submission.generalMeasures || '').trim();
  const generalTextNorm = normStr(generalTextTrimmed);
  const hasGeneralMeasures =
    generalTextTrimmed.length >= 15 ||
    (generalTextTrimmed.length >= 3 &&
      /\b(npo|ayun[oa]?|no comer|nada por boca|dieta|hidrat|suero|liquid|oxigen|repos|hielo|eleva|vigil|control|monitor|sonda|canaliz|cirug|quirofano|operar|aislam|lavado|higiene|compres|vendaj|ferula)\b/.test(
        generalTextNorm
      ));

  const requiredOptRx = optRx.filter((r) => !/\bopcional\b/i.test(`${r.drug} ${r.rationale || ''}`));
  const denominatorRxCount = requiredOptRx.length > 0 ? requiredOptRx.length : optRx.length;

  let treatScore = 0;
  if (userRx.length === 0 && !hasGeneralMeasures) {
    treatScore = 0;
  } else if (optRx.length > 0) {
    let drugRatio = Math.min(1, matchedDrugs.length / denominatorRxCount);
    if (denominatorRxCount >= 3 && matchedDrugs.length >= denominatorRxCount - 1) {
      drugRatio = Math.max(drugRatio, 0.9);
    }
    const posologyBonus =
      matchedDrugs.length > 0 && completeRxCount > 0
        ? completeRxCount >= userRx.length
          ? 3
          : 2
        : 0;
    const generalBonus = hasGeneralMeasures ? 2 : 0;
    const effortFloor = userRx.length > 0 && matchedDrugs.length === 0 ? 1 : 0;
    treatScore = Math.min(15, Math.round(drugRatio * 10) + posologyBonus + generalBonus + effortFloor);
  } else {
    treatScore = Math.min(15, userRx.length * 4 + (hasGeneralMeasures ? 2 : 0));
  }

  const criticalSafetyErrors = checkCriticalSafetyErrors(submission, caseData);

  // 6b. AUDITORÍA DE INTERVENCIONES STAT REALIZADAS AL PACIENTE Y EVOLUCIÓN VITAL
  const statList = submission.statInterventions || [];
  const baseVitals: VitalSigns = submission.baselineVitalSigns || caseData.vitalSigns;
  const endVitals: VitalSigns = submission.finalVitalSigns || baseVitals;

  const parseSys = (bp: string): number => {
    const m = (bp || '').match(/(\d+)\s*\/\s*(\d+)/);
    return m ? parseInt(m[1], 10) : 120;
  };
  const baseSys = parseSys(baseVitals.bloodPressure);
  const endSys = parseSys(endVitals.bloodPressure);

  const arrivedCriticallyUnstable =
    baseSys < 90 ||
    baseSys >= 180 ||
    baseVitals.oxygenSaturation < 90 ||
    (typeof baseVitals.bloodGlucose === 'number' && baseVitals.bloodGlucose < 65) ||
    /\bNivel I\b/.test(caseData.patientInfo.triageLevel || '');

  const interventionReviews: StatInterventionAuditItem[] = statList.map((rec) => {
    const deltaSummary =
      rec.deltas.length > 0
        ? rec.deltas.map((d) => `${d.metric}: ${d.before} → ${d.after} (${d.deltaText})`).join(' · ')
        : 'Sin cambios inmediatos en monitor';

    if (rec.effectSeverity === 'reaccion_adversa') {
      return {
        drug: rec.drug,
        dose: rec.dose,
        route: rec.route,
        verdict: 'riesgo_o_excesivo',
        comment: rec.physiologicalEffectSummary,
        deltaSummary,
      };
    }
    if (rec.effectSeverity === 'mejoria') {
      return {
        drug: rec.drug,
        dose: rec.dose,
        route: rec.route,
        verdict: 'adecuado',
        comment: rec.physiologicalEffectSummary,
        deltaSummary,
      };
    }
    if (rec.effectSeverity === 'parcial') {
      return {
        drug: rec.drug,
        dose: rec.dose,
        route: rec.route,
        verdict: 'adecuado',
        comment: rec.physiologicalEffectSummary,
        deltaSummary,
      };
    }
    return {
      drug: rec.drug,
      dose: rec.dose,
      route: rec.route,
      verdict: 'parcial_o_sin_efecto',
      comment: rec.physiologicalEffectSummary,
      deltaSummary,
    };
  });

  const adverseStatEvents = interventionReviews.filter((r) => r.verdict === 'riesgo_o_excesivo');
  const positiveStatEvents = interventionReviews.filter((r) => r.verdict === 'adecuado');

  for (const adv of adverseStatEvents) {
    const commentNorm = normStr(adv.comment);
    const isSeverePhysiologicStatHarm =
      /\b(crisis adrenergica|descarga adrenergica|broncoespasmo severo|depresion respiratoria|hipotension iatrogenica|descenso tensional demasiado brusco|hipoglucemia iatrogenica|descenso glucemico excesivo|hipermagnesemia|agravamiento de edema|sobrecarga hidrica|narcosis hipercapnica)\b/.test(
        commentNorm
      );
    if (!isSeverePhysiologicStatHarm) continue;
    const msg = `¡EVENTO ADVERSO EN ESTABILIZACIÓN STAT!: ${adv.drug} (${adv.dose}, ${adv.route}) — ${adv.comment}`;
    if (!criticalSafetyErrors.some((e) => normStr(e).includes(normStr(adv.drug).slice(0, 8)))) {
      criticalSafetyErrors.push(msg);
    }
  }

  const vitalEvolutionSummary = `Ingreso: PA ${baseVitals.bloodPressure.split(' ')[0]} · FC ${baseVitals.heartRate} · FR ${baseVitals.respiratoryRate} · SpO₂ ${baseVitals.oxygenSaturation}%${typeof baseVitals.bloodGlucose === 'number' ? ` · Gluc ${baseVitals.bloodGlucose}` : ''}  →  Final: PA ${endVitals.bloodPressure.split(' ')[0]} · FC ${endVitals.heartRate} · FR ${endVitals.respiratoryRate} · SpO₂ ${endVitals.oxygenSaturation}%${typeof endVitals.bloodGlucose === 'number' ? ` · Gluc ${endVitals.bloodGlucose}` : ''}`;

  let statOverallVerdict: StatAuditSummary['overallVerdict'] = 'no_requerido';
  let statNarrative =
    'Caso sin requerimiento crítico de estabilización STAT inmediata en sala de choque.';

  if (adverseStatEvents.length > 0) {
    statOverallVerdict = 'riesgo_critico';
    statNarrative = `Se aplicaron ${statList.length} intervención(es) STAT, pero ${adverseStatEvents.length} produjo deterioro fisiológico o evento adverso por dosis excesiva o contraindicación.`;
  } else if (statList.length > 0) {
    if (positiveStatEvents.length > 0) {
      statOverallVerdict = 'optimo';
      statNarrative = `Estabilización STAT oportuna (${statList.length} dosis aplicadas) con respuesta fisiológica favorable y sin iatrogenia.`;
      if (treatScore > 0 && treatScore < 15 && matchedDrugs.length > 0) {
        treatScore = Math.min(15, treatScore + 1);
      }
    } else {
      statOverallVerdict = 'parcial';
      statNarrative = `Se administraron ${statList.length} intervención(es) STAT, aunque sin impacto relevante sobre la alteración fisiológica prioritaria.`;
    }
  } else if (arrivedCriticallyUnstable && matchedDrugs.length === 0) {
    statOverallVerdict = 'omitido_en_inestabilidad';
    statNarrative = `El paciente ingresó con compromiso vital significativo (PA ${baseSys} mmHg / SpO₂ ${baseVitals.oxygenSaturation}%) y no recibió intervención STAT estabilizadora ni manejo agudo acorde.`;
    if (treatScore > 2) {
      treatScore = Math.max(0, treatScore - 2);
    }
  }

  const statAudit: StatAuditSummary = {
    performedCount: statList.length,
    overallVerdict: statOverallVerdict,
    vitalEvolutionSummary,
    narrative: statNarrative,
    interventionReviews,
  };

  if (criticalSafetyErrors.length > 0) {
    treatScore = Math.min(treatScore, 3);
  }

  // Uso Racional de Antibióticos (stewardship en primer nivel y urgencias)
  const activeUserRxOnly = stripNegatedMedicationClauses(
    userRx.map((r) => `${r.drug} ${r.dose} ${r.route}`).join('. ')
  );
  const prescribedSystemicAbx = SYSTEMIC_ANTIBIOTIC_REGEX.test(activeUserRxOnly);
  const nonBacterialCase = isNonBacterialPrimaryCase(diagNormForRx);
  let rationalAntibioticStatus: 'optimo' | 'alerta' | 'no_aplica' = 'no_aplica';
  let rationalAntibioticNote = 'Caso con indicación antimicrobiana específica o manejo no centrado en stewardship viral.';

  if (nonBacterialCase && prescribedSystemicAbx) {
    rationalAntibioticStatus = 'alerta';
    rationalAntibioticNote =
      'Alerta de Uso Racional: se prescribió antibiótico sistémico en una patología viral, mecánica o no bacteriana sin sobreinfección demostrada (-2 pts).';
    if (treatScore > 0) {
      treatScore = Math.max(0, treatScore - 2);
    }
  } else if (nonBacterialCase && (userRx.length > 0 || hasGeneralMeasures)) {
    rationalAntibioticStatus = 'optimo';
    rationalAntibioticNote =
      'Uso racional ejemplar: evitaste prescribir antibióticos innecesarios en un cuadro no bacteriano, previniendo resistencia antimicrobiana.';
  } else if (!nonBacterialCase && optRx.some((r) => SYSTEMIC_ANTIBIOTIC_REGEX.test(normStr(r.drug)))) {
    if (matchedDrugs.some((d) => SYSTEMIC_ANTIBIOTIC_REGEX.test(normStr(d)))) {
      rationalAntibioticStatus = 'optimo';
      rationalAntibioticNote =
        'Esquema antimicrobiano dirigido acorde a normativa nacional (MINSA) e internacional para este foco.';
    } else if (prescribedSystemicAbx) {
      rationalAntibioticStatus = 'alerta';
      rationalAntibioticNote =
        'El antibiótico elegido no corresponde al espectro de primera línea recomendado por las guías clínicas para este foco.';
    } else {
      rationalAntibioticStatus = 'alerta';
      rationalAntibioticNote =
        'Patología bacteriana que requería inicio oportuno de antibioticoterapia de primera línea.';
    }
  }

  // Nota docente farmacológica cuando se prescriben alternativas seguras en alergia a penicilina
  const allergiesNormForNote = normStr((caseData.background?.allergies || []).join(' '));
  const pharmacologyNotes: string[] = [];
  if (allergiesNormForNote.includes('penicilin') && criticalSafetyErrors.length === 0) {
    if (/\b(meropenem|imipenem|ertapenem)\b/.test(userRxOnlyNorm)) {
      pharmacologyNotes.push(
        'Nota farmacológica: El uso de un carbapenémico (ej. meropenem) tiene <1% de reactividad cruzada en alergia a penicilina (guías AAAAI 2022) y NO se penaliza como error anafiláctico; sin embargo, para infecciones comunitarias sin riesgo MDR se prefiere un esquema dirigido (como levofloxacino).'
      );
    }
    if (/\b(eritromicina|azitromicina|claritromicina)\b/.test(userRxOnlyNorm)) {
      pharmacologyNotes.push(
        'Nota farmacológica: Los macrólidos (eritromicina/azitromicina) son seguros ante alergia a penicilina, pero por la resistencia neumocócica (~25-40%) en paciente hospitalizado grave se prefiere fluoroquinolona respiratoria (Levofloxacino 750 mg IV).'
      );
    }
  }

  const uniqueEquivalents = Array.from(new Set(recognizedEquivalents));

  const treatDetail: RubricCategoryDetail = {
    whyScore:
      userRx.length === 0 && !hasGeneralMeasures
        ? 'Obtuviste 0/15 porque no propusiste fármacos ni medidas generales terapéuticas.'
        : `Indicaste ${userRx.length} fármaco(s) (${completeRxCount} con posología completa) y cubriste ${matchedDrugs.length} de ${optRx.length} pilares terapéuticos aceptados por Normativa MINSA / Internacional (${treatScore}/15 pts).`,
    strengths: [
      ...matchedDrugs.map((d) => `Indicación terapéutica acertada: ${d}`),
      ...positiveStatEvents.map(
        (s) => `Estabilización STAT efectiva: ${s.drug} (${s.dose}) — ${s.deltaSummary}`
      ),
      ...uniqueEquivalents.filter((e) => !e.startsWith('Nomenclatura')),
      ...(rationalAntibioticStatus === 'optimo' && nonBacterialCase
        ? ['Uso racional de antibióticos: no indicaste antimicrobianos innecesarios en cuadro no bacteriano.']
        : []),
      ...(hasGeneralMeasures ? ['Incluiste medidas generales de soporte clínico.'] : []),
    ],
    missingOrImprove: [
      ...missedDrugs.map((d) => `Faltó indicar según esquema de referencia: ${d}`),
      ...adverseStatEvents.map((a) => `Dosis o fármaco STAT riesgoso (${a.drug} ${a.dose}): ${a.comment}`),
      ...(statOverallVerdict === 'omitido_en_inestabilidad' ? [statNarrative] : []),
      ...(rationalAntibioticStatus === 'alerta' && nonBacterialCase ? [rationalAntibioticNote] : []),
      ...pharmacologyNotes,
      ...(userRx.length > 0 && completeRxCount < userRx.length
        ? ['Completa siempre dosis exacta, vía, frecuencia y duración de cada fármaco prescrito.']
        : []),
      ...(!hasGeneralMeasures
        ? ['Faltó detallar medidas generales (hidratación/ayuno/oxigenoterapia/monitorización/reposo según el caso).']
        : []),
    ],
    expectedStandard: `Esquema de referencia: ${optRx.map((r) => `${r.drug} ${r.dose} (${r.route}, ${r.frequency})`).join(' + ')}. (También se aceptan equivalentes válidos de Lista Básica MINSA e Internacional).`,
  };
  if (treatDetail.strengths.length === 0) {
    treatDetail.strengths.push('Sin coincidencias con los fármacos recomendados.');
  }
  if (treatDetail.missingOrImprove.length === 0) {
    treatDetail.missingOrImprove.push('Prescripción farmacológica completa, segura y acorde a normativa.');
  }

  // 7. CONDUCTA, TRIAGE Y SEGURIDAD DEL PACIENTE (0 a 5 pts) — Criterio estricto de nivel asistencial
  const expectedHosp = solution.optimalTreatment?.hospitalizationDecision || '';
  const userHospNorm = normStr(submission.hospitalizationDecision);
  const expectedHospNorm = normStr(expectedHosp);
  const userRank = getDispositionRank(userHospNorm);
  const expectedRank = getDispositionRank(expectedHospNorm);
  const userIsSurgery = userHospNorm.includes('quirofano') || userHospNorm.includes('cirugia');
  const expectedIsSurgery = expectedHospNorm.includes('quirofano') || expectedHospNorm.includes('cirugia');
  const surgicalCase = isSurgicalOrProceduralCase(caseData);

  const hospExactMatch =
    Boolean(userHospNorm) &&
    (userHospNorm === expectedHospNorm ||
      (userIsSurgery && expectedIsSurgery) ||
      (userIsSurgery && surgicalCase && expectedRank === 3));

  const hasReferral = (submission.referralCriteria || '').trim().length >= 10;
  const hasFollowUp = (submission.followUpPlan || '').trim().length >= 10;
  const redFlagSource = normStr(
    `${submission.followUpPlan || ''} ${submission.referralCriteria || ''} ${submission.generalMeasures || ''}`
  );
  const hasRedFlagsGuidance =
    /\b(alarma|urgencia|regresar|revalor|empeor|fiebre|sangr|disnea|dificultad|deshidrat|vomit|dolor|vigil|24|48|72|signos)\b/.test(
      redFlagSource
    );
  const noMeaningfulWorkDone = !userDiag.trim() && userRx.length === 0 && !hasGeneralMeasures;

  let dispositionPts = 3;
  let referralTriageVerdict: 'correcto' | 'subestimado' | 'sobreestimado' = 'correcto';
  let referralTriageNote = `Destino clínico acertado ("${expectedHosp}"): equilibrio adecuado entre nivel de cuidado y capacidad resolutiva.`;

  if (hospExactMatch) {
    dispositionPts = 3;
    if (userHospNorm !== expectedHospNorm && userIsSurgery) {
      referralTriageNote = `Destino clínico acertado ("${submission.hospitalizationDecision}"): resolución quirúrgica/intervencionista acorde a la patología ("${expectedHosp}").`;
    }
  } else if (userRank === 0) {
    dispositionPts = 0;
    referralTriageVerdict = 'subestimado';
    referralTriageNote = `No definiste un destino clínico acorde al nivel esperado ("${expectedHosp}") (0/3 pts).`;
  } else if (expectedRank === 5) {
    // Caso que exige UCI
    if (userRank === 3) {
      dispositionPts = 1;
      referralTriageVerdict = 'subestimado';
      referralTriageNote = `Subestimación del nivel de cuidado crítico: indicaste "${submission.hospitalizationDecision}", pero la gravedad del paciente exige "${expectedHosp}" para monitorización y soporte continuo (1/3 pts).`;
    } else if (userRank === 4) {
      if (surgicalCase) {
        dispositionPts = 2;
        referralTriageVerdict = 'subestimado';
        referralTriageNote = `Conducta intervencionista parcial: indicaste "${submission.hospitalizationDecision}", pero este paciente crítico requiere además manejo en "${expectedHosp}" (2/3 pts).`;
      } else {
        dispositionPts = 1;
        referralTriageVerdict = 'sobreestimado';
        referralTriageNote = `Destino clínico impreciso: indicaste "${submission.hospitalizationDecision}" en una emergencia médica que corresponde a "${expectedHosp}" (1/3 pts).`;
      }
    } else {
      dispositionPts = 0;
      referralTriageVerdict = 'subestimado';
      referralTriageNote = `Subestimación grave del riesgo vital: indicaste "${submission.hospitalizationDecision}" cuando el paciente requiere ingreso inmediato a "${expectedHosp}" (0/3 pts).`;
    }
  } else if (expectedRank === 4) {
    // Caso que exige Quirófano / Cirugía de Urgencia
    if (userRank === 3) {
      dispositionPts = 1;
      referralTriageVerdict = 'subestimado';
      referralTriageNote = `Subestimación de prioridad quirúrgica: indicaste "${submission.hospitalizationDecision}", aunque el caso amerita resolución directa en "${expectedHosp}" (1/3 pts).`;
    } else if (userRank === 5) {
      dispositionPts = 1;
      referralTriageVerdict = 'sobreestimado';
      referralTriageNote = `Indicaste "${submission.hospitalizationDecision}", pero el destino terapéutico prioritario es "${expectedHosp}" (1/3 pts).`;
    } else {
      dispositionPts = 0;
      referralTriageVerdict = 'subestimado';
      referralTriageNote = `Subestimación grave de urgencia quirúrgica: indicaste "${submission.hospitalizationDecision}" cuando exige "${expectedHosp}" (0/3 pts).`;
    }
  } else if (expectedRank === 3) {
    // Caso que exige Hospitalización en Sala
    if (userRank === 2) {
      dispositionPts = 1;
      referralTriageVerdict = 'subestimado';
      referralTriageNote = `Subestimación de requerimiento hospitalario: indicaste "${submission.hospitalizationDecision}", pero el cuadro amerita ingreso a "${expectedHosp}" (1/3 pts).`;
    } else if (userRank === 5) {
      dispositionPts = 1;
      referralTriageVerdict = 'sobreestimado';
      referralTriageNote = `Sobreutilización de terapia intensiva: indicaste "${submission.hospitalizationDecision}" en un paciente sin criterios críticos que corresponde a "${expectedHosp}" (1/3 pts).`;
    } else if (userRank === 4) {
      dispositionPts = 0;
      referralTriageVerdict = 'sobreestimado';
      referralTriageNote = `Destino inadecuado: indicaste "${submission.hospitalizationDecision}" en una patología médica no quirúrgica que corresponde a "${expectedHosp}" (0/3 pts).`;
    } else {
      dispositionPts = 0;
      referralTriageVerdict = 'subestimado';
      referralTriageNote = `Subestimación grave de gravedad clínica: indicaste "${submission.hospitalizationDecision}" cuando la patología exige "${expectedHosp}" (0/3 pts).`;
    }
  } else if (expectedRank === 2) {
    // Caso que exige Observación Urgencias
    if (userRank === 3) {
      dispositionPts = 1;
      referralTriageVerdict = 'sobreestimado';
      referralTriageNote = `Sobreestimación moderada de ingreso: indicaste "${submission.hospitalizationDecision}", aunque este cuadro se maneja inicialmente en "${expectedHosp}" (1/3 pts).`;
    } else if (userRank === 1) {
      dispositionPts = 0;
      referralTriageVerdict = 'subestimado';
      referralTriageNote = `Egreso prematuro: indicaste "${submission.hospitalizationDecision}" cuando requería vigilancia en "${expectedHosp}" (0/3 pts).`;
    } else {
      dispositionPts = 0;
      referralTriageVerdict = 'sobreestimado';
      referralTriageNote = `Sobre-referencia de recursos: indicaste "${submission.hospitalizationDecision}" para un cuadro de "${expectedHosp}" (0/3 pts).`;
    }
  } else {
    // Caso Ambulatorio (expectedRank === 1)
    if (userRank === 2) {
      dispositionPts = 1;
      referralTriageVerdict = 'sobreestimado';
      referralTriageNote = `Sobreestimación de estancia: indicaste "${submission.hospitalizationDecision}", aunque este cuadro estable puede manejarse de forma "${expectedHosp}" (1/3 pts).`;
    } else {
      dispositionPts = 0;
      referralTriageVerdict = 'sobreestimado';
      referralTriageNote = `Sobre-referencia injustificada de recursos hospitalarios: indicaste "${submission.hospitalizationDecision}" en una patología de manejo "${expectedHosp}" (0/3 pts).`;
    }
  }

  const redFlagsSafetyNote = hasRedFlagsGuidance
    ? 'Se documentaron signos de alarma o pautas de vigilancia/revaloración oportuna.'
    : expectedHosp === 'Ambulatorio'
      ? 'En manejo ambulatorio es indispensable explicar al paciente los signos de alarma específicos para acudir de inmediato a urgencias.'
      : 'Faltó explicitar parámetros objetivos de vigilancia o deterioro clínico para escalar manejo.';

  let safetyScore = 0;
  if (noMeaningfulWorkDone || criticalSafetyErrors.length > 0) {
    safetyScore = 0;
  } else {
    safetyScore = dispositionPts + (hasReferral ? 1 : 0) + (hasFollowUp ? 1 : 0);
  }

  const safetyDetail: RubricCategoryDetail = {
    whyScore: noMeaningfulWorkDone
      ? 'Obtuviste 0/5 porque no se registró diagnóstico ni plan terapéutico, dejando al paciente sin conducta médica definida.'
      : criticalSafetyErrors.length > 0
        ? 'Obtuviste 0/5 por cometer un error crítico de seguridad que pone en peligro la vida o integridad del paciente.'
        : `Nivel de atención propuesto: "${submission.hospitalizationDecision || 'Sin especificar'}" vs esperado "${expectedHosp}" (Destino: ${dispositionPts}/3 · Total conducta: ${safetyScore}/5 pts).`,
    strengths: [
      ...(hospExactMatch && !noMeaningfulWorkDone ? [`Decisión correcta de destino clínico (${expectedHosp}).`] : []),
      ...(!noMeaningfulWorkDone && criticalSafetyErrors.length === 0
        ? ['Sin errores farmacológicos potencialmente mortales ni iatrogenia grave.']
        : []),
      ...(hasReferral ? ['Definiste criterios de referencia o interconsulta.'] : []),
      ...(hasFollowUp ? ['Definiste plan de seguimiento y vigilancia.'] : []),
      ...(hasRedFlagsGuidance ? ['Incluiste signos de alarma o pautas claras de revaloración.'] : []),
    ],
    missingOrImprove: [
      ...criticalSafetyErrors,
      ...(noMeaningfulWorkDone
        ? ['Registra al menos un diagnóstico presuntivo y conducta clínica antes de finalizar la atención.']
        : []),
      ...(!hospExactMatch ? [referralTriageNote] : []),
      ...(!hasReferral ? ['Faltó especificar criterios claros de referencia/interconsulta especializada o ingreso a UCI.'] : []),
      ...(!hasFollowUp || !hasRedFlagsGuidance ? [redFlagsSafetyNote] : []),
    ],
    expectedStandard: `Conducta esperada: ${expectedHosp}. Seguimiento: ${solution.optimalTreatment?.followUp || 'Vigilancia clínica estrecha y signos de alarma.'}`,
  };
  if (safetyDetail.strengths.length === 0) {
    safetyDetail.strengths.push('No se acreditó una conducta segura válida.');
  }
  if (safetyDetail.missingOrImprove.length === 0) {
    safetyDetail.missingOrImprove.push('Conducta clínica segura, oportuna y alineada con el triage del paciente.');
  }

  const totalScore = Math.min(
    100,
    anamScore + examScore + studyScore + diagScore + diffScore + treatScore + safetyScore
  );

  let classification: EvaluationResult['classification'] = 'Buen desempeño';
  if (totalScore >= 90) classification = 'Excelente razonamiento clínico';
  else if (totalScore >= 80) classification = 'Muy buen desempeño';
  else if (totalScore >= 70) classification = 'Buen desempeño';
  else if (totalScore >= 60) classification = 'Necesita reforzar conocimientos';
  else classification = 'Necesita mejorar su abordaje clínico';

  const differentialExplanations = (solution.differentialDiagnoses || []).map((diff, i) => ({
    diagnosis: diff,
    rationale:
      (solution.criticalRulingOutFactors && solution.criticalRulingOutFactors[i]) ||
      `Aunque comparte síntomas iniciales con el motivo de consulta, la exploración física dirigida y los estudios paraclínicos orientan a favor de ${solution.correctDiagnosis} y permiten descartar ${diff}.`,
  }));

  return {
    totalScore,
    breakdown: {
      anamnesis: anamScore,
      physicalExam: examScore,
      studiesInterpretation: studyScore,
      primaryDiagnosis: diagScore,
      differentialDiagnoses: diffScore,
      treatment: treatScore,
      safetyAndConduct: safetyScore,
    },
    categoryDetails: {
      anamnesis: anamDetail,
      physicalExam: examDetail,
      studiesInterpretation: studyDetail,
      primaryDiagnosis: diagDetail,
      differentialDiagnoses: diffDetail,
      treatment: treatDetail,
      safetyAndConduct: safetyDetail,
    },
    classification,
    criticalSafetyErrors,
    feedback: {
      diagnosisAccuracyComment: diagDetail.whyScore,
      reasoningEvaluation: (() => {
        if (justifLen >= 25) {
          return `Tu justificación ("${submission.clinicalJustification.slice(0, 220)}") fue contrastada contra la fisiopatología de referencia: ${solution.pathophysiology}`;
        }
        const abnormalVitals = getAbnormalVitalSignDescriptions(caseData);
        if (abnormalVitals.length > 0) {
          return `No redactaste una justificación clínica amplia. Es fundamental explicar cómo los signos vitales alterados (${abnormalVitals.join(', ')}), los hallazgos físicos y los paraclínicos convergen en "${solution.correctDiagnosis}".`;
        }
        return `No redactaste una justificación clínica amplia. Aunque sus signos vitales se encuentran estables y dentro de parámetros normales (lo cual descarta compromiso hemodinámico o sistémico agudo), es fundamental explicar cómo los síntomas de la historia clínica, los hallazgos físicos clave y los paraclínicos respaldan "${solution.correctDiagnosis}".`;
      })(),
      differentialEvaluation: diffDetail.whyScore,
      workupCritique: studyDetail.whyScore,
      treatmentCritique: `${treatDetail.whyScore} ${treatDetail.missingOrImprove.slice(0, 2).join(' ')}`,
      pedagogicalPearls: [
        ...(solution.keyClinicalClues || []).slice(0, 3),
        ...(solution.criticalSafetyAlerts || []).slice(0, 2),
      ],
      guidelinesSummary: (solution.guidelineReferences || []).join(' · '),
    },
    differentialExplanations,
    rationalUseAudit: {
      rationalAntibioticStatus,
      rationalAntibioticNote,
      workupStewardshipNote,
      redFlagsSafetyNote,
      referralTriageVerdict,
      referralTriageNote,
    },
    evaluationFrameworkLabel: EVALUATION_FRAMEWORK_LABEL,
    recognizedEquivalents: uniqueEquivalents,
    statAudit,
    userSummary: {
      primaryDiagnosis: submission.primaryDiagnosis || 'Sin diagnóstico registrado',
      differentialDiagnoses: userDiffs,
      clinicalJustification: submission.clinicalJustification || '',
      pharmacologicalPlan: userRx,
      generalMeasures: submission.generalMeasures || '',
      hospitalizationDecision: submission.hospitalizationDecision || 'Sin definir',
      referralCriteria: submission.referralCriteria || '',
      followUpPlan: submission.followUpPlan || '',
      questionCount: qCount,
      unlockedExamsNames: totalUnlockedExams.map((e) => e.name),
      unlockedStudiesNames: totalUnlockedStudies.map((s) => s.name),
      baselineVitalSigns: baseVitals,
      finalVitalSigns: endVitals,
    },
    resolvedAt: new Date().toISOString(),
  };
}

/**
 * Fusiona la evaluación generada por IA con límites estrictos objetivos:
 * impide que secciones vacías o acciones indiscriminadas reciban puntaje gratuito.
 */
export function enrichEvaluationWithDidactics(
  aiEval: EvaluationResult,
  submission: UserEvaluationInput,
  caseData: ClinicalCase
): EvaluationResult {
  const baseline = buildDidacticEvaluation(submission, caseData);
  const qCount = submission.questionCount || 0;
  const examsCount = submission.unlockedExams?.length || 0;
  const studiesCount = submission.unlockedStudies?.length || 0;
  const hasDiag = Boolean((submission.primaryDiagnosis || '').trim());
  const hasDiffs = (submission.differentialDiagnoses || []).some((d) => d.trim().length >= 3);
  const genTrim = (submission.generalMeasures || '').trim();
  const hasTreat =
    (submission.pharmacologicalPlan || []).some((r) => (r.drug || '').trim().length >= 2) ||
    genTrim.length >= 15 ||
    (genTrim.length >= 3 &&
      /\b(npo|ayun[oa]?|no comer|nada por boca|dieta|hidrat|suero|liquid|oxigen|repos|hielo|eleva|vigil|control|monitor|sonda|canaliz|cirug|quirofano|operar|aislam|lavado|higiene|compres|vendaj|ferula)\b/.test(
        normStr(genTrim)
      ));

  const capWithBaselineIfStrict = (aiVal: number | undefined, baseVal: number, maxVal: number, isEmpty: boolean) => {
    if (isEmpty) return 0;
    const raw = Math.min(maxVal, Math.max(0, Math.round(aiVal ?? baseVal)));
    // Permite reconocer redacción clínica natural y equivalencias nacionales cuando la IA las valida, evitando castigos artificiales
    return Math.min(raw, Math.max(baseVal + 4, Math.round(raw * 0.65 + baseVal * 0.35)));
  };

  const mergedBreakdown = {
    anamnesis: capWithBaselineIfStrict(aiEval.breakdown?.anamnesis, baseline.breakdown.anamnesis, 15, qCount === 0),
    physicalExam: capWithBaselineIfStrict(aiEval.breakdown?.physicalExam, baseline.breakdown.physicalExam, 15, examsCount === 0),
    studiesInterpretation: capWithBaselineIfStrict(aiEval.breakdown?.studiesInterpretation, baseline.breakdown.studiesInterpretation, 15, studiesCount === 0),
    primaryDiagnosis: capWithBaselineIfStrict(aiEval.breakdown?.primaryDiagnosis, baseline.breakdown.primaryDiagnosis, 25, !hasDiag),
    differentialDiagnoses: capWithBaselineIfStrict(aiEval.breakdown?.differentialDiagnoses, baseline.breakdown.differentialDiagnoses, 10, !hasDiffs),
    treatment: capWithBaselineIfStrict(aiEval.breakdown?.treatment, baseline.breakdown.treatment, 15, !hasTreat),
    safetyAndConduct:
      !hasDiag && !hasTreat
        ? 0
        : baseline.criticalSafetyErrors.length > 0
          ? 0
          : Math.min(
              baseline.breakdown.safetyAndConduct,
              Math.max(0, Math.round(aiEval.breakdown?.safetyAndConduct ?? baseline.breakdown.safetyAndConduct))
            ),
  };

  const sumScore =
    mergedBreakdown.anamnesis +
    mergedBreakdown.physicalExam +
    mergedBreakdown.studiesInterpretation +
    mergedBreakdown.primaryDiagnosis +
    mergedBreakdown.differentialDiagnoses +
    mergedBreakdown.treatment +
    mergedBreakdown.safetyAndConduct;

  let classification: EvaluationResult['classification'] = 'Buen desempeño';
  if (sumScore >= 90) classification = 'Excelente razonamiento clínico';
  else if (sumScore >= 80) classification = 'Muy buen desempeño';
  else if (sumScore >= 70) classification = 'Buen desempeño';
  else if (sumScore >= 60) classification = 'Necesita reforzar conocimientos';
  else classification = 'Necesita mejorar su abordaje clínico';

  // Filtra posibles falsos positivos de la IA (betalactámicos seguros en alergia a penicilina u omisiones menores infladas como error crítico)
  const sanitizedAiCritical = (aiEval.criticalSafetyErrors || []).filter((errMsg) => {
    const nErr = normStr(errMsg);
    const baselineHasAllergyError = baseline.criticalSafetyErrors.some((b) =>
      normStr(b).includes('alergi') || normStr(b).includes('anafilax')
    );
    if (
      (nErr.includes('betalactam') || nErr.includes('penicilin') || nErr.includes('carbapenem') || nErr.includes('meropenem')) &&
      !baselineHasAllergyError
    ) {
      return false;
    }
    if (!hasImmediateVitalThreat(caseData)) {
      const looksLikeMinorOmission =
        /\b(omiti|falto|no solicito|no registro|estudio|diferencial|justificacion|seguimiento|dosis|duracion|anamnesis|exploracion)\b/.test(
          nErr
        ) &&
        !/\b(alergi|anafilax|potasio|adrenalina|metotrexato|antiagregante|broncoespasmo|depresion respiratoria|wernicke|hemorragia)\b/.test(
          nErr
        );
      if (looksLikeMinorOmission) {
        return false;
      }
    }
    return true;
  });

  const mergedCritical = Array.from(
    new Set([...sanitizedAiCritical, ...baseline.criticalSafetyErrors])
  );

  return {
    ...baseline,
    ...aiEval,
    totalScore: sumScore,
    classification,
    breakdown: mergedBreakdown,
    criticalSafetyErrors: mergedCritical,
    categoryDetails: {
      anamnesis: qCount === 0 ? baseline.categoryDetails!.anamnesis : (aiEval.categoryDetails?.anamnesis?.whyScore ? aiEval.categoryDetails.anamnesis : baseline.categoryDetails!.anamnesis),
      physicalExam: examsCount === 0 ? baseline.categoryDetails!.physicalExam : (aiEval.categoryDetails?.physicalExam?.whyScore ? aiEval.categoryDetails.physicalExam : baseline.categoryDetails!.physicalExam),
      studiesInterpretation: studiesCount === 0 ? baseline.categoryDetails!.studiesInterpretation : (aiEval.categoryDetails?.studiesInterpretation?.whyScore ? aiEval.categoryDetails.studiesInterpretation : baseline.categoryDetails!.studiesInterpretation),
      primaryDiagnosis: !hasDiag ? baseline.categoryDetails!.primaryDiagnosis : (aiEval.categoryDetails?.primaryDiagnosis?.whyScore ? aiEval.categoryDetails.primaryDiagnosis : baseline.categoryDetails!.primaryDiagnosis),
      differentialDiagnoses: !hasDiffs ? baseline.categoryDetails!.differentialDiagnoses : (aiEval.categoryDetails?.differentialDiagnoses?.whyScore ? aiEval.categoryDetails.differentialDiagnoses : baseline.categoryDetails!.differentialDiagnoses),
      treatment: !hasTreat ? baseline.categoryDetails!.treatment : (aiEval.categoryDetails?.treatment?.whyScore ? aiEval.categoryDetails.treatment : baseline.categoryDetails!.treatment),
      safetyAndConduct:
        (!hasDiag && !hasTreat) ||
        mergedCritical.length > 0 ||
        baseline.rationalUseAudit?.referralTriageVerdict !== 'correcto'
          ? baseline.categoryDetails!.safetyAndConduct
          : aiEval.categoryDetails?.safetyAndConduct?.whyScore
            ? aiEval.categoryDetails.safetyAndConduct
            : baseline.categoryDetails!.safetyAndConduct,
    },
    differentialExplanations:
      aiEval.differentialExplanations && aiEval.differentialExplanations.length > 0
        ? aiEval.differentialExplanations
        : baseline.differentialExplanations,
    rationalUseAudit: baseline.rationalUseAudit,
    evaluationFrameworkLabel: baseline.evaluationFrameworkLabel,
    recognizedEquivalents: baseline.recognizedEquivalents,
    statAudit: baseline.statAudit,
    userSummary: baseline.userSummary,
    feedback: {
      diagnosisAccuracyComment: aiEval.feedback?.diagnosisAccuracyComment || baseline.feedback.diagnosisAccuracyComment,
      reasoningEvaluation: aiEval.feedback?.reasoningEvaluation || baseline.feedback.reasoningEvaluation,
      differentialEvaluation: aiEval.feedback?.differentialEvaluation || baseline.feedback.differentialEvaluation,
      workupCritique: aiEval.feedback?.workupCritique || baseline.feedback.workupCritique,
      treatmentCritique: aiEval.feedback?.treatmentCritique || baseline.feedback.treatmentCritique,
      pedagogicalPearls:
        aiEval.feedback?.pedagogicalPearls && aiEval.feedback.pedagogicalPearls.length > 0
          ? aiEval.feedback.pedagogicalPearls
          : baseline.feedback.pedagogicalPearls,
      guidelinesSummary: aiEval.feedback?.guidelinesSummary || baseline.feedback.guidelinesSummary,
    },
  };
}

export type PatientOutcomeStatus =
  | 'saved'
  | 'stabilized_morbidity'
  | 'upset_complaint'
  | 'critical_morbidity'
  | 'deceased';

export interface DramaticOutcome {
  status: PatientOutcomeStatus;
  badgeLabel: string;
  headline: string;
  sceneNarrative: string;
  patientQuote?: string;
  vitalMonitorStatus: string;
  clinicalPostscript: string;
}

/**
 * Determina el desenlace dramático hospitalario del paciente previo a mostrar
 * el puntaje y la retroalimentación académica.
 */
export function determineClinicalOutcome(
  evaluation: EvaluationResult,
  caseData: ClinicalCase
): DramaticOutcome {
  const name = caseData.patientInfo.name;
  const triage = caseData.patientInfo.triageLevel;
  const vitalThreat = hasImmediateVitalThreat(caseData);
  const unstableBaseline = hasUnstableBaselineVitals(caseData);
  const expectedHosp = caseData.solution?.optimalTreatment?.hospitalizationDecision || '';
  const isOutpatientCase = expectedHosp === 'Ambulatorio';

  const score = evaluation.totalScore;
  const allSafetyErrors = evaluation.criticalSafetyErrors || [];
  const lethalErrors = allSafetyErrors.filter((e) => isLethalSafetyError(e, caseData));
  const nonLethalErrors = allSafetyErrors.filter((e) => !isLethalSafetyError(e, caseData));
  const hasLethalError = lethalErrors.length > 0;
  const hasAnySafetyError = allSafetyErrors.length > 0;

  const questionsAsked = evaluation.userSummary?.questionCount ?? 0;
  const examsDone = evaluation.userSummary?.unlockedExamsNames.length ?? 0;
  const noWorkDone =
    score <= 15 ||
    (!evaluation.userSummary?.primaryDiagnosis && (evaluation.userSummary?.pharmacologicalPlan.length || 0) === 0);

  const finalVitals = evaluation.userSummary?.finalVitalSigns || caseData.vitalSigns;
  const realVitalsLine = finalVitals
    ? `PA: ${finalVitals.bloodPressure.split(' ')[0]} mmHg · FC: ${finalVitals.heartRate} lpm · FR: ${finalVitals.respiratoryRate} rpm · SpO₂: ${finalVitals.oxygenSaturation}%`
    : 'PA y FC estables · SatO₂ 98% · Sin compromiso vital agudo';

  // 1. Fallecimiento (Código Azul): ÚNICAMENTE ante amenaza vital real + error potencialmente letal o abandono en emergencia crítica
  if (
    vitalThreat &&
    (hasLethalError || noWorkDone || (score < 30 && (/\bNivel I\b/.test(triage) || unstableBaseline)))
  ) {
    return {
      status: 'deceased',
      badgeLabel: 'CÓDIGO AZUL · SALA DE CHOQUE',
      headline: `Desenlace Fatal: ${name} ha fallecido`,
      sceneNarrative: hasLethalError
        ? `Minutos después de iniciar la conducta prescrita, ${name} presentó colapso hemodinámico súbito refractario e insuficiencia orgánica aguda debido a su compromiso crítico basal y la contraindicación aplicada. A pesar de 30 minutos de maniobras avanzadas de reanimación, el monitor mostró asistolia irreversible.`
        : `Debido a la ausencia o demora crítica en las intervenciones salvadoras requeridas para su estado de choque/emergencia vital, ${name} evolucionó hacia parada cardiorrespiratoria irreversible en sala de choque.`,
      vitalMonitorStatus: 'PA: 0/0 mmHg · FC: 0 lpm (Asistolia) · SatO2: --%',
      clinicalPostscript: 'Se declara hora oficial de defunción y el caso pasa a sesión de comité de morbimortalidad hospitalaria.',
    };
  }

  // 2. Complicación Grave / Rescate Hospitalario (proporcional al paciente real)
  if (hasLethalError || (vitalThreat && score < 48)) {
    return {
      status: 'critical_morbidity',
      badgeLabel: 'ALERTA EN SALA · TRASLADO URGENTE A UCI',
      headline: `${name} sobrevivió con morbilidad grave`,
      sceneNarrative: `Durante las horas posteriores a tu valoración, ${name} sufrió una descompensación aguda severa que obligó al equipo de guardia a intervenir de emergencia y trasladar al paciente a la Unidad de Cuidados Intensivos. Aunque se logró preservar su vida, enfrentará secuelas clínicas prevenibles y estancia prolongada.`,
      patientQuote: 'El familiar aguarda angustiado en sala de espera tras el traslado urgente a terapia intensiva.',
      vitalMonitorStatus: unstableBaseline
        ? 'PA: Limítrofe bajo vigilancia estrecha · Monitorización continua en UCI'
        : `${realVitalsLine} · Monitorización intensiva en UCI`,
      clinicalPostscript: 'El paciente requerirá rehabilitación prolongada y vigilancia estricta de daño orgánico secundario.',
    };
  }

  // Error de conducta o manejo en caso agudo NO letal de entrada (ej. apendicitis egresada a casa o puntaje muy bajo en cuadro quirúrgico/hospitalario)
  if (!isOutpatientCase && (nonLethalErrors.length > 0 || score < 42)) {
    const dischargedHomeWrongly = nonLethalErrors.some((e) => normStr(e).includes('ambulatorio'));
    return {
      status: 'critical_morbidity',
      badgeLabel: dischargedHomeWrongly
        ? 'REINGRESO DE URGENCIA · COMPLICACIÓN PREVENIBLE'
        : 'EVOLUCIÓN COMPLICADA · MANEJO INCOMPLETO',
      headline: dischargedHomeWrongly
        ? `${name} reingresó por progresión clínica tras egreso temprano`
        : `${name} presentó complicación prevenible por manejo incompleto`,
      sceneNarrative: dischargedHomeWrongly
        ? `Horas después de recibir manejo ambulatorio, ${name} regresó a Urgencias con progresión de sus síntomas y mayor inflamación/dolor, requiriendo ingreso inmediato y resolución definitiva por el equipo de guardia. No presentó compromiso vital irreversible, pero su recuperación fue más compleja.`
        : `Aunque ${name} se mantuvo sin riesgo de muerte súbita, las omisiones diagnósticas o terapéuticas retrasaron el control definitivo del cuadro y provocaron una complicación local que prolongó su hospitalización.`,
      patientQuote: '"Doctor, regresé porque el dolor y las molestias empeoraron bastante en casa después de salir."',
      vitalMonitorStatus: `${realVitalsLine} · Ingreso hospitalario de rescate`,
      clinicalPostscript: 'El cuadro fue resuelto por el equipo de guardia sin desenlace fatal, aunque con morbilidad prevenible.',
    };
  }

  // Error terapéutico no letal en caso ambulatorio/estable (ej. corticoide tópico en tiña, antitusígeno en bronquiectasias, valproato)
  if (isOutpatientCase && hasAnySafetyError) {
    return {
      status: 'stabilized_morbidity',
      badgeLabel: 'ALERTA TERAPÉUTICA · RECONSULTA AMBULATORIA',
      headline: `${name} permanece estable, pero presentó efecto adverso o empeoramiento prevenible`,
      sceneNarrative: `Los signos vitales de ${name} se mantuvieron completamente estables y sin riesgo vital; sin embargo, la indicación terapéutica contraindicada en este cuadro clínico generó empeoramiento sintomático o riesgo farmacológico prevenible, motivando una reconsulta para corregir la prescripción.`,
      patientQuote: '"Me siento estable, doctor, pero la molestia no mejoró con lo que me recetaron y tuve que volver a revisión."',
      vitalMonitorStatus: realVitalsLine,
      clinicalPostscript: 'Sin compromiso vital ni ingreso hospitalario: requiere ajuste farmacológico dirigido y educación terapéutica.',
    };
  }

  // 3. Paciente Molesto / Inconforme (poca atención en anamnesis/examen o manejo superficial en cuadro moderado)
  if ((questionsAsked <= 2 || examsDone <= 1) && score < 76) {
    return {
      status: 'upset_complaint',
      badgeLabel: 'INCONFORMIDAD DEL PACIENTE EN CONSULTA',
      headline: `${name} se retira molesto y solicita segunda opinión`,
      sceneNarrative: `Al finalizar la consulta, ${name} percibió un interrogatorio demasiado breve o falta de exploración física exhaustiva antes de recibir indicaciones. Visiblemente frustrado e inseguro sobre su diagnóstico real, solicitó su expediente para acudir con otro especialista.`,
      patientQuote: '"Doctor, siento que casi no me escuchó ni me revisó lo suficiente... así no me voy tranquilo a mi casa."',
      vitalMonitorStatus: `${realVitalsLine} · Paciente consciente e inconforme`,
      clinicalPostscript: 'La relación médico-paciente y la minuciosidad semiológica determinan tanto la adherencia como la seguridad diagnóstica.',
    };
  }

  // 4. Estabilizado con Secuela Leve / Recuperación Tórpida (Puntaje intermedio 42–77)
  if (score < 78) {
    return {
      status: 'stabilized_morbidity',
      badgeLabel: 'EVOLUCIÓN PARCIAL · RECUPERACIÓN PROLONGADA',
      headline: `${name} evolucionó estable, pero con mejoría más lenta de lo esperado`,
      sceneNarrative: `Tras tu valoración, ${name} permaneció sin complicaciones graves; sin embargo, algunas omisiones en los estudios clave o ajustes en el esquema terapéutico retrasaron su alivio completo y requirieron seguimiento estrecho para completar el manejo.`,
      patientQuote: '"Me siento un poco mejor que cuando llegué, doctor, aunque todavía sigo con algunas molestias y tendré que volver a control."',
      vitalMonitorStatus: realVitalsLine,
      clinicalPostscript: 'El paciente evoluciona favorablemente tras ajustes terapéuticos, sin peligro vital.',
    };
  }

  // 5. Salvado Satisfactoriamente (Puntaje >= 78 y sin errores críticos)
  return {
    status: 'saved',
    badgeLabel: 'EVOLUCIÓN FAVORABLE · PACIENTE ESTABILIZADO',
    headline: isOutpatientCase
      ? `¡${name} recibió un manejo ambulatorio excelente!`
      : `¡${name} ha sido salvado satisfactoriamente!`,
    sceneNarrative: `Gracias a tu diagnóstico oportuno, criterio clínico preciso y esquema terapéutico acertado, ${name} respondió de manera excelente al manejo instaurado. Los parámetros clínicos evolucionaron favorablemente sin complicaciones ni secuelas.`,
    patientQuote: '"¡Muchísimas gracias, doctor! De verdad sentí que estaba en buenas manos desde el primer momento; ya me siento muchísimo mejor."',
    vitalMonitorStatus: realVitalsLine,
    clinicalPostscript: 'Desenlace clínico exitoso y seguro conforme a los estándares médicos internacionales.',
  };
}
