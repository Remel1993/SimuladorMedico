export interface PatientChatPayload {
  history?: Array<{ sender: string; text: string }>;
  userMessage: string;
  patientPersona?: string;
  patientInfo?: {
    name?: string;
    age?: number;
    sex?: string;
    occupation?: string;
    consultReason?: string;
    evolutionTime?: string;
    currentIllness?: string;
    triageLevel?: string;
  };
  vitalSigns?: {
    bloodPressure?: string;
    heartRate?: number;
    respiratoryRate?: number;
    temperature?: number;
    oxygenSaturation?: number;
    glasgow?: number;
    bloodGlucose?: number;
    weightKg?: number;
    heightCm?: number;
  };
  background?: {
    pathological?: string[];
    nonPathological?: string[];
    family?: string[];
    surgical?: string[];
    currentMedications?: string[];
    allergies?: string[];
  };
  caseId?: string;
}

/**
 * Normaliza texto español quitando acentos y signos de puntuación para comparación robusta.
 */
function normalizeText(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[¿?¡!.,;:()"'«»]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function hasWord(normText: string, patterns: string[]): boolean {
  return patterns.some((pattern) => {
    const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(?:^|\\s)${escaped}(?:\\s|$)`, 'i');
    return regex.test(normText);
  });
}

function hasWordPrefix(normText: string, prefixes: string[]): boolean {
  return prefixes.some((prefix) => {
    if (prefix.includes(' ')) {
      return normText.includes(prefix);
    }
    const escaped = prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(?:^|\\s)${escaped}[a-zñ0-9]*`, 'i');
    return regex.test(normText);
  });
}

function joinList(items?: string[], fallback = 'ninguno que recuerde'): string {
  if (!items || items.length === 0) return fallback;
  return items.join('; ');
}

function listIndicatesNone(items?: string[]): boolean {
  if (!items || items.length === 0) return true;
  const joined = normalizeText(items.join(' '));
  return (
    joined.includes('niega') ||
    joined.includes('ningun') ||
    joined.includes('sin antecedentes') ||
    joined.includes('sin alergia') ||
    joined.includes('no conoci') ||
    joined.includes('no recuerda') ||
    joined.includes('desconoc') ||
    joined.includes('no refiere') ||
    joined.includes('no hay')
  );
}

function capitalizeFirst(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const WB_END = '(?![a-zA-ZáéíóúüñÁÉÍÓÚÜÑ0-9_])';
const WB_START = '(?<![a-zA-ZáéíóúüñÁÉÍÓÚÜÑ0-9_])';

/**
 * Convierte texto clínico escrito en 3ra persona (currentIllness, background, respuestas LLM accidentales)
 * a 1ra persona natural del paciente (o de la madre/padre si es un paciente pediátrico < 12 años).
 */
export function toFirstPersonClinicalSpeech(
  sentence: string,
  patientInfo?: PatientChatPayload['patientInfo']
): string {
  if (!sentence) return '';
  let out = sentence.trim();
  const isPediatric = patientInfo?.age !== undefined && patientInfo.age < 12;

  if (isPediatric) {
    out = out
      .replace(
        /^(?:Lactante|Paciente(?:\s+pedi[aá]tric[oa])?)\s+(?:masculino|femenino|femenina)\s+de\s+[\w\s]+?(?:tra[ií]d[oa](?:\s+\w+){0,3}\s+por\s+su\s+(?:madre|mam[aá]|padre|pap[aá])(?:\s*\([^)]*\))?\.?\s*)/i,
        'Soy su mamá y traje a mi niño porque se siente mal. '
      )
      .replace(/^(?:Lactante|Paciente(?:\s+pedi[aá]tric[oa])?)\s+(?:masculino|femenino|femenina)\s+de\s+\d+\s+(?:a[ñn]os?|meses|d[ií]as)\s*,?\s*/i, 'Mi niño ')
      .replace(/\baplicados por la madre\b/gi, 'que le puse yo')
      .replace(/\bpor su madre\b/gi, 'por mí (su mamá)')
      .replace(/\ben brazos de la madre\b/gi, 'en mis brazos')
      .replace(/\bAsiste a guarder[ií]a\b/gi, 'Mi niño va a la guardería')
      .replace(/\bRefiere que\b/gi, 'Le cuento que')
      .replace(new RegExp(`${WB_START}refiere${WB_END}`, 'gi'), 'tiene')
      .replace(new RegExp(`${WB_START}present[oó]${WB_END}`, 'gi'), 'tuvo')
      .replace(new RegExp(`${WB_START}presenta${WB_END}`, 'gi'), 'tiene')
      .replace(new RegExp(`${WB_START}inici[oó]${WB_END}`, 'gi'), 'empezó')
      .replace(new RegExp(`${WB_START}comenz[oó]${WB_END}`, 'gi'), 'empezó')
      .replace(/\bsu hermano\b/gi, 'su hermanito');
    out = out.replace(/([.!?]\s+)([a-záéíóúüñ])/g, (_, p1, p2) => `${p1}${p2.toUpperCase()}`);
    return capitalizeFirst(out.replace(/\s+/g, ' ').trim());
  }

  out = out
    // Encabezados típicos de historia clínica
    .replace(
      /^Paciente\s+(?:masculino|femenino|femenina)\s+de\s+\d+\s+a[ñn]os\s*,?\s*(?:con antecedente de\s+)/i,
      'Tengo antecedente de '
    )
    .replace(
      /^Paciente\s+(?:masculino|femenino|femenina)\s+de\s+\d+\s+a[ñn]os\s*,?\s*(?:sin antecedentes relevantes,?\s*)/i,
      ''
    )
    .replace(
      /^Paciente\s+(?:masculino|femenino|femenina)\s+de\s+\d+\s+a[ñn]os\s*,?\s*(?:fumador(?:a)?\s+pesad[oa],?\s*tra[ií]d[oa]\s+a\s+urgencias\s+(?:con|por)\s+)/i,
      'Fumo mucho desde hace años y me trajeron a urgencias con '
    )
    .replace(
      /^Paciente\s+(?:masculino|femenino|femenina)\s+de\s+\d+\s+a[ñn]os\s*,?\s*(?:residente\s+en\s+)/i,
      'Vivo en '
    )
    .replace(
      /^Paciente\s+(?:masculino|femenino|femenina)\s+de\s+\d+\s+a[ñn]os\s*,?\s*(?:que\s+)?(?:acude|consulta)(?:\s+a\s+urgencias)?\s+por\s+/i,
      'Vengo a urgencias por '
    )
    .replace(
      /^Paciente\s+(?:masculino|femenino|femenina)\s+de\s+\d+\s+a[ñn]os\s*,?\s*a\s+quien\s+le\s+iniciaron\s+/i,
      'Me iniciaron '
    )
    .replace(
      /^Paciente\s+(?:masculino|femenino|femenina)\s+de\s+\d+\s+a[ñn]os\s*,?\s*(?:quien|que)\s+/i,
      ''
    )
    .replace(/^Paciente\s+(?:masculino|femenino|femenina)\s+de\s+\d+\s+a[ñn]os\s*,?\s*/i, '')
    .replace(/\b(?:Es|Fue)\s+tra[ií]d[oa]\s+(?:a urgencias\s+|en camilla\s+)?por\s+sus\s+compa[ñn]eros(?:\s+de\s+cuarto)?\s+debido\s+a\s+/gi, 'Me trajeron mis compañeros de cuarto porque presenté ')
    .replace(/\b(?:Es|Fue)?\s*tra[ií]d[oa]\s+(?:a urgencias\s+|en camilla\s+)?por\s+([^,.]+?)\s+(?:por|debido a|con)\s+/gi, 'Me trajo $1 por ')
    .replace(/\btra[ií]d[oa]\s+en\s+camilla\s+por\s+personal\s+de\s+sanidad\s+por\s+/gi, 'me trajeron en camilla de sanidad por ')
    // Pronombres y posesivos de 3ra persona referidos al paciente
    .replace(/\bsus\s+compa[ñn]eros\b/gi, 'mis compañeros')
    .replace(/\bsu\s+madre\b/gi, 'mi mamá')
    .replace(/\bsu\s+padre\b/gi, 'mi papá')
    .replace(/\bsu\s+hermano\b/gi, 'mi hermano')
    .replace(/\bsu\s+hermana\b/gi, 'mi hermana')
    .replace(/\bsu\s+esposa\b/gi, 'mi esposa')
    .replace(/\bsu\s+esposo\b/gi, 'mi esposo')
    .replace(/\bsu\s+pareja\b/gi, 'mi pareja')
    .replace(/\bsus\s+dosis\b/gi, 'mis dosis')
    .replace(/\bsu\s+ingesta\b/gi, 'mi ingesta')
    .replace(/\bpor\s+(?:el|la)\s+paciente\b/gi, 'por mí')
    .replace(/\ba\s+(?:el|la)\s+paciente\b|\bal\s+paciente\b/gi, 'a mí')
    .replace(/\b(?:el|la)\s+paciente\b/gi, 'yo')
    // Clíticos de objeto indirecto y frases reflexivas médicas (sin depender de \b tras tildes)
    .replace(new RegExp(`${WB_START}se\\s+acompa[ñn]a\\s+de${WB_END}`, 'gi'), 'además tengo')
    .replace(new RegExp(`${WB_START}se\\s+acompa[ñn][oó]\\s+de${WB_END}`, 'gi'), 'además tuve')
    .replace(new RegExp(`${WB_START}se\\s+asociaron${WB_END}`, 'gi'), 'además me dieron')
    .replace(new RegExp(`${WB_START}no\\s+le\\s+preocup[oó]${WB_END}`, 'gi'), 'no me preocupó')
    .replace(new RegExp(`${WB_START}impidi[eé]ndole${WB_END}`, 'gi'), 'que no me deja')
    .replace(new RegExp(`${WB_START}le\\s+imped[ií]an${WB_END}`, 'gi'), 'no me dejaban')
    .replace(new RegExp(`${WB_START}le\\s+impide${WB_END}`, 'gi'), 'no me deja')
    .replace(new RegExp(`${WB_START}le\\s+iniciaron${WB_END}`, 'gi'), 'me iniciaron')
    .replace(new RegExp(`${WB_START}le\\s+recetaron${WB_END}`, 'gi'), 'me recetaron')
    .replace(new RegExp(`${WB_START}le\\s+colocaron${WB_END}`, 'gi'), 'me pusieron')
    .replace(new RegExp(`${WB_START}le\\s+diagnosticaron${WB_END}`, 'gi'), 'me diagnosticaron')
    .replace(new RegExp(`${WB_START}le\\s+duele${WB_END}`, 'gi'), 'me duele')
    .replace(new RegExp(`${WB_START}le\\s+baj[oó]${WB_END}`, 'gi'), 'me bajó')
    .replace(new RegExp(`${WB_START}lo\\s+toma${WB_END}`, 'gi'), 'lo tomo')
    .replace(new RegExp(`${WB_START}no\\s+deb[ií]a\\s+aplicarse${WB_END}`, 'gi'), 'no debía ponerme')
    .replace(new RegExp(`${WB_START}creyendo\\s+err[oó]neamente\\s+que${WB_END}`, 'gi'), 'pensando equivocadamente que')
    // Jerga médica convertida a lenguaje natural de paciente
    .replace(/\bdisnea de inicio s[uú]bito en reposo\b/gi, 'falta de aire repentina estando quieto')
    .replace(/\bdisnea\b/gi, 'falta de aire')
    .replace(/\bdolor tor[aá]cico tipo pleur[ií]tico\b/gi, 'punzada en el pecho al respirar')
    .replace(/\btaquicardia\b/gi, 'el corazón muy acelerado')
    .replace(/\bprurito intenso\b/gi, 'comezón desesperante')
    .replace(/\bprurito\b/gi, 'comezón')
    .replace(/\bdiaforesis profusa\b/gi, 'muchísimo sudor')
    .replace(/\binmovilidad relativa\b/gi, 'casi sin moverme')
    .replace(/\baumento de volumen\b/gi, 'hinchazón')
    .replace(/\bmucosa oral\b/gi, 'por dentro de la boca')
    .replace(/\bmialgias generalizadas y artralgias\b/gi, 'dolor fuerte de cuerpo y articulaciones')
    .replace(/\bcefalea retroocular intensa\b/gi, 'dolor fuerte detrás de los ojos')
    .replace(/\bcefalea frontal intensa\b/gi, 'dolor de cabeza muy fuerte en la frente')
    .replace(/\bcefalea\b/gi, 'dolor de cabeza')
    .replace(/\bepigastralgia\b|\bepigastrio\b/gi, 'la boca del estómago')
    .replace(/\bhipocondrio derecho\b/gi, 'debajo de las costillas derechas')
    .replace(/\bfosa lumbar\b/gi, 'espalda baja')
    .replace(/\bprimigesta con embarazo actual de\b/gi, 'es mi primer embarazo y tengo')
    // Verbos clínicos de 3ra persona -> 1ra persona (sin corromper "se refiere")
    .replace(/\bRefieren\s+que\b|\bRefiere\s+que\b/g, 'Le cuento que')
    .replace(/\brefieren\s+que\b|\brefiere\s+que\b/g, 'le cuento que')
    .replace(/\brefiere\s+no\s+haber\b/gi, 'no había')
    .replace(/(?<!\bse\s+)\bRefiere\b/g, 'Tengo')
    .replace(/(?<!\bse\s+)\brefiere\b/g, 'tengo')
    .replace(/\bRelata\b/g, 'Recuerdo')
    .replace(/\brelata\b/g, 'recuerdo')
    .replace(/\bacude\s+nuevamente\s+refiriendo\b/gi, 'vengo otra vez porque tengo')
    .replace(/\bacude\s+(?:a\s+urgencias\s+)?por\b/gi, 'vengo por')
    .replace(/\bacude\b/gi, 'vengo')
    .replace(/\bque\s+consulta\s+por\b|\bconsulta\s+por\b/gi, 'vengo por')
    .replace(/\bal\s+levantarse\b/gi, 'al levantarme')
    .replace(/\bsin\s+haberse\b/gi, 'sin haberme')
    .replace(new RegExp(`${WB_START}presenta${WB_END}`, 'gi'), 'tengo')
    .replace(new RegExp(`${WB_START}presentó${WB_END}`, 'gi'), 'tuve')
    .replace(new RegExp(`${WB_START}ha\\s+presentado${WB_END}`, 'gi'), 'he tenido')
    .replace(new RegExp(`${WB_START}hab[ií]a\\s+permanecido${WB_END}`, 'gi'), 'estuve')
    .replace(new RegExp(`${WB_START}notó${WB_END}`, 'gi'), 'noté')
    .replace(new RegExp(`${WB_START}tuvo${WB_END}`, 'gi'), 'tuve')
    .replace(new RegExp(`${WB_START}tomó${WB_END}`, 'gi'), 'tomé')
    .replace(new RegExp(`${WB_START}probó${WB_END}`, 'gi'), 'probé')
    .replace(new RegExp(`${WB_START}regresó${WB_END}`, 'gi'), 'regresé')
    .replace(new RegExp(`${WB_START}sufrió${WB_END}`, 'gi'), 'sufrí')
    .replace(new RegExp(`${WB_START}consumió${WB_END}`, 'gi'), 'consumí')
    .replace(new RegExp(`${WB_START}suspendió${WB_END}`, 'gi'), 'suspendí')
    .replace(new RegExp(`${WB_START}disminuyó${WB_END}`, 'gi'), 'bajé')
    .replace(new RegExp(`${WB_START}estuvo${WB_END}`, 'gi'), 'estuve')
    .replace(new RegExp(`${WB_START}reside${WB_END}`, 'gi'), 'vivo')
    .replace(new RegExp(`${WB_START}desconocía${WB_END}`, 'gi'), 'no conocía')
    .replace(new RegExp(`${WB_START}no\\s+suele${WB_END}`, 'gi'), 'no suelo')
    .replace(new RegExp(`${WB_START}no\\s+usa${WB_END}`, 'gi'), 'no uso')
    .replace(new RegExp(`${WB_START}niega${WB_END}`, 'gi'), 'no tengo')
    .replace(new RegExp(`(?<!\\b(?:dolor|fiebre|cuadro|malestar|todo|esto|eso|que|cuando|de|al|su|un)\\s+)${WB_START}inició${WB_END}`, 'gi'), 'empecé')
    .replace(new RegExp(`(?<!\\b(?:dolor|fiebre|cuadro|malestar|todo|esto|eso|que|cuando|de|al|su|un)\\s+)${WB_START}comenzó${WB_END}`, 'gi'), 'empecé')
    .replace(/\bempecé\s+dolor\b/gi, 'empecé con dolor')
    .replace(new RegExp(`${WB_START}se\\s+tornó${WB_END}`, 'gi'), 'se volvió')
    // Limpieza sintáctica tras sustituciones y suavizado de encabezados iniciales
    .replace(/^(?:que|y)\s+/i, '')
    .replace(/^Con\s+/i, 'Tengo ')
    .replace(/^En\s+tratamiento\b/i, 'Estoy en tratamiento')
    .replace(/,\s*,/g, ',')
    .replace(/\.{2,}/g, '.')
    .replace(/\s+/g, ' ')
    .replace(/([.!?]\s+)([a-záéíóúüñ])/g, (_, p1, p2) => `${p1}${p2.toUpperCase()}`)
    .trim();

  return capitalizeFirst(out);
}

/**
 * Red de seguridad final para garantizar que NINGUNA respuesta (ni determinista ni IA) salga en 3ra persona clínica.
 */
export function ensureFirstPersonReply(
  reply: string,
  patientInfo?: PatientChatPayload['patientInfo']
): string {
  if (!reply) return reply;
  const trimmed = reply.replace(/\.{2,}/g, '.').trim();
  const hasThirdPersonMarkers =
    /^(?:Paciente|Lactante)\s+/i.test(trimmed) ||
    new RegExp(`${WB_START}(?:el|la)\\s+paciente${WB_END}`, 'i').test(trimmed) ||
    new RegExp(
      `(?<!\\bse\\s+)${WB_START}(?:refiere|present[oó]|acude|regres[oó]|consumi[oó]|suspendi[oó]|prob[oó]|not[oó]|estuvo|tuvo|tom[oó]|sufri[oó]|inici[oó]|le\\s+colocaron|le\\s+iniciaron|le\\s+recetaron|se\\s+acompa[ñn]a\\s+de)${WB_END}`,
      'i'
    ).test(trimmed);
  if (!hasThirdPersonMarkers) return trimmed;
  return toFirstPersonClinicalSpeech(trimmed, patientInfo);
}

/**
 * Busca oraciones dentro de currentIllness o background que contengan palabras clave relevantes.
 */
function extractMatchingSentences(
  text: string | undefined,
  keywords: string[],
  patientInfo?: PatientChatPayload['patientInfo']
): string | null {
  if (!text) return null;
  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
  for (const s of sentences) {
    const normS = normalizeText(s);
    if (keywords.some((kw) => normS.includes(kw))) {
      return toFirstPersonClinicalSpeech(s, patientInfo);
    }
  }
  return null;
}

export function buildPatientSystemInstruction(payload: PatientChatPayload): string {
  const { patientPersona, patientInfo, vitalSigns, background } = payload;
  const isPediatric = patientInfo?.age !== undefined && patientInfo.age < 12;
  const firstPersonIllness = patientInfo?.currentIllness
    ? toFirstPersonClinicalSpeech(patientInfo.currentIllness, patientInfo)
    : 'malestar general';
  const adaptArr = (items?: string[], fallback = 'ninguno') =>
    items && items.length > 0
      ? items.map((item) => toFirstPersonClinicalSpeech(item, patientInfo)).join('; ')
      : fallback;

  return `Eres ${isPediatric ? `la madre/el padre de ${patientInfo?.name || 'un niño pequeño'}, hablando SIEMPRE en primera persona ("soy su mamá", "mi hijo/bebé tiene...", "ayer lo vi...")` : 'un paciente real en una consulta médica simulada en urgencias o consulta externa'}.
Tu perfil personal:
${patientPersona || `Te llamas ${patientInfo?.name || 'el paciente'}, tienes ${patientInfo?.age || 35} años, sexo ${patientInfo?.sex || 'no especificado'}, ocupación ${patientInfo?.occupation || 'empleado'}.`}
Motivo inicial por el que llegaste: ${patientInfo?.consultReason || 'malestar general'}.
Tiempo de evolución: ${patientInfo?.evolutionTime || 'reciente'}.
Lo que has vivido y sentido (en tus propias palabras): ${firstPersonIllness}.
Antecedentes médicos personales: ${adaptArr(background?.pathological, 'Sin enfermedades crónicas')}.
Hábitos, viajes y entorno: ${adaptArr(background?.nonPathological, 'Sin datos particulares')}.
Antecedentes familiares: ${adaptArr(background?.family, 'Sin antecedentes familiares relevantes')}.
Cirugías previas: ${adaptArr(background?.surgical, 'Ninguna')}.
Medicamentos que usas o tomaste: ${adaptArr(background?.currentMedications, 'Ninguno')}.
Alergias: ${adaptArr(background?.allergies, 'Sin alergias conocidas')}.
Signos vitales actuales: PA ${vitalSigns?.bloodPressure || 'normal'}, FC ${vitalSigns?.heartRate || 80} lpm, FR ${vitalSigns?.respiratoryRate || 18} rpm, Temp ${vitalSigns?.temperature || 37}°C, SatO2 ${vitalSigns?.oxygenSaturation || 98}%${vitalSigns?.weightKg ? `, Peso ${vitalSigns.weightKg} kg` : ''}${vitalSigns?.heightCm ? `, Talla ${vitalSigns.heightCm} cm` : ''}.

REGLAS ESTRICTAS DE COMUNICACIÓN:
1. Habla EXCLUSIVAMENTE en PRIMERA PERSONA del singular ("yo siento", "me empezó", "ayer tomé", "tengo", "vengo por"). JAMÁS hables de ti mismo en tercera persona ni narres como expediente clínico (PROHIBIDO decir "el paciente refiere", "paciente masculino de...", "presenta", "acude", "se acompaña de", "tuvo", "le colocaron").
2. Responde DIRECTAMENTE a lo que el médico acaba de preguntar, incluso si pregunta detalles minuciosos, íntimos o repite una pregunta para confirmar.
3. PREGUNTAS ÍNTIMAS, SEXUALES O GINECO-UROLÓGICAS ("¿tiene vida sexual activa?", "¿ha tenido sexo?", "¿usa preservativo/anticonceptivo?", "¿parejas sexuales?", "¿secreción genital?", "¿fecha de última regla?"): responde con total naturalidad, franqueza y respeto como un paciente real en consulta privada, de forma coherente con tu edad, sexo, antecedentes y enfermedad actual.
4. PREGUNTAS MINUCIOSAS O DEL DÍA ANTERIOR / CRONOLÓGICAS ("¿qué pasó el día anterior?", "¿ayer cómo se sintió?", "¿qué comió anoche?", "¿a qué hora exacta?", "¿cuántas veces?", "¿de qué color?"): reconstruye con precisión coherente lo ocurrido ese día previo o momento específico según tu línea de tiempo ("${patientInfo?.evolutionTime || 'reciente'}") y tu historia clínica.
5. PREGUNTAS DE REPETICIÓN O CONFIRMACIÓN ("¿me confirma eso?", "¿está seguro?", "¿o sea que fue ayer?", "¿me repite?"): responde con paciencia y claridad confirmando lo declarado.
6. NUNCA menciones el nombre de tu diagnóstico ni términos médicos técnicos ("defervescencia", "fuga plasmática", "Kussmaul", "McBurney", "infarto", "meningitis", "apendicitis", "dengue", "cetoacidosis", "neumonía", "Stevens-Johnson", "serotoninérgico", "tromboembolia", "embarazo ectópico").
7. Si el médico pregunta algo completamente ajeno a la medicina (fútbol, clima, política, música, chistes), reacciona con natural desconcierto porque te sientes mal.
8. Sé claro, concreto y natural (1 a 3 oraciones).`;
}

/**
 * Responde específicamente preguntas sobre "el día anterior / ayer / anoche / antes de hoy"
 */
function buildDayBeforeReply(norm: string, payload: PatientChatPayload): string {
  const { patientInfo, background, caseId = '' } = payload;

  const asksFood = hasWordPrefix(norm, ['comi', 'comer', 'comida', 'cena', 'ceno', 'almuerz', 'desayun', 'ingesta', 'bebi', 'tomo de comer']);
  const asksMeds = hasWordPrefix(norm, ['medicament', 'medicina', 'pastilla', 'farmaco', 'remedio', 'tomo', 'pildora', 'jarabe', 'analges']);
  const asksSleep = hasWordPrefix(norm, ['durmi', 'dormir', 'sueno', 'despert', 'descans', 'noche']);
  const asksFever = hasWordPrefix(norm, ['fiebre', 'calentura', 'temperatura', 'escalofrio']);
  const asksPain = hasWordPrefix(norm, ['dolor', 'duele', 'dolia', 'molestia']);
  const asksVomit = hasWordPrefix(norm, ['vomit', 'nausea', 'devolv', 'asco']);

  // Casos con línea de tiempo conocida explícitamente:
  if (caseId === 'case-dengue-alarm') {
    if (asksMeds) {
      return 'Sí doctor, justo ayer como me dolía muchísimo todo el cuerpo me tomé dos pastillas de ibuprofeno de 400 mg aparte del paracetamol que venía tomando.';
    }
    if (asksFood) {
      return 'El día de ayer casi no probé bocado por la fiebre tan alta y el malestar; apenas tomé un poco de caldo y agua, y ya hoy no tolero ni el agua porque lo vomito.';
    }
    if (asksSleep) {
      return 'Anoche casi no pude dormir por la inquietud y porque en la madrugada empezó a bajarse la fiebre pero me comenzó este dolor fuerte en la panza.';
    }
    if (asksFever) {
      return 'Sí doctor, ayer todavía tuve fiebre muy alta de hasta 39°C con dolor de huesos y detrás de los ojos; fue hoy en la mañana cuando me bajó a 37 y algo.';
    }
    if (asksPain) {
      return 'Ayer me dolían muchísimo los huesos, músculos y detrás de los ojos, pero este dolor continuo aquí debajo de las costillas derechas empezó apenas hace unas 12 horas.';
    }
    return 'El día anterior todavía estaba con fiebre alta de 39°C, dolor de cuerpo y mucho decaimiento, y por el dolor me tomé dos pastillas de ibuprofeno; fue apenas hoy cuando me bajó la fiebre pero empeoré con el dolor de panza y los vómitos.';
  }

  if (caseId === 'case-apendicitis-aguda') {
    if (asksFood) {
      return 'El día de ayer comí normal en el día, cené algo ligero temprano, pero ya entrada la noche me empezó un dolor sordo alrededor del ombligo y desde entonces se me quitó el hambre por completo.';
    }
    if (asksSleep) {
      return 'Casi no dormí anoche, doctor; el dolor empezó alrededor del ombligo y de madrugada me despertó más fuerte y ya bajándose hacia el lado derecho.';
    }
    if (asksMeds) {
      return 'Ayer no tomé ningún medicamento para el dolor porque me dio miedo tapar algo serio; solo me tomé mi pastilla anticonceptiva diaria como siempre.';
    }
    return 'Ayer en el día yo andaba completamente normal, doctor. Fue apenas ayer en la noche cuando empezó una molestia sorda alrededor del ombligo y náuseas, y hoy en la madrugada se volvió agudo abajo a la derecha.';
  }

  if (caseId === 'case-iamcest-anterior') {
    if (asksFood) {
      return 'El día de ayer comí y cené normal con mi familia, doctor, sin indigestión ni nada raro.';
    }
    if (asksMeds) {
      return 'Ayer la verdad ni me acordé de tomarme el enalapril para la presión, doctor, soy muy descuidado con eso.';
    }
    return 'Ayer estuve completamente tranquilo haciendo mis cosas normales, doctor, sin dolor ni falta de aire. Todo esto me empezó de golpe apenas hoy hace poco más de una hora.';
  }

  if (caseId === 'case-cetoacidosis-diabetica') {
    if (asksMeds) {
      return 'Justo desde antier y ayer suspendí mi insulina, doctor, porque me dolía la garganta, me daba asco la comida y pensé que si no comía no me la debía inyectar.';
    }
    if (asksFood) {
      return 'Ayer casi no comí nada porque traía el estómago revuelto y dolor de garganta, solo tomé mucha agua porque me daba una sed terrible.';
    }
    return 'Ayer empecé a sentirme muchísimo más débil, con mucha sed, orinando a cada rato y vomitando, además de que dejé de ponerme la insulina desde hace dos días.';
  }

  if (caseId === 'case-meningitis-bacteriana') {
    if (asksSleep) {
      return 'Anoche fue horrible, doctor, me desperté con escalofríos violentos, fiebre altísima y un dolor de cabeza que sentía que me iba a reventar.';
    }
    return 'Ayer en la tarde yo solo traía algo de malestar y dolor de garganta como gripa, pero anoche de golpe me subió la fiebre altísima y empezó este dolor de cabeza terrible.';
  }

  if (caseId === 'case-neumonia-adquirida') {
    if (asksMeds) {
      return 'Ayer seguí usando mi inhalador de siempre y tomé té caliente, pero no me quitó ni la fiebre ni la tos.';
    }
    return 'Ayer seguía con la fiebre alta y la tos con flema espesa rojiza que empezó hace 3 días, y justo ayer en la tarde fue cuando empecé a sentir más punzada al respirar y más cansancio.';
  }

  // Extracción dinámica para cualquier caso nuevo / de especialidad / IA (prioriza menciones exactas de "ayer / día anterior / anoche"):
  const yesterdayMatch =
    extractMatchingSentences(
      patientInfo?.currentIllness,
      ['dia anterior', 'ayer', 'anoche'],
      patientInfo
    ) ||
    extractMatchingSentences(
      patientInfo?.currentIllness,
      ['hace 2 dias', 'hace dos dias', 'hace 3 dias', 'inici', 'empez', 'comenz'],
      patientInfo
    );
  if (asksMeds && background?.currentMedications && !listIndicatesNone(background.currentMedications)) {
    const adaptedMeds = background.currentMedications.map((m) => toFirstPersonClinicalSpeech(m, patientInfo)).join(', ');
    return `El día anterior ${patientInfo?.age !== undefined && patientInfo.age < 12 ? 'le estuve dando' : 'estuve usando/tomando'}: ${adaptedMeds}, doctor.`;
  }
  if (asksFood) {
    const foodMatch = extractMatchingSentences(
      patientInfo?.currentIllness,
      ['cena', 'comi', 'alimento', 'hambre', 'apetito', 'fritura', 'marisco', 'leche', 'tomas', 'pecho'],
      patientInfo
    );
    if (foodMatch) return foodMatch;
    return patientInfo?.age !== undefined && patientInfo.age < 12
      ? 'Ayer estuvo tomando menos leche de lo normal por el cansancio y la tos, doctor.'
      : 'El día de ayer comí ligero y sin nada fuera de lo común antes de sentirme así, doctor.';
  }
  if (asksSleep) {
    return patientInfo?.age !== undefined && patientInfo.age < 12
      ? 'Anoche casi no durmió el pobre bebé por la tos y la respiración agitada, doctor.'
      : 'Anoche pasé muy mala noche por estas mismas molestias que me tienen aquí, casi no pude descansar.';
  }
  if (asksVomit) {
    const vomitMatch = extractMatchingSentences(patientInfo?.currentIllness, ['vomit', 'nausea'], patientInfo);
    return (
      vomitMatch ||
      (patientInfo?.age !== undefined && patientInfo.age < 12
        ? 'No tuvo vómitos fuertes ayer, doctor, aunque sí estuvo muy incómodo.'
        : 'El día anterior no tuve vómitos fuertes, doctor, aunque sí algo de malestar.')
    );
  }
  if (yesterdayMatch) {
    return yesterdayMatch;
  }
  return patientInfo?.age !== undefined && patientInfo.age < 12
    ? 'El día anterior ya había empezado con molestias y fue empeorando hasta hoy, doctor.'
    : `El día anterior ${patientInfo?.evolutionTime?.includes('hora') ? 'estuve prácticamente normal antes de que todo empezara de golpe' : 'ya venía sintiendo malestar relacionado con esto y fue empeorando hasta hoy'}, doctor.`;
}

/**
 * Motor determinista de comprensión clínica en español.
 */
export function generateContextualPatientReply(payload: PatientChatPayload): string {
  const rawReply = generateContextualPatientReplyInternal(payload);
  return ensureFirstPersonReply(rawReply, payload.patientInfo);
}

function generateContextualPatientReplyInternal(payload: PatientChatPayload): string {
  const { history = [], userMessage, patientInfo, vitalSigns, background, caseId = '' } = payload;
  const norm = normalizeText(userMessage);
  const name = patientInfo?.name || 'Paciente';
  const age = patientInfo?.age;
  const isPediatric = age !== undefined && age < 12;
  const sex = normalizeText(patientInfo?.sex || '');
  const isFemale = sex.includes('femenin') || sex.includes('mujer');
  const adapt = (txt: string) => toFirstPersonClinicalSpeech(txt, patientInfo);

  // Identificar el último mensaje del paciente en la conversación para confirmaciones o repreguntas
  const lastPatientMsg = [...history]
    .reverse()
    .find((m) => m.sender === 'patient')?.text;

  // 0. Detección de pregunta de confirmación / repetición
  const isConfirmationOrRepeat = hasWordPrefix(norm, [
    'confirm', 'segur', 'verdad', 'repet', 'repit', 'otra vez', 'de nuevo',
    'o sea', 'es decir', 'entonces', 'como dijo', 'me decia', 'entendi bien', 'rectific',
  ]);

  // Remover muletillas de confirmación para evaluar si además pregunta un tema concreto
  const cleanedNorm = norm
    .replace(/\b(me confirma|confirma|confirmeme|esta seguro|seguro que|me repite|repite|otra vez|de nuevo|o sea que|o sea|es decir|entonces|como me dijo|por favor|doctor)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Si es una repetición/confirmación pura sin tema nuevo específico, reafirma el último dato dicho
  if (isConfirmationOrRepeat && cleanedNorm.split(' ').filter(Boolean).length <= 3 && lastPatientMsg) {
    return `Sí doctor, se lo confirmo tal como le comentaba: ${lastPatientMsg.charAt(0).toLowerCase()}${lastPatientMsg.slice(1)}`;
  }

  // 1. Términos médicos técnicos que el paciente no entendería si se los preguntan literalmente
  if (
    hasWordPrefix(norm, [
      'mcburney', 'blumberg', 'rovsing', 'murphy', 'kernig', 'brudzinski',
      'kussmaul', 'levine', 'anion gap', 'troponina', 'hematocrito',
      'leucocitosis', 'plaquetopenia', 'trombocitopenia', 'creatinina',
      'cetoacidosis', 'iamcest', 'electrocardiograma', 'puncion lumbar',
    ])
  ) {
    return 'Disculpe doctor, no entiendo bien qué significa esa palabra médica que me dice... Si gusta me pregunta con palabras sencillas o me revisa para explicarme qué es.';
  }

  // 2. Temas claramente fuera de lugar (Off-topic explícito)
  const offTopicPatterns = [
    'futbol', 'partido', 'mundial', 'pelicula', 'cine', 'musica', 'cancion',
    'politica', 'presidente', 'gobierno', 'elecciones', 'clima', 'hace frio afuera',
    'llueve', 'lluvia', 'carro', 'coche', 'automovil', 'marca', 'precio',
    'cuanto cuesta', 'chiste', 'broma', 'ropa', 'camisa',
    'zapato', 'inteligencia artificial', 'computadora', 'videojuego', 'marte',
    'extraterrestre', 'platillo', 'capital de', 'cuanto es', 'multiplica',
    'equipo favorito', 'color favorito', 'horoscopo', 'receta de cocina',
    'signo zodiacal',
  ];
  if (offTopicPatterns.some((p) => norm.includes(p))) {
    return 'Disculpe, doctor... la verdad no entiendo qué tiene que ver eso con mi salud. Me siento bastante mal y necesito que me ayude con lo que traigo.';
  }

  // 3. Saludos, cortesía o estado general abierto ("cómo está", "en qué le ayudo", "algo más")
  if (
    hasWord(norm, ['hola', 'buenos dias', 'buenas tardes', 'buenas noches', 'saludos']) &&
    norm.split(' ').length <= 6
  ) {
    return isPediatric
      ? `Hola doctor, mucho gusto. Traigo a mi niño porque tiene ${patientInfo?.consultReason?.toLowerCase() || 'mucho malestar'} y estoy muy preocupada.`
      : `Hola doctor, mucho gusto. Vengo muy preocupado${isFemale ? '' : ''} por ${patientInfo?.consultReason?.toLowerCase() || 'este malestar'}, gracias por atenderme tan rápido.`;
  }

  if (
    hasWordPrefix(norm, ['como esta', 'como sigue', 'como se encuentra', 'en que le puedo ayudar', 'algo mas', 'otra cosa', 'quiere agregar', 'duda'])
  ) {
    if (isPediatric) {
      return `Pues muy preocupada doctor; mi niño sigue con ${patientInfo?.consultReason?.toLowerCase() || 'estas molestias'} desde hace ${patientInfo?.evolutionTime || 'unas horas'}.`;
    }
    return `Pues me siento muy mal todavía, doctor; traigo ${patientInfo?.consultReason?.toLowerCase() || 'mucho malestar'} desde hace ${patientInfo?.evolutionTime || 'unas horas'} y necesito que me ayude.`;
  }

  // 4. Indicaciones o comentarios del médico (no son preguntas)
  if (
    hasWordPrefix(norm, [
      'tranquil', 'calme', 'no se preocupe', 'voy a revisar', 'vamos a revisar',
      'le voy a', 'voy a pedir', 'voy a solicitar', 'recueste', 'acueste',
      'respire hondo', 'abra la boca', 'mire aqui',
    ]) &&
    !userMessage.includes('?')
  ) {
    return 'Está bien doctor, como usted indique. Por favor revíseme con cuidado porque me siento muy mal.';
  }

  // Función auxiliar para envolver respuestas de confirmación con naturalidad
  const wrapConfirm = (reply: string): string => {
    const clean = reply.replace(/\.{2,}/g, '.').trim();
    if (!isConfirmationOrRepeat) return clean;
    if (/^(sí|no|exact|el |la |ayer|justo|me |todo)/i.test(clean)) {
      return `Sí doctor, le confirmo: ${clean.charAt(0).toLowerCase()}${clean.slice(1)}`;
    }
    return `Le confirmo, doctor: ${clean}`;
  };

  // 5. Preguntas específicas sobre EL DÍA ANTERIOR / AYER / ANOCHE / HORA EXACTA
  if (
    norm.includes('dia anterior') ||
    norm.includes('dias anteriores') ||
    hasWordPrefix(norm, ['ayer', 'antier', 'anteayer', 'anoche', 'vispera', 'noche anterior'])
  ) {
    return wrapConfirm(buildDayBeforeReply(norm, payload));
  }

  // 5b. Somatometría: peso, estatura, talla
  if (hasWordPrefix(norm, ['pesa', 'peso', 'kilo', 'mide', 'estatura', 'talla', 'altura'])) {
    const w = vitalSigns?.weightKg;
    const h = vitalSigns?.heightCm;
    if (w && h) {
      return isPediatric
        ? wrapConfirm(`Mi niño pesa unos ${w} kilos y mide alrededor de ${h} centímetros, doctor.`)
        : wrapConfirm(`Peso aproximadamente ${w} kilos y mido ${(h / 100).toFixed(2)} metros, doctor.`);
    }
    return wrapConfirm('La verdad no me he pesado recientemente, doctor, pero pueden revisarlo en mi ficha de ingreso.');
  }

  // 6. Pregunta por identidad (nombre, edad)
  if (
    hasWord(norm, ['como se llama', 'cual es su nombre', 'su nombre', 'cuantos anos', 'que edad', 'edad tiene']) ||
    (hasWordPrefix(norm, ['edad', 'nombre']) && hasWordPrefix(norm, ['cual', 'cuant', 'que', 'como']))
  ) {
    if (isPediatric) {
      return wrapConfirm(`Mi niño se llama ${name.replace(/\s*\([^)]*\)/, '')} y tiene ${age !== undefined && age >= 1 ? `${age} años` : patientInfo?.occupation || '10 meses'}, doctor; yo soy su mamá.`);
    }
    return wrapConfirm(`Me llamo ${name}${age ? ` y tengo ${age} años` : ''}, doctor.`);
  }

  // 7. Ocupación / trabajo / estudios
  if (hasWordPrefix(norm, ['trabaj', 'ocupacion', 'oficio', 'profesion', 'dedica', 'estudia', 'carrera'])) {
    if (isPediatric) {
      return wrapConfirm(`Es apenas un niño pequeño (${patientInfo?.occupation || 'en edad infantil'}) y va a guardería, doctor.`);
    }
    return wrapConfirm(`Soy ${patientInfo?.occupation || 'trabajador'}, doctor. Por este malestar tan fuerte no he podido hacer mis actividades normales.`);
  }

  // 8. Vivienda / entorno / con quién vive
  if (
    norm.includes('donde vive') ||
    norm.includes('con quien vive') ||
    norm.includes('en que zona') ||
    norm.includes('su casa')
  ) {
    if (caseId === 'case-dengue-alarm') {
      return wrapConfirm('Vivo en una zona semiurbana con bastante vegetación y agua estancada, donde suele haber muchos zancudos.');
    }
    if (caseId === 'case-meningitis-bacteriana') {
      return wrapConfirm('Desde hace dos meses vivo en dormitorios compartidos dentro de una base militar.');
    }
    if (caseId === 'case-cetoacidosis-diabetica') {
      return wrapConfirm('Vivo en un departamento compartido con unas compañeras de la universidad.');
    }
    const nonPath = background?.nonPathological;
    if (nonPath && nonPath.length > 0) {
      return wrapConfirm(`Le cuento sobre mi entorno, doctor: ${adapt(nonPath[0])}`);
    }
    return wrapConfirm('Vivo en la ciudad con mi familia, en una casa con todos los servicios.');
  }

  // 9. Alergias a medicamentos o alimentos
  if (hasWordPrefix(norm, ['alergi', 'reaccion alergica', 'penicilina', 'sulfa', 'sulfamida', 'intolerancia', 'hace dano algun'])) {
    if (caseId === 'case-neumonia-adquirida') {
      return wrapConfirm('Sí doctor, soy muy alérgica a la penicilina; hace años me pusieron una inyección, me hinché toda, se me cerró el pecho y casi me muero.');
    }
    if (caseId === 'case-apendicitis-aguda') {
      return wrapConfirm('Sí doctor, soy alérgica a las sulfas; una vez me las dieron y me llené de ronchas y picazón por todo el cuerpo.');
    }
    const alg = background?.allergies;
    if (alg && !listIndicatesNone(alg)) {
      return wrapConfirm(`Sí doctor, ${isPediatric ? 'mi niño tiene' : 'tengo'} alergia conocida a: ${alg.map((a) => adapt(a).replace(/\.$/, '')).join(', ')}.`);
    }
    return isPediatric
      ? 'No doctor, hasta donde sé mi niño no es alérgico a ningún medicamento ni alimento.'
      : `No doctor, le confirmo que hasta donde sé no soy ${isFemale ? 'alérgica' : 'alérgico'} a ningún medicamento ni alimento.`;
  }

  // 10. Antecedentes quirúrgicos / operaciones
  if (hasWordPrefix(norm, ['cirugia', 'operad', 'operacion', 'quirofano', 'intervencion quirurgica'])) {
    if (caseId === 'case-dengue-alarm') {
      return wrapConfirm('Me operaron del apéndice por laparoscopia hace unos 5 años, doctor, pero fuera de eso ninguna otra cirugía.');
    }
    if (caseId === 'case-neumonia-adquirida') {
      return wrapConfirm('Tuve una cesárea hace 35 años cuando nació mi hijo, pero ninguna otra operación.');
    }
    const surg = background?.surgical;
    if (surg && !listIndicatesNone(surg)) {
      return wrapConfirm(`Sí doctor: ${surg.map(adapt).join(', ')}.`);
    }
    return isPediatric ? 'No doctor, nunca han operado a mi bebé de nada.' : 'No doctor, nunca me han operado de nada.';
  }

  // 11. Episodios previos similares / primera vez
  if (
    hasWordPrefix(norm, ['episodio', 'primera vez', 'similares', 'habia pasado', 'habia dado']) ||
    ((norm.includes('antes') || norm.includes('previo')) && hasWordPrefix(norm, ['dolor', 'cuadro', 'pasado', 'sido', 'tenido']))
  ) {
    if (caseId === 'case-iamcest-anterior') {
      return wrapConfirm('No doctor, es la primera vez en mi vida que siento un dolor así de fuerte en el pecho.');
    }
    if (caseId === 'case-cetoacidosis-diabetica') {
      return wrapConfirm('Sí doctor, una vez estuve internada cuando me diagnosticaron la diabetes a los 15 años con un cuadro parecido, pero nunca tan fuerte como hoy.');
    }
    if (caseId === 'case-dengue-alarm') {
      return wrapConfirm('No doctor, nunca me había dado un cuadro así. Hace como un año tuve una infección estomacal pasajera, pero nada parecido a esto.');
    }
    return isPediatric
      ? wrapConfirm('No doctor, nunca se había puesto así de agitado; es la primera vez que le pasa.')
      : wrapConfirm('No doctor, nunca había tenido un problema así antes; es la primera vez que me pasa.');
  }

  // 12. Antecedentes patológicos / enfermedades crónicas
  if (
    hasWordPrefix(norm, [
      'hipertension', 'presion alta', 'diabet', 'azucar',
      'asma', 'epoc', 'osteoporosis', 'dislipidemia', 'colesterol',
      'calculo', 'litiasis', 'vesicula', 'biliar', 'rinon', 'renal',
      'tiroid', 'depresion', 'artrosis', 'neuralgia', 'fractura', 'esguince',
      'enfermedad cronica', 'enfermedades previas', 'antecedentes personales',
      'padece de', 'sufre de', 'otra enfermedad', 'hospitalizado',
    ]) ||
    (hasWordPrefix(norm, ['enfermedad']) && hasWordPrefix(norm, ['cronic', 'otra', 'padece', 'sufre', 'tiene', 'antecedent']))
  ) {
    if (caseId === 'case-cetoacidosis-diabetica') {
      return wrapConfirm('Sí doctor, tengo diabetes tipo 1 desde los 15 años y me controlo con insulina.');
    }
    if (caseId === 'case-iamcest-anterior') {
      return wrapConfirm('Sí doctor, padezco presión alta desde hace 7 años y colesterol elevado, pero casi no me tomo la medicina.');
    }
    if (caseId === 'case-neumonia-adquirida') {
      return wrapConfirm('Tengo EPOC leve porque fumé muchos años, aunque dejé el cigarro hace 8 años, y también osteoporosis.');
    }
    const path = background?.pathological;
    if (path && !listIndicatesNone(path)) {
      return wrapConfirm(`Sí doctor, ${isPediatric ? 'de antecedentes de mi hijo le comento' : 'tengo antecedentes de'}: ${path.map((p) => adapt(p).replace(/\.$/, '')).join('. ')}.`);
    }
    return isPediatric
      ? 'No doctor, nació sano a término y nunca ha tenido enfermedades crónicas ni hospitalizaciones.'
      : 'No doctor, siempre he sido una persona sana, no padezco de presión alta, diabetes ni ninguna enfermedad crónica.';
  }

  // 13. Medicamentos actuales o automedicación
  if (
    hasWordPrefix(norm, [
      'medicament', 'medicina', 'pastilla', 'farmaco', 'remedio', 'recetad',
      'automedic', 'tratamiento', 'analgesic', 'calmante', 'paracetamol',
      'ibuprofeno', 'aspirina', 'insulina', 'enalapril', 'inhalador', 'anticonceptiv',
      'carbamazepina', 'sertralina', 'tramadol', 'naproxeno', 'dextrometorfano', 'tiamazol', 'metimazol',
    ]) ||
    ((norm.includes('ha tomado') || norm.includes('se tomo') || norm.includes('tomo algo') || norm.includes('que tomo') || norm.includes('toma algun')) &&
      !hasWordPrefix(norm, ['alcohol', 'cerveza', 'licor', 'vino', 'trago']))
  ) {
    if (caseId === 'case-dengue-alarm') {
      return wrapConfirm('Estuve tomando paracetamol de 1 gramo cada 6 horas desde que empezó la fiebre, y ayer como me dolía mucho el cuerpo me tomé dos pastillas de ibuprofeno de 400 mg.');
    }
    if (caseId === 'case-cetoacidosis-diabetica') {
      return wrapConfirm('Uso insulina todos los días, pero hace dos días la suspendí porque me dolía la garganta y dejé de comer.');
    }
    if (caseId === 'case-iamcest-anterior') {
      return wrapConfirm('Me recetaron enalapril de 10 mg para la presión, doctor, pero soy muy descuidado y solo me lo tomo de vez en cuando.');
    }
    if (caseId === 'case-apendicitis-aguda') {
      return wrapConfirm('Solo tomo pastillas anticonceptivas todos los días. Para este dolor no he querido tomar nada.');
    }
    if (caseId === 'case-neumonia-adquirida') {
      return wrapConfirm('Uso un inhalador de bromuro de ipratropio cuando me falta el aire y tomo calcio con vitamina D todos los días.');
    }
    const meds = background?.currentMedications;
    if (meds && !listIndicatesNone(meds)) {
      return wrapConfirm(`Sí doctor, ${isPediatric ? 'le he estado aplicando o dando' : 'he estado usando/tomando'}: ${meds.map((m) => adapt(m).replace(/\.$/, '')).join(', ')}.`);
    }
    return isPediatric
      ? 'No le he dado ningún medicamento de base, doctor.'
      : 'No tomo ningún medicamento de base, doctor, y tampoco he tomado nada para este malestar.';
  }

  // 14. Historia sexual, actividad sexual, protección, ITS y pareja
  if (
    hasWordPrefix(norm, [
      'sexo', 'sexual', 'coito', 'relacion', 'relaciones', 'intim', 'pareja',
      'preservativ', 'condon', 'anticoncep', 'ets', 'its', 'venerea',
      'dispareunia', 'flujo vaginal', 'secrecion genital', 'flujo genital', 'testiculo', 'genital',
    ]) ||
    norm.includes('vida sexual') ||
    norm.includes('ha tenido sexo') ||
    norm.includes('tuvo sexo') ||
    norm.includes('relaciones sexuales')
  ) {
    if (age !== undefined && age < 12) {
      return 'Doctor, es apenas un niño pequeño, soy su mamá la que está aquí con él... esa pregunta no aplica para su edad.';
    }
    if (caseId === 'case-ginecologia-ectopico') {
      return wrapConfirm('Sí doctor, tengo vida sexual activa con mi pareja desde hace varios meses y la verdad no usamos preservativo ni ningún método anticonceptivo; además tengo 3 semanas de retraso en mi regla y hoy manché un poco de sangre oscura.');
    }
    if (caseId === 'case-dermatologia-stevens-johnson') {
      return wrapConfirm('Tengo pareja estable, doctor, pero ahorita traigo unas úlceras muy dolorosas incluso en la zona genital junto con las ampollas en boca y piel desde ayer.');
    }
    if (caseId === 'case-apendicitis-aguda') {
      return wrapConfirm('Sí doctor, tengo vida sexual activa con mi novio desde hace un año, pero tomo mis pastillas anticonceptivas todos los días sin falta y me bajó normal hace dos semanas. No tengo flujo raro ni dolor en genitales.');
    }
    if (caseId === 'case-cetoacidosis-diabetica') {
      return wrapConfirm('No doctor, ahorita no tengo pareja ni he tenido relaciones sexuales recientemente; tampoco he notado secreciones ni molestias genitales.');
    }
    if (caseId === 'case-meningitis-bacteriana') {
      return wrapConfirm('Tengo pareja estable cuando salgo de permiso del cuartel, hace como tres semanas que no tengo relaciones, y siempre usamos protección. No tengo ardor ni secreciones.');
    }
    if (caseId === 'case-dengue-alarm') {
      return wrapConfirm('Sí doctor, tengo vida sexual activa con mi esposa únicamente, sin molestias ni secreciones genitales; no tiene relación con esta fiebre ni el dolor de panza.');
    }
    if (caseId === 'case-iamcest-anterior' || caseId === 'case-neumonia-adquirida' || caseId === 'case-nefrologia-lra') {
      return wrapConfirm('Estoy casado/a desde hace muchos años con mi misma pareja, aunque últimamente casi no tenemos actividad sexual por la edad y el cansancio. Sin molestias genitales.');
    }
    const sexMatch = extractMatchingSentences(
      `${patientInfo?.currentIllness || ''} ${joinList(background?.nonPathological, '')} ${joinList(background?.pathological, '')}`,
      ['sexual', 'pareja', 'anticoncep', 'preservat', 'flujo', 'vaginal', 'pelvic', 'ets', 'vih', 'genital'],
      patientInfo
    );
    if (sexMatch) return wrapConfirm(sexMatch);
    if (age && age >= 18 && age <= 45) {
      return wrapConfirm('Sí doctor, tengo vida sexual activa con pareja estable y sin molestias, secreciones ni lesiones genitales recientes.');
    }
    return wrapConfirm('No he tenido actividad sexual de riesgo ni parejas nuevas, doctor, y tampoco tengo flujo ni lesiones genitales.');
  }

  // 14b. Antecedentes gineco-obstétricos (regla, embarazo, atraso, gestas)
  if (hasWordPrefix(norm, ['regla', 'menstrua', 'periodo', 'embaraz', 'atraso', 'retraso', 'fur', 'ginecolog', 'gesta', 'parto', 'cesarea', 'sangrado vaginal', 'transvaginal'])) {
    if (!isFemale) {
      return 'Eh... doctor, soy hombre, creo que se confundió de pregunta.';
    }
    if (age && age >= 55) {
      return 'Ya pasé la menopausia hace muchos años, doctor, ya no menstruo.';
    }
    if (caseId === 'case-ginecologia-ectopico') {
      return wrapConfirm('Tengo un retraso menstrual de casi 3 semanas, doctor, no uso anticonceptivos y desde hace un par de horas tuve un manchado vaginal oscuro escaso junto con este dolor pélvico fortísimo.');
    }
    if (caseId === 'case-apendicitis-aguda') {
      return wrapConfirm('Mi regla me bajó normal hace dos semanas, doctor. Tomo anticonceptivos orales con regularidad y no hay posibilidad de embarazo.');
    }
    const gynMatch = extractMatchingSentences(patientInfo?.currentIllness, ['retraso', 'menstrua', 'regla', 'vaginal', 'embaraz'], patientInfo);
    if (gynMatch) return wrapConfirm(gynMatch);
    return wrapConfirm('Mis periodos son regulares, doctor, mi última regla fue hace un par de semanas y no estoy embarazada.');
  }

  // 15. Antecedentes familiares y personas enfermas cercanas
  if (hasWordPrefix(norm, ['familia', 'mama', 'madre', 'papa', 'padre', 'hermano', 'hermana', 'abuel', 'pariente', 'hereditari'])) {
    if (caseId === 'case-iamcest-anterior') {
      return wrapConfirm('Mi papá murió joven, a los 54 años, de un infarto al corazón, y mi hermano mayor también sufre de angina de pecho.');
    }
    if (caseId === 'case-dengue-alarm') {
      return wrapConfirm('Mi papá tiene presión alta controlada y mi mamá es sana. Además, en mi casa mi hermano también empezó ayer con fiebre y dolor de cuerpo.');
    }
    const fam = background?.family;
    if (fam && !listIndicatesNone(fam)) {
      return wrapConfirm(`En mi familia tenemos antecedentes de: ${fam.map(adapt).join(', ')}.`);
    }
    return 'Que yo sepa, en mi familia nadie padece enfermedades graves o crónicas.';
  }

  // 16. Viajes, picaduras, campo, hacinamiento, vacunas y contactos
  if (
    hasWordPrefix(norm, [
      'viaj', 'vuelo', 'avion', 'campo', 'monte', 'rural', 'picadura', 'mosquito', 'zancudo',
      'rio', 'selva', 'playa', 'vacun', 'contacto', 'contagi', 'cuartel',
      'companer', 'compañer', 'alguien enfermo', 'guarderia',
    ])
  ) {
    if (caseId === 'case-dengue-alarm') {
      return wrapConfirm('Sí doctor, trabajo en campo y hace 10 días viajé a unas plantaciones de banano donde había muchísimos zancudos y no usé repelente.');
    }
    if (caseId === 'case-meningitis-bacteriana') {
      return wrapConfirm('Vivo en dormitorios compartidos en una base militar desde hace dos meses, doctor. Varios compañeros han estado con gripa estos días.');
    }
    if (caseId === 'case-neumonia-adquirida') {
      return wrapConfirm('No he viajado a ningún lado, doctor. Me puse la vacuna de la gripa hace un año, pero nunca me pusieron la del neumococo.');
    }
    const envMatch = extractMatchingSentences(
      `${patientInfo?.currentIllness || ''} ${joinList(background?.nonPathological, '')}`,
      ['viaj', 'vuelo', 'avion', 'guarderia', 'contagi', 'hermano', 'accidente', 'moto', 'marisco'],
      patientInfo
    );
    if (envMatch) return wrapConfirm(envMatch);
    return 'No he salido de viaje recientemente ni he estado en contacto con personas enfermas o en zonas rurales.';
  }

  // 17. Hábitos: Tabaco, alcohol, drogas
  if (
    hasWordPrefix(norm, ['fuma', 'cigarro', 'tabaco', 'tabaquism', 'alcohol', 'cerveza', 'licor', 'vino', 'droga', 'sustancia', 'vicio']) ||
    (hasWordPrefix(norm, ['bebe']) && !norm.includes('agua'))
  ) {
    if (caseId === 'case-iamcest-anterior') {
      return wrapConfirm('Fumo mucho desde joven, doctor, como cajetilla y media diaria desde hace más de 25 años. Tomo cerveza los fines de semana y no uso drogas.');
    }
    if (caseId === 'case-neumonia-adquirida') {
      return wrapConfirm('Fumé muchos años de mi vida, pero dejé el cigarro hace 8 años. No tomo alcohol ni consumo ninguna sustancia.');
    }
    const habitMatch = extractMatchingSentences(
      joinList(background?.nonPathological, ''),
      ['alcohol', 'cerveza', 'fuma', 'tabaco', 'droga'],
      patientInfo
    );
    if (habitMatch) return wrapConfirm(habitMatch);
    return 'No fumo, no consumo drogas y casi nunca tomo alcohol, doctor.';
  }

  // 18. Cronología, cómo empezó todo, hora exacta, duración de episodios
  const asksTimeline =
    hasWordPrefix(norm, [
      'desde cuando', 'cuando empezo', 'cuando empezaron', 'cuando inicio', 'cuando comenzo',
      'como empezo', 'como inicio', 'como comenzo', 'como fue el inicio', 'de repente', 'de golpe', 'poco a poco',
      'cuanto tiempo', 'hace cuanto', 'cuantas horas', 'cuantos dias',
      'evolucion', 'subito', 'brusco', 'gradual', 'a que hora', 'que hora',
      'continuo', 'intermitente', 'va y viene', 'cuanto dura', 'empezo todo',
    ]) ||
    norm.includes('como fue cambiando') ||
    norm.includes('como ha evolucionado');

  const asksSpecificFever = hasWordPrefix(norm, ['fiebre', 'calentura', 'temperatura', 'escalofrio', 'tiritona']);
  const asksSpecificCough = hasWordPrefix(norm, ['tos', 'toser', 'flema', 'esputo']);

  if (asksTimeline && !asksSpecificFever && !asksSpecificCough) {
    if (caseId === 'case-dengue-alarm') {
      return wrapConfirm('Todo empezó hace 4 días con fiebre alta y dolor de cuerpo y ojos. Hoy en la mañana bajó la fiebre, pero hace unas 12 horas comenzó el dolor abdominal fuerte con vómitos y mareos.');
    }
    if (caseId === 'case-apendicitis-aguda') {
      return wrapConfirm('Empezó hace unas 18 horas, anoche con un dolor sordo alrededor del ombligo, y en las últimas horas se volvió muy agudo y continuo abajo a la derecha.');
    }
    if (caseId === 'case-iamcest-anterior') {
      return wrapConfirm('Empezó de golpe hace unos 75 minutos mientras estaba descansando tranquilo, doctor. Ha sido continuo desde entonces.');
    }
    if (caseId === 'case-cetoacidosis-diabetica') {
      return wrapConfirm('Hace dos días empecé con dolor de garganta, y hace unas 36 horas comencé con vómitos, mucha sed, debilidad y esta respiración agitada.');
    }
    if (caseId === 'case-meningitis-bacteriana') {
      return wrapConfirm('Empezó de golpe hace unas 20 horas con un dolor de cabeza terrible y fiebre altísima, y ha ido empeorando rápido.');
    }
    if (caseId === 'case-neumonia-adquirida') {
      return wrapConfirm('Llevo 3 días con esto, doctor. Empezó de repente con escalofrío fuerte y fiebre de 39, y desde ayer me empezó la punzada al respirar y más ahogo.');
    }
    if (patientInfo?.currentIllness) {
      return wrapConfirm(adapt(patientInfo.currentIllness));
    }
    return wrapConfirm(
      isPediatric
        ? `Empezó hace aproximadamente ${patientInfo?.evolutionTime || 'unos días'}, doctor, y mi hijo ha ido empeorando poco a poco.`
        : `Esto me empezó hace aproximadamente ${patientInfo?.evolutionTime || 'unos días'}, doctor, y ha ido empeorando de forma progresiva.`
    );
  }

  // 19. Irradiación o migración del dolor
  if (hasWordPrefix(norm, ['irradia', 'corre hacia', 'se va hacia', 'extiende', 'migra', 'mueve', 'camino el dolor'])) {
    if (caseId === 'case-iamcest-anterior') {
      return wrapConfirm('Sí doctor, el dolor del pecho se me sube hacia la mandíbula, la espalda entre los hombros y me baja por todo el brazo izquierdo.');
    }
    if (caseId === 'case-apendicitis-aguda') {
      return wrapConfirm('Sí doctor, al principio me dolía alrededor del ombligo y en la boca del estómago, pero con las horas se movió y quedó fijo abajo del lado derecho.');
    }
    const irradMatch = extractMatchingSentences(patientInfo?.currentIllness, ['irradia', 'cinturon', 'espalda', 'hombro', 'brazo', 'corre', 'escapula'], patientInfo);
    if (irradMatch) return wrapConfirm(irradMatch);
    return 'No siento que el dolor se corra hacia otra parte distante; se queda concentrado donde le comento.';
  }

  // 20. Factores que empeoran/alivian, intensidad 1-10
  if (
    hasWordPrefix(norm, [
      'empeora', 'aumenta', 'alivia', 'calma', 'mejora', 'intensidad',
      'del 1 al 10', 'que tan fuerte', 'posicion', 'al caminar', 'al toser', 'al moverse',
      'acostar', 'acostado', 'almohada',
    ])
  ) {
    if (caseId === 'case-apendicitis-aguda') {
      return wrapConfirm('El dolor es como 8 de 10 y empeora muchísimo al caminar, toser o brincar. Solo alivia un poquito quedarme quieta acostada de lado con las piernas encogidas.');
    }
    if (caseId === 'case-iamcest-anterior') {
      return wrapConfirm('Es un dolor 10 de 10, el peor de mi vida, doctor. No se calma en ninguna posición ni descansando.');
    }
    if (caseId === 'case-neumonia-adquirida') {
      return wrapConfirm('Cada vez que respiro hondo o toso me da una punzada fortísima en el costado derecho, como 8 de 10.');
    }
    if (caseId === 'case-meningitis-bacteriana') {
      return wrapConfirm('Es 10 de 10, insoportable. Cualquier luz, ruido o doblar el cuello lo empeora muchísimo.');
    }
    if (caseId === 'case-dengue-alarm') {
      return wrapConfirm('El dolor de la panza es continuo, como 8 de 10, y si me presionan debajo de las costillas derechas siento que no lo aguanto.');
    }
    const intenMatch = extractMatchingSentences(patientInfo?.currentIllness, ['intens', 'alivia', 'calma', 'empeora', '/10', 'no calma', 'acostar', 'llora'], patientInfo);
    if (intenMatch) return wrapConfirm(intenMatch);
    return wrapConfirm('Es un malestar muy intenso, entre 8 y 9 de 10, que no cede con el reposo.');
  }

  // 21. Fiebre, temperatura, escalofríos, sudoración
  if (hasWordPrefix(norm, ['fiebre', 'calentura', 'temperatura', 'termometro', 'escalofrio', 'tiritona', 'temblor', 'sudor', 'sudando', 'diaforesis', 'frio'])) {
    if (caseId === 'case-dengue-alarm') {
      return wrapConfirm('Tuve fiebre de hasta 39.5°C los primeros días con dolor de huesos. Hoy bajó a unos 37.3°C, pero en lugar de mejorar me siento mucho peor.');
    }
    if (caseId === 'case-iamcest-anterior') {
      return wrapConfirm('Fiebre no he tenido, doctor, pero estoy empapado en un sudor frío y pegajoso desde que empezó la opresión en el pecho.');
    }
    if (caseId === 'case-apendicitis-aguda') {
      return wrapConfirm('Me siento algo caliente, como con febrícula desde esta madrugada, pero no he tenido escalofríos fuertes.');
    }
    if (caseId === 'case-meningitis-bacteriana') {
      return wrapConfirm('Sí, he tenido fiebre altísima cerca de 40 grados desde ayer con escalofríos violentos que me hacen temblar.');
    }
    if (caseId === 'case-neumonia-adquirida') {
      return wrapConfirm('Sí doctor, todo empezó hace 3 días de golpe con un escalofrío muy fuerte y fiebre de 39 grados.');
    }
    const temp = vitalSigns?.temperature;
    const normIllness = normalizeText(patientInfo?.currentIllness || '');
    const mentionsFeverInChart = normIllness.includes('fiebre') || normIllness.includes('febric') || (temp !== undefined && temp >= 37.6);
    if (mentionsFeverInChart) {
      const feverMatch = extractMatchingSentences(patientInfo?.currentIllness, ['fiebre', 'febric', 'escalofrio', 'sudor', 'diaforesis', 'calentura'], patientInfo);
      if (temp !== undefined && temp >= 38.0) {
        return wrapConfirm(`Sí doctor, ${isPediatric ? 'mi niño ha tenido' : 'tengo'} fiebre alta (ahorita trae ${temp.toFixed(1)}°C). ${feverMatch || ''}`.trim());
      }
      return wrapConfirm(`Sí doctor, he sentido algo de calentura${temp ? ` (alrededor de ${temp.toFixed(1)}°C)` : ''}. ${feverMatch || ''}`.trim());
    }
    const sweatMatch = extractMatchingSentences(patientInfo?.currentIllness, ['sudor', 'frio', 'diaforesis'], patientInfo);
    if (sweatMatch) {
      return wrapConfirm(`Fiebre no he tenido, doctor, pero sí ${sweatMatch.charAt(0).toLowerCase()}${sweatMatch.slice(1)}`);
    }
    return isPediatric
      ? 'No le he notado fiebre alta, doctor, solo estuvo un poco destemplado.'
      : 'Fiebre no he sentido, doctor, aunque sí me siento muy destemplado por todo el malestar.';
  }

  // 22. Respiración, tos, flema, garganta, tragar, estridor
  if (
    norm.includes('falta de aire') ||
    norm.includes('sin aire') ||
    hasWordPrefix(norm, ['ahog', 'respir', 'disnea', 'tos', 'toser', 'flema', 'esputo', 'expector', 'silbido', 'ronca', 'garganta', 'estridor', 'tragar', 'deglut'])
  ) {
    if (caseId === 'case-neumonia-adquirida') {
      return wrapConfirm('Tengo tos desde hace 3 días con flema espesa de color rojizo como óxido, y me falta mucho el aire al hablar.');
    }
    if (caseId === 'case-cetoacidosis-diabetica') {
      return wrapConfirm('Hace dos días tuve tos leve y dolor de garganta, pero ahorita siento que necesito respirar muy rápido y profundo todo el tiempo.');
    }
    if (caseId === 'case-iamcest-anterior') {
      return wrapConfirm('Siento una falta de aire terrible desde que empezó la opresión en el pecho, me cuesta muchísimo jalar aire.');
    }
    const respMatch = extractMatchingSentences(patientInfo?.currentIllness, ['respir', 'aire', 'tos', 'sibilancia', 'rinorrea', 'garganta', 'silbido', 'ronca', 'estridor', 'tragar', 'costilla', 'flema', 'secrecion'], patientInfo);
    if (respMatch) return wrapConfirm(respMatch);
    return 'No tengo tos ni falta de aire grave ahorita, doctor, respiro más o menos normal aunque agitado por el malestar.';
  }

  // 23. Localización y características del dolor
  if (
    norm.includes('donde le duele') ||
    norm.includes('donde siente') ||
    norm.includes('donde tiene el dolor') ||
    norm.includes('en que parte') ||
    hasWordPrefix(norm, ['dolor', 'duele', 'localiza', 'opresivo', 'punzante', 'colico', 'ardor', 'molestia', 'panza', 'abdomen', 'estomago', 'vientre', 'barriga', 'pecho', 'pierna', 'espalda', 'pelvis'])
  ) {
    if (caseId === 'case-iamcest-anterior') {
      return wrapConfirm('Siento una opresión tremenda justo en el centro del pecho, detrás del esternón, como una losa pesadísima encima.');
    }
    if (caseId === 'case-apendicitis-aguda') {
      return wrapConfirm('Me duele muy fuerte abajo del lado derecho de la panza, es un dolor agudo y punzante que ya no se quita.');
    }
    if (caseId === 'case-dengue-alarm') {
      return wrapConfirm('Tengo un dolor continuo y muy fuerte en la parte alta derecha del abdomen, debajo de las costillas, además de dolor detrás de los ojos.');
    }
    if (caseId === 'case-cetoacidosis-diabetica') {
      return wrapConfirm('Me duele toda la panza en general, como un dolor difuso y revuelto con muchas náuseas.');
    }
    if (caseId === 'case-meningitis-bacteriana') {
      return wrapConfirm('Me duele horriblemente toda la cabeza y el cuello está tieso y muy doloroso.');
    }
    if (caseId === 'case-neumonia-adquirida') {
      return wrapConfirm('Me duele como una punzada en el costado derecho del pecho cada vez que respiro hondo o toso.');
    }
    const painMatch = extractMatchingSentences(patientInfo?.currentIllness, ['dolor', 'duele', 'ardor', 'opres', 'punz', 'colico', 'calambre', 'ulcera'], patientInfo);
    if (painMatch) return wrapConfirm(painMatch);
    return wrapConfirm(`Más que un dolor en un punto fijo, doctor, lo que me tiene desesperado es ${patientInfo?.consultReason?.toLowerCase() || 'este malestar general'}.`);
  }

  // 24. Náuseas, vómitos (cuántas veces / contenido), apetito y alimentación
  if (hasWordPrefix(norm, ['nausea', 'vomito', 'vomit', 'devolv', 'arcada', 'asco', 'apetito', 'hambre', 'comido', 'comer', 'comida', 'desayun', 'almorz', 'cenado', 'grasa', 'tragar'])) {
    if (caseId === 'case-dengue-alarm') {
      return wrapConfirm('He vomitado 4 veces hoy, doctor, principalmente líquido y lo poquito que tomo; no tolero ni el agua y tengo cero apetito.');
    }
    if (caseId === 'case-apendicitis-aguda') {
      return wrapConfirm('Se me quitó el hambre por completo desde anoche y vomité dos veces restos de comida; solo pensar en comer me da asco.');
    }
    if (caseId === 'case-iamcest-anterior') {
      return wrapConfirm('Tengo muchas náuseas y un nudo en el estómago desde que empezó el dolor de pecho, aunque no he llegado a vomitar.');
    }
    if (caseId === 'case-cetoacidosis-diabetica') {
      return wrapConfirm('No he podido retener nada en el estómago desde ayer, doctor, he vomitado varias veces y casi no comí en los últimos dos días.');
    }
    if (caseId === 'case-meningitis-bacteriana') {
      return wrapConfirm('Sí, tuve náuseas muy fuertes y vomité de golpe sin aviso, como en proyectil.');
    }
    const giMatch = extractMatchingSentences(patientInfo?.currentIllness, ['vomit', 'nausea', 'comer', 'tragar', 'pecho', 'toma', 'leche', 'cena', 'marisco'], patientInfo);
    if (giMatch) return wrapConfirm(giMatch);
    return 'He tenido muy poco apetito y algo de náuseas por todo el malestar general.';
  }

  // 25. Orina (color, ardor, cantidad), sed, hidratación
  if (hasWordPrefix(norm, ['orina', 'orinar', 'urinari', 'miccion', 'sed', 'boca seca', 'agua', 'poliuria', 'polidipsia', 'ardor al orinar', 'hinchazon', 'hinchad'])) {
    if (caseId === 'case-cetoacidosis-diabetica') {
      return wrapConfirm('He estado orinando muchísimo y muy seguido desde ayer, y tengo una sed desesperante con la boca completamente seca.');
    }
    if (caseId === 'case-dengue-alarm') {
      return wrapConfirm('He orinado muy poquito hoy, casi nada, y de color oscuro; además tengo la boca bastante seca.');
    }
    const renalMatch = extractMatchingSentences(patientInfo?.currentIllness, ['orina', 'hincha', 'tobillo', 'sed', 'oscuro'], patientInfo);
    if (renalMatch) return wrapConfirm(renalMatch);
    return 'He orinado de forma normal, sin ardor ni molestias, doctor.';
  }

  // 26. Evacuaciones, diarrea, estreñimiento
  if (hasWordPrefix(norm, ['evacua', 'diarrea', 'heces', 'estreni', 'bano', 'defec', 'gases', 'excremento'])) {
    if (caseId === 'case-apendicitis-aguda') {
      return wrapConfirm('No he ido al baño desde ayer, doctor, y si hago fuerza o pujo me da una punzada horrible abajo a la derecha.');
    }
    const bowelMatch = extractMatchingSentences(patientInfo?.currentIllness, ['diarrea', 'evacua', 'heces'], patientInfo);
    if (bowelMatch) return wrapConfirm(bowelMatch);
    return 'Mis evacuaciones han sido normales, no he tenido diarrea ni sangrado.';
  }

  // 27. Cabeza, visión, luz, cuello
  if (hasWordPrefix(norm, ['cabeza', 'cefalea', 'luz', 'fotofobia', 'cuello', 'nuca', 'rigidez', 'tieso', 'ojos', 'retroocular', 'vision', 'borrosa'])) {
    if (caseId === 'case-meningitis-bacteriana') {
      return wrapConfirm('Me estalla la cabeza de dolor, la luz me lastima muchísimo los ojos y tengo el cuello completamente tieso; no puedo bajar la barbilla hacia el pecho.');
    }
    if (caseId === 'case-dengue-alarm') {
      return wrapConfirm('Me duele muchísimo detrás de los ojos, sobre todo cuando intento mover la mirada hacia los lados, pero puedo mover el cuello normal.');
    }
    const headMatch = extractMatchingSentences(patientInfo?.currentIllness, ['cabeza', 'ojos', 'vision', 'cuello', 'luz'], patientInfo);
    if (headMatch) return wrapConfirm(headMatch);
    return 'No tengo dolor intenso de cabeza, rigidez de cuello ni molestias con la luz, doctor.';
  }

  // 28. Piel, sangrados, manchas, ampollas, picazón, hormigueo
  if (hasWordPrefix(norm, ['sangrad', 'sangre', 'encias', 'nariz', 'moret', 'mancha', 'puntito', 'roncha', 'sarpullido', 'piel', 'petequia', 'ampolla', 'llaga', 'comezon', 'picazon', 'hormigueo', 'adormec'])) {
    if (caseId === 'case-dengue-alarm') {
      return wrapConfirm('Hoy en la mañana me sangraron las encías al cepillarme los dientes y me noté unos puntitos rojos en las piernas y un salpullido tenue.');
    }
    if (caseId === 'case-meningitis-bacteriana') {
      return wrapConfirm('Noté unas manchitas moradas o puntitos rojos pequeños que me salieron en el pecho y las piernas que no se quitan al apretarlos.');
    }
    const skinMatch = extractMatchingSentences(patientInfo?.currentIllness, ['roncha', 'ampolla', 'mancha', 'sangrad', 'llaga', 'ulcera', 'hormigueo', 'adormec', 'prurito', 'picazon', 'piel'], patientInfo);
    if (skinMatch) return wrapConfirm(skinMatch);
    return 'No he notado sangrados, ronchas ni cambios raros en la piel, doctor.';
  }

  // 29. Palpitaciones, latidos, mareos, debilidad, somnolencia, confusión, sueño, ánimo
  if (hasWordPrefix(norm, ['mareo', 'maread', 'desmay', 'debil', 'cansanc', 'sueno', 'somnol', 'confus', 'desorient', 'vertigo', 'despierto', 'alerta', 'palpitac', 'latido', 'corazon', 'dormir', 'durmi', 'ansiedad', 'nervios', 'agitac', 'temblor'])) {
    if (caseId === 'case-dengue-alarm') {
      return wrapConfirm('Estoy sumamente débil y cada vez que me intento poner de pie siento que todo me da vueltas y me voy a desmayar.');
    }
    if (caseId === 'case-cetoacidosis-diabetica') {
      return wrapConfirm('Me siento extremadamente débil y con muchísimo sueño, me cuesta trabajo mantenerme concentrada.');
    }
    if (caseId === 'case-meningitis-bacteriana') {
      return wrapConfirm('Me siento muy aturdido, confundido y con mucho sueño, me cuesta trabajo pensar con claridad.');
    }
    const neuroMatch = extractMatchingSentences(patientInfo?.currentIllness, ['mareo', 'agitac', 'confus', 'nervios', 'temblor', 'debil', 'fatiga', 'somnol'], patientInfo);
    if (neuroMatch) return wrapConfirm(neuroMatch);
    return 'Me siento bastante decaído y cansado por el malestar que traigo, pero estoy consciente.';
  }

  // 30. Pérdida de peso, transfusiones, tatuajes, inmunosupresión, traumas, golpes o mascotas/agua
  if (hasWordPrefix(norm, ['peso', 'adelgaz', 'bajar de peso', 'sudoracion nocturna', 'ganglio', 'bolita'])) {
    return wrapConfirm('No he perdido peso de forma involuntaria últimamente ni he notado bolitas en el cuello o las axilas, doctor.');
  }
  if (hasWordPrefix(norm, ['transfusion', 'tatuaje', 'perforacion', 'piercing', 'vih', 'inmunosup', 'defensas'])) {
    return wrapConfirm('Nunca me han hecho transfusiones de sangre, no tengo tatuajes ni perforaciones y hasta donde sé no tengo problemas de defensas bajas.');
  }
  if (hasWordPrefix(norm, ['golpe', 'caida', 'accidente', 'trauma', 'fractura', 'moto', 'choque', 'esguince', 'inmoviliz'])) {
    const traumaMatch = extractMatchingSentences(
      `${patientInfo?.currentIllness || ''} ${joinList(background?.pathological, '')}`,
      ['accidente', 'moto', 'golpe', 'fractura', 'yeso', 'inmovil', 'trauma', 'caida'],
      patientInfo
    );
    if (traumaMatch) return wrapConfirm(traumaMatch);
    return 'No he sufrido golpes, caídas ni accidentes recientemente, doctor.';
  }
  if (hasWordPrefix(norm, ['mascota', 'perro', 'gato', 'raton', 'rata', 'agua potable', 'marisco', 'carne', 'leche', 'comida callejera'])) {
    const foodEnvMatch = extractMatchingSentences(
      `${patientInfo?.currentIllness || ''} ${joinList(background?.nonPathological, '')}`,
      ['marisco', 'comida', 'agua', 'animal', 'perro', 'gato', 'zancudo', 'campo'],
      patientInfo
    );
    if (foodEnvMatch) return wrapConfirm(foodEnvMatch);
    return 'En casa tomamos agua potable limpia, no convivo con animales enfermos ni he comido alimentos echados a perder.';
  }

  // 31. Preguntas sobre detalles minuciosos de cantidad / color / frecuencia / descripción
  if (hasWordPrefix(norm, ['color', 'aspecto', 'cuant', 'frecuenci', 'exactament', 'detalle', 'como era', 'como es', 'que tipo'])) {
    if (lastPatientMsg) {
      return `Respecto a lo que le comentaba, doctor: ${lastPatientMsg.charAt(0).toLowerCase()}${lastPatientMsg.slice(1)}`;
    }
    if (patientInfo?.currentIllness) {
      return `Respecto a lo que le cuento, doctor: ${adapt(patientInfo.currentIllness)}`;
    }
  }

  // 32. Preguntas generales abiertas de consulta
  if (
    norm.includes('que tiene') ||
    norm.includes('que siente') ||
    norm.includes('como se siente') ||
    norm.includes('que le pasa') ||
    norm.includes('que le paso') ||
    norm.includes('por que viene') ||
    norm.includes('por que vino') ||
    norm.includes('que lo trae') ||
    norm.includes('que la trae') ||
    norm.includes('que le ocurre') ||
    norm.includes('que le sucede') ||
    norm.includes('motivo de consulta') ||
    hasWordPrefix(norm, ['sintoma', 'molestia', 'cuenteme', 'expliqueme'])
  ) {
    if (caseId === 'case-dengue-alarm') {
      return 'Doctor, llevo 4 días sintiéndome fatal: empecé con fiebre altísima y dolor detrás de los ojos, y hoy que bajó la fiebre me dio un dolor abdominal fuerte, vómitos, mareos y sangrado en encías.';
    }
    if (caseId === 'case-apendicitis-aguda') {
      return 'Me duele muchísimo la parte baja derecha del abdomen, doctor. Empezó anoche alrededor del ombligo, tuve vómitos y perdí el apetito por completo.';
    }
    if (caseId === 'case-iamcest-anterior') {
      return 'Tengo una opresión insoportable en el centro del pecho que se me corre a la mandíbula y el brazo izquierdo, con sudor frío y mucha falta de aire.';
    }
    if (caseId === 'case-cetoacidosis-diabetica') {
      return 'Me cuesta mucho respirar, tengo mucha sed, he vomitado varias veces y me siento sumamente débil y somnolienta.';
    }
    if (caseId === 'case-meningitis-bacteriana') {
      return 'Me está estallando la cabeza, doctor, tengo fiebre muy alta, no soporto la luz y el cuello lo siento completamente tieso.';
    }
    if (caseId === 'case-neumonia-adquirida') {
      return 'Tengo fiebre alta desde hace 3 días, tos con flema de color óxido, ahogo y una punzada en el costado derecho del pecho al respirar.';
    }
    if (patientInfo?.currentIllness) {
      return adapt(patientInfo.currentIllness);
    }
    return `Me siento muy mal, doctor. Llevo ${patientInfo?.evolutionTime || 'varios días'} con ${patientInfo?.consultReason?.toLowerCase() || 'mucho malestar'} y siento que empeoro.`;
  }

  // 33. Si hubo confirmación con palabras sueltas y tenemos historial, reafirma coherentemente
  if (isConfirmationOrRepeat && lastPatientMsg) {
    return `Sí doctor, le confirmo eso: ${lastPatientMsg}`;
  }

  // 34. Coincidencia semántica directa con historia clínica o antecedentes antes de rendirse
  const stopWords = new Set(['tiene', 'tienes', 'tuvo', 'tuviste', 'hace', 'como', 'cuando', 'donde', 'quien', 'cual', 'porque', 'para', 'sobre', 'entre', 'usted', 'doctor', 'alguna', 'alguno', 'algun', 'algo', 'mucho', 'poco', 'puede', 'siente', 'sintio', 'presenta', 'presento', 'tenido', 'estado', 'ultimos', 'dias', 'horas']);
  const queryTokens = norm
    .split(' ')
    .filter((w) => w.length >= 4 && !stopWords.has(w));
  if (queryTokens.length > 0) {
    const allContextText = [
      patientInfo?.currentIllness,
      ...(background?.pathological || []),
      ...(background?.nonPathological || []),
      ...(background?.family || []),
      ...(background?.currentMedications || []),
    ]
      .filter(Boolean)
      .join('. ');
    const semanticMatch = extractMatchingSentences(
      allContextText,
      queryTokens.map((t) => t.slice(0, Math.max(4, t.length - 1))),
      patientInfo
    );
    if (semanticMatch) {
      return wrapConfirm(semanticMatch);
    }
    if (norm.includes('?') || hasWord(norm, ['ha', 'has', 'es', 'fue', 'hubo']) || hasWordPrefix(norm, ['tiene', 'tuvo', 'siente', 'presenta', 'consume', 'usa', 'toma', 'padece'])) {
      return isPediatric
        ? `No doctor, que yo haya notado mi hijo no ha tenido eso. Lo que más me preocupa es ${patientInfo?.consultReason?.toLowerCase() || 'su estado'}.`
        : `No doctor, que yo recuerde o haya notado no he tenido eso. Lo que sí me tiene muy mal es ${patientInfo?.consultReason?.toLowerCase() || 'este malestar'}.`;
    }
  }

  // 35. Fallback honesto en primera persona (sin palabras que disparen reemplazos gramaticales)
  return isPediatric
    ? `Disculpe doctor, no entendí bien qué me quiere preguntar exactamente... ¿Me lo puede explicar con otras palabras? Estoy muy angustiada por mi niño y por ${patientInfo?.consultReason?.toLowerCase() || 'como respira'}.`
    : `Disculpe doctor, no entendí bien qué me quiere preguntar exactamente... ¿Podría decírmelo con otras palabras? Me cuesta concentrarme con este malestar que traigo.`;
}
