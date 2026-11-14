import { ClinicalCase, GameMode, Specialty } from '../types/clinical';
import { ALL_CURATED_CASES } from '../data/allCases';
import { enrichCaseWithHospitalCatalog } from '../utils/studiesCatalog';
import { enrichCaseWithUniversalPhysicalExam } from '../utils/physicalExamCatalog';

export interface SelectLocalCaseOptions {
  mode: GameMode;
  specialty: Specialty;
  caseId?: string;
  excludeCaseId?: string;
  excludeCaseIds?: string[];
  excludeDiagnoses?: string[];
  customCases?: ClinicalCase[];
}

function normalizeDiag(text: string): string {
  return (text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function pickLeastRecentlySeen(
  pool: ClinicalCase[],
  excludeCaseIds: string[],
  excludeCaseId?: string
): ClinicalCase {
  const filtered =
    excludeCaseId && pool.length > 1
      ? pool.filter((c) => c.id !== excludeCaseId)
      : pool;
  if (filtered.length <= 1) return filtered[0] || pool[0];

  const scored = filtered.map((c) => {
    const idx = excludeCaseIds.lastIndexOf(c.id);
    return { item: c, recency: idx === -1 ? -1 : idx };
  });
  scored.sort((a, b) => a.recency - b.recency);

  const minRecency = scored[0].recency;
  const tiedBest = scored.filter((s) => s.recency === minRecency).map((s) => s.item);
  return tiedBest[Math.floor(Math.random() * tiedBest.length)];
}

/**
 * Combina los 70 casos curados con los casos locales agregados por el usuario.
 */
export function getLocalCaseLibrary(customCases: ClinicalCase[] = []): ClinicalCase[] {
  const map = new Map<string, ClinicalCase>();
  for (const c of ALL_CURATED_CASES) {
    map.set(c.id, c);
  }
  for (const c of customCases) {
    if (c?.id) {
      map.set(c.id, {
        ...c,
        clinicalMetadata: c.clinicalMetadata || {
          lastReviewed: new Date().toISOString().slice(0, 10),
          reviewedBy: 'Biblioteca Local del Usuario',
          evidenceSources: c.solution?.guidelineReferences || ['Guías clínicas locales'],
          frequentErrors: c.solution?.criticalSafetyAlerts || [],
          educationalDisclaimer:
            'Caso educativo local. No sustituye el juicio clínico ni los protocolos institucionales vigentes.',
          isCustom: true,
        },
      });
    }
  }
  return Array.from(map.values());
}

/**
 * Selector y generador determinista 100 % local de casos clínicos.
 * Mantiene ocultos los datos diagnósticos en la interfaz hasta que el médico concluye la atención.
 */
export function selectLocalClinicalCase(options: SelectLocalCaseOptions): ClinicalCase {
  const {
    mode,
    specialty,
    caseId,
    excludeCaseId,
    excludeCaseIds = [],
    excludeDiagnoses = [],
    customCases = [],
  } = options;

  const library = getLocalCaseLibrary(customCases);

  // 1. Selección explícita por ID (desde biblioteca o historial)
  if (caseId) {
    const exact = library.find((c) => c.id === caseId);
    if (exact) {
      return enrichCaseWithUniversalPhysicalExam(
        enrichCaseWithHospitalCatalog({
          ...exact,
          mode: mode || exact.mode,
        })
      );
    }
  }

  // 2. Filtro por especialidad
  const bySpecialty =
    specialty === 'aleatorio'
      ? library
      : library.filter((c) => c.specialty === specialty);

  const basePool = bySpecialty.length > 0 ? bySpecialty : library;

  // 3. Prioridad por nivel de dificultad/modalidad solicitada
  const exactModeMatches = basePool.filter((c) => c.mode === mode);
  const difficultyCandidates =
    exactModeMatches.length > 0
      ? exactModeMatches
      : mode === 'urgencias'
        ? basePool.filter(
            (c) =>
              c.patientInfo.triageLevel.includes('Nivel I') ||
              c.patientInfo.triageLevel.includes('Nivel II') ||
              c.mode === 'residente'
          )
        : mode === 'principiante'
          ? basePool.filter((c) => c.mode === 'medico_general')
          : basePool;

  const modeScopedPool = difficultyCandidates.length > 0 ? difficultyCandidates : basePool;

  // 4. Filtro anti-repetición por diagnóstico reciente y caso reciente
  const recentDiagNorms = new Set(excludeDiagnoses.map(normalizeDiag).filter(Boolean));
  const unseenDiagPool = modeScopedPool.filter(
    (c) => !recentDiagNorms.has(normalizeDiag(c.solution.correctDiagnosis))
  );
  const candidatePool = unseenDiagPool.length > 0 ? unseenDiagPool : modeScopedPool;

  const chosen = pickLeastRecentlySeen(candidatePool, excludeCaseIds, excludeCaseId);

  return enrichCaseWithUniversalPhysicalExam(
    enrichCaseWithHospitalCatalog({
      ...chosen,
      mode,
    })
  );
}

export interface NewLocalCaseInput {
  mode: GameMode;
  specialty: Exclude<Specialty, 'aleatorio'>;
  patientName: string;
  age: number;
  sex: 'Masculino' | 'Femenino';
  occupation: string;
  consultReason: string;
  evolutionTime: string;
  currentIllness: string;
  triageLevel: ClinicalCase['patientInfo']['triageLevel'];
  bloodPressure: string;
  heartRate: number;
  respiratoryRate: number;
  temperature: number;
  oxygenSaturation: number;
  glasgow: number;
  correctDiagnosis: string;
  differentialDiagnoses: string[];
  pathophysiology: string;
  keyClinicalClues: string[];
  expectedDrug: string;
  expectedDose: string;
  expectedRoute: string;
  expectedFrequency: string;
  hospitalizationDecision: ClinicalCase['solution']['optimalTreatment']['hospitalizationDecision'];
  guidelineReference: string;
  criticalSafetyAlert: string;
}

/**
 * Construye un ClinicalCase estructurado y validado para ampliar la biblioteca local offline.
 */
export function buildCustomLocalCase(input: NewLocalCaseInput): ClinicalCase {
  const id = `case-custom-${Date.now()}`;
  const today = new Date().toISOString().slice(0, 10);

  return enrichCaseWithUniversalPhysicalExam(
    enrichCaseWithHospitalCatalog({
      id,
      mode: input.mode,
      specialty: input.specialty,
      patientInfo: {
        name: input.patientName.trim(),
        age: Math.max(0, Math.min(110, Math.round(input.age))),
        sex: input.sex,
        occupation: input.occupation.trim() || 'Empleado',
        consultReason: input.consultReason.trim(),
        evolutionTime: input.evolutionTime.trim() || '24 horas de evolución',
        currentIllness: input.currentIllness.trim(),
        triageLevel: input.triageLevel,
      },
      vitalSigns: {
        bloodPressure: input.bloodPressure.trim() || '120/80 mmHg',
        heartRate: input.heartRate || 82,
        respiratoryRate: input.respiratoryRate || 18,
        temperature: input.temperature || 36.8,
        oxygenSaturation: input.oxygenSaturation || 98,
        glasgow: input.glasgow || 15,
        bloodGlucose: 95,
      },
      background: {
        pathological: ['Sin otros antecedentes crónicos documentados en la ficha inicial.'],
        nonPathological: ['Niega hábitos tóxicos relevantes registrados.'],
        family: ['Sin antecedentes familiares relevantes documentados.'],
        surgical: ['Sin cirugías previas reportadas.'],
        currentMedications: ['Ninguno al momento de la consulta.'],
        allergies: ['Sin alergias medicamentosas conocidas.'],
      },
      physicalExamPool: [
        {
          id: `${id}-pe-general`,
          system: 'General',
          name: 'Inspección general y estado de conciencia',
          finding: `Paciente con motivo de consulta "${input.consultReason.trim()}", Glasgow ${input.glasgow || 15}/15 y signos vitales iniciales registrados en monitor.`,
          isAbnormal: input.triageLevel.includes('Nivel I') || input.triageLevel.includes('Nivel II'),
        },
      ],
      studiesPool: [
        {
          id: `${id}-std-hemograma`,
          category: 'Laboratorio',
          subcategory: 'Hematología',
          name: 'Hemograma completo automatizado',
          result: 'Parámetros hematológicos de ingreso disponibles según contexto clínico.',
          referenceRange: 'Hb 12-16 g/dL | Leucocitos 4,500-10,000/mm³ | Plaquetas 150,000-450,000/mm³',
          interpretation: 'Valorar en conjunto con la clínica del paciente.',
          isAbnormal: false,
        },
      ],
      solution: {
        correctDiagnosis: input.correctDiagnosis.trim(),
        differentialDiagnoses:
          input.differentialDiagnoses.length > 0
            ? input.differentialDiagnoses
            : ['Diagnóstico sindromático alternativo'],
        pathophysiology: input.pathophysiology.trim(),
        keyClinicalClues:
          input.keyClinicalClues.length > 0
            ? input.keyClinicalClues
            : [input.consultReason.trim()],
        characteristicSignsSymptoms:
          input.keyClinicalClues.length > 0
            ? input.keyClinicalClues
            : [input.consultReason.trim()],
        criticalRulingOutFactors: [
          'Descartar patologías agudas de mayor riesgo vital mediante anamnesis y exploración dirigida.',
        ],
        recommendedWorkup: ['Hemograma completo', 'Química sanguínea básica'],
        optimalTreatment: {
          pharmacological: [
            {
              drug: input.expectedDrug.trim() || 'Tratamiento específico según etiología',
              dose: input.expectedDose.trim() || 'Dosis estándar',
              route: input.expectedRoute.trim() || 'Oral / IV según tolerancia',
              frequency: input.expectedFrequency.trim() || 'Según indicación clínica',
              duration: 'Según evolución clínica',
              rationale: 'Tratamiento de primera línea definido en el caso local.',
            },
          ],
          generalMeasures: [
            'Monitorización clínica y reevaluación de signos de alarma.',
            'Educación al paciente sobre datos de retorno inmediato.',
          ],
          hospitalizationDecision: input.hospitalizationDecision,
          referralCriteria: [
            'Deterioro hemodinámico, respiratorio o neurológico progresivo.',
          ],
          followUp: 'Revaloración clínica programada según respuesta terapéutica.',
        },
        criticalSafetyAlerts: [
          input.criticalSafetyAlert.trim() ||
            'Evitar medicación contraindicada antes de confirmar estabilidad clínica y alergias.',
        ],
        guidelineReferences: [
          input.guidelineReference.trim() ||
            'Guías clínicas internacionales y protocolos locales vigentes.',
        ],
      },
      clinicalMetadata: {
        lastReviewed: today,
        reviewedBy: 'Caso Local Personalizado',
        evidenceSources: [
          input.guidelineReference.trim() ||
            'Guías clínicas internacionales y protocolos locales vigentes.',
        ],
        frequentErrors: [
          input.criticalSafetyAlert.trim() ||
            'Omitir reevaluación de signos de alarma y verificación de alergias.',
        ],
        educationalDisclaimer:
          'Caso educativo creado localmente. No sustituye el juicio clínico ni los protocolos institucionales vigentes.',
        isCustom: true,
      },
    })
  );
}
