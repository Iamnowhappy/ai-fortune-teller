import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './Header';
import { Loader } from './Loader';
import { TarotIcon, TarotCardBackIcon, HomeIcon } from './icons';
import { analyzeDailyTarot } from '../services/geminiService';
import { drawOneCard, getCardVisualComponent } from '../utils/tarotUtils';
import type { CardDraw, DailyTarotResult } from '../types';

const STORAGE_KEY = 'dailyTarotData';

interface StoredData {
    date: string; // YYYY-MM-DD
    card: CardDraw;
    result: DailyTarotResult;
}

export const DailyTarotPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [storedData, setStoredData] = useState<StoredData | null>(null);
    const [isFlipped, setIsFlipped] = useState(false);

    useEffect(() => {
        const todayStr = new Date().toISOString().split('T')[0];
        try {
            const savedData = localStorage.getItem(STORAGE_KEY);
            if (savedData) {
                const parsed: StoredData = JSON.parse(savedData);
                if (parsed.date === todayStr) {
                    setStoredData(parsed);
                    setIsFlipped(true); // Already drawn today, show flipped card
                }
            }
        } catch (e) {
            console.error("Failed to read from local storage", e);
        }
    }, []);

    const handleDrawCard = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const card = drawOneCard();
            const result = await analyzeDailyTarot(card);
            
            const todayStr = new Date().toISOString().split('T')[0];
            const newData: StoredData = { date: todayStr, card, result };
            
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
            setStoredData(newData);
            setTimeout(() => setIsFlipped(true), 100); // Short delay for animation
        } catch (err: any) {
            console.error(err);
            setError(err.message || '카드 해석 중 알 수 없는 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const CardFront: React.FC<{ card: CardDraw }> = ({ card }) => {
        const VisualComponent = getCardVisualComponent(card.name);
        return (
             <div
                className="absolute w-full h-full bg-slate-800 border-2 border-yellow-400 rounded-lg flex flex-col justify-between p-3 overflow-hidden shadow-lg shadow-yellow-400/20"
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
            >
                <div className="text-left text-sm sm:text-base font-bold text-white whitespace-normal leading-tight">{card.name}</div>
                <div className={`flex-grow flex justify-center items-center transition-transform duration-500 ${card.orientation === '역방향' ? 'transform rotate-180' : ''}`}>
                    <VisualComponent className="w-24 h-24 text-yellow-400/80" />
                </div>
                <div className={`text-right text-xs font-semibold text-white/80 whitespace-normal leading-tight ${card.orientation === '역방향' ? 'transform rotate-180' : ''}`}>{card.orientation}</div>
            </div>
        );
    };

    const CardBack = () => (
         <div className="absolute w-full h-full bg-slate-700 border-2 border-slate-500 rounded-lg flex justify-center items-center p-2 cursor-pointer transition-all duration-300 hover:border-yellow-400 hover:shadow-lg" style={{ backfaceVisibility: 'hidden' }}>
            <TarotCardBackIcon className="w-24 h-24 text-yellow-600/50" />
        </div>
    );

    return (
        <>
            <Header
                icon={<TarotIcon className="w-10 h-10 text-yellow-400" />}
                title="오늘의 타로"
                description="하루에 한 번, 당신을 위한 AI의 메시지를 확인하세요."
                onBack={onBack}
            />
            <main className="flex-grow flex flex-col items-center justify-center text-center py-10">
                {isLoading && <Loader messages={["우주의 기운을 모으는 중...", "당신을 위한 카드를 찾고 있습니다..."]} />}
                
                {!isLoading && storedData && (
                    <div className="flex flex-col items-center gap-6 animate-fade-in">
                        <div className="w-48 h-80 sm:w-56 sm:h-96" style={{ perspective: '1200px' }}>
                            <div
                                className="relative w-full h-full transition-transform duration-700"
                                style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
                            >
                                <CardBack />
                                <CardFront card={storedData.card} />
                            </div>
                        </div>
                        <div className="w-full max-w-xl p-6 bg-slate-800/50 rounded-2xl">
                             <h3 className="text-xl font-bold text-yellow-300 mb-2">오늘의 조언</h3>
                             <p className="text-slate-300 text-lg leading-relaxed">{storedData.result.interpretation}</p>
                        </div>
                    </div>
                )}
                
                {!isLoading && !storedData && (
                    <div className="flex flex-col items-center gap-6">
                        <div className="w-48 h-80 sm:w-56 sm:h-96" style={{ perspective: '1200px' }} onClick={handleDrawCard} role="button" tabIndex={0}>
                            <div className="relative w-full h-full">
                                <CardBack />
                            </div>
                        </div>
                        <button onClick={handleDrawCard} className="py-3 px-8 bg-yellow-500 text-slate-900 font-bold text-lg rounded-lg shadow-md transition-all duration-300 hover:bg-yellow-400 hover:shadow-yellow-400/30">
                            카드 뽑기
                        </button>
                    </div>
                )}

                {error && (
                    <div className="mt-6 bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg relative" role="alert">
                        <strong className="font-bold">오류:</strong>
                        <span className="block sm:inline ml-2">{error}</span>
                    </div>
                )}
                 <style>{`
                    @keyframes fade-in {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                    }
                    .animate-fade-in {
                    animation: fade-in 0.7s ease-out forwards;
                    }
                `}</style>
            </main>
        </>
    );
};