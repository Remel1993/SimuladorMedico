import React, { useState, useMemo } from 'react';
import { ComplementaryStudy, VitalSigns } from '../types/clinical';
import { Activity, Maximize2, Minimize2, Sun, Moon } from 'lucide-react';

interface StudyTracingViewerProps {
  study: ComplementaryStudy;
  vitalSigns?: VitalSigns;
}

type TracingKind = 'ecg_12' | 'holter' | 'spirometry' | 'eeg' | 'audiometry' | null;

function norm(text: string): string {
  return (text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export function detectTracingKind(study: ComplementaryStudy): TracingKind {
  const n = norm(study.name);
  if (n.includes('holter')) return 'holter';
  if (n.includes('electrocardiograma') || /\becg\b/.test(n)) return 'ecg_12';
  if (n.includes('espirometr')) return 'spirometry';
  if (n.includes('electroencefalograma') || /\beeg\b/.test(n)) return 'eeg';
  if (n.includes('audiometr')) return 'audiometry';
  return null;
}

// ---------- ECG WAVEFORM SYNTHESIS ----------

interface EcgProfile {
  hr: number;
  isAFib: boolean;
  isAnteriorSTEMI: boolean;
  isInferiorSTEMI: boolean;
  isPericarditis: boolean;
  isPeakedT: boolean;
  isS1Q3T3: boolean;
  isAlternans: boolean;
  isLongQT: boolean;
  isFlatT: boolean;
}

function parseEcgProfile(study: ComplementaryStudy, vitalSigns?: VitalSigns): EcgProfile {
  const txt = norm(`${study.result} ${study.interpretation || ''}`);
  const txtNoNeg = txt
    .replace(
      /\bsin\s+(?:ondas?\s+t\s+)?(?:picudas|hiperkalemia|supradesnivel|elevacion(?:\s+del\s+st)?|inversion|onda\s+u|alternancia|bloqueo)[^.,;)]*/g,
      ' '
    )
    .replace(/\bausencia\s+de\s+(?:supradesnivel|elevacion|ondas?\s+t\s+picudas)[^.,;)]*/g, ' ');
  const hrMatch = txt.match(/(\d{2,3})\s*(?:lpm|bpm|latidos)/);
  const parsedHr = hrMatch ? Number(hrMatch[1]) : vitalSigns?.heartRate || 76;
  const hr = Math.max(38, Math.min(185, parsedHr));

  return {
    hr,
    isAFib: /fibrilatori|ausencia de ondas p|r-r completamente irregulares|fibrilacion auricular/.test(txt),
    isAnteriorSTEMI:
      /(elevacion|supradesnivel).*st.*(v1|v2|v3|v4)|v1.*v4.*elevacion/.test(txtNoNeg),
    isInferiorSTEMI:
      /(elevacion|supradesnivel).*st.*(dii|diii|avf|cara inferior)/.test(txtNoNeg),
    isPericarditis:
      /silla de montar|concava.*st|descenso del segmento pr|elevacion difusa/.test(txtNoNeg),
    isPeakedT: /ondas?\s*t\s*altas|ondas?\s*t\s*picudas|\bpicudas\b|hiperkalemia/.test(txtNoNeg),
    isS1Q3T3: /s1q3t3|onda s profunda en di|onda q y t negativa en diii/.test(txtNoNeg),
    isAlternans: /bajo voltaje|alternancia electrica/.test(txtNoNeg),
    isLongQT: /qtc.*prolongado|465 ms|470 ms|480 ms|500 ms/.test(txtNoNeg),
    isFlatT: /onda t.*aplanada|inversion de onda t/.test(txtNoNeg),
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
  p: EcgProfile
): number {
  // Normal axis polarity & amplitudes per lead (in mV)
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
  let tCenter = p.isLongQT ? 0.39 : 0.31;
  let tSigma = p.isPeakedT ? 0.024 : 0.046;
  let qrsWidth = p.isPeakedT ? 1.2 : 1.0;
  const prOffset = p.isPeakedT ? -0.03 : 0; // slightly longer PR

  // Apply pathology morphologies
  if (p.isAlternans) {
    const mult = beatIndex % 2 === 0 ? 0.42 : 0.23;
    base.rAmp *= mult;
    base.sAmp *= mult;
    base.qAmp *= mult;
  }

  if (p.isAnteriorSTEMI) {
    if (lead === 'V1' || lead === 'V2' || lead === 'V3' || lead === 'V4') {
      stShift = lead === 'V2' || lead === 'V3' ? 0.42 : 0.3;
      base.sAmp = 0;
      base.tAmp = Math.max(base.tAmp, 0.48);
    } else if (lead === 'DII' || lead === 'DIII' || lead === 'aVF') {
      stShift = -0.16;
    }
  }

  if (p.isInferiorSTEMI) {
    if (lead === 'DII' || lead === 'DIII' || lead === 'aVF') {
      stShift = 0.36;
      base.sAmp = 0;
      base.tAmp = 0.42;
    } else if (lead === 'DI' || lead === 'aVL') {
      stShift = -0.16;
    }
  }

  if (p.isPericarditis) {
    if (lead !== 'aVR' && lead !== 'V1') {
      stShift = 0.22;
      prShift = -0.07;
    } else if (lead === 'aVR') {
      prShift = 0.07;
      stShift = -0.12;
    }
  }

  if (p.isPeakedT && (lead === 'V2' || lead === 'V3' || lead === 'V4' || lead === 'V5')) {
    base.tAmp = 0.85;
  }

  if (p.isS1Q3T3) {
    if (lead === 'DI') {
      base.sAmp = -0.48;
    }
    if (lead === 'DIII') {
      base.qAmp = -0.32;
      base.tAmp = -0.26;
    }
    if (lead === 'V1' || lead === 'V2' || lead === 'V3') {
      base.tAmp = -0.28;
    }
  }

  if (p.isFlatT && lead !== 'aVR') {
    base.tAmp *= 0.25;
  }

  // Wave timings relative to QRS R-peak at t = 0.18 s
  const rCenter = 0.18;
  const pCenter = 0.07 + prOffset;

  let v = 0;

  // P wave or AFib f-waves
  if (p.isAFib) {
    v +=
      0.035 * Math.sin(2 * Math.PI * 6.5 * (phaseSec + beatIndex * 0.17)) +
      0.025 * Math.cos(2 * Math.PI * 9.2 * (phaseSec + beatIndex * 0.31));
  } else {
    v += base.pAmp * gaussian(phaseSec, pCenter, 0.019);
    // PR segment shift (for pericarditis)
    if (prShift !== 0 && phaseSec > pCenter + 0.015 && phaseSec < rCenter - 0.025) {
      v += prShift;
    }
  }

  // QRS complex
  v += base.qAmp * gaussian(phaseSec, rCenter - 0.022 * qrsWidth, 0.008 * qrsWidth);
  v += base.rAmp * gaussian(phaseSec, rCenter, 0.011 * qrsWidth);
  v += base.sAmp * gaussian(phaseSec, rCenter + 0.022 * qrsWidth, 0.009 * qrsWidth);

  // ST elevation / depression (smooth plateau from J-point to T peak)
  if (stShift !== 0) {
    const jStart = rCenter + 0.025;
    const tEnd = tCenter + 0.03;
    if (phaseSec >= jStart && phaseSec <= tEnd) {
      const progress = (phaseSec - jStart) / (tEnd - jStart);
      const envelope = p.isPericarditis
        ? Math.sin(Math.PI * Math.pow(progress, 0.7)) * 0.85
        : Math.sin(Math.PI * progress * 0.85 + 0.2);
      v += stShift * Math.max(0.2, envelope);
    }
  }

  // T wave
  v += base.tAmp * gaussian(phaseSec, tCenter, tSigma);

  return v;
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
  const baseRR = 60 / profile.hr;
  const afibFactors = [0.64, 1.08, 0.56, 1.24, 0.72, 0.94, 0.58, 1.15, 0.81, 1.02, 0.66, 1.12];
  const beatStarts: number[] = [0.08];
  let idx = 0;
  while (beatStarts[beatStarts.length - 1] < durationSec + 0.6) {
    const rr = profile.isAFib ? baseRR * afibFactors[idx % afibFactors.length] : baseRR;
    beatStarts.push(beatStarts[beatStarts.length - 1] + rr);
    idx += 1;
  }

  const dt = 0.008;
  const pts: string[] = [];
  for (let t = 0; t <= durationSec; t += dt) {
    // Find closest active beat window
    let mv = 0;
    for (let b = 0; b < beatStarts.length; b++) {
      const localT = t - beatStarts[b] + 0.18;
      if (localT >= 0 && localT <= 0.56) {
        mv += sampleEcgLeadMv(localT, b, lead, profile);
      }
    }
    const px = x0 + t * pxPerSec;
    const py = yBaseline - mv * pxPerMv;
    pts.push(`${px.toFixed(1)},${py.toFixed(1)}`);
  }
  return pts.join(' ');
}

const EcgTwelveLeadViewer: React.FC<{ study: ComplementaryStudy; vitalSigns?: VitalSigns }> = ({
  study,
  vitalSigns,
}) => {
  const profile = useMemo(() => parseEcgProfile(study, vitalSigns), [study, vitalSigns]);
  const [darkMonitor, setDarkMonitor] = useState(false);
  const [zoomLead, setZoomLead] = useState<LeadName | null>(null);

  // Dimensions for 4x3 grid + DII rhythm strip (1000 x 560 SVG viewBox)
  const W = 1000;
  const H = 560;
  // Standard ECG grid: 20 px = 5 mm (0.2 s at 25 mm/s, 0.5 mV at 10 mm/mV); 4 px = 1 mm
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

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex flex-wrap items-center gap-3 text-blue-200 font-mono tabular-nums">
          <span className="font-sans font-bold text-white flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-sky-400" />
            Trazado Electrocardiográfico de 12 Derivaciones
          </span>
          <span className="text-[11px] text-blue-300/80">25 mm/s · 10 mm/mV · FC ~{profile.hr} lpm</span>
        </div>

        <div className="flex items-center gap-2">
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
            onClick={() => setDarkMonitor((prev) => !prev)}
            className="px-2.5 py-1 rounded-md bg-[#040B1B] border border-blue-800/70 text-[11px] text-blue-200 hover:text-white flex items-center gap-1.5 cursor-pointer"
          >
            {darkMonitor ? <Sun className="w-3.5 h-3.5 text-amber-300" /> : <Moon className="w-3.5 h-3.5 text-sky-300" />}
            <span>{darkMonitor ? 'Papel Milimetrado' : 'Monitor Oscuro'}</span>
          </button>
        </div>
      </div>

      {/* Zoomed Single Lead Inspector (if user clicks any lead) */}
      {zoomLead && (
        <div className="rounded-xl overflow-hidden border border-sky-500/70 shadow-lg">
          <div className="px-3 py-1.5 bg-[#040B1B] border-b border-blue-900/70 flex items-center justify-between text-[11px]">
            <span className="font-bold text-sky-300">
              Derivación Ampliada: {zoomLead} (25 mm/s · 10 mm/mV)
            </span>
            <span className="text-blue-300/80 font-mono">1 cuadro grande = 0.20 s / 0.5 mV</span>
          </div>
          <svg
            viewBox="0 0 1000 180"
            className="w-full h-auto block"
            style={{ background: gridBg }}
          >
            <defs>
              <pattern id="ecg-zoom-minor" width="4" height="4" patternUnits="userSpaceOnUse">
                <path d="M 4 0 L 0 0 0 4" fill="none" stroke={minorGrid} strokeWidth="0.6" />
              </pattern>
              <pattern id="ecg-zoom-major" width="20" height="20" patternUnits="userSpaceOnUse">
                <rect width="20" height="20" fill="url(#ecg-zoom-minor)" />
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke={majorGrid} strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="1000" height="180" fill="url(#ecg-zoom-major)" />
            {/* 1mV calibration pulse */}
            <polyline
              points="16,105 24,105 24,65 44,65 44,105 52,105"
              fill="none"
              stroke={traceStroke}
              strokeWidth="1.8"
            />
            <polyline
              points={buildLeadPolylinePoints(zoomLead, profile, 6.2, 60, 105, 145, 56)}
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
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full min-w-[680px] h-auto block"
          style={{ background: gridBg }}
        >
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
              return (
                <g
                  key={lead}
                  onClick={() => setZoomLead(lead)}
                  className="cursor-pointer group"
                >
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
                  {/* Lead Separator Tick */}
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
                  <text
                    x={x0 + 8}
                    y={y0 - 44}
                    fill={labelFill}
                    fontSize="13"
                    fontWeight="700"
                    fontFamily="monospace"
                  >
                    {lead}
                  </text>
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
            <text
              x={startX + 8}
              y={434}
              fill={labelFill}
              fontSize="13"
              fontWeight="700"
              fontFamily="monospace"
            >
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

          {/* Paper Footer Metadata */}
          <text
            x={startX}
            y={544}
            fill={labelFill}
            fontSize="11"
            fontFamily="monospace"
          >
            25 mm/s   10 mm/mV   Filtro: 0.05–150 Hz   (Haga clic en cualquier derivación para ampliar)
          </text>
        </svg>
      </div>
      <div className="flex items-center justify-end text-[11px] text-blue-300/80 gap-1">
        <Maximize2 className="w-3 h-3" />
        <span>Haga clic sobre cualquier derivación (DI–V6) para inspeccionarla ampliada</span>
      </div>
    </div>
  );
};

// ---------- HOLTER 24H STRIP VIEWER ----------

const HolterStripViewer: React.FC<{ study: ComplementaryStudy; vitalSigns?: VitalSigns }> = ({
  study,
  vitalSigns,
}) => {
  const txt = norm(`${study.result} ${study.interpretation || ''}`);
  const isParoxysmalAFib =
    study.isAbnormal && /fibrilacion|taquiarritmia|supraventricular|ectopia/.test(txt);

  const profile: EcgProfile = {
    hr: isParoxysmalAFib ? 128 : vitalSigns?.heartRate || 74,
    isAFib: isParoxysmalAFib,
    isAnteriorSTEMI: false,
    isInferiorSTEMI: false,
    isPericarditis: false,
    isPeakedT: false,
    isS1Q3T3: false,
    isAlternans: false,
    isLongQT: false,
    isFlatT: false,
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="font-bold text-white flex items-center gap-1.5">
          <Activity className="w-4 h-4 text-sky-400" />
          Tira de Evento Holter Ambulatorio (3 Canales · 25 mm/s)
        </span>
        <span className="text-[11px] text-blue-300/80 font-mono">CM5 · CM1 · aVF</span>
      </div>
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
              <text x="14" y={ch.y - 26} fill="#991B1B" fontSize="11" fontWeight="700" fontFamily="monospace">
                {ch.label}
              </text>
              <polyline
                points={buildLeadPolylinePoints(ch.lead, profile, 8.4, 24, ch.y, 100, 34)}
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

// ---------- SPIROMETRY FLOW-VOLUME & VOLUME-TIME VIEWER ----------

const SpirometryViewer: React.FC<{ study: ComplementaryStudy }> = ({ study }) => {
  const txt = norm(`${study.result} ${study.interpretation || ''}`);
  const hasPosBd =
    /(?:respuesta broncodilatadora(?:\s+significativa)?\s+positiva|mejoria\s+post[- ]?broncodilatador|\+\s*(?:1[2-9]|[2-9]\d)%)/.test(
      txt
    ) &&
    !/(?:no completamente reversible|respuesta broncodilatadora negativa|sin respuesta significativa)/.test(
      txt
    );
  const isCopd =
    !hasPosBd &&
    /(?:\bepoc\b|\bgold\b|no completamente reversible|respuesta broncodilatadora negativa|<\s*12%|limitacion cronica|post-bd\s*0\.[456]\d)/.test(
      txt
    );
  const isAsthma = !isCopd && (study.isAbnormal || hasPosBd || /\basma\b|obstructiv/.test(txt));

  // Flow-Volume points (Vol L on X [0..5], Flow L/s on Y [-6..10])
  const fvSvg = (vol: number, flow: number) => {
    const x = 60 + (vol / 5.2) * 350;
    const y = 175 - flow * 14.5;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  };

  const predictedFV = [
    [0, 0], [0.22, 8.8], [0.65, 9.1], [1.4, 7.2], [2.4, 5.1], [3.5, 3.0], [4.5, 1.0], [4.9, 0],
    [4.4, -3.5], [3.2, -5.6], [1.8, -5.8], [0.6, -4.1], [0, 0],
  ].map(([v, f]) => fvSvg(v, f)).join(' ');

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
      : [
          [0, 0], [0.22, 8.4], [0.65, 8.7], [1.38, 6.9], [2.35, 4.8], [3.4, 2.8], [4.35, 0.95], [4.75, 0],
          [4.2, -3.3], [3.0, -5.3], [1.7, -5.5], [0.55, -3.9], [0, 0],
        ]
  ).map(([v, f]) => fvSvg(v, f)).join(' ');

  const postBdFV = isAsthma
    ? [
        [0, 0], [0.22, 7.8], [0.65, 8.0], [1.35, 6.2], [2.3, 4.3], [3.35, 2.5], [4.25, 0.85], [4.7, 0],
        [4.1, -3.2], [2.9, -5.0], [1.6, -5.1], [0.5, -3.5], [0, 0],
      ].map(([v, f]) => fvSvg(v, f)).join(' ')
    : isCopd
      ? [
          [0, 0], [0.22, 4.35], [0.52, 4.0], [1.05, 2.15], [1.85, 1.15], [2.65, 0.62], [3.4, 0.28], [3.85, 0],
          [3.4, -2.2], [2.25, -3.5], [1.15, -3.3], [0.32, -2.0], [0, 0],
        ].map(([v, f]) => fvSvg(v, f)).join(' ')
      : null;

  // Volume-Time points (t 0..6s on X, Vol 0..5L on Y)
  const vtSvg = (t: number, vol: number) => {
    const x = 60 + (t / 6) * 350;
    const y = 235 - (vol / 5.2) * 195;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  };

  const predVT = [
    [0, 0], [0.3, 1.8], [0.6, 3.0], [1.0, 3.9], [1.8, 4.55], [3.0, 4.82], [4.5, 4.9], [6.0, 4.9],
  ].map(([t, v]) => vtSvg(t, v)).join(' ');

  const basalVT = (isCopd
    ? [[0, 0], [0.4, 1.05], [1.0, 2.05], [2.0, 2.85], [3.2, 3.35], [4.5, 3.62], [6.0, 3.72]]
    : isAsthma
      ? [[0, 0], [0.4, 1.45], [1.0, 2.85], [2.0, 3.75], [3.2, 4.15], [4.5, 4.32], [6.0, 4.4]]
      : [[0, 0], [0.3, 1.72], [0.6, 2.88], [1.0, 3.75], [1.8, 4.4], [3.0, 4.68], [4.5, 4.74], [6.0, 4.75]]
  ).map(([t, v]) => vtSvg(t, v)).join(' ');

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Flow-Volume Loop */}
        <div className="bg-[#040B1B] border border-blue-900/70 rounded-xl p-3">
          <div className="text-[11px] font-bold text-blue-200 mb-1.5">Curva Flujo-Volumen (L/s vs L)</div>
          <svg viewBox="0 0 440 280" className="w-full h-auto block">
            {/* Axes */}
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
            <text x="240" y="274" fill="#94A3B8" fontSize="10" textAnchor="middle">Volumen (Litros)</text>
            <text x="16" y="120" fill="#94A3B8" fontSize="10" transform="rotate(-90 16,120)" textAnchor="middle">Flujo (L/s)</text>

            <polyline points={predictedFV} fill="none" stroke="#94A3B8" strokeWidth="1.6" strokeDasharray="5,4" />
            <polyline points={basalFV} fill="none" stroke="#F59E0B" strokeWidth="2.4" strokeLinejoin="round" />
            {postBdFV && (
              <polyline points={postBdFV} fill="none" stroke="#34D399" strokeWidth="2.2" strokeLinejoin="round" />
            )}
          </svg>
        </div>

        {/* Volume-Time Curve */}
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
            <text x="125" y="38" fill="#38BDF8" fontSize="10" fontFamily="monospace">FEV₁ (1s)</text>
            <text x="240" y="272" fill="#94A3B8" fontSize="10" textAnchor="middle">Tiempo (segundos)</text>

            <polyline points={predVT} fill="none" stroke="#94A3B8" strokeWidth="1.6" strokeDasharray="5,4" />
            <polyline points={basalVT} fill="none" stroke="#F59E0B" strokeWidth="2.4" strokeLinejoin="round" />
            {postVT && (
              <polyline points={postVT} fill="none" stroke="#34D399" strokeWidth="2.2" strokeLinejoin="round" />
            )}
          </svg>
        </div>
      </div>
    </div>
  );
};

// ---------- ELECTROENCEPHALOGRAM (EEG) VIEWER ----------

const EegViewer: React.FC<{ study: ComplementaryStudy }> = ({ study }) => {
  const txt = norm(`${study.result} ${study.interpretation || ''}`);
  const isEpileptiform =
    study.isAbnormal && /punta-onda|puntas|ondas agudas|epileptiforme|f8-t4|descargas/.test(txt);
  const isSlowing = !isEpileptiform && study.isAbnormal && /theta-delta|enlentecid|4-7 hz/.test(txt);

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

  const buildEegPath = (ch: typeof channels[number], idx: number): string => {
    const pts: string[] = [];
    const startX = 95;
    const width = 790;
    const duration = 6.0;
    const steps = 360;
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * duration;
      let uV = 0;

      if (isSlowing) {
        // Diffuse 3.5-5 Hz high-amplitude polymorphic theta-delta slowing
        uV =
          22 * Math.sin(2 * Math.PI * 3.8 * t + idx * 0.7) +
          11 * Math.sin(2 * Math.PI * 5.4 * t + idx * 1.3);
      } else {
        // Physiological alpha (10 Hz) posterior + beta anterior (18 Hz)
        const alphaAmp = ch.region === 'occ' ? 16 : ch.region === 'post' ? 10 : 4;
        const betaAmp = ch.region === 'ant' ? 6 : 3;
        const modulation = 0.65 + 0.35 * Math.sin(2 * Math.PI * 0.6 * t + idx);
        uV =
          alphaAmp * modulation * Math.sin(2 * Math.PI * 10.2 * t + idx * 0.4) +
          betaAmp * Math.sin(2 * Math.PI * 18.5 * t + idx * 1.1);

        // Focal epileptiform spike-and-wave bursts in right temporal (F8-T4 / Fp2-F8 / T4-T6)
        if (isEpileptiform && ch.side === 'R' && (ch.name === 'F8 - T4' || ch.name === 'Fp2 - F8' || ch.name === 'T4 - T6')) {
          const sign = ch.name === 'Fp2 - F8' ? -1 : 1; // phase reversal over F8-T4
          const ampFactor = ch.name === 'F8 - T4' ? 1.0 : 0.65;
          for (const burstCenter of [1.4, 3.25, 4.9]) {
            const dt = t - burstCenter;
            if (Math.abs(dt) < 0.25) {
              // Sharp spike followed by slow after-going wave
              const spike = 44 * Math.exp(-Math.pow((dt + 0.03) / 0.016, 2));
              const slowWave = -24 * Math.exp(-Math.pow((dt - 0.08) / 0.06, 2));
              uV += sign * ampFactor * (spike + slowWave);
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
          {/* 1-second vertical time grid */}
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
          {/* Hemisphere divider */}
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
              <polyline
                points={buildEegPath(ch, idx)}
                fill="none"
                stroke="#0F172A"
                strokeWidth="1.3"
                strokeLinejoin="round"
              />
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
  const isAbnormal = study.isAbnormal;
  const isSensorineural = /neurosensorial|coclear|agudos/.test(txt);
  const freqs = [250, 500, 1000, 2000, 4000, 8000];
  const rightDb = isAbnormal
    ? isSensorineural
      ? [15, 20, 30, 45, 65, 75]
      : [35, 40, 45, 40, 35, 35]
    : [15, 10, 15, 15, 20, 15];
  const leftDb = [15, 15, 10, 15, 15, 20];

  const toX = (i: number) => 65 + (i / (freqs.length - 1)) * 345;
  const toY = (db: number) => 30 + ((db + 10) / 110) * 195;

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="font-bold text-white flex items-center gap-1.5">
          <Activity className="w-4 h-4 text-sky-400" />
          Audiograma Tonal Liminar (Oído Derecho O · Oído Izquierdo X)
        </span>
      </div>
      <div className="bg-[#040B1B] border border-blue-900/70 rounded-xl p-3">
        <svg viewBox="0 0 440 250" className="w-full max-w-lg h-auto block mx-auto">
          {/* Normal zone <= 25 dB */}
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
          <polyline
            points={rightDb.map((d, i) => `${toX(i)},${toY(d)}`).join(' ')}
            fill="none"
            stroke="#F43F5E"
            strokeWidth="2"
          />
          <polyline
            points={leftDb.map((d, i) => `${toX(i)},${toY(d)}`).join(' ')}
            fill="none"
            stroke="#38BDF8"
            strokeWidth="2"
          />
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
      {kind === 'holter' && <HolterStripViewer study={study} vitalSigns={vitalSigns} />}
      {kind === 'spirometry' && <SpirometryViewer study={study} />}
      {kind === 'eeg' && <EegViewer study={study} />}
      {kind === 'audiometry' && <AudiometryViewer study={study} />}
    </div>
  );
};
