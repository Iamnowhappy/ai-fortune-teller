import React from 'react';
import { HomeIcon } from './icons';

interface PageProps {
  onBack: () => void;
}

const changelogData = [
    {
        version: "v1.2.0",
        date: "2024년 7월 28일",
        changes: {
            "🚀 신규 기능": [
                "홈페이지 서비스 카드에 마우스를 올리면 부드럽게 확대되고 아이콘이 회전하는 인터랙티브 애니메이션을 추가했습니다.",
                "모든 분석 결과 텍스트에 AI가 실시간으로 답변하는 듯한 타이핑 애니메이션 효과를 적용하여 몰입감을 높였습니다.",
            ],
            "✨ 개선": [
                "홈페이지의 각 서비스 카드에 고유한 색상을 부여하여 시각적 구별성을 강화하고, 더 직관적으로 서비스를 선택할 수 있도록 개선했습니다.",
            ],
            "🐛 버그 수정": [
                "특정 환경에서 빌드가 실패하던 Vercel 배포 오류를 수정했습니다.",
                "누락되었던 '오늘의 운세' 생성 로직을 추가하여 앱이 정상적으로 동작하도록 수정했습니다.",
            ]
        }
    },
    {
        version: "v1.1.0",
        date: "2024년 7월 27일",
        changes: {
            "🚀 신규 기능": [
                "AI 타로 마스터 기능이 대폭 강화되었습니다. 이제 1, 3, 5장 카드 중 선택하여 리딩을 받을 수 있으며, 각 카드의 위치적 의미(과거, 현재, 미래 등)까지 고려한 깊이 있는 분석을 제공합니다.",
                "타로 리딩 시, 각 카드에 개인적인 상징이 담긴 이미지를 직접 업로드할 수 있는 기능이 추가되었습니다. AI가 업로드된 이미지를 함께 분석하여 더욱 개인화된 해석을 제공합니다.",
            ],
            "✨ 개선": [
                "홈페이지의 '오늘의 운세'가 텍스트뿐만 아니라, 운세의 주제를 상징하는 아름다운 AI 생성 이미지와 함께 표시되도록 개선되었습니다.",
                "결과 공유 기능이 강화되어 트위터, 링크 복사 등 더 편리한 방법으로 친구들과 운세 결과를 나눌 수 있습니다.",
                "SEO 및 소셜 공유를 위해 홈페이지의 제목과 설명이 '오늘의 운세'에 맞춰 동적으로 변경되도록 개선되었습니다.",
            ]
        }
    }
];

export const ChangelogPage: React.FC<PageProps> = ({ onBack }) => {
  return (
    <div className="w-full max-w-4xl mx-auto py-10 animate-fade-in">
      <header className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold font-display tracking-wider text-white">
          업데이트 기록
        </h1>
        <p className="mt-3 text-lg text-slate-400">
          AI 운세 시리즈의 새로운 소식을 확인하세요.
        </p>
      </header>

      <div className="space-y-12">
        {changelogData.map(log => (
            <section key={log.version} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 sm:p-8">
                <div className="flex items-baseline gap-4 mb-4">
                    <h2 className="text-3xl font-bold text-cyan-300 font-display">{log.version}</h2>
                    <p className="text-slate-400">{log.date}</p>
                </div>
                <div className="space-y-4">
                    {Object.entries(log.changes).map(([category, items]) => (
                        <div key={category}>
                            <h3 className="text-xl font-semibold text-white mb-2">{category}</h3>
                            <ul className="list-disc list-inside space-y-1 text-slate-300 pl-2">
                                {(items as string[]).map((item, index) => <li key={index}>{item}</li>)}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>
        ))}
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
