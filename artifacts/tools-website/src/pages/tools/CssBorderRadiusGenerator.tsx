import { useMemo, useState } from "react";
import { Check, Copy, Frame, Layers3, Move, Palette, RefreshCw, Sparkles, Type } from "lucide-react";
import UtilityToolPageShell from "./UtilityToolPageShell";

type Unit = "px" | "%";

interface RadiusValues {
  topLeft: number;
  topRight: number;
  bottomRight: number;
  bottomLeft: number;
}

const DEFAULT_VALUES: RadiusValues = {
  topLeft: 24,
  topRight: 24,
  bottomRight: 24,
  bottomLeft: 24,
};

const PRESETS: Array<{ label: string; values: RadiusValues; unit?: Unit }> = [
  { label: "Soft Card", values: { topLeft: 24, topRight: 24, bottomRight: 24, bottomLeft: 24 }, unit: "px" },
  { label: "Pill", values: { topLeft: 999, topRight: 999, bottomRight: 999, bottomLeft: 999 }, unit: "px" },
  { label: "Blob", values: { topLeft: 36, topRight: 12, bottomRight: 44, bottomLeft: 18 }, unit: "px" },
  { label: "Ticket", values: { topLeft: 8, topRight: 32, bottomRight: 8, bottomLeft: 32 }, unit: "px" },
  { label: "Organic", values: { topLeft: 24, topRight: 52, bottomRight: 18, bottomLeft: 48 }, unit: "%" },
];

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function formatRadius(values: RadiusValues, unit: Unit) {
  const parts = [values.topLeft, values.topRight, values.bottomRight, values.bottomLeft].map((value) => `${value}${unit}`);
  if (parts.every((part) => part === parts[0])) return parts[0];
  if (parts[0] === parts[2] && parts[1] === parts[3]) return `${parts[0]} ${parts[1]}`;
  if (parts[1] === parts[3]) return `${parts[0]} ${parts[1]} ${parts[2]}`;
  return parts.join(" ");
}

function cssBlock(values: RadiusValues, unit: Unit) {
  return `border-radius: ${formatRadius(values, unit)};`;
}

function tailwindHint(values: RadiusValues, unit: Unit) {
  if (unit !== "px") return "Custom value required because percentages do not map cleanly to default Tailwind radius utilities.";
  const allEqual = values.topLeft === values.topRight && values.topRight === values.bottomRight && values.bottomRight === values.bottomLeft;
  if (!allEqual) return `rounded-[${formatRadius(values, unit).replace(/ /g, "_")}]`;

  const value = values.topLeft;
  if (value <= 4) return "rounded";
  if (value <= 8) return "rounded-md";
  if (value <= 12) return "rounded-lg";
  if (value <= 16) return "rounded-xl";
  if (value <= 24) return "rounded-2xl";
  if (value <= 32) return "rounded-3xl";
  return "rounded-full or a custom arbitrary value";
}

export default function CssBorderRadiusGenerator() {
  const [values, setValues] = useState<RadiusValues>(DEFAULT_VALUES);
  const [linked, setLinked] = useState(true);
  const [unit, setUnit] = useState<Unit>("px");
  const [copiedLabel, setCopiedLabel] = useState("");

  const maxValue = unit === "px" ? 120 : 50;
  const radiusText = useMemo(() => formatRadius(values, unit), [unit, values]);
  const cssText = useMemo(() => cssBlock(values, unit), [unit, values]);
  const tailwindText = useMemo(() => tailwindHint(values, unit), [unit, values]);
  const shapeSummary = useMemo(() => {
    if (linked) {
      return "All corners are locked together. This is the fastest way to test common card, button, and input shapes that need symmetry.";
    }

    const strongestCorner = Object.entries(values).sort((a, b) => b[1] - a[1])[0][0];
    const cornerLabel =
      strongestCorner === "topLeft"
        ? "top-left"
        : strongestCorner === "topRight"
          ? "top-right"
          : strongestCorner === "bottomRight"
            ? "bottom-right"
            : "bottom-left";

    return `This asymmetric radius pushes the strongest curve into the ${cornerLabel} corner. That is useful for hero cards, badges, product tiles, avatars, speech bubbles, and layouts that need a little more visual character than a generic rounded rectangle.`;
  }, [linked, values]);

  const updateCorner = (corner: keyof RadiusValues, nextValue: number) => {
    const safeValue = clamp(nextValue, 0, maxValue);
    if (linked) {
      setValues({
        topLeft: safeValue,
        topRight: safeValue,
        bottomRight: safeValue,
        bottomLeft: safeValue,
      });
      return;
    }

    setValues((current) => ({ ...current, [corner]: safeValue }));
  };

  const applyPreset = (preset: (typeof PRESETS)[number]) => {
    setUnit(preset.unit ?? "px");
    setValues(preset.values);
  };

  const randomize = () => {
    const nextUnit: Unit = Math.random() > 0.7 ? "%" : "px";
    const limit = nextUnit === "px" ? 120 : 50;
    setUnit(nextUnit);
    setLinked(false);
    setValues({
      topLeft: Math.floor(Math.random() * limit),
      topRight: Math.floor(Math.random() * limit),
      bottomRight: Math.floor(Math.random() * limit),
      bottomLeft: Math.floor(Math.random() * limit),
    });
  };

  const copyValue = async (label: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedLabel(label);
    window.setTimeout(() => setCopiedLabel(""), 1800);
  };

  return (
    <UtilityToolPageShell
      title="CSS Border Radius Generator"
      seoTitle="CSS Border Radius Generator - Free Rounded Corner CSS Builder"
      seoDescription="Free CSS border radius generator with live preview, per-corner controls, presets, and copyable CSS shorthand. Build rounded corners for cards, buttons, inputs, and UI components instantly."
      canonical="https://usonlinetools.com/css-design/css-border-radius-generator"
      categoryName="CSS & Design Tools"
      categoryHref="/category/css-design"
      heroDescription="Generate rounded-corner CSS visually with a live preview and instant shorthand output. Tune all four corners together or separately, switch between pixel and percentage units, test presets, and copy production-ready border-radius values for buttons, cards, forms, avatars, banners, modals, and modern interface components."
      heroIcon={<Move className="w-3.5 h-3.5" />}
      calculatorLabel="Radius Builder"
      calculatorDescription="Control all four corners, preview the shape, and export CSS or Tailwind-friendly values instantly."
      calculator={
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-5">
            <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5 space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Control Mode</p>
                  <p className="text-sm text-foreground font-bold mt-1">{linked ? "Linked corners" : "Independent corners"}</p>
                </div>
                <button
                  onClick={() => setLinked((value) => !value)}
                  className={`rounded-xl px-4 py-2 text-xs font-bold ${linked ? "bg-blue-600 text-white" : "bg-card text-foreground border border-border"}`}
                >
                  {linked ? "Linked" : "Unlocked"}
                </button>
              </div>

              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Unit</p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setUnit("px")}
                    className={`rounded-xl px-4 py-3 text-sm font-bold ${unit === "px" ? "bg-blue-600 text-white" : "border border-border bg-card text-foreground"}`}
                  >
                    Pixels
                  </button>
                  <button
                    onClick={() => setUnit("%")}
                    className={`rounded-xl px-4 py-3 text-sm font-bold ${unit === "%" ? "bg-blue-600 text-white" : "border border-border bg-card text-foreground"}`}
                  >
                    Percent
                  </button>
                </div>
              </div>

              {[
                { key: "topLeft", label: "Top Left" },
                { key: "topRight", label: "Top Right" },
                { key: "bottomRight", label: "Bottom Right" },
                { key: "bottomLeft", label: "Bottom Left" },
              ].map((item) => (
                <div key={item.key}>
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <label htmlFor={item.key} className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                      {item.label}
                    </label>
                    <span className="text-xs font-bold text-blue-600">{values[item.key as keyof RadiusValues]}{unit}</span>
                  </div>
                  <input
                    id={item.key}
                    type="range"
                    min={0}
                    max={maxValue}
                    value={values[item.key as keyof RadiusValues]}
                    onChange={(event) => updateCorner(item.key as keyof RadiusValues, Number(event.target.value))}
                    className="w-full accent-blue-500"
                  />
                </div>
              ))}

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={randomize}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-bold text-foreground hover:bg-muted"
                >
                  <RefreshCw className="w-4 h-4" />
                  Random
                </button>
                <button
                  onClick={() => {
                    setLinked(true);
                    setUnit("px");
                    setValues(DEFAULT_VALUES);
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-bold text-foreground hover:bg-muted"
                >
                  <Layers3 className="w-4 h-4" />
                  Reset
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-border bg-card p-6">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-4">Live Preview</p>
                <div className="rounded-[32px] bg-slate-100 p-5 dark:bg-slate-900">
                  <div
                    className="mx-auto flex h-64 max-w-xl items-end justify-between overflow-hidden border border-white/25 bg-gradient-to-br from-sky-500 via-cyan-400 to-teal-300 p-6 shadow-inner"
                    style={{ borderRadius: radiusText }}
                  >
                    <div className="max-w-[70%] text-white">
                      <p className="text-xs font-black uppercase tracking-[0.2em] opacity-80 mb-2">Preview Card</p>
                      <h3 className="text-2xl font-black mb-2">Rounded corners change the entire feel of a component.</h3>
                      <p className="text-sm leading-relaxed opacity-90">
                        Soft symmetry feels safe and product-like. Aggressive asymmetry feels editorial, promotional, or more expressive.
                      </p>
                    </div>
                    <div className="rounded-2xl bg-white/20 px-4 py-2 text-xs font-bold text-white backdrop-blur-sm">CTA</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-border bg-card p-4">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">CSS Output</p>
                    <button onClick={() => copyValue("css", cssText)} className="text-xs font-bold text-blue-600 hover:text-blue-700">
                      {copiedLabel === "css" ? "Copied" : "Copy CSS"}
                    </button>
                  </div>
                  <pre className="overflow-x-auto rounded-xl bg-slate-950 p-3 text-xs leading-relaxed text-slate-100">
                    <code>{cssText}</code>
                  </pre>
                </div>

                <div className="rounded-2xl border border-border bg-card p-4">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Tailwind Hint</p>
                    <button onClick={() => copyValue("tailwind", tailwindText)} className="text-xs font-bold text-blue-600 hover:text-blue-700">
                      {copiedLabel === "tailwind" ? "Copied" : "Copy Hint"}
                    </button>
                  </div>
                  <div className="rounded-xl bg-muted/60 p-3">
                    <code className="text-sm font-mono font-bold text-foreground">{tailwindText}</code>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                    Use this as a fast utility starting point, then refine with a custom arbitrary value if the shape is asymmetric.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-4">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Quick Presets</p>
                  <button onClick={() => copyValue("radius", radiusText)} className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700">
                    {copiedLabel === "radius" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    Copy Shorthand
                  </button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {PRESETS.map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => applyPreset(preset)}
                      className="rounded-xl border border-border bg-card px-4 py-3 text-sm font-bold text-foreground hover:bg-muted"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-4">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Shape Insight</p>
                <p className="text-sm leading-relaxed text-muted-foreground">{shapeSummary}</p>
              </div>
            </div>
          </div>
        </div>
      }
      howSteps={[
        {
          title: "Decide whether the component needs symmetric or expressive corners",
          description:
            "If you are styling a standard button, card, modal, form field, or navigation chip, start in linked mode so all four corners move together. That gives you a clean, predictable radius quickly. If you are building a hero card, promo banner, badge, testimonial block, or editorial shape with more character, unlock the corners so each side can carry a different curve.",
        },
        {
          title: "Choose between pixel and percentage units based on the component’s job",
          description:
            "Pixels are usually the right choice for UI systems because they stay consistent across cards, buttons, inputs, dropdowns, and layout shells. Percentages are more useful when the shape should respond proportionally to the element itself, such as pills, avatar masks, decorative panels, organic thumbnails, or more experimental landing-page sections.",
        },
        {
          title: "Tune each corner while watching the live preview instead of guessing in code",
          description:
            "The preview is the point of the tool. Border radius values can look very different in a stylesheet than they do in a real component with background color, content weight, and spacing. Adjust the sliders until the component feels balanced in context, then copy the exact shorthand output rather than iterating blindly in devtools.",
        },
        {
          title: "Copy the CSS output or use the Tailwind hint as your implementation shortcut",
          description:
            "If you are writing plain CSS, SCSS, styled-components, or inline styles, copy the `border-radius` declaration directly. If you are working in Tailwind, use the suggested utility or arbitrary value as a starting point. That reduces back-and-forth between design exploration and implementation, especially when the shape is slightly custom.",
        },
      ]}
      interpretationCards={[
        {
          title: "Small radii feel sharper, denser, and more utility-focused",
          description:
            "Lower values usually suit data tables, compact admin UIs, utility panels, token chips, and technical products where the interface needs precision more than softness. They also help when the layout already has a lot of motion or visual texture and does not need extra curvature competing for attention.",
        },
        {
          title: "Medium radii are the modern default for cards, buttons, and inputs",
          description:
            "Most contemporary interfaces live here because the components feel approachable without becoming cartoonish. If you are building a SaaS product, dashboard, settings page, pricing table, modal, or marketing section and you want a safe polished baseline, this is usually the range to test first.",
          className: "bg-cyan-500/5 border-cyan-500/20",
        },
        {
          title: "Large or asymmetric radii create personality, hierarchy, and motion",
          description:
            "Aggressive curves can make a component feel premium, playful, editorial, or highly branded. They are most effective when used with discipline on hero cards, promo tiles, collection blocks, testimonials, illustrations, or campaign sections. If every component uses extreme radii, the entire interface starts to lose structure.",
          className: "bg-violet-500/5 border-violet-500/20",
        },
        {
          title: "Percentages are shape tools, not just alternate units",
          description:
            "A percentage radius changes with the dimensions of the element, which means the same rule can look subtle on one block and highly organic on another. That makes percentages useful for responsive decorative surfaces, but less ideal for tightly controlled product UI systems where consistency is the priority.",
          className: "bg-amber-500/5 border-amber-500/20",
        },
      ]}
      examples={[
        { scenario: "Dashboard cards", input: "24px linked radius", output: "Clean modern cards that feel friendly without losing structure" },
        { scenario: "Primary CTA", input: "999px linked radius", output: "Pill-shaped button with a softer promotional feel" },
        { scenario: "Hero promo block", input: "36px 12px 44px 18px", output: "Asymmetric component with more editorial energy" },
        { scenario: "Organic thumbnail mask", input: "24% 52% 18% 48%", output: "Responsive curved shape for visual sections and creative layouts" },
      ]}
      whyChoosePoints={[
        "This generator is practical because border radius is one of the fastest ways to change how polished, technical, playful, or premium an interface feels. Designers often underestimate it because the property looks simple in CSS, but small changes here can alter the entire tone of a product surface, button system, card stack, form flow, or hero layout.",
        "The tool helps reduce wasted implementation cycles. Instead of writing `border-radius`, refreshing the browser, adjusting values in devtools, and repeating that process across several components, you can preview the shape immediately, copy the shorthand, and move into the codebase with a decision that is already visually tested.",
        "It also supports stronger on-page design consistency. If you use the same rounded-corner language across cards, inputs, badges, dialog boxes, CTAs, and content containers, the interface becomes easier to scan and feels more trustworthy. That matters indirectly for SEO and conversion because clearer interfaces tend to hold attention better and reduce friction around important actions.",
        "Developers benefit from the Tailwind-friendly hint because many real projects are not writing raw CSS for every component. The tool shortens the handoff from experimentation to implementation whether you are using regular CSS, component libraries, utility-first frameworks, or design-token systems.",
        "This page fits into a broader internal workflow. Once you settle on a corner language here, you can continue with the CSS Gradient Generator, Color Picker, Color Contrast Checker, and future shadow tools to build a more complete design system. That internal linking is not filler; it is part of a practical UI-building path that keeps users inside the tool ecosystem.",
      ]}
      faqs={[
        {
          q: "What is the difference between using pixels and percentages for border radius?",
          a: "Pixels create fixed-radius corners, which is usually what you want for dependable UI systems. Percentages scale with the size of the element, which makes them better for pills, organic shapes, decorative masks, or responsive artwork. In most product interfaces, pixels are easier to standardize and document.",
        },
        {
          q: "When should I use asymmetric border radius values?",
          a: "Use asymmetric corners when a component needs personality or directional emphasis. They work well for hero cards, marketing sections, testimonials, labels, avatars, feature blocks, and creative layouts. They are less suitable for dense utility interfaces where every component needs to feel neutral and consistent.",
        },
        {
          q: "Can I paste this output directly into CSS?",
          a: "Yes. The generated output is a standard `border-radius` declaration and can be pasted into plain CSS, SCSS, CSS modules, styled-components, inline styles, or most design-system token setups immediately.",
        },
        {
          q: "Does a higher border radius always make the design look better?",
          a: "No. Large radii can make interfaces feel softer and more modern, but they can also reduce visual precision if applied everywhere. The best value depends on the product, the spacing scale, the typography, and the overall brand tone. Rounded corners should support the system, not dominate it.",
        },
        {
          q: "Why does the same radius look different on different components?",
          a: "Because the visual effect depends on the width, height, padding, background, border, and surrounding spacing of the element. A radius that feels subtle on a wide card may feel extreme on a narrow badge or small button. That is exactly why a live preview is more reliable than guessing from raw numbers.",
        },
        {
          q: "Can this help with Tailwind CSS projects?",
          a: "Yes. The Tailwind hint gives you a fast mapping to common rounded utilities or a custom arbitrary value when the shape is not symmetrical. It is not meant to replace your design system, but it speeds up the path from exploration to implementation.",
        },
        {
          q: "Should all components in a website use the same border radius?",
          a: "Usually they should share the same radius language, but not always the exact same value. A design system often uses a small range such as one radius for inputs, another for cards, and a larger one for hero elements or pills. Consistency matters more than strict uniformity.",
        },
        {
          q: "Who is this border radius generator useful for?",
          a: "It is useful for front-end developers, UI designers, product designers, marketers building landing pages, agencies creating component libraries, and anyone who wants to tighten up interface quality without repeatedly guessing corner values in a browser inspector.",
        },
      ]}
      relatedTools={[
        { title: "CSS Gradient Generator", slug: "css-gradient-generator", icon: <Layers3 className="w-4 h-4" />, color: 217, benefit: "Pair rounded shapes with backgrounds" },
        { title: "Color Picker", slug: "color-picker", icon: <Palette className="w-4 h-4" />, color: 152, benefit: "Inspect the colors used in your components" },
        { title: "Color Contrast Checker", slug: "color-contrast-checker", icon: <Type className="w-4 h-4" />, color: 280, benefit: "Validate text readability on shaped surfaces" },
        { title: "Color Palette Generator", slug: "color-palette-generator", icon: <Sparkles className="w-4 h-4" />, color: 25, benefit: "Build a complete visual system around the shape" },
        { title: "HEX to RGB Converter", slug: "hex-to-rgb-converter", icon: <Frame className="w-4 h-4" />, color: 340, benefit: "Convert brand colors into code-ready formats" },
        { title: "Meta Tag Generator", slug: "meta-tag-generator", icon: <Copy className="w-4 h-4" />, color: 45, benefit: "Keep building the site after styling decisions" },
      ]}
      ctaTitle="Need More CSS & Design Tools?"
      ctaDescription="Keep refining the same interface system with palette, gradient, contrast, and format-conversion tools that fit this page’s workflow."
      ctaHref="/category/css-design"
    />
  );
}
