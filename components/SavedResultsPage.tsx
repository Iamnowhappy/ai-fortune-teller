import React, { useState, useEffect } from 'react';
import type { SavedResult, CardDraw, JuyeokReading } from '../types';
import { getSavedResults, deleteResult } from '../utils/storage';
import { Header } from './Header';
import { ResultDisplay } from './ResultDisplay';
import { PalmResultDisplay } from './PalmResultDisplay';
import { ImpressionResultDisplay } from './ImpressionResultDisplay';
import { AstrologyResultDisplay } from './AstrologyResultDisplay';
import { SajuResultDisplay } from './SajuResultDisplay';
import { TarotResultDisplay } from './TarotResultDisplay';
import { JuyeokResultDisplay } from './JuyeokResultDisplay';
import { YukhyoResultDisplay } from './YukhyoResultDisplay';
import { BoxIcon, TrashIcon, HomeIcon } from './icons';

export const SavedResultsPage: React.FC<{ onBack: () => void; }> = ({ onBack: navigateToHome }) => {
  const [savedResults, setSavedResults] = useState<SavedResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<SavedResult | null>(null);

  useEffect(() => {
    setSavedResults(getSavedResults());
  }, []);

  const handleDelete = (id: string) => {
    if (window.confirm('정말로 이 결과를 삭제하시겠습니까?')) {
      deleteResult(id);
      setSavedResults(getSavedResults());
    }
  };

  const renderDetailView = () => {
    if (!selectedResult) return null;

    const props = {
      onBack: () => setSelectedResult(null),
      onReset: () => {}, // No-op, not used in saved view
      isSavedView: true,
    };

    switch (selectedResult.type) {
      case 'face-reader':
        return <ResultDisplay result={selectedResult.result} {...props} />;
      case 'palm-reader':
        return <PalmResultDisplay result={selectedResult.result} {...props} />;
      case 'impression-analyzer':
        return <ImpressionResultDisplay result={selectedResult.result} {...props} />;
      case 'astrology-reader':
        return <AstrologyResultDisplay result={selectedResult.result} {...props} />;
      case 'saju-analyzer':
        return <SajuResultDisplay result={selectedResult.result} {...props} />;
      case 'tarot-reader':
        return <TarotResultDisplay result={selectedResult.result} drawnCards={selectedResult.context?.drawnCards as CardDraw[]} {...props} />;
      case 'juyeok-reader':
         return <JuyeokResultDisplay result={selectedResult.result} reading={selectedResult.context?.reading as JuyeokReading} {...props} />;
      case 'yukhyo-analyzer':
        return <YukhyoResultDisplay result={selectedResult.result} {...props} />;
      default:
        return (
          <div className="text-center p-8">
            <p>알 수 없는 결과 타입입니다.</p>
            <button onClick={() => setSelectedResult(null)} className="mt-4 px-4 py-2 bg-slate-600 rounded-lg">목록으로</button>
          </div>
        );
    }
  };

  if (selectedResult) {
    return <main className="flex-grow flex flex-col items-center text-center py-10">{renderDetailView()}</main>;
  }

  return (
    <>
      <Header
        icon={<BoxIcon className="w-10 h-10 text-cyan-400" />}
        title="나의 운세함"
        description="저장된 분석 결과를 다시 확인하고 관리할 수 있습니다."
        onBack={navigateToHome}
      />
      <main className="flex-grow flex flex-col items-center text-center py-10 w-full max-w-4xl mx-auto">
        {savedResults.length > 0 ? (
          <div className="space-y-4 w-full">
            {savedResults.map((item) => (
              <div key={item.id} className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 flex items-center justify-between gap-4">
                <div className="text-left">
                  <p className="font-bold text-white text-lg">{item.typeName}</p>
                  <p className="text-sm text-slate-400">{new Date(item.date).toLocaleString('ko-KR')}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedResult(item)}
                    className="py-2 px-4 bg-cyan-500 text-slate-900 font-bold rounded-lg shadow-md transition-colors duration-300 hover:bg-cyan-400"
                    aria-label={`${item.typeName} 결과 보기`}
                  >
                    보기
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 bg-red-500/20 text-red-400 rounded-lg transition-colors duration-300 hover:bg-red-500/40 hover:text-red-300"
                    aria-label={`${item.typeName} 결과 삭제`}
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-slate-400 text-lg">저장된 결과가 없습니다.</p>
            <p className="text-slate-500 mt-2">분석 결과를 저장하고 나중에 다시 확인해보세요.</p>
          </div>
        )}
      </main>
    </>
  );
};