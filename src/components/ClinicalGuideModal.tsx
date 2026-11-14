import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  X,
  BookOpen,
  Search,
  Flame,
  HeartPulse,
  Microscope,
  Stethoscope,
  FlaskConical,
  AlertTriangle,
  CheckCircle2,
  Bookmark,
  GraduationCap,
} from 'lucide-react';

interface ClinicalGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type GuideCategory =
  | 'urgencias'
  | 'cardio_neumo'
  | 'infecto_nefro'
  | 'cirugia_pediatria'
  | 'endocrino_tox_rangos';

interface AcademicGuideCard {
  id: string;
  category: GuideCategory;
  title: string;
  source: string;
  summary: string;
  sections: Array<{
    subtitle: string;
    items: string[];
  }>;
  table?: {
    headers: string[];
    rows: string[][];
  };
  safetyRule?: string;
  examPearl?: string;
}

const CATEGORIES: Array<{
  id: GuideCategory;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { id: 'urgencias', label: 'Urgencias & Reanimación', shortLabel: 'Urgencias', icon: Flame },
  { id: 'cardio_neumo', label: 'Cardiología & Neumología', shortLabel: 'Cardio/Neumo', icon: HeartPulse },
  { id: 'infecto_nefro', label: 'Infectología & Nefrología', shortLabel: 'Infecto/Nefro', icon: Microscope },
  { id: 'cirugia_pediatria', label: 'Cirugía, Abdomen & Pediatría', shortLabel: 'Cirugía/Ped', icon: Stethoscope },
  { id: 'endocrino_tox_rangos', label: 'Endocrino, Tox & Rangos', shortLabel: 'Endocrino/Rangos', icon: FlaskConical },
];

const ACADEMIC_GUIDES: AcademicGuideCard[] = [
  // 1. URGENCIAS & REANIMACIÓN
  {
    id: 'abcde-critico',
    category: 'urgencias',
    title: 'Abordaje Primario Estructurado ABCDE en Paciente Crítico',
    source: 'ATLS 10.ª Ed. / ERC / AHA',
    summary:
      'Secuencia jerárquica obligatoria para identificar y tratar amenazas vitales inmediatas en orden de letalidad, reevaluando tras cada intervención.',
    sections: [
      {
        subtitle: 'Secuencia Operativa Paso a Paso',
        items: [
          'A (Airway / Vía Aérea): Permeabilidad, estridor, edema laríngeo, secreciones y protección cervical si hay trauma. Glasgow ≤ 8 exige intubación orotraqueal.',
          'B (Breathing / Ventilación): Frecuencia respiratoria, trabajo respiratorio, simetría torácica, auscultación y SpO₂. Administrar O₂ suplementario si SpO₂ < 94% (meta 88–92% en EPOC retenedor).',
          'C (Circulation / Circulación): PA, PAM (meta ≥ 65 mmHg), FC, llenado capilar (>2 s = hipoperfusión), accesos venosos gruesos (14–16G), toma de lactato y reposición con cristaloides balanceados.',
          'D (Disability / Déficit Neurológico): Escala de Glasgow, pupilas (tamaño y reactividad), signos meníngeos y glucemia capilar inmediata ("no olvidar la glucosa en todo deterioro neurológico").',
          'E (Exposure / Exposición): Búsqueda dirigida de petequias, urticaria, vesículas, Nikolsky, trauma oculto y control térmico evitando hipotermia.',
        ],
      },
    ],
    safetyRule: 'Nunca pasar al siguiente eslabón sin corregir una amenaza inmediata en A, B o C.',
  },
  {
    id: 'sepsis-bundle',
    category: 'urgencias',
    title: 'Sepsis y Choque Séptico: Criterios y Paquete de la Primera Hora',
    source: 'Surviving Sepsis Campaign (SSC 2021)',
    summary:
      'Disfunción orgánica potencialmente mortal causada por una respuesta desregulada del huésped a la infección (incremento agudo de ≥ 2 puntos en la escala SOFA).',
    sections: [
      {
        subtitle: 'Paquete Terapéutico de la 1.ª Hora (Hour-1 Bundle)',
        items: [
          'Medir lactato sérico basal y repetir a las 2–4 horas si el inicial es > 2.0 mmol/L.',
          'Obtener 2 sets de hemocultivos (aerobio/anaerobio) ANTES de iniciar antibióticos, sin retrasar su administración > 45 minutos.',
          'Iniciar antimicrobianos intravenosos de amplio espectro lo antes posible (idealmente < 1 hora en choque séptico).',
          'Administrar cristaloides balanceados (Ringer Lactato) a 30 mL/kg IV en las primeras 3 horas si hay hipotensión o lactato ≥ 4 mmol/L.',
          'Iniciar vasopresor de primera línea (Noradrenalina) si persiste hipotensión durante o tras la reanimación hídrica para mantener PAM ≥ 65 mmHg.',
        ],
      },
    ],
    table: {
      headers: ['Herramienta', 'Variables Evaluadas', 'Umbral de Alarma'],
      rows: [
        ['qSOFA (tamizaje)', 'FR ≥ 22 rpm · Alteración mental · PAS ≤ 100 mmHg', '≥ 2 criterios → sospechar disfunción orgánica'],
        ['Choque Séptico', 'Sepsis + necesidad de vasopresores para PAM ≥ 65 + Lactato > 2 mmol/L', 'Mortalidad hospitalaria > 40%'],
      ],
    },
    examPearl: 'La Noradrenalina es el vasopresor de elección inicial sobre Dopamina (menor riesgo de arritmias).',
  },
  {
    id: 'anafilaxia-wao',
    category: 'urgencias',
    title: 'Anafilaxia Grave y Choque Anafiláctico',
    source: 'World Allergy Organization (WAO 2020) / EAACI',
    summary:
      'Reacción de hipersensibilidad sistémica aguda potencialmente mortal de inicio en minutos a pocas horas tras exposición al alérgeno.',
    sections: [
      {
        subtitle: 'Manejo Farmacológico y Postural de Emergencia',
        items: [
          'Primera línea absoluta e irreemplazable: Adrenalina (Epinefrina) 1:1,000 (1 mg/mL) a 0.01 mg/kg (máx. 0.5 mg en adultos; 0.3 mg en escolares) por vía INTRAMUSCULAR en cara anterolateral del muslo.',
          'Repetir adrenalina IM cada 5–15 minutos si no hay mejoría hemodinámica o respiratoria.',
          'Posición en decúbito supino con extremidades inferiores elevadas (o semisentado solo si hay disnea grave sin hipotensión).',
          'Bolo rápido de cristaloide IV (1,000–2,000 mL en adultos) y oxígeno de alto flujo con mascarilla reservorio.',
          'Antihistamínicos (Difenhidramina) y corticoides (Hidrocortisona/Metilprednisolona) son EXCLUSIVAMENTE coadyuvantes de segunda línea.',
        ],
      },
    ],
    safetyRule:
      'ERROR CRÍTICO: Aplicar solo corticoides/antihistamínicos sin Adrenalina IM, o poner de pie al paciente en choque anafiláctico (riesgo de síndrome del ventrículo vacío y paro súbito).',
  },
  {
    id: 'glasgow-scale',
    category: 'urgencias',
    title: 'Escala de Coma de Glasgow (GCS) e Implicaciones Clínicas',
    source: 'Brain Trauma Foundation / ATLS',
    summary: 'Evaluación estandarizada del estado de alerta de 3 a 15 puntos según respuesta ocular, verbal y motora.',
    table: {
      headers: ['Puntaje', 'Respuesta Ocular (1–4)', 'Respuesta Verbal (1–5)', 'Respuesta Motora (1–6)'],
      rows: [
        ['6', '—', '—', 'Obedece órdenes'],
        ['5', '—', 'Orientado y conversa', 'Localiza el estímulo doloroso'],
        ['4', 'Espontánea', 'Desorientado / confuso', 'Retirada normal al dolor'],
        ['3', 'Al estímulo verbal', 'Palabras inapropiadas', 'Flexión anormal (decorticación)'],
        ['2', 'Al estímulo doloroso', 'Sonidos incomprensibles', 'Extensión anormal (descerebración)'],
        ['1', 'Ninguna apertura ocular', 'Sin respuesta verbal', 'Sin respuesta motora (flacidez)'],
      ],
    },
    sections: [
      {
        subtitle: 'Clasificación del Compromiso Neurológico',
        items: [
          'Leve: 13–15 puntos · Moderado: 9–12 puntos · Grave / Coma: ≤ 8 puntos (indicación estándar de asegurar vía aérea).',
        ],
      },
    ],
  },

  // 2. CARDIOLOGÍA & NEUMOLOGÍA
  {
    id: 'iamcest-killip',
    category: 'cardio_neumo',
    title: 'Síndrome Coronario Agudo con Elevación del ST (IAMCEST) y Killip-Kimball',
    source: 'ESC Guidelines 2023 / AHA-ACC',
    summary:
      'Oclusión trombótica aguda total de una arteria coronaria epicárdica que exige reperfusión inmediata ("el tiempo es miocardio").',
    sections: [
      {
        subtitle: 'Criterios ECG y Localización Topográfica',
        items: [
          'Supradesnivel del punto J en ≥ 2 derivaciones contiguas: ≥ 2 mm en V2–V3 (hombres ≥ 40 años; ≥ 2.5 mm en < 40 años; ≥ 1.5 mm en mujeres) y ≥ 1 mm en las demás derivaciones.',
          'Cara Anterior / Septal (Arteria Descendente Anterior): V1–V4. Lateral: I, aVL, V5–V6. Inferior (Coronaria Derecha o Circunfleja): II, III, aVF.',
          'Terapia inicial: ECG en < 10 min, Aspirina 300 mg masticada + inhibidor P2Y12 (Ticagrelor o Clopidogrel) + Anticoagulación + Reperfusión urgente (ICP primaria < 90–120 min o fibrinólisis < 30 min si no hay hemodinamia).',
        ],
      },
    ],
    table: {
      headers: ['Clase Killip', 'Hallazgos a la Exploración Física', 'Mortalidad Intrahospitalaria'],
      rows: [
        ['Clase I', 'Sin signos de falla cardíaca ni estertores ni R3', '~6%'],
        ['Clase II', 'Estertores crepitantes en < 50% de campos pulmonares, R3 o ingurgitación yugular', '~17%'],
        ['Clase III', 'Edema agudo de pulmón franco (estertores en > 50% de campos)', '~38%'],
        ['Clase IV', 'Choque cardiogénico (PAS < 90 mmHg + signos de hipoperfusión periférica/oliguria)', '~80%'],
      ],
    },
    safetyRule:
      'En infarto de cara inferior (II, III, aVF) obtener derivaciones derechas (V3R, V4R); si hay extensión al ventrículo derecho están contraindicados Nitroglicerina y Morfina por riesgo de colapso de precarga.',
  },
  {
    id: 'tep-wells',
    category: 'cardio_neumo',
    title: 'Tromboembolia Pulmonar (TEP): Regla de Wells y Abordaje Diagnóstico',
    source: '2019 ESC Guidelines for Acute Pulmonary Embolism',
    summary:
      'Obstrucción de la circulación arterial pulmonar por émbolos procedentes habitualmente de trombosis venosa profunda (TVP) iliofemoral.',
    table: {
      headers: ['Criterio Clínico de Wells', 'Puntaje'],
      rows: [
        ['Signos y síntomas clínicos de TVP (edema asimétrico y dolor a la palpación)', '+3.0'],
        ['Diagnóstico alternativo menos probable que TEP', '+3.0'],
        ['Frecuencia cardíaca > 100 lpm', '+1.5'],
        ['Inmovilización ≥ 3 días o cirugía en las últimas 4 semanas', '+1.5'],
        ['Antecedente previo de TVP o TEP objetivado', '+1.5'],
        ['Hemoptisis', '+1.0'],
        ['Cáncer activo (en tratamiento o en los últimos 6 meses)', '+1.0'],
      ],
    },
    sections: [
      {
        subtitle: 'Algoritmo de Decisión Según Probabilidad',
        items: [
          'Wells ≤ 4 (TEP improbable): Solicitar Dímero D cuantitativo. Si es negativo (< 500 ng/mL o ajustado a edad: edad × 10 en > 50 años), descarta TEP de forma segura.',
          'Wells > 4 (TEP probable) o Dímero D elevado: Realizar Angio-TAC de arterias pulmonares e iniciar anticoagulación (HBPM / HNF) de inmediato salvo sangrado activo.',
          'Signos ECG clásicos: Taquicardia sinusal (el más frecuente), inversión de onda T en V1–V4 y patrón S1Q3T3.',
        ],
      },
    ],
  },
  {
    id: 'curb65-nac',
    category: 'cardio_neumo',
    title: 'Neumonía Adquirida en la Comunidad (NAC) y Escala CURB-65',
    source: 'BTS / IDSA-ATS 2019 / NICE NG191',
    summary:
      'Estratificación de gravedad para definir manejo ambulatorio, hospitalización en sala general o ingreso a Unidad de Cuidados Intensivos.',
    table: {
      headers: ['Sigla', 'Criterio Clínico o Bioquímico', 'Puntos'],
      rows: [
        ['C', 'Confusión mental de nueva aparición (desorientación en tiempo, lugar o persona)', '1 pt'],
        ['U', 'Urea > 42 mg/dL (7 mmol/L) o BUN > 19–20 mg/dL', '1 pt'],
        ['R', 'Frecuencia Respiratoria ≥ 30 respiraciones/minuto', '1 pt'],
        ['B', 'Blood Pressure: PAS < 90 mmHg o PAD ≤ 60 mmHg', '1 pt'],
        ['65', 'Edad ≥ 65 años', '1 pt'],
      ],
    },
    sections: [
      {
        subtitle: 'Conducta Terapéutica según Puntaje',
        items: [
          '0–1 punto (Mortalidad < 1.5%): Manejo ambulatorio (ej. Amoxicilina o Doxiciclina/Macrólido si comorbilidad).',
          '2 puntos (Mortalidad ~9%): Hospitalización en sala o vigilancia hospitalaria estrecha.',
          '3–5 puntos (Mortalidad 15–40%): Neumonía grave; ingreso hospitalario urgente y valorar UCI. Esquema estándar: Betalactámico IV (Ceftriaxona o Ampicilina/Sulbactam) + Macrólido (Azitromicina) o Fluoroquinolona respiratoria.',
        ],
      },
    ],
  },
  {
    id: 'gasometria-acidobase',
    category: 'cardio_neumo',
    title: 'Interpretación Sistemática de Gasometría Arterial (GSA) y Ácido-Base',
    source: 'Fisiología Clínica Respiratoria y Renal / Harrison',
    summary:
      'Lectura en 4 pasos para identificar trastorno primario, compensación fisiológica, brecha aniónica y oxigenación arterial.',
    sections: [
      {
        subtitle: 'Método en 4 Pasos Clínicos',
        items: [
          'Paso 1 (pH): < 7.35 = Acidemia | > 7.45 = Alcalemia (valores normales: 7.35–7.45).',
          'Paso 2 (Componente primario): Si pH y PaCO₂ cambian en direcciones opuestas = trastorno respiratorio; si pH y HCO₃⁻ cambian en la misma dirección = trastorno metabólico.',
          'Paso 3 (Compensación - Fórmula de Winter en acidosis metabólica): PaCO₂ esperada = (1.5 × HCO₃⁻) + 8 ± 2 mmHg. Si la PaCO₂ real es mayor a la esperada, coexiste acidosis respiratoria.',
          'Paso 4 (Anion Gap en acidosis metabólica): AG = Na⁺ - (Cl⁻ + HCO₃⁻) [Normal: 8–12 mEq/L]. Anion gap elevado ("MUDPILES": Lactato, Cetoacidosis, Falla renal/uremia, Tóxicos).',
        ],
      },
    ],
    table: {
      headers: ['Parámetro', 'Rango Normal', 'Interpretación Clave'],
      rows: [
        ['pH arterial', '7.35 – 7.45', 'Riesgo de disfunción enzimática/arrítmica con pH < 7.20'],
        ['PaCO₂', '35 – 45 mmHg', 'Refleja ventilación alveolar (>45 = hipoventilación/hipercapnia)'],
        ['HCO₃⁻ real', '22 – 26 mEq/L', 'Componente metabólico regulado por riñón'],
        ['PaO₂ / SaO₂', '80–100 mmHg / 95–100%', 'PaO₂ < 60 mmHg (SaO₂ < 90%) = Insuficiencia respiratoria'],
        ['Lactato arterial', '< 2.0 mmol/L', '≥ 2.0–4.0 mmol/L indica metabolismo anaerobio o hipoperfusión'],
      ],
    },
  },

  // 3. INFECTOLOGÍA & NEFROLOGÍA
  {
    id: 'dengue-oms',
    category: 'infecto_nefro',
    title: 'Dengue: Fases Evolutivas, Signos de Alarma y Reposición Hídrica',
    source: 'OMS / OPS Directrices para el Diagnóstico y Tratamiento del Dengue (2022)',
    summary:
      'Enfermedad febril bifásica en la que la extravasación plasmática ocurre característicamente al caer la fiebre (días 3 a 7).',
    sections: [
      {
        subtitle: 'Signos de Alarma (Grupo B2 — Hospitalización Inmediata)',
        items: [
          'Dolor abdominal intenso y continuo o dolor a la palpación del abdomen.',
          'Vómitos persistentes (≥ 3 episodios en 1 hora o ≥ 4 en 6 horas).',
          'Acumulación clínica de líquidos (ascitis, derrame pleural o pericárdico).',
          'Sangrado activo de mucosas (gingivorragia, epistaxis, metrorragia, hematemesis/melena).',
          'Letargia, somnolencia o irritabilidad marcada; lipotimia o hipotensión postural.',
          'Hepatomegalia dolorosa > 2 cm por debajo del reborde costal.',
          'Aumento progresivo del hematocrito concomitante con descenso rápido de plaquetas (< 100,000/mm³).',
        ],
      },
      {
        subtitle: 'Esquema de Líquidos en Grupo B2 (OPS)',
        items: [
          'Iniciar cristaloide isotónico (Solución Salina 0.9% o Ringer Lactato) a 10 mL/kg en 1 hora; reevaluar hematocrito, signos vitales y diuresis (meta ≥ 0.5 mL/kg/h) para descender progresivamente a 5–7 mL/kg/h y 3–5 mL/kg/h.',
          'Pruebas confirmatorias: Antígeno NS1 (días 1–5) e IgM específica (a partir del día 5–6).',
        ],
      },
    ],
    safetyRule:
      'PROHIBIDOS de forma absoluta todos los AINEs (Ibuprofeno, Naproxeno, Diclofenaco, Ketorolaco), Aspirina y corticoides por riesgo de hemorragia digestiva grave y síndrome de Reye. Usar solo Paracetamol y medios físicos.',
  },
  {
    id: 'meningitis-idSA',
    category: 'infecto_nefro',
    title: 'Meningitis Bacteriana Aguda: Criterios de TAC Previa, LCR y Empirismo',
    source: 'IDSA Guidelines / ESCMID Bacterial Meningitis',
    summary:
      'Emergencia infectológica y neurológica que exige iniciar antibioticoterapia + corticoide adyuvante sin demoras por neuroimagen.',
    sections: [
      {
        subtitle: 'Indicaciones de TAC de Cráneo ANTES de Punción Lumbar',
        items: [
          'Inmunosupresión conocida (VIH, trasplante, quimioterapia) o antecedente de enfermedad del SNC (masa, EVC, infección focal).',
          'Convulsiones de nueva aparición (en la última semana), papiledema, déficit neurológico focal o deterioro del nivel de conciencia.',
          'Si se pospone la PL por la TAC, tomar hemocultivos y administrar de INMEDIATO Dexametasona + Antibióticos empíricos.',
        ],
      },
      {
        subtitle: 'Tratamiento Empírico Inicial (Adultos 18–50 años)',
        items: [
          'Dexametasona 0.15 mg/kg (10 mg IV) cada 6 horas durante 4 días (primera dosis 15–20 min antes o junto al primer antibiótico).',
          'Ceftriaxona 2 g IV cada 12 horas + Vancomicina 15–20 mg/kg IV cada 8–12 horas (+ Ampicilina 2 g IV c/4h si > 50 años o inmunocompromiso por cobertura de Listeria).',
        ],
      },
    ],
    table: {
      headers: ['Tipo de Meningitis', 'Aspecto / Presión', 'Células (/mm³) y Predominio', 'Glucosa (LCR/Plasma)', 'Proteínas'],
      rows: [
        ['Normal', 'Límpido · 7–18 cmH₂O', '0–5 (Mononucleares)', '> 60% (> 45 mg/dL)', '15–45 mg/dL'],
        ['Bacteriana Aguda', 'Turbio / purulento · > 20', '1,000–5,000 (PMN > 80%)', 'Muy baja (< 40% o < 40 mg/dL)', 'Muy altas (> 100–500)'],
        ['Viral (Aséptica)', 'Claro · Normal o ↑ leve', '10–500 (Linfocitos)', 'Normal (> 50–60%)', 'Normales o ↑ leve (< 100)'],
        ['Tuberculosa', 'Xantocrómico · ↑', '50–500 (Linfocitos)', 'Baja (< 45%)', 'Muy altas (100–500)'],
      ],
    },
  },
  {
    id: 'lra-kdigo-hiperkalemia',
    category: 'infecto_nefro',
    title: 'Lesión Renal Aguda (KDIGO) e Hiperpotasemia con Riesgo Arrítmico',
    source: 'KDIGO Clinical Practice Guideline for AKI',
    summary:
      'Deterioro agudo de la filtración glomerular diagnosticado por elevación de creatinina sérica o caída del gasto urinario.',
    table: {
      headers: ['Estadio KDIGO', 'Criterio de Creatinina Sérica', 'Criterio de Diuresis'],
      rows: [
        ['Estadio 1', '↑ 1.5–1.9× respecto a basal o ↑ ≥ 0.3 mg/dL en 48 h', '< 0.5 mL/kg/h durante 6–12 horas'],
        ['Estadio 2', '↑ 2.0–2.9× respecto a basal', '< 0.5 mL/kg/h durante ≥ 12 horas'],
        ['Estadio 3', '↑ ≥ 3.0× basal, Cr ≥ 4.0 mg/dL o inicio de terapia dialítica', '< 0.3 mL/kg/h ≥ 24 h o anuria ≥ 12 h'],
      ],
    },
    sections: [
      {
        subtitle: 'Manejo Urgente de Hiperpotasemia Severa (K⁺ ≥ 6.0 o cambios ECG)',
        items: [
          '1. Estabilización de membrana miocárdica (no baja el K⁺, protege del paro): Gluconato de Calcio al 10% (1 g = 10 mL IV en 3–5 min) ante ondas T picudas, PR largo o QRS ancho.',
          '2. Redistribución intracelular (efecto rápido 15–30 min): Insulina regular 10 UI IV + Dextrosa al 50% (50 mL = 25 g glucosa) + Salbutamol nebulizado 10–20 mg.',
          '3. Eliminación corporal y retiro de nefrotóxicos: Suspender IECA/ARA-II/AINEs ("Triple Whammy"), Furosemida si hay respuesta diurética o Hemodiálisis de urgencia (AEIOU: Acidosis refractaria, Electrolitos/K⁺, Intoxicaciones, Overload/Sobrecarga, Uremia sintomática).',
        ],
      },
    ],
  },

  // 4. CIRUGÍA, ABDOMEN & PEDIATRÍA
  {
    id: 'alvarado-apendicitis',
    category: 'cirugia_pediatria',
    title: 'Apendicitis Aguda: Escala de Alvarado (MANTRELS) y Semiología',
    source: 'WSES Jerusalem Guidelines / Alvarado Score',
    summary: 'Herramienta clínica de 10 puntos para estratificar la probabilidad de apendicitis aguda en dolor de fosa ilíaca derecha.',
    table: {
      headers: ['Letra', 'Criterio Clínico o Paraclínico', 'Puntaje'],
      rows: [
        ['M', 'Migración del dolor (de epigastrio/periumbilical a FID)', '1 pt'],
        ['A', 'Anorexia / hiporexia', '1 pt'],
        ['N', 'Náuseas y/o vómitos', '1 pt'],
        ['T', 'Tenderness (dolor a la palpación en FID / punto de McBurney)', '2 pts'],
        ['R', 'Rebote peritoneal positivo (signo de Blumberg)', '1 pt'],
        ['E', 'Elevación de temperatura (> 37.3°C – 38°C)', '1 pt'],
        ['L', 'Leucocitosis (> 10,000 /mm³)', '2 pts'],
        ['S', 'Shift to the left (neutrofilia > 75%)', '1 pt'],
      ],
    },
    sections: [
      {
        subtitle: 'Conducta Clínica',
        items: [
          '0–3 pts: Baja probabilidad (considerar diagnósticos alternativos).',
          '4–6 pts: Probabilidad intermedia (realizar Ultrasonido o TAC de abdomen).',
          '7–10 pts: Alta probabilidad → Valoración quirúrgica inmediata para apendicectomía + profilaxis antibiótica preoperatoria.',
        ],
      },
    ],
  },
  {
    id: 'pancreatitis-atlanta',
    category: 'cirugia_pediatria',
    title: 'Pancreatitis Aguda (Criterios de Atlanta y Manejo Basado en Evidencia)',
    source: 'ACG Clinical Guideline 2024 / Revised Atlanta Classification',
    summary:
      'El diagnóstico requiere cumplir al menos 2 de 3 criterios: (1) dolor epigástrico irradiado en cinturón, (2) Lipasa/Amilasa ≥ 3× LSN, y (3) hallazgos característicos en imagen.',
    sections: [
      {
        subtitle: 'Pilares Actualizados del Tratamiento',
        items: [
          'Reanimación hídrica MODERADA guiada por metas con Ringer Lactato (preferible a NaCl 0.9%; bolo 10 mL/kg solo si hipovolemia, luego 1.5 mL/kg/h evitando sobrecarga masiva).',
          'Control del dolor con analgesia escalonada (Paracetamol + opioides titulados según necesidad).',
          'Realimentación oral temprana (dentro de 24–48 h en pancreatitis leve) en cuanto cedan dolor y náuseas; NO prolongar el ayuno innecesariamente.',
          'NO administrar antibióticos profilácticos en pancreatitis edematosa ni en necrosis estéril.',
          'En etiología biliar leve, realizar colecistectomía laparoscópica en el mismo ingreso hospitalario.',
        ],
      },
    ],
  },
  {
    id: 'ectopico-acog',
    category: 'cirugia_pediatria',
    title: 'Embarazo Ectópico Tubárico: Diagnóstico y Contraindicaciones de Metotrexato',
    source: 'ACOG Practice Bulletin No. 193 / NICE NG126',
    summary:
      'Toda mujer en edad fértil con dolor pélvico/abdominal y retraso menstrual o sangrado vaginal debe tener una β-hCG cuantitativa inmediata.',
    sections: [
      {
        subtitle: 'Claves Diagnósticas y Terapéuticas',
        items: [
          'Zona discriminatoria: con β-hCG > 1,500–3,500 mUI/mL y ausencia de saco gestacional intrauterino en ecografía transvaginal, sospechar gestación ectópica hasta demostrar lo contrario.',
          'Signo de Kehr (dolor referido al hombro por irritación frénica) + hipotensión/taquicardia = hemoperitoneo por ruptura tubárica → Laparoscopia/Laparotomía de urgencia inmediata.',
          'Si la paciente es Rh negativo: administrar Inmunoglobulina Anti-D (300 mcg IM).',
        ],
      },
    ],
    safetyRule:
      'El Metotrexato está ABSOLUTAMENTE CONTRAINDICADO si existe inestabilidad hemodinámica, signos de ruptura o hemoperitoneo, lactancia materna o disfunción hepatorrenal/hematológica.',
  },
  {
    id: 'bronquiolitis-aap',
    category: 'cirugia_pediatria',
    title: 'Bronquiolitis Aguda del Lactante (Menores de 2 Años)',
    source: 'AAP Clinical Practice Guideline / NICE NG9',
    summary:
      'Primer episodio agudo de sibilancias y dificultad respiratoria precedido de pródromo catarral (rinorrea) en lactantes, causado principalmente por Virus Sincitial Respiratorio (VSR).',
    sections: [
      {
        subtitle: 'Qué SÍ Indicar vs Qué NO Indicar (Basado en Evidencia)',
        items: [
          'SÍ indicado: Oxígeno suplementario húmedo si SpO₂ < 90–92%, aspiración nasal suave antes de las tomas, hidratación fraccionada o IV si taquipnea > 60 rpm o rechazo oral.',
          'NO indicado de rutina: Corticoides sistémicos ni inhalados, antibióticos (salvo coinfección bacteriana demostrada) ni salbutamol/adrenalina de forma sistemática.',
          'Criterios de hospitalización: Edad < 3 meses, prematuridad, SpO₂ < 92%, dificultad respiratoria moderada-grave (tiraje, aleteo nasal), apneas o deshidratación.',
        ],
      },
    ],
  },

  // 5. ENDOCRINOLOGÍA, TOXICOLOGÍA & RANGOS
  {
    id: 'cad-ada',
    category: 'endocrino_tox_rangos',
    title: 'Cetoacidosis Diabética (CAD): Severidad y Regla del Potasio',
    source: 'American Diabetes Association (ADA 2024)',
    summary: 'Emergencia hiperglucémica definida por hiperglucemia (> 200–250 mg/dL), cetonemia/cetonuria significativa y acidosis metabólica con Anion Gap elevado.',
    table: {
      headers: ['Parámetro', 'CAD Leve', 'CAD Moderada', 'CAD Severa'],
      rows: [
        ['pH arterial', '7.25 – 7.30', '7.00 – 7.24', '< 7.00'],
        ['HCO₃⁻ sérico (mEq/L)', '15 – 18', '10 – < 15', '< 10'],
        ['Anion Gap (mEq/L)', '> 10', '> 12', '> 12'],
        ['Estado Mental', 'Alerta', 'Alerta / Somnoliento', 'Estupor / Coma'],
      ],
    },
    sections: [
      {
        subtitle: 'Secuencia Terapéutica en 3 Ejes',
        items: [
          '1. Hidratación IV inicial: NaCl 0.9% (1,000 mL en la 1.ª hora o 15–20 mL/kg/h) antes de la insulina.',
          '2. Potasio ANTES de insulina: Si K⁺ < 3.3 mEq/L, NO iniciar insulina y reponer 20–40 mEq/L de K⁺ primero; si K⁺ 3.3–5.2 mEq/L, añadir 20–30 mEq de KCl a cada litro IV; si K⁺ > 5.2 mEq/L, diferir K⁺ y vigilar cada 2 h.',
          '3. Insulina regular IV continua: 0.1 UI/kg/h (o 0.1 UI/kg bolo + 0.1 UI/kg/h). Al llegar glucemia a ~200 mg/dL, añadir Dextrosa 5% y reducir insulina a 0.02–0.05 UI/kg/h hasta resolver acidosis (pH > 7.3, HCO₃⁻ ≥ 18, cierre de AG).',
        ],
      },
    ],
    safetyRule:
      'NUNCA iniciar insulina con K⁺ < 3.3 mEq/L (riesgo de hipokalemia crítica y fibrilación ventricular). Evitar bicarbonato salvo pH < 6.9.',
  },
  {
    id: 'serotonin-ssj',
    category: 'endocrino_tox_rangos',
    title: 'Urgencias Farmacológicas: Síndrome Serotoninérgico y Síndrome de Stevens-Johnson',
    source: 'Hunter Toxicity Criteria / BAD Guidelines SJS-TEN',
    summary: 'Reacciones farmacológicas graves de inicio agudo o subagudo donde la suspensión inmediata del fármaco causal salva la vida.',
    sections: [
      {
        subtitle: 'Síndrome Serotoninérgico (Criterios de Hunter)',
        items: [
          'Antecedente de fármacos serotoninérgicos (ISRS + Tramadol, Dextrometorfano, Linezolid, IMAO). Inicio rápido (< 24 h).',
          'Hallazgo clave: CLONUS espontáneo, inducible u ocular + hiperreflexia (predominio en miembros inferiores) + diaforesis, agitación, hipertermia e hiperperistaltismo.',
          'Manejo: Suspender agentes causales + Benzodiacepinas IV (Lorazepam/Diazepam) + enfriamiento físico + Ciproheptadina. NO dar Paracetamol ni Haloperidol.',
        ],
      },
      {
        subtitle: 'Síndrome de Stevens-Johnson (SSJ) / NET',
        items: [
          'Inicio 1–3 semanas tras antiepilépticos aromáticos (Carbamazepina, Fenitoína, Lamotrigina), Alopurinol o Sulfas.',
          'Compromiso severo de ≥ 2 mucosas (costras hemorrágicas labiales, conjuntivitis pseudomembranosa, erosiones genitales) + Signo de Nikolsky positivo.',
          'Clasificación por superficie corporal desprendida: < 10% = SSJ · 10–30% = Superposición SSJ/NET · > 30% = NET. Manejo en UCI/Unidad de Quemados + Oftalmología urgente.',
        ],
      },
    ],
  },
  {
    id: 'rangos-referencia',
    category: 'endocrino_tox_rangos',
    title: 'Tabla Rápida de Valores de Referencia Hospitalarios (Adultos)',
    source: 'Laboratorio Clínico Estándar Universitario',
    summary: 'Parámetros bioquímicos, hematológicos y de gabinete utilizados para interpretar los estudios complementarios del simulador.',
    table: {
      headers: ['Estudio / Parámetro', 'Rango de Referencia Normal', 'Significado si Alterado'],
      rows: [
        ['Hemograma (BH)', 'Leuc: 4,500–11,000/mm³ · Hb: 12–16 g/dL · Plaq: 150–450 mil', 'Hemoconcentración, anemia, infección, trombocitopenia'],
        ['Química Sanguínea', 'Glucosa: 70–100 · Urea: 15–40 · Cr: 0.6–1.2 mg/dL', 'Hiperglucemia, lesión renal prerrenal o parenquimatosa'],
        ['Electrolitos Séricos', 'Na⁺: 135–145 · K⁺: 3.5–5.1 · Cl⁻: 98–107 · Ca²⁺: 8.5–10.5', 'Hiponatremia (SIADH), hiperkalemia letal, hipocalcemia'],
        ['Perfil Hepático', 'AST/ALT: < 40 U/L · FA: 40–130 · BT: 0.2–1.2 · Alb: 3.5–5.0', 'Citólisis hepática, colestasis biliar o fuga capilar'],
        ['Reactantes Agudos', 'PCR: < 5.0 mg/L · VSG: < 20 mm/h · Procalcitonina: < 0.25', 'Infección bacteriana invasiva vs inflamación leve'],
        ['Cardíacos / Coagulación', 'hs-TnI: < 0.04 ng/mL · Dímero D: < 500 · INR: 0.9–1.15', 'Necrosis miocárdica, TEP/TVP o coagulopatía'],
        ['Enzimas Pancreáticas', 'Amilasa: 28–100 U/L · Lipasa: 13–60 U/L', 'Elevación ≥ 3× LSN confirma pancreatitis aguda'],
        ['Perfil Tiroideo / β-hCG', 'TSH: 0.4–4.2 mUI/L · T4L: 0.8–1.8 ng/dL · β-hCG: < 5 mUI/mL', 'Descarte endocrino y embarazo / ectópico'],
      ],
    },
    sections: [],
  },
];

export const ClinicalGuideModal: React.FC<ClinicalGuideModalProps> = ({ isOpen, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState<GuideCategory>('urgencias');
  const [searchTerm, setSearchTerm] = useState('');
  const modalBodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && modalBodyRef.current) {
      modalBodyRef.current.scrollTop = 0;
    }
  }, [isOpen, selectedCategory]);

  const filteredGuides = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) {
      return ACADEMIC_GUIDES.filter((g) => g.category === selectedCategory);
    }
    return ACADEMIC_GUIDES.filter((g) => {
      const haystack = [
        g.title,
        g.source,
        g.summary,
        g.safetyRule || '',
        g.examPearl || '',
        ...g.sections.flatMap((s) => [s.subtitle, ...s.items]),
        ...(g.table ? g.table.rows.flat() : []),
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [selectedCategory, searchTerm]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-1.5 sm:p-3 lg:p-4 bg-black/85 backdrop-blur-sm">
      <div className="relative w-full max-w-[98vw] sm:max-w-[95vw] lg:max-w-6xl h-[94dvh] sm:h-[90dvh] max-h-[960px] flex flex-col bg-[#07132B] border border-blue-800/70 rounded-2xl shadow-2xl overflow-hidden">
        {/* Academic Header */}
        <div className="px-4 sm:px-6 py-3 bg-[#040B1B] border-b border-blue-900/70 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#0D2149] border border-blue-600/60 flex items-center justify-center text-blue-300 shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-bold text-white tracking-tight truncate">
                Compendio Académico de Guías Clínicas & Escalas
              </h3>
              <p className="text-[11px] text-blue-300/80 truncate hidden sm:block">
                Protocolos basados en evidencia: OMS, OPS, AHA/ESC, ADA 2024, KDIGO, IDSA, ACG y AAP/NICE
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-blue-200 hover:text-white rounded-lg hover:bg-[#0D2149] transition-colors shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search + Category Bar */}
        <div className="px-3 sm:px-6 py-2.5 bg-[#050E22] border-b border-blue-900/70 space-y-2.5 shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5 sm:pb-0">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isActive = !searchTerm.trim() && selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory(cat.id);
                    }}
                    className={`px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-semibold rounded-lg whitespace-nowrap shrink-0 transition-colors cursor-pointer flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-[#040B1B] text-blue-200 hover:text-white border border-blue-900/70'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span className="sm:hidden">{cat.shortLabel}</span>
                    <span className="hidden sm:inline">{cat.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="relative w-full sm:w-56 shrink-0">
              <Search className="w-3.5 h-3.5 text-blue-300 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar criterio, fármaco o escala..."
                className="w-full bg-[#040B1B] border border-blue-900/70 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-blue-300/45 focus:outline-none focus:border-blue-400"
              />
            </div>
          </div>

          {searchTerm.trim() && (
            <div className="flex items-center justify-between text-[11px] text-sky-300">
              <span>
                Mostrando {filteredGuides.length} {filteredGuides.length === 1 ? 'apartado' : 'apartados'} en todo el compendio para "{searchTerm}"
              </span>
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="text-blue-200 hover:text-white underline cursor-pointer"
              >
                Limpiar búsqueda
              </button>
            </div>
          )}
        </div>

        {/* Generous Scrollable Academic Content */}
        <div
          ref={modalBodyRef}
          className="p-3.5 sm:p-6 flex-1 min-h-0 overflow-y-auto space-y-4"
        >
          {filteredGuides.length === 0 ? (
            <div className="bg-[#040B1B] border border-blue-900/60 rounded-xl p-8 text-center text-xs text-blue-200/75 space-y-2">
              <p>No se encontraron protocolos ni escalas para "{searchTerm}".</p>
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold cursor-pointer"
              >
                Volver a las secciones
              </button>
            </div>
          ) : (
            filteredGuides.map((guide) => (
              <article
                key={guide.id}
                className="bg-[#040B1B] border border-blue-900/70 rounded-xl p-4 sm:p-5 space-y-3.5 shadow-sm"
              >
                {/* Guide Card Header */}
                <div className="border-b border-blue-900/60 pb-2.5 space-y-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-sky-300">
                      <Bookmark className="w-3 h-3 shrink-0" />
                      <span>{guide.source}</span>
                    </span>
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-white tracking-tight">
                    {guide.title}
                  </h4>
                  <p className="text-xs text-blue-200/85 leading-relaxed">{guide.summary}</p>
                </div>

                {/* Structured Table (if any) */}
                {guide.table && (
                  <div className="overflow-x-auto rounded-lg border border-blue-900/60 bg-[#07132B]">
                    <table className="w-full text-left text-[11px] sm:text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-blue-900/70 bg-black/40 text-blue-300 uppercase text-[10px] tracking-wider">
                          {guide.table.headers.map((head, hIdx) => (
                            <th key={hIdx} className="py-2 px-3 font-bold">
                              {head}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-blue-900/50 text-blue-100">
                        {guide.table.rows.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-blue-950/30">
                            {row.map((cell, cIdx) => (
                              <td
                                key={cIdx}
                                className={`py-2 px-3 align-top ${
                                  cIdx === 0 ? 'font-bold text-white whitespace-nowrap' : ''
                                }`}
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Clinical Sections */}
                {guide.sections.map((sec, sIdx) => (
                  <div key={sIdx} className="space-y-1.5">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-blue-300">
                      {sec.subtitle}
                    </h5>
                    <ul className="space-y-1.5 text-xs text-blue-100 leading-relaxed">
                      {sec.items.map((item, iIdx) => (
                        <li key={iIdx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

                {/* Exam Pearl */}
                {guide.examPearl && (
                  <div className="bg-blue-950/50 border border-blue-700/60 rounded-lg p-3 flex items-start gap-2 text-xs text-sky-100">
                    <GraduationCap className="w-4 h-4 text-sky-300 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-sky-300">Perla Académica: </span>
                      <span>{guide.examPearl}</span>
                    </div>
                  </div>
                )}

                {/* Safety Alert Rule */}
                {guide.safetyRule && (
                  <div className="bg-rose-950/45 border border-rose-700/60 rounded-lg p-3 flex items-start gap-2 text-xs text-rose-100">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-rose-300">Alerta Crítica de Seguridad: </span>
                      <span>{guide.safetyRule}</span>
                    </div>
                  </div>
                )}
              </article>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-3 bg-[#040B1B] border-t border-blue-900/70 flex items-center justify-between gap-2 shrink-0">
          <span className="text-[11px] text-blue-300/75">
            {ACADEMIC_GUIDES.length} guías y escalas académicas integradas
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-white hover:bg-blue-100 text-[#030A1C] text-xs font-bold rounded-lg transition-colors cursor-pointer"
          >
            Cerrar Compendio
          </button>
        </div>
      </div>
    </div>
  );
};
