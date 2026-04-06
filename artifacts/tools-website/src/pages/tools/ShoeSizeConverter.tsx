import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, CheckCircle2 } from "lucide-react";
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

// Shoe size data — indexed by foot length in mm (mondopoint)
// Each row: [mondopoint_mm, us_men, us_women, uk_men, uk_women, eu, cm, jp]
const SIZES = [
  [206, "3",    "4.5", "2.5",  "4",   "35",  "20.5", "20.5"],
  [210, "3.5",  "5",   "3",    "4.5", "35.5","21",   "21"],
  [213, "4",    "5.5", "3.5",  "5",   "36",  "21.5", "21.5"],
  [216, "4.5",  "6",   "4",    "5.5", "36.5","22",   "22"],
  [219, "5",    "6.5", "4.5",  "6",   "37",  "22",   "22"],
  [222, "5.5",  "7",   "5",    "6.5", "37.5","22.5", "22.5"],
  [225, "6",    "7.5", "5.5",  "7",   "38",  "23",   "23"],
  [229, "6.5",  "8",   "6",    "7.5", "38.5","23",   "23"],
  [232, "7",    "8.5", "6.5",  "8",   "39",  "23.5", "23.5"],
  [235, "7.5",  "9",   "7",    "8.5", "39.5","24",   "24"],
  [238, "8",    "9.5", "7.5",  "9",   "40",  "24",   "24"],
  [241, "8.5",  "10",  "8",    "9.5", "41",  "24.5", "24.5"],
  [245, "9",    "10.5","8.5",  "10",  "41.5","25",   "25"],
  [248, "9.5",  "11",  "9",    "10.5","42",  "25",   "25"],
  [251, "10",   "11.5","9.5",  "11",  "43",  "25.5", "25.5"],
  [254, "10.5", "12",  "10",   "11.5","43.5","26",   "26"],
  [257, "11",   "12.5","10.5", "12",  "44",  "26",   "26"],
  [260, "11.5", "13",  "11",   "12.5","44.5","26.5", "26.5"],
  [264, "12",   "13.5","11.5", "13",  "45",  "27",   "27"],
  [267, "12.5", "14",  "12",   "13.5","46",  "27",   "27"],
  [270, "13",   "14.5","12.5", "14",  "46.5","27.5", "27.5"],
  [273, "13.5", "15",  "13",   "14.5","47",  "28",   "28"],
  [279, "14",   "15.5","13.5", "15",  "48",  "28",   "28"],
  [286, "15",   "16",  "14",   "15.5","49",  "29",   "29"],
];

type SizeSystem = "us_men" | "us_women" | "uk_men" | "uk_women" | "eu" | "cm" | "jp" | "mm";
const IDX: Record<SizeSystem, number> = { mm: 0, us_men: 1, us_women: 2, uk_men: 3, uk_women: 4, eu: 5, cm: 6, jp: 7 };
const LABELS: Record<SizeSystem, string> = {
  mm: "Foot Length (mm)",
  us_men: "US Men",
  us_women: "US Women",
  uk_men: "UK Men",
  uk_women: "UK Women",
  eu: "EU",
  cm: "CM (Mondopoint)",
  jp: "Japan (JP)",
};
const SYSTEMS = Object.keys(LABELS) as SizeSystem[];

export default function ShoeSizeConverter() {
  const [inputSystem, setInputSystem] = useState<SizeSystem>("us_men");
  const [inputValue, setInputValue] = useState("10");

  const matchedRow = useMemo(() => {
    const v = inputValue.trim();
    if (!v) return null;
    const colIdx = IDX[inputSystem];
    return SIZES.find(row => String(row[colIdx]).toLowerCase() === v.toLowerCase()) ?? null;
  }, [inputValue, inputSystem]);

  const DISPLAY_SYSTEMS: SizeSystem[] = ["us_men", "us_women", "uk_men", "uk_women", "eu", "cm", "jp", "mm"];

  return (
    <div style={{ "--calc-hue": "330" } as React.CSSProperties} className="min-h-screen bg-background">
      <SEO
        title="Shoe Size Converter — US, UK, EU, CM, Japan Size Chart"
        description="Convert shoe sizes between US Men, US Women, UK, EU, CM (mondopoint), and Japan sizing systems. Free online shoe size converter with full size chart."
      />
      <nav className="max-w-6xl mx-auto px-4 pt-4 pb-0 text-sm text-muted-foreground flex gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link><span>/</span>
        <Link href="/category/conversion" className="hover:text-foreground transition-colors">Conversion Tools</Link><span>/</span>
        <span className="text-foreground font-medium">Shoe Size Converter</span>
      </nav>
      <header className="max-w-6xl mx-auto px-4 pt-6 pb-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[hsl(var(--calc-hue),60%,50%)] bg-[hsl(var(--calc-hue),80%,95%)] dark:bg-[hsl(var(--calc-hue),40%,20%)] px-3 py-1 rounded-full mb-3">Conversion Tools</div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3">Shoe Size Converter</h1>
        <div className="flex flex-wrap gap-2 mb-4">
          {["Free","US, UK, EU, JP","Men & Women","No Signup"].map(b => <span key={b} className="text-xs bg-muted text-muted-foreground px-2.5 py-1 rounded-full font-medium">{b}</span>)}
        </div>
        <p className="text-muted-foreground text-lg max-w-2xl">Convert shoe sizes between US Men, US Women, UK, EU (European), CM mondopoint, and Japan sizing systems. Includes a full shoe size chart for easy reference.</p>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <section className="lg:col-span-3 space-y-6">
          <div className="tool-calc-card">
            <h2 className="text-xl font-bold mb-5">Shoe Size Converter</h2>
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="tool-calc-label">From Sizing System</label>
                <select className="tool-calc-input" value={inputSystem} onChange={e => { setInputSystem(e.target.value as SizeSystem); setInputValue(""); }}>
                  {SYSTEMS.map(s => <option key={s} value={s}>{LABELS[s]}</option>)}
                </select>
              </div>
              <div>
                <label className="tool-calc-label">Size</label>
                <input className="tool-calc-input font-mono" type="text" value={inputValue} onChange={e => setInputValue(e.target.value)} placeholder={inputSystem === "us_men" ? "10" : inputSystem === "eu" ? "43" : "..."} />
              </div>
            </div>

            {matchedRow ? (
              <AnimatePresence mode="wait">
                <motion.div key={inputValue + inputSystem} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {DISPLAY_SYSTEMS.map(s => (
                      <div key={s} className={`tool-calc-result ${s === inputSystem ? "ring-2 ring-[hsl(var(--calc-hue),60%,50%)] ring-offset-1" : ""}`}>
                        <p className="text-xs text-muted-foreground mb-1">{LABELS[s]}</p>
                        <p className="tool-calc-number text-xl font-bold font-mono">{matchedRow[IDX[s]]}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            ) : inputValue ? (
              <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">Size not found. Try a standard size (e.g., 9, 10, 10.5 for US Men).</div>
            ) : null}
          </div>

          <div className="tool-calc-card">
            <h2 className="text-xl font-bold mb-4">Full Shoe Size Chart</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead><tr className="bg-muted/50">{["US Men","US Women","UK Men","UK Women","EU","CM","JP","mm"].map(h => <th key={h} className="px-3 py-2 text-left font-semibold text-muted-foreground whitespace-nowrap">{h}</th>)}</tr></thead>
                <tbody>
                  {SIZES.map(row => (
                    <tr key={row[0]} className="border-t border-border hover:bg-muted/20 transition-colors">
                      <td className="px-3 py-1.5 font-mono font-bold text-[hsl(var(--calc-hue),60%,50%)]">{row[1]}</td>
                      <td className="px-3 py-1.5 font-mono">{row[2]}</td>
                      <td className="px-3 py-1.5 font-mono">{row[3]}</td>
                      <td className="px-3 py-1.5 font-mono">{row[4]}</td>
                      <td className="px-3 py-1.5 font-mono">{row[5]}</td>
                      <td className="px-3 py-1.5 font-mono">{row[6]}</td>
                      <td className="px-3 py-1.5 font-mono">{row[7]}</td>
                      <td className="px-3 py-1.5 font-mono text-muted-foreground">{row[0]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="tool-calc-card">
            <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
            <div className="space-y-3">
              <FaqItem q="How do I convert US men's to US women's shoe sizes?" a="Add 1.5 to the men's size for the equivalent women's size. Example: Men's 10 = Women's 11.5. This is because women's shoes are cut ~1.5 sizes larger than men's for the same foot length." />
              <FaqItem q="How do I convert US to EU shoe sizes?" a="For men: EU = US + 33 (approximately). For US Men's 10: 10 + 33 = EU 43. For women: EU ≈ US + 31. These are approximate — always check a size chart as brands vary." />
              <FaqItem q="What is mondopoint (CM) sizing?" a="Mondopoint is an ISO standard that measures foot length directly in centimeters or millimeters. It's the most precise sizing system and is used widely in Japan, Korea, and for military/ski boots." />
              <FaqItem q="Why do shoe sizes differ between brands?" a="Sizing systems were developed independently in different countries with no universal standard. Additionally, brands design shoes with different lasts (foot molds), so a size 10 from Nike may fit differently than a size 10 from Adidas." />
              <FaqItem q="How do I measure my foot for accurate sizing?" a="Stand on paper, trace your foot, and measure the longest point (heel to longest toe) in mm. Compare to the mondopoint column — this is your most accurate size. Always measure both feet and use the larger measurement." />
              <FaqItem q="Are UK and US shoe sizes the same?" a="No. UK men's sizes are about 0.5 sizes smaller than US men's. UK 9 = US 9.5 (men). UK women's sizes are about 2 sizes smaller than US women's. UK 7 = US 9 (women)." />
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-[hsl(var(--calc-hue),60%,50%)] to-[hsl(var(--calc-hue),50%,38%)] p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-2">More Conversion Tools</h2>
            <p className="mb-5 opacity-90">Explore our full collection of converters.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/conversion/cooking-converter" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-5 py-2.5 rounded-xl font-semibold transition-colors text-sm">Cooking Converter</Link>
              <Link href="/conversion/weight-converter" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-5 py-2.5 rounded-xl font-semibold transition-colors text-sm">Weight Converter</Link>
            </div>
          </div>
        </section>
        <aside className="space-y-5">
          <div className="sticky top-4 space-y-5">
            <div className="tool-calc-card p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Related Tools</p>
              <div className="space-y-1.5 text-sm">
                {[["/conversion/cooking-converter","Cooking Converter"],["/conversion/weight-converter","Weight Converter"],["/conversion/length-converter","Length Converter"],["/health/bmi-calculator","BMI Calculator"],["/conversion/temperature-converter","Temperature Converter"]].map(([href, label]) => (
                  <Link key={href} href={href} className="flex items-center gap-2 py-1 text-muted-foreground hover:text-foreground transition-colors">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[hsl(var(--calc-hue),60%,50%)] shrink-0" />{label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="tool-calc-card p-4">
              <div className="space-y-2 text-xs text-muted-foreground">
                {["US, UK, EU, JP sizes","Men & women charts","Full size table","Free, no login"].map(t => (
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
