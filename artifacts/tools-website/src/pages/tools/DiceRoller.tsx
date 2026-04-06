import { useState, useCallback } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, Dices, Zap, Shield, Smartphone,
  Lock, BadgeCheck, Copy, Check, RotateCcw, Plus, Minus,
  TrendingUp, Circle, BarChart3,
} from "lucide-react";

// ── Dice Logic ──
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
  const rolls = Array.from({ length: config.count }, () =>
    Math.floor(Math.random() * config.type) + 1
  );
  const total = rolls.reduce((a, b) => a + b, 0) + config.modifier;
  return { rolls, modifier: config.modifier, total, type: config.type, count: config.count };
}

// ── Dice Face SVG ──
function DieFace({ type, value, isNew }: { type: DiceType; value: number; isNew: boolean }) {
  const color = {
    4: "hsl(25,80%,55%)", 6: "hsl(217,70%,55%)", 8: "hsl(152,70%,45%)",
    10: "hsl(340,70%,55%)", 12: "hsl(265,70%,55%)", 20: "hsl(45,80%,50%)", 100: "hsl(0,70%,55%)",
  }[type];

  return (
    <motion.div
      key={isNew ? Math.random() : undefined}
      initial={isNew ? { scale: 0.5, rotate: -30, opacity: 0 } : false}
      animate={{ scale: 1, rotate: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="w-14 h-14 rounded-2xl flex flex-col items-center justify-center flex-shrink-0 border-2"
      style={{ background: `${color}15`, borderColor: `${color}40`, color }}>
      <p className="text-lg font-black leading-none">{value}</p>
      <p className="text-[10px] font-bold opacity-60">d{type}</p>
    </motion.div>
  );
}

// ── FAQ Item ──
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-rose-500/40 transition-colors">
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-rose-500">
          <ChevronDown className="w-5 h-5" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div key="a" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} className="overflow-hidden">
            <p className="px-5 pb-5 text-muted-foreground leading-relaxed border-t border-border pt-4">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const RELATED_TOOLS = [
  { title: "Coin Flip", slug: "coin-flip", icon: <Circle className="w-5 h-5" />, color: 45, benefit: "Heads or tails in one click" },
  { title: "Random Number Generator", slug: "random-number-generator", icon: <TrendingUp className="w-5 h-5" />, color: 217, benefit: "Random number in any range" },
  { title: "Random Picker", slug: "random-picker-tool", icon: <BarChart3 className="w-5 h-5" />, color: 152, benefit: "Pick a random item from a list" },
];

const DND_PRESETS = [
  { label: "Attack Roll", notation: "1d20" },
  { label: "Damage (dagger)", notation: "1d4" },
  { label: "Damage (sword)", notation: "1d8" },
  { label: "Fireball damage", notation: "8d6" },
  { label: "Stats (4d6 drop lowest)", notation: "4d6" },
  { label: "Percentile", notation: "1d100" },
];

export default function DiceRoller() {
  const [configs, setConfigs] = useState<DiceConfig[]>([
    { type: 20, count: 1, modifier: 0 },
  ]);
  const [results, setResults] = useState<RollResult[]>([]);
  const [history, setHistory] = useState<Array<{ rolls: RollResult[]; grand: number; timestamp: string }>>([]);
  const [isRolling, setIsRolling] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [copied, setCopied] = useState(false);

  const updateConfig = (idx: number, field: keyof DiceConfig, val: number | DiceType) => {
    setConfigs(c => c.map((x, i) => i === idx ? { ...x, [field]: val } : x));
  };

  const addDice = () => setConfigs(c => [...c, { type: 6, count: 1, modifier: 0 }]);
  const removeDice = (idx: number) => setConfigs(c => c.filter((_, i) => i !== idx));

  const roll = useCallback(() => {
    if (isRolling) return;
    setIsRolling(true);
    setTimeout(() => {
      const newResults = configs.map(rollDice);
      const grand = newResults.reduce((s, r) => s + r.total, 0);
      setResults(newResults);
      setIsNew(true);
      const now = new Date();
      setHistory(h => [{
        rolls: newResults,
        grand,
        timestamp: `${now.getHours()}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`,
      }, ...h].slice(0, 10));
      setIsRolling(false);
      setTimeout(() => setIsNew(false), 500);
    }, 350);
  }, [configs, isRolling]);

  const grandTotal = results.reduce((s, r) => s + r.total, 0);

  const applyPreset = (notation: string) => {
    const match = notation.match(/^(\d+)d(\d+)$/i);
    if (!match) return;
    setConfigs([{ type: parseInt(match[2]) as DiceType, count: parseInt(match[1]), modifier: 0 }]);
    setResults([]);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layout>
      <SEO
        title="Dice Roller – Roll Any Dice Online (d4, d6, d8, d10, d12, d20, d100)"
        description="Free online dice roller. Roll d4, d6, d8, d10, d12, d20, and d100 dice. Add modifiers, roll multiple dice at once, and view roll history. Perfect for D&D, RPGs, and board games."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        {/* ── BREADCRUMB ── */}
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-rose-500" strokeWidth={3} />
          <Link href="/category/productivity" className="text-muted-foreground hover:text-foreground transition-colors">Productivity &amp; Text</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-rose-500" strokeWidth={3} />
          <span className="text-foreground">Dice Roller</span>
        </nav>

        {/* ── HERO ── */}
        <section className="rounded-2xl overflow-hidden border border-rose-500/15 bg-gradient-to-br from-rose-500/5 via-card to-pink-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Dices className="w-3.5 h-3.5" /> Productivity &amp; Text
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">
            Dice Roller
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Roll d4, d6, d8, d10, d12, d20, and d100 dice online. Add modifiers, roll multiple dice, and view roll history. Built for D&amp;D, RPGs, board games, and more.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            {[
              { icon: <BadgeCheck className="w-3.5 h-3.5" />, label: "100% Free", color: "emerald" },
              { icon: <Zap className="w-3.5 h-3.5" />, label: "True Random", color: "rose" },
              { icon: <Lock className="w-3.5 h-3.5" />, label: "No Signup", color: "slate" },
              { icon: <Shield className="w-3.5 h-3.5" />, label: "Privacy First", color: "violet" },
              { icon: <Smartphone className="w-3.5 h-3.5" />, label: "Mobile Ready", color: "cyan" },
            ].map(b => (
              <span key={b.label} className={`inline-flex items-center gap-1.5 bg-${b.color}-500/10 text-${b.color}-600 dark:text-${b.color}-400 font-bold text-xs px-3 py-1.5 rounded-full border border-${b.color}-500/20`}>
                {b.icon} {b.label}
              </span>
            ))}
          </div>
          <p className="text-xs text-muted-foreground/60 font-medium">
            Category: Productivity &amp; Text &nbsp;·&nbsp; All standard RPG dice types + d100 &nbsp;·&nbsp; Last updated: March 2026
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* ── MAIN COLUMN ── */}
          <div className="lg:col-span-3 space-y-10">

            {/* ── TOOL WIDGET ── */}
            <section>
              <div className="rounded-2xl overflow-hidden border border-rose-500/20 shadow-lg shadow-rose-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-rose-500 to-pink-400" />
                <div className="bg-card p-6 md:p-8 space-y-5">
                  {/* D&D Presets */}
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">D&amp;D Presets</p>
                    <div className="flex flex-wrap gap-2">
                      {DND_PRESETS.map(p => (
                        <button key={p.notation} onClick={() => applyPreset(p.notation)}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold border-2 border-border text-muted-foreground hover:border-rose-500/50 hover:text-foreground transition-all">
                          {p.label} <span className="font-mono opacity-60">({p.notation})</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Dice configs */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Dice Configuration</p>
                      <button onClick={addDice}
                        className="flex items-center gap-1 text-xs font-bold text-rose-500 hover:text-rose-600 transition-colors">
                        <Plus className="w-3.5 h-3.5" /> Add Dice
                      </button>
                    </div>
                    {configs.map((c, idx) => (
                      <div key={idx} className="flex items-center gap-3 flex-wrap p-3 rounded-xl bg-muted/40 border border-border">
                        {/* Count */}
                        <div className="flex items-center gap-1">
                          <button onClick={() => updateConfig(idx, "count", Math.max(1, c.count - 1))}
                            className="w-7 h-7 rounded-lg border-2 border-border flex items-center justify-center hover:border-rose-500/50 transition-colors">
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center font-bold text-foreground">{c.count}</span>
                          <button onClick={() => updateConfig(idx, "count", Math.min(20, c.count + 1))}
                            className="w-7 h-7 rounded-lg border-2 border-border flex items-center justify-center hover:border-rose-500/50 transition-colors">
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="font-bold text-muted-foreground text-sm">×</span>

                        {/* Dice type */}
                        <div className="flex gap-1 flex-wrap">
                          {DICE_TYPES.map(d => (
                            <button key={d} onClick={() => updateConfig(idx, "type", d)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-black border-2 transition-all ${c.type === d ? "bg-rose-500 text-white border-rose-500" : "border-border text-muted-foreground hover:border-rose-500/40"}`}>
                              d{d}
                            </button>
                          ))}
                        </div>

                        {/* Modifier */}
                        <div className="flex items-center gap-1 ml-auto">
                          <span className="text-xs font-bold text-muted-foreground">+mod</span>
                          <input type="number" value={c.modifier} min="-99" max="99"
                            className="tool-calc-input w-16 text-center text-sm"
                            onChange={e => updateConfig(idx, "modifier", parseInt(e.target.value) || 0)} />
                        </div>

                        {configs.length > 1 && (
                          <button onClick={() => removeDice(idx)} className="text-muted-foreground hover:text-red-500 transition-colors ml-1">
                            <RotateCcw className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Roll button */}
                  <button onClick={roll} disabled={isRolling}
                    className="w-full py-4 bg-rose-500 text-white font-black rounded-xl text-lg hover:bg-rose-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                    <Dices className={`w-5 h-5 ${isRolling ? "animate-spin" : ""}`} />
                    {isRolling ? "Rolling…" : "Roll!"}
                  </button>

                  {/* Results */}
                  {results.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                      {results.map((r, i) => (
                        <div key={i} className="space-y-2">
                          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                            {r.count}d{r.type}{r.modifier !== 0 ? (r.modifier > 0 ? `+${r.modifier}` : r.modifier) : ""}
                          </p>
                          <div className="flex flex-wrap gap-2 items-center">
                            {r.rolls.map((v, j) => (
                              <DieFace key={j} type={r.type} value={v} isNew={isNew} />
                            ))}
                            {r.modifier !== 0 && (
                              <div className="px-3 py-2 rounded-xl border-2 border-dashed border-border text-center">
                                <p className="text-sm font-black text-muted-foreground">{r.modifier > 0 ? "+" : ""}{r.modifier}</p>
                                <p className="text-[10px] text-muted-foreground">mod</p>
                              </div>
                            )}
                            <div className="px-4 py-2 rounded-xl bg-rose-500/10 border-2 border-rose-500/30 text-center ml-1">
                              <p className="text-xl font-black text-rose-600 dark:text-rose-400">{r.total}</p>
                              <p className="text-[10px] text-muted-foreground">total</p>
                            </div>
                          </div>
                        </div>
                      ))}
                      {results.length > 1 && (
                        <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/5 border border-rose-500/20">
                          <span className="text-sm font-bold text-muted-foreground">Grand Total:</span>
                          <span className="text-2xl font-black text-rose-600 dark:text-rose-400">{grandTotal}</span>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* History */}
                  {history.length > 1 && (
                    <div className="border-t border-border pt-4">
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Roll History</p>
                      <div className="space-y-1 max-h-40 overflow-y-auto">
                        {history.slice(1).map((h, i) => (
                          <div key={i} className="flex items-center gap-3 py-1 px-2 rounded-lg hover:bg-muted/50">
                            <span className="text-xs text-muted-foreground font-mono">{h.timestamp}</span>
                            <span className="text-xs text-muted-foreground flex-1">{h.rolls.map(r => `${r.count}d${r.type}`).join(" + ")}</span>
                            <span className="text-sm font-black text-foreground">{h.grand}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* ── HOW TO USE ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Use the Dice Roller</h2>
              <ol className="space-y-5">
                {[
                  { title: "Choose a preset or configure your dice", body: "Click a D&D preset for common rolls (1d20 attack, 8d6 fireball, etc.) or configure manually. Set the number of dice (1–20), the dice type (d4 through d100), and an optional modifier (+5 for a +5 weapon, for example)." },
                  { title: "Add multiple dice groups", body: "Click '+ Add Dice' to add a second dice group for complex rolls. For example, you might roll 1d8 (longsword damage) + 1d6 (sneak attack) + 3 (strength modifier) all at once. The grand total is shown when multiple groups are active." },
                  { title: "Roll and read the results", body: "Click 'Roll!' to generate results. Each die shows its individual value. The total per dice group and the combined grand total are displayed. Roll history shows your last 10 rolls with timestamps." },
                ].map((s, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">{i + 1}</div>
                    <div>
                      <p className="font-bold text-foreground mb-1">{s.title}</p>
                      <p className="text-muted-foreground text-sm leading-relaxed">{s.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            {/* ── FAQ ── */}
            <section className="space-y-3">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Frequently Asked Questions</h2>
              {[
                { q: "What dice types does this roller support?", a: "The dice roller supports all standard tabletop RPG dice: d4, d6, d8, d10, d12, d20, and d100 (percentile). These cover virtually every dice roll in Dungeons & Dragons 5e, Pathfinder, Call of Cthulhu, and most other tabletop RPG systems." },
                { q: "What does 'advantage' and 'disadvantage' mean in D&D?", a: "In D&D 5e, rolling with advantage means rolling two d20s and taking the higher result; disadvantage means taking the lower. To simulate this, set the count to 2 and the type to d20 — note which roll is higher/lower. Alternatively, roll twice using the 'Roll Again' approach and compare." },
                { q: "Is the dice roller truly random?", a: "Yes. Each die roll uses JavaScript's Math.random() to generate a pseudo-random number, which produces statistically fair results equivalent to physical dice. Every result between 1 and the die's maximum is equally likely on each roll." },
                { q: "Can I use this for Yahtzee, Monopoly, or other board games?", a: "Absolutely. Set the count to 5 and type to d6 for a full Yahtzee roll. Use 2d6 for Monopoly, Catan, or Risk. d6 is the most common board game die, and the multi-dice configuration handles any combination needed." },
              ].map((item, i) => (
                <FaqItem key={i} q={item.q} a={item.a} />
              ))}
            </section>
          </div>

          {/* ── SIDEBAR ── */}
          <div className="space-y-6">
            <div className="sticky top-28 space-y-6">
              <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Features</p>
                {[
                  { icon: <Zap className="w-4 h-4 text-rose-500" />, text: "d4 through d100, all RPG types" },
                  { icon: <Shield className="w-4 h-4 text-rose-500" />, text: "No data saved — session only" },
                  { icon: <BadgeCheck className="w-4 h-4 text-rose-500" />, text: "Modifiers, multi-dice, history" },
                  { icon: <Smartphone className="w-4 h-4 text-rose-500" />, text: "Works on phone, tablet, desktop" },
                ].map((t, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="flex-shrink-0 mt-0.5">{t.icon}</div>
                    <p className="text-sm text-muted-foreground">{t.text}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-5">
                <p className="text-sm font-bold text-foreground mb-3">Share this tool</p>
                <button onClick={copyLink}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-500 text-white font-bold text-sm hover:bg-rose-600 transition-colors">
                  {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Link</>}
                </button>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Related Tools</p>
                <div className="space-y-2">
                  {RELATED_TOOLS.map((t, i) => (
                    <Link key={i} href={`/tools/${t.slug}`}
                      className="group flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-all border border-transparent hover:border-border">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: `hsl(${t.color},80%,50%,0.1)`, color: `hsl(${t.color},70%,45%)` }}>
                        {t.icon}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-foreground leading-tight truncate">{t.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{t.benefit}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
