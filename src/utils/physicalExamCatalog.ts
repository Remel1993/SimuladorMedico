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

/**
 * Limpia títulos de maniobras específicas del caso para eliminar palabras que delaten el diagnóstico.
 */
function sanitizePhysicalExamTitle(name: string): string {
  const lower = name.toLowerCase();

  if (lower.includes('torniquete') || lower.includes('rumpel')) {
    return 'Prueba del torniquete (fragilidad capilar) e inspección de petequias';
  }
  if (lower.includes('hepatomegalia') || lower.includes('murphy')) {
    return 'Palpación abdominal profunda, Murphy y delimitación hepática';
  }
  if (lower.includes('levine')) {
    return 'Inspección general, facies y actitud del paciente';
  }
  if (lower.includes('pseudoperitonitis') || lower.includes('diabética') || lower.includes('diabetica')) {
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
  if (lower.includes('meníngeo') || lower.includes('meningeo') || lower.includes('kernig')) {
    return 'Signos meníngeos (Rigidez de nuca, Kernig y Brudzinski)';
  }

  return name;
}

/**
 * Determina si dos maniobras representan la misma categoría semiológica para evitar duplicados.
 */
function isSameExamCategory(name1: string, name2: string): boolean {
  const n1 = name1.toLowerCase();
  const n2 = name2.toLowerCase();

  if (n1.includes('torniquete') || n1.includes('rumpel') || n1.includes('petequia')) {
    return n2.includes('torniquete') || n2.includes('rumpel') || n2.includes('petequia');
  }
  if (n1.includes('meníngeo') || n1.includes('meninge') || n1.includes('kernig') || n1.includes('brudzinski')) {
    return n2.includes('meníngeo') || n2.includes('meninge') || n2.includes('kernig') || n2.includes('brudzinski');
  }
  if (n1.includes('psoas') || n1.includes('obturador') || n1.includes('mcburney') || n1.includes('peritoneal')) {
    return n2.includes('psoas') || n2.includes('obturador') || n2.includes('mcburney') || n2.includes('peritoneal');
  }
  if (n1.includes('murphy') || n1.includes('hepato') || n1.includes('hepatomegalia')) {
    return n2.includes('murphy') || n2.includes('hepato') || n2.includes('hepatomegalia');
  }
  if (n1.includes('nikolsky') || (n1.includes('cutánea') && n1.includes('integral')) || n1.includes('piel y perfusión')) {
    return n2.includes('nikolsky') || (n2.includes('cutánea') && n2.includes('integral'));
  }
  if (n1.includes('homans') || n1.includes('miembros inferiores') || n1.includes('compartiment')) {
    return n2.includes('homans') || n2.includes('miembros inferiores') || n2.includes('compartiment');
  }
  if (n1.includes('clonus') || n1.includes('reflejos')) {
    return n2.includes('clonus') || n2.includes('reflejos');
  }
  if (n1.includes('inspección general') || n1.includes('aspecto general') || n1.includes('estado hídrico') || n1.includes('triángulo')) {
    return n2.includes('inspección general');
  }
  if ((n1.includes('auscultación') || n1.includes('mecánica')) && (n1.includes('pulmon') || n1.includes('ventilator') || n1.includes('respirator'))) {
    return n2.includes('auscultación pulmonar');
  }
  if (n1.includes('cardíaca') || n1.includes('cardiaca') || (n1.includes('pulsos') && n1.includes('perfusión'))) {
    return n2.includes('auscultación cardíaca');
  }
  if ((n1.includes('palpación') && n1.includes('abdomen')) || (n1.includes('palpación abdominal') && !n1.includes('murphy') && !n1.includes('hepato'))) {
    return n2.includes('palpación abdominal superficial/profunda');
  }
  if (n1.includes('ocular') || n1.includes('orl') || n1.includes('vía aérea') || n1.includes('via aerea')) {
    return n2.includes('exploración ocular');
  }
  if (n1.includes('yugular') || n1.includes('carotídeo')) {
    return n2.includes('ingurgitación yugular');
  }
  if (n1.includes('pares craneales') || n1.includes('conciencia') || (n1.includes('neurológica') && !n1.includes('meninge'))) {
    return n2.includes('estado de conciencia');
  }

  return false;
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
 * Enriquece cualquier caso clínico con el catálogo universal de maniobras de examen físico
 * y sanitiza títulos que puedan dar pistas sobre la patología.
 * Ordena las maniobras de forma cefalocaudal canónica por sistema para evitar que las
 * maniobras diagnósticas clave aparezcan automáticamente al inicio.
 */
export function enrichCaseWithUniversalPhysicalExam(cCase: ClinicalCase): ClinicalCase {
  const sanitizedExisting: PhysicalExamFinding[] = (cCase.physicalExamPool || []).map((pe) => ({
    ...pe,
    name: sanitizePhysicalExamTitle(pe.name),
  }));

  const mergedExams: PhysicalExamFinding[] = [...sanitizedExisting];

  for (const stdExam of STANDARD_PHYSICAL_EXAMS) {
    const alreadyHas = sanitizedExisting.some((pe) => isSameExamCategory(pe.name, stdExam.name));
    if (!alreadyHas) {
      mergedExams.push({
        ...stdExam,
        id: `${stdExam.id}-${cCase.id}`,
      });
    }
  }

  return {
    ...cCase,
    physicalExamPool: sortPhysicalExamsCanonically(mergedExams),
  };
}
