import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Circle,
  Dices,
  Plus,
  Minus,
  Trash2,
  TrendingUp,
} from "lucide-react";
import UtilityToolPageShell from "./UtilityToolPageShell";
import { getCanonicalToolPath } from "@/data/tools";

type DiceType = 4 | 6 | 8 | 10 | 12 | 20 | 100;
const DICE_TYPES: DiceType[] = [4, 6, 8, 10, 12, 20, 100];

interface DiceConfig {
  type: DiceType;
  count: number;
  modifier: number;
}

interface RollResult {
  rolls: number[];
  modifier: number;
  total: number;
  type: DiceType;
  count: number;
}

function rollDice(config: DiceConfig): RollResult {
  const rolls = Array.from({ length: config.count }, () => Math.floor(Math.random() * config.type) + 1);
  const total = rolls.reduce((a, b) => a + b, 0) + config.modifier;
  return { rolls, modifier: config.modifier, total, type: config.type, count: config.count };
}

function DieFace({ type, value, isNew }: { type: DiceType; value: number; isNew: boolean }) {
  const color = {
    4: "hsl(25,80%,55%)",
    6: "hsl(217,70%,55%)",
    8: "hsl(152,70%,45%)",
    10: "hsl(340,70%,55%)",
    12: "hsl(265,70%,55%)",
    20: "hsl(45,80%,50%)",
    100: "hsl(0,70%,55%)",
  }[type];

  return (
    <motion.div
      key={isNew ? Math.random() : undefined}
      initial={isNew ? { scale: 0.5, rotate: -30, opacity: 0 } : false}
      animate={{ scale: 1, rotate: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="w-14 h-14 rounded-2xl flex flex-col items-center justify-center flex-shrink-0 border-2"
      style={{ background: `${color}15`, borderColor: `${color}40`, color }}
    >
      <p className="text-lg font-black leading-none">{value}</p>
      <p className="text-[10px] font-bold opacity-60">d{type}</p>
    </motion.div>
  );
}

const DND_PRESETS = [
  { label: "Attack Roll", notation: "1d20" },
  { label: "Damage (dagger)", notation: "1d4" },
  { label: "Damage (sword)", notation: "1d8" },
  { label: "Fireball damage", notation: "8d6" },
  { label: "Stats (4d6 drop lowest)", notation: "4d6" },
  { label: "Percentile", notation: "1d100" },
];

const CANONICAL = `https://usonlinetools.com${getCanonicalToolPath("dice-roller")}`;

function DiceRollerCalculator() {
  const [configs, setConfigs] = useState<DiceConfig[]>([{ type: 20, count: 1, modifier: 0 }]);
  const [results, setResults] = useState<RollResult[]>([]);
  const [history, setHistory] = useState<Array<{ rolls: RollResult[]; grand: number; timestamp: string }>>([]);
  const [isRolling, setIsRolling] = useState(false);
  const [isNew, setIsNew] = useState(false);

  const updateConfig = (idx: number, field: keyof DiceConfig, val: number | DiceType) => {
    setConfigs((c) => c.map((x, i) => (i === idx ? { ...x, [field]: val } : x)));
  };

  const addDice = () => setConfigs((c) => [...c, { type: 6, count: 1, modifier: 0 }]);
  const removeDice = (idx: number) => setConfigs((c) => c.filter((_, i) => i !== idx));

  const roll = useCallback(() => {
    if (isRolling) return;
    setIsRolling(true);
    setTimeout(() => {
      const newResults = configs.map(rollDice);
      const grand = newResults.reduce((s, r) => s + r.total, 0);
      setResults(newResults);
      setIsNew(true);
      const now = new Date();
      setHistory((h) =>
        [
          {
            rolls: newResults,
            grand,
            timestamp: `${now.getHours()}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`,
          },
          ...h,
        ].slice(0, 10),
      );
      setIsRolling(false);
      setTimeout(() => setIsNew(false), 500);
    }, 350);
  }, [configs, isRolling]);

  const grandTotal = results.reduce((s, r) => s + r.total, 0);

  const applyPreset = (notation: string) => {
    const match = notation.match(/^(\d+)d(\d+)$/i);
    if (!match) return;
    setConfigs([{ type: parseInt(match[2], 10) as DiceType, count: parseInt(match[1], 10), modifier: 0 }]);
    setResults([]);
  };

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">D&amp;D presets</p>
        <div className="flex flex-wrap gap-2">
          {DND_PRESETS.map((p) => (
            <button
              key={p.notation}
              type="button"
              onClick={() => applyPreset(p.notation)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold border-2 border-border text-muted-foreground hover:border-blue-500/50 hover:text-foreground transition-all"
            >
              {p.label} <span className="font-mono opacity-60">({p.notation})</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Dice configuration</p>
          <button
            type="button"
            onClick={addDice}
            className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Add dice
          </button>
        </div>
        {configs.map((c, idx) => (
          <div key={idx} className="flex items-center gap-3 flex-wrap p-3 rounded-xl bg-muted/40 border border-border">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => updateConfig(idx, "count", Math.max(1, c.count - 1))}
                className="w-7 h-7 rounded-lg border-2 border-border flex items-center justify-center hover:border-blue-500/50 transition-colors"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-8 text-center font-bold text-foreground">{c.count}</span>
              <button
                type="button"
                onClick={() => updateConfig(idx, "count", Math.min(20, c.count + 1))}
                className="w-7 h-7 rounded-lg border-2 border-border flex items-center justify-center hover:border-blue-500/50 transition-colors"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>

            <span className="font-bold text-muted-foreground text-sm">×</span>

            <div className="flex gap-1 flex-wrap">
              {DICE_TYPES.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => updateConfig(idx, "type", d)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-black border-2 transition-all ${
                    c.type === d ? "bg-blue-600 text-white border-blue-600" : "border-border text-muted-foreground hover:border-blue-500/40"
                  }`}
                >
                  d{d}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 ml-auto">
              <span className="text-xs font-bold text-muted-foreground">+mod</span>
              <input
                type="number"
                value={c.modifier}
                min={-99}
                max={99}
                className="tool-calc-input w-16 text-center text-sm"
                onChange={(e) => updateConfig(idx, "modifier", parseInt(e.target.value, 10) || 0)}
              />
            </div>

            {configs.length > 1 && (
              <button
                type="button"
                onClick={() => removeDice(idx)}
                className="text-muted-foreground hover:text-red-500 transition-colors ml-1"
                aria-label="Remove dice group"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={roll}
        disabled={isRolling}
        className="w-full py-4 bg-blue-600 text-white font-black rounded-xl text-lg hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
      >
        <Dices className={`w-5 h-5 ${isRolling ? "animate-spin" : ""}`} />
        {isRolling ? "Rolling…" : "Roll!"}
      </button>

      {results.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {results.map((r, i) => (
            <div key={i} className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                {r.count}d{r.type}
                {r.modifier !== 0 ? (r.modifier > 0 ? `+${r.modifier}` : r.modifier) : ""}
              </p>
              <div className="flex flex-wrap gap-2 items-center">
                {r.rolls.map((v, j) => (
                  <DieFace key={j} type={r.type} value={v} isNew={isNew} />
                ))}
                {r.modifier !== 0 && (
                  <div className="px-3 py-2 rounded-xl border-2 border-dashed border-border text-center">
                    <p className="text-sm font-black text-muted-foreground">
                      {r.modifier > 0 ? "+" : ""}
                      {r.modifier}
                    </p>
                    <p className="text-[10px] text-muted-foreground">mod</p>
                  </div>
                )}
                <div className="px-4 py-2 rounded-xl bg-blue-500/10 border-2 border-blue-500/30 text-center ml-1">
                  <p className="text-xl font-black text-blue-600 dark:text-blue-400">{r.total}</p>
                  <p className="text-[10px] text-muted-foreground">total</p>
                </div>
              </div>
            </div>
          ))}
          {results.length > 1 && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-blue-500/5 border border-blue-500/20">
              <span className="text-sm font-bold text-muted-foreground">Grand total:</span>
              <span className="text-2xl font-black text-blue-600 dark:text-blue-400">{grandTotal}</span>
            </div>
          )}
        </motion.div>
      )}

      {history.length > 1 && (
        <div className="border-t border-border pt-4">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Roll history</p>
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {history.slice(1).map((h, i) => (
              <div key={i} className="flex items-center gap-3 py-1 px-2 rounded-lg hover:bg-muted/50">
                <span className="text-xs text-muted-foreground font-mono">{h.timestamp}</span>
                <span className="text-xs text-muted-foreground flex-1">{h.rolls.map((r) => `${r.count}d${r.type}`).join(" + ")}</span>
                <span className="text-sm font-black text-foreground">{h.grand}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const DICE_FAQS = [
  {
    q: "What dice types does this roller support?",
    a: "The dice roller supports all standard tabletop RPG dice: d4, d6, d8, d10, d12, d20, and d100 (percentile). These cover virtually every dice roll in Dungeons & Dragons 5e, Pathfinder, Call of Cthulhu, and most other tabletop RPG systems.",
  },
  {
    q: "What does 'advantage' and 'disadvantage' mean in D&D?",
    a: "In D&D 5e, rolling with advantage means rolling two d20s and taking the higher result; disadvantage means taking the lower. To simulate this, set the count to 2 and the type to d20 — note which roll is higher/lower. Alternatively, roll twice and compare.",
  },
  {
    q: "Is the dice roller truly random?",
    a: "Each die roll uses JavaScript's Math.random() to generate a pseudo-random number, which produces statistically fair results equivalent to physical dice. Every result between 1 and the die's maximum is equally likely on each roll.",
  },
  {
    q: "Can I use this for Yahtzee, Monopoly, or other board games?",
    a: "Absolutely. Set the count to 5 and type to d6 for a full Yahtzee roll. Use 2d6 for Monopoly, Catan, or Risk. d6 is the most common board game die, and the multi-dice configuration handles any combination needed.",
  },
];

export default function DiceRoller() {
  return (
    <UtilityToolPageShell
      title="Dice Roller"
      seoTitle="Dice Roller Online – d4, d6, d8, d10, d12, d20, d100"
      seoDescription="Free online dice roller. Roll d4–d100, add modifiers, combine multiple dice groups, and browse roll history. Built for D&D, RPGs, and board games."
      canonical={CANONICAL}
      categoryName="Productivity & Text"
      categoryHref="/category/productivity"
      heroDescription="Roll d4, d6, d8, d10, d12, d20, and d100 dice online. Add modifiers, stack multiple dice groups, and use D&D presets. History stays in your browser only."
      heroIcon={<Dices className="w-3.5 h-3.5" />}
      calculatorLabel="RPG & board game dice"
      calculatorDescription="Configure dice, tap Roll, and read per-group totals plus a grand total when you use multiple groups."
      calculator={<DiceRollerCalculator />}
      howSteps={[
        {
          title: "Choose a preset or configure your dice",
          description:
            "Use a D&D preset for common rolls or set count (1–20), die type (d4–d100), and optional modifier (+5 weapon bonus, etc.).",
        },
        {
          title: "Add multiple dice groups",
          description:
            "Add another group for complex rolls — for example 1d8 + 1d6 + a flat modifier. The page shows each group’s total and a grand total.",
        },
        {
          title: "Roll and read results",
          description:
            "Press Roll to animate and display each die, modifiers, and totals. Recent rolls appear in history with a timestamp.",
        },
      ]}
      interpretationCards={[
        {
          title: "Read NdX notation",
          description: "“3d6” means three six-sided dice rolled and summed. Modifiers add (or subtract) after all dice in that group are totaled.",
        },
        {
          title: "Multiple groups sum independently first",
          description: "Each row is one pool. The grand total adds every pool’s result — useful for damage that mixes dice types.",
          className: "bg-cyan-500/5 border-cyan-500/20",
        },
        {
          title: "History is session-only",
          description: "Roll history lives in memory in this tab. It is not uploaded or stored on a server.",
          className: "bg-violet-500/5 border-violet-500/20",
        },
      ]}
      examples={[
        { scenario: "D&D attack", input: "1d20 + mod +5", output: "Single d20 plus bonus on the mod line" },
        { scenario: "Fireball damage", input: "8d6", output: "Eight d6 values summed" },
        { scenario: "Yahtzee", input: "5d6", output: "Five six-sided dice at once" },
      ]}
      whyChoosePoints={[
        "Standard RPG dice (d4–d100) with quick D&D presets for attacks, damage, and percentile checks.",
        "Modifiers and multiple dice groups match how tabletop players actually roll — no manual math required.",
        "Runs entirely in the browser: fast on phones at the game table, with no account or install.",
      ]}
      faqs={DICE_FAQS}
      relatedTools={[
        { title: "Coin Flip", slug: "coin-flip", icon: <Circle className="w-4 h-4" />, color: 45, benefit: "Heads or tails instantly" },
        {
          title: "Random Number Generator",
          slug: "random-number-generator",
          icon: <TrendingUp className="w-4 h-4" />,
          color: 217,
          benefit: "Any min/max range",
        },
        {
          title: "Random Picker",
          slug: "random-picker-tool",
          icon: <BarChart3 className="w-4 h-4" />,
          color: 152,
          benefit: "Pick from a custom list",
        },
      ]}
      ctaTitle="More productivity tools"
      ctaDescription="Coin flips, random pickers, text utilities, and more."
      ctaHref="/category/productivity"
    />
  );
}
