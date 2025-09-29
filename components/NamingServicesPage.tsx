import React from 'react';
import { Header } from './Header';
import { NameGeneratorIcon, BusinessIcon } from './icons';
import { motion } from 'framer-motion';

type Page = 'home' | 'newborn-namer' | 'business-namer' | 'personal-name-analyzer' | 'business-name-analyzer' | 'renamer';
interface NamingServicesPageProps {
  onNavigate: (page: Page) => void;
  onBack: () => void;
}

const ServiceCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    description: string;
    onClick: () => void;
}> = ({ icon, title, description, onClick }) => (
    <motion.div
        onClick={onClick}
        className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6 flex flex-col items-center gap-4 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-cyan-400 cursor-pointer group shadow-lg"
        role="button"
        tabIndex={0}
        aria-label={`${title} 실행하기`}
        onKeyDown={(e) => e.key === 'Enter' && onClick()}
        whileHover={{ y: -5 }}
    >
        <div className="text-cyan-400 transition-transform duration-500 group-hover:scale-110">
            {icon}
        </div>
        <h3 className="text-2xl font-bold text-white">{title}</h3>
        <p className="text-slate-300 text-center">{description}</p>
    </motion.div>
);

export const NamingServicesPage: React.FC<NamingServicesPageProps> = ({ onNavigate, onBack }) => {
    return (
        <>
            <Header
                icon={<NameGeneratorIcon className="w-10 h-10 text-cyan-400" />}
                title="AI 작명 센터"
                description="이름에 대한 모든 것을 AI 전문가가 해결해 드립니다."
                onBack={onBack}
            />
            <main className="flex-grow flex flex-col items-center justify-center text-center py-10 w-full">
                <div className="w-full max-w-5xl space-y-12">
                    {/* 작명 섹션 */}
                    <div>
                        <h2 className="text-3xl font-bold font-display text-cyan-300 mb-6">작명 (Naming)</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <ServiceCard
                                icon={<NameGeneratorIcon className="w-16 h-16" />}
                                title="신생아 작명"
                                description="사주에 맞춰 아기의 미래를 밝혀줄 최고의 이름을 추천받으세요."
                                onClick={() => onNavigate('newborn-namer')}
                            />
                            <ServiceCard
                                icon={<BusinessIcon className="w-16 h-16" />}
                                title="매출상승 상호명"
                                description="사업의 번영을 기원하는 상호명, AI가 작명해 드립니다."
                                onClick={() => onNavigate('business-namer')}
                            />
                        </div>
                    </div>

                    {/* 이름분석 섹션 */}
                    <div>
                        <h2 className="text-3xl font-bold font-display text-cyan-300 mb-6">이름분석 (Analysis)</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                             <ServiceCard
                                icon={<NameGeneratorIcon className="w-16 h-16" />}
                                title="개인 이름 분석"
                                description="현재 이름이 사주와 얼마나 잘 맞는지 심층 분석합니다."
                                onClick={() => onNavigate('personal-name-analyzer')}
                            />
                             <ServiceCard
                                icon={<BusinessIcon className="w-16 h-16" />}
                                title="상호명 분석"
                                description="현재 상호의 운과 브랜드 가치를 종합적으로 진단합니다."
                                onClick={() => onNavigate('business-name-analyzer')}
                            />
                             <ServiceCard
                                icon={<NameGeneratorIcon className="w-16 h-16" />}
                                title="개명 추천"
                                description="새로운 시작을 위해, 사주를 보완하는 새 이름을 추천받으세요."
                                onClick={() => onNavigate('renamer')}
                            />
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};
