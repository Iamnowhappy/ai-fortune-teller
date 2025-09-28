import React from 'react';
import type { YukhyoResult } from '../types';
import { RefreshIcon, HomeIcon, SaveIcon, ArrowLeftIcon } from './icons';
import { TypingResult } from './TypingResult';
import { motion, Variants } from 'framer-motion';
import { AnalysisResultLayout } from './shared/AnalysisResultLayout';

// FIX: Added onNavigate and email to props interface to pass to AnalysisResultLayout.
interface YukhyoResultDisplayProps {
  result: YukhyoResult;
  onReset: () => void;
  onBack: () => void;
  onSave?: () => void;
  isSaved?: boolean;
  isSavedView?: boolean;
  question?: string;
  onNavigate: (page: string) => void;
  email: string | null;
}

const itemVariants: Variants = { hidden: { opacity: 0, y: 20, scale: 0.95 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } } };

// FIX: Destructured and passed new props to AnalysisResultLayout.
export const YukhyoResultDisplay: React.FC<YukhyoResultDisplayProps> = ({ result, onReset, onBack, onSave, isSaved, isSavedView, question, onNavigate, email }) => {
  const shareText = `질문: "${question || '나의 운세'}"\n괘: ${result.hexagram_name}\n\n[종합 해설]\n${result.overall_interpretation}\n\n결과가 궁금하다면 AI 운세 시리즈를 방문해보세요!`;
  
  const PremiumContent = () => (
     <motion.div variants={itemVariants} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 mt-8">
        <h3 className="text-xl font-bold text-white mb-3 font-display">종합 해설 및 조언</h3>
        <p className="text-slate-400 leading-relaxed whitespace-pre-wrap">{result.overall_interpretation}</p>
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
      featureName="AI 육효 분석가"
      shareText={shareText}
      freeContent={
        <>
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl shadow-lg p-6 sm:p-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-cyan-300 mb-1 font-display">육효 분석 (무료)</h2>
                <p className="text-slate-400 mb-4">{result.ganji_date} 기준</p>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-center text-white border-collapse">
                        <thead className="bg-slate-700/50">
                            <tr>
                                <th className="p-3 border border-slate-600">괘</th>
                                <th className="p-3 border border-slate-600">효</th>
                                <th className="p-3 border border-slate-600">세/응</th>
                                <th className="p-3 border border-slate-600">육친</th>
                                <th className="p-3 border border-slate-600">지지</th>
                            </tr>
                        </thead>
                        <tbody className="bg-slate-800">
                            {result.lines.sort((a, b) => b.line_number - a.line_number).map((line) => (
                                <tr key={line.line_number}>
                                    {line.line_number === 6 && <td rowSpan={6} className="p-3 border border-slate-600 font-bold text-xl">{result.hexagram_name}</td>}
                                    <td className="p-3 border border-slate-600">{line.line_number}효</td>
                                    <td className={`p-3 border border-slate-600 font-bold ${line.marker === '세(世)' ? 'text-cyan-400' : line.marker === '응(應)' ? 'text-yellow-400' : ''}`}>
                                        {line.marker || '-'}
                                    </td>
                                    <td className="p-3 border border-slate-600">{line.six_relatives}</td>
                                    <td className="p-3 border border-slate-600">{line.earthly_branch}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="space-y-6 mt-8">
                <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-white mb-3 font-display">핵심 분석 (용신) - 무료</h3>
                    <TypingResult text={result.yongsin} className="text-slate-400 leading-relaxed whitespace-pre-wrap" />
                </div>
            </div>
        </>
      }
      premiumContent={<PremiumContent />}
    />
  );
};
