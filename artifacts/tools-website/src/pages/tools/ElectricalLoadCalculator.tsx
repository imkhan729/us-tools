import { useMemo, useState } from "react";
import { Bolt, Construction, Plus, Trash2, Zap } from "lucide-react";
import ConstructionToolPageShell from "./ConstructionToolPageShell";

type Phase = "single" | "three";

interface LoadRow {
  id: number;
  name: string;
  watts: string;
  quantity: string;
}

const BREAKER_SIZES = [15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 90, 100, 110, 125, 150, 175, 200, 225, 250, 300, 350, 400, 500, 600];

const LOAD_PRESETS = [
  { name: "LED Lighting Circuit", watts: "600", quantity: "1" },
  { name: "Refrigerator", watts: "700", quantity: "1" },
  { name: "Microwave", watts: "1200", quantity: "1" },
  { name: "Window AC", watts: "1500", quantity: "1" },
  { name: "Water Heater", watts: "4500", quantity: "1" },
  { name: "Electric Dryer", watts: "5000", quantity: "1" },
];

function formatNumber(value: number, digits = 2) {
  return value.toLocaleString("en-US", { maximumFractionDigits: digits });
}

function getNextBreakerSize(current: number) {
  return BREAKER_SIZES.find((size) => size >= current) ?? null;
}

export default function ElectricalLoadCalculator() {
  const [phase, setPhase] = useState<Phase>("single");
  const [voltage, setVoltage] = useState("240");
  const [powerFactor, setPowerFactor] = useState("1");
  const [demandFactor, setDemandFactor] = useState("100");
  const [safetyFactor, setSafetyFactor] = useState("125");
  const [rows, setRows] = useState<LoadRow[]>([
    { id: 1, name: "Lighting", watts: "600", quantity: "1" },
    { id: 2, name: "General Receptacles", watts: "1800", quantity: "1" },
    { id: 3, name: "Water Heater", watts: "4500", quantity: "1" },
  ]);

  const addBlankRow = () => {
    setRows((current) => [
      ...current,
      { id: Date.now(), name: `Load ${current.length + 1}`, watts: "", quantity: "1" },
    ]);
  };

  const addPreset = (preset: { name: string; watts: string; quantity: string }) => {
    setRows((current) => [...current, { id: Date.now(), ...preset }]);
  };

  const updateRow = (id: number, field: keyof LoadRow, value: string) => {
    setRows((current) => current.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
  };

  const removeRow = (id: number) => {
    setRows((current) => (current.length > 1 ? current.filter((row) => row.id !== id) : current));
  };

  const result = useMemo(() => {
    const supplyVoltage = parseFloat(voltage);
    const pf = parseFloat(powerFactor);
    const demand = parseFloat(demandFactor);
    const safety = parseFloat(safetyFactor);

    if (
      !Number.isFinite(supplyVoltage) ||
      !Number.isFinite(pf) ||
      !Number.isFinite(demand) ||
      !Number.isFinite(safety) ||
      supplyVoltage <= 0 ||
      pf <= 0 ||
      pf > 1 ||
      demand <= 0 ||
      safety <= 0
    ) {
      return null;
    }

    const validRows = rows
      .map((row) => {
        const wattsValue = parseFloat(row.watts);
        const quantityValue = parseFloat(row.quantity);

        if (!Number.isFinite(wattsValue) || !Number.isFinite(quantityValue) || wattsValue <= 0 || quantityValue <= 0) {
          return null;
        }

        return {
          ...row,
          connectedWatts: wattsValue * quantityValue,
        };
      })
      .filter((row): row is NonNullable<typeof row> => row !== null);

    if (validRows.length === 0) {
      return null;
    }

    const connectedWatts = validRows.reduce((sum, row) => sum + row.connectedWatts, 0);
    const demandWatts = connectedWatts * (demand / 100);
    const designWatts = demandWatts * (safety / 100);
    const currentAmps =
      phase === "three"
        ? designWatts / (Math.sqrt(3) * supplyVoltage * pf)
        : designWatts / (supplyVoltage * pf);

    const recommendedBreaker = getNextBreakerSize(currentAmps);

    return {
      validRows,
      connectedWatts,
      demandWatts,
      designWatts,
      currentAmps,
      recommendedBreaker,
    };
  }, [demandFactor, phase, powerFactor, rows, safetyFactor, voltage]);

  return (
    <ConstructionToolPageShell
      title="Electrical Load Calculator"
      seoTitle="Electrical Load Calculator - Estimate Circuit And Panel Load"
      seoDescription="Calculate connected electrical load, demand-adjusted load, current draw, and recommended breaker size. Free electrical load calculator for basic circuit and panel planning."
      canonical="https://usonlinetools.com/construction/electrical-load-calculator"
      heroDescription="Estimate electrical load from appliances and equipment, apply demand and safety factors, and convert the result into an expected current draw and suggested breaker size."
      heroIcon={<Bolt className="w-3.5 h-3.5" />}
      calculatorLabel="Connected Load Estimator"
      calculatorDescription="Build a simple load schedule, then size the estimated current and breaker from the total connected wattage."
      calculator={
        <div className="space-y-5">
          <div className="rounded-2xl border border-amber-500/15 bg-amber-500/5 p-5">
            <div className="mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <h3 className="text-lg font-bold text-foreground">Supply and sizing assumptions</h3>
            </div>

            <div className="mb-4 flex overflow-hidden rounded-lg border border-border sm:w-fit">
              <button
                onClick={() => setPhase("single")}
                className={`px-4 py-2 text-sm font-bold transition-colors ${phase === "single" ? "bg-amber-600 text-white" : "bg-card text-muted-foreground hover:text-foreground"}`}
              >
                Single Phase
              </button>
              <button
                onClick={() => setPhase("three")}
                className={`px-4 py-2 text-sm font-bold transition-colors ${phase === "three" ? "bg-amber-600 text-white" : "bg-card text-muted-foreground hover:text-foreground"}`}
              >
                Three Phase
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Voltage</label>
                <input type="number" min="1" value={voltage} onChange={(event) => setVoltage(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Power Factor</label>
                <input type="number" min="0.1" max="1" step="0.01" value={powerFactor} onChange={(event) => setPowerFactor(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Demand Factor %</label>
                <input type="number" min="1" value={demandFactor} onChange={(event) => setDemandFactor(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Safety Factor %</label>
                <input type="number" min="100" value={safetyFactor} onChange={(event) => setSafetyFactor(event.target.value)} className="tool-calc-input w-full" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-amber-500/15 bg-background p-5">
            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-lg font-bold text-foreground">Load schedule</h3>
                <p className="text-sm text-muted-foreground">Enter each appliance or circuit as watts times quantity.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={addBlankRow} className="inline-flex items-center gap-1 rounded-lg bg-amber-600 px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-amber-700">
                  <Plus className="w-3.5 h-3.5" />
                  Add Row
                </button>
                {LOAD_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => addPreset(preset)}
                    className="rounded-lg border border-border px-3 py-2 text-xs font-bold text-muted-foreground transition-colors hover:border-amber-500/40 hover:text-foreground"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {rows.map((row) => (
                <div key={row.id} className="grid grid-cols-1 gap-3 rounded-xl border border-border bg-muted/20 p-4 md:grid-cols-[minmax(0,2fr)_140px_120px_48px]">
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Load Name</label>
                    <input type="text" value={row.name} onChange={(event) => updateRow(row.id, "name", event.target.value)} className="tool-calc-input w-full" />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Watts</label>
                    <input type="number" min="0" value={row.watts} onChange={(event) => updateRow(row.id, "watts", event.target.value)} className="tool-calc-input w-full" />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Qty</label>
                    <input type="number" min="0" value={row.quantity} onChange={(event) => updateRow(row.id, "quantity", event.target.value)} className="tool-calc-input w-full" />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={() => removeRow(row.id)}
                      className="flex h-11 w-full items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-red-500/30 hover:text-red-600"
                      aria-label={`Remove ${row.name || "load row"}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {result ? (
            <div className="space-y-4">
              <div className="rounded-2xl border border-amber-500/20 bg-background p-5 text-center">
                <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Recommended Breaker Size</p>
                <p className="text-5xl font-black text-amber-700 dark:text-amber-400">{result.recommendedBreaker ?? "--"}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {result.recommendedBreaker ? `${result.recommendedBreaker} A standard size` : "Current exceeds the highest standard breaker in this quick list."}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Connected Load</p>
                  <p className="text-2xl font-black text-foreground">{formatNumber(result.connectedWatts, 0)}</p>
                  <p className="mt-1 text-xs text-muted-foreground">W</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Demand Load</p>
                  <p className="text-2xl font-black text-foreground">{formatNumber(result.demandWatts, 0)}</p>
                  <p className="mt-1 text-xs text-muted-foreground">W after demand factor</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Design Load</p>
                  <p className="text-2xl font-black text-foreground">{formatNumber(result.designWatts, 0)}</p>
                  <p className="mt-1 text-xs text-muted-foreground">W after safety factor</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Estimated Current</p>
                  <p className="text-2xl font-black text-foreground">{formatNumber(result.currentAmps, 2)}</p>
                  <p className="mt-1 text-xs text-muted-foreground">A</p>
                </div>
              </div>

              <div className="rounded-2xl border border-yellow-500/15 bg-yellow-500/5 p-5">
                <h3 className="mb-3 text-lg font-bold text-foreground">Included loads</h3>
                <div className="space-y-2">
                  {result.validRows.map((row) => (
                    <div key={row.id} className="flex items-center justify-between gap-4 rounded-lg border border-border bg-card px-3 py-2 text-sm">
                      <span className="font-medium text-foreground">{row.name}</span>
                      <span className="text-muted-foreground">{formatNumber(row.connectedWatts, 0)} W</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Enter at least one valid load row plus voltage and sizing factors to calculate the electrical load.</p>
          )}

          <div className="rounded-2xl border border-yellow-500/15 bg-yellow-500/5 p-5">
            <div className="mb-3 flex items-center gap-2">
              <Construction className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
              <h3 className="text-lg font-bold text-foreground">Planning note</h3>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              This is a sizing estimate for planning and budgeting. Final circuit, feeder, and service sizing should be checked against local electrical code, motor starting current, conductor limits, and manufacturer data.
            </p>
          </div>
        </div>
      }
      howToTitle="How to Use the Electrical Load Calculator"
      howToIntro="Electrical load planning starts with a clear schedule of connected equipment, then applies demand and safety assumptions before converting the final wattage into current."
      howSteps={[
        {
          title: "Select the phase and enter the supply assumptions",
          description: "Choose single-phase or three-phase service, then enter the system voltage, power factor, demand factor, and safety factor you want to use in the estimate.",
        },
        {
          title: "Build the load schedule",
          description: "Add each appliance, outlet group, or circuit as a wattage and quantity. The calculator multiplies each row and sums the connected load automatically.",
        },
        {
          title: "Review the adjusted load and breaker suggestion",
          description: "The tool shows connected watts, demand-adjusted watts, design watts, estimated current, and the next standard breaker size above the calculated amperage.",
        },
      ]}
      formulaTitle="Electrical Load Formulas"
      formulaIntro="These are the common planning formulas used for a simple electrical load estimate. They are useful for quick circuit and panel checks before detailed code review."
      formulaCards={[
        {
          label: "Connected Load",
          formula: "Connected Load = sum(Watts x Quantity)",
          detail: "Every entered appliance or circuit contributes its wattage multiplied by the number of identical loads.",
        },
        {
          label: "Demand And Safety",
          formula: "Design Watts = Connected Load x Demand Factor x Safety Factor",
          detail: "Demand factor reduces the connected load to a likely operating load, while the safety factor raises the design load for continuous-use planning.",
        },
        {
          label: "Current",
          formula: "Single-phase: I = W / (V x PF) | Three-phase: I = W / (1.732 x V x PF)",
          detail: "Current is calculated from design watts, supply voltage, and power factor. The suggested breaker is the next common standard size above that result.",
        },
      ]}
      examplesTitle="Electrical Load Examples"
      examplesIntro="These examples show how a quick load schedule translates into a usable current and breaker estimate."
      examples={[
        {
          title: "Connected Load",
          value: "6,900 W",
          detail: "Lighting at 600 W, receptacles at 1,800 W, and a 4,500 W water heater create 6,900 watts of connected load.",
        },
        {
          title: "Design Load",
          value: "8,625 W",
          detail: "With a 100% demand factor and 125% safety factor, that same connected load becomes 8,625 watts for sizing.",
        },
        {
          title: "Breaker Estimate",
          value: "40 A",
          detail: "At 240 V single-phase and power factor 1.0, 8,625 watts is about 35.9 amps, so the next common breaker size is 40 amps.",
        },
      ]}
      contentTitle="Why Electrical Load Planning Matters"
      contentIntro="A simple load estimate is often the fastest way to compare equipment choices, panel capacity, and circuit sizing before detailed design begins."
      contentSections={[
        {
          title: "Why connected load and demand load are different",
          paragraphs: [
            "Connected load assumes every listed appliance is present and counted at full nameplate wattage. In practice, not every load operates at the same time, which is why planners often apply a demand factor.",
            "The demand factor helps turn a raw schedule into a more realistic operating estimate, especially for mixed-use spaces and panels serving several branch circuits.",
          ],
        },
        {
          title: "Why safety factor is useful for circuit sizing",
          paragraphs: [
            "Continuous-use loads and conservative planning often justify sizing above the calculated running current. A safety factor gives you a quick way to reflect that margin in the estimate.",
            "This does not replace code tables, but it does help you avoid treating a bare minimum calculation as if it were a finished design.",
          ],
        },
        {
          title: "What this calculator does not cover",
          paragraphs: [
            "Motor starting current, demand tables from local code, conductor ampacity corrections, ambient temperature adjustments, and panel diversity rules can all change the final design.",
            "Use this calculator for planning, budgeting, and sanity-checking. For permit work or final installation, verify the design against the applicable electrical standard and manufacturer requirements.",
          ],
        },
      ]}
      faqs={[
        {
          q: "What is the difference between connected load and demand load?",
          a: "Connected load is the full sum of all listed wattages. Demand load applies a percentage to reflect that not every load is expected to run at full power at the same time.",
        },
        {
          q: "Why does the calculator ask for power factor?",
          a: "Power factor affects the current drawn for a given wattage. A lower power factor means higher current for the same real power, which matters when estimating breaker size.",
        },
        {
          q: "Is the suggested breaker size code-compliant?",
          a: "It is a quick estimate only. Final breaker, conductor, and equipment sizing should be checked against the actual electrical code, the type of load, and the installation conditions.",
        },
        {
          q: "Can I use this for a full building service calculation?",
          a: "It can help you build an early planning estimate, but full service calculations often require additional demand rules, diversity assumptions, and code-specific adjustments that go beyond this simplified tool.",
        },
      ]}
      relatedTools={[
        { title: "Material Cost Calculator", href: "/construction/material-cost-calculator", benefit: "Turn electrical quantities into a project budget." },
        { title: "Electric Current Converter", href: "/conversion/electric-current-converter", benefit: "Convert amps across current units and scales." },
        { title: "Power Converter", href: "/conversion/power-converter", benefit: "Convert watts, kilowatts, horsepower, and more." },
      ]}
      quickFacts={[
        { label: "Best For", value: "Circuit Planning", detail: "Useful for quick branch-circuit and small panel estimates." },
        { label: "Core Output", value: "Watts, Amps, Breaker", detail: "Shows connected load, adjusted load, current, and a suggested breaker size." },
        { label: "Important Note", value: "Verify Final Design", detail: "Always confirm with code requirements and equipment data before installation." },
      ]}
    />
  );
}
