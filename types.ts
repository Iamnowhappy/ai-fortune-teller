

export interface PhysiognomyResult {
  summary: string; // Free
  premium_analysis: {
    overall_impression: string;
    job_suitability: string;
    love_style: string;
    health_advice: string;
  };
  features: FeatureAnalysis[]; // Premium
}


export interface FeatureAnalysis {
  feature: string;
  shape: string;
  analysis: string;
}


export interface LineAnalysis {
  line_name: string;
  analysis: string;
}

export interface PalmistryResult {
  summary: string; // Free
  premium_analysis: {
      overall_analysis: string;
      lines: LineAnalysis[];
  };
  credibility_score: number;
  credibility_comment: string;
}

export interface ImpressionAnalysisResult {
  summary: string; // Free
  premium_analysis: {
      keywords: string[];
      detailed_analysis: string;
      situational_analysis: string; // e.g., business, dating
      improvement_tip: string;
  };
}

export interface AstrologyResult {
  zodiac_sign: string;
  summary: string; // Free
  premium_analysis: {
    personality: string;
    love_life: string;
    work_career: string;
    health_fortune: string;
  };
  ruling_planet: string;
  element: string;
}

export interface SajuResult {
  daily_fortune_summary: string; // Free
  four_pillars: {
    year_pillar: string;
    month_pillar: string;
    day_pillar: string;
    hour_pillar: string;
  };
  day_master: string;
  premium_analysis: {
      overall_analysis: string;
      elemental_balance: string;
      love_fortune: string;
      money_fortune: string;
      career_fortune: string;
      health_fortune: string;
      life_advice: string;
  };
}

export type CardOrientation = '정방향' | '역방향';

export interface CardDraw {
  name: string;
  orientation: CardOrientation;
  imageData?: string; // Base64 encoded string, without data URI prefix
  mimeType?: string;
}

export interface CardInterpretation {
  card_name: string;
  orientation: CardOrientation;
  meaning: string;
}

export interface TarotResult {
  overall_summary: string; // Free
  premium_reading: {
    detailed_reading: string;
    situational_advice: { // love, money, work
        love: string;
        money: string;
        work: string;
    };
    cards: CardInterpretation[];
  }
}

// --- Daily Tarot Types ---
export interface DailyTarotResult {
    interpretation: string;
}

// --- Juyeok (I-Ching) Types ---
export type LineType = 'yin' | 'yang';

export interface Hexagram {
  name: string;
  lines: LineType[];
}

export interface JuyeokReading {
  presentHexagram: Hexagram;
  changingHexagram: Hexagram | null;
  changingLines: number[];
}

export interface JuyeokResult {
  summary: string; // Free
  present_hexagram_name: string;
  changing_hexagram_name: string | null;
  premium_analysis: {
    detailed_interpretation: string;
    changing_lines_interpretation: string | null;
    situational_advice: string; // e.g., love, business, health
  };
}

// --- Yukhyo Types ---
export interface YukhyoLine {
    line_number: number;
    six_relatives: string; // 예: "부모(父母)"
    earthly_branch: string; // 예: "자(子)"
    marker: "세(世)" | "응(應)" | null;
}

export interface YukhyoResult {
    ganji_date: string;
    hexagram_name: string;
    yongsin: string; // 용신(用神)
    lines: YukhyoLine[];
    overall_interpretation: string;
}

// --- Dream Interpreter Types ---
export interface DreamSymbol {
    symbol: string;
    meaning: string;
}

export interface GroundingChunk {
  web: {
    uri: string;
    title: string;
  };
}

export interface DreamInterpretationResult {
    summary: string; // Free
    premium_analysis: {
        detailed_interpretation: string;
        dream_symbols: DreamSymbol[];
        advice: string;
    };
    groundingChunks?: GroundingChunk[];
}

// --- Naming Service Types ---
export interface NewbornNameResult {
    summary: string;
    premium_analysis: {
        name: string;
        hanja: string;
        meaning: string;
        five_elements_analysis: string;
        sound_analysis: string;
        overall_fortune: string;
    };
}

export interface BusinessNameResult {
    summary: string;
    premium_analysis: {
        names: { name: string; meaning: string; }[];
        naming_strategy: string;
        slogan_suggestions: string[];
    }
}

export interface PersonalNameAnalysisResult {
    summary: string;
    premium_analysis: {
        name_score: number; // 0-100
        five_elements_analysis: string;
        sound_analysis: string;
        overall_fortune: string;
        improvement_suggestion: string;
    }
}

export interface BusinessNameAnalysisResult {
    summary: string;
    premium_analysis: {
        name_score: number; // 0-100
        detailed_analysis: string;
        brand_image: string;
        improvement_suggestions: string;
    }
}

// --- Saved Result Type ---
export interface SavedResult {
  id: string; // Unique ID for the result, can be a timestamp string
  type: 'face-reader' | 'palm-reader' | 'impression-analyzer' | 'astrology-reader' | 'saju-analyzer' | 'tarot-reader' | 'juyeok-reader' | 'yukhyo-analyzer' | 'dream-interpreter' | 'newborn-namer' | 'business-namer' | 'personal-name-analyzer' | 'business-name-analyzer' | 'renamer';
  typeName: string; // User-friendly name like "AI 관상가"
  date: string; // ISO string of the save date
  result: any; // The result data object
  context?: { [key: string]: any }; // Extra context, e.g., { question: '...', drawnCards: [...] } for Tarot
}