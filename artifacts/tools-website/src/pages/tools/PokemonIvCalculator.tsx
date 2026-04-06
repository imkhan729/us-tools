import { useMemo, useState } from "react";
import {
  BarChart3,
  Copy,
  Gauge,
  RotateCcw,
  Search,
  Shield,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import UtilityToolPageShell from "./UtilityToolPageShell";

type StatId = "atk" | "def" | "spa" | "spd" | "spe";

const NON_HP_STATS: Array<{ id: StatId; label: string }> = [
  { id: "atk", label: "Attack" },
  { id: "def", label: "Defense" },
  { id: "spa", label: "Sp. Atk" },
  { id: "spd", label: "Sp. Def" },
  { id: "spe", label: "Speed" },
];

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

function natureMultiplier(stat: StatId, increased: string, decreased: string) {
  if (increased === decreased) return 1;
  if (stat === increased) return 1.1;
  if (stat === decreased) return 0.9;
  return 1;
}

function hpStat(base: number, iv: number, ev: number, level: number) {
  return Math.floor(((2 * base + iv + Math.floor(ev / 4)) * level) / 100) + level + 10;
}

function otherStat(base: number, iv: number, ev: number, level: number, nature: number) {
  const raw = Math.floor(((2 * base + iv + Math.floor(ev / 4)) * level) / 100) + 5;
  return Math.floor(raw * nature);
}

function ivLabel(min: number, max: number) {
  if (min === 31 && max === 31) return "Perfect";
  if (min >= 26) return "Very High";
  if (min >= 16) return "Good";
  return "Needs Work";
}

export default function PokemonIvCalculator() {
  const [levelInput, setLevelInput] = useState("50");
  const [baseHpInput, setBaseHpInput] = useState("78");
  const [baseAtkInput, setBaseAtkInput] = useState("84");
  const [baseDefInput, setBaseDefInput] = useState("78");
  const [baseSpaInput, setBaseSpaInput] = useState("109");
  const [baseSpdInput, setBaseSpdInput] = useState("85");
  const [baseSpeInput, setBaseSpeInput] = useState("100");
  const [obsHpInput, setObsHpInput] = useState("153");
  const [obsAtkInput, setObsAtkInput] = useState("104");
  const [obsDefInput, setObsDefInput] = useState("98");
  const [obsSpaInput, setObsSpaInput] = useState("143");
  const [obsSpdInput, setObsSpdInput] = useState("105");
  const [obsSpeInput, setObsSpeInput] = useState("120");
  const [evHpInput, setEvHpInput] = useState("0");
  const [evAtkInput, setEvAtkInput] = useState("0");
  const [evDefInput, setEvDefInput] = useState("0");
  const [evSpaInput, setEvSpaInput] = useState("252");
  const [evSpdInput, setEvSpdInput] = useState("4");
  const [evSpeInput, setEvSpeInput] = useState("252");
  const [increasedStat, setIncreasedStat] = useState<string>("spa");
  const [decreasedStat, setDecreasedStat] = useState<string>("atk");
  const [copiedLabel, setCopiedLabel] = useState("");

  const ivs = useMemo(() => {
    const level = clamp(Math.round(positive(levelInput, 1)), 1, 100);
    const bases = {
      hp: positive(baseHpInput, 0),
      atk: positive(baseAtkInput, 0),
      def: positive(baseDefInput, 0),
      spa: positive(baseSpaInput, 0),
      spd: positive(baseSpdInput, 0),
      spe: positive(baseSpeInput, 0),
    };
    const observed = {
      hp: positive(obsHpInput, 0),
      atk: positive(obsAtkInput, 0),
      def: positive(obsDefInput, 0),
      spa: positive(obsSpaInput, 0),
      spd: positive(obsSpdInput, 0),
      spe: positive(obsSpeInput, 0),
    };
    const evs = {
      hp: clamp(Math.round(positive(evHpInput, 0)), 0, 252),
      atk: clamp(Math.round(positive(evAtkInput, 0)), 0, 252),
      def: clamp(Math.round(positive(evDefInput, 0)), 0, 252),
      spa: clamp(Math.round(positive(evSpaInput, 0)), 0, 252),
      spd: clamp(Math.round(positive(evSpdInput, 0)), 0, 252),
      spe: clamp(Math.round(positive(evSpeInput, 0)), 0, 252),
    };

    const hpMatches: number[] = [];
    for (let iv = 0; iv <= 31; iv += 1) {
      if (hpStat(bases.hp, iv, evs.hp, level) === observed.hp) hpMatches.push(iv);
    }

    const hpRange = {
      label: "HP",
      matches: hpMatches,
      min: hpMatches[0] ?? 0,
      max: hpMatches[hpMatches.length - 1] ?? 0,
      rating: hpMatches.length > 0 ? ivLabel(hpMatches[0], hpMatches[hpMatches.length - 1]) : "No Match",
    };

    const otherRanges = NON_HP_STATS.map((stat) => {
      const matches: number[] = [];
      const nature = natureMultiplier(stat.id, increasedStat, decreasedStat);
      for (let iv = 0; iv <= 31; iv += 1) {
        if (otherStat(bases[stat.id], iv, evs[stat.id], level, nature) === observed[stat.id]) matches.push(iv);
      }
      const min = matches[0] ?? 0;
      const max = matches[matches.length - 1] ?? 0;
      return {
        label: stat.label,
        matches,
        min,
        max,
        rating: matches.length > 0 ? ivLabel(min, max) : "No Match",
      };
    });

    const allRanges = [hpRange, ...otherRanges];
    const perfectCount = allRanges.filter((range) => range.min === 31 && range.max === 31).length;
    const averageMin = allRanges.reduce((sum, range) => sum + range.min, 0) / allRanges.length;
    const averageMax = allRanges.reduce((sum, range) => sum + range.max, 0) / allRanges.length;
    const overallRating = averageMin >= 26 ? "High-IV spread" : averageMin >= 16 ? "Playable spread" : "Low-IV spread";

    return {
      level,
      increasedStat,
      decreasedStat,
      allRanges,
      perfectCount,
      averageMin,
      averageMax,
      overallRating,
    };
  }, [
    baseAtkInput,
    baseDefInput,
    baseHpInput,
    baseSpaInput,
    baseSpdInput,
    baseSpeInput,
    decreasedStat,
    evAtkInput,
    evDefInput,
    evHpInput,
    evSpaInput,
    evSpdInput,
    evSpeInput,
    increasedStat,
    levelInput,
    obsAtkInput,
    obsDefInput,
    obsHpInput,
    obsSpaInput,
    obsSpdInput,
    obsSpeInput,
  ]);

  const copyValue = async (label: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedLabel(label);
    window.setTimeout(() => setCopiedLabel(""), 1800);
  };

  const resetAll = () => {
    setLevelInput("50");
    setBaseHpInput("78");
    setBaseAtkInput("84");
    setBaseDefInput("78");
    setBaseSpaInput("109");
    setBaseSpdInput("85");
    setBaseSpeInput("100");
    setObsHpInput("153");
    setObsAtkInput("104");
    setObsDefInput("98");
    setObsSpaInput("143");
    setObsSpdInput("105");
    setObsSpeInput("120");
    setEvHpInput("0");
    setEvAtkInput("0");
    setEvDefInput("0");
    setEvSpaInput("252");
    setEvSpdInput("4");
    setEvSpeInput("252");
    setIncreasedStat("spa");
    setDecreasedStat("atk");
  };

  const loadCompetitivePreset = () => {
    setLevelInput("50");
    setBaseHpInput("80");
    setBaseAtkInput("95");
    setBaseDefInput("85");
    setBaseSpaInput("135");
    setBaseSpdInput("85");
    setBaseSpeInput("100");
    setObsHpInput("155");
    setObsAtkInput("103");
    setObsDefInput("105");
    setObsSpaInput("187");
    setObsSpdInput("106");
    setObsSpeInput("152");
    setEvHpInput("0");
    setEvAtkInput("0");
    setEvDefInput("4");
    setEvSpaInput("252");
    setEvSpdInput("0");
    setEvSpeInput("252");
    setIncreasedStat("spa");
    setDecreasedStat("atk");
  };

  const loadBulkyPreset = () => {
    setLevelInput("50");
    setBaseHpInput("95");
    setBaseAtkInput("65");
    setBaseDefInput("110");
    setBaseSpaInput("60");
    setBaseSpdInput("130");
    setBaseSpeInput("65");
    setObsHpInput("202");
    setObsAtkInput("85");
    setObsDefInput("143");
    setObsSpaInput("80");
    setObsSpdInput("178");
    setObsSpeInput("85");
    setEvHpInput("252");
    setEvAtkInput("0");
    setEvDefInput("84");
    setEvSpaInput("0");
    setEvSpdInput("172");
    setEvSpeInput("0");
    setIncreasedStat("spd");
    setDecreasedStat("atk");
  };

  const summarySnippet = [
    `Level: ${ivs.level}`,
    `Nature boost: ${ivs.increasedStat || "none"}`,
    `Nature drop: ${ivs.decreasedStat || "none"}`,
    `Perfect stats: ${format(ivs.perfectCount, 0)}`,
    `Average IV range: ${format(ivs.averageMin, 2)} to ${format(ivs.averageMax, 2)}`,
    `Overall read: ${ivs.overallRating}`,
  ].join("\n");

  const rangesSnippet = ivs.allRanges
    .map((range) => `${range.label}: ${range.matches.length > 0 ? `${range.min}-${range.max}` : "No match"} | ${range.rating}`)
    .join("\n");

  const statInputGrid = (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-muted/60">
            <th className="px-4 py-3 text-left font-bold text-foreground">Stat</th>
            <th className="px-4 py-3 text-left font-bold text-foreground">Base</th>
            <th className="px-4 py-3 text-left font-bold text-foreground">Observed</th>
            <th className="px-4 py-3 text-left font-bold text-foreground">EV</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {[
            { label: "HP", base: baseHpInput, setBase: setBaseHpInput, observed: obsHpInput, setObserved: setObsHpInput, ev: evHpInput, setEv: setEvHpInput },
            { label: "Attack", base: baseAtkInput, setBase: setBaseAtkInput, observed: obsAtkInput, setObserved: setObsAtkInput, ev: evAtkInput, setEv: setEvAtkInput },
            { label: "Defense", base: baseDefInput, setBase: setBaseDefInput, observed: obsDefInput, setObserved: setObsDefInput, ev: evDefInput, setEv: setEvDefInput },
            { label: "Sp. Atk", base: baseSpaInput, setBase: setBaseSpaInput, observed: obsSpaInput, setObserved: setObsSpaInput, ev: evSpaInput, setEv: setEvSpaInput },
            { label: "Sp. Def", base: baseSpdInput, setBase: setBaseSpdInput, observed: obsSpdInput, setObserved: setObsSpdInput, ev: evSpdInput, setEv: setEvSpdInput },
            { label: "Speed", base: baseSpeInput, setBase: setBaseSpeInput, observed: obsSpeInput, setObserved: setObsSpeInput, ev: evSpeInput, setEv: setEvSpeInput },
          ].map((row) => (
            <tr key={row.label}>
              <td className="px-4 py-3 text-muted-foreground">{row.label}</td>
              <td className="px-4 py-3"><input type="number" min="1" step="1" value={row.base} onChange={(event) => row.setBase(event.target.value)} className="tool-calc-input w-full" /></td>
              <td className="px-4 py-3"><input type="number" min="1" step="1" value={row.observed} onChange={(event) => row.setObserved(event.target.value)} className="tool-calc-input w-full" /></td>
              <td className="px-4 py-3"><input type="number" min="0" max="252" step="1" value={row.ev} onChange={(event) => row.setEv(event.target.value)} className="tool-calc-input w-full" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const calculator = (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <button onClick={loadCompetitivePreset} className="rounded-full border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:border-blue-500/40 hover:bg-muted">
          Load Fast Special Attacker
        </button>
        <button onClick={loadBulkyPreset} className="rounded-full border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:border-blue-500/40 hover:bg-muted">
          Load Bulky Set
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
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Pokemon Inputs</p>
                <p className="text-sm text-muted-foreground">Enter level, base stats, observed stats, EVs, and nature direction to calculate IV ranges for each stat.</p>
              </div>
              <Search className="w-5 h-5 text-blue-500" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Level</label>
                <input type="number" min="1" max="100" step="1" value={levelInput} onChange={(event) => setLevelInput(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Nature Boost</label>
                <select value={increasedStat} onChange={(event) => setIncreasedStat(event.target.value)} className="tool-calc-input w-full">
                  <option value="none">Neutral</option>
                  {NON_HP_STATS.map((stat) => (
                    <option key={stat.id} value={stat.id}>{stat.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Nature Drop</label>
                <select value={decreasedStat} onChange={(event) => setDecreasedStat(event.target.value)} className="tool-calc-input w-full">
                  <option value="none">Neutral</option>
                  {NON_HP_STATS.map((stat) => (
                    <option key={stat.id} value={stat.id}>{stat.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {statInputGrid}
          </div>

          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">IV Range Results</p>
                <p className="text-sm text-muted-foreground">Each row shows the IV range that matches the observed stat at the entered level, EVs, and nature setup.</p>
              </div>
              <Target className="w-5 h-5 text-blue-500" />
            </div>

            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/60">
                    <th className="px-4 py-3 text-left font-bold text-foreground">Stat</th>
                    <th className="px-4 py-3 text-left font-bold text-foreground">Range</th>
                    <th className="px-4 py-3 text-left font-bold text-foreground">Matches</th>
                    <th className="px-4 py-3 text-left font-bold text-foreground">Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {ivs.allRanges.map((range) => (
                    <tr key={range.label}>
                      <td className="px-4 py-3 text-muted-foreground">{range.label}</td>
                      <td className="px-4 py-3 font-mono text-foreground">{range.matches.length > 0 ? `${range.min}-${range.max}` : "No match"}</td>
                      <td className="px-4 py-3 font-mono text-foreground">{range.matches.length > 0 ? range.matches.join(", ") : "-"}</td>
                      <td className="px-4 py-3 font-bold text-blue-600">{range.rating}</td>
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
                <p className="font-bold text-foreground">Overall Spread</p>
                <p className="mt-1">This Pokemon currently reads as <span className="font-bold text-foreground">{ivs.overallRating}</span>, with an average IV floor of {format(ivs.averageMin, 2)} and ceiling of {format(ivs.averageMax, 2)}.</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="font-bold text-foreground">Perfect Count</p>
                <p className="mt-1">The current stat set shows {format(ivs.perfectCount, 0)} perfect stat ranges, which is useful when deciding whether the Pokemon is already tournament-ready or still worth breeding or resetting.</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="font-bold text-foreground">Nature Reminder</p>
                <p className="mt-1">Nature adjustments only affect non-HP stats. If the range looks wrong, the first thing to verify is whether the boost and drop directions match the real nature used in-game.</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="mb-4 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Copy-Ready Snippets</p>
            <div className="space-y-3">
              {[
                { label: "IV summary", value: summarySnippet },
                { label: "Stat ranges", value: rangesSnippet },
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
                This calculator uses the standard main-series Pokemon stat formulas. If the range does not line up with your game, double-check the form, level, EV values, and nature because those inputs change the IV range immediately.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <UtilityToolPageShell
      title="Pokemon IV Calculator"
      seoTitle="Online Pokemon IV Calculator - Check Individual Value Ranges"
      seoDescription="Free online Pokemon IV calculator. Enter base stats, level, observed stats, EVs, and nature to calculate IV ranges for each stat."
      canonical="https://usonlinetools.com/gaming/pokemon-iv-calculator"
      categoryName="Gaming Calculators"
      categoryHref="/category/gaming"
      heroDescription="Use this online Pokemon IV calculator to estimate Individual Value ranges from a Pokemon's base stats, observed stats, level, EV spread, and nature effects. The page is built for breeders, competitive players, and collectors who want a fast read on whether a Pokemon is worth keeping, training, or replacing without opening a separate spreadsheet."
      heroIcon={<Zap className="w-3.5 h-3.5" />}
      calculatorLabel="Pokemon IV Range Workspace"
      calculatorDescription="Calculate IV ranges for HP, Attack, Defense, Special Attack, Special Defense, and Speed using the standard Pokemon stat formulas."
      calculator={calculator}
      howSteps={[
        {
          title: "Enter the exact level, base stats, and observed stats first",
          description:
            "The IV calculation only makes sense if the starting data is correct. Level, species base stats, and the actual observed stat values all feed directly into the formula. If any one of those numbers is wrong, the calculated IV range can shift dramatically or even produce no valid match at all.",
        },
        {
          title: "Include EVs because they directly affect the stat formulas",
          description:
            "A Pokemon with the same base stats, level, and IVs can still show different final stat numbers if the EV spread changes. That is why EVs are part of the input table rather than an optional afterthought. For competitive and breeding decisions, leaving them out usually makes the IV reading less useful.",
        },
        {
          title: "Set the nature correctly for non-HP stats",
          description:
            "Nature boosts one non-HP stat and lowers another, which changes the final observed stat and therefore the matching IV range. The page uses a simplified boost-and-drop selector so you can model that effect without memorizing every named nature. Neutral natures are handled by leaving the nature neutral.",
        },
        {
          title: "Read the range, not only the single best number",
          description:
            "Without multiple observed levels or hidden exact data, IV checking often produces a range instead of one guaranteed value. That is still useful. A 28-31 range already tells you the stat is excellent, while a 4-10 range tells you it likely is not. The goal of a practical IV calculator is not fake precision. It is actionable quality guidance.",
        },
      ]}
      interpretationCards={[
        {
          title: "A 31-31 range means a perfect stat",
          description:
            "If the only matching IV value is 31, that stat is perfect under the entered conditions.",
        },
        {
          title: "Narrow ranges are more informative than wide ones",
          description:
            "A tight range such as 28-31 or 0-3 is usually enough to make a clear keep-or-replace decision even when the exact IV is not pinned to one number.",
          className: "bg-cyan-500/5 border-cyan-500/20",
        },
        {
          title: "Nature mistakes can make a valid Pokemon look wrong",
          description:
            "If the range seems impossible or too low, verify the nature effect first. Non-HP nature changes are one of the most common reasons for mismatched IV checks.",
          className: "bg-emerald-500/5 border-emerald-500/20",
        },
        {
          title: "EV assumptions matter more than many players expect",
          description:
            "Competitive spreads can shift the observed stats enough to move IV ranges significantly. Always enter the real EV values when you know them.",
          className: "bg-amber-500/5 border-amber-500/20",
        },
      ]}
      examples={[
        { scenario: "Fast special attacker", input: "Level 50 with 252 SpA / 252 Spe and an offensive nature", output: "Good for checking if a competitive attacker has strong Speed and Sp. Atk IVs" },
        { scenario: "Bulky defensive set", input: "Level 50 with HP and special bulk EV investment", output: "Useful for checking whether the defensive IV floor is worth keeping" },
        { scenario: "Perfect-stat hunt", input: "Observed stat matches only at IV 31", output: "Immediate signal that the stat is perfect" },
        { scenario: "Breeding filter", input: "Multiple low ranges across core stats", output: "Helps decide quickly whether a candidate is worth further investment" },
      ]}
      whyChoosePoints={[
        "This Pokemon IV Calculator is built as a real stat-checking page rather than a placeholder label. It uses the standard Pokemon stat formulas, supports EVs and nature direction, and returns usable IV ranges for every stat in one place.",
        "The per-stat range table is useful because breeders and competitive players rarely need a vague overall score. They need to know whether Speed is perfect, whether a defensive stat is still acceptable, and whether the spread is worth keeping.",
        "The page also stays honest about uncertainty. When the data only supports a range, it shows the range instead of pretending there is one exact IV value. That makes the tool more trustworthy and more practical.",
        "Nature and EV handling matter because they are usually the difference between a good IV reading and a misleading one. Including them directly in the calculator keeps the output grounded in the way real Pokemon stat math works.",
        "Everything runs locally in the browser with immediate feedback. Enter the stats, inspect the ranges, copy the result, and move on. That is the right interaction model for a quick IV-check utility.",
      ]}
      faqs={[
        {
          q: "How does this Pokemon IV calculator work?",
          a: "It uses the standard main-series Pokemon stat formulas, then checks which IV values from 0 to 31 can produce the observed stat at the entered level, EV spread, and nature effect.",
        },
        {
          q: "Why do I get a range instead of one exact IV?",
          a: "Because one observed stat line can match multiple IV values under the same conditions. A tighter exact answer usually requires more data points, such as another level reading or confirmed hidden details.",
        },
        {
          q: "Do EVs matter when checking IVs?",
          a: "Yes. EVs are part of the stat formula and can shift the resulting IV range significantly, especially at competitive spreads and mid-to-high levels.",
        },
        {
          q: "Why does HP not use the nature modifier?",
          a: "Because in the standard Pokemon games, nature affects only the five non-HP battle stats. HP is calculated separately.",
        },
        {
          q: "What does a perfect stat mean?",
          a: "A perfect stat means the matching IV is exactly 31 under the entered conditions. Competitive players often prize perfect IVs in key stats such as Speed or offensive output.",
        },
        {
          q: "Can I use this for any Pokemon?",
          a: "Yes, as long as you enter the correct species base stats, level, observed stats, EVs, and nature direction for the Pokemon you are checking.",
        },
        {
          q: "Why might the calculator show no match?",
          a: "The most common causes are an incorrect base stat, wrong level, wrong EV value, or incorrect nature direction. Double-check those first.",
        },
        {
          q: "Does the page save my Pokemon data?",
          a: "No. The values stay in the current browser state only. The tool is built for fast local checking and comparison.",
        },
      ]}
      relatedTools={[
        { title: "Genshin Impact Calculator", slug: "genshin-impact-calculator", icon: <Zap className="w-4 h-4" />, color: 145, benefit: "Open the other newly completed gaming calculator" },
        { title: "Damage Calculator", slug: "damage-calculator", icon: <Target className="w-4 h-4" />, color: 35, benefit: "Use a broader combat-analysis tool" },
        { title: "XP Level Calculator", slug: "xp-level-calculator", icon: <TrendingUp className="w-4 h-4" />, color: 210, benefit: "Stay inside another progression-focused page" },
        { title: "Gaming FPS Calculator", slug: "gaming-fps-calculator", icon: <Gauge className="w-4 h-4" />, color: 300, benefit: "Open another numbers-driven gaming route" },
        { title: "Percentage Calculator", slug: "percentage-calculator", icon: <Copy className="w-4 h-4" />, color: 265, benefit: "Check stat deltas and efficiency changes" },
        { title: "D&D Dice Roller", slug: "dnd-dice-roller", icon: <RotateCcw className="w-4 h-4" />, color: 20, benefit: "Browse another gaming utility page" },
      ]}
      ctaTitle="Need Another Stat Planning Tool?"
      ctaDescription="Keep moving through the gaming calculator category and continue replacing placeholder routes with real pages."
      ctaHref="/category/gaming"
    />
  );
}
