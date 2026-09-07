import { type ReactNode, useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { Calculator, Copy, RotateCcw } from "lucide-react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { brazilLaborTax2026, calculateBrazilInss2026, calculateBrazilIrrf2026 } from "@/data/laborData/brazil/2026";

const canonical = "https://usonlinetools.com/calculo-ferias";
type Mode = "taken" | "proportional";
type EntitlementId = (typeof brazilLaborTax2026.vacation.absenceEntitlement)[number]["id"];

const faqs = [
  ["Como calcular férias?", "Para férias integrais de 30 dias, some o salário ao adicional de 1/3 e depois aplique INSS e IRRF quando devidos."],
  ["Quanto recebo de férias com salário de R$ 3.000?", "Antes dos descontos, 30 dias integrais correspondem a R$ 3.000,00 + R$ 1.000,00 de 1/3 = R$ 4.000,00."],
  ["Como calcular 1/3 de férias?", "Divida o valor das férias por 3. Se a remuneração das férias é R$ 3.000,00, o terço é R$ 1.000,00."],
  ["Posso vender 10 dias de férias?", "Se você tiver direito a 30 dias, pode converter até um terço, ou seja, 10 dias, em abono pecuniário."],
  ["Se eu tiver direito a menos de 30 dias, posso vender 10?", "Não necessariamente. O limite acompanha um terço do período a que você tem direito: 24 dias permitem até 8, 18 permitem até 6 e 12 permitem até 4."],
  ["Abono pecuniário paga INSS?", "Nesta estimativa, o principal do abono é tratado como indenizatório e fica fora da base de INSS. O 1/3 do abono é separado para evitar simplificação indevida."],
  ["Abono pecuniário paga IRRF?", "O principal do abono não entra na base de IRRF. O 1/3 relacionado ao abono é tratado separadamente e pode compor a tributação do IRRF."],
  ["Férias têm desconto de INSS?", "Férias gozadas e o 1/3 correspondente entram na base previdenciária conforme as regras operacionais aplicáveis."],
  ["Férias têm desconto de Imposto de Renda?", "Podem ter. O IRRF das férias é calculado separadamente de outros rendimentos pagos no mês."],
  ["Quando a empresa deve pagar as férias?", "O pagamento das férias e do abono, quando houver, deve ocorrer até 2 dias antes do início do período."],
  ["Esta calculadora serve para férias na rescisão?", "Esta página é para férias gozadas durante o contrato. Para férias indenizadas no desligamento, use a calculadora de rescisão."],
  ["Meus valores são armazenados?", "Não. O cálculo é feito no navegador; a página não precisa de CPF, nome, empresa, e-mail ou telefone."],
];

const howToSteps = [
  ["Informe a remuneração", "Digite o salário bruto mensal e inclua médias ou adicionais habituais nos campos avançados quando eles fizerem parte da base de férias."],
  ["Escolha o cenário", "Use férias gozadas para pagamento durante contrato ativo ou estimativa proporcional para calcular meses acumulados."],
  ["Revise faltas e dias", "Selecione a faixa de faltas injustificadas, informe os dias de férias e, se for o caso, os dias convertidos em abono pecuniário."],
  ["Confira impostos e adicionais", "Revise INSS, IRRF, dependentes, redução de 2026, 1/3 constitucional e eventual adiantamento da primeira parcela do 13º."],
  ["Leia a memória de cálculo", "Use a tabela para conferir base diária, férias, abono, descontos e alertas antes de comparar com o recibo da empresa."],
];

const relatedTools = [
  { href: "/calculo-rescisao", label: "Calculadora de rescisão CLT" },
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

function entitlementDays(id: EntitlementId) {
  return brazilLaborTax2026.vacation.absenceEntitlement.find((item) => item.id === id)?.days ?? 30;
}

function maxAbonoDays(entitledDays: number) {
  return Math.floor(entitledDays * brazilLaborTax2026.vacation.maxAbonoFraction);
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

export default function PortugueseVacationCalculator() {
  const [mode, setMode] = useState<Mode>("taken");
  const [salary, setSalary] = useState("3.000,00");
  const [absenceBracket, setAbsenceBracket] = useState<EntitlementId>("0-5");
  const [manualEntitlement, setManualEntitlement] = useState("");
  const [enjoyedDays, setEnjoyedDays] = useState("30");
  const [sellVacation, setSellVacation] = useState(false);
  const [abonoDays, setAbonoDays] = useState("0");
  const [dependents, setDependents] = useState("0");
  const [vacationStart, setVacationStart] = useState("2026-10-05");
  const [monthsAccrued, setMonthsAccrued] = useState("6");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [overtimeAverage, setOvertimeAverage] = useState("0");
  const [commissionAverage, setCommissionAverage] = useState("0");
  const [nightAdditional, setNightAdditional] = useState("0");
  const [riskAdditional, setRiskAdditional] = useState("0");
  const [otherHabitual, setOtherHabitual] = useState("0");
  const [pensionDeduction, setPensionDeduction] = useState("0");
  const [otherLegalDeductions, setOtherLegalDeductions] = useState("0");
  const [thirteenthAdvance, setThirteenthAdvance] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const previousLang = root.lang;
    root.lang = "pt-BR";
    return () => {
      root.lang = previousLang;
    };
  }, []);

  const calculated = useMemo(() => {
    const baseSalary = parseMoney(salary);
    const base =
      baseSalary +
      parseMoney(overtimeAverage) +
      parseMoney(commissionAverage) +
      parseMoney(nightAdditional) +
      parseMoney(riskAdditional) +
      parseMoney(otherHabitual);
    const defaultEntitled = entitlementDays(absenceBracket);
    const entitled = manualEntitlement.trim() ? Math.max(0, Math.min(30, Number(manualEntitlement) || 0)) : defaultEntitled;
    const maximumAbono = maxAbonoDays(entitled);
    const requestedAbono = sellVacation ? Math.max(0, Number(abonoDays) || 0) : 0;
    const abono = Math.min(requestedAbono, maximumAbono);
    const requestedEnjoyed = Math.max(0, Number(enjoyedDays) || 0);
    const availableToEnjoy = Math.max(0, entitled - abono);
    const daysEnjoyed = Math.min(requestedEnjoyed, availableToEnjoy);
    const dependentsCount = Math.max(0, Math.floor(Number(dependents) || 0));
    const daily = base / 30;
    const vacationEnjoyedBase = daily * daysEnjoyed;
    const vacationThird = vacationEnjoyedBase / 3;
    const abonoPrincipal = daily * abono;
    const abonoThird = abonoPrincipal / 3;
    const thirteenth = thirteenthAdvance ? baseSalary / 2 : 0;
    const classification = brazilLaborTax2026.vacation.taxClassification;
    const inssBase =
      (classification.enjoyedVacation.inss ? vacationEnjoyedBase : 0) +
      (classification.enjoyedVacationThird.inss ? vacationThird : 0) +
      (classification.abonoPrincipal.inss ? abonoPrincipal : 0) +
      (classification.abonoThird.inss ? abonoThird : 0);
    const irrfGross =
      (classification.enjoyedVacation.irrf ? vacationEnjoyedBase : 0) +
      (classification.enjoyedVacationThird.irrf ? vacationThird : 0) +
      (classification.abonoPrincipal.irrf ? abonoPrincipal : 0) +
      (classification.abonoThird.irrf ? abonoThird : 0);
    const inss = calculateBrazilInss2026(inssBase);
    const legalDeductions = inss + dependentsCount * brazilLaborTax2026.dependentDeduction + parseMoney(pensionDeduction) + parseMoney(otherLegalDeductions);
    const irrf = calculateBrazilIrrf2026(irrfGross, legalDeductions, true);
    const grossVacationReceipt = vacationEnjoyedBase + vacationThird + abonoPrincipal + abonoThird + thirteenth;
    const netVacationReceipt = Math.max(0, grossVacationReceipt - inss - irrf.due);
    const proportionalMonths = Math.min(12, Math.max(0, Number(monthsAccrued) || 0));
    const proportionalVacation = (base / 12) * proportionalMonths;
    const proportionalThird = proportionalVacation / 3;
    const paymentDeadline = vacationStart ? (() => {
      const date = new Date(`${vacationStart}T00:00:00`);
      date.setDate(date.getDate() - brazilLaborTax2026.vacation.paymentDeadlineDaysBeforeStart);
      return date.toLocaleDateString("pt-BR");
    })() : "2 dias antes do início";
    const errors: string[] = [];
    if (baseSalary <= 0) errors.push("Informe um salário válido.");
    if (entitled === 0 && !manualEntitlement.trim()) errors.push("Mais de 32 faltas remove o direito padrão de férias neste período aquisitivo.");
    if (requestedAbono > maximumAbono) errors.push("Os dias de abono excedem o limite permitido.");
    if (requestedEnjoyed > availableToEnjoy) errors.push("A quantidade de dias de férias excede o saldo disponível.");
    if (requestedEnjoyed > 0 && requestedEnjoyed < 5) errors.push("Períodos fracionados de férias seguem limites mínimos legais. Confirme se a quantidade informada é válida no seu caso.");
    return {
      baseSalary,
      base,
      entitled,
      maximumAbono,
      requestedAbono,
      abono,
      requestedEnjoyed,
      availableToEnjoy,
      daysEnjoyed,
      daily,
      vacationEnjoyedBase,
      vacationThird,
      abonoPrincipal,
      abonoThird,
      thirteenth,
      inssBase,
      irrfGross,
      inss,
      irrf,
      grossVacationReceipt,
      netVacationReceipt,
      proportionalMonths,
      proportionalVacation,
      proportionalThird,
      proportionalGross: proportionalVacation + proportionalThird,
      paymentDeadline,
      errors,
    };
  }, [abonoDays, absenceBracket, commissionAverage, dependents, enjoyedDays, manualEntitlement, monthsAccrued, nightAdditional, otherHabitual, otherLegalDeductions, overtimeAverage, pensionDeduction, riskAdditional, salary, sellVacation, thirteenthAdvance, vacationStart]);

  const hasBlockingError = calculated.errors.some((error) => error !== "Períodos fracionados de férias seguem limites mínimos legais. Confirme se a quantidade informada é válida no seu caso.");

  const reset = () => {
    setMode("taken");
    setSalary("3.000,00");
    setAbsenceBracket("0-5");
    setManualEntitlement("");
    setEnjoyedDays("30");
    setSellVacation(false);
    setAbonoDays("0");
    setDependents("0");
    setVacationStart("2026-10-05");
    setMonthsAccrued("6");
    setOvertimeAverage("0");
    setCommissionAverage("0");
    setNightAdditional("0");
    setRiskAdditional("0");
    setOtherHabitual("0");
    setPensionDeduction("0");
    setOtherLegalDeductions("0");
    setThirteenthAdvance(false);
    setCopied(false);
  };

  const copyResult = async () => {
    const text = [
      "Cálculo de férias CLT - US Online Tools",
      `Base de remuneração: ${brl(calculated.base)}`,
      `Direito total: ${calculated.entitled} dias`,
      `Dias gozados: ${calculated.daysEnjoyed} dias`,
      `Dias convertidos em abono: ${calculated.abono} dias`,
      `Férias gozadas: ${brl(calculated.vacationEnjoyedBase)}`,
      `1/3 sobre férias: ${brl(calculated.vacationThird)}`,
      `Abono principal: ${brl(calculated.abonoPrincipal)}`,
      `1/3 sobre abono: ${brl(calculated.abonoThird)}`,
      `INSS: ${brl(calculated.inss)}`,
      `IRRF: ${brl(calculated.irrf.due)}`,
      `Valor líquido estimado: ${brl(calculated.netVacationReceipt)}`,
    ].join("\n");
    await navigator.clipboard?.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const schema = [
    { "@context": "https://schema.org", "@type": "WebApplication", name: "Calculadora de Férias CLT", url: canonical, applicationCategory: "FinanceApplication", operatingSystem: "Any", inLanguage: "pt-BR", description: "Calculadora de férias CLT com 1/3, abono pecuniário, INSS, IRRF e redução do imposto de renda em 2026." },
    { "@context": "https://schema.org", "@type": "WebPage", name: "Calculadora de Férias CLT 2026", url: canonical, inLanguage: "pt-BR", dateModified: "2026-09-06", isAccessibleForFree: true },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Início", item: "https://usonlinetools.com/" }, { "@type": "ListItem", position: 2, name: "Finanças", item: "https://usonlinetools.com/category/finance" }, { "@type": "ListItem", position: 3, name: "Calculadora de Férias", item: canonical }] },
    { "@context": "https://schema.org", "@type": "HowTo", name: "Como usar a calculadora de férias CLT", inLanguage: "pt-BR", step: howToSteps.map(([name, text], index) => ({ "@type": "HowToStep", position: index + 1, name, text })) },
    { "@context": "https://schema.org", "@type": "FAQPage", inLanguage: "pt-BR", mainEntity: faqs.map(([question, answer]) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })) },
  ];

  const rows = mode === "taken"
    ? [
        ["Base diária", brl(calculated.daily), "base de remuneração ÷ 30"],
        ["Férias gozadas", brl(calculated.vacationEnjoyedBase), `${calculated.daysEnjoyed} dia(s) × base diária`],
        ["1/3 sobre férias gozadas", brl(calculated.vacationThird), "tributado na estimativa de férias gozadas"],
        ["Abono pecuniário principal", brl(calculated.abonoPrincipal), "separado e fora das bases de INSS/IRRF nesta estimativa"],
        ["1/3 sobre abono", brl(calculated.abonoThird), "separado do abono principal; entra na base de IRRF"],
        ["Base INSS", brl(calculated.inssBase), "tabela progressiva 2026"],
        ["INSS", `-${brl(calculated.inss)}`, "cálculo progressivo"],
        ["Base IRRF férias", brl(calculated.irrf.base), `método: ${calculated.irrf.deductionMethod}`],
        ["Redução IR 2026", `-${brl(calculated.irrf.reduction)}`, "Lei 15.270/2025"],
        ["IRRF", `-${brl(calculated.irrf.due)}`, "férias calculadas separadamente do mês"],
        ["Adiantamento de 13º", brl(calculated.thirteenth), "opcional e exibido separado"],
      ]
    : [
        ["Meses acumulados", `${calculated.proportionalMonths}/12`, "estimativa de férias proporcionais"],
        ["Férias proporcionais brutas", brl(calculated.proportionalVacation), "base ÷ 12 × meses"],
        ["1/3 proporcional", brl(calculated.proportionalThird), "adicional constitucional"],
        ["Total bruto proporcional", brl(calculated.proportionalGross), "sem aplicar tratamento de rescisão"],
      ];

  return (
    <Layout>
      <SEO title="Calculadora de Férias CLT 2026 | US Online Tools" description="Calcule férias CLT com 1/3, abono pecuniário, INSS, IRRF, dependentes, redução 2026, férias proporcionais e memória de cálculo." canonical={canonical} schema={schema} />
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted-foreground"><Link href="/" className="hover:text-primary">Início</Link><span>/</span><Link href="/category/finance" className="hover:text-primary">Finanças</Link><span>/</span><span>Cálculo de férias</span></nav>

        <section className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-secondary/10 p-6 md:p-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-black uppercase tracking-wide text-primary"><Calculator className="h-4 w-4" /> Férias CLT 2026</div>
          <h1 className="mt-5 text-4xl font-black tracking-tight md:text-6xl">Calculadora de Férias CLT</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">Calcule férias gozadas durante o contrato com 1/3 constitucional, abono pecuniário, INSS, IRRF, redução de imposto em 2026 e valor líquido estimado. Para férias indenizadas no desligamento, use a <Link href="/calculo-rescisao" className="font-bold text-primary underline">calculadora de rescisão</Link>.</p>
          <div className="mt-5 grid gap-3 text-sm md:grid-cols-4"><InfoCard label="Prazo de pagamento" value="2 dias antes" note="antes do início das férias" /><InfoCard label="Abono máximo" value="1/3" note="dos dias de direito" /><InfoCard label="IRRF" value="separado" note="das demais rendas do mês" /><InfoCard label="Privacidade" value="local" note="sem CPF ou dados pessoais" /></div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm md:p-7">
            <div className="flex flex-wrap gap-2"><button type="button" onClick={() => setMode("taken")} className={`rounded-lg px-4 py-2 text-sm font-black ${mode === "taken" ? "bg-primary text-primary-foreground" : "border border-border"}`}>Férias gozadas</button><button type="button" onClick={() => setMode("proportional")} className={`rounded-lg px-4 py-2 text-sm font-black ${mode === "proportional" ? "bg-primary text-primary-foreground" : "border border-border"}`}>Estimativa proporcional</button></div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="Salário bruto mensal"><input value={salary} onChange={(event) => setSalary(event.target.value)} inputMode="decimal" className="h-12 rounded-lg border border-border bg-background px-4" /></Field>
              <Field label="Faltas injustificadas no período aquisitivo"><select value={absenceBracket} onChange={(event) => setAbsenceBracket(event.target.value as EntitlementId)} className="h-12 rounded-lg border border-border bg-background px-4">{brazilLaborTax2026.vacation.absenceEntitlement.map((item) => <option key={item.id} value={item.id}>{item.label} → {item.days} dias</option>)}</select></Field>
              {mode === "taken" ? <><Field label="Dias de férias neste período" note={`Saldo disponível após abono: ${calculated.availableToEnjoy} dia(s).`}><input value={enjoyedDays} onChange={(event) => setEnjoyedDays(event.target.value)} inputMode="numeric" className="h-12 rounded-lg border border-border bg-background px-4" /></Field><Field label="Início das férias" note={`Pagamento estimado até ${calculated.paymentDeadline}.`}><input type="date" value={vacationStart} onChange={(event) => setVacationStart(event.target.value)} className="h-12 rounded-lg border border-border bg-background px-4" /></Field><Field label="Converter parte em abono?"><select value={sellVacation ? "yes" : "no"} onChange={(event) => setSellVacation(event.target.value === "yes")} className="h-12 rounded-lg border border-border bg-background px-4"><option value="no">Não</option><option value="yes">Sim</option></select></Field><Field label="Dias convertidos em abono" note={`Máximo permitido: ${calculated.maximumAbono} dia(s).`}><input value={abonoDays} onChange={(event) => setAbonoDays(event.target.value)} disabled={!sellVacation} inputMode="numeric" className="h-12 rounded-lg border border-border bg-background px-4 disabled:opacity-60" /></Field></> : <Field label="Meses acumulados"><input value={monthsAccrued} onChange={(event) => setMonthsAccrued(event.target.value)} inputMode="numeric" className="h-12 rounded-lg border border-border bg-background px-4" /></Field>}
              <Field label="Dependentes para IRRF"><input value={dependents} onChange={(event) => setDependents(event.target.value)} inputMode="numeric" className="h-12 rounded-lg border border-border bg-background px-4" /></Field>
              <Field label="Adiantamento da 1ª parcela do 13º"><select value={thirteenthAdvance ? "yes" : "no"} onChange={(event) => setThirteenthAdvance(event.target.value === "yes")} className="h-12 rounded-lg border border-border bg-background px-4"><option value="no">Não incluir</option><option value="yes">Incluir 50% do salário</option></select></Field>
            </div>
            <button type="button" onClick={() => setShowAdvanced((value) => !value)} className="mt-5 rounded-lg border border-border px-4 py-2 text-sm font-bold">{showAdvanced ? "Ocultar opções avançadas" : "Mostrar opções avançadas"}</button>
            {showAdvanced ? <div className="mt-5 grid gap-4 sm:grid-cols-2"><Field label="Média de horas extras"><input value={overtimeAverage} onChange={(event) => setOvertimeAverage(event.target.value)} inputMode="decimal" className="h-12 rounded-lg border border-border bg-background px-4" /></Field><Field label="Média de comissões"><input value={commissionAverage} onChange={(event) => setCommissionAverage(event.target.value)} inputMode="decimal" className="h-12 rounded-lg border border-border bg-background px-4" /></Field><Field label="Adicional noturno médio"><input value={nightAdditional} onChange={(event) => setNightAdditional(event.target.value)} inputMode="decimal" className="h-12 rounded-lg border border-border bg-background px-4" /></Field><Field label="Insalubridade/periculosidade"><input value={riskAdditional} onChange={(event) => setRiskAdditional(event.target.value)} inputMode="decimal" className="h-12 rounded-lg border border-border bg-background px-4" /></Field><Field label="Outros adicionais habituais"><input value={otherHabitual} onChange={(event) => setOtherHabitual(event.target.value)} inputMode="decimal" className="h-12 rounded-lg border border-border bg-background px-4" /></Field><Field label="Pensão alimentícia dedutível"><input value={pensionDeduction} onChange={(event) => setPensionDeduction(event.target.value)} inputMode="decimal" className="h-12 rounded-lg border border-border bg-background px-4" /></Field><Field label="Outras deduções legais de IRRF"><input value={otherLegalDeductions} onChange={(event) => setOtherLegalDeductions(event.target.value)} inputMode="decimal" className="h-12 rounded-lg border border-border bg-background px-4" /></Field><Field label="Direito manual de férias (dias)"><input value={manualEntitlement} onChange={(event) => setManualEntitlement(event.target.value)} inputMode="numeric" placeholder={`${entitlementDays(absenceBracket)}`} className="h-12 rounded-lg border border-border bg-background px-4" /></Field></div> : null}
            {calculated.errors.length ? <div className="mt-5 rounded-xl bg-destructive/10 p-4 text-sm leading-7 text-destructive">{calculated.errors.map((error) => <p key={error}>{error}</p>)}</div> : null}
            <div className="mt-6 flex flex-wrap gap-3"><button type="button" onClick={copyResult} disabled={hasBlockingError} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-black text-primary-foreground disabled:opacity-50"><Copy className="h-4 w-4" /> {copied ? "Copiado" : "Copiar resumo"}</button><button type="button" onClick={reset} className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-bold"><RotateCcw className="h-4 w-4" /> Restaurar exemplo</button></div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm md:p-7" aria-live="polite">
            <h2 className="text-2xl font-black">{mode === "taken" ? "Quanto cai na conta" : "Estimativa proporcional"}</h2>
            {mode === "taken" ? <><div className="mt-5 rounded-2xl border border-primary/30 bg-primary/10 p-5"><p className="text-sm font-bold text-muted-foreground">Valor líquido estimado das férias</p><p className="mt-2 text-4xl font-black text-primary">{hasBlockingError ? "Revise os dados" : brl(calculated.netVacationReceipt)}</p><p className="mt-2 text-sm text-muted-foreground">Proventos − INSS − IRRF. Valores arredondados para centavos.</p></div><div className="mt-4 grid gap-4 sm:grid-cols-2"><InfoCard label="Férias + 1/3" value={brl(calculated.vacationEnjoyedBase + calculated.vacationThird)} note={`${calculated.daysEnjoyed} dia(s) gozados`} /><InfoCard label="Abono + 1/3" value={brl(calculated.abonoPrincipal + calculated.abonoThird)} note={`${calculated.abono} dia(s) convertidos`} /><InfoCard label="INSS" value={`-${brl(calculated.inss)}`} note={`Base ${brl(calculated.inssBase)}`} /><InfoCard label="IRRF" value={`-${brl(calculated.irrf.due)}`} note={`Redução 2026: ${brl(calculated.irrf.reduction)}`} /></div><p className="mt-5 rounded-xl bg-muted/40 p-4 text-sm leading-7">Cálculo de férias CLT: salário bruto {brl(calculated.baseSalary)}, base de remuneração {brl(calculated.base)}, direito total {calculated.entitled} dias, dias gozados {calculated.daysEnjoyed}, abono {calculated.abono}, líquido estimado {brl(calculated.netVacationReceipt)}.</p></> : <><div className="mt-5 rounded-2xl border border-primary/30 bg-primary/10 p-5"><p className="text-sm font-bold text-muted-foreground">Total bruto proporcional</p><p className="mt-2 text-4xl font-black text-primary">{brl(calculated.proportionalGross)}</p><p className="mt-2 text-sm text-muted-foreground">Esta aba estima férias proporcionais/acumuladas. Para férias indenizadas na rescisão, use a calculadora de rescisão.</p></div><div className="mt-4 grid gap-4 sm:grid-cols-2"><InfoCard label="Férias proporcionais" value={brl(calculated.proportionalVacation)} note={`${calculated.proportionalMonths}/12`} /><InfoCard label="1/3 proporcional" value={brl(calculated.proportionalThird)} note="adicional constitucional" /></div></>}
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-border bg-card p-5 md:p-7">
          <h2 className="text-2xl font-black">Memória de cálculo</h2>
          <div className="mt-5 overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead><tr className="border-b border-border text-muted-foreground"><th className="py-3 pr-4">Linha</th><th className="py-3 pr-4">Valor</th><th className="py-3">Como entra no cálculo</th></tr></thead><tbody>{rows.map(([label, value, note]) => <tr key={label} className="border-b border-border/60"><td className="py-3 pr-4 font-bold">{label}</td><td className="py-3 pr-4">{value}</td><td className="py-3 text-muted-foreground">{note}</td></tr>)}</tbody></table></div>
        </section>

        <section className="mt-8 grid min-w-0 gap-6 lg:grid-cols-2 [&>article]:min-w-0">
          <article className="rounded-2xl border border-border bg-card p-6"><h2 className="text-2xl font-black">Como calcular férias com 1/3</h2><p className="mt-4 leading-8 text-muted-foreground">Para salário mensal, a base diária usual é a remuneração de férias dividida por 30. Multiplique pelos dias gozados e acrescente o adicional constitucional de 1/3. Com salário de R$ 3.000,00 e 30 dias, o bruto antes dos descontos é R$ 3.000,00 + R$ 1.000,00 = R$ 4.000,00.</p></article>
          <article className="rounded-2xl border border-border bg-card p-6"><h2 className="text-2xl font-black">Abono pecuniário sem dupla contagem</h2><p className="mt-4 leading-8 text-muted-foreground">O abono permite converter até um terço das férias em dinheiro. A calculadora limita o máximo conforme o direito total: 30 dias permitem 10, 24 permitem 8, 18 permitem 6 e 12 permitem 4. O principal do abono e o 1/3 sobre abono aparecem em linhas separadas.</p></article>
          <article className="rounded-2xl border border-border bg-card p-6"><h2 className="text-2xl font-black">INSS, IRRF e redução de 2026</h2><p className="mt-4 leading-8 text-muted-foreground">O INSS é calculado de forma progressiva. O IRRF das férias é calculado separadamente dos outros rendimentos do mês, com comparação entre deduções legais e desconto simplificado, dependentes e redução mensal de 2026.</p></article>
          <article className="rounded-2xl border border-border bg-card p-6"><h2 className="text-2xl font-black">Faltas, prazo e fracionamento</h2><p className="mt-4 leading-8 text-muted-foreground">A CLT usa faixas de faltas injustificadas: até 5 faltas mantêm 30 dias; 6 a 14 reduzem para 24; 15 a 23 para 18; 24 a 32 para 12; mais de 32 perde o direito no período. O pagamento deve ocorrer até 2 dias antes do início das férias. O fracionamento exige atenção aos períodos mínimos legais.</p></article>
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
          <h2 className="text-2xl font-black">Tabela rápida</h2>
          <div className="mt-5 grid gap-3 text-sm md:grid-cols-2"><p className="rounded-xl bg-muted/40 p-3">30 dias: salário + 1/3.</p><p className="rounded-xl bg-muted/40 p-3">20 dias gozados: salário ÷ 30 × 20 + 1/3.</p><p className="rounded-xl bg-muted/40 p-3">10 dias de abono: salário ÷ 30 × 10.</p><p className="rounded-xl bg-muted/40 p-3">Férias líquidas: proventos − INSS − IRRF.</p></div>
        </section>

        <section className="mt-8 rounded-2xl border border-border bg-card p-6">
          <h2 className="text-2xl font-black">Importante</h2>
          <p className="mt-4 leading-8 text-muted-foreground">Esta calculadora fornece uma estimativa de férias CLT com base nos dados informados e nas regras/tabelas implementadas. Folhas reais podem variar por médias de remuneração variável, divisão entre competências, convenções coletivas, pensão, descontos específicos e critérios de folha. Para férias pagas em rescisão, utilize o cálculo rescisório, pois o tratamento tributário é diferente.</p>
          <p className="mt-3 leading-8 text-muted-foreground">Dados revisados em {brazilLaborTax2026.lastVerified}. Valores exibidos são arredondados para centavos; cálculos internos preservam maior precisão.</p>
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
