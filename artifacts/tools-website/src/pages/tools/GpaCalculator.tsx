import { useState } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, ArrowRight, Zap, CheckCircle2, Smartphone, Shield, Clock,
  BookOpen, Lightbulb, Copy, Check, GraduationCap, Calculator, Trophy, BarChart3, Plus, Trash2,
} from "lucide-react";
import { getToolPath } from "@/data/tools";

const GRADE_POINTS: Record<string, number> = {
  "A+": 4.0, "A": 4.0, "A-": 3.7, "B+": 3.3, "B": 3.0, "B-": 2.7,
  "C+": 2.3, "C": 2.0, "C-": 1.7, "D+": 1.3, "D": 1.0, "D-": 0.7, "F": 0.0,
};

type Course = { name: string; grade: string; credits: string };

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-primary/40 transition-colors">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-primary"><ChevronDown className="w-5 h-5" /></motion.span>
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

const RELATED_TOOLS = [
  { title: "Grade Calculator", slug: "grade-calculator", icon: <GraduationCap className="w-5 h-5" />, color: 217 },
  { title: "Percentage Calculator", slug: "percentage-calculator", icon: <Calculator className="w-5 h-5" />, color: 152 },
  { title: "Average Calculator", slug: "average-calculator", icon: <BarChart3 className="w-5 h-5" />, color: 340 },
  { title: "Test Grade Calculator", slug: "test-grade-calculator", icon: <BookOpen className="w-5 h-5" />, color: 25 },
  { title: "CGPA Calculator", slug: "cgpa-calculator", icon: <Trophy className="w-5 h-5" />, color: 265 },
  { title: "Compound Interest Calculator", slug: "compound-interest-calculator", icon: <Calculator className="w-5 h-5" />, color: 45 },
];

export default function GpaCalculator() {
  const [courses, setCourses] = useState<Course[]>([
    { name: "", grade: "A", credits: "3" },
    { name: "", grade: "B+", credits: "3" },
    { name: "", grade: "A-", credits: "4" },
    { name: "", grade: "B", credits: "3" },
  ]);
  const [copied, setCopied] = useState(false);
  const copyLink = () => { navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const addCourse = () => setCourses(c => [...c, { name: "", grade: "A", credits: "3" }]);
  const removeCourse = (i: number) => setCourses(c => c.filter((_, idx) => idx !== i));
  const updateCourse = (i: number, field: keyof Course, value: string) => {
    setCourses(c => c.map((course, idx) => idx === i ? { ...course, [field]: value } : course));
  };

  const result = (() => {
    let totalPoints = 0, totalCredits = 0;
    for (const course of courses) {
      const credits = parseFloat(course.credits);
      if (isNaN(credits) || credits <= 0) continue;
      const gp = GRADE_POINTS[course.grade] ?? 0;
      totalPoints += gp * credits;
      totalCredits += credits;
    }
    if (totalCredits === 0) return null;
    return { gpa: totalPoints / totalCredits, totalCredits, totalPoints };
  })();

  const gpaColor = result
    ? result.gpa >= 3.5 ? "text-emerald-600 dark:text-emerald-400"
    : result.gpa >= 3.0 ? "text-blue-600 dark:text-blue-400"
    : result.gpa >= 2.0 ? "text-amber-600 dark:text-amber-400"
    : "text-red-600 dark:text-red-400"
    : "";

  return (
    <Layout>
      <SEO title="GPA Calculator - Free Online Tool | Calculate Your Grade Point Average" description="Free online GPA calculator. Calculate your college or high school GPA instantly. Add courses, grades, and credits. Supports 4.0 scale. No signup required." />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-primary" strokeWidth={3} />
          <Link href="/category/education" className="text-muted-foreground hover:text-foreground transition-colors">Student & Education</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-primary" strokeWidth={3} />
          <span className="text-foreground">GPA Calculator</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            <section>
              <div className="inline-flex items-center gap-1.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-4"><BookOpen className="w-3.5 h-3.5" /> Student & Education</div>
              <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight leading-[1.1] mb-3">GPA Calculator</h1>
              <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">Calculate your Grade Point Average instantly. Add your courses with grades and credit hours to get your semester or cumulative GPA on the standard 4.0 scale — free, accurate, and no signup needed.</p>
            </section>

            <section className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/15">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0"><Zap className="w-5 h-5 text-primary" /></div>
              <div><p className="font-bold text-foreground text-sm">Add your courses below</p><p className="text-muted-foreground text-sm">Enter grade and credits for each course — GPA updates automatically.</p></div>
            </section>

            <section className="space-y-5">
              <div className="tool-calc-card" style={{ "--calc-hue": 265 } as React.CSSProperties}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="tool-calc-number">1</div>
                  <h3 className="text-lg font-bold text-foreground">GPA Calculator</h3>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="grid grid-cols-[1fr_100px_80px_40px] gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <span>Course Name</span><span>Grade</span><span>Credits</span><span></span>
                  </div>
                  {courses.map((course, i) => (
                    <div key={i} className="grid grid-cols-[1fr_100px_80px_40px] gap-2">
                      <input type="text" placeholder={`Course ${i + 1}`} className="tool-calc-input w-full text-sm" value={course.name} onChange={e => updateCourse(i, "name", e.target.value)} />
                      <select className="tool-calc-input w-full text-sm" value={course.grade} onChange={e => updateCourse(i, "grade", e.target.value)}>
                        {Object.keys(GRADE_POINTS).map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                      <input type="number" min="0.5" max="12" step="0.5" className="tool-calc-input w-full text-sm text-center" value={course.credits} onChange={e => updateCourse(i, "credits", e.target.value)} />
                      <button onClick={() => removeCourse(i)} className="flex items-center justify-center text-muted-foreground hover:text-red-500 transition-colors" disabled={courses.length <= 1}><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                </div>

                <button onClick={addCourse} className="flex items-center gap-2 text-sm font-bold text-primary hover:text-primary/80 mb-5"><Plus className="w-4 h-4" /> Add Course</button>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="tool-calc-result text-center">
                    <div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Your GPA</div>
                    <div className={`text-2xl font-black ${gpaColor}`}>{result ? result.gpa.toFixed(2) : "--"}</div>
                  </div>
                  <div className="tool-calc-result text-center">
                    <div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Total Credits</div>
                    <div className="text-lg font-black text-foreground">{result ? result.totalCredits : "--"}</div>
                  </div>
                  <div className="tool-calc-result text-center">
                    <div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Quality Points</div>
                    <div className="text-lg font-black text-foreground">{result ? result.totalPoints.toFixed(1) : "--"}</div>
                  </div>
                </div>

                {result && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/20">
                    <div className="flex gap-2 items-start">
                      <Lightbulb className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-foreground/80 leading-relaxed">
                        Your GPA is <strong>{result.gpa.toFixed(2)}</strong> on a 4.0 scale across {result.totalCredits} credit hours.
                        {result.gpa >= 3.5 ? " Excellent! You're on the Dean's List level." : result.gpa >= 3.0 ? " Good job! You're above the B average." : result.gpa >= 2.0 ? " You're passing, but there's room for improvement." : " Consider focusing on improving your grades next semester."}
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How GPA Is Calculated</h2>
              <div className="space-y-5">
                <div className="flex gap-4"><div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0 font-bold text-sm">1</div><div><h4 className="font-bold text-foreground mb-1">Grade Points</h4><p className="text-muted-foreground text-sm leading-relaxed">Each letter grade has a point value: A = 4.0, B = 3.0, C = 2.0, D = 1.0, F = 0.0. Plus/minus variants adjust by ±0.3 (e.g., B+ = 3.3, A- = 3.7).</p></div></div>
                <div className="flex gap-4"><div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 font-bold text-sm">2</div><div><h4 className="font-bold text-foreground mb-1">Quality Points</h4><p className="text-muted-foreground text-sm leading-relaxed">Multiply each course's grade points by its credit hours. Formula: <code className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">Quality Points = Grade Points × Credits</code></p></div></div>
                <div className="flex gap-4"><div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0 font-bold text-sm">3</div><div><h4 className="font-bold text-foreground mb-1">GPA Formula</h4><p className="text-muted-foreground text-sm leading-relaxed">Divide total quality points by total credit hours: <code className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">GPA = Total Quality Points / Total Credits</code></p></div></div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">GPA Scale Reference</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-border"><th className="text-left py-2 px-3 font-bold text-foreground">Grade</th><th className="text-center py-2 px-3 font-bold text-foreground">Points</th><th className="text-left py-2 px-3 font-bold text-foreground">Description</th></tr></thead>
                  <tbody>
                    {[["A/A+", "4.0", "Excellent"], ["A-", "3.7", "Very Good"], ["B+", "3.3", "Good"], ["B", "3.0", "Above Average"], ["B-", "2.7", "Slightly Above Average"], ["C+", "2.3", "Average"], ["C", "2.0", "Satisfactory"], ["C-", "1.7", "Below Average"], ["D+", "1.3", "Poor"], ["D", "1.0", "Below Satisfactory"], ["F", "0.0", "Failing"]].map(([g, p, d]) => (
                      <tr key={g} className="border-b border-border/50"><td className="py-2 px-3 font-bold text-foreground">{g}</td><td className="py-2 px-3 text-center font-mono">{p}</td><td className="py-2 px-3 text-muted-foreground">{d}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Why Use This Calculator?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[{ icon: <Zap className="w-4 h-4" />, text: "Instant GPA calculation as you add courses" }, { icon: <CheckCircle2 className="w-4 h-4" />, text: "Standard 4.0 scale with plus/minus grades" }, { icon: <Shield className="w-4 h-4" />, text: "No data stored — 100% private" }, { icon: <Smartphone className="w-4 h-4" />, text: "Works perfectly on mobile devices" }, { icon: <Clock className="w-4 h-4" />, text: "No signup or downloads required" }, { icon: <Calculator className="w-4 h-4" />, text: "Add unlimited courses with custom credits" }].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"><div className="text-primary">{item.icon}</div><span className="text-sm font-medium text-foreground">{item.text}</span></div>
                ))}
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-4">Understanding Your GPA</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p>Your Grade Point Average (GPA) is a standardized measure of academic achievement used by colleges and universities worldwide. It represents the average of your grades weighted by credit hours, calculated on a 4.0 scale in the United States.</p>
                <p>This free GPA calculator helps students calculate their semester GPA or cumulative GPA instantly. Whether you're a high school student planning for college admissions, a college student tracking academic progress, or a graduate student maintaining scholarship requirements, this tool gives precise results.</p>
                <h3 className="text-xl font-bold text-foreground pt-2">Why Your GPA Matters</h3>
                <ul className="space-y-2 ml-1">
                  {["College admissions decisions heavily weigh your high school GPA", "Scholarship eligibility often requires a minimum GPA threshold (usually 3.0+)", "Graduate school applications typically require 3.0+ undergraduate GPA", "Employers in competitive fields may ask for GPA on job applications", "Academic probation is triggered when GPA falls below 2.0 at most schools", "Dean's List and Latin honors require maintaining high GPA (usually 3.5+)"].map((item, i) => (
                    <li key={i} className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" /><span>{item}</span></li>
                  ))}
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem q="What is a GPA?" a="GPA stands for Grade Point Average. It's a numerical representation of your academic performance on a 4.0 scale, where A = 4.0 and F = 0.0. It's calculated by dividing your total quality points by total credit hours." />
                <FaqItem q="What's the difference between semester GPA and cumulative GPA?" a="Semester GPA covers only one term's courses. Cumulative GPA includes all courses from all semesters combined. Use this calculator for either by entering the appropriate courses." />
                <FaqItem q="What GPA do I need for Dean's List?" a="Most colleges require a 3.5 GPA or higher for Dean's List recognition, though requirements vary by institution. Some schools require 3.7 or higher." />
                <FaqItem q="How do credit hours affect GPA?" a="Credit hours weight your grades proportionally. A 4-credit course impacts your GPA more than a 1-credit course. This ensures that courses requiring more time and effort have greater influence on your overall average." />
                <FaqItem q="Is this GPA calculator accurate?" a="Yes. It uses the standard 4.0 scale with plus/minus grades. Results are calculated instantly in your browser with no rounding errors." />
                <FaqItem q="Is this tool free?" a="100% free with no ads, no signup, and no data collection. Your grades never leave your browser." />
              </div>
            </section>

            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-8 text-primary-foreground">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">More Student & Education Tools</h2>
                <p className="text-primary-foreground/80 mb-6 max-w-lg">Try our grade calculator, test score calculator, and 400+ more free tools for students.</p>
                <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary font-bold rounded-xl hover:-translate-y-0.5 transition-transform">Explore All Tools <ArrowRight className="w-4 h-4" /></Link>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <div className="sticky top-28 space-y-6">
              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="text-lg font-black text-foreground tracking-tight mb-4">Related Tools</h3>
                <div className="space-y-2">
                  {RELATED_TOOLS.map((tool) => (
                    <Link key={tool.slug} href={getToolPath(tool.slug)} className="group flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-all">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white flex-shrink-0" style={{ background: `linear-gradient(135deg, hsl(${tool.color} 70% 55%), hsl(${tool.color} 75% 42%))` }}>{tool.icon}</div>
                      <span className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors leading-snug">{tool.title}</span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary ml-auto opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>
              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="text-lg font-black text-foreground tracking-tight mb-2">Share This Tool</h3>
                <p className="text-sm text-muted-foreground mb-4">Help others calculate their GPA easily.</p>
                <button onClick={copyLink} className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform">{copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Link</>}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
