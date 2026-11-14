import { ClinicalCase } from '../types/clinical';

/**
 * Cuarta oleada de 16 casos clínicos de Consulta Externa (Ambulatorio) y dificultad
 * Principiante / Médico General, cubriendo las 15 especialidades médicas con
 * amplia variedad de cuadros frecuentes y sencillos de primer nivel de atención.
 */
export const OUTPATIENT_CASES: ClinicalCase[] = [
  {
    id: 'case-out-infecto-faringoamigdalitis',
    mode: 'principiante',
    specialty: 'infectologia',
    patientInfo: {
      name: 'Diego Alejandro Morales',
      age: 23,
      sex: 'Masculino',
      occupation: 'Estudiante universitario de arquitectura',
      consultReason: 'Dolor intenso de garganta al tragar y fiebre desde ayer',
      evolutionTime: '36 horas de evolución',
      currentIllness:
        'Paciente masculino de 23 años que acude a consulta externa por odinofagia intensa de 36 horas de evolución que le dificulta tragar alimentos sólidos. Ayer por la tarde comenzó de manera súbita con fiebre de hasta 38.9°C, escalofríos leves, dolor de cabeza y bolitas dolorosas en la parte anterior del cuello. Niega tos, escurrimiento nasal, ronquera o conjuntivitis. Varios compañeros de su taller tuvieron infección de garganta la semana pasada.',
      triageLevel: 'Nivel IV (Prioritario)',
    },
    vitalSigns: {
      bloodPressure: '116/74 mmHg',
      heartRate: 94,
      respiratoryRate: 16,
      temperature: 38.6,
      oxygenSaturation: 99,
      glasgow: 15,
      bloodGlucose: 92,
      weightKg: 71,
      heightCm: 176,
    },
    background: {
      pathological: ['Sin enfermedades crónicas ni episodios previos recurrentes de amigdalitis.'],
      nonPathological: ['No fuma, consumo social ocasional de alcohol. Convive en aulas universitarias cerradas.'],
      family: ['Padres sanos.'],
      surgical: ['Niega cirugías previas.'],
      currentMedications: ['Tomó 1 tableta de paracetamol de 500 mg hace 5 horas con alivio parcial de la fiebre.'],
      allergies: ['Sin alergias conocidas a medicamentos.'],
    },
    physicalExamPool: [
      {
        id: 'pe-cabeza-faringe',
        system: 'Cabeza y Cuello',
        name: 'Inspección de orofaringe y palpación cervical',
        finding: 'Amígdalas palatinas hipertróficas (grado III), intensamente eritematosas, con exudado blanquecino-amarillento en placas bilaterales y petequias en paladar blando. Adenopatías submandibulares y cervicales anteriores bilaterales de ~1.5 cm, dolorosas a la palpación.',
        isAbnormal: true,
        semiologyNote: 'Criterios de Centor modificados (McIsaac): fiebre >38°C (+1), ausencia de tos (+1), adenopatías cervicales anteriores dolorosas (+1), exudado amigdalino (+1), edad 15-44 años (0) = 4 puntos.',
      },
      {
        id: 'pe-torax-faringe',
        system: 'Tórax y Pulmones',
        name: 'Auscultación pulmonar',
        finding: 'Campos pulmonares bien ventilados bilateralmente, murmullo vesicular normal sin sibilancias ni estertores.',
        isAbnormal: false,
      },
      {
        id: 'pe-abdomen-faringe',
        system: 'Abdomen',
        name: 'Palpación abdominal',
        finding: 'Abdomen blando, depresible, no doloroso, sin hepatoesplenomegalia.',
        isAbnormal: false,
      },
    ],
    studiesPool: [
      {
        id: 'lab-strep-rapida',
        category: 'Laboratorio',
        subcategory: 'Microbiología / Serología',
        name: 'Prueba rápida de antígeno estreptocócico (exudado faríngeo)',
        result: 'POSITIVO para Streptococcus pyogenes (Estreptococo beta-hemolítico del grupo A).',
        referenceRange: 'Negativo',
        interpretation: 'Confirma faringoamigdalitis aguda bacteriana por S. pyogenes.',
        isAbnormal: true,
      },
      {
        id: 'lab-bh-faringe',
        category: 'Laboratorio',
        subcategory: 'Hematología',
        name: 'Biometría Hemática Completa',
        result: 'Hemoglobina: 15.1 g/dL | Leucocitos: 13,400 /mm³ (Neutrófilos 78%, Linfocitos 16%) | Plaquetas: 265,000 /mm³.',
        referenceRange: 'Leucocitos 4,500-10,500 /mm³',
        interpretation: 'Leucocitosis discreta con predominio neutrofílico compatible con infección bacteriana aguda.',
        isAbnormal: true,
      },
    ],
    solution: {
      correctDiagnosis: 'Faringoamigdalitis Aguda Estreptocócica',
      differentialDiagnoses: [
        'Faringitis viral aguda (rinovirus / adenovirus)',
        'Mononucleosis infecciosa (Virus de Epstein-Barr)',
        'Absceso periamigdalino incipiente',
      ],
      pathophysiology:
        'Infección aguda de la mucosa faríngea y tejido linfático amigdalino por Streptococcus pyogenes transmitido por gotitas respiratorias; la respuesta inflamatoria local produce exudado purulento y linfadenitis cervical anterior.',
      keyClinicalClues: [
        'Odinofagia intensa y fiebre >38.5°C de inicio agudo sin tos ni rinorrea',
        'Exudado amigdalino blanquecino bilateral y adenopatías cervicales anteriores dolorosas (Centor 4/4)',
        'Prueba rápida antigénica positiva para S. pyogenes',
      ],
      characteristicSignsSymptoms: [
        'Odinofagia marcada al tragar',
        'Fiebre alta sin tos ni síntomas catarrales',
        'Exudado pultáceo amigdalino y ganglios cervicales dolorosos',
      ],
      criticalRulingOutFactors: [
        'La ausencia de tos, disfonía y rinorrea aleja etiología viral catarral.',
        'Ausencia de trismus, voz en papa caliente o desviación de la úvula descarta absceso periamigdalino.',
        'Ausencia de esplenomegalia y linfocitosis atípica aleja mononucleosis.',
      ],
      recommendedWorkup: [
        'Aplicación clínica de criterios de Centor / McIsaac',
        'Prueba rápida de detección antigénica de estreptococo grupo A o cultivo faríngeo',
      ],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Amoxicilina',
            dose: '500 mg (o 1 g cada 24 h)',
            route: 'Vía Oral',
            frequency: 'Cada 12 horas',
            duration: '10 días completos',
            rationale: 'Antibiótico de primera línea para erradicar S. pyogenes y prevenir fiebre reumática (alternativa: Penicilina G benzatínica 1.2 millones UI IM dosis única).',
          },
          {
            drug: 'Paracetamol o Ibuprofeno',
            dose: '500 mg / 400 mg',
            route: 'Vía Oral',
            frequency: 'Cada 8 horas por razón necesaria',
            duration: '3 a 5 días',
            rationale: 'Control sintomático de la fiebre y la odinofagia.',
          },
        ],
        generalMeasures: [
          'Hidratación abundante con líquidos frescos o tibios y dieta blanda.',
          'Completar los 10 días de antibiótico aunque los síntomas mejoren al segundo o tercer día.',
          'Cambiar cepillo dental tras 24-48 horas de iniciar antibiótico.',
        ],
        hospitalizationDecision: 'Ambulatorio',
        referralCriteria: [
          'Acudir a urgencias si desarrolla dificultad para abrir la boca (trismus), incapacidad para tragar saliva o dificultad respiratoria.',
        ],
        followUp: 'Control en consulta externa solo si persiste fiebre después de 72 horas de tratamiento antibiótico.',
      },
      criticalSafetyAlerts: [
        'No prescribir antibióticos de amplio espectro innecesarios (como fluoroquinolonas o azitromicina sin alergia a betalactámicos).',
        'Insistir en completar 10 días de amoxicilina oral para prevenir fiebre reumática aguda.',
      ],
      guidelineReferences: [
        'IDSA Clinical Practice Guideline for Group A Streptococcal Pharyngitis',
        'Guía de Práctica Clínica de Faringoamigdalitis Aguda en Primer Nivel de Atención',
      ],
    },
    internalPersonaPrompt:
      'Habla en primera persona como Diego, estudiante de 23 años con mucho dolor al tragar y fiebre desde ayer; sin tos ni gripa nasal.',
  },
  {
    id: 'case-out-nefro-cistitis',
    mode: 'principiante',
    specialty: 'nefrologia',
    patientInfo: {
      name: 'Sofía Valentina Herrera',
      age: 27,
      sex: 'Femenino',
      occupation: 'Diseñadora gráfica',
      consultReason: 'Ardor muy molesto al orinar y ganas de ir al baño a cada rato',
      evolutionTime: '2 días de evolución',
      currentIllness:
        'Paciente femenina de 27 años que acude a consulta externa por presentar desde hace 2 días ardor intenso al orinar, aumento en la frecuencia urinaria en pequeñas cantidades y sensación urgente de querer seguir orinando justo al terminar. Ayer notó la orina un poco turbia y con olor más fuerte, sin sangre franca. Niega fiebre, escalofríos, dolor en la espalda baja, náuseas, vómitos o flujo vaginal anormal.',
      triageLevel: 'Nivel V (No Urgente)',
    },
    vitalSigns: {
      bloodPressure: '112/70 mmHg',
      heartRate: 78,
      respiratoryRate: 16,
      temperature: 36.7,
      oxygenSaturation: 99,
      glasgow: 15,
      bloodGlucose: 89,
      weightKg: 58,
      heightCm: 164,
    },
    background: {
      pathological: ['Un episodio previo de infección urinaria baja hace 2 años resuelto sin complicaciones.'],
      nonPathological: ['Vida sexual activa con pareja estable; refiere posponer ir al baño durante jornadas largas frente a la computadora y tomar poca agua.'],
      family: ['Madre sana.'],
      surgical: ['Niega cirugías.'],
      currentMedications: ['Anticonceptivos orales combinados diarios; no ha tomado antibióticos ni analgésicos urinarios hoy.'],
      allergies: ['Alérgica a trimetoprima-sulfametoxazol (le produjo exantema generalizado hace años).'],
    },
    physicalExamPool: [
      {
        id: 'pe-abdomen-cistitis',
        system: 'Abdomen',
        name: 'Palpación suprapúbica y puñopercusión lumbar',
        finding: 'Dolor leve a moderado a la palpación profunda en hipogastrio (región suprapúbica), sin defensa ni rebote. Puñopercusión lumbar (signo de Giordano) bilateral completamente negativa.',
        isAbnormal: true,
        semiologyNote: 'La ausencia de fiebre y Giordano negativo orientan a infección urinaria baja (cistitis) y descartan pielonefritis.',
      },
      {
        id: 'pe-general-cistitis',
        system: 'General',
        name: 'Inspección general e hidratación',
        finding: 'Paciente orientada, afebril, mucosas bien hidratadas, sin aspecto tóxico.',
        isAbnormal: false,
      },
    ],
    studiesPool: [
      {
        id: 'lab-ego-cistitis',
        category: 'Laboratorio',
        subcategory: 'Urinario',
        name: 'Examen General de Orina (EGO / Tira reactiva)',
        result: 'Aspecto: ligeramente turbio | pH: 6.5 | Esterasa leucocitaria: +++ | Nitritos: POSITIVO | Leucocitos: 45-60 por campo | Eritrocitos: 5-8 por campo | Bacterias: abundantes.',
        referenceRange: 'Leucocitos 0-5/campo, nitritos negativos',
        interpretation: 'Piuria y bacteriuria significativas con nitritos positivos compatibles con cistitis bacteriana aguda.',
        isAbnormal: true,
      },
      {
        id: 'lab-embarazo-cistitis',
        category: 'Laboratorio',
        subcategory: 'Urinario',
        name: 'Prueba inmunológica de embarazo en orina',
        result: 'Negativa.',
        referenceRange: 'Negativa',
        interpretation: 'Descarta embarazo previo a la selección antimicrobiana.',
        isAbnormal: false,
      },
    ],
    solution: {
      correctDiagnosis: 'Infección de Vías Urinarias Baja No Complicada (Cistitis Aguda)',
      differentialDiagnoses: [
        'Pielonefritis aguda incipiente',
        'Vulvovaginitis infecciosa / uretritis por ITS',
        'Litiasis ureteral distal',
      ],
      pathophysiology:
        'Colonización e invasión superficial de la mucosa vesical por uropatógenos ascendentes (principalmente Escherichia coli), desencadenando inflamación local del urotelio que provoca disuria, polaquiuria y tenesmo vesical.',
      keyClinicalClues: [
        'Disuria, polaquiuria y urgencia miccional de 2 días en mujer joven afebril',
        'Dolor leve en hipogastrio con puñopercusión lumbar negativa y sin flujo vaginal',
        'EGO con esterasa leucocitaria intensa, nitritos positivos y piuria',
      ],
      characteristicSignsSymptoms: [
        'Ardor al orinar (disuria)',
        'Orinar frecuente en poca cantidad (polaquiuria) y urgencia miccional',
        'Ausencia de fiebre y ausencia de dolor lumbar',
      ],
      criticalRulingOutFactors: [
        'Paciente afebril y Giordano negativo descartan infección de vías urinarias alta (pielonefritis).',
        'Ausencia de prurito o secreción vaginal y prueba de embarazo negativa orientan el tratamiento ambulatorio seguro.',
      ],
      recommendedWorkup: [
        'Tira reactiva urinaria / Examen general de orina',
        'Urocultivo únicamente si hay recurrencia, falla terapéutica o sospecha de complicación',
      ],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Nitrofurantoína',
            dose: '100 mg',
            route: 'Vía Oral',
            frequency: 'Cada 12 horas',
            duration: '5 días',
            rationale: 'Tratamiento empírico de primera elección en cistitis aguda no complicada (alternativa: Fosfomicina trometamol 3 g VO dosis única); se evita TMP-SMX por alergia documentada.',
          },
          {
            drug: 'Fenazopiridina (opcional analgésico urinario)',
            dose: '100 mg',
            route: 'Vía Oral',
            frequency: 'Cada 8 horas después de los alimentos',
            duration: '2 días',
            rationale: 'Alivio rápido de la disuria mientras hace efecto el antibiótico (advertir coloración naranja de la orina).',
          },
        ],
        generalMeasures: [
          'Aumentar ingesta de agua simple (2 litros al día) y evitar retener la orina.',
          'Micción postcoital e higiene genital adecuada (de adelante hacia atrás).',
        ],
        hospitalizationDecision: 'Ambulatorio',
        referralCriteria: [
          'Acudir a urgencias si presenta fiebre >38°C, escalofríos, dolor lumbar o vómitos (datos de pielonefritis).',
        ],
        followUp: 'No requiere EGO ni urocultivo de control si los síntomas resuelven por completo.',
      },
      criticalSafetyAlerts: [
        'Verificar alergias antes de recetar: la paciente es alérgica a sulfamidas (TMP-SMX).',
        'Evitar fluoroquinolonas (ciprofloxacino) como primera línea en cistitis simple por riesgo de efectos adversos y resistencia.',
      ],
      guidelineReferences: [
        'IDSA / ESCMID Guidelines for Acute Uncomplicated Cystitis',
        'EAU Guidelines on Urological Infections',
      ],
    },
    internalPersonaPrompt:
      'Habla en primera persona como Sofía, diseñadora de 27 años con ardor al orinar y ganas frecuentes de ir al baño desde hace 2 días; recuerda mencionar tu alergia a las sulfas si te preguntan.',
  },
  {
    id: 'case-out-gastro-erge',
    mode: 'principiante',
    specialty: 'gastroenterologia',
    patientInfo: {
      name: 'Roberto Carlos Mendoza',
      age: 44,
      sex: 'Masculino',
      occupation: 'Gerente comercial',
      consultReason: 'Ardor que sube del estómago hacia el pecho después de comer y al acostarme',
      evolutionTime: '4 meses de evolución',
      currentIllness:
        'Paciente masculino de 44 años que acude a consulta externa por sensación de quemazón detrás del esternón que sube desde la boca del estómago hasta la garganta 30 a 60 minutos después de comer, especialmente tras cenas copiosas, café o alimentos condimentados. También refiere que a veces se le regresa líquido agrio a la boca al agacharse o al acostarse recién cenado, lo que ayer por la noche lo despertó. Niega dificultad para tragar, pérdida de peso, vómitos con sangre, evacuaciones negras o dolor opresivo al caminar rápido.',
      triageLevel: 'Nivel V (No Urgente)',
    },
    vitalSigns: {
      bloodPressure: '124/78 mmHg',
      heartRate: 74,
      respiratoryRate: 16,
      temperature: 36.5,
      oxygenSaturation: 98,
      glasgow: 15,
      bloodGlucose: 98,
      weightKg: 89,
      heightCm: 174,
    },
    background: {
      pathological: ['Sobrepeso (IMC 29.4 kg/m²). Niega hipertensión o diabetes.'],
      nonPathological: ['Toma 3 a 4 tazas de café al día, cena tarde alrededor de las 10:30 p.m. y se acuesta enseguida. Fuma 4 cigarros al día.'],
      family: ['Padre con hipertensión arterial.'],
      surgical: ['Niega cirugías previas.'],
      currentMedications: ['Toma tabletas masticables de antiácido (hidróxido de aluminio/magnesio) ocasionalmente con alivio pasajero de 1 hora.'],
      allergies: ['Sin alergias conocidas.'],
    },
    physicalExamPool: [
      {
        id: 'pe-abdomen-erge',
        system: 'Abdomen',
        name: 'Exploración abdominal completa',
        finding: 'Abdomen globoso por panículo adiposo, blando, depresible, molestia mínima a la palpación profunda en epigastrio sin rebote ni masas palpables. Peristalsis normal.',
        isAbnormal: false,
      },
      {
        id: 'pe-cardio-erge',
        system: 'Cardiovascular',
        name: 'Auscultación cardíaca',
        finding: 'Ruidos cardíacos rítmicos de buen tono, sin soplos ni frote pericárdico.',
        isAbnormal: false,
      },
    ],
    studiesPool: [
      {
        id: 'gab-ecg-erge',
        category: 'Gabinete y Trazados',
        subcategory: 'Electrocardiograma',
        name: 'Electrocardiograma de 12 derivaciones (descarte basal)',
        result: 'Ritmo sinusal a 74 lpm, eje normal, sin alteraciones del segmento ST ni de la onda T.',
        referenceRange: 'Trazado normal',
        interpretation: 'Descarta patología isquémica miocárdica dada la localización retroesternal de los síntomas.',
        isAbnormal: false,
      },
      {
        id: 'lab-bh-erge',
        category: 'Laboratorio',
        subcategory: 'Hematología',
        name: 'Biometría Hemática Completa',
        result: 'Hemoglobina: 15.4 g/dL | VCM: 88 fL | Leucocitos: 6,800 /mm³ | Plaquetas: 240,000 /mm³.',
        referenceRange: 'Hb 13.5-17.5 g/dL',
        interpretation: 'Sin anemia que sugiera hemorragia digestiva oculta.',
        isAbnormal: false,
      },
    ],
    solution: {
      correctDiagnosis: 'Enfermedad por Reflujo Gastroesofágico (ERGE) Típica',
      differentialDiagnoses: [
        'Gastritis / enfermedad ulcerosa péptica',
        'Angina de pecho estable (descartada por relación con ingesta/decúbito y ECG normal)',
        'Trastorno motor esofágico',
      ],
      pathophysiology:
        'Relajaciones transitorias frecuentes o hipotonía del esfínter esofágico inferior favorecidas por sobrepeso, cenas tardías, cafeína y tabaco, permitiendo el paso retrógrado de contenido ácido gástrico hacia el esófago distal.',
      keyClinicalClues: [
        'Pirosis retroesternal postprandial y regurgitación ácida que empeoran al acostarse o agacharse',
        'Ausencia de signos de alarma (sin disfagia, pérdida de peso, hematemesis ni melena)',
        'ECG normal y sin anemia en biometría hemática',
      ],
      characteristicSignsSymptoms: [
        'Pirosis (ardor retroesternal ascendente)',
        'Regurgitación ácida nocturna o postprandial',
        'Alivio transitorio con antiácidos',
      ],
      criticalRulingOutFactors: [
        'Ausencia de disfagia progresiva, pérdida ponderal o anemia descarta indicación urgente de endoscopia inmediata en paciente menor de 50 años.',
        'La relación clara con alimentos y decúbito junto con ECG normal descartan síndrome coronario.',
      ],
      recommendedWorkup: [
        'Diagnóstico clínico con prueba terapéutica con inhibidor de bomba de protones (IBP) por 8 semanas',
        'ECG basal si existe duda por dolor retroesternal en adulto >40 años',
      ],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Omeprazol (o Esomeprazol)',
            dose: '20 mg',
            route: 'Vía Oral',
            frequency: 'Cada 24 horas (30 minutos antes del desayuno)',
            duration: '8 semanas',
            rationale: 'Supresión ácida de primera línea para control de síntomas y cicatrización mucosa.',
          },
        ],
        generalMeasures: [
          'Esperar al menos 3 horas después de cenar antes de acostarse y elevar la cabecera de la cama 15 cm.',
          'Reducir peso corporal, evitar tabaco, café en exceso, chocolate, cítricos, menta, alcohol y comidas muy grasosas.',
        ],
        hospitalizationDecision: 'Ambulatorio',
        referralCriteria: [
          'Referir a gastroenterología para endoscopia si no mejora tras 8 semanas de IBP correcto o si aparece disfagia, vómitos persistentes o pérdida de peso.',
        ],
        followUp: 'Revaloración en consulta externa a las 4-8 semanas para evaluar respuesta clínica y retiro gradual o dosis mínima de mantenimiento.',
      },
      criticalSafetyAlerts: [
        'Indicar claramente que el omeprazol debe tomarse en ayunas 30 minutos antes del desayuno para máxima eficacia.',
        'Investigar siempre datos de alarma (disfagia, anemia, pérdida de peso) antes de iniciar manejo empírico.',
      ],
      guidelineReferences: [
        'ACG Clinical Guideline for the Diagnosis and Management of Gastroesophageal Reflux Disease',
      ],
    },
    internalPersonaPrompt:
      'Habla en primera persona como Roberto, paciente de 44 años con agruras y ardor que sube al pecho después de cenar tarde y al acostarse.',
  },
  {
    id: 'case-out-neumo-asma',
    mode: 'principiante',
    specialty: 'neumologia',
    patientInfo: {
      name: 'Camila Fernanda Ríos',
      age: 19,
      sex: 'Femenino',
      occupation: 'Estudiante de biología',
      consultReason: 'Tos seca frecuente por las noches y silbido en el pecho al hacer ejercicio',
      evolutionTime: '6 meses de evolución con empeoramiento en las últimas 2 semanas',
      currentIllness:
        'Paciente femenina de 19 años que acude a consulta externa porque desde hace 6 meses nota tos seca que la despierta unas 2 noches por semana, además de sensación de opresión en el pecho y un silbido leve cuando corre, se expone al polvo al limpiar su cuarto o sale al aire frío. Ayer por la noche tuvo otro episodio de tos y silbido que cedió parcialmente tras reposar 20 minutos. Niega fiebre, flemas con sangre, pérdida de peso o falta de aire grave en reposo.',
      triageLevel: 'Nivel IV (Prioritario)',
    },
    vitalSigns: {
      bloodPressure: '108/68 mmHg',
      heartRate: 82,
      respiratoryRate: 18,
      temperature: 36.6,
      oxygenSaturation: 98,
      glasgow: 15,
      bloodGlucose: 88,
      weightKg: 56,
      heightCm: 163,
    },
    background: {
      pathological: ['Rinitis alérgica estacional desde la infancia y dermatitis atópica leve en pliegues cuando era niña.'],
      nonPathological: ['No fuma; convive en casa con un gato desde hace 8 meses.'],
      family: ['Madre asmática y hermano con rinitis alérgica.'],
      surgical: ['Niega cirugías.'],
      currentMedications: ['Loratadina ocasional para estornudos. Ningún inhalador prescrito previamente.'],
      allergies: ['Alergia ambiental al polvo y caspa de gato.'],
    },
    physicalExamPool: [
      {
        id: 'pe-torax-asma',
        system: 'Tórax y Pulmones',
        name: 'Auscultación pulmonar en reposo y espiración forzada',
        finding: 'En respiración tranquila murmullo vesicular conservado; durante la espiración forzada se auscultan sibilancias espiratorias finas aisladas bilaterales, sin estertores crepitantes ni uso de músculos accesorios.',
        isAbnormal: true,
        semiologyNote: 'Las sibilancias espiratorias durante espiración forzada en un paciente joven atópico orientan fuertemente a hiperreactividad bronquial.',
      },
      {
        id: 'pe-orl-asma',
        system: 'Cabeza y Cuello',
        name: 'Rinoscopia anterior y faringe',
        finding: 'Mucosa nasal pálida y edematosa (cornetes hipertróficos de aspecto alérgico). Faringe sin exudados.',
        isAbnormal: true,
      },
    ],
    studiesPool: [
      {
        id: 'gab-espiro-asma',
        category: 'Gabinete y Trazados',
        subcategory: 'Función Pulmonar y Audiología',
        name: 'Espirometría basal y post-broncodilatador (Salbutamol)',
        result: 'Basal: VEF1 76% del predicho | Relación VEF1/CVF: 0.69. Post-broncodilatador: incremento del VEF1 en +16% (+380 mL) alcanzando 91% del predicho.',
        referenceRange: 'VEF1/CVF >0.75-0.80, reversibilidad <12%',
        interpretation: 'Patrón obstructivo leve con respuesta broncodilatadora significativa positiva (≥12% y ≥200 mL), confirmatorio de asma.',
        isAbnormal: true,
      },
      {
        id: 'img-rx-asma',
        category: 'Imagen',
        subcategory: 'Radiología',
        name: 'Radiografía de Tórax PA',
        result: 'Campos pulmonares bien aireados, sin infiltrados, consolidaciones ni cardiomegalia.',
        referenceRange: 'Normal',
        interpretation: 'Descarta neumonía o patología estructural pulmonar.',
        isAbnormal: false,
      },
    ],
    solution: {
      correctDiagnosis: 'Asma Bronquial Leve Persistente (Asma Alérgica)',
      differentialDiagnoses: [
        'Bronquitis aguda prolongada / tos postinfecciosa',
        'Rinitis alérgica con goteo retronasal aislado',
        'Disfunción de cuerdas vocales',
      ],
      pathophysiology:
        'Inflamación crónica de la vía aérea mediada por IgE y eosinófilos en paciente atópica, generando hiperreactividad bronquial y broncoconstricción reversible ante alérgenos (ácaros, caspa de gato), aire frío o ejercicio.',
      keyClinicalClues: [
        'Tos seca nocturna, opresión torácica y sibilancias desencadenadas por ejercicio y polvo',
        'Antecedente personal de rinitis alérgica y familiar de asma',
        'Espirometría con obstrucción reversible significativa (+16% y +380 mL tras salbutamol)',
      ],
      characteristicSignsSymptoms: [
        'Sibilancias espiratorias intermitentes',
        'Tos nocturna o con el ejercicio',
        'Variabilidad sintomática y buena respuesta a broncodilatador',
      ],
      criticalRulingOutFactors: [
        'Ausencia de fiebre, flema purulenta y radiografía normal descartan neumonía o tuberculosis.',
        'Edad joven y no fumadora descartan EPOC.',
      ],
      recommendedWorkup: [
        'Espirometría forzada con prueba broncodilatadora (estándar diagnóstico)',
        'Radiografía de tórax basal para descartar diagnósticos alternativos',
      ],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Budesonida / Formoterol inhalado (según GINA Track 1)',
            dose: '160/4.5 mcg (1 inhalación)',
            route: 'Vía Inhalada',
            frequency: 'Cada 12 horas de mantenimiento y a demanda ante síntomas (o Budesonida diaria + Salbutamol de rescate)',
            duration: 'Tratamiento continuo con revaloración a los 3 meses',
            rationale: 'Los corticoides inhalados controlan la inflamación bronquial subyacente y reducen drásticamente el riesgo de crisis graves.',
          },
        ],
        generalMeasures: [
          'Enseñar y verificar técnica inhalatoria correcta y enjuagar la boca tras cada dosis de corticoide inhalado.',
          'Control ambiental: reducir polvo doméstico, fundas antiácaros y evitar contacto directo del gato en el dormitorio.',
          'Entregar plan de acción por escrito ante exacerbaciones.',
        ],
        hospitalizationDecision: 'Ambulatorio',
        referralCriteria: [
          'Acudir a urgencias si presenta falta de aire en reposo, incapacidad para completar frases o nula respuesta al inhalador de rescate.',
        ],
        followUp: 'Cita de control en consulta externa en 4 a 6 semanas para revisar control sintomático y técnica inhalatoria.',
      },
      criticalSafetyAlerts: [
        'Según guías GINA actuales, NO se recomienda tratar el asma únicamente con SABA (salbutamol solo) sin corticoide inhalado.',
      ],
      guidelineReferences: [
        'GINA Global Strategy for Asthma Management and Prevention (2024)',
      ],
    },
    internalPersonaPrompt:
      'Habla en primera persona como Camila, joven de 19 años con tos seca por las noches y silbido en el pecho al correr o limpiar polvo; tienes rinitis alérgica y un gato en casa.',
  },
  {
    id: 'case-out-endo-hipotiroidismo',
    mode: 'principiante',
    specialty: 'endocrinologia',
    patientInfo: {
      name: 'Patricia Elena Domínguez',
      age: 38,
      sex: 'Femenino',
      occupation: 'Contadora pública',
      consultReason: 'Cansancio extremo, aumento de peso y muchísimo frío desde hace varios meses',
      evolutionTime: '7 meses de evolución progresiva',
      currentIllness:
        'Paciente femenina de 38 años que acude a consulta externa por fatiga persistente que no mejora aunque duerma 9 horas, aumento de 6 kg de peso en los últimos meses a pesar de comer igual o menos, intolerancia marcada al frío (usa suéter incluso al mediodía), piel muy seca, caída de cabello al peinarse, estreñimiento y olvidos frecuentes. Refiere que sus últimas 3 menstruaciones han sido más abundantes. Niega fiebre, dolor torácico o pérdida de conciencia.',
      triageLevel: 'Nivel V (No Urgente)',
    },
    vitalSigns: {
      bloodPressure: '118/80 mmHg',
      heartRate: 56,
      respiratoryRate: 15,
      temperature: 36.1,
      oxygenSaturation: 98,
      glasgow: 15,
      bloodGlucose: 86,
      weightKg: 72,
      heightCm: 162,
    },
    background: {
      pathological: ['Niega enfermedades crónicas diagnosticadas previamente.'],
      nonPathological: ['No fuma, no bebe alcohol. Trabajo de oficina sedentario.'],
      family: ['Hermana mayor con enfermedad tiroidea en tratamiento con pastilla diaria.'],
      surgical: ['Cesárea hace 8 años sin complicaciones.'],
      currentMedications: ['Ninguno actualmente.'],
      allergies: ['Sin alergias conocidas.'],
    },
    physicalExamPool: [
      {
        id: 'pe-cuello-hipo',
        system: 'Cabeza y Cuello',
        name: 'Palpación de glándula tiroides y facies',
        finding: 'Tiroides discretamente aumentada de tamaño de consistencia firme y elástica (bocio difuso pequeño no nodular), indolora. Leve edema palpebral matutino.',
        isAbnormal: true,
      },
      {
        id: 'pe-piel-hipo',
        system: 'Osteomuscular y Piel',
        name: 'Piel, faneras y reflejos osteotendinosos',
        finding: 'Piel fría, áspera y seca en extremidades, cabello quebradizo. Enlentecimiento evidente de la fase de relajación del reflejo aquíleo (signo de Woltman).',
        isAbnormal: true,
        semiologyNote: 'La fase de relajación lenta de los reflejos osteotendinosos es un hallazgo semiológico clásico de hipotiroidismo.',
      },
      {
        id: 'pe-cardio-hipo',
        system: 'Cardiovascular',
        name: 'Auscultación cardíaca',
        finding: 'Bradicardia sinusal regular (56 lpm), ruidos cardíacos rítmicos de intensidad levemente disminuida.',
        isAbnormal: true,
      },
    ],
    studiesPool: [
      {
        id: 'lab-perfil-tiroideo',
        category: 'Laboratorio',
        subcategory: 'Bioquímica',
        name: 'Perfil Tiroideo (TSH y T4 Libre) + Anticuerpos Anti-TPO',
        result: 'TSH: 28.4 mUI/L | T4 Libre: 0.48 ng/dL | Anticuerpos anti-peroxidasa tiroidea (Anti-TPO): 340 UI/mL (Positivos altos).',
        referenceRange: 'TSH 0.4-4.0 mUI/L | T4L 0.8-1.8 ng/dL | Anti-TPO <35 UI/mL',
        interpretation: 'Hipotiroidismo primario franco de etiología autoinmune (Tiroiditis de Hashimoto).',
        isAbnormal: true,
      },
      {
        id: 'lab-lipidos-hipo',
        category: 'Laboratorio',
        subcategory: 'Bioquímica',
        name: 'Perfil de Lípidos y Biometría Hemática',
        result: 'Colesterol total: 248 mg/dL | LDL: 162 mg/dL | Hemoglobina: 11.9 g/dL (normocítica).',
        referenceRange: 'Colesterol <200 mg/dL',
        interpretation: 'Dislipidemia secundaria y anemia leve frecuentes en hipotiroidismo no tratado.',
        isAbnormal: true,
      },
    ],
    solution: {
      correctDiagnosis: 'Hipotiroidismo Primario por Tiroiditis de Hashimoto',
      differentialDiagnoses: [
        'Trastorno depresivo mayor',
        'Síndrome de fatiga crónica / anemia aislada',
        'Hipotiroidismo central (descartado por TSH muy elevada)',
      ],
      pathophysiology:
        'Destrucción autoinmune progresiva de los folículos tiroideos mediada por linfocitos y anticuerpos anti-TPO, ocasionando déficit de T4/T3, elevación compensatoria de TSH y enlentecimiento metabólico generalizado.',
      keyClinicalClues: [
        'Astenia, intolerancia al frío, piel seca, estreñimiento y aumento ponderal de meses de evolución',
        'Bradicardia leve, bocio difuso pequeño y relajación lenta de reflejos',
        'TSH muy elevada (28.4 mUI/L), T4 libre baja y anticuerpos anti-TPO positivos',
      ],
      characteristicSignsSymptoms: [
        'Intolerancia al frío y fatiga crónica',
        'Piel seca, caída de cabello y estreñimiento',
        'Bradicardia sinusal y reflejos lentos',
      ],
      criticalRulingOutFactors: [
        'TSH elevada con T4L baja confirma origen primario tiroideo y descarta hipotiroidismo secundario.',
        'Paciente estable, consciente y orientada descarta coma mixedematoso.',
      ],
      recommendedWorkup: [
        'TSH y T4 libre séricas',
        'Anticuerpos anti-peroxidasa tiroidea (Anti-TPO) y perfil lipídico',
      ],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Levotiroxina sódica',
            dose: '75 mcg (aprox. 1.6 mcg/kg/día; iniciar 50-100 mcg en adulto joven sano)',
            route: 'Vía Oral',
            frequency: 'Cada 24 horas en ayunas completas (30-60 minutos antes del desayuno, solo con agua)',
            duration: 'Tratamiento crónico de reemplazo hormonal',
            rationale: 'Reemplazo fisiológico de hormona tiroidea; en adultos jóvenes sin cardiopatía se puede iniciar dosis plena o cercana a plena.',
          },
        ],
        generalMeasures: [
          'Evitar tomar levotiroxina junto con café, leche, hierro, calcio o antiácidos (separar al menos 4 horas).',
          'Dieta rica en fibra y buena hidratación mientras mejora el tránsito intestinal.',
        ],
        hospitalizationDecision: 'Ambulatorio',
        referralCriteria: [
          'Valoración por endocrinología en caso de embarazo planeado/actual o dificultad para alcanzar metas de TSH.',
        ],
        followUp: 'Repetir TSH y T4 libre en 6 a 8 semanas para titular la dosis hasta normalizar TSH.',
      },
      criticalSafetyAlerts: [
        'Advertir estrictamente tomar levotiroxina en ayuno solo con agua y no suspenderla aunque se sienta mejor.',
      ],
      guidelineReferences: [
        'ATA Guidelines for the Treatment of Hypothyroidism',
      ],
    },
    internalPersonaPrompt:
      'Habla en primera persona como Patricia, contadora de 38 años con cansancio extremo, mucho frío, piel seca, estreñimiento y subida de peso desde hace varios meses.',
  },
  {
    id: 'case-out-cardio-hta',
    mode: 'principiante',
    specialty: 'cardiologia',
    patientInfo: {
      name: 'Jorge Eduardo Ramírez',
      age: 51,
      sex: 'Masculino',
      occupation: 'Administrador de ferretería',
      consultReason: 'Dolor de cabeza leve por las mañanas y presión alta en chequeos de farmacia',
      evolutionTime: '3 meses de evolución',
      currentIllness:
        'Paciente masculino de 51 años que acude a consulta externa porque en las últimas semanas se ha sentido con dolor de cabeza opresivo leve en la nuca al despertar y en dos ocasiones le tomaron la presión arterial en una farmacia saliendo en 154/94 y 158/96 mmHg. Niega dolor en el pecho, falta de aire, palpitaciones, visión borrosa, debilidad en alguna extremidad o sangrado nasal. Ayer estuvo trabajando normal y no ha tomado ningún medicamento para la presión.',
      triageLevel: 'Nivel V (No Urgente)',
    },
    vitalSigns: {
      bloodPressure: '156/96 mmHg',
      heartRate: 76,
      respiratoryRate: 16,
      temperature: 36.5,
      oxygenSaturation: 98,
      glasgow: 15,
      bloodGlucose: 102,
      weightKg: 88,
      heightCm: 173,
    },
    background: {
      pathological: ['Dislipidemia leve hace 2 años sin tratamiento farmacológico actual.'],
      nonPathological: ['Dieta alta en sal y carnes rojas, sedentario. Fuma 5 cigarros al día desde hace 15 años.'],
      family: ['Madre hipertensa desde los 50 años y padre con diabetes tipo 2.'],
      surgical: ['Colecistectomía laparoscópica hace 6 años.'],
      currentMedications: ['Ninguno.'],
      allergies: ['Sin alergias conocidas.'],
    },
    physicalExamPool: [
      {
        id: 'pe-cardio-hta',
        system: 'Cardiovascular',
        name: 'Toma confirmatoria bilateral de PA y auscultación cardíaca',
        finding: 'PA en reposo tras 5 min: brazo derecho 156/96 mmHg, brazo izquierdo 154/94 mmHg. Ruidos cardíacos rítmicos con discreto reforzamiento del segundo ruido aórtico (R2), sin soplos ni edemas periféricos.',
        isAbnormal: true,
      },
      {
        id: 'pe-neuro-hta',
        system: 'Cabeza y Cuello',
        name: 'Fondo de ojo y exploración neurológica básica',
        finding: 'Papilas ópticas de bordes nítidos sin papiledema ni exudados algodonosos (estrechamiento arteriolar leve). Pares craneales, fuerza y sensibilidad íntegros.',
        isAbnormal: false,
      },
    ],
    studiesPool: [
      {
        id: 'gab-ecg-hta',
        category: 'Gabinete y Trazados',
        subcategory: 'Electrocardiograma',
        name: 'Electrocardiograma de 12 derivaciones',
        result: 'Ritmo sinusal a 75 lpm, eje eléctrico a 0°, sin datos de isquemia aguda ni hipertrofia ventricular severa.',
        referenceRange: 'Normal',
        interpretation: 'Sin evidencia de lesión aguda ni arritmia.',
        isAbnormal: false,
      },
      {
        id: 'lab-quimica-hta',
        category: 'Laboratorio',
        subcategory: 'Bioquímica',
        name: 'Química sanguínea, Electrolitos y EGO',
        result: 'Glucosa ayuno: 102 mg/dL | Creatinina: 0.92 mg/dL | Na: 140 mEq/L | K: 4.2 mEq/L | Colesterol LDL: 144 mg/dL | EGO sin proteinuria.',
        referenceRange: 'Creatinina 0.7-1.2 mg/dL, EGO sin proteínas',
        interpretation: 'Función renal conservada y sin albuminuria; riesgo metabólico moderado.',
        isAbnormal: true,
      },
    ],
    solution: {
      correctDiagnosis: 'Hipertensión Arterial Sistémica Esencial Grado 2 (Sin Daño Agudo a Órgano Blanco)',
      differentialDiagnoses: [
        'Hipertensión de bata blanca (descartada por mediciones elevadas previas en farmacia)',
        'Hipertensión arterial secundaria (renal o endocrina)',
        'Cefalea tensional aislada',
      ],
      pathophysiology:
        'Aumento sostenido de las resistencias vasculares periféricas por disfunción endotelial, activación del sistema renina-angiotensina-aldosterona y rigidez arterial asociada a factores genéticos, dieta rica en sodio, tabaquismo y sedentarismo.',
      keyClinicalClues: [
        'Cifras repetidas ≥150/95 mmHg en diferentes mediciones en reposo',
        'Ausencia total de daño agudo a órgano blanco (sin dolor torácico, disnea, papiledema ni déficit neurológico)',
        'Función renal normal, potasio normal y ECG basal sin isquemia',
      ],
      characteristicSignsSymptoms: [
        'Elevación tensional sostenida (habitualmente asintomática o cefalea occipital leve)',
        'Antecedentes familiares y dieta alta en sodio',
      ],
      criticalRulingOutFactors: [
        'Ausencia de síntomas de alarma y fondo de ojo sin papiledema descartan emergencia hipertensiva (no requiere descenso IV urgente).',
        'Potasio y creatinina normales alejan causas secundarias obvias como hiperaldosteronismo o nefropatía avanzada.',
      ],
      recommendedWorkup: [
        'Medición estandarizada bilateral en consulta y bitácora domiciliaria (AMPA/MAPA)',
        'Tamizaje básico de órgano blanco: ECG, creatinina, electrolitos, glucosa, lípidos y EGO',
      ],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Losartán (ARA-II) o Enalapril (IECA)',
            dose: '50 mg (Losartán) o 10 mg (Enalapril)',
            route: 'Vía Oral',
            frequency: 'Cada 24 horas (ajustar según bitácora domiciliaria)',
            duration: 'Tratamiento crónico continuo',
            rationale: 'Fármaco antihipertensivo de primera línea con protección cardiovascular y renal.',
          },
        ],
        generalMeasures: [
          'Dieta DASH baja en sodio (<5 g sal/día), aumentar consumo de verduras y frutas.',
          'Actividad física aeróbica regular (150 min/semana) y suspensión total del tabaquismo.',
          'Llevar registro diario de presión arterial en casa durante 2 semanas.',
        ],
        hospitalizationDecision: 'Ambulatorio',
        referralCriteria: [
          'Acudir a urgencias si presenta PA ≥180/120 mmHg acompañada de dolor torácico, falta de aire, visión borrosa súbita o debilidad facial/corporal.',
        ],
        followUp: 'Cita de seguimiento en consulta externa en 2 a 4 semanas con bitácora de presión arterial.',
      },
      criticalSafetyAlerts: [
        'No administrar nifedipino sublingual ni bajar bruscamente la presión en paciente asintomático sin daño a órgano blanco.',
      ],
      guidelineReferences: [
        'ESC / ESH Arterial Hypertension Guidelines',
        'AHA / ACC High Blood Pressure Guideline',
      ],
    },
    internalPersonaPrompt:
      'Habla en primera persona como Jorge, hombre de 51 años que viene a consulta porque le salió la presión alta en la farmacia y siente un dolor de cabeza leve en la nuca por las mañanas.',
  },
  {
    id: 'case-out-neuro-migrana',
    mode: 'principiante',
    specialty: 'neurologia',
    patientInfo: {
      name: 'Valeria Isabel Navarro',
      age: 29,
      sex: 'Femenino',
      occupation: 'Abogada laboralista',
      consultReason: 'Dolor pulsátil muy molesto en la mitad derecha de la cabeza con asco y molestia a la luz',
      evolutionTime: '6 horas de evolución (episodios recurrentes desde hace 3 años)',
      currentIllness:
        'Paciente femenina de 29 años que acude a consulta externa por un episodio típico de dolor de cabeza pulsátil intenso (8/10) localizado en el lado derecho (sien y detrás del ojo derecho) desde hace 6 horas. El dolor empeora al caminar o subir escaleras, se acompaña de náuseas intensas sin vómito, molestia importante a la luz brillante (fotofobia) y al ruido fuerte (fonofobia). Antes del dolor notó durante 20 minutos destellos luminosos en zigzag en la vista. Ayer durmió poco y se saltó la comida por audiencias. Niega fiebre, rigidez de cuello, debilidad de extremidades, pérdida del habla o trauma craneal.',
      triageLevel: 'Nivel IV (Prioritario)',
    },
    vitalSigns: {
      bloodPressure: '114/72 mmHg',
      heartRate: 78,
      respiratoryRate: 16,
      temperature: 36.6,
      oxygenSaturation: 99,
      glasgow: 15,
      bloodGlucose: 90,
      weightKg: 60,
      heightCm: 166,
    },
    background: {
      pathological: ['Episodios similares de cefalea unilateral 1 a 2 veces al mes desde los 26 años, relacionados con estrés, desvelo o menstruación.'],
      nonPathological: ['No fuma; toma 2 tazas de café al día.'],
      family: ['Madre con antecedentes de jaquecas/migraña desde joven.'],
      surgical: ['Niega cirugías.'],
      currentMedications: ['Tomó 1 tableta de paracetamol 500 mg hace 3 horas sin mejoría.'],
      allergies: ['Sin alergias conocidas.'],
    },
    physicalExamPool: [
      {
        id: 'pe-neuro-migrana',
        system: 'Neurológico',
        name: 'Exploración neurológica completa y signos meníngeos',
        finding: 'Paciente alerta, orientada, prefiere luz tenue. Fondo de ojo normal sin papiledema. Pares craneales íntegros, fuerza 5/5 simétrica, sensibilidad y marcha normales. Cuello completamente flexible, signos de Kernig y Brudzinski negativos.',
        isAbnormal: false,
        semiologyNote: 'Examen neurológico completamente normal en cefalea episódica típica descarta banderas rojas de cefalea secundaria.',
      },
      {
        id: 'pe-cabeza-migrana',
        system: 'Cabeza y Cuello',
        name: 'Palpación craneal y senos paranasales',
        finding: 'Sin dolor a la digitopresión de senos paranasales ni arterias temporales; leve hipersensibilidad pericraneal derecha.',
        isAbnormal: false,
      },
    ],
    studiesPool: [
      {
        id: 'img-tac-migrana',
        category: 'Imagen',
        subcategory: 'Tomografía',
        name: 'Valoración clínica (Criterios ICHD-3 — Neuroimagen diferida)',
        result: 'No indicada de urgencia: paciente con patrón típico crónico recurrente, aura visual gradual de 20 min, sin déficit focal, sin fiebre ni inicio en trueno.',
        referenceRange: 'Sin banderas rojas (SNOOP4 negativo)',
        interpretation: 'Cumple criterios clínicos completos de migraña clásica con aura sin requerir radiación innecesaria.',
        isAbnormal: false,
      },
    ],
    solution: {
      correctDiagnosis: 'Migraña Clásica con Aura Visual',
      differentialDiagnoses: [
        'Cefalea tensional episódica',
        'Sinusitis aguda frontal',
        'Hemorragia subaracnoidea (descartada por inicio gradual, episodios previos y exploración normal)',
      ],
      pathophysiology:
        'Depresión cortical propagada (responsable del aura visual reversible) seguida de activación del sistema trigémino-vascular con liberación de péptido relacionado con el gen de la calcitonina (CGRP) e inflamación neurogénica meníngea.',
      keyClinicalClues: [
        'Cefalea hemicraneana pulsátil que empeora con actividad física de rutina',
        'Fotofobia, fonofobia, náuseas y aura visual en zigzag previa de 20 minutos',
        'Exploración neurológica íntegra sin signos de alarma (SNOOP negativo)',
      ],
      characteristicSignsSymptoms: [
        'Dolor pulsátil unilateral',
        'Fotofobia, fonofobia y náuseas',
        'Aura visual reversible previa',
      ],
      criticalRulingOutFactors: [
        'Ausencia de inicio súbito en trueno, fiebre, rigidez nucal o déficit motor descartan urgencias neurovasculares e infecciosas.',
      ],
      recommendedWorkup: [
        'Diagnóstico clínico mediante criterios de la International Headache Society (ICHD-3)',
        'Búsqueda sistemática de banderas rojas neurológicas',
      ],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Sumatriptán',
            dose: '50 mg (o 100 mg)',
            route: 'Vía Oral',
            frequency: 'Dosis única al inicio de la fase de cefalea (puede repetirse una vez tras 2 horas si persiste)',
            duration: 'Uso agudo por crisis',
            rationale: 'Agonista 5-HT1B/1D específico para abortar crisis de migraña moderada a intensa que no respondió a paracetamol.',
          },
          {
            drug: 'Naproxeno sódico + Metoclopramida (alternativa o coadyuvante)',
            dose: '550 mg VO + 10 mg VO',
            route: 'Vía Oral',
            frequency: 'Dosis inicial ante crisis',
            duration: 'Por razón necesaria en crisis',
            rationale: 'Controla inflamación neurogénica y mejora las náuseas y absorción gástrica.',
          },
        ],
        generalMeasures: [
          'Reposar en habitación oscura y silenciosa durante la crisis.',
          'Llevar diario de cefaleas e identificar desencadenantes (ayuno prolongado, desvelo, estrés, ciertos quesos o vino).',
          'Evitar abuso de analgésicos (>10-15 días/mes) para prevenir cefalea por sobreuso.',
        ],
        hospitalizationDecision: 'Ambulatorio',
        referralCriteria: [
          'Acudir a urgencias si aparece un dolor de cabeza explosivo "el peor de la vida", fiebre con rigidez de cuello, debilidad corporal o alteración persistente del habla/visión.',
        ],
        followUp: 'Control en consulta externa en 4 semanas con diario de migrañas para valorar profilaxis si aumenta la frecuencia (>4 crisis/mes).',
      },
      criticalSafetyAlerts: [
        'Contraindicación de triptanes en pacientes con cardiopatía isquémica o hipertensión no controlada; revisar antecedentes antes de prescribir.',
      ],
      guidelineReferences: [
        'ICHD-3 International Classification of Headache Disorders',
        'AHS Consensus Statement on Acute Migraine Treatment',
      ],
    },
    internalPersonaPrompt:
      'Habla en primera persona como Valeria, abogada de 29 años con dolor pulsátil en el lado derecho de la cabeza desde hace 6 horas, náuseas y molestia a la luz después de ver destellos en zigzag.',
  },
  {
    id: 'case-out-derma-zoster',
    mode: 'principiante',
    specialty: 'dermatologia',
    patientInfo: {
      name: 'Martha Beatriz Cárdenas',
      age: 62,
      sex: 'Femenino',
      occupation: 'Maestra jubilada',
      consultReason: 'Ampollitas muy ardorosas en una franja del costado derecho que no pasan al otro lado',
      evolutionTime: '48 horas desde la aparición de las lesiones',
      currentIllness:
        'Paciente femenina de 62 años que acude a consulta externa porque hace 4 días comenzó con un ardor y piquetes eléctricos muy molestos en el costado derecho del tórax sin tener nada en la piel, pensando que era un desgarre muscular. Hace 48 horas aparecieron grupos de ronchitas rojas que se llenaron de agua (ampollitas pequeñas) siguiendo una banda desde la espalda derecha hacia adelante debajo del pecho derecho, sin cruzar la línea media. Niega fiebre alta, lesiones en la cara o en los ojos.',
      triageLevel: 'Nivel IV (Prioritario)',
    },
    vitalSigns: {
      bloodPressure: '126/78 mmHg',
      heartRate: 76,
      respiratoryRate: 16,
      temperature: 36.8,
      oxygenSaturation: 98,
      glasgow: 15,
      bloodGlucose: 99,
      weightKg: 66,
      heightCm: 159,
    },
    background: {
      pathological: ['Tuvo varicela en la infancia. Hipotiroidismo leve bien controlado.'],
      nonPathological: ['No fuma ni toma alcohol. Refiere mucho estrés familiar reciente.'],
      family: ['Sin antecedentes dermatológicos relevantes.'],
      surgical: ['Apendicectomía hace 30 años.'],
      currentMedications: ['Levotiroxina 50 mcg cada mañana. Aplicó crema hidratante común sin mejoría.'],
      allergies: ['Sin alergias conocidas.'],
    },
    physicalExamPool: [
      {
        id: 'pe-piel-zoster',
        system: 'Osteomuscular y Piel',
        name: 'Inspección dermatológica de tórax',
        finding: 'Múltiples vesículas agrupadas en racimos sobre placas eritematosas distribuidas estrictamente de forma unilateral siguiendo el dermatoma torácico T6 derecho, respetando tajantemente la línea media anterior y posterior. Hiperestesia e alodinia al roce en la zona.',
        isAbnormal: true,
        semiologyNote: 'Vesículas agrupadas en base eritematosa ("gotas de rocío sobre pétalo de rosa") confinadas a un solo dermatoma unilateral es patognomónico.',
      },
      {
        id: 'pe-cabeza-zoster',
        system: 'Cabeza y Cuello',
        name: 'Revisión ocular y facial',
        finding: 'Rostro, frente, punta nasal y globos oculares completamente libres de lesiones.',
        isAbnormal: false,
      },
    ],
    studiesPool: [
      {
        id: 'lab-bh-zoster',
        category: 'Laboratorio',
        subcategory: 'Hematología',
        name: 'Biometría Hemática y Glucosa basal',
        result: 'Leucocitos: 7,200 /mm³ | Hemoglobina: 13.4 g/dL | Glucosa ayuno: 99 mg/dL.',
        referenceRange: 'Normal',
        interpretation: 'Sin inmunosupresión hematológica ni hiperglucemia descompensada.',
        isAbnormal: false,
      },
    ],
    solution: {
      correctDiagnosis: 'Herpes Zóster Torácico No Complicado',
      differentialDiagnoses: [
        'Dermatitis de contacto aguda',
        'Impétigo ampolloso',
        'Herpes simple zosteriforme',
      ],
      pathophysiology:
        'Reactivación del virus varicela-zóster latente en el ganglio de la raíz dorsal (T6 derecho) asociada al descenso de la inmunidad celular por edad y estrés, migrando por el nervio sensitivo hacia el dermatoma cutáneo correspondiente.',
      keyClinicalClues: [
        'Dolor urente prodrómico seguido de vesículas agrupadas sobre base eritematosa',
        'Distribución estrictamente unilateral en franja metamérica que no cruza la línea media',
        'Inicio cutáneo dentro de la ventana terapéutica óptima (<72 horas)',
      ],
      characteristicSignsSymptoms: [
        'Dolor ardoroso / alodinia previo a las lesiones',
        'Vesículas en racimos siguiendo un dermatoma unilateral',
      ],
      criticalRulingOutFactors: [
        'Ausencia de compromiso de rama oftálmica del trigémino (sin lesiones en frente/punta nasal), diseminación multidermatómica o inmunosupresión severa permiten manejo ambulatorio.',
      ],
      recommendedWorkup: [
        'Diagnóstico eminentemente clínico por morfología y distribución metamérica característica',
      ],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Valaciclovir (o Aciclovir)',
            dose: '1,000 mg cada 8 horas (o Aciclovir 800 mg 5 veces al día)',
            route: 'Vía Oral',
            frequency: 'Cada 8 horas (Valaciclovir)',
            duration: '7 días',
            rationale: 'Antiviral sistémico iniciado en <72 horas acorta la duración del brote, acelera curación y disminuye el riesgo de neuralgia postherpética.',
          },
          {
            drug: 'Paracetamol o Pregabalina/Gabapentina (si dolor neuropático intenso)',
            dose: 'Paracetamol 500-1000 mg c/8h (o Gabapentina 300 mg nocturno)',
            route: 'Vía Oral',
            frequency: 'Según intensidad del dolor',
            duration: '7 a 14 días',
            rationale: 'Control del dolor agudo neuropático e inflamatorio.',
          },
        ],
        generalMeasures: [
          'Mantener lesiones limpias y secas; evitar reventar vesículas o aplicar remedios caseros/corticoides tópicos.',
          'Evitar contacto cercano con embarazadas sin varicela previa, recién nacidos o personas inmunocomprometidas hasta que todas las lesiones estén en fase de costra.',
        ],
        hospitalizationDecision: 'Ambulatorio',
        referralCriteria: [
          'Acudir de inmediato si aparecen vesículas en cara/nariz/ojo, fiebre alta, infección bacteriana secundaria con pus o diseminación por todo el cuerpo.',
        ],
        followUp: 'Control en consulta externa en 7 a 10 días para vigilar cicatrización y evaluar dolor neuropático residual.',
      },
      criticalSafetyAlerts: [
        'El éxito máximo del antiviral oral ocurre cuando se inicia dentro de las primeras 72 horas desde la aparición del exantema.',
        'Nunca prescribir corticoides tópicos sobre vesículas activas de herpes zóster.',
      ],
      guidelineReferences: [
        'European Consensus-Based Guideline on the Management of Herpes Zoster',
      ],
    },
    internalPersonaPrompt:
      'Habla en primera persona como Martha, señora de 62 años con ampollitas muy ardorosas en una franja del lado derecho del pecho desde hace 2 días, que antes solo te ardía la piel.',
  },
  {
    id: 'case-out-trauma-esguince',
    mode: 'principiante',
    specialty: 'traumatologia',
    patientInfo: {
      name: 'Luis Fernando Ortega',
      age: 26,
      sex: 'Masculino',
      occupation: 'Ingeniero de sistemas',
      consultReason: 'Torcedura e hinchazón en el tobillo derecho tras pisar mal jugando fútbol',
      evolutionTime: '12 horas de evolución',
      currentIllness:
        'Paciente masculino de 26 años que acude a consulta externa cojeando levemente porque ayer por la noche, al caer de un salto jugando fútbol recreativo, se le dobló el tobillo derecho hacia adentro (inversión). Sintió dolor agudo en la parte externa del tobillo, pero pudo dar más de 4 pasos cargando su peso inmediatamente después y hoy también logra apoyar parcialmente el pie. Amaneció con hinchazón y un pequeño moretón debajo del tobillo externo. Niega chasquido óseo fuerte, adormecimiento del pie o dolor en la rodilla.',
      triageLevel: 'Nivel IV (Prioritario)',
    },
    vitalSigns: {
      bloodPressure: '118/76 mmHg',
      heartRate: 76,
      respiratoryRate: 16,
      temperature: 36.5,
      oxygenSaturation: 99,
      glasgow: 15,
      bloodGlucose: 91,
      weightKg: 75,
      heightCm: 178,
    },
    background: {
      pathological: ['Sin enfermedades crónicas ni fracturas previas.'],
      nonPathological: ['Practica deporte recreativo fines de semana. No fuma.'],
      family: ['Sin antecedentes relevantes.'],
      surgical: ['Niega cirugías.'],
      currentMedications: ['Aplicó bolsa de hielo 15 minutos anoche.'],
      allergies: ['Sin alergias conocidas.'],
    },
    physicalExamPool: [
      {
        id: 'pe-osteo-tobillo',
        system: 'Osteomuscular y Piel',
        name: 'Exploración dirigida de tobillo y Reglas de Ottawa',
        finding: 'Edema moderado y equimosis leve anteroinferior al maléolo lateral derecho. Dolor localizado sobre el ligamento peroneoastragalino anterior y a la inversión pasiva. Sin dolor a la palpación ósea en borde posterior ni punta de ambos maléolos, base del 5° metatarsiano ni escafoides; capaz de caminar 4 pasos apoyando el talón. Pulso pedio presente, llenado capilar <2 s y sensibilidad intacta.',
        isAbnormal: true,
        semiologyNote: 'Reglas de Ottawa para tobillo completamente NEGATIVAS: la sensibilidad para descartar fractura supera el 98%.',
      },
    ],
    studiesPool: [
      {
        id: 'img-rx-tobillo',
        category: 'Imagen',
        subcategory: 'Radiología',
        name: 'Radiografía AP, Lateral y Mortaja de Tobillo Derecho (si se solicita por duda)',
        result: 'Alineación articular tibioastragalina conservada, sin trazos de fractura en maléolos ni base del 5° metatarsiano; aumento de volumen de partes blandas laterales.',
        referenceRange: 'Estructuras óseas íntegras',
        interpretation: 'Confirma ausencia de fractura (esguince lateral de tobillo grado II).',
        isAbnormal: false,
      },
    ],
    solution: {
      correctDiagnosis: 'Esguince Lateral de Tobillo Derecho Grado II (Reglas de Ottawa Negativas)',
      differentialDiagnoses: [
        'Fractura de maléolo lateral o base del 5° metatarsiano',
        'Rotura del tendón de Aquiles',
        'Lesión sindesmal alta',
      ],
      pathophysiology:
        'Sobredistensión y desgarro parcial del complejo ligamentario lateral (principalmente ligamento peroneoastragalino anterior) secundario a mecanismo forzado de inversión y flexión plantar del tobillo.',
      keyClinicalClues: [
        'Mecanismo clásico de inversión forzada con edema y equimosis anterolateral',
        'Capacidad de dar >4 pasos y ausencia de dolor óseo en zonas de Ottawa',
        'Integridad neurovascular distal y radiografía sin fracturas',
      ],
      characteristicSignsSymptoms: [
        'Dolor en cara lateral del tobillo tras torcedura en inversión',
        'Edema y equimosis inframaleolar externa',
        'Estabilidad ósea conservada',
      ],
      criticalRulingOutFactors: [
        'Reglas de Ottawa negativas + pulsos y sensibilidad conservados descartan fractura desplazada o compromiso neurovascular.',
      ],
      recommendedWorkup: [
        'Evaluación clínica sistemática con Reglas de Ottawa de tobillo/pie',
        'Radiografía únicamente si algún criterio de Ottawa resulta positivo',
      ],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Ibuprofeno (o Naproxeno)',
            dose: '400 mg cada 8 horas (con alimentos)',
            route: 'Vía Oral',
            frequency: 'Cada 8 horas',
            duration: '5 días',
            rationale: 'Control del dolor e inflamación aguda en fase temprana.',
          },
        ],
        generalMeasures: [
          'Protocolo POLICE: Protección funcional (tobillera estabilizadora o vendaje elástico, evitar yeso rígido innecesario), carga progresiva tolerada, hielo local 15-20 min c/6h por 48h, compresión y elevación.',
          'Ejercicios tempranos de movilidad suave y propiocepción a partir de la disminución del dolor agudo.',
        ],
        hospitalizationDecision: 'Ambulatorio',
        referralCriteria: [
          'Revalorar si persiste incapacidad para apoyar el pie después de 5-7 días o inestabilidad crónica.',
        ],
        followUp: 'Control en consulta externa en 7 a 10 días para guiar rehabilitación propioceptiva y retorno deportivo.',
      },
      criticalSafetyAlerts: [
        'Evitar inmovilización rígida prolongada con bota de yeso en esguinces grados I-II porque retrasa la recuperación funcional.',
      ],
      guidelineReferences: [
        'KNGF / British Journal of Sports Medicine Consensus on Acute Lateral Ankle Sprain',
      ],
    },
    internalPersonaPrompt:
      'Habla en primera persona como Luis Fernando, joven de 26 años que se torció el tobillo hacia adentro anoche jugando fútbol, pero sí pudiste caminar unos pasos.',
  },
  {
    id: 'case-out-ped-otitis',
    mode: 'principiante',
    specialty: 'pediatria',
    patientInfo: {
      name: 'Mateo Sebastián Vargas (traído por su madre)',
      age: 5,
      sex: 'Masculino',
      occupation: 'Preescolar (5 años)',
      consultReason: 'Dolor intenso de oído derecho y fiebre desde anoche que no lo dejó dormir',
      evolutionTime: '18 horas de evolución',
      currentIllness:
        'Paciente pediátrico de 5 años traído a consulta externa por su madre porque hace 4 días comenzó con moco claro y congestión nasal leve tipo resfriado común. Anoche alrededor de las 11:00 p.m. despertó llorando desconsoladamente agarrándose el oído derecho y presentando fiebre de 38.5°C. Hoy sigue irritable y con poco apetito, aunque toma líquidos. Niega salida de líquido o pus por el oído, dolor detrás de la oreja, tos perruna, dificultad respiratoria o rigidez de cuello.',
      triageLevel: 'Nivel IV (Prioritario)',
    },
    vitalSigns: {
      bloodPressure: '96/62 mmHg',
      heartRate: 112,
      respiratoryRate: 22,
      temperature: 38.4,
      oxygenSaturation: 99,
      glasgow: 15,
      bloodGlucose: 94,
      weightKg: 19,
      heightCm: 110,
    },
    background: {
      pathological: ['Esquema de vacunación completo para su edad (incluyendo neumococo). Sin otitis recurrentes previas.'],
      nonPathological: ['Asiste a preescolar; padres no fumadores.'],
      family: ['Sin antecedentes relevantes.'],
      surgical: ['Niega cirugías.'],
      currentMedications: ['Su madre le dio 1 dosis de paracetamol pediátrico en la madrugada con alivio temporal.'],
      allergies: ['Sin alergias conocidas a medicamentos.'],
    },
    physicalExamPool: [
      {
        id: 'pe-cabeza-oma',
        system: 'Cabeza y Cuello',
        name: 'Otoscopia bilateral y palpación mastoidea',
        finding: 'Oído derecho: membrana timpánica intensamente eritematosa, opaca y francamente abombada con pérdida del reflejo luminoso y movilidad disminuida; conducto auditivo externo libre sin otorrea. Mastoides derecha sin eritema ni dolor. Oído izquierdo normal. Faringe levemente hiperémica sin exudado.',
        isAbnormal: true,
        semiologyNote: 'El abombamiento moderado-severo de la membrana timpánica es el signo otoscópico más específico de otitis media aguda bacteriana.',
      },
      {
        id: 'pe-torax-oma',
        system: 'Tórax y Pulmones',
        name: 'Auscultación pulmonar',
        finding: 'Campos pulmonares limpios y bien ventilados bilateralmente, sin sibilancias ni tiraje.',
        isAbnormal: false,
      },
    ],
    studiesPool: [
      {
        id: 'lab-oma-clinico',
        category: 'Laboratorio',
        subcategory: 'Inflamación e Infección',
        name: 'Evaluación Clínica Otoscópica (Laboratorios no requeridos)',
        result: 'Otitis media aguda derecha unilateral moderada-severa confirmada por otoscopia (fiebre >38°C y otalgia intensa >18h con abombamiento timpánico).',
        referenceRange: 'Diagnóstico clínico',
        interpretation: 'No requiere biometría hemática ni radiografías de rutina en paciente pediátrico inmunocompetente.',
        isAbnormal: true,
      },
    ],
    solution: {
      correctDiagnosis: 'Otitis Media Aguda Derecha',
      differentialDiagnoses: [
        'Otitis externa aguda (dolor al traccionar el pabellón auricular, conducto edematoso)',
        'Miringitis viral catarral (sin abombamiento timpánico)',
        'Mastoiditis aguda (descartada por ausencia de dolor/eritema retroauricular o desplazamiento del pabellón)',
      ],
      pathophysiology:
        'Disfunción y obstrucción de la trompa de Eustaquio secundaria a infección viral respiratoria alta previa, acumulando secreción en oído medio y favoreciendo sobreinfección bacteriana (S. pneumoniae, H. influenzae, M. catarrhalis).',
      keyClinicalClues: [
        'Resfriado previo de 4 días seguido de otalgia nocturna aguda y fiebre de 38.4°C en niño de 5 años',
        'Otoscopia con membrana timpánica eritematosa, opaca y francamente abombada',
        'Ausencia de signos de mastoiditis o compromiso meníngeo',
      ],
      characteristicSignsSymptoms: [
        'Otalgia aguda nocturna postcatarral',
        'Fiebre en niño preescolar',
        'Tímpano abombado y eritematoso a la otoscopia',
      ],
      criticalRulingOutFactors: [
        'Pabellón auricular sin desplazamiento ni dolor mastoideo descartan mastoiditis.',
        'Ausencia de dolor a la tracción del trago y conducto normal descartan otitis externa.',
      ],
      recommendedWorkup: [
        'Otoscopia neumática / directa bilateral (diagnóstico clínico definitivo)',
      ],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Amoxicilina (dosis alta pediátrica)',
            dose: '80 a 90 mg/kg/día (~500 mg cada 8 horas o 850 mg c/12h para 19 kg)',
            route: 'Vía Oral',
            frequency: 'Cada 8 o 12 horas',
            duration: '7 días (en niños ≥2 años con cuadro moderado-severo)',
            rationale: 'Tratamiento de primera elección por adecuada penetración en oído medio frente a S. pneumoniae.',
          },
          {
            drug: 'Ibuprofeno o Paracetamol pediátrico',
            dose: 'Ibuprofeno 10 mg/kg (190 mg) cada 8 horas',
            route: 'Vía Oral',
            frequency: 'Cada 8 horas por dolor o fiebre',
            duration: '3 a 5 días',
            rationale: 'El control temprano del dolor ótico es prioritario en pediatría.',
          },
        ],
        generalMeasures: [
          'Mantener hidratación oral adecuada y lavados nasales suaves con solución salina para descongestionar.',
          'No introducir gotas óticas caseras ni hisopos en el oído.',
        ],
        hospitalizationDecision: 'Ambulatorio',
        referralCriteria: [
          'Acudir a urgencias si aparece hinchazón o enrojecimiento detrás de la oreja, fiebre que no baja tras 48-72 horas de antibiótico, vómitos persistentes o somnolencia excesiva.',
        ],
        followUp: 'Revaloración en 48-72 horas si persisten fiebre o dolor; de lo contrario, seguimiento habitual.',
      },
      criticalSafetyAlerts: [
        'Calcular siempre la amoxicilina por peso (80-90 mg/kg/día), evitando subdosificación en pediatría.',
        'Evitar descongestionantes orales o antihistamínicos sistémicos en niños pequeños por falta de eficacia y riesgo de efectos adversos.',
      ],
      guidelineReferences: [
        'AAP Clinical Practice Guideline: Diagnosis and Management of Acute Otitis Media',
      ],
    },
    internalPersonaPrompt:
      'Responde en primera persona como la mamá de Mateo (5 años): traes a tu hijo porque tuvo moco hace 4 días y anoche despertó llorando por dolor fuerte de oído derecho y fiebre.',
  },
  {
    id: 'case-out-gine-candidiasis',
    mode: 'principiante',
    specialty: 'ginecologia',
    patientInfo: {
      name: 'Andrea Paola Vázquez',
      age: 25,
      sex: 'Femenino',
      occupation: 'Asistente administrativa',
      consultReason: 'Comezón vaginal muy intensa y flujo blanco espeso desde hace 3 días',
      evolutionTime: '3 días de evolución',
      currentIllness:
        'Paciente femenina de 25 años que acude a consulta externa por prurito vulvovaginal intenso de 3 días de evolución acompañado de ardor superficial al rozar la orina y flujo vaginal blanquecino espeso, grumoso (como requesón), sin mal olor. Refiere que hace 10 días terminó un esquema de antibiótico amplio por una infección dental. Niega dolor en la parte baja del abdomen, fiebre, flujo amarillento fétido o sangrado fuera de su regla.',
      triageLevel: 'Nivel V (No Urgente)',
    },
    vitalSigns: {
      bloodPressure: '110/70 mmHg',
      heartRate: 74,
      respiratoryRate: 16,
      temperature: 36.6,
      oxygenSaturation: 99,
      glasgow: 15,
      bloodGlucose: 88,
      weightKg: 59,
      heightCm: 165,
    },
    background: {
      pathological: ['Sin enfermedades crónicas; último Papanicolaou hace 1 año normal.'],
      nonPathological: ['Vida sexual activa con pareja única estable (usa preservativo). Ropa interior sintética ajustada y uso reciente de amoxicilina/ácido clavulánico hace 10 días.'],
      family: ['Madre sana.'],
      surgical: ['Niega cirugías.'],
      currentMedications: ['Ninguno actualmente.'],
      allergies: ['Sin alergias conocidas.'],
    },
    physicalExamPool: [
      {
        id: 'pe-gine-candida',
        system: 'Osteomuscular y Piel',
        name: 'Inspección vulvovaginal y especuloscopia',
        finding: 'Eritema y edema leve en labios menores y vestíbulo vulvar con escoriaciones leves por rascado. En especuloscopia: paredes vaginales eritematosas con placas adherentes de secreción blanca espesa grumosa sin olor a pescado; cérvix sano sin dolor a la movilización.',
        isAbnormal: true,
      },
      {
        id: 'pe-abdomen-candida',
        system: 'Abdomen',
        name: 'Palpación abdominal',
        finding: 'Abdomen blando, depresible, indoloro en hipogastrio y fosas ilíacas, sin datos de irritación peritoneal.',
        isAbnormal: false,
      },
    ],
    studiesPool: [
      {
        id: 'lab-fresco-candida',
        category: 'Laboratorio',
        subcategory: 'Microbiología / Serología',
        name: 'pH vaginal, Prueba de KOH (aminas) y Examen en fresco',
        result: 'pH vaginal: 4.1 (ácido normal) | Prueba de aminas (KOH 10%): negativa (sin olor a pescado) | Microscopía con KOH: presencia abundante de levaduras en gemación y pseudohifas.',
        referenceRange: 'pH vaginal 3.8-4.5, sin pseudohifas',
        interpretation: 'Confirma candidiasis vulvovaginal aguda con pH ácido conservado.',
        isAbnormal: true,
      },
      {
        id: 'lab-embarazo-candida',
        category: 'Laboratorio',
        subcategory: 'Urinario',
        name: 'Prueba rápida de embarazo en orina',
        result: 'Negativa.',
        referenceRange: 'Negativa',
        interpretation: 'Descarta embarazo previo a prescripción de fluconazol oral.',
        isAbnormal: false,
      },
    ],
    solution: {
      correctDiagnosis: 'Candidiasis Vulvovaginal Aguda No Complicada',
      differentialDiagnoses: [
        'Vaginosis bacteriana (flujo grisáceo homogéneo, pH >4.5 y olor a pescado)',
        'Tricomoniasis (flujo espumoso amarillo-verdoso, pH >4.5)',
        'Dermatitis de contacto vulvar',
      ],
      pathophysiology:
        'Sobrecrecimiento oportunista de Candida albicans tras alteración de la microbiota lactobacilar vaginal normal inducida por antibioticoterapia reciente.',
      keyClinicalClues: [
        'Prurito vulvar intenso y flujo blanco grumoso inodoro tras uso reciente de antibióticos',
        'Eritema vulvovaginal sin dolor pélvico ni dolor a la movilización cervical',
        'pH vaginal normal (4.1), prueba de aminas negativa y pseudohifas en KOH',
      ],
      characteristicSignsSymptoms: [
        'Prurito vulvovaginal intenso',
        'Leucorrea blanca grumosa tipo requesón sin mal olor',
        'Antecedente reciente de antibióticos',
      ],
      criticalRulingOutFactors: [
        'Ausencia de dolor hipogástrico, fiebre y movilización cervical indolora descartan enfermedad pélvica inflamatoria.',
        'pH ≤4.5 y KOH sin olor a aminas descartan vaginosis bacteriana y tricomoniasis.',
      ],
      recommendedWorkup: [
        'Determinación de pH vaginal y examen directo en fresco / KOH al 10%',
        'Descartar embarazo antes de usar azoles orales',
      ],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Fluconazol (o Clotrimazol crema/óvulos vaginales)',
            dose: '150 mg',
            route: 'Vía Oral',
            frequency: 'Dosis única (alternativa tópica: Clotrimazol óvulos 500 mg dosis única o 100 mg c/24h por 7 días)',
            duration: 'Dosis única',
            rationale: 'Tratamiento antimicótico de primera línea altamente efectivo en candidiasis aguda no complicada.',
          },
        ],
        generalMeasures: [
          'Usar ropa interior de algodón holgada, evitar duchas vaginales, jabones perfumados y protectores diarios continuos.',
          'No es necesario tratar de rutina a la pareja masculina si está asintomática.',
        ],
        hospitalizationDecision: 'Ambulatorio',
        referralCriteria: [
          'Solicitar cultivo micológico si presenta ≥4 episodios al año (candidiasis recurrente) o falta de respuesta al tratamiento.',
        ],
        followUp: 'Acudir nuevamente únicamente si los síntomas persisten después de 7 días o recurren en los siguientes 2 meses.',
      },
      criticalSafetyAlerts: [
        'En caso de embarazo confirmado, está contraindicado el fluconazol oral y se debe usar únicamente azol tópico vaginal por 7 días.',
      ],
      guidelineReferences: [
        'CDC STI Treatment Guidelines: Vulvovaginal Candidiasis',
      ],
    },
    internalPersonaPrompt:
      'Habla en primera persona como Andrea, joven de 25 años con mucha comezón vaginal y flujo blanco espeso sin mal olor desde hace 3 días, después de tomar antibióticos por una muela.',
  },
  {
    id: 'case-out-mi-anemia-ferropenica',
    mode: 'principiante',
    specialty: 'medicina_interna',
    patientInfo: {
      name: 'Lorena Alejandra Castro',
      age: 33,
      sex: 'Femenino',
      occupation: 'Enfermera de consulta',
      consultReason: 'Mucho cansancio, palidez y falta de aire al subir escaleras desde hace dos meses',
      evolutionTime: '2 meses de evolución progresiva',
      currentIllness:
        'Paciente femenina de 33 años que acude a consulta externa porque en los últimos 2 meses se siente muy fatigada, con sueño durante el día, palpitaciones leves y falta de aire al subir dos pisos de escaleras. Sus compañeras le dijeron que se ve muy pálida y ella ha notado que mastica hielo con mucha frecuencia. Refiere que sus periodos menstruales desde hace un año duran 7 a 8 días con coágulos abundantes (cambia toalla cada 2 horas los primeros días). Niega sangrado rectal, vómitos con sangre, fiebre o pérdida de peso.',
      triageLevel: 'Nivel V (No Urgente)',
    },
    vitalSigns: {
      bloodPressure: '108/68 mmHg',
      heartRate: 92,
      respiratoryRate: 18,
      temperature: 36.5,
      oxygenSaturation: 99,
      glasgow: 15,
      bloodGlucose: 87,
      weightKg: 58,
      heightCm: 162,
    },
    background: {
      pathological: ['Sangrado menstrual abundante (hipermenorrea) desde hace 1 año sin estudio ginecológico previo.'],
      nonPathological: ['Dieta omnívora aunque con bajo consumo de carne roja. No fuma.'],
      family: ['Madre con miomatosis uterina operada a los 42 años.'],
      surgical: ['Niega cirugías previas.'],
      currentMedications: ['Ninguno.'],
      allergies: ['Sin alergias conocidas.'],
    },
    physicalExamPool: [
      {
        id: 'pe-general-anemia',
        system: 'General',
        name: 'Inspección de conjuntivas, mucosa oral y uñas',
        finding: 'Palidez marcada de conjuntivas palpebrales, lechos ungueales y palmas. Lengua ligeramente lisa y despapilada (glositis leve); uñas frágiles con discreto aplanamiento.',
        isAbnormal: true,
      },
      {
        id: 'pe-cardio-anemia',
        system: 'Cardiovascular',
        name: 'Auscultación cardíaca',
        finding: 'Ruidos cardíacos rítmicos con discreto soplo sistólico funcional grado II/VI en foco pulmonar por estado hiperdinámico.',
        isAbnormal: true,
      },
    ],
    studiesPool: [
      {
        id: 'lab-bh-anemia',
        category: 'Laboratorio',
        subcategory: 'Hematología',
        name: 'Biometría Hemática Completa y Reticulocitos',
        result: 'Hemoglobina: 8.9 g/dL | Hematocrito: 28.4% | VCM: 69 fL (microcitosis) | HCM: 22 pg (hipocromía) | RDW: 17.8% (elevado) | Plaquetas: 410,000 /mm³ | Reticulocitos corregidos: 0.7%.',
        referenceRange: 'Hb 12.0-15.5 g/dL, VCM 80-100 fL',
        interpretation: 'Anemia microcítica hipocrómica moderada con anisocitosis (RDW alto) y trombocitosis reactiva leve.',
        isAbnormal: true,
      },
      {
        id: 'lab-cinetica-hierro',
        category: 'Laboratorio',
        subcategory: 'Bioquímica',
        name: 'Cinética de Hierro y Ferritina Sérica',
        result: 'Ferritina sérica: 7 ng/mL | Hierro sérico: 26 mcg/dL | Saturación de transferrina: 7% | TIBC: 430 mcg/dL.',
        referenceRange: 'Ferritina 15-150 ng/mL, Sat transferrina 20-50%',
        interpretation: 'Depleción severa de depósitos de hierro confirmatoria de anemia ferropénica.',
        isAbnormal: true,
      },
    ],
    solution: {
      correctDiagnosis: 'Anemia Ferropénica Crónica Secundaria a Hipermenorrea',
      differentialDiagnoses: [
        'Talasemia menor (VCM bajo pero RDW normal y ferritina normal/alta)',
        'Anemia de enfermedad crónica (ferritina normal o elevada)',
        'Hipotiroidismo',
      ],
      pathophysiology:
        'Pérdida sanguínea crónica ginecológica que supera la capacidad de absorción intestinal de hierro, agotando primero las reservas (ferritina <15 ng/mL) y comprometiendo después la síntesis de hemoglobina con eritropoyesis microcítica hipocrómica.',
      keyClinicalClues: [
        'Fatiga, palidez conjuntival, disnea de esfuerzos y pagofagia (deseo de masticar hielo) con hipermenorrea de 1 año',
        'Anemia microcítica hipocrómica con RDW elevado',
        'Ferritina sérica muy baja (7 ng/mL) y saturación de transferrina <10%',
      ],
      characteristicSignsSymptoms: [
        'Astenia y disnea de esfuerzos',
        'Palidez mucocutánea y pagofagia',
        'Sangrado menstrual abundante crónico',
      ],
      criticalRulingOutFactors: [
        'Paciente hemodinámicamente estable sin angina ni falla cardíaca permite reposición oral ambulatoria sin transfusión.',
        'Ferritina de 7 ng/mL distingue ferropenia verdadera de rasgo talasémico o anemia inflamatoria.',
      ],
      recommendedWorkup: [
        'Biometría hemática con índices eritrocitarios (VCM, HCM, RDW)',
        'Ferritina sérica e índices de hierro',
        'Ultrasonido pélvico ginecológico para investigar causa de hipermenorrea (ej. miomas)',
      ],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Sulfato ferroso (o Fumarato ferroso)',
            dose: '200 mg (65 mg de hierro elemental) o esquema en días alternos para mejor absorción',
            route: 'Vía Oral',
            frequency: 'Cada 24 horas en ayunas o con jugo cítrico (vitamina C)',
            duration: '3 a 6 meses (continuar 3 meses tras normalizar Hb para rellenar depósitos)',
            rationale: 'Reposición oral estándar costo-efectiva en paciente estable.',
          },
        ],
        generalMeasures: [
          'Evitar tomar el hierro junto con café, té, leche, calcio o antiácidos.',
          'Advertir que las evacuaciones se tornarán de color oscuro/negruzco por el hierro oral.',
          'Solicitar ultrasonido pélvico y valoración por ginecología para controlar el sangrado menstrual.',
        ],
        hospitalizationDecision: 'Ambulatorio',
        referralCriteria: [
          'Referencia programada a Ginecología para estudio de hipermenorrea.',
        ],
        followUp: 'Repetir biometría hemática a las 4 semanas (esperar incremento de Hb ≥1-2 g/dL) y ferritina al completar 3-4 meses.',
      },
      criticalSafetyAlerts: [
        'No transfundir concentrados eritrocitarios en anemia ferropénica crónica estable (Hb 8.9 g/dL) sin descompensación hemodinámica.',
        'Siempre tratar la causa de base (estudio ginecológico del sangrado) además de reponer hierro.',
      ],
      guidelineReferences: [
        'BSG / ASH Guidelines for the Management of Iron Deficiency Anaemia',
      ],
    },
    internalPersonaPrompt:
      'Habla en primera persona como Lorena, enfermera de 33 años con cansancio progresivo, palidez, falta de aire al subir escaleras, antojo de masticar hielo y reglas muy abundantes de 8 días.',
  },
  {
    id: 'case-out-endo-dm2',
    mode: 'medico_general',
    specialty: 'endocrinologia',
    patientInfo: {
      name: 'Héctor Mauricio Delgado',
      age: 48,
      sex: 'Masculino',
      occupation: 'Propietario de tienda de abarrotes',
      consultReason: 'Mucha sed, orinar muy seguido incluso en la noche y cansancio desde hace 2 meses',
      evolutionTime: '2 meses de evolución',
      currentIllness:
        'Paciente masculino de 48 años que acude a consulta externa porque desde hace 2 meses siente una sed constante que lo hace tomar más de 3 litros de agua o refresco al día y levantarse 3 a 4 veces en la madrugada a orinar en abundante cantidad. Ha bajado 3 kg sin hacer dieta y nota visión levemente borrosa al final del día y mucho cansancio. Niega náuseas, vómitos, dolor abdominal, respiración agitada o fiebre. Ayer comió normal y trabajó todo el día.',
      triageLevel: 'Nivel V (No Urgente)',
    },
    vitalSigns: {
      bloodPressure: '134/84 mmHg',
      heartRate: 80,
      respiratoryRate: 16,
      temperature: 36.6,
      oxygenSaturation: 98,
      glasgow: 15,
      bloodGlucose: 224,
      weightKg: 94,
      heightCm: 172,
    },
    background: {
      pathological: ['Obesidad grado I (IMC 31.8 kg/m²). Glucosa "en el límite" hace 3 años sin seguimiento.'],
      nonPathological: ['Sedentario, consumo diario de bebidas azucaradas y pan dulce.'],
      family: ['Madre y dos hermanos mayores con diabetes mellitus tipo 2.'],
      surgical: ['Niega cirugías.'],
      currentMedications: ['Ninguno.'],
      allergies: ['Sin alergias conocidas.'],
    },
    physicalExamPool: [
      {
        id: 'pe-general-dm2',
        system: 'Osteomuscular y Piel',
        name: 'Inspección metabólica y pies',
        finding: 'Obesidad central (perímetro abdominal 106 cm). Acantosis nigricans marcada en pliegue posterior del cuello y axilas. Mucosas hidratadas, sin aliento cetónico. Pulsos pedios presentes y sensibilidad conservada al monofilamento en ambos pies.',
        isAbnormal: true,
        semiologyNote: 'La acantosis nigricans es un marcador cutáneo clásico de resistencia a la insulina.',
      },
      {
        id: 'pe-abdomen-dm2',
        system: 'Abdomen',
        name: 'Exploración abdominal',
        finding: 'Abdomen blando, depresible, indoloro, sin signos de irritación peritoneal.',
        isAbnormal: false,
      },
    ],
    studiesPool: [
      {
        id: 'lab-glucosa-dm2',
        category: 'Laboratorio',
        subcategory: 'Bioquímica',
        name: 'Glucosa en ayuno y Hemoglobina Glucosilada (HbA1c)',
        result: 'Glucosa sérica en ayuno: 204 mg/dL | Hemoglobina glucosilada (HbA1c): 8.9% | Creatinina: 0.90 mg/dL (TFGe >90 mL/min).',
        referenceRange: 'Glucosa ayuno <100 mg/dL, HbA1c <5.7% (diabetes ≥6.5%)',
        interpretation: 'Cumple criterios diagnósticos francos de diabetes mellitus tipo 2 con hiperglucemia sintomática sin cetosis.',
        isAbnormal: true,
      },
      {
        id: 'lab-ego-dm2',
        category: 'Laboratorio',
        subcategory: 'Urinario',
        name: 'Examen General de Orina (EGO) y Perfil Lipídico',
        result: 'EGO: Glucosuria +++ | Cetonas: NEGATIVAS | Nitritos negativos. Triglicéridos: 235 mg/dL | HDL: 36 mg/dL.',
        referenceRange: 'Glucosa y cetonas negativas en orina',
        interpretation: 'Glucosuria por superación del umbral renal sin cetonuria ni infección urinaria; dislipidemia mixta asociada.',
        isAbnormal: true,
      },
    ],
    solution: {
      correctDiagnosis: 'Diabetes Mellitus Tipo 2 de Debut (Sin Descompensación Aguda)',
      differentialDiagnoses: [
        'Cetoacidosis diabética (descartada por ausencia de vómitos, acidosis y cetonuria)',
        'Diabetes insípida',
        'Hiperplasia prostática benigna (causa nocturia pero sin polidipsia ni hiperglucemia)',
      ],
      pathophysiology:
        'Resistencia periférica a la insulina asociada a obesidad visceral y disfunción progresiva de la célula beta pancreática, generando hiperglucemia sostenida, diuresis osmótica (poliuria) y polidipsia compensatoria.',
      keyClinicalClues: [
        'Poliuria, polidipsia y pérdida ponderal leve en adulto con obesidad central y acantosis nigricans',
        'Glucemia en ayuno 204 mg/dL y HbA1c 8.9% con síntomas clásicos',
        'Ausencia de cetonas en orina, vómitos o respiración acidótica',
      ],
      characteristicSignsSymptoms: [
        'Poliuria, nocturia y polidipsia',
        'Acantosis nigricans y obesidad central',
        'Glucosuria sin cetonuria',
      ],
      criticalRulingOutFactors: [
        'EGO sin cetonas, sin vómitos y estado general estable descartan emergencia hiperglucémica y permiten manejo ambulatorio.',
      ],
      recommendedWorkup: [
        'Glucosa plasmática en ayuno, HbA1c y EGO',
        'Tamizaje basal de complicaciones: creatinina/TFGe, relación albúmina/creatinina urinaria, perfil lipídico y fondo de ojo',
      ],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Metformina',
            dose: '500 mg iniciales (escalar a 850 mg cada 12 horas según tolerancia GI)',
            route: 'Vía Oral',
            frequency: 'Cada 24h inicialmente con la cena, luego cada 12h con alimentos',
            duration: 'Tratamiento crónico continuo',
            rationale: 'Fármaco de primera línea en DM2 con función renal normal (TFGe >30), mejora sensibilidad a la insulina sin causar hipoglucemia.',
          },
        ],
        generalMeasures: [
          'Suspender refrescos y azúcares simples; plan nutricional hipocalórico balanceado.',
          'Ejercicio aeróbico + fuerza mínimo 150 min/semana y educación en cuidado de pies e hipoglucemia.',
        ],
        hospitalizationDecision: 'Ambulatorio',
        referralCriteria: [
          'Valoración oftalmológica basal anual y nutrición clínica.',
        ],
        followUp: 'Cita en consulta externa en 2 a 4 semanas para revisar tolerancia a metformina y glucometrías capilares; repetir HbA1c en 3 meses (meta <7.0%).',
      },
      criticalSafetyAlerts: [
        'No confundir hiperglucemia ambulatoria estable sin cetosis con cetoacidosis ni iniciar insulina IV en piso si no hay criterios de crisis hiperglucémica.',
      ],
      guidelineReferences: [
        'ADA Standards of Care in Diabetes (2025)',
      ],
    },
    internalPersonaPrompt:
      'Habla en primera persona como Héctor Mauricio, señor de 48 años con mucha sed, ganas de orinar a cada rato incluso de noche, cansancio y manchas oscuras en el cuello.',
  },
  {
    id: 'case-out-psiq-ansiedad',
    mode: 'medico_general',
    specialty: 'psiquiatria',
    patientInfo: {
      name: 'Carolina Méndez Solís',
      age: 31,
      sex: 'Femenino',
      occupation: 'Ejecutiva de recursos humanos',
      consultReason: 'Nerviosismo constante, nudo en la garganta, opresión leve en el pecho e insomnio',
      evolutionTime: '8 meses de evolución',
      currentIllness:
        'Paciente femenina de 31 años que acude a consulta externa muy preocupada porque desde hace 8 meses siente una angustia y preocupación difícil de controlar casi todos los días por problemas laborales y familiares mínimos. Refiere tensión constante en hombros y cuello, dificultad para conciliar el sueño porque "la mente no se apaga", irritabilidad y episodios breves en la oficina donde siente latidos rápidos y nudo en el estómago. Niega pérdida de peso, intolerancia al calor, fiebre, consumo de drogas, ideación suicida o dolor opresivo al hacer ejercicio.',
      triageLevel: 'Nivel V (No Urgente)',
    },
    vitalSigns: {
      bloodPressure: '116/74 mmHg',
      heartRate: 84,
      respiratoryRate: 16,
      temperature: 36.6,
      oxygenSaturation: 99,
      glasgow: 15,
      bloodGlucose: 91,
      weightKg: 61,
      heightCm: 165,
    },
    background: {
      pathological: ['Sin enfermedades crónicas ni trastornos médicos previos.'],
      nonPathological: ['Toma 2 tazas de café al día; no fuma ni consume sustancias ilícitas. Duerme menos de 5 horas por noche.'],
      family: ['Madre con trastorno de ansiedad tratado hace años.'],
      surgical: ['Niega cirugías.'],
      currentMedications: ['Toma tés relajantes por las noches sin mejoría.'],
      allergies: ['Sin alergias conocidas.'],
    },
    physicalExamPool: [
      {
        id: 'pe-general-tag',
        system: 'General',
        name: 'Estado mental y exploración cervical',
        finding: 'Paciente inquieta, vigil, orientada en las 3 esferas, lenguaje coherente pero preocupado. Contractura muscular paravertebral cervical y trapecios; tiroides de tamaño normal sin nódulos ni temblor fino distal.',
        isAbnormal: true,
      },
      {
        id: 'pe-cardio-tag',
        system: 'Cardiovascular',
        name: 'Auscultación cardíaca',
        finding: 'Ruidos cardíacos rítmicos a 84 lpm, sin soplos ni arritmias.',
        isAbnormal: false,
      },
    ],
    studiesPool: [
      {
        id: 'lab-tsh-tag',
        category: 'Laboratorio',
        subcategory: 'Bioquímica',
        name: 'TSH Sérica y Biometría Hemática (Descarte orgánico)',
        result: 'TSH: 1.9 mUI/L | Hemoglobina: 13.5 g/dL | Glucosa ayuno: 91 mg/dL.',
        referenceRange: 'TSH 0.4-4.0 mUI/L',
        interpretation: 'Descarta hipertiroidismo, anemia o hipoglucemia como causa orgánica de las palpitaciones e inquietud.',
        isAbnormal: false,
      },
      {
        id: 'gab-ecg-tag',
        category: 'Gabinete y Trazados',
        subcategory: 'Electrocardiograma',
        name: 'Electrocardiograma de 12 derivaciones',
        result: 'Ritmo sinusal normal a 82 lpm, PR e intervalo QTc normales, sin arritmias ni signos de isquemia.',
        referenceRange: 'Normal',
        interpretation: 'Descarta arritmia supraventricular o patología cardíaca estructural.',
        isAbnormal: false,
      },
    ],
    solution: {
      correctDiagnosis: 'Trastorno de Ansiedad Generalizada (TAG)',
      differentialDiagnoses: [
        'Hipertiroidismo (descartado por TSH normal)',
        'Arritmia cardíaca paroxística (ECG normal y sin síncope)',
        'Trastorno de pánico aislado',
      ],
      pathophysiology:
        'Hiperactividad crónica del circuito amígdala-corteza prefrontal con desregulación serotoninérgica, noradrenérgica y gabaérgica que mantiene un estado sostenido de hipervigilancia autonómica y tensión somática (>6 meses).',
      keyClinicalClues: [
        'Preocupación excesiva incontrolable >6 meses asociada a insomnio, tensión muscular, irritabilidad y síntomas autonómicos',
        'Tamizaje orgánico completo negativo (TSH normal, ECG normal, sin consumo de estimulantes)',
        'Sin ideación suicida ni síntomas psicóticos',
      ],
      characteristicSignsSymptoms: [
        'Ansiedad y preocupación persistente ≥6 meses',
        'Tensión muscular cervical e insomnio de conciliación',
        'Palpitaciones funcionales con ECG y tiroides normales',
      ],
      criticalRulingOutFactors: [
        'Es indispensable descartar hipertiroidismo (TSH), arritmias y consumo de sustancias antes de confirmar diagnóstico psiquiátrico primario.',
        'Evaluar siempre riesgo suicida (negativo en la paciente).',
      ],
      recommendedWorkup: [
        'Entrevista clínica estructurada (criterios DSM-5 / escala GAD-7)',
        'TSH, biometría hemática y ECG basal para descartar etiología orgánica',
      ],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Sertralina (o Escitalopram)',
            dose: '50 mg (iniciar 25 mg los primeros 7 días para minimizar ansiedad inicial)',
            route: 'Vía Oral',
            frequency: 'Cada 24 horas por la mañana',
            duration: 'Mínimo 6 a 12 meses tras remisión sintomática',
            rationale: 'ISRS de primera línea en TAG; seguro, sin potencial adictivo a diferencia de benzodiacepinas crónicas.',
          },
        ],
        generalMeasures: [
          'Psicoterapia cognitivo-conductual (TCC) como pilar fundamental del manejo.',
          'Higiene del sueño, reducir cafeína, técnicas de respiración diafragmática y ejercicio aeróbico regular.',
          'Explicar que el efecto ansiolítico pleno del ISRS tarda 2 a 4 semanas.',
        ],
        hospitalizationDecision: 'Ambulatorio',
        referralCriteria: [
          'Referencia prioritaria a psiquiatría si surge ideación suicida, depresión severa o falta de respuesta tras 8-12 semanas de tratamiento adecuado.',
        ],
        followUp: 'Cita de control en consulta externa en 2 semanas para vigilar tolerancia al ISRS y reevaluar síntomas.',
      },
      criticalSafetyAlerts: [
        'Evitar prescribir benzodiacepinas como monoterapia crónica por riesgo de dependencia.',
        'Advertir al paciente no suspender abruptamente el ISRS.',
      ],
      guidelineReferences: [
        'NICE Guideline: Generalised Anxiety Disorder and Panic Disorder in Adults',
      ],
    },
    internalPersonaPrompt:
      'Habla en primera persona como Carolina, mujer de 31 años con preocupación constante desde hace 8 meses, hombros tensos, problemas para dormir y sustos con latidos rápidos del corazón.',
  },
  {
    id: 'case-out-cirugia-hernia',
    mode: 'medico_general',
    specialty: 'cirugia_general',
    patientInfo: {
      name: 'Armando Javier Paredes',
      age: 54,
      sex: 'Masculino',
      occupation: 'Bodeguero en mercado de abastos',
      consultReason: 'Bulto en la ingle derecha que sale cuando cargo cosas y se mete al acostarme',
      evolutionTime: '5 meses de evolución',
      currentIllness:
        'Paciente masculino de 54 años que acude a consulta externa porque desde hace 5 meses nota una bolita blanda en la ingle derecha cada vez que levanta cajas pesadas, tose o puja en el baño. Cuando se acuesta boca arriba o la empuja suavemente con la mano, el bulto se vuelve a meter sin problema. Solo siente una pesadez leve al final de su jornada laboral. Niega dolor intenso repentino, enrojecimiento de la piel sobre el bulto, náuseas, vómitos o imposibilidad para canalizar gases.',
      triageLevel: 'Nivel V (No Urgente)',
    },
    vitalSigns: {
      bloodPressure: '122/78 mmHg',
      heartRate: 74,
      respiratoryRate: 16,
      temperature: 36.5,
      oxygenSaturation: 98,
      glasgow: 15,
      bloodGlucose: 95,
      weightKg: 79,
      heightCm: 171,
    },
    background: {
      pathological: ['Tos crónica leve matutina de fumador y estreñimiento ocasional.'],
      nonPathological: ['Levanta cargas de 25-35 kg en su trabajo; fuma 8 cigarros diarios.'],
      family: ['Padre operado de hernia inguinal a los 60 años.'],
      surgical: ['Niega cirugías previas.'],
      currentMedications: ['Ninguno.'],
      allergies: ['Sin alergias conocidas.'],
    },
    physicalExamPool: [
      {
        id: 'pe-abdomen-hernia',
        system: 'Abdomen',
        name: 'Exploración inguinal en bipedestación y decúbito (maniobra de Valsalva)',
        finding: 'En bipedestación y al pedirle toser/pujar (Valsalva) protruye tumoración blanda de ~4 cm por encima del ligamento inguinal derecho que desciende hacia el anillo inguinal superficial, con impulso positivo a la tos. En decúbito supino se reduce manualmente con facilidad hacia la cavidad abdominal sin dolor. Piel suprayacente normal sin eritema ni aumento de temperatura.',
        isAbnormal: true,
        semiologyNote: 'Hernia inguinal reductible no complicada: ausencia de irreductibilidad, dolor intenso, eritema o signos obstructivos.',
      },
    ],
    studiesPool: [
      {
        id: 'img-usg-hernia',
        category: 'Imagen',
        subcategory: 'Ecografía',
        name: 'Ultrasonido de región inguinal derecha (confirmatorio / preoperatorio)',
        result: 'Defecto herniario de 1.8 cm en pared inguinal derecha lateral a vasos epigástricos inferiores, con protrusión de grasa preperitoneal y asa intestinal viable al Valsalva, totalmente reductible en reposo.',
        referenceRange: 'Integridad de canal inguinal',
        interpretation: 'Confirma hernia inguinal indirecta derecha no complicada y reductible.',
        isAbnormal: true,
      },
    ],
    solution: {
      correctDiagnosis: 'Hernia Inguinal Derecha Reductible No Complicada',
      differentialDiagnoses: [
        'Hernia inguinal encarcerada / estrangulada (descartada por reducción fácil y ausencia de dolor/eritema/vómitos)',
        'Hernia femoral (protruye por debajo del ligamento inguinal)',
        'Adenopatía inguinal o hidrocele del cordón',
      ],
      pathophysiology:
        'Protrusión de contenido preperitoneal o intraabdominal a través de un anillo inguinal profundo debilitado, precipitada por aumentos repetidos de la presión intraabdominal (carga pesada, tos crónica, pujo).',
      keyClinicalClues: [
        'Aumento de volumen inguinal derecho que protruye al pujar/cargar y se reduce al acostarse',
        'Ausencia de dolor agudo, fiebre, cambios cutáneos o síntomas de obstrucción intestinal',
        'Ultrasonido confirmatorio de defecto inguinal totalmente reductible',
      ],
      characteristicSignsSymptoms: [
        'Masa inguinal por encima del ligamento inguinal con impulso positivo al Valsalva',
        'Reductibilidad espontánea o manual en decúbito',
      ],
      criticalRulingOutFactors: [
        'Fácil reducción manual, abdomen blando e indoloro y ausencia de vómitos descartan encarceramiento o estrangulación (no es urgencia quirúrgica inmediata).',
      ],
      recommendedWorkup: [
        'Exploración física inguinal en pie y decúbito con maniobra de Valsalva (diagnóstico clínico)',
        'Exámenes preoperatorios básicos para cirugía electiva',
      ],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Analgésico simple solo si hay pesadez ocasional (Paracetamol 500 mg PRN)',
            dose: '500 mg',
            route: 'Vía Oral',
            frequency: 'Por razón necesaria',
            duration: 'Solo mientras se programa cirugía',
            rationale: 'El tratamiento definitivo es quirúrgico electivo; no requiere antibióticos ni analgesia crónica.',
          },
        ],
        generalMeasures: [
          'Evitar cargar objetos pesados, suspender tabaquismo (mejora cicatrización y reduce tos) y tratar estreñimiento con dieta rica en fibra.',
          'Explicar estrictamente signos de alarma para acudir a urgencias si el bulto deja de meterse o duele mucho.',
        ],
        hospitalizationDecision: 'Ambulatorio',
        referralCriteria: [
          'Referencia programada a Cirugía General para hernioplastia inguinal electiva con malla (técnica de Lichtenstein o laparoscópica).',
          'Acudir de inmediato a urgencias si la hernia se torna dura, muy dolorosa, roja o no se reduce acompañada de náuseas/vómitos.',
        ],
        followUp: 'Valoración preoperatoria por Cirugía General en consulta externa.',
      },
      criticalSafetyAlerts: [
        'Educar claramente al paciente sobre los signos de encarceramiento/estrangulación.',
        'No intentar maniobras forzadas si en algún momento se torna dolorosa o irreducible.',
      ],
      guidelineReferences: [
        'HerniaSurge International Guidelines for Groin Hernia Management',
      ],
    },
    internalPersonaPrompt:
      'Habla en primera persona como Armando, bodeguero de 54 años que tiene un bulto en la ingle derecha desde hace 5 meses que sale al cargar cajas y se mete solo al acostarse, sin dolor fuerte.',
  },
  {
    id: 'case-out-urg-vppb',
    mode: 'medico_general',
    specialty: 'urgencias',
    patientInfo: {
      name: 'Rosa María Treviño',
      age: 56,
      sex: 'Femenino',
      occupation: 'Costurera',
      consultReason: 'Mareo intenso donde todo me da vueltas por segundos cuando me volteo en la cama',
      evolutionTime: '2 días de evolución',
      currentIllness:
        'Paciente femenina de 56 años que acude porque ayer por la mañana, al darse vuelta en la cama hacia el lado derecho para levantarse, sintió de golpe que todo el cuarto le daba vueltas durante unos 20 segundos acompañado de náuseas. Cada vez que mira hacia arriba o se recuesta rápido vuelve a sentir el giro breve, pero si mantiene la cabeza quieta se le quita por completo. Niega zumbido de oídos, pérdida de la audición, dolor de cabeza intenso, visión doble, dificultad para hablar o debilidad en brazos/piernas.',
      triageLevel: 'Nivel IV (Prioritario)',
    },
    vitalSigns: {
      bloodPressure: '124/78 mmHg',
      heartRate: 76,
      respiratoryRate: 16,
      temperature: 36.5,
      oxygenSaturation: 98,
      glasgow: 15,
      bloodGlucose: 94,
      weightKg: 64,
      heightCm: 157,
    },
    background: {
      pathological: ['Sin enfermedades crónicas ni eventos vasculares previos.'],
      nonPathological: ['No fuma ni consume alcohol.'],
      family: ['Sin antecedentes relevantes.'],
      surgical: ['Niega cirugías.'],
      currentMedications: ['Ninguno.'],
      allergies: ['Sin alergias conocidas.'],
    },
    physicalExamPool: [
      {
        id: 'pe-neuro-vppb',
        system: 'Neurológico',
        name: 'Maniobra de Dix-Hallpike y exploración cerebelosa/pares craneales',
        finding: 'Pares craneales II-XII íntegros, fuerza 5/5, dismetría negativa (dedo-nariz normal), marcha sin lateralización en reposo. Al realizar maniobra de Dix-Hallpike hacia la derecha aparece, tras 3 segundos de latencia, vértigo objetivo y nistagmo geotrópico torsional hacia arriba que se agota en ~18 segundos.',
        isAbnormal: true,
        semiologyNote: 'Nistagmo con latencia breve, torsional-geotrópico y fatigable <60s en Dix-Hallpike confirma VPPB de conducto semicircular posterior derecho.',
      },
      {
        id: 'pe-orl-vppb',
        system: 'Cabeza y Cuello',
        name: 'Otoscopia y prueba auditiva de cabecera',
        finding: 'Ambos conductos y membranas timpánicas normales; audición conservada simétrica sin hipoacusia.',
        isAbnormal: false,
      },
    ],
    studiesPool: [
      {
        id: 'img-vppb-clinico',
        category: 'Imagen',
        subcategory: 'Tomografía',
        name: 'Criterios clínicos HINTS / Dix-Hallpike (Neuroimagen no indicada)',
        result: 'Vértigo episódico posicional breve (<1 min) con Dix-Hallpike típico y exploración neurológica focal normal: no requiere TAC ni RMN cerebral.',
        referenceRange: 'Sin datos centrales',
        interpretation: 'Confirma vértigo periférico posicional paroxístico benigno sin sospecha de EVC cerebeloso.',
        isAbnormal: false,
      },
    ],
    solution: {
      correctDiagnosis: 'Vértigo Posicional Paroxístico Benigno (VPPB) de Canal Posterior Derecho',
      differentialDiagnoses: [
        'Neuronitis vestibular (vértigo continuo por días sin desencadenante posicional)',
        'Enfermedad de Ménière (asociada a acúfenos, plenitud ótica e hipoacusia fluctuante)',
        'Evento vascular cerebral vertebrobasilar / cerebeloso (descartado por duración breve posicional y examen neurológico normal)',
      ],
      pathophysiology:
        'Desprendimiento de otoconias (otolitos) desde el utrículo hacia el conducto semicircular posterior derecho (canalolitiasis), generando flujo anormal de endolinfa y estimulación vestibular breve ante cambios gravitacionales de la cabeza.',
      keyClinicalClues: [
        'Episodios breves (<30 segundos) de vértigo rotatorio desencadenados únicamente por cambios de posición cefálica',
        'Ausencia de síntomas auditivos (sin tinnitus ni hipoacusia) ni focalización neurológica',
        'Maniobra de Dix-Hallpike derecha positiva con nistagmo torsional fatigable con latencia',
      ],
      characteristicSignsSymptoms: [
        'Vértigo rotatorio breve al girar en la cama o mirar arriba',
        'Dix-Hallpike positivo típico',
        'Audición normal y examen neurológico limpio',
      ],
      criticalRulingOutFactors: [
        'Ausencia de diplopía, disartria, ataxia truncal, déficit motor o nistagmo vertical puro descartan vértigo central.',
      ],
      recommendedWorkup: [
        'Maniobra diagnóstica de Dix-Hallpike bilateral',
        'Exploración neurológica focal completa (pares craneales y pruebas cerebelosas)',
      ],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Sin supresores vestibulares de rutina (solo Dimenhidrinato o Metoclopramida dosis única si náusea intensa)',
            dose: 'Metoclopramida 10 mg VO dosis única opcional',
            route: 'Vía Oral',
            frequency: 'Únicamente si presenta náusea aguda durante la maniobra',
            duration: '1 día máximo',
            rationale: 'Las guías recomiendan NO dar betahistina ni cinarizina de rutina porque no resuelven los otolitos y retrasan la compensación.',
          },
        ],
        generalMeasures: [
          'Realizar en consultorio la Maniobra de Reposición Canalicular de Epley derecha (tratamiento curativo en >85% de los casos).',
          'Evitar movimientos bruscos del cuello en las próximas 24 horas y prevenir caídas en casa.',
        ],
        hospitalizationDecision: 'Ambulatorio',
        referralCriteria: [
          'Acudir a urgencias de inmediato si el mareo se vuelve continuo acompañado de visión doble, dificultad para hablar, debilidad o incapacidad para caminar.',
        ],
        followUp: 'Revalorar en 1 semana en consulta externa; repetir maniobra de Epley si persiste Dix-Hallpike positivo.',
      },
      criticalSafetyAlerts: [
        'El tratamiento de elección del VPPB es la maniobra física de Epley, no el uso prolongado de medicamentos antivertiginosos.',
      ],
      guidelineReferences: [
        'AAO-HNS Clinical Practice Guideline: Benign Paroxysmal Positional Vertigo',
      ],
    },
    internalPersonaPrompt:
      'Habla en primera persona como Rosa María, costurera de 56 años a la que todo le da vueltas por unos 20 segundos cuando te volteas en la cama o miras hacia arriba, pero se te quita al quedarte quieta.',
  },
  {
    id: 'case-out-gastro-sii',
    mode: 'principiante',
    specialty: 'gastroenterologia',
    patientInfo: {
      name: 'Daniela Alejandra Ruiz',
      age: 28,
      sex: 'Femenino',
      occupation: 'Diseñadora de interiores',
      consultReason: 'Cólicos abdominales, inflamación y alternancia entre diarrea y estreñimiento',
      evolutionTime: '7 meses de evolución',
      currentIllness:
        'Paciente femenina de 28 años que acude a consulta externa porque desde hace 7 meses presenta dolor abdominal tipo cólico en la parte baja de la panza al menos 2 días por semana, acompañado de distensión abdominal visible hacia la tarde. Nota que el dolor mejora claramente después de evacuar, y sus evacuaciones alternan entre días con heces blandas y días con estreñimiento. Los síntomas empeoran en semanas de mucho estrés laboral. Niega sangre en las heces, fiebre, pérdida de peso, despertar nocturno por diarrea o antecedentes familiares de cáncer de colon.',
      triageLevel: 'Nivel V (No Urgente)',
    },
    vitalSigns: {
      bloodPressure: '112/72 mmHg',
      heartRate: 74,
      respiratoryRate: 16,
      temperature: 36.5,
      oxygenSaturation: 99,
      glasgow: 15,
      bloodGlucose: 89,
      weightKg: 57,
      heightCm: 164,
    },
    background: {
      pathological: ['Sin enfermedades crónicas ni infecciones intestinales graves recientes.'],
      nonPathological: ['Alto estrés laboral y comidas irregulares con lácteos y harinas refinadas. No fuma.'],
      family: ['Sin antecedentes de enfermedad inflamatoria intestinal, enfermedad celíaca ni cáncer colorrectal.'],
      surgical: ['Niega cirugías.'],
      currentMedications: ['Butilhioscina ocasional cuando tiene cólico fuerte.'],
      allergies: ['Sin alergias conocidas.'],
    },
    physicalExamPool: [
      {
        id: 'pe-abdomen-sii',
        system: 'Abdomen',
        name: 'Exploración abdominal completa',
        finding: 'Abdomen ligeramente distendido y timpánico en marco cólico, blando, depresible, molestia leve difusa en fosa ilíaca izquierda sin masas ni rebote. Peristalsis presente.',
        isAbnormal: false,
      },
    ],
    studiesPool: [
      {
        id: 'lab-tamizaje-sii',
        category: 'Laboratorio',
        subcategory: 'Hematología',
        name: 'Biometría Hemática, PCR y Sangre Oculta en Heces',
        result: 'Hemoglobina: 13.6 g/dL | Leucocitos: 6,400 /mm³ | PCR ultrasensible: 0.2 mg/dL (normal) | Sangre oculta en heces: Negativa.',
        referenceRange: 'Hb 12-15.5 g/dL, PCR <0.5 mg/dL, SOH negativa',
        interpretation: 'Ausencia de anemia, inflamación sistémica o sangrado digestivo oculto.',
        isAbnormal: false,
      },
    ],
    solution: {
      correctDiagnosis: 'Síndrome de Intestino Irritable (Criterios de Roma IV)',
      differentialDiagnoses: [
        'Enfermedad inflamatoria intestinal (descartada por PCR normal, sin fiebre ni sangrado)',
        'Enfermedad celíaca / intolerancia a la lactosa',
        'Parasitosis intestinal crónica',
      ],
      pathophysiology:
        'Trastorno de la interacción intestino-cerebro caracterizado por hipersensibilidad visceral, motilidad intestinal alterada y respuesta exagerada al estrés psicosocial sin lesión orgánica estructural.',
      keyClinicalClues: [
        'Dolor abdominal recurrente ≥1 día/semana por >6 meses relacionado con la defecación (alivia al evacuar)',
        'Cambios en frecuencia y consistencia de las heces con distensión abdominal vespertina',
        'Ausencia total de signos de alarma (sin sangre, pérdida de peso, fiebre, anemia ni síntomas nocturnos)',
      ],
      characteristicSignsSymptoms: [
        'Dolor tipo cólico que mejora tras evacuar',
        'Distensión abdominal y patrón evacuatorio mixto',
        'Relación con estrés y ausencia de datos de alarma',
      ],
      criticalRulingOutFactors: [
        'Biometría normal, PCR normal y ausencia de sangrado/pérdida ponderal descartan indicación de colonoscopia urgente en mujer joven.',
      ],
      recommendedWorkup: [
        'Aplicación positiva de Criterios de Roma IV',
        'Estudios básicos mínimos de exclusión (BH, PCR; anticuerpos celíacos si predomina diarrea)',
      ],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Butilhioscina o Bromuro de pinaverio (antiespasmódico)',
            dose: 'Pinaverio 100 mg (o Butilhioscina 10 mg ante cólico)',
            route: 'Vía Oral',
            frequency: 'Cada 8-12 horas antes de los alimentos según síntomas',
            duration: '4 a 8 semanas',
            rationale: 'Reduce espasmo del músculo liso colónico y dolor visceral.',
          },
        ],
        generalMeasures: [
          'Dieta baja en FODMAP guiada o identificación de detonantes (lácteos, leguminosas en exceso, bebidas gasificadas), fibra soluble (psyllium) e hidratación.',
          'Actividad física regular y manejo del estrés.',
        ],
        hospitalizationDecision: 'Ambulatorio',
        referralCriteria: [
          'Reevaluar si aparece sangrado rectal, pérdida involuntaria de peso, fiebre o diarrea nocturna.',
        ],
        followUp: 'Control en consulta externa en 4 a 6 semanas para valorar respuesta dietética y sintomática.',
      },
      criticalSafetyAlerts: [
        'Evitar colonoscopias o tomografías repetidas innecesarias cuando se cumplen criterios de Roma IV sin banderas rojas.',
      ],
      guidelineReferences: [
        'ACG Clinical Guideline: Management of Irritable Bowel Syndrome',
        'Rome IV Criteria for Functional Gastrointestinal Disorders',
      ],
    },
    internalPersonaPrompt:
      'Habla en primera persona como Daniela, mujer de 28 años con cólicos abdominales, panza inflamada por las tardes y días alternos de diarrea o estreñimiento desde hace 7 meses.',
  },
  {
    id: 'case-out-cardio-fa-estable',
    mode: 'medico_general',
    specialty: 'cardiologia',
    patientInfo: {
      name: 'Ernesto Guillermo Salgado',
      age: 68,
      sex: 'Masculino',
      occupation: 'Contador jubilado',
      consultReason: 'Palpitaciones irregulares como brincos en el pecho y leve cansancio al caminar',
      evolutionTime: '3 semanas de evolución intermitente (ahora persistente desde ayer)',
      currentIllness:
        'Paciente masculino de 68 años que acude a consulta externa porque desde hace unas 3 semanas siente de vez en cuando palpitaciones rápidas e irregulares en el pecho, y desde ayer las nota de forma continua junto con ligera fatiga al caminar rápido. Niega dolor en el pecho, falta de aire en reposo, mareos intensos, desmayos o hinchazón de piernas.',
      triageLevel: 'Nivel IV (Prioritario)',
    },
    vitalSigns: {
      bloodPressure: '132/82 mmHg',
      heartRate: 108,
      respiratoryRate: 18,
      temperature: 36.5,
      oxygenSaturation: 97,
      glasgow: 15,
      bloodGlucose: 101,
      weightKg: 81,
      heightCm: 172,
    },
    background: {
      pathological: ['Hipertensión arterial sistémica desde hace 12 años en control con losartán.'],
      nonPathological: ['Exfumador desde hace 10 años, toma 1 taza de café al día.'],
      family: ['Padre con hipertensión arterial.'],
      surgical: ['Hernioplastia umbilical hace 15 años.'],
      currentMedications: ['Losartán 50 mg cada 24 horas.'],
      allergies: ['Sin alergias conocidas.'],
    },
    physicalExamPool: [
      {
        id: 'pe-cardio-fa',
        system: 'Cardiovascular',
        name: 'Auscultación cardíaca y pulsos periféricos',
        finding: 'Ruidos cardíacos francamente arrítmicos (irregularmente irregulares) a 108 lpm sin soplos audibles ni tercer ruido. Déficit de pulso radial respecto a frecuencia apical; sin ingurgitación yugular ni edema maleolar.',
        isAbnormal: true,
      },
      {
        id: 'pe-torax-fa',
        system: 'Tórax y Pulmones',
        name: 'Auscultación pulmonar',
        finding: 'Campos pulmonares bien ventilados sin estertores congestivos.',
        isAbnormal: false,
      },
    ],
    studiesPool: [
      {
        id: 'gab-ecg-fa',
        category: 'Gabinete y Trazados',
        subcategory: 'Electrocardiograma',
        name: 'Electrocardiograma de 12 derivaciones',
        result: 'Ausencia de ondas P definidas (sustituidas por ondas f fibrilatorias), intervalos R-R completamente irregulares con frecuencia ventricular media de 108 lpm, QRS estrecho (88 ms), sin elevación ni descenso del ST.',
        referenceRange: 'Ritmo sinusal 60-100 lpm',
        interpretation: 'Fibrilación auricular con respuesta ventricular moderadamente rápida, hemodinámicamente estable.',
        isAbnormal: true,
      },
      {
        id: 'lab-tsh-fa',
        category: 'Laboratorio',
        subcategory: 'Bioquímica',
        name: 'TSH, Electrolitos y Creatinina sérica',
        result: 'TSH: 2.1 mUI/L | K: 4.3 mEq/L | Na: 140 mEq/L | Creatinina: 0.98 mg/dL (TFGe 78 mL/min).',
        referenceRange: 'Normal',
        interpretation: 'Descarta hipertiroidismo o disiónia y confirma función renal adecuada para anticoagulación oral directa.',
        isAbnormal: false,
      },
    ],
    solution: {
      correctDiagnosis: 'Fibrilación Auricular Hemodinámicamente Estable (CHA2DS2-VASc ≥2)',
      differentialDiagnoses: [
        'Flutter auricular',
        'Extrasístoles auriculares o ventriculares frecuentes',
        'Taquicardia supraventricular paroxística (ritmo regular)',
      ],
      pathophysiology:
        'Actividad eléctrica auricular caótica múltiple que anula la contracción auricular efectiva, produce respuesta ventricular irregularmente irregular y favorece estasis sanguínea en orejuela izquierda con riesgo cardioembólico.',
      keyClinicalClues: [
        'Pulso irregularmente irregular con palpitaciones en adulto mayor hipertenso estable',
        'ECG sin ondas P e intervalos R-R totalmente irregulares',
        'Cálculo obligatorio de CHA2DS2-VASc (Edad 65-74 = +1, HTA = +1 → total 2 puntos)',
      ],
      characteristicSignsSymptoms: [
        'Palpitaciones rápidas irregulares',
        'Pulso irregularmente irregular sin ondas P en ECG',
      ],
      criticalRulingOutFactors: [
        'Presión arterial normal (132/82), ausencia de angina, edema pulmonar o alteración del estado mental descartan inestabilidad hemodinámica (no requiere cardioversión eléctrica urgente).',
      ],
      recommendedWorkup: [
        'Electrocardiograma de 12 derivaciones',
        'TSH, función renal, electrolitos y ecocardiograma transtorácico programado',
        'Cálculo de escalas CHA2DS2-VASc y HAS-BLED',
      ],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Metoprolol o Bisoprolol (control de frecuencia)',
            dose: 'Bisoprolol 2.5 - 5 mg (o Metoprolol tartrato 25-50 mg c/12h)',
            route: 'Vía Oral',
            frequency: 'Cada 24 horas (Bisoprolol)',
            duration: 'Crónico con ajuste según FC meta (<110 lpm en reposo)',
            rationale: 'Controla respuesta ventricular mejorando tolerancia al esfuerzo.',
          },
          {
            drug: 'Apixabán o Rivaroxabán (Anticoagulación oral directa)',
            dose: 'Apixabán 5 mg',
            route: 'Vía Oral',
            frequency: 'Cada 12 horas',
            duration: 'Crónico indefinido (CHA2DS2-VASc = 2)',
            rationale: 'Prevención fundamental de evento vascular cerebral cardioembólico.',
          },
        ],
        generalMeasures: [
          'Continuar losartán para control estricto de hipertensión y limitar consumo de alcohol/cafeína.',
          'Programar ecocardiograma transtorácico ambulatorio.',
        ],
        hospitalizationDecision: 'Ambulatorio',
        referralCriteria: [
          'Valoración programada por Cardiología; acudir a urgencias si aparece dolor torácico, disnea súbita, síncope o debilidad facial/corporal.',
        ],
        followUp: 'Cita en 1 a 2 semanas para revisar control de frecuencia cardíaca, adherencia a anticoagulante y resultado de ecocardiograma.',
      },
      criticalSafetyAlerts: [
        'Nunca olvidar iniciar anticoagulación oral en FA con CHA2DS2-VASc ≥2 (la aspirina sola NO es suficiente).',
        'No intentar cardioversión farmacológica ni eléctrica electiva en FA de inicio >48 horas o incierto sin anticoagulación previa de ≥3 semanas o ecocardiograma transesofágico.',
      ],
      guidelineReferences: [
        'ESC Guidelines for the Management of Atrial Fibrillation (2024)',
      ],
    },
    internalPersonaPrompt:
      'Habla en primera persona como Ernesto, contador jubilado de 68 años hipertenso que siente palpitaciones irregulares como brincos en el pecho desde ayer y un poco de cansancio al caminar.',
  },
  {
    id: 'case-out-neuro-paralisis-bell',
    mode: 'principiante',
    specialty: 'neurologia',
    patientInfo: {
      name: 'Alejandro Gutiérrez Silva',
      age: 36,
      sex: 'Masculino',
      occupation: 'Maestro de música',
      consultReason: 'Se me torció la mitad derecha de la cara y no puedo cerrar bien el ojo derecho desde hoy en la mañana',
      evolutionTime: '10 horas de evolución',
      currentIllness:
        'Paciente masculino de 36 años que acude preocupado porque hoy al levantarse y lavarse los dientes notó que se le salía el agua por el lado derecho de la boca, no puede arrugar la frente de ese lado ni cerrar completamente el ojo derecho, y siente los sonidos un poco más fuertes en ese oído. Niega debilidad o adormecimiento en brazo o pierna, dificultad para hablar, visión doble, dolor de oído con ampollas o fiebre.',
      triageLevel: 'Nivel IV (Prioritario)',
    },
    vitalSigns: {
      bloodPressure: '120/76 mmHg',
      heartRate: 78,
      respiratoryRate: 16,
      temperature: 36.6,
      oxygenSaturation: 99,
      glasgow: 15,
      bloodGlucose: 93,
      weightKg: 74,
      heightCm: 175,
    },
    background: {
      pathological: ['Tuvo un cuadro gripal leve hace 10 días. Sin hipertensión ni diabetes.'],
      nonPathological: ['No fuma, alcohol ocasional.'],
      family: ['Sin antecedentes neurológicos.'],
      surgical: ['Niega cirugías.'],
      currentMedications: ['Ninguno.'],
      allergies: ['Sin alergias conocidas.'],
    },
    physicalExamPool: [
      {
        id: 'pe-neuro-bell',
        system: 'Neurológico',
        name: 'Exploración de pares craneales y fuerza motora',
        finding: 'Parálisis facial periférica derecha completa: borramiento de arrugas frontales derechas (NO puede elevar la ceja derecha), lagoftalmos con signo de Bell positivo al intentar cerrar el ojo derecho, borramiento del surco nasogeniano y desviación de la comisura labial hacia la izquierda. Resto de pares craneales, fuerza 5/5 en las 4 extremidades, sensibilidad y marcha completamente normales.',
        isAbnormal: true,
        semiologyNote: 'El compromiso de la musculatura de la frente (imposibilidad de fruncir el ceño) diferencia de manera definitiva la parálisis facial periférica (VII par) de un EVC central (que respeta la frente).',
      },
      {
        id: 'pe-orl-bell',
        system: 'Cabeza y Cuello',
        name: 'Otoscopia bilateral y parótida',
        finding: 'Conducto auditivo externo y membrana timpánica derechos completamente sanos sin vesículas (descarta síndrome de Ramsay Hunt). Glándula parótida sin masas.',
        isAbnormal: false,
      },
    ],
    studiesPool: [
      {
        id: 'img-bell-clinico',
        category: 'Imagen',
        subcategory: 'Tomografía',
        name: 'Evaluación Clínica (Estudio de imagen no requerido en parálisis de Bell típica)',
        result: 'Parálisis periférica aislada del VII par craneal sin afectación de otros pares craneales ni extremidades: cuadro clásico idiopático (de Bell).',
        referenceRange: 'Diagnóstico clínico',
        interpretation: 'El compromiso frontal completo + otoscopia limpia + examen motor normal hacen innecesaria una TAC urgente.',
        isAbnormal: false,
      },
    ],
    solution: {
      correctDiagnosis: 'Parálisis Facial Periférica Idiopática (Parálisis de Bell)',
      differentialDiagnoses: [
        'Evento vascular cerebral isquémico (respeta el tercio superior/frente y suele acompañarse de hemiparesia/afasia)',
        'Síndrome de Ramsay Hunt (herpes zóster ótico con vesículas en conducto auditivo)',
        'Otitis media complicada o tumor parotídeo',
      ],
      pathophysiology:
        'Inflamación y edema agudo del séptimo par craneal (nervio facial) dentro del conducto facial óseo, frecuentemente asociado a reactivación subclínica de virus herpes simple tipo 1, provocando compresión reversible de la conducción motora.',
      keyClinicalClues: [
        'Debilidad facial unilateral aguda que involucra tanto la frente como la boca (parálisis periférica)',
        'Ausencia de vesículas óticas y resto del examen neurológico completamente normal',
        'Inicio dentro de las primeras 72 horas (ventana ideal para corticoides orales)',
      ],
      characteristicSignsSymptoms: [
        'Imposibilidad para arrugar la frente y cerrar el ojo ipsilateral',
        'Desviación de comisura bucal hacia el lado sano y lagoftalmos',
        'Fuerza normal en brazos y piernas',
      ],
      criticalRulingOutFactors: [
        'Compromiso de la frente + fuerza 5/5 en extremidades descartan EVC agudo.',
        'Otoscopia libre de vesículas descarta síndrome de Ramsay Hunt.',
      ],
      recommendedWorkup: [
        'Exploración minuciosa de musculatura facial superior e inferior, otoscopia y examen neurológico completo',
      ],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Prednisona (corticoide oral temprano)',
            dose: '60 mg diarios (o 1 mg/kg/día por 5 días y descenso en los 5 días siguientes)',
            route: 'Vía Oral',
            frequency: 'Cada 24 horas por la mañana',
            duration: '10 días en pauta descendente',
            rationale: 'Único tratamiento con evidencia robusta A para reducir edema del nervio y mejorar recuperación completa cuando se inicia en <72 h.',
          },
          {
            drug: 'Hipromelosa / Lágrimas artificiales + ungüento ocular nocturno',
            dose: '1-2 gotas cada 2-3 horas de día y ungüento + oclusión ocular nocturna',
            route: 'Vía Oftálmica',
            frequency: 'Frecuente durante el día y al dormir',
            duration: 'Hasta recuperar cierre palpebral completo',
            rationale: 'Previene úlcera corneal por exposición (lagoftalmos).',
          },
        ],
        generalMeasures: [
          'Protección ocular estricta con lentes y parche nocturno para dormir.',
          'Tranquilizar al paciente explicando que >80% se recupera favorablemente en semanas.',
        ],
        hospitalizationDecision: 'Ambulatorio',
        referralCriteria: [
          'Acudir a urgencias si aparece ojo rojo doloroso con visión borrosa (queratitis), o si surgen debilidad en extremidades u otros síntomas neurológicos.',
        ],
        followUp: 'Revalorar en consulta externa en 10-14 días para vigilar protección corneal e inicio de rehabilitación facial.',
      },
      criticalSafetyAlerts: [
        'Nunca omitir la protección ocular (lágrimas artificiales y cierre nocturno) porque el riesgo principal prevenible es la úlcera corneal.',
        'No dejar de revisar la frente ni el conducto auditivo antes de diagnosticar parálisis de Bell.',
      ],
      guidelineReferences: [
        'AAO-HNS / AAN Clinical Practice Guideline: Bell’s Palsy',
      ],
    },
    internalPersonaPrompt:
      'Habla en primera persona como Alejandro, maestro de 36 años que amaneció con la mitad derecha de la cara caída, no puedes cerrar el ojo derecho ni levantar la ceja y se te sale el agua al enjuagarte.',
  },
  {
    id: 'case-out-derma-tinea',
    mode: 'principiante',
    specialty: 'dermatologia',
    patientInfo: {
      name: 'Gabriel Eduardo Pineda',
      age: 22,
      sex: 'Masculino',
      occupation: 'Repartidor en motocicleta',
      consultReason: 'Mancha redonda roja que da mucha comezón en el brazo y va creciendo por la orilla',
      evolutionTime: '3 semanas de evolución',
      currentIllness:
        'Paciente masculino de 22 años que acude a consulta externa porque hace 3 semanas le salió un granito rojo en el antebrazo derecho que ha ido creciendo en forma de anillo o círculo con el borde más rojo y escamoso, mientras que el centro se ve un poco más claro. Le da mucha comezón, sobre todo cuando suda bajo la chamarra. Ayer notó que empezó a salirle otro parchecito similar en el hombro. Refiere haber adoptado hace un mes a un gatito callejero que tenía zonas sin pelo. Niega fiebre o dolor.',
      triageLevel: 'Nivel V (No Urgente)',
    },
    vitalSigns: {
      bloodPressure: '114/72 mmHg',
      heartRate: 72,
      respiratoryRate: 16,
      temperature: 36.5,
      oxygenSaturation: 99,
      glasgow: 15,
      bloodGlucose: 88,
      weightKg: 70,
      heightCm: 174,
    },
    background: {
      pathological: ['Sin enfermedades previas.'],
      nonPathological: ['Adoptó un gato hace 1 mes; usa ropa sintética gruesa en su trabajo.'],
      family: ['Sin antecedentes relevantes.'],
      surgical: ['Niega cirugías.'],
      currentMedications: ['Se aplicó crema con betametasona que tenía en casa hace 5 días y sintió que la mancha se extendió más.'],
      allergies: ['Sin alergias conocidas.'],
    },
    physicalExamPool: [
      {
        id: 'pe-piel-tinea',
        system: 'Osteomuscular y Piel',
        name: 'Inspección dermatológica de miembro superior derecho',
        finding: 'En cara extensora de antebrazo derecho se observa placa eritematosa anular de 5 cm bien delimitada, con borde activo sobreelevado, papulovesiculoso y descamativo, y tendencia a la curación central. Otra placa anular más pequeña (1.5 cm) en región deltoidea derecha.',
        isAbnormal: true,
        semiologyNote: 'Placa anular con borde activo escamoso y aclaramiento central es típica de tiña corporal (dermatofitosis); empeora con corticoides tópicos ("tiña incógnito").',
      },
    ],
    studiesPool: [
      {
        id: 'lab-koh-tinea',
        category: 'Laboratorio',
        subcategory: 'Microbiología / Serología',
        name: 'Examen directo de escamas con KOH al 10%',
        result: 'Presencia abundante de hifas septadas ramificadas compatibles con dermatofitos (Microsporum canis / Trichophyton).',
        referenceRange: 'Negativo para elementos fúngicos',
        interpretation: 'Confirma dermatofitosis cutánea superficial (tiña del cuerpo).',
        isAbnormal: true,
      },
    ],
    solution: {
      correctDiagnosis: 'Tiña Corporal (Tinea Corporis / Dermatofitosis Cutánea)',
      differentialDiagnoses: [
        'Eccema numular (borde mal definido sin aclaramiento central ni hifas en KOH)',
        'Pitiriasis rosada (placa heráldica seguida de distribución en árbol de Navidad)',
        'Psoriasis en placas',
      ],
      pathophysiology:
        'Infección micótica superficial del estrato córneo de la piel por dermatofitos (probable transmisión zoofílica por Microsporum canis desde el gato), con expansión centrífuga que produce borde inflamatorio activo y aclaramiento central.',
      keyClinicalClues: [
        'Placa circular pruriginosa con borde activo rojo escamoso y centro más claro',
        'Contacto reciente con gato con lesiones cutáneas y empeoramiento tras aplicar corticoide tópico',
        'KOH directo positivo con hifas septadas',
      ],
      characteristicSignsSymptoms: [
        'Lesiones anulares eritematoescamosas centrífugas',
        'Prurito aumentado con el calor/sudor',
      ],
      criticalRulingOutFactors: [
        'KOH positivo confirma etiología fúngica frente a eccema inflamatorio.',
      ],
      recommendedWorkup: [
        'Diagnóstico clínico y raspado de borde activo para examen directo con KOH al 10%',
      ],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Terbinafina crema 1% (o Clotrimazol crema 1%)',
            dose: 'Aplicación tópica en capa fina cubriendo 2 cm más allá del borde',
            route: 'Vía Tópica',
            frequency: 'Cada 12 a 24 horas',
            duration: '2 a 4 semanas (continuar 1 semana tras desaparecer la lesión)',
            rationale: 'Antimicótico tópico fungicida de primera línea en tiña corporal localizada.',
          },
        ],
        generalMeasures: [
          'Suspender de inmediato la crema de betametasona (corticoide).',
          'Llevar al gato al veterinario para revisión/tratamiento y lavar toallas/ropa sin compartirlas.',
        ],
        hospitalizationDecision: 'Ambulatorio',
        referralCriteria: [
          'Revalorar si las lesiones son muy extensas o afectan piel cabelluda/uñas (requeriría antimicótico oral).',
        ],
        followUp: 'Control en consulta externa en 3 semanas si persisten lesiones.',
      },
      criticalSafetyAlerts: [
        'Nunca tratar placas sospechosas de tiña con corticoides tópicos ni cremas combinadas con esteroide porque enmascaran y diseminan la infección.',
      ],
      guidelineReferences: [
        'AAD / BAD Guidelines for Superficial Dermatophyte Infections',
      ],
    },
    internalPersonaPrompt:
      'Habla en primera persona como Gabriel, repartidor de 22 años con una mancha redonda en el brazo que da mucha comezón, tiene la orilla roja escamosa, adoptaste un gatito hace un mes y te pusiste betametasona y empeoró.',
  },
  {
    id: 'case-out-trauma-lumbalgia',
    mode: 'principiante',
    specialty: 'traumatologia',
    patientInfo: {
      name: 'Carlos Alberto Vargas',
      age: 41,
      sex: 'Masculino',
      occupation: 'Conductor de entregas urbanas',
      consultReason: 'Dolor fuerte en la espalda baja desde ayer después de cargar una caja pesada',
      evolutionTime: '24 horas de evolución',
      currentIllness:
        'Paciente masculino de 41 años que acude a consulta externa porque ayer por la tarde, al agacharse con la espalda doblada para levantar una caja de 25 kg sin flexionar las rodillas, sintió un tirón agudo en la espalda baja. Desde entonces tiene dolor en la región lumbar que empeora al agacharse o permanecer sentado mucho tiempo y mejora un poco al acostarse boca arriba con las piernas dobladas. Niega dolor que baje hacia las nalgas o piernas, hormigueos, pérdida de fuerza en los pies, pérdida de control para orinar/evacuar, fiebre o pérdida de peso.',
      triageLevel: 'Nivel V (No Urgente)',
    },
    vitalSigns: {
      bloodPressure: '122/78 mmHg',
      heartRate: 76,
      respiratoryRate: 16,
      temperature: 36.5,
      oxygenSaturation: 99,
      glasgow: 15,
      bloodGlucose: 94,
      weightKg: 84,
      heightCm: 175,
    },
    background: {
      pathological: ['Sobrepeso leve. Sin antecedentes de cáncer, infecciones ni fracturas.'],
      nonPathological: ['Trabaja sentado varias horas manejando y cargando paquetes sin faja ni higiene postural.'],
      family: ['Sin antecedentes relevantes.'],
      surgical: ['Niega cirugías.'],
      currentMedications: ['Ninguno.'],
      allergies: ['Sin alergias conocidas.'],
    },
    physicalExamPool: [
      {
        id: 'pe-osteo-lumbalgia',
        system: 'Osteomuscular y Piel',
        name: 'Exploración lumbar y maniobra de Lasègue',
        finding: 'Contractura muscular paravertebral lumbar bilateral con dolor a la palpación muscular en L4-L5 sin dolor en apófisis espinosas ni en articulaciones sacroilíacas. Maniobra de elevación de pierna recta (Lasègue) bilateral completamente negativa a 80°. Fuerza 5/5 (L4-S1), sensibilidad simétrica y reflejos rotulianos/aquíleos normales.',
        isAbnormal: true,
        semiologyNote: 'Lasègue negativo, exploración neurológica normal y ausencia de banderas rojas confirman lumbalgia mecánica aguda no complicada.',
      },
    ],
    studiesPool: [
      {
        id: 'img-rx-lumbalgia',
        category: 'Imagen',
        subcategory: 'Radiología',
        name: 'Criterios clínicos de imagen lumbar (Radiografía / RMN no indicada inicialmente)',
        result: 'Ausencia total de banderas rojas (sin déficit neurológico, sin trauma mayor de alta energía, sin fiebre, sin sospecha oncológica, edad <50 años): guías recomiendan NO realizar radiografías ni RMN en las primeras 4-6 semanas.',
        referenceRange: 'Sin banderas rojas',
        interpretation: 'Lumbalgia mecánica aguda benigna de manejo conservador ambulatorio.',
        isAbnormal: false,
      },
    ],
    solution: {
      correctDiagnosis: 'Lumbalgia Mecánica Aguda No Complicada (Sin Radiculopatía)',
      differentialDiagnoses: [
        'Hernia discal con radiculopatía ciática (Lasègue positivo y dolor irradiado por debajo de la rodilla)',
        'Síndrome de cauda equina (anestesia en silla de montar y disfunción esfinteriana)',
        'Cólico nefrítico o pielonefritis',
      ],
      pathophysiology:
        'Distensión y contractura refleja de la musculatura paravertebral y ligamentos lumbares secundaria a sobrecarga biomecánica aguda en flexión.',
      keyClinicalClues: [
        'Dolor lumbar localizado tras esfuerzo físico en flexión que no irradia a miembros inferiores',
        'Contractura paravertebral con Lasègue negativo y exploración neurológica íntegra',
        'Ausencia total de banderas rojas (fiebre, pérdida de peso, déficit motor o esfinteriano)',
      ],
      characteristicSignsSymptoms: [
        'Dolor lumbar mecánico que cede parcialmente en reposo',
        'Contractura paravertebral sin ciatalgia',
      ],
      criticalRulingOutFactors: [
        'Fuerza, reflejos y sensibilidad intactos junto con control normal de esfínteres descartan compresión radicular o síndrome de cauda equina.',
      ],
      recommendedWorkup: [
        'Historia clínica dirigida a banderas rojas y exploración neurológica de extremidades inferiores (sin estudios de imagen iniciales)',
      ],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Naproxeno (o Ibuprofeno)',
            dose: '500 mg (o Ibuprofeno 400 mg)',
            route: 'Vía Oral',
            frequency: 'Cada 12 horas con alimentos (Ibuprofeno c/8h)',
            duration: '5 a 7 días',
            rationale: 'AINE de primera línea para dolor lumbar mecánico agudo; puede asociarse relajante muscular nocturno corto si espasmo severo.',
          },
        ],
        generalMeasures: [
          'Mantener actividad física ligera tolerada; EVITAR reposo absoluto en cama >1-2 días porque retrasa la recuperación.',
          'Calor local 15-20 minutos 3 veces al día y educación en higiene postural (doblar rodillas al cargar peso).',
        ],
        hospitalizationDecision: 'Ambulatorio',
        referralCriteria: [
          'Acudir a urgencias de inmediato si aparece adormecimiento en región genital/glútea ("silla de montar"), incapacidad para orinar o pérdida de fuerza en alguna pierna.',
        ],
        followUp: 'Revalorar en consulta externa si el dolor no mejora después de 4 semanas.',
      },
      criticalSafetyAlerts: [
        'No prescribir reposo absoluto prolongado en cama ni solicitar resonancia magnética innecesaria en lumbalgia mecánica aguda sin banderas rojas.',
      ],
      guidelineReferences: [
        'ACP Clinical Practice Guideline: Noninvasive Treatments for Acute, Subacute, and Chronic Low Back Pain',
      ],
    },
    internalPersonaPrompt:
      'Habla en primera persona como Carlos, repartidor de 41 años con dolor en la espalda baja desde ayer tras cargar una caja pesada sin doblar las rodillas; no te baja a las piernas ni tienes hormigueos.',
  },
  {
    id: 'case-out-ped-gastroenteritis',
    mode: 'principiante',
    specialty: 'pediatria',
    patientInfo: {
      name: 'Lucía Renata Flores (traída por su madre)',
      age: 3,
      sex: 'Femenino',
      occupation: 'Preescolar (3 años)',
      consultReason: 'Diarrea líquida abundante y dos vómitos desde ayer por la tarde',
      evolutionTime: '20 horas de evolución',
      currentIllness:
        'Paciente pediátrica de 3 años traída a consulta externa por su madre porque ayer en la tarde empezó con evacuaciones líquidas amarillentas sin moco ni sangre (lleva 6 pañales/evacuaciones hasta hoy), acompañadas de 2 vómitos de leche ayer en la noche y febrícula de 37.8°C. Hoy en la mañana ya no ha vomitado, pide agua con sed y está un poco más inquieta pero juega a ratos. Su último pañal mojado con orina fue hace 4 horas. Varios niños de su estancia infantil tuvieron diarrea esta semana.',
      triageLevel: 'Nivel IV (Prioritario)',
    },
    vitalSigns: {
      bloodPressure: '92/60 mmHg',
      heartRate: 110,
      respiratoryRate: 24,
      temperature: 37.6,
      oxygenSaturation: 99,
      glasgow: 15,
      bloodGlucose: 88,
      weightKg: 14,
      heightCm: 95,
    },
    background: {
      pathological: ['Vacunación completa al día (incluyendo rotavirus). Sin hospitalizaciones previas.'],
      nonPathological: ['Asiste a estancia infantil.'],
      family: ['Padres sanos.'],
      surgical: ['Niega cirugías.'],
      currentMedications: ['Su mamá le ofreció agua simple y un poco de manzana cocida hoy temprano.'],
      allergies: ['Sin alergias conocidas.'],
    },
    physicalExamPool: [
      {
        id: 'pe-general-gea',
        system: 'General',
        name: 'Evaluación pediátrica del estado de hidratación',
        finding: 'Niña alerta, ligeramente inquieta y sedienta (bebe líquido con avidez). Ojos normales levemente hundidos, lágrimas presentes al llorar, mucosa oral ligeramente seca, signo del pliegue cutáneo desaparece rápido (<2 segundos), llenado capilar <2 segundos. Compatible con deshidratación leve-moderada (Plan B/A).',
        isAbnormal: true,
        semiologyNote: 'Paciente alerta que bebe con avidez, con lágrimas presentes y llenado capilar normal tiene deshidratación leve (sin datos de choque).',
      },
      {
        id: 'pe-abdomen-gea',
        system: 'Abdomen',
        name: 'Exploración abdominal',
        finding: 'Abdomen blando, depresible, peristalsis aumentada, sin dolor localizado ni masas.',
        isAbnormal: true,
      },
    ],
    studiesPool: [
      {
        id: 'lab-gea-clinico',
        category: 'Laboratorio',
        subcategory: 'Inflamación e Infección',
        name: 'Evaluación Clínica de Hidratación (Coprocultivo no indicado de rutina)',
        result: 'Diarrea aguda acuosa probable etiología viral sin sangre, moco ni fiebre alta; sin intolerancia actual a vía oral ni signos de choque.',
        referenceRange: 'Diagnóstico clínico',
        interpretation: 'No requiere antibióticos ni exámenes de laboratorio invasivos en gastroenteritis viral aguda leve.',
        isAbnormal: false,
      },
    ],
    solution: {
      correctDiagnosis: 'Gastroenteritis Aguda Probable Viral con Deshidratación Leve',
      differentialDiagnoses: [
        'Disentería bacteriana (evacuaciones con moco/sangre y fiebre alta)',
        'Apendicitis aguda / invaginación intestinal (dolor abdominal intenso progresivo o heces en jalea)',
        'Infección urinaria pediátrica',
      ],
      pathophysiology:
        'Inflamación viral transitoria de vellosidades del intestino delgado con mala absorción temporal de agua y electrolitos, generando diarrea acuosa osmótica y pérdida hidroelectrolítica.',
      keyClinicalClues: [
        'Diarrea líquida sin sangre ni moco en niña de 3 años con contacto en guardería',
        'Estado alerta, bebe con avidez, mucosa algo seca y llenado capilar <2 s (deshidratación leve)',
        'Sin vómitos incoercibles hoy ni dolor abdominal intenso',
      ],
      characteristicSignsSymptoms: [
        'Evacuaciones líquidas frecuentes sin sangre',
        'Sed aumentada sin letargia',
        'Llenado capilar normal y lágrimas presentes',
      ],
      criticalRulingOutFactors: [
        'Ausencia de letargia, ojos muy hundidos, pliegue lento o incapacidad para beber descartan deshidratación grave (Plan C IV).',
        'Ausencia de sangre/moco y fiebre alta descartan disentería bacteriana.',
      ],
      recommendedWorkup: [
        'Valoración clínica sistemática del grado de hidratación según escala OMS',
      ],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Vida Suero Oral / Sales de Rehidratación Oral de baja osmolaridad',
            dose: '50-100 mL/kg en 4 horas en consultorio/casa + 10 mL/kg (aprox. 140 mL) tras cada evacuación líquida',
            route: 'Vía Oral',
            frequency: 'A cucharaditas o sorbos frecuentes',
            duration: 'Mientras persista la diarrea',
            rationale: 'Pilar terapéutico fundamental para corregir y prevenir deshidratación.',
          },
          {
            drug: 'Sulfato de Zinc pediátrico (coadyuvante recomendado por OMS)',
            dose: '20 mg diarios',
            route: 'Vía Oral',
            frequency: 'Cada 24 horas',
            duration: '10 a 14 días',
            rationale: 'Acorta la duración y gravedad del episodio diarreico en niños.',
          },
        ],
        generalMeasures: [
          'Continuar alimentación habitual saludable tan pronto tolere (no suspender leche ni dar dietas restrictivas prolongadas).',
          'Evitar refrescos, jugos comerciales o bebidas deportivas porque empeoran la diarrea osmótica.',
          'Explicar signos de alarma para regresar de inmediato.',
        ],
        hospitalizationDecision: 'Ambulatorio',
        referralCriteria: [
          'Regresar de inmediato a urgencias si vomita todo lo que toma, presenta sangre en evacuaciones, deja de orinar por >6-8 horas o se nota muy dormida/decaída.',
        ],
        followUp: 'Seguimiento en 24-48 horas si continúa con diarrea frecuente o fiebre.',
      },
      criticalSafetyAlerts: [
        'NO prescribir antibióticos, antidiarreicos (loperamida) ni antieméticos de rutina en gastroenteritis viral aguda en niños.',
      ],
      guidelineReferences: [
        'WHO / ESPGHAN Guidelines for the Management of Acute Gastroenteritis in Children',
      ],
    },
    internalPersonaPrompt:
      'Responde en primera persona como la mamá de Lucía (3 años): tiene diarrea aguada desde ayer sin sangre ni moco, vomitó dos veces anoche pero hoy ya pide agua y está despierta.',
  },
  {
    id: 'case-out-gine-sop',
    mode: 'medico_general',
    specialty: 'ginecologia',
    patientInfo: {
      name: 'Mariana Isabel Torres',
      age: 24,
      sex: 'Femenino',
      occupation: 'Estudiante de contaduría',
      consultReason: 'Reglas muy irregulares cada 2 o 3 meses, acné persistente y vello facial',
      evolutionTime: '2 años de evolución',
      currentIllness:
        'Paciente femenina de 24 años que acude a consulta externa porque desde hace 2 años sus menstruaciones se retrasan mucho, bajándole apenas cada 60 a 90 días. Además ha notado aumento de acné en barbilla y espalda, aparición de vello oscuro grueso en labio superior y mentón, y ganancia de 5 kg de peso en el último año a pesar de intentar cuidarse. Niega dolor pélvico agudo, fiebre, secreción láctea por los pezones, dolor de cabeza intenso o embarazo.',
      triageLevel: 'Nivel V (No Urgente)',
    },
    vitalSigns: {
      bloodPressure: '116/74 mmHg',
      heartRate: 76,
      respiratoryRate: 16,
      temperature: 36.5,
      oxygenSaturation: 99,
      glasgow: 15,
      bloodGlucose: 96,
      weightKg: 73,
      heightCm: 161,
    },
    background: {
      pathological: ['Menarca a los 12 años; ciclos inicialmente normales hasta hace 2-3 años.'],
      nonPathological: ['No fuma; vida sexual activa usando preservativo.'],
      family: ['Padre con diabetes tipo 2; hermana con ciclos irregulares.'],
      surgical: ['Niega cirugías.'],
      currentMedications: ['Ninguno.'],
      allergies: ['Sin alergias conocidas.'],
    },
    physicalExamPool: [
      {
        id: 'pe-piel-sop',
        system: 'Osteomuscular y Piel',
        name: 'Evaluación dermatológica y signos de hiperandrogenismo',
        finding: 'IMC 28.1 kg/m². Acné papulopustuloso moderado en región mandibular y espalda superior. Hirsutismo leve-moderado (Ferriman-Gallwey 10 puntos) en mentón, labio superior y línea alba. Acantosis nigricans discreta en cuello.',
        isAbnormal: true,
      },
      {
        id: 'pe-abdomen-sop',
        system: 'Abdomen',
        name: 'Palpación abdominal',
        finding: 'Abdomen blando, indoloro, sin masas anexiales palpables.',
        isAbnormal: false,
      },
    ],
    studiesPool: [
      {
        id: 'lab-hormonal-sop',
        category: 'Laboratorio',
        subcategory: 'Bioquímica',
        name: 'Perfil Hormonal, Subunidad Beta-hCG, TSH, Prolactina y Glucosa/Insulina',
        result: 'Beta-hCG: Negativa | Testosterona total: 68 ng/dL (elevada) | Relación LH/FSH: 2.4 | TSH: 2.0 mUI/L | Prolactina: 14 ng/mL (normal) | Glucosa ayuno: 98 mg/dL | Insulina basal: 19 mcUI/mL.',
        referenceRange: 'Testosterona mujer <48 ng/dL, Prolactina <25 ng/mL, TSH 0.4-4.0',
        interpretation: 'Hiperandrogenismo bioquímico con resistencia a la insulina y exclusión de embarazo, hipotiroidismo e hiperprolactinemia.',
        isAbnormal: true,
      },
      {
        id: 'img-usg-sop',
        category: 'Imagen',
        subcategory: 'Ecografía',
        name: 'Ultrasonido Pélvico Ginecológico',
        result: 'Útero de tamaño normal, endometrio lineal de 5 mm. Ambos ovarios aumentados de volumen (12 mL) con >20 folículos periféricos pequeños (2-8 mm) en disposición subcortical ("collar de perlas").',
        referenceRange: 'Volumen ovárico <10 mL',
        interpretation: 'Morfología ovárica poliquística bilateral (cumple 3/3 criterios de Rotterdam).',
        isAbnormal: true,
      },
    ],
    solution: {
      correctDiagnosis: 'Síndrome de Ovario Poliquístico (SOP — Criterios de Rotterdam)',
      differentialDiagnoses: [
        'Embarazo (descartado por beta-hCG negativa)',
        'Hiperprolactinemia o hipotiroidismo (prolactina y TSH normales)',
        'Hiperplasia suprarrenal congénita no clásica',
      ],
      pathophysiology:
        'Desregulación del eje hipotálamo-hipófisis-ovario con secreción pulsátil acelerada de LH y resistencia a la insulina compensatoria que estimula la producción ovárica de andrógenos e impide la maduración folicular ovulatoria.',
      keyClinicalClues: [
        'Oligomenorrea crónica (ciclos cada 60-90 días) + signos clínicos y bioquímicos de hiperandrogenismo',
        'Ovarios poliquísticos en ultrasonido pélvico',
        'Exclusión de embarazo, disfunción tiroidea e hiperprolactinemia',
      ],
      characteristicSignsSymptoms: [
        'Ciclos menstruales infrecuentes (oligomenorrea)',
        'Acné adulto e hirsutismo',
        'Acantosis nigricans / resistencia insulínica',
      ],
      criticalRulingOutFactors: [
        'Siempre descartar embarazo, hipotiroidismo e hiperprolactinemia ante amenorrea u oligomenorrea.',
      ],
      recommendedWorkup: [
        'Criterios diagnósticos de Rotterdam (2 de 3: disfunción ovulatoria, hiperandrogenismo clínico/bioquímico, morfología ovárica en USG)',
        'Beta-hCG, TSH, prolactina, testosterona y tamizaje metabólico (glucosa, lípidos)',
      ],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Anticonceptivo oral combinado (ej. Etinilestradiol / Drospirenona)',
            dose: '1 tableta diaria',
            route: 'Vía Oral',
            frequency: 'Cada 24 horas (21 días activos + 7 descanso o 24+4)',
            duration: 'Tratamiento continuo revaluable cada 6 meses',
            rationale: 'Regula los ciclos menstruales protegiendo el endometrio y disminuye la producción ovárica de andrógenos mejorando acné e hirsutismo.',
          },
        ],
        generalMeasures: [
          'Modificación del estilo de vida como primera línea: dieta equilibrada de bajo índice glucémico y ejercicio regular (bajar 5-10% del peso mejora ovulación y resistencia insulínica).',
        ],
        hospitalizationDecision: 'Ambulatorio',
        referralCriteria: [
          'Seguimiento conjunto con Ginecología y Endocrinología/Nutrición según deseos futuros de fertilidad.',
        ],
        followUp: 'Control en consulta externa en 3 meses para evaluar regularización menstrual y tolerancia terapéutica.',
      },
      criticalSafetyAlerts: [
        'Nunca iniciar anticonceptivos orales sin descartar primero embarazo y revisar contraindicaciones trombóticas (migraña con aura, tabaquismo >35 años).',
      ],
      guidelineReferences: [
        'International Evidence-Based Guideline for the Assessment and Management of PCOS (2023)',
      ],
    },
    internalPersonaPrompt:
      'Habla en primera persona como Mariana, joven de 24 años que viene a consulta porque le baja la regla cada 2 o 3 meses, le ha salido mucho acné en la quijada y vello en la cara.',
  },
  {
    id: 'case-out-neuro-tunel-carpo',
    mode: 'principiante',
    specialty: 'neurologia',
    patientInfo: {
      name: 'Beatriz Eugenia Campos',
      age: 45,
      sex: 'Femenino',
      occupation: 'Capturista de datos y costurera',
      consultReason: 'Hormigueo y adormecimiento en los dedos de la mano derecha que me despierta en la madrugada',
      evolutionTime: '4 meses de evolución',
      currentIllness:
        'Paciente femenina de 45 años que acude a consulta externa porque desde hace 4 meses siente hormigueo, piquetes y adormecimiento en el pulgar, índice y dedo medio de la mano derecha (a veces un poco en la izquierda), que empeoran notablemente en la madrugada y la obligan a sacudir la mano para sentir alivio. También nota que se le han caído tazas por torpeza fina al sujetar cosas y le molesta al teclear mucho tiempo. Niega dolor de cuello que baje por el brazo, pérdida de fuerza en las piernas o fiebre.',
      triageLevel: 'Nivel V (No Urgente)',
    },
    vitalSigns: {
      bloodPressure: '118/76 mmHg',
      heartRate: 74,
      respiratoryRate: 16,
      temperature: 36.5,
      oxygenSaturation: 99,
      glasgow: 15,
      bloodGlucose: 94,
      weightKg: 69,
      heightCm: 160,
    },
    background: {
      pathological: ['Hipotiroidismo leve diagnosticado hace 3 años en control con levotiroxina.'],
      nonPathological: ['Trabaja 8 horas diarias en teclado y máquina de coser realizando movimientos repetitivos de muñeca.'],
      family: ['Sin antecedentes neurológicos hereditarios.'],
      surgical: ['Niega cirugías previas.'],
      currentMedications: ['Levotiroxina 50 mcg cada mañana.'],
      allergies: ['Sin alergias conocidas.'],
    },
    physicalExamPool: [
      {
        id: 'pe-neuro-carpo',
        system: 'Neurológico',
        name: 'Pruebas provocativas de Phalen, Tinel y exploración sensitivo-motora de mano',
        finding: 'Signo de Phalen positivo a los 25 segundos (reproduce parestesias en 1°, 2° y 3° dedos y cara radial del 4° dedo derechos) y signo de Tinel positivo a la percusión del ligamento transverso del carpo derecho. Hipoestesia táctil leve en pulpejos de dedos 1-3 respetando el 5° dedo y la eminencia tenar proximal. Fuerza discreta de abducción del pulgar 4+/5 sin atrofia tenar severa. Reflejos bicipital, tricipital y estilorradial normales; maniobra de Spurling cervical negativa.',
        isAbnormal: true,
        semiologyNote: 'Las parestesias nocturnas que alivian al sacudir la mano (signo de Flick) con respeto del 5° dedo y Phalen/Tinel positivos son clásicos de compresión del nervio mediano.',
      },
    ],
    studiesPool: [
      {
        id: 'gab-emg-carpo-case',
        category: 'Gabinete y Trazados',
        subcategory: 'Electromiografía y Neurofisiología',
        name: 'Electromiografía y Neuroconducción de Nervio Mediano y Cubital (Miembro Superior)',
        result: 'Nervio mediano derecho: latencia sensitiva distal severamente prolongada (4.7 ms, normal <3.6 ms) con amplitud SNAP reducida (9 µV) y enlentecimiento focal de conducción sensitiva transcarpiana (34 m/s). Latencia motora distal prolongada (5.3 ms, normal <4.2 ms). Nervio mediano izquierdo con prolongación sensitiva leve (3.9 ms). Nervios cubitales bilaterales normales. EMG de aguja en músculo abductor corto del pulgar derecho sin fibrilaciones agudas, discreta reducción del reclutamiento.',
        referenceRange: 'Latencia sensitiva <3.6 ms, latencia motora <4.2 ms, VCN >50 m/s',
        interpretation: 'Neuropatía focal del nervio mediano a nivel del túnel del carpo de grado moderado derecho y leve izquierdo, sin radiculopatía cervical ni polineuropatía cubital.',
        isAbnormal: true,
      },
      {
        id: 'lab-vit-carpo',
        category: 'Laboratorio',
        subcategory: 'Vitaminas y Nutrición',
        name: 'Vitamina B12, Vitamina B6, Glucosa y TSH (Descarte metabólico)',
        result: 'Vitamina B12: 430 pg/mL | Vitamina B6: 14 mcg/L | Glucosa ayuno: 94 mg/dL | TSH: 2.3 mUI/L.',
        referenceRange: 'B12 210-911 pg/mL, TSH 0.4-4.2 mUI/L',
        interpretation: 'Eutiroidea y sin polineuropatía carencial o diabética generalizada.',
        isAbnormal: false,
      },
    ],
    solution: {
      correctDiagnosis: 'Síndrome del Túnel del Carpo Bilateral (Predominio Moderado Derecho)',
      differentialDiagnoses: [
        'Radiculopatía cervical C6-C7 (dolor cervical irradiado, Spurling positivo y reflejo estilorradial alterado)',
        'Neuropatía cubital en canal epitroclear (afecta 4° y 5° dedos)',
        'Polineuropatía diabética o por déficit de B12',
      ],
      pathophysiology:
        'Atrapamiento y compresión mecánica crónica del nervio mediano bajo el retináculo flexor en el túnel del carpo por tenosinovitis flexora secundaria a movimientos repetitivos de muñeca, produciendo desmielinización focal sensitivo-motora.',
      keyClinicalClues: [
        'Parestesias nocturnas en dedos 1°, 2° y 3° que mejoran al sacudir la mano (signo de Flick), respetando el meñique',
        'Pruebas de Phalen y Tinel positivas con Spurling cervical negativo',
        'Electromiografía y VCN confirmatorias con latencia distal sensitiva y motora prolongada en nervio mediano transcarpiano',
      ],
      characteristicSignsSymptoms: [
        'Acroparestesias nocturnas en territorio del nervio mediano',
        'Signos de Phalen y Tinel positivos',
        'Confirmación electrofisiológica por VCN / EMG',
      ],
      criticalRulingOutFactors: [
        'Respeto del 5° dedo y conducción cubital normal descartan neuropatía cubital.',
        'Spurling negativo y ausencia de atrofia tenar severa permiten manejo conservador inicial con férula.',
      ],
      recommendedWorkup: [
        'Electromiografía y Velocidades de Conducción Nerviosa (EMG/VCN) de miembro superior (estándar confirmatorio y de estadificación)',
        'Tamizaje de factores predisponentes: glucosa, TSH y vitaminas neurotrópicas',
      ],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Naproxeno o Ibuprofeno (ciclo corto si dolor inflamatorio)',
            dose: 'Naproxeno 500 mg',
            route: 'Vía Oral',
            frequency: 'Cada 12 horas',
            duration: '5 a 7 días si dolor agudo (evitar AINE crónico)',
            rationale: 'Control sintomático corto; la base es descompresión mecánica nocturna.',
          },
        ],
        generalMeasures: [
          'Uso de férula de muñeca en posición neutra (0°) todas las noches durante 6 a 8 semanas.',
          'Ergonomía laboral: pausas activas cada 45 min, soporte de muñeca neutro en teclado.',
          'Considerar infiltración local con corticoide o referencia a cirugía para liberación del túnel del carpo si no mejora en 8-12 semanas o aparece atrofia tenar.',
        ],
        hospitalizationDecision: 'Ambulatorio',
        referralCriteria: [
          'Referir a Ortopedia/Cirugía de Mano si hay falla al tratamiento conservador o pérdida motora/atrofia tenar progresiva.',
        ],
        followUp: 'Control en consulta externa a las 6-8 semanas para valorar respuesta a la férula nocturna.',
      },
      criticalSafetyAlerts: [
        'No retrasar la descompresión quirúrgica si aparece debilidad marcada o atrofia de la eminencia tenar.',
      ],
      guidelineReferences: [
        'AAOS Clinical Practice Guideline: Management of Carpal Tunnel Syndrome',
      ],
    },
    internalPersonaPrompt:
      'Habla en primera persona como Beatriz, capturista y costurera de 45 años a la que se le duermen y hormiguean los primeros tres dedos de la mano derecha en la madrugada teniendo que sacudir la mano para que se quite.',
  },
  {
    id: 'case-out-mi-deficit-b12',
    mode: 'principiante',
    specialty: 'medicina_interna',
    patientInfo: {
      name: 'Arturo Benjamín Estrada',
      age: 61,
      sex: 'Masculino',
      occupation: 'Profesor de historia',
      consultReason: 'Cansancio progresivo, lengua ardorosa y hormigueo simétrico en ambos pies desde hace 3 meses',
      evolutionTime: '3 meses de evolución progresiva',
      currentIllness:
        'Paciente masculino de 61 años que acude a consulta externa por fatiga intensa progresiva, palidez, ardor en la lengua al comer cosas ácidas y sensación persistente de hormigueo y "caminar sobre algodón" en ambos pies desde hace 3 meses. Toma omeprazol diario desde hace 6 años por gastritis sin supervisión médica y sigue una dieta vegetariana estricta desde hace 4 años. Niega pérdida de sangre en heces u orina, fiebre o dolor torácico.',
      triageLevel: 'Nivel V (No Urgente)',
    },
    vitalSigns: {
      bloodPressure: '118/74 mmHg',
      heartRate: 88,
      respiratoryRate: 16,
      temperature: 36.5,
      oxygenSaturation: 98,
      glasgow: 15,
      bloodGlucose: 92,
      weightKg: 70,
      heightCm: 173,
    },
    background: {
      pathological: ['Gastritis crónica tratada con IBP continuo por 6 años; vitíligo leve en dorso de manos.'],
      nonPathological: ['Dieta vegana/vegetariana estricta desde hace 4 años sin suplementación vitamínica. No fuma.'],
      family: ['Hermana con enfermedad tiroidea autoinmune.'],
      surgical: ['Niega cirugías gástricas.'],
      currentMedications: ['Omeprazol 20 mg diarios desde hace 6 años.'],
      allergies: ['Sin alergias conocidas.'],
    },
    physicalExamPool: [
      {
        id: 'pe-general-b12',
        system: 'General',
        name: 'Inspección de mucosas y lengua',
        finding: 'Palidez mucocutánea moderada con tinte subictérico leve conjuntival. Lengua lisa, brillante y eritematosa por atrofia papilar (glositis atrófica de Hunter).',
        isAbnormal: true,
      },
      {
        id: 'pe-neuro-b12',
        system: 'Neurológico',
        name: 'Exploración sensitiva vibratoria y de marcha',
        finding: 'Disminución franca de la sensibilidad vibratoria (palestesia con diapasón de 128 Hz) y propioceptiva en dedos de ambos pies y maléolos; hipoestesia en "calcetín" simétrica. Signo de Romberg discretamente positivo al cerrar los ojos. Fuerza muscular conservada 5/5.',
        isAbnormal: true,
        semiologyNote: 'La pérdida de sensibilidad vibratoria/propioceptiva (cordones posteriores) + parestesias en calcetín es característica de deficiencia de Vitamina B12.',
      },
    ],
    studiesPool: [
      {
        id: 'lab-bh-b12',
        category: 'Laboratorio',
        subcategory: 'Hematología',
        name: 'Biometría Hemática Completa y Frotis de Sangre Periférica',
        result: 'Hemoglobina: 9.4 g/dL | VCM: 114 fL (MACROCITOSIS severa) | Leucocitos: 3,900 /mm³ | Plaquetas: 132,000 /mm³ | Frotis: macroovalocitos y neutrófilos polisegmentados (>5 lóbulos). LDH: 540 U/L | Bilirrubina indirecta: 1.6 mg/dL.',
        referenceRange: 'Hb 13.5-17.5 g/dL, VCM 80-100 fL',
        interpretation: 'Anemia macrocítica megaloblástica con pancitopenia leve y hemólisis intramedular (eritropoyesis ineficaz).',
        isAbnormal: true,
      },
      {
        id: 'lab-vit-b12-case',
        category: 'Laboratorio',
        subcategory: 'Vitaminas y Nutrición',
        name: 'Niveles séricos de Vitamina B12 (Cobalamina), Ácido Fólico (B9) y Homocisteína',
        result: 'Vitamina B12 sérica: 88 pg/mL (DEFICIENCIA SEVERA) | Ácido fólico sérico: 12.6 ng/mL (normal) | Homocisteína total: 34.2 µmol/L (marcadamente elevada).',
        referenceRange: 'Vitamina B12: 210-911 pg/mL | Ácido fólico: 3.8-20 ng/mL | Homocisteína: 5-15 µmol/L',
        interpretation: 'Deficiencia severa aislada de Vitamina B12 con folato normal y homocisteína elevada.',
        isAbnormal: true,
      },
      {
        id: 'gab-emg-b12-case',
        category: 'Gabinete y Trazados',
        subcategory: 'Electromiografía y Neurofisiología',
        name: 'Electromiografía (EMG) y Velocidades de Conducción Nerviosa (VCN) de 4 extremidades',
        result: 'Reducción moderada de amplitudes sensitivas (SNAP) en nervios surales bilaterales (4 µV, normal >10 µV) con latencias levemente prolongadas en nervios peroneos y tibiales; extremidades superiores conservadas. EMG sin denervación aguda severa.',
        referenceRange: 'SNAP sural >10 µV, VCN >42 m/s en miembros inferiores',
        interpretation: 'Polineuropatía axonal sensitivo-motora distal simétrica de miembros inferiores compatible con neuropatía carencial por déficit de B12.',
        isAbnormal: true,
      },
    ],
    solution: {
      correctDiagnosis: 'Anemia Megaloblástica y Neuropatía Periférica por Deficiencia de Vitamina B12',
      differentialDiagnoses: [
        'Deficiencia de ácido fólico (causa macrocitosis pero NO produce neuropatía ni alteración cordonal)',
        'Polineuropatía diabética o alcohólica',
        'Síndrome mielodisplásico',
      ],
      pathophysiology:
        'El uso prolongado de omeprazol y dieta vegana no suplementada (junto con posible componente autoinmune/gastritis atrófica) agotan los depósitos hepáticos de cobalamina, alterando la síntesis de ADN (megaloblastosis) y la metilación de mielina (neuropatía periférica y degeneración combinada subaguda).',
      keyClinicalClues: [
        'Glositis, anemia macrocítica (VCM 114 fL) con neutrófilos polisegmentados y parestesias simétricas en pies con pérdida vibratoria',
        'Uso crónico de omeprazol por 6 años + dieta vegana sin suplementos',
        'Vitamina B12 severamente baja (88 pg/mL) con folato normal y polineuropatía sensitiva en EMG/VCN',
      ],
      characteristicSignsSymptoms: [
        'Fatiga, palidez subictérica y glositis ardorosa',
        'Parestesias en pies y alteración de sensibilidad vibratoria',
        'Macrocitosis marcada (VCM >110 fL)',
      ],
      criticalRulingOutFactors: [
        'Medir SIEMPRE vitamina B12 y ácido fólico juntos: dar ácido fólico solo ante déficit de B12 corrige la anemia pero agrava irreversiblemente el daño neurológico.',
      ],
      recommendedWorkup: [
        'Biometría hemática con frotis, DHL y reticulocitos',
        'Vitamina B12 sérica, ácido fólico, homocisteína y anticuerpos anti-factor intrínseco',
        'Electromiografía / VCN de extremidades inferiores si existen parestesias o déficit sensitivo',
      ],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Cianocobalamina o Hidroxocobalamina (Vitamina B12 parenteral)',
            dose: '1,000 mcg',
            route: 'Vía Intramuscular',
            frequency: 'Diario o 3 veces/semana por 2 semanas, luego semanal por 4 semanas y mensual de mantenimiento',
            duration: 'Reposición inicial intensiva + mantenimiento crónico mientras persista malabsorción',
            rationale: 'La vía intramuscular asegura absorción rápida e inmediata especialmente cuando existe déficit neurológico y uso crónico de IBP o posible anemia perniciosa.',
          },
        ],
        generalMeasures: [
          'Reevaluar necesidad real de omeprazol crónico y educar sobre suplementación permanente de B12 en dietas veganas.',
          'Vigilar potasio sérico en los primeros días si anemia muy severa (captación celular al regenerar eritrocitos).',
        ],
        hospitalizationDecision: 'Ambulatorio',
        referralCriteria: [
          'Estudio endoscópico/serológico (anticuerpos anti-células parietales/factor intrínseco) para descartar anemia perniciosa.',
        ],
        followUp: 'Control de reticulocitos a los 7-10 días, biometría hemática a las 4 semanas y seguimiento neurológico progresivo.',
      },
      criticalSafetyAlerts: [
        'NUNCA administrar ácido fólico en monoterapia sin haber descartado o tratado simultáneamente la deficiencia de vitamina B12.',
      ],
      guidelineReferences: [
        'BSH Guidelines for the Diagnosis and Treatment of Cobalamin and Folate Disorders',
      ],
    },
    internalPersonaPrompt:
      'Habla en primera persona como Arturo, profesor de 61 años con mucho cansancio, lengua ardorosa, hormigueo en ambos pies como caminar sobre algodón, dieta vegana desde hace 4 años y uso diario de omeprazol por 6 años.',
  },
  {
    id: 'case-out-neuro-radiculopatia',
    mode: 'medico_general',
    specialty: 'neurologia',
    patientInfo: {
      name: 'Fernando Miguel Lozano',
      age: 43,
      sex: 'Masculino',
      occupation: 'Técnico electricista',
      consultReason: 'Dolor intenso de espalda baja que baja por toda la pierna derecha hasta el talón con hormigueo',
      evolutionTime: '3 semanas de evolución',
      currentIllness:
        'Paciente masculino de 43 años que acude a consulta externa porque hace 3 semanas, tras cargar un rollo de cable pesado, empezó con dolor lumbar agudo que rápidamente se corrió hacia el glúteo derecho, la parte posterior del muslo y la pantorrilla hasta el borde externo del pie y talón derecho. Refiere descargas eléctricas y hormigueo constante en el pie, y empeora mucho al toser, sentarse o inclinarse hacia adelante. Niega pérdida de fuerza súbita en ambos pies, adormecimiento en la entrepierna o dificultad para orinar/evacuar.',
      triageLevel: 'Nivel IV (Prioritario)',
    },
    vitalSigns: {
      bloodPressure: '126/80 mmHg',
      heartRate: 80,
      respiratoryRate: 16,
      temperature: 36.6,
      oxygenSaturation: 99,
      glasgow: 15,
      bloodGlucose: 97,
      weightKg: 82,
      heightCm: 176,
    },
    background: {
      pathological: ['Dos episodios breves de lumbalgia leve en los últimos 3 años.'],
      nonPathological: ['Trabaja subiendo escaleras y cargando herramienta. No fuma.'],
      family: ['Sin antecedentes relevantes.'],
      surgical: ['Niega cirugías.'],
      currentMedications: ['Tomó diclofenaco oral por 4 días con alivio parcial leve.'],
      allergies: ['Sin alergias conocidas.'],
    },
    physicalExamPool: [
      {
        id: 'pe-neuro-ciatica',
        system: 'Neurológico',
        name: 'Exploración radicular de miembros inferiores (Lasègue, reflejos, fuerza)',
        finding: 'Signo de Lasègue (elevación de pierna recta) francamente POSITIVO a 35° en miembro pélvico derecho (reproduce dolor lancinante irradiado debajo de la rodilla hasta el pie) y Bragard positivo. Reflejo aquíleo derecho abolido/disminuido (1+/4 vs 2+/4 izquierdo). Hipoestesia en borde lateral del pie derecho (dermatoma S1) y discreta debilidad para caminar de puntas (4+/5 en flexión plantar). Sensibilidad perianal conservada y tono esfinteriano normal.',
        isAbnormal: true,
        semiologyNote: 'Lasègue positivo <45°, hiporreflexia aquílea y déficit sensitivo en borde lateral del pie localizan exactamente la raíz S1 derecha.',
      },
    ],
    studiesPool: [
      {
        id: 'gab-emg-radic',
        category: 'Gabinete y Trazados',
        subcategory: 'Electromiografía y Neurofisiología',
        name: 'Electromiografía (EMG) y Velocidades de Conducción Nerviosa (VCN) de 4 extremidades',
        result: 'Miembro inferior derecho: prolongación asimétrica significativa de la latencia del reflejo H en músculo sóleo derecho (34.8 ms vs 29.1 ms izquierdo). EMG de aguja concéntrica: abundantes potenciales de fibrilación, ondas positivas agudas (2+) y reclutamiento neurogénico disminuido en músculos gastrocnemio medial, sóleo, bíceps femoral y musculatura paraespinal lumbosacra S1 derecha. VCN sensitiva del nervio sural conservada (normal, descartando lesión plexular/periférica distal). Miembro izquierdo normal.',
        referenceRange: 'Reflejo H simétrico (<1.5 ms diferencia), sin actividad denervativa',
        interpretation: 'Radiculopatía lumbosacra derecha S1 aguda-subaguda con signos de denervación activa preganglionar (SNAP sural preservado).',
        isAbnormal: true,
      },
      {
        id: 'img-rmn-lumbar',
        category: 'Imagen',
        subcategory: 'Tomografía',
        name: 'Resonancia Magnética (RMN) de Columna Lumbosacra',
        result: 'Hernia discal posterolateral derecha en nivel L5-S1 (extrusión discal de 7 mm) que comprime y desplaza la raíz nerviosa S1 derecha en el receso lateral. Sin estenosis central masiva ni signos de compresión de cola de caballo.',
        referenceRange: 'Discos intervertebrales sin protrusión ni compresión radicular',
        interpretation: 'Hernia discal L5-S1 derecha con compresión directa de raíz S1 concordante con la clínica y la electromiografía.',
        isAbnormal: true,
      },
    ],
    solution: {
      correctDiagnosis: 'Radiculopatía Lumbosacra S1 Derecha por Hernia Discal L5-S1',
      differentialDiagnoses: [
        'Lumbalgia mecánica simple (sin irradiación debajo de rodilla ni Lasègue positivo)',
        'Síndrome de cauda equina (urgencia quirúrgica con anestesia en silla de montar y retención urinaria)',
        'Síndrome piriforme o polineuropatía periférica',
      ],
      pathophysiology:
        'Extrusión posterolateral del núcleo pulposo en L5-S1 que genera compresión mecánica e inflamación química sobre la raíz nerviosa S1 derecha, provocando dolor neuropático radicular, abolición del reflejo aquíleo y denervación en el miotoma S1.',
      keyClinicalClues: [
        'Dolor lumbar irradiado debajo de la rodilla hasta borde externo del pie/talón derecho con parestesias',
        'Lasègue positivo a 35°, reflejo aquíleo derecho disminuido y debilidad leve para pararse de puntas (S1)',
        'EMG con denervación en miotoma S1 + paraespinales y reflejo H prolongado con SNAP sural normal',
      ],
      characteristicSignsSymptoms: [
        'Ciatalgia en dermatoma S1 que empeora al toser o sentarse',
        'Signo de Lasègue positivo <45° e hiporreflexia aquílea',
        'Denervación radicular en EMG con preservación sensitiva periférica',
      ],
      criticalRulingOutFactors: [
        'Sensibilidad perineal íntegra y control normal de esfínteres descartan síndrome de cauda equina (manejo conservador inicial durante 6 semanas).',
      ],
      recommendedWorkup: [
        'Exploración neurológica radicular completa (Lasègue, fuerza por miotomas, reflejos y banderas rojas)',
        'Resonancia magnética lumbosacra y Electromiografía/VCN ante radiculopatía persistente (>3-4 semanas) o déficit motor',
      ],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Naproxeno (o Meloxicam) + Pregabalina o Gabapentina (dolor neuropático radicular)',
            dose: 'Naproxeno 500 mg c/12h (7 días) + Pregabalina 75 mg nocturno (titular según tolerancia)',
            route: 'Vía Oral',
            frequency: 'Según esquema',
            duration: '2 a 4 semanas con revaloración',
            rationale: 'Combina control antiinflamatorio nociceptivo con neuromodulación del dolor radicular neuropático.',
          },
        ],
        generalMeasures: [
          'Fisioterapia guiada progresiva tras ceder la fase hiperaguda y evitar cargas pesadas/flexión lumbar forzada.',
          'Explicar banderas rojas de cauda equina para acudir de inmediato a urgencias.',
        ],
        hospitalizationDecision: 'Ambulatorio',
        referralCriteria: [
          'Referencia a Neurocirugía/Ortopedia de Columna si persiste dolor incapacitante >6-8 semanas pese a tratamiento conservador, o de urgencia si aparece pie caído progresivo o disfunción vesical/anestesia en silla de montar.',
        ],
        followUp: 'Cita en consulta externa en 2 a 3 semanas para vigilar evolución motora y respuesta analgésica.',
      },
      criticalSafetyAlerts: [
        'Vigilar activamente datos de síndrome de cauda equina (retención urinaria, incontinencia, anestesia perineal).',
      ],
      guidelineReferences: [
        'NASS Clinical Guidelines for Diagnosis and Treatment of Lumbar Disc Herniation with Radiculopathy',
      ],
    },
    internalPersonaPrompt:
      'Habla en primera persona como Fernando, electricista de 43 años con dolor de espalda baja que baja por detrás de la pierna derecha hasta el talón con toques eléctricos y hormigueo desde hace 3 semanas.',
  },
  {
    id: 'case-out-endo-deficit-vitamina-d',
    mode: 'principiante',
    specialty: 'endocrinologia',
    patientInfo: {
      name: 'Consuelo Guadalupe Ibarra',
      age: 57,
      sex: 'Femenino',
      occupation: 'Trabajadora administrativa nocturna / hogar',
      consultReason: 'Dolor generalizado en caderas y costillas y mucha debilidad en los muslos para pararme de la silla',
      evolutionTime: '5 meses de evolución progresiva',
      currentIllness:
        'Paciente femenina de 57 años que acude a consulta externa porque desde hace 5 meses siente dolor sordo profundo en las caderas, espalda baja y costillas que empeora al caminar o presionar los huesos, además de debilidad marcada en los muslos que le dificulta levantarse de una silla baja o subir escaleras sin apoyarse con las manos. Trabaja de noche desde hace años y casi nunca sale al sol; tampoco toma leche ni suplementos. Niega fiebre, pérdida de peso involuntaria, rigidez matutina de dedos de las manos o calambres en la cara.',
      triageLevel: 'Nivel V (No Urgente)',
    },
    vitalSigns: {
      bloodPressure: '122/76 mmHg',
      heartRate: 76,
      respiratoryRate: 16,
      temperature: 36.5,
      oxygenSaturation: 98,
      glasgow: 15,
      bloodGlucose: 93,
      weightKg: 65,
      heightCm: 158,
    },
    background: {
      pathological: ['Menopausia a los 50 años. Sin enfermedades autoinmunes ni renales conocidas.'],
      nonPathological: ['Exposición solar casi nula por turno nocturno y uso habitual de protector solar/ropa cerrada; baja ingesta de lácteos y pescado.'],
      family: ['Madre con osteoporosis.'],
      surgical: ['Niega cirugías tiroideas ni bariátricas.'],
      currentMedications: ['Tomó paracetamol ocasional con poco alivio del dolor óseo.'],
      allergies: ['Sin alergias conocidas.'],
    },
    physicalExamPool: [
      {
        id: 'pe-osteo-vitd',
        system: 'Osteomuscular y Piel',
        name: 'Fuerza muscular proximal y sensibilidad ósea',
        finding: 'Debilidad muscular proximal simétrica en cintura pélvica (4/5 en flexores y extensores de cadera; requiere apoyo de brazos para levantarse de la silla, maniobra de silla positiva) con marcha ligeramente basculante ("de pato"). Dolor óseo difuso a la compresión suave de crestas ilíacas, esternón y arcos costales. Fuerza distal 5/5 y reflejos conservados.',
        isAbnormal: true,
        semiologyNote: 'La combinación de dolor óseo a la palpación + debilidad muscular proximal de cintura pélvica sugiere osteomalacia por déficit severo de vitamina D.',
      },
    ],
    studiesPool: [
      {
        id: 'lab-vit-d-case',
        category: 'Laboratorio',
        subcategory: 'Vitaminas y Nutrición',
        name: 'Vitamina D (25-OH-Vitamina D total) y Hormona Paratiroidea (PTH intacta)',
        result: '25-hidroxivitamina D total: 7.4 ng/mL (DEFICIENCIA SEVERA) | PTH intacta: 138 pg/mL (hiperparatiroidismo secundario marcado) | Fósforo sérico: 2.2 mg/dL (hipofosfatemia).',
        referenceRange: '25-OH-Vitamina D: 30-100 ng/mL (deficiencia <20, severa <10) | PTH: 15-65 pg/mL | Fósforo: 2.5-4.5 mg/dL',
        interpretation: 'Deficiencia severa de vitamina D con hiperparatiroidismo secundario e hipofosfatemia clásicos de osteomalacia.',
        isAbnormal: true,
      },
      {
        id: 'lab-bioq-vitd',
        category: 'Laboratorio',
        subcategory: 'Bioquímica',
        name: 'Calcio sérico, Fosfatasa Alcalina, CPK y Creatinina',
        result: 'Calcio sérico total: 8.3 mg/dL (limítrofe bajo) | Fosfatasa alcalina total: 245 U/L (marcadamente elevada con GGT normal = origen óseo) | CPK total: 112 U/L (normal) | Creatinina: 0.78 mg/dL.',
        referenceRange: 'Ca: 8.5-10.5 mg/dL | FA: 40-130 U/L | CPK: 30-170 U/L',
        interpretation: 'Elevación aislada de fosfatasa alcalina ósea con calcio limítrofe bajo y CPK normal (aleja polimiositis inflamatoria).',
        isAbnormal: true,
      },
      {
        id: 'gab-emg-vitd-case',
        category: 'Gabinete y Trazados',
        subcategory: 'Electromiografía y Neurofisiología',
        name: 'Electromiografía (EMG) de aguja y Velocidades de Conducción Nerviosa (VCN) de 4 extremidades',
        result: 'Neuroconducción motora y sensitiva completamente normal. EMG con aguja en músculo cuádriceps (vasto lateral) e iliopsoas: discretos potenciales de unidad motora (PUM) de corta duración y baja amplitud con reclutamiento temprano y SIN fibrilaciones ni ondas positivas (sin actividad inflamatoria necrotizante).',
        referenceRange: 'Sin actividad espontánea; PUM normales',
        interpretation: 'Miopatía proximal metabólica no inflamatoria secundaria a déficit de vitamina D/fósforo, descartando polineuropatía y polimiositis.',
        isAbnormal: true,
      },
    ],
    solution: {
      correctDiagnosis: 'Osteomalacia y Miopatía Proximal por Deficiencia Severa de Vitamina D',
      differentialDiagnoses: [
        'Polimiositis / dermatomiositis (CPK muy elevada e inflamación activa con fibrilaciones en EMG)',
        'Polimialgia reumática (VSG/PCR muy elevadas sin hipofosfatemia ni 25-OH-D <10)',
        'Hiperparatiroidismo primario (cursa con hipercalcemia, no calcio bajo/limítrofe)',
      ],
      pathophysiology:
        'La carencia crónica de exposición solar y aporte dietético reduce drásticamente el calcidiol (25-OH-D), disminuyendo la absorción intestinal de calcio y fósforo; ello induce hiperparatiroidismo secundario con fosfaturia, defecto de mineralización del osteoide (osteomalacia) y disfunción metabólica de fibras musculares tipo II (miopatía proximal).',
      keyClinicalClues: [
        'Dolor óseo difuso a la compresión + debilidad muscular proximal para pararse de la silla en mujer con nula exposición solar',
        '25-OH-Vitamina D severamente baja (7.4 ng/mL), fósforo bajo, fosfatasa alcalina elevada y PTH alta (hiperparatiroidismo secundario)',
        'CPK normal y EMG con patrón miopático metabólico sin necrosis/denervación inflamatoria',
      ],
      characteristicSignsSymptoms: [
        'Dolor óseo axial y costal a la presión',
        'Debilidad proximal de cintura pélvica (dificultad para subir escaleras/levantarse)',
        'Baja exposición solar',
      ],
      criticalRulingOutFactors: [
        'Calcio limítrofe bajo con vitamina D de 7.4 distingue hiperparatiroidismo secundario de un adenoma paratiroideo primario.',
        'CPK normal y ausencia de actividad espontánea en EMG descartan miopatía inflamatoria.',
      ],
      recommendedWorkup: [
        '25-OH-Vitamina D sérica, PTH intacta, calcio, fósforo, fosfatasa alcalina y función renal',
        'CPK y Electromiografía para diferenciar miopatía metabólica de polimiositis o neuropatía',
        'Densitometría ósea (DEXA) tras iniciar reposición',
      ],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Colecalciferol (Vitamina D3) dosis de carga',
            dose: '50,000 UI semanales (o 6,000 UI diarias)',
            route: 'Vía Oral',
            frequency: '1 vez por semana (o diario con comida principal con algo de grasa)',
            duration: '8 semanas de carga, seguido de mantenimiento 1,000-2,000 UI/día',
            rationale: 'Normaliza depósitos de 25-OH-D (>30 ng/mL), corrige hiperparatiroidismo secundario y revierte la osteomalacia y miopatía proximal.',
          },
          {
            drug: 'Carbonato o Citrato de Calcio',
            dose: '500 a 1,000 mg de calcio elemental al día en dosis divididas',
            route: 'Vía Oral',
            frequency: 'Cada 12 a 24 horas con alimentos',
            duration: 'Durante la mineralización ósea',
            rationale: 'Aporta sustrato mineral mientras la vitamina D normaliza la absorción intestinal y evita hipocalcemia ("hueso hambriento").',
          },
        ],
        generalMeasures: [
          'Exposición solar segura 15 minutos al día en brazos/piernas y dieta rica en calcio/lácteos fortificados.',
          'Prevención de caídas mientras recupera fuerza muscular proximal.',
        ],
        hospitalizationDecision: 'Ambulatorio',
        referralCriteria: [
          'Endocrinología si no normaliza vitamina D/PTH tras 8-12 semanas (investigar enfermedad celíaca o malabsorción).',
        ],
        followUp: 'Control de 25-OH-Vitamina D, calcio, fósforo, PTH y fosfatasa alcalina a los 3 meses.',
      },
      criticalSafetyAlerts: [
        'Asegurar aporte concomitante de calcio durante la reposición intensa de vitamina D para evitar hipocalcemia sintomática.',
      ],
      guidelineReferences: [
        'Endocrine Society Clinical Practice Guideline: Evaluation, Treatment, and Prevention of Vitamin D Deficiency',
      ],
    },
    internalPersonaPrompt:
      'Habla en primera persona como Consuelo, mujer de 57 años que trabaja de noche y casi nunca le da el sol, con dolor en caderas y costillas y debilidad en los muslos que te cuesta pararte de la silla.',
  },
  {
    id: 'case-out-gastro-colitis-ulcerosa',
    mode: 'medico_general',
    specialty: 'gastroenterologia',
    patientInfo: {
      name: 'Valeria Sofía Montoya',
      age: 29,
      sex: 'Femenino',
      occupation: 'Arquitecta',
      consultReason: 'Diarrea con moco y sangre roja, urgencia para ir al baño y cólicos abdominales desde hace 6 semanas',
      evolutionTime: '6 semanas de evolución progresiva',
      currentIllness:
        'Paciente femenina de 29 años que acude a consulta externa porque desde hace 6 semanas presenta 5 a 6 evacuaciones diarias semilíquidas mezcladas con moco y estrías de sangre roja brillante, acompañadas de pujo, tenesmo rectal, urgencia defecatoria que a veces la despierta en la madrugada y dolor tipo cólico en la parte baja izquierda del abdomen antes de evacuar. Ha bajado 3 kg de peso y siente fatiga leve. Tomó antiparasitarios por su cuenta hace 3 semanas sin mejoría. Niega viajes recientes a zonas rurales, uso reciente de antibióticos o fiebre alta.',
      triageLevel: 'Nivel IV (Prioritario)',
    },
    vitalSigns: {
      bloodPressure: '112/70 mmHg',
      heartRate: 86,
      respiratoryRate: 16,
      temperature: 37.1,
      oxygenSaturation: 99,
      glasgow: 15,
      bloodGlucose: 89,
      weightKg: 57,
      heightCm: 165,
    },
    background: {
      pathological: ['Sin enfermedades crónicas previas.'],
      nonPathological: ['Dejó de fumar hace 8 meses; no consume alcohol habitualmente.'],
      family: ['Primo hermano con enfermedad inflamatoria intestinal.'],
      surgical: ['Niega cirugías previas.'],
      currentMedications: ['Tomó metronidazol por 5 días hace 3 semanas sin respuesta.'],
      allergies: ['Sin alergias conocidas.'],
    },
    physicalExamPool: [
      {
        id: 'pe-abd-colitis',
        system: 'Abdomen',
        name: 'Palpación abdominal superficial/profunda y ruidos hidroaéreos',
        finding: 'Abdomen blando, depresible, con dolor leve-moderado a la palpación en fosa ilíaca e hipogastrio izquierdo sin defensa muscular ni signo de Blumberg (sin megacolon ni abdomen agudo). Ruidos hidroaéreos aumentados. Tacto rectal con restos de moco sanguinolento sin fisura anal profunda.',
        isAbnormal: true,
        semiologyNote: 'La ausencia de irritación peritoneal, fiebre >37.8°C o taquicardia >90 lpm indica brote leve-moderado manejable ambulatoriamente tras estudio endoscópico.',
      },
    ],
    studiesPool: [
      {
        id: 'lab-bh-colitis',
        category: 'Laboratorio',
        subcategory: 'Hematología',
        name: 'Biometría Hemática Completa, PCR y Calprotectina Fecal',
        result: 'Hemoglobina: 11.2 g/dL | VCM: 78 fL | Leucocitos: 9,400 /mm³ | Plaquetas: 430,000 /mm³ (trombocitosis reactiva) | PCR: 18 mg/L | Calprotectina fecal: 740 mcg/g (marcadamente elevada). Coprocultivo y toxina de C. difficile negativos.',
        referenceRange: 'Hb 12-15.5 g/dL, Calprotectina fecal <50 mcg/g, PCR <5 mg/L',
        interpretation: 'Inflamación intestinal orgánica severa con anemia leve y descartamiento infeccioso bacteriano/parasitario.',
        isAbnormal: true,
      },
      {
        id: 'gab-colonoscopia-cuci',
        category: 'Gabinete y Trazados',
        subcategory: 'Endoscopia y Broncoscopia',
        name: 'Colonoscopia Total con Ileoscopia Distal y Biopsias',
        result: 'Afectación mucosa CONTINUA y simétrica desde el margen anal hasta el ángulo esplénico (colitis izquierda), con transición neta a mucosa normal en colon transverso, derecho e íleon terminal sano. Mucosa intensamente eritematosa, pérdida completa del patrón vascular, friabilidad espontánea al roce y múltiples erosiones superficiales con exudado mucopurulento (subíndice endoscópico de Mayo 2). Biopsias: criptitis, microabscesos crípticos y distorsión arquitectural difusa sin granulomas.',
        referenceRange: 'Mucosa colónica íntegra con patrón vascular normal',
        interpretation: 'Hallazgos endoscópicos e histológicos clásicos confirmatorios de Colitis Ulcerosa Crónica Idiopática (extensión izquierda E2, actividad moderada).',
        isAbnormal: true,
      },
    ],
    solution: {
      correctDiagnosis: 'Colitis Ulcerosa Crónica Idiopática (Brote Leve-Moderado)',
      differentialDiagnoses: [
        'Colitis infecciosa bacteriana o amebiana (descartada por falta de respuesta a antibióticos y coprocultivo/toxina negativos)',
        'Enfermedad de Crohn (lesiones discontinuas en empedrado con afectación ileal y granulomas)',
        'Síndrome de intestino irritable (calprotectina normal y sin hematoquezia ni despertar nocturno)',
      ],
      pathophysiology:
        'Respuesta inmune mucosa desregulada limitada a la mucosa y submucosa del colon con extensión continua ascendente desde el recto, generando inflamación críptica, ulceración superficial y sangrado mucoso.',
      keyClinicalClues: [
        'Diarrea crónica (>4 semanas) con sangre roja, moco, tenesmo y urgencia nocturna en adulto joven',
        'Calprotectina fecal muy elevada (740 mcg/g) con coprocultivos negativos',
        'Colonoscopia confirmatoria con inflamación continua desde recto respetando íleon terminal',
      ],
      characteristicSignsSymptoms: [
        'Rectorragia/hematoquezia crónica con moco y tenesmo',
        'Calprotectina fecal elevada',
        'Afectación mucosa colónica continua en colonoscopia',
      ],
      criticalRulingOutFactors: [
        'Sin criterios de colitis aguda grave de Truelove-Witts (≥6 deposiciones con sangre + fiebre >37.8°C, FC >90 o Hb <10.5), lo que permite manejo ambulatorio estrecho.',
        'Siempre descartar infección (C. difficile, parásitos) antes de inmunomoduladores o esteroides.',
      ],
      recommendedWorkup: [
        'Coprocultivo, coproparasitoscópico y toxina de Clostridioides difficile',
        'Biometría hemática, PCR, ferritina y calprotectina fecal',
        'Colonoscopia total con ileoscopia y biopsias escalonadas',
      ],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Mesalazina (5-ASA) combinada (oral + supositorios/enemas)',
            dose: 'Mesalazina 4 g/día vía oral + 1 g vía rectal nocturna',
            route: 'Vía Oral y Rectal',
            frequency: 'Oral cada 24h (o dividida c/12h) + supositorio/enema cada noche',
            duration: 'Inducción 8 semanas seguida de terapia de mantenimiento continua',
            rationale: 'Los aminosalicilatos combinados (oral + tópico) son el tratamiento de primera línea para inducir y mantener remisión en colitis ulcerosa izquierda leve-moderada.',
          },
        ],
        generalMeasures: [
          'Evitar estrictamente AINEs (ibuprofeno, naproxeno) que precipitan brotes inflamatorios.',
          'Vigilar signos de alarma (fiebre, taquicardia, >6 evacuaciones hemáticas o distensión abdominal por megacolon tóxico).',
        ],
        hospitalizationDecision: 'Ambulatorio',
        referralCriteria: [
          'Seguimiento conjunto con Gastroenterología; acudir a urgencias si desarrolla fiebre o deterioro sistémico para esteroide IV.',
        ],
        followUp: 'Revaloración clínica y de calprotectina/hemoglobina en 2 a 4 semanas.',
      },
      criticalSafetyAlerts: [
        'No prescribir antidiarreicos opioides (loperamida) ni anticolinérgicos en brote inflamatorio activo por riesgo de desencadenar megacolon tóxico.',
      ],
      guidelineReferences: [
        'ECCO / AGA Guidelines on the Management of Mild-to-Moderate Ulcerative Colitis',
      ],
    },
    internalPersonaPrompt:
      'Habla en primera persona como Valeria, arquitecta de 29 años que lleva 6 semanas yendo al baño 5 o 6 veces al día con moco, sangre roja, cólicos y pujo incluso en la madrugada, y que dejó de fumar hace 8 meses.',
  },
  {
    id: 'case-out-neumo-bronquiectasias',
    mode: 'medico_general',
    specialty: 'neumologia',
    patientInfo: {
      name: 'Ramiro Esteban Villanueva',
      age: 56,
      sex: 'Masculino',
      occupation: 'Carpintero',
      consultReason: 'Tos diaria con flema verdosa abundante y desde hace 4 días esputo con hilitos de sangre',
      evolutionTime: '3 años de tos crónica, agravada hace 1 semana con hemoptisis leve',
      currentIllness:
        'Paciente masculino de 56 años que acude a consulta externa porque desde hace 3 años tose casi todas las mañanas sacando abundante flema espesa amarilla-verdosa, pero en la última semana la flema aumentó mucho de volumen, se volvió más fétida y desde hace 4 días ha notado estrías de sangre roja mezcladas con la flema al toser. También refiere cansancio leve y febrícula vespertina de 37.6°C. Tuvo dos episodios de neumonía en la juventud. Niega sangrado masivo (menos de 15 mL al día), pérdida grave de peso o dolor torácico agudo.',
      triageLevel: 'Nivel IV (Prioritario)',
    },
    vitalSigns: {
      bloodPressure: '120/78 mmHg',
      heartRate: 86,
      respiratoryRate: 18,
      temperature: 37.5,
      oxygenSaturation: 95,
      glasgow: 15,
      bloodGlucose: 96,
      weightKg: 71,
      heightCm: 170,
    },
    background: {
      pathological: ['Antecedente de neumonías graves de repetición en la adolescencia y sinusitis crónica.'],
      nonPathological: ['Nunca ha fumado; exposición ocupacional leve a polvo de madera sin mascarilla.'],
      family: ['Sin antecedentes relevantes.'],
      surgical: ['Niega cirugías torácicas.'],
      currentMedications: ['Tomó jarabes mucolíticos sin mejoría.'],
      allergies: ['Sin alergias conocidas.'],
    },
    physicalExamPool: [
      {
        id: 'pe-torax-bronq',
        system: 'Tórax y Pulmones',
        name: 'Inspección, mecánica ventilatoria y auscultación pulmonar',
        finding: 'Estertores gruesos (crepitantes rudos persistentes y roncus que modifican parcialmente con la tos) localizados en base pulmonar izquierda. Discreta acropaquia (dedos en palillo de tambor) incipiente. Saturación basal 95% al aire ambiente.',
        isAbnormal: true,
        semiologyNote: 'Estertores gruesos basales fijos + expectoración purulenta crónica con hemoptisis en no fumador orientan fuertemente a bronquiectasias.',
      },
    ],
    studiesPool: [
      {
        id: 'img-tac-bronq',
        category: 'Imagen',
        subcategory: 'Tomografía',
        name: 'Tomografía Computarizada de Tórax de Alta Resolución (TACAR)',
        result: 'Dilataciones bronquiales cilíndricas y varicosas irreversibles en lóbulo inferior izquierdo con engrosamiento de paredes bronquiales, falta de ahusamiento periférico y signo clásico del "anillo de sello" (diámetro bronquial >1.5x arteria adyacente) más tapones mucosos ("árbol en brote") focales. Sin masa pulmonar hiliar ni cavitaciones apicales.',
        referenceRange: 'Calibre bronquial menor o igual al vaso arterial acompañante',
        interpretation: 'Estudio estándar de oro que confirma bronquiectasias basales izquierdas con signos de sobreinfección activa.',
        isAbnormal: true,
      },
      {
        id: 'gab-broncoscopia-case',
        category: 'Gabinete y Trazados',
        subcategory: 'Endoscopia y Broncoscopia',
        name: 'Broncoscopia Flexible (Fibrobroncoscopia) con Lavado Broncoalveolar',
        result: 'Mucosa bronquial de pirámide basal izquierda edematosa, hiperémica y friable con abundantes secreciones mucopurulentas espesas y escasas estrías hemáticas procedentes del segmento basal posterior; ausencia de tumor endobronquial, estenosis cicatrizal o cuerpo extraño aspirado. Cultivo cuantitativo de lavado broncoalveolar (BAL): Haemophilus influenzae no tipificable (>10⁵ UFC/mL); baciloscopia (BAAR) y GeneXpert negativos para tuberculosis; citología negativa para malignidad.',
        referenceRange: 'Árbol bronquial sin secreciones purulentas ni patógenos',
        interpretation: 'Broncoscopia confirma origen de la hemoptisis en bronquiectasias sobreinfectadas por H. influenzae y descarta neoplasia endobronquial o tuberculosis activa.',
        isAbnormal: true,
      },
    ],
    solution: {
      correctDiagnosis: 'Bronquiectasias Infectadas (Exacerbación Aguda con Hemoptisis Leve)',
      differentialDiagnoses: [
        'Tuberculosis pulmonar (descartada por BAAR y GeneXpert negativos en lavado broncoalveolar y ausencia de cavitaciones apicales)',
        'Neoplasia broncopulmonar (descartada por TAC y broncoscopia sin lesión endobronquial)',
        'Bronquitis crónica tabáquica (paciente no fumador con dilataciones irreversibles en TACAR)',
      ],
      pathophysiology:
        'Daño estructural irreversible de la pared bronquial ("círculo vicioso de Cole" de infección e inflamación crónica) que altera el aclaramiento mucociliar, favorece colonización bacteriana crónica, hipervascularización mucosa friable (hemoptisis) y exacerbaciones purulentas.',
      keyClinicalClues: [
        'Expectoración mucopurulenta diaria crónica agravada con estrías de sangre y estertores gruesos basales fijos en no fumador',
        'TACAR de tórax con signo del "anillo de sello" y dilatación bronquial basal izquierda',
        'Broncoscopia con BAL que descarta tumor/cuerpo extraño/TB y aísla Haemophilus influenzae',
      ],
      characteristicSignsSymptoms: [
        'Tos productiva purulenta crónica y hemoptisis leve',
        'Estertores rudos basales persistentes',
        'Signo del anillo de sello en TACAR y aislamiento microbiológico en broncoscopia',
      ],
      criticalRulingOutFactors: [
        'Hemoptisis escasa en estrías (<20 mL/día), signos vitales estables y SpO₂ 95% permiten manejo ambulatorio dirigido.',
        'La broncoscopia y el BAL son fundamentales en hemoptisis con lesión focal para descartar neoplasia y micobacterias y guiar el antibiótico.',
      ],
      recommendedWorkup: [
        'Tomografía de tórax de alta resolución (TACAR) para confirmar bronquiectasias',
        'Cultivo de esputo / Broncoscopia flexible con lavado broncoalveolar (cultivo bacteriano, BAAR, hongos y citología)',
      ],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Amoxicilina/Ácido Clavulánico (o Levofloxacino si alergia/resistencia)',
            dose: '875/125 mg',
            route: 'Vía Oral',
            frequency: 'Cada 12 horas',
            duration: '14 días (ciclo estándar de exacerbación de bronquiectasias)',
            rationale: 'Tratamiento dirigido según aislamiento de H. influenzae en lavado broncoalveolar con duración mínima de 14 días recomendada en guías.',
          },
        ],
        generalMeasures: [
          'Fisioterapia respiratoria y técnicas diarias de drenaje postural / higiene bronquial.',
          'Hidratación adecuada, vacunación antigripal y antineumocócica, y uso de mascarilla laboral en carpintería.',
          'Acudir de inmediato a urgencias si presenta hemoptisis franca abundante (>100 mL/24h) o disnea aguda.',
        ],
        hospitalizationDecision: 'Ambulatorio',
        referralCriteria: [
          'Seguimiento en consulta externa de Neumología para estudio etiológico basal (inmunoglobulinas, espirometría).',
        ],
        followUp: 'Revaloración en consulta en 7 a 10 días para comprobar reducción del volumen y purulencia del esputo y cese de hemoptisis.',
      },
      criticalSafetyAlerts: [
        'Evitar antitusígenos potentes (codeína/dextrometorfano) que inhiben la expulsión de secreciones purulentas acumuladas en las bronquiectasias.',
      ],
      guidelineReferences: [
        'ERS Guidelines for the Management of Adult Bronchiectasis',
        'BTS Guideline for Bronchiectasis in Adults',
      ],
    },
    internalPersonaPrompt:
      'Habla en primera persona como Ramiro, carpintero de 56 años que nunca ha fumado, con tos crónica y flema verdosa abundante cada mañana que desde hace 4 días sale con hilitos de sangre.',
  },
  {
    id: 'case-neuro-crisis-epileptica',
    mode: 'medico_general',
    specialty: 'neurologia',
    patientInfo: {
      name: 'Sofía Alejandra Ríos',
      age: 28,
      sex: 'Femenino',
      occupation: 'Diseñadora industrial',
      consultReason: 'Me desmayé con sacudidas en todo el cuerpo y me mordí la lengua esta mañana',
      evolutionTime: '3 meses con episodios breves de "sensación rara en el estómago" y 1 crisis generalizada hoy hace 2 horas',
      currentIllness:
        'Paciente femenino de 28 años traída por su hermana tras haber presentado hace 2 horas un episodio súbito en el desayuno: primero se quedó mirando fijo, sintió una sensación rara que subía del estómago al pecho acompañada de olor metálico extraño y un recuerdo intenso como si ya hubiera vivido ese momento, y segundos después giró la cabeza hacia la izquierda y presentó rigidez seguida de sacudidas rítmicas de brazos y piernas por cerca de 90 segundos, con mordedura lateral derecha de la lengua y somnolencia profunda por 20 minutos. Al llegar a consulta ya se encuentra totalmente despierta y orientada, con dolor muscular generalizado y cefalea leve. En los últimos 3 meses había tenido 4 episodios cortos de 20 segundos con esa misma sensación gástrica ascendente y desconexión breve sin caídas.',
      triageLevel: 'Nivel III (Urgencia)',
    },
    vitalSigns: {
      bloodPressure: '118/74 mmHg',
      heartRate: 84,
      respiratoryRate: 17,
      temperature: 36.7,
      oxygenSaturation: 98,
      glasgow: 15,
      bloodGlucose: 98,
      weightKg: 60,
      heightCm: 165,
    },
    background: {
      pathological: ['Convulsión febril prolongada a los 3 años de edad según refiere su mamá. Niega hipertensión, diabetes o traumatismos craneales recientes.'],
      nonPathological: ['Desvelos frecuentes por entregas de diseño; no fuma ni consume drogas; toma una copa de vino ocasional cada 2 meses.'],
      family: ['Prima materna con crisis convulsivas en la juventud.'],
      surgical: ['Niega cirugías previas.'],
      currentMedications: ['Ningún medicamento habitual; anticonceptivos orales combinados.'],
      allergies: ['Sin alergias conocidas.'],
    },
    physicalExamPool: [
      {
        id: 'pe-neuro-epilepsia',
        system: 'Neurológico',
        name: 'Estado de conciencia, pares craneales, fuerza y coordinación',
        finding: 'Despierta y orientada en persona, tiempo y espacio (Glasgow 15/15: O4 V5 M6). Pares craneales II-XII íntegros, fondo de ojo sin edema de papila, fuerza 5/5 simétrica en las 4 extremidades, reflejos osteotendinosos (++/++++), sin déficit focal ni signos meníngeos.',
        isAbnormal: false,
        semiologyNote: 'Tras recuperar el estado postictal, la exploración neurológica normal NO descarta epilepsia focal; orienta a descartar lesión aguda urgente y confirmar con EEG/RMN.',
      },
      {
        id: 'pe-boca-lengua',
        system: 'Cabeza y Cuello',
        name: 'Inspección de cavidad oral y lengua',
        finding: 'Pequeña laceración hemática reciente en el borde lateral derecho de la lengua (mordedura lateral). Sin heridas craneales ni equimosis periorbitaria.',
        isAbnormal: true,
        semiologyNote: 'La mordedura lateral de la lengua (a diferencia de la punta en síncope/crisis psicógena) tiene altísima especificidad (>95%) para crisis epiléptica tónico-clónica.',
      },
    ],
    studiesPool: [
      {
        id: 'gab-eeg-epilepsia',
        category: 'Gabinete y Trazados',
        subcategory: 'Electromiografía y Neurofisiología',
        name: 'Electroencefalograma (EEG) Convencional con Activación (Hiperventilación y Fotoestimulación)',
        result: 'Ritmo de base alfa posterior a 10 Hz bien organizado. Durante vigilia relajada y somnolencia inducida se registran frecuentes descargas epileptiformes interictales focales (complejos punta-onda lenta y ondas agudas de alto voltaje con inversión de fase en electrodos F8-T4) localizadas en región temporal anterior derecha, con activación moderada durante la hiperventilación.',
        referenceRange: 'Actividad de fondo normal sin complejos punta-onda ni paroxismos focales',
        interpretation: 'EEG francamente patológico con foco epileptogénico interictal en lóbulo temporal derecho, confirmatorio de epilepsia focal.',
        isAbnormal: true,
      },
      {
        id: 'img-rmn-epilepsia',
        category: 'Imagen',
        subcategory: 'Tomografía',
        name: 'Resonancia Magnética Nuclear (RMN) de Encéfalo con Protocolo de Epilepsia',
        result: 'Discreta asimetría con hiperintensidad en T2/FLAIR y reducción de volumen del hipocampo derecho (esclerosis mesial temporal incipiente). Ausencia de tumores, malformaciones arteriovenosas, sangrado agudo o eventos isquémicos.',
        referenceRange: 'Parénquima encefálico e hipocampos simétricos sin alteración de señal',
        interpretation: 'Esclerosis hipocampal mesial derecha compatible con epilepsia del lóbulo temporal, sin lesión expansiva aguda.',
        isAbnormal: true,
      },
    ],
    solution: {
      correctDiagnosis: 'Epilepsia del Lóbulo Temporal (Crisis Epiléptica Focal con Evolución Bilateral Tónico-Clónica)',
      differentialDiagnoses: [
        'Síncope vasovagal o cardiogénico (inicio sin aura epigástrica/déjà vu, sin fase postictal prolongada ni mordedura lateral de lengua; Holter/ECG normales)',
        'Crisis funcional / psicógena no epiléptica (EEG interictal e ictal normal, ausencia de mordedura lateral)',
        'Crisis sintomática aguda por hipoglucemia, hiponatremia o tóxicos (descartadas con glucosa 98 mg/dL, electrolitos y toxicológico negativos)',
      ],
      pathophysiology:
        'Descarga neuronal hipersincrónica paroxística originada en estructuras mesiales del lóbulo temporal derecho (amígdala/hipocampo, relacionada con esclerosis mesial tras convulsión febril infantil), manifestada inicialmente como aura epigástrica/olfatoria/déjà vu y propagación posterior a redes talamocorticales bilaterales.',
      keyClinicalClues: [
        'Aura típica temporal (sensación epigástrica ascendente + olor extraño + déjà vu) antes de perder la conciencia',
        'Versión cefálica, sacudidas tónico-clónicas, mordedura lateral de lengua y confusión postictal de 20 minutos',
        'Electroencefalograma (EEG) con puntas/ondas agudas focales en región temporal derecha (F8-T4)',
      ],
      characteristicSignsSymptoms: [
        'Aura epigástrica y experiencial seguida de crisis motora bilateral',
        'Mordedura lateral de lengua y periodo postictal',
        'Descargas epileptiformes temporales en el EEG',
      ],
      criticalRulingOutFactors: [
        'Glucosa normal, electrolitos normales y tamizaje toxicológico negativo descartan causa metabólica/tóxica aguda.',
        'ECG/Holter normales descartan síncope arrítmico; el EEG temporal confirma epilepsia focal.',
      ],
      recommendedWorkup: [
        'Glucemia, electrolitos séricos y tamizaje toxicológico urgente para excluir causas provocadas',
        'Electroencefalograma (EEG) estándar con activación y RMN cerebral con protocolo de epilepsia',
      ],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Levetiracetam (o Lamotrigina en titulación progresiva)',
            dose: '500 mg iniciales',
            route: 'Vía Oral',
            frequency: 'Cada 12 horas',
            duration: 'Tratamiento crónico de mantenimiento bajo control neurológico',
            rationale: 'Fármaco anticrisis de primera línea en epilepsia focal en mujer en edad fértil (sin inducción enzimática que reduzca eficacia de anticonceptivos orales como carbamazepina/fenitoína).',
          },
        ],
        generalMeasures: [
          'Restricción temporal de conducción vehicular, nado sin supervisión y trabajos en alturas hasta lograr control libre de crisis según normativa médica.',
          'Higiene estricta del sueño (evitar desvelos) y moderación/evitación de alcohol.',
          'Explicar a familiares primeros auxilios ante crisis (posición lateral de seguridad, no introducir objetos en la boca, medir tiempo y acudir a urgencias si dura >5 min).',
        ],
        hospitalizationDecision: 'Ambulatorio',
        referralCriteria: [
          'Valoración prioritaria por Neurología / Clínica de Epilepsia; acudir de inmediato a Urgencias si repite crisis >5 minutos o no recupera la conciencia entre crisis.',
        ],
        followUp: 'Control por Neurología en 2 a 4 semanas para evaluar tolerancia al fármaco anticrisis, revisar RMN y reforzar medidas de seguridad.',
      },
      criticalSafetyAlerts: [
        'En mujeres en edad fértil evitar ácido valproico como primera línea por alto riesgo teratogénico; recordar además que inductores enzimáticos (carbamazepina/fenitoína) inactivan los anticonceptivos orales.',
        'Nunca introducir objetos ni dedos en la boca durante una crisis convulsiva.',
      ],
      guidelineReferences: [
        'ILAE Classification of the Epilepsies & NICE Epilepsies Guideline (NG217)',
        'AAN Guideline: Management of an Unprovoked First Seizure in Adults',
      ],
    },
    internalPersonaPrompt:
      'Habla en primera persona como Sofía, diseñadora de 28 años que esta mañana sentiste algo raro subir del estómago con un olor metálico y sensación de déjà vu, te desmayaste con convulsiones y te mordiste el lado derecho de la lengua, aunque ya estás despierta y orientada.',
  },
  {
    id: 'case-out-neumo-epoc',
    mode: 'principiante',
    specialty: 'neumologia',
    patientInfo: {
      name: 'Héctor Manuel Lozano',
      age: 64,
      sex: 'Masculino',
      occupation: 'Contador retirado',
      consultReason: 'Me falta el aire cada vez que camino rápido o subo un piso de escaleras y tengo tos con flema en las mañanas',
      evolutionTime: '2 años de disnea de esfuerzo progresiva',
      currentIllness:
        'Paciente masculino de 64 años que acude a consulta externa porque desde hace casi 2 años nota que se cansa y le falta el aire al caminar rápido en plano o subir un piso de escaleras (mMRC grado 2), además de tener tos diaria casi todas las mañanas desde hace más de 3 años con flema blanquecina escasa. Fumó 1 cajetilla diaria durante 38 años (índice tabáquico 38 paquetes-año) y lo redujo a 5 cigarros diarios el último año. Niega fiebre, dolor torácico opresivo, edema de piernas, ortopnea o hemoptisis.',
      triageLevel: 'Nivel V (No Urgente)',
    },
    vitalSigns: {
      bloodPressure: '128/78 mmHg',
      heartRate: 78,
      respiratoryRate: 18,
      temperature: 36.5,
      oxygenSaturation: 93,
      glasgow: 15,
      bloodGlucose: 98,
      weightKg: 74,
      heightCm: 172,
    },
    background: {
      pathological: ['Tabaquismo intenso crónico (38 paquetes-año). Dislipidemia leve controlada con dieta.'],
      nonPathological: ['Exfumador parcial (aún fuma 5 cigarros al día). Sin exposición a biomasa ni asbesto.'],
      family: ['Padre fallecido a los 78 años por cardiopatía.'],
      surgical: ['Hernioplastia umbilical hace 12 años.'],
      currentMedications: ['Salbutamol inhalado ocasional que le prestó un familiar.'],
      allergies: ['Sin alergias conocidas.'],
    },
    physicalExamPool: [
      {
        id: 'pe-torax-epoc',
        system: 'Tórax y Pulmones',
        name: 'Inspección torácica y auscultación pleuropulmonar',
        finding: 'Tórax con ligero aumento del diámetro anteroposterior. Murmullo vesicular globalmente disminuido de intensidad en ambos campos pulmonares, con espiración discretamente prolongada y escasas sibilancias espiratorias aisladas a la espiración forzada. Sin estertores crepitantes ni tiraje.',
        isAbnormal: true,
        semiologyNote: 'Disminución global del murmullo vesicular + espiración prolongada en fumador pesado orienta a obstrucción crónica al flujo aéreo.',
      },
      {
        id: 'pe-cardio-epoc',
        system: 'Cardiovascular',
        name: 'Auscultación cardíaca y búsqueda de ingurgitación/edema',
        finding: 'Ruidos cardíacos rítmicos de intensidad levemente apagada por hiperinsuflación, sin soplos ni galope S3. Sin ingurgitación yugular ni edema bimaleolar en miembros inferiores.',
        isAbnormal: false,
        semiologyNote: 'Ausencia de S3, ingurgitación yugular o edema periférico ayuda a descartar insuficiencia cardíaca descompensada.',
      },
    ],
    studiesPool: [
      {
        id: 'gab-espirometria-epoc',
        category: 'Gabinete y Trazados',
        subcategory: 'Función Pulmonar y Audiología',
        name: 'Espirometría Basal y Prueba con Broncodilatador (FVC, FEV₁, Relación FEV₁/FVC)',
        result: 'Basal: FVC 84% del predicho | FEV₁ 58% del predicho | Relación FEV₁/FVC: 0.55. Post-broncodilatador (400 mcg de salbutamol): FVC 86% | FEV₁ 60% del predicho | Relación FEV₁/FVC: 0.57 (cambio en FEV₁ de +4% y +85 mL: respuesta broncodilatadora negativa).',
        referenceRange: 'Post-broncodilatador FEV₁/FVC ≥ 0.70',
        interpretation: 'Limitación crónica persistente al flujo aéreo no completamente reversible (FEV₁/FVC post-BD < 0.70, grado GOLD 2 moderado), confirmatoria de EPOC.',
        isAbnormal: true,
      },
      {
        id: 'img-rx-epoc',
        category: 'Imagen',
        subcategory: 'Radiología',
        name: 'Radiografía de Tórax PA y Lateral',
        result: 'Hiperclaridad pulmonar difusa bilateral, aumento del espacio aéreo retroesternal, horizontalización de arcos costales y discreto aplanamiento de ambos hemidiafragmas. Silueta cardíaca en gota (índice cardiotorácico 0.44). Sin consolidaciones neumónicas, nódulos sospechosos ni derrame pleural.',
        referenceRange: 'Volúmenes pulmonares normales sin signos de atrapamiento aéreo',
        interpretation: 'Signos radiológicos de hiperinsuflación pulmonar crónica compatibles con enfisema/EPOC; descarta neumonía o insuficiencia cardíaca.',
        isAbnormal: true,
      },
    ],
    solution: {
      correctDiagnosis: 'Enfermedad Pulmonar Obstructiva Crónica (EPOC) Estable (GOLD 2 / Grupo B)',
      differentialDiagnoses: [
        'Asma bronquial del adulto (cursa con reversibilidad espirométrica significativa ≥12% y ≥200 mL post-broncodilatador y menor carga tabáquica)',
        'Insuficiencia cardíaca crónica (descartada por ausencia de ortopnea/edema y NT-proBNP normal)',
        'Bronquiectasias (expectoración purulenta crónica abundante con dilataciones bronquiales en TACAR)',
      ],
      pathophysiology:
        'Inflamación crónica de la vía aérea periférica y destrucción progresiva del parénquima alveolar (enfisema) inducidas por exposición prolongada al humo del tabaco (38 paquetes-año), causando pérdida de retracción elástica, colapso espiratorio temprano y limitación crónica persistente al flujo aéreo.',
      keyClinicalClues: [
        'Hombre >40 años con tabaquismo intenso (38 paquetes-año), disnea progresiva de esfuerzo y tos productiva crónica',
        'Espirometría post-broncodilatador con relación FEV₁/FVC < 0.70 (0.57) sin reversibilidad significativa',
        'Radiografía con hiperinsuflación pulmonar y NT-proBNP normal descartando causa cardíaca',
      ],
      characteristicSignsSymptoms: [
        'Disnea crónica progresiva al esfuerzo y tos crónica matutina',
        'Murmullo vesicular disminuido y espiración prolongada',
        'Cociente FEV₁/FVC < 0.70 post-broncodilatador en espirometría',
      ],
      criticalRulingOutFactors: [
        'La espirometría con prueba broncodilatadora es indispensable y obligatoria para confirmar EPOC (FEV₁/FVC post-BD < 0.70) y diferenciarlo del asma.',
        'NT-proBNP normal y Rx sin cardiomegalia ni congestión descartan disnea de origen cardíaco.',
      ],
      recommendedWorkup: [
        'Espirometría basal y post-broncodilatador como estándar diagnóstico confirmatorio',
        'Radiografía de tórax PA/lateral y NT-proBNP para descartar comorbilidades cardíacas o neoplásicas',
      ],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Broncodilatador dual inhalado LABA + LAMA (ej. Tiotropio/Olodaterol o Umeclidinio/Vilanterol)',
            dose: '1 inhalación (dosis estándar según dispositivo)',
            route: 'Vía Inhalatoria',
            frequency: 'Cada 24 horas',
            duration: 'Tratamiento crónico de mantenimiento',
            rationale: 'Terapia de mantenimiento de primera línea en EPOC grupo B (sintomático mMRC ≥2) según guías GOLD para mejorar disnea, tolerancia al ejercicio y reducir exacerbaciones.',
          },
          {
            drug: 'Salbutamol inhalado de rescate (SABA)',
            dose: '100-200 mcg (1 a 2 disparos con espaciador)',
            route: 'Vía Inhalatoria',
            frequency: 'Solo por razón necesaria ante disnea aguda',
            duration: 'Según necesidad',
            rationale: 'Broncodilatador de acción corta de alivio rápido.',
          },
        ],
        generalMeasures: [
          'Cesación tabáquica absoluta (intervención más efectiva para frenar el deterioro acelerado del FEV₁; ofrecer apoyo conductual y farmacológico como vareniclina/terapia de reemplazo nicotínico).',
          'Vacunación anual contra Influenza, neumococo, COVID-19 y VRS según edad.',
          'Programa de rehabilitación pulmonar, actividad física regular y verificación de técnica inhalatoria.',
        ],
        hospitalizationDecision: 'Ambulatorio',
        referralCriteria: [
          'Acudir a urgencias si presenta aumento agudo de disnea, incremento de volumen o purulencia del esputo o desaturación <88%.',
        ],
        followUp: 'Control en consulta externa en 4 semanas para verificar abandono del tabaco, técnica inhalatoria y mejoría clínica de disnea.',
      },
      criticalSafetyAlerts: [
        'No prescribir monoterapia con corticoides inhalados sin broncodilatadores ni indicar betabloqueadores no selectivos (propranolol) que puedan empeorar el broncoespasmo.',
        'Nunca diagnosticar EPOC sin confirmar obstrucción persistente en espirometría post-broncodilatador.',
      ],
      guidelineReferences: [
        'GOLD 2024 Global Strategy for Prevention, Diagnosis and Management of COPD',
      ],
    },
    internalPersonaPrompt:
      'Habla en primera persona como Héctor, contador retirado de 64 años que fumaste mucho por 38 años, te falta el aire al subir un piso de escaleras o caminar rápido y toses flemita clara casi todas las mañanas.',
  },
];
