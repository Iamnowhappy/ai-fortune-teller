import React from 'react';
import { motion, Variants } from 'framer-motion';
import { AnalysisInfo } from '../AnalysisInfo';
import { ShareButtons } from '../ShareButtons';
import { UpgradeCTA } from '../PremiumPlaceholder';
import { PremiumRoute } from './PremiumRoute';
import { HomeIcon, RefreshIcon, SaveIcon, ArrowLeftIcon } from '../icons';

interface AnalysisResultLayoutProps {
  onBack: () => void;
  onReset: () => void;
  onSave?: () => void;
  isSaved?: boolean;
  isSavedView?: boolean;
  onNavigate: (page: string) => void;
  email: string | null;
  shareText: string;
  featureName: string;
  freeContent: React.ReactNode;
  premiumContent: React.ReactNode;
  extraContent?: React.ReactNode; // For things like palmistry credibility score
}

const containerVariants: Variants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVariants: Variants = { hidden: { opacity: 0, y: 20, scale: 0.95 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } } };

export const AnalysisResultLayout: React.FC<AnalysisResultLayoutProps> = ({
  onBack, onReset, onSave, isSaved, isSavedView, onNavigate, email, shareText, featureName, freeContent, premiumContent, extraContent
}) => {
  return (
    <motion.div
      className="w-full max-w-4xl"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        {freeContent}
      </motion.div>
      
      {extraContent && <motion.div variants={itemVariants}>{extraContent}</motion.div>}
      
      {!isSavedView && <motion.div variants={itemVariants}><UpgradeCTA featureName={featureName} /></motion.div>}

      {isSavedView ? (
        <motion.div variants={itemVariants}>{premiumContent}</motion.div>
      ) : (
        <PremiumRoute navigate={onNavigate} email={email} featureName={featureName}>
          {premiumContent}
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
        
        {!isSavedView && onSave && (
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
