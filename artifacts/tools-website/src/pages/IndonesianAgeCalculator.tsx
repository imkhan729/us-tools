import { type ReactNode, useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { CalendarDays, Copy, RotateCcw } from "lucide-react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";

const canonical = "https://usonlinetools.com/kalkulator-umur";

const faqs = [
  {
    q: "Bagaimana cara menghitung umur dari tanggal lahir?",
    a: "Masukkan tanggal lahir ke kalkulator. Alat akan menghitung selisih kalender antara tanggal lahir dan tanggal hari ini dalam tahun, bulan, dan hari.",
  },
  {
    q: "Bagaimana cara mengetahui umur saya sekarang?",
    a: "Pilih Umur sekarang, masukkan tanggal lahir, lalu tekan Hitung Umur. Hasil akan menampilkan umur lengkap dan statistik tanggal tambahan.",
  },
  {
    q: "Apakah kalkulator menampilkan umur dalam tahun, bulan, dan hari?",
    a: "Ya. Hasil utama ditampilkan dalam format tahun, bulan, dan hari.",
  },
  {
    q: "Bisakah menghitung umur pada tanggal tertentu?",
    a: "Bisa. Pilih mode Umur pada tanggal tertentu, lalu masukkan tanggal target yang ingin digunakan.",
  },
  {
    q: "Bisakah menghitung total hari sejak lahir?",
    a: "Bisa. Kalkulator menampilkan jumlah hari kalender dari tanggal lahir sampai tanggal hitung.",
  },
  {
    q: "Bagaimana cara menghitung umur dalam minggu?",
    a: "Total hari dibagi 7. Kalkulator menampilkan jumlah minggu penuh dan sisa harinya.",
  },
  {
    q: "Apakah kalkulator memperhitungkan tahun kabisat?",
    a: "Ya. Perhitungan kalender mempertimbangkan Februari 29 hari pada tahun kabisat.",
  },
  {
    q: "Bagaimana jika saya lahir 29 Februari?",
    a: "Umur tetap dihitung berdasarkan tanggal kalender sebenarnya. Untuk ulang tahun pada tahun non-kabisat, alat menggunakan 28 Februari sebagai konvensi tampilan; aturan resmi dapat berbeda sesuai keperluan.",
  },
  {
    q: "Bisakah mengetahui hari apa saya lahir?",
    a: "Ya. Kalkulator dapat menampilkan nama hari dalam minggu berdasarkan tanggal lahir.",
  },
  {
    q: "Bisakah mengetahui berapa hari lagi menuju ulang tahun?",
    a: "Ya. Hasil menampilkan tanggal ulang tahun berikutnya dan jumlah hari yang tersisa.",
  },
  {
    q: "Apakah kalkulator ini menggunakan kalender Hijriah?",
    a: "Tidak. Tool ini menggunakan kalender Masehi atau Gregorian.",
  },
  {
    q: "Apakah saya perlu membuat akun?",
    a: "Tidak. Kalkulator dapat digunakan tanpa pendaftaran.",
  },
  {
    q: "Apakah tanggal lahir saya disimpan?",
    a: "Tidak. Perhitungan dilakukan di browser dan tanggal lahir yang Anda masukkan tidak perlu dikirim atau disimpan di server.",
  },
  {
    q: "Apakah hasil bisa digunakan untuk menentukan kelayakan persyaratan resmi?",
    a: "Kalkulator menghitung usia berdasarkan tanggal yang Anda masukkan. Untuk menentukan kelayakan program, pendaftaran, atau dokumen resmi, selalu ikuti ketentuan dari instansi terkait.",
  },
];

type Mode = "current" | "target";

type PlainDate = {
  year: number;
  month: number;
  day: number;
};

type AgeResult = {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalMonths: number;
  fullWeeks: number;
  weekDays: number;
  birthWeekday: string;
  targetWeekday: string;
  nextBirthday: PlainDate;
  nextBirthdayWeekday: string;
  daysToBirthday: number;
  nextAge: number;
  isBirthdayToday: boolean;
  usesLeapDayConvention: boolean;
};

function parsePlainDate(value: string): PlainDate | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) {
    return null;
  }

  const date = {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
  };

  return isValidPlainDate(date) ? date : null;
}

function todayPlainDate() {
  const now = new Date();
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
  };
}

function toInputValue(date: PlainDate) {
  return `${date.year}-${String(date.month).padStart(2, "0")}-${String(date.day).padStart(2, "0")}`;
}

function toLocalDate(date: PlainDate) {
  return new Date(date.year, date.month - 1, date.day);
}

function isLeapYear(year: number) {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

function isValidPlainDate(date: PlainDate) {
  return date.year > 0 && date.month >= 1 && date.month <= 12 && date.day >= 1 && date.day <= daysInMonth(date.year, date.month);
}

function comparePlainDate(a: PlainDate, b: PlainDate) {
  if (a.year !== b.year) return a.year - b.year;
  if (a.month !== b.month) return a.month - b.month;
  return a.day - b.day;
}

function addYearsPlain(date: PlainDate, years: number) {
  const year = date.year + years;
  return {
    year,
    month: date.month,
    day: Math.min(date.day, daysInMonth(year, date.month)),
  };
}

function addMonthsPlain(date: PlainDate, months: number) {
  const zeroBasedMonth = date.month - 1 + months;
  const year = date.year + Math.floor(zeroBasedMonth / 12);
  const month = ((zeroBasedMonth % 12) + 12) % 12 + 1;
  return {
    year,
    month,
    day: Math.min(date.day, daysInMonth(year, month)),
  };
}

function differenceInCalendarDays(start: PlainDate, end: PlainDate) {
  const startUtc = Date.UTC(start.year, start.month - 1, start.day);
  const endUtc = Date.UTC(end.year, end.month - 1, end.day);
  return Math.round((endUtc - startUtc) / 86400000);
}

function completeMonthsBetween(start: PlainDate, end: PlainDate) {
  let months = (end.year - start.year) * 12 + (end.month - start.month);
  if (addMonthsPlain(start, months).day > end.day && comparePlainDate(addMonthsPlain(start, months), end) > 0) {
    months -= 1;
  }
  while (comparePlainDate(addMonthsPlain(start, months), end) > 0) {
    months -= 1;
  }
  return Math.max(0, months);
}

function calendarAge(birth: PlainDate, target: PlainDate) {
  let years = target.year - birth.year;
  while (comparePlainDate(addYearsPlain(birth, years), target) > 0) {
    years -= 1;
  }

  const afterYears = addYearsPlain(birth, years);
  let months = (target.year - afterYears.year) * 12 + (target.month - afterYears.month);
  while (comparePlainDate(addMonthsPlain(afterYears, months), target) > 0) {
    months -= 1;
  }

  const afterMonths = addMonthsPlain(afterYears, months);
  const days = differenceInCalendarDays(afterMonths, target);

  return { years, months, days };
}

function birthdayForYear(birth: PlainDate, year: number) {
  const usesLeapDayConvention = birth.month === 2 && birth.day === 29 && !isLeapYear(year);
  return {
    date: {
      year,
      month: birth.month,
      day: usesLeapDayConvention ? 28 : birth.day,
    },
    usesLeapDayConvention,
  };
}

function nextBirthdayFrom(birth: PlainDate, target: PlainDate) {
  const thisYear = birthdayForYear(birth, target.year);
  if (comparePlainDate(thisYear.date, target) >= 0) {
    return thisYear;
  }
  return birthdayForYear(birth, target.year + 1);
}

function formatDateId(date: PlainDate) {
  return new Intl.DateTimeFormat("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(toLocalDate(date));
}

function formatWeekday(date: PlainDate) {
  return new Intl.DateTimeFormat("id-ID", { weekday: "long" }).format(toLocalDate(date));
}

function formatNumber(value: number) {
  return value.toLocaleString("id-ID");
}

function calculateAge(birth: PlainDate, target: PlainDate): AgeResult | null {
  if (comparePlainDate(birth, target) > 0) {
    return null;
  }

  const age = calendarAge(birth, target);
  const totalDays = differenceInCalendarDays(birth, target);
  const birthday = nextBirthdayFrom(birth, target);
  const daysToBirthday = differenceInCalendarDays(target, birthday.date);

  return {
    ...age,
    totalDays,
    totalMonths: completeMonthsBetween(birth, target),
    fullWeeks: Math.floor(totalDays / 7),
    weekDays: totalDays % 7,
    birthWeekday: formatWeekday(birth),
    targetWeekday: formatWeekday(target),
    nextBirthday: birthday.date,
    nextBirthdayWeekday: formatWeekday(birthday.date),
    daysToBirthday,
    nextAge: birthday.date.year - birth.year,
    isBirthdayToday: daysToBirthday === 0,
    usesLeapDayConvention: birthday.usesLeapDayConvention,
  };
}

function ResultCard({ label, value, note }: { label: string; value: ReactNode; note?: string }) {
  return (
    <div className="rounded-lg border border-border bg-background p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-black leading-8 text-foreground">{value}</p>
      {note ? <p className="mt-1 text-xs text-muted-foreground">{note}</p> : null}
    </div>
  );
}

export default function IndonesianAgeCalculator() {
  const today = todayPlainDate();
  const todayInput = toInputValue(today);
  const [mode, setMode] = useState<Mode>("current");
  const [birthInput, setBirthInput] = useState("");
  const [targetInput, setTargetInput] = useState(todayInput);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const element = document.documentElement;
    const previousLang = element.lang;
    const previousDir = element.dir;
    element.lang = "id";
    element.dir = "ltr";

    return () => {
      element.lang = previousLang;
      element.dir = previousDir;
    };
  }, []);

  const birthDate = useMemo(() => parsePlainDate(birthInput), [birthInput]);
  const targetDate = useMemo(() => (mode === "current" ? today : parsePlainDate(targetInput)), [mode, targetInput, today.day, today.month, today.year]);
  const result = useMemo(() => (birthDate && targetDate ? calculateAge(birthDate, targetDate) : null), [birthDate, targetDate]);

  const error = useMemo(() => {
    if (!birthInput) {
      return "";
    }
    if (!birthDate || !targetDate) {
      return "Masukkan tanggal yang valid.";
    }
    if (!result) {
      return mode === "target" ? "Tanggal perhitungan harus sama dengan atau setelah tanggal lahir." : "Tanggal lahir tidak boleh setelah tanggal perhitungan.";
    }
    return "";
  }, [birthDate, birthInput, mode, result, targetDate]);

  const resultText =
    result && birthDate && targetDate
      ? [
          "Perhitungan umur",
          `Tanggal lahir: ${formatDateId(birthDate)}`,
          `Tanggal hitung: ${formatDateId(targetDate)}`,
          `Umur: ${result.years} tahun ${result.months} bulan ${result.days} hari`,
          `Total bulan penuh: ${result.totalMonths} bulan`,
          `Total minggu: ${result.fullWeeks} minggu ${result.weekDays} hari`,
          `Total hari: ${result.totalDays} hari`,
          `Hari lahir: ${result.birthWeekday}`,
          `Ulang tahun berikutnya: ${formatDateId(result.nextBirthday)}`,
          `Sisa menuju ulang tahun: ${result.daysToBirthday} hari`,
        ].join("\n")
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
    setMode("current");
    setBirthInput("");
    setTargetInput(todayInput);
    setCopied(false);
  };

  const schema = [
    {
      "@type": "WebApplication",
      name: "Kalkulator Umur",
      url: canonical,
      applicationCategory: "CalculatorApplication",
      operatingSystem: "Any",
      inLanguage: "id",
      description: "Kalkulator umur online untuk menghitung usia dari tanggal lahir dalam tahun, bulan, hari, total minggu, dan total hari.",
    },
    {
      "@type": "WebPage",
      name: "Kalkulator Umur",
      url: canonical,
      inLanguage: "id",
      description: "Hitung umur dari tanggal lahir secara otomatis dalam tahun, bulan, hari, total minggu dan hari.",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Beranda", item: "https://usonlinetools.com/" },
        { "@type": "ListItem", position: 2, name: "Kalkulator Umur", item: canonical },
      ],
    },
    {
      "@type": "FAQPage",
      inLanguage: "id",
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
        title="Kalkulator Umur – Hitung Usia Tahun, Bulan & Hari | US Online Tools"
        description="Hitung umur dari tanggal lahir secara otomatis dalam tahun, bulan, hari, total minggu dan hari. Cek juga umur pada tanggal tertentu dan ulang tahun berikutnya."
        canonical={canonical}
        ogLocale="id_ID"
        schema={schema}
      />
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8" lang="id">
        <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/">Beranda</Link>
          <span>/</span>
          <span>Kalkulator Umur</span>
        </nav>

        <section className="mb-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-bold text-primary">
            <CalendarDays className="h-4 w-4" />
            Hitung Umur dari Tanggal Lahir
          </div>
          <h1 className="mt-4 text-4xl font-black tracking-normal md:text-6xl">Kalkulator Umur</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">
            Masukkan tanggal lahir untuk menghitung umur dalam tahun, bulan, dan hari. Anda juga dapat melihat total hari, minggu, hari lahir, serta berapa lama lagi menuju ulang tahun berikutnya.
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-lg border border-border bg-card p-5 shadow-sm md:p-6">
            <h2 className="text-2xl font-black">Hitung Umur dari Tanggal Lahir</h2>
            <div className="mt-5 grid gap-2 rounded-lg bg-muted p-1 sm:grid-cols-2" role="tablist" aria-label="Mode kalkulator umur">
              <button type="button" onClick={() => setMode("current")} className={`rounded-md px-4 py-3 text-sm font-bold ${mode === "current" ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`} role="tab" aria-selected={mode === "current"}>
                Umur sekarang
              </button>
              <button type="button" onClick={() => setMode("target")} className={`rounded-md px-4 py-3 text-sm font-bold ${mode === "target" ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`} role="tab" aria-selected={mode === "target"}>
                Umur pada tanggal tertentu
              </button>
            </div>

            <div className="mt-5 grid gap-4">
              <label className="grid gap-2">
                <span className="font-bold">Tanggal lahir</span>
                <input
                  type="date"
                  value={birthInput}
                  onChange={(event) => setBirthInput(event.target.value)}
                  className="h-12 rounded-lg border border-border bg-background px-4 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <span className="text-sm text-muted-foreground">Pilih tanggal lahir Anda.</span>
              </label>

              {mode === "target" ? (
                <label className="grid gap-2">
                  <span className="font-bold">Hitung umur pada tanggal</span>
                  <input
                    type="date"
                    value={targetInput}
                    onChange={(event) => setTargetInput(event.target.value)}
                    className="h-12 rounded-lg border border-border bg-background px-4 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <span className="text-sm text-muted-foreground">Pilih tanggal yang ingin digunakan sebagai batas perhitungan.</span>
                </label>
              ) : null}
            </div>

            {error ? <p className="mt-5 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm font-bold text-destructive">{error}</p> : null}

            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" onClick={copyResult} disabled={!result} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-bold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50">
                <Copy className="h-4 w-4" />
                {copied ? "Tersalin" : "Salin Hasil"}
              </button>
              <button type="button" onClick={reset} className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-3 text-sm font-bold hover:bg-muted">
                <RotateCcw className="h-4 w-4" />
                Reset
              </button>
            </div>

            <p className="mt-5 rounded-lg bg-muted/40 p-4 text-sm leading-7 text-muted-foreground">
              Kalkulator menggunakan perhitungan kalender Gregorian antara tanggal lahir dan tanggal hitung. Perhitungan dilakukan langsung di browser Anda.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-5 shadow-sm md:p-6" aria-live="polite">
            <h2 className="text-2xl font-black">Umur Anda</h2>
            {result && birthDate && targetDate ? (
              <div className="mt-5 space-y-4">
                <div className="rounded-lg border border-primary/20 bg-primary/10 p-5">
                  <p className="text-sm font-bold text-primary">Umur</p>
                  <p className="mt-2 text-3xl font-black leading-tight text-primary">
                    {formatNumber(result.years)} tahun {formatNumber(result.months)} bulan {formatNumber(result.days)} hari
                  </p>
                  <p className="mt-3 text-sm text-muted-foreground">
                    {mode === "current"
                      ? `Berdasarkan tanggal lahir yang Anda masukkan, umur Anda saat ini adalah ${result.years} tahun ${result.months} bulan ${result.days} hari.`
                      : `Berdasarkan tanggal lahir ${formatDateId(birthDate)} dan tanggal hitung ${formatDateId(targetDate)}, umur Anda adalah ${result.years} tahun ${result.months} bulan ${result.days} hari.`}
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <ResultCard label="Total bulan penuh" value={`${formatNumber(result.totalMonths)} bulan`} />
                  <ResultCard label="Total minggu" value={`${formatNumber(result.fullWeeks)} minggu ${formatNumber(result.weekDays)} hari`} />
                  <ResultCard label="Total hari" value={`${formatNumber(result.totalDays)} hari`} />
                  <ResultCard label="Hari lahir" value={result.birthWeekday} />
                  <ResultCard label="Ulang tahun berikutnya" value={result.isBirthdayToday ? "Selamat ulang tahun! Hari ini adalah ulang tahun Anda." : formatDateId(result.nextBirthday)} note={result.nextBirthdayWeekday} />
                  <ResultCard label="Sisa hari menuju ulang tahun" value={result.isBirthdayToday ? "Hari ini" : `${formatNumber(result.daysToBirthday)} hari`} note={`Usia berikutnya: ${formatNumber(result.nextAge)} tahun`} />
                  {mode === "target" ? <ResultCard label="Hari pada tanggal hitung" value={result.targetWeekday} /> : null}
                </div>

                {result.usesLeapDayConvention ? (
                  <p className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 text-sm leading-7 text-muted-foreground">
                    Untuk tanggal lahir 29 Februari, hitung mundur ulang tahun pada tahun non-kabisat menggunakan 28 Februari sebagai konvensi tampilan. Ketentuan resmi dapat berbeda menurut keperluan atau instansi.
                  </p>
                ) : null}
              </div>
            ) : !error ? (
              <p className="mt-5 rounded-lg bg-muted/40 p-4 text-muted-foreground">Masukkan tanggal lahir untuk melihat hasil.</p>
            ) : null}
          </div>
        </section>

        <section className="mt-10 grid min-w-0 gap-6 [&>article]:min-w-0">
          <article className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-2xl font-black">Bagaimana kalkulator ini menghitung umur?</h2>
            <p className="mt-4 leading-8 text-muted-foreground">
              Kalkulator menggunakan perhitungan kalender Gregorian antara tanggal lahir dan tanggal hitung. Hasil utama ditampilkan sebagai jumlah tahun kalender penuh, bulan kalender penuh, dan sisa hari. Perhitungan juga mempertimbangkan panjang bulan yang berbeda dan tahun kabisat.
            </p>
            <p className="mt-3 leading-8 text-muted-foreground">
              Perhitungan dilakukan langsung di browser Anda. Tanggal lahir tidak perlu dikirim ke server untuk mendapatkan hasil.
            </p>
          </article>

          <article className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-6">
            <h2 className="text-2xl font-black">Catatan</h2>
            <p className="mt-4 leading-8 text-muted-foreground">
              Kalkulator ini menghitung usia berdasarkan tanggal kalender yang Anda masukkan. Jika usia digunakan untuk persyaratan resmi, kelayakan tetap mengikuti definisi, tanggal batas, dan aturan instansi yang bersangkutan.
            </p>
          </article>

          <article className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-2xl font-black">Apa itu kalkulator umur?</h2>
            <p className="mt-4 leading-8 text-muted-foreground">
              Kalkulator umur adalah alat untuk menghitung selisih antara tanggal lahir dan tanggal tertentu dalam bentuk tahun, bulan, dan hari. Berbeda dengan cara sederhana tahun sekarang dikurangi tahun lahir, perhitungan kalender yang tepat juga mempertimbangkan apakah ulang tahun tahun ini sudah lewat, jumlah hari pada setiap bulan, Februari, tahun kabisat, dan tanggal target yang dipilih.
            </p>
          </article>

          <article className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-2xl font-black">Cara menghitung umur dari tanggal lahir</h2>
            <p className="mt-4 leading-8 text-muted-foreground">
              Cara paling mudah adalah memasukkan tanggal lahir ke kalkulator. Secara konsep, umur dihitung dengan mencari selisih kalender antara tanggal lahir dan tanggal hitung. Contoh: tanggal lahir 15 Maret 2000 dan tanggal hitung 23 Agustus 2026 menghasilkan 26 tahun 5 bulan 8 hari.
            </p>
          </article>

          <article className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-2xl font-black">Mengapa tidak cukup mengurangi tahun sekarang dengan tahun lahir?</h2>
            <p className="mt-4 leading-8 text-muted-foreground">
              Misalnya seseorang lahir pada 20 Desember 2000 dan tanggal sekarang masih 1 September 2026. Perhitungan 2026 − 2000 = 26 belum tentu berarti orang tersebut sudah berumur 26 tahun, karena ulang tahun ke-26 belum tiba. Itulah sebabnya tanggal, bulan, dan tahun harus dihitung bersama.
            </p>
          </article>

          <article className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-2xl font-black">Cara menghitung umur dalam tahun, bulan, dan hari</h2>
            <p className="mt-4 leading-8 text-muted-foreground">
              Hasil umur yang lengkap biasanya ditulis seperti 24 tahun 7 bulan 13 hari. Artinya 24 tahun kalender penuh sudah berlalu, ditambah 7 bulan penuh, ditambah 13 hari. Kalkulator menggunakan panjang bulan sebenarnya, bukan menganggap semua bulan berisi 30 hari.
            </p>
          </article>

          <article className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-2xl font-black">Cara menghitung umur pada tanggal tertentu</h2>
            <p className="mt-4 leading-8 text-muted-foreground">
              Kadang usia perlu diketahui bukan untuk hari ini, tetapi untuk tanggal tertentu, seperti tanggal penutupan pendaftaran, hari pertama sekolah, tanggal perjalanan, tanggal kontrak, atau tanggal acara. Pilih mode Umur pada tanggal tertentu, masukkan tanggal lahir dan tanggal target, lalu kalkulator akan menghitung umur tepat pada tanggal tersebut.
            </p>
          </article>

          <article className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-2xl font-black">Cara menghitung total hari sejak lahir</h2>
            <p className="mt-4 leading-8 text-muted-foreground">
              Total hari adalah jumlah hari kalender antara tanggal lahir dan tanggal hitung. Nilai ini memperhitungkan bulan 28 hari, 29 hari, 30 hari, 31 hari, dan tahun kabisat. Karena itu, total hari sebaiknya dihitung dari tanggal sebenarnya, bukan dengan mengalikan umur dengan 365.
            </p>
          </article>

          <article className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-2xl font-black">Cara menghitung umur dalam minggu</h2>
            <p className="mt-4 leading-8 text-muted-foreground">
              Setelah total hari diketahui, total minggu penuh adalah total hari dibagi 7, sedangkan sisa hari adalah total hari mod 7. Jika total usia adalah 1.000 hari, hasilnya 142 minggu penuh dan sisa 6 hari.
            </p>
          </article>

          <article className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-2xl font-black">Apa itu tahun kabisat?</h2>
            <p className="mt-4 leading-8 text-muted-foreground">
              Tahun kabisat memiliki 366 hari karena Februari memiliki 29 hari. Dalam kalender Gregorian, tahun yang habis dibagi 4 biasanya tahun kabisat, tahun yang habis dibagi 100 bukan tahun kabisat, kecuali juga habis dibagi 400. Contoh: 2024 dan 2000 adalah tahun kabisat, sedangkan 1900 bukan.
            </p>
          </article>

          <article className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-2xl font-black">Bagaimana jika lahir 29 Februari?</h2>
            <p className="mt-4 leading-8 text-muted-foreground">
              Tanggal 29 Februari hanya muncul pada tahun kabisat. Perhitungan umur tetap menggunakan tanggal kalender sebenarnya. Untuk hitung mundur ulang tahun pada tahun non-kabisat, alat ini menggunakan 28 Februari sebagai konvensi tampilan. Jika tanggal tersebut digunakan untuk keperluan hukum atau administrasi, ikuti aturan instansi yang bersangkutan.
            </p>
          </article>

          <article className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-2xl font-black">Cara mengetahui hari lahir dan ulang tahun berikutnya</h2>
            <p className="mt-4 leading-8 text-muted-foreground">
              Dari tanggal lahir, kalkulator menentukan hari dalam minggu dan mencari tanggal ulang tahun berikutnya setelah tanggal hitung. Hasil dapat menampilkan tanggal ulang tahun berikutnya, hari dalam minggu, sisa hari, dan usia yang akan dicapai.
            </p>
          </article>

          <article className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-2xl font-black">Contoh kebutuhan umum</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[620px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="p-3 font-black">Kebutuhan</th>
                    <th className="p-3 font-black">Input</th>
                    <th className="p-3 font-black">Hasil</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    ["Umur sekarang", "Tanggal lahir", "Tahun + bulan + hari"],
                    ["Umur pada tanggal tertentu", "Tanggal lahir + tanggal target", "Umur pada tanggal tersebut"],
                    ["Total hari", "Tanggal lahir + tanggal hitung", "Jumlah hari kalender"],
                    ["Total minggu", "Total hari", "Minggu penuh + sisa hari"],
                    ["Hari lahir", "Tanggal lahir", "Nama hari"],
                    ["Ulang tahun berikutnya", "Tanggal lahir", "Tanggal + sisa hari"],
                  ].map(([need, input, output]) => (
                    <tr key={need}>
                      <td className="p-3 font-bold">{need}</td>
                      <td className="p-3 text-muted-foreground">{input}</td>
                      <td className="p-3 text-muted-foreground">{output}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>

          <article className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-2xl font-black">Alat terkait</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href="/ar/hesab-alomr" className="inline-flex rounded-lg border border-border px-4 py-3 font-bold text-primary hover:bg-muted">
                Kalkulator umur Hijriah
              </Link>
              <Link href="/ar/tahweel-altareekh" className="inline-flex rounded-lg border border-border px-4 py-3 font-bold text-primary hover:bg-muted">
                Konverter tanggal Hijriah dan Masehi
              </Link>
              <Link href="/category/time-date" className="inline-flex rounded-lg border border-border px-4 py-3 font-bold text-primary hover:bg-muted">
                Alat waktu dan tanggal
              </Link>
            </div>
          </article>

          <article className="rounded-lg border border-primary/20 bg-primary/5 p-6">
            <h2 className="text-2xl font-black">Jawaban langsung</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <div>
                <h3 className="font-black">Bagaimana cara menghitung umur?</h3>
                <p className="mt-2 leading-8 text-muted-foreground">Umur dihitung dari selisih kalender antara tanggal lahir dan tanggal hitung. Agar tepat, perhitungan harus mempertimbangkan tahun, bulan, jumlah hari setiap bulan, dan tahun kabisat.</p>
              </div>
              <div>
                <h3 className="font-black">Bagaimana cara menghitung umur pada tanggal tertentu?</h3>
                <p className="mt-2 leading-8 text-muted-foreground">Masukkan tanggal lahir dan tanggal target. Kalkulator akan menampilkan umur tepat pada tanggal tersebut dalam tahun, bulan, dan hari.</p>
              </div>
              <div>
                <h3 className="font-black">Bagaimana cara menghitung total hari sejak lahir?</h3>
                <p className="mt-2 leading-8 text-muted-foreground">Hitung jumlah hari kalender antara tanggal lahir dan tanggal hitung. Jangan hanya mengalikan umur dalam tahun dengan 365 karena ada tahun kabisat dan panjang bulan yang berbeda.</p>
              </div>
            </div>
          </article>

          <article className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-2xl font-black">Pertanyaan yang sering diajukan</h2>
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
