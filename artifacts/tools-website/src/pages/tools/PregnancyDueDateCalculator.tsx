import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, Heart, CalendarDays, Clock,
  Zap, Shield, Smartphone, Lock, BadgeCheck, Copy, Check, Lightbulb,
} from "lucide-react";

// ── Types ──
type Method = "lmp" | "conception" | "ivf";
type IvfDay = "day3" | "day5";

// ── Calculator Logic ──
function usePregnancyCalc() {
  const [method, setMethod] = useState<Method>("lmp");
  const [inputDate, setInputDate] = useState("");
  const [ivfDay, setIvfDay] = useState<IvfDay>("day5");

  const result = useMemo(() => {
    if (!inputDate) return null;
    const base = new Date(inputDate + "T00:00:00");
    if (isNaN(base.getTime())) return null;

    // Calculate days to add
    let daysToAdd = 280; // LMP default (Naegele's Rule)
    let conceptionEstimate: Date | null = null;

    if (method === "lmp") {
      daysToAdd = 280;
      conceptionEstimate = new Date(base.getTime() + 14 * 24 * 60 * 60 * 1000);
    } else if (method === "conception") {
      daysToAdd = 266;
    } else if (method === "ivf") {
      daysToAdd = ivfDay === "day5" ? 263 : 266;
    }

    const dueDate = new Date(base.getTime() + daysToAdd * 24 * 60 * 60 * 1000);

    // Calculate current week (from LMP equivalent)
    const lmpEquivalent =
      method === "lmp"
        ? base
        : method === "conception"
        ? new Date(base.getTime() - 14 * 24 * 60 * 60 * 1000)
        : ivfDay === "day5"
        ? new Date(base.getTime() - (280 - 263) * 24 * 60 * 60 * 1000)
        : new Date(base.getTime() - 14 * 24 * 60 * 60 * 1000);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const daysSinceLmp = Math.floor(
      (today.getTime() - lmpEquivalent.getTime()) / (24 * 60 * 60 * 1000)
    );
    const weekNumber = Math.floor(daysSinceLmp / 7);
    const daysIntoWeek = daysSinceLmp % 7;

    // Only show current week if pregnancy is between 0 and 42 weeks
    const currentWeek =
      daysSinceLmp >= 0 && weekNumber <= 42
        ? { week: weekNumber, days: daysIntoWeek }
        : null;

    // Trimester
    let trimester = "";
    if (weekNumber < 14) trimester = "1st Trimester";
    else if (weekNumber < 28) trimester = "2nd Trimester";
    else trimester = "3rd Trimester";

    const trimesterColor =
      weekNumber < 14 ? "pink" : weekNumber < 28 ? "rose" : "red";

    // Milestone dates from LMP equivalent
    const milestone = (w: number) =>
      new Date(lmpEquivalent.getTime() + w * 7 * 24 * 60 * 60 * 1000);

    const milestones = [
      { week: 4, label: "Implantation", desc: "Embryo implants in uterus" },
      { week: 6, label: "Heartbeat detectable", desc: "Fetal heartbeat via ultrasound" },
      { week: 12, label: "End of 1st Trimester", desc: "Miscarriage risk drops significantly" },
      { week: 20, label: "Anatomy scan", desc: "Detailed ultrasound screening" },
      { week: 28, label: "3rd Trimester begins", desc: "Baby's lungs start maturing" },
      { week: 37, label: "Full term", desc: "Baby is considered full term" },
      { week: 40, label: "Due date", desc: "Estimated date of delivery" },
    ].map(m => ({ ...m, date: milestone(m.week) }));

    return {
      dueDate,
      conceptionEstimate,
      currentWeek,
      trimester,
      trimesterColor,
      milestones,
    };
  }, [inputDate, method, ivfDay]);

  return { method, setMethod, inputDate, setInputDate, ivfDay, setIvfDay, result };
}

// ── Helpers ──
function formatDate(d: Date): string {
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateShort(d: Date): string {
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ── FAQ Item ──
function FaqItem({ q, a }: { q: string; a: string | React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-pink-500/40 transition-colors">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left"
      >
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 text-pink-500"
        >
          <ChevronDown className="w-5 h-5" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="a"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 text-muted-foreground leading-relaxed border-t border-border pt-4">
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const RELATED_TOOLS = [
  { title: "Age Calculator", slug: "age-calculator", icon: <CalendarDays className="w-5 h-5" />, color: 340, benefit: "Calculate your exact age" },
  { title: "BMI Calculator", slug: "bmi-calculator", icon: <Heart className="w-5 h-5" />, color: 0, benefit: "Body Mass Index check" },
  { title: "Water Intake Calculator", slug: "water-intake-calculator", icon: <Clock className="w-5 h-5" />, color: 200, benefit: "Daily hydration goal" },
  { title: "Ideal Weight Calculator", slug: "ideal-weight-calculator", icon: <Heart className="w-5 h-5" />, color: 152, benefit: "Find your healthy weight" },
];

export default function PregnancyDueDateCalculator() {
  const calc = usePregnancyCalc();
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const methodLabels: Record<Method, string> = {
    lmp: "Last Menstrual Period",
    conception: "Conception Date",
    ivf: "IVF Transfer Date",
  };

  return (
    <Layout>
      <SEO
        title="Pregnancy Due Date Calculator – Find Your Expected Due Date"
        description="Calculate your pregnancy due date from last menstrual period, conception date, or IVF transfer date. Get your full pregnancy week-by-week timeline."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        {/* ── BREADCRUMB ── */}
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-pink-500" strokeWidth={3} />
          <Link href="/category/health" className="text-muted-foreground hover:text-foreground transition-colors">Health &amp; Fitness</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-pink-500" strokeWidth={3} />
          <span className="text-foreground">Pregnancy Due Date Calculator</span>
        </nav>

        {/* ── HERO ── */}
        <section className="rounded-2xl overflow-hidden border border-pink-500/15 bg-gradient-to-br from-pink-500/5 via-card to-rose-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-pink-500/10 text-pink-600 dark:text-pink-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Heart className="w-3.5 h-3.5" /> Health &amp; Fitness
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">
            Pregnancy Due Date Calculator
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Find your expected due date from your last menstrual period, conception date, or IVF transfer date. Includes trimester tracking, current week, and a full pregnancy milestones timeline.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            {[
              { icon: <BadgeCheck className="w-3.5 h-3.5" />, label: "100% Free", color: "emerald" },
              { icon: <Zap className="w-3.5 h-3.5" />, label: "Instant Results", color: "pink" },
              { icon: <Lock className="w-3.5 h-3.5" />, label: "No Signup", color: "slate" },
              { icon: <Shield className="w-3.5 h-3.5" />, label: "Privacy First", color: "violet" },
              { icon: <Smartphone className="w-3.5 h-3.5" />, label: "Mobile Ready", color: "cyan" },
            ].map(b => (
              <span
                key={b.label}
                className={`inline-flex items-center gap-1.5 bg-${b.color}-500/10 text-${b.color}-600 dark:text-${b.color}-400 font-bold text-xs px-3 py-1.5 rounded-full border border-${b.color}-500/20`}
              >
                {b.icon} {b.label}
              </span>
            ))}
          </div>
          <p className="text-xs text-muted-foreground/60 font-medium">
            Category: Health &amp; Fitness &nbsp;·&nbsp; 3 calculation methods including IVF &nbsp;·&nbsp; Last updated: March 2026
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">

          {/* ── MAIN COLUMN ── */}
          <div className="lg:col-span-3 space-y-10">

            {/* ── TOOL WIDGET ── */}
            <section>
              <div className="rounded-2xl overflow-hidden border border-pink-500/20 shadow-lg shadow-pink-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-pink-500 to-rose-400" />
                <div className="bg-card p-6 md:p-8 space-y-6">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-500 to-rose-400 flex items-center justify-center flex-shrink-0">
                      <Heart className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">3 Calculation Methods</p>
                      <p className="text-sm text-muted-foreground">Results update instantly as you enter your date.</p>
                    </div>
                  </div>

                  {/* Method selector */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Calculation Method</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {(["lmp", "conception", "ivf"] as Method[]).map(m => (
                        <button
                          key={m}
                          onClick={() => calc.setMethod(m)}
                          className={`py-2.5 px-3 rounded-xl text-sm font-bold border-2 transition-all text-left ${calc.method === m ? "bg-pink-500 text-white border-pink-500" : "border-border text-muted-foreground hover:border-pink-500/50"}`}
                        >
                          {methodLabels[m]}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* IVF sub-option */}
                  <AnimatePresence initial={false}>
                    {calc.method === "ivf" && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Transfer Type</label>
                          <div className="flex gap-2">
                            {([
                              { val: "day5", label: "Day 5 Blastocyst" },
                              { val: "day3", label: "Day 3 Embryo" },
                            ] as { val: IvfDay; label: string }[]).map(opt => (
                              <button
                                key={opt.val}
                                onClick={() => calc.setIvfDay(opt.val)}
                                className={`flex-1 py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${calc.ivfDay === opt.val ? "bg-rose-500 text-white border-rose-500" : "border-border text-muted-foreground hover:border-rose-500/50"}`}
                              >
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Date input */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
                      {calc.method === "lmp"
                        ? "First Day of Last Menstrual Period"
                        : calc.method === "conception"
                        ? "Conception Date"
                        : "IVF Transfer Date"}
                    </label>
                    <input
                      type="date"
                      className="tool-calc-input w-full max-w-xs"
                      value={calc.inputDate}
                      onChange={e => calc.setInputDate(e.target.value)}
                    />
                  </div>

                  {/* Results */}
                  <AnimatePresence initial={false}>
                    {calc.result && (
                      <motion.div
                        key="results"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.25 }}
                        className="space-y-4"
                      >
                        {/* Due date — primary result */}
                        <div className="tool-calc-result p-5 rounded-xl bg-pink-500/5 border border-pink-500/20">
                          <p className="text-xs font-bold uppercase tracking-widest text-pink-500 mb-1">Expected Due Date</p>
                          <p className="text-3xl md:text-4xl font-black text-foreground leading-tight">
                            {formatDate(calc.result.dueDate)}
                          </p>
                        </div>

                        {/* Current week + trimester */}
                        {calc.result.currentWeek && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className={`p-4 rounded-xl bg-${calc.result.trimesterColor}-500/5 border border-${calc.result.trimesterColor}-500/20`}>
                              <p className={`text-xs font-bold uppercase tracking-widest text-${calc.result.trimesterColor}-500 mb-1`}>Current Week</p>
                              <p className="text-2xl font-black text-foreground">
                                Week {calc.result.currentWeek.week}
                                <span className="text-sm font-medium text-muted-foreground ml-1">
                                  + {calc.result.currentWeek.days} day{calc.result.currentWeek.days !== 1 ? "s" : ""}
                                </span>
                              </p>
                            </div>
                            <div className={`p-4 rounded-xl bg-${calc.result.trimesterColor}-500/5 border border-${calc.result.trimesterColor}-500/20`}>
                              <p className={`text-xs font-bold uppercase tracking-widest text-${calc.result.trimesterColor}-500 mb-1`}>Trimester</p>
                              <p className="text-2xl font-black text-foreground">{calc.result.trimester}</p>
                            </div>
                          </div>
                        )}

                        {/* Conception estimate (LMP only) */}
                        {calc.method === "lmp" && calc.result.conceptionEstimate && (
                          <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/20">
                            <p className="text-xs font-bold uppercase tracking-widest text-rose-500 mb-1">Estimated Conception</p>
                            <p className="text-lg font-bold text-foreground">{formatDate(calc.result.conceptionEstimate)}</p>
                            <p className="text-xs text-muted-foreground mt-1">Based on ovulation at ~14 days after LMP (varies by cycle length).</p>
                          </div>
                        )}

                        {/* Milestones table */}
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Pregnancy Milestones Timeline</p>
                          <div className="overflow-x-auto rounded-xl border border-border">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="bg-muted/60">
                                  <th className="text-left p-3 font-bold text-muted-foreground text-xs uppercase tracking-widest">Week</th>
                                  <th className="text-left p-3 font-bold text-muted-foreground text-xs uppercase tracking-widest">Milestone</th>
                                  <th className="text-left p-3 font-bold text-muted-foreground text-xs uppercase tracking-widest hidden sm:table-cell">What Happens</th>
                                  <th className="text-left p-3 font-bold text-muted-foreground text-xs uppercase tracking-widest">Date</th>
                                </tr>
                              </thead>
                              <tbody>
                                {calc.result.milestones.map((m, i) => {
                                  const isPast = m.date < new Date();
                                  return (
                                    <tr key={i} className={`border-t border-border ${isPast ? "opacity-60" : ""}`}>
                                      <td className="p-3 font-black text-foreground">W{m.week}</td>
                                      <td className="p-3 font-bold text-foreground">{m.label}</td>
                                      <td className="p-3 text-muted-foreground hidden sm:table-cell">{m.desc}</td>
                                      <td className="p-3 text-muted-foreground whitespace-nowrap">{formatDateShort(m.date)}</td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        <div className="p-4 rounded-xl bg-pink-500/5 border border-pink-500/20">
                          <div className="flex gap-2 items-start">
                            <Lightbulb className="w-4 h-4 text-pink-500 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-foreground/80 leading-relaxed">
                              Only about <strong>5% of babies</strong> are born on their exact due date. Most births happen within 2 weeks before or after. Your healthcare provider may adjust your due date based on an early ultrasound measurement.
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </section>

            {/* ── ABOUT SECTION ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How Pregnancy Due Dates Are Calculated</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                The standard method for estimating a pregnancy due date is <strong>Naegele's Rule</strong>, developed by German obstetrician Franz Karl Naegele in the early 19th century. Despite its age, it remains the foundation of modern obstetric date calculations and is used by healthcare providers worldwide.
              </p>
              <div className="space-y-4 mb-6">
                {[
                  {
                    name: "Naegele's Rule (LMP Method)",
                    desc: "Add 280 days (40 weeks) to the first day of your last menstrual period. This assumes a 28-day cycle with ovulation on day 14. The formula is: LMP + 1 year − 3 months + 7 days. This is the default used in most prenatal care settings.",
                  },
                  {
                    name: "Conception Date Method",
                    desc: "If you know your conception date (e.g., from ovulation tracking or timed intercourse), add 266 days (38 weeks). This accounts for the 14-day difference between LMP and ovulation in a standard cycle.",
                  },
                  {
                    name: "IVF Transfer Date Method",
                    desc: "For IVF pregnancies: if a Day 5 blastocyst was transferred, add 263 days (the embryo is already 5 days old). If a Day 3 embryo was transferred, add 266 days. IVF due dates are typically the most precise because the fertilization date is known exactly.",
                  },
                ].map(f => (
                  <div key={f.name} className="p-4 rounded-xl bg-muted/40 border border-border">
                    <p className="font-bold text-foreground mb-1">{f.name}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* ── FAQ ── */}
            <section className="space-y-3">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Frequently Asked Questions</h2>
              {[
                {
                  q: "How is a pregnancy due date calculated?",
                  a: "The most common method is Naegele's Rule: add 280 days (40 weeks) to the first day of your last menstrual period (LMP). This assumes a standard 28-day cycle. If your cycle is longer or shorter, your healthcare provider may adjust the date using an early ultrasound, which measures the baby's crown-rump length (CRL) for a more accurate estimate.",
                },
                {
                  q: "How accurate is a due date calculation?",
                  a: "Only about 5% of babies are born on their calculated due date. Around 70% of births occur within 10 days of the due date, and nearly all uncomplicated pregnancies deliver between weeks 37 and 42. An early first-trimester ultrasound (before 14 weeks) is the most accurate way to confirm gestational age and adjust the due date if needed.",
                },
                {
                  q: "What is Naegele's Rule?",
                  a: "Naegele's Rule is the standard obstetric formula for estimating a due date. The formula: take the first day of the last menstrual period, add 1 year, subtract 3 months, and add 7 days. This equals adding 280 days (40 weeks) to the LMP. It was developed by Franz Karl Naegele in the early 1800s and remains the global standard, though it assumes a 28-day cycle.",
                },
                {
                  q: "What are the three trimesters of pregnancy?",
                  a: "Pregnancy is divided into three trimesters: the 1st Trimester (weeks 1–13) covers implantation, embryo formation, and the highest miscarriage risk period; the 2nd Trimester (weeks 14–27) is often called the \"honeymoon phase\" — morning sickness typically eases, and the anatomy scan occurs around week 20; the 3rd Trimester (weeks 28–40+) involves rapid fetal weight gain, lung maturation, and preparation for birth.",
                },
                {
                  q: "What does 'full term' mean?",
                  a: "A pregnancy is considered full term at 39–40 weeks. Babies born at 37–38 weeks are \"early term\" — they are outside the premature range but may have slightly higher risks than 39-week babies. The American College of Obstetricians and Gynecologists (ACOG) discourages elective delivery before 39 weeks without a medical indication.",
                },
                {
                  q: "Can my due date change?",
                  a: "Yes. Due dates are frequently revised after an early ultrasound, especially if the baby's measurements don't match the LMP-calculated date by more than a week. It's common for dates to shift by a few days to 1–2 weeks. If the LMP-based and ultrasound-based dates agree within 7 days (in the first trimester), the LMP date is usually kept. If they differ by more than 7 days, the ultrasound date takes precedence.",
                },
              ].map((item, i) => (
                <FaqItem key={i} q={item.q} a={item.a} />
              ))}
            </section>

            {/* ── SEO RICH CONTENT ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8 space-y-8">
              <div>
                <h2 className="text-2xl font-black text-foreground tracking-tight mb-4">Understanding Pregnancy Weeks, Trimesters &amp; Due Dates</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Pregnancy is measured in weeks from the first day of your last menstrual period — not from conception. This means when a doctor says you are "4 weeks pregnant," you may only be 2 weeks past conception. The full gestational period is 40 weeks (280 days) from LMP, though actual conception typically occurs around week 2.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Understanding your due date helps you schedule prenatal appointments, plan maternity leave, prepare for birth, and track fetal development milestones. While every pregnancy is unique, the week-by-week framework is used universally in prenatal care.
                </p>
              </div>

              {/* Naegele's Rule formula box */}
              <div className="p-5 rounded-xl bg-pink-500/5 border border-pink-500/20">
                <h3 className="text-lg font-black text-foreground mb-3">Naegele's Rule — The Formula Explained</h3>
                <div className="font-mono text-sm bg-background rounded-lg p-4 mb-3 border border-border">
                  Due Date = LMP + 1 year − 3 months + 7 days
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Example: If your LMP was <strong>July 1, 2025</strong>, add 1 year → July 1, 2026, subtract 3 months → April 1, 2026, add 7 days → <strong>April 8, 2026</strong>. This equals exactly 280 days from the LMP date.
                </p>
              </div>

              {/* Trimester breakdown table */}
              <div>
                <h3 className="text-xl font-black text-foreground tracking-tight mb-4">Trimester Breakdown Table</h3>
                <div className="overflow-x-auto rounded-xl border border-border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/60">
                        <th className="text-left p-3 font-bold text-muted-foreground text-xs uppercase tracking-widest">Trimester</th>
                        <th className="text-left p-3 font-bold text-muted-foreground text-xs uppercase tracking-widest">Weeks</th>
                        <th className="text-left p-3 font-bold text-muted-foreground text-xs uppercase tracking-widest">Key Developments</th>
                        <th className="text-left p-3 font-bold text-muted-foreground text-xs uppercase tracking-widest">Common Symptoms</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { tri: "1st Trimester", weeks: "1–13", dev: "Heart forms (wk 6), all major organs begin, embryo becomes fetus (wk 10)", symptoms: "Nausea, fatigue, breast tenderness, frequent urination" },
                        { tri: "2nd Trimester", weeks: "14–27", dev: "Anatomy scan (wk 20), baby moves felt, gender visible, lung development", symptoms: "Energy returns, round ligament pain, backache, visible bump" },
                        { tri: "3rd Trimester", weeks: "28–40+", dev: "Rapid weight gain, brain maturation, lungs mature (wk 34–36), head engages", symptoms: "Braxton Hicks, shortness of breath, frequent urination, swelling" },
                      ].map((row, i) => (
                        <tr key={i} className="border-t border-border">
                          <td className="p-3 font-bold text-foreground">{row.tri}</td>
                          <td className="p-3 text-foreground font-medium">{row.weeks}</td>
                          <td className="p-3 text-muted-foreground">{row.dev}</td>
                          <td className="p-3 text-muted-foreground">{row.symptoms}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Early vs late section */}
              <div>
                <h3 className="text-xl font-black text-foreground tracking-tight mb-4">What If Baby Comes Early or Late?</h3>
                <div className="space-y-3">
                  {[
                    { title: "Before 37 weeks — Premature (Preterm)", body: "Births before 37 weeks are classified as premature. Babies may need NICU care depending on how early they arrive. Survival rates are high after 28 weeks and excellent after 32 weeks. Around 10% of births in the US are preterm." },
                    { title: "37–38 weeks — Early Term", body: "Babies born at 37 or 38 weeks are outside the premature range but have slightly higher risks of breathing difficulties, feeding problems, and jaundice compared to 39–40 week babies. Routine induction before 39 weeks is not recommended without medical cause." },
                    { title: "39–40 weeks — Full Term", body: "The optimal delivery window. Brain, lung, and liver development are most complete. ACOG defines full term as 39w 0d to 40w 6d." },
                    { title: "41–42 weeks — Late Term / Post-Term", body: "At 41 weeks, providers typically increase monitoring (non-stress tests, biophysical profiles). At 42 weeks, induction is usually recommended as placental function can begin to decline, raising the risk of meconium aspiration and stillbirth." },
                  ].map(item => (
                    <div key={item.title} className="p-4 rounded-xl bg-muted/40 border border-border">
                      <p className="font-bold text-foreground mb-1">{item.title}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

          </div>

          {/* ── SIDEBAR ── */}
          <div className="space-y-6">
            <div className="sticky top-28 space-y-6">

              {/* Quick-reference card */}
              <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Quick Reference</p>
                <div className="space-y-2 text-sm">
                  {[
                    { label: "LMP method", value: "LMP + 280 days" },
                    { label: "Conception method", value: "Conception + 266 days" },
                    { label: "IVF Day 5 transfer", value: "Transfer + 263 days" },
                    { label: "IVF Day 3 transfer", value: "Transfer + 266 days" },
                    { label: "Full term range", value: "39w 0d – 40w 6d" },
                    { label: "Pregnancy duration", value: "40 weeks / 280 days" },
                  ].map((row, i) => (
                    <div key={i} className="flex justify-between gap-2 py-1.5 border-b border-border last:border-0">
                      <span className="text-muted-foreground">{row.label}</span>
                      <span className="font-bold text-foreground text-right">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Why use this tool */}
              <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Why Use This Tool</p>
                {[
                  { icon: <Zap className="w-4 h-4 text-pink-500" />, text: "LMP, conception, and IVF methods" },
                  { icon: <Shield className="w-4 h-4 text-pink-500" />, text: "No data stored — 100% private" },
                  { icon: <BadgeCheck className="w-4 h-4 text-pink-500" />, text: "Full milestones timeline" },
                  { icon: <Smartphone className="w-4 h-4 text-pink-500" />, text: "Works on phone, tablet, desktop" },
                ].map((t, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="flex-shrink-0 mt-0.5">{t.icon}</div>
                    <p className="text-sm text-muted-foreground">{t.text}</p>
                  </div>
                ))}
              </div>

              {/* Share */}
              <div className="rounded-2xl border border-pink-500/20 bg-pink-500/5 p-5">
                <p className="text-sm font-bold text-foreground mb-3">Share this calculator</p>
                <button
                  onClick={copyLink}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-pink-500 text-white font-bold text-sm hover:bg-pink-600 transition-colors"
                >
                  {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Link</>}
                </button>
              </div>

              {/* Related tools */}
              <div className="rounded-2xl border border-border bg-card p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Related Tools</p>
                <div className="space-y-2">
                  {RELATED_TOOLS.map((t, i) => (
                    <Link
                      key={i}
                      href={`/tools/${t.slug}`}
                      className="group flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-all border border-transparent hover:border-border"
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: `hsl(${t.color},80%,50%,0.1)`, color: `hsl(${t.color},70%,45%)` }}
                      >
                        {t.icon}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-foreground leading-tight truncate">{t.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{t.benefit}</p>
                      </div>
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
