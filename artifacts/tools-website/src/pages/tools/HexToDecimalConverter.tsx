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

function addBinarySpaces(bin: string): string {
  const padded = bin.padStart(Math.ceil(bin.length / 4) * 4, "0");
  return padded.match(/.{1,4}/g)?.join(" ") ?? bin;
}

const HEX_DIGITS: [string, number][] = [
  ["0",0],["1",1],["2",2],["3",3],["4",4],["5",5],["6",6],["7",7],
  ["8",8],["9",9],["A",10],["B",11],["C",12],["D",13],["E",14],["F",15],
];

type InputMode = "hex" | "decimal" | "binary";

export default function HexToDecimalConverter() {
  const [mode, setMode] = useState<InputMode>("hex");
  const [input, setInput] = useState("FF");

  const result = useMemo(() => {
    const trimmed = input.trim().replace(/\s/g, "").toUpperCase();
    if (!trimmed) return null;
    let decimal: number | null = null;
    switch (mode) {
      case "hex": { const v = parseInt(trimmed, 16); decimal = isNaN(v) ? null : v; break; }
      case "decimal": { const v = parseInt(trimmed, 10); decimal = isNaN(v) || !Number.isInteger(v) ? null : v; break; }
      case "binary": { const v = parseInt(trimmed, 2); decimal = isNaN(v) ? null : v; break; }
    }
    if (decimal === null || decimal < 0) return null;
    const hex = decimal.toString(16).toUpperCase();
    const binary = decimal.toString(2);
    const octal = decimal.toString(8);
    const binaryGrouped = addBinarySpaces(binary);
    return { decimal, hex, binary: binaryGrouped, octal, bits: binary.length };
  }, [input, mode]);

  return (
    <div style={{ "--calc-hue": "280" } as React.CSSProperties} className="min-h-screen bg-background">
      <SEO
        title="Hex to Decimal Converter — Convert Hexadecimal to Decimal Numbers"
        description="Convert hexadecimal to decimal, binary, and octal instantly. Free online hex to decimal converter with full number base reference and step-by-step explanations."
      />

      <nav className="max-w-6xl mx-auto px-4 pt-4 pb-0 text-sm text-muted-foreground flex gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <span>/</span>
        <Link href="/category/conversion" className="hover:text-foreground transition-colors">Conversion Tools</Link>
        <span>/</span>
        <span className="text-foreground font-medium">Hex to Decimal Converter</span>
      </nav>

      <header className="max-w-6xl mx-auto px-4 pt-6 pb-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[hsl(var(--calc-hue),70%,60%)] bg-[hsl(var(--calc-hue),80%,95%)] dark:bg-[hsl(var(--calc-hue),40%,20%)] px-3 py-1 rounded-full mb-3">
          Conversion Tools
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3">Hex to Decimal Converter</h1>
        <div className="flex flex-wrap gap-2 mb-4">
          {["Free", "All Bases", "Step-by-Step", "No Signup"].map((b) => (
            <span key={b} className="text-xs bg-muted text-muted-foreground px-2.5 py-1 rounded-full font-medium">{b}</span>
          ))}
        </div>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Convert hexadecimal numbers to decimal, binary, and octal instantly. Includes a full hex digit reference table and step-by-step positional value breakdowns.
        </p>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <section className="lg:col-span-3 space-y-6">
          <div className="tool-calc-card">
            <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-[hsl(var(--calc-hue),70%,60%)]" />
              Number Base Converter
            </h2>

            <div className="flex gap-1.5 flex-wrap mb-5 p-1 bg-muted rounded-xl">
              {(["hex", "decimal", "binary"] as InputMode[]).map((m) => (
                <button key={m} onClick={() => { setMode(m); setInput(""); }}
                  className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all capitalize ${mode === m ? "bg-[hsl(var(--calc-hue),70%,60%)] text-white shadow" : "text-muted-foreground hover:text-foreground"}`}>
                  {m === "hex" ? "Hexadecimal" : m.charAt(0).toUpperCase() + m.slice(1)}
                </button>
              ))}
            </div>

            <div className="mb-6">
              <label className="tool-calc-label">
                {mode === "hex" ? "Hexadecimal Value (e.g. FF, 2A, 1B3F)" : mode === "decimal" ? "Decimal Number" : "Binary Number"}
              </label>
              <input className="tool-calc-input font-mono uppercase" type="text" value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={mode === "hex" ? "FF" : mode === "decimal" ? "255" : "11111111"} />
              <p className="text-xs text-muted-foreground mt-1">
                {mode === "hex" ? "Valid characters: 0–9, A–F (case insensitive)" : mode === "decimal" ? "Digits 0–9" : "Digits 0–1"}
              </p>
            </div>

            {result ? (
              <AnimatePresence mode="wait">
                <motion.div key={`${input}-${mode}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Hexadecimal", value: "0x" + result.hex, sub: "(Base 16)", highlight: mode === "hex" },
                      { label: "Decimal", value: result.decimal.toString(), sub: "(Base 10)", highlight: mode === "decimal" },
                      { label: "Binary", value: result.binary, sub: `(${result.bits} bits)`, highlight: mode === "binary" },
                      { label: "Octal", value: result.octal, sub: "(Base 8)", highlight: false },
                    ].map((c) => (
                      <div key={c.label} className={`tool-calc-result ${c.highlight ? "ring-2 ring-[hsl(var(--calc-hue),70%,60%)] ring-offset-1" : ""}`}>
                        <p className="text-xs text-muted-foreground mb-1">{c.label} <span className="opacity-70">{c.sub}</span></p>
                        <p className="tool-calc-number text-xl font-bold font-mono break-all">{c.value}</p>
                        {c.highlight && <span className="text-xs text-[hsl(var(--calc-hue),70%,60%)] font-medium">← Input</span>}
                      </div>
                    ))}
                  </div>

                  {/* Hex digit reference for the result */}
                  {mode === "hex" && (
                    <div className="bg-muted/30 rounded-xl p-4">
                      <p className="text-sm font-semibold mb-2">Positional breakdown of {result.hex}:</p>
                      <div className="flex flex-wrap gap-3">
                        {input.trim().replace(/\s/g, "").toUpperCase().split("").map((ch, i, arr) => {
                          const pos = arr.length - 1 - i;
                          const val = parseInt(ch, 16) * Math.pow(16, pos);
                          return (
                            <div key={i} className="text-center text-xs">
                              <div className="w-10 h-10 rounded-lg bg-[hsl(var(--calc-hue),70%,60%)] text-white font-mono font-bold flex items-center justify-center text-lg">{ch}</div>
                              <div className="mt-1 text-muted-foreground">16^{pos}</div>
                              <div className="font-semibold">{val}</div>
                            </div>
                          );
                        })}
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">Sum = {result.decimal}</p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                <Calculator className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p>Enter a value to convert between number bases.</p>
              </div>
            )}
          </div>

          {/* Hex digit reference table */}
          <div className="tool-calc-card">
            <h2 className="text-xl font-bold mb-4">Hex Digit Reference Table</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    {["Hex","Decimal","Binary","Hex","Decimal","Binary"].map((h,i) => (
                      <th key={i} className="px-3 py-2 text-left font-semibold text-muted-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[0,1,2,3,4,5,6,7].map((i) => {
                    const left = HEX_DIGITS[i];
                    const right = HEX_DIGITS[i + 8];
                    return (
                      <tr key={i} className="border-t border-border">
                        <td className="px-3 py-1.5 font-mono font-bold text-[hsl(var(--calc-hue),70%,60%)]">{left[0]}</td>
                        <td className="px-3 py-1.5">{left[1]}</td>
                        <td className="px-3 py-1.5 font-mono text-xs">{left[1].toString(2).padStart(4,"0")}</td>
                        <td className="px-3 py-1.5 font-mono font-bold text-[hsl(var(--calc-hue),70%,60%)]">{right[0]}</td>
                        <td className="px-3 py-1.5">{right[1]}</td>
                        <td className="px-3 py-1.5 font-mono text-xs">{right[1].toString(2).padStart(4,"0")}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* How to Use */}
          <div className="tool-calc-card">
            <h2 className="text-xl font-bold mb-4">How to Convert Hex to Decimal</h2>
            <p className="text-muted-foreground mb-3">To convert a hex number manually, multiply each digit by its positional value (a power of 16) and sum:</p>
            <div className="bg-muted/40 rounded-xl p-4 font-mono text-sm mb-4">
              <p className="font-semibold text-foreground mb-2">Example: 0x2A → Decimal</p>
              <p className="text-[hsl(var(--calc-hue),60%,50%)]">2 × 16¹ = 2 × 16 = 32</p>
              <p className="text-[hsl(var(--calc-hue),60%,50%)]">A × 16⁰ = 10 × 1 = 10</p>
              <p className="font-bold mt-1">32 + 10 = 42</p>
            </div>
            <p className="text-muted-foreground mb-3">
              <strong>Working backwards</strong> (decimal to hex): divide the decimal by 16 repeatedly, recording remainders (0–15, using A–F for 10–15). Read the remainders bottom to top for the hex result.
            </p>
          </div>

          {/* Understanding Results */}
          <div className="tool-calc-card">
            <h2 className="text-xl font-bold mb-4">Understanding Hexadecimal</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { title: "Why Base 16?", desc: "One hex digit = exactly 4 binary bits. This makes hex a compact, human-readable way to express binary data without the verbosity of long bit strings.", color: "border-l-purple-500" },
                { title: "Colors in Web Design", desc: "#RRGGBB format uses two hex digits per channel. #FF5733 = R:255, G:87, B:51. Understanding hex helps you read and manipulate CSS colors directly.", color: "border-l-blue-500" },
                { title: "Memory Addresses", desc: "Debuggers and hex editors display memory addresses in hex (e.g., 0x7FFF5FBFF8A0). Each pair of hex digits represents one byte of data.", color: "border-l-amber-500" },
                { title: "Bitmask Operations", desc: "Programmers use hex to define bitmasks clearly. 0xFF = 11111111₂ masks the lowest 8 bits. 0x0F = 00001111₂ masks the lowest nibble.", color: "border-l-green-500" },
              ].map((c) => (
                <div key={c.title} className={`border-l-4 ${c.color} pl-4 py-2 bg-muted/30 rounded-r-xl`}>
                  <p className="font-semibold mb-1">{c.title}</p>
                  <p className="text-sm text-muted-foreground">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div className="tool-calc-card">
            <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
            <div className="space-y-3">
              <FaqItem q="What does the 0x prefix mean?" a="The 0x prefix is a programming convention that indicates a hexadecimal literal. So 0xFF means hex FF (decimal 255), not the number 0 multiplied by xFF. It's used in C, Python, JavaScript, and most other languages." />
              <FaqItem q="How many digits can a hex number have?" a="Theoretically unlimited. In practice, 2 hex digits = 1 byte (0–255), 4 hex digits = 2 bytes (0–65535), 8 hex digits = 4 bytes (0–4,294,967,295). IPv6 addresses use 32 hex digits." />
              <FaqItem q="Are hex letters case-sensitive?" a="No. 0xFF, 0Xff, and 0XFF all mean the same thing. By convention, uppercase (A–F) is preferred in most systems, but lowercase is equally valid and common in web color codes (#ffffff vs #FFFFFF)." />
              <FaqItem q="How do I read a hex color code?" a="A 6-digit hex color #RRGGBB has two hex digits per channel. #00 = 0 (none), #FF = 255 (maximum). Example: #FF0000 = R:255, G:0, B:0 = pure red. #808080 = R:128, G:128, B:128 = medium gray." />
              <FaqItem q="What's a nibble vs a byte?" a="A nibble is 4 bits = one hex digit. A byte is 8 bits = two hex digits. So 0xFF is one byte (two nibbles), and 0xFFFF is two bytes (four nibbles)." />
              <FaqItem q="Why is hexadecimal used in networking?" a="MAC addresses (e.g., 00:1A:2B:3C:4D:5E) and IPv6 addresses use hex for compact representation of binary network identifiers. Two hex digits cleanly represent each octet (byte) of a network address." />
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-[hsl(var(--calc-hue),70%,60%)] to-[hsl(var(--calc-hue),60%,45%)] p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-2">Explore More Converters</h2>
            <p className="mb-5 opacity-90">Complete your number base toolkit with our related converters.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/conversion/decimal-to-binary-converter" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-5 py-2.5 rounded-xl font-semibold transition-colors text-sm">Decimal to Binary</Link>
              <Link href="/css-design/hex-to-rgb-converter" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-5 py-2.5 rounded-xl font-semibold transition-colors text-sm">Hex to RGB</Link>
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
                  ["/conversion/binary-to-decimal-converter", "Binary to Decimal"],
                  ["/conversion/roman-numeral-converter", "Roman Numeral Converter"],
                  ["/css-design/hex-to-rgb-converter", "Hex to RGB Converter"],
                  ["/math/online-scientific-calculator", "Scientific Calculator"],
                ].map(([href, label]) => (
                  <Link key={href} href={href} className="flex items-center gap-2 py-1 text-muted-foreground hover:text-foreground transition-colors">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[hsl(var(--calc-hue),70%,60%)] shrink-0" />{label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="tool-calc-card p-4">
              <div className="space-y-2 text-xs text-muted-foreground">
                {["All 4 bases shown", "Positional breakdown", "Free, no login", "No data stored"].map((t) => (
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
