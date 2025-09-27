import { GoogleGenAI, Type, Modality } from "@google/genai";
import type { VercelRequest, VercelResponse } from '@vercel/node';

// --- Base64 Cleaner ---
function cleanBase64(data: string) {
  if (!data) return '';
  return data.replace(/^data:image\/[a-zA-Z]+;base64,/, "");
}

// --- All schema definitions are now on the server, in Korean ---

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    overall_impression: {
      type: Type.STRING,
      description: "사진 속 인물의 전반적인 관상 총평. 2~3 문장으로 작성합니다. 만약 얼굴 인식이 어렵다면, '얼굴을 인식하기 어렵습니다. 더 선명한 정면 사진을 사용해주세요.' 라고 응답해야 합니다."
    },
    features: {
      type: Type.ARRAY,
      description: "얼굴의 각 부위별 관상 분석 결과입니다.",
      items: {
        type: Type.OBJECT,
        properties: {
          feature: { type: Type.STRING, description: "분석하는 얼굴 부위의 이름 (예: 눈, 코, 입, 이마, 턱, 귀)." },
          shape: { type: Type.STRING, description: "해당 부위의 구체적인 모양이나 특징에 대한 묘사." },
          analysis: { type: Type.STRING, description: "해당 부위의 특징이 관상학적으로 무엇을 의미하는지에 대한 상세한 설명." }
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
      description: "사진 속 손금에 대한 전반적인 총평. 2~3 문장으로 작성합니다. 만약 손금 인식이 어렵다면, '손금을 인식하기 어렵습니다. 손바닥 전체가 선명하게 나온 사진을 사용해주세요.' 라고 응답해야 합니다."
    },
    lines: {
      type: Type.ARRAY,
      description: "주요 손금(생명선, 감정선, 두뇌선)에 대한 분석 결과입니다.",
      items: {
        type: Type.OBJECT,
        properties: {
          line_name: { type: Type.STRING, description: "분석하는 손금의 이름 (예: 생명선, 감정선, 두뇌선)." },
          analysis: { type: Type.STRING, description: "해당 손금이 무엇을 의미하는지에 대한 상세한 설명. 강점과 함께 주의할 점이나 개선할 점을 균형 있게 포함합니다." }
        },
        required: ["line_name", "analysis"]
      }
    },
    credibility_score: {
        type: Type.INTEGER,
        description: "이 손금 분석에 대한 신뢰도 점수 (70~95 사이의 정수). 분석이 어려울 경우 70점으로 설정합니다."
    },
    credibility_comment: {
        type: Type.STRING,
        description: "손금은 정해진 미래가 아닌 가능성을 보여주는 지표라는 점, 그리고 사진 품질에 따라 정확도가 달라질 수 있다는 점을 설명하는 짧은 코멘트."
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
            description: "사진 속 인물의 표정, 분위기, 스타일 등을 종합하여 다른 사람에게 어떤 첫인상을 주는지 3-4문장으로 상세하게 분석합니다. 긍정적인 측면을 중심으로 서술합니다. 만약 인물 인식이 어렵다면, '인물 인식이 어렵습니다. 더 선명한 사진을 사용해주세요.' 라고 응답해야 합니다."
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
            description: "뽑힌 카드들을 종합적으로 해석하여 사용자의 질문에 대한 총체적인 답변과 조언을 제공합니다."
        },
        cards: {
            type: Type.ARRAY,
            description: "뽑힌 카드 각각에 대한 개별 해석입니다.",
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

const dailyTarotAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        interpretation: {
            type: Type.STRING,
            description: "오늘 하루를 위한 짧고 긍정적인 조언을 한 문장으로 제공합니다."
        }
    },
    required: ["interpretation"]
};

const juyeokAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        present_hexagram_name: { type: Type.STRING, description: "현재 상황을 나타내는 본괘의 이름 (예: 건위천(乾爲天))." },
        changing_hexagram_name: { type: Type.STRING, nullable: true, description: "미래의 변화를 나타내는 변괘의 이름. 변효가 없으면 null." },
        interpretation: { type: Type.STRING, description: "사용자의 질문에 대해 본괘와 변괘가 의미하는 바를 종합적으로 해석한 내용." },
        changing_lines_interpretation: { type: Type.STRING, nullable: true, description: "변화가 일어나는 효(변효)가 구체적으로 어떤 의미를 가지는지에 대한 상세한 설명. 변효가 없으면 null." }
    },
    required: ["present_hexagram_name", "changing_hexagram_name", "interpretation", "changing_lines_interpretation"]
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
                    marker: { type: Type.STRING, nullable: true, description: "세(世) 또는 응(應) 표시, 해당 없으면 null." }
                },
                required: ["line_number", "six_relatives", "earthly_branch", "marker"]
            }
        },
        overall_interpretation: { type: Type.STRING, description: "용신을 중심으로 괘 전체를 해석하여, 사용자의 질문에 대한 구체적인 길흉과 조언을 제공합니다." }
    },
    required: ["ganji_date", "hexagram_name", "yongsin", "lines", "overall_interpretation"]
};


// --- Serverless Function Handler ---
export default async function handler(req: VercelRequest, res: VercelResponse) {
    // --- CORS 헤더 ---
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (req.method === "OPTIONS") {
      return res.status(204).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
    
    console.log("📌 [API/analyze] Request received:", {
      type: req.body?.type,
      imageLength: req.body?.payload?.data?.length ?? 'N/A',
    });

    try {
        const { type, payload } = req.body;
        
        const apiKey = process.env.API_KEY;
        if (!apiKey) {
            console.error("❌ API_KEY is not set");
            return res.status(500).json({ error: 'Server configuration error.' });
        }
        const ai = new GoogleGenAI({ apiKey });

        // --- Base64 cleanup ---
        if (payload?.data) {
          payload.data = cleanBase64(payload.data);
        }
        if (payload?.cards) {
          payload.cards = payload.cards.map((card: any) => {
            if (card.imageData) {
              card.imageData = cleanBase64(card.imageData);
            }
            return card;
          });
        }
        
        // --- Face Stretch (special case with its own error handling) ---
        if (type === 'face-stretch') {
            try {
                if (!payload?.data) return res.status(400).json({ error: "Image data not sent." });
                const prompt = `사진 속 인물의 얼굴을 세로로 길게, 위아래로 최대한 늘려서 과장되고 재미있는 이미지로 만들어줘. 그리고 이 변형된 얼굴에 대한 재미있는 한 줄 평을 함께 알려줘.`;
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash-image-preview',
                    contents: { parts: [{ text: prompt }, { inlineData: { mimeType: payload.mimeType, data: payload.data } }] },
                    config: { responseModalities: [Modality.IMAGE, Modality.TEXT] },
                });
                let stretchedImageBase64 = '', comment = '';
                if (response.candidates?.[0]?.content?.parts) {
                    for (const part of response.candidates[0].content.parts) {
                        if (part.text) comment = part.text;
                        else if (part.inlineData) stretchedImageBase64 = part.inlineData.data;
                    }
                }
                if (!stretchedImageBase64 || !comment) throw new Error("AI failed to generate image or comment.");
                
                console.log("✅ [API/analyze] Face-stretch successful.");
                return res.status(200).json({ stretchedImageBase64, comment });
            } catch (error: any) {
                // Graceful fallback specifically for face-stretcher on rate limit error
                if (error.name === 'ApiError' && error.status === 429) {
                    console.warn("⚠️ face-stretch fallback activated due to API rate limit.");
                    return res.status(200).json({
                        stretchedImageBase64: "", // Empty image signals frontend to handle this case
                        comment: "현재 요청이 너무 많아 AI가 잠시 쉬고 있어요. 잠시 후 다시 시도해주세요."
                    });
                }
                // For other errors in face-stretch, re-throw to be caught by the main handler
                throw error;
            }
        }


        // --- Main Analysis Logic ---
        let contents: any;
        let schema: any;

        const jsonOutputRuleKo = `응답은 반드시 제공된 JSON 스키마를 엄격히 준수하는 JSON 객체여야 합니다. JSON 객체 자체 외에 어떠한 텍스트, 설명, 또는 \`\`\`json 같은 마크다운 서식도 추가해서는 안 됩니다. JSON 스키마의 모든 필드는 의미 있고, 관련성 있으며, 비어 있지 않은 내용으로 채워져야 합니다. 정보가 불확실할 경우, 지식을 바탕으로 가장 가능성 있는 해석을 제공하세요.`;

        switch (type) {
            case 'face':
                schema = analysisSchema;
                contents = {
                    parts: [
                        { text: `당신은 AI 관상 전문가입니다. 제공된 이미지 속 인물의 얼굴 특징을 관상학적으로 상세히 분석하세요. ${jsonOutputRuleKo}` },
                        { inlineData: { mimeType: payload.mimeType, data: payload.data } },
                    ],
                };
                break;
            case 'palm':
                schema = palmAnalysisSchema;
                contents = {
                    parts: [
                        { text: `당신은 AI 손금 전문가입니다. 제공된 손금 이미지에서 주요 3대선(생명선, 감정선, 두뇌선)을 분석하세요. 신뢰도 점수는 70에서 95 사이의 정수여야 합니다. ${jsonOutputRuleKo}` },
                        { inlineData: { mimeType: payload.mimeType, data: payload.data } },
                    ],
                };
                break;
            case 'impression':
                schema = impressionAnalysisSchema;
                contents = {
                    parts: [
                        { text: `당신은 첫인상 분석 전문가입니다. 제공된 이미지 속 인물의 첫인상에 대해 긍정적인 측면을 중심으로 키워드 3~4개, 상세 분석, 개선을 위한 팁 한 가지를 제공하세요. ${jsonOutputRuleKo}` },
                        { inlineData: { mimeType: payload.mimeType, data: payload.data } },
                    ],
                };
                break;
            case 'tarot': {
                schema = tarotAnalysisSchema;
                const introPrompt = `당신은 지혜로운 타로 마스터입니다. 사용자의 질문은 다음과 같습니다: "${payload.question}". 뽑힌 카드와 함께 제공된 사용자 이미지를 영감의 원천으로 삼아, 종합적인 리딩과 각 카드에 대한 상세한 해석을 제공하세요. ${jsonOutputRuleKo}`;
                const contentParts: any[] = [{ text: introPrompt }];
                payload.cards.forEach((card: any) => {
                    let cardDescription = `카드: ${card.name} (${card.orientation})`;
                    if (card.imageData) {
                        cardDescription += " - 해석에 영감을 줄 사용자 이미지 포함.";
                    }
                    contentParts.push({ text: cardDescription });
                    if (card.imageData && card.mimeType) {
                        contentParts.push({ inlineData: { mimeType: card.mimeType, data: card.imageData } });
                    }
                });
                contents = { parts: contentParts };
                break;
            }
            case 'astrology':
                schema = astrologyAnalysisSchema;
                contents = `당신은 점성술 전문가입니다. 생년월일 ${payload.birthDate}을(를) 바탕으로 상세한 별자리 운세를 생성하세요. 별자리, 수호성, 원소를 포함하여 성격, 연애, 직업에 대한 상세한 분석을 제공해야 합니다. ${jsonOutputRuleKo}`;
                break;
            case 'saju':
                schema = sajuAnalysisSchema;
                contents = `당신은 사주 명리학 전문가입니다. 생년월일시 ${payload.birthDate} ${payload.birthTime}을(를) 바탕으로 사주 분석을 생성하세요. 사주팔자, 일간, 종합 분석, 오행 분석, 삶의 조언을 포함해야 합니다. ${jsonOutputRuleKo}`;
                break;
            case 'daily-tarot':
                schema = dailyTarotAnalysisSchema;
                contents = `당신은 지혜로운 타로 마스터입니다. 오늘의 카드는 '${payload.card.name}' (${payload.card.orientation}) 입니다. 오늘 하루를 위한 짧고 긍정적인 조언을 한 문장으로 제공하세요. ${jsonOutputRuleKo}`;
                break;
            case 'juyeok':
                schema = juyeokAnalysisSchema;
                contents = `당신은 주역 전문가입니다. 사용자의 질문은 "${payload.question}" 입니다. 점괘 결과 현재 괘는 '${payload.reading.presentHexagram.name}', 미래 괘는 '${payload.reading.changingHexagram?.name || '변화 없음'}' 이며, 변효는 ${payload.reading.changingLines.join(', ') || '없음'} 입니다. 이를 바탕으로 종합적인 해석을 제공하세요. 변효가 없을 경우 'changing_lines_interpretation' 필드는 반드시 null이어야 합니다. ${jsonOutputRuleKo}`;
                break;
            case 'yukhyo':
                schema = yukhyoAnalysisSchema;
                contents = `당신은 육효 전문가입니다. 오늘 날짜를 기준으로 "${payload.question}"이라는 질문에 대한 육효점을 치세요. 괘, 용신, 각 효를 분석하여 구체적인 예측과 조언을 제공해야 합니다. ${jsonOutputRuleKo}`;
                break;
            default:
                return res.status(400).json({ error: 'Invalid analysis type' });
        }
        
        const model = "gemini-2.5-flash";
        
        console.log(`📌 [API/analyze] Requesting analysis for type: ${type}. Model: ${model}.`);

        // --- Gemini API Call ---
        const response = await ai.models.generateContent({
            model,
            contents,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
            }
        });
        
        let jsonText = response.text.trim();
        
        // Clean up potential markdown code fences from the response
        if (jsonText.startsWith("```json")) {
            jsonText = jsonText.substring(7, jsonText.length - 3).trim();
        } else if (jsonText.startsWith("```")) {
             jsonText = jsonText.substring(3, jsonText.length - 3).trim();
        }
        
        let result: any;
        try {
            result = JSON.parse(jsonText);
        } catch (e) {
            console.error("❌ JSON parse failed. Raw response:", jsonText);
            throw new Error("AI response was not valid JSON.");
        }
        
        console.log("✅ [API/analyze] Gemini response (parsed successfully)");

        res.status(200).json(result);

    } catch (error: any) {
        const type = req.body?.type || 'unknown';
        console.error("❌ [API/analyze] API error occurred in main handler");
        console.error(`Analysis Type: ${type}`);
        console.error(`Timestamp: ${new Date().toISOString()}`);
        console.error("Error Name:", error.name);
        console.error("Error Message:", error.message);
        if (error.cause) console.error("Error Cause:", error.cause);
        console.error("Full Error Object:", JSON.stringify(error, null, 2));
        
        if (error.name === 'ApiError' && error.status === 429) {
            return res.status(429).json({
                error: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',
                details: error.message || 'API rate limit exceeded.'
            });
        }

        res.status(500).json({
          error: 'Server internal error occurred.', 
          details: error.message || "Unknown error" 
        });
    }
}