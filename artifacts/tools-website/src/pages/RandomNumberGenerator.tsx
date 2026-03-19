import { useState, useCallback } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { Dices, Copy, RefreshCw, Hash } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function RandomNumberGenerator() {
  const [min, setMin] = useState("1");
  const [max, setMax] = useState("100");
  const [count, setCount] = useState("1");
  const [unique, setUnique] = useState(false);
  const [results, setResults] = useState<number[]>([]);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = useCallback(() => {
    setError("");
    const lo = parseInt(min);
    const hi = parseInt(max);
    const n = Math.max(1, Math.min(parseInt(count) || 1, 1000));

    if (isNaN(lo) || isNaN(hi)) { setError("Please enter valid min and max values."); return; }
    if (lo >= hi) { setError("Min must be less than Max."); return; }
    if (unique && n > hi - lo + 1) { setError(`Cannot generate ${n} unique numbers in range [${lo}, ${hi}].`); return; }

    const pool: number[] = [];
    if (unique) {
      const range = Array.from({ length: hi - lo + 1 }, (_, i) => lo + i);
      for (let i = range.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [range[i], range[j]] = [range[j], range[i]];
      }
      pool.push(...range.slice(0, n));
    } else {
      for (let i = 0; i < n; i++) {
        pool.push(Math.floor(Math.random() * (hi - lo + 1)) + lo);
      }
    }
    setResults(pool);
  }, [min, max, count, unique]);

  const copyAll = () => {
    navigator.clipboard.writeText(results.join(", "));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const inputCls = "w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-foreground font-bold text-lg focus:outline-none focus:border-primary transition-colors";

  const ToolUI = (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-black uppercase tracking-wider text-foreground mb-2">Minimum</label>
          <input type="number" className={inputCls} value={min} onChange={e => setMin(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-black uppercase tracking-wider text-foreground mb-2">Maximum</label>
          <input type="number" className={inputCls} value={max} onChange={e => setMax(e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 items-end">
        <div>
          <label className="block text-sm font-black uppercase tracking-wider text-foreground mb-2">How many numbers?</label>
          <input type="number" min="1" max="1000" className={inputCls} value={count} onChange={e => setCount(e.target.value)} />
        </div>
        <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border-2 border-border hover:border-primary transition-colors h-[52px]">
          <div
            onClick={() => setUnique(u => !u)}
            className={`w-12 h-6 rounded-full border-2 border-foreground transition-colors relative ${unique ? "bg-primary" : "bg-muted"}`}
          >
            <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-foreground transition-all ${unique ? "left-6" : "left-0.5"}`} />
          </div>
          <span className="font-bold text-sm text-foreground">No duplicates</span>
        </label>
      </div>

      {error && (
        <div className="bg-red-500/10 border-2 border-red-500/30 text-red-600 dark:text-red-400 rounded-xl px-4 py-3 text-sm font-bold">{error}</div>
      )}

      <button
        onClick={generate}
        className="w-full py-4 bg-primary text-primary-foreground font-black uppercase tracking-wider rounded-xl border-2 border-foreground hard-shadow hover:-translate-y-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 text-lg"
      >
        <Dices className="w-5 h-5" />
        Generate {parseInt(count) > 1 ? `${count} Numbers` : "Number"}
      </button>

      <AnimatePresence>
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-black uppercase tracking-wider text-muted-foreground">{results.length} Result{results.length !== 1 ? "s" : ""}</p>
              <button
                onClick={copyAll}
                className="flex items-center gap-2 text-sm font-bold text-primary hover:underline"
              >
                <Copy className="w-4 h-4" />
                {copied ? "Copied!" : "Copy all"}
              </button>
            </div>

            {results.length === 1 ? (
              <div className="bg-primary/10 border-2 border-primary/30 rounded-xl p-8 text-center">
                <motion.p
                  key={results[0]}
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-7xl font-black text-primary"
                >
                  {results[0]}
                </motion.p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 p-4 bg-card border-2 border-border rounded-xl max-h-48 overflow-y-auto">
                {results.map((n, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-lg font-mono font-bold text-sm"
                  >
                    {n}
                  </motion.span>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <ToolPageLayout
      title="Random Number Generator"
      description="Generate one or multiple random numbers within any range instantly. Supports unique (no duplicate) mode."
      tool={ToolUI}
      howToUse={
        <>
          <p>Generate random numbers in three simple steps:</p>
          <ol>
            <li><strong>Set your range</strong> — enter the minimum and maximum values (e.g., 1 to 100).</li>
            <li><strong>Choose how many</strong> — generate 1 number or up to 1,000 at once.</li>
            <li><strong>Toggle unique mode</strong> — enable "No duplicates" to ensure all results are distinct.</li>
            <li><strong>Click Generate</strong> — results appear instantly and can be copied to clipboard.</li>
          </ol>
        </>
      }
      faq={[
        { q: "Is this truly random?", a: "This tool uses JavaScript's Math.random(), which is a pseudo-random number generator (PRNG). It's suitable for games, decisions, and sampling, but not for cryptographic use." },
        { q: "What is the maximum number I can generate?", a: "You can generate up to 1,000 numbers at once. The range can be any integer value your browser can handle." },
        { q: "What does 'No duplicates' mean?", a: "With 'No duplicates' enabled, each generated number appears only once in the results — like drawing from a hat without replacement." },
        { q: "Can I generate negative numbers?", a: "Yes! Simply set a negative minimum value (e.g., Min: -50, Max: 50) to include negative numbers in your range." },
      ]}
      related={[
        { title: "Dice Roller", path: "/tools/dnd-dice-roller", icon: <Dices className="w-5 h-5" /> },
        { title: "Password Generator", path: "/tools/password-generator", icon: <Hash className="w-5 h-5" /> },
        { title: "UUID Generator", path: "/tools/uuid-generator", icon: <Hash className="w-5 h-5" /> },
      ]}
    />
  );
}
