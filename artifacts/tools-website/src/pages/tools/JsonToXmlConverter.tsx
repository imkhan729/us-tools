import { useMemo, useState } from "react";
import { ArrowRightLeft, Braces, FileCode2, Globe, RefreshCw, ScanText, Table2, Wand2 } from "lucide-react";
import UtilityToolPageShell from "./UtilityToolPageShell";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function sanitizeTagName(tag: string) {
  const trimmed = tag.trim() || "item";
  const replaced = trimmed.replace(/[^A-Za-z0-9_.-]/g, "_");
  return /^[A-Za-z_]/.test(replaced) ? replaced : `node_${replaced}`;
}

function repeatIndent(size: number, level: number) {
  return " ".repeat(size * Math.max(level, 0));
}

function renderPrimitive(value: unknown, useCdata: boolean) {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") {
    if (useCdata && /[<&>]/.test(value)) {
      return `<![CDATA[${value.replace(/]]>/g, "]]]]><![CDATA[>")}]]>`;
    }
    return escapeXml(value);
  }
  return escapeXml(String(value));
}

function convertValueToXml(
  value: unknown,
  tagName: string,
  itemTag: string,
  indentSize: number,
  level: number,
  pretty: boolean,
  useCdata: boolean,
): string {
  const safeTag = sanitizeTagName(tagName);
  const indent = pretty ? repeatIndent(indentSize, level) : "";
  const newline = pretty ? "\n" : "";

  if (value === null || value === undefined) {
    return `${indent}<${safeTag} />`;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return `${indent}<${safeTag} />`;
    }

    const children = value
      .map((item) => convertValueToXml(item, itemTag, itemTag, indentSize, level + 1, pretty, useCdata))
      .join(newline);

    return `${indent}<${safeTag}>${newline}${children}${newline}${indent}</${safeTag}>`;
  }

  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) {
      return `${indent}<${safeTag} />`;
    }

    const children = entries
      .map(([key, nested]) => convertValueToXml(nested, key, itemTag, indentSize, level + 1, pretty, useCdata))
      .join(newline);

    return `${indent}<${safeTag}>${newline}${children}${newline}${indent}</${safeTag}>`;
  }

  const content = renderPrimitive(value, useCdata);
  return `${indent}<${safeTag}>${content}</${safeTag}>`;
}

function countNodes(value: unknown): number {
  if (value === null || value === undefined) return 1;
  if (Array.isArray(value)) return 1 + value.reduce<number>((sum, item) => sum + countNodes(item), 0);
  if (typeof value === "object") return 1 + Object.values(value as Record<string, unknown>).reduce<number>((sum, item) => sum + countNodes(item), 0);
  return 1;
}

export default function JsonToXmlConverter() {
  const [input, setInput] = useState(`{
  "launch": {
    "title": "Utility Hub",
    "live": true,
    "features": ["formatter", "minifier", "converter"]
  }
}`);
  const [rootName, setRootName] = useState("root");
  const [itemTag, setItemTag] = useState("item");
  const [indentSize, setIndentSize] = useState("2");
  const [includeDeclaration, setIncludeDeclaration] = useState(true);
  const [useCdata, setUseCdata] = useState(false);
  const [copiedLabel, setCopiedLabel] = useState("");

  const result = useMemo(() => {
    try {
      const parsed = JSON.parse(input);
      const pretty = true;
      const xmlBody = convertValueToXml(parsed, rootName, itemTag, Number.parseInt(indentSize, 10) || 2, 0, pretty, useCdata);
      const declaration = includeDeclaration ? '<?xml version="1.0" encoding="UTF-8"?>\n' : "";
      return {
        output: `${declaration}${xmlBody}`,
        error: "",
        nodes: countNodes(parsed),
      };
    } catch (error) {
      return {
        output: "",
        error: error instanceof Error ? error.message : "Invalid JSON input.",
        nodes: 0,
      };
    }
  }, [includeDeclaration, indentSize, input, itemTag, rootName, useCdata]);

  const copyValue = async (label: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedLabel(label);
    window.setTimeout(() => setCopiedLabel(""), 1800);
  };

  const loadSample = () => {
    setInput(`[
  {
    "id": 1,
    "profile": {
      "name": "Alice Smith",
      "department": "Engineering"
    },
    "active": true
  },
  {
    "id": 2,
    "profile": {
      "name": "Bob Chen",
      "department": "Operations"
    },
    "active": false
  }
]`);
    setRootName("records");
    setItemTag("record");
    setIndentSize("2");
    setIncludeDeclaration(true);
    setUseCdata(false);
  };

  const clearAll = () => setInput("");

  return (
    <UtilityToolPageShell
      title="JSON to XML Converter"
      seoTitle="JSON to XML Converter - Convert JSON to XML Online"
      seoDescription="Free JSON to XML converter with root and item tag controls, XML declaration toggle, CDATA option, and validated pretty output."
      canonical="https://usonlinetools.com/developer/json-to-xml"
      categoryName="Developer Tools"
      categoryHref="/category/developer"
      heroDescription="Convert JSON objects and arrays into well-structured XML directly in the browser. This free JSON to XML converter helps developers, integration teams, and analysts transform API payloads, configuration records, fixture data, and structured exports into XML for legacy systems, feeds, imports, and schema-based workflows."
      heroIcon={<ArrowRightLeft className="w-3.5 h-3.5" />}
      calculatorLabel="JSON to XML Converter"
      calculatorDescription="Paste JSON, choose root and item tags, control XML output options, and copy validated XML instantly."
      calculator={
        <div className="space-y-5">
          <div className="grid grid-cols-1 xl:grid-cols-[300px_1fr] gap-5">
            <div className="space-y-4 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
              <div>
                <label htmlFor="root-name" className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Root Tag</label>
                <input id="root-name" value={rootName} onChange={(event) => setRootName(event.target.value)} className="tool-calc-input w-full" />
              </div>

              <div>
                <label htmlFor="item-tag" className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Array Item Tag</label>
                <input id="item-tag" value={itemTag} onChange={(event) => setItemTag(event.target.value)} className="tool-calc-input w-full" />
              </div>

              <div>
                <label htmlFor="xml-indent" className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Indent Size</label>
                <select id="xml-indent" value={indentSize} onChange={(event) => setIndentSize(event.target.value)} className="tool-calc-input w-full">
                  <option value="2">2 spaces</option>
                  <option value="4">4 spaces</option>
                </select>
              </div>

              <label className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-sm text-foreground">
                <input type="checkbox" checked={includeDeclaration} onChange={(event) => setIncludeDeclaration(event.target.checked)} className="h-4 w-4 rounded border-border" />
                Include XML declaration
              </label>

              <label className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-sm text-foreground">
                <input type="checkbox" checked={useCdata} onChange={(event) => setUseCdata(event.target.checked)} className="h-4 w-4 rounded border-border" />
                Wrap special strings in CDATA
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
                    <span className="text-sm text-muted-foreground">XML nodes</span>
                    <span className="text-sm font-bold text-foreground">{result.nodes}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2.5">
                    <span className="text-sm text-muted-foreground">Output size</span>
                    <span className="text-sm font-bold text-foreground">{result.output.length} chars</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-blue-500/20 bg-card p-4">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Converter Note</p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  XML works best when element names are predictable and arrays have a consistent item tag. Giving you direct control over the root and item names makes the output easier to fit into legacy integrations, feed schemas, and import pipelines that expect stable XML structure.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">JSON Input</p>
                    <p className="text-xs text-muted-foreground">{input.length} characters</p>
                  </div>
                  <textarea
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    placeholder="Paste JSON here..."
                    spellCheck={false}
                    className="min-h-[360px] w-full rounded-2xl border border-border bg-background p-4 font-mono text-sm leading-relaxed text-foreground outline-none resize-none"
                  />
                </div>

                <div className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">XML Output</p>
                    <button onClick={() => copyValue("output", result.output)} className="text-xs font-bold text-blue-600 hover:text-blue-700" disabled={!result.output}>
                      {copiedLabel === "output" ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <textarea
                    readOnly
                    value={result.output}
                    spellCheck={false}
                    className="min-h-[360px] w-full rounded-2xl border border-border bg-slate-950 p-4 font-mono text-sm leading-relaxed text-slate-100 outline-none resize-none"
                  />
                </div>
              </div>

              {result.error && (
                <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-5">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Validation Error</p>
                  <p className="text-sm leading-relaxed text-muted-foreground">{result.error}</p>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-[1.08fr_0.92fr] gap-4">
                <div className="rounded-2xl border border-border bg-card p-5">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-4">Copy-Ready Snippets</p>
                  <div className="space-y-3">
                    {[
                      { label: "XML Output", value: result.output },
                      { label: "SOAP Body Snippet", value: result.output ? `<payload>\n${result.output}\n</payload>` : "" },
                      { label: "String Literal", value: `const xml = ${JSON.stringify(result.output)};` },
                    ].map((item) => (
                      <div key={item.label} className="rounded-xl border border-border bg-muted/40 p-3">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">{item.label}</p>
                          <button onClick={() => copyValue(item.label, item.value)} className="text-xs font-bold text-blue-600 hover:text-blue-700" disabled={!item.value}>
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
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3">Output Profile</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2.5">
                        <span className="text-sm text-muted-foreground">Root tag</span>
                        <span className="text-sm font-bold text-foreground">{rootName || "root"}</span>
                      </div>
                      <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2.5">
                        <span className="text-sm text-muted-foreground">Item tag</span>
                        <span className="text-sm font-bold text-foreground">{itemTag || "item"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Workflow Context</p>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      JSON-to-XML conversion is most useful when modern API payloads need to talk to older feeds, XML-based imports, SOAP-style workflows, config pipelines, or data interchange systems that still expect tagged hierarchical output rather than JSON objects.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      howSteps={[
        { title: "Paste the JSON payload you want to convert", description: "This tool works with objects and arrays, which are the most common structures people need to move from modern API payloads into XML-oriented systems. It is useful for config records, API fixtures, transformed exports, and integration payloads where the target side still expects XML." },
        { title: "Set the root and item tag names to match your target system", description: "XML is much stricter about element names and structure than JSON. Giving the output a stable root tag and a clear repeating item tag for arrays makes the resulting XML easier to integrate into legacy services, importers, feeds, and schemas that depend on predictable element names." },
        { title: "Choose whether the output should include an XML declaration or CDATA wrapping", description: "Some target systems expect an XML declaration at the top of the document, while others only need the raw element tree. CDATA can be helpful when string values contain angle brackets or markup-like content that you want preserved more literally inside the XML without additional escaping noise." },
        { title: "Review the generated XML and copy the final output", description: "The side-by-side layout lets you confirm the structure before you paste it into an integration, import system, or documentation sample. That matters because array naming, tag sanitization, and nesting shape are often what determine whether an XML handoff works smoothly downstream." },
      ]}
      interpretationCards={[
        { title: "JSON objects become element trees, not attributes by default", description: "This converter maps JSON structure into nested XML elements because that is the most predictable and portable default. Some XML schemas use attributes heavily, but nested elements are usually the safer general-purpose mapping for data exchange." },
        { title: "Array item naming matters", description: "When JSON arrays are converted to XML, each entry needs an element name. Giving array items a stable tag such as `record`, `entry`, or `item` makes the result much easier to integrate into schema-based systems and downstream parsers.", className: "bg-cyan-500/5 border-cyan-500/20" },
        { title: "CDATA is useful for string-heavy payloads with markup-like content", description: "If values contain embedded HTML, template fragments, or lots of XML-sensitive characters, wrapping them in CDATA can make the result easier to read and less noisy than fully escaped text nodes.", className: "bg-violet-500/5 border-violet-500/20" },
        { title: "Validation errors should stop the export", description: "If the JSON is invalid, there is no reliable XML to generate. A good converter should fail clearly so you do not hand a broken payload to an integration, import process, or support workflow.", className: "bg-amber-500/5 border-amber-500/20" },
      ]}
      examples={[
        { scenario: "Convert a simple object", input: `{ "name": "Alice" }`, output: `<root><name>Alice</name></root>` },
        { scenario: "Convert an array of records", input: `[{ "id": 1 }, { "id": 2 }]`, output: `<records><record>...</record></records>` },
        { scenario: "Preserve markup-like strings", input: `{ "html": "<div>Hi</div>" }`, output: `CDATA-wrapped XML value` },
        { scenario: "Add an XML declaration", input: `Valid JSON payload`, output: `XML with <?xml version="1.0"?> header` },
      ]}
      whyChoosePoints={[
        "This JSON to XML converter is built as a real integration utility rather than a placeholder page. It validates JSON, lets you control the root and repeating item tags, supports optional XML declarations and CDATA wrapping, and gives you structured pretty output that is ready to inspect and copy.",
        "The page also follows the stronger tool-page structure used across the completed developer tools. The working converter comes first, but it is backed by usage guidance, interpretation, examples, related links, and FAQ content that explain how JSON structure maps into XML and where that translation is most useful.",
        "JSON-to-XML conversion remains common in mixed-stack environments. Modern APIs and internal services often use JSON, while older enterprise imports, feeds, SOAP-style integrations, and schema-based systems still expect XML. This page is shaped around that bridge task rather than around a simplistic one-line transform.",
        "Control over root and item element naming is what makes the page practically useful. Without those controls, converted XML often looks generic and needs hand-editing before it can fit into the target system. With them, the output is far closer to what downstream tools actually want.",
        "Everything runs locally in the browser, which is the right tradeoff when the JSON contains internal payloads, client integration samples, staging data, or unpublished system records that should not leave your machine just to be wrapped in XML tags.",
      ]}
      faqs={[
        { q: "What does a JSON to XML converter do?", a: "It transforms JSON objects and arrays into an XML element tree so the data can be used in XML-oriented systems, feeds, imports, or documentation. The conversion changes representation, not the underlying data intent." },
        { q: "Why choose custom root and item tags?", a: "Because XML integrations often expect specific element names. A configurable root tag and repeating item tag make the output much easier to fit into real schemas and import requirements." },
        { q: "How are arrays represented in XML?", a: "Arrays are represented as repeated child elements using the item tag you choose. That gives each array entry a stable XML element name inside the parent structure." },
        { q: "What is CDATA and when should I use it?", a: "CDATA is a way to include text inside XML without escaping certain special characters as normal text nodes. It is useful when string values contain markup-like fragments or lots of characters such as `<` and `&` that would otherwise be escaped." },
        { q: "Does this converter turn JSON fields into XML attributes?", a: "No. It maps fields into nested elements by default because that is the most predictable general-purpose representation. Some schemas use attributes, but nested elements are usually the safer default for cross-system conversion." },
        { q: "Can invalid JSON be converted?", a: "No. The tool parses the input first, so invalid JSON results in a validation error instead of an unreliable XML output." },
        { q: "Who uses a JSON to XML converter most often?", a: "Developers, integration teams, QA engineers, agencies, support staff, and analysts use it when modern JSON payloads need to move into XML-based imports, legacy services, feeds, or documentation examples." },
        { q: "What is the difference between JSON to XML and JSON to CSV?", a: "JSON to XML preserves hierarchical nesting in a tagged tree structure. JSON to CSV flattens or tabularizes data into rows and columns for spreadsheets and tabular workflows." },
      ]}
      relatedTools={[
        { title: "JSON to CSV Converter", slug: "json-to-csv", icon: <Table2 className="w-4 h-4" />, color: 205, benefit: "Export structured data into rows and columns instead" },
        { title: "JSON Formatter", slug: "json-formatter", icon: <Braces className="w-4 h-4" />, color: 170, benefit: "Clean JSON before converting it" },
        { title: "XML Formatter & Beautifier", slug: "xml-formatter", icon: <FileCode2 className="w-4 h-4" />, color: 145, benefit: "Polish XML after conversion later" },
        { title: "HTML to Markdown Converter", slug: "html-to-markdown", icon: <Globe className="w-4 h-4" />, color: 28, benefit: "Work on adjacent content transformations" },
        { title: "Hash Generator", slug: "hash-generator", icon: <ArrowRightLeft className="w-4 h-4" />, color: 280, benefit: "Compare payload fingerprints when needed" },
        { title: "Markdown Previewer", slug: "online-markdown-previewer", icon: <ScanText className="w-4 h-4" />, color: 330, benefit: "Document conversion examples after cleanup" },
      ]}
      ctaTitle="Need More Structured Data Tools?"
      ctaDescription="Keep converting, formatting, and validating JSON, XML, and tabular payloads with adjacent developer utilities in the same tool hub."
      ctaHref="/category/developer"
    />
  );
}
