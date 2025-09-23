import React from 'react';
import type { YukhyoResult } from '../types';
import { RefreshIcon, HomeIcon, SaveIcon, ArrowLeftIcon } from './icons';
import { AnalysisInfo } from './AnalysisInfo';
import { ShareButtons } from './ShareButtons';
import { PremiumPlaceholder } from './PremiumPlaceholder';
import { TypingResult } from './TypingResult';

interface YukhyoResultDisplayProps {
  result: YukhyoResult;
  onReset: () => void;
  onBack: () => void;
  onSave?: () => void;
  isSaved?: boolean;
  isSavedView?: boolean;
  question?: string;
}

export const YukhyoResultDisplay: React.FC<YukhyoResultDisplayProps> = ({ result, onReset, onBack, onSave, isSaved, isSavedView, question }) => {
  const shareText = `질문: "${question || '나의 운세'}"\n괘: ${result.hexagram_name}\n\n[종합 해설]\n${result.overall_interpretation}\n\n결과가 궁금하다면 AI 운세 시리즈를 방문해보세요!`;
  
  return (
    <div className="w-full max-w-4xl animate-fade-in">
      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl shadow-lg p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-cyan-300 mb-1 font-display">육효 분석 결과</h2>
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
            <h3 className="text-xl font-bold text-white mb-3 font-display">핵심 분석 (용신)</h3>
            <TypingResult text={result.yongsin} className="text-slate-400 leading-relaxed whitespace-pre-wrap" />
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-3 font-display">종합 해설 및 조언</h3>
            <TypingResult text={result.overall_interpretation} className="text-slate-400 leading-relaxed whitespace-pre-wrap" />
        </div>
      </div>
      
      {!isSavedView && <PremiumPlaceholder />}

      <AnalysisInfo />

      {!isSavedView && <ShareButtons shareText={shareText} />}


      <div className="mt-10 text-center flex flex-wrap justify-center gap-4">
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
      </div>
       <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.7s ease-out forwards;
        }
      `}</style>
    </div>
  );
};