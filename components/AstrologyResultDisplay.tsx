import React from 'react';
import type { AstrologyResult } from '../types';
import { TypingResult } from './TypingResult';
import { motion, Variants } from 'framer-motion';
import { AnalysisResultLayout } from './shared/AnalysisResultLayout';

interface AstrologyResultDisplayProps {
  result: AstrologyResult;
  onReset: () => void;
  onBack: () => void;
  onSave?: () => void;
  isSaved?: boolean;
  isSavedView?: boolean;
  onNavigate: (page: string) => void;
  email: string | null;
}

const itemVariants: Variants = { hidden: { opacity: 0, y: 20, scale: 0.95 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } } };

const PremiumContent: React.FC<{ result: AstrologyResult }> = ({ result }) => (
    <motion.div variants={itemVariants} className="space-y-6 mt-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-cyan-300 mb-4 font-display text-center">상세 운세 분석</h2>
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-3 font-display">상세 성격 분석</h3>
            <p className="text-slate-400 leading-relaxed">{result.premium_analysis.personality}</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-3 font-display">연애 및 관계</h3>
            <p className="text-slate-400 leading-relaxed">{result.premium_analysis.love_life}</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-3 font-display">직업 및 경력</h3>
            <p className="text-slate-400 leading-relaxed">{result.premium_analysis.work_career}</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-3 font-display">건강운</h3>
            <p className="text-slate-400 leading-relaxed">{result.premium_analysis.health_fortune}</p>
        </div>
    </motion.div>
);

export const AstrologyResultDisplay: React.FC<AstrologyResultDisplayProps> = ({ result, onReset, onBack, onSave, isSaved, isSavedView, onNavigate, email }) => {
  const shareText = `AI가 분석한 저의 별자리는 ${result.zodiac_sign}입니다.\n\n[성격 요약]\n${result.summary}\n\n결과가 궁금하다면 AI 운세 시리즈를 방문해보세요!`;
  
  return (
    <AnalysisResultLayout
        onBack={onBack}
        onReset={onReset}
        onSave={onSave}
        isSaved={isSaved}
        isSavedView={isSavedView}
        shareText={shareText}
        onNavigate={onNavigate}
        email={email}
        featureName="AI 별자리 운세"
        freeContent={
            <>
                <div className="bg-slate-800/50 border border-slate-700 rounded-2xl shadow-lg p-6 sm:p-8 text-center">
                    <h2 className="text-2xl sm:text-3xl font-bold text-cyan-300 mb-2 font-display">당신의 별자리 (무료)</h2>
                    <p className="text-4xl sm:text-5xl font-bold text-white mb-4">{result.zodiac_sign}</p>
                    <div className="flex justify-center gap-6 text-slate-300">
                        <span>수호성: {result.ruling_planet}</span>
                        <span>속성: {result.element}</span>
                    </div>
                </div>
                <div className="space-y-6 mt-8">
                    <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
                        <h3 className="text-xl font-bold text-white mb-3 font-display">핵심 성격 요약 (무료)</h3>
                        <TypingResult text={result.summary} className="text-slate-400 leading-relaxed" />
                    </div>
                </div>
            </>
        }
        premiumContent={<PremiumContent result={result} />}
    />
  );
};
