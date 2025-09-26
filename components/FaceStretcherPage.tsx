import React, { useState, useCallback } from 'react';
import { Header } from './Header';
import { ImageUploader } from './ImageUploader';
import { Loader } from './Loader';
import { stretchFace } from '../services/geminiService';
import type { FaceStretchResult } from '../types';
import { HappyFaceIcon, HomeIcon, RefreshIcon } from './icons';
import { motion } from 'framer-motion';

export const FaceStretcherPage: React.FC<{ onBack: () => void; }> = ({ onBack }) => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<FaceStretchResult | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const faceStretcherMessages = [
        "얼굴을 쭉쭉 늘리는 중...",
        "더 재미있게 변형하는 중...",
        "유쾌한 에너지를 불어넣고 있습니다...",
        "거울 보고 놀라지 마세요!",
        "거의 다 됐습니다... 웃을 준비 하세요!"
    ];

    const handleImageSelect = (file: File) => {
        setImageFile(file);
        setOriginalImageUrl(URL.createObjectURL(file));
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
            const result = await stretchFace(imageFile);
            setAnalysisResult(result);
        } catch (err: any) {
            console.error(err);
            setError(err.message || '알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        } finally {
            setIsLoading(false);
        }
    }, [imageFile]);

    const handleReset = () => {
        setImageFile(null);
        setOriginalImageUrl(null);
        setAnalysisResult(null);
        setError(null);
    };

    const ResultView = () => (
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
                    <img src={`data:image/jpeg;base64,${analysisResult!.stretchedImageBase64}`} alt="Stretched" className="rounded-lg shadow-lg w-full" />
                </div>
            </div>
            <div className="mt-8 bg-slate-800/50 border border-slate-700 rounded-2xl shadow-lg p-6 text-center">
                <h3 className="text-2xl font-bold text-cyan-300 mb-2 font-display">AI의 한 줄 평</h3>
                <p className="text-slate-300 text-lg leading-relaxed">"{analysisResult!.comment}"</p>
            </div>
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

    return (
        <>
            <Header
                icon={<HappyFaceIcon className="w-10 h-10 text-cyan-400" />}
                title="AI 얼굴 늘리기"
                description="사진을 올리면 AI가 얼굴을 재미있게 늘려드립니다."
                onBack={onBack}
            />
            <main className="flex-grow flex flex-col items-center justify-center text-center py-10">
                {isLoading ? (
                    <Loader messages={faceStretcherMessages} />
                ) : analysisResult ? (
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
