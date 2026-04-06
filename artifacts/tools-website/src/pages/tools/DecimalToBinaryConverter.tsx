import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  Binary,
  CheckCircle2,
  Info,
  Calculator,
  ArrowRight,
} from "lucide-react";
import { SEO } from "../../components/SEO";
import { Link } from "wouter";

// ─── helpers ────────────────────────────────────────────────────────────────
function toBase(n: number, base: number): string {
  if (!Number.isInteger(n) || n < 0) return "N/A";
  return n.toString(base).toUpperCase();
}

function fromBase(s: string, base: number): number | null {
  const v = parseInt(s.trim(), base);
  return isNaN(v) ? null : v;
}

function addBinarySpaces(bin: string): string {
  // Group into nibbles from right
  const padded = bin.padStart(Math.ceil(bin.length / 4) * 4, "0");
  return padded.match(/.{1,4}/g)?.join(" ") ?? bin;
}

// ─── FAQ accordion ──────────────────────────────────────────────────────────
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

// ─── step-by-step division display ──────────────────────────────────────────
function DivisionSteps({ decimal }: { decimal: number }) {
  if (decimal <= 0 || decimal > 65535) return null;
  const steps: { quotient: number; remainder: number }[] = [];
  let n = decimal;
  while (n > 0) {
    steps.push({ quotient: Math.floor(n / 2), remainder: n % 2 });
    n = Math.floor(n / 2);
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-muted/50">
            <th className="px-3 py-2 text-left font-semibold text-muted-foreground">Divide by 2</th>
            <th className="px-3 py-2 text-left font-semibold text-muted-foreground">Quotient</th>
            <th className="px-3 py-2 text-left font-semibold text-muted-foreground">Remainder (bit)</th>
          </tr>
        </thead>
        <tbody>
          {steps.map((s, i) => (
            <tr key={i} className="border-t border-border">
              <td className="px-3 py-1.5 font-mono">{i === 0 ? decimal : steps[i - 1].quotient} ÷ 2</td>
              <td className="px-3 py-1.5 font-mono">{s.quotient}</td>
              <td className="px-3 py-1.5 font-mono font-bold text-[hsl(var(--calc-hue),70%,45%)]">{s.remainder}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-xs text-muted-foreground mt-2">Read remainders from bottom to top → binary result</p>
    </div>
  );
}

type InputMode = "decimal" | "binary" | "hex" | "octal";

// ─── main component ─────────────────────────────────────────────────────────
export default function DecimalToBinaryConverter() {
  const [inputMode, setInputMode] = useState<InputMode>("decimal");
  const [inputValue, setInputValue] = useState("42");
  const [showSteps, setShowSteps] = useState(false);

  const result = useMemo(() => {
    const trimmed = inputValue.trim();
    if (!trimmed) return null;

    let decimal: number | null = null;
    switch (inputMode) {
      case "decimal": decimal = parseInt(trimmed, 10); if (isNaN(decimal)) decimal = null; break;
      case "binary": decimal = fromBase(trimmed.replace(/\s/g, ""), 2); break;
      case "hex": decimal = fromBase(trimmed, 16); break;
      case "octal": decimal = fromBase(trimmed, 8); break;
    }

    if (decimal === null || decimal < 0 || !Number.isInteger(decimal)) return null;

    const binary = toBase(decimal, 2);
    const hex = toBase(decimal, 16);
    const octal = toBase(decimal, 8);
    const binaryGrouped = addBinarySpaces(binary);
    const bits = binary.length;
    const byteCount = Math.ceil(bits / 8);

    return { decimal, binary, binaryGrouped, hex, octal, bits, byteCount };
  }, [inputValue, inputMode]);

  const modeConfig: Record<InputMode, { label: string; placeholder: string; hint: string }> = {
    decimal: { label: "Decimal Number", placeholder: "42", hint: "Digits 0–9" },
    binary: { label: "Binary Number", placeholder: "101010", hint: "Digits 0–1, spaces allowed" },
    hex: { label: "Hexadecimal Number", placeholder: "2A", hint: "Digits 0–9, A–F" },
    octal: { label: "Octal Number", placeholder: "52", hint: "Digits 0–7" },
  };

  const currentConfig = modeConfig[inputMode];

  return (
    <div style={{ "--calc-hue": "230" } as React.CSSProperties} className="min-h-screen bg-background">
      <SEO
        title="Decimal to Binary Converter — Convert Numbers to Binary Instantly"
        description="Convert decimal numbers to binary, hex, and octal. See step-by-step division method. Free online decimal to binary converter with full number base reference."
      />

      {/* Breadcrumb */}
      <nav className="max-w-6xl mx-auto px-4 pt-4 pb-0 text-sm text-muted-foreground flex gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <span>/</span>
        <Link href="/category/conversion" className="hover:text-foreground transition-colors">Conversion Tools</Link>
        <span>/</span>
        <span className="text-foreground font-medium">Decimal to Binary Converter</span>
      </nav>

      {/* Hero */}
      <header className="max-w-6xl mx-auto px-4 pt-6 pb-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[hsl(var(--calc-hue),70%,55%)] bg-[hsl(var(--calc-hue),80%,95%)] dark:bg-[hsl(var(--calc-hue),40%,20%)] px-3 py-1 rounded-full mb-3">
          Conversion Tools
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3">
          Decimal to Binary Converter
        </h1>
        <div className="flex flex-wrap gap-2 mb-4">
          {["Free", "Step-by-Step", "Hex & Octal Too", "No Signup"].map((b) => (
            <span key={b} className="text-xs bg-muted text-muted-foreground px-2.5 py-1 rounded-full font-medium">{b}</span>
          ))}
        </div>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Convert decimal numbers to binary, hexadecimal, and octal — and back again. Includes a step-by-step division method for learning how binary conversion works.
        </p>
      </header>

      {/* Main grid */}
      <main className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <section className="lg:col-span-3 space-y-6">
          <div className="tool-calc-card">
            <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
              <Binary className="w-5 h-5 text-[hsl(var(--calc-hue),70%,55%)]" />
              Number Base Converter
            </h2>

            {/* Input mode tabs */}
            <div className="flex gap-1.5 flex-wrap mb-5 p-1 bg-muted rounded-xl">
              {(["decimal", "binary", "hex", "octal"] as InputMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => { setInputMode(m); setInputValue(""); }}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all capitalize ${inputMode === m ? "bg-[hsl(var(--calc-hue),70%,55%)] text-white shadow" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {m === "hex" ? "Hexadecimal" : m.charAt(0).toUpperCase() + m.slice(1)}
                </button>
              ))}
            </div>

            <div className="mb-6">
              <label className="tool-calc-label">{currentConfig.label}</label>
              <input
                className="tool-calc-input font-mono"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={currentConfig.placeholder}
              />
              <p className="text-xs text-muted-foreground mt-1">{currentConfig.hint}</p>
            </div>

            {result ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${inputValue}-${inputMode}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {/* Results grid */}
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Decimal (Base 10)", value: result.decimal.toString(), highlight: inputMode === "decimal" },
                      { label: "Binary (Base 2)", value: result.binaryGrouped, mono: true, highlight: inputMode === "binary" },
                      { label: "Hexadecimal (Base 16)", value: result.hex, mono: true, highlight: inputMode === "hex" },
                      { label: "Octal (Base 8)", value: result.octal, mono: true, highlight: inputMode === "octal" },
                    ].map((c) => (
                      <div
                        key={c.label}
                        className={`tool-calc-result ${c.highlight ? "ring-2 ring-[hsl(var(--calc-hue),70%,55%)] ring-offset-1" : ""}`}
                      >
                        <p className="text-xs text-muted-foreground mb-1">{c.label}</p>
                        <p className={`tool-calc-number text-xl font-bold break-all ${c.mono ? "font-mono" : ""}`}>{c.value}</p>
                        {c.highlight && <span className="text-xs text-[hsl(var(--calc-hue),70%,55%)] font-medium">← Input</span>}
                      </div>
                    ))}
                  </div>

                  {/* Bit info */}
                  <div className="bg-muted/30 rounded-xl p-4 text-sm flex flex-wrap gap-4">
                    <div><span className="text-muted-foreground">Bits: </span><span className="font-semibold">{result.bits}</span></div>
                    <div><span className="text-muted-foreground">Bytes: </span><span className="font-semibold">{result.byteCount}</span></div>
                    <div><span className="text-muted-foreground">Binary: </span><span className="font-mono font-semibold">{result.binary}</span></div>
                    <div><span className="text-muted-foreground">0x</span><span className="font-mono font-semibold">{result.hex}</span></div>
                  </div>

                  {/* Step-by-step toggle */}
                  {result.decimal > 0 && result.decimal <= 65535 && (
                    <div>
                      <button
                        onClick={() => setShowSteps(!showSteps)}
                        className="flex items-center gap-2 text-sm font-semibold text-[hsl(var(--calc-hue),70%,55%)] hover:underline"
                      >
                        {showSteps ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        {showSteps ? "Hide" : "Show"} Step-by-Step Division Method
                      </button>
                      <AnimatePresence>
                        {showSteps && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden mt-3"
                          >
                            <div className="border border-border rounded-xl p-4">
                              <p className="font-semibold mb-3">Converting {result.decimal} to binary:</p>
                              <DivisionSteps decimal={result.decimal} />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                <Calculator className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p>Enter a number above to convert between bases.</p>
              </div>
            )}
          </div>

          {/* How to Use */}
          <div className="tool-calc-card">
            <h2 className="text-xl font-bold mb-4">How to Use This Converter</h2>
            <ol className="space-y-3">
              {[
                ["Select Input Base", "Choose whether you're entering decimal, binary, hexadecimal, or octal."],
                ["Type Your Number", "Enter the number using valid digits for the selected base."],
                ["View All Bases", "Results appear instantly in all four number systems simultaneously."],
                ["Step-by-Step", "Click 'Show Step-by-Step' to see the division method for binary conversion."],
              ].map(([step, desc], i) => (
                <li key={step} className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-[hsl(var(--calc-hue),70%,55%)] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                  <div><span className="font-semibold">{step}: </span><span className="text-muted-foreground">{desc}</span></div>
                </li>
              ))}
            </ol>
            <div className="mt-5 bg-muted/40 rounded-xl p-4 font-mono text-sm">
              <p className="font-semibold mb-2 text-foreground">Division Method (Decimal → Binary):</p>
              <div className="space-y-0.5">
                {[
                  ["42 ÷ 2 =", "21", "R 0"],
                  ["21 ÷ 2 =", "10", "R 1"],
                  ["10 ÷ 2 =", "5", "R 0"],
                  ["5 ÷ 2 =", "2", "R 1"],
                  ["2 ÷ 2 =", "1", "R 0"],
                  ["1 ÷ 2 =", "0", "R 1 ← MSB"],
                ].map(([div, q, r]) => (
                  <div key={div} className="flex gap-4 text-xs">
                    <span className="text-muted-foreground w-24">{div}</span>
                    <span className="w-8">{q}</span>
                    <span className="text-[hsl(var(--calc-hue),70%,55%)] font-bold">{r}</span>
                  </div>
                ))}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Result (read remainders bottom to top): <span className="font-bold text-foreground">101010</span></p>
            </div>
          </div>

          {/* Understanding Results */}
          <div className="tool-calc-card">
            <h2 className="text-xl font-bold mb-4">Understanding Number Bases</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { title: "Binary (Base 2)", desc: "Uses only 0 and 1. The native language of computers — every calculation, memory address, and instruction is ultimately binary.", color: "border-l-blue-500" },
                { title: "Decimal (Base 10)", desc: "Our everyday number system using digits 0–9. Convenient for humans, but not how computers store data internally.", color: "border-l-green-500" },
                { title: "Hexadecimal (Base 16)", desc: "Uses 0–9 and A–F. Compact way to represent binary data — one hex digit = exactly 4 binary bits (one nibble). Used in colors, memory addresses, and debugging.", color: "border-l-amber-500" },
                { title: "Octal (Base 8)", desc: "Uses digits 0–7. One octal digit represents 3 binary bits. Historically used in Unix file permissions (e.g., chmod 755).", color: "border-l-purple-500" },
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
            <h2 className="text-xl font-bold mb-4">Quick Reference: Common Conversions</h2>
            <div className="overflow-x-auto mb-5">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="px-3 py-2 text-left font-semibold">Decimal</th>
                    <th className="px-3 py-2 text-left font-semibold font-mono">Binary</th>
                    <th className="px-3 py-2 text-left font-semibold font-mono">Hex</th>
                    <th className="px-3 py-2 text-left font-semibold font-mono">Octal</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    [0, "0", "0", "0"],
                    [1, "1", "1", "1"],
                    [8, "1000", "8", "10"],
                    [10, "1010", "A", "12"],
                    [15, "1111", "F", "17"],
                    [16, "10000", "10", "20"],
                    [42, "101010", "2A", "52"],
                    [255, "1111 1111", "FF", "377"],
                    [256, "1 0000 0000", "100", "400"],
                  ].map((row) => (
                    <tr key={row[0]} className="border-t border-border">
                      <td className="px-3 py-2 font-medium">{row[0]}</td>
                      <td className="px-3 py-2 font-mono text-[hsl(var(--calc-hue),70%,55%)]">{row[1]}</td>
                      <td className="px-3 py-2 font-mono">{row[2]}</td>
                      <td className="px-3 py-2 font-mono">{row[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-muted-foreground mb-3">
              <strong>255 is a magic number in computing</strong> — it's the maximum value of an 8-bit unsigned integer (11111111 in binary, or 0xFF in hex). You'll encounter it in IPv4 subnet masks (255.255.255.0), color values (RGB 255), and permission bitmasks.
            </p>
            <p className="text-muted-foreground mb-3">
              <strong>Hexadecimal is a programmer's shorthand for binary.</strong> Since 16 = 2⁴, one hex character represents exactly four binary digits. This makes 0xFF trivially readable as 11111111 without counting individual bits.
            </p>
            <p className="text-muted-foreground mb-4">
              <strong>Powers of 2 are fundamental in computing:</strong> 1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024 (1 KB), 1048576 (1 MB). Recognizing these helps you quickly understand binary values in technical contexts.
            </p>

            <blockquote className="border-l-4 border-[hsl(var(--calc-hue),70%,55%)] pl-4 italic text-muted-foreground bg-muted/30 rounded-r-xl py-3 pr-4">
              "There are 10 types of people in the world: those who understand binary, and those who don't."
            </blockquote>
          </div>

          {/* Why Use This Tool */}
          <div className="tool-calc-card">
            <h2 className="text-xl font-bold mb-4">Why Use This Number Base Converter?</h2>
            <p className="text-muted-foreground mb-3">
              Computer science students learning binary, programmers debugging memory addresses, and network engineers working with subnet masks all need fast, reliable number base conversion. This tool converts between all four common bases simultaneously.
            </p>
            <p className="text-muted-foreground mb-3">
              The step-by-step division method makes this particularly useful for learning — not just getting answers but understanding why the conversion works. This is especially helpful for students taking introductory CS or digital systems courses.
            </p>
            <p className="text-muted-foreground mb-3">
              Web developers working with hex color codes, system administrators reading Linux file permissions in octal, or anyone inspecting raw bytes in binary format all benefit from a converter that shows all bases at once.
            </p>
            <p className="text-muted-foreground mb-3">
              The input mode flexibility means you can convert from any base to any other — type in binary and see decimal and hex, or enter a hex value and see the binary equivalent — without switching tools or doing mental math.
            </p>
            <p className="text-xs text-muted-foreground border border-border rounded-xl p-4 mt-2">
              <Info className="inline w-3.5 h-3.5 mr-1 mb-0.5" />
              <strong>Note:</strong> This converter handles non-negative integers only. Floating-point binary conversion and signed integers (two's complement) require separate handling.
            </p>
          </div>

          {/* FAQ */}
          <div className="tool-calc-card">
            <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
            <div className="space-y-3">
              <FaqItem q="How do you convert decimal to binary?" a="The repeated division method: divide the decimal by 2, record the remainder (0 or 1), then divide the quotient by 2 again. Repeat until the quotient is 0. Read the remainders from bottom to top to get the binary number." />
              <FaqItem q="Why do computers use binary?" a="Because electronic circuits have two stable states: on (1) and off (0). Binary naturally maps to these physical states. It also makes arithmetic logic simple and allows reliable data storage and transmission with minimal error." />
              <FaqItem q="What is the relationship between binary and hexadecimal?" a="Every 4 binary digits correspond to exactly 1 hexadecimal digit. So 1111 = F, 1010 = A, and 1111 1010 = FA. This makes hex a compact, readable shorthand for binary data." />
              <FaqItem q="How are hex colors represented in binary?" a="#FF5733 in RGB = R:255, G:87, B:51 = binary 11111111 01010111 00110011. Each channel is one byte (8 bits), giving 16,777,216 possible colors total (2²⁴)." />
              <FaqItem q="What does 'bit' and 'byte' mean?" a="A bit is a single binary digit (0 or 1) — the smallest unit of digital information. A byte is 8 bits. Common sizes: 1 KB = 1,024 bytes, 1 MB = 1,048,576 bytes, 1 GB = 1,073,741,824 bytes." />
              <FaqItem q="What is the largest number in binary with n bits?" a="An n-bit unsigned integer can hold values from 0 to 2ⁿ − 1. So 8 bits → 0 to 255, 16 bits → 0 to 65,535, 32 bits → 0 to 4,294,967,295." />
            </div>
          </div>

          {/* CTA */}
          <div className="rounded-2xl bg-gradient-to-br from-[hsl(var(--calc-hue),70%,55%)] to-[hsl(var(--calc-hue),60%,40%)] p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-2">Explore More Conversion Tools</h2>
            <p className="mb-5 opacity-90">Convert units, bases, and formats with our full conversion toolkit.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/conversion/binary-to-decimal-converter" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-5 py-2.5 rounded-xl font-semibold transition-colors text-sm">Binary to Decimal</Link>
              <Link href="/conversion/hex-to-rgb-converter" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-5 py-2.5 rounded-xl font-semibold transition-colors text-sm">Hex to RGB</Link>
            </div>
          </div>
        </section>

        {/* Sidebar */}
        <aside className="space-y-5">
          <div className="sticky top-4 space-y-5">
            <div className="tool-calc-card p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">On This Page</p>
              <nav className="space-y-1 text-sm">
                {["Calculator", "How to Use", "Understanding Results", "Quick Examples", "Why Use This Tool", "FAQ"].map((s) => (
                  <a key={s} href={`#${s.toLowerCase().replace(/ /g, "-")}`} className="block py-1 text-muted-foreground hover:text-foreground transition-colors">{s}</a>
                ))}
              </nav>
            </div>
            <div className="tool-calc-card p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Related Tools</p>
              <div className="space-y-1.5 text-sm">
                {[
                  ["/conversion/binary-to-decimal-converter", "Binary to Decimal"],
                  ["/css-design/hex-to-rgb-converter", "Hex to RGB Converter"],
                  ["/conversion/hex-to-decimal-converter", "Hex to Decimal"],
                  ["/conversion/roman-numeral-converter", "Roman Numeral Converter"],
                  ["/math/online-scientific-calculator", "Scientific Calculator"],
                ].map(([href, label]) => (
                  <Link key={href} href={href} className="flex items-center gap-2 py-1 text-muted-foreground hover:text-foreground transition-colors">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[hsl(var(--calc-hue),70%,55%)] shrink-0" />{label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="tool-calc-card p-4">
              <div className="space-y-2 text-xs text-muted-foreground">
                {["All 4 bases at once", "Step-by-step method", "Free to use, no login", "No data stored"].map((t) => (
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
