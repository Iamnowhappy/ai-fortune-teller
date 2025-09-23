import React from 'react';
import type { AstrologyResult } from '../types';
import { RefreshIcon, HomeIcon, SaveIcon, ArrowLeftIcon } from './icons';
import { AnalysisInfo } from './AnalysisInfo';
import { ShareButtons } from './ShareButtons';
import { PremiumPlaceholder } from './PremiumPlaceholder';
import { TypingResult } from './TypingResult';
import { motion } from 'framer-motion';

interface AstrologyResultDisplayProps {
  result: AstrologyResult;
  onReset: () => void;
  onBack: () => void;
  onSave?: () => void;
  isSaved?: boolean;
  isSavedView?: boolean;
}

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVariants = { hidden: { opacity: 0, y: 20, scale: 0.95 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } } };


export const AstrologyResultDisplay: React.FC<AstrologyResultDisplayProps> = ({ result, onReset, onBack, onSave, isSaved, isSavedView }) => {
  const shareText = `AI가 분석한 저의 별자리는 ${result.zodiac_sign}입니다.\n\n[성격 분석]\n${result.analysis.personality}\n\n결과가 궁금하다면 AI 운세 시리즈를 방문해보세요!`;
  
  return (
    <motion.div 
      className="w-full max-w-3xl"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="bg-slate-800/50 border border-slate-700 rounded-2xl shadow-lg p-6 sm:p-8 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-cyan-300 mb-2 font-display">당신의 별자리</h2>
        <p className="text-4xl sm:text-5xl font-bold text-white mb-4">{result.zodiac_sign}</p>
        <div className="flex justify-center gap-6 text-slate-300">
            <span>수호성: {result.ruling_planet}</span>
            <span>속성: {result.element}</span>
        </div>
      </motion.div>

      <div className="space-y-6 mt-8">
        <motion.div variants={itemVariants} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-3 font-display">성격 분석</h3>
            <TypingResult text={result.analysis.personality} className="text-slate-400 leading-relaxed" />
        </motion.div>
        <motion.div variants={itemVariants} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-3 font-display">연애 및 관계</h3>
            <TypingResult text={result.analysis.love_life} className="text-slate-400 leading-relaxed" />
        </motion.div>
        <motion.div variants={itemVariants} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-3 font-display">직업 및 경력</h3>
            <TypingResult text={result.analysis.work_career} className="text-slate-400 leading-relaxed" />
        </motion.div>
      </div>
      
      {!isSavedView && <motion.div variants={itemVariants}><PremiumPlaceholder /></motion.div>}
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