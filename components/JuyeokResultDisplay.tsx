import React from 'react';
import type { JuyeokResult, JuyeokReading, LineType } from '../types';
import { RefreshIcon, HomeIcon, SaveIcon, ArrowLeftIcon } from './icons';
import { TypingResult } from './TypingResult';
import { motion, Variants } from 'framer-motion';
import { AnalysisResultLayout } from './shared/AnalysisResultLayout';

interface JuyeokResultDisplayProps {
  result: JuyeokResult;
  reading: JuyeokReading;
  onReset: () => void;
  onBack: () => void;
  onSave?: () => void;
  isSaved?: boolean;
  isSavedView?: boolean;
  question?: string;
  onNavigate: (page: string) => void;
  email: string | null;
}

const HexagramVisual: React.FC<{ lines: LineType[], changingLines?: number[] }> = ({ lines, changingLines = [] }) => (
    <div className="flex flex-col-reverse gap-1.5 items-center">
        {lines.map((line, index) => {
            const isChanging = changingLines.includes(index + 1);
            const lineClasses = "h-1.5 rounded-full transition-all duration-300";
            const changingClasses = isChanging ? "bg-cyan-400 shadow-[0_0_8px] shadow-cyan-400" : "bg-slate-500";
            
            if (line === 'yang') {
                return (
                    <div key={index} className={`w-16 ${lineClasses} ${changingClasses}`} />
                );
            } else { // yin
                return (
                    <div key={index} className="w-16 flex justify-between">
                        <div className={`w-7 ${lineClasses} ${changingClasses}`} />
                        <div className={`w-7 ${lineClasses} ${changingClasses}`} />
                    </div>
                );
            }
        })}
    </div>
);

const itemVariants: Variants = { hidden: { opacity: 0, y: 20, scale: 0.95 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } } };

export const JuyeokResultDisplay: React.FC<JuyeokResultDisplayProps> = ({ result, reading, onReset, onBack, onSave, isSaved, isSavedView, question, onNavigate, email }) => {
  const shareText = `질문: "${question || '나의 운세'}"\n본괘: ${result.present_hexagram_name}\n\n[요약]\n${result.summary}\n\n결과가 궁금하다면 AI 운세 시리즈를 방문해보세요!`;
  
  const PremiumContent = () => (
    <motion.div variants={itemVariants} className="space-y-6 mt-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-cyan-300 mb-2 text-center font-display">상세 분석 리포트</h2>
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-3 font-display">종합 해설</h3>
            <p className="text-slate-400 leading-relaxed whitespace-pre-wrap">{result.premium_analysis.detailed_interpretation}</p>
        </div>
        {result.premium_analysis.changing_lines_interpretation && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-3 font-display">변화의 핵심 (變爻)</h3>
            <p className="text-slate-400 leading-relaxed whitespace-pre-wrap">{result.premium_analysis.changing_lines_interpretation}</p>
        </div>
        )}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-3 font-display">상황별 조언</h3>
            <p className="text-slate-400 leading-relaxed whitespace-pre-wrap">{result.premium_analysis.situational_advice}</p>
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
      onNavigate={onNavigate}
      email={email}
      featureName="AI 주역 전문가"
      shareText={shareText}
      freeContent={
        <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center bg-slate-800/50 border border-slate-700 rounded-2xl shadow-lg p-6 sm:p-8 mb-8">
                <div className="flex flex-col items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-300">현재 (本卦)</h3>
                    <HexagramVisual lines={reading.presentHexagram.lines} changingLines={reading.changingLines} />
                    <p className="text-xl font-semibold text-white mt-2">{result.present_hexagram_name}</p>
                </div>

                <div className="flex justify-center items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400 transform md:rotate-0 rotate-90">
                        <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                    </svg>
                </div>
                
                <div className="flex flex-col items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-300">미래 (之卦)</h3>
                    {reading.changingHexagram ? (
                        <>
                            <HexagramVisual lines={reading.changingHexagram.lines} />
                            <p className="text-xl font-semibold text-white mt-2">{result.changing_hexagram_name}</p>
                        </>
                    ) : (
                        <div className="h-full flex items-center">
                            <p className="text-slate-400">변화 없음</p>
                        </div>
                    )}
                </div>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 sm:p-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-cyan-300 mb-4 font-display">핵심 요약 (무료)</h2>
                <TypingResult text={result.summary} className="text-slate-300 leading-relaxed whitespace-pre-wrap" />
            </div>
        </>
      }
      premiumContent={<PremiumContent />}
    />
  );
};