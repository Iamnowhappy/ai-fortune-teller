import React, { useState, useCallback } from 'react';
import { Header } from './Header';
import { Loader } from './Loader';
import { BusinessIcon } from './icons';
import { useAnalysis } from '../hooks/useAnalysis';
import { analyzeBusinessName } from '../services/geminiService';
import { saveResult } from '../utils/storage';
import { ErrorMessage } from './shared/ErrorMessage';
import { BusinessNameAnalysisResultDisplay } from './BusinessNameAnalysisResultDisplay';

export const BusinessNameAnalyzerPage: React.FC<{ onBack: () => void; }> = ({ onBack }) => {
    const [name, setName] = useState('');
    const [businessType, setBusinessType] = useState('');
    const [isSaved, setIsSaved] = useState(false);
    const { result, isLoading, error: analysisError, runAnalysis, reset } = useAnalysis(analyzeBusinessName);
    const [formError, setFormError] = useState<string | null>(null);

    const handleAnalyze = useCallback(() => {
        if (!name.trim() || !businessType.trim()) {
            setFormError('상호명과 업종을 모두 입력해주세요.');
            return;
        }
        setFormError(null);
        runAnalysis(name, businessType);
    }, [name, businessType, runAnalysis]);

    const handleSave = useCallback(() => {
        if (!result) return;
        saveResult({
            id: new Date().toISOString(),
            type: 'business-name-analyzer',
            typeName: 'AI 상호명 분석',
            date: new Date().toISOString(),
            result,
            context: { name, businessType }
        });
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    }, [result, name, businessType]);
    
    const handleReset = useCallback(() => {
        setName('');
        setBusinessType('');
        setIsSaved(false);
        setFormError(null);
        reset();
    }, [reset]);

    return (
        <>
            <Header
                icon={<BusinessIcon className="w-10 h-10 text-cyan-400" />}
                title="AI 상호명 분석"
                description="현재 상호의 운과 브랜드 가치를 종합적으로 진단합니다."
                onBack={onBack}
            />
            <main className="flex-grow flex flex-col items-center justify-center text-center py-10">
                {isLoading ? <Loader type="business-name-analyzer" /> :
                 result ? (
                    <BusinessNameAnalysisResultDisplay
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
                                <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">상호명</label>
                                <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="예) 삼성전자, 행복 카페" className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white" />
                            </div>
                            <div>
                                <label htmlFor="businessType" className="block text-sm font-medium text-slate-300 mb-2">업종/분야</label>
                                <input type="text" id="businessType" value={businessType} onChange={(e) => setBusinessType(e.target.value)} placeholder="예) IT, 요식업, 제조업" className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white" />
                            </div>
                             {formError && <p className="text-red-400 text-sm">{formError}</p>}
                            <button type="submit" className="w-full py-3 px-6 bg-cyan-500 text-slate-900 font-bold text-lg rounded-lg shadow-md transition-all duration-300 hover:bg-cyan-400 disabled:bg-slate-600">상호명 분석하기</button>
                        </form>
                    </div>
                )}
                <ErrorMessage message={analysisError} />
            </main>
        </>
    );
};
