import { useMemo, useState } from "react";
import {
  BarChart3,
  Copy,
  Gauge,
  RotateCcw,
  Shield,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import UtilityToolPageShell from "./UtilityToolPageShell";

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

function resistanceMultiplier(resistancePercent: number) {
  const res = resistancePercent / 100;
  if (res < 0) return 1 - res / 2;
  if (res < 0.75) return 1 - res;
  return 1 / (1 + 4 * res);
}

export default function GenshinImpactCalculator() {
  const [baseAtkInput, setBaseAtkInput] = useState("950");
  const [atkPercentInput, setAtkPercentInput] = useState("72");
  const [flatAtkInput, setFlatAtkInput] = useState("311");
  const [talentMultiplierInput, setTalentMultiplierInput] = useState("238");
  const [damageBonusInput, setDamageBonusInput] = useState("61.6");
  const [critRateInput, setCritRateInput] = useState("68");
  const [critDamageInput, setCritDamageInput] = useState("154");
  const [enemyResInput, setEnemyResInput] = useState("10");
  const [defenseMultiplierInput, setDefenseMultiplierInput] = useState("0.5");
  const [reactionMultiplierInput, setReactionMultiplierInput] = useState("1");
  const [hitsPerRotationInput, setHitsPerRotationInput] = useState("4");
  const [rotationTimeInput, setRotationTimeInput] = useState("18");
  const [copiedLabel, setCopiedLabel] = useState("");

  const build = useMemo(() => {
    const baseAtk = positive(baseAtkInput, 0);
    const atkPercent = positive(atkPercentInput, 0) / 100;
    const flatAtk = positive(flatAtkInput, 0);
    const talentMultiplier = positive(talentMultiplierInput, 0) / 100;
    const damageBonus = positive(damageBonusInput, 0) / 100;
    const critRate = clamp(positive(critRateInput, 0), 0, 100) / 100;
    const critDamage = positive(critDamageInput, 0) / 100;
    const enemyRes = toNumber(enemyResInput, 0);
    const defenseMultiplier = positive(defenseMultiplierInput, 0);
    const reactionMultiplier = positive(reactionMultiplierInput, 0);
    const hitsPerRotation = Math.max(1, Math.round(positive(hitsPerRotationInput, 1)));
    const rotationTime = positive(rotationTimeInput, 1);

    const totalAtk = baseAtk * (1 + atkPercent) + flatAtk;
    const resMultiplier = resistanceMultiplier(enemyRes);
    const bonusMultiplier = 1 + damageBonus;
    const nonCritDamage = totalAtk * talentMultiplier * bonusMultiplier * defenseMultiplier * resMultiplier * reactionMultiplier;
    const critDamageHit = nonCritDamage * (1 + critDamage);
    const averageHit = nonCritDamage * (1 - critRate) + critDamageHit * critRate;
    const rotationDamage = averageHit * hitsPerRotation;
    const dps = rotationTime > 0 ? rotationDamage / rotationTime : 0;
    const critValue = positive(critRateInput, 0) * 2 + positive(critDamageInput, 0);
    const idealCritDamage = positive(critRateInput, 0) * 2;
    const critBalanceDelta = positive(critDamageInput, 0) - idealCritDamage;
    const nextFocus = critBalanceDelta < -10 ? "More Crit DMG" : critBalanceDelta > 15 ? "More Crit Rate" : "Crit balance is close";

    return {
      baseAtk,
      atkPercent,
      flatAtk,
      talentMultiplier,
      damageBonus,
      critRate,
      critDamage,
      enemyRes,
      defenseMultiplier,
      reactionMultiplier,
      hitsPerRotation,
      rotationTime,
      totalAtk,
      resMultiplier,
      bonusMultiplier,
      nonCritDamage,
      critDamageHit,
      averageHit,
      rotationDamage,
      dps,
      critValue,
      critBalanceDelta,
      nextFocus,
    };
  }, [
    atkPercentInput,
    baseAtkInput,
    critDamageInput,
    critRateInput,
    damageBonusInput,
    defenseMultiplierInput,
    enemyResInput,
    flatAtkInput,
    hitsPerRotationInput,
    reactionMultiplierInput,
    rotationTimeInput,
    talentMultiplierInput,
  ]);

  const copyValue = async (label: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedLabel(label);
    window.setTimeout(() => setCopiedLabel(""), 1800);
  };

  const resetAll = () => {
    setBaseAtkInput("950");
    setAtkPercentInput("72");
    setFlatAtkInput("311");
    setTalentMultiplierInput("238");
    setDamageBonusInput("61.6");
    setCritRateInput("68");
    setCritDamageInput("154");
    setEnemyResInput("10");
    setDefenseMultiplierInput("0.5");
    setReactionMultiplierInput("1");
    setHitsPerRotationInput("4");
    setRotationTimeInput("18");
  };

  const loadHypercarryPreset = () => {
    setBaseAtkInput("1012");
    setAtkPercentInput("80");
    setFlatAtkInput("311");
    setTalentMultiplierInput("320");
    setDamageBonusInput("78");
    setCritRateInput("75");
    setCritDamageInput("185");
    setEnemyResInput("10");
    setDefenseMultiplierInput("0.5");
    setReactionMultiplierInput("1");
    setHitsPerRotationInput("3");
    setRotationTimeInput("20");
  };

  const loadReactionPreset = () => {
    setBaseAtkInput("860");
    setAtkPercentInput("46.6");
    setFlatAtkInput("311");
    setTalentMultiplierInput("190");
    setDamageBonusInput("46.6");
    setCritRateInput("62");
    setCritDamageInput("138");
    setEnemyResInput("-10");
    setDefenseMultiplierInput("0.5");
    setReactionMultiplierInput("1.5");
    setHitsPerRotationInput("5");
    setRotationTimeInput("18");
  };

  const damageSnippet = [
    `Total ATK: ${format(build.totalAtk, 2)}`,
    `Non-crit hit: ${format(build.nonCritDamage, 2)}`,
    `Crit hit: ${format(build.critDamageHit, 2)}`,
    `Average hit: ${format(build.averageHit, 2)}`,
    `Rotation damage: ${format(build.rotationDamage, 2)}`,
    `Estimated DPS: ${format(build.dps, 2)}`,
  ].join("\n");

  const buildSnippet = [
    `Crit value: ${format(build.critValue, 2)}`,
    `Crit balance delta: ${format(build.critBalanceDelta, 2)}`,
    `Next focus: ${build.nextFocus}`,
    `RES multiplier: ${format(build.resMultiplier, 3)}`,
    `Reaction multiplier: ${format(build.reactionMultiplier, 2)}`,
  ].join("\n");

  const calculator = (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <button onClick={loadHypercarryPreset} className="rounded-full border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:border-blue-500/40 hover:bg-muted">
          Load Hypercarry
        </button>
        <button onClick={loadReactionPreset} className="rounded-full border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:border-blue-500/40 hover:bg-muted">
          Load Reaction Team
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
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Build Inputs</p>
                <p className="text-sm text-muted-foreground">Model a Genshin-style hit using ATK, talent scaling, DMG bonus, crit stats, enemy resistance, and a reaction multiplier.</p>
              </div>
              <Sparkles className="w-5 h-5 text-blue-500" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Base ATK</label>
                <input type="number" min="0" step="1" value={baseAtkInput} onChange={(event) => setBaseAtkInput(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">ATK %</label>
                <input type="number" min="0" step="0.1" value={atkPercentInput} onChange={(event) => setAtkPercentInput(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Flat ATK</label>
                <input type="number" min="0" step="1" value={flatAtkInput} onChange={(event) => setFlatAtkInput(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Talent Multiplier %</label>
                <input type="number" min="0" step="0.1" value={talentMultiplierInput} onChange={(event) => setTalentMultiplierInput(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">DMG Bonus %</label>
                <input type="number" min="0" step="0.1" value={damageBonusInput} onChange={(event) => setDamageBonusInput(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Crit Rate %</label>
                <input type="number" min="0" max="100" step="0.1" value={critRateInput} onChange={(event) => setCritRateInput(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Crit DMG %</label>
                <input type="number" min="0" step="0.1" value={critDamageInput} onChange={(event) => setCritDamageInput(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Enemy RES %</label>
                <input type="number" min="-100" step="0.1" value={enemyResInput} onChange={(event) => setEnemyResInput(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Defense Multiplier</label>
                <input type="number" min="0" step="0.01" value={defenseMultiplierInput} onChange={(event) => setDefenseMultiplierInput(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Reaction Multiplier</label>
                <input type="number" min="0" step="0.01" value={reactionMultiplierInput} onChange={(event) => setReactionMultiplierInput(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Hits / Rotation</label>
                <input type="number" min="1" step="1" value={hitsPerRotationInput} onChange={(event) => setHitsPerRotationInput(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Rotation Time</label>
                <input type="number" min="0.1" step="0.1" value={rotationTimeInput} onChange={(event) => setRotationTimeInput(event.target.value)} className="tool-calc-input w-full" />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Average Hit</p>
                <p className="mt-2 text-2xl font-black text-emerald-600">{format(build.averageHit, 2)}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Crit Hit</p>
                <p className="mt-2 text-2xl font-black text-foreground">{format(build.critDamageHit, 2)}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Rotation Damage</p>
                <p className="mt-2 text-2xl font-black text-foreground">{format(build.rotationDamage, 2)}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Estimated DPS</p>
                <p className="mt-2 text-2xl font-black text-foreground">{format(build.dps, 2)}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Build Balance Reading</p>
                <p className="text-sm text-muted-foreground">Check crit value, crit ratio direction, and whether the current build is leaning too hard toward crit rate or crit damage.</p>
              </div>
              <Target className="w-5 h-5 text-blue-500" />
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Total ATK</p>
                <p className="mt-2 text-2xl font-black text-foreground">{format(build.totalAtk, 2)}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Crit Value</p>
                <p className="mt-2 text-2xl font-black text-foreground">{format(build.critValue, 2)}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Crit Delta</p>
                <p className="mt-2 text-2xl font-black text-foreground">{format(build.critBalanceDelta, 2)}</p>
              </div>
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Next Focus</p>
                <p className="mt-2 text-xl font-black text-emerald-600">{build.nextFocus}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="mb-4 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Realtime Reading</p>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="font-bold text-foreground">Damage Layer</p>
                <p className="mt-1">This build turns {format(build.totalAtk, 2)} total ATK into about {format(build.nonCritDamage, 2)} non-crit damage and {format(build.averageHit, 2)} expected damage per hit after crit weighting.</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="font-bold text-foreground">Crit Layer</p>
                <p className="mt-1">Your current crit package produces a crit value of {format(build.critValue, 2)} and suggests the next optimization focus should be <span className="font-bold text-foreground">{build.nextFocus}</span>.</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="font-bold text-foreground">Rotation Layer</p>
                <p className="mt-1">At {format(build.hitsPerRotation, 0)} hits over {format(build.rotationTime, 2)} seconds, the build estimates roughly {format(build.rotationDamage, 2)} total rotation damage and {format(build.dps, 2)} DPS.</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="mb-4 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Copy-Ready Snippets</p>
            <div className="space-y-3">
              {[
                { label: "Damage summary", value: damageSnippet },
                { label: "Build summary", value: buildSnippet },
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
                This is a simplified Genshin-style damage model. Exact in-game outputs also depend on level scaling, defense formulas, reaction-specific rules, EM, shred, snapshotting, and character-specific mechanics that are beyond this generic page.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <UtilityToolPageShell
      title="Genshin Impact Calculator"
      seoTitle="Online Genshin Impact Calculator - Damage, Crit Balance, and Rotation DPS"
      seoDescription="Free online Genshin Impact calculator. Estimate total ATK, average hit damage, crit value, rotation damage, and DPS using a simplified build model."
      canonical="https://usonlinetools.com/gaming/genshin-impact-calculator"
      categoryName="Gaming Calculators"
      categoryHref="/category/gaming"
      heroDescription="Use this online Genshin Impact calculator to estimate how a build turns ATK, talent scaling, DMG bonus, crit stats, enemy resistance, and reactions into real hit damage. The page is built as a practical theorycrafting workspace for checking average damage, crit balance, rotation damage, and DPS without needing a spreadsheet every time you swap artifacts or weapons."
      heroIcon={<Zap className="w-3.5 h-3.5" />}
      calculatorLabel="Genshin Build Damage Workspace"
      calculatorDescription="Model a Genshin-style hit, then check crit balance, rotation output, and simplified DPS."
      calculator={calculator}
      howSteps={[
        {
          title: "Start with total ATK ingredients, not only the final ATK stat",
          description:
            "In Genshin build planning, it helps to think in layers. Base ATK, ATK percentage, and flat ATK all contribute differently to the final number that your talent scaling uses. Entering those pieces directly makes it easier to understand whether a stat change is improving the build because of the weapon, the sands, substats, or flat-stat artifact rolls.",
        },
        {
          title: "Use talent scaling, DMG bonus, and enemy resistance together",
          description:
            "Talent multiplier and elemental or skill bonus often do the visible heavy lifting, but the enemy side matters too. Resistance and defense multipliers can suppress damage more than many players expect. Keeping those inputs in the same model helps you read a build more honestly than looking only at your offensive stats in isolation.",
        },
        {
          title: "Treat crit rate and crit damage as one system",
          description:
            "A build with enormous crit damage is not automatically strong if the crit rate is unreliable, and a very high crit rate can still underperform if the crit modifier is weak. The calculator uses both stats to estimate average hit output and also checks the broad direction of your crit balance so you can decide what the next artifact upgrade should actually prioritize.",
        },
        {
          title: "Translate single-hit math into rotation damage and DPS",
          description:
            "Most real Genshin rotations are not just one isolated hit. They are a short sequence of attacks, skills, bursts, and swaps. The rotation section lets you convert average-hit math into a simple damage-over-rotation estimate so you can compare builds in a way that is closer to actual gameplay pacing.",
        },
      ]}
      interpretationCards={[
        {
          title: "Average hit is usually more useful than only the crit hit",
          description:
            "A giant crit screenshot looks good, but average hit is the better planning metric because it respects your actual crit rate consistency.",
        },
        {
          title: "Crit value helps compare artifacts quickly",
          description:
            "Crit value is not the whole build, but it is still a fast way to compare the quality of crit-focused artifact pieces at a glance.",
          className: "bg-cyan-500/5 border-cyan-500/20",
        },
        {
          title: "Reaction multipliers can change the whole ranking of a build",
          description:
            "Once reactions enter the picture, a build that looks average on paper can overtake a raw-damage build because the multiplier layer changes the effective result.",
          className: "bg-emerald-500/5 border-emerald-500/20",
        },
        {
          title: "Simplified DPS is only a planning proxy",
          description:
            "It helps compare rotations quickly, but real gameplay still depends on energy, uptime, animation locks, buffs, shreds, and team sequencing.",
          className: "bg-amber-500/5 border-amber-500/20",
        },
      ]}
      examples={[
        { scenario: "Hypercarry build", input: "High crit and high talent multiplier", output: "Big crit spikes with strong average-hit output" },
        { scenario: "Reaction build", input: "Lower raw scaling but 1.5x reaction multiplier", output: "Reaction layer lifts average damage and rotation totals" },
        { scenario: "Artifact review", input: "Crit value and crit balance delta", output: "Quick signal for whether the next upgrade should chase crit rate or crit damage" },
        { scenario: "Rotation check", input: "5 hits over 18 seconds", output: "Turns one-hit math into rough rotation damage and DPS" },
      ]}
      whyChoosePoints={[
        "This Genshin Impact Calculator is built as a practical build-check page instead of a placeholder route. It handles total ATK, crit weighting, DMG bonus, resistance, reactions, rotation damage, and simplified DPS in one place.",
        "The build-balance section is useful because many players can recognize a strong crit screenshot but still struggle to identify whether the underlying stat spread is actually efficient. The crit balance reading helps close that gap quickly.",
        "The page also stays honest about the limits of simplified theorycrafting. It can compare broad build directions and damage layers well, but it does not pretend to replace full team-sheet simulation or character-specific frame data.",
        "Reaction and resistance inputs matter because many damage comparisons go wrong when they ignore the enemy side or the elemental multiplier layer. Including those terms makes the result more grounded.",
        "Everything runs in the browser with immediate outputs. Enter the build, compare the hit, check the rotation, copy the summary, and move on. That is the right interaction model for a quick Genshin theorycrafting utility.",
      ]}
      faqs={[
        {
          q: "What does this Genshin calculator estimate?",
          a: "It estimates total ATK, non-crit hit damage, crit hit damage, average hit damage, rotation damage, DPS, crit value, and a simple crit-balance suggestion from the build stats you enter.",
        },
        {
          q: "Is this an exact in-game damage formula?",
          a: "No. It is a simplified Genshin-style model meant for planning and comparison. Exact damage depends on more factors such as level scaling, shred, EM, special passives, and character-specific mechanics.",
        },
        {
          q: "What is crit value?",
          a: "Crit value is a quick artifact-quality shorthand often calculated as Crit Rate x 2 plus Crit Damage. It helps compare crit-heavy artifact pieces quickly, though it does not replace full build context.",
        },
        {
          q: "Why include resistance and defense separately?",
          a: "Because the enemy side of the formula matters. Resistance and defense can suppress damage differently, and separating them keeps the model more flexible.",
        },
        {
          q: "What does reaction multiplier mean here?",
          a: "It is a simplified multiplier input to approximate amplification-style reaction effects in a broad planning sense. It is not a full EM-based reaction simulator.",
        },
        {
          q: "Should I optimize for crit rate or crit damage next?",
          a: "Use the crit-balance reading as a rough guide. If your crit damage is far ahead of a stable crit rate, more crit rate may help. If your crit rate is already stable, crit damage may return more value.",
        },
        {
          q: "Why is rotation DPS important?",
          a: "Because Genshin damage often happens in repeated short windows rather than one isolated hit. Rotation damage and DPS are closer to real combat pacing than a single-hit number alone.",
        },
        {
          q: "Does the page save my builds?",
          a: "No. The values stay in the current browser state only. The page is built for quick local comparisons and copy-paste theorycrafting.",
        },
      ]}
      relatedTools={[
        { title: "Damage Calculator", slug: "damage-calculator", icon: <Target className="w-4 h-4" />, color: 35, benefit: "Open a broader generic combat calculator" },
        { title: "XP Level Calculator", slug: "xp-level-calculator", icon: <TrendingUp className="w-4 h-4" />, color: 210, benefit: "Stay inside another progression-style gaming tool" },
        { title: "Game Currency Converter", slug: "game-currency-converter", icon: <BarChart3 className="w-4 h-4" />, color: 145, benefit: "Use another numbers-driven gaming route" },
        { title: "Gaming FPS Calculator", slug: "gaming-fps-calculator", icon: <Gauge className="w-4 h-4" />, color: 300, benefit: "Open another completed gaming utility" },
        { title: "Percentage Calculator", slug: "percentage-calculator", icon: <Copy className="w-4 h-4" />, color: 265, benefit: "Check rate changes and scaling deltas" },
        { title: "D&D Dice Roller", slug: "dnd-dice-roller", icon: <RotateCcw className="w-4 h-4" />, color: 20, benefit: "Browse another gaming utility page" },
      ]}
      ctaTitle="Need Another Genshin Planning Tool?"
      ctaDescription="Keep moving through the gaming calculator category and continue replacing placeholder routes with real pages."
      ctaHref="/category/gaming"
    />
  );
}
