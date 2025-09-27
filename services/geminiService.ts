import { compressImage, fileToBase64 } from '../utils/imageUtils';
import type { PhysiognomyResult, PalmistryResult, ImpressionAnalysisResult, AstrologyResult, SajuResult, TarotResult, CardDraw, JuyeokReading, JuyeokResult, Hexagram, YukhyoResult, DailyTarotResult, FaceStretchResult } from '../types';
import { API_BASE_URL } from '../utils/apiConfig';

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

        const response = await fetch(`${API_BASE_URL}/api/analyze`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ type, payload }),
        });
        
        console.log(`📥 [geminiService] Server response status for type '${type}':`, response.status);

        if (!response.ok) {
            let errorData;
            try {
                errorData = await response.json();
            } catch (e) {
                const genericMessage = `서버에서 문제가 발생했습니다. (오류 코드: ${response.status})`;
                throw new Error(genericMessage);
            }
            
            console.error('❌ [geminiService] API Error Response Body:', errorData);
            let userMessage = errorData.error || '분석 중 서버에서 알 수 없는 오류가 발생했습니다.';
            const details = errorData.details || '';

            // Generate more specific user-friendly messages
            if (details.includes('SAFETY')) {
                userMessage = '이미지 또는 요청 내용이 안전 정책에 위배되어 분석할 수 없습니다. 다른 콘텐츠를 이용해주세요.';
            } else if (response.status === 400 || details.toLowerCase().includes('invalid')) {
                userMessage = '요청 데이터가 올바르지 않습니다. 페이지를 새로고침하고 다시 시도해주세요.';
            } else if (response.status === 413) {
                userMessage = '업로드한 파일의 용량이 너무 큽니다. 10MB 이하의 이미지를 사용해주세요.';
            } else if (response.status === 429) {
                userMessage = '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.';
            } else if (response.status >= 500) {
                 userMessage = '서버에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.';
                 if (details.includes("AI response was not valid JSON")) {
                    userMessage = 'AI 모델로부터 유효한 응답을 받지 못했습니다. 다시 시도하면 해결될 수 있습니다.';
                 } else if (details.toLowerCase().includes('timeout')) {
                    userMessage = '분석 시간이 초과되었습니다. 네트워크 상태를 확인하거나 잠시 후 다시 시도해주세요.';
                 }
            }
            throw new Error(userMessage);
        }
        
        try {
            return await response.json() as T;
        } catch (parseError) {
            console.error(`❌ [geminiService] Failed to parse successful response for '${type}':`, parseError);
            throw new Error('서버로부터 유효하지 않은 형식의 응답을 받았습니다.');
        }

    } catch (error) {
        console.error(`❌ [geminiService] Network or parsing error during '${type}' analysis:`, error);
        if (error instanceof TypeError && error.message.toLowerCase().includes('failed to fetch')) {
             throw new Error('서버와 통신할 수 없습니다. 네트워크 연결을 확인하시거나, 광고 차단 프로그램(Ad Blocker)을 비활성화한 후 다시 시도해주세요.');
        }
        // Re-throw custom errors from the !response.ok block, or JSON parsing errors
        throw error;
    }
}


export const analyzeFace = async (imageFile: File): Promise<PhysiognomyResult> => {
  const compressedFile = await compressImage(imageFile);
  const data = await fileToBase64(compressedFile);
  const mimeType = compressedFile.type;
  return analyze<PhysiognomyResult>('face', { data, mimeType });
};

export const analyzePalm = async (imageFile: File): Promise<PalmistryResult> => {
  const compressedFile = await compressImage(imageFile);
  const data = await fileToBase64(compressedFile);
  const mimeType = compressedFile.type;
  return analyze<PalmistryResult>('palm', { data, mimeType });
};

export const analyzeImpression = async (imageFile: File): Promise<ImpressionAnalysisResult> => {
  const compressedFile = await compressImage(imageFile);
  const data = await fileToBase64(compressedFile);
  const mimeType = compressedFile.type;
  return analyze<ImpressionAnalysisResult>('impression', { data, mimeType });
};

export const stretchFace = async (imageFile: File): Promise<FaceStretchResult> => {
  const compressedFile = await compressImage(imageFile);
  const data = await fileToBase64(compressedFile);
  const mimeType = compressedFile.type;
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