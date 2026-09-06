import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { addDays, format, isValid, parseISO } from "date-fns";
import { CalendarDays, Copy, RefreshCw, RotateCcw } from "lucide-react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";

const canonical = "https://usonlinetools.com/ar/tahweel-altareekh";
const supportedCalendar = new Intl.DateTimeFormat("en-u-ca-islamic-umalqura").resolvedOptions().calendar;
const usesUmmAlQura = supportedCalendar === "islamic-umalqura";

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

const gregorianMonths = [
  "يناير",
  "فبراير",
  "مارس",
  "أبريل",
  "مايو",
  "يونيو",
  "يوليو",
  "أغسطس",
  "سبتمبر",
  "أكتوبر",
  "نوفمبر",
  "ديسمبر",
];

const faqs = [
  {
    q: "كيف أحول التاريخ من هجري إلى ميلادي؟",
    a: "اختر هجري إلى ميلادي، ثم أدخل اليوم والشهر والسنة الهجرية واضغط تحويل التاريخ. ستظهر النتيجة الميلادية مع يوم الأسبوع والصيغة الرقمية.",
  },
  {
    q: "كيف أحول التاريخ من ميلادي إلى هجري؟",
    a: "اختر ميلادي إلى هجري، أدخل التاريخ الميلادي، ثم حوّل التاريخ. ستظهر النتيجة باليوم والشهر والسنة الهجرية.",
  },
  {
    q: "هل محول التاريخ مجاني؟",
    a: "نعم. الأداة مجانية ولا تحتاج إلى إنشاء حساب.",
  },
  {
    q: "هل يعتمد التحويل على تقويم أم القرى؟",
    a: "نعم، عندما يكون التاريخ داخل النطاق المدعوم وكان المتصفح يوفر تقويم أم القرى عبر JavaScript Intl. تعرض الصفحة تنبيهًا إذا لم يكن هذا الدعم متاحًا.",
  },
  {
    q: "لماذا يختلف التاريخ الهجري في بعض المواقع؟",
    a: "قد تستخدم المواقع أنواعًا مختلفة من التقويم الهجري، كما قد تختلف بداية الشهر حسب الرؤية أو الإعلان الرسمي المحلي. لذلك يمكن أن يظهر اختلاف يوم واحد في بعض الحالات.",
  },
  {
    q: "هل يمكن تحويل تاريخ الميلاد؟",
    a: "نعم. يمكنك تحويل تاريخ الميلاد من الهجري إلى الميلادي أو العكس باستخدام نفس المحول.",
  },
  {
    q: "هل يمكن معرفة يوم الأسبوع من التاريخ؟",
    a: "نعم. تعرض النتيجة اسم يوم الأسبوع الموافق للتاريخ المحول.",
  },
  {
    q: "هل يمكن استخدام النتيجة للوثائق الرسمية؟",
    a: "يمكن استخدام الأداة للمساعدة في التحويل، لكن إذا كان التاريخ جزءًا من معاملة حكومية أو وثيقة رسمية حساسة، استخدم التاريخ المسجل أو المعتمد لدى الجهة الرسمية كمرجع نهائي.",
  },
  {
    q: "كم عدد أيام السنة الهجرية؟",
    a: "السنة الهجرية تكون عادة 354 أو 355 يومًا.",
  },
  {
    q: "كم عدد أيام السنة الميلادية؟",
    a: "السنة الميلادية تكون عادة 365 يومًا، وتصبح 366 يومًا في السنة الكبيسة.",
  },
  {
    q: "هل يمكن أن يختلف التاريخ الهجري بيوم؟",
    a: "نعم. قد يظهر اختلاف يوم واحد بسبب اختلاف منهج التقويم أو ثبوت رؤية الهلال أو الإعلان الرسمي المحلي.",
  },
  {
    q: "هل تحفظ الأداة التواريخ التي أدخلها؟",
    a: "تتم عملية التحويل داخل متصفحك ولا نحتاج إلى حفظ التاريخ الذي تدخله.",
  },
];

type Mode = "g2h" | "h2g";

type HijriDate = {
  day: number;
  month: number;
  year: number;
};

type ConversionResult = {
  mode: Mode;
  gregorianDate: Date;
  hijri: HijriDate;
  weekday: string;
  gregorianText: string;
  hijriText: string;
  gregorianNumeric: string;
  hijriNumeric: string;
};

function toArabicNumber(value: number) {
  return value.toLocaleString("ar-SA");
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function formatGregorianText(date: Date) {
  return new Intl.DateTimeFormat("ar-SA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

function formatWeekday(date: Date) {
  return new Intl.DateTimeFormat("ar-SA", { weekday: "long" }).format(date);
}

function getHijriParts(date: Date): HijriDate | null {
  if (!usesUmmAlQura) {
    return null;
  }

  const parts = new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(date);
  const year = Number(parts.find((part) => part.type === "year")?.value);
  const month = Number(parts.find((part) => part.type === "month")?.value);
  const day = Number(parts.find((part) => part.type === "day")?.value);

  return year && month && day ? { year, month, day } : null;
}

function formatHijriText(hijri: HijriDate) {
  return `${toArabicNumber(hijri.day)} ${hijriMonths[hijri.month - 1]} ${toArabicNumber(hijri.year)} هـ`;
}

function formatGregorianNumeric(date: Date) {
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
}

function formatHijriNumeric(hijri: HijriDate) {
  return `${pad(hijri.day)}/${pad(hijri.month)}/${hijri.year}`;
}

function sameHijriDate(date: Date, hijri: HijriDate) {
  const parts = getHijriParts(date);
  return parts?.year === hijri.year && parts.month === hijri.month && parts.day === hijri.day;
}

function findGregorianFromHijri(hijri: HijriDate) {
  if (!usesUmmAlQura || hijri.year < 1300 || hijri.year > 1600 || hijri.month < 1 || hijri.month > 12 || hijri.day < 1 || hijri.day > 30) {
    return null;
  }

  const anchorDay = Date.UTC(2025, 5, 26) / 86400000;
  const estimatedDay = Math.round(anchorDay + (hijri.year - 1447) * 354.367 + (hijri.month - 1) * 29.53 + (hijri.day - 1));
  const center = new Date(estimatedDay * 86400000);

  for (let offset = -45; offset <= 45; offset += 1) {
    const candidate = new Date(center);
    candidate.setDate(center.getDate() + offset);
    if (sameHijriDate(candidate, hijri)) {
      return candidate;
    }
  }

  return null;
}

function buildResult(mode: Mode, gregorianDate: Date): ConversionResult | null {
  if (!isValid(gregorianDate) || gregorianDate.getFullYear() < 1900 || gregorianDate.getFullYear() > 2077) {
    return null;
  }

  const hijri = getHijriParts(gregorianDate);
  if (!hijri) {
    return null;
  }

  return {
    mode,
    gregorianDate,
    hijri,
    weekday: formatWeekday(gregorianDate),
    gregorianText: `${formatGregorianText(gregorianDate)} م`,
    hijriText: formatHijriText(hijri),
    gregorianNumeric: formatGregorianNumeric(gregorianDate),
    hijriNumeric: formatHijriNumeric(hijri),
  };
}

function parseGregorianInput(value: string) {
  const parsed = parseISO(value);
  return isValid(parsed) ? parsed : null;
}

function isValidPlainGregorian(year: number, month: number, day: number) {
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

function getTodayInput() {
  return format(new Date(), "yyyy-MM-dd");
}

export default function ArabicDateConverter() {
  const [mode, setMode] = useState<Mode>("g2h");
  const [gregorianInput, setGregorianInput] = useState(getTodayInput());
  const [hijriDay, setHijriDay] = useState("1");
  const [hijriMonth, setHijriMonth] = useState("1");
  const [hijriYear, setHijriYear] = useState("1448");
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

  const selectedGregorianDate = useMemo(() => {
    if (mode === "g2h") {
      return parseGregorianInput(gregorianInput);
    }

    return findGregorianFromHijri({
      day: Number(hijriDay),
      month: Number(hijriMonth),
      year: Number(hijriYear),
    });
  }, [gregorianInput, hijriDay, hijriMonth, hijriYear, mode]);

  const result = useMemo(() => {
    if (!selectedGregorianDate) {
      return null;
    }

    return buildResult(mode, selectedGregorianDate);
  }, [mode, selectedGregorianDate]);

  const error = useMemo(() => {
    if (!usesUmmAlQura) {
      return "تقويم أم القرى غير مدعوم في هذا المتصفح، لذلك لا يمكن عرض تحويل موثوق هنا.";
    }

    if (mode === "g2h") {
      const [year, month, day] = gregorianInput.split("-").map(Number);
      if (!year || !month || !day || !isValidPlainGregorian(year, month, day)) {
        return "يرجى إدخال تاريخ صحيح.";
      }
    }

    if (mode === "h2g" && !selectedGregorianDate) {
      return "التاريخ خارج النطاق المدعوم لهذه الحاسبة أو غير صحيح.";
    }

    if (!result) {
      return "هذا التاريخ خارج النطاق الموثوق لتقويم أم القرى المستخدم في الأداة. اختر تاريخًا أقرب أو راجع مصدرًا رسميًا.";
    }

    return "";
  }, [gregorianInput, mode, result, selectedGregorianDate]);

  const nearbyDates = useMemo(() => {
    if (!result) {
      return [];
    }

    return Array.from({ length: 7 }, (_, index) => {
      const offset = index - 3;
      const date = addDays(result.gregorianDate, offset);
      const nearby = buildResult(result.mode, date);
      return nearby ? { offset, ...nearby } : null;
    }).filter(Boolean) as Array<ConversionResult & { offset: number }>;
  }, [result]);

  const copyText = result
    ? [
        mode === "g2h" ? result.hijriText : result.gregorianText,
        `يوافق ${mode === "g2h" ? result.gregorianText : result.hijriText}`,
        `يوم ${result.weekday}`,
        "وفق تقويم أم القرى",
      ].join("\n")
    : "";

  const copyResult = async () => {
    if (!copyText) {
      return;
    }

    await navigator.clipboard.writeText(copyText);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  const swapDirection = () => {
    if (result) {
      setGregorianInput(format(result.gregorianDate, "yyyy-MM-dd"));
      setHijriDay(String(result.hijri.day));
      setHijriMonth(String(result.hijri.month));
      setHijriYear(String(result.hijri.year));
    }
    setMode((current) => (current === "g2h" ? "h2g" : "g2h"));
    setCopied(false);
  };

  const useToday = () => {
    const today = new Date();
    const hijri = getHijriParts(today);
    setGregorianInput(format(today, "yyyy-MM-dd"));
    if (hijri) {
      setHijriDay(String(hijri.day));
      setHijriMonth(String(hijri.month));
      setHijriYear(String(hijri.year));
    }
    setMode("g2h");
    setCopied(false);
  };

  const reset = () => {
    setMode("g2h");
    setGregorianInput(getTodayInput());
    setHijriDay("1");
    setHijriMonth("1");
    setHijriYear("1448");
    setCopied(false);
  };

  const schema = [
    {
      "@type": "WebApplication",
      name: "محول التاريخ الهجري والميلادي",
      url: canonical,
      applicationCategory: "CalculatorApplication",
      operatingSystem: "Any",
      inLanguage: "ar",
      description: "محول تاريخ عربي لتحويل التاريخ من هجري إلى ميلادي ومن ميلادي إلى هجري وفق تقويم أم القرى.",
    },
    {
      "@type": "WebPage",
      name: "تحويل التاريخ الهجري والميلادي",
      url: canonical,
      inLanguage: "ar",
      description: "حوّل التاريخ من هجري إلى ميلادي أو من ميلادي إلى هجري مع يوم الأسبوع والصيغة الرقمية والنصية.",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "الرئيسية", item: "https://usonlinetools.com/" },
        { "@type": "ListItem", position: 2, name: "تحويل التاريخ", item: canonical },
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
        title="تحويل التاريخ الهجري والميلادي – محول أم القرى | US Online Tools"
        description="حوّل التاريخ من هجري إلى ميلادي أو من ميلادي إلى هجري بسهولة، مع يوم الأسبوع والصيغة الرقمية والنصية وفق تقويم أم القرى."
        canonical={canonical}
        schema={schema}
      />
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8" dir="rtl" lang="ar">
        <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/">الرئيسية</Link>
          <span>/</span>
          <span>تحويل التاريخ</span>
        </nav>

        <section className="mb-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-bold text-primary">
            <CalendarDays className="h-4 w-4" />
            حاسبة تحويل التاريخ
          </div>
          <h1 className="mt-4 text-4xl font-black tracking-normal md:text-6xl">تحويل التاريخ الهجري والميلادي</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">
            حوّل أي تاريخ بين التقويم الهجري والميلادي في ثوانٍ. اختر اتجاه التحويل وأدخل اليوم والشهر والسنة لتحصل على التاريخ الموافق، يوم الأسبوع والصيغة الرقمية والنصية.
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="rounded-lg border border-border bg-card p-5 shadow-sm md:p-6">
            <h2 className="text-2xl font-black">حاسبة تحويل التاريخ</h2>
            <div className="mt-5 grid grid-cols-2 gap-2 rounded-lg bg-muted p-1" role="tablist" aria-label="اتجاه التحويل">
              <button type="button" onClick={() => setMode("g2h")} className={`rounded-md px-3 py-3 text-sm font-bold ${mode === "g2h" ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`} role="tab" aria-selected={mode === "g2h"}>
                ميلادي إلى هجري
              </button>
              <button type="button" onClick={() => setMode("h2g")} className={`rounded-md px-3 py-3 text-sm font-bold ${mode === "h2g" ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`} role="tab" aria-selected={mode === "h2g"}>
                هجري إلى ميلادي
              </button>
            </div>

            {mode === "g2h" ? (
              <label className="mt-5 grid gap-2">
                <span className="font-bold">تحويل من ميلادي إلى هجري</span>
                <input
                  type="date"
                  value={gregorianInput}
                  onChange={(event) => setGregorianInput(event.target.value)}
                  className="h-12 rounded-lg border border-border bg-background px-4 text-right focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </label>
            ) : (
              <div className="mt-5">
                <h3 className="font-bold">تحويل من هجري إلى ميلادي</h3>
                <div className="mt-3 grid gap-4 sm:grid-cols-3">
                  <label className="grid gap-2">
                    <span className="font-bold">اليوم الهجري</span>
                    <input type="number" min="1" max="30" value={hijriDay} onChange={(event) => setHijriDay(event.target.value)} className="h-12 rounded-lg border border-border bg-background px-4 text-right focus:outline-none focus:ring-2 focus:ring-primary" />
                  </label>
                  <label className="grid gap-2">
                    <span className="font-bold">الشهر الهجري</span>
                    <select value={hijriMonth} onChange={(event) => setHijriMonth(event.target.value)} className="h-12 rounded-lg border border-border bg-background px-4 text-right focus:outline-none focus:ring-2 focus:ring-primary">
                      {hijriMonths.map((month, index) => (
                        <option key={month} value={index + 1}>
                          {month}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="grid gap-2">
                    <span className="font-bold">السنة الهجرية</span>
                    <input type="number" min="1300" max="1600" value={hijriYear} onChange={(event) => setHijriYear(event.target.value)} className="h-12 rounded-lg border border-border bg-background px-4 text-right focus:outline-none focus:ring-2 focus:ring-primary" />
                  </label>
                </div>
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" onClick={useToday} className="rounded-lg bg-secondary px-4 py-3 text-sm font-bold text-secondary-foreground">
                تاريخ اليوم
              </button>
              <button type="button" onClick={swapDirection} className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-3 text-sm font-bold hover:bg-muted" aria-label="عكس اتجاه التحويل">
                <RefreshCw className="h-4 w-4" />
                عكس التحويل
              </button>
              <button type="button" onClick={reset} className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-3 text-sm font-bold hover:bg-muted">
                <RotateCcw className="h-4 w-4" />
                إعادة
              </button>
            </div>

            <p className="mt-5 rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 text-sm leading-7 text-muted-foreground">
              يعتمد المحول على تقويم أم القرى عند توفره ضمن النطاق المدعوم. وقد تختلف بداية بعض الأشهر الهجرية بيوم واحد في بعض البلدان بسبب الرؤية الشرعية أو الإعلان الرسمي المحلي.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-5 shadow-sm md:p-6" aria-live="polite">
            <h2 className="text-2xl font-black">النتيجة</h2>
            {error ? <p className="mt-5 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm font-bold text-destructive">{error}</p> : null}
            {result ? (
              <div className="mt-5 space-y-4">
                <div className="rounded-lg border border-primary/20 bg-primary/10 p-5">
                  <p className="text-sm font-bold text-primary">{mode === "g2h" ? "التاريخ الهجري الموافق" : "التاريخ الميلادي الموافق"}</p>
                  <p className="mt-2 text-3xl font-black leading-tight text-primary">{mode === "g2h" ? result.hijriText : result.gregorianText}</p>
                  <p className="mt-3 text-sm text-muted-foreground">يوافق {mode === "g2h" ? result.gregorianText : result.hijriText}</p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <ResultCard label="يوم الأسبوع" value={result.weekday} />
                  <ResultCard label="الهجري بالأرقام" value={<bdi>{result.hijriNumeric}</bdi>} />
                  <ResultCard label="الميلادي بالأرقام" value={<bdi>{result.gregorianNumeric}</bdi>} />
                  <ResultCard label="طريقة التقويم" value="أم القرى" />
                </div>

                <div className="rounded-lg bg-muted/40 p-4 text-sm leading-7 text-muted-foreground">
                  <p>اتجاه التحويل: {mode === "g2h" ? "ميلادي إلى هجري" : "هجري إلى ميلادي"}</p>
                  <p>التاريخ المدخل: {mode === "g2h" ? result.gregorianText : result.hijriText}</p>
                  <p>التاريخ الموافق: {mode === "g2h" ? result.hijriText : result.gregorianText}</p>
                  <p>التقويم المستخدم: أم القرى</p>
                </div>

                <button type="button" onClick={copyResult} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-bold text-primary-foreground">
                  <Copy className="h-4 w-4" />
                  {copied ? "تم النسخ" : "نسخ النتيجة"}
                </button>
              </div>
            ) : !error ? (
              <p className="mt-5 rounded-lg bg-muted/40 p-4 text-muted-foreground">أدخل تاريخًا صحيحًا لعرض النتيجة.</p>
            ) : null}
          </div>
        </section>

        {nearbyDates.length ? (
          <section className="mt-8 rounded-lg border border-border bg-card p-6">
            <h2 className="text-2xl font-black">الأيام القريبة من التاريخ</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse text-right text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="p-3 font-black">الفرق</th>
                    <th className="p-3 font-black">التاريخ الهجري</th>
                    <th className="p-3 font-black">التاريخ الميلادي</th>
                    <th className="p-3 font-black">اليوم</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {nearbyDates.map((item) => (
                    <tr key={`${item.gregorianNumeric}-${item.offset}`} className={item.offset === 0 ? "bg-primary/5" : ""}>
                      <td className="p-3 font-bold">{item.offset === 0 ? "اليوم المختار" : item.offset > 0 ? `+${item.offset}` : item.offset}</td>
                      <td className="p-3 text-muted-foreground">{item.hijriText}</td>
                      <td className="p-3 text-muted-foreground"><bdi>{item.gregorianNumeric}</bdi></td>
                      <td className="p-3 text-muted-foreground">{item.weekday}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : null}

        <section className="mt-10 grid gap-6">
          <article className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-2xl font-black">دقة التحويل</h2>
            <p className="mt-4 leading-8 text-muted-foreground">
              يعتمد المحول على تقويم أم القرى عند توفره ضمن النطاق المدعوم. وقد تختلف بداية بعض الأشهر الهجرية بيوم واحد في بعض البلدان بسبب الرؤية الشرعية أو الإعلان الرسمي المحلي.
            </p>
            <p className="mt-3 leading-8 text-muted-foreground">
              تستخدم الأداة تحويلًا محليًا داخل المتصفح ولا تعتمد على طلب خارجي عند كل عملية تحويل. إذا كان التاريخ متعلقًا بمعاملة رسمية حساسة، تحقق من الجهة المعنية.
            </p>
          </article>

          <article className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-2xl font-black">كيف يتم تحويل التاريخ من هجري إلى ميلادي؟</h2>
            <p className="mt-4 leading-8 text-muted-foreground">
              لتحويل التاريخ الهجري إلى الميلادي، اختر هجري إلى ميلادي ثم أدخل اليوم والشهر والسنة الهجرية. تعرض الأداة التاريخ الميلادي الموافق مع اسم يوم الأسبوع والصيغة الرقمية.
            </p>
            <p className="mt-3 leading-8 text-muted-foreground">
              على سبيل المثال، تكون النتيجة بالشكل التالي: 23 ربيع الأول 1448 هـ يوافق 5 سبتمبر 2026 م. تعتمد النتيجة على منهجية التقويم الموضحة في الصفحة، لذلك لا نستخدم قاعدة تقريبية مثل إضافة عدد ثابت من الأيام أو السنوات.
            </p>
          </article>

          <article className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-2xl font-black">كيف يتم تحويل التاريخ من ميلادي إلى هجري؟</h2>
            <p className="mt-4 leading-8 text-muted-foreground">
              اختر ميلادي إلى هجري ثم أدخل التاريخ الميلادي المطلوب. بعد التحويل ستظهر النتيجة باليوم والشهر والسنة الهجرية، مع يوم الأسبوع والصيغة الرقمية لتسهيل النسخ والاستخدام في النماذج أو المستندات.
            </p>
          </article>

          <article className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-2xl font-black">ما هو تقويم أم القرى؟</h2>
            <p className="mt-4 leading-8 text-muted-foreground">
              تقويم أم القرى هو تقويم هجري مستخدم على نطاق واسع في المملكة العربية السعودية. هذه الحاسبة توضح منهجية التقويم المستخدمة بدل عرض نتيجة هجرية بدون تحديد نوع التقويم.
            </p>
          </article>

          <article className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-2xl font-black">لماذا قد يختلف التاريخ الهجري بيوم واحد؟</h2>
            <p className="mt-4 leading-8 text-muted-foreground">
              يعتمد بدء بعض الأشهر الهجرية عمليًا على ثبوت رؤية الهلال أو القرار الرسمي في البلد. لذلك قد تجد أن تاريخًا معينًا يظهر في تقويم حسابي أو في بلد ما مختلفًا بيوم عن إعلان رسمي محلي.
            </p>
          </article>

          <article className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-2xl font-black">ما الفرق بين السنة الهجرية والميلادية؟</h2>
            <p className="mt-4 leading-8 text-muted-foreground">
              التقويم الميلادي تقويم شمسي، بينما التقويم الهجري تقويم قمري. السنة الميلادية تبلغ عادة 365 يومًا، أو 366 يومًا في السنة الكبيسة، أما السنة الهجرية فتبلغ عادة 354 أو 355 يومًا.
            </p>
          </article>

          <article className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-2xl font-black">تحويل تاريخ الميلاد</h2>
            <p className="mt-4 leading-8 text-muted-foreground">
              يمكن استخدام محول التاريخ لمعرفة التاريخ الميلادي الموافق لتاريخ ميلاد مكتوب بالهجري، أو معرفة التاريخ الهجري المقابل لتاريخ ميلاد مكتوب بالميلادي. إذا كنت تريد معرفة العمر بعد تحويل تاريخ ميلادك، استخدم <Link href="/ar/hesab-alomr" className="font-bold text-primary hover:underline">حساب العمر بالهجري والميلادي</Link>.
            </p>
          </article>

          <article className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-2xl font-black">متى تحتاج إلى محول التاريخ؟</h2>
            <ul className="mt-4 grid list-disc gap-2 pr-6 leading-8 text-muted-foreground sm:grid-cols-2">
              <li>تواريخ الميلاد.</li>
              <li>العقود والنماذج.</li>
              <li>السجلات والمواعيد.</li>
              <li>الدراسة والسفر.</li>
              <li>مقارنة تاريخ هجري بتاريخ ميلادي.</li>
              <li>التخطيط للمناسبات.</li>
            </ul>
          </article>

          <article className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-2xl font-black">مرجع سريع</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[620px] border-collapse text-right text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="p-3 font-black">المطلوب</th>
                    <th className="p-3 font-black">اختر</th>
                    <th className="p-3 font-black">النتيجة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    ["هجري إلى ميلادي", "هجري إلى ميلادي", "التاريخ الميلادي الموافق"],
                    ["ميلادي إلى هجري", "ميلادي إلى هجري", "التاريخ الهجري الموافق"],
                    ["معرفة يوم الأسبوع", "أي اتجاه", "السبت، الأحد، إلخ"],
                    ["نسخ التاريخ", "بعد التحويل", "صيغة نصية جاهزة"],
                    ["تاريخ اليوم", "تاريخ اليوم", "تعبئة سريعة للتاريخ الحالي"],
                    ["مقارنة الأيام القريبة", "بعد التحويل", "±3 أيام حول التاريخ"],
                  ].map(([need, choose, output]) => (
                    <tr key={need}>
                      <td className="p-3 font-bold">{need}</td>
                      <td className="p-3 text-muted-foreground">{choose}</td>
                      <td className="p-3 text-muted-foreground">{output}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>

          <article className="rounded-lg border border-primary/20 bg-primary/5 p-6">
            <h2 className="text-2xl font-black">إجابات مباشرة</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <div>
                <h3 className="font-black">كيف أحول التاريخ من هجري إلى ميلادي؟</h3>
                <p className="mt-2 leading-8 text-muted-foreground">اختر وضع هجري إلى ميلادي، أدخل اليوم والشهر والسنة الهجرية، ثم اضغط تحويل التاريخ. ستظهر النتيجة الميلادية مع يوم الأسبوع والصيغة الرقمية.</p>
              </div>
              <div>
                <h3 className="font-black">كيف أحول التاريخ من ميلادي إلى هجري؟</h3>
                <p className="mt-2 leading-8 text-muted-foreground">أدخل التاريخ الميلادي بعد اختيار ميلادي إلى هجري. تعرض الأداة التاريخ الهجري الموافق وفق منهجية التقويم الموضحة في الصفحة.</p>
              </div>
              <div>
                <h3 className="font-black">لماذا قد يختلف التاريخ الهجري بيوم؟</h3>
                <p className="mt-2 leading-8 text-muted-foreground">لأن بعض الجهات تعتمد رؤية الهلال أو قرارات محلية لبداية الشهر، بينما تستخدم أدوات التحويل تقاويم حسابية محددة مثل أم القرى.</p>
              </div>
            </div>
          </article>

          <article className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-2xl font-black">الأسئلة الشائعة</h2>
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

function ResultCard({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-background p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-xl font-black leading-8 text-foreground">{value}</p>
    </div>
  );
}
