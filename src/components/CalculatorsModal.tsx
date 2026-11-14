import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Calculator,
  HeartPulse,
  Droplets,
  Baby,
  ClipboardCheck,
  RotateCcw,
} from 'lucide-react';

interface CalculatorsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type CalcTab = 'hemodinamia' | 'renal' | 'pediatria' | 'escalas';

const TABS: Array<{
  id: CalcTab;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { id: 'hemodinamia', label: 'PAM & Medio Interno', shortLabel: 'PAM/Iones', icon: HeartPulse },
  { id: 'renal', label: 'Función Renal (TFG)', shortLabel: 'Renal/TFG', icon: Droplets },
  { id: 'pediatria', label: 'Dosis Ponderal Pediátrica', shortLabel: 'Pediatría', icon: Baby },
  { id: 'escalas', label: 'Escalas (Centor, CURB-65, Ottawa, Wells, CHA2DS2)', shortLabel: 'Escalas', icon: ClipboardCheck },
];

export const CalculatorsModal: React.FC<CalculatorsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<CalcTab>('hemodinamia');
  const bodyRef = useRef<HTMLDivElement>(null);

  // 1. PAM & Medio Interno (neutral blank inputs)
  const [pas, setPas] = useState('');
  const [pad, setPad] = useState('');
  const [na, setNa] = useState('');
  const [cl, setCl] = useState('');
  const [hco3, setHco3] = useState('');
  const [glucose, setGlucose] = useState('');

  // 2. Función Renal (Cockcroft-Gault & CKD-EPI 2021)
  const [renalAge, setRenalAge] = useState('');
  const [renalSex, setRenalSex] = useState<'M' | 'F'>('M');
  const [renalWeight, setRenalWeight] = useState('');
  const [renalCr, setRenalCr] = useState('');

  // 3. Pediatría (Dosis ponderal)
  const [pedWeight, setPedWeight] = useState('');
  const [pedDoseVal, setPedDoseVal] = useState('');
  const [pedMode, setPedMode] = useState<'dia' | 'dosis'>('dia');
  const [pedIntervalH, setPedIntervalH] = useState<number>(8);
  const [concMg, setConcMg] = useState('250');
  const [concMl, setConcMl] = useState('5');

  // 4. Escalas Clínicas
  // Centor / McIsaac
  const [centorFever, setCentorFever] = useState(false);
  const [centorNoCough, setCentorNoCough] = useState(false);
  const [centorNodes, setCentorNodes] = useState(false);
  const [centorExudate, setCentorExudate] = useState(false);
  const [centorAgeGroup, setCentorAgeGroup] = useState<'lt15' | '15_44' | 'ge45'>('15_44');

  // CURB-65
  const [curbC, setCurbC] = useState(false);
  const [curbU, setCurbU] = useState(false);
  const [curbR, setCurbR] = useState(false);
  const [curbB, setCurbB] = useState(false);
  const [curb65, setCurb65] = useState(false);

  // Ottawa Ankle/Foot
  const [ottawaMaleolarLat, setOttawaMaleolarLat] = useState(false);
  const [ottawaMaleolarMed, setOttawaMaleolarMed] = useState(false);
  const [ottawaNavicular, setOttawaNavicular] = useState(false);
  const [ottawaBase5th, setOttawaBase5th] = useState(false);
  const [ottawaNoSteps, setOttawaNoSteps] = useState(false);

  // Wells TEP
  const [wellsDvt, setWellsDvt] = useState(false);
  const [wellsAltLess, setWellsAltLess] = useState(false);
  const [wellsHr100, setWellsHr100] = useState(false);
  const [wellsImmob, setWellsImmob] = useState(false);
  const [wellsPrev, setWellsPrev] = useState(false);
  const [wellsHemoptysis, setWellsHemoptysis] = useState(false);
  const [wellsCancer, setWellsCancer] = useState(false);

  // CHA2DS2-VASc
  const [chaChf, setChaChf] = useState(false);
  const [chaHtn, setChaHtn] = useState(false);
  const [chaAge75, setChaAge75] = useState(false);
  const [chaAge65, setChaAge65] = useState(false);
  const [chaDm, setChaDm] = useState(false);
  const [chaStroke, setChaStroke] = useState(false);
  const [chaVasc, setChaVasc] = useState(false);
  const [chaFemale, setChaFemale] = useState(false);

  useEffect(() => {
    if (isOpen && bodyRef.current) {
      bodyRef.current.scrollTop = 0;
    }
  }, [isOpen, activeTab]);

  const handleResetAll = () => {
    setPas('');
    setPad('');
    setNa('');
    setCl('');
    setHco3('');
    setGlucose('');
    setRenalAge('');
    setRenalWeight('');
    setRenalCr('');
    setPedWeight('');
    setPedDoseVal('');
    setCentorFever(false);
    setCentorNoCough(false);
    setCentorNodes(false);
    setCentorExudate(false);
    setCentorAgeGroup('15_44');
    setCurbC(false);
    setCurbU(false);
    setCurbR(false);
    setCurbB(false);
    setCurb65(false);
    setOttawaMaleolarLat(false);
    setOttawaMaleolarMed(false);
    setOttawaNavicular(false);
    setOttawaBase5th(false);
    setOttawaNoSteps(false);
    setWellsDvt(false);
    setWellsAltLess(false);
    setWellsHr100(false);
    setWellsImmob(false);
    setWellsPrev(false);
    setWellsHemoptysis(false);
    setWellsCancer(false);
    setChaChf(false);
    setChaHtn(false);
    setChaAge75(false);
    setChaAge65(false);
    setChaDm(false);
    setChaStroke(false);
    setChaVasc(false);
    setChaFemale(false);
  };

  if (!isOpen) return null;

  // Calculations:
  const pasN = Number(pas);
  const padN = Number(pad);
  const pamHasBoth = pas !== '' && pad !== '' && pasN > 0 && padN > 0;
  const pamOrderError = pamHasBoth && pasN <= padN;
  const pamValid = pamHasBoth && pasN > padN && pasN <= 320 && padN <= 220;
  const pamVal = pamValid ? (pasN + 2 * padN) / 3 : null;
  const pulsePressure = pamValid ? pasN - padN : null;

  const naN = Number(na);
  const clN = Number(cl);
  const hco3N = Number(hco3);
  const gluN = Number(glucose);
  const agValid = na !== '' && cl !== '' && hco3 !== '' && naN > 0 && clN >= 0 && hco3N >= 0;
  const anionGap = agValid ? naN - (clN + hco3N) : null;
  const naCorrValid = na !== '' && glucose !== '' && naN > 0 && gluN > 0;
  const naCorrKatz = naCorrValid ? naN + 0.016 * Math.max(0, gluN - 100) : null;
  const naCorrHillier = naCorrValid && gluN > 400 ? naN + 0.024 * (gluN - 100) : null;
  const effOsm = naCorrValid ? 2 * naN + gluN / 18 : null;

  // Renal calculations
  const rAge = Number(renalAge);
  const rWt = Number(renalWeight);
  const rCr = Number(renalCr);
  const renalAgeOutOfBounds = renalAge !== '' && (rAge <= 0 || rAge >= 120);
  const cgValid =
    renalAge !== '' &&
    renalWeight !== '' &&
    renalCr !== '' &&
    rAge > 0 &&
    rAge < 120 &&
    rWt > 0 &&
    rWt <= 300 &&
    rCr > 0 &&
    rCr <= 30;
  const cockcroft = cgValid
    ? (((140 - rAge) * rWt) / (72 * rCr)) * (renalSex === 'F' ? 0.85 : 1)
    : null;

  const ckdValid =
    renalAge !== '' && renalCr !== '' && rAge >= 18 && rAge < 120 && rCr > 0 && rCr <= 30;
  let ckdEpi2021: number | null = null;
  if (ckdValid) {
    const kappa = renalSex === 'F' ? 0.7 : 0.9;
    const alpha = renalSex === 'F' ? -0.241 : -0.302;
    const sexMult = renalSex === 'F' ? 1.012 : 1;
    ckdEpi2021 =
      142 *
      Math.pow(Math.min(rCr / kappa, 1), alpha) *
      Math.pow(Math.max(rCr / kappa, 1), -1.2) *
      Math.pow(0.9938, rAge) *
      sexMult;
  }

  const getKdigoStage = (egfr: number) => {
    if (egfr >= 90) return 'G1 (Normal o alto)';
    if (egfr >= 60) return 'G2 (Levemente disminuida)';
    if (egfr >= 45) return 'G3a (Leve a moderadamente disminuida)';
    if (egfr >= 30) return 'G3b (Moderada a gravemente disminuida)';
    if (egfr >= 15) return 'G4 (Gravemente disminuida)';
    return 'G5 (Falla renal terminal)';
  };

  // Pediatrics
  const pWt = Number(pedWeight);
  const pDose = Number(pedDoseVal);
  const cMg = Number(concMg);
  const cMl = Number(concMl);
  const dosesPerDay = 24 / pedIntervalH;
  const pedValid =
    pedWeight !== '' &&
    pedDoseVal !== '' &&
    pWt > 0 &&
    pWt <= 150 &&
    pDose > 0 &&
    pDose <= 2000;
  const totalMgDay = pedValid ? (pedMode === 'dia' ? pWt * pDose : pWt * pDose * dosesPerDay) : null;
  const mgPerDose = totalMgDay !== null ? totalMgDay / dosesPerDay : null;
  const mlPerDose =
    mgPerDose !== null && cMg > 0 && cMl > 0 ? (mgPerDose * cMl) / cMg : null;

  // Scores
  const centorScore =
    (centorFever ? 1 : 0) +
    (centorNoCough ? 1 : 0) +
    (centorNodes ? 1 : 0) +
    (centorExudate ? 1 : 0) +
    (centorAgeGroup === 'lt15' ? 1 : centorAgeGroup === 'ge45' ? -1 : 0);

  const curbScore =
    (curbC ? 1 : 0) + (curbU ? 1 : 0) + (curbR ? 1 : 0) + (curbB ? 1 : 0) + (curb65 ? 1 : 0);

  const ottawaPositive =
    ottawaMaleolarLat || ottawaMaleolarMed || ottawaNavicular || ottawaBase5th || ottawaNoSteps;

  const wellsScore =
    (wellsDvt ? 3 : 0) +
    (wellsAltLess ? 3 : 0) +
    (wellsHr100 ? 1.5 : 0) +
    (wellsImmob ? 1.5 : 0) +
    (wellsPrev ? 1.5 : 0) +
    (wellsHemoptysis ? 1 : 0) +
    (wellsCancer ? 1 : 0);

  const chaScore =
    (chaChf ? 1 : 0) +
    (chaHtn ? 1 : 0) +
    (chaAge75 ? 2 : chaAge65 ? 1 : 0) +
    (chaDm ? 1 : 0) +
    (chaStroke ? 2 : 0) +
    (chaVasc ? 1 : 0) +
    (chaFemale ? 1 : 0);
  const chaNonSexScore = chaScore - (chaFemale ? 1 : 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-1.5 sm:p-3 lg:p-4 bg-black/85 backdrop-blur-sm">
      <div className="relative w-full max-w-[98vw] sm:max-w-[95vw] lg:max-w-6xl h-[94dvh] sm:h-[90dvh] max-h-[960px] flex flex-col bg-[#07132B] border border-blue-800/70 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-4 sm:px-6 py-3 bg-[#040B1B] border-b border-blue-900/70 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#0D2149] border border-blue-600/60 flex items-center justify-center text-sky-300 shrink-0">
              <Calculator className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-bold text-white tracking-tight truncate">
                Calculadoras Médicas Neutrales (1.er Nivel y Guardia)
              </h3>
              <p className="text-[11px] text-blue-300/80 truncate hidden sm:block">
                Herramientas independientes de cálculo clínico (sin pistas diagnósticas)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleResetAll}
              className="px-2.5 py-1.5 text-[11px] font-semibold text-blue-200 hover:text-white bg-[#0A1A3A] border border-blue-800/70 rounded-lg flex items-center gap-1 cursor-pointer"
              title="Reiniciar todos los valores"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Limpiar</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-blue-200 hover:text-white rounded-lg hover:bg-[#0D2149] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="px-3 sm:px-6 py-2.5 bg-[#050E22] border-b border-blue-900/70 shrink-0">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {TABS.map((t) => {
              const Icon = t.icon;
              const active = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTab(t.id)}
                  className={`px-3 py-1.5 text-[11px] sm:text-xs font-semibold rounded-lg whitespace-nowrap shrink-0 transition-colors cursor-pointer flex items-center gap-1.5 ${
                    active
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-[#040B1B] text-blue-200 hover:text-white border border-blue-900/70'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="sm:hidden">{t.shortLabel}</span>
                  <span className="hidden sm:inline">{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Body */}
        <div ref={bodyRef} className="p-3.5 sm:p-6 flex-1 min-h-0 overflow-y-auto space-y-4">
          {activeTab === 'hemodinamia' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* PAM */}
              <div className="bg-[#040B1B] border border-blue-900/70 rounded-xl p-4 space-y-3">
                <div>
                  <h4 className="text-sm font-bold text-white">Presión Arterial Media (PAM)</h4>
                  <p className="text-[11px] text-blue-300/80">Fórmula: PAM = (PAS + 2 × PAD) / 3</p>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[10px] text-blue-200 block mb-1">PAS (mmHg)</label>
                    <input
                      type="number"
                      value={pas}
                      onChange={(e) => setPas(e.target.value)}
                      placeholder="Ej. 120"
                      className="w-full bg-[#07132B] border border-blue-900/70 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-400"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-blue-200 block mb-1">PAD (mmHg)</label>
                    <input
                      type="number"
                      value={pad}
                      onChange={(e) => setPad(e.target.value)}
                      placeholder="Ej. 80"
                      className="w-full bg-[#07132B] border border-blue-900/70 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-400"
                    />
                  </div>
                </div>
                <div className="bg-[#07132B] border border-blue-800/60 rounded-lg p-3 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-blue-200">PAM calculada:</span>
                    <span className="font-mono font-bold text-white">
                      {pamVal !== null ? `${pamVal.toFixed(1)} mmHg` : '—'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-200">Presión de pulso:</span>
                    <span className="font-mono text-sky-300">
                      {pulsePressure !== null ? `${pulsePressure} mmHg` : '—'}
                    </span>
                  </div>
                  {pamOrderError && (
                    <p className="text-[11px] text-rose-300 pt-1 border-t border-rose-900/60">
                      La PAS debe ser mayor que la PAD para calcular una PAM y presión de pulso válidas.
                    </p>
                  )}
                  {pamVal !== null && (
                    <p className="text-[11px] text-blue-200/85 pt-1 border-t border-blue-900/60">
                      {pamVal < 65
                        ? 'PAM < 65 mmHg: riesgo de hipoperfusión orgánica.'
                        : pamVal <= 100
                          ? 'Rango habitual de perfusión tisular (65–100 mmHg).'
                          : 'PAM elevada (> 100 mmHg).'}
                    </p>
                  )}
                </div>
              </div>

              {/* Anion Gap & Na Corregido */}
              <div className="bg-[#040B1B] border border-blue-900/70 rounded-xl p-4 space-y-3">
                <div>
                  <h4 className="text-sm font-bold text-white">Anión Gap, Na⁺ Corregido y Osmolaridad</h4>
                  <p className="text-[11px] text-blue-300/80">AG = Na⁺ - (Cl⁻ + HCO₃⁻) · Corrección por hiperglucemia</p>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[10px] text-blue-200 block mb-1">Sodio Na⁺ (mEq/L)</label>
                    <input
                      type="number"
                      value={na}
                      onChange={(e) => setNa(e.target.value)}
                      placeholder="Ej. 132"
                      className="w-full bg-[#07132B] border border-blue-900/70 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-400"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-blue-200 block mb-1">Cloro Cl⁻ (mEq/L)</label>
                    <input
                      type="number"
                      value={cl}
                      onChange={(e) => setCl(e.target.value)}
                      placeholder="Ej. 98"
                      className="w-full bg-[#07132B] border border-blue-900/70 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-400"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-blue-200 block mb-1">HCO₃⁻ (mEq/L)</label>
                    <input
                      type="number"
                      value={hco3}
                      onChange={(e) => setHco3(e.target.value)}
                      placeholder="Ej. 14"
                      className="w-full bg-[#07132B] border border-blue-900/70 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-400"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-blue-200 block mb-1">Glucosa (mg/dL)</label>
                    <input
                      type="number"
                      value={glucose}
                      onChange={(e) => setGlucose(e.target.value)}
                      placeholder="Ej. 450"
                      className="w-full bg-[#07132B] border border-blue-900/70 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-400"
                    />
                  </div>
                </div>
                <div className="bg-[#07132B] border border-blue-800/60 rounded-lg p-3 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-blue-200">Anión Gap:</span>
                    <span className="font-mono font-bold text-white">
                      {anionGap !== null ? `${anionGap.toFixed(1)} mEq/L` : '—'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-200">Na⁺ corregido (Katz 1.6):</span>
                    <span className="font-mono font-bold text-sky-300">
                      {naCorrKatz !== null ? `${naCorrKatz.toFixed(1)} mEq/L` : '—'}
                    </span>
                  </div>
                  {naCorrHillier !== null && (
                    <div className="flex justify-between">
                      <span className="text-blue-200">Na⁺ corregido (Hillier 2.4):</span>
                      <span className="font-mono font-bold text-amber-300">
                        {naCorrHillier.toFixed(1)} mEq/L
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-blue-200">Osmolaridad efectiva:</span>
                    <span className="font-mono text-white">
                      {effOsm !== null ? `${effOsm.toFixed(1)} mOsm/kg` : '—'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'renal' && (
            <div className="bg-[#040B1B] border border-blue-900/70 rounded-xl p-4 sm:p-5 space-y-4">
              <div>
                <h4 className="text-sm font-bold text-white">Tasa de Filtración Glomerular (Cockcroft-Gault & CKD-EPI 2021)</h4>
                <p className="text-[11px] text-blue-300/80">
                  Útil para ajuste de dosis renal (Cockcroft-Gault) y estadificación de Enfermedad Renal Crónica (CKD-EPI 2021 sin factor racial).
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-[10px] text-blue-200 block mb-1">Edad (años)</label>
                  <input
                    type="number"
                    value={renalAge}
                    onChange={(e) => setRenalAge(e.target.value)}
                    placeholder="Ej. 58"
                    className="w-full bg-[#07132B] border border-blue-900/70 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-blue-200 block mb-1">Sexo</label>
                  <select
                    value={renalSex}
                    onChange={(e) => setRenalSex(e.target.value as 'M' | 'F')}
                    className="w-full bg-[#07132B] border border-blue-900/70 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-400"
                  >
                    <option value="M">Masculino</option>
                    <option value="F">Femenino</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-blue-200 block mb-1">Peso (kg) [C-G]</label>
                  <input
                    type="number"
                    value={renalWeight}
                    onChange={(e) => setRenalWeight(e.target.value)}
                    placeholder="Ej. 72"
                    className="w-full bg-[#07132B] border border-blue-900/70 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-blue-200 block mb-1">Creatinina (mg/dL)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={renalCr}
                    onChange={(e) => setRenalCr(e.target.value)}
                    placeholder="Ej. 1.4"
                    className="w-full bg-[#07132B] border border-blue-900/70 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-400"
                  />
                </div>
              </div>

              {renalAgeOutOfBounds && (
                <p className="text-[11px] text-rose-300">
                  Ingrese una edad fisiológica válida (1–119 años para Cockcroft-Gault; 18–119 años para CKD-EPI 2021).
                </p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-[#07132B] border border-blue-800/60 rounded-lg p-3.5 space-y-1">
                  <div className="text-[10px] font-bold uppercase text-blue-300">Cockcroft-Gault (Ajuste de fármacos)</div>
                  <div className="text-lg font-mono font-bold text-white">
                    {cockcroft !== null ? `${cockcroft.toFixed(1)} mL/min` : '—'}
                  </div>
                </div>
                <div className="bg-[#07132B] border border-blue-800/60 rounded-lg p-3.5 space-y-1">
                  <div className="text-[10px] font-bold uppercase text-sky-300">CKD-EPI 2021 (Estadificación ERC)</div>
                  <div className="text-lg font-mono font-bold text-white">
                    {ckdEpi2021 !== null ? `${ckdEpi2021.toFixed(1)} mL/min/1.73m²` : '—'}
                  </div>
                  {ckdEpi2021 !== null && (
                    <div className="text-[11px] text-sky-200">{getKdigoStage(ckdEpi2021)}</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'pediatria' && (
            <div className="bg-[#040B1B] border border-blue-900/70 rounded-xl p-4 sm:p-5 space-y-4">
              <div>
                <h4 className="text-sm font-bold text-white">Calculadora de Dosis Ponderal Pediátrica (mg/kg y mL por toma)</h4>
                <p className="text-[11px] text-blue-300/80">
                  Calcule miligramos diarios, por toma y volumen exacto en mililitros según la presentación del jarabe/suspensión.
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] text-blue-200 block mb-1">Peso del niño (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={pedWeight}
                    onChange={(e) => setPedWeight(e.target.value)}
                    placeholder="Ej. 14"
                    className="w-full bg-[#07132B] border border-blue-900/70 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-blue-200 block mb-1">Dosis indicada</label>
                  <input
                    type="number"
                    step="0.5"
                    value={pedDoseVal}
                    onChange={(e) => setPedDoseVal(e.target.value)}
                    placeholder={pedMode === 'dia' ? 'Ej. 50 (mg/kg/día)' : 'Ej. 15 (mg/kg/dosis)'}
                    className="w-full bg-[#07132B] border border-blue-900/70 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-blue-200 block mb-1">Unidad de dosis</label>
                  <select
                    value={pedMode}
                    onChange={(e) => setPedMode(e.target.value as 'dia' | 'dosis')}
                    className="w-full bg-[#07132B] border border-blue-900/70 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-400"
                  >
                    <option value="dia">mg / kg / día</option>
                    <option value="dosis">mg / kg / dosis</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-blue-200 block mb-1">Frecuencia</label>
                  <select
                    value={pedIntervalH}
                    onChange={(e) => setPedIntervalH(Number(e.target.value))}
                    className="w-full bg-[#07132B] border border-blue-900/70 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-400"
                  >
                    <option value={6}>Cada 6 horas (4 tomas/día)</option>
                    <option value={8}>Cada 8 horas (3 tomas/día)</option>
                    <option value={12}>Cada 12 horas (2 tomas/día)</option>
                    <option value={24}>Cada 24 horas (1 toma/día)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-blue-200 block mb-1">Concentración (mg)</label>
                  <input
                    type="number"
                    value={concMg}
                    onChange={(e) => setConcMg(e.target.value)}
                    placeholder="250"
                    className="w-full bg-[#07132B] border border-blue-900/70 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-blue-200 block mb-1">Por cada (mL)</label>
                  <input
                    type="number"
                    value={concMl}
                    onChange={(e) => setConcMl(e.target.value)}
                    placeholder="5"
                    className="w-full bg-[#07132B] border border-blue-900/70 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-[#07132B] border border-blue-800/60 rounded-lg p-3">
                  <div className="text-[10px] text-blue-300 uppercase font-bold">Dosis Total Diaria</div>
                  <div className="text-base font-mono font-bold text-white mt-0.5">
                    {totalMgDay !== null ? `${totalMgDay.toFixed(1)} mg/día` : '—'}
                  </div>
                </div>
                <div className="bg-[#07132B] border border-blue-800/60 rounded-lg p-3">
                  <div className="text-[10px] text-blue-300 uppercase font-bold">Miligramos por Toma</div>
                  <div className="text-base font-mono font-bold text-white mt-0.5">
                    {mgPerDose !== null ? `${mgPerDose.toFixed(1)} mg / toma` : '—'}
                  </div>
                </div>
                <div className="bg-[#07132B] border border-sky-700/60 rounded-lg p-3">
                  <div className="text-[10px] text-sky-300 uppercase font-bold">Volumen por Toma</div>
                  <div className="text-base font-mono font-bold text-sky-300 mt-0.5">
                    {mlPerDose !== null ? `${mlPerDose.toFixed(1)} mL c/${pedIntervalH}h` : '—'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'escalas' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Centor / McIsaac */}
              <div className="bg-[#040B1B] border border-blue-900/70 rounded-xl p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">Criterios de Centor / McIsaac</h4>
                  <span className="font-mono font-bold text-sky-300 bg-[#07132B] px-2 py-0.5 rounded border border-blue-800">
                    {centorScore} pts
                  </span>
                </div>
                <div className="space-y-1.5 text-blue-100">
                  {[
                    { label: 'Fiebre > 38°C (+1)', val: centorFever, set: setCentorFever },
                    { label: 'Ausencia de tos (+1)', val: centorNoCough, set: setCentorNoCough },
                    { label: 'Adenopatía cervical anterior dolorosa (+1)', val: centorNodes, set: setCentorNodes },
                    { label: 'Exudado o hipertrofia amigdalina (+1)', val: centorExudate, set: setCentorExudate },
                  ].map((c, idx) => (
                    <label key={idx} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={c.val}
                        onChange={(e) => c.set(e.target.checked)}
                        className="accent-blue-500"
                      />
                      <span>{c.label}</span>
                    </label>
                  ))}
                  <div className="pt-1">
                    <span className="text-[10px] text-blue-300 block mb-1">Edad del paciente:</span>
                    <select
                      value={centorAgeGroup}
                      onChange={(e) => setCentorAgeGroup(e.target.value as 'lt15' | '15_44' | 'ge45')}
                      className="w-full bg-[#07132B] border border-blue-900/70 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    >
                      <option value="lt15">3 a 14 años (+1 pt)</option>
                      <option value="15_44">15 a 44 años (0 pts)</option>
                      <option value="ge45">≥ 45 años (-1 pt)</option>
                    </select>
                  </div>
                </div>
                <div className="bg-[#07132B] border border-blue-900/60 rounded-lg p-2.5 text-[11px] text-blue-100">
                  {centorScore <= 1
                    ? '0–1 pt: Riesgo muy bajo (<10%). Manejo sintomático; no requiere prueba rápida ni antibiótico.'
                    : centorScore <= 3
                      ? '2–3 pts: Riesgo intermedio. Realizar prueba rápida de antígeno estreptocócico / cultivo.'
                      : '≥ 4 pts: Alta probabilidad de S. pyogenes (>50%). Valorar prueba rápida o tratamiento antibiótico dirigido.'}
                </div>
              </div>

              {/* CURB-65 */}
              <div className="bg-[#040B1B] border border-blue-900/70 rounded-xl p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">Escala CURB-65 (Neumonía)</h4>
                  <span className="font-mono font-bold text-sky-300 bg-[#07132B] px-2 py-0.5 rounded border border-blue-800">
                    {curbScore} / 5
                  </span>
                </div>
                <div className="space-y-1.5 text-blue-100">
                  {[
                    { label: 'C: Confusión de nueva aparición', val: curbC, set: setCurbC },
                    { label: 'U: Urea > 42 mg/dL (o BUN > 19 mg/dL)', val: curbU, set: setCurbU },
                    { label: 'R: Frecuencia respiratoria ≥ 30 rpm', val: curbR, set: setCurbR },
                    { label: 'B: PAS < 90 mmHg o PAD ≤ 60 mmHg', val: curbB, set: setCurbB },
                    { label: '65: Edad ≥ 65 años', val: curb65, set: setCurb65 },
                  ].map((c, idx) => (
                    <label key={idx} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={c.val}
                        onChange={(e) => c.set(e.target.checked)}
                        className="accent-blue-500"
                      />
                      <span>{c.label}</span>
                    </label>
                  ))}
                </div>
                <div className="bg-[#07132B] border border-blue-900/60 rounded-lg p-2.5 text-[11px] text-blue-100">
                  {curbScore <= 1
                    ? '0–1 pt: Mortalidad baja (<2%). Considerar manejo ambulatorio.'
                    : curbScore === 2
                      ? '2 pts: Mortalidad intermedia (~9%). Hospitalización en sala o vigilancia estrecha.'
                      : '3–5 pts: Neumonía grave (mortalidad 15–40%). Hospitalización urgente / valorar UCI.'}
                </div>
              </div>

              {/* Reglas de Ottawa */}
              <div className="bg-[#040B1B] border border-blue-900/70 rounded-xl p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">Reglas de Ottawa (Tobillo / Pie)</h4>
                  <span
                    className={`font-bold text-[10px] uppercase px-2 py-0.5 rounded border ${
                      ottawaPositive
                        ? 'bg-amber-950 border-amber-700 text-amber-200'
                        : 'bg-emerald-950 border-emerald-700 text-emerald-200'
                    }`}
                  >
                    {ottawaPositive ? 'Positiva (Rx indicada)' : 'Negativa (Sin Rx)'}
                  </span>
                </div>
                <div className="space-y-1.5 text-blue-100">
                  {[
                    { label: 'Dolor óseo en borde posterior o punta del maléolo lateral', val: ottawaMaleolarLat, set: setOttawaMaleolarLat },
                    { label: 'Dolor óseo en borde posterior o punta del maléolo medial', val: ottawaMaleolarMed, set: setOttawaMaleolarMed },
                    { label: 'Dolor a la palpación del hueso navicular (escafoides)', val: ottawaNavicular, set: setOttawaNavicular },
                    { label: 'Dolor a la palpación de la base del 5.º metatarsiano', val: ottawaBase5th, set: setOttawaBase5th },
                    { label: 'Incapacidad de dar 4 pasos consecutivos (inmediato o en urgencias)', val: ottawaNoSteps, set: setOttawaNoSteps },
                  ].map((c, idx) => (
                    <label key={idx} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={c.val}
                        onChange={(e) => c.set(e.target.checked)}
                        className="accent-blue-500"
                      />
                      <span>{c.label}</span>
                    </label>
                  ))}
                </div>
                <div className="bg-[#07132B] border border-blue-900/60 rounded-lg p-2.5 text-[11px] text-blue-100">
                  {ottawaPositive
                    ? 'Criterio positivo: Solicitar radiografía de tobillo y/o pie para descartar fractura.'
                    : 'Todos negativos: Sensibilidad >98% para descartar fractura; evita radiación innecesaria.'}
                </div>
              </div>

              {/* Wells TEP & CHA2DS2-VASc */}
              <div className="bg-[#040B1B] border border-blue-900/70 rounded-xl p-4 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white">Wells TEP</h4>
                    <span className="font-mono font-bold text-sky-300 bg-[#07132B] px-2 py-0.5 rounded border border-blue-800">
                      {wellsScore.toFixed(1)} pts
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-1 text-[11px] text-blue-100">
                    {[
                      { label: 'Signos clínicos de TVP (+3)', val: wellsDvt, set: setWellsDvt },
                      { label: 'Diagnóstico alternativo menos probable que TEP (+3)', val: wellsAltLess, set: setWellsAltLess },
                      { label: 'FC > 100 lpm (+1.5)', val: wellsHr100, set: setWellsHr100 },
                      { label: 'Inmovilización ≥3d o cirugía <4 sem (+1.5)', val: wellsImmob, set: setWellsImmob },
                      { label: 'TVP o TEP previo (+1.5)', val: wellsPrev, set: setWellsPrev },
                      { label: 'Hemoptisis (+1)', val: wellsHemoptysis, set: setWellsHemoptysis },
                      { label: 'Cáncer activo últimos 6 meses (+1)', val: wellsCancer, set: setWellsCancer },
                    ].map((c, idx) => (
                      <label key={idx} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={c.val}
                          onChange={(e) => c.set(e.target.checked)}
                          className="accent-blue-500"
                        />
                        <span>{c.label}</span>
                      </label>
                    ))}
                  </div>
                  <div className="bg-[#07132B] border border-blue-900/60 rounded-lg p-2 text-[11px] text-blue-100">
                    {wellsScore <= 4
                      ? '≤ 4 pts (TEP improbable): Solicitar Dímero D.'
                      : '> 4 pts (TEP probable): Realizar Angio-TAC pulmonar.'}
                  </div>
                </div>

                <div className="pt-3 border-t border-blue-900/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white">CHA₂DS₂-VASc (FA)</h4>
                    <span className="font-mono font-bold text-sky-300 bg-[#07132B] px-2 py-0.5 rounded border border-blue-800">
                      {chaScore} pts
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-[11px] text-blue-100">
                    {[
                      { label: 'Insuf. Cardíaca (+1)', val: chaChf, set: setChaChf },
                      { label: 'Hipertensión (+1)', val: chaHtn, set: setChaHtn },
                      { label: 'Edad ≥ 75 (+2)', val: chaAge75, set: setChaAge75 },
                      { label: 'Edad 65–74 (+1)', val: chaAge65, set: setChaAge65 },
                      { label: 'Diabetes (+1)', val: chaDm, set: setChaDm },
                      { label: 'EVC / AIT previo (+2)', val: chaStroke, set: setChaStroke },
                      { label: 'Enf. vascular (+1)', val: chaVasc, set: setChaVasc },
                      { label: 'Sexo femenino (+1)', val: chaFemale, set: setChaFemale },
                    ].map((c, idx) => (
                      <label key={idx} className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={c.val}
                          onChange={(e) => c.set(e.target.checked)}
                          className="accent-blue-500"
                        />
                        <span>{c.label}</span>
                      </label>
                    ))}
                  </div>
                  <div className="bg-[#07132B] border border-blue-900/60 rounded-lg p-2 text-[11px] text-blue-100">
                    {chaNonSexScore >= 2
                      ? '≥ 2 pts no-sexo (≥2 en hombres, ≥3 en mujeres): Indicación sólida (Clase I) de anticoagulación oral (ACOD o Warfarina).'
                      : chaNonSexScore === 1
                        ? '1 pt no-sexo (1 en hombre, 2 en mujer): Considerar anticoagulación oral (Clase IIa) valorando riesgo hemorrágico (HAS-BLED).'
                        : '0 pts no-sexo (o 1 pt únicamente por sexo femenino): Riesgo embólico bajo; sin indicación rutinaria de anticoagulación.'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-3 bg-[#040B1B] border-t border-blue-900/70 flex items-center justify-between gap-2 shrink-0">
          <span className="text-[11px] text-blue-300/75">
            Herramienta neutra de apoyo al razonamiento médico
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-white hover:bg-blue-100 text-[#030A1C] text-xs font-bold rounded-lg transition-colors cursor-pointer"
          >
            Cerrar Calculadoras
          </button>
        </div>
      </div>
    </div>
  );
};
