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

type GameId = "valorant" | "cs2" | "apex" | "source" | "custom";

const GAME_YAWS: Record<GameId, { label: string; yaw: number; note: string }> = {
  valorant: { label: "Valorant", yaw: 0.07, note: "Valorant uses a larger yaw constant than CS-style games, so the same physical feel appears as a smaller sensitivity number." },
  cs2: { label: "CS2", yaw: 0.022, note: "CS2 uses the classic Source-style yaw base for hip-fire sensitivity." },
  apex: { label: "Apex Legends", yaw: 0.022, note: "Apex hip-fire is commonly treated as a 1:1 yaw family with Source-style conversions." },
  source: { label: "Source Titles", yaw: 0.022, note: "Legacy Source games generally share the same yaw family used by CS titles." },
  custom: { label: "Custom Yaw", yaw: 0.07, note: "Use this when you already know the yaw constant for a specific title or private conversion workflow." },
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

export default function ValorantSensitivityCalculator() {
  const [valorantDpi, setValorantDpi] = useState("800");
  const [valorantSens, setValorantSens] = useState("0.35");
  const [scopeMultiplier, setScopeMultiplier] = useState("1");
  const [sourceGame, setSourceGame] = useState<GameId>("cs2");
  const [targetGame, setTargetGame] = useState<GameId>("valorant");
  const [sourceSens, setSourceSens] = useState("1.113");
  const [sourceDpi, setSourceDpi] = useState("800");
  const [targetDpi, setTargetDpi] = useState("800");
  const [customSourceYaw, setCustomSourceYaw] = useState("0.022");
  const [customTargetYaw, setCustomTargetYaw] = useState("0.07");
  const [copiedLabel, setCopiedLabel] = useState("");

  const valorantMetrics = useMemo(() => {
    const dpi = positive(valorantDpi, 0);
    const sens = positive(valorantSens, 0);
    const multiplier = positive(scopeMultiplier, 0);
    const edpi = dpi * sens;
    const scopedEdpi = edpi * multiplier;
    const distanceCm = cm360(dpi, sens, GAME_YAWS.valorant.yaw);
    const distanceInches = distanceCm / 2.54;
    return { dpi, sens, multiplier, edpi, scopedEdpi, distanceCm, distanceInches };
  }, [scopeMultiplier, valorantDpi, valorantSens]);

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
    };
  }, [customSourceYaw, customTargetYaw, sourceDpi, sourceGame, sourceSens, targetDpi, targetGame]);

  const copyValue = async (label: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedLabel(label);
    window.setTimeout(() => setCopiedLabel(""), 1800);
  };

  const resetAll = () => {
    setValorantDpi("800");
    setValorantSens("0.35");
    setScopeMultiplier("1");
    setSourceGame("cs2");
    setTargetGame("valorant");
    setSourceSens("1.113");
    setSourceDpi("800");
    setTargetDpi("800");
    setCustomSourceYaw("0.022");
    setCustomTargetYaw("0.07");
  };

  const loadCsPreset = () => {
    setSourceGame("cs2");
    setTargetGame("valorant");
    setSourceSens("1.2");
    setSourceDpi("800");
    setTargetDpi("800");
  };

  const loadApexPreset = () => {
    setSourceGame("apex");
    setTargetGame("valorant");
    setSourceSens("1.2");
    setSourceDpi("800");
    setTargetDpi("800");
  };

  const metricSnippet = [
    `Valorant DPI: ${valorantMetrics.dpi}`,
    `Valorant sens: ${valorantMetrics.sens}`,
    `Valorant eDPI: ${format(valorantMetrics.edpi, 2)}`,
    `Valorant cm/360: ${format(valorantMetrics.distanceCm, 2)}`,
    `Scope multiplier: ${format(valorantMetrics.multiplier, 3)}`,
    `Scoped eDPI: ${format(valorantMetrics.scopedEdpi, 2)}`,
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
        <button onClick={loadCsPreset} className="rounded-full border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:border-blue-500/40 hover:bg-muted">
          Load CS2 to Valorant
        </button>
        <button onClick={loadApexPreset} className="rounded-full border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:border-blue-500/40 hover:bg-muted">
          Load Apex to Valorant
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
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Valorant Baseline Metrics</p>
                <p className="text-sm text-muted-foreground">Measure your current Valorant setup before converting from another game.</p>
              </div>
              <Crosshair className="w-5 h-5 text-blue-500" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Mouse DPI</label>
                <input type="number" min="1" value={valorantDpi} onChange={(event) => setValorantDpi(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Valorant Sensitivity</label>
                <input type="number" min="0" step="0.001" value={valorantSens} onChange={(event) => setValorantSens(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Scope Multiplier</label>
                <input type="number" min="0" step="0.001" value={scopeMultiplier} onChange={(event) => setScopeMultiplier(event.target.value)} className="tool-calc-input w-full" />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">eDPI</p>
                <p className="mt-2 text-2xl font-black text-foreground">{format(valorantMetrics.edpi, 2)}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">cm/360</p>
                <p className="mt-2 text-2xl font-black text-foreground">{format(valorantMetrics.distanceCm, 2)}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">in/360</p>
                <p className="mt-2 text-2xl font-black text-foreground">{format(valorantMetrics.distanceInches, 2)}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Scoped eDPI</p>
                <p className="mt-2 text-2xl font-black text-foreground">{format(valorantMetrics.scopedEdpi, 2)}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">FPS Sensitivity Converter</p>
                <p className="text-sm text-muted-foreground">Match 360 distance from CS2, Apex, and other FPS setups into Valorant.</p>
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
                The converter preserves the same 360-distance. In practice, that means the result should give you a very similar raw turning feel in Valorant before you make any final micro-adjustments for personal comfort.
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
                { label: "Valorant metrics", value: metricSnippet },
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
                Valorant rewards precise stopping and first-shot discipline, so even a mathematically accurate conversion may still need a small follow-up adjustment once you start flicking, clearing angles, and taking actual duels.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <UtilityToolPageShell
      title="Valorant Sensitivity Calculator"
      seoTitle="Valorant Sensitivity Calculator - eDPI, cm/360, and FPS Conversion"
      seoDescription="Free Valorant sensitivity calculator. Compute eDPI, cm/360, scoped sensitivity, and convert sensitivity from CS2, Apex, and other FPS games into Valorant."
      canonical="https://usonlinetools.com/gaming/valorant-sensitivity-calculator"
      categoryName="Gaming Calculators"
      categoryHref="/category/gaming"
      heroDescription="Use this Valorant sensitivity calculator to measure your setup in practical aim terms instead of guessing from one number alone. Calculate eDPI, convert to centimeters per 360, estimate scoped eDPI, and translate sensitivity from games such as CS2 and Apex into Valorant by preserving raw turn distance. The page is designed for players who want a reliable starting point before they refine their settings in the range, deathmatch, or ranked play."
      heroIcon={<Mouse className="w-3.5 h-3.5" />}
      calculatorLabel="Valorant Aim Conversion Workspace"
      calculatorDescription="Measure your current Valorant setup and convert source sensitivities into a Valorant-equivalent value using yaw and DPI."
      calculator={calculator}
      howSteps={[
        {
          title: "Measure your current Valorant setup first",
          description:
            "A single sensitivity number is rarely enough context on its own. Two players can both say they use 0.35, but if their mouse DPI is different the setup will not feel the same at all. That is why this page starts by converting your current Valorant config into eDPI and cm/360. eDPI gives you a fast comparison metric, while cm/360 gives you a physical feel for how much mousepad travel your setup demands in actual play.",
        },
        {
          title: "Use the converter when moving from CS2 or another FPS into Valorant",
          description:
            "Many players approach Valorant after already spending time in other shooters. In that situation the practical question is not 'What random sens should I try?' but 'What Valorant sensitivity gives me a similar raw turning distance to what I already know?' The converter answers that question directly by combining source sensitivity, source DPI, target DPI, and game yaw. That makes it a much more useful starting point than trial-and-error guessing.",
        },
        {
          title: "Keep the same 360-distance first, then fine-tune for Valorant-specific precision",
          description:
            "Valorant is a tactical shooter where stopping discipline, angle clearing, and first-bullet precision matter heavily. Even if you convert perfectly from CS2 or Apex, the resulting value may still need a small adjustment once you start taking real fights. That does not mean the converter failed. It means the converter did its job by placing you near a defensible starting point, after which game-specific tuning by feel becomes meaningful and efficient.",
        },
        {
          title: "Use the copied summaries when comparing multiple setups",
          description:
            "Sensitivity work is often iterative. Players test one value, run a few rounds, adjust the number, then compare again later. The copy-ready snippets help with that process because you can save exact metrics or share them with teammates and friends without rewriting them manually. A practical Valorant sensitivity calculator should support repeated tuning, not just a one-time conversion.",
        },
      ]}
      interpretationCards={[
        {
          title: "Lower cm/360 means a faster Valorant setup",
          description:
            "A smaller cm/360 means less mousepad travel is needed for a full turn. That can make quick direction changes easier, but it can also make tiny crosshair corrections harder if pushed too far.",
        },
        {
          title: "Higher cm/360 often supports steadier micro-adjustments",
          description:
            "A larger cm/360 means you move farther physically for the same turn. Many tactical FPS players like that because it can make angle holding and head-level tracking feel more controlled.",
          className: "bg-cyan-500/5 border-cyan-500/20",
        },
        {
          title: "eDPI is compact, but cm/360 is often easier to feel",
          description:
            "eDPI is useful for comparing profiles in one line, while cm/360 is often better when thinking about how the setup behaves on a real desk and mousepad. Using both together gives better context than either one alone.",
          className: "bg-emerald-500/5 border-emerald-500/20",
        },
        {
          title: "Conversion math preserves turn distance, not every aspect of aim feel",
          description:
            "The converted value should land you close, but movement style, visual pacing, recoil expectations, and scoped behavior can still make a target game feel different. Final tuning in actual gameplay is still normal.",
          className: "bg-amber-500/5 border-amber-500/20",
        },
      ]}
      examples={[
        { scenario: "Typical Valorant setup", input: "800 DPI and 0.35 sens", output: "280 eDPI and about 46.6 cm/360" },
        { scenario: "CS2 to Valorant", input: "1.20 sens at 800 DPI in CS2", output: "About 0.377 in Valorant for the same turn distance" },
        { scenario: "Apex to Valorant", input: "1.20 sens at 800 DPI in Apex", output: "About 0.377 in Valorant because Apex and CS-style yaw match closely" },
        { scenario: "Higher target DPI", input: "Convert with target DPI moving from 800 to 1600", output: "Equivalent target sens drops to preserve the same 360 distance" },
      ]}
      whyChoosePoints={[
        "This Valorant Sensitivity Calculator is built as a practical setup page rather than a thin one-line converter. It gives you baseline Valorant metrics, cross-game conversion, yaw-aware calculations, copy-ready outputs, and enough explanation to understand what the numbers actually mean. That makes it useful both for first-time setup and for ongoing sensitivity tuning.",
        "The page focuses on the metrics that matter most when aim settings become serious. eDPI is good for quick comparisons, but cm/360 is what many players use to reason about real desk movement. Presenting both keeps the tool grounded in the way competitive FPS players actually discuss and tune sensitivity.",
        "The conversion feature matters because most users do not start from zero. They come from CS2, Apex, or another shooter and want Valorant to feel familiar immediately. Matching the same rough turn distance gets them close fast, which is exactly the job a dedicated Valorant sensitivity calculator should do well.",
        "This implementation also stays honest about the limits of the math. It can preserve physical turn distance, but it cannot make two games with different movement, timing, and combat rhythms feel identical automatically. That clarity improves the tool because it helps players use the conversion result correctly instead of treating it like a magical final answer.",
        "Everything runs in the browser with no setup friction. That is the right interaction model for a sensitivity utility page: open it, compare values, copy the result, test in game, and return if you want one more adjustment.",
      ]}
      faqs={[
        {
          q: "What is eDPI in Valorant?",
          a: "eDPI is effective DPI, calculated as mouse DPI multiplied by in-game sensitivity. It is a compact way to compare setups, but it becomes more informative when paired with cm/360, which shows the actual physical travel on the mousepad.",
        },
        {
          q: "How do you convert CS2 sensitivity to Valorant?",
          a: "The page uses source sensitivity, source DPI, target DPI, and the yaw values of both games to preserve the same turn distance. Choose CS2 as the source game, enter your settings, and keep Valorant as the target to get the equivalent result.",
        },
        {
          q: "Why does my converted Valorant sensitivity look much smaller than my CS2 number?",
          a: "Because the two games use different yaw scales. Valorant sensitivity numbers are naturally lower than equivalent CS2 numbers when you preserve the same 360-distance, so a smaller-looking number is expected and normal.",
        },
        {
          q: "What does cm/360 tell me in Valorant?",
          a: "It tells you how many centimeters of mouse movement are needed for a full 360-degree turn. This is one of the most useful physical sensitivity metrics because it translates your setup into something you can actually feel on your desk.",
        },
        {
          q: "Should I use the exact converted result with no changes?",
          a: "Use it as a starting point. It usually gets you into the right range quickly, but Valorant-specific precision preferences may still justify a small adjustment after real aim testing in the range or matches.",
        },
        {
          q: "Why include custom yaw fields?",
          a: "Custom yaw support lets you test games or community conversion values that are not part of the built-in list. That keeps the page more flexible for players who use niche titles or private conversion workflows.",
        },
        {
          q: "Does the calculator store my settings?",
          a: "No. The settings stay in the current browser page state only. The tool is built for fast local comparisons rather than persistent profile storage.",
        },
        {
          q: "Can I use this on a phone while tuning my PC setup?",
          a: "Yes. The layout is responsive, so you can compare values or read conversions from a mobile device while changing settings on another screen.",
        },
      ]}
      relatedTools={[
        { title: "CS2 Sensitivity Calculator", slug: "cs2-sensitivity-calculator", icon: <Target className="w-4 h-4" />, color: 210, benefit: "Move back into a CS2-first conversion workflow" },
        { title: "Fortnite DPI Calculator", slug: "fortnite-dpi-calculator", icon: <Mouse className="w-4 h-4" />, color: 145, benefit: "Continue into another undeveloped setup route" },
        { title: "Random Number Generator", slug: "random-number-generator", icon: <Gauge className="w-4 h-4" />, color: 35, benefit: "Use another quick utility page" },
        { title: "Percentage Calculator", slug: "percentage-calculator", icon: <TrendingUp className="w-4 h-4" />, color: 340, benefit: "Measure relative sensitivity changes by percent" },
        { title: "Blox Fruits Trade Calculator", slug: "blox-fruits-trade-calculator", icon: <RotateCcw className="w-4 h-4" />, color: 25, benefit: "See another completed gaming route" },
        { title: "D&D Dice Roller", slug: "dnd-dice-roller", icon: <Copy className="w-4 h-4" />, color: 260, benefit: "Another live gaming utility page" },
      ]}
      ctaTitle="Need Another Gaming Setup Tool?"
      ctaDescription="Keep moving through gaming calculators and conversion pages in the same tool hub."
      ctaHref="/category/gaming"
    />
  );
}
