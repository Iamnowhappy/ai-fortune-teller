import { GoogleGenAI, Type } from "@google/genai";
import type { VercelRequest, VercelResponse } from '@vercel/node';

// --- 모든 스키마 정의를 서버로 이동 ---
// 이 스키마들은 프론트엔드에서 서버로 이동하여 API 호출 로직을 중앙에서 관리합니다.

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    overall_impression: {
      type: Type.STRING,
      description: "사진 속 인물에 대한 전반적인 관상 총평을 2~3문장으로 작성합니다."
    },
    features: {
      type: Type.ARRAY,
      description: "얼굴의 각 부위별 관상 분석 결과입니다.",
      items: {
        type: Type.OBJECT,
        properties: {
          feature: {
            type: Type.STRING,
            description: "분석하는 얼굴 부위의 이름 (예: 눈, 코, 입, 이마, 턱, 귀)."
          },
          shape: {
            type: Type.STRING,
            description: "해당 부위의 구체적인 모양이나 특징에 대한 묘사."
          },
          analysis: {
            type: Type.STRING,
            description: "해당 부위의 특징이 관상학적으로 무엇을 의미하는지에 대한 상세한 설명."
          }
        },
        required: ["feature", "shape", "analysis"]
      }
    }
  },
  required: ["overall_impression", "features"]
};

const palmAnalysisSchema = {
  type: Type.OBJECT,
  properties: {
    overall_analysis: {
      type: Type.STRING,
      description: "사진 속 손금에 대한 전반적인 총평을 2~3문장으로 작성합니다."
    },
    lines: {
      type: Type.ARRAY,
      description: "주요 손금(생명선, 감정선, 두뇌선)에 대한 분석 결과입니다.",
      items: {
        type: Type.OBJECT,
        properties: {
          line_name: {
            type: Type.STRING,
            description: "분석하는 손금의 이름 (예: 생명선, 감정선, 두뇌선)."
          },
          analysis: {
            type: Type.STRING,
            description: "해당 손금이 무엇을 의미하는지에 대한 상세한 설명. 강점과 함께 주의할 점이나 개선할 점을 균형 있게 포함합니다."
          }
        },
        required: ["line_name", "analysis"]
      }
    },
    credibility_score: {
        type: Type.INTEGER,
        description: "이 손금 분석에 대한 신뢰도 점수 (70~95 사이의 정수)."
    },
    credibility_comment: {
        type: Type.STRING,
        description: "손금은 정해진 미래가 아닌 가능성을 보여주는 지표라는 점을 설명하는 짧은 코멘트."
    }
  },
  required: ["overall_analysis", "lines", "credibility_score", "credibility_comment"]
};

const impressionAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        keywords: {
            type: Type.ARRAY,
            description: "사진 속 인물의 첫인상을 가장 잘 나타내는 핵심 키워드 3-4개.",
            items: { type: Type.STRING }
        },
        detailed_analysis: {
            type: Type.STRING,
            description: "사진 속 인물의 표정, 분위기, 스타일 등을 종합하여 다른 사람에게 어떤 첫인상을 주는지 3-4문장으로 상세하게 분석합니다. 긍정적인 측면을 중심으로 서술합니다."
        },
        improvement_tip: {
            type: Type.STRING,
            description: "더 긍정적이고 매력적인 첫인상을 주기 위한 구체적이고 실용적인 팁 한 가지를 제안합니다."
        }
    },
    required: ["keywords", "detailed_analysis", "improvement_tip"]
};

const astrologyAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        zodiac_sign: { type: Type.STRING, description: "생년월일에 해당하는 서양 별자리 이름 (예: 양자리, 황소자리)." },
        ruling_planet: { type: Type.STRING, description: "해당 별자리의 지배 행성 (예: 화성, 금성)." },
        element: { type: Type.STRING, description: "해당 별자리의 4원소 (불, 흙, 공기, 물)." },
        analysis: {
            type: Type.OBJECT,
            properties: {
                personality: { type: Type.STRING, description: "별자리에 따른 성격적 특성, 장점, 단점에 대한 상세 분석." },
                love_life: { type: Type.STRING, description: "연애 스타일 및 관계에서의 특징에 대한 분석." },
                work_career: { type: Type.STRING, description: "직업적 강점 및 추천 진로에 대한 분석." }
            },
            required: ["personality", "love_life", "work_career"]
        }
    },
    required: ["zodiac_sign", "ruling_planet", "element", "analysis"]
};

const sajuAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        four_pillars: {
            type: Type.OBJECT,
            properties: {
                year_pillar: { type: Type.STRING, description: "태어난 해를 나타내는 연주 (예: 갑자(甲子)년)." },
                month_pillar: { type: Type.STRING, description: "태어난 월을 나타내는 월주 (예: 병인(丙寅)월)." },
                day_pillar: { type: Type.STRING, description: "태어난 일을 나타내는 일주 (예: 정묘(丁卯)일)." },
                hour_pillar: { type: Type.STRING, description: "태어난 시간을 나타내는 시주 (예: 무진(戊辰)시). 시간이 없으면 '알 수 없음'으로 표기." }
            },
            required: ["year_pillar", "month_pillar", "day_pillar", "hour_pillar"]
        },
        day_master: { type: Type.STRING, description: "사주의 주체이자 본질을 나타내는 일간 (日干) (예: 갑(甲)목)." },
        overall_analysis: { type: Type.STRING, description: "사주 전체의 구조와 기운을 바탕으로 한 종합적인 분석 및 총평." },
        elemental_analysis: { type: Type.STRING, description: "사주에 나타난 오행(목, 화, 토, 금, 수)의 분포와 균형에 대한 분석." },
        life_advice: { type: Type.STRING, description: "타고난 사주를 바탕으로 삶을 더 나은 방향으로 이끌기 위한 조언." }
    },
    required: ["four_pillars", "day_master", "overall_analysis", "elemental_analysis", "life_advice"]
};

const tarotAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        overall_reading: {
            type: Type.STRING,
            description: "뽑힌 카드 3장을 종합적으로 해석하여 사용자의 질문에 대한 총체적인 답변과 조언을 제공합니다."
        },
        cards: {
            type: Type.ARRAY,
            description: "뽑힌 3장의 카드 각각에 대한 개별 해석입니다.",
            items: {
                type: Type.OBJECT,
                properties: {
                    card_name: { type: Type.STRING, description: "해석하는 카드의 이름 (예: The Fool, Strength)." },
                    orientation: { type: Type.STRING, description: "카드의 방향 ('정방향' 또는 '역방향')." },
                    meaning: { type: Type.STRING, description: "해당 카드가 현재 상황에서 의미하는 바에 대한 상세한 설명." }
                },
                required: ["card_name", "orientation", "meaning"]
            }
        }
    },
    required: ["overall_reading", "cards"]
};

const juyeokAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        present_hexagram_name: { type: Type.STRING, description: "현재 상황을 나타내는 본괘의 이름 (예: 건위천(乾爲天))." },
        changing_hexagram_name: { type: Type.STRING, description: "미래의 변화를 나타내는 변괘의 이름. 변효가 없으면 null." },
        interpretation: { type: Type.STRING, description: "사용자의 질문에 대해 본괘와 변괘가 의미하는 바를 종합적으로 해석한 내용." },
        changing_lines_interpretation: { type: Type.STRING, description: "변화가 일어나는 효(변효)가 구체적으로 어떤 의미를 가지는지에 대한 상세한 설명. 변효가 없으면 null." }
    },
    required: ["present_hexagram_name", "interpretation"]
};

const yukhyoAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        ganji_date: { type: Type.STRING, description: "점을 친 날의 간지 (예: 갑자(甲子)년 병인(丙寅)월 정묘(丁卯)일)." },
        hexagram_name: { type: Type.STRING, description: "뽑힌 괘의 이름." },
        yongsin: { type: Type.STRING, description: "질문의 핵심이 되는 용신(用神)과 그 상태(왕상휴수). 예: '재물(妻財)이 왕(旺)하여...'" },
        lines: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    line_number: { type: Type.INTEGER, description: "효의 위치 (1~6)." },
                    six_relatives: { type: Type.STRING, description: "효에 붙는 육친 (부모, 형제, 자손, 처재, 관귀)." },
                    earthly_branch: { type: Type.STRING, description: "효에 붙는 12지지 (자, 축, 인, 묘...)." },
                    marker: { type: Type.STRING, description: "세(世) 또는 응(應) 표시, 해당 없으면 null." }
                },
                required: ["line_number", "six_relatives", "earthly_branch"]
            }
        },
        overall_interpretation: { type: Type.STRING, description: "용신을 중심으로 괘 전체를 해석하여, 사용자의 질문에 대한 구체적인 길흉과 조언을 제공합니다." }
    },
    required: ["ganji_date", "hexagram_name", "yongsin", "lines", "overall_interpretation"]
};

// --- 서버리스 함수 핸들러 ---
export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { type, payload } = req.body;

        const apiKey = process.env.API_KEY;
        if (!apiKey) {
            console.error("API_KEY environment variable is not set.");
            return res.status(500).json({ error: 'Server configuration error.' });
        }
        const ai = new GoogleGenAI({ apiKey });
        
        let prompt: any;
        let schema: any;
        let contents: any;

        switch (type) {
            case 'face':
                prompt = `당신은 수십 년간 관상을 연구해 온 세계 최고의 관상가입니다. 당신의 임무는 사용자가 제공한 얼굴 사진을 보고, 각 부위별(눈, 코, 입, 이마, 턱, 귀) 특징과 그것이 의미하는 관상학적 해석을 상세하고 긍정적인 방향으로 설명해주는 것입니다. 전문적이고 깊이 있는 분석을 제공하되, 사용자가 쉽게 이해할 수 있도록 친절하고 희망을 주는 말투를 사용하세요. 분석 결과는 반드시 JSON 형식으로 반환해야 합니다.`;
                schema = analysisSchema;
                contents = {
                    parts: [
                        { text: prompt },
                        { inlineData: { mimeType: payload.mimeType, data: payload.data } },
                    ],
                };
                break;
            case 'palm':
                prompt = `당신은 수십 년간 손금을 연구해 온 세계 최고의 손금 전문가입니다. 당신의 임무는 사용자가 제공한 손 사진을 보고, 주요 3대 손금(생명선, 감정선, 두뇌선)의 특징과 그것이 의미하는 바를 상세히 설명하는 것입니다. 각 손금이 의미하는 장점과 함께 주의해야 할 점이나 개선할 점을 균형 있게 설명해주세요. 분석은 현실적이어야 하지만, 사용자가 긍정적인 마음으로 자신의 삶을 개척해나갈 수 있도록 격려하는 톤을 유지해주세요. 마지막으로, 이 분석에 대한 신뢰도 점수(70~95% 사이의 정수)와 함께, 손금은 정해진 미래가 아닌 가능성을 보여주는 지표라는 점을 설명하는 코멘트를 추가해주세요. 분석 결과는 반드시 JSON 형식으로 반환해야 합니다.`;
                schema = palmAnalysisSchema;
                contents = {
                    parts: [
                        { text: prompt },
                        { inlineData: { mimeType: payload.mimeType, data: payload.data } },
                    ],
                };
                break;
            case 'impression':
                prompt = `당신은 사회 심리학 및 인간 인식 분야의 전문가입니다. 당신의 임무는 사용자가 제공한 인물 사진을 보고 그 사람의 첫인상을 분석하는 것입니다. 사진 속 인물의 표정, 분위기, 스타일 등을 종합적으로 고려하여 다른 사람에게 어떤 느낌을 주는지 객관적으로 분석해주세요. 분석은 격려가 되고 긍정적인 방향으로 제공되어야 하지만, 현실적인 조언도 포함해야 합니다. 결과는 반드시 JSON 형식으로 반환해야 하며, 다음 세 가지 요소를 포함해야 합니다: 1. keywords: 첫인상을 가장 잘 나타내는 핵심 키워드 3-4개. 2. detailed_analysis: 첫인상에 대한 상세한 분석 (3-4 문장). 3. improvement_tip: 더 긍정적인 인상을 주기 위한 구체적이고 실용적인 팁 한 가지.`;
                schema = impressionAnalysisSchema;
                contents = {
                    parts: [
                        { text: prompt },
                        { inlineData: { mimeType: payload.mimeType, data: payload.data } },
                    ],
                };
                break;
            case 'astrology':
                prompt = `당신은 세계적으로 유명한 점성술사입니다. 사용자의 생년월일인 ${payload.birthDate}를 기반으로 서양 점성술(별자리) 운세를 분석해주세요. 결과는 반드시 JSON 형식으로 반환해야 합니다. 다음 정보를 포함해주세요: 1. zodiac_sign: 해당하는 별자리. 2. ruling_planet: 지배 행성. 3. element: 4원소 (불, 흙, 공기, 물). 4. analysis: 성격, 연애, 직업에 대한 상세 분석.`;
                schema = astrologyAnalysisSchema;
                contents = prompt;
                break;
            case 'saju':
                prompt = `당신은 수십 년 경력의 사주 명리학 대가입니다. 사용자의 생년월일시인 ${payload.birthDate} ${payload.birthTime}를 기반으로 사주팔자를 분석해주세요. 만약 출생 시간이 '모름'으로 입력되었다면 시주(時柱)는 알 수 없는 것으로 간주하고 분석하세요. 결과는 반드시 JSON 형식으로 반환해야 합니다. 다음 정보를 포함해주세요: 1. four_pillars: 60갑자를 이용한 연주, 월주, 일주, 시주. 2. day_master: 사주의 핵심인 일간(日干). 3. overall_analysis: 사주 전체 구조에 대한 종합 해설. 4. elemental_analysis: 사주에 나타난 오행(목, 화, 토, 금, 수)의 분포와 균형 분석. 5. life_advice: 타고난 기질을 바탕으로 삶을 더 풍요롭게 만들기 위한 조언.`;
                schema = sajuAnalysisSchema;
                contents = prompt;
                break;
            case 'tarot':
                const cardInfo = payload.cards.map((c: any) => `${c.name} (${c.orientation})`).join(', ');
                prompt = `당신은 영적인 통찰력이 뛰어난 타로 마스터입니다. 사용자의 질문과 당신이 뽑은 세 장의 타로 카드를 기반으로 심도 있는 해석을 제공해주세요. 사용자의 질문: "${payload.question}" 뽑힌 카드: ${cardInfo} 각 카드의 의미를 개별적으로 설명한 후, 세 카드의 조합이 사용자의 질문에 대해 어떤 총체적인 메시지를 전달하는지 종합적으로 해석해주세요. 해석은 사용자가 자신의 상황을 긍정적으로 이해하고 나아갈 방향을 찾는 데 도움이 되도록, 따뜻하고 희망적인 조언을 담아야 합니다. 결과는 반드시 JSON 형식으로 반환해야 합니다.`;
                schema = tarotAnalysisSchema;
                contents = prompt;
                break;
            case 'juyeok':
                 prompt = `당신은 주역(I-Ching)의 대가입니다. 사용자의 질문에 대해 뽑힌 주역 괘를 해석해주세요. 사용자의 질문: "${payload.question}" 뽑힌 괘: - 본괘 (현재 상황): ${payload.reading.presentHexagram.name} - 변괘 (미래 변화): ${payload.reading.changingHexagram ? payload.reading.changingHexagram.name : '없음'} - 변효 (변화의 핵심): ${payload.reading.changingLines.length > 0 ? payload.reading.changingLines.map((l: number) => `${l}효`).join(', ') : '없음'} 해석 지침: 1. 본괘가 현재 상황에 대해 가지는 의미를 설명합니다. 2. 변효가 있다면, 각 변효가 어떤 구체적인 변화나 조언을 의미하는지 상세히 설명합니다. 3. 변괘가 있다면, 이 변화를 거친 후 맞이하게 될 미래의 상황을 설명합니다. 4. 모든 해석을 종합하여 사용자의 질문에 대한 최종적인 조언을 제공합니다. 5. 긍정적이고 희망적인 관점에서 조언하되, 현실적인 통찰을 담아주세요. 결과는 반드시 JSON 형식으로 반환해야 합니다.`;
                schema = juyeokAnalysisSchema;
                contents = prompt;
                break;
            case 'yukhyo':
                prompt = `당신은 육효점의 최고 전문가입니다. 사용자의 질문에 대해 주어진 정보로 육효점을 해석해주세요. 사용자의 질문: "${payload.question}" 점을 친 날짜: ${payload.ganjiDate} 뽑힌 괘: ${payload.hexagram.name} 해석 과정: 1. 주어진 괘(${payload.hexagram.name})에 ${payload.ganjiDate}의 간지를 적용하여 납갑(納甲)을 붙이고, 세(世)와 응(應)을 정합니다. 2. 각 효에 육친(부모, 형제, 자손, 처재, 관귀)을 배치합니다. 3. 사용자의 질문("${payload.question}")의 핵심 카테고리(예: 재물, 연애, 시험, 건강 등)를 파악하고 그에 맞는 용신(用神)을 찾습니다. 4. 용신이 일진(日辰)과 월건(月建)에 비추어 왕상휴수(旺相休囚)한지 판단합니다. 5. 위의 모든 요소를 종합하여 질문에 대한 구체적인 길흉을 판단하고, 상세한 조언을 제공합니다. 결과는 반드시 JSON 형식으로 반환해야 합니다.`;
                schema = yukhyoAnalysisSchema;
                contents = prompt;
                break;
            default:
                return res.status(400).json({ error: 'Invalid analysis type' });
        }
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
            }
        });
        
        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);

        res.status(200).json(result);

    } catch (error: any) {
        console.error('Error in /api/analyze:', error);
        res.status(500).json({ error: 'An internal server error occurred.', details: error.message });
    }
}
