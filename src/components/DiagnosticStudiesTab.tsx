import React, { useState } from 'react';
import { ClinicalCase, ComplementaryStudy } from '../types/clinical';
import { HOSPITAL_SUBCATEGORY_ORDER } from '../utils/studiesCatalog';
import {
  FlaskConical,
  ImageIcon,
  Activity,
  CheckCircle2,
  Search,
  ChevronRight,
  Microscope,
  HeartPulse,
  Droplets,
  Scan,
  Bone,
  Waves,
  Wind,
  Beaker,
  TestTube2,
  LayoutGrid,
  ListChecks,
} from 'lucide-react';

interface DiagnosticStudiesTabProps {
  caseData: ClinicalCase;
  unlockedStudyIds: string[];
  onUnlockStudy: (studyId: string) => void;
  onUnlockAllStudies: () => void;
}

function getStudyIcon(study: ComplementaryStudy, className = 'w-4 h-4 shrink-0') {
  switch (study.subcategory) {
    case 'Microbiología / Serología':
      return <Microscope className={className} />;
    case 'Cardiovascular':
    case 'Electrocardiograma':
      return <HeartPulse className={className} />;
    case 'Hematología':
    case 'Inflamación e Infección':
      return <Droplets className={className} />;
    case 'Tomografía':
      return <Scan className={className} />;
    case 'Radiología':
      return <Bone className={className} />;
    case 'Ecografía':
      return <Waves className={className} />;
    case 'Gases':
      return <Wind className={className} />;
    case 'Urinario':
      return <Beaker className={className} />;
    case 'Bioquímica':
    case 'Electrolitos':
    case 'Función Hepática':
      return <TestTube2 className={className} />;
    default:
      if (study.category === 'Imagen') return <ImageIcon className={className} />;
      if (study.category === 'Gabinete y Trazados') return <Activity className={className} />;
      return <FlaskConical className={className} />;
  }
}

export const DiagnosticStudiesTab: React.FC<DiagnosticStudiesTabProps> = ({
  caseData,
  unlockedStudyIds,
  onUnlockStudy,
  onUnlockAllStudies,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'Todos' | 'Laboratorio' | 'Imagen' | 'Gabinete y Trazados'>('Todos');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('Todas');
  const [searchFilter, setSearchFilter] = useState('');

  const SUBCATEGORY_ORDER = HOSPITAL_SUBCATEGORY_ORDER;

  const SUBCATEGORY_SHORT_LABEL: Record<string, string> = {
    Gases: 'Gasometría',
    Hematología: 'Hematología',
    Bioquímica: 'Bioquímica',
    Electrolitos: 'Electrolitos',
    'Función Hepática': 'Perfil Hepático',
    'Inflamación e Infección': 'PCR / VSG',
    Cardiovascular: 'Cardíacos',
    Urinario: 'Orina / EGO',
    'Microbiología / Serología': 'Microbiología',
    Radiología: 'Radiografías',
    Ecografía: 'Ultrasonido',
    Tomografía: 'TAC / RMN',
    Electrocardiograma: 'ECG',
  };

  const categoryScopedStudies = caseData.studiesPool.filter(
    (std) => selectedCategory === 'Todos' || std.category === selectedCategory
  );

  const availableSubcategories = SUBCATEGORY_ORDER.filter((sub) =>
    categoryScopedStudies.some((std) => std.subcategory === sub)
  );

  const handleSelectCategory = (cat: 'Todos' | 'Laboratorio' | 'Imagen' | 'Gabinete y Trazados') => {
    setSelectedCategory(cat);
    setSelectedSubcategory('Todas');
  };

  const filteredPool = categoryScopedStudies.filter((std) => {
    const matchesSubcategory =
      selectedSubcategory === 'Todas' || std.subcategory === selectedSubcategory;
    const matchesSearch =
      std.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      std.subcategory.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesSubcategory && matchesSearch;
  });

  const isExamMode = caseData.mode === 'examen';
  const totalStudies = caseData.studiesPool.length;
  const unlockedCount = caseData.studiesPool.filter((s) => unlockedStudyIds.includes(s.id)).length;

  const categoryTabs: Array<{
    id: 'Todos' | 'Laboratorio' | 'Imagen' | 'Gabinete y Trazados';
    icon: React.ReactNode;
  }> = [
    { id: 'Todos', icon: <LayoutGrid className="w-3.5 h-3.5 shrink-0" /> },
    { id: 'Laboratorio', icon: <FlaskConical className="w-3.5 h-3.5 shrink-0" /> },
    { id: 'Imagen', icon: <Scan className="w-3.5 h-3.5 shrink-0" /> },
    { id: 'Gabinete y Trazados', icon: <HeartPulse className="w-3.5 h-3.5 shrink-0" /> },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Bar */}
      <div className="bg-[#07132B] border border-blue-900/60 rounded-xl p-4 sm:p-5 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-blue-400 shrink-0" />
              <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
                Laboratorio Clínico, Gabinete e Imagen
              </h2>
            </div>
            <p className="text-xs text-blue-200/80 mt-1">
              {isExamMode
                ? 'Modo Examen: solicite de forma individual únicamente los estudios justificados e interprete los resultados sin alertas de color.'
                : 'Solicite únicamente los estudios complementarios pertinentes y justificados para confirmar o descartar sus hipótesis diagnósticas.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 shrink-0">
            <div className="text-xs text-blue-100 font-medium">
              Solicitados: <span className="font-mono text-white font-bold">{unlockedCount}</span> / {totalStudies}
            </div>
            {!isExamMode && (
              <button
                onClick={onUnlockAllStudies}
                className="w-full sm:w-auto px-3.5 py-2 text-xs font-semibold text-white bg-[#0D2149] hover:bg-blue-700 border border-blue-700/70 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <ListChecks className="w-3.5 h-3.5 text-sky-300 shrink-0" />
                <span>Solicitar Batería Completa</span>
              </button>
            )}
          </div>
        </div>

        {/* Category & Search controls */}
        <div className="mt-4 pt-3 border-t border-blue-900/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 no-scrollbar">
            {categoryTabs.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleSelectCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 transition-colors cursor-pointer flex items-center gap-1.5 ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white font-semibold shadow-sm'
                    : 'bg-[#040B1B] text-blue-200 hover:text-white border border-blue-900/70'
                }`}
              >
                {cat.icon}
                <span>{cat.id}</span>
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-blue-300 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Buscar estudio o prueba..."
              className="w-full bg-[#040B1B] border border-blue-900/70 rounded-lg pl-8 pr-3 py-2 text-xs text-white placeholder-blue-300/50 focus:outline-none focus:border-blue-400"
            />
          </div>
        </div>

        {/* Subcategory Quick Filters */}
        {availableSubcategories.length > 1 && (
          <div className="mt-2.5 pt-2.5 border-t border-blue-900/40 flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-blue-300/80 shrink-0 mr-1">
              Área:
            </span>
            <button
              onClick={() => setSelectedSubcategory('Todas')}
              className={`px-2.5 py-1 text-[11px] font-medium rounded-md whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                selectedSubcategory === 'Todas'
                  ? 'bg-sky-500/20 text-sky-200 border border-sky-400/60 font-semibold'
                  : 'bg-[#040B1B] text-blue-200/80 hover:text-white border border-blue-900/60'
              }`}
            >
              Todas ({categoryScopedStudies.length})
            </button>
            {availableSubcategories.map((sub) => {
              const count = categoryScopedStudies.filter((s) => s.subcategory === sub).length;
              const isSelected = selectedSubcategory === sub;
              return (
                <button
                  key={sub}
                  onClick={() => setSelectedSubcategory(sub)}
                  className={`px-2.5 py-1 text-[11px] font-medium rounded-md whitespace-nowrap shrink-0 transition-colors cursor-pointer flex items-center gap-1 ${
                    isSelected
                      ? 'bg-sky-500/20 text-sky-200 border border-sky-400/60 font-semibold'
                      : 'bg-[#040B1B] text-blue-200/80 hover:text-white border border-blue-900/60'
                  }`}
                >
                  <span>{SUBCATEGORY_SHORT_LABEL[sub] || sub}</span>
                  <span className="text-[10px] font-mono opacity-75">({count})</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Studies Cards Grid */}
      <div className="space-y-3.5 sm:space-y-4">
        {filteredPool.length === 0 ? (
          <div className="bg-[#07132B] border border-blue-900/60 rounded-xl p-8 text-center text-blue-200/70 text-xs space-y-2.5">
            <p>No se encontraron estudios que coincidan con los criterios de búsqueda o subcategoría.</p>
            {(selectedCategory !== 'Todos' || selectedSubcategory !== 'Todas' || searchFilter) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('Todos');
                  setSelectedSubcategory('Todas');
                  setSearchFilter('');
                }}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        ) : (
          filteredPool.map((study) => {
            const isUnlocked = unlockedStudyIds.includes(study.id);

            return (
              <div
                key={study.id}
                className={`rounded-xl border transition-all overflow-hidden ${
                  isUnlocked
                    ? !isExamMode && study.isAbnormal
                      ? 'bg-[#07132B] border-amber-500/60 shadow-md'
                      : 'bg-[#07132B] border-blue-700/70'
                    : 'bg-[#040B1B] border-blue-900/60'
                }`}
              >
                <div className="p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start sm:items-center gap-3 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                          study.category === 'Laboratorio'
                            ? 'bg-blue-950 border border-blue-700 text-blue-300'
                            : study.category === 'Imagen'
                            ? 'bg-[#0D2149] border border-blue-600 text-sky-300'
                            : 'bg-black border border-blue-800 text-blue-300'
                        }`}
                      >
                        {getStudyIcon(study, 'w-4 h-4')}
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-300">
                            {study.category} · {study.subcategory}
                          </span>
                          {isUnlocked && (
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-blue-950 text-blue-200 border border-blue-700/70">
                              Reporte Emitido
                            </span>
                          )}
                        </div>
                        <h3 className="text-sm font-bold text-white mt-0.5 break-words">
                          {study.name}
                        </h3>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {isUnlocked ? (
                        <div className="flex items-center gap-1.5 text-xs text-blue-300 font-medium">
                          <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                          <span>Reporte Disponible</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => onUnlockStudy(study.id)}
                          className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          {getStudyIcon(study, 'w-3.5 h-3.5 shrink-0')}
                          <span>Solicitar Estudio</span>
                          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Unlocked Study Content Report */}
                  {isUnlocked && (
                    <div className="mt-4 pt-4 border-t border-blue-900/60 space-y-3">
                      <div className="bg-black/60 p-3.5 sm:p-4 rounded-xl border border-blue-900/70 font-mono text-xs text-white">
                        <div className="text-[10px] text-blue-300 font-sans uppercase font-semibold mb-1">
                          Informe Oficial del Laboratorio / Gabinete:
                        </div>
                        <div className="text-xs sm:text-sm font-sans font-semibold text-white whitespace-pre-line leading-relaxed break-words">
                          {study.result}
                        </div>

                        {study.referenceRange && (
                          <div className="mt-2 text-xs font-sans text-blue-200/80 border-t border-blue-900/60 pt-2 flex flex-wrap items-center gap-1.5">
                            <span className="font-semibold text-blue-300">Valores de Referencia:</span>
                            <span>{study.referenceRange}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
