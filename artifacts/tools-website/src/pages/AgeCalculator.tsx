import { useMemo, useState } from "react";
import { Link } from "wouter";
import {
  addYears,
  differenceInDays,
  differenceInMonths,
  differenceInYears,
  format,
  isAfter,
  isValid,
  parseISO,
} from "date-fns";
import {
  BadgeCheck,
  CalendarDays,
  Check,
  ChevronRight,
  Clock,
  Copy,
} from "lucide-react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { getCanonicalToolPath } from "@/data/tools";

const CANONICAL_URL = "https://usonlinetools.com/time-date/online-age-calculator";
const META_DESCRIPTION =
  "Use this free age calculator to calculate exact age from date of birth in years, months, days, total days, and next birthday.";

type AgeResult = {
  years: number;
  months: number;
  days: number;
  totalMonths: number;
  totalDays: number;
  totalWeeks: number;
  daysToBirthday: number;
  nextBirthday: Date;
};

function calculateAge(birthDate: string, compareDate: string): AgeResult | null {
  const birth = parseISO(birthDate);
  const compare = parseISO(compareDate);

  if (!isValid(birth) || !isValid(compare) || isAfter(birth, compare)) {
    return null;
  }

  const years = differenceInYears(compare, birth);
  const afterYears = addYears(birth, years);
  const months = differenceInMonths(compare, afterYears);
  const afterMonths = new Date(afterYears);
  afterMonths.setMonth(afterMonths.getMonth() + months);
  const days = differenceInDays(compare, afterMonths);
  const totalMonths = differenceInMonths(compare, birth);
  const totalDays = differenceInDays(compare, birth);
  const totalWeeks = Math.floor(totalDays / 7);

  const thisYearBirthday = new Date(compare.getFullYear(), birth.getMonth(), birth.getDate());
  const nextBirthday =
    isAfter(thisYearBirthday, compare) || thisYearBirthday.getTime() === compare.getTime()
      ? thisYearBirthday
      : new Date(compare.getFullYear() + 1, birth.getMonth(), birth.getDate());

  return {
    years,
    months,
    days,
    totalMonths,
    totalDays,
    totalWeeks,
    daysToBirthday: differenceInDays(nextBirthday, compare),
    nextBirthday,
  };
}

const FAQS = [
  {
    question: "What is an age calculator?",
    answer:
      "An age calculator is an online tool that calculates exact age from a date of birth and a selected comparison date. It can show age in years, months, days, total days, total months, weeks, and days until the next birthday.",
  },
  {
    question: "How do I calculate my exact age?",
    answer:
      "Enter your date of birth and choose the date you want to calculate age on. The calculator subtracts the birth date from the selected date and returns the completed years, remaining months, and remaining days.",
  },
  {
    question: "Can I calculate age on a future date?",
    answer:
      "Yes. You can change the comparison date to a future date to calculate how old someone will be on a birthday, school date, work date, eligibility date, or event date.",
  },
  {
    question: "Can I calculate age in days?",
    answer:
      "Yes. This age calculator shows total days lived from the date of birth to the selected date. It also shows total months and completed weeks for quick date-of-birth calculations.",
  },
  {
    question: "Does this date of birth calculator handle leap years?",
    answer:
      "Yes. The calculator uses real calendar dates, so leap years, month lengths, and different year lengths are included in the result.",
  },
  {
    question: "What is the difference between age calculator and birthday calculator?",
    answer:
      "An age calculator focuses on exact age in years, months, days, and totals. A birthday calculator usually focuses on the next birthday date, day of week, or countdown. This page includes both exact age and next birthday timing.",
  },
  {
    question: "Can I use this for official documents?",
    answer:
      "This tool is useful for quick personal, school, HR, and planning estimates. For legal, immigration, insurance, medical, or official eligibility decisions, verify dates with the relevant document or authority.",
  },
];

const RELATED_TOOLS = [
  { slug: "date-difference-calculator", title: "Date Difference Calculator", text: "Count days between two dates." },
  { slug: "days-between-dates-calculator", title: "Days Between Dates Calculator", text: "Find exact calendar day gaps." },
  { slug: "day-of-week-calculator", title: "Day of Week Calculator", text: "Find the weekday for any date." },
  { slug: "age-in-days-calculator", title: "Age in Days Calculator", text: "Calculate total days old." },
  { slug: "half-birthday-calculator", title: "Half Birthday Calculator", text: "Find your half birthday date." },
  { slug: "retirement-age-calculator", title: "Retirement Age Calculator", text: "Estimate years until retirement." },
];

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

function StatCard({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="rounded-lg border border-border bg-background p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-black text-foreground">{value}</p>
      <p className="mt-1 text-sm text-muted-foreground">{note}</p>
    </div>
  );
}

export default function AgeCalculator() {
  const today = format(new Date(), "yyyy-MM-dd");
  const [birthDate, setBirthDate] = useState("");
  const [compareDate, setCompareDate] = useState(today);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    if (!birthDate || !compareDate) return null;
    return calculateAge(birthDate, compareDate);
  }, [birthDate, compareDate]);

  const schema = [
    {
      "@type": "WebApplication",
      name: "Age Calculator",
      url: CANONICAL_URL,
      applicationCategory: "UtilityApplication",
      operatingSystem: "Any",
      description:
        "A free age calculator that calculates exact age from date of birth in years, months, days, total days, and next birthday.",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      publisher: { "@type": "Organization", name: "US Online Tools", url: "https://usonlinetools.com/" },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://usonlinetools.com/" },
        { "@type": "ListItem", position: 2, name: "Time & Date", item: "https://usonlinetools.com/category/time-date" },
        { "@type": "ListItem", position: 3, name: "Age Calculator", item: CANONICAL_URL },
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

  const copyLink = () => {
    navigator.clipboard.writeText(CANONICAL_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layout>
      <SEO
        title="Age Calculator - Calculate Exact Age from Date of Birth"
        description={META_DESCRIPTION}
        canonical={CANONICAL_URL}
        schema={schema}
      />

      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <nav className="mb-7 flex items-center text-sm font-semibold text-muted-foreground">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="mx-2 h-4 w-4 text-primary" />
          <Link href="/category/time-date" className="hover:text-foreground">Time & Date</Link>
          <ChevronRight className="mx-2 h-4 w-4 text-primary" />
          <span className="text-foreground">Age Calculator</span>
        </nav>

        <section className="rounded-lg border border-border bg-card p-6 md:p-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_420px] lg:items-start">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary">
                <CalendarDays className="h-3.5 w-3.5" />
                Time & Date Tool
              </div>
              <h1 className="mt-5 max-w-3xl text-4xl font-black tracking-tight text-foreground md:text-5xl">
                Age Calculator
              </h1>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">
                Use this free age calculator to calculate exact age from date of birth in years, months, days,
                total days, total months, weeks, and next birthday. It works as a date of birth calculator,
                birthday calculator, age in days calculator, and age calculator by date.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {["Free age calculator", "Date of birth calculator", "Age in years months days", "Next birthday"].map((item) => (
                  <span key={item} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-bold text-muted-foreground">
                    <BadgeCheck className="h-3.5 w-3.5 text-primary" />
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div id="calculator" className="rounded-lg border border-primary/20 bg-background p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <CalendarDays className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-lg font-black text-foreground">Calculate Your Age</h2>
                  <p className="text-sm text-muted-foreground">Enter birth date and comparison date.</p>
                </div>
              </div>

              <div className="mt-5 grid gap-4">
                <label className="grid gap-2">
                  <span className="text-sm font-bold text-foreground">Date of birth</span>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(event) => setBirthDate(event.target.value)}
                    className="h-12 rounded-lg border border-border bg-card px-4 text-foreground outline-none transition focus:border-primary"
                  />
                </label>
                <label className="grid gap-2">
                  <span className="text-sm font-bold text-foreground">Calculate age on</span>
                  <input
                    type="date"
                    value={compareDate}
                    onChange={(event) => setCompareDate(event.target.value)}
                    className="h-12 rounded-lg border border-border bg-card px-4 text-foreground outline-none transition focus:border-primary"
                  />
                </label>
              </div>

              <div className="mt-5 rounded-lg border border-dashed border-border bg-card p-4">
                {!birthDate ? (
                  <p className="text-sm leading-6 text-muted-foreground">
                    Add your date of birth to calculate exact age, total days old, and next birthday.
                  </p>
                ) : result ? (
                  <div>
                    <p className="text-sm font-bold uppercase tracking-wide text-primary">Exact age</p>
                    <p className="mt-2 text-3xl font-black text-foreground">
                      {result.years} years, {result.months} months, {result.days} days
                    </p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      You are {result.totalDays.toLocaleString()} days old as of {format(parseISO(compareDate), "MMMM d, yyyy")}.
                    </p>
                  </div>
                ) : (
                  <p className="text-sm leading-6 text-destructive">
                    Enter a valid date of birth that is not after the comparison date.
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        {result && (
          <section className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Total Days" value={result.totalDays.toLocaleString()} note="Days from birth date to selected date." />
            <StatCard label="Total Months" value={result.totalMonths.toLocaleString()} note="Completed calendar months." />
            <StatCard label="Total Weeks" value={result.totalWeeks.toLocaleString()} note="Completed seven-day weeks." />
            <StatCard label="Next Birthday" value={`${result.daysToBirthday} days`} note={format(result.nextBirthday, "MMMM d, yyyy")} />
          </section>
        )}

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="space-y-8">
            <section className="rounded-lg border border-border bg-card p-6 md:p-8">
              <h2 className="text-2xl font-black tracking-tight text-foreground">Quick Answer: How Old Am I?</h2>
              <p className="mt-4 leading-8 text-muted-foreground">
                Your exact age is the time between your date of birth and the date you choose. This age calculator
                shows completed years first, then remaining months and days. It also shows total days lived and the
                number of days until your next birthday.
              </p>
            </section>

            <section className="rounded-lg border border-border bg-card p-6 md:p-8">
              <h2 className="text-2xl font-black tracking-tight text-foreground">How to Use This Age Calculator</h2>
              <ol className="mt-5 grid gap-3 text-muted-foreground">
                <li><strong className="text-foreground">1.</strong> Enter the date of birth.</li>
                <li><strong className="text-foreground">2.</strong> Leave today selected or choose another date.</li>
                <li><strong className="text-foreground">3.</strong> Review exact age in years, months, and days.</li>
                <li><strong className="text-foreground">4.</strong> Check total days, total months, total weeks, and next birthday.</li>
              </ol>
            </section>

            <section className="rounded-lg border border-border bg-card p-6 md:p-8">
              <h2 className="text-2xl font-black tracking-tight text-foreground">Common Age Calculator Uses</h2>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {[
                  ["Personal age", "Calculate how old you are today in years, months, and days."],
                  ["Birthday countdown", "Find how many days remain until the next birthday."],
                  ["School and forms", "Check age by a school date, sports date, or application date."],
                  ["Work planning", "Estimate age on an employment, benefits, or retirement planning date."],
                  ["Age in days", "Find total days old for milestones, records, or fun facts."],
                  ["Past or future dates", "Calculate age on a previous event date or future calendar date."],
                ].map(([title, text]) => (
                  <div key={title} className="rounded-lg border border-border bg-background p-4">
                    <h3 className="font-bold text-foreground">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-lg border border-border bg-card p-6 md:p-8">
              <h2 className="text-2xl font-black tracking-tight text-foreground">Age Calculator Formula</h2>
              <p className="mt-4 leading-8 text-muted-foreground">
                Age is calculated by comparing the date of birth with the selected date. The calculator counts the
                number of full years first, then counts the full months after those years, then counts the remaining
                days. This avoids rough 365-day estimates and gives a calendar-based age result.
              </p>
              <div className="mt-5 rounded-lg border border-border bg-background p-4 text-sm text-muted-foreground">
                <p><strong className="text-foreground">Exact age:</strong> comparison date minus date of birth</p>
                <p><strong className="text-foreground">Total days:</strong> full days between date of birth and comparison date</p>
                <p><strong className="text-foreground">Next birthday:</strong> next occurrence of the birth month and birth day</p>
              </div>
            </section>

            <section className="rounded-lg border border-border bg-card p-6 md:p-8">
              <h2 className="text-2xl font-black tracking-tight text-foreground">Age Calculator FAQ</h2>
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
                      <Clock className="h-4 w-4" />
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
              <h2 className="text-sm font-black uppercase tracking-wide text-foreground">Trust Note</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                This calculator is for general date math and planning. Verify official age requirements with the
                relevant document, form, organization, or authority.
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
