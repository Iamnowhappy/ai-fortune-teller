import React from 'react';
import type { PalmistryResult } from '../types';
import { RefreshIcon, HomeIcon, HeartLineIcon, HeadLineIcon, LifeLineIcon, LineIcon } from './icons';
import { AnalysisInfo } from './AnalysisInfo';

interface PalmResultDisplayProps {
  result: PalmistryResult;
  onReset: () => void;
  onBack: () => void;
}

const lineIcons: { [key: string]: React.ReactNode } = {
  '생명선': <LifeLineIcon className="w-8 h-8 text-cyan-400" />,
  '감정선': <HeartLineIcon className="w-8 h-8 text-cyan-400" />,
  '두뇌선': <HeadLineIcon className="w-8 h-8 text-cyan-400" />,
};

const getLineIcon = (lineName: string) => {
    for (const key in lineIcons) {
        if (lineName.includes(key)) {
            return lineIcons[key];
        }
    }
    return <LineIcon className="w-8 h-8 text-cyan-400" />; // Fallback
}

export const PalmResultDisplay: React.FC<PalmResultDisplayProps> = ({ result, onReset, onBack }) => {
  return (
    <div className="w-full max-w-3xl animate-fade-in">
      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl shadow-lg p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-cyan-300 mb-4 font-display">손금 분석 총평</h2>
        <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{result.overall_analysis}</p>
      </div>

      <div className="mt-8 bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-cyan-300 mb-3 font-display">분석 신뢰도</h3>
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="text-4xl font-bold text-white">{result.credibility_score}%</div>
          <p className="text-slate-400 leading-relaxed text-left text-sm flex-1">{result.credibility_comment}</p>
        </div>
      </div>

      <div className="space-y-6 mt-8">
        {result.lines.map((line, index) => (
          <div key={index} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 flex items-start gap-4 transition-transform duration-300 hover:scale-105 hover:border-cyan-500">
            <div className="flex-shrink-0 pt-1">
                {getLineIcon(line.line_name)}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{line.line_name}</h3>
              <p className="text-slate-400 leading-relaxed mt-2">{line.analysis}</p>
            </div>
          </div>
        ))}
      </div>

      <AnalysisInfo />

      <div className="mt-10 text-center flex flex-wrap justify-center gap-4">
        <button
          onClick={onBack}
          className="py-3 px-8 bg-slate-600 text-white font-bold text-lg rounded-lg shadow-md transition-all duration-300 hover:bg-slate-500 flex items-center gap-2"
        >
          <HomeIcon className="w-5 h-5" />
          홈으로
        </button>
        <button
          onClick={onReset}
          className="py-3 px-8 bg-cyan-500 text-slate-900 font-bold text-lg rounded-lg shadow-md transition-all duration-300 hover:bg-cyan-400 hover:shadow-cyan-400/30 flex items-center gap-2"
        >
          <RefreshIcon className="w-5 h-5" />
          다시 분석하기
        </button>
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