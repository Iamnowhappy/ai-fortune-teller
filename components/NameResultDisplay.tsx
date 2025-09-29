import React from 'react';
import type { NameGenerationResult } from '../types';
import { TypingResult } from './TypingResult';
import { motion } from 'framer-motion';
import { AnalysisResultLayout } from './shared/AnalysisResultLayout';

interface NameResultDisplayProps {
  result: NameGenerationResult;
  lastName: string;
  onReset: () => void;
  onBack: () => void;
  onSave?: () => void;
  isSaved?: boolean;
  isSavedView?: boolean;
}

export const NameResultDisplay: React.FC<NameResultDisplayProps> = ({ result, lastName, onReset, onBack, onSave, isSaved, isSavedView }) => {
  const fullName = `${lastName}${result.premium_analysis.name}`;
  const shareText = `AI 작명가가 추천한 이름은 '${fullName}'입니다.\n\n[이름 요약]\n${result.summary}\n\n결과가 궁금하다면 AI 운세 시리즈를 방문해보세요!`;
  
  return (
    <AnalysisResultLayout
      onBack={onBack}
      onReset={onReset}
      onSave={onSave}
      isSaved={isSaved}
      isSavedView={isSavedView}
      shareText={shareText}
      freeContent={
        <>
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl shadow-lg p-6 sm:p-8 text-center">
                <h2 className="text-2xl sm:text-3xl font-bold text-cyan-300 mb-2 font-display">AI 추천 이름</h2>
                <p className="text-5xl sm:text-6xl font-bold text-white mb-2">{fullName}</p>
                <p className="text-xl text-slate-300">{result.premium_analysis.hanja}</p>
            </div>
            <div className="space-y-6 mt-8">
                <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-white mb-3 font-display">이름 요약</h3>
                    <TypingResult text={result.summary} className="text-slate-400 leading-relaxed whitespace-pre-wrap" />
                </div>
            </div>
        </>
      }
      premiumContent={
        <div className="space-y-6 mt-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-cyan-300 mb-4 font-display text-center">작명 상세 해설</h2>
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-3 font-display">이름의 의미</h3>
              <p className="text-slate-400 leading-relaxed whitespace-pre-wrap">{result.premium_analysis.meaning}</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-3 font-display">사주와 오행 분석</h3>
              <p className="text-slate-400 leading-relaxed whitespace-pre-wrap">{result.premium_analysis.five_elements_analysis}</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-3 font-display">소리(발음) 분석</h3>
              <p className="text-slate-400 leading-relaxed whitespace-pre-wrap">{result.premium_analysis.sound_analysis}</p>
          </div>
           <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-3 font-display">종합 운세</h3>
              <p className="text-slate-400 leading-relaxed whitespace-pre-wrap">{result.premium_analysis.overall_fortune}</p>
          </div>
        </div>
      }
    />
  );
};
