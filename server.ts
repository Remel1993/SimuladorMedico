import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import { ALL_CURATED_CASES } from './src/data/allCases.js';
import { ClinicalCase, UserEvaluationInput, EvaluationResult, GameMode, Specialty } from './src/types/clinical.js';
import { buildDidacticEvaluation, enrichEvaluationWithDidactics } from './src/utils/caseEvaluation.js';
import {
  buildPatientSystemInstruction,
  ensureFirstPersonReply,
  generateContextualPatientReply,
  PatientChatPayload,
} from './serverPatientChat.js';

dotenv.config();

const MODE_DESCRIPTIONS: Record<GameMode, string> = {
  principiante:
    'Modalidad PRINCIPIANTE: patología clásica frecuente de consulta o guardia básica, síntomas cardinales bien definidos, pocos distractores y triage estable o urgencia moderada.',
  medico_general:
    'Modalidad MÉDICO GENERAL: patología frecuente de primer nivel o urgencias generales con presentación clínica realista y diagnósticos diferenciales habituales.',
  residente:
    'Modalidad RESIDENTE: caso complejo de alta exigencia clínica, comorbilidades múltiples, interacciones farmacológicas o presentación atípica que exige razonamiento profundo.',
  urgencias:
    'Modalidad URGENCIAS (ABCDE): paciente crítico o inestable con amenaza vital inmediata, signos de alarma agudos y toma de decisiones rápidas en sala de choque.',
  examen:
    'Modalidad EXAMEN CLÍNICO: caso ciego tipo evaluación universitaria de especialidad con historia minuciosa, signos sutiles y criterios estrictos sin pistas obvias.',
};

const SPECIALTY_LABELS: Record<Specialty, string> = {
  aleatorio: 'Cualquier especialidad clínica relevante',
  infectologia: 'Infectología (enfermedades infecciosas, tropicales o bacterianas/virales)',
  cardiologia: 'Cardiología (síndromes coronarios, arritmias, insuficiencia cardíaca, valvulopatías)',
  cirugia_general: 'Cirugía General (abdomen agudo quirúrgico, patología biliar, obstrucción, hernias)',
  endocrinologia: 'Endocrinología (emergencias diabéticas, tiroides, suprarrenal, trastornos hidroelectrolíticos)',
  neurologia: 'Neurología (EVC, infecciones del SNC, cefaleas secundarias, crisis convulsivas, síndromes medulares)',
  neumologia: 'Neumología (neumonías, TEP, EPOC exacerbado, asma severa, derrame pleural)',
  medicina_interna: 'Medicina Interna (enfermedades sistémicas, autoinmunes, tromboembolia, falla multiorgánica)',
  urgencias: 'Medicina de Emergencias (choque, anafilaxia, intoxicaciones, sepsis, reanimación ABCDE)',
  pediatria: 'Pediatría (lactante o paciente pediátrico con patología infantil propia de su edad)',
  gastroenterologia: 'Gastroenterología (pancreatitis, hemorragia digestiva, hepatopatía, enfermedad inflamatoria)',
  nefrologia: 'Nefrología (lesión renal aguda, desequilibrios hidroelectrolíticos graves, síndrome nefrótico/nefrítico)',
  ginecologia: 'Ginecología y Obstetricia (urgencia ginecológica/obstétrica en mujer en edad fértil o gestante)',
  traumatologia: 'Traumatología y Ortopedia (trauma musculoesquelético, síndrome compartimental, fracturas complicadas)',
  dermatologia: 'Dermatología (urgencias dermatológicas o farmacodermias graves como SSJ/NET, celulitis, herpes zóster)',
  psiquiatria: 'Psiquiatría y Psicofarmacología (síndrome serotoninérgico, síndrome neuroléptico maligno, intoxicaciones o urgencia psiquiátrica orgánica)',
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '10mb' }));

const PORT = process.env.PORT || 3000;

// Shared Gemini API client instance with recommended telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Endpoint: Generate or fetch a clinical case
app.post('/api/generate-case', async (req: Request, res: Response) => {
  try {
    const mode = (req.body?.mode || 'medico_general') as GameMode;
    const specialty = (req.body?.specialty || 'aleatorio') as Specialty;
    const caseId = req.body?.caseId as string | undefined;
    const excludeCaseId = req.body?.excludeCaseId as string | undefined;
    const excludeCaseIds = Array.isArray(req.body?.excludeCaseIds)
      ? (req.body.excludeCaseIds as string[])
      : [];
    const excludeDiagnoses = Array.isArray(req.body?.excludeDiagnoses)
      ? (req.body.excludeDiagnoses as string[])
      : [];

    // If a specific preset case was requested
    if (caseId) {
      const found = ALL_CURATED_CASES.find((c) => c.id === caseId);
      if (found) {
        return res.json({ case: found, source: 'preset' });
      }
    }

    // Try AI generation if valid API key is configured
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY') {
      try {
        const specialtyLabel = SPECIALTY_LABELS[specialty] || specialty;
        const modeGuidance = MODE_DESCRIPTIONS[mode] || MODE_DESCRIPTIONS.medico_general;

        const specialtyPrompt =
          specialty === 'aleatorio'
            ? 'Especialidad: Selecciona de forma variada cualquier especialidad clínica (Cardiología, Neurología, Gastroenterología, Pediatría, Nefrología, Neumología, Ginecología, Medicina Interna, Infectología, Endocrinología, Traumatología, Dermatología, Psiquiatría o Cirugía).'
            : `ESPECIALIDAD OBLIGATORIA: ${specialtyLabel} (campo JSON "specialty" debe ser exactamente "${specialty}"). El paciente y su diagnóstico DEBEN pertenecer estrictamente a esta especialidad.`;

        const antiRepeatPrompt =
          excludeDiagnoses.length > 0
            ? `\nPROHIBIDO REPETIR PATOLOGÍAS RECIENTES: El alumno ya resolvió o vio recientemente: ${excludeDiagnoses.slice(-12).join(', ')}. Elige una enfermedad clínica COMPLETAMENTE DIFERENTE.`
            : '';

        const systemInstruction = `Eres un equipo de médicos internistas, urgenciólogos y profesores universitarios de medicina.
Tu objetivo es diseñar un caso clínico interactivo, ultra realista, coherente y desafiante para el simulador médico "MEDICAL CASE SIMULATOR".
Sigue guías médicas internacionales vigentes (OMS, OPS, AHA, NICE, IDSA).
REGLAS INQUEBRANTABLES:
1. Respeta ESTRICTAMENTE la especialidad y la modalidad de dificultad solicitadas.
2. En "patientInfo.consultReason" escribe ÚNICAMENTE síntomas en lenguaje sencillo del paciente (NUNCA reveles el diagnóstico ni pistas obvias en el motivo de consulta).
3. En "patientInfo.currentIllness" incluye una línea temporal clara (qué pasó el día anterior, hace horas o días, qué comió/tomó) y antecedentes pertinentes (incluyendo contexto sexual/gineco-obstétrico en nonPathological si es relevante).
4. En "studiesPool" incluye tanto las pruebas confirmatorias como estudios secundarios relacionados (por ejemplo TAC, radiografía o ultrasonido que detecten afecciones anatómicas relacionadas, derrames reactivos, inflamación perivisceral, congestión o signos indirectos).
5. NUNCA inventes valores de laboratorio incompatibles con la fisiopatología.
Genera la respuesta estrictamente en formato JSON válido.`;

        const prompt = `Genera un nuevo caso clínico médico ficticio y original (semilla aleatoria: ${Date.now()}-${Math.floor(Math.random() * 100000)}).
${modeGuidance}
${specialtyPrompt}${antiRepeatPrompt}

El JSON debe tener EXACTAMENTE la siguiente estructura:
{
  "id": "case-ai-${Date.now()}",
  "mode": "${mode}",
  "specialty": "${specialty === 'aleatorio' ? 'medicina_interna' : specialty}",
  "patientInfo": {
    "name": "Nombre y apellidos completos del paciente",
    "age": 42,
    "sex": "Masculino" o "Femenino",
    "occupation": "Ocupación realista (o lactante/escolar si es Pediatría)",
    "consultReason": "Motivo de consulta en palabras simples del paciente SIN revelar el diagnóstico",
    "evolutionTime": "Tiempo de evolución (ej. 3 días)",
    "currentIllness": "Narrativa clínica cronológica completa incluyendo lo ocurrido el día anterior",
    "triageLevel": "Nivel I (Reanimación)" | "Nivel II (Emergencia)" | "Nivel III (Urgencia)" | "Nivel IV (Prioritario)" | "Nivel V (No Urgente)"
  },
  "vitalSigns": {
    "bloodPressure": "ej. 130/85 mmHg",
    "heartRate": 92,
    "respiratoryRate": 20,
    "temperature": 38.4,
    "oxygenSaturation": 95,
    "glasgow": 15,
    "bloodGlucose": 110,
    "weightKg": 70,
    "heightCm": 170
  },
  "background": {
    "pathological": ["Antecedente 1", "Antecedente 2"],
    "nonPathological": ["Datos de estilo de vida, vivienda, viajes"],
    "family": ["Antecedentes familiares relevantes"],
    "surgical": ["Cirugías previas o Niega"],
    "currentMedications": ["Fármacos actuales con dosis o Ninguno"],
    "allergies": ["Alergias o Sin alergias conocidas"]
  },
  "physicalExamPool": [
    {
      "id": "pe-1",
      "system": "General" | "Cabeza y Cuello" | "Tórax y Pulmones" | "Cardiovascular" | "Abdomen" | "Neurológico" | "Osteomuscular y Piel",
      "name": "Nombre de la maniobra o área explorada",
      "finding": "Descripción semiológica minuciosa del hallazgo",
      "isAbnormal": true o false,
      "semiologyNote": "Perla semiológica o relevancia clínica"
    }
  ],
  "studiesPool": [
    {
      "id": "std-1",
      "category": "Laboratorio" | "Imagen" | "Gabinete y Trazados",
      "subcategory": "Hematología" | "Bioquímica" | "Electrolitos" | "Función Hepática" | "Inflamación e Infección" | "Cardiovascular" | "Urinario" | "Gases" | "Microbiología / Serología" | "Radiología" | "Ecografía" | "Tomografía" | "Electrocardiograma",
      "name": "Nombre exacto del estudio",
      "result": "Valores cuantitativos con unidades exactas",
      "referenceRange": "Rango de referencia normal",
      "interpretation": "Interpretación clínica del resultado",
      "isAbnormal": true o false
    }
  ],
  "solution": {
    "correctDiagnosis": "Diagnóstico principal exacto",
    "differentialDiagnoses": ["Diagnóstico diferencial 1", "Diagnóstico diferencial 2", "Diagnóstico diferencial 3"],
    "pathophysiology": "Explicación fisiopatológica detallada del cuadro",
    "keyClinicalClues": ["Pistas clave para orientar el diagnóstico"],
    "characteristicSignsSymptoms": ["Signos y síntomas cardinales"],
    "criticalRulingOutFactors": ["Elementos clave para descartar otras patologías"],
    "recommendedWorkup": ["Abordaje diagnóstico óptimo"],
    "optimalTreatment": {
      "pharmacological": [
        {
          "drug": "Nombre del fármaco",
          "dose": "Dosis exacta",
          "route": "Vía de administración",
          "frequency": "Frecuencia",
          "duration": "Duración",
          "rationale": "Justificación basada en evidencia"
        }
      ],
      "generalMeasures": ["Medida general 1", "Medida general 2"],
      "hospitalizationDecision": "Ambulatorio" | "Observación Urgencias" | "Hospitalización en Sala" | "Unidad de Cuidados Intensivos (UCI)",
      "referralCriteria": ["Criterios de referencia"],
      "followUp": "Plan de seguimiento clínico"
    },
    "criticalSafetyAlerts": ["Alertas de seguridad crítica / errores potencialmente mortales a evitar"],
    "guidelineReferences": ["Guías clínicas de referencia"]
  },
  "internalPersonaPrompt": "Instrucción de cómo responde el paciente en el interrogatorio sin revelar el diagnóstico médico."
}`;

        const aiCall = ai.models
          .generateContent({
            model: 'gemini-4-hydrogen',
            contents: prompt,
            config: {
              systemInstruction,
              responseMimeType: 'application/json',
              thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
            },
          })
          .catch(() => null);

        const timerPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 18000));
        const response: any = await Promise.race([aiCall, timerPromise]);

        if (response && response.text) {
          const rawText = response.text.replace(/```json/gi, '').replace(/```/g, '').trim();
          const parsed = JSON.parse(rawText) as ClinicalCase;
          if (
            parsed.patientInfo &&
            parsed.vitalSigns &&
            parsed.solution &&
            Array.isArray(parsed.physicalExamPool) &&
            parsed.physicalExamPool.length > 0
          ) {
            parsed.mode = mode;
            if (specialty !== 'aleatorio') {
              parsed.specialty = specialty;
            }
            return res.json({ case: parsed, source: 'ai' });
          }
        }
      } catch {
        // Fallback to curated library below
      }
    }

    // Fallback inteligente con rotación de baraja anti-repetición:
    const excludeSet = new Set<string>(excludeCaseIds);
    if (excludeCaseId) excludeSet.add(excludeCaseId);

    let candidatePool: ClinicalCase[] = [];

    if (specialty !== 'aleatorio') {
      const bySpecialty = ALL_CURATED_CASES.filter((c) => c.specialty === specialty);
      if (bySpecialty.length > 0) {
        const unseenInSpec = bySpecialty.filter((c) => !excludeSet.has(c.id));
        if (unseenInSpec.length > 0) {
          const unseenSpecMode = unseenInSpec.filter((c) => c.mode === mode);
          candidatePool = unseenSpecMode.length > 0 ? unseenSpecMode : unseenInSpec;
        } else {
          // Ya jugó los casos de esa especialidad: evita repetir el último inmediato si hay >= 2
          const withoutLast = bySpecialty.filter((c) => c.id !== excludeCaseId);
          candidatePool = withoutLast.length > 0 ? withoutLast : bySpecialty;
        }
      }
    }

    if (candidatePool.length === 0) {
      // Aleatorio o sin filtro de especialidad: prioriza todos los NO vistos de los 23 casos
      const unseenAll = ALL_CURATED_CASES.filter((c) => !excludeSet.has(c.id));
      if (unseenAll.length > 0) {
        const unseenByMode = unseenAll.filter((c) => c.mode === mode);
        if (unseenByMode.length > 0) {
          candidatePool = unseenByMode;
        } else {
          // Si ya agotó los casos nativos de esa modalidad, amplía a todos los no vistos
          candidatePool = unseenAll;
        }
      } else {
        // Baraja completa jugada: reinicia evitando repetir exactamente el último caso inmediato
        const withoutLast = ALL_CURATED_CASES.filter((c) => c.id !== excludeCaseId);
        candidatePool = withoutLast.length > 0 ? withoutLast : ALL_CURATED_CASES;
      }
    }

    const chosenBase = candidatePool[Math.floor(Math.random() * candidatePool.length)];
    const chosen: ClinicalCase = {
      ...chosenBase,
      mode,
    };

    return res.json({ case: chosen, source: 'preset' });
  } catch {
    return res.status(500).json({ error: 'No se pudo generar el caso clínico' });
  }
});

// Endpoint: Interactive patient chat (In persona)
app.post('/api/patient-chat', async (req: Request, res: Response) => {
  try {
    const payload = req.body as PatientChatPayload;
    const { history = [], userMessage } = payload;

    if (!userMessage || !userMessage.trim()) {
      return res.status(400).json({ error: 'Mensaje requerido' });
    }

    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY') {
      try {
        const systemInstruction = buildPatientSystemInstruction(payload);
        const conversationPrompt = `Historial completo de la consulta médica hasta este momento:
${history
  .slice(-16)
  .map((m) => `${m.sender === 'doctor' ? 'Médico' : 'Paciente'}: ${m.text}`)
  .join('\n')}

Pregunta actual del Médico: ${userMessage}
Paciente (OBLIGATORIO responder en PRIMERA PERSONA del singular — "yo siento", "me empezó", "tuve", "tengo" — JAMÁS en tercera persona ni narrando como expediente clínico; si es un bebé/niño pequeño, responde como su madre/padre en primera persona):`;

        const chatCall = ai.models
          .generateContent({
            model: 'gemini-4-hydrogen',
            contents: conversationPrompt,
            config: {
              systemInstruction,
              thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
            },
          })
          .catch(() => null);

        const timerPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 10000));
        const response: any = await Promise.race([chatCall, timerPromise]);

        const rawReply = response?.text?.trim();
        if (rawReply) {
          const reply = ensureFirstPersonReply(rawReply, payload.patientInfo);
          return res.json({ reply });
        }
      } catch {
        // Proceder al motor determinista contextual
      }
    }

    const reply = generateContextualPatientReply(payload);
    return res.json({ reply });
  } catch {
    return res.status(500).json({ error: 'Error en la respuesta del paciente' });
  }
});

// Endpoint: Clinical Case Evaluation & 100-point Scoring
app.post('/api/evaluate-case', async (req: Request, res: Response) => {
  try {
    const { userSubmission, caseData } = req.body as {
      userSubmission: UserEvaluationInput;
      caseData: ClinicalCase;
    };

    if (!userSubmission || !caseData) {
      return res.status(400).json({ error: 'Datos de evaluación insuficientes' });
    }

    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY') {
      try {
        const examNames = (userSubmission.unlockedExams || [])
          .map((id) => caseData.physicalExamPool?.find((e) => e.id === id)?.name || id)
          .join(', ');
        const studyNames = (userSubmission.unlockedStudies || [])
          .map((id) => caseData.studiesPool?.find((s) => s.id === id)?.name || id)
          .join(', ');
        const keyAbnormalExams = (caseData.physicalExamPool || [])
          .filter((e) => e.isAbnormal)
          .map((e) => e.name)
          .join(', ');
        const keyAbnormalStudies = (caseData.studiesPool || [])
          .filter((s) => s.isAbnormal)
          .map((s) => s.name)
          .join(', ');

        const evaluationPrompt = `Actúa como un tribunal académico médico universitario sumamente didáctico (Médico Internista, Urgenciólogo, Farmacólogo Clínico y Profesor de Medicina).
Debes evaluar exhaustivamente y enseñar al médico usuario qué hizo bien, POR QUÉ obtuvo exactamente cada puntaje y QUÉ LE FALTÓ en cada apartado.

DATOS DEL CASO CLÍNICO:
- Paciente: ${caseData.patientInfo?.name || 'Paciente'}, ${caseData.patientInfo?.age || 35} años, ${caseData.patientInfo?.sex || 'Masculino'}
- Diagnóstico Verdadero del Caso: ${caseData.solution?.correctDiagnosis || 'Diagnóstico no especificado'}
- Diagnósticos Diferenciales Principales: ${(caseData.solution?.differentialDiagnoses || []).join(', ')}
- Claves de Descarte: ${(caseData.solution?.criticalRulingOutFactors || []).join(' | ')}
- Fisiopatología clave: ${caseData.solution?.pathophysiology || ''}
- Maniobras físicas con hallazgos alterados clave: ${keyAbnormalExams || 'Ver catálogo'}
- Estudios con hallazgos alterados clave: ${keyAbnormalStudies || 'Ver catálogo'}
- Tratamiento Óptimo Recomendado: ${JSON.stringify(caseData.solution?.optimalTreatment || {})}
- Alertas Críticas de Seguridad: ${(caseData.solution?.criticalSafetyAlerts || []).join(' | ')}
- Alergias del paciente: ${(caseData.background?.allergies || []).join(', ')}

DESEMPEÑO REAL DEL USUARIO:
- Preguntas realizadas en anamnesis (${userSubmission.questionCount || 0}): ${(userSubmission.doctorQuestions || []).join(' | ') || 'Sin registro textual'}
- Exploraciones físicas solicitadas (${userSubmission.unlockedExams?.length || 0}): ${examNames || 'Ninguna'}
- Estudios solicitados (${userSubmission.unlockedStudies?.length || 0}): ${studyNames || 'Ninguno'}
- Diagnóstico Principal propuesto: "${userSubmission.primaryDiagnosis || 'Sin registrar'}"
- Diagnósticos Diferenciales propuestos: "${(userSubmission.differentialDiagnoses || []).join(', ') || 'Ninguno'}"
- Justificación clínica: "${userSubmission.clinicalJustification || 'Sin justificación'}"
- Plan farmacológico propuesto: ${JSON.stringify(userSubmission.pharmacologicalPlan || [])}
- Medidas generales: "${userSubmission.generalMeasures || 'Sin registrar'}"
- Decisión de hospitalización: "${userSubmission.hospitalizationDecision || 'Sin definir'}"
- Criterios de referencia propuestos: "${userSubmission.referralCriteria || 'Sin registrar'}"
- Seguimiento propuesto: "${userSubmission.followUpPlan || 'Sin registrar'}"

RÚBRICA ESTRICTA DE 100 PUNTOS Y FARMACOLOGÍA CLÍNICA (NO REGALAR PUNTOS NI INVENTAR FALSOS POSITIVOS):
- Si un apartado está vacío o tiene 0 acciones reales (0 preguntas, 0 exploraciones, 0 estudios, sin diagnóstico, sin diferenciales, sin tratamiento), asigna ESTRICTAMENTE 0 puntos en ese apartado.
- Si el usuario desbloqueó casi todo el examen físico o casi todos los estudios de forma indiscriminada ("escopetazo diagnóstico"), penaliza con 3 a 4 puntos y explícalo.
- ALERGIAS A PENICILINA / BETALACTÁMICOS (Guías AAAAI/ACAAI 2022 y NICE): En pacientes alérgicos a la penicilina, SÍ son error crítico las penicilinas (amoxicilina, ampicilina, piperacilina, penicilina) y cefalosporinas de cadena lateral R1 compartida (cefalexina, cefadroxilo, cefaclor). PERO los macrólidos (eritromicina, azitromicina), fluoroquinolonas (levofloxacino), monobactámicos (aztreonam) y carbapenémicos (meropenem, imipenem, ertapenem; <1% reactividad cruzada) NO deben marcarse como error crítico de anafilaxia por alergia a penicilina.
- CLÁUSULAS DE SUSPENSIÓN: Si en medidas generales el usuario escribe "Suspender [fármaco]" o "Evitar [fármaco]" (ej. suspender Enalapril/Naproxeno/Carbamazepina), ESO ES CORRECTO, jamás lo marques como prescripción del fármaco.
1. anamnesis (0 a 15 pts)
2. physicalExam (0 a 15 pts)
3. studiesInterpretation (0 a 15 pts)
4. primaryDiagnosis (0 a 25 pts)
5. differentialDiagnoses (0 a 10 pts)
6. treatment (0 a 15 pts)
7. safetyAndConduct (0 a 5 pts)
totalScore DEBE ser la suma exacta de los 7 apartados.

Devuelve estrictamente este JSON válido con explicaciones claras y didácticas en español:
{
  "totalScore": 84,
  "breakdown": {
    "anamnesis": 12,
    "physicalExam": 13,
    "studiesInterpretation": 12,
    "primaryDiagnosis": 22,
    "differentialDiagnoses": 8,
    "treatment": 12,
    "safetyAndConduct": 5
  },
  "categoryDetails": {
    "anamnesis": {
      "whyScore": "Explicación concreta de por qué se asignó este puntaje según las preguntas realizadas.",
      "strengths": ["Acierto 1 en anamnesis"],
      "missingOrImprove": ["Pregunta o tema específico que faltó interrogar"],
      "expectedStandard": "Qué interrogatorio habría merecido 15/15."
    },
    "physicalExam": {
      "whyScore": "Por qué obtuvo este puntaje según maniobras detectadas vs omitidas.",
      "strengths": ["Maniobra acertada"],
      "missingOrImprove": ["Maniobra clave omitida"],
      "expectedStandard": "Exploración física ideal esperada."
    },
    "studiesInterpretation": {
      "whyScore": "Por qué obtuvo este puntaje según pertinencia diagnóstica de los estudios pedidos.",
      "strengths": ["Estudio bien elegido"],
      "missingOrImprove": ["Estudio clave faltante o estudio innecesario pedido"],
      "expectedStandard": "Abordaje paraclínico recomendado."
    },
    "primaryDiagnosis": {
      "whyScore": "Comparación explícita entre lo escrito por el usuario y el diagnóstico definitivo.",
      "strengths": ["Aciertos diagnósticos o fisiopatológicos"],
      "missingOrImprove": ["Precisión de etiología, gravedad o justificación faltante"],
      "expectedStandard": "Diagnóstico exacto esperado y su sustento."
    },
    "differentialDiagnoses": {
      "whyScore": "Evaluación de los diagnósticos diferenciales propuestos.",
      "strengths": ["Diferencial pertinente"],
      "missingOrImprove": ["Diferencial clave que faltó considerar"],
      "expectedStandard": "Lista de diferenciales prioritarios."
    },
    "treatment": {
      "whyScore": "Por qué obtuvo este puntaje en fármacos, dosis, vías, duración y medidas generales.",
      "strengths": ["Fármaco o medida acertada"],
      "missingOrImprove": ["Fármaco, dosis o medida general que faltó o estuvo errónea"],
      "expectedStandard": "Esquema terapéutico óptimo resumido."
    },
    "safetyAndConduct": {
      "whyScore": "Evaluación de destino hospitalario, criterios de referencia, seguimiento y seguridad.",
      "strengths": ["Conducta segura"],
      "missingOrImprove": ["Qué faltó en referencia, seguimiento o seguridad"],
      "expectedStandard": "Conducta médica óptima esperada."
    }
  },
  "classification": "Muy buen desempeño",
  "criticalSafetyErrors": [],
  "differentialExplanations": [
    {
      "diagnosis": "Nombre de diagnóstico diferencial clave",
      "rationale": "Por qué debe considerarse al inicio y qué hallazgos clínicos o paraclínicos lo descartan frente al diagnóstico real."
    }
  ],
  "feedback": {
    "diagnosisAccuracyComment": "Análisis didáctico comparando diagnóstico del alumno vs real.",
    "reasoningEvaluation": "Evaluación detallada de la calidad del razonamiento clínico.",
    "differentialEvaluation": "Análisis didáctico de los diferenciales.",
    "workupCritique": "Crítica detallada sobre estudios pedidos vs óptimos.",
    "treatmentCritique": "Explicación didáctica completa sobre fármacos, dosis, vías, alternativas y por qué de cada indicación.",
    "pedagogicalPearls": ["Perla clínica 1", "Perla clínica 2", "Perla clínica 3"],
    "guidelinesSummary": "Resumen de guías internacionales aplicables."
  },
  "resolvedAt": "${new Date().toISOString()}"
}`;

        const geminiCall = ai.models
          .generateContent({
            model: 'gemini-4-hydrogen',
            contents: evaluationPrompt,
            config: {
              responseMimeType: 'application/json',
              thinkingConfig: { thinkingLevel: ThinkingLevel.MEDIUM },
            },
          })
          .catch(() => null);

        const timerPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 11000));
        const response: any = await Promise.race([geminiCall, timerPromise]);

        if (response && response.text) {
          const cleanText = response.text
            .replace(/```json/gi, '')
            .replace(/```/g, '')
            .trim();

          const parsed = JSON.parse(cleanText) as EvaluationResult;
          if (parsed && typeof parsed.totalScore === 'number' && parsed.breakdown) {
            return res.json({
              evaluation: enrichEvaluationWithDidactics(parsed, userSubmission, caseData),
            });
          }
        }
      } catch {
        // Proceder al motor didáctico determinista
      }
    }

    const fallbackResult = buildDidacticEvaluation(userSubmission, caseData);
    return res.json({ evaluation: fallbackResult });
  } catch {
    return res.status(500).json({ error: 'Error al procesar la evaluación clínica' });
  }
});

// Vite Middleware for development & static serving for production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist/index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Medical Case Simulator Server running on port ${PORT}`);
  });
}

startServer();
