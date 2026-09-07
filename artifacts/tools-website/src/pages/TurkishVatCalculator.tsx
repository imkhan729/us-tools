import { type ReactNode, useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { Calculator, Copy, RotateCcw } from "lucide-react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";

const canonical = "https://usonlinetools.com/kdv-hesaplama";
const rateConfig = {
  lastVerified: "5 Eylül 2026",
  standardRates: [20, 10, 1],
  generalRate: 20,
  source: "Gelir İdaresi Başkanlığı",
};

const faqs = [
  { q: "KDV nasıl hesaplanır?", a: "KDV hariç tutarı KDV oranıyla çarpıp 100'e bölün. 1.000 TL'nin %20 KDV'si 200 TL'dir." },
  { q: "KDV dahil fiyat nasıl hesaplanır?", a: "KDV hariç fiyatı 1 + oran/100 ile çarpın." },
  { q: "KDV dahil tutardan KDV nasıl çıkarılır?", a: "Dahil tutarı 1 + oran/100 değerine bölerek matrahı bulun; ardından matrahı toplamdan çıkarın." },
  { q: "1.200 TL %20 KDV dahil ise KDV kaçtır?", a: "200 TL. Matrah 1.000 TL'dir." },
  { q: "Matrah nasıl hesaplanır?", a: "Dahil tutardan: toplam ÷ (1 + oran/100). Yalnız KDV biliniyorsa: KDV × 100 ÷ oran." },
  { q: "Türkiye'de güncel KDV oranları nedir?", a: "Son resmi kontrolde temel oranlar %1, %10 ve %20'dir. Uygulanacak oran işlemin mevzuattaki sınıflandırmasına göre değişebilir." },
  { q: "Genel KDV oranı kaçtır?", a: "İndirimli oran listeleri dışında kalan vergiye tabi işlemler için genel oran %20'dir." },
  { q: "%18 ve %8 güncel standart oranlar mı?", a: "Hayır. Bunlar 10 Temmuz 2023 öncesindeki temel oranlardı. Geçmiş dönem hesaplamaları için özel oran alanı kullanılabilir." },
  { q: "Özel KDV oranı girebilir miyim?", a: "Evet. Özel oran alanına pozitif bir oran girerek eski dönem veya özel hesaplamalar yapabilirsiniz." },
  { q: "KDV dahil tutarın %20'sini almak neden yanlış olabilir?", a: "Çünkü %20 net matrah üzerinden hesaplanmıştır, final brüt toplam üzerinden değil." },
  { q: "1 kuruş fark neden olabilir?", a: "Fatura ve muhasebe yazılımları satır bazında veya farklı aşamalarda yuvarlama yapabilir." },
  { q: "Araç hangi ürünün oranını belirler mi?", a: "Hayır. Araç yalnızca seçtiğiniz oran üzerinden matematiksel hesaplama yapar." },
  { q: "Hesaplama ücretsiz mi?", a: "Evet. KDV hesaplama aracı ücretsizdir ve kayıt gerektirmez." },
  { q: "Tutarlar kaydediliyor mu?", a: "Hayır. Hesaplama tarayıcınızda yapılır ve tutarın sunucuya gönderilmesi gerekmez." },
];

type Mode = "netToGross" | "grossToNet" | "vatToBase";
type RateChoice = "20" | "10" | "1" | "custom";

type VatResult = {
  base: number;
  vat: number;
  total: number;
  rate: number;
  formula: string;
  typeLabel: string;
};

function parseTurkishNumber(value: string) {
  const cleaned = value.trim().replace(/\s/g, "").replace(/[₺TLtl]/g, "");
  if (!cleaned) return NaN;
  if (cleaned.includes(",")) {
    return Number(cleaned.replace(/\./g, "").replace(",", "."));
  }
  const dotCount = (cleaned.match(/\./g) ?? []).length;
  if (dotCount === 1) {
    const [left, right] = cleaned.split(".");
    if (right.length === 3 && left.length <= 3) {
      return Number(left + right);
    }
    return Number(cleaned);
  }
  return Number(cleaned.replace(/\./g, ""));
}

function formatMoney(value: number) {
  return `${value.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TL`;
}

function formatPlain(value: number) {
  return value.toLocaleString("tr-TR", { maximumFractionDigits: 4 });
}

function calculateVat(mode: Mode, amount: number, rate: number): VatResult | null {
  if (!Number.isFinite(amount) || !Number.isFinite(rate) || amount < 0 || rate <= 0 || rate > 100) {
    return null;
  }

  if (mode === "netToGross") {
    const vat = amount * rate / 100;
    return {
      base: amount,
      vat,
      total: amount + vat,
      rate,
      formula: `${formatPlain(amount)} × ${formatPlain(rate)} / 100 = ${formatPlain(vat)}`,
      typeLabel: "KDV hariçten KDV dahil",
    };
  }

  if (mode === "grossToNet") {
    const base = amount / (1 + rate / 100);
    return {
      base,
      vat: amount - base,
      total: amount,
      rate,
      formula: `${formatPlain(amount)} ÷ ${formatPlain(1 + rate / 100)} = ${formatPlain(base)}`,
      typeLabel: "KDV dahilden KDV hariç",
    };
  }

  const base = amount * 100 / rate;
  return {
    base,
    vat: amount,
    total: base + amount,
    rate,
    formula: `${formatPlain(amount)} × 100 / ${formatPlain(rate)} = ${formatPlain(base)}`,
    typeLabel: "KDV tutarından matrah",
  };
}

function ResultCard({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-background p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 break-words text-2xl font-black leading-8 text-foreground">{value}</p>
    </div>
  );
}

export default function TurkishVatCalculator() {
  const [mode, setMode] = useState<Mode>("netToGross");
  const [amount, setAmount] = useState("1.000,00");
  const [rateChoice, setRateChoice] = useState<RateChoice>("20");
  const [customRate, setCustomRate] = useState("18");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const element = document.documentElement;
    const previousLang = element.lang;
    const previousDir = element.dir;
    element.lang = "tr";
    element.dir = "ltr";
    return () => {
      element.lang = previousLang;
      element.dir = previousDir;
    };
  }, []);

  const parsedAmount = useMemo(() => parseTurkishNumber(amount), [amount]);
  const rate = useMemo(() => (rateChoice === "custom" ? parseTurkishNumber(customRate) : Number(rateChoice)), [customRate, rateChoice]);
  const result = useMemo(() => calculateVat(mode, parsedAmount, rate), [mode, parsedAmount, rate]);

  const error = useMemo(() => {
    if (!Number.isFinite(parsedAmount) || parsedAmount < 0) return "Lütfen geçerli bir tutar girin.";
    if (!Number.isFinite(rate) || rate <= 0 || rate > 100) return "KDV oranı 0'dan büyük ve 100'den küçük veya eşit olmalıdır.";
    return "";
  }, [parsedAmount, rate]);

  const resultText = result
    ? [
        "KDV hesaplama türü:",
        result.typeLabel,
        "",
        "KDV hariç:",
        formatMoney(result.base),
        "",
        "KDV oranı:",
        `%${formatPlain(result.rate)}`,
        "",
        "KDV:",
        formatMoney(result.vat),
        "",
        "KDV dahil:",
        formatMoney(result.total),
        "",
        "Formül:",
        result.formula,
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
    setAmount("1.000,00");
    setRateChoice("20");
    setCustomRate("18");
    setCopied(false);
  };

  const schema = [
    {
      "@type": "WebApplication",
      name: "KDV Hesaplama",
      url: canonical,
      applicationCategory: "FinanceApplication",
      operatingSystem: "Any",
      inLanguage: "tr",
      description: "KDV dahil, KDV hariç ve matrah hesaplama aracı.",
    },
    {
      "@type": "WebPage",
      name: "KDV Hesaplama",
      url: canonical,
      inLanguage: "tr",
      description: "KDV dahil veya hariç tutarı, KDV miktarını ve matrahı anında hesaplayın.",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: "https://usonlinetools.com/" },
        { "@type": "ListItem", position: 2, name: "KDV Hesaplama", item: canonical },
      ],
    },
    {
      "@type": "FAQPage",
      inLanguage: "tr",
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
        title="KDV Hesaplama – KDV Dahil, Hariç ve Matrah | US Online Tools"
        description="KDV dahil veya hariç tutarı, KDV miktarını ve matrahı anında hesaplayın. Güncel %1, %10, %20 oranlarını seçin veya özel KDV oranı girin."
        canonical={canonical}
        ogLocale="tr_TR"
        schema={schema}
      />
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8" lang="tr">
        <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/">Ana Sayfa</Link>
          <span>/</span>
          <span>KDV Hesaplama</span>
        </nav>

        <section className="mb-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-bold text-primary">
            <Calculator className="h-4 w-4" />
            KDV Hesaplayıcı
          </div>
          <h1 className="mt-4 text-4xl font-black tracking-normal md:text-6xl">KDV Hesaplama</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">
            KDV hariç fiyata vergi ekleyin, KDV dahil tutarın içindeki matrahı ayırın veya yalnız KDV tutarından toplamı bulun. %1, %10, %20 ya da özel oranla anında hesaplayın.
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-lg border border-border bg-card p-5 shadow-sm md:p-6">
            <h2 className="text-2xl font-black">KDV Hesaplayıcı</h2>
            <div className="mt-5 grid gap-2 rounded-lg bg-muted p-1 sm:grid-cols-3" role="tablist" aria-label="KDV hesaplama türü">
              {[
                ["netToGross", "Hariç → Dahil"],
                ["grossToNet", "Dahil → Hariç"],
                ["vatToBase", "KDV → Matrah"],
              ].map(([value, label]) => (
                <button key={value} type="button" onClick={() => setMode(value as Mode)} className={`rounded-md px-3 py-3 text-sm font-bold ${mode === value ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`} role="tab" aria-selected={mode === value}>
                  {label}
                </button>
              ))}
            </div>

            <div className="mt-5 grid gap-4">
              <label className="grid gap-2">
                <span className="font-bold">{mode === "netToGross" ? "KDV hariç tutar (matrah)" : mode === "grossToNet" ? "KDV dahil tutar" : "KDV tutarı"}</span>
                <input value={amount} onChange={(event) => setAmount(event.target.value)} inputMode="decimal" className="h-12 rounded-lg border border-border bg-background px-4 focus:outline-none focus:ring-2 focus:ring-primary" />
              </label>

              <div className="grid gap-2">
                <span className="font-bold">KDV oranı</span>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    ["20", "%20"],
                    ["10", "%10"],
                    ["1", "%1"],
                    ["custom", "Özel"],
                  ].map(([value, label]) => (
                    <button key={value} type="button" onClick={() => setRateChoice(value as RateChoice)} className={`rounded-lg border px-3 py-3 text-sm font-bold ${rateChoice === value ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-muted"}`}>
                      {label}
                    </button>
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">Doğru oran işlemin türüne göre değişebilir. Gerekirse resmi KDV listelerini kontrol edin.</span>
              </div>

              {rateChoice === "custom" ? (
                <label className="grid gap-2">
                  <span className="font-bold">Özel KDV oranı (%)</span>
                  <input value={customRate} onChange={(event) => setCustomRate(event.target.value)} inputMode="decimal" className="h-12 rounded-lg border border-border bg-background px-4 focus:outline-none focus:ring-2 focus:ring-primary" />
                  <span className="text-sm text-muted-foreground">Eski dönem veya özel hesaplamalar için oranı manuel girebilirsiniz.</span>
                </label>
              ) : null}
            </div>

            {error ? <p className="mt-5 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm font-bold text-destructive">{error}</p> : null}

            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" onClick={copyResult} disabled={!result} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-bold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50">
                <Copy className="h-4 w-4" />
                {copied ? "Kopyalandı" : "Sonucu Kopyala"}
              </button>
              <button type="button" onClick={reset} className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-3 text-sm font-bold hover:bg-muted">
                <RotateCcw className="h-4 w-4" />
                Temizle
              </button>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-5 shadow-sm md:p-6" aria-live="polite">
            <h2 className="text-2xl font-black">Sonuç</h2>
            {result ? (
              <div className="mt-5 space-y-4">
                <div className="rounded-lg border border-primary/20 bg-primary/10 p-5">
                  <p className="text-sm font-bold text-primary">{result.typeLabel}</p>
                  <p className="mt-2 text-3xl font-black leading-tight text-primary">{formatMoney(result.total)}</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <ResultCard label="KDV hariç" value={formatMoney(result.base)} />
                  <ResultCard label="KDV oranı" value={`%${formatPlain(result.rate)}`} />
                  <ResultCard label="KDV tutarı" value={formatMoney(result.vat)} />
                  <ResultCard label="KDV dahil" value={formatMoney(result.total)} />
                </div>
                <div className="rounded-lg bg-muted/40 p-4 text-sm leading-7 text-muted-foreground">
                  <p>KDV hesaplama türü: {result.typeLabel}</p>
                  <p>KDV hariç: {formatMoney(result.base)}</p>
                  <p>KDV oranı: %{formatPlain(result.rate)}</p>
                  <p>KDV: {formatMoney(result.vat)}</p>
                  <p>KDV dahil: {formatMoney(result.total)}</p>
                  <p>Formül: {result.formula}</p>
                </div>
              </div>
            ) : !error ? (
              <p className="mt-5 rounded-lg bg-muted/40 p-4 text-muted-foreground">Geçerli bir tutar ve oran girin.</p>
            ) : null}
          </div>
        </section>

        <section className="mt-10 grid min-w-0 gap-6 [&>article]:min-w-0">
          <article className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-6">
            <h2 className="text-2xl font-black">Bilgilendirme</h2>
            <p className="mt-4 leading-8 text-muted-foreground">
              Bu araç seçtiğiniz oran üzerinden matematiksel KDV hesabı yapar. Hangi KDV oranının belirli bir mal, hizmet veya işleme uygulanması gerektiği güncel mevzuata göre değişebilir. Resmi veya mali kararlar için Gelir İdaresi Başkanlığı'nın güncel düzenlemelerini ve gerektiğinde mali müşavirinizi kontrol edin.
            </p>
            <p className="mt-3 text-sm text-muted-foreground">KDV oranları son kontrol: {rateConfig.lastVerified} — Kaynak: {rateConfig.source}</p>
          </article>

          <article className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-2xl font-black">Türkiye'de Güncel KDV Oranları</h2>
            <p className="mt-4 leading-8 text-muted-foreground">
              Gelir İdaresi Başkanlığı'nın güncel oran kararına göre temel KDV oranları %1, %10 ve %20'dir. Genel oran %20'dir; I sayılı listedeki işlemlerde %1, II sayılı listedeki işlemlerde %10 uygulanır. Hangi oranın geçerli olduğu işlemin niteliğine ve mevzuattaki ilgili listeye göre belirlenir.
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[520px] border-collapse text-left text-sm">
                <thead><tr className="border-b border-border bg-muted/50"><th className="p-3 font-black">Oran</th><th className="p-3 font-black">Açıklama</th></tr></thead>
                <tbody className="divide-y divide-border">
                  <tr><td className="p-3 font-bold">%20</td><td className="p-3 text-muted-foreground">İndirimli listelerde bulunmayan vergiye tabi işlemler için genel oran</td></tr>
                  <tr><td className="p-3 font-bold">%10</td><td className="p-3 text-muted-foreground">II sayılı liste kapsamı</td></tr>
                  <tr><td className="p-3 font-bold">%1</td><td className="p-3 text-muted-foreground">I sayılı liste kapsamı</td></tr>
                </tbody>
              </table>
            </div>
          </article>

          <article className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-2xl font-black">KDV Nedir?</h2>
            <p className="mt-4 leading-8 text-muted-foreground">
              KDV, yani Katma Değer Vergisi, mal teslimleri ve hizmet işlemleri üzerinde uygulanan bir tüketim vergisidir. KDV hariç bir fiyat verildiğinde vergi matrah üzerinden hesaplanarak fiyata eklenir. KDV dahil bir fiyat verildiğinde ise önce matrah ayrılır, ardından vergi tutarı bulunur.
            </p>
          </article>

          <article className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-2xl font-black">KDV Nasıl Hesaplanır?</h2>
            <p className="mt-4 leading-8 text-muted-foreground">KDV = Matrah × KDV Oranı ÷ 100. Örneğin 1.000 TL matrah ve %20 oran için: 1.000 × 20 ÷ 100 = 200 TL. KDV dahil toplam: 1.000 + 200 = 1.200 TL.</p>
          </article>

          <article className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-2xl font-black">KDV Dahil ve KDV Hariç Formülleri</h2>
            <p className="mt-4 leading-8 text-muted-foreground">KDV Dahil = KDV Hariç × (1 + oran/100). Örnek: 1.000 × 1,20 = 1.200 TL.</p>
            <p className="mt-3 leading-8 text-muted-foreground">KDV Hariç = KDV Dahil ÷ (1 + oran/100). Örnek: 1.200 ÷ 1,20 = 1.000 TL; KDV = 1.200 − 1.000 = 200 TL.</p>
          </article>

          <article className="rounded-lg border border-primary/20 bg-primary/5 p-6">
            <h2 className="text-2xl font-black">KDV Dahil Tutardan Neden Doğrudan %20 Çıkarılmaz?</h2>
            <p className="mt-4 leading-8 text-muted-foreground">
              1.200 TL KDV dahil ve oran %20 ise 1.200 × %20 = 240 TL yanlıştır. Doğru yöntem: 1.200 ÷ 1,20 = 1.000 TL matrah; 1.200 − 1.000 = 200 TL KDV. Çünkü %20 oranı KDV dahil toplamdan değil, matrahtan hesaplanmıştır.
            </p>
          </article>

          <article className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-2xl font-black">Matrah ve KDV Tutarından Hesaplama</h2>
            <p className="mt-4 leading-8 text-muted-foreground">Matrah, KDV'nin hesaplandığı vergi öncesi tutardır. Yalnız KDV tutarı biliniyorsa formül: Matrah = KDV × 100 ÷ oran. Örneğin 200 TL KDV ve %20 oran: 200 × 100 ÷ 20 = 1.000 TL.</p>
          </article>

          <article className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-2xl font-black">Özel KDV Oranı</h2>
            <p className="mt-4 leading-8 text-muted-foreground">Özel alan geçmiş dönem veya özel hesaplamalar için kullanılabilir. Örneğin geçmiş dönem hesabı için %18 girilebilir; ancak %18 veya %8 güncel standart oran olarak gösterilmez.</p>
          </article>

          <article className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-2xl font-black">Hangi KDV Oranını Kullanmalıyım?</h2>
            <p className="mt-4 leading-8 text-muted-foreground">Bu araç işlemi hukuken sınıflandırmaz. Geçerli KDV oranı güncel mevzuata ve ilgili listelere bağlıdır. Emin olmadığınız durumda GİB kaynaklarını veya profesyonel muhasebe danışmanlığını kontrol edin.</p>
          </article>

          <article className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-2xl font-black">Örnekler</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[680px] border-collapse text-left text-sm">
                <thead><tr className="border-b border-border bg-muted/50"><th className="p-3 font-black">İşlem</th><th className="p-3 font-black">Formül</th><th className="p-3 text-right font-black">Sonuç</th></tr></thead>
                <tbody className="divide-y divide-border">
                  {[
                    ["1.000 + %20", "1.000 × 1,20", "1.200 TL"],
                    ["1.000 + %10", "1.000 × 1,10", "1.100 TL"],
                    ["1.000 + %1", "1.000 × 1,01", "1.010 TL"],
                    ["1.200 %20 dahil → matrah", "1.200 ÷ 1,20", "1.000 TL"],
                    ["1.100 %10 dahil → matrah", "1.100 ÷ 1,10", "1.000 TL"],
                    ["200 KDV, %20 → matrah", "200 × 100 ÷ 20", "1.000 TL"],
                  ].map(([operation, formula, output]) => (
                    <tr key={operation}>
                      <td className="p-3 font-bold">{operation}</td>
                      <td className="p-3 text-muted-foreground">{formula}</td>
                      <td className="p-3 text-right text-muted-foreground">{output}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>

          <article className="rounded-lg border border-primary/20 bg-primary/5 p-6">
            <h2 className="text-2xl font-black">Kısa Cevaplar</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <div><h3 className="font-black">KDV nasıl hesaplanır?</h3><p className="mt-2 leading-8 text-muted-foreground">KDV hariç tutar × oran ÷ 100. 1.000 TL'nin %20 KDV'si 200 TL'dir.</p></div>
              <div><h3 className="font-black">KDV dahil tutardan KDV nasıl çıkarılır?</h3><p className="mt-2 leading-8 text-muted-foreground">Dahil tutarı 1 + oran/100 değerine bölün, sonra matrahı toplamdan çıkarın.</p></div>
              <div><h3 className="font-black">1.200 TL %20 KDV dahil ise KDV ne kadar?</h3><p className="mt-2 leading-8 text-muted-foreground">200 TL. 1.200 ÷ 1,20 = 1.000; 1.200 − 1.000 = 200.</p></div>
            </div>
          </article>

          <article className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-2xl font-black">Sonuçlar ve Yuvarlama</h2>
            <p className="mt-4 leading-8 text-muted-foreground">Sonuçlar kuruşa göre iki ondalık basamakla gösterilir. Fatura yazılımlarında satır bazlı yuvarlama nedeniyle bazı işlemlerde 1 kuruş fark oluşabilir.</p>
          </article>

          <article className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-2xl font-black">İlgili Araçlar</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href="/yuzde-hesaplama" className="inline-flex rounded-lg border border-border px-4 py-3 font-bold text-primary hover:bg-muted">Yüzde hesaplama</Link>
              <Link href="/kidem-tazminati-hesaplama" className="inline-flex rounded-lg border border-border px-4 py-3 font-bold text-primary hover:bg-muted">Kıdem tazminatı hesaplama</Link>
              <Link href="/category/finance" className="inline-flex rounded-lg border border-border px-4 py-3 font-bold text-primary hover:bg-muted">Finans araçları</Link>
            </div>
          </article>

          <article className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-2xl font-black">Sık Sorulan Sorular</h2>
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
