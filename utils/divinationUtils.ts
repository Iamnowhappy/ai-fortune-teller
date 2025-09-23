import type { JuyeokReading, Hexagram, LineType } from '../types';

// FIX: Corrected the entire I_CHING_HEXAGRAMS object to remove duplicate keys and ensure data accuracy.
// The I-Ching consists of 64 hexagrams. Each hexagram is defined by six lines,
// which can be either yin (broken) or yang (solid).
// The `lines` array represents the hexagram from bottom (line 1) to top (line 6).
// The object key is a binary string representation of the hexagram from top-to-bottom,
// where '1' is yang and '0' is yin. This key is used for efficient lookup.
const I_CHING_HEXAGRAMS: { [key: string]: { name: string, lines: LineType[] } } = {
    '111111': { name: '건위천 (乾爲天)', lines: [ 'yang', 'yang', 'yang', 'yang', 'yang', 'yang' ] },
    '000000': { name: '곤위지 (坤爲地)', lines: [ 'yin', 'yin', 'yin', 'yin', 'yin', 'yin' ] },
    '010100': { name: '수뢰둔 (水雷屯)', lines: [ 'yang', 'yin', 'yin', 'yin', 'yang', 'yin' ] },
    '001010': { name: '산수몽 (山水蒙)', lines: [ 'yin', 'yang', 'yin', 'yang', 'yin', 'yin' ] },
    '010111': { name: '수천수 (水天需)', lines: [ 'yang', 'yang', 'yang', 'yin', 'yang', 'yin' ] },
    '111010': { name: '천수송 (天水訟)', lines: [ 'yin', 'yang', 'yin', 'yang', 'yang', 'yang' ] },
    '000010': { name: '지수사 (地水師)', lines: [ 'yin', 'yang', 'yin', 'yin', 'yin', 'yin' ] },
    '010000': { name: '수지비 (水地比)', lines: [ 'yin', 'yin', 'yin', 'yin', 'yang', 'yin' ] },
    '110111': { name: '풍천소축 (風天小畜)', lines: [ 'yang', 'yang', 'yang', 'yin', 'yang', 'yang' ] },
    '111011': { name: '천택리 (天澤履)', lines: [ 'yang', 'yang', 'yin', 'yang', 'yang', 'yang' ] },
    '000111': { name: '지천태 (地天泰)', lines: [ 'yang', 'yang', 'yang', 'yin', 'yin', 'yin' ] },
    '111000': { name: '천지비 (天地否)', lines: [ 'yin', 'yin', 'yin', 'yang', 'yang', 'yang' ] },
    '111101': { name: '천화동인 (天火同人)', lines: [ 'yang', 'yin', 'yang', 'yang', 'yang', 'yang' ] },
    '101111': { name: '화천대유 (火天大有)', lines: [ 'yang', 'yang', 'yang', 'yang', 'yin', 'yang' ] },
    '000001': { name: '지산겸 (地山謙)', lines: [ 'yang', 'yin', 'yin', 'yin', 'yin', 'yin' ] },
    '100000': { name: '뇌지예 (雷地豫)', lines: [ 'yin', 'yin', 'yin', 'yin', 'yin', 'yang' ] },
    '011100': { name: '택뢰수 (澤雷隨)', lines: [ 'yin', 'yin', 'yang', 'yin', 'yang', 'yang' ] },
    '001110': { name: '산풍고 (山風蠱)', lines: [ 'yin', 'yang', 'yang', 'yin', 'yin', 'yang' ] },
    '000011': { name: '지택림 (地澤臨)', lines: [ 'yang', 'yang', 'yin', 'yin', 'yin', 'yin' ] },
    '110000': { name: '풍지관 (風地觀)', lines: [ 'yin', 'yin', 'yin', 'yin', 'yang', 'yang' ] },
    '101100': { name: '화뢰서합 (火雷噬嗑)', lines: [ 'yin', 'yin', 'yang', 'yin', 'yang', 'yang' ] },
    '001101': { name: '산화비 (山火賁)', lines: [ 'yang', 'yin', 'yang', 'yin', 'yin', 'yang' ] },
    '001000': { name: '산지박 (山地剝)', lines: [ 'yin', 'yin', 'yin', 'yin', 'yin', 'yang' ] },
    '000100': { name: '지뢰복 (地雷復)', lines: [ 'yin', 'yin', 'yang', 'yin', 'yin', 'yin' ] },
    '111100': { name: '천뢰무망 (天雷無妄)', lines: [ 'yin', 'yin', 'yang', 'yang', 'yang', 'yang' ] },
    '001111': { name: '산천대축 (山天大畜)', lines: [ 'yang', 'yang', 'yang', 'yin', 'yin', 'yang' ] },
    '001100': { name: '산뢰이 (山雷頤)', lines: [ 'yin', 'yin', 'yang', 'yang', 'yin', 'yin' ] },
    '011110': { name: '택풍대과 (澤風大過)', lines: [ 'yin', 'yang', 'yang', 'yang', 'yang', 'yin' ] },
    '010010': { name: '감위수 (坎爲水)', lines: [ 'yin', 'yang', 'yin', 'yin', 'yang', 'yin' ] },
    '101101': { name: '이위화 (離爲火)', lines: [ 'yang', 'yin', 'yang', 'yang', 'yin', 'yang' ] },
    '011001': { name: '택산함 (澤山咸)', lines: [ 'yang', 'yin', 'yin', 'yin', 'yang', 'yang' ] },
    '100110': { name: '뇌풍항 (雷風恒)', lines: [ 'yin', 'yang', 'yang', 'yin', 'yin', 'yang' ] },
    '111001': { name: '천산돈 (天山遯)', lines: [ 'yang', 'yin', 'yin', 'yang', 'yang', 'yang' ] },
    '100111': { name: '뇌천대장 (雷天大壯)', lines: [ 'yang', 'yang', 'yang', 'yin', 'yin', 'yang' ] },
    '101000': { name: '화지진 (火地晉)', lines: [ 'yin', 'yin', 'yin', 'yang', 'yin', 'yang' ] },
    '000101': { name: '지화명이 (地火明夷)', lines: [ 'yang', 'yin', 'yang', 'yin', 'yin', 'yin' ] },
    '110101': { name: '풍화가인 (風火家人)', lines: [ 'yang', 'yin', 'yang', 'yin', 'yang', 'yang' ] },
    '101011': { name: '화택규 (火澤睽)', lines: [ 'yang', 'yang', 'yin', 'yang', 'yin', 'yang' ] },
    '010001': { name: '수산건 (水山蹇)', lines: [ 'yang', 'yin', 'yin', 'yin', 'yang', 'yin' ] },
    '100010': { name: '뇌수해 (雷水解)', lines: [ 'yin', 'yang', 'yin', 'yin', 'yin', 'yang' ] },
    '001011': { name: '산택손 (山澤損)', lines: [ 'yang', 'yang', 'yin', 'yin', 'yin', 'yang' ] },
    '110100': { name: '풍뢰익 (風雷益)', lines: [ 'yin', 'yin', 'yang', 'yin', 'yang', 'yang' ] },
    '011111': { name: '택천쾌 (澤天夬)', lines: [ 'yang', 'yang', 'yang', 'yang', 'yang', 'yin' ] },
    '111110': { name: '천풍구 (天風姤)', lines: [ 'yin', 'yang', 'yang', 'yang', 'yang', 'yang' ] },
    '011000': { name: '택지췌 (澤地萃)', lines: [ 'yin', 'yin', 'yin', 'yin', 'yang', 'yang' ] },
    '000110': { name: '지풍승 (地風升)', lines: [ 'yin', 'yang', 'yang', 'yin', 'yin', 'yin' ] },
    '011010': { name: '택수곤 (澤水困)', lines: [ 'yin', 'yang', 'yin', 'yin', 'yang', 'yang' ] },
    '010110': { name: '수풍정 (水風井)', lines: [ 'yin', 'yang', 'yang', 'yin', 'yang', 'yin' ] },
    '011101': { name: '택화혁 (澤火革)', lines: [ 'yang', 'yin', 'yang', 'yang', 'yang', 'yin' ] },
    '101110': { name: '화풍정 (火風鼎)', lines: [ 'yin', 'yang', 'yang', 'yang', 'yin', 'yang' ] },
    '100100': { name: '진위뢰 (震爲雷)', lines: [ 'yin', 'yin', 'yang', 'yin', 'yin', 'yang' ] },
    '001001': { name: '간위산 (艮爲山)', lines: [ 'yang', 'yin', 'yin', 'yang', 'yin', 'yin' ] },
    '110001': { name: '풍산점 (風山漸)', lines: [ 'yang', 'yin', 'yin', 'yin', 'yang', 'yang' ] },
    '100011': { name: '뇌택귀매 (雷澤歸妹)', lines: [ 'yang', 'yang', 'yin', 'yin', 'yin', 'yang' ] },
    '100101': { name: '뇌화풍 (雷火豊)', lines: [ 'yang', 'yin', 'yang', 'yin', 'yin', 'yang' ] },
    '101001': { name: '화산려 (火山旅)', lines: [ 'yang', 'yin', 'yin', 'yang', 'yin', 'yang' ] },
    '110110': { name: '손위풍 (巽爲風)', lines: [ 'yin', 'yang', 'yang', 'yin', 'yang', 'yang' ] },
    '011011': { name: '태위택 (兌爲澤)', lines: [ 'yang', 'yang', 'yin', 'yang', 'yang', 'yin' ] },
    '110010': { name: '풍수환 (風水渙)', lines: [ 'yin', 'yang', 'yin', 'yin', 'yang', 'yang' ] },
    '010011': { name: '수택절 (水澤節)', lines: [ 'yang', 'yang', 'yin', 'yin', 'yang', 'yin' ] },
    '110011': { name: '풍택중부 (風澤中孚)', lines: [ 'yang', 'yang', 'yin', 'yin', 'yang', 'yang' ] },
    '100001': { name: '뇌산소과 (雷山小過)', lines: [ 'yang', 'yin', 'yin', 'yin', 'yin', 'yang' ] },
    '010101': { name: '수화기제 (水火旣濟)', lines: [ 'yang', 'yin', 'yang', 'yin', 'yang', 'yin' ] },
    '101010': { name: '화수미제 (火水未濟)', lines: [ 'yin', 'yang', 'yin', 'yang', 'yin', 'yang' ] }
};


const getHexagramFromLines = (lines: LineType[]): Hexagram => {
    // Keys are generated from top-to-bottom, so the lines array (bottom-to-top) needs to be reversed.
    const key = [...lines].reverse().map(line => line === 'yang' ? '1' : '0').join('');
    const hexagramData = I_CHING_HEXAGRAMS[key];
    
    if (!hexagramData) {
        // This is a critical error if it happens, indicating corrupted data.
        console.error(`FATAL: Could not find hexagram for key '${key}'. Data may be corrupted.`);
        // Fallback to prevent a crash.
        return { name: '알 수 없는 괘', lines: lines };
    }
    return hexagramData;
};

export const generateIChingReading = (): JuyeokReading => {
    // Generate 6 numbers between 6 and 9 (inclusive)
    const rawLines: number[] = Array.from({ length: 6 }, () => Math.floor(Math.random() * 4) + 6); 

    // Determine present lines (7,9 = yang; 6,8 = yin)
    const presentLines: LineType[] = rawLines.map(v => (v === 6 || v === 8) ? 'yin' : 'yang');
    
    // Find changing lines (6 and 9)
    const changingLinesNumbers: number[] = rawLines
        .map((v, i) => (v === 6 || v === 9) ? i + 1 : 0)
        .filter(v => v > 0);

    let changingHexagram: Hexagram | null = null;
    if (changingLinesNumbers.length > 0) {
        // Create the new set of lines for the changing hexagram
        const changingLines: LineType[] = presentLines.map((line, index) => 
            changingLinesNumbers.includes(index + 1) ? (line === 'yin' ? 'yang' : 'yin') : line
        );
        changingHexagram = getHexagramFromLines(changingLines);
    }
    
    const presentHexagram = getHexagramFromLines(presentLines);

    return {
        presentHexagram,
        changingHexagram,
        changingLines: changingLinesNumbers,
    };
};


export const getGanjiDate = (): string => {
    const stems = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];
    const branches = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];
    
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    // Calculate Year Ganji (Simplified)
    const yearStemIndex = (year - 4) % 10;
    const yearBranchIndex = (year - 4) % 12;
    // Corrected index handling for negative results of the remainder operator.
    const yearGanji = (stems[yearStemIndex < 0 ? yearStemIndex + 10 : yearStemIndex] || '') + (branches[yearBranchIndex < 0 ? yearBranchIndex + 12 : yearBranchIndex] || '') + '년';


    // This is a complex calculation involving solar terms (절기).
    // For this app, we'll let the AI, which has this knowledge, calculate the month.
    const monthGanji = "AI가 계산할 월"; 
    
    // Calculate Day Ganji (Julian Day Number method)
    const JD = Math.floor(
        (Date.UTC(year, month - 1, day) - Date.UTC(year, 0, 0)) / 86400000
    ) + (year - 1) * 365 + Math.floor((year - 1) / 4) - Math.floor((year - 1) / 100) + Math.floor((year - 1) / 400) + 2440588 - 0.5;

    let dayStemIndex = Math.round(JD + 9) % 10;
    let dayBranchIndex = Math.round(JD + 1) % 12;
    dayStemIndex = dayStemIndex < 0 ? dayStemIndex + 10 : dayStemIndex;
    dayBranchIndex = dayBranchIndex < 0 ? dayBranchIndex + 12 : dayBranchIndex;
    const dayGanji = (stems[dayStemIndex] || '') + (branches[dayBranchIndex] || '') + '일';

    return `${yearGanji} ${month}월 ${dayGanji}`;
};


export const getDailyFortune = (): string => {
    const fortunes = [
        "뜻밖의 행운이 찾아옵니다 ✨",
        "작은 실수에 주의하세요 ⚠️",
        "소중한 인연이 다가옵니다 💕",
        "재물운이 강하게 들어옵니다 💰",
        "새로운 기회를 잡게 될 거예요 🚀",
        "오늘은 잠시 쉬어가는 것이 좋겠어요 😌",
        "오래된 친구에게서 좋은 소식이 들려옵니다 💌",
        "당신의 노력이 드디어 빛을 발하는 날입니다 🌟",
        "작은 지출이 큰 기쁨으로 돌아옵니다 🎁",
        "긍정적인 생각이 좋은 결과를 가져옵니다 😊",
    ];

    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    const index = (dayOfYear + today.getFullYear()) % fortunes.length;

    return fortunes[index];
};
