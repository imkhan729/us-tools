import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, GraduationCap, ArrowRight,
  Zap, Smartphone, Shield, Lightbulb, Copy, Check,
  BadgeCheck, Lock, Plus, Trash2, BookOpen, BarChart3, Star, Calculator
} from "lucide-react";

const GRADE_SCALE: Record<string, number> = {
  "A+": 4.0, "A": 4.0, "A-": 3.7,
  "B+": 3.3, "B": 3.0, "B-": 2.7,
  "C+": 2.3, "C": 2.0, "C-": 1.7,
  "D+": 1.3, "D": 1.0, "D-": 0.7,
  "F": 0.0
};
const GRADES = Object.keys(GRADE_SCALE);

interface Course { id: number; name: string; grade: string; credits: string; }

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
          <motion.div key="a" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} className="overflow-hidden">
            <p className="px-5 pb-5 text-muted-foreground leading-relaxed border-t border-border pt-4">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const RELATED = [
  { title: "Grade Calculator",      slug: "grade-calculator",      cat: "education", icon: <Star className="w-5 h-5" />,       color: 43,  benefit: "Calculate your final grade" },
  { title: "Percentage Calculator", slug: "percentage-calculator", cat: "math",      icon: <Calculator className="w-5 h-5" />, color: 217, benefit: "Calculate percentages quickly" },
  { title: "Standard Deviation",    slug: "standard-deviation",    cat: "math",      icon: <BarChart3 className="w-5 h-5" />,  color: 152, benefit: "Find statistical spread" },
  { title: "Average Calculator",    slug: "average-calculator",    cat: "math",      icon: <BookOpen className="w-5 h-5" />,   color: 265, benefit: "Find mean of numbers" },
];

let nextId = 5;

export default function GpaCalculator() {
  const [courses, setCourses] = useState<Course[]>([
    { id: 1, name: "English 101",  grade: "A",  credits: "3" },
    { id: 2, name: "Math 201",     grade: "B+", credits: "4" },
    { id: 3, name: "History 101",  grade: "A-", credits: "3" },
    { id: 4, name: "Biology 110",  grade: "B",  credits: "4" },
  ]);
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const result = useMemo(() => {
    const valid = courses.filter(c => c.grade && parseFloat(c.credits) > 0 && !isNaN(parseFloat(c.credits)));
    if (valid.length === 0) return null;
    const totalCredits = valid.reduce((s, c) => s + parseFloat(c.credits), 0);
    const totalPoints = valid.reduce((s, c) => s + GRADE_SCALE[c.grade] * parseFloat(c.credits), 0);
    const gpa = totalPoints / totalCredits;
    return { gpa, totalCredits, totalPoints, courseCount: valid.length };
  }, [courses]);

  const addCourse = () => { setCourses(cs => [...cs, { id: nextId++, name: "", grade: "B", credits: "3" }]); };
  const removeCourse = (id: number) => { setCourses(cs => cs.filter(c => c.id !== id)); };
  const updateCourse = (id: number, field: keyof Course, value: string) => {
    setCourses(cs => cs.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const gpaLabel = !result ? "" : result.gpa >= 3.7 ? "Summa Cum Laude" : result.gpa >= 3.5 ? "Magna Cum Laude" : result.gpa >= 3.0 ? "Cum Laude" : result.gpa >= 2.0 ? "Satisfactory" : "Academic Probation Risk";
  const gpaColor = !result ? "indigo" : result.gpa >= 3.5 ? "emerald" : result.gpa >= 3.0 ? "blue" : result.gpa >= 2.0 ? "amber" : "red";

  const copyResult = () => {
    if (!result) return;
    navigator.clipboard.writeText(`GPA: ${result.gpa.toFixed(2)} | Credits: ${result.totalCredits} | Status: ${gpaLabel}`);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };
  const copyLink = () => { navigator.clipboard.writeText(window.location.href); setLinkCopied(true); setTimeout(() => setLinkCopied(false), 2000); };

  return (
    <Layout>
      <SEO
        title="GPA Calculator – Calculate Your Grade Point Average Free | US Online Tools"
        description="Free GPA calculator. Add your courses, grades, and credit hours to calculate your GPA on a 4.0 scale. Supports A-F grades and weighted credit hours. Instant results. No signup."
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-indigo-500" strokeWidth={3} />
          <Link href="/category/education" className="text-muted-foreground hover:text-foreground transition-colors">Education &amp; Study</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-indigo-500" strokeWidth={3} />
          <span className="text-foreground">GPA Calculator</span>
        </nav>

        {/* HERO */}
        <section className="rounded-2xl overflow-hidden border border-indigo-500/15 bg-gradient-to-br from-indigo-500/5 via-card to-violet-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <GraduationCap className="w-3.5 h-3.5" /> Education &amp; Study Tools
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">GPA Calculator</h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Calculate your weighted GPA on a 4.0 scale. Add courses with their letter grades (A+ through F) and credit hours for an accurate semester or cumulative GPA. Used by millions of students worldwide.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20"><BadgeCheck className="w-3.5 h-3.5" /> 100% Free</span>
            <span className="inline-flex items-center gap-1.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-xs px-3 py-1.5 rounded-full border border-indigo-500/20"><Zap className="w-3.5 h-3.5" /> Instant Results</span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20"><Lock className="w-3.5 h-3.5" /> No Signup</span>
            <span className="inline-flex items-center gap-1.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-xs px-3 py-1.5 rounded-full border border-violet-500/20"><Shield className="w-3.5 h-3.5" /> Privacy First</span>
            <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs px-3 py-1.5 rounded-full border border-cyan-500/20"><Smartphone className="w-3.5 h-3.5" /> Mobile Ready</span>
          </div>
          <p className="text-xs text-muted-foreground/60 font-medium">Category: Education &amp; Study Tools &nbsp;·&nbsp; Last updated: March 2026</p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">

            {/* TOOL WIDGET */}
            <section>
              <div className="rounded-2xl overflow-hidden border border-indigo-500/20 shadow-lg shadow-indigo-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 to-violet-400" />
                <div className="bg-card p-6 md:p-8 space-y-5">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-400 flex items-center justify-center flex-shrink-0"><GraduationCap className="w-4 h-4 text-white" /></div>
                    <div><p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">GPA Calculator — 4.0 Scale</p><p className="text-sm text-muted-foreground">GPA updates as you edit — add or remove courses freely.</p></div>
                  </div>

                  <div className="tool-calc-card" style={{ "--calc-hue": 245 } as React.CSSProperties}>
                    {/* Course table */}
                    <div className="space-y-2 mb-4">
                      <div className="grid grid-cols-12 gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground px-2">
                        <div className="col-span-5">Course Name</div>
                        <div className="col-span-3">Grade</div>
                        <div className="col-span-3">Credits</div>
                        <div className="col-span-1"></div>
                      </div>
                      <AnimatePresence>
                        {courses.map(course => (
                          <motion.div key={course.id} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20, height: 0 }} className="grid grid-cols-12 gap-2 items-center">
                            <div className="col-span-5">
                              <input type="text" placeholder="Course name (optional)" value={course.name} onChange={e => updateCourse(course.id, "name", e.target.value)}
                                className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:border-indigo-500 outline-none text-sm" />
                            </div>
                            <div className="col-span-3">
                              <select value={course.grade} onChange={e => updateCourse(course.id, "grade", e.target.value)}
                                className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:border-indigo-500 outline-none text-sm font-bold">
                                {GRADES.map(g => <option key={g} value={g}>{g} ({GRADE_SCALE[g].toFixed(1)})</option>)}
                              </select>
                            </div>
                            <div className="col-span-3">
                              <input type="number" placeholder="3" min="0.5" step="0.5" value={course.credits} onChange={e => updateCourse(course.id, "credits", e.target.value)}
                                className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:border-indigo-500 outline-none text-sm" />
                            </div>
                            <div className="col-span-1 flex justify-center">
                              <button onClick={() => removeCourse(course.id)} className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-all">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>

                    <button onClick={addCourse} className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 font-bold hover:text-indigo-700 transition-colors mb-5">
                      <Plus className="w-4 h-4" /> Add Course
                    </button>

                    {/* GPA Result */}
                    {result && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                        <div className={`p-5 rounded-xl border-2 text-center bg-${gpaColor}-500/5 border-${gpaColor}-500/30`}>
                          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Your GPA</p>
                          <p className={`text-6xl font-black text-${gpaColor}-600 dark:text-${gpaColor}-400`}>{result.gpa.toFixed(2)}</p>
                          <p className={`text-sm font-bold mt-2 text-${gpaColor}-600 dark:text-${gpaColor}-400`}>{gpaLabel}</p>
                        </div>
                        <div className="grid grid-cols-3 gap-3 text-center">
                          <div className="p-3 rounded-xl bg-muted/60 border border-border"><p className="text-xs text-muted-foreground font-bold uppercase mb-1">Courses</p><p className="text-lg font-black text-foreground">{result.courseCount}</p></div>
                          <div className="p-3 rounded-xl bg-muted/60 border border-border"><p className="text-xs text-muted-foreground font-bold uppercase mb-1">Total Credits</p><p className="text-lg font-black text-foreground">{result.totalCredits}</p></div>
                          <div className="p-3 rounded-xl bg-muted/60 border border-border"><p className="text-xs text-muted-foreground font-bold uppercase mb-1">Quality Points</p><p className="text-lg font-black text-foreground">{result.totalPoints.toFixed(1)}</p></div>
                        </div>
                        <button onClick={copyResult} className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-500 text-white font-bold text-sm rounded-xl hover:bg-indigo-600 transition-colors">
                          {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy GPA Result</>}
                        </button>
                        <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/20">
                          <div className="flex gap-2 items-start">
                            <Lightbulb className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-foreground/80 leading-relaxed">
                              Your {result.gpa.toFixed(2)} GPA across {result.totalCredits} credit hours places you in the <strong className="text-foreground">{gpaLabel}</strong> tier. {result.gpa >= 3.5 ? "You are eligible for Dean's List consideration at most universities." : result.gpa >= 3.0 ? "A GPA above 3.0 qualifies you for Cum Laude honors distinction." : result.gpa >= 2.0 ? "A GPA above 2.0 meets minimum academic standing requirements at most institutions." : "A GPA below 2.0 may trigger academic probation — consider meeting with your academic advisor."}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* HOW TO USE */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="how-to-use">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Calculate Your GPA</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                GPA (Grade Point Average) is a numeric summary of your academic performance, typically calculated on a 4.0 scale in the US. This calculator uses the standard weighted GPA formula that accounts for different credit values — so a 4-credit course has more impact than a 1-credit elective.
              </p>
              <ol className="space-y-5 mb-8">
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Enter your courses and letter grades</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Enter the course name (optional — for your own reference), then select the letter grade from the dropdown. The calculator supports the full A+ to F scale including plus/minus grades (A+, A, A-, B+, B, B-, etc.) for maximum accuracy. Use your grade report, transcript, or course gradebook as the source.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Enter credit hours for each course</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Credit hours (also called credit units or credit points) reflect how much a course counts toward your GPA. Most semester-system courses are 3–4 credit hours. Lab courses, seminars, and PE classes are often 1–2 credits. Quarter-system schools may use different scales — use your official credit values from your course registration.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Add or remove courses as needed</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Click "Add Course" to add more courses. Remove any row using the trash icon. The GPA updates in real time as you make changes. You can calculate a single semester GPA, a multi-semester cumulative GPA, or a projected GPA with anticipated grades for future courses.</p>
                  </div>
                </li>
              </ol>
              <div className="p-5 rounded-xl bg-muted/60 border border-border">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">4.0 Scale — Grade Point Values</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[["A+/A","4.0"],["A-","3.7"],["B+","3.3"],["B","3.0"],["B-","2.7"],["C+","2.3"],["C","2.0"],["C-","1.7"],["D+","1.3"],["D","1.0"],["D-","0.7"],["F","0.0"]].map(([g,p])=>(
                    <div key={g} className="flex items-center gap-2 text-xs"><span className="font-bold text-indigo-600 w-8">{g}</span><span className="text-muted-foreground">= {p} pts</span></div>
                  ))}
                </div>
              </div>
            </section>

            {/* RESULT INTERPRETATION */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="result-interpretation">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Understanding Your GPA</h2>
              <p className="text-muted-foreground text-sm mb-6">What different GPA ranges typically mean for academic standing and opportunities:</p>
              <div className="space-y-3">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">3.7–4.0 — Summa Cum Laude (Excellent)</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">Top academic performance. Qualifies for Dean's List, Phi Beta Kappa, and summa cum laude graduation honors at most universities. Competitive for top graduate schools, professional programs (MD, JD, MBA), and highly selective employers. Typical of students aiming for graduate school or academic careers.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                  <div className="w-3 h-3 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">3.0–3.69 — Cum Laude (Good Standing)</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Strong academic performance. Qualifies for cum laude (3.0–3.39) or magna cum laude (3.5–3.69) honors. Competitive for most graduate programs and professional positions. Many employers consider 3.0+ a positive signal on resumes, especially for new graduates. Eligible for most merit scholarships.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                  <div className="w-3 h-3 rounded-full bg-amber-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">2.0–2.99 — Satisfactory Standing</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Above the minimum threshold for good academic standing at most institutions. A GPA in this range meets graduation requirements but limits access to competitive graduate programs and selective employers. Improving this GPA — especially in the major subject area — significantly broadens post-graduation opportunities.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-red-500/5 border border-red-500/20">
                  <div className="w-3 h-3 rounded-full bg-red-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Below 2.0 — Academic Probation Risk</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Most US universities require a minimum 2.0 GPA (a "C" average) for continued enrollment. A GPA below 2.0 may trigger academic probation, affect financial aid eligibility, and restrict course registration. Consulting with an academic advisor immediately is strongly recommended to create a recovery plan.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* QUICK EXAMPLES */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="quick-examples">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">GPA Calculation Examples</h2>
              <div className="overflow-x-auto rounded-xl border border-border mb-6">
                <table className="w-full text-sm">
                  <thead><tr className="bg-muted/60"><th className="text-left px-4 py-3 font-bold text-foreground">Course</th><th className="text-left px-4 py-3 font-bold text-foreground">Grade</th><th className="text-left px-4 py-3 font-bold text-foreground">Credits</th><th className="text-left px-4 py-3 font-bold text-foreground">Quality Points</th></tr></thead>
                  <tbody className="divide-y divide-border">
                    {[["English 101","A (4.0)","3","12.0"],["Math 201","B+ (3.3)","4","13.2"],["History 101","A- (3.7)","3","11.1"],["Biology 110","B (3.0)","4","12.0"],["Spanish 102","C+ (2.3)","3","6.9"]].map(([c,g,cr,qp])=>(
                      <tr key={c} className="hover:bg-muted/30"><td className="px-4 py-3 text-muted-foreground">{c}</td><td className="px-4 py-3 font-bold text-indigo-600">{g}</td><td className="px-4 py-3 text-muted-foreground">{cr}</td><td className="px-4 py-3 font-mono text-muted-foreground">{qp}</td></tr>
                    ))}
                    <tr className="bg-indigo-500/5 font-bold"><td className="px-4 py-3 text-foreground">Total / GPA</td><td className="px-4 py-3 text-foreground">—</td><td className="px-4 py-3 text-foreground">17</td><td className="px-4 py-3 text-indigo-600">55.2 ÷ 17 = 3.25</td></tr>
                  </tbody>
                </table>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">Semester vs. Cumulative GPA:</strong> This calculator computes GPA for the courses you enter — use it for a single semester, or enter all courses across multiple semesters for a cumulative GPA. For cumulative GPA, include all graded courses that count toward your degree, even courses with low grades (unless officially repeated under a grade replacement policy).</p>
                <p><strong className="text-foreground">Raising a low GPA:</strong> Because GPA is a weighted average, early semesters with many credit hours have the most lasting impact. After 60 credit hours, even straight A's for a final 60 hours can only raise a 2.0 GPA to about 3.0. The earlier you address a low GPA, the more achievable a significant improvement becomes — strategically retaking courses (where grade replacement is allowed) is often the most effective approach.</p>
              </div>
              <div className="mt-6 p-5 rounded-xl bg-indigo-500/5 border border-indigo-500/15">
                <div className="flex gap-1 mb-2">{[...Array(5)].map((_,i)=><svg key={i} className="w-4 h-4 fill-amber-400" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>)}</div>
                <p className="text-sm text-foreground/80 italic leading-relaxed">"Added all my courses from the semester and got my exact GPA in seconds. Saves me from waiting for the school portal to update. The honors labels are a nice touch — I was above magna cum laude!"</p>
                <p className="text-xs text-muted-foreground mt-2">— University student feedback, 2025</p>
              </div>
            </section>

            {/* WHY CHOOSE */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="why-choose-this">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Why Use This GPA Calculator?</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">Full plus/minus scale for accurate results.</strong> Many GPA calculators only support whole letter grades (A, B, C, D, F). This calculator supports the full 13-grade scale including plus/minus variants — A+, A, A-, B+, B, B-, C+, C, C-, D+, D, D-, F — matching the grading scale used by most US universities for far more accurate GPA computation.</p>
                <p><strong className="text-foreground">Dynamic course table with add/remove.</strong> Unlike static forms with a fixed number of rows, this calculator lets you add as many courses as you need and remove any with a single click. Edit course names for your own reference. The GPA recalculates after every change without any page interactions.</p>
                <p><strong className="text-foreground">Contextual honors labels and improvement guidance.</strong> Beyond the raw number, the calculator contextualizes your GPA with the appropriate honor designation (Summa Cum Laude, Magna Cum Laude, Cum Laude, Satisfactory, Probation Risk) and provides actionable guidance based on your result.</p>
                <p><strong className="text-foreground">Quality points breakdown for transparency.</strong> The summary shows total quality points (grade points × credits), total credit hours, and course count — so you can see exactly how the weighted average is calculated, not just the final number. This helps identify which courses had the most impact on your GPA.</p>
              </div>
              <div className="mt-6 p-4 rounded-xl border border-border bg-muted/30">
                <p className="text-sm text-muted-foreground leading-relaxed"><strong className="text-foreground">Note:</strong> This calculator uses the standard US 4.0 scale. Some institutions use different scales (4.3 for A+, 5.0, or percentage-based systems). Always verify your institution's specific grading policy. Pass/Fail and CR/NC courses typically do not count in GPA calculations — omit them from this calculator.</p>
              </div>
            </section>

            {/* FAQ */}
            <section id="faq">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem q="What is a weighted GPA vs. unweighted GPA?" a="An unweighted GPA treats all courses equally — an A in an easy elective has the same value as an A in AP Calculus. A weighted GPA gives extra points for honors, AP, or IB courses (e.g., an A in AP = 5.0 instead of 4.0). This calculator computes the standard weighted GPA where weights are based on credit hours, not course difficulty — the standard method used at US colleges and universities." />
                <FaqItem q="How do I calculate cumulative GPA across multiple semesters?" a="Enter all courses from all semesters into the calculator — including past courses with their original grades. The calculator will compute your overall cumulative weighted GPA. For best results, include every graded course that appears on your transcript, including retaken courses (unless your institution uses grade replacement, in which case include only the replacement grade)." />
                <FaqItem q="What GPA do I need for graduate school?" a="Requirements vary widely by program and field. Competitive programs (law, medicine, top MBA) typically expect 3.5+. Most graduate programs have a minimum of 3.0. Some programs consider only major-subject GPA ('major GPA') separately from overall GPA. Research your specific target programs — a lower overall GPA can sometimes be offset by a strong major GPA, GRE/LSAT/GMAT scores, or research experience." />
                <FaqItem q="Does an A+ count as more than an A in this calculator?" a="No — following the most common US university standard, both A+ and A map to 4.0 grade points on a 4.0 scale. Some institutions award 4.3 for A+, but this is the minority. Since we use the standard 4.0 ceiling, A+ and A are equivalent in this calculator. Check your institution's specific scale if precision matters for your situation." />
                <FaqItem q="Can I use this to project my GPA after next semester?" a="Yes — add your current courses with actual grades, then add anticipated future courses with your expected grades. The live GPA calculation shows you your projected GPA after those courses. This is useful for goal-setting: you can experiment with different grade scenarios to see what GPA outcome is possible given your current academic trajectory." />
              </div>
            </section>

            {/* CTA */}
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">More Student &amp; Education Tools</h2>
                <p className="text-white/80 mb-6 max-w-lg">400+ free calculators for students, researchers, and educators — instant results, no account needed.</p>
                <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 font-bold rounded-xl hover:-translate-y-0.5 transition-transform">Explore All Tools <ArrowRight className="w-4 h-4" /></Link>
              </div>
            </section>
          </div>

          {/* SIDEBAR */}
          <div className="space-y-6">
            <div className="sticky top-28 space-y-6">
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight mb-3 uppercase">Related Tools</h3>
                <div className="space-y-0.5">
                  {RELATED.map(t => (
                    <Link key={t.slug} href={`/${t.cat}/${t.slug}`} className="group flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-muted transition-all">
                      <div className="w-7 h-7 rounded-md flex items-center justify-center text-white flex-shrink-0 [&>svg]:w-3.5 [&>svg]:h-3.5" style={{ background: `linear-gradient(135deg, hsl(${t.color} 70% 55%), hsl(${t.color} 75% 42%))` }}>{t.icon}</div>
                      <div className="flex-1 min-w-0"><p className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors truncate">{t.title}</p><p className="text-[10px] text-muted-foreground/60 truncate">{t.benefit}</p></div>
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-indigo-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-1.5">Share This Tool</h3>
                <p className="text-xs text-muted-foreground mb-3">Share with classmates.</p>
                <button onClick={copyLink} className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-400 text-white text-sm font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform">
                  {linkCopied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy Link</>}
                </button>
              </div>
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-3">On This Page</h3>
                <div className="space-y-0.5">
                  {["Calculator","How to Use","Result Interpretation","Quick Examples","Why Choose This","FAQ"].map(label => (
                    <a key={label} href={`#${label.toLowerCase().replace(/\s/g,"-")}`} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-indigo-500 font-medium py-1.5 transition-colors">
                      <div className="w-1 h-1 rounded-full bg-indigo-500/40 flex-shrink-0" />{label}
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
