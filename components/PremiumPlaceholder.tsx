import React from 'react';
import { LockIcon } from './icons';

export const UpgradeCTA: React.FC = () => {
    const handleUpgradeClick = () => {
        // Navigate to the checkout page using hash routing
        window.location.hash = 'checkout';
    };

    return (
        <div className="mt-8 bg-gradient-to-br from-slate-800 to-slate-900/50 border-2 border-cyan-500/50 rounded-2xl p-6 shadow-lg shadow-cyan-500/10">
            <div className="flex flex-col items-center text-center gap-4">
                 <LockIcon className="w-8 h-8 text-cyan-400" />
                <div>
                    <h3 className="text-xl font-bold text-cyan-300 font-display">👉 상세 리포트는 프리미엄 전용 기능입니다.</h3>
                    <p className="text-slate-400 mt-2">
                        연애, 금전, 직업운에 대한 더 깊이 있는 AI 분석과 맞춤 조언을 확인해보세요.
                    </p>
                </div>
                <button
                    onClick={handleUpgradeClick}
                    title="프리미엄 기능으로 업그레이드"
                    className="mt-2 py-2 px-6 bg-cyan-500 text-slate-900 font-bold text-lg rounded-lg shadow-md transition-all duration-300 hover:bg-cyan-400 hover:shadow-cyan-400/30 flex items-center gap-2"
                >
                    🔓 프리미엄 해금하기 (₩990)
                </button>
            </div>
        </div>
    );
};

// Alias for backward compatibility to fix build errors
export const PremiumPlaceholder = UpgradeCTA;