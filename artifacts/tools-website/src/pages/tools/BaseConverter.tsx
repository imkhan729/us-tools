import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, CheckCircle2, Hash } from "lucide-react";
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

const DIGITS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function isValidInBase(s: string, base: number): boolean {
  const valid = DIGITS.slice(0, base);
  return s.toUpperCase().split("").every(c => valid.includes(c));
}

function convertBase(value: string, fromBase: number, toBase: number): string {
  const clean = value.trim().toUpperCase().replace(/\s/g, "");
  if (!clean) return "";
  if (!isValidInBase(clean, fromBase)) return "Invalid";
  const decimal = parseInt(clean, fromBase);
  if (isNaN(decimal) || decimal < 0) return "Invalid";
  return decimal.toString(toBase).toUpperCase();
}

const PRESET_BASES = [2, 8, 10, 16, 32, 36];
const BASE_NAMES: Record<number, string> = { 2: "Binary", 8: "Octal", 10: "Decimal", 16: "Hexadecimal", 32: "Base-32", 36: "Base-36" };

export default function BaseConverter() {
  const [input, setInput] = useState("255");
  const [fromBase, setFromBase] = useState(10);
  const [toBase, setToBase] = useState(16);
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

  const effectiveFrom = customFrom ? parseInt(customFrom) || fromBase : fromBase;
  const effectiveTo = customTo ? parseInt(customTo) || toBase : toBase;

  const result = useMemo(() => {
    if (!input.trim()) return null;
    const output = convertBase(input, effectiveFrom, effectiveTo);
    if (output === "Invalid") return { error: `"${input}" is not valid in base ${effectiveFrom}.` };
    const decimal = parseInt(input.trim(), effectiveFrom);
    const binary = isNaN(decimal) ? "" : decimal.toString(2);
    const hex = isNaN(decimal) ? "" : decimal.toString(16).toUpperCase();
    return { output, decimal: isNaN(decimal) ? null : decimal, binary, hex };
  }, [input, effectiveFrom, effectiveTo]);

  const allBases = useMemo(() => {
    if (!input.trim()) return null;
    const decimal = parseInt(input.trim().toUpperCase(), effectiveFrom);
    if (isNaN(decimal) || decimal < 0) return null;
    return PRESET_BASES.map(b => ({ base: b, name: BASE_NAMES[b] ?? `Base-${b}`, value: decimal.toString(b).toUpperCase() }));
  }, [input, effectiveFrom]);

  return (
    <div style={{ "--calc-hue": "185" } as React.CSSProperties} className="min-h-screen bg-background">
      <SEO
        title="Base Converter — Convert Numbers Between Any Bases (2-36)"
        description="Convert numbers between any number base from 2 to 36. Includes binary, octal, decimal, hex, base-32, and base-36 with instant simultaneous conversion."
      />
      <nav className="max-w-6xl mx-auto px-4 pt-4 pb-0 text-sm text-muted-foreground flex gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link><span>/</span>
        <Link href="/category/conversion" className="hover:text-foreground transition-colors">Conversion Tools</Link><span>/</span>
        <span className="text-foreground font-medium">Base Converter</span>
      </nav>
      <header className="max-w-6xl mx-auto px-4 pt-6 pb-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[hsl(var(--calc-hue),70%,45%)] bg-[hsl(var(--calc-hue),80%,95%)] dark:bg-[hsl(var(--calc-hue),40%,20%)] px-3 py-1 rounded-full mb-3">Conversion Tools</div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3">Base Converter</h1>
        <div className="flex flex-wrap gap-2 mb-4">
          {["Free","Any Base 2–36","All Common Bases","No Signup"].map(b => <span key={b} className="text-xs bg-muted text-muted-foreground px-2.5 py-1 rounded-full font-medium">{b}</span>)}
        </div>
        <p className="text-muted-foreground text-lg max-w-2xl">Convert numbers between any base from 2 (binary) to 36. See all common bases at once — binary, octal, decimal, hex, base-32, and base-36.</p>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <section className="lg:col-span-3 space-y-6">
          <div className="tool-calc-card">
            <h2 className="text-xl font-bold mb-5 flex items-center gap-2"><Hash className="w-5 h-5 text-[hsl(var(--calc-hue),70%,45%)]" />Number Base Converter</h2>

            <div className="grid sm:grid-cols-2 gap-4 mb-5">
              <div>
                <label className="tool-calc-label">Input Value</label>
                <input className="tool-calc-input font-mono uppercase" type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="255" />
              </div>
              <div>
                <label className="tool-calc-label">From Base</label>
                <div className="flex gap-2">
                  <select className="tool-calc-input flex-1" value={fromBase} onChange={(e) => { setFromBase(Number(e.target.value)); setCustomFrom(""); }}>
                    {[2,4,8,10,12,16,32,36].map(b => <option key={b} value={b}>{b} — {BASE_NAMES[b] ?? `Base ${b}`}</option>)}
                  </select>
                  <input className="tool-calc-input w-20" type="number" min="2" max="36" placeholder="Custom" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)} title="Custom base" />
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="tool-calc-label">To Base</label>
              <div className="flex gap-2">
                <select className="tool-calc-input flex-1" value={toBase} onChange={(e) => { setToBase(Number(e.target.value)); setCustomTo(""); }}>
                  {[2,4,8,10,12,16,32,36].map(b => <option key={b} value={b}>{b} — {BASE_NAMES[b] ?? `Base ${b}`}</option>)}
                </select>
                <input className="tool-calc-input w-20" type="number" min="2" max="36" placeholder="Custom" value={customTo} onChange={(e) => setCustomTo(e.target.value)} title="Custom base" />
              </div>
            </div>

            {result ? (
              <AnimatePresence mode="wait">
                <motion.div key={`${input}-${effectiveFrom}-${effectiveTo}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="space-y-4">
                  {"error" in result ? (
                    <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">{result.error}</div>
                  ) : (
                    <>
                      <div className="bg-gradient-to-br from-[hsl(var(--calc-hue),70%,45%)] to-[hsl(var(--calc-hue),60%,35%)] rounded-2xl p-5 text-white">
                        <p className="text-sm opacity-80 mb-1">Base {effectiveFrom} → Base {effectiveTo}</p>
                        <p className="text-4xl font-extrabold font-mono break-all">{result.output}</p>
                        {result.decimal !== null && <p className="text-sm opacity-75 mt-1">Decimal value: {result.decimal.toLocaleString()}</p>}
                      </div>

                      {allBases && (
                        <div>
                          <p className="font-semibold mb-2 text-sm">All common bases:</p>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {allBases.map(r => (
                              <div key={r.base} className="tool-calc-result">
                                <p className="text-xs text-muted-foreground mb-1">Base {r.base} — {r.name}</p>
                                <p className="tool-calc-number text-base font-bold font-mono">{r.value}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="text-center py-10 text-muted-foreground"><Hash className="w-10 h-10 mx-auto mb-2 opacity-30" /><p>Enter a number to convert between bases.</p></div>
            )}
          </div>

          <div className="tool-calc-card">
            <h2 className="text-xl font-bold mb-4">Number Base Reference</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { title: "Binary (Base 2)", desc: "Digits: 0, 1. The fundamental language of computers. Every number, character, and instruction is ultimately stored as binary.", color: "border-l-blue-500" },
                { title: "Octal (Base 8)", desc: "Digits: 0–7. One octal digit = 3 bits. Used historically in Unix file permissions (chmod 755).", color: "border-l-green-500" },
                { title: "Hexadecimal (Base 16)", desc: "Digits: 0–9, A–F. One hex digit = 4 bits. Used for colors (#FF5733), memory addresses, and binary shorthand.", color: "border-l-amber-500" },
                { title: "Base 36", desc: "Uses 0–9 and A–Z. Maximally compact for alphanumeric strings. Used in URL shorteners and identifier systems (1 + 26 = 36 chars).", color: "border-l-purple-500" },
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
              <FaqItem q="What is a number base?" a="A number base (or radix) determines how many unique digits are available. Base 10 (decimal) uses 0–9. Base 2 (binary) uses 0–1. Base 16 (hex) uses 0–9 and A–F. Position values are powers of the base." />
              <FaqItem q="How do you convert between any two bases?" a="The universal method: first convert from the source base to decimal (using positional multiplication), then convert from decimal to the target base (using repeated division). This tool does both steps automatically." />
              <FaqItem q="What base does JavaScript use internally?" a="JavaScript (and most languages) uses base 10 for display but stores numbers as 64-bit IEEE 754 floating-point binary internally. parseInt(str, base) and (n).toString(base) handle explicit base conversions." />
              <FaqItem q="What is base-36 used for?" a="Base-36 is the most compact positional system using standard alphanumeric characters (0–9, A–Z without case). Used for URL shorteners, unique identifiers, and timestamps in compact formats. 1 million in decimal = 'LFLS' in base-36." />
              <FaqItem q="What digits are valid in base 32?" a="Base-32 uses 0–9 and A–V (10 digits + 22 letters = 32). Various base-32 encoding schemes exist (Crockford, RFC 4648) with slight variations. This converter uses the 0–9, A–V convention." />
              <FaqItem q="Can you convert negative numbers or fractions?" a="This converter handles non-negative integers only. Negative numbers in binary use two's complement in practice (not a simple sign bit). Fractional bases work differently and require separate handling." />
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-[hsl(var(--calc-hue),70%,45%)] to-[hsl(var(--calc-hue),60%,33%)] p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-2">More Number Converters</h2>
            <p className="mb-5 opacity-90">Decimal to binary, hex to decimal, Roman numerals, and more.</p>
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
                {[["/conversion/decimal-to-binary-converter","Decimal to Binary"],["/conversion/hex-to-decimal-converter","Hex to Decimal"],["/conversion/roman-numeral-converter","Roman Numerals"],["/conversion/number-to-words-converter","Number to Words"],["/math/online-scientific-calculator","Scientific Calculator"]].map(([href, label]) => (
                  <Link key={href} href={href} className="flex items-center gap-2 py-1 text-muted-foreground hover:text-foreground transition-colors">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[hsl(var(--calc-hue),70%,45%)] shrink-0" />{label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="tool-calc-card p-4">
              <div className="space-y-2 text-xs text-muted-foreground">
                {["Any base 2–36","All common bases shown","Free, no login","No data stored"].map(t => (
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
