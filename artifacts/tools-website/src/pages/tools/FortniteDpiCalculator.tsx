import { useMemo, useState } from "react";
import {
  Compass,
  Copy,
  Crosshair,
  Gamepad2,
  Gauge,
  Mouse,
  RotateCcw,
  Shield,
  TrendingUp,
} from "lucide-react";
import UtilityToolPageShell from "./UtilityToolPageShell";

function toNumber(input: string, fallback = 0) {
  const value = Number.parseFloat(input);
  return Number.isFinite(value) ? value : fallback;
}

function positive(input: string, fallback = 0) {
  return Math.max(0, toNumber(input, fallback));
}

function clamp(input: number, min: number, max: number) {
  return Math.min(max, Math.max(min, input));
}

function format(value: number, digits = 2) {
  return value.toLocaleString("en-US", { maximumFractionDigits: digits });
}

function percentageToEdpi(dpi: number, percentage: number) {
  if (dpi <= 0 || percentage <= 0) return 0;
  return dpi * (percentage / 100);
}

export default function FortniteDpiCalculator() {
  const [mouseDpi, setMouseDpi] = useState("800");
  const [xSensitivity, setXSensitivity] = useState("6.5");
  const [ySensitivity, setYSensitivity] = useState("6.5");
  const [targetingMultiplier, setTargetingMultiplier] = useState("45");
  const [scopeMultiplier, setScopeMultiplier] = useState("45");
  const [buildMultiplier, setBuildMultiplier] = useState("1.6");
  const [editMultiplier, setEditMultiplier] = useState("1.6");
  const [sourceDpi, setSourceDpi] = useState("800");
  const [sourceSensitivity, setSourceSensitivity] = useState("6.5");
  const [targetDpi, setTargetDpi] = useState("1600");
  const [desiredEdpi, setDesiredEdpi] = useState("52");
  const [copiedLabel, setCopiedLabel] = useState("");

  const baseline = useMemo(() => {
    const dpi = positive(mouseDpi, 0);
    const x = positive(xSensitivity, 0);
    const y = positive(ySensitivity, 0);
    const targeting = positive(targetingMultiplier, 0);
    const scope = positive(scopeMultiplier, 0);
    const build = positive(buildMultiplier, 0);
    const edit = positive(editMultiplier, 0);
    const xEdpi = percentageToEdpi(dpi, x);
    const yEdpi = percentageToEdpi(dpi, y);
    const averageEdpi = (xEdpi + yEdpi) / 2;
    const adsEdpi = averageEdpi * (targeting / 100);
    const scopedEdpi = averageEdpi * (scope / 100);
    const buildEdpi = averageEdpi * build;
    const editEdpi = averageEdpi * edit;
    const axisSpread = xEdpi - yEdpi;
    return {
      dpi,
      x,
      y,
      targeting,
      scope,
      build,
      edit,
      xEdpi,
      yEdpi,
      averageEdpi,
      adsEdpi,
      scopedEdpi,
      buildEdpi,
      editEdpi,
      axisSpread,
    };
  }, [buildMultiplier, editMultiplier, mouseDpi, scopeMultiplier, targetingMultiplier, xSensitivity, ySensitivity]);

  const transfer = useMemo(() => {
    const sourceMouseDpi = positive(sourceDpi, 0);
    const sourceHip = positive(sourceSensitivity, 0);
    const targetMouseDpi = positive(targetDpi, 0);
    const sourceEdpi = percentageToEdpi(sourceMouseDpi, sourceHip);
    const equivalentSensitivity = targetMouseDpi > 0 ? (sourceEdpi / targetMouseDpi) * 100 : 0;
    const sourceTargeting = sourceEdpi * 0.45;
    const targetTargeting = percentageToEdpi(targetMouseDpi, equivalentSensitivity) * 0.45;
    return {
      sourceMouseDpi,
      sourceHip,
      targetMouseDpi,
      sourceEdpi,
      equivalentSensitivity,
      sourceTargeting,
      targetTargeting,
    };
  }, [sourceDpi, sourceSensitivity, targetDpi]);

  const planner = useMemo(() => {
    const dpi = positive(targetDpi, 0);
    const edpi = positive(desiredEdpi, 0);
    const sensitivityNeeded = dpi > 0 ? (edpi / dpi) * 100 : 0;
    const lowBand = sensitivityNeeded * 0.95;
    const highBand = sensitivityNeeded * 1.05;
    const recommendedAds = clamp(sensitivityNeeded * 0.45, 1, 100);
    return {
      dpi,
      edpi,
      sensitivityNeeded,
      lowBand,
      highBand,
      recommendedAds,
    };
  }, [desiredEdpi, targetDpi]);

  const copyValue = async (label: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedLabel(label);
    window.setTimeout(() => setCopiedLabel(""), 1800);
  };

  const resetAll = () => {
    setMouseDpi("800");
    setXSensitivity("6.5");
    setYSensitivity("6.5");
    setTargetingMultiplier("45");
    setScopeMultiplier("45");
    setBuildMultiplier("1.6");
    setEditMultiplier("1.6");
    setSourceDpi("800");
    setSourceSensitivity("6.5");
    setTargetDpi("1600");
    setDesiredEdpi("52");
  };

  const loadBalancedPreset = () => {
    setMouseDpi("800");
    setXSensitivity("6.0");
    setYSensitivity("6.0");
    setTargetingMultiplier("45");
    setScopeMultiplier("45");
    setBuildMultiplier("1.7");
    setEditMultiplier("1.7");
  };

  const loadFastPreset = () => {
    setMouseDpi("1600");
    setXSensitivity("4.4");
    setYSensitivity("4.4");
    setTargetingMultiplier("40");
    setScopeMultiplier("40");
    setBuildMultiplier("1.9");
    setEditMultiplier("1.9");
  };

  const baselineSnippet = [
    `Fortnite DPI: ${baseline.dpi}`,
    `X sens: ${format(baseline.x, 2)}%`,
    `Y sens: ${format(baseline.y, 2)}%`,
    `Hip-fire eDPI: ${format(baseline.averageEdpi, 2)}`,
    `ADS eDPI: ${format(baseline.adsEdpi, 2)}`,
    `Scoped eDPI: ${format(baseline.scopedEdpi, 2)}`,
    `Build multiplier: ${format(baseline.build, 2)}x`,
    `Edit multiplier: ${format(baseline.edit, 2)}x`,
  ].join("\n");

  const transferSnippet = [
    `Source DPI: ${transfer.sourceMouseDpi}`,
    `Source hip sens: ${format(transfer.sourceHip, 2)}%`,
    `Source eDPI: ${format(transfer.sourceEdpi, 2)}`,
    `Target DPI: ${transfer.targetMouseDpi}`,
    `Equivalent target hip sens: ${format(transfer.equivalentSensitivity, 3)}%`,
    `Suggested ADS multiplier band: 40% to 50%`,
  ].join("\n");

  const plannerSnippet = [
    `Desired eDPI: ${format(planner.edpi, 2)}`,
    `Target DPI: ${planner.dpi}`,
    `Needed hip sens: ${format(planner.sensitivityNeeded, 3)}%`,
    `Testing band: ${format(planner.lowBand, 3)}% to ${format(planner.highBand, 3)}%`,
    `Suggested ADS multiplier: ${format(planner.recommendedAds, 2)}%`,
  ].join("\n");

  const calculator = (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <button onClick={loadBalancedPreset} className="rounded-full border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:border-blue-500/40 hover:bg-muted">
          Load Balanced Preset
        </button>
        <button onClick={loadFastPreset} className="rounded-full border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:border-blue-500/40 hover:bg-muted">
          Load Fast Builder Preset
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
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Fortnite Baseline DPI</p>
                <p className="text-sm text-muted-foreground">Turn your Fortnite percentages into practical eDPI values for aim, ADS, build, and edit speed.</p>
              </div>
              <Crosshair className="w-5 h-5 text-blue-500" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Mouse DPI</label>
                <input type="number" min="1" value={mouseDpi} onChange={(event) => setMouseDpi(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">X Sensitivity %</label>
                <input type="number" min="0" step="0.1" value={xSensitivity} onChange={(event) => setXSensitivity(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Y Sensitivity %</label>
                <input type="number" min="0" step="0.1" value={ySensitivity} onChange={(event) => setYSensitivity(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Targeting Multiplier %</label>
                <input type="number" min="0" step="0.1" value={targetingMultiplier} onChange={(event) => setTargetingMultiplier(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Scoped Multiplier %</label>
                <input type="number" min="0" step="0.1" value={scopeMultiplier} onChange={(event) => setScopeMultiplier(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Build Multiplier</label>
                <input type="number" min="0" step="0.01" value={buildMultiplier} onChange={(event) => setBuildMultiplier(event.target.value)} className="tool-calc-input w-full" />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Edit Multiplier</label>
                <input type="number" min="0" step="0.01" value={editMultiplier} onChange={(event) => setEditMultiplier(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Axis Balance</p>
                <p className="mt-2 text-2xl font-black text-foreground">{format(baseline.axisSpread, 2)}</p>
                <p className="mt-1 text-xs text-muted-foreground">Difference between X-axis and Y-axis eDPI. Zero means matched axes.</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Hip-fire eDPI</p>
                <p className="mt-2 text-2xl font-black text-foreground">{format(baseline.averageEdpi, 2)}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">ADS eDPI</p>
                <p className="mt-2 text-2xl font-black text-foreground">{format(baseline.adsEdpi, 2)}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Scoped eDPI</p>
                <p className="mt-2 text-2xl font-black text-foreground">{format(baseline.scopedEdpi, 2)}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Build eDPI</p>
                <p className="mt-2 text-2xl font-black text-foreground">{format(baseline.buildEdpi, 2)}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Edit eDPI</p>
                <p className="mt-2 text-2xl font-black text-foreground">{format(baseline.editEdpi, 2)}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">X / Y eDPI</p>
                <p className="mt-2 text-lg font-black text-foreground">{format(baseline.xEdpi, 2)} / {format(baseline.yEdpi, 2)}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">DPI Transfer Calculator</p>
                <p className="text-sm text-muted-foreground">Keep the same Fortnite eDPI when changing mouse DPI or copying another setup.</p>
              </div>
              <Mouse className="w-5 h-5 text-blue-500" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Source DPI</label>
                <input type="number" min="1" value={sourceDpi} onChange={(event) => setSourceDpi(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Source Hip Sens %</label>
                <input type="number" min="0" step="0.1" value={sourceSensitivity} onChange={(event) => setSourceSensitivity(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Target DPI</label>
                <input type="number" min="1" value={targetDpi} onChange={(event) => setTargetDpi(event.target.value)} className="tool-calc-input w-full" />
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Equivalent Target Hip Sens</p>
                  <p className="mt-2 text-3xl font-black text-emerald-600">{format(transfer.equivalentSensitivity, 3)}%</p>
                </div>
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-border bg-card p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Source eDPI</p>
                  <p className="mt-2 text-2xl font-black text-foreground">{format(transfer.sourceEdpi, 2)}</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Target eDPI</p>
                  <p className="mt-2 text-2xl font-black text-foreground">{format(percentageToEdpi(transfer.targetMouseDpi, transfer.equivalentSensitivity), 2)}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Target eDPI Planner</p>
                <p className="text-sm text-muted-foreground">Work backwards from a target Fortnite eDPI and generate a testing band for your next session.</p>
              </div>
              <Compass className="w-5 h-5 text-blue-500" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Desired eDPI</label>
                <input type="number" min="0" step="0.1" value={desiredEdpi} onChange={(event) => setDesiredEdpi(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Needed Hip Sens %</p>
                <p className="mt-2 text-2xl font-black text-foreground">{format(planner.sensitivityNeeded, 3)}%</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Low Test Band</p>
                <p className="mt-2 text-2xl font-black text-foreground">{format(planner.lowBand, 3)}%</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">High Test Band</p>
                <p className="mt-2 text-2xl font-black text-foreground">{format(planner.highBand, 3)}%</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Suggested ADS %</p>
                <p className="mt-2 text-2xl font-black text-foreground">{format(planner.recommendedAds, 2)}%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="mb-4 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Realtime Reading</p>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="font-bold text-foreground">Aim Baseline</p>
                <p className="mt-1">Your current average hip-fire eDPI is {format(baseline.averageEdpi, 2)}. That is the main number to preserve when you change mouse DPI but want the same raw Fortnite feel.</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="font-bold text-foreground">Builder Speed</p>
                <p className="mt-1">Your current build and edit multipliers raise the baseline to {format(baseline.buildEdpi, 2)} and {format(baseline.editEdpi, 2)} eDPI. Higher values speed up piece control, but they also raise the risk of overflicking during tight edits.</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="font-bold text-foreground">Transfer Result</p>
                <p className="mt-1">Moving from {transfer.sourceMouseDpi} DPI to {transfer.targetMouseDpi} DPI while keeping the same feel gives a target sensitivity of {format(transfer.equivalentSensitivity, 3)}%.</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="mb-4 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Copy-Ready Snippets</p>
            <div className="space-y-3">
              {[
                { label: "Fortnite baseline", value: baselineSnippet },
                { label: "DPI transfer", value: transferSnippet },
                { label: "Target planner", value: plannerSnippet },
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
                Fortnite sensitivity tuning is split across aim, targeting, scoped aim, build, and edit settings. Matching hip-fire eDPI is the clean starting point, but real gameplay still matters because close-range tracking, shotgun flicks, and edit chains stress the setup differently.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <UtilityToolPageShell
      title="Online Fortnite DPI Calculator"
      seoTitle="Online Fortnite DPI Calculator - eDPI, ADS, Scoped, Build, and Edit Sens"
      seoDescription="Free online Fortnite DPI calculator. Calculate Fortnite eDPI, ADS and scoped sensitivity, build and edit speed, and convert settings when changing mouse DPI."
      canonical="https://usonlinetools.com/gaming/fortnite-dpi-calculator"
      categoryName="Gaming Calculators"
      categoryHref="/category/gaming"
      heroDescription="Use this online Fortnite DPI calculator to turn raw Fortnite sensitivity percentages into practical aim numbers you can compare and tune. Calculate hip-fire eDPI, ADS eDPI, scoped eDPI, and build or edit speed from the same page, then transfer the setup to a different mouse DPI without losing the feel you already know. The page is built for players who want cleaner sensitivity decisions instead of random trial and error between matches."
      heroIcon={<Gamepad2 className="w-3.5 h-3.5" />}
      calculatorLabel="Fortnite DPI Workspace"
      calculatorDescription="Measure your current Fortnite eDPI, convert between mouse DPI values, and plan a target setup before you test it in game."
      calculator={calculator}
      howSteps={[
        {
          title: "Translate Fortnite percentages into a real baseline first",
          description:
            "Fortnite sensitivity is often discussed in percentages, but that can hide the real relationship between your mouse and your game. A player on 400 DPI and 10% does not feel the same as a player on 1600 DPI and 10%. That is why the first panel converts your X-axis and Y-axis settings into eDPI. Once the baseline is expressed that way, you can compare setups more honestly and keep the same feel when hardware changes.",
        },
        {
          title: "Separate raw aim speed from build and edit speed",
          description:
            "Fortnite is different from many shooters because the ideal setup is not just about gunfight sensitivity. Players also care about how fast they can place builds, confirm edits, and recover after fast camera movements. This calculator keeps those layers separate. You can see your hip-fire eDPI, then compare how build and edit multipliers increase that pace without guessing in the settings menu.",
        },
        {
          title: "Use the DPI transfer section when switching mice or copying another setup",
          description:
            "A very common Fortnite workflow is moving from one DPI to another while trying to keep the same overall feel. The transfer section solves that directly. Enter the source DPI and source sensitivity, then choose the target DPI. The page returns the equivalent Fortnite percentage that preserves the same eDPI. That makes hardware swaps or profile sharing much faster and less error-prone.",
        },
        {
          title: "Work backwards from target eDPI when you want a tighter testing loop",
          description:
            "Many players already know the eDPI band they like even if they are unsure about the exact percentage they want to use next. The planner section lets you start from that target eDPI and convert it into a Fortnite sensitivity percentage at the DPI you actually run. It also provides a small testing band so you can try a slightly lower and slightly higher value in a focused session instead of changing numbers blindly.",
        },
      ]}
      interpretationCards={[
        {
          title: "Lower eDPI usually means steadier tracking and finer shotgun corrections",
          description:
            "A lower Fortnite eDPI slows the setup down. That often helps with micro-corrections and disciplined aim, but it can feel restrictive during fast turns or layered build fights if pushed too far.",
        },
        {
          title: "Higher eDPI speeds up turns, builds, and close-range reactions",
          description:
            "A higher Fortnite eDPI gives faster camera movement and often feels more agile in box fights or piece control. The tradeoff is reduced margin for tiny corrections when holding a narrow angle or tracking a jump-heavy target.",
          className: "bg-cyan-500/5 border-cyan-500/20",
        },
        {
          title: "Axis spread should usually stay close to zero unless you want a deliberate vertical bias",
          description:
            "If X-axis and Y-axis eDPI differ by too much, the setup can feel uneven during diagonal tracking and flicks. Some players prefer a slight difference, but a very large spread usually needs a reason rather than happening by accident.",
          className: "bg-emerald-500/5 border-emerald-500/20",
        },
        {
          title: "Build and edit multipliers should support, not overpower, your base aim",
          description:
            "Raising build or edit speed can improve responsiveness in high-tempo fights, but if those multipliers drift too far from your base aiming comfort zone the setup can become harder to control under pressure.",
          className: "bg-amber-500/5 border-amber-500/20",
        },
      ]}
      examples={[
        { scenario: "Standard mid-range setup", input: "800 DPI with 6.5% X and 6.5% Y", output: "About 52.0 hip-fire eDPI" },
        { scenario: "Lower ADS for precise rifle tracking", input: "52 eDPI with 45% targeting multiplier", output: "About 23.4 ADS eDPI" },
        { scenario: "DPI upgrade without changing feel", input: "6.5% at 800 DPI moved to 1600 DPI", output: "Equivalent hip-fire sens is about 3.25%" },
        { scenario: "Planner for a tighter setup", input: "Target 48 eDPI at 1600 DPI", output: "Needed Fortnite hip-fire sens is about 3.0%" },
      ]}
      whyChoosePoints={[
        "This Fortnite DPI Calculator is built around the way Fortnite players actually tune settings. Instead of showing one thin formula, it covers hip-fire aim, ADS and scoped sensitivity, build speed, edit speed, and DPI transfer in one place. That makes it much more practical for repeated setup work.",
        "The core metric here is eDPI, because it gives a cleaner comparison baseline than raw sensitivity percentages alone. Fortnite percentages only become useful for comparison when they are anchored to mouse DPI. By converting that relationship immediately, the page helps you reason about your setup in a way that survives hardware changes and shared config discussions.",
        "The transfer workflow is especially useful because many players upgrade mice, move between DPI values, or try settings from creators and teammates. Preserving the same eDPI when you do that avoids the usual problem of accidentally testing two different variables at once.",
        "The page also separates aim speed from build and edit speed, which matters in Fortnite more than in most traditional shooters. A setup can feel good for AR tracking and still feel bad for quick edits, or vice versa. Showing those layers together makes the page more honest and more useful.",
        "Everything runs locally in the browser with immediate results. That is the right interaction model for a Fortnite sensitivity utility: enter numbers, compare outcomes, copy the result, test a few matches, and return if one more adjustment is needed.",
      ]}
      faqs={[
        {
          q: "What is Fortnite eDPI?",
          a: "Fortnite eDPI is a simplified comparison metric built from your mouse DPI and your in-game sensitivity percentage. It gives you a more stable way to compare setups than looking at raw percentage values alone.",
        },
        {
          q: "How do I keep the same Fortnite sensitivity after changing DPI?",
          a: "Use the DPI transfer section. Enter the old DPI and old Fortnite hip-fire sensitivity, then enter the new DPI. The calculator returns the equivalent Fortnite sensitivity percentage needed to preserve the same eDPI.",
        },
        {
          q: "Why calculate X-axis and Y-axis separately?",
          a: "Fortnite lets players split horizontal and vertical sensitivity. Tracking the two axes separately helps you see whether the setup is balanced or whether one axis is unintentionally much faster than the other.",
        },
        {
          q: "What is a good ADS multiplier in Fortnite?",
          a: "There is no universal best value, but many players test within a narrower band than their hip-fire speed so scoped aim feels calmer. The calculator does not force one answer, but it gives you a practical range to start from.",
        },
        {
          q: "Should build and edit multipliers match each other?",
          a: "Not always. Some players want edits slightly faster than builds, while others keep them equal for consistency. The important part is that the multipliers support your actual playstyle instead of pushing speed beyond your control.",
        },
        {
          q: "Does this calculator use controller settings?",
          a: "No. This page is designed for mouse and keyboard Fortnite sensitivity planning. Controller aim has a very different structure and should be treated separately.",
        },
        {
          q: "Can I use this calculator if I only know my target eDPI?",
          a: "Yes. The planner section works backwards from your desired eDPI and target mouse DPI, then shows the Fortnite percentage needed to reach that setup.",
        },
        {
          q: "Does the page save my Fortnite profile?",
          a: "No. The values stay in the current page state only. The calculator is meant for fast local testing rather than persistent profile storage.",
        },
      ]}
      relatedTools={[
        { title: "Valorant Sensitivity Calculator", slug: "valorant-sensitivity-calculator", icon: <Crosshair className="w-4 h-4" />, color: 350, benefit: "Convert and compare another competitive FPS setup" },
        { title: "CS2 Sensitivity Calculator", slug: "cs2-sensitivity-calculator", icon: <Mouse className="w-4 h-4" />, color: 210, benefit: "Check a CS-style sensitivity workflow" },
        { title: "Blox Fruits Calculator", slug: "blox-fruits-calculator", icon: <Gauge className="w-4 h-4" />, color: 35, benefit: "Jump to another completed gaming page" },
        { title: "Blox Fruits Trade Calculator", slug: "blox-fruits-trade-calculator", icon: <TrendingUp className="w-4 h-4" />, color: 145, benefit: "Use a second live Roblox gaming tool" },
        { title: "Percentage Calculator", slug: "percentage-calculator", icon: <Copy className="w-4 h-4" />, color: 265, benefit: "Measure relative sensitivity changes in percent" },
        { title: "D&D Dice Roller", slug: "dnd-dice-roller", icon: <RotateCcw className="w-4 h-4" />, color: 25, benefit: "Browse another live gaming utility" },
      ]}
      ctaTitle="Need Another Gaming Setup Tool?"
      ctaDescription="Move through the rest of the gaming calculator category without leaving the same tool hub."
      ctaHref="/category/gaming"
    />
  );
}
