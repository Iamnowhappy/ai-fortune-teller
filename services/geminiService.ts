

import { fileToBase64 } from '../utils/fileUtils';
import type { PhysiognomyResult, PalmistryResult, ImpressionAnalysisResult, AstrologyResult, SajuResult, TarotResult, CardDraw, JuyeokReading, JuyeokResult, Hexagram, YukhyoResult, DailyTarotResult, FortuneImageResult } from '../types';

/**
 * 범용 분석 함수. 프론트엔드의 모든 요청을 백엔드 API 라우트로 보냅니다.
 * @param type 분석 유형 (예: 'face', 'palm')
 * @param payload 분석에 필요한 데이터
 * @returns 분석 결과 Promise
 */
async function analyze<T>(type: string, payload: any): Promise<T> {
    try {
        const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ type, payload }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('API Error Response:', errorData);
            throw new Error(errorData.error || 'API 요청에 실패했습니다.');
        }

        return await response.json() as T;
    } catch (error) {
        console.error(`'${type}' 분석 중 네트워크 또는 파싱 오류 발생:`, error);
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