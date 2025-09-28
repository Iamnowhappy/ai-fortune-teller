import React from 'react';
import type { TarotResult, CardDraw } from '../types';
import { TarotCardBackIcon } from './icons';
import { getCardVisualComponent } from '../utils/tarotUtils';
import { TypingResult } from './TypingResult';
import { motion, Variants } from 'framer-motion';
import { AnalysisResultLayout } from './shared/AnalysisResultLayout';

interface TarotResultDisplayProps {
  result: TarotResult;
  drawnCards: CardDraw[];
  onReset: () => void;
  onBack: () => void;
  onSave?: () => void;
  isSaved?: boolean;
  isSavedView?: boolean;
  question?: string;
  onNavigate: (page: string) => void;
  email: string | null;
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
                        <div className="flex-grow flex justify-center items-center overflow-hidden my-1">
                            <div className={`w-full h-full transition-transform duration-500 flex justify-center items-center ${card.orientation === '역방향' ? 'transform rotate-180' : ''}`}>
                                {card.imageData && card.mimeType ? (
                                    <img src={`data:${card.mimeType};base64,${card.imageData}`} alt={`${card.name} user image`} className="w-full h-full object-contain" />
                                ) : (
                                    <VisualComponent className="w-12 h-12 sm:w-16 sm:h-16 text-cyan-400/70" />
                                )}
                            </div>
                        </div>
                        <div className={`text-right text-xs sm:text-sm font-semibold text-white whitespace-normal leading-tight`}>{card.name}</div>
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

const getSpreadLabels = (count: number): string[] => {
    switch (count) {
        case 1:
            return ['핵심 조언'];
        case 3:
            return ['과거', '현재', '미래'];
        case 5:
            return ['현재 상황', '도전 과제', '과거의 영향', '가까운 미래', '잠재적 결과'];
        default:
            return [];
    }
};

const itemVariants: Variants = { hidden: { opacity: 0, y: 20, scale: 0.95 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } } };

export const TarotResultDisplay: React.FC<TarotResultDisplayProps> = ({ result, drawnCards, onReset, onBack, onSave, isSaved, isSavedView, question, onNavigate, email }) => {
  const shareText = `질문: "${question || '나의 운세'}"\n타로 리딩 요약: ${result.overall_summary}`;
  const spreadLabels = getSpreadLabels(drawnCards.length);
  
  return (
    <AnalysisResultLayout
      onBack={onBack}
      onReset={onReset}
      onSave={onSave}
      isSaved={isSaved}
      isSavedView={isSavedView}
      shareText={shareText}
      onNavigate={onNavigate}
      email={email}
      featureName="AI 타로 마스터"
      freeContent={
        <>
            <div className="flex flex-row flex-wrap justify-center items-start gap-x-6 sm:gap-x-8 gap-y-4 mb-8">
                {drawnCards.map((card, index) => (
                    <div key={index} className="flex flex-col items-center">
                        {spreadLabels[index] && <h4 className="text-base font-bold text-slate-300 mb-2">{spreadLabels[index]}</h4>}
                        <Card card={card} index={index} />
                    </div>
                ))}
            </div>
            
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl shadow-lg p-6 sm:p-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-cyan-300 mb-4 font-display">핵심 리딩 요약 (무료)</h2>
                <TypingResult text={result.overall_summary} className="text-slate-300 leading-relaxed whitespace-pre-wrap" />
            </div>
        </>
      }
      premiumContent={
        <div className="space-y-6 mt-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-cyan-300 mb-4 font-display text-center">상세 리딩 리포트</h2>
          
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-3 font-display">심층 리딩</h3>
            <p className="text-slate-400 leading-relaxed whitespace-pre-wrap">{result.premium_reading.detailed_reading}</p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-3 font-display">상황별 조언</h3>
            <p className="text-slate-400 leading-relaxed whitespace-pre-wrap"><strong className="text-cyan-400">연애:</strong> {result.premium_reading.situational_advice.love}</p>
            <p className="text-slate-400 leading-relaxed whitespace-pre-wrap mt-2"><strong className="text-cyan-400">금전:</strong> {result.premium_reading.situational_advice.money}</p>
            <p className="text-slate-400 leading-relaxed whitespace-pre-wrap mt-2"><strong className="text-cyan-400">직업:</strong> {result.premium_reading.situational_advice.work}</p>
          </div>

          <h3 className="text-xl font-bold text-white pt-4 font-display text-center">카드별 상세 해석</h3>
          {result.premium_reading.cards.map((interp, index) => {
            const correspondingCard = drawnCards[index];
            const VisualComponent = getCardVisualComponent(interp.card_name);
            return (
              <div key={index} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 sm:p-8 flex flex-col gap-4">
                {correspondingCard && (
                     <div className="w-full max-w-sm mx-auto rounded-lg overflow-hidden relative shadow-lg my-2 bg-slate-900/50">
                        <div className={`transition-transform duration-500 ${correspondingCard.orientation === '역방향' ? 'transform rotate-180' : ''}`}>
                            {correspondingCard.imageData && correspondingCard.mimeType ? (
                            <img 
                                src={`data:${correspondingCard.mimeType};base64,${correspondingCard.imageData}`} 
                                alt={`${interp.card_name} user image`} 
                                className="w-full h-auto object-contain" 
                            />
                            ) : (
                            <div className="w-full aspect-[3/5] flex justify-center items-center">
                                <VisualComponent className="w-24 h-24 text-cyan-400/70" />
                            </div>
                            )}
                        </div>
                        <div className="absolute inset-0 bg-black/10 pointer-events-none"></div>
                    </div>
                )}
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white font-display">{interp.card_name}</h3>
                  <p className={`text-lg font-medium ${interp.orientation === '역방향' ? 'text-yellow-400' : 'text-cyan-400'}`}>
                    ({interp.orientation})
                  </p>
                </div>
                <p className="text-slate-400 leading-relaxed whitespace-pre-wrap">{interp.meaning}</p>
              </div>
            );
          })}
        </div>
      }
    />
  );
};