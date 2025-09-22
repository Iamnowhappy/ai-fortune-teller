import React from 'react';
import { HomeIcon } from './icons';

interface PageProps {
  onBack: () => void;
}

export const TermsOfServicePage: React.FC<PageProps> = ({ onBack }) => {
  return (
    <div className="w-full max-w-4xl mx-auto py-10 animate-fade-in">
      <header className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold font-display tracking-wider text-white">
          이용약관
        </h1>
      </header>
      
      <div className="space-y-6 bg-slate-800/50 border border-slate-700 rounded-2xl p-6 sm:p-10 text-slate-300 leading-relaxed text-sm">
        <p className="font-bold">최종 수정일: 2024년 7월 25일</p>

        <section>
            <h2 className="text-xl font-bold text-cyan-300 mb-2">제1조 (목적)</h2>
            <p>본 약관은 AI 운세 시리즈(이하 '서비스')가 제공하는 모든 서비스의 이용 조건 및 절차, 회원과 회사 간의 권리, 의무 및 책임 사항, 기타 필요한 사항을 규정함을 목적으로 합니다.</p>
        </section>

        <section>
            <h2 className="text-xl font-bold text-cyan-300 mb-2">제2조 (용어의 정의)</h2>
            <p>본 약관에서 사용하는 용어의 정의는 다음과 같습니다.<br/>'서비스'라 함은 구현되는 단말기(PC, 모바일, 태블릿 PC 등의 각종 유무선 장치를 포함)와 상관없이 '이용자'가 이용할 수 있는 AI 운세 시리즈 및 관련 제반 서비스를 의미합니다.<br/>'이용자'라 함은 '서비스'에 접속하여 본 약관에 따라 '서비스'가 제공하는 콘텐츠 및 제반 서비스를 이용하는 고객을 말합니다.</p>
        </section>

        <section>
            <h2 className="text-xl font-bold text-cyan-300 mb-2">제3조 (서비스의 제공 및 변경)</h2>
            <p>1. 서비스는 다음과 같은 업무를 수행합니다.<br/> - AI 기술을 활용한 운세, 관상, 손금 등 분석 정보 제공<br/> - 기타 서비스가 자체 개발하거나 다른 회사와의 협력 계약 등을 통해 이용자에게 제공하는 일체의 서비스</p>
            <p>2. 서비스는 기술적 사양의 변경 등의 경우에는 장차 체결되는 계약에 의해 제공할 서비스의 내용을 변경할 수 있습니다.</p>
        </section>

        <section>
            <h2 className="text-xl font-bold text-cyan-300 mb-2">제4조 (서비스의 중단)</h2>
            <p>서비스는 컴퓨터 등 정보통신설비의 보수점검, 교체 및 고장, 통신의 두절 등의 사유가 발생한 경우에는 서비스의 제공을 일시적으로 중단할 수 있습니다.</p>
        </section>
        
        <section>
            <h2 className="text-xl font-bold text-cyan-300 mb-2">제5조 (이용자의 의무)</h2>
            <p>이용자는 다음 행위를 하여서는 안 됩니다.<br/> - 타인의 정보 도용<br/> - 서비스가 게시한 정보의 변경<br/> - 서비스의 운영을 방해할 수 있는 모든 행위<br/> - 기타 불법적이거나 부당한 행위</p>
        </section>

        <section>
            <h2 className="text-xl font-bold text-cyan-300 mb-2">제6조 (면책조항)</h2>
            <p>1. 서비스에서 제공되는 모든 정보와 분석 결과는 오락 및 참고 목적으로만 제공됩니다. 서비스는 제공된 정보의 정확성이나 신뢰성에 대해 어떠한 보증도 하지 않으며, 이를 이용한 어떠한 결정이나 행동에 대해서도 책임지지 않습니다.</p>
            <p>2. 서비스는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다.</p>
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
