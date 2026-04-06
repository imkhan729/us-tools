import { useMemo, useState } from "react";
import {
  BarChart3,
  Calendar,
  Copy,
  RotateCcw,
  Shield,
  Target,
  Trophy,
  Users,
  Wallet,
} from "lucide-react";
import UtilityToolPageShell from "./UtilityToolPageShell";

function toNumber(input: string, fallback = 0) {
  const value = Number.parseFloat(input);
  return Number.isFinite(value) ? value : fallback;
}

function positive(input: string, fallback = 0) {
  return Math.max(0, toNumber(input, fallback));
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function format(value: number, digits = 2) {
  return value.toLocaleString("en-US", { maximumFractionDigits: digits });
}

export default function EsportsEarningsCalculator() {
  const [teamWinningsInput, setTeamWinningsInput] = useState("25000");
  const [playerCountInput, setPlayerCountInput] = useState("5");
  const [orgCutInput, setOrgCutInput] = useState("10");
  const [staffCutInput, setStaffCutInput] = useState("5");
  const [taxRateInput, setTaxRateInput] = useState("22");
  const [monthlySalaryInput, setMonthlySalaryInput] = useState("3000");
  const [seasonMonthsInput, setSeasonMonthsInput] = useState("10");
  const [eventsPerSeasonInput, setEventsPerSeasonInput] = useState("6");
  const [averageTeamWinningsInput, setAverageTeamWinningsInput] = useState("18000");
  const [annualSponsorInput, setAnnualSponsorInput] = useState("8000");
  const [targetIncomeInput, setTargetIncomeInput] = useState("75000");
  const [copiedLabel, setCopiedLabel] = useState("");

  const split = useMemo(() => {
    const teamWinnings = positive(teamWinningsInput, 0);
    const playerCount = clamp(Math.round(positive(playerCountInput, 1)), 1, 12);
    const orgCutRate = positive(orgCutInput, 0) / 100;
    const staffCutRate = positive(staffCutInput, 0) / 100;
    const taxRate = positive(taxRateInput, 0) / 100;
    const orgCut = teamWinnings * orgCutRate;
    const staffCut = teamWinnings * staffCutRate;
    const playerPool = Math.max(0, teamWinnings - orgCut - staffCut);
    const grossPerPlayer = playerPool / playerCount;
    const taxPerPlayer = grossPerPlayer * taxRate;
    const netPerPlayer = grossPerPlayer - taxPerPlayer;
    return {
      teamWinnings,
      playerCount,
      orgCutRate,
      staffCutRate,
      taxRate,
      orgCut,
      staffCut,
      playerPool,
      grossPerPlayer,
      taxPerPlayer,
      netPerPlayer,
    };
  }, [orgCutInput, playerCountInput, staffCutInput, taxRateInput, teamWinningsInput]);

  const season = useMemo(() => {
    const monthlySalary = positive(monthlySalaryInput, 0);
    const seasonMonths = positive(seasonMonthsInput, 0);
    const eventsPerSeason = Math.round(positive(eventsPerSeasonInput, 0));
    const averageTeamWinnings = positive(averageTeamWinningsInput, 0);
    const annualSponsor = positive(annualSponsorInput, 0);
    const modeledSplitNet = (() => {
      const orgCut = averageTeamWinnings * split.orgCutRate;
      const staffCut = averageTeamWinnings * split.staffCutRate;
      const playerPool = Math.max(0, averageTeamWinnings - orgCut - staffCut);
      const grossPerPlayer = playerPool / split.playerCount;
      return grossPerPlayer * (1 - split.taxRate);
    })();
    const seasonPrizeNet = modeledSplitNet * eventsPerSeason;
    const seasonSalary = monthlySalary * seasonMonths;
    const totalSeasonIncome = seasonSalary + annualSponsor + seasonPrizeNet;
    return {
      monthlySalary,
      seasonMonths,
      eventsPerSeason,
      averageTeamWinnings,
      annualSponsor,
      modeledSplitNet,
      seasonPrizeNet,
      seasonSalary,
      totalSeasonIncome,
    };
  }, [
    annualSponsorInput,
    averageTeamWinningsInput,
    eventsPerSeasonInput,
    monthlySalaryInput,
    seasonMonthsInput,
    split.orgCutRate,
    split.playerCount,
    split.staffCutRate,
    split.taxRate,
  ]);

  const targetPlan = useMemo(() => {
    const targetIncome = positive(targetIncomeInput, 0);
    const guaranteedIncome = season.seasonSalary + season.annualSponsor;
    const incomeGap = Math.max(0, targetIncome - guaranteedIncome);
    const neededNetPerEvent = season.eventsPerSeason > 0 ? incomeGap / season.eventsPerSeason : 0;
    const netFactorPerDollar = split.teamWinnings > 0 ? split.netPerPlayer / split.teamWinnings : 0;
    const neededTeamWinningsPerEvent = netFactorPerDollar > 0 ? neededNetPerEvent / netFactorPerDollar : 0;
    return {
      targetIncome,
      guaranteedIncome,
      incomeGap,
      neededNetPerEvent,
      neededTeamWinningsPerEvent,
    };
  }, [season.annualSponsor, season.eventsPerSeason, season.seasonSalary, split.netPerPlayer, split.teamWinnings, targetIncomeInput]);

  const copyValue = async (label: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedLabel(label);
    window.setTimeout(() => setCopiedLabel(""), 1800);
  };

  const resetAll = () => {
    setTeamWinningsInput("25000");
    setPlayerCountInput("5");
    setOrgCutInput("10");
    setStaffCutInput("5");
    setTaxRateInput("22");
    setMonthlySalaryInput("3000");
    setSeasonMonthsInput("10");
    setEventsPerSeasonInput("6");
    setAverageTeamWinningsInput("18000");
    setAnnualSponsorInput("8000");
    setTargetIncomeInput("75000");
  };

  const loadTierOnePreset = () => {
    setTeamWinningsInput("100000");
    setPlayerCountInput("5");
    setOrgCutInput("12");
    setStaffCutInput("5");
    setTaxRateInput("28");
    setMonthlySalaryInput("8000");
    setSeasonMonthsInput("10");
    setEventsPerSeasonInput("8");
    setAverageTeamWinningsInput("60000");
    setAnnualSponsorInput("20000");
    setTargetIncomeInput("180000");
  };

  const loadChallengerPreset = () => {
    setTeamWinningsInput("12000");
    setPlayerCountInput("5");
    setOrgCutInput("8");
    setStaffCutInput("3");
    setTaxRateInput("18");
    setMonthlySalaryInput("1800");
    setSeasonMonthsInput("9");
    setEventsPerSeasonInput("5");
    setAverageTeamWinningsInput("9000");
    setAnnualSponsorInput("3000");
    setTargetIncomeInput("45000");
  };

  const splitSnippet = [
    `Team winnings: $${format(split.teamWinnings, 2)}`,
    `Player pool: $${format(split.playerPool, 2)}`,
    `Gross per player: $${format(split.grossPerPlayer, 2)}`,
    `Tax per player: $${format(split.taxPerPlayer, 2)}`,
    `Net per player: $${format(split.netPerPlayer, 2)}`,
  ].join("\n");

  const seasonSnippet = [
    `Season salary: $${format(season.seasonSalary, 2)}`,
    `Sponsor income: $${format(season.annualSponsor, 2)}`,
    `Prize net per event: $${format(season.modeledSplitNet, 2)}`,
    `Season prize total: $${format(season.seasonPrizeNet, 2)}`,
    `Total season income: $${format(season.totalSeasonIncome, 2)}`,
  ].join("\n");

  const targetSnippet = [
    `Target annual income: $${format(targetPlan.targetIncome, 2)}`,
    `Guaranteed income: $${format(targetPlan.guaranteedIncome, 2)}`,
    `Income gap: $${format(targetPlan.incomeGap, 2)}`,
    `Needed net per event: $${format(targetPlan.neededNetPerEvent, 2)}`,
    `Needed team winnings per event: $${format(targetPlan.neededTeamWinningsPerEvent, 2)}`,
  ].join("\n");

  const calculator = (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <button onClick={loadTierOnePreset} className="rounded-full border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:border-blue-500/40 hover:bg-muted">
          Load Tier 1 Season
        </button>
        <button onClick={loadChallengerPreset} className="rounded-full border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:border-blue-500/40 hover:bg-muted">
          Load Challenger Season
        </button>
        <button onClick={resetAll} className="rounded-full border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:border-blue-500/40 hover:bg-muted">
          Reset
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.45fr_0.95fr] gap-5">
        <div className="space-y-5">
          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Tournament Prize Split</p>
                <p className="text-sm text-muted-foreground">Estimate how a team payout turns into a real post-cut and post-tax number per player.</p>
              </div>
              <Trophy className="w-5 h-5 text-blue-500" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Team Winnings</label>
                <input type="number" min="0" step="1" value={teamWinningsInput} onChange={(event) => setTeamWinningsInput(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Players</label>
                <input type="number" min="1" step="1" value={playerCountInput} onChange={(event) => setPlayerCountInput(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Org Cut %</label>
                <input type="number" min="0" step="1" value={orgCutInput} onChange={(event) => setOrgCutInput(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Staff Cut %</label>
                <input type="number" min="0" step="1" value={staffCutInput} onChange={(event) => setStaffCutInput(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Tax %</label>
                <input type="number" min="0" step="1" value={taxRateInput} onChange={(event) => setTaxRateInput(event.target.value)} className="tool-calc-input w-full" />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Org Cut</p>
                <p className="mt-2 text-2xl font-black text-foreground">${format(split.orgCut, 2)}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Staff Cut</p>
                <p className="mt-2 text-2xl font-black text-foreground">${format(split.staffCut, 2)}</p>
              </div>
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Gross / Player</p>
                <p className="mt-2 text-2xl font-black text-emerald-600">${format(split.grossPerPlayer, 2)}</p>
              </div>
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Net / Player</p>
                <p className="mt-2 text-2xl font-black text-emerald-600">${format(split.netPerPlayer, 2)}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Season Income Planner</p>
                <p className="text-sm text-muted-foreground">Blend salary, sponsor money, and average results into one season-level income model.</p>
              </div>
              <Calendar className="w-5 h-5 text-blue-500" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Monthly Salary</label>
                <input type="number" min="0" step="1" value={monthlySalaryInput} onChange={(event) => setMonthlySalaryInput(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Season Months</label>
                <input type="number" min="0" step="1" value={seasonMonthsInput} onChange={(event) => setSeasonMonthsInput(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Events / Season</label>
                <input type="number" min="0" step="1" value={eventsPerSeasonInput} onChange={(event) => setEventsPerSeasonInput(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Avg Team Winnings</label>
                <input type="number" min="0" step="1" value={averageTeamWinningsInput} onChange={(event) => setAverageTeamWinningsInput(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Annual Sponsor</label>
                <input type="number" min="0" step="1" value={annualSponsorInput} onChange={(event) => setAnnualSponsorInput(event.target.value)} className="tool-calc-input w-full" />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Season Salary</p>
                <p className="mt-2 text-2xl font-black text-foreground">${format(season.seasonSalary, 2)}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Prize Net / Event</p>
                <p className="mt-2 text-2xl font-black text-foreground">${format(season.modeledSplitNet, 2)}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Season Prize Net</p>
                <p className="mt-2 text-2xl font-black text-foreground">${format(season.seasonPrizeNet, 2)}</p>
              </div>
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Total Season Income</p>
                <p className="mt-2 text-2xl font-black text-emerald-600">${format(season.totalSeasonIncome, 2)}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Target Income Planner</p>
                <p className="text-sm text-muted-foreground">Work backward from a desired annual total and estimate the average team winnings needed per event.</p>
              </div>
              <Target className="w-5 h-5 text-blue-500" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Target Annual Income</label>
                <input type="number" min="0" step="1" value={targetIncomeInput} onChange={(event) => setTargetIncomeInput(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Guaranteed Base</p>
                <p className="mt-2 text-2xl font-black text-foreground">${format(targetPlan.guaranteedIncome, 2)}</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Income Gap</p>
                <p className="mt-2 text-2xl font-black text-foreground">${format(targetPlan.incomeGap, 2)}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Net Needed / Event</p>
                <p className="mt-2 text-2xl font-black text-foreground">${format(targetPlan.neededNetPerEvent, 2)}</p>
              </div>
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Team Winnings / Event</p>
                <p className="mt-2 text-2xl font-black text-emerald-600">${format(targetPlan.neededTeamWinningsPerEvent, 2)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="mb-4 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Realtime Reading</p>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="font-bold text-foreground">Tournament Split</p>
                <p className="mt-1">A team result of ${format(split.teamWinnings, 2)} turns into about ${format(split.netPerPlayer, 2)} per player after the modeled org cut, staff cut, and personal tax.</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="font-bold text-foreground">Season View</p>
                <p className="mt-1">Salary and sponsors provide ${format(targetPlan.guaranteedIncome, 2)} before tournament upside is counted. Event results then determine how much the year can exceed that floor.</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="font-bold text-foreground">Target Pressure</p>
                <p className="mt-1">To reach ${format(targetPlan.targetIncome, 2)} for the year, this setup needs about ${format(targetPlan.neededTeamWinningsPerEvent, 2)} in average team winnings per event.</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="mb-4 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Copy-Ready Snippets</p>
            <div className="space-y-3">
              {[
                { label: "Prize split", value: splitSnippet },
                { label: "Season plan", value: seasonSnippet },
                { label: "Income target", value: targetSnippet },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-border bg-muted/40 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">{item.label}</p>
                    <button onClick={() => copyValue(item.label, item.value)} className="text-xs font-bold text-blue-600 hover:text-blue-700">
                      {copiedLabel === item.label ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <pre className="mt-2 overflow-x-auto rounded-xl bg-slate-950 p-3 text-xs leading-relaxed text-slate-100">
                    <code>{item.value}</code>
                  </pre>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
            <div className="flex items-start gap-3">
              <Shield className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
              <p className="text-sm leading-relaxed text-muted-foreground">
                This calculator is a planning model, not a contract parser. Real esports deals can include different org splits, salary structures, bonuses, residency taxes, agent fees, and appearance payments that go beyond the simplified inputs here.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <UtilityToolPageShell
      title="Esports Earnings Calculator"
      seoTitle="Online Esports Earnings Calculator - Prize Split, Salary, and Season Income"
      seoDescription="Free online esports earnings calculator. Estimate tournament prize splits, player net earnings, season income, and average winnings needed to hit an annual target."
      canonical="https://usonlinetools.com/gaming/esports-earnings-calculator"
      categoryName="Gaming Calculators"
      categoryHref="/category/gaming"
      heroDescription="Use this online esports earnings calculator to estimate what tournament winnings actually mean once org cuts, staff shares, and taxes are applied. Model a single placement payout, combine prize money with salary and sponsor income for a full season view, and work backward from a target annual number to see what average event performance would be required. The page is designed for players, managers, and creators who want a realistic planning view instead of raw headline prize pool numbers."
      heroIcon={<Trophy className="w-3.5 h-3.5" />}
      calculatorLabel="Esports Income Planner"
      calculatorDescription="Model tournament splits, season income, and target earning goals from a single esports earnings workspace."
      calculator={calculator}
      howSteps={[
        {
          title: "Start with the team winnings, not the full prize pool headline",
          description:
            "Prize pool headlines are often misleading because they describe the total event purse rather than what one team or one player actually receives. This page begins from the team winnings amount so the math stays grounded in the number that would really be split after a placement is secured. That makes the output immediately more useful for realistic planning.",
        },
        {
          title: "Apply org, staff, and tax cuts before thinking about personal earnings",
          description:
            "A player's posted tournament result is rarely the same as their personal cash outcome. Depending on the team structure, part of the money may be reserved for the organization, coaching staff, support staff, or other contractual splits, and tax obligations can reduce the take-home amount further. Modeling those deductions early prevents false assumptions about how much a given placement is actually worth.",
        },
        {
          title: "Combine salaries and sponsors with prize money to model a real season",
          description:
            "Esports income is not only tournament-dependent. In many cases salary and sponsor income provide the stable base, while results create upside. The season planner blends those streams together so you can see whether the year is being carried by contract money, by event performance, or by some combination of both.",
        },
        {
          title: "Use the target planner when you need a performance benchmark",
          description:
            "Sometimes the practical question is not what a season will earn, but what it needs to earn. The target planner works backward from a desired annual total and estimates how much average team winnings per event would be required to close the remaining gap after salary and sponsorship are counted. That can help teams set more realistic expectations for the season ahead.",
        },
      ]}
      interpretationCards={[
        {
          title: "Raw team winnings overstate player take-home income",
          description:
            "Unless there are no cuts and no taxes, the headline placement payout will almost always be larger than the amount a single player actually keeps.",
        },
        {
          title: "Stable salary income can matter more than inconsistent placements",
          description:
            "In many seasons, salary is the income floor that keeps the year predictable, while prize winnings create variance and upside.",
          className: "bg-cyan-500/5 border-cyan-500/20",
        },
        {
          title: "Average event winnings give a cleaner planning metric than one standout run",
          description:
            "Using one lucky placement can distort a season forecast. Averaging events produces a more conservative and usually more useful model.",
          className: "bg-emerald-500/5 border-emerald-500/20",
        },
        {
          title: "Target income planning helps expose unrealistic season expectations",
          description:
            "If the required average winnings per event are much higher than your normal results, the model is telling you the target depends on an unusually strong season rather than typical performance.",
          className: "bg-amber-500/5 border-amber-500/20",
        },
      ]}
      examples={[
        { scenario: "Single tournament split", input: "$25,000 team winnings with org, staff, and tax cuts", output: "Shows the net amount a single player might actually keep" },
        { scenario: "Tier 1 season model", input: "High salary, sponsor support, and strong average placements", output: "Combines stable income and tournament upside into one yearly total" },
        { scenario: "Challenger team outlook", input: "Lower salary and smaller tournament wins", output: "Shows how dependent the season is on consistent placements" },
        { scenario: "Target-income planning", input: "Need $75,000 annual income from current contract setup", output: "Returns the average team winnings needed per event to close the gap" },
      ]}
      whyChoosePoints={[
        "This Esports Earnings Calculator is designed as a real planning tool rather than a superficial prize-pool widget. It models cuts, tax impact, salary, sponsorship, season totals, and income targets in one place, which makes it much more useful for realistic financial thinking around competitive play.",
        "The prize-split section matters because raw team winnings are not the same as personal earnings. By breaking the number down into org share, staff share, tax, and per-player net, the page gives a result that is much closer to what players actually care about.",
        "The season planner matters because esports income is rarely one-dimensional. A player can have modest placements but strong contract support, or strong placements with a weak salary base. Combining those streams gives a clearer view of overall stability and risk.",
        "The target planner is especially helpful because it turns vague career goals into concrete performance benchmarks. Instead of saying a player wants to earn a certain number this year, the page shows what average event results would have to look like for that to happen.",
        "Everything runs in the browser with immediate feedback. That fits the workflow: test assumptions, compare contracts, estimate a season, copy the output, and move on without needing a spreadsheet for every quick scenario.",
      ]}
      faqs={[
        {
          q: "Does this calculator use the full event prize pool?",
          a: "No. It starts from the team winnings amount you enter, which should represent the payout for the placement or event result you want to model.",
        },
        {
          q: "Why include org and staff cuts?",
          a: "Because many teams do not pass the entire placement payout directly to players. Organizations, coaches, and support staff may receive a share depending on the contract structure.",
        },
        {
          q: "Are taxes always applied the same way?",
          a: "No. Tax treatment varies by country, residency, business structure, and contract details. The tax field here is a simplified planning input, not legal advice.",
        },
        {
          q: "Why combine salary and sponsors with prize money?",
          a: "Because those streams often make up a large share of total esports income. Prize money alone can dramatically understate or overstate the actual season picture.",
        },
        {
          q: "What does average team winnings per event mean?",
          a: "It is the average amount your team would bring in from one event result across the season. Using an average helps produce a steadier forecast than relying on one outlier placement.",
        },
        {
          q: "Can I use this for any esport?",
          a: "Yes. The calculator is generic and can be used for shooters, MOBAs, fighting games, sports titles, or any other competitive scene where players split event winnings.",
        },
        {
          q: "Does this replace a real contract review?",
          a: "No. It is a planning calculator only. Actual contracts can include more detailed rules around bonuses, revenue share, taxes, agents, and payment timing.",
        },
        {
          q: "Does the page save my season assumptions?",
          a: "No. The values stay in the current browser state only. The page is built for quick local modeling and comparison.",
        },
      ]}
      relatedTools={[
        { title: "XP Level Calculator", slug: "xp-level-calculator", icon: <BarChart3 className="w-4 h-4" />, color: 210, benefit: "Open another progression-style gaming page" },
        { title: "Game Currency Converter", slug: "game-currency-converter", icon: <Wallet className="w-4 h-4" />, color: 145, benefit: "Compare another gaming economy workflow" },
        { title: "Roblox Tax Calculator", slug: "roblox-tax-calculator", icon: <Users className="w-4 h-4" />, color: 30, benefit: "Stay inside another fee and payout calculator" },
        { title: "Fortnite DPI Calculator", slug: "fortnite-dpi-calculator", icon: <Target className="w-4 h-4" />, color: 340, benefit: "Browse another completed gaming route" },
        { title: "Percentage Calculator", slug: "percentage-calculator", icon: <Copy className="w-4 h-4" />, color: 270, benefit: "Check cut rates and payout percentages" },
        { title: "D&D Dice Roller", slug: "dnd-dice-roller", icon: <RotateCcw className="w-4 h-4" />, color: 20, benefit: "Use another gaming utility page" },
      ]}
      ctaTitle="Need Another Gaming Planning Tool?"
      ctaDescription="Keep moving through the gaming calculator category and continue replacing placeholder routes with real pages."
      ctaHref="/category/gaming"
    />
  );
}
