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
  clinicalClues?: string[];
  characteristicSymptoms?: string[];
  specialty?: string;
  caseId?: string;
  liveVitalSigns?: PatientChatPayload['vitalSigns'];
  appliedStatInterventions?: Array<{
    label: string;
    drug: string;
    dose?: string;
    route: string;
    effectSeverity: string;
    patientFeelingNote: string;
    deltasSummary?: string;
  }>;
  isDeceased?: boolean;
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
  const meaningful = items.filter((item) => {
    const n = normalizeText(item);
    return !(
      n.startsWith('sin ') ||
      n.startsWith('niega ') ||
      n.includes('ningun') ||
      n.includes('sano previamente') ||
      n.includes('sana previamente') ||
      n.includes('sin enfermedades') ||
      n.includes('sin antecedentes') ||
      n.includes('sin alergia') ||
      n.includes('sin cardiopat') ||
      n.includes('sin hospitaliz') ||
      n.includes('no conoci') ||
      n.includes('no recuerda') ||
      n.includes('desconoc') ||
      n.includes('no refiere') ||
      n.includes('no hay')
    );
  });
  return meaningful.length === 0;
}

function capitalizeFirst(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const WB_END = '(?![a-zA-ZáéíóúüñÁÉÍÓÚÜÑ0-9_])';
const WB_START = '(?<![a-zA-ZáéíóúüñÁÉÍÓÚÜÑ0-9_])';

/**
 * Traduce terminología médica, abreviaturas de expediente y anatomía técnica
 * a lenguaje cotidiano comprensible de un paciente real.
 */
export function humanizeMedicalJargon(text: string, isPediatric = false): string {
  if (!text) return '';
  let out = text
    // Limpieza de marcadores y abreviaturas de historia clínica
    .replace(/\bEl d[ií]a anterior\s*\(\s*ayer\s*\)/gi, 'Ayer')
    .replace(/\bayer\s*\(\s*el d[ií]a anterior\s*\)/gi, 'ayer')
    .replace(/\((?:\s*(?:mMRC|GOLD|NYHA|Killip|CHA2DS2|centor|escala|grado)\s*[^)]*)\)/gi, '')
    .replace(/\(\s*(?:[ií]ndice tab[aá]quico[^)]*|\d+\s*paquetes-a[ñn]o[^)]*|IMC\s*[\d.,]+\s*kg\/m[²2]?[^)]*)\)/gi, '')
    .replace(/\b\d+\s*paquetes-a[ñn]o\b/gi, 'varios paquetes al año')
    .replace(/\b(\d+)\s*SDG\b/gi, '$1 semanas de embarazo')
    .replace(/\bc\/\s*(\d+)\s*h(?:oras?)?\b/gi, 'cada $1 horas')
    .replace(/\bpor\s+v[ií]a\s+oral\b|\bVO\b/g, 'tomado')
    .replace(/\b(?:v[ií]a\s+)?IV\b/g, 'por la vena')
    .replace(/\b(?:v[ií]a\s+)?IM\b/gi, 'inyectado')
    .replace(/\bAINEs?\b/g, 'pastillas fuertes para el dolor')
    .replace(/\bde\s+(\d+(?:\s*(?:a|-)\s*\d+)?\s*(?:horas?|d[ií]as?|semanas?|meses|a[ñn]os?))\s+de\s+evoluci[oó]n\b/gi, 'desde hace $1')
    .replace(/\bde\s+evoluci[oó]n\b/gi, 'con esto')
    .replace(/\ben\s+la\s+actualidad\b/gi, 'ahorita')
    .replace(/\bactualmente\b/gi, 'ahorita')
    .replace(/\bconcomitantemente\b/gi, 'al mismo tiempo')
    .replace(/\bposteriormente\b/gi, 'después')
    .replace(/\bpreviamente\b/gi, 'antes')
    .replace(/\bdr[aá]sticamente\b/gi, 'muchísimo')
    .replace(/\bnotablemente\b/gi, 'mucho')
    .replace(/\bprogresiv[oa]mente\b/gi, 'poco a poco')
    .replace(/\bsin\s+mejor[ií]a\b|\bsin\s+respuesta\b/gi, 'pero no se me quitó nada')
    .replace(/\bsin\s+sangre\s+franca\b/gi, 'sin que se vea sangre')
    // Anatomía técnica -> lenguaje cotidiano
    .replace(/\bcuadrante\s+superior\s+derecho\s+(?:del\s+)?abdomen\b|\bhipocondrio\s+derecho\b/gi, 'la parte alta derecha de la panza, debajo de las costillas')
    .replace(/\bcuadrante\s+superior\s+izquierdo\s+(?:del\s+)?abdomen\b|\bhipocondrio\s+izquierdo\b/gi, 'la parte alta izquierda de la panza')
    .replace(/\bfosa\s+il[ií]aca\s+derecha\b|\bcuadrante\s+inferior\s+derecho\b/gi, 'abajo del lado derecho de la panza')
    .replace(/\bfosa\s+il[ií]aca\s+izquierda\b|\bcuadrante\s+inferior\s+izquierdo\b/gi, 'abajo del lado izquierdo de la panza')
    .replace(/\ben\s+la\s+parte\s+baja\s+izquierda\s+del\s+abdomen\b|\bparte\s+baja\s+izquierda\s+del\s+abdomen\b/gi, 'abajo del lado izquierdo de la panza')
    .replace(/\ben\s+la\s+parte\s+baja\s+derecha\s+del\s+abdomen\b|\bparte\s+baja\s+derecha\s+del\s+abdomen\b/gi, 'abajo del lado derecho de la panza')
    .replace(/\bhipogastrio\b/gi, 'el bajo vientre')
    .replace(/\bmesogastrio\b|\bregi[oó]n\s+periumbilical\b/gi, 'alrededor del ombligo')
    .replace(/\bepigastralgia\b|\bepigastrio\b|\bepig[aá]stric[oa]\b/gi, 'la boca del estómago')
    .replace(/\bregi[oó]n\s+lumbar\b|\bzona\s+lumbar\b|\bfosa\s+lumbar\b/gi, 'la espalda baja')
    .replace(/\bdolor\s+lumbar\b/gi, 'dolor de espalda baja')
    .replace(/\bregi[oó]n\s+cervical\b|\bdolor\s+cervical(?:\s+muscular)?\b/gi, 'dolor de cuello')
    .replace(/\bcervical\b/gi, 'del cuello')
    .replace(/\bflanco\b/gi, 'costado de la panza')
    .replace(/\bhemit[oó]rax\s+derecho\b/gi, 'lado derecho del pecho')
    .replace(/\bhemit[oó]rax\s+izquierdo\b/gi, 'lado izquierdo del pecho')
    .replace(/\bdetr[aá]s\s+del\s+estern[oó]n\b|\bretroesternal\b|\bprecordial\b/gi, 'justo en el centro del pecho')
    .replace(/\besc[aá]pula\s+derecha\b/gi, 'paleta derecha de la espalda')
    .replace(/\besc[aá]pula\s+izquierda\b/gi, 'paleta izquierda de la espalda')
    .replace(/\besc[aá]pula\b/gi, 'paleta de la espalda')
    .replace(/\bborde\s+del\s+trapecio\s+izquierdo\b/gi, 'el hombro izquierdo y la parte alta de la espalda')
    .replace(/\bdorso\s+del\s+pie\b/gi, 'empeine del pie')
    .replace(/\bdorso\s+de\s+(?:las\s+)?manos\b/gi, 'parte de arriba de las manos')
    .replace(/\bextremidades\s+inferiores\b|\bmiembros\s+p[eé]lvicos\b|\bmiembros\s+inferiores\b/gi, 'piernas')
    .replace(/\bextremidades\s+superiores\b|\bmiembros\s+tor[aá]cicos\b/gi, 'brazos')
    .replace(/\ben\s+alguna\s+extremidad\b/gi, 'en algún brazo o pierna')
    .replace(/\bmucosa\s+oral\b/gi, 'por dentro de la boca')
    .replace(/\bment[oó]n\b/gi, 'barbilla')
    .replace(/\bgl[uú]teo\s+derecho\b/gi, 'la nalga derecha')
    .replace(/\bgl[uú]teo\s+izquierdo\b/gi, 'la nalga izquierda')
    .replace(/\bgl[uú]teo\b/gi, 'la nalga')
    // Síntomas y signos médicos -> expresiones de paciente
    .replace(/\bdisnea\s+de\s+inicio\s+s[uú]bito\s+en\s+reposo\b/gi, 'falta de aire de repente estando quieto')
    .replace(/\bdisnea\s+de\s+esfuerzo\s+progresiva\b/gi, 'falta de aire al hacer esfuerzo que ha ido empeorando')
    .replace(/\bdisnea\s+de\s+m[ií]nimos\s+esfuerzos\b|\bfalta\s+de\s+aire\s+de\s+m[ií]nimos\s+esfuerzos\b/gi, 'falta de aire hasta con el menor esfuerzo')
    .replace(/\bdisnea\b/gi, 'falta de aire')
    .replace(/\bortopnea\b/gi, 'ahogo al acostarme')
    .replace(/\brinorrea\s+hialina\b/gi, 'moco líquido transparente en la nariz')
    .replace(/\brinorrea\b/gi, 'escurrimiento de nariz')
    .replace(/\bsibilancias\s+audibles\s+a\s+distancia\b/gi, 'silbidos en el pecho que hasta se escuchan de lejos')
    .replace(/\bsibilancias\b/gi, 'silbidos en el pecho')
    .replace(/\bhundimiento\s+del\s+cuello\s+por\s+arriba\s+del\s+estern[oó]n\s+observable\s+aun\s+en\s+reposo\b/gi, 'que se le hunde el huequito del cuello al respirar incluso cuando está quieto')
    .replace(/\bchillido\s+agudo\s+al\s+inspirar\b/gi, 'un ruido agudo como chillido cada vez que jala aire')
    .replace(/\bvoz\s+af[oó]nica\b/gi, 'voz muy ronca o casi sin voz')
    .replace(/\bestridor\b/gi, 'ese chillido al respirar')
    .replace(/\bhundimiento\s+de\s+costillas\b/gi, 'que se le hunden las costillitas al respirar')
    .replace(/\bfebr[ií]cula\s+vespertina\b/gi, 'un poco de calentura en las tardes')
    .replace(/\bfebr[ií]cula\b/gi, 'un poco de calentura')
    .replace(/\bfiebre\s+vespertina\s+intermitente\b/gi, 'calentura que va y viene en las tardes')
    .replace(/\brechazo\s+parcial\s+de\s+las\s+tomas\b|\brechazo\s+al\s+pecho\b/gi, 'que casi no quiere tomar leche')
    .replace(/\bintolerancia\s+a\s+la\s+v[ií]a\s+oral\b/gi, isPediatric ? 'no aguanta ni la leche ni el agua en el estómago' : 'no aguanto ni el agua en el estómago')
    .replace(/\bodinofagia\s+intensa\b/gi, 'dolor muy fuerte al tragar')
    .replace(/\bodinofagia\b/gi, 'dolor al tragar')
    .replace(/\bdisfagia\b/gi, 'dificultad para pasar la comida')
    .replace(/\bdolor\s+tor[aá]cico\s+(?:tipo\s+)?pleur[ií]tico\b/gi, 'punzada en el pecho que duele más al respirar')
    .replace(/\bpleur[ií]tico\b/gi, 'punzante al respirar')
    .replace(/\bdolor\s+tor[aá]cico\s+opresivo\b|\bopresi[oó]n\s+tor[aá]cica(?:\s+leve)?\b/gi, 'apretón en el pecho')
    .replace(/\bdolor\s+tor[aá]cico\b/gi, 'dolor en el pecho')
    .replace(/\bdolor\s+p[eé]lvico(?:\s+agudo)?\b/gi, 'dolor fuerte en el vientre bajo')
    .replace(/\bdolor\s+abdominal\s+difuso\b/gi, 'dolor en toda la panza')
    .replace(/\bdolor\s+abdominal\s+tipo\s+c[oó]lico\b|\bdolor\s+tipo\s+c[oó]lico\b/gi, 'dolor como retortijones en la panza')
    .replace(/\bdolor\s+abdominal\s+c[oó]lico\b/gi, 'dolor como retortijones en la panza')
    .replace(/\bdolor\s+abdominal\b/gi, 'dolor de panza')
    .replace(/\bdistensi[oó]n\s+progresiva\s+del\s+abdomen\b|\bdistensi[oó]n\s+abdominal\b/gi, 'la panza cada vez más inflada')
    .replace(/\bdolor\s+desproporcionado\b/gi, 'un dolor insoportable que no se compara con nada')
    .replace(/\bdolor\s+sordo\s+(?:y\s+constante|profundo)?\b/gi, 'un dolor pesado y constante')
    .replace(/\bdolor\s+referido\s+al\s+hombro\b/gi, 'un dolor que también se siente en el hombro')
    .replace(/\binspirar\s+profundo\b/gi, 'jalar aire hondo')
    .replace(/\birradiado\s+al\s+dorso\b|\bhacia\s+el\s+dorso\b/gi, 'corrido hacia la espalda')
    .replace(/\bcon\s+irradiaci[oó]n\s+genital\b/gi, 'que se corre hacia mis partes bajas')
    .replace(/\birradiaci[oó]n\s+genital\b/gi, 'corriéndose hacia mis partes bajas')
    .replace(/\birradiad[oa]\s+a\b/gi, 'que se me corre hacia')
    .replace(/\bse\s+irradia\s+(?:a|al|hacia)\b/gi, 'se me corre hacia')
    .replace(/\bde\s+contenido\s+alimentario\s+y\s+luego\s+biliar\b/gi, 'de comida y luego líquido amarillo muy amargo')
    .replace(/\bv[oó]mitos\s+g[aá]stricos\b/gi, 'vómitos de puro líquido del estómago')
    .replace(/\bv[oó]mitos\s+biliosos\s+y\s+luego\s+oscuro-fecaloideos\b/gi, 'vómitos amarillos amargos y luego oscuros con muy mal olor')
    .replace(/\bv[oó]mitos\s+biliosos\b/gi, 'vómitos amarillos y muy amargos')
    .replace(/\bv[oó]mitos\s+fecaloideos?\b/gi, 'vómitos oscuros con muy mal olor')
    .replace(/\bv[oó]mitos\s+incoercibles\b/gi, 'vómitos seguidos que no paran')
    .replace(/\bdiarrea\s+acuosa\s+abundante\b/gi, 'diarrea muy aguada y abundante')
    .replace(/\bdiarrea\s+acuosa\b/gi, 'diarrea muy aguada')
    .replace(/\bevacuaciones\s+l[ií]quidas\s+amarillentas\b/gi, isPediatric ? 'diarrea muy aguada y amarilla' : 'evacuaciones muy aguadas y amarillas')
    .replace(/\bevacuaciones\s+diarias\s+semil[ií]quidas\b/gi, 'evacuaciones muy aguadas todos los días')
    .replace(/\bev[aá]cuaciones\s+(?:semi)?l[ií]quidas\b/gi, isPediatric ? 'diarrea muy aguada' : 'evacuaciones muy aguadas')
    .replace(/\bpujo,\s*tenesmo\s+rectal,\s*urgencia\s+defecatoria\b/gi, 'ganas urgentes de ir al baño y sentir que no termino de evacuar')
    .replace(/\bpujo\b|\btenesmo\s+rectal\b|\burgencia\s+defecatoria\b/gi, 'ganas urgentes de ir al baño')
    .replace(/\bestr[ií]as\s+de\s+sangre\s+roja(?:\s+brillante)?\b/gi, 'hilillos de sangre roja')
    .replace(/\baumento\s+en\s+la\s+frecuencia\s+urinaria\s+en\s+peque[ñn]as\s+cantidades\b/gi, 'ganas de ir a orinar a cada ratito pero poquito')
    .replace(/\bsensaci[oó]n\s+urgente\s+de\s+querer\s+seguir\s+orinando\b/gi, 'quedarme con ganas de seguir orinando')
    .replace(/\bdisuria\s+refleja\b|\bdisuria\b/gi, 'ardor al orinar')
    .replace(/\bpolaquiuria\b/gi, 'ganas de orinar muy seguido')
    .replace(/\bhematuria\b/gi, 'sangre en la orina')
    .replace(/\bcoluria\b/gi, 'orina oscura como té')
    .replace(/\boliguria\b|\bdisminuci[oó]n\s+de\s+la\s+orina\b/gi, 'orinar muy poquito')
    .replace(/\bhemoptisis(?:\s+leve)?\b/gi, 'toser con un poco de sangre')
    .replace(/\besputo\b/gi, 'flema')
    .replace(/\bmelena\b|\bevacuaciones\s+negras\b/gi, 'evacuaciones negras como chapopote')
    .replace(/\bheces\s+u\s+orina\b/gi, 'el excremento o la orina')
    .replace(/\ben\s+heces\b/gi, 'en el excremento')
    .replace(/\bedema\s+de\s+piernas\b/gi, 'piernas hinchadas')
    .replace(/\bedema\b|\baumento\s+de\s+volumen\b/gi, 'hinchazón')
    .replace(/\bpirosis\s+(?:retroesternal|epig[aá]strica)\b/gi, 'ardor que sube del estómago al centro del pecho')
    .replace(/\bpirosis\b/gi, 'ardor que sube del estómago al pecho')
    .replace(/\bpostprandial\b|\bposprandial\b/gi, 'después de comer')
    .replace(/\bregurgitaci[oó]n\s+[aá]cida\b/gi, 'que se me regresa líquido agrio a la garganta')
    .replace(/\bregurgitaci[oó]n\b/gi, 'que se me regresa la comida')
    .replace(/\bcardiopat[ií]a(?:\s+isqu[eé]mica)?\b/gi, 'un problema del corazón')
    .replace(/\bcrisis\s+convulsivas\b/gi, 'convulsiones o ataques')
    .replace(/\bfotofobia\b/gi, 'molestia fuerte con la luz')
    .replace(/\bfonofobia\b/gi, 'molestia fuerte con el ruido')
    .replace(/\bhemicraneana\b/gi, 'de un solo lado de la cabeza')
    .replace(/\bintolerancia\s+marcada\s+al\s+fr[ií]o\b/gi, 'muchísimo frío todo el tiempo')
    .replace(/\bsecreci[oó]n\s+l[aá]ctea\s+por\s+los\s+pezones\b/gi, 'que salga leche por los pezones')
    .replace(/\bp[eé]rdida\s+de\s+conciencia\b/gi, 'desmayo')
    .replace(/\bdiaforesis\s+profusa\b|\bsudoraci[oó]n\s+profusa\b|\bsudoraci[oó]n\s+empapante\b/gi, 'muchísimo sudor que empapa la ropa')
    .replace(/\bagitaci[oó]n\s+psicomotriz\s+intensa\b/gi, 'mucha desesperación e inquietud')
    .replace(/\balucinaciones\s+visuales\s+de\s+insectos\b/gi, 'ver bichos o animalitos donde no hay nada')
    .replace(/\bdesorientaci[oó]n\b/gi, 'que por ratos no sé ni dónde estoy')
    .replace(/\btemblor\s+fino\s+generalizado\b/gi, 'temblor en las manos y en todo el cuerpo')
    .replace(/\bconfusi[oó]n\s+fluctuante\b/gi, 'que por ratos me confundo y no coordino bien')
    .replace(/\bsacudidas\s+(?:involuntarias|r[ií]tmicas)\b/gi, 'sacudidas que no puedo controlar')
    .replace(/\bsensaci[oó]n\s+g[aá]strica\s+ascendente\b/gi, 'una sensación rara que me sube desde la panza')
    .replace(/\bdesconexi[oó]n\s+breve\b/gi, 'como que me desconectaba unos segundos')
    .replace(/\bsomnolencia\s+(?:profunda|progresiva)\b/gi, 'muchísimo sueño y pesadez')
    .replace(/\bletargia\b/gi, 'mucho sueño y decaimiento')
    .replace(/\bfatiga\s+intensa\s+progresiva\b/gi, 'muchísimo cansancio que ha ido aumentando')
    .replace(/\bdolor\s+muscular\s+generalizado\b/gi, 'dolor en todos los músculos del cuerpo')
    .replace(/\bmialgias\s+generalizadas\s+y\s+artralgias\b/gi, 'dolor fuerte de cuerpo y articulaciones')
    .replace(/\bcefalea\s+retroocular\s+intensa\b/gi, 'dolor fuerte detrás de los ojos')
    .replace(/\bcefalea\s+frontal\s+intensa\s+continua\b/gi, 'dolor de cabeza continuo y muy fuerte en la frente')
    .replace(/\bcefalea\s+frontal\s+intensa\b/gi, 'dolor de cabeza muy fuerte en la frente')
    .replace(/\bcefalea\b/gi, 'dolor de cabeza')
    .replace(/\bprurito\s+intenso\b/gi, 'comezón desesperante')
    .replace(/\bprurito\b/gi, 'comezón')
    .replace(/\bexantema\s+generalizado\b/gi, 'salpullido y ronchas por todo el cuerpo')
    .replace(/\bexantema\b/gi, 'salpullido o ronchas')
    .replace(/\bplaca\s+roja\s+brillante\b/gi, 'mancha roja brillante e inflamada')
    .replace(/\bconjuntivitis\b/gi, 'ojos rojos o con lagañas')
    .replace(/\balodinia\b/gi, 'dolor hasta con el roce de la ropa')
    .replace(/\blagoftalmos\b/gi, 'dificultad para cerrar el ojo')
    .replace(/\bsangrado\s+menstrual\s+abundante\s*\(\s*reglas\s+muy\s+abundantes\s*\)/gi, 'reglas muy abundantes')
    .replace(/\bsangrado\s+menstrual\s+abundante\b/gi, 'reglas muy abundantes')
    .replace(/\boligomenorrea\b/gi, 'reglas muy espaciadas')
    .replace(/\bhipermenorrea\b/gi, 'reglas muy abundantes')
    .replace(/\bpagofagia\b/gi, 'antojo de masticar hielo')
    .replace(/\bparestesias?\b/gi, 'hormigueo')
    .replace(/\btaquicardia\b/gi, 'el corazón muy acelerado')
    .replace(/\bbroncoespasmo\b/gi, 'que se me cierra el pecho')
    .replace(/\bcrisis\s+generalizada\b/gi, 'ataque fuerte con sacudidas')
    .replace(/\bcrisis\s+epil[eé]ptica\b/gi, 'ataque con sacudidas')
    .replace(/\bconvulsi[oó]n\s+febril(?:\s+prolongada)?\b/gi, 'una convulsión por fiebre alta')
    .replace(/\bposici[oó]n\s+anti[aá]lgica\s+en\s+gatillo\b/gi, 'encoger las piernas hacia el pecho porque así aguanto un poco más')
    .replace(/\bposici[oó]n\s+anti[aá]lgica\b/gi, 'postura encogida para aguantar el dolor')
    .replace(/\ben\s+plegaria\s+mahometana\b|\bplegaria\s+mahometana\b/gi, 'inclinándome hacia adelante')
    .replace(/\bdec[uú]bito\s+supino\b/gi, 'acostarme boca arriba')
    .replace(/\ben\s+acostarme\s+boca\s+arriba\b/gi, 'al acostarme boca arriba')
    .replace(/\bcon\s+inquietud\s+motora\s+constante\b|\binquietud\s+motora\s+constante\b/gi, 'sin poder quedarme quieto de la desesperación')
    .replace(/\bcon\s+inmovilidad\s+relativa\b|\binmovilidad\s+relativa\b/gi, 'casi sin moverme')
    .replace(/\bingesta\s+grasa\b|\bcomidas\s+ricas\s+en\s+grasa\b/gi, 'comer cosas grasosas')
    .replace(/\bcenas\s+copiosas\b/gi, 'cenar muy pesado')
    .replace(/\bs[uú]bit[oa]mente\b/gi, 'de repente')
    .replace(/\bde\s+forma\s+s[uú]bita\b|\bde\s+inicio\s+s[uú]bito\b/gi, 'de golpe')
    .replace(/\bs[uú]bit[oa]\b/gi, 'repentino')
    .replace(/\bjarabes?\s+mucol[ií]ticos?\b/gi, 'jarabes para sacar la flema')
    .replace(/\bantiparasitarios\b/gi, 'pastillas para los parásitos')
    .replace(/\bprofilaxis\s+antibi[oó]tica\b/gi, 'antibiótico preventivo')
    .replace(/\bestancia\s+infantil\b/gi, 'guardería')
    .replace(/\ben\s+su\s+estancia\b/gi, 'en su guardería')
    .replace(/\bantitet[aá]nica\b/gi, 'contra el tétanos')
    .replace(/\bal\s+llegar\s+a\s+consulta\s+ya\s+me\s+encuentro\s+totalmente\s+despiert[oa]\s+y\s+orientad[oa]\b/gi, 'ahorita ya desperté bien y sé dónde estoy')
    .replace(/\bparec[ií]a\s+comprender\s+[oó]rdenes\s+simples\b/gi, 'sí entendía lo que me decían')
    .replace(/\barticular\s+palabras\b/gi, 'pronunciar bien las palabras')
    // Antecedentes médicos técnicos -> como lo dice un paciente
    .replace(/\bcolelitiasis\s+documentada\s+por\s+ultrasonido\b/gi, 'piedras en la vesícula que me vieron en un ultrasonido')
    .replace(/\bcolelitiasis\b/gi, 'piedras en la vesícula')
    .replace(/\bprimigesta,\s*embarazo\s+actual\s+de\b/gi, 'es mi primer embarazo y tengo')
    .replace(/\bhipertensi[oó]n\s+(?:arterial\s+(?:sist[eé]mica|cr[oó]nica)|cr[oó]nica(?:\s+conocida)?)\b|\bhipertensi[oó]n\s+arterial\b|\bhipertensi[oó]n\b/gi, 'presión alta')
    .replace(/\bdiabetes\s+mellitus\s+tipo\s+2\b/gi, 'diabetes')
    .replace(/\bdislipidemia\s+(?:mixta|leve|moderada)\b|\bdislipidemia\b/gi, 'colesterol y triglicéridos altos')
    .replace(/\bfibrilaci[oó]n\s+auricular(?:\s+parox[ií]stica\/persistente|\s+cr[oó]nica)?\b/gi, 'un problema del corazón donde me late disparejo')
    .replace(/\bprolapso\s+de\s+v[aá]lvula\s+mitral(?:\s+conocido)?\b/gi, 'un problema en una válvula del corazón')
    .replace(/\bneuralgia\s+del\s+trig[eé]mino\b/gi, 'un dolor muy fuerte de nervio en la cara')
    .replace(/\btrastorno\s+depresivo\s+mayor\s+estable\s+con\b/gi, 'depresión controlada con')
    .replace(/\benfermedad\s+p[eé]lvica\s+inflamatoria\b/gi, 'una infección fuerte en la matriz o los ovarios')
    .replace(/\benfermedad\s+de\s+Graves-Basedow\b/gi, 'un problema en la tiroides')
    .replace(/\bhipotiroidismo(?:\s+leve)?\b/gi, 'tiroides lenta')
    .replace(/\bgonartrosis\s+bilateral\s+cr[oó]nica\b/gi, 'desgaste crónico en las dos rodillas')
    .replace(/\bgonartrosis\b/gi, 'desgaste en las rodillas')
    .replace(/\bartrosis\s+de\s+rodilla\b/gi, 'desgaste en la rodilla')
    .replace(/\brinitis\s+al[eé]rgica(?:\s+estacional)?(?:\s+leve)?\b/gi, 'alergia nasal por temporadas')
    .replace(/\bdermatitis\s+at[oó]pica(?:\s+leve)?(?:\s+en\s+pliegues)?\b/gi, 'alergia en la piel (en los pliegues)')
    .replace(/\bepisodios?\s+breves?\s+de\s+lumbalgia(?:\s+leve)?\b/gi, 'veces que me dio dolor de espalda baja')
    .replace(/\blumbalgia(?:\s+(?:mec[aá]nica|aguda|cr[oó]nica|leve))?\b/gi, 'dolor de espalda baja')
    .replace(/\bti[ñn]a\s+pedis\s+interdigital\s+cr[oó]nica\s+no\s+tratada\b/gi, 'hongo entre los dedos de los pies desde hace tiempo sin tratar')
    .replace(/\bti[ñn]a\s+pedis\b/gi, 'pie de atleta')
    .replace(/\binsuficiencia\s+venosa\s+superficial\s+leve\s+en\s+(?:piernas|miembros\s+inferiores)\b/gi, 'várices leves en las piernas')
    .replace(/\binsuficiencia\s+venosa\b/gi, 'várices y mala circulación en las piernas')
    .replace(/\bgastritis\s+erosiva\s+reciente\b/gi, 'gastritis fuerte hace poco')
    .replace(/\btrastorno\s+por\s+uso\s+de\s+alcohol\s+severo\b/gi, 'problema fuerte con el alcohol')
    .replace(/\bcuadro\s+(?:viral\s+)?respiratorio\s+alto\b|\binfecci[oó]n\s+respiratoria\s+alta(?:\s+leve)?\b|\bcuadro\s+gripal(?:\s+leve)?\b/gi, 'una gripa o resfriado')
    .replace(/\bgastroenteritis\s+aguda(?:\s+autolimitada)?\b/gi, 'una infección de estómago con diarrea')
    .replace(/\bsinusitis\s+cr[oó]nica\b/gi, 'inflamación o infección frecuente de los senos paranasales')
    .replace(/\binfecciones\s+urinarias\s+bajas\s+previas\b/gi, 'infecciones de orina antes')
    .replace(/\btratadas\s+con\s+esquemas\s+cortos\b/gi, 'que me trataron con antibióticos pocos días')
    .replace(/\bepisodio\s+leve\s+de\s+arenillas?\s+renales?\b/gi, 'una vez que me dijeron que tenía arenilla en los riñones')
    .replace(/\bextracci[oó]n\s+de\s+tercer\s+molar\s+infectado\b/gi, 'me sacaron una muela del juicio que estaba infectada')
    .replace(/\bobesidad\s+grado\s+(?:I|II|III)\b/gi, 'sobrepeso importante')
    .replace(/\bsobrepeso\s+grado\s+(?:I|II|III)\b|\bsobrepeso\s+leve\b/gi, 'un poco de sobrepeso')
    .replace(/\besguince\s+de\s+tobillo\b/gi, 'torcedura fuerte de tobillo')
    .replace(/\btabaquismo\s+intenso\s+cr[oó]nico\b/gi, 'que fumé muchísimo durante muchos años')
    .replace(/\blaparotom[ií]a\s+media\b/gi, 'cirugía abierta de la panza')
    .replace(/\bgastritis\s+cr[oó]nica\s+tratada\s+con\s+IBP\s+continuo\b/gi, 'gastritis tratada todos los días con pastillas para el ácido')
    .replace(/\bIBP\b/g, 'pastillas para la acidez')
    .replace(/\bvit[ií]ligo\s+leve\b/gi, 'manchas blancas leves en la piel')
    .replace(/\buso\s+de\s+benzodiacepinas\s+previas\b/gi, 'pastillas para dormir o los nervios')
    .replace(/\btraumatismos\s+craneales\s+recientes\b/gi, 'golpes recientes en la cabeza')
    .replace(/\breposo\s+prolongado\s+en\s+cama\b/gi, 'varios días acostado sin moverme')
    .replace(/\bsin\s+protecci[oó]n\s+g[aá]strica\b/gi, 'sin tomar nada para proteger el estómago')
    .replace(/\bsin\s+estudio\s+(?:m[eé]dico|ginecol[oó]gico)\s+previo\b/gi, 'sin que me hayan hecho estudios antes')
    .replace(/\bcon\s+apego\s+irregular\b/gi, 'aunque no me lo tomo todos los días')
    .replace(/\bespor[aá]dic[oa]\b/gi, 'de vez en cuando')
    .replace(/\babuso\s+de\s*>\s*(\d+)\s*disparos\b/gi, 'me he puesto más de $1 disparos')
    .replace(/\bp[eé]rdida\s+involuntaria\s+de\s+(\d+\s*kg)(?:\s+de\s+peso)?\b/gi, 'que bajé $1 sin proponérmelo')
    .replace(/\bmenarca\s+a\s+los\s+(\d+)\s+a[ñn]os\b/gi, 'mi primera regla fue a los $1 años')
    .replace(/\bmenopausia\s+a\s+los\s+(\d+)\s+a[ñn]os\b/gi, 'se me quitó la regla a los $1 años')
    .replace(/\bnacido\s+a\s+t[eé]rmino\s*\([^)]*\),?\s*peso\s*[\d,.]+\s*g\b/gi, 'nació bien a sus nueve meses y con buen peso')
    .replace(/\bvacunaci[oó]n\s+completa\s+al\s+d[ií]a\b|\besquema\s+de\s+vacunaci[oó]n(?:\s+completo\s+para\s+su\s+edad|\s+al\s+d[ií]a)\b/gi, 'tiene todas sus vacunas al día')
    .replace(/\bsin\s+tratamiento\s+regular\b/gi, 'sin cuidarme seguido con pastillas')
    .replace(/\ben\s+control\s+irregular\b/gi, 'que casi no me controlo')
    .replace(/\bsano\s+previamente\b|\bsin\s+enfermedades\s+cr[oó]nicas(?:\s+previas)?\b|\bsin\s+cardiopat[ií]as\s+previas\s+conocidas\b/gi, 'antes siempre estuve sano')
    // Corrección automática de artículos y concordancias tras reemplazos
    .replace(/\b(en|a|hacia|desde|por)\s+el\s+la\b/gi, '$1 la')
    .replace(/\bdel\s+la\b/gi, 'de la')
    .replace(/\bal\s+la\b/gi, 'a la')
    .replace(/\b(el|la|los|las)\s+\1\b/gi, '$1')
    .replace(/\b(en|a|hacia|desde)\s+abajo\b/gi, 'abajo')
    .replace(/\ben\s+la\s+panza\s+en\s+la\s+parte\s+baja\s+de\s+la\s+panza\b/gi, 'en la parte baja de la panza')
    .replace(/\ben\s+la\s+panza\s+abajo\s+del\s+lado\s+(derecho|izquierdo)\s+de\s+la\s+panza\b/gi, 'abajo del lado $1 de la panza')
    .replace(/\bde\s+la\s+dolor\b/gi, 'del dolor')
    .replace(/\bla\s+dolor\b/gi, 'el dolor')
    .replace(/\buna\s+dolor\b/gi, 'un dolor')
    .replace(/\b(colesterol y triglic[eé]ridos altos)\s+controlad[oa]\b/gi, '$1 controlados')
    .replace(/\b(colesterol y triglic[eé]ridos altos|un problema del coraz[oó]n[^,.]*|un dolor muy fuerte de nervio en la cara)\s+diagnosticad[oa]\b/gi, '$1 diagnosticado')
    .replace(/\b(hilillos de sangre roja)\s+mezcladas\b/gi, '$1 mezclados')
    .replace(/\be\s+la\s+parte\b/gi, 'y la parte')
    .replace(/\by\s+hilillos\b/gi, 'e hilillos')
    .replace(/\s+([.,])/g, '$1')
    .replace(/\s{2,}/g, ' ')
    .trim();

  return out;
}

/**
 * Convierte texto clínico escrito en 3ra persona (currentIllness, background, respuestas)
 * a 1ra persona natural del paciente (o de la madre/padre si es un paciente pediátrico < 12 años).
 */
export function toFirstPersonClinicalSpeech(
  sentence: string,
  patientInfo?: PatientChatPayload['patientInfo']
): string {
  if (!sentence) return '';
  let out = sentence.trim();
  const isPediatric = patientInfo?.age !== undefined && patientInfo.age < 12;
  const sexNorm = normalizeText(patientInfo?.sex || '');
  const isFemale = sexNorm.includes('femenin') || sexNorm.includes('mujer');
  const pedChild = isFemale ? 'mi niña' : 'mi niño';

  if (isPediatric) {
    out = out
      .replace(
        /^(?:Lactante|Paciente(?:\s+pedi[aá]tric[oa])?)(?:\s+(?:masculino|femenino|femenina))?\s+de\s+(\d+\s+(?:a[ñn]os?|meses|d[ií]as))\s+(?:tra[ií]d[oa](?:\s+\S+){0,6}?\s+por\s+su\s+(?:madre|mam[aá]|padre|pap[aá])(?:\s*\([^)]*\))?\s+(?:porque|por)\s+)/i,
        `Traje a ${pedChild} de $1 porque `
      )
      .replace(
        /^(?:Lactante|Paciente(?:\s+pedi[aá]tric[oa])?)(?:\s+(?:masculino|femenino|femenina))?\s+de\s+(\d+\s+(?:a[ñn]os?|meses|d[ií]as))\s+tra[ií]d[oa](?:\s+\S+){0,6}?\s+por\s+su\s+(?:madre|mam[aá]|padre|pap[aá])(?:\s*\([^)]*\))?\.?\s*/i,
        `Soy su mamá y traje a ${pedChild} de $1. `
      )
      .replace(/^(?:Lactante|Paciente(?:\s+pedi[aá]tric[oa])?)(?:\s+(?:masculino|femenino|femenina))?\s+de\s+(\d+\s+(?:a[ñn]os?|meses|d[ií]as))\s*,?\s*/i, `${capitalizeFirst(pedChild)} de $1 `)
      .replace(/\baplicados por la madre\b/gi, 'que le puse yo')
      .replace(/\bpor\s+su\s+madre\b|\bpor\s+su\s+mam[aá]\b/gi, 'conmigo')
      .replace(/\bsu\s+(?:mam[aá]|madre)\s+(?:le\s+ofreci[oó]|intent[oó]\s+darle)\b/gi, (m) =>
        m.toLowerCase().includes('intent') ? 'yo intenté darle' : 'yo le di'
      )
      .replace(/\ben\s+brazos\s+de\s+la\s+madre\b/gi, 'en mis brazos')
      .replace(/\bAsiste\s+a\s+guarder[ií]a\b/gi, `${capitalizeFirst(pedChild)} va a la guardería`)
      .replace(/\bRefiere\s+que\b/gi, 'Le cuento que')
      .replace(new RegExp(`${WB_START}niega${WB_END}`, 'gi'), 'no ha tenido')
      .replace(new RegExp(`${WB_START}refiere${WB_END}`, 'gi'), 'tiene')
      .replace(new RegExp(`${WB_START}present[oó]${WB_END}`, 'gi'), 'tuvo')
      .replace(new RegExp(`${WB_START}presenta${WB_END}`, 'gi'), 'tiene')
      .replace(new RegExp(`${WB_START}inici[oó]${WB_END}`, 'gi'), 'empezó')
      .replace(new RegExp(`${WB_START}comenz[oó]${WB_END}`, 'gi'), 'empezó')
      .replace(/\bsu\s+hermano\b/gi, 'su hermanito');
    out = humanizeMedicalJargon(out, true);
    if (isFemale) {
      out = out
        .replace(/\bnacido\s+a\s+t[eé]rmino\b/gi, 'nació bien a sus nueve meses')
        .replace(/\bantes\s+sano\b/gi, 'antes sana');
    } else {
      out = out.replace(/\bnacido\s+a\s+t[eé]rmino\b/gi, 'nació bien a sus nueve meses');
    }
    out = out.replace(/([.!?]\s+)([a-záéíóúüñ])/g, (_, p1, p2) => `${p1}${p2.toUpperCase()}`);
    return capitalizeFirst(out.replace(/\s+/g, ' ').trim());
  }

  out = out
    // Encabezados típicos de historia clínica
    .replace(
      /^Paciente\s+(?:masculino|femenino|femenina)\s+de\s+\d+\s+a[ñn]os\s*,?\s*(?:con antecedente de\s+)/i,
      'Padezco de '
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
      /^Paciente\s+(?:masculino|femenino|femenina)\s+de\s+\d+\s+a[ñn]os\s*,?\s*(?:que\s+)?(?:acude|consulta)(?:\s+a\s+(?:urgencias|consulta\s+externa))?\s+(porque|por)\s+/i,
      'Mire doctor, vengo $1 '
    )
    .replace(
      /^Paciente\s+(?:masculino|femenino|femenina)\s+de\s+\d+\s+a[ñn]os\s*,?\s*a\s+quien\s+le\s+iniciaron\s+/i,
      'Me empezaron a dar '
    )
    .replace(
      /^Paciente\s+(?:masculino|femenino|femenina)\s+de\s+\d+\s+a[ñn]os\s*,?\s*(?:quien|que)\s+/i,
      ''
    )
    .replace(/^Paciente\s+(?:masculino|femenino|femenina)\s+de\s+\d+\s+a[ñn]os\s*,?\s*/i, '')
    .replace(/\b(?:Es|Fue)\s+tra[ií]d[oa]\s+(?:a urgencias\s+|en camilla\s+)?por\s+sus\s+compa[ñn]eros(?:\s+de\s+cuarto)?\s+debido\s+a\s+/gi, 'Me trajeron mis compañeros porque me dio ')
    .replace(/\bTra[ií]d[oa]\s+por\s+([^,.]+?)\s+tras\s+haber\s+presentado\b/gi, 'Me trajo $1 porque tuve')
    .replace(/\b(?:Es|Fue)?\s*tra[ií]d[oa]\s+(?:a urgencias\s+|en camilla\s+)?por\s+([^,.]+?)\s+(?:por|debido a|con)\s+/gi, 'Me trajo $1 por ')
    .replace(/\btra[ií]d[oa]\s+en\s+camilla\s+por\s+personal\s+de\s+sanidad\s+por\s+/gi, 'me trajeron en camilla porque me dio ')
    .replace(/\bAntecedente\s+de\s+haber\s+adoptado\b/gi, 'Adopté')
    .replace(/\bAntecedente\s+de\b/gi, 'Tengo antecedente de')
    .replace(new RegExp(`seg[uú]n\\s+(?:refiere|cuenta)\\s+su\\s+(?:mam[aá]|madre)${WB_END}`, 'gi'), 'según cuenta mi mamá')
    // Pronombres y posesivos de 3ra persona referidos al paciente
    .replace(/\bsus\s+compa[ñn]eros\b/gi, 'mis compañeros')
    .replace(/\bsu\s+madre\b|\bsu\s+mam[aá]\b/gi, 'mi mamá')
    .replace(/\bsu\s+padre\b|\bsu\s+pap[aá]\b/gi, 'mi papá')
    .replace(/\bsu\s+hermano\b/gi, 'mi hermano')
    .replace(/\bsu\s+hermana\b/gi, 'mi hermana')
    .replace(/\bsu\s+esposa\b/gi, 'mi esposa')
    .replace(/\bsu\s+esposo\b/gi, 'mi esposo')
    .replace(/\bsu\s+pareja\b/gi, 'mi pareja')
    .replace(/\bsu\s+inhalador\b/gi, 'mi inhalador')
    .replace(/\bsu\s+cuarto\b/gi, 'mi cuarto')
    .replace(/\bsu\s+anticoagulante\b/gi, 'mis pastillas para la circulación')
    .replace(/\bsus\s+menstruaciones\b|\bsus\s+reglas\b/gi, 'mis reglas')
    .replace(/\bsus\s+dosis\b/gi, 'mis dosis')
    .replace(/\bsu\s+ingesta\b/gi, 'lo que tomo o como')
    .replace(/\bpor\s+(?:el|la)\s+paciente\b/gi, 'por mí')
    .replace(/\ba\s+(?:el|la)\s+paciente\b|\bal\s+paciente\b/gi, 'a mí')
    .replace(/\b(?:el|la)\s+paciente\b/gi, 'yo')
    // Clíticos de objeto indirecto y frases reflexivas médicas
    .replace(new RegExp(`${WB_START}se\\s+acompa[ñn]a\\s+de${WB_END}`, 'gi'), 'además tengo')
    .replace(new RegExp(`${WB_START}se\\s+acompa[ñn][oó]\\s+de${WB_END}`, 'gi'), 'además tuve')
    .replace(new RegExp(`${WB_START}acompa[ñn]ad[oa]s?\\s+de${WB_END}`, 'gi'), 'junto con')
    .replace(new RegExp(`${WB_START}se\\s+asociaron${WB_END}`, 'gi'), 'además me dieron')
    .replace(new RegExp(`${WB_START}no\\s+le\\s+preocup[oó]${WB_END}`, 'gi'), 'no me preocupó')
    .replace(new RegExp(`${WB_START}casi\\s+(?:la|lo|le)\\s+hace\\s+desmayarse${WB_END}`, 'gi'), 'casi me desmayo')
    .replace(new RegExp(`${WB_START}que\\s+(?:lo|la)\\s+hace${WB_END}`, 'gi'), 'que me hace')
    .replace(new RegExp(`${WB_START}(?:hasta\\s+)?impidi[eé]ndole${WB_END}`, 'gi'), 'hasta no dejarme')
    .replace(new RegExp(`${WB_START}impedirle${WB_END}`, 'gi'), 'no dejarme')
    .replace(new RegExp(`${WB_START}aun\\s+habi[eé]ndose\\s+aplicado${WB_END}`, 'gi'), 'aunque ya me eché')
    .replace(new RegExp(`${WB_START}todo\\s+el\\s+cuarto\\s+le\\s+daba\\s+vueltas${WB_END}`, 'gi'), 'todo el cuarto me daba vueltas')
    .replace(new RegExp(`${WB_START}al\\s+darse\\s+vuelta${WB_END}`, 'gi'), 'al darme vuelta')
    .replace(new RegExp(`${WB_START}al\\s+incorporarse${WB_END}`, 'gi'), 'al levantarme')
    .replace(new RegExp(`${WB_START}mira\\s+hacia${WB_END}`, 'gi'), 'miro hacia')
    .replace(new RegExp(`${WB_START}se\\s+recuesta${WB_END}`, 'gi'), 'me recuesto')
    .replace(new RegExp(`${WB_START}vuelve\\s+a\\s+sentir${WB_END}`, 'gi'), 'vuelvo a sentir')
    .replace(new RegExp(`${WB_START}mantiene\\s+la\\s+cabeza${WB_END}`, 'gi'), 'mantengo la cabeza')
    .replace(new RegExp(`${WB_START}cuando\\s+corre,\\s+se\\s+expone\\s+al\\s+polvo${WB_END}`, 'gi'), 'cuando corro, me da el polvo')
    .replace(new RegExp(`${WB_START}o\\s+sale\\s+al\\s+aire${WB_END}`, 'gi'), 'o salgo al aire')
    .replace(new RegExp(`${WB_START}le\\s+sali[oó]${WB_END}`, 'gi'), 'me salió')
    .replace(new RegExp(`${WB_START}le\\s+imped[ií]an${WB_END}`, 'gi'), 'no me dejaban')
    .replace(new RegExp(`${WB_START}le\\s+impide${WB_END}`, 'gi'), 'no me deja')
    .replace(new RegExp(`${WB_START}le\\s+dificulta${WB_END}`, 'gi'), 'me cuesta mucho')
    .replace(new RegExp(`${WB_START}le\\s+molesta${WB_END}`, 'gi'), 'me molesta')
    .replace(new RegExp(`${WB_START}le\\s+da\\s+mucha${WB_END}`, 'gi'), 'me da mucha')
    .replace(new RegExp(`${WB_START}le\\s+prest[oó]${WB_END}`, 'gi'), 'me prestó')
    .replace(new RegExp(`${WB_START}le\\s+tomaron${WB_END}`, 'gi'), 'me tomaron')
    .replace(new RegExp(`${WB_START}(?:la|lo|le)\\s+despert[oó]${WB_END}`, 'gi'), 'me despertó')
    .replace(new RegExp(`${WB_START}(?:la|lo|le)\\s+despierta${WB_END}`, 'gi'), 'me despierta')
    .replace(new RegExp(`${WB_START}(?:la|lo|le)\\s+obligan${WB_END}`, 'gi'), 'me obligan')
    .replace(new RegExp(`${WB_START}(?:la|lo|le)\\s+obliga${WB_END}`, 'gi'), 'me obliga')
    .replace(new RegExp(`${WB_START}baj[aá]ndole${WB_END}`, 'gi'), 'bajándome')
    .replace(new RegExp(`${WB_START}salirle${WB_END}`, 'gi'), 'salirme')
    .replace(new RegExp(`${WB_START}se\\s+le\\s+regresa${WB_END}`, 'gi'), 'se me regresa')
    .replace(new RegExp(`${WB_START}se\\s+le\\s+han${WB_END}`, 'gi'), 'se me han')
    .replace(new RegExp(`${WB_START}se\\s+le\\s+ha${WB_END}`, 'gi'), 'se me ha')
    .replace(new RegExp(`${WB_START}se\\s+le\\s+duermen${WB_END}`, 'gi'), 'se me duermen')
    .replace(new RegExp(`${WB_START}se\\s+le${WB_END}`, 'gi'), 'se me')
    .replace(new RegExp(`${WB_START}le\\s+iniciaron${WB_END}`, 'gi'), 'me iniciaron')
    .replace(new RegExp(`${WB_START}le\\s+recetaron${WB_END}`, 'gi'), 'me recetaron')
    .replace(new RegExp(`${WB_START}le\\s+colocaron${WB_END}`, 'gi'), 'me pusieron')
    .replace(new RegExp(`${WB_START}le\\s+diagnosticaron${WB_END}`, 'gi'), 'me diagnosticaron')
    .replace(new RegExp(`${WB_START}le\\s+produjo${WB_END}`, 'gi'), 'me produjo')
    .replace(new RegExp(`${WB_START}le\\s+duele${WB_END}`, 'gi'), 'me duele')
    .replace(new RegExp(`${WB_START}le\\s+baj[oó]${WB_END}`, 'gi'), 'me bajó')
    .replace(new RegExp(`${WB_START}lo\\s+toma${WB_END}`, 'gi'), 'lo tomo')
    .replace(new RegExp(`${WB_START}se\\s+aplic[oó]${WB_END}`, 'gi'), 'me puse')
    .replace(new RegExp(`${WB_START}no\\s+deb[ií]a\\s+aplicarse${WB_END}`, 'gi'), 'no debía ponerme')
    .replace(new RegExp(`${WB_START}creyendo\\s+err[oó]neamente\\s+que${WB_END}`, 'gi'), 'pensando equivocadamente que')
    // Verbos clínicos de 3ra persona e infinitivos reflexivos -> 1ra persona
    .replace(/\bRefieren\s+que\b|\bRefiere\s+que\b/g, 'Le cuento que')
    .replace(/\brefieren\s+que\b|\brefiere\s+que\b/g, 'le cuento que')
    .replace(/\brefiere\s+no\s+haber\b/gi, 'no había')
    .replace(/(?<!\bse\s+)\bRefiere\b/g, 'Tengo')
    .replace(/(?<!\bse\s+)\brefiere\b/g, 'tengo')
    .replace(/\bRelata\b/g, 'Recuerdo')
    .replace(/\brelata\b/g, 'recuerdo')
    .replace(/\bacude\s+nuevamente\s+refiriendo\b/gi, 'regresé porque tengo')
    .replace(/\bacude\s+a\s+consulta\s+externa\s+(porque|por)\b/gi, 'vengo $1')
    .replace(/\bacude\s+(?:a\s+urgencias\s+)?(porque|por)\b/gi, 'vengo $1')
    .replace(/\bacude\b/gi, 'vengo')
    .replace(/\bque\s+consulta\s+(porque|por)\b|\bconsulta\s+(porque|por)\b/gi, 'vengo $1')
    .replace(/\bintentar\s+cuidarse\b/gi, 'intentar cuidarme')
    .replace(/\bal\s+agacharse\b|\bagacharse\b/gi, (m) => (m.toLowerCase().startsWith('al') ? 'al agacharme' : 'agacharme'))
    .replace(/\bal\s+inclinarse\b|\binclinarse\b/gi, (m) => (m.toLowerCase().startsWith('al') ? 'al inclinarme' : 'inclinarme'))
    .replace(/\bal\s+levantarse\b|\blevantarse\b/gi, (m) => (m.toLowerCase().startsWith('al') ? 'al levantarme' : 'levantarme'))
    .replace(/\blavarse\b/gi, 'lavarme')
    .replace(/\bcepillarse\b/gi, 'cepillarme')
    .replace(/\bacostarse\b/gi, 'acostarme')
    .replace(/\bsentarse\b/gi, 'sentarme')
    .replace(/\bmoverse\b/gi, 'moverme')
    .replace(/\bsin\s+apoyarse\b|\bapoyarse\b/gi, (m) => (m.toLowerCase().startsWith('sin') ? 'sin apoyarme' : 'apoyarme'))
    .replace(/\bsin\s+haberse\b/gi, 'sin haberme')
    .replace(/\bno\s+puede\b/gi, 'no puedo')
    .replace(/\bno\s+pudo\b/gi, 'no pude')
    .replace(/\bdej[oó]\s+caer\b/gi, 'dejé caer')
    .replace(/\bsu\s+trabajo\b/gi, 'mi trabajo')
    .replace(/\bsu\s+turno\b/gi, 'mi turno')
    .replace(/\bpor\s+su\s+cuenta\b/gi, 'por mi cuenta')
    .replace(new RegExp(`${WB_START}se\\s+siente\\s+(?:muy\\s+)?fatigad([oa])${WB_END}`, 'gi'), 'me siento muy cansad$1')
    .replace(new RegExp(`${WB_START}se\\s+siente${WB_END}`, 'gi'), 'me siento')
    .replace(new RegExp(`${WB_START}que\\s+consume${WB_END}`, 'gi'), 'y tomo')
    .replace(new RegExp(`${WB_START}consume${WB_END}`, 'gi'), 'tomo')
    .replace(new RegExp(`${WB_START}levanta${WB_END}`, 'gi'), 'levanto')
    .replace(new RegExp(`${WB_START}puja${WB_END}`, 'gi'), 'pujo')
    .replace(new RegExp(`${WB_START}que\\s+suspend[ií]${WB_END}`, 'gi'), 'y suspendí')
    .replace(new RegExp(`${WB_START}presenta${WB_END}`, 'gi'), 'tengo')
    .replace(new RegExp(`${WB_START}presentó${WB_END}`, 'gi'), 'tuve')
    .replace(new RegExp(`(?<!\\bse\\s+)${WB_START}siente${WB_END}`, 'gi'), 'siento')
    .replace(new RegExp(`(?<!\\b(?:pap[aá]|mam[aá]|madre|padre|hermano|hermana|espos[oa]|pareja|hijo|hija|abuel[oa]|t[ií][oa]|alguien|nadie|que|quien)\\s+)${WB_START}tiene${WB_END}`, 'gi'), 'tengo')
    .replace(new RegExp(`(?<!\\b(?:pap[aá]|mam[aá]|madre|padre|hermano|hermana|espos[oa]|pareja|hijo|hija|abuel[oa])\\s+)${WB_START}toma${WB_END}`, 'gi'), 'tomo')
    .replace(new RegExp(`${WB_START}sigue\\s+una\\s+dieta${WB_END}`, 'gi'), 'sigo una dieta')
    .replace(new RegExp(`${WB_START}trabaja\\s+de\\s+noche${WB_END}`, 'gi'), 'trabajo de noche')
    .replace(new RegExp(`${WB_START}sale\\s+al\\s+sol${WB_END}`, 'gi'), 'salgo al sol')
    .replace(new RegExp(`${WB_START}le\\s+falta${WB_END}`, 'gi'), 'me falta')
    .replace(new RegExp(`${WB_START}se\\s+encuentra${WB_END}`, 'gi'), 'me encuentro')
    .replace(new RegExp(`${WB_START}se\\s+cansa${WB_END}`, 'gi'), 'me canso')
    .replace(new RegExp(`${WB_START}tose${WB_END}`, 'gi'), 'toso')
    .replace(new RegExp(`${WB_START}ha\\s+notado${WB_END}`, 'gi'), 'he notado')
    .replace(new RegExp(`${WB_START}ha\\s+bajado${WB_END}`, 'gi'), 'he bajado')
    .replace(new RegExp(`${WB_START}nota${WB_END}`, 'gi'), 'noto')
    .replace(new RegExp(`(?<!\\b(?:me|se|le|nos)\\s+)${WB_START}despert[oó]${WB_END}`, 'gi'), 'desperté')
    .replace(new RegExp(`${WB_START}ha\\s+presentado${WB_END}`, 'gi'), 'he tenido')
    .replace(new RegExp(`${WB_START}hab[ií]a\\s+permanecido${WB_END}`, 'gi'), 'estuve')
    .replace(new RegExp(`(?<!\\b(?:pap[aá]|mam[aá]|madre|padre|hermano|hermana|espos[oa]|pareja|hijo|hija|abuel[oa]|compa[ñn]er[oa]|m[eé]dico)\\s+)${WB_START}notó${WB_END}`, 'gi'), 'noté')
    .replace(new RegExp(`${WB_START}sinti[oó]${WB_END}`, 'gi'), 'sentí')
    .replace(new RegExp(`${WB_START}giró${WB_END}`, 'gi'), 'giré')
    .replace(new RegExp(`${WB_START}se\\s+qued[oó]${WB_END}`, 'gi'), 'me quedé')
    .replace(new RegExp(`(?<!\\b(?:pap[aá]|mam[aá]|madre|padre|hermano|hermana|espos[oa]|pareja|hijo|hija|beb[eé]|ni[ñn]o|abuel[oa]|que|quien|se|me)\\s+)${WB_START}tuvo${WB_END}`, 'gi'), 'tuve')
    .replace(new RegExp(`${WB_START}tomó${WB_END}`, 'gi'), 'tomé')
    .replace(new RegExp(`${WB_START}fum[oó]${WB_END}`, 'gi'), 'fumé')
    .replace(new RegExp(`${WB_START}lo\\s+redujo${WB_END}`, 'gi'), 'lo bajé')
    .replace(new RegExp(`${WB_START}abandon[oó]${WB_END}`, 'gi'), 'dejé')
    .replace(new RegExp(`${WB_START}cenó${WB_END}`, 'gi'), 'cené')
    .replace(new RegExp(`${WB_START}desayunó${WB_END}`, 'gi'), 'desayuné')
    .replace(new RegExp(`${WB_START}almorzó${WB_END}`, 'gi'), 'almorcé')
    .replace(new RegExp(`${WB_START}comió${WB_END}`, 'gi'), 'comí')
    .replace(new RegExp(`${WB_START}bebió${WB_END}`, 'gi'), 'bebí')
    .replace(new RegExp(`${WB_START}durmió${WB_END}`, 'gi'), 'dormí')
    .replace(new RegExp(`${WB_START}consultó${WB_END}`, 'gi'), 'consulté')
    .replace(new RegExp(`${WB_START}probó${WB_END}`, 'gi'), 'probé')
    .replace(new RegExp(`${WB_START}regresó${WB_END}`, 'gi'), 'regresé')
    .replace(new RegExp(`${WB_START}sufrió${WB_END}`, 'gi'), 'sufrí')
    .replace(new RegExp(`${WB_START}consumió${WB_END}`, 'gi'), 'consumí')
    .replace(new RegExp(`${WB_START}suspendió${WB_END}`, 'gi'), 'suspendí')
    .replace(new RegExp(`${WB_START}disminuyó${WB_END}`, 'gi'), 'bajé')
    .replace(new RegExp(`(?<!\\b(?:pap[aá]|mam[aá]|madre|padre|hermano|hermana|espos[oa]|pareja|hijo|hija|beb[eé]|ni[ñn]o|compa[ñn]er[oa]|alguien)\\s+)${WB_START}estuvo${WB_END}`, 'gi'), 'estuve')
    .replace(new RegExp(`${WB_START}reside${WB_END}`, 'gi'), 'vivo')
    .replace(new RegExp(`${WB_START}desconocía${WB_END}`, 'gi'), 'no conocía')
    .replace(new RegExp(`${WB_START}no\\s+suele${WB_END}`, 'gi'), 'no suelo')
    .replace(new RegExp(`${WB_START}no\\s+usa${WB_END}`, 'gi'), 'no uso')
    .replace(new RegExp(`${WB_START}niega${WB_END}`, 'gi'), 'no tengo')
    .replace(new RegExp(`(?<!\\b(?:me|se|le|nos|les|dolor|fiebre|cuadro|malestar|todo|esto|eso|que|cuando|de|al|su|un|sangrado|mareo|sintoma|síntoma|problema|ardor|picor|comezon|comezón|hinchazon|hinchazón|hormigueo|debilidad|tos|vomito|vómito|diarrea|pecho|abdomen|cabeza|pierna|brazo|espalda|ojo|piel)\\s+)${WB_START}inició${WB_END}`, 'gi'), 'empecé')
    .replace(new RegExp(`(?<!\\b(?:me|se|le|nos|les|dolor|fiebre|cuadro|malestar|todo|esto|eso|que|cuando|de|al|su|un|sangrado|mareo|sintoma|síntoma|problema|ardor|picor|comezon|comezón|hinchazon|hinchazón|hormigueo|debilidad|tos|vomito|vómito|diarrea|pecho|abdomen|cabeza|pierna|brazo|espalda|ojo|piel)\\s+)${WB_START}comenzó${WB_END}`, 'gi'), 'empecé')
    .replace(new RegExp(`(?<!\\b(?:me|se|le|nos|les|dolor|fiebre|cuadro|malestar|todo|esto|eso|que|cuando|de|al|su|un|sangrado|mareo|sintoma|síntoma|problema|ardor|picor|comezon|comezón|hinchazon|hinchazón|hormigueo|debilidad|tos|vomito|vómito|diarrea|pecho|abdomen|cabeza|pierna|brazo|espalda|ojo|piel)\\s+)${WB_START}empezó${WB_END}`, 'gi'), 'empecé')
    .replace(/\bempecé\s+dolor\b/gi, 'empecé con dolor')
    .replace(new RegExp(`${WB_START}se\\s+tornó${WB_END}`, 'gi'), 'se volvió');

  // Traducir jerga médica a habla cotidiana de paciente
  out = humanizeMedicalJargon(out, false)
    .replace(/\bcon\s+(no\s+aguanto\s+ni\s+el\s+agua\s+en\s+el\s+est[oó]mago)\b/gi, 'y $1')
    .replace(/\bcon\s+dej[eé]\s+de\s+tratamiento\b/gi, 'pero dejé mi tratamiento')
    .replace(/\bprimigesta\s+con\s+embarazo\s+actual\s+de\b/gi, 'es mi primer embarazo y tengo')
    .replace(/^Dolor\b/i, 'Siento un dolor')
    // Limpieza sintáctica tras sustituciones
    .replace(/^(?:que|y)\s+/i, '')
    .replace(/^Con\s+/i, 'Tengo ')
    .replace(/^En\s+tratamiento\b/i, 'Estoy en tratamiento')
    .replace(/\by\s+(Ayer|Hoy|Anoche)\b/g, (_, w) => `y ${w.toLowerCase()}`)
    .replace(/,\s*,/g, ',')
    .replace(/\.{2,}/g, '.')
    .replace(/\s+([.,])/g, '$1')
    .replace(/\s+/g, ' ')
    .replace(/([.!?]\s+)([a-záéíóúüñ])/g, (_, p1, p2) => `${p1}${p2.toUpperCase()}`)
    .trim();

  return capitalizeFirst(out);
}

function humanizeReason(reason?: string, isPediatric = false): string {
  if (!reason) return isPediatric ? 'estas molestias' : 'este malestar';
  const cleaned = humanizeMedicalJargon(reason, isPediatric).trim();
  if (!cleaned) return isPediatric ? 'estas molestias' : 'este malestar';
  return cleaned.charAt(0).toLowerCase() + cleaned.slice(1);
}

function formatConversationalList(items: string[], patientInfo?: PatientChatPayload['patientInfo']): string {
  const cleaned = items
    .map((item) => toFirstPersonClinicalSpeech(item, patientInfo).replace(/\.+$/, '').trim())
    .filter(Boolean)
    .map((item, idx) => (idx === 0 ? item : item.charAt(0).toLowerCase() + item.slice(1)));
  if (cleaned.length === 0) return '';
  if (cleaned.length === 1) return cleaned[0];
  if (cleaned.length === 2) return `${cleaned[0]} y ${cleaned[1]}`;
  return `${cleaned.slice(0, -1).join(', ')} y ${cleaned[cleaned.length - 1]}`;
}

/**
 * Red de seguridad final para garantizar que NINGUNA respuesta salga en 3ra persona clínica.
 */
export function ensureFirstPersonReply(
  reply: string,
  patientInfo?: PatientChatPayload['patientInfo']
): string {
  if (!reply) return reply;
  const trimmed = reply.replace(/\.{2,}/g, '.').trim();
  const hasExplicitClinicalThirdPerson =
    /^(?:Paciente|Lactante)\s+/i.test(trimmed) ||
    new RegExp(`${WB_START}(?:el|la)\\s+paciente${WB_END}`, 'i').test(trimmed) ||
    new RegExp(
      `(?<!\\bse\\s+)${WB_START}(?:refiere|acude|presenta|present[oó]|abandon[oó]|fum[oó]|redujo|consume|levanta|puja|mira\\s+hacia|se\\s+recuesta|vuelve\\s+a\\s+sentir|mantiene\\s+la\\s+cabeza|se\\s+siente|le\\s+sali[oó]|se\\s+acompa[ñn]a\\s+de|le\\s+(?:colocaron|iniciaron|recetaron|diagnosticaron|dificulta|impide|duele|falta|prest[oó]|tomaron)|(?:la|lo)\\s+despierta|(?:la|lo)\\s+despert[oó]|(?:la|lo|le)\\s+obligan?|que\\s+(?:lo|la)\\s+hace|(?:la|lo|le)\\s+hace\\s+desmayarse|se\\s+le\\s+(?:han|ha|regresa)|agacharse|inclinarse|cuidarse)${WB_END}`,
      'i'
    ).test(trimmed);
  if (hasExplicitClinicalThirdPerson) {
    return toFirstPersonClinicalSpeech(trimmed, patientInfo);
  }
  const alreadyFirstPerson = new RegExp(
    `${WB_START}(?:me|mi|mis|yo|tengo|siento|vengo|tuve|empec[eé]|comenc[eé]|estoy|he\\s+tenido|llevo|tomo|puse|not[eé]|sufr[ií])${WB_END}`,
    'i'
  ).test(trimmed);
  if (alreadyFirstPerson) return trimmed;
  const hasFallbackThirdPerson = new RegExp(
    `(?<!\\bse\\s+)${WB_START}(?:siente|regres[oó]|consumi[oó]|suspendi[oó]|prob[oó]|not[oó]|estuvo|tuvo|tom[oó]|sufri[oó]|tose|ha\\s+notado|ha\\s+bajado|se\\s+encuentra|se\\s+cansa)${WB_END}`,
    'i'
  ).test(trimmed);
  if (!hasFallbackThirdPerson) return trimmed;
  return toFirstPersonClinicalSpeech(trimmed, patientInfo);
}

const FORBIDDEN_DIAGNOSIS_TERMS = [
  'apendicitis', 'pancreatitis', 'colecistitis', 'colangitis', 'infarto', 'iamcest',
  'meningitis', 'neumonia', 'dengue', 'cetoacidosis', 'pielonefritis', 'urosepsis',
  'tromboembolia', 'anafilaxia', 'stevens-johnson', 'serotoninergico', 'preeclampsia',
  'hellp', 'eclampsia', 'guillain-barre', 'taponamiento', 'pericarditis', 'endocarditis',
  'neumotorax', 'addison', 'crisis suprarrenal', 'absceso hepatico', 'invaginacion',
  'intususcepcion', 'delirium tremens', 'bronquiolitis', 'crup', 'laringotraqueobronquitis',
  'ictus', 'evc', 'isquemico', 'tormenta tiroidea', 'fibrilacion auricular',
  'sindrome compartimental', 'embarazo ectopico', 'obstruccion intestinal', 'colico nefritico',
  'litiasis ureteral', 'fractura intracapsular', 'erisipela', 'kussmaul', 'mcburney',
  'blumberg', 'murphy', 'kernig', 'brudzinski', 'reynolds', 'charcot', 'beck', 'duke',
  'curb-65', 'kdigo', 'garden iv', 'triple whammy',
  'faringoamigdalitis', 'estreptococica', 'cistitis', 'reflujo gastroesofagico', 'erge',
  'asma bronquial', 'hipotiroidismo', 'hashimoto', 'hipertension arterial', 'migrana',
  'herpes zoster', 'esguince', 'otitis media', 'candidiasis', 'anemia ferropenica',
  'ansiedad generalizada', 'hernia inguinal', 'vertigo posicional', 'vppb',
  'intestino irritable', 'ovario poliquistico', 'paralisis de bell', 'tinea corporis',
  'lumbalgia mecanica', 'gastroenteritis', 'centor', 'mcisaac', 'ottawa',
  'dix-hallpike', 'epley', 'lasegue', 'roma iv', 'rotterdam', 'cha2ds2',
  'tunel del carpo', 'tunel carpiano', 'anemia megaloblastica', 'anemia perniciosa',
  'deficiencia de vitamina b12', 'radiculopatia', 'hernia discal', 'ciatica',
  'osteomalacia', 'miopatia proximal', 'deficiencia de vitamina d', 'phalen', 'tinel', 'spurling',
  'colitis ulcerosa', 'cuci', 'truelove', 'bronquiectasias', 'anillo de sello',
  'epilepsia', 'lobulo temporal', 'esclerosis mesial', 'epoc', 'enfisema', 'gold 2',
];

function sanitizeForPatientSpeech(
  text: string,
  patientInfo?: PatientChatPayload['patientInfo']
): string {
  if (!text) return '';
  let cleaned = text;
  for (const term of FORBIDDEN_DIAGNOSIS_TERMS) {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    cleaned = cleaned.replace(new RegExp(escaped, 'gi'), '');
  }
  cleaned = cleaned
    .replace(/\b(EGO|ECG|TAC|RMN|PCR|VSG|LCR|CPRE|CVF|NIF|IGIV|FEVI|PA|FC|FR)\b/g, '')
    .replace(/\([^)]*(?:diagn[oó]stic|criterio|escala|estadio|grado|signo|tr[ií]ada|p[eé]ntada)[^)]*\)/gi, '')
    .replace(/\bepig[aá]stric[oa]?\b/gi, 'en la boca del estómago')
    .replace(/\b[ií]leo\b/gi, 'el intestino detenido')
    .replace(/\bcoluria\b/gi, 'orina oscura como té')
    .replace(/\bictericia\b/gi, 'color amarillo en ojos y piel')
    .replace(/\bhematuria\b/gi, 'sangre en la orina')
    .replace(/\bdisuria refleja\b|\bdisuria\b/gi, 'ardor al orinar')
    .replace(/\boliguria\b/gi, 'orinar muy poquito')
    .replace(/\bletargia\b/gi, 'mucho sueño y decaimiento')
    .replace(/\bparestesias?\b/gi, 'hormigueo')
    .replace(/\barreflexia\b/gi, 'falta de reflejos')
    .replace(/\(\s*\)/g, '')
    .replace(/\s*:\s*$/g, '')
    .replace(/\s+de\s*:\s*/gi, ': ')
    .replace(/\s{2,}/g, ' ')
    .trim();
  return toFirstPersonClinicalSpeech(cleaned, patientInfo);
}

function getContentTokens(text: string): Set<string> {
  const stop = new Set([
    'para', 'como', 'cuando', 'donde', 'desde', 'hace', 'todo', 'toda', 'todos', 'todas',
    'pero', 'porque', 'doctor', 'tengo', 'siento', 'mucho', 'mucha', 'muy', 'algo',
    'esto', 'esta', 'este', 'unas', 'unos', 'sobre', 'entre', 'ademas', 'tambien',
    'ayer', 'hoy', 'ahora', 'despues', 'antes', 'hasta', 'solo', 'casi',
  ]);
  const tokens = normalizeText(text)
    .split(' ')
    .filter((w) => w.length >= 4 && !stop.has(w));
  return new Set(tokens);
}

export function isSimilarToPrevious(candidate: string, previousPatientTexts: string[]): boolean {
  const normCand = normalizeText(candidate);
  if (!normCand || previousPatientTexts.length === 0) return false;
  const candTokens = getContentTokens(candidate);

  for (const prev of previousPatientTexts) {
    if (!prev) continue;
    if (normCand === prev) return true;
    if (normCand.length > 28 && prev.includes(normCand)) return true;
    if (prev.length > 28 && normCand.includes(prev)) return true;

    const prevTokens = getContentTokens(prev);
    if (candTokens.size === 0 || prevTokens.size === 0) continue;
    let overlap = 0;
    for (const tok of candTokens) {
      if (prevTokens.has(tok)) overlap++;
    }
    const minSize = Math.min(candTokens.size, prevTokens.size);
    const maxSize = Math.max(candTokens.size, prevTokens.size);
    if (overlap / minSize >= 0.8 || overlap / maxSize >= 0.72) {
      return true;
    }
  }
  return false;
}

function sentenceMatchesKeyword(normS: string, kw: string): boolean {
  if (!kw) return false;
  if (kw.includes(' ') || kw.startsWith('/')) {
    return normS.includes(kw);
  }
  const exactShortWords = new Set(['tos', 'sed', 'sal', 'luz', 'te', 'kg', 'cm', 'mm', 'mg', 'ojos', 'aire', 'frio', 'fria']);
  if (exactShortWords.has(kw)) {
    const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`(?:^|\\s)${escaped}(?:es|s)?(?:\\s|$)`, 'i').test(normS);
  }
  return hasWordPrefix(normS, [kw]);
}

/**
 * Busca oraciones dentro de currentIllness o background que contengan palabras clave relevantes,
 * evitando repetir oraciones ya dichas previamente en la conversación.
 */
function extractMatchingSentences(
  text: string | undefined,
  keywords: string[],
  patientInfo?: PatientChatPayload['patientInfo'],
  previousPatientTexts: string[] = [],
  options?: { excludeNegated?: boolean }
): string | null {
  if (!text) return null;
  const sentences = text
    .split(/(?<=[.!?])\s+|(?<=;)\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 8);

  const scored: Array<{ text: string; score: number }> = [];
  for (const s of sentences) {
    const normS = normalizeText(s);
    if (options?.excludeNegated && /^(?:niega|sin\b|no\s+(?:ha|he|presenta|refiere|tiene|tuvo))/.test(normS)) {
      continue;
    }
    const matchCount = keywords.reduce((acc, kw) => acc + (sentenceMatchesKeyword(normS, kw) ? 1 : 0), 0);
    if (matchCount > 0) {
      const adapted = toFirstPersonClinicalSpeech(s, patientInfo);
      if (adapted && !scored.some((item) => item.text === adapted)) {
        scored.push({ text: adapted, score: matchCount });
      }
    }
  }

  if (scored.length === 0) return null;
  scored.sort((a, b) => b.score - a.score);
  const unseen = scored.filter((c) => !isSimilarToPrevious(c.text, previousPatientTexts));
  if (unseen.length > 0) return unseen[0].text;
  return null;
}

function buildSafeClinicalClues(payload: PatientChatPayload): string[] {
  const rawList = [
    ...(payload.clinicalClues || []),
    ...(payload.characteristicSymptoms || []),
  ];
  const clinicalPearlPattern =
    /ecograf|tomograf|radiograf|electrocardiog|troponina|amilasa|lipasa|leucocit|creatinina|cortisol|hemocultiv|puncion|urotomograf|roce|soplo|cristaluria|nitrito|pu[ñn]opercusi|signo de|tr[ií]ada|p[eé]ntada|disociaci|hiponatremia|hiperkalemia|hipoglucemia|fosfatasa|bilirrubina|lactato|capacidad vital|arreflexia|intestino detenido|st c[oó]ncav|voltaje|alternancia|supradesnivel|infradesnivel|segmento st|onda [qpt]|v[1-6][-–]v[1-6]|imagen rec[ií]proca|bloqueo de rama|auscultaci[oó]n|hipoxemia|spo2|saturaci[oó]n|amenorrea|fosa il[ií]aca|cuadrante|mesogastrio|factores de riesgo|tromboemb[oó]lic|cronolog[ií]a cl[aá]sica|transici[oó]n de la fase|fase febril|fase cr[ií]tica|defervescencia|inicio r[aá]pido|inicio t[ií]pico|inicio s[uú]bito|antiepil[eé]ptic|serotonin[eé]rgic|opioid|desproporcionado|no esperar|signo m[aá]s|caracter[ií]stic|aliento cet[oó]nic|edematos|mujer en edad f[eé]rtil|afectaci[oó]n cut[aá]nea|hemodin[aá]mic/i;

  return rawList
    .filter((raw) => {
      if (!raw || /[+→<>]/.test(raw)) return false;
      const normRaw = normalizeText(raw);
      if (clinicalPearlPattern.test(normRaw)) return false;
      if (/^[a-z\s]+:/i.test(raw)) return false;
      return true;
    })
    .map((item) => sanitizeForPatientSpeech(item, payload.patientInfo))
    .filter(
      (item) =>
        item.split(/\s+/).length >= 5 &&
        !/:/.test(item) &&
        !clinicalPearlPattern.test(normalizeText(item))
    );
}

// Motor determinista 100 % local (sin llamadas a LLM ni prompts externos).

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
  const { history = [], patientInfo, vitalSigns, liveVitalSigns, background, isDeceased } = payload;
  const currentVitals = liveVitalSigns || vitalSigns;
  const isPediatric = patientInfo?.age !== undefined && patientInfo.age < 12;

  if (
    isDeceased ||
    currentVitals?.heartRate === 0 ||
    (currentVitals?.bloodPressure || '').startsWith('0/')
  ) {
    return '[Sin respuesta: el paciente se encuentra fallecido en asistolia y no presenta actividad vital.]';
  }

  const currentGlasgow = currentVitals?.glasgow ?? 15;
  if (currentGlasgow <= 9) {
    return isPediatric
      ? `[Sin respuesta del paciente: el niño se encuentra inconsciente (Glasgow ${currentGlasgow}/15) tras desestabilización aguda y no responde; la madre aguarda angustiada reanimación inmediata.]`
      : `[Sin respuesta verbal: el paciente está inconsciente (Glasgow ${currentGlasgow}/15) tras desestabilización aguda y no puede responder a las preguntas.]`;
  }

  const previousPatientTexts = history
    .filter((m) => m.sender === 'patient')
    .map((m) => normalizeText(m.text));

  let reply = ensureFirstPersonReply(generateContextualPatientReplyInternal(payload), patientInfo);

  // Red de seguridad anti-repetición: si la respuesta es prácticamente idéntica a una ya dada en el chat,
  // busca información clínica aún no mencionada que responda al mismo tema de la pregunta.
  if (previousPatientTexts.length > 0 && isSimilarToPrevious(reply, previousPatientTexts)) {
    const isPediatric = patientInfo?.age !== undefined && patientInfo.age < 12;
    const normQ = normalizeText(payload.userMessage);
    const queryStop = new Set([
      'tiene', 'tuvo', 'siente', 'hace', 'como', 'cuando', 'donde', 'cual', 'cuanto',
      'cuantas', 'cuantos', 'porque', 'para', 'sobre', 'algo', 'otra', 'cosa', 'quiere',
      'agregar', 'doctor', 'paciente', 'dolor', 'sintoma', 'sintomas', 'estos', 'estas',
    ]);
    const queryTokens = normQ
      .split(' ')
      .filter((w) => w.length >= 4 && !queryStop.has(w));
    const cluePool = [
      ...(patientInfo?.currentIllness
        ? patientInfo.currentIllness
            .split(/(?<=[.!?])\s+/)
            .map((s) => toFirstPersonClinicalSpeech(s.trim(), patientInfo))
        : []),
      ...buildSafeClinicalClues(payload),
      ...(background?.pathological || []).map((p) => toFirstPersonClinicalSpeech(p, patientInfo)),
      ...(background?.nonPathological || []).map((p) => toFirstPersonClinicalSpeech(p, patientInfo)),
    ].filter((s) => s.length > 10 && !isSimilarToPrevious(s, previousPatientTexts));

    const matchingFreshClue =
      queryTokens.length > 0
        ? cluePool.find((c) =>
            queryTokens.some((t) => normalizeText(c).includes(t.slice(0, Math.max(4, t.length - 1))))
          )
        : undefined;

    if (matchingFreshClue) {
      reply = ensureFirstPersonReply(matchingFreshClue, patientInfo);
    } else if (
      hasWordPrefix(normQ, ['algo mas', 'otra cosa', 'quiere agregar', 'otro sintoma', 'que mas']) &&
      cluePool.length > 0
    ) {
      reply = ensureFirstPersonReply(
        `Además de lo que ya le comenté, doctor, ${cluePool[0].charAt(0).toLowerCase()}${cluePool[0].slice(1)}`,
        patientInfo
      );
    } else if (
      vitalSigns?.temperature &&
      vitalSigns.temperature >= 37.8 &&
      !previousPatientTexts.some((p) => p.includes('calentura') || p.includes('fiebre') || p.includes('temperatura'))
    ) {
      reply = `También siento el cuerpo muy caliente y destemplado, doctor (me tomaron ${vitalSigns.temperature.toFixed(1)}°C).`;
    } else if (
      vitalSigns?.oxygenSaturation &&
      vitalSigns.oxygenSaturation <= 93 &&
      !previousPatientTexts.some((p) => p.includes('aire') || p.includes('respir'))
    ) {
      reply = isPediatric
        ? 'También noto que mi niño respira muy rápido y agitado, como que le cuesta jalar aire.'
        : 'También siento que me falta el aire y respiro muy agitado, doctor.';
    } else {
      reply = isPediatric
        ? 'Fuera de lo que ya le comenté hace un momento, doctor, no he notado otro cambio distinto en mi niño respecto a eso.'
        : 'Fuera de lo que ya le comenté hace un momento, doctor, no he notado ningún otro detalle distinto sobre eso.';
    }
  }

  return reply;
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
  const previousPatientTexts = history
    .filter((m) => m.sender === 'patient')
    .map((m) => normalizeText(m.text));
  const safeCluesText = buildSafeClinicalClues(payload).join('. ');
  const combinedClinicalText = [patientInfo?.currentIllness, safeCluesText].filter(Boolean).join('. ');

  // Identificar el último intercambio médico-paciente para mantener contexto conversacional
  const lastPatientMsg = [...history]
    .reverse()
    .find((m) => m.sender === 'patient')?.text;
  const prevDoctorMsgs = history.filter((m) => m.sender === 'doctor');
  const lastDoctorMsg = prevDoctorMsgs.length >= 2 ? prevDoctorMsgs[prevDoctorMsgs.length - 2]?.text || '' : '';

  // 0. Detección de pregunta de confirmación / repetición PURA (sin interrogativo nuevo)
  const isPureConfirmationRequest = hasWordPrefix(norm, [
    'confirm', 'segur', 'repet', 'repit', 'otra vez', 'de nuevo',
    'como dijo', 'me decia', 'entendi bien', 'rectific',
  ]);
  const hasNewQuestionWord = hasWordPrefix(norm, [
    'que ', 'cual', 'como', 'cuant', 'donde', 'cuando', 'color', 'aspecto',
    'por que', 'fiebre', 'dolor', 'orina', 'vomit', 'alergi', 'medicin', 'farmac',
  ]);

  const cleanedNorm = norm
    .replace(/\b(me confirma|confirma|confirmeme|esta seguro|seguro que|me repite|repite|otra vez|de nuevo|como me dijo|por favor|doctor)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (isPureConfirmationRequest && !hasNewQuestionWord && cleanedNorm.split(' ').filter(Boolean).length <= 3 && lastPatientMsg) {
    return `Sí doctor, le confirmo eso que le mencioné.`;
  }

  const isConfirmationOrRepeat = isPureConfirmationRequest && !hasNewQuestionWord;

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
    const naturalReason = humanizeReason(patientInfo?.consultReason, isPediatric);
    return isPediatric
      ? `Hola doctor, mucho gusto. Traje a mi niño porque tiene ${naturalReason} y estoy muy preocupada.`
      : `Hola doctor, mucho gusto. Vengo muy preocupad${isFemale ? 'a' : 'o'} por ${naturalReason}, gracias por atenderme tan rápido.`;
  }

  if (hasWordPrefix(norm, ['algo mas', 'otra cosa', 'quiere agregar', 'alguna otra molestia', 'otro sintoma'])) {
    if (patientInfo?.currentIllness) {
      const freshIllness = patientInfo.currentIllness
        .split(/(?<=[.!?])\s+/)
        .map((s) => s.trim())
        .filter(
          (s) =>
            s.length > 10 &&
            !/^\s*(?:niega|sin\b|no\s+(?:ha|he|presenta|refiere|tiene|tuvo))\b/i.test(s)
        )
        .map((s) => adapt(s))
        .find((s) => !isSimilarToPrevious(s, previousPatientTexts));
      if (freshIllness) {
        const cleanFresh = freshIllness.replace(/^(?:le cuento que|quiero contarle que|mire doctor,?\s*)/i, '');
        return `Sí doctor, también quería contarle que ${cleanFresh.charAt(0).toLowerCase()}${cleanFresh.slice(1)}`;
      }
    }
    if (background?.currentMedications && !listIndicatesNone(background.currentMedications)) {
      const medsNote = `También le cuento que ${isPediatric ? 'le estuve dando' : 'estuve tomando'}: ${formatConversationalList(background.currentMedications, patientInfo)}.`;
      if (!isSimilarToPrevious(medsNote, previousPatientTexts)) return medsNote;
    }
    if (background?.pathological && !listIndicatesNone(background.pathological)) {
      const pathNote = `De cosas que he tenido antes, ${isPediatric ? 'mi hijo' : 'yo'} padezco ${formatConversationalList(background.pathological, patientInfo)}.`;
      if (!isSimilarToPrevious(pathNote, previousPatientTexts)) return pathNote;
    }
    const freshClues = buildSafeClinicalClues(payload).filter(
      (c) => !isSimilarToPrevious(c, previousPatientTexts)
    );
    if (freshClues.length > 0) {
      return `Sí doctor, también noté que ${freshClues[0].charAt(0).toLowerCase()}${freshClues[0].slice(1)}`;
    }
  }

  const appliedStat = payload.appliedStatInterventions || [];
  const activeVitals = payload.liveVitalSigns || vitalSigns;

  // 2b. Preguntas de revaloración clínica después de haber aplicado tratamiento STAT
  if (appliedStat.length > 0) {
    const lastStat = appliedStat[appliedStat.length - 1];
    const asksPostStatReeval =
      hasWordPrefix(norm, [
        'despues de', 'tras la', 'tras el', 'con el medicamento', 'con la dosis',
        'con el suero', 'con el oxigeno', 'con la mascarilla', 'con la nebuliz',
        'con la inyeccion', 'con la pastilla', 'le aplic', 'le pus', 'le dimos',
        'mejor', 'alivio', 'alivi', 'efecto', 'como se siente ahora', 'como sigue ahora',
        'respira mas facil', 'le cuesta menos', 'disminuy', 'bajo el dolor',
        'molestia nueva', 'picazon', 'roncha', 'temblor', 'reaccion', 'hizo efecto',
      ]) ||
      (norm.split(' ').length <= 9 &&
        hasWordPrefix(norm, ['como esta', 'como sigue', 'como se siente', 'como va']));

    if (asksPostStatReeval) {
      const asksResp = hasWordPrefix(norm, ['respir', 'aire', 'pecho', 'ahog', 'silbid']);
      const asksAdverse = hasWordPrefix(norm, ['picaz', 'roncha', 'molestia nueva', 'temblor', 'calor', 'mareo', 'reaccion']);
      const asksPain = hasWordPrefix(norm, ['dolor', 'duele', 'bajo el dolor']);

      if (asksAdverse) {
        if (lastStat.effectSeverity === 'reaccion_adversa') {
          return lastStat.patientFeelingNote;
        }
        if (/salbutamol|nebuliz/i.test(lastStat.drug)) {
          return isPediatric
            ? 'No le he visto ronchas ni nada malo, doctor; solo está un poquito tembloroso y con el corazón rapidito por la nebulización.'
            : 'No tengo picazón ni ronchas, doctor; solo sentí un poco de temblor en las manos y el corazón algo acelerado, pero sí me ayudó a abrir el pecho.';
        }
        return isPediatric
          ? `No ha tenido alergia ni ronchas con ${lastStat.drug}, doctor. ${lastStat.patientFeelingNote}`
          : `No he sentido picazón ni nada raro en la piel tras ${lastStat.drug}, doctor. ${lastStat.patientFeelingNote}`;
      }

      if (asksResp && activeVitals?.oxygenSaturation !== undefined) {
        if (lastStat.effectSeverity === 'reaccion_adversa') {
          return lastStat.patientFeelingNote;
        }
        if (/oxigeno|salbutamol|furosemida|adrenalina|nebuliz/i.test(lastStat.drug) && lastStat.effectSeverity !== 'sin_cambio') {
          return `${lastStat.patientFeelingNote} (Ya marca ${activeVitals.oxygenSaturation}% de oxígeno y respiro más tranquilo).`;
        }
        return activeVitals.oxygenSaturation >= 94
          ? `Con ${lastStat.drug} no cambié mucho de la respiración porque lo que más me molesta es lo otro, aunque sí me siento vigilado.`
          : `Todavía me cuesta un poco respirar, doctor; siento que necesito que sigamos ayudándome con el aire.`;
      }

      if (asksPain && lastStat.effectSeverity !== 'reaccion_adversa') {
        if (/paracetamol|acetaminofen|nitroglicerina|ketorolaco|tramadol|morfina|butilhioscina|metamizol/i.test(lastStat.drug)) {
          return lastStat.patientFeelingNote;
        }
        return `${lastStat.patientFeelingNote} Aunque el dolor de fondo todavía requiere que me sigan revisando.`;
      }

      return lastStat.patientFeelingNote;
    }
  }

  const asksSpecificSystemOrSymptom = hasWordPrefix(norm, [
    'orina', 'orinar', 'urinari', 'miccion', 'dolor', 'duele', 'fiebre', 'calentura',
    'vomit', 'nausea', 'respir', 'aire', 'tos', 'evacua', 'diarrea', 'heces', 'cabeza',
    'mareo', 'piel', 'sangr', 'comi', 'hambre', 'sueno', 'dormi',
  ]);
  if (
    !asksSpecificSystemOrSymptom &&
    norm.split(' ').length <= 8 &&
    hasWordPrefix(norm, ['como esta', 'como sigue', 'como se encuentra', 'en que le puedo ayudar', 'duda'])
  ) {
    const naturalReason = humanizeReason(patientInfo?.consultReason, isPediatric);
    if (isPediatric) {
      return `Pues muy preocupada doctor; mi niño sigue con ${naturalReason} desde hace ${patientInfo?.evolutionTime || 'unas horas'}.`;
    }
    return `Pues me siento muy mal todavía, doctor; traigo ${naturalReason} desde hace ${patientInfo?.evolutionTime || 'unas horas'} y necesito que me ayude.`;
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

  // 6. Pregunta por identidad (nombre, edad) — si también pregunta por qué viene, responde ambos
  if (
    hasWord(norm, ['como se llama', 'cual es su nombre', 'su nombre', 'cuantos anos', 'que edad', 'edad tiene']) ||
    (hasWordPrefix(norm, ['edad', 'nombre']) && hasWordPrefix(norm, ['cual', 'cuant', 'que', 'como']))
  ) {
    const alsoAsksReason =
      norm.includes('por que viene') ||
      norm.includes('por que vino') ||
      norm.includes('que lo trae') ||
      norm.includes('que la trae') ||
      norm.includes('que siente') ||
      norm.includes('motivo de consulta');
    const naturalReason = humanizeReason(patientInfo?.consultReason, isPediatric);
    const reasonSuffix = alsoAsksReason && patientInfo?.consultReason
      ? isPediatric
        ? `; lo traje por ${naturalReason}`
        : `; vengo por ${naturalReason}`
      : '';
    if (isPediatric) {
      return wrapConfirm(`Mi niño se llama ${name.replace(/\s*\([^)]*\)/, '')} y tiene ${age !== undefined && age >= 1 ? `${age} años` : patientInfo?.occupation || '10 meses'}, doctor; yo soy su mamá${reasonSuffix}.`);
    }
    return wrapConfirm(`Me llamo ${name}${age ? ` y tengo ${age} años` : ''}${reasonSuffix}, doctor.`);
  }

  // 7. Ocupación / trabajo / estudios
  if (hasWordPrefix(norm, ['trabaj', 'ocupacion', 'oficio', 'profesion', 'dedica', 'estudia', 'carrera'])) {
    if (isPediatric) {
      const pedActivity =
        age !== undefined && age < 4
          ? 'va a guardería'
          : age !== undefined && age < 6
            ? 'va al preescolar'
            : 'va a la escuela';
      return wrapConfirm(
        `Es apenas un niño pequeño (${patientInfo?.occupation || 'en edad infantil'}) y ${pedActivity}, doctor.`
      );
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
      const envItem = adapt(nonPath[0]).replace(/\.$/, '');
      return wrapConfirm(`Pues fíjese que ${envItem.charAt(0).toLowerCase()}${envItem.slice(1)}, doctor.`);
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
      const cleanAlgItems = alg
        .map((a) =>
          adapt(a)
            .replace(/^(?:alergi[oa]s?(?:\s+(?:conocida|ambiental|alimentaria|medicamentosa))?\s+(?:a|al)\s+|al[eé]rgic[oa]\s+a\s+)/i, '')
            .replace(/\.+$/, '')
            .trim()
        )
        .filter(Boolean)
        .map((item, idx) => (idx === 0 ? item : item.charAt(0).toLowerCase() + item.slice(1)));
      const cleanAlg =
        cleanAlgItems.length <= 1
          ? cleanAlgItems[0] || ''
          : `${cleanAlgItems.slice(0, -1).join(', ')} y ${cleanAlgItems[cleanAlgItems.length - 1]}`;
      const lowerAlg = cleanAlg.charAt(0).toLowerCase() + cleanAlg.slice(1);
      return wrapConfirm(
        `Sí doctor, ${isPediatric ? `a mi ${isFemale ? 'niña' : 'niño'} le da alergia` : `soy ${isFemale ? 'alérgica' : 'alérgico'} a`} ${lowerAlg}.`
      );
    }
    return isPediatric
      ? `No doctor, hasta donde sé mi ${isFemale ? 'niña' : 'niño'} no es ${isFemale ? 'alérgica' : 'alérgico'} a ningún medicamento ni comida.`
      : `No doctor, que yo sepa no me hace daño ni soy ${isFemale ? 'alérgica' : 'alérgico'} a ninguna medicina ni comida.`;
  }

  // 10. Antecedentes quirúrgicos / operaciones
  if (hasWordPrefix(norm, ['cirugia', 'operad', 'operacion', 'quirofano', 'intervencion quirurgica'])) {
    if (caseId === 'case-dengue-alarm') {
      return wrapConfirm('Me operaron del apéndice hace unos 5 años, doctor, pero fuera de eso nunca me han operado de nada más.');
    }
    if (caseId === 'case-neumonia-adquirida') {
      return wrapConfirm('Tuve una cesárea hace 35 años cuando nació mi hijo, pero ninguna otra operación.');
    }
    const surg = background?.surgical;
    if (surg && !listIndicatesNone(surg)) {
      return wrapConfirm(`Sí doctor, me operaron de ${formatConversationalList(surg, patientInfo).toLowerCase()}.`);
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
      ? wrapConfirm('No doctor, nunca se había puesto así de mal; es la primera vez que le pasa.')
      : wrapConfirm('No doctor, nunca había tenido un problema así antes; es la primera vez que me pasa.');
  }

  // 12. Antecedentes patológicos / enfermedades crónicas (no interceptar preguntas sobre familia)
  const asksFamilyHistory = hasWordPrefix(norm, ['familia', 'mama', 'madre', 'papa', 'padre', 'hermano', 'hermana', 'abuel', 'pariente', 'hereditari']);
  if (
    !asksFamilyHistory &&
    (hasWordPrefix(norm, [
      'hipertension', 'presion alta', 'diabet', 'azucar',
      'asma', 'epoc', 'osteoporosis', 'dislipidemia', 'colesterol',
      'calculo', 'litiasis', 'vesicula', 'biliar', 'rinon', 'renal',
      'tiroid', 'depresion', 'artrosis', 'neuralgia', 'fractura', 'esguince',
      'enfermedad cronica', 'enfermedades previas', 'antecedentes personales',
      'padece de', 'sufre de', 'otra enfermedad', 'hospitalizado',
    ]) ||
      (hasWordPrefix(norm, ['enfermedad']) && hasWordPrefix(norm, ['cronic', 'otra', 'padece', 'sufre', 'tiene', 'antecedent'])))
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
      const positivePath = path.filter((item) => {
        const n = normalizeText(item);
        return !(
          n.startsWith('sin ') ||
          n.startsWith('niega ') ||
          n.includes('sin enfermedades') ||
          n.includes('sin cardiopat') ||
          n.includes('sin hospitaliz') ||
          n.includes('sano previamente') ||
          n.includes('sana previamente')
        );
      });
      const cleanedPath = positivePath
        .map((item) =>
          item
            .replace(/\.\s*Sin\s+hipertensi[oó]n(?:\s+ni\s+diabetes)?\.?/gi, '')
            .replace(/\bSin\s+hipertensi[oó]n(?:\s+ni\s+diabetes)?\.?/gi, '')
            .trim()
        )
        .filter(Boolean);
      const formattedPath = formatConversationalList(cleanedPath, patientInfo);
      const lowPath = formattedPath.charAt(0).toLowerCase() + formattedPath.slice(1);
      const startsWithVerb = /^(?:tengo|tuve|padec|padezco|me\s+|fui|fum[eé]|estuve|es\s+mi|mi\s+|naci|antes)/i.test(lowPath);
      const needsPastVerb = /^(?:dos\s+veces|veces\s+que|una\s+vez|una\s+gripa|una\s+infecci[oó]n|una\s+convulsi[oó]n|cuadro|torcedura|esguince|convulsi[oó]n|extracci[oó]n|dos\s+infecciones)/i.test(lowPath);
      const prefixVerb = startsWithVerb ? '' : needsPastVerb ? 'tuve ' : 'tengo ';
      return wrapConfirm(
        isPediatric
          ? `Pues de mi ${isFemale ? 'niña' : 'niño'} le cuento que ${lowPath}.`
          : `Sí doctor, ${prefixVerb}${lowPath}.`
      );
    }
    return isPediatric
      ? `No doctor, nació ${isFemale ? 'sana' : 'sano'} a sus nueve meses y nunca ha tenido enfermedades crónicas ni ${isFemale ? 'la' : 'lo'} han internado.`
      : 'No doctor, siempre he sido una persona sana; que yo sepa no sufro de presión alta, diabetes ni otra enfermedad crónica.';
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
      !hasWordPrefix(norm, ['alcohol', 'cerveza', 'licor', 'trago']))
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
      const formattedMeds = formatConversationalList(meds, patientInfo);
      const alreadyVerbal = /^(?:tom[eéo]|tomaba|me\s+|us[eéo]|suspend[ií]|dej[eé]|yo\s+|le\s+|intent[eé]|no\s+|antes|solo\s+)/i.test(formattedMeds);
      if (alreadyVerbal) {
        const lowerMeds = formattedMeds.charAt(0).toLowerCase() + formattedMeds.slice(1);
        return wrapConfirm(`Pues mire doctor, ${lowerMeds}.`);
      }
      const lowerMeds = formattedMeds.charAt(0).toLowerCase() + formattedMeds.slice(1);
      return wrapConfirm(
        isPediatric
          ? `Sí doctor, le estoy dando o poniendo ${lowerMeds}.`
          : `Sí doctor, estoy tomando ${lowerMeds}.`
      );
    }
    return isPediatric
      ? 'No le he dado ningún medicamento de base, doctor.'
      : 'No tomo ningún medicamento diario, doctor, y tampoco he tomado nada para esto.';
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
      return wrapConfirm(`Estoy casad${isFemale ? 'a' : 'o'} desde hace muchos años con mi misma pareja, aunque últimamente casi no tenemos actividad sexual por la edad y el cansancio. Sin molestias genitales.`);
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
      const famList = formatConversationalList(fam, patientInfo);
      const lowFam = famList.charAt(0).toLowerCase() + famList.slice(1);
      if (isPediatric && /^padres\s+sanos$/i.test(lowFam.trim())) {
        return wrapConfirm('Pues nosotros sus papás estamos sanos, doctor, y en la familia no hay enfermedades graves.');
      }
      return wrapConfirm(`Pues en mi familia, mire doctor: ${lowFam}.`);
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
    hasWordPrefix(norm, ['fuma', 'cigarro', 'tabaco', 'tabaquism', 'alcohol', 'cerveza', 'licor', 'droga', 'sustancia', 'vicio']) ||
    /\b(?:toma|tomar|tomo|bebe|beber|bebo|copa(?:s)?\s+de|vaso(?:s)?\s+de|botella(?:s)?\s+de)\s+vino\b|\bvino\s+(?:tinto|blanco|rosado)\b/i.test(norm) ||
    (hasWordPrefix(norm, ['bebe']) && !norm.includes('agua') && !norm.includes('bebe tiene') && !isPediatric)
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

  // 18. Cronología, qué estaba haciendo antes, cómo empezó todo, hora exacta
  const asksActivityBefore =
    norm.includes('estaba haciendo') ||
    norm.includes('antes de que empezara') ||
    norm.includes('antes de empezar') ||
    norm.includes('que hacia cuando') ||
    norm.includes('en que momento empezo');

  if (asksActivityBefore) {
    const activityKeywords = ['antes', 'despues de', 'cena', 'durmi', 'despert', 'reposo', 'turno', 'resfriado', 'hace una semana', 'comi', 'trabaj', 'levantar', 'caminando'];
    const freshBeforeMatch = extractMatchingSentences(
      patientInfo?.currentIllness,
      activityKeywords,
      patientInfo,
      previousPatientTexts
    );
    if (freshBeforeMatch) {
      return wrapConfirm(freshBeforeMatch);
    }
    const prevBeforeMatch = extractMatchingSentences(
      patientInfo?.currentIllness,
      activityKeywords,
      patientInfo,
      []
    );
    if (prevBeforeMatch) {
      const snippet = prevBeforeMatch.match(/(?:despu[eé]s de [^,.]+|al despertar[^,.]*|al terminar [^,.]+|en reposo[^,.]*|mientras [^,.]+)/i)?.[0];
      if (snippet) {
        return wrapConfirm(`Como le decía hace un momento, doctor, esto me empezó justo ${snippet.toLowerCase()}.`);
      }
      return wrapConfirm('Como le comentaba al principio, todo empezó justo en ese momento que le describí.');
    }
    return wrapConfirm(
      `Estaba haciendo mis cosas cotidianas con normalidad antes de que me empezara esto hace ${humanizeMedicalJargon(patientInfo?.evolutionTime || 'un rato', isPediatric)}, doctor.`
    );
  }

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
    const acuteTimelineMatch = extractMatchingSentences(
      patientInfo?.currentIllness,
      ['anoche', 'ayer', 'hoy', 'madrugada', 'manana', 'tarde', 'empez', 'inici', 'comenz', 'subito', 'golpe', 'horas'],
      patientInfo,
      previousPatientTexts,
      { excludeNegated: true }
    );
    const cleanEvo = humanizeMedicalJargon(
      (patientInfo?.evolutionTime || '')
        .replace(/\s+de\s+evoluci[oó]n$/i, '')
        .replace(/\s+post-inmovilizaci[oó]n$/i, ' desde que me pusieron el yeso o férula')
        .replace(/\b1?\s*crisis\s+generalizada\b/gi, 'un episodio fuerte con sacudidas y pérdida del conocimiento'),
      isPediatric
    )
      .replace(/\s+con\s+esto\b/gi, '')
      .trim();
    const evoText = cleanEvo
      ? isPediatric
        ? `Todo este cuadro lleva ${cleanEvo}, doctor`
        : `Llevo aproximadamente ${cleanEvo} con estas molestias, doctor`
      : '';
    if (acuteTimelineMatch && !/\b(?:hace\s+\d+\s+a[ñn]os|antecedente\s+de)\b/i.test(acuteTimelineMatch)) {
      return wrapConfirm(
        evoText && !normalizeText(acuteTimelineMatch).includes(normalizeText(cleanEvo))
          ? `${evoText}. ${acuteTimelineMatch}`
          : acuteTimelineMatch
      );
    }
    return wrapConfirm(
      evoText
        ? `${evoText}, y ha ido empeorando poco a poco hasta venir aquí.`
        : isPediatric
          ? `Esto empezó de forma reciente y mi ${isFemale ? 'niña' : 'niño'} ha ido empeorando.`
          : 'Esto me empezó de forma reciente y ha ido avanzando hasta como me ve ahorita.'
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
    const irradKeywords = ['irradia', 'cinturon', 'espalda', 'hombro', 'brazo', 'corre', 'escapula', 'ingle', 'testiculo', 'trapecio', 'mandibula', 'cuello', 'dorso'];
    const irradMatch =
      extractMatchingSentences(patientInfo?.currentIllness, irradKeywords, patientInfo, previousPatientTexts) ||
      extractMatchingSentences(combinedClinicalText, irradKeywords, patientInfo, previousPatientTexts);
    if (irradMatch) return wrapConfirm(irradMatch);
    const anyIrradFact = extractMatchingSentences(combinedClinicalText, irradKeywords, patientInfo, []);
    if (anyIrradFact) {
      const snippet = anyIrradFact.match(/(?:se\s+irradia|irradia|se\s+corre|corre)[^.,;]+/i)?.[0];
      return snippet
        ? `Sí doctor, como le comentaba hace un momento, siento que ${snippet.toLowerCase()}.`
        : 'Sí doctor, el dolor sí se me corre hacia esa zona que le mencioné hace un momento.';
    }
    return 'No siento que el dolor se corra hacia otra parte distante; se queda concentrado en la zona principal donde me molesta.';
  }

  // 20a. Intensidad del dolor (escala 1-10)
  if (
    hasWordPrefix(norm, ['intensidad', 'del 1 al 10', 'del uno al diez', 'que tan fuerte', 'escala del dolor', 'calificaria el dolor'])
  ) {
    const scoreMatch = `${patientInfo?.currentIllness || ''} ${safeCluesText}`.match(/\b(\d{1,2}\s*\/\s*10|\d{1,2}\s+de\s+10)\b/i);
    if (scoreMatch) {
      const rating = scoreMatch[1].replace(/\s*\/\s*/, ' de ');
      const alreadyMentionedScore = previousPatientTexts.some((t) => t.includes(normalizeText(scoreMatch[1])) || t.includes('de 10'));
      return wrapConfirm(
        alreadyMentionedScore
          ? `Le diría que sigue igual de fuerte, alrededor de ${rating}, doctor; no baja casi nada.`
          : `Es un dolor muy fuerte, doctor, yo lo calificaría como de ${rating}.`
      );
    }
    const isSeverePain = /intens|fuert|insoportabl|desesperant|horrible|agud|punzant|opresiv/i.test(
      `${patientInfo?.currentIllness || ''} ${patientInfo?.consultReason || ''}`
    );
    return wrapConfirm(
      isSeverePain
        ? 'No sabría darle una cifra exacta, doctor, pero es un dolor muy intenso que no me deja estar tranquilo.'
        : 'La verdad no sabría darle un número exacto del 1 al 10 porque no lo he medido así, pero sí es una molestia importante que me trajo a consulta.'
    );
  }

  // 20b. Factores que empeoran/alivian y posición
  if (
    hasWordPrefix(norm, [
      'empeora', 'aumenta', 'desencaden', 'alivia', 'calma', 'mejora',
      'posicion', 'postura', 'al caminar', 'al toser', 'al moverse',
      'acostar', 'acostado', 'inclina', 'almohada',
    ])
  ) {
    if (caseId === 'case-apendicitis-aguda') {
      return wrapConfirm('Empeora muchísimo al caminar, toser o brincar. Solo alivia un poquito quedarme quieta acostada de lado con las piernas encogidas.');
    }
    if (caseId === 'case-iamcest-anterior') {
      return wrapConfirm('No se calma en ninguna posición ni descansando, doctor, sigue igual de opresivo.');
    }
    if (caseId === 'case-neumonia-adquirida') {
      return wrapConfirm('Cada vez que respiro hondo o toso me da una punzada fortísima en el costado derecho.');
    }
    if (caseId === 'case-meningitis-bacteriana') {
      return wrapConfirm('Cualquier luz, ruido o doblar el cuello lo empeora muchísimo.');
    }
    if (caseId === 'case-dengue-alarm') {
      return wrapConfirm('Si me presionan debajo de las costillas derechas siento que no lo aguanto, y no se calma acostado.');
    }
    const modKeywords = ['empeora', 'alivia', 'calma', 'mejora', 'acostar', 'inclin', 'respirar', 'toser', 'grasa', 'cena', 'fritura', 'posicion', 'gatillo', 'encoger'];
    const intenMatch =
      extractMatchingSentences(patientInfo?.currentIllness, modKeywords, patientInfo, previousPatientTexts) ||
      extractMatchingSentences(combinedClinicalText, modKeywords, patientInfo, previousPatientTexts);
    if (intenMatch) return wrapConfirm(intenMatch);
    return wrapConfirm('No logro encontrar ninguna postura que me lo quite del todo, doctor; con cualquier movimiento o esfuerzo me molesta más.');
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
    const normIllness = normalizeText(patientInfo?.currentIllness || '')
      .replace(/\b(?:niega|sin|ausencia de|no ha tenido|no refiere|no presenta|no tuvo)\s+[^.;]+/g, ' ');
    const explicitPastFever =
      /\b(?:tuvo|tuve|presento|con|presenta|refiere|inicio con|comenzo con|acompanad[oa] de|episodio de)\s+(?:[a-z]+\s+){0,4}(?:fiebre|febricula|calentura)\b/.test(
        normIllness
      );
    const mentionsFeverInChart = (temp !== undefined && temp >= 37.6) || (explicitPastFever && (temp === undefined || temp >= 37.2));
    if (mentionsFeverInChart) {
      const feverMatch = extractMatchingSentences(
        patientInfo?.currentIllness,
        ['fiebre', 'febric', 'escalofrio', 'sudor', 'diaforesis', 'calentura'],
        patientInfo,
        previousPatientTexts,
        { excludeNegated: true }
      );
      if (temp !== undefined && temp >= 38.0) {
        return wrapConfirm(`Sí doctor, ${isPediatric ? `mi niño ha tenido fiebre alta (ahorita trae ${temp.toFixed(1)}°C)` : `tengo fiebre alta (ahorita traigo ${temp.toFixed(1)}°C)`}. ${feverMatch || ''}`.trim());
      }
      return wrapConfirm(
        feverMatch
          ? `Sí doctor, ${feverMatch.charAt(0).toLowerCase()}${feverMatch.slice(1)}`
          : `Sí doctor, he sentido algo de calentura${temp && temp >= 37.5 ? ` (alrededor de ${temp.toFixed(1)}°C)` : ''}.`
      );
    }
    const sweatMatch = extractMatchingSentences(patientInfo?.currentIllness, ['sudor', 'diaforesis', 'sudoracion', 'escalofrio'], patientInfo, previousPatientTexts);
    if (sweatMatch) {
      return wrapConfirm(`Fiebre no he tenido, doctor, pero sí ${sweatMatch.charAt(0).toLowerCase()}${sweatMatch.slice(1)}`);
    }
    return isPediatric
      ? 'No le he notado fiebre alta, doctor, solo estuvo un poco destemplado.'
      : `Fiebre no he sentido, doctor, aunque sí me siento muy ${isFemale ? 'destemplada' : 'destemplado'} por todo el malestar.`;
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
    const respKeywords = ['respir', 'aire', 'tos', 'sibilancia', 'rinorrea', 'garganta', 'silbido', 'ronca', 'estridor', 'tragar', 'costilla', 'flema', 'secrecion'];
    const respMatch = extractMatchingSentences(patientInfo?.currentIllness, respKeywords, patientInfo, previousPatientTexts, { excludeNegated: true });
    if (respMatch) return wrapConfirm(respMatch);
    const prevRespMatch = extractMatchingSentences(patientInfo?.currentIllness, respKeywords, patientInfo, [], { excludeNegated: true });
    if (prevRespMatch) {
      return wrapConfirm(`Como le comenté hace un momento, doctor, ${prevRespMatch.charAt(0).toLowerCase()}${prevRespMatch.slice(1)}`);
    }
    return isPediatric
      ? `No tiene tos ni dificultad para respirar ahorita, doctor, su pecho se escucha normal.`
      : 'No tengo tos ni falta de aire grave ahorita, doctor, respiro más o menos normal aunque agitado por el malestar.';
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
    const painKeywords = ['punz', 'opres', 'ardor', 'retortijon', 'calambre', 'ulcera', 'epigastri', 'hipocondrio', 'lumbar', 'pecho', 'costilla', 'espalda', 'abdomen', 'estomago', 'irradia', 'fosa', 'cuadrante', 'pierna', 'cabeza', 'desproporcionad'];
    const painMatch =
      extractMatchingSentences(patientInfo?.currentIllness, painKeywords, patientInfo, previousPatientTexts, { excludeNegated: true }) ||
      extractMatchingSentences(combinedClinicalText, painKeywords, patientInfo, previousPatientTexts, { excludeNegated: true });
    if (painMatch) return wrapConfirm(painMatch);
    const hasPainInReason = normalizeText(patientInfo?.consultReason || '').includes('dolor');
    const naturalReason = humanizeReason(patientInfo?.consultReason, isPediatric);
    if (hasPainInReason) {
      const anyPainSentence = extractMatchingSentences(patientInfo?.currentIllness, painKeywords, patientInfo, [], { excludeNegated: true });
      if (anyPainSentence && anyPainSentence.length <= 220) {
        return wrapConfirm(anyPainSentence);
      }
      return wrapConfirm(
        isPediatric
          ? `Le duele bastante a mi ${isFemale ? 'niña' : 'niño'}, doctor; justo tiene ${naturalReason}.`
          : `Me duele bastante, doctor; justo tengo ${naturalReason}.`
      );
    }
    const reasonStartsWithVerb = /^(?:me\s+|tengo|siento|no\s+|se\s+|le\s+)/i.test(naturalReason);
    if (isPediatric) {
      return wrapConfirm(`Más que un dolor en un solo punto, doctor, lo que tiene mi ${isFemale ? 'niña' : 'niño'} es ${naturalReason}.`);
    }
    return wrapConfirm(
      reasonStartsWithVerb
        ? `Más que un dolor en un solo punto, doctor, lo que más siento es que ${naturalReason}.`
        : `Más que un dolor en un solo punto, doctor, lo que más siento es ${naturalReason}.`
    );
  }

  // 24. Náuseas, vómitos (cuántas veces / contenido), apetito y alimentación
  if (hasWordPrefix(norm, ['nausea', 'vomito', 'vomit', 'devolv', 'arcada', 'asco', 'apetito', 'hambre', 'comido', 'comer', 'comida', 'desayun', 'almorz', 'cenado', 'grasa', 'fritura', 'tragar'])) {
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
    const giKeywords = isPediatric
      ? ['vomit', 'nausea', 'bilios', 'fecaloide', 'comer', 'cena', 'fritura', 'tragar', 'pecho', 'leche', 'marisco', 'pollo']
      : ['vomit', 'nausea', 'bilios', 'fecaloide', 'comer', 'cena', 'fritura', 'tragar', 'marisco', 'pollo'];
    const giMatch = extractMatchingSentences(
      combinedClinicalText,
      giKeywords,
      patientInfo,
      previousPatientTexts
    );
    if (giMatch) return wrapConfirm(giMatch);
    const anyGiFact = extractMatchingSentences(combinedClinicalText, ['vomit', 'nausea'], patientInfo, []);
    if (anyGiFact) {
      if (hasWordPrefix(norm, ['color', 'aspecto', 'como es', 'que tipo', 'contenido'])) {
        const contentHint = anyGiFact.match(/\b(?:g[aá]stric[oa]s?|alimentari[oa]s?|biliar(?:es)?|verdos[oa]s?|sangre|oscuro|caf[eé])\b/i)?.[0]?.toLowerCase();
        if (contentHint?.startsWith('gastr') || contentHint?.startsWith('gástr')) {
          return isPediatric
            ? 'Lo que vomitó fue principalmente líquido del estómago, doctor.'
            : 'Lo que he vomitado ha sido principalmente líquido del estómago, doctor, con mucha náusea.';
        }
        return contentHint
          ? `Lo que ${isPediatric ? 'vomitó' : 'he vomitado'} ha sido principalmente de aspecto ${contentHint.replace(/es$/, '').replace(/s$/, '')}, doctor.`
          : `${isPediatric ? 'Vomitó' : 'He vomitado'} líquido del estómago y restos de lo poco que había comido, doctor.`;
      }
      return isPediatric
        ? 'Sí doctor, como le decía, estuvo vomitando y sin querer comer bien.'
        : 'Sí doctor, como le decía, he tenido náuseas y esos vómitos que no me dejan tolerar nada.';
    }
    return isPediatric
      ? `No ha estado vomitando ahorita, doctor, aunque sí ha querido comer menos por el malestar.`
      : 'No he estado vomitando en este momento, doctor, aunque sí tengo poco apetito por el malestar.';
  }

  // 25. Orina (color, ardor, cantidad), sed, hidratación
  if (hasWordPrefix(norm, ['orina', 'orinar', 'urinari', 'miccion', 'sed', 'boca seca', 'agua', 'poliuria', 'polidipsia', 'ardor al orinar', 'hinchazon', 'hinchad', 'edema', 'espuma'])) {
    if (caseId === 'case-cetoacidosis-diabetica') {
      return wrapConfirm('He estado orinando muchísimo y muy seguido desde ayer, y tengo una sed desesperante con la boca completamente seca.');
    }
    if (caseId === 'case-dengue-alarm') {
      return wrapConfirm('He orinado muy poquito hoy, casi nada, y de color oscuro; además tengo la boca bastante seca.');
    }
    const renalKeywords = ['orina', 'coluria', 'oscura', 'color te', 'como te', 'rojiz', 'tenida de rojo', 'hematuria', 'hincha', 'tobillo', 'sed', 'ardor al orinar', 'urgencia para orinar'];
    const renalMatch =
      extractMatchingSentences(patientInfo?.currentIllness, renalKeywords, patientInfo, previousPatientTexts) ||
      extractMatchingSentences(combinedClinicalText, renalKeywords, patientInfo, previousPatientTexts);
    if (renalMatch) return wrapConfirm(renalMatch);
    const anyRenalFact = extractMatchingSentences(combinedClinicalText, ['orina', 'coluria', 'hematuria', 'rojiz', 'tenida de rojo'], patientInfo, []);
    if (anyRenalFact) {
      const colorHint = anyRenalFact.match(/(?:te[ñn]ida de rojo|oscura(?: como t[eé])?|rojiz[oa]|sangre en la orina|urgencia para orinar)/i)?.[0];
      return colorHint
        ? `Como le comenté hace un momento, doctor, ${isPediatric ? 'sigue' : 'sigo'} con ${colorHint.toLowerCase()}.`
        : `Como le comentaba, doctor, sí ${isPediatric ? 'ha tenido' : 'he notado'} cambios al orinar junto con este cuadro.`;
    }
    return isPediatric
      ? `Ha estado mojando el pañal o yendo al baño de color normal, doctor.`
      : 'He orinado de color normal, sin ardor ni molestias, doctor.';
  }

  // 26. Evacuaciones, diarrea, estreñimiento, gases
  if (hasWordPrefix(norm, ['evacua', 'diarrea', 'heces', 'estreni', 'bano', 'defec', 'gases', 'excremento', 'popis', 'panal', 'moco'])) {
    if (caseId === 'case-apendicitis-aguda') {
      return wrapConfirm('No he ido al baño desde ayer, doctor, y si hago fuerza o pujo me da una punzada horrible abajo a la derecha.');
    }
    const bowelMatch = extractMatchingSentences(
      combinedClinicalText,
      ['diarrea', 'evacua', 'heces', 'gases', 'moco', 'grosella', 'panal', 'sangre', 'negra', 'melena'],
      patientInfo,
      previousPatientTexts
    );
    if (bowelMatch) return wrapConfirm(bowelMatch);
    return isPediatric
      ? 'Ha hecho del baño normal, doctor, sin diarrea ni sangre en el pañal.'
      : 'Mis evacuaciones han sido normales, no he tenido diarrea ni evacuaciones negras o con sangre.';
  }

  // 27. Cabeza, visión, luz, cuello
  if (hasWordPrefix(norm, ['cabeza', 'cefalea', 'luz', 'fotofobia', 'cuello', 'nuca', 'rigidez', 'tieso', 'ojos', 'retroocular', 'vision', 'borrosa'])) {
    if (caseId === 'case-meningitis-bacteriana') {
      return wrapConfirm('Me estalla la cabeza de dolor, la luz me lastima muchísimo los ojos y tengo el cuello completamente tieso; no puedo bajar la barbilla hacia el pecho.');
    }
    if (caseId === 'case-dengue-alarm') {
      return wrapConfirm('Me duele muchísimo detrás de los ojos, sobre todo cuando intento mover la mirada hacia los lados, pero puedo mover el cuello normal.');
    }
    const headMatch = extractMatchingSentences(
      combinedClinicalText,
      ['cabeza', 'ojos', 'vision', 'cuello', 'luz', 'amarill', 'icteric'],
      patientInfo,
      previousPatientTexts
    );
    if (headMatch) return wrapConfirm(headMatch);
    return isPediatric
      ? 'No se ha quejado de dolor fuerte de cabeza ni le noto el cuello tieso, doctor.'
      : 'No tengo dolor intenso de cabeza, rigidez de cuello ni visión borrosa, doctor.';
  }

  // 28. Piel, sangrados, manchas, ampollas, picazón, hormigueo
  if (hasWordPrefix(norm, ['sangrad', 'sangre', 'encias', 'nariz', 'moret', 'mancha', 'puntito', 'roncha', 'sarpullido', 'piel', 'petequia', 'ampolla', 'llaga', 'comezon', 'picazon', 'hormigueo', 'adormec', 'amarill', 'oscur'])) {
    if (caseId === 'case-dengue-alarm') {
      return wrapConfirm('Hoy en la mañana me sangraron las encías al cepillarme los dientes y me noté unos puntitos rojos en las piernas y un salpullido tenue.');
    }
    if (caseId === 'case-meningitis-bacteriana') {
      return wrapConfirm('Noté unas manchitas moradas o puntitos rojos pequeños que me salieron en el pecho y las piernas que no se quitan al apretarlos.');
    }
    const skinMatch = extractMatchingSentences(
      combinedClinicalText,
      ['roncha', 'ampolla', 'mancha', 'sangrad', 'llaga', 'ulcera', 'hormigueo', 'adormec', 'prurito', 'picazon', 'piel', 'roja', 'amarill', 'icteric', 'oscurec', 'hiperpigment', 'nodulo'],
      patientInfo,
      previousPatientTexts
    );
    if (skinMatch) return wrapConfirm(skinMatch);
    return isPediatric
      ? 'No le he visto sangrados, ronchas ni manchitas raras en la piel, doctor.'
      : 'No he notado sangrados, ronchas ni cambios raros en la piel, doctor.';
  }

  // 29. Palpitaciones, latidos, mareos, debilidad, somnolencia, confusión, sueño, ánimo
  if (hasWordPrefix(norm, ['mareo', 'maread', 'desmay', 'debil', 'cansanc', 'sueno', 'somnol', 'confus', 'desorient', 'vertigo', 'despierto', 'alerta', 'palpitac', 'latido', 'corazon', 'dormir', 'durmi', 'ansiedad', 'nervios', 'agitac', 'temblor', 'alucin'])) {
    if (caseId === 'case-dengue-alarm') {
      return wrapConfirm('Estoy sumamente débil y cada vez que me intento poner de pie siento que todo me da vueltas y me voy a desmayar.');
    }
    if (caseId === 'case-cetoacidosis-diabetica') {
      return wrapConfirm('Me siento extremadamente débil y con muchísimo sueño, me cuesta trabajo mantenerme concentrada.');
    }
    if (caseId === 'case-meningitis-bacteriana') {
      return wrapConfirm('Me siento muy aturdido, confundido y con mucho sueño, me cuesta trabajo pensar con claridad.');
    }
    const neuroMatch = extractMatchingSentences(
      combinedClinicalText,
      ['mareo', 'desmay', 'agitac', 'confus', 'desorient', 'nervios', 'temblor', 'debil', 'fatiga', 'somnol', 'alucin', 'insecto', 'sueno'],
      patientInfo,
      previousPatientTexts
    );
    if (neuroMatch) return wrapConfirm(neuroMatch);
    return isPediatric
      ? `Está algo decaíd${isFemale ? 'a' : 'o'} por el malestar, doctor, pero sí responde y está despiert${isFemale ? 'a' : 'o'}.`
      : 'Me siento bastante decaído y cansado por el malestar que traigo, pero estoy consciente.';
  }

  // 30. Pérdida de peso, transfusiones, tatuajes, inmunosupresión, traumas, golpes o mascotas/agua
  if (hasWordPrefix(norm, ['peso', 'adelgaz', 'bajar de peso', 'sudoracion nocturna', 'ganglio', 'bolita'])) {
    const weightMatch = extractMatchingSentences(
      `${combinedClinicalText} ${joinList(background?.pathological, '')}`,
      ['peso', 'kg', 'adelgaz', 'nocturn', 'sudor', 'ganglio'],
      patientInfo,
      previousPatientTexts
    );
    if (weightMatch) return wrapConfirm(weightMatch);
    return wrapConfirm('No he perdido peso de forma involuntaria últimamente ni he notado bolitas en el cuello o las axilas, doctor.');
  }
  if (hasWordPrefix(norm, ['transfusion', 'tatuaje', 'perforacion', 'piercing', 'vih', 'inmunosup', 'defensas'])) {
    return wrapConfirm('Nunca me han hecho transfusiones de sangre, no tengo tatuajes ni perforaciones y hasta donde sé no tengo problemas de defensas bajas.');
  }
  if (hasWordPrefix(norm, ['golpe', 'caida', 'accidente', 'trauma', 'fractura', 'moto', 'choque', 'esguince', 'inmoviliz', 'tropez', 'raspon'])) {
    const traumaMatch = extractMatchingSentences(
      `${combinedClinicalText} ${joinList(background?.pathological, '')}`,
      ['accidente', 'moto', 'golpe', 'fractura', 'yeso', 'inmovil', 'trauma', 'caida', 'cayo', 'tropez', 'raspon'],
      patientInfo,
      previousPatientTexts
    );
    if (traumaMatch) return wrapConfirm(traumaMatch);
    return 'No he sufrido golpes, caídas ni accidentes recientemente, doctor.';
  }
  if (hasWordPrefix(norm, ['mascota', 'perro', 'gato', 'raton', 'rata', 'agua potable', 'marisco', 'carne', 'leche', 'comida callejera', 'salado', 'sal'])) {
    const foodEnvMatch = extractMatchingSentences(
      `${combinedClinicalText} ${joinList(background?.nonPathological, '')}`,
      ['marisco', 'comida', 'agua', 'animal', 'perro', 'gato', 'zancudo', 'campo', 'sal', 'fritura', 'pollo'],
      patientInfo,
      previousPatientTexts
    );
    if (foodEnvMatch) return wrapConfirm(foodEnvMatch);
    return 'En casa tomamos agua potable limpia, no convivo con animales enfermos ni he comido alimentos echados a perder.';
  }

  // 31. Preguntas de seguimiento sobre detalles minuciosos (color / aspecto / cantidad / frecuencia / tipo)
  // Usa el intercambio previo del chat para saber de qué síntoma está hablando el médico SIN repetir textualmente.
  const isOpenComplaintQuestion =
    norm.includes('que tiene') ||
    norm.includes('que siente') ||
    norm.includes('como se siente') ||
    norm.includes('que le pasa') ||
    norm.includes('que le paso') ||
    norm.includes('que le ocurre') ||
    norm.includes('que le sucede');

  if (!isOpenComplaintQuestion && hasWordPrefix(norm, ['color', 'aspecto', 'cuant', 'frecuenci', 'exactament', 'detalle', 'como era', 'como es', 'que tipo', 'contenido'])) {
    const prevContextNorm = normalizeText(`${lastDoctorMsg} ${lastPatientMsg || ''}`);
    const lastPatientNegated = /^(no\b|ningun|nunca|tampoco|sin\b)/i.test(normalizeText(lastPatientMsg || '')) ||
      /\b(?:no he tenido|no he estado|no tengo|no he notado)\b/i.test(normalizeText(lastPatientMsg || ''));

    if (lastPatientNegated) {
      return 'Como le mencionaba hace un momento, doctor, no he tenido ese síntoma en realidad.';
    }
    if (hasWordPrefix(prevContextNorm, ['vomit', 'nausea', 'devolv'])) {
      const vomitDetail = extractMatchingSentences(combinedClinicalText, ['vomit', 'bilios', 'aliment', 'fecaloide', 'sangre', 'veces'], patientInfo, previousPatientTexts);
      return vomitDetail || 'Fueron varias arcadas con contenido líquido y algo verdoso-amargo, doctor, y no tolero nada en el estómago.';
    }
    if (hasWordPrefix(prevContextNorm, ['orina', 'miccion', 'bano'])) {
      const urineDetail = extractMatchingSentences(combinedClinicalText, ['orina', 'oscura', 'rojiz', 'hematuria', 'espuma', 'poquito'], patientInfo, previousPatientTexts);
      return urineDetail || 'La orina salió en poca cantidad y un poco concentrada, sin coágulos ni pus.';
    }
    if (hasWordPrefix(prevContextNorm, ['tos', 'flema', 'esputo', 'respir'])) {
      const sputumDetail = extractMatchingSentences(combinedClinicalText, ['flema', 'esputo', 'oxido', 'rojiz', 'tos', 'seca', 'sangre'], patientInfo, previousPatientTexts);
      return sputumDetail || 'Es una tos molesta con algo de flema espesa blanquecina-amarillenta, sin sangre franca.';
    }
    if (hasWordPrefix(prevContextNorm, ['evacua', 'diarrea', 'heces', 'panal'])) {
      const stoolDetail = extractMatchingSentences(combinedClinicalText, ['diarrea', 'heces', 'moco', 'grosella', 'sangre', 'evacua'], patientInfo, previousPatientTexts);
      return stoolDetail || 'No he notado sangre negra ni pus en las evacuaciones, doctor.';
    }
    if (hasWordPrefix(prevContextNorm, ['dolor', 'duele', 'molestia'])) {
      const painDetail = extractMatchingSentences(combinedClinicalText, ['punz', 'opres', 'colico', 'continuo', 'ardor', 'irradia', '/10'], patientInfo, previousPatientTexts);
      return painDetail || `Es un dolor constante e intenso que no me deja estar ${isFemale ? 'cómoda' : 'cómodo'} en ninguna postura.`;
    }
    const freshDetail = extractMatchingSentences(
      combinedClinicalText,
      ['color', 'veces', 'horas', 'dias', 'kg', 'cm', 'mm', 'mg', 'rojo', 'amarill', 'oscur'],
      patientInfo,
      previousPatientTexts
    );
    if (freshDetail) return freshDetail;
  }

  // 32. Preguntas generales abiertas de consulta
  if (
    isOpenComplaintQuestion ||
    norm.includes('por que viene') ||
    norm.includes('por que vino') ||
    norm.includes('que lo trae') ||
    norm.includes('que la trae') ||
    norm.includes('motivo de consulta') ||
    hasWordPrefix(norm, ['sintoma', 'molestia', 'cuenteme', 'expliqueme'])
  ) {
    if (caseId === 'case-dengue-alarm') {
      return 'Doctor, llevo 4 días sintiéndome fatal: empecé con calentura altísima y dolor detrás de los ojos, y hoy que bajó la fiebre me dio un dolor muy fuerte en la panza, vómitos, mareos y me sangraron las encías.';
    }
    if (caseId === 'case-apendicitis-aguda') {
      return 'Me duele muchísimo abajo del lado derecho de la panza, doctor. Empezó anoche alrededor del ombligo, vomité y se me quitó el hambre por completo.';
    }
    if (caseId === 'case-iamcest-anterior') {
      return 'Siento un apretón horrible justo en el centro del pecho que se me corre a la quijada y al brazo izquierdo, con sudor frío y mucha falta de aire.';
    }
    if (caseId === 'case-cetoacidosis-diabetica') {
      return 'Me cuesta mucho respirar, tengo una sed desesperante, he vomitado varias veces y me siento sumamente débil y con mucho sueño.';
    }
    if (caseId === 'case-meningitis-bacteriana') {
      return 'Me está estallando la cabeza, doctor, tengo calentura altísima, no aguanto la luz y siento el cuello completamente tieso.';
    }
    if (caseId === 'case-neumonia-adquirida') {
      return 'Tengo calentura alta desde hace 3 días, tos con flema oscura como color óxido, ahogo y una punzada en el lado derecho del pecho cada vez que respiro.';
    }
    if (patientInfo?.currentIllness) {
      const positiveIllnessSentences = patientInfo.currentIllness
        .split(/(?<=[.!?])\s+/)
        .filter((s) => !/^\s*(?:niega|sin\b|no\s+(?:ha|he|presenta|refiere|tiene|tuvo))\b/i.test(s))
        .join(' ');
      const freshSentences = extractMatchingSentences(
        positiveIllnessSentences || patientInfo.currentIllness,
        [
          'dolor', 'fiebre', 'vomit', 'aire', 'mareo', 'debil', 'sangr', 'piel', 'empez',
          'hormigueo', 'adormec', 'entumec', 'ardor', 'fatiga', 'cansanc', 'palidez', 'acude',
          'molestia', 'comezon', 'picazon', 'calambre', 'pesadez', 'piquete', 'descarga',
        ],
        patientInfo,
        previousPatientTexts
      );
      if (freshSentences) return freshSentences;
      return adapt(positiveIllnessSentences || patientInfo.currentIllness);
    }
    return `Me siento muy mal, doctor. Llevo ${patientInfo?.evolutionTime || 'varios días'} con ${humanizeReason(patientInfo?.consultReason, isPediatric)} y siento que empeoro.`;
  }

  // 33. Si fue una confirmación pura con palabras sueltas y tenemos historial, reafirma coherentemente
  if (isConfirmationOrRepeat && lastPatientMsg) {
    return `Sí doctor, tal como se lo conté hace un momento.`;
  }

  // 34. Coincidencia semántica directa con historia clínica, pistas seguras o antecedentes antes de rendirse
  const stopWords = new Set(['tiene', 'tienes', 'tuvo', 'tuviste', 'hace', 'como', 'cuando', 'donde', 'quien', 'cual', 'porque', 'para', 'sobre', 'entre', 'usted', 'doctor', 'alguna', 'alguno', 'algun', 'algo', 'mucho', 'poco', 'puede', 'siente', 'sintio', 'presenta', 'presento', 'tenido', 'estado', 'ultimos', 'dias', 'horas']);
  const queryTokens = norm
    .split(' ')
    .filter((w) => w.length >= 4 && !stopWords.has(w));
  if (queryTokens.length > 0) {
    const allContextText = [
      combinedClinicalText,
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
      patientInfo,
      previousPatientTexts
    );
    if (semanticMatch) {
      return wrapConfirm(semanticMatch);
    }
    if (
      hasWordPrefix(norm, ['tipo de sangre', 'grupo sanguineo', 'rh', 'fecha exacta', 'hora exacta', 'numero de', 'cuanto media', 'resultado de laboratorio', 'ultimo examen', 'ultima analitica'])
    ) {
      return isPediatric
        ? 'La verdad desconozco ese dato exacto de mi hijo, doctor, no lo traigo anotado.'
        : 'La verdad desconozco ese dato exacto, doctor, no me lo han dicho o no me acuerdo ahorita.';
    }
    if (norm.includes('?') || hasWord(norm, ['ha', 'has', 'es', 'fue', 'hubo']) || hasWordPrefix(norm, ['tiene', 'tuvo', 'siente', 'presenta', 'consume', 'usa', 'toma', 'padece'])) {
      return isPediatric
        ? `La verdad no le he notado eso a mi niño ni me han comentado nada de eso, doctor; lo que sí tiene es ${humanizeReason(patientInfo?.consultReason, true)}.`
        : `La verdad desconozco si eso me pasa o no me he dado cuenta, doctor; que yo recuerde no he sentido algo así.`;
    }
  }

  // 35. Fallback honesto en primera persona (sin inventar datos)
  return isPediatric
    ? `La verdad desconozco ese dato o no le entendí bien qué me pregunta de mi niño, doctor. ¿Me lo podría preguntar con otras palabras?`
    : `La verdad desconozco ese dato o no le entendí bien qué me pregunta, doctor. ¿Me lo podría decir con otras palabras?`;
}
