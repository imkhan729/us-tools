import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, BookOpen, Zap, Shield, Smartphone,
  Lock, BadgeCheck, Copy, Check, Lightbulb, ArrowRight,
  Plus, Trash2, Calculator, BarChart3, TrendingUp, Percent,
} from "lucide-react";

// ── Grade Scale ──
const letterGradeScale = [
  { min: 97, grade: "A+", gpa: 4.0 },
  { min: 93, grade: "A",  gpa: 4.0 },
  { min: 90, grade: "A-", gpa: 3.7 },
  { min: 87, grade: "B+", gpa: 3.3 },
  { min: 83, grade: "B",  gpa: 3.0 },
  { min: 80, grade: "B-", gpa: 2.7 },
  { min: 77, grade: "C+", gpa: 2.3 },
  { min: 73, grade: "C",  gpa: 2.0 },
  { min: 70, grade: "C-", gpa: 1.7 },
  { min: 67, grade: "D+", gpa: 1.3 },
  { min: 63, grade: "D",  gpa: 1.0 },
  { min: 60, grade: "D-", gpa: 0.7 },
  { min: 0,  grade: "F",  gpa: 0.0 },
];

function getLetterGrade(pct: number) {
  return letterGradeScale.find(s => pct >= s.min) || letterGradeScale[letterGradeScale.length - 1];
}

function getGradeColor(pct: number) {
  if (pct >= 90) return "text-emerald-600 dark:text-emerald-400";
  if (pct >= 80) return "text-blue-600 dark:text-blue-400";
  if (pct >= 70) return "text-amber-600 dark:text-amber-400";
  if (pct >= 60) return "text-orange-600 dark:text-orange-400";
  return "text-red-600 dark:text-red-400";
}

function getGradeBg(pct: number) {
  if (pct >= 90) return "bg-emerald-500";
  if (pct >= 80) return "bg-blue-500";
  if (pct >= 70) return "bg-amber-500";
  if (pct >= 60) return "bg-orange-500";
  return "bg-red-500";
}

interface Assignment {
  id: number;
  name: string;
  score: string;
  total: string;
  weight: string;
}

let nextId = 4;

// ── FAQ Component ──
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-violet-500/40 transition-colors">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left"
      >
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-violet-500">
          <ChevronDown className="w-5 h-5" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 text-muted-foreground leading-relaxed border-t border-border pt-4">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Related Tools ──
const RELATED_TOOLS = [
  { title: "Percentage Calculator", slug: "percentage-calculator", icon: <Percent className="w-5 h-5" />, color: 217, benefit: "Calculate any percentage instantly" },
  { title: "Average Calculator", slug: "average-calculator", icon: <BarChart3 className="w-5 h-5" />, color: 200, benefit: "Mean, median, mode in one tool" },
  { title: "Standard Deviation Calculator", slug: "online-standard-deviation-calculator", icon: <TrendingUp className="w-5 h-5" />, color: 152, benefit: "Analyze score distributions" },
  { title: "Mean Median Mode Calculator", slug: "mean-median-mode-calculator", icon: <Calculator className="w-5 h-5" />, color: 265, benefit: "Descriptive stats for grade sets" },
];

// ── Main Component ──
export default function GradeCalculator() {
  const [assignments, setAssignments] = useState<Assignment[]>([
    { id: 1, name: "Homework",    score: "85", total: "100", weight: "20" },
    { id: 2, name: "Midterm Exam", score: "78", total: "100", weight: "30" },
    { id: 3, name: "Final Exam",  score: "92", total: "100", weight: "50" },
  ]);
  const [useWeights, setUseWeights] = useState(true);
  const [targetGrade, setTargetGrade] = useState("90");
  const [finalWeight, setFinalWeight] = useState("30");
  const [copied, setCopied] = useState(false);

  const addRow = () => {
    setAssignments(prev => [...prev, { id: nextId++, name: "", score: "", total: "100", weight: "10" }]);
  };

  const removeRow = (id: number) => {
    setAssignments(prev => prev.filter(a => a.id !== id));
  };

  const updateRow = (id: number, field: keyof Assignment, value: string) => {
    setAssignments(prev => prev.map(a => a.id === id ? { ...a, [field]: value } : a));
  };

  const result = useMemo(() => {
    const valid = assignments.filter(a => a.score !== "" && a.total !== "" && parseFloat(a.total) > 0);
    if (valid.length === 0) return null;

    if (useWeights) {
      const totalWeight = valid.reduce((s, a) => s + (parseFloat(a.weight) || 0), 0);
      if (totalWeight === 0) return null;
      const weightedSum = valid.reduce((s, a) => {
        const pct = (parseFloat(a.score) / parseFloat(a.total)) * 100;
        return s + pct * (parseFloat(a.weight) || 0);
      }, 0);
      const avg = weightedSum / totalWeight;
      const letter = getLetterGrade(avg);
      return { avg, letter, totalWeight, mode: "weighted" };
    } else {
      const totalEarned  = valid.reduce((s, a) => s + parseFloat(a.score), 0);
      const totalPossible = valid.reduce((s, a) => s + parseFloat(a.total), 0);
      const avg = (totalEarned / totalPossible) * 100;
      const letter = getLetterGrade(avg);
      return { avg, letter, mode: "simple" };
    }
  }, [assignments, useWeights]);

  const neededGrade = useMemo(() => {
    if (!result || !targetGrade || !finalWeight) return null;
    const t = parseFloat(targetGrade);
    const w = parseFloat(finalWeight) / 100;
    if (!t || !w || w >= 1) return null;
    return (t - result.avg * (1 - w)) / w;
  }, [result, targetGrade, finalWeight]);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layout>
      <SEO
        title="Grade Calculator – Calculate Your Grade & GPA Instantly, Free | US Online Tools"
        description="Free online grade calculator. Calculate your current grade from weighted or point-based assignments. Find the exam score you need to hit your target grade. Includes letter grade and GPA conversion. No signup required."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        {/* ── BREADCRUMB ── */}
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-violet-500" strokeWidth={3} />
          <Link href="/category/student-education" className="text-muted-foreground hover:text-foreground transition-colors">Student &amp; Education</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-violet-500" strokeWidth={3} />
          <span className="text-foreground">Grade Calculator</span>
        </nav>

        {/* ── HERO ── */}
        <section className="rounded-2xl overflow-hidden border border-violet-500/15 bg-gradient-to-br from-violet-500/5 via-card to-fuchsia-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <BookOpen className="w-3.5 h-3.5" />
            Student &amp; Education
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">
            Grade Calculator
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Calculate your current grade from weighted or point-based assignments, find the exam score you need to hit your target, and see your letter grade and GPA — all in one place.
          </p>

          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20">
              <BadgeCheck className="w-3.5 h-3.5" /> 100% Free
            </span>
            <span className="inline-flex items-center gap-1.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-xs px-3 py-1.5 rounded-full border border-violet-500/20">
              <Zap className="w-3.5 h-3.5" /> Instant Results
            </span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20">
              <Lock className="w-3.5 h-3.5" /> No Signup
            </span>
            <span className="inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs px-3 py-1.5 rounded-full border border-blue-500/20">
              <Shield className="w-3.5 h-3.5" /> Privacy First
            </span>
            <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs px-3 py-1.5 rounded-full border border-cyan-500/20">
              <Smartphone className="w-3.5 h-3.5" /> Mobile Ready
            </span>
          </div>

          <p className="text-xs text-muted-foreground/60 font-medium">
            Category: Student &amp; Education &nbsp;·&nbsp; Last updated: March 2026
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* ── LEFT COLUMN ── */}
          <div className="lg:col-span-3 space-y-10">

            {/* ── TOOL WIDGET ── */}
            <section className="space-y-5">
              {/* Main grade calculator */}
              <div className="rounded-2xl overflow-hidden border border-violet-500/20 shadow-lg shadow-violet-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-violet-500 to-fuchsia-400" />
                <div className="bg-card p-6 md:p-8 space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-400 flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Assignment Grades</p>
                        <p className="text-sm text-muted-foreground">Results update as you type.</p>
                      </div>
                    </div>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <div
                        onClick={() => setUseWeights(!useWeights)}
                        className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${useWeights ? "bg-violet-600" : "bg-muted-foreground/30"}`}
                      >
                        <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${useWeights ? "translate-x-5" : ""}`} />
                      </div>
                      <span className="font-semibold text-foreground hidden sm:inline">Use Weights (%)</span>
                    </label>
                  </div>

                  {/* Table header */}
                  <div className={`grid gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground px-1 ${useWeights ? "grid-cols-[2fr_1fr_1fr_1fr_auto]" : "grid-cols-[2fr_1fr_1fr_auto]"}`}>
                    <span>Assignment</span>
                    <span>Score</span>
                    <span>Total</span>
                    {useWeights && <span>Weight %</span>}
                    <span />
                  </div>

                  <div className="space-y-2">
                    {assignments.map(a => (
                      <div key={a.id} className={`grid gap-2 items-center ${useWeights ? "grid-cols-[2fr_1fr_1fr_1fr_auto]" : "grid-cols-[2fr_1fr_1fr_auto]"}`}>
                        <input type="text" className="tool-calc-input text-sm" placeholder="Assignment name" value={a.name} onChange={e => updateRow(a.id, "name", e.target.value)} />
                        <input type="number" className="tool-calc-input text-sm text-center" placeholder="85" value={a.score} onChange={e => updateRow(a.id, "score", e.target.value)} min={0} />
                        <input type="number" className="tool-calc-input text-sm text-center" placeholder="100" value={a.total} onChange={e => updateRow(a.id, "total", e.target.value)} min={1} />
                        {useWeights && <input type="number" className="tool-calc-input text-sm text-center" placeholder="%" value={a.weight} onChange={e => updateRow(a.id, "weight", e.target.value)} min={0} max={100} />}
                        <button onClick={() => removeRow(a.id)} className="p-2 text-muted-foreground hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <button onClick={addRow} className="flex items-center gap-2 text-sm text-violet-600 hover:text-violet-700 font-bold transition-colors">
                    <Plus className="w-4 h-4" /> Add Assignment
                  </button>

                  <AnimatePresence mode="wait">
                    {result && (
                      <motion.div key={String(assignments.length) + String(useWeights)} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                        <div className="p-5 rounded-xl bg-violet-500/5 border border-violet-500/20 flex items-center justify-between flex-wrap gap-4">
                          <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Current Grade</p>
                            <p className={`text-5xl font-black ${getGradeColor(result.avg)}`}>{result.avg.toFixed(1)}%</p>
                            {result.mode === "weighted" && <p className="text-xs text-muted-foreground mt-1">Weighted average (total weight: {(result as any).totalWeight}%)</p>}
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Letter / GPA</p>
                            <p className={`text-5xl font-black ${getGradeColor(result.avg)}`}>{result.letter.grade}</p>
                            <p className="text-xs text-muted-foreground mt-1">GPA: {result.letter.gpa.toFixed(1)}</p>
                          </div>
                        </div>
                        <div className="h-3 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full ${getGradeBg(result.avg)}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(result.avg, 100)}%` }}
                            transition={{ duration: 0.7, ease: "easeOut" }}
                          />
                        </div>
                        <div className="p-4 rounded-xl bg-violet-500/5 border border-violet-500/20">
                          <div className="flex gap-2 items-start">
                            <Lightbulb className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-foreground/80 leading-relaxed">
                              Your current grade is <strong>{result.avg.toFixed(1)}%</strong> — a <strong>{result.letter.grade}</strong> ({result.letter.gpa.toFixed(1)} GPA).{" "}
                              {result.avg >= 90 ? "Excellent work — you're in the A range." : result.avg >= 80 ? "Good standing — you're in the B range." : result.avg >= 70 ? "Passing — you're in the C range. Consider reviewing missed material." : result.avg >= 60 ? "At risk — you're in the D range. Extra study sessions could help." : "Below passing — contact your instructor about options."}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Final exam calculator */}
              <div className="rounded-2xl overflow-hidden border border-fuchsia-500/20 shadow-lg shadow-fuchsia-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-fuchsia-500 to-pink-400" />
                <div className="bg-card p-6 md:p-8 space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-fuchsia-500 to-pink-400 flex items-center justify-center flex-shrink-0">
                      <Calculator className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Final Exam Calculator</p>
                      <p className="text-sm text-muted-foreground">What score do you need on your final?</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 max-w-sm">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Target Grade (%)</label>
                      <input type="number" className="tool-calc-input w-full" value={targetGrade} onChange={e => setTargetGrade(e.target.value)} min={0} max={100} placeholder="90" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Final Exam Weight (%)</label>
                      <input type="number" className="tool-calc-input w-full" value={finalWeight} onChange={e => setFinalWeight(e.target.value)} min={1} max={99} placeholder="30" />
                    </div>
                  </div>

                  {neededGrade !== null && result && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-5 rounded-xl bg-fuchsia-500/5 border border-fuchsia-500/20">
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">You need to score</p>
                      <p className={`text-4xl font-black mb-2 ${neededGrade > 100 ? "text-red-600 dark:text-red-400" : neededGrade < 0 ? "text-emerald-600 dark:text-emerald-400" : getGradeColor(neededGrade)}`}>
                        {neededGrade > 100 ? ">100%" : neededGrade < 0 ? "0%" : `${neededGrade.toFixed(1)}%`}
                      </p>
                      {neededGrade > 100 && <p className="text-red-500 text-sm">This target is not mathematically achievable given your current grade. Consider aiming for {(targetGrade ? parseFloat(targetGrade) - 5 : 85).toFixed(0)}% instead.</p>}
                      {neededGrade < 0 && <p className="text-emerald-600 dark:text-emerald-400 text-sm">You've already secured your target grade! Even a 0% on the final won't drop you below {targetGrade}%.</p>}
                      {neededGrade >= 0 && neededGrade <= 100 && <p className="text-muted-foreground text-sm">on your final exam (worth {finalWeight}%) to reach {targetGrade}% — {getLetterGrade(neededGrade).grade} ({getLetterGrade(neededGrade).gpa.toFixed(1)} GPA)</p>}
                    </motion.div>
                  )}
                </div>
              </div>
            </section>

            {/* ── HOW TO USE ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Use the Grade Calculator</h2>

              <p className="text-muted-foreground leading-relaxed mb-6">
                Whether you're tracking a single course or planning what score you need on a final exam, this tool covers both scenarios. Here's how to get the most accurate result.
              </p>

              <ol className="space-y-5 mb-8">
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Choose weighted or point-based grading</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Use the toggle at the top right. <strong className="text-foreground">Weighted mode</strong> is for courses where different assignments carry different percentages (e.g., homework 20%, midterm 30%, final 50%). <strong className="text-foreground">Point-based mode</strong> totals all earned points versus all possible points — useful when every point counts equally regardless of assignment type. Check your syllabus if unsure.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Enter each graded assignment</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      For each row, enter the assignment name, your score, and the total possible points. In weighted mode, also enter the weight percentage. Click "Add Assignment" to add more rows. Enter 0 for any missing or zero-scored assignments — this accurately reflects their impact on your final grade. The calculator updates your grade in real time as you type.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Use the Final Exam Calculator to plan ahead</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      In the second card, enter your desired final grade (e.g., 90 for an A-) and what percentage your final exam is worth. The calculator will tell you the minimum score you need. If the result shows over 100%, that target is not achievable — try a lower target. If it shows 0%, you've already secured your desired grade regardless of the final.
                    </p>
                  </div>
                </li>
              </ol>

              <div className="p-5 rounded-xl bg-muted/60 border border-border">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Core Formulas</p>
                <div className="space-y-3 mb-5">
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-violet-500 font-bold w-4 flex-shrink-0">W</span>
                    <code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">Grade = Σ(score/total × 100 × weight) ÷ Σ(weight)</code>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-fuchsia-500 font-bold w-4 flex-shrink-0">P</span>
                    <code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">Grade = Σ(scores earned) ÷ Σ(total possible) × 100</code>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-pink-500 font-bold w-4 flex-shrink-0">F</span>
                    <code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">Needed = (target − current × (1 − w)) ÷ w</code>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Weighted formula</strong> multiplies each assignment's percentage score by its weight, sums those products, and divides by the sum of weights. <strong className="text-foreground">Point-based formula</strong> simply totals all earned points over all possible points. The <strong className="text-foreground">final exam formula</strong> solves algebraically for the unknown exam score, where w is the decimal form of the final exam's weight.
                </p>
              </div>
            </section>

            {/* ── RESULT INTERPRETATION ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Grade Ranges &amp; What They Mean</h2>
              <p className="text-muted-foreground text-sm mb-6">How to interpret your calculated grade and plan your next steps:</p>

              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">A range (90–100%) — Excellent</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">A 90%+ grade places you on the Dean's List at most institutions and corresponds to a 3.7–4.0 GPA. This range is typically required for competitive graduate school applications, merit scholarships, and academic honors programs. Even within the A range, the difference between an A- (3.7) and an A (4.0) matters for cumulative GPA when multiplied across many courses over four years.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                  <div className="w-3 h-3 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">B range (80–89%) — Good</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">A B corresponds to a 2.7–3.3 GPA. Most undergraduate programs require at least a B average to remain in good academic standing. For courses in your major, a B- or lower may require a retake at some institutions. The B range is also the target for many students who want a competitive GPA without sacrificing time on extracurriculars, internships, or work.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                  <div className="w-3 h-3 rounded-full bg-amber-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">C range (70–79%) — Satisfactory</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">A C (1.7–2.3 GPA) is passing at most institutions but may not count toward major requirements. Some programs require a C or better to graduate. If you're in the C range mid-semester, use the Final Exam Calculator to identify exactly what score you need to boost your grade — a strong final performance can shift a C to a B in many courses.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-red-500/5 border border-red-500/20">
                  <div className="w-3 h-3 rounded-full bg-red-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">D/F range (below 70%) — At Risk</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">A D or F can result in academic probation, loss of financial aid, or the need to retake the course. If you're tracking below 70%, act now: visit office hours, form study groups, and check whether a late withdrawal option is still available. Use the Final Exam Calculator to determine what score is theoretically possible — if the needed score exceeds 100%, discuss options with your advisor.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* ── QUICK EXAMPLES ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Quick Examples</h2>

              <div className="overflow-x-auto rounded-xl border border-border mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/60">
                      <th className="text-left px-4 py-3 font-bold text-foreground">Scenario</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Scores</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Weights</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Grade</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground hidden sm:table-cell">Letter</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">Strong HW, weak final</td>
                      <td className="px-4 py-3 font-mono text-foreground">95, 65, 70</td>
                      <td className="px-4 py-3 font-mono text-foreground">20%, 30%, 50%</td>
                      <td className="px-4 py-3 font-bold text-amber-600 dark:text-amber-400">72.5%</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">C</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">Consistent performer</td>
                      <td className="px-4 py-3 font-mono text-foreground">85, 87, 84</td>
                      <td className="px-4 py-3 font-mono text-foreground">25%, 35%, 40%</td>
                      <td className="px-4 py-3 font-bold text-blue-600 dark:text-blue-400">85.4%</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">B</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">Dean's List candidate</td>
                      <td className="px-4 py-3 font-mono text-foreground">98, 94, 96</td>
                      <td className="px-4 py-3 font-mono text-foreground">20%, 30%, 50%</td>
                      <td className="px-4 py-3 font-bold text-emerald-600 dark:text-emerald-400">95.8%</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">A</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">Point-based (500 pts)</td>
                      <td className="px-4 py-3 font-mono text-foreground">420 / 500</td>
                      <td className="px-4 py-3 font-mono text-foreground">Equal</td>
                      <td className="px-4 py-3 font-bold text-blue-600 dark:text-blue-400">84.0%</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">B</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">Need 90% — current 82%</td>
                      <td className="px-4 py-3 font-mono text-foreground">Final worth 40%</td>
                      <td className="px-4 py-3 font-mono text-foreground">—</td>
                      <td className="px-4 py-3 font-bold text-fuchsia-600 dark:text-fuchsia-400">Need 103%</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Not possible</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">
                The last example shows a common situation — a student hoping to boost their B to an A discovers the math makes it impossible with only the final remaining. In this case, the calculator helps set realistic expectations early so the student can focus on other courses where improvement is still achievable.
              </p>
            </section>

            {/* ── WHY CHOOSE THIS ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Why Use This Grade Calculator</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {[
                  { title: "Weighted & point-based modes", desc: "Switch between grading systems with one toggle. The calculator automatically applies the correct formula for each mode — no manual switching between tools required." },
                  { title: "Final exam score solver", desc: "The algebraic solver tells you exactly what you need on your final. If the result is over 100% or below 0%, it tells you so clearly with a plain-English explanation." },
                  { title: "Add unlimited assignments", desc: "No artificial row limits. Whether your course has 5 assignments or 50, just click 'Add Assignment' to expand the table. Rows with no score are ignored automatically." },
                  { title: "Letter grade + GPA display", desc: "See your numeric average alongside its letter grade and 4.0-scale GPA equivalent, using the standard US grading scale. Ideal for tracking cumulative GPA across courses." },
                  { title: "Visual grade bar", desc: "A color-coded progress bar updates in real time as you enter scores — green for A, blue for B, amber for C, orange for D, red for F. Makes it easy to see at a glance where you stand." },
                  { title: "No account needed, ever", desc: "Your grade data is never sent to a server. All calculations happen in your browser and disappear when you close the tab. Nothing is stored, tracked, or shared." },
                ].map(f => (
                  <div key={f.title} className="p-4 rounded-xl bg-muted/50 border border-border">
                    <p className="font-bold text-foreground mb-1 text-sm">{f.title}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </div>
              <div className="p-5 rounded-xl bg-muted/60 border border-border text-sm text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Note:</strong> This tool uses the standard US 4.0 GPA scale and A–F letter grade system. GPA scales vary between institutions — some use a 4.3 scale (awarding A+ = 4.3) and others cap at 4.0 for both A and A+. Always verify with your registrar's office for official GPA calculations. This tool is intended for estimation only and does not replace official grade reports.
              </div>
            </section>

            {/* ── FAQ ── */}
            <section>
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                {[
                  { q: "How is a weighted grade calculated?", a: "In weighted grading, each assignment's percentage score is multiplied by its weight. Those products are summed and divided by the total weight. For example: if Homework (scored 90%) has weight 20% and the Final (scored 80%) has weight 80%, the weighted grade is (90×20 + 80×80) ÷ (20+80) = (1800+6400)÷100 = 82%. Our calculator handles this automatically." },
                  { q: "What grade do I need on my final exam?", a: "Use the Final Exam Calculator card. Enter your current grade (shown by the main calculator), your target final grade (e.g., 90 for an A-), and the weight of your final exam (e.g., 30%). The formula is: (target − current × (1 − final weight)) ÷ final weight. For example: target 90, current 85, final weight 30% → needed = (90 − 85 × 0.70) ÷ 0.30 = (90 − 59.5) ÷ 0.30 = 101.7% — not achievable." },
                  { q: "What is the GPA equivalent of each letter grade?", a: "Standard US 4.0 scale: A+ = 4.0, A = 4.0, A- = 3.7, B+ = 3.3, B = 3.0, B- = 2.7, C+ = 2.3, C = 2.0, C- = 1.7, D+ = 1.3, D = 1.0, D- = 0.7, F = 0.0. Note: some schools award A+ = 4.3. Check your institution's official scale." },
                  { q: "Can I use this if my course doesn't use weights?", a: "Yes — turn off the 'Use Weights' toggle. In point-based mode, you just enter the score you earned and the total possible points for each assignment. The calculator adds up all earned points and all possible points, then divides to get your percentage grade. This is the simplest grading system and works for courses where every point is equal regardless of assignment type." },
                  { q: "What happens if I enter a missing assignment?", a: "Enter 0 for the score and the full point value for total. This accurately models the impact of a missing assignment — a zero on a high-weight assignment will significantly lower your grade. Seeing this in real time helps you prioritize which work to complete or which instructor to contact about late submission policies." },
                  { q: "Does this work for college and high school?", a: "Yes — the A–F letter grade system and 4.0 GPA scale are standard across most US high schools and universities. For international grading systems (e.g., UK marks out of 100, European ECTS grades), use the numeric percentage result and convert manually using your institution's equivalency table." },
                ].map((faq, i) => (
                  <FaqItem key={i} q={faq.q} a={faq.a} />
                ))}
              </div>
            </section>

            {/* ── CTA ── */}
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-400 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Explore More Student Tools</h2>
                <p className="text-white/80 mb-6 max-w-lg">
                  Browse 400+ free tools including GPA calculators, average calculators, statistics tools, and more — all free, all instant.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-violet-600 font-bold rounded-xl hover:-translate-y-0.5 transition-transform"
                >
                  Explore All Tools <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </section>

          </div>

          {/* ── SIDEBAR ── */}
          <div className="space-y-6">
            <div className="sticky top-28 space-y-6">

              {/* Related Tools */}
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight mb-3 uppercase">Related Tools</h3>
                <div className="space-y-0.5">
                  {RELATED_TOOLS.map((tool) => (
                    <Link
                      key={tool.slug}
                      href={`/tools/${tool.slug}`}
                      className="group flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-muted transition-all"
                    >
                      <div
                        className="w-7 h-7 rounded-md flex items-center justify-center text-white flex-shrink-0 [&>svg]:w-3.5 [&>svg]:h-3.5"
                        style={{ background: `linear-gradient(135deg, hsl(${tool.color} 70% 55%), hsl(${tool.color} 75% 42%))` }}
                      >
                        {tool.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors truncate">{tool.title}</p>
                        <p className="text-[10px] text-muted-foreground/60 truncate">{tool.benefit}</p>
                      </div>
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-violet-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Share Card */}
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-1.5">Share This Tool</h3>
                <p className="text-xs text-muted-foreground mb-3">Help fellow students calculate their grades.</p>
                <button
                  onClick={copyLink}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-violet-500 to-fuchsia-400 text-white text-sm font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform"
                >
                  {copied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy Link</>}
                </button>
              </div>

              {/* On This Page */}
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-3">On This Page</h3>
                <div className="space-y-0.5">
                  {[
                    "Calculator",
                    "How to Use",
                    "Grade Ranges",
                    "Quick Examples",
                    "Why Use This",
                    "FAQ",
                  ].map((label) => (
                    <a
                      key={label}
                      href={`#${label.toLowerCase().replace(/\s/g, "-")}`}
                      className="flex items-center gap-2 text-xs text-muted-foreground hover:text-violet-500 font-medium py-1.5 transition-colors"
                    >
                      <div className="w-1 h-1 rounded-full bg-violet-500/40 flex-shrink-0" />
                      {label}
                    </a>
                  ))}
                </div>
              </div>

              {/* Grade Scale Quick Reference */}
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-3">Grade Scale</h3>
                <div className="space-y-1">
                  {[
                    { g: "A+ / A", r: "90–100%", c: "text-emerald-600 dark:text-emerald-400" },
                    { g: "B+ / B / B-", r: "80–89%", c: "text-blue-600 dark:text-blue-400" },
                    { g: "C+ / C / C-", r: "70–79%", c: "text-amber-600 dark:text-amber-400" },
                    { g: "D",           r: "60–69%", c: "text-orange-600 dark:text-orange-400" },
                    { g: "F",           r: "Below 60%", c: "text-red-600 dark:text-red-400" },
                  ].map(row => (
                    <div key={row.g} className="flex items-center justify-between text-xs py-1">
                      <span className={`font-bold ${row.c}`}>{row.g}</span>
                      <span className="text-muted-foreground">{row.r}</span>
                    </div>
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
