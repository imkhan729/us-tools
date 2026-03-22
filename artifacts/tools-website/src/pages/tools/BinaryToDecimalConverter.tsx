import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, ArrowRight, ArrowLeftRight,
  Zap, CheckCircle2, Smartphone, Shield, Clock, TrendingUp,
  Calculator, Lightbulb, Copy, Check,
  Code2, Hash, Binary, Cpu, FileCode, Terminal,
} from "lucide-react";
import { getToolPath } from "@/data/tools";

type ConvBase = "binary" | "decimal" | "hex" | "octal";

function useNumberConverter() {
  const [value, setValue] = useState("");
  const [fromBase, setFromBase] = useState<ConvBase>("binary");

  const result = useMemo(() => {
    const v = value.trim();
    if (!v) return null;
    try {
      let decimal: number;
      switch (fromBase) {
        case "binary":
          if (!/^[01]+$/.test(v)) return { error: "Binary only contains 0s and 1s" };
          decimal = parseInt(v, 2);
          break;
        case "decimal":
          if (!/^\d+$/.test(v)) return { error: "Decimal only contains digits 0–9" };
          decimal = parseInt(v, 10);
          break;
        case "hex":
          if (!/^[0-9a-fA-F]+$/.test(v)) return { error: "Hex uses digits 0–9 and letters A–F" };
          decimal = parseInt(v, 16);
          break;
        case "octal":
          if (!/^[0-7]+$/.test(v)) return { error: "Octal only contains digits 0–7" };
          decimal = parseInt(v, 8);
          break;
      }
      if (isNaN(decimal!) || decimal! < 0) return { error: "Invalid input" };
      return {
        decimal: decimal!.toString(10),
        binary: decimal!.toString(2),
        hex: decimal!.toString(16).toUpperCase(),
        octal: decimal!.toString(8),
        value: decimal!,
      };
    } catch {
      return { error: "Invalid input" };
    }
  }, [value, fromBase]);

  return { value, setValue, fromBase, setFromBase, result };
}

function ResultInsight({ result }: { result: ReturnType<typeof useNumberConverter>["result"] }) {
  if (!result || "error" in result) return null;
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/20">
      <div className="flex gap-2 items-start">
        <Lightbulb className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
        <p className="text-sm text-foreground/80 leading-relaxed">
          Decimal <strong>{result.decimal}</strong> = Binary <strong>{result.binary}</strong> = Hex <strong>0x{result.hex}</strong> = Octal <strong>{result.octal}</strong>. The binary representation uses <strong>{result.binary.length} bits</strong>.
        </p>
      </div>
    </motion.div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-primary/40 transition-colors">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-primary">
          <ChevronDown className="w-5 h-5" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div key="a" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} className="overflow-hidden">
            <p className="px-5 pb-5 text-muted-foreground leading-relaxed border-t border-border pt-4">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const RELATED_TOOLS = [
  { title: "Hex to RGB Converter", slug: "hex-to-rgb-converter", icon: <Code2 className="w-5 h-5" />, color: 265 },
  { title: "JSON Formatter", slug: "json-formatter", icon: <FileCode className="w-5 h-5" />, color: 217 },
  { title: "Base64 Encoder/Decoder", slug: "base64-encoder-decoder", icon: <Terminal className="w-5 h-5" />, color: 152 },
  { title: "Password Generator", slug: "password-generator", icon: <Hash className="w-5 h-5" />, color: 340 },
  { title: "Lorem Ipsum Generator", slug: "lorem-ipsum-generator", icon: <TrendingUp className="w-5 h-5" />, color: 45 },
  { title: "CSS Gradient Generator", slug: "css-gradient-generator", icon: <Cpu className="w-5 h-5" />, color: 25 },
];

const CONVERSION_TABLE = [
  { dec: 0, bin: "0", hex: "0", oct: "0" },
  { dec: 1, bin: "1", hex: "1", oct: "1" },
  { dec: 2, bin: "10", hex: "2", oct: "2" },
  { dec: 4, bin: "100", hex: "4", oct: "4" },
  { dec: 8, bin: "1000", hex: "8", oct: "10" },
  { dec: 10, bin: "1010", hex: "A", oct: "12" },
  { dec: 15, bin: "1111", hex: "F", oct: "17" },
  { dec: 16, bin: "10000", hex: "10", oct: "20" },
  { dec: 32, bin: "100000", hex: "20", oct: "40" },
  { dec: 64, bin: "1000000", hex: "40", oct: "100" },
  { dec: 128, bin: "10000000", hex: "80", oct: "200" },
  { dec: 255, bin: "11111111", hex: "FF", oct: "377" },
];

const BASES: { value: ConvBase; label: string; placeholder: string; color: string }[] = [
  { value: "binary",  label: "Binary (Base-2)",      placeholder: "e.g. 1010110", color: "blue" },
  { value: "decimal", label: "Decimal (Base-10)",     placeholder: "e.g. 86", color: "emerald" },
  { value: "hex",     label: "Hexadecimal (Base-16)", placeholder: "e.g. 56 or FF", color: "purple" },
  { value: "octal",   label: "Octal (Base-8)",        placeholder: "e.g. 126", color: "amber" },
];

export default function BinaryToDecimalConverter() {
  const conv = useNumberConverter();
  const [copied, setCopied] = useState<string | null>(null);
  const copyVal = (v: string) => { navigator.clipboard.writeText(v); setCopied(v); setTimeout(() => setCopied(null), 2000); };
  const copyLink = () => copyVal(window.location.href);

  return (
    <Layout>
      <SEO
        title="Binary to Decimal Converter - Binary, Hex, Octal Number Converter | Free Tool"
        description="Free online binary to decimal converter. Convert between binary, decimal, hexadecimal, and octal instantly. Includes conversion table and step-by-step explanation."
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          { "@type": "WebApplication", "name": "Binary to Decimal Converter", "url": "https://usonlinetools.com/conversion/binary-to-decimal-converter", "applicationCategory": "DeveloperApplication", "operatingSystem": "Any", "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" } },
          { "@type": "FAQPage", "mainEntity": [
            { "@type": "Question", "name": "How do you convert binary to decimal?", "acceptedAnswer": { "@type": "Answer", "text": "Multiply each binary digit by 2 raised to its position (from right, starting at 0), then sum all values. For example, binary 1011 = 1×2³ + 0×2² + 1×2¹ + 1×2⁰ = 8+0+2+1 = 11." } },
          ]}
        ]
      })}} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-primary" strokeWidth={3} />
          <Link href="/category/developer" className="text-muted-foreground hover:text-foreground transition-colors">Developer Tools</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-primary" strokeWidth={3} />
          <span className="text-foreground">Binary to Decimal Converter</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">

            {/* 1. PAGE HEADER */}
            <section>
              <div className="inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
                <Binary className="w-3.5 h-3.5" />
                Developer Tools
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight leading-[1.1] mb-3">
                Binary to Decimal Converter
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                Convert between binary (base-2), decimal (base-10), hexadecimal (base-16), and octal (base-8) number systems instantly. Includes a reference conversion table, step-by-step method, and common examples — free, no signup required.
              </p>
            </section>

            {/* QUICK ANSWER BOX */}
            <section className="p-5 rounded-xl bg-blue-500/5 border-2 border-blue-500/20">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-5 h-5 text-blue-500" />
                <h2 className="font-black text-foreground text-base">Quick Answer: Binary to Decimal Formula</h2>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                Each binary digit is multiplied by 2 raised to its position (right to left, starting at 0):
              </p>
              <div className="font-mono text-sm bg-background rounded-lg p-3 border border-border">
                <span className="text-foreground font-bold">1011</span>{" "}
                = 1×2³ + 0×2² + 1×2¹ + 1×2⁰{" "}
                = 8 + 0 + 2 + 1{" "}
                = <span className="text-primary font-black">11</span>
              </div>
            </section>

            {/* 2. QUICK ACTION */}
            <section className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/15">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-bold text-foreground text-sm">Convert any number system instantly</p>
                <p className="text-muted-foreground text-sm">Select your source base, enter the value, and all four formats appear instantly.</p>
              </div>
            </section>

            {/* 3. TOOL SECTION */}
            <section className="space-y-5">
              <div className="tool-calc-card" style={{ "--calc-hue": 217 } as React.CSSProperties}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="tool-calc-number">1</div>
                  <h3 className="text-lg font-bold text-foreground">Number Base Converter</h3>
                </div>

                <div className="mb-5 space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Convert From</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {BASES.map(b => (
                        <button
                          key={b.value}
                          onClick={() => conv.setFromBase(b.value)}
                          className={`p-2.5 rounded-xl border text-sm font-bold transition-all ${conv.fromBase === b.value ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary/40 text-muted-foreground"}`}
                        >
                          {b.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">
                      Input ({BASES.find(b => b.value === conv.fromBase)?.label})
                    </label>
                    <input
                      type="text"
                      placeholder={BASES.find(b => b.value === conv.fromBase)?.placeholder}
                      className="tool-calc-input w-full font-mono text-lg"
                      value={conv.value}
                      onChange={e => conv.setValue(e.target.value)}
                    />
                    {conv.result && "error" in conv.result && (
                      <p className="text-sm text-rose-500 mt-1">{conv.result.error}</p>
                    )}
                  </div>
                </div>

                {/* Results */}
                {conv.result && !("error" in conv.result) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { label: "Binary (Base-2)", value: conv.result.binary, color: "text-blue-600 dark:text-blue-400" },
                      { label: "Decimal (Base-10)", value: conv.result.decimal, color: "text-emerald-600 dark:text-emerald-400" },
                      { label: "Hexadecimal (Base-16)", value: `0x${conv.result.hex}`, color: "text-purple-600 dark:text-purple-400" },
                      { label: "Octal (Base-8)", value: conv.result.octal, color: "text-amber-600 dark:text-amber-400" },
                    ].map(item => (
                      <div key={item.label} className="tool-calc-result">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{item.label}</span>
                          <button
                            onClick={() => copyVal(item.value)}
                            className="text-muted-foreground hover:text-primary transition-colors"
                            title="Copy"
                          >
                            {copied === item.value ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                        <div className={`text-xl font-black font-mono mt-1 ${item.color}`}>{item.value}</div>
                      </div>
                    ))}
                  </div>
                )}

                <ResultInsight result={conv.result} />
              </div>
            </section>

            {/* CONVERSION TABLE */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Binary, Decimal, Hex, Octal Conversion Table</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-3 font-bold text-foreground">Decimal</th>
                      <th className="text-left p-3 font-bold text-foreground">Binary</th>
                      <th className="text-left p-3 font-bold text-foreground">Hex</th>
                      <th className="text-left p-3 font-bold text-foreground">Octal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {CONVERSION_TABLE.map((row, i) => (
                      <tr key={row.dec} className={`border-b border-border/50 ${i % 2 === 0 ? "bg-muted/20" : ""}`}>
                        <td className="p-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">{row.dec}</td>
                        <td className="p-3 font-mono text-blue-600 dark:text-blue-400">{row.bin}</td>
                        <td className="p-3 font-mono text-purple-600 dark:text-purple-400">{row.hex}</td>
                        <td className="p-3 font-mono text-amber-600 dark:text-amber-400">{row.oct}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* 5. HOW IT WORKS */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Convert Binary to Decimal (Step by Step)</h2>
              <div className="space-y-5">
                {[
                  { color: "blue", title: "Write Out the Binary Number", desc: "Take the binary number and write each digit from right to left. Assign position values starting at 2⁰ (=1) on the right, then 2¹ (=2), 2² (=4), 2³ (=8), etc." },
                  { color: "emerald", title: "Multiply Digit × Position Value", desc: "For each digit (0 or 1), multiply it by its position value. Zeros contribute nothing; ones add their full position value to the total." },
                  { color: "purple", title: "Sum All Products", desc: "Add all the values together. The result is the decimal equivalent. Example: 1011₂ = 8+0+2+1 = 11₁₀." },
                ].map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className={`w-8 h-8 rounded-lg bg-${step.color}-500/10 text-${step.color}-600 dark:text-${step.color}-400 flex items-center justify-center flex-shrink-0 font-bold text-sm`}>{i + 1}</div>
                    <div>
                      <h4 className="font-bold text-foreground mb-1">{step.title}</h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 6. REAL-LIFE EXAMPLES */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Real-Life Examples</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/15">
                  <div className="flex items-center gap-2 mb-2"><Cpu className="w-4 h-4 text-blue-500" /><h4 className="font-bold text-foreground text-sm">RGB Color Values</h4></div>
                  <p className="text-muted-foreground text-sm leading-relaxed">CSS color <code className="bg-muted px-1 rounded text-xs">#FF5733</code>: FF = decimal <strong className="text-foreground">255</strong>, 57 = decimal <strong className="text-foreground">87</strong>, 33 = decimal <strong className="text-foreground">51</strong>. Hex is how computers store color.</p>
                </div>
                <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/15">
                  <div className="flex items-center gap-2 mb-2"><Binary className="w-4 h-4 text-purple-500" /><h4 className="font-bold text-foreground text-sm">IP Addresses</h4></div>
                  <p className="text-muted-foreground text-sm leading-relaxed">IP address 192.168.1.1 in binary: 11000000.10101000.00000001.00000001. Subnet masks use binary to define network boundaries.</p>
                </div>
                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
                  <div className="flex items-center gap-2 mb-2"><Code2 className="w-4 h-4 text-emerald-500" /><h4 className="font-bold text-foreground text-sm">ASCII Character Codes</h4></div>
                  <p className="text-muted-foreground text-sm leading-relaxed">The letter 'A' = ASCII decimal <strong className="text-foreground">65</strong> = binary <strong className="text-foreground">01000001</strong> = hex <strong className="text-foreground">0x41</strong>. All text is stored as binary.</p>
                </div>
                <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/15">
                  <div className="flex items-center gap-2 mb-2"><Terminal className="w-4 h-4 text-amber-500" /><h4 className="font-bold text-foreground text-sm">File Permissions (Unix)</h4></div>
                  <p className="text-muted-foreground text-sm leading-relaxed">Unix permission 755 in octal = binary <strong className="text-foreground">111 101 101</strong>: owner can read/write/execute, group and others can read/execute.</p>
                </div>
              </div>
            </section>

            {/* 7. BENEFITS */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Why Use This Number Converter?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { icon: <ArrowLeftRight className="w-4 h-4" />, text: "Converts all 4 number bases simultaneously" },
                  { icon: <Copy className="w-4 h-4" />, text: "One-click copy for each result format" },
                  { icon: <Shield className="w-4 h-4" />, text: "No data sent to servers — runs in browser" },
                  { icon: <Smartphone className="w-4 h-4" />, text: "Works on mobile for quick developer lookups" },
                  { icon: <Clock className="w-4 h-4" />, text: "Instant conversion as you type" },
                  { icon: <CheckCircle2 className="w-4 h-4" />, text: "Reference table for common values included" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="text-primary">{item.icon}</div>
                    <span className="text-sm font-medium text-foreground">{item.text}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* 9. SEO CONTENT */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-4">Number Systems in Computing</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p>Computers operate on the <strong className="text-foreground">binary number system (base-2)</strong>, using only 0s and 1s. Every piece of data — text, images, programs — is ultimately stored as binary. Understanding how to convert between binary, decimal, hexadecimal, and octal is a fundamental skill for programmers, IT professionals, and CS students.</p>
                <h3 className="text-xl font-bold text-foreground pt-2">Why Hexadecimal?</h3>
                <p>Hexadecimal (base-16) is widely used because it's compact and maps cleanly to binary: each hex digit represents exactly 4 binary bits (a nibble). This is why memory addresses, color codes, and error codes are written in hex — it's shorter and easier to read than binary while still mapping directly to binary representations.</p>
                <h3 className="text-xl font-bold text-foreground pt-2">Common Uses of Binary Conversion</h3>
                <ul className="space-y-2 ml-1">
                  {[
                    "CSS/HTML color codes (hex to RGB conversion)",
                    "Networking (IP addresses, subnet masks in binary)",
                    "Low-level programming and microcontroller coding",
                    "Understanding file permissions in Unix/Linux (octal)",
                    "CS coursework and computer science exams",
                    "Debugging and reading memory dumps",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* 10. FAQ */}
            <section>
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem q="How do you convert binary to decimal?" a="Multiply each binary digit (from right to left) by 2 raised to its position number, then sum all products. For example, binary 1101 = 1×8 + 1×4 + 0×2 + 1×1 = 13 in decimal." />
                <FaqItem q="How do you convert decimal to binary?" a="Divide the decimal number by 2 repeatedly, recording each remainder. Read the remainders from bottom to top. For example, 13 ÷ 2 = 6 R1, 6 ÷ 2 = 3 R0, 3 ÷ 2 = 1 R1, 1 ÷ 2 = 0 R1 → binary: 1101." />
                <FaqItem q="What is hexadecimal used for?" a="Hexadecimal is used in programming, networking, and computing to represent binary data in a more compact form. Each hex digit represents 4 binary bits. Common uses include memory addresses, color codes (#RRGGBB), error codes, and MAC addresses." />
                <FaqItem q="How do you convert binary to hexadecimal?" a="Group the binary digits into sets of 4 (from right), then convert each group to its hex equivalent. For example, binary 11111111 = groups 1111 and 1111 = FF in hexadecimal." />
                <FaqItem q="What is octal (base-8) used for?" a="Octal was historically used in early computing. Today it's mainly used in Unix/Linux file permissions (e.g., chmod 755 = rwxr-xr-x). Each octal digit represents 3 binary bits." />
                <FaqItem q="Can this converter handle large numbers?" a="Yes, the converter handles any non-negative integer. For very large numbers (beyond JavaScript's safe integer range of 2⁵³), precision may decrease. For cryptographic or very large number conversion, use a dedicated arbitrary-precision library." />
              </div>
            </section>

            {/* 11. FINAL CTA */}
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-8 text-primary-foreground">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">More Developer Tools</h2>
                <p className="text-primary-foreground/80 mb-6 max-w-lg">Explore JSON formatter, Base64 encoder, hex to RGB converter, and 400+ more free developer tools — all client-side, no data sent.</p>
                <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary font-bold rounded-xl hover:-translate-y-0.5 transition-transform">
                  Explore All Tools <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </section>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-6">
            <div className="sticky top-28 space-y-6">
              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="text-lg font-black text-foreground tracking-tight mb-4">Related Tools</h3>
                <div className="space-y-2">
                  {RELATED_TOOLS.map((tool) => (
                    <Link key={tool.slug} href={getToolPath(tool.slug)} className="group flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-all">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white flex-shrink-0" style={{ background: `linear-gradient(135deg, hsl(${tool.color} 70% 55%), hsl(${tool.color} 75% 42%))` }}>
                        {tool.icon}
                      </div>
                      <span className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors leading-snug">{tool.title}</span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary ml-auto opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="text-lg font-black text-foreground tracking-tight mb-2">Share This Tool</h3>
                <p className="text-sm text-muted-foreground mb-4">Help developers and CS students convert number bases easily.</p>
                <button onClick={copyLink} className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform">
                  {copied === window.location.href ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Link</>}
                </button>
              </div>

              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="text-lg font-black text-foreground tracking-tight mb-4">On This Page</h3>
                <div className="space-y-1.5">
                  {["Converter", "Quick Answer", "Reference Table", "How It Works", "Examples", "FAQ"].map((label) => (
                    <a key={label} href={`#${label.toLowerCase().replace(/\s/g, "-")}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary font-medium py-1 transition-colors">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/30" />
                      {label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
