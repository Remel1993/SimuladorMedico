import { ClinicalCase, PhysicalExamFinding } from '../types/clinical';

/**
 * Catálogo Universal Estandarizado de Exploración Física y Maniobras Semiológicas.
 * Garantiza que todos los casos clínicos presenten un menú uniforme de maniobras
 * en los 7 sistemas anatómicos (incluyendo pruebas situacionales como Torniquete,
 * Psoas/Obturador, Signos Meníngeos, Murphy, Nikolsky, Homans y Clonus)
 * para evitar que el título de una maniobra revele pistas diagnósticas antes de realizarla.
 */
export const STANDARD_PHYSICAL_EXAMS: PhysicalExamFinding[] = [
  {
    id: 'std-pe-general',
    system: 'General',
    name: 'Inspección general, facies y estado de hidratación',
    finding:
      'Paciente consciente y orientado en las tres esferas. Mucosas orales hidratadas, turgencia cutánea conservada, sin palidez marcada ni cianosis.',
    isAbnormal: false,
  },
  {
    id: 'std-pe-head-eyes',
    system: 'Cabeza y Cuello',
    name: 'Exploración ocular, pupilas, mucosas y vía aérea superior',
    finding:
      'Pupilas isocóricas normorreactivas a la luz (3 mm). Conjuntivas normocoloreadas sin hemorragias. Orofaringe normal, encías sin sangrado ni lesiones.',
    isAbnormal: false,
  },
  {
    id: 'std-pe-neck-thyroid',
    system: 'Cabeza y Cuello',
    name: 'Cuello, ingurgitación yugular, pulsos carotídeos y ganglios',
    finding:
      'Cuello cilíndrico simétrico, sin ingurgitación yugular a 45°. Pulsos carotídeos simétricos sin soplos. Sin adenopatías cervicales palpables.',
    isAbnormal: false,
  },
  {
    id: 'std-pe-thorax',
    system: 'Tórax y Pulmones',
    name: 'Inspección, mecánica ventilatoria y auscultación pulmonar',
    finding:
      'Tórax simétrico con expansibilidad conservada sin tiraje intercostal. Murmullo vesicular audible de forma bilateral, sin estertores, sibilancias ni matidez.',
    isAbnormal: false,
  },
  {
    id: 'std-pe-cardio',
    system: 'Cardiovascular',
    name: 'Auscultación cardíaca, pulsos periféricos y perfusión distal',
    finding:
      'Ruidos cardíacos rítmicos de buen tono e intensidad, sin soplos ni tercer ruido (R3). Pulsos periféricos presentes y simétricos; llenado capilar < 2 segundos.',
    isAbnormal: false,
  },
  {
    id: 'std-pe-abd-general',
    system: 'Abdomen',
    name: 'Palpación abdominal superficial/profunda y ruidos hidroaéreos',
    finding:
      'Abdomen blando, depresible, no doloroso a la palpación superficial ni profunda. Ruidos hidroaéreos presentes y normoactivos. Sin masas ni visceromegalias.',
    isAbnormal: false,
  },
  {
    id: 'std-pe-abd-murphy-liver',
    system: 'Abdomen',
    name: 'Maniobra de Murphy y delimitación hepatoesplénica',
    finding:
      'Borde hepático no palpable por debajo del reborde costal derecho. Bazo no palpable. Signo de Murphy negativo (sin interrupción inspiratoria dolorosa).',
    isAbnormal: false,
  },
  {
    id: 'std-pe-abd-appendicular',
    system: 'Abdomen',
    name: 'Maniobras de irritación peritoneal, Psoas, Obturador y McBurney',
    finding:
      'Sin defensa muscular ni dolor al rebote (Blumberg negativo). Puntos de McBurney y Rovsing negativos. Maniobras del psoas y obturador negativas.',
    isAbnormal: false,
  },
  {
    id: 'std-pe-neuro-core',
    system: 'Neurológico',
    name: 'Estado de conciencia, pares craneales y fuerza muscular',
    finding:
      'Glasgow 15/15. Pares craneales I-XII íntegros y simétricos. Fuerza muscular 5/5 en las cuatro extremidades.',
    isAbnormal: false,
  },
  {
    id: 'std-pe-neuro-meningeal',
    system: 'Neurológico',
    name: 'Signos meníngeos (Rigidez de nuca, Kernig y Brudzinski)',
    finding:
      'Cuello flexible sin resistencia dolorosa a la flexión pasiva. Signos de Kernig y Brudzinski negativos.',
    isAbnormal: false,
  },
  {
    id: 'std-pe-neuro-reflexes',
    system: 'Neurológico',
    name: 'Reflejos osteotendinosos, tono muscular, clonus y sensibilidad',
    finding:
      'Reflejos osteotendinosos (++/++++), simétricos, sin hiperreflexia ni clonus aquiliano. Sensibilidad superficial y profunda conservada.',
    isAbnormal: false,
  },
  {
    id: 'std-pe-skin-tourniquet',
    system: 'Osteomuscular y Piel',
    name: 'Prueba del torniquete (fragilidad capilar) e inspección de petequias',
    finding:
      'Prueba del torniquete negativa (< 10 petequias en el cuadrante de 2.5 x 2.5 cm). Sin petequias ni equimosis espontáneas.',
    isAbnormal: false,
  },
  {
    id: 'std-pe-skin-nikolsky',
    system: 'Osteomuscular y Piel',
    name: 'Inspección cutánea integral, mucosas y signo de Nikolsky',
    finding:
      'Piel íntegra, normocoloreada, sin exantemas, ampollas, habones urticariformes ni lesiones necróticas. Signo de Nikolsky negativo.',
    isAbnormal: false,
  },
  {
    id: 'std-pe-limbs-vascular',
    system: 'Osteomuscular y Piel',
    name: 'Exploración de extremidades, compartimentos y signos venosos (Homans)',
    finding:
      'Extremidades simétricas sin edema con fóvea, sin aumento de tensión compartimental ni dolor al estiramiento pasivo. Signo de Homans negativo.',
    isAbnormal: false,
  },
];

function normPe(text: string): string {
  return (text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseBp(bp?: string): { sys: number; dia: number } {
  const m = (bp || '').match(/(\d+)\s*\/\s*(\d+)/);
  return {
    sys: m ? parseInt(m[1], 10) : 120,
    dia: m ? parseInt(m[2], 10) : 80,
  };
}

/**
 * Limpia títulos de maniobras específicas del caso para eliminar palabras que delaten el diagnóstico.
 */
function sanitizePhysicalExamTitle(name: string): string {
  const lower = normPe(name);

  if (lower.includes('torniquete') || lower.includes('rumpel')) {
    return 'Prueba del torniquete (fragilidad capilar) e inspección de petequias';
  }
  if (lower.includes('hepatomegalia') || lower.includes('murphy')) {
    return 'Palpación abdominal profunda, Murphy y delimitación hepática';
  }
  if (lower.includes('levine')) {
    return 'Inspección general, facies y actitud del paciente';
  }
  if (lower.includes('pseudoperitonitis') || lower.includes('diabetica')) {
    return 'Palpación abdominal superficial y profunda';
  }
  if (lower.includes('hunter') || lower.includes('clonus')) {
    return 'Reflejos osteotendinosos, tono muscular, clonus y sensibilidad';
  }
  if (lower.includes('angioedema')) {
    return 'Exploración de vía aérea superior y orofaringe';
  }
  if (lower.includes('compartimental')) {
    return 'Exploración musculoesquelética, tensión y estiramiento pasivo';
  }
  if (lower.includes('nikolsky')) {
    return 'Inspección cutánea integral, mucosas y signo de Nikolsky';
  }
  if (lower.includes('homans')) {
    return 'Exploración de extremidades, compartimentos y signos venosos (Homans)';
  }
  if (lower.includes('psoas') || lower.includes('obturador') || lower.includes('mcburney')) {
    return 'Maniobras de irritación peritoneal, Psoas, Obturador y McBurney';
  }
  if (lower.includes('meningeo') || lower.includes('kernig')) {
    return 'Signos meníngeos (Rigidez de nuca, Kernig y Brudzinski)';
  }

  return name;
}

/**
 * Determina si una maniobra nativa del caso ya cubre el dominio semiológico de un examen estándar
 * para evitar tarjetas duplicadas o hallazgos normales contradictorios.
 */
function isStdExamCoveredByNative(
  stdExam: PhysicalExamFinding,
  nativeExams: PhysicalExamFinding[]
): boolean {
  const combinedText = (pe: PhysicalExamFinding) => `${normPe(pe.name)} ${normPe(pe.finding)}`;

  switch (stdExam.id) {
    case 'std-pe-general':
      return nativeExams.some(
        (pe) =>
          pe.system === 'General' ||
          /\b(?:inspeccion general|aspecto general|estado general|hidratacion|estado hidrico|triangulo|actitud|facies)\b/.test(
            normPe(pe.name)
          )
      );

    case 'std-pe-head-eyes':
      return nativeExams.some((pe) =>
        /\b(?:ocular[a-z]*|ojos|pupila[a-z]*|conjuntiv[a-z]*|esclera[a-z]*|fondo de ojo|orl|orofaring[a-z]*|faring[a-z]*|amigdal[a-z]*|rinoscop[a-z]*|otoscop[a-z]*|oido[a-z]*|cavidad oral|lengua|via aerea|laring[a-z]*|senos paranasales|mucosas oral[a-z]*|facial)\b/.test(
          normPe(pe.name)
        )
      );

    case 'std-pe-neck-thyroid':
      return nativeExams.some((pe) =>
        /\b(?:cuello|cervical[a-z]*|yugular[a-z]*|carotid[a-z]*|tiroid[a-z]*|gangli[a-z]*|adenopatia[a-z]*|traquea|palpacion cervical)\b/.test(
          normPe(pe.name)
        )
      );

    case 'std-pe-thorax':
      return nativeExams.some(
        (pe) =>
          pe.system === 'Tórax y Pulmones' ||
          /\b(?:torax|toracic[a-z]*|pulmon[a-z]*|cardiopulmonar[a-z]*|respiratori[a-z]*|ventilatori[a-z]*|murmullo|patron respiratorio)\b/.test(
            normPe(pe.name)
          )
      );

    case 'std-pe-cardio':
      return nativeExams.some(
        (pe) =>
          pe.system === 'Cardiovascular' ||
          /\b(?:cardiac[a-z]*|cardiovasc[a-z]*|cardiopulmonar[a-z]*|precord[a-z]*|ruidos|beck|hemodinamic[a-z]*|pulsos distales|llenado capilar)\b/.test(
            normPe(pe.name)
          )
      );

    case 'std-pe-abd-general':
      return nativeExams.some((pe) => {
        if (pe.system === 'Abdomen') return true;
        return /\b(?:abdom[a-z]*|epigastri[a-z]*|peritoneal[a-z]*|fosa iliaca|cuadrante|hipocondri[a-z]*|inguinal[a-z]*|suprapubic[a-z]*|punopercusion|tacto rectal)\b/.test(
          normPe(pe.name)
        );
      });

    case 'std-pe-abd-murphy-liver':
      return nativeExams.some((pe) =>
        /\b(?:murphy|hepat[a-z]*|higado|bazo|esplen[a-z]*|cuadrante superior derecho|hipocondrio derecho|costal derech[a-z]*)\b/.test(
          combinedText(pe)
        )
      );

    case 'std-pe-abd-appendicular':
      return nativeExams.some((pe) =>
        /\b(?:psoas|obturador|mcburney|rovsing|blumberg|peritoneal[a-z]*|rebote|defensa muscular|abdomen en tabla)\b/.test(
          combinedText(pe)
        )
      );

    case 'std-pe-neuro-core':
      return nativeExams.some((pe) =>
        /\b(?:conciencia|glasgow|pares craneales|fuerza|motor[a-z]*|motricidad|estado mental|esfera|dix hallpike|cerebel[a-z]*|radicular[a-z]*|phalen|tinel|marcha|sensitivo motora|neurologic[a-z]*)\b/.test(
          normPe(pe.name)
        )
      );

    case 'std-pe-neuro-meningeal':
      return nativeExams.some((pe) =>
        /\b(?:meninge[a-z]*|rigidez de nuca|kernig|brudzinski)\b/.test(combinedText(pe))
      );

    case 'std-pe-neuro-reflexes':
      return nativeExams.some((pe) => {
        const txt = combinedText(pe);
        return (
          /\b(?:reflejo[a-z]*|clonus|hunter|sensibilidad|sensitiv[a-z]*|vibratoria|osteotendinos[a-z]*|tono muscular|radicular[a-z]*|phalen|tinel|marcha|neurologica completa|babinski|parestesia[a-z]*|hipoestesia|arreflexia|hiperreflexia|temblor)\b/.test(
            txt
          ) ||
          (pe.system === 'Neurológico' &&
            pe.isAbnormal &&
            /\b(?:fuerza|paresia|debilidad|neuropatia)\b/.test(txt))
        );
      });

    case 'std-pe-skin-tourniquet':
      return nativeExams.some((pe) =>
        /\b(?:torniquete|rumpel|petequia[a-z]*|purpura|equimosis|cutanea completa|piel y perfusion|piel, faneras)\b/.test(
          combinedText(pe)
        )
      );

    case 'std-pe-skin-nikolsky':
      return nativeExams.some((pe) =>
        /\b(?:nikolsky|piel|cutane[a-z]*|dermatolog[a-z]*|exantema[a-z]*|lesion[a-z]*|herpes|tina|tinea|urticaria|habon[a-z]*|celulitis|erisipela|vulvovaginal|cicatrices|pliegues|ampolla[a-z]*|vesicula[a-z]*|eritema[a-z]*|hiperandrogenismo|acne)\b/.test(
          combinedText(pe)
        )
      );

    case 'std-pe-limbs-vascular':
      return nativeExams.some((pe) =>
        /\b(?:extremidad[a-z]*|miembro[a-z]*|pierna[a-z]*|tobillo[a-z]*|rodilla[a-z]*|cadera|pie|pies|mano|manos|compartiment[a-z]*|homans|edema|articular[a-z]*|musculoesquelet[a-z]*|lumbar|lasegue|fuerza muscular proximal|tibia|femur)\b/.test(
          combinedText(pe)
        )
      );

    default:
      return false;
  }
}

function getGlasgowBreakdown(glasgow: number): string {
  if (glasgow >= 15) return 'O4 V5 M6';
  if (glasgow === 14) return 'O4 V4 M6 — desorientación o confusión leve';
  if (glasgow === 13) return 'O3 V4 M6 — apertura ocular al llamado verbal y respuesta verbal confusa';
  if (glasgow === 12) return 'O3 V4 M5 — somnolencia/letargo con lenguaje confuso y localización de estímulos';
  if (glasgow === 11) return 'O3 V3 M5 — letargo marcado con lenguaje inapropiado';
  if (glasgow === 10) return 'O2 V3 M5 — apertura ocular al estímulo doloroso';
  if (glasgow === 9) return 'O2 V2 M5 — sonidos incomprensibles, localiza al dolor';
  return 'compromiso severo del estado de alerta; valorar protección de vía aérea';
}

function resolveAuthoritativeGlasgow(cCase: ClinicalCase): number {
  const rawGcs = Number(cCase.vitalSigns?.glasgow);
  let gcs = Number.isFinite(rawGcs) ? Math.min(15, Math.max(3, Math.round(rawGcs))) : 15;

  const explicitMatches = (cCase.physicalExamPool || [])
    .flatMap((pe) => [...pe.finding.matchAll(/glasgow\s*(?:de\s*)?(\d{1,2})/gi)])
    .map((m) => Number(m[1]))
    .filter((n) => n >= 3 && n <= 15);

  if (explicitMatches.length > 0 && gcs === 15) {
    const minExplicit = Math.min(...explicitMatches);
    if (minExplicit < 15) gcs = minExplicit;
  }

  if (gcs === 15) {
    const combinedText = [
      cCase.patientInfo?.currentIllness || '',
      ...(cCase.physicalExamPool || []).map((pe) => pe.finding),
    ].join(' ');
    if (/\b(?:estupor(?:os[oa])?|estado de coma|comatos[oa]|inconsciente)\b/i.test(combinedText)) {
      gcs = 9;
    } else if (
      /\b(?:letarg[oa]|letargia|somnolencia progresiva|desorientad[oa] en tiempo y espacio|obnubilad[oa])\b/i.test(
        combinedText
      )
    ) {
      gcs = 13;
    }
  }

  return gcs;
}

function buildContextualGeneralExam(
  cCase: ClinicalCase,
  glasgow: number,
  nativeTextNorm: string
): PhysicalExamFinding {
  const age = cCase.patientInfo?.age ?? 30;
  const { sys } = parseBp(cCase.vitalSigns?.bloodPressure);
  const hr = cCase.vitalSigns?.heartRate ?? 80;
  const spo2 = cCase.vitalSigns?.oxygenSaturation ?? 98;
  const temp = cCase.vitalSigns?.temperature ?? 36.8;
  const illnessNorm = normPe(cCase.patientInfo?.currentIllness || '');
  const contextNorm = `${illnessNorm} ${nativeTextNorm}`;

  const likelyDehydrated =
    sys < 95 ||
    hr >= 115 ||
    /\b(vomit|diarrea|deshidrat|sed intensa|cetoacidosis|poliuria)\b/.test(contextNorm);
  const hasPallorOrBleed = /\b(palid|anemia|hemorrag|melena|hematemesis|ectopico|hipovolem)\b/.test(contextNorm);
  const hasJaundice = /\b(icteri|colangitis|bilirrubin|escleras amarillas)\b/.test(contextNorm);
  const hasCyanosis = spo2 < 90 || /\bcianos/.test(contextNorm);
  const hasFeverOrDiaphoresis = temp >= 38.0 || /\bdiafores/.test(contextNorm);

  const hydrationClause = likelyDehydrated
    ? 'Mucosas orales discretamente secas o con hidratación limítrofe, a correlacionar con signos vitales.'
    : 'Mucosas orales hidratadas y turgencia cutánea conservada.';

  const skinColorClauses: string[] = [];
  if (hasPallorOrBleed) skinColorClauses.push('palidez tegumentaria concordante con el cuadro clínico');
  if (hasJaundice) skinColorClauses.push('tinte ictérico en escleras/tegumentos');
  if (hasCyanosis) skinColorClauses.push(`datos de hipoxemia periférica (SpO₂ ${spo2}%)`);
  if (hasFeverOrDiaphoresis) skinColorClauses.push('fascies álgica/febril o diaforesis acorde al estado agudo');

  const colorText =
    skinColorClauses.length > 0
      ? `Se aprecia ${skinColorClauses.join(', ')}.`
      : 'Sin palidez marcada, ictericia ni cianosis.';

  let neuroOpening = '';
  if (age < 3) {
    neuroOpening =
      glasgow >= 15
        ? 'Paciente pediátrico reactivo al entorno, con llanto consolable e interacción acorde a la edad (Glasgow pediátrico 15/15).'
        : `Paciente pediátrico con irritabilidad, letargo o menor respuesta al medio (Glasgow pediátrico ${glasgow}/15).`;
  } else if (glasgow >= 15) {
    neuroOpening = 'Paciente consciente y orientado en las tres esferas (Glasgow 15/15).';
  } else if (glasgow === 14) {
    neuroOpening = 'Paciente vigil pero con discreta somnolencia o confusión leve (Glasgow 14/15).';
  } else if (glasgow >= 12) {
    neuroOpening = `Paciente con deterioro moderado del estado de alerta, somnoliento o confuso (Glasgow ${glasgow}/15).`;
  } else {
    neuroOpening = `Paciente con compromiso importante del estado de conciencia y escasa respuesta al medio (Glasgow ${glasgow}/15).`;
  }

  const isAbnormal =
    glasgow < 15 || likelyDehydrated || hasPallorOrBleed || hasJaundice || hasCyanosis || temp >= 38.0;

  return {
    ...STANDARD_PHYSICAL_EXAMS[0],
    id: `std-pe-general-${cCase.id}`,
    finding: `${neuroOpening} ${hydrationClause} ${colorText}`,
    isAbnormal,
  };
}

function buildContextualNeuroCoreExam(
  cCase: ClinicalCase,
  glasgow: number,
  nativeExams: PhysicalExamFinding[]
): PhysicalExamFinding {
  const age = cCase.patientInfo?.age ?? 30;
  const breakdown = getGlasgowBreakdown(glasgow);
  const nativeText = normPe(nativeExams.map((e) => `${e.name} ${e.finding}`).join(' '));
  const hasMotorOrCranialCue = /\b(hemiparesia|paresia|paralisis|debilidad|disartria|afasia|ptosis|facial|nistagmo)\b/.test(
    nativeText
  );

  if (age < 3) {
    return {
      ...STANDARD_PHYSICAL_EXAMS.find((e) => e.id === 'std-pe-neuro-core')!,
      id: `std-pe-neuro-core-${cCase.id}`,
      finding:
        glasgow >= 15
          ? `Glasgow pediátrico 15/15 (${breakdown}). Tono muscular y motilidad espontánea simétrica en las cuatro extremidades; reflejo de succión/prensión acorde a la edad.`
          : `Glasgow pediátrico ${glasgow}/15 (${breakdown}). Disminución de reactividad al estímulo; requiere vigilancia neurológica estrecha.`,
      isAbnormal: glasgow < 15,
    };
  }

  if (glasgow >= 15 && !hasMotorOrCranialCue) {
    return {
      ...STANDARD_PHYSICAL_EXAMS.find((e) => e.id === 'std-pe-neuro-core')!,
      id: `std-pe-neuro-core-${cCase.id}`,
      finding: `Glasgow 15/15 (${breakdown}). Pares craneales I-XII íntegros y simétricos. Fuerza muscular 5/5 en las cuatro extremidades.`,
      isAbnormal: false,
    };
  }

  return {
    ...STANDARD_PHYSICAL_EXAMS.find((e) => e.id === 'std-pe-neuro-core')!,
    id: `std-pe-neuro-core-${cCase.id}`,
    finding: `Glasgow ${glasgow}/15 (${breakdown}). Evaluación neurológica básica acorde al estado clínico del paciente; correlacionar con maniobras neurológicas dirigidas.`,
    isAbnormal: glasgow < 15 || hasMotorOrCranialCue,
  };
}

function buildContextualStdExam(
  stdExam: PhysicalExamFinding,
  cCase: ClinicalCase,
  nativeTextNorm: string
): PhysicalExamFinding {
  const age = cCase.patientInfo?.age ?? 30;
  const v = cCase.vitalSigns;
  const bpRaw = (v?.bloodPressure || '120/80 mmHg').split(' ')[0];
  const { sys, dia } = parseBp(v?.bloodPressure);
  const hr = v?.heartRate ?? 80;
  const rr = v?.respiratoryRate ?? 16;
  const spo2 = v?.oxygenSaturation ?? 98;

  const hrUpper = age < 2 ? 160 : age < 6 ? 140 : age < 12 ? 120 : 105;
  const hrLower = age < 2 ? 90 : age < 12 ? 70 : 52;
  const rrUpper = age < 2 ? 48 : age < 6 ? 34 : age < 12 ? 26 : 22;
  const sysLow = age < 2 ? 70 : age < 12 ? 80 : 90;

  if (stdExam.id === 'std-pe-cardio') {
    const isHypotensive = sys < sysLow;
    const isSevereHtn = age >= 12 && (sys >= 160 || dia >= 100);
    const isTachy = hr > hrUpper;
    const isBrady = hr < hrLower;

    if (isHypotensive || isTachy || isBrady || isSevereHtn) {
      const ratePart = isTachy
        ? `Ruidos cardíacos rítmicos y taquicárdicos (${hr} lpm)`
        : isBrady
          ? `Ruidos cardíacos rítmicos y bradicárdicos (${hr} lpm)`
          : `Ruidos cardíacos rítmicos (${hr} lpm)`;
      const bpPart = isHypotensive
        ? `con hipotensión arterial (${bpRaw} mmHg), pulsos periféricos débiles y llenado capilar limítrofe/enlentecido (> 2 s)`
        : isSevereHtn
          ? `con refuerzo del segundo ruido acorde a cifras tensionales elevadas (${bpRaw} mmHg), pulsos presentes y llenado capilar < 2 s`
          : 'sin soplos ni tercer ruido (R3); pulsos periféricos presentes y llenado capilar < 2 segundos';
      return {
        ...stdExam,
        id: `${stdExam.id}-${cCase.id}`,
        finding: `${ratePart}, ${bpPart}.`,
        isAbnormal: true,
      };
    }
  }

  if (stdExam.id === 'std-pe-thorax') {
    const isHypoxemic = spo2 < 93;
    const isTachypneic = rr > rrUpper;
    if (isHypoxemic || isTachypneic) {
      return {
        ...stdExam,
        id: `${stdExam.id}-${cCase.id}`,
        finding: `Taquipnea (${rr} rpm, SpO₂ ${spo2}%) acorde al esfuerzo o demanda metabólica del cuadro; murmullo vesicular bilateral sin estertores ni sibilancias localizadas.`,
        isAbnormal: isHypoxemic || rr >= rrUpper + 4,
      };
    }
  }

  if (stdExam.id === 'std-pe-head-eyes') {
    const hasJaundice = /\b(icteri|colangitis|bilirrubin)\b/.test(nativeTextNorm);
    const hasPallor = /\b(palid|anemia|hemorrag|melena|ectopico)\b/.test(nativeTextNorm);
    if (hasJaundice || hasPallor) {
      const conjNote = hasJaundice
        ? 'Escleras con tinte ictérico evidente.'
        : 'Conjuntivas con palidez acorde al grado de anemia/sangrado.';
      return {
        ...stdExam,
        id: `${stdExam.id}-${cCase.id}`,
        finding: `Pupilas isocóricas normorreactivas a la luz (3 mm). ${conjNote} Orofaringe sin lesiones agudas.`,
        isAbnormal: true,
      };
    }
  }

  return {
    ...stdExam,
    id: `${stdExam.id}-${cCase.id}`,
  };
}

function synchronizeFindingWithGlasgow(pe: PhysicalExamFinding, glasgow: number): PhysicalExamFinding {
  if (glasgow >= 15) return pe;
  let updatedFinding = pe.finding;
  let changed = false;

  if (/glasgow\s*15(?:\s*\/\s*15)?/i.test(updatedFinding)) {
    updatedFinding = updatedFinding.replace(/glasgow\s*15(?:\s*\/\s*15)?/gi, `Glasgow ${glasgow}/15`);
    changed = true;
  }
  if (/consciente y orientado en las tres esferas/i.test(updatedFinding)) {
    const replacement =
      glasgow === 14
        ? `vigil con confusión o somnolencia leve (Glasgow ${glasgow}/15)`
        : `con deterioro del estado de alerta (Glasgow ${glasgow}/15)`;
    updatedFinding = updatedFinding.replace(/consciente y orientado en las tres esferas/gi, replacement);
    changed = true;
  }

  return changed ? { ...pe, finding: updatedFinding, isAbnormal: true } : pe;
}

export const PHYSICAL_EXAM_SYSTEM_ORDER: PhysicalExamFinding['system'][] = [
  'General',
  'Cabeza y Cuello',
  'Tórax y Pulmones',
  'Cardiovascular',
  'Abdomen',
  'Neurológico',
  'Osteomuscular y Piel',
];

function getSystemRank(system: string): number {
  const idx = PHYSICAL_EXAM_SYSTEM_ORDER.indexOf(system as PhysicalExamFinding['system']);
  return idx === -1 ? PHYSICAL_EXAM_SYSTEM_ORDER.length : idx;
}

function sortPhysicalExamsCanonically(exams: PhysicalExamFinding[]): PhysicalExamFinding[] {
  return [...exams].sort((a, b) => {
    const rankDiff = getSystemRank(a.system) - getSystemRank(b.system);
    if (rankDiff !== 0) return rankDiff;
    const nameDiff = a.name.localeCompare(b.name, 'es', { sensitivity: 'base' });
    if (nameDiff !== 0) return nameDiff;
    return a.id.localeCompare(b.id);
  });
}

/**
 * Enriquece cualquier caso clínico con el catálogo universal de maniobras de examen físico,
 * sanitiza títulos que puedan dar pistas sobre la patología y garantiza correlación estricta
 * entre signos vitales, edad, hallazgos nativos y exploraciones complementarias.
 */
export function enrichCaseWithUniversalPhysicalExam(cCase: ClinicalCase): ClinicalCase {
  const syncedGlasgow = resolveAuthoritativeGlasgow(cCase);

  const sanitizedExisting: PhysicalExamFinding[] = (cCase.physicalExamPool || []).map((pe) =>
    synchronizeFindingWithGlasgow(
      {
        ...pe,
        name: sanitizePhysicalExamTitle(pe.name),
      },
      syncedGlasgow
    )
  );

  const nativeTextNorm = normPe(
    [
      cCase.patientInfo?.currentIllness || '',
      cCase.solution?.correctDiagnosis || '',
      ...sanitizedExisting.map((e) => `${e.name} ${e.finding}`),
    ].join(' ')
  );

  const mergedExams: PhysicalExamFinding[] = [...sanitizedExisting];

  for (const stdExam of STANDARD_PHYSICAL_EXAMS) {
    const alreadyCovered = isStdExamCoveredByNative(stdExam, sanitizedExisting);
    if (!alreadyCovered) {
      if (stdExam.id === 'std-pe-general') {
        mergedExams.push(buildContextualGeneralExam(cCase, syncedGlasgow, nativeTextNorm));
      } else if (stdExam.id === 'std-pe-neuro-core') {
        mergedExams.push(buildContextualNeuroCoreExam(cCase, syncedGlasgow, sanitizedExisting));
      } else {
        mergedExams.push(buildContextualStdExam(stdExam, cCase, nativeTextNorm));
      }
    }
  }

  return {
    ...cCase,
    vitalSigns: {
      ...cCase.vitalSigns,
      glasgow: syncedGlasgow,
    },
    physicalExamPool: sortPhysicalExamsCanonically(mergedExams),
  };
}
