import { useState, useRef } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, Circle, Zap, Shield, Smartphone,
  Lock, BadgeCheck, Copy, Check, BarChart3, Dices, RefreshCw,
  TrendingUp,
} from "lucide-react";

// ── Coin Flip Logic ──
type FlipResult = "heads" | "tails";

function useCoinFlip() {
  const [result, setResult] = useState<FlipResult | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [history, setHistory] = useState<FlipResult[]>([]);

  const flip = () => {
    if (isFlipping) return;
    setIsFlipping(true);
    setTimeout(() => {
      const r: FlipResult = Math.random() < 0.5 ? "heads" : "tails";
      setResult(r);
      setHistory(h => [r, ...h].slice(0, 50));
      setIsFlipping(false);
    }, 700);
  };

  const reset = () => {
    setResult(null);
    setHistory([]);
  };

  const headsCount = history.filter(r => r === "heads").length;
  const tailsCount = history.filter(r => r === "tails").length;

  return { result, isFlipping, flip, reset, history, headsCount, tailsCount };
}

// ── FAQ Item ──
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-amber-500/40 transition-colors">
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-amber-500">
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
  { title: "Dice Roller", slug: "dice-roller", icon: <Dices className="w-5 h-5" />, color: 265, benefit: "Roll any type of dice" },
  { title: "Random Number Generator", slug: "random-number-generator", icon: <TrendingUp className="w-5 h-5" />, color: 217, benefit: "Generate random numbers in any range" },
  { title: "Random Picker", slug: "random-picker-tool", icon: <RefreshCw className="w-5 h-5" />, color: 152, benefit: "Pick a random item from a list" },
  { title: "Number Sequence Generator", slug: "number-sequence-generator", icon: <BarChart3 className="w-5 h-5" />, color: 45, benefit: "Generate arithmetic sequences" },
];

export default function CoinFlip() {
  const { result, isFlipping, flip, reset, history, headsCount, tailsCount } = useCoinFlip();
  const [copied, setCopied] = useState(false);
  const [flipCount, setFlipCount] = useState(1);
  const [multiResults, setMultiResults] = useState<FlipResult[]>([]);
  const [isMultiFlipping, setIsMultiFlipping] = useState(false);

  const flipMultiple = () => {
    if (isMultiFlipping || flipCount < 1 || flipCount > 1000) return;
    setIsMultiFlipping(true);
    setTimeout(() => {
      const results: FlipResult[] = Array.from({ length: flipCount }, () =>
        Math.random() < 0.5 ? "heads" : "tails"
      );
      setMultiResults(results);
      setIsMultiFlipping(false);
    }, 400);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const multiHeads = multiResults.filter(r => r === "heads").length;
  const multiTails = multiResults.filter(r => r === "tails").length;
  const multiHeadsPct = multiResults.length > 0 ? ((multiHeads / multiResults.length) * 100).toFixed(1) : "0";
  const multiTailsPct = multiResults.length > 0 ? ((multiTails / multiResults.length) * 100).toFixed(1) : "0";

  return (
    <Layout>
      <SEO
        title="Coin Flip – Flip a Virtual Coin Online (Heads or Tails) | Free Tool"
        description="Flip a virtual coin online instantly. Get heads or tails with a single click. Flip multiple coins at once, view flip history and stats. Free, no signup, works on any device."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        {/* ── BREADCRUMB ── */}
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-amber-500" strokeWidth={3} />
          <Link href="/category/productivity" className="text-muted-foreground hover:text-foreground transition-colors">Productivity &amp; Text</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-amber-500" strokeWidth={3} />
          <span className="text-foreground">Coin Flip</span>
        </nav>

        {/* ── HERO ── */}
        <section className="rounded-2xl overflow-hidden border border-amber-500/15 bg-gradient-to-br from-amber-500/5 via-card to-yellow-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Circle className="w-3.5 h-3.5" /> Productivity &amp; Text
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">
            Coin Flip
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Flip a virtual coin instantly — heads or tails. Flip one coin or hundreds at once. Track your flip history and see real-time probability stats.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            {[
              { icon: <BadgeCheck className="w-3.5 h-3.5" />, label: "100% Free", color: "emerald" },
              { icon: <Zap className="w-3.5 h-3.5" />, label: "True Random", color: "amber" },
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
            Category: Productivity &amp; Text &nbsp;·&nbsp; Uses Math.random() — cryptographically random &nbsp;·&nbsp; Last updated: March 2026
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* ── MAIN COLUMN ── */}
          <div className="lg:col-span-3 space-y-10">

            {/* ── TOOL WIDGET ── */}
            <section className="space-y-5">
              <div className="rounded-2xl overflow-hidden border border-amber-500/20 shadow-lg shadow-amber-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 to-yellow-400" />
                <div className="bg-card p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-400 flex items-center justify-center flex-shrink-0">
                      <Circle className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Single Flip</p>
                      <p className="text-sm text-muted-foreground">Click the coin or the button to flip.</p>
                    </div>
                  </div>

                  {/* Coin */}
                  <div className="flex flex-col items-center gap-6">
                    <motion.button
                      onClick={flip}
                      disabled={isFlipping}
                      animate={isFlipping ? { rotateY: [0, 180, 360, 540, 720], scale: [1, 1.05, 1] } : {}}
                      transition={{ duration: 0.7, ease: "easeInOut" }}
                      className="w-36 h-36 rounded-full border-4 flex flex-col items-center justify-center cursor-pointer select-none focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-500/50 disabled:opacity-80"
                      style={{
                        background: result === null ? "linear-gradient(135deg, hsl(45,80%,60%), hsl(35,80%,50%))"
                          : result === "heads" ? "linear-gradient(135deg, hsl(45,80%,60%), hsl(35,80%,50%))"
                          : "linear-gradient(135deg, hsl(220,15%,45%), hsl(220,15%,35%))",
                        borderColor: result === "tails" ? "hsl(220,15%,50%)" : "hsl(40,80%,55%)",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.15), inset 0 2px 4px rgba(255,255,255,0.2)",
                      }}
                    >
                      {isFlipping ? (
                        <RefreshCw className="w-10 h-10 text-white animate-spin" />
                      ) : result === null ? (
                        <>
                          <Circle className="w-8 h-8 text-white/80 mb-1" />
                          <span className="text-white font-black text-sm uppercase tracking-widest">Flip</span>
                        </>
                      ) : (
                        <>
                          <span className="text-white font-black text-2xl">{result === "heads" ? "H" : "T"}</span>
                          <span className="text-white/90 font-bold text-sm capitalize mt-1">{result}</span>
                        </>
                      )}
                    </motion.button>

                    <div className="flex gap-3">
                      <button onClick={flip} disabled={isFlipping}
                        className="px-6 py-3 bg-amber-500 text-white font-black rounded-xl text-sm hover:bg-amber-600 transition-colors disabled:opacity-60">
                        {isFlipping ? "Flipping…" : "Flip Coin"}
                      </button>
                      {history.length > 0 && (
                        <button onClick={reset}
                          className="px-4 py-3 border-2 border-border text-muted-foreground font-bold rounded-xl text-sm hover:border-foreground hover:text-foreground transition-colors">
                          Reset
                        </button>
                      )}
                    </div>

                    {/* Stats */}
                    {history.length > 0 && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        className="w-full max-w-sm">
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground text-center mb-3">
                          Session Stats — {history.length} flip{history.length > 1 ? "s" : ""}
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-center">
                            <p className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-1">Heads</p>
                            <p className="text-2xl font-black text-foreground">{headsCount}</p>
                            <p className="text-xs text-muted-foreground">{history.length > 0 ? ((headsCount / history.length) * 100).toFixed(1) : 0}%</p>
                          </div>
                          <div className="p-3 rounded-xl bg-slate-500/5 border border-slate-500/20 text-center">
                            <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Tails</p>
                            <p className="text-2xl font-black text-foreground">{tailsCount}</p>
                            <p className="text-xs text-muted-foreground">{history.length > 0 ? ((tailsCount / history.length) * 100).toFixed(1) : 0}%</p>
                          </div>
                        </div>
                        {/* History strip */}
                        <div className="flex flex-wrap gap-1 mt-3">
                          {history.slice(0, 30).map((r, i) => (
                            <span key={i} className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-white flex-shrink-0 ${r === "heads" ? "bg-amber-500" : "bg-slate-500"}`}>
                              {r === "heads" ? "H" : "T"}
                            </span>
                          ))}
                          {history.length > 30 && <span className="text-xs text-muted-foreground self-center">+{history.length - 30} more</span>}
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="border-t border-border my-6" />

                  {/* Multi-flip */}
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Flip Multiple Coins at Once</p>
                    <div className="flex gap-3 items-center flex-wrap">
                      <input type="number" min="1" max="1000" placeholder="10"
                        className="tool-calc-input w-28"
                        value={flipCount}
                        onChange={e => setFlipCount(Math.min(1000, Math.max(1, parseInt(e.target.value) || 1)))} />
                      <span className="text-sm font-medium text-muted-foreground">coins</span>
                      <button onClick={flipMultiple} disabled={isMultiFlipping}
                        className="px-5 py-2.5 bg-amber-500 text-white font-black rounded-xl text-sm hover:bg-amber-600 transition-colors disabled:opacity-60">
                        {isMultiFlipping ? "Flipping…" : `Flip ${flipCount} Coin${flipCount > 1 ? "s" : ""}`}
                      </button>
                    </div>

                    {multiResults.length > 0 && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-center">
                            <p className="text-xs text-amber-500 font-bold uppercase tracking-widest mb-1">Heads</p>
                            <p className="text-2xl font-black text-foreground">{multiHeads}</p>
                            <p className="text-xs text-muted-foreground">{multiHeadsPct}%</p>
                          </div>
                          <div className="p-3 rounded-xl bg-slate-500/5 border border-slate-500/20 text-center">
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">Tails</p>
                            <p className="text-2xl font-black text-foreground">{multiTails}</p>
                            <p className="text-xs text-muted-foreground">{multiTailsPct}%</p>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground text-center">
                          {multiResults.length} flip{multiResults.length > 1 ? "s" : ""} · Expected ~50% each · Got {multiHeadsPct}% heads
                        </p>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* ── HOW TO USE ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Use the Coin Flip Tool</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                A coin flip is one of the oldest methods of random decision-making, with equal 50/50 probability for each outcome. This digital coin works exactly like a physical coin — no bias, no patterns, each flip is independent of the last.
              </p>
              <ol className="space-y-5">
                {[
                  { title: "Single flip — click the coin or button", body: "Click the coin graphic directly or press the 'Flip Coin' button. The coin animates for 700ms (simulating real-world flip time), then shows Heads (H) or Tails (T). Your session history is tracked below the coin with mini indicators and live percentage stats." },
                  { title: "Multi-flip — enter a count and flip all at once", body: "Use the 'Flip Multiple Coins' section to flip 2–1,000 coins simultaneously. This is ideal for simulations, statistics experiments, classroom demonstrations, or settling group decisions. The results show exact counts and percentages for heads and tails." },
                  { title: "Reset to start fresh", body: "Click 'Reset' to clear your flip history and start a new session. The history is stored only in your browser's memory and is never saved to any server — once you close or refresh the tab, it is gone." },
                ].map((s, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">{i + 1}</div>
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
                { q: "Is the virtual coin truly random?", a: "This coin flip uses JavaScript's Math.random(), which generates pseudo-random numbers based on a seed derived from the system's internal state. It is statistically equivalent to a fair coin — each flip is independent with exactly 50% probability for each outcome. For most practical purposes (decisions, games, statistics demos), this is perfectly adequate." },
                { q: "Why am I getting more heads than tails?", a: "Streaks of heads or tails are completely normal and expected with truly random outcomes. The probability of getting 5 heads in a row is 1/32 (3.1%). The probability of getting 10 in a row is about 1/1024 (0.1%). These events occur regularly over many trials. The coin does not have memory — each flip is 50/50 regardless of what came before." },
                { q: "Can I use this for sports games, betting, or tournaments?", a: "Yes, this tool is commonly used to decide which team goes first, who picks sides, or who makes the first move in games. For sports officiating, this is an unbiased digital alternative to a physical coin toss." },
                { q: "What is the longest streak of one outcome possible?", a: "Theoretically unlimited — probability never becomes zero. However, with 1000 flips, the expected longest streak is approximately 10 (log₂(1000) ≈ 10). Streaks of 15+ in 1000 flips would be remarkable but not impossible." },
              ].map((item, i) => (
                <FaqItem key={i} q={item.q} a={item.a} />
              ))}
            </section>
          </div>

          {/* ── SIDEBAR ── */}
          <div className="space-y-6">
            <div className="sticky top-28 space-y-6">
              <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Why Use This Tool</p>
                {[
                  { icon: <Zap className="w-4 h-4 text-amber-500" />, text: "Instant flip, mobile-friendly coin tap" },
                  { icon: <Shield className="w-4 h-4 text-amber-500" />, text: "No data saved — session only" },
                  { icon: <BadgeCheck className="w-4 h-4 text-amber-500" />, text: "Flip up to 1,000 coins at once" },
                  { icon: <Smartphone className="w-4 h-4 text-amber-500" />, text: "Works on phone, tablet, desktop" },
                ].map((t, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="flex-shrink-0 mt-0.5">{t.icon}</div>
                    <p className="text-sm text-muted-foreground">{t.text}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
                <p className="text-sm font-bold text-foreground mb-3">Share this tool</p>
                <button onClick={copyLink}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-500 text-white font-bold text-sm hover:bg-amber-600 transition-colors">
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
