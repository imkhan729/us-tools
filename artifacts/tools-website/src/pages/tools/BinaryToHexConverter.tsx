import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, CheckCircle2, ArrowRight } from "lucide-react";
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
  const clean = bin.replace(/\s/g, "");
  const padded = clean.padStart(Math.ceil(clean.length / 4) * 4, "0");
  return padded.match(/.{1,4}/g)?.join(" ") ?? clean;
}

type Mode = "binToHex" | "hexToBin";

export default function BinaryToHexConverter() {
  const [mode, setMode] = useState<Mode>("binToHex");
  const [input, setInput] = useState("1010 1111");

  const result = useMemo(() => {
    const clean = input.trim().replace(/\s/g, "").toUpperCase();
    if (!clean) return null;
    if (mode === "binToHex") {
      if (!/^[01]+$/.test(clean)) return { error: "Binary numbers can only contain 0 and 1." };
      const dec = parseInt(clean, 2);
      if (isNaN(dec)) return { error: "Invalid binary input." };
      const hex = dec.toString(16).toUpperCase();
      const decimal = dec;
      const octal = dec.toString(8);
      const nibbles = addBinarySpaces(clean).split(" ");
      const nibbleMap = nibbles.map(n => ({ bin: n.padStart(4,"0"), hex: parseInt(n,2).toString(16).toUpperCase() }));
      return { hex, decimal, octal, binary: addBinarySpaces(clean), nibbleMap };
    } else {
      if (!/^[0-9A-F]+$/.test(clean)) return { error: "Hex numbers can only contain 0–9 and A–F." };
      const dec = parseInt(clean, 16);
      if (isNaN(dec)) return { error: "Invalid hex input." };
      const binary = dec.toString(2);
      const decimal = dec;
      const octal = dec.toString(8);
      const hexChars = clean.split("").map(h => ({ hex: h, bin: parseInt(h,16).toString(2).padStart(4,"0") }));
      return { binary: addBinarySpaces(binary), decimal, octal, hex: clean, hexChars };
    }
  }, [input, mode]);

  return (
    <div style={{ "--calc-hue": "245" } as React.CSSProperties} className="min-h-screen bg-background">
      <SEO
        title="Binary to Hex Converter — Convert Binary to Hexadecimal Instantly"
        description="Convert binary to hexadecimal or hex to binary with a nibble-by-nibble breakdown. Free online binary to hex converter with complete reference table."
      />
      <nav className="max-w-6xl mx-auto px-4 pt-4 pb-0 text-sm text-muted-foreground flex gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link><span>/</span>
        <Link href="/category/conversion" className="hover:text-foreground transition-colors">Conversion Tools</Link><span>/</span>
        <span className="text-foreground font-medium">Binary to Hex Converter</span>
      </nav>
      <header className="max-w-6xl mx-auto px-4 pt-6 pb-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[hsl(var(--calc-hue),65%,62%)] bg-[hsl(var(--calc-hue),80%,95%)] dark:bg-[hsl(var(--calc-hue),40%,20%)] px-3 py-1 rounded-full mb-3">Conversion Tools</div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3">Binary to Hex Converter</h1>
        <div className="flex flex-wrap gap-2 mb-4">
          {["Free","Both Directions","Nibble Breakdown","No Signup"].map(b => <span key={b} className="text-xs bg-muted text-muted-foreground px-2.5 py-1 rounded-full font-medium">{b}</span>)}
        </div>
        <p className="text-muted-foreground text-lg max-w-2xl">Convert binary to hexadecimal or hex to binary — with a clear nibble-by-nibble breakdown showing exactly how each 4-bit group maps to one hex digit.</p>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <section className="lg:col-span-3 space-y-6">
          <div className="tool-calc-card">
            <h2 className="text-xl font-bold mb-5">Binary ↔ Hex Converter</h2>
            <div className="flex gap-2 mb-5 p-1 bg-muted rounded-xl w-fit">
              {([["binToHex","Binary → Hex"],["hexToBin","Hex → Binary"]] as const).map(([m, label]) => (
                <button key={m} onClick={() => { setMode(m); setInput(""); }}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${mode === m ? "bg-[hsl(var(--calc-hue),65%,62%)] text-white shadow" : "text-muted-foreground hover:text-foreground"}`}>
                  {label}
                </button>
              ))}
            </div>
            <div className="mb-6">
              <label className="tool-calc-label">{mode === "binToHex" ? "Binary Number (spaces allowed)" : "Hexadecimal Number"}</label>
              <input className="tool-calc-input font-mono uppercase" type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder={mode === "binToHex" ? "1010 1111" : "AF"} />
            </div>

            {result && (
              <AnimatePresence mode="wait">
                <motion.div key={`${input}-${mode}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="space-y-4">
                  {"error" in result ? (
                    <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">{result.error}</div>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="tool-calc-result">
                          <p className="text-xs text-muted-foreground mb-1">Hexadecimal</p>
                          <p className="tool-calc-number text-2xl font-bold font-mono text-[hsl(var(--calc-hue),65%,62%)]">0x{result.hex}</p>
                        </div>
                        <div className="tool-calc-result">
                          <p className="text-xs text-muted-foreground mb-1">Binary</p>
                          <p className="tool-calc-number text-xl font-bold font-mono break-all">{result.binary}</p>
                        </div>
                        <div className="tool-calc-result">
                          <p className="text-xs text-muted-foreground mb-1">Decimal</p>
                          <p className="tool-calc-number text-xl font-bold">{result.decimal.toLocaleString()}</p>
                        </div>
                        <div className="tool-calc-result">
                          <p className="text-xs text-muted-foreground mb-1">Octal</p>
                          <p className="tool-calc-number text-xl font-bold font-mono">{result.octal}</p>
                        </div>
                      </div>

                      {/* Nibble breakdown */}
                      <div className="bg-muted/30 rounded-xl p-4">
                        <p className="font-semibold text-sm mb-3">Nibble-by-nibble conversion:</p>
                        {"nibbleMap" in result && result.nibbleMap && (
                          <div className="flex flex-wrap gap-3 items-center">
                            {result.nibbleMap.map((n, i) => (
                              <div key={i} className="flex items-center gap-2">
                                {i > 0 && <span className="text-muted-foreground text-xs">|</span>}
                                <div className="text-center">
                                  <div className="font-mono text-sm font-bold">{n.bin}</div>
                                  <ArrowRight className="w-3 h-3 mx-auto text-muted-foreground my-0.5" />
                                  <div className="font-mono font-bold text-[hsl(var(--calc-hue),65%,62%)]">{n.hex}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        {"hexChars" in result && result.hexChars && (
                          <div className="flex flex-wrap gap-3 items-center">
                            {result.hexChars.map((h, i) => (
                              <div key={i} className="flex items-center gap-2">
                                {i > 0 && <span className="text-muted-foreground text-xs">|</span>}
                                <div className="text-center">
                                  <div className="font-mono text-lg font-bold text-[hsl(var(--calc-hue),65%,62%)]">{h.hex}</div>
                                  <ArrowRight className="w-3 h-3 mx-auto text-muted-foreground my-0.5" />
                                  <div className="font-mono text-sm font-bold">{h.bin}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </div>

          {/* Nibble chart */}
          <div className="tool-calc-card">
            <h2 className="text-xl font-bold mb-4">Binary–Hex Nibble Chart</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead><tr className="bg-muted/50">{["Binary","Hex","Decimal","Binary","Hex","Decimal"].map((h,i) => <th key={i} className="px-3 py-2 text-left font-semibold text-muted-foreground">{h}</th>)}</tr></thead>
                <tbody>
                  {[0,1,2,3,4,5,6,7].map(i => {
                    const l = i, r = i+8;
                    return (
                      <tr key={i} className="border-t border-border">
                        <td className="px-3 py-1.5 font-mono">{l.toString(2).padStart(4,"0")}</td>
                        <td className="px-3 py-1.5 font-mono font-bold text-[hsl(var(--calc-hue),65%,62%)]">{l.toString(16).toUpperCase()}</td>
                        <td className="px-3 py-1.5">{l}</td>
                        <td className="px-3 py-1.5 font-mono">{r.toString(2).padStart(4,"0")}</td>
                        <td className="px-3 py-1.5 font-mono font-bold text-[hsl(var(--calc-hue),65%,62%)]">{r.toString(16).toUpperCase()}</td>
                        <td className="px-3 py-1.5">{r}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="tool-calc-card">
            <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
            <div className="space-y-3">
              <FaqItem q="Why does 1 hex digit equal exactly 4 binary digits?" a="Because 16 = 2⁴. Each hex digit represents a value from 0–15, which requires exactly 4 binary bits to represent (0000 to 1111). This perfect power-of-2 relationship makes hex the ideal shorthand for binary." />
              <FaqItem q="How do you convert binary to hex?" a="Group the binary number into groups of 4 bits from the right (padding with zeros on the left if needed). Convert each 4-bit group to its hex equivalent. Example: 10101111 → 1010 1111 → A F → 0xAF." />
              <FaqItem q="How do you convert hex to binary?" a="Replace each hex digit with its 4-bit binary equivalent. Example: 0xAF → A=1010, F=1111 → 10101111. No intermediate decimal conversion needed." />
              <FaqItem q="Why is hex used in web colors?" a="#RRGGBB format uses 2 hex digits (1 byte) per color channel. Each channel can be 0–255 (2⁸−1), exactly 1 byte = 2 hex digits. Example: #FF0000 = R:255 G:0 B:0 = pure red." />
              <FaqItem q="What is a nibble?" a="A nibble (or nybble) is 4 bits — exactly half a byte and equivalent to one hex digit. The term is a playful extension of the word 'byte'." />
              <FaqItem q="Can binary represent negative numbers?" a="Not directly in unsigned representation. Negative binary numbers use two's complement: invert all bits, then add 1. So -1 in an 8-bit system = 11111111 = 0xFF." />
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-[hsl(var(--calc-hue),65%,62%)] to-[hsl(var(--calc-hue),55%,45%)] p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-2">More Number Converters</h2>
            <p className="mb-5 opacity-90">Complete your number base toolkit.</p>
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
                {[["/conversion/decimal-to-binary-converter","Decimal to Binary"],["/conversion/hex-to-decimal-converter","Hex to Decimal"],["/conversion/base-converter","Base Converter"],["/css-design/hex-to-rgb-converter","Hex to RGB"],["/math/online-scientific-calculator","Scientific Calculator"]].map(([href, label]) => (
                  <Link key={href} href={href} className="flex items-center gap-2 py-1 text-muted-foreground hover:text-foreground transition-colors">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[hsl(var(--calc-hue),65%,62%)] shrink-0" />{label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="tool-calc-card p-4">
              <div className="space-y-2 text-xs text-muted-foreground">
                {["Nibble breakdown","Both directions","Includes decimal & octal","Free, no login"].map(t => (
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
