import React from 'react';
import { HomeIcon } from './icons';

interface PageProps {
  onBack: () => void;
}

export const AboutPage: React.FC<PageProps> = ({ onBack }) => {
  return (
    <div className="w-full max-w-4xl mx-auto py-10 animate-fade-in">
      <header className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold font-display tracking-wider text-white">
          서비스 소개
        </h1>
        <p className="mt-3 text-lg text-slate-400">
          AI 운세 시리즈에 대해 알려드립니다.
        </p>
      </header>

      <div className="space-y-8 bg-slate-800/50 border border-slate-700 rounded-2xl p-6 sm:p-10 text-slate-300 leading-relaxed">
        <section>
          <h2 className="text-2xl font-bold text-cyan-300 mb-3 font-display">AI 운세 시리즈란?</h2>
          <p>
            AI 운세 시리즈는 최신 인공지능 기술을 활용하여 관상, 손금, 사주 등 동양의 전통적인 운세 분석 방법과 별자리, 타로 등 서양의 점성술을 현대적으로 재해석한 서비스입니다. 사용자는 사진이나 생년월일 같은 간단한 정보만으로 자신에 대한 깊이 있는 통찰과 미래에 대한 가능성을 탐색할 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-cyan-300 mb-3 font-display">어떤 기술을 사용하나요?</h2>
          <p>
            본 서비스의 핵심 엔진은 Google의 최첨단 AI 모델인 Gemini입니다. Gemini는 방대한 양의 텍스트와 이미지를 학습하여 인간의 언어와 시각적 패턴을 깊이 있게 이해합니다. 저희는 이 강력한 AI에 관상학, 사주 명리학, 점성술 등 각 분야의 전문 지식을 추가로 학습시켜, 사용자의 정보를 다각도로 분석하고 개인화된 해석을 생성하도록 만들었습니다.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-cyan-300 mb-3 font-display">이 서비스는 무엇을 제공하나요?</h2>
          <p>
            저희는 AI 운세 시리즈를 통해 사용자들이 자신을 더 잘 이해하고, 삶의 긍정적인 방향을 찾는 데 도움을 주고자 합니다. AI가 제공하는 분석 결과는 과학적으로 증명된 사실이 아닌, 통계와 패턴에 기반한 흥미로운 해석입니다. 정해진 미래를 예측하기보다는, 자신을 성찰하고 새로운 가능성을 발견하는 재미있는 도구로 활용해주시기 바랍니다.
          </p>
        </section>
      </div>

      <div className="mt-12 text-center">
        <button
          onClick={onBack}
          className="py-3 px-8 bg-slate-600 text-white font-bold text-lg rounded-lg shadow-md transition-all duration-300 hover:bg-slate-500 flex items-center gap-2 mx-auto"
        >
          <HomeIcon className="w-5 h-5" />
          홈으로
        </button>
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.7s ease-out forwards;
        }
      `}</style>
    </div>
  );
};
