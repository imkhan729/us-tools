import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, CheckCircle2, Info, HardDrive, Database } from "lucide-react";
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

// ─── unit definitions ────────────────────────────────────────────────────────
type UnitSystem = "binary" | "decimal";

interface StorageUnit {
  id: string;
  label: string;
  short: string;
  bytesMultiplier: number;
  system: UnitSystem;
}

const UNITS: StorageUnit[] = [
  // Decimal (SI)
  { id: "bit",  label: "Bit",       short: "b",  bytesMultiplier: 1/8,               system: "decimal" },
  { id: "byte", label: "Byte",      short: "B",  bytesMultiplier: 1,                 system: "decimal" },
  { id: "kb",   label: "Kilobyte",  short: "KB", bytesMultiplier: 1000,              system: "decimal" },
  { id: "mb",   label: "Megabyte",  short: "MB", bytesMultiplier: 1000**2,           system: "decimal" },
  { id: "gb",   label: "Gigabyte",  short: "GB", bytesMultiplier: 1000**3,           system: "decimal" },
  { id: "tb",   label: "Terabyte",  short: "TB", bytesMultiplier: 1000**4,           system: "decimal" },
  { id: "pb",   label: "Petabyte",  short: "PB", bytesMultiplier: 1000**5,           system: "decimal" },
  // Binary (IEC)
  { id: "kib",  label: "Kibibyte",  short: "KiB", bytesMultiplier: 1024,             system: "binary" },
  { id: "mib",  label: "Mebibyte",  short: "MiB", bytesMultiplier: 1024**2,          system: "binary" },
  { id: "gib",  label: "Gibibyte",  short: "GiB", bytesMultiplier: 1024**3,          system: "binary" },
  { id: "tib",  label: "Tebibyte",  short: "TiB", bytesMultiplier: 1024**4,          system: "binary" },
];

function fmtNum(n: number): string {
  if (n === 0) return "0";
  if (n < 0.000001) return n.toExponential(4);
  if (n >= 1e15) return n.toExponential(4);
  if (n >= 1000 && Number.isInteger(n)) return n.toLocaleString("en-US");
  return parseFloat(n.toPrecision(8)).toString();
}

export default function DataStorageConverter() {
  const [fromUnit, setFromUnit] = useState("gb");
  const [value, setValue] = useState("1");

  const results = useMemo(() => {
    const v = parseFloat(value) || 0;
    if (v <= 0) return null;
    const fromDef = UNITS.find((u) => u.id === fromUnit);
    if (!fromDef) return null;
    const bytes = v * fromDef.bytesMultiplier;
    return UNITS.map((u) => ({ ...u, converted: bytes / u.bytesMultiplier }));
  }, [value, fromUnit]);

  return (
    <div style={{ "--calc-hue": "220" } as React.CSSProperties} className="min-h-screen bg-background">
      <SEO
        title="Data Storage Converter — Convert Bytes, KB, MB, GB, TB Instantly"
        description="Convert between bits, bytes, KB, MB, GB, TB and binary IEC units (KiB, MiB, GiB). Free online data storage converter with complete reference table."
      />

      <nav className="max-w-6xl mx-auto px-4 pt-4 pb-0 text-sm text-muted-foreground flex gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <span>/</span>
        <Link href="/category/conversion" className="hover:text-foreground transition-colors">Conversion Tools</Link>
        <span>/</span>
        <span className="text-foreground font-medium">Data Storage Converter</span>
      </nav>

      <header className="max-w-6xl mx-auto px-4 pt-6 pb-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[hsl(var(--calc-hue),70%,55%)] bg-[hsl(var(--calc-hue),80%,95%)] dark:bg-[hsl(var(--calc-hue),40%,20%)] px-3 py-1 rounded-full mb-3">
          Conversion Tools
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3">Data Storage Converter</h1>
        <div className="flex flex-wrap gap-2 mb-4">
          {["Free", "Bits to Petabytes", "SI & IEC Units", "No Signup"].map((b) => (
            <span key={b} className="text-xs bg-muted text-muted-foreground px-2.5 py-1 rounded-full font-medium">{b}</span>
          ))}
        </div>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Convert between all digital storage units: bits, bytes, KB, MB, GB, TB, PB and binary IEC equivalents (KiB, MiB, GiB, TiB). Instantly see all conversions at once.
        </p>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <section className="lg:col-span-3 space-y-6">
          <div className="tool-calc-card">
            <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-[hsl(var(--calc-hue),70%,55%)]" />
              Data Storage Converter
            </h2>

            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="tool-calc-label">Value</label>
                <input className="tool-calc-input" type="number" min="0" step="any" value={value} onChange={(e) => setValue(e.target.value)} placeholder="1" />
              </div>
              <div>
                <label className="tool-calc-label">From Unit</label>
                <select className="tool-calc-input" value={fromUnit} onChange={(e) => setFromUnit(e.target.value)}>
                  <optgroup label="Decimal (SI)">
                    {UNITS.filter(u => u.system === "decimal").map(u => (
                      <option key={u.id} value={u.id}>{u.label} ({u.short})</option>
                    ))}
                  </optgroup>
                  <optgroup label="Binary (IEC)">
                    {UNITS.filter(u => u.system === "binary").map(u => (
                      <option key={u.id} value={u.id}>{u.label} ({u.short})</option>
                    ))}
                  </optgroup>
                </select>
              </div>
            </div>

            {results ? (
              <AnimatePresence mode="wait">
                <motion.div key={`${value}-${fromUnit}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                  <p className="font-semibold mb-3">Decimal (SI) Units</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                    {results.filter(r => r.system === "decimal").map((r) => (
                      <div key={r.id} className={`tool-calc-result ${r.id === fromUnit ? "ring-2 ring-[hsl(var(--calc-hue),70%,55%)] ring-offset-1" : ""}`}>
                        <p className="text-xs text-muted-foreground mb-1">{r.label}</p>
                        <p className="tool-calc-number text-base font-bold font-mono">{fmtNum(r.converted)}</p>
                        <p className="text-xs text-muted-foreground">{r.short}</p>
                      </div>
                    ))}
                  </div>

                  <p className="font-semibold mb-3">Binary (IEC) Units</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {results.filter(r => r.system === "binary").map((r) => (
                      <div key={r.id} className={`tool-calc-result ${r.id === fromUnit ? "ring-2 ring-[hsl(var(--calc-hue),70%,55%)] ring-offset-1" : ""}`}>
                        <p className="text-xs text-muted-foreground mb-1">{r.label}</p>
                        <p className="tool-calc-number text-base font-bold font-mono">{fmtNum(r.converted)}</p>
                        <p className="text-xs text-muted-foreground">{r.short}</p>
                      </div>
                    ))}
                  </div>

                  <p className="text-xs text-muted-foreground mt-4 flex items-start gap-1.5">
                    <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    SI units use base-1000 (1 KB = 1,000 bytes). IEC units use base-1024 (1 KiB = 1,024 bytes). Hard drive manufacturers use SI; operating systems often use IEC — causing apparent size discrepancies.
                  </p>
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                <Database className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p>Enter a value to see all storage unit conversions.</p>
              </div>
            )}
          </div>

          {/* Reference table */}
          <div className="tool-calc-card">
            <h2 className="text-xl font-bold mb-4">Storage Unit Reference Table</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="px-3 py-2 text-left font-semibold">Unit</th>
                    <th className="px-3 py-2 text-left font-semibold">Symbol</th>
                    <th className="px-3 py-2 text-left font-semibold">Value (bytes)</th>
                    <th className="px-3 py-2 text-left font-semibold">System</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Bit","b","0.125 (⅛ byte)","SI"],
                    ["Byte","B","1","SI"],
                    ["Kilobyte","KB","1,000","SI (1000¹)"],
                    ["Kibibyte","KiB","1,024","IEC (1024¹)"],
                    ["Megabyte","MB","1,000,000","SI (1000²)"],
                    ["Mebibyte","MiB","1,048,576","IEC (1024²)"],
                    ["Gigabyte","GB","1,000,000,000","SI (1000³)"],
                    ["Gibibyte","GiB","1,073,741,824","IEC (1024³)"],
                    ["Terabyte","TB","1,000,000,000,000","SI (1000⁴)"],
                    ["Tebibyte","TiB","1,099,511,627,776","IEC (1024⁴)"],
                    ["Petabyte","PB","1,000,000,000,000,000","SI (1000⁵)"],
                  ].map((row) => (
                    <tr key={row[0]} className="border-t border-border">
                      <td className="px-3 py-1.5 font-medium">{row[0]}</td>
                      <td className="px-3 py-1.5 font-mono text-[hsl(var(--calc-hue),70%,55%)]">{row[1]}</td>
                      <td className="px-3 py-1.5 font-mono text-xs">{row[2]}</td>
                      <td className="px-3 py-1.5 text-xs text-muted-foreground">{row[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Understanding */}
          <div className="tool-calc-card">
            <h2 className="text-xl font-bold mb-4">Why Does My 1 TB Drive Show Less Space?</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { title: "Drive Manufacturers Use Decimal", desc: "Hard drive and SSD makers define 1 TB as 1,000,000,000,000 bytes (10¹²). This is the SI standard — and it's how drives are marketed.", color: "border-l-blue-500" },
                { title: "Operating Systems Use Binary", desc: "Windows, macOS, and Linux traditionally display storage in binary units (GiB), though they often label them 'GB'. Your 1 TB drive shows as ~931 GB because 1,000,000,000,000 ÷ 1,073,741,824 ≈ 931.", color: "border-l-amber-500" },
                { title: "IEC Standard (KiB, MiB, GiB)", desc: "The IEC introduced binary prefixes (kibi, mebi, gibi) in 1998 to eliminate ambiguity. KiB = 1,024 bytes, MiB = 1,048,576 bytes. macOS now uses these correct labels.", color: "border-l-green-500" },
                { title: "File Transfer Speeds", desc: "Network speeds are typically in bits per second (Mbps, Gbps). A 1 Gbps connection transfers 125 MB/s (1,000,000,000 bits ÷ 8 bits/byte ÷ 1,000,000 bytes/MB).", color: "border-l-purple-500" },
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
              <FaqItem q="How many bytes are in a gigabyte?" a="It depends on the definition. In SI (decimal): 1 GB = 1,000,000,000 bytes. In IEC (binary): 1 GiB = 1,073,741,824 bytes. Hard drives use SI. Most operating systems traditionally use IEC but call it 'GB'." />
              <FaqItem q="Why is there a difference between advertised and actual storage?" a="Drive manufacturers use SI (1 TB = 10¹² bytes), but operating systems display storage using binary units (1 TiB = 2⁴⁰ bytes). The gap: 1 TB / 1 TiB ≈ 0.909, so a 1 TB drive appears as ~931 GB in Windows." />
              <FaqItem q="What's the difference between KB and KiB?" a="KB (kilobyte) = 1,000 bytes (SI). KiB (kibibyte) = 1,024 bytes (IEC). The difference is small at this scale but compounds: 1 TB vs 1 TiB differ by about 9.9%." />
              <FaqItem q="How much is a petabyte?" a="1 PB = 1,000 terabytes = 1,000,000 gigabytes = 10¹⁵ bytes. To put it in perspective: all words ever spoken by humans would fit in about 5 exabytes (5,000 petabytes), and 1 PB of music would play for about 2,000 years." />
              <FaqItem q="How do I convert MB/s to Mbps?" a="MB/s (megabytes per second) × 8 = Mbps (megabits per second). A 100 Mbps internet connection downloads at ~12.5 MB/s. Internet speeds are measured in bits; file sizes in bytes." />
              <FaqItem q="What is a nibble?" a="A nibble (sometimes spelled nybble) is 4 bits — exactly half a byte, and equivalent to one hexadecimal digit. While the term is technically correct, it's mostly used in computer science education and humor." />
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-[hsl(var(--calc-hue),70%,55%)] to-[hsl(var(--calc-hue),60%,40%)] p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-2">Convert More Units</h2>
            <p className="mb-5 opacity-90">Explore our complete library of unit converters for every measurement type.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/conversion/length-converter" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-5 py-2.5 rounded-xl font-semibold transition-colors text-sm">Length Converter</Link>
              <Link href="/conversion/weight-converter" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-5 py-2.5 rounded-xl font-semibold transition-colors text-sm">Weight Converter</Link>
            </div>
          </div>
        </section>

        <aside className="space-y-5">
          <div className="sticky top-4 space-y-5">
            <div className="tool-calc-card p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Related Tools</p>
              <div className="space-y-1.5 text-sm">
                {[
                  ["/conversion/length-converter", "Length Converter"],
                  ["/conversion/weight-converter", "Weight Converter"],
                  ["/conversion/decimal-to-binary-converter", "Decimal to Binary"],
                  ["/conversion/hex-to-decimal-converter", "Hex to Decimal"],
                  ["/conversion/speed-converter", "Speed Converter"],
                ].map(([href, label]) => (
                  <Link key={href} href={href} className="flex items-center gap-2 py-1 text-muted-foreground hover:text-foreground transition-colors">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[hsl(var(--calc-hue),70%,55%)] shrink-0" />{label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="tool-calc-card p-4">
              <div className="space-y-2 text-xs text-muted-foreground">
                {["SI & IEC units", "Bit to Petabyte range", "Free, no login", "No data stored"].map((t) => (
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
