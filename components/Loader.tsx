
import React from 'react';

interface LoaderProps {
    messages?: string[];
}

export const Loader: React.FC<LoaderProps> = ({ messages: customMessages }) => {
    const defaultMessages = [
        "얼굴의 기운을 읽고 있습니다...",
        "운명의 흐름을 분석하는 중...",
        "이목구비의 조화를 살피고 있습니다...",
        "잠재된 가능성을 탐색 중입니다...",
        "곧 분석 결과가 나타납니다."
    ];

    const messages = customMessages || defaultMessages;
    const [message, setMessage] = React.useState(messages[0]);
    
    React.useEffect(() => {
        let index = 0;
        const intervalId = setInterval(() => {
            index = (index + 1) % messages.length;
            setMessage(messages[index]);
        }, 2500);

        return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [messages]);


  return (
    <div className="flex flex-col items-center justify-center gap-6 text-center">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-cyan-400"></div>
      <h2 className="text-2xl font-semibold text-white">AI가 분석 중입니다</h2>
      <p className="text-slate-400 text-lg transition-opacity duration-500">{message}</p>
    </div>
  );
};
