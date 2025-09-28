import React from 'react';
import type { PhysiognomyResult } from '../types';
import { EyeIcon, NoseIcon, MouthIcon, ForeheadIcon, ChinIcon, EarIcon } from './icons';
import { AnalysisInfo } from './AnalysisInfo';
import { ShareButtons } from './ShareButtons';
import { TypingResult } from './TypingResult';
import { motion, Variants } from 'framer-motion';
import { AnalysisResultLayout } from './shared/AnalysisResultLayout';

interface ResultDisplayProps {
  result: PhysiognomyResult;
  onReset: () => void;
  onBack: () => void;
  onSave?: () => void;
  isSaved?: boolean;
  isSavedView?: boolean;
  onNavigate: (page: string) => void;
  email: string | null;
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

const itemVariants: Variants = { hidden: { opacity: 0, y: 20, scale: 0.95 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } } };

const PremiumContent: React.FC<{ result: PhysiognomyResult }> = ({ result }) => (
    <motion.div variants={itemVariants} className="mt-8 space-y-6">
      <h2 className="text-2xl sm:text-3xl font-bold text-cyan-300 mb-2 text-center font-display">상세 분석 리포트</h2>
      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-3 font-display">종합 총평</h3>
          <p className="text-slate-400 leading-relaxed whitespace-pre-wrap">{result.premium_analysis.overall_impression}</p>
      </div>
      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-3 font-display">직업 및 적성</h3>
          <p className="text-slate-400 leading-relaxed whitespace-pre-wrap">{result.premium_analysis.job_suitability}</p>
      </div>
      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-3 font-display">연애 및 대인관계</h3>
          <p className="text-slate-400 leading-relaxed whitespace-pre-wrap">{result.premium_analysis.love_style}</p>
      </div>
      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-3 font-display">건강 및 조언</h3>
          <p className="text-slate-400 leading-relaxed whitespace-pre-wrap">{result.premium_analysis.health_advice}</p>
      </div>
      <h3 className="text-xl font-bold text-white pt-4 font-display">부위별 세부 해설</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {result.features.map((feature, index) => (
          <motion.div variants={itemVariants} key={index} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 flex flex-col gap-4 transition-transform duration-300 hover:scale-105 hover:border-cyan-500">
            <div className="flex items-center gap-4">
              {getFeatureIcon(feature.feature)}
              <div>
                <h3 className="text-xl font-bold text-white">{feature.feature}</h3>
                <p className="text-sm text-cyan-400 font-semibold">{feature.shape}</p>
              </div>
            </div>
            <p className="text-slate-400 leading-relaxed text-left text-base">{feature.analysis}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
);

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, onReset, onBack, onSave, isSaved, isSavedView, onNavigate, email }) => {
  const shareText = `AI 관상가로 분석한 저의 관상 결과입니다:\n\n[요약]\n${result.summary}\n\n결과가 궁금하다면 AI 운세 시리즈를 방문해보세요!`;
  
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
        featureName="AI 관상가"
        freeContent={
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl shadow-lg p-6 sm:p-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-cyan-300 mb-4 font-display">관상 분석 요약 (무료)</h2>
                <TypingResult text={result.summary} className="text-slate-300 leading-relaxed whitespace-pre-wrap" />
            </div>
        }
        premiumContent={<PremiumContent result={result} />}
    />
  );
};
