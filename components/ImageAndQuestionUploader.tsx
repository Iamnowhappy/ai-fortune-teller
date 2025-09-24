import React, { useRef } from 'react';
import { UploadIcon } from './icons';

interface ImageAndQuestionUploaderProps {
  onImageSelect: (file: File) => void;
  imageUrl: string | null;
  question: string;
  onQuestionChange: (question: string) => void;
  onAnalyze: () => void;
  hasImage: boolean;
  buttonText?: string;
}

export const ImageAndQuestionUploader: React.FC<ImageAndQuestionUploaderProps> = ({
  onImageSelect,
  imageUrl,
  question,
  onQuestionChange,
  onAnalyze,
  hasImage,
  buttonText = '분석하기',
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onImageSelect(event.target.files[0]);
    }
  };

  const handleUploadClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="w-full max-w-md flex flex-col items-center gap-8 p-6 bg-slate-800/50 rounded-2xl shadow-lg border border-slate-700">
      <div
        onClick={handleUploadClick}
        className="w-full h-64 sm:h-80 bg-slate-700/50 rounded-lg border-2 border-dashed border-slate-600 flex items-center justify-center cursor-pointer transition-all duration-300 hover:border-cyan-400 hover:bg-slate-700"
      >
        <input
          type="file"
          ref={inputRef}
          onChange={handleFileChange}
          accept="image/png, image/jpeg, image/webp"
          className="hidden"
        />
        {imageUrl ? (
          <img src={imageUrl} alt="Uploaded preview" className="w-full h-full object-contain rounded-md p-1" />
        ) : (
          <div className="text-center text-slate-400 flex flex-col items-center gap-2">
            <UploadIcon className="w-12 h-12" />
            <span className="font-semibold">사진을 업로드하세요</span>
            <span className="text-sm">클릭 또는 드래그 앤 드롭</span>
          </div>
        )}
      </div>

      <div className="w-full flex flex-col gap-4">
          <label htmlFor="yukhyo-question" className="block text-lg font-medium text-slate-300">
              어떤 점이 궁금하신가요?
          </label>
          <textarea
              id="yukhyo-question"
              value={question}
              onChange={(e) => onQuestionChange(e.target.value)}
              placeholder="예) 이번 시험에 합격할 수 있을까요?"
              className="w-full p-3 h-32 bg-slate-700/50 border border-slate-600 rounded-lg text-white resize-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              aria-label="육효 질문"
          />
      </div>

      <button
        onClick={onAnalyze}
        disabled={!hasImage || !question.trim()}
        className="w-full py-3 px-6 bg-cyan-500 text-slate-900 font-bold text-lg rounded-lg shadow-md transition-all duration-300 hover:bg-cyan-400 hover:shadow-cyan-400/30 disabled:bg-slate-600 disabled:text-slate-400 disabled:cursor-not-allowed disabled:shadow-none"
      >
        {buttonText}
      </button>
    </div>
  );
};