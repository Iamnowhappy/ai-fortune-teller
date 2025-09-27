import React, { useState, useCallback } from 'react';
import type { TarotResult, CardDraw, SavedResult } from '../types';
import { Header } from './Header';
import { Loader } from './Loader';
import { TarotIcon, UploadIcon, TarotCardBackIcon } from './icons';
import { TarotResultDisplay } from './TarotResultDisplay';
import { analyzeTarotReading } from '../services/geminiService';
import { drawCards } from '../utils/tarotUtils';
import { saveResult } from '../utils/storage';
import { fileToBase64 } from '../utils/fileUtils';
import { ErrorMessage } from './shared/ErrorMessage';


// --- TarotReaderPage Component ---
export const TarotReaderPage: React.FC<{ onBack: () => void; onNavigate: (page: string) => void; email: string | null; }> = ({ onBack, onNavigate, email }) => {
    type Step = 'input' | 'upload' | 'result';

    const [question, setQuestion] = useState<string>('');
    const [numCards, setNumCards] = useState<1 | 3 | 5>(3);
    const [analysisResult, setAnalysisResult] = useState<TarotResult | null>(null);
    const [drawnCards, setDrawnCards] = useState<CardDraw[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isSaved, setIsSaved] = useState(false);
    const [step, setStep] = useState<Step>('input');

    const handleDrawAndProceed = () => {
        if (!question.trim()) {
            setError('질문을 입력해주세요.');
            return;
        }
        setError(null);
        const cards = drawCards(numCards);
        setDrawnCards(cards);
        setStep('upload');
    }

    const handleImageUpload = async (file: File, index: number) => {
        try {
            const imageData = await fileToBase64(file);
            const mimeType = file.type;
            const updatedCards = [...drawnCards];
            updatedCards[index] = { ...updatedCards[index], imageData, mimeType };
            setDrawnCards(updatedCards);
        } catch (err) {
            console.error("Image to base64 conversion failed", err);
            setError("이미지 처리 중 오류가 발생했습니다.");
        }
    };

    const handleAnalyze = useCallback(async () => {
        if (!question.trim()) {
            setError('질문이 비어있습니다. 이전 단계로 돌아가세요.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setAnalysisResult(null);
        setIsSaved(false);
        setStep('result'); // Move to result view immediately to show loader

        try {
            const result = await analyzeTarotReading(question, drawnCards);
            setAnalysisResult(result);
        } catch (err) {
            console.error(err);
            setError('분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        } finally {
            setIsLoading(false);
        }
    }, [question, drawnCards]);
    
    const handleSave = useCallback(() => {
        if (!analysisResult || !drawnCards) return;
        const savedItem: SavedResult = {
            id: new Date().toISOString(),
            type: 'tarot-reader',
            typeName: 'AI 타로 마스터',
            date: new Date().toISOString(),
            result: analysisResult,
            context: { question, drawnCards }
        };
        saveResult(savedItem);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    }, [analysisResult, drawnCards, question]);

    const handleReset = () => {
        setQuestion('');
        setAnalysisResult(null);
        setDrawnCards([]);
        setError(null);
        setIsSaved(false);
        setNumCards(3);
        setStep('input');
    };

    const renderInputStep = () => (
         <div className="w-full max-w-md flex flex-col items-center gap-8 p-6 bg-slate-800/50 rounded-2xl shadow-lg border border-slate-700">
            <div className="w-full">
                <label className="block text-lg font-medium text-slate-300 mb-3">
                    카드 수 선택
                </label>
                <div className="grid grid-cols-3 gap-3">
                    {([1, 3, 5] as const).map(num => (
                        <button 
                            key={num} 
                            onClick={() => setNumCards(num)}
                            className={`py-2 px-1 text-sm sm:text-base rounded-lg font-bold transition-colors duration-300 ${numCards === num ? 'bg-cyan-500 text-slate-900' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
                        >
                            {num === 1 ? '1장' : num === 3 ? '3장' : '5장'}
                            <span className="hidden sm:inline">
                                {num === 1 ? ' (핵심 조언)' : num === 3 ? ' (과거-현재-미래)' : ' (심층 분석)'}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
            <div className="w-full flex flex-col gap-4">
                <label htmlFor="tarot-question" className="block text-lg font-medium text-slate-300">
                    어떤 점이 궁금하신가요?
                </label>
                <textarea
                    id="tarot-question"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="예) 현재 저의 연애운은 어떤가요?"
                    className="w-full p-3 h-32 bg-slate-700/50 border border-slate-600 rounded-lg text-white resize-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                    aria-label="타로 질문"
                />
            </div>
            <button
                onClick={handleDrawAndProceed}
                disabled={!question.trim()}
                className="w-full py-3 px-6 bg-cyan-500 text-slate-900 font-bold text-lg rounded-lg shadow-md transition-all duration-300 hover:bg-cyan-400 hover:shadow-cyan-400/30 disabled:bg-slate-600 disabled:text-slate-400 disabled:cursor-not-allowed disabled:shadow-none"
            >
                카드 뽑고 계속하기
            </button>
        </div>
    );

    const renderUploadStep = () => (
        <div className="w-full max-w-4xl flex flex-col items-center gap-8 p-4 sm:p-6 bg-slate-800/50 rounded-2xl shadow-lg border border-slate-700">
            <div className="text-center">
                <h2 className="text-xl font-bold text-slate-200">카드의 상징이 될 이미지를 올려주세요 (선택)</h2>
                <p className="text-slate-400">이미지를 올리면 AI가 더 깊이 있는 해석을 제공합니다.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 w-full">
                 {drawnCards.map((card, index) => (
                    <div key={index} className="flex flex-col items-center gap-2">
                        <div className="w-32 h-52 bg-slate-700 rounded-lg border-2 border-dashed border-slate-600 flex items-center justify-center relative overflow-hidden">
                            {card.imageData ? (
                                <img src={`data:${card.mimeType};base64,${card.imageData}`} alt="Uploaded preview" className="w-full h-full object-cover" />
                            ) : (
                                <TarotCardBackIcon className="w-16 h-16 text-cyan-800" />
                            )}
                            <input
                                type="file"
                                onChange={(e) => e.target.files && handleImageUpload(e.target.files[0], index)}
                                accept="image/png, image/jpeg, image/webp"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                aria-label={`${card.name} 이미지 업로드`}
                            />
                        </div>
                        <div className="text-center">
                            <p className="font-bold text-white">{card.name}</p>
                            <p className={`text-sm ${card.orientation === '역방향' ? 'text-yellow-400' : 'text-cyan-400'}`}>{card.orientation}</p>
                        </div>
                    </div>
                ))}
            </div>
            <button
                onClick={handleAnalyze}
                className="w-full max-w-md py-3 px-6 bg-cyan-500 text-slate-900 font-bold text-lg rounded-lg shadow-md transition-all duration-300 hover:bg-cyan-400 hover:shadow-cyan-400/30"
            >
                분석하기
            </button>
        </div>
    );


    return (
        <>
            <Header
                icon={<TarotIcon className="w-10 h-10 text-cyan-400" />}
                title="AI 타로 마스터"
                description="마음속 질문을 입력하면, AI가 타로 카드로 답을 드립니다."
                onBack={onBack}
            />
            <main className="flex-grow flex flex-col items-center justify-center text-center py-10">
                {/* FIX: Replaced 'messages' prop with 'type' prop to align with Loader's design and fix type error. */}
                {step === 'result' && isLoading && <Loader type="tarot" />}
                
                {step === 'result' && !isLoading && analysisResult && (
                    <TarotResultDisplay result={analysisResult} drawnCards={drawnCards} onReset={handleReset} onBack={onBack} onSave={handleSave} isSaved={isSaved} question={question} onNavigate={onNavigate} email={email} />
                )}

                {step === 'input' && renderInputStep()}
                {step === 'upload' && renderUploadStep()}

                <ErrorMessage message={error} />
            </main>
        </>
    );
};