import React from 'react';
import type { DreamInterpretationResult } from '../types';
import { LightbulbIcon } from './icons';
import { TypingResult } from './TypingResult';
import { motion, Variants } from 'framer-motion';
import { AnalysisResultLayout } from './shared/AnalysisResultLayout';

interface DreamResultDisplayProps {
  result: DreamInterpretationResult;
  onReset: () => void;
  onBack: () => void;
  onSave?: () => void;
  isSaved?: boolean;
  isSavedView?: boolean;
  dreamText?: string;
}

const itemVariants: Variants = { hidden: { opacity: 0, y: 20, scale: 0.95 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } } };

export const DreamResultDisplay: React.FC<DreamResultDisplayProps> = ({ result, onReset, onBack, onSave, isSaved, isSavedView, dreamText }) => {
  const shareText = `AI가 분석한 저의 꿈 이야기입니다.\n\n[꿈 요약]\n${result.summary}\n\n결과가 궁금하다면 AI 운세 시리즈를 방문해보세요!`;
  
  return (
    <AnalysisResultLayout
      onBack={onBack}
      onReset={onReset}
      onSave={onSave}
      isSaved={isSaved}
      isSavedView={isSavedView}
      shareText={shareText}
      freeContent={
          <>
            {result.imageBase64 && (
              <motion.div variants={itemVariants} className="mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-cyan-300 mb-4 font-display text-center">꿈의 시각화</h2>
                <img 
                  src={`data:image/jpeg;base64,${result.imageBase64}`} 
                  alt="AI가 생성한 꿈 시각화 이미지" 
                  className="rounded-2xl shadow-lg w-full max-w-md mx-auto border-2 border-slate-700"
                />
              </motion.div>
            )}
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl shadow-lg p-6 sm:p-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-cyan-300 mb-4 font-display">꿈 해몽 요약</h2>
                <TypingResult text={result.summary} className="text-slate-300 leading-relaxed whitespace-pre-wrap" />
            </div>
          </>
      }
      premiumContent={
        <div className="mt-8 space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-cyan-300 mb-2 text-center font-display">상세 꿈 해몽 리포트</h2>
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-3 font-display">상세 해몽</h3>
              <p className="text-slate-400 leading-relaxed whitespace-pre-wrap">{result.premium_analysis.detailed_interpretation}</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-3 font-display">꿈의 핵심 상징</h3>
              <div className="space-y-4">
                  {result.premium_analysis.dream_symbols.map((symbol, index) => (
                      <div key={index} className="border-b border-slate-700 pb-3 last:border-b-0">
                          <p className="font-bold text-cyan-400 text-lg">{symbol.symbol}</p>
                          <p className="text-slate-400 mt-1">{symbol.meaning}</p>
                      </div>
                  ))}
              </div>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 flex items-start gap-4">
              <div className="flex-shrink-0 pt-1">
                  <LightbulbIcon className="w-8 h-8 text-yellow-400" />
              </div>
              <div>
                  <h3 className="text-xl font-bold text-yellow-300 mb-2 font-display">꿈이 주는 조언</h3>
                  <p className="text-slate-400 leading-relaxed">{result.premium_analysis.advice}</p>
              </div>
          </div>

          {result.groundingChunks && result.groundingChunks.length > 0 && (
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-3 font-display">참고 자료</h3>
              <ul className="list-disc list-inside space-y-2 text-sm">
                {result.groundingChunks.map((chunk, index) => (
                  <li key={index}>
                    <a 
                      href={chunk.web.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:text-cyan-300 hover:underline transition-colors break-all"
                    >
                      {chunk.web.title || chunk.web.uri}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      }
    />
  );
};