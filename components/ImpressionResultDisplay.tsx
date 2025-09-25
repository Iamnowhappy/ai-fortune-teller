import React from 'react';
import type { ImpressionAnalysisResult } from '../types';
import { RefreshIcon, HomeIcon, LightbulbIcon, SaveIcon, ArrowLeftIcon } from './icons';
import { AnalysisInfo } from './AnalysisInfo';
import { ShareButtons } from './ShareButtons';
import { UpgradeCTA } from './PremiumPlaceholder';
import { TypingResult } from './TypingResult';
import { motion, Variants } from 'framer-motion';
import { PremiumRoute } from './shared/PremiumRoute';

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

const containerVariants: Variants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVariants: Variants = { hidden: { opacity: 0, y: 20, scale: 0.95 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } } };

export const ImpressionResultDisplay: React.FC<ImpressionResultDisplayProps> = ({ result, onReset, onBack, onSave, isSaved, isSavedView, onNavigate, email }) => {
  const shareText = `AI가 분석한 저의 첫인상 키워드는 '${result.keywords.join(', ')}' 입니다.\n\n[상세 분석]\n${result.detailed_analysis}\n\n결과가 궁금하다면 AI 운세 시리즈를 방문해보세요!`;
  
  const PremiumContent = () => (
     <motion.div variants={itemVariants} className="mt-8 bg-slate-800/50 border border-slate-700 rounded-2xl p-6 flex items-start gap-4">
        <div className="flex-shrink-0 pt-1">
            <LightbulbIcon className="w-8 h-8 text-yellow-400" />
        </div>
        <div>
            <h3 className="text-xl font-bold text-yellow-300 mb-2 font-display">첫인상 개선을 위한 TIP (프리미엄)</h3>
            <p className="text-slate-400 leading-relaxed">{result.improvement_tip}</p>
        </div>
      </motion.div>
  );

  return (
    <motion.div 
      className="w-full max-w-3xl"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="bg-slate-800/50 border border-slate-700 rounded-2xl shadow-lg p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-cyan-300 mb-4 font-display">첫인상 분석 결과 (무료)</h2>
        <div className="flex flex-wrap gap-3 mb-6">
            {result.keywords.map((keyword, index) => (
                <span key={index} className="bg-cyan-500/20 text-cyan-300 text-sm font-semibold px-3 py-1 rounded-full">
                    # {keyword}
                </span>
            ))}
        </div>
        <TypingResult text={result.detailed_analysis} className="text-slate-300 leading-relaxed whitespace-pre-wrap" />
      </motion.div>

      {!isSavedView && <motion.div variants={itemVariants}><UpgradeCTA /></motion.div>}

      {isSavedView ? <PremiumContent /> : (
          <PremiumRoute navigate={onNavigate} email={email}>
              <PremiumContent />
          </PremiumRoute>
      )}
      
      <motion.div variants={itemVariants}><AnalysisInfo /></motion.div>
      {!isSavedView && <motion.div variants={itemVariants}><ShareButtons shareText={shareText} /></motion.div>}

      <motion.div variants={itemVariants} className="mt-10 text-center flex flex-wrap justify-center gap-4">
        <button
          onClick={onBack}
          className="py-3 px-6 bg-slate-600 text-white font-bold text-lg rounded-lg shadow-md transition-all duration-300 hover:bg-slate-500 flex items-center gap-2"
        >
          {isSavedView ? <ArrowLeftIcon className="w-5 h-5" /> : <HomeIcon className="w-5 h-5" />}
          {isSavedView ? '목록으로' : '홈으로'}
        </button>
        
        {!isSavedView && (
          <>
            <button
              onClick={onReset}
              className="py-3 px-6 bg-cyan-500 text-slate-900 font-bold text-lg rounded-lg shadow-md transition-all duration-300 hover:bg-cyan-400 hover:shadow-cyan-400/30 flex items-center gap-2"
            >
              <RefreshIcon className="w-5 h-5" />
              다시 분석
            </button>
            <button
              onClick={onSave}
              disabled={isSaved}
              className="py-3 px-6 bg-slate-700 text-white font-bold text-lg rounded-lg shadow-md transition-all duration-300 hover:bg-slate-600 disabled:bg-green-500 disabled:text-slate-900 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <SaveIcon className="w-5 h-5" />
              {isSaved ? '저장됨!' : '결과 저장'}
            </button>
          </>
        )}
      </motion.div>
    </motion.div>
  );
};
