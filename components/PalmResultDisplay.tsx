import React from 'react';
import type { PalmistryResult } from '../types';
import { RefreshIcon, HomeIcon, HeartLineIcon, HeadLineIcon, LifeLineIcon, LineIcon, SaveIcon, ArrowLeftIcon } from './icons';
import { AnalysisInfo } from './AnalysisInfo';
import { ShareButtons } from './ShareButtons';
import { TypingResult } from './TypingResult';
import { motion, Variants } from 'framer-motion';
import { AnalysisResultLayout } from './shared/AnalysisResultLayout';


interface PalmResultDisplayProps {
  result: PalmistryResult;
  onReset: () => void;
  onBack: () => void;
  onSave?: () => void;
  isSaved?: boolean;
  isSavedView?: boolean;
  onNavigate: (page: string) => void;
  email: string | null;
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

const itemVariants: Variants = { hidden: { opacity: 0, y: 20, scale: 0.95 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } } };

export const PalmResultDisplay: React.FC<PalmResultDisplayProps> = ({ result, onReset, onBack, onSave, isSaved, isSavedView, onNavigate, email }) => {
  const shareText = `AI 손금 분석 결과입니다:\n\n[요약]\n${result.summary}\n\n결과가 궁금하다면 AI 운세 시리즈를 방문해보세요!`;

  const PremiumContent = () => (
    <motion.div variants={itemVariants} className="space-y-6 mt-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-cyan-300 font-display text-center">주요 손금 상세 분석</h2>
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-3 font-display">종합 총평</h3>
            <p className="text-slate-400 leading-relaxed whitespace-pre-wrap">{result.premium_analysis.overall_analysis}</p>
        </div>
      <h3 className="text-xl font-bold text-white pt-4 font-display">주요 손금별 해설</h3>
      {result.premium_analysis.lines.map((line, index) => (
        <motion.div variants={itemVariants} key={index} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 flex items-start gap-4 transition-transform duration-300 hover:scale-105 hover:border-cyan-500">
          <div className="flex-shrink-0 pt-1">
              {getLineIcon(line.line_name)}
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{line.line_name}</h3>
            <p className="text-slate-400 leading-relaxed mt-2">{line.analysis}</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );

  return (
    <AnalysisResultLayout
      onBack={onBack}
      onReset={onReset}
      onSave={onSave}
      isSaved={isSaved}
      isSavedView={isSavedView}
      onNavigate={onNavigate}
      email={email}
      featureName="AI 손금 분석"
      shareText={shareText}
      freeContent={
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl shadow-lg p-6 sm:p-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-cyan-300 mb-4 font-display">손금 분석 요약 (무료)</h2>
            <TypingResult text={result.summary} className="text-slate-300 leading-relaxed whitespace-pre-wrap" />
        </div>
      }
      extraContent={
        <motion.div variants={itemVariants} className="mt-8 bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-cyan-300 mb-3 font-display">분석 신뢰도 (무료)</h3>
            <div className="flex items-center gap-4 sm:gap-6">
                <div className="text-4xl font-bold text-white">{result.credibility_score}%</div>
                <p className="text-slate-400 leading-relaxed text-left text-sm flex-1">{result.credibility_comment}</p>
            </div>
        </motion.div>
      }
      premiumContent={<PremiumContent />}
    />
  );
};