import { useMemo, useState } from "react";
import {
  Copy,
  Crosshair,
  Gauge,
  Mouse,
  RotateCcw,
  Shield,
  Target,
  TrendingUp,
} from "lucide-react";
import UtilityToolPageShell from "./UtilityToolPageShell";

type GameId = "cs2" | "valorant" | "apex" | "source" | "custom";

const GAME_YAWS: Record<GameId, { label: string; yaw: number; note: string }> = {
  cs2: { label: "CS2", yaw: 0.022, note: "CS2 uses the classic Source-style yaw base for hip-fire sensitivity." },
  valorant: { label: "Valorant", yaw: 0.07, note: "Valorant uses a larger base yaw, which is why equivalent sens numbers look lower in CS2." },
  apex: { label: "Apex Legends", yaw: 0.022, note: "Apex hip-fire is commonly treated as a 1:1 yaw match with CS-style conversions." },
  source: { label: "Source Titles", yaw: 0.022, note: "Legacy Source games such as TF2 and Left 4 Dead generally match the same yaw family." },
  custom: { label: "Custom Yaw", yaw: 0.022, note: "Use this when you already know the game's yaw constant or want manual control." },
};

function toNumber(input: string, fallback = 0) {
  const value = Number.parseFloat(input);
  return Number.isFinite(value) ? value : fallback;
}

function positive(input: string, fallback = 0) {
  return Math.max(0, toNumber(input, fallback));
}

function format(value: number, digits = 3) {
  return value.toLocaleString("en-US", { maximumFractionDigits: digits });
}

function cm360(dpi: number, sensitivity: number, yaw: number) {
  if (dpi <= 0 || sensitivity <= 0 || yaw <= 0) return 0;
  return (360 / (dpi * sensitivity * yaw)) * 2.54;
}

function equivalentSensitivity(sourceSens: number, sourceDpi: number, sourceYaw: number, targetDpi: number, targetYaw: number) {
  if (sourceSens <= 0 || sourceDpi <= 0 || sourceYaw <= 0 || targetDpi <= 0 || targetYaw <= 0) return 0;
  return (sourceSens * sourceDpi * sourceYaw) / (targetDpi * targetYaw);
}

export default function Cs2SensitivityCalculator() {
  const [cs2Dpi, setCs2Dpi] = useState("800");
  const [cs2Sens, setCs2Sens] = useState("1.2");
  const [zoomRatio, setZoomRatio] = useState("1");
  const [sourceGame, setSourceGame] = useState<GameId>("valorant");
  const [targetGame, setTargetGame] = useState<GameId>("cs2");
  const [sourceSens, setSourceSens] = useState("0.378");
  const [sourceDpi, setSourceDpi] = useState("800");
  const [targetDpi, setTargetDpi] = useState("800");
  const [customSourceYaw, setCustomSourceYaw] = useState("0.022");
  const [customTargetYaw, setCustomTargetYaw] = useState("0.022");
  const [copiedLabel, setCopiedLabel] = useState("");

  const cs2Metrics = useMemo(() => {
    const dpi = positive(cs2Dpi, 0);
    const sens = positive(cs2Sens, 0);
    const zoom = positive(zoomRatio, 0);
    const edpi = dpi * sens;
    const scopedEdpi = edpi * (zoom || 0);
    const distanceCm = cm360(dpi, sens, GAME_YAWS.cs2.yaw);
    const distanceInches = distanceCm / 2.54;
    return { dpi, sens, zoom, edpi, scopedEdpi, distanceCm, distanceInches };
  }, [cs2Dpi, cs2Sens, zoomRatio]);

  const conversion = useMemo(() => {
    const sourceYaw = sourceGame === "custom" ? positive(customSourceYaw, 0) : GAME_YAWS[sourceGame].yaw;
    const targetYaw = targetGame === "custom" ? positive(customTargetYaw, 0) : GAME_YAWS[targetGame].yaw;
    const sourceSensitivity = positive(sourceSens, 0);
    const sourceMouseDpi = positive(sourceDpi, 0);
    const targetMouseDpi = positive(targetDpi, 0);
    const targetSensitivity = equivalentSensitivity(sourceSensitivity, sourceMouseDpi, sourceYaw, targetMouseDpi, targetYaw);
    const sourceDistance = cm360(sourceMouseDpi, sourceSensitivity, sourceYaw);
    const targetDistance = cm360(targetMouseDpi, targetSensitivity, targetYaw);
    const sourceEdpi = sourceMouseDpi * sourceSensitivity;
    const targetEdpi = targetMouseDpi * targetSensitivity;
    const diff = targetDistance - sourceDistance;
    return {
      sourceYaw,
      targetYaw,
      sourceSensitivity,
      sourceMouseDpi,
      targetMouseDpi,
      targetSensitivity,
      sourceDistance,
      targetDistance,
      sourceEdpi,
      targetEdpi,
      diff,
    };
  }, [customSourceYaw, customTargetYaw, sourceDpi, sourceGame, sourceSens, targetDpi, targetGame]);

  const copyValue = async (label: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedLabel(label);
    window.setTimeout(() => setCopiedLabel(""), 1800);
  };

  const resetAll = () => {
    setCs2Dpi("800");
    setCs2Sens("1.2");
    setZoomRatio("1");
    setSourceGame("valorant");
    setTargetGame("cs2");
    setSourceSens("0.378");
    setSourceDpi("800");
    setTargetDpi("800");
    setCustomSourceYaw("0.022");
    setCustomTargetYaw("0.022");
  };

  const loadApexPreset = () => {
    setSourceGame("apex");
    setTargetGame("cs2");
    setSourceSens("1.2");
    setSourceDpi("800");
    setTargetDpi("800");
  };

  const loadValorantPreset = () => {
    setSourceGame("valorant");
    setTargetGame("cs2");
    setSourceSens("0.314");
    setSourceDpi("800");
    setTargetDpi("800");
  };

  const metricSnippet = [
    `CS2 DPI: ${cs2Metrics.dpi}`,
    `CS2 sens: ${cs2Metrics.sens}`,
    `CS2 eDPI: ${format(cs2Metrics.edpi, 2)}`,
    `CS2 cm/360: ${format(cs2Metrics.distanceCm, 2)}`,
    `Zoom ratio: ${format(cs2Metrics.zoom, 3)}`,
    `Scoped eDPI: ${format(cs2Metrics.scopedEdpi, 2)}`,
  ].join("\n");

  const conversionSnippet = [
    `Source: ${GAME_YAWS[sourceGame].label} @ sens ${conversion.sourceSensitivity} on ${conversion.sourceMouseDpi} DPI`,
    `Target: ${GAME_YAWS[targetGame].label} on ${conversion.targetMouseDpi} DPI`,
    `Equivalent target sens: ${format(conversion.targetSensitivity, 4)}`,
    `Source cm/360: ${format(conversion.sourceDistance, 2)}`,
    `Target cm/360: ${format(conversion.targetDistance, 2)}`,
  ].join("\n");

  const calculator = (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <button onClick={loadValorantPreset} className="rounded-full border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:border-blue-500/40 hover:bg-muted">
          Load Valorant to CS2
        </button>
        <button onClick={loadApexPreset} className="rounded-full border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:border-blue-500/40 hover:bg-muted">
          Load Apex to CS2
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
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">CS2 Baseline Metrics</p>
                <p className="text-sm text-muted-foreground">Start with your current CS2 setup to see eDPI and 360-distance immediately.</p>
              </div>
              <Crosshair className="w-5 h-5 text-blue-500" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Mouse DPI</label>
                <input type="number" min="1" value={cs2Dpi} onChange={(event) => setCs2Dpi(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">CS2 Sensitivity</label>
                <input type="number" min="0" step="0.001" value={cs2Sens} onChange={(event) => setCs2Sens(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Zoom Sens Ratio</label>
                <input type="number" min="0" step="0.001" value={zoomRatio} onChange={(event) => setZoomRatio(event.target.value)} className="tool-calc-input w-full" />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">eDPI</p>
                <p className="mt-2 text-2xl font-black text-foreground">{format(cs2Metrics.edpi, 2)}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">cm/360</p>
                <p className="mt-2 text-2xl font-black text-foreground">{format(cs2Metrics.distanceCm, 2)}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">in/360</p>
                <p className="mt-2 text-2xl font-black text-foreground">{format(cs2Metrics.distanceInches, 2)}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Scoped eDPI</p>
                <p className="mt-2 text-2xl font-black text-foreground">{format(cs2Metrics.scopedEdpi, 2)}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">FPS Sensitivity Converter</p>
                <p className="text-sm text-muted-foreground">Match 360 distance between games or mouse DPI profiles.</p>
              </div>
              <Target className="w-5 h-5 text-blue-500" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Source Game</label>
                <select value={sourceGame} onChange={(event) => setSourceGame(event.target.value as GameId)} className="tool-calc-input w-full">
                  {Object.entries(GAME_YAWS).map(([id, game]) => (
                    <option key={id} value={id}>{game.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Target Game</label>
                <select value={targetGame} onChange={(event) => setTargetGame(event.target.value as GameId)} className="tool-calc-input w-full">
                  {Object.entries(GAME_YAWS).map(([id, game]) => (
                    <option key={id} value={id}>{game.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Source Sensitivity</label>
                <input type="number" min="0" step="0.001" value={sourceSens} onChange={(event) => setSourceSens(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Source DPI</label>
                <input type="number" min="1" value={sourceDpi} onChange={(event) => setSourceDpi(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Target DPI</label>
                <input type="number" min="1" value={targetDpi} onChange={(event) => setTargetDpi(event.target.value)} className="tool-calc-input w-full" />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {sourceGame === "custom" && (
                <div>
                  <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Custom Source Yaw</label>
                  <input type="number" min="0" step="0.0001" value={customSourceYaw} onChange={(event) => setCustomSourceYaw(event.target.value)} className="tool-calc-input w-full" />
                </div>
              )}
              {targetGame === "custom" && (
                <div>
                  <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Custom Target Yaw</label>
                  <input type="number" min="0" step="0.0001" value={customTargetYaw} onChange={(event) => setCustomTargetYaw(event.target.value)} className="tool-calc-input w-full" />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Equivalent Target Sens</p>
                <h3 className="mt-1 text-2xl font-black text-emerald-600">{format(conversion.targetSensitivity, 4)}</h3>
              </div>
              <TrendingUp className="w-6 h-6 text-emerald-600" />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Source cm/360</p>
                <p className="mt-2 text-2xl font-black text-foreground">{format(conversion.sourceDistance, 2)}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Target cm/360</p>
                <p className="mt-2 text-2xl font-black text-foreground">{format(conversion.targetDistance, 2)}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Source eDPI</p>
                <p className="mt-2 text-2xl font-black text-foreground">{format(conversion.sourceEdpi, 2)}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Target eDPI</p>
                <p className="mt-2 text-2xl font-black text-foreground">{format(conversion.targetEdpi, 2)}</p>
              </div>
            </div>

            <div className="mt-3 rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
              <p className="text-sm leading-relaxed text-muted-foreground">
                The converter preserves the same 360-distance using yaw and DPI. That means the target sensitivity value should produce nearly identical turning distance on the mousepad when the source and target entries are correct.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="mb-4 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Reference Notes</p>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="font-bold text-foreground">{GAME_YAWS[sourceGame].label}</p>
                <p className="mt-1">{GAME_YAWS[sourceGame].note}</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="font-bold text-foreground">{GAME_YAWS[targetGame].label}</p>
                <p className="mt-1">{GAME_YAWS[targetGame].note}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="mb-4 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Copy-Ready Snippets</p>
            <div className="space-y-3">
              {[
                { label: "CS2 metrics", value: metricSnippet },
                { label: "Conversion summary", value: conversionSnippet },
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
                Sensitivity conversion only keeps the same raw turn distance. It does not account for differences in field of view, scoped multipliers, aim styles, or recoil behavior across games. Use the converted value as a starting point and then fine-tune in live aim practice.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <UtilityToolPageShell
      title="CS2 Sensitivity Calculator"
      seoTitle="CS2 Sensitivity Calculator - eDPI, cm/360, and FPS Conversion"
      seoDescription="Free CS2 sensitivity calculator. Compute eDPI, cm/360, scoped sensitivity, and convert sensitivity between CS2, Valorant, Apex, and other FPS setups."
      canonical="https://usonlinetools.com/gaming/cs2-sensitivity-calculator"
      categoryName="Gaming Calculators"
      categoryHref="/category/gaming"
      heroDescription="Use this CS2 sensitivity calculator to measure your Counter-Strike 2 setup in practical terms instead of relying on a single sens number. Calculate eDPI, convert to centimeters per 360, estimate scoped eDPI, and convert between CS2 and other FPS games such as Valorant and Apex by matching raw turn distance. The page is designed for players who want a cleaner starting point before they fine-tune in deathmatch, aim training, or scrims."
      heroIcon={<Mouse className="w-3.5 h-3.5" />}
      calculatorLabel="CS2 Aim Conversion Workspace"
      calculatorDescription="Check your current CS2 metrics and convert source sensitivities into a CS2-equivalent value using yaw and DPI."
      calculator={calculator}
      howSteps={[
        {
          title: "Start by measuring your current CS2 setup in eDPI and cm/360",
          description:
            "A raw sensitivity value on its own is not very informative because it only makes sense alongside mouse DPI. That is why the first panel turns your CS2 settings into eDPI and centimeters per 360. eDPI gives you a quick compact metric for comparing setups, while cm/360 tells you the physical distance required for a full spin. Competitive players often think in those more stable measurements because they travel better across mice, configs, and discussions than a single number does by itself.",
        },
        {
          title: "Use the converter when moving from another FPS title into CS2",
          description:
            "When players switch from Valorant, Apex, or another shooter, the main goal is usually preserving the same rough turning distance rather than guessing a new number from scratch. The converter panel handles that by combining sensitivity, DPI, and game yaw so the result lands in the right range for CS2. This is the most practical use case for a CS2 sensitivity calculator because it saves hours of unnecessary trial and error during the first setup pass.",
        },
        {
          title: "Treat the converted value as a starting point, not a final answer",
          description:
            "Matching 360-distance is useful, but it does not make every game feel identical. Counter-Strike 2 has its own movement, peeking rhythm, recoil handling, and visual pacing. Even if the math is correct, you may still want to adjust the result slightly after playing actual rounds or aim routines. A strong conversion tool should make that clear. Its job is to put you near your ideal range quickly, not to pretend that one equation replaces all in-game testing.",
        },
        {
          title: "Use zoom ratio and copied summaries when you are actively tuning",
          description:
            "The zoom ratio field and copy-ready snippets make the page useful beyond a one-time setup. If you are testing multiple CS2 configs, comparing scoped feel, or sharing values with a teammate, you can copy the exact metrics instead of rewriting them manually. That matters because sensitivity tuning is often iterative. Players try a value, test it, compare notes, then return for one more adjustment. A practical calculator should support that loop directly.",
        },
      ]}
      interpretationCards={[
        {
          title: "Lower cm/360 means a faster setup",
          description:
            "If your cm/360 is small, you need less mousepad travel for a full spin. That usually feels faster and can help with wide swings, but it can also make micro-adjustments less stable if pushed too far.",
        },
        {
          title: "Higher cm/360 means more arm movement and often more precision",
          description:
            "A larger cm/360 usually signals a slower setup. Many tactical FPS players like that because it can make crosshair placement and fine corrections feel steadier, though it requires more physical travel on the desk.",
          className: "bg-cyan-500/5 border-cyan-500/20",
        },
        {
          title: "eDPI is compact, but cm/360 is easier to visualize physically",
          description:
            "eDPI is useful for quick comparisons and spreadsheets, while cm/360 is often better when you want to understand how the setup behaves on an actual mousepad. Using both together gives a clearer picture than either one alone.",
          className: "bg-emerald-500/5 border-emerald-500/20",
        },
        {
          title: "Equivalent conversion preserves turn distance, not overall aim feel",
          description:
            "If the converted value seems slightly off in practice, that does not automatically mean the formula failed. It often means the target game has a different visual pace or recoil handling, so final tuning by feel is still normal and expected.",
          className: "bg-amber-500/5 border-amber-500/20",
        },
      ]}
      examples={[
        { scenario: "Standard CS2 setup", input: "800 DPI and 1.20 sens", output: "960 eDPI and about 43.3 cm/360" },
        { scenario: "Valorant to CS2", input: "0.314 sens at 800 DPI in Valorant", output: "About 0.999 in CS2 for the same turn distance" },
        { scenario: "Apex to CS2", input: "1.20 sens at 800 DPI in Apex", output: "1.20 in CS2 because the yaw family matches" },
        { scenario: "New target DPI", input: "Keep same source sens but change target from 800 to 1600 DPI", output: "Target sens drops roughly in half to preserve the same 360 distance" },
      ]}
      whyChoosePoints={[
        "This CS2 Sensitivity Calculator is designed as a real player workflow page rather than a thin single-form converter. It gives you CS2-specific baseline metrics, a reusable cross-game converter, yaw-aware calculations, copy-ready outputs, and enough context to interpret the numbers instead of just displaying them. That makes it much more useful than a bare sensitivity formula pasted into a generic page shell.",
        "The page also focuses on the metrics that matter most in actual FPS setup work. eDPI is good for comparing profiles quickly, but cm/360 is what helps many players reason about mousepad travel physically. Including both makes the tool more practical for players tuning their setup seriously instead of only checking one conversion once.",
        "The cross-game converter is valuable because players rarely arrive with no reference point. They usually come from another shooter and want CS2 to feel familiar immediately. Matching the same rough turn distance using yaw and DPI gives a defensible starting point that can then be refined in live aim practice. That is exactly the kind of job a CS2 sensitivity calculator should handle well.",
        "This implementation also stays honest about what sensitivity math can and cannot do. It can preserve turning distance. It cannot guarantee identical aim feel across games with different movement, recoil, zoom behavior, and presentation. Stating that clearly makes the tool better, not worse, because it helps players use the output correctly.",
        "Everything runs in the browser with no account requirement, which fits the task. Sensitivity tuning is a fast utility workflow. You want to open the page, enter values, compare setups, copy the result, and get back into the game. That is the interaction model this page is built around.",
      ]}
      faqs={[
        {
          q: "What is eDPI in CS2?",
          a: "eDPI stands for effective DPI. In CS2 it is simply mouse DPI multiplied by in-game sensitivity. It gives you a compact way to compare setups, but it is still best interpreted alongside cm/360 if you want to understand the physical feel of the setup.",
        },
        {
          q: "How do you calculate cm/360 for CS2?",
          a: "The calculator uses your DPI, sensitivity, and the CS2 yaw constant to estimate how many centimeters of mouse movement are needed for a full 360-degree turn. This is one of the most useful practical sensitivity metrics for FPS players because it directly reflects mousepad travel.",
        },
        {
          q: "Can I use this to convert Valorant sensitivity to CS2?",
          a: "Yes. Choose Valorant as the source game, enter your Valorant sensitivity and DPI, set CS2 as the target, and the converter will return the CS2-equivalent sensitivity that preserves the same raw turn distance.",
        },
        {
          q: "Why does the same 360-distance still feel different across games?",
          a: "Because matching 360-distance only preserves the physical turning relationship. It does not account for movement speed, recoil style, visual pacing, field of view differences, or scoped behavior. That is why converted values should be treated as a strong starting point, not a guaranteed final answer.",
        },
        {
          q: "What does a higher zoom sensitivity ratio do in CS2?",
          a: "A higher zoom ratio increases the effective sensitivity while scoped relative to your base setup. Players use this to make snipers or scoped rifles feel more aligned with their preferred unscoped movement, though the best value is personal and should be tested in game.",
        },
        {
          q: "Why include custom yaw fields?",
          a: "Not every FPS title fits neatly into a built-in preset list, and some players want to test niche titles or community-provided yaw values manually. The custom option keeps the calculator flexible without forcing you to leave the page for another tool.",
        },
        {
          q: "Does this page save my settings?",
          a: "No. The values live in the page state while the tab is open. It is designed for fast local calculations and setup comparisons, not for account-based profile storage.",
        },
        {
          q: "Is this useful on mobile?",
          a: "Yes. The layout is responsive, so you can check conversions or compare values from a phone while configuring a PC setup, discussing aim settings with teammates, or browsing between games.",
        },
      ]}
      relatedTools={[
        { title: "Valorant Sensitivity Calculator", slug: "valorant-sensitivity-calculator", icon: <Target className="w-4 h-4" />, color: 340, benefit: "Convert in the opposite direction for Valorant-first players" },
        { title: "Fortnite DPI Calculator", slug: "fortnite-dpi-calculator", icon: <Mouse className="w-4 h-4" />, color: 145, benefit: "Check another undeveloped FPS setup route" },
        { title: "Random Number Generator", slug: "random-number-generator", icon: <Gauge className="w-4 h-4" />, color: 35, benefit: "Use another quick math utility" },
        { title: "Percentage Calculator", slug: "percentage-calculator", icon: <TrendingUp className="w-4 h-4" />, color: 210, benefit: "Measure relative sensitivity changes in percent" },
        { title: "Blox Fruits Calculator", slug: "blox-fruits-calculator", icon: <Shield className="w-4 h-4" />, color: 260, benefit: "See another completed gaming calculator" },
        { title: "D&D Dice Roller", slug: "dnd-dice-roller", icon: <Copy className="w-4 h-4" />, color: 25, benefit: "Another live gaming route in the same category" },
      ]}
      ctaTitle="Need Another FPS Conversion Page?"
      ctaDescription="Keep moving through gaming tools and setup utilities across the same hub."
      ctaHref="/category/gaming"
    />
  );
}
