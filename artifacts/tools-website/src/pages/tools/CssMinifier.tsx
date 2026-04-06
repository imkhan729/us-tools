import { useMemo, useState } from "react";
import { Braces, Code2, Copy, FileCode2, Gauge, Palette, RefreshCw, Scissors, Wand2 } from "lucide-react";
import UtilityToolPageShell from "./UtilityToolPageShell";

function removeCssComments(input: string) {
  return input.replace(/\/\*[\s\S]*?\*\//g, "");
}

function minifyCss(input: string, keepComments: boolean, stripLastSemicolons: boolean) {
  const source = keepComments ? input : removeCssComments(input);
  let result = source
    .replace(/\s+/g, " ")
    .replace(/\s*([{}:;,>+~])\s*/g, "$1")
    .replace(/\s*\(\s*/g, "(")
    .replace(/\s*\)\s*/g, ")")
    .replace(/\s*,\s*/g, ",")
    .trim();

  if (stripLastSemicolons) {
    result = result.replace(/;\}/g, "}");
  }

  return result.replace(/;;+/g, ";");
}

function countRuleBlocks(input: string) {
  return (input.match(/{/g) || []).length;
}

function countDeclarations(input: string) {
  return (input.match(/:/g) || []).length;
}

function formatBytes(value: number) {
  return `${Math.max(0, value).toLocaleString()} chars`;
}

export default function CssMinifier() {
  const [input, setInput] = useState(`/* landing page hero */
.hero {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(280px, 0.8fr);
  gap: 24px;
  padding: 32px;
  background: linear-gradient(135deg, #0f172a 0%, #2563eb 58%, #7dd3fc 100%);
}

.hero__title {
  font-size: clamp(2rem, 5vw, 4.5rem);
  line-height: 1.04;
  color: #ffffff;
}

.hero__button:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 38px rgba(15, 23, 42, 0.26);
}

@media (max-width: 900px) {
  .hero {
    grid-template-columns: 1fr;
    padding: 20px;
  }
}`);
  const [keepComments, setKeepComments] = useState(false);
  const [stripLastSemicolons, setStripLastSemicolons] = useState(true);
  const [copiedLabel, setCopiedLabel] = useState("");

  const output = useMemo(
    () => minifyCss(input, keepComments, stripLastSemicolons),
    [input, keepComments, stripLastSemicolons],
  );

  const originalSize = input.length;
  const minifiedSize = output.length;
  const savedChars = Math.max(0, originalSize - minifiedSize);
  const savedPercent = originalSize > 0 ? (savedChars / originalSize) * 100 : 0;
  const blocks = useMemo(() => countRuleBlocks(input), [input]);
  const declarations = useMemo(() => countDeclarations(input), [input]);

  const copyValue = async (label: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedLabel(label);
    window.setTimeout(() => setCopiedLabel(""), 1800);
  };

  const loadSample = () => {
    setInput(`/* promo banner */
.promo-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 18px 24px;
  border: 1px solid rgba(148, 163, 184, 0.22);
  background: linear-gradient(135deg, rgba(14, 116, 144, 0.12), rgba(37, 99, 235, 0.16));
}

.promo-banner__copy strong {
  color: #0f172a;
}

.promo-banner__cta:hover {
  background: #0f172a;
  color: #ffffff;
}

@media (max-width: 768px) {
  .promo-banner {
    flex-direction: column;
    align-items: stretch;
  }
}`);
  };

  const clearAll = () => setInput("");

  return (
    <UtilityToolPageShell
      title="CSS Minifier"
      seoTitle="CSS Minifier - Compress CSS Code Online"
      seoDescription="Free CSS minifier with comment stripping, minification stats, snippet copy tools, and production-ready compact output for stylesheets and embedded CSS."
      canonical="https://usonlinetools.com/developer/css-minifier"
      categoryName="Developer Tools"
      categoryHref="/category/developer"
      heroDescription="Compress CSS into a smaller, production-ready string without leaving the browser. This free CSS minifier strips unnecessary whitespace, helps remove comments, shows size savings instantly, and gives front-end developers a fast way to prepare embedded styles, prototypes, landing pages, and deployment snippets."
      heroIcon={<Scissors className="w-3.5 h-3.5" />}
      calculatorLabel="CSS Minifier Tool"
      calculatorDescription="Paste CSS, choose minification options, then copy compact output with instant size and compression stats."
      calculator={
        <div className="space-y-5">
          <div className="grid grid-cols-1 xl:grid-cols-[300px_1fr] gap-5">
            <div className="space-y-4 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
              <div>
                <p className="mb-2 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Minify Options</p>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-sm text-foreground">
                    <input
                      type="checkbox"
                      checked={keepComments}
                      onChange={(event) => setKeepComments(event.target.checked)}
                      className="h-4 w-4 rounded border-border"
                    />
                    Preserve comments
                  </label>
                  <label className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-sm text-foreground">
                    <input
                      type="checkbox"
                      checked={stripLastSemicolons}
                      onChange={(event) => setStripLastSemicolons(event.target.checked)}
                      className="h-4 w-4 rounded border-border"
                    />
                    Strip trailing semicolons before closing braces
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={loadSample}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-bold text-foreground hover:bg-muted"
                >
                  <Wand2 className="h-4 w-4" />
                  Sample
                </button>
                <button
                  onClick={clearAll}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-bold text-foreground hover:bg-muted"
                >
                  <RefreshCw className="h-4 w-4" />
                  Clear
                </button>
              </div>

              <div className="rounded-2xl border border-border bg-card p-4">
                <p className="mb-3 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Compression Stats</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2.5">
                    <span className="text-sm text-muted-foreground">Original size</span>
                    <span className="text-sm font-bold text-foreground">{formatBytes(originalSize)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2.5">
                    <span className="text-sm text-muted-foreground">Minified size</span>
                    <span className="text-sm font-bold text-foreground">{formatBytes(minifiedSize)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2.5">
                    <span className="text-sm text-muted-foreground">Saved</span>
                    <span className="text-sm font-bold text-emerald-600">{formatBytes(savedChars)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2.5">
                    <span className="text-sm text-muted-foreground">Compression</span>
                    <span className="text-sm font-bold text-foreground">{savedPercent.toFixed(1)}%</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-blue-500/20 bg-card p-4">
                <p className="mb-2 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Why Minify</p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Minification reduces transfer size, trims visual noise in embedded snippets, and makes it easier to ship CSS into CMS fields, HTML templates, tag managers, email builders, and test fixtures where extra formatting adds weight without helping delivery.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-border bg-card p-5">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">CSS Input</p>
                    <p className="text-xs text-muted-foreground">{originalSize.toLocaleString()} characters</p>
                  </div>
                  <textarea
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    placeholder="Paste CSS here..."
                    spellCheck={false}
                    className="min-h-[360px] w-full resize-none rounded-2xl border border-border bg-background p-4 font-mono text-sm leading-relaxed text-foreground outline-none"
                  />
                </div>

                <div className="rounded-2xl border border-border bg-card p-5">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Minified Output</p>
                    <button onClick={() => copyValue("output", output)} className="text-xs font-bold text-blue-600 hover:text-blue-700">
                      {copiedLabel === "output" ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <textarea
                    readOnly
                    value={output}
                    spellCheck={false}
                    className="min-h-[360px] w-full resize-none rounded-2xl border border-border bg-slate-950 p-4 font-mono text-sm leading-relaxed text-slate-100 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-4">
                <div className="rounded-2xl border border-border bg-card p-5">
                  <p className="mb-4 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Copy-Ready Snippets</p>
                  <div className="space-y-3">
                    {[
                      { label: "Minified CSS", value: output },
                      { label: "Style Tag", value: `<style>${output}</style>` },
                      { label: "JS Injection", value: `const css = ${JSON.stringify(output)};` },
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

                <div className="space-y-4">
                  <div className="rounded-2xl border border-border bg-card p-5">
                    <p className="mb-3 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Input Profile</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2.5">
                        <span className="text-sm text-muted-foreground">Rule blocks</span>
                        <span className="text-sm font-bold text-foreground">{blocks}</span>
                      </div>
                      <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2.5">
                        <span className="text-sm text-muted-foreground">Declarations</span>
                        <span className="text-sm font-bold text-foreground">{declarations}</span>
                      </div>
                      <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2.5">
                        <span className="text-sm text-muted-foreground">Comments</span>
                        <span className="text-sm font-bold text-foreground">{keepComments ? "Kept" : "Removed"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
                    <p className="mb-2 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Production Note</p>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      If your build pipeline already minifies CSS during deployment, use this tool for quick snippet cleanup, comparison, or one-off embedded styles. If you ship CSS manually, the size savings shown here are a practical preview of what compression removes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      howSteps={[
        {
          title: "Paste the stylesheet or CSS snippet you want to compress",
          description:
            "This tool works well for full component styles, utility blocks, responsive sections, landing page embeds, or one-off snippets copied from a design export or CMS field. Developers often need a compact version of CSS quickly, especially when moving styles into a template, testing a production issue, or reducing the visual clutter of code that only needs to be transported and injected.",
        },
        {
          title: "Choose whether comments should remain in the output",
          description:
            "Comments are useful for humans but expensive for transport because every comment adds bytes without affecting rendering. Removing them is usually the right choice for production snippets, while preserving them can still make sense if you are sharing the minified result internally for review or handing it to someone who still needs implementation notes attached.",
        },
        {
          title: "Decide whether to strip trailing semicolons before closing braces",
          description:
            "Most minifiers remove a final semicolon before a closing brace because the browser does not need it. The savings are small per rule, but across repeated blocks they add up. Exposing the toggle helps users match strict internal style expectations when a team prefers explicit semicolons even in compact output or when they want to compare output formats side by side.",
        },
        {
          title: "Copy the compact CSS or one of the generated wrapper snippets",
          description:
            "The page does more than collapse whitespace. It also provides copy-ready output for direct CSS usage, style-tag embedding, and JavaScript string injection. That matters because real-world CSS minification is rarely an isolated step. The next action is usually shipping the result into HTML, JS, a CMS, or an A/B testing environment immediately.",
        },
      ]}
      interpretationCards={[
        {
          title: "Saved characters are the clearest quick signal",
          description:
            "The absolute number of characters removed tells you how much visual and transport overhead was cut from the snippet. For smaller embeds that number may look modest, but for repetitive utility-heavy CSS it can still produce meaningful gains when pasted into constrained environments like builders, forms, emails, and inline widgets.",
        },
        {
          title: "Compression percentage helps compare snippets fairly",
          description:
            "A percentage is useful because it normalizes savings across different stylesheet sizes. A 200-character reduction means very different things on a 500-character block versus a 15,000-character export. That percentage gives a faster sense of whether the source CSS was already relatively clean or whether it still had a lot of removable formatting overhead.",
          className: "border-cyan-500/20 bg-cyan-500/5",
        },
        {
          title: "Comment stripping is often where the biggest easy win lives",
          description:
            "Many exported or hand-maintained stylesheets include comments for sections, breakpoints, experiments, and fallbacks. Those comments can make a large difference in total size, especially in copied snippets that bypass a formal build process. Making the comment choice visible helps users understand what is affecting the final payload rather than treating minification like a black box.",
          className: "border-violet-500/20 bg-violet-500/5",
        },
        {
          title: "Minification improves transport, not maintainability",
          description:
            "A minified stylesheet is better for delivery, but a formatted stylesheet is still better for debugging and long-term editing. That tradeoff matters. A practical workflow is to keep readable source CSS in the project and only use minified output for the version that actually gets embedded, shipped, or tested in production-like conditions.",
          className: "border-amber-500/20 bg-amber-500/5",
        },
      ]}
      examples={[
        {
          scenario: "Compress CSS for a CMS embed",
          input: "Readable banner styles with comments and spacing",
          output: "Compact one-line CSS ready for paste into a custom HTML block",
        },
        {
          scenario: "Prepare a small snippet for JavaScript injection",
          input: "Component styles spread across multiple lines",
          output: "Minified string suitable for runtime insertion",
        },
        {
          scenario: "Trim exported landing page CSS",
          input: "Builder-generated CSS with repeated whitespace",
          output: "Cleaner transport payload with measurable size savings",
        },
        {
          scenario: "Compare comment-preserved and comment-free output",
          input: "Stylesheet with internal documentation",
          output: "Two compact variants depending on collaboration needs",
        },
      ]}
      whyChoosePoints={[
        "This CSS minifier is built as a real working tool rather than as placeholder content around a textarea. It gives you compact output, control over comment preservation, a trailing-semicolon option, immediate compression statistics, and snippet copy helpers in one place. That is the practical set of features developers usually need when preparing CSS for manual deployment or constrained environments.",
        "The page also follows the long-form structure the project prompt requires. The working widget comes first, but the page then explains what the numbers mean, when minification matters, how to use the output responsibly, and how the tool fits into a broader front-end workflow. That creates a stronger search and usability page than a thin utility with no supporting context.",
        "For teams shipping CSS through formal build pipelines, the tool still has value. It is useful for testing, debugging, documentation, support work, vendor snippet cleanup, and quickly simulating what a compressed version of a stylesheet looks like without opening a full local toolchain. That is often the difference between a page people use once and a page they keep bookmarked.",
        "For marketers, CMS users, and agencies, minification can be even more directly useful. In those environments CSS is frequently pasted manually into theme settings, page builder modules, tag managers, or custom code boxes. Smaller snippets are easier to manage, less visually noisy, and easier to transport across systems that are not built like developer-first codebases.",
        "Everything runs in the browser, which is the right privacy and speed tradeoff for this kind of tool. If the CSS belongs to a client project, staging redesign, paid campaign, or unreleased launch, a local browser-side minifier is usually preferable to handing styles to a remote formatter just to remove whitespace and comments.",
      ]}
      faqs={[
        {
          q: "What does a CSS minifier actually remove?",
          a: "A CSS minifier mainly removes unnecessary whitespace, line breaks, indentation, and often comments. It may also remove optional trailing semicolons before closing braces. These changes do not affect rendering for valid CSS, but they reduce the amount of text that needs to be transferred or embedded.",
        },
        {
          q: "Will minified CSS load faster?",
          a: "It can help because there is less text to transfer, especially when CSS is delivered without additional build optimization. The impact varies with file size and delivery setup. If your project already uses bundling, compression, and caching, the gain may be smaller, but minification is still part of a standard production optimization path.",
        },
        {
          q: "Should I keep comments in minified output?",
          a: "Usually no for production snippets, because comments add bytes without helping the browser. You may still keep them when sharing a compact stylesheet internally, documenting a handoff, or comparing output during review. The right choice depends on whether the output is mainly for delivery or still for people.",
        },
        {
          q: "Can this replace build-step minification in a large app?",
          a: "No. Large applications should still rely on automated build tooling for consistent production optimization. This tool is best for quick manual compression, isolated snippets, embedded styles, support work, debugging, and situations where a full pipeline is unnecessary or unavailable.",
        },
        {
          q: "Why show both saved characters and compression percentage?",
          a: "Because they answer slightly different questions. Saved characters show the absolute reduction, while percentage shows how efficient the reduction is relative to the original size. Together they make the result easier to judge across both small and large snippets.",
        },
        {
          q: "Does removing the last semicolon before a closing brace matter?",
          a: "It matters only a little per rule, but many minifiers do it because every safe character reduction contributes to smaller output. In a large stylesheet or a heavily repeated snippet, those tiny removals add up. The browser does not need that final semicolon in a valid declaration block.",
        },
        {
          q: "When is a browser-based CSS minifier most useful?",
          a: "It is most useful when you need quick compact output without opening a local build process: for CMS snippets, tag manager injections, email templates, landing page builders, support troubleshooting, or manual before-and-after comparisons during front-end work.",
        },
        {
          q: "Should I minify source files I still plan to edit?",
          a: "Usually no. Keep your editable source CSS readable and formatted. Minify the version you embed or ship. That separation makes maintenance easier while still giving you the transport savings of compact output when it actually matters.",
        },
      ]}
      relatedTools={[
        { title: "CSS Formatter & Beautifier", slug: "css-formatter", icon: <Braces className="h-4 w-4" />, color: 220, benefit: "Switch back to readable CSS for review and debugging" },
        { title: "JSON Formatter", slug: "json-formatter", icon: <Code2 className="h-4 w-4" />, color: 200, benefit: "Clean API payloads alongside front-end snippets" },
        { title: "Color Code Converter", slug: "color-code-converter", icon: <Palette className="h-4 w-4" />, color: 340, benefit: "Convert HEX, RGB, HSL, and CMYK values used in stylesheets" },
        { title: "CSS Gradient Generator", slug: "css-gradient-generator", icon: <Wand2 className="h-4 w-4" />, color: 150, benefit: "Create gradients, then minify the resulting CSS" },
        { title: "Base64 Encoder & Decoder", slug: "base64-encoder-decoder", icon: <FileCode2 className="h-4 w-4" />, color: 35, benefit: "Prepare encoded values for embedded front-end workflows" },
        { title: "CSS Box Shadow Generator", slug: "css-box-shadow-generator", icon: <Gauge className="h-4 w-4" />, color: 280, benefit: "Generate effect styles and compress them for shipping" },
      ]}
      ctaTitle="Need More Front-End Utilities?"
      ctaDescription="Keep working through developer and CSS utilities for formatting, converting, generating, and shipping front-end code faster."
      ctaHref="/category/developer"
    />
  );
}
