import React from 'react';
import type { TarotResult, CardDraw } from '../types';
import { RefreshIcon, HomeIcon, TarotCardBackIcon } from './icons';
import { AnalysisInfo } from './AnalysisInfo';
import { getCardVisualComponent } from '../utils/tarotUtils';

interface TarotResultDisplayProps {
  result: TarotResult;
  drawnCards: CardDraw[];
  onReset: () => void;
  onBack: () => void;
}

const Card: React.FC<{ card: CardDraw; index: number }> = ({ card, index }) => {
    const [isFlipped, setIsFlipped] = React.useState(false);
    const VisualComponent = getCardVisualComponent(card.name);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setIsFlipped(true);
        }, 100 + index * 250); // Staggered flip animation
        return () => clearTimeout(timer);
    }, [index]);

    return (
        <div className="flex flex-col items-center gap-3">
            <div className="w-24 h-40 sm:w-32 sm:h-52" style={{ perspective: '1000px' }}>
                <div
                    className="relative w-full h-full transition-transform duration-700"
                    style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
                >
                    {/* Card Back */}
                    <div className="absolute w-full h-full bg-slate-700 border-2 border-slate-500 rounded-lg flex justify-center items-center p-2" style={{ backfaceVisibility: 'hidden' }}>
                        <TarotCardBackIcon className="w-16 h-16 text-cyan-600/50" />
                    </div>

                    {/* Card Front */}
                    <div
                        className="absolute w-full h-full bg-slate-800 border-2 border-slate-500 rounded-lg flex flex-col justify-between p-2 overflow-hidden"
                        style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                    >
                        <div className="text-left text-xs sm:text-sm font-bold text-white whitespace-normal leading-tight">{card.name}</div>
                        <div className={`flex-grow flex justify-center items-center transition-transform duration-500 ${card.orientation === '역방향' ? 'transform rotate-180' : ''}`}>
                            <VisualComponent className="w-12 h-12 sm:w-16 sm:h-16 text-cyan-400/70" />
                        </div>
                        <div className={`text-right text-xs sm:text-sm font-semibold text-white whitespace-normal leading-tight ${card.orientation === '역방향' ? 'transform rotate-180' : ''}`}>{card.name}</div>
                    </div>
                </div>
            </div>
            <div className="text-center opacity-0 transition-opacity duration-500" style={{ transitionDelay: '700ms', opacity: isFlipped ? 1 : 0 }}>
                 <p className="font-bold text-white text-sm sm:text-base">{card.name}</p>
                 <p className={`text-xs sm:text-sm ${card.orientation === '역방향' ? 'text-yellow-400' : 'text-cyan-400'}`}>{card.orientation}</p>
            </div>
        </div>
    );
}


export const TarotResultDisplay: React.FC<TarotResultDisplayProps> = ({ result, drawnCards, onReset, onBack }) => {
  return (
    <div className="w-full max-w-4xl animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-center items-start gap-6 sm:gap-8 mb-8">
        {drawnCards.map((card, index) => (
          <Card key={index} card={card} index={index} />
        ))}
      </div>
      
      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl shadow-lg p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-cyan-300 mb-4 font-display">종합 리딩</h2>
        <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{result.overall_reading}</p>
      </div>

      <div className="space-y-6 mt-8">
        {result.cards.map((interp, index) => (
          <div key={index} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-2 font-display">{interp.card_name} <span className={`text-base font-medium ${interp.orientation === '역방향' ? 'text-yellow-400' : 'text-cyan-400'}`}>({interp.orientation})</span></h3>
            <p className="text-slate-400 leading-relaxed">{interp.meaning}</p>
          </div>
        ))}
      </div>
      
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