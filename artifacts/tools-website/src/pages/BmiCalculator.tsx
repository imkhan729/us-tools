import { useMemo, useState } from "react";
import { Link } from "wouter";
import {
  Activity,
  BadgeCheck,
  Check,
  ChevronRight,
  Copy,
  HeartPulse,
  Info,
  Scale,
} from "lucide-react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { getCanonicalToolPath } from "@/data/tools";

const CANONICAL_URL = "https://usonlinetools.com/health/online-bmi-calculator";
const META_DESCRIPTION =
  "Use this free BMI calculator to calculate body mass index with metric or imperial units and see adult BMI categories.";

type UnitSystem = "metric" | "imperial";

type BmiCategory = {
  label: string;
  range: string;
  description: string;
  colorClass: string;
  marker: number;
};

const BMI_CATEGORIES: BmiCategory[] = [
  {
    label: "Underweight",
    range: "Below 18.5",
    description: "Below the standard adult healthy weight range.",
    colorClass: "text-sky-600 dark:text-sky-400",
    marker: 12,
  },
  {
    label: "Healthy weight",
    range: "18.5 to 24.9",
    description: "Within the standard adult healthy weight range.",
    colorClass: "text-emerald-600 dark:text-emerald-400",
    marker: 38,
  },
  {
    label: "Overweight",
    range: "25.0 to 29.9",
    description: "Above the standard adult healthy weight range.",
    colorClass: "text-amber-600 dark:text-amber-400",
    marker: 64,
  },
  {
    label: "Obesity",
    range: "30.0 and above",
    description: "At or above the adult BMI obesity threshold.",
    colorClass: "text-rose-600 dark:text-rose-400",
    marker: 88,
  },
];

const FAQS = [
  {
    question: "What is a BMI calculator?",
    answer:
      "A BMI calculator is an online tool that calculates body mass index from height and weight. BMI is commonly used as an adult screening measure for weight categories, but it does not directly measure body fat or diagnose health.",
  },
  {
    question: "How do I calculate BMI?",
    answer:
      "For metric units, BMI equals weight in kilograms divided by height in meters squared. For US customary units, BMI equals weight in pounds divided by height in inches squared, multiplied by 703.",
  },
  {
    question: "What are the adult BMI categories?",
    answer:
      "For adults age 20 and older, common BMI categories are underweight below 18.5, healthy weight from 18.5 to less than 25, overweight from 25 to less than 30, and obesity at 30 or greater.",
  },
  {
    question: "Is BMI accurate for everyone?",
    answer:
      "BMI is useful for quick screening, but it has limits. It does not distinguish muscle from fat, does not show body fat distribution, and may be less informative for athletes, older adults, pregnant people, and some medical situations.",
  },
  {
    question: "Can children use this BMI calculator?",
    answer:
      "This page is designed for adult BMI screening. Children and teens need BMI-for-age percentiles based on age and sex, so their results should be interpreted with a pediatric growth chart or a qualified healthcare professional.",
  },
  {
    question: "Does BMI diagnose obesity or health risk?",
    answer:
      "No. BMI is a screening measure, not a diagnosis. A healthcare professional may consider BMI along with waist circumference, medical history, blood pressure, labs, body composition, symptoms, medications, and other factors.",
  },
  {
    question: "What is a healthy BMI?",
    answer:
      "For most adults, the standard healthy weight BMI category is 18.5 to less than 25. Your personal health picture can still depend on body composition, waist measurement, fitness, age, medical conditions, and clinical guidance.",
  },
];

const RELATED_TOOLS = [
  { slug: "online-bmr-calculator", title: "BMR Calculator", text: "Estimate calories burned at rest." },
  { slug: "online-tdee-calculator", title: "TDEE Calculator", text: "Estimate total daily energy needs." },
  { slug: "calorie-intake-calculator", title: "Calorie Intake Calculator", text: "Plan daily calorie targets." },
  { slug: "body-fat-calculator", title: "Body Fat Calculator", text: "Estimate body fat percentage." },
  { slug: "waist-to-hip-ratio-calculator", title: "Waist to Hip Ratio Calculator", text: "Compare waist and hip measurements." },
  { slug: "weight-converter", title: "Weight Converter", text: "Convert pounds, kilograms, and stones." },
];

function getBmiCategory(bmi: number): BmiCategory {
  if (bmi < 18.5) return BMI_CATEGORIES[0];
  if (bmi < 25) return BMI_CATEGORIES[1];
  if (bmi < 30) return BMI_CATEGORIES[2];
  return BMI_CATEGORIES[3];
}

function calculateBmi({
  unit,
  heightCm,
  weightKg,
  feet,
  inches,
  pounds,
}: {
  unit: UnitSystem;
  heightCm: string;
  weightKg: string;
  feet: string;
  inches: string;
  pounds: string;
}) {
  if (unit === "metric") {
    const height = Number(heightCm);
    const weight = Number(weightKg);
    if (!height || !weight || height <= 0 || weight <= 0) return null;
    const meters = height / 100;
    return weight / (meters * meters);
  }

  const ft = Number(feet);
  const inch = Number(inches || "0");
  const weight = Number(pounds);
  const totalInches = ft * 12 + inch;
  if (!totalInches || !weight || totalInches <= 0 || weight <= 0) return null;
  return (weight / (totalInches * totalInches)) * 703;
}

function getHealthyWeightRange(unit: UnitSystem, heightCm: string, feet: string, inches: string) {
  let meters: number | null = null;

  if (unit === "metric") {
    const cm = Number(heightCm);
    if (cm > 0) meters = cm / 100;
  } else {
    const totalInches = Number(feet) * 12 + Number(inches || "0");
    if (totalInches > 0) meters = totalInches * 0.0254;
  }

  if (!meters) return null;

  const minKg = 18.5 * meters * meters;
  const maxKg = 24.9 * meters * meters;

  if (unit === "metric") {
    return `${minKg.toFixed(1)} kg to ${maxKg.toFixed(1)} kg`;
  }

  return `${(minKg * 2.2046226218).toFixed(1)} lb to ${(maxKg * 2.2046226218).toFixed(1)} lb`;
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group rounded-lg border border-border bg-background p-5">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-bold text-foreground">
        {question}
        <ChevronRight className="h-4 w-4 shrink-0 text-primary transition group-open:rotate-90" />
      </summary>
      <p className="mt-3 leading-7 text-muted-foreground">{answer}</p>
    </details>
  );
}

export default function BmiCalculator() {
  const [unit, setUnit] = useState<UnitSystem>("metric");
  const [heightCm, setHeightCm] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [feet, setFeet] = useState("");
  const [inches, setInches] = useState("");
  const [pounds, setPounds] = useState("");
  const [copied, setCopied] = useState(false);

  const bmi = useMemo(
    () => calculateBmi({ unit, heightCm, weightKg, feet, inches, pounds }),
    [unit, heightCm, weightKg, feet, inches, pounds],
  );
  const category = bmi ? getBmiCategory(bmi) : null;
  const healthyRange = getHealthyWeightRange(unit, heightCm, feet, inches);

  const schema = [
    {
      "@type": "WebApplication",
      name: "BMI Calculator",
      url: CANONICAL_URL,
      applicationCategory: "HealthApplication",
      operatingSystem: "Any",
      description:
        "A free adult BMI calculator that calculates body mass index from height and weight using metric or imperial units.",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      publisher: { "@type": "Organization", name: "US Online Tools", url: "https://usonlinetools.com/" },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://usonlinetools.com/" },
        { "@type": "ListItem", position: 2, name: "Health & Fitness", item: "https://usonlinetools.com/category/health" },
        { "@type": "ListItem", position: 3, name: "BMI Calculator", item: CANONICAL_URL },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQS.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    },
  ];

  const inputClass =
    "h-12 rounded-lg border border-border bg-card px-4 text-foreground outline-none transition focus:border-primary";

  const copyLink = () => {
    navigator.clipboard.writeText(CANONICAL_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layout>
      <SEO
        title="BMI Calculator - Calculate Body Mass Index"
        description={META_DESCRIPTION}
        canonical={CANONICAL_URL}
        schema={schema}
      />

      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <nav className="mb-7 flex items-center text-sm font-semibold text-muted-foreground">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="mx-2 h-4 w-4 text-primary" />
          <Link href="/category/health" className="hover:text-foreground">Health & Fitness</Link>
          <ChevronRight className="mx-2 h-4 w-4 text-primary" />
          <span className="text-foreground">BMI Calculator</span>
        </nav>

        <section className="rounded-lg border border-border bg-card p-6 md:p-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_430px] lg:items-start">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary">
                <HeartPulse className="h-3.5 w-3.5" />
                Adult BMI Screening Tool
              </div>
              <h1 className="mt-5 max-w-3xl text-4xl font-black tracking-tight text-foreground md:text-5xl">
                BMI Calculator
              </h1>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">
                Use this free BMI calculator to calculate body mass index from height and weight. Enter metric
                units or imperial units to see your BMI score, adult BMI category, healthy weight range, and the
                body mass index formula.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {["Free BMI calculator", "Metric and imperial", "Adult BMI categories", "Body mass index formula"].map((item) => (
                  <span key={item} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-bold text-muted-foreground">
                    <BadgeCheck className="h-3.5 w-3.5 text-primary" />
                    {item}
                  </span>
                ))}
              </div>
              <div className="mt-6 flex gap-3 rounded-lg border border-amber-300/40 bg-amber-50 p-4 text-sm leading-6 text-amber-950 dark:border-amber-500/25 dark:bg-amber-500/10 dark:text-amber-100">
                <Info className="mt-0.5 h-4 w-4 shrink-0" />
                <p>
                  This adult BMI calculator is for general education and screening only. BMI does not diagnose body
                  fatness, health status, or disease risk. Speak with a qualified healthcare professional for personal
                  medical guidance.
                </p>
              </div>
            </div>

            <div id="calculator" className="rounded-lg border border-primary/20 bg-background p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Scale className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-lg font-black text-foreground">Calculate BMI</h2>
                  <p className="text-sm text-muted-foreground">Enter height and weight.</p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 rounded-lg border border-border bg-card p-1">
                {(["metric", "imperial"] as const).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setUnit(option)}
                    className={`rounded-md px-3 py-2 text-sm font-bold transition ${
                      unit === option ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {option === "metric" ? "Metric" : "Imperial"}
                  </button>
                ))}
              </div>

              <div className="mt-5 grid gap-4">
                {unit === "metric" ? (
                  <>
                    <label className="grid gap-2">
                      <span className="text-sm font-bold text-foreground">Height in centimeters</span>
                      <input type="number" min="1" inputMode="decimal" placeholder="175" value={heightCm} onChange={(event) => setHeightCm(event.target.value)} className={inputClass} />
                    </label>
                    <label className="grid gap-2">
                      <span className="text-sm font-bold text-foreground">Weight in kilograms</span>
                      <input type="number" min="1" inputMode="decimal" placeholder="70" value={weightKg} onChange={(event) => setWeightKg(event.target.value)} className={inputClass} />
                    </label>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <label className="grid gap-2">
                        <span className="text-sm font-bold text-foreground">Feet</span>
                        <input type="number" min="1" inputMode="decimal" placeholder="5" value={feet} onChange={(event) => setFeet(event.target.value)} className={inputClass} />
                      </label>
                      <label className="grid gap-2">
                        <span className="text-sm font-bold text-foreground">Inches</span>
                        <input type="number" min="0" inputMode="decimal" placeholder="9" value={inches} onChange={(event) => setInches(event.target.value)} className={inputClass} />
                      </label>
                    </div>
                    <label className="grid gap-2">
                      <span className="text-sm font-bold text-foreground">Weight in pounds</span>
                      <input type="number" min="1" inputMode="decimal" placeholder="154" value={pounds} onChange={(event) => setPounds(event.target.value)} className={inputClass} />
                    </label>
                  </>
                )}
              </div>

              <div className="mt-5 rounded-lg border border-dashed border-border bg-card p-4">
                {bmi && category ? (
                  <div>
                    <p className="text-sm font-bold uppercase tracking-wide text-primary">Your BMI</p>
                    <div className="mt-2 flex items-end justify-between gap-4">
                      <p className="text-5xl font-black text-foreground">{bmi.toFixed(1)}</p>
                      <p className={`pb-1 text-right text-lg font-black ${category.colorClass}`}>{category.label}</p>
                    </div>
                    <div className="mt-4 h-3 rounded-full bg-gradient-to-r from-sky-400 via-emerald-400 via-amber-400 to-rose-500">
                      <div className="relative h-3">
                        <span
                          className="absolute -top-1 h-5 w-1 rounded-full bg-foreground"
                          style={{ left: `${category.marker}%` }}
                        />
                      </div>
                    </div>
                    <p className="mt-4 text-sm leading-6 text-muted-foreground">
                      {category.description}
                      {healthyRange ? ` Estimated healthy weight range for this height: ${healthyRange}.` : ""}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm leading-6 text-muted-foreground">
                    Add your height and weight to calculate BMI, category, and estimated adult healthy weight range.
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="space-y-8">
            <section className="rounded-lg border border-border bg-card p-6 md:p-8">
              <h2 className="text-2xl font-black tracking-tight text-foreground">Quick Answer: What Is BMI?</h2>
              <p className="mt-4 leading-8 text-muted-foreground">
                BMI, or body mass index, is a number calculated from height and weight. For adults age 20 and older,
                BMI is often used as a screening measure for weight categories. It is not a direct measure of body fat
                and should be interpreted with other health information.
              </p>
            </section>

            <section className="rounded-lg border border-border bg-card p-6 md:p-8">
              <h2 className="text-2xl font-black tracking-tight text-foreground">BMI Formula</h2>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-border bg-background p-4">
                  <h3 className="font-bold text-foreground">Metric BMI formula</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">BMI = weight (kg) / height (m)^2</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">Example: 70 kg / 1.75^2 = 22.9 BMI</p>
                </div>
                <div className="rounded-lg border border-border bg-background p-4">
                  <h3 className="font-bold text-foreground">Imperial BMI formula</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">BMI = weight (lb) / height (in)^2 x 703</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">Example: 154 lb / 69^2 x 703 = 22.7 BMI</p>
                </div>
              </div>
            </section>

            <section className="rounded-lg border border-border bg-card p-6 md:p-8">
              <h2 className="text-2xl font-black tracking-tight text-foreground">Adult BMI Categories</h2>
              <div className="mt-5 overflow-hidden rounded-lg border border-border">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted text-foreground">
                    <tr>
                      <th className="px-4 py-3 font-bold">Category</th>
                      <th className="px-4 py-3 font-bold">BMI Range</th>
                      <th className="hidden px-4 py-3 font-bold md:table-cell">Meaning</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {BMI_CATEGORIES.map((item) => (
                      <tr key={item.label}>
                        <td className={`px-4 py-3 font-bold ${item.colorClass}`}>{item.label}</td>
                        <td className="px-4 py-3 text-muted-foreground">{item.range}</td>
                        <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">{item.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                These standard adult BMI categories apply to adults age 20 and older. Children and teens need
                BMI-for-age percentiles rather than adult BMI ranges.
              </p>
            </section>

            <section className="rounded-lg border border-border bg-card p-6 md:p-8">
              <h2 className="text-2xl font-black tracking-tight text-foreground">How to Use This BMI Calculator</h2>
              <ol className="mt-5 grid gap-3 text-muted-foreground">
                <li><strong className="text-foreground">1.</strong> Choose metric or imperial units.</li>
                <li><strong className="text-foreground">2.</strong> Enter your height and weight.</li>
                <li><strong className="text-foreground">3.</strong> Review your BMI number and adult BMI category.</li>
                <li><strong className="text-foreground">4.</strong> Use the result as a screening estimate, not a diagnosis.</li>
              </ol>
            </section>

            <section className="rounded-lg border border-border bg-card p-6 md:p-8">
              <h2 className="text-2xl font-black tracking-tight text-foreground">BMI Limits and Health Context</h2>
              <p className="mt-4 leading-8 text-muted-foreground">
                BMI is popular because it is simple, fast, and low cost. However, it does not show body fat percentage,
                muscle mass, bone density, waist size, fat distribution, pregnancy status, or personal medical history.
                A high or low BMI can be a reason to look more closely, but health decisions should not be based on BMI
                alone.
              </p>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {[
                  ["Athletes and muscular builds", "BMI may be high because of lean mass rather than body fat."],
                  ["Older adults", "BMI may miss muscle loss or changes in body composition."],
                  ["Children and teens", "BMI should be interpreted by percentile for age and sex."],
                  ["Pregnancy", "Adult BMI categories are not designed for pregnancy weight changes."],
                ].map(([title, text]) => (
                  <div key={title} className="rounded-lg border border-border bg-background p-4">
                    <h3 className="font-bold text-foreground">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-lg border border-border bg-card p-6 md:p-8">
              <h2 className="text-2xl font-black tracking-tight text-foreground">BMI Calculator FAQ</h2>
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
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Activity className="h-4 w-4" />
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
              <h2 className="text-sm font-black uppercase tracking-wide text-foreground">Reference Note</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Adult BMI categories here follow common CDC and NIH ranges for adults age 20 and older. This page is
                informational and is not medical advice.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <h2 className="text-sm font-black uppercase tracking-wide text-foreground">Share This Tool</h2>
              <button type="button" onClick={copyLink} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90">
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
