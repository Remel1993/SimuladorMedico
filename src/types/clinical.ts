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
}

export interface ComplementaryStudy {
  id: string;
  category: 'Laboratorio' | 'Imagen' | 'Gabinete y Trazados';
  subcategory: 'Hematología' | 'Bioquímica' | 'Electrolitos' | 'Función Hepática' | 'Inflamación e Infección' | 'Cardiovascular' | 'Urinario' | 'Gases' | 'Microbiología / Serología' | 'Radiología' | 'Ecografía' | 'Tomografía' | 'Electrocardiograma';
  name: string;
  result: string;
  referenceRange?: string;
  interpretation?: string;
  isAbnormal: boolean;
  visualReportUrl?: string;
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
    hospitalizationDecision: 'Ambulatorio' | 'Observación Urgencias' | 'Hospitalización en Sala' | 'Unidad de Cuidados Intensivos (UCI)';
    referralCriteria: string[];
    followUp: string;
  };
  criticalSafetyAlerts: string[];
  guidelineReferences: string[];
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
}

export interface ChatMessage {
  id: string;
  sender: 'doctor' | 'patient' | 'system';
  text: string;
  timestamp: string;
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
