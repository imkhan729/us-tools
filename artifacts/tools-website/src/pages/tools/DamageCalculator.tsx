import { useMemo, useState } from "react";
import {
  Activity,
  BarChart3,
  Copy,
  Crosshair,
  Gauge,
  RotateCcw,
  Shield,
  Sword,
  Target,
  TrendingUp,
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

export default function DamageCalculator() {
  const [attackPowerInput, setAttackPowerInput] = useState("1500");
  const [skillMultiplierInput, setSkillMultiplierInput] = useState("220");
  const [flatBonusInput, setFlatBonusInput] = useState("120");
  const [enemyDefenseInput, setEnemyDefenseInput] = useState("900");
  const [defensePenInput, setDefensePenInput] = useState("15");
  const [resistanceInput, setResistanceInput] = useState("10");
  const [damageBuffInput, setDamageBuffInput] = useState("25");
  const [critChanceInput, setCritChanceInput] = useState("55");
  const [critDamageInput, setCritDamageInput] = useState("90");
  const [attackSpeedInput, setAttackSpeedInput] = useState("1.4");
  const [comboHitsInput, setComboHitsInput] = useState("3");
  const [enemyHpInput, setEnemyHpInput] = useState("18000");
  const [copiedLabel, setCopiedLabel] = useState("");

  const damage = useMemo(() => {
    const attackPower = positive(attackPowerInput, 0);
    const skillMultiplier = positive(skillMultiplierInput, 0) / 100;
    const flatBonus = positive(flatBonusInput, 0);
    const enemyDefense = positive(enemyDefenseInput, 0);
    const defensePen = clamp(positive(defensePenInput, 0), 0, 100) / 100;
    const resistance = clamp(positive(resistanceInput, 0), -100, 95) / 100;
    const damageBuff = positive(damageBuffInput, 0) / 100;
    const critChance = clamp(positive(critChanceInput, 0), 0, 100) / 100;
    const critDamage = positive(critDamageInput, 0) / 100;
    const attackSpeed = positive(attackSpeedInput, 0);
    const comboHits = Math.max(1, Math.round(positive(comboHitsInput, 1)));
    const enemyHp = positive(enemyHpInput, 0);

    const baseRaw = attackPower * skillMultiplier + flatBonus;
    const effectiveDefense = enemyDefense * (1 - defensePen);
    const defenseMultiplier = 100 / (100 + effectiveDefense);
    const resistMultiplier = 1 - resistance;
    const buffMultiplier = 1 + damageBuff;
    const nonCritDamage = Math.max(0, baseRaw * defenseMultiplier * resistMultiplier * buffMultiplier);
    const critHitDamage = nonCritDamage * (1 + critDamage);
    const averageHitDamage = nonCritDamage * (1 - critChance) + critHitDamage * critChance;
    const dps = averageHitDamage * attackSpeed;
    const burstDamage = averageHitDamage * comboHits;
    const ttkSeconds = dps > 0 ? enemyHp / dps : 0;
    const hitsToKill = averageHitDamage > 0 ? Math.ceil(enemyHp / averageHitDamage) : 0;
    const comboesToKill = burstDamage > 0 ? Math.ceil(enemyHp / burstDamage) : 0;

    return {
      attackPower,
      skillMultiplier,
      flatBonus,
      enemyDefense,
      defensePen,
      resistance,
      damageBuff,
      critChance,
      critDamage,
      attackSpeed,
      comboHits,
      enemyHp,
      baseRaw,
      effectiveDefense,
      defenseMultiplier,
      resistMultiplier,
      buffMultiplier,
      nonCritDamage,
      critHitDamage,
      averageHitDamage,
      dps,
      burstDamage,
      ttkSeconds,
      hitsToKill,
      comboesToKill,
    };
  }, [
    attackPowerInput,
    attackSpeedInput,
    comboHitsInput,
    critChanceInput,
    critDamageInput,
    damageBuffInput,
    defensePenInput,
    enemyDefenseInput,
    enemyHpInput,
    flatBonusInput,
    resistanceInput,
    skillMultiplierInput,
  ]);

  const copyValue = async (label: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedLabel(label);
    window.setTimeout(() => setCopiedLabel(""), 1800);
  };

  const resetAll = () => {
    setAttackPowerInput("1500");
    setSkillMultiplierInput("220");
    setFlatBonusInput("120");
    setEnemyDefenseInput("900");
    setDefensePenInput("15");
    setResistanceInput("10");
    setDamageBuffInput("25");
    setCritChanceInput("55");
    setCritDamageInput("90");
    setAttackSpeedInput("1.4");
    setComboHitsInput("3");
    setEnemyHpInput("18000");
  };

  const loadBurstPreset = () => {
    setAttackPowerInput("2400");
    setSkillMultiplierInput("360");
    setFlatBonusInput("180");
    setEnemyDefenseInput("700");
    setDefensePenInput("25");
    setResistanceInput("5");
    setDamageBuffInput("40");
    setCritChanceInput("45");
    setCritDamageInput("130");
    setAttackSpeedInput("0.9");
    setComboHitsInput("4");
    setEnemyHpInput("22000");
  };

  const loadSustainedPreset = () => {
    setAttackPowerInput("1300");
    setSkillMultiplierInput("140");
    setFlatBonusInput("80");
    setEnemyDefenseInput("1100");
    setDefensePenInput("10");
    setResistanceInput("15");
    setDamageBuffInput("18");
    setCritChanceInput("70");
    setCritDamageInput("60");
    setAttackSpeedInput("2.2");
    setComboHitsInput("6");
    setEnemyHpInput("26000");
  };

  const summarySnippet = [
    `Base raw damage: ${format(damage.baseRaw, 2)}`,
    `Non-crit hit: ${format(damage.nonCritDamage, 2)}`,
    `Crit hit: ${format(damage.critHitDamage, 2)}`,
    `Average hit: ${format(damage.averageHitDamage, 2)}`,
    `DPS: ${format(damage.dps, 2)}`,
    `Burst combo: ${format(damage.burstDamage, 2)}`,
  ].join("\n");

  const killSnippet = [
    `Enemy HP: ${format(damage.enemyHp, 2)}`,
    `Hits to kill: ${format(damage.hitsToKill, 0)}`,
    `Combos to kill: ${format(damage.comboesToKill, 0)}`,
    `Estimated TTK: ${format(damage.ttkSeconds, 2)} sec`,
    `Likely mitigation: defense x${format(damage.defenseMultiplier, 3)}, resist x${format(damage.resistMultiplier, 3)}`,
  ].join("\n");

  const calculator = (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <button onClick={loadBurstPreset} className="rounded-full border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:border-blue-500/40 hover:bg-muted">
          Load Burst Build
        </button>
        <button onClick={loadSustainedPreset} className="rounded-full border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:border-blue-500/40 hover:bg-muted">
          Load Sustained Build
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
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Damage Inputs</p>
                <p className="text-sm text-muted-foreground">Model attack power, skill scaling, enemy mitigation, buffs, and crit stats from one damage workspace.</p>
              </div>
              <Sword className="w-5 h-5 text-blue-500" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Attack Power</label>
                <input type="number" min="0" step="1" value={attackPowerInput} onChange={(event) => setAttackPowerInput(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Skill Multiplier %</label>
                <input type="number" min="0" step="1" value={skillMultiplierInput} onChange={(event) => setSkillMultiplierInput(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Flat Bonus</label>
                <input type="number" min="0" step="1" value={flatBonusInput} onChange={(event) => setFlatBonusInput(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Enemy Defense</label>
                <input type="number" min="0" step="1" value={enemyDefenseInput} onChange={(event) => setEnemyDefenseInput(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Defense Pen %</label>
                <input type="number" min="0" step="1" value={defensePenInput} onChange={(event) => setDefensePenInput(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Resistance %</label>
                <input type="number" min="-100" max="95" step="1" value={resistanceInput} onChange={(event) => setResistanceInput(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Damage Buff %</label>
                <input type="number" min="0" step="1" value={damageBuffInput} onChange={(event) => setDamageBuffInput(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Crit Chance %</label>
                <input type="number" min="0" max="100" step="1" value={critChanceInput} onChange={(event) => setCritChanceInput(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Crit Damage %</label>
                <input type="number" min="0" step="1" value={critDamageInput} onChange={(event) => setCritDamageInput(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Attack Speed</label>
                <input type="number" min="0" step="0.1" value={attackSpeedInput} onChange={(event) => setAttackSpeedInput(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Combo Hits</label>
                <input type="number" min="1" step="1" value={comboHitsInput} onChange={(event) => setComboHitsInput(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Enemy HP</label>
                <input type="number" min="0" step="1" value={enemyHpInput} onChange={(event) => setEnemyHpInput(event.target.value)} className="tool-calc-input w-full" />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Average Hit</p>
                <p className="mt-2 text-2xl font-black text-emerald-600">{format(damage.averageHitDamage, 2)}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Crit Hit</p>
                <p className="mt-2 text-2xl font-black text-foreground">{format(damage.critHitDamage, 2)}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">DPS</p>
                <p className="mt-2 text-2xl font-black text-foreground">{format(damage.dps, 2)}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Burst Combo</p>
                <p className="mt-2 text-2xl font-black text-foreground">{format(damage.burstDamage, 2)}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Kill Analysis</p>
                <p className="text-sm text-muted-foreground">Translate your damage output into hits to kill, comboes to kill, and estimated time to kill.</p>
              </div>
              <Target className="w-5 h-5 text-blue-500" />
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Hits To Kill</p>
                <p className="mt-2 text-2xl font-black text-foreground">{format(damage.hitsToKill, 0)}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Combos To Kill</p>
                <p className="mt-2 text-2xl font-black text-foreground">{format(damage.comboesToKill, 0)}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">TTK</p>
                <p className="mt-2 text-2xl font-black text-foreground">{format(damage.ttkSeconds, 2)} s</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Frame Time Analog</p>
                <p className="mt-2 text-2xl font-black text-foreground">{damage.dps > 0 ? format(1 / damage.attackSpeed, 2) : "0"} s/hit</p>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
              <p className="text-sm leading-relaxed text-muted-foreground">
                The current mitigation stack applies a defense multiplier of <span className="font-bold text-foreground">{format(damage.defenseMultiplier, 3)}</span> and a resistance multiplier of <span className="font-bold text-foreground">{format(damage.resistMultiplier, 3)}</span>. If your build still feels weak, those are usually the first levers to inspect alongside crit consistency.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="mb-4 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Realtime Reading</p>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="font-bold text-foreground">Raw to Effective</p>
                <p className="mt-1">Your raw pre-mitigation number is {format(damage.baseRaw, 2)}, but enemy mitigation and buffs reshape that into about {format(damage.averageHitDamage, 2)} average damage per hit.</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="font-bold text-foreground">Crit Dependence</p>
                <p className="mt-1">This setup jumps from {format(damage.nonCritDamage, 2)} on a non-crit to {format(damage.critHitDamage, 2)} on a crit, so crit rate stability matters almost as much as raw attack here.</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="font-bold text-foreground">Kill Pressure</p>
                <p className="mt-1">Against an enemy with {format(damage.enemyHp, 0)} HP, the model expects roughly {format(damage.hitsToKill, 0)} hits or {format(damage.comboesToKill, 0)} combo cycles, with a time-to-kill near {format(damage.ttkSeconds, 2)} seconds.</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="mb-4 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Copy-Ready Snippets</p>
            <div className="space-y-3">
              {[
                { label: "Damage summary", value: summarySnippet },
                { label: "Kill summary", value: killSnippet },
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
                This is a generic game damage model. Exact formulas vary between games, especially around defense scaling, resist floors, separate multipliers, and crit behavior, so use this page as a planning calculator unless you are intentionally mirroring a known formula.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <UtilityToolPageShell
      title="Damage Calculator"
      seoTitle="Online Damage Calculator - DPS, Crit Damage, Burst Combo, and TTK"
      seoDescription="Free online damage calculator. Calculate average hit damage, DPS, crit scaling, burst combo damage, and time to kill using attack, defense, resistance, and buff inputs."
      canonical="https://usonlinetools.com/gaming/damage-calculator"
      categoryName="Gaming Calculators"
      categoryHref="/category/gaming"
      heroDescription="Use this online damage calculator to break down how a build turns raw attack stats into real damage once skill multipliers, enemy defense, resistance, buffs, crits, and attack speed are all applied. The page calculates non-crit hits, crit hits, average damage, DPS, burst combo output, and time to kill, which makes it useful for theorycrafting in RPGs, shooters, MOBAs, ARPGs, and any combat system where build efficiency matters."
      heroIcon={<Sword className="w-3.5 h-3.5" />}
      calculatorLabel="Combat Damage Workspace"
      calculatorDescription="Model attack, mitigation, crit scaling, and combo behavior from one generic damage calculator."
      calculator={calculator}
      howSteps={[
        {
          title: "Start from attack power and the skill multiplier",
          description:
            "In most game formulas, the first useful layer is the relationship between your attack stat and the scaling on the ability you are using. That is why this page starts with attack power, skill multiplier, and flat bonus damage. Those values define the raw hit before mitigation, and they give you the clearest starting point for comparing build changes.",
        },
        {
          title: "Apply defense, penetration, and resistance before judging the build",
          description:
            "A build that looks strong on paper can lose far more damage than expected once enemy mitigation is applied. Defense and resistance are often where theorycrafting mistakes happen because players focus on offensive stats while ignoring how much of that output is actually being removed on contact. Adding defense penetration into the same model helps you test whether penetration is more valuable than another raw-damage increase.",
        },
        {
          title: "Use crit chance and crit damage together instead of in isolation",
          description:
            "Crit stats are easy to misread when viewed separately. A large crit damage number means much less if the crit chance is unreliable, while very high crit chance can still underperform if the crit modifier is too small. The average-hit output on this page combines both into one practical estimate so you can judge the real contribution of the crit package instead of eyeballing it.",
        },
        {
          title: "Translate the result into DPS and time to kill",
          description:
            "Most players do not care only about one clean hit. They care about whether the enemy dies quickly, whether a combo is enough, and how the build feels over time. That is why the page converts average hit damage into DPS, burst combo damage, hits to kill, combos to kill, and estimated time to kill. Those outputs are usually much more useful than raw hit numbers alone.",
        },
      ]}
      interpretationCards={[
        {
          title: "Average hit is often the most honest single output",
          description:
            "It blends crit chance and crit damage into one number, so it is usually more useful than looking only at the best-case crit hit or only at the non-crit baseline.",
        },
        {
          title: "Burst damage matters when fights end in short windows",
          description:
            "If your game rewards front-loaded kill windows, combo burst can matter more than sustained DPS over longer fights.",
          className: "bg-cyan-500/5 border-cyan-500/20",
        },
        {
          title: "DPS matters when the target survives long enough",
          description:
            "In longer encounters, sustained average output and attack speed usually matter more than one oversized crit or one clean combo string.",
          className: "bg-emerald-500/5 border-emerald-500/20",
        },
        {
          title: "Mitigation can erase more value than players expect",
          description:
            "If your average damage looks disappointing, the problem is often not only low attack. Enemy defense and resistance may be suppressing the build harder than expected.",
          className: "bg-amber-500/5 border-amber-500/20",
        },
      ]}
      examples={[
        { scenario: "Balanced crit build", input: "Moderate attack, 55% crit chance, 90% crit damage", output: "Solid average-hit output with reliable sustained pressure" },
        { scenario: "Burst combo build", input: "High skill multiplier, strong crit damage, lower attack speed", output: "Bigger combo spikes but less steady DPS between windows" },
        { scenario: "Tanky enemy test", input: "High defense and resistance on the target", output: "Shows whether penetration or raw damage would help more" },
        { scenario: "TTK planning", input: "Enemy HP plus attack speed and combo hits", output: "Estimate how many hits or combo cycles are needed to finish the target" },
      ]}
      whyChoosePoints={[
        "This Damage Calculator is built as a real combat-planning page rather than a single-line formula widget. It covers raw damage, enemy mitigation, penetration, crit scaling, DPS, combo burst, and time to kill in one place, which is the level of context most theorycrafting actually needs.",
        "The page also keeps the model honest by separating non-crit, crit, and average-hit outcomes. That matters because many players overestimate the value of crit packages when they only look at the biggest possible hit rather than the expected average.",
        "The kill analysis is useful because build decisions usually need to answer practical questions: how many hits does this take, does the combo kill, and how fast does the target die. Those are the outputs that shape gameplay decisions most directly.",
        "Defense and resistance are treated as first-class inputs because offensive stat calculators often fail when they ignore what the enemy is doing to your damage. Including mitigation makes the result more realistic and more actionable.",
        "Everything runs locally in the browser with immediate feedback. Enter the build, test a target, copy the result, and compare another setup. That is the right interaction model for a generic combat calculator.",
      ]}
      faqs={[
        {
          q: "How does this damage calculator work?",
          a: "It starts from attack power, skill scaling, and flat bonus damage, then applies defense mitigation, resistance, buffs, crit chance, crit damage, attack speed, and target HP to produce average-hit, DPS, burst, and kill-time outputs.",
        },
        {
          q: "Is this tied to a specific game?",
          a: "No. It is a generic combat calculator designed to approximate many common game damage patterns. Exact formulas still vary by title.",
        },
        {
          q: "What is the difference between non-crit, crit, and average hit?",
          a: "Non-crit is the baseline hit without a critical strike. Crit hit is the damage when a critical strike occurs. Average hit blends both using your crit chance, which usually makes it the most useful practical output.",
        },
        {
          q: "Why include defense penetration?",
          a: "Because penetration can change effective damage more than a raw attack increase when enemy defense is high. The calculator lets you compare that tradeoff directly.",
        },
        {
          q: "What does time to kill mean here?",
          a: "Time to kill is the estimated number of seconds needed to remove the entered enemy HP at your modeled sustained DPS. It is a rough planning metric rather than a promise of exact in-game timing.",
        },
        {
          q: "Why does resistance allow negative values?",
          a: "Some games let enemies become vulnerable or have resistance reductions that push the effective multiplier above normal. Negative resistance is a simple way to model that type of weakness.",
        },
        {
          q: "Should I optimize for burst or DPS?",
          a: "That depends on the game and the fight pattern. Burst is usually stronger in short kill windows, while DPS matters more in long fights or when targets survive multiple rotations.",
        },
        {
          q: "Does the page save my builds?",
          a: "No. The values stay in the current browser state only. The calculator is built for quick local testing and comparison.",
        },
      ]}
      relatedTools={[
        { title: "Gaming FPS Calculator", slug: "gaming-fps-calculator", icon: <Activity className="w-4 h-4" />, color: 210, benefit: "Check another performance-focused gaming page" },
        { title: "XP Level Calculator", slug: "xp-level-calculator", icon: <TrendingUp className="w-4 h-4" />, color: 145, benefit: "Stay inside another progression-focused tool" },
        { title: "Esports Earnings Calculator", slug: "esports-earnings-calculator", icon: <Gauge className="w-4 h-4" />, color: 35, benefit: "Open another completed gaming utility" },
        { title: "Game Currency Converter", slug: "game-currency-converter", icon: <BarChart3 className="w-4 h-4" />, color: 300, benefit: "Compare another numbers-driven gaming route" },
        { title: "Percentage Calculator", slug: "percentage-calculator", icon: <Copy className="w-4 h-4" />, color: 265, benefit: "Measure buffs, mitigation, and crit changes" },
        { title: "D&D Dice Roller", slug: "dnd-dice-roller", icon: <RotateCcw className="w-4 h-4" />, color: 20, benefit: "Use another gaming utility page" },
      ]}
      ctaTitle="Need Another Combat Planning Tool?"
      ctaDescription="Keep moving through the gaming calculator category and continue replacing placeholder routes with real pages."
      ctaHref="/category/gaming"
    />
  );
}
