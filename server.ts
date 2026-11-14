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
  isSimilarToPrevious,
  PatientChatPayload,
} from './serverPatientChat.js';

dotenv.config();

const AI_CLINICAL_SEEDS: Record<Exclude<Specialty, 'aleatorio'>, string[]> = {
  infectologia: [
    'Leptospirosis grave (Síndrome de Weil)',
    'Paludismo grave por Plasmodium falciparum',
    'Fiebre tifoidea complicada',
    'Brucelosis subaguda con sacroileítis',
    'Tétanos generalizado',
  ],
  cardiologia: [
    'Disección aórtica aguda tipo A de Stanford',
    'Endocarditis infecciosa de válvula aórtica',
    'Taquicardia supraventricular por reentrada nodal',
    'Bloqueo auriculoventricular completo sintomático',
    'Miocarditis aguda viral simulando síndrome coronario',
  ],
  cirugia_general: [
    'Diverticulitis aguda sigmoidea complicada (Hinchey II)',
    'Isquemia mesentérica aguda embólica',
    'Úlcera péptica perforada con neumoperitoneo',
    'Hernia inguinal encarcerada / estrangulada',
    'Vólvulo de sigmoides',
  ],
  endocrinologia: [
    'Estado hiperosmolar hiperglucémico no cetósico',
    'Coma mixedematoso por hipotiroidismo severo descompensado',
    'Feocromocitoma en crisis adrenérgica',
    'Hiponatremia severa sintomática por SIADH',
    'Hipocalcemia aguda severa post-tiroidectomía',
  ],
  neurologia: [
    'Hemorragia subaracnoidea aneurismática',
    'Status epiléptico convulsivo generalizado',
    'Crisis miasténica (Miastenia Gravis)',
    'Encefalitis viral por Herpes Simple (VHS-1)',
    'Trombosis de senos venosos cerebrales',
  ],
  neumologia: [
    'Exacerbación grave de EPOC con insuficiencia respiratoria hipercápnica',
    'Empiema pleural paraneumónico complicado',
    'Absceso pulmonar por aspiración',
    'Síndrome de distrés respiratorio agudo (SDRA) por influenza grave',
    'Hemoptisis masiva por bronquiectasias',
  ],
  medicina_interna: [
    'Lupus eritematoso sistémico con nefritis lúpica y serositis',
    'Púrpura trombocitopénica trombótica (PTT)',
    'Arteritis de células gigantes (temporal) con riesgo visual',
    'Polimiositis / rabdomiólisis severa',
    'Crisis blástica / síndrome de lisis tumoral',
  ],
  urgencias: [
    'Intoxicación aguda por monóxido de carbono',
    'Intoxicación grave por paracetamol (acetaminofén)',
    'Golpe de calor clásico / por esfuerzo con falla multiorgánica',
    'Angioedema hereditario o inducido por IECA con compromiso laríngeo',
    'Choque hemorrágico por trauma abdominal cerrado',
  ],
  pediatria: [
    'Estenosis hipertrófica del píloro en lactante',
    'Epiglotitis aguda / traqueítis bacteriana',
    'Enfermedad de Kawasaki clásica',
    'Síndrome urémico hemolítico postdiarreico',
    'Purpura de Henoch-Schönlein con dolor abdominal',
  ],
  gastroenterologia: [
    'Encefalopatía hepática aguda precipitada por hemorragia/infección',
    'Hepatitis alcohólica aguda grave',
    'Colitis ulcerosa aguda grave (megacolon tóxico incipiente)',
    'Síndrome de Boerhaave (perforación esofágica tras vómitos)',
    'Peritonitis bacteriana espontánea en paciente cirrótico',
  ],
  nefrologia: [
    'Glomerulonefritis aguda postestreptocócica',
    'Síndrome nefrótico primario con trombosis venosa renal',
    'Rabdomiólisis con lesión renal aguda mioglobinúrica',
    'Nefritis intersticial aguda inmunoalérgica por fármacos',
  ],
  ginecologia: [
    'Torsión ovárica aguda con quiste anexial',
    'Endometritis / sepsis puerperal postparto',
    'Desprendimiento prematuro de placenta normoinserta (DPPNI)',
    'Enfermedad pélvica inflamatoria con absceso tubo-ovárico',
  ],
  traumatologia: [
    'Síndrome de cauda equina por hernia discal lumbar masiva',
    'Artritis séptica aguda de rodilla',
    'Luxación posterior traumática de cadera',
    'Fractura pélvica inestable en libro abierto',
  ],
  dermatologia: [
    'Fascitis necrotizante temprana de extremidad',
    'Herpes zóster oftálmico con signo de Hutchinson',
    'Pénfigo vulgar con compromiso mucocutáneo extenso',
    'Púrpura fulminans / vasculitis leucocitoclástica severa',
  ],
  psiquiatria: [
    'Síndrome neuroléptico maligno por antipsicóticos',
    'Intoxicación aguda por litio en trastorno bipolar',
    'Intoxicación por antidepresivos tricíclicos con toxicidad cardíaca',
    'Catatonía maligna aguda',
  ],
};

const AI_OUTPATIENT_SEEDS: Record<Exclude<Specialty, 'aleatorio'>, string[]> = {
  infectologia: [
    'Faringoamigdalitis aguda estreptocócica en consulta externa',
    'Sinusitis bacteriana aguda postviral',
    'Gastroenteritis aguda infecciosa leve ambulatoria',
    'Diarrea del viajero leve sin deshidratación grave',
  ],
  cardiologia: [
    'Hipertensión arterial sistémica esencial grado 1-2 de reciente diagnóstico',
    'Angina estable crónica típica en consulta externa',
    'Fibrilación auricular crónica estable en primer nivel',
    'Insuficiencia venosa crónica sintomática',
  ],
  cirugia_general: [
    'Hernia inguinal reductible no complicada en consulta externa',
    'Enfermedad hemorroidal interna grado II sangrante leve',
    'Colelitiasis sintomática simple (cólico biliar no complicado)',
    'Quiste pilonidal crónico no abscedado',
  ],
  endocrinologia: [
    'Hipotiroidismo primario clínico (Tiroiditis de Hashimoto)',
    'Diabetes mellitus tipo 2 de debut estable sin cetosis',
    'Síndrome metabólico y dislipidemia mixta primaria',
    'Hipertiroidismo leve por enfermedad de Graves ambulatorio',
  ],
  neurologia: [
    'Migraña clásica sin aura en consulta externa',
    'Cefalea tensional episódica frecuente',
    'Parálisis facial periférica idiopática (Parálisis de Bell)',
    'Síndrome del túnel carpiano moderado (confirmado por electromiografía)',
    'Radiculopatía lumbar S1 por hernia discal con electromiografía',
  ],
  neumologia: [
    'Asma bronquial leve persistente en consulta externa',
    'Bronquitis aguda viral en adulto sano',
    'EPOC estable grupo B en seguimiento ambulatorio',
    'Tos crónica secundaria a goteo retronasal / rinitis alérgica',
  ],
  medicina_interna: [
    'Anemia ferropénica crónica por hipermenorrea',
    'Anemia megaloblástica y neuropatía por deficiencia de vitamina B12',
    'Osteomalacia / miopatía proximal por deficiencia severa de vitamina D',
    'Gota aguda (podagra) en primer nivel',
    'Osteoartritis sintomática de rodilla',
  ],
  urgencias: [
    'Vértigo posicional paroxístico benigno (VPPB)',
    'Urticaria aguda leve sin anafilaxia',
    'Cuerpo extraño corneal superficial / conjuntivitis bacteriana aguda',
    'Cólico renal leve no complicado ambulatorio',
  ],
  pediatria: [
    'Otitis media aguda no complicada en escolar',
    'Gastroenteritis viral leve con deshidratación mínima en preescolar',
    'Impétigo contagioso no ampolloso en niño',
    'Faringitis viral / resfriado común vs estreptocócica en escolar',
  ],
  gastroenterologia: [
    'Enfermedad por reflujo gastroesofágico (ERGE) típica',
    'Síndrome de intestino irritable (Roma IV)',
    'Dispepsia funcional / gastritis crónica asociada a H. pylori',
    'Estreñimiento crónico funcional',
  ],
  nefrologia: [
    'Cistitis aguda no complicada en mujer joven',
    'Litiasis renal pequeña no obstructiva en consulta externa',
    'Microalbuminuria incipiente en paciente hipertenso/diabético',
  ],
  ginecologia: [
    'Candidiasis vulvovaginal aguda no complicada',
    'Vaginosis bacteriana en consulta externa',
    'Síndrome de ovario poliquístico (SOP)',
    'Dismenorrea primaria en mujer joven',
  ],
  traumatologia: [
    'Esguince lateral de tobillo grado I-II (Ottawa negativo)',
    'Lumbalgia mecánica aguda sin radiculopatía',
    'Tendinitis del manguito rotador / hombro doloroso',
    'Fascitis plantar crónica en consulta externa',
  ],
  dermatologia: [
    'Herpes zóster torácico no complicado (<72 h)',
    'Tiña corporal (dermatofitosis superficial)',
    'Dermatitis atópica leve-moderada en brote ambulatorio',
    'Acné vulgar moderado en adolescente/adulto joven',
  ],
  psiquiatria: [
    'Trastorno de ansiedad generalizada en primer nivel',
    'Episodio depresivo mayor leve a moderado ambulatorio',
    'Trastorno de insomnio crónico primario',
    'Trastorno de pánico en consulta externa',
  ],
};

function normalizeDiag(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function extractJsonObject(raw: string): string {
  const cleaned = raw.replace(/```json/gi, '').replace(/```/g, '').trim();
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    return cleaned.slice(firstBrace, lastBrace + 1);
  }
  return cleaned;
}

function pickLeastRecentlySeen(
  pool: ClinicalCase[],
  excludeCaseIds: string[],
  excludeCaseId?: string
): ClinicalCase {
  const filtered = excludeCaseId && pool.length > 1
    ? pool.filter((c) => c.id !== excludeCaseId)
    : pool;
  if (filtered.length === 1) return filtered[0];

  const scored = filtered.map((c) => {
    const idx = excludeCaseIds.lastIndexOf(c.id);
    return { item: c, recency: idx === -1 ? -1 : idx };
  });
  scored.sort((a, b) => a.recency - b.recency);
  const minRecency = scored[0].recency;
  const tiedBest = scored.filter((s) => s.recency === minRecency).map((s) => s.item);
  return tiedBest[Math.floor(Math.random() * tiedBest.length)];
}

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

const PORT = Number(process.env.PORT) || 3000;

// Shared Gemini API client instance with recommended telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Valid free-tier models in priority order with per-model quota circuit breaker
const GEMINI_FREE_MODELS = ['gemini-4-hydrogen', 'gemini-3.1-flash-lite'] as const;
const modelCooldownUntil: Record<string, number> = {};
const loggedCooldownForModel = new Set<string>();

function isQuotaOrRateLimitError(err: any): boolean {
  const raw =
    typeof err === 'string'
      ? err
      : `${err?.message || ''} ${err?.status || ''} ${JSON.stringify(err || '')}`;
  return (
    err?.status === 429 ||
    err?.code === 429 ||
    /429|RESOURCE_EXHAUSTED|quota|rate[- ]?limit/i.test(raw)
  );
}

function extractRetryCooldownMs(err: any): number {
  const raw =
    typeof err === 'string'
      ? err
      : `${err?.message || ''} ${JSON.stringify(err || '')}`;
  const secMatch = raw.match(/retryDelay["':\s]+(\d+)s/i);
  if (secMatch) {
    const secs = Number(secMatch[1]);
    if (Number.isFinite(secs) && secs > 0) {
      return Math.min(Math.max(secs * 1000, 60_000), 60 * 60_000);
    }
  }
  return 30 * 60_000;
}

function markModelFailure(model: string, err: any): void {
  if (isQuotaOrRateLimitError(err)) {
    const cooldownMs = extractRetryCooldownMs(err);
    modelCooldownUntil[model] = Date.now() + cooldownMs;
    if (!loggedCooldownForModel.has(model)) {
      loggedCooldownForModel.add(model);
      console.info(`[gemini] ${model} alcanzó el límite de cuota; usando respaldo local/modelo alterno.`);
    }
  }
}

async function callGeminiWithFallback(options: {
  contents: string;
  systemInstruction?: string;
  responseMimeType?: string;
  thinkingLevel?: ThinkingLevel;
  timeoutMs: number;
  modelsOverride?: readonly string[];
}): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') return null;

  const modelsToTry = options.modelsOverride || GEMINI_FREE_MODELS;
  const deadline = Date.now() + options.timeoutMs;

  for (let i = 0; i < modelsToTry.length; i++) {
    const model = modelsToTry[i];
    const now = Date.now();
    if (now < (modelCooldownUntil[model] || 0)) continue;

    const remainingMs = deadline - now;
    if (remainingMs < 1200) break;

    const hasNextAvailable = modelsToTry.slice(i + 1).some(
      (nextModel) => now >= (modelCooldownUntil[nextModel] || 0)
    );
    const attemptTimeoutMs = hasNextAvailable
      ? Math.min(remainingMs, Math.max(2200, Math.floor(remainingMs * 0.6)))
      : remainingMs;

    const config: Record<string, any> = {};
    if (options.systemInstruction) config.systemInstruction = options.systemInstruction;
    if (options.responseMimeType) config.responseMimeType = options.responseMimeType;
    if (model === 'gemini-4-hydrogen' && options.thinkingLevel) {
      config.thinkingConfig = { thinkingLevel: options.thinkingLevel };
    }

    const aiCall = ai.models
      .generateContent({
        model,
        contents: options.contents,
        config,
      })
      .catch((err) => {
        markModelFailure(model, err);
        return null;
      });

    const timerPromise = new Promise<null>((resolve) =>
      setTimeout(() => resolve(null), attemptTimeoutMs)
    );

    const response: any = await Promise.race([aiCall, timerPromise]);
    const text = response?.text?.trim();
    if (text) {
      loggedCooldownForModel.delete(model);
      return text;
    }
  }

  return null;
}

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

    const filterCompatibleFallbackPool = (pool: ClinicalCase[], targetMode: GameMode): ClinicalCase[] => {
      if (targetMode === 'urgencias') {
        const acute = pool.filter(
          (c) =>
            c.solution?.optimalTreatment?.hospitalizationDecision !== 'Ambulatorio' ||
            /Nivel I\b|Nivel II\b|Nivel III\b/.test(c.patientInfo?.triageLevel || '')
        );
        return acute.length > 0 ? acute : pool;
      }
      if (targetMode === 'principiante') {
        const mild = pool.filter(
          (c) =>
            c.mode === 'principiante' ||
            c.mode === 'medico_general' ||
            c.solution?.optimalTreatment?.hospitalizationDecision === 'Ambulatorio'
        );
        return mild.length > 0 ? mild : pool;
      }
      return pool;
    };

    // Serve unseen curated cases first matching requested specialty/mode so all curated cases rotate without wasting API quota
    const excludeSet = new Set<string>(excludeCaseIds);
    if (excludeCaseId) excludeSet.add(excludeCaseId);

    const unseenMatches = ALL_CURATED_CASES.filter((c) => {
      if (excludeSet.has(c.id)) return false;
      if (specialty !== 'aleatorio' && c.specialty !== specialty) return false;
      return c.mode === mode;
    });

    const unseenAnyModeInSpec =
      specialty !== 'aleatorio'
        ? filterCompatibleFallbackPool(
            ALL_CURATED_CASES.filter((c) => !excludeSet.has(c.id) && c.specialty === specialty),
            mode
          )
        : [];

    if (unseenMatches.length > 0) {
      const picked = unseenMatches[Math.floor(Math.random() * unseenMatches.length)];
      return res.json({ case: { ...picked, mode }, source: 'preset' });
    }

    if (unseenAnyModeInSpec.length > 0) {
      const picked = unseenAnyModeInSpec[Math.floor(Math.random() * unseenAnyModeInSpec.length)];
      return res.json({ case: { ...picked, mode }, source: 'preset' });
    }

    // Try AI generation once unseen curated matches are exhausted (and quota is available)
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY') {
      try {
        const allSpecialties = Object.keys(AI_CLINICAL_SEEDS) as Array<Exclude<Specialty, 'aleatorio'>>;
        const targetSpecialty: Exclude<Specialty, 'aleatorio'> =
          specialty === 'aleatorio'
            ? allSpecialties[Math.floor(Math.random() * allSpecialties.length)]
            : specialty;

        const specialtyLabel = SPECIALTY_LABELS[targetSpecialty] || targetSpecialty;
        const modeGuidance = MODE_DESCRIPTIONS[mode] || MODE_DESCRIPTIONS.medico_general;

        const normExcluded = excludeDiagnoses.map(normalizeDiag);
        const complexSeeds = AI_CLINICAL_SEEDS[targetSpecialty] || [];
        const outpatientSeeds = AI_OUTPATIENT_SEEDS[targetSpecialty] || [];
        const seedCandidates =
          mode === 'principiante'
            ? outpatientSeeds
            : mode === 'medico_general'
              ? [...outpatientSeeds, ...complexSeeds.slice(0, 2)]
              : complexSeeds;
        const freshSeeds = seedCandidates.filter((seed) => {
          const normSeed = normalizeDiag(seed);
          const seedMain = normSeed.split('(')[0].trim();
          return !normExcluded.some(
            (ex) => ex.includes(seedMain.slice(0, 14)) || normSeed.includes(ex.slice(0, 14))
          );
        });
        const activeSeeds = freshSeeds.length > 0 ? freshSeeds : seedCandidates;
        const chosenSeed =
          activeSeeds.length > 0
            ? activeSeeds[Math.floor(Math.random() * activeSeeds.length)]
            : `Patología clínica relevante y poco repetida de ${specialtyLabel}`;

        const specialtyPrompt = `ESPECIALIDAD OBLIGATORIA: ${specialtyLabel} (campo JSON "specialty" debe ser exactamente "${targetSpecialty}").
PATOLOGÍA ASIGNADA PARA ESTE CASO (NO LA CAMBIES POR OTRA REPETITIVA): "${chosenSeed}".`;

        const antiRepeatPrompt =
          excludeDiagnoses.length > 0
            ? `\nPROHIBIDO REPETIR PATOLOGÍAS RECIENTES: El alumno ya resolvió o vio recientemente: ${excludeDiagnoses.slice(-18).join(', ')}. El diagnóstico principal DEBE corresponder a "${chosenSeed}" y ser completamente distinto a los anteriores.`
            : '';

        const systemInstruction = `Eres un equipo de médicos internistas, urgenciólogos y profesores universitarios de medicina.
Tu objetivo es diseñar un caso clínico interactivo, ultra realista, coherente y desafiante para el simulador médico "MEDICAL CASE SIMULATOR".
Sigue la normativa clínica nacional nicaragüense (MINSA / Lista Básica de Medicamentos) y guías médicas internacionales vigentes (OMS, OPS, AHA, NICE, IDSA).
REGLAS INQUEBRANTABLES:
1. Respeta ESTRICTAMENTE la especialidad ("${targetSpecialty}"), la patología asignada ("${chosenSeed}") y la modalidad de dificultad solicitadas.
2. En "patientInfo.consultReason" escribe ÚNICAMENTE síntomas en lenguaje sencillo del paciente (NUNCA reveles el diagnóstico ni pistas obvias en el motivo de consulta).
3. En "patientInfo.currentIllness" incluye una línea temporal clara (qué pasó el día anterior, hace horas o días, qué comió/tomó) y antecedentes pertinentes (incluyendo contexto sexual/gineco-obstétrico en nonPathological si es relevante).
4. En "studiesPool" incluye tanto las pruebas confirmatorias como estudios secundarios relacionados (por ejemplo TAC, radiografía o ultrasonido que detecten afecciones anatómicas relacionadas, derrames reactivos, inflamación perivisceral, congestión o signos indirectos).
5. NUNCA inventes valores de laboratorio incompatibles con la fisiopatología.
Genera la respuesta estrictamente en formato JSON válido.`;

        const uniqueCaseId = `case-ai-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        const prompt = `Genera un nuevo caso clínico médico ficticio y original (semilla aleatoria: ${Date.now()}-${Math.floor(Math.random() * 100000)}).
${modeGuidance}
${specialtyPrompt}${antiRepeatPrompt}

El JSON debe tener EXACTAMENTE la siguiente estructura (SIN comentarios ni texto fuera del JSON; asegúrate de que "vitalSigns.glasgow" se correlacione estrictamente con "currentIllness" y el examen neurológico: 15 si alerta/orientado, 12-14 si confusión/letargo/afasia, ≤11 si estupor/coma):
{
  "id": "${uniqueCaseId}",
  "mode": "${mode}",
  "specialty": "${targetSpecialty}",
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
      "subcategory": "Hematología" | "Bioquímica" | "Electrolitos" | "Función Hepática" | "Inflamación e Infección" | "Vitaminas y Nutrición" | "Cardiovascular" | "Urinario" | "Gases" | "Microbiología / Serología" | "Radiología" | "Ecografía" | "Tomografía" | "Electrocardiograma" | "Electromiografía y Neurofisiología" | "Función Pulmonar y Audiología" | "Endoscopia y Broncoscopia",
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
      "hospitalizationDecision": "Ambulatorio" | "Observación Urgencias" | "Hospitalización en Sala" | "Quirófano / Cirugía de Urgencia" | "Unidad de Cuidados Intensivos (UCI)",
      "referralCriteria": ["Criterios de referencia"],
      "followUp": "Plan de seguimiento clínico"
    },
    "criticalSafetyAlerts": ["Alertas de seguridad crítica / errores potencialmente mortales a evitar"],
    "guidelineReferences": ["Guías clínicas de referencia"]
  },
  "internalPersonaPrompt": "Instrucción de cómo responde el paciente en el interrogatorio sin revelar el diagnóstico médico."
}`;

        const rawResponseText = await callGeminiWithFallback({
          contents: prompt,
          systemInstruction,
          responseMimeType: 'application/json',
          thinkingLevel: ThinkingLevel.LOW,
          timeoutMs: 28000,
        });

        if (rawResponseText) {
          const rawText = extractJsonObject(rawResponseText);
          const parsed = JSON.parse(rawText) as ClinicalCase;
          if (
            parsed.patientInfo &&
            parsed.vitalSigns &&
            parsed.solution &&
            Array.isArray(parsed.physicalExamPool) &&
            parsed.physicalExamPool.length > 0
          ) {
            parsed.id = uniqueCaseId;
            parsed.mode = mode;
            parsed.specialty = targetSpecialty;
            return res.json({ case: parsed, source: 'ai' });
          }
        }
      } catch {
        // Fallback silencioso a biblioteca curada
      }
    }

    // Fallback inteligente con rotación de baraja anti-repetición (ordenado por menor recencia):

    let chosenBase: ClinicalCase | null = null;

    if (specialty !== 'aleatorio') {
      const bySpecialty = filterCompatibleFallbackPool(
        ALL_CURATED_CASES.filter((c) => c.specialty === specialty),
        mode
      );
      if (bySpecialty.length > 0) {
        const unseenInSpec = bySpecialty.filter((c) => !excludeSet.has(c.id));
        if (unseenInSpec.length > 0) {
          const unseenSpecMode = unseenInSpec.filter((c) => c.mode === mode);
          const pool = unseenSpecMode.length > 0 ? unseenSpecMode : unseenInSpec;
          chosenBase = pool[Math.floor(Math.random() * pool.length)];
        } else {
          const specModePool = bySpecialty.filter((c) => c.mode === mode);
          chosenBase = pickLeastRecentlySeen(
            specModePool.length > 1 ? specModePool : bySpecialty,
            excludeCaseIds,
            excludeCaseId
          );
        }
      }
    }

    if (!chosenBase) {
      const compatibleAll = filterCompatibleFallbackPool(ALL_CURATED_CASES, mode);
      const unseenAll = compatibleAll.filter((c) => !excludeSet.has(c.id));
      if (unseenAll.length > 0) {
        const unseenByMode = unseenAll.filter((c) => c.mode === mode);
        const pool = unseenByMode.length > 0 ? unseenByMode : unseenAll;
        chosenBase = pool[Math.floor(Math.random() * pool.length)];
      } else {
        const allByMode = compatibleAll.filter((c) => c.mode === mode);
        chosenBase = pickLeastRecentlySeen(
          allByMode.length > 1 ? allByMode : compatibleAll,
          excludeCaseIds,
          excludeCaseId
        );
      }
    }

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
        const priorHistory =
          history.length > 0 &&
          history[history.length - 1]?.sender === 'doctor' &&
          history[history.length - 1]?.text?.trim() === userMessage.trim()
            ? history.slice(0, -1)
            : history;

        const systemInstruction = buildPatientSystemInstruction({
          ...payload,
          history: priorHistory,
        });
        const conversationPrompt = `Historial de la consulta médica hasta este momento:
${priorHistory
  .slice(-16)
  .map((m) =>
    m.sender === 'doctor'
      ? `Médico: ${m.text}`
      : m.sender === 'system'
      ? `Evento Clínico: ${m.text}`
      : `Paciente: ${m.text}`
  )
  .join('\n')}

Pregunta actual del Médico: ${userMessage}
Paciente (responde solo con el diálogo natural en primera persona del singular, sin prefijo "Paciente:"):`;

        const rawReply = await callGeminiWithFallback({
          contents: conversationPrompt,
          systemInstruction,
          thinkingLevel: ThinkingLevel.MINIMAL,
          timeoutMs: 5000,
          modelsOverride: ['gemini-3.1-flash-lite', 'gemini-4-hydrogen'],
        });

        if (rawReply) {
          const cleanedAiReply = rawReply.replace(/^Paciente\s*:\s*/i, '').trim();
          const reply = ensureFirstPersonReply(cleanedAiReply, payload.patientInfo);
          const prevPatientNormalized = priorHistory
            .filter((m) => m.sender === 'patient')
            .map((m) =>
              m.text
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[¿?¡!.,;:()"'«»]/g, ' ')
                .replace(/\s+/g, ' ')
                .trim()
            );
          if (reply && !isSimilarToPrevious(reply, prevPatientNormalized)) {
            return res.json({ reply });
          }
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
        const allAbnExams = (caseData.physicalExamPool || []).filter((e) => e.isAbnormal);
        const nativeAbnExams = allAbnExams.filter((e) => !e.id.startsWith('std-pe-'));
        const keyAbnormalExams = (nativeAbnExams.length > 0 ? nativeAbnExams : allAbnExams)
          .map((e) => e.name)
          .join(', ');

        const allAbnStudies = (caseData.studiesPool || []).filter((s) => s.isAbnormal);
        const nativeAbnStudies = allAbnStudies.filter((s) => !s.id.startsWith('hosp-'));
        const keyAbnormalStudies = (nativeAbnStudies.length > 0 ? nativeAbnStudies : allAbnStudies.slice(0, 4))
          .map((s) => s.name)
          .join(', ');

        const evaluationPrompt = `Actúa como un tribunal académico médico universitario sumamente didáctico (Médico Internista, Urgenciólogo, Farmacólogo Clínico y Profesor de Medicina).
Debes evaluar exhaustivamente con criterio justo basado en **Normativa Nicaragüense (MINSA / Lista Básica de Medicamentos, AIEPI, Protocolos de Atención Primaria, Dengue y Obstetricia)** respaldado por **Guías Internacionales vigentes (OMS/OPS, AHA/ESC, IDSA, ADA, KDIGO, GINA/GOLD, NICE)**, enseñando al médico usuario qué hizo bien, POR QUÉ obtuvo cada puntaje y QUÉ LE FALTÓ en cada apartado.

DATOS DEL CASO CLÍNICO:
- Paciente: ${caseData.patientInfo?.name || 'Paciente'}, ${caseData.patientInfo?.age || 35} años, ${caseData.patientInfo?.sex || 'Masculino'}
- Triage y Signos Vitales iniciales: ${caseData.patientInfo?.triageLevel || 'No especificado'} | PA: ${caseData.vitalSigns?.bloodPressure || 'N/D'} | FC: ${caseData.vitalSigns?.heartRate ?? 'N/D'} lpm | FR: ${caseData.vitalSigns?.respiratoryRate ?? 'N/D'} rpm | Temp: ${caseData.vitalSigns?.temperature ?? 'N/D'} °C | SpO₂: ${caseData.vitalSigns?.oxygenSaturation ?? 'N/D'}% | Glasgow: ${caseData.vitalSigns?.glasgow ?? 15}/15
- Diagnóstico Verdadero del Caso: ${caseData.solution?.correctDiagnosis || 'Diagnóstico no especificado'}
- Diagnósticos Diferenciales Principales: ${(caseData.solution?.differentialDiagnoses || []).join(', ')}
- Claves de Descarte: ${(caseData.solution?.criticalRulingOutFactors || []).join(' | ')}
- Fisiopatología clave: ${caseData.solution?.pathophysiology || ''}
- Maniobras físicas con hallazgos alterados clave: ${keyAbnormalExams || 'Ver catálogo'}
- Estudios confirmatorios clave del caso: ${keyAbnormalStudies || 'Ver catálogo'}
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

REGLAS DE EQUIVALENCIA NORMATIVA (NICARAGUA MINSA + INTERNACIONAL) Y RÚBRICA DE 100 PUNTOS:
- SINÓNIMOS Y SIGLAS DIAGNÓSTICAS: Acepta siglas médicas y nomenclatura regional equivalente con puntaje completo si identifican correctamente la patología central (ej. IVU/ITU = Infección de Vías Urinarias/Cistitis; EDAS/GEPI = Gastroenteritis aguda; ACV/EVC/Ictus; IAMCEST/SCACEST/IMA ST elevado; NAC; LRA/IRA; CAD; TEP; HTA; DM2; VPPB; ERGE; SOP; OMA; SSJ; Tiña/Dermatofitosis; Dengue Grupo B2 = Dengue con signos de alarma). No exijas que el médico escriba paréntesis de estadiaje literal (ej. "Killip II" o "Roma IV") para otorgar 23-25 pts si el diagnóstico central es correcto.
- EQUIVALENCIAS TERAPÉUTICAS (LISTA BÁSICA MINSA NICARAGUA + GUÍAS INTERNACIONALES): Da crédito completo cuando el médico prescriba equivalentes terapéuticos válidos de la misma clase o primera línea MINSA/OMS (ej. Acetaminofén=Paracetamol o Metamizol fuera de Dengue/sangrado; Enalapril=Captopril/Lisinopril/Losartán/Irbesartán en HTA; Omeprazol=Pantoprazol/Esomeprazol; Beclometasona=Budesonida/Fluticasona; Dicloxacilina=Cefalexina/Clindamicina; Nitrofurantoína=TMP-SMX/Fosfomicina/Cefalexina en IVU baja; Aciclovir=Valaciclovir; Clopidogrel=Ticagrelor; Estreptoquinasa=Alteplasa; Loratadina=Cetirizina/Clorfeniramina; Sulfato ferroso=Hierro polimaltosado; Fenitoína DFH=Levetiracetam; Hidralazina/Nifedipino/Labetalol/MgSO4 en Preeclampsia; Suero Oral/SRO y SSN 0.9%/Hartmann incluso si se anotaron en Medidas Generales).
- ESTUDIOS CONFIRMATORIOS: Evalúa sobre los estudios confirmatorios clave del caso; NO penalices si el médico no pidió estudios secundarios adicionales del menú general hospitalario.
- ANAMNESIS ADAPTADA: En cuadros focalizados simples de primer nivel (ej. esguince, cistitis simple, tiña, faringoamigdalitis), un interrogatorio dirigido y eficiente (3-4 preguntas clave con signos de alarma y alergias) merece 13-15/15 sin exigir preguntas irrelevantes (como viajes o vida sexual).
- APARTADOS VACÍOS Y ESCOPETAZO: Si un apartado está vacío o tiene 0 acciones reales, asigna 0 puntos en ese apartado. Si el usuario desbloqueó casi todo el examen físico o casi todos los estudios sin discriminación ("escopetazo diagnóstico"), penaliza 3 a 4 puntos.
- ALERGIAS A PENICILINA / BETALACTÁMICOS (AAAAI/ACAAI 2022 y NICE): En alérgicos a penicilina, SÍ son error crítico las penicilinas y cefalosporinas de cadena lateral R1 compartida (cefalexina, cefadroxilo, cefaclor). Macrólidos, fluoroquinolonas, aztreonam y carbapenémicos (meropenem, imipenem, ertapenem) NO deben marcarse como error anafiláctico por alergia a penicilina.
- CLÁUSULAS DE SUSPENSIÓN: "Suspender/Evitar [fármaco]" en medidas generales es correcto, jamás lo cuentes como prescripción.
- SIGNOS VITALES NORMALES EN JUSTIFICACIÓN: Si los signos vitales del paciente están dentro de parámetros normales, NUNCA afirmes que esos signos vitales normales justifican o explican la enfermedad; úsalos solo para señalar estabilidad clínica/ausencia de alarma sistémica y enfoca el razonamiento en los síntomas, la exploración física y los estudios.
- PROPORCIONALIDAD DE ERRORES CRÍTICOS ("criticalSafetyErrors"): Reserva "criticalSafetyErrors" exclusivamente para contraindicaciones graves con riesgo vital o daño mayor real (ej. anafilaxia por alergia documentada, AINE/AAS en Dengue o hemorragia activa grave, potasio en hiperkalemia severa, omisión de adrenalina en anafilaxia, o egreso ambulatorio en emergencia vital inestable). NO coloques ahí omisiones diagnósticas, falta de estudios ni errores leves en pacientes estables.
- USO RACIONAL Y CONDUCTA ESTRICTA: Penaliza 1–2 pts antibióticos injustificados en cuadros virales/mecánicos o TAC/RMN innecesaria de entrada en cuadros ambulatorios simples. En conducta y destino (3 pts destino + 1 pt referencia + 1 pt seguimiento = 5 pts): sé estricto con el nivel asistencial. "Hospitalización en Sala" cuando el paciente exige "Unidad de Cuidados Intensivos (UCI)" o "Quirófano / Cirugía de Urgencia" NO es acierto completo (máximo 1/3 en destino, marcado como subestimación). "Observación Urgencias" cuando exige "Hospitalización" o viceversa recibe máximo 1/3; "Hospitalización/UCI/Quirófano" en un cuadro "Ambulatorio" recibe 0/3; y "Ambulatorio" en cuadro hospitalario/UCI/quirúrgico recibe 0/3 y error de seguridad. Solo otorga 3/3 al destino exacto (o "Quirófano / Cirugía de Urgencia" en patologías quirúrgicas agudas).
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

        const rawEvalText = await callGeminiWithFallback({
          contents: evaluationPrompt,
          responseMimeType: 'application/json',
          thinkingLevel: ThinkingLevel.MEDIUM,
          timeoutMs: 11000,
        });

        if (rawEvalText) {
          const cleanText = extractJsonObject(rawEvalText);

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

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Medical Case Simulator Server running on port ${PORT}`);
  });
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;
