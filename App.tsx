import './index.css';
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
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
import { DailyTarotPage } from './components/DailyTarotPage';
import { SavedResultsPage } from './components/SavedResultsPage';
import { AboutPage } from './components/AboutPage';
import { PrivacyPolicyPage } from './components/PrivacyPolicyPage';
import { TermsOfServicePage } from './components/TermsOfServicePage';
import { GuidePage } from './components/GuidePage';
import { Loader } from './components/Loader';
import { analyzeFace, analyzePalm, analyzeImpression, analyzeAstrology, analyzeSaju, analyzeTarotReading, analyzeJuyeok, analyzeYukhyo, generateFortuneImage } from './services/geminiService';
import type { PhysiognomyResult, PalmistryResult, ImpressionAnalysisResult, AstrologyResult, SajuResult, TarotResult, JuyeokResult, YukhyoResult, CardDraw, JuyeokReading, SavedResult } from './types';
import { Footer } from './components/Footer';
import { FaceIcon, PalmIcon, ImpressionIcon, AstrologyIcon, SajuIcon, TarotIcon, JuyeokIcon, YukhyoIcon, BoxIcon, TheSunIcon, StarIcon, LockIcon } from './components/icons';
import { generateIChingReading, getDailyFortune } from './utils/divinationUtils';
import { saveResult } from './utils/storage';
import { TarotReaderPage } from './components/TarotReaderPage';
import { ChangelogPage } from './components/Changelog';
import { ImageAndQuestionUploader } from './components/ImageAndQuestionUploader';
import { PremiumRoute } from './components/shared/PremiumRoute';

type Page = 'home' | 'face-reader' | 'palm-reader' | 'impression-analyzer' | 'astrology-reader' | 'saju-analyzer' | 'tarot-reader' | 'juyeok-reader' | 'yukhyo-analyzer' | 'daily-tarot' | 'saved-results' | 'about' | 'privacy' | 'terms' | 'guide' | 'changelog' | 'checkout';

// --- HomePage Component ---
const HomePage: React.FC<{ onNavigate: (page: Page) => void; }> = ({ onNavigate }) => {
  const dailyFortune = getDailyFortune();
  const [fortuneImage, setFortuneImage] = useState<{ loading: boolean; url: string | null; error: boolean; }>({ loading: true, url: null, error: false });

  const stars = useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      delay: Math.random() * 4,
      duration: Math.random() * 2 + 2,
      scale: Math.random() * 0.8 + 0.5,
    }));
  }, []);

  useEffect(() => {
    // Check for payment success message in URL hash
    const hashParams = new URLSearchParams(window.location.hash.split('?')[1]);
    if (hashParams.get("payment") === "success") {
        alert("결제가 성공적으로 완료되었습니다! 30일간 프리미엄 기능을 이용하실 수 있습니다.");
        // Clean up the URL
        const newUrl = window.location.pathname + window.location.hash.split('?')[0];
        window.history.replaceState({}, document.title, newUrl);
    }
  }, []);

  useEffect(() => {
    const fetchFortuneImage = async () => {
      const todayStr = new Date().toISOString().split('T')[0];
      try {
        const cachedData = localStorage.getItem('dailyFortuneImage');
        if (cachedData) {
          const { date, url } = JSON.parse(cachedData);
          if (date === todayStr && url) {
            setFortuneImage({ loading: false, url, error: false });
            return;
          }
        }
      } catch (e) {
        console.error("Failed to read cached image", e);
      }

      // If no valid cache, fetch new image
      try {
        const result = await generateFortuneImage(dailyFortune);
        if (result.imageBase64) {
          const imageUrl = `data:image/jpeg;base64,${result.imageBase64}`;
          setFortuneImage({ loading: false, url: imageUrl, error: false });
          try {
            localStorage.setItem('dailyFortuneImage', JSON.stringify({ date: todayStr, url: imageUrl }));
          } catch (e) {
            console.error("Failed to cache image", e);
          }
        } else {
            throw new Error("No image data received");
        }
      } catch (err: any) {
        console.error("Failed to generate fortune image", err);
        setFortuneImage({ loading: false, url: null, error: true });
      }
    };

    fetchFortuneImage();
  }, [dailyFortune]);

  useEffect(() => {
    const originalTitle = document.title;
    const metaDescriptionTag = document.querySelector('meta[name="description"]');
    const originalDescription = metaDescriptionTag ? metaDescriptionTag.getAttribute('content') : '';

    if (dailyFortune) {
      document.title = `오늘의 운세 - ${dailyFortune}`;
      if (metaDescriptionTag) {
        const truncatedFortune = dailyFortune.length > 40 ? `${dailyFortune.substring(0, 40)}...` : dailyFortune;
        metaDescriptionTag.setAttribute('content', `${truncatedFortune} 매일 바뀌는 오늘의 운세와 AI 운세 시리즈에서 당신의 하루를 확인하세요.`);
      }
    }

    return () => {
      document.title = originalTitle;
      if (metaDescriptionTag && originalDescription) {
        metaDescriptionTag.setAttribute('content', originalDescription);
      }
    };
  }, [dailyFortune]);

  return (
    <main className="flex-grow flex flex-col items-center justify-center text-center py-10">
      <header className="text-center py-6 mb-10">
        <h1 className="text-4xl sm:text-5xl font-bold font-display tracking-wider text-white" translate="no">
          AI 운세 시리즈
        </h1>
        <p className="mt-3 text-lg text-slate-400">
          AI가 당신의 미래를 다각도로 분석해 드립니다.
        </p>
      </header>

      {/* Daily Fortune Card */}
      <div className="w-full max-w-7xl mb-6">
        <div 
          className="relative border border-cyan-700/50 rounded-2xl p-6 flex flex-col items-center gap-4 shadow-lg overflow-hidden min-h-[160px] justify-center bg-slate-800 transition-all duration-500"
        >
          {fortuneImage.loading && (
            <div className="absolute inset-0 bg-slate-800 animate-pulse" aria-label="운세 이미지 로딩 중"></div>
          )}
          {fortuneImage.url && !fortuneImage.error && (
            <>
              <div 
                className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 animate-fade-in-slow"
                style={{ backgroundImage: `url(${fortuneImage.url})` }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
            </>
          )}
          {(fortuneImage.error || (!fortuneImage.loading && !fortuneImage.url)) && (
            // Fallback background
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-slate-800/50"></div>
          )}
          
          {/* Twinkling Stars Background */}
          <div className="absolute inset-0 pointer-events-none z-0">
            {stars.map((star) => (
              <motion.div
                key={star.id}
                className="absolute text-yellow-400/80"
                initial={{ opacity: 0, scale: star.scale }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{
                  duration: star.duration,
                  repeat: Infinity,
                  delay: star.delay,
                  ease: "easeInOut",
                }}
                style={{
                  top: star.top,
                  left: star.left,
                }}
              >
                <StarIcon className="w-2 h-2" />
              </motion.div>
            ))}
          </div>
          
          <div className="relative z-10 flex flex-col items-center gap-3">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3 text-shadow">
              <TheSunIcon className="w-8 h-8 text-yellow-300" />
              오늘의 운세
            </h2>
            <p className="text-slate-200 text-lg text-shadow">{dailyFortune}</p>
          </div>
        </div>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl">
        {/* Daily Tarot Card */}
        <div
          onClick={() => onNavigate('daily-tarot')}
          className="bg-[#059669]/80 border border-[#047857] rounded-2xl p-6 flex flex-col items-center gap-4 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-[#34D399] cursor-pointer group shadow-lg"
          role="button"
          tabIndex={0}
          aria-label="오늘의 타로 실행하기"
          onKeyDown={(e) => e.key === 'Enter' && onNavigate('daily-tarot')}
        >
          <TarotIcon className="w-16 h-16 text-white transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110" />
          <h2 className="text-2xl font-bold text-white">오늘의 타로</h2>
          <p className="text-slate-200">하루에 한 번, 오늘의 AI 타로점을 확인하세요.</p>
        </div>

        {/* Face Reader Card */}
        <div
          onClick={() => onNavigate('face-reader')}
          className="bg-[#F59E0B]/80 border border-[#D97706] rounded-2xl p-6 flex flex-col items-center gap-4 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-[#FBBF24] cursor-pointer group shadow-lg"
          role="button"
          tabIndex={0}
          aria-label="AI 관상가 실행하기"
          onKeyDown={(e) => e.key === 'Enter' && onNavigate('face-reader')}
        >
          <FaceIcon className="w-16 h-16 text-white transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110" />
          <h2 className="text-2xl font-bold text-white">AI 관상가</h2>
          <p className="text-slate-200">얼굴 사진으로 당신의 성격과 미래를 분석합니다.</p>
        </div>

        {/* Palm Reader Card */}
        <div
          onClick={() => onNavigate('palm-reader')}
          className="bg-[#DC2626]/80 border border-[#B91C1C] rounded-2xl p-6 flex flex-col items-center gap-4 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-[#F87171] cursor-pointer group shadow-lg"
          role="button"
          tabIndex={0}
          aria-label="AI 손금 분석 실행하기"
          onKeyDown={(e) => e.key === 'Enter' && onNavigate('palm-reader')}
        >
          <PalmIcon className="w-16 h-16 text-white transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110" />
          <h2 className="text-2xl font-bold text-white">AI 손금 분석</h2>
          <p className="text-slate-200">손금 사진으로 당신의 운명을 읽어드립니다.</p>
        </div>

        {/* First Impression Card */}
        <div
          onClick={() => onNavigate('impression-analyzer')}
          className="bg-[#0D9488]/80 border border-[#0F766E] rounded-2xl p-6 flex flex-col items-center gap-4 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-[#2DD4BF] cursor-pointer group shadow-lg"
          role="button"
          tabIndex={0}
          aria-label="AI 첫인상 분석 실행하기"
          onKeyDown={(e) => e.key === 'Enter' && onNavigate('impression-analyzer')}
        >
          <ImpressionIcon className="w-16 h-16 text-white transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110" />
          <h2 className="text-2xl font-bold text-white">AI 첫인상 분석</h2>
          <p className="text-slate-200">사진 속 당신의 첫인상은 어떨까요? AI가 알려드립니다.</p>
        </div>

        {/* Astrology Reader Card */}
        <div
          onClick={() => onNavigate('astrology-reader')}
          className="bg-[#4338CA]/80 border border-[#3730A3] rounded-2xl p-6 flex flex-col items-center gap-4 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-[#818CF8] cursor-pointer group shadow-lg"
          role="button"
          tabIndex={0}
          aria-label="AI 별자리 운세 실행하기"
          onKeyDown={(e) => e.key === 'Enter' && onNavigate('astrology-reader')}
        >
          <AstrologyIcon className="w-16 h-16 text-white transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110" />
          <h2 className="text-2xl font-bold text-white">AI 별자리 운세</h2>
          <p className="text-slate-200">생년월일로 당신의 별자리를 분석하고 운세를 예측합니다.</p>
        </div>

        {/* Saju Analyzer Card */}
        <div
          onClick={() => onNavigate('saju-analyzer')}
          className="bg-[#2563EB]/80 border border-[#1D4ED8] rounded-2xl p-6 flex flex-col items-center gap-4 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-[#60A5FA] cursor-pointer group shadow-lg"
          role="button"
          tabIndex={0}
          aria-label="AI 사주 분석 실행하기"
          onKeyDown={(e) => e.key === 'Enter' && onNavigate('saju-analyzer')}
        >
          <SajuIcon className="w-16 h-16 text-white transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110" />
          <h2 className="text-2xl font-bold text-white">AI 사주 분석</h2>
          <p className="text-slate-200">생년월일시로 타고난 운명의 지도를 해석해 드립니다.</p>
        </div>

        {/* Tarot Reader Card */}
        <div
          onClick={() => onNavigate('tarot-reader')}
          className="bg-[#7E22CE]/80 border border-[#6B21A8] rounded-2xl p-6 flex flex-col items-center gap-4 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-[#A78BFA] cursor-pointer group shadow-lg"
          role="button"
          tabIndex={0}
          aria-label="AI 타로 마스터 실행하기"
          onKeyDown={(e) => e.key === 'Enter' && onNavigate('tarot-reader')}
        >
          <TarotIcon className="w-16 h-16 text-white transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110" />
          <h2 className="text-2xl font-bold text-white">AI 타로 마스터</h2>
          <p className="text-slate-200">당신의 질문에 AI가 타로 카드로 답해드립니다.</p>
        </div>

        {/* Juyeok Reader Card */}
        <div
          onClick={() => onNavigate('juyeok-reader')}
          className="bg-[#9333EA]/80 border border-[#7E22CE] rounded-2xl p-6 flex flex-col items-center gap-4 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-[#C084FC] cursor-pointer group shadow-lg"
          role="button"
          tabIndex={0}
          aria-label="AI 주역 전문가 실행하기"
          onKeyDown={(e) => e.key === 'Enter' && onNavigate('juyeok-reader')}
        >
          <JuyeokIcon className="w-16 h-16 text-white transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110" />
          <h2 className="text-2xl font-bold text-white">AI 주역 전문가</h2>
          <p className="text-slate-200">주역 64괘로 당신의 고민에 대한 통찰을 제공합니다.</p>
        </div>

        {/* Yukhyo Analyzer Card */}
        <div
          onClick={() => onNavigate('yukhyo-analyzer')}
          className="bg-[#0EA5E9]/80 border border-[#0284C7] rounded-2xl p-6 flex flex-col items-center gap-4 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-[#38BDF8] cursor-pointer group shadow-lg"
          role="button"
          tabIndex={0}
          aria-label="AI 육효 분석가 실행하기"
          onKeyDown={(e) => e.key === 'Enter' && onNavigate('yukhyo-analyzer')}
        >
          <YukhyoIcon className="w-16 h-16 text-white transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110" />
          <h2 className="text-2xl font-bold text-white">AI 육효 분석가</h2>
          <p className="text-slate-200">질문 시점의 기운으로 구체적인 길흉을 예측합니다.</p>
        </div>
        
        {/* Saved Results Card (Premium) */}
        <div
          onClick={() => onNavigate('saved-results')}
          className="relative bg-slate-800/80 border border-[#475569] rounded-2xl p-6 flex flex-col items-center gap-4 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-[#94A3B8] hover:bg-slate-700/60 cursor-pointer group shadow-lg"
          role="button"
          tabIndex={0}
          aria-label="나의 운세함 보기 (프리미엄 기능)"
          onKeyDown={(e) => e.key === 'Enter' && onNavigate('saved-results')}
        >
          <div className="absolute top-3 right-3 bg-cyan-500 text-slate-900 text-xs font-bold px-2 py-1 rounded-full shadow-md z-10">
            PREMIUM
          </div>
          <div className="opacity-70 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center gap-4 text-center">
            <BoxIcon className="w-16 h-16 text-white transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110" />
            <div className="flex items-center gap-2">
              <LockIcon className="w-6 h-6 text-cyan-400" />
              <h2 className="text-2xl font-bold text-white">나의 운세함</h2>
            </div>
            <p className="text-slate-200">저장된 분석 결과를 다시 확인합니다.</p>
          </div>
        </div>
      </div>
       <style>{`
        .text-shadow {
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.7);
        }
        @keyframes fade-in-slow {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in-slow {
          animation: fade-in-slow 1s ease-out forwards;
        }
      `}</style>
    </main>
  );
};

// --- CheckoutPage Component ---
const CheckoutPage: React.FC<{ onBack: () => void; email: string | null; }> = ({ onBack, email }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    if (!email) {
      setError("프리미엄 결제를 위해 이메일을 먼저 입력해주세요.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || '결제 세션 생성에 실패했습니다.');
      }
      window.location.href = data.url;
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header
        icon={<LockIcon className="w-10 h-10 text-cyan-400" />}
        title="프리미엄 전용 기능"
        description="더욱 상세한 분석을 원하시면 프리미엄 플랜을 이용해보세요."
        onBack={onBack}
      />
      <main className="flex-grow flex flex-col items-center justify-center text-center py-10">
        <div className="w-full max-w-md flex flex-col items-center gap-6 p-8 bg-slate-800/50 rounded-2xl shadow-lg border border-slate-700">
          <h2 className="text-2xl font-bold text-white">프리미엄 플랜으로 업그레이드</h2>
          <p className="text-slate-400">
            모든 상세 분석 리포트, 광고 제거, 분석 결과 무제한 저장 등 특별한 혜택을 누려보세요.
          </p>
          <button
            onClick={handleCheckout}
            disabled={isLoading}
            className="w-full py-3 px-6 bg-cyan-500 text-slate-900 font-bold text-lg rounded-lg shadow-md transition-all duration-300 hover:bg-cyan-400 hover:shadow-cyan-400/30 disabled:opacity-50 disabled:cursor-wait"
          >
            {isLoading ? '세션 생성 중...' : '₩990원으로 시작하기'}
          </button>
           {error && <p className="text-red-400 mt-4">{error}</p>}
        </div>
      </main>
    </>
  );
};


// --- FaceReaderPage Component ---
const FaceReaderPage: React.FC<{ onBack: () => void; onNavigate: (page: Page) => void; email: string | null; }> = ({ onBack, onNavigate, email }) => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<PhysiognomyResult | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isSaved, setIsSaved] = useState(false);

    const handleImageSelect = (file: File) => {
        setImageFile(file);
        setImageUrl(URL.createObjectURL(file));
        setAnalysisResult(null);
        setError(null);
        setIsSaved(false);
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
        } catch (err: any) {
        console.error(err);
        setError(err.message || '알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        } finally {
        setIsLoading(false);
        }
    }, [imageFile]);
    
    const handleSave = useCallback(() => {
        if (!analysisResult) return;
        const savedItem: SavedResult = {
            id: new Date().toISOString(),
            type: 'face-reader',
            typeName: 'AI 관상가',
            date: new Date().toISOString(),
            result: analysisResult,
        };
        saveResult(savedItem);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    }, [analysisResult]);

    const handleReset = () => {
        setImageFile(null);
        setImageUrl(null);
        setAnalysisResult(null);
        setError(null);
        setIsSaved(false);
    };

    return (
        <>
            <Header
                icon={<FaceIcon className="w-10 h-10 text-cyan-400" />}
                title="AI 관상가"
                description="AI가 당신의 얼굴을 분석하여 미래를 읽어드립니다."
                onBack={onBack}
            />
            <main className="flex-grow flex flex-col items-center justify-center text-center py-10">
                {isLoading ? (
                <Loader />
                ) : analysisResult ? (
                <ResultDisplay result={analysisResult} onReset={handleReset} onBack={onBack} onSave={handleSave} isSaved={isSaved} onNavigate={onNavigate} email={email} />
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
const PalmReaderPage: React.FC<{ onBack: () => void; onNavigate: (page: Page) => void; email: string | null; }> = ({ onBack, onNavigate, email }) => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<PalmistryResult | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isSaved, setIsSaved] = useState(false);

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
        setIsSaved(false);
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
        } catch (err: any) {
            console.error(err);
            setError(err.message || '알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        } finally {
            setIsLoading(false);
        }
    }, [imageFile]);

    const handleSave = useCallback(() => {
        if (!analysisResult) return;
        const savedItem: SavedResult = {
            id: new Date().toISOString(),
            type: 'palm-reader',
            typeName: 'AI 손금 분석',
            date: new Date().toISOString(),
            result: analysisResult,
        };
        saveResult(savedItem);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    }, [analysisResult]);

    const handleReset = () => {
        setImageFile(null);
        setImageUrl(null);
        setAnalysisResult(null);
        setError(null);
        setIsSaved(false);
    };

    return (
        <>
            <Header 
                icon={<PalmIcon className="w-10 h-10 text-cyan-400" />}
                title="AI 손금 분석"
                description="AI가 당신의 손금을 분석하여 운명을 읽어드립니다."
                onBack={onBack}
            />
            <main className="flex-grow flex flex-col items-center justify-center text-center py-10">
                {isLoading ? (
                <Loader messages={palmReadingMessages} />
                ) : analysisResult ? (
                <PalmResultDisplay result={analysisResult} onReset={handleReset} onBack={onBack} onSave={handleSave} isSaved={isSaved} onNavigate={onNavigate} email={email} />
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
const ImpressionAnalyzerPage: React.FC<{ onBack: () => void; onNavigate: (page: Page) => void; email: string | null; }> = ({ onBack, onNavigate, email }) => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<ImpressionAnalysisResult | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isSaved, setIsSaved] = useState(false);

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
        setIsSaved(false);
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
        } catch (err: any) {
            console.error(err);
            setError(err.message || '알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        } finally {
            setIsLoading(false);
        }
    }, [imageFile]);

    const handleSave = useCallback(() => {
        if (!analysisResult) return;
        const savedItem: SavedResult = {
            id: new Date().toISOString(),
            type: 'impression-analyzer',
            typeName: 'AI 첫인상 분석',
            date: new Date().toISOString(),
            result: analysisResult,
        };
        saveResult(savedItem);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    }, [analysisResult]);

    const handleReset = () => {
        setImageFile(null);
        setImageUrl(null);
        setAnalysisResult(null);
        setError(null);
        setIsSaved(false);
    };

    return (
        <>
            <Header
                icon={<ImpressionIcon className="w-10 h-10 text-cyan-400" />}
                title="AI 첫인상 분석"
                description="AI가 사진을 통해 당신의 첫인상을 분석해 드립니다."
                onBack={onBack}
            />
            <main className="flex-grow flex flex-col items-center justify-center text-center py-10">
                {isLoading ? (
                    <Loader messages={impressionAnalysisMessages} />
                ) : analysisResult ? (
                    <ImpressionResultDisplay result={analysisResult} onReset={handleReset} onBack={onBack} onSave={handleSave} isSaved={isSaved} onNavigate={onNavigate} email={email} />
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
const AstrologyReaderPage: React.FC<{ onBack: () => void; onNavigate: (page: Page) => void; email: string | null; }> = ({ onBack, onNavigate, email }) => {
    const [analysisResult, setAnalysisResult] = useState<AstrologyResult | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isSaved, setIsSaved] = useState(false);

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
        setIsSaved(false);

        try {
            const result = await analyzeAstrology(birthDate);
            setAnalysisResult(result);
        } catch (err: any) {
            console.error(err);
            setError(err.message || '알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        } finally {
            setIsLoading(false);
        }
    }, []);
    
    const handleSave = useCallback(() => {
        if (!analysisResult) return;
        const savedItem: SavedResult = {
            id: new Date().toISOString(),
            type: 'astrology-reader',
            typeName: 'AI 별자리 운세',
            date: new Date().toISOString(),
            result: analysisResult,
        };
        saveResult(savedItem);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    }, [analysisResult]);

    const handleReset = () => {
        setAnalysisResult(null);
        setError(null);
        setIsSaved(false);
    };

    return (
        <>
            <Header
                icon={<AstrologyIcon className="w-10 h-10 text-cyan-400" />}
                title="AI 별자리 운세"
                description="생년월일을 입력하면 AI가 당신의 별자리 운세를 알려드립니다."
                onBack={onBack}
            />
            <main className="flex-grow flex flex-col items-center justify-center text-center py-10">
                {isLoading ? (
                    <Loader messages={astrologyMessages} />
                ) : analysisResult ? (
                    <AstrologyResultDisplay result={analysisResult} onReset={handleReset} onBack={onBack} onSave={handleSave} isSaved={isSaved} onNavigate={onNavigate} email={email} />
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
const SajuAnalyzerPage: React.FC<{ onBack: () => void; onNavigate: (page: Page) => void; email: string | null; }> = ({ onBack, onNavigate, email }) => {
    const [analysisResult, setAnalysisResult] = useState<SajuResult | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isSaved, setIsSaved] = useState(false);

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
        setIsSaved(false);

        try {
            const result = await analyzeSaju(birthDate, birthTime);
            setAnalysisResult(result);
        } catch (err: any) {
            console.error(err);
            setError(err.message || '알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleSave = useCallback(() => {
        if (!analysisResult) return;
        const savedItem: SavedResult = {
            id: new Date().toISOString(),
            type: 'saju-analyzer',
            typeName: 'AI 사주 분석',
            date: new Date().toISOString(),
            result: analysisResult,
        };
        saveResult(savedItem);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    }, [analysisResult]);
    
    const handleReset = () => {
        setAnalysisResult(null);
        setError(null);
        setIsSaved(false);
    };

    return (
        <>
            <Header
                icon={<SajuIcon className="w-10 h-10 text-cyan-400" />}
                title="AI 사주 분석"
                description="생년월일시를 입력하면 AI가 당신의 사주를 분석해 드립니다."
                onBack={onBack}
            />
            <main className="flex-grow flex flex-col items-center justify-center text-center py-10">
                {isLoading ? (
                    <Loader messages={sajuMessages} />
                ) : analysisResult ? (
                    <SajuResultDisplay result={analysisResult} onReset={handleReset} onBack={onBack} onSave={handleSave} isSaved={isSaved} onNavigate={onNavigate} email={email} />
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

// --- JuyeokReaderPage Component ---
const JuyeokReaderPage: React.FC<{ onBack: () => void; onNavigate: (page: Page) => void; email: string | null; }> = ({ onBack, onNavigate, email }) => {
    const [question, setQuestion] = useState<string>('');
    const [analysisResult, setAnalysisResult] = useState<JuyeokResult | null>(null);
    const [juyeokReading, setJuyeokReading] = useState<JuyeokReading | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isSaved, setIsSaved] = useState(false);

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
        setIsSaved(false);
        
        const reading = generateIChingReading();
        setJuyeokReading(reading);

        try {
            const result = await analyzeJuyeok(question, reading);
            setAnalysisResult(result);
        } catch (err: any) {
            console.error(err);
            setError(err.message || '알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        } finally {
            setIsLoading(false);
        }
    }, [question]);

    const handleSave = useCallback(() => {
        if (!analysisResult || !juyeokReading) return;
        const savedItem: SavedResult = {
            id: new Date().toISOString(),
            type: 'juyeok-reader',
            typeName: 'AI 주역 전문가',
            date: new Date().toISOString(),
            result: analysisResult,
            context: { question, reading: juyeokReading }
        };
        saveResult(savedItem);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    }, [analysisResult, juyeokReading, question]);
    
    const handleReset = () => {
        setQuestion('');
        setAnalysisResult(null);
        setJuyeokReading(null);
        setError(null);
        setIsSaved(false);
    };

    return (
        <>
            <Header
                icon={<JuyeokIcon className="w-10 h-10 text-cyan-400" />}
                title="AI 주역 전문가"
                description="마음속 질문을 입력하면, AI가 주역 괘로 답을 드립니다."
                onBack={onBack}
            />
            <main className="flex-grow flex flex-col items-center justify-center text-center py-10">
                {isLoading ? (
                    <Loader messages={juyeokMessages} />
                ) : analysisResult && juyeokReading ? (
                    <JuyeokResultDisplay result={analysisResult} reading={juyeokReading} onReset={handleReset} onBack={onBack} onSave={handleSave} isSaved={isSaved} question={question} onNavigate={onNavigate} email={email} />
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
const YukhyoAnalyzerPage: React.FC<{ onBack: () => void; onNavigate: (page: Page) => void; email: string | null; }> = ({ onBack, onNavigate, email }) => {
    const [question, setQuestion] = useState<string>('');
    const [analysisResult, setAnalysisResult] = useState<YukhyoResult | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isSaved, setIsSaved] = useState(false);

    const yukhyoMessages = [
        "오늘의 천기를 살피고 있습니다...",
        "질문의 기운을 읽어 괘를 세우는 중...",
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
        setIsSaved(false);
        
        try {
            const result = await analyzeYukhyo(question);
            setAnalysisResult(result);
        } catch (err: any) {
            console.error(err);
            setError(err.message || '알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        } finally {
            setIsLoading(false);
        }
    }, [question]);

    const handleSave = useCallback(() => {
        if (!analysisResult) return;
        const savedItem: SavedResult = {
            id: new Date().toISOString(),
            type: 'yukhyo-analyzer',
            typeName: 'AI 육효 분석가',
            date: new Date().toISOString(),
            result: analysisResult,
            context: { question }
        };
        saveResult(savedItem);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    }, [analysisResult, question]);
    
    const handleReset = () => {
        setQuestion('');
        setAnalysisResult(null);
        setError(null);
        setIsSaved(false);
    };

    return (
        <>
            <Header
                icon={<YukhyoIcon className="w-10 h-10 text-cyan-400" />}
                title="AI 육효 분석가"
                description="질문을 입력하면 AI가 시점의 기운으로 구체적인 길흉을 예측합니다."
                onBack={onBack}
            />
            <main className="flex-grow flex flex-col items-center justify-center text-center py-10">
                {isLoading ? (
                    <Loader messages={yukhyoMessages} />
                ) : analysisResult ? (
                    <YukhyoResultDisplay result={analysisResult} onReset={handleReset} onBack={onBack} onSave={handleSave} isSaved={isSaved} question={question} onNavigate={onNavigate} email={email} />
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


// --- UserAuth Component for testing ---
const UserAuth: React.FC<{ email: string | null; onLogin: (email: string) => void; onLogout: () => void; }> = ({ email, onLogin, onLogout }) => {
    const [inputEmail, setInputEmail] = useState('');
    if (email) {
        return (
            <div className="absolute top-4 right-4 text-sm text-slate-300 flex items-center gap-2">
                <span>{email}</span>
                <button onClick={onLogout} className="bg-slate-600 text-xs p-1 rounded hover:bg-slate-500">Logout</button>
            </div>
        );
    }
    return (
        <form onSubmit={(e) => { e.preventDefault(); onLogin(inputEmail); }} className="absolute top-4 right-4 flex gap-2 items-center z-20">
            <input 
                type="email" 
                value={inputEmail} 
                onChange={e => setInputEmail(e.target.value)} 
                placeholder="테스트 이메일 입력" 
                className="bg-slate-700/80 border border-slate-600 text-sm p-2 rounded-md text-white w-48"
                required
            />
            <button type="submit" className="bg-cyan-600 text-white text-sm py-2 px-3 rounded-md hover:bg-cyan-500 transition-colors">로그인</button>
        </form>
    );
};


// --- Main App Component (Router) ---
const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const navigateTo = (page: Page) => {
    window.location.hash = page === 'home' ? '' : page;
  };

  useEffect(() => {
    const handleHashChange = () => {
      const pageFromHash = (window.location.hash.substring(1).split('?')[0] || 'home') as Page;
      setCurrentPage(pageFromHash);
      window.scrollTo(0, 0);
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'face-reader':
        return <FaceReaderPage onBack={() => navigateTo('home')} onNavigate={navigateTo} email={userEmail} />;
      case 'palm-reader':
        return <PalmReaderPage onBack={() => navigateTo('home')} onNavigate={navigateTo} email={userEmail} />;
      case 'impression-analyzer':
        return <ImpressionAnalyzerPage onBack={() => navigateTo('home')} onNavigate={navigateTo} email={userEmail} />;
      case 'astrology-reader':
        return <AstrologyReaderPage onBack={() => navigateTo('home')} onNavigate={navigateTo} email={userEmail} />;
      case 'saju-analyzer':
        return <SajuAnalyzerPage onBack={() => navigateTo('home')} onNavigate={navigateTo} email={userEmail} />;
      case 'tarot-reader':
        return <TarotReaderPage onBack={() => navigateTo('home')} onNavigate={navigateTo} email={userEmail} />;
      case 'juyeok-reader':
        return <JuyeokReaderPage onBack={() => navigateTo('home')} onNavigate={navigateTo} email={userEmail} />;
      case 'yukhyo-analyzer':
        return <YukhyoAnalyzerPage onBack={() => navigateTo('home')} onNavigate={navigateTo} email={userEmail} />;
      case 'daily-tarot':
        return <DailyTarotPage onBack={() => navigateTo('home')} />;
      case 'saved-results':
        return (
          <PremiumRoute navigate={navigateTo} email={userEmail} redirectOnFail={true}>
            <SavedResultsPage onBack={() => navigateTo('home')} onNavigate={navigateTo} email={userEmail} />
          </PremiumRoute>
        );
      case 'about':
        return <AboutPage onBack={() => navigateTo('home')} />;
      case 'privacy':
        return <PrivacyPolicyPage onBack={() => navigateTo('home')} />;
      case 'terms':
        return <TermsOfServicePage onBack={() => navigateTo('home')} />;
      case 'guide':
        return <GuidePage onBack={() => navigateTo('home')} />;
      case 'changelog':
        return <ChangelogPage onBack={() => navigateTo('home')} />;
      case 'checkout':
        return <CheckoutPage onBack={() => navigateTo('home')} email={userEmail} />;
      case 'home':
      default:
        return <HomePage onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center p-4 sm:p-6 lg:p-8 relative">
       <UserAuth email={userEmail} onLogin={setUserEmail} onLogout={() => setUserEmail(null)} />
      <div className="w-full max-w-7xl mx-auto flex flex-col flex-grow">
        {renderPage()}
        <Footer onNavigate={navigateTo} />
      </div>
    </div>
  );
};

export default App;