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
  'Vitaminas y Nutrición',
  'Cardiovascular',
  'Urinario',
  'Microbiología / Serología',
  'Radiología',
  'Ecografía',
  'Tomografía',
  'Electrocardiograma',
  'Electromiografía y Neurofisiología',
  'Función Pulmonar y Audiología',
  'Endoscopia y Broncoscopia',
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
  {
    id: 'hosp-vitamina-b12-folato',
    category: 'Laboratorio',
    subcategory: 'Vitaminas y Nutrición',
    name: 'Niveles séricos de Vitamina B12 (Cobalamina), Ácido Fólico (B9) y Homocisteína',
    result: 'Vitamina B12 sérica: 465 pg/mL | Ácido fólico (Folato) sérico: 11.4 ng/mL | Homocisteína total: 8.6 µmol/L.',
    referenceRange: 'Vitamina B12: 210-911 pg/mL | Ácido fólico: 3.8-20.0 ng/mL | Homocisteína: 5-15 µmol/L',
    interpretation: 'Reservas séricas de cobalamina y folato dentro de rangos fisiológicos normales.',
    isAbnormal: false,
  },
  {
    id: 'hosp-vitamina-d',
    category: 'Laboratorio',
    subcategory: 'Vitaminas y Nutrición',
    name: 'Vitamina D (25-OH-Vitamina D total) y Hormona Paratiroidea (PTH intacta)',
    result: '25-hidroxivitamina D total: 35.4 ng/mL | PTH intacta: 34 pg/mL | Fósforo sérico: 3.6 mg/dL.',
    referenceRange: '25-OH-Vitamina D: 30-100 ng/mL (suficiencia) | PTH intacta: 15-65 pg/mL',
    interpretation: 'Estatus suficiente de vitamina D y homeostasis calcio-paratiroidea normal.',
    isAbnormal: false,
  },
  {
    id: 'hosp-vitamina-b1-b6',
    category: 'Laboratorio',
    subcategory: 'Vitaminas y Nutrición',
    name: 'Vitaminas Neurotrópicas B1 (Tiamina) y B6 (Piridoxal 5\'-fosfato)',
    result: 'Vitamina B1 (Tiamina difosfato en sangre total): 94 nmol/L | Vitamina B6 (PLP): 16.2 mcg/L.',
    referenceRange: 'Tiamina (B1): 70-180 nmol/L | Vitamina B6 (PLP): 5-50 mcg/L',
    interpretation: 'Niveles adecuados de vitaminas neurotrópicas del complejo B sin deficiencia carencial.',
    isAbnormal: false,
  },
  {
    id: 'hosp-perfil-vitaminas-liposolubles',
    category: 'Laboratorio',
    subcategory: 'Vitaminas y Nutrición',
    name: 'Perfil Nutricional y Vitaminas A, C, E y Zinc sérico',
    result: 'Vitamina A (Retinol): 48 mcg/dL | Vitamina E (Alfa-tocoferol): 11.2 mg/L | Vitamina C (Ácido ascórbico): 0.9 mg/dL | Prealbúmina: 26 mg/dL | Zinc sérico: 88 mcg/dL.',
    referenceRange: 'Vit A: 30-80 mcg/dL | Vit E: 5.5-17 mg/L | Vit C: 0.4-2.0 mg/dL | Prealbúmina: 20-40 mg/dL',
    interpretation: 'Estado nutricional proteico-vitamínico conservado sin datos de malabsorción.',
    isAbnormal: false,
  },
  {
    id: 'hosp-emg-extremidades',
    category: 'Gabinete y Trazados',
    subcategory: 'Electromiografía y Neurofisiología',
    name: 'Electromiografía (EMG) de aguja y Velocidades de Conducción Nerviosa (VCN) de 4 extremidades',
    result: 'Neuroconducción motora y sensitiva (nervios mediano, cubital, peroneo, tibial y sural): latencias distales, amplitudes (CMAP/SNAP) y velocidades de conducción nerviosa (>48-55 m/s) simétricas y normales. Ondas F y reflejos H presentes con latencias conservadas. EMG con aguja concéntrica en músculos proximales y distales: silencio eléctrico en reposo (sin fibrilaciones ni ondas positivas agudas), potenciales de unidad motora (PUM) de morfología y reclutamiento normales.',
    referenceRange: 'VCN motoras ≥45 m/s (MS ≥50 m/s), sin actividad espontánea anormal en reposo',
    interpretation: 'Estudio electrofisiológico de conducción nerviosa y miografía dentro de la normalidad; descarta polineuropatía, radiculopatía o miopatía activa.',
    isAbnormal: false,
  },
  {
    id: 'hosp-emg-tunel-carpo',
    category: 'Gabinete y Trazados',
    subcategory: 'Electromiografía y Neurofisiología',
    name: 'Electromiografía focal y Neuroconducción de Nervio Mediano y Cubital (Miembro Superior)',
    result: 'Conducción sensitiva y motora de nervio mediano y cubital bilateral con latencias distales (<3.6 ms sensitiva, <4.2 ms motora), amplitudes y velocidades de conducción transcarpianas dentro de parámetros normales. EMG de músculo abductor corto del pulgar sin denervación.',
    referenceRange: 'Latencia distal motora mediano <4.2 ms, sensitiva pico <3.6 ms',
    interpretation: 'Sin evidencia electrofisiológica de atrapamiento del nervio mediano en túnel del carpo ni neuropatía cubital.',
    isAbnormal: false,
  },
  {
    id: 'hosp-emg-estimulacion-repetitiva',
    category: 'Gabinete y Trazados',
    subcategory: 'Electromiografía y Neurofisiología',
    name: 'Prueba de Estimulación Nerviosa Repetitiva (Test de Jolly) y Reflejos Tardíos (Onda F / Reflejo H)',
    result: 'Estimulación repetitiva a baja frecuencia (3 Hz) en nervio facial, accesorio espinal y cubital en reposo y post-ejercicio: sin decremento patológico del potencial compuesto (>10% ausente). Reflejos H en sóleo y ondas F con persistencia del 100% y latencias simétricas.',
    referenceRange: 'Decremento <10% en estimulación repetitiva; ondas F y reflejo H simétricos',
    interpretation: 'Transmisión de la placa neuromuscular y conducción radicular proximal conservadas; aleja miastenia gravis o bloqueo proximal.',
    isAbnormal: false,
  },
  {
    id: 'hosp-endoscopia-alta',
    category: 'Gabinete y Trazados',
    subcategory: 'Endoscopia y Broncoscopia',
    name: 'Endoscopia Digestiva Alta (Panendoscopia / Esofagogastroduodenoscopia)',
    result: 'Esófago de calibre y mucosa rosada normal, línea Z íntegra a 38 cm de la arcada dental sin esofagitis, úlceras ni várices. Estómago con pliegues distensibles y mucosa fúndica, corporal y antral conservada sin sangrado activo ni lesiones. Bulbo y segunda porción duodenal sin lesiones. Test rápido de ureasa negativo.',
    referenceRange: 'Mucosa esofagogastroduodenal íntegra sin sangrado ni lesiones',
    interpretation: 'Panendoscopia dentro de parámetros normales; descarta sangrado digestivo alto, úlcera péptica o esofagitis erosiva.',
    isAbnormal: false,
  },
  {
    id: 'hosp-colonoscopia',
    category: 'Gabinete y Trazados',
    subcategory: 'Endoscopia y Broncoscopia',
    name: 'Colonoscopia Total con Ileoscopia Distal',
    result: 'Progresión completa hasta ciego e íleon terminal (preparación Boston 9/9). Mucosa de recto, sigmoides, colon descendente, transverso, ascendente y ciego con patrón vascular conservado, sin úlceras, pólipos, masas, divertículos complicados ni estigmas de sangrado activo. Canal anal sin hemorroides sangrantes.',
    referenceRange: 'Mucosa colónica e ileal distal sin lesiones estructurales ni inflamatorias',
    interpretation: 'Colonoscopia normal; descarta enfermedad inflamatoria intestinal, pólipos, neoplasia o hemorragia digestiva baja.',
    isAbnormal: false,
  },
  {
    id: 'hosp-broncoscopia',
    category: 'Gabinete y Trazados',
    subcategory: 'Endoscopia y Broncoscopia',
    name: 'Broncoscopia Flexible (Fibrobroncoscopia) con Lavado Broncoalveolar',
    result: 'Cuerdas vocales móviles y simétricas. Tráquea y carina principal centradas y agudas. Árbol bronquial bilateral permeable hasta subsegmentos sin cuerpos extraños, estenosis, masas endobronquiales ni sangrado activo. Lavado broncoalveolar (BAL) límpido con recuento celular normal y tinciones microbiológicas negativas.',
    referenceRange: 'Vía aérea traqueobronquial permeable sin obstrucción, infección ni sangrado',
    interpretation: 'Fibrobroncoscopia normal; descarta lesión endobronquial, cuerpo extraño, hemorragia alveolar u obstrucción bronquial.',
    isAbnormal: false,
  },
  {
    id: 'hosp-eeg',
    category: 'Gabinete y Trazados',
    subcategory: 'Electromiografía y Neurofisiología',
    name: 'Electroencefalograma (EEG) Convencional con Activación (Hiperventilación y Fotoestimulación)',
    result: 'Actividad de base posterior constituida por ritmo alfa dominante a 9.5–10.5 Hz, simétrico, bien modulado y reactivo a la apertura ocular. Regiones anteriores con ritmo beta de bajo voltaje. Durante hiperventilación y fotoestimulación intermitente no se registran complejos punta-onda, polipuntas, brotes paroxísticos epileptiformes ni asimetrías o enlentecimiento focal delta/theta.',
    referenceRange: 'Ritmo alfa posterior reactivo (8–13 Hz), sin actividad epileptiforme ni enlentecimiento focal',
    interpretation: 'Electroencefalograma dentro de parámetros fisiológicos normales para la edad; descarta actividad epileptiforme interictal o encefalopatía difusa.',
    isAbnormal: false,
  },
  {
    id: 'hosp-potenciales-evocados',
    category: 'Gabinete y Trazados',
    subcategory: 'Electromiografía y Neurofisiología',
    name: 'Potenciales Evocados Multimodales (Visuales PEV, Auditivos de Tronco PEATC y Somatosensoriales PESS)',
    result: 'PEV (patrón damero): onda P100 bilateral simétrica con latencias normales (101 ms OI, 102 ms OD). PEATC: ondas I, III y V presentes con intervalos interpico I-III, III-V y I-V conservados. PESS (nervio mediano y tibial posterior): latencias corticales N20 y P37 dentro de rangos normativos.',
    referenceRange: 'P100 < 115 ms, diferencias interoculares < 6 ms; conducción troncoencefálica y cordonal posterior normal',
    interpretation: 'Integridad funcional de vías visuales, auditivas de tronco encefálico y somatosensoriales centrales.',
    isAbnormal: false,
  },
  {
    id: 'hosp-espirometria',
    category: 'Gabinete y Trazados',
    subcategory: 'Función Pulmonar y Audiología',
    name: 'Espirometría Basal y Prueba con Broncodilatador (FVC, FEV₁, Relación FEV₁/FVC)',
    result: 'Basal: FVC 96% del predicho | FEV₁ 94% del predicho | Relación FEV₁/FVC: 0.81 | FEF25-75%: 89%. Post-broncodilatador (400 mcg salbutamol): cambio en FEV₁ de +4% (+95 mL). Curva flujo-volumen de morfología normal sin amputación inspiratoria ni espiratoria.',
    referenceRange: 'FEV₁/FVC ≥ 0.70 (y > LIN), FVC y FEV₁ ≥ 80% del predicho; respuesta BD negativa (<12% y <200 mL)',
    interpretation: 'Mecánica ventilatoria y flujos espiratorios normales; descarta obstrucción crónica fija o hiperreactividad bronquial reversible.',
    isAbnormal: false,
  },
  {
    id: 'hosp-audiometria',
    category: 'Gabinete y Trazados',
    subcategory: 'Función Pulmonar y Audiología',
    name: 'Audiometría Tonal Liminar y Timpanometría (Impedanciometría)',
    result: 'Audiometría tonal: umbrales auditivos aéreos y óseos entre 10 y 20 dB HL en todas las frecuencias (250–8000 Hz) bilateralmente, sin brecha aéreo-ósea. Logoaudiometría: 100% de discriminación fonémica. Timpanometría: curvas tipo A bilaterales con reflejos estapediales presentes.',
    referenceRange: 'Umbrales ≤ 25 dB HL bilateral; curva timpanométrica tipo A',
    interpretation: 'Audición periférica bilateral y función de oído medio dentro de parámetros normales.',
    isAbnormal: false,
  },
  {
    id: 'hosp-holter-24h',
    category: 'Gabinete y Trazados',
    subcategory: 'Electrocardiograma',
    name: 'Monitoreo Electrocardiográfico Ambulatorio Holter de 24 Horas',
    result: 'Ritmo sinusal predominante durante todo el registro (FC mínima 54 lpm en sueño, media 74 lpm, máxima 118 lpm en actividad). Extrasístoles supraventriculares aisladas (<0.1%), sin episodios de fibrilación auricular, taquicardia supraventricular ni ventricular sostenida, pausas >2.0 seg ni bloqueos AV avanzados. Sin cambios dinámicos isquémicos del segmento ST.',
    referenceRange: 'Ritmo sinusal continuo sin pausas >2.0 s ni taquiarritmias paroxísticas',
    interpretation: 'Monitoreo Holter de 24 h sin arritmias paroxísticas clínicamente significativas ni bloqueos intermitentes.',
    isAbnormal: false,
  },
  {
    id: 'hosp-holter-presion-mapa',
    category: 'Gabinete y Trazados',
    subcategory: 'Electrocardiograma',
    name: 'Holter de Presión Arterial / MAPA de 24 Horas (Monitoreo Ambulatorio de PA)',
    result: 'Promedio global 24 horas: 118/74 mmHg (FC media 74 lpm). Periodo diurno (07:00–22:00): 122/77 mmHg | Periodo nocturno (22:00–07:00): 106/65 mmHg. Descenso nocturno fisiológico (patrón dipper): 13.1% sistólico y 15.5% diastólico. Carga hipertensiva <15% sin picos hipertensivos ni hipotensión sintomática.',
    referenceRange: 'Prom. 24h < 130/80 mmHg | Diurno < 135/85 mmHg | Nocturno < 120/70 mmHg | Descenso nocturno dipper: 10–20%',
    interpretation: 'Perfil ambulatorio de presión arterial normotenso de 24 horas con ritmo circadiano dipper fisiológico conservado.',
    isAbnormal: false,
  },
  {
    id: 'hosp-ecocardiograma',
    category: 'Imagen',
    subcategory: 'Ecografía',
    name: 'Ecocardiograma Transtorácico (ECOTT) con Doppler Color',
    result: 'Ventrículo izquierdo de diámetros y espesores parietales normales, motilidad segmentaria y global conservada con Fracción de Eyección (FEVI) de 62% (Simpson). Cavidades derechas de tamaño normal (TAPSE 22 mm, PSAP estimada 24 mmHg). Válvulas cardíacas normofuncionantes sin estenosis, insuficiencias significativas ni vegetaciones. Pericardio libre sin derrame.',
    referenceRange: 'FEVI ≥ 55%, cavidades y válvulas normofuncionantes sin derrame pericárdico',
    interpretation: 'Función sistodiastólica biventricular conservada sin valvulopatía aguda, hipertensión pulmonar ni derrame pericárdico.',
    isAbnormal: false,
  },
  {
    id: 'hosp-rx-osea',
    category: 'Imagen',
    subcategory: 'Radiología',
    name: 'Radiografía Osteoarticular / Columna (Proyecciones AP y Lateral de región sintomática)',
    result: 'Alineación ósea conservada sin trazos de fractura aguda, luxación ni lesiones líticas o blásticas. Densidad mineral ósea acorde a la edad, espacios articulares e intervertebrales preservados sin colapso ni osteofitos compresivos graves. Tejidos blandos perilesionales sin aumento significativo de volumen ni gas.',
    referenceRange: 'Continuidad cortical y alineación osteoarticular conservadas sin fractura',
    interpretation: 'Estudio radiográfico óseo sin fractura aguda, luxación ni lesión destructiva.',
    isAbnormal: false,
  },
  {
    id: 'hosp-pro-bnp',
    category: 'Laboratorio',
    subcategory: 'Cardiovascular',
    name: 'Péptido Natriurético tipo B (NT-proBNP)',
    result: 'NT-proBNP sérico: 68 pg/mL.',
    referenceRange: '< 125 pg/mL (ambulatorio < 75 años) | < 300 pg/mL (descarte agudo)',
    interpretation: 'Valores normales con muy alto valor predictivo negativo para insuficiencia cardíaca congestiva aguda o crónica descompensada.',
    isAbnormal: false,
  },
  {
    id: 'hosp-hba1c-lipidos',
    category: 'Laboratorio',
    subcategory: 'Bioquímica',
    name: 'Hemoglobina Glucosilada (HbA1c) y Perfil Lipídico Completo (CT, LDL, HDL, Triglicéridos)',
    result: 'HbA1c: 5.3% | Colesterol Total: 172 mg/dL | LDL calculado: 96 mg/dL | HDL: 52 mg/dL | Triglicéridos: 118 mg/dL.',
    referenceRange: 'HbA1c < 5.7% | Colesterol total < 200 mg/dL | LDL < 100 mg/dL | TG < 150 mg/dL',
    interpretation: 'Control glucémico trimestral y perfil lipídico dentro de metas cardiometabólicas saludables.',
    isAbnormal: false,
  },
  {
    id: 'hosp-perfil-ferrico',
    category: 'Laboratorio',
    subcategory: 'Hematología',
    name: 'Perfil de Hierro Completo (Hierro Sérico, Ferritina, TIBC y Saturación de Transferrina)',
    result: 'Hierro sérico: 98 mcg/dL | Ferritina sérica: 84 ng/mL | Capacidad total de fijación (TIBC): 310 mcg/dL | Saturación de transferrina: 31.6%.',
    referenceRange: 'Ferritina: 30-300 ng/mL | Hierro sérico: 60-170 mcg/dL | Sat. transferrina: 20-50%',
    interpretation: 'Reservas corporales de hierro y cinética férrica normales; descarta ferropenia.',
    isAbnormal: false,
  },
  {
    id: 'hosp-panel-autoinmune',
    category: 'Laboratorio',
    subcategory: 'Inflamación e Infección',
    name: 'Panel Autoinmune (ANA, Factor Reumatoide, Anti-CCP y Complemento C3/C4)',
    result: 'Anticuerpos Antinucleares (ANA por IFI HEp-2): Negativo (<1:40) | Factor Reumatoide (FR): <10 UI/mL | Anti-CCP: <5 U/mL | Complemento C3: 118 mg/dL | Complemento C4: 26 mg/dL.',
    referenceRange: 'ANA negativo (<1:80), FR <14 UI/mL, C3 90-180 mg/dL, C4 10-40 mg/dL',
    interpretation: 'Perfil serológico autoinmune negativo y complemento sérico normocomplementémico.',
    isAbnormal: false,
  },
  {
    id: 'hosp-toxicologico',
    category: 'Laboratorio',
    subcategory: 'Urinario',
    name: 'Tamizaje Toxicológico en Orina y Niveles de Etanol / Fármacos',
    result: 'Panel en orina negativo para benzodiacepinas, opioides, cocaína, anfetaminas, cannabinoides y antidepresivos tricíclicos. Etanol sérico: <10 mg/dL (No detectable). Niveles de salicilatos y paracetamol no detectables.',
    referenceRange: 'Negativo para drogas de abuso y tóxicos medidos',
    interpretation: 'Tamizaje toxicológico negativo; descarta intoxicación aguda por sustancias evaluadas.',
    isAbnormal: false,
  },
  {
    id: 'hosp-coprologico',
    category: 'Laboratorio',
    subcategory: 'Microbiología / Serología',
    name: 'Estudio Coprológico, Coproparasitoscópico Seriado y Sangre Oculta en Heces',
    result: 'Consistencia blanda-formada sin moco macroscópico ni sangre visible. Sangre oculta en heces (SOH inmunológica): Negativa. Citología fecal: leucocitos 0-1 por campo. Coproparasitoscópico seriado (3 muestras): Negativo para quistes, trofozoítos o huevos. Coprocultivo: flora entérica habitual sin enteropatógenos.',
    referenceRange: 'Negativo para leucocitos fecales, sangre oculta, parásitos y enteropatógenos',
    interpretation: 'Estudio coproparasitoscópico y microbiológico fecal normal sin sangrado oculto ni infección entérica invasiva.',
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
    'hosp-ecocardiograma': {
      result: 'Hipocinesia severa / acinesia de pared anterior y ápex del ventrículo izquierdo con disfunción sistólica moderada (FEVI estimada: 42%). Sin trombo apical ni derrame pericárdico significativo.',
      interpretation: 'Trastorno focal de motilidad en territorio de arteria descendente anterior acorde con IAMCEST anterior en curso.',
      isAbnormal: true,
    },
    'hosp-pro-bnp': {
      result: 'NT-proBNP sérico: 1,450 pg/mL (ELEVADO).',
      interpretation: 'Elevación por disfunción ventricular aguda e incremento de presión telediastólica tras isquemia miocárdica extensa.',
      isAbnormal: true,
    },
    'hosp-hba1c-lipidos': {
      result: 'HbA1c: 6.3% (prediabetes) | Colesterol Total: 248 mg/dL | LDL: 168 mg/dL (ALTO) | HDL: 34 mg/dL (bajo) | Triglicéridos: 215 mg/dL.',
      interpretation: 'Dislipidemia aterogénica severa e intolerancia glucémica como factores de riesgo coronario mayor.',
      isAbnormal: true,
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
    'hosp-eeg': {
      result: 'Enlentecimiento difuso bilateral de la actividad eléctrica de fondo en rangos theta (4-6 Hz) y delta intermitente de predominio frontotemporal sin descargas epileptiformes francas ni asimetría de foco estructural.',
      interpretation: 'Patrón electroencefalográfico de encefalopatía aguda infecciosa/metabólica concordante con compromiso inflamatorio meningoencefálico.',
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
    'hosp-vitamina-d': {
      result: '25-OH-Vitamina D total: 14.2 ng/mL (DEFICIENCIA) | PTH intacta: 74 pg/mL (elevación compensatoria leve).',
      interpretation: 'Deficiencia de vitamina D concordante con edad avanzada y osteoporosis previa.',
      isAbnormal: true,
    },
    'hosp-broncoscopia': {
      result: 'Eritema e inflamación intensa de mucosa en bronquio lobar inferior derecho con abundantes secreciones mucopurulentas espesas obstruyendo subsegmentos basales. Lavado broncoalveolar (BAL): >90% neutrófilos y diplococos Gram positivos encapsulados.',
      interpretation: 'Bronquitis purulenta lobar inferior derecha con confirmación microbiológica de neumococo en lavado broncoalveolar.',
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
    'hosp-vitamina-d': {
      result: '25-OH-Vitamina D total: 16.5 ng/mL | PTH intacta: 118 pg/mL | Fósforo: 5.4 mg/dL.',
      interpretation: 'Insuficiencia de vitamina D e hiperparatiroidismo secundario por deterioro de función renal.',
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
    'hosp-emg-extremidades': {
      result: 'Miembro pélvico derecho afectado: reducción marcada de amplitudes de potenciales motores compuestos (CMAP) en nervios peroneo profundo y tibial posterior (<0.8 mV) con bloqueo de conducción focal en compartimento anterior/lateral de pierna; miembro contralateral normal.',
      interpretation: 'Neuropraxia/axonotmesis isquémica aguda secundaria a compresión nerviosa intracompartimental (nota: NO retrasar la fasciotomía urgente esperando electrofisiología).',
      isAbnormal: true,
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
    'hosp-broncoscopia': {
      result: 'Mucosa laríngea y traqueobronquial proximal con eritema difuso, edema leve y pequeñas áreas parcheadas de desepitelización mucocutánea sin obstrucción crítica ni cuerpo extraño.',
      interpretation: 'Compromiso inflamatorio mucoso traqueobronquial incipiente secundario a reacción medicamentosa sistémica.',
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
    'hosp-ecocardiograma': {
      result: 'Dilatación de ventrículo derecho (relación VD/VI >1.1), hipocinesia de pared libre del VD con preservación apical (signo de McConnell), abombamiento septal paradójico hacia VI y presión sistólica arterial pulmonar estimada (PSAP) en 50 mmHg. FEVI izquierda preservada (60%).',
      interpretation: 'Disfunción aguda del ventrículo derecho secundaria a hipertensión pulmonar tromboembólica aguda.',
      isAbnormal: true,
    },
    'hosp-pro-bnp': {
      result: 'NT-proBNP sérico: 1,820 pg/mL (MARCADAMENTE ELEVADO).',
      interpretation: 'Elevación por estiramiento agudo del miocardio ventricular derecho (marcador de riesgo intermedio en TEP).',
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
  'case-neurologia-guillain-barre': {
    'hosp-emg-extremidades': {
      result: 'VCN motoras (mediano, cubital, peroneo y tibial): latencias distales marcadamente prolongadas (6.8-8.9 ms), disminución significativa de velocidades de conducción (26-34 m/s), dispersión temporal y bloqueos parciales de conducción motora; preservación relativa de respuesta sensitiva sural ("sural sparing"). Ondas F ausentes o severamente prolongadas (>65 ms). EMG con aguja: reclutamiento reducido sin denervación crónica.',
      interpretation: 'Polineuropatía desmielinizante inflamatoria aguda (patrón AIDP) altamente confirmatoria de Síndrome de Guillain-Barré.',
      isAbnormal: true,
    },
    'hosp-emg-estimulacion-repetitiva': {
      result: 'Ondas F ausentes en nervios peroneos y tibiales bilaterales; reflejo H ausente bilateralmente. Estimulación repetitiva a 3 Hz sin decremento de placa neuromuscular.',
      interpretation: 'Ausencia temprana de ondas F y reflejo H por desmielinización proximal radicular (primer hallazgo electrofisiológico en Guillain-Barré), descartando trastorno de unión neuromuscular.',
      isAbnormal: true,
    },
    'hosp-vitamina-b12-folato': {
      result: 'Vitamina B12: 410 pg/mL | Ácido fólico: 9.8 ng/mL | Homocisteína: 9.1 µmol/L.',
      interpretation: 'Descarta mieloneuropatía carencial por déficit de vitamina B12 como diagnóstico diferencial de debilidad ascendente.',
      isAbnormal: false,
    },
  },
  'case-psiquiatria-delirium-tremens': {
    'hosp-vitamina-b1-b6': {
      result: 'Vitamina B1 (Tiamina en sangre total): 34 nmol/L (CRÍTICAMENTE BAJA) | Vitamina B6 (PLP): 3.2 mcg/L (baja).',
      interpretation: 'Deficiencia severa de tiamina (vitamina B1) secundaria a alcoholismo crónico; altísimo riesgo de encefalopatía de Wernicke si se administra glucosa sin reposición previa de tiamina IV.',
      isAbnormal: true,
    },
    'hosp-vitamina-b12-folato': {
      result: 'Ácido fólico (B9): 2.1 ng/mL (DEFICIENCIA) | Vitamina B12: 260 pg/mL (limítrofe baja) | Homocisteína: 21.4 µmol/L.',
      interpretation: 'Deficiencia de folatos frecuente en etilismo crónico que explica tendencia a macrocitosis hematológica.',
      isAbnormal: true,
    },
    'hosp-eeg': {
      result: 'Trazado de fondo rápido de bajo voltaje con predominio de actividad beta difusa entremezclada con ondas theta dispersas secundarias a hiperexcitabilidad cortical por abstinencia alcohólica; sin descargas epileptiformes focales sostenidas.',
      interpretation: 'Hallazgos compatibles con síndrome de abstinencia alcohólica aguda (delirium tremens) sin foco epiléptico estructural.',
      isAbnormal: true,
    },
    'hosp-toxicologico': {
      result: 'Etanol sérico: <10 mg/dL (negativo tras suspensión abrupta hace 48 h). Tamizaje urinario negativo para cocaína, opioides y anfetaminas.',
      interpretation: 'Confirma estado de abstinencia alcohólica tras cese de ingesta sin intoxicación concomitante por drogas ilícitas.',
      isAbnormal: false,
    },
  },
  'case-traumatologia-cadera': {
    'hosp-vitamina-d': {
      result: '25-OH-Vitamina D total: 12.8 ng/mL (DEFICIENCIA) | PTH intacta: 81 pg/mL | Calcio sérico: 8.6 mg/dL.',
      interpretation: 'Hipovitaminosis D severa asociada a fragilidad ósea y riesgo de fractura de cadera en adulto mayor.',
      isAbnormal: true,
    },
  },
  'case-out-mi-anemia-ferropenica': {
    'hosp-vitamina-b12-folato': {
      result: 'Vitamina B12 sérica: 390 pg/mL | Ácido fólico sérico: 10.2 ng/mL.',
      interpretation: 'Niveles normales de B12 y folato; descarta anemia mixta carencial y confirma ferropenia pura.',
      isAbnormal: false,
    },
    'hosp-endoscopia-alta': {
      result: 'Mucosa esofágica, gástrica y duodenal íntegra, sin úlceras, angiodisplasias ni sangrado activo; biopsias duodenales sin atrofia vellositaria.',
      interpretation: 'Descarta sangrado digestivo alto oculto o enfermedad celíaca como causa de ferropenia.',
      isAbnormal: false,
    },
    'hosp-colonoscopia': {
      result: 'Colon e íleon terminal normales sin pólipos, úlceras ni lesiones sangrantes.',
      interpretation: 'Descarta sangrado colónico oculto; refuerza etiología ginecológica (hipermenorrea).',
      isAbnormal: false,
    },
  },
  'case-out-trauma-lumbalgia': {
    'hosp-emg-extremidades': {
      result: 'EMG y VCN de miembros inferiores (L4, L5, S1 bilaterales): amplitudes motoras/sensitivas normales, reflejo H en sóleo simétrico (29.2 ms) y ausencia de ondas positivas o fibrilaciones en miotomas lumbares.',
      interpretation: 'Sin evidencia electrofisiológica de radiculopatía lumbar; respalda lumbalgia mecánica pura.',
      isAbnormal: false,
    },
  },
  'case-gastro-hda-ulcera': {
    'hosp-endoscopia-alta': {
      result: 'Abundantes restos hemáticos oscuros ("posos de café") en cámara gástrica tras lavado. Gastropatía erosiva antral difusa por AINEs. En cara posterior del bulbo duodenal se identifica úlcera péptica profunda de 14 mm con vaso visible no sangrante / coágulo adherido (clasificación Forrest IIa-IIb). Se realiza terapia combinada endoscópica con adrenalina diluida + clipaje hemostático exitoso. Sin várices esofágicas.',
      interpretation: 'Estudio confirmatorio y terapéutico de hemorragia digestiva alta no variceal por úlcera duodenal secundaria a AINEs.',
      isAbnormal: true,
    },
    'hosp-colonoscopia': {
      result: 'Presencia de restos hemáticos digeridos oscuros (melena) descendiendo desde íleon terminal sin lesión mucosa primaria, úlceras, pólipos ni divertículos sangrantes en colon.',
      interpretation: 'Confirma que el sangrado proviene del tubo digestivo alto y descarta fuente colónica.',
      isAbnormal: false,
    },
  },
  'case-out-gastro-erge': {
    'hosp-endoscopia-alta': {
      result: 'Esofagitis erosiva leve grado A de Los Ángeles (erosión mucosa única de 4 mm en esófago distal sobre línea Z), cardias ligeramente laxo / hernia hiatal por deslizamiento de 2 cm. Sin esófago de Barrett, estenosis ni úlcera gástrica.',
      interpretation: 'Hallazgos compatibles con enfermedad por reflujo gastroesofágico leve no complicada.',
      isAbnormal: true,
    },
  },
  'case-gastro-colangitis-aguda': {
    'hosp-endoscopia-alta': {
      result: 'Esófago y estómago normales. En segunda porción duodenal se observa papila mayor de Vater edematosa y prominente con salida de bilis turbia-purulenta (indicación inmediata de CPRE descompresiva).',
      interpretation: 'Hallazgo papilar compatible con colangitis aguda purulenta por obstrucción biliar distal.',
      isAbnormal: true,
    },
  },
  'case-out-mi-deficit-b12': {
    'hosp-endoscopia-alta': {
      result: 'Adelgazamiento y palidez difusa de mucosa con pérdida de pliegues en cuerpo y fondo gástrico (gastritis crónica atrófica), respetando antro. Sin úlceras ni neoplasias. Biopsias enviadas para descartar gastritis atrófica autoinmune.',
      interpretation: 'Compatible con gastritis crónica atrófica asociada a malabsorción de vitamina B12.',
      isAbnormal: true,
    },
  },
  'case-out-gastro-sii': {
    'hosp-colonoscopia': {
      result: 'Colonoscopia total e ileoscopia distal hasta 15 cm completamente normales: mucosa rosada, patrón vascular nítido, sin úlceras, friabilidad, pólipos ni estenosis. Biopsias aleatorias sin colitis microscópica.',
      interpretation: 'Excluye enfermedad inflamatoria intestinal o neoplasia colónica; respalda Síndrome de Intestino Irritable.',
      isAbnormal: false,
    },
  },
  'case-neumologia-asma-grave': {
    'hosp-broncoscopia': {
      result: 'Edema e hiperemia difusa de mucosa bronquial con broncoconstricción segmentaria y múltiples tapones mucosos adherentes espeso-blanquecinos sin cuerpos extraños ni tumoraciones. Lavado broncoalveolar con eosinofilia (14%) y cultivos bacterianos negativos.',
      interpretation: 'Cambios inflamatorios bronquiales severos y tapones mucosos compatibles con exacerbación asmática (nota: en crisis grave la broncoscopia se reserva solo tras asegurar vía aérea).',
      isAbnormal: true,
    },
    'hosp-espirometria': {
      result: 'Obstrucción severa al flujo aéreo (FEV₁ 44% del predicho, relación FEV₁/FVC: 0.56) con respuesta broncodilatadora significativa tras estabilización (+18% y +340 mL en FEV₁).',
      interpretation: 'Patrón obstructivo reversible característico de exacerbación asmática grave (nota: realizar tras estabilizar la crisis aguda).',
      isAbnormal: true,
    },
  },
  'case-out-neumo-asma': {
    'hosp-broncoscopia': {
      result: 'Árbol traqueobronquial permeable sin estenosis ni cuerpo extraño; discreto edema mucoso y secreción mucosa clara con predominio eosinofílico en lavado broncoalveolar.',
      interpretation: 'Descarta obstrucción mecánica de vía aérea central o cuerpo extraño; compatible con inflamación asmática leve.',
      isAbnormal: true,
    },
  },
  'case-neurologia-ictus': {
    'hosp-eeg': {
      result: 'Enlentecimiento focal polimorfo en rango delta-theta sobre región frontotemporal izquierda acorde con disfunción cortical isquémica aguda; actividad de base derecha conservada sin descargas epileptiformes.',
      interpretation: 'Disfunción bioeléctrica focal hemisférica izquierda concordante con territorio de arteria cerebral media.',
      isAbnormal: true,
    },
    'hosp-holter-24h': {
      result: 'Episodios paroxísticos de fibrilación auricular asintomática con respuesta ventricular entre 85 y 118 lpm (duración acumulada 14% del registro) alternando con ritmo sinusal.',
      interpretation: 'Detecta fibrilación auricular paroxística como fuente cardioembólica etiológica del evento vascular cerebral.',
      isAbnormal: true,
    },
    'hosp-ecocardiograma': {
      result: 'Dilatación moderada de aurícula izquierda (volumen indexado 41 mL/m²), FEVI 56%, sin trombo intracavitario visible en ventana transtorácica.',
      interpretation: 'Remodelado auricular izquierdo compatible con cardioembolismo por fibrilación auricular.',
      isAbnormal: true,
    },
  },
  'case-out-urg-vppb': {
    'hosp-audiometria': {
      result: 'Audiometría tonal liminar completamente normal bilateral (umbrales 10-15 dB en 250-8000 Hz) y timpanometría tipo A bilateral.',
      interpretation: 'Ausencia de hipoacusia neurosensorial fluctuante o conductiva; descarta enfermedad de Ménière y patología de oído medio.',
      isAbnormal: false,
    },
  },
  'case-out-ped-otitis': {
    'hosp-audiometria': {
      result: 'Timpanometría derecha curva plana tipo B (ocupación líquida en oído medio derecho); oído izquierdo curva tipo A normal. Audiometría tonal: hipoacusia conductiva derecha leve (30 dB HL con brecha aéreo-ósea de 20 dB).',
      interpretation: 'Derrame purulento/seroso en oído medio derecho concordante con otitis media aguda.',
      isAbnormal: true,
    },
  },
  'case-out-gastro-colitis-ulcerosa': {
    'hosp-coprologico': {
      result: 'Heces mucosanguinolentas con abundantes leucocitos fecales (>20 por campo) y sangre oculta fuertemente positiva. Coprocultivo, toxina A/B de Clostridioides difficile y coproparasitoscópico seriados negativos.',
      interpretation: 'Confirma diarrea inflamatoria no infecciosa congruente con brote de enfermedad inflamatoria intestinal.',
      isAbnormal: true,
    },
  },
  'case-out-cardio-hta': {
    'hosp-holter-presion-mapa': {
      result: 'Promedio global 24 horas: 150/92 mmHg (FC media 76 lpm). Periodo diurno (07:00–22:00): 155/95 mmHg | Periodo nocturno (22:00–07:00): 141/86 mmHg. Descenso nocturno atenuado (patrón non-dipper): 9.0% sistólico y 9.5% diastólico. Carga hipertensiva elevada (84% sistólica, 81% diastólica).',
      interpretation: 'Confirma hipertensión arterial sistémica sostenida de grado 2 (descarta hipertensión de bata blanca) con patrón non-dipper de mayor riesgo cardiovascular.',
      isAbnormal: true,
    },
  },
  'case-ginecologia-preeclampsia': {
    'hosp-holter-presion-mapa': {
      result: 'Promedio global 24 horas: 170/109 mmHg (FC media 96 lpm). Periodo diurno (07:00–22:00): 173/111 mmHg | Periodo nocturno (22:00–07:00): 165/105 mmHg. Ausencia de descenso nocturno (patrón non-dipper: 4.6% sistólico). Carga hipertensiva del 100% (Nota: en preeclampsia severa el manejo es hospitalario urgente, no diferir por estudio ambulatorio).',
      interpretation: 'Hipertensión arterial severa sostenida con pérdida del ritmo circadiano nocturno característica de trastorno hipertensivo grave del embarazo.',
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

  const isBenignOutpatient =
    /reflujo gastroesofagico|\berge\b|intestino irritable|\bsii\b|migraña|migrana|cefalea tensional|paralisis de bell|paralisis facial periferica|lumbalgia mecanica|esguince|vertigo posicional|\bvppb\b|tina corporal|herpes zoster|candidiasis|ansiedad|gastroenteritis aguda probable viral/.test(
      diag
    );

  const isFebrileOrSepsis =
    !isBenignOutpatient &&
    (vitals.temperature >= 38.0 || /sepsis|infecc|bacter|mening|neumon|pielonefr|absceso|colangit|peritonit/.test(textPool));
  const isHypoxic = vitals.oxygenSaturation <= 93 || /neumon|edema|epoc|asma|tromboembol|derrame|bronquiolit|insuficiencia respiratoria/.test(textPool);
  const isShockOrDehydrated =
    !isBenignOutpatient &&
    (parseInt(vitals.bloodPressure.split('/')[0] || '120', 10) <= 95 || vitals.heartRate >= 110 || /choque|shock|hemorrag|deshidrat|cetoacidosis|ectopico/.test(textPool));
  const isAbdominalAcute =
    !isBenignOutpatient &&
    (spec === 'cirugia_general' || /apendic|colecist|pancreat|diverticul|obstruc|perforac|ectopico|isquemia mesent|colitis ulcerosa/.test(textPool));
  const isCardiac = spec === 'cardiologia' || /infarto|angina|insuficiencia cardiaca|pericardit|miocardit|arritmia|fibrilacion/.test(textPool);
  const isNeuro =
    !isBenignOutpatient &&
    (spec === 'neurologia' || /evc|ictus|acv|hemorragia|meningit|encefal|convuls|status/.test(textPool));
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

  // Vitaminas neurotrópicas y folato en etilismo / desnutrición / hepatopatía
  const hasAlcoholOrMalnutrition = /alcohol|etili|cirros|delirium tremens|wernicke|desnutric|malabsorc/.test(textPool);
  if (stdStudy.id === 'hosp-vitamina-b1-b6' && hasAlcoholOrMalnutrition) {
    return {
      ...stdStudy,
      result: 'Vitamina B1 (Tiamina en sangre total): 38 nmol/L (BAJA) | Vitamina B6: 4.1 mcg/L (baja).',
      interpretation: 'Déficit de tiamina y piridoxina asociado a consumo crónico de alcohol o desnutrición; requiere reposición parenteral antes de infundir dextrosa.',
      isAbnormal: true,
    };
  }
  if (stdStudy.id === 'hosp-vitamina-b12-folato' && hasAlcoholOrMalnutrition) {
    return {
      ...stdStudy,
      result: 'Ácido fólico sérico (B9): 2.4 ng/mL (BAJO) | Vitamina B12: 245 pg/mL (limítrofe) | Homocisteína: 19.8 µmol/L.',
      interpretation: 'Deficiencia de folato asociada a ingesta pobre o hepatopatía crónica.',
      isAbnormal: true,
    };
  }

  // Vitamina D en adulto mayor, osteoporosis, fractura o enfermedad renal
  if (
    stdStudy.id === 'hosp-vitamina-d' &&
    (cCase.patientInfo.age >= 68 || isRenal || /osteoporos|fractura|cadera|osteomalac/.test(textPool))
  ) {
    return {
      ...stdStudy,
      result: `25-OH-Vitamina D total: ${isRenal ? '16.8' : '14.5'} ng/mL (DEFICIENCIA) | PTH intacta: ${isRenal ? '108' : '76'} pg/mL.`,
      interpretation: 'Hipovitaminosis D con elevación compensatoria de PTH acorde al perfil óseo/renal o edad avanzada del paciente.',
      isAbnormal: true,
    };
  }

  // Electromiografía y VCN contextual en patologías neuromusculares o compresivas
  if (stdStudy.id === 'hosp-emg-extremidades') {
    if (/guillain|desmieliniz|polineuropat/.test(textPool)) {
      return {
        ...stdStudy,
        result: 'Enlentecimiento marcado de velocidades de conducción motora (<35 m/s), latencias distales prolongadas y ausencia bilateral de ondas F y reflejos H.',
        interpretation: 'Patrón electrofisiológico de polineuropatía desmielinizante aguda.',
        isAbnormal: true,
      };
    }
    if (/radiculopat|ciatic|hernia discal|cauda equina/.test(textPool)) {
      return {
        ...stdStudy,
        result: 'Potenciales de fibrilación y ondas positivas agudas en musculatura paravertebral y miotoma distal L5-S1 ipsilateral, con prolongación de latencia de reflejo H.',
        interpretation: 'Signos electromiográficos de denervación radicular aguda/subaguda.',
        isAbnormal: true,
      };
    }
    if (/miopat|rabdomiolis|polimiosit/.test(textPool)) {
      return {
        ...stdStudy,
        result: 'Potenciales de unidad motora (PUM) de corta duración, baja amplitud y morfología polifásica con reclutamiento precoz en musculatura proximal; VCN sensitivo-motoras preservadas.',
        interpretation: 'Patrón electromiográfico miopático proximal sin compromiso neuropático primario.',
        isAbnormal: true,
      };
    }
  }
  if (stdStudy.id === 'hosp-emg-estimulacion-repetitiva' && /miasten|botulism|placa neuromuscular/.test(textPool)) {
    return {
      ...stdStudy,
      result: 'Estimulación nerviosa repetitiva a 3 Hz: decremento patológico del 22% entre el primer y cuarto potencial compuesto (CMAP) en músculo orbicular del ojo y trapecio, con facilitación post-ejercicio.',
      interpretation: 'Prueba de Jolly francamente positiva compatible con trastorno postsináptico de la unión neuromuscular (Miastenia Gravis).',
      isAbnormal: true,
    };
  }

  // Endoscopia, Colonoscopia y Broncoscopia contextuales en casos dinámicos o generados con IA
  if (
    stdStudy.id === 'hosp-endoscopia-alta' &&
    /hematemes|melena|ulcera peptica|varices|esofag|gastrit|disfagia|helicobacter|erge|hemorragia digestiva alta/.test(textPool)
  ) {
    return {
      ...stdStudy,
      result: 'Mucosa gastroduodenal/esofágica con hallazgos inflamatorios o erosivos activos concordantes con el cuadro digestivo alto; biopsias/ureasa tomadas para confirmación etiológica.',
      interpretation: 'Hallazgos endoscópicos altos compatibles con patología esofagogastroduodenal activa.',
      isAbnormal: true,
    };
  }
  if (
    stdStudy.id === 'hosp-colonoscopia' &&
    /hematoquez|rectorrag|cancer colon|colitis|crohn|diverticul|polipo|hemorragia digestiva baja|sangrado digestivo bajo/.test(textPool)
  ) {
    return {
      ...stdStudy,
      result: 'Alteración mucosa o lesión estructural en marco colónico (erosiones/úlceras friables o estigmas de sangrado distal); biopsias colónicas segmentarias obtenidas.',
      interpretation: 'Colonoscopia patológica concordante con compromiso colónico orgánico o sangrado digestivo bajo.',
      isAbnormal: true,
    };
  }
  if (
    stdStudy.id === 'hosp-broncoscopia' &&
    /hemoptis|cuerpo extrano|bronquiectas|tumor pulmonar|tuberculos|aspiracion|neumon|epoc/.test(textPool)
  ) {
    return {
      ...stdStudy,
      result: 'Inflamación mucosa bronquial segmentaria con secreciones mucopurulentas o restos hemáticos localizados; lavado broncoalveolar enviado a cultivo, baciloscopia y citología.',
      interpretation: 'Fibrobroncoscopia con alteraciones endobronquiales compatibles con patología broncopulmonar focal o infecciosa.',
      isAbnormal: true,
    };
  }

  // EEG dinámico en trastornos neurológicos, encefalopatías, crisis o alteración del Glasgow
  if (stdStudy.id === 'hosp-eeg') {
    if (/epilep|convuls|crisis|estatus|status/.test(textPool)) {
      return {
        ...stdStudy,
        result: 'Descargas epileptiformes interictales frecuentes tipo complejos punta-onda y ondas agudas focales/generalizadas con facilitación durante activación.',
        interpretation: 'EEG francamente patológico confirmatorio de hiperexcitabilidad cortical epileptogénica.',
        isAbnormal: true,
      };
    }
    if (vitals.glasgow <= 14 || /encefalop|mening|encefalit|delirium|coma|ictus|evc|cetoacidosis|tormenta tiroidea/.test(textPool)) {
      return {
        ...stdStudy,
        result: 'Actividad eléctrica cortical de fondo enlentecida en rango theta-delta (4–7 Hz) con desorganización del ritmo alfa posterior, sin actividad epileptiforme franca.',
        interpretation: 'Enlentecimiento bioeléctrico difuso o focal concordante con encefalopatía aguda o lesión cortical en curso.',
        isAbnormal: true,
      };
    }
  }

  // Espirometría en asma, EPOC, bronquiectasias o tabaquismo crónico
  if (stdStudy.id === 'hosp-espirometria') {
    if (/epoc|enfisema|bronquitis cronica/.test(textPool)) {
      return {
        ...stdStudy,
        result: 'Basal: FEV₁/FVC: 0.58 | FEV₁ 62% del predicho. Post-broncodilatador: FEV₁/FVC: 0.59, cambio en FEV₁ de +5% (<12%).',
        interpretation: 'Limitación crónica persistente al flujo aéreo no completamente reversible compatible con EPOC.',
        isAbnormal: true,
      };
    }
    if (/asma|broncoespasmo|sibilanc|bronquiectas/.test(textPool)) {
      return {
        ...stdStudy,
        result: 'Patrón obstructivo con relación FEV₁/FVC reducida (0.64) y FEV₁ en 72% del predicho; respuesta significativa tras broncodilatador cuando hay componente reversible (+15% en FEV₁).',
        interpretation: 'Alteración ventilatoria obstructiva congruente con patología bronquial.',
        isAbnormal: true,
      };
    }
  }

  // Audiometría en otitis, hipoacusia o síndrome vestibular periférico
  if (stdStudy.id === 'hosp-audiometria' && /otitis|hipoacusia|sordera|laberint|meniere|acufeno|tinnitus/.test(textPool)) {
    return {
      ...stdStudy,
      result: 'Alteración de umbrales auditivos (hipoacusia conductiva con timpanometría tipo B en derrame de oído medio o caída tonal neurosensorial en afección coclear).',
      interpretation: 'Alteración audiométrica congruente con compromiso otológico/coclear.',
      isAbnormal: true,
    };
  }

  // Holter 24h en arritmias, palpitaciones, síncope o cardioembolismo
  if (stdStudy.id === 'hosp-holter-24h' && (isCardiac || /sincope|palpitac|fibrilacion|taquicard|bloqueo|ictus|evc/.test(textPool))) {
    return {
      ...stdStudy,
      result: 'Registro ambulatorio con episodios intermitentes de taquiarritmia supraventricular / fibrilación auricular paroxística o ectopia ventricular frecuente concordante con clínica.',
      interpretation: 'Monitoreo Holter positivo para trastorno arrítmico paroxístico o carga ectópica significativa.',
      isAbnormal: true,
    };
  }

  // Holter de Presión Arterial / MAPA 24h dinámico acorde a cifras tensionales del caso
  if (stdStudy.id === 'hosp-holter-presion-mapa') {
    const bpParts = vitals.bloodPressure.match(/(\d{2,3})\s*\/\s*(\d{2,3})/);
    const sys = bpParts ? parseInt(bpParts[1], 10) : 120;
    const dia = bpParts ? parseInt(bpParts[2], 10) : 78;
    const hr = vitals.heartRate || 76;

    if (sys >= 140 || dia >= 90) {
      const daySys = sys;
      const dayDia = dia;
      const isChronicNonDipper = /hipertension|renal|preeclampsia|ictus|evc|diabet/.test(textPool);
      const dipFactor = isChronicNonDipper ? 0.93 : 0.88;
      const nightSys = Math.round(daySys * dipFactor);
      const nightDia = Math.round(dayDia * dipFactor);
      const mean24Sys = Math.round(daySys * 0.65 + nightSys * 0.35);
      const mean24Dia = Math.round(dayDia * 0.65 + nightDia * 0.35);
      const dipPct = (((daySys - nightSys) / daySys) * 100).toFixed(1);
      return {
        ...stdStudy,
        result: `Promedio global 24 horas: ${mean24Sys}/${mean24Dia} mmHg (FC media ${hr} lpm). Periodo diurno (07:00–22:00): ${daySys}/${dayDia} mmHg | Periodo nocturno (22:00–07:00): ${nightSys}/${nightDia} mmHg. Descenso nocturno: ${dipPct}% sistólico (${isChronicNonDipper ? 'patrón non-dipper / atenuado' : 'respuesta hipertensiva sostenida'}). Carga hipertensiva elevada (>75%).`,
        interpretation: isChronicNonDipper
          ? 'Perfil MAPA hipertensivo sostenido con descenso nocturno atenuado (non-dipper), acorde a descontrol tensional sistémico o hipertensión reactiva aguda.'
          : 'Elevación tensional sostenida en el registro de 24 horas concordante con descarga simpática, dolor o estrés agudo.',
        isAbnormal: true,
      };
    }

    if (sys <= 95 || /choque|shock|hipotens|anafilaxia|suprarrenal|addison|hemorrag/.test(textPool)) {
      const daySys = Math.min(sys, 94);
      const dayDia = Math.min(dia, 60);
      const nightSys = Math.max(68, Math.round(daySys * 0.94));
      const nightDia = Math.max(42, Math.round(dayDia * 0.93));
      const mean24Sys = Math.round(daySys * 0.65 + nightSys * 0.35);
      const mean24Dia = Math.round(dayDia * 0.65 + nightDia * 0.35);
      return {
        ...stdStudy,
        result: `Promedio global 24 horas: ${mean24Sys}/${mean24Dia} mmHg (FC media ${hr} lpm). Periodo diurno: ${daySys}/${dayDia} mmHg | Periodo nocturno: ${nightSys}/${nightDia} mmHg. Episodios sostenidos de hipotensión arterial (<90/60 mmHg) con taquicardia compensatoria (Nota: en inestabilidad aguda priorizar reanimación inmediata).`,
        interpretation: 'Perfil tensional hipotensivo concordante con hipoperfusión / depleción de volumen o choque agudo.',
        isAbnormal: true,
      };
    }
  }

  // Ecocardiograma Transtorácico y NT-proBNP en patología cardíaca, TEP, sepsis grave o disnea
  if (stdStudy.id === 'hosp-ecocardiograma' && (isCardiac || /tromboembol|pericard|taponamiento|endocard|insuficiencia cardiaca|choque|sepsis/.test(textPool))) {
    return {
      ...stdStudy,
      result: 'Alteración ecocardiográfica concordante con el cuadro hemodinámico (disfunción segmentaria/global ventricular, sobrecarga de cavidades derechas o derrame pericárdico según etiología).',
      interpretation: 'ECOTT patológico coherente con compromiso cardíaco estructural o hemodinámico.',
      isAbnormal: true,
    };
  }
  if (stdStudy.id === 'hosp-pro-bnp' && (isCardiac || /insuficiencia cardiaca|edema pulmonar|tromboembol|tep|disnea/.test(textPool))) {
    return {
      ...stdStudy,
      result: 'NT-proBNP sérico: 1,680 pg/mL (ELEVADO).',
      interpretation: 'Sobrecarga mecánica y estrés parietal ventricular significativo.',
      isAbnormal: true,
    };
  }

  // Radiografía ósea/columna en traumatología o artritis
  if (stdStudy.id === 'hosp-rx-osea' && (spec === 'traumatologia' || /fractur|luxacion|artritis|lumbalgia|hernia discal|cauda equina|osteomalacia/.test(textPool))) {
    return {
      ...stdStudy,
      result: /fractur|luxacion/.test(textPool)
        ? 'Solución de continuidad cortical / pérdida de congruencia articular compatible con lesión ósea traumática aguda.'
        : 'Cambios degenerativos leves / rectificación muscular antálgica sin fractura aguda desplazada.',
      interpretation: 'Hallazgos radiográficos osteoarticulares congruentes con el cuadro musculoesquelético.',
      isAbnormal: true,
    };
  }

  // HbA1c y perfil lipídico en diabetes, cetoacidosis, cardiopatía isquémica o síndrome metabólico
  if (stdStudy.id === 'hosp-hba1c-lipidos' && (/diabet|cetoacidosis|hiperosmolar|infarto|angina|ictus|metabolic|dislipid/.test(textPool) || (vitals.bloodGlucose && vitals.bloodGlucose >= 180))) {
    return {
      ...stdStudy,
      result: `HbA1c: ${vitals.bloodGlucose && vitals.bloodGlucose >= 180 ? '9.8%' : '6.8%'} | Colesterol Total: 238 mg/dL | LDL: 156 mg/dL | Triglicéridos: 220 mg/dL.`,
      interpretation: 'Descontrol glucémico crónico y/o dislipidemia aterogénica relevante.',
      isAbnormal: true,
    };
  }

  // Perfil férrico en anemias o sangrado digestivo
  if (stdStudy.id === 'hosp-perfil-ferrico' && /anemia|ferropen|hemorrag|melena|hematemes|hipermenorrea|ulcera/.test(textPool)) {
    return {
      ...stdStudy,
      result: 'Hierro sérico: 28 mcg/dL (BAJO) | Ferritina sérica: 9 ng/mL (BAJA) | TIBC: 425 mcg/dL | Saturación de transferrina: 7%.',
      interpretation: 'Depleción severa de reservas férricas compatible con anemia ferropénica o pérdida hemática.',
      isAbnormal: true,
    };
  }

  // Panel autoinmune en lupus, vasculitis, artritis o enfermedades inflamatorias sistémicas
  if (stdStudy.id === 'hosp-panel-autoinmune' && /lupus|artritis|vasculit|autoinmun|serositis|hashimoto|tiroiditis/.test(textPool)) {
    return {
      ...stdStudy,
      result: 'Anticuerpos Antinucleares (ANA) positivos a título significativo (1:320) y/o descenso de complemento C3/C4 concordante con actividad inmunológica.',
      interpretation: 'Perfil serológico autoinmune positivo orientativo hacia enfermedad reumatológica o autoinmune sistémica.',
      isAbnormal: true,
    };
  }

  // Tamizaje toxicológico en intoxicaciones o alteración del estado mental
  if (stdStudy.id === 'hosp-toxicologico' && /intoxicac|sobredos|litio|triciclic|paracetamol|serotonin|etanol|alcohol|delirium/.test(textPool)) {
    return {
      ...stdStudy,
      result: 'Detección positiva o niveles tóxicos del fármaco/sustancia implicada en el cuadro clínico agudo (confirmar con niveles séricos cuantitativos).',
      interpretation: 'Tamizaje toxicológico positivo congruente con cuadro de intoxicación o exposición farmacológica.',
      isAbnormal: true,
    };
  }

  // Estudio coprológico en diarrea infecciosa o inflamatoria
  if (stdStudy.id === 'hosp-coprologico' && /diarrea|gastroenterit|colitis|hematoquez|disenter|crohn|ulcerosa/.test(textPool)) {
    return {
      ...stdStudy,
      result: 'Leucocitos fecales elevados y/o sangre oculta positiva en heces; muestras enviadas para coprocultivo, parásitos y toxina de C. difficile.',
      interpretation: 'Coprológico compatible con proceso inflamatorio o infeccioso enterocólico.',
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
  if ((n1.includes('orina') || n1.includes('ego') || n1.includes('urianálisis')) && !n1.includes('toxicol')) {
    return (n2.includes('orina') || n2.includes('ego') || n2.includes('urianálisis')) && !n2.includes('toxicol');
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
  if (n1.includes('vitamina b12') || n1.includes('cobalamina') || n1.includes('ácido fólico')) {
    return n2.includes('vitamina b12') || n2.includes('cobalamina') || n2.includes('ácido fólico');
  }
  if (n1.includes('vitamina d') || n1.includes('25-oh')) {
    return n2.includes('vitamina d') || n2.includes('25-oh');
  }
  if (n1.includes('vitamina b1') || n1.includes('tiamina') || n1.includes('neurotrópicas')) {
    return n2.includes('vitamina b1') || n2.includes('tiamina') || n2.includes('neurotrópicas');
  }
  if (n1.includes('vitaminas a, c, e') || n1.includes('liposolubles')) {
    return n2.includes('vitaminas a, c, e') || n2.includes('liposolubles');
  }
  if (n1.includes('mediano') || n1.includes('túnel del carpo') || n1.includes('tunel del carpo')) {
    return n2.includes('mediano') || n2.includes('túnel del carpo') || n2.includes('tunel del carpo');
  }
  if (n1.includes('estimulación nerviosa repetitiva') || n1.includes('jolly')) {
    return n2.includes('estimulación nerviosa repetitiva') || n2.includes('jolly');
  }
  if ((n1.includes('electromiografía') || n1.includes('electromiografia') || n1.includes('conducción nerviosa')) && !n1.includes('mediano') && !n1.includes('repetitiva')) {
    return (n2.includes('electromiografía') || n2.includes('electromiografia') || n2.includes('conducción nerviosa')) && !n2.includes('mediano') && !n2.includes('repetitiva');
  }
  if (n1.includes('endoscopia digestiva alta') || n1.includes('panendoscopia') || n1.includes('esofagogastroduodenoscopia')) {
    return n2.includes('endoscopia digestiva alta') || n2.includes('panendoscopia') || n2.includes('esofagogastroduodenoscopia');
  }
  if (n1.includes('colonoscopia')) {
    return n2.includes('colonoscopia');
  }
  if (n1.includes('broncoscopia') || n1.includes('fibrobroncoscopia')) {
    return n2.includes('broncoscopia') || n2.includes('fibrobroncoscopia');
  }
  if (n1.includes('electroencefalograma') || /\beeg\b/.test(n1)) {
    return n2.includes('electroencefalograma') || /\beeg\b/.test(n2);
  }
  if (n1.includes('potenciales evocados')) {
    return n2.includes('potenciales evocados');
  }
  if (n1.includes('espirometr')) {
    return n2.includes('espirometr');
  }
  if (n1.includes('audiometr') || n1.includes('timpanometr')) {
    return n2.includes('audiometr') || n2.includes('timpanometr');
  }
  const isBpHolter1 = n1.includes('mapa') || (n1.includes('holter') && (n1.includes('presión') || n1.includes('presion')));
  const isBpHolter2 = n2.includes('mapa') || (n2.includes('holter') && (n2.includes('presión') || n2.includes('presion')));
  if (isBpHolter1 || isBpHolter2) {
    return isBpHolter1 && isBpHolter2;
  }
  if (n1.includes('holter') && !isBpHolter1) {
    return n2.includes('holter') && !isBpHolter2;
  }
  if (n1.includes('ecocardiograma') || n1.includes('ecott')) {
    return n2.includes('ecocardiograma') || n2.includes('ecott');
  }
  const isBoneRx1 =
    n1.includes('radiografía osteoarticular') ||
    n1.includes('radiografia osteoarticular') ||
    n1.includes('radiografía de cadera') ||
    n1.includes('radiografia de cadera') ||
    n1.includes('radiografía ap') ||
    n1.includes('radiografia ap') ||
    n1.includes('radiografía de tobillo') ||
    n1.includes('radiografia de tobillo') ||
    (n1.includes('radiografía') && (n1.includes('pierna') || n1.includes('tibia') || n1.includes('lumbar')));
  const isBoneRx2 =
    n2.includes('radiografía osteoarticular') ||
    n2.includes('radiografia osteoarticular') ||
    n2.includes('radiografía de cadera') ||
    n2.includes('radiografia de cadera') ||
    n2.includes('radiografía ap') ||
    n2.includes('radiografia ap') ||
    n2.includes('radiografía de tobillo') ||
    n2.includes('radiografia de tobillo') ||
    (n2.includes('radiografía') && (n2.includes('pierna') || n2.includes('tibia') || n2.includes('lumbar')));
  if (isBoneRx1 && isBoneRx2) {
    return true;
  }
  if (n1.includes('probnp') || n1.includes('pro-bnp') || /\bbnp\b/.test(n1) || n1.includes('péptido natriurético')) {
    return n2.includes('probnp') || n2.includes('pro-bnp') || /\bbnp\b/.test(n2) || n2.includes('péptido natriurético');
  }
  if (n1.includes('hba1c') || n1.includes('hemoglobina glucosilada')) {
    return n2.includes('hba1c') || n2.includes('hemoglobina glucosilada');
  }
  if (n1.includes('perfil de hierro') || n1.includes('ferritina')) {
    return n2.includes('perfil de hierro') || n2.includes('ferritina');
  }
  if (n1.includes('panel autoinmune') || (n1.includes('ana') && n1.includes('factor reumatoide'))) {
    return n2.includes('panel autoinmune') || (n2.includes('ana') && n2.includes('factor reumatoide'));
  }
  if (n1.includes('toxicol')) {
    return n2.includes('toxicol');
  }
  if (n1.includes('coprol') || n1.includes('coproparasitosc')) {
    return n2.includes('coprol') || n2.includes('coproparasitosc');
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
