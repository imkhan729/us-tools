import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, ArrowRight,
  Zap, Smartphone, Shield, Lightbulb, Copy, Check,
  Home, Ruler, Box, Calculator, Maximize, Plus, Trash2,
  Star, BadgeCheck, Lock, CheckCircle2,
} from "lucide-react";
import { getToolPath } from "@/data/tools";

// ── Calculator Logic ──
type Unit = "imperial" | "metric";

interface Section {
  id: string;
  name: string;
  length: string;
  width: string;
}

function useRoomAreaCalc() {
  const [unit, setUnit] = useState<Unit>("metric");
  
  const [sections, setSections] = useState<Section[]>([
    { id: "1", name: "Main Area", length: "", width: "" }
  ]);

  const addSection = () => {
    setSections([...sections, { id: Math.random().toString(), name: `Section ${sections.length + 1}`, length: "", width: "" }]);
  };

  const removeSection = (id: string) => {
    if (sections.length > 1) {
      setSections(sections.filter(s => s.id !== id));
    }
  };

  const updateSection = (id: string, field: keyof Section, value: string) => {
    setSections(sections.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const result = useMemo(() => {
    let totalArea = 0;
    const areas = sections.map(s => {
      const l = parseFloat(s.length) || 0;
      const w = parseFloat(s.width) || 0;
      const area = l * w;
      totalArea += area;
      return { id: s.id, area };
    });

    if (totalArea <= 0) return null;

    return {
      totalArea,
      areas,
    };
  }, [sections]);

  return {
    unit, setUnit,
    sections, addSection, removeSection, updateSection,
    result,
  };
}

// ── Result Insight Component ──
function ResultInsight({ result, unit }: { result: any; unit: Unit }) {
  if (!result) return null;
  const areaUnit = unit === "imperial" ? "sq ft" : "m²";

  const message = `The combined total area of your measured room sections is ${result.totalArea.toFixed(2)} ${areaUnit}. Use this precise figure when purchasing paint, flooring, or calculating heating/cooling (BTU) requirements.`;

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/20">
      <div className="flex gap-2 items-start">
        <Lightbulb className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-foreground/80 leading-relaxed">{message}</p>
      </div>
    </motion.div>
  );
}

// ── FAQ Item Component ──
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-indigo-500/40 transition-colors">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-indigo-500">
          <ChevronDown className="w-5 h-5" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div key="answer" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} className="overflow-hidden">
            <p className="px-5 pb-5 text-muted-foreground leading-relaxed border-t border-border pt-4">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Related Tools ──
const RELATED_TOOLS = [
  { title: "Flooring Calculator", slug: "flooring-calculator", icon: <Home className="w-5 h-5" />, color: 16, benefit: "Estimate boxes needed" },
  { title: "Area Converter", slug: "area-converter", icon: <Calculator className="w-5 h-5" />, color: 152, benefit: "Square feet to meters" },
  { title: "Length Converter", slug: "length-converter", icon: <Ruler className="w-5 h-5" />, color: 265, benefit: "Convert metric & imperial" },
];

export default function RoomAreaCalculator() {
  const calc = useRoomAreaCalc();
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const dimUnit = calc.unit === "imperial" ? "ft" : "m";
  const areaUnit = calc.unit === "imperial" ? "sq ft" : "m²";

  return (
    <Layout>
      <SEO
        title="Room Area Calculator – Square Footage & Meters | US Online Tools"
        description="Calculate the exact square footage or square meters of any room. Supports L-shaped and multi-section rooms for precise painting, flooring, and HVAC estimates."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-indigo-500" strokeWidth={3} />
          <Link href="/category/construction" className="text-muted-foreground hover:text-foreground transition-colors">Construction &amp; DIY</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-indigo-500" strokeWidth={3} />
          <span className="text-foreground">Room Area Calculator</span>
        </nav>

        <section className="rounded-2xl overflow-hidden border border-indigo-500/15 bg-gradient-to-br from-indigo-500/5 via-card to-blue-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Maximize className="w-3.5 h-3.5" /> Construction &amp; DIY
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">
            Room Area Calculator
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Accurately measure floor or wall space for any complex room shape. Combine multiple rectangular sections instantly to find total square feet or square meters.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20"><BadgeCheck className="w-3.5 h-3.5" /> 100% Free</span>
            <span className="inline-flex items-center gap-1.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-xs px-3 py-1.5 rounded-full border border-indigo-500/20"><Zap className="w-3.5 h-3.5" /> Instant Results</span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20"><Lock className="w-3.5 h-3.5" /> No Signup</span>
            <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs px-3 py-1.5 rounded-full border border-cyan-500/20"><Smartphone className="w-3.5 h-3.5" /> Mobile Ready</span>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">
            <section className="space-y-5">
              <div className="rounded-2xl overflow-hidden border border-indigo-500/20 shadow-lg shadow-indigo-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 to-blue-400" />
                <div className="bg-card p-6 md:p-8 space-y-5">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-400 flex items-center justify-center flex-shrink-0">
                      <Maximize className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Area Summation Tool</p>
                      <p className="text-sm text-muted-foreground">Add multiple sections for complex floor plans.</p>
                    </div>
                  </div>

                  <div className="tool-calc-card" style={{ "--calc-hue": 230 } as React.CSSProperties}>
                    <div className="mb-6">
                      <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Unit System</label>
                      <div className="flex rounded-lg overflow-hidden border border-border sm:w-1/2">
                         <button onClick={() => calc.setUnit("metric")}
                          className={`flex-1 py-2 text-sm font-bold transition-colors ${calc.unit === "metric" ? "bg-indigo-500 text-white" : "bg-card text-muted-foreground hover:text-foreground"}`}
                        >Metric (m / m²)</button>
                        <button onClick={() => calc.setUnit("imperial")}
                          className={`flex-1 py-2 text-sm font-bold transition-colors ${calc.unit === "imperial" ? "bg-indigo-500 text-white" : "bg-card text-muted-foreground hover:text-foreground"}`}
                        >Imperial (ft / sq ft)</button>
                      </div>
                    </div>

                    <div className="space-y-3 mb-5">
                      <div className="flex justify-between items-center px-1">
                        <span className="text-xs font-bold text-foreground uppercase tracking-widest">Room Sections</span>
                        <button onClick={calc.addSection} className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline">
                          <Plus className="w-3.5 h-3.5" /> Add Section
                        </button>
                      </div>
                      
                      <AnimatePresence>
                        {calc.sections.map((section, idx) => (
                          <motion.div key={section.id} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="p-4 bg-muted/30 border border-border rounded-xl">
                            <div className="flex justify-between items-center mb-3">
                              <input type="text" className="bg-transparent border-none text-sm font-bold p-0 focus:ring-0 text-foreground w-1/2" value={section.name} onChange={e => calc.updateSection(section.id, 'name', e.target.value)} />
                              {calc.sections.length > 1 && (
                                <button onClick={() => calc.removeSection(section.id)} className="text-muted-foreground hover:text-red-500 transition-colors">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div><label className="text-xs font-semibold text-muted-foreground mb-1 block">Length ({dimUnit})</label><input type="number" placeholder="5" className="tool-calc-input w-full" value={section.length} onChange={e => calc.updateSection(section.id, 'length', e.target.value)} /></div>
                              <div><label className="text-xs font-semibold text-muted-foreground mb-1 block">Width ({dimUnit})</label><input type="number" placeholder="4" className="tool-calc-input w-full" value={section.width} onChange={e => calc.updateSection(section.id, 'width', e.target.value)} /></div>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>

                    <div className="tool-calc-result p-6 text-center rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Total Room Area</p>
                      <p className="text-5xl font-black text-indigo-600 dark:text-indigo-400">{calc.result?.totalArea ? calc.result.totalArea.toFixed(2) : "0.00"} <span className="text-2xl font-bold uppercase text-foreground">{areaUnit}</span></p>
                    </div>

                    <ResultInsight result={calc.result} unit={calc.unit} />
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Mastering Complex Floor Plans</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">Rarely are rooms perfectly squared. L-shapes, T-shapes, alcoves, and extended closets distort basic mathematical calculations. Our robust Area tool allows infinite summation scaling. Here's how to mathematically map your house purely by dividing areas.</p>
              
              <ol className="space-y-5 mb-8">
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Subdivide Complex Geometric Rooms</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Imagine an L-Shaped living room. Drop a mental boundary making two distinct separate rectangles. Measure the primary rectangular block and input it as "Main Area". Then measure the secondary extended block into the adjacent arm.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Add Integrated Closets Separately</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Standard built-in closets protruding out of straight bedroom walls act identically as their own miniature rectangular section. Click the "Add Section" module, label it "Closet Space", and add its small 2x6 foot measurement independently to smoothly calculate the carpet overlay.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Exclude Permanent Dead Space (If Needed)</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">If measuring specifically for tiles around an immovable central concrete fireplace structure or vast kitchen island, it is possible to subtract this. You'd calculate total area, then calculate the island area, to manually deduct the island size later.</p>
                  </div>
                </li>
              </ol>

            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Area Estimation & Its Crucial Importance</h2>
              <p className="text-muted-foreground text-sm mb-6">Why mapping precise square footage drives entirely disconnected projects:</p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-orange-500/5 border border-orange-500/20">
                  <div className="w-3 h-3 rounded-full bg-orange-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">BTU & HVAC Cooling Capacities</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">Purchasing an air conditioning system revolves strictly around thermal volume. A standard AC demands 20 BTUs per square foot minimally. A 500 sq ft room requires exactly a 10,000 BTU unit; undersized models strictly fail to dehumidify, oversized models instantly rapidly cycle, destroying components prematurely.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-green-500/5 border border-green-500/20">
                  <div className="w-3 h-3 rounded-full bg-green-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Architectural Permit Costing</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">Local city municipalities explicitly index their renovation taxing systems and property footprint guidelines strictly utilizing total gross inner area metering. Precision provides exact budget scopes eliminating arbitrary legal shocks.</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem q="How do I measure a room that isn't square?" a="For trapezoids or non-parallelogram slanted rooms, typically you calculate the widest length and the longest straight length, multiplying exactly as a heavy rectangle. The dead corners are offset as structural waste during material cuts anyway." />
                <FaqItem q="Does subtracting cabinets make sense?" a="Generally, do not subtract fixed cabinets from flooring area plans if you ever plan to swap out modern cabinet styles. Many homeowners find ugly bare concrete completely exposed under replaced thinner cabinets decades later. It is far safer to floor firmly to the wall rim." />
                <FaqItem q="How do I handle bay windows or curves?" a="For extreme precision, you multiply the radius squared by 3.14 (pi) and half it for a semi-circle window. In domestic scenarios, simply treat the arc width and maximum depth as a standard projecting tiny rectangle for a massive waste-safety buffer." />
              </div>
            </section>

          </div>
          <div className="space-y-6">
            <div className="sticky top-28 space-y-6">
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight mb-3 uppercase">Related Tools</h3>
                <div className="space-y-0.5">
                  {RELATED_TOOLS.map((tool) => (
                    <Link key={tool.slug} href={getToolPath(tool.slug)} className="group flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-muted transition-all">
                      <div className="w-7 h-7 rounded-md flex items-center justify-center text-white flex-shrink-0 [&>svg]:w-3.5 [&>svg]:h-3.5" style={{ background: `linear-gradient(135deg, hsl(${tool.color} 70% 55%), hsl(${tool.color} 75% 42%))` }}>{tool.icon}</div>
                      <div className="flex-1 min-w-0"><p className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors truncate">{tool.title}</p><p className="text-[10px] text-muted-foreground/60 truncate">{tool.benefit}</p></div>
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-indigo-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
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
