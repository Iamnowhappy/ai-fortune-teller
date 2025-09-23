import React, { useState } from 'react';
import { ShareIcon, TwitterIcon, KakaoIcon, LinkIcon } from './icons';

interface ShareButtonsProps {
    shareText: string;
}

export const ShareButtons: React.FC<ShareButtonsProps> = ({ shareText }) => {
    type CopyState = 'idle' | 'copied' | 'failed';
    const [copyState, setCopyState] = useState<CopyState>('idle');
    const shareUrl = typeof window !== 'undefined' ? window.location.href : "";

    const handleNativeShare = () => {
        if (navigator.share) {
            navigator.share({
                title: 'AI 운세 시리즈 분석 결과',
                text: shareText,
                url: shareUrl,
            }).catch(console.error);
        } else {
            alert('이 브라우저에서는 공유 기능을 지원하지 않습니다. 링크 복사 기능을 이용해주세요.');
        }
    };

    const handleTwitterShare = () => {
        const text = `🔮 AI 운세 시리즈 결과 🔮\n\n${shareText}`;
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`
        );
    };

    const handleKakaoShare = () => {
        alert("카카오 공유 기능은 현재 준비 중입니다. 전용 앱에서 곧 만나보실 수 있습니다.");
    };

    const handleCopyLink = () => {
        if (copyState !== 'idle') return; // Prevent multiple clicks
        
        navigator.clipboard.writeText(shareUrl).then(() => {
            setCopyState('copied');
            setTimeout(() => setCopyState('idle'), 2000);
        }, () => {
            setCopyState('failed');
            setTimeout(() => setCopyState('idle'), 2000);
        });
    };
    
    const getCopyButtonProps = () => {
        switch(copyState) {
            case 'copied':
                return {
                    text: '복사됨!',
                    className: 'bg-green-500 text-slate-900 cursor-not-allowed',
                    disabled: true,
                };
            case 'failed':
                return {
                    text: '복사 실패',
                    className: 'bg-red-500 text-white cursor-not-allowed',
                    disabled: true,
                };
            case 'idle':
            default:
                return {
                    text: '링크 복사',
                    className: 'bg-slate-600 text-white hover:bg-slate-500',
                    disabled: false,
                };
        }
    }

    const copyButtonProps = getCopyButtonProps();

    return (
        <div className="mt-8 py-6 border-t border-b border-slate-700/50">
            <h3 className="text-center text-lg font-bold text-slate-300 mb-4">결과 공유하기</h3>
            <div className="flex flex-wrap justify-center gap-3">
                <button
                    onClick={handleNativeShare}
                    className="flex items-center gap-2 py-2 px-4 bg-slate-700 text-white font-bold rounded-lg shadow-md transition-all duration-300 hover:bg-slate-600"
                >
                    <ShareIcon className="w-5 h-5" />
                    <span>공유</span>
                </button>
                <button
                    onClick={handleTwitterShare}
                    className="flex items-center gap-2 py-2 px-4 bg-[#1DA1F2] text-white font-bold rounded-lg shadow-md transition-all duration-300 hover:bg-[#1a91da]"
                >
                    <TwitterIcon className="w-5 h-5" />
                    <span>트위터</span>
                </button>
                <button
                    onClick={handleKakaoShare}
                    className="flex items-center gap-2 py-2 px-4 bg-[#FEE500] text-[#3C1E1E] font-bold rounded-lg shadow-md transition-all duration-300 hover:bg-[#fddc00]"
                >
                    <KakaoIcon className="w-5 h-5" />
                    <span>카카오톡</span>
                </button>
                <button
                    onClick={handleCopyLink}
                    disabled={copyButtonProps.disabled}
                    className={`flex items-center gap-2 py-2 px-4 font-bold rounded-lg shadow-md transition-all duration-300 ${copyButtonProps.className}`}
                >
                    <LinkIcon className="w-5 h-5" />
                    <span>{copyButtonProps.text}</span>
                </button>
            </div>
        </div>
    );
};
