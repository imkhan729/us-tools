import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, CheckCircle2, Info, Calculator } from "lucide-react";
import { SEO } from "../../components/SEO";
import { Link } from "wouter";

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-5 py-4 text-left font-semibold text-foreground hover:bg-muted/40 transition-colors">
        <span>{q}</span>
        {open ? <ChevronUp className="w-4 h-4 shrink-0" /> : <ChevronDown className="w-4 h-4 shrink-0" />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
            <p className="px-5 pb-4 text-muted-foreground leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Roman numeral conversion ────────────────────────────────────────────────
const ROMAN_MAP: [number, string][] = [
  [1000,"M"],[900,"CM"],[500,"D"],[400,"CD"],
  [100,"C"],[90,"XC"],[50,"L"],[40,"XL"],
  [10,"X"],[9,"IX"],[5,"V"],[4,"IV"],[1,"I"],
];

function toRoman(n: number): string {
  if (n <= 0 || n > 3999) return "";
  let result = "";
  for (const [val, sym] of ROMAN_MAP) {
    while (n >= val) { result += sym; n -= val; }
  }
  return result;
}

function fromRoman(s: string): number | null {
  const clean = s.trim().toUpperCase();
  if (!clean) return null;
  const vals: Record<string,number> = { M:1000,D:500,C:100,L:50,X:10,V:5,I:1 };
  let result = 0;
  for (let i = 0; i < clean.length; i++) {
    const cur = vals[clean[i]];
    if (cur === undefined) return null;
    const next = vals[clean[i+1]];
    if (next && next > cur) { result += next - cur; i++; }
    else result += cur;
  }
  return result > 0 && result <= 3999 ? result : null;
}

function buildBreakdown(roman: string): { sym: string; val: number; op: "+" | "-" }[] {
  const clean = roman.toUpperCase();
  const vals: Record<string,number> = { M:1000,D:500,C:100,L:50,X:10,V:5,I:1 };
  const steps: { sym: string; val: number; op: "+" | "-" }[] = [];
  for (let i = 0; i < clean.length; i++) {
    const cur = vals[clean[i]];
    const next = vals[clean[i+1]];
    if (next && next > cur) {
      steps.push({ sym: clean[i] + clean[i+1], val: next - cur, op: "+" });
      i++;
    } else {
      steps.push({ sym: clean[i], val: cur, op: "+" });
    }
  }
  return steps;
}

export default function RomanNumeralConverter() {
  const [mode, setMode] = useState<"toRoman" | "fromRoman">("toRoman");
  const [input, setInput] = useState("2024");

  const result = useMemo(() => {
    const trimmed = input.trim();
    if (!trimmed) return null;
    if (mode === "toRoman") {
      const n = parseInt(trimmed, 10);
      if (isNaN(n) || n <= 0 || n > 3999) return { error: "Enter a number between 1 and 3999." };
      const roman = toRoman(n);
      const breakdown = buildBreakdown(roman);
      return { decimal: n, roman, breakdown };
    } else {
      const n = fromRoman(trimmed);
      if (n === null) return { error: "Invalid Roman numeral. Use I, V, X, L, C, D, M only." };
      const roman = trimmed.toUpperCase();
      const breakdown = buildBreakdown(roman);
      return { decimal: n, roman, breakdown };
    }
  }, [input, mode]);

  return (
    <div style={{ "--calc-hue": "35" } as React.CSSProperties} className="min-h-screen bg-background">
      <SEO
        title="Roman Numeral Converter — Convert Numbers to Roman Numerals"
        description="Convert numbers to Roman numerals and back. See step-by-step breakdown of each symbol. Free online Roman numeral converter with full reference chart."
      />

      <nav className="max-w-6xl mx-auto px-4 pt-4 pb-0 text-sm text-muted-foreground flex gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <span>/</span>
        <Link href="/category/conversion" className="hover:text-foreground transition-colors">Conversion Tools</Link>
        <span>/</span>
        <span className="text-foreground font-medium">Roman Numeral Converter</span>
      </nav>

      <header className="max-w-6xl mx-auto px-4 pt-6 pb-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[hsl(var(--calc-hue),80%,40%)] bg-[hsl(var(--calc-hue),90%,95%)] dark:bg-[hsl(var(--calc-hue),40%,20%)] px-3 py-1 rounded-full mb-3">
          Conversion Tools
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3">Roman Numeral Converter</h1>
        <div className="flex flex-wrap gap-2 mb-4">
          {["Free", "Both Directions", "Step-by-Step", "No Signup"].map((b) => (
            <span key={b} className="text-xs bg-muted text-muted-foreground px-2.5 py-1 rounded-full font-medium">{b}</span>
          ))}
        </div>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Convert any number (1–3999) to Roman numerals or translate Roman numerals back to decimal. See a symbol-by-symbol breakdown explaining every conversion step.
        </p>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <section className="lg:col-span-3 space-y-6">
          <div className="tool-calc-card">
            <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-[hsl(var(--calc-hue),80%,40%)]" />
              Roman Numeral Converter
            </h2>

            <div className="flex gap-2 mb-5 p-1 bg-muted rounded-xl w-fit">
              {[["toRoman","Number → Roman"],["fromRoman","Roman → Number"]].map(([m, label]) => (
                <button key={m} onClick={() => { setMode(m as "toRoman" | "fromRoman"); setInput(""); }}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${mode === m ? "bg-[hsl(var(--calc-hue),80%,45%)] text-white shadow" : "text-muted-foreground hover:text-foreground"}`}>
                  {label}
                </button>
              ))}
            </div>

            <div className="mb-6">
              <label className="tool-calc-label">{mode === "toRoman" ? "Arabic Number (1–3999)" : "Roman Numeral"}</label>
              <input className={`tool-calc-input ${mode === "fromRoman" ? "font-mono uppercase tracking-widest" : ""}`}
                type={mode === "toRoman" ? "number" : "text"}
                value={input} onChange={(e) => setInput(e.target.value)}
                placeholder={mode === "toRoman" ? "2024" : "MMXXIV"} />
            </div>

            {result && (
              <AnimatePresence mode="wait">
                <motion.div key={`${input}-${mode}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="space-y-4">
                  {"error" in result ? (
                    <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">{result.error}</div>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="tool-calc-result text-center">
                          <p className="text-xs text-muted-foreground mb-1">Decimal (Arabic)</p>
                          <p className="tool-calc-number text-3xl font-bold">{result.decimal}</p>
                        </div>
                        <div className="tool-calc-result text-center">
                          <p className="text-xs text-muted-foreground mb-1">Roman Numeral</p>
                          <p className="tool-calc-number text-3xl font-bold font-mono tracking-widest text-[hsl(var(--calc-hue),80%,40%)]">{result.roman}</p>
                        </div>
                      </div>

                      {result.breakdown.length > 0 && (
                        <div className="bg-muted/30 rounded-xl p-4">
                          <p className="text-sm font-semibold mb-3">Symbol-by-symbol breakdown:</p>
                          <div className="flex flex-wrap gap-2 items-center">
                            {result.breakdown.map((step, i) => (
                              <span key={i} className="flex items-center gap-1">
                                {i > 0 && <span className="text-muted-foreground font-bold">+</span>}
                                <span className="inline-flex flex-col items-center">
                                  <span className="font-mono font-bold text-[hsl(var(--calc-hue),80%,40%)] text-lg">{step.sym}</span>
                                  <span className="text-xs text-muted-foreground">{step.val}</span>
                                </span>
                              </span>
                            ))}
                            <span className="text-muted-foreground font-bold ml-2">=</span>
                            <span className="font-bold text-xl">{result.decimal}</span>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </div>

          {/* Roman Numeral Chart */}
          <div className="tool-calc-card">
            <h2 className="text-xl font-bold mb-4">Roman Numeral Reference Chart</h2>
            <div className="overflow-x-auto mb-5">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    {["Roman","Arabic","Roman","Arabic","Roman","Arabic"].map((h,i) => (
                      <th key={i} className="px-3 py-2 text-left font-semibold text-muted-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["I","1","X","10","C","100"],
                    ["II","2","XX","20","CC","200"],
                    ["III","3","XXX","30","CCC","300"],
                    ["IV","4","XL","40","CD","400"],
                    ["V","5","L","50","D","500"],
                    ["VI","6","LX","60","DC","600"],
                    ["VII","7","LXX","70","DCC","700"],
                    ["VIII","8","LXXX","80","DCCC","800"],
                    ["IX","9","XC","90","CM","900"],
                    ["","","","","M","1000"],
                  ].map((row, i) => (
                    <tr key={i} className="border-t border-border">
                      {row.map((cell, j) => (
                        <td key={j} className={`px-3 py-1.5 ${j % 2 === 0 ? "font-mono font-bold text-[hsl(var(--calc-hue),80%,40%)] tracking-widest" : ""}`}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="font-bold mb-2 mt-4">Subtractive Notation Rules</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                ["IV = 4", "I before V subtracts 1"],
                ["IX = 9", "I before X subtracts 1"],
                ["XL = 40", "X before L subtracts 10"],
                ["XC = 90", "X before C subtracts 10"],
                ["CD = 400", "C before D subtracts 100"],
                ["CM = 900", "C before M subtracts 100"],
              ].map(([sym, desc]) => (
                <div key={sym} className="bg-muted/30 rounded-lg px-3 py-2 text-sm flex gap-2">
                  <span className="font-mono font-bold text-[hsl(var(--calc-hue),80%,40%)] w-16 shrink-0">{sym}</span>
                  <span className="text-muted-foreground">{desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Understanding */}
          <div className="tool-calc-card">
            <h2 className="text-xl font-bold mb-4">Understanding Roman Numerals</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { title: "Seven Base Symbols", desc: "Roman numerals use 7 letters: I(1), V(5), X(10), L(50), C(100), D(500), M(1000). All other numbers are combinations of these.", color: "border-l-amber-500" },
                { title: "Additive System", desc: "Numbers are generally formed by adding symbols: VIII = 5+1+1+1 = 8. Larger values come before smaller ones in standard additive form.", color: "border-l-green-500" },
                { title: "Subtractive Notation", desc: "Six specific pairs use subtraction: IV, IX, XL, XC, CD, CM. This avoids four repetitions (IIII, XXXX, etc.) and is the standard form.", color: "border-l-blue-500" },
                { title: "No Zero or Fractions", desc: "Roman numerals have no concept of zero and cannot represent fractions or negative numbers — a fundamental limitation compared to positional number systems.", color: "border-l-red-400" },
              ].map((c) => (
                <div key={c.title} className={`border-l-4 ${c.color} pl-4 py-2 bg-muted/30 rounded-r-xl`}>
                  <p className="font-semibold mb-1">{c.title}</p>
                  <p className="text-sm text-muted-foreground">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Examples */}
          <div className="tool-calc-card">
            <h2 className="text-xl font-bold mb-4">Famous Roman Numeral Examples</h2>
            <div className="overflow-x-auto mb-5">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="px-3 py-2 text-left font-semibold">Year</th>
                    <th className="px-3 py-2 text-left font-semibold">Roman</th>
                    <th className="px-3 py-2 text-left font-semibold">Context</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["1776","MDCCLXXVI","US Declaration of Independence"],
                    ["1984","MCMLXXXIV","George Orwell's novel"],
                    ["2000","MM","Millennium"],
                    ["2024","MMXXIV","Paris Olympics"],
                    ["Super Bowl LVIII","58","2024 Championship Game"],
                    ["Chapter XIV","14","Common book/chapter numbering"],
                  ].map((row) => (
                    <tr key={row[0]} className="border-t border-border">
                      <td className="px-3 py-2 font-medium">{row[0]}</td>
                      <td className="px-3 py-2 font-mono font-bold text-[hsl(var(--calc-hue),80%,40%)] tracking-widest">{row[1]}</td>
                      <td className="px-3 py-2 text-muted-foreground text-xs">{row[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-muted-foreground mb-3">
              <strong>Roman numerals remain in active use today.</strong> You'll find them on clock faces, in film copyright notices (© MMXXIV), book preface page numbering, architectural cornerstones, and Super Bowl numbering. They convey a sense of tradition and formality.
            </p>
            <p className="text-muted-foreground mb-4">
              <strong>MCMLXXXVIII (1988)</strong> is often cited as one of the longest Roman numeral representations for a common year — 12 characters. Compare to MMXXIV (2024) which is much more compact, illustrating how different years vary greatly in length.
            </p>
            <blockquote className="border-l-4 border-[hsl(var(--calc-hue),80%,45%)] pl-4 italic text-muted-foreground bg-muted/30 rounded-r-xl py-3 pr-4">
              "Roman numerals are not just history — they're a living notation system used daily in contexts where tradition and formality matter."
            </blockquote>
          </div>

          {/* FAQ */}
          <div className="tool-calc-card">
            <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
            <div className="space-y-3">
              <FaqItem q="What is the largest number in Roman numerals?" a="The standard system goes up to 3,999 (MMMCMXCIX). Numbers beyond this require non-standard extensions like a vinculum (bar over a symbol to multiply by 1,000), but these are rarely used today." />
              <FaqItem q="Why don't Roman numerals have a zero?" a="Roman numerals developed from a tally system where there was no need to represent nothing. The concept of zero as a number was developed separately in India and introduced to Europe through Arabic mathematicians." />
              <FaqItem q="How do you write 4 in Roman numerals?" a="4 is written as IV (5 minus 1), not IIII. However, IIII is historically used on clock faces (to balance the visual weight of VIII on the opposite side) — one of the accepted exceptions to the standard rule." />
              <FaqItem q="Where are Roman numerals used today?" a="Clocks and watches, copyright years in films and TV, book chapter/page numbering, outlines and lists, architectural inscriptions, Super Bowl titles, movie sequels (Rocky II, Part III), and formal event naming." />
              <FaqItem q="Can Roman numerals represent decimals or fractions?" a="Not in the standard system. Ancient Romans did have a fraction system based on twelfths (the 'uncia'), but it's not used in the modern Roman numeral system and is rarely taught." />
              <FaqItem q="Why is 2024 written as MMXXIV not MMXXIIII?" a="Because of subtractive notation rules: IV represents 4 (5 minus 1) rather than IIII (four ones). This avoids repeating the same symbol more than three times in a row, which is a rule in standard Roman numeral notation." />
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-[hsl(var(--calc-hue),80%,45%)] to-[hsl(var(--calc-hue),70%,35%)] p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-2">Explore More Conversion Tools</h2>
            <p className="mb-5 opacity-90">Convert numbers, units, and formats with our complete toolkit.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/conversion/decimal-to-binary-converter" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-5 py-2.5 rounded-xl font-semibold transition-colors text-sm">Decimal to Binary</Link>
              <Link href="/conversion/hex-to-decimal-converter" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-5 py-2.5 rounded-xl font-semibold transition-colors text-sm">Hex to Decimal</Link>
            </div>
          </div>
        </section>

        <aside className="space-y-5">
          <div className="sticky top-4 space-y-5">
            <div className="tool-calc-card p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Related Tools</p>
              <div className="space-y-1.5 text-sm">
                {[
                  ["/conversion/decimal-to-binary-converter", "Decimal to Binary"],
                  ["/conversion/hex-to-decimal-converter", "Hex to Decimal"],
                  ["/conversion/binary-to-decimal-converter", "Binary to Decimal"],
                  ["/math/online-scientific-calculator", "Scientific Calculator"],
                  ["/conversion/data-storage-converter", "Data Storage Converter"],
                ].map(([href, label]) => (
                  <Link key={href} href={href} className="flex items-center gap-2 py-1 text-muted-foreground hover:text-foreground transition-colors">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[hsl(var(--calc-hue),80%,45%)] shrink-0" />{label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="tool-calc-card p-4">
              <div className="space-y-2 text-xs text-muted-foreground">
                {["Both directions", "Symbol breakdown", "Full reference chart", "Free, no login"].map((t) => (
                  <div key={t} className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />{t}</div>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
