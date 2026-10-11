import React, { useState, useEffect } from 'react';
import { AssessmentResult, ProfessionMatch, AICareerAnalysis } from '../types';
import { generateCareerAnalysis, careerAIError } from '../lib/careerAI';
import {
  Sparkles,
  Trophy,
  CheckCircle2,
  Building2,
  DollarSign,
  Brain,
  Compass,
  BookmarkPlus,
  BookmarkCheck,
  Bot,
  MapPin,
  Layers,
  Award,
  ChevronRight,
  RefreshCw,
  Activity,
  Target,
  Info,
} from 'lucide-react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

interface ResultsViewProps {
  result: AssessmentResult;
  onRetake: () => void;
  onOpenChat: () => void;
  onOpenCompare: (professions: ProfessionMatch[]) => void;
  onSaveResult: (res: AssessmentResult) => void;
  isSaved: boolean;
}

const ACCENT = '#A855F7';
const BENCHMARK_COLOR = '#38BDF8';

const TRAIT_INFO: Record<string, { label: string; desc: string; icon: string }> = {
  analytical: {
    label: 'Analytical',
    desc: 'Quantitative reasoning, logic, and data analysis.',
    icon: '📊',
  },
  creative: {
    label: 'Creative',
    desc: 'Innovation, original ideation, and design thinking.',
    icon: '💡',
  },
  interpersonal: {
    label: 'Interpersonal',
    desc: 'Empathy, negotiation, collaboration, and client relation.',
    icon: '🤝',
  },
  technical: {
    label: 'Technical',
    desc: 'Engineering systems, software, and technical crafts.',
    icon: '⚙️',
  },
  leadership: {
    label: 'Leadership',
    desc: 'Strategic direction, decision-making, and motivation.',
    icon: '👑',
  },
  operational: {
    label: 'Operational',
    desc: 'Process optimization, execution discipline, and reliability.',
    icon: '📈',
  },
};

export const ResultsView: React.FC<ResultsViewProps> = ({
  result,
  onRetake: _onRetake,
  onOpenChat,
  onOpenCompare,
  onSaveResult,
  isSaved,
}) => {
  const [selectedProfession, setSelectedProfession] = useState<ProfessionMatch>(result.topMatches[0]);
  const [aiAnalysis, setAiAnalysis] = useState<AICareerAnalysis | null>(result.aiCareerAnalysis || null);
  const [loadingAi, setLoadingAi] = useState<boolean>(!result.aiCareerAnalysis);
  const [aiError, setAiError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'matches' | 'traits' | 'roadmap'>('matches');
  const [showBenchmark, setShowBenchmark] = useState<boolean>(true);
  const [spiderGridType, setSpiderGridType] = useState<'polygon' | 'circle'>('polygon');
  const [activeTraitKey, setActiveTraitKey] = useState<string | null>(null);
  const [heroBenchmark, setHeroBenchmark] = useState<boolean>(false);

  // Trait Data formatted for Recharts RadarChart
  const traitRadarData = [
    {
      trait: 'Analytical',
      key: 'analytical',
      score: result.traitTotals.analytical ?? 0,
      target: selectedProfession?.traitScores?.analytical ?? 70,
      fullMark: 100,
      description: TRAIT_INFO.analytical.desc,
    },
    {
      trait: 'Creative',
      key: 'creative',
      score: result.traitTotals.creative ?? 0,
      target: selectedProfession?.traitScores?.creative ?? 70,
      fullMark: 100,
      description: TRAIT_INFO.creative.desc,
    },
    {
      trait: 'Interpersonal',
      key: 'interpersonal',
      score: result.traitTotals.interpersonal ?? 0,
      target: selectedProfession?.traitScores?.interpersonal ?? 70,
      fullMark: 100,
      description: TRAIT_INFO.interpersonal.desc,
    },
    {
      trait: 'Technical',
      key: 'technical',
      score: result.traitTotals.technical ?? 0,
      target: selectedProfession?.traitScores?.technical ?? 70,
      fullMark: 100,
      description: TRAIT_INFO.technical.desc,
    },
    {
      trait: 'Leadership',
      key: 'leadership',
      score: result.traitTotals.leadership ?? 0,
      target: selectedProfession?.traitScores?.leadership ?? 70,
      fullMark: 100,
      description: TRAIT_INFO.leadership.desc,
    },
    {
      trait: 'Operational',
      key: 'operational',
      score: result.traitTotals.operational ?? 0,
      target: selectedProfession?.traitScores?.operational ?? 70,
      fullMark: 100,
      description: TRAIT_INFO.operational.desc,
    },
  ];

  // Derive trait balance metrics for instant "at a glance" understanding
  const sortedTraits = [...traitRadarData].sort((a, b) => b.score - a.score);
  const dominantTrait = sortedTraits[0];
  const secondaryTrait = sortedTraits[1];
  const lowestTrait = sortedTraits[sortedTraits.length - 1];
  const scoreSpread = dominantTrait.score - lowestTrait.score;
  const avgScore = Math.round(
    traitRadarData.reduce((acc, curr) => acc + curr.score, 0) / traitRadarData.length
  );

  const balanceProfileType =
    scoreSpread <= 18
      ? 'Versatile Multi-Disciplinary'
      : scoreSpread <= 32
      ? 'Focused Hybrid'
      : 'High-Specialist';

  // Fetch AI Career Analysis on mount if not already present
  useEffect(() => {
    let active = true;
    setAiAnalysis(result.aiCareerAnalysis || null);
    setAiError(null);
    if (!result.aiCareerAnalysis) {
      setLoadingAi(true);
      generateCareerAnalysis(result)
        .then((data) => {
          if (active) {
            setAiAnalysis(data);
            result.aiCareerAnalysis = data;
          }
        })
        .catch((err) => {
          console.error('Failed to load AI career analysis:', err);
          if (active) setAiError(careerAIError(err));
        })
        .finally(() => { if (active) setLoadingAi(false); });
    } else {
      setLoadingAi(false);
    }
    return () => { active = false; };
  }, [result]);

  const topThreeMatches = result.topMatches.slice(0, 3);

  // Custom Tooltip component for Recharts Radar
  const CustomRadarTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-[#0c0c0e] border border-[var(--accent)] p-3 text-xs font-mono shadow-[0_0_15px_color-mix(in_srgb,var(--accent)_30%,transparent)] max-w-[220px]">
          <div className="flex items-center justify-between border-b border-[rgba(224,224,230,0.1)] pb-1.5 mb-1.5 font-mono">
            <span className="font-bold text-[var(--accent)] uppercase tracking-wider text-[0.7rem]">
              {item.trait}
            </span>
            <span className="px-1.5 py-0.5 bg-[var(--accent)]/10 text-[var(--accent)] text-[0.65rem] font-bold border border-[var(--accent)]/30">
              {item.score} / 100
            </span>
          </div>
          <p className="text-[var(--ink)] opacity-70 text-[0.65rem] leading-relaxed mb-1.5">
            {item.description}
          </p>
          {payload.some((p: any) => p.dataKey === 'target') && (
            <div className="pt-1.5 border-t border-[rgba(224,224,230,0.1)] text-[0.65rem] text-[#38BDF8] font-mono space-y-0.5">
              <div className="flex items-center justify-between">
                <span className="opacity-75">Target Benchmark:</span>
                <span className="font-bold shrink-0">{item.target} / 100</span>
              </div>
              <div className="text-[0.6rem] opacity-60 truncate max-w-[200px]" title={selectedProfession.profession}>
                {selectedProfession.profession}
              </div>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  // Custom tick renderer for Spider Chart axes to clearly display trait names and numerical scores (0-100)
  const renderSpiderAxisTick = ({ payload, x, y, cx, cy }: any) => {
    const item = traitRadarData.find((d) => d.trait === payload.value);
    if (!item) return null;

    const dx = x - cx;
    const dy = y - cy;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    const offsetX = x + (dx / dist) * 12;
    const offsetY = y + (dy / dist) * 12;
    const isInspected = activeTraitKey === item.key;

    return (
      <g
        transform={`translate(${offsetX},${offsetY})`}
        className="cursor-pointer"
        onClick={() => setActiveTraitKey(activeTraitKey === item.key ? null : item.key)}
      >
        <text
          textAnchor="middle"
          dominantBaseline="central"
          fill={isInspected ? 'var(--accent)' : 'var(--ink)'}
          fontSize={10}
          fontFamily="Space Mono, monospace"
          fontWeight={isInspected ? 800 : 700}
        >
          <tspan x={0} dy="-4">{item.trait}</tspan>
          <tspan x={0} dy="13" fill={isInspected ? '#38BDF8' : 'var(--accent)'} fontSize={9} fontWeight={800}>
            {item.score}/100
          </tspan>
        </text>
      </g>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-6 py-4 text-[var(--ink)] font-mono animate-fade-in overflow-hidden">
      
      {/* ============================================================== */}
      {/* HERO SECTION: TECHNICAL INDUSTRIAL BANNER & RADAR CHART       */}
      {/* ============================================================== */}
      <div className="relative overflow-hidden bg-[var(--bg)] border border-[rgba(224,224,230,0.15)] p-5 sm:p-8 lg:p-10 mb-8 shadow-2xl">
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Primary Fit Summary (7 cols) with strict min-w-0 boundary */}
          <div className="lg:col-span-7 min-w-0 space-y-5 overflow-hidden">
            
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 text-[0.65rem] font-bold tracking-[0.2em] uppercase bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/30 flex items-center gap-1.5 font-mono">
                <Trophy className="w-3.5 h-3.5" /> Assessment Complete
              </span>
              <span className="px-3 py-1 text-[0.65rem] font-bold tracking-[0.2em] uppercase bg-[rgba(255,255,255,0.03)] border border-[rgba(224,224,230,0.1)] text-[var(--ink)] opacity-70 font-mono">
                Level: {result.learnerLevel.replace(/_/g, ' ').toUpperCase()}
              </span>
            </div>

            <div className="min-w-0">
              <span className="text-[0.65rem] uppercase tracking-[0.25em] text-[var(--accent)] font-mono font-bold block mb-1.5">
                Highest Alignment Vector
              </span>
              <h1
                className="font-syne font-extrabold text-2xl sm:text-3xl lg:text-4xl xl:text-[2.6rem] uppercase tracking-tight text-[var(--ink)] leading-[1.08] break-words hyphens-auto max-w-full"
                title={result.topMatches[0].profession}
              >
                {result.topMatches[0].profession}
              </h1>
            </div>

            <p className="text-[var(--ink)] opacity-70 text-xs sm:text-sm leading-relaxed max-w-xl font-mono">
              Based on your response parameters, your cognitive and operational profile demonstrates primary alignment in{' '}
              <span className="text-[var(--accent)] font-bold">
                {topThreeMatches.map((m) => m.category).filter((v, i, a) => a.indexOf(v) === i).join(', ')}
              </span>.
            </p>

            {/* Profile Balance Highlights (At a Glance) */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[rgba(224,224,230,0.1)] max-w-lg">
              <div className="bg-[rgba(255,255,255,0.01)] border border-[rgba(224,224,230,0.1)] p-3">
                <span className="text-[0.6rem] uppercase tracking-[0.15em] opacity-40 block font-mono">
                  Dominant Trait
                </span>
                <span className="text-sm font-bold text-[var(--accent)] block mt-0.5">
                  {dominantTrait.trait}
                </span>
                <span className="text-[0.65rem] opacity-60 font-mono">
                  {dominantTrait.score}/100 score
                </span>
              </div>

              <div className="bg-[rgba(255,255,255,0.01)] border border-[rgba(224,224,230,0.1)] p-3">
                <span className="text-[0.6rem] uppercase tracking-[0.15em] opacity-40 block font-mono">
                  Secondary Driver
                </span>
                <span className="text-sm font-bold text-[var(--ink)] block mt-0.5">
                  {secondaryTrait.trait}
                </span>
                <span className="text-[0.65rem] opacity-60 font-mono">
                  {secondaryTrait.score}/100 score
                </span>
              </div>

              <div className="bg-[rgba(255,255,255,0.01)] border border-[rgba(224,224,230,0.1)] p-3">
                <span className="text-[0.6rem] uppercase tracking-[0.15em] opacity-40 block font-mono">
                  Profile Shape
                </span>
                <span className="text-xs font-bold text-[var(--accent)] block mt-1 truncate" title={balanceProfileType}>
                  {balanceProfileType}
                </span>
                <span className="text-[0.65rem] opacity-60 font-mono">
                  Avg: {avgScore}/100
                </span>
              </div>
            </div>

            {/* Top Quick Actions */}
            <div className="flex flex-wrap gap-2.5 pt-2 font-mono">
              <button
                onClick={() => onSaveResult(result)}
                className={`flex items-center justify-center gap-2 px-4 py-2.5 text-[0.65rem] uppercase tracking-[0.2em] font-bold transition-all border cursor-pointer ${
                  isSaved
                    ? 'bg-[var(--accent)] border-[var(--accent)] text-black'
                    : 'bg-transparent border-[rgba(224,224,230,0.15)] text-[var(--ink)] hover:border-[var(--accent)] hover:text-[var(--accent)]'
                }`}
              >
                {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <BookmarkPlus className="w-4 h-4" />}
                {isSaved ? 'Result Saved' : 'Bookmark Result'}
              </button>

              <button
                onClick={onOpenChat}
                className="flex items-center justify-center gap-2 px-4 py-2.5 text-[0.65rem] uppercase tracking-[0.2em] font-bold bg-transparent border-2 border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-black transition-all cursor-pointer shadow-[0_0_15px_color-mix(in_srgb,var(--accent)_25%,transparent)]"
              >
                <Bot className="w-4 h-4" />
                Ask AI Coach
              </button>

              <button
                onClick={() => onOpenCompare(topThreeMatches)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 text-[0.65rem] uppercase tracking-[0.2em] font-bold bg-transparent border border-[rgba(224,224,230,0.15)] text-[var(--ink)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all cursor-pointer"
              >
                <Layers className="w-4 h-4 text-[var(--accent)]" />
                Compare Top 3
              </button>

              <button
                onClick={() => setActiveTab('traits')}
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 text-[0.65rem] uppercase tracking-[0.2em] font-bold text-[var(--ink)] opacity-50 hover:opacity-100 hover:text-[var(--accent)] transition-colors cursor-pointer ml-auto"
              >
                <Activity className="w-3.5 h-3.5 text-[var(--accent)]" />
                Full Analysis →
              </button>
            </div>

          </div>

          {/* Right Column: Visual Trait Totals Spider / Radar Chart (5 cols) */}
          <div className="lg:col-span-5 min-w-0 overflow-hidden">
            <div className="bg-[rgba(255,255,255,0.01)] border border-[rgba(224,224,230,0.12)] p-4 sm:p-5 relative overflow-hidden shadow-inner">
              
              {/* Radar Chart Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 border-b border-[rgba(224,224,230,0.1)] pb-3">
                <div className="flex items-center gap-2 min-w-0">
                  <Activity className="w-4 h-4 text-[var(--accent)] shrink-0" />
                  <div className="min-w-0">
                    <h3 className="text-xs font-syne font-bold uppercase tracking-wider text-[var(--ink)] flex items-center gap-2 truncate">
                      Spider Chart // Trait Radar
                    </h3>
                    <p className="text-[0.6rem] opacity-40 uppercase tracking-[0.15em] font-mono truncate">
                      Visualizing Calculated Trait Totals
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 self-start sm:self-auto shrink-0">
                  <button
                    onClick={() => setSpiderGridType(spiderGridType === 'polygon' ? 'circle' : 'polygon')}
                    className="text-[0.55rem] font-mono px-2 py-0.5 border border-[rgba(224,224,230,0.15)] hover:border-[var(--accent)] text-[var(--ink)] opacity-70 hover:opacity-100 transition-all uppercase tracking-wider cursor-pointer"
                    title="Toggle Polygon Spider Web vs Concentric Rings"
                  >
                    {spiderGridType === 'polygon' ? 'Web: Polygon' : 'Web: Rings'}
                  </button>

                  <button
                    onClick={() => setHeroBenchmark(!heroBenchmark)}
                    className={`text-[0.55rem] font-mono px-2 py-0.5 border transition-all uppercase tracking-wider cursor-pointer ${
                      heroBenchmark
                        ? 'border-[#38BDF8] bg-[#38BDF8]/10 text-[#38BDF8] font-bold'
                        : 'border-[rgba(224,224,230,0.15)] text-[var(--ink)] opacity-70 hover:opacity-100'
                    }`}
                    title="Toggle Role Benchmark Target"
                  >
                    Benchmark
                  </button>
                </div>
              </div>

              {/* Recharts Spider / Radar Chart with safe outerRadius to prevent overlap */}
              <div className="h-[270px] sm:h-[300px] w-full relative min-h-[260px]">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={260}>
                  <RadarChart
                    cx="50%"
                    cy="50%"
                    outerRadius="60%"
                    data={traitRadarData}
                  >
                    <PolarGrid
                      gridType={spiderGridType}
                      stroke="rgba(224, 224, 230, 0.12)"
                      strokeDasharray="2 2"
                    />
                    <PolarAngleAxis
                      dataKey="trait"
                      stroke={ACCENT}
                      tick={renderSpiderAxisTick}
                    />
                    <PolarRadiusAxis
                      angle={30}
                      domain={[0, 100]}
                      stroke="rgba(224, 224, 230, 0.12)"
                      tick={{
                        fill: 'rgba(224, 224, 230, 0.45)',
                        fontSize: 8,
                      }}
                    />
                    <Tooltip content={<CustomRadarTooltip />} />
                    <Radar
                      name="Your Traits"
                      dataKey="score"
                      stroke={ACCENT}
                      strokeWidth={2.5}
                      fill={ACCENT}
                      fillOpacity={0.28}
                      dot={{
                        r: 4,
                        fill: ACCENT,
                        stroke: '#0c0c0e',
                        strokeWidth: 2,
                      }}
                    />
                    {heroBenchmark && (
                      <Radar
                        name="Target Benchmark"
                        dataKey="target"
                        stroke={BENCHMARK_COLOR}
                        strokeWidth={2}
                        strokeDasharray="3 3"
                        fill={BENCHMARK_COLOR}
                        fillOpacity={0.12}
                        dot={{
                          r: 3,
                          fill: BENCHMARK_COLOR,
                          stroke: '#0c0c0e',
                          strokeWidth: 1.5,
                        }}
                      />
                    )}
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Mini Trait Pill Legend underneath the chart */}
              <div className="grid grid-cols-3 gap-1.5 pt-3 border-t border-[rgba(224,224,230,0.1)] font-mono">
                {traitRadarData.map((item) => {
                  const isInspected = activeTraitKey === item.key;
                  return (
                    <button
                      key={item.key}
                      onClick={() => setActiveTraitKey(isInspected ? null : item.key)}
                      className={`flex items-center justify-between px-2 py-1 text-[0.6rem] border transition-all cursor-pointer text-left ${
                        isInspected
                          ? 'bg-[var(--accent)] text-black border-[var(--accent)] font-bold'
                          : 'bg-[rgba(255,255,255,0.02)] border-[rgba(224,224,230,0.08)] text-[var(--ink)] hover:border-[var(--accent)]/40'
                      }`}
                    >
                      <span className="opacity-80 truncate">{item.trait}</span>
                      <span className={isInspected ? 'text-black font-extrabold' : 'text-[var(--accent)] font-bold ml-1'}>
                        {item.score}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-[0.6rem] opacity-40 mt-2 px-1 font-mono">
                <span>Click node / badge to inspect</span>
                <span className="text-[var(--accent)] font-semibold">Scale: 0–100 Max</span>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* ============================================================== */}
      {/* NAVIGATION TABS                                                */}
      {/* ============================================================== */}
      <div className="flex items-center gap-2 border-b border-[rgba(224,224,230,0.1)] mb-8 overflow-x-auto pb-1 font-mono">
        <button
          onClick={() => setActiveTab('matches')}
          className={`px-4 py-3 text-[0.65rem] uppercase tracking-[0.2em] font-bold transition-all border-b-2 shrink-0 cursor-pointer ${
            activeTab === 'matches'
              ? 'border-[var(--accent)] text-[var(--accent)] bg-[var(--accent)]/5'
              : 'border-transparent opacity-40 hover:opacity-100'
          }`}
        >
          🎯 Top Matches ({result.topMatches.length})
        </button>

        <button
          onClick={() => setActiveTab('traits')}
          className={`px-4 py-3 text-[0.65rem] uppercase tracking-[0.2em] font-bold transition-all border-b-2 shrink-0 cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'traits'
              ? 'border-[var(--accent)] text-[var(--accent)] bg-[var(--accent)]/5'
              : 'border-transparent opacity-40 hover:opacity-100'
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-[var(--accent)]" />
          📊 Skill & Trait Breakdown
        </button>

        <button
          onClick={() => setActiveTab('roadmap')}
          className={`px-4 py-3 text-[0.65rem] uppercase tracking-[0.2em] font-bold transition-all border-b-2 shrink-0 cursor-pointer ${
            activeTab === 'roadmap'
              ? 'border-[var(--accent)] text-[var(--accent)] bg-[var(--accent)]/5'
              : 'border-transparent opacity-40 hover:opacity-100'
          }`}
        >
          🚀 AI Roadmap
        </button>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: MATCHES & TARGET JOB TITLES                             */}
      {/* ============================================================== */}
      {activeTab === 'matches' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: List of Matched Professions */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-[0.65rem] font-mono font-bold uppercase tracking-[0.2em] opacity-40 flex items-center gap-2">
              <Award className="w-4 h-4 text-[var(--accent)]" />
              Ranked Matches
            </h3>

            {result.topMatches.map((prof) => {
              const isSelected = selectedProfession.id === prof.id;
              return (
                <div
                  key={prof.id}
                  onClick={() => setSelectedProfession(prof)}
                  className={`p-5 border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[var(--accent)] text-black border-[var(--accent)]'
                      : 'bg-[var(--bg)] border-[rgba(224,224,230,0.1)] text-[var(--ink)] hover:bg-[rgba(255,255,255,0.03)]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span
                        className={`text-[0.6rem] font-mono font-bold px-2 py-0.5 uppercase tracking-[0.2em] border ${
                          isSelected
                            ? 'border-black text-black'
                            : 'border-[var(--accent)]/30 text-[var(--accent)] bg-[var(--accent)]/10'
                        }`}
                      >
                        {prof.category}
                      </span>
                      <h4 className="mt-2 text-lg font-syne font-bold uppercase leading-tight">
                        {prof.profession}
                      </h4>
                    </div>

                    {/* Match Score Badge */}
                    <div className="text-right shrink-0">
                      <div
                        className={`px-3 py-1 font-mono font-bold text-xs border ${
                          isSelected
                            ? 'border-black text-black bg-black/10'
                            : 'border-[var(--accent)] text-[var(--accent)] bg-[var(--bg)]'
                        }`}
                      >
                        {prof.matchPercentage}%
                      </div>
                    </div>
                  </div>

                  {/* Matching Job Titles Snippet */}
                  <div className={`mt-4 pt-3 border-t ${isSelected ? 'border-black/20' : 'border-[rgba(224,224,230,0.1)]'}`}>
                    <p className={`text-[0.6rem] font-mono font-bold mb-1.5 uppercase tracking-[0.1em] ${isSelected ? 'text-black opacity-80' : 'opacity-40'}`}>
                      Target Job Titles ({prof.matchingJobTitles.length}):
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {prof.matchingJobTitles.slice(0, 3).map((title, idx) => (
                        <span
                          key={idx}
                          className={`text-[0.65rem] font-mono px-2 py-0.5 border ${
                            isSelected ? 'border-black/30 text-black bg-black/10' : 'border-[rgba(224,224,230,0.15)] bg-[rgba(255,255,255,0.02)] text-[var(--ink)] opacity-85'
                          }`}
                        >
                          {title}
                        </span>
                      ))}
                      {prof.matchingJobTitles.length > 3 && (
                        <span className={`text-[0.65rem] font-mono px-1 py-0.5 ${isSelected ? 'text-black opacity-60' : 'opacity-30'}`}>
                          +{prof.matchingJobTitles.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Deep Dive Card into Selected Profession */}
          <div className="lg:col-span-7">
            <div className="sticky top-20 bg-[var(--bg)] border border-[rgba(224,224,230,0.15)] p-6 sm:p-8 space-y-6 shadow-xl">
              
              {/* Header */}
              <div className="flex items-start justify-between gap-4 pb-5 border-b border-[rgba(224,224,230,0.1)]">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 font-mono text-[0.65rem]">
                    <span className="font-bold uppercase tracking-[0.2em] text-[var(--accent)]">
                      {selectedProfession.category}
                    </span>
                    <span className="opacity-30">•</span>
                    <span className="opacity-70">
                      {selectedProfession.growthOutlook}
                    </span>
                  </div>
                  <h2 className="mt-1 text-2xl sm:text-3xl font-syne font-bold uppercase text-[var(--ink)] break-words hyphens-auto leading-tight" title={selectedProfession.profession}>
                    {selectedProfession.profession}
                  </h2>
                </div>

                <div className="text-right">
                  <span className="text-[0.65rem] opacity-50 font-mono font-bold uppercase tracking-[0.1em]">Estimated Salary</span>
                  <div className="text-base font-mono font-bold text-[var(--accent)] flex items-center justify-end gap-1">
                    <DollarSign className="w-4 h-4" />
                    {selectedProfession.salaryRange}
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-[var(--ink)] opacity-70 leading-relaxed font-mono">
                {selectedProfession.description}
              </p>

              {/* Specific Job Titles Fitted Into */}
              <div>
                <h4 className="text-[0.65rem] font-mono font-bold uppercase tracking-[0.2em] opacity-40 mb-3 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[var(--accent)]" />
                  Exact Job Titles You Fit Best Into:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedProfession.matchingJobTitles.map((title, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-[rgba(255,255,255,0.02)] border border-[rgba(224,224,230,0.1)] flex items-center gap-2 text-xs font-mono text-[var(--ink)]"
                    >
                      <span className="w-1.5 h-1.5 bg-[var(--accent)]" />
                      {title}
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Skills */}
              <div>
                <h4 className="text-[0.65rem] font-mono font-bold uppercase tracking-[0.2em] opacity-40 mb-3 flex items-center gap-1.5">
                  <Brain className="w-4 h-4 text-[var(--accent)]" />
                  Key In-Demand Skills to Master:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProfession.keySkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-[var(--accent)]/10 text-[var(--accent)] text-[0.65rem] font-mono font-bold uppercase tracking-[0.1em] border border-[var(--accent)]/30"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Typical Workplace Environments */}
              <div>
                <h4 className="text-[0.65rem] font-mono font-bold uppercase tracking-[0.2em] opacity-40 mb-3 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-[var(--accent)]" />
                  Where You Will Fit Best:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProfession.typicalEnvironments.map((env, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-[rgba(255,255,255,0.02)] text-[var(--ink)] text-[0.65rem] font-mono font-bold uppercase tracking-[0.1em] flex items-center gap-1.5 border border-[rgba(224,224,230,0.1)]"
                    >
                      <Building2 className="w-3 h-3 text-[var(--accent)]" />
                      {env}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="pt-4 border-t border-[rgba(224,224,230,0.1)] flex items-center justify-between">
                <button
                  onClick={onOpenChat}
                  className="flex items-center gap-2 font-mono text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[var(--accent)] hover:text-[var(--ink)] transition-colors cursor-pointer"
                >
                  Ask AI Coach how to transition into this role <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: DETAILED SKILL & TRAIT BREAKDOWN WITH RADAR COMPARISON   */}
      {/* ============================================================== */}
      {activeTab === 'traits' && (
        <div className="space-y-8 font-mono">
          
          {/* Main Grid: Radar Chart + Bar Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Expanded Radar Chart Card (7 cols) */}
            <div className="lg:col-span-7 bg-[var(--bg)] border border-[rgba(224,224,230,0.15)] p-6 sm:p-8 space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[rgba(224,224,230,0.1)] pb-4">
                <div>
                  <h3 className="font-syne font-bold text-xl sm:text-2xl text-[var(--ink)] uppercase flex items-center gap-2">
                    <Activity className="w-5 h-5 text-[var(--accent)]" />
                    Multidimensional Skill Radar
                  </h3>
                  <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] opacity-40 mt-1">
                    Comprehensive Profile Balance & Role Benchmark
                  </p>
                </div>

                {/* Benchmark Toggle */}
                <button
                  onClick={() => setShowBenchmark(!showBenchmark)}
                  className={`flex items-center gap-2 px-3 py-1.5 text-[0.65rem] font-mono font-bold uppercase tracking-wider border cursor-pointer transition-all ${
                    showBenchmark
                      ? 'bg-[#38BDF8]/10 border-[#38BDF8] text-[#38BDF8]'
                      : 'bg-transparent border-[rgba(224,224,230,0.15)] opacity-40 hover:opacity-100'
                  }`}
                >
                  <Target className="w-3.5 h-3.5" />
                  {showBenchmark ? 'Benchmark Overlay ON' : 'Show Benchmark Overlay'}
                </button>
              </div>

              {/* Chart Legend */}
              <div className="flex items-center gap-6 text-xs border-b border-[rgba(224,224,230,0.06)] pb-3 font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-[var(--accent)] inline-block" />
                  <span className="font-bold text-[0.65rem] uppercase">Your Trait Totals</span>
                </div>
                {showBenchmark && (
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-3 h-3 bg-[#38BDF8] inline-block shrink-0" />
                    <span
                      className="text-[#38BDF8] font-bold text-[0.65rem] uppercase truncate max-w-[200px] sm:max-w-[320px]"
                      title={`${selectedProfession.profession} Target`}
                    >
                      {selectedProfession.profession} Target
                    </span>
                  </div>
                )}
              </div>

              {/* Large Radar Chart */}
              <div className="h-80 sm:h-96 w-full min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={300}>
                  <RadarChart cx="50%" cy="50%" outerRadius="66%" data={traitRadarData}>
                    <PolarGrid
                      gridType={spiderGridType}
                      stroke="rgba(224, 224, 230, 0.12)"
                      strokeDasharray="3 3"
                    />
                    <PolarAngleAxis
                      dataKey="trait"
                      stroke={ACCENT}
                      tick={renderSpiderAxisTick}
                    />
                    <PolarRadiusAxis
                      angle={30}
                      domain={[0, 100]}
                      stroke="rgba(224, 224, 230, 0.12)"
                      tick={{ fill: 'rgba(224, 224, 230, 0.4)', fontSize: 9 }}
                    />
                    <Tooltip content={<CustomRadarTooltip />} />
                    <Radar
                      name="Your Traits"
                      dataKey="score"
                      stroke={ACCENT}
                      strokeWidth={2.5}
                      fill={ACCENT}
                      fillOpacity={0.25}
                      dot={{ r: 4, fill: ACCENT, stroke: '#0c0c0e', strokeWidth: 2 }}
                    />
                    {showBenchmark && (
                      <Radar
                        name="Role Target"
                        dataKey="target"
                        stroke={BENCHMARK_COLOR}
                        strokeWidth={2}
                        strokeDasharray="4 4"
                        fill={BENCHMARK_COLOR}
                        fillOpacity={0.12}
                        dot={{ r: 3, fill: BENCHMARK_COLOR, stroke: '#0c0c0e', strokeWidth: 1.5 }}
                      />
                    )}
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Balance Insights Box */}
              <div className="bg-[rgba(255,255,255,0.01)] border border-[rgba(224,224,230,0.1)] p-4 space-y-2">
                <div className="flex items-center gap-2 text-[var(--accent)] text-xs font-mono font-bold uppercase">
                  <Info className="w-4 h-4" />
                  Understanding Your Profile Balance
                </div>
                <p className="text-xs opacity-70 leading-relaxed font-mono">
                  Your profile displays a <span className="text-[var(--accent)] font-bold">{balanceProfileType}</span> pattern.
                  Your core driver is <span className="text-[var(--accent)] font-bold">{dominantTrait.trait} ({dominantTrait.score}/100)</span>,
                  supported by <span className="text-[var(--ink)] font-bold">{secondaryTrait.trait} ({secondaryTrait.score}/100)</span>.
                  {showBenchmark && (
                    <> When aligned against <span className="text-[#38BDF8] font-bold">{selectedProfession.profession}</span>, your strongest surplus is in{' '}
                    <span className="text-[var(--accent)] font-bold">{dominantTrait.trait}</span>.</>
                  )}
                </p>
              </div>

            </div>

            {/* Score Distribution & Quantified Bars (5 cols) */}
            <div className="lg:col-span-5 bg-[var(--bg)] border border-[rgba(224,224,230,0.15)] p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="font-syne font-bold text-xl text-[var(--ink)] uppercase mb-1">
                  Trait Score Distribution
                </h3>
                <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] opacity-40">
                  Normalized scores out of 100.
                </p>
              </div>

              <div className="space-y-4">
                {traitRadarData.map((item) => {
                  const ratingTier =
                    item.score >= 85
                      ? 'Exceptional'
                      : item.score >= 70
                      ? 'Strong'
                      : item.score >= 50
                      ? 'Capable'
                      : 'Developing';

                  return (
                    <div key={item.key} className="p-3 bg-[rgba(255,255,255,0.01)] border border-[rgba(224,224,230,0.08)] space-y-2">
                      <div className="flex justify-between items-center text-[0.65rem] font-mono font-bold uppercase tracking-[0.1em]">
                        <span className="flex items-center gap-1.5">
                          <span>{TRAIT_INFO[item.key]?.icon}</span>
                          {item.trait}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[0.6rem] opacity-40 tracking-wider">
                            {ratingTier}
                          </span>
                          <span className="text-[var(--accent)] font-mono">{item.score} / 100</span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full h-1 bg-[rgba(224,224,230,0.08)] overflow-hidden">
                        <div
                          className="h-full transition-all duration-500 bg-[var(--accent)]"
                          style={{ width: `${item.score}%` }}
                        />
                      </div>

                      <p className="text-[0.65rem] opacity-50 leading-tight font-mono">
                        {item.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* 6-Card Detailed Trait Competency Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {traitRadarData.map((item) => (
              <div
                key={item.key}
                className="p-5 bg-[var(--bg)] border border-[rgba(224,224,230,0.1)] space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl">{TRAIT_INFO[item.key]?.icon}</span>
                  <span className="px-2.5 py-0.5 bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/30 font-mono font-bold text-xs">
                    {item.score}%
                  </span>
                </div>
                <h4 className="font-syne font-bold text-base uppercase text-[var(--ink)]">
                  {item.trait} Dimension
                </h4>
                <p className="text-xs opacity-60 leading-relaxed font-mono">
                  {item.description}
                </p>
                <div className="text-[0.65rem] text-[var(--accent)] font-mono pt-2 border-t border-[rgba(224,224,230,0.06)]">
                  Primary Roles: {item.score >= 70 ? 'Natural Core Driver' : 'Supporting Factor'}
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: AI PERSONAL ROADMAP                                     */}
      {/* ============================================================== */}
      {activeTab === 'roadmap' && (
        <div className="space-y-8 font-mono">
          
          {aiError && <p role="alert" className="p-4 text-sm text-red-400">{aiError}</p>}
          {loadingAi && (
            <div className="p-12 text-center bg-[var(--bg)] border border-[rgba(224,224,230,0.15)] space-y-4">
              <div className="w-12 h-12 bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center mx-auto animate-spin border border-[var(--accent)]/30">
                <RefreshCw className="w-6 h-6" />
              </div>
              <p className="text-base font-syne font-bold uppercase text-[var(--ink)]">
                Synthesizing Insights...
              </p>
            </div>
          )}

          {aiAnalysis && (
            <div className="space-y-8">
              
              {/* Archetype Headline Card */}
              <div className="p-6 sm:p-8 bg-[var(--bg)] border border-[rgba(224,224,230,0.15)]">
                <span className="font-mono text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[var(--accent)] flex items-center gap-1.5 mb-2">
                  <Sparkles className="w-4 h-4" />
                  Your Career Archetype
                </span>
                <h2 className="font-syne font-extrabold text-2xl sm:text-3xl uppercase text-[var(--ink)] mb-3">
                  "{aiAnalysis.headline}"
                </h2>
                <p className="text-xs sm:text-sm opacity-70 leading-relaxed font-mono">
                  {aiAnalysis.summary}
                </p>
              </div>

              {/* 2-Column Fit Insights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Why You Fit */}
                <div className="p-6 bg-[var(--bg)] border border-[rgba(224,224,230,0.15)] space-y-3 font-mono">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--ink)] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[var(--accent)]" />
                    Why Your Mindset Fits:
                  </h4>
                  <ul className="space-y-2 text-xs opacity-70 font-mono">
                    {aiAnalysis.whyYouFit?.map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-[var(--accent)] font-bold">•</span>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Best Environment & Day in the Life */}
                <div className="p-6 bg-[var(--bg)] border border-[rgba(224,224,230,0.15)] space-y-4 font-mono">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--ink)] flex items-center gap-2 mb-1">
                      <Building2 className="w-4 h-4 text-[var(--accent)]" />
                      Ideal Work Environment:
                    </h4>
                    <p className="text-xs opacity-70 leading-relaxed">
                      {aiAnalysis.bestEnvironment}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--ink)] flex items-center gap-2 mb-1">
                      <Compass className="w-4 h-4 text-[var(--accent)]" />
                      A Day in the Life:
                    </h4>
                    <p className="text-xs opacity-70 leading-relaxed">
                      {aiAnalysis.dayInTheLife}
                    </p>
                  </div>
                </div>

              </div>

              {/* Actionable Phase Roadmap */}
              <div className="bg-[var(--bg)] border border-[rgba(224,224,230,0.15)] p-6 sm:p-8 space-y-6">
                <h3 className="font-syne font-bold text-xl uppercase text-[var(--ink)] flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[var(--accent)]" />
                  Actionable Roadmap
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono">
                  {aiAnalysis.actionableRoadmap?.map((phase, idx) => (
                    <div key={idx} className="p-5 border border-[rgba(224,224,230,0.1)] bg-[rgba(255,255,255,0.01)] space-y-3">
                      <span className="font-mono text-[0.6rem] font-bold px-2 py-0.5 bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/30 uppercase tracking-[0.2em]">
                        {phase.phase}
                      </span>
                      <h4 className="font-syne font-bold text-sm uppercase text-[var(--ink)]">
                        {phase.title}
                      </h4>
                      <ul className="space-y-2 text-xs opacity-70 pt-2 border-t border-[rgba(224,224,230,0.1)]">
                        {phase.steps.map((step, sIdx) => (
                          <li key={sIdx} className="flex items-start gap-2">
                            <span className="text-[var(--accent)] font-bold">{sIdx + 1}.</span>
                            {step}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
};
