import React, { useState, useCallback } from 'react';
import { Header } from './Header';
import { Loader } from './Loader';
import { NameGeneratorIcon } from './icons';
import { useAnalysis } from '../hooks/useAnalysis';
import { analyzePersonalName } from '../services/geminiService';
import { saveResult } from '../utils/storage';
import { ErrorMessage } from './shared/ErrorMessage';
import { PersonalNameAnalysisResultDisplay } from './PersonalNameAnalysisResultDisplay';

export const PersonalNameAnalyzerPage: React.FC<{ onBack: () => void; }> = ({ onBack }) => {
    const [name, setName] = useState('');
    const [year, setYear] = useState('');
    const [month, setMonth] = useState('');
    const [day, setDay] = useState('');
    const [hour, setHour] = useState('모름');
    const [isSaved, setIsSaved] = useState(false);
    const { result, isLoading, error: analysisError, runAnalysis, reset } = useAnalysis(analyzePersonalName);
    const [formError, setFormError] = useState<string | null>(null);

    const handleAnalyze = useCallback(() => {
        if (!name.trim() || !year || !month || !day) {
            setFormError('이름과 생년월일을 모두 입력해주세요.');
            return;
        }
        const yearNum = parseInt(year);
        if (yearNum < 1900 || yearNum > new Date().getFullYear()) {
            setFormError('유효한 출생 연도를 입력해주세요.');
            return;
        }
        setFormError(null);
        const birthDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        runAnalysis(name, birthDate, hour);
    }, [name, year, month, day, hour, runAnalysis]);

    const handleSave = useCallback(() => {
        if (!result) return;
        saveResult({
            id: new Date().toISOString(),
            type: 'personal-name-analyzer',
            typeName: 'AI 개인 이름 분석',
            date: new Date().toISOString(),
            result,
            context: { name, birthDate: `${year}-${month}-${day}`, birthTime: hour }
        });
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    }, [result, name, year, month, day, hour]);
    
    const handleReset = useCallback(() => {
        setName('');
        setYear('');
        setMonth('');
        setDay('');
        setHour('모름');
        setIsSaved(false);
        setFormError(null);
        reset();
    }, [reset]);

    return (
        <>
            <Header
                icon={<NameGeneratorIcon className="w-10 h-10 text-cyan-400" />}
                title="AI 개인 이름 분석"
                description="현재 이름이 당신의 사주와 얼마나 잘 맞는지 분석해 드립니다."
                onBack={onBack}
            />
            <main className="flex-grow flex flex-col items-center justify-center text-center py-10">
                {isLoading ? <Loader type="personal-name-analyzer" /> :
                 result ? (
                    <PersonalNameAnalysisResultDisplay
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
                                <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">이름 (성과 이름)</label>
                                <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="예) 홍길동" className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-center" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">생년월일</label>
                                <div className="grid grid-cols-3 gap-4">
                                    <input type="number" value={year} onChange={(e) => setYear(e.target.value)} placeholder="YYYY" className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-center" />
                                    <input type="number" value={month} onChange={(e) => setMonth(e.target.value)} placeholder="MM" className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-center" />
                                    <input type="number" value={day} onChange={(e) => setDay(e.target.value)} placeholder="DD" className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-center" />
                                </div>
                            </div>
                             <div>
                                <label htmlFor="hour" className="block text-sm font-medium text-slate-300 mb-2">태어난 시간 <span className="text-slate-400">(선택)</span></label>
                                <select id="hour" value={hour} onChange={(e) => setHour(e.target.value)} className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white">
                                    <option value="모름">모름</option>
                                    {Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`).map(time => (<option key={time} value={time}>{time}</option>))}
                                </select>
                            </div>
                             {formError && <p className="text-red-400 text-sm">{formError}</p>}
                            <button type="submit" className="w-full py-3 px-6 bg-cyan-500 text-slate-900 font-bold text-lg rounded-lg shadow-md transition-all duration-300 hover:bg-cyan-400 disabled:bg-slate-600">이름 분석하기</button>
                        </form>
                    </div>
                )}
                <ErrorMessage message={analysisError} />
            </main>
        </>
    );
};
