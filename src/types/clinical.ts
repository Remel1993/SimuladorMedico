export type GameMode = 'principiante' | 'medico_general' | 'residente' | 'urgencias' | 'examen';

export type Specialty =
  | 'medicina_interna'
  | 'cardiologia'
  | 'neurologia'
  | 'gastroenterologia'
  | 'neumologia'
  | 'infectologia'
  | 'endocrinologia'
  | 'nefrologia'
  | 'pediatria'
  | 'ginecologia'
  | 'dermatologia'
  | 'cirugia_general'
  | 'traumatologia'
  | 'psiquiatria'
  | 'urgencias'
  | 'aleatorio';

export interface VitalSigns {
  bloodPressure: string; // e.g. "90/60 mmHg"
  heartRate: number; // e.g. 110 bpm
  respiratoryRate: number; // e.g. 24 rpm
  temperature: number; // e.g. 38.8 °C
  oxygenSaturation: number; // e.g. 96 %
  glasgow: number; // 3 - 15
  bloodGlucose?: number; // mg/dL
  weightKg?: number;
  heightCm?: number;
}

export interface PatientBackground {
  pathological: string[];
  nonPathological: string[];
  family: string[];
  surgical: string[];
  currentMedications: string[];
  allergies: string[];
}

export interface PhysicalExamFinding {
  id: string;
  system: 'General' | 'Cabeza y Cuello' | 'Tórax y Pulmones' | 'Cardiovascular' | 'Abdomen' | 'Neurológico' | 'Osteomuscular y Piel';
  name: string;
  finding: string;
  isAbnormal: boolean;
  semiologyNote?: string;
  liveStatus?: 'estable' | 'evolucion' | 'mejoria' | 'iatrogenia' | 'critico';
  liveUpdateNote?: string;
}

export interface ComplementaryStudy {
  id: string;
  category: 'Laboratorio' | 'Imagen' | 'Gabinete y Trazados';
  subcategory: 'Hematología' | 'Bioquímica' | 'Electrolitos' | 'Función Hepática' | 'Inflamación e Infección' | 'Vitaminas y Nutrición' | 'Cardiovascular' | 'Urinario' | 'Gases' | 'Microbiología / Serología' | 'Radiología' | 'Ecografía' | 'Tomografía' | 'Electrocardiograma' | 'Electromiografía y Neurofisiología' | 'Función Pulmonar y Audiología' | 'Endoscopia y Broncoscopia';
  name: string;
  result: string;
  referenceRange?: string;
  interpretation?: string;
  isAbnormal: boolean;
  visualReportUrl?: string;
  liveStatus?: 'estable' | 'evolucion' | 'mejoria' | 'iatrogenia' | 'critico';
  liveUpdateNote?: string;
}

export interface MedicationItem {
  id: string;
  drug: string;
  dose: string;
  route: string;
  frequency: string;
  duration: string;
}

export interface ClinicalSolution {
  correctDiagnosis: string;
  differentialDiagnoses: string[];
  pathophysiology: string;
  keyClinicalClues: string[];
  characteristicSignsSymptoms: string[];
  criticalRulingOutFactors: string[];
  recommendedWorkup: string[];
  optimalTreatment: {
    pharmacological: Array<{ drug: string; dose: string; route: string; frequency: string; duration: string; rationale: string }>;
    generalMeasures: string[];
    hospitalizationDecision:
      | 'Ambulatorio'
      | 'Observación Urgencias'
      | 'Hospitalización en Sala'
      | 'Quirófano / Cirugía de Urgencia'
      | 'Unidad de Cuidados Intensivos (UCI)';
    referralCriteria: string[];
    followUp: string;
  };
  criticalSafetyAlerts: string[];
  guidelineReferences: string[];
}

export interface ClinicalCaseMetadata {
  lastReviewed: string;
  reviewedBy: string;
  evidenceSources: string[];
  frequentErrors: string[];
  educationalDisclaimer: string;
  isCustom?: boolean;
}

export interface ClinicalCase {
  id: string;
  mode: GameMode;
  specialty: Specialty;
  patientInfo: {
    name: string;
    age: number;
    sex: 'Masculino' | 'Femenino';
    occupation: string;
    consultReason: string;
    evolutionTime: string;
    currentIllness: string;
    triageLevel: 'Nivel I (Reanimación)' | 'Nivel II (Emergencia)' | 'Nivel III (Urgencia)' | 'Nivel IV (Prioritario)' | 'Nivel V (No Urgente)';
  };
  vitalSigns: VitalSigns;
  background: PatientBackground;
  physicalExamPool: PhysicalExamFinding[];
  studiesPool: ComplementaryStudy[];
  solution: ClinicalSolution;
  internalPersonaPrompt?: string;
  clinicalMetadata?: ClinicalCaseMetadata;
}

export interface ChatMessage {
  id: string;
  sender: 'doctor' | 'patient' | 'system';
  text: string;
  timestamp: string;
}

export type StatEffectSeverity = 'mejoria' | 'parcial' | 'sin_cambio' | 'reaccion_adversa';

export interface StatVitalDelta {
  metric: string;
  before: string;
  after: string;
  direction: 'up' | 'down' | 'neutral';
  deltaText: string;
}

export interface StatInterventionRecord {
  id: string;
  presetId?: string;
  label: string;
  drug: string;
  dose: string;
  route: string;
  appliedAt: string;
  elapsedSeconds: number;
  effectSeverity: StatEffectSeverity;
  physiologicalEffectSummary: string;
  deltas: StatVitalDelta[];
  patientFeelingNote: string;
  isImmediateDeath?: boolean;
  immediateDeathReason?: string;
}

export type EvolutionTrajectory = 'estable' | 'mejorando' | 'deterioro' | 'critico';

export interface ClinicalEvolutionState {
  trajectory: EvolutionTrajectory;
  activeAlerts: string[];
  lastEvaluatedSecond: number;
  summaryNote: string;
}

export interface UserEvaluationInput {
  primaryDiagnosis: string;
  differentialDiagnoses: string[];
  clinicalJustification: string;
  additionalStudiesNeeded: string;
  pharmacologicalPlan: MedicationItem[];
  generalMeasures: string;
  hospitalizationDecision: string;
  referralCriteria: string;
  followUpPlan: string;
  unlockedExams: string[];
  unlockedStudies: string[];
  questionCount: number;
  doctorQuestions?: string[];
  timeSpentSeconds: number;
  statInterventions?: StatInterventionRecord[];
  baselineVitalSigns?: VitalSigns;
  finalVitalSigns?: VitalSigns;
}

export interface StatInterventionAuditItem {
  drug: string;
  dose: string;
  route: string;
  verdict: 'adecuado' | 'parcial_o_sin_efecto' | 'riesgo_o_excesivo';
  comment: string;
  deltaSummary: string;
}

export interface StatAuditSummary {
  performedCount: number;
  overallVerdict: 'optimo' | 'parcial' | 'riesgo_critico' | 'omitido_en_inestabilidad' | 'no_requerido';
  vitalEvolutionSummary: string;
  narrative: string;
  interventionReviews: StatInterventionAuditItem[];
  immediateDeathReason?: string;
}

export interface RubricCategoryDetail {
  whyScore: string;
  strengths: string[];
  missingOrImprove: string[];
  expectedStandard: string;
}

export interface EvaluationResult {
  totalScore: number; // 0 - 100
  breakdown: {
    anamnesis: number; // max 15
    physicalExam: number; // max 15
    studiesInterpretation: number; // max 15
    primaryDiagnosis: number; // max 25
    differentialDiagnoses: number; // max 10
    treatment: number; // max 15
    safetyAndConduct: number; // max 5
  };
  categoryDetails?: {
    anamnesis: RubricCategoryDetail;
    physicalExam: RubricCategoryDetail;
    studiesInterpretation: RubricCategoryDetail;
    primaryDiagnosis: RubricCategoryDetail;
    differentialDiagnoses: RubricCategoryDetail;
    treatment: RubricCategoryDetail;
    safetyAndConduct: RubricCategoryDetail;
  };
  classification:
    | 'Excelente razonamiento clínico'
    | 'Muy buen desempeño'
    | 'Buen desempeño'
    | 'Necesita reforzar conocimientos'
    | 'Necesita mejorar su abordaje clínico';
  criticalSafetyErrors: string[];
  feedback: {
    diagnosisAccuracyComment: string;
    reasoningEvaluation: string;
    differentialEvaluation: string;
    workupCritique: string;
    treatmentCritique: string;
    pedagogicalPearls: string[];
    guidelinesSummary: string;
  };
  differentialExplanations?: Array<{
    diagnosis: string;
    rationale: string;
  }>;
  rationalUseAudit?: {
    rationalAntibioticStatus: 'optimo' | 'alerta' | 'no_aplica';
    rationalAntibioticNote: string;
    workupStewardshipNote: string;
    redFlagsSafetyNote: string;
    referralTriageVerdict: 'correcto' | 'subestimado' | 'sobreestimado';
    referralTriageNote: string;
  };
  evaluationFrameworkLabel?: string;
  recognizedEquivalents?: string[];
  statAudit?: StatAuditSummary;
  userSummary?: {
    primaryDiagnosis: string;
    differentialDiagnoses: string[];
    clinicalJustification: string;
    pharmacologicalPlan: MedicationItem[];
    generalMeasures: string;
    hospitalizationDecision: string;
    referralCriteria: string;
    followUpPlan: string;
    questionCount: number;
    unlockedExamsNames: string[];
    unlockedStudiesNames: string[];
    baselineVitalSigns?: VitalSigns;
    finalVitalSigns?: VitalSigns;
  };
  resolvedAt: string;
}

export interface SavedCaseRecord {
  id: string;
  caseId: string;
  patientName: string;
  specialty: Specialty;
  mode: GameMode;
  userDiagnosis: string;
  correctDiagnosis: string;
  score: number;
  date: string;
  evaluation: EvaluationResult;
}

export interface UserPreferences {
  preferredMode: GameMode;
  preferredSpecialty: Specialty;
  ttsEnabled: boolean;
  updatedAt: string;
}

export interface PerformanceStats {
  totalCompleted: number;
  averageScore: number;
  bestScore: number;
  excellentCount: number;
  totalSafetyErrors: number;
  lastActivityAt: string | null;
}

export interface ActiveSimulationSession {
  id: 'current';
  caseData: ClinicalCase;
  activeTab: 'anamnesis' | 'background' | 'physical_exam' | 'studies' | 'diagnosis' | 'treatment' | 'audit';
  liveVitalSigns: VitalSigns;
  statInterventions: StatInterventionRecord[];
  messages: ChatMessage[];
  unlockedExamIds: string[];
  unlockedStudyIds: string[];
  primaryDiagnosis: string;
  differentialDiagnoses: string[];
  clinicalJustification: string;
  additionalStudiesNeeded: string;
  medications: MedicationItem[];
  generalMeasures: string;
  hospitalizationDecision: string;
  referralCriteria: string;
  followUpPlan: string;
  elapsedSeconds: number;
  updatedAt: string;
}

