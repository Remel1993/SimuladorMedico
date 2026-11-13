import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { VitalSignsMonitor } from './components/VitalSignsMonitor';
import { PatientBanner } from './components/PatientBanner';
import { AnamnesisTab } from './components/AnamnesisTab';
import { BackgroundTab } from './components/BackgroundTab';
import { PhysicalExamTab } from './components/PhysicalExamTab';
import { DiagnosticStudiesTab } from './components/DiagnosticStudiesTab';
import { DiagnosticTab } from './components/DiagnosticTab';
import { TreatmentTab } from './components/TreatmentTab';
import { ClinicalAuditTab } from './components/ClinicalAuditTab';
import { HomeDashboard } from './components/HomeDashboard';
import { NewCaseModal } from './components/NewCaseModal';
import { CaseHistoryModal } from './components/CaseHistoryModal';
import { ClinicalGuideModal } from './components/ClinicalGuideModal';
import { ClinicalOutcomeModal } from './components/ClinicalOutcomeModal';

import { ALL_CURATED_CASES } from './data/allCases';
import { enrichCaseWithHospitalCatalog } from './utils/studiesCatalog';
import { enrichCaseWithUniversalPhysicalExam } from './utils/physicalExamCatalog';
import {
  buildDidacticEvaluation,
  enrichEvaluationWithDidactics,
  determineClinicalOutcome,
  DramaticOutcome,
} from './utils/caseEvaluation';
import {
  ClinicalCase,
  ChatMessage,
  MedicationItem,
  EvaluationResult,
  SavedCaseRecord,
  GameMode,
  Specialty,
  UserEvaluationInput,
} from './types/clinical';

import {
  MessageSquare,
  FileText,
  Stethoscope,
  FlaskConical,
  Brain,
  Pill,
  Award,
  Timer,
  Flame,
  ShieldCheck,
  AlertTriangle,
  CheckSquare,
  Square,
} from 'lucide-react';

const URGENCIAS_WINDOW_SECONDS = 8 * 60;
const EXAMEN_WINDOW_SECONDS = 12 * 60;

const ABCDE_ITEMS = [
  { id: 'A', label: 'A · Vía Aérea / Cervical' },
  { id: 'B', label: 'B · Ventilación / O₂' },
  { id: 'C', label: 'C · Circulación / Vías IV' },
  { id: 'D', label: 'D · Déficit Neurológico' },
  { id: 'E', label: 'E · Exposición / Alergias' },
];

export default function App() {
  // General Interface vs Active Clinical Simulation
  const [activeView, setActiveView] = useState<'lobby' | 'simulation'>('lobby');

  // Current Case State
  const [currentCase, setCurrentCase] = useState<ClinicalCase>(() =>
    enrichCaseWithUniversalPhysicalExam(enrichCaseWithHospitalCatalog(ALL_CURATED_CASES[0]))
  );
  const [activeTab, setActiveTab] = useState<
    'anamnesis' | 'background' | 'physical_exam' | 'studies' | 'diagnosis' | 'treatment' | 'audit'
  >('anamnesis');

  // Interactive Exploration Tracking
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [unlockedExamIds, setUnlockedExamIds] = useState<string[]>([]);
  const [unlockedStudyIds, setUnlockedStudyIds] = useState<string[]>([]);

  // Diagnostics and Treatment Form States
  const [primaryDiagnosis, setPrimaryDiagnosis] = useState('');
  const [differentialDiagnoses, setDifferentialDiagnoses] = useState<string[]>([]);
  const [clinicalJustification, setClinicalJustification] = useState('');
  const [additionalStudiesNeeded, setAdditionalStudiesNeeded] = useState('');

  const [medications, setMedications] = useState<MedicationItem[]>([]);
  const [generalMeasures, setGeneralMeasures] = useState('');
  const [hospitalizationDecision, setHospitalizationDecision] = useState('Hospitalización en Sala');
  const [referralCriteria, setReferralCriteria] = useState('');
  const [followUpPlan, setFollowUpPlan] = useState('');

  // Evaluation and History State
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);
  const [history, setHistory] = useState<SavedCaseRecord[]>([]);

  // Modals & Dramatic Outcome Stage
  const [newCaseModalOpen, setNewCaseModalOpen] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [guideModalOpen, setGuideModalOpen] = useState(false);
  const [isGeneratingCase, setIsGeneratingCase] = useState(false);
  const [pendingOutcome, setPendingOutcome] = useState<DramaticOutcome | null>(null);
  const [recentCaseIds, setRecentCaseIds] = useState<string[]>([]);
  const [recentDiagnoses, setRecentDiagnoses] = useState<string[]>([]);

  // Consultation Timer & Mode Mechanics
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [abcdeChecked, setAbcdeChecked] = useState<string[]>([]);
  const examAutoSubmittedRef = useRef(false);
  const latestFinishRef = useRef<() => void>(() => {});

  // Initialize Load LocalStorage History
  useEffect(() => {
    try {
      const savedHist = localStorage.getItem('mcs_case_history_v1');
      if (savedHist) {
        const parsedHist = JSON.parse(savedHist) as SavedCaseRecord[];
        setHistory(parsedHist);
        setRecentCaseIds(Array.from(new Set(parsedHist.map((h) => h.caseId).filter(Boolean))).slice(0, 18));
        setRecentDiagnoses(
          Array.from(new Set(parsedHist.map((h) => h.correctDiagnosis).filter(Boolean))).slice(0, 15)
        );
      }
    } catch (e) {
      console.warn('Could not read history from localStorage', e);
    }
  }, []);

  // Timer Tick (only runs while attending an active unresolved case)
  useEffect(() => {
    if (activeView !== 'simulation' || evaluationResult) return;
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [activeView, evaluationResult]);

  // Set up case initial dialogue and enter simulation view
  const setupCase = (newCase: ClinicalCase) => {
    const enriched = enrichCaseWithUniversalPhysicalExam(enrichCaseWithHospitalCatalog(newCase));
    setCurrentCase(enriched);
    setRecentCaseIds((prev) => {
      const updated = prev.includes(enriched.id) ? prev : [...prev, enriched.id];
      return updated.length >= ALL_CURATED_CASES.length ? [enriched.id] : updated;
    });
    if (enriched.solution?.correctDiagnosis) {
      setRecentDiagnoses((prev) => {
        const diag = enriched.solution.correctDiagnosis;
        if (prev.includes(diag)) return prev;
        return [...prev.slice(-14), diag];
      });
    }
    setActiveView('simulation');
    setActiveTab('anamnesis');
    setUnlockedExamIds([]);
    setUnlockedStudyIds([]);
    setPrimaryDiagnosis('');
    setDifferentialDiagnoses([]);
    setClinicalJustification('');
    setAdditionalStudiesNeeded('');
    setMedications([]);
    setGeneralMeasures('');
    setHospitalizationDecision(
      enriched.patientInfo.triageLevel.includes('Reanimación')
        ? 'Unidad de Cuidados Intensivos (UCI)'
        : 'Hospitalización en Sala'
    );
    setReferralCriteria('');
    setFollowUpPlan('');
    setEvaluationResult(null);
    setPendingOutcome(null);
    setElapsedSeconds(0);
    setAbcdeChecked([]);
    examAutoSubmittedRef.current = false;

    const isPediatric = enriched.patientInfo.age < 12;
    const greetingText = isPediatric
      ? `Buenos días doctor, gracias por atendernos tan rápido. Soy la mamá de ${enriched.patientInfo.name.replace(/\s*\([^)]*\)/, '')}; traje a mi niño porque se ha sentido bastante mal.`
      : `Buenos días doctor, gracias por atenderme. Me llamo ${enriched.patientInfo.name}. Vengo a consulta porque me he estado sintiendo bastante mal y necesito que me revise, por favor.`;

    // Initial greeting from patient (spoiler-free)
    setMessages([
      {
        id: `msg-init-${Date.now()}`,
        sender: 'patient',
        text: greetingText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  // Save history helper
  const saveToHistory = (evalRes: EvaluationResult, caseItem: ClinicalCase, userDiag: string) => {
    const record: SavedCaseRecord = {
      id: `hist-${Date.now()}`,
      caseId: caseItem.id,
      patientName: caseItem.patientInfo.name,
      specialty: caseItem.specialty,
      mode: caseItem.mode,
      userDiagnosis: userDiag || 'Sin diagnóstico registrado',
      correctDiagnosis: caseItem.solution.correctDiagnosis,
      score: evalRes.totalScore,
      date: new Date().toISOString(),
      evaluation: evalRes,
    };

    const updated = [record, ...history];
    setHistory(updated);
    try {
      localStorage.setItem('mcs_case_history_v1', JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not save history to localStorage', e);
    }
  };

  // Chat Handler
  const handleSendMessage = async (text: string) => {
    const newDocMsg: ChatMessage = {
      id: `msg-doc-${Date.now()}`,
      sender: 'doctor',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...messages, newDocMsg];
    setMessages(updatedMessages);
    setIsChatLoading(true);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 14000);

      const response = await fetch('/api/patient-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          history: updatedMessages,
          userMessage: text,
          patientPersona: currentCase.internalPersonaPrompt,
          patientInfo: currentCase.patientInfo,
          vitalSigns: currentCase.vitalSigns,
          background: currentCase.background,
          caseId: currentCase.id,
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const data = await response.json();
      const patientReply =
        data.reply ||
        'Disculpe doctor, me siento bastante mal y débil. ¿Me podría repetir eso con otras palabras?';

      setMessages((prev) => [
        ...prev,
        {
          id: `msg-pat-${Date.now()}`,
          sender: 'patient',
          text: patientReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-err-${Date.now()}`,
          sender: 'patient',
          text: 'Disculpe doctor, me distraje un segundo con el malestar que traigo. ¿Me puede repetir su pregunta?',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Unlock physical exam finding
  const handleUnlockExam = (id: string) => {
    if (!unlockedExamIds.includes(id)) {
      setUnlockedExamIds([...unlockedExamIds, id]);
    }
  };

  const handleUnlockAllExams = () => {
    setUnlockedExamIds(currentCase.physicalExamPool.map((e) => e.id));
  };

  // Unlock complementary study report
  const handleUnlockStudy = (id: string) => {
    if (!unlockedStudyIds.includes(id)) {
      setUnlockedStudyIds([...unlockedStudyIds, id]);
    }
  };

  const handleUnlockAllStudies = () => {
    setUnlockedStudyIds(currentCase.studiesPool.map((s) => s.id));
  };

  // Generate / Load new clinical case
  const handleSelectCase = async (mode: GameMode, specialty: Specialty, caseId?: string) => {
    setIsGeneratingCase(true);
    try {
      const response = await fetch('/api/generate-case', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          specialty,
          caseId,
          excludeCaseId: activeView === 'simulation' ? currentCase.id : undefined,
          excludeCaseIds: recentCaseIds,
          excludeDiagnoses: recentDiagnoses,
        }),
      });
      const data = await response.json();
      if (data.case) {
        setupCase(data.case);
        setNewCaseModalOpen(false);
      }
    } catch (err) {
      console.error('Error fetching case:', err);
    } finally {
      setIsGeneratingCase(false);
    }
  };

  // Finish and Evaluate Case
  const handleFinishCase = async () => {
    setIsEvaluating(true);
    const doctorQuestions = messages.filter((m) => m.sender === 'doctor').map((m) => m.text);

    const submission: UserEvaluationInput = {
      primaryDiagnosis,
      differentialDiagnoses,
      clinicalJustification,
      additionalStudiesNeeded,
      pharmacologicalPlan: medications,
      generalMeasures,
      hospitalizationDecision,
      referralCriteria,
      followUpPlan,
      unlockedExams: unlockedExamIds,
      unlockedStudies: unlockedStudyIds,
      questionCount: doctorQuestions.length,
      doctorQuestions,
      timeSpentSeconds: elapsedSeconds,
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 13000);

      const response = await fetch('/api/evaluate-case', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userSubmission: submission,
          caseData: currentCase,
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        if (data && data.evaluation) {
          const enrichedEval = enrichEvaluationWithDidactics(data.evaluation, submission, currentCase);
          setEvaluationResult(enrichedEval);
          saveToHistory(enrichedEval, currentCase, primaryDiagnosis);
          setPendingOutcome(determineClinicalOutcome(enrichedEval, currentCase));
          setIsEvaluating(false);
          return;
        }
      }
    } catch {
      // Smoothly switch to deterministic didactic evaluation
    }

    // Guaranteed immediate didactic evaluation fallback so user is NEVER stuck:
    const fallbackEval = buildDidacticEvaluation(submission, currentCase);
    setEvaluationResult(fallbackEval);
    saveToHistory(fallbackEval, currentCase, primaryDiagnosis);
    setPendingOutcome(determineClinicalOutcome(fallbackEval, currentCase));
    setIsEvaluating(false);
  };

  // Keep latest finish handler for timed Exam auto-submit
  latestFinishRef.current = () => {
    void handleFinishCase();
  };

  useEffect(() => {
    if (
      activeView === 'simulation' &&
      !evaluationResult &&
      !isEvaluating &&
      currentCase.mode === 'examen' &&
      elapsedSeconds >= EXAMEN_WINDOW_SECONDS &&
      !examAutoSubmittedRef.current
    ) {
      examAutoSubmittedRef.current = true;
      latestFinishRef.current();
    }
  }, [elapsedSeconds, activeView, evaluationResult, isEvaluating, currentCase.mode]);

  const toggleAbcdeStep = (id: string) => {
    setAbcdeChecked((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const isUrgenciasMode = currentCase.mode === 'urgencias';
  const isExamenMode = currentCase.mode === 'examen';
  const urgenciasRemaining = Math.max(0, URGENCIAS_WINDOW_SECONDS - elapsedSeconds);
  const examenRemaining = Math.max(0, EXAMEN_WINDOW_SECONDS - elapsedSeconds);

  // Format Elapsed Time
  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Review past case from history
  const handleReviewPastCase = (record: SavedCaseRecord) => {
    const found = ALL_CURATED_CASES.find((c) => c.id === record.caseId) || {
      ...currentCase,
      solution: {
        ...currentCase.solution,
        correctDiagnosis: record.correctDiagnosis,
      },
    };
    setCurrentCase(enrichCaseWithUniversalPhysicalExam(enrichCaseWithHospitalCatalog(found)));
    setEvaluationResult(record.evaluation);
    setPendingOutcome(null);
    setActiveView('simulation');
    setActiveTab('audit');
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#020617] text-white flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      {/* Top Bar Contract Navigation */}
      <Navbar
        activeView={activeView}
        onGoHome={() => setActiveView('lobby')}
        onOpenNewCaseModal={() => setNewCaseModalOpen(true)}
        onOpenHistoryModal={() => setHistoryModalOpen(true)}
        onOpenGuideModal={() => setGuideModalOpen(true)}
        onRestartCase={() => setupCase(currentCase)}
        currentMode={currentCase.mode}
        currentSpecialty={currentCase.specialty}
        historyCount={history.length}
      />

      {activeView === 'lobby' ? (
        <HomeDashboard
          onStartSimulation={handleSelectCase}
          onOpenPresetsModal={() => setNewCaseModalOpen(true)}
          onOpenHistoryModal={() => setHistoryModalOpen(true)}
          onOpenGuideModal={() => setGuideModalOpen(true)}
          isLoading={isGeneratingCase}
          history={history}
        />
      ) : (
        <>
          {/* Persistent Vital Signs Monitor */}
          <VitalSignsMonitor
            vitals={currentCase.vitalSigns}
            triageLevel={currentCase.patientInfo.triageLevel}
          />

          {/* Patient Identity Banner */}
          <PatientBanner caseData={currentCase} />

          {/* Workspace Container */}
          <main className="flex-1 max-w-7xl w-full min-w-0 mx-auto px-3 sm:px-4 py-4 sm:py-5 space-y-4 sm:space-y-5">
        {/* Workspace Toolbar: Tabs + Timer */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5 bg-[#07132B] border border-blue-900/60 rounded-xl p-2 shadow-md">
          {/* Segmented Navigation Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full md:w-auto pb-0.5 md:pb-0">
            {[
              { id: 'anamnesis', label: '1. Anamnesis', icon: MessageSquare },
              { id: 'background', label: '2. Antecedentes', icon: FileText },
              { id: 'physical_exam', label: '3. Examen Físico', icon: Stethoscope },
              { id: 'studies', label: '4. Estudios', icon: FlaskConical },
              { id: 'diagnosis', label: '5. Diagnóstico', icon: Brain },
              { id: 'treatment', label: '6. Tratamiento', icon: Pill },
              ...(evaluationResult && !pendingOutcome
                ? [{ id: 'audit', label: '7. Auditoría', icon: Award }]
                : []),
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-950/80 ring-1 ring-blue-400/50'
                      : 'text-blue-200/80 hover:text-white hover:bg-[#0D2149]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Consultation Timer & Mode Status */}
          <div className="flex items-center justify-between md:justify-end gap-2.5 shrink-0 px-2 pt-1 md:pt-0 border-t md:border-t-0 border-blue-900/50">
            <span className="text-[11px] text-blue-300/70 md:hidden font-medium">
              Deslice las pestañas
            </span>

            {isUrgenciasMode ? (
              <div
                className={`flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-lg border ${
                  urgenciasRemaining === 0
                    ? 'bg-rose-950/70 border-rose-500/80 text-rose-200 animate-pulse'
                    : urgenciasRemaining <= 120
                    ? 'bg-amber-950/60 border-amber-500/70 text-amber-200'
                    : 'bg-[#040B1B] border-amber-700/60 text-amber-200'
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="font-sans text-[11px] font-semibold">Ventana Crítica:</span>
                <span className="font-bold text-white">
                  {urgenciasRemaining > 0 ? formatTimer(urgenciasRemaining) : 'EXCEDIDA'}
                </span>
              </div>
            ) : isExamenMode ? (
              <div
                className={`flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-lg border ${
                  examenRemaining <= 60
                    ? 'bg-rose-950/70 border-rose-500/80 text-rose-200 animate-pulse'
                    : 'bg-[#040B1B] border-sky-600/70 text-sky-200'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span className="font-sans text-[11px] font-semibold">Examen:</span>
                <span className="font-bold text-white">{formatTimer(examenRemaining)}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-xs text-blue-200/80 font-mono">
                <Timer className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span className="hidden sm:inline">Tiempo de Consulta:</span>
                <span className="sm:hidden">Tiempo:</span>
                <span className="font-bold text-white">{formatTimer(elapsedSeconds)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Mode-Specific Interactive Strip: Urgencias ABCDE Checklist or Modo Examen Strict Notice */}
        {!evaluationResult && isUrgenciasMode && (
          <div className="bg-gradient-to-r from-amber-950/40 via-[#07132B] to-[#07132B] border border-amber-600/50 rounded-xl p-3 sm:p-3.5 space-y-2 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 text-amber-300 font-bold">
                <Flame className="w-4 h-4 shrink-0" />
                <span>Protocolo Rápido de Estabilización ABCDE (Urgencias)</span>
              </div>
              <span className="text-[11px] font-mono text-amber-200">
                Completado: {abcdeChecked.length}/5
              </span>
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
              {ABCDE_ITEMS.map((step) => {
                const checked = abcdeChecked.includes(step.id);
                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => toggleAbcdeStep(step.id)}
                    className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-medium whitespace-nowrap shrink-0 flex items-center gap-1.5 transition-colors cursor-pointer ${
                      checked
                        ? 'bg-emerald-950/60 border-emerald-500/70 text-emerald-200'
                        : 'bg-[#040B1B] border-blue-900/70 text-blue-100 hover:border-amber-500/60'
                    }`}
                  >
                    {checked ? (
                      <CheckSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    ) : (
                      <Square className="w-3.5 h-3.5 text-amber-400/80 shrink-0" />
                    )}
                    <span>{step.label}</span>
                  </button>
                );
              })}
            </div>
            {urgenciasRemaining === 0 && (
              <div className="text-[11px] text-rose-200 flex items-center gap-1.5 pt-0.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>
                  Ventana de oro (8 min) superada: defina inmediatamente su diagnóstico y conducta terapéutica en las pestañas 5 y 6.
                </span>
              </div>
            )}
          </div>
        )}

        {!evaluationResult && isExamenMode && (
          <div className="bg-[#050E24] border border-sky-700/60 rounded-xl px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-sky-200">
              <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" />
              <span>
                <strong className="text-white">Evaluación Ciega (Modo Examen):</strong> Sin preguntas sugeridas, sin botones de desbloqueo masivo y sin alertas visuales en hallazgos.
              </span>
            </div>
            {examenRemaining <= 60 && (
              <span className="text-[11px] font-bold text-rose-300 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                Último minuto (envío automático al llegar a 00:00)
              </span>
            )}
          </div>
        )}

        {/* Tab Content Rendering */}
        <div className="transition-all min-w-0">
          {activeTab === 'anamnesis' && (
            <AnamnesisTab
              caseData={currentCase}
              messages={messages}
              onSendMessage={handleSendMessage}
              isLoading={isChatLoading}
            />
          )}

          {activeTab === 'background' && <BackgroundTab caseData={currentCase} />}

          {activeTab === 'physical_exam' && (
            <PhysicalExamTab
              caseData={currentCase}
              unlockedExamIds={unlockedExamIds}
              onUnlockExam={handleUnlockExam}
              onUnlockAllExams={handleUnlockAllExams}
            />
          )}

          {activeTab === 'studies' && (
            <DiagnosticStudiesTab
              caseData={currentCase}
              unlockedStudyIds={unlockedStudyIds}
              onUnlockStudy={handleUnlockStudy}
              onUnlockAllStudies={handleUnlockAllStudies}
            />
          )}

          {activeTab === 'diagnosis' && (
            <DiagnosticTab
              primaryDiagnosis={primaryDiagnosis}
              setPrimaryDiagnosis={setPrimaryDiagnosis}
              differentialDiagnoses={differentialDiagnoses}
              setDifferentialDiagnoses={setDifferentialDiagnoses}
              clinicalJustification={clinicalJustification}
              setClinicalJustification={setClinicalJustification}
              additionalStudiesNeeded={additionalStudiesNeeded}
              setAdditionalStudiesNeeded={setAdditionalStudiesNeeded}
              onProceedToTreatment={() => setActiveTab('treatment')}
            />
          )}

          {activeTab === 'treatment' && (
            <TreatmentTab
              medications={medications}
              setMedications={setMedications}
              generalMeasures={generalMeasures}
              setGeneralMeasures={setGeneralMeasures}
              hospitalizationDecision={hospitalizationDecision}
              setHospitalizationDecision={setHospitalizationDecision}
              referralCriteria={referralCriteria}
              setReferralCriteria={setReferralCriteria}
              followUpPlan={followUpPlan}
              setFollowUpPlan={setFollowUpPlan}
              onFinishCase={handleFinishCase}
              isEvaluating={isEvaluating}
            />
          )}

          {activeTab === 'audit' && evaluationResult && (
            <ClinicalAuditTab
              caseData={currentCase}
              evaluation={evaluationResult}
              onNextCase={() => setNewCaseModalOpen(true)}
            />
          )}
            </div>
          </main>
        </>
      )}

      {/* Modals */}
      <NewCaseModal
        isOpen={newCaseModalOpen}
        onClose={() => setNewCaseModalOpen(false)}
        onSelectCase={handleSelectCase}
        isLoading={isGeneratingCase}
      />

      <CaseHistoryModal
        isOpen={historyModalOpen}
        onClose={() => setHistoryModalOpen(false)}
        history={history}
        onClearHistory={() => {
          setHistory([]);
          localStorage.removeItem('mcs_case_history_v1');
        }}
        onReviewCase={handleReviewPastCase}
      />

      <ClinicalGuideModal
        isOpen={guideModalOpen}
        onClose={() => setGuideModalOpen(false)}
      />

      <ClinicalOutcomeModal
        outcome={pendingOutcome}
        patientName={currentCase.patientInfo.name}
        onContinueToAudit={() => {
          setPendingOutcome(null);
          setActiveTab('audit');
        }}
      />
    </div>
  );
}
