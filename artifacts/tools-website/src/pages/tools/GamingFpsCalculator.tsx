import { useMemo, useState } from "react";
import {
  Activity,
  BarChart3,
  Copy,
  Gauge,
  Monitor,
  RotateCcw,
  Shield,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import UtilityToolPageShell from "./UtilityToolPageShell";

type ResolutionId = "720p" | "1080p" | "1080p-ultrawide" | "1440p" | "1440p-ultrawide" | "4k";
type PresetId = "competitive" | "low" | "medium" | "high" | "ultra" | "cinematic";

const RESOLUTION_FACTORS: Record<ResolutionId, { label: string; pixelsRelativeTo1080p: number }> = {
  "720p": { label: "1280x720", pixelsRelativeTo1080p: 0.444 },
  "1080p": { label: "1920x1080", pixelsRelativeTo1080p: 1 },
  "1080p-ultrawide": { label: "2560x1080", pixelsRelativeTo1080p: 1.333 },
  "1440p": { label: "2560x1440", pixelsRelativeTo1080p: 1.778 },
  "1440p-ultrawide": { label: "3440x1440", pixelsRelativeTo1080p: 2.389 },
  "4k": { label: "3840x2160", pixelsRelativeTo1080p: 4 },
};

const PRESET_FACTORS: Record<PresetId, { label: string; factor: number; note: string }> = {
  competitive: { label: "Competitive", factor: 1.22, note: "Aggressive visibility-first settings usually raise FPS and reduce render cost." },
  low: { label: "Low", factor: 1.12, note: "Low settings tend to improve average FPS while keeping image quality acceptable for fast games." },
  medium: { label: "Medium", factor: 1, note: "Medium is the baseline reference in this estimator." },
  high: { label: "High", factor: 0.83, note: "High settings add quality overhead and usually shave down frame rate compared with medium." },
  ultra: { label: "Ultra", factor: 0.68, note: "Ultra pushes visual fidelity much harder and often costs a large chunk of FPS." },
  cinematic: { label: "Cinematic", factor: 0.58, note: "Cinematic-style settings are best treated as showcase presets rather than competitive defaults." },
};

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

function frameTime(fps: number) {
  return fps > 0 ? 1000 / fps : 0;
}

export default function GamingFpsCalculator() {
  const [baselineFpsInput, setBaselineFpsInput] = useState("144");
  const [targetResolution, setTargetResolution] = useState<ResolutionId>("1440p");
  const [graphicsPreset, setGraphicsPreset] = useState<PresetId>("high");
  const [upscalingBoostInput, setUpscalingBoostInput] = useState("12");
  const [cpuCeilingInput, setCpuCeilingInput] = useState("220");
  const [monitorRefreshInput, setMonitorRefreshInput] = useState("165");
  const [onePercentLowRatioInput, setOnePercentLowRatioInput] = useState("72");
  const [copiedLabel, setCopiedLabel] = useState("");

  const estimate = useMemo(() => {
    const baselineFps = positive(baselineFpsInput, 0);
    const resolutionFactor = RESOLUTION_FACTORS[targetResolution].pixelsRelativeTo1080p;
    const presetFactor = PRESET_FACTORS[graphicsPreset].factor;
    const upscalingBoost = positive(upscalingBoostInput, 0) / 100;
    const cpuCeiling = positive(cpuCeilingInput, 0);
    const monitorRefresh = positive(monitorRefreshInput, 0);
    const onePercentLowRatio = clamp(positive(onePercentLowRatioInput, 0), 0, 100) / 100;

    const gpuScaledFps = resolutionFactor > 0 ? (baselineFps / resolutionFactor) * presetFactor * (1 + upscalingBoost) : 0;
    const estimatedFps = cpuCeiling > 0 ? Math.min(gpuScaledFps, cpuCeiling) : gpuScaledFps;
    const onePercentLow = estimatedFps * onePercentLowRatio;
    const refreshCoverage = monitorRefresh > 0 ? (estimatedFps / monitorRefresh) * 100 : 0;
    const spareFrames = estimatedFps - monitorRefresh;
    const bottleneck = cpuCeiling > 0 && cpuCeiling < gpuScaledFps ? "CPU ceiling" : "GPU/render load";
    const recommendedCap = monitorRefresh > 0 ? Math.max(30, Math.floor(Math.min(estimatedFps, monitorRefresh))) : Math.floor(estimatedFps);

    return {
      baselineFps,
      resolutionFactor,
      presetFactor,
      upscalingBoost,
      cpuCeiling,
      monitorRefresh,
      onePercentLowRatio,
      gpuScaledFps,
      estimatedFps,
      onePercentLow,
      refreshCoverage,
      spareFrames,
      bottleneck,
      recommendedCap,
      averageFrameTime: frameTime(estimatedFps),
      lowFrameTime: frameTime(onePercentLow),
    };
  }, [
    baselineFpsInput,
    cpuCeilingInput,
    graphicsPreset,
    monitorRefreshInput,
    onePercentLowRatioInput,
    targetResolution,
    upscalingBoostInput,
  ]);

  const copyValue = async (label: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedLabel(label);
    window.setTimeout(() => setCopiedLabel(""), 1800);
  };

  const resetAll = () => {
    setBaselineFpsInput("144");
    setTargetResolution("1440p");
    setGraphicsPreset("high");
    setUpscalingBoostInput("12");
    setCpuCeilingInput("220");
    setMonitorRefreshInput("165");
    setOnePercentLowRatioInput("72");
  };

  const loadEsportsPreset = () => {
    setBaselineFpsInput("240");
    setTargetResolution("1080p");
    setGraphicsPreset("competitive");
    setUpscalingBoostInput("0");
    setCpuCeilingInput("300");
    setMonitorRefreshInput("240");
    setOnePercentLowRatioInput("80");
  };

  const loadSinglePlayerPreset = () => {
    setBaselineFpsInput("120");
    setTargetResolution("1440p");
    setGraphicsPreset("ultra");
    setUpscalingBoostInput("20");
    setCpuCeilingInput("180");
    setMonitorRefreshInput("144");
    setOnePercentLowRatioInput("68");
  };

  const estimateSnippet = [
    `Baseline FPS @ 1080p Medium: ${format(estimate.baselineFps, 2)}`,
    `Target resolution: ${RESOLUTION_FACTORS[targetResolution].label}`,
    `Preset: ${PRESET_FACTORS[graphicsPreset].label}`,
    `Estimated average FPS: ${format(estimate.estimatedFps, 2)}`,
    `Estimated 1% low: ${format(estimate.onePercentLow, 2)}`,
    `Likely limiter: ${estimate.bottleneck}`,
  ].join("\n");

  const refreshSnippet = [
    `Monitor refresh: ${format(estimate.monitorRefresh, 0)} Hz`,
    `Refresh coverage: ${format(estimate.refreshCoverage, 2)}%`,
    `Average frame time: ${format(estimate.averageFrameTime, 2)} ms`,
    `1% low frame time: ${format(estimate.lowFrameTime, 2)} ms`,
    `Recommended cap: ${format(estimate.recommendedCap, 0)} FPS`,
  ].join("\n");

  const calculator = (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <button onClick={loadEsportsPreset} className="rounded-full border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:border-blue-500/40 hover:bg-muted">
          Load Esports Rig
        </button>
        <button onClick={loadSinglePlayerPreset} className="rounded-full border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:border-blue-500/40 hover:bg-muted">
          Load Single-Player Rig
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
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">FPS Estimator Inputs</p>
                <p className="text-sm text-muted-foreground">Start from a known 1080p medium baseline, then scale the estimate to a new resolution and preset.</p>
              </div>
              <Gauge className="w-5 h-5 text-blue-500" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Baseline FPS</label>
                <input type="number" min="0" step="1" value={baselineFpsInput} onChange={(event) => setBaselineFpsInput(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Target Resolution</label>
                <select value={targetResolution} onChange={(event) => setTargetResolution(event.target.value as ResolutionId)} className="tool-calc-input w-full">
                  {Object.entries(RESOLUTION_FACTORS).map(([id, config]) => (
                    <option key={id} value={id}>{config.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Graphics Preset</label>
                <select value={graphicsPreset} onChange={(event) => setGraphicsPreset(event.target.value as PresetId)} className="tool-calc-input w-full">
                  {Object.entries(PRESET_FACTORS).map(([id, config]) => (
                    <option key={id} value={id}>{config.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Upscaling Boost %</label>
                <input type="number" min="0" step="1" value={upscalingBoostInput} onChange={(event) => setUpscalingBoostInput(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">CPU Ceiling FPS</label>
                <input type="number" min="0" step="1" value={cpuCeilingInput} onChange={(event) => setCpuCeilingInput(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Monitor Refresh</label>
                <input type="number" min="0" step="1" value={monitorRefreshInput} onChange={(event) => setMonitorRefreshInput(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">1% Low Ratio %</label>
                <input type="number" min="0" max="100" step="1" value={onePercentLowRatioInput} onChange={(event) => setOnePercentLowRatioInput(event.target.value)} className="tool-calc-input w-full" />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Estimated FPS</p>
                <p className="mt-2 text-2xl font-black text-emerald-600">{format(estimate.estimatedFps, 2)}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">1% Low</p>
                <p className="mt-2 text-2xl font-black text-foreground">{format(estimate.onePercentLow, 2)}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Frame Time</p>
                <p className="mt-2 text-2xl font-black text-foreground">{format(estimate.averageFrameTime, 2)} ms</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Likely Limiter</p>
                <p className="mt-2 text-xl font-black text-foreground">{estimate.bottleneck}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Monitor Match Analysis</p>
                <p className="text-sm text-muted-foreground">Check how well the estimated output aligns with your display refresh rate and frametime goals.</p>
              </div>
              <Monitor className="w-5 h-5 text-blue-500" />
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Refresh Coverage</p>
                <p className="mt-2 text-2xl font-black text-foreground">{format(estimate.refreshCoverage, 2)}%</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">FPS Headroom</p>
                <p className="mt-2 text-2xl font-black text-foreground">{format(estimate.spareFrames, 2)}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">1% Low Frame Time</p>
                <p className="mt-2 text-2xl font-black text-foreground">{format(estimate.lowFrameTime, 2)} ms</p>
              </div>
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Suggested Cap</p>
                <p className="mt-2 text-2xl font-black text-emerald-600">{format(estimate.recommendedCap, 0)} FPS</p>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
              <p className="text-sm leading-relaxed text-muted-foreground">{PRESET_FACTORS[graphicsPreset].note}</p>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="mb-4 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Realtime Reading</p>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="font-bold text-foreground">Performance Outlook</p>
                <p className="mt-1">From a {format(estimate.baselineFps, 0)} FPS 1080p-medium baseline, this setup lands at about {format(estimate.estimatedFps, 2)} FPS under the selected target conditions.</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="font-bold text-foreground">Display Match</p>
                <p className="mt-1">The estimate covers about {format(estimate.refreshCoverage, 2)}% of a {format(estimate.monitorRefresh, 0)} Hz display, which tells you how close the rig is to filling the panel consistently.</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="font-bold text-foreground">Limiter Guess</p>
                <p className="mt-1">The current model suggests the main limiter is <span className="font-bold text-foreground">{estimate.bottleneck}</span>. If that changes after you adjust resolution or preset, the page will reflect it immediately.</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="mb-4 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Copy-Ready Snippets</p>
            <div className="space-y-3">
              {[
                { label: "FPS estimate", value: estimateSnippet },
                { label: "Refresh analysis", value: refreshSnippet },
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
                This is an estimation model, not a benchmark database. The result is most useful when your baseline FPS is based on a real measurement from the same game or a closely similar title.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <UtilityToolPageShell
      title="Gaming FPS Calculator"
      seoTitle="Online Gaming FPS Calculator - Estimate FPS, Frame Time, and Refresh Match"
      seoDescription="Free online gaming FPS calculator. Estimate FPS from a 1080p baseline, scale to new resolutions and presets, and calculate frame time, 1% lows, and monitor refresh coverage."
      canonical="https://usonlinetools.com/gaming/gaming-fps-calculator"
      categoryName="Gaming Calculators"
      categoryHref="/category/gaming"
      heroDescription="Use this online gaming FPS calculator to estimate how a PC setup might perform when you change resolution, graphics settings, monitor refresh targets, or upscaling behavior. Start with a known baseline at 1080p medium, then scale that estimate into new target conditions and translate the result into frame times, 1% lows, refresh coverage, and a likely bottleneck direction. The page is designed for players who want a practical performance estimate before they start changing settings at random."
      heroIcon={<Activity className="w-3.5 h-3.5" />}
      calculatorLabel="Gaming Performance Estimator"
      calculatorDescription="Scale a known baseline FPS into a new resolution and preset, then analyze frame time and display fit."
      calculator={calculator}
      howSteps={[
        {
          title: "Start from a baseline you actually trust",
          description:
            "The calculator is built around one simple idea: a performance estimate is only useful if it starts from a real anchor. That anchor is the baseline FPS at 1080p medium. If you measure that number from the actual game you care about, or at least from a close performance match, the rest of the estimate becomes much more defensible than pure guesswork from hardware names alone.",
        },
        {
          title: "Scale the estimate through resolution and preset changes",
          description:
            "Once the baseline exists, the next step is translating it into a different target resolution and graphics preset. Higher resolutions increase render load, while lower or competitive presets often improve average FPS. This page applies both effects in one place so you can see how those decisions interact instead of adjusting them mentally one by one.",
        },
        {
          title: "Use the CPU ceiling when you know the system stops scaling cleanly",
          description:
            "Many PCs hit a point where lowering settings or resolution no longer helps much because the CPU or game engine becomes the main limiter. The CPU ceiling field lets you model that behavior directly. This is especially useful for esports titles and simulation-heavy games where one part of the system can cap FPS long before the GPU is fully stressed.",
        },
        {
          title: "Read the result in frame time and monitor terms, not only FPS",
          description:
            "Average FPS alone does not tell the whole story. Frame time, 1% lows, and refresh-rate coverage are often better indicators of whether the game will feel smooth on your actual display. That is why the page converts the estimate into those metrics immediately. It helps you answer the more important question: not just how many frames you might get, but whether they match your monitor and input goals well enough.",
        },
      ]}
      interpretationCards={[
        {
          title: "Higher estimated FPS usually means lower average frame time",
          description:
            "When FPS rises, the time needed to render each frame drops. Lower frame times usually feel more responsive, especially in aiming and fast camera movement.",
        },
        {
          title: "1% lows matter because stability matters",
          description:
            "A high average FPS can still feel inconsistent if the low-end frame drops are severe. The 1% low estimate helps you think about smoothness, not just peak throughput.",
          className: "bg-cyan-500/5 border-cyan-500/20",
        },
        {
          title: "Refresh coverage shows whether your monitor is being fully used",
          description:
            "If your estimated FPS is far below the display refresh rate, you are leaving panel headroom unused. If it is far above, a frame cap may improve consistency and power behavior.",
          className: "bg-emerald-500/5 border-emerald-500/20",
        },
        {
          title: "Changing presets can shift the bottleneck direction",
          description:
            "At high resolutions and ultra settings, the GPU usually dominates. At low settings and lower resolutions, the CPU or engine cap often becomes more relevant.",
          className: "bg-amber-500/5 border-amber-500/20",
        },
      ]}
      examples={[
        { scenario: "Esports rig", input: "240 FPS baseline at 1080p medium with competitive settings", output: "High refresh coverage with a strong focus on CPU ceilings" },
        { scenario: "Single-player quality setup", input: "120 FPS baseline scaled to 1440p ultra", output: "Lower average FPS but still readable in frame-time terms" },
        { scenario: "Upscaling test", input: "Add a 12% upscaling boost", output: "Estimate recovers part of the resolution or preset penalty" },
        { scenario: "Monitor fit check", input: "165 Hz display with estimated 150 FPS", output: "Roughly 91% refresh coverage and a strong match for high-refresh play" },
      ]}
      whyChoosePoints={[
        "This Gaming FPS Calculator is built as a practical estimator rather than a fake hardware database. It starts from a baseline you provide, then scales that known anchor through resolution, preset, upscaling, CPU ceiling, and refresh-rate targets. That makes the estimate more transparent and more useful.",
        "The calculator focuses on the metrics that actually help with performance decisions. FPS is important, but so are frame time, 1% lows, and monitor refresh coverage. Showing them together makes the page more useful for real settings planning.",
        "The CPU ceiling input is especially important because many games stop scaling linearly once one subsystem becomes the limiter. A model that ignores that behavior often overestimates the benefit of lower settings or lower resolution.",
        "The page also treats presets as a deliberate tradeoff rather than a vague quality label. Competitive, low, medium, high, ultra, and cinematic settings all push performance differently, and the calculator makes that tradeoff visible immediately.",
        "Everything runs in the browser with no hardware detection gimmicks. You enter the baseline, test the estimate, and move on. That is the right interaction model for a settings-planning utility.",
      ]}
      faqs={[
        {
          q: "How do I use this FPS calculator accurately?",
          a: "Start with a real measured baseline FPS at 1080p medium from the same game, or a closely similar game. The more trustworthy the baseline, the more useful the scaled estimate becomes.",
        },
        {
          q: "Why not estimate FPS directly from my CPU and GPU names?",
          a: "Because actual FPS depends heavily on the game, resolution, settings, driver state, upscaling, and engine behavior. A baseline-driven model is usually more honest than pretending hardware names alone can predict everything.",
        },
        {
          q: "What is frame time?",
          a: "Frame time is how many milliseconds each frame takes to render. It is the inverse of FPS and is often easier to reason about when judging responsiveness and consistency.",
        },
        {
          q: "What is a 1% low?",
          a: "A 1% low is a rough way of describing how low performance gets during the worst sustained moments, rather than only showing the average FPS. It helps indicate smoothness and stability.",
        },
        {
          q: "What does the CPU ceiling field mean?",
          a: "It represents a rough cap where the game or CPU side of the system stops letting FPS scale much higher, even if you reduce graphics load further.",
        },
        {
          q: "Should I set an FPS cap?",
          a: "Often yes. If your estimated FPS is comfortably above your refresh rate, capping slightly below the peak can improve consistency, thermals, and frame pacing depending on the game.",
        },
        {
          q: "Does upscaling always add FPS in a fixed way?",
          a: "No. The exact gain depends on the game and upscaling method. The field here is a planning estimate, not a guaranteed benchmark result.",
        },
        {
          q: "Does this page save my performance profiles?",
          a: "No. The values stay in the current page state only. The page is built for quick local estimates and comparison.",
        },
      ]}
      relatedTools={[
        { title: "Fortnite DPI Calculator", slug: "fortnite-dpi-calculator", icon: <Target className="w-4 h-4" />, color: 210, benefit: "Tune another performance-adjacent gaming setting" },
        { title: "Esports Earnings Calculator", slug: "esports-earnings-calculator", icon: <TrendingUp className="w-4 h-4" />, color: 35, benefit: "Open another completed gaming utility" },
        { title: "Game Currency Converter", slug: "game-currency-converter", icon: <BarChart3 className="w-4 h-4" />, color: 145, benefit: "Use another comparison-driven gaming page" },
        { title: "XP Level Calculator", slug: "xp-level-calculator", icon: <Zap className="w-4 h-4" />, color: 300, benefit: "Stay inside the gaming calculator category" },
        { title: "Percentage Calculator", slug: "percentage-calculator", icon: <Copy className="w-4 h-4" />, color: 265, benefit: "Check percentage boosts and performance deltas" },
        { title: "D&D Dice Roller", slug: "dnd-dice-roller", icon: <RotateCcw className="w-4 h-4" />, color: 20, benefit: "Browse another gaming utility page" },
      ]}
      ctaTitle="Need Another Gaming Performance Tool?"
      ctaDescription="Keep moving through the gaming calculator category and continue replacing placeholder routes with real pages."
      ctaHref="/category/gaming"
    />
  );
}
