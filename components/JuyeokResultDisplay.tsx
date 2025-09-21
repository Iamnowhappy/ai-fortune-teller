
import React from 'react';
import type { JuyeokResult, JuyeokReading, LineType } from '../types';
import { RefreshIcon, HomeIcon } from './icons';
import { AnalysisInfo } from './AnalysisInfo';

interface JuyeokResultDisplayProps {
  result: JuyeokResult;
  reading: JuyeokReading;
  onReset: () => void;
  onBack: () => void;
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

export const JuyeokResultDisplay: React.FC<JuyeokResultDisplayProps> = ({ result, reading, onReset, onBack }) => {
  return (
    <div className="w-full max-w-4xl animate-fade-in">
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
        <h2 className="text-2xl sm:text-3xl font-bold text-cyan-300 mb-4 font-display">종합 해설</h2>
        <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{result.interpretation}</p>
      </div>

      {result.changing_lines_interpretation && (
        <div className="mt-8 bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-3 font-display">변화의 핵심 (變爻)</h3>
            <p className="text-slate-400 leading-relaxed whitespace-pre-wrap">{result.changing_lines_interpretation}</p>
        </div>
      )}
      
      <AnalysisInfo />

      <div className="mt-10 text-center flex flex-wrap justify-center gap-4">
        <button
          onClick={onBack}
          className="py-3 px-8 bg-slate-600 text-white font-bold text-lg rounded-lg shadow-md transition-all duration-300 hover:bg-slate-500 flex items-center gap-2"
        >
          <HomeIcon className="w-5 h-5" />
          홈으로
        </button>
        <button
          onClick={onReset}
          className="py-3 px-8 bg-cyan-500 text-slate-900 font-bold text-lg rounded-lg shadow-md transition-all duration-300 hover:bg-cyan-400 hover:shadow-cyan-400/30 flex items-center gap-2"
        >
          <RefreshIcon className="w-5 h-5" />
          다시 분석하기
        </button>
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
