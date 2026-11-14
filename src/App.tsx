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
import { StatStabilizationDrawer } from './components/StatStabilizationDrawer';
import { ClinicalAuditTab } from './components/ClinicalAuditTab';
import { HomeDashboard } from './components/HomeDashboard';
import { NewCaseModal } from './components/NewCaseModal';
import { CaseHistoryModal } from './components/CaseHistoryModal';
import { ClinicalGuideModal } from './components/ClinicalGuideModal';
import { CalculatorsModal } from './components/CalculatorsModal';
import { ClinicalOutcomeModal } from './components/ClinicalOutcomeModal';

import { applyStatIntervention, StatApplyInput } from './utils/statStabilization';
import { generateContextualPatientReply, PatientChatPayload } from '../serverPatientChat';

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
  StatInterventionRecord,
  UserEvaluationInput,
  VitalSigns,
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
} from 'lucide-react';

const URGENCIAS_WINDOW_SECONDS = 8 * 60;
const EXAMEN_WINDOW_SECONDS = 12 * 60;

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

  // Live Vitals & STAT Stabilization Tracking
  const [liveVitalSigns, setLiveVitalSigns] = useState<VitalSigns>(() => ALL_CURATED_CASES[0].vitalSigns);
  const [statInterventions, setStatInterventions] = useState<StatInterventionRecord[]>([]);
  const [statDrawerOpen, setStatDrawerOpen] = useState(false);

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
  const [hospitalizationDecision, setHospitalizationDecision] = useState('');
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
  const [calculatorsModalOpen, setCalculatorsModalOpen] = useState(false);
  const [isGeneratingCase, setIsGeneratingCase] = useState(false);
  const [pendingOutcome, setPendingOutcome] = useState<DramaticOutcome | null>(null);
  const [recentCaseIds, setRecentCaseIds] = useState<string[]>([]);
  const [recentDiagnoses, setRecentDiagnoses] = useState<string[]>([]);

  // Consultation Timer & Mode Mechanics
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const examAutoSubmittedRef = useRef(false);
  const latestFinishRef = useRef<() => void>(() => {});
  const chatAbortRef = useRef<AbortController | null>(null);
  const activeChatCaseIdRef = useRef<string>(ALL_CURATED_CASES[0].id);

  // Initialize Load LocalStorage History & Seen-Cases Anti-Repetition Deck
  useEffect(() => {
    try {
      let seenIds: string[] = [];
      let seenDiags: string[] = [];

      const savedSeenIds = localStorage.getItem('mcs_seen_case_ids_v1');
      if (savedSeenIds) {
        const parsedIds = JSON.parse(savedSeenIds);
        if (Array.isArray(parsedIds)) seenIds = parsedIds.filter(Boolean);
      }

      const savedSeenDiags = localStorage.getItem('mcs_seen_diagnoses_v1');
      if (savedSeenDiags) {
        const parsedDiags = JSON.parse(savedSeenDiags);
        if (Array.isArray(parsedDiags)) seenDiags = parsedDiags.filter(Boolean);
      }

      const savedHist = localStorage.getItem('mcs_case_history_v1');
      if (savedHist) {
        const parsedHist = JSON.parse(savedHist) as SavedCaseRecord[];
        setHistory(parsedHist);
        for (const h of parsedHist) {
          if (h.caseId && !seenIds.includes(h.caseId)) seenIds.push(h.caseId);
          if (h.correctDiagnosis && !seenDiags.includes(h.correctDiagnosis)) {
            seenDiags.push(h.correctDiagnosis);
          }
        }
      }

      setRecentCaseIds(seenIds.slice(-(ALL_CURATED_CASES.length - 1)));
      setRecentDiagnoses(seenDiags.slice(-65));
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

  // Reset window scroll to top whenever changing views, simulation tabs, cases, or outcome stage
  useEffect(() => {
    const resetTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };
    resetTop();
    const rafId = window.requestAnimationFrame(resetTop);
    return () => window.cancelAnimationFrame(rafId);
  }, [activeView, activeTab, currentCase.id, pendingOutcome]);

  // Set up case initial dialogue and enter simulation view
  const setupCase = (newCase: ClinicalCase) => {
    chatAbortRef.current?.abort();
    chatAbortRef.current = null;
    const enriched = enrichCaseWithUniversalPhysicalExam(enrichCaseWithHospitalCatalog(newCase));
    activeChatCaseIdRef.current = enriched.id;
    setIsChatLoading(false);
    setCurrentCase(enriched);
    setRecentCaseIds((prev) => {
      const withoutCurrent = prev.filter((id) => id !== enriched.id);
      const updated = [...withoutCurrent, enriched.id].slice(-(ALL_CURATED_CASES.length - 1));
      try {
        localStorage.setItem('mcs_seen_case_ids_v1', JSON.stringify(updated));
      } catch {
        // Ignore storage quota errors
      }
      return updated;
    });
    if (enriched.solution?.correctDiagnosis) {
      setRecentDiagnoses((prev) => {
        const diag = enriched.solution.correctDiagnosis;
        const withoutDiag = prev.filter((d) => d !== diag);
        const updatedDiags = [...withoutDiag, diag].slice(-75);
        try {
          localStorage.setItem('mcs_seen_diagnoses_v1', JSON.stringify(updatedDiags));
        } catch {
          // Ignore storage quota errors
        }
        return updatedDiags;
      });
    }
    setActiveView('simulation');
    setActiveTab('anamnesis');
    setLiveVitalSigns(enriched.vitalSigns);
    setStatInterventions([]);
    setStatDrawerOpen(false);
    setUnlockedExamIds([]);
    setUnlockedStudyIds([]);
    setPrimaryDiagnosis('');
    setDifferentialDiagnoses([]);
    setClinicalJustification('');
    setAdditionalStudiesNeeded('');
    setMedications([]);
    setGeneralMeasures('');
    setHospitalizationDecision('');
    setReferralCriteria('');
    setFollowUpPlan('');
    setEvaluationResult(null);
    setPendingOutcome(null);
    setElapsedSeconds(0);
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
    const requestCaseId = currentCase.id;
    activeChatCaseIdRef.current = requestCaseId;

    const newDocMsg: ChatMessage = {
      id: `msg-doc-${Date.now()}`,
      sender: 'doctor',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...messages, newDocMsg];
    setMessages(updatedMessages);
    setIsChatLoading(true);

    const chatPayload: PatientChatPayload = {
      history: updatedMessages.slice(0, -1),
      userMessage: text,
      patientPersona: currentCase.internalPersonaPrompt,
      patientInfo: currentCase.patientInfo,
      vitalSigns: currentCase.vitalSigns,
      liveVitalSigns,
      appliedStatInterventions: statInterventions.map((s) => ({
        label: s.label,
        drug: s.drug,
        dose: s.dose,
        route: s.route,
        effectSeverity: s.effectSeverity,
        patientFeelingNote: s.patientFeelingNote,
        deltasSummary: s.deltas.map((d) => `${d.metric} ${d.before}->${d.after}`).join(', '),
      })),
      background: currentCase.background,
      clinicalClues: currentCase.solution?.keyClinicalClues,
      characteristicSymptoms: currentCase.solution?.characteristicSignsSymptoms,
      specialty: currentCase.specialty,
      caseId: currentCase.id,
    };

    chatAbortRef.current?.abort();
    const controller = new AbortController();
    chatAbortRef.current = controller;
    let timedOut = false;
    const timeoutId = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, 10000);

    try {
      const response = await fetch('/api/patient-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(chatPayload),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      if (activeChatCaseIdRef.current !== requestCaseId) return;

      const patientReply =
        (typeof data?.reply === 'string' && data.reply.trim()) ||
        generateContextualPatientReply(chatPayload);

      setMessages((prev) => [
        ...prev,
        {
          id: `msg-pat-${Date.now()}`,
          sender: 'patient',
          text: patientReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (activeChatCaseIdRef.current !== requestCaseId) return;
      if (err?.name === 'AbortError' && !timedOut) return;

      const localFallbackReply = generateContextualPatientReply(chatPayload);

      setMessages((prev) => [
        ...prev,
        {
          id: `msg-pat-${Date.now()}`,
          sender: 'patient',
          text: localFallbackReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      clearTimeout(timeoutId);
      if (activeChatCaseIdRef.current === requestCaseId) {
        setIsChatLoading(false);
      }
    }
  };

  // Apply STAT emergency intervention and update live vitals + patient dialogue
  const handleApplyStatIntervention = (input: StatApplyInput) => {
    const outcome = applyStatIntervention(
      liveVitalSigns,
      currentCase.vitalSigns,
      currentCase,
      input,
      statInterventions,
      elapsedSeconds
    );

    setLiveVitalSigns(outcome.updatedVitals);
    setStatInterventions((prev) => [...prev, outcome.record]);

    // Sync STAT dose into pharmacological plan (avoid exact duplicate drug+dose+route lines)
    setMedications((prev) => {
      const normalizedNew = `${outcome.medicationItem.drug.toLowerCase()}::${outcome.medicationItem.dose.toLowerCase()}::${outcome.medicationItem.route.toLowerCase()}`;
      const alreadyExists = prev.some(
        (m) => `${m.drug.toLowerCase()}::${m.dose.toLowerCase()}::${m.route.toLowerCase()}` === normalizedNew
      );
      return alreadyExists ? prev : [...prev, outcome.medicationItem];
    });

    const deltasText =
      outcome.record.deltas.length > 0
        ? ` · Cambios: ${outcome.record.deltas.map((d) => `${d.metric} ${d.before} → ${d.after}`).join(', ')}`
        : ' · Signos vitales sin cambios inmediatos';

    const nowTs = outcome.record.appliedAt;
    const baseTime = Date.now();
    const sysMsg: ChatMessage = {
      id: `msg-stat-sys-${baseTime}`,
      sender: 'system',
      text: `${outcome.record.drug} (${outcome.record.dose}, ${outcome.record.route})${deltasText}.`,
      timestamp: nowTs,
    };
    const patientReactionMsg: ChatMessage = {
      id: `msg-stat-pat-${baseTime + 1}`,
      sender: 'patient',
      text: outcome.record.patientFeelingNote,
      timestamp: nowTs,
    };

    setMessages((prev) => [...prev, sysMsg, patientReactionMsg]);
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
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);
      const response = await fetch('/api/generate-case', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          specialty,
          caseId,
          excludeCaseId:
            activeView === 'simulation' || recentCaseIds.includes(currentCase.id)
              ? currentCase.id
              : recentCaseIds[recentCaseIds.length - 1],
          excludeCaseIds: recentCaseIds,
          excludeDiagnoses: recentDiagnoses,
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (response.ok) {
        const data = await response.json();
        if (data?.case) {
          setupCase(data.case);
          setNewCaseModalOpen(false);
          return;
        }
      }
    } catch {
      // Seamless local fallback below
    } finally {
      setIsGeneratingCase(false);
    }

    const excludeSet = new Set(recentCaseIds);
    excludeSet.add(currentCase.id);
    const matching = ALL_CURATED_CASES.filter(
      (c) =>
        (caseId ? c.id === caseId : !excludeSet.has(c.id)) &&
        (specialty === 'aleatorio' || c.specialty === specialty)
    );
    const pool = matching.length > 0 ? matching : ALL_CURATED_CASES.filter((c) => c.id !== currentCase.id);
    const fallbackCase = pool[Math.floor(Math.random() * pool.length)] || ALL_CURATED_CASES[0];
    setupCase({ ...fallbackCase, mode });
    setNewCaseModalOpen(false);
  };

  // Finish and Evaluate Case
  const handleFinishCase = async (pendingDraft?: MedicationItem) => {
    setIsEvaluating(true);
    const doctorQuestions = messages.filter((m) => m.sender === 'doctor').map((m) => m.text);
    const effectiveMedications = pendingDraft ? [...medications, pendingDraft] : medications;

    const submission: UserEvaluationInput = {
      primaryDiagnosis,
      differentialDiagnoses,
      clinicalJustification,
      additionalStudiesNeeded,
      pharmacologicalPlan: effectiveMedications,
      generalMeasures,
      hospitalizationDecision,
      referralCriteria,
      followUpPlan,
      unlockedExams: unlockedExamIds,
      unlockedStudies: unlockedStudyIds,
      questionCount: doctorQuestions.length,
      doctorQuestions,
      timeSpentSeconds: elapsedSeconds,
      statInterventions,
      baselineVitalSigns: currentCase.vitalSigns,
      finalVitalSigns: liveVitalSigns,
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
    const enrichedFound = enrichCaseWithUniversalPhysicalExam(enrichCaseWithHospitalCatalog(found));
    setCurrentCase(enrichedFound);
    setLiveVitalSigns(enrichedFound.vitalSigns);
    setStatInterventions([]);
    setStatDrawerOpen(false);
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
        onOpenCalculatorsModal={() => setCalculatorsModalOpen(true)}
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
          {/* Persistent Vital Signs Monitor with Single STAT Emergency Trigger */}
          <VitalSignsMonitor
            vitals={liveVitalSigns}
            baselineVitals={currentCase.vitalSigns}
            statCount={statInterventions.length}
            triageLevel={currentCase.patientInfo.triageLevel}
            onOpenStat={() => setStatDrawerOpen(true)}
            showStatButton={!evaluationResult}
          />

          {/* Patient Identity Banner */}
          <PatientBanner caseData={currentCase} revealSpecialty={Boolean(evaluationResult)} />

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
          <div className="flex items-center justify-between md:justify-end gap-2 shrink-0 px-2 pt-1 md:pt-0 border-t md:border-t-0 border-blue-900/50">
            <span className="text-[11px] text-blue-300/70 md:hidden font-medium">
              Deslice las pestañas
            </span>

            {isUrgenciasMode ? (
              <div
                className={`flex items-center gap-1.5 text-xs font-mono tabular-nums px-2.5 py-1 rounded-lg border ${
                  urgenciasRemaining === 0
                    ? 'bg-rose-950/70 border-rose-500/80 text-rose-200'
                    : urgenciasRemaining <= 120
                    ? 'bg-amber-950/60 border-amber-500/70 text-amber-200'
                    : 'bg-[#040B1B] border-amber-700/60 text-amber-200'
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="font-sans text-[11px] font-semibold">Ventana:</span>
                <span className="font-bold text-white">
                  {urgenciasRemaining > 0 ? formatTimer(urgenciasRemaining) : 'EXCEDIDA'}
                </span>
              </div>
            ) : isExamenMode ? (
              <div
                className={`flex items-center gap-1.5 text-xs font-mono tabular-nums px-2.5 py-1 rounded-lg border ${
                  examenRemaining <= 60
                    ? 'bg-rose-950/70 border-rose-500/80 text-rose-200'
                    : 'bg-[#040B1B] border-sky-600/70 text-sky-200'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span className="font-sans text-[11px] font-semibold">Examen:</span>
                <span className="font-bold text-white">{formatTimer(examenRemaining)}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-xs text-blue-200/80 font-mono tabular-nums">
                <Timer className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span className="hidden sm:inline">Tiempo:</span>
                <span className="font-bold text-white">{formatTimer(elapsedSeconds)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Mode-Specific Notice: Urgencias 8-min Golden Window Alert or Modo Examen Strict Notice */}
        {!evaluationResult && isUrgenciasMode && urgenciasRemaining === 0 && (
          <div className="bg-rose-950/40 border border-rose-600/60 rounded-xl px-3.5 py-2.5 text-xs text-rose-200 flex items-center gap-2 shadow-sm">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>
              Ventana de oro (8 min) superada: defina inmediatamente su diagnóstico y conducta terapéutica en las pestañas 5 y 6.
            </span>
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
              key={currentCase.id}
              caseData={currentCase}
              messages={messages}
              onSendMessage={handleSendMessage}
              isLoading={isChatLoading}
            />
          )}

          {activeTab === 'background' && <BackgroundTab caseData={currentCase} />}

          {activeTab === 'physical_exam' && (
            <PhysicalExamTab
              key={currentCase.id}
              caseData={currentCase}
              unlockedExamIds={unlockedExamIds}
              onUnlockExam={handleUnlockExam}
              onUnlockAllExams={handleUnlockAllExams}
            />
          )}

          {activeTab === 'studies' && (
            <DiagnosticStudiesTab
              key={currentCase.id}
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
              key={currentCase.id}
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
      <StatStabilizationDrawer
        isOpen={statDrawerOpen}
        onClose={() => setStatDrawerOpen(false)}
        caseData={currentCase}
        baselineVitals={currentCase.vitalSigns}
        liveVitals={liveVitalSigns}
        statInterventions={statInterventions}
        messages={messages}
        onApplyStat={handleApplyStatIntervention}
        onSendMessage={handleSendMessage}
        isChatLoading={isChatLoading}
      />

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

      <CalculatorsModal
        isOpen={calculatorsModalOpen}
        onClose={() => setCalculatorsModalOpen(false)}
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
