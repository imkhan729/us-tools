import { useMemo, useState } from "react";
import {
  BarChart3,
  Clock3,
  Copy,
  Hammer,
  RotateCcw,
  Shield,
  Target,
  TrendingUp,
  Wallet,
} from "lucide-react";
import UtilityToolPageShell from "./UtilityToolPageShell";

type GrowthMode = "flat" | "linear" | "percent";

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

function stepValue(base: number, growth: number, index: number, mode: GrowthMode) {
  if (mode === "flat") return base;
  if (mode === "linear") return base + growth * index;
  return base * Math.pow(1 + growth / 100, index);
}

export default function ClashOfClansUpgradeCalculator() {
  const [currentLevelInput, setCurrentLevelInput] = useState("9");
  const [targetLevelInput, setTargetLevelInput] = useState("14");
  const [baseCostInput, setBaseCostInput] = useState("2500000");
  const [costGrowthInput, setCostGrowthInput] = useState("650000");
  const [baseDaysInput, setBaseDaysInput] = useState("3");
  const [timeGrowthInput, setTimeGrowthInput] = useState("0.75");
  const [growthMode, setGrowthMode] = useState<GrowthMode>("linear");
  const [builderCountInput, setBuilderCountInput] = useState("5");
  const [dailyResourceInput, setDailyResourceInput] = useState("1800000");
  const [copiedLabel, setCopiedLabel] = useState("");

  const plan = useMemo(() => {
    const currentLevel = clamp(Math.round(positive(currentLevelInput, 1)), 1, 99);
    const targetLevel = clamp(Math.round(positive(targetLevelInput, currentLevel + 1)), currentLevel + 1, 99);
    const baseCost = positive(baseCostInput, 0);
    const costGrowth = positive(costGrowthInput, 0);
    const baseDays = positive(baseDaysInput, 0);
    const timeGrowth = positive(timeGrowthInput, 0);
    const builderCount = clamp(Math.round(positive(builderCountInput, 1)), 1, 8);
    const dailyResource = positive(dailyResourceInput, 0);

    const steps: Array<{
      fromLevel: number;
      toLevel: number;
      cost: number;
      days: number;
      cumulativeCost: number;
      cumulativeDays: number;
    }> = [];

    let totalCost = 0;
    let totalDays = 0;

    for (let level = currentLevel; level < targetLevel; level += 1) {
      const index = level - currentLevel;
      const cost = stepValue(baseCost, costGrowth, index, growthMode);
      const days = stepValue(baseDays, timeGrowth, index, growthMode);
      totalCost += cost;
      totalDays += days;
      steps.push({
        fromLevel: level,
        toLevel: level + 1,
        cost,
        days,
        cumulativeCost: totalCost,
        cumulativeDays: totalDays,
      });
    }

    const parallelDays = builderCount > 0 ? totalDays / builderCount : totalDays;
    const dailyNeededForPureFarm = parallelDays > 0 ? totalCost / parallelDays : 0;
    const resourceDays = dailyResource > 0 ? totalCost / dailyResource : 0;
    const bottleneck = dailyResource > 0 && resourceDays > parallelDays ? "Resources" : "Builders / time";

    return {
      currentLevel,
      targetLevel,
      baseCost,
      costGrowth,
      baseDays,
      timeGrowth,
      builderCount,
      dailyResource,
      steps,
      totalCost,
      totalDays,
      parallelDays,
      dailyNeededForPureFarm,
      resourceDays,
      bottleneck,
      previewSteps: steps.slice(0, 10),
    };
  }, [
    baseCostInput,
    baseDaysInput,
    builderCountInput,
    costGrowthInput,
    currentLevelInput,
    dailyResourceInput,
    growthMode,
    targetLevelInput,
    timeGrowthInput,
  ]);

  const copyValue = async (label: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedLabel(label);
    window.setTimeout(() => setCopiedLabel(""), 1800);
  };

  const resetAll = () => {
    setCurrentLevelInput("9");
    setTargetLevelInput("14");
    setBaseCostInput("2500000");
    setCostGrowthInput("650000");
    setBaseDaysInput("3");
    setTimeGrowthInput("0.75");
    setGrowthMode("linear");
    setBuilderCountInput("5");
    setDailyResourceInput("1800000");
  };

  const loadHeroPreset = () => {
    setCurrentLevelInput("35");
    setTargetLevelInput("45");
    setBaseCostInput("95000");
    setCostGrowthInput("6000");
    setBaseDaysInput("4");
    setTimeGrowthInput("0.4");
    setGrowthMode("linear");
    setBuilderCountInput("1");
    setDailyResourceInput("420000");
  };

  const loadDefensePreset = () => {
    setCurrentLevelInput("12");
    setTargetLevelInput("17");
    setBaseCostInput("4500000");
    setCostGrowthInput("12");
    setBaseDaysInput("5");
    setTimeGrowthInput("9");
    setGrowthMode("percent");
    setBuilderCountInput("6");
    setDailyResourceInput("2500000");
  };

  const summarySnippet = [
    `Current level: ${plan.currentLevel}`,
    `Target level: ${plan.targetLevel}`,
    `Growth mode: ${growthMode}`,
    `Total cost: ${format(plan.totalCost, 0)}`,
    `Total builder days: ${format(plan.totalDays, 2)}`,
    `Parallel days: ${format(plan.parallelDays, 2)}`,
  ].join("\n");

  const bottleneckSnippet = [
    `Builders: ${format(plan.builderCount, 0)}`,
    `Daily resource income: ${format(plan.dailyResource, 0)}`,
    `Resource days needed: ${format(plan.resourceDays, 2)}`,
    `Parallel builder days: ${format(plan.parallelDays, 2)}`,
    `Likely bottleneck: ${plan.bottleneck}`,
  ].join("\n");

  const stepsSnippet = plan.previewSteps
    .map((step) => `L${step.fromLevel} -> L${step.toLevel}: cost ${format(step.cost, 0)} | days ${format(step.days, 2)} | cumulative ${format(step.cumulativeCost, 0)}`)
    .join("\n");

  const calculator = (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <button onClick={loadHeroPreset} className="rounded-full border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:border-blue-500/40 hover:bg-muted">
          Load Hero Ladder
        </button>
        <button onClick={loadDefensePreset} className="rounded-full border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:border-blue-500/40 hover:bg-muted">
          Load Defense Chain
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
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Upgrade Planning Inputs</p>
                <p className="text-sm text-muted-foreground">Model a chain of Clash of Clans-style upgrades with custom cost and time scaling from the current level to the target.</p>
              </div>
              <Hammer className="w-5 h-5 text-blue-500" />
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
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Base Cost</label>
                <input type="number" min="0" step="1" value={baseCostInput} onChange={(event) => setBaseCostInput(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Cost Growth</label>
                <input type="number" min="0" step="1" value={costGrowthInput} onChange={(event) => setCostGrowthInput(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Base Days</label>
                <input type="number" min="0" step="0.1" value={baseDaysInput} onChange={(event) => setBaseDaysInput(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Time Growth</label>
                <input type="number" min="0" step="0.1" value={timeGrowthInput} onChange={(event) => setTimeGrowthInput(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Growth Mode</label>
                <select value={growthMode} onChange={(event) => setGrowthMode(event.target.value as GrowthMode)} className="tool-calc-input w-full">
                  <option value="flat">Flat</option>
                  <option value="linear">Linear</option>
                  <option value="percent">Percent</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Builders</label>
                <input type="number" min="1" step="1" value={builderCountInput} onChange={(event) => setBuilderCountInput(event.target.value)} className="tool-calc-input w-full" />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Daily Resource Income</label>
                <input type="number" min="0" step="1" value={dailyResourceInput} onChange={(event) => setDailyResourceInput(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Likely Bottleneck</p>
                <p className="mt-2 text-2xl font-black text-foreground">{plan.bottleneck}</p>
                <p className="mt-1 text-xs text-muted-foreground">This compares builder-time pace against your entered farming pace.</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Total Cost</p>
                <p className="mt-2 text-2xl font-black text-emerald-600">{format(plan.totalCost, 0)}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Total Builder Days</p>
                <p className="mt-2 text-2xl font-black text-foreground">{format(plan.totalDays, 2)}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Parallel Days</p>
                <p className="mt-2 text-2xl font-black text-foreground">{format(plan.parallelDays, 2)}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Needed / Day</p>
                <p className="mt-2 text-2xl font-black text-foreground">{format(plan.dailyNeededForPureFarm, 0)}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Upgrade Steps</p>
                <p className="text-sm text-muted-foreground">See how each level jump contributes to the total cost and total time from your current point.</p>
              </div>
              <Target className="w-5 h-5 text-blue-500" />
            </div>

            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/60">
                    <th className="px-4 py-3 text-left font-bold text-foreground">Step</th>
                    <th className="px-4 py-3 text-left font-bold text-foreground">Cost</th>
                    <th className="px-4 py-3 text-left font-bold text-foreground">Days</th>
                    <th className="px-4 py-3 text-left font-bold text-foreground">Cumulative Cost</th>
                    <th className="px-4 py-3 text-left font-bold text-foreground">Cumulative Days</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {plan.previewSteps.map((step) => (
                    <tr key={`${step.fromLevel}-${step.toLevel}`}>
                      <td className="px-4 py-3 text-muted-foreground">L{step.fromLevel} to L{step.toLevel}</td>
                      <td className="px-4 py-3 font-mono text-foreground">{format(step.cost, 0)}</td>
                      <td className="px-4 py-3 font-mono text-foreground">{format(step.days, 2)}</td>
                      <td className="px-4 py-3 font-mono text-foreground">{format(step.cumulativeCost, 0)}</td>
                      <td className="px-4 py-3 font-bold text-blue-600">{format(step.cumulativeDays, 2)}</td>
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
                <p className="font-bold text-foreground">Upgrade Burden</p>
                <p className="mt-1">Moving from level {plan.currentLevel} to {plan.targetLevel} needs about {format(plan.totalCost, 0)} total resource and {format(plan.totalDays, 2)} total builder days before parallel builder savings are considered.</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="font-bold text-foreground">Builder View</p>
                <p className="mt-1">With {format(plan.builderCount, 0)} builders working efficiently, the time side compresses to about {format(plan.parallelDays, 2)} real days if resources keep up.</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="font-bold text-foreground">Farm Pressure</p>
                <p className="mt-1">At about {format(plan.dailyResource, 0)} resource per day, the farm path alone would take roughly {format(plan.resourceDays, 2)} days, so the likely bottleneck here is <span className="font-bold text-foreground">{plan.bottleneck}</span>.</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="mb-4 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Copy-Ready Snippets</p>
            <div className="space-y-3">
              {[
                { label: "Upgrade summary", value: summarySnippet },
                { label: "Bottleneck summary", value: bottleneckSnippet },
                { label: "Step table", value: stepsSnippet },
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
                This is a generic Clash of Clans-style upgrade planner. Exact in-game costs and timers depend on the specific building, hero, lab item, and Town Hall context, so use the page as a planning model unless you enter the exact values yourself.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <UtilityToolPageShell
      title="Clash of Clans Upgrade Calculator"
      seoTitle="Online Clash of Clans Upgrade Calculator - Cost, Time, and Builder Planning"
      seoDescription="Free online Clash of Clans upgrade calculator. Estimate total upgrade cost, total time, builder parallel days, and farming pressure from one CoC-style upgrade planner."
      canonical="https://usonlinetools.com/gaming/clash-of-clans-upgrade-calculator"
      categoryName="Gaming Calculators"
      categoryHref="/category/gaming"
      heroDescription="Use this online Clash of Clans upgrade calculator to plan how expensive and how slow a chain of upgrades will be before you commit builders or resources in game. Enter your current and target level, the cost and time scaling pattern, available builders, and daily farming pace to estimate total resource need, total builder days, parallel completion time, and whether your real bottleneck is builders or resources."
      heroIcon={<Hammer className="w-3.5 h-3.5" />}
      calculatorLabel="CoC Upgrade Planner"
      calculatorDescription="Model a custom Clash of Clans-style upgrade ladder, then compare builder-time pressure against farming pace."
      calculator={calculator}
      howSteps={[
        {
          title: "Start with the current level and the level you actually want to reach",
          description:
            "Upgrade planning becomes useful only when it is tied to a real target. That target might be a defense breakpoint, a hero milestone, a lab unlock, or the next Town Hall push requirement. By setting a current level and a target level first, the page keeps the rest of the math focused on one practical ladder instead of producing disconnected upgrade numbers.",
        },
        {
          title: "Choose a growth mode that matches the way the upgrade scales",
          description:
            "Some upgrade chains increase in a roughly flat way, some rise by a steady amount each level, and others ramp harder in percentage terms. The page supports flat, linear, and percent growth so you can model the broad shape of most building, hero, or research progression paths without needing a hardcoded table for every single item in the game.",
        },
        {
          title: "Compare raw builder days with real parallel time",
          description:
            "Total builder days tell you how much upgrade time exists in the chain overall, but they do not tell you how long the process takes once you spread work across several builders. That is why the page also calculates parallel days from your builder count. This usually gives a much better estimate of the real-world timeline if your resource flow is healthy enough to keep those builders busy.",
        },
        {
          title: "Use daily resource income to see whether farming or builders are the real cap",
          description:
            "Many players assume builders are always the limiting factor, but that is not always true. If your daily income is too low relative to the total cost, the upgrade path can become resource-gated even with idle builder capacity available. The bottleneck output compares those two pressures directly so the plan is easier to trust.",
        },
      ]}
      interpretationCards={[
        {
          title: "Total cost shows the full resource burden of the ladder",
          description:
            "This is the number to use when deciding whether the target is realistic from your current storage and farming pace.",
        },
        {
          title: "Total builder days are not the same as calendar days",
          description:
            "If you have multiple builders available, real completion time can be much shorter than the total builder-day sum suggests.",
          className: "bg-cyan-500/5 border-cyan-500/20",
        },
        {
          title: "Resource bottlenecks usually mean your farm pace needs work",
          description:
            "If the resource days exceed the parallel builder timeline, the issue is not builder count alone. It means the income side of the plan is not keeping up with the spending side.",
          className: "bg-emerald-500/5 border-emerald-500/20",
        },
        {
          title: "Linear and percent growth create very different late ladders",
          description:
            "A percent-based chain can explode in cost and time later on, while a linear chain stays much more predictable level by level.",
          className: "bg-amber-500/5 border-amber-500/20",
        },
      ]}
      examples={[
        { scenario: "Defense chain", input: "Level 12 to 17 with percent growth", output: "Useful for higher-end structures that ramp sharply in cost and time" },
        { scenario: "Hero ladder", input: "Level 35 to 45 with one builder", output: "Shows how a long single-lane upgrade path can become the whole bottleneck" },
        { scenario: "Parallel village planning", input: "Six builders with healthy income", output: "Parallel days fall sharply when resource flow is strong enough" },
        { scenario: "Farm stress test", input: "Low daily resource income versus expensive target", output: "The page flags resources as the more likely blocker" },
      ]}
      whyChoosePoints={[
        "This Clash of Clans Upgrade Calculator is built as a real planning utility rather than a placeholder label page. It handles total cost, total time, builder parallelism, daily farming pace, and step-by-step level ladders in one place, which makes it useful for actual upgrade sequencing.",
        "The page is intentionally generic because upgrade economics vary across defenses, heroes, walls, and lab work. Instead of pretending one hardcoded table fits every case, it gives you a clean model that works once you enter the values relevant to the path you care about.",
        "Builder parallel time is one of the most important outputs because raw upgrade days can be misleading. Players usually want to know the calendar impact on a real base, not only the abstract sum of timers.",
        "The farming comparison is equally valuable because many upgrade plans fail on resource pressure rather than builder pressure. Putting both in the same view makes the plan much easier to trust.",
        "Everything runs in the browser with no setup. Open the page, enter the ladder, compare the bottleneck, copy the result, and keep moving. That matches the way most players use a CoC planning tool.",
      ]}
      faqs={[
        {
          q: "How do I use this Clash of Clans upgrade calculator?",
          a: "Enter your current level, target level, the starting cost and time, how those values grow between levels, your builder count, and your daily resource income. The page then estimates the full ladder cost and timing.",
        },
        {
          q: "Does this include exact in-game building tables?",
          a: "No. This page is a generic CoC-style planner. It becomes exact only when you enter the exact values for the specific building, hero, or upgrade chain you are modeling.",
        },
        {
          q: "What is the difference between total builder days and parallel days?",
          a: "Total builder days are the full sum of all upgrade timers. Parallel days estimate how long that work might take in calendar time when spread across the number of builders you enter.",
        },
        {
          q: "What does the bottleneck field mean?",
          a: "It compares the time pressure from builders against the time pressure from your farming income. If resources take longer to accumulate than builders take to finish, resources are the bottleneck.",
        },
        {
          q: "Should I use flat, linear, or percent growth?",
          a: "Use the mode that most closely matches the upgrade chain you are estimating. Flat keeps each step the same, linear adds a steady amount each level, and percent scales based on the previous step.",
        },
        {
          q: "Can I use this for hero upgrades or lab research?",
          a: "Yes. The planner is generic enough for any Clash of Clans-style ladder as long as you enter the costs and timers you want to model.",
        },
        {
          q: "Why include daily resource income?",
          a: "Because many upgrade plans are limited by farming pace, not just builder timers. The income input helps the page estimate whether you can actually keep the build schedule fed.",
        },
        {
          q: "Does the page save my upgrade plans?",
          a: "No. The values stay in the current browser state only. The page is built for quick local planning and comparison.",
        },
      ]}
      relatedTools={[
        { title: "Damage Calculator", slug: "damage-calculator", icon: <Target className="w-4 h-4" />, color: 35, benefit: "Open another newly completed gaming calculator" },
        { title: "XP Level Calculator", slug: "xp-level-calculator", icon: <TrendingUp className="w-4 h-4" />, color: 210, benefit: "Stay inside another progression-focused tool" },
        { title: "Game Currency Converter", slug: "game-currency-converter", icon: <Wallet className="w-4 h-4" />, color: 145, benefit: "Compare another resource-planning gaming route" },
        { title: "Esports Earnings Calculator", slug: "esports-earnings-calculator", icon: <BarChart3 className="w-4 h-4" />, color: 300, benefit: "Use another numbers-driven gaming page" },
        { title: "Percentage Calculator", slug: "percentage-calculator", icon: <Copy className="w-4 h-4" />, color: 265, benefit: "Measure upgrade growth rates and deltas" },
        { title: "D&D Dice Roller", slug: "dnd-dice-roller", icon: <RotateCcw className="w-4 h-4" />, color: 20, benefit: "Browse another gaming utility page" },
      ]}
      ctaTitle="Need Another Upgrade Planning Tool?"
      ctaDescription="Keep moving through the gaming calculator category and continue replacing placeholder routes with real pages."
      ctaHref="/category/gaming"
    />
  );
}
