import React, { useState, useMemo } from 'react';
import { ComplementaryStudy, VitalSigns } from '../types/clinical';
import { Activity, Maximize2, Minimize2, Sun, Moon, Ruler } from 'lucide-react';

interface StudyTracingViewerProps {
  study: ComplementaryStudy;
  vitalSigns?: VitalSigns;
}

type TracingKind =
  | 'ecg_12'
  | 'holter_ecg'
  | 'holter_bp'
  | 'spirometry'
  | 'eeg'
  | 'audiometry'
  | null;

function norm(text: string): string {
  return (text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function stripMedicalNegations(txt: string): string {
  return txt
    .replace(
      /\bsin\s+(?:evidencia\s+de\s+|datos\s+de\s+|signos\s+de\s+|ondas?\s+t\s+)?(?:fibrilacion(?:\s+auricular)?|arritmias?(?:\s+supraventricular(?:es)?)?|isquemia(?:\s+aguda)?|supradesnivel(?:\s+agudo)?(?:\s+del\s+st)?|descenso(?:\s+del\s+st)?|elevacion(?:\s+ni\s+descenso)?(?:\s+del\s+st)?|inversion(?:\s+isquemica)?|picudas|hiperkalemia|onda\s+u|ondas\s+q|cambios\s+reciprocos|alternancia|bloqueo(?:\s+de\s+rama)?|hipertrofia(?:\s+ventricular)?|descargas\s+epileptiformes|pausas|asimetrias?)[^.,;)]*/g,
      ' '
    )
    .replace(
      /\bausencia\s+(?:total\s+)?de\s+(?:supradesnivel|elevacion|ondas?\s+t\s+picudas|actividad\s+epileptiforme|ondas?\s+p\s+sinusales|hipoacusia)[^.,;)]*/g,
      ' '
    )
    .replace(/\bdescarta\s+(?:arritmia|isquemia|fibrilacion|actividad\s+epileptiforme)[^.,;)]*/g, ' ')
    .replace(/\bno\s+se\s+registran\s+[^.,;)]*/g, ' ');
}

export function detectTracingKind(study: ComplementaryStudy): TracingKind {
  const n = norm(study.name);

  const isBpHolter =
    /\bmapa\b/.test(n) ||
    n.includes('monitoreo ambulatorio de pa') ||
    n.includes('monitoreo ambulatorio de presion') ||
    (n.includes('holter') && (n.includes('presion') || n.includes('arterial')));
  if (isBpHolter) return 'holter_bp';
  if (n.includes('holter')) return 'holter_ecg';
  if (n.includes('electrocardiograma') || /\becg\b/.test(n) || /\bekg\b/.test(n)) return 'ecg_12';
  if (n.includes('espirometr')) return 'spirometry';
  if (n.includes('electroencefalograma') || /\beeg\b/.test(n)) return 'eeg';
  if (n.includes('audiometr')) return 'audiometry';
  return null;
}

// ---------- ECG WAVEFORM SYNTHESIS ----------

interface EcgProfile {
  hr: number;
  isAsystole: boolean;
  isAFib: boolean;
  isParoxysmalMix: boolean;
  isSVT: boolean;
  isCompleteAVBlock: boolean;
  isAnteriorSTEMI: boolean;
  isExtensiveAnterior: boolean;
  isInferiorSTEMI: boolean;
  isLateralSTEMI: boolean;
  stElevationMv: number;
  isStDepression: boolean;
  isPericarditis: boolean;
  isPeakedT: boolean;
  isS1Q3T3: boolean;
  isInvertedT: boolean;
  invertedTLeads: 'anterior' | 'lateral' | 'inferior' | 'diffuse' | null;
  isLVH: boolean;
  isAlternans: boolean;
  isLongQT: boolean;
  isFlatT: boolean;
}

export function parseEcgProfile(study: ComplementaryStudy, vitalSigns?: VitalSigns): EcgProfile {
  const txt = norm(`${study.result} ${study.interpretation || ''}`);
  // Preserve "ausencia de ondas p" BEFORE stripping generic negations
  const hasAbsentP = /ausencia(?:\s+total)?\s+de\s+ondas?\s+p|sustituidas\s+por\s+ondas?\s+f/.test(txt);
  const txtNoNeg = stripMedicalNegations(txt);

  const hrMatch =
    txt.match(/(?:fc(?:\s+media)?|frecuencia(?:\s+cardiaca|\s+ventricular\s+media)?)\s*(?:de|:)?\s*(\d{1,3})\s*(?:lpm|bpm)?/) ||
    txt.match(/\b(\d{1,3})\s*(?:lpm|bpm|latidos)\b/);

  const isAsystole =
    /\b(asistolia|trazo isoelectrico|paro cardiorrespiratorio|paro cardiaco)\b/.test(txt) ||
    vitalSigns?.heartRate === 0 ||
    (vitalSigns?.bloodPressure || '').startsWith('0/') ||
    hrMatch?.[1] === '0';

  if (isAsystole) {
    return {
      hr: 0,
      isAsystole: true,
      isAFib: false,
      isParoxysmalMix: false,
      isSVT: false,
      isCompleteAVBlock: false,
      isAnteriorSTEMI: false,
      isExtensiveAnterior: false,
      isInferiorSTEMI: false,
      isLateralSTEMI: false,
      stElevationMv: 0,
      isStDepression: false,
      isPericarditis: false,
      isPeakedT: false,
      isS1Q3T3: false,
      isInvertedT: false,
      invertedTLeads: null,
      isLVH: false,
      isAlternans: false,
      isLongQT: false,
      isFlatT: false,
    };
  }

  const parsedHr = hrMatch
    ? Number(hrMatch[1])
    : typeof vitalSigns?.heartRate === 'number'
      ? vitalSigns.heartRate
      : 76;
  const hr = Math.max(24, Math.min(210, parsedHr));

  const stMmMatch = txtNoNeg.match(/(?:elevacion|supradesnivel)[^.,;]{0,35}?(\d(?:\.\d)?)\s*mm/);
  const stElevationMv = stMmMatch ? Math.min(0.65, Math.max(0.25, Number(stMmMatch[1]) * 0.1)) : 0.42;

  const isParoxysmalMix = /taquicardia\s+sinusal.*fibrilacion\s+auricular\s+paroxistica/.test(txtNoNeg);
  const isAFib =
    hasAbsentP ||
    isParoxysmalMix ||
    /fibrilatori|r-r\s+completamente\s+irregulares|irregularmente\s+irregulares|fibrilacion\s+auricular/.test(txtNoNeg);

  const isSVT = !isAFib && /taquicardia\s+supraventricular|\btpsv\b|reentrada\s+nodal/.test(txtNoNeg);
  const isCompleteAVBlock = /bloqueo\s+av\s+(?:completo|de\s+tercer\s+grado)|disociacion\s+av/.test(txtNoNeg);

  const isPericarditis =
    /silla de montar|concava[^.,;]*st|descenso del segmento pr|elevacion difusa/.test(txtNoNeg);

  const isAnteriorSTEMI =
    !isPericarditis &&
    (/(?:elevacion|supradesnivel)[^.,;]*st[^.,;]*(?:v1|v2|v3|v4|cara anterior|anteroseptal|extens)/.test(txtNoNeg) ||
      /(?:v1|v2|v3|v4|cara anterior)[^.,;]*(?:elevacion|supradesnivel)/.test(txtNoNeg) ||
      /iamcest\s+anterior/.test(txtNoNeg));

  const isExtensiveAnterior = isAnteriorSTEMI && /(?:v5|v6|extens)/.test(txtNoNeg);

  const isInferiorSTEMI =
    !isPericarditis &&
    (/(?:elevacion|supradesnivel)[^.,;]*st[^.,;]*(?:dii\b|diii\b|avf|cara inferior|inferiores)/.test(txtNoNeg) ||
      /(?:dii\b|diii\b|avf|cara inferior)[^.,;]*(?:elevacion|supradesnivel)/.test(txtNoNeg) ||
      /iamcest\s+inferior/.test(txtNoNeg));

  const isLateralSTEMI =
    !isPericarditis &&
    !isAnteriorSTEMI &&
    (/(?:elevacion|supradesnivel)[^.,;]*st[^.,;]*(?:v5|v6|\bdi\b|avl|cara lateral)/.test(txtNoNeg) ||
      /iamcest\s+lateral/.test(txtNoNeg));

  const isAnySTEMI = isAnteriorSTEMI || isInferiorSTEMI || isLateralSTEMI;

  // Subendocardial ischemia / NSTEMI ST depression (ignore mirror changes of STEMI)
  const isStDepression =
    !isAnySTEMI &&
    !isPericarditis &&
    /(?:descenso|infradesnivel|depresion)[^.,;]*st|lesion\s+subendocardica|iamsest|scasest/.test(txtNoNeg);

  const isPeakedT =
    /ondas?\s*t\s*(?:altas|picudas)|t\s+picudas|hiperkalemia/.test(txtNoNeg);

  const isS1Q3T3 = /s1q3t3|onda s profunda en di|onda q y t negativa en diii/.test(txtNoNeg);

  const hasInvertedTMention =
    /inversion\s+de\s+(?:la\s+)?onda\s+t|ondas?\s+t\s+(?:invertidas?|negativas?)|isquemia\s+subepicardica/.test(txtNoNeg);

  let invertedTLeads: EcgProfile['invertedTLeads'] = null;
  if (hasInvertedTMention && !isS1Q3T3) {
    if (/v1|v2|v3|anterior/.test(txtNoNeg)) invertedTLeads = 'anterior';
    else if (/v4|v5|v6|lateral|avl/.test(txtNoNeg)) invertedTLeads = 'lateral';
    else if (/dii|diii|avf|inferior/.test(txtNoNeg)) invertedTLeads = 'inferior';
    else invertedTLeads = 'diffuse';
  }

  const isLVH = /hipertrofia\s+ventricular\s+izquierda|sokolow|sobrecarga\s+sistolica|hipertrofia.*sobrecarga/.test(
    txtNoNeg
  );

  return {
    hr,
    isAsystole: false,
    isAFib,
    isParoxysmalMix,
    isSVT,
    isCompleteAVBlock,
    isAnteriorSTEMI,
    isExtensiveAnterior,
    isInferiorSTEMI,
    isLateralSTEMI,
    stElevationMv,
    isStDepression,
    isPericarditis,
    isPeakedT,
    isS1Q3T3,
    isInvertedT: hasInvertedTMention && !isS1Q3T3,
    invertedTLeads,
    isLVH,
    isAlternans: /bajo voltaje|alternancia electrica/.test(txtNoNeg),
    isLongQT: /qtc[^.,;]*prolongado|465 ms|470 ms|480 ms|490 ms|500 ms/.test(txtNoNeg),
    isFlatT: /onda\s*t[^.,;]*aplanada/.test(txtNoNeg) && !hasInvertedTMention,
  };
}

type LeadName = 'DI' | 'DII' | 'DIII' | 'aVR' | 'aVL' | 'aVF' | 'V1' | 'V2' | 'V3' | 'V4' | 'V5' | 'V6';

const LEAD_GRID: LeadName[][] = [
  ['DI', 'aVR', 'V1', 'V4'],
  ['DII', 'aVL', 'V2', 'V5'],
  ['DIII', 'aVF', 'V3', 'V6'],
];

function gaussian(x: number, mu: number, sigma: number): number {
  const z = (x - mu) / sigma;
  return Math.exp(-0.5 * z * z);
}

function sampleEcgLeadMv(
  phaseSec: number,
  beatIndex: number,
  lead: LeadName,
  p: EcgProfile,
  omitPWave = false
): number {
  const leadScale: Record<LeadName, { pAmp: number; qAmp: number; rAmp: number; sAmp: number; tAmp: number }> = {
    DI: { pAmp: 0.11, qAmp: -0.05, rAmp: 0.72, sAmp: -0.1, tAmp: 0.22 },
    DII: { pAmp: 0.16, qAmp: -0.06, rAmp: 0.98, sAmp: -0.12, tAmp: 0.28 },
    DIII: { pAmp: 0.08, qAmp: -0.04, rAmp: 0.42, sAmp: -0.14, tAmp: 0.12 },
    aVR: { pAmp: -0.13, qAmp: -0.58, rAmp: 0.12, sAmp: -0.25, tAmp: -0.24 },
    aVL: { pAmp: 0.06, qAmp: -0.05, rAmp: 0.45, sAmp: -0.1, tAmp: 0.14 },
    aVF: { pAmp: 0.12, qAmp: -0.05, rAmp: 0.68, sAmp: -0.12, tAmp: 0.22 },
    V1: { pAmp: 0.06, qAmp: 0, rAmp: 0.22, sAmp: -0.82, tAmp: -0.12 },
    V2: { pAmp: 0.08, qAmp: 0, rAmp: 0.45, sAmp: -0.78, tAmp: 0.26 },
    V3: { pAmp: 0.09, qAmp: -0.02, rAmp: 0.85, sAmp: -0.45, tAmp: 0.34 },
    V4: { pAmp: 0.1, qAmp: -0.05, rAmp: 1.15, sAmp: -0.22, tAmp: 0.35 },
    V5: { pAmp: 0.1, qAmp: -0.06, rAmp: 1.02, sAmp: -0.12, tAmp: 0.28 },
    V6: { pAmp: 0.09, qAmp: -0.05, rAmp: 0.82, sAmp: -0.08, tAmp: 0.24 },
  };

  const base = { ...leadScale[lead] };
  let stShift = 0;
  let prShift = 0;
  const tCenter = p.isLongQT ? 0.38 : 0.31;
  const tSigma = p.isPeakedT ? 0.022 : 0.046;
  const qrsWidth = p.isPeakedT || p.isCompleteAVBlock ? 1.25 : 1.0;
  const prOffset = p.isPeakedT ? -0.032 : 0;

  if (p.isAlternans) {
    const mult = beatIndex % 2 === 0 ? 0.42 : 0.21;
    base.rAmp *= mult;
    base.sAmp *= mult;
    base.qAmp *= mult;
  }

  // LVH Voltage + Strain
  if (p.isLVH) {
    if (lead === 'V1' || lead === 'V2') {
      base.sAmp = -1.65;
      base.rAmp = 0.15;
    } else if (lead === 'V5' || lead === 'V6') {
      base.rAmp = 2.05;
      stShift = -0.14;
      base.tAmp = -0.28;
    } else if (lead === 'DI' || lead === 'aVL') {
      base.rAmp = 1.25;
      stShift = -0.1;
      base.tAmp = -0.2;
    }
  }

  // Anterior / Extensive STEMI (convex Pardee wave + mirror depression in II/III/aVF)
  if (p.isAnteriorSTEMI) {
    const antLeads: LeadName[] = p.isExtensiveAnterior
      ? ['V1', 'V2', 'V3', 'V4', 'V5', 'V6']
      : ['V1', 'V2', 'V3', 'V4'];
    if (antLeads.includes(lead)) {
      stShift = lead === 'V2' || lead === 'V3' ? p.stElevationMv : p.stElevationMv * 0.72;
      base.sAmp = 0;
      base.qAmp = lead === 'V1' || lead === 'V2' ? -0.18 : base.qAmp;
      base.tAmp = Math.max(base.tAmp, 0.48);
    } else if (lead === 'DII' || lead === 'DIII' || lead === 'aVF') {
      stShift = -0.17;
    }
  }

  // Inferior STEMI (DII, DIII, aVF + mirror depression in DI, aVL)
  if (p.isInferiorSTEMI) {
    if (lead === 'DII' || lead === 'DIII' || lead === 'aVF') {
      stShift = p.stElevationMv * 0.85;
      base.sAmp = 0;
      base.tAmp = 0.42;
    } else if (lead === 'DI' || lead === 'aVL') {
      stShift = -0.17;
    }
  }

  // Lateral STEMI
  if (p.isLateralSTEMI) {
    if (lead === 'DI' || lead === 'aVL' || lead === 'V5' || lead === 'V6') {
      stShift = p.stElevationMv * 0.8;
      base.sAmp = 0;
      base.tAmp = 0.4;
    } else if (lead === 'DII' || lead === 'DIII' || lead === 'aVF') {
      stShift = -0.15;
    }
  }

  // Subendocardial ischemia / NSTEMI ST depression
  if (p.isStDepression && (lead === 'V3' || lead === 'V4' || lead === 'V5' || lead === 'V6' || lead === 'DI' || lead === 'aVL')) {
    stShift = -0.22;
    base.tAmp = -0.18;
  }

  // Pericarditis (diffuse concave ST elevation + PR depression, opposite in aVR)
  if (p.isPericarditis) {
    if (lead !== 'aVR' && lead !== 'V1') {
      stShift = 0.24;
      prShift = -0.075;
    } else if (lead === 'aVR') {
      prShift = 0.075;
      stShift = -0.14;
    }
  }

  // Hyperkalemia Peaked T waves
  if (p.isPeakedT && (lead === 'V2' || lead === 'V3' || lead === 'V4' || lead === 'V5')) {
    base.tAmp = 0.92;
  }

  // Pulmonary Embolism S1Q3T3 + anterior precordial T inversion
  if (p.isS1Q3T3) {
    if (lead === 'DI') base.sAmp = -0.52;
    if (lead === 'DIII') {
      base.qAmp = -0.34;
      base.tAmp = -0.28;
    }
    if (lead === 'V1' || lead === 'V2' || lead === 'V3') {
      base.tAmp = -0.34;
    }
  }

  // Explicit T-wave inversion (never flattened!)
  if (p.isInvertedT && lead !== 'aVR') {
    const matchTarget =
      p.invertedTLeads === 'diffuse' ||
      (p.invertedTLeads === 'anterior' && (lead === 'V1' || lead === 'V2' || lead === 'V3')) ||
      (p.invertedTLeads === 'lateral' && (lead === 'V4' || lead === 'V5' || lead === 'V6' || lead === 'DI' || lead === 'aVL')) ||
      (p.invertedTLeads === 'inferior' && (lead === 'DII' || lead === 'DIII' || lead === 'aVF'));
    if (matchTarget) {
      base.tAmp = -0.34;
    }
  }

  if (p.isFlatT && lead !== 'aVR') {
    base.tAmp *= 0.24;
  }

  const rCenter = 0.18;
  const pCenter = 0.07 + prOffset;

  let v = 0;

  // P wave, f-waves, SVT, or Complete AV Block
  if (p.isAFib) {
    v +=
      0.038 * Math.sin(2 * Math.PI * 6.5 * (phaseSec + beatIndex * 0.17)) +
      0.026 * Math.cos(2 * Math.PI * 9.2 * (phaseSec + beatIndex * 0.31));
  } else if (!omitPWave && !p.isSVT) {
    v += base.pAmp * gaussian(phaseSec, pCenter, 0.019);
    if (prShift !== 0 && phaseSec > pCenter + 0.015 && phaseSec < rCenter - 0.025) {
      v += prShift;
    }
  }

  // QRS complex
  v += base.qAmp * gaussian(phaseSec, rCenter - 0.022 * qrsWidth, 0.008 * qrsWidth);
  v += base.rAmp * gaussian(phaseSec, rCenter, 0.011 * qrsWidth);
  v += base.sAmp * gaussian(phaseSec, rCenter + 0.022 * qrsWidth, 0.009 * qrsWidth);

  // ST segment shift (convex dome for STEMI, concave for pericarditis, horizontal/downsloping for depression)
  if (stShift !== 0) {
    const jStart = rCenter + 0.024 * qrsWidth;
    const tEnd = tCenter + 0.032;
    if (phaseSec >= jStart && phaseSec <= tEnd) {
      const progress = (phaseSec - jStart) / (tEnd - jStart);
      let envelope: number;
      if (p.isPericarditis) {
        // Concave upward: stays lower right after J-point, curves smoothly up into T
        envelope = 0.48 + 0.52 * Math.pow(Math.sin(Math.PI * progress * 0.78), 1.6);
      } else if (stShift > 0) {
        // Convex Pardee dome: high plateau directly from J-point
        envelope = 0.85 + 0.15 * Math.sin(Math.PI * progress);
      } else {
        // Horizontal/downsloping depression
        envelope = 0.82 * Math.sin(Math.PI * (0.15 + 0.7 * progress));
      }
      v += stShift * envelope;
    }
  }

  // T wave
  v += base.tAmp * gaussian(phaseSec, tCenter, tSigma);

  return v;
}

function getStShiftForLead(lead: LeadName, p: EcgProfile): number {
  if (p.isAnteriorSTEMI) {
    const antLeads: LeadName[] = p.isExtensiveAnterior ? ['V1', 'V2', 'V3', 'V4', 'V5', 'V6'] : ['V1', 'V2', 'V3', 'V4'];
    if (antLeads.includes(lead)) return lead === 'V2' || lead === 'V3' ? p.stElevationMv : p.stElevationMv * 0.72;
    if (lead === 'DII' || lead === 'DIII' || lead === 'aVF') return -0.17;
  }
  if (p.isInferiorSTEMI) {
    if (lead === 'DII' || lead === 'DIII' || lead === 'aVF') return p.stElevationMv * 0.85;
    if (lead === 'DI' || lead === 'aVL') return -0.17;
  }
  if (p.isLateralSTEMI) {
    if (lead === 'DI' || lead === 'aVL' || lead === 'V5' || lead === 'V6') return p.stElevationMv * 0.8;
    if (lead === 'DII' || lead === 'DIII' || lead === 'aVF') return -0.15;
  }
  if (p.isStDepression && (lead === 'V3' || lead === 'V4' || lead === 'V5' || lead === 'V6' || lead === 'DI' || lead === 'aVL')) {
    return -0.22;
  }
  if (p.isPericarditis) {
    if (lead !== 'aVR' && lead !== 'V1') return 0.24;
    if (lead === 'aVR') return -0.14;
  }
  if (p.isLVH && (lead === 'V5' || lead === 'V6')) return -0.14;
  return 0;
}

function buildLeadPolylinePoints(
  lead: LeadName,
  profile: EcgProfile,
  durationSec: number,
  x0: number,
  yBaseline: number,
  pxPerSec: number,
  pxPerMv: number
): string {
  if (profile.isAsystole || profile.hr <= 0) {
    const xEnd = x0 + durationSec * pxPerSec;
    return `${x0.toFixed(1)},${yBaseline.toFixed(1)} ${xEnd.toFixed(1)},${yBaseline.toFixed(1)}`;
  }

  const baseRR = 60 / profile.hr;
  const afibFactors = [0.64, 1.08, 0.56, 1.24, 0.72, 0.94, 0.58, 1.15, 0.81, 1.02, 0.66, 1.12];
  const beatStarts: number[] = [0.08];
  let idx = 0;
  while (beatStarts[beatStarts.length - 1] < durationSec + 0.6) {
    const rr = profile.isAFib ? baseRR * afibFactors[idx % afibFactors.length] : baseRR;
    beatStarts.push(beatStarts[beatStarts.length - 1] + rr);
    idx += 1;
  }

  // Independent atrial P waves for complete AV block (atrial rate ~82 bpm)
  const pStarts: number[] = [];
  if (profile.isCompleteAVBlock) {
    for (let pt = 0.05; pt < durationSec + 0.5; pt += 60 / 82) {
      pStarts.push(pt);
    }
  }

  const dt = 0.007;
  const pts: string[] = [];
  for (let t = 0; t <= durationSec; t += dt) {
    let mv = 0;
    for (let b = 0; b < beatStarts.length; b++) {
      const localT = t - beatStarts[b] + 0.18;
      if (localT >= 0 && localT <= 0.56) {
        mv += sampleEcgLeadMv(localT, b, lead, profile, profile.isCompleteAVBlock);
      }
    }
    if (profile.isCompleteAVBlock) {
      const pAmp = lead === 'aVR' ? -0.13 : lead === 'DII' ? 0.16 : 0.1;
      for (const pt of pStarts) {
        mv += pAmp * gaussian(t, pt, 0.019);
      }
    }
    const px = x0 + t * pxPerSec;
    const py = yBaseline - mv * pxPerMv;
    pts.push(`${px.toFixed(1)},${py.toFixed(1)}`);
  }
  return pts.join(' ');
}

const EcgTwelveLeadViewer: React.FC<{
  study: ComplementaryStudy;
  vitalSigns?: VitalSigns;
}> = ({ study, vitalSigns }) => {
  const profile = useMemo(() => parseEcgProfile(study, vitalSigns), [study, vitalSigns]);
  const [darkMonitor, setDarkMonitor] = useState(false);
  const [showBaselineGuides, setShowBaselineGuides] = useState(true);
  const [zoomLead, setZoomLead] = useState<LeadName | null>(null);

  const W = 1000;
  const H = 560;
  const colWidth = 230;
  const startX = 48;
  const rowY = [92, 222, 352];
  const pxPerSec = 100; // 25 mm/s -> 100 px/sec (4px = 1mm)
  const pxPerMv = 40; // 10 mm/mV -> 40 px/mV (4px = 1mm)

  const gridBg = darkMonitor ? '#040C17' : '#FFFDF8';
  const minorGrid = darkMonitor ? 'rgba(30, 58, 95, 0.42)' : 'rgba(235, 136, 136, 0.28)';
  const majorGrid = darkMonitor ? 'rgba(56, 189, 248, 0.28)' : 'rgba(220, 88, 88, 0.55)';
  const traceStroke = darkMonitor ? '#22C55E' : '#111827';
  const labelFill = darkMonitor ? '#7DD3FC' : '#991B1B';
  const baselineColor = darkMonitor ? 'rgba(56, 189, 248, 0.45)' : 'rgba(37, 99, 235, 0.45)';

  const zoomStShift = zoomLead ? getStShiftForLead(zoomLead, profile) : 0;

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex flex-wrap items-center gap-3 text-blue-200 font-mono tabular-nums">
          <span className="font-sans font-bold text-white flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-sky-400" />
            Trazado Electrocardiográfico de 12 Derivaciones
          </span>
          {profile.isAsystole ? (
            <span className="text-[11px] font-bold text-rose-300 bg-rose-950/70 border border-rose-500/70 px-2 py-0.5 rounded">
              25 mm/s · 10 mm/mV · FC 0 lpm (ASISTOLIA)
            </span>
          ) : (
            <span className="text-[11px] text-blue-300/80">25 mm/s · 10 mm/mV · FC ~{profile.hr} lpm</span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {zoomLead && (
            <button
              type="button"
              onClick={() => setZoomLead(null)}
              className="px-2.5 py-1 rounded-md bg-[#0D2149] border border-blue-700/70 text-[11px] text-blue-100 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <Minimize2 className="w-3 h-3" />
              <span>Cerrar Zoom ({zoomLead})</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowBaselineGuides((prev) => !prev)}
            className="px-2.5 py-1 rounded-md bg-[#040B1B] border border-blue-800/70 text-[11px] text-blue-200 hover:text-white flex items-center gap-1.5 cursor-pointer"
          >
            <Ruler className="w-3.5 h-3.5 text-sky-300" />
            <span>{showBaselineGuides ? 'Ocultar Línea TP' : 'Guía Isoeléctrica TP'}</span>
          </button>
          <button
            type="button"
            onClick={() => setDarkMonitor((prev) => !prev)}
            className="px-2.5 py-1 rounded-md bg-[#040B1B] border border-blue-800/70 text-[11px] text-blue-200 hover:text-white flex items-center gap-1.5 cursor-pointer"
          >
            {darkMonitor ? <Sun className="w-3.5 h-3.5 text-amber-300" /> : <Moon className="w-3.5 h-3.5 text-sky-300" />}
            <span>{darkMonitor ? 'Papel Milimetrado' : 'Monitor Oscuro'}</span>
          </button>
        </div>
      </div>

      {/* Zoomed Single Lead Inspector */}
      {zoomLead && (
        <div className="rounded-xl overflow-hidden border border-sky-500/70 shadow-lg">
          <div className="px-3 py-1.5 bg-[#040B1B] border-b border-blue-900/70 flex flex-wrap items-center justify-between gap-2 text-[11px]">
            <span className="font-bold text-sky-300">
              Derivación Ampliada: {zoomLead} (25 mm/s · 10 mm/mV)
            </span>
            <div className="flex items-center gap-3 text-blue-300/90 font-mono">
              {Math.abs(zoomStShift) >= 0.08 && (
                <span>
                  Desnivel J-ST: {zoomStShift > 0 ? '+' : ''}
                  {(zoomStShift * 10).toFixed(1)} mm ({zoomStShift > 0 ? '+' : ''}
                  {zoomStShift.toFixed(2)} mV)
                </span>
              )}
              <span>1 cuadro grande = 200 ms / 5 mm (0.5 mV)</span>
            </div>
          </div>
          <svg viewBox="0 0 1000 190" className="w-full h-auto block" style={{ background: gridBg }}>
            <defs>
              <pattern id="ecg-zoom-minor" width="4" height="4" patternUnits="userSpaceOnUse">
                <path d="M 4 0 L 0 0 0 4" fill="none" stroke={minorGrid} strokeWidth="0.6" />
              </pattern>
              <pattern id="ecg-zoom-major" width="20" height="20" patternUnits="userSpaceOnUse">
                <rect width="20" height="20" fill="url(#ecg-zoom-minor)" />
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke={majorGrid} strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="1000" height="190" fill="url(#ecg-zoom-major)" />

            {/* Isoelectric TP baseline & +/-0.5mV calibration references */}
            {showBaselineGuides && (
              <g>
                <line x1="56" y1="110" x2="990" y2="110" stroke={baselineColor} strokeWidth="1.2" strokeDasharray="5,4" />
                <line x1="56" y1="82" x2="990" y2="82" stroke={baselineColor} strokeOpacity="0.45" strokeWidth="0.9" strokeDasharray="2,4" />
                <line x1="56" y1="138" x2="990" y2="138" stroke={baselineColor} strokeOpacity="0.45" strokeWidth="0.9" strokeDasharray="2,4" />
                <text x="986" y="106" fill={labelFill} fontSize="10" fontFamily="monospace" textAnchor="end" fontWeight="700">
                  Basal TP (0 mV)
                </text>
                <text x="986" y="78" fill={labelFill} fontSize="9.5" fontFamily="monospace" textAnchor="end" opacity="0.8">
                  +0.5 mV (+5 mm)
                </text>
                <text x="986" y="149" fill={labelFill} fontSize="9.5" fontFamily="monospace" textAnchor="end" opacity="0.8">
                  -0.5 mV (-5 mm)
                </text>
              </g>
            )}

            {/* 1mV calibration pulse (56 px = 1.0 mV at zoomed scale) */}
            <polyline points="14,110 22,110 22,54 44,54 44,110 52,110" fill="none" stroke={traceStroke} strokeWidth="1.8" />
            <polyline
              points={buildLeadPolylinePoints(zoomLead, profile, 6.2, 60, 110, 145, 56)}
              fill="none"
              stroke={traceStroke}
              strokeWidth="2.1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}

      {/* Main 12-Lead Standard ECG Sheet */}
      <div className="rounded-xl overflow-x-auto border border-blue-900/70 shadow-inner">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[680px] h-auto block" style={{ background: gridBg }}>
          <defs>
            <pattern id="ecg-minor" width="4" height="4" patternUnits="userSpaceOnUse">
              <path d="M 4 0 L 0 0 0 4" fill="none" stroke={minorGrid} strokeWidth="0.55" />
            </pattern>
            <pattern id="ecg-major" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect width="20" height="20" fill="url(#ecg-minor)" />
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke={majorGrid} strokeWidth="0.95" />
            </pattern>
          </defs>
          <rect width={W} height={H} fill="url(#ecg-major)" />

          {/* Row Calibration Pulses (1 mV = 40 px) */}
          {[...rowY, 478].map((yb, rIdx) => (
            <polyline
              key={`cal-${rIdx}`}
              points={`14,${yb} 22,${yb} 22,${yb - 40} 34,${yb - 40} 34,${yb} 42,${yb}`}
              fill="none"
              stroke={traceStroke}
              strokeWidth="1.4"
            />
          ))}

          {/* 4x3 Lead Grid */}
          {LEAD_GRID.map((rowLeads, rIdx) =>
            rowLeads.map((lead, cIdx) => {
              const x0 = startX + cIdx * colWidth;
              const y0 = rowY[rIdx];
              const polyPts = buildLeadPolylinePoints(lead, profile, 2.15, x0 + 6, y0, pxPerSec, pxPerMv);
              const leadShift = getStShiftForLead(lead, profile);

              return (
                <g key={lead} onClick={() => setZoomLead(lead)} className="cursor-pointer group">
                  <rect
                    x={x0}
                    y={y0 - 65}
                    width={colWidth - 8}
                    height={118}
                    fill="transparent"
                    className="group-hover:stroke-sky-500/70"
                    strokeWidth="1"
                    rx="4"
                  />
                  {cIdx > 0 && (
                    <line
                      x1={x0}
                      y1={y0 - 24}
                      x2={x0}
                      y2={y0 + 18}
                      stroke={majorGrid}
                      strokeWidth="1.2"
                      strokeDasharray="3,2"
                    />
                  )}
                  {showBaselineGuides && (
                    <line
                      x1={x0 + 6}
                      y1={y0}
                      x2={x0 + colWidth - 10}
                      y2={y0}
                      stroke={baselineColor}
                      strokeWidth="0.9"
                      strokeDasharray="4,3"
                    />
                  )}
                  <text x={x0 + 8} y={y0 - 44} fill={labelFill} fontSize="13" fontWeight="700" fontFamily="monospace">
                    {lead}
                  </text>
                  {/* Objective physical ST measurement badge when guide ON & significant shift */}
                  {showBaselineGuides && Math.abs(leadShift) >= 0.1 && (
                    <text
                      x={x0 + colWidth - 14}
                      y={y0 - 44}
                      fill={darkMonitor ? '#38BDF8' : '#1D4ED8'}
                      fontSize="10"
                      fontWeight="700"
                      fontFamily="monospace"
                      textAnchor="end"
                    >
                      ST {leadShift > 0 ? '+' : ''}
                      {(leadShift * 10).toFixed(1)}mm
                    </text>
                  )}
                  <polyline
                    points={polyPts}
                    fill="none"
                    stroke={traceStroke}
                    strokeWidth="1.65"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              );
            })
          )}

          {/* Bottom Rhythm Strip: DII Largo */}
          <g onClick={() => setZoomLead('DII')} className="cursor-pointer">
            {showBaselineGuides && (
              <line
                x1={startX + 6}
                y1={478}
                x2={W - 22}
                y2={478}
                stroke={baselineColor}
                strokeWidth="0.95"
                strokeDasharray="4,3"
              />
            )}
            <text x={startX + 8} y={434} fill={labelFill} fontSize="13" fontWeight="700" fontFamily="monospace">
              DII (Tira de Ritmo)
            </text>
            <polyline
              points={buildLeadPolylinePoints('DII', profile, 9.2, startX + 6, 478, pxPerSec, pxPerMv)}
              fill="none"
              stroke={traceStroke}
              strokeWidth="1.65"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>

          <text x={startX} y={544} fill={labelFill} fontSize="11" fontFamily="monospace">
            25 mm/s   10 mm/mV   Filtro: 0.05–150 Hz   (Línea azul discontinua = Basal isoeléctrica TP · Clic para ampliar)
          </text>
        </svg>
      </div>
      <div className="flex items-center justify-end text-[11px] text-blue-300/80 gap-1">
        <Maximize2 className="w-3 h-3" />
        <span>Haga clic sobre cualquier derivación (DI–V6) para medir amplitudes y segmento ST ampliados</span>
      </div>
    </div>
  );
};

// ---------- HOLTER 24H ECG VIEWER (HR TREND + 3-CHANNEL STRIP) ----------

const HolterEcgViewer: React.FC<{ study: ComplementaryStudy; vitalSigns?: VitalSigns }> = ({
  study,
  vitalSigns,
}) => {
  const txt = norm(`${study.result} ${study.interpretation || ''}`);
  const txtNoNeg = stripMedicalNegations(txt);

  const minHrMatch = txt.match(/(?:fc\s+minima|minima)\s*(?:de|:)?\s*(\d{2,3})/);
  const meanHrMatch = txt.match(/(?:media(?:\s+de)?|entre\s+\d+\s+y\s+\d+|fc\s+media)\s*(\d{2,3})/);
  const maxHrMatch = txt.match(/(?:maxima|hasta)\s*(?:de|:)?\s*(\d{2,3})/);
  const rangeMatch = txt.match(/entre\s+(\d{2,3})\s+y\s+(\d{2,3})\s*lpm/);

  const isParoxysmal = /paroxistic|episodios\s+intermitentes|alternando\s+con\s+ritmo\s+sinusal/.test(txtNoNeg);
  const isAFib =
    study.isAbnormal &&
    /fibrilacion\s+auricular|taquiarritmia\s+supraventricular|ondas?\s+f/.test(txtNoNeg);
  const isEctopy = study.isAbnormal && /ectopia\s+ventricular|extrasistoles\s+ventriculares/.test(txtNoNeg);
  const isPause = study.isAbnormal && /pausa|bloqueo\s+av/.test(txtNoNeg);

  const minHr = minHrMatch ? Number(minHrMatch[1]) : isAFib ? 62 : 54;
  const maxHr = maxHrMatch
    ? Number(maxHrMatch[1])
    : rangeMatch
      ? Number(rangeMatch[2])
      : isAFib
        ? 148
        : 118;
  const meanHr = rangeMatch
    ? Math.round((Number(rangeMatch[1]) + Number(rangeMatch[2])) / 2)
    : meanHrMatch
      ? Number(meanHrMatch[1])
      : isAFib
        ? 106
        : vitalSigns?.heartRate || 74;

  const profile: EcgProfile = {
    hr: vitalSigns?.heartRate === 0 ? 0 : isAFib ? Math.max(96, meanHr) : meanHr,
    isAsystole: vitalSigns?.heartRate === 0,
    isAFib: isAFib && !isParoxysmal ? true : false,
    isParoxysmalMix: false,
    isSVT: false,
    isCompleteAVBlock: false,
    isAnteriorSTEMI: false,
    isExtensiveAnterior: false,
    isInferiorSTEMI: false,
    isLateralSTEMI: false,
    stElevationMv: 0,
    isStDepression: false,
    isPericarditis: false,
    isPeakedT: false,
    isS1Q3T3: false,
    isInvertedT: false,
    invertedTLeads: null,
    isLVH: false,
    isAlternans: false,
    isLongQT: false,
    isFlatT: false,
  };

  // Build custom paroxysmal/ectopic/sinus 3-channel event strip
  const buildHolterStrip = (lead: LeadName, yBase: number) => {
    const durationSec = 8.4;
    const x0 = 24;
    const pxPerSec = 100;
    const pxPerMv = 34;

    if (!isParoxysmal && !isEctopy && !isPause) {
      return buildLeadPolylinePoints(lead, profile, durationSec, x0, yBase, pxPerSec, pxPerMv);
    }

    const baseRR = 60 / Math.max(60, meanHr);
    const afibRR = 60 / Math.max(108, maxHr - 15);
    const afibFactors = [0.64, 1.08, 0.56, 1.24, 0.72, 0.94, 0.58, 1.15];
    const beats: Array<{ t: number; afib: boolean; pvc: boolean }> = [];

    let curT = 0.14;
    let idx = 0;
    while (curT < durationSec + 0.5) {
      const inParoxysm = isParoxysmal && curT >= 2.3 && curT <= 6.2;
      const pvcHere = isEctopy && (idx === 3 || idx === 7);
      beats.push({ t: curT, afib: inParoxysm, pvc: pvcHere });

      if (isPause && idx === 3) {
        curT += 2.25; // explicit 2.25s pause
      } else if (inParoxysm) {
        curT += afibRR * afibFactors[idx % afibFactors.length];
      } else if (pvcHere) {
        curT += baseRR * 1.38; // compensatory pause after PVC
      } else if (isEctopy && (idx === 2 || idx === 6)) {
        curT += baseRR * 0.58; // premature coupling interval
      } else {
        curT += baseRR;
      }
      idx += 1;
    }

    const pts: string[] = [];
    for (let t = 0; t <= durationSec; t += 0.008) {
      let mv = 0;
      for (let b = 0; b < beats.length; b++) {
        const beat = beats[b];
        const localT = t - beat.t + 0.18;
        if (localT >= 0 && localT <= 0.56) {
          if (beat.pvc) {
            // Wide bizarre PVC morphology + discordant T wave
            mv += 1.05 * gaussian(localT, 0.18, 0.028) - 0.55 * gaussian(localT, 0.24, 0.025) - 0.36 * gaussian(localT, 0.36, 0.055);
          } else {
            mv += sampleEcgLeadMv(localT, b, lead, { ...profile, isAFib: beat.afib }, false);
          }
        }
      }
      pts.push(`${(x0 + t * pxPerSec).toFixed(1)},${(yBase - mv * pxPerMv).toFixed(1)}`);
    }
    return pts.join(' ');
  };

  // 24h Hourly HR trend values matching min/mean/max
  const hourlyHr = Array.from({ length: 25 }, (_, h) => {
    const clockHour = (8 + h) % 24;
    const isNight = clockHour >= 22 || clockHour < 7;
    if (isParoxysmal && (h === 4 || h === 15 || h === 20)) {
      return maxHr;
    }
    if (isNight) {
      return Math.round(minHr + ((h % 3) * (meanHr - minHr)) * 0.25);
    }
    const dayWave = Math.sin(((h % 12) / 12) * Math.PI);
    return Math.round(meanHr + dayWave * (maxHr - meanHr) * (isParoxysmal ? 0.35 : 0.65));
  });

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="font-bold text-white flex items-center gap-1.5">
          <Activity className="w-4 h-4 text-sky-400" />
          Monitoreo Holter ECG 24 Horas (Tira de Evento + Tendencia FC)
        </span>
        <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-blue-200">
          <span>FC Mín: {minHr} lpm</span>
          <span>Media: {meanHr} lpm</span>
          <span>Máx: {maxHr} lpm</span>
        </div>
      </div>

      {/* 24h Heart Rate Trend Graph */}
      <div className="bg-[#040B1B] border border-blue-900/70 rounded-xl p-2.5">
        <div className="text-[10px] font-semibold text-blue-300/90 uppercase tracking-wider mb-1">
          Perfil Circadiano de Frecuencia Cardíaca (24 Horas)
        </div>
        <svg viewBox="0 0 900 105" className="w-full h-auto block">
          {/* Night Sleep Shading (hours index 14..22 => 22:00..06:00) */}
          <rect x={44 + (14 / 24) * 830} y="8" width={(8 / 24) * 830} height="76" fill="rgba(30, 58, 138, 0.25)" />
          {/* 60-100 bpm reference zone */}
          {[60, 100, 140].map((hrRef) => {
            const y = 84 - ((hrRef - 30) / 150) * 76;
            return (
              <g key={hrRef}>
                <line x1="44" y1={y} x2="874" y2={y} stroke="#1E293B" strokeDasharray="3,3" strokeWidth="1" />
                <text x="38" y={y + 3} fill="#94A3B8" fontSize="9" textAnchor="end" fontFamily="monospace">
                  {hrRef}
                </text>
              </g>
            );
          })}
          <polyline
            points={hourlyHr
              .map((val, i) => {
                const x = 44 + (i / 24) * 830;
                const y = Math.max(10, Math.min(82, 84 - ((val - 30) / 150) * 76));
                return `${x.toFixed(1)},${y.toFixed(1)}`;
              })
              .join(' ')}
            fill="none"
            stroke="#38BDF8"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {[0, 4, 8, 12, 16, 20, 24].map((h) => {
            const x = 44 + (h / 24) * 830;
            const lbl = `${String((8 + h) % 24).padStart(2, '0')}:00`;
            return (
              <text key={h} x={x} y="98" fill="#94A3B8" fontSize="9" textAnchor="middle" fontFamily="monospace">
                {lbl}
              </text>
            );
          })}
        </svg>
      </div>

      {/* 3-Channel Event Strip */}
      <div className="rounded-xl overflow-x-auto border border-blue-900/70">
        <svg viewBox="0 0 900 280" className="w-full min-w-[600px] h-auto block" style={{ background: '#FFFDF8' }}>
          <defs>
            <pattern id="holter-minor" width="4" height="4" patternUnits="userSpaceOnUse">
              <path d="M 4 0 L 0 0 0 4" fill="none" stroke="rgba(235, 136, 136, 0.25)" strokeWidth="0.5" />
            </pattern>
            <pattern id="holter-major" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect width="20" height="20" fill="url(#holter-minor)" />
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(220, 88, 88, 0.5)" strokeWidth="0.9" />
            </pattern>
          </defs>
          <rect width="900" height="280" fill="url(#holter-major)" />
          {([
            { label: 'Ch1 · CM5', lead: 'V5' as LeadName, y: 65 },
            { label: 'Ch2 · CM1', lead: 'V1' as LeadName, y: 145 },
            { label: 'Ch3 · aVF', lead: 'aVF' as LeadName, y: 225 },
          ]).map((ch) => (
            <g key={ch.label}>
              <line x1="24" y1={ch.y} x2="870" y2={ch.y} stroke="rgba(37, 99, 235, 0.35)" strokeWidth="0.8" strokeDasharray="4,3" />
              <text x="14" y={ch.y - 28} fill="#991B1B" fontSize="11" fontWeight="700" fontFamily="monospace">
                {ch.label}
              </text>
              <polyline
                points={buildHolterStrip(ch.lead, ch.y)}
                fill="none"
                stroke="#111827"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
};

// ---------- HOLTER DE PRESIÓN ARTERIAL / MAPA 24H VIEWER ----------

const HolterBpViewer: React.FC<{ study: ComplementaryStudy; vitalSigns?: VitalSigns }> = ({
  study,
  vitalSigns,
}) => {
  const txt = norm(`${study.result} ${study.interpretation || ''}`);

  const bpFallback = vitalSigns?.bloodPressure?.match(/(\d{2,3})\s*\/\s*(\d{2,3})/);
  const fallbackSys = bpFallback ? Number(bpFallback[1]) : 120;
  const fallbackDia = bpFallback ? Number(bpFallback[2]) : 76;

  const meanMatch = txt.match(/promedio(?:\s+global)?\s+24\s*h(?:oras)?:\s*(\d{2,3})\s*\/\s*(\d{2,3})/);
  const dayMatch = txt.match(/(?:periodo\s+)?diurno[^:]*:\s*(\d{2,3})\s*\/\s*(\d{2,3})/);
  const nightMatch = txt.match(/(?:periodo\s+)?nocturno[^:]*:\s*(\d{2,3})\s*\/\s*(\d{2,3})/);
  const dipMatch = txt.match(/descenso\s+nocturno[^:]*:\s*(\d+(?:\.\d+)?)\s*%/);

  const daySys = dayMatch ? Number(dayMatch[1]) : fallbackSys;
  const dayDia = dayMatch ? Number(dayMatch[2]) : fallbackDia;
  const nightSys = nightMatch
    ? Number(nightMatch[1])
    : Math.round(daySys * (study.isAbnormal ? 0.92 : 0.87));
  const nightDia = nightMatch
    ? Number(nightMatch[2])
    : Math.round(dayDia * (study.isAbnormal ? 0.92 : 0.86));
  const mean24Sys = meanMatch ? Number(meanMatch[1]) : Math.round(daySys * 0.65 + nightSys * 0.35);
  const mean24Dia = meanMatch ? Number(meanMatch[2]) : Math.round(dayDia * 0.65 + nightDia * 0.35);
  const dipPct = dipMatch ? dipMatch[1] : (((daySys - nightSys) / Math.max(1, daySys)) * 100).toFixed(1);

  // Build realistic 24-hour curve starting at 08:00 through 08:00 next day
  // Hours 0..13 (08:00..21:00) = Day; Hours 14..22 (22:00..06:00) = Night; Hours 23..24 = Morning surge
  const hourlyReadings = useMemo(() => {
    const dayMod = [-2, 3, 5, 2, -3, 1, 4, 2, -1, 3, 1, -2, -3, -4];
    const nightMod = [-1, -2, 0, -2, -1, 1, 0, 2, 4];
    const rows: Array<{ hourIdx: number; label: string; sys: number; dia: number; isNight: boolean }> = [];

    for (let h = 0; h <= 24; h++) {
      const clock = (8 + h) % 24;
      const isNight = h >= 14 && h <= 22;
      const offset = isNight ? nightMod[h - 14] : h >= 23 ? 3 : dayMod[h % dayMod.length];
      const sys = Math.max(58, Math.min(220, (isNight ? nightSys : daySys) + offset));
      const dia = Math.max(36, Math.min(140, (isNight ? nightDia : dayDia) + Math.round(offset * 0.65)));
      rows.push({
        hourIdx: h,
        label: `${String(clock).padStart(2, '0')}:00`,
        sys,
        dia,
        isNight,
      });
    }
    return rows;
  }, [daySys, dayDia, nightSys, nightDia]);

  const toX = (h: number) => 56 + (h / 24) * 814;
  const toY = (mmhg: number) => 245 - ((mmhg - 40) / 180) * 210; // Range 40..220 mmHg

  const sysPoints = hourlyReadings.map((r) => `${toX(r.hourIdx).toFixed(1)},${toY(r.sys).toFixed(1)}`).join(' ');
  const diaPoints = hourlyReadings.map((r) => `${toX(r.hourIdx).toFixed(1)},${toY(r.dia).toFixed(1)}`).join(' ');
  const bandPolygon = [
    ...hourlyReadings.map((r) => `${toX(r.hourIdx).toFixed(1)},${toY(r.sys).toFixed(1)}`),
    ...[...hourlyReadings].reverse().map((r) => `${toX(r.hourIdx).toFixed(1)},${toY(r.dia).toFixed(1)}`),
  ].join(' ');

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="font-bold text-white flex items-center gap-1.5">
          <Activity className="w-4 h-4 text-sky-400" />
          Monitoreo Ambulatorio de Presión Arterial (MAPA / Holter de PA 24 Horas)
        </span>
        <div className="flex flex-wrap items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1 text-rose-300">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" /> Sistólica (PAS)
          </span>
          <span className="flex items-center gap-1 text-sky-300">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400 inline-block" /> Diastólica (PAD)
          </span>
          <span className="flex items-center gap-1 text-amber-300/90">
            <span className="w-3 h-0.5 border-t border-dashed border-amber-400 inline-block" /> Límite 135/85
          </span>
        </div>
      </div>

      {/* Objective Numeric Telemetry Strip (Strictly values from study, no diagnosis spoiler) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <div className="bg-[#040B1B] border border-blue-900/70 rounded-lg px-3 py-2">
          <div className="text-[10px] text-blue-300/80 uppercase">Promedio 24 h</div>
          <div className="font-mono font-bold text-white text-sm">{mean24Sys}/{mean24Dia} mmHg</div>
        </div>
        <div className="bg-[#040B1B] border border-blue-900/70 rounded-lg px-3 py-2">
          <div className="text-[10px] text-blue-300/80 uppercase">Diurno (07–22 h)</div>
          <div className="font-mono font-bold text-white text-sm">{daySys}/{dayDia} mmHg</div>
        </div>
        <div className="bg-[#040B1B] border border-blue-900/70 rounded-lg px-3 py-2">
          <div className="text-[10px] text-blue-300/80 uppercase">Nocturno (22–07 h)</div>
          <div className="font-mono font-bold text-white text-sm">{nightSys}/{nightDia} mmHg</div>
        </div>
        <div className="bg-[#040B1B] border border-blue-900/70 rounded-lg px-3 py-2">
          <div className="text-[10px] text-blue-300/80 uppercase">Descenso Nocturno</div>
          <div className="font-mono font-bold text-white text-sm">{dipPct}%</div>
        </div>
      </div>

      {/* 24-Hour MAPA Chart */}
      <div className="bg-[#040B1B] border border-blue-900/70 rounded-xl p-2.5 overflow-x-auto">
        <svg viewBox="0 0 900 280" className="w-full min-w-[600px] h-auto block">
          {/* Nighttime Sleep Window (22:00 to 07:00 => index 14 to 23) */}
          <rect
            x={toX(14)}
            y="35"
            width={toX(23) - toX(14)}
            height="210"
            fill="rgba(30, 58, 138, 0.28)"
          />
          <text x={(toX(14) + toX(23)) / 2} y="50" fill="#93C5FD" fontSize="10" fontWeight="700" textAnchor="middle">
            Periodo Nocturno / Sueño (22:00–07:00)
          </text>
          <text x={(toX(0) + toX(14)) / 2} y="50" fill="#94A3B8" fontSize="10" textAnchor="middle">
            Periodo Diurno / Vigilia
          </text>

          {/* Horizontal mmHg grid lines */}
          {[60, 80, 100, 120, 140, 160, 180, 200].map((mmhg) => {
            const y = toY(mmhg);
            return (
              <g key={mmhg}>
                <line x1="56" y1={y} x2="870" y2={y} stroke="#1E293B" strokeWidth="0.8" />
                <text x="48" y={y + 3} fill="#94A3B8" fontSize="10" textAnchor="end" fontFamily="monospace">
                  {mmhg}
                </text>
              </g>
            );
          })}

          {/* Reference Thresholds: 135 Day Sys, 85 Day Dia, 120 Night Sys, 70 Night Dia */}
          <line x1={toX(0)} y1={toY(135)} x2={toX(14)} y2={toY(135)} stroke="#F59E0B" strokeWidth="1.2" strokeDasharray="5,4" opacity="0.85" />
          <line x1={toX(0)} y1={toY(85)} x2={toX(14)} y2={toY(85)} stroke="#F59E0B" strokeWidth="1.1" strokeDasharray="4,4" opacity="0.7" />
          <line x1={toX(14)} y1={toY(120)} x2={toX(23)} y2={toY(120)} stroke="#A78BFA" strokeWidth="1.2" strokeDasharray="5,4" opacity="0.85" />
          <line x1={toX(14)} y1={toY(70)} x2={toX(23)} y2={toY(70)} stroke="#A78BFA" strokeWidth="1.1" strokeDasharray="4,4" opacity="0.7" />

          {/* Pulse Pressure Shaded Envelope */}
          <polygon points={bandPolygon} fill="rgba(56, 189, 248, 0.12)" />

          {/* Systolic & Diastolic Curves */}
          <polyline points={sysPoints} fill="none" stroke="#F43F5E" strokeWidth="2.3" strokeLinejoin="round" />
          <polyline points={diaPoints} fill="none" stroke="#38BDF8" strokeWidth="2.3" strokeLinejoin="round" />

          {hourlyReadings.map((r) => (
            <g key={r.hourIdx}>
              <circle cx={toX(r.hourIdx)} cy={toY(r.sys)} r="3.2" fill="#040B1B" stroke="#F43F5E" strokeWidth="1.8" />
              <circle cx={toX(r.hourIdx)} cy={toY(r.dia)} r="3.2" fill="#040B1B" stroke="#38BDF8" strokeWidth="1.8" />
              {r.hourIdx % 4 === 0 && (
                <text x={toX(r.hourIdx)} y="264" fill="#94A3B8" fontSize="10" textAnchor="middle" fontFamily="monospace">
                  {r.label}
                </text>
              )}
            </g>
          ))}

          <text x="15" y="140" fill="#94A3B8" fontSize="10" transform="rotate(-90 15,140)" textAnchor="middle">
            Presión Arterial (mmHg)
          </text>
        </svg>
      </div>
    </div>
  );
};

// ---------- SPIROMETRY FLOW-VOLUME & VOLUME-TIME VIEWER ----------

const SpirometryViewer: React.FC<{ study: ComplementaryStudy }> = ({ study }) => {
  const txt = norm(`${study.result} ${study.interpretation || ''}`);

  // Parse exact reported values when available so curves match text 100%
  const fev1PctMatch = txt.match(/(?:fev1|vef1)\s*(?:en|:)?\s*(\d{2,3})%/);
  const fvcPctMatch = txt.match(/(?:fvc|cvf)\s*(?:en|:)?\s*(\d{2,3})%/);
  const ratioMatch = txt.match(/(?:fev1\/fvc|vef1\/cvf)\s*(?:reducida)?\s*[:(]?\s*(0\.\d{2})/);
  const bdChangeMatch = txt.match(/\+\s*(\d{1,2})%/);

  const hasNegBd = /(?:no completamente reversible|respuesta broncodilatadora negativa|sin respuesta significativa|<\s*12%)/.test(txt);
  const hasPosBd =
    !hasNegBd &&
    (/(?:respuesta broncodilatadora(?:\s+significativa)?\s+positiva|incremento del vef1|cambio en fev1 de \+1[2-9]|cambio en fev1 de \+[2-9]\d)/.test(
      txt
    ) ||
      (bdChangeMatch ? Number(bdChangeMatch[1]) >= 12 : false));

  const isRestrictive =
    study.isAbnormal &&
    /restrictiv/.test(txt) &&
    !/obstructiv/.test(txt);

  const isCopd =
    study.isAbnormal &&
    !isRestrictive &&
    !hasPosBd &&
    (/(?:\bepoc\b|\bgold\b|no completamente reversible|respuesta broncodilatadora negativa|limitacion cronica)/.test(txt) ||
      (ratioMatch ? Number(ratioMatch[1]) < 0.7 && hasNegBd : false));

  const isAsthma =
    study.isAbnormal &&
    !isCopd &&
    !isRestrictive &&
    (hasPosBd || /\basma\b|obstructiv/.test(txt));

  const fev1Pct = fev1PctMatch ? Number(fev1PctMatch[1]) : isCopd ? 58 : isAsthma ? 72 : isRestrictive ? 64 : 94;
  const fvcPct = fvcPctMatch ? Number(fvcPctMatch[1]) : isRestrictive ? 62 : isCopd ? 84 : 96;
  const ratioVal = ratioMatch ? ratioMatch[1] : isCopd ? '0.55' : isAsthma ? '0.67' : isRestrictive ? '0.84' : '0.81';

  const fvSvg = (vol: number, flow: number) => {
    const x = 60 + (vol / 5.2) * 350;
    const y = 175 - flow * 14.5;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  };

  const predictedFV = [
    [0, 0], [0.22, 8.8], [0.65, 9.1], [1.4, 7.2], [2.4, 5.1], [3.5, 3.0], [4.5, 1.0], [4.9, 0],
    [4.4, -3.5], [3.2, -5.6], [1.8, -5.8], [0.6, -4.1], [0, 0],
  ]
    .map(([v, f]) => fvSvg(v, f))
    .join(' ');

  const basalFV = (isCopd
    ? [
        [0, 0], [0.22, 4.1], [0.5, 3.8], [1.0, 2.0], [1.8, 1.05], [2.6, 0.55], [3.3, 0.25], [3.75, 0],
        [3.3, -2.1], [2.2, -3.4], [1.1, -3.2], [0.3, -1.9], [0, 0],
      ]
    : isAsthma
      ? [
          [0, 0], [0.25, 5.4], [0.6, 5.1], [1.2, 3.1], [2.1, 1.75], [3.1, 0.95], [4.0, 0.4], [4.4, 0],
          [3.9, -2.7], [2.6, -4.1], [1.3, -4.0], [0.4, -2.3], [0, 0],
        ]
      : isRestrictive
        ? [
            [0, 0], [0.18, 6.9], [0.45, 7.1], [1.0, 5.6], [1.7, 3.8], [2.4, 2.0], [2.95, 0.8], [3.15, 0],
            [2.8, -2.6], [2.0, -4.1], [1.0, -4.0], [0.35, -2.5], [0, 0],
          ]
        : [
            [0, 0], [0.22, 8.4], [0.65, 8.7], [1.38, 6.9], [2.35, 4.8], [3.4, 2.8], [4.35, 0.95], [4.75, 0],
            [4.2, -3.3], [3.0, -5.3], [1.7, -5.5], [0.55, -3.9], [0, 0],
          ]
  )
    .map(([v, f]) => fvSvg(v, f))
    .join(' ');

  const postBdFV = isAsthma
    ? [
        [0, 0], [0.22, 7.8], [0.65, 8.0], [1.35, 6.2], [2.3, 4.3], [3.35, 2.5], [4.25, 0.85], [4.7, 0],
        [4.1, -3.2], [2.9, -5.0], [1.6, -5.1], [0.5, -3.5], [0, 0],
      ]
        .map(([v, f]) => fvSvg(v, f))
        .join(' ')
    : isCopd
      ? [
          [0, 0], [0.22, 4.35], [0.52, 4.0], [1.05, 2.15], [1.85, 1.15], [2.65, 0.62], [3.4, 0.28], [3.85, 0],
          [3.4, -2.2], [2.25, -3.5], [1.15, -3.3], [0.32, -2.0], [0, 0],
        ]
          .map(([v, f]) => fvSvg(v, f))
          .join(' ')
      : null;

  const vtSvg = (t: number, vol: number) => {
    const x = 60 + (t / 6) * 350;
    const y = 235 - (vol / 5.2) * 195;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  };

  const predVT = [
    [0, 0], [0.3, 1.8], [0.6, 3.0], [1.0, 3.9], [1.8, 4.55], [3.0, 4.82], [4.5, 4.9], [6.0, 4.9],
  ]
    .map(([t, v]) => vtSvg(t, v))
    .join(' ');

  const basalVT = (isCopd
    ? [[0, 0], [0.4, 1.05], [1.0, 2.05], [2.0, 2.85], [3.2, 3.35], [4.5, 3.62], [6.0, 3.72]]
    : isAsthma
      ? [[0, 0], [0.4, 1.45], [1.0, 2.85], [2.0, 3.75], [3.2, 4.15], [4.5, 4.32], [6.0, 4.4]]
      : isRestrictive
        ? [[0, 0], [0.3, 1.35], [0.6, 2.15], [1.0, 2.65], [1.8, 2.95], [3.0, 3.1], [4.5, 3.15], [6.0, 3.15]]
        : [[0, 0], [0.3, 1.72], [0.6, 2.88], [1.0, 3.75], [1.8, 4.4], [3.0, 4.68], [4.5, 4.74], [6.0, 4.75]]
  )
    .map(([t, v]) => vtSvg(t, v))
    .join(' ');

  const postVT = isAsthma
    ? [[0, 0], [0.3, 1.68], [0.6, 2.75], [1.0, 3.55], [1.8, 4.22], [3.0, 4.55], [4.5, 4.66], [6.0, 4.68]]
        .map(([t, v]) => vtSvg(t, v))
        .join(' ')
    : isCopd
      ? [[0, 0], [0.4, 1.1], [1.0, 2.15], [2.0, 2.95], [3.2, 3.45], [4.5, 3.72], [6.0, 3.82]]
          .map(([t, v]) => vtSvg(t, v))
          .join(' ')
      : null;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="font-bold text-white flex items-center gap-1.5">
          <Activity className="w-4 h-4 text-sky-400" />
          Gráficas Espirométricas (Curva Flujo-Volumen y Volumen-Tiempo)
        </span>
        <div className="flex flex-wrap items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1 text-slate-300">
            <span className="w-3 h-0.5 border-t-2 border-dashed border-slate-400 inline-block" /> Predicho
          </span>
          <span className="flex items-center gap-1 text-amber-300">
            <span className="w-3 h-0.5 bg-amber-400 inline-block" /> Basal (Pre-BD)
          </span>
          {postBdFV && (
            <span className="flex items-center gap-1 text-emerald-300">
              <span className="w-3 h-0.5 bg-emerald-400 inline-block" /> Post-BD
            </span>
          )}
        </div>
      </div>

      {/* Synchronized objective values bar */}
      <div className="grid grid-cols-3 gap-2 text-xs font-mono">
        <div className="bg-[#040B1B] border border-blue-900/70 rounded-lg px-3 py-1.5">
          <span className="text-[10px] text-blue-300/80 block font-sans">FVC Basal</span>
          <span className="font-bold text-white">{fvcPct}% pred.</span>
        </div>
        <div className="bg-[#040B1B] border border-blue-900/70 rounded-lg px-3 py-1.5">
          <span className="text-[10px] text-blue-300/80 block font-sans">FEV₁ Basal</span>
          <span className="font-bold text-white">{fev1Pct}% pred.</span>
        </div>
        <div className="bg-[#040B1B] border border-blue-900/70 rounded-lg px-3 py-1.5">
          <span className="text-[10px] text-blue-300/80 block font-sans">Relación FEV₁/FVC</span>
          <span className="font-bold text-white">{ratioVal}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="bg-[#040B1B] border border-blue-900/70 rounded-xl p-3">
          <div className="text-[11px] font-bold text-blue-200 mb-1.5">Curva Flujo-Volumen (L/s vs L)</div>
          <svg viewBox="0 0 440 280" className="w-full h-auto block">
            <line x1="60" y1="25" x2="60" y2="265" stroke="#334155" strokeWidth="1.2" />
            <line x1="55" y1="175" x2="420" y2="175" stroke="#475569" strokeWidth="1.2" />
            {[0, 1, 2, 3, 4, 5].map((v) => {
              const x = 60 + (v / 5.2) * 350;
              return (
                <g key={v}>
                  <line x1={x} y1="25" x2={x} y2="265" stroke="#1E293B" strokeWidth="0.7" />
                  <text x={x} y="190" fill="#94A3B8" fontSize="10" textAnchor="middle" fontFamily="monospace">
                    {v}
                  </text>
                </g>
              );
            })}
            {[-4, 0, 4, 8].map((f) => {
              const y = 175 - f * 14.5;
              return (
                <g key={f}>
                  <line x1="60" y1={y} x2="420" y2={y} stroke="#1E293B" strokeWidth="0.7" />
                  <text x="50" y={y + 3} fill="#94A3B8" fontSize="10" textAnchor="end" fontFamily="monospace">
                    {f}
                  </text>
                </g>
              );
            })}
            <text x="240" y="274" fill="#94A3B8" fontSize="10" textAnchor="middle">
              Volumen (Litros)
            </text>
            <text x="16" y="120" fill="#94A3B8" fontSize="10" transform="rotate(-90 16,120)" textAnchor="middle">
              Flujo (L/s)
            </text>

            <polyline points={predictedFV} fill="none" stroke="#94A3B8" strokeWidth="1.6" strokeDasharray="5,4" />
            <polyline points={basalFV} fill="none" stroke="#F59E0B" strokeWidth="2.4" strokeLinejoin="round" />
            {postBdFV && <polyline points={postBdFV} fill="none" stroke="#34D399" strokeWidth="2.2" strokeLinejoin="round" />}
          </svg>
        </div>

        <div className="bg-[#040B1B] border border-blue-900/70 rounded-xl p-3">
          <div className="text-[11px] font-bold text-blue-200 mb-1.5">Espirograma Volumen-Tiempo (FEV₁ / FVC)</div>
          <svg viewBox="0 0 440 280" className="w-full h-auto block">
            <line x1="60" y1="25" x2="60" y2="235" stroke="#334155" strokeWidth="1.2" />
            <line x1="60" y1="235" x2="420" y2="235" stroke="#475569" strokeWidth="1.2" />
            {[0, 1, 2, 3, 4, 5, 6].map((t) => {
              const x = 60 + (t / 6) * 350;
              return (
                <g key={t}>
                  <line
                    x1={x}
                    y1="25"
                    x2={x}
                    y2="235"
                    stroke={t === 1 ? '#38BDF8' : '#1E293B'}
                    strokeWidth={t === 1 ? '1.1' : '0.7'}
                    strokeDasharray={t === 1 ? '3,3' : undefined}
                  />
                  <text x={x} y="252" fill={t === 1 ? '#38BDF8' : '#94A3B8'} fontSize="10" textAnchor="middle" fontFamily="monospace">
                    {t}s
                  </text>
                </g>
              );
            })}
            {[1, 2, 3, 4, 5].map((vol) => {
              const y = 235 - (vol / 5.2) * 195;
              return (
                <g key={vol}>
                  <line x1="60" y1={y} x2="420" y2={y} stroke="#1E293B" strokeWidth="0.7" />
                  <text x="50" y={y + 3} fill="#94A3B8" fontSize="10" textAnchor="end" fontFamily="monospace">
                    {vol}L
                  </text>
                </g>
              );
            })}
            <text x="125" y="38" fill="#38BDF8" fontSize="10" fontFamily="monospace">
              FEV₁ (1s)
            </text>
            <text x="240" y="272" fill="#94A3B8" fontSize="10" textAnchor="middle">
              Tiempo (segundos)
            </text>

            <polyline points={predVT} fill="none" stroke="#94A3B8" strokeWidth="1.6" strokeDasharray="5,4" />
            <polyline points={basalVT} fill="none" stroke="#F59E0B" strokeWidth="2.4" strokeLinejoin="round" />
            {postVT && <polyline points={postVT} fill="none" stroke="#34D399" strokeWidth="2.2" strokeLinejoin="round" />}
          </svg>
        </div>
      </div>
    </div>
  );
};

// ---------- ELECTROENCEPHALOGRAM (EEG) VIEWER ----------

const EegViewer: React.FC<{ study: ComplementaryStudy }> = ({ study }) => {
  const txt = norm(`${study.result} ${study.interpretation || ''}`);
  const txtNoNeg = stripMedicalNegations(txt);

  const isEpileptiform =
    study.isAbnormal && /punta-onda|puntas|ondas agudas|epileptiforme|f8-t4|f7-t3|descargas/.test(txtNoNeg);
  const isFastBeta = study.isAbnormal && !isEpileptiform && /actividad beta difusa|bajo voltaje.*abstinencia/.test(txtNoNeg);
  const isSlowing = study.isAbnormal && !isEpileptiform && !isFastBeta && /theta|delta|enlentecid|4-7 hz|4-6 hz/.test(txtNoNeg);

  const isLeftFocus = /izquierd|f7-t3|hemisferica izquierda|frontotemporal izquierda/.test(txtNoNeg);
  const isRightFocus = /derech|f8-t4/.test(txtNoNeg);
  const isBilateral = /difuso|generalizad|bilateral/.test(txtNoNeg) && !isLeftFocus && !isRightFocus;

  const channels = [
    { name: 'Fp1 - F7', region: 'ant', side: 'L', y: 45 },
    { name: 'F7 - T3', region: 'temp', side: 'L', y: 92 },
    { name: 'T3 - T5', region: 'post', side: 'L', y: 139 },
    { name: 'T5 - O1', region: 'occ', side: 'L', y: 186 },
    { name: 'Fp2 - F8', region: 'ant', side: 'R', y: 245 },
    { name: 'F8 - T4', region: 'temp', side: 'R', y: 292 },
    { name: 'T4 - T6', region: 'post', side: 'R', y: 339 },
    { name: 'T6 - O2', region: 'occ', side: 'R', y: 386 },
  ];

  const buildEegPath = (ch: (typeof channels)[number], idx: number): string => {
    const pts: string[] = [];
    const startX = 95;
    const width = 790;
    const duration = 6.0;
    const steps = 360;
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * duration;
      let uV = 0;

      const applyFocalSlowing =
        isSlowing && (isBilateral || (!isLeftFocus && !isRightFocus) || (isLeftFocus && ch.side === 'L') || (isRightFocus && ch.side === 'R'));

      if (isFastBeta) {
        // Low-voltage fast beta (22 Hz) + scattered theta (Delirium tremens pattern)
        uV =
          7 * Math.sin(2 * Math.PI * 22.0 * t + idx * 0.9) +
          8 * Math.sin(2 * Math.PI * 5.2 * t + idx * 1.4);
      } else if (applyFocalSlowing) {
        uV =
          22 * Math.sin(2 * Math.PI * 3.8 * t + idx * 0.7) +
          11 * Math.sin(2 * Math.PI * 5.4 * t + idx * 1.3);
      } else {
        const alphaAmp = ch.region === 'occ' ? 16 : ch.region === 'post' ? 10 : 4;
        const betaAmp = ch.region === 'ant' ? 6 : 3;
        const modulation = 0.65 + 0.35 * Math.sin(2 * Math.PI * 0.6 * t + idx);
        uV =
          alphaAmp * modulation * Math.sin(2 * Math.PI * 10.2 * t + idx * 0.4) +
          betaAmp * Math.sin(2 * Math.PI * 18.5 * t + idx * 1.1);

        if (isEpileptiform) {
          const targetRight = (isRightFocus || (!isLeftFocus && !isBilateral)) && ch.side === 'R' && (ch.name === 'F8 - T4' || ch.name === 'Fp2 - F8' || ch.name === 'T4 - T6');
          const targetLeft = isLeftFocus && ch.side === 'L' && (ch.name === 'F7 - T3' || ch.name === 'Fp1 - F7' || ch.name === 'T3 - T5');
          const targetGen = isBilateral;

          if (targetRight || targetLeft || targetGen) {
            const sign = ch.name.startsWith('Fp') ? -1 : 1;
            const ampFactor = ch.name === 'F8 - T4' || ch.name === 'F7 - T3' || targetGen ? 1.0 : 0.65;
            for (const burstCenter of [1.4, 3.25, 4.9]) {
              const dt = t - burstCenter;
              if (Math.abs(dt) < 0.25) {
                const spike = 44 * Math.exp(-Math.pow((dt + 0.03) / 0.016, 2));
                const slowWave = -24 * Math.exp(-Math.pow((dt - 0.08) / 0.06, 2));
                uV += sign * ampFactor * (spike + slowWave);
              }
            }
          }
        }
      }

      const x = startX + (i / steps) * width;
      const y = ch.y - uV * 0.52;
      pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    return pts.join(' ');
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="font-bold text-white flex items-center gap-1.5">
          <Activity className="w-4 h-4 text-sky-400" />
          Trazado Electroencefalográfico (Montaje Longitudinal Bipolar · 10–20)
        </span>
        <span className="text-[11px] text-blue-300/80 font-mono">30 mm/s · 70 µV/cm · 6 segundos</span>
      </div>
      <div className="rounded-xl overflow-x-auto border border-blue-900/70">
        <svg viewBox="0 0 900 430" className="w-full min-w-[600px] h-auto block" style={{ background: '#F8FAFC' }}>
          {[0, 1, 2, 3, 4, 5, 6].map((sec) => {
            const x = 95 + (sec / 6) * 790;
            return (
              <g key={sec}>
                <line x1={x} y1="18" x2={x} y2="408" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="3,3" />
                <text x={x} y="422" fill="#475569" fontSize="10" textAnchor="middle" fontFamily="monospace">
                  {sec}s
                </text>
              </g>
            );
          })}
          <line x1="12" y1="215" x2="885" y2="215" stroke="#94A3B8" strokeWidth="0.9" strokeDasharray="5,4" />

          {channels.map((ch, idx) => (
            <g key={ch.name}>
              <text
                x="14"
                y={ch.y + 4}
                fill={ch.side === 'L' ? '#1E3A8A' : '#991B1B'}
                fontSize="11"
                fontWeight="700"
                fontFamily="monospace"
              >
                {ch.name}
              </text>
              <polyline points={buildEegPath(ch, idx)} fill="none" stroke="#0F172A" strokeWidth="1.3" strokeLinejoin="round" />
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
};

// ---------- AUDIOMETRY VIEWER ----------

const AudiometryViewer: React.FC<{ study: ComplementaryStudy }> = ({ study }) => {
  const txt = norm(`${study.result} ${study.interpretation || ''}`);
  const txtNoNeg = stripMedicalNegations(txt);
  const isAbnormal = study.isAbnormal;

  const isSensorineural = /neurosensorial|coclear|agudos/.test(txtNoNeg);
  const isConductive = !isSensorineural && /conductiv|brecha aereo-osea|timpanometria.*tipo b/.test(txtNoNeg);

  const affectsRight = /derech|bilateral/.test(txtNoNeg) || (!/izquierd/.test(txtNoNeg) && isAbnormal);
  const affectsLeft = /izquierd|bilateral/.test(txtNoNeg);

  const freqs = [250, 500, 1000, 2000, 4000, 8000];
  const normalAir = [15, 10, 15, 15, 20, 15];
  const conductiveAir = [30, 35, 35, 30, 30, 30];
  const sensorineuralAir = [15, 20, 30, 45, 65, 75];

  const rightDb = isAbnormal && affectsRight ? (isSensorineural ? sensorineuralAir : conductiveAir) : normalAir;
  const leftDb = isAbnormal && affectsLeft ? (isSensorineural ? sensorineuralAir : conductiveAir) : [15, 15, 10, 15, 15, 20];
  const boneRightDb = isAbnormal && affectsRight && isConductive ? [10, 10, 15, 10, 15, 15] : null;
  const boneLeftDb = isAbnormal && affectsLeft && isConductive ? [10, 15, 10, 10, 15, 15] : null;

  const toX = (i: number) => 65 + (i / (freqs.length - 1)) * 345;
  const toY = (db: number) => 30 + ((db + 10) / 110) * 195;

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="font-bold text-white flex items-center gap-1.5">
          <Activity className="w-4 h-4 text-sky-400" />
          Audiograma Tonal Liminar (Oído Derecho ○ · Oído Izquierdo ×)
        </span>
        <div className="flex flex-wrap items-center gap-3 text-[11px]">
          <span className="text-rose-400 font-semibold">○ Vía Aérea OD</span>
          <span className="text-sky-400 font-semibold">× Vía Aérea OI</span>
          {(boneRightDb || boneLeftDb) && <span className="text-amber-300 font-semibold">[ / ] Vía Ósea</span>}
          <span className="text-emerald-300/90">Normal ≤ 25 dB</span>
        </div>
      </div>
      <div className="bg-[#040B1B] border border-blue-900/70 rounded-xl p-3">
        <svg viewBox="0 0 440 250" className="w-full max-w-lg h-auto block mx-auto">
          <rect x="65" y={toY(-10)} width="345" height={toY(25) - toY(-10)} fill="rgba(16, 185, 129, 0.08)" />
          {freqs.map((f, i) => (
            <g key={f}>
              <line x1={toX(i)} y1="30" x2={toX(i)} y2="225" stroke="#1E293B" strokeWidth="0.9" />
              <text x={toX(i)} y="242" fill="#94A3B8" fontSize="10" textAnchor="middle" fontFamily="monospace">
                {f}
              </text>
            </g>
          ))}
          {[0, 20, 40, 60, 80, 100].map((db) => (
            <g key={db}>
              <line x1="65" y1={toY(db)} x2="410" y2={toY(db)} stroke="#1E293B" strokeWidth="0.9" />
              <text x="54" y={toY(db) + 3} fill="#94A3B8" fontSize="10" textAnchor="end" fontFamily="monospace">
                {db}
              </text>
            </g>
          ))}
          <text x="16" y="130" fill="#94A3B8" fontSize="9.5" transform="rotate(-90 16,130)" textAnchor="middle">
            Umbral (dB HL)
          </text>

          <polyline points={rightDb.map((d, i) => `${toX(i)},${toY(d)}`).join(' ')} fill="none" stroke="#F43F5E" strokeWidth="2" />
          <polyline points={leftDb.map((d, i) => `${toX(i)},${toY(d)}`).join(' ')} fill="none" stroke="#38BDF8" strokeWidth="2" />

          {boneRightDb && boneRightDb.map((d, i) => (
            <text key={`br-${i}`} x={toX(i) - 5} y={toY(d) + 4} fill="#FBBF24" fontSize="11" fontWeight="700" textAnchor="middle">
              &lt;
            </text>
          ))}
          {boneLeftDb && boneLeftDb.map((d, i) => (
            <text key={`bl-${i}`} x={toX(i) + 5} y={toY(d) + 4} fill="#FBBF24" fontSize="11" fontWeight="700" textAnchor="middle">
              &gt;
            </text>
          ))}

          {rightDb.map((d, i) => (
            <circle key={`r-${i}`} cx={toX(i)} cy={toY(d)} r="4" fill="#040B1B" stroke="#F43F5E" strokeWidth="2" />
          ))}
          {leftDb.map((d, i) => (
            <text key={`l-${i}`} x={toX(i)} y={toY(d) + 4} fill="#38BDF8" fontSize="12" fontWeight="700" textAnchor="middle">
              ×
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
};

export const StudyTracingViewer: React.FC<StudyTracingViewerProps> = ({ study, vitalSigns }) => {
  const kind = detectTracingKind(study);
  if (!kind) return null;

  return (
    <div className="bg-[#050E22] border border-blue-800/70 rounded-xl p-3 sm:p-4">
      {kind === 'ecg_12' && <EcgTwelveLeadViewer study={study} vitalSigns={vitalSigns} />}
      {kind === 'holter_ecg' && <HolterEcgViewer study={study} vitalSigns={vitalSigns} />}
      {kind === 'holter_bp' && <HolterBpViewer study={study} vitalSigns={vitalSigns} />}
      {kind === 'spirometry' && <SpirometryViewer study={study} />}
      {kind === 'eeg' && <EegViewer study={study} />}
      {kind === 'audiometry' && <AudiometryViewer study={study} />}
    </div>
  );
};
