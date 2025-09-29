import React, { useState, useCallback } from 'react';
import { Header } from './Header';
import { Loader } from './Loader';
import { BusinessIcon } from './icons';
import { useAnalysis } from '../hooks/useAnalysis';
import { generateBusinessName } from '../services/geminiService';
import { saveResult } from '../utils/storage';
import { ErrorMessage } from './shared/ErrorMessage';
import { BusinessNameResultDisplay } from './BusinessNameResultDisplay';

export const BusinessNamerPage: React.FC<{ onBack: () => void; }> = ({ onBack }) => {
    const [businessType, setBusinessType] = useState('');
    const [coreValues, setCoreValues] = useState('');
    const [exclusions, setExclusions] = useState('');
    const [isSaved, setIsSaved] = useState(false);
    const { result, isLoading, error: analysisError, runAnalysis, reset } = useAnalysis(generateBusinessName);
    const [formError, setFormError] = useState<string | null>(null);

    const handleAnalyze = useCallback(() => {
        if (!businessType.trim() || !coreValues.trim()) {
            setFormError('업종과 핵심 가치를 모두 입력해주세요.');
            return;
        }
        setFormError(null);
        runAnalysis(businessType, coreValues, exclusions);
    }, [businessType, coreValues, exclusions, runAnalysis]);

    const handleSave = useCallback(() => {
        if (!result) return;
        saveResult({
            id: new Date().toISOString(),
            type: 'business-namer',
            typeName: 'AI 상호명 작명',
            date: new Date().toISOString(),
            result,
            context: { businessType, coreValues, exclusions }
        });
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    }, [result, businessType, coreValues, exclusions]);
    
    const handleReset = useCallback(() => {
        setBusinessType('');
        setCoreValues('');
        setExclusions('');
        setIsSaved(false);
        setFormError(null);
        reset();
    }, [reset]);

    return (
        <>
            <Header
                icon={<BusinessIcon className="w-10 h-10 text-cyan-400" />}
                title="AI 상호명 작명"
                description="사업의 번영을 기원하는 최고의 상호명을 추천받으세요."
                onBack={onBack}
            />
            <main className="flex-grow flex flex-col items-center justify-center text-center py-10">
                {isLoading ? <Loader type="business-namer" /> :
                 result ? (
                    <BusinessNameResultDisplay
                        result={result}
                        onReset={handleReset}
                        onBack={onBack}
                        onSave={handleSave}
                        isSaved={isSaved}
                        isSavedView={false}
                    />
                ) : (
                    <div className="w-full max-w-md flex flex-col items-center gap-8 p-6 bg-slate-800/50 rounded-2xl shadow-lg border border-slate-700">
                        <form onSubmit={(e) => { e.preventDefault(); handleAnalyze(); }} className="w-full flex flex-col gap-6">
                            <div>
                                <label htmlFor="businessType" className="block text-sm font-medium text-slate-300 mb-2">업종/분야</label>
                                <input type="text" id="businessType" value={businessType} onChange={(e) => setBusinessType(e.target.value)} placeholder="예) IT 스타트업, 카페, 온라인 쇼핑몰" className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white" />
                            </div>
                            <div>
                                <label htmlFor="coreValues" className="block text-sm font-medium text-slate-300 mb-2">핵심 가치 또는 키워드</label>
                                <textarea id="coreValues" value={coreValues} onChange={(e) => setCoreValues(e.target.value)} placeholder="예) 혁신, 신뢰, 자연주의, 편리함" className="w-full p-3 h-24 bg-slate-700/50 border border-slate-600 rounded-lg text-white resize-none" />
                            </div>
                            <div>
                                <label htmlFor="exclusions" className="block text-sm font-medium text-slate-300 mb-2">피하고 싶은 단어나 스타일 <span className="text-slate-400">(선택)</span></label>
                                <input type="text" id="exclusions" value={exclusions} onChange={(e) => setExclusions(e.target.value)} placeholder="예) 너무 흔한 이름, 어려운 외국어" className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white" />
                            </div>
                             {formError && <p className="text-red-400 text-sm">{formError}</p>}
                            <button type="submit" className="w-full py-3 px-6 bg-cyan-500 text-slate-900 font-bold text-lg rounded-lg shadow-md transition-all duration-300 hover:bg-cyan-400 disabled:bg-slate-600">상호명 추천받기</button>
                        </form>
                    </div>
                )}
                <ErrorMessage message={analysisError} />
            </main>
        </>
    );
};
