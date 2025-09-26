import React from 'react';
import type { TarotResult, CardDraw } from '../types';
import { RefreshIcon, HomeIcon, TarotCardBackIcon, SaveIcon, ArrowLeftIcon } from './icons';
import { AnalysisInfo } from './AnalysisInfo';
import { getCardVisualComponent } from '../utils/tarotUtils';
import { ShareButtons } from './ShareButtons';
import { UpgradeCTA } from './PremiumPlaceholder';
import { TypingResult } from './TypingResult';
import { motion, Variants } from 'framer-motion';
import { PremiumRoute } from './shared/PremiumRoute';

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
                                    <img src={`data:${card.mimeType};base64,${card.imageData}`} alt={`${card.name} user image`} className="w-full h-full object-cover" />
                                ) : (
                                    <VisualComponent className="w-12 h-12 sm:w-16 sm:h-16 text-cyan-400/70" />
                                )}
                            </div>
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

const containerVariants: Variants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVariants: Variants = { hidden: { opacity: 0, y: 20, scale: 0.95 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } } };

export const TarotResultDisplay: React.FC<TarotResultDisplayProps> = ({ result, drawnCards, onReset, onBack, onSave, isSaved, isSavedView, question, onNavigate, email }) => {
  const cardNames = drawnCards.map(c => `${c.name}(${c.orientation})`).join(', ');
  const shareText = `질문: "${question || '나의 운세'}"\n뽑힌 카드: ${cardNames}\n\n[종합 리딩]\n${result.overall_reading}\n\n결과가 궁금하다면 AI 운세 시리즈를 방문해보세요!`;
  const spreadLabels = getSpreadLabels(drawnCards.length);
  const featureName = "AI 타로 마스터";
  
  const PremiumContent = () => (
    <motion.div variants={itemVariants} className="space-y-6 mt-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-cyan-300 mb-4 font-display text-center">카드별 상세 해석 (프리미엄)</h2>
      {result.cards.map((interp, index) => {
        const correspondingCard = drawnCards[index];
        return (
          <div key={index} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 sm:p-8 flex flex-col gap-4">
            {correspondingCard?.imageData && correspondingCard?.mimeType && (
              <div className="w-full max-w-sm mx-auto rounded-lg overflow-hidden relative shadow-lg my-2">
                <img 
                  src={`data:${correspondingCard.mimeType};base64,${correspondingCard.imageData}`} 
                  alt={`${interp.card_name} user image`} 
                  className="w-full h-auto object-contain" 
                />
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
    </motion.div>
  );
  
  return (
    <motion.div 
      className="w-full max-w-4xl"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="flex flex-row flex-wrap justify-center items-start gap-x-6 sm:gap-x-8 gap-y-4 mb-8">
        {drawnCards.map((card, index) => (
            <div key={index} className="flex flex-col items-center">
                {spreadLabels[index] && <h4 className="text-base font-bold text-slate-300 mb-2">{spreadLabels[index]}</h4>}
                <Card card={card} index={index} />
            </div>
        ))}
      </motion.div>
      
      <motion.div variants={itemVariants} className="bg-slate-800/50 border border-slate-700 rounded-2xl shadow-lg p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-cyan-300 mb-4 font-display">종합 리딩 (무료)</h2>
        <TypingResult text={result.overall_reading} className="text-slate-300 leading-relaxed whitespace-pre-wrap" />
      </motion.div>
      
      {!isSavedView && <motion.div variants={itemVariants}><UpgradeCTA featureName={featureName} /></motion.div>}

      {isSavedView ? <PremiumContent /> : (
        <PremiumRoute navigate={onNavigate} email={email} featureName={featureName}>
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