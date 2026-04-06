import { useMemo, useState } from "react";
import { ArrowRightLeft, Braces, Copy, FileCode2, RefreshCw, ScanText, Wand2 } from "lucide-react";
import UtilityToolPageShell from "./UtilityToolPageShell";

type Mode = "yaml-to-json" | "json-to-yaml";

function parseScalar(value: string): unknown {
  const trimmed = value.trim();
  if (trimmed === "null" || trimmed === "~") return null;
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1);
  }
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) return Number(trimmed);
  return trimmed;
}

function parseYaml(input: string): unknown {
  const lines = input.replace(/\r/g, "").split("\n");
  let index = 0;

  function parseBlock(indent: number): unknown {
    const items: Array<{ key?: string; value: unknown; isArray: boolean }> = [];

    while (index < lines.length) {
      const rawLine = lines[index];
      if (!rawLine.trim() || rawLine.trim().startsWith("#")) {
        index += 1;
        continue;
      }

      const currentIndent = rawLine.match(/^ */)?.[0].length ?? 0;
      if (currentIndent < indent) break;
      if (currentIndent > indent) throw new Error(`Unexpected indentation near line ${index + 1}.`);

      const line = rawLine.trim();

      if (line.startsWith("- ")) {
        const rest = line.slice(2).trim();
        index += 1;
        if (!rest) {
          items.push({ value: parseBlock(indent + 2), isArray: true });
          continue;
        }

        const keyMatch = rest.match(/^([^:]+):\s*(.*)$/);
        if (keyMatch) {
          const objectValue: Record<string, unknown> = {};
          objectValue[keyMatch[1].trim()] = keyMatch[2] ? parseScalar(keyMatch[2]) : parseBlock(indent + 2);
          items.push({ value: objectValue, isArray: true });
          continue;
        }

        items.push({ value: parseScalar(rest), isArray: true });
        continue;
      }

      const keyMatch = line.match(/^([^:]+):\s*(.*)$/);
      if (!keyMatch) throw new Error(`Invalid YAML mapping near line ${index + 1}.`);

      const key = keyMatch[1].trim();
      const remainder = keyMatch[2];
      index += 1;
      items.push({
        key,
        value: remainder ? parseScalar(remainder) : parseBlock(indent + 2),
        isArray: false,
      });
    }

    if (!items.length) return {};
    if (items.every((item) => item.isArray)) return items.map((item) => item.value);

    const record: Record<string, unknown> = {};
    items.forEach((item) => {
      if (item.key) record[item.key] = item.value;
    });
    return record;
  }

  return parseBlock(0);
}

function toYaml(value: unknown, indent = 0): string {
  const pad = " ".repeat(indent);

  if (Array.isArray(value)) {
    if (!value.length) return `${pad}[]`;
    return value
      .map((item) => {
        if (item && typeof item === "object") {
          return `${pad}-\n${toYaml(item, indent + 2)}`;
        }
        return `${pad}- ${String(item)}`;
      })
      .join("\n");
  }

  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);
    if (!entries.length) return `${pad}{}`;
    return entries
      .map(([key, entryValue]) => {
        if (entryValue && typeof entryValue === "object") {
          return `${pad}${key}:\n${toYaml(entryValue, indent + 2)}`;
        }
        return `${pad}${key}: ${entryValue === null ? "null" : String(entryValue)}`;
      })
      .join("\n");
  }

  return `${pad}${value === null ? "null" : String(value)}`;
}

const YAML_SAMPLE = `app:
  name: Utility Hub
  live: true
  ports:
    - 3000
    - 3001
  owner:
    name: Ava
    team: platform`;

const JSON_SAMPLE = `{
  "app": {
    "name": "Utility Hub",
    "live": true,
    "ports": [3000, 3001],
    "owner": {
      "name": "Ava",
      "team": "platform"
    }
  }
}`;

export default function YamlToJsonConverter() {
  const [mode, setMode] = useState<Mode>("yaml-to-json");
  const [input, setInput] = useState(YAML_SAMPLE);
  const [copiedLabel, setCopiedLabel] = useState("");

  const result = useMemo(() => {
    try {
      if (mode === "yaml-to-json") {
        const parsed = parseYaml(input);
        return { output: JSON.stringify(parsed, null, 2), error: "" };
      }

      const parsed = JSON.parse(input);
      return { output: toYaml(parsed), error: "" };
    } catch (error) {
      return {
        output: "",
        error: error instanceof Error ? error.message : "Conversion failed.",
      };
    }
  }, [input, mode]);

  const copyValue = async (label: string, value: string) => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopiedLabel(label);
    window.setTimeout(() => setCopiedLabel(""), 1800);
  };

  const loadSample = () => {
    setMode("yaml-to-json");
    setInput(YAML_SAMPLE);
  };

  const switchMode = (nextMode: Mode) => {
    setMode(nextMode);
    setInput(nextMode === "yaml-to-json" ? YAML_SAMPLE : JSON_SAMPLE);
  };

  const clearAll = () => setInput("");

  return (
    <UtilityToolPageShell
      title="YAML to JSON Converter"
      seoTitle="YAML to JSON Converter - Convert YAML and JSON Online"
      seoDescription="Free YAML to JSON converter with reverse JSON to YAML mode, live structured output, and copy-ready snippets for config workflows."
      canonical="https://usonlinetools.com/developer/yaml-to-json"
      categoryName="Developer Tools"
      categoryHref="/category/developer"
      heroDescription="Convert YAML to JSON and JSON back to YAML directly in the browser for config work, infrastructure notes, docs, payload samples, and environment handoffs. This converter is built for real developer workflows where structured data needs to move between formats without leaving the page."
      heroIcon={<ArrowRightLeft className="w-3.5 h-3.5" />}
      calculatorLabel="YAML and JSON Conversion Workspace"
      calculatorDescription="Switch between YAML-to-JSON and JSON-to-YAML, paste structured data, and copy the converted output instantly."
      calculator={
        <div className="space-y-5">
          <div className="grid grid-cols-1 xl:grid-cols-[300px_1fr] gap-5">
            <div className="space-y-4 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
              <div>
                <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Mode</label>
                <select value={mode} onChange={(event) => switchMode(event.target.value as Mode)} className="tool-calc-input w-full">
                  <option value="yaml-to-json">YAML to JSON</option>
                  <option value="json-to-yaml">JSON to YAML</option>
                </select>
              </div>

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
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3">Conversion Snapshot</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2.5"><span className="text-sm text-muted-foreground">Mode</span><span className="text-sm font-bold text-foreground">{mode === "yaml-to-json" ? "YAML -> JSON" : "JSON -> YAML"}</span></div>
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2.5"><span className="text-sm text-muted-foreground">Input size</span><span className="text-sm font-bold text-foreground">{input.length}</span></div>
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2.5"><span className="text-sm text-muted-foreground">Output size</span><span className="text-sm font-bold text-foreground">{result.output.length}</span></div>
                </div>
              </div>

              <div className="rounded-2xl border border-blue-500/20 bg-card p-4">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Converter Note</p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  YAML is popular for human-edited config files and JSON is common for APIs and machine-oriented payloads. This page keeps both directions together because teams often move the same data back and forth between those contexts.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">{mode === "yaml-to-json" ? "YAML Input" : "JSON Input"}</p>
                    <p className="text-xs text-muted-foreground">{input.length} characters</p>
                  </div>
                  <textarea value={input} onChange={(event) => setInput(event.target.value)} spellCheck={false} className="min-h-[340px] w-full rounded-2xl border border-border bg-background p-4 font-mono text-sm leading-relaxed text-foreground outline-none resize-none" />
                </div>

                <div className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">{mode === "yaml-to-json" ? "JSON Output" : "YAML Output"}</p>
                    <button onClick={() => copyValue("output", result.output)} className="text-xs font-bold text-blue-600 hover:text-blue-700" disabled={!result.output}>
                      {copiedLabel === "output" ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <textarea readOnly value={result.output || result.error} spellCheck={false} className="min-h-[340px] w-full rounded-2xl border border-border bg-slate-950 p-4 font-mono text-sm leading-relaxed text-slate-100 outline-none resize-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[1.08fr_0.92fr] gap-4">
                <div className="rounded-2xl border border-border bg-card p-5">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-4">Copy-Ready Snippets</p>
                  <div className="space-y-3">
                    {[
                      { label: "Converted output", value: result.output },
                      { label: "JS string", value: `const data = ${JSON.stringify(result.output)};` },
                      { label: "Config note", value: `${mode === "yaml-to-json" ? "# Converted to JSON" : "# Converted to YAML"}\n${result.output}` },
                    ].map((item) => (
                      <div key={item.label} className="rounded-xl border border-border bg-muted/40 p-3">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">{item.label}</p>
                          <button onClick={() => copyValue(item.label, item.value)} className="text-xs font-bold text-blue-600 hover:text-blue-700" disabled={!item.value}>
                            {copiedLabel === item.label ? "Copied" : "Copy"}
                          </button>
                        </div>
                        <pre className="mt-2 overflow-x-auto rounded-xl bg-slate-950 p-3 text-xs leading-relaxed text-slate-100"><code>{item.value || "Available after conversion."}</code></pre>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-2xl border border-border bg-card p-5">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3">Best Uses</p>
                    <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
                      <p className="rounded-xl border border-border bg-muted/40 px-3 py-2.5">Move config data into API-friendly JSON.</p>
                      <p className="rounded-xl border border-border bg-muted/40 px-3 py-2.5">Turn JSON examples into human-edited YAML.</p>
                      <p className="rounded-xl border border-border bg-muted/40 px-3 py-2.5">Prepare docs and environment notes.</p>
                      <p className="rounded-xl border border-border bg-muted/40 px-3 py-2.5">Normalize simple structured records quickly.</p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Practical Tip</p>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      YAML is easier for people to edit by hand, but JSON is easier for many systems to parse and compare strictly. Switching between them is most useful when the same data has to live in both human-edited and machine-focused workflows.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      howSteps={[
        { title: "Choose the direction that matches the next workflow", description: "If the destination is a machine-oriented payload, API sample, or strict validator, YAML-to-JSON is often the right move. If the destination is a config file, docs example, or human-edited environment note, JSON-to-YAML may be the better direction. Picking the next destination first keeps the conversion purposeful instead of arbitrary." },
        { title: "Paste the structured input exactly as you have it", description: "This tool is most useful when you work with the actual config or payload shape you need to convert, not a simplified example. Using the real structure helps you see immediately whether nesting, arrays, booleans, and null values survive in a way that still fits the downstream workflow." },
        { title: "Review the converted output before you reuse it", description: "Structured data conversion is only useful if the resulting representation still matches the meaning of the source. Reading the converted output before copying it helps you confirm that nested sections, arrays, scalar values, and top-level shape still look right in the new format." },
        { title: "Copy the result into code, docs, or config workflows", description: "Once the conversion looks correct, the next step is usually immediate: paste it into a config file, API example, integration note, or support document. That is why the page provides direct copy actions and snippet-friendly output rather than stopping at a visual preview." },
      ]}
      interpretationCards={[
        { title: "YAML is often better for humans, JSON is often better for systems", description: "YAML is widely used where people edit config directly because it is visually lightweight. JSON is common where systems need stricter parsing or where payloads are exchanged programmatically. Converting between them is therefore a practical bridge task." },
        { title: "Indentation matters a lot more in YAML than in JSON", description: "JSON uses explicit braces and brackets, while YAML relies heavily on indentation to communicate structure. That makes YAML easy to read when it is correct, but it also means indentation mistakes can change the meaning of the document quickly.", className: "bg-cyan-500/5 border-cyan-500/20" },
        { title: "JSON is stricter and more explicit", description: "That strictness is one reason JSON is useful for APIs and validation-heavy workflows. When data needs to be unambiguous for machines, converting YAML into JSON can reduce ambiguity and make later validation easier.", className: "bg-violet-500/5 border-violet-500/20" },
        { title: "Conversion is most valuable when the same data crosses different teams", description: "Infrastructure, application, support, and documentation workflows often prefer different representations of the same structured data. A converter helps avoid manual rewrites and reduces the risk of mismatched copies.", className: "bg-amber-500/5 border-amber-500/20" },
      ]}
      examples={[
        { scenario: "Convert app config into API-friendly JSON", input: "YAML config block", output: "Readable pretty JSON object" },
        { scenario: "Turn a JSON payload into editable YAML", input: "Nested JSON object", output: "Indented YAML structure" },
        { scenario: "Keep booleans and null values clear", input: "true / false / null fields", output: "Equivalent structured values in the other format" },
        { scenario: "Convert an array of ports", input: "ports list", output: "Array preserved in the target format" },
      ]}
      whyChoosePoints={[
        "This YAML to JSON converter is built as a real structured-data bridge rather than a placeholder. It supports YAML-to-JSON and JSON-to-YAML in one page, preserves nested mappings and arrays, and gives you immediate copy-ready output for config, docs, and payload workflows.",
        "The page is designed around practical handoff problems. Teams often author config in YAML because it is friendly to edit, then need JSON for APIs, tooling, or downstream systems. In other cases the direction goes the other way because JSON needs to become something humans can maintain more comfortably in a config file or support note.",
        "Keeping both directions on the same page reduces friction because conversion work rarely stays one-way forever. The same data may need to move into JSON for machine handling and then back into YAML for documentation or configuration. Treating those as adjacent operations makes the tool more useful day to day.",
        "This implementation focuses on simple, practical structured data rather than pretending to cover every advanced dialect feature. For many real workflow cases, that is the right tradeoff because the goal is to move common mappings, arrays, booleans, nulls, and strings between formats quickly and locally.",
        "Everything runs locally in the browser, which is the right default when the data includes internal configuration, client integration samples, staging payloads, or unpublished environment structures that should stay on your machine during conversion.",
      ]}
      faqs={[
        { q: "What does a YAML to JSON converter do?", a: "It transforms structured YAML into equivalent JSON so the data can be used in JSON-based systems, API examples, scripts, or validation workflows. This page also supports the reverse direction for practical handoffs." },
        { q: "Why convert YAML to JSON?", a: "Because JSON is widely used in APIs, payloads, schemas, and machine-oriented tooling. Converting YAML into JSON can make validation and programmatic handling easier when the data started in a human-edited config format." },
        { q: "Why convert JSON back to YAML?", a: "Because YAML is often easier for people to scan and edit directly in config and documentation workflows. When humans need to maintain the data, YAML can be more comfortable than raw JSON." },
        { q: "Is YAML more sensitive to indentation than JSON?", a: "Yes. YAML relies heavily on indentation to communicate structure, while JSON uses explicit braces and brackets. That is one reason YAML can be pleasant to read but also easier to break with small spacing mistakes." },
        { q: "Does this handle arrays and nested objects?", a: "Yes. The converter is designed for practical structured records with nested mappings and arrays, which covers a large share of config and payload examples used in day-to-day work." },
        { q: "Can invalid input still be converted?", a: "No. If the source cannot be parsed reliably, the page shows an error instead of producing a misleading output." },
        { q: "Who uses a YAML and JSON converter most often?", a: "Developers, DevOps teams, QA engineers, support staff, agencies, and technical writers all use it when the same structured data needs to appear in both machine-friendly and human-edited formats." },
        { q: "Does the data leave the browser?", a: "No. The conversion happens locally in the browser, which is useful for internal config and staging data that should stay on your machine during the conversion step." },
      ]}
      relatedTools={[
        { title: "JSON Formatter", slug: "json-formatter", icon: <Braces className="w-4 h-4" />, color: 150, benefit: "Clean JSON before or after conversion" },
        { title: "JSON Validator", slug: "json-validator", icon: <ScanText className="w-4 h-4" />, color: 210, benefit: "Validate converted JSON output" },
        { title: "JSON to XML Converter", slug: "json-to-xml", icon: <ArrowRightLeft className="w-4 h-4" />, color: 265, benefit: "Move into another structured format later" },
        { title: "Text Diff Checker", slug: "diff-checker", icon: <Copy className="w-4 h-4" />, color: 28, benefit: "Compare config revisions after conversion" },
        { title: "XML Formatter & Beautifier", slug: "xml-formatter", icon: <FileCode2 className="w-4 h-4" />, color: 330, benefit: "Keep adjacent structured markup readable" },
        { title: "SQL Formatter", slug: "sql-formatter", icon: <Wand2 className="w-4 h-4" />, color: 185, benefit: "Format other developer-facing text nearby" },
      ]}
      ctaTitle="Need More Structured Config Tools?"
      ctaDescription="Keep converting, validating, and formatting JSON, YAML, XML, and adjacent developer data with tools in the same hub."
      ctaHref="/category/developer"
    />
  );
}
