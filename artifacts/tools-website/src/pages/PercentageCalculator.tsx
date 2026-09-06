import { type ReactNode, useMemo, useState } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { getCanonicalToolPath } from "@/data/tools";
import { Link } from "wouter";
import {
  BadgeCheck,
  BarChart3,
  Calculator,
  Check,
  ChevronDown,
  ChevronRight,
  Copy,
  DollarSign,
  Hash,
  Percent,
  Shield,
  Smartphone,
  Zap,
} from "lucide-react";

type ChangeMode = "change" | "increase" | "decrease" | "difference";

const CANONICAL_URL = "https://usonlinetools.com/math/online-percentage-calculator";
const SEO_TITLE = "Percentage Calculator - Percent Increase, Decrease and Difference";
const SEO_DESCRIPTION =
  "Use this free percentage calculator to calculate percent of a number, percentage increase, percentage decrease, and percent difference.";

const FAQS = [
  {
    question: "What is a percentage calculator?",
    answer:
      "A percentage calculator is an online tool that helps calculate percent of a number, what percent one number is of another, percentage increase, percentage decrease, percentage change, and percent difference.",
  },
  {
    question: "How do I calculate a percentage of a number?",
    answer:
      "To calculate a percentage of a number, divide the percentage by 100 and multiply by the number. For example, 20% of 150 is 0.20 multiplied by 150, which equals 30.",
  },
  {
    question: "How do I calculate percentage increase?",
    answer:
      "Subtract the original value from the new value, divide by the original value, then multiply by 100. For example, an increase from 50 to 60 is ((60 - 50) / 50) x 100 = 20%.",
  },
  {
    question: "How do I calculate percentage decrease?",
    answer:
      "Subtract the new value from the original value, divide by the original value, then multiply by 100. For example, a decrease from 80 to 60 is ((80 - 60) / 80) x 100 = 25%.",
  },
  {
    question: "What is percent difference?",
    answer:
      "Percent difference compares two values by dividing their absolute difference by their average, then multiplying by 100. It is useful when neither value is clearly the original value.",
  },
  {
    question: "Can I use this for discounts and sales tax?",
    answer:
      "Yes. You can use the percent of a number calculator for discounts, tips, tax estimates, commissions, markdowns, and quick shopping calculations.",
  },
  {
    question: "Is this percentage calculator free?",
    answer:
      "Yes. This free percentage calculator works online without signup and updates results instantly as you enter values.",
  },
];

const RELATED_TOOLS = [
  { title: "Discount Calculator", slug: "discount-calculator", text: "Find sale price after any percent off." },
  { title: "Percentage Error Calculator", slug: "percentage-error-calculator", text: "Compare measured and expected values." },
  { title: "Ratio Calculator", slug: "ratio-calculator", text: "Simplify and compare ratios." },
  { title: "Average Calculator", slug: "average-calculator", text: "Calculate mean, median, mode, and range." },
  { title: "Scientific Calculator", slug: "online-scientific-calculator", text: "Use a broader calculator for advanced math." },
];

function schema() {
  return [
    {
      "@type": "WebApplication",
      name: "Percentage Calculator",
      url: CANONICAL_URL,
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Any",
      description:
        "A free percentage calculator for percent of a number, percentage increase, percentage decrease, percentage change, and percent difference.",
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
        { "@type": "ListItem", position: 2, name: "Math Tools", item: "https://usonlinetools.com/category/math" },
        { "@type": "ListItem", position: 3, name: "Percentage Calculator", item: CANONICAL_URL },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQS.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    },
  ];
}

function parseValue(value: string) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function formatNumber(value: number | null) {
  if (value === null) return "--";
  return value.toLocaleString("en-US", { maximumFractionDigits: 6 });
}

function ResultBox({ label, value, suffix = "" }: { label: string; value: number | null; suffix?: string }) {
  return (
    <div className="rounded-lg border border-primary/20 bg-primary/10 p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-2 break-all text-3xl font-black text-primary">
        {formatNumber(value)}
        {value !== null ? suffix : ""}
      </p>
    </div>
  );
}

function Field({ label, value, setValue, placeholder }: { label: string; value: string; setValue: (value: string) => void; placeholder: string }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-foreground">{label}</span>
      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        inputMode="decimal"
        placeholder={placeholder}
        className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground outline-none focus:border-primary"
      />
    </label>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-lg border border-border bg-card">
      <button type="button" onClick={() => setOpen((value) => !value)} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left">
        <span className="font-semibold text-foreground">{question}</span>
        <ChevronDown className={`h-5 w-5 text-primary transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open ? <p className="border-t border-border px-5 pb-5 pt-4 text-sm leading-7 text-muted-foreground">{answer}</p> : null}
    </div>
  );
}

function StatCard({ title, formula, text, icon }: { title: string; formula: string; text: string; icon: ReactNode }) {
  return (
    <article className="rounded-lg border border-border bg-card p-5">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10 text-secondary">{icon}</div>
      <h3 className="font-black text-foreground">{title}</h3>
      <p className="mt-2 font-mono text-sm text-primary">{formula}</p>
      <p className="mt-3 text-sm leading-7 text-muted-foreground">{text}</p>
    </article>
  );
}

export default function PercentageCalculator() {
  const [percent, setPercent] = useState("20");
  const [base, setBase] = useState("150");
  const [part, setPart] = useState("30");
  const [whole, setWhole] = useState("150");
  const [oldValue, setOldValue] = useState("50");
  const [newValue, setNewValue] = useState("60");
  const [mode, setMode] = useState<ChangeMode>("change");
  const [copied, setCopied] = useState(false);

  const percentOf = useMemo(() => {
    const p = parseValue(percent);
    const b = parseValue(base);
    return p === null || b === null ? null : (p / 100) * b;
  }, [base, percent]);

  const percentIs = useMemo(() => {
    const p = parseValue(part);
    const w = parseValue(whole);
    return p === null || w === null || w === 0 ? null : (p / w) * 100;
  }, [part, whole]);

  const change = useMemo(() => {
    const oldNumber = parseValue(oldValue);
    const newNumber = parseValue(newValue);
    if (oldNumber === null || newNumber === null) return null;
    if (mode === "difference") {
      const average = (Math.abs(oldNumber) + Math.abs(newNumber)) / 2;
      return average === 0 ? null : (Math.abs(newNumber - oldNumber) / average) * 100;
    }
    if (oldNumber === 0) return null;
    if (mode === "decrease") return ((oldNumber - newNumber) / Math.abs(oldNumber)) * 100;
    return ((newNumber - oldNumber) / Math.abs(oldNumber)) * 100;
  }, [mode, newValue, oldValue]);

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <Layout>
      <SEO title={SEO_TITLE} description={SEO_DESCRIPTION} canonical={CANONICAL_URL} schema={schema()} />

      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm font-semibold text-muted-foreground">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="h-4 w-4 text-primary" />
          <Link href="/category/math" className="hover:text-foreground">Math Tools</Link>
          <ChevronRight className="h-4 w-4 text-primary" />
          <span className="text-foreground">Percentage Calculator</span>
        </nav>

        <section className="mb-8 overflow-hidden rounded-lg border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-secondary/10 p-6 md:p-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
            <Percent className="h-4 w-4" />
            Free Math Calculator
          </div>
          <h1 className="max-w-4xl text-4xl font-black tracking-tight text-foreground md:text-6xl">
            Percentage Calculator
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-muted-foreground md:text-lg">
            Use this free percentage calculator to calculate percent of a number, what percent one number is of another,
            percentage increase, percentage decrease, percentage change, and percent difference. It is useful for
            discounts, grades, finance, business metrics, tax estimates, tips, and everyday math.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {[
              ["Percentage increase calculator", BarChart3],
              ["Percentage decrease calculator", Percent],
              ["Percent difference calculator", Hash],
              ["No signup", Shield],
              ["Mobile friendly", Smartphone],
            ].map(([label, Icon]) => {
              const BadgeIcon = Icon as typeof Percent;
              return (
                <span key={label as string} className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1.5 text-xs font-bold text-foreground">
                  <BadgeIcon className="h-4 w-4 text-secondary" />
                  {label as string}
                </span>
              );
            })}
          </div>
        </section>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-8">
            <section id="calculator" className="rounded-lg border border-border bg-card shadow-sm">
              <div className="border-b border-border bg-muted/30 px-5 py-4 md:px-6">
                <h2 className="text-xl font-black tracking-tight text-foreground">Free Online Percentage Calculator</h2>
                <p className="mt-1 text-sm text-muted-foreground">Enter values below. Results update instantly.</p>
              </div>
              <div className="space-y-6 p-5 md:p-6">
                <div className="rounded-lg border border-border bg-background p-5">
                  <h3 className="text-lg font-black text-foreground">What is X% of Y?</h3>
                  <div className="mt-4 grid gap-4 md:grid-cols-3">
                    <Field label="Percent" value={percent} setValue={setPercent} placeholder="20" />
                    <Field label="Number" value={base} setValue={setBase} placeholder="150" />
                    <ResultBox label="Result" value={percentOf} />
                  </div>
                </div>

                <div className="rounded-lg border border-border bg-background p-5">
                  <h3 className="text-lg font-black text-foreground">X is what percent of Y?</h3>
                  <div className="mt-4 grid gap-4 md:grid-cols-3">
                    <Field label="Part" value={part} setValue={setPart} placeholder="30" />
                    <Field label="Whole" value={whole} setValue={setWhole} placeholder="150" />
                    <ResultBox label="Result" value={percentIs} suffix="%" />
                  </div>
                </div>

                <div className="rounded-lg border border-border bg-background p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="text-lg font-black text-foreground">Percentage change, increase, decrease, or difference</h3>
                    <select value={mode} onChange={(event) => setMode(event.target.value as ChangeMode)} className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground">
                      <option value="change">Percentage change</option>
                      <option value="increase">Percentage increase</option>
                      <option value="decrease">Percentage decrease</option>
                      <option value="difference">Percent difference</option>
                    </select>
                  </div>
                  <div className="mt-4 grid gap-4 md:grid-cols-3">
                    <Field label="Original value" value={oldValue} setValue={setOldValue} placeholder="50" />
                    <Field label="New value" value={newValue} setValue={setNewValue} placeholder="60" />
                    <ResultBox label="Result" value={change} suffix="%" />
                  </div>
                </div>
              </div>
            </section>

            <section className="grid gap-4 md:grid-cols-3">
              <article className="rounded-lg border border-border bg-card p-5">
                <h2 className="text-base font-black leading-snug text-foreground">Quick Answer: How do I calculate a percentage?</h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">Divide the percent by 100, then multiply by the number. For example, 15% of 200 equals 30.</p>
              </article>
              <article className="rounded-lg border border-border bg-card p-5">
                <h2 className="text-base font-black leading-snug text-foreground">Quick Answer: What is percentage increase?</h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">Percentage increase shows how much a value went up compared with its original value.</p>
              </article>
              <article className="rounded-lg border border-border bg-card p-5">
                <h2 className="text-base font-black leading-snug text-foreground">Quick Answer: What is percent difference?</h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">Percent difference compares two values relative to their average when there is no clear starting value.</p>
              </article>
            </section>

            <section id="formulas" className="rounded-lg border border-border bg-card p-6 md:p-8">
              <h2 className="text-2xl font-black tracking-tight text-foreground">Percentage Formulas</h2>
              <p className="mt-4 leading-8 text-muted-foreground">
                These are the core formulas behind the calculator. They cover the most searched percentage calculator
                tasks: percent of a number, percentage increase, percentage decrease, percentage change, and percent difference.
              </p>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <StatCard title="Percent of a number" formula="(percent / 100) x number" text="Use this for discounts, tips, tax, commission, grades, and quick shopping math." icon={<Percent className="h-5 w-5" />} />
                <StatCard title="What percent is X of Y?" formula="(part / whole) x 100" text="Use this to compare a part against a total, such as marks earned out of possible marks." icon={<Calculator className="h-5 w-5" />} />
                <StatCard title="Percentage increase" formula="((new - old) / old) x 100" text="Use this when a price, salary, traffic number, grade, or metric goes up from an original value." icon={<BarChart3 className="h-5 w-5" />} />
                <StatCard title="Percentage decrease" formula="((old - new) / old) x 100" text="Use this for markdowns, losses, lower bills, reduced costs, or lower measurements." icon={<DollarSign className="h-5 w-5" />} />
              </div>
            </section>

            <section id="examples" className="rounded-lg border border-border bg-card p-6 md:p-8">
              <h2 className="text-2xl font-black tracking-tight text-foreground">Common Percentage Calculator Examples</h2>
              <div className="mt-6 overflow-hidden rounded-lg border border-border">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3">Task</th>
                      <th className="px-4 py-3">Example</th>
                      <th className="hidden px-4 py-3 md:table-cell">Answer</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr><td className="px-4 py-3 font-semibold text-foreground">Percent of a number</td><td className="px-4 py-3 text-muted-foreground">20% of 150</td><td className="hidden px-4 py-3 text-muted-foreground md:table-cell">30</td></tr>
                    <tr><td className="px-4 py-3 font-semibold text-foreground">Percent of total</td><td className="px-4 py-3 text-muted-foreground">30 is what percent of 150?</td><td className="hidden px-4 py-3 text-muted-foreground md:table-cell">20%</td></tr>
                    <tr><td className="px-4 py-3 font-semibold text-foreground">Percentage increase</td><td className="px-4 py-3 text-muted-foreground">50 to 60</td><td className="hidden px-4 py-3 text-muted-foreground md:table-cell">20% increase</td></tr>
                    <tr><td className="px-4 py-3 font-semibold text-foreground">Percentage decrease</td><td className="px-4 py-3 text-muted-foreground">80 to 60</td><td className="hidden px-4 py-3 text-muted-foreground md:table-cell">25% decrease</td></tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section id="faq" className="rounded-lg border border-border bg-card p-6 md:p-8">
              <h2 className="text-2xl font-black tracking-tight text-foreground">Percentage Calculator FAQ</h2>
              <div className="mt-6 space-y-3">
                {FAQS.map((faq) => <FaqItem key={faq.question} question={faq.question} answer={faq.answer} />)}
              </div>
            </section>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-lg border border-border bg-card p-5">
              <h2 className="text-sm font-black uppercase tracking-wide text-foreground">Related Tools</h2>
              <div className="mt-4 space-y-2">
                {RELATED_TOOLS.map((tool) => (
                  <Link key={tool.slug} href={getCanonicalToolPath(tool.slug)} className="group flex gap-3 rounded-lg p-2 transition hover:bg-muted">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
                      <Calculator className="h-4 w-4" />
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-foreground group-hover:text-primary">{tool.title}</span>
                      <span className="block text-xs leading-5 text-muted-foreground">{tool.text}</span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <h2 className="text-sm font-black uppercase tracking-wide text-foreground">On This Page</h2>
              <div className="mt-4 grid gap-2 text-sm">
                {[["Calculator", "#calculator"], ["Formulas", "#formulas"], ["Examples", "#examples"], ["FAQ", "#faq"]].map(([label, href]) => (
                  <a key={href} href={href} className="text-muted-foreground hover:text-primary">{label}</a>
                ))}
              </div>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <h2 className="text-sm font-black uppercase tracking-wide text-foreground">Share This Tool</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">Share this free percentage calculator for quick percent math.</p>
              <button type="button" onClick={copyLink} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-secondary px-4 py-3 text-sm font-bold text-secondary-foreground hover:bg-secondary/90">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Link copied" : "Copy link"}
              </button>
            </div>
          </aside>
        </div>
      </main>
    </Layout>
  );
}
