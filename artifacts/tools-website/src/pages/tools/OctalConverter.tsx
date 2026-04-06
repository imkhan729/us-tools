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

type Mode = "decToOct" | "octToDec" | "binToOct" | "hexToOct";
const MODES: { id: Mode; label: string }[] = [
  { id: "decToOct", label: "Decimal → Octal" },
  { id: "octToDec", label: "Octal → Decimal" },
  { id: "binToOct", label: "Binary → Octal" },
  { id: "hexToOct", label: "Hex → Octal" },
];

function fmtNum(n: number): string {
  return n.toLocaleString("en-US");
}

export default function OctalConverter() {
  const [mode, setMode] = useState<Mode>("decToOct");
  const [input, setInput] = useState("255");

  const result = useMemo(() => {
    const clean = input.trim().replace(/\s/g, "").toUpperCase();
    if (!clean) return null;
    let decimal: number | null = null;
    switch (mode) {
      case "decToOct": { const v = parseInt(clean, 10); decimal = isNaN(v) ? null : v; break; }
      case "octToDec": { if (!/^[0-7]+$/.test(clean)) return { error: "Octal uses only digits 0–7." }; decimal = parseInt(clean, 8); break; }
      case "binToOct": { if (!/^[01]+$/.test(clean)) return { error: "Binary uses only 0 and 1." }; decimal = parseInt(clean, 2); break; }
      case "hexToOct": { if (!/^[0-9A-F]+$/.test(clean)) return { error: "Hex uses 0–9 and A–F." }; decimal = parseInt(clean, 16); break; }
    }
    if (decimal === null || isNaN(decimal) || decimal < 0) return { error: "Invalid input for selected base." };
    return {
      octal: decimal.toString(8),
      decimal,
      binary: decimal.toString(2),
      hex: decimal.toString(16).toUpperCase(),
    };
  }, [input, mode]);

  return (
    <div style={{ "--calc-hue": "160" } as React.CSSProperties} className="min-h-screen bg-background">
      <SEO
        title="Octal Converter — Convert Octal, Decimal, Binary, Hex"
        description="Convert between octal, decimal, binary, and hexadecimal. Free online octal converter with a full reference chart, Unix permission guide, and step-by-step examples."
      />
      <nav className="max-w-6xl mx-auto px-4 pt-4 pb-0 text-sm text-muted-foreground flex gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link><span>/</span>
        <Link href="/category/conversion" className="hover:text-foreground transition-colors">Conversion Tools</Link><span>/</span>
        <span className="text-foreground font-medium">Octal Converter</span>
      </nav>
      <header className="max-w-6xl mx-auto px-4 pt-6 pb-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[hsl(var(--calc-hue),60%,42%)] bg-[hsl(var(--calc-hue),80%,95%)] dark:bg-[hsl(var(--calc-hue),40%,20%)] px-3 py-1 rounded-full mb-3">Conversion Tools</div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3">Octal Converter</h1>
        <div className="flex flex-wrap gap-2 mb-4">
          {["Free","4 Conversion Modes","Unix Permissions","No Signup"].map(b => <span key={b} className="text-xs bg-muted text-muted-foreground px-2.5 py-1 rounded-full font-medium">{b}</span>)}
        </div>
        <p className="text-muted-foreground text-lg max-w-2xl">Convert between octal (base 8) and decimal, binary, or hexadecimal. Includes a Unix file permissions reference — the most practical everyday use of octal notation.</p>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <section className="lg:col-span-3 space-y-6">
          <div className="tool-calc-card">
            <h2 className="text-xl font-bold mb-5 flex items-center gap-2"><Hash className="w-5 h-5 text-[hsl(var(--calc-hue),60%,42%)]" />Octal Converter</h2>
            <div className="flex gap-1.5 flex-wrap mb-5 p-1 bg-muted rounded-xl">
              {MODES.map(m => (
                <button key={m.id} onClick={() => { setMode(m.id); setInput(""); }}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${mode === m.id ? "bg-[hsl(var(--calc-hue),60%,42%)] text-white shadow" : "text-muted-foreground hover:text-foreground"}`}>
                  {m.label}
                </button>
              ))}
            </div>
            <div className="mb-6">
              <label className="tool-calc-label">Input Value</label>
              <input className="tool-calc-input font-mono uppercase" type="text" value={input} onChange={(e) => setInput(e.target.value)}
                placeholder={mode === "decToOct" ? "255" : mode === "octToDec" ? "377" : mode === "binToOct" ? "11111111" : "FF"} />
              <p className="text-xs text-muted-foreground mt-1">
                {mode === "decToOct" ? "Digits 0–9" : mode === "octToDec" ? "Digits 0–7" : mode === "binToOct" ? "Digits 0–1" : "Digits 0–9, A–F"}
              </p>
            </div>
            {result && (
              <AnimatePresence mode="wait">
                <motion.div key={`${input}-${mode}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                  {"error" in result ? (
                    <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">{result.error}</div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: "Octal (Base 8)", value: result.octal, highlight: true },
                        { label: "Decimal (Base 10)", value: fmtNum(result.decimal), highlight: false },
                        { label: "Binary (Base 2)", value: result.binary, highlight: false },
                        { label: "Hexadecimal (Base 16)", value: "0x" + result.hex, highlight: false },
                      ].map(c => (
                        <div key={c.label} className={`tool-calc-result ${c.highlight ? "ring-2 ring-[hsl(var(--calc-hue),60%,42%)] ring-offset-1" : ""}`}>
                          <p className="text-xs text-muted-foreground mb-1">{c.label}</p>
                          <p className="tool-calc-number text-xl font-bold font-mono break-all">{c.value}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </div>

          {/* Unix permissions */}
          <div className="tool-calc-card">
            <h2 className="text-xl font-bold mb-4">Unix File Permissions (chmod)</h2>
            <p className="text-muted-foreground mb-4 text-sm">Unix file permissions use a 3-digit octal number. Each digit controls read (4), write (2), and execute (1) for owner, group, and others respectively.</p>
            <div className="overflow-x-auto mb-5">
              <table className="w-full text-sm border-collapse">
                <thead><tr className="bg-muted/50">{["chmod","Binary","Meaning"].map(h => <th key={h} className="px-3 py-2 text-left font-semibold text-muted-foreground">{h}</th>)}</tr></thead>
                <tbody>
                  {[
                    ["777","111 111 111","All: rwxrwxrwx — Full permissions (everyone)"],
                    ["755","111 101 101","rwxr-xr-x — Owner: full, others: read+exec"],
                    ["644","110 100 100","rw-r--r-- — Owner: read+write, others: read only"],
                    ["600","110 000 000","rw------- — Owner only (private files)"],
                    ["400","100 000 000","r-------- — Read-only (readonly)"],
                    ["000","000 000 000","--------- — No permissions"],
                  ].map(row => (
                    <tr key={row[0]} className="border-t border-border">
                      <td className="px-3 py-1.5 font-mono font-bold text-[hsl(var(--calc-hue),60%,42%)]">{row[0]}</td>
                      <td className="px-3 py-1.5 font-mono text-xs">{row[1]}</td>
                      <td className="px-3 py-1.5 text-xs">{row[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-muted/40 rounded-xl p-4 text-sm font-mono">
              <p className="font-semibold text-foreground mb-1">chmod bit values:</p>
              <p className="text-muted-foreground">4 = read (r) &nbsp; 2 = write (w) &nbsp; 1 = execute (x)</p>
              <p className="text-muted-foreground mt-1">7 = 4+2+1 = rwx &nbsp; 6 = 4+2 = rw- &nbsp; 5 = 4+1 = r-x</p>
            </div>
          </div>

          <div className="tool-calc-card">
            <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
            <div className="space-y-3">
              <FaqItem q="What is octal (base 8)?" a="Octal is a number system using 8 digits: 0–7. Each octal digit represents exactly 3 binary bits (since 2³ = 8). It's the base-8 equivalent of hexadecimal's base-16." />
              <FaqItem q="Why is octal used for Unix permissions?" a="Unix file permissions store 9 bits (read/write/execute for owner/group/other). Octal groups binary bits in threes, making each permission group exactly one octal digit. This makes reading and writing permissions concise." />
              <FaqItem q="How do you convert decimal to octal?" a="Divide the decimal by 8, record the remainder, then divide the quotient by 8 again. Repeat until the quotient is 0. Read remainders from bottom to top. Example: 255 → 255÷8=31r7 → 31÷8=3r7 → 3÷8=0r3 → 377 octal." />
              <FaqItem q="What is the relationship between binary and octal?" a="One octal digit = exactly 3 binary bits. Group binary from the right into groups of 3: 11111111 → 11 111 111 → 377 octal. Conversely, each octal digit expands to exactly 3 binary bits." />
              <FaqItem q="Is octal still used in modern computing?" a="Less commonly than before. Unix/Linux file permissions remain the most common everyday use. Some embedded systems and older languages (C's 0777 octal literal syntax) still use it. Hexadecimal has largely replaced octal for most modern uses." />
              <FaqItem q="What is the highest single octal digit?" a="7 (octal) = 7 (decimal) = 111 (binary). This is why permissions like 777 mean 'all bits set for all three groups'." />
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-[hsl(var(--calc-hue),60%,42%)] to-[hsl(var(--calc-hue),50%,32%)] p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-2">Complete Number Base Toolkit</h2>
            <p className="mb-5 opacity-90">Explore all our number base and conversion tools.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/conversion/decimal-to-binary-converter" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-5 py-2.5 rounded-xl font-semibold transition-colors text-sm">Decimal to Binary</Link>
              <Link href="/conversion/base-converter" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-5 py-2.5 rounded-xl font-semibold transition-colors text-sm">Base Converter</Link>
            </div>
          </div>
        </section>
        <aside className="space-y-5">
          <div className="sticky top-4 space-y-5">
            <div className="tool-calc-card p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Related Tools</p>
              <div className="space-y-1.5 text-sm">
                {[["/conversion/decimal-to-binary-converter","Decimal to Binary"],["/conversion/binary-to-hex-converter","Binary to Hex"],["/conversion/hex-to-decimal-converter","Hex to Decimal"],["/conversion/base-converter","Base Converter"],["/math/online-scientific-calculator","Scientific Calculator"]].map(([href, label]) => (
                  <Link key={href} href={href} className="flex items-center gap-2 py-1 text-muted-foreground hover:text-foreground transition-colors">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[hsl(var(--calc-hue),60%,42%)] shrink-0" />{label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="tool-calc-card p-4">
              <div className="space-y-2 text-xs text-muted-foreground">
                {["4 conversion modes","Unix chmod guide","All 4 bases shown","Free, no login"].map(t => (
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
