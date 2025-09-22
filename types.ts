
export interface FeatureAnalysis {
  feature: string;
  shape: string;
  analysis: string;
}

export interface PhysiognomyResult {
  overall_impression: string;
  features: FeatureAnalysis[];
}

export interface LineAnalysis {
  line_name: string;
  analysis: string;
}

export interface PalmistryResult {
  overall_analysis: string;
  lines: LineAnalysis[];
  credibility_score: number;
  credibility_comment: string;
}

export interface ImpressionAnalysisResult {
  keywords: string[];
  detailed_analysis: string;
  improvement_tip: string;
}

export interface AstrologyResult {
  zodiac_sign: string;
  ruling_planet: string;
  element: string;
  analysis: {
    personality: string;
    love_life: string;
    work_career: string;
  };
}

export interface SajuResult {
  four_pillars: {
    year_pillar: string;
    month_pillar: string;
    day_pillar: string;
    hour_pillar: string;
  };
  day_master: string;
  overall_analysis: string;
  elemental_analysis: string;
  life_advice: string;
}

export type CardOrientation = '정방향' | '역방향';

export interface CardDraw {
  name: string;
  orientation: CardOrientation;
}

export interface CardInterpretation {
  card_name: string;
  orientation: CardOrientation;
  meaning: string;
}

export interface TarotResult {
  overall_reading: string;
  cards: CardInterpretation[];
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
  present_hexagram_name: string;
  changing_hexagram_name: string | null;
  interpretation: string;
  changing_lines_interpretation: string | null;
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

// --- Saved Result Type ---
export interface SavedResult {
  id: string; // Unique ID for the result, can be a timestamp string
  type: 'face-reader' | 'palm-reader' | 'impression-analyzer' | 'astrology-reader' | 'saju-analyzer' | 'tarot-reader' | 'juyeok-reader' | 'yukhyo-analyzer';
  typeName: string; // User-friendly name like "AI 관상가"
  date: string; // ISO string of the save date
  result: any; // The result data object
  context?: { [key: string]: any }; // Extra context, e.g., { question: '...', drawnCards: [...] } for Tarot
}
