import React from 'react';
import { HomeIcon } from './icons';

interface PageProps {
  onBack: () => void;
}

export const PrivacyPolicyPage: React.FC<PageProps> = ({ onBack }) => {
  return (
    <div className="w-full max-w-4xl mx-auto py-10 animate-fade-in">
      <header className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold font-display tracking-wider text-white">
          개인정보처리방침
        </h1>
      </header>
      
      <div className="space-y-6 bg-slate-800/50 border border-slate-700 rounded-2xl p-6 sm:p-10 text-slate-300 leading-relaxed text-sm">
        <p className="font-bold">최종 수정일: 2024년 7월 25일</p>

        <p>AI 운세 시리즈(이하 '서비스')는 사용자의 개인정보를 중요시하며, 정보통신망 이용촉진 및 정보보호에 관한 법률을 준수하고 있습니다. 본 개인정보처리방침을 통해 사용자가 제공하는 개인정보가 어떠한 용도와 방식으로 이용되고 있으며, 개인정보보호를 위해 어떠한 조치가 취해지고 있는지 알려드립니다.</p>

        <section>
          <h2 className="text-xl font-bold text-cyan-300 mb-2">1. 수집하는 개인정보의 항목 및 수집 방법</h2>
          <p>본 서비스는 별도의 회원가입 절차 없이 대부분의 콘텐츠에 자유롭게 접근할 수 있습니다. 일부 특정 서비스 이용 시 아래와 같은 정보들이 수집될 수 있습니다.</p>
          <ul className="list-disc list-inside mt-2 pl-4 space-y-1">
            <li>수집 항목 (서비스 이용 시): 얼굴 및 손금 이미지, 생년월일시, 질문 내용</li>
            <li>수집 방법: 사용자가 서비스 내에서 자발적으로 입력 및 업로드</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-cyan-300 mb-2">2. 개인정보의 수집 및 이용 목적</h2>
          <p>서비스는 수집한 개인정보를 다음의 목적으로 활용합니다.</p>
          <ul className="list-disc list-inside mt-2 pl-4 space-y-1">
            <li>AI 분석 결과 제공: 사용자가 요청한 관상, 손금, 사주 등의 분석 결과를 생성하고 제공하기 위한 목적으로만 사용됩니다.</li>
            <li>입력된 정보(이미지, 생년월일 등)는 분석 결과를 생성하는 즉시 서버에서 삭제되며, 별도로 저장되지 않습니다.</li>
          </ul>
        </section>

        <section>
            <h2 className="text-xl font-bold text-cyan-300 mb-2">3. 개인정보의 보유 및 이용기간</h2>
            <p>사용자가 서비스 이용을 위해 입력한 정보는 AI 분석 모델에 일회성으로 전달되며, 분석 완료 후 즉시 파기되는 것을 원칙으로 합니다. 서비스는 사용자의 정보를 서버에 저장하지 않습니다. 단, 사용자가 '결과 저장' 기능을 통해 명시적으로 저장한 결과는 사용자의 브라우저(로컬 스토리지)에만 저장되며, 사용자가 직접 삭제하거나 브라우저 데이터를 초기화하기 전까지 유지됩니다.</p>
        </section>

        <section>
            <h2 className="text-xl font-bold text-cyan-300 mb-2">4. 개인정보의 제3자 제공</h2>
            <p>서비스는 사용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만, 법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우는 예외로 합니다.</p>
        </section>

        <section>
            <h2 className="text-xl font-bold text-cyan-300 mb-2">5. 광고 서비스</h2>
            <p>본 서비스는 제3자 광고 서비스인 Google AdSense를 사용하고 있습니다. 이로 인해 광고 제공업체는 사용자의 관심사에 맞는 광고를 제공하기 위해 쿠키를 사용할 수 있습니다. 사용자는 브라우저 설정을 통해 쿠키 저장을 거부할 수 있습니다.</p>
        </section>

        <section>
            <h2 className="text-xl font-bold text-cyan-300 mb-2">6. 개인정보에 관한 민원서비스</h2>
            <p>개인정보 처리에 관한 불만처리 및 피해구제 등을 위하여 아래와 같이 관련 부서 및 개인정보 보호책임자를 지정하고 있습니다. (문의: your-email@example.com)</p>
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
