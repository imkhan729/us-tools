import { useState, useCallback } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { getCanonicalToolPath } from "@/data/tools";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, Dices, Copy, Check, RefreshCw, Hash,
  ArrowRight, Zap, Smartphone, Shield, BadgeCheck, Lock,
  Calculator, Shuffle, Star, Lightbulb
} from "lucide-react";

// ── FAQ Item Component ──
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-purple-500/40 transition-colors">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left"
      >
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-purple-500">
          <ChevronDown className="w-5 h-5" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 text-muted-foreground leading-relaxed border-t border-border pt-4">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Related Tools ──
const RELATED_TOOLS = [
  { title: "Password Generator", slug: "password-generator", icon: <Shield className="w-4 h-4" />, color: 217, benefit: "Generate strong secure passwords" },
  { title: "Dice Roller", slug: "dnd-dice-roller", icon: <Dices className="w-4 h-4" />, color: 275, benefit: "Roll D4, D6, D8, D20 and more" },
  { title: "UUID Generator", slug: "uuid-generator", icon: <Hash className="w-4 h-4" />, color: 152, benefit: "Generate unique IDs instantly" },
  { title: "Coin Flip", slug: "coin-flip", icon: <Shuffle className="w-4 h-4" />, color: 45, benefit: "Flip a fair virtual coin" },
  { title: "Lottery Number Picker", slug: "lottery-number-picker", icon: <Dices className="w-4 h-4" />, color: 340, benefit: "Pick random lottery numbers" },
  { title: "Team Randomizer", slug: "team-randomizer", icon: <Calculator className="w-4 h-4" />, color: 25, benefit: "Split groups into random teams" },
];

// ── Main Component ──
export default function RandomNumberGenerator() {
  const [min, setMin] = useState("1");
  const [max, setMax] = useState("100");
  const [count, setCount] = useState("1");
  const [unique, setUnique] = useState(false);
  const [results, setResults] = useState<number[]>([]);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const generate = useCallback(() => {
    setError("");
    const minVal = parseInt(min, 10);
    const maxVal = parseInt(max, 10);
    const countVal = parseInt(count, 10);

    if (isNaN(minVal) || isNaN(maxVal) || isNaN(countVal)) {
      setError("Please enter valid integers for all fields.");
      return;
    }
    if (minVal >= maxVal) {
      setError("Minimum must be less than maximum.");
      return;
    }
    if (countVal < 1 || countVal > 1000) {
      setError("Count must be between 1 and 1,000.");
      return;
    }
    const range = maxVal - minVal + 1;
    if (unique && countVal > range) {
      setError(`Cannot generate ${countVal} unique numbers in a range of ${range} (${minVal} to ${maxVal}).`);
      return;
    }

    if (unique) {
      // Fisher-Yates shuffle on the full range, then slice
      const pool: number[] = [];
      for (let i = minVal; i <= maxVal; i++) pool.push(i);
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }
      setResults(pool.slice(0, countVal));
    } else {
      const nums: number[] = [];
      for (let i = 0; i < countVal; i++) {
        nums.push(Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal);
      }
      setResults(nums);
    }
  }, [min, max, count, unique]);

  const copyAll = useCallback(() => {
    navigator.clipboard.writeText(results.join(", "));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [results]);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  return (
    <Layout>
      <SEO
        title="Random Number Generator – Generate 1 to 1,000 Random Numbers Free | US Online Tools"
        description="Free random number generator. Generate one or multiple random numbers in any range. Enable unique mode for no duplicates. Perfect for raffles, games, sampling, and decisions."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        {/* ── BREADCRUMB ── */}
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-purple-500" strokeWidth={3} />
          <Link href="/category/math" className="text-muted-foreground hover:text-foreground transition-colors">Numbers &amp; Randomness</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-purple-500" strokeWidth={3} />
          <span className="text-foreground">Random Number Generator</span>
        </nav>

        {/* ── HERO SECTION (Full Width) ── */}
        <section className="rounded-2xl overflow-hidden border border-purple-500/15 bg-gradient-to-br from-purple-500/5 via-card to-violet-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          {/* Category pill */}
          <div className="inline-flex items-center gap-1.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Dices className="w-3.5 h-3.5" />
            Numbers &amp; Randomness
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">
            Random Number Generator
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Generate one or thousands of random numbers within any range instantly. Set min and max values, choose how many numbers, and enable unique mode to eliminate duplicates — all in one click.
          </p>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20">
              <BadgeCheck className="w-3.5 h-3.5" /> 100% Free
            </span>
            <span className="inline-flex items-center gap-1.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold text-xs px-3 py-1.5 rounded-full border border-purple-500/20">
              <Zap className="w-3.5 h-3.5" /> Up to 1,000 Numbers
            </span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20">
              <Lock className="w-3.5 h-3.5" /> No Signup
            </span>
            <span className="inline-flex items-center gap-1.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-xs px-3 py-1.5 rounded-full border border-violet-500/20">
              <Shuffle className="w-3.5 h-3.5" /> Unique Mode
            </span>
            <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs px-3 py-1.5 rounded-full border border-cyan-500/20">
              <Smartphone className="w-3.5 h-3.5" /> Mobile Ready
            </span>
          </div>

          {/* Meta */}
          <p className="text-xs text-muted-foreground/60 font-medium">
            Category: Numbers &amp; Randomness &nbsp;·&nbsp; Last updated: March 2026
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* ── LEFT COLUMN (Main Content) ── */}
          <div className="lg:col-span-3 space-y-10">

            {/* ── TOOL WIDGET ── */}
            <section className="space-y-5">
              <div className="rounded-2xl overflow-hidden border border-purple-500/20 shadow-lg shadow-purple-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-purple-500 to-violet-400" />
                <div className="bg-card p-6 md:p-8 space-y-6">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-violet-400 flex items-center justify-center flex-shrink-0">
                      <Dices className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Random Number Generator</p>
                      <p className="text-sm text-muted-foreground">Set your range, choose a count, and click Generate.</p>
                    </div>
                  </div>

                  {/* Min / Max inputs */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Minimum</label>
                      <input
                        type="number"
                        value={min}
                        onChange={e => setMin(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-foreground font-bold text-lg focus:outline-none focus:border-purple-500 transition-colors"
                        placeholder="1"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Maximum</label>
                      <input
                        type="number"
                        value={max}
                        onChange={e => setMax(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-foreground font-bold text-lg focus:outline-none focus:border-purple-500 transition-colors"
                        placeholder="100"
                      />
                    </div>
                  </div>

                  {/* Count input */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">How many numbers? (1–1,000)</label>
                    <input
                      type="number"
                      value={count}
                      onChange={e => setCount(e.target.value)}
                      min={1}
                      max={1000}
                      className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-foreground font-bold text-lg focus:outline-none focus:border-purple-500 transition-colors"
                      placeholder="1"
                    />
                  </div>

                  {/* Unique toggle */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setUnique(u => !u)}
                      className={`relative w-11 h-6 rounded-full transition-colors focus:outline-none flex-shrink-0 ${unique ? "bg-purple-500" : "bg-border"}`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${unique ? "translate-x-5" : "translate-x-0"}`}
                      />
                    </button>
                    <span className="text-sm font-semibold text-foreground">No duplicates (unique mode)</span>
                  </div>

                  {/* Generate button */}
                  <button
                    onClick={generate}
                    className="w-full py-4 bg-gradient-to-r from-purple-500 to-violet-500 text-white font-black uppercase tracking-wider rounded-xl hover:-translate-y-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 text-lg"
                  >
                    <RefreshCw className="w-5 h-5" />
                    Generate
                  </button>

                  {/* Error */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 text-red-600 dark:text-red-400 text-sm font-medium"
                      >
                        {error}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Results */}
                  <AnimatePresence>
                    {results.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 12 }}
                        className="mt-2"
                      >
                        {results.length === 1 ? (
                          // Single result — large display
                          <div className="flex flex-col items-center justify-center py-8 rounded-2xl bg-purple-500/5 border border-purple-500/20">
                            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Your random number</p>
                            <p className="text-7xl font-black text-purple-600 dark:text-purple-400 tabular-nums">{results[0]}</p>
                          </div>
                        ) : (
                          // Multiple results — tag cloud
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{results.length} numbers generated</p>
                              <button
                                onClick={copyAll}
                                className="flex items-center gap-1.5 text-xs font-bold text-purple-500 hover:text-purple-600 transition-colors"
                              >
                                {copied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy All</>}
                              </button>
                            </div>
                            <div className="flex flex-wrap gap-2 p-4 rounded-2xl bg-purple-500/5 border border-purple-500/20 max-h-64 overflow-y-auto">
                              {results.map((n, i) => (
                                <motion.span
                                  key={i}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: Math.min(i * 0.015, 0.5) }}
                                  className="inline-flex items-center px-3 py-1.5 bg-purple-500/10 text-purple-700 dark:text-purple-300 rounded-lg text-sm font-bold border border-purple-500/20"
                                >
                                  {n}
                                </motion.span>
                              ))}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </section>

            {/* ── HOW TO USE ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Use the Random Number Generator</h2>

              <p className="text-muted-foreground leading-relaxed mb-6">
                This generator gives you full control over your random output — from a single dice roll to a batch of 1,000 numbers for statistical sampling. Here's exactly how each setting works and when to use it.
              </p>

              <ol className="space-y-5 mb-8">
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Set minimum and maximum values</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Enter any two integers as your range boundaries. Both positive and negative numbers are supported — for example, you can set min to −50 and max to 50 to include negative results. The minimum must be strictly less than the maximum. There is no restriction on how large or small the values can be, so ranges like 1 to 1,000,000 work perfectly.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Choose how many numbers (1 to 1,000)</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      The count field controls how many random numbers are produced in a single click. Generate 1 for a single result (displayed large in the center), or up to 1,000 for batch outputs displayed as a scrollable chip grid. Generating a large batch is useful for sampling exercises, test data, or lottery-style draws.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Toggle "No duplicates" for unique results</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      When unique mode is enabled, every number in the output appears exactly once — like drawing numbered balls from a bag without replacing them. The generator will alert you if you request more unique numbers than exist in your range. This mode uses the Fisher-Yates shuffle algorithm for statistically uniform distribution.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">4</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Click Generate — copy results to clipboard</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Hit the Generate button to instantly produce your results. For a single number it displays large and centered. For multiple numbers, use the "Copy All" button to copy the full comma-separated list to your clipboard — ready to paste into a spreadsheet, message, or document. You can generate as many times as you like without any limits.
                    </p>
                  </div>
                </li>
              </ol>

              {/* How Randomness Works box */}
              <div className="p-5 rounded-xl bg-muted/60 border border-border">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">How Randomness Works</p>
                <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                  <p>
                    <strong className="text-foreground">Pseudorandom Number Generation (PRNG):</strong> This tool uses JavaScript's built-in <code className="px-1.5 py-0.5 bg-background rounded text-xs font-mono">Math.random()</code> function, which generates pseudorandom numbers — sequences that appear random but are produced by a deterministic algorithm seeded by system entropy. This is suitable for games, simulations, sampling, and everyday decisions, but is not cryptographically secure.
                  </p>
                  <p>
                    <strong className="text-foreground">Unique mode — Fisher-Yates shuffle:</strong> When unique mode is on, the generator builds a complete array of every integer in the range and applies the Fisher-Yates (Knuth) shuffle algorithm, swapping elements from the end toward the front using random indices. The first N elements of the shuffled array become your results. This guarantees each number appears at most once with equal probability.
                  </p>
                  <div className="mt-3">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Range formula</p>
                    <code className="block px-3 py-2.5 bg-background rounded-lg text-xs font-mono">
                      floor(Math.random() × (max − min + 1)) + min
                    </code>
                  </div>
                </div>
              </div>
            </section>

            {/* ── RESULT INTERPRETATION ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Result Categories &amp; Use Cases</h2>
              <p className="text-muted-foreground text-sm mb-6">What to do with your results depending on how many you generated:</p>

              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Single number — Decision making, dice rolls, winner selection</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">A single random number is perfect for breaking ties, simulating a dice roll, randomly selecting a winner from a numbered list, or making any binary or multi-option decision. Assign each option a number in your range and let the generator pick. This is the digital equivalent of rolling a fair die or drawing a slip from a hat.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                  <div className="w-3 h-3 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Small batch (2–10) — Lottery picks, team assignments, quiz questions</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">A small set of numbers is ideal for picking lottery combinations, randomly assigning participants to teams, selecting quiz questions from a question bank, or choosing multiple items from a catalog. Enable unique mode here to ensure no number repeats — exactly like a real lottery draw where each ball appears once.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                  <div className="w-3 h-3 rounded-full bg-amber-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Medium batch (11–100) — Sampling, random survey selection</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Medium batches are useful for selecting a random sample from a population list, assigning random test cases in QA testing, or picking a subset of survey respondents from a numbered roster. Use unique mode to ensure each participant is selected only once. Copy the full list with one click and paste it into your spreadsheet.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-purple-500/5 border border-purple-500/20">
                  <div className="w-3 h-3 rounded-full bg-purple-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Large batch (100–1,000) — Statistical sampling, test data generation</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Large batches serve statistical and technical needs: seeding a database with random test IDs, generating random inputs for stress testing software, producing sample data for machine learning pipelines, or running Monte Carlo simulations. The copy-all button exports the entire comma-separated list for immediate use in any tool or language.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* ── QUICK EXAMPLES ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Quick Examples</h2>

              <div className="overflow-x-auto rounded-xl border border-border mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/60">
                      <th className="text-left px-4 py-3 font-bold text-foreground">Min</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Max</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Count</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground hidden sm:table-cell">Unique</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Use Case</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-foreground">1</td>
                      <td className="px-4 py-3 font-mono text-foreground">6</td>
                      <td className="px-4 py-3 font-mono text-foreground">1</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">No</td>
                      <td className="px-4 py-3 text-muted-foreground">Simulating a dice roll</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-foreground">1</td>
                      <td className="px-4 py-3 font-mono text-foreground">52</td>
                      <td className="px-4 py-3 font-mono text-foreground">1</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">No</td>
                      <td className="px-4 py-3 text-muted-foreground">Pick a card from a deck</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-foreground">1</td>
                      <td className="px-4 py-3 font-mono text-foreground">100</td>
                      <td className="px-4 py-3 font-mono text-foreground">10</td>
                      <td className="px-4 py-3 text-purple-600 dark:text-purple-400 font-bold hidden sm:table-cell">Yes</td>
                      <td className="px-4 py-3 text-muted-foreground">Lottery-style draw</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-foreground">−50</td>
                      <td className="px-4 py-3 font-mono text-foreground">50</td>
                      <td className="px-4 py-3 font-mono text-foreground">1</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">No</td>
                      <td className="px-4 py-3 text-muted-foreground">Includes negative numbers</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-foreground">1</td>
                      <td className="px-4 py-3 font-mono text-foreground">1,000,000</td>
                      <td className="px-4 py-3 font-mono text-foreground">1</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">No</td>
                      <td className="px-4 py-3 text-muted-foreground">Large range random pick</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p>
                  <strong className="text-foreground">Example 1 – Dice simulation:</strong> Set min to 1 and max to 6 to replicate a standard six-sided die. Each click produces a number from 1 to 6 with equal probability — 1-in-6 for each face. This is statistically equivalent to a fair physical die. You can extend this to any polyhedral die: D8 (1–8), D10 (0–9), D12 (1–12), or D20 (1–20) — just adjust the max value accordingly.
                </p>
                <p>
                  <strong className="text-foreground">Example 2 – Card draw:</strong> A standard deck has 52 cards numbered 1 through 52. Setting max to 52 and generating 1 gives you a random card position. You can map these to suits and values (1–13 = Spades, 14–26 = Hearts, etc.) for card game simulations. Enable unique mode and set count to 5 to deal a poker hand — each card appears exactly once.
                </p>
                <p>
                  <strong className="text-foreground">Example 3 – Raffle or giveaway:</strong> Assign each participant a sequential number. Set min to 1, max to the total number of participants, and generate 1 (or however many winners you need). Enable unique mode if selecting multiple winners to ensure no one wins twice. This is a fair, auditable method commonly used for online giveaways, classroom prize draws, and charity raffles.
                </p>
                <p>
                  <strong className="text-foreground">Example 4 – Negative number ranges:</strong> Some applications require numbers that span zero — temperature simulations, financial gain/loss modeling, or coordinate systems. Setting min to −50 and max to 50 produces integers from negative through zero to positive, giving you a balanced bipolar range for any scenario that crosses the zero boundary.
                </p>
              </div>

              {/* Testimonial */}
              <div className="mt-6 p-5 rounded-xl bg-purple-500/5 border border-purple-500/15">
                <div className="flex gap-1 mb-2">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-sm text-foreground/80 italic leading-relaxed">"Used this for our office raffle and it was perfect — quick, fair, and everyone trusted the result. Generated 3 unique winners from 200 employees in seconds."</p>
                <p className="text-xs text-muted-foreground mt-2">— User feedback, 2025</p>
              </div>
            </section>

            {/* ── WHY CHOOSE THIS ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Why Choose This Random Number Generator?</h2>

              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p>
                  <strong className="text-foreground">Completely free with no hidden limits.</strong> Unlike tools that cap free users at a certain number of results or require account creation to unlock batch mode, this generator is fully unrestricted from the start. Generate 1 number or 1,000 numbers per click — as many times as you want — with no paywalls, no advertisements interrupting the experience, and no registration forms blocking access.
                </p>
                <p>
                  <strong className="text-foreground">Your data stays on your device.</strong> Every random number is generated entirely within your browser using client-side JavaScript. No values you enter — your min, max, or count — are ever transmitted to a server. No generated results are logged or stored. This means you can use this tool for sensitive applications (assigning participant IDs, selecting audit samples) without any data governance concerns.
                </p>
                <p>
                  <strong className="text-foreground">Unique mode eliminates duplicates with a proven algorithm.</strong> Most basic random number tools simply generate independent values and accept that duplicates will occur. This generator's unique mode uses the Fisher-Yates shuffle — a well-established, mathematically proven algorithm — to guarantee that each number in your range appears at most once. This is critical for fair lottery draws, raffle selections, and sampling without replacement.
                </p>
                <p>
                  <strong className="text-foreground">Generate up to 1,000 numbers in one click.</strong> Whether you need a handful of lottery picks or a full batch of test data IDs, the batch generation feature handles it instantly. The results display in a scrollable chip grid, and the copy-all button exports the entire comma-separated list to your clipboard in one tap — ready for Excel, Google Sheets, or any other tool.
                </p>
                <p>
                  <strong className="text-foreground">Copy-to-clipboard makes results immediately usable.</strong> There's no need to manually transcribe numbers. For a single result, you can read it directly off the screen. For batches, one click copies all results as a comma-separated list. This workflow integrates seamlessly with spreadsheets, databases, messaging apps, and code editors — eliminating the friction that slows down other tools.
                </p>
              </div>

              {/* Note / Limitation */}
              <div className="mt-6 p-4 rounded-xl border border-border bg-muted/30">
                <div className="flex gap-2 items-start">
                  <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">Note:</strong> This tool uses JavaScript's <code className="text-xs font-mono">Math.random()</code> — a pseudorandom number generator (PRNG). It is not suitable for cryptographic applications, online gambling, or any security-critical use case where true unpredictability is required. For those use cases, use a hardware random number generator (HRNG) or a cryptographically secure API such as the Web Crypto API (<code className="text-xs font-mono">crypto.getRandomValues()</code>).
                  </p>
                </div>
              </div>
            </section>

            {/* ── FAQ ── */}
            <section>
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem
                  q="Is this truly random?"
                  a="This generator uses JavaScript's Math.random(), which is a pseudorandom number generator (PRNG). It produces sequences that are statistically indistinguishable from true randomness for practical purposes — games, raffles, sampling, and everyday decisions. However, it is deterministic at its core, seeded by system entropy, and should not be used for cryptographic security or regulated gambling applications where certified true randomness is required."
                />
                <FaqItem
                  q="What is the difference between random and unique mode?"
                  a="In standard (non-unique) mode, each number is generated independently, so duplicates can and will occur — especially with many results in a narrow range. In unique mode, every number in your output appears exactly once, like drawing numbered balls from a bag without replacing them. Unique mode uses the Fisher-Yates shuffle algorithm to guarantee fair, duplicate-free selection. If you request more unique numbers than exist in your range, the generator will show an error rather than silently repeating values."
                />
                <FaqItem
                  q="Can I generate negative random numbers?"
                  a="Yes. Both the minimum and maximum fields accept negative integers. Set min to a negative value (e.g., −100) and max to any higher value (e.g., 100) to generate numbers that span the full range including negative, zero, and positive integers. This is useful for simulations, coordinate systems, financial modeling, and any application that works with signed integers."
                />
                <FaqItem
                  q="What is the maximum number of results I can generate?"
                  a="You can generate up to 1,000 numbers per click. This limit balances browser performance with practical utility — 1,000 results is more than sufficient for statistical sampling, test data generation, and bulk lottery picks. If you need more than 1,000 numbers, you can click Generate multiple times and copy each batch separately. There is no limit on how many times you can generate."
                />
                <FaqItem
                  q="Is this suitable for lottery or gambling?"
                  a="This tool is suitable for informal lottery-style draws such as office raffles, classroom giveaways, and friendly competitions — contexts where auditability and entertainment are the goals. It is not suitable for regulated gambling applications, state lotteries, or any use case where certified randomness and legal compliance are required. For those applications, regulatory bodies require hardware random number generators with certified statistical properties."
                />
                <FaqItem
                  q="How do I use this for a raffle or giveaway?"
                  a="Assign each participant a sequential number starting from 1. Set min to 1 and max to the total number of participants. Set count to the number of winners you need, and enable unique mode to ensure no participant wins twice. Click Generate to reveal the winning numbers, then match them back to your participant list. You can screenshot the result or copy the numbers as proof for public transparency."
                />
                <FaqItem
                  q="What algorithm does this use?"
                  a="Standard mode uses the formula: floor(Math.random() × (max − min + 1)) + min for each number independently. Unique mode uses the Fisher-Yates shuffle (also called the Knuth shuffle): an O(n) algorithm that builds the complete range array, then iterates from the last element backward, swapping each element with a randomly chosen earlier element. The first N elements of the resulting shuffled array are returned as your results."
                />
                <FaqItem
                  q="Is my data private?"
                  a="Yes — completely. All random number generation happens locally in your browser using JavaScript. The numbers you enter for min, max, and count are never sent to any server, never stored in a database, and never linked to any user profile or session. When you close or refresh the tab, all values reset. This tool has no user accounts, no analytics that capture input values, and no data collection of any kind."
                />
              </div>
            </section>

            {/* ── FINAL CTA ── */}
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 to-violet-400 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Need More Number Tools?</h2>
                <p className="text-white/80 mb-6 max-w-lg">
                  Explore 400+ free tools including dice rollers, password generators, unit converters, and more — all free, all instant, no signup required.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-purple-600 font-bold rounded-xl hover:-translate-y-0.5 transition-transform"
                >
                  Explore All Tools <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </section>
          </div>

          {/* ── RIGHT SIDEBAR ── */}
          <div className="space-y-6">
            <div className="sticky top-28 space-y-6">

              {/* Related Tools */}
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight mb-3 uppercase">Related Tools</h3>
                <div className="space-y-0.5">
                  {RELATED_TOOLS.map((tool) => (
                    <Link
                      key={tool.slug}
                      href={getCanonicalToolPath(tool.slug)}
                      className="group flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-muted transition-all"
                    >
                      <div
                        className="w-7 h-7 rounded-md flex items-center justify-center text-white flex-shrink-0 [&>svg]:w-3.5 [&>svg]:h-3.5"
                        style={{ background: `linear-gradient(135deg, hsl(${tool.color} 70% 55%), hsl(${tool.color} 75% 42%))` }}
                      >
                        {tool.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors truncate">{tool.title}</p>
                        <p className="text-[10px] text-muted-foreground/60 truncate">{tool.benefit}</p>
                      </div>
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-purple-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Share Card */}
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-1.5">Share This Tool</h3>
                <p className="text-xs text-muted-foreground mb-3">Help others generate random numbers easily.</p>
                <button
                  onClick={copyLink}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-purple-500 to-violet-400 text-white text-sm font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform"
                >
                  {linkCopied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy Link</>}
                </button>
              </div>

              {/* On This Page */}
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-3">On This Page</h3>
                <div className="space-y-0.5">
                  {[
                    "Calculator",
                    "How to Use",
                    "Result Interpretation",
                    "Quick Examples",
                    "Why Choose This",
                    "FAQ",
                  ].map((label) => (
                    <a
                      key={label}
                      href={`#${label.toLowerCase().replace(/\s/g, "-")}`}
                      className="flex items-center gap-2 text-xs text-muted-foreground hover:text-purple-500 font-medium py-1.5 transition-colors"
                    >
                      <div className="w-1 h-1 rounded-full bg-purple-500/40 flex-shrink-0" />
                      {label}
                    </a>
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
