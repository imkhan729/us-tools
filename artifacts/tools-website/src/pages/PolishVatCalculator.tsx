import { type ReactNode, useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { Calculator, Copy, RotateCcw } from "lucide-react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { polandVatData } from "@/data/taxData/poland/vat";

const canonical = "https://usonlinetools.com/kalkulator-vat";

type Mode = "netToGross" | "grossToNet" | "vatToBase";
type RateChoice = "23" | "8" | "5" | "0" | "exempt" | "custom";

type VatResult = {
  net: number;
  vat: number;
  gross: number;
  rate: number | null;
  rateLabel: string;
  formula: string[];
  summary: string;
  modeLabel: string;
  isExempt?: boolean;
};

const faqs = [
  { q: "Jak obliczyć VAT od kwoty netto?", a: "Pomnóż netto przez stawkę VAT. Dla 1 000 zł i 23% podatek wynosi 230 zł." },
  { q: "Jak obliczyć brutto z netto?", a: "Pomnóż netto przez 1 + stawka/100. Przy 23% użyj mnożnika 1,23." },
  { q: "Jak obliczyć netto z brutto?", a: "Podziel brutto przez 1 + stawka/100. Dla 23% dziel przez 1,23." },
  { q: "Jak obliczyć VAT z kwoty brutto?", a: "Najpierw oblicz netto albo użyj wzoru Brutto × stawka / (100 + stawka)." },
  { q: "Czy z kwoty brutto mogę po prostu odjąć 23%?", a: "Nie. 23% jest liczone od netto, więc kwotę netto z brutto należy wyliczyć przez dzielenie przez 1,23." },
  { q: "1 000 zł netto ile to brutto przy VAT 23%?", a: "1 230 zł brutto." },
  { q: "1 230 zł brutto ile to netto przy VAT 23%?", a: "1 000 zł netto, a VAT wynosi 230 zł." },
  { q: "Jakie są główne stawki VAT w Polsce?", a: "Obecnie podstawowa stawka to 23%, a główne stawki obniżone to 8% i 5%. W określonych przypadkach stosuje się 0% albo zwolnienie." },
  { q: "Czym różni się 0% od ZW?", a: "0% jest stawką VAT, natomiast ZW oznacza zwolnienie z podatku. Skutki podatkowe nie są takie same." },
  { q: "Czy kalkulator ustali właściwą stawkę VAT dla produktu?", a: "Nie. Narzędzie liczy na podstawie wybranej stawki. Klasyfikację należy sprawdzić w aktualnych przepisach lub oficjalnych źródłach." },
  { q: "Czy mogę wpisać własną stawkę?", a: "Tak. Wybierz Inna i podaj procent." },
  { q: "Czy stawka VAT może być czasowo zmieniona?", a: "Tak. Przepisy mogą wprowadzać czasowe preferencje dla określonych towarów lub okresów. Historyczne transakcje należy sprawdzać według daty." },
  { q: "Dlaczego wynik może różnić się o 1 grosz od faktury?", a: "Systemy fakturowe mogą zaokrąglać wartości dla poszczególnych pozycji i sum dokumentu w różnej kolejności." },
  { q: "Czy wynik ma wartość prawną?", a: "Nie. Kalkulator wykonuje obliczenie matematyczne. Poprawność stawki i sposób rozliczenia zależą od przepisów i konkretnej transakcji." },
  { q: "Czy kalkulator jest darmowy?", a: "Tak." },
  { q: "Czy wpisane kwoty są zapisywane?", a: "Nie. Obliczenia są wykonywane w przeglądarce i podane kwoty nie muszą być wysyłane na serwer." },
];

function parsePolishNumber(value: string) {
  const cleaned = value.trim().replace(/[złPLNpln]/g, "").replace(/\s/g, "");
  if (!cleaned) return NaN;
  if (!/^\d+([,.]\d+)?$|^\d{1,3}(\.\d{3})+(,\d+)?$/.test(cleaned)) return NaN;
  if (cleaned.includes(",")) return Number(cleaned.replace(/\./g, "").replace(",", "."));
  return Number(cleaned);
}

function formatMoney(value: number) {
  return `${value.toLocaleString("pl-PL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} zł`;
}

function formatPlain(value: number) {
  return value.toLocaleString("pl-PL", { maximumFractionDigits: 6 });
}

function getRate(choice: RateChoice, customRate: string) {
  if (choice === "exempt") return { rate: null, label: "ZW", error: "" };
  if (choice === "custom") {
    const parsed = parsePolishNumber(customRate);
    if (!Number.isFinite(parsed) || parsed < 0 || parsed > 100) {
      return { rate: NaN, label: "Inna", error: "Wpisz prawidłową stawkę VAT od 0% do 100%." };
    }
    return { rate: parsed, label: `${formatPlain(parsed)}%`, error: "" };
  }
  return { rate: Number(choice), label: `${choice}%`, error: "" };
}

function calculateVat(mode: Mode, amount: number, rate: number | null, rateLabel: string): VatResult | null {
  if (!Number.isFinite(amount) || amount < 0 || !Number.isFinite(rate ?? 0)) return null;

  if (rate === null) {
    if (mode === "vatToBase") {
      return {
        net: 0,
        vat: amount,
        gross: 0,
        rate,
        rateLabel,
        isExempt: true,
        modeLabel: "VAT → Netto i Brutto",
        summary: "Przy ZW nie nalicza się kwoty VAT, więc nie da się wyliczyć podstawy z samego podatku.",
        formula: ["ZW oznacza zwolnienie z VAT, a nie stawkę 0%."],
      };
    }
    return {
      net: amount,
      vat: 0,
      gross: amount,
      rate,
      rateLabel,
      isExempt: true,
      modeLabel: mode === "netToGross" ? "Netto → Brutto" : "Brutto → Netto",
      summary: `${formatMoney(amount)} przy oznaczeniu ZW nie zawiera naliczonej kwoty VAT.`,
      formula: ["ZW: kwota VAT nie jest naliczana.", `Kwota do zapłaty: ${formatMoney(amount)}.`],
    };
  }

  if (rate < 0 || rate > 100) return null;

  if (mode === "vatToBase") {
    if (rate <= 0) {
      return {
        net: 0,
        vat: amount,
        gross: 0,
        rate,
        rateLabel,
        modeLabel: "VAT → Netto i Brutto",
        summary: "Przy stawce 0% sama kwota VAT równa 0 nie pozwala ustalić kwoty netto.",
        formula: ["Wybierz tryb Netto → Brutto lub Brutto → Netto."],
      };
    }
    const net = amount * 100 / rate;
    return {
      net,
      vat: amount,
      gross: net + amount,
      rate,
      rateLabel,
      modeLabel: "VAT → Netto i Brutto",
      summary: `${formatMoney(amount)} VAT przy stawce ${rateLabel} oznacza ${formatMoney(net)} netto i ${formatMoney(net + amount)} brutto.`,
      formula: [`${formatPlain(amount)} × 100 / ${formatPlain(rate)} = ${formatPlain(net)}`, `${formatPlain(net)} + ${formatPlain(amount)} = ${formatPlain(net + amount)}`],
    };
  }

  if (mode === "grossToNet") {
    const net = amount / (1 + rate / 100);
    const vat = amount - net;
    return {
      net,
      vat,
      gross: amount,
      rate,
      rateLabel,
      modeLabel: "Brutto → Netto",
      summary: `${formatMoney(amount)} brutto przy VAT ${rateLabel} to ${formatMoney(net)} netto i ${formatMoney(vat)} VAT.`,
      formula: [`${formatPlain(amount)} / ${formatPlain(1 + rate / 100)} = ${formatPlain(net)}`, `${formatPlain(amount)} - ${formatPlain(net)} = ${formatPlain(vat)}`],
    };
  }

  const vat = amount * rate / 100;
  return {
    net: amount,
    vat,
    gross: amount + vat,
    rate,
    rateLabel,
    modeLabel: "Netto → Brutto",
    summary: `${formatMoney(amount)} netto przy VAT ${rateLabel} to ${formatMoney(amount + vat)} brutto.`,
    formula: [`${formatPlain(amount)} × ${formatPlain(rate)} / 100 = ${formatPlain(vat)}`, `${formatPlain(amount)} + ${formatPlain(vat)} = ${formatPlain(amount + vat)}`],
  };
}

function ResultCard({ label, value, note }: { label: string; value: ReactNode; note?: string }) {
  return (
    <div className="rounded-lg border border-border bg-background p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 break-words text-2xl font-black leading-8 text-foreground">{value}</p>
      {note ? <p className="mt-1 text-xs text-muted-foreground">{note}</p> : null}
    </div>
  );
}

export default function PolishVatCalculator() {
  const [mode, setMode] = useState<Mode>("netToGross");
  const [amount, setAmount] = useState("1 000,00");
  const [rateChoice, setRateChoice] = useState<RateChoice>("23");
  const [customRate, setCustomRate] = useState("22");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const element = document.documentElement;
    const previousLang = element.lang;
    const previousDir = element.dir;
    element.lang = "pl";
    element.dir = "ltr";
    return () => {
      element.lang = previousLang;
      element.dir = previousDir;
    };
  }, []);

  const parsedAmount = useMemo(() => parsePolishNumber(amount), [amount]);
  const rateInfo = useMemo(() => getRate(rateChoice, customRate), [customRate, rateChoice]);
  const result = useMemo(() => calculateVat(mode, parsedAmount, rateInfo.rate, rateInfo.label), [mode, parsedAmount, rateInfo]);

  const error = useMemo(() => {
    if (!Number.isFinite(parsedAmount) || parsedAmount < 0) return "Wpisz prawidłową kwotę równą lub większą od 0.";
    if (rateInfo.error) return rateInfo.error;
    if (mode === "vatToBase" && rateChoice === "exempt" && parsedAmount > 0) return "ZW nie jest stawką podatku. Nie można obliczyć podstawy z niezerowej kwoty VAT przy zwolnieniu.";
    if (mode === "vatToBase" && rateInfo.rate === 0) return "Aby obliczyć netto z samej kwoty VAT, stawka musi być większa od 0%.";
    return "";
  }, [mode, parsedAmount, rateChoice, rateInfo]);

  const visibleResult = error ? null : result;

  const resultText = visibleResult
    ? [
        "Kalkulator VAT",
        "",
        "Tryb:",
        visibleResult.modeLabel,
        "",
        "Stawka VAT:",
        visibleResult.rateLabel,
        "",
        "Netto:",
        formatMoney(visibleResult.net),
        "",
        "VAT:",
        visibleResult.isExempt ? "ZW — podatek nie jest naliczany" : formatMoney(visibleResult.vat),
        "",
        "Brutto:",
        formatMoney(visibleResult.gross),
        "",
        "Wzór:",
        ...visibleResult.formula,
      ].join("\n")
    : "";

  const copyResult = async () => {
    if (!resultText) return;
    await navigator.clipboard.writeText(resultText);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  const reset = () => {
    setMode("netToGross");
    setAmount("1 000,00");
    setRateChoice("23");
    setCustomRate("22");
    setCopied(false);
  };

  const schema = [
    {
      "@type": "WebApplication",
      name: "Kalkulator VAT",
      url: canonical,
      applicationCategory: "FinanceApplication",
      operatingSystem: "Any",
      inLanguage: "pl",
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "PLN" },
      description: "Kalkulator VAT netto brutto dla stawek 23%, 8%, 5%, 0%, ZW oraz własnej stawki.",
    },
    {
      "@type": "WebPage",
      name: "Kalkulator VAT",
      url: canonical,
      inLanguage: "pl",
      description: "Oblicz VAT, kwotę netto i brutto dla stawek 23%, 8%, 5% lub 0%.",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Strona główna", item: "https://usonlinetools.com/" },
        { "@type": "ListItem", position: 2, name: "Finanse", item: "https://usonlinetools.com/category/finance" },
        { "@type": "ListItem", position: 3, name: "Kalkulator VAT", item: canonical },
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
        title="Kalkulator VAT – Netto, Brutto i Podatek | US Online Tools"
        description="Oblicz VAT, kwotę netto i brutto dla stawek 23%, 8%, 5% lub 0%. Przelicz netto na brutto, brutto na netto albo wylicz kwoty z samego VAT."
        canonical={canonical}
        schema={schema}
      />
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8" lang="pl">
        <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground" aria-label="Ścieżka nawigacji">
          <Link href="/">Strona główna</Link>
          <span>/</span>
          <Link href="/category/finance">Finanse</Link>
          <span>/</span>
          <span>Kalkulator VAT</span>
        </nav>

        <section className="mb-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-bold text-primary">
            <Calculator className="h-4 w-4" />
            VAT Polska
          </div>
          <h1 className="mt-4 text-4xl font-black tracking-normal md:text-6xl">Kalkulator VAT</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">
            Wpisz kwotę netto, brutto albo sam podatek VAT i wybierz stawkę. Kalkulator natychmiast pokaże netto, VAT i brutto wraz z użytym wzorem.
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-lg border border-border bg-card p-5 shadow-sm md:p-6">
            <h2 className="text-2xl font-black">Oblicz VAT</h2>
            <div className="mt-5 grid gap-2 rounded-lg bg-muted p-1 sm:grid-cols-3" role="tablist" aria-label="Tryb kalkulatora VAT">
              {[
                ["netToGross", "Netto → Brutto"],
                ["grossToNet", "Brutto → Netto"],
                ["vatToBase", "VAT → Netto i Brutto"],
              ].map(([value, label]) => (
                <button key={value} type="button" onClick={() => setMode(value as Mode)} className={`rounded-md px-3 py-3 text-sm font-bold ${mode === value ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`} role="tab" aria-selected={mode === value}>
                  {label}
                </button>
              ))}
            </div>

            <div className="mt-5 grid gap-4">
              <label className="grid gap-2">
                <span className="font-bold">{mode === "netToGross" ? "Kwota netto" : mode === "grossToNet" ? "Kwota brutto" : "Kwota VAT"}</span>
                <input value={amount} onChange={(event) => setAmount(event.target.value)} inputMode="decimal" className="h-12 rounded-lg border border-border bg-background px-4 focus:outline-none focus:ring-2 focus:ring-primary" aria-describedby="amount-help" />
                <span id="amount-help" className="text-sm text-muted-foreground">Przykład: 1 000,00 zł. Obsługiwane są polskie przecinki dziesiętne.</span>
              </label>

              <div className="grid gap-2">
                <span className="font-bold">Stawka VAT</span>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                  {[
                    ["23", "23%"],
                    ["8", "8%"],
                    ["5", "5%"],
                    ["0", "0%"],
                    ["exempt", "ZW"],
                    ["custom", "Inna"],
                  ].map(([value, label]) => (
                    <button key={value} type="button" onClick={() => setRateChoice(value as RateChoice)} className={`rounded-lg border px-3 py-3 text-sm font-bold ${rateChoice === value ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-muted"}`} aria-pressed={rateChoice === value}>
                      {label}
                    </button>
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">Wybierz stawkę właściwą dla transakcji. Kalkulator nie ustala klasyfikacji podatkowej towaru lub usługi.</span>
              </div>

              {rateChoice === "custom" ? (
                <label className="grid gap-2">
                  <span className="font-bold">Własna stawka VAT (%)</span>
                  <input value={customRate} onChange={(event) => setCustomRate(event.target.value)} inputMode="decimal" className="h-12 rounded-lg border border-border bg-background px-4 focus:outline-none focus:ring-2 focus:ring-primary" />
                  <span className="text-sm text-muted-foreground">Własna stawka służy wyłącznie do obliczeń matematycznych. Nie oznacza, że dana stawka jest obecnie właściwa dla konkretnej transakcji.</span>
                </label>
              ) : null}
            </div>

            {error ? <p className="mt-5 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm font-bold text-destructive">{error}</p> : null}

            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" onClick={copyResult} disabled={!visibleResult} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-bold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50">
                <Copy className="h-4 w-4" />
                {copied ? "Skopiowano" : "Kopiuj wynik"}
              </button>
              <button type="button" onClick={reset} className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-3 text-sm font-bold hover:bg-muted">
                <RotateCcw className="h-4 w-4" />
                Wyczyść
              </button>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-5 shadow-sm md:p-6" aria-live="polite">
            <h2 className="text-2xl font-black">Wynik</h2>
            {visibleResult ? (
              <div className="mt-5 space-y-4">
                <div className="rounded-lg border border-primary/20 bg-primary/10 p-5">
                  <p className="text-sm font-bold text-primary">{visibleResult.modeLabel}</p>
                  <p className="mt-2 text-2xl font-black leading-tight text-primary">{visibleResult.summary}</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <ResultCard label="Netto" value={formatMoney(visibleResult.net)} />
                  <ResultCard label="Stawka VAT" value={visibleResult.rateLabel} note={visibleResult.isExempt ? "ZW to zwolnienie, nie stawka 0%." : undefined} />
                  <ResultCard label="Kwota VAT" value={visibleResult.isExempt ? "ZW" : formatMoney(visibleResult.vat)} />
                  <ResultCard label="Brutto" value={formatMoney(visibleResult.gross)} />
                </div>
                <div className="rounded-lg bg-muted/40 p-4 text-sm leading-7 text-muted-foreground">
                  <p>Kalkulator VAT</p>
                  <p>Tryb: {visibleResult.modeLabel}</p>
                  <p>Kwota netto: {formatMoney(visibleResult.net)}</p>
                  <p>Stawka VAT: {visibleResult.rateLabel}</p>
                  <p>Kwota VAT: {visibleResult.isExempt ? "ZW — podatek nie jest naliczany" : formatMoney(visibleResult.vat)}</p>
                  <p>Kwota brutto: {formatMoney(visibleResult.gross)}</p>
                  <p>Wzór: {visibleResult.formula.join(" | ")}</p>
                </div>
              </div>
            ) : !error ? (
              <p className="mt-5 rounded-lg bg-muted/40 p-4 text-muted-foreground">Wpisz kwotę i wybierz stawkę VAT.</p>
            ) : null}
          </div>
        </section>

        <section className="mt-8 rounded-lg border border-primary/20 bg-primary/5 p-5 text-sm leading-7 text-muted-foreground">
          <p><strong className="text-foreground">Stawki sprawdzone:</strong> {polandVatData.lastVerifiedDisplay}</p>
          <p><strong className="text-foreground">Źródło:</strong> <a className="font-bold text-primary underline-offset-4 hover:underline" href={polandVatData.source.url} rel="noopener noreferrer" target="_blank">{polandVatData.source.name}</a></p>
          <p>Stawka 0% i zwolnienie z VAT nie są tym samym. Przy 0% transakcja podlega VAT ze stawką zero, natomiast ZW oznacza zwolnienie na podstawie odpowiednich przepisów.</p>
        </section>

        <section className="mt-10 grid gap-6">
          <article className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-2xl font-black">Jak obliczyć VAT?</h2>
            <p className="mt-4 leading-8 text-muted-foreground">Jeśli znasz kwotę netto, podatek VAT obliczysz, mnożąc netto przez wybraną stawkę.</p>
            <p className="mt-3 rounded-lg bg-muted/40 p-4 font-mono text-sm">VAT = Netto × stawka VAT / 100</p>
            <p className="mt-4 leading-8 text-muted-foreground">Dla 1 000 zł netto i 23%: 1 000 × 23 / 100 = 230 zł VAT. Kwota brutto: 1 000 + 230 = 1 230 zł.</p>
          </article>

          <article className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-2xl font-black">Jak obliczyć kwotę brutto z netto?</h2>
            <p className="mt-4 leading-8 text-muted-foreground">Użyj wzoru: Brutto = Netto × (1 + stawka/100). Dla 23%: 1 000 × 1,23 = 1 230 zł. Dla 8%: 1 000 × 1,08 = 1 080 zł. Dla 5%: 1 000 × 1,05 = 1 050 zł.</p>
          </article>

          <article className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-2xl font-black">Jak obliczyć netto z brutto?</h2>
            <p className="mt-4 leading-8 text-muted-foreground">Jeżeli znasz kwotę brutto, użyj wzoru: Netto = Brutto / (1 + stawka/100). Przykład: 1 230 / 1,23 = 1 000 zł netto, a VAT to 1 230 - 1 000 = 230 zł.</p>
          </article>

          <article className="rounded-lg border border-primary/20 bg-primary/5 p-6">
            <h2 className="text-2xl font-black">Dlaczego nie odejmujemy 23% od kwoty brutto?</h2>
            <p className="mt-4 leading-8 text-muted-foreground">Jeśli brutto wynosi 1 230 zł, działanie 1 230 × 23% = 282,90 zł jest błędne dla VAT zawartego w cenie. Poprawnie: 1 230 / 1,23 = 1 000 zł netto, a 1 230 - 1 000 = 230 zł VAT. Stawka 23% jest stosowana do netto, nie do już opodatkowanego brutto.</p>
          </article>

          <article className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-2xl font-black">Jak obliczyć netto, gdy znam tylko kwotę VAT?</h2>
            <p className="mt-4 leading-8 text-muted-foreground">Jeśli znasz kwotę podatku i stawkę, użyj wzoru: Netto = VAT × 100 / stawka. Przykład: VAT 230 zł i stawka 23% daje 230 × 100 / 23 = 1 000 zł netto oraz 1 230 zł brutto.</p>
          </article>

          <article className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-2xl font-black">Czym różni się VAT 0% od zwolnienia z VAT?</h2>
            <p className="mt-4 leading-8 text-muted-foreground">To dwie różne sytuacje podatkowe. Stawka 0% oznacza, że transakcja jest objęta VAT, lecz podatek należny wynosi 0% przy spełnieniu ustawowych warunków. ZW oznacza zwolnienie z VAT na określonej podstawie prawnej. W obu przypadkach kwota VAT na danej sprzedaży może wynosić 0 zł, ale konsekwencje podatkowe nie są takie same.</p>
          </article>

          <article className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-2xl font-black">Stawki VAT w Polsce</h2>
            <p className="mt-4 leading-8 text-muted-foreground">Według aktualnych informacji Ministerstwa Finansów podstawowa stawka VAT wynosi 23%. Stawki obniżone wynoszą 8% i 5%, a w określonych transakcjach może mieć zastosowanie stawka 0%. Niektóre dostawy i usługi korzystają ze zwolnienia z VAT.</p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[560px] border-collapse text-left text-sm">
                <thead><tr className="border-b border-border bg-muted/50"><th className="p-3 font-black">Oznaczenie</th><th className="p-3 font-black">Znaczenie</th></tr></thead>
                <tbody className="divide-y divide-border">
                  {polandVatData.standardRates.map((rate) => (
                    <tr key={rate.label}><td className="p-3 font-bold">{rate.label}</td><td className="p-3 text-muted-foreground">{rate.description}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>

          <article className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-2xl font-black">Jak sprawdzić VAT na fakturze?</h2>
            <p className="mt-4 leading-8 text-muted-foreground">Jeśli faktura podaje brutto i stawkę, wybierz Brutto → Netto, wpisz kwotę brutto, wybierz stawkę i porównaj netto oraz VAT z dokumentem. Przy fakturze zawierającej kilka pozycji z różnymi stawkami każdą grupę należy sprawdzić osobno.</p>
          </article>

          <article className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-2xl font-black">Czy można użyć innej stawki VAT?</h2>
            <p className="mt-4 leading-8 text-muted-foreground">Tak. Opcja Inna pozwala przeprowadzić obliczenie matematyczne z własnym procentem. Jest to przydatne przy starych dokumentach, okresowych przepisach albo sprawdzaniu nietypowej stawki. Własna stawka nie oznacza potwierdzenia, że jest prawidłowa prawnie dla danej transakcji.</p>
          </article>

          <article className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-2xl font-black">Dlaczego stawki VAT mogą się zmieniać?</h2>
            <p className="mt-4 leading-8 text-muted-foreground">Stawki mogą zostać zmienione przepisami albo czasowo obniżone dla określonych towarów. W 2026 stosowano przykładowo czasowe obniżki VAT na określone paliwa, ale nie są one stałymi presetami tego ogólnego kalkulatora. W przypadku transakcji historycznej sprawdź stawkę obowiązującą w konkretnym dniu.</p>
          </article>

          <article className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-2xl font-black">Przykłady obliczeń</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse text-left text-sm">
                <thead><tr className="border-b border-border bg-muted/50"><th className="p-3 font-black">Obliczenie</th><th className="p-3 font-black">Stawka</th><th className="p-3 text-right font-black">Netto</th><th className="p-3 text-right font-black">VAT</th><th className="p-3 text-right font-black">Brutto</th></tr></thead>
                <tbody className="divide-y divide-border">
                  {[
                    ["netto → brutto", "23%", "1 000,00 zł", "230,00 zł", "1 230,00 zł"],
                    ["netto → brutto", "8%", "1 000,00 zł", "80,00 zł", "1 080,00 zł"],
                    ["netto → brutto", "5%", "1 000,00 zł", "50,00 zł", "1 050,00 zł"],
                    ["brutto → netto", "23%", "1 000,00 zł", "230,00 zł", "1 230,00 zł"],
                    ["brutto → netto", "23%", "813,01 zł", "186,99 zł", "1 000,00 zł"],
                    ["VAT → netto", "23%", "1 000,00 zł", "230,00 zł", "1 230,00 zł"],
                  ].map(([operation, rate, net, vat, gross]) => (
                    <tr key={`${operation}-${rate}-${gross}`}>
                      <td className="p-3 font-bold">{operation}</td>
                      <td className="p-3 text-muted-foreground">{rate}</td>
                      <td className="p-3 text-right text-muted-foreground">{net}</td>
                      <td className="p-3 text-right text-muted-foreground">{vat}</td>
                      <td className="p-3 text-right text-muted-foreground">{gross}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">Wyniki są wyświetlane z dokładnością do 1 grosza. Na fakturach wielopozycyjnych mogą wystąpić niewielkie różnice w zależności od sposobu zaokrąglania wartości każdej pozycji i sumy dokumentu.</p>
          </article>

          <article className="rounded-lg border border-primary/20 bg-primary/5 p-6">
            <h2 className="text-2xl font-black">Krótkie odpowiedzi</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div><h3 className="font-black">Jak obliczyć VAT?</h3><p className="mt-2 leading-8 text-muted-foreground">VAT = kwota netto × stawka / 100. Przy 1 000 zł netto i stawce 23% VAT wynosi 230 zł, a brutto 1 230 zł.</p></div>
              <div><h3 className="font-black">Jak obliczyć netto z brutto?</h3><p className="mt-2 leading-8 text-muted-foreground">Podziel brutto przez 1 + stawka VAT/100. Dla 23%: 1 230 ÷ 1,23 = 1 000 zł netto.</p></div>
              <div><h3 className="font-black">Jak obliczyć VAT z brutto?</h3><p className="mt-2 leading-8 text-muted-foreground">Użyj wzoru VAT = brutto × stawka / (100 + stawka). Dla 1 230 zł brutto i 23% VAT wynosi 230 zł.</p></div>
              <div><h3 className="font-black">Jaka jest podstawowa stawka VAT w Polsce?</h3><p className="mt-2 leading-8 text-muted-foreground">Podstawowa stawka VAT wynosi 23%.</p></div>
            </div>
          </article>

          <article className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-6">
            <h2 className="text-2xl font-black">Ważna informacja</h2>
            <p className="mt-4 leading-8 text-muted-foreground">Kalkulator wykonuje obliczenia matematyczne na podstawie wybranej stawki VAT. Nie ustala, jaka stawka lub zwolnienie jest prawidłowe dla konkretnego towaru, usługi albo transakcji. W przypadku rozliczeń podatkowych sprawdź aktualne przepisy i informacje Ministerstwa Finansów.</p>
          </article>

          <article className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-2xl font-black">Najczęstsze pytania</h2>
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
