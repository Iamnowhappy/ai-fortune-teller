import './index.css';
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { BirthDateInput } from './components/BirthDateInput';
import { ResultDisplay } from './components/ResultDisplay';
import { PalmResultDisplay } from './components/PalmResultDisplay';
import { ImpressionResultDisplay } from './components/ImpressionResultDisplay';
import { AstrologyResultDisplay } from './components/AstrologyResultDisplay';
import { SajuResultDisplay } from './components/SajuResultDisplay';
import { TarotResultDisplay } from './components/TarotResultDisplay';
import { JuyeokResultDisplay } from './components/JuyeokResultDisplay';
import { YukhyoResultDisplay } from './components/YukhyoResultDisplay';
import { Loader } from './components/Loader';
import { analyzeFace, analyzePalm, analyzeImpression, analyzeAstrology, analyzeSaju, analyzeTarotReading, analyzeJuyeok, analyzeYukhyo } from './services/geminiService';
import type { PhysiognomyResult, PalmistryResult, ImpressionAnalysisResult, AstrologyResult, SajuResult, TarotResult, JuyeokResult, YukhyoResult, CardDraw, JuyeokReading } from './types';
import { Footer } from './components/Footer';
import { FaceIcon, PalmIcon, ImpressionIcon, AstrologyIcon, SajuIcon, TarotIcon, JuyeokIcon, YukhyoIcon } from './components/icons';
import { drawThreeCards } from './utils/tarotUtils';
import { generateIChingReading, getGanjiDate } from './utils/divinationUtils';
import { AdSenseUnit } from './components/AdSenseUnit';

type Page = 'home' | 'face-reader' | 'palm-reader' | 'impression-analyzer' | 'astrology-reader' | 'saju-analyzer' | 'tarot-reader' | 'juyeok-reader' | 'yukhyo-analyzer';

// --- HomePage Component ---
const HomePage: React.FC<{ onNavigate: (page: Page) => void; }> = ({ onNavigate }) => {
  return (
    <main className="flex-grow flex flex-col items-center justify-center text-center py-10">
      <header className="text-center py-6 mb-10">
        <h1 className="text-4xl sm:text-5xl font-bold font-display tracking-wider text-white">
          AI 운세 시리즈
        </h1>
        <p className="mt-3 text-lg text-slate-400">
          AI가 당신의 미래를 다각도로 분석해 드립니다.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl">
        {/* Face Reader Card */}
        <div
          onClick={() => onNavigate('face-reader')}
          className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 flex flex-col items-center gap-4 transition-all duration-300 hover:scale-105 hover:border-cyan-500 cursor-pointer"
          role="button"
          tabIndex={0}
          aria-label="AI 관상가 실행하기"
          onKeyDown={(e) => e.key === 'Enter' && onNavigate('face-reader')}
        >
          <FaceIcon className="w-16 h-16 text-cyan-400" />
          <h2 className="text-2xl font-bold text-white">AI 관상가</h2>
          <p className="text-slate-400">얼굴 사진으로 당신의 성격과 미래를 분석합니다.</p>
        </div>

        {/* Palm Reader Card */}
        <div
          onClick={() => onNavigate('palm-reader')}
          className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 flex flex-col items-center gap-4 transition-all duration-300 hover:scale-105 hover:border-cyan-500 cursor-pointer"
          role="button"
          tabIndex={0}
          aria-label="AI 손금 분석 실행하기"
          onKeyDown={(e) => e.key === 'Enter' && onNavigate('palm-reader')}
        >
          <PalmIcon className="w-16 h-16 text-cyan-400" />
          <h2 className="text-2xl font-bold text-white">AI 손금 분석</h2>
          <p className="text-slate-400">손금 사진으로 당신의 운명을 읽어드립니다.</p>
        </div>

        {/* First Impression Card */}
        <div
          onClick={() => onNavigate('impression-analyzer')}
          className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 flex flex-col items-center gap-4 transition-all duration-300 hover:scale-105 hover:border-cyan-500 cursor-pointer"
          role="button"
          tabIndex={0}
          aria-label="AI 첫인상 분석 실행하기"
          onKeyDown={(e) => e.key === 'Enter' && onNavigate('impression-analyzer')}
        >
          <ImpressionIcon className="w-16 h-16 text-cyan-400" />
          <h2 className="text-2xl font-bold text-white">AI 첫인상 분석</h2>
          <p className="text-slate-400">사진 속 당신의 첫인상은 어떨까요? AI가 알려드립니다.</p>
        </div>

        {/* Astrology Reader Card */}
        <div
          onClick={() => onNavigate('astrology-reader')}
          className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 flex flex-col items-center gap-4 transition-all duration-300 hover:scale-105 hover:border-cyan-500 cursor-pointer"
          role="button"
          tabIndex={0}
          aria-label="AI 별자리 운세 실행하기"
          onKeyDown={(e) => e.key === 'Enter' && onNavigate('astrology-reader')}
        >
          <AstrologyIcon className="w-16 h-16 text-cyan-400" />
          <h2 className="text-2xl font-bold text-white">AI 별자리 운세</h2>
          <p className="text-slate-400">생년월일로 당신의 별자리를 분석하고 운세를 예측합니다.</p>
        </div>

        {/* Saju Analyzer Card */}
        <div
          onClick={() => onNavigate('saju-analyzer')}
          className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 flex flex-col items-center gap-4 transition-all duration-300 hover:scale-105 hover:border-cyan-500 cursor-pointer"
          role="button"
          tabIndex={0}
          aria-label="AI 사주 분석 실행하기"
          onKeyDown={(e) => e.key === 'Enter' && onNavigate('saju-analyzer')}
        >
          <SajuIcon className="w-16 h-16 text-cyan-400" />
          <h2 className="text-2xl font-bold text-white">AI 사주 분석</h2>
          <p className="text-slate-400">생년월일시로 타고난 운명의 지도를 해석해 드립니다.</p>
        </div>

        {/* Tarot Reader Card */}
        <div
          onClick={() => onNavigate('tarot-reader')}
          className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 flex flex-col items-center gap-4 transition-all duration-300 hover:scale-105 hover:border-cyan-500 cursor-pointer"
          role="button"
          tabIndex={0}
          aria-label="AI 타로 마스터 실행하기"
          onKeyDown={(e) => e.key === 'Enter' && onNavigate('tarot-reader')}
        >
          <TarotIcon className="w-16 h-16 text-cyan-400" />
          <h2 className="text-2xl font-bold text-white">AI 타로 마스터</h2>
          <p className="text-slate-400">당신의 질문에 AI가 타로 카드로 답해드립니다.</p>
        </div>

        {/* Juyeok Reader Card */}
        <div
          onClick={() => onNavigate('juyeok-reader')}
          className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 flex flex-col items-center gap-4 transition-all duration-300 hover:scale-105 hover:border-cyan-500 cursor-pointer"
          role="button"
          tabIndex={0}
          aria-label="AI 주역 전문가 실행하기"
          onKeyDown={(e) => e.key === 'Enter' && onNavigate('juyeok-reader')}
        >
          <JuyeokIcon className="w-16 h-16 text-cyan-400" />
          <h2 className="text-2xl font-bold text-white">AI 주역 전문가</h2>
          <p className="text-slate-400">주역 64괘로 당신의 고민에 대한 통찰을 제공합니다.</p>
        </div>

        {/* Yukhyo Analyzer Card */}
        <div
          onClick={() => onNavigate('yukhyo-analyzer')}
          className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 flex flex-col items-center gap-4 transition-all duration-300 hover:scale-105 hover:border-cyan-500 cursor-pointer"
          role="button"
          tabIndex={0}
          aria-label="AI 육효 분석가 실행하기"
          onKeyDown={(e) => e.key === 'Enter' && onNavigate('yukhyo-analyzer')}
        >
          <YukhyoIcon className="w-16 h-16 text-cyan-400" />
          <h2 className="text-2xl font-bold text-white">AI 육효 분석가</h2>
          <p className="text-slate-400">질문 시점의 기운으로 구체적인 길흉을 예측합니다.</p>
        </div>
      </div>
      
      {/* AdSense Unit */}
      <div className="mt-12 w-full max-w-4xl">
        <AdSenseUnit />
      </div>
    </main>
  );
};

// --- FaceReaderPage Component ---
const FaceReaderPage: React.FC<{ onBack: () => void; }> = ({ onBack }) => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<PhysiognomyResult | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleImageSelect = (file: File) => {
        setImageFile(file);
        setImageUrl(URL.createObjectURL(file));
        setAnalysisResult(null);
        setError(null);
    };

    const handleAnalyze = useCallback(async () => {
        if (!imageFile) {
        setError('분석할 이미지를 먼저 선택해주세요.');
        return;
        }

        setIsLoading(true);
        setError(null);
        setAnalysisResult(null);

        try {
        const result = await analyzeFace(imageFile);
        setAnalysisResult(result);
        } catch (err) {
        console.error(err);
        setError('분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        } finally {
        setIsLoading(false);
        }
    }, [imageFile]);

    const handleReset = () => {
        setImageFile(null);
        setImageUrl(null);
        setAnalysisResult(null);
        setError(null);
    };

    return (
        <>
            <Header
                icon={<FaceIcon className="w-10 h-10 text-cyan-400" />}
                title="AI 관상가"
                description="AI가 당신의 얼굴을 분석하여 미래를 읽어드립니다."
            />
            <main className="flex-grow flex flex-col items-center justify-center text-center py-10">
                {isLoading ? (
                <Loader />
                ) : analysisResult ? (
                <ResultDisplay result={analysisResult} onReset={handleReset} onBack={onBack} />
                ) : (
                <ImageUploader
                    onImageSelect={handleImageSelect}
                    imageUrl={imageUrl}
                    onAnalyze={handleAnalyze}
                    hasImage={!!imageFile}
                />
                )}

                {error && (
                <div className="mt-6 bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg relative" role="alert">
                    <strong className="font-bold">오류:</strong>
                    <span className="block sm:inline ml-2">{error}</span>
                </div>
                )}
            </main>
        </>
    );
};

// --- PalmReaderPage Component ---
const PalmReaderPage: React.FC<{ onBack: () => void; }> = ({ onBack }) => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<PalmistryResult | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const palmReadingMessages = [
        "손바닥의 지도를 그리고 있습니다...",
        "생명선에서 에너지의 흐름을 읽는 중...",
        "감정선에 담긴 마음의 깊이를 살피는 중...",
        "두뇌선을 따라 지혜의 경로를 탐색합니다...",
        "운명의 세 갈래 길을 분석하고 있습니다."
    ];

    const handleImageSelect = (file: File) => {
        setImageFile(file);
        setImageUrl(URL.createObjectURL(file));
        setAnalysisResult(null);
        setError(null);
    };

    const handleAnalyze = useCallback(async () => {
        if (!imageFile) {
        setError('분석할 이미지를 먼저 선택해주세요.');
        return;
        }

        setIsLoading(true);
        setError(null);
        setAnalysisResult(null);

        try {
            const result = await analyzePalm(imageFile);
            setAnalysisResult(result);
        } catch (err) {
            console.error(err);
            setError('분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        } finally {
            setIsLoading(false);
        }
    }, [imageFile]);

    const handleReset = () => {
        setImageFile(null);
        setImageUrl(null);
        setAnalysisResult(null);
        setError(null);
    };

    return (
        <>
            <Header 
                icon={<PalmIcon className="w-10 h-10 text-cyan-400" />}
                title="AI 손금 분석"
                description="AI가 당신의 손금을 분석하여 운명을 읽어드립니다."
            />
            <main className="flex-grow flex flex-col items-center justify-center text-center py-10">
                {isLoading ? (
                <Loader messages={palmReadingMessages} />
                ) : analysisResult ? (
                <PalmResultDisplay result={analysisResult} onReset={handleReset} onBack={onBack} />
                ) : (
                <ImageUploader
                    onImageSelect={handleImageSelect}
                    imageUrl={imageUrl}
                    onAnalyze={handleAnalyze}
                    hasImage={!!imageFile}
                    buttonText="손금 분석하기"
                />
                )}

                {error && (
                <div className="mt-6 bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg relative" role="alert">
                    <strong className="font-bold">오류:</strong>
                    <span className="block sm:inline ml-2">{error}</span>
                </div>
                )}
            </main>
        </>
    );
};

// --- ImpressionAnalyzerPage Component ---
const ImpressionAnalyzerPage: React.FC<{ onBack: () => void; }> = ({ onBack }) => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<ImpressionAnalysisResult | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const impressionAnalysisMessages = [
        "사진 속 인상을 스캔하고 있습니다...",
        "표정과 분위기에서 나타나는 시그널을 분석 중...",
        "심리학적 데이터를 기반으로 첫인상을 해석합니다...",
        "잠재된 매력 포인트를 찾아내고 있습니다...",
        "곧 당신의 첫인상 리포트가 완성됩니다."
    ];

    const handleImageSelect = (file: File) => {
        setImageFile(file);
        setImageUrl(URL.createObjectURL(file));
        setAnalysisResult(null);
        setError(null);
    };

    const handleAnalyze = useCallback(async () => {
        if (!imageFile) {
            setError('분석할 이미지를 먼저 선택해주세요.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setAnalysisResult(null);

        try {
            const result = await analyzeImpression(imageFile);
            setAnalysisResult(result);
        } catch (err) {
            console.error(err);
            setError('분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        } finally {
            setIsLoading(false);
        }
    }, [imageFile]);

    const handleReset = () => {
        setImageFile(null);
        setImageUrl(null);
        setAnalysisResult(null);
        setError(null);
    };

    return (
        <>
            <Header
                icon={<ImpressionIcon className="w-10 h-10 text-cyan-400" />}
                title="AI 첫인상 분석"
                description="AI가 사진을 통해 당신의 첫인상을 분석해 드립니다."
            />
            <main className="flex-grow flex flex-col items-center justify-center text-center py-10">
                {isLoading ? (
                    <Loader messages={impressionAnalysisMessages} />
                ) : analysisResult ? (
                    <ImpressionResultDisplay result={analysisResult} onReset={handleReset} onBack={onBack} />
                ) : (
                    <ImageUploader
                        onImageSelect={handleImageSelect}
                        imageUrl={imageUrl}
                        onAnalyze={handleAnalyze}
                        hasImage={!!imageFile}
                        buttonText="첫인상 분석하기"
                    />
                )}

                {error && (
                    <div className="mt-6 bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg relative" role="alert">
                        <strong className="font-bold">오류:</strong>
                        <span className="block sm:inline ml-2">{error}</span>
                    </div>
                )}
            </main>
        </>
    );
};

// --- AstrologyReaderPage Component ---
const AstrologyReaderPage: React.FC<{ onBack: () => void; }> = ({ onBack }) => {
    const [analysisResult, setAnalysisResult] = useState<AstrologyResult | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const astrologyMessages = [
        "밤하늘의 별자리를 정렬하고 있습니다...",
        "행성의 기운을 읽어내는 중...",
        "탄생의 순간에 담긴 우주의 비밀을 해석합니다...",
        "당신의 별자리에 담긴 이야기를 찾는 중...",
        "별들의 속삭임이 곧 도착합니다."
    ];

    const handleAnalyze = useCallback(async (birthDate: string) => {
        setIsLoading(true);
        setError(null);
        setAnalysisResult(null);

        try {
            const result = await analyzeAstrology(birthDate);
            setAnalysisResult(result);
        } catch (err) {
            console.error(err);
            setError('분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        } finally {
            setIsLoading(false);
        }
    }, []);
    
    const handleReset = () => {
        setAnalysisResult(null);
        setError(null);
    };

    return (
        <>
            <Header
                icon={<AstrologyIcon className="w-10 h-10 text-cyan-400" />}
                title="AI 별자리 운세"
                description="생년월일을 입력하면 AI가 당신의 별자리 운세를 알려드립니다."
            />
            <main className="flex-grow flex flex-col items-center justify-center text-center py-10">
                {isLoading ? (
                    <Loader messages={astrologyMessages} />
                ) : analysisResult ? (
                    <AstrologyResultDisplay result={analysisResult} onReset={handleReset} onBack={onBack} />
                ) : (
                    <BirthDateInput
                        onAnalyze={handleAnalyze}
                        buttonText="별자리 운세 보기"
                    />
                )}
                {error && (
                    <div className="mt-6 bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg relative" role="alert">
                        <strong className="font-bold">오류:</strong>
                        <span className="block sm:inline ml-2">{error}</span>
                    </div>
                )}
            </main>
        </>
    );
};

// --- SajuAnalyzerPage Component ---
const SajuAnalyzerPage: React.FC<{ onBack: () => void; }> = ({ onBack }) => {
    const [analysisResult, setAnalysisResult] = useState<SajuResult | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const sajuMessages = [
        "천간과 지지를 배열하고 있습니다...",
        "사주팔자의 기둥을 세우는 중...",
        "오행의 조화를 살피고 있습니다...",
        "운명의 큰 흐름을 읽어내는 중...",
        "타고난 운명의 지도가 곧 완성됩니다."
    ];

    const handleAnalyze = useCallback(async (birthDate: string, birthTime: string) => {
        setIsLoading(true);
        setError(null);
        setAnalysisResult(null);

        try {
            const result = await analyzeSaju(birthDate, birthTime);
            setAnalysisResult(result);
        } catch (err) {
            console.error(err);
            setError('분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        } finally {
            setIsLoading(false);
        }
    }, []);
    
    const handleReset = () => {
        setAnalysisResult(null);
        setError(null);
    };

    return (
        <>
            <Header
                icon={<SajuIcon className="w-10 h-10 text-cyan-400" />}
                title="AI 사주 분석"
                description="생년월일시를 입력하면 AI가 당신의 사주를 분석해 드립니다."
            />
            <main className="flex-grow flex flex-col items-center justify-center text-center py-10">
                {isLoading ? (
                    <Loader messages={sajuMessages} />
                ) : analysisResult ? (
                    <SajuResultDisplay result={analysisResult} onReset={handleReset} onBack={onBack} />
                ) : (
                    <BirthDateInput
                        onAnalyze={handleAnalyze}
                        buttonText="사주 분석하기"
                        showTimeInput={true}
                    />
                )}
                {error && (
                    <div className="mt-6 bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg relative" role="alert">
                        <strong className="font-bold">오류:</strong>
                        <span className="block sm:inline ml-2">{error}</span>
                    </div>
                )}
            </main>
        </>
    );
};

// --- TarotReaderPage Component ---
const TarotReaderPage: React.FC<{ onBack: () => void; }> = ({ onBack }) => {
    const [question, setQuestion] = useState<string>('');
    const [analysisResult, setAnalysisResult] = useState<TarotResult | null>(null);
    const [drawnCards, setDrawnCards] = useState<CardDraw[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const tarotMessages = [
        "카드를 섞고 있습니다...",
        "당신의 질문에 집중하는 중...",
        "운명의 카드를 선택하고 있습니다...",
        "별들의 기운이 카드에 모이는 중...",
        "곧 신비로운 해석이 도착합니다."
    ];

    const handleAnalyze = useCallback(async () => {
        if (!question.trim()) {
            setError('질문을 입력해주세요.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setAnalysisResult(null);
        
        const cards = drawThreeCards();
        setDrawnCards(cards);

        try {
            const result = await analyzeTarotReading(question, cards);
            setAnalysisResult(result);
        } catch (err) {
            console.error(err);
            setError('분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        } finally {
            setIsLoading(false);
        }
    }, [question]);
    
    const handleReset = () => {
        setQuestion('');
        setAnalysisResult(null);
        setDrawnCards(null);
        setError(null);
    };

    return (
        <>
            <Header
                icon={<TarotIcon className="w-10 h-10 text-cyan-400" />}
                title="AI 타로 마스터"
                description="마음속 질문을 입력하면, AI가 타로 카드로 답을 드립니다."
            />
            <main className="flex-grow flex flex-col items-center justify-center text-center py-10">
                {isLoading ? (
                    <Loader messages={tarotMessages} />
                ) : analysisResult && drawnCards ? (
                    <TarotResultDisplay result={analysisResult} drawnCards={drawnCards} onReset={handleReset} onBack={onBack} />
                ) : (
                    <div className="w-full max-w-md flex flex-col items-center gap-8 p-6 bg-slate-800/50 rounded-2xl shadow-lg border border-slate-700">
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
                          onClick={handleAnalyze}
                          disabled={!question.trim()}
                          className="w-full py-3 px-6 bg-cyan-500 text-slate-900 font-bold text-lg rounded-lg shadow-md transition-all duration-300 hover:bg-cyan-400 hover:shadow-cyan-400/30 disabled:bg-slate-600 disabled:text-slate-400 disabled:cursor-not-allowed disabled:shadow-none"
                        >
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
            </main>
        </>
    );
};

// --- JuyeokReaderPage Component ---
const JuyeokReaderPage: React.FC<{ onBack: () => void; }> = ({ onBack }) => {
    const [question, setQuestion] = useState<string>('');
    const [analysisResult, setAnalysisResult] = useState<JuyeokResult | null>(null);
    const [juyeokReading, setJuyeokReading] = useState<JuyeokReading | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const juyeokMessages = [
        "천지의 기운을 모으고 있습니다...",
        "질문에 대한 답을 찾기 위해 괘를 뽑는 중...",
        "음과 양의 조화를 살피고 있습니다...",
        "변화의 흐름을 읽어내는 중...",
        "곧 우주의 지혜가 담긴 해석이 도착합니다."
    ];

    const handleAnalyze = useCallback(async () => {
        if (!question.trim()) {
            setError('질문을 입력해주세요.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setAnalysisResult(null);
        
        const reading = generateIChingReading();
        setJuyeokReading(reading);

        try {
            const result = await analyzeJuyeok(question, reading);
            setAnalysisResult(result);
        } catch (err) {
            console.error(err);
            setError('분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        } finally {
            setIsLoading(false);
        }
    }, [question]);
    
    const handleReset = () => {
        setQuestion('');
        setAnalysisResult(null);
        setJuyeokReading(null);
        setError(null);
    };

    return (
        <>
            <Header
                icon={<JuyeokIcon className="w-10 h-10 text-cyan-400" />}
                title="AI 주역 전문가"
                description="마음속 질문을 입력하면, AI가 주역 괘로 답을 드립니다."
            />
            <main className="flex-grow flex flex-col items-center justify-center text-center py-10">
                {isLoading ? (
                    <Loader messages={juyeokMessages} />
                ) : analysisResult && juyeokReading ? (
                    <JuyeokResultDisplay result={analysisResult} reading={juyeokReading} onReset={handleReset} onBack={onBack} />
                ) : (
                    <div className="w-full max-w-md flex flex-col items-center gap-8 p-6 bg-slate-800/50 rounded-2xl shadow-lg border border-slate-700">
                        <div className="w-full flex flex-col gap-4">
                            <label htmlFor="juyeok-question" className="block text-lg font-medium text-slate-300">
                                어떤 점이 궁금하신가요?
                            </label>
                            <textarea
                                id="juyeok-question"
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                placeholder="예) 제가 지금 추진하는 프로젝트의 미래는 어떨까요?"
                                className="w-full p-3 h-32 bg-slate-700/50 border border-slate-600 rounded-lg text-white resize-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                                aria-label="주역 질문"
                            />
                        </div>
                        <button
                          onClick={handleAnalyze}
                          disabled={!question.trim()}
                          className="w-full py-3 px-6 bg-cyan-500 text-slate-900 font-bold text-lg rounded-lg shadow-md transition-all duration-300 hover:bg-cyan-400 hover:shadow-cyan-400/30 disabled:bg-slate-600 disabled:text-slate-400 disabled:cursor-not-allowed disabled:shadow-none"
                        >
                          주역점 보기
                        </button>
                    </div>
                )}
                {error && (
                    <div className="mt-6 bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg relative" role="alert">
                        <strong className="font-bold">오류:</strong>
                        <span className="block sm:inline ml-2">{error}</span>
                    </div>
                )}
            </main>
        </>
    );
};

// --- YukhyoAnalyzerPage Component ---
const YukhyoAnalyzerPage: React.FC<{ onBack: () => void; }> = ({ onBack }) => {
    const [question, setQuestion] = useState<string>('');
    const [analysisResult, setAnalysisResult] = useState<YukhyoResult | null>(null);
    const [juyeokReading, setJuyeokReading] = useState<JuyeokReading | null>(null);
    const [ganjiDate, setGanjiDate] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const yukhyoMessages = [
        "오늘의 천기를 살피고 있습니다...",
        "질문의 핵심을 파악하여 괘를 세우는 중...",
        "육친과 세응을 배치하고 있습니다...",
        "길흉을 판단할 용신을 찾는 중...",
        "곧 구체적인 예측이 완성됩니다."
    ];

    const handleAnalyze = useCallback(async () => {
        if (!question.trim()) {
            setError('질문을 입력해주세요.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setAnalysisResult(null);
        
        const reading = generateIChingReading();
        const date = getGanjiDate();
        setJuyeokReading(reading);
        setGanjiDate(date);

        try {
            const result = await analyzeYukhyo(question, reading.presentHexagram, date);
            setAnalysisResult(result);
        } catch (err) {
            console.error(err);
            setError('분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        } finally {
            setIsLoading(false);
        }
    }, [question]);
    
    const handleReset = () => {
        setQuestion('');
        setAnalysisResult(null);
        setJuyeokReading(null);
        setGanjiDate('');
        setError(null);
    };

    return (
        <>
            <Header
                icon={<YukhyoIcon className="w-10 h-10 text-cyan-400" />}
                title="AI 육효 분석가"
                description="질문 시점의 기운으로 구체적인 길흉을 예측합니다."
            />
            <main className="flex-grow flex flex-col items-center justify-center text-center py-10">
                {isLoading ? (
                    <Loader messages={yukhyoMessages} />
                ) : analysisResult && juyeokReading ? (
                    <YukhyoResultDisplay result={analysisResult} onReset={handleReset} onBack={onBack} />
                ) : (
                    <div className="w-full max-w-md flex flex-col items-center gap-8 p-6 bg-slate-800/50 rounded-2xl shadow-lg border border-slate-700">
                        <div className="w-full flex flex-col gap-4">
                            <label htmlFor="yukhyo-question" className="block text-lg font-medium text-slate-300">
                                어떤 점이 궁금하신가요?
                            </label>
                            <textarea
                                id="yukhyo-question"
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                placeholder="예) 이번 시험에 합격할 수 있을까요?"
                                className="w-full p-3 h-32 bg-slate-700/50 border border-slate-600 rounded-lg text-white resize-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                                aria-label="육효 질문"
                            />
                        </div>
                        <button
                          onClick={handleAnalyze}
                          disabled={!question.trim()}
                          className="w-full py-3 px-6 bg-cyan-500 text-slate-900 font-bold text-lg rounded-lg shadow-md transition-all duration-300 hover:bg-cyan-400 hover:shadow-cyan-400/30 disabled:bg-slate-600 disabled:text-slate-400 disabled:cursor-not-allowed disabled:shadow-none"
                        >
                          육효점 보기
                        </button>
                    </div>
                )}
                {error && (
                    <div className="mt-6 bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg relative" role="alert">
                        <strong className="font-bold">오류:</strong>
                        <span className="block sm:inline ml-2">{error}</span>
                    </div>
                )}
            </main>
        </>
    );
};


// --- Main App Component (Router) ---
const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const navigateTo = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'face-reader':
        return <FaceReaderPage onBack={() => navigateTo('home')} />;
      case 'palm-reader':
        return <PalmReaderPage onBack={() => navigateTo('home')} />;
      case 'impression-analyzer':
        return <ImpressionAnalyzerPage onBack={() => navigateTo('home')} />;
      case 'astrology-reader':
        return <AstrologyReaderPage onBack={() => navigateTo('home')} />;
      case 'saju-analyzer':
        return <SajuAnalyzerPage onBack={() => navigateTo('home')} />;
      case 'tarot-reader':
        return <TarotReaderPage onBack={() => navigateTo('home')} />;
      case 'juyeok-reader':
        return <JuyeokReaderPage onBack={() => navigateTo('home')} />;
      case 'yukhyo-analyzer':
        return <YukhyoAnalyzerPage onBack={() => navigateTo('home')} />;
      case 'home':
      default:
        return <HomePage onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-7xl mx-auto flex flex-col flex-grow">
        {renderPage()}
        <Footer />
      </div>
    </div>
  );
};

export default App;