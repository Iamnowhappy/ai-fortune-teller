import { GoogleGenAI, Type, Modality } from "@google/genai";
import type { VercelRequest, VercelResponse } from '@vercel/node';

// --- All schema definitions are now on the server ---

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

// --- Serverless Function Handler ---
export default async function handler(req: VercelRequest, res: VercelResponse) {
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
            console.error("API_KEY environment variable is not set.");
            return res.status(500).json({ error: 'Server configuration error.' });
        }
        const ai = new GoogleGenAI({ apiKey });

        // --- Special Handlers for Image Generation/Editing ---
        if (type === 'daily-fortune-image') {
            const prompt = `A beautiful, symbolic, artistic illustration representing the fortune: '${payload.fortuneText}'. The style should be vibrant, hopeful, and slightly abstract. Avoid text in the image. Aspect ratio 16:9.`;
            const imageResponse = await ai.models.generateImages({
                model: 'imagen-4.0-generate-001',
                prompt: prompt,
                config: { numberOfImages: 1, outputMimeType: 'image/jpeg', aspectRatio: '16:9' },
            });
            if (imageResponse.generatedImages && imageResponse.generatedImages.length > 0) {
                return res.status(200).json({ imageBase64: imageResponse.generatedImages[0].image.imageBytes });
            }
            throw new Error("Image generation failed, no images returned.");
        }
        
        if (type === 'face-stretch') {
            const prompt = `사진 속 인물의 얼굴을 세로로 길게, 위아래로 최대한 늘려서 과장되고 재미있는 이미지로 만들어줘. 그리고 이 변형된 얼굴에 대한 재미있는 한 줄 평을 함께 알려줘.`;
            // Note: client-side file util already strips prefix
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
            return res.status(200).json({ stretchedImageBase64, comment });
        }

        // --- Main Analysis Logic ---
        let contents: any;
        let schema: any;

        switch (type) {
            case 'face': {
                if (!payload || !payload.data) return res.status(400).json({ error: "Image data not sent." });
                const prompt = `업로드된 사진 속 얼굴을 재미와 엔터테인먼트 목적으로 해석해 주세요. 절대 건강, 질병, 운명, 수명, 정치, 종교 등 민감한 주제는 언급하지 마세요. 긍정적인 성격 특징, 인상, 분위기, 매력 포인트만 간단히 설명해 주세요. 얼굴의 각 부위(눈, 코, 입 등)가 주는 느낌과 전반적인 인상을 긍정적이고 희망적인 관점에서 설명해주세요. 친절하고 부드러운 말투를 사용하고, 결과는 반드시 다음 JSON 형식으로만 반환해야 합니다.`;
                schema = analysisSchema;
                contents = {
                    parts: [
                        { text: prompt },
                        { inlineData: { mimeType: payload.mimeType, data: payload.data } },
                    ],
                };
                break;
            }
            case 'palm': {
                if (!payload || !payload.data) return res.status(400).json({ error: "Image data not sent." });
                const prompt = `당신은 수십 년간 손금을 연구해 온 세계 최고의 손금 전문가입니다. 당신의 임무는 사용자가 제공한 손 사진을 보고, 주요 3대 손금(생명선, 감정선, 두뇌선)의 특징과 그것이 의미하는 바를 상세히 설명하는 것입니다. 각 손금이 의미하는 장점과 함께 주의해야 할 점이나 개선할 점을 균형 있게 설명해주세요. 분석은 현실적이어야 하지만, 사용자가 긍정적인 마음으로 자신의 삶을 개척해나갈 수 있도록 격려하는 톤을 유지해주세요. 마지막으로, 이 분석에 대한 신뢰도 점수(70~95% 사이의 정수)와 함께, 손금은 정해진 미래가 아닌 가능성을 보여주는 지표라는 점을 설명하는 코멘트를 추가해주세요. 결과는 반드시 다음 JSON 형식으로만 반환해야 합니다.`;
                schema = palmAnalysisSchema;
                contents = {
                    parts: [
                        { text: prompt },
                        { inlineData: { mimeType: payload.mimeType, data: payload.data } },
                    ],
                };
                break;
            }
            case 'impression': {
                if (!payload || !payload.data) return res.status(400).json({ error: "Image data not sent." });
                const prompt = `당신은 사회 심리학 및 인간 인식 분야의 전문가입니다. 당신의 임무는 사용자가 제공한 인물 사진을 보고 그 사람의 첫인상을 분석하는 것입니다. 사진 속 인물의 표정, 분위기, 스타일 등을 종합적으로 고려하여 다른 사람에게 어떤 느낌을 주는지 객관적으로 분석해주세요. 분석은 격려가 되고 긍정적인 방향으로 제공되어야 하지만, 현실적인 조언도 포함해야 합니다. 결과는 반드시 다음 JSON 형식으로만 반환해야 합니다.`;
                schema = impressionAnalysisSchema;
                contents = {
                    parts: [
                        { text: prompt },
                        { inlineData: { mimeType: payload.mimeType, data: payload.data } },
                    ],
                };
                break;
            }
            case 'tarot': {
                const introPrompt = `You are a wise Tarot Master. Provide a reading for the user's question: "${payload.question}". Interpret these cards. When an image is provided with a card, integrate its symbolism. The result must be a single JSON object.`;
                const contentParts: any[] = [{ text: introPrompt }];
                payload.cards.forEach((card: any) => {
                    contentParts.push({ text: `\n--- \nCard: ${card.name} (${card.orientation})` });
                    if (card.imageData && card.mimeType) {
                        contentParts.push({ inlineData: { mimeType: card.mimeType, data: card.imageData } }); // data is already clean
                    }
                });
                schema = tarotAnalysisSchema;
                contents = { parts: contentParts };
                break;
            }
            case 'astrology':
                schema = astrologyAnalysisSchema;
                contents = `당신은 세계적으로 유명한 점성술사입니다. 사용자의 생년월일인 ${payload.birthDate}를 기반으로 서양 점성술(별자리) 운세를 분석해주세요. 결과는 반드시 JSON 형식으로 반환해야 합니다. 다음 정보를 포함해주세요: 1. zodiac_sign: 해당하는 별자리. 2. ruling_planet: 지배 행성. 3. element: 4원소 (불, 흙, 공기, 물). 4. analysis: 성격, 연애, 직업에 대한 상세 분석.`;
                break;
            case 'saju':
                schema = sajuAnalysisSchema;
                contents = `당신은 수십 년 경력의 사주 명리학 대가입니다. 사용자의 생년월일시인 ${payload.birthDate} ${payload.birthTime}를 기반으로 사주팔자를 분석해주세요. 만약 출생 시간이 '모름'으로 입력되었다면 시주(時柱)는 알 수 없는 것으로 간주하고 분석하세요. 결과는 반드시 JSON 형식으로 반환해야 합니다. 다음 정보를 포함해주세요: 1. four_pillars: 60갑자를 이용한 연주, 월주, 일주, 시주. 2. day_master: 사주의 핵심인 일간(日干). 3. overall_analysis: 사주 전체 구조에 대한 종합 해설. 4. elemental_analysis: 사주에 나타난 오행(목, 화, 토, 금, 수)의 분포와 균형 분석. 5. life_advice: 타고난 기질을 바탕으로 삶을 더 풍요롭게 만들기 위한 조언.`;
                break;
            case 'daily-tarot':
                schema = dailyTarotAnalysisSchema;
                contents = `당신은 희망을 주는 타로 마스터입니다. 오늘 사용자가 뽑은 카드는 '${payload.card.name}' (${payload.card.orientation}) 입니다. 이 카드를 바탕으로 오늘 하루를 위한 짧고 긍정적인 조언을 딱 한 문장으로 만들어주세요. 결과는 반드시 JSON 형식으로 반환해야 합니다.`;
                break;
            case 'juyeok':
                schema = juyeokAnalysisSchema;
                contents = `당신은 주역(I-Ching)의 대가입니다. 사용자의 질문에 대해 뽑힌 주역 괘를 해석해주세요. 질문: "${payload.question}", 본괘: ${payload.reading.presentHexagram.name}, 변괘: ${payload.reading.changingHexagram ? payload.reading.changingHexagram.name : '없음'}, 변효: ${payload.reading.changingLines.join(', ')}. 본괘, 변괘, 변효를 종합하여 질문에 대한 최종 조언을 제공합니다. 결과는 반드시 JSON 형식으로 반환해야 합니다.`;
                break;
            case 'yukhyo':
                schema = yukhyoAnalysisSchema;
                contents = `당신은 시공간의 기운을 읽어내는 육효점의 대가입니다. 사용자의 질문("${payload.question}")에 대해, 현재 시점의 기운을 바탕으로 주역 64괘 중 하나를 도출하고, 육효의 원리에 따라 해석하여 답을 주세요. 결과는 반드시 JSON 형식으로 반환해야 합니다.`;
                break;
            default:
                return res.status(400).json({ error: 'Invalid analysis type' });
        }
        
        // --- Model Selection Logic ---
        let model = "gemini-2.5-flash"; // Default to fast text model
        const imageBasedTypes = ['face', 'palm', 'impression'];
        const isImageTarot = type === 'tarot' && payload.cards.some((c: any) => c.imageData);
        if (imageBasedTypes.includes(type) || isImageTarot) {
            model = "gemini-1.5-pro"; // Use powerful multimodal model for image analysis
        }
        console.log(`📌 [API/analyze] Selected Model: ${model}`);

        // --- Gemini API Call ---
        const response = await ai.models.generateContent({
            model,
            contents,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
            },
        });
        
        let jsonText = response.text.trim();
        if (jsonText.startsWith("```json")) {
            jsonText = jsonText.substring(7, jsonText.length - 3).trim();
        } else if (jsonText.startsWith("```")) {
             jsonText = jsonText.substring(3, jsonText.length - 3).trim();
        }
        
        console.log("✅ [API/analyze] Gemini response (cleaned):", jsonText.slice(0, 500) + (jsonText.length > 500 ? '...' : ''));
        const result = JSON.parse(jsonText);

        res.status(200).json(result);

    } catch (error: any) {
        const type = req.body?.type || 'unknown';
        console.error("❌ [API/analyze] API error occurred");
        console.error(`Analysis Type: ${type}`);
        console.error(`Timestamp: ${new Date().toISOString()}`);
        console.error("Error Name:", error.name);
        console.error("Error Message:", error.message);
        if (error.cause) console.error("Error Cause:", error.cause);
        console.error("Full Error Object:", JSON.stringify(error, null, 2));

        res.status(500).json({
          error: 'Server internal error occurred.', 
          details: error.message || "Unknown error" 
        });
    }
}