import React, { useState, useEffect } from 'react';
import type { SavedResult, PhysiognomyResult, PalmistryResult, ImpressionAnalysisResult, AstrologyResult, SajuResult, TarotResult, JuyeokResult, YukhyoResult, CardDraw, JuyeokReading, LineType } from '../types';
import { getSavedResults, deleteResult } from '../utils/storage';
import { Header } from './Header';
import { AnalysisResultLayout } from './shared/AnalysisResultLayout';
import { BoxIcon, TrashIcon, EyeIcon, NoseIcon, MouthIcon, ForeheadIcon, ChinIcon, EarIcon, LifeLineIcon, HeartLineIcon, HeadLineIcon, LineIcon, LightbulbIcon } from './icons';
import { TypingResult } from './TypingResult';
import { motion, Variants } from 'framer-motion';
import { getCardVisualComponent } from '../utils/tarotUtils';


const itemVariants: Variants = { hidden: { opacity: 0, y: 20, scale: 0.95 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } } };

const featureIcons: { [key: string]: React.ReactNode } = {
    '눈': <EyeIcon className="w-8 h-8 text-cyan-400" />, '코': <NoseIcon className="w-8 h-8 text-cyan-400" />,
    '입': <MouthIcon className="w-8 h-8 text-cyan-400" />, '이마': <ForeheadIcon className="w-8 h-8 text-cyan-400" />,
    '턱': <ChinIcon className="w-8 h-8 text-cyan-400" />, '귀': <EarIcon className="w-8 h-8 text-cyan-400" />,
};
const getFeatureIcon = (featureName: string) => Object.keys(featureIcons).find(key => featureName.includes(key)) ? featureIcons[Object.keys(featureIcons).find(key => featureName.includes(key))!] : null;

const lineIcons: { [key: string]: React.ReactNode } = {
    '생명선': <LifeLineIcon className="w-8 h-8 text-cyan-400" />, '감정선': <HeartLineIcon className="w-8 h-8 text-cyan-400" />,
    '두뇌선': <HeadLineIcon className="w-8 h-8 text-cyan-400" />,
};
const getLineIcon = (lineName: string) => Object.keys(lineIcons).find(key => lineName.includes(key)) ? lineIcons[Object.keys(lineIcons).find(key => lineName.includes(key))!] : <LineIcon className="w-8 h-8 text-cyan-400" />;

const HexagramVisual: React.FC<{ lines: LineType[], changingLines?: number[] }> = ({ lines, changingLines = [] }) => (
    <div className="flex flex-col-reverse gap-1.5 items-center">
        {lines.map((line, index) => {
            const isChanging = changingLines.includes(index + 1);
            const lineClasses = "h-1.5 rounded-full transition-all duration-300";
            const changingClasses = isChanging ? "bg-cyan-400 shadow-[0_0_8px] shadow-cyan-400" : "bg-slate-500";
            if (line === 'yang') return <div key={index} className={`w-16 ${lineClasses} ${changingClasses}`} />;
            return <div key={index} className="w-16 flex justify-between"><div className={`w-7 ${lineClasses} ${changingClasses}`} /><div className={`w-7 ${lineClasses} ${changingClasses}`} /></div>
        })}
    </div>
);


const SavedResultsPage: React.FC<{ onBack: () => void; }> = ({ onBack: navigateToHome }) => {
  const [savedResults, setSavedResults] = useState<SavedResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<SavedResult | null>(null);

  useEffect(() => {
    setSavedResults(getSavedResults());
  }, []);

  const handleDelete = (id: string) => {
    if (window.confirm('정말로 이 결과를 삭제하시겠습니까?')) {
      deleteResult(id);
      setSavedResults(getSavedResults());
    }
  };
  
  const renderDetailView = () => {
    if (!selectedResult) return null;

    const props = {
      onBack: () => setSelectedResult(null),
      onReset: () => {}, // No-op
      isSavedView: true,
    };
    
    let content;
    switch (selectedResult.type) {
        case 'face-reader':
            const faceResult = selectedResult.result as PhysiognomyResult;
            content = <AnalysisResultLayout {...props}
                shareText=''
                freeContent={<div className="bg-slate-800/50 border border-slate-700 rounded-2xl shadow-lg p-6 sm:p-8"><h2 className="text-2xl sm:text-3xl font-bold text-cyan-300 mb-4 font-display">관상 분석 요약</h2><TypingResult text={faceResult.summary} className="text-slate-300 leading-relaxed whitespace-pre-wrap" /></div>}
                premiumContent={<div className="mt-8 space-y-6"><h2 className="text-2xl sm:text-3xl font-bold text-cyan-300 mb-2 text-center font-display">상세 분석 리포트</h2><div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6"><h3 className="text-xl font-bold text-white mb-3 font-display">종합 총평</h3><p className="text-slate-400 leading-relaxed whitespace-pre-wrap">{faceResult.premium_analysis.overall_impression}</p></div><div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6"><h3 className="text-xl font-bold text-white mb-3 font-display">직업 및 적성</h3><p className="text-slate-400 leading-relaxed whitespace-pre-wrap">{faceResult.premium_analysis.job_suitability}</p></div><div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6"><h3 className="text-xl font-bold text-white mb-3 font-display">연애 및 대인관계</h3><p className="text-slate-400 leading-relaxed whitespace-pre-wrap">{faceResult.premium_analysis.love_style}</p></div><div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6"><h3 className="text-xl font-bold text-white mb-3 font-display">건강 및 조언</h3><p className="text-slate-400 leading-relaxed whitespace-pre-wrap">{faceResult.premium_analysis.health_advice}</p></div><h3 className="text-xl font-bold text-white pt-4 font-display">부위별 세부 해설</h3><div className="grid grid-cols-1 md:grid-cols-2 gap-6">{faceResult.features.map((feature, index) => (<motion.div variants={itemVariants} key={index} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 flex flex-col gap-4"><div className="flex items-center gap-4">{getFeatureIcon(feature.feature)}<div><h3 className="text-xl font-bold text-white">{feature.feature}</h3><p className="text-sm text-cyan-400 font-semibold">{feature.shape}</p></div></div><p className="text-slate-400 leading-relaxed text-left text-base">{feature.analysis}</p></motion.div>))}</div></div>}
            />;
            break;
        case 'palm-reader':
             const palmResult = selectedResult.result as PalmistryResult;
             content = <AnalysisResultLayout {...props}
                shareText=''
                freeContent={<div className="bg-slate-800/50 border border-slate-700 rounded-2xl shadow-lg p-6 sm:p-8"><h2 className="text-2xl sm:text-3xl font-bold text-cyan-300 mb-4 font-display">손금 분석 요약</h2><TypingResult text={palmResult.summary} className="text-slate-300 leading-relaxed whitespace-pre-wrap" /></div>}
                extraContent={<div className="mt-8 bg-slate-800/50 border border-slate-700 rounded-2xl p-6"><h3 className="text-xl font-bold text-cyan-300 mb-3 font-display">분석 신뢰도</h3><div className="flex items-center gap-4 sm:gap-6"><div className="text-4xl font-bold text-white">{palmResult.credibility_score}%</div><p className="text-slate-400 leading-relaxed text-left text-sm flex-1">{palmResult.credibility_comment}</p></div></div>}
                premiumContent={<div className="space-y-6 mt-8"><h2 className="text-2xl sm:text-3xl font-bold text-cyan-300 font-display text-center">상세 분석 리포트</h2><div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6"><h3 className="text-xl font-bold text-white mb-3 font-display">종합 총평</h3><p className="text-slate-400 leading-relaxed whitespace-pre-wrap">{palmResult.premium_analysis.overall_analysis}</p></div><h3 className="text-xl font-bold text-white pt-4 font-display">주요 손금별 해설</h3>{palmResult.premium_analysis.lines.map((line, index) => (<motion.div variants={itemVariants} key={index} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 flex items-start gap-4"><div className="flex-shrink-0 pt-1">{getLineIcon(line.line_name)}</div><div><h3 className="text-xl font-bold text-white">{line.line_name}</h3><p className="text-slate-400 leading-relaxed mt-2">{line.analysis}</p></div></motion.div>))}</div>}
            />;
            break;
        case 'impression-analyzer':
             const impressionResult = selectedResult.result as ImpressionAnalysisResult;
             content = <AnalysisResultLayout {...props}
                shareText=''
                freeContent={<div className="bg-slate-800/50 border border-slate-700 rounded-2xl shadow-lg p-6 sm:p-8"><h2 className="text-2xl sm:text-3xl font-bold text-cyan-300 mb-4 font-display">첫인상 요약</h2><TypingResult text={impressionResult.summary} className="text-slate-300 leading-relaxed whitespace-pre-wrap" /></div>}
                premiumContent={<div className="mt-8 space-y-6"><h2 className="text-2xl sm:text-3xl font-bold text-cyan-300 mb-2 text-center font-display">상세 분석 리포트</h2><div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6"><h3 className="text-xl font-bold text-white mb-3 font-display">핵심 키워드</h3><div className="flex flex-wrap gap-3">{impressionResult.premium_analysis.keywords.map((keyword, index) => (<span key={index} className="bg-cyan-500/20 text-cyan-300 text-sm font-semibold px-3 py-1 rounded-full"># {keyword}</span>))}</div></div><div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6"><h3 className="text-xl font-bold text-white mb-3 font-display">상세 분석</h3><p className="text-slate-400 leading-relaxed whitespace-pre-wrap">{impressionResult.premium_analysis.detailed_analysis}</p></div><div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6"><h3 className="text-xl font-bold text-white mb-3 font-display">상황별 첫인상</h3><p className="text-slate-400 leading-relaxed whitespace-pre-wrap">{impressionResult.premium_analysis.situational_analysis}</p></div><div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 flex items-start gap-4"><div className="flex-shrink-0 pt-1"><LightbulbIcon className="w-8 h-8 text-yellow-400" /></div><div><h3 className="text-xl font-bold text-yellow-300 mb-2 font-display">첫인상 개선 TIP</h3><p className="text-slate-400 leading-relaxed">{impressionResult.premium_analysis.improvement_tip}</p></div></div></div>}
            />;
            break;
         case 'astrology-reader':
            const astrologyResult = selectedResult.result as AstrologyResult;
            content = <AnalysisResultLayout {...props}
                shareText=''
                freeContent={<><div className="bg-slate-800/50 border border-slate-700 rounded-2xl shadow-lg p-6 sm:p-8 text-center"><h2 className="text-2xl sm:text-3xl font-bold text-cyan-300 mb-2 font-display">당신의 별자리</h2><p className="text-4xl sm:text-5xl font-bold text-white mb-4">{astrologyResult.zodiac_sign}</p><div className="flex justify-center gap-6 text-slate-300"><span>수호성: {astrologyResult.ruling_planet}</span><span>속성: {astrologyResult.element}</span></div></div><div className="space-y-6 mt-8"><div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6"><h3 className="text-xl font-bold text-white mb-3 font-display">핵심 성격 요약</h3><TypingResult text={astrologyResult.summary} className="text-slate-400 leading-relaxed" /></div></div></>}
                premiumContent={<div className="space-y-6 mt-8"><h2 className="text-2xl sm:text-3xl font-bold text-cyan-300 mb-4 font-display text-center">상세 운세 리포트</h2><div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6"><h3 className="text-xl font-bold text-white mb-3 font-display">상세 성격 분석</h3><p className="text-slate-400 leading-relaxed">{astrologyResult.premium_analysis.personality}</p></div><div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6"><h3 className="text-xl font-bold text-white mb-3 font-display">연애 및 관계</h3><p className="text-slate-400 leading-relaxed">{astrologyResult.premium_analysis.love_life}</p></div><div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6"><h3 className="text-xl font-bold text-white mb-3 font-display">직업 및 경력</h3><p className="text-slate-400 leading-relaxed">{astrologyResult.premium_analysis.work_career}</p></div><div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6"><h3 className="text-xl font-bold text-white mb-3 font-display">건강운</h3><p className="text-slate-400 leading-relaxed">{astrologyResult.premium_analysis.health_fortune}</p></div></div>}
            />;
            break;
         case 'saju-analyzer':
            const sajuResult = selectedResult.result as SajuResult;
            content = <AnalysisResultLayout {...props}
                shareText=''
                freeContent={<div className="bg-slate-800/50 border border-slate-700 rounded-2xl shadow-lg p-6 sm:p-8"><h2 className="text-2xl sm:text-3xl font-bold text-cyan-300 mb-4 font-display">오늘의 운세 요약</h2><TypingResult text={sajuResult.daily_fortune_summary} className="text-slate-300 leading-relaxed whitespace-pre-wrap" /></div>}
                premiumContent={<div className="space-y-6 mt-8"><h2 className="text-2xl sm:text-3xl font-bold text-cyan-300 mb-4 font-display text-center">사주 심층 분석 리포트</h2><div className="bg-slate-800/50 border border-slate-700 rounded-2xl shadow-lg p-6 sm:p-8"><h3 className="text-xl font-bold text-white mb-3 font-display">사주 명식</h3><div className="grid grid-cols-4 gap-2 text-center text-white rounded-lg overflow-hidden border border-slate-700"><div className="bg-slate-700/50 p-2 font-bold">시주</div><div className="bg-slate-700/50 p-2 font-bold">일주</div><div className="bg-slate-700/50 p-2 font-bold">월주</div><div className="bg-slate-700/50 p-2 font-bold">연주</div><div className="bg-slate-800 p-4 text-lg">{sajuResult.four_pillars.hour_pillar}</div><div className="bg-cyan-500/10 border-2 border-cyan-500 p-4 text-lg font-bold text-cyan-300">{sajuResult.four_pillars.day_pillar}</div><div className="bg-slate-800 p-4 text-lg">{sajuResult.four_pillars.month_pillar}</div><div className="bg-slate-800 p-4 text-lg">{sajuResult.four_pillars.year_pillar}</div></div><p className="text-center text-sm text-slate-400 mt-3">일간(日干)은 <strong className="text-cyan-400">{sajuResult.day_master}</strong> 입니다.</p></div><div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6"><h3 className="text-xl font-bold text-white mb-3 font-display">종합 분석</h3><p className="text-slate-400 leading-relaxed whitespace-pre-wrap">{sajuResult.premium_analysis.overall_analysis}</p></div><div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6"><h3 className="text-xl font-bold text-white mb-3 font-display">오행의 균형</h3><p className="text-slate-400 leading-relaxed whitespace-pre-wrap">{sajuResult.premium_analysis.elemental_balance}</p></div><div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6"><h3 className="text-xl font-bold text-white mb-3 font-display">분야별 상세운</h3><p className="text-slate-400 leading-relaxed whitespace-pre-wrap"><strong className="text-cyan-400">연애운:</strong> {sajuResult.premium_analysis.love_fortune}</p><p className="text-slate-400 leading-relaxed whitespace-pre-wrap mt-2"><strong className="text-cyan-400">재물운:</strong> {sajuResult.premium_analysis.money_fortune}</p><p className="text-slate-400 leading-relaxed whitespace-pre-wrap mt-2"><strong className="text-cyan-400">직업운:</strong> {sajuResult.premium_analysis.career_fortune}</p><p className="text-slate-400 leading-relaxed whitespace-pre-wrap mt-2"><strong className="text-cyan-400">건강운:</strong> {sajuResult.premium_analysis.health_fortune}</p></div><div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6"><h3 className="text-xl font-bold text-white mb-3 font-display">삶의 조언</h3><p className="text-slate-400 leading-relaxed whitespace-pre-wrap">{sajuResult.premium_analysis.life_advice}</p></div></div>}
            />;
            break;
        case 'tarot-reader':
            const tarotResult = selectedResult.result as TarotResult;
            const drawnCards = selectedResult.context?.drawnCards as CardDraw[] || [];
            content = <>
                <div className="flex flex-row flex-wrap justify-center items-start gap-x-6 sm:gap-x-8 gap-y-4 mb-8">
                    {drawnCards.map((card, index) => {
                        const VisualComponent = getCardVisualComponent(card.name);
                        return (<div key={index} className="flex flex-col items-center gap-3"><div className="w-24 h-40 sm:w-32 sm:h-52 bg-slate-800 border-2 border-slate-500 rounded-lg flex flex-col justify-between p-2 overflow-hidden"><div className="text-left text-xs sm:text-sm font-bold text-white">{card.name}</div><div className={`flex-grow flex justify-center items-center ${card.orientation === '역방향' ? 'transform rotate-180' : ''}`}><VisualComponent className="w-12 h-12 sm:w-16 sm:h-16 text-cyan-400/70" /></div><div className={`text-right text-xs sm:text-sm font-semibold ${card.orientation === '역방향' ? 'transform rotate-180' : ''}`}>{card.name}</div></div><div className="text-center"><p className="font-bold text-white text-sm sm:text-base">{card.name}</p><p className={`text-xs sm:text-sm ${card.orientation === '역방향' ? 'text-yellow-400' : 'text-cyan-400'}`}>{card.orientation}</p></div></div>)
                    })}
                </div>
                <AnalysisResultLayout {...props}
                    shareText=''
                    freeContent={<div className="bg-slate-800/50 border border-slate-700 rounded-2xl shadow-lg p-6 sm:p-8"><h2 className="text-2xl sm:text-3xl font-bold text-cyan-300 mb-4 font-display">핵심 리딩 요약</h2><TypingResult text={tarotResult.overall_summary} className="text-slate-300 leading-relaxed whitespace-pre-wrap" /></div>}
                    premiumContent={<div className="space-y-6 mt-8"><h2 className="text-2xl sm:text-3xl font-bold text-cyan-300 mb-4 font-display text-center">상세 리딩 리포트</h2><div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6"><h3 className="text-xl font-bold text-white mb-3 font-display">심층 리딩</h3><p className="text-slate-400 leading-relaxed whitespace-pre-wrap">{tarotResult.premium_reading.detailed_reading}</p></div><div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6"><h3 className="text-xl font-bold text-white mb-3 font-display">상황별 조언</h3><p className="text-slate-400 leading-relaxed whitespace-pre-wrap"><strong className="text-cyan-400">연애:</strong> {tarotResult.premium_reading.situational_advice.love}</p><p className="text-slate-400 leading-relaxed whitespace-pre-wrap mt-2"><strong className="text-cyan-400">금전:</strong> {tarotResult.premium_reading.situational_advice.money}</p><p className="text-slate-400 leading-relaxed whitespace-pre-wrap mt-2"><strong className="text-cyan-400">직업:</strong> {tarotResult.premium_reading.situational_advice.work}</p></div><h3 className="text-xl font-bold text-white pt-4 font-display text-center">카드별 상세 해석</h3>{tarotResult.premium_reading.cards.map((interp, index) => (<div key={index} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 sm:p-8 flex flex-col gap-4"><div className="text-center"><h3 className="text-2xl font-bold text-white font-display">{interp.card_name}</h3><p className={`text-lg font-medium ${interp.orientation === '역방향' ? 'text-yellow-400' : 'text-cyan-400'}`}>({interp.orientation})</p></div><p className="text-slate-400 leading-relaxed whitespace-pre-wrap">{interp.meaning}</p></div>))}</div>}
                />
            </>;
            break;
         case 'juyeok-reader':
            const juyeokResult = selectedResult.result as JuyeokResult;
            const reading = selectedResult.context?.reading as JuyeokReading;
            if (!reading) return <div className="text-center p-8"><p>주역 괘 정보가 없어 결과를 표시할 수 없습니다.</p><button onClick={() => setSelectedResult(null)} className="mt-4 px-4 py-2 bg-slate-600 rounded-lg">목록으로</button></div>;
            content = <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center bg-slate-800/50 border border-slate-700 rounded-2xl shadow-lg p-6 sm:p-8 mb-8 w-full max-w-4xl"><div className="flex flex-col items-center gap-2"><h3 className="text-lg font-bold text-slate-300">현재 (本卦)</h3><HexagramVisual lines={reading.presentHexagram.lines} changingLines={reading.changingLines} /><p className="text-xl font-semibold text-white mt-2">{juyeokResult.present_hexagram_name}</p></div><div className="flex justify-center items-center"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-cyan-400 transform md:rotate-0 rotate-90"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></div><div className="flex flex-col items-center gap-2"><h3 className="text-lg font-bold text-slate-300">미래 (之卦)</h3>{reading.changingHexagram ? (<><HexagramVisual lines={reading.changingHexagram.lines} /><p className="text-xl font-semibold text-white mt-2">{juyeokResult.changing_hexagram_name}</p></>) : (<div className="h-full flex items-center"><p className="text-slate-400">변화 없음</p></div>)}</div></div>
                <AnalysisResultLayout {...props}
                    shareText=''
                    freeContent={<div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 sm:p-8"><h2 className="text-2xl sm:text-3xl font-bold text-cyan-300 mb-4 font-display">핵심 요약</h2><TypingResult text={juyeokResult.summary} className="text-slate-300 leading-relaxed whitespace-pre-wrap" /></div>}
                    premiumContent={<div className="space-y-6 mt-8"><h2 className="text-2xl sm:text-3xl font-bold text-cyan-300 mb-2 text-center font-display">상세 분석 리포트</h2><div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6"><h3 className="text-xl font-bold text-white mb-3 font-display">종합 해설</h3><p className="text-slate-400 leading-relaxed whitespace-pre-wrap">{juyeokResult.premium_analysis.detailed_interpretation}</p></div>{juyeokResult.premium_analysis.changing_lines_interpretation && (<div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6"><h3 className="text-xl font-bold text-white mb-3 font-display">변화의 핵심 (變爻)</h3><p className="text-slate-400 leading-relaxed whitespace-pre-wrap">{juyeokResult.premium_analysis.changing_lines_interpretation}</p></div>)}<div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6"><h3 className="text-xl font-bold text-white mb-3 font-display">상황별 조언</h3><p className="text-slate-400 leading-relaxed whitespace-pre-wrap">{juyeokResult.premium_analysis.situational_advice}</p></div></div>}
                />
            </>;
            break;
        case 'yukhyo-analyzer':
            const yukhyoResult = selectedResult.result as YukhyoResult;
            content = <AnalysisResultLayout {...props}
                shareText=''
                freeContent={<><div className="bg-slate-800/50 border border-slate-700 rounded-2xl shadow-lg p-6 sm:p-8"><h2 className="text-2xl sm:text-3xl font-bold text-cyan-300 mb-1 font-display">육효 분석</h2><p className="text-slate-400 mb-4">{yukhyoResult.ganji_date} 기준</p><div className="overflow-x-auto"><table className="w-full text-center text-white border-collapse"><thead className="bg-slate-700/50"><tr><th className="p-3 border border-slate-600">괘</th><th className="p-3 border border-slate-600">효</th><th className="p-3 border border-slate-600">세/응</th><th className="p-3 border border-slate-600">육친</th><th className="p-3 border border-slate-600">지지</th></tr></thead><tbody className="bg-slate-800">{yukhyoResult.lines.sort((a,b)=>b.line_number-a.line_number).map(l=><tr key={l.line_number}>{l.line_number===6 && <td rowSpan={6} className="p-3 border border-slate-600 font-bold text-xl">{yukhyoResult.hexagram_name}</td>}<td className="p-3 border border-slate-600">{l.line_number}효</td><td className={`p-3 border border-slate-600 font-bold ${l.marker==='세(世)'?'text-cyan-400':l.marker==='응(應)'?'text-yellow-400':''}`}>{l.marker||'-'}</td><td className="p-3 border border-slate-600">{l.six_relatives}</td><td className="p-3 border border-slate-600">{l.earthly_branch}</td></tr>)}</tbody></table></div></div><div className="space-y-6 mt-8"><div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6"><h3 className="text-xl font-bold text-white mb-3 font-display">핵심 분석 (용신)</h3><TypingResult text={yukhyoResult.yongsin} className="text-slate-400 leading-relaxed whitespace-pre-wrap" /></div></div></>}
                premiumContent={<div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 mt-8"><h3 className="text-xl font-bold text-white mb-3 font-display">종합 해설 및 조언</h3><p className="text-slate-400 leading-relaxed whitespace-pre-wrap">{yukhyoResult.overall_interpretation}</p></div>}
            />;
            break;
        default:
            return <div className="text-center p-8"><p>알 수 없는 결과 타입입니다.</p><button onClick={() => setSelectedResult(null)} className="mt-4 px-4 py-2 bg-slate-600 rounded-lg">목록으로</button></div>;
    }
    return content;
  };

  if (selectedResult) {
    return <main className="flex-grow flex flex-col items-center text-center py-10">{renderDetailView()}</main>;
  }

  return (
    <>
      <Header
        icon={<BoxIcon className="w-10 h-10 text-cyan-400" />}
        title="나의 운세함"
        description="저장된 분석 결과를 다시 확인하고 관리할 수 있습니다."
        onBack={navigateToHome}
      />
      <main className="flex-grow flex flex-col items-center text-center py-10 w-full max-w-4xl mx-auto">
        {savedResults.length > 0 ? (
          <div className="space-y-4 w-full">
            {savedResults.map((item) => (
              <div key={item.id} className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 flex items-center justify-between gap-4">
                <div className="text-left">
                  <p className="font-bold text-white text-lg">{item.typeName}</p>
                  <p className="text-sm text-slate-400">{new Date(item.date).toLocaleString('ko-KR')}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedResult(item)}
                    className="py-2 px-4 bg-cyan-500 text-slate-900 font-bold rounded-lg shadow-md transition-colors duration-300 hover:bg-cyan-400"
                    aria-label={`${item.typeName} 결과 보기`}
                  >
                    보기
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 bg-red-500/20 text-red-400 rounded-lg transition-colors duration-300 hover:bg-red-500/40 hover:text-red-300"
                    aria-label={`${item.typeName} 결과 삭제`}
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-slate-400 text-lg">저장된 결과가 없습니다.</p>
            <p className="text-slate-500 mt-2">분석 결과를 저장하고 나중에 다시 확인해보세요.</p>
          </div>
        )}
      </main>
    </>
  );
};

export default SavedResultsPage;