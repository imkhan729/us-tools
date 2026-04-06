import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, CheckCircle2, Type } from "lucide-react";
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

// ─── Number to Words engine ──────────────────────────────────────────────────
const ones = ["","one","two","three","four","five","six","seven","eight","nine",
  "ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen"];
const tens = ["","","twenty","thirty","forty","fifty","sixty","seventy","eighty","ninety"];

function hundredsToWords(n: number): string {
  if (n === 0) return "";
  if (n < 20) return ones[n];
  if (n < 100) return tens[Math.floor(n/10)] + (n % 10 ? "-" + ones[n % 10] : "");
  return ones[Math.floor(n/100)] + " hundred" + (n % 100 ? " " + hundredsToWords(n % 100) : "");
}

const magnitudes = ["","thousand","million","billion","trillion","quadrillion"];

function numberToWords(n: number): string {
  if (!Number.isFinite(n)) return "Not a number";
  if (n === 0) return "zero";
  const negative = n < 0;
  let abs = Math.abs(Math.trunc(n));
  if (abs > 999999999999999) return "Number too large (max: 999 quadrillion)";
  const parts: string[] = [];
  let mag = 0;
  while (abs > 0) {
    const chunk = abs % 1000;
    if (chunk !== 0) {
      const words = hundredsToWords(chunk) + (magnitudes[mag] ? " " + magnitudes[mag] : "");
      parts.unshift(words);
    }
    abs = Math.floor(abs / 1000);
    mag++;
  }
  const result = parts.join(", ");
  return (negative ? "negative " : "") + result;
}

// ─── currency variant ─────────────────────────────────────────────────────────
function numberToCurrency(n: number, currency = "dollar"): string {
  if (!Number.isFinite(n)) return "";
  const dollars = Math.trunc(Math.abs(n));
  const cents = Math.round((Math.abs(n) - dollars) * 100);
  const neg = n < 0 ? "negative " : "";
  const dPart = numberToWords(dollars) + " " + (dollars === 1 ? currency : currency + "s");
  if (cents === 0) return neg + dPart + " only";
  const cPart = numberToWords(cents) + " " + (cents === 1 ? "cent" : "cents");
  return neg + dPart + " and " + cPart + " only";
}

// ─── ordinal variant ──────────────────────────────────────────────────────────
function toOrdinal(n: number): string {
  const words = numberToWords(n);
  if (words.endsWith("one")) return words.slice(0,-3) + "first";
  if (words.endsWith("two")) return words.slice(0,-3) + "second";
  if (words.endsWith("three")) return words.slice(0,-5) + "third";
  if (words.endsWith("t")) return words + "h";
  if (words.endsWith("e")) return words + "th";
  if (words.endsWith("y")) return words.slice(0,-1) + "ieth";
  return words + "th";
}

export default function NumberToWordsConverter() {
  const [input, setInput] = useState("1234567");
  const [mode, setMode] = useState<"words" | "currency" | "ordinal">("words");
  const [currency, setCurrency] = useState("dollar");

  const result = useMemo(() => {
    const trimmed = input.trim();
    if (!trimmed) return null;
    const n = parseFloat(trimmed);
    if (isNaN(n)) return { error: "Please enter a valid number." };
    switch (mode) {
      case "words": return { output: numberToWords(n) };
      case "currency": return { output: numberToCurrency(n, currency) };
      case "ordinal": {
        const int = Math.trunc(n);
        if (int <= 0) return { error: "Ordinals require a positive integer." };
        return { output: toOrdinal(int) };
      }
    }
  }, [input, mode, currency]);

  return (
    <div style={{ "--calc-hue": "340" } as React.CSSProperties} className="min-h-screen bg-background">
      <SEO
        title="Number to Words Converter — Convert Numbers to English Words"
        description="Convert any number to its English word representation. Supports standard, currency (check writing), and ordinal formats. Free online number to words converter."
      />
      <nav className="max-w-6xl mx-auto px-4 pt-4 pb-0 text-sm text-muted-foreground flex gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link><span>/</span>
        <Link href="/category/conversion" className="hover:text-foreground transition-colors">Conversion Tools</Link><span>/</span>
        <span className="text-foreground font-medium">Number to Words Converter</span>
      </nav>
      <header className="max-w-6xl mx-auto px-4 pt-6 pb-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[hsl(var(--calc-hue),65%,55%)] bg-[hsl(var(--calc-hue),80%,95%)] dark:bg-[hsl(var(--calc-hue),40%,20%)] px-3 py-1 rounded-full mb-3">Conversion Tools</div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3">Number to Words Converter</h1>
        <div className="flex flex-wrap gap-2 mb-4">
          {["Free","Standard, Currency & Ordinal","Up to Quadrillions","No Signup"].map(b => <span key={b} className="text-xs bg-muted text-muted-foreground px-2.5 py-1 rounded-full font-medium">{b}</span>)}
        </div>
        <p className="text-muted-foreground text-lg max-w-2xl">Convert any number to English words — for check writing, legal documents, ordinal rankings, or learning number names. Supports numbers up to 999 quadrillion.</p>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <section className="lg:col-span-3 space-y-6">
          <div className="tool-calc-card">
            <h2 className="text-xl font-bold mb-5 flex items-center gap-2"><Type className="w-5 h-5 text-[hsl(var(--calc-hue),65%,55%)]" />Number to Words</h2>

            <div className="flex gap-1.5 flex-wrap mb-5 p-1 bg-muted rounded-xl">
              {[["words","Standard"],["currency","Currency (Checks)"],["ordinal","Ordinal"]].map(([m, label]) => (
                <button key={m} onClick={() => setMode(m as "words"|"currency"|"ordinal")}
                  className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${mode === m ? "bg-[hsl(var(--calc-hue),65%,55%)] text-white shadow" : "text-muted-foreground hover:text-foreground"}`}>
                  {label}
                </button>
              ))}
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="tool-calc-label">Enter Number</label>
                <input className="tool-calc-input" type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="1234567" />
              </div>
              {mode === "currency" && (
                <div>
                  <label className="tool-calc-label">Currency Name (singular)</label>
                  <input className="tool-calc-input" type="text" value={currency} onChange={(e) => setCurrency(e.target.value)} placeholder="dollar" />
                </div>
              )}
            </div>

            {result && (
              <AnimatePresence mode="wait">
                <motion.div key={`${input}-${mode}-${currency}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                  {"error" in result ? (
                    <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 text-red-600 rounded-xl px-4 py-3">{result.error}</div>
                  ) : (
                    <div className="bg-muted/30 rounded-xl p-5 border border-border">
                      <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider font-semibold">
                        {mode === "words" ? "In Words" : mode === "currency" ? "Check Format" : "Ordinal"}
                      </p>
                      <p className="text-lg font-semibold capitalize leading-relaxed">{result.output}</p>
                      <button
                        onClick={() => navigator.clipboard.writeText(result.output ?? "")}
                        className="mt-3 text-xs text-[hsl(var(--calc-hue),65%,55%)] hover:underline"
                      >
                        Copy to clipboard
                      </button>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            )}

            {/* Quick examples */}
            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Try these examples:</p>
              <div className="flex flex-wrap gap-2">
                {["0","1","13","100","1000","1000000","1234567","999999999999999"].map(n => (
                  <button key={n} onClick={() => setInput(n)}
                    className="text-xs bg-muted hover:bg-muted/80 px-2.5 py-1 rounded-lg font-mono transition-colors">{n}</button>
                ))}
              </div>
            </div>
          </div>

          <div className="tool-calc-card">
            <h2 className="text-xl font-bold mb-4">Understanding Number Names</h2>
            <div className="overflow-x-auto mb-5">
              <table className="w-full text-sm border-collapse">
                <thead><tr className="bg-muted/50">{["Number","In Words","Zeros","Notes"].map(h => <th key={h} className="px-3 py-2 text-left font-semibold text-muted-foreground">{h}</th>)}</tr></thead>
                <tbody>
                  {[
                    ["1,000","one thousand","3",""],
                    ["1,000,000","one million","6","Used in everyday language"],
                    ["1,000,000,000","one billion","9","US English (short scale)"],
                    ["1,000,000,000,000","one trillion","12","Used in finance"],
                    ["1,000,000,000,000,000","one quadrillion","15","Maximum this tool handles"],
                  ].map(row => (
                    <tr key={row[0]} className="border-t border-border">
                      {row.map((cell, i) => <td key={i} className="px-3 py-1.5">{cell}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { title: "Check Writing Format", desc: "For writing checks, use the currency mode: 'One thousand two hundred thirty-four dollars and 56/100'. Always capitalize the first word.", color: "border-l-green-500" },
                { title: "Ordinal Numbers", desc: "Ordinals indicate position: first, second, third, fourth... Used in rankings, dates (January 1st), and lists.", color: "border-l-blue-500" },
                { title: "Short Scale (US)", desc: "This converter uses the US 'short scale' where billion = 10⁹. In some countries (UK historically), 'billion' meant 10¹² — always clarify in international contexts.", color: "border-l-amber-500" },
                { title: "Legal Documents", desc: "Contracts, wills, and official documents often spell out numbers to prevent tampering or misreading. This tool helps generate the correct word form for any amount.", color: "border-l-purple-500" },
              ].map(c => (
                <div key={c.title} className={`border-l-4 ${c.color} pl-4 py-2 bg-muted/30 rounded-r-xl`}>
                  <p className="font-semibold mb-1">{c.title}</p>
                  <p className="text-sm text-muted-foreground">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="tool-calc-card">
            <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
            <div className="space-y-3">
              <FaqItem q="How do you write a check amount in words?" a="Write the dollar amount in full words, then add 'and' followed by the cents as a fraction (e.g., '56/100'). Example: $1,234.56 = 'One thousand two hundred thirty-four and 56/100 dollars'. Always fill any remaining space with a line to prevent changes." />
              <FaqItem q="How do you spell 1,000,000?" a="One million. The word million is used for 10⁶. Other common large numbers: billion (10⁹), trillion (10¹²), quadrillion (10¹⁵)." />
              <FaqItem q="What comes after trillion?" a="In the US short scale: thousand (10³), million (10⁶), billion (10⁹), trillion (10¹²), quadrillion (10¹⁵), quintillion (10¹⁸), sextillion (10²¹), and so on." />
              <FaqItem q="Why does billion mean different things?" a="The US 'short scale' billion = 1,000 million (10⁹). The traditional British/European 'long scale' billion = 1,000,000 million (10¹²). Most countries now use the short scale, but this causes confusion in historical texts and some European languages." />
              <FaqItem q="What is an ordinal number?" a="An ordinal number describes the position of something in a sequence: first (1st), second (2nd), third (3rd), fourth (4th), etc. Compare with cardinal numbers which describe quantity: one, two, three." />
              <FaqItem q="How are numbers spelled in legal contracts?" a="In legal documents, both the numeral and word form are typically used: '$5,000 (five thousand dollars)'. This provides a double-check against transcription errors. When they conflict, the word form usually takes precedence." />
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-[hsl(var(--calc-hue),65%,55%)] to-[hsl(var(--calc-hue),55%,40%)] p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-2">More Conversion Tools</h2>
            <p className="mb-5 opacity-90">Explore our full toolkit for number and unit conversions.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/conversion/roman-numeral-converter" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-5 py-2.5 rounded-xl font-semibold transition-colors text-sm">Roman Numerals</Link>
              <Link href="/conversion/decimal-to-binary-converter" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-5 py-2.5 rounded-xl font-semibold transition-colors text-sm">Decimal to Binary</Link>
            </div>
          </div>
        </section>
        <aside className="space-y-5">
          <div className="sticky top-4 space-y-5">
            <div className="tool-calc-card p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Related Tools</p>
              <div className="space-y-1.5 text-sm">
                {[["/conversion/roman-numeral-converter","Roman Numeral Converter"],["/conversion/decimal-to-binary-converter","Decimal to Binary"],["/conversion/hex-to-decimal-converter","Hex to Decimal"],["/conversion/base-converter","Base Converter"],["/math/online-scientific-calculator","Scientific Calculator"]].map(([href, label]) => (
                  <Link key={href} href={href} className="flex items-center gap-2 py-1 text-muted-foreground hover:text-foreground transition-colors">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[hsl(var(--calc-hue),65%,55%)] shrink-0" />{label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="tool-calc-card p-4">
              <div className="space-y-2 text-xs text-muted-foreground">
                {["Standard, currency & ordinal","Up to quadrillions","Copy to clipboard","Free, no login"].map(t => (
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
