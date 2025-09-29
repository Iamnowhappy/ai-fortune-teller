import React from 'react';
import { HomeIcon, FaceIcon, PalmIcon, SajuIcon, AstrologyIcon, TarotIcon, JuyeokIcon, DreamIcon, NameGeneratorIcon } from './icons';

interface PageProps {
  onBack: () => void;
}

const GuideSection: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <section className="flex items-start gap-4 sm:gap-6">
        <div className="flex-shrink-0 pt-1 text-cyan-400">
            {icon}
        </div>
        <div>
            <h2 className="text-xl sm:text-2xl font-bold text-cyan-300 mb-2 font-display">{title}</h2>
            <div className="text-slate-300 leading-relaxed space-y-2">
                {children}
            </div>
        </div>
    </section>
);


export const GuidePage: React.FC<PageProps> = ({ onBack }) => {
  return (
    <div className="w-full max-w-4xl mx-auto py-10 animate-fade-in">
      <header className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold font-display tracking-wider text-white">
          AI 운세 가이드
        </h1>
        <p className="mt-3 text-lg text-slate-400">
          AI 운세 시리즈가 제공하는 서비스들을 소개합니다.
        </p>
      </header>

      <div className="space-y-12 bg-slate-800/50 border border-slate-700 rounded-2xl p-6 sm:p-10">
        <GuideSection icon={<FaceIcon className="w-10 h-10" />} title="AI 관상가">
            <p>관상은 얼굴의 형태, 색, 기운 등을 통해 사람의 성격, 건강, 운명 등을 파악하는 동양의 전통적인 학문입니다. 이마는 초년운, 코와 광대뼈는 중년운, 턱은 말년운을 상징하는 등 각 부위가 특정 시기와 의미를 가집니다. AI 관상가는 이러한 관상학 데이터를 학습하여 당신의 얼굴에 담긴 잠재력과 가능성을 분석해 드립니다.</p>
        </GuideSection>

        <GuideSection icon={<PalmIcon className="w-10 h-10" />} title="AI 손금 분석">
            <p>손금은 손바닥에 나타난 선들을 통해 사람의 운명과 성향을 읽어내는 점술입니다. 대표적인 3대선인 생명선, 감정선, 두뇌선을 중심으로 건강, 애정, 재능 등을 파악합니다. 손금은 정해진 운명이 아닌, 살아오면서 변화하는 삶의 지도로 여겨집니다. AI 손금 분석은 당신의 손에 새겨진 삶의 흔적과 미래의 방향성을 해석해 드립니다.</p>
        </GuideSection>
        
        <GuideSection icon={<DreamIcon className="w-10 h-10" />} title="AI 꿈 해몽 전문가">
            <p>꿈 해몽은 수면 중에 경험하는 이야기와 이미지를 통해 자신의 무의식적인 생각, 감정, 미래에 대한 암시를 해석하는 과정입니다. 꿈에 등장하는 상징물들은 개인의 심리 상태와 현실의 문제를 반영합니다. AI 꿈 해몽 전문가는 심리학과 상징학 데이터를 기반으로 당신의 꿈이 보내는 메시지를 해석하고, 삶에 대한 깊은 통찰을 제공합니다.</p>
        </GuideSection>

        <GuideSection icon={<SajuIcon className="w-10 h-10" />} title="AI 사주 분석">
            <p>사주 명리학은 사람이 태어난 연, 월, 일, 시(사주)를 바탕으로 운명을 예측하는 학문입니다. 네 개의 기둥(사주)에 각각 천간과 지지를 붙여 총 여덟 글자(팔자)로 구성되며, 이 글자들의 상호 관계와 오행의 조화를 통해 타고난 기질, 재능, 삶의 큰 흐름을 분석합니다. AI 사주 분석은 복잡한 명리학 이론을 바탕으로 당신의 타고난 운명의 지도를 해석해 드립니다.</p>
        </GuideSection>
        
        <GuideSection icon={<NameGeneratorIcon className="w-10 h-10" />} title="AI 작명가">
            <p>작명은 사주팔자를 분석하여 부족한 오행의 기운을 보충하고, 이름의 소리(발음 오행), 한자의 의미, 획수의 조화(수리 오행)를 모두 고려하여 한 사람의 인생에 긍정적인 영향을 주는 이름을 짓는 과정입니다. 좋은 이름은 그 사람의 정체성을 나타내고 미래를 밝혀주는 첫 번째 선물입니다. AI 작명가는 전통 작명 이론을 기반으로 당신에게 가장 어울리는 이름을 찾아드립니다.</p>
        </GuideSection>

        <GuideSection icon={<AstrologyIcon className="w-10 h-10" />} title="AI 별자리 운세">
            <p>서양 점성술은 사람이 태어난 순간의 하늘의 행성 배치를 통해 성격과 운명을 알아보는 학문입니다. 태양이 지나는 길(황도)을 12개의 구간으로 나눈 것이 바로 12별자리입니다. 각 별자리는 고유한 상징, 지배 행성, 속성을 가지며, 이를 통해 개인의 성격, 연애, 직업적 특성을 파악할 수 있습니다. AI 별자리 운세는 당신의 별자리에 담긴 우주의 메시지를 전달해 드립니다.</p>
        </GuideSection>

        <GuideSection icon={<TarotIcon className="w-10 h-10" />} title="AI 타로 마스터">
            <p>타로 카드는 78장의 카드로 구성된 점술 도구로, 각 카드에 담긴 상징적인 이미지를 통해 질문에 대한 답이나 통찰을 얻는 데 사용됩니다. 메이저 아르카나는 인생의 큰 흐름을, 마이너 아르카나는 일상적인 사건들을 상징합니다. AI 타로 마스터는 당신의 질문에 집중하여 뽑힌 카드의 의미를 해석하고, 현재 상황에 필요한 지혜와 조언을 제공합니다.</p>
        </GuideSection>

        <GuideSection icon={<JuyeokIcon className="w-10 h-10" />} title="AI 주역 전문가">
            <p>주역은 고대 중국에서 유래한 점술이자 철학서로, 64개의 괘(Hexagram)를 통해 우주와 인생의 변화 원리를 설명합니다. 각 괘는 음과 양을 나타내는 6개의 효로 구성되며, 질문을 던지는 시점의 상황과 앞으로의 변화 가능성을 상징합니다. AI 주역 전문가는 당신의 고민에 대해 주역 괘를 뽑고, 그 안에 담긴 깊은 통찰과 지혜를 해석해 드립니다.</p>
        </GuideSection>
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