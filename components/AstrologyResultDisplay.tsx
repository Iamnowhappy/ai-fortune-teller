
import React from 'react';
import type { AstrologyResult } from '../types';
import { RefreshIcon, HomeIcon, SaveIcon, ShareIcon, ArrowLeftIcon } from './icons';
import { AnalysisInfo } from './AnalysisInfo';

interface AstrologyResultDisplayProps {
  result: AstrologyResult;
  onReset: () => void;
  onBack: () => void;
  onSave?: () => void;
  onShare?: () => void;
  isSaved?: boolean;
  isSavedView?: boolean;
}

export const AstrologyResultDisplay: React.FC<AstrologyResultDisplayProps> = ({ result, onReset, onBack, onSave, onShare, isSaved, isSavedView }) => {
  return (
    <div className="w-full max-w-3xl animate-fade-in">
      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl shadow-lg p-6 sm:p-8 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-cyan-300 mb-2 font-display">당신의 별자리</h2>
        <p className="text-4xl sm:text-5xl font-bold text-white mb-4">{result.zodiac_sign}</p>
        <div className="flex justify-center gap-6 text-slate-300">
            <span>수호성: {result.ruling_planet}</span>
            <span>속성: {result.element}</span>
        </div>
      </div>

      <div className="space-y-6 mt-8">
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-3 font-display">성격 분석</h3>
            <p className="text-slate-400 leading-relaxed">{result.analysis.personality}</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-3 font-display">연애 및 관계</h3>
            <p className="text-slate-400 leading-relaxed">{result.analysis.love_life}</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-3 font-display">직업 및 경력</h3>
            <p className="text-slate-400 leading-relaxed">{result.analysis.work_career}</p>
        </div>
      </div>
      
      <AnalysisInfo />

      <div className="mt-10 text-center flex flex-wrap justify-center gap-4">
        <button
          onClick={onBack}
          className="py-3 px-6 bg-slate-600 text-white font-bold text-lg rounded-lg shadow-md transition-all duration-300 hover:bg-slate-500 flex items-center gap-2"
        >
          {isSavedView ? <ArrowLeftIcon className="w-5 h-5" /> : <HomeIcon className="w-5 h-5" />}
          {isSavedView ? '목록으로' : '홈으로'}
        </button>
        
        {!isSavedView && (
          <>
            <button
              onClick={onReset}
              className="py-3 px-6 bg-cyan-500 text-slate-900 font-bold text-lg rounded-lg shadow-md transition-all duration-300 hover:bg-cyan-400 hover:shadow-cyan-400/30 flex items-center gap-2"
            >
              <RefreshIcon className="w-5 h-5" />
              다시 분석
            </button>
            <button
              onClick={onSave}
              disabled={isSaved}
              className="py-3 px-6 bg-slate-700 text-white font-bold text-lg rounded-lg shadow-md transition-all duration-300 hover:bg-slate-600 disabled:bg-green-500 disabled:text-slate-900 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <SaveIcon className="w-5 h-5" />
              {isSaved ? '저장됨!' : '결과 저장'}
            </button>
            <button
              onClick={onShare}
              className="py-3 px-6 bg-slate-700 text-white font-bold text-lg rounded-lg shadow-md transition-all duration-300 hover:bg-slate-600 flex items-center gap-2"
            >
              <ShareIcon className="w-5 h-5" />
              공유하기
            </button>
          </>
        )}
      </div>
       <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.7s ease-out forwards;
        }
      `}</style>
    </div>
  );
};
