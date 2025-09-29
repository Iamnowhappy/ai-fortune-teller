import React from 'react';
import { AdSenseUnit } from './AdSenseUnit';

type Page = 'home' | 'face-reader' | 'palm-reader' | 'impression-analyzer' | 'astrology-reader' | 'saju-analyzer' | 'tarot-reader' | 'juyeok-reader' | 'yukhyo-analyzer' | 'dream-interpreter' | 'naming-services' | 'newborn-namer' | 'business-namer' | 'personal-name-analyzer' | 'business-name-analyzer' | 'renamer' | 'saved-results' | 'about' | 'privacy' | 'terms' | 'guide' | 'changelog';

interface FooterProps {
  onNavigate: (page: Page) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="text-center py-6 border-t border-slate-700/50 mt-12">
      {/* 
        !!! 중요: 아래 "YOUR_AD_SLOT_ID"를 
        실제 Google AdSense 광고 슬롯 ID로 교체해야 광고가 표시됩니다. 
      */}
      <AdSenseUnit adSlot="YOUR_AD_SLOT_ID" />

      <div className="my-6 flex justify-center items-center gap-4 sm:gap-6 text-sm text-slate-400 flex-wrap">
        <button onClick={() => onNavigate('about')} className="hover:text-cyan-400 transition-colors">서비스 소개</button>
        <span className="text-slate-600">|</span>
        <button onClick={() => onNavigate('guide')} className="hover:text-cyan-400 transition-colors">AI 운세 가이드</button>
        <span className="text-slate-600">|</span>
        <button onClick={() => onNavigate('terms')} className="hover:text-cyan-400 transition-colors">이용약관</button>
        <span className="text-slate-600">|</span>
        <button onClick={() => onNavigate('privacy')} className="hover:text-cyan-400 transition-colors">개인정보처리방침</button>
        <span className="text-slate-600">|</span>
        <button onClick={() => onNavigate('changelog')} className="hover:text-cyan-400 transition-colors">업데이트 기록</button>
      </div>
      
      <p className="text-sm text-slate-500">
        본 서비스는 재미를 위해 제공되며, 과학적 근거가 없습니다. 결과는 참고용으로만 활용해주세요.
      </p>
      <p className="text-sm text-slate-600 mt-1">
        © 2024 AI Fortune Teller v1.2. All Rights Reserved.
      </p>
    </footer>
  );
};