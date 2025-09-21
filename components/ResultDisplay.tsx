import React from 'react';
import type { PhysiognomyResult } from '../types';
import { EyeIcon, NoseIcon, MouthIcon, ForeheadIcon, ChinIcon, EarIcon, RefreshIcon, HomeIcon } from './icons';
import { AnalysisInfo } from './AnalysisInfo';

interface ResultDisplayProps {
  result: PhysiognomyResult;
  onReset: () => void;
  onBack: () => void;
}

const featureIcons: { [key: string]: React.ReactNode } = {
  '눈': <EyeIcon className="w-8 h-8 text-cyan-400" />,
  '코': <NoseIcon className="w-8 h-8 text-cyan-400" />,
  '입': <MouthIcon className="w-8 h-8 text-cyan-400" />,
  '이마': <ForeheadIcon className="w-8 h-8 text-cyan-400" />,
  '턱': <ChinIcon className="w-8 h-8 text-cyan-400" />,
  '귀': <EarIcon className="w-8 h-8 text-cyan-400" />,
};

const getFeatureIcon = (featureName: string) => {
    for (const key in featureIcons) {
        if (featureName.includes(key)) {
            return featureIcons[key];
        }
    }
    return null;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, onReset, onBack }) => {
  return (
    <div className="w-full max-w-3xl animate-fade-in">
      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl shadow-lg p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-cyan-300 mb-4 font-display">관상 분석 총평</h2>
        <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{result.overall_impression}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {result.features.map((feature, index) => (
          <div key={index} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 flex flex-col gap-4 transition-transform duration-300 hover:scale-105 hover:border-cyan-500">
            <div className="flex items-center gap-4">
              {getFeatureIcon(feature.feature)}
              <div>
                <h3 className="text-xl font-bold text-white">{feature.feature}</h3>
                <p className="text-sm text-cyan-400 font-semibold">{feature.shape}</p>
              </div>
            </div>
            <p className="text-slate-400 leading-relaxed text-left text-base">{feature.analysis}</p>
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