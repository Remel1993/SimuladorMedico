import {
  ClinicalCase,
  EvaluationResult,
  RubricCategoryDetail,
  UserEvaluationInput,
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
]);

function significantTokens(s: string): string[] {
  return normStr(s)
    .split(' ')
    .filter((w) => w.length >= 3 && !STOP_WORDS.has(w));
}

function tokenMatchRatio(userText: string, targetText: string): number {
  const tTokens = significantTokens(targetText);
  if (tTokens.length === 0) return 0;
  const uNorm = normStr(userText);
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

/**
 * Elimina cláusulas donde el médico indica explícitamente SUSPENDER, RETIRAR, EVITAR o NO USAR
 * un medicamento (por ejemplo: "Suspender Enalapril y Naproxeno de inmediato").
 */
function stripNegatedMedicationClauses(text: string): string {
  if (!text) return '';
  const noAccents = text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
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
    (expectedHosp.includes('UCI') || expectedHosp.includes('Hospitalización')) &&
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

  return errors;
}

const DRUG_SYNONYM_GROUPS: string[][] = [
  ['aspirina', 'acido acetilsalicilico', 'aas'],
  ['adrenalina', 'epinefrina'],
  ['paracetamol', 'acetaminofen'],
  ['salina', 'cloruro de sodio', 'fisiologica', 'cristaloides', 'hartmann', 'ringer'],
  ['hartmann', 'ringer lactato', 'lactato de ringer', 'cristaloides'],
  ['insulina', 'insulina rapida', 'insulina regular', 'insulina cristalina'],
  ['enoxaparina', 'heparina', 'hbpm'],
  ['levofloxacino', 'moxifloxacino', 'fluoroquinolona'],
  ['oxigeno', 'oxigenoterapia', 'o2'],
  ['lorazepam', 'diazepam', 'midazolam', 'benzodiacepina'],
  ['ticagrelor', 'prasugrel', 'clopidogrel', 'p2y12'],
  ['tramadol', 'buprenorfina', 'morfina', 'fentanilo'],
  ['dextrosa', 'glucosa', 'solucion glucosada'],
];

function matchesOptimalDrug(userRxText: string, expectedDrugLabel: string): boolean {
  const normExpected = normStr(expectedDrugLabel);
  if (!userRxText || !normExpected) return false;

  // Coincidencia directa por sinónimos farmacológicos equivalentes
  for (const group of DRUG_SYNONYM_GROUPS) {
    const expInGroup = group.some((syn) => normExpected.includes(syn));
    const userInGroup = group.some((syn) => userRxText.includes(syn));
    if (expInGroup && userInGroup) return true;
  }

  // Extraer alternativas separadas por " o ", "/", "+" o paréntesis
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
      if (hits / tokens.length >= 0.5) return true;
    }
  }

  return tokenMatchRatio(userRxText, expectedDrugLabel) >= 0.4;
}

function analyzeAnamnesisPillars(questions: string[] = []) {
  const joined = normStr(questions.join(' '));
  return [
    {
      label: 'Inicio, duración y cronología (o evolución del día previo)',
      hit: /cuando|desde|hora|dia anterior|ayer|anoche|empezo|inicio|evolucion|cuanto tiempo|subito/.test(joined),
    },
    {
      label: 'Localización, irradiación e intensidad del síntoma principal',
      hit: /donde|duele|dolor|irradia|corre|intensidad|fuerte|siente|caracteristica|molestia/.test(joined),
    },
    {
      label: 'Síntomas asociados y signos de alarma (fiebre, vómitos, disnea, sangrado)',
      hit: /fiebre|calentura|vomit|nausea|aire|respir|sangr|mareo|orina|diarrea|cabeza|mancha/.test(joined),
    },
    {
      label: 'Antecedentes patológicos, quirúrgicos y familiares',
      hit: /enfermedad|hipertension|diabetes|antecedente|operad|cirugia|familia|padece|sufre/.test(joined),
    },
    {
      label: 'Medicamentos actuales y alergias conocidas',
      hit: /medicament|pastilla|toma|tomo|remedio|alergi|penicilina|insulina/.test(joined),
    },
    {
      label: 'Hábitos, exposición epidemiológica o historia sexual/ginecológica',
      hit: /fuma|alcohol|viaj|zancudo|sexo|sexual|regla|menstrua|embaraz|pareja|trabajo|vive|comio/.test(joined),
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

  // 1. ANAMNESIS (0 a 15 pts) — Cero preguntas = 0 puntos
  const pillars = analyzeAnamnesisPillars(doctorQuestions);
  const coveredPillars = pillars.filter((p) => p.hit).map((p) => p.label);
  const missedPillars = pillars.filter((p) => !p.hit).map((p) => p.label);

  let anamScore = 0;
  if (qCount === 0) {
    anamScore = 0;
  } else if (doctorQuestions.length > 0) {
    if (coveredPillars.length === 0) {
      anamScore = 1; // Preguntas superficiales o fuera de tema clínico
    } else {
      anamScore = Math.min(
        15,
        Math.round(coveredPillars.length * 2.15 + Math.min(qCount, 6) * 0.35)
      );
    }
  } else {
    anamScore = Math.min(15, Math.round(qCount * 1.8));
  }

  const anamDetail: RubricCategoryDetail = {
    whyScore:
      qCount === 0
        ? 'Obtuviste 0/15 porque no realizaste ninguna pregunta al paciente durante la anamnesis.'
        : coveredPillars.length === 0 && doctorQuestions.length > 0
          ? `Realizaste ${qCount} intervención(es), pero ninguna exploró los pilares semiológicos del caso (${anamScore}/15 pts).`
          : `Realizaste ${qCount} pregunta(s) cubriendo ${coveredPillars.length} de 6 pilares semiológicos esenciales (${anamScore}/15 pts).`,
    strengths:
      coveredPillars.length > 0
        ? coveredPillars.map((c) => `Exploraste: ${c}`)
        : qCount > 0
          ? ['Iniciaste diálogo con el paciente, aunque faltó profundidad clínica.']
          : ['No se registraron preguntas en el interrogatorio clínico.'],
    missingOrImprove:
      missedPillars.length > 0
        ? missedPillars.map((m) => `Faltó interrogar sobre: ${m}`)
        : ['Interrogatorio muy completo; mantén siempre la verificación cronológica y de signos de alarma.'],
    expectedStandard:
      'Una anamnesis excelente (14-15 pts) indaga cronología exacta, semiología del síntoma, signos de alarma, antecedentes/alergias, fármacos previos y contexto epidemiológico o sexual.',
  };

  // 2. EXPLORACIÓN FÍSICA (0 a 15 pts) — Cero maniobras = 0 pts; penalización por "Explorar Todo" indiscriminado
  const unlockedExamIds = new Set(submission.unlockedExams || []);
  const allExams = caseData.physicalExamPool || [];
  const abnormalExams = allExams.filter((pe) => pe.isAbnormal);
  const foundAbnormalExams = abnormalExams.filter((pe) => unlockedExamIds.has(pe.id));
  const missedAbnormalExams = abnormalExams.filter((pe) => !unlockedExamIds.has(pe.id));
  const totalUnlockedExams = allExams.filter((pe) => unlockedExamIds.has(pe.id));
  const exploredAllBlindly =
    allExams.length >= 10 && totalUnlockedExams.length >= allExams.length - 1;

  let examScore = 0;
  if (totalUnlockedExams.length === 0) {
    examScore = 0;
  } else if (abnormalExams.length > 0) {
    if (foundAbnormalExams.length === 0) {
      examScore = Math.min(3, totalUnlockedExams.length); // Solo maniobras normales, falló los signos positivos
    } else {
      const recallRatio = foundAbnormalExams.length / abnormalExams.length;
      const selectiveBonus = !exploredAllBlindly && totalUnlockedExams.length >= 2 ? 2 : 0;
      const shotgunPenalty = exploredAllBlindly ? 3 : 0;
      examScore = Math.min(
        15,
        Math.max(1, Math.round(recallRatio * 13) + selectiveBonus - shotgunPenalty)
      );
    }
  } else {
    examScore = Math.min(15, totalUnlockedExams.length * 3);
  }

  const examDetail: RubricCategoryDetail = {
    whyScore:
      totalUnlockedExams.length === 0
        ? 'Obtuviste 0/15 porque no realizaste ninguna maniobra de exploración física al paciente.'
        : exploredAllBlindly
          ? `Desbloqueaste casi todo el catálogo físico (${totalUnlockedExams.length}/${allExams.length}) de forma indiscriminada; se aplicó ajuste por falta de priorización dirigida (${examScore}/15 pts).`
          : `Ejecutaste ${totalUnlockedExams.length} maniobra(s) dirigida(s) y detectaste ${foundAbnormalExams.length} de ${abnormalExams.length} hallazgo(s) alterados clave (${examScore}/15 pts).`,
    strengths:
      foundAbnormalExams.length > 0
        ? foundAbnormalExams.map((e) => `Hallazgo clave detectado: ${e.name}`)
        : totalUnlockedExams.length > 0
          ? [`Realizaste ${totalUnlockedExams.length} maniobra(s), aunque todas resultaron normales.`]
          : ['No se ejecutaron maniobras de exploración física.'],
    missingOrImprove: [
      ...missedAbnormalExams.map((e) => `Maniobra clave omitida: ${e.name} (${e.system})`),
      ...(exploredAllBlindly
        ? ['Evita pulsar "Explorar Todo" sin criterio; prioriza primero los sistemas comprometidos por la anamnesis (-3 pts).']
        : []),
    ],
    expectedStandard:
      'Se evalúa priorizar maniobras dirigidas a los sistemas sospechosos para detectar los signos positivos sin realizar exploración indiscriminada.',
  };
  if (examDetail.missingOrImprove.length === 0) {
    examDetail.missingOrImprove.push('Exploración física dirigida sobresaliente: captaste todos los signos clave.');
  }

  // 3. SELECCIÓN E INTERPRETACIÓN DE ESTUDIOS (0 a 15 pts) — Cero estudios = 0 pts; penalización por batería ciega
  const unlockedStudyIds = new Set(submission.unlockedStudies || []);
  const allStudies = caseData.studiesPool || [];
  const abnormalStudies = allStudies.filter((st) => st.isAbnormal);
  const foundAbnormalStudies = abnormalStudies.filter((st) => unlockedStudyIds.has(st.id));
  const missedAbnormalStudies = abnormalStudies.filter((st) => !unlockedStudyIds.has(st.id));
  const totalUnlockedStudies = allStudies.filter((st) => unlockedStudyIds.has(st.id));
  const orderedAllBlindly =
    allStudies.length >= 12 && totalUnlockedStudies.length >= allStudies.length - 2;
  const unnecessaryCount = Math.max(0, totalUnlockedStudies.length - foundAbnormalStudies.length - 3);

  let studyScore = 0;
  if (totalUnlockedStudies.length === 0) {
    studyScore = 0;
  } else if (abnormalStudies.length > 0) {
    if (foundAbnormalStudies.length === 0) {
      studyScore = Math.min(3, totalUnlockedStudies.length);
    } else {
      const ratio = foundAbnormalStudies.length / abnormalStudies.length;
      const excessPenalty = orderedAllBlindly ? 4 : Math.min(4, Math.floor(unnecessaryCount / 3));
      studyScore = Math.min(
        15,
        Math.max(1, Math.round(ratio * 14 + 1) - excessPenalty)
      );
    }
  } else {
    studyScore = Math.min(15, totalUnlockedStudies.length * 3);
  }

  const studyDetail: RubricCategoryDetail = {
    whyScore:
      totalUnlockedStudies.length === 0
        ? 'Obtuviste 0/15 porque no solicitaste ningún estudio de laboratorio, imagen o gabinete.'
        : orderedAllBlindly
          ? `Solicitaste prácticamente toda la batería hospitalaria (${totalUnlockedStudies.length}/${allStudies.length}) sin discriminación pre-test, recibiendo penalización por uso excesivo de recursos e irradiación (${studyScore}/15 pts).`
          : `Solicitaste ${totalUnlockedStudies.length} estudio(s) y acertaste en ${foundAbnormalStudies.length} de ${abnormalStudies.length} paraclínicos con alteraciones relevantes (${studyScore}/15 pts).`,
    strengths:
      foundAbnormalStudies.length > 0
        ? foundAbnormalStudies.map((s) => `Estudio pertinente solicitado: ${s.name}`)
        : totalUnlockedStudies.length > 0
          ? [`Solicitaste ${totalUnlockedStudies.length} estudio(s), pero ninguno detectó las alteraciones clave del cuadro.`]
          : ['No se solicitaron estudios complementarios.'],
    missingOrImprove: [
      ...missedAbnormalStudies.slice(0, 5).map((s) => `Faltó solicitar estudio con hallazgo clave: ${s.name}`),
      ...(orderedAllBlindly || unnecessaryCount >= 4
        ? ['Se solicitaron estudios innecesarios o irradiantes sin justificación clínica ("escopetazo diagnóstico").']
        : []),
    ],
    expectedStandard: `Abordaje recomendado por guías: ${(solution.recommendedWorkup || []).slice(0, 4).join(' · ') || 'Estudios dirigidos de confirmación y estratificación de gravedad.'}`,
  };
  if (studyDetail.missingOrImprove.length === 0) {
    studyDetail.missingOrImprove.push('Excelente selección racional de estudios confirmatorios y de gravedad.');
  }

  // 4. DIAGNÓSTICO PRINCIPAL Y RAZONAMIENTO (0 a 25 pts) — Vacío o irrelevante = 0-2 pts
  const userDiag = submission.primaryDiagnosis || '';
  const correctDiag = solution.correctDiagnosis || '';
  const diagMatchRatio = tokenMatchRatio(userDiag, correctDiag);
  const diffHitRatio = Math.max(
    0,
    ...(solution.differentialDiagnoses || []).map((d) => tokenMatchRatio(userDiag, d))
  );
  const justifLen = (submission.clinicalJustification || '').trim().length;
  const justifBonus = justifLen >= 60 ? 2 : justifLen >= 25 ? 1 : 0;

  let diagScore = 0;
  if (!userDiag.trim()) {
    diagScore = 0;
  } else if (diagMatchRatio >= 0.75) {
    diagScore = Math.min(25, 23 + justifBonus);
  } else if (diagMatchRatio >= 0.45) {
    diagScore = Math.min(21, 18 + justifBonus);
  } else if (diagMatchRatio >= 0.25 || diffHitRatio >= 0.45) {
    diagScore = Math.min(14, 11 + justifBonus);
  } else {
    diagScore = justifLen >= 40 ? 2 : 0; // Diagnóstico incorrecto sin fundamento no suma puntos gratuitos
  }

  const diagDetail: RubricCategoryDetail = {
    whyScore: !userDiag.trim()
      ? 'Obtuviste 0/25 porque dejaste en blanco el diagnóstico principal.'
      : diagMatchRatio >= 0.75
        ? `Tu diagnóstico ("${userDiag}") coincide de forma precisa con la patología real y su clasificación (${diagScore}/25 pts).`
        : diagMatchRatio >= 0.45
          ? `Tu diagnóstico ("${userDiag}") identificó el proceso patológico central, pero faltó mayor especificidad clínica (gravedad, fase o etiología) frente a "${correctDiag}" (${diagScore}/25 pts).`
          : diffHitRatio >= 0.45
            ? `Tu propuesta ("${userDiag}") corresponde a un diagnóstico diferencial cercano, pero no al diagnóstico definitivo real "${correctDiag}" (${diagScore}/25 pts).`
            : `Tu propuesta ("${userDiag}") es incorrecta respecto al diagnóstico definitivo "${correctDiag}" (${diagScore}/25 pts).`,
    strengths: [
      ...(diagMatchRatio >= 0.45 ? [`Aproximación clínica acertada hacia "${correctDiag}".`] : []),
      ...(justifLen >= 40 ? ['Redactaste una justificación clínica para argumentar tu hipótesis.'] : []),
    ],
    missingOrImprove: [
      ...(diagMatchRatio < 0.75
        ? [`El diagnóstico completo esperado es: "${correctDiag}". Especifica etiología, fase clínica o signos de alarma.`]
        : []),
      ...(justifLen < 40
        ? ['Faltó redactar una justificación clínica que integre anamnesis, examen físico y paraclínicos.']
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

  // 5. DIAGNÓSTICOS DIFERENCIALES (0 a 10 pts) — Sin diferenciales = 0 pts
  const userDiffs = (submission.differentialDiagnoses || []).filter((d) => d.trim().length >= 3);
  const expectedDiffs = solution.differentialDiagnoses || [];
  const matchedDiffs: string[] = [];
  const missedDiffs: string[] = [];

  for (const expD of expectedDiffs) {
    const matched = userDiffs.some((uD) => tokenMatchRatio(uD, expD) >= 0.35);
    if (matched) matchedDiffs.push(expD);
    else missedDiffs.push(expD);
  }

  let diffScore = 0;
  if (userDiffs.length === 0) {
    diffScore = 0;
  } else if (expectedDiffs.length > 0) {
    if (matchedDiffs.length === 0) {
      diffScore = 1; // Escribió diagnósticos no pertinentes al síndrome
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

  // 6. TRATAMIENTO Y RÉGIMEN FARMACOLÓGICO (0 a 15 pts) — Sin fármacos ni medidas = 0 pts
  const userRx = (submission.pharmacologicalPlan || []).filter((r) => (r.drug || '').trim().length >= 2);
  const optRx = solution.optimalTreatment?.pharmacological || [];
  const userRxText = normStr(userRx.map((r) => `${r.drug} ${r.dose} ${r.route}`).join(' '));
  const matchedDrugs: string[] = [];
  const missedDrugs: string[] = [];

  for (const rx of optRx) {
    if (matchesOptimalDrug(userRxText, rx.drug)) matchedDrugs.push(`${rx.drug} (${rx.dose})`);
    else missedDrugs.push(`${rx.drug} — ${rx.dose}, ${rx.route}, ${rx.frequency} (${rx.duration})`);
  }

  const completeRxCount = userRx.filter(
    (r) => (r.drug || '').trim() && (r.dose || '').trim() && (r.route || '').trim() && (r.frequency || '').trim()
  ).length;
  const hasGeneralMeasures = (submission.generalMeasures || '').trim().length >= 15;

  let treatScore = 0;
  if (userRx.length === 0 && !hasGeneralMeasures) {
    treatScore = 0;
  } else if (optRx.length > 0) {
    const drugRatio = matchedDrugs.length / optRx.length;
    const posologyBonus =
      matchedDrugs.length > 0 && completeRxCount > 0
        ? completeRxCount === userRx.length
          ? 3
          : 1
        : 0;
    const generalBonus = hasGeneralMeasures ? 2 : 0;
    const effortFloor = userRx.length > 0 && matchedDrugs.length === 0 ? 1 : 0;
    treatScore = Math.min(15, Math.round(drugRatio * 10) + posologyBonus + generalBonus + effortFloor);
  } else {
    treatScore = Math.min(15, userRx.length * 4 + (hasGeneralMeasures ? 2 : 0));
  }

  const criticalSafetyErrors = checkCriticalSafetyErrors(submission, caseData);
  if (criticalSafetyErrors.length > 0) {
    treatScore = Math.min(treatScore, 3);
  }

  // Nota docente farmacológica cuando se prescriben alternativas seguras en alergia a penicilina
  const allergiesNormForNote = normStr((caseData.background?.allergies || []).join(' '));
  const pharmacologyNotes: string[] = [];
  if (allergiesNormForNote.includes('penicilin') && criticalSafetyErrors.length === 0) {
    if (/\b(meropenem|imipenem|ertapenem)\b/.test(userRxText)) {
      pharmacologyNotes.push(
        'Nota farmacológica: El uso de un carbapenémico (ej. meropenem) tiene <1% de reactividad cruzada en alergia a penicilina (guías AAAAI 2022) y NO se penaliza como error anafiláctico; sin embargo, para infecciones comunitarias sin riesgo MDR se prefiere un esquema dirigido (como levofloxacino).'
      );
    }
    if (/\b(eritromicina|azitromicina|claritromicina)\b/.test(userRxText)) {
      pharmacologyNotes.push(
        'Nota farmacológica: Los macrólidos (eritromicina/azitromicina) son seguros ante alergia a penicilina, pero por la resistencia neumocócica (~25-40%) en paciente hospitalizado grave se prefiere fluoroquinolona respiratoria (Levofloxacino 750 mg IV).'
      );
    }
  }

  const treatDetail: RubricCategoryDetail = {
    whyScore:
      userRx.length === 0 && !hasGeneralMeasures
        ? 'Obtuviste 0/15 porque no propusiste fármacos ni medidas generales terapéuticas.'
        : `Indicaste ${userRx.length} fármaco(s) (${completeRxCount} con posología completa) y acertaste en ${matchedDrugs.length} de ${optRx.length} pilares farmacológicos recomendados (${treatScore}/15 pts).`,
    strengths: [
      ...matchedDrugs.map((d) => `Indicación terapéutica acertada: ${d}`),
      ...(hasGeneralMeasures ? ['Incluiste medidas generales de soporte clínico.'] : []),
    ],
    missingOrImprove: [
      ...missedDrugs.map((d) => `Faltó indicar según guía clínica: ${d}`),
      ...pharmacologyNotes,
      ...(userRx.length > 0 && completeRxCount < userRx.length
        ? ['Completa siempre dosis exacta, vía, frecuencia y duración de cada fármaco prescrito.']
        : []),
      ...(!hasGeneralMeasures
        ? ['Faltó detallar medidas generales (hidratación/ayuno/oxigenoterapia/monitorización/reposo según el caso).']
        : []),
    ],
    expectedStandard: `Esquema ideal: ${optRx.map((r) => `${r.drug} ${r.dose} (${r.route}, ${r.frequency})`).join(' + ')}.`,
  };
  if (treatDetail.strengths.length === 0) {
    treatDetail.strengths.push('Sin coincidencias con los fármacos de primera línea recomendados.');
  }
  if (treatDetail.missingOrImprove.length === 0) {
    treatDetail.missingOrImprove.push('Prescripción farmacológica completa, segura y bien dosificada.');
  }

  // 7. CONDUCTA, TRIAGE Y SEGURIDAD DEL PACIENTE (0 a 5 pts)
  const expectedHosp = solution.optimalTreatment?.hospitalizationDecision || '';
  const hospMatch =
    normStr(submission.hospitalizationDecision) === normStr(expectedHosp) ||
    (expectedHosp.includes('UCI') && submission.hospitalizationDecision.includes('Hospitalización'));
  const hasReferral = (submission.referralCriteria || '').trim().length >= 10;
  const hasFollowUp = (submission.followUpPlan || '').trim().length >= 10;
  const noMeaningfulWorkDone = !userDiag.trim() && userRx.length === 0 && !hasGeneralMeasures;

  let safetyScore = 0;
  if (noMeaningfulWorkDone || criticalSafetyErrors.length > 0) {
    safetyScore = 0;
  } else {
    safetyScore = (hospMatch ? 3 : 0) + (hasReferral ? 1 : 0) + (hasFollowUp ? 1 : 0);
  }

  const safetyDetail: RubricCategoryDetail = {
    whyScore: noMeaningfulWorkDone
      ? 'Obtuviste 0/5 porque no se registró diagnóstico ni plan terapéutico, dejando al paciente sin conducta médica definida.'
      : criticalSafetyErrors.length > 0
        ? 'Obtuviste 0/5 por cometer un error crítico de seguridad que pone en peligro la vida del paciente.'
        : `Nivel de atención propuesto: "${submission.hospitalizationDecision || 'Sin especificar'}" vs esperado "${expectedHosp}" (${safetyScore}/5 pts).`,
    strengths: [
      ...(hospMatch && !noMeaningfulWorkDone ? [`Decisión correcta de destino clínico (${expectedHosp}).`] : []),
      ...(!noMeaningfulWorkDone && criticalSafetyErrors.length === 0
        ? ['Sin errores farmacológicos potencialmente mortales ni iatrogenia grave.']
        : []),
      ...(hasReferral ? ['Definiste criterios de referencia o interconsulta.'] : []),
      ...(hasFollowUp ? ['Definiste plan de seguimiento y vigilancia.'] : []),
    ],
    missingOrImprove: [
      ...criticalSafetyErrors,
      ...(noMeaningfulWorkDone
        ? ['Registra al menos un diagnóstico presuntivo y conducta clínica antes de finalizar la atención.']
        : []),
      ...(!hospMatch
        ? [`El destino clínico correcto por gravedad es "${expectedHosp}" (seleccionaste "${submission.hospitalizationDecision || 'Ninguno'}").`]
        : []),
      ...(!hasReferral ? ['Faltó especificar criterios claros de referencia/interconsulta especializada o ingreso a UCI.'] : []),
      ...(!hasFollowUp ? ['Faltó detallar signos de alarma para revaloración y plan de seguimiento.'] : []),
    ],
    expectedStandard: `Conducta esperada: ${expectedHosp}. Seguimiento: ${solution.optimalTreatment?.followUp || 'Vigilancia clínica estrecha.'}`,
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
      reasoningEvaluation:
        justifLen >= 25
          ? `Tu justificación ("${submission.clinicalJustification.slice(0, 220)}") fue contrastada contra la fisiopatología de referencia: ${solution.pathophysiology}`
          : `No redactaste una justificación clínica amplia. Es fundamental explicar cómo los signos vitales (${caseData.vitalSigns.bloodPressure}, FC ${caseData.vitalSigns.heartRate}, Temp ${caseData.vitalSigns.temperature}°C), los hallazgos físicos y los paraclínicos convergen en "${solution.correctDiagnosis}".`,
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
  const hasTreat =
    (submission.pharmacologicalPlan || []).some((r) => (r.drug || '').trim().length >= 2) ||
    (submission.generalMeasures || '').trim().length >= 15;

  const capWithBaselineIfStrict = (aiVal: number | undefined, baseVal: number, maxVal: number, isEmpty: boolean) => {
    if (isEmpty) return 0;
    const raw = Math.min(maxVal, Math.max(0, Math.round(aiVal ?? baseVal)));
    // Evita que la IA infle demasiado cuando el desempeño objetivo es bajo (ej. escopetazo o diagnóstico erróneo)
    return Math.min(raw, Math.max(baseVal + 2, Math.round((raw + baseVal) / 2)));
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
          : Math.min(5, Math.max(0, Math.round(aiEval.breakdown?.safetyAndConduct ?? baseline.breakdown.safetyAndConduct))),
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

  // Filtra posibles falsos positivos de la IA (ej. culpar meropenem/eritromicina/aztreonam en alergia a penicilina cuando baseline objetivo no detectó error de alergia)
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
      safetyAndConduct: (!hasDiag && !hasTreat) || mergedCritical.length > 0 ? baseline.categoryDetails!.safetyAndConduct : (aiEval.categoryDetails?.safetyAndConduct?.whyScore ? aiEval.categoryDetails.safetyAndConduct : baseline.categoryDetails!.safetyAndConduct),
    },
    differentialExplanations:
      aiEval.differentialExplanations && aiEval.differentialExplanations.length > 0
        ? aiEval.differentialExplanations
        : baseline.differentialExplanations,
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
  const isCriticalTriage = triage.includes('Nivel I') || triage.includes('Nivel II') || caseData.mode === 'urgencias';
  const score = evaluation.totalScore;
  const hasSafetyError = evaluation.criticalSafetyErrors.length > 0;
  const questionsAsked = evaluation.userSummary?.questionCount ?? 0;
  const examsDone = evaluation.userSummary?.unlockedExamsNames.length ?? 0;
  const noWorkDone = score <= 15 || (!evaluation.userSummary?.primaryDiagnosis && (evaluation.userSummary?.pharmacologicalPlan.length || 0) === 0);

  // 1. Fallecimiento (Código Azul) por error crítico fatal o abandono en urgencia vital
  if ((hasSafetyError && isCriticalTriage) || (score < 32 && isCriticalTriage) || (noWorkDone && isCriticalTriage)) {
    return {
      status: 'deceased',
      badgeLabel: 'CÓDIGO AZUL · SALA DE CHOQUE',
      headline: `Desenlace Fatal: ${name} ha fallecido`,
      sceneNarrative: hasSafetyError
        ? `Minutos después de iniciar la conducta prescrita, ${name} presentó colapso hemodinámico súbito refractario e insuficiencia orgánica aguda. A pesar de 30 minutos de maniobras avanzadas de reanimación cardiopulmonar por el equipo de guardia, el monitor mostró asistolia irreversible.`
        : `Debido a la ausencia o demora crítica en las intervenciones salvadoras requeridas para su estado de emergencia, ${name} evolucionó hacia choque irreversible y parada cardiorrespiratoria en la sala de reanimación.`,
      vitalMonitorStatus: 'PA: 0/0 mmHg · FC: 0 lpm (Asistolia) · SatO2: --%',
      clinicalPostscript: 'Se declara hora oficial de defunción y el caso pasa a sesión de comité de morbimortalidad hospitalaria.',
    };
  }

  // 2. Complicación Grave / Ingreso de Rescate a UCI
  if (hasSafetyError || score < 48) {
    return {
      status: 'critical_morbidity',
      badgeLabel: 'ALERTA EN SALA · TRASLADO URGENTE A UCI',
      headline: `${name} sobrevivió con morbilidad grave`,
      sceneNarrative: `Durante las horas posteriores a tu valoración, ${name} sufrió una descompensación aguda severa que obligó al equipo de guardia a intervenir de emergencia y trasladar al paciente a la Unidad de Cuidados Intensivos. Aunque se logró preservar su vida, enfrentará secuelas clínicas prevenibles y estancia prolongada.`,
      patientQuote: 'El familiar aguarda angustiado en sala de espera tras el traslado urgente a terapia intensiva.',
      vitalMonitorStatus: 'PA: Limítrofe con soporte vasopresor · Monitorización invasiva continua en UCI',
      clinicalPostscript: 'El paciente requerirá rehabilitación prolongada y vigilancia estricta de daño orgánico secundario.',
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
      vitalMonitorStatus: 'Paciente consciente y molesto · Síntomas aún sin resolución clara',
      clinicalPostscript: 'La relación médico-paciente y la minuciosidad semiológica determinan tanto la adherencia como la seguridad diagnóstica.',
    };
  }

  // 4. Estabilizado con Secuela Leve / Recuperación Tórpida (Puntaje intermedio 48–77)
  if (score < 78) {
    return {
      status: 'stabilized_morbidity',
      badgeLabel: 'EVOLUCIÓN PARCIAL · RECUPERACIÓN PROLONGADA',
      headline: `${name} fue estabilizado, pero presenta evolución lenta`,
      sceneNarrative: `Tras recibir atención hospitalaria, ${name} logró superar el peligro inmediato; sin embargo, algunas omisiones en los estudios clave o ajustes en el esquema terapéutico retrasaron su mejoría completa y generaron molestias residuales que requerirán seguimiento estrecho.`,
      patientQuote: '"Me siento un poco mejor que cuando llegué, doctor, aunque todavía sigo con algunas molestias y tendré que quedarme unos días más."',
      vitalMonitorStatus: 'Signos vitales en estabilización progresiva bajo observación',
      clinicalPostscript: 'El paciente evoluciona favorablemente tras ajustes terapéuticos de guardia, pero con mayor estancia de la esperada.',
    };
  }

  // 5. Salvado Satisfactoriamente (Puntaje >= 78 y sin errores críticos)
  return {
    status: 'saved',
    badgeLabel: 'EVOLUCIÓN FAVORABLE · PACIENTE ESTABILIZADO',
    headline: `¡${name} ha sido salvado satisfactoriamente!`,
    sceneNarrative: `Gracias a tu diagnóstico oportuno, criterio clínico preciso y esquema terapéutico acertado, ${name} respondió de manera excelente al manejo instaurado. Los parámetros hemodinámicos y respiratorios se normalizaron progresivamente sin complicaciones ni secuelas.`,
    patientQuote: '"¡Muchísimas gracias, doctor! De verdad sentí que estaba en buenas manos desde el primer momento; ya me siento muchísimo mejor."',
    vitalMonitorStatus: 'PA y FC estabilizadas · SatO2 98% · Sin signos de alarma activos',
    clinicalPostscript: 'Desenlace clínico exitoso y seguro conforme a los estándares médicos internacionales.',
  };
}
