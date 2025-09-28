import React from 'react';
import type { ImpressionAnalysisResult } from '../types';
import { RefreshIcon, HomeIcon, LightbulbIcon, SaveIcon, ArrowLeftIcon } from './icons';
import { TypingResult } from './TypingResult';
import { motion, Variants } from 'framer-motion';
import { AnalysisResultLayout } from './shared/AnalysisResultLayout';

// FIX: Added onNavigate and email to props interface.
interface ImpressionResultDisplayProps {
  result: ImpressionAnalysisResult;
  onReset: () => void;
  onBack: () => void;
  onSave?: () => void;
  isSaved?: boolean;
  isSavedView?: boolean;
  onNavigate: (page: string) => void;
  email: string | null;
}

const itemVariants: Variants = { hidden: { opacity: 0, y: 20, scale: 0.95 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } } };

// FIX: Destructured and passed new props to AnalysisResultLayout.
export const ImpressionResultDisplay: React.FC<ImpressionResultDisplayProps> = ({ result, onReset, onBack, onSave, isSaved, isSavedView, onNavigate, email }) => {
  const shareText = `AI가 분석한 저의 첫인상 요약은 '${result.summary}' 입니다.\n\n결과가 궁금하다면 AI 운세 시리즈를 방문해보세요!`;
  
  const PremiumContent = () => (
     <motion.div variants={itemVariants} className="mt-8 space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-cyan-300 mb-2 text-center font-display">상세 분석 리포트</h2>
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-3 font-display">핵심 키워드</h3>
            <div className="flex flex-wrap gap-3">
                {result.premium_analysis.keywords.map((keyword, index) => (
                    <span key={index} className="bg-cyan-500/20 text-cyan-300 text-sm font-semibold px-3 py-1 rounded-full">
                        # {keyword}
                    </span>
                ))}
            </div>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-3 font-display">상세 분석</h3>
            <p className="text-slate-400 leading-relaxed whitespace-pre-wrap">{result.premium_analysis.detailed_analysis}</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-3 font-display">상황별 첫인상</h3>
            <p className="text-slate-400 leading-relaxed whitespace-pre-wrap">{result.premium_analysis.situational_analysis}</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 flex items-start gap-4">
            <div className="flex-shrink-0 pt-1">
                <LightbulbIcon className="w-8 h-8 text-yellow-400" />
            </div>
            <div>
                <h3 className="text-xl font-bold text-yellow-300 mb-2 font-display">첫인상 개선 TIP</h3>
                <p className="text-slate-400 leading-relaxed">{result.premium_analysis.improvement_tip}</p>
            </div>
        </div>
    </motion.div>
  );

  return (
    <AnalysisResultLayout
      onBack={onBack}
      onReset={onReset}
      onSave={onSave}
      isSaved={isSaved}
      isSavedView={isSavedView}
      // FIX: Passed missing props.
      onNavigate={onNavigate}
      email={email}
      featureName="AI 첫인상 분석"
      shareText={shareText}
      freeContent={
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl shadow-lg p-6 sm:p-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-cyan-300 mb-4 font-display">첫인상 요약 (무료)</h2>
            <TypingResult text={result.summary} className="text-slate-300 leading-relaxed whitespace-pre-wrap" />
          </div>
      }
      premiumContent={<PremiumContent />}
    />
  );
};
