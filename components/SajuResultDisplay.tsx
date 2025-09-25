import React from 'react';
import type { SajuResult } from '../types';
import { RefreshIcon, HomeIcon, SaveIcon, ArrowLeftIcon } from './icons';
import { AnalysisInfo } from './AnalysisInfo';
import { ShareButtons } from './ShareButtons';
import { UpgradeCTA } from './PremiumPlaceholder';
import { TypingResult } from './TypingResult';
import { motion, Variants } from 'framer-motion';
import { PremiumRoute } from './shared/PremiumRoute';

interface SajuResultDisplayProps {
  result: SajuResult;
  onReset: () => void;
  onBack: () => void;
  onSave?: () => void;
  isSaved?: boolean;
  isSavedView?: boolean;
  onNavigate: (page: string) => void;
}

const containerVariants: Variants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVariants: Variants = { hidden: { opacity: 0, y: 20, scale: 0.95 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } } };

export const SajuResultDisplay: React.FC<SajuResultDisplayProps> = ({ result, onReset, onBack, onSave, isSaved, isSavedView, onNavigate }) => {
  const shareText = `AI 사주 분석 결과, 저의 일간은 ${result.day_master} 입니다.\n\n[종합 분석]\n${result.overall_analysis}\n\n결과가 궁금하다면 AI 운세 시리즈를 방문해보세요!`;
  
  const PremiumContent = () => (
     <div className="space-y-6 mt-8">
        <motion.div variants={itemVariants} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-3 font-display">오행의 균형 (프리미엄)</h3>
            <TypingResult text={result.elemental_analysis} className="text-slate-400 leading-relaxed whitespace-pre-wrap" />
        </motion.div>
        <motion.div variants={itemVariants} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-3 font-display">삶의 조언 (프리미엄)</h3>
            <TypingResult text={result.life_advice} className="text-slate-400 leading-relaxed whitespace-pre-wrap" />
        </motion.div>
      </div>
  );

  return (
    <motion.div 
      className="w-full max-w-3xl"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="bg-slate-800/50 border border-slate-700 rounded-2xl shadow-lg p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-cyan-300 mb-4 font-display">사주 명식 (四柱命式)</h2>
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
      </motion.div>

      <div className="space-y-6 mt-8">
        <motion.div variants={itemVariants} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-3 font-display">종합 분석 (무료)</h3>
            <TypingResult text={result.overall_analysis} className="text-slate-400 leading-relaxed whitespace-pre-wrap" />
        </motion.div>
      </div>
      
      {!isSavedView && <motion.div variants={itemVariants}><UpgradeCTA /></motion.div>}

      {isSavedView ? <PremiumContent /> : (
        <PremiumRoute navigate={onNavigate}>
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