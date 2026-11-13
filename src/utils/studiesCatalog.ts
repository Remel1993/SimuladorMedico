import { ClinicalCase, ComplementaryStudy } from '../types/clinical';

/**
 * Universal Hospital Diagnostic Catalog
 * Proporciona un menú hospitalario estandarizado completo de práctica clínica diaria
 * (incluyendo Gasometría arterial, Biometría Hemática, Química Sanguínea, Electrolitos,
 * Perfil Hepático, PCR/VSG, β-hCG, Urocultivo, Perfil Tiroideo, TAC, RMN, Rx, US y ECG).
 * Además, resuelve dinámicamente hallazgos relacionados anatómica y fisiopatológicamente
 * cuando se solicita un estudio secundario o no confirmatorio.
 */
export const HOSPITAL_SUBCATEGORY_ORDER: ComplementaryStudy['subcategory'][] = [
  'Hematología',
  'Bioquímica',
  'Electrolitos',
  'Función Hepática',
  'Gases',
  'Inflamación e Infección',
  'Cardiovascular',
  'Urinario',
  'Microbiología / Serología',
  'Radiología',
  'Ecografía',
  'Tomografía',
  'Electrocardiograma',
];

export const STANDARD_HOSPITAL_STUDIES: ComplementaryStudy[] = [
  {
    id: 'hosp-hemograma',
    category: 'Laboratorio',
    subcategory: 'Hematología',
    name: 'Hemograma completo (Biometría Hemática con diferencial)',
    result: 'Leucocitos: 7,400 /mm³ (Neutrófilos 60%, Linfocitos 30%, Monocitos 7%, Eosinófilos 3%) | Hemoglobina: 13.8 g/dL | Hematocrito: 41.2% | VCM: 88 fL | Plaquetas: 245,000 /mm³.',
    referenceRange: 'Leucocitos: 4,500-11,000 /mm³ | Hb: 12-16 g/dL | Hto: 36-47% | Plaquetas: 150,000-450,000 /mm³',
    interpretation: 'Serie roja, blanca y plaquetaria dentro de parámetros basales normales.',
    isAbnormal: false,
  },
  {
    id: 'hosp-quimica-basica',
    category: 'Laboratorio',
    subcategory: 'Bioquímica',
    name: 'Química sanguínea básica (Glucosa, Urea, Creatinina, BUN)',
    result: 'Glucosa sérica: 94 mg/dL | Urea: 28 mg/dL | BUN: 13 mg/dL | Creatinina sérica: 0.88 mg/dL (TFG >90 mL/min/1.73m²).',
    referenceRange: 'Glucosa: 70-100 mg/dL | Urea: 15-40 mg/dL | Creatinina: 0.6-1.2 mg/dL',
    interpretation: 'Metabolismo glucémico basal y función renal glomerular conservados.',
    isAbnormal: false,
  },
  {
    id: 'hosp-electrolitos',
    category: 'Laboratorio',
    subcategory: 'Electrolitos',
    name: 'Electrolitos séricos (Na⁺, K⁺, Cl⁻, Ca²⁺, Mg²⁺)',
    result: 'Sodio (Na⁺): 139 mEq/L | Potasio (K⁺): 4.1 mEq/L | Cloro (Cl⁻): 102 mEq/L | Calcio total: 9.3 mg/dL | Magnesio: 2.0 mg/dL.',
    referenceRange: 'Na⁺: 135-145 mEq/L | K⁺: 3.5-5.1 mEq/L | Cl⁻: 98-107 mEq/L | Ca²⁺: 8.5-10.5 mg/dL',
    interpretation: 'Equilibrio hidroelectrolítico sérico dentro de parámetros fisiológicos.',
    isAbnormal: false,
  },
  {
    id: 'hosp-gasometria',
    category: 'Laboratorio',
    subcategory: 'Gases',
    name: 'Gasometría arterial (GSA) y lactato sérico',
    result: 'pH: 7.40 | PaCO₂: 39 mmHg | PaO₂: 92 mmHg | HCO₃⁻: 24.0 mEq/L | Exceso de base: 0.0 mEq/L | SaO₂: 97% | Lactato: 1.1 mmol/L.',
    referenceRange: 'pH: 7.35-7.45 | PaCO₂: 35-45 mmHg | PaO₂: 80-100 mmHg | HCO₃⁻: 22-26 mEq/L | Lactato: <2.0 mmol/L',
    interpretation: 'Equilibrio ácido-base, oxigenación arterial y perfusión tisular dentro de la normalidad.',
    isAbnormal: false,
  },
  {
    id: 'hosp-perfil-hepatico',
    category: 'Laboratorio',
    subcategory: 'Función Hepática',
    name: 'Perfil hepático completo y bilirrubinas (TGO, TGP, FA, BT/BD, Albúmina)',
    result: 'AST (TGO): 24 U/L | ALT (TGP): 26 U/L | Fosfatasa Alcalina: 78 U/L | Bilirrubina Total: 0.7 mg/dL (Directa: 0.2 mg/dL, Indirecta: 0.5 mg/dL) | Albúmina sérica: 4.1 g/dL.',
    referenceRange: 'AST/ALT: <40 U/L | FA: 40-130 U/L | Bilirrubina Total: 0.2-1.2 mg/dL | Albúmina: 3.5-5.0 g/dL',
    interpretation: 'Sin evidencia de citólisis hepática, colestasis ni hipoalbuminemia.',
    isAbnormal: false,
  },
  {
    id: 'hosp-pcr-vsg',
    category: 'Laboratorio',
    subcategory: 'Inflamación e Infección',
    name: 'Reactantes de fase aguda (Proteína C Reactiva cuantitativa y VSG)',
    result: 'Proteína C Reactiva (PCR): 3.2 mg/L | Velocidad de Sedimentación Globular (VSG): 10 mm/h.',
    referenceRange: 'PCR: <5.0 mg/L | VSG: <20 mm/h',
    interpretation: 'Sin respuesta inflamatoria sistémica aguda significativa en reactantes.',
    isAbnormal: false,
  },
  {
    id: 'hosp-perfil-tiroideo',
    category: 'Laboratorio',
    subcategory: 'Bioquímica',
    name: 'Perfil tiroideo (TSH y T4 libre)',
    result: 'TSH ultrasensible: 2.15 mUI/L | T4 libre: 1.24 ng/dL.',
    referenceRange: 'TSH: 0.4-4.2 mUI/L | T4L: 0.8-1.8 ng/dL',
    interpretation: 'Estado eutiroideo; descarta disfunción tiroidea aguda como causa de síntomas.',
    isAbnormal: false,
  },
  {
    id: 'hosp-bhcg',
    category: 'Laboratorio',
    subcategory: 'Bioquímica',
    name: 'Fracción Beta de Gonadotropina Coriónica Humana (β-hCG cuantitativa)',
    result: 'β-hCG sérica: < 2.0 mUI/mL (Negativo).',
    referenceRange: 'Negativo (< 5.0 mUI/mL)',
    interpretation: 'Descarta embarazo en curso.',
    isAbnormal: false,
  },
  {
    id: 'hosp-urinalysis-ego',
    category: 'Laboratorio',
    subcategory: 'Urinario',
    name: 'Examen general de orina (EGO) con sedimento urinario',
    result: 'Color: Amarillo paja | Aspecto: Transparente | Densidad: 1.018 | pH: 6.0 | Proteínas: Negativo | Glucosa: Negativo | Cetonas: Negativo | Hemoglobina/Sangre: Negativo | Leucocitos: 1-2 por campo | Eritrocitos: 0-1 por campo | Bacterias: Escasas / No significativas | Nitritos: Negativo.',
    referenceRange: 'Sedimento limpio, proteinuria negativa, glucosuria negativa',
    interpretation: 'Urianálisis dentro de la normalidad sin sedimento activo ni signos de infección urinaria.',
    isAbnormal: false,
  },
  {
    id: 'hosp-urocultivo',
    category: 'Laboratorio',
    subcategory: 'Microbiología / Serología',
    name: 'Urocultivo con recuento de colonias y antibiograma',
    result: 'Sin desarrollo bacteriano (< 1,000 UFC/mL a las 48 horas de incubación).',
    referenceRange: 'Negativo (< 10,000 UFC/mL)',
    interpretation: 'Descarta infección del tracto urinario bacteriana.',
    isAbnormal: false,
  },
  {
    id: 'hosp-coagulation',
    category: 'Laboratorio',
    subcategory: 'Hematología',
    name: 'Tiempos de coagulación (TP, TTPa, INR)',
    result: 'Tiempo de Protrombina (TP): 12.3 seg (Control: 12.0) | TTPa: 29.5 seg (Control: 30.0) | INR: 1.02 | Fibrinógeno: 320 mg/dL.',
    referenceRange: 'TP: 11-13.5 seg, TTPa: 25-35 seg, INR: 0.9-1.15',
    interpretation: 'Cascada de coagulación extrínseca e intrínseca conservadas.',
    isAbnormal: false,
  },
  {
    id: 'hosp-troponin-i',
    category: 'Laboratorio',
    subcategory: 'Cardiovascular',
    name: 'Troponina I de alta sensibilidad (hs-cTnI)',
    result: 'Troponina I: <0.01 ng/mL (Dentro de límites basales normales).',
    referenceRange: '<0.04 ng/mL',
    interpretation: 'Sin elevación de biomarcadores de necrosis miocárdica.',
    isAbnormal: false,
  },
  {
    id: 'hosp-ckmb',
    category: 'Laboratorio',
    subcategory: 'Cardiovascular',
    name: 'Fracción MB de Creatina Fosfoquinasa (CK-MB)',
    result: 'CK-MB masa: 13 U/L.',
    referenceRange: '0 - 25 U/L',
    interpretation: 'Enzima miocárdica dentro de rango fisiológico normal.',
    isAbnormal: false,
  },
  {
    id: 'hosp-dimer-d',
    category: 'Laboratorio',
    subcategory: 'Hematología',
    name: 'Dímero D cuantitativo',
    result: 'Dímero D: 210 ng/mL FEU.',
    referenceRange: '<500 ng/mL FEU',
    interpretation: 'Valores basales normales. Alto valor predictivo negativo para trombosis activa o CID.',
    isAbnormal: false,
  },
  {
    id: 'hosp-amylase-lipase',
    category: 'Laboratorio',
    subcategory: 'Bioquímica',
    name: 'Amilasa y Lipasa sérica',
    result: 'Amilasa sérica: 55 U/L | Lipasa sérica: 34 U/L.',
    referenceRange: 'Amilasa: 28-100 U/L, Lipasa: 13-60 U/L',
    interpretation: 'Enzimas pancreáticas dentro de parámetros normales sin indicios de pancreatitis.',
    isAbnormal: false,
  },
  {
    id: 'hosp-blood-cultures',
    category: 'Laboratorio',
    subcategory: 'Microbiología / Serología',
    name: 'Hemocultivos seriados pareados (2 tomas aerobio/anaerobio)',
    result: 'Frascos 1 y 2 incubados a 37°C: Sin desarrollo bacteriano ni fúngico a las 24 y 48 horas de incubación.',
    referenceRange: 'Negativo / Sin crecimiento bacteriano',
    interpretation: 'Cultivo de sangre periférica negativo preliminar.',
    isAbnormal: false,
  },
  {
    id: 'hosp-arboviral-panel',
    category: 'Laboratorio',
    subcategory: 'Microbiología / Serología',
    name: 'Panel de Serología e Inmunocromatografía Arboviral (Dengue NS1 / IgM / IgG)',
    result: 'Antígeno NS1: NO REACTIVO (Negativo) | Anticuerpos IgM: NEGATIVO | Anticuerpos IgG: NEGATIVO',
    referenceRange: 'Negativo / No reactivo',
    interpretation: 'Sin evidencia serológica de infección aguda reciente por virus Dengue ni otros flavivirus.',
    isAbnormal: false,
  },
  {
    id: 'hosp-malaria-smear',
    category: 'Laboratorio',
    subcategory: 'Microbiología / Serología',
    name: 'Gota Gruesa y Frotis de Sangre Periférica para Hemoparásitos (Malaria)',
    result: 'Frotis y gota gruesa examinados al microscopio: NEGATIVO para hemoparásitos. No se observan trofozoítos, esquizontes ni gametocitos de Plasmodium (P. falciparum, P. vivax).',
    referenceRange: 'Negativo (Ausencia de parásitos)',
    interpretation: 'Descarte de paludismo / malaria activa.',
    isAbnormal: false,
  },
  {
    id: 'hosp-leptospira-serology',
    category: 'Laboratorio',
    subcategory: 'Microbiología / Serología',
    name: 'Serología IgM para Leptospira (ELISA / MAT)',
    result: 'Título de anticuerpos IgM para Leptospira: <1:100 (No reactivo).',
    referenceRange: 'No reactivo (<1:100)',
    interpretation: 'Sin evidencia de leptospirosis activa.',
    isAbnormal: false,
  },
  {
    id: 'hosp-lumbar-puncture',
    category: 'Laboratorio',
    subcategory: 'Microbiología / Serología',
    name: 'Punción lumbar y análisis citoquímico y microbiológico de LCR',
    result: 'Aspecto: Cristal de roca límpido y transparente | Presión de apertura: 12 cmH2O | Leucocitos: 1 célula/mm³ (100% mononucleares) | Eritrocitos: 0/mm³ | Glucosa en LCR: 64 mg/dL (glucemia plasmática concomitante 96 mg/dL, relación 0.66) | Proteínas totales: 26 mg/dL | Tinción de Gram: Sin bacterias ni leucocitos polimorfonucleares.',
    referenceRange: 'Células: 0-5/mm³, Proteínas: 15-45 mg/dL, Glucosa: 60-70% de la glucemia central',
    interpretation: 'Líquido cefalorraquídeo normal sin inflamación meníngea.',
    isAbnormal: false,
  },
  {
    id: 'hosp-rx-torax',
    category: 'Imagen',
    subcategory: 'Radiología',
    name: 'Radiografía de tórax PA y lateral',
    result: 'Campos pulmonares adecuadamente expandidos y ventilados, sin consolidaciones alveolares, atelectasias ni infiltrados intersticiales. Ángulos costofrénicos y cardiofrénicos agudos y libres. Silueta cardiaca con índice cardiotorácico <0.50. Estructuras óseas torácicas íntegras.',
    referenceRange: 'Radiografía de tórax normal',
    interpretation: 'Estudio de tórax sin patología pleuropulmonar visible.',
    isAbnormal: false,
  },
  {
    id: 'hosp-rx-abdomen',
    category: 'Imagen',
    subcategory: 'Radiología',
    name: 'Radiografía simple de abdomen (Bipedestación y decúbito)',
    result: 'Distribución habitual del gas intestinal en marco cólico y cámara gástrica. Sin dilatación patológica de asas de intestino delgado (<3 cm) ni grueso (<6 cm). Ausencia de niveles hidroaéreos en escalera. Sin evidencia de neumoperitoneo (no hay aire libre bajo las cúpulas diafragmáticas). Sombras de psoas conservadas.',
    referenceRange: 'Patrón de gas abdominal fisiológico, sin niveles ni aire libre',
    interpretation: 'Radiografía simple de abdomen dentro de límites normales.',
    isAbnormal: false,
  },
  {
    id: 'hosp-us-abdomen',
    category: 'Imagen',
    subcategory: 'Ecografía',
    name: 'Ultrasonido abdominal y pélvico enfocado',
    result: 'Hígado de tamaño y ecotextura homogénea normal. Vesícula biliar de paredes delgadas (<3 mm) sin litiasis ni signos inflamatorios. Vía biliar intra y extrahepática de calibre normal. Bazo y páncreas sin alteraciones. Riñones simétricos con adecuada relación córtico-medular, sin hidronefrosis. Vejiga urinaria homogénea. No se observa líquido libre en espacio de Morrison, esplenorrenal ni fondo de saco.',
    referenceRange: 'Eco abdominal completo sin hallazgos patológicos',
    interpretation: 'Ecografía abdominal dentro de parámetros normales sin colecciones ni líquido libre.',
    isAbnormal: false,
  },
  {
    id: 'hosp-tac-torax',
    category: 'Imagen',
    subcategory: 'Tomografía',
    name: 'Tomografía computarizada (TAC / AngioTAC) de tórax con contraste',
    result: 'Parénquima pulmonar bien aireado sin consolidaciones, nódulos ni opacidades en vidrio deslustrado. Arterias pulmonares principales, lobares y segmentarias permeables sin defectos de repleción tromboembólicos. Mediastino centrado sin adenomegalias patológicas. Silueta cardíaca y aorta torácica de calibre normal. Sin derrame pleural ni pericárdico.',
    referenceRange: 'TAC / AngioTAC torácica dentro de límites normales',
    interpretation: 'Estudio tomográfico de tórax sin patología vascular ni parenquimatosa aguda.',
    isAbnormal: false,
  },
  {
    id: 'hosp-tac-abdomen',
    category: 'Imagen',
    subcategory: 'Tomografía',
    name: 'Tomografía computarizada (TAC) de abdomen y pelvis con contraste',
    result: 'Órganos sólidos intraabdominales (hígado, bazo, páncreas, suprarrenales y riñones) captan contraste de forma homogénea sin lesiones focales. Asas intestinales con grosor parietal normal y adecuada repleción. Apéndice cecal de calibre normal (<6 mm) sin cambios inflamatorios circundantes. Ausencia de neumoperitoneo, colecciones o adenopatías retroperitoneales.',
    referenceRange: 'TAC abdominopélvica dentro de límites normales',
    interpretation: 'Estudio tomográfico de abdomen sin alteraciones patológicas agudas.',
    isAbnormal: false,
  },
  {
    id: 'hosp-tac-cranio',
    category: 'Imagen',
    subcategory: 'Tomografía',
    name: 'Tomografía axial computarizada (TAC) simple de cráneo',
    result: 'Parénquima encefálico supratentorial e infratentorial con adecuada diferenciación de sustancia blanca y gris. Sin evidencia de hemorragias intra ni extraaxiales. Sin signos de isquemia territorial aguda reciente. Sistema ventricular de morfología y tamaño conservados, sin hidrocefalia. Cisternas basales permeables y simétricas. Sin desplazamiento de la línea media.',
    referenceRange: 'TAC simple de cráneo sin lesiones agudas',
    interpretation: 'Estudio de neuroimagen normal sin lesiones ocupantes de espacio ni hipertensión endocraneana evidente.',
    isAbnormal: false,
  },
  {
    id: 'hosp-rmn-craneo',
    category: 'Imagen',
    subcategory: 'Tomografía',
    name: 'Resonancia Magnética Nuclear (RMN) de encéfalo con difusión (DWI)',
    result: 'Secuencias T1, T2, FLAIR y DWI sin áreas de restricción a la difusión sugestivas de isquemia aguda. Sin lesiones ocupantes de espacio, sangrados ni realce leptomeníngeo patológico.',
    referenceRange: 'RMN cerebral sin alteraciones estructurales agudas',
    interpretation: 'Neuroimagen de alta resolución normal.',
    isAbnormal: false,
  },
  {
    id: 'hosp-ecg-12d',
    category: 'Gabinete y Trazados',
    subcategory: 'Electrocardiograma',
    name: 'Electrocardiograma estándar de 12 derivaciones (ECG)',
    result: 'Ritmo sinusal regular. Frecuencia cardíaca: 76 lpm. Onda P positiva en II, III y aVF (duración 90 ms). Intervalo PR: 150 ms. Eje eléctrico QRS: +45°. Complejos QRS de duración normal (80 ms). Segmento ST isoeléctrico en todas las derivaciones. Ondas T asimétricas y concordantes sin inversión isquémica. Intervalo QTc: 410 ms.',
    referenceRange: 'Trazado electrocardiográfico sinusal normal (60-100 lpm)',
    interpretation: 'ECG de 12 derivaciones dentro de límites fisiológicos normales.',
    isAbnormal: false,
  },
];

/**
 * Mapa de hallazgos anatómicos, gasométricos y bioquímicos relacionados por caso clínico
 * cuando se solicita un estudio secundario o de práctica clínica diaria.
 */
const RELATED_STUDY_OVERRIDES: Record<string, Record<string, Partial<ComplementaryStudy>>> = {
  'case-dengue-alarm': {
    'hosp-gasometria': {
      result: 'pH: 7.31 | PaCO₂: 31 mmHg | PaO₂: 88 mmHg | HCO₃⁻: 16.5 mEq/L | Lactato: 3.4 mmol/L | SaO₂: 96%.',
      interpretation: 'Acidosis metabólica hiperlactatémica leve-moderada por hipoperfusión tisular incipiente secundaria a extravasación plasmática.',
      isAbnormal: true,
    },
    'hosp-pcr-vsg': {
      result: 'Proteína C Reactiva (PCR): 28 mg/L (elevación leve-moderada) | VSG: 14 mm/h (normal/baja por hemoconcentración).',
      interpretation: 'Elevación discreta compatible con proceso viral agudo con compromiso endotelial (contrastando con PCR >100 mg/L típica de sepsis bacteriana).',
      isAbnormal: true,
    },
    'hosp-tac-abdomen': {
      result: 'Hepatomegalia homogénea leve (lóbulo derecho 16.4 cm) con edema periportal. Engrosamiento laminar edematoso de la pared vesicular (5.5 mm) con aspecto en "capas de cebolla", sin cálculos ni dilatación biliar. Escasa a moderada cantidad de líquido libre laminar (ascitis) en espacio hepatorrenal de Morrison, correderas parietocólicas y fondo de saco pélvico. En los cortes basales torácicos incluidos se evidencia derrame pleural laminar derecho.',
      interpretation: 'Hallazgos tomográficos clásicos de extravasación plasmática sistémica y serositis leve propios de la fase crítica viral; explica el dolor en hipocondrio derecho sin requerir cirugía biliar.',
      isAbnormal: true,
    },
    'hosp-tac-torax': {
      result: 'Derrame pleural bilateral de predominio derecho laminar a moderado con atelectasia pasiva subsegmentaria bibasal. Sin consolidaciones infecciosas lobares ni tromboembolismo pulmonar.',
      interpretation: 'Extravasación plasmática a cavidad pleural (serositis) coherente con síndrome de fuga capilar sistémica.',
      isAbnormal: true,
    },
    'hosp-coagulation': {
      result: 'TP: 14.3 seg (INR: 1.18) | TTPa: 41.2 seg (Control: 30.0 seg) | Fibrinógeno: 210 mg/dL.',
      interpretation: 'Prolongación moderada del TTPa e INR limítrofe con tendencia a consumo de factores y hepatopatía viral leve, lo que incrementa el riesgo hemorrágico ante AINEs o procedimientos invasivos.',
      isAbnormal: true,
    },
    'hosp-urinalysis-ego': {
      result: 'Densidad urinaria: 1.030 (elevada) | Aspecto: Ámbar concentrado | Proteínas: Trazas (+) | Cetonas: (+) | Sangre/Eritrocitos: 3-5 por campo (microhematuria leve) | Nitritos: Negativo.',
      interpretation: 'Orina altamente concentrada por hemoconcentración e hipovolemia intravascular, con proteinuria transitoria y microhematuria discreta.',
      isAbnormal: true,
    },
  },
  'case-apendicitis-aguda': {
    'hosp-gasometria': {
      result: 'pH: 7.42 | PaCO₂: 37 mmHg | PaO₂: 94 mmHg | HCO₃⁻: 23.5 mEq/L | Lactato: 1.5 mmol/L.',
      interpretation: 'Equilibrio ácido-base y lactato conservados; sin acidosis ni sepsis severa aún establecida.',
      isAbnormal: false,
    },
    'hosp-electrolitos': {
      result: 'Na⁺: 138 mEq/L | K⁺: 3.4 mEq/L (discretamente bajo por vómitos) | Cl⁻: 99 mEq/L.',
      interpretation: 'Hipokalemia leve secundaria a emesis e intolerancia oral; requiere reposición en hidratación parenteral prequirúrgica.',
      isAbnormal: true,
    },
    'hosp-tac-abdomen': {
      result: 'Apéndice cecal retrocecal/pélvico dilatado de 11 mm de diámetro externo, pared engrosada (4 mm) con hiperrealce mucoso tras contraste IV, presencia de apendicolito calcificado proximal de 5 mm, intensa estriación de la grasa mesentérica en fosa ilíaca derecha y múltiples ganglios mesentéricos reactivos (<10 mm). Sin colecciones abscedadas ni aire libre extraluminal.',
      interpretation: 'Tomografía con signos inequívocos de inflamación apendicular aguda no perforada y linfadenitis mesentérica reactiva.',
      isAbnormal: true,
    },
    'hosp-rx-abdomen': {
      result: 'Presencia de asa centinela discretamente distendida con nivel hidroaéreo aislado en fosa ilíaca derecha, imagen radioopaca sugestiva de coprolito en cuadrante inferior derecho y borramiento focal del borde inferior del músculo psoas derecho. Sin aire libre subdiafragmático.',
      interpretation: 'Signos radiológicos indirectos de íleo reflejo localizado en cuadrante inferior derecho secundario a proceso inflamatorio peritoneal focal.',
      isAbnormal: true,
    },
    'hosp-dimer-d': {
      result: 'Dímero D: 620 ng/mL FEU.',
      interpretation: 'Elevación leve inespecífica como reactante secundario a inflamación peritoneal aguda, sin significado tromboembólico primario.',
      isAbnormal: true,
    },
  },
  'case-iamcest-anterior': {
    'hosp-gasometria': {
      result: 'pH: 7.36 | PaCO₂: 34 mmHg | PaO₂: 68 mmHg | HCO₃⁻: 19.2 mEq/L | Lactato: 2.8 mmol/L | SaO₂: 92%.',
      interpretation: 'Hipoxemia arterial leve e hiperlactatemia inicial por congestión venocapilar pulmonar aguda y reducción del gasto cardíaco (Killip II).',
      isAbnormal: true,
    },
    'hosp-quimica-basica': {
      result: 'Glucosa sérica: 158 mg/dL (hiperglucemia por estrés adrenérgico) | Urea: 38 mg/dL | Creatinina: 1.15 mg/dL.',
      interpretation: 'Hiperglucemia reactiva al estrés coronario agudo (sin antecedente previo de diabetes) y función renal basal preservada.',
      isAbnormal: true,
    },
    'hosp-perfil-hepatico': {
      result: 'AST (TGO): 96 U/L (elevada de origen predominantemente miocárdico) | ALT (TGP): 34 U/L | Bilirrubina Total: 0.9 mg/dL | Albúmina: 4.0 g/dL.',
      interpretation: 'Elevación aislada de AST (TGO) por liberación enzimática desde miocito necrótico con ALT normal.',
      isAbnormal: true,
    },
    'hosp-ckmb': {
      result: 'CK-MB masa: 74 U/L (Índice CK-MB/CK total > 6%).',
      interpretation: 'Elevación significativa paralela a necrosis miocárdica aguda en evolución.',
      isAbnormal: true,
    },
    'hosp-tac-torax': {
      result: 'Cardiomegalia global leve. Extensas placas ateromatosas calcificadas en el segmento proximal de la arteria coronaria descendente anterior y tronco izquierdo. Edema intersticial septal perihiliar bilateral y leve derrame pleural laminar bilateral por congestión venocapilar pulmonar. Arterias pulmonares principales permeables sin tromboembolismo; aorta torácica con ateromatosis sin disección.',
      interpretation: 'Descarta disección aórtica y tromboembolia pulmonar, evidenciando cardiopatía ateroesclerótica calcificada y edema pulmonar incipiente (Killip II).',
      isAbnormal: true,
    },
    'hosp-tac-abdomen': {
      result: 'Congestión venosa pasiva hepática leve (dilatación discreta de venas suprahepáticas y vena cava inferior) secundaria a disfunción ventricular aguda. Ateromatosis calcificada de aorta abdominal y ramas ilíacas. Sin patología quirúrgica ni isquemia mesentérica.',
      interpretation: 'Hallazgos abdominales secundarios a repercusión hemodinámica retrógrada y enfermedad aterosclerótica sistémica.',
      isAbnormal: true,
    },
    'hosp-urinalysis-ego': {
      result: 'Color amarillo oscuro | Densidad 1.024 | Proteínas: Trazas | Sedimento limpio sin infección.',
      interpretation: 'Concentración urinaria secundaria a descarga adrenérgica y respuesta neurohormonal al bajo gasto cardíaco.',
      isAbnormal: false,
    },
  },
  'case-cetoacidosis-diabetica': {
    'hosp-hemograma': {
      result: 'Leucocitos: 15,800 /mm³ (Neutrófilos 78% sin cayados) | Hemoglobina: 15.6 g/dL | Hematocrito: 47.0% | Plaquetas: 310,000 /mm³.',
      interpretation: 'Leucocitosis reactiva moderada secundaria a descarga adrenérgica/cortisol en cetoacidosis (frecuente incluso sin infección bacteriana severa) y hemoconcentración por deshidratación severa.',
      isAbnormal: true,
    },
    'hosp-tac-abdomen': {
      result: 'Distensión hidroaérea leve difusa de cámara gástrica y asas de intestino delgado por íleo metabólico funcional, sin punto de transición mecánica. Riñones aumentados discretamente de volumen con hipercaptación cortical simétrica secundaria a diuresis osmótica intensa. Apéndice normal, páncreas homogéneo sin necrosis ni colecciones.',
      interpretation: 'Íleo adinámico metabólico (que explica el dolor abdominal agudo o "pseudoperitonitis") descartando abdomen quirúrgico verdadero como apendicitis o pancreatitis.',
      isAbnormal: true,
    },
    'hosp-amylase-lipase': {
      result: 'Amilasa sérica: 158 U/L (discretamente elevada) | Lipasa sérica: 38 U/L (normal).',
      interpretation: 'Hiperamilasemia leve inespecífica frecuente en deshidratación y acidosis metabólica severa (aclaramiento renal reducido y origen salival/metabólico) con lipasa normal que descarta pancreatitis aguda.',
      isAbnormal: true,
    },
    'hosp-rx-torax': {
      result: 'Campos pulmonares hiperventilados con volúmenes pulmonares amplios secundarios a taquipnea/polipnea compensatoria profunda, sin consolidaciones ni neumotórax.',
      interpretation: 'Descarta foco infeccioso neumónico grave en lóbulos pulmonares, compatible con hiperventilación compensatoria de acidosis metabólica.',
      isAbnormal: false,
    },
  },
  'case-meningitis-bacteriana': {
    'hosp-gasometria': {
      result: 'pH: 7.29 | PaCO₂: 29 mmHg | PaO₂: 84 mmHg | HCO₃⁻: 15.0 mEq/L | Lactato: 3.9 mmol/L.',
      interpretation: 'Acidosis metabólica con hiperlactatemia significativa indicativa de sepsis bacteriana sistémica.',
      isAbnormal: true,
    },
    'hosp-electrolitos': {
      result: 'Na⁺: 131 mEq/L (hiponatremia leve por SIADH) | K⁺: 3.7 mEq/L | Cl⁻: 96 mEq/L | Calcio: 8.4 mg/dL.',
      interpretation: 'Hiponatremia leve frecuente por secreción inadecuada de hormona antidiurética (SIADH) asociada a inflamación meníngea.',
      isAbnormal: true,
    },
    'hosp-tac-cranio': {
      result: 'Edema cerebral difuso leve manifestado por discreto borramiento de los surcos corticales de la convexidad cerebral y leve compresión de las astas frontales ventriculares, manteniendo cisternas basales visibles y permeables sin herniación ni desplazamiento de línea media. Ocupación inflamatoria mucosa de celdillas etmoidales y seno esfenoidal izquierdo (probable foco contiguo de vía aérea superior). Sin hemorragias ni abscesos.',
      interpretation: 'Edema cerebral incipiente y sinusitis paranasal asociada como puerta de entrada; confirma ausencia de efecto de masa que contraindique punción lumbar inmediata.',
      isAbnormal: true,
    },
    'hosp-rmn-craneo': {
      result: 'Realce leptomeníngeo difuso tras gadolinio en surcos de la convexidad bilateral y ocupación mucosa esfenoetmoidal; sin trombosis de senos venosos ni absceso cerebral parenquimatoso.',
      interpretation: 'Confirma inflamación leptomeníngea difusa y descarta empiema o infarto venoso.',
      isAbnormal: true,
    },
    'hosp-coagulation': {
      result: 'TP: 15.1 seg (INR: 1.28) | TTPa: 38.4 seg | Fibrinógeno: 185 mg/dL.',
      interpretation: 'Coagulopatía de consumo incipiente asociada a bacteriemia e injuria endotelial sistémica.',
      isAbnormal: true,
    },
    'hosp-dimer-d': {
      result: 'Dímero D: 1,420 ng/mL FEU.',
      interpretation: 'Elevación marcada por activación endotelial inflamatoria sistémica y riesgo de coagulación intravascular diseminada temprana (relacionado con las petequias cutáneas).',
      isAbnormal: true,
    },
  },
  'case-neumonia-adquirida': {
    'hosp-pcr-vsg': {
      result: 'Proteína C Reactiva (PCR): 194 mg/L (marcadamente elevada) | VSG: 68 mm/h.',
      interpretation: 'Elevación severa característica de infección bacteriana invasiva parenquimatosa.',
      isAbnormal: true,
    },
    'hosp-electrolitos': {
      result: 'Na⁺: 132 mEq/L (hiponatremia leve) | K⁺: 4.0 mEq/L | Cl⁻: 97 mEq/L.',
      interpretation: 'Hiponatremia leve frecuente en neumonía lobar neumocócica por liberación no osmótica de ADH.',
      isAbnormal: true,
    },
    'hosp-tac-torax': {
      result: 'Consolidación alveolar densa y extensa del lóbulo inferior derecho con signo de broncograma aéreo prominente, nódulos centrolobulillares satélites "en árbol en brote" en lóbulo medio y derrame pleural paraneumónico derecho libre laminar (8 mm). Enfisema centrolobulillar leve apical bilateral acorde a antecedente tabáquico.',
      interpretation: 'Confirma neumonía lobar derecha extensa con derrame paraneumónico no loculado sobre pulmón con cambios enfisematosos crónicos.',
      isAbnormal: true,
    },
    'hosp-tac-abdomen': {
      result: 'En los cortes torácicos inferiores se identifica consolidación basal derecha y derrame pleural ipsilateral que irrita el hemidiafragma derecho. Órganos abdominales (hígado, vesícula, páncreas y apéndice) sin alteraciones agudas, descartando foco infeccioso intraabdominal.',
      interpretation: 'Explica el dolor referido hacia hipocondrio/flanco derecho por irritación pleural diafragmática basal.',
      isAbnormal: true,
    },
    'hosp-dimer-d': {
      result: 'Dímero D: 840 ng/mL FEU.',
      interpretation: 'Elevación reactiva moderada secundaria a proceso infeccioso pulmonar severo e inflamación sistémica (reactante inespecífico; no confirma TEP por sí solo).',
      isAbnormal: true,
    },
    'hosp-troponin-i': {
      result: 'Troponina I: 0.048 ng/mL (discretamente limítrofe).',
      interpretation: 'Injuria miocárdica aguda leve tipo 2 secundaria al estrés hipóxico, fiebre y taquicardia en paciente anciana; sin patrón isquémico coronario agudo.',
      isAbnormal: true,
    },
  },
  'case-pancreatitis-gastro': {
    'hosp-gasometria': {
      result: 'pH: 7.35 | PaCO₂: 33 mmHg | PaO₂: 76 mmHg | HCO₃⁻: 18.8 mEq/L | Lactato: 2.4 mmol/L.',
      interpretation: 'Acidosis metabólica leve e hipoxemia discreta por secuestro de líquidos en tercer espacio y atelectasia basal reactiva.',
      isAbnormal: true,
    },
    'hosp-electrolitos': {
      result: 'Na⁺: 136 mEq/L | K⁺: 3.6 mEq/L | Calcio sérico total: 7.8 mg/dL (hipocalcemia leve) | Magnesio: 1.6 mg/dL.',
      interpretation: 'Hipocalcemia leve característica de pancreatitis aguda por saponificación del calcio con ácidos grasos libres en necrosis grasa peripancreática.',
      isAbnormal: true,
    },
    'hosp-tac-abdomen': {
      result: 'Páncreas aumentado difusamente de tamaño con bordes mal definidos, disminución heterogénea del realce parenquimatoso y extensa estriación inflamatoria de la grasa peripancreática con colección líquida laminar en espacio pararrenal anterior izquierdo (Índice Balthazar Grado C-D). Vesícula biliar con múltiples imágenes litiásicas hiperdensas en su interior y dilatación leve del colédoco distal (8 mm).',
      interpretation: 'Hallazgos tomográficos compatibles con inflamación pancreática aguda moderada-severa de origen litiásico biliar sin necrosis parenquimatosa extensa aún establecida.',
      isAbnormal: true,
    },
    'hosp-rx-torax': {
      result: 'Elevación discreta del hemidiafragma izquierdo, atelectasia laminar basal izquierda y mínimo derrame pleural izquierdo reactivo.',
      interpretation: 'Complicación pleuropulmonar simpática frecuente por contigüidad inflamatoria subdiafragmática izquierda.',
      isAbnormal: true,
    },
  },
  'case-pediatria-bronquiolitis': {
    'hosp-gasometria': {
      result: 'pH: 7.33 | PaCO₂: 47 mmHg | PaO₂: 62 mmHg | HCO₃⁻: 24.5 mEq/L | Lactato: 1.9 mmol/L | SaO₂: 89%.',
      interpretation: 'Hipoxemia e hipercapnia incipiente (acidosis respiratoria leve) que señala fatiga ventilatoria y necesidad inmediata de oxígeno húmedo / alto flujo.',
      isAbnormal: true,
    },
    'hosp-rx-torax': {
      result: 'Hiperinsuflación pulmonar bilateral (horizontalización de arcos costales y abatimiento diafragmático, 9 espacios intercostales visibles), engrosamiento peribronquial parahiliar bilateral y pequeña atelectasia subsegmentaria en lóbulo superior derecho por tapón mucoso.',
      interpretation: 'Atrapamiento aéreo y atelectasia subsegmentaria típicos de obstrucción bronquiolar viral aguda en lactantes.',
      isAbnormal: true,
    },
    'hosp-tac-torax': {
      result: 'Patrón en mosaico por atrapamiento aéreo difuso bilateral, engrosamiento difuso de paredes bronquiolares y tapones mucosos periféricos en lóbulo superior derecho.',
      interpretation: 'Confirma compromiso bronquiolar viral difuso (Nota clínica: en lactantes la TAC no es de rutina por radiación, reservándose solo para dudas o complicaciones graves).',
      isAbnormal: true,
    },
  },
  'case-nefrologia-lra': {
    'hosp-hemograma': {
      result: 'Leucocitos: 7,900 /mm³ | Hemoglobina: 10.6 g/dL (normocítica normocrómica leve) | Hematocrito: 32.1% | Plaquetas: 220,000 /mm³.',
      interpretation: 'Anemia normocítica leve compatible con vulnerabilidad renal previa/enfermedad crónica subyacente.',
      isAbnormal: true,
    },
    'hosp-gasometria': {
      result: 'pH: 7.26 | PaCO₂: 28 mmHg | PaO₂: 86 mmHg | HCO₃⁻: 13.5 mEq/L | Lactato: 1.6 mmol/L.',
      interpretation: 'Acidosis metabólica moderada-severa por incapacidad renal de excretar ácidos fijos e hiperpotasemia acompañante.',
      isAbnormal: true,
    },
    'hosp-us-abdomen': {
      result: 'Ambos riñones de tamaño conservado (10.2 cm) con incremento difuso de la ecogenicidad cortical bilateral y pérdida parcial de la diferenciación corticomedular. Ausencia de dilatación pielocalicial ni litiasis obstructiva. Vena cava inferior pletórica (>2.2 cm sin colapso inspiratorio) y discreta congestión venosa hepática.',
      interpretation: 'Descarta uropatía obstructiva; evidencia daño parenquimatoso renal agudo/agudizado y sobrecarga hídrica intravascular.',
      isAbnormal: true,
    },
    'hosp-tac-abdomen': {
      result: 'Riñones con nefrograma cortical tardío simétrico y ausencia de obstrucción ureteral o hidronefrosis. Escaso líquido libre laminar pélvico y derrame pleural basal bilateral incipiente por retención hidrosalina.',
      interpretation: 'Refuerza nefropatía parenquimatosa bilateral no obstructiva con signos incipientes de sobrecarga de volumen.',
      isAbnormal: true,
    },
    'hosp-rx-torax': {
      result: 'Redistribución de flujo vascular hacia lóbulos superiores, cardiomegalia leve y borramiento de ángulos costofrénicos por derrame pleural laminar bilateral.',
      interpretation: 'Signos tempranos de congestión vascular pulmonar secundaria a oliguria/retención hídrica.',
      isAbnormal: true,
    },
  },
  'case-ginecologia-ectopico': {
    'hosp-gasometria': {
      result: 'pH: 7.28 | PaCO₂: 29 mmHg | PaO₂: 91 mmHg | HCO₃⁻: 14.5 mEq/L | Lactato: 4.2 mmol/L.',
      interpretation: 'Acidosis metabólica láctica por hipoperfusión secundaria a hemorragia interna aguda (choque hipovolémico).',
      isAbnormal: true,
    },
    'hosp-tac-abdomen': {
      result: 'Abundante líquido libre de alta atenuación (45-60 Unidades Hounsfield, compatible con sangre aguda/hemoperitoneo) distribuido en fondo de saco de Douglas, gotieras parietocólicas y espacio hepatorrenal de Morrison. En pelvis derecha se identifica masa anexial heterogénea compleja con realce periférico y útero vacío de tamaño normal.',
      interpretation: 'Confirma hemoperitoneo activo moderado-severo secundario a patología anexial derecha rota; exige intervención quirúrgica inmediata.',
      isAbnormal: true,
    },
    'hosp-coagulation': {
      result: 'TP: 13.8 seg | TTPa: 33.5 seg | Fibrinógeno: 175 mg/dL (limítrofe bajo por consumo agudo en sangrado cavitario).',
      interpretation: 'Fibrinógeno en descenso progresivo secundario a hemorragia interna activa; requiere tipificación y reserva de hemoderivados.',
      isAbnormal: true,
    },
  },
  'case-traumatologia-compartimental': {
    'hosp-gasometria': {
      result: 'pH: 7.34 | PaCO₂: 35 mmHg | PaO₂: 92 mmHg | HCO₃⁻: 19.0 mEq/L | Lactato: 3.1 mmol/L.',
      interpretation: 'Hiperlactatemia moderada secundaria a metabolismo anaerobio por isquemia muscular compartimental.',
      isAbnormal: true,
    },
    'hosp-electrolitos': {
      result: 'Na⁺: 138 mEq/L | K⁺: 5.4 mEq/L (hiperpotasemia leve incipiente) | Calcio: 8.3 mg/dL | Fósforo: 5.1 mg/dL.',
      interpretation: 'Elevación incipiente de potasio y fósforo por lisis de miocitos isquémicos (rabdomiólisis); vigilar arritmias al descomprimir el compartimento.',
      isAbnormal: true,
    },
    'hosp-urinalysis-ego': {
      result: 'Color: Rojizo-café oscuro ("agua de lavado de carne") | Tira reactiva para Sangre/Hemo: POSITIVO (+++) | Microscopía de sedimento: 0-1 eritrocitos por campo (discordancia hemo/eritrocitos). Proteínas: (+).',
      interpretation: 'Mioglobinuria severa secundaria a rabdomiólisis por isquemia y necrosis muscular progresiva (alerta riesgo inminente de necrosis tubular aguda renal).',
      isAbnormal: true,
    },
    'hosp-dimer-d': {
      result: 'Dímero D: 980 ng/mL FEU.',
      interpretation: 'Elevación secundaria al trauma tisular extenso y estasis venosa compresiva de la extremidad; debe diferenciarse clínicamente de trombosis venosa profunda.',
      isAbnormal: true,
    },
    'hosp-coagulation': {
      result: 'TP: 13.0 seg | TTPa: 31.0 seg | Fibrinógeno: 390 mg/dL (reactante de fase aguda post-trauma).',
      interpretation: 'Parámetros prequirúrgicos basales aptos para fasciotomía descompresiva urgente.',
      isAbnormal: false,
    },
  },
  'case-dermatologia-stevens-johnson': {
    'hosp-hemograma': {
      result: 'Leucocitos: 11,800 /mm³ (Linfocitosis reactiva 42%, eosinófilos 7%) | Hemoglobina: 13.5 g/dL | Plaquetas: 265,000 /mm³.',
      interpretation: 'Leucocitosis reactiva con eosinofilia leve compatible con reacción de hipersensibilidad farmacológica severa.',
      isAbnormal: true,
    },
    'hosp-perfil-hepatico': {
      result: 'AST (TGO): 64 U/L | ALT (TGP): 72 U/L | Bilirrubina Total: 1.0 mg/dL | Albúmina: 3.3 g/dL.',
      interpretation: 'Discreta elevación de transaminasas e hipoalbuminemia leve por reacción sistémica medicamentosa y pérdida epidérmica.',
      isAbnormal: true,
    },
    'hosp-rx-torax': {
      result: 'Infiltrado intersticial reticular fino peribroncovascular bilateral incipiente sin consolidación franca ni derrame.',
      interpretation: 'Vigilancia obligada: puede reflejar compromiso inflamatorio incipiente de mucosa traqueobronquial asociado a reacción mucocutánea severa.',
      isAbnormal: true,
    },
    'hosp-urinalysis-ego': {
      result: 'Densidad 1.026 | Leucocitos: 10-15 por campo | Eritrocitos: 4-6 por campo | Nitritos: Negativo | Bacterias: Ausentes.',
      interpretation: 'Leucocituria estéril e irritación uretral compatibles con afectación descamativa de mucosas urogenitales.',
      isAbnormal: true,
    },
  },
  'case-psiquiatria-serotoninergico': {
    'hosp-gasometria': {
      result: 'pH: 7.33 | PaCO₂: 32 mmHg | PaO₂: 90 mmHg | HCO₃⁻: 17.5 mEq/L | Lactato: 2.9 mmol/L.',
      interpretation: 'Acidosis láctica leve por hiperactividad muscular sostenida, diaforesis y clonus neuromuscular.',
      isAbnormal: true,
    },
    'hosp-tac-cranio': {
      result: 'Parénquima encefálico sin hemorragia, infarto agudo ni lesiones ocupantes de espacio. Sistema ventricular y cisternas basales normales.',
      interpretation: 'Descarta lesión estructural intracraneal aguda como causa de la agitación, hiperreflexia y clonus.',
      isAbnormal: false,
    },
    'hosp-ecg-12d': {
      result: 'Taquicardia sinusal marcada a 128 lpm. Eje normal. Intervalo QTc discretamente prolongado (465 ms) por efecto farmacológico serotoninérgico; sin supradesnivel del ST.',
      interpretation: 'Taquicardia autonómica y prolongación limítrofe del QTc que exige monitorización telemétrica y evitar fármacos que prolonguen el QT.',
      isAbnormal: true,
    },
    'hosp-urinalysis-ego': {
      result: 'Tira reactiva Sangre/Hemo: (++) | Microscopía: 1-2 eritrocitos/campo | Densidad 1.028.',
      interpretation: 'Mioglobinuria incipiente secundaria a contracción muscular sostenida e hipertermia por clonus muscular.',
      isAbnormal: true,
    },
  },
  'case-medicina-interna-tep': {
    'hosp-hemograma': {
      result: 'Leucocitos: 11,400 /mm³ | Hemoglobina: 13.4 g/dL | Plaquetas: 290,000 /mm³.',
      interpretation: 'Leucocitosis reactiva discreta secundaria a infarto pulmonar e inflamación aguda (previo a anticoagulación).',
      isAbnormal: true,
    },
    'hosp-gasometria': {
      result: 'pH: 7.49 | PaCO₂: 27 mmHg | PaO₂: 58 mmHg | HCO₃⁻: 20.5 mEq/L | SaO₂: 88% | Lactato: 2.3 mmol/L.',
      interpretation: 'Alcalosis respiratoria aguda con hipoxemia marcada y gradiente alvéolo-arterial ampliado por alteración grave de la relación ventilación/perfusión (V/Q).',
      isAbnormal: true,
    },
    'hosp-tac-torax': {
      result: 'AngioTAC pulmonar: Defectos de repleción intraluminales centrales en silla de montar extendidos hacia ambas arterias pulmonares principales y ramas lobares inferiores. Aumento de tamaño del ventrículo derecho (relación VD/VI = 1.28) con abombamiento del septum interventricular hacia la izquierda y opacidad periférica en cuña pleural en base pulmonar derecha (infarto pulmonar / joroba de Hampton).',
      interpretation: 'Estudio confirmatorio de tromboembolia pulmonar bilateral con sobrecarga aguda de cavidades derechas.',
      isAbnormal: true,
    },
    'hosp-rx-torax': {
      result: 'Oligohemia focal relativa en campo pulmonar medio derecho (signo de Westermark), prominencia del tronco arterial pulmonar derecho (signo de Fleischner) y opacidad triangular periférica basal derecha con discreto derrame laminar.',
      interpretation: 'Signos radiográficos indirectos altamente sugestivos de tromboembolismo e infarto pulmonar periférico.',
      isAbnormal: true,
    },
    'hosp-troponin-i': {
      result: 'Troponina I: 0.14 ng/mL (Discretamente elevada).',
      interpretation: 'Microinjuria miocárdica por distensión y sobrecarga aguda de presión del ventrículo derecho (marcador de riesgo intermedio-alto).',
      isAbnormal: true,
    },
  },
  'case-urgencias-anafilaxia': {
    'hosp-hemograma': {
      result: 'Leucocitos: 13,100 /mm³ (Neutrófilos 74%) | Hemoglobina: 15.2 g/dL | Hematocrito: 45.8% (hemoconcentración por vasodilatación y fuga capilar).',
      interpretation: 'Hemoconcentración aguda secundaria a incremento brusco de permeabilidad vascular durante choque anafiláctico.',
      isAbnormal: true,
    },
    'hosp-gasometria': {
      result: 'pH: 7.25 | PaCO₂: 46 mmHg | PaO₂: 60 mmHg | HCO₃⁻: 19.2 mEq/L | Lactato: 4.5 mmol/L.',
      interpretation: 'Acidosis mixta (láctica por choque distributivo + retención incipiente de CO₂ por broncoespasmo severo) e hipoxemia crítica.',
      isAbnormal: true,
    },
    'hosp-rx-torax': {
      result: 'Hiperinsuflación pulmonar aguda bilateral por atrapamiento aéreo secundario a broncoespasmo severo, sin consolidaciones ni neumotórax.',
      interpretation: 'Atrapamiento aéreo por obstrucción aguda difusa de la vía aérea inferior.',
      isAbnormal: true,
    },
    'hosp-ecg-12d': {
      result: 'Taquicardia sinusal compensatoria a 134 lpm. Onda T ligeramente aplanada en cara lateral sin elevación del ST; vigilar riesgo de vasoespasmo coronario alérgico (Síndrome de Kounis).',
      interpretation: 'Taquicardia compensatoria al choque distributivo vasodilatador.',
      isAbnormal: true,
    },
  },
};

/**
 * Inferencia dinámica fisiopatológica de hallazgos relacionados para cualquier caso (incluyendo casos generados por IA)
 * cuando se solicita un estudio secundario o de práctica diaria que no vino definido explícitamente.
 */
function inferDynamicRelatedStudy(stdStudy: ComplementaryStudy, cCase: ClinicalCase): ComplementaryStudy {
  const diag = (cCase.solution?.correctDiagnosis || '').toLowerCase();
  const illness = (cCase.patientInfo?.currentIllness || '').toLowerCase();
  const vitals = cCase.vitalSigns;
  const spec = cCase.specialty;
  const textPool = `${diag} ${illness}`;

  const isFebrileOrSepsis = vitals.temperature >= 38.0 || /sepsis|infecc|bacter|mening|neumon|pielonefr|absceso|colangit|peritonit/.test(textPool);
  const isHypoxic = vitals.oxygenSaturation <= 93 || /neumon|edema|epoc|asma|tromboembol|derrame|bronquiolit|insuficiencia respiratoria/.test(textPool);
  const isShockOrDehydrated = parseInt(vitals.bloodPressure.split('/')[0] || '120', 10) <= 95 || vitals.heartRate >= 110 || /choque|shock|hemorrag|deshidrat|cetoacidosis|ectopico/.test(textPool);
  const isAbdominalAcute = spec === 'cirugia_general' || spec === 'gastroenterologia' || /apendic|colecist|pancreat|diverticul|obstruc|perforac|ectopico|isquemia mesent/.test(textPool);
  const isCardiac = spec === 'cardiologia' || /infarto|angina|insuficiencia cardiaca|pericardit|miocardit|arritmia|fibrilacion/.test(textPool);
  const isNeuro = spec === 'neurologia' || /evc|ictus|acv|hemorragia|meningit|encefal|convuls|status/.test(textPool);
  const isRenal = spec === 'nefrologia' || /renal|pielonefrit|nefrit|nefrot|hidronefros|hiperpotasemia|rabdomiolisis/.test(textPool);

  // β-hCG en varones o mayores de 55 años
  if (stdStudy.id === 'hosp-bhcg') {
    if (cCase.patientInfo.sex === 'Masculino') {
      return {
        ...stdStudy,
        result: 'Estudio no aplicable en paciente de sexo masculino (β-hCG < 1.0 mUI/mL).',
        interpretation: 'No corresponde a paciente masculino.',
        isAbnormal: false,
      };
    }
    if (cCase.patientInfo.age >= 55) {
      return {
        ...stdStudy,
        result: 'β-hCG sérica: < 2.0 mUI/mL (Negativo; paciente en edad posmenopáusica).',
        interpretation: 'Negativo para embarazo.',
        isAbnormal: false,
      };
    }
  }

  // Gasometría arterial dinámica según oxigenación, perfusión o acidosis
  if (stdStudy.id === 'hosp-gasometria') {
    if (isHypoxic && isShockOrDehydrated) {
      return {
        ...stdStudy,
        result: `pH: 7.29 | PaCO₂: 33 mmHg | PaO₂: 61 mmHg | HCO₃⁻: 16.0 mEq/L | SaO₂: ${vitals.oxygenSaturation}% | Lactato: 3.6 mmol/L.`,
        interpretation: 'Hipoxemia arterial e hiperlactatemia con acidosis metabólica por compromiso cardiorrespiratorio y de perfusión tisular.',
        isAbnormal: true,
      };
    }
    if (isHypoxic) {
      return {
        ...stdStudy,
        result: `pH: 7.46 | PaCO₂: 30 mmHg | PaO₂: 62 mmHg | HCO₃⁻: 21.5 mEq/L | SaO₂: ${vitals.oxygenSaturation}% | Lactato: 1.8 mmol/L.`,
        interpretation: 'Alcalosis respiratoria por taquipnea con hipoxemia arterial concordante con la saturación clínica.',
        isAbnormal: true,
      };
    }
    if (isShockOrDehydrated || isRenal) {
      return {
        ...stdStudy,
        result: 'pH: 7.30 | PaCO₂: 30 mmHg | PaO₂: 89 mmHg | HCO₃⁻: 15.5 mEq/L | Lactato: 3.2 mmol/L.',
        interpretation: 'Acidosis metabólica compensada parcialmente con hiperlactatemia por hipoperfusión o disfunción metabólica/renal.',
        isAbnormal: true,
      };
    }
  }

  // PCR y VSG en infecciones, abdomen agudo o isquemia
  if (stdStudy.id === 'hosp-pcr-vsg' && (isFebrileOrSepsis || isAbdominalAcute || isCardiac)) {
    return {
      ...stdStudy,
      result: `Proteína C Reactiva (PCR): ${isFebrileOrSepsis ? '145 mg/L' : '48 mg/L'} | VSG: ${isFebrileOrSepsis ? '54 mm/h' : '32 mm/h'}.`,
      interpretation: 'Elevación de reactantes de fase aguda acorde con proceso inflamatorio o infeccioso activo.',
      isAbnormal: true,
    };
  }

  // Química sanguínea cuando hay hiperglucemia capilar o deshidratación
  if (stdStudy.id === 'hosp-quimica-basica') {
    if ((vitals.bloodGlucose && vitals.bloodGlucose >= 180) || isShockOrDehydrated || isRenal) {
      const glu = vitals.bloodGlucose || (isShockOrDehydrated ? 142 : 98);
      const cr = isRenal ? '2.9 mg/dL' : isShockOrDehydrated ? '1.45 mg/dL' : '0.95 mg/dL';
      const urea = isRenal ? '86 mg/dL' : isShockOrDehydrated ? '52 mg/dL' : '30 mg/dL';
      return {
        ...stdStudy,
        result: `Glucosa sérica: ${glu} mg/dL | Urea: ${urea} | Creatinina sérica: ${cr}.`,
        interpretation: isRenal
          ? 'Azoados francamente elevados por deterioro de la tasa de filtración glomerular.'
          : 'Azoados discretamente elevados por componente prerrenal/hipovolemia y respuesta metabólica al estrés.',
        isAbnormal: true,
      };
    }
  }

  // TAC Abdomen
  if (stdStudy.id === 'hosp-tac-abdomen') {
    if (isAbdominalAcute) {
      return {
        ...stdStudy,
        result: `Estriación inflamatoria focal de la grasa mesentérica/perivisceral acorde al cuadrante sintomático, ganglios mesentéricos reactivos (<12 mm) y discreta cantidad de líquido libre laminar en fondo de saco o corredera parietocólica. Sin signos incidentales contradictorios.`,
        interpretation: `Hallazgos tomográficos inflamatorios e indirectos consistentes con el proceso agudo abdominopélvico del paciente (${cCase.solution?.correctDiagnosis || 'patología visceral aguda'}).`,
        isAbnormal: true,
      };
    }
    if (isCardiac) {
      return {
        ...stdStudy,
        result: 'Congestión venosa pasiva hepática discreta con dilatación leve de vena cava inferior y suprahepáticas. Ateromatosis aórtica calcificada acorde a perfil cardiovascular. Sin foco quirúrgico abdominal.',
        interpretation: 'Repercusión hemodinámica venosa retrógrada y enfermedad vascular sistémica sin patología abdominal primaria.',
        isAbnormal: true,
      };
    }
    if (isFebrileOrSepsis) {
      return {
        ...stdStudy,
        result: 'Esplenomegalia reactiva limítrofe e hígado de tamaño conservado sin abscesos ni colecciones organizadas. Adenopatías reactivas inespecíficas de pequeño tamaño.',
        interpretation: 'Cambios reactivos sistémicos propios de respuesta inflamatoria/infecciosa aguda, sin foco quirúrgico abdominal.',
        isAbnormal: true,
      };
    }
  }

  // TAC / AngioTAC de Tórax
  if (stdStudy.id === 'hosp-tac-torax') {
    if (isHypoxic || spec === 'neumologia') {
      return {
        ...stdStudy,
        result: 'Opacidades parenquimatosas en vidrio deslustrado / infiltrados alveolares focales en bases pulmonares acompañados de derrame pleural laminar reactivo. Árbol vascular pulmonar principal permeable.',
        interpretation: 'Compromiso pleuropulmonar coherente con la alteración del intercambio gaseoso y oxigenación del paciente.',
        isAbnormal: true,
      };
    }
    if (isCardiac) {
      return {
        ...stdStudy,
        result: 'Cardiomegalia leve, calcificaciones ateromatosas coronarias y engrosamiento septal intersticial perihiliar por congestión venosa pulmonar incipiente.',
        interpretation: 'Signos tomográficos torácicos relacionados con cardiopatía isquémica o congestiva del caso.',
        isAbnormal: true,
      };
    }
  }

  // TAC Cráneo
  if (stdStudy.id === 'hosp-tac-cranio' && isNeuro) {
    return {
      ...stdStudy,
      result: 'Cambios estructurales/edematosos leves relacionados con la agresión neurológica aguda (borramiento discreto de surcos o cambios isquémicos/inflamatorios tempranos), sin efecto de masa catastrófico no concordante.',
      interpretation: 'Neuroimagen con hallazgos secundarios relacionados con la patología del sistema nervioso central en curso.',
      isAbnormal: true,
    };
  }

  // Rx Tórax
  if (stdStudy.id === 'hosp-rx-torax') {
    if (isHypoxic) {
      return {
        ...stdStudy,
        result: 'Aumento de la trama broncovascular bibasal, infiltrados intersticio-alveolares o borramiento laminar de seno costofrénico acorde al compromiso respiratorio.',
        interpretation: 'Hallazgos radiológicos pleuropulmonares relacionados con la hipoxemia clínica.',
        isAbnormal: true,
      };
    }
    if (isAbdominalAcute) {
      return {
        ...stdStudy,
        result: 'Elevación leve de hemidiafragma con atelectasia laminar basal reactiva secundaria a dolor e hipoventilación abdominal; sin neumoperitoneo subdiafragmático.',
        interpretation: 'Cambios basales pulmonares reactivos a patología abdominal aguda.',
        isAbnormal: true,
      };
    }
  }

  // US Abdominal
  if (stdStudy.id === 'hosp-us-abdomen') {
    if (isRenal) {
      return {
        ...stdStudy,
        result: 'Incremento discreto de la ecogenicidad cortical renal bilateral compatible con nefropatía parenquimatosa; sin litiasis obstructiva evidente.',
        interpretation: 'Cambios ecográficos renales relacionados con la disfunción renal del caso.',
        isAbnormal: true,
      };
    }
    if (isAbdominalAcute || isShockOrDehydrated) {
      return {
        ...stdStudy,
        result: 'Escaso líquido libre laminar en fondo de saco o espacio de Morrison y distensión discreta de asas con peristaltismo disminuido.',
        interpretation: 'Hallazgos ecográficos indirectos de irritación peritoneal o tercer espacio inflamatorio.',
        isAbnormal: true,
      };
    }
  }

  // ECG coherente con taquicardia / bradicardia
  if (stdStudy.id === 'hosp-ecg-12d') {
    if (vitals.heartRate >= 105) {
      return {
        ...stdStudy,
        result: `Taquicardia sinusal regular a ${vitals.heartRate} lpm. Eje QRS conservado. Segmento ST isoeléctrico sin supradesnivel agudo.`,
        interpretation: `Taquicardia sinusal compensatoria concordante con la frecuencia cardíaca del paciente (${vitals.heartRate} lpm) por fiebre, dolor o hipovolemia.`,
        isAbnormal: true,
      };
    }
    if (vitals.heartRate <= 55) {
      return {
        ...stdStudy,
        result: `Bradicardia sinusal regular a ${vitals.heartRate} lpm. Vigilar trastornos de conducción o desequilibrio electrolítico asociado.`,
        interpretation: `Bradicardia sinusal acorde con los signos vitales (${vitals.heartRate} lpm).`,
        isAbnormal: true,
      };
    }
  }

  // EGO coherente con deshidratación, cetosis o infección urinaria/renal
  if (stdStudy.id === 'hosp-urinalysis-ego') {
    if (isRenal) {
      return {
        ...stdStudy,
        result: 'Densidad 1.015 | Proteínas: (++) | Cilindros granulosos y celulares ocasionales | Eritrocitos: 5-8 por campo.',
        interpretation: 'Sedimento urinario activo y proteinuria coherentes con compromiso renal.',
        isAbnormal: true,
      };
    }
    if (isShockOrDehydrated || isFebrileOrSepsis) {
      return {
        ...stdStudy,
        result: 'Color ámbar concentrado | Densidad 1.028 (elevada) | Cetonas: (+) por ayuno/catabolismo | Sedimento sin bacteriuria significativa.',
        interpretation: 'Orina concentrada secundaria a deshidratación, fiebre o estrés metabólico agudo.',
        isAbnormal: true,
      };
    }
  }

  // Dímero D en inflamación/infección severa
  if (stdStudy.id === 'hosp-dimer-d' && (isFebrileOrSepsis || isShockOrDehydrated || isCardiac)) {
    return {
      ...stdStudy,
      result: 'Dímero D: 760 ng/mL FEU.',
      interpretation: 'Elevación inespecífica como reactante de fase aguda e injuria endotelial secundaria al proceso inflamatorio/vascular sistémico.',
      isAbnormal: true,
    };
  }

  // Troponina I por demanda en taquicardia extrema o hipoxia severa
  if (stdStudy.id === 'hosp-troponin-i' && (isHypoxic || vitals.heartRate >= 120)) {
    return {
      ...stdStudy,
      result: 'Troponina I: 0.045 ng/mL (levemente por encima del percentil 99).',
      interpretation: 'Injuria miocárdica secundaria leve (tipo 2) atribuible a taquicardia sostenida o hipoxemia sistémica.',
      isAbnormal: true,
    };
  }

  return stdStudy;
}

/**
 * Resuelve cualquier estudio estándar con los hallazgos relacionados al caso clínico.
 */
function resolveContextualHospitalStudy(stdStudy: ComplementaryStudy, cCase: ClinicalCase): ComplementaryStudy {
  const caseOverrides = RELATED_STUDY_OVERRIDES[cCase.id];
  if (caseOverrides && caseOverrides[stdStudy.id]) {
    return {
      ...stdStudy,
      ...caseOverrides[stdStudy.id],
      id: `${stdStudy.id}-${cCase.id}`,
    };
  }

  const dynamicStudy = inferDynamicRelatedStudy(stdStudy, cCase);
  return {
    ...dynamicStudy,
    id: `${stdStudy.id}-${cCase.id}`,
  };
}

/**
 * Normaliza y compara títulos de estudios para evitar duplicados con los del caso base
 */
function isSameStudyCategory(name1: string, name2: string): boolean {
  const n1 = name1.toLowerCase();
  const n2 = name2.toLowerCase();

  if (n1.includes('hemograma') || n1.includes('biometría hemática')) {
    return n2.includes('hemograma') || n2.includes('biometría hemática');
  }
  if (n1.includes('química sanguínea') || (n1.includes('urea') && n1.includes('creatinina'))) {
    return n2.includes('química sanguínea') || (n2.includes('urea') && n2.includes('creatinina'));
  }
  if (n1.includes('electrolito')) {
    return n2.includes('electrolito');
  }
  if (n1.includes('gasometría') || n1.includes('gasometria')) {
    return n2.includes('gasometría') || n2.includes('gasometria');
  }
  if (n1.includes('perfil hepático') || n1.includes('bilirrubina')) {
    return n2.includes('perfil hepático') || n2.includes('bilirrubina');
  }
  if ((n1.includes('proteína c reactiva') || n1.includes('pcr')) && !n1.includes('hisopado') && !n1.includes('viral')) {
    return (n2.includes('proteína c reactiva') || n2.includes('pcr')) && !n2.includes('hisopado') && !n2.includes('viral');
  }
  if (n1.includes('tiroid') || n1.includes('tsh')) {
    return n2.includes('tiroid') || n2.includes('tsh');
  }
  if (n1.includes('hcg') || n1.includes('embarazo')) {
    return n2.includes('hcg') || n2.includes('embarazo');
  }
  if (n1.includes('urocultivo')) {
    return n2.includes('urocultivo');
  }
  if (n1.includes('arbovir') || n1.includes('dengue') || n1.includes('ns1')) {
    return n2.includes('arbovir') || n2.includes('dengue') || n2.includes('ns1');
  }
  if (n1.includes('malaria') || n1.includes('gota gruesa') || n1.includes('hemoparásito')) {
    return n2.includes('malaria') || n2.includes('gota gruesa') || n2.includes('hemoparásito');
  }
  if (n1.includes('leptospira')) {
    return n2.includes('leptospira');
  }
  if (n1.includes('troponina')) {
    return n2.includes('troponina');
  }
  if (n1.includes('ck-mb') || n1.includes('fracción mb') || n1.includes('fraccion mb')) {
    return n2.includes('ck-mb') || n2.includes('fracción mb') || n2.includes('fraccion mb');
  }
  if (n1.includes('dímero d') || n1.includes('dimero d')) {
    return n2.includes('dímero d') || n2.includes('dimero d');
  }
  if (n1.includes('amilasa') || n1.includes('lipasa')) {
    return n2.includes('amilasa') || n2.includes('lipasa');
  }
  if (n1.includes('orina') || n1.includes('ego') || n1.includes('urianálisis')) {
    return n2.includes('orina') || n2.includes('ego') || n2.includes('urianálisis');
  }
  if (n1.includes('coagulación') || n1.includes('tiempos de') || (n1.includes('tp') && n1.includes('ttpa'))) {
    return n2.includes('coagulación') || n2.includes('tiempos de') || (n2.includes('tp') && n2.includes('ttpa'));
  }
  if (n1.includes('hemocultivo')) {
    return n2.includes('hemocultivo');
  }
  if (n1.includes('punción lumbar') || n1.includes('lcr') || n1.includes('cefalorraquídeo')) {
    return n2.includes('punción lumbar') || n2.includes('lcr') || n2.includes('cefalorraquídeo');
  }
  if (n1.includes('rx de tórax') || n1.includes('radiografía de tórax') || n1.includes('radiografia de torax') || n1.includes('radiografía portátil de tórax')) {
    return n2.includes('rx de tórax') || n2.includes('radiografía de tórax') || n2.includes('radiografia de torax');
  }
  if (n1.includes('rx de abdomen') || n1.includes('radiografía simple de abdomen') || n1.includes('radiografia simple de abdomen')) {
    return n2.includes('rx de abdomen') || n2.includes('radiografía simple de abdomen') || n2.includes('radiografia simple de abdomen');
  }
  if (n1.includes('ultrasonido') || n1.includes('ecografía')) {
    return n2.includes('ultrasonido') || n2.includes('ecografía');
  }
  if ((n1.includes('tac') || n1.includes('angiotac') || n1.includes('tomografía')) && (n1.includes('tórax') || n1.includes('torax') || n1.includes('pulmon'))) {
    return (n2.includes('tac') || n2.includes('angiotac') || n2.includes('tomografía')) && (n2.includes('tórax') || n2.includes('torax') || n2.includes('pulmon'));
  }
  if ((n1.includes('tac') || n1.includes('tomografía')) && (n1.includes('abdomen') || n1.includes('pelvis') || n1.includes('apéndice'))) {
    return (n2.includes('tac') || n2.includes('tomografía')) && (n2.includes('abdomen') || n2.includes('pelvis') || n2.includes('apéndice'));
  }
  if ((n1.includes('tac') || n1.includes('tomografía')) && (n1.includes('cráneo') || n1.includes('craneo') || n1.includes('cerebr'))) {
    return (n2.includes('tac') || n2.includes('tomografía')) && (n2.includes('cráneo') || n2.includes('craneo') || n2.includes('cerebr'));
  }
  if (n1.includes('resonancia') || n1.includes('rmn')) {
    return n2.includes('resonancia') || n2.includes('rmn');
  }
  if (n1.includes('electrocardiograma') || n1.includes('ecg')) {
    return n2.includes('electrocardiograma') || n2.includes('ecg');
  }

  return false;
}

function getSubcategoryRank(subcategory: string): number {
  const idx = HOSPITAL_SUBCATEGORY_ORDER.indexOf(subcategory as ComplementaryStudy['subcategory']);
  return idx === -1 ? HOSPITAL_SUBCATEGORY_ORDER.length : idx;
}

function sortStudiesCanonically(studies: ComplementaryStudy[]): ComplementaryStudy[] {
  return [...studies].sort((a, b) => {
    const rankDiff = getSubcategoryRank(a.subcategory) - getSubcategoryRank(b.subcategory);
    if (rankDiff !== 0) return rankDiff;
    const nameDiff = a.name.localeCompare(b.name, 'es', { sensitivity: 'base' });
    if (nameDiff !== 0) return nameDiff;
    return a.id.localeCompare(b.id);
  });
}

/**
 * Enriquece un caso clínico con el catálogo unificado de pruebas hospitalarias.
 * Conserva las pruebas primarias propias del caso y, para las demás pruebas hospitalarias
 * (Gasometría, BH, Química, Electrolitos, Perfil Hepático, PCR/VSG, β-hCG, TAC, RMN, etc.),
 * inyecta resultados contextuales que detectan afecciones relacionadas cuando corresponden.
 * Ordena todo el catálogo de manera canónica por área clínica y orden alfabético para evitar
 * que los paraclínicos confirmatorios aparezcan en los primeros lugares del menú.
 */
export function enrichCaseWithHospitalCatalog(cCase: ClinicalCase): ClinicalCase {
  const existingStudies = cCase.studiesPool || [];
  const mergedStudies: ComplementaryStudy[] = [...existingStudies];

  for (const stdStudy of STANDARD_HOSPITAL_STUDIES) {
    const alreadyHas = existingStudies.some((s) => isSameStudyCategory(s.name, stdStudy.name));
    if (!alreadyHas) {
      mergedStudies.push(resolveContextualHospitalStudy(stdStudy, cCase));
    }
  }

  return {
    ...cCase,
    studiesPool: sortStudiesCanonically(mergedStudies),
  };
}
