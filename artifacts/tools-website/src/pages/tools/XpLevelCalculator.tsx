import { useMemo, useState } from "react";
import {
  BarChart3,
  Copy,
  Gauge,
  ListChecks,
  RotateCcw,
  Shield,
  Swords,
  Target,
  Timer,
  TrendingUp,
} from "lucide-react";
import UtilityToolPageShell from "./UtilityToolPageShell";

type CurveType = "flat" | "linear" | "exponential";

function toNumber(input: string, fallback = 0) {
  const value = Number.parseFloat(input);
  return Number.isFinite(value) ? value : fallback;
}

function positive(input: string, fallback = 0) {
  return Math.max(0, toNumber(input, fallback));
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function format(value: number, digits = 2) {
  return value.toLocaleString("en-US", { maximumFractionDigits: digits });
}

function xpForLevel(level: number, baseXp: number, growthValue: number, curve: CurveType) {
  if (level < 1) return 0;
  if (curve === "flat") return baseXp;
  if (curve === "linear") return baseXp + growthValue * (level - 1);
  return baseXp * Math.pow(1 + growthValue / 100, level - 1);
}

export default function XpLevelCalculator() {
  const [currentLevelInput, setCurrentLevelInput] = useState("12");
  const [targetLevelInput, setTargetLevelInput] = useState("20");
  const [currentXpInput, setCurrentXpInput] = useState("320");
  const [baseXpInput, setBaseXpInput] = useState("500");
  const [growthValueInput, setGrowthValueInput] = useState("75");
  const [curve, setCurve] = useState<CurveType>("linear");
  const [xpPerSessionInput, setXpPerSessionInput] = useState("450");
  const [minutesPerSessionInput, setMinutesPerSessionInput] = useState("18");
  const [copiedLabel, setCopiedLabel] = useState("");

  const progression = useMemo(() => {
    const currentLevel = clamp(Math.round(positive(currentLevelInput, 1)), 1, 999);
    const targetLevel = clamp(Math.round(positive(targetLevelInput, currentLevel + 1)), currentLevel + 1, 999);
    const baseXp = positive(baseXpInput, 500);
    const growthValue = positive(growthValueInput, 0);
    const xpPerSession = positive(xpPerSessionInput, 0);
    const minutesPerSession = positive(minutesPerSessionInput, 0);
    const currentRequirement = xpForLevel(currentLevel, baseXp, growthValue, curve);
    const currentXp = clamp(positive(currentXpInput, 0), 0, currentRequirement);
    const xpToNext = Math.max(0, currentRequirement - currentXp);

    const levels: Array<{
      fromLevel: number;
      toLevel: number;
      xpRequired: number;
      cumulativeFromCurrent: number;
    }> = [];

    let totalRemainingXp = 0;
    for (let level = currentLevel; level < targetLevel; level += 1) {
      const xpRequired = xpForLevel(level, baseXp, growthValue, curve);
      const stepRemaining = level === currentLevel ? Math.max(0, xpRequired - currentXp) : xpRequired;
      totalRemainingXp += stepRemaining;
      levels.push({
        fromLevel: level,
        toLevel: level + 1,
        xpRequired: level === currentLevel ? stepRemaining : xpRequired,
        cumulativeFromCurrent: totalRemainingXp,
      });
    }

    const sessionsNeeded = xpPerSession > 0 ? totalRemainingXp / xpPerSession : 0;
    const wholeSessions = xpPerSession > 0 ? Math.ceil(sessionsNeeded) : 0;
    const totalMinutes = wholeSessions * minutesPerSession;
    const totalHours = totalMinutes / 60;
    const totalDaysAtTwoSessions = wholeSessions / 2;
    const progressPercent = currentRequirement > 0 ? (currentXp / currentRequirement) * 100 : 0;
    const previewLevels = levels.slice(0, 12);

    return {
      currentLevel,
      targetLevel,
      currentXp,
      baseXp,
      growthValue,
      xpPerSession,
      minutesPerSession,
      currentRequirement,
      xpToNext,
      totalRemainingXp,
      sessionsNeeded,
      wholeSessions,
      totalMinutes,
      totalHours,
      totalDaysAtTwoSessions,
      progressPercent,
      previewLevels,
      levels,
    };
  }, [
    baseXpInput,
    currentLevelInput,
    currentXpInput,
    curve,
    growthValueInput,
    minutesPerSessionInput,
    targetLevelInput,
    xpPerSessionInput,
  ]);

  const copyValue = async (label: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedLabel(label);
    window.setTimeout(() => setCopiedLabel(""), 1800);
  };

  const resetAll = () => {
    setCurrentLevelInput("12");
    setTargetLevelInput("20");
    setCurrentXpInput("320");
    setBaseXpInput("500");
    setGrowthValueInput("75");
    setCurve("linear");
    setXpPerSessionInput("450");
    setMinutesPerSessionInput("18");
  };

  const loadFastPreset = () => {
    setCurrentLevelInput("10");
    setTargetLevelInput("25");
    setCurrentXpInput("150");
    setBaseXpInput("400");
    setGrowthValueInput("50");
    setCurve("linear");
    setXpPerSessionInput("600");
    setMinutesPerSessionInput("15");
  };

  const loadRpgPreset = () => {
    setCurrentLevelInput("18");
    setTargetLevelInput("30");
    setCurrentXpInput("900");
    setBaseXpInput("1200");
    setGrowthValueInput("12");
    setCurve("exponential");
    setXpPerSessionInput("950");
    setMinutesPerSessionInput("28");
  };

  const summarySnippet = [
    `Curve: ${curve}`,
    `Current level: ${progression.currentLevel}`,
    `Target level: ${progression.targetLevel}`,
    `XP to next level: ${format(progression.xpToNext, 2)}`,
    `Total XP to target: ${format(progression.totalRemainingXp, 2)}`,
    `Estimated sessions: ${format(progression.wholeSessions, 0)}`,
  ].join("\n");

  const sessionSnippet = [
    `XP per session: ${format(progression.xpPerSession, 2)}`,
    `Minutes per session: ${format(progression.minutesPerSession, 2)}`,
    `Sessions needed: ${format(progression.sessionsNeeded, 2)}`,
    `Rounded sessions: ${format(progression.wholeSessions, 0)}`,
    `Estimated hours: ${format(progression.totalHours, 2)}`,
  ].join("\n");

  const levelTableSnippet = progression.previewLevels
    .map((row) => `L${row.fromLevel} -> L${row.toLevel}: ${format(row.xpRequired, 2)} XP | cumulative ${format(row.cumulativeFromCurrent, 2)}`)
    .join("\n");

  const calculator = (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <button onClick={loadFastPreset} className="rounded-full border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:border-blue-500/40 hover:bg-muted">
          Load Fast Action Curve
        </button>
        <button onClick={loadRpgPreset} className="rounded-full border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:border-blue-500/40 hover:bg-muted">
          Load RPG Grind Curve
        </button>
        <button onClick={resetAll} className="rounded-full border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:border-blue-500/40 hover:bg-muted">
          Reset
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.45fr_0.95fr] gap-5">
        <div className="space-y-5">
          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">XP Progress Inputs</p>
                <p className="text-sm text-muted-foreground">Model your game&apos;s leveling curve, current progress, and target milestone from one workspace.</p>
              </div>
              <Target className="w-5 h-5 text-blue-500" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Current Level</label>
                <input type="number" min="1" step="1" value={currentLevelInput} onChange={(event) => setCurrentLevelInput(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Target Level</label>
                <input type="number" min="2" step="1" value={targetLevelInput} onChange={(event) => setTargetLevelInput(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Current XP In Level</label>
                <input type="number" min="0" step="1" value={currentXpInput} onChange={(event) => setCurrentXpInput(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Curve Type</label>
                <select value={curve} onChange={(event) => setCurve(event.target.value as CurveType)} className="tool-calc-input w-full">
                  <option value="flat">Flat</option>
                  <option value="linear">Linear</option>
                  <option value="exponential">Exponential</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Base XP</label>
                <input type="number" min="1" step="1" value={baseXpInput} onChange={(event) => setBaseXpInput(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">
                  {curve === "exponential" ? "Growth Rate %" : "Growth Per Level"}
                </label>
                <input type="number" min="0" step="1" value={growthValueInput} onChange={(event) => setGrowthValueInput(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">XP Per Session</label>
                <input type="number" min="0" step="1" value={xpPerSessionInput} onChange={(event) => setXpPerSessionInput(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Minutes Per Session</label>
                <input type="number" min="0" step="1" value={minutesPerSessionInput} onChange={(event) => setMinutesPerSessionInput(event.target.value)} className="tool-calc-input w-full" />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">XP To Next</p>
                <p className="mt-2 text-2xl font-black text-foreground">{format(progression.xpToNext, 2)}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Current Level XP Goal</p>
                <p className="mt-2 text-2xl font-black text-foreground">{format(progression.currentRequirement, 2)}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Progress %</p>
                <p className="mt-2 text-2xl font-black text-foreground">{format(progression.progressPercent, 2)}%</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Total XP To Target</p>
                <p className="mt-2 text-2xl font-black text-foreground">{format(progression.totalRemainingXp, 2)}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Session Planning</p>
                <p className="text-sm text-muted-foreground">Turn XP totals into estimated runs, matches, quests, or farming sessions.</p>
              </div>
              <Timer className="w-5 h-5 text-blue-500" />
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Sessions Needed</p>
                <p className="mt-2 text-3xl font-black text-emerald-600">{format(progression.wholeSessions, 0)}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Exact Sessions</p>
                <p className="mt-2 text-2xl font-black text-foreground">{format(progression.sessionsNeeded, 2)}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Estimated Hours</p>
                <p className="mt-2 text-2xl font-black text-foreground">{format(progression.totalHours, 2)}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Days @ 2 Sessions</p>
                <p className="mt-2 text-2xl font-black text-foreground">{format(progression.totalDaysAtTwoSessions, 2)}</p>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
              <p className="text-sm leading-relaxed text-muted-foreground">
                If you consistently earn about <span className="font-bold text-foreground">{format(progression.xpPerSession, 0)} XP</span> per run, you need roughly <span className="font-bold text-foreground">{format(progression.wholeSessions, 0)} sessions</span> to move from level {progression.currentLevel} to level {progression.targetLevel}.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Level-by-Level Table</p>
                <p className="text-sm text-muted-foreground">See how much XP each upcoming level step needs and how the cumulative grind builds over time.</p>
              </div>
              <ListChecks className="w-5 h-5 text-blue-500" />
            </div>

            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/60">
                    <th className="text-left px-4 py-3 font-bold text-foreground">Step</th>
                    <th className="text-left px-4 py-3 font-bold text-foreground">XP Required</th>
                    <th className="text-left px-4 py-3 font-bold text-foreground">Cumulative XP</th>
                    <th className="text-left px-4 py-3 font-bold text-foreground">Sessions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {progression.previewLevels.map((row) => (
                    <tr key={`${row.fromLevel}-${row.toLevel}`}>
                      <td className="px-4 py-3 text-muted-foreground">Level {row.fromLevel} to {row.toLevel}</td>
                      <td className="px-4 py-3 font-mono text-foreground">{format(row.xpRequired, 2)}</td>
                      <td className="px-4 py-3 font-mono text-foreground">{format(row.cumulativeFromCurrent, 2)}</td>
                      <td className="px-4 py-3 font-bold text-blue-600">
                        {progression.xpPerSession > 0 ? format(Math.ceil(row.cumulativeFromCurrent / progression.xpPerSession), 0) : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="mb-4 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Realtime Reading</p>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="font-bold text-foreground">Current Milestone</p>
                <p className="mt-1">You are {format(progression.progressPercent, 2)}% through level {progression.currentLevel}, with about {format(progression.xpToNext, 2)} XP left before the next level-up.</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="font-bold text-foreground">Target Grind</p>
                <p className="mt-1">Reaching level {progression.targetLevel} from your current point needs about {format(progression.totalRemainingXp, 2)} XP across {format(progression.levels.length, 0)} level steps.</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="font-bold text-foreground">Curve Behavior</p>
                <p className="mt-1">
                  {curve === "flat"
                    ? "Flat curves keep every level requirement identical, which is common in arcade or pass-style progression systems."
                    : curve === "linear"
                      ? "Linear curves add a steady amount of XP every level, which keeps progression predictable while still increasing the grind."
                      : "Exponential curves ramp sharply over time, which is common in RPG or prestige systems where later levels are intentionally much slower."}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="mb-4 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Copy-Ready Snippets</p>
            <div className="space-y-3">
              {[
                { label: "XP summary", value: summarySnippet },
                { label: "Session plan", value: sessionSnippet },
                { label: "Level table", value: levelTableSnippet },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-border bg-muted/40 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">{item.label}</p>
                    <button onClick={() => copyValue(item.label, item.value)} className="text-xs font-bold text-blue-600 hover:text-blue-700">
                      {copiedLabel === item.label ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <pre className="mt-2 overflow-x-auto rounded-xl bg-slate-950 p-3 text-xs leading-relaxed text-slate-100">
                    <code>{item.value}</code>
                  </pre>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
            <div className="flex items-start gap-3">
              <Shield className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
              <p className="text-sm leading-relaxed text-muted-foreground">
                This is a generic XP planner, so it works best when your game uses a curve that can be approximated with flat, linear, or exponential growth. Exact proprietary formulas for specific games may still differ slightly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <UtilityToolPageShell
      title="XP Level Calculator"
      seoTitle="Online XP Level Calculator - XP To Next Level and Target Level Planner"
      seoDescription="Free online XP level calculator. Calculate XP to the next level, total XP to a target level, estimated sessions, and custom leveling curves for any game."
      canonical="https://usonlinetools.com/gaming/xp-level-calculator"
      categoryName="Gaming Calculators"
      categoryHref="/category/gaming"
      heroDescription="Use this online XP level calculator to plan progression in any game that uses experience points and level thresholds. Enter your current level, target level, current XP progress, and a custom progression curve to calculate how much XP remains, how many sessions the grind will take, and how the next level steps scale. The page is built for players who want a practical leveling forecast instead of rough guesses."
      heroIcon={<Swords className="w-3.5 h-3.5" />}
      calculatorLabel="XP Progress Planner"
      calculatorDescription="Model flat, linear, or exponential level curves and estimate the grind between your current level and your target."
      calculator={calculator}
      howSteps={[
        {
          title: "Start by defining the level range you actually care about",
          description:
            "A leveling tool becomes useful when it is tied to a real milestone. That could be the next unlock, a prestige threshold, a ranked requirement, or the point where a certain build or class path comes online. By entering your current level and target level first, the calculator focuses the rest of the math on a practical goal instead of producing generic numbers with no decision value.",
        },
        {
          title: "Choose the XP curve that best matches the game you are modeling",
          description:
            "Different games scale progression differently. Some use flat requirements for every stage, some add a steady amount each level, and others ramp aggressively with percentage growth. This page supports flat, linear, and exponential curves so you can model the general shape of most progression systems without needing a game-specific hidden formula.",
        },
        {
          title: "Use current XP and XP per session to estimate real grind time",
          description:
            "The most useful output is not only total XP, but how that XP translates into your normal play rhythm. If you know roughly how much XP you gain per match, dungeon, quest route, or farming session, the calculator can estimate how many runs are left and how many hours the target will likely take. That turns abstract progression math into something you can actually schedule around.",
        },
        {
          title: "Check the level table before committing to a long grind plan",
          description:
            "A long target can look manageable in total but still hide several sharp spikes near the end. The level table makes those spikes visible by showing the XP needed for each step and the cumulative total from your current point. That helps you decide whether the target is realistic now or whether you should stop at an earlier milestone first.",
        },
      ]}
      interpretationCards={[
        {
          title: "XP to next level is your short-term milestone",
          description:
            "This is the amount of experience still needed before the immediate level-up. It is the best number to watch when you only care about the next unlock or skill point.",
        },
        {
          title: "Total XP to target is the real long-term grind number",
          description:
            "If you are planning around a distant milestone, the total remaining XP matters more than the next-level requirement because it captures the full chain of levels still ahead.",
          className: "bg-cyan-500/5 border-cyan-500/20",
        },
        {
          title: "Linear curves are predictable, exponential curves punish late targets",
          description:
            "Linear growth keeps the increase steady, while exponential growth can make the final few levels dramatically slower than the early ones. The farther the target, the more that difference matters.",
          className: "bg-emerald-500/5 border-emerald-500/20",
        },
        {
          title: "Session estimates are only as good as your XP-per-run input",
          description:
            "If your actual gains vary heavily between casual play and optimized farming, update the XP-per-session field to match the style you really plan to use. That keeps the forecast realistic.",
          className: "bg-amber-500/5 border-amber-500/20",
        },
      ]}
      examples={[
        { scenario: "Flat pass progression", input: "500 XP every level, level 12 to 20", output: "Consistent XP steps with a straightforward session count" },
        { scenario: "Linear action game curve", input: "500 base XP with 75 extra XP per level", output: "Each new level costs slightly more than the last" },
        { scenario: "RPG late-game scaling", input: "1,200 base XP with 12% exponential growth", output: "Later levels ramp much faster and dominate the total grind" },
        { scenario: "Session planning", input: "450 XP per session at 18 minutes each", output: "Convert XP totals into runs, hours, and rough days" },
      ]}
      whyChoosePoints={[
        "This XP Level Calculator works as a real progression planner instead of a thin one-line next-level widget. It supports multiple XP curve types, total target-level math, session planning, and a readable level table, which makes it useful for actual grind decisions rather than just curiosity checks.",
        "The curve selector matters because many games do not scale the same way. By supporting flat, linear, and exponential progression, the page can model a wide range of leveling systems without pretending that one formula fits every title.",
        "The session estimator is also important because players do not experience progression in raw XP units. They experience it as matches, quests, dungeon clears, daily routes, or farming loops. Translating the total into sessions and hours makes the output immediately actionable.",
        "The level-by-level table improves planning quality because long grinds are rarely distributed evenly. Seeing where the XP spikes happen makes it easier to decide whether to push for the full target or stop at a closer milestone first.",
        "Everything runs in the browser with no setup. Open the page, model the curve, compare the grind, copy the result, and move on. That is the right interaction pattern for a utility page like this.",
      ]}
      faqs={[
        {
          q: "How do you calculate XP to the next level?",
          a: "The calculator finds the XP requirement for your current level under the selected curve, then subtracts the XP you have already earned inside that level. The result is the remaining XP before the next level-up.",
        },
        {
          q: "Can I use this for any game?",
          a: "Yes, as long as the game's progression can be approximated reasonably by a flat, linear, or exponential XP curve. It is designed as a generic planner rather than a title-specific database.",
        },
        {
          q: "What is the difference between flat, linear, and exponential XP curves?",
          a: "Flat keeps every level cost the same. Linear adds a fixed amount every level. Exponential multiplies the requirement by a percentage growth factor, which makes later levels ramp faster.",
        },
        {
          q: "Why is the total XP to target much larger than the XP to the next level?",
          a: "Because total XP to target includes every remaining level step between your current level and the target level, not just the next one.",
        },
        {
          q: "What should I enter for XP per session?",
          a: "Use the average amount of XP you realistically gain from one match, quest route, dungeon, farming cycle, or whatever repeatable activity you actually plan to use.",
        },
        {
          q: "Why round session counts up?",
          a: "Because if a target needs 10.2 sessions mathematically, you still have to complete an eleventh session in practice unless you stop partway through a run.",
        },
        {
          q: "Can this calculator match an exact game's secret formula?",
          a: "Not always. Many games use custom breakpoints or hidden modifiers. This page is best for planning around a close approximation unless you already know the exact formula and can mirror it with one of the available curves.",
        },
        {
          q: "Does the page save my leveling plans?",
          a: "No. The values remain in the current page state only. The tool is built for fast local planning and comparison.",
        },
      ]}
      relatedTools={[
        { title: "Minecraft Circle Calculator", slug: "minecraft-circle-calculator", icon: <Target className="w-4 h-4" />, color: 145, benefit: "Open another completed gaming utility" },
        { title: "Fortnite DPI Calculator", slug: "fortnite-dpi-calculator", icon: <Gauge className="w-4 h-4" />, color: 210, benefit: "Check another live gaming page" },
        { title: "Roblox Tax Calculator", slug: "roblox-tax-calculator", icon: <TrendingUp className="w-4 h-4" />, color: 35, benefit: "Stay inside the gaming calculator category" },
        { title: "Blox Fruits Calculator", slug: "blox-fruits-calculator", icon: <BarChart3 className="w-4 h-4" />, color: 270, benefit: "Use another progression-style gaming page" },
        { title: "Percentage Calculator", slug: "percentage-calculator", icon: <Copy className="w-4 h-4" />, color: 320, benefit: "Check growth rates and percentage changes" },
        { title: "D&D Dice Roller", slug: "dnd-dice-roller", icon: <RotateCcw className="w-4 h-4" />, color: 20, benefit: "Browse another gaming utility page" },
      ]}
      ctaTitle="Need Another Gaming Progress Tool?"
      ctaDescription="Keep moving through the gaming calculator category and replace more placeholders with real pages."
      ctaHref="/category/gaming"
    />
  );
}
