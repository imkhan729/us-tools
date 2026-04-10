import { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Circle,
  Dices,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import UtilityToolPageShell from "./UtilityToolPageShell";
import { getCanonicalToolPath } from "@/data/tools";

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
      setHistory((h) => [r, ...h].slice(0, 50));
      setIsFlipping(false);
    }, 700);
  };

  const reset = () => {
    setResult(null);
    setHistory([]);
  };

  const headsCount = history.filter((r) => r === "heads").length;
  const tailsCount = history.filter((r) => r === "tails").length;

  return { result, isFlipping, flip, reset, history, headsCount, tailsCount };
}

function CoinFlipCalculator() {
  const { result, isFlipping, flip, reset, history, headsCount, tailsCount } = useCoinFlip();
  const [flipCount, setFlipCount] = useState(1);
  const [multiResults, setMultiResults] = useState<FlipResult[]>([]);
  const [isMultiFlipping, setIsMultiFlipping] = useState(false);

  const flipMultiple = () => {
    if (isMultiFlipping || flipCount < 1 || flipCount > 1000) return;
    setIsMultiFlipping(true);
    setTimeout(() => {
      const results: FlipResult[] = Array.from({ length: flipCount }, () => (Math.random() < 0.5 ? "heads" : "tails"));
      setMultiResults(results);
      setIsMultiFlipping(false);
    }, 400);
  };

  const multiHeads = multiResults.filter((r) => r === "heads").length;
  const multiTails = multiResults.filter((r) => r === "tails").length;
  const multiHeadsPct = multiResults.length > 0 ? ((multiHeads / multiResults.length) * 100).toFixed(1) : "0";
  const multiTailsPct = multiResults.length > 0 ? ((multiTails / multiResults.length) * 100).toFixed(1) : "0";

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Single flip</p>
        <div className="flex flex-col items-center gap-6">
          <motion.button
            type="button"
            onClick={flip}
            disabled={isFlipping}
            animate={isFlipping ? { rotateY: [0, 180, 360, 540, 720], scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className="w-36 h-36 rounded-full border-4 flex flex-col items-center justify-center cursor-pointer select-none focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/50 disabled:opacity-80"
            style={{
              background:
                result === null
                  ? "linear-gradient(135deg, hsl(45,80%,60%), hsl(35,80%,50%))"
                  : result === "heads"
                    ? "linear-gradient(135deg, hsl(45,80%,60%), hsl(35,80%,50%))"
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

          <div className="flex gap-3 flex-wrap justify-center">
            <button
              type="button"
              onClick={flip}
              disabled={isFlipping}
              className="px-6 py-3 bg-blue-600 text-white font-black rounded-xl text-sm hover:bg-blue-700 transition-colors disabled:opacity-60"
            >
              {isFlipping ? "Flipping…" : "Flip coin"}
            </button>
            {history.length > 0 && (
              <button
                type="button"
                onClick={reset}
                className="px-4 py-3 border-2 border-border text-muted-foreground font-bold rounded-xl text-sm hover:border-foreground hover:text-foreground transition-colors"
              >
                Reset
              </button>
            )}
          </div>

          {history.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground text-center mb-3">
                Session stats — {history.length} flip{history.length > 1 ? "s" : ""}
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/20 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-1">Heads</p>
                  <p className="text-2xl font-black text-foreground">{headsCount}</p>
                  <p className="text-xs text-muted-foreground">
                    {history.length > 0 ? ((headsCount / history.length) * 100).toFixed(1) : 0}%
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-500/5 border border-slate-500/20 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Tails</p>
                  <p className="text-2xl font-black text-foreground">{tailsCount}</p>
                  <p className="text-xs text-muted-foreground">
                    {history.length > 0 ? ((tailsCount / history.length) * 100).toFixed(1) : 0}%
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1 mt-3 justify-center">
                {history.slice(0, 30).map((r, i) => (
                  <span
                    key={i}
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-white flex-shrink-0 ${r === "heads" ? "bg-blue-500" : "bg-slate-500"}`}
                  >
                    {r === "heads" ? "H" : "T"}
                  </span>
                ))}
                {history.length > 30 && (
                  <span className="text-xs text-muted-foreground self-center">+{history.length - 30} more</span>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <div className="border-t border-border pt-8">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Flip multiple coins</p>
        <div className="flex gap-3 items-center flex-wrap">
          <input
            type="number"
            min={1}
            max={1000}
            className="tool-calc-input w-28"
            value={flipCount}
            onChange={(e) => setFlipCount(Math.min(1000, Math.max(1, parseInt(e.target.value, 10) || 1)))}
          />
          <span className="text-sm font-medium text-muted-foreground">coins</span>
          <button
            type="button"
            onClick={flipMultiple}
            disabled={isMultiFlipping}
            className="px-5 py-2.5 bg-blue-600 text-white font-black rounded-xl text-sm hover:bg-blue-700 transition-colors disabled:opacity-60"
          >
            {isMultiFlipping ? "Flipping…" : `Flip ${flipCount} coin${flipCount > 1 ? "s" : ""}`}
          </button>
        </div>

        {multiResults.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 space-y-3">
            <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
              <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/20 text-center">
                <p className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest mb-1">Heads</p>
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
  );
}

const CANONICAL = `https://usonlinetools.com${getCanonicalToolPath("coin-flip")}`;

export default function CoinFlip() {
  return (
    <UtilityToolPageShell
      title="Coin Flip"
      seoTitle="Coin Flip Online – Virtual Heads or Tails"
      seoDescription="Flip a virtual coin online instantly. Single or batch flips (up to 1,000), session history, and heads/tails stats. Free, private, works on any device."
      canonical={CANONICAL}
      categoryName="Productivity & Text"
      categoryHref="/category/productivity"
      heroDescription="Flip a virtual coin instantly — heads or tails. Run one flip or hundreds at once, track session history, and see live heads/tails percentages. Nothing is stored on a server."
      heroIcon={<Circle className="w-3.5 h-3.5" />}
      calculatorLabel="Virtual coin flip"
      calculatorDescription="Tap the coin or use the button. Use multi-flip for quick simulations and classroom demos."
      calculator={<CoinFlipCalculator />}
      howSteps={[
        {
          title: "Single flip — tap the coin or button",
          description:
            "Each flip animates briefly, then shows Heads (H) or Tails (T). Recent outcomes appear as chips below with running percentages.",
        },
        {
          title: "Multi-flip for batches",
          description: "Enter 2–1,000 and flip all at once. Great for probability demos, tie-breakers, or quick simulations.",
        },
        {
          title: "Reset when you want a clean session",
          description: "Reset clears history in this tab only. Refreshing the page also clears results — nothing is uploaded.",
        },
      ]}
      interpretationCards={[
        {
          title: "Expect roughly 50/50 over many flips",
          description: "A fair coin is independent each time. Short sessions can look skewed; larger samples tend toward half heads and half tails.",
        },
        {
          title: "Streaks are normal",
          description: "Several heads or tails in a row is common randomness, not a bug. The next flip is still 50/50.",
          className: "bg-cyan-500/5 border-cyan-500/20",
        },
        {
          title: "Pseudo-random in the browser",
          description: "Flips use Math.random() in your browser — fine for games and decisions, not for cryptography or security keys.",
          className: "bg-violet-500/5 border-violet-500/20",
        },
      ]}
      examples={[
        { scenario: "Who goes first?", input: "1 flip", output: "Heads or tails decides order" },
        { scenario: "Classroom demo", input: "100 flips", output: "~50 heads / ~50 tails (typical)" },
        { scenario: "Tie-breaker", input: "Multi-flip 1 coin", output: "Single unbiased outcome" },
      ]}
      whyChoosePoints={[
        "Large single-column layout with an obvious coin control works well on phones and desktops.",
        "Batch mode supports up to 1,000 flips with instant counts and percentages.",
        "Session-only history helps you compare streaks without creating an account or saving data server-side.",
      ]}
      faqs={[
        {
          q: "Is the virtual coin fair?",
          a: "Each flip uses pseudo-random values with about 50% heads and 50% tails. Outcomes are not influenced by previous flips.",
        },
        {
          q: "Why do I see more heads than tails sometimes?",
          a: "Small samples vary. True randomness includes streaks and uneven splits; longer runs usually look closer to 50/50.",
        },
        {
          q: "Can I use this for sports or games?",
          a: "Yes. Many people use a digital coin toss to pick sides or turn order. It is unbiased for casual decisions.",
        },
        {
          q: "Is my flip history saved?",
          a: "No. History lives in your browser memory for this session only and is cleared when you reset or close the tab.",
        },
      ]}
      relatedTools={[
        { title: "Dice Roller", slug: "dice-roller", icon: <Dices className="w-4 h-4" />, color: 265, benefit: "Roll any dice setup" },
        {
          title: "Random Number Generator",
          slug: "random-number-generator",
          icon: <TrendingUp className="w-4 h-4" />,
          color: 217,
          benefit: "Numbers in any range",
        },
        {
          title: "Random Picker",
          slug: "random-picker-tool",
          icon: <RefreshCw className="w-4 h-4" />,
          color: 152,
          benefit: "Pick from your list",
        },
        {
          title: "Number Sequence Generator",
          slug: "number-sequence-generator",
          icon: <BarChart3 className="w-4 h-4" />,
          color: 45,
          benefit: "Arithmetic sequences",
        },
      ]}
      ctaTitle="More productivity tools"
      ctaDescription="Dice, pickers, text utilities, and more — all free in your browser."
      ctaHref="/category/productivity"
    />
  );
}
