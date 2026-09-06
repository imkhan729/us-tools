import { useMemo, useState } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  BadgeCheck,
  Calendar,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  Copy,
  Heart,
  Lightbulb,
  ListChecks,
  Shield,
  Sparkles,
  Stethoscope,
  Target,
} from "lucide-react";

type CycleResult = {
  cycleNumber: number;
  periodStart: Date;
  ovulationDate: Date;
  fertileStart: Date;
  fertileEnd: Date;
  nextPeriod: Date;
};

const CANONICAL_URL = "https://usonlinetools.com/calculators/ovulation-calculator/";
const META_DESCRIPTION =
  "Use this free ovulation calculator to estimate your ovulation date, fertile window, and best days to try to conceive based on your cycle.";

const FAQ_ITEMS = [
  {
    q: "What is an ovulation calculator?",
    a: "An ovulation calculator is an online tool that estimates when you may ovulate. It uses your last period date and average cycle length to calculate your likely ovulation date and fertile window. It gives a helpful estimate, but it cannot confirm ovulation.",
  },
  {
    q: "How do I calculate my ovulation date?",
    a: "You can estimate your ovulation date by using the first day of your last period and your average cycle length. Ovulation often happens around 14 days before the next period, but the exact timing can vary from person to person.",
  },
  {
    q: "How many days after my period do I ovulate?",
    a: "It depends on your cycle length. In a 28-day cycle, ovulation is often estimated around day 14. In a 30-day cycle, it may be around day 16. If your cycle is shorter or longer, your ovulation day may change.",
  },
  {
    q: "What are the best days to get pregnant?",
    a: "The best days to try to conceive are usually the days before ovulation and the day of ovulation. This time is called the fertile window. This calculator estimates those days based on your cycle information.",
  },
  {
    q: "Is this ovulation calculator accurate?",
    a: "This ovulation calculator gives an estimate. It may be more accurate if your periods are regular. If your periods are irregular, your ovulation date may be harder to predict, and the calculator result should be used only as a general guide.",
  },
  {
    q: "Can I use this calculator if my periods are irregular?",
    a: "Yes, but the result may be less accurate. You can enter your average cycle length from the last few cycles. If your periods are very irregular, consider tracking ovulation signs or speaking with a healthcare professional.",
  },
  {
    q: "What cycle length should I enter?",
    a: "Enter the average number of days from the first day of one period to the first day of your next period. Common cycle lengths are around 24 to 35 days, but your personal cycle may be different.",
  },
  {
    q: "Can an ovulation calculator prevent pregnancy?",
    a: "No. An ovulation calculator should not be used as a reliable birth control method. It only estimates fertile days and cannot confirm exactly when ovulation happens.",
  },
  {
    q: "What is the difference between ovulation date and fertile window?",
    a: "The ovulation date is the estimated day an egg may be released. The fertile window is the group of days when pregnancy is most likely. The fertile window usually includes the days before ovulation and ovulation day.",
  },
  {
    q: "When should I take a pregnancy test after ovulation?",
    a: "Many people take a pregnancy test around the expected period date or about two weeks after ovulation. Test instructions vary, so always follow the directions on the pregnancy test package.",
  },
];

const QUICK_ANSWERS = [
  {
    title: "When Do I Ovulate?",
    text: "Most people ovulate about 14 days before their next period, but the exact day can vary. This calculator estimates your ovulation date using your last period date and average cycle length.",
  },
  {
    title: "What Is My Fertile Window?",
    text: "Your fertile window is the group of days when pregnancy is most likely. It usually includes the days before ovulation and the day of ovulation.",
  },
  {
    title: "Can This Calculator Guarantee Pregnancy?",
    text: "No. An ovulation calculator can estimate fertile days, but it cannot guarantee pregnancy or confirm that ovulation has happened.",
  },
];

const CYCLE_OVULATION_DAYS = [
  ["24 days", "Around day 10"],
  ["26 days", "Around day 12"],
  ["28 days", "Around day 14"],
  ["30 days", "Around day 16"],
  ["32 days", "Around day 18"],
  ["35 days", "Around day 21"],
];

const RELATED_TOOLS = [
  { title: "Pregnancy Due Date Calculator", path: "/health/pregnancy-due-date-calculator", icon: <Heart className="w-5 h-5" /> },
  { title: "Date Difference Calculator", path: "/time-date/date-difference-calculator", icon: <Calendar className="w-5 h-5" /> },
  { title: "Age Calculator", path: "/time-date/online-age-calculator", icon: <Clock className="w-5 h-5" /> },
  { title: "BMI Calculator", path: "/health/online-bmi-calculator", icon: <Activity className="w-5 h-5" /> },
];

function parseLocalDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function formatLong(date: Date) {
  return date.toLocaleDateString("en-US", { dateStyle: "long" });
}

function formatShort(date: Date) {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function toInputDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getCycleDay(periodStart: Date, target: Date) {
  return Math.floor((target.getTime() - periodStart.getTime()) / 86400000) + 1;
}

function useOvulationCalc() {
  const [lastPeriod, setLastPeriod] = useState(toInputDate(new Date()));
  const [cycleLength, setCycleLength] = useState(28);
  const [lutealPhaseLength, setLutealPhaseLength] = useState(14);
  const [calculatedAt, setCalculatedAt] = useState(Date.now());

  const results = useMemo(() => {
    if (!lastPeriod) return null;

    const lmp = parseLocalDate(lastPeriod);
    const cycles: CycleResult[] = Array.from({ length: 3 }, (_, index) => {
      const periodStart = addDays(lmp, cycleLength * index);
      const ovulationDate = addDays(periodStart, cycleLength - lutealPhaseLength);

      return {
        cycleNumber: index + 1,
        periodStart,
        ovulationDate,
        fertileStart: addDays(ovulationDate, -5),
        fertileEnd: addDays(ovulationDate, 1),
        nextPeriod: addDays(periodStart, cycleLength),
      };
    });

    const current = cycles[0];

    return {
      current,
      cycles,
      ovulationDate: formatLong(current.ovulationDate),
      fertileWindow: `${formatShort(current.fertileStart)} - ${current.fertileEnd.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`,
      bestDays: `${formatShort(addDays(current.ovulationDate, -3))} - ${formatShort(current.ovulationDate)}`,
      nextPeriod: formatLong(current.nextPeriod),
      ovulationCycleDay: getCycleDay(current.periodStart, current.ovulationDate),
      fertileStartCycleDay: getCycleDay(current.periodStart, current.fertileStart),
      fertileEndCycleDay: getCycleDay(current.periodStart, current.fertileEnd),
    };
  }, [lastPeriod, cycleLength, lutealPhaseLength, calculatedAt]);

  return {
    lastPeriod,
    setLastPeriod,
    cycleLength,
    setCycleLength,
    lutealPhaseLength,
    setLutealPhaseLength,
    calculate: () => setCalculatedAt(Date.now()),
    results,
  };
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-primary/45 transition-colors">
      <button onClick={() => setOpen((value) => !value)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-primary">
          <ChevronDown className="w-5 h-5" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 1 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <p className="px-5 pb-5 text-muted-foreground leading-relaxed border-t border-border pt-4">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MetricCard({ icon, label, value, detail }: { icon: React.ReactNode; label: string; value: string; detail: string }) {
  return (
    <div className="rounded-xl border border-border bg-background/70 p-4">
      <div className="flex items-center gap-2 text-primary mb-2">
        {icon}
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{label}</p>
      </div>
      <p className="text-lg font-black text-foreground leading-tight">{value}</p>
      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{detail}</p>
    </div>
  );
}

function ContentSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
      <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">{title}</h2>
      <div className="space-y-4 text-muted-foreground leading-relaxed font-medium">{children}</div>
    </section>
  );
}

function SimpleTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead className="bg-muted/60 text-foreground">
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-4 py-3 text-left font-black">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.join("-")} className="border-t border-border">
              {row.map((cell) => (
                <td key={cell} className="px-4 py-3 align-top">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CycleCalendar({ cycles }: { cycles: CycleResult[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cycles.map((cycle) => (
        <div key={cycle.cycleNumber} className="rounded-xl border border-border bg-muted/25 p-4">
          <p className="text-xs font-black uppercase tracking-widest text-primary mb-3">Cycle {cycle.cycleNumber}</p>
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Period starts</p>
              <p className="font-bold text-foreground">{formatLong(cycle.periodStart)}</p>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Estimated fertile window</p>
              <p className="font-bold text-secondary">{formatShort(cycle.fertileStart)} - {formatShort(cycle.fertileEnd)}</p>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Estimated ovulation</p>
              <p className="font-bold text-foreground">{formatLong(cycle.ovulationDate)}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function OvulationCalculator() {
  const calc = useOvulationCalc();
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(CANONICAL_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const schema = [
    {
      "@type": "WebApplication",
      name: "Ovulation Calculator",
      url: CANONICAL_URL,
      applicationCategory: "HealthApplication",
      operatingSystem: "Any",
      description: "A free ovulation calculator that estimates ovulation date, fertile window, and fertile days based on last period date and cycle length.",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      publisher: {
        "@type": "Organization",
        name: "US Online Tools",
        url: "https://usonlinetools.com/",
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://usonlinetools.com/" },
        { "@type": "ListItem", position: 2, name: "Calculators", item: "https://usonlinetools.com/calculators/" },
        { "@type": "ListItem", position: 3, name: "Ovulation Calculator", item: CANONICAL_URL },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQ_ITEMS.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.a,
        },
      })),
    },
  ];

  return (
    <Layout>
      <SEO
        title="Ovulation Calculator - Estimate Your Fertile Window"
        description={META_DESCRIPTION}
        canonical={CANONICAL_URL}
        schema={schema}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-primary" strokeWidth={3} />
          <Link href="/category/health" className="text-muted-foreground hover:text-foreground transition-colors">Health & Fitness</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-primary" strokeWidth={3} />
          <span className="text-foreground">Ovulation Calculator</span>
        </nav>

        <section className="rounded-2xl overflow-hidden border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-secondary/10 px-6 md:px-12 py-10 md:py-14 mb-10 relative">
          <div className="absolute top-0 right-0 p-10 opacity-10 hidden md:block">
            <Calendar className="w-36 h-36 text-primary" />
          </div>
          <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Sparkles className="w-3.5 h-3.5" />
            Free ovulation calculator
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-4xl">
            Ovulation Calculator
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-3xl">
            Use this ovulation calculator to estimate your most fertile days based on your last period date and average cycle length. It can help you find your likely ovulation date, fertile window, and best days to try to conceive. Results are estimates and may vary if your cycle is irregular.
          </p>
          <div className="flex flex-wrap gap-2">
            {["Ovulation date", "Fertile window", "Best days to try to conceive", "Private browser-based tool"].map((item) => (
              <span key={item} className="inline-flex items-center gap-1.5 bg-card/80 text-foreground font-bold text-xs px-3 py-1.5 rounded-full border border-border">
                <BadgeCheck className="w-3.5 h-3.5 text-secondary" /> {item}
              </span>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <main className="lg:col-span-3 space-y-10">
            <section className="rounded-2xl border border-primary/20 shadow-xl bg-card overflow-hidden">
              <div className="h-1.5 w-full bg-gradient-to-r from-primary via-accent to-secondary" />
              <div className="p-6 md:p-10">
                <div className="mb-7">
                  <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Calculate ovulation</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Enter the first day of your last period and your average cycle length. The calculator will estimate your ovulation date, fertile window, and next expected period.
                  </p>
                  <p className="mt-3 rounded-xl border border-border bg-muted/35 p-4 text-sm text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">Note:</strong> This tool is for general educational use only. It does not confirm ovulation or guarantee pregnancy.
                  </p>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-5 gap-8 items-start">
                  <div className="xl:col-span-2 space-y-6">
                    <div className="space-y-3">
                      <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">First day of your last period</label>
                      <input
                        type="date"
                        className="tool-calc-input text-lg font-bold w-full"
                        value={calc.lastPeriod}
                        onChange={(event) => calc.setLastPeriod(event.target.value)}
                      />
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-muted-foreground">
                        <span>Average cycle length</span>
                        <span className="text-primary">{calc.cycleLength} days</span>
                      </div>
                      <input
                        type="range"
                        min="20"
                        max="45"
                        value={calc.cycleLength}
                        onChange={(event) => calc.setCycleLength(Number(event.target.value))}
                        className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Average cycle length is counted from the first day of one period to the first day of the next period.
                      </p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-muted-foreground">
                        <span>Luteal phase length, optional</span>
                        <span className="text-secondary">{calc.lutealPhaseLength} days</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="16"
                        value={calc.lutealPhaseLength}
                        onChange={(event) => calc.setLutealPhaseLength(Number(event.target.value))}
                        className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-secondary"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={calc.calculate}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-black uppercase tracking-wider text-primary-foreground shadow-lg shadow-primary/20 transition-transform hover:-translate-y-0.5"
                    >
                      <Target className="w-4 h-4" /> Calculate ovulation
                    </button>
                  </div>

                  <AnimatePresence mode="wait">
                    {calc.results && (
                      <motion.div
                        key={`${calc.results.ovulationDate}-${calc.results.fertileWindow}-${calc.results.ovulationCycleDay}`}
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        className="xl:col-span-3 p-6 rounded-2xl bg-gradient-to-br from-primary/8 to-secondary/8 border border-primary/20 space-y-5"
                      >
                        <div className="text-center">
                          <p className="text-xs font-black uppercase text-primary tracking-widest">Estimated ovulation date</p>
                          <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight mt-1">{calc.results.ovulationDate}</h2>
                          <p className="text-sm text-muted-foreground mt-2">
                            Cycle day of ovulation: {calc.results.ovulationCycleDay}
                          </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <MetricCard icon={<Target className="w-4 h-4" />} label="Estimated fertile window" value={calc.results.fertileWindow} detail={`Cycle days ${calc.results.fertileStartCycleDay}-${calc.results.fertileEndCycleDay}`} />
                          <MetricCard icon={<Heart className="w-4 h-4" />} label="Best days to try to conceive" value={calc.results.bestDays} detail="Usually the few days before ovulation and ovulation day" />
                          <MetricCard icon={<Calendar className="w-4 h-4" />} label="Next expected period" value={calc.results.nextPeriod} detail={`Based on a ${calc.cycleLength}-day cycle`} />
                          <MetricCard icon={<Clock className="w-4 h-4" />} label="Cycle day of ovulation" value={`Day ${calc.results.ovulationCycleDay}`} detail="Estimated from your cycle inputs" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {QUICK_ANSWERS.map((item) => (
                <div key={item.title} className="rounded-2xl border border-border bg-card p-5">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                    <Lightbulb className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-black text-foreground tracking-tight mb-2">Quick Answer: {item.title}</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
                </div>
              ))}
            </section>

            {calc.results && (
              <ContentSection title="3-Month Fertility Calendar">
                <p>
                  Use the upcoming cycle estimates as a planning guide. If your cycle changes often, treat these dates as a rough range instead of exact timing.
                </p>
                <CycleCalendar cycles={calc.results.cycles} />
              </ContentSection>
            )}

            <ContentSection title="How to Use This Ovulation Calculator">
              <p>Using this free ovulation calculator is simple. You only need your last period date and your usual cycle length.</p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Enter the first day of your last menstrual period.</li>
                <li>Choose your average cycle length.</li>
                <li>Click the calculate button.</li>
                <li>Review your estimated ovulation date and fertile window.</li>
                <li>Use the result as a guide, not a medical guarantee.</li>
              </ol>
              <p>Your cycle length is counted from the first day of one period to the first day of your next period.</p>
              <p>For example, if your period starts on January 1 and your next period starts on January 29, your cycle length is 28 days.</p>
            </ContentSection>

            <ContentSection title="How the Ovulation Calculator Works">
              <p>A menstrual cycle starts on the first day of your period. Ovulation is the part of the cycle when an ovary releases an egg.</p>
              <p>Many ovulation calculators estimate ovulation by counting backward from the next expected period. Ovulation often happens around 14 days before the next period, but this is not exact for everyone.</p>
              <SimpleTable
                headers={["Input", "What It Means"]}
                rows={[
                  ["Last period date", "The first day of your most recent period"],
                  ["Average cycle length", "The number of days from one period to the next"],
                  ["Optional luteal phase", "The time between ovulation and the next period, if supported"],
                ]}
              />
              <p>The calculator then estimates your likely ovulation date and fertile window.</p>
              <p>This method works best when your periods are regular. If your cycle changes often, your actual ovulation date may be earlier or later than the estimate.</p>
            </ContentSection>

            <ContentSection title="What Is the Fertile Window?">
              <p>The fertile window is the time in your menstrual cycle when pregnancy is most likely.</p>
              <p>It usually includes the days before ovulation and the day of ovulation. These days matter because sperm can survive for several days inside the reproductive tract, while the egg is available for a shorter time after ovulation.</p>
              <p>That is why the best days to try to conceive are usually the few days before ovulation and ovulation day itself.</p>
              <SimpleTable headers={["Cycle Length", "Estimated Ovulation Day"]} rows={CYCLE_OVULATION_DAYS} />
              <p>These are general estimates. Your actual ovulation day may be earlier or later.</p>
            </ContentSection>

            <ContentSection title="How Accurate Is an Ovulation Calculator?">
              <p>An ovulation calculator is useful, but it is still an estimate.</p>
              <p>It is usually more helpful for people with regular cycles because the calculator depends on predictable cycle timing. If your cycle length changes often, the result may be less accurate.</p>
              <p>An ovulation calculator may be less accurate if you have:</p>
              <ul className="list-disc pl-6 space-y-2">
                {["Irregular periods", "PCOS or suspected hormonal imbalance", "Thyroid issues", "Recent birth control changes", "Recent pregnancy or breastfeeding", "High stress", "Illness", "Major lifestyle changes", "Very short or very long cycles"].map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p>For better tracking, some people use this calculator together with ovulation predictor kits, cervical mucus tracking, or basal body temperature tracking.</p>
              <p>This tool does not replace medical advice. It cannot confirm ovulation, diagnose fertility issues, or predict pregnancy with certainty.</p>
            </ContentSection>

            <ContentSection title="Common Signs of Ovulation">
              <p>Some people notice body changes around ovulation. Others do not notice anything at all.</p>
              <ul className="list-disc pl-6 space-y-2">
                {["Changes in cervical mucus", "Mild one-sided pelvic discomfort", "Slight rise in basal body temperature after ovulation", "Increased libido", "Breast tenderness", "Positive ovulation predictor test"].map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p>Not everyone notices ovulation signs. Signs can also change from cycle to cycle.</p>
            </ContentSection>

            <ContentSection title="When to Speak With a Healthcare Professional">
              <p>This ovulation calculator can help you understand your cycle, but it cannot diagnose health conditions.</p>
              <ul className="list-disc pl-6 space-y-2">
                {["Your periods are very irregular", "Your cycles are often shorter than 21 days or longer than 35 days", "You have very painful periods", "You suspect PCOS, thyroid issues, or hormonal imbalance", "You recently stopped birth control and your cycle has not returned to normal", "You are trying to conceive and have concerns", "You are over 35 and trying to conceive"].map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p>A healthcare professional can give advice based on your health history, symptoms, and goals.</p>
            </ContentSection>

            <ContentSection title="Ovulation Calculator for Irregular Periods">
              <p>You can still use this ovulation calculator if your periods are irregular, but the result should be treated as a rough guide.</p>
              <p>For irregular cycles, try entering your average cycle length from the last few months. For example, if your recent cycles were 27, 31, and 29 days, your average cycle length is about 29 days.</p>
              <p>Still, irregular cycles can make ovulation harder to predict. If your periods are often unpredictable, tracking physical signs or speaking with a healthcare professional may be more helpful.</p>
            </ContentSection>

            <ContentSection title="Best Days to Get Pregnant">
              <p>The best days to try to conceive are usually during the fertile window.</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>The days before ovulation</li>
                <li>The day of ovulation</li>
                <li>Sometimes the day after ovulation, depending on timing</li>
              </ul>
              <p>Many people focus only on ovulation day, but the days before ovulation are also important. This is because sperm can survive for several days, so timing before ovulation may increase the chance of sperm being present when the egg is released.</p>
              <p>This calculator gives you an estimated fertile window so you can understand your likely timing.</p>
            </ContentSection>

            <ContentSection title="Ovulation Date vs Fertile Window">
              <p>Your ovulation date and fertile window are related, but they are not the same.</p>
              <SimpleTable
                headers={["Term", "Meaning"]}
                rows={[
                  ["Ovulation date", "The estimated day an egg may be released"],
                  ["Fertile window", "The group of days when pregnancy is most likely"],
                  ["Cycle length", "Days from the first day of one period to the first day of the next"],
                  ["Last period date", "The first day of your most recent period"],
                ]}
              />
              <p>The fertile window is usually wider than one day. That is why this calculator shows both your estimated ovulation date and your fertile days.</p>
            </ContentSection>

            <section id="faq" className="space-y-6">
              <h2 className="text-2xl font-black text-foreground tracking-tight">FAQ</h2>
              <div className="space-y-3">
                {FAQ_ITEMS.map((item) => (
                  <FaqItem key={item.q} q={item.q} a={item.a} />
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-primary/20 bg-primary/5 p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-4">Medical Disclaimer</h2>
              <p className="text-muted-foreground leading-relaxed font-medium">
                This ovulation calculator is for general educational purposes only. It provides an estimate based on the information you enter and should not be used as medical advice, diagnosis, treatment, or birth control guidance. If you have irregular cycles, fertility concerns, severe pain, or health questions, speak with a qualified healthcare professional.
              </p>
            </section>
          </main>

          <aside className="space-y-6">
            <div className="sticky top-28 space-y-6">
              <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-2">Share this tool</h3>
                <button
                  onClick={copyLink}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary text-primary-foreground text-xs font-black uppercase rounded-xl hover:-translate-y-0.5 transition-transform shadow-lg shadow-primary/20"
                >
                  {copied ? <><Check className="w-4 h-4" /> Copied</> : <><Copy className="w-4 h-4" /> Copy Link</>}
                </button>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-primary to-secondary text-white shadow-xl relative overflow-hidden">
                <Stethoscope className="w-16 h-16 absolute -right-4 -top-4 opacity-20" />
                <h4 className="font-black text-sm mb-2 flex items-center gap-2">
                  <Shield className="w-4 h-4" /> Trust Box
                </h4>
                <p className="text-xs leading-relaxed opacity-90 font-medium">
                  This calculator does not diagnose fertility issues. It gives an estimate based on cycle dates. If your periods are irregular or you have health concerns, speak with a healthcare professional.
                </p>
              </div>

              <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
                <h3 className="text-[10px] font-black uppercase text-muted-foreground mb-4 tracking-widest flex items-center gap-2">
                  <ListChecks className="w-4 h-4" /> Related Tools
                </h3>
                <div className="space-y-4">
                  {RELATED_TOOLS.map((tool) => (
                    <Link key={tool.path} href={tool.path} className="flex items-center gap-3 group px-2 py-1.5 rounded-lg hover:bg-muted transition-colors">
                      <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        {tool.icon}
                      </div>
                      <span className="text-xs font-bold text-foreground">{tool.title}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </Layout>
  );
}
