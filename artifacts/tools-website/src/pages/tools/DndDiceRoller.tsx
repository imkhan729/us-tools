import { useMemo, useState } from "react";
import {
  BarChart3,
  BookOpen,
  Copy,
  Dices,
  RefreshCw,
  Shield,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";
import UtilityToolPageShell from "./UtilityToolPageShell";

type RollMode = "normal" | "advantage" | "disadvantage";

interface DiceTerm {
  count: number;
  sides: number;
}

interface ParsedExpression {
  dice: DiceTerm[];
  flatModifier: number;
  normalized: string;
}

interface RolledDiceGroup {
  label: string;
  rolls: number[];
  subtotal: number;
}

interface ExpressionRollResult {
  notation: string;
  groups: RolledDiceGroup[];
  flatModifier: number;
  total: number;
  minimum: number;
  maximum: number;
}

interface D20CheckResult {
  rolls: number[];
  selected: number;
  mode: RollMode;
  totalModifier: number;
  finalTotal: number;
  dc: number;
  success: boolean;
  critical: "critical-success" | "critical-failure" | "none";
}

const EXPRESSION_PRESETS = [
  { label: "Attack Roll", notation: "1d20+5" },
  { label: "Longsword Damage", notation: "1d8+3" },
  { label: "Sneak Attack", notation: "1d8+3d6+4" },
  { label: "Fireball", notation: "8d6" },
  { label: "Healing Word", notation: "1d4+4" },
  { label: "Great Axe Crit", notation: "2d12+5" },
];

const QUICK_CHECK_PRESETS = [
  { label: "Skill Check", ability: 3, proficiency: 2, misc: 0, dc: 15, mode: "normal" as RollMode },
  { label: "Attack With Advantage", ability: 4, proficiency: 3, misc: 1, dc: 17, mode: "advantage" as RollMode },
  { label: "Saving Throw", ability: 2, proficiency: 4, misc: 0, dc: 16, mode: "normal" as RollMode },
  { label: "Hard Check, Disadv.", ability: 5, proficiency: 0, misc: 0, dc: 20, mode: "disadvantage" as RollMode },
];

function formatModifier(value: number) {
  if (value === 0) return "0";
  return value > 0 ? `+${value}` : String(value);
}

function parseNotation(input: string): ParsedExpression {
  const compact = input.replace(/\s+/g, "");
  if (!compact) {
    throw new Error("Enter a dice notation such as 1d20+5 or 2d6+1d8+3.");
  }

  const tokens = compact.match(/[+-]?[^+-]+/g);
  if (!tokens) {
    throw new Error("The notation could not be parsed.");
  }

  const dice: DiceTerm[] = [];
  let flatModifier = 0;
  const normalizedParts: string[] = [];

  for (const token of tokens) {
    const diceMatch = token.match(/^([+-]?)(\d*)d(\d+)$/i);
    if (diceMatch) {
      const sign = diceMatch[1] === "-" ? -1 : 1;
      if (sign < 0) {
        throw new Error("Negative dice groups are not supported. Use positive dice plus a negative flat modifier instead.");
      }

      const count = Number.parseInt(diceMatch[2] || "1", 10);
      const sides = Number.parseInt(diceMatch[3], 10);

      if (!Number.isFinite(count) || count < 1 || count > 100) {
        throw new Error("Each dice group must roll between 1 and 100 dice.");
      }

      if (!Number.isFinite(sides) || sides < 2 || sides > 1000) {
        throw new Error("Dice sides must be between 2 and 1000.");
      }

      dice.push({ count, sides });
      normalizedParts.push(`${dice.length === 1 ? "" : "+"}${count}d${sides}`);
      continue;
    }

    if (/^[+-]?\d+$/.test(token)) {
      const modifier = Number.parseInt(token, 10);
      flatModifier += modifier;
      normalizedParts.push(
        modifier >= 0
          ? `${normalizedParts.length ? "+" : ""}${modifier}`
          : String(modifier),
      );
      continue;
    }

    throw new Error(`Unsupported token "${token}". Use notation like 1d20+5 or 2d6+1d8+3.`);
  }

  if (!dice.length) {
    throw new Error("Add at least one dice group such as 1d20 or 2d6.");
  }

  return {
    dice,
    flatModifier,
    normalized: normalizedParts.join(""),
  };
}

function rollDie(sides: number) {
  return Math.floor(Math.random() * sides) + 1;
}

function rollExpression(parsed: ParsedExpression): ExpressionRollResult {
  const groups = parsed.dice.map((term) => {
    const rolls = Array.from({ length: term.count }, () => rollDie(term.sides));
    const subtotal = rolls.reduce((sum, value) => sum + value, 0);
    return {
      label: `${term.count}d${term.sides}`,
      rolls,
      subtotal,
    };
  });

  const minimum = parsed.dice.reduce((sum, term) => sum + term.count, 0) + parsed.flatModifier;
  const maximum = parsed.dice.reduce((sum, term) => sum + term.count * term.sides, 0) + parsed.flatModifier;
  const total = groups.reduce((sum, group) => sum + group.subtotal, 0) + parsed.flatModifier;

  return {
    notation: parsed.normalized,
    groups,
    flatModifier: parsed.flatModifier,
    total,
    minimum,
    maximum,
  };
}

function rollD20Check(mode: RollMode, totalModifier: number, dc: number): D20CheckResult {
  const rolls = mode === "normal" ? [rollDie(20)] : [rollDie(20), rollDie(20)];
  const selected = mode === "advantage"
    ? Math.max(...rolls)
    : mode === "disadvantage"
      ? Math.min(...rolls)
      : rolls[0];
  const finalTotal = selected + totalModifier;

  let critical: D20CheckResult["critical"] = "none";
  if (selected === 20) critical = "critical-success";
  if (selected === 1) critical = "critical-failure";

  return {
    rolls,
    selected,
    mode,
    totalModifier,
    finalTotal,
    dc,
    success: finalTotal >= dc,
    critical,
  };
}

export default function DndDiceRoller() {
  const [notation, setNotation] = useState("1d20+5");
  const [expressionResult, setExpressionResult] = useState<ExpressionRollResult | null>(null);
  const [expressionError, setExpressionError] = useState("");
  const [expressionHistory, setExpressionHistory] = useState<ExpressionRollResult[]>([]);
  const [abilityModifier, setAbilityModifier] = useState("3");
  const [proficiencyBonus, setProficiencyBonus] = useState("2");
  const [miscBonus, setMiscBonus] = useState("0");
  const [difficultyClass, setDifficultyClass] = useState("15");
  const [rollMode, setRollMode] = useState<RollMode>("normal");
  const [checkResult, setCheckResult] = useState<D20CheckResult | null>(null);
  const [copiedLabel, setCopiedLabel] = useState("");

  const parsedNotation = useMemo(() => {
    try {
      return {
        parsed: parseNotation(notation),
        error: "",
      };
    } catch (error) {
      return {
        parsed: null,
        error: error instanceof Error ? error.message : "Invalid notation.",
      };
    }
  }, [notation]);

  const expectedAverage = useMemo(() => {
    if (!parsedNotation.parsed) return null;
    const diceAverage = parsedNotation.parsed.dice.reduce(
      (sum, term) => sum + term.count * ((term.sides + 1) / 2),
      0,
    );
    return diceAverage + parsedNotation.parsed.flatModifier;
  }, [parsedNotation.parsed]);

  const totalCheckModifier =
    (Number.parseInt(abilityModifier, 10) || 0) +
    (Number.parseInt(proficiencyBonus, 10) || 0) +
    (Number.parseInt(miscBonus, 10) || 0);

  const copyValue = async (label: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedLabel(label);
    window.setTimeout(() => setCopiedLabel(""), 1800);
  };

  const runExpressionRoll = () => {
    try {
      const parsed = parseNotation(notation);
      const result = rollExpression(parsed);
      setExpressionResult(result);
      setExpressionError("");
      setExpressionHistory((current) => [result, ...current].slice(0, 8));
    } catch (error) {
      setExpressionResult(null);
      setExpressionError(error instanceof Error ? error.message : "The roll could not be calculated.");
    }
  };

  const runD20Check = () => {
    const dc = Number.parseInt(difficultyClass, 10) || 0;
    setCheckResult(rollD20Check(rollMode, totalCheckModifier, dc));
  };

  const loadExpressionPreset = (presetNotation: string) => {
    setNotation(presetNotation);
    setExpressionResult(null);
    setExpressionError("");
  };

  const loadCheckPreset = (preset: (typeof QUICK_CHECK_PRESETS)[number]) => {
    setAbilityModifier(String(preset.ability));
    setProficiencyBonus(String(preset.proficiency));
    setMiscBonus(String(preset.misc));
    setDifficultyClass(String(preset.dc));
    setRollMode(preset.mode);
    setCheckResult(null);
  };

  const clearAll = () => {
    setNotation("1d20+5");
    setExpressionResult(null);
    setExpressionError("");
    setExpressionHistory([]);
    setAbilityModifier("3");
    setProficiencyBonus("2");
    setMiscBonus("0");
    setDifficultyClass("15");
    setRollMode("normal");
    setCheckResult(null);
  };

  const latestSummary = expressionResult
    ? `${expressionResult.notation} = ${expressionResult.total}`
    : parsedNotation.parsed
      ? `${parsedNotation.parsed.normalized} (ready to roll)`
      : "Waiting for valid notation";

  const checkSummary = checkResult
    ? `d20 ${checkResult.mode} roll ${checkResult.selected} ${formatModifier(checkResult.totalModifier)} = ${checkResult.finalTotal} vs DC ${checkResult.dc}`
    : `Modifier ${formatModifier(totalCheckModifier)} vs DC ${difficultyClass || "15"}`;

  return (
    <UtilityToolPageShell
      title="D&D Dice Roller"
      seoTitle="D&D Dice Roller - Roll d20, Damage Dice, Advantage, and Checks Online"
      seoDescription="Free D&D dice roller with notation parsing, d20 checks, advantage and disadvantage, damage rolls, DC comparison, and roll history for tabletop RPG sessions."
      canonical="https://usonlinetools.com/gaming/dnd-dice-roller"
      categoryName="Gaming Calculators"
      categoryHref="/category/gaming"
      heroDescription="Roll Dungeons & Dragons dice online with real notation support, instant damage totals, advantage and disadvantage handling, and a dedicated d20 check panel. This free D&D dice roller is built for combat turns, saving throws, spell damage, stealth checks, and fast table play on desktop or mobile without opening multiple tools."
      heroIcon={<Dices className="w-3.5 h-3.5" />}
      calculatorLabel="D&D Dice Workspace"
      calculatorDescription="Parse notation like 1d20+5 or 8d6, run d20 checks against a DC, and keep recent rolls visible during play."
      calculator={
        <div className="space-y-5">
          <div className="flex flex-wrap gap-2">
            {EXPRESSION_PRESETS.map((preset) => (
              <button
                key={preset.label}
                onClick={() => loadExpressionPreset(preset.notation)}
                className="rounded-full border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:border-blue-500/40 hover:bg-muted"
              >
                {preset.label} <span className="font-mono text-muted-foreground">{preset.notation}</span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[300px_1fr] gap-5">
            <div className="space-y-4 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
              <div>
                <label htmlFor="dnd-notation" className="mb-2 block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                  Roll Notation
                </label>
                <input
                  id="dnd-notation"
                  value={notation}
                  onChange={(event) => setNotation(event.target.value)}
                  placeholder="1d20+5"
                  className="tool-calc-input w-full font-mono"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[1.08fr_0.92fr] gap-4">
                <div className="rounded-2xl border border-border bg-card p-5">
                  <p className="mb-4 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Copy-Ready Snippets</p>
                  <div className="space-y-3">
                    {[
                      { label: "Current notation", value: parsedNotation.parsed?.normalized ?? notation },
                      { label: "Latest roll summary", value: expressionResult ? `${expressionResult.notation} = ${expressionResult.total}` : "" },
                      { label: "d20 check summary", value: checkResult ? checkSummary : "" },
                    ].map((item) => (
                      <div key={item.label} className="rounded-xl border border-border bg-muted/40 p-3">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">{item.label}</p>
                          <button onClick={() => copyValue(item.label, item.value)} className="text-xs font-bold text-blue-600 hover:text-blue-700" disabled={!item.value}>
                            {copiedLabel === item.label ? "Copied" : "Copy"}
                          </button>
                        </div>
                        <pre className="mt-2 overflow-x-auto rounded-xl bg-slate-950 p-3 text-xs leading-relaxed text-slate-100">
                          <code>{item.value || "Available after you roll."}</code>
                        </pre>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-2xl border border-border bg-card p-5">
                    <p className="mb-3 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Session Metrics</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2.5">
                        <span className="text-sm text-muted-foreground">Recent expression rolls</span>
                        <span className="text-sm font-bold text-foreground">{expressionHistory.length}</span>
                      </div>
                      <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2.5">
                        <span className="text-sm text-muted-foreground">Current d20 mode</span>
                        <span className="text-sm font-bold text-foreground">
                          {rollMode === "normal" ? "Normal" : rollMode === "advantage" ? "Advantage" : "Disadvantage"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2.5">
                        <span className="text-sm text-muted-foreground">Combined check modifier</span>
                        <span className="text-sm font-bold text-foreground">{formatModifier(totalCheckModifier)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
                    <p className="mb-2 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Table Use Note</p>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      A strong D&D dice roller should not only output a total. It should let players verify the underlying rolls, modifiers, and DC comparison quickly enough to keep combat moving and transparent enough that everyone at the table can trust the result.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      howSteps={[
        {
          title: "Enter a real tabletop notation instead of rolling one die at a time",
          description:
            "The notation parser is the main difference between a generic randomizer and a proper D&D dice roller. In real sessions you rarely want only a raw d20 or a single d6. You want complete expressions such as attack rolls, sneak attack damage, healing, smite bursts, or spell damage in one place. That is why this page accepts expressions like 1d20+5, 2d6+1d8+3, and 8d6 instead of forcing you to piece totals together manually.",
        },
        {
          title: "Use the preset buttons when the table needs speed more than customization",
          description:
            "Presets matter because many tabletop turns repeat common patterns. Attack rolls, sword damage, healing word, and fireball are not exotic edge cases. They are routine actions. Loading them in one click lowers friction for mobile players, remote sessions, and DMs running multiple monsters or NPCs where every saved tap helps combat stay readable.",
        },
        {
          title: "Switch to the d20 check panel for checks, saves, and initiative-style moments",
          description:
            "Not every D&D moment is a damage expression. Sometimes the real question is whether a single d20 result beats a difficulty class, and whether advantage or disadvantage changes that outcome. The dedicated d20 panel handles those moments directly by exposing the roll mode, bonus stack, target DC, raw rolls, and final selected number instead of making you mentally translate a generic dice result into a rules outcome.",
        },
        {
          title: "Read the breakdown, not only the final total",
          description:
            "The result cards show each dice group separately because transparency matters at the table. A clean breakdown helps players verify that a crit was doubled correctly, that a modifier was added once rather than twice, or that an unusual spell expression rolled the right number of dice. When a digital roller hides too much, it slows trust. When it shows the structure clearly, it speeds the session up.",
        },
      ]}
      interpretationCards={[
        {
          title: "A tabletop dice roller should explain totals, not just produce them",
          description:
            "In D&D and similar systems, people often need to audit the math quickly. Showing each dice group and the flat modifier makes the result easier to trust during combat, especially when many bonuses stack or when players are learning the game.",
        },
        {
          title: "Advantage and disadvantage change which d20 matters",
          description:
            "Those rules are not just cosmetic rerolls. They change the selected die, which is why this page surfaces both raw d20 values and the chosen one. That makes initiative, stealth, perception, and attack checks far easier to verify than on a single-number roller.",
          className: "bg-cyan-500/5 border-cyan-500/20",
        },
        {
          title: "Notation support is the difference between a D&D tool and a generic randomizer",
          description:
            "D&D players think in expressions such as 1d20+7 or 6d8+4. Accepting notation keeps the workflow aligned with character sheets, class features, spell cards, and VTT habits, which is why notation parsing belongs in the core widget rather than being an afterthought.",
          className: "bg-violet-500/5 border-violet-500/20",
        },
        {
          title: "Digital dice are best used as a speed and clarity tool",
          description:
            "Some groups will always prefer physical dice, and that is fine. A browser roller earns its place when it reduces repetitive math, speeds up remote sessions, helps on mobile, and provides a transparent roll log for moments where everyone needs to see the same result quickly.",
          className: "bg-amber-500/5 border-amber-500/20",
        },
      ]}
      examples={[
        { scenario: "Melee attack roll", input: "1d20+5", output: "Single d20 plus attack bonus" },
        { scenario: "Sneak attack damage", input: "1d8+3d6+4", output: "Separate weapon, extra dice, and modifier total" },
        { scenario: "Area spell damage", input: "8d6", output: "Fast fireball-style burst damage" },
        { scenario: "Stealth with advantage", input: "d20 panel with +7 and advantage", output: "Two raw d20 rolls, highest selected, success vs DC" },
      ]}
      whyChoosePoints={[
        "This D&D dice roller is built as a genuine tabletop workflow page rather than a placeholder route. It understands notation, shows grouped dice results, supports flat modifiers, includes a dedicated d20 check panel, handles advantage and disadvantage, compares against a DC, and keeps recent expression rolls visible during a session. That makes it materially more useful than a single-button randomizer that only spits out a number.",
        "The page also follows the content structure established across the completed tools in this project. The working widget comes first, but it is backed by use instructions, interpretation notes, examples, FAQ content, and related internal links. That is important because search intent for a D&D dice roller is mixed: some users want instant rolls, while others also want help understanding how notation, modifiers, or d20 checks should be handled online.",
        "From a gameplay perspective, the best digital rollers reduce friction without becoming opaque. Expression parsing means players can copy the way they already think about actions on their sheet. The d20 panel means common checks do not need to be translated mentally. The result breakdown means totals remain auditable. Those three traits together are what make the page practical during real combat or exploration rather than only decorative.",
        "This implementation is also well suited to remote sessions and mobile play. Many groups use Discord, browser voice chat, or lightweight online notes instead of a full VTT. In that environment, a fast browser roller that works well on smaller screens and produces copyable summaries solves a real problem without demanding another account, plugin, or app install.",
        "Everything runs locally in the browser. That is a reasonable default for a game utility because the user only needs quick interaction speed, visible math, and session-friendly controls. There is no need to offload a dice roll to a remote service just to evaluate 8d6 or compare a d20 result to a difficulty class.",
      ]}
      faqs={[
        {
          q: "What notation does this D&D dice roller support?",
          a: "It supports common tabletop expressions such as 1d20+5, 2d6+3, 1d8+3d6+4, and 8d6. You can combine multiple positive dice groups with a flat positive or negative modifier. That covers most attack rolls, spell damage, healing, and ability-check use cases at the table.",
        },
        {
          q: "How does advantage and disadvantage work here?",
          a: "The d20 check panel rolls two d20 values when advantage or disadvantage is selected. With advantage it keeps the higher roll. With disadvantage it keeps the lower roll. The page shows both raw results and the selected die so the outcome is easy to verify.",
        },
        {
          q: "Can I use this for damage rolls and checks on the same page?",
          a: "Yes. That is one of the main reasons this page is more useful than a generic dice roller. The notation panel handles damage and compound expressions, while the d20 check panel handles attack checks, skill checks, initiative-style moments, and saving throws against a DC.",
        },
        {
          q: "Does the tool show each individual die result?",
          a: "Yes. Each dice group is broken out with its individual die values and a subtotal before the flat modifier is applied. That makes it easier to audit the math and keep table trust high during fast turns.",
        },
        {
          q: "Can this replace physical dice at the table?",
          a: "It can if your group wants speed, mobile convenience, or a shared visible result in a remote session. Some groups still prefer physical dice for feel and ritual. This page is designed to be a practical digital option, not to force one play style over another.",
        },
        {
          q: "Is this only for Dungeons & Dragons?",
          a: "No. It is optimized for D&D style notation and d20 checks, but the notation roller also works well for Pathfinder and other tabletop RPGs that use familiar dice expressions. Any game that relies on combinations like 2d6+3 or 1d20+modifier can use the same widget.",
        },
        {
          q: "Why use a dedicated D&D dice roller instead of a random number generator?",
          a: "Because D&D players need more than one raw number. They need expression parsing, grouped roll output, modifier handling, advantage and disadvantage support, and quick DC comparison. A generic random number tool does not match those rules-oriented workflows.",
        },
        {
          q: "Are my rolls stored anywhere?",
          a: "No. The session history shown on the page lives in the browser state only. It is there to help you track a short run of recent rolls during play, not to upload or persist game data remotely.",
        },
      ]}
      relatedTools={[
        { title: "Dice Roller", slug: "dice-roller", icon: <Dices className="w-4 h-4" />, color: 340, benefit: "Use the broader general-purpose roller" },
        { title: "Random Number Generator", slug: "random-number-generator", icon: <BarChart3 className="w-4 h-4" />, color: 210, benefit: "Quick ranges outside tabletop notation" },
        { title: "Spin Wheel Generator", slug: "spin-wheel-generator", icon: <Trophy className="w-4 h-4" />, color: 35, benefit: "Randomize initiative or encounters differently" },
        { title: "Random Picker Tool", slug: "random-picker-tool", icon: <Target className="w-4 h-4" />, color: 150, benefit: "Choose names, loot, or encounters from a list" },
        { title: "Coin Flip", slug: "coin-flip", icon: <Shield className="w-4 h-4" />, color: 265, benefit: "Resolve binary table decisions fast" },
        { title: "Study Planner Calculator", slug: "study-planner-calculator", icon: <BookOpen className="w-4 h-4" />, color: 25, benefit: "Jump to another structured planner tool" },
      ]}
      ctaTitle="Need More Table and Randomizer Tools?"
      ctaDescription="Explore more game-friendly randomizers, generators, and utility pages across the same tool hub."
      ctaHref="/category/gaming"
    />
  );
}
