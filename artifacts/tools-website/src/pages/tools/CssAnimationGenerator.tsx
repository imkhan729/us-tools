import { useMemo, useState } from "react";
import { Check, Copy, Layers3, Move3D, Palette, Play, RefreshCw, Sparkles, Type } from "lucide-react";
import UtilityToolPageShell from "./UtilityToolPageShell";

type Preset =
  | "fade-up"
  | "slide-right"
  | "pulse"
  | "bounce"
  | "float"
  | "rotate-in"
  | "wobble";

type Timing = "ease" | "ease-in" | "ease-out" | "ease-in-out" | "linear";
type Iteration = "1" | "2" | "3" | "infinite";
type PreviewShape = "card" | "pill" | "badge";

const PRESET_LABELS: Record<Preset, string> = {
  "fade-up": "Fade Up",
  "slide-right": "Slide Right",
  pulse: "Pulse",
  bounce: "Bounce",
  float: "Float",
  "rotate-in": "Rotate In",
  wobble: "Wobble",
};

function keyframesForPreset(preset: Preset, distance: number, scale: number) {
  const smallScale = Math.max(0.75, 1 - scale / 100);
  const largeScale = 1 + scale / 100;

  switch (preset) {
    case "fade-up":
      return `0% { opacity: 0; transform: translateY(${distance}px) scale(${smallScale}); }
100% { opacity: 1; transform: translateY(0) scale(1); }`;
    case "slide-right":
      return `0% { opacity: 0; transform: translateX(-${distance}px) scale(${smallScale}); }
100% { opacity: 1; transform: translateX(0) scale(1); }`;
    case "pulse":
      return `0% { transform: scale(1); opacity: 0.92; }
50% { transform: scale(${largeScale}); opacity: 1; }
100% { transform: scale(1); opacity: 0.92; }`;
    case "bounce":
      return `0%, 100% { transform: translateY(0); animation-timing-function: ease-out; }
30% { transform: translateY(-${distance}px); animation-timing-function: ease-in; }
55% { transform: translateY(0); animation-timing-function: ease-out; }
72% { transform: translateY(-${Math.round(distance * 0.45)}px); animation-timing-function: ease-in; }
86% { transform: translateY(0); }`;
    case "float":
      return `0%, 100% { transform: translateY(0) rotate(0deg); }
50% { transform: translateY(-${Math.round(distance * 0.7)}px) rotate(${Math.max(2, Math.round(scale / 3))}deg); }`;
    case "rotate-in":
      return `0% { opacity: 0; transform: rotate(-${Math.max(12, distance)}deg) scale(${smallScale}); }
100% { opacity: 1; transform: rotate(0deg) scale(1); }`;
    case "wobble":
      return `0%, 100% { transform: translateX(0) rotate(0deg); }
20% { transform: translateX(-${Math.round(distance * 0.35)}px) rotate(-4deg); }
40% { transform: translateX(${Math.round(distance * 0.28)}px) rotate(3deg); }
60% { transform: translateX(-${Math.round(distance * 0.18)}px) rotate(-2deg); }
80% { transform: translateX(${Math.round(distance * 0.12)}px) rotate(1deg); }`;
  }
}

function previewLabel(shape: PreviewShape) {
  if (shape === "card") return "Launch card";
  if (shape === "pill") return "Primary action";
  return "New";
}

export default function CssAnimationGenerator() {
  const [preset, setPreset] = useState<Preset>("fade-up");
  const [shape, setShape] = useState<PreviewShape>("card");
  const [duration, setDuration] = useState(900);
  const [delay, setDelay] = useState(0);
  const [distance, setDistance] = useState(28);
  const [scale, setScale] = useState(8);
  const [timing, setTiming] = useState<Timing>("ease-out");
  const [iteration, setIteration] = useState<Iteration>("1");
  const [copiedLabel, setCopiedLabel] = useState("");

  const animationName = useMemo(() => `preview-${preset.replace(/[^a-z]/g, "")}-${distance}-${scale}`, [preset, distance, scale]);
  const keyframes = useMemo(() => keyframesForPreset(preset, distance, scale), [preset, distance, scale]);
  const animationValue = useMemo(
    () => `${animationName} ${duration}ms ${timing} ${delay}ms ${iteration}`,
    [animationName, delay, duration, iteration, timing],
  );
  const cssBlock = useMemo(
    () => `@keyframes ${animationName} {\n${keyframes
      .split("\n")
      .map((line) => `  ${line}`)
      .join("\n")}\n}\n\n.animated-element {\n  animation: ${animationValue};\n  will-change: transform, opacity;\n}`,
    [animationName, animationValue, keyframes],
  );
  const previewExplanation = useMemo(() => {
    if (preset === "fade-up") return "This preset is ideal for hero content, cards, and staggered section reveals because it feels calm and modern rather than aggressive.";
    if (preset === "slide-right") return "This works well for drawers, side panels, tab content, and horizontal list entries where movement should imply direction.";
    if (preset === "pulse") return "Pulse is best used sparingly on status indicators, soft CTAs, and callout chips that need attention without becoming annoying.";
    if (preset === "bounce") return "Bounce adds strong energy, so it fits gamified UI, celebratory moments, onboarding prompts, and promotional surfaces more than serious dashboards.";
    if (preset === "float") return "Float is useful for decorative badges, illustration layers, and light atmospheric motion that makes a landing page feel less static.";
    if (preset === "rotate-in") return "Rotate-in creates more theatrical entrance energy, which suits promotional cards, badges, and storytelling-led sections.";
    return "Wobble is expressive and intentionally less restrained, which makes it useful for playful brands, alerts, novelty UI, and motion experiments.";
  }, [preset]);

  const previewClass =
    shape === "card"
      ? "max-w-sm rounded-[28px] border border-white/20 bg-white/15 p-6 text-left shadow-xl backdrop-blur-sm"
      : shape === "pill"
        ? "rounded-full border border-white/25 bg-white/20 px-6 py-3 text-sm font-black tracking-[0.18em] uppercase shadow-lg backdrop-blur-sm"
        : "rounded-2xl border border-white/25 bg-white/18 px-4 py-2 text-sm font-black shadow-lg backdrop-blur-sm";

  const previewKey = `${preset}-${shape}-${duration}-${delay}-${distance}-${scale}-${timing}-${iteration}`;

  const copyValue = async (label: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedLabel(label);
    window.setTimeout(() => setCopiedLabel(""), 1800);
  };

  const randomize = () => {
    const presets: Preset[] = ["fade-up", "slide-right", "pulse", "bounce", "float", "rotate-in", "wobble"];
    const timings: Timing[] = ["ease", "ease-in", "ease-out", "ease-in-out", "linear"];
    const iterations: Iteration[] = ["1", "2", "3", "infinite"];
    const shapes: PreviewShape[] = ["card", "pill", "badge"];

    setPreset(presets[Math.floor(Math.random() * presets.length)]);
    setTiming(timings[Math.floor(Math.random() * timings.length)]);
    setIteration(iterations[Math.floor(Math.random() * iterations.length)]);
    setShape(shapes[Math.floor(Math.random() * shapes.length)]);
    setDuration(450 + Math.floor(Math.random() * 1350));
    setDelay(Math.floor(Math.random() * 550));
    setDistance(12 + Math.floor(Math.random() * 53));
    setScale(4 + Math.floor(Math.random() * 17));
  };

  return (
    <UtilityToolPageShell
      title="CSS Animation Generator"
      seoTitle="CSS Animation Generator - Free Keyframe CSS Builder"
      seoDescription="Free CSS animation generator with live preview, keyframe presets, timing controls, and copyable CSS output. Build motion for cards, buttons, badges, and interface components instantly."
      canonical="https://usonlinetools.com/css-design/css-animation-generator"
      categoryName="CSS & Design Tools"
      categoryHref="/category/css-design"
      heroDescription="Build polished CSS animations visually without hand-writing keyframes from scratch. Choose a preset, tune duration, delay, movement distance, scale, timing function, and iteration count, then copy production-ready CSS for cards, call-to-action buttons, badges, panels, hero reveals, onboarding flows, and modern interface components."
      heroIcon={<Play className="w-3.5 h-3.5" />}
      calculatorLabel="Animation Builder"
      calculatorDescription="Preview motion live, tweak the timing model, and export clean CSS keyframes instantly."
      calculator={
        <div className="space-y-5">
          <style>{`@keyframes ${animationName} { ${keyframes} }`}</style>
          <div className="grid grid-cols-1 lg:grid-cols-[290px_1fr] gap-5">
            <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5 space-y-4">
              <div>
                <label htmlFor="preset" className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">
                  Animation Preset
                </label>
                <select id="preset" value={preset} onChange={(event) => setPreset(event.target.value as Preset)} className="tool-calc-input w-full">
                  {Object.entries(PRESET_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="shape" className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">
                  Preview Shape
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["card", "pill", "badge"] as PreviewShape[]).map((value) => (
                    <button
                      key={value}
                      onClick={() => setShape(value)}
                      className={`rounded-xl px-3 py-3 text-sm font-bold ${shape === value ? "bg-blue-600 text-white" : "border border-border bg-card text-foreground"}`}
                    >
                      {value === "card" ? "Card" : value === "pill" ? "Pill" : "Badge"}
                    </button>
                  ))}
                </div>
              </div>

              {[
                { id: "duration", label: "Duration", value: duration, suffix: "ms", min: 150, max: 2400, setter: setDuration },
                { id: "delay", label: "Delay", value: delay, suffix: "ms", min: 0, max: 1200, setter: setDelay },
                { id: "distance", label: "Move Distance", value: distance, suffix: "px", min: 0, max: 80, setter: setDistance },
                { id: "scale", label: "Scale Strength", value: scale, suffix: "%", min: 0, max: 24, setter: setScale },
              ].map((control) => (
                <div key={control.id}>
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <label htmlFor={control.id} className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                      {control.label}
                    </label>
                    <span className="text-xs font-bold text-blue-600">{control.value}{control.suffix}</span>
                  </div>
                  <input
                    id={control.id}
                    type="range"
                    min={control.min}
                    max={control.max}
                    value={control.value}
                    onChange={(event) => control.setter(Number(event.target.value))}
                    className="w-full accent-blue-500"
                  />
                </div>
              ))}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="timing" className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">
                    Timing
                  </label>
                  <select id="timing" value={timing} onChange={(event) => setTiming(event.target.value as Timing)} className="tool-calc-input w-full">
                    <option value="ease">ease</option>
                    <option value="ease-in">ease-in</option>
                    <option value="ease-out">ease-out</option>
                    <option value="ease-in-out">ease-in-out</option>
                    <option value="linear">linear</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="iteration" className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">
                    Iterations
                  </label>
                  <select id="iteration" value={iteration} onChange={(event) => setIteration(event.target.value as Iteration)} className="tool-calc-input w-full">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="infinite">Infinite</option>
                  </select>
                </div>
              </div>

              <button
                onClick={randomize}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-bold text-foreground hover:bg-muted"
              >
                <RefreshCw className="w-4 h-4" />
                Randomize Motion
              </button>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-border bg-card p-6">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-4">Live Preview</p>
                <div className="rounded-[32px] bg-slate-100 p-5 dark:bg-slate-900">
                  <div className="flex min-h-[260px] items-center justify-center rounded-[28px] bg-gradient-to-br from-sky-500 via-blue-500 to-indigo-500 p-6 text-white shadow-inner">
                    <div key={previewKey} className={previewClass} style={{ animation: animationValue }}>
                      {shape === "card" ? (
                        <>
                          <p className="text-xs font-black uppercase tracking-[0.2em] opacity-80 mb-3">Preview Surface</p>
                          <h3 className="text-2xl font-black mb-2">Motion should support hierarchy, not distract from it.</h3>
                          <p className="text-sm leading-relaxed opacity-90">Use entrance and emphasis animations to help users notice what matters at the right moment.</p>
                        </>
                      ) : (
                        <span>{previewLabel(shape)}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-border bg-card p-4">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Animation Shorthand</p>
                    <button onClick={() => copyValue("animation", `animation: ${animationValue};`)} className="text-xs font-bold text-blue-600 hover:text-blue-700">
                      {copiedLabel === "animation" ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <div className="rounded-xl bg-muted/60 p-3">
                    <code className="text-sm font-mono font-bold text-foreground">{`animation: ${animationValue};`}</code>
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
                    This is useful when you already have your own `@keyframes` name and only need the timing shorthand.
                  </p>
                </div>

                <div className="rounded-2xl border border-border bg-card p-4">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Preset Insight</p>
                    <span className="text-xs font-bold text-blue-600">{PRESET_LABELS[preset]}</span>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">{previewExplanation}</p>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-4">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Full CSS Output</p>
                  <button onClick={() => copyValue("css", cssBlock)} className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700">
                    {copiedLabel === "css" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    Copy CSS
                  </button>
                </div>
                <pre className="overflow-x-auto rounded-xl bg-slate-950 p-4 text-xs leading-relaxed text-slate-100">
                  <code>{cssBlock}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      }
      howSteps={[
        {
          title: "Choose the motion behavior that matches the interface moment",
          description:
            "Start by deciding what the animation is supposed to do, because not every motion pattern belongs everywhere. Fade and slide presets are usually best for content reveals, panel entrances, onboarding steps, and layout transitions. Pulse is better for soft emphasis on badges or call-to-action elements. Bounce, wobble, and rotate-in should be used more selectively on playful interfaces, promotional sections, celebratory feedback, or brand-led landing pages.",
        },
        {
          title: "Tune duration and delay before touching more expressive controls",
          description:
            "In most real interfaces, the biggest difference between polished motion and awkward motion is timing, not complexity. Start with duration and delay first. A reveal that lasts too long makes the interface feel sluggish, while an animation that is too short feels accidental. Delay is useful when motion should feel sequenced or intentional, but large delays can make the UI feel unresponsive if applied to important actions.",
        },
        {
          title: "Adjust distance and scale only as much as the component actually needs",
          description:
            "Distance controls how far the movement reads, and scale controls how much the element visually expands or compresses during the animation. Both are easy to overdo. Small adjustments usually work better for product UI because they preserve readability and perceived quality. Larger values are more suitable for campaign surfaces, marketing cards, playful product tours, gamified interfaces, or illustration-led hero sections where expressive motion is part of the visual style.",
        },
        {
          title: "Copy the CSS only after the preview looks right in context",
          description:
            "The point of the live preview is to stop you from guessing. Watch the shape, spacing, and weight of the animated element while you tweak the settings. Once the motion feels aligned with the component, copy either the shorthand declaration or the full keyframes block depending on your workflow. That shortens the path from experimentation to implementation and reduces devtools back-and-forth.",
        },
      ]}
      interpretationCards={[
        {
          title: "Ease-out often feels best for entrances and reveals",
          description:
            "When an element arrives quickly and settles gently, the motion feels more natural to most users. That is why `ease-out` is often the most reliable timing function for cards, section content, modals, chips, notifications, and onboarding prompts entering the viewport.",
        },
        {
          title: "Linear timing is usually for continuous or decorative motion",
          description:
            "If you want a repeated loop such as a floating badge, spinner-like accent, or subtle atmospheric animation, linear timing can work because the movement stays consistent. It is usually less appropriate for one-time reveals, where the motion should feel like it has a clear start and finish.",
          className: "bg-cyan-500/5 border-cyan-500/20",
        },
        {
          title: "Infinite loops need restraint and purpose",
          description:
            "Loops attract attention by design, which means they can easily become noise. Use infinite motion for small decorative accents, live indicators, status hints, or ambient elements. Avoid looping large surfaces or critical text containers unless the product genuinely benefits from constant movement.",
          className: "bg-violet-500/5 border-violet-500/20",
        },
        {
          title: "Strong animation should be reserved for high-signal moments",
          description:
            "Bounce, rotate, wobble, and larger movement distances create more emotional weight. That can be helpful for promotional design, gamified experiences, or celebratory interactions, but it usually hurts clarity when applied broadly across routine product UI. Motion becomes more valuable when it is treated like hierarchy, not decoration.",
          className: "bg-amber-500/5 border-amber-500/20",
        },
      ]}
      examples={[
        { scenario: "Hero card reveal", input: "Fade Up, 800ms, ease-out, 1 iteration", output: "A clean modern content entrance for landing pages" },
        { scenario: "Side panel entry", input: "Slide Right, 500ms, ease-in-out, 1 iteration", output: "Directional movement that supports navigation flow" },
        { scenario: "Soft CTA emphasis", input: "Pulse, 1400ms, ease-in-out, infinite", output: "Gentle repeated attention without hard interruption" },
        { scenario: "Playful promo badge", input: "Bounce, 900ms, ease, 2 iterations", output: "High-energy motion for celebratory or campaign moments" },
      ]}
      whyChoosePoints={[
        "This tool solves a real front-end workflow problem: many developers know the CSS animation syntax, but they waste time tuning timing, distance, and scale through repeated trial and error. A visual builder with copyable output shortens that loop and makes it easier to reach a motion decision that actually fits the component.",
        "It is useful for both designers and developers because motion is one of the areas where intent often gets lost in translation. Designers may know the feeling they want but not the exact CSS. Developers may know the syntax but not the right visual behavior. This page gives both sides a concrete preview and a code result that can move directly into implementation.",
        "Polished motion can improve user experience when it clarifies hierarchy, indicates state change, and helps content appear in a more readable sequence. That matters indirectly for page quality as well. Better perceived polish, clearer flow, and smoother interaction feedback can support stronger engagement metrics, which is relevant when building high-quality pages intended to retain users and reduce friction.",
        "The tool keeps all work in the browser. There is no signup wall, no project file to upload, and no reason to switch tabs just to test basic motion ideas. That makes it practical for agency work, internal dashboards, component libraries, design-system maintenance, landing-page builds, and quick motion checks during development.",
        "It also fits naturally into the rest of the design-tool workflow in this repo. Once you define motion here, you can continue into related tools such as the Border Radius Generator, Gradient Generator, Color Picker, and Palette Generator to shape the rest of the component system. That internal linking is useful because it reflects how real interface work actually happens: one design decision leads into the next.",
      ]}
      faqs={[
        {
          q: "What is the best CSS animation timing function for most interfaces?",
          a: "For most entrances and reveals, `ease-out` is the safest default because it starts with energy and settles smoothly. `ease-in-out` is also reliable when the movement should feel balanced. `linear` is better for continuous loops than for one-time UI entrances.",
        },
        {
          q: "How long should a CSS animation usually last?",
          a: "Many interface animations feel right somewhere between roughly 200ms and 900ms depending on the component and the distance it travels. Very small UI responses tend to work better on the shorter side, while larger entrances or more atmospheric motion can be slightly longer. Once the duration starts feeling noticeable instead of supportive, it is usually too slow.",
        },
        {
          q: "Should I use infinite looping animations on buttons and cards?",
          a: "Usually not on large elements. Infinite motion is best reserved for small accents, ambient details, live indicators, or cases where ongoing movement communicates something meaningful. If every important element loops forever, the interface becomes exhausting and users stop trusting the visual hierarchy.",
        },
        {
          q: "Can I use this output directly in production CSS?",
          a: "Yes. The generated keyframes and class block are standard CSS and can be copied into a stylesheet, CSS module, component-scoped file, or styling solution that supports normal CSS syntax. You may still want to rename the class or keyframes to match your project conventions.",
        },
        {
          q: "What is the difference between transform-based animation and animating layout properties?",
          a: "Transform-based animation usually performs better because it avoids expensive layout recalculation. Properties like `transform` and `opacity` are the standard starting point for smoother motion. That is why this generator focuses on movement patterns built around transforms and opacity rather than width, top, left, or margin changes.",
        },
        {
          q: "Is bounce or wobble bad for serious products?",
          a: "Not automatically, but both carry a stronger emotional tone. They work best in playful brands, campaign surfaces, onboarding moments, celebratory feedback, or limited promotional contexts. In dense enterprise or finance interfaces, calmer presets like fade or slide are usually easier to justify and scale.",
        },
        {
          q: "Can this help with onboarding sequences or staggered reveals?",
          a: "Yes. The delay control is especially useful when you want elements to appear in order. You can test a motion style here, then apply similar timing across a sequence of cards, steps, features, or walkthrough surfaces with incremented delays inside your real implementation.",
        },
        {
          q: "Who is this CSS animation generator most useful for?",
          a: "It is useful for front-end developers, UI designers, product designers, agencies building landing pages, marketers shaping promotional interfaces, and teams maintaining design systems who want motion that feels intentional without writing and reworking keyframes manually every time.",
        },
      ]}
      relatedTools={[
        { title: "CSS Border Radius Generator", slug: "css-border-radius-generator", icon: <Layers3 className="w-4 h-4" />, color: 217, benefit: "Refine the shape of the animated component" },
        { title: "CSS Gradient Generator", slug: "css-gradient-generator", icon: <Palette className="w-4 h-4" />, color: 152, benefit: "Build animated surfaces with stronger backgrounds" },
        { title: "Color Palette Generator", slug: "color-palette-generator", icon: <Sparkles className="w-4 h-4" />, color: 280, benefit: "Create a color system around the motion" },
        { title: "Color Picker", slug: "color-picker", icon: <Type className="w-4 h-4" />, color: 25, benefit: "Inspect exact colors used in the component" },
        { title: "Color Contrast Checker", slug: "color-contrast-checker", icon: <Move3D className="w-4 h-4" />, color: 340, benefit: "Validate readability after styling the animated element" },
        { title: "HEX to RGB Converter", slug: "hex-to-rgb-converter", icon: <Copy className="w-4 h-4" />, color: 45, benefit: "Convert brand colors into CSS-ready formats" },
      ]}
      ctaTitle="Need More CSS & Design Tools?"
      ctaDescription="Keep building the same component system with shape, color, gradient, and accessibility tools that fit this animation workflow."
      ctaHref="/category/css-design"
    />
  );
}
