import './index.css';
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { motion, Variants } from 'framer-motion';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { BirthDateInput } from './components/BirthDateInput';
import { AnalysisResultLayout } from './components/shared/AnalysisResultLayout';
import { TypingResult } from './components/TypingResult';

import { DailyTarotPage } from './components/DailyTarotPage';
import SavedResultsPage from './components/SavedResultsPage';
import { AboutPage } from './components/AboutPage';
import { PrivacyPolicyPage } from './components/PrivacyPolicyPage';
import { TermsOfServicePage } from './components/TermsOfServicePage';
import { GuidePage } from './components/GuidePage';
import { Loader } from './components/Loader';
import { analyzeFace, analyzePalm, analyzeImpression, analyzeAstrology, analyzeSaju, analyzeTarotReading, analyzeJuyeok, analyzeYukhyo } from './services/geminiService';
import type { PhysiognomyResult, PalmistryResult, ImpressionAnalysisResult, AstrologyResult, SajuResult, TarotResult, JuyeokResult, YukhyoResult, CardDraw, JuyeokReading, SavedResult, LineType } from './types';
import { Footer } from './components/Footer';
import { FaceIcon, PalmIcon, ImpressionIcon, AstrologyIcon, SajuIcon, TarotIcon, JuyeokIcon, YukhyoIcon, BoxIcon, TheSunIcon, StarIcon, LockIcon, HappyFaceIcon, EyeIcon, NoseIcon, MouthIcon, ForeheadIcon, ChinIcon, EarIcon, LifeLineIcon, HeartLineIcon, HeadLineIcon, LineIcon, LightbulbIcon, HomeIcon, RefreshIcon, SaveIcon } from './components/icons';
import { generateIChingReading, getDailyFortune } from './utils/divinationUtils';
import { saveResult } from './utils/storage';
import { TarotReaderPage } from './components/TarotReaderPage';
import { ChangelogPage } from './components/Changelog';
import { ImageAndQuestionUploader } from './components/ImageAndQuestionUploader';
import { PremiumRoute } from './components/shared/PremiumRoute';
import { FaceStretcherPage } from './components/FaceStretcherPage';
import { API_BASE_URL } from './utils/apiConfig';
import { useAnalysis } from './hooks/useAnalysis';
import { ErrorMessage } from './components/shared/ErrorMessage';
import { AnalysisInfo } from './components/AnalysisInfo';
import { ShareButtons } from './components/ShareButtons';
import { UpgradeCTA } from './components/PremiumPlaceholder';
import { ResultDisplay } from './components/ResultDisplay';
import { PalmResultDisplay } from './components/PalmResultDisplay';
import { ImpressionResultDisplay } from './components/ImpressionResultDisplay';
import { AstrologyResultDisplay } from './components/AstrologyResultDisplay';
import { SajuResultDisplay } from './components/SajuResultDisplay';
import { JuyeokResultDisplay } from './components/JuyeokResultDisplay';
import { YukhyoResultDisplay } from './components/YukhyoResultDisplay';


type Page = 'home' | 'face-reader' | 'palm-reader' | 'impression-analyzer' | 'astrology-reader' | 'saju-analyzer' | 'tarot-reader' | 'juyeok-reader' | 'yukhyo-analyzer' | 'daily-tarot' | 'saved-results' | 'about' | 'privacy' | 'terms' | 'guide' | 'changelog' | 'checkout' | 'face-stretcher';

// --- HomePage Component ---
const HomePage: React.FC<{ onNavigate: (page: Page) => void; }> = ({ onNavigate }) => {
  const dailyFortuneData = getDailyFortune();
  const dailyFortune = dailyFortuneData.text;
  const fortuneImageUrl = dailyFortuneData.imageUrl;

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
          <div 
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 animate-fade-in-slow"
            style={{ backgroundImage: `url(${fortuneImageUrl})` }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
          
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
        
        {/* Face Stretcher Card */}
        <div
          onClick={() => onNavigate('face-stretcher')}
          className="bg-[#EC4899]/80 border border-[#DB2777] rounded-2xl p-6 flex flex-col items-center gap-4 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-[#F472B6] cursor-pointer group shadow-lg"
          role="button"
          tabIndex={0}
          aria-label="AI 얼굴 늘리기 실행하기"
          onKeyDown={(e) => e.key === 'Enter' && onNavigate('face-stretcher')}
        >
          <HappyFaceIcon className="w-16 h-16 text-white transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110" />
          <h2 className="text-2xl font-bold text-white">AI 얼굴 늘리기</h2>
          <p className="text-slate-200">AI가 당신의 얼굴을 재미있게 변형시켜 드립니다.</p>
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
  const [featureName, setFeatureName] = useState<string | null>(null);

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.split('?')[1]);
    const feature = hashParams.get('feature');
    if (feature) {
        setFeatureName(decodeURIComponent(feature));
    }
  }, []);

  const handleCheckout = async () => {
    if (!email) {
      setError("프리미엄 결제를 위해 이메일을 먼저 입력해주세요.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/create-checkout-session`, {
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
      if (err.message && err.message.includes('Stripe Price ID is not configured')) {
        setError('결제 설정이 완료되지 않았습니다. 관리자에게 문의하세요.');
      } else {
        setError(err.message);
      }
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header
        icon={<LockIcon className="w-10 h-10 text-cyan-400" />}
        title={featureName ? `프리미엄 - ${featureName}` : "프리미엄 전용 기능"}
        description={featureName ? `'${featureName}'의 모든 상세 분석을 이용하려면 플랜을 업그레이드하세요.` : "더욱 상세한 분석을 원하시면 프리미엄 플랜을 이용해보세요."}
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
           <ErrorMessage message={error} />
        </div>
      </main>
    </>
  );
};


// --- FaceReaderPage Component ---
const FaceReaderPage: React.FC<{ onBack: () => void; onNavigate: (page: Page) => void; email: string | null; }> = ({ onBack, onNavigate, email }) => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isSaved, setIsSaved] = useState(false);
    const { result, isLoading, error, runAnalysis, reset } = useAnalysis(analyzeFace);

    const handleImageSelect = (file: File) => {
        setImageFile(file);
        setImageUrl(URL.createObjectURL(file));
        reset();
        setIsSaved(false);
    };

    const handleAnalyze = useCallback(() => {
        if (imageFile) {
            runAnalysis(imageFile);
        }
    }, [imageFile, runAnalysis]);
    
    const handleSave = useCallback(() => {
        if (!result) return;
        saveResult({
            id: new Date().toISOString(),
            type: 'face-reader',
            typeName: 'AI 관상가',
            date: new Date().toISOString(),
            result,
        });
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    }, [result]);

    const handleReset = useCallback(() => {
        setImageFile(null);
        setImageUrl(null);
        reset();
        setIsSaved(false);
    }, [reset]);

    return (
        <>
            <Header
                icon={<FaceIcon className="w-10 h-10 text-cyan-400" />}
                title="AI 관상가"
                description="AI가 당신의 얼굴을 분석하여 미래를 읽어드립니다."
                onBack={onBack}
            />
            <main className="flex-grow flex flex-col items-center justify-center text-center py-10">
                {isLoading ? ( <Loader type="face" /> )
                : result ? (
                    <ResultDisplay
                        result={result}
                        onReset={handleReset}
                        onBack={onBack}
                        onSave={handleSave}
                        isSaved={isSaved}
                        isSavedView={false}
                        onNavigate={onNavigate}
                        email={email}
                    />
                ) : (
                    <ImageUploader
                        onImageSelect={handleImageSelect}
                        imageUrl={imageUrl}
                        onAnalyze={handleAnalyze}
                        hasImage={!!imageFile}
                    />
                )}
                <ErrorMessage message={error} />
            </main>
        </>
    );
};

// --- PalmReaderPage Component ---
const PalmReaderPage: React.FC<{ onBack: () => void; onNavigate: (page: Page) => void; email: string | null; }> = ({ onBack, onNavigate, email }) => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isSaved, setIsSaved] = useState(false);
    const { result, isLoading, error, runAnalysis, reset } = useAnalysis(analyzePalm);

    const handleImageSelect = (file: File) => {
        setImageFile(file);
        setImageUrl(URL.createObjectURL(file));
        reset();
        setIsSaved(false);
    };

    const handleAnalyze = useCallback(() => {
        if (imageFile) {
            runAnalysis(imageFile);
        }
    }, [imageFile, runAnalysis]);

    const handleSave = useCallback(() => {
        if (!result) return;
        saveResult({
            id: new Date().toISOString(), type: 'palm-reader', typeName: 'AI 손금 분석',
            date: new Date().toISOString(), result,
        });
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    }, [result]);

    const handleReset = useCallback(() => {
        setImageFile(null); setImageUrl(null); reset(); setIsSaved(false);
    }, [reset]);

    return (
        <>
            <Header 
                icon={<PalmIcon className="w-10 h-10 text-cyan-400" />}
                title="AI 손금 분석"
                description="AI가 당신의 손금을 분석하여 운명을 읽어드립니다."
                onBack={onBack}
            />
            <main className="flex-grow flex flex-col items-center justify-center text-center py-10">
                {isLoading ? ( <Loader type="palm" /> )
                : result ? (
                    <PalmResultDisplay
                        result={result}
                        onReset={handleReset}
                        onBack={onBack}
                        onSave={handleSave}
                        isSaved={isSaved}
                        isSavedView={false}
                        onNavigate={onNavigate}
                        email={email}
                    />
                ) : (
                    <ImageUploader
                        onImageSelect={handleImageSelect} imageUrl={imageUrl} onAnalyze={handleAnalyze} hasImage={!!imageFile} buttonText="손금 분석하기"
                    />
                )}
                <ErrorMessage message={error} />
            </main>
        </>
    );
};

// --- ImpressionAnalyzerPage Component ---
const ImpressionAnalyzerPage: React.FC<{ onBack: () => void; onNavigate: (page: Page) => void; email: string | null; }> = ({ onBack, onNavigate, email }) => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isSaved, setIsSaved] = useState(false);
    const { result, isLoading, error, runAnalysis, reset } = useAnalysis(analyzeImpression);

    const handleImageSelect = (file: File) => {
        setImageFile(file); setImageUrl(URL.createObjectURL(file)); reset(); setIsSaved(false);
    };

    const handleAnalyze = useCallback(() => {
        if (imageFile) runAnalysis(imageFile);
    }, [imageFile, runAnalysis]);

    const handleSave = useCallback(() => {
        if (!result) return;
        saveResult({
            id: new Date().toISOString(), type: 'impression-analyzer', typeName: 'AI 첫인상 분석',
            date: new Date().toISOString(), result,
        });
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    }, [result]);

    const handleReset = useCallback(() => {
        setImageFile(null); setImageUrl(null); reset(); setIsSaved(false);
    }, [reset]);

    return (
        <>
            <Header
                icon={<ImpressionIcon className="w-10 h-10 text-cyan-400" />}
                title="AI 첫인상 분석"
                description="AI가 사진을 통해 당신의 첫인상을 분석해 드립니다."
                onBack={onBack}
            />
            <main className="flex-grow flex flex-col items-center justify-center text-center py-10">
                {isLoading ? ( <Loader type="impression" /> )
                : result ? (
                    <ImpressionResultDisplay
                        result={result}
                        onReset={handleReset}
                        onBack={onBack}
                        onSave={handleSave}
                        isSaved={isSaved}
                        isSavedView={false}
                        onNavigate={onNavigate}
                        email={email}
                    />
                ) : (
                    <ImageUploader
                        onImageSelect={handleImageSelect} imageUrl={imageUrl} onAnalyze={handleAnalyze} hasImage={!!imageFile} buttonText="첫인상 분석하기"
                    />
                )}
                <ErrorMessage message={error} />
            </main>
        </>
    );
};

// --- AstrologyReaderPage Component ---
const AstrologyReaderPage: React.FC<{ onBack: () => void; onNavigate: (page: Page) => void; email: string | null; }> = ({ onBack, onNavigate, email }) => {
    const [isSaved, setIsSaved] = useState(false);
    const { result, isLoading, error, runAnalysis, reset } = useAnalysis(analyzeAstrology);

    const handleAnalyze = useCallback((birthDate: string) => {
        runAnalysis(birthDate);
    }, [runAnalysis]);
    
    const handleSave = useCallback(() => {
        if (!result) return;
        saveResult({
            id: new Date().toISOString(), type: 'astrology-reader', typeName: 'AI 별자리 운세',
            date: new Date().toISOString(), result,
        });
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    }, [result]);

    const handleReset = useCallback(() => {
        reset();
        setIsSaved(false);
    }, [reset]);

    return (
        <>
            <Header
                icon={<AstrologyIcon className="w-10 h-10 text-cyan-400" />}
                title="AI 별자리 운세"
                description="생년월일을 입력하면 AI가 당신의 별자리 운세를 알려드립니다."
                onBack={onBack}
            />
            <main className="flex-grow flex flex-col items-center justify-center text-center py-10">
                {isLoading ? ( <Loader type="astrology" /> )
                : result ? (
                    <AstrologyResultDisplay
                        result={result}
                        onReset={handleReset}
                        onBack={onBack}
                        onSave={handleSave}
                        isSaved={isSaved}
                        isSavedView={false}
                        onNavigate={onNavigate}
                        email={email}
                    />
                ) : (
                    <BirthDateInput onAnalyze={(birthDate) => handleAnalyze(birthDate)} buttonText="별자리 운세 보기" />
                )}
                <ErrorMessage message={error} />
            </main>
        </>
    );
};

// --- SajuAnalyzerPage Component ---
const SajuAnalyzerPage: React.FC<{ onBack: () => void; onNavigate: (page: Page) => void; email: string | null; }> = ({ onBack, onNavigate, email }) => {
    const [isSaved, setIsSaved] = useState(false);
    const { result, isLoading, error, runAnalysis, reset } = useAnalysis(analyzeSaju);

    const handleAnalyze = useCallback(async (birthDate: string, birthTime: string) => {
        runAnalysis(birthDate, birthTime);
    }, [runAnalysis]);

    const handleSave = useCallback(() => {
        if (!result) return;
        saveResult({
            id: new Date().toISOString(), type: 'saju-analyzer', typeName: 'AI 사주 분석',
            date: new Date().toISOString(), result,
        });
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    }, [result]);
    
    const handleReset = useCallback(() => {
        reset();
        setIsSaved(false);
    }, [reset]);

    return (
        <>
            <Header
                icon={<SajuIcon className="w-10 h-10 text-cyan-400" />}
                title="AI 사주 분석"
                description="생년월일시를 입력하면 AI가 당신의 사주를 분석해 드립니다."
                onBack={onBack}
            />
            <main className="flex-grow flex flex-col items-center justify-center text-center py-10">
                {isLoading ? ( <Loader type="saju" /> )
                : result ? (
                    <SajuResultDisplay
                        result={result}
                        onReset={handleReset}
                        onBack={onBack}
                        onSave={handleSave}
                        isSaved={isSaved}
                        isSavedView={false}
                        onNavigate={onNavigate}
                        email={email}
                    />
                ) : (
                    <BirthDateInput onAnalyze={handleAnalyze} buttonText="사주 분석하기" showTimeInput={true} />
                )}
                <ErrorMessage message={error} />
            </main>
        </>
    );
};

// --- JuyeokReaderPage Component ---
const JuyeokReaderPage: React.FC<{ onBack: () => void; onNavigate: (page: Page) => void; email: string | null; }> = ({ onBack, onNavigate, email }) => {
    const [question, setQuestion] = useState<string>('');
    const [juyeokReading, setJuyeokReading] = useState<JuyeokReading | null>(null);
    const [isSaved, setIsSaved] = useState(false);
    const { result, isLoading, error, runAnalysis, reset } = useAnalysis(analyzeJuyeok);

    const handleAnalyze = useCallback(() => {
        if (!question.trim()) return;
        const reading = generateIChingReading();
        setJuyeokReading(reading);
        runAnalysis(question, reading);
    }, [question, runAnalysis]);

    const handleSave = useCallback(() => {
        if (!result || !juyeokReading) return;
        saveResult({
            id: new Date().toISOString(), type: 'juyeok-reader', typeName: 'AI 주역 전문가',
            date: new Date().toISOString(), result, context: { question, reading: juyeokReading }
        });
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    }, [result, juyeokReading, question]);
    
    const handleReset = useCallback(() => {
        setQuestion(''); setJuyeokReading(null); reset(); setIsSaved(false);
    }, [reset]);

    return (
        <>
            <Header
                icon={<JuyeokIcon className="w-10 h-10 text-cyan-400" />}
                title="AI 주역 전문가"
                description="마음속 질문을 입력하면, AI가 주역 괘로 답을 드립니다."
                onBack={onBack}
            />
            <main className="flex-grow flex flex-col items-center justify-center text-center py-10">
                {isLoading ? ( <Loader type="juyeok" /> )
                : result && juyeokReading ? (
                    <JuyeokResultDisplay
                        result={result}
                        reading={juyeokReading}
                        question={question}
                        onReset={handleReset}
                        onBack={onBack}
                        onSave={handleSave}
                        isSaved={isSaved}
                        isSavedView={false}
                        onNavigate={onNavigate}
                        email={email}
                    />
                ) : (
                    <div className="w-full max-w-md flex flex-col items-center gap-8 p-6 bg-slate-800/50 rounded-2xl shadow-lg border border-slate-700">
                        <div className="w-full flex flex-col gap-4"><label htmlFor="juyeok-question" className="block text-lg font-medium text-slate-300">어떤 점이 궁금하신가요?</label><textarea id="juyeok-question" value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="예) 제가 지금 추진하는 프로젝트의 미래는 어떨까요?" className="w-full p-3 h-32 bg-slate-700/50 border border-slate-600 rounded-lg text-white resize-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500" /></div>
                        <button onClick={handleAnalyze} disabled={!question.trim()} className="w-full py-3 px-6 bg-cyan-500 text-slate-900 font-bold text-lg rounded-lg shadow-md transition-all duration-300 hover:bg-cyan-400 disabled:bg-slate-600 disabled:cursor-not-allowed">주역점 보기</button>
                    </div>
                )}
                <ErrorMessage message={error} />
            </main>
        </>
    );
};

// --- YukhyoAnalyzerPage Component ---
const YukhyoAnalyzerPage: React.FC<{ onBack: () => void; onNavigate: (page: Page) => void; email: string | null; }> = ({ onBack, onNavigate, email }) => {
    const [question, setQuestion] = useState<string>('');
    const [isSaved, setIsSaved] = useState(false);
    const { result, isLoading, error, runAnalysis, reset } = useAnalysis(analyzeYukhyo);

    const handleAnalyze = useCallback(() => {
        if (question.trim()) {
            runAnalysis(question);
        }
    }, [question, runAnalysis]);

    const handleSave = useCallback(() => {
        if (!result) return;
        saveResult({
            id: new Date().toISOString(), type: 'yukhyo-analyzer', typeName: 'AI 육효 분석가',
            date: new Date().toISOString(), result, context: { question }
        });
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    }, [result, question]);
    
    const handleReset = useCallback(() => {
        setQuestion(''); reset(); setIsSaved(false);
    }, [reset]);

    return (
        <>
            <Header
                icon={<YukhyoIcon className="w-10 h-10 text-cyan-400" />}
                title="AI 육효 분석가"
                description="질문을 입력하면 AI가 시점의 기운으로 구체적인 길흉을 예측합니다."
                onBack={onBack}
            />
            <main className="flex-grow flex flex-col items-center justify-center text-center py-10">
                {isLoading ? ( <Loader type="yukhyo" /> )
                : result ? (
                    <YukhyoResultDisplay
                        result={result}
                        question={question}
                        onReset={handleReset}
                        onBack={onBack}
                        onSave={handleSave}
                        isSaved={isSaved}
                        isSavedView={false}
                        onNavigate={onNavigate}
                        email={email}
                    />
                ) : (
                    <div className="w-full max-w-md flex flex-col items-center gap-8 p-6 bg-slate-800/50 rounded-2xl shadow-lg border border-slate-700">
                        <div className="w-full flex flex-col gap-4"><label htmlFor="yukhyo-question" className="block text-lg font-medium text-slate-300">어떤 점이 궁금하신가요?</label><textarea id="yukhyo-question" value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="예) 이번 시험에 합격할 수 있을까요?" className="w-full p-3 h-32 bg-slate-700/50 border border-slate-600 rounded-lg text-white resize-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"/></div>
                        <button onClick={handleAnalyze} disabled={!question.trim()} className="w-full py-3 px-6 bg-cyan-500 text-slate-900 font-bold text-lg rounded-lg shadow-md transition-all duration-300 hover:bg-cyan-400 disabled:bg-slate-600 disabled:cursor-not-allowed">육효점 보기</button>
                    </div>
                )}
                <ErrorMessage message={error} />
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

  const navigateTo = (page: Page | string) => {
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
      case 'face-stretcher':
        return <FaceStretcherPage onBack={() => navigateTo('home')} />;
      case 'saved-results':
        return (
          <PremiumRoute navigate={navigateTo} email={userEmail} redirectOnFail={true} featureName="나의 운세함">
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