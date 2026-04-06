import { useMemo, useState } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { getToolPath } from "@/data/tools";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  BarChart3,
  BookOpen,
  Calculator,
  Check,
  ChevronDown,
  ChevronRight,
  Copy,
  Hash,
  Lightbulb,
  Lock,
  Percent,
  Shield,
  Sigma,
  Smartphone,
  Zap,
} from "lucide-react";

type DataType = "population" | "sample";

function useStandardDeviationCalculator() {
  const [input, setInput] = useState("");
  const [dataType, setDataType] = useState<DataType>("population");

  const result = useMemo(() => {
    const numbers = input
      .split(/[\s,;]+/)
      .map((value) => parseFloat(value.trim()))
      .filter((value) => !Number.isNaN(value));

    if (numbers.length < 2) {
      return null;
    }

    const count = numbers.length;
    const sum = numbers.reduce((total, current) => total + current, 0);
    const mean = sum / count;
    const squaredDiffs = numbers.map((value) => Math.pow(value - mean, 2));
    const squaredDiffTotal = squaredDiffs.reduce((total, current) => total + current, 0);
    const variance =
      dataType === "population" ? squaredDiffTotal / count : squaredDiffTotal / (count - 1);
    const standardDeviation = Math.sqrt(variance);
    const sorted = [...numbers].sort((a, b) => a - b);
    const middle = Math.floor(count / 2);
    const median =
      count % 2 === 0 ? (sorted[middle - 1] + sorted[middle]) / 2 : sorted[middle];
    const coefficientOfVariation =
      mean === 0 ? 0 : (standardDeviation / Math.abs(mean)) * 100;
    const standardError = standardDeviation / Math.sqrt(count);

    return {
      count,
      sum,
      mean,
      median,
      variance,
      standardDeviation,
      coefficientOfVariation,
      standardError,
      min: sorted[0],
      max: sorted[count - 1],
      range: sorted[count - 1] - sorted[0],
      dataType,
    };
  }, [input, dataType]);

  return { input, setInput, dataType, setDataType, result };
}

function ResultInsight({
  result,
}: {
  result: ReturnType<typeof useStandardDeviationCalculator>["result"];
}) {
  if (!result) {
    return null;
  }

  const format = (value: number) => parseFloat(value.toFixed(4)).toString();
  const spread =
    result.coefficientOfVariation < 10
      ? "low variability"
      : result.coefficientOfVariation < 30
        ? "moderate variability"
        : "high variability";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20"
    >
      <div className="flex gap-2 items-start">
        <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-foreground/80 leading-relaxed">
          Dataset of <strong>{result.count}</strong> values: mean ={" "}
          <strong>{format(result.mean)}</strong>, {result.dataType} standard deviation ={" "}
          <strong>{format(result.standardDeviation)}</strong>. The coefficient of variation is{" "}
          <strong>{format(result.coefficientOfVariation)}%</strong>, which suggests{" "}
          <strong>{spread}</strong>. Roughly speaking, many values cluster between{" "}
          {format(result.mean - result.standardDeviation)} and{" "}
          {format(result.mean + result.standardDeviation)}.
        </p>
      </div>
    </motion.div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-amber-500/40 transition-colors">
      <button
        onClick={() => setOpen((current) => !current)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left"
      >
        <span className="text-base font-bold text-foreground leading-snug">{question}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 text-amber-500"
        >
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
            <p className="px-5 pb-5 text-muted-foreground leading-relaxed border-t border-border pt-4">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const RELATED_TOOLS = [
  {
    title: "Average Calculator",
    slug: "average-calculator",
    icon: <Sigma className="w-5 h-5" />,
    color: 217,
    benefit: "Mean, median, and mode",
  },
  {
    title: "Scientific Calculator",
    slug: "online-scientific-calculator",
    icon: <Calculator className="w-5 h-5" />,
    color: 270,
    benefit: "Advanced math functions",
  },
  {
    title: "Percentage Calculator",
    slug: "percentage-calculator",
    icon: <Percent className="w-5 h-5" />,
    color: 25,
    benefit: "Percentage and ratio math",
  },
  {
    title: "GPA Calculator",
    slug: "gpa-calculator",
    icon: <BookOpen className="w-5 h-5" />,
    color: 152,
    benefit: "Grade point averages",
  },
  {
    title: "BMI Calculator",
    slug: "bmi-calculator",
    icon: <BarChart3 className="w-5 h-5" />,
    color: 340,
    benefit: "Body metrics and health",
  },
  {
    title: "Random Number Generator",
    slug: "random-number-generator",
    icon: <Hash className="w-5 h-5" />,
    color: 45,
    benefit: "Create sample values fast",
  },
];

export default function StandardDeviationCalculator() {
  const calculator = useStandardDeviationCalculator();
  const [copied, setCopied] = useState(false);
  const canonical = "https://usonlinetools.com/math/online-standard-deviation-calculator";

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const format = (value: number) => parseFloat(value.toFixed(6)).toString();

  return (
    <Layout>
      <SEO
        title="Online Standard Deviation Calculator - Population and Sample Statistics"
        description="Free online standard deviation calculator. Calculate population or sample standard deviation, variance, mean, median, range, coefficient of variation, and standard error."
        canonical={canonical}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight className="w-4 h-4 mx-2 text-amber-500" strokeWidth={3} />
          <Link
            href="/category/math"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Math &amp; Calculators
          </Link>
          <ChevronRight className="w-4 h-4 mx-2 text-amber-500" strokeWidth={3} />
          <span className="text-foreground">Online Standard Deviation Calculator</span>
        </nav>

        <section className="rounded-2xl overflow-hidden border border-amber-500/15 bg-gradient-to-br from-amber-500/5 via-card to-orange-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Calculator className="w-3.5 h-3.5" />
            Math &amp; Calculators
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">
            Online Standard Deviation Calculator
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Calculate population or sample standard deviation, variance, mean, median,
            range, coefficient of variation, and standard error from one clean statistics
            widget. It is designed for students, analysts, researchers, and anyone who
            needs a fast read on data spread.
          </p>

          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20">
              <BadgeCheck className="w-3.5 h-3.5" /> 100% Free
            </span>
            <span className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-xs px-3 py-1.5 rounded-full border border-amber-500/20">
              <Zap className="w-3.5 h-3.5" /> Instant Results
            </span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20">
              <Lock className="w-3.5 h-3.5" /> No Signup
            </span>
            <span className="inline-flex items-center gap-1.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-xs px-3 py-1.5 rounded-full border border-violet-500/20">
              <Shield className="w-3.5 h-3.5" /> Privacy First
            </span>
            <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs px-3 py-1.5 rounded-full border border-cyan-500/20">
              <Smartphone className="w-3.5 h-3.5" /> Mobile Ready
            </span>
          </div>

          <p className="text-xs text-muted-foreground/60 font-medium">
            Category: Math &amp; Calculators &nbsp;&middot;&nbsp; Last updated: April 2026
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">
            <section id="calculator" className="space-y-5">
              <div className="rounded-2xl overflow-hidden border border-amber-500/20 shadow-lg shadow-amber-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 to-orange-400" />
                <div className="bg-card p-6 md:p-8 space-y-5">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-400 flex items-center justify-center flex-shrink-0">
                      <Activity className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        Standard Deviation Calculator
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Results update as you type. No calculate button needed.
                      </p>
                    </div>
                  </div>

                  <div className="tool-calc-card" style={{ "--calc-hue": 45 } as React.CSSProperties}>
                    <div className="flex items-center gap-3 mb-5">
                      <div className="tool-calc-number">1</div>
                      <h2 className="text-lg font-bold text-foreground">
                        Calculate Standard Deviation
                      </h2>
                    </div>

                    <div className="mb-4">
                      <label className="text-sm font-semibold text-muted-foreground mb-2 block">
                        Data Type
                      </label>
                      <div className="flex gap-3">
                        {(["population", "sample"] as DataType[]).map((type) => (
                          <button
                            key={type}
                            onClick={() => calculator.setDataType(type)}
                            className={`flex-1 py-2.5 rounded-xl border font-bold text-sm transition-all ${
                              calculator.dataType === type
                                ? "bg-amber-500 text-white border-amber-500"
                                : "border-border hover:border-amber-500/40 text-muted-foreground"
                            }`}
                          >
                            {type === "population" ? "Population" : "Sample"}
                          </button>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        {calculator.dataType === "population"
                          ? "Use population when you have the full group and divide by n."
                          : "Use sample when the data is only part of a larger group and divide by n - 1."}
                      </p>
                    </div>
                    <div className="mb-5">
                      <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">
                        Enter Numbers
                      </label>
                      <textarea
                        placeholder="10, 12, 23, 23, 16, 23, 21, 16"
                        className="tool-calc-input w-full min-h-[120px] resize-y"
                        value={calculator.input}
                        onChange={(event) => calculator.setInput(event.target.value)}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Separate numbers with commas, spaces, or new lines. Enter at least two
                        values to unlock the full stats summary.
                      </p>
                    </div>

                    {calculator.result && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div className="tool-calc-result text-center">
                            <p className="text-xs text-muted-foreground mb-1">Count</p>
                            <p className="text-lg font-bold">{calculator.result.count}</p>
                          </div>
                          <div className="tool-calc-result text-center">
                            <p className="text-xs text-muted-foreground mb-1">Mean</p>
                            <p className="text-lg font-bold">{format(calculator.result.mean)}</p>
                          </div>
                          <div className="tool-calc-result text-center">
                            <p className="text-xs text-muted-foreground mb-1">Std Dev</p>
                            <p className="text-lg font-bold text-amber-600 dark:text-amber-400">
                              {format(calculator.result.standardDeviation)}
                            </p>
                          </div>
                          <div className="tool-calc-result text-center">
                            <p className="text-xs text-muted-foreground mb-1">Variance</p>
                            <p className="text-lg font-bold">{format(calculator.result.variance)}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div className="tool-calc-result text-center">
                            <p className="text-xs text-muted-foreground mb-1">Median</p>
                            <p className="text-lg font-bold">{format(calculator.result.median)}</p>
                          </div>
                          <div className="tool-calc-result text-center">
                            <p className="text-xs text-muted-foreground mb-1">CV (%)</p>
                            <p className="text-lg font-bold">
                              {format(calculator.result.coefficientOfVariation)}
                            </p>
                          </div>
                          <div className="tool-calc-result text-center">
                            <p className="text-xs text-muted-foreground mb-1">Std Error</p>
                            <p className="text-lg font-bold">
                              {format(calculator.result.standardError)}
                            </p>
                          </div>
                          <div className="tool-calc-result text-center">
                            <p className="text-xs text-muted-foreground mb-1">Range</p>
                            <p className="text-lg font-bold">{format(calculator.result.range)}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div className="tool-calc-result text-center">
                            <p className="text-xs text-muted-foreground mb-1">Min</p>
                            <p className="text-lg font-bold">{format(calculator.result.min)}</p>
                          </div>
                          <div className="tool-calc-result text-center">
                            <p className="text-xs text-muted-foreground mb-1">Max</p>
                            <p className="text-lg font-bold">{format(calculator.result.max)}</p>
                          </div>
                          <div className="tool-calc-result text-center">
                            <p className="text-xs text-muted-foreground mb-1">Sum</p>
                            <p className="text-lg font-bold">{format(calculator.result.sum)}</p>
                          </div>
                          <div className="tool-calc-result text-center">
                            <p className="text-xs text-muted-foreground mb-1">Data Type</p>
                            <p className="text-lg font-bold capitalize">
                              {calculator.result.dataType}
                            </p>
                          </div>
                        </div>

                        <ResultInsight result={calculator.result} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            <section id="how-to-use" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">
                How to Use the Standard Deviation Calculator
              </h2>

              <p className="text-muted-foreground leading-relaxed mb-6">
                Standard deviation measures how far data points tend to sit from the mean.
                A lower value means the dataset is tightly grouped. A higher value means the
                numbers are more spread out. This page makes that interpretation faster by
                pairing the main statistic with supporting metrics that explain why the spread
                is large or small.
              </p>

              <ol className="space-y-5">
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">
                    1
                  </div>
                  <div>
                    <p className="font-bold text-foreground mb-1">
                      Choose population or sample
                    </p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Select Population when your list includes the whole group you care
                      about. Select Sample when your list is only part of a larger population.
                      That choice changes the denominator used in the variance formula and can
                      slightly change the final standard deviation.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">
                    2
                  </div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Paste your dataset</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Add numbers separated by commas, spaces, or line breaks. The textarea is
                      designed for quick paste-in workflows, so you can move data from a sheet,
                      report, or class problem directly into the calculator without cleanup.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">
                    3
                  </div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Read the full statistics summary</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      The tool shows count, mean, standard deviation, variance, median, range,
                      min, max, coefficient of variation, and standard error together.
                      That lets you understand the spread from more than one angle instead of
                      stopping at a single number.
                    </p>
                  </div>
                </li>
              </ol>
            </section>

            <section
              id="result-interpretation"
              className="bg-card border border-border rounded-2xl p-6 md:p-8"
            >
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">
                How Standard Deviation Is Calculated
              </h2>

              <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                <p>
                  <strong className="text-foreground">Step 1:</strong> Find the mean by adding all
                  values and dividing by the total count.
                </p>
                <p>
                  <strong className="text-foreground">Step 2:</strong> Subtract the mean from each
                  value to measure how far each number sits from the center.
                </p>
                <p>
                  <strong className="text-foreground">Step 3:</strong> Square those differences so
                  negative and positive deviations do not cancel each other out.
                </p>
                <p>
                  <strong className="text-foreground">Step 4:</strong> Average the squared
                  differences to get variance, then take the square root of variance to get
                  standard deviation.
                </p>
              </div>
              <div className="mt-6 p-5 rounded-xl bg-muted/60 border border-border">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
                  Formula Notes
                </p>
                <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                  <p>
                    <strong className="text-foreground">Population formula:</strong> divide by n
                    because you are measuring the full group.
                  </p>
                  <p>
                    <strong className="text-foreground">Sample formula:</strong> divide by n - 1
                    to correct bias when your dataset is only a sample.
                  </p>
                  <p>
                    <strong className="text-foreground">Coefficient of variation:</strong> use it
                    when you want to compare spread across datasets with different scales.
                  </p>
                  <p>
                    <strong className="text-foreground">Standard error:</strong> use it to estimate
                    how stable the sample mean is likely to be.
                  </p>
                </div>
              </div>
            </section>

            <section id="quick-examples" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">
                Standard Deviation Examples
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 rounded-xl bg-amber-500/5 border border-amber-500/20">
                  <h3 className="font-bold text-foreground mb-3">Exam Scores</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    A small standard deviation means student scores are clustered closely.
                  </p>
                  <div className="bg-background rounded-lg p-3 text-sm font-mono">
                    <p>Data: 85, 90, 78, 92, 88</p>
                    <p>Mean: 86.6</p>
                    <p>Std Dev: 5.03</p>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-orange-500/5 border border-orange-500/20">
                  <h3 className="font-bold text-foreground mb-3">Stock Returns</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Higher spread often signals more volatile performance.
                  </p>
                  <div className="bg-background rounded-lg p-3 text-sm font-mono">
                    <p>Data: 2.1, -1.5, 3.2, 1.8, -0.9</p>
                    <p>Mean: 0.94</p>
                    <p>Std Dev: 1.98</p>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-yellow-500/5 border border-yellow-500/20">
                  <h3 className="font-bold text-foreground mb-3">Quality Control</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Very low spread suggests a stable manufacturing process.
                  </p>
                  <div className="bg-background rounded-lg p-3 text-sm font-mono">
                    <p>Data: 99.8, 100.2, 99.9, 100.1, 100.0</p>
                    <p>Mean: 100.0</p>
                    <p>Std Dev: 0.15</p>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-red-500/5 border border-red-500/20">
                  <h3 className="font-bold text-foreground mb-3">Weather Data</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Wider temperature swings usually show up as higher standard deviation.
                  </p>
                  <div className="bg-background rounded-lg p-3 text-sm font-mono">
                    <p>Data: 15, 22, 18, 25, 12, 28, 16</p>
                    <p>Mean: 19.4</p>
                    <p>Std Dev: 5.4</p>
                  </div>
                </div>
              </div>
            </section>

            <section id="why-choose-this" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">
                Why Use This Statistics Tool?
              </h2>

              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p>
                  <strong className="text-foreground">It goes beyond one number.</strong> Many
                  calculators stop at standard deviation, but you usually need supporting context
                  to interpret the spread correctly. This page gives you variance, median, range,
                  min, max, coefficient of variation, and standard error at the same time.
                </p>
                <p>
                  <strong className="text-foreground">It is built for quick paste workflows.</strong>{" "}
                  The textarea handles comma-separated values, spreadsheet-style whitespace, and
                  line breaks, so it works well for assignments, reports, and copied data samples.
                </p>
                <p>
                  <strong className="text-foreground">It fits the prompt2 page pattern.</strong>{" "}
                  The content structure, sidebar, widget styling, and related tool linking now
                  follow the same stronger template used by the better-performing calculator pages.
                </p>
              </div>
            </section>

            <section id="faq" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">
                Frequently Asked Questions
              </h2>

              <div className="space-y-4">
                <FaqItem
                  question="What is standard deviation in simple terms?"
                  answer="Standard deviation describes how spread out numbers are around the mean. A small value means the numbers stay close together. A larger value means they are farther apart."
                />
                <FaqItem
                  question="What is the difference between sample and population standard deviation?"
                  answer="Population standard deviation is used when you have data for the full group. Sample standard deviation is used when your data is only part of a larger group and applies the n - 1 correction."
                />
                <FaqItem
                  question="When should I care about coefficient of variation?"
                  answer="Coefficient of variation helps when you want to compare spread across datasets with different units or very different means. It turns spread into a percentage for easier comparison."
                />
                <FaqItem
                  question="Why does the calculator need at least two numbers?"
                  answer="With only one value there is no spread to measure, so variance and standard deviation are not meaningful."
                />
                <FaqItem
                  question="Can I use this for grades, finance, or lab data?"
                  answer="Yes. It works for any numeric dataset, including test scores, returns, measurements, production checks, and survey results."
                />
              </div>
            </section>

            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 to-orange-400 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Need More Math Tools?</h2>
                <p className="text-white/80 mb-6 max-w-lg">
                  Explore related calculators for averages, percentages, scientific math, and
                  other statistics workflows.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-amber-600 font-bold rounded-xl hover:-translate-y-0.5 transition-transform"
                >
                  Explore All Tools <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <div className="sticky top-28 space-y-6">
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight mb-3 uppercase">
                  Related Tools
                </h3>
                <div className="space-y-0.5">
                  {RELATED_TOOLS.map((tool) => (
                    <Link
                      key={tool.slug}
                      href={getToolPath(tool.slug)}
                      className="group flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-muted transition-all"
                    >
                      <div
                        className="w-7 h-7 rounded-md flex items-center justify-center text-white flex-shrink-0 [&>svg]:w-3.5 [&>svg]:h-3.5"
                        style={{
                          background: `linear-gradient(135deg, hsl(${tool.color} 70% 55%), hsl(${tool.color} 75% 42%))`,
                        }}
                      >
                        {tool.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors truncate">
                          {tool.title}
                        </p>
                        <p className="text-[10px] text-muted-foreground/60 truncate">
                          {tool.benefit}
                        </p>
                      </div>
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-amber-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-1.5">
                  Share This Tool
                </h3>
                <p className="text-xs text-muted-foreground mb-3">
                  Copy this page and send it to anyone working with statistics.
                </p>
                <button
                  onClick={copyLink}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-amber-500 to-orange-400 text-white text-sm font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy Link
                    </>
                  )}
                </button>
              </div>

              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-3">
                  On This Page
                </h3>
                <div className="space-y-0.5">
                  {[
                    "Calculator",
                    "How to Use",
                    "Result Interpretation",
                    "Quick Examples",
                    "Why Choose This",
                    "FAQ",
                  ].map((label) => (
                    <a
                      key={label}
                      href={`#${label.toLowerCase().replace(/\s/g, "-")}`}
                      className="flex items-center gap-2 text-xs text-muted-foreground hover:text-amber-500 font-medium py-1.5 transition-colors"
                    >
                      <div className="w-1 h-1 rounded-full bg-amber-500/40 flex-shrink-0" />
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
