import React from 'react';
import type { SajuResult } from '../types';
import { TypingResult } from './TypingResult';
import { motion, Variants } from 'framer-motion';
import { AnalysisResultLayout } from './shared/AnalysisResultLayout';

interface SajuResultDisplayProps {
  result: SajuResult;
  onReset: () => void;
  onBack: () => void;
  onSave?: () => void;
  isSaved?: boolean;
  isSavedView?: boolean;
}

const itemVariants: Variants = { hidden: { opacity: 0, y: 20, scale: 0.95 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } } };

export const SajuResultDisplay: React.FC<SajuResultDisplayProps> = ({ result, onReset, onBack, onSave, isSaved, isSavedView }) => {
  const shareText = `AI 사주 분석 결과, 저의 일간은 ${result.day_master} 입니다.\n\n[오늘의 운세 요약]\n${result.daily_fortune_summary}\n\n결과가 궁금하다면 AI 운세 시리즈를 방문해보세요!`;
  
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
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl shadow-lg p-6 sm:p-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-cyan-300 mb-4 font-display">사주 명식</h2>
                <div className="grid grid-cols-4 gap-2 text-center text-white rounded-lg overflow-hidden border border-slate-700">
                    <div className="bg-slate-700/50 p-2 font-bold">시주(時柱)</div>
                    <div className="bg-slate-700/50 p-2 font-bold">일주(日柱)</div>
                    <div className="bg-slate-700/50 p-2 font-bold">월주(月柱)</div>
                    <div className="bg-slate-700/50 p-2 font-bold">연주(年柱)</div>
                    <div className="bg-slate-800 p-4 text-lg">{result.four_pillars.hour_pillar}</div>
                    <div className="bg-cyan-500/10 border-2 border-cyan-500 p-4 text-lg font-bold text-cyan-300">{result.four_pillars.day_pillar}</div>
                    <div className="bg-slate-800 p-4 text-lg">{result.four_pillars.month_pillar}</div>
                    <div className="bg-slate-800 p-4 text-lg">{result.four_pillars.year_pillar}</div>
                </div>
                <p className="text-center text-sm text-slate-400 mt-3">
                    당신의 본질을 나타내는 일간(日干)은 <strong className="text-cyan-400">{result.day_master}</strong> 입니다.
                </p>
            </div>

            <div className="space-y-6 mt-8">
                <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-white mb-3 font-display">오늘의 운세 요약</h3>
                    <TypingResult text={result.daily_fortune_summary} className="text-slate-400 leading-relaxed whitespace-pre-wrap" />
                </div>
            </div>
        </>
      }
      premiumContent={
        <div className="space-y-6 mt-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-cyan-300 mb-4 font-display text-center">사주 심층 분석</h2>
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-3 font-display">종합 분석</h3>
              <p className="text-slate-400 leading-relaxed whitespace-pre-wrap">{result.premium_analysis.overall_analysis}</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-3 font-display">오행의 균형</h3>
              <p className="text-slate-400 leading-relaxed whitespace-pre-wrap">{result.premium_analysis.elemental_balance}</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-3 font-display">분야별 상세운</h3>
              <p className="text-slate-400 leading-relaxed whitespace-pre-wrap"><strong className="text-cyan-400">연애운:</strong> {result.premium_analysis.love_fortune}</p>
              <p className="text-slate-400 leading-relaxed whitespace-pre-wrap mt-2"><strong className="text-cyan-400">재물운:</strong> {result.premium_analysis.money_fortune}</p>
              <p className="text-slate-400 leading-relaxed whitespace-pre-wrap mt-2"><strong className="text-cyan-400">직업운:</strong> {result.premium_analysis.career_fortune}</p>
              <p className="text-slate-400 leading-relaxed whitespace-pre-wrap mt-2"><strong className="text-cyan-400">건강운:</strong> {result.premium_analysis.health_fortune}</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-3 font-display">삶의 조언</h3>
              <p className="text-slate-400 leading-relaxed whitespace-pre-wrap">{result.premium_analysis.life_advice}</p>
          </div>
        </div>
      }
    />
  );
};