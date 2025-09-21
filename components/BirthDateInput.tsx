
import React, { useState } from 'react';

interface BirthDateInputProps {
  onAnalyze: (birthDate: string, birthTime: string) => void;
  buttonText: string;
  showTimeInput?: boolean;
}

export const BirthDateInput: React.FC<BirthDateInputProps> = ({ 
  onAnalyze, 
  buttonText, 
  showTimeInput = false 
}) => {
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [hour, setHour] = useState('모름');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!year || !month || !day) {
      setError('생년월일을 모두 입력해주세요.');
      return;
    }
    const yearNum = parseInt(year);
    if (yearNum < 1900 || yearNum > new Date().getFullYear()) {
        setError('유효한 출생 연도를 입력해주세요.');
        return;
    }

    setError(null);
    const birthDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    onAnalyze(birthDate, hour);
  };

  const isFormValid = year && month && day;

  return (
    <div className="w-full max-w-md flex flex-col items-center gap-8 p-6 bg-slate-800/50 rounded-2xl shadow-lg border border-slate-700">
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
        <div>
          <label htmlFor="year" className="block text-sm font-medium text-slate-300 mb-2">생년월일</label>
          <div className="grid grid-cols-3 gap-4">
            <input
              type="number"
              id="year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="YYYY"
              className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-center focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              aria-label="출생 연도"
            />
            <input
              type="number"
              id="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              placeholder="MM"
              min="1"
              max="12"
              className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-center focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              aria-label="출생 월"
            />
            <input
              type="number"
              id="day"
              value={day}
              onChange={(e) => setDay(e.target.value)}
              placeholder="DD"
              min="1"
              max="31"
              className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-center focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              aria-label="출생 일"
            />
          </div>
        </div>
        
        {showTimeInput && (
          <div>
            <label htmlFor="hour" className="block text-sm font-medium text-slate-300 mb-2">
              태어난 시간
              <span className="text-slate-400 ml-2 relative group">(선택)
                <span className="absolute bottom-full mb-2 w-64 p-2 bg-slate-900 text-xs text-slate-300 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 left-1/2 -translate-x-1/2 shadow-lg z-10">
                  태어난 시간을 입력하면 '시주(時柱)'를 포함한 더 정확한 사주 분석이 가능합니다. 모르실 경우 '모름'으로 두세요.
                </span>
              </span>
            </label>
            <select
              id="hour"
              value={hour}
              onChange={(e) => setHour(e.target.value)}
              className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              aria-label="태어난 시간"
            >
              <option value="모름">모름</option>
              {Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`).map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </div>
        )}

        {error && (
            <p className="text-red-400 text-sm">{error}</p>
        )}

        <button
          type="submit"
          disabled={!isFormValid}
          className="w-full py-3 px-6 bg-cyan-500 text-slate-900 font-bold text-lg rounded-lg shadow-md transition-all duration-300 hover:bg-cyan-400 hover:shadow-cyan-400/30 disabled:bg-slate-600 disabled:text-slate-400 disabled:cursor-not-allowed disabled:shadow-none"
        >
          {buttonText}
        </button>
      </form>
    </div>
  );
};
