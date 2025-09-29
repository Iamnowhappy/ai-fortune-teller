import React from 'react';
import type { BusinessNameAnalysisResult } from '../types';
import { TypingResult } from './TypingResult';
import { AnalysisResultLayout } from './shared/AnalysisResultLayout';

interface BusinessNameAnalysisResultDisplayProps {
  result: BusinessNameAnalysisResult;
  onReset: () => void;
  onBack: () => void;
  onSave?: () => void;
  isSaved?: boolean;
  isSavedView?: boolean;
}

export const BusinessNameAnalysisResultDisplay: React.FC<BusinessNameAnalysisResultDisplayProps> = ({ result, onReset, onBack, onSave, isSaved, isSavedView }) => {
  const shareText = `AI로 저희 회사 이름을 분석해봤어요. 점수는 ${result.premium_analysis.name_score}점!\n\n[요약]\n${result.summary}\n\n결과가 궁금하다면 AI 운세 시리즈를 방문해보세요!`;
  const scoreColor = result.premium_analysis.name_score >= 80 ? 'text-cyan-400' : result.premium_analysis.name_score >= 60 ? 'text-yellow-400' : 'text-red-400';

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
                <h2 className="text-2xl sm:text-3xl font-bold text-cyan-300 mb-2 font-display">상호명 점수</h2>
                <p className={`text-6xl font-bold ${scoreColor}`}>{result.premium_analysis.name_score}<span className="text-3xl text-slate-400">점</span></p>
            </div>
            <div className="space-y-6 mt-8">
                <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-white mb-3 font-display">상호명 분석 요약</h3>
                    <TypingResult text={result.summary} className="text-slate-400 leading-relaxed whitespace-pre-wrap" />
                </div>
            </div>
        </>
      }
      premiumContent={
        <div className="space-y-6 mt-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-cyan-300 mb-4 font-display text-center">상호명 상세 분석</h2>
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-3 font-display">종합 분석</h3>
              <p className="text-slate-400 leading-relaxed whitespace-pre-wrap">{result.premium_analysis.detailed_analysis}</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-3 font-display">브랜드 이미지</h3>
              <p className="text-slate-400 leading-relaxed whitespace-pre-wrap">{result.premium_analysis.brand_image}</p>
          </div>
           <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-3 font-display">개선 제안</h3>
              <p className="text-slate-400 leading-relaxed whitespace-pre-wrap">{result.premium_analysis.improvement_suggestions}</p>
          </div>
        </div>
      }
    />
  );
};
