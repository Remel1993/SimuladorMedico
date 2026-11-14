import { ClinicalCase, EvaluationResult, UserEvaluationInput } from '../types/clinical';
import {
  buildDidacticEvaluation,
  determineClinicalOutcome,
  DramaticOutcome,
  EVALUATION_FRAMEWORK_LABEL,
} from '../utils/caseEvaluation';

export const EDUCATIONAL_DISCLAIMER =
  'Uso exclusivamente educativo para entrenamiento en razonamiento clínico. Las reglas y puntajes de este simulador no sustituyen el juicio clínico profesional ni los protocolos institucionales locales vigentes.';

export { EVALUATION_FRAMEWORK_LABEL };
export type { DramaticOutcome };

/**
 * Ejecuta localmente el motor de evaluación determinista con rúbrica reproducible de 100 puntos
 * y penalizaciones por errores críticos de seguridad.
 */
export function evaluateClinicalCaseLocally(
  userSubmission: UserEvaluationInput,
  caseData: ClinicalCase
): EvaluationResult {
  return buildDidacticEvaluation(userSubmission, caseData);
}

export function evaluateClinicalOutcomeLocally(
  evaluation: EvaluationResult,
  caseData: ClinicalCase
): DramaticOutcome {
  return determineClinicalOutcome(evaluation, caseData);
}
