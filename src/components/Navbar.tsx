import React from 'react';
import { PlusCircle, History, BookOpen, Stethoscope, RefreshCw, Home, Calculator } from 'lucide-react';
import { GameMode, Specialty } from '../types/clinical';
import { PWAInstallButton } from './PWAInstallButton';

interface NavbarProps {
  activeView: 'lobby' | 'simulation';
  onGoHome: () => void;
  onOpenNewCaseModal: () => void;
  onOpenHistoryModal: () => void;
  onOpenGuideModal: () => void;
  onOpenCalculatorsModal: () => void;
  onRestartCase: () => void;
  currentMode: GameMode;
  currentSpecialty: Specialty;
  historyCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  onGoHome,
  onOpenNewCaseModal,
  onOpenHistoryModal,
  onOpenGuideModal,
  onOpenCalculatorsModal,
  onRestartCase,
  currentMode,
  historyCount,
}) => {
  const formatMode = (mode: GameMode) => {
    switch (mode) {
      case 'principiante':
        return 'Principiante';
      case 'medico_general':
        return 'Médico General';
      case 'residente':
        return 'Residente';
      case 'urgencias':
        return 'Urgencias';
      case 'examen':
        return 'Examen';
      default:
        return mode;
    }
  };

  return (
    <header className="bg-black/95 border-b border-blue-900/60 text-white sticky top-0 z-40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-6">
        {/* Zone 1: Brand Wordmark (Returns to Lobby) */}
        <button
          type="button"
          onClick={onGoHome}
          className="flex items-center gap-2 sm:gap-2.5 min-w-0 text-left cursor-pointer group"
          title="Volver a la interfaz general"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#0A1A3A] border border-blue-700/60 group-hover:border-blue-400 flex items-center justify-center text-blue-400 shrink-0 shadow-inner transition-colors">
            <Stethoscope className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm sm:text-base font-bold tracking-tight text-white group-hover:text-blue-200 truncate transition-colors">
              Medical Case Simulator
            </span>
            <span className="text-[10px] sm:text-[11px] text-blue-300 font-medium truncate">
              Simulador Clínico Offline
            </span>
          </div>
        </button>

        {/* Zone 2: Desktop action triggers */}
        <nav className="hidden md:flex items-center gap-5 text-xs font-medium text-blue-100/80">
          {activeView === 'simulation' && (
            <>
              <button
                onClick={onGoHome}
                className="hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer text-blue-300"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Panel General</span>
              </button>

              <button
                onClick={onOpenNewCaseModal}
                className="hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
                title="Cambiar modo de juego o caso"
              >
                <span>Simulación</span>
                <span className="text-blue-700">·</span>
                <span className="text-blue-300 font-semibold">{formatMode(currentMode)}</span>
              </button>
            </>
          )}

          <button
            onClick={onOpenHistoryModal}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <History className="w-3.5 h-3.5 text-blue-400" />
            <span>Casos Resueltos ({historyCount})</span>
          </button>

          <button
            onClick={onOpenGuideModal}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-blue-400" />
            <span>Guías (OMS / AHA)</span>
          </button>

          <button
            onClick={onOpenCalculatorsModal}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
            title="Calculadoras médicas neutrales (TFG, PAM, dosis pediátrica, Centor, CURB-65, Ottawa)"
          >
            <Calculator className="w-3.5 h-3.5 text-sky-400" />
            <span>Calculadoras</span>
          </button>

          {activeView === 'simulation' && (
            <button
              onClick={onRestartCase}
              className="hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 text-blue-300/80 cursor-pointer"
              title="Reiniciar expediente actual"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reiniciar</span>
            </button>
          )}
        </nav>

        {/* Zone 3: PWA Install + Primary CTA button */}
        <div className="flex items-center gap-2 shrink-0">
          <PWAInstallButton />
          <button
            onClick={onOpenNewCaseModal}
            className="px-2.5 sm:px-3.5 py-2 text-xs font-bold text-[#030A1C] bg-white hover:bg-blue-100 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-blue-700 shrink-0" />
            <span className="sm:hidden">Nuevo Caso</span>
            <span className="hidden sm:inline">Nuevo Caso Clínico</span>
          </button>
        </div>
      </div>

      {/* Mobile Secondary Action Bar */}
      <div className="md:hidden border-t border-blue-950/90 bg-[#040B1B] px-3 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
        {activeView === 'simulation' && (
          <button
            onClick={onGoHome}
            className="px-2.5 py-1.5 rounded-lg bg-[#0A1A3A] border border-blue-700 text-[11px] font-semibold text-white whitespace-nowrap shrink-0 flex items-center gap-1 cursor-pointer"
          >
            <Home className="w-3 h-3 text-blue-300" />
            <span>Inicio</span>
          </button>
        )}

        {activeView === 'simulation' && (
          <button
            onClick={onOpenNewCaseModal}
            className="px-2.5 py-1.5 rounded-lg bg-[#0A1A3A] border border-blue-800/70 text-[11px] font-medium text-blue-200 whitespace-nowrap shrink-0 flex items-center gap-1 cursor-pointer"
          >
            <span>Modo:</span>
            <span className="text-white font-semibold">{formatMode(currentMode)}</span>
          </button>
        )}

        <button
          onClick={onOpenHistoryModal}
          className="px-2.5 py-1.5 rounded-lg bg-[#0A1A3A] border border-blue-800/70 text-[11px] font-medium text-blue-100 whitespace-nowrap shrink-0 flex items-center gap-1 cursor-pointer"
        >
          <History className="w-3 h-3 text-blue-400" />
          <span>Historial ({historyCount})</span>
        </button>

        <button
          onClick={onOpenGuideModal}
          className="px-2.5 py-1.5 rounded-lg bg-[#0A1A3A] border border-blue-800/70 text-[11px] font-medium text-blue-100 whitespace-nowrap shrink-0 flex items-center gap-1 cursor-pointer"
        >
          <BookOpen className="w-3 h-3 text-blue-400" />
          <span>Guías OMS/AHA</span>
        </button>

        <button
          onClick={onOpenCalculatorsModal}
          className="px-2.5 py-1.5 rounded-lg bg-[#0A1A3A] border border-blue-800/70 text-[11px] font-medium text-blue-100 whitespace-nowrap shrink-0 flex items-center gap-1 cursor-pointer"
        >
          <Calculator className="w-3 h-3 text-sky-400" />
          <span>Calculadoras</span>
        </button>

        {activeView === 'simulation' && (
          <button
            onClick={onRestartCase}
            className="px-2.5 py-1.5 rounded-lg bg-[#0A1A3A] border border-blue-800/70 text-[11px] font-medium text-blue-200 whitespace-nowrap shrink-0 flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className="w-3 h-3 text-blue-400" />
            <span>Reiniciar</span>
          </button>
        )}
      </div>
    </header>
  );
};
