import React from 'react';

// A simple lock icon if heroicons are not setup
const LockIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3A5.25 5.25 0 0012 1.5zm-3.75 5.25v3h7.5v-3a3.75 3.75 0 00-7.5 0z" clipRule="evenodd" />
    </svg>
);

export const PremiumPlaceholder: React.FC = () => {
    return (
        <div className="mt-8 bg-gradient-to-br from-slate-800 to-slate-900/50 border-2 border-yellow-500/50 rounded-2xl p-6 shadow-lg shadow-yellow-500/10">
            <div className="flex flex-col items-center text-center gap-4">
                 <LockIcon className="w-8 h-8 text-yellow-400" />
                <div>
                    <h3 className="text-xl font-bold text-yellow-300 font-display">상세 리포트 보기 (프리미엄)</h3>
                    <p className="text-slate-400 mt-2">
                        연애, 금전, 직업운에 대한 더 깊이 있는 AI 분석과 맞춤 조언을 확인해보세요.
                    </p>
                </div>
                <button
                    disabled
                    title="프리미엄 기능은 현재 준비 중입니다."
                    className="mt-2 py-2 px-6 bg-slate-600 text-slate-400 font-bold text-lg rounded-lg shadow-md cursor-not-allowed flex items-center gap-2"
                >
                    프리미엄으로 업그레이드
                </button>
            </div>
        </div>
    );
};