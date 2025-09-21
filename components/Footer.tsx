import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="text-center py-6 border-t border-slate-700/50 mt-12">
      <div className="w-full max-w-2xl mx-auto mb-6 p-4 bg-slate-800 rounded-lg text-slate-500 text-center" aria-label="Advertisement">
        광고 영역 (AdSense Placement)
      </div>
      <p className="text-sm text-slate-500">
        본 서비스는 재미를 위해 제공되며, 과학적 근거가 없습니다. 결과는 참고용으로만 활용해주세요.
      </p>
      <p className="text-sm text-slate-600 mt-1">
        © 2024 AI Face Reader. All Rights Reserved.
      </p>
    </footer>
  );
};