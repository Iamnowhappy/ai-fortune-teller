

import React from 'react';
import { loaderMessages } from '../utils/loaderMessages';

// FIX: Added optional 'messages' prop to allow passing custom messages and fix type errors.
interface LoaderProps {
    type?: string;
    messages?: string[];
}

export const Loader: React.FC<LoaderProps> = ({ type = 'default', messages: customMessages }) => {
    const messages = customMessages || loaderMessages[type] || loaderMessages.default;
    const [message, setMessage] = React.useState(messages[0]);
    
    React.useEffect(() => {
        let index = 0;
        const intervalId = setInterval(() => {
            index = (index + 1) % messages.length;
            setMessage(messages[index]);
        }, 2500);

        return () => clearInterval(intervalId);
    }, [messages]);


  return (
    <div className="flex flex-col items-center justify-center gap-6 text-center">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-cyan-400"></div>
      <h2 className="text-2xl font-semibold text-white">AI가 분석 중입니다</h2>
      <p className="text-slate-400 text-lg transition-opacity duration-500">{message}</p>
    </div>
  );
};
