import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import {
  addYears,
  differenceInCalendarDays,
  differenceInDays,
  differenceInMonths,
  differenceInYears,
  format,
  isAfter,
  isValid,
  parseISO,
} from "date-fns";
import { CalendarDays, Copy, RotateCcw } from "lucide-react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";

const canonical = "https://usonlinetools.com/ar/hesab-alomr";

const hijriMonths = [
  "محرم",
  "صفر",
  "ربيع الأول",
  "ربيع الآخر",
  "جمادى الأولى",
  "جمادى الآخرة",
  "رجب",
  "شعبان",
  "رمضان",
  "شوال",
  "ذو القعدة",
  "ذو الحجة",
];

const faqs = [
  {
    q: "كيف أحسب عمري بالضبط؟",
    a: "أدخل تاريخ ميلادك في حاسبة العمر واختر تاريخ الحساب. ستظهر النتيجة بالسنوات والشهور والأيام مع تفاصيل إضافية مثل إجمالي الأيام وموعد عيد الميلاد القادم.",
  },
  {
    q: "كيف أعرف عمري بالميلادي؟",
    a: "اختر تبويب التاريخ الميلادي، أدخل يوم وشهر وسنة الميلاد، ثم اضغط احسب عمري.",
  },
  {
    q: "كيف أحسب عمري بالهجري؟",
    a: "اختر التبويب الهجري وأدخل تاريخ ميلادك الهجري. تستخدم الأداة تقويم أم القرى المتاح في المتصفح لتحويل التاريخ وحساب العمر.",
  },
  {
    q: "لماذا عمري بالهجري أكبر من عمري بالميلادي؟",
    a: "لأن السنة الهجرية أقصر من السنة الميلادية بنحو 10 إلى 11 يومًا تقريبًا، ولذلك يمر عدد أكبر من السنوات الهجرية خلال نفس الفترة الزمنية.",
  },
  {
    q: "هل يمكن حساب العمر حتى تاريخ مستقبلي؟",
    a: "نعم. اختر تاريخًا في حقل احسب العمر حتى تاريخ، بشرط أن يكون بعد تاريخ الميلاد.",
  },
  {
    q: "هل يمكن معرفة كم يوم عشت؟",
    a: "نعم. تعرض الحاسبة إجمالي الأيام بين تاريخ ميلادك وتاريخ الحساب.",
  },
  {
    q: "هل تحسب الأداة السنوات الكبيسة؟",
    a: "نعم. تعتمد الحاسبة على تواريخ تقويمية فعلية، لذلك تراعي السنوات الكبيسة وأطوال الأشهر المختلفة عند حساب العمر الميلادي.",
  },
  {
    q: "هل التاريخ الهجري دقيق 100%؟",
    a: "يُحسب التاريخ الهجري وفق تقويم أم القرى عند توفره، وقد تختلف بداية الشهر الهجري بيوم بحسب الرؤية أو الإعلان الرسمي في بلدك.",
  },
  {
    q: "ماذا يحدث إذا أدخلت تاريخ ميلاد في المستقبل؟",
    a: "تظهر رسالة خطأ واضحة لأن تاريخ الميلاد لا يمكن أن يكون بعد تاريخ الحساب.",
  },
  {
    q: "هل تحفظ الأداة تاريخ ميلادي؟",
    a: "تتم عملية الحساب داخل متصفحك ولا نحتاج إلى حفظ تاريخ ميلادك.",
  },
];

type InputMode = "gregorian" | "hijri";

type AgeParts = {
  years: number;
  months: number;
  days: number;
};

type AgeResult = AgeParts & {
  totalDays: number;
  totalWeeks: number;
  weekRemainder: number;
  totalMonths: number;
  totalHours: number;
  birthDayName: string;
  nextBirthday: Date;
  daysToBirthday: number;
  hijriAge: AgeParts | null;
};

function toArabicNumber(value: number) {
  return value.toLocaleString("ar-SA");
}

function formatArabicDate(date: Date) {
  return new Intl.DateTimeFormat("ar-SA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

function formatHijriDate(date: Date) {
  return new Intl.DateTimeFormat("ar-SA-u-ca-islamic-umalqura", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

function formatDayName(date: Date) {
  return new Intl.DateTimeFormat("ar-SA", { weekday: "long" }).format(date);
}

function getHijriParts(date: Date) {
  const parts = new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    timeZone: "UTC",
  }).formatToParts(date);

  return {
    year: Number(parts.find((part) => part.type === "year")?.value),
    month: Number(parts.find((part) => part.type === "month")?.value),
    day: Number(parts.find((part) => part.type === "day")?.value),
  };
}

function sameHijriDate(date: Date, year: number, month: number, day: number) {
  const parts = getHijriParts(date);
  return parts.year === year && parts.month === month && parts.day === day;
}

function findGregorianFromHijri(year: number, month: number, day: number) {
  if (!year || month < 1 || month > 12 || day < 1 || day > 30) {
    return null;
  }

  const anchorDay = Date.UTC(2025, 5, 26) / 86400000;
  const estimatedDay = Math.round(anchorDay + (year - 1447) * 354.367 + (month - 1) * 29.53 + (day - 1));
  const center = new Date(estimatedDay * 86400000);

  for (let offset = -45; offset <= 45; offset += 1) {
    const candidate = new Date(center);
    candidate.setUTCDate(center.getUTCDate() + offset);
    if (sameHijriDate(candidate, year, month, day)) {
      return new Date(candidate.getUTCFullYear(), candidate.getUTCMonth(), candidate.getUTCDate());
    }
  }

  return null;
}

function calendarAge(start: Date, end: Date) {
  if (!isValid(start) || !isValid(end) || isAfter(start, end)) {
    return null;
  }

  const years = differenceInYears(end, start);
  const afterYears = addYears(start, years);
  const months = differenceInMonths(end, afterYears);
  const afterMonths = new Date(afterYears);
  afterMonths.setMonth(afterMonths.getMonth() + months);
  const days = differenceInDays(end, afterMonths);

  return { years, months, days };
}

function nextBirthdayFrom(birthDate: Date, compareDate: Date) {
  const sameYearBirthday = new Date(compareDate.getFullYear(), birthDate.getMonth(), birthDate.getDate());
  return isAfter(sameYearBirthday, compareDate) || differenceInCalendarDays(sameYearBirthday, compareDate) === 0
    ? sameYearBirthday
    : new Date(compareDate.getFullYear() + 1, birthDate.getMonth(), birthDate.getDate());
}

function calculateHijriAge(birthDate: Date, compareDate: Date) {
  const start = getHijriParts(birthDate);
  const end = getHijriParts(compareDate);
  if (!start.year || !start.month || !start.day || !end.year || !end.month || !end.day) {
    return null;
  }

  let years = end.year - start.year;
  let months = end.month - start.month;
  let days = end.day - start.day;

  if (days < 0) {
    months -= 1;
    days += 30;
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return { years, months, days };
}

function calculateAge(birthDate: Date, compareDate: Date): AgeResult | null {
  const mainAge = calendarAge(birthDate, compareDate);
  if (!mainAge) {
    return null;
  }

  const totalDays = differenceInCalendarDays(compareDate, birthDate);
  const nextBirthday = nextBirthdayFrom(birthDate, compareDate);

  return {
    ...mainAge,
    totalDays,
    totalWeeks: Math.floor(totalDays / 7),
    weekRemainder: totalDays % 7,
    totalMonths: mainAge.years * 12 + mainAge.months,
    totalHours: totalDays * 24,
    birthDayName: formatDayName(birthDate),
    nextBirthday,
    daysToBirthday: differenceInCalendarDays(nextBirthday, compareDate),
    hijriAge: calculateHijriAge(birthDate, compareDate),
  };
}

function AgePhrase({ result }: { result: AgeParts }) {
  return (
    <>
      {toArabicNumber(result.years)} سنة و{toArabicNumber(result.months)} أشهر و{toArabicNumber(result.days)} أيام
    </>
  );
}

function ResultCard({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-background p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-xl font-black leading-8 text-foreground">{value}</p>
    </div>
  );
}

export default function ArabicAgeCalculator() {
  const today = format(new Date(), "yyyy-MM-dd");
  const [mode, setMode] = useState<InputMode>("gregorian");
  const [birth, setBirth] = useState("2000-01-10");
  const [compare, setCompare] = useState(today);
  const [hijriYear, setHijriYear] = useState("1420");
  const [hijriMonth, setHijriMonth] = useState("9");
  const [hijriDay, setHijriDay] = useState("15");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const element = document.documentElement;
    const previousLang = element.lang;
    const previousDir = element.dir;
    element.lang = "ar";
    element.dir = "rtl";

    return () => {
      element.lang = previousLang;
      element.dir = previousDir;
    };
  }, []);

  const birthDate = useMemo(() => {
    if (mode === "gregorian") {
      const parsed = parseISO(birth);
      return isValid(parsed) ? parsed : null;
    }

    return findGregorianFromHijri(Number(hijriYear), Number(hijriMonth), Number(hijriDay));
  }, [birth, hijriDay, hijriMonth, hijriYear, mode]);

  const compareDate = useMemo(() => {
    const parsed = parseISO(compare);
    return isValid(parsed) ? parsed : null;
  }, [compare]);

  const result = useMemo(() => {
    if (!birthDate || !compareDate) {
      return null;
    }

    return calculateAge(birthDate, compareDate);
  }, [birthDate, compareDate]);

  const error = useMemo(() => {
    if (!birthDate) {
      return mode === "hijri" ? "لم نتمكن من تحويل التاريخ الهجري المدخل. تأكد من اليوم والشهر والسنة." : "أدخل تاريخ ميلاد صحيح.";
    }

    if (!compareDate) {
      return "أدخل تاريخ حساب صحيح.";
    }

    if (!result) {
      return "تاريخ الميلاد لا يمكن أن يكون بعد تاريخ الحساب.";
    }

    return "";
  }, [birthDate, compareDate, mode, result]);

  const resultText =
    result && birthDate && compareDate
      ? [
          `تاريخ الميلاد: ${formatArabicDate(birthDate)} (${formatHijriDate(birthDate)})`,
          `تاريخ الحساب: ${formatArabicDate(compareDate)} (${formatHijriDate(compareDate)})`,
          `العمر بالميلادي: ${result.years} سنة و${result.months} أشهر و${result.days} أيام`,
          result.hijriAge ? `العمر بالهجري: ${result.hijriAge.years} سنة و${result.hijriAge.months} أشهر و${result.hijriAge.days} أيام` : "",
          `إجمالي الأيام: ${result.totalDays}`,
          `إجمالي الأسابيع: ${result.totalWeeks} أسبوع و${result.weekRemainder} يوم`,
          `عيد الميلاد القادم: ${formatArabicDate(result.nextBirthday)}`,
          `الأيام المتبقية: ${result.daysToBirthday}`,
        ]
          .filter(Boolean)
          .join("\n")
      : "";

  const copyResult = async () => {
    if (!resultText) {
      return;
    }

    await navigator.clipboard.writeText(resultText);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  const reset = () => {
    setMode("gregorian");
    setBirth("2000-01-10");
    setCompare(today);
    setHijriYear("1420");
    setHijriMonth("9");
    setHijriDay("15");
    setCopied(false);
  };

  const schema = [
    {
      "@type": "WebApplication",
      name: "حاسبة العمر بالهجري والميلادي",
      url: canonical,
      applicationCategory: "CalculatorApplication",
      operatingSystem: "Any",
      inLanguage: "ar",
      description: "احسب عمرك بالسنوات والشهور والأيام بالتقويمين الميلادي والهجري.",
    },
    {
      "@type": "WebPage",
      name: "حساب العمر بالهجري والميلادي",
      url: canonical,
      inLanguage: "ar",
      description: "حاسبة عمر عربية لمعرفة العمر الدقيق وإجمالي الأيام والأسابيع وموعد عيد الميلاد القادم.",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "الرئيسية", item: "https://usonlinetools.com/" },
        { "@type": "ListItem", position: 2, name: "حساب العمر", item: canonical },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: { "@type": "Answer", text: faq.a },
      })),
    },
  ];

  return (
    <Layout>
      <SEO
        title="حساب العمر بالهجري والميلادي – حاسبة العمر الدقيقة | US Online Tools"
        description="احسب عمرك بالسنوات والشهور والأيام بالتقويمين الميلادي والهجري، واعرف إجمالي الأيام والأسابيع وموعد عيد ميلادك القادم مجانًا."
        canonical={canonical}
        schema={schema}
      />
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8" dir="rtl" lang="ar">
        <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/">الرئيسية</Link>
          <span>/</span>
          <span>حساب العمر</span>
        </nav>

        <section className="mb-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-bold text-primary">
            <CalendarDays className="h-4 w-4" />
            حاسبة العمر
          </div>
          <h1 className="mt-4 text-4xl font-black tracking-normal md:text-6xl">حساب العمر بالهجري والميلادي</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">
            أدخل تاريخ ميلادك لتحصل فورًا على عمرك بالسنوات والشهور والأيام، مع العمر بالهجري والميلادي، إجمالي الأيام والأسابيع، وموعد عيد ميلادك القادم.
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-lg border border-border bg-card p-5 shadow-sm md:p-6">
            <h2 className="text-2xl font-black">حاسبة العمر</h2>
            <div className="mt-5 grid grid-cols-2 gap-2 rounded-lg bg-muted p-1" role="tablist" aria-label="نوع تاريخ الميلاد">
              {[
                ["gregorian", "ميلادي"],
                ["hijri", "هجري"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setMode(value as InputMode)}
                  className={`rounded-md px-4 py-3 text-sm font-bold transition ${mode === value ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                  role="tab"
                  aria-selected={mode === value}
                >
                  {label}
                </button>
              ))}
            </div>

            {mode === "gregorian" ? (
              <label className="mt-5 grid gap-2">
                <span className="font-bold">تاريخ الميلاد</span>
                <input
                  type="date"
                  value={birth}
                  onChange={(event) => setBirth(event.target.value)}
                  className="h-12 rounded-lg border border-border bg-background px-4 text-right focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </label>
            ) : (
              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                <label className="grid gap-2">
                  <span className="font-bold">اليوم</span>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={hijriDay}
                    onChange={(event) => setHijriDay(event.target.value)}
                    className="h-12 rounded-lg border border-border bg-background px-4 text-right focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </label>
                <label className="grid gap-2">
                  <span className="font-bold">الشهر</span>
                  <select
                    value={hijriMonth}
                    onChange={(event) => setHijriMonth(event.target.value)}
                    className="h-12 rounded-lg border border-border bg-background px-4 text-right focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {hijriMonths.map((month, index) => (
                      <option key={month} value={index + 1}>
                        {month}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-2">
                  <span className="font-bold">السنة</span>
                  <input
                    type="number"
                    min="1300"
                    max="1600"
                    value={hijriYear}
                    onChange={(event) => setHijriYear(event.target.value)}
                    className="h-12 rounded-lg border border-border bg-background px-4 text-right focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </label>
              </div>
            )}

            <label className="mt-5 grid gap-2">
              <span className="font-bold">احسب العمر حتى تاريخ</span>
              <input
                type="date"
                value={compare}
                onChange={(event) => setCompare(event.target.value)}
                className="h-12 rounded-lg border border-border bg-background px-4 text-right focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <span className="text-sm text-muted-foreground">اتركه على تاريخ اليوم لمعرفة عمرك الحالي.</span>
            </label>

            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" onClick={copyResult} disabled={!result} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-bold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50">
                <Copy className="h-4 w-4" />
                {copied ? "تم النسخ" : "نسخ النتيجة"}
              </button>
              <button type="button" onClick={reset} className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-3 text-sm font-bold hover:bg-muted">
                <RotateCcw className="h-4 w-4" />
                إعادة
              </button>
            </div>

            <p className="mt-5 rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 text-sm leading-7 text-muted-foreground">
              يُحسب التاريخ الهجري وفق تقويم أم القرى عند توفره، وقد يختلف بداية الشهر الهجري بيوم بحسب الرؤية أو الإعلان الرسمي في بلدك.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-5 shadow-sm md:p-6" aria-live="polite">
            <h2 className="text-2xl font-black">النتيجة</h2>
            {error ? (
              <p className="mt-5 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm font-bold text-destructive">{error}</p>
            ) : null}
            {result && birthDate && compareDate ? (
              <div className="mt-5 space-y-4">
                <div className="rounded-lg border border-primary/20 bg-primary/10 p-5">
                  <p className="text-sm font-bold text-primary">كم عمري؟</p>
                  <p className="mt-2 text-3xl font-black leading-tight text-primary">
                    عمرك هو <AgePhrase result={result} />.
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <ResultCard label="العمر بالميلادي" value={<AgePhrase result={result} />} />
                  <ResultCard label="العمر بالهجري" value={result.hijriAge ? <AgePhrase result={result.hijriAge} /> : "غير متاح"} />
                  <ResultCard label="إجمالي الأشهر" value={toArabicNumber(result.totalMonths)} />
                  <ResultCard label="إجمالي الأسابيع" value={`${toArabicNumber(result.totalWeeks)} أسبوع و${toArabicNumber(result.weekRemainder)} يوم`} />
                  <ResultCard label="إجمالي الأيام" value={toArabicNumber(result.totalDays)} />
                  <ResultCard label="إجمالي الساعات" value={toArabicNumber(result.totalHours)} />
                  <ResultCard label="يوم الميلاد" value={result.birthDayName} />
                  <ResultCard label="عيد الميلاد القادم" value={result.daysToBirthday === 0 ? "عيد ميلادك اليوم" : formatArabicDate(result.nextBirthday)} />
                  <ResultCard label="متبقي على عيد الميلاد القادم" value={result.daysToBirthday === 0 ? "اليوم" : `${toArabicNumber(result.daysToBirthday)} يوم`} />
                </div>
                <div className="rounded-lg bg-muted/40 p-4 text-sm leading-7 text-muted-foreground">
                  <p>تاريخ الميلاد: {formatArabicDate(birthDate)} - {formatHijriDate(birthDate)}</p>
                  <p>تاريخ الحساب: {formatArabicDate(compareDate)} - {formatHijriDate(compareDate)}</p>
                </div>
              </div>
            ) : !error ? (
              <p className="mt-5 rounded-lg bg-muted/40 p-4 text-muted-foreground">أدخل تاريخ الميلاد لعرض العمر بالتفصيل.</p>
            ) : null}
          </div>
        </section>

        <section className="mt-10 grid gap-6">
          <article className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-2xl font-black">كيف يتم حساب العمر؟</h2>
            <p className="mt-4 leading-8 text-muted-foreground">
              يُحسب العمر من خلال إيجاد الفرق بين تاريخ الميلاد وتاريخ اليوم، أو بين تاريخ الميلاد وأي تاريخ آخر تختاره. وللحصول على نتيجة دقيقة لا يكفي طرح سنة الميلاد من السنة الحالية، لأن عدد أيام الأشهر يختلف وتوجد سنوات كبيسة.
            </p>
            <p className="mt-3 leading-8 text-muted-foreground">
              تقوم الحاسبة بحساب الفرق الفعلي وتعرض العمر بصيغة واضحة: سنوات + أشهر + أيام. فعلى سبيل المثال، إذا كان الشخص قد أكمل 26 سنة ثم مر بعد عيد ميلاده 4 أشهر و10 أيام، فستعرض الحاسبة النتيجة بهذه الصورة: 26 سنة و4 أشهر و10 أيام.
            </p>
          </article>

          <article className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-2xl font-black">حساب العمر بالميلادي</h2>
            <p className="mt-4 leading-8 text-muted-foreground">
              التقويم الميلادي هو الأكثر استخدامًا في المعاملات المدنية في كثير من الدول. لحساب العمر بالميلادي، أدخل تاريخ الميلاد باليوم والشهر والسنة، ثم اختر تاريخ الحساب أو اتركه على تاريخ اليوم.
            </p>
            <ul className="mt-4 grid list-disc gap-2 pr-6 leading-8 text-muted-foreground sm:grid-cols-2">
              <li>العمر بالسنوات والشهور والأيام.</li>
              <li>إجمالي الأيام والأسابيع.</li>
              <li>إجمالي الأشهر المكتملة.</li>
              <li>موعد عيد الميلاد القادم.</li>
            </ul>
          </article>

          <article className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-2xl font-black">حساب العمر بالهجري</h2>
            <p className="mt-4 leading-8 text-muted-foreground">
              يمكن أيضًا حساب العمر باستخدام التاريخ الهجري. ولأن السنة الهجرية أقصر من السنة الميلادية، يكون عدد السنوات الهجرية للعمر عادة أكبر قليلًا من عدد السنوات الميلادية لنفس الشخص.
            </p>
            <p className="mt-3 leading-8 text-muted-foreground">
              تستخدم الأداة تقويم أم القرى المتاح في المتصفح للتحويل والحساب العام. وقد يختلف التاريخ الهجري بيوم واحد في بعض البلدان بسبب اختلاف بداية الشهر الهجري والرؤية المحلية.
            </p>
          </article>

          <article className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-2xl font-black">لماذا يختلف العمر الهجري عن العمر الميلادي؟</h2>
            <p className="mt-4 leading-8 text-muted-foreground">
              السنة الميلادية تبلغ نحو 365 يومًا، بينما السنة الهجرية القمرية تبلغ نحو 354 أو 355 يومًا. لذلك تمر السنوات الهجرية بسرعة أكبر. الفرق لا يعني أن أحد العمرين خطأ؛ إنهما يستخدمان تقويمين مختلفين.
            </p>
          </article>

          <article className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-2xl font-black">كم باقي على عيد ميلادي؟</h2>
            <p className="mt-4 leading-8 text-muted-foreground">
              تحدد الحاسبة أقرب تاريخ ميلاد قادم بعد تاريخ الحساب، ثم تحسب عدد الأيام المتبقية إليه. إذا كان عيد ميلاد المستخدم اليوم، تظهر النتيجة بوضوح: عيد ميلادك اليوم.
            </p>
          </article>

          <article className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-2xl font-black">حساب العمر حتى تاريخ معين</h2>
            <p className="mt-4 leading-8 text-muted-foreground">
              لا يلزم أن يكون تاريخ الحساب هو اليوم. يمكن اختيار تاريخ مستقبلي أو تاريخ سابق لمعرفة العمر في ذلك اليوم، مثل تاريخ تقديم طلب، بداية سنة دراسية، أو موعد حدث قادم.
            </p>
          </article>

          <article className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-2xl font-black">أمثلة سريعة</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[680px] border-collapse text-right text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="p-3 font-black">المطلوب</th>
                    <th className="p-3 font-black">مثال</th>
                    <th className="p-3 font-black">النتيجة التي تعرضها الأداة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    ["العمر الحالي", "تاريخ الميلاد إلى اليوم", "سنوات + أشهر + أيام"],
                    ["العمر في تاريخ محدد", "الميلاد إلى تاريخ مختار", "العمر في ذلك اليوم"],
                    ["إجمالي الأيام", "الميلاد إلى تاريخ الحساب", "عدد الأيام الكاملة"],
                    ["إجمالي الأسابيع", "إجمالي الأيام ÷ 7", "أسابيع + أيام متبقية"],
                    ["عيد الميلاد القادم", "أقرب تاريخ ميلاد", "التاريخ + الأيام المتبقية"],
                    ["العمر الهجري", "حسب تقويم أم القرى", "سنوات + أشهر + أيام هجرية"],
                  ].map(([goal, example, output]) => (
                    <tr key={goal}>
                      <td className="p-3 font-bold">{goal}</td>
                      <td className="p-3 text-muted-foreground">{example}</td>
                      <td className="p-3 text-muted-foreground">{output}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>

          <article className="rounded-lg border border-primary/20 bg-primary/5 p-6">
            <h2 className="text-2xl font-black">إجابات مباشرة</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="font-black">كيف أحسب عمري؟</h3>
                <p className="mt-2 leading-8 text-muted-foreground">
                  أدخل تاريخ ميلادك في الحاسبة. يتم حساب الفرق بين تاريخ الميلاد وتاريخ اليوم مع مراعاة أطوال الأشهر والسنوات الكبيسة، ثم يظهر العمر بالسنوات والشهور والأيام.
                </p>
              </div>
              <div>
                <h3 className="font-black">ما الفرق بين العمر الهجري والميلادي؟</h3>
                <p className="mt-2 leading-8 text-muted-foreground">
                  السنة الهجرية أقصر من الميلادية بنحو 10 إلى 11 يومًا، لذلك يكون عدد سنوات العمر الهجري أكبر قليلًا لنفس المدة الزمنية.
                </p>
              </div>
            </div>
          </article>

          <article className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-2xl font-black">أدوات مرتبطة</h2>
            <Link href="/ar/tahweel-altareekh" className="mt-4 inline-flex rounded-lg border border-border px-4 py-3 font-bold text-primary hover:bg-muted">
              تحويل التاريخ الهجري والميلادي
            </Link>
          </article>

          <article className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-2xl font-black">الأسئلة الشائعة حول حساب العمر</h2>
            <div className="mt-5 grid gap-5">
              {faqs.map((faq) => (
                <div key={faq.q}>
                  <h3 className="font-black">{faq.q}</h3>
                  <p className="mt-1 leading-8 text-muted-foreground">{faq.a}</p>
                </div>
              ))}
            </div>
          </article>
        </section>
      </main>
    </Layout>
  );
}
