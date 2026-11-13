import { ClinicalCase } from '../types/clinical';

/**
 * Segunda oleada de 10 casos clínicos universitarios de alta prevalencia y urgencia
 * para ampliar la variedad en todas las modalidades (Principiante, Médico General,
 * Residente, Urgencias y Examen) y evitar repeticiones en rotaciones clínicas.
 */
export const EXTENDED_CASES: ClinicalCase[] = [
  {
    id: 'case-cirugia-colecistitis',
    mode: 'principiante',
    specialty: 'cirugia_general',
    patientInfo: {
      name: 'Marta Lucía Benítez',
      age: 43,
      sex: 'Femenino',
      occupation: 'Comerciante textil',
      consultReason: 'Dolor fuerte debajo de las costillas del lado derecho y fiebre',
      evolutionTime: '14 horas de evolución',
      currentIllness:
        'Paciente femenina de 43 años con sobrepeso y episodios previos de cólico tras comidas grasosas que cedían solos. El día anterior (ayer) por la noche cenó carne frita con queso y a las 2 horas empezó con dolor continuo en el cuadrante superior derecho del abdomen irradiado a la escápula derecha, acompañado de náuseas, 2 vómitos biliosos y fiebre de 38.2°C hoy por la mañana sin mejoría con reposo.',
      triageLevel: 'Nivel III (Urgencia)',
    },
    vitalSigns: {
      bloodPressure: '126/78 mmHg',
      heartRate: 102,
      respiratoryRate: 20,
      temperature: 38.2,
      oxygenSaturation: 98,
      glasgow: 15,
      bloodGlucose: 112,
      weightKg: 79,
      heightCm: 160,
    },
    background: {
      pathological: ['Sobrepeso grado II.', 'Cuadros previos de dolor abdominal tras comidas ricas en grasa no estudiados.'],
      nonPathological: ['Dieta rica en grasas saturadas y frituras.', 'Niega tabaquismo o alcoholismo.'],
      family: ['Madre operada de vesícula biliar a los 50 años.'],
      surgical: ['Dos cesáreas previas hace más de 10 años.'],
      currentMedications: ['Tomó una pastilla de butilhioscina ayer sin alivio significativo.'],
      allergies: ['Sin alergias conocidas a medicamentos.'],
    },
    physicalExamPool: [
      {
        id: 'pe-murphy-cole',
        system: 'Abdomen',
        name: 'Maniobra de Murphy y delimitación hepatoesplénica',
        finding:
          'Dolor intenso y paro súbito de la inspiración al palpar el hipocondrio derecho bajo el reborde costal (Signo de Murphy claramente positivo). Resistencia muscular voluntaria localizada en cuadrante superior derecho.',
        isAbnormal: true,
        semiologyNote: 'El signo de Murphy positivo tiene alta sensibilidad y valor predictivo para inflamación aguda de la vesícula biliar.',
      },
      {
        id: 'pe-general-cole',
        system: 'General',
        name: 'Inspección general, facies y estado de hidratación',
        finding:
          'Paciente álgica en decúbito dorsal con leve palidez y mucosas orales discretamente secas; escleróticas anictéricas.',
        isAbnormal: true,
      },
      {
        id: 'pe-abd-gen-cole',
        system: 'Abdomen',
        name: 'Palpación abdominal superficial/profunda y ruidos hidroaéreos',
        finding:
          'Abdomen globoso por panículo adiposo, doloroso en hipocondrio derecho y epigastrio; fosa ilíaca derecha blanda sin Blumberg difuso. Peristalsis presente disminuida.',
        isAbnormal: true,
      },
    ],
    studiesPool: [
      {
        id: 'img-us-vesicula',
        category: 'Imagen',
        subcategory: 'Ecografía',
        name: 'Ultrasonido abdominal y de vías biliares',
        result:
          'Vesícula biliar distendida (9.8 x 4.4 cm) con engrosamiento parietal difuso de 5.2 mm, doble halo edematoso, imagen litiásica hiperrefringente de 14 mm impactada en el cuello vesicular con sombra acústica posterior, líquido laminar pericolecístico y signo de Murphy ecográfico positivo. Colédoco de calibre normal (4 mm) sin dilatación intrahepática.',
        referenceRange: 'Pared vesicular <3 mm, colédoco <6 mm, sin litos impactados',
        interpretation:
          'Estudio confirmatorio de patología inflamatoria aguda vesicular de origen litiásico sin obstrucción de la vía biliar principal.',
        isAbnormal: true,
      },
      {
        id: 'lab-hemograma-cole',
        category: 'Laboratorio',
        subcategory: 'Hematología',
        name: 'Hemograma completo (Biometría Hemática)',
        result: 'Leucocitos: 14,600 /mm³ (Neutrófilos 82%) | Hemoglobina: 13.4 g/dL | Plaquetas: 295,000 /mm³.',
        referenceRange: 'Leucocitos: 4,500-11,000 /mm³',
        interpretation: 'Leucocitosis con neutrofilia compatible con proceso infeccioso/inflamatorio biliar agudo.',
        isAbnormal: true,
      },
      {
        id: 'lab-hepatica-cole',
        category: 'Laboratorio',
        subcategory: 'Función Hepática',
        name: 'Perfil hepático completo y bilirrubinas',
        result: 'Bilirrubina Total: 1.1 mg/dL (Directa: 0.4 mg/dL) | AST: 32 U/L | ALT: 35 U/L | Fosfatasa Alcalina: 112 U/L.',
        referenceRange: 'BT <1.2 mg/dL, FA <130 U/L',
        interpretation: 'Sin colestasis franca ni hiperbilirrubinemia obstructiva, apoyando cuadro limitado a la vesícula.',
        isAbnormal: false,
      },
    ],
    solution: {
      correctDiagnosis: 'Colecistitis Aguda Litiásica',
      differentialDiagnoses: [
        'Cólico biliar simple',
        'Coledocolitiasis / Colangitis aguda',
        'Pancreatitis aguda biliar',
        'Úlcera péptica perforada o gastritis aguda',
      ],
      pathophysiology:
        'La impactación persistente de un cálculo en el cuello vesicular o conducto cístico genera obstrucción mecánica, estasis biliar, distensión progresiva, inflamación química de la pared por lisolecitina y prostaglandinas, isquemia mucosa e infección bacteriana secundaria habitual por bacilos gramnegativos y anaerobios entéricos.',
      keyClinicalClues: [
        'Dolor en hipocondrio derecho >6 horas desencadenado tras ingesta rica en grasas, irradiado a escápula.',
        'Fiebre, leucocitosis y signo de Murphy positivo en la exploración física.',
        'Ultrasonido confirmatorio con litiasis impactada, pared engrosada (>4 mm) y líquido pericolecístico con colédoco normal.',
      ],
      characteristicSignsSymptoms: [
        'Signo de Murphy positivo',
        'Dolor continuo en hipocondrio derecho',
        'Fiebre y leucocitosis',
        'Náuseas y vómitos biliosos',
      ],
      criticalRulingOutFactors: [
        'Colangitis / coledocolitiasis: descartada por bilirrubinas y fosfatasa alcalina normales con colédoco de 4 mm en ecografía.',
        'Pancreatitis aguda: enzimas pancreáticas dentro de rango normal.',
      ],
      recommendedWorkup: [
        'Ultrasonido de hígado y vías biliares (estudio inicial de elección)',
        'Biometría hemática, perfil hepático completo y amilasa/lipasa',
      ],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Ceftriaxona',
            dose: '1 - 2 g',
            route: 'Intravenosa (IV)',
            frequency: 'Cada 24 horas',
            duration: 'Hasta resolución quirúrgica / 4-7 días según evolución',
            rationale: 'Cobertura empírica de primera línea frente a enterobacterias biliares según guías Tokio TG18.',
          },
          {
            drug: 'Metronidazol',
            dose: '500 mg',
            route: 'Intravenosa (IV)',
            frequency: 'Cada 8 horas',
            duration: 'Esquema intrahospitalario perioperatorio',
            rationale: 'Cobertura anaerobia complementaria en infección biliar aguda moderada.',
          },
          {
            drug: 'Ketorolaco o Paracetamol',
            dose: '30 mg (Ketorolaco) o 1 g (Paracetamol)',
            route: 'Intravenosa (IV)',
            frequency: 'Cada 8 horas',
            duration: 'Control analgésico agudo',
            rationale: 'Analgesia eficaz que disminuye el estímulo inflamatorio prostanoide sin espasmo marcado del esfínter de Oddi.',
          },
        ],
        generalMeasures: [
          'Ayuno estricto (NPO) y reposición hidroelectrolítica con solución fisiológica o Ringer Lactato.',
          'Interconsulta urgente a Cirugía General para colecistectomía laparoscópica temprana (<72 horas).',
        ],
        hospitalizationDecision: 'Hospitalización en Sala',
        referralCriteria: ['Valoración quirúrgica inmediata; escalamiento a CPRE si apareciera ictericia o dilatación biliar.'],
        followUp: 'Control de signos vitales, diuresis, biometría seriada y resolución quirúrgica laparoscópica.',
      },
      criticalSafetyAlerts: [
        'No egresar con solo antiespasmódicos ante fiebre, Murphy positivo y pared vesicular engrosada por riesgo de empiema o perforación vesicular.',
      ],
      guidelineReferences: ['Tokyo Guidelines 2018 (TG18) for Acute Cholecystitis', 'WSES Guidelines on Acute Calculous Cholecystitis'],
    },
    internalPersonaPrompt:
      'Eres Marta Lucía Benítez, 43 años, comerciante. Te duele mucho debajo de las costillas derechas desde anoche después de cenar comida frita, el dolor se corre a la espalda derecha y tienes fiebre hoy.',
  },
  {
    id: 'case-infectologia-pielonefritis',
    mode: 'medico_general',
    specialty: 'infectologia',
    patientInfo: {
      name: 'Valeria Paredes Ochoa',
      age: 34,
      sex: 'Femenino',
      occupation: 'Diseñadora gráfica',
      consultReason: 'Fiebre muy alta con escalofríos y dolor fuerte en la espalda baja derecha',
      evolutionTime: '36 horas de evolución',
      currentIllness:
        'Paciente femenina de 34 años que hace 4 días presentó ardor al orinar y urgencia miccional leve sin acudir a consulta. El día anterior (ayer) por la tarde inició súbitamente con fiebre de 39.4°C, escalofríos intensos que sacuden la cama, dolor sordo y constante en fosa lumbar derecha, náuseas y 3 vómitos con intolerancia a la vía oral hoy.',
      triageLevel: 'Nivel II (Emergencia)',
    },
    vitalSigns: {
      bloodPressure: '92/58 mmHg',
      heartRate: 116,
      respiratoryRate: 22,
      temperature: 39.3,
      oxygenSaturation: 97,
      glasgow: 15,
      bloodGlucose: 108,
      weightKg: 62,
      heightCm: 165,
    },
    background: {
      pathological: ['Dos infecciones urinarias bajas previas en el último año tratadas con esquemas cortos.'],
      nonPathological: ['Vida sexual activa con pareja estable; refiere poca ingesta diaria de agua por carga laboral.'],
      family: ['Sin antecedentes familiares relevantes.'],
      surgical: ['Niega cirugías previas.'],
      currentMedications: ['Tomó paracetamol 500 mg hace 4 horas con alivio parcial temporal.'],
      allergies: ['Sin alergias medicamentosas conocidas.'],
    },
    physicalExamPool: [
      {
        id: 'pe-lumbar-pielo',
        system: 'Abdomen',
        name: 'Palpación abdominal y puñopercusión lumbar (Giordano)',
        finding:
          'Dolor marcado en flanco derecho y punto ureteral superior derecho. Puñopercusión lumbar derecha intensamente positiva (Signo de Giordano positivo con respuesta antialgica súbita). Fosa ilíaca derecha blanda sin irritación peritoneal franca.',
        isAbnormal: true,
        semiologyNote: 'La puñopercusión lumbar positiva con fiebre alta y taquicardia orienta fuertemente a infección renal alta.',
      },
      {
        id: 'pe-general-pielo',
        system: 'General',
        name: 'Inspección general, facies y estado de hidratación',
        finding:
          'Paciente febril, diaforética, mucosas orales secas, taquicárdica y con fascies álgica.',
        isAbnormal: true,
      },
    ],
    studiesPool: [
      {
        id: 'lab-ego-pielo',
        category: 'Laboratorio',
        subcategory: 'Urinario',
        name: 'Examen general de orina (EGO) con sedimento urinario',
        result:
          'Aspecto turbio | Esterasa leucocitaria: (+++) | Nitritos: POSITIVO | Leucocitos: > 50 por campo (piuria franca) | Cilindros leucocitarios presentes | Bacterias: Abundantes bacilos.',
        referenceRange: 'Negativo para nitritos, <5 leucocitos/campo',
        interpretation: 'Sedimento urinario francamente infeccioso con cilindros leucocitarios que confirman compromiso parenquimatoso renal.',
        isAbnormal: true,
      },
      {
        id: 'lab-hemograma-pielo',
        category: 'Laboratorio',
        subcategory: 'Hematología',
        name: 'Hemograma completo (Biometría Hemática)',
        result: 'Leucocitos: 16,800 /mm³ (Neutrófilos 86%, cayados 8%) | Hemoglobina: 12.8 g/dL | Plaquetas: 190,000 /mm³.',
        referenceRange: 'Leucocitos: 4,500-11,000 /mm³',
        interpretation: 'Leucocitosis severa con desviación a la izquierda compatible con infección bacteriana aguda y respuesta sistémica.',
        isAbnormal: true,
      },
      {
        id: 'lab-urocultivo-pielo',
        category: 'Laboratorio',
        subcategory: 'Microbiología / Serología',
        name: 'Urocultivo con antibiograma y hemocultivos pareados',
        result: 'Muestras tomadas previo a antibióticos: bacterioscopia preliminar con bacilos gramnegativos abundantes (>100,000 UFC/mL en proceso).',
        referenceRange: 'Sin desarrollo bacteriano',
        interpretation: 'Documenta probable enterobacteria uropatógena (E. coli); guía desescalamiento posterior.',
        isAbnormal: true,
      },
    ],
    solution: {
      correctDiagnosis: 'Pielonefritis Aguda con Respuesta Inflamatoria Sistémica (Urosepsis)',
      differentialDiagnoses: [
        'Nefrolitiasis infectada / uropatía obstructiva',
        'Apendicitis aguda retrocecal',
        'Enfermedad pélvica inflamatoria (EPI)',
        'Cistitis aguda no complicada',
      ],
      pathophysiology:
        'Infección bacteriana ascendente desde la vejiga hasta la pelvis y parénquima renal (habitualmente por Escherichia coli uropatógena) desencadenando inflamación intersticial supurativa, liberación de endotoxinas y respuesta inflamatoria sistémica con vasodilatación.',
      keyClinicalClues: [
        'Síntomas urinarios bajos previos seguidos de fiebre alta (>39°C), escalofríos y puñopercusión lumbar (Giordano) positiva.',
        'Hipotensión limítrofe, taquicardia e intolerancia oral que obligan a manejo parenteral hospitalario.',
        'EGO con piuria intensa, nitritos positivos y cilindros leucocitarios.',
      ],
      characteristicSignsSymptoms: [
        'Fiebre elevada con escalofríos',
        'Dolor lumbar unilateral / Giordano positivo',
        'Disuria previa y piuria con nitritos positivos',
        'Náuseas y vómitos con intolerancia oral',
      ],
      criticalRulingOutFactors: [
        'Descartar embarazo con β-hCG previa a ciertos antibióticos y solicitar ultrasonido renal si no hay mejoría en 48h para descartar obstrucción.',
      ],
      recommendedWorkup: [
        'Examen general de orina y urocultivo + hemocultivos antes de iniciar antibiótico IV',
        'Biometría hemática, química sanguínea y gasometría/lactato por hipotensión',
      ],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Ceftriaxona',
            dose: '1 - 2 g',
            route: 'Intravenosa (IV)',
            frequency: 'Cada 24 horas',
            duration: 'Inicio IV hospitalario, completando 7-14 días totales según evolución',
            rationale: 'Cefalosporina de tercera generación con alta concentración renal y cobertura empírica recomendada ante pielonefritis que requiere hospitalización.',
          },
          {
            drug: 'Solución Salina 0.9% / Ringer Lactato',
            dose: '500 - 1000 mL en carga inicial y mantenimiento',
            route: 'Intravenosa (IV)',
            frequency: 'Según respuesta hemodinámica y diuresis',
            duration: 'Primeras 24-48 horas',
            rationale: 'Restauración de perfusión renal y corrección de hipotensión/deshidratación por vómitos y fiebre.',
          },
          {
            drug: 'Paracetamol',
            dose: '1 g',
            route: 'Intravenosa (IV)',
            frequency: 'Cada 8 horas',
            duration: 'Control febril/analgésico',
            rationale: 'Antitérmico y analgésico seguro a nivel renal (evitando AINEs mientras haya hipovolemia o hipotensión).',
          },
        ],
        generalMeasures: [
          'Toma de urocultivo y hemocultivos antes de la primera dosis de antibiótico sin retrasar el inicio >1 hora.',
          'Control estricto de diuresis y ultrasonido renal para descartar hidronefrosis o absceso si persiste fiebre.',
        ],
        hospitalizationDecision: 'Hospitalización en Sala',
        referralCriteria: ['Paso a UCI si progresa a choque séptico refractario a fluidos o necesidad de drenaje urológico urgente si hay litiasis obstructiva.'],
        followUp: 'Desescalar antibiótico a vía oral según resultado de urocultivo/antibiograma al completar 48h afebril.',
      },
      criticalSafetyAlerts: [
        'Evitar dar solo nitrofurantoína oral (no alcanza concentraciones terapéuticas en parénquima renal ni sangre).',
        'Evitar AINEs en presencia de hipotensión/deshidratación por riesgo de precipitar lesión renal aguda.',
      ],
      guidelineReferences: ['IDSA/ESCMID Guidelines for Acute Pyelonephritis', 'Surviving Sepsis Campaign'],
    },
    internalPersonaPrompt:
      'Eres Valeria Paredes Ochoa, 34 años, diseñadora. Hace 4 días te ardía un poco al orinar, pero desde ayer te dio fiebre altísima con escalofríos, dolor muy fuerte en la espalda baja derecha y hoy vomitas todo.',
  },
  {
    id: 'case-neurologia-ictus',
    mode: 'urgencias',
    specialty: 'neurologia',
    patientInfo: {
      name: 'Héctor Salvatierra Gómez',
      age: 67,
      sex: 'Masculino',
      occupation: 'Contador jubilado',
      consultReason: 'Pérdida súbita de fuerza en brazo y pierna derecha y dificultad para hablar',
      evolutionTime: '1 hora y 40 minutos de evolución',
      currentIllness:
        'Paciente masculino de 67 años con antecedente de hipertensión arterial y fibrilación auricular crónica que suspendió su anticoagulante hace 3 meses por temor a sangrados. El día anterior (ayer) estuvo completamente normal. Hace exactamente 1 hora y 40 minutos su esposa notó que de forma súbita comenzó a arrastrar la pierna derecha, dejó caer la taza con la mano derecha y no podía articular palabras aunque parecía comprender órdenes simples.',
      triageLevel: 'Nivel I (Reanimación)',
    },
    vitalSigns: {
      bloodPressure: '172/96 mmHg',
      heartRate: 94,
      respiratoryRate: 18,
      temperature: 36.7,
      oxygenSaturation: 96,
      glasgow: 13,
      bloodGlucose: 114,
      weightKg: 76,
      heightCm: 171,
    },
    background: {
      pathological: ['Hipertensión arterial sistémica de 12 años.', 'Fibrilación auricular paroxística/persistente diagnosticada hace 2 años.'],
      nonPathological: ['Exfumador desde hace 10 años; niega alcoholismo actual.'],
      family: ['Hermano mayor con evento vascular cerebral previo a los 70 años.'],
      surgical: ['Hernioplastia inguinal derecha hace 8 años.'],
      currentMedications: ['Losartán 50 mg diarios. Suspendió Apixabán por cuenta propia hace 3 meses.'],
      allergies: ['Sin alergias medicamentosas conocidas.'],
    },
    physicalExamPool: [
      {
        id: 'pe-neuro-core-evc',
        system: 'Neurológico',
        name: 'Estado de conciencia, pares craneales y fuerza muscular',
        finding:
          'Despierto, comprende órdenes verbales sencillas pero presenta afasia motora no fluente (solo emite sílabas aisladas), desviación de comisura labial izquierda (parálisis facial central derecha), hemiparesia braquiocrural derecha 2/5 de predominio faciobraquial y signo de Babinski derecho presente (NIHSS estimado: 13 puntos).',
        isAbnormal: true,
        semiologyNote: 'Déficit neurológico focal súbito en territorio de arteria cerebral media izquierda dentro de ventana terapéutica.',
      },
      {
        id: 'pe-cardio-evc',
        system: 'Cardiovascular',
        name: 'Auscultación cardíaca, pulsos periféricos y perfusión distal',
        finding: 'Ruidos cardíacos arrítmicos de tono variable sin soplos audibles; pulsos periféricos irregulares.',
        isAbnormal: true,
      },
    ],
    studiesPool: [
      {
        id: 'img-tac-craneo-evc',
        category: 'Imagen',
        subcategory: 'Tomografía',
        name: 'Tomografía axial computarizada (TAC) simple de cráneo urgente',
        result:
          'Parénquima cerebral sin áreas de hiperdensidad aguda sugestivas de hemorragia intracraneal ni subaracnoidea. Borramiento incipiente del núcleo lenticular e ínsula izquierda (signo precoz de isquemia en ACM izquierda, ASPECTS 9). Sin efecto de masa ni desviación de línea media.',
        referenceRange: 'Sin hemorragia intracraneal ni lesiones expansivas',
        interpretation:
          'Descarta hemorragia cerebral de manera inmediata y confirma paciente candidato a trombólisis intravenosa en ventana.',
        isAbnormal: true,
      },
      {
        id: 'gabinete-ecg-evc',
        category: 'Gabinete y Trazados',
        subcategory: 'Electrocardiograma',
        name: 'Electrocardiograma estándar de 12 derivaciones (ECG)',
        result: 'Ausencia de ondas P claras con línea de base fibrilatoria e intervalos R-R irregularmente irregulares a 94 lpm.',
        referenceRange: 'Ritmo sinusal regular',
        interpretation: 'Fibrilación auricular con respuesta ventricular controlada como fuente cardioembólica altamente probable.',
        isAbnormal: true,
      },
    ],
    solution: {
      correctDiagnosis: 'Evento Vascular Cerebral Isquémico Agudo (Territorio ACM Izquierda en Ventana)',
      differentialDiagnoses: [
        'Hemorragia intracerebral hipertensiva',
        'Hipoglucemia focal simuladora de EVC',
        'Crisis epiléptica con parálisis de Todd',
        'Ataque isquémico transitorio (si revirtiera <24h)',
      ],
      pathophysiology:
        'Embolia de origen cardíaco secundaria a estasis auricular izquierda por fibrilación auricular sin anticoagulación, provocando oclusión tromboembólica aguda de la arteria cerebral media izquierda con núcleo isquémico y zona de penumbra salvable tiempo-dependiente.',
      keyClinicalClues: [
        'Déficit focal agudo (afasia + hemiparesia derecha) con hora exacta de inicio conocida (1h 40m < 4.5 horas).',
        'Glucemia capilar normal (114 mg/dL, descarta hipoglucemia simuladora).',
        'TAC simple de cráneo prioritaria para descartar hemorragia antes de trombólisis.',
      ],
      characteristicSignsSymptoms: [
        'Hemiparesia derecha súbita',
        'Afasia motora (de expresión)',
        'Parálisis facial central derecha',
        'Ritmo cardíaco irregular (fibrilación auricular)',
      ],
      criticalRulingOutFactors: [
        'Hemorragia intracraneal descartada obligatoriamente mediante TAC simple de cráneo sin contraste antes de cualquier fármaco trombolítico o antiagregante.',
      ],
      recommendedWorkup: [
        'TAC simple de cráneo inmediata (<25 minutos del ingreso) + Glucemia capilar inmediata',
        'Tiempos de coagulación, plaquetas y ECG de 12 derivaciones',
      ],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Alteplasa (rt-PA)',
            dose: '0.9 mg/kg (máx 90 mg): 10% en bolo IV en 1 min y 90% en infusión en 60 min',
            route: 'Intravenosa (IV)',
            frequency: 'Dosis única en ventana (<4.5 horas)',
            duration: 'Infusión de 1 hora',
            rationale: 'Terapia trombolítica estándar de reperfusión cerebral tras descartar hemorragia en TAC y verificar TA <185/110 mmHg y ausencia de contraindicaciones.',
          },
        ],
        generalMeasures: [
          'Activación inmediata de Código Ictus / Stroke, cabecera a 0-30°, ayuno para prevenir broncoaspiración por disfagia.',
          'Mantener TA estrictamente <185/110 mmHg antes y <180/105 mmHg durante las primeras 24h post-trombólisis (NO bajar bruscamente la presión en fase aguda si no supera ese umbral).',
        ],
        hospitalizationDecision: 'Unidad de Cuidados Intensivos (UCI)',
        referralCriteria: ['Valoración inmediata por Neurología / Terapia Endovascular (AngioTAC para trombectomía mecánica si oclusión de gran vaso).'],
        followUp: 'TAC de control a las 24 horas post-rtPA antes de iniciar antiagregación o reiniciar anticoagulación diferida.',
      },
      criticalSafetyAlerts: [
        'NUNCA administrar Alteplasa, Aspirina ni anticoagulantes antes de ver una TAC de cráneo que descarte hemorragia cerebral.',
        'Evitar descenso agresivo de presión arterial en la fase hiperaguda salvo para cumplir meta <185/110 mmHg previa a trombólisis.',
      ],
      guidelineReferences: ['AHA/ASA Early Management of Patients With Acute Ischemic Stroke'],
    },
    internalPersonaPrompt:
      'Eres Héctor Salvatierra, 67 años. Hablas con mucha dificultad y palabras cortadas en primera persona (dices "me duele nada... brazo derecho no... no puedo hablar bien... dejé pastilla sangre hace tres meses"). Sé breve y refleja dificultad de expresión sin inventar términos médicos.',
  },
  {
    id: 'case-neumologia-asma-grave',
    mode: 'urgencias',
    specialty: 'neumologia',
    patientInfo: {
      name: 'Camila Navarro Estrada',
      age: 24,
      sex: 'Femenino',
      occupation: 'Estudiante universitaria de Arquitectura',
      consultReason: 'Falta de aire severa y silbidos en el pecho que no ceden con inhalador',
      evolutionTime: '18 horas de deterioro progresivo',
      currentIllness:
        'Paciente femenina de 24 años con diagnóstico de asma desde la infancia que abandonó su inhalador preventivo de budesonida hace meses usando únicamente salbutamol de rescate. El día anterior (ayer) estuvo limpiando una bodega con polvo acumulado y presentó tos seca y silbidos leves; en las últimas 6 horas la dificultad respiratoria empeoró drásticamente hasta impedirle pronunciar frases completas, aun habiéndose aplicado más de 8 disparos de salbutamol en casa.',
      triageLevel: 'Nivel I (Reanimación)',
    },
    vitalSigns: {
      bloodPressure: '112/74 mmHg',
      heartRate: 128,
      respiratoryRate: 32,
      temperature: 36.9,
      oxygenSaturation: 88,
      glasgow: 15,
      bloodGlucose: 118,
      weightKg: 58,
      heightCm: 164,
    },
    background: {
      pathological: ['Asma bronquial persistente desde los 9 años (2 hospitalizaciones previas, ninguna en UCI).'],
      nonPathological: ['Exposición intensa a polvo doméstico ayer; convive con gato en casa.'],
      family: ['Madre con rinitis alérgica y asma leve.'],
      surgical: ['Niega cirugías previas.'],
      currentMedications: ['Salbutamol aerosol (abuso de >8 disparos en las últimas 6 horas); suspendió corticoide inhalado hace 5 meses.'],
      allergies: ['Alergia conocida a ácaros del polvo y epitelio de gato; intolerancia a aspirina/AINEs (inducen broncoespasmo).'],
    },
    physicalExamPool: [
      {
        id: 'pe-torax-asma',
        system: 'Tórax y Pulmones',
        name: 'Inspección, mecánica ventilatoria y auscultación pulmonar',
        finding:
          'Paciente sentada inclinada hacia adelante hablando con palabras aisladas. Intenso uso de músculos accesorios (esternocleidomastoideos), tiraje supraclavicular e intercostal y espiración marcadamente prolongada. Sibilancias espiratorias e inspiratorias bilaterales agudas con disminución crítica del murmullo vesicular en bases.',
        isAbnormal: true,
        semiologyNote: 'La incapacidad de articular frases, FR >30, FC >120 y caída en el murmullo vesicular señalan exacerbación grave con riesgo de agotamiento.',
      },
    ],
    studiesPool: [
      {
        id: 'lab-gsa-asma',
        category: 'Laboratorio',
        subcategory: 'Gases',
        name: 'Gasometría arterial (GSA) y lactato sérico',
        result:
          'pH: 7.34 | PaCO₂: 44 mmHg (normocapnia preocupante en paciente con FR 32/min) | PaO₂: 57 mmHg | HCO₃⁻: 23.2 mEq/L | SaO₂: 88% | Lactato: 2.2 mmol/L.',
        referenceRange: 'pH: 7.35-7.45 | PaCO₂: 35-45 mmHg | PaO₂: 80-100 mmHg',
        interpretation:
          '¡ALERTA CLÍNICA! Una PaCO₂ normal-alta (44 mmHg) en una paciente con taquipnea intensa (debería estar hipocápnica con PaCO₂ <35) indica fatiga ventilatoria inminente e insuficiencia respiratoria progresiva.',
        isAbnormal: true,
      },
      {
        id: 'img-rx-asma',
        category: 'Imagen',
        subcategory: 'Radiología',
        name: 'Radiografía de tórax PA y lateral',
        result: 'Hiperinsuflación pulmonar bilateral con horizontalización costal y aplanamiento diafragmático; sin neumotórax ni consolidación neumónica.',
        referenceRange: 'Tórax normal',
        interpretation: 'Atrapamiento aéreo agudo; descarta neumotórax o neumonía desencadenante.',
        isAbnormal: true,
      },
    ],
    solution: {
      correctDiagnosis: 'Crisis Asmática Grave (Exacerbación Asmática Severa con Signos de Fatiga)',
      differentialDiagnoses: [
        'Neumotórax espontáneo',
        'Anafilaxia con broncoespasmo',
        'Tromboembolia pulmonar aguda',
        'Disfunción de cuerdas vocales',
      ],
      pathophysiology:
        'Inflamación bronquial aguda mediada por mastocitos y eosinófilos ante alérgenos, generando broncoconstricción severa, edema mucoso y tapones de moco viscoso que aumentan drásticamente la resistencia al flujo espiratorio, atrapamiento aéreo e hipoxemia con sobrecarga muscular respiratoria.',
      keyClinicalClues: [
        'Habla en palabras sueltas, usa musculatura accesoria, SatO2 88%, FC 128 lpm, FR 32 rpm.',
        'PaCO₂ "normal" (44 mmHg) en contexto de taquipnea severa es signo de alarma máxima de claudicación respiratoria.',
      ],
      characteristicSignsSymptoms: [
        'Disnea severa en reposo con habla entrecortada',
        'Sibilancias bilaterales y espiración prolongada',
        'Tiraje supraclavicular e intercostal',
        'Hipoxemia e hipercapnia relativa',
      ],
      criticalRulingOutFactors: [
        'Neumotórax descartado mediante radiografía y auscultación bilateral sin asimetría timpánica.',
      ],
      recommendedWorkup: [
        'Oximetría continua y Gasometría arterial ante signos de gravedad o pobre respuesta',
        'Radiografía de tórax para descartar neumotórax si hay deterioro agudo',
      ],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Oxígeno suplementario',
            dose: 'Titulado para meta SatO₂ 93-95%',
            route: 'Puntas nasales / Mascarilla con reservorio según requerimiento',
            frequency: 'Continuo',
            duration: 'Hasta estabilización respiratoria',
            rationale: 'Corrige hipoxemia arterial aguda (GINA 2024).',
          },
          {
            drug: 'Salbutamol + Bromuro de Ipratropio',
            dose: 'Salbutamol 2.5 - 5 mg + Ipratropio 0.5 mg nebulizados',
            route: 'Inhalatoria / Nebulizada con oxígeno',
            frequency: 'Cada 20 minutos durante la primera hora (3 ciclos)',
            duration: 'Fase aguda de rescate',
            rationale: 'Broncodilatación sinérgica beta-2 agonista y anticolinérgica de primera línea en crisis moderada-grave.',
          },
          {
            drug: 'Hidrocortisona o Metilprednisolona',
            dose: 'Hidrocortisona 100 mg IV cada 6h o Metilprednisolona 40-80 mg IV cada 12-24h',
            route: 'Intravenosa (IV)',
            frequency: 'Inicio inmediato en la primera hora',
            duration: '5 - 7 días (transición a prednisona oral al estabilizar)',
            rationale: 'Desinflama la vía aérea y restaura sensibilidad a receptores beta-2.',
          },
          {
            drug: 'Sulfato de Magnesio',
            dose: '2 gramos diluido en 100 mL de SS 0.9%',
            route: 'Intravenosa (IV) en 20 minutos',
            frequency: 'Dosis única de rescate',
            duration: 'Infusión única en crisis severa',
            rationale: 'Indicado en crisis grave (SatO2 <90% / pobre respuesta inicial) para relajación adicional del músculo liso bronquial.',
          },
        ],
        generalMeasures: [
          'Monitorización cardiopulmonar estrecha y preparación para soporte ventilatorio (VMNI/IOT) si aparece confusión, bradicardia, tórax silente o ascenso de PaCO2.',
          'Al egreso, reiniciar corticoide inhalado + formoterol (esquema MART GINA) y evitar AINEs/betabloqueadores.',
        ],
        hospitalizationDecision: 'Unidad de Cuidados Intensivos (UCI)',
        referralCriteria: ['Ingreso a UCI / Reanimación si persiste hipercapnia, agotamiento muscular o hipoxemia refractaria.'],
        followUp: 'Reevaluación clínica y gasométrica cada 30-60 minutos.',
      },
      criticalSafetyAlerts: [
        'NUNCA administrar sedantes, ansiolíticos, betabloqueadores ni AINEs (tiene asma inducida por aspirina) en crisis asmática aguda.',
      ],
      guidelineReferences: ['GINA Global Strategy for Asthma Management and Prevention 2024', 'BTS/SIGN Asthma Guideline'],
    },
    internalPersonaPrompt:
      'Eres Camila Navarro, 24 años. Hablas muy entrecortado porque te falta muchísimo el aire, en primera persona, con frases cortas ("No... puedo... respirar bien... limpié polvo ayer... usé mucho mi inhalador...").',
  },
  {
    id: 'case-cardiologia-fa-rvr',
    mode: 'residente',
    specialty: 'cardiologia',
    patientInfo: {
      name: 'Armando Quintero Roldán',
      age: 71,
      sex: 'Masculino',
      occupation: 'Músico retirado',
      consultReason: 'Palpitaciones muy rápidas y falta de aire que empeora al acostarse',
      evolutionTime: '18 horas de evolución',
      currentIllness:
        'Paciente masculino de 71 años con antecedente de hipertensión arterial y cardiopatía hipertensiva. El día anterior (ayer) por la tarde notó palpitaciones irregulares rápidas tras ingerir café y bebidas alcohólicas en una reunión familiar; desde anoche no pudo dormir acostado porque se ahogaba y hoy presenta disnea de mínimos esfuerzos, debilidad y opresión torácica leve.',
      triageLevel: 'Nivel II (Emergencia)',
    },
    vitalSigns: {
      bloodPressure: '142/92 mmHg',
      heartRate: 146,
      respiratoryRate: 26,
      temperature: 36.8,
      oxygenSaturation: 90,
      glasgow: 15,
      bloodGlucose: 116,
      weightKg: 82,
      heightCm: 170,
    },
    background: {
      pathological: ['Hipertensión arterial crónica de 15 años.', 'Dislipidemia en control irregular.'],
      nonPathological: ['Ayer bebió 4 copas de vino en una celebración; habitualmente no bebe en exceso.'],
      family: ['Padre fallecido por insuficiencia cardíaca a los 74 años.'],
      surgical: ['Prostatectomía benigna hace 4 años.'],
      currentMedications: ['Amlodipino 5 mg al día (con apego irregular).'],
      allergies: ['Sin alergias conocidas.'],
    },
    physicalExamPool: [
      {
        id: 'pe-cardio-fa',
        system: 'Cardiovascular',
        name: 'Auscultación cardíaca, pulsos periféricos y perfusión distal',
        finding:
          'Ruidos cardíacos totalmente arrítmicos (ritmo irregularmente irregular) a ~146 lpm con déficit de pulso radial respecto a la frecuencia apical. Discreta ingurgitación yugular a 45°.',
        isAbnormal: true,
        semiologyNote: 'El ritmo irregularmente irregular con déficit de pulso es clásico de fibrilación auricular rápida.',
      },
      {
        id: 'pe-torax-fa',
        system: 'Tórax y Pulmones',
        name: 'Inspección, mecánica ventilatoria y auscultación pulmonar',
        finding: 'Estertores crepitantes húmedos bibasales en el tercio inferior de ambos campos pulmonares por congestión pulmonar incipiente.',
        isAbnormal: true,
      },
    ],
    studiesPool: [
      {
        id: 'gabinete-ecg-fa',
        category: 'Gabinete y Trazados',
        subcategory: 'Electrocardiograma',
        name: 'Electrocardiograma estándar de 12 derivaciones (ECG)',
        result:
          'Taquiarritmia de complejos QRS estrechos (90 ms) con intervalos R-R completamente irregulares a frecuencia media de 146 lpm, ausencia total de ondas P sinusales sustituidas por ondas f fibrilatorias en V1. Criterios de hipertrofia ventricular izquierda con sobrecarga sin supradesnivel agudo del ST.',
        referenceRange: 'Ritmo sinusal 60-100 lpm',
        interpretation: 'Fibrilación auricular con respuesta ventricular rápida secundaria probable sobre cardiopatía hipertensiva.',
        isAbnormal: true,
      },
      {
        id: 'img-rx-fa',
        category: 'Imagen',
        subcategory: 'Radiología',
        name: 'Radiografía de tórax PA y lateral',
        result: 'Cardiomegalia grado II, redistribución vascular hacia vértices pulmonares (cefaliación de flujo) y líneas B de Kerley basales por congestión venocapilar incipiente.',
        referenceRange: 'Índice cardiotorácico <0.50 sin congestión',
        interpretation: 'Congestión pulmonar leve secundaria a pérdida de patada auricular y llenado ventricular acortado.',
        isAbnormal: true,
      },
    ],
    solution: {
      correctDiagnosis: 'Fibrilación Auricular con Respuesta Ventricular Rápida e Insuficiencia Cardíaca Congestiva Aguda',
      differentialDiagnoses: [
        'Taquicardia supraventricular paroxística (TSVP)',
        'Flutter auricular con conducción variable',
        'Taquicardia sinusal secundaria a infección o hipertiroidismo',
        'Síndrome coronario agudo sin elevación del ST',
      ],
      pathophysiology:
        'Activación eléctrica auricular rápida y caótica (>350 lpm) originada frecuentemente en las venas pulmonares sobre una aurícula remodelada por hipertensión, desencadenada por ingesta aguda de alcohol ("corazón de fin de semana"). La conducción rápida AV acorta la diástole, cae el gasto cardíaco y eleva la presión venocapilar pulmonar.',
      keyClinicalClues: [
        'Pulso y ruidos cardíacos irregularmente irregulares a 146 lpm con déficit de pulso.',
        'ECG sin ondas P, QRS estrecho y R-R irregulares.',
        'Ortopnea, SatO2 90% y estertores crepitantes bibasales por congestión pulmonar aguda.',
      ],
      characteristicSignsSymptoms: [
        'Palpitaciones rápidas irregulares',
        'Disnea y ortopnea de rápida evolución',
        'Estertores crepitantes bibasales',
        'Ausencia de ondas P en el ECG',
      ],
      criticalRulingOutFactors: [
        'Descartar hipertiroidismo (TSH), desequilibrio electrolítico (K+, Mg2+) e infarto agudo como precipitantes.',
      ],
      recommendedWorkup: [
        'ECG de 12 derivaciones, radiografía de tórax y ecocardiograma transtorácico',
        'Electrolitos séricos, función renal y perfil tiroideo (TSH)',
      ],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Furosemida',
            dose: '40 mg',
            route: 'Intravenosa (IV)',
            frequency: 'Bolo inicial y ajustar según respuesta diurética',
            duration: 'Manejo agudo descongestivo',
            rationale: 'Alivia la sobrecarga de volumen y congestión venocapilar pulmonar aguda.',
          },
          {
            drug: 'Metoprolol tartrato o Amiodarona / Digoxina según FEVI',
            dose: 'Metoprolol 2.5 - 5 mg IV lento o Amiodarona 150 mg IV en congestión severa',
            route: 'Intravenosa (IV) bajo telemetría',
            frequency: 'Titulado para meta FC <110 lpm en reposo',
            duration: 'Control agudo antes de transición oral',
            rationale: 'Control de frecuencia nodal AV; precaución si hay congestión pulmonar grave (evitar verapamilo/diltiazem si FEVI reducida).',
          },
          {
            drug: 'Enoxaparina (seguida de Apixabán o Rivaroxabán al estabilizar)',
            dose: '1 mg/kg cada 12h SC (ajustada a TFG)',
            route: 'Subcutánea (SC) -> Vía oral crónica',
            frequency: 'Cada 12 horas',
            duration: 'Anticoagulación crónica por puntaje CHA2DS2-VASc >= 3',
            rationale: 'Prevención tromboembólica obligatoria en paciente de 71 años hipertenso con insuficiencia cardíaca antes o después de cardioversión.',
          },
        ],
        generalMeasures: [
          'Oxígeno suplementario para mantener SatO2 >= 92%, posición semifowler y balance estricto de líquidos.',
          'Calcular puntajes CHA2DS2-VASc y HAS-BLED y evitar cardioversión eléctrica sin ecocardiograma transesofágico si evolución >48h o incierta sin anticoagulación.',
        ],
        hospitalizationDecision: 'Hospitalización en Sala',
        referralCriteria: ['Valoración por Cardiología para ecocardiograma y ajuste de control de ritmo/anticoagulación.'],
        followUp: 'Telemetría continua, control de potasio/magnesio y función renal diaria.',
      },
      criticalSafetyAlerts: [
        'No administrar calcioantagonistas no dihidropiridínicos (verapamilo/diltiazem) ni bolos altos de betabloqueador si el paciente entra en edema agudo pulmonar franco con hipotensión.',
        'No cardiovertir de forma electiva sin descartar trombo auricular si el inicio supera 48 horas y no estaba anticoagulado.',
      ],
      guidelineReferences: ['ESC 2024 Guidelines for the Management of Atrial Fibrillation', 'ACC/AHA AFib Guideline'],
    },
    internalPersonaPrompt:
      'Eres Armando Quintero, 71 años. Sientes el corazón desbocado y a saltos desde ayer después de tomar vino en una reunión, y anoche no pudiste dormir acostado porque te faltaba el aire.',
  },
  {
    id: 'case-gastro-hda-ulcera',
    mode: 'medico_general',
    specialty: 'gastroenterologia',
    patientInfo: {
      name: 'Jorge Alberto Ibáñez',
      age: 59,
      sex: 'Masculino',
      occupation: 'Chofer de autobús',
      consultReason: 'Vómito oscuro como café molido, evacuaciones negras y mareo al pararse',
      evolutionTime: '12 horas de evolución',
      currentIllness:
        'Paciente masculino de 59 años con dolor crónico de rodillas que consume naproxeno y ketorolaco diariamente sin protección gástrica desde hace 3 meses. Desde hace 2 semanas nota ardor epigástrico frecuente. El día anterior (ayer) por la noche tuvo una evacuación negra, pegajosa y muy maloliente; hace 6 horas vomitó en dos ocasiones material oscuro en "posos de café" y al levantarse sufrió desvanecimiento transitorio.',
      triageLevel: 'Nivel II (Emergencia)',
    },
    vitalSigns: {
      bloodPressure: '88/54 mmHg',
      heartRate: 118,
      respiratoryRate: 22,
      temperature: 36.6,
      oxygenSaturation: 96,
      glasgow: 15,
      bloodGlucose: 102,
      weightKg: 75,
      heightCm: 172,
    },
    background: {
      pathological: ['Gonartrosis bilateral crónica.'],
      nonPathological: ['Consumo elevado diario de AINEs por automedicación; toma 3 tazas diarias de café.'],
      family: ['Sin antecedentes digestivos oncológicos conocidos.'],
      surgical: ['Niega cirugías previas.'],
      currentMedications: ['Naproxeno 500 mg cada 12h + Ketorolaco 10 mg frecuentes desde hace 3 meses sin omeprazol.'],
      allergies: ['Sin alergias conocidas a medicamentos.'],
    },
    physicalExamPool: [
      {
        id: 'pe-gen-hda',
        system: 'General',
        name: 'Inspección general, facies y estado de hidratación',
        finding:
          'Palidez mucocutánea marcada (++), extremidades frías, diaforesis leve, taquicardia ortostática evidente y llenado capilar de 3 segundos (hipovolemia aguda).',
        isAbnormal: true,
        semiologyNote: 'La palidez asociada a taquicardia e hipotensión traduce pérdida sanguínea significativa >15-20% de la volemia.',
      },
      {
        id: 'pe-abd-hda',
        system: 'Abdomen',
        name: 'Palpación abdominal superficial/profunda y ruidos hidroaéreos',
        finding:
          'Dolor moderado a la palpación profunda en epigastrio sin defensa ni signo de Blumberg (abdomen blando). Ruidos hidroaéreos hiperactivos por presencia de sangre en tubo digestivo. Tacto rectal confirma heces melénicas alquitranadas.',
        isAbnormal: true,
      },
    ],
    studiesPool: [
      {
        id: 'lab-hemograma-hda',
        category: 'Laboratorio',
        subcategory: 'Hematología',
        name: 'Hemograma completo y tipificación de grupo y Rh',
        result:
          'Hemoglobina: 7.9 g/dL | Hematocrito: 24.1% (normocítica por sangrado agudo reciente) | Leucocitos: 11,200 /mm³ | Plaquetas: 260,000 /mm³.',
        referenceRange: 'Hb: 13.5-17.5 g/dL',
        interpretation: 'Anemia aguda significativa secundaria a hemorragia digestiva activa.',
        isAbnormal: true,
      },
      {
        id: 'lab-quimica-hda',
        category: 'Laboratorio',
        subcategory: 'Bioquímica',
        name: 'Química sanguínea básica (Glucosa, Urea, Creatinina, BUN)',
        result: 'Urea: 82 mg/dL | BUN: 38 mg/dL | Creatinina: 1.0 mg/dL (relación BUN/Creatinina = 38:1 elevada) | Glucosa: 102 mg/dL.',
        referenceRange: 'Relación BUN/Cr normal <20:1',
        interpretation:
          'Disociación uremia/creatinina clásica de hemorragia digestiva alta por absorción intestinal de proteínas hemáticas e hipoperfusión prerrenal.',
        isAbnormal: true,
      },
    ],
    solution: {
      correctDiagnosis: 'Hemorragia Digestiva Alta Aguda Secundaria a Úlcera Péptica por AINEs',
      differentialDiagnoses: [
        'Várices esofágicas rotas',
        'Síndrome de Mallory-Weiss',
        'Gastritis erosiva hemorrágica',
        'Neoplasia gástrica ulcerada',
      ],
      pathophysiology:
        'La inhibición crónica de COX-1 por consumo sostenido de AINEs suprime la síntesis de prostaglandinas citoprotectoras (moco, bicarbonato y flujo sanguíneo mucoso), favoreciendo erosión profunda por ácido-pepsina hasta erosionar un vaso submucoso gastroduodenal con sangrado arterial o venoso.',
      keyClinicalClues: [
        'Hematemesis en posos de café + melena tras consumo crónico de Naproxeno/Ketorolaco.',
        'Choque hipovolémico incipiente (TA 88/54, FC 118 lpm) y Hb 7.9 g/dL.',
        'Elevación desproporcionada de BUN (38) con creatinina normal (1.0).',
      ],
      characteristicSignsSymptoms: [
        'Melena y hematemesis en posos de café',
        'Hipotensión ortostática / síncope y taquicardia',
        'Epigastralgia previa asociada a AINEs',
      ],
      criticalRulingOutFactors: [
        'Ausencia de estigmas de hepatopatía crónica apoya úlcera péptica por AINEs sobre várices esofágicas.',
      ],
      recommendedWorkup: [
        'Hemograma urgente, tiempos de coagulación, grupo y Rh con reserva de concentrados eritrocitarios',
        'Endoscopia digestiva alta (panendoscopia) temprana (<24 horas) tras estabilización hemodinámica',
      ],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Omeprazol o Esomeprazol',
            dose: '80 mg en bolo inicial, seguido de infusión 8 mg/h (o 40 mg IV c/12h)',
            route: 'Intravenosa (IV)',
            frequency: 'Bolo + infusión continua por 72h tras terapia endoscópica',
            duration: 'Mínimo 72h IV, luego transición oral prolongada',
            rationale: 'Eleva el pH intragástrico >6 para estabilizar el coágulo plaquetario y reducir riesgo de resangrado.',
          },
          {
            drug: 'Cristaloides isotónicos (Solución Salina 0.9% / Ringer) + Transfusión restrictiva de Concentrado Eritrocitario',
            dose: '2 vías IV gruesas: bolos de 500 mL + concentrado eritrocitario si Hb <7-8 g/dL o inestabilidad',
            route: 'Intravenosa (IV)',
            frequency: 'Inmediata hasta estabilizar TA y perfusión',
            duration: 'Reanimación inicial',
            rationale: 'Recupera volumen intravascular previo a la endoscopia diagnóstica-terapéutica.',
          },
        ],
        generalMeasures: [
          'Suspender de inmediato TODO AINE (naproxeno, ketorolaco) y antiagregantes no esenciales.',
          'Ayuno absoluto, dos accesos venosos periféricos de grueso calibre (16-18G) e interconsulta urgente a Gastroenterología para endoscopia.',
        ],
        hospitalizationDecision: 'Unidad de Cuidados Intensivos (UCI)',
        referralCriteria: ['Endoscopia terapéutica urgente o cirugía/radiología intervencionista si sangrado refractario.'],
        followUp: 'Erradicación si se documenta H. pylori y vigilancia de hemoglobina seriada.',
      },
      criticalSafetyAlerts: [
        'JAMÁS prescribir AINEs (ketorolaco, diclofenaco, naproxeno) para el dolor en un paciente con úlcera sangrante activa.',
      ],
      guidelineReferences: ['ACG Clinical Guideline: Upper Gastrointestinal and Ulcer Bleeding', 'ESGE Non-variceal Upper GI Hemorrhage Guideline'],
    },
    internalPersonaPrompt:
      'Eres Jorge Alberto Ibáñez, 59 años, chofer. Tienes mucho mareo y debilidad desde que vomitaste algo oscuro como café y evacuaste negro ayer por la noche; tomas naproxeno y ketorolaco todos los días por dolor de rodillas.',
  },
  {
    id: 'case-endocrinologia-tormenta-tiroidea',
    mode: 'examen',
    specialty: 'endocrinologia',
    patientInfo: {
      name: 'Lorena Salgado Montes',
      age: 36,
      sex: 'Femenino',
      occupation: 'Estilista',
      consultReason: 'Fiebre muy alta, palpitaciones violentas, agitación y diarrea',
      evolutionTime: '24 horas de evolución aguda',
      currentIllness:
        'Paciente femenina de 36 años diagnosticada hace un año con bocio e hipertiroidismo, pero suspendió su medicación hace 4 meses porque se sentía mejor. Hace 3 días presentó infección respiratoria alta leve y el día anterior (ayer) por la tarde comenzó con fiebre progresiva hasta 40.1°C, sudoración empapante, temblor fino generalizado, 6 evacuaciones líquidas, náuseas y confusión con agitación psicomotriz intensa hoy.',
      triageLevel: 'Nivel I (Reanimación)',
    },
    vitalSigns: {
      bloodPressure: '158/64 mmHg',
      heartRate: 154,
      respiratoryRate: 28,
      temperature: 40.1,
      oxygenSaturation: 95,
      glasgow: 13,
      bloodGlucose: 136,
      weightKg: 51,
      heightCm: 162,
    },
    background: {
      pathological: ['Enfermedad de Graves-Basedow diagnosticada hace 1 año con abandono de tratamiento.', 'Pérdida involuntaria de 7 kg en los últimos 3 meses.'],
      nonPathological: ['Refiere mucho calor ambiental aun en habitaciones frías e insomnio severo reciente.'],
      family: ['Tía materna con enfermedad tiroidea autoinmune.'],
      surgical: ['Niega cirugías previas.'],
      currentMedications: ['Tomaba Tiamazol (Metimazol) 10 mg, pero lo abandonó hace 4 meses.'],
      allergies: ['Sin alergias conocidas a medicamentos.'],
    },
    physicalExamPool: [
      {
        id: 'pe-cuello-tiroides',
        system: 'Cabeza y Cuello',
        name: 'Cuello, ingurgitación yugular, pulsos carotídeos y ganglios',
        finding:
          'Bocio difuso aumentado aproximadamente 3 veces el tamaño normal, liso, no doloroso, con frémito palpable y soplo sistólico continuo audible sobre ambos lóbulos tiroideos. Ligera retracción palpebral y mirada fija brillante.',
        isAbnormal: true,
        semiologyNote: 'Un soplo tiroideo audible sobre bocio difuso asociado a hipertermia y taquicardia >140 lpm orienta a crisis tirotóxica.',
      },
      {
        id: 'pe-neuro-tiro',
        system: 'Neurológico',
        name: 'Estado de conciencia, pares craneales y fuerza muscular',
        finding:
          'Agitada, desorientada en tiempo, con verborrea, temblor distal fino intenso en manos extendidas e hiperreflexia simétrica sin rigidez de nuca ni clonus aquiliano sostenido.',
        isAbnormal: true,
      },
    ],
    studiesPool: [
      {
        id: 'lab-tiroideo-storm',
        category: 'Laboratorio',
        subcategory: 'Bioquímica',
        name: 'Perfil tiroideo (TSH y T4 libre)',
        result: 'TSH ultrasensible: < 0.005 mUI/L (indetectable) | T4 libre: 6.8 ng/dL (marcadamente elevada) | T3 libre: 18.4 pg/mL.',
        referenceRange: 'TSH: 0.4-4.2 mUI/L | T4L: 0.8-1.8 ng/dL',
        interpretation: 'Tirotoxicosis bioquímica severa que en presencia de puntaje Burch-Wartofsky >45 confirma crisis tirotóxica.',
        isAbnormal: true,
      },
      {
        id: 'gabinete-ecg-storm',
        category: 'Gabinete y Trazados',
        subcategory: 'Electrocardiograma',
        name: 'Electrocardiograma estándar de 12 derivaciones (ECG)',
        result: 'Taquicardia sinusal extrema / fibrilación auricular paroxística con FC media de 154 lpm; sin supradesnivel del ST.',
        referenceRange: 'Ritmo sinusal 60-100 lpm',
        interpretation: 'Taquiarritmia supraventricular grave mediada por exceso de receptores beta-adrenérgicos tiroideos.',
        isAbnormal: true,
      },
    ],
    solution: {
      correctDiagnosis: 'Tormenta Tiroidea (Crisis Tirotóxica por Abandono de Tionamidas)',
      differentialDiagnoses: [
        'Sepsis severa o choque séptico',
        'Síndrome serotoninérgico o síndrome neuroléptico maligno',
        'Feocromocitoma en crisis adrenérgica',
        'Golpe de calor',
      ],
      pathophysiology:
        'Descompensación aguda hipermetabólica por liberación masiva de hormonas tiroideas tras abandono de tratamiento e infección desencadenante, generando regulación al alza de receptores beta-adrenérgicos, taquiarritmia, hipertermia central, diarrea y disfunción del SNC.',
      keyClinicalClues: [
        'Antecedente de bocio/hipertiroidismo con abandono de metimazol + infección reciente.',
        'Temp 40.1°C, FC 154 lpm, agitación/delirio y diarrea (puntaje Burch-Wartofsky >=45).',
        'Bocio difuso con soplo tiroideo y TSH suprimida con T4L muy elevada.',
      ],
      characteristicSignsSymptoms: [
        'Hipertermia (>39.5°C) y diaforesis profusa',
        'Taquicardia extrema (>140 lpm)',
        'Agitación o delirio con temblor fino',
        'Bocio difuso con soplo y retracción palpebral',
      ],
      criticalRulingOutFactors: [
        'Descartar síndrome serotoninérgico (no toma ISRS/tramadol, sin clonus inducible) e infecciones del SNC.',
      ],
      recommendedWorkup: [
        'TSH y T4 libre (no esperar resultados para iniciar tratamiento empírico ante alta sospecha clínica)',
        'ECG, biometría hemática, electrolitos, pruebas hepáticas y hemocultivos para buscar foco precipitante',
      ],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Propiltiouracilo (PTU) o Metimazol (Tiamazol)',
            dose: 'PTU 500-1000 mg carga luego 250 mg c/4h (o Metimazol 20 mg c/4-6h)',
            route: 'Vía oral / Sonda nasogástrica',
            frequency: 'Cada 4 a 6 horas',
            duration: 'Fase crítica hasta control hormonal',
            rationale: 'Bloquea nueva síntesis tiroidea; el PTU además inhibe la conversión periférica de T4 a T3.',
          },
          {
            drug: 'Propranolol',
            dose: '60 - 80 mg VO cada 4-6h (o 1 mg IV lento monitorizado en UCI)',
            route: 'Vía oral / Intravenosa (IV)',
            frequency: 'Cada 4 a 6 horas',
            duration: 'Hasta estabilización hemodinámica',
            rationale: 'Bloquea el efecto adrenérgico periférico catastrófico y reduce conversión de T4 a T3.',
          },
          {
            drug: 'Hidrocortisona',
            dose: '100 mg',
            route: 'Intravenosa (IV)',
            frequency: 'Cada 8 horas (carga inicial 300 mg)',
            duration: 'Primeros días hasta resolución de tormenta',
            rationale: 'Trata insuficiencia suprarrenal relativa e inhibe la conversión periférica T4->T3.',
          },
          {
            drug: 'Yodo / Solución de Lugol (DESPUÉS de la tionamida)',
            dose: '5 gotas (0.25 mL) VO cada 6 horas — administrar mínimo 1 hora DESPUÉS de PTU/Metimazol',
            route: 'Vía oral / SNG',
            frequency: 'Cada 6 horas',
            duration: 'Días iniciales',
            rationale: 'Inhibe liberación glandular de hormona preformada (efecto Wolff-Chaikoff).',
          },
        ],
        generalMeasures: [
          'Medios físicos de enfriamiento externo y Paracetamol (EVITAR aspirina/salicilatos porque desplazan T4 libre de proteínas).',
          'Hidratación IV agresiva, corrección electrolítica y búsqueda/tratamiento de infección desencadenante.',
        ],
        hospitalizationDecision: 'Unidad de Cuidados Intensivos (UCI)',
        referralCriteria: ['Ingreso inmediato a UCI con monitorización hemodinámica y valoración por Endocrinología.'],
        followUp: 'Vigilancia de frecuencia cardíaca, temperatura y estado neurológico horario.',
      },
      criticalSafetyAlerts: [
        'PROHIBIDO administrar ácido acetilsalicílico (aspirina): desplaza las hormonas tiroideas unidas a globulina transportadora agravando la tormenta.',
        'NUNCA dar solución de Lugol ANTES de haber bloqueado la síntesis con PTU o Metimazol (efecto Jod-Basedow).',
      ],
      guidelineReferences: ['ATA Guidelines for Diagnosis and Management of Hyperthyroidism', 'Japan Thyroid Association Storm Guidelines'],
    },
    internalPersonaPrompt:
      'Eres Lorena Salgado, 36 años. Hablas muy rápido, nerviosa y acalorada en primera persona: te tiemblan las manos, te late durísimo el corazón, tuviste diarrea y dejaste tus pastillas para el bocio hace 4 meses.',
  },
  {
    id: 'case-pediatria-crup',
    mode: 'principiante',
    specialty: 'pediatria',
    patientInfo: {
      name: 'Mateo Jiménez Vargas (2 años)',
      age: 2,
      sex: 'Masculino',
      occupation: 'Lactante mayor / Preescolar (asiste a guardería)',
      consultReason: 'Tos ronca como de foca y ruido fuerte al meter el aire durante la noche',
      evolutionTime: '14 horas de evolución',
      currentIllness:
        'Paciente pediátrico masculino de 2 años traído de madrugada por su madre. Hace 2 días tuvo escurrimiento nasal claro y febrícula leve. El día anterior (ayer) por la noche despertó de forma brusca con tos ronca metálica tipo "perruna", voz afónica y un chillido agudo al inspirar que empeora cuando llora, además de hundimiento del cuello por arriba del esternón observable aun en reposo.',
      triageLevel: 'Nivel II (Emergencia)',
    },
    vitalSigns: {
      bloodPressure: '92/58 mmHg',
      heartRate: 138,
      respiratoryRate: 36,
      temperature: 37.9,
      oxygenSaturation: 93,
      glasgow: 15,
      bloodGlucose: 92,
      weightKg: 13,
      heightCm: 88,
    },
    background: {
      pathological: ['Nacido a término, previamente sano sin episodios previos de estridor ni asma.'],
      nonPathological: ['Esquema de vacunación completo para sus 2 años (incluye Hib); asiste a guardería donde hubo resfriados.'],
      family: ['Padres sanos.'],
      surgical: ['Ninguna cirugía.'],
      currentMedications: ['Su mamá intentó darle vapor de ducha caliente sin alivio sostenido.'],
      allergies: ['Sin alergias conocidas.'],
    },
    physicalExamPool: [
      {
        id: 'pe-torax-crup',
        system: 'Tórax y Pulmones',
        name: 'Inspección, mecánica ventilatoria y auscultación pulmonar',
        finding:
          'Estridor inspiratorio audible claramente INCLUSO EN REPOSO (sin agitación), tos perruna seca metálica y disfonía franca. Tiraje supraesternal e intercostal moderado. Murmullo vesicular simétrico pero disminuido levemente sin sibilancias espiratorias (escore de Westley moderado-severo ~7 puntos).',
        isAbnormal: true,
        semiologyNote: 'El estridor en reposo distingue inmediatamente el crup moderado-grave del leve (donde solo suena al llorar) y exige epinefrina nebulizada + dexametasona.',
      },
      {
        id: 'pe-head-crup',
        system: 'Cabeza y Cuello',
        name: 'Exploración ocular, pupilas, mucosas y vía aérea superior',
        finding:
          'Rinorrea hialina escasa; niño sentado erguido en brazos de su mamá sin babeo excesivo ni postura en trípode tóxica. (Se evita instrumentalizar agresivamente la faringe para no agravar ansiedad ni laringoespasmo).',
        isAbnormal: true,
      },
    ],
    studiesPool: [
      {
        id: 'img-rx-crup',
        category: 'Imagen',
        subcategory: 'Radiología',
        name: 'Radiografía de tórax y cuello AP (solo si duda diagnóstica sin demorar tratamiento)',
        result: 'Estrechamiento subglótico simétrico en "punta de lápiz" o "signo del campanario" en proyección AP; campos pulmonares limpios sin cuerpo extraño radiopaco.',
        referenceRange: 'Tráquea subglótica de bordes paralelos normales',
        interpretation: 'Edema subglótico clásico de laringotraqueobronquitis viral (el diagnóstico es eminentemente clínico).',
        isAbnormal: true,
      },
    ],
    solution: {
      correctDiagnosis: 'Laringotraqueobronquitis Aguda Moderada-Grave (Crup Viral)',
      differentialDiagnoses: [
        'Epiglotitis aguda bacteriana',
        'Aspiración de cuerpo extraño en vía aérea',
        'Traqueítis bacteriana',
        'Angioedema laríngeo anafiláctico',
      ],
      pathophysiology:
        'Infección viral (principalmente virus Parainfluenza tipos 1-3) que produce edema e inflamación de la mucosa laríngea y región subglótica (zona más estrecha de la vía aérea en menores de 3 años dentro del anillo cricoideo rígido), generando flujo turbulento inspiratorio (estridor) y disfonía.',
      keyClinicalClues: [
        'Pródromo catarral de 2 días seguido de tos "perruna" nocturna, disfonía y estridor inspiratorio EN REPOSO.',
        'Vacunación completa (Hib) y ausencia de babeo/aspecto séptico tóxico ayudan a diferenciar de epiglotitis.',
      ],
      characteristicSignsSymptoms: [
        'Tos perruna o metálica',
        'Estridor inspiratorio en reposo',
        'Disfonía / voz ronca',
        'Tiraje supraesternal',
      ],
      criticalRulingOutFactors: [
        'Epiglotitis aguda descartada por ausencia de babeo, odinofagia extrema, aspecto séptico tóxico, fiebre alta >39°C e inmunización Hib completa.',
      ],
      recommendedWorkup: [
        'Diagnóstico fundamentalmente CLÍNICO (escala de Westley); evitar pruebas invasivas o agitar innecesariamente al niño.',
      ],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Dexametasona',
            dose: '0.6 mg/kg (para 13 kg: 7.8 mg ≈ 8 mg dosis única)',
            route: 'Intramuscular (IM) o Vía oral (VO) / IV',
            frequency: 'Dosis única (máximo 16 mg)',
            duration: 'Dosis única de efecto antiinflamatorio 48-72h',
            rationale: 'Pilar terapéutico obligatorio en todo crup (leve, moderado o grave) para reducir edema subglótico y reingresos.',
          },
          {
            drug: 'L-Epinefrina (Adrenalina) 1:1000 o Adrenalina racémica nebulizada',
            dose: '0.5 mL/kg de L-epinefrina 1:1000 (máx 5 mL = 5 mg) o 0.5 mL racémica en 3 mL de SS 0.9%',
            route: 'Nebulizada',
            frequency: 'Dosis inmediata (puede repetirse cada 20-30 min si persiste estridor en reposo)',
            duration: 'Rescate inmediato en estridor en reposo',
            rationale: 'Vasoconstricción arteriolar rápida de la mucosa subglótica en 10-30 minutos (requiere observación mínima de 3-4 horas post-nebulización por efecto rebote).',
          },
        ],
        generalMeasures: [
          'Mantener al niño tranquilo en brazos de su madre para no aumentar el trabajo ventilatorio; oxígeno húmedo si SatO2 <92-94%.',
          'Observación estricta en urgencias mínimo 3-4 horas tras la adrenalina nebulizada antes de decidir egreso o ingreso.',
        ],
        hospitalizationDecision: 'Observación Urgencias',
        referralCriteria: ['Ingreso hospitalario / UCIP si requiere >2 dosis de adrenalina, persiste estridor en reposo tras 4h o cae SatO2 <92%.'],
        followUp: 'Vigilancia continua de puntuación de Westley y signos de alarma respiratoria.',
      },
      criticalSafetyAlerts: [
        'Nunca agitar ni forzar examen agresivo con abatelenguas que desencadene laringoespasmo por llanto.',
        'Nunca dar alta inmediata tras adrenalina nebulizada sin observar 3-4 horas (riesgo de efecto rebote al terminar su vida media).',
      ],
      guidelineReferences: ['CPS / AAP Clinical Guidelines on Croup Management', 'NICE Croup Evidence Summary'],
    },
    internalPersonaPrompt:
      'Eres la mamá de Mateo (un niño de 2 años). Respondes SIEMPRE en primera persona ("soy su mamá", "mi niño empezó anoche..."), angustiada porque despierta tosiendo como foca y hace un ruido al respirar.',
  },
  {
    id: 'case-urgencias-organofosforados',
    mode: 'residente',
    specialty: 'urgencias',
    patientInfo: {
      name: 'Efraín Chávez Bautista',
      age: 31,
      sex: 'Masculino',
      occupation: 'Jornalero agrícola / fumigador',
      consultReason: 'Mareo severo, sudoración fría, dificultad para respirar con mucha flema y calambres',
      evolutionTime: '3 horas de evolución',
      currentIllness:
        'Paciente masculino de 31 años traído por compañeros de cuadrilla tras realizar fumigación manual con insecticidas líquidos durante toda la mañana sin mascarilla ni guantes protectores, sufriendo derrame sobre su camisa. Hace 3 horas inició con dolor abdominal cólico intenso, diarrea abundante, náuseas, visión borrosa y sudoración empapante; en la última hora presentó salivación excesiva, abundantes secreciones en el pecho, debilidad muscular con espasmos y letargo.',
      triageLevel: 'Nivel I (Reanimación)',
    },
    vitalSigns: {
      bloodPressure: '86/52 mmHg',
      heartRate: 44,
      respiratoryRate: 28,
      temperature: 36.2,
      oxygenSaturation: 86,
      glasgow: 12,
      bloodGlucose: 110,
      weightKg: 70,
      heightCm: 169,
    },
    background: {
      pathological: ['Previamente sano sin enfermedades crónicas.'],
      nonPathological: ['Exposición laboral intensa a pesticidas agrícolas líquidos hoy por la mañana sin equipo de protección personal.'],
      family: ['Sin antecedentes familiares relevantes.'],
      surgical: ['Ninguna.'],
      currentMedications: ['Ninguno.'],
      allergies: ['Sin alergias conocidas.'],
    },
    physicalExamPool: [
      {
        id: 'pe-ojos-colinerg',
        system: 'Cabeza y Cuello',
        name: 'Exploración ocular, pupilas, mucosas y vía aérea superior',
        finding:
          'Miosis puntiforme bilateral fija (<1.5 mm), epífora abundante y sialorrea espumosa copiosa que requiere aspiración constante. Olor químico penetrante a solvente/ajo en ropas.',
        isAbnormal: true,
        semiologyNote: 'Miosis puntiforme + bradicardia + broncorrea + olor a solvente conforman un síndrome colinérgico agudo clásico.',
      },
      {
        id: 'pe-torax-colinerg',
        system: 'Tórax y Pulmones',
        name: 'Inspección, mecánica ventilatoria y auscultación pulmonar',
        finding:
          'Abundantísimos estertores gruesos y roncus húmedos difusos en ambos campos pulmonares ("ahogándose en sus propias secreciones" / broncorrea masiva) con broncoespasmo asociado.',
        isAbnormal: true,
      },
      {
        id: 'pe-neuro-colinerg',
        system: 'Neurológico',
        name: 'Reflejos osteotendinosos, tono muscular, clonus y sensibilidad',
        finding:
          'Fasciculaciones musculares visibles en pantorrillas, párpados y pectorales con debilidad motora progresiva y somnolencia (Glasgow 12).',
        isAbnormal: true,
      },
    ],
    studiesPool: [
      {
        id: 'lab-gsa-org',
        category: 'Laboratorio',
        subcategory: 'Gases',
        name: 'Gasometría arterial (GSA) y lactato sérico',
        result: 'pH: 7.22 | PaCO₂: 54 mmHg | PaO₂: 54 mmHg | HCO₃⁻: 21.5 mEq/L | SaO₂: 85% | Lactato: 3.4 mmol/L.',
        referenceRange: 'pH: 7.35-7.45 | PaCO₂: 35-45 mmHg | PaO₂: 80-100 mmHg',
        interpretation: 'Acidosis respiratoria aguda e hipoxemia grave por broncorrea, broncoespasmo y debilidad diafragmática.',
        isAbnormal: true,
      },
      {
        id: 'lab-colinesterasa',
        category: 'Laboratorio',
        subcategory: 'Bioquímica',
        name: 'Actividad de Colinesterasa plasmática / eritrocitaria y función renal',
        result: 'Pseudocolinesterasa sérica severamente deprimida (< 20% del límite inferior normal). Creatinina: 1.0 mg/dL | Glucosa: 110 mg/dL.',
        referenceRange: 'Actividad colinesterasa 5,000-12,000 U/L',
        interpretation: 'Confirma inhibición enzimática por compuestos organofosforados (NO demorar el antídoto esperando este resultado).',
        isAbnormal: true,
      },
    ],
    solution: {
      correctDiagnosis: 'Intoxicación Aguda Grave por Organofosforados (Síndrome Colinérgico)',
      differentialDiagnoses: [
        'Intoxicación por carbamatos',
        'Intoxicación por opioides (miosis y depresión respiratoria, pero sin broncorrea ni fasciculaciones)',
        'Edema agudo de pulmón cardiogénico',
        'Crisis miasténica o botulismo',
      ],
      pathophysiology:
        'Inhibición irreversible ("envejecimiento") de la enzima acetilcolinesterasa en las hendiduras sinápticas por unión covalente del organofosforado, produciendo acumulación masiva de acetilcolina con hiperestimulación muscarínica (DUMBBELSS: diarrea, micción, miosis, broncorrea, bradicardia, emesis, lagrimeo, sialorrea) y nicotínica (fasciculaciones, debilidad/parálisis respiratoria).',
      keyClinicalClues: [
        'Exposición laboral agrícola + ropa impregnada con olor químico.',
        'Bradicardia 44 lpm, miosis puntiforme, broncorrea masiva, sialorrea, diarrea y fasciculaciones.',
      ],
      characteristicSignsSymptoms: [
        'Miosis puntiforme bilateral',
        'Broncorrea y sialorrea masivas',
        'Bradicardia sinusal e hipotensión',
        'Fasciculaciones musculares y diarrea',
      ],
      criticalRulingOutFactors: [
        'Opioides producen miosis y bradipnea, pero piel seca e íleo — jamás broncorrea masiva, diarrea ni fasciculaciones.',
      ],
      recommendedWorkup: [
        'Diagnóstico netamente clínico inmediato sin esperar resultado de colinesterasa.',
        'Gasometría arterial, electrolitos, glucosa y ECG continuo',
      ],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Atropina',
            dose: '2 mg IV inicial; duplicar dosis cada 5 minutos según respuesta hasta lograr atropinización (secar broncorrea y FC >80-90 lpm)',
            route: 'Intravenosa (IV)',
            frequency: 'Bolos crecientes cada 5 min, luego infusión continua',
            duration: '24 - 72 horas según reaparición de broncorrea',
            rationale: 'Antagonista competitivo muscarínico que salva la vida al secar la broncorrea asfixiante y revertir bradicardia/broncoespasmo.',
          },
          {
            drug: 'Pralidoxima (2-PAM)',
            dose: '1 - 2 g IV en 15-30 min seguido de infusión 500 mg/h',
            route: 'Intravenosa (IV)',
            frequency: 'Carga + infusión',
            duration: 'Hasta resolución de signos nicotínicos/fasciculaciones',
            rationale: 'Reactivador de acetilcolinesterasa que revierte debilidad neuromuscular nicotínica (la atropina NO revierte fasciculaciones ni parálisis muscular).',
          },
        ],
        generalMeasures: [
          'Protección del personal con guantes/bata impermeable y DESCONTAMINACIÓN inmediata (retirar toda la ropa contaminada y lavar piel con agua y jabón).',
          'Aspiración constante de secreciones, oxígeno y pre-oxigenación previa a intubación (solo después de iniciar atropinización si hay paro inminente).',
        ],
        hospitalizationDecision: 'Unidad de Cuidados Intensivos (UCI)',
        referralCriteria: ['UCI toxicológica por riesgo de síndrome intermedio (parálisis de músculos respiratorios a las 24-96h).'],
        followUp: 'Vigilar secreciones pulmonares, saturación, frecuencia cardíaca y fuerza muscular durante 72-96 horas.',
      },
      criticalSafetyAlerts: [
        'NUNCA usar Succinilcolina si requiere intubación (su metabolismo depende de la colinesterasa inhibida y provoca parálisis prolongada fatal).',
        'La meta clínica de Atropina es SECAR LOS PULMONES y elevar presión/FC — no suspender solo porque dilataron pupilas.',
      ],
      guidelineReferences: ['WHO Clinical Management of Pesticide Intoxication', 'Goldfrank’s Toxicologic Emergencies'],
    },
    internalPersonaPrompt:
      'Eres Efraín Chávez, 31 años, trabajador agrícola. Te sientes ahogado por mucha flema, ves borroso, sudas helado, tienes cólicos y estuviste fumigando cultivos esta mañana y se te derramó líquido encima.',
  },
  {
    id: 'case-ginecologia-preeclampsia',
    mode: 'examen',
    specialty: 'ginecologia',
    patientInfo: {
      name: 'Sofía Castro Villarreal',
      age: 27,
      sex: 'Femenino',
      occupation: 'Maestra de primaria (embarazada de 34 semanas)',
      consultReason: 'Dolor de cabeza muy fuerte, ver lucecitas y dolor en la boca del estómago',
      evolutionTime: '8 horas de evolución',
      currentIllness:
        'Paciente femenina de 27 años primigesta con embarazo actual de 34 semanas por FUM. El día anterior (ayer) notó hinchazón rápida de cara y manos. Desde hace 8 horas presenta cefalea frontal intensa continua que no cede con paracetamol, visión borrosa con destellos luminosos ("lucecitas") y dolor opresivo persistente en epigastrio e hipocondrio derecho.',
      triageLevel: 'Nivel I (Reanimación)',
    },
    vitalSigns: {
      bloodPressure: '174/112 mmHg',
      heartRate: 98,
      respiratoryRate: 20,
      temperature: 36.8,
      oxygenSaturation: 97,
      glasgow: 15,
      bloodGlucose: 95,
      weightKg: 74,
      heightCm: 162,
    },
    background: {
      pathological: ['Primigesta, embarazo actual de 34 semanas; sin hipertensión crónica conocida previa al embarazo.'],
      nonPathological: ['Control prenatal irregular durante el último trimestre.'],
      family: ['Madre con hipertensión arterial crónica.'],
      surgical: ['Ninguna.'],
      currentMedications: ['Ácido fólico y sulfato ferroso. Tomó paracetamol 500 mg hace 3h sin mejoría de la cefalea.'],
      allergies: ['Sin alergias medicamentosas conocidas.'],
    },
    physicalExamPool: [
      {
        id: 'pe-neuro-pree',
        system: 'Neurológico',
        name: 'Reflejos osteotendinosos, tono muscular, clonus y sensibilidad',
        finding:
          'Hiperreflexia osteotendinosa marcada (++++/++++) con clonus aquiliano bilateral presente de 4 sacudidas sostenidas (irritabilidad neuromuscular severa con riesgo inminente de eclampsia).',
        isAbnormal: true,
        semiologyNote: 'La hiperreflexia severa con clonus y cefalea/fosfenos en embarazada hipertensa anuncia convulsión eclámptica inminente.',
      },
      {
        id: 'pe-abd-pree',
        system: 'Abdomen',
        name: 'Palpación abdominal superficial/profunda y ruidos hidroaéreos',
        finding:
          'Útero grávido acorde a 34 semanas, tono uterino normal, frecuencia cardíaca fetal audible en 144 lpm. Dolor importante a la palpación profunda en epigastrio e hipocondrio derecho (distensión de cápsula hepática de Glisson).',
        isAbnormal: true,
      },
      {
        id: 'pe-gen-pree',
        system: 'General',
        name: 'Inspección general, facies y estado de hidratación',
        finding: 'Edema facial, palpebral y en manos además de edema con fóvea (+++) en miembros inferiores.',
        isAbnormal: true,
      },
    ],
    studiesPool: [
      {
        id: 'lab-hepatica-pree',
        category: 'Laboratorio',
        subcategory: 'Función Hepática',
        name: 'Perfil hepático completo y bilirrubinas',
        result: 'AST (TGO): 138 U/L | ALT (TGP): 154 U/L | DHL: 580 U/L | Bilirrubina Total: 1.3 mg/dL.',
        referenceRange: 'AST/ALT <40 U/L',
        interpretation: 'Elevación de transaminasas (>2 veces el límite normal) coherente con daño endotelial hepático y epigastralgia severa.',
        isAbnormal: true,
      },
      {
        id: 'lab-bh-pree',
        category: 'Laboratorio',
        subcategory: 'Hematología',
        name: 'Hemograma completo (Biometría Hemática)',
        result: 'Plaquetas: 92,000 /mm³ (trombocitopenia <100,000) | Hemoglobina: 12.1 g/dL | Leucocitos: 9,400 /mm³.',
        referenceRange: 'Plaquetas: 150,000-450,000 /mm³',
        interpretation: 'Trombocitopenia severa como criterio de gravedad y sospecha de síndrome HELLP incipiente.',
        isAbnormal: true,
      },
      {
        id: 'lab-ego-pree',
        category: 'Laboratorio',
        subcategory: 'Urinario',
        name: 'Examen general de orina (EGO) y proteinuria',
        result: 'Proteínas en tira reactiva: (+++) / Relación proteína/creatinina urinaria: 1.4 g/g | Sin nitritos ni piuria.',
        referenceRange: 'Proteínas negativas (<0.3 g/24h)',
        interpretation: 'Proteinuria en rango significativo confirmando síndrome hipertensivo severo del embarazo.',
        isAbnormal: true,
      },
    ],
    solution: {
      correctDiagnosis: 'Preeclampsia con Criterios de Severidad (y Riesgo de Síndrome HELLP / Eclampsia)',
      differentialDiagnoses: [
        'Hipertensión gestacional leve',
        'Hígado graso agudo del embarazo',
        'Gastritis o pancreatitis aguda en embarazo',
        'Púrpura trombocitopénica trombótica (PTT)',
      ],
      pathophysiology:
        'Defecto de invasión trofoblástica de las arterias espirales placentarias que induce isquemia placentaria, liberación de factores antiangiogénicos (sFlt-1) y disfunción endotelial sistémica con vasoespasmo severo (TA >=160/110), lesión glomerular (proteinuria), vasoespasmo cerebral (cefalea/fosfenos/clonus) y microangiopatía hepática.',
      keyClinicalClues: [
        'Embarazo >20 semanas (34 sem) + TA 174/112 mmHg persistente.',
        'Síntomas de vasoespasmo: cefalea intensa, fosfenos, epigastralgia en barra y clonus.',
        'Plaquetas 92,000 (<100,000), AST/ALT >2x normal y proteinuria +++.',
      ],
      characteristicSignsSymptoms: [
        'Hipertensión arterial severa >=160/110 mmHg',
        'Cefalea frontal persistente y fosfenos',
        'Epigastralgia en hipocondrio derecho',
        'Hiperreflexia con clonus y edema súbito',
      ],
      criticalRulingOutFactors: [
        'Criterios de severidad presentes independientemente de la cuantificación exacta de proteinuria por existir disfunción de órgano blanco.',
      ],
      recommendedWorkup: [
        'Biometría hemática (plaquetas), transaminasas, DHL, creatinina y proteinuria',
        'Registro cardiotocográfico fetal y vigilancia neurológica continua',
      ],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Sulfato de Magnesio (Esquema Zuspan)',
            dose: '4 g IV en 15-20 minutos de carga, seguido de infusión 1 - 2 g/hora',
            route: 'Intravenosa (IV)',
            frequency: 'Carga inmediata + mantenimiento continuo',
            duration: 'Durante trabajo de parto y 24h postparto',
            rationale: 'Fármaco irremplazable de elección para prevenir convulsiones eclámpticas (el sulfato de magnesio es profilaxis de eclampsia, NO es antihipertensivo principal).',
          },
          {
            drug: 'Labetalol o Hidralazina IV / Nifedipino de liberación inmediata',
            dose: 'Labetalol 20 mg IV inicial (o Nifedipino 10 mg VO)',
            route: 'Intravenosa (IV) o Vía oral',
            frequency: 'Repetir según curva de TA cada 10-20 min hasta meta 140-150 / 90-100 mmHg',
            duration: 'Control agudo de emergencia hipertensiva',
            rationale: 'Reduce riesgo de hemorragia cerebral materna evitando hipotensión brusca placentaria.',
          },
          {
            drug: 'Betametasona (si condición materna permite maduración breve antes de interrupción)',
            dose: '12 mg',
            route: 'Intramuscular (IM)',
            frequency: 'Cada 24h (2 dosis si es posible antes de parto sin poner en riesgo a la madre)',
            duration: '48 horas (no retrasar parto si HELLP/eclampsia o sufrimiento fetal)',
            rationale: 'Maduración pulmonar fetal en edad gestacional <34-34.6 semanas si está estable.',
          },
        ],
        generalMeasures: [
          'Hospitalización inmediata en área de choque obstétrico / UCI; reposo en decúbito lateral izquierdo.',
          'Control estricto de diuresis (>30 mL/h), frecuencia respiratoria (>14 rpm) y reflejos rotulianos para vigilar toxicidad por magnesio (antídoto: Gluconato de calcio 1g IV).',
          'Planificación de interrupción definitiva del embarazo (único tratamiento curativo) tras estabilización materna.',
        ],
        hospitalizationDecision: 'Unidad de Cuidados Intensivos (UCI)',
        referralCriteria: ['Manejo multidisciplinario urgente por Obstetricia de Alto Riesgo, UCI y Neonatología.'],
        followUp: 'Vigilancia continua de diuresis, reflejos, presión arterial y bienestar fetal.',
      },
      criticalSafetyAlerts: [
        'CONTRAINDICADO usar IECA (Enalapril, Captopril) o ARA II (Losartán) en el embarazo por teratogenicidad/insuficiencia renal fetal.',
        'No retrasar el Sulfato de Magnesio (usar fenitoína o diazepam en lugar de magnesio es error grave en obstetricia).',
      ],
      guidelineReferences: ['ACOG Practice Bulletin: Gestational Hypertension and Preeclampsia', 'WHO Recommendations for Prevention and Treatment of Pre-eclampsia and Eclampsia'],
    },
    internalPersonaPrompt:
      'Eres Sofía Castro, 27 años, tienes 34 semanas de embarazo. Te duele muchísimo la cabeza, ves lucecitas brillantes, te duele la boca del estómago y desde ayer se te hincharon la cara y las manos.',
  },
];
