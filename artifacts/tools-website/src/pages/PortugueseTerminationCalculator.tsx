import { type ReactNode, useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { Calculator, Copy, RotateCcw } from "lucide-react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { brazilLaborTax2026, calculateBrazilInss2026 } from "@/data/laborData/brazil/2026";

const canonical = "https://usonlinetools.com/calculo-rescisao";

const laborConfig = brazilLaborTax2026;

type TerminationType = "withoutCause" | "resignation" | "agreement" | "forCause";
type NoticeMode = "indemnified" | "worked" | "waived" | "discounted" | "notApplicable";
type PlainDate = { year: number; month: number; day: number };

const terminationTypes: Record<TerminationType, { label: string; short: string }> = {
  withoutCause: { label: "Dispensa sem justa causa", short: "saldo, aviso, 13º, férias e multa de 40% do FGTS" },
  resignation: { label: "Pedido de demissão", short: "saldo, 13º e férias; aviso pode virar desconto" },
  agreement: { label: "Acordo trabalhista (art. 484-A)", short: "metade do aviso indenizado e multa de 20% do FGTS" },
  forCause: { label: "Dispensa por justa causa", short: "saldo e férias vencidas, quando houver" },
};

const faqs = [
  ["A calculadora mostra o valor líquido da rescisão?", "Ela estima o pagamento líquido feito pela empresa depois de INSS, IRRF e descontos informados. A multa do FGTS fica separada porque normalmente não é paga junto no TRCT."],
  ["Qual base devo informar para a multa do FGTS?", "Informe a base total dos depósitos de FGTS do contrato, não apenas o saldo atual da conta. Se deixar em branco, a multa não é calculada para evitar uma estimativa enganosa."],
  ["Como o aviso prévio é calculado?", "A ferramenta usa 30 dias e acrescenta 3 dias por ano completo trabalhado, limitado a 90 dias, conforme a Lei 12.506/2011. No acordo do art. 484-A, o aviso indenizado entra pela metade."],
  ["Pedido de demissão tem multa de 40% do FGTS?", "Não. Em regra, pedido de demissão não gera multa de 40% nem saque integral do FGTS. Se o aviso não for cumprido, pode haver desconto conforme a situação."],
  ["Justa causa recebe 13º e férias proporcionais?", "A estimativa trata justa causa de forma conservadora: saldo de salário e férias vencidas com 1/3 quando informadas, sem aviso, 13º proporcional, férias proporcionais ou multa do FGTS."],
  ["INSS e IRRF estão atualizados para 2026?", `Esta página usa as tabelas configuradas para 2026 e revisão em ${laborConfig.lastVerified}. Confirme alterações legais, acordos coletivos e regras internas antes de usar o valor em decisão formal.`],
];

const howToSteps = [
  ["Informe salário e datas", "Digite o último salário bruto, a data de admissão e a data de desligamento para definir saldo de salário, tempo de serviço e avos proporcionais."],
  ["Escolha o tipo de rescisão", "Selecione dispensa sem justa causa, pedido de demissão, acordo trabalhista ou justa causa para aplicar as verbas compatíveis com cada cenário."],
  ["Revise aviso prévio e FGTS", "Ajuste o aviso prévio e informe a base total de depósitos do FGTS quando quiser estimar a multa separada do pagamento da empresa."],
  ["Use campos avançados se necessário", "Inclua adicionais habituais, médias, férias vencidas, dependentes, descontos e adiantamentos quando esses itens existirem na folha."],
  ["Confira a memória de cálculo", "Leia o líquido estimado, proventos, descontos, multa do FGTS e observações antes de usar o resultado em conferência trabalhista."],
];

const relatedTools = [
  { href: "/calculo-ferias", label: "Calculadora de férias CLT" },
  { href: "/calculadora-juros-compostos", label: "Calculadora de juros compostos" },
  { href: "/category/finance", label: "Ferramentas financeiras" },
];

const brl = (value: number) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const numberFmt = (value: number) => value.toLocaleString("pt-BR", { maximumFractionDigits: 2 });

function parseMoney(value: string): number {
  const clean = value.replace(/\s/g, "").replace(/[R$]/g, "");
  const normalized = clean.includes(",") ? clean.replace(/\./g, "").replace(",", ".") : clean;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function parseOptionalMoney(value: string): number | null {
  if (!value.trim()) return null;
  return parseMoney(value);
}

function parsePlainDate(value: string): PlainDate | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const [, y, m, d] = match;
  const date = { year: Number(y), month: Number(m), day: Number(d) };
  const js = new Date(Date.UTC(date.year, date.month - 1, date.day));
  if (js.getUTCFullYear() !== date.year || js.getUTCMonth() + 1 !== date.month || js.getUTCDate() !== date.day) return null;
  return date;
}

function toUtc(date: PlainDate) {
  return Date.UTC(date.year, date.month - 1, date.day);
}

function compareDate(a: PlainDate, b: PlainDate) {
  return toUtc(a) - toUtc(b);
}

function addDays(date: PlainDate, days: number): PlainDate {
  const js = new Date(toUtc(date));
  js.setUTCDate(js.getUTCDate() + days);
  return { year: js.getUTCFullYear(), month: js.getUTCMonth() + 1, day: js.getUTCDate() };
}

function addYears(date: PlainDate, years: number): PlainDate {
  const target = new Date(Date.UTC(date.year + years, date.month - 1, date.day));
  if (target.getUTCMonth() + 1 !== date.month) return { year: date.year + years, month: 2, day: 28 };
  return { year: target.getUTCFullYear(), month: target.getUTCMonth() + 1, day: target.getUTCDate() };
}

function completeYears(start: PlainDate, end: PlainDate) {
  let years = end.year - start.year;
  if (end.month < start.month || (end.month === start.month && end.day < start.day)) years -= 1;
  return Math.max(0, years);
}

function daysInMonth(year: number, month: number) {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

function overlapDaysInclusive(start: PlainDate, end: PlainDate, monthStart: PlainDate, monthEnd: PlainDate) {
  const from = Math.max(toUtc(start), toUtc(monthStart));
  const to = Math.min(toUtc(end), toUtc(monthEnd));
  if (to < from) return 0;
  return Math.floor((to - from) / 86_400_000) + 1;
}

function thirteenthTwelfths(start: PlainDate, end: PlainDate) {
  let count = 0;
  for (let month = 1; month <= end.month; month += 1) {
    const monthStart = { year: end.year, month, day: 1 };
    const monthEnd = { year: end.year, month, day: daysInMonth(end.year, month) };
    if (overlapDaysInclusive(start, end, monthStart, monthEnd) >= 15) count += 1;
  }
  return Math.min(12, count);
}

function vacationTwelfths(start: PlainDate, end: PlainDate) {
  const years = completeYears(start, end);
  const periodStart = addYears(start, years);
  let count = 0;
  let cursor = { ...periodStart };
  for (let i = 0; i < 12; i += 1) {
    const monthStart = { year: cursor.year, month: cursor.month, day: 1 };
    const monthEnd = { year: cursor.year, month: cursor.month, day: daysInMonth(cursor.year, cursor.month) };
    if (overlapDaysInclusive(periodStart, end, monthStart, monthEnd) >= 15) count += 1;
    const next = new Date(Date.UTC(cursor.year, cursor.month, 1));
    cursor = { year: next.getUTCFullYear(), month: next.getUTCMonth() + 1, day: 1 };
    if (compareDate(cursor, end) > 0) break;
  }
  return Math.min(12, count);
}

function calculateNoticeDays(start: PlainDate, end: PlainDate, override: string) {
  const custom = Number(override);
  if (Number.isFinite(custom) && custom > 0) return Math.min(90, Math.round(custom));
  return Math.min(90, 30 + completeYears(start, end) * 3);
}

function calculateInss(gross: number) {
  return calculateBrazilInss2026(gross);
}

function calculateIrrf(grossTaxable: number, inss: number, dependents: number) {
  const base = Math.max(0, grossTaxable - inss - dependents * laborConfig.dependentDeduction);
  const band = laborConfig.irrfBands.find((item) => base <= item.upTo) ?? laborConfig.irrfBands.at(-1)!;
  const raw = Math.max(0, base * band.rate - band.deduction);
  let reduction = 0;
  if (grossTaxable <= laborConfig.irrfReduction.fullUntil) {
    reduction = raw;
  } else if (grossTaxable <= laborConfig.irrfReduction.partialUntil) {
    reduction = Math.max(0, laborConfig.irrfReduction.fixed - laborConfig.irrfReduction.factor * grossTaxable);
  }
  return { base, raw, reduction: Math.min(raw, reduction), due: Math.max(0, raw - reduction) };
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

export default function PortugueseTerminationCalculator() {
  const [salary, setSalary] = useState("4.200,00");
  const [admissionDate, setAdmissionDate] = useState("2022-01-10");
  const [terminationDate, setTerminationDate] = useState("2026-09-05");
  const [terminationType, setTerminationType] = useState<TerminationType>("withoutCause");
  const [noticeMode, setNoticeMode] = useState<NoticeMode>("indemnified");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [habitualAdditions, setHabitualAdditions] = useState("0");
  const [variableAverage, setVariableAverage] = useState("0");
  const [expiredVacationPeriods, setExpiredVacationPeriods] = useState("0");
  const [fgtsBase, setFgtsBase] = useState("18.000,00");
  const [dependents, setDependents] = useState("0");
  const [otherTaxable, setOtherTaxable] = useState("0");
  const [otherExempt, setOtherExempt] = useState("0");
  const [otherDiscounts, setOtherDiscounts] = useState("0");
  const [thirteenthAdvance, setThirteenthAdvance] = useState("0");
  const [salaryAdvance, setSalaryAdvance] = useState("0");
  const [vacationAlreadyPaid, setVacationAlreadyPaid] = useState("0");
  const [noticeOverride, setNoticeOverride] = useState("");
  const [thirteenthOverride, setThirteenthOverride] = useState("");
  const [vacationOverride, setVacationOverride] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const previousLang = root.lang;
    root.lang = "pt-BR";
    return () => {
      root.lang = previousLang;
    };
  }, []);

  useEffect(() => {
    if (terminationType === "resignation") setNoticeMode("waived");
    if (terminationType === "forCause") setNoticeMode("notApplicable");
    if (terminationType === "agreement") setNoticeMode("indemnified");
  }, [terminationType]);

  const result = useMemo(() => {
    const start = parsePlainDate(admissionDate);
    const end = parsePlainDate(terminationDate);
    const baseSalary = parseMoney(salary);
    if (!start || !end || compareDate(start, end) > 0 || baseSalary <= 0) return null;

    const baseRemuneration = baseSalary + parseMoney(habitualAdditions) + parseMoney(variableAverage);
    const workedDays = Math.min(30, Math.max(0, end.day));
    const salaryBalance = (baseRemuneration / 30) * workedDays;
    const noticeDays = terminationType === "forCause" ? 0 : calculateNoticeDays(start, end, noticeOverride);
    const projectsNotice = (terminationType === "withoutCause" || terminationType === "agreement") && noticeMode === "indemnified";
    const projectedEnd = projectsNotice ? addDays(end, noticeDays) : end;
    const rawThirteenthAvos = thirteenthTwelfths(start, projectedEnd);
    const rawVacationAvos = vacationTwelfths(start, projectedEnd);
    const thirteenthAvos = Math.min(12, Math.max(0, Number(thirteenthOverride) || rawThirteenthAvos));
    const vacationAvos = Math.min(12, Math.max(0, Number(vacationOverride) || rawVacationAvos));
    const expiredPeriods = Math.max(0, Math.floor(Number(expiredVacationPeriods) || 0));
    const dependencyCount = Math.max(0, Math.floor(Number(dependents) || 0));

    const hasNoticePay = noticeMode === "indemnified" && (terminationType === "withoutCause" || terminationType === "agreement");
    const noticeGrossFull = hasNoticePay ? (baseRemuneration / 30) * noticeDays : 0;
    const noticeGross = terminationType === "agreement" ? noticeGrossFull / 2 : noticeGrossFull;
    const noticeDiscount = terminationType === "resignation" && noticeMode === "discounted" ? (baseRemuneration / 30) * 30 : 0;

    const thirteenthGross = terminationType === "forCause" ? 0 : (baseRemuneration / 12) * thirteenthAvos;
    const proportionalVacation = terminationType === "forCause" ? 0 : (baseRemuneration / 12) * vacationAvos;
    const proportionalVacationThird = proportionalVacation / 3;
    const expiredVacation = expiredPeriods * baseRemuneration;
    const expiredVacationThird = expiredVacation / 3;
    const taxableExtras = parseMoney(otherTaxable);
    const exemptExtras = parseMoney(otherExempt);
    const discounts = parseMoney(otherDiscounts) + parseMoney(thirteenthAdvance) + parseMoney(salaryAdvance) + parseMoney(vacationAlreadyPaid) + noticeDiscount;

    const ordinaryTaxable = salaryBalance + taxableExtras;
    const inssSalary = calculateInss(ordinaryTaxable);
    const irrfSalary = calculateIrrf(ordinaryTaxable, inssSalary, dependencyCount);
    const inssThirteenth = calculateInss(thirteenthGross);
    const irrfThirteenth = calculateIrrf(thirteenthGross, inssThirteenth, dependencyCount);

    const employerGross =
      salaryBalance +
      noticeGross +
      thirteenthGross +
      proportionalVacation +
      proportionalVacationThird +
      expiredVacation +
      expiredVacationThird +
      taxableExtras +
      exemptExtras;
    const statutoryDeductions = inssSalary + inssThirteenth + irrfSalary.due + irrfThirteenth.due;
    const manualDiscounts = discounts;
    const employerNet = Math.max(0, employerGross - statutoryDeductions - manualDiscounts);
    const fgtsPenaltyBase = parseOptionalMoney(fgtsBase);
    const fgtsRate = terminationType === "withoutCause" ? laborConfig.fgtsRates.withoutCause : terminationType === "agreement" ? laborConfig.fgtsRates.agreement : 0;
    const fgtsPenalty = fgtsPenaltyBase === null || fgtsRate === 0 ? null : fgtsPenaltyBase * fgtsRate;

    return {
      baseRemuneration,
      workedDays,
      serviceYears: completeYears(start, end),
      noticeDays,
      thirteenthAvos,
      vacationAvos,
      salaryBalance,
      noticeGross,
      thirteenthGross,
      proportionalVacation,
      proportionalVacationThird,
      expiredVacation,
      expiredVacationThird,
      inssSalary,
      inssThirteenth,
      irrfSalary,
      irrfThirteenth,
      employerGross,
      statutoryDeductions,
      manualDiscounts,
      employerNet,
      fgtsPenalty,
      fgtsRate,
      informativeTotal: employerNet + (fgtsPenalty ?? 0),
    };
  }, [admissionDate, dependents, expiredVacationPeriods, fgtsBase, habitualAdditions, noticeMode, noticeOverride, otherDiscounts, otherExempt, otherTaxable, salary, salaryAdvance, terminationDate, terminationType, thirteenthAdvance, thirteenthOverride, vacationAlreadyPaid, vacationOverride, variableAverage]);

  const reset = () => {
    setSalary("4.200,00");
    setAdmissionDate("2022-01-10");
    setTerminationDate("2026-09-05");
    setTerminationType("withoutCause");
    setNoticeMode("indemnified");
    setHabitualAdditions("0");
    setVariableAverage("0");
    setExpiredVacationPeriods("0");
    setFgtsBase("18.000,00");
    setDependents("0");
    setOtherTaxable("0");
    setOtherExempt("0");
    setOtherDiscounts("0");
    setThirteenthAdvance("0");
    setSalaryAdvance("0");
    setVacationAlreadyPaid("0");
    setNoticeOverride("");
    setThirteenthOverride("");
    setVacationOverride("");
    setCopied(false);
  };

  const copyResult = async () => {
    if (!result) return;
    const text = [
      "Calculadora de Rescisão CLT - US Online Tools",
      `Tipo: ${terminationTypes[terminationType].label}`,
      `Base remuneratória: ${brl(result.baseRemuneration)}`,
      `Pagamento estimado pela empresa: ${brl(result.employerNet)}`,
      `Multa FGTS: ${result.fgtsPenalty === null ? "não calculada" : brl(result.fgtsPenalty)}`,
      `Aviso prévio: ${result.noticeDays} dias`,
      `13º proporcional: ${result.thirteenthAvos}/12`,
      `Férias proporcionais: ${result.vacationAvos}/12`,
    ].join("\n");
    await navigator.clipboard?.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const schema = [
    { "@context": "https://schema.org", "@type": "WebApplication", name: "Calculadora de Rescisão Trabalhista CLT", url: canonical, applicationCategory: "FinanceApplication", operatingSystem: "Any", inLanguage: "pt-BR", description: "Calculadora brasileira de rescisão CLT com aviso prévio, 13º, férias, INSS, IRRF e multa do FGTS separada." },
    { "@context": "https://schema.org", "@type": "WebPage", name: "Calculadora de Rescisão CLT 2026", url: canonical, inLanguage: "pt-BR", dateModified: "2026-09-06", isAccessibleForFree: true },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Início", item: "https://usonlinetools.com/" }, { "@type": "ListItem", position: 2, name: "Finanças", item: "https://usonlinetools.com/category/finance" }, { "@type": "ListItem", position: 3, name: "Calculadora de Rescisão", item: canonical }] },
    { "@context": "https://schema.org", "@type": "HowTo", name: "Como usar a calculadora de rescisão CLT", inLanguage: "pt-BR", step: howToSteps.map(([name, text], index) => ({ "@type": "HowToStep", position: index + 1, name, text })) },
    { "@context": "https://schema.org", "@type": "FAQPage", inLanguage: "pt-BR", mainEntity: faqs.map(([question, answer]) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })) },
  ];

  const rowData = result
    ? [
        ["Saldo de salário", brl(result.salaryBalance), `${result.workedDays} dia(s) no mês de desligamento`],
        ["Aviso prévio indenizado", brl(result.noticeGross), `${result.noticeDays} dia(s); acordo paga metade quando indenizado`],
        ["13º proporcional", brl(result.thirteenthGross), `${result.thirteenthAvos}/12 avos considerados`],
        ["Férias proporcionais + 1/3", brl(result.proportionalVacation + result.proportionalVacationThird), `${result.vacationAvos}/12 avos considerados`],
        ["Férias vencidas + 1/3", brl(result.expiredVacation + result.expiredVacationThird), "conforme períodos informados"],
        ["INSS total estimado", `-${brl(result.inssSalary + result.inssThirteenth)}`, "salário/verbais tributáveis e 13º em bases separadas"],
        ["IRRF total estimado", `-${brl(result.irrfSalary.due + result.irrfThirteenth.due)}`, "com dedução por dependentes e redução 2026"],
        ["Descontos informados", `-${brl(result.manualDiscounts)}`, "adiantamentos, férias já pagas, outros descontos e aviso descontado"],
      ]
    : [];

  return (
    <Layout>
      <SEO title="Calculadora de Rescisão CLT 2026 | US Online Tools" description="Calcule rescisão trabalhista CLT com salário, datas, aviso prévio, 13º, férias, INSS, IRRF e multa do FGTS separada." canonical={canonical} schema={schema} />
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary">Início</Link><span>/</span><Link href="/category/finance" className="hover:text-primary">Finanças</Link><span>/</span><span>Calculadora de Rescisão</span>
        </nav>

        <section className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-secondary/10 p-6 md:p-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-black uppercase tracking-wide text-primary"><Calculator className="h-4 w-4" /> CLT 2026</div>
          <h1 className="mt-5 text-4xl font-black tracking-tight md:text-6xl">Calculadora de Rescisão Trabalhista CLT</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">Estime a rescisão de contrato no Brasil por dispensa sem justa causa, pedido de demissão, acordo trabalhista ou justa causa. O resultado separa o pagamento da empresa, descontos, INSS/IRRF e multa do FGTS.</p>
          <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
            {Object.values(terminationTypes).map((type) => <div key={type.label} className="rounded-xl border border-border bg-background/70 p-3"><p className="font-black">{type.label}</p><p className="mt-1 text-muted-foreground">{type.short}</p></div>)}
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm md:p-7">
            <h2 className="text-2xl font-black">Dados do contrato</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="Último salário bruto"><input value={salary} onChange={(event) => setSalary(event.target.value)} inputMode="decimal" className="h-12 rounded-lg border border-border bg-background px-4" /></Field>
              <Field label="Tipo de rescisão"><select value={terminationType} onChange={(event) => setTerminationType(event.target.value as TerminationType)} className="h-12 rounded-lg border border-border bg-background px-4">{Object.entries(terminationTypes).map(([value, type]) => <option key={value} value={value}>{type.label}</option>)}</select></Field>
              <Field label="Data de admissão"><input type="date" value={admissionDate} onChange={(event) => setAdmissionDate(event.target.value)} className="h-12 rounded-lg border border-border bg-background px-4" /></Field>
              <Field label="Data de desligamento"><input type="date" value={terminationDate} onChange={(event) => setTerminationDate(event.target.value)} className="h-12 rounded-lg border border-border bg-background px-4" /></Field>
              <Field label="Aviso prévio" note="Indenizado projeta avos para dispensa e acordo; pedido pode ter desconto se não cumprido."><select value={noticeMode} onChange={(event) => setNoticeMode(event.target.value as NoticeMode)} className="h-12 rounded-lg border border-border bg-background px-4"><option value="indemnified">Indenizado</option><option value="worked">Trabalhado</option><option value="waived">Dispensado/sem desconto</option><option value="discounted">Descontar aviso no pedido</option><option value="notApplicable">Não aplicável</option></select></Field>
              <Field label="Base para multa do FGTS" note="Use a base total dos depósitos do contrato. Deixe em branco para não calcular a multa."><input value={fgtsBase} onChange={(event) => setFgtsBase(event.target.value)} inputMode="decimal" className="h-12 rounded-lg border border-border bg-background px-4" /></Field>
            </div>

            <button type="button" onClick={() => setShowAdvanced((value) => !value)} className="mt-5 rounded-lg border border-border px-4 py-2 text-sm font-bold">{showAdvanced ? "Ocultar campos avançados" : "Mostrar campos avançados"}</button>

            {showAdvanced ? (
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Field label="Adicionais habituais"><input value={habitualAdditions} onChange={(event) => setHabitualAdditions(event.target.value)} inputMode="decimal" className="h-12 rounded-lg border border-border bg-background px-4" /></Field>
                <Field label="Média de horas extras/comissões"><input value={variableAverage} onChange={(event) => setVariableAverage(event.target.value)} inputMode="decimal" className="h-12 rounded-lg border border-border bg-background px-4" /></Field>
                <Field label="Férias vencidas (períodos)"><input value={expiredVacationPeriods} onChange={(event) => setExpiredVacationPeriods(event.target.value)} inputMode="numeric" className="h-12 rounded-lg border border-border bg-background px-4" /></Field>
                <Field label="Dependentes para IRRF"><input value={dependents} onChange={(event) => setDependents(event.target.value)} inputMode="numeric" className="h-12 rounded-lg border border-border bg-background px-4" /></Field>
                <Field label="Outros proventos tributáveis"><input value={otherTaxable} onChange={(event) => setOtherTaxable(event.target.value)} inputMode="decimal" className="h-12 rounded-lg border border-border bg-background px-4" /></Field>
                <Field label="Outros proventos indenizatórios/isentos"><input value={otherExempt} onChange={(event) => setOtherExempt(event.target.value)} inputMode="decimal" className="h-12 rounded-lg border border-border bg-background px-4" /></Field>
                <Field label="Outros descontos"><input value={otherDiscounts} onChange={(event) => setOtherDiscounts(event.target.value)} inputMode="decimal" className="h-12 rounded-lg border border-border bg-background px-4" /></Field>
                <Field label="Adiantamento de 13º"><input value={thirteenthAdvance} onChange={(event) => setThirteenthAdvance(event.target.value)} inputMode="decimal" className="h-12 rounded-lg border border-border bg-background px-4" /></Field>
                <Field label="Adiantamento salarial"><input value={salaryAdvance} onChange={(event) => setSalaryAdvance(event.target.value)} inputMode="decimal" className="h-12 rounded-lg border border-border bg-background px-4" /></Field>
                <Field label="Férias já pagas"><input value={vacationAlreadyPaid} onChange={(event) => setVacationAlreadyPaid(event.target.value)} inputMode="decimal" className="h-12 rounded-lg border border-border bg-background px-4" /></Field>
                <Field label="Aviso prévio manual (dias)"><input value={noticeOverride} onChange={(event) => setNoticeOverride(event.target.value)} inputMode="numeric" placeholder="automático" className="h-12 rounded-lg border border-border bg-background px-4" /></Field>
                <Field label="13º manual (avos)"><input value={thirteenthOverride} onChange={(event) => setThirteenthOverride(event.target.value)} inputMode="numeric" placeholder="automático" className="h-12 rounded-lg border border-border bg-background px-4" /></Field>
                <Field label="Férias proporcionais manuais (avos)"><input value={vacationOverride} onChange={(event) => setVacationOverride(event.target.value)} inputMode="numeric" placeholder="automático" className="h-12 rounded-lg border border-border bg-background px-4" /></Field>
              </div>
            ) : null}

            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" onClick={copyResult} disabled={!result} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-black text-primary-foreground disabled:opacity-50"><Copy className="h-4 w-4" /> {copied ? "Copiado" : "Copiar resumo"}</button>
              <button type="button" onClick={reset} className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-bold"><RotateCcw className="h-4 w-4" /> Restaurar exemplo</button>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm md:p-7" aria-live="polite">
            <h2 className="text-2xl font-black">Resultado estimado</h2>
            {result ? (
              <>
                <div className="mt-5 rounded-2xl border border-primary/30 bg-primary/10 p-5"><p className="text-sm font-bold text-muted-foreground">Pagamento líquido estimado pela empresa</p><p className="mt-2 text-4xl font-black text-primary">{brl(result.employerNet)}</p><p className="mt-2 text-sm leading-6 text-muted-foreground">Este valor não soma automaticamente saque do FGTS. A multa do FGTS aparece separada abaixo.</p></div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <InfoCard label="Proventos brutos" value={brl(result.employerGross)} note="Inclui verbas trabalhistas e campos extras informados." />
                  <InfoCard label="Descontos totais" value={brl(result.statutoryDeductions + result.manualDiscounts)} note="INSS, IRRF e descontos manuais." />
                  <InfoCard label="Multa do FGTS" value={result.fgtsPenalty === null ? "Não calculada" : brl(result.fgtsPenalty)} note={result.fgtsPenalty === null ? "Informe a base de FGTS para estimar." : `${numberFmt(result.fgtsRate * 100)}% sobre a base informada.`} />
                  <InfoCard label="Total informativo" value={brl(result.informativeTotal)} note="Pagamento da empresa + multa FGTS, apenas para visão de caixa." />
                </div>
                <div className="mt-5 rounded-xl bg-muted/40 p-4 text-sm leading-7">
                  <p><strong>Aviso:</strong> {result.noticeDays} dias. <strong>Tempo completo:</strong> {result.serviceYears} ano(s). <strong>Base remuneratória:</strong> {brl(result.baseRemuneration)}.</p>
                  {terminationType === "agreement" ? <p>Em acordo trabalhista, a multa estimada é de 20% e o saque do FGTS costuma ser limitado a 80% do saldo disponível.</p> : null}
                  {terminationType === "resignation" ? <p>Pedido de demissão não inclui multa do FGTS. Se o aviso for descontado, a ferramenta usa 30 dias como referência.</p> : null}
                  {terminationType === "forCause" ? <p>Justa causa foi tratada de forma restritiva: sem aviso, 13º proporcional, férias proporcionais e multa de FGTS.</p> : null}
                </div>
              </>
            ) : <p className="mt-5 rounded-lg bg-destructive/10 p-4 text-sm text-destructive">Confira salário e datas. A data de admissão precisa ser anterior ou igual à data de desligamento.</p>}
          </div>
        </section>

        {result ? (
          <section className="mt-8 rounded-2xl border border-border bg-card p-5 md:p-7">
            <h2 className="text-2xl font-black">Memória de cálculo</h2>
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead><tr className="border-b border-border text-muted-foreground"><th className="py-3 pr-4">Verba</th><th className="py-3 pr-4">Valor</th><th className="py-3">Observação</th></tr></thead>
                <tbody>{rowData.map(([label, value, note]) => <tr key={label} className="border-b border-border/60"><td className="py-3 pr-4 font-bold">{label}</td><td className="py-3 pr-4">{value}</td><td className="py-3 text-muted-foreground">{note}</td></tr>)}</tbody>
              </table>
            </div>
          </section>
        ) : null}

        <section className="mt-8 grid min-w-0 gap-6 lg:grid-cols-2 [&>article]:min-w-0">
          <article className="rounded-2xl border border-border bg-card p-6"><h2 className="text-2xl font-black">Como calcular rescisão CLT</h2><p className="mt-4 leading-8 text-muted-foreground">O cálculo começa pela base remuneratória: salário bruto, adicionais habituais e médias de verbas variáveis quando elas integram a remuneração. Depois entram saldo de salário, aviso prévio quando devido, 13º proporcional, férias vencidas ou proporcionais com o terço constitucional e eventuais verbas indenizatórias.</p><p className="mt-3 leading-8 text-muted-foreground">O motivo do desligamento altera o pacote de direitos. A dispensa sem justa causa é a situação mais ampla. Pedido de demissão remove a multa do FGTS e pode gerar desconto de aviso. Acordo trabalhista reduz aviso indenizado e multa. Justa causa é mais limitada.</p></article>
          <article className="rounded-2xl border border-border bg-card p-6"><h2 className="text-2xl font-black">INSS, IRRF e FGTS</h2><p className="mt-4 leading-8 text-muted-foreground">INSS e IRRF são estimados em bases separadas para verbas mensais e 13º. A tabela de IRRF aplica dedução por dependente e a redução mensal de 2026. Férias indenizadas e aviso indenizado podem ter tratamentos específicos conforme entendimento, sistema de folha e natureza da verba; por isso a página é uma estimativa.</p><p className="mt-3 leading-8 text-muted-foreground">A multa do FGTS depende da base histórica de depósitos do contrato. Ela não deve ser confundida com o saldo líquido pago pela empresa no termo de rescisão.</p></article>
        </section>

        <section className="mt-8 rounded-2xl border border-border bg-card p-6">
          <h2 className="text-2xl font-black">Como usar a calculadora</h2>
          <ol className="mt-5 grid gap-4 md:grid-cols-2">
            {howToSteps.map(([title, text]) => (
              <li key={title} className="rounded-xl border border-border bg-background p-4">
                <h3 className="font-black">{title}</h3>
                <p className="mt-2 leading-7 text-muted-foreground">{text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-8 rounded-2xl border border-border bg-card p-6">
          <h2 className="text-2xl font-black">Tabela rápida por tipo de rescisão</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">{Object.entries(terminationTypes).map(([key, type]) => <div key={key} className="rounded-xl border border-border bg-background p-4"><h3 className="font-black">{type.label}</h3><p className="mt-2 leading-7 text-muted-foreground">{type.short}. Use os campos avançados para ajustar avos, médias salariais, descontos e verbas já pagas.</p></div>)}</div>
        </section>

        <section className="mt-8 rounded-2xl border border-border bg-card p-6">
          <h2 className="text-2xl font-black">Fontes, atualização e limites</h2>
          <p className="mt-4 leading-8 text-muted-foreground">Regras configuradas em {laborConfig.lastVerified}. A ferramenta segue a estrutura geral da CLT, a regra de aviso prévio proporcional da Lei 12.506/2011, parâmetros de IRRF 2026 da Receita Federal e percentuais usuais de multa do FGTS para rescisões sem justa causa e acordo trabalhista.</p>
          <p className="mt-3 leading-8 text-muted-foreground">Não substitui cálculo oficial do RH, contador, advogado trabalhista ou sindicato. Convenção coletiva, estabilidade, adicionais, faltas, afastamentos, férias gozadas, rubricas de folha e decisões judiciais podem mudar o valor final. Para férias tiradas durante contrato ativo, use a <Link href="/calculo-ferias" className="font-bold text-primary underline">calculadora de férias</Link>.</p>
        </section>

        <section className="mt-8 rounded-2xl border border-border bg-card p-6">
          <h2 className="text-2xl font-black">Ferramentas relacionadas</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {relatedTools.map((tool) => (
              <Link key={tool.href} href={tool.href} className="rounded-xl border border-border bg-background p-4 font-bold text-primary underline-offset-4 hover:underline">
                {tool.label}
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-border bg-card p-6">
          <h2 className="text-2xl font-black">Perguntas frequentes</h2>
          <div className="mt-5 space-y-5">{faqs.map(([question, answer]) => <div key={question}><h3 className="font-black">{question}</h3><p className="mt-1 leading-8 text-muted-foreground">{answer}</p></div>)}</div>
        </section>
      </main>
    </Layout>
  );
}
