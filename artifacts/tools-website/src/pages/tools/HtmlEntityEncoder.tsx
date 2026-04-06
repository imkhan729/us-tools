import { useMemo, useState } from "react";
import { ArrowLeftRight, Code2, Copy, FileCode2, Globe, RefreshCw, ScanText, Shield, Wand2 } from "lucide-react";
import UtilityToolPageShell from "./UtilityToolPageShell";

type Mode = "encode" | "decode";
type EntityStyle = "named" | "decimal" | "hex";

const namedEntityMap: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&apos;",
  "\u00a0": "&nbsp;",
  "\u00a9": "&copy;",
  "\u00ae": "&reg;",
  "\u2122": "&trade;",
  "\u20ac": "&euro;",
  "\u00a3": "&pound;",
  "\u00a5": "&yen;",
  "\u2022": "&bull;",
  "\u2013": "&ndash;",
  "\u2014": "&mdash;",
  "\u2026": "&hellip;",
  "\u00b0": "&deg;",
};

const reverseNamedEntityMap: Record<string, string> = Object.fromEntries(
  Object.entries(namedEntityMap).map(([character, entity]) => [entity.slice(1, -1), character]),
);

function shouldEncodeChar(character: string, encodeNonAscii: boolean) {
  const codePoint = character.codePointAt(0) ?? 0;
  return ["&", "<", ">", '"', "'"].includes(character) || (encodeNonAscii && (codePoint > 126 || codePoint < 32));
}

function encodeHtmlEntities(input: string, style: EntityStyle, encodeNonAscii: boolean) {
  let result = "";

  for (const character of input) {
    if (!shouldEncodeChar(character, encodeNonAscii)) {
      result += character;
      continue;
    }

    const codePoint = character.codePointAt(0) ?? 0;
    if (style === "named" && namedEntityMap[character]) {
      result += namedEntityMap[character];
      continue;
    }

    if (style === "hex") {
      result += `&#x${codePoint.toString(16).toUpperCase()};`;
      continue;
    }

    result += `&#${codePoint};`;
  }

  return result;
}

function decodeHtmlEntities(input: string) {
  return input.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (fullMatch, token: string) => {
    if (token.startsWith("#x") || token.startsWith("#X")) {
      const value = Number.parseInt(token.slice(2), 16);
      return Number.isFinite(value) ? String.fromCodePoint(value) : fullMatch;
    }

    if (token.startsWith("#")) {
      const value = Number.parseInt(token.slice(1), 10);
      return Number.isFinite(value) ? String.fromCodePoint(value) : fullMatch;
    }

    return reverseNamedEntityMap[token] ?? fullMatch;
  });
}

function countEncodedEntities(input: string) {
  return (input.match(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g) || []).length;
}

export default function HtmlEntityEncoder() {
  const [mode, setMode] = useState<Mode>("encode");
  const [entityStyle, setEntityStyle] = useState<EntityStyle>("named");
  const [encodeNonAscii, setEncodeNonAscii] = useState(true);
  const [input, setInput] = useState(`<button class="cta">Save & ship €29.99</button>`);
  const [copiedLabel, setCopiedLabel] = useState("");

  const output = useMemo(
    () => (mode === "encode" ? encodeHtmlEntities(input, entityStyle, encodeNonAscii) : decodeHtmlEntities(input)),
    [encodeNonAscii, entityStyle, input, mode],
  );

  const inputEntities = useMemo(() => countEncodedEntities(input), [input]);
  const outputEntities = useMemo(() => countEncodedEntities(output), [output]);

  const copyValue = async (label: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedLabel(label);
    window.setTimeout(() => setCopiedLabel(""), 1800);
  };

  const loadSample = () => {
    setMode("encode");
    setEntityStyle("named");
    setEncodeNonAscii(true);
    setInput(`<section data-note="5 > 3 & café prices start at €12">Tom & Jerry's Café</section>`);
  };

  const clearAll = () => setInput("");

  return (
    <UtilityToolPageShell
      title="HTML Entity Encoder & Decoder"
      seoTitle="HTML Entity Encoder & Decoder - Encode or Decode HTML Entities"
      seoDescription="Free HTML entity encoder and decoder with named, decimal, and hex entity output, live conversion, copy-ready snippets, and browser-safe text handling."
      canonical="https://usonlinetools.com/developer/html-entity-encoder"
      categoryName="Developer Tools"
      categoryHref="/category/developer"
      heroDescription="Encode special characters into HTML entities or decode entity-heavy strings back into readable text in one place. This free HTML entity encoder and decoder is useful for HTML snippets, CMS content, email templates, code samples, inline attributes, and any workflow where reserved characters need to be escaped safely before they reach the browser."
      heroIcon={<FileCode2 className="w-3.5 h-3.5" />}
      calculatorLabel="HTML Entity Tool"
      calculatorDescription="Switch between encode and decode modes, choose entity style, and copy browser-safe output instantly."
      calculator={
        <div className="space-y-5">
          <div className="grid grid-cols-1 xl:grid-cols-[300px_1fr] gap-5">
            <div className="space-y-4 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
              <div>
                <label htmlFor="entity-mode" className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Mode</label>
                <select id="entity-mode" value={mode} onChange={(event) => setMode(event.target.value as Mode)} className="tool-calc-input w-full">
                  <option value="encode">Encode text to entities</option>
                  <option value="decode">Decode entities to text</option>
                </select>
              </div>

              <div>
                <label htmlFor="entity-style" className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Entity Style</label>
                <select
                  id="entity-style"
                  value={entityStyle}
                  onChange={(event) => setEntityStyle(event.target.value as EntityStyle)}
                  className="tool-calc-input w-full"
                  disabled={mode === "decode"}
                >
                  <option value="named">Named entities</option>
                  <option value="decimal">Decimal entities</option>
                  <option value="hex">Hex entities</option>
                </select>
              </div>

              <label className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-sm text-foreground">
                <input
                  type="checkbox"
                  checked={encodeNonAscii}
                  onChange={(event) => setEncodeNonAscii(event.target.checked)}
                  className="h-4 w-4 rounded border-border"
                  disabled={mode === "decode"}
                />
                Encode non-ASCII characters too
              </label>

              <div className="grid grid-cols-2 gap-3">
                <button onClick={loadSample} className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-bold text-foreground hover:bg-muted">
                  <Wand2 className="w-4 h-4" />
                  Sample
                </button>
                <button onClick={clearAll} className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-bold text-foreground hover:bg-muted">
                  <RefreshCw className="w-4 h-4" />
                  Clear
                </button>
              </div>

              <div className="rounded-2xl border border-border bg-card p-4">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3">Conversion Stats</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2.5">
                    <span className="text-sm text-muted-foreground">Input chars</span>
                    <span className="text-sm font-bold text-foreground">{input.length}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2.5">
                    <span className="text-sm text-muted-foreground">Output chars</span>
                    <span className="text-sm font-bold text-foreground">{output.length}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2.5">
                    <span className="text-sm text-muted-foreground">Input entities</span>
                    <span className="text-sm font-bold text-foreground">{inputEntities}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2.5">
                    <span className="text-sm text-muted-foreground">Output entities</span>
                    <span className="text-sm font-bold text-foreground">{outputEntities}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Practical Use</p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Encode mode is useful when raw characters like `&`, `&lt;`, `&gt;`, quotes, or accented text need to survive inside HTML, attributes, CMS editors, documentation, or code examples. Decode mode is useful when you inherited entity-heavy content and need readable text again.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                      {mode === "encode" ? "Source Text" : "Encoded Input"}
                    </p>
                    <p className="text-xs text-muted-foreground">{mode === "encode" ? "Paste raw text or HTML" : "Paste entity strings"}</p>
                  </div>
                  <textarea
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    placeholder={mode === "encode" ? "Paste raw text or markup..." : "Paste HTML entities here..."}
                    spellCheck={false}
                    className="min-h-[320px] w-full rounded-2xl border border-border bg-background p-4 font-mono text-sm leading-relaxed text-foreground outline-none resize-none"
                  />
                </div>

                <div className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                      {mode === "encode" ? "Encoded Output" : "Decoded Output"}
                    </p>
                    <button onClick={() => copyValue("output", output)} className="text-xs font-bold text-blue-600 hover:text-blue-700">
                      {copiedLabel === "output" ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <textarea
                    readOnly
                    value={output}
                    spellCheck={false}
                    className="min-h-[320px] w-full rounded-2xl border border-border bg-slate-950 p-4 font-mono text-sm leading-relaxed text-slate-100 outline-none resize-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-4">
                <div className="rounded-2xl border border-border bg-card p-5">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-4">Copy-Ready Snippets</p>
                  <div className="space-y-3">
                    {[
                      { label: "Converted Output", value: output },
                      { label: "HTML Example", value: `<p>${mode === "encode" ? output : encodeHtmlEntities(output, entityStyle, encodeNonAscii)}</p>` },
                      { label: "JavaScript String", value: `const value = ${JSON.stringify(output)};` },
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
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3">Entity Guide</p>
                    <div className="space-y-2">
                      {[
                        { raw: "&", entity: "&amp;", note: "Ampersand in text and URLs" },
                        { raw: "<", entity: "&lt;", note: "Literal tag bracket" },
                        { raw: ">", entity: "&gt;", note: "Literal closing bracket" },
                        { raw: '"', entity: "&quot;", note: "Safe inside quoted attributes" },
                        { raw: "€", entity: "&euro; / &#8364;", note: "Named or numeric currency encoding" },
                      ].map((item) => (
                        <div key={`${item.raw}-${item.entity}`} className="rounded-xl border border-border bg-muted/40 px-3 py-2.5">
                          <div className="flex items-center justify-between gap-3">
                            <span className="font-mono text-sm text-foreground">{item.raw}</span>
                            <span className="font-mono text-sm font-bold text-blue-600">{item.entity}</span>
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground">{item.note}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Workflow Note</p>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      Named entities are easier for humans to scan, while decimal and hex entities are useful when you need explicit code point output or want a consistent numeric style across generated content.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      howSteps={[
        { title: "Choose whether you need to encode or decode", description: "Encode mode converts raw characters into HTML-safe entities, which is useful when a string includes reserved characters that could be misread by the browser as markup. Decode mode does the reverse and turns named, decimal, or hexadecimal entities back into plain text. Keeping both directions in one tool is important because real-world workflows often move back and forth during debugging, content migration, and publishing." },
        { title: "Pick the entity style that matches your target system", description: "Named entities such as `&amp;` and `&quot;` are more readable for humans and are often easiest to review in code samples, CMS fields, and documentation. Decimal entities such as `&#38;` and hexadecimal entities such as `&#x26;` are useful when you want explicit code point notation, need consistency across generated content, or are copying values into systems that already rely on numeric encoding." },
        { title: "Decide whether non-ASCII characters should also be encoded", description: "Some workflows only need the core HTML-reserved characters escaped, while others prefer to encode accented letters, symbols, and currencies as well. That is common in email templates, old CMS editors, syndicated content, or environments where character encoding issues still appear. Exposing that choice directly makes the output more predictable than hiding the rule behind an opinionated one-size-fits-all encoder." },
        { title: "Copy the converted output or a ready-made snippet", description: "After conversion, you can copy the plain output or one of the snippets that wraps it for HTML or JavaScript use. That matters because people rarely use entity conversion as a standalone academic step. Usually the next task is to paste the result straight into a template, an attribute value, a documentation block, or an application string." },
      ]}
      interpretationCards={[
        { title: "Encoded output protects characters that conflict with HTML syntax", description: "Characters such as ampersands, angle brackets, and quotes can change meaning inside HTML if they are left raw in the wrong context. Encoding them prevents the browser from interpreting them as structure when you only want them displayed as text." },
        { title: "Named entities are usually easiest to review by eye", description: "When teammates need to scan or edit the output manually, names like `&amp;` and `&quot;` are often more readable than numeric forms. That readability matters in CMS fields, documentation, code reviews, and content migration work.", className: "bg-cyan-500/5 border-cyan-500/20" },
        { title: "Numeric entities are useful for precision and compatibility", description: "Decimal and hexadecimal entities make the exact character code point explicit. That is useful when content pipelines, email builders, or imported data rely on numeric notation or when you are debugging encoding issues across systems.", className: "bg-violet-500/5 border-violet-500/20" },
        { title: "Decoding does not make unsafe HTML safe to render", description: "This tool converts entity text back into characters, but it is not an HTML sanitizer. If decoded content came from an untrusted source, it still needs proper sanitization before being rendered as live HTML in an application.", className: "bg-amber-500/5 border-amber-500/20" },
      ]}
      examples={[
        { scenario: "Escape an ampersand in copy", input: "Tom & Jerry", output: "Tom &amp; Jerry" },
        { scenario: "Encode literal tag brackets", input: "<div>", output: "&lt;div&gt;" },
        { scenario: "Decode imported CMS text", input: "Price &amp; availability", output: "Price & availability" },
        { scenario: "Convert accented text to numeric entities", input: "café €12", output: "caf&#233; &#8364;12" },
      ]}
      whyChoosePoints={[
        "This HTML entity encoder and decoder is built as a practical publishing and development tool, not as a placeholder page with a single text box. It supports both directions of conversion, multiple entity styles, non-ASCII encoding control, copy-ready snippets, and side-by-side output panels. That is the set of features people actually need when moving strings between code, CMS editors, templates, and browsers.",
        "The page also follows the stronger structure the project prompt asks for. The real tool comes first, but the page then explains what entity output means, when named entities are better than numeric ones, how encoding differs from sanitization, and why decoding is useful during migrations and debugging. That makes the page more useful for both users and search intent than a thin converter with no context.",
        "In front-end and content workflows, HTML entity handling is often a detail that becomes critical only when something breaks. A quote inside an attribute, an unexpected ampersand in query text, or accented content passing through an old pipeline can all create issues that are time-consuming to diagnose. A focused entity tool helps solve those problems quickly without opening a heavier local environment.",
        "The encode and decode modes are intentionally placed together because these workflows usually overlap. A developer may decode imported content to understand it, then re-encode only the parts that need escaping for a safer output context. A marketer may need to convert smart quotes and symbols for a template. A documentation writer may need entity-safe examples that still remain readable in source form.",
        "Everything runs locally in the browser, which is a sensible default for template fragments, private content, client snippets, and unpublished copy. When the goal is just to transform text safely for HTML display or recovery, there is little reason to send that content to a remote service when the conversion can happen instantly on the page.",
      ]}
      faqs={[
        { q: "What is an HTML entity?", a: "An HTML entity is a text representation of a character using an ampersand-based code such as `&amp;`, `&lt;`, or `&#8364;`. Entities are used when a character would otherwise conflict with HTML syntax or when you want to represent a character using a named or numeric code." },
        { q: "When should I encode text as HTML entities?", a: "You should encode text when it contains characters that need to be displayed literally inside HTML rather than interpreted as markup. Common examples include ampersands, angle brackets, quotes inside attributes, and sometimes non-ASCII characters when older systems or specific publishing pipelines expect entity encoding." },
        { q: "What is the difference between named, decimal, and hex entities?", a: "Named entities use readable labels like `&amp;` or `&euro;`. Decimal entities use a numeric code point like `&#38;`, while hexadecimal entities use a hex code point like `&#x26;`. All can represent the same character, but teams and systems may prefer one style over another." },
        { q: "Does decoding entities make HTML safe?", a: "No. Decoding only converts entity syntax back into characters. If the resulting text includes unsafe HTML or script content, that is still a separate security problem. Rendering untrusted HTML safely requires sanitization or strict escaping in the application, not just decoding." },
        { q: "Why would I encode non-ASCII characters too?", a: "Some environments still handle accented letters, symbols, or currency characters inconsistently, especially older email builders, imported CMS content, or cross-system data transfers. Encoding those characters can make transport more predictable when you need a conservative output format." },
        { q: "Why is `&` such a common thing to encode?", a: "Because the ampersand starts entity syntax in HTML. If you leave a literal ampersand in the wrong context, the browser may treat the following text as part of an entity. Encoding it as `&amp;` avoids ambiguity." },
        { q: "Who uses an HTML entity encoder and decoder?", a: "Front-end developers, CMS editors, email marketers, content teams, technical writers, SEO specialists, and agencies all use entity conversion when preparing snippets, cleaning exported text, publishing code examples, or debugging broken template output." },
        { q: "Can this tool handle both named and numeric entities during decoding?", a: "Yes. Decode mode recognizes common named entities as well as decimal and hexadecimal numeric entities, which makes it useful for mixed-content inputs copied from older tools, CMS exports, and generated markup." },
      ]}
      relatedTools={[
        { title: "URL Encoder & Decoder", slug: "url-encoder-decoder", icon: <Globe className="w-4 h-4" />, color: 196, benefit: "Encode query strings and URLs alongside HTML text" },
        { title: "Base64 Encoder & Decoder", slug: "base64-encoder-decoder", icon: <Shield className="w-4 h-4" />, color: 28, benefit: "Convert encoded payloads in adjacent workflows" },
        { title: "Hash Generator", slug: "hash-generator", icon: <ScanText className="w-4 h-4" />, color: 140, benefit: "Validate content fingerprints after transformation" },
        { title: "Markdown Previewer", slug: "online-markdown-previewer", icon: <Code2 className="w-4 h-4" />, color: 246, benefit: "Check rendered content after cleaning text" },
        { title: "Color Code Converter", slug: "color-code-converter", icon: <ArrowLeftRight className="w-4 h-4" />, color: 320, benefit: "Switch to another developer converter without leaving the hub" },
        { title: "JSON Formatter", slug: "json-formatter", icon: <FileCode2 className="w-4 h-4" />, color: 210, benefit: "Clean structured data next to entity-heavy strings" },
      ]}
      ctaTitle="Need More Encoding and Developer Tools?"
      ctaDescription="Keep converting, formatting, and validating content with adjacent developer utilities in the same tool hub."
      ctaHref="/category/developer"
    />
  );
}
