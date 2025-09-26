import { fileToBase64 } from '../utils/fileUtils';
import type { PhysiognomyResult, PalmistryResult, ImpressionAnalysisResult, AstrologyResult, SajuResult, TarotResult, CardDraw, JuyeokReading, JuyeokResult, Hexagram, YukhyoResult, DailyTarotResult, FortuneImageResult, FaceStretchResult } from '../types';

/**
 * 범용 분석 함수. 프론트엔드의 모든 요청을 백엔드 API 라우트로 보냅니다.
 * @param type 분석 유형 (예: 'face', 'palm')
 * @param payload 분석에 필요한 데이터
 * @returns 분석 결과 Promise
 */
async function analyze<T>(type: string, payload: any): Promise<T> {
    try {
        if (['face', 'palm', 'impression', 'face-stretch'].includes(type) && payload.data) {
            console.log(`📤 [geminiService] Sending '${type}' request. Image base64 length: ${payload.data.length}`);
        }

        const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ type, payload }),
        });
        
        console.log(`📥 [geminiService] Server response status for type '${type}':`, response.status);

        if (!response.ok) {
            const errorData = await response.json();
            console.error('❌ [geminiService] API Error Response Body:', errorData);
            let userMessage = '분석 중 서버에서 오류가 발생했습니다.';
            const details = errorData.details || '';

            if (details.includes('SAFETY')) {
                userMessage = '이미지 또는 요청 내용이 안전 정책에 위배되어 분석할 수 없습니다. 다른 콘텐츠를 이용해주세요.';
            } else if (details.toLowerCase().includes('invalid')) {
                userMessage = '요청 데이터가 올바르지 않습니다. 페이지를 새로고침하고 다시 시도해주세요.';
            } else if (response.status === 500) {
                 userMessage = '서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
            } else {
                 userMessage = errorData.error || userMessage;
            }
            throw new Error(userMessage);
        }

        return await response.json() as T;
    } catch (error) {
        console.error(`❌ [geminiService] Network or parsing error during '${type}' analysis:`, error);
        // If it's not a custom error from above, create a generic network error message.
        if (error instanceof Error && !error.message.startsWith('분석 중') && !error.message.startsWith('이미지') && !error.message.startsWith('요청') && !error.message.startsWith('서버')) {
            throw new Error('서버와 통신할 수 없습니다. 네트워크 연결을 확인해주세요.');
        }
        throw error;
    }
}

export const analyzeFace = async (imageFile: File): Promise<PhysiognomyResult> => {
  const data = await fileToBase64(imageFile);
  const mimeType = imageFile.type;
  return analyze<PhysiognomyResult>('face', { data, mimeType });
};

export const analyzePalm = async (imageFile: File): Promise<PalmistryResult> => {
  const data = await fileToBase64(imageFile);
  const mimeType = imageFile.type;
  return analyze<PalmistryResult>('palm', { data, mimeType });
};

export const analyzeImpression = async (imageFile: File): Promise<ImpressionAnalysisResult> => {
  const data = await fileToBase64(imageFile);
  const mimeType = imageFile.type;
  return analyze<ImpressionAnalysisResult>('impression', { data, mimeType });
};

export const stretchFace = async (imageFile: File): Promise<FaceStretchResult> => {
  const data = await fileToBase64(imageFile);
  const mimeType = imageFile.type;
  return analyze<FaceStretchResult>('face-stretch', { data, mimeType });
};

export const analyzeAstrology = async (birthDate: string): Promise<AstrologyResult> => {
    return analyze<AstrologyResult>('astrology', { birthDate });
};

export const analyzeSaju = async (birthDate: string, birthTime: string): Promise<SajuResult> => {
    return analyze<SajuResult>('saju', { birthDate, birthTime });
};

export const analyzeTarotReading = async (question: string, cards: CardDraw[]): Promise<TarotResult> => {
    return analyze<TarotResult>('tarot', { question, cards });
};

export const analyzeJuyeok = async (question: string, reading: JuyeokReading): Promise<JuyeokResult> => {
    return analyze<JuyeokResult>('juyeok', { question, reading });
};

export const analyzeYukhyo = async (question: string): Promise<YukhyoResult> => {
  return analyze<YukhyoResult>('yukhyo', { question });
};

export const analyzeDailyTarot = async (card: CardDraw): Promise<DailyTarotResult> => {
    return analyze<DailyTarotResult>('daily-tarot', { card });
};

export const generateFortuneImage = async (fortuneText: string): Promise<FortuneImageResult> => {
    return analyze<FortuneImageResult>('daily-fortune-image', { fortuneText });
};