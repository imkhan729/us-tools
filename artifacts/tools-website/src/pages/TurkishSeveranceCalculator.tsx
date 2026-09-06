import { type ReactNode, useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { Calculator, Copy, RotateCcw } from "lucide-react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { getTurkeySeveranceCeiling, turkeySeveranceData } from "@/data/laborData/turkey/severance";

const canonical = "https://usonlinetools.com/kidem-tazminati-hesaplama";

type Eligibility = "yes" | "no" | "unsure";
type Reason =
  | "employer-not-25-ii"
  | "worker-justified"
  | "military"
  | "retirement"
  | "age-except-retirement"
  | "marriage"
  | "death"
  | "resignation"
  | "employer-25-ii"
  | "other";

const reasonLabels: Record<Reason, string> = {
  "employer-not-25-ii": "İşveren feshi — 25/II dışındaki neden",
  "worker-justified": "İşçi haklı feshi",
  military: "Askerlik",
  retirement: "Emeklilik",
  "age-except-retirement": "Yaş dışındaki emeklilik koşulları",
  marriage: "Evlilik nedeniyle ayrılma",
  death: "İşçinin ölümü / mirasçı hesabı",
  resignation: "Normal istifa",
  "employer-25-ii": "İşverenin 25/II kapsamında feshi",
  other: "Diğer / emin değilim",
};

const nonEntitlementReasons: Reason[] = ["resignation", "employer-25-ii"];

const faqs = [
  ["Kıdem tazminatı nasıl hesaplanır?", "Giydirilmiş brüt ücret ile fesih tarihindeki kıdem tavanından düşük olan tutar alınır ve toplam kıdem günü/365 ile çarpılır. Brüt tutardan damga vergisi düşülerek net tahmin bulunur."],
  ["Kıdem tazminatı için en az kaç yıl çalışmak gerekir?", "Standart koşul aynı işverene bağlı en az 1 yıllık çalışmadır."],
  ["Bir yıldan az çalışan kıdem tazminatı alabilir mi?", "Standart 1475 m.14 hesabında 1 yıllık asgari kıdem koşulu sağlanmadığında kıdem tazminatı hakkı oluşmaz."],
  ["2026 kıdem tazminatı tavanı ne kadar?", "2026'nın ilk yarısında ₺64.948,77, 1 Temmuz–31 Aralık döneminde ₺73.729,87'dir. Fesih tarihindeki tavan uygulanır."],
  ["Giydirilmiş brüt ücret ne demek?", "Çıplak brüt maaşa düzenli ve para ile ölçülebilen uygun yan hakların eklenmesiyle oluşan kıdeme esas brüt ücrettir."],
  ["Yemek ve yol yardımı kıdeme dahil edilir mi?", "Düzenli ve para ile ölçülebilen yemek/yol yardımı uygun koşullarda giydirilmiş ücrete dahil edilebilir."],
  ["Fazla mesai kıdeme dahil mi?", "Bakanlık rehberinde fazla çalışma ücreti standart kıdem hesabına dahil edilmeyen ödeme örnekleri arasındadır."],
  ["Kıdem tazminatından gelir vergisi kesilir mi?", "Standart kanuni kıdem tazminatında gelir vergisi ve SGK primi yerine yalnız damga vergisi kesintisi gösterilir. Kanuni kıdem dışındaki ek ödemeler farklı vergilendirilebilir."],
  ["Damga vergisi ne kadar?", "Araçta standart kıdem için binde 7,59, yani %0,759 oranı kullanılır."],
  ["Tavan toplam kıdem tutarını mı sınırlar?", "Hayır. Tavan her hizmet yılı için kullanılan 30 günlük ücret esasını sınırlar; toplam kıdem birden fazla yıllık tavan tutarını aşabilir."],
  ["Verilerim kaydediliyor mu?", "Hayır. Hesaplama tarayıcınızda yapılır; T.C. kimlik numarası, işveren adı, e-posta veya telefon istenmez."],
];

const money = (value: number) => `₺${value.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const numberFmt = (value: number) => value.toLocaleString("tr-TR", { maximumFractionDigits: 2 });

function parseMoney(value: string): number {
  const clean = value.replace(/\s/g, "").replace(/[₺TLtl]/g, "");
  const normalized = clean.includes(",") ? clean.replace(/\./g, "").replace(",", ".") : clean;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function parsePlainDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const [, y, m, d] = match;
  const date = { year: Number(y), month: Number(m), day: Number(d) };
  const js = new Date(Date.UTC(date.year, date.month - 1, date.day));
  if (js.getUTCFullYear() !== date.year || js.getUTCMonth() + 1 !== date.month || js.getUTCDate() !== date.day) return null;
  return date;
}

function toUtc(value: string) {
  const date = parsePlainDate(value);
  return date ? Date.UTC(date.year, date.month - 1, date.day) : NaN;
}

function serviceDaysInclusive(start: string, end: string, excludedDays: number) {
  const startUtc = toUtc(start);
  const endUtc = toUtc(end);
  if (!Number.isFinite(startUtc) || !Number.isFinite(endUtc) || endUtc < startUtc) return null;
  return Math.max(0, Math.floor((endUtc - startUtc) / 86_400_000) + 1 - excludedDays);
}

function humanDurationFromDays(totalDays: number) {
  const years = Math.floor(totalDays / 365);
  const remainder = totalDays - years * 365;
  const months = Math.floor(remainder / 30);
  const days = remainder - months * 30;
  return `${years} yıl ${months} ay ${days} gün`;
}

function formatDateTr(value: string) {
  const date = parsePlainDate(value);
  if (!date) return value;
  return `${String(date.day).padStart(2, "0")}.${String(date.month).padStart(2, "0")}.${date.year}`;
}

function Field({ label, children, note }: { label: string; children: ReactNode; note?: string }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-bold text-foreground">{label}</span>
      {children}
      {note ? <span className="text-xs leading-5 text-muted-foreground">{note}</span> : null}
    </label>
  );
}

function InfoCard({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-xl font-black text-foreground">{value}</p>
      {note ? <p className="mt-2 text-xs leading-5 text-muted-foreground">{note}</p> : null}
    </div>
  );
}

export default function TurkishSeveranceCalculator() {
  const [eligibility, setEligibility] = useState<Eligibility>("yes");
  const [reason, setReason] = useState<Reason>("employer-not-25-ii");
  const [startDate, setStartDate] = useState("2020-01-01");
  const [terminationDate, setTerminationDate] = useState("2026-08-01");
  const [grossSalary, setGrossSalary] = useState("60.000");
  const [transport, setTransport] = useState("3.000");
  const [meal, setMeal] = useState("4.000");
  const [monthlyBenefits, setMonthlyBenefits] = useState("0");
  const [annualBonus, setAnnualBonus] = useState("24.000");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [otherAnnualBenefits, setOtherAnnualBenefits] = useState("0");
  const [excludedDays, setExcludedDays] = useState("0");
  const [manualCeiling, setManualCeiling] = useState("");
  const [multiplier, setMultiplier] = useState("30");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const previousLang = root.lang;
    root.lang = "tr";
    return () => {
      root.lang = previousLang;
    };
  }, []);

  const result = useMemo(() => {
    const salary = parseMoney(grossSalary);
    const road = parseMoney(transport);
    const food = parseMoney(meal);
    const monthlyOther = parseMoney(monthlyBenefits);
    const annual = parseMoney(annualBonus);
    const otherAnnual = parseMoney(otherAnnualBenefits);
    const excluded = Math.max(0, Math.floor(Number(excludedDays) || 0));
    const serviceDays = serviceDaysInclusive(startDate, terminationDate, excluded);
    const ceilingPeriod = getTurkeySeveranceCeiling(terminationDate);
    const overrideCeiling = manualCeiling.trim() ? parseMoney(manualCeiling) : 0;
    const ceiling = overrideCeiling > 0 ? overrideCeiling : ceilingPeriod?.amount ?? null;
    const monthlyBonusEquivalent = annual / 12;
    const otherAnnualEquivalent = otherAnnual / 12;
    const dressedGross = salary + road + food + monthlyOther + monthlyBonusEquivalent + otherAnnualEquivalent;
    const wageDays = Math.max(1, Math.min(60, Number(multiplier) || turkeySeveranceData.rules.annualWageDays));
    const wageMultiplier = wageDays / turkeySeveranceData.rules.annualWageDays;
    const annualBase = ceiling === null ? null : Math.min(dressedGross, ceiling) * wageMultiplier;
    const hasMinimumService = serviceDays !== null && serviceDays >= turkeySeveranceData.rules.minimumServiceDays;
    const hasReasonWarning = eligibility === "no" || nonEntitlementReasons.includes(reason);
    const payable = hasMinimumService && !hasReasonWarning && annualBase !== null;
    const grossSeverance = payable && serviceDays !== null ? annualBase * (serviceDays / turkeySeveranceData.rules.annualDays) : 0;
    const stampTax = grossSeverance * turkeySeveranceData.stampTaxRate;
    const netSeverance = Math.max(0, grossSeverance - stampTax);
    const errors: string[] = [];
    if (salary <= 0) errors.push("Geçerli bir brüt ücret girin.");
    if (serviceDays === null) errors.push("İşe giriş tarihi fesih tarihinden önce olmalıdır.");
    if (ceiling === null) errors.push("Bu fesih tarihi için doğrulanmış kıdem tavanı verisi bulunamadı. Güncel/resmî tavanı kontrol edin veya gelişmiş bölümden manuel tavan girin.");
    if (serviceDays !== null && serviceDays < turkeySeveranceData.rules.minimumServiceDays) errors.push("Standart kıdem tazminatı için aynı işverene bağlı en az 1 yıllık çalışma ön koşulu sağlanmıyor.");
    if (hasReasonWarning) errors.push("Normal istifa veya 25/II kapsamındaki fesih gibi kıdem hakkı doğurmayan durumda kanuni kıdem tazminatı oluşmayabilir.");
    return {
      salary,
      road,
      food,
      monthlyOther,
      annual,
      otherAnnual,
      monthlyBonusEquivalent,
      otherAnnualEquivalent,
      dressedGross,
      serviceDays,
      humanDuration: serviceDays === null ? "" : humanDurationFromDays(serviceDays),
      ceiling,
      ceilingPeriod,
      wageDays,
      wageMultiplier,
      annualBase,
      hasMinimumService,
      hasReasonWarning,
      payable,
      grossSeverance,
      stampTax,
      netSeverance,
      errors,
    };
  }, [annualBonus, eligibility, excludedDays, grossSalary, manualCeiling, meal, monthlyBenefits, multiplier, otherAnnualBenefits, reason, startDate, terminationDate, transport]);

  const reset = () => {
    setEligibility("yes");
    setReason("employer-not-25-ii");
    setStartDate("2020-01-01");
    setTerminationDate("2026-08-01");
    setGrossSalary("60.000");
    setTransport("3.000");
    setMeal("4.000");
    setMonthlyBenefits("0");
    setAnnualBonus("24.000");
    setOtherAnnualBenefits("0");
    setExcludedDays("0");
    setManualCeiling("");
    setMultiplier("30");
    setCopied(false);
  };

  const copyResult = async () => {
    const text = [
      "Kıdem tazminatı hesabı - US Online Tools",
      `İşe giriş: ${formatDateTr(startDate)}`,
      `Fesih: ${formatDateTr(terminationDate)}`,
      `Kıdeme esas hizmet: ${result.serviceDays ?? 0} gün`,
      `Giydirilmiş brüt: ${money(result.dressedGross)}`,
      `Fesih tarihindeki tavan: ${result.ceiling === null ? "doğrulanmadı" : money(result.ceiling)}`,
      `Kıdeme esas 30 günlük ücret: ${result.annualBase === null ? "doğrulanmadı" : money(result.annualBase)}`,
      `Brüt kıdem: ${money(result.grossSeverance)}`,
      `Damga vergisi: ${money(result.stampTax)}`,
      `Net kıdem: ${money(result.netSeverance)}`,
    ].join("\n");
    await navigator.clipboard?.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const schema = [
    { "@context": "https://schema.org", "@type": "WebApplication", name: "Kıdem Tazminatı Hesaplama", url: canonical, applicationCategory: "FinanceApplication", operatingSystem: "Any", inLanguage: "tr", description: "Türkiye için kıdem tazminatı hesaplama aracı; giydirilmiş brüt, tarih bazlı tavan, damga vergisi ve net tahmin." },
    { "@context": "https://schema.org", "@type": "WebPage", name: "Kıdem Tazminatı Hesaplama 2026", url: canonical, inLanguage: "tr", dateModified: "2026-09-06", isAccessibleForFree: true },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Ana Sayfa", item: "https://usonlinetools.com/" }, { "@type": "ListItem", position: 2, name: "Finans", item: "https://usonlinetools.com/category/finance" }, { "@type": "ListItem", position: 3, name: "Kıdem Tazminatı Hesaplama", item: canonical }] },
    { "@context": "https://schema.org", "@type": "FAQPage", inLanguage: "tr", mainEntity: faqs.map(([question, answer]) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })) },
  ];

  const rows = [
    ["Çıplak brüt ücret", money(result.salary), "Bordrodaki brüt aylık ücret"],
    ["Yol yardımı", money(result.road), "Düzenli aylık tutar"],
    ["Yemek yardımı", money(result.food), "Düzenli aylık tutar"],
    ["Diğer düzenli aylık yan hak", money(result.monthlyOther), "Süreklilik gösteren ödemeler"],
    ["Yıllık ikramiye aylık karşılığı", `${money(result.annual)} / 12 = ${money(result.monthlyBonusEquivalent)}`, "Düzenli yıllık tutarın aylık karşılığı"],
    ["Giydirilmiş brüt", money(result.dressedGross), "Kıdeme esas ücret bileşenleri toplamı"],
    ["Fesih tarihi", formatDateTr(terminationDate), "Tavan dönemi bu tarihle seçilir"],
    ["Geçerli kıdem tavanı", result.ceiling === null ? "Doğrulanmadı" : money(result.ceiling), result.ceilingPeriod ? `${formatDateTr(result.ceilingPeriod.from)}–${formatDateTr(result.ceilingPeriod.to)}` : "Manuel tavan veya doğrulanmış dönem gerekir"],
    ["Kıdeme esas 30 günlük ücret", result.annualBase === null ? "Doğrulanmadı" : money(result.annualBase), "min(giydirilmiş brüt, tavan)"],
    ["Kıdeme esas hizmet", `${result.serviceDays ?? 0} gün`, result.humanDuration],
    ["Brüt kıdem", money(result.grossSeverance), "kıdeme esas ücret × gün / 365"],
    ["Damga vergisi", `-${money(result.stampTax)}`, `binde ${numberFmt(turkeySeveranceData.stampTaxRate * 1000)}`],
    ["Net kıdem", money(result.netSeverance), "brüt kıdem − damga vergisi"],
  ];

  return (
    <Layout>
      <SEO title="Kıdem Tazminatı Hesaplama 2026 – Güncel Tavan | US Online Tools" description="İşe giriş-çıkış tarihi, brüt maaş, yol, yemek ve ikramiye ile kıdem tazminatını 2026 tarih bazlı tavan ve damga vergisiyle hesaplayın." canonical={canonical} schema={schema} />
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted-foreground"><Link href="/" className="hover:text-primary">Ana Sayfa</Link><span>/</span><Link href="/category/finance" className="hover:text-primary">Finans</Link><span>/</span><span>Kıdem tazminatı hesaplama</span></nav>

        <section className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-secondary/10 p-6 md:p-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-black uppercase tracking-wide text-primary"><Calculator className="h-4 w-4" /> Güncel tavanlı hesaplama</div>
          <h1 className="mt-5 text-4xl font-black tracking-tight md:text-6xl">Kıdem Tazminatı Hesaplama</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">İşe giriş ve fesih tarihini, çıplak brüt ücreti ve düzenli yan hakları girerek tahmini brüt/net kıdem tazminatını hesaplayın. Tavan fesih tarihine göre otomatik seçilir.</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><InfoCard label="2026 Ocak–Haziran tavanı" value="₺64.948,77" /><InfoCard label="2026 Temmuz–Aralık tavanı" value="₺73.729,87" /><InfoCard label="Damga vergisi" value="Binde 7,59" /><InfoCard label="Asgari kıdem" value="1 yıl" /></div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm md:p-7">
            <h2 className="text-2xl font-black">Hesaplama bilgileri</h2>
            <div className="mt-5 rounded-xl bg-muted/40 p-4">
              <p className="font-bold">Kıdem hakkı doğuran bir sona erme nedeni var mı?</p>
              <div className="mt-3 flex flex-wrap gap-2">{(["yes", "no", "unsure"] as Eligibility[]).map((value) => <button key={value} type="button" onClick={() => setEligibility(value)} className={`rounded-lg px-4 py-2 text-sm font-black ${eligibility === value ? "bg-primary text-primary-foreground" : "border border-border bg-background"}`}>{value === "yes" ? "Evet" : value === "no" ? "Hayır" : "Emin değilim"}</button>)}</div>
              {eligibility !== "yes" ? <p className="mt-3 text-sm leading-6 text-muted-foreground">Normal istifa gibi kıdem hakkı doğurmayan durumda kanuni kıdem tazminatı oluşmayabilir. Yine de yalnız matematiksel tutarı görmek isterseniz hesaplamaya devam edebilirsiniz.</p> : null}
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="Sona erme nedeni"><select value={reason} onChange={(event) => setReason(event.target.value as Reason)} className="h-12 rounded-lg border border-border bg-background px-4">{Object.entries(reasonLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></Field>
              <Field label="Son aylık çıplak brüt ücret" note="Yan hakları eklemeden bordrodaki brüt aylık ücret."><input value={grossSalary} onChange={(event) => setGrossSalary(event.target.value)} inputMode="decimal" className="h-12 rounded-lg border border-border bg-background px-4" /></Field>
              <Field label="İşe giriş tarihi"><input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} className="h-12 rounded-lg border border-border bg-background px-4" /></Field>
              <Field label="İşten ayrılış / fesih tarihi"><input type="date" value={terminationDate} onChange={(event) => setTerminationDate(event.target.value)} className="h-12 rounded-lg border border-border bg-background px-4" /></Field>
              <Field label="Düzenli aylık yol yardımı"><input value={transport} onChange={(event) => setTransport(event.target.value)} inputMode="decimal" className="h-12 rounded-lg border border-border bg-background px-4" /></Field>
              <Field label="Düzenli aylık yemek yardımı"><input value={meal} onChange={(event) => setMeal(event.target.value)} inputMode="decimal" className="h-12 rounded-lg border border-border bg-background px-4" /></Field>
              <Field label="Diğer düzenli aylık yan haklar" note="Süreklilik göstermeyen tek seferlik ödemeleri eklemeyin."><input value={monthlyBenefits} onChange={(event) => setMonthlyBenefits(event.target.value)} inputMode="decimal" className="h-12 rounded-lg border border-border bg-background px-4" /></Field>
              <Field label="Yıllık düzenli ikramiye / prim toplamı"><input value={annualBonus} onChange={(event) => setAnnualBonus(event.target.value)} inputMode="decimal" className="h-12 rounded-lg border border-border bg-background px-4" /></Field>
            </div>
            <button type="button" onClick={() => setShowAdvanced((value) => !value)} className="mt-5 rounded-lg border border-border px-4 py-2 text-sm font-bold">{showAdvanced ? "Gelişmiş seçenekleri kapat" : "Gelişmiş seçenekler"}</button>
            {showAdvanced ? <div className="mt-5 grid gap-4 sm:grid-cols-2"><Field label="Kıdeme dahil olmayan günler"><input value={excludedDays} onChange={(event) => setExcludedDays(event.target.value)} inputMode="numeric" className="h-12 rounded-lg border border-border bg-background px-4" /></Field><Field label="Diğer yıllık düzenli yan hak"><input value={otherAnnualBenefits} onChange={(event) => setOtherAnnualBenefits(event.target.value)} inputMode="decimal" className="h-12 rounded-lg border border-border bg-background px-4" /></Field><Field label="Manuel tavan" note="Doğrulanmış dönem dışında kullanın. Kanuni tavanı kaldırmak için değildir."><input value={manualCeiling} onChange={(event) => setManualCeiling(event.target.value)} inputMode="decimal" placeholder="otomatik" className="h-12 rounded-lg border border-border bg-background px-4" /></Field><Field label="Yıllık ücret günü çarpanı" note="Standart kanuni hesapta 30 gündür. TİS/özel durum varsa dikkatli kullanın."><input value={multiplier} onChange={(event) => setMultiplier(event.target.value)} inputMode="numeric" className="h-12 rounded-lg border border-border bg-background px-4" /></Field></div> : null}
            {result.errors.length ? <div className="mt-5 rounded-xl bg-destructive/10 p-4 text-sm leading-7 text-destructive">{result.errors.map((error) => <p key={error}>{error}</p>)}</div> : null}
            <div className="mt-6 flex flex-wrap gap-3"><button type="button" onClick={copyResult} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-black text-primary-foreground"><Copy className="h-4 w-4" /> {copied ? "Kopyalandı" : "Özeti kopyala"}</button><button type="button" onClick={reset} className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-bold"><RotateCcw className="h-4 w-4" /> Örneği geri yükle</button></div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm md:p-7" aria-live="polite">
            <h2 className="text-2xl font-black">Tahmini net kıdem tazminatı</h2>
            <div className="mt-5 rounded-2xl border border-primary/30 bg-primary/10 p-5"><p className="text-sm font-bold text-muted-foreground">Standart kanuni varsayımla net kıdem</p><p className="mt-2 text-4xl font-black text-primary">{money(result.netSeverance)}</p><p className="mt-2 text-sm leading-6 text-muted-foreground">Brüt kıdemden yalnız damga vergisi düşülür. Hak koşulu yoksa standart ödenecek tutar 0 TL gösterilir.</p></div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2"><InfoCard label="Brüt kıdem" value={money(result.grossSeverance)} /><InfoCard label="Damga vergisi" value={`-${money(result.stampTax)}`} /><InfoCard label="Hizmet süresi" value={result.humanDuration || "Geçersiz tarih"} note={`${result.serviceDays ?? 0} gün`} /><InfoCard label="Giydirilmiş brüt ücret" value={money(result.dressedGross)} /><InfoCard label="Uygulanan tavan" value={result.ceiling === null ? "Doğrulanmadı" : money(result.ceiling)} note={result.ceilingPeriod ? `${formatDateTr(result.ceilingPeriod.from)}–${formatDateTr(result.ceilingPeriod.to)}` : "manuel tavan gerekli"} /><InfoCard label="Kıdeme esas 30 günlük ücret" value={result.annualBase === null ? "Doğrulanmadı" : money(result.annualBase)} /></div>
            <p className="mt-5 rounded-xl bg-muted/40 p-4 text-sm leading-7">{result.ceiling !== null && result.dressedGross > result.ceiling ? `Giydirilmiş brüt ücretiniz fesih tarihindeki kıdem tavanını aşıyor. Yıllık kıdem hesabında ${money(result.ceiling)} esas alındı.` : "Giydirilmiş brüt ücretiniz tavanın altında. Hesapta giydirilmiş ücretiniz kullanıldı."}</p>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-border bg-card p-5 md:p-7">
          <h2 className="text-2xl font-black">Hesabın adımları</h2>
          <div className="mt-5 overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead><tr className="border-b border-border text-muted-foreground"><th className="py-3 pr-4">Adım</th><th className="py-3 pr-4">Tutar / değer</th><th className="py-3">Açıklama</th></tr></thead><tbody>{rows.map(([label, value, note]) => <tr key={label} className="border-b border-border/60"><td className="py-3 pr-4 font-bold">{label}</td><td className="py-3 pr-4">{value}</td><td className="py-3 text-muted-foreground">{note}</td></tr>)}</tbody></table></div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <article className="rounded-2xl border border-border bg-card p-6"><h2 className="text-2xl font-black">Kıdem tazminatı formülü</h2><p className="mt-4 leading-8 text-muted-foreground">Brüt kıdem = min(giydirilmiş brüt ücret, fesih tarihindeki kıdem tavanı) × toplam kıdem günü ÷ 365. Bu araç başlangıç ve fesih gününü takvim günlerine dahil eder; somut bordro yöntemlerinde bir günlük fark oluşabilir.</p></article>
          <article className="rounded-2xl border border-border bg-card p-6"><h2 className="text-2xl font-black">Tavan toplam tutarı sınırlamaz</h2><p className="mt-4 leading-8 text-muted-foreground">Kıdem tavanı, her hizmet yılı için kullanılan 30 günlük ücret esasını sınırlar. Örneğin 10 yıllık bir çalışan için toplam brüt kıdem, fesih tarihindeki yıllık tavanın 10 katına yaklaşabilir.</p></article>
          <article className="rounded-2xl border border-border bg-card p-6"><h2 className="text-2xl font-black">Dahil ve hariç ödemeler</h2><p className="mt-4 leading-8 text-muted-foreground">Düzenli yol, yemek, yakacak, konut, aile/çocuk yardımı veya süreklilik gösteren prim gibi para ile ölçülebilen ödemeler uygun koşullarda dahil edilebilir. Yıllık izin ücreti, evlenme yardımı, hastalık yardımı, doğum/ölüm yardımı, fazla çalışma, harcırah ve tek seferlik ödemeleri düzenli yan hak alanına eklemeyin.</p></article>
          <article className="rounded-2xl border border-border bg-card p-6"><h2 className="text-2xl font-black">Vergi ve kesinti</h2><p className="mt-4 leading-8 text-muted-foreground">Standart kanuni kıdem tazminatından yalnız damga vergisi kesintisi gösterilir. Gelir vergisi, SGK primi ve işsizlik sigortası primi 0 TL kabul edilir. Kanuni kıdem dışında yapılan ek ödemelerin vergilendirilmesi farklı olabilir.</p></article>
        </section>

        <section className="mt-8 rounded-2xl border border-border bg-card p-6"><h2 className="text-2xl font-black">Önemli bilgilendirme</h2><p className="mt-4 leading-8 text-muted-foreground">Bu araç 1475 sayılı İş Kanunu m.14 kapsamındaki standart kıdem tazminatı hesabını, girdiğiniz veriler ve doğrulanmış tavan/oranlar üzerinden tahmini olarak gösterir. Fesih nedeni, hizmet süresine dahil edilmeyen dönemler, toplu iş sözleşmesi, işyeri devri, özel kanunlar ve uyuşmazlıklar gerçek sonucu değiştirebilir. Resmî veya hukuki işlem öncesinde bordro kayıtlarınızı ve güncel mevzuatı kontrol edin.</p><p className="mt-3 leading-8 text-muted-foreground">Son doğrulama: {turkeySeveranceData.lastVerified}. Sonuçlar kuruşa yuvarlanır.</p></section>

        <section className="mt-8 rounded-2xl border border-border bg-card p-6"><h2 className="text-2xl font-black">Sık sorulan sorular</h2><div className="mt-5 space-y-5">{faqs.map(([question, answer]) => <div key={question}><h3 className="font-black">{question}</h3><p className="mt-1 leading-8 text-muted-foreground">{answer}</p></div>)}</div></section>
      </main>
    </Layout>
  );
}
