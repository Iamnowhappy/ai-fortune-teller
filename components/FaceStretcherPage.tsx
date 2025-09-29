import React, { useState, useCallback, useRef } from 'react';
import { Header } from './Header';
import { ImageUploader } from './ImageUploader';
import { Loader } from './Loader';
import { HappyFaceIcon, HomeIcon, RefreshIcon } from './icons';
import { motion } from 'framer-motion';
import { ErrorMessage } from './shared/ErrorMessage';
import { ShareButtons } from './ShareButtons';


const funnyComments = [
    "중력을 거스르는 자가 되셨군요!",
    "얼굴에서 초고층 빌딩이 보입니다.",
    "이 얼굴, 왠지 모르게 지적인데요?",
    "세상 모든 번뇌를 초월한 표정입니다.",
    "길어서 슬픈 얼굴이여... 하지만 웃기군요!",
    "다음 프로필 사진은 이걸로 정했습니다."
];

export const FaceStretcherPage: React.FC<{ onBack: () => void; }> = ({ onBack }) => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
    const [stretchedImageUrl, setStretchedImageUrl] = useState<string | null>(null);
    const [comment, setComment] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleImageSelect = (file: File) => {
        setImageFile(file);
        setOriginalImageUrl(URL.createObjectURL(file));
        setStretchedImageUrl(null);
        setComment('');
        setError(null);
    };

    const handleAnalyze = useCallback(() => {
        if (!originalImageUrl) {
            setError('분석할 이미지를 먼저 선택해주세요.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setStretchedImageUrl(null);

        setComment(funnyComments[Math.floor(Math.random() * funnyComments.length)]);

        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = originalImageUrl;

        img.onload = () => {
            if (canvas && ctx) {
                const stretchFactor = 1.5; // Stretch vertically by 50%
                const { width, height } = img;
                
                canvas.width = width;
                canvas.height = height * stretchFactor;

                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                setStretchedImageUrl(canvas.toDataURL('image/jpeg'));
            }
            setIsLoading(false);
        };
        
        img.onerror = () => {
            setError('이미지를 처리하는 중 오류가 발생했습니다.');
            setIsLoading(false);
        };

    }, [originalImageUrl]);

    const handleReset = () => {
        setImageFile(null);
        setOriginalImageUrl(null);
        setStretchedImageUrl(null);
        setComment('');
        setError(null);
    };

    const ResultView = () => {
        const shareText = `AI 얼굴 늘리기로 제 얼굴이 이렇게 변했어요! 😂\n\n한 줄 평: "${comment}"\n\n여러분도 AI 운세 시리즈에서 해보세요!`;

        return (
            <motion.div 
                className="w-full max-w-4xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col items-center gap-2">
                        <h2 className="text-xl font-bold text-slate-300">원본 이미지</h2>
                        <img src={originalImageUrl!} alt="Original" className="rounded-lg shadow-lg w-full" />
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <h2 className="text-xl font-bold text-cyan-300">변형된 이미지</h2>
                        {stretchedImageUrl ? (
                            <img src={stretchedImageUrl} alt="Stretched" className="rounded-lg shadow-lg w-full" />
                        ) : (
                            <div className="w-full h-full min-h-[200px] aspect-[1/1] bg-slate-800/50 border border-slate-700 rounded-lg flex items-center justify-center p-4">
                                <p className="text-slate-400 text-center">이미지를 생성할 수 없습니다.</p>
                            </div>
                        )}
                    </div>
                </div>
                <div className="mt-8 bg-slate-800/50 border border-slate-700 rounded-2xl shadow-lg p-6 text-center">
                    <h3 className="text-2xl font-bold text-cyan-300 mb-2 font-display">한 줄 평</h3>
                    <p className="text-slate-300 text-lg leading-relaxed">"{comment}"</p>
                </div>

                <ShareButtons shareText={shareText} />

                <div className="mt-10 text-center flex flex-wrap justify-center gap-4">
                    <button
                        onClick={onBack}
                        className="py-3 px-6 bg-slate-600 text-white font-bold text-lg rounded-lg shadow-md transition-all duration-300 hover:bg-slate-500 flex items-center gap-2"
                    >
                        <HomeIcon className="w-5 h-5" />
                        홈으로
                    </button>
                    <button
                        onClick={handleReset}
                        className="py-3 px-6 bg-cyan-500 text-slate-900 font-bold text-lg rounded-lg shadow-md transition-all duration-300 hover:bg-cyan-400 hover:shadow-cyan-400/30 flex items-center gap-2"
                    >
                        <RefreshIcon className="w-5 h-5" />
                        다시하기
                    </button>
                </div>
            </motion.div>
        );
    };

    return (
        <>
            <Header
                icon={<HappyFaceIcon className="w-10 h-10 text-cyan-400" />}
                title="AI 얼굴 늘리기"
                description="사진을 올리면 AI가 얼굴을 재미있게 늘려드립니다."
                onBack={onBack}
            />
            <main className="flex-grow flex flex-col items-center justify-center text-center py-10">
                <canvas ref={canvasRef} className="hidden" />

                {isLoading ? (
                    <Loader type="face-stretch" />
                ) : stretchedImageUrl ? (
                    <ResultView />
                ) : (
                    <ImageUploader
                        onImageSelect={handleImageSelect}
                        imageUrl={originalImageUrl}
                        onAnalyze={handleAnalyze}
                        hasImage={!!imageFile}
                        buttonText="얼굴 늘리기"
                    />
                )}
                <ErrorMessage message={error} />
            </main>
        </>
    );
};