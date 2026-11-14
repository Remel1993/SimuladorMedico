import React, { useState, useRef, useEffect } from 'react';
import {
  UserRound,
  Baby,
  Stethoscope,
  Sparkles,
  Volume2,
  VolumeX,
  CornerDownLeft,
  Send,
  ClipboardCheck,
  MessageCircleQuestion,
  HeartPulse,
  Zap,
} from 'lucide-react';
import { ChatMessage, ClinicalCase } from '../types/clinical';

interface AnamnesisTabProps {
  caseData: ClinicalCase;
  messages: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  isLoading: boolean;
}

const COMMON_QUESTIONS = [
  '¿Desde cuándo empezaron exactamente estos síntomas?',
  '¿Dónde se localiza el dolor y cómo lo describe (opresivo, punzante, cólico)?',
  '¿El dolor se corre o se irradia a alguna otra parte del cuerpo?',
  '¿Ha presentado náuseas, vómitos o pérdida del apetito?',
  '¿Ha tenido fiebre, sudoración fría o escalofríos?',
  '¿Qué medicamentos ha tomado por su cuenta o le han recetado?',
  '¿Tiene antecedentes de hipertensión, diabetes u otra enfermedad crónica?',
  '¿Tiene vida sexual activa o algún antecedente gineco-urológico reciente?',
  '¿Ha viajado recientemente o ha estado en contacto con personas enfermas?',
  '¿Tiene alguna alergia conocida a medicamentos o alimentos?',
];

export const AnamnesisTab: React.FC<AnamnesisTabProps> = ({
  caseData,
  messages,
  onSendMessage,
  isLoading,
}) => {
  const [inputText, setInputText] = useState('');
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const lastSpokenIdRef = useRef<string | null>(null);

  const isPediatric = caseData.patientInfo.age < 12;

  const renderPatientAvatarIcon = (className: string) =>
    isPediatric ? <Baby className={className} /> : <UserRound className={className} />;

  const speakText = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    setInputText('');
    lastSpokenIdRef.current = messages[0]?.id ?? null;
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [caseData.id]);

  useEffect(() => {
    if (!ttsEnabled) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      return;
    }
    const lastPatientMsg = [...messages].reverse().find((m) => m.sender === 'patient');
    if (lastPatientMsg && lastPatientMsg.id !== lastSpokenIdRef.current) {
      lastSpokenIdRef.current = lastPatientMsg.id;
      speakText(lastPatientMsg.text);
    }
  }, [messages, ttsEnabled]);

  useEffect(() => {
    const el = messagesContainerRef.current;
    if (!el) return;
    if (messages.length <= 1 && !isLoading) {
      el.scrollTop = 0;
      return;
    }
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    const textToSend = inputText.trim();
    setInputText('');
    await onSendMessage(textToSend);
  };

  const handleQuickQuestion = async (q: string) => {
    if (isLoading) return;
    await onSendMessage(q);
  };

  return (
    <div className="flex flex-col h-[calc(100dvh-220px)] min-h-[430px] max-h-[650px] bg-[#07132B] rounded-xl border border-blue-900/60 overflow-hidden shadow-lg">
      {/* Tab Header Bar */}
      <div className="px-3.5 sm:px-5 py-3 bg-[#040B1B] border-b border-blue-900/60 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-[#0D2149] border border-blue-700/70 flex items-center justify-center text-sky-300 shrink-0">
            {renderPatientAvatarIcon('w-4 h-4')}
          </div>
          <div className="min-w-0">
            <h2 className="text-xs sm:text-sm font-semibold text-white truncate flex items-center gap-1.5">
              <span>Interrogatorio Directo al Paciente</span>
              <span className="text-[11px] font-normal text-blue-300/80 shrink-0">
                ({messages.filter((m) => m.sender === 'doctor').length} preg.)
              </span>
            </h2>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setTtsEnabled((prev) => !prev)}
          className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md border transition-colors shrink-0 cursor-pointer ${
            ttsEnabled
              ? 'bg-blue-600/30 border-blue-500 text-white'
              : 'bg-[#07132B] border-blue-900/70 text-blue-200 hover:text-white'
          }`}
          title="Activar o desactivar síntesis de voz en español"
        >
          {ttsEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          <span className="text-[11px] font-medium hidden sm:inline">Voz del Paciente</span>
          <span className="text-[11px] font-medium sm:hidden">Voz</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-3.5 sm:space-y-4"
      >
        {/* Initial Medical Reception System Notice */}
        <div className="bg-[#040B1B] border border-blue-900/60 rounded-xl p-3.5 text-xs text-blue-200/85 max-w-2xl mx-auto text-center space-y-1.5">
          <div className="flex items-center justify-center gap-2 font-semibold text-white">
            <ClipboardCheck className="w-4 h-4 text-sky-400 shrink-0" />
            <span>Recepción del Paciente en Consultorio / Urgencias</span>
          </div>
          <p>
            {caseData.patientInfo.name} ({caseData.patientInfo.age} años) se encuentra en la consulta médica listo para el interrogatorio clínico.
          </p>
          <p className="text-[11px] text-blue-300/70">
            Realice preguntas abiertas o minuciosas sobre cronología, síntomas, antecedentes, medicamentos, alergias o hábitos.
          </p>
        </div>

        {messages.map((msg) => {
          if (msg.sender === 'system') {
            return (
              <div
                key={msg.id}
                className="mx-auto max-w-xl bg-[#040B1B] border border-amber-600/50 rounded-lg px-3.5 py-2 text-[11px] text-amber-100 flex items-start gap-2"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <span className="font-semibold text-amber-300">Aplicación STAT ({msg.timestamp}): </span>
                  <span className="text-blue-100">{msg.text}</span>
                </div>
              </div>
            );
          }

          const isDoctor = msg.sender === 'doctor';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2 sm:gap-3 ${isDoctor ? 'justify-end' : 'justify-start'}`}
            >
              {!isDoctor && (
                <div className="relative shrink-0 mt-0.5">
                  <div
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-[#0F2859] to-[#081533] border-2 border-sky-500/70 flex items-center justify-center text-sky-200 shadow-sm"
                    title="Paciente"
                  >
                    {renderPatientAvatarIcon('w-4 h-4 sm:w-4.5 sm:h-4.5')}
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#040B1B] border border-sky-500/70 flex items-center justify-center">
                    <HeartPulse className="w-2 h-2 text-sky-300" />
                  </span>
                </div>
              )}

              <div
                className={`max-w-[84%] sm:max-w-xl rounded-2xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm leading-relaxed break-words ${
                  isDoctor
                    ? 'bg-blue-600 text-white rounded-tr-none shadow-sm'
                    : 'bg-[#0C1D42] border border-blue-800/70 text-white rounded-tl-none shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider truncate flex items-center gap-1 ${
                      isDoctor ? 'text-blue-100' : 'text-sky-300'
                    }`}
                  >
                    {isDoctor ? (
                      <>
                        <Stethoscope className="w-3 h-3 shrink-0" />
                        <span>Usted (Médico)</span>
                      </>
                    ) : (
                      <>
                        {renderPatientAvatarIcon('w-3 h-3 shrink-0')}
                        <span>{caseData.patientInfo.name} · Paciente</span>
                      </>
                    )}
                  </span>
                  <div className="flex items-center gap-1.5 text-[10px] text-blue-200/70 shrink-0">
                    <span>{msg.timestamp}</span>
                    {!isDoctor && (
                      <button
                        onClick={() => speakText(msg.text)}
                        className="text-blue-300 hover:text-white ml-1 transition-colors cursor-pointer"
                        title="Escuchar respuesta"
                      >
                        <Volume2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                <p className="whitespace-pre-line">{msg.text}</p>
              </div>

              {isDoctor && (
                <div
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-blue-700 border-2 border-blue-400/80 flex items-center justify-center text-white shrink-0 mt-0.5 shadow-sm"
                  title="Médico Tratante"
                >
                  <Stethoscope className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#0F2859] border-2 border-sky-500/70 flex items-center justify-center text-sky-200 shrink-0 mt-0.5">
              {renderPatientAvatarIcon('w-4 h-4')}
            </div>
            <div className="bg-[#0C1D42] border border-blue-800/70 rounded-2xl rounded-tl-none px-4 py-3 text-xs text-blue-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-400 animate-spin shrink-0" />
              <span>El paciente está respondiendo...</span>
            </div>
          </div>
        )}

      </div>

      {/* Suggested Quick Questions Carousel (Hidden in Modo Examen for genuine blind assessment) */}
      {caseData.mode === 'examen' ? (
        <div className="bg-[#040B1B] border-t border-blue-900/60 px-3 sm:px-4 py-2 text-[11px] text-amber-200/90 flex items-center gap-2">
          <ClipboardCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>
            <strong>Modo Examen Activo:</strong> Las preguntas sugeridas están deshabilitadas. Formule su interrogatorio directamente.
          </span>
        </div>
      ) : (
        <div className="bg-[#040B1B] border-t border-blue-900/60 px-3 sm:px-4 py-2">
          <div className="text-[11px] font-semibold text-blue-300 mb-1.5 flex items-center gap-1.5">
            <MessageCircleQuestion className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span>
              {caseData.mode === 'urgencias'
                ? 'Preguntas rápidas dirigidas (Urgencias — priorice signos de alarma):'
                : 'Preguntas rápidas (deslice y toque para preguntar):'}
            </span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            {COMMON_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickQuestion(q)}
                disabled={isLoading}
                className="px-2.5 py-1.5 rounded-lg bg-[#0C1D42] hover:bg-blue-700 text-blue-100 hover:text-white text-xs border border-blue-800/70 transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
              >
                <MessageCircleQuestion className="w-3 h-3 text-sky-300 shrink-0" />
                <span>{q}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Doctor Input Box */}
      <form
        onSubmit={handleSend}
        className="p-2.5 sm:p-3.5 bg-black border-t border-blue-900/70 flex items-center gap-2"
      >
        <div className="w-8 h-8 rounded-lg bg-[#07132B] border border-blue-900/70 hidden sm:flex items-center justify-center text-blue-400 shrink-0">
          <Stethoscope className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Escriba su pregunta directa al paciente..."
          disabled={isLoading}
          className="flex-1 min-w-0 bg-[#07132B] border border-blue-800/80 rounded-lg px-3 sm:px-4 py-2.5 text-xs sm:text-sm text-white placeholder-blue-300/50 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="px-3 sm:px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:pointer-events-none text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
        >
          <span className="hidden sm:inline">Preguntar</span>
          <CornerDownLeft className="w-3.5 h-3.5 hidden sm:inline" />
          <Send className="w-4 h-4 sm:hidden" />
        </button>
      </form>
    </div>
  );
};
