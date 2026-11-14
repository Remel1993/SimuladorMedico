import {
  ClinicalCase,
  ClinicalEvolutionState,
  EvolutionTrajectory,
  StatInterventionRecord,
  VitalSigns,
} from '../types/clinical';

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

function parseBP(bp: string): { sys: number; dia: number } {
  const match = (bp || '').match(/(\d+)\s*\/\s*(\d+)/);
  if (!match) return { sys: 120, dia: 80 };
  return {
    sys: clamp(parseInt(match[1], 10) || 120, 50, 250),
    dia: clamp(parseInt(match[2], 10) || 80, 30, 150),
  };
}

function formatBP(sys: number, dia: number): string {
  const safeSys = clamp(Math.round(sys), 45, 250);
  const safeDia = clamp(Math.round(dia), 24, Math.min(150, Math.max(28, safeSys - 14)));
  return `${safeSys}/${safeDia} mmHg`;
}

export interface EvolutionTickResult {
  updatedVitals: VitalSigns;
  evolutionState: ClinicalEvolutionState;
  changed: boolean;
}

/**
 * Motor determinista de evolución clínica continua.
 * Evalúa signos de alarma, criterios de gravedad e intervenciones realizadas para determinar si el
 * paciente mejora, se mantiene estable o progresa hacia deterioro fisiológico realista (sin valores absurdos).
 */
export function evaluateClinicalEvolutionStep(params: {
  caseData: ClinicalCase;
  baselineVitals: VitalSigns;
  currentVitals: VitalSigns;
  elapsedSeconds: number;
  statInterventions: StatInterventionRecord[];
  unlockedExamCount: number;
  unlockedStudyCount: number;
  lastEvaluatedSecond: number;
}): EvolutionTickResult {
  const {
    caseData,
    baselineVitals,
    currentVitals,
    elapsedSeconds,
    statInterventions,
    lastEvaluatedSecond,
  } = params;

  const isDeceased =
    statInterventions.some((s) => s.isImmediateDeath) ||
    currentVitals.heartRate === 0 ||
    (currentVitals.bloodPressure || '').startsWith('0/');

  if (isDeceased) {
    return {
      updatedVitals: {
        ...currentVitals,
        bloodPressure: '0/0 mmHg',
        heartRate: 0,
        respiratoryRate: 0,
        oxygenSaturation: 0,
        glasgow: 3,
      },
      evolutionState: {
        trajectory: 'critico',
        activeAlerts: [
          '¡CÓDIGO AZUL · PACIENTE FALLECIDO (ASISTOLIA)!: muerte inmediata por iatrogenia irreversible.',
        ],
        lastEvaluatedSecond: elapsedSeconds,
        summaryNote: 'Paciente en asistolia irreversible sin pulso ni ventilación espontánea.',
      },
      changed: false,
    };
  }

  const baseBP = parseBP(baselineVitals.bloodPressure);
  const curBP = parseBP(currentVitals.bloodPressure);

  let sys = curBP.sys;
  let dia = curBP.dia;
  let hr = currentVitals.heartRate;
  let rr = currentVitals.respiratoryRate;
  let temp = currentVitals.temperature;
  let spo2 = currentVitals.oxygenSaturation;
  let glasgow = currentVitals.glasgow;
  let glucose = currentVitals.bloodGlucose;

  const diagText = `${caseData.solution.correctDiagnosis} ${caseData.solution.pathophysiology}`.toLowerCase();
  const isCriticalCase =
    caseData.mode === 'urgencias' ||
    caseData.patientInfo.triageLevel.includes('Nivel I') ||
    caseData.patientInfo.triageLevel.includes('Nivel II');

  const lastMejoriaIdx = statInterventions.map((s) => s.effectSeverity).lastIndexOf('mejoria');
  const lastAdverseIdx = statInterventions.map((s) => s.effectSeverity).lastIndexOf('reaccion_adversa');
  const hasSuccessfulStat = lastMejoriaIdx >= 0 && lastMejoriaIdx > lastAdverseIdx;
  const hasAdverseStat = lastAdverseIdx >= 0 && lastAdverseIdx > lastMejoriaIdx;

  const isHypotensive = sys < 95 || (sys - dia) <= 25;
  const isHypertensiveCrisis = sys >= 180 || dia >= 115;
  const isHypoxemic = spo2 < 93;
  const isSevereFever = temp >= 38.8;
  const isHypoglycemic = typeof glucose === 'number' && glucose < 70;
  const isSevereHypoglycemic = typeof glucose === 'number' && glucose < 54;
  const isSevereHyperglycemic = typeof glucose === 'number' && glucose >= 280;
  const isNeurologicRisk = glasgow < 15 || /meningitis|ictus|evc|status|hemorragia subaracnoidea/i.test(diagText);

  const activeAlerts: string[] = [];
  if (isSevereHypoglycemic) {
    activeAlerts.push(
      `¡EMERGENCIA METABÓLICA (Glucemia ${glucose} mg/dL)!: neuroglucopenia grave y riesgo letal inmediato; administrar Dextrosa IV urgente.`
    );
  } else if (isHypoglycemic) {
    activeAlerts.push('Hipoglucemia (< 70 mg/dL): riesgo neurológico agudo; corregir de inmediato.');
  }
  if (sys < 80) activeAlerts.push(`¡CHOQUE CRÍTICO (PA ${sys}/${dia} mmHg)!: hipoperfusión cerebral/orgánica inminente.`);
  else if (sys < 90) activeAlerts.push('Hipotensión arterial (PAS < 90 mmHg): riesgo de hipoperfusión orgánica.');
  if (spo2 < 92) activeAlerts.push('Hipoxemia (SpO₂ < 92%): requiere oxigenoterapia y soporte respiratorio inmediato.');
  if (rr <= 9) activeAlerts.push(`¡DEPRESIÓN VENTILATORIA CRÍTICA (FR ${rr} rpm)!: riesgo de apnea y paro respiratorio.`);
  else if (rr >= 28) activeAlerts.push('Taquipnea severa (FR ≥ 28 rpm): riesgo de fatiga respiratoria.');
  if (hr >= 145) activeAlerts.push(`¡TAQUIARRITMIA SEVERA (FC ${hr} lpm)!: alto riesgo de inestabilidad hemodinámica.`);
  else if (hr >= 125) activeAlerts.push('Taquicardia marcada (FC ≥ 125 lpm): vigilar choque compensado o arritmia.');
  if (hr <= 45) activeAlerts.push('Bradicardia severa (FC ≤ 45 lpm): riesgo de paro o bloqueo AV de alto grado.');
  if (temp >= 39.2) activeAlerts.push('Fiebre elevada (≥ 39.2°C): aumenta consumo metabólico y riesgo de deshidratación.');
  if (isSevereHyperglycemic) activeAlerts.push('Hiperglucemia severa (≥ 280 mg/dL): vigilar cetoacidosis o estado hiperosmolar.');
  if (glasgow <= 9) {
    activeAlerts.unshift(
      `¡PACIENTE INCONSCIENTE (Glasgow ${glasgow}/15)!: pérdida del estado de alerta — no responde preguntas; proteja vía aérea y aplique rescate STAT.`
    );
  } else if (glasgow <= 12) {
    activeAlerts.push(`Compromiso neurológico significativo (Glasgow ${glasgow}/15): vigilar protección de vía aérea.`);
  }
  if (sys >= 185 || dia >= 115) activeAlerts.push('Crisis hipertensiva (≥ 185/115 mmHg): descartar daño agudo a órgano blanco.');

  const hasBaselineInstability =
    baseBP.sys < 95 ||
    baselineVitals.oxygenSaturation < 93 ||
    baselineVitals.heartRate >= 118 ||
    baselineVitals.glasgow < 15 ||
    (typeof baselineVitals.bloodGlucose === 'number' &&
      (baselineVitals.bloodGlucose < 70 || baselineVitals.bloodGlucose >= 280)) ||
    isCriticalCase;

  const hasAcuteCriticalState =
    sys < 85 || spo2 < 88 || glasgow <= 11 || rr <= 9 || hr <= 44 || hr >= 150 || isSevereHypoglycemic;

  let changed = false;
  const shouldStep = elapsedSeconds - lastEvaluatedSecond >= 45;

  if (shouldStep && (hasBaselineInstability || hasAcuteCriticalState || hasAdverseStat) && !hasSuccessfulStat) {
    // Deterioro progresivo realista si hay inestabilidad o evento adverso sin rescate
    if (elapsedSeconds >= 60 || hasAcuteCriticalState || hasAdverseStat) {
      if (isHypotensive || /choque|shock|dengue|sepsis|ectopico|hemorragia/i.test(diagText)) {
        const nextSys = clamp(sys - 3, 45, 220);
        const nextDia = clamp(dia - 2, 24, Math.max(28, nextSys - 16));
        if (nextSys !== sys || nextDia !== dia) {
          sys = nextSys;
          dia = nextDia;
          changed = true;
        }
        if (hr >= 55) {
          const nextHr = clamp(hr + 3, 45, 172);
          if (nextHr !== hr) {
            hr = nextHr;
            changed = true;
          }
        }
      }

      if (isHypoxemic || /neumonia|asma|epoc|neumotorax|edema agudo|tromboembolia/i.test(diagText)) {
        const nextSpo2 = clamp(spo2 - 1, 65, 100);
        const nextRr = rr <= 10 ? clamp(rr - 1, 4, 40) : clamp(rr + 1, 10, 40);
        if (nextSpo2 !== spo2 || nextRr !== rr) {
          spo2 = nextSpo2;
          rr = nextRr;
          changed = true;
        }
      }

      if (isSevereFever && temp < 40.3) {
        temp = Number(clamp(temp + 0.1, 35.0, 41.2).toFixed(1));
        changed = true;
      }

      if (isHypoglycemic && typeof glucose === 'number' && glucose > 14) {
        glucose = clamp(glucose - 4, 12, 700);
        if (glucose < 50 && glasgow > 5) {
          glasgow = clamp(glasgow - 1, 3, 15);
        }
        changed = true;
      }

      if ((sys < 78 || spo2 < 84 || isNeurologicRisk) && elapsedSeconds >= 180 && glasgow > 6) {
        if (elapsedSeconds % 90 < 45) {
          glasgow = clamp(glasgow - 1, 4, 15);
          changed = true;
        }
      }
    }
  } else if (shouldStep && hasSuccessfulStat && !hasAcuteCriticalState) {
    // Consolidación gradual de mejoría dentro de límites fisiológicos normales
    if (sys < 105 && baseBP.sys < 100) {
      sys = clamp(sys + 2, 65, 122);
      dia = clamp(dia + 1, 42, 78);
      changed = true;
    }
    if (hr > 105 && baselineVitals.heartRate > 105) {
      hr = clamp(hr - 3, 68, 170);
      changed = true;
    }
    if (spo2 < 96 && baselineVitals.oxygenSaturation < 94) {
      spo2 = clamp(spo2 + 1, 75, 98);
      changed = true;
    }
  }

  // Coherencia fisiológica estricta (permite rangos críticos reales de sobredosis sin falsos topes protectores)
  sys = clamp(Math.round(sys), 45, 250);
  dia = clamp(Math.round(dia), 24, Math.min(150, Math.max(28, sys - 14)));
  hr = clamp(Math.round(hr), 28, 192);
  rr = clamp(Math.round(rr), 4, 46);
  spo2 = clamp(Math.round(spo2), 60, 100);
  temp = Number(clamp(temp, 34.5, 41.5).toFixed(1));
  glasgow = clamp(Math.round(glasgow), 3, 15);
  if (typeof glucose === 'number') {
    glucose = clamp(Math.round(glucose), 12, 700);
  }

  let trajectory: EvolutionTrajectory = 'estable';
  if (hasAdverseStat || hasAcuteCriticalState) {
    trajectory = 'critico';
  } else if (hasSuccessfulStat && activeAlerts.length <= 1) {
    trajectory = 'mejorando';
  } else if (activeAlerts.length > 0 && !hasSuccessfulStat && elapsedSeconds >= 60 && hasBaselineInstability) {
    trajectory = 'deterioro';
  }

  let summaryNote = 'Parámetros fisiológicos sin cambios agudos de alarma.';
  if (trajectory === 'critico') {
    summaryNote = 'Compromiso fisiológico crítico activo: priorice soporte ABCDE y estabilización/antídoto STAT.';
  } else if (trajectory === 'deterioro') {
    summaryNote = 'Tendencia progresiva al deterioro ante persistencia de inestabilidad sin estabilización dirigida.';
  } else if (trajectory === 'mejorando') {
    summaryNote = 'Respuesta clínica favorable tras las medidas de estabilización aplicadas.';
  } else if (isHypertensiveCrisis) {
    summaryNote = 'Cifras tensionales en rango crítico: vigilar síntomas neurológicos, torácicos y renales.';
  }

  const updatedVitals: VitalSigns = {
    ...currentVitals,
    bloodPressure: formatBP(sys, dia),
    heartRate: hr,
    respiratoryRate: rr,
    temperature: temp,
    oxygenSaturation: spo2,
    glasgow,
    bloodGlucose: glucose,
  };

  return {
    updatedVitals,
    evolutionState: {
      trajectory,
      activeAlerts,
      lastEvaluatedSecond: shouldStep ? elapsedSeconds : lastEvaluatedSecond,
      summaryNote,
    },
    changed,
  };
}
