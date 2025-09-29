import React from 'react';
import type { BusinessNameResult } from '../types';
import { TypingResult } from './TypingResult';
import { motion } from 'framer-motion';
import { AnalysisResultLayout } from './shared/AnalysisResultLayout';

interface BusinessNameResultDisplayProps {
  result: BusinessNameResult;
  onReset: () => void;
  onBack: () => void;
  onSave?: () => void;
  isSaved?: boolean;
  isSavedView?: boolean;
}

export const BusinessNameResultDisplay: React.FC<BusinessNameResultDisplayProps> = ({ result, onReset, onBack, onSave, isSaved, isSavedView }) => {
  const shareText = `AI가 추천한 상호명: ${result.premium_analysis.names[0]?.name}\n\n[요약]\n${result.summary}\n\n결과가 궁금하다면 AI 운세 시리즈를 방문해보세요!`;
  
  return (
    <AnalysisResultLayout
      onBack={onBack}
      onReset={onReset}
      onSave={onSave}
      isSaved={isSaved}
      isSavedView={isSavedView}
      shareText={shareText}
      freeContent={
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl shadow-lg p-6 sm:p-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-cyan-300 mb-4 font-display">작명 요약</h2>
            <TypingResult text={result.summary} className="text-slate-300 leading-relaxed whitespace-pre-wrap" />
        </div>
      }
      premiumContent={
        <div className="space-y-6 mt-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-cyan-300 mb-4 font-display text-center">상호명 추천 상세 리포트</h2>
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 font-display">추천 상호명</h3>
              <div className="space-y-4">
                {result.premium_analysis.names.map((item, index) => (
                    <div key={index} className="border-b border-slate-700 pb-3 last:border-b-0">
                        <p className="font-bold text-cyan-400 text-2xl">{item.name}</p>
                        <p className="text-slate-400 mt-1">{item.meaning}</p>
                    </div>
                ))}
              </div>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-3 font-display">작명 전략</h3>
              <p className="text-slate-400 leading-relaxed whitespace-pre-wrap">{result.premium_analysis.naming_strategy}</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-3 font-display">추천 슬로건</h3>
               <ul className="list-disc list-inside space-y-2 text-slate-300">
                    {result.premium_analysis.slogan_suggestions.map((slogan, index) => (
                        <li key={index}>{slogan}</li>
                    ))}
                </ul>
          </div>
        </div>
      }
    />
  );
};
