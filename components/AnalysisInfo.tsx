
import React from 'react';
import { BrainCircuitIcon } from './icons';

export const AnalysisInfo: React.FC = () => {
    return (
        <div className="mt-8 bg-slate-800 border border-slate-700 rounded-2xl p-6">
            <div className="flex items-start gap-4">
                <div className="flex-shrink-0 pt-1">
                    <BrainCircuitIcon className="w-8 h-8 text-cyan-400" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-cyan-300 mb-2 font-display">AI 분석은 어떻게 이루어지나요?</h3>
                    <p className="text-slate-400 leading-relaxed text-sm">
                        이 서비스는 Google의 최신 AI 모델을 기반으로 합니다. AI는 관상학, 손금, 별자리, 사주 명리학 등과 관련된 수많은 고서, 현대 서적, 웹 문서 등을 학습하여 특정 정보(얼굴 형태, 손금, 생년월일 등)가 가지는 통계적 의미와 패턴을 이해합니다.
                        <br /><br />
                        사용자가 정보를 입력하면, AI는 학습된 지식을 바탕으로 특징을 분석하고 가장 가능성 있는 해석을 새롭게 생성하여 제공합니다. 이 결과는 특정 자료를 인용하는 것이 아니며, 재미와 자기 성찰을 위한 참고 자료로 활용해주세요.
                    </p>
                </div>
            </div>
        </div>
    );
};
