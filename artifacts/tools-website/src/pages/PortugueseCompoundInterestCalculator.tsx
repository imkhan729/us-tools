import { type ReactNode, useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { Calculator, Copy, RotateCcw } from "lucide-react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";

const canonical = "https://usonlinetools.com/calculadora-juros-compostos";

const faqs = [
  {
    q: "O que são juros compostos?",
    a: "Juros compostos são juros calculados sobre o capital inicial e também sobre os juros acumulados. Por isso são conhecidos como juros sobre juros.",
  },
  {
    q: "Qual é a fórmula dos juros compostos?",
    a: "Sem aportes, a fórmula é M = C × (1+i)^n, em que M é o montante, C é o capital inicial, i é a taxa por período e n é o número de períodos.",
  },
  {
    q: "Como calcular juros compostos com aporte mensal?",
    a: "Além do crescimento do capital inicial, é preciso calcular o valor futuro dos aportes recorrentes. A calculadora faz isso automaticamente e permite escolher se os aportes ocorrem no início ou no fim do mês.",
  },
  {
    q: "Posso usar uma taxa anual?",
    a: "Sim. Se você selecionar % ao ano, a ferramenta converte a taxa para a taxa mensal equivalente antes de calcular os períodos mensais.",
  },
  {
    q: "Para converter uma taxa anual em mensal basta dividir por 12?",
    a: "Não. Em juros compostos, use a taxa equivalente: (1 + taxa anual)^(1/12) − 1.",
  },
  {
    q: "Quanto equivale 1% ao mês por ano?",
    a: "1% ao mês equivale a aproximadamente 12,6825% ao ano em capitalização composta.",
  },
  {
    q: "O que significa total investido?",
    a: "É a soma do valor inicial com todos os aportes realizados. Os juros acumulados são apresentados separadamente.",
  },
  {
    q: "A calculadora desconta imposto de renda?",
    a: "Não. A simulação é bruta e matemática. Impostos e custos dependem do investimento real.",
  },
  {
    q: "A calculadora considera inflação?",
    a: "Não. O resultado apresentado é nominal.",
  },
  {
    q: "Posso começar com valor inicial zero?",
    a: "Sim. Você pode definir o valor inicial como zero e simular apenas aportes mensais.",
  },
  {
    q: "Posso fazer a simulação sem aporte mensal?",
    a: "Sim. Informe aporte mensal igual a zero.",
  },
  {
    q: "O que acontece se a taxa for 0%?",
    a: "O patrimônio final será a soma do valor inicial com os aportes, sem rendimento.",
  },
  {
    q: "Quanto preciso investir por mês para atingir uma meta?",
    a: "Use o modo Calcular aporte para uma meta e informe objetivo, valor inicial, taxa e prazo. A calculadora retorna o aporte mensal necessário segundo essas premissas.",
  },
  {
    q: "O resultado é garantido?",
    a: "Não. A ferramenta faz uma projeção matemática com taxa constante. Investimentos reais podem variar e podem ter impostos, custos e riscos.",
  },
  {
    q: "Meus valores são enviados para o servidor?",
    a: "Não. Os cálculos são realizados no seu navegador e os valores informados não precisam ser armazenados.",
  },
];

type Mode = "simulate" | "goal";
type RateUnit = "annual" | "monthly";
type PeriodUnit = "years" | "months";
type ContributionTiming = "end" | "beginning";

type ProjectionRow = {
  label: string;
  month: number;
  invested: number;
  interest: number;
  balance: number;
};

type SimulationResult = {
  finalBalance: number;
  totalInvested: number;
  interestEarned: number;
  interestShare: number;
  monthlyRate: number;
  annualRate: number;
  months: number;
  rows: ProjectionRow[];
};

type GoalResult = SimulationResult & {
  monthlyContributionRequired: number;
  target: number;
  initialGrowth: number;
  zeroContributionEnough: boolean;
};

function parsePtNumber(value: string) {
  const cleaned = value.trim().replace(/\s/g, "").replace(/[R$%]/g, "");
  if (!cleaned) {
    return NaN;
  }

  const normalized = cleaned.includes(",") ? cleaned.replace(/\./g, "").replace(",", ".") : cleaned;
  return Number(normalized);
}

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatPercent(value: number, digits = 4) {
  return `${(value * 100).toLocaleString("pt-BR", { minimumFractionDigits: digits, maximumFractionDigits: digits })}%`;
}

function equivalentMonthlyRate(ratePercent: number, unit: RateUnit) {
  const rate = ratePercent / 100;
  return unit === "annual" ? Math.pow(1 + rate, 1 / 12) - 1 : rate;
}

function equivalentAnnualRate(monthlyRate: number) {
  return Math.pow(1 + monthlyRate, 12) - 1;
}

function normalizeMonths(period: number, unit: PeriodUnit) {
  return Math.round(unit === "years" ? period * 12 : period);
}

function futureValue(initial: number, contribution: number, monthlyRate: number, months: number, timing: ContributionTiming) {
  if (monthlyRate === 0) {
    return initial + contribution * months;
  }

  const growth = Math.pow(1 + monthlyRate, months);
  const contributionFactor = ((growth - 1) / monthlyRate) * (timing === "beginning" ? 1 + monthlyRate : 1);
  return initial * growth + contribution * contributionFactor;
}

function requiredContribution(target: number, initial: number, monthlyRate: number, months: number, timing: ContributionTiming) {
  const initialGrowth = initial * Math.pow(1 + monthlyRate, months);
  if (target <= initialGrowth) {
    return 0;
  }

  if (monthlyRate === 0) {
    return (target - initial) / months;
  }

  const growth = Math.pow(1 + monthlyRate, months);
  const denominator = ((growth - 1) / monthlyRate) * (timing === "beginning" ? 1 + monthlyRate : 1);
  return (target - initialGrowth) / denominator;
}

function buildProjection(initial: number, contribution: number, monthlyRate: number, months: number, timing: ContributionTiming) {
  const rows: ProjectionRow[] = [];
  let balance = initial;

  for (let month = 1; month <= months; month += 1) {
    if (timing === "beginning") {
      balance += contribution;
    }

    balance *= 1 + monthlyRate;

    if (timing === "end") {
      balance += contribution;
    }

    if ((months > 24 && (month % 12 === 0 || month === months)) || months <= 24) {
      const invested = initial + contribution * month;
      rows.push({
        label: months > 24 ? `Ano ${Math.ceil(month / 12)}` : `Mês ${month}`,
        month,
        invested,
        interest: balance - invested,
        balance,
      });
    }
  }

  return rows;
}

function simulate(initial: number, contribution: number, ratePercent: number, rateUnit: RateUnit, period: number, periodUnit: PeriodUnit, timing: ContributionTiming): SimulationResult {
  const months = normalizeMonths(period, periodUnit);
  const monthlyRate = equivalentMonthlyRate(ratePercent, rateUnit);
  const finalBalance = futureValue(initial, contribution, monthlyRate, months, timing);
  const totalInvested = initial + contribution * months;

  return {
    finalBalance,
    totalInvested,
    interestEarned: finalBalance - totalInvested,
    interestShare: finalBalance > 0 ? (finalBalance - totalInvested) / finalBalance : 0,
    monthlyRate,
    annualRate: equivalentAnnualRate(monthlyRate),
    months,
    rows: buildProjection(initial, contribution, monthlyRate, months, timing),
  };
}

function validateCommon(initial: number, rate: number, period: number, months: number) {
  if (![initial, rate, period].every(Number.isFinite)) {
    return "Confira os valores informados para ver a simulação.";
  }
  if (initial < 0 || rate < 0 || period <= 0 || months <= 0 || months > 1200) {
    return "Use valor inicial maior ou igual a zero, taxa maior ou igual a zero e prazo entre 1 e 1200 meses.";
  }
  return "";
}

function ResultCard({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-background p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 break-words text-2xl font-black leading-8 text-foreground">{value}</p>
    </div>
  );
}

export default function PortugueseCompoundInterestCalculator() {
  const [mode, setMode] = useState<Mode>("simulate");
  const [initial, setInitial] = useState("10.000,00");
  const [monthly, setMonthly] = useState("500,00");
  const [target, setTarget] = useState("148.023,21");
  const [rate, setRate] = useState("1");
  const [rateUnit, setRateUnit] = useState<RateUnit>("monthly");
  const [period, setPeriod] = useState("10");
  const [periodUnit, setPeriodUnit] = useState<PeriodUnit>("years");
  const [timing, setTiming] = useState<ContributionTiming>("end");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const element = document.documentElement;
    const previousLang = element.lang;
    const previousDir = element.dir;
    element.lang = "pt-BR";
    element.dir = "ltr";

    return () => {
      element.lang = previousLang;
      element.dir = previousDir;
    };
  }, []);

  const values = useMemo(() => {
    const initialValue = parsePtNumber(initial);
    const monthlyValue = parsePtNumber(monthly);
    const targetValue = parsePtNumber(target);
    const rateValue = parsePtNumber(rate);
    const periodValue = parsePtNumber(period);
    const months = normalizeMonths(periodValue, periodUnit);
    return { initialValue, monthlyValue, targetValue, rateValue, periodValue, months };
  }, [initial, monthly, target, rate, period, periodUnit]);

  const error = useMemo(() => {
    const commonError = validateCommon(values.initialValue, values.rateValue, values.periodValue, values.months);
    if (commonError) {
      return commonError;
    }

    if (mode === "simulate" && (!Number.isFinite(values.monthlyValue) || values.monthlyValue < 0)) {
      return "Use aporte mensal maior ou igual a zero.";
    }

    if (mode === "goal" && (!Number.isFinite(values.targetValue) || values.targetValue <= 0)) {
      return "Informe uma meta financeira maior que zero.";
    }

    return "";
  }, [mode, values]);

  const simulationResult = useMemo(() => {
    if (error || mode !== "simulate") {
      return null;
    }

    return simulate(values.initialValue, values.monthlyValue, values.rateValue, rateUnit, values.periodValue, periodUnit, timing);
  }, [error, mode, periodUnit, rateUnit, timing, values]);

  const goalResult = useMemo<GoalResult | null>(() => {
    if (error || mode !== "goal") {
      return null;
    }

    const monthlyRate = equivalentMonthlyRate(values.rateValue, rateUnit);
    const contribution = Math.max(0, requiredContribution(values.targetValue, values.initialValue, monthlyRate, values.months, timing));
    const simulated = simulate(values.initialValue, contribution, values.rateValue, rateUnit, values.periodValue, periodUnit, timing);

    return {
      ...simulated,
      monthlyContributionRequired: contribution,
      target: values.targetValue,
      initialGrowth: values.initialValue * Math.pow(1 + monthlyRate, values.months),
      zeroContributionEnough: contribution === 0,
    };
  }, [error, mode, periodUnit, rateUnit, timing, values]);

  const activeResult = simulationResult ?? goalResult;
  const contributionForText = mode === "simulate" ? values.monthlyValue : goalResult?.monthlyContributionRequired ?? 0;

  const resultText = activeResult
    ? [
        mode === "simulate" ? "Simulação de juros compostos" : "Meta com juros compostos",
        `Valor inicial: ${formatCurrency(values.initialValue)}`,
        `Aporte mensal: ${formatCurrency(contributionForText)}`,
        `Taxa informada: ${rate}% ${rateUnit === "annual" ? "ao ano" : "ao mês"}`,
        `Taxa mensal equivalente: ${formatPercent(activeResult.monthlyRate)} ao mês`,
        `Taxa anual equivalente: ${formatPercent(activeResult.annualRate)} ao ano`,
        `Prazo: ${period} ${periodUnit === "years" ? "anos" : "meses"} / ${activeResult.months} meses`,
        `Momento do aporte: ${timing === "end" ? "fim de cada mês" : "início de cada mês"}`,
        `Total investido: ${formatCurrency(activeResult.totalInvested)}`,
        `Juros acumulados: ${formatCurrency(activeResult.interestEarned)}`,
        `Patrimônio final: ${formatCurrency(activeResult.finalBalance)}`,
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
    setMode("simulate");
    setInitial("10.000,00");
    setMonthly("500,00");
    setTarget("148.023,21");
    setRate("1");
    setRateUnit("monthly");
    setPeriod("10");
    setPeriodUnit("years");
    setTiming("end");
    setCopied(false);
  };

  const schema = [
    {
      "@type": "WebApplication",
      name: "Calculadora de Juros Compostos",
      url: canonical,
      applicationCategory: "FinanceApplication",
      operatingSystem: "Any",
      inLanguage: "pt-BR",
      description: "Calculadora de juros compostos com aportes mensais, taxa mensal ou anual, prazo e modo de meta financeira.",
    },
    {
      "@type": "WebPage",
      name: "Calculadora de Juros Compostos",
      url: canonical,
      inLanguage: "pt-BR",
      description: "Calcule juros compostos com valor inicial, aportes mensais, taxa mensal ou anual e prazo.",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Início", item: "https://usonlinetools.com/" },
        { "@type": "ListItem", position: 2, name: "Calculadora de Juros Compostos", item: canonical },
      ],
    },
    {
      "@type": "FAQPage",
      inLanguage: "pt-BR",
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
        title="Calculadora de Juros Compostos com Aportes | US Online Tools"
        description="Calcule juros compostos com valor inicial, aportes mensais, taxa mensal ou anual e prazo. Veja patrimônio final, total investido e juros acumulados."
        canonical={canonical}
        ogLocale="pt_BR"
        schema={schema}
      />
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8" lang="pt-BR">
        <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/">Início</Link>
          <span>/</span>
          <span>Calculadora de juros compostos</span>
        </nav>

        <section className="mb-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-bold text-primary">
            <Calculator className="h-4 w-4" />
            Simulador de Juros Compostos
          </div>
          <h1 className="mt-4 text-4xl font-black tracking-normal md:text-6xl">Calculadora de Juros Compostos</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">
            Simule quanto seu dinheiro pode crescer com juros compostos. Informe o valor inicial, os aportes mensais, a taxa e o prazo para ver o patrimônio final, o total investido e os juros acumulados.
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="rounded-lg border border-border bg-card p-5 shadow-sm md:p-6">
            <h2 className="text-2xl font-black">Simulador de Juros Compostos</h2>
            <div className="mt-5 grid gap-2 rounded-lg bg-muted p-1 sm:grid-cols-2" role="tablist" aria-label="Modo da calculadora">
              <button type="button" onClick={() => setMode("simulate")} className={`rounded-md px-4 py-3 text-sm font-bold ${mode === "simulate" ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`} role="tab" aria-selected={mode === "simulate"}>
                Simular investimento
              </button>
              <button type="button" onClick={() => setMode("goal")} className={`rounded-md px-4 py-3 text-sm font-bold ${mode === "goal" ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`} role="tab" aria-selected={mode === "goal"}>
                Calcular aporte para uma meta
              </button>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {mode === "goal" ? (
                <Field label="Meta financeira" value={target} onChange={setTarget} helper="Patrimônio que você quer atingir." placeholder="R$ 148.023,21" />
              ) : null}
              <Field label="Valor inicial" value={initial} onChange={setInitial} helper="Quanto você já tem para investir hoje. Pode ser R$ 0,00." placeholder="R$ 10.000,00" />
              {mode === "simulate" ? (
                <Field label="Aporte mensal" value={monthly} onChange={setMonthly} helper="Valor que será adicionado a cada mês. Pode ser R$ 0,00." placeholder="R$ 500,00" />
              ) : null}
              <Field label="Taxa de juros" value={rate} onChange={setRate} helper="Informe a taxa do seu cenário, sem usar taxas de mercado pré-preenchidas." placeholder="10" />
              <label className="grid gap-2">
                <span className="font-bold">Período da taxa</span>
                <select value={rateUnit} onChange={(event) => setRateUnit(event.target.value as RateUnit)} className="h-12 rounded-lg border border-border bg-background px-4 focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="annual">% ao ano</option>
                  <option value="monthly">% ao mês</option>
                </select>
              </label>
              <Field label="Prazo" value={period} onChange={setPeriod} helper="Use até 100 anos ou 1200 meses." placeholder="10" />
              <label className="grid gap-2">
                <span className="font-bold">Unidade do prazo</span>
                <select value={periodUnit} onChange={(event) => setPeriodUnit(event.target.value as PeriodUnit)} className="h-12 rounded-lg border border-border bg-background px-4 focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="years">anos</option>
                  <option value="months">meses</option>
                </select>
              </label>
              <label className="grid gap-2 sm:col-span-2">
                <span className="font-bold">Quando o aporte é feito?</span>
                <select value={timing} onChange={(event) => setTiming(event.target.value as ContributionTiming)} className="h-12 rounded-lg border border-border bg-background px-4 focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="end">No fim do mês</option>
                  <option value="beginning">No início do mês</option>
                </select>
                <span className="text-sm text-muted-foreground">O momento do aporte altera por quantos períodos cada depósito rende.</span>
              </label>
            </div>

            {error ? <p className="mt-5 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm font-bold text-destructive">{error}</p> : null}

            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" onClick={copyResult} disabled={!activeResult} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-bold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50">
                <Copy className="h-4 w-4" />
                {copied ? "Copiado" : "Copiar resultado"}
              </button>
              <button type="button" onClick={reset} className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-3 text-sm font-bold hover:bg-muted">
                <RotateCcw className="h-4 w-4" />
                Limpar
              </button>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-5 shadow-sm md:p-6" aria-live="polite">
            <h2 className="text-2xl font-black">{mode === "goal" ? "Quanto preciso investir por mês?" : "Resultado da simulação"}</h2>
            {activeResult ? (
              <div className="mt-5 space-y-4">
                <div className="rounded-lg border border-primary/20 bg-primary/10 p-5">
                  <p className="text-sm font-bold text-primary">{mode === "goal" ? "Aporte mensal necessário" : "Patrimônio final"}</p>
                  <p className="mt-2 text-3xl font-black leading-tight text-primary">{mode === "goal" ? `${formatCurrency(goalResult?.monthlyContributionRequired ?? 0)} por mês` : formatCurrency(activeResult.finalBalance)}</p>
                  {goalResult?.zeroContributionEnough ? <p className="mt-3 text-sm text-muted-foreground">A meta pode ser atingida nesta projeção sem aportes mensais adicionais.</p> : null}
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {mode === "goal" ? <ResultCard label="Meta final" value={formatCurrency(goalResult?.target ?? 0)} /> : null}
                  <ResultCard label="Total investido" value={formatCurrency(activeResult.totalInvested)} />
                  <ResultCard label="Juros acumulados" value={formatCurrency(activeResult.interestEarned)} />
                  <ResultCard label="Percentual vindo de juros" value={formatPercent(activeResult.interestShare, 2)} />
                  <ResultCard label="Taxa mensal equivalente" value={`${formatPercent(activeResult.monthlyRate)} a.m.`} />
                  <ResultCard label="Taxa anual equivalente" value={`${formatPercent(activeResult.annualRate)} a.a.`} />
                  <ResultCard label="Prazo total" value={`${activeResult.months.toLocaleString("pt-BR")} meses`} />
                </div>

                <div className="rounded-lg bg-muted/40 p-4 text-sm leading-7 text-muted-foreground">
                  {mode === "simulate" ? (
                    <p>
                      Com {formatCurrency(values.initialValue)} iniciais, aportes de {formatCurrency(values.monthlyValue)} por mês e rendimento de {rate}% {rateUnit === "annual" ? "ao ano" : "ao mês"} durante {period} {periodUnit === "years" ? "anos" : "meses"}, o patrimônio projetado é de aproximadamente {formatCurrency(activeResult.finalBalance)}. Desse total, {formatCurrency(activeResult.totalInvested)} correspondem ao dinheiro investido e {formatCurrency(activeResult.interestEarned)} aos juros acumulados.
                    </p>
                  ) : (
                    <p>
                      Para atingir {formatCurrency(goalResult?.target ?? 0)} em {activeResult.months} meses, com valor inicial de {formatCurrency(values.initialValue)} e taxa de {rate}% {rateUnit === "annual" ? "ao ano" : "ao mês"}, o aporte mensal estimado é {formatCurrency(goalResult?.monthlyContributionRequired ?? 0)}, considerando aportes no {timing === "end" ? "fim" : "início"} de cada mês.
                    </p>
                  )}
                </div>
              </div>
            ) : !error ? (
              <p className="mt-5 rounded-lg bg-muted/40 p-4 text-muted-foreground">Preencha os campos para ver a projeção.</p>
            ) : null}
          </div>
        </section>

        {activeResult ? (
          <section className="mt-8 rounded-lg border border-border bg-card p-6">
            <h2 className="text-2xl font-black">{activeResult.months > 24 ? "Projeção anual" : "Projeção mensal"}</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[680px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="p-3 font-black">{activeResult.months > 24 ? "Ano" : "Mês"}</th>
                    <th className="p-3 text-right font-black">Total investido</th>
                    <th className="p-3 text-right font-black">Juros acumulados</th>
                    <th className="p-3 text-right font-black">Patrimônio</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {activeResult.rows.map((row) => (
                    <tr key={`${row.label}-${row.month}`}>
                      <td className="p-3 font-bold">{row.label}</td>
                      <td className="p-3 text-right text-muted-foreground">{formatCurrency(row.invested)}</td>
                      <td className="p-3 text-right text-muted-foreground">{formatCurrency(row.interest)}</td>
                      <td className="p-3 text-right font-bold">{formatCurrency(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : null}

        <section className="mt-10 grid min-w-0 gap-6 [&>article]:min-w-0">
          <article className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-6">
            <h2 className="text-2xl font-black">Importante</h2>
            <p className="mt-4 leading-8 text-muted-foreground">
              Esta ferramenta faz uma simulação matemática com base nos valores e na taxa informados. Ela não garante rendimento e não substitui orientação financeira. Impostos, inflação, taxas e variações de rentabilidade podem alterar o resultado real.
            </p>
          </article>

          <article className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-2xl font-black">O que são juros compostos?</h2>
            <p className="mt-4 leading-8 text-muted-foreground">
              Juros compostos são juros calculados não apenas sobre o valor inicial, mas também sobre os juros acumulados nos períodos anteriores. Por isso, esse regime é conhecido como juros sobre juros.
            </p>
            <p className="mt-3 leading-8 text-muted-foreground">Quando o rendimento é reinvestido, o saldo de cada período passa a ser a base do cálculo seguinte. Em prazos longos, essa diferença pode se tornar significativa porque o crescimento é acumulativo.</p>
          </article>

          <article className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-2xl font-black">Como calcular juros compostos?</h2>
            <p className="mt-4 leading-8 text-muted-foreground">
              Sem aportes adicionais, a fórmula básica é <code>M = C × (1 + i)^n</code>. M é o montante final, C é o capital inicial, i é a taxa por período em formato decimal e n é o número de períodos.
            </p>
            <p className="mt-3 leading-8 text-muted-foreground">Por exemplo, para calcular o crescimento de R$ 1.000,00 a 1% ao mês durante 12 meses: <code>M = 1.000 × (1,01)^12</code>. O importante é manter a taxa e o prazo na mesma unidade.</p>
          </article>

          <article className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-2xl font-black">Como calcular juros compostos com aportes mensais?</h2>
            <p className="mt-4 leading-8 text-muted-foreground">
              Quando existe um aporte recorrente, cada novo depósito começa a participar da capitalização a partir do momento em que é investido. Se os aportes forem feitos no fim de cada mês, a fórmula é <code>M = C × (1+i)^n + A × [((1+i)^n − 1) ÷ i]</code>.
            </p>
            <p className="mt-3 leading-8 text-muted-foreground">A calculadora também permite informar se os aportes são feitos no início do mês, porque isso altera o tempo de rendimento de cada depósito.</p>
          </article>

          <article className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-2xl font-black">Taxa anual e taxa mensal são a mesma coisa?</h2>
            <p className="mt-4 leading-8 text-muted-foreground">
              Não. Uma taxa anual não deve ser simplesmente dividida por 12 quando estamos trabalhando com capitalização composta. A taxa mensal equivalente é calculada por <code>(1 + taxa anual)^(1/12) − 1</code>.
            </p>
            <p className="mt-3 leading-8 text-muted-foreground">Por exemplo, 12% ao ano equivalem a aproximadamente 0,9489% ao mês, e não exatamente 1% ao mês. Da mesma forma, 1% ao mês equivale a aproximadamente 12,6825% ao ano.</p>
          </article>

          <article className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-2xl font-black">O que é aporte mensal?</h2>
            <p className="mt-4 leading-8 text-muted-foreground">
              Aporte mensal é o valor que você adiciona regularmente ao investimento. Por exemplo: valor inicial de R$ 5.000,00 e aporte mensal de R$ 500,00. Cada aporte pode gerar rendimentos nos períodos seguintes.
            </p>
          </article>

          <article className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-2xl font-black">Aporte no início ou no fim do mês faz diferença?</h2>
            <p className="mt-4 leading-8 text-muted-foreground">
              Sim. Se o aporte é feito no início do mês, ele fica aplicado por um período adicional em comparação com um aporte realizado no fim do mesmo mês. A calculadora informa claramente qual hipótese está sendo usada.
            </p>
          </article>

          <article className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-2xl font-black">Qual a diferença entre juros simples e juros compostos?</h2>
            <p className="mt-4 leading-8 text-muted-foreground">
              Nos juros simples, os juros são calculados sempre sobre o capital inicial. Nos juros compostos, os juros acumulados passam a fazer parte da base de cálculo dos períodos seguintes. Quanto maior o prazo, maior tende a ser a diferença entre os dois regimes.
            </p>
          </article>

          <article className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-2xl font-black">Como descobrir quanto preciso investir por mês?</h2>
            <p className="mt-4 leading-8 text-muted-foreground">
              Use a opção Calcular aporte para uma meta. Informe o patrimônio que deseja atingir, o valor que já possui, a taxa estimada e o prazo disponível. A projeção não garante rendimento futuro; ela mostra o resultado matemático com uma taxa constante informada pelo usuário.
            </p>
          </article>

          <article className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-2xl font-black">Esta calculadora considera imposto de renda ou inflação?</h2>
            <p className="mt-4 leading-8 text-muted-foreground">
              Não. A calculadora apresenta uma projeção matemática de juros compostos e não desconta automaticamente Imposto de Renda, IOF, taxas, inflação, custos, spread ou variações de rentabilidade. Os resultados são nominais.
            </p>
          </article>

          <article className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-2xl font-black">Como a calculadora faz a conta?</h2>
            <p className="mt-4 leading-8 text-muted-foreground">
              A calculadora usa capitalização composta e converte taxas anuais e mensais por equivalência matemática. Por padrão, os aportes mensais são considerados no fim de cada mês, mas você pode alterar essa opção. Os cálculos usam precisão interna e os valores são arredondados apenas para exibição.
            </p>
          </article>

          <article className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-2xl font-black">Exemplo de juros compostos com aportes</h2>
            <p className="mt-4 leading-8 text-muted-foreground">
              Considere R$ 10.000,00 de valor inicial, R$ 500,00 de aporte mensal, taxa de 1% ao mês, prazo de 10 anos e aportes realizados no fim de cada mês.
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[520px] border-collapse text-left text-sm">
                <tbody className="divide-y divide-border">
                  {[
                    ["Valor inicial", "R$ 10.000,00"],
                    ["Total de aportes mensais", "R$ 60.000,00"],
                    ["Total investido", "R$ 70.000,00"],
                    ["Patrimônio final", "R$ 148.023,21"],
                    ["Juros acumulados", "R$ 78.023,21"],
                  ].map(([label, value]) => (
                    <tr key={label}>
                      <td className="p-3 font-bold">{label}</td>
                      <td className="p-3 text-right text-muted-foreground">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>

          <article className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-2xl font-black">Ferramentas relacionadas</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href="/finance/savings-calculator" className="inline-flex rounded-lg border border-border px-4 py-3 font-bold text-primary hover:bg-muted">
                Calculadora de poupança
              </Link>
              <Link href="/finance/savings-goal-calculator" className="inline-flex rounded-lg border border-border px-4 py-3 font-bold text-primary hover:bg-muted">
                Calculadora de meta de economia
              </Link>
              <Link href="/finance/online-roi-calculator" className="inline-flex rounded-lg border border-border px-4 py-3 font-bold text-primary hover:bg-muted">
                Calculadora de retorno sobre investimento
              </Link>
              <Link href="/category/finance" className="inline-flex rounded-lg border border-border px-4 py-3 font-bold text-primary hover:bg-muted">
                Ferramentas financeiras
              </Link>
            </div>
          </article>

          <article className="rounded-lg border border-primary/20 bg-primary/5 p-6">
            <h2 className="text-2xl font-black">Respostas diretas</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <div>
                <h3 className="font-black">Como calcular juros compostos?</h3>
                <p className="mt-2 leading-8 text-muted-foreground">Use a fórmula M = C × (1+i)^n, em que C é o capital inicial, i é a taxa por período e n é o número de períodos. Com aportes mensais, deve-se somar também o valor futuro dos aportes.</p>
              </div>
              <div>
                <h3 className="font-black">Como converter taxa anual em mensal?</h3>
                <p className="mt-2 leading-8 text-muted-foreground">Em juros compostos, use i_mensal = (1+i_anual)^(1/12) − 1. Não basta dividir a taxa anual por 12.</p>
              </div>
              <div>
                <h3 className="font-black">Quanto equivale 1% ao mês ao ano?</h3>
                <p className="mt-2 leading-8 text-muted-foreground">1% ao mês equivale a aproximadamente 12,6825% ao ano em capitalização composta.</p>
              </div>
            </div>
          </article>

          <article className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-2xl font-black">Perguntas frequentes</h2>
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

function Field({ label, value, onChange, helper, placeholder }: { label: string; value: string; onChange: (value: string) => void; helper: string; placeholder: string }) {
  return (
    <label className="grid gap-2">
      <span className="font-bold">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        inputMode="decimal"
        placeholder={placeholder}
        className="h-12 rounded-lg border border-border bg-background px-4 focus:outline-none focus:ring-2 focus:ring-primary"
      />
      <span className="text-sm text-muted-foreground">{helper}</span>
    </label>
  );
}
