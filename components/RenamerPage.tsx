import React, { useState, useCallback } from 'react';
import { Header } from './Header';
import { Loader } from './Loader';
import { NameGeneratorIcon } from './icons';
import { useAnalysis } from '../hooks/useAnalysis';
import { generateForRename } from '../services/geminiService';
import { saveResult } from '../utils/storage';
import { ErrorMessage } from './shared/ErrorMessage';
import { NameResultDisplay } from './NameResultDisplay';

export const RenamerPage: React.FC<{ onBack: () => void; }> = ({ onBack }) => {
    const [currentName, setCurrentName] = useState('');
    const [lastName, setLastName] = useState('');
    const [gender, setGender] = useState<'남성' | '여성'>('남성');
    const [year, setYear] = useState('');
    const [month, setMonth] = useState('');
    const [day, setDay] = useState('');
    const [hour, setHour] = useState('모름');
    const [requests, setRequests] = useState('');
    const [isSaved, setIsSaved] = useState(false);
    const { result, isLoading, error: analysisError, runAnalysis, reset } = useAnalysis(generateForRename);
    const [formError, setFormError] = useState<string | null>(null);

    const handleAnalyze = useCallback(() => {
        if (!currentName.trim() || !lastName.trim() || !year || !month || !day) {
            setFormError('현재 이름, 성씨, 생년월일을 모두 입력해주세요.');
            return;
        }
        const yearNum = parseInt(year);
        if (yearNum < 1900 || yearNum > new Date().getFullYear()) {
            setFormError('유효한 출생 연도를 입력해주세요.');
            return;
        }
        setFormError(null);
        const birthDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        runAnalysis(currentName, lastName, gender, birthDate, hour, requests);
    }, [currentName, lastName, gender, year, month, day, hour, requests, runAnalysis]);

    const handleSave = useCallback(() => {
        if (!result) return;
        saveResult({
            id: new Date().toISOString(),
            type: 'renamer',
            typeName: 'AI 개명 추천',
            date: new Date().toISOString(),
            result,
            context: { lastName, gender, birthDate: `${year}-${month}-${day}`, birthTime: hour, requests }
        });
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    }, [result, lastName, gender, year, month, day, hour, requests]);
    
    const handleReset = useCallback(() => {
        setCurrentName('');
        setLastName('');
        setGender('남성');
        setYear('');
        setMonth('');
        setDay('');
        setHour('모름');
        setRequests('');
        setIsSaved(false);
        setFormError(null);
        reset();
    }, [reset]);

    return (
        <>
            <Header
                icon={<NameGeneratorIcon className="w-10 h-10 text-cyan-400" />}
                title="AI 개명 추천"
                description="사주를 보완하여 새로운 미래를 열어줄 이름을 추천합니다."
                onBack={onBack}
            />
            <main className="flex-grow flex flex-col items-center justify-center text-center py-10">
                {isLoading ? <Loader type="renamer" /> :
                 result ? (
                    <NameResultDisplay
                        result={result}
                        lastName={lastName}
                        onReset={handleReset}
                        onBack={onBack}
                        onSave={handleSave}
                        isSaved={isSaved}
                        isSavedView={false}
                        resultType="rename"
                    />
                ) : (
                    <div className="w-full max-w-md flex flex-col items-center gap-8 p-6 bg-slate-800/50 rounded-2xl shadow-lg border border-slate-700">
                        <form onSubmit={(e) => { e.preventDefault(); handleAnalyze(); }} className="w-full flex flex-col gap-6">
                            <div>
                                <label htmlFor="currentName" className="block text-sm font-medium text-slate-300 mb-2">현재 이름</label>
                                <input type="text" id="currentName" value={currentName} onChange={(e) => setCurrentName(e.target.value)} placeholder="예) 홍길동" className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white" />
                            </div>
                            <div>
                                <label htmlFor="lastName" className="block text-sm font-medium text-slate-300 mb-2">성씨</label>
                                <input type="text" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="예) 김" className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">성별</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button type="button" onClick={() => setGender('남성')} className={`p-3 rounded-lg font-bold transition-colors ${gender === '남성' ? 'bg-cyan-500 text-slate-900' : 'bg-slate-700'}`}>남성</button>
                                    <button type="button" onClick={() => setGender('여성')} className={`p-3 rounded-lg font-bold transition-colors ${gender === '여성' ? 'bg-pink-500 text-white' : 'bg-slate-700'}`}>여성</button>
                                </div>
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
                            <div>
                                <label htmlFor="requests" className="block text-sm font-medium text-slate-300 mb-2">추가 요청사항 <span className="text-slate-400">(선택)</span></label>
                                <textarea id="requests" value={requests} onChange={(e) => setRequests(e.target.value)} placeholder="예) 세련되고 부르기 쉬운 이름으로 부탁합니다." className="w-full p-3 h-24 bg-slate-700/50 border border-slate-600 rounded-lg text-white resize-none" />
                            </div>
                             {formError && <p className="text-red-400 text-sm">{formError}</p>}
                            <button type="submit" className="w-full py-3 px-6 bg-cyan-500 text-slate-900 font-bold text-lg rounded-lg shadow-md transition-all duration-300 hover:bg-cyan-400 disabled:bg-slate-600">개명 추천받기</button>
                        </form>
                    </div>
                )}
                <ErrorMessage message={analysisError} />
            </main>
        </>
    );
};
