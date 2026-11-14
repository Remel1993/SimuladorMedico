import React, { useState, useEffect, useRef, useMemo } from 'react';
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
import { ImmediateDeathModal, ImmediateDeathAlertData } from './components/ImmediateDeathModal';
import { OfflineIndicator } from './components/OfflineIndicator';

import { applyStatIntervention, StatApplyInput } from './utils/statStabilization';
import { generateContextualPatientReply, PatientChatPayload } from './engine/patientEngine';
import { getLocalCaseLibrary, selectLocalClinicalCase } from './engine/caseGenerator';
import { evaluateClinicalEvolutionStep } from './engine/clinicalEvolution';
import { buildLivePhysicalExams, buildLiveStudies } from './engine/liveClinicalSync';
import {
  evaluateClinicalCaseLocally,
  evaluateClinicalOutcomeLocally,
  DramaticOutcome,
} from './engine/evaluationEngine';

import { ALL_CURATED_CASES } from './data/allCases';
import { enrichCaseWithHospitalCatalog } from './utils/studiesCatalog';
import { enrichCaseWithUniversalPhysicalExam } from './utils/physicalExamCatalog';
import {
  clearActiveSimulationSession,
  clearAllHistoryRecords,
  deleteCustomCase,
  getActiveSimulationSession,
  getAllHistoryRecords,
  getCustomCases,
  getStoredProgress,
  getUserPreferences,
  migrateLegacyLocalStorage,
  saveActiveSimulationSession,
  saveCustomCase,
  saveHistoryRecord,
  saveStoredProgress,
  saveUserPreferences,
} from './storage/indexedDb';
import {
  ClinicalCase,
  ClinicalEvolutionState,
  ChatMessage,
  MedicationItem,
  EvaluationResult,
  SavedCaseRecord,
  GameMode,
  Specialty,
  StatInterventionRecord,
  UserEvaluationInput,
  UserPreferences,
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
  Skull,
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

  // Live Vitals, Evolution Engine & STAT Stabilization Tracking
  const [liveVitalSigns, setLiveVitalSigns] = useState<VitalSigns>(() => ALL_CURATED_CASES[0].vitalSigns);
  const [statInterventions, setStatInterventions] = useState<StatInterventionRecord[]>([]);
  const [statDrawerOpen, setStatDrawerOpen] = useState(false);
  const [evolutionState, setEvolutionState] = useState<ClinicalEvolutionState | undefined>(undefined);

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

  // Evaluation, History & Local IndexedDB State
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);
  const [history, setHistory] = useState<SavedCaseRecord[]>([]);
  const [customCases, setCustomCases] = useState<ClinicalCase[]>([]);
  const [completedCaseIds, setCompletedCaseIds] = useState<string[]>([]);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    preferredMode: 'medico_general',
    preferredSpecialty: 'aleatorio',
    ttsEnabled: false,
    updatedAt: '',
  });
  const [isStorageHydrated, setIsStorageHydrated] = useState(false);

  // Modals & Dramatic Outcome Stage
  const [newCaseModalOpen, setNewCaseModalOpen] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [guideModalOpen, setGuideModalOpen] = useState(false);
  const [calculatorsModalOpen, setCalculatorsModalOpen] = useState(false);
  const [isGeneratingCase, setIsGeneratingCase] = useState(false);
  const [pendingOutcome, setPendingOutcome] = useState<DramaticOutcome | null>(null);
  const [immediateDeathAlert, setImmediateDeathAlert] = useState<ImmediateDeathAlertData | null>(null);
  const [recentCaseIds, setRecentCaseIds] = useState<string[]>([]);
  const [recentDiagnoses, setRecentDiagnoses] = useState<string[]>([]);

  const isPatientDeceased =
    statInterventions.some((s) => s.isImmediateDeath) ||
    liveVitalSigns.heartRate === 0 ||
    (liveVitalSigns.bloodPressure || '').startsWith('0/');

  const livePhysicalExams = useMemo(
    () => buildLivePhysicalExams(currentCase, liveVitalSigns, statInterventions, evolutionState),
    [currentCase, liveVitalSigns, statInterventions, evolutionState]
  );

  const liveStudies = useMemo(
    () => buildLiveStudies(currentCase, liveVitalSigns, statInterventions, evolutionState),
    [currentCase, liveVitalSigns, statInterventions, evolutionState]
  );

  // Consultation Timer & Mode Mechanics
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const examAutoSubmittedRef = useRef(false);
  const latestFinishRef = useRef<() => void>(() => {});
  const activeChatCaseIdRef = useRef<string>(ALL_CURATED_CASES[0].id);
  const lastEvolutionCheckRef = useRef<number>(0);

  // Initialize IndexedDB (with one-time migration from legacy localStorage)
  useEffect(() => {
    let cancelled = false;

    const hydrateLocalDatabase = async () => {
      try {
        await migrateLegacyLocalStorage();
        const [loadedHistory, storedProgress, loadedPrefs, loadedCustomCases, activeSession] =
          await Promise.all([
            getAllHistoryRecords(),
            getStoredProgress(),
            getUserPreferences(),
            getCustomCases(),
            getActiveSimulationSession(),
          ]);

        if (cancelled) return;

        setHistory(loadedHistory);
        setUserPreferences(loadedPrefs);
        setCustomCases(loadedCustomCases);

        const mergedSeenIds = Array.from(
          new Set([
            ...storedProgress.seenCaseIds,
            ...loadedHistory.map((h) => h.caseId).filter(Boolean),
          ])
        );
        const mergedSeenDiags = Array.from(
          new Set([
            ...storedProgress.seenDiagnoses,
            ...loadedHistory.map((h) => h.correctDiagnosis).filter(Boolean),
          ])
        );
        const mergedCompletedIds = Array.from(
          new Set([
            ...storedProgress.completedCaseIds,
            ...loadedHistory.map((h) => h.caseId).filter(Boolean),
          ])
        );

        const totalLibrarySize = Math.max(10, ALL_CURATED_CASES.length + loadedCustomCases.length - 1);
        setRecentCaseIds(mergedSeenIds.slice(-totalLibrarySize));
        setRecentDiagnoses(mergedSeenDiags.slice(-75));
        setCompletedCaseIds(mergedCompletedIds);

        if (activeSession && activeSession.caseData) {
          const restoredCase = enrichCaseWithUniversalPhysicalExam(
            enrichCaseWithHospitalCatalog(activeSession.caseData)
          );
          activeChatCaseIdRef.current = restoredCase.id;
          lastEvolutionCheckRef.current = activeSession.elapsedSeconds || 0;
          setCurrentCase(restoredCase);
          setActiveTab(activeSession.activeTab || 'anamnesis');
          setLiveVitalSigns(activeSession.liveVitalSigns || restoredCase.vitalSigns);
          setStatInterventions(activeSession.statInterventions || []);
          setMessages(activeSession.messages || []);
          setUnlockedExamIds(activeSession.unlockedExamIds || []);
          setUnlockedStudyIds(activeSession.unlockedStudyIds || []);
          setPrimaryDiagnosis(activeSession.primaryDiagnosis || '');
          setDifferentialDiagnoses(activeSession.differentialDiagnoses || []);
          setClinicalJustification(activeSession.clinicalJustification || '');
          setAdditionalStudiesNeeded(activeSession.additionalStudiesNeeded || '');
          setMedications(activeSession.medications || []);
          setGeneralMeasures(activeSession.generalMeasures || '');
          setHospitalizationDecision(activeSession.hospitalizationDecision || '');
          setReferralCriteria(activeSession.referralCriteria || '');
          setFollowUpPlan(activeSession.followUpPlan || '');
          setElapsedSeconds(activeSession.elapsedSeconds || 0);
          setActiveView('simulation');

          const initialEvo = evaluateClinicalEvolutionStep({
            caseData: restoredCase,
            baselineVitals: restoredCase.vitalSigns,
            currentVitals: activeSession.liveVitalSigns || restoredCase.vitalSigns,
            elapsedSeconds: activeSession.elapsedSeconds || 0,
            statInterventions: activeSession.statInterventions || [],
            unlockedExamCount: (activeSession.unlockedExamIds || []).length,
            unlockedStudyCount: (activeSession.unlockedStudyIds || []).length,
            lastEvaluatedSecond: activeSession.elapsedSeconds || 0,
          });
          setEvolutionState(initialEvo.evolutionState);
        }
      } catch (e) {
        console.warn('No se pudo hidratar la base local IndexedDB', e);
      } finally {
        if (!cancelled) {
          setIsStorageHydrated(true);
        }
      }
    };

    void hydrateLocalDatabase();
    return () => {
      cancelled = true;
    };
  }, []);

  // Timer Tick (only runs while attending an active unresolved case and patient is alive)
  useEffect(() => {
    if (activeView !== 'simulation' || evaluationResult || isPatientDeceased) return;
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [activeView, evaluationResult, isPatientDeceased]);

  // Continuous Deterministic Clinical Evolution (every 45s or upon STAT interventions)
  useEffect(() => {
    if (activeView !== 'simulation' || evaluationResult) return;

    const shouldEvaluateNow =
      elapsedSeconds === 0 ||
      elapsedSeconds - lastEvolutionCheckRef.current >= 45;

    if (!shouldEvaluateNow && evolutionState) return;

    const step = evaluateClinicalEvolutionStep({
      caseData: currentCase,
      baselineVitals: currentCase.vitalSigns,
      currentVitals: liveVitalSigns,
      elapsedSeconds,
      statInterventions,
      unlockedExamCount: unlockedExamIds.length,
      unlockedStudyCount: unlockedStudyIds.length,
      lastEvaluatedSecond: lastEvolutionCheckRef.current,
    });

    lastEvolutionCheckRef.current = step.evolutionState.lastEvaluatedSecond;
    setEvolutionState(step.evolutionState);
    if (step.changed) {
      setLiveVitalSigns(step.updatedVitals);
    }
  }, [
    elapsedSeconds,
    activeView,
    evaluationResult,
    currentCase,
    statInterventions,
    unlockedExamIds.length,
    unlockedStudyIds.length,
  ]);

  // Persist Active Simulation Session in IndexedDB (offline crash/reload recovery)
  useEffect(() => {
    if (!isStorageHydrated || activeView !== 'simulation' || evaluationResult) return;

    const handle = window.setTimeout(() => {
      void saveActiveSimulationSession({
        id: 'current',
        caseData: currentCase,
        activeTab,
        liveVitalSigns,
        statInterventions,
        messages,
        unlockedExamIds,
        unlockedStudyIds,
        primaryDiagnosis,
        differentialDiagnoses,
        clinicalJustification,
        additionalStudiesNeeded,
        medications,
        generalMeasures,
        hospitalizationDecision,
        referralCriteria,
        followUpPlan,
        elapsedSeconds,
        updatedAt: new Date().toISOString(),
      });
    }, 450);

    return () => window.clearTimeout(handle);
  }, [
    isStorageHydrated,
    activeView,
    evaluationResult,
    currentCase,
    activeTab,
    liveVitalSigns,
    statInterventions,
    messages,
    unlockedExamIds,
    unlockedStudyIds,
    primaryDiagnosis,
    differentialDiagnoses,
    clinicalJustification,
    additionalStudiesNeeded,
    medications,
    generalMeasures,
    hospitalizationDecision,
    referralCriteria,
    followUpPlan,
    Math.floor(elapsedSeconds / 15),
  ]);

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

  // Persist user preferences helper
  const handleUpdatePreferences = (prefs: Partial<UserPreferences>) => {
    setUserPreferences((prev) => ({
      ...prev,
      ...prefs,
      updatedAt: new Date().toISOString(),
    }));
    void saveUserPreferences(prefs);
  };

  // Set up case initial dialogue and enter simulation view
  const setupCase = (newCase: ClinicalCase) => {
    const enriched = enrichCaseWithUniversalPhysicalExam(enrichCaseWithHospitalCatalog(newCase));
    activeChatCaseIdRef.current = enriched.id;
    lastEvolutionCheckRef.current = 0;
    setIsChatLoading(false);
    setCurrentCase(enriched);

    const maxRecentIds = Math.max(10, ALL_CURATED_CASES.length + customCases.length - 1);
    const updatedSeenIds = [
      ...recentCaseIds.filter((id) => id !== enriched.id),
      enriched.id,
    ].slice(-maxRecentIds);
    setRecentCaseIds(updatedSeenIds);

    let updatedSeenDiags = recentDiagnoses;
    if (enriched.solution?.correctDiagnosis) {
      const diag = enriched.solution.correctDiagnosis;
      updatedSeenDiags = [...recentDiagnoses.filter((d) => d !== diag), diag].slice(-75);
      setRecentDiagnoses(updatedSeenDiags);
    }

    void saveStoredProgress({
      id: 'default',
      seenCaseIds: updatedSeenIds,
      seenDiagnoses: updatedSeenDiags,
      completedCaseIds,
      updatedAt: new Date().toISOString(),
    });

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
    setImmediateDeathAlert(null);
    setElapsedSeconds(0);
    examAutoSubmittedRef.current = false;

    const initialEvo = evaluateClinicalEvolutionStep({
      caseData: enriched,
      baselineVitals: enriched.vitalSigns,
      currentVitals: enriched.vitalSigns,
      elapsedSeconds: 0,
      statInterventions: [],
      unlockedExamCount: 0,
      unlockedStudyCount: 0,
      lastEvaluatedSecond: 0,
    });
    setEvolutionState(initialEvo.evolutionState);

    const isPediatric = enriched.patientInfo.age < 12;
    const greetingText = isPediatric
      ? `Buenos días doctor, gracias por atendernos tan rápido. Soy la mamá de ${enriched.patientInfo.name.replace(/\s*\([^)]*\)/, '')}; traje a mi niño porque se ha sentido bastante mal.`
      : `Buenos días doctor, gracias por atenderme. Me llamo ${enriched.patientInfo.name}. Vengo a consulta porque me he estado sintiendo bastante mal y necesito que me revise, por favor.`;

    setMessages([
      {
        id: `msg-init-${Date.now()}`,
        sender: 'patient',
        text: greetingText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  // Save history & progress helper (IndexedDB)
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

    const updatedHistory = [record, ...history];
    setHistory(updatedHistory);

    const updatedCompleted = Array.from(new Set([...completedCaseIds, caseItem.id]));
    setCompletedCaseIds(updatedCompleted);

    void saveHistoryRecord(record);
    void clearActiveSimulationSession();
    void saveStoredProgress({
      id: 'default',
      seenCaseIds: recentCaseIds,
      seenDiagnoses: recentDiagnoses,
      completedCaseIds: updatedCompleted,
      updatedAt: new Date().toISOString(),
    });
  };

  // Deterministic 100% Offline Virtual Patient Chat Handler
  const handleSendMessage = async (text: string) => {
    if (isPatientDeceased || liveVitalSigns.glasgow <= 9) return;

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
      isDeceased: isPatientDeceased,
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

    // Short micro-delay for natural conversational pacing without any external request
    await new Promise((resolve) => window.setTimeout(resolve, 90));
    if (activeChatCaseIdRef.current !== requestCaseId) return;

    const localReply = generateContextualPatientReply(chatPayload);
    setMessages((prev) => [
      ...prev,
      {
        id: `msg-pat-${Date.now()}`,
        sender: 'patient',
        text: localReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setIsChatLoading(false);
  };

  // Apply STAT emergency intervention and update live vitals + evolution + patient dialogue
  const handleApplyStatIntervention = (input: StatApplyInput) => {
    if (isPatientDeceased) return;

    const outcome = applyStatIntervention(
      liveVitalSigns,
      currentCase.vitalSigns,
      currentCase,
      input,
      statInterventions,
      elapsedSeconds
    );

    const nextStatList = [...statInterventions, outcome.record];
    setLiveVitalSigns(outcome.updatedVitals);
    setStatInterventions(nextStatList);

    const evoAfterStat = evaluateClinicalEvolutionStep({
      caseData: currentCase,
      baselineVitals: currentCase.vitalSigns,
      currentVitals: outcome.updatedVitals,
      elapsedSeconds,
      statInterventions: nextStatList,
      unlockedExamCount: unlockedExamIds.length,
      unlockedStudyCount: unlockedStudyIds.length,
      lastEvaluatedSecond: elapsedSeconds,
    });
    lastEvolutionCheckRef.current = elapsedSeconds;
    setEvolutionState(evoAfterStat.evolutionState);

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

    if (outcome.isImmediateDeath) {
      setStatDrawerOpen(false);
      setImmediateDeathAlert({
        drug: outcome.record.drug,
        dose: outcome.record.dose,
        route: outcome.record.route,
        reason: outcome.immediateDeathReason || outcome.record.physiologicalEffectSummary,
        appliedAt: nowTs,
      });
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

  // Local Offline Case Selection / Generation
  const handleSelectCase = async (mode: GameMode, specialty: Specialty, caseId?: string) => {
    setIsGeneratingCase(true);
    try {
      handleUpdatePreferences({ preferredMode: mode, preferredSpecialty: specialty });

      const selectedCase = selectLocalClinicalCase({
        mode,
        specialty,
        caseId,
        excludeCaseId:
          activeView === 'simulation' || recentCaseIds.includes(currentCase.id)
            ? currentCase.id
            : recentCaseIds[recentCaseIds.length - 1],
        excludeCaseIds: recentCaseIds,
        excludeDiagnoses: recentDiagnoses,
        customCases,
      });

      setupCase(selectedCase);
      setNewCaseModalOpen(false);
    } finally {
      setIsGeneratingCase(false);
    }
  };

  // Save & Delete Custom Cases in IndexedDB
  const handleSaveCustomCase = async (newCase: ClinicalCase) => {
    await saveCustomCase(newCase);
    setCustomCases((prev) => [newCase, ...prev.filter((c) => c.id !== newCase.id)]);
  };

  const handleDeleteCustomCase = async (caseId: string) => {
    await deleteCustomCase(caseId);
    setCustomCases((prev) => prev.filter((c) => c.id !== caseId));
  };

  // Deterministic 100% Offline Evaluation Engine
  const executeFinishCase = async (pendingDraft?: MedicationItem, skipOutcomeModal = false) => {
    setIsEvaluating(true);
    try {
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

      const evalResult = evaluateClinicalCaseLocally(submission, currentCase);
      setEvaluationResult(evalResult);
      saveToHistory(evalResult, currentCase, primaryDiagnosis);
      if (skipOutcomeModal) {
        setPendingOutcome(null);
      } else {
        setPendingOutcome(evaluateClinicalOutcomeLocally(evalResult, currentCase));
      }
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleFinishCase = async (pendingDraft?: MedicationItem) => {
    await executeFinishCase(pendingDraft, false);
  };

  const handleGoToAuditAfterImmediateDeath = async () => {
    setImmediateDeathAlert(null);
    await executeFinishCase(undefined, true);
    setActiveTab('audit');
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

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Review past case from history (checks curated + custom cases)
  const handleReviewPastCase = (record: SavedCaseRecord) => {
    const allLibrary = getLocalCaseLibrary(customCases);
    const found = allLibrary.find((c) => c.id === record.caseId) || {
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
    setEvolutionState(undefined);
    setEvaluationResult(record.evaluation);
    setPendingOutcome(null);
    setImmediateDeathAlert(null);
    setActiveView('simulation');
    setActiveTab('audit');
  };

  const totalLibraryCount = getLocalCaseLibrary(customCases).length;

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
          totalCasesCount={totalLibraryCount}
          initialMode={userPreferences.preferredMode}
          initialSpecialty={userPreferences.preferredSpecialty}
          onPreferencesChange={(mode, specialty) =>
            handleUpdatePreferences({ preferredMode: mode, preferredSpecialty: specialty })
          }
        />
      ) : (
        <>
          {/* Persistent Vital Signs Monitor with Continuous Evolution & STAT Trigger */}
          <VitalSignsMonitor
            vitals={liveVitalSigns}
            baselineVitals={currentCase.vitalSigns}
            statCount={statInterventions.length}
            triageLevel={currentCase.patientInfo.triageLevel}
            onOpenStat={() => setStatDrawerOpen(true)}
            showStatButton={!evaluationResult}
            evolutionState={evolutionState}
            isDeceased={isPatientDeceased}
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

            {/* Persistent Immediate Death Banner (when inspecting record before audit) */}
            {isPatientDeceased && !evaluationResult && !immediateDeathAlert && (
              <div className="bg-rose-950/90 border-2 border-rose-500 rounded-xl px-4 py-3 text-xs text-rose-100 flex flex-wrap items-center justify-between gap-3 shadow-lg">
                <div className="flex items-center gap-2 min-w-0">
                  <Skull className="w-4 h-4 text-rose-300 shrink-0" />
                  <span>
                    <strong className="text-white uppercase">Paciente Fallecido por Iatrogenia Inmediata · Asistolia:</strong>{' '}
                    Puede revisar el expediente o finalizar el caso para consultar su dictamen en Auditoría Clínica.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => void handleGoToAuditAfterImmediateDeath()}
                  className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-rose-100 text-[#1A0509] font-bold text-xs shrink-0 cursor-pointer transition-colors"
                >
                  Finalizar y Ver Auditoría
                </button>
              </div>
            )}

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
                  liveVitals={liveVitalSigns}
                  isDeceased={isPatientDeceased}
                  initialTtsEnabled={userPreferences.ttsEnabled}
                  onToggleTts={(enabled) => handleUpdatePreferences({ ttsEnabled: enabled })}
                />
              )}

              {activeTab === 'background' && (
                <BackgroundTab
                  caseData={currentCase}
                  liveVitals={liveVitalSigns}
                  statInterventions={statInterventions}
                  evolutionState={evolutionState}
                  isDeceased={isPatientDeceased}
                />
              )}

              {activeTab === 'physical_exam' && (
                <PhysicalExamTab
                  key={currentCase.id}
                  caseData={currentCase}
                  unlockedExamIds={unlockedExamIds}
                  onUnlockExam={handleUnlockExam}
                  onUnlockAllExams={handleUnlockAllExams}
                  liveExams={livePhysicalExams}
                  liveVitals={liveVitalSigns}
                  isDeceased={isPatientDeceased}
                />
              )}

              {activeTab === 'studies' && (
                <DiagnosticStudiesTab
                  key={currentCase.id}
                  caseData={currentCase}
                  unlockedStudyIds={unlockedStudyIds}
                  onUnlockStudy={handleUnlockStudy}
                  onUnlockAllStudies={handleUnlockAllStudies}
                  liveStudies={liveStudies}
                  liveVitals={liveVitalSigns}
                  isDeceased={isPatientDeceased}
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

      {/* Offline Status Banner */}
      <OfflineIndicator />

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
        isDeceased={isPatientDeceased}
      />

      <NewCaseModal
        isOpen={newCaseModalOpen}
        onClose={() => setNewCaseModalOpen(false)}
        onSelectCase={handleSelectCase}
        isLoading={isGeneratingCase}
        customCases={customCases}
        onSaveCustomCase={handleSaveCustomCase}
        onDeleteCustomCase={handleDeleteCustomCase}
      />

      <CaseHistoryModal
        isOpen={historyModalOpen}
        onClose={() => setHistoryModalOpen(false)}
        history={history}
        onClearHistory={() => {
          setHistory([]);
          void clearAllHistoryRecords();
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

      <ImmediateDeathModal
        alert={immediateDeathAlert}
        patientName={currentCase.patientInfo.name}
        onGoToAudit={() => void handleGoToAuditAfterImmediateDeath()}
        onInspectRecord={() => setImmediateDeathAlert(null)}
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
