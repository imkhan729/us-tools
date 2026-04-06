import { useMemo, useState } from "react";
import { ArrowRightLeft, Braces, FileCode2, Globe, RefreshCw, ScanText, Table2, Wand2 } from "lucide-react";
import UtilityToolPageShell from "./UtilityToolPageShell";

type Delimiter = "," | ";" | "\t";

function flattenValue(value: unknown, flattenNested: boolean, prefix = "", result: Record<string, string> = {}) {
  if (value === null || value === undefined) {
    result[prefix || "value"] = "";
    return result;
  }

  if (!flattenNested || typeof value !== "object" || value instanceof Date) {
    result[prefix || "value"] = typeof value === "string" ? value : JSON.stringify(value);
    return result;
  }

  if (Array.isArray(value)) {
    if (value.every((item) => item === null || ["string", "number", "boolean"].includes(typeof item))) {
      result[prefix || "value"] = value.map((item) => item ?? "").join(" | ");
      return result;
    }
    result[prefix || "value"] = JSON.stringify(value);
    return result;
  }

  const entries = Object.entries(value as Record<string, unknown>);
  if (entries.length === 0) {
    result[prefix || "value"] = "";
    return result;
  }

  entries.forEach(([key, nested]) => {
    const nextPrefix = prefix ? `${prefix}.${key}` : key;
    flattenValue(nested, flattenNested, nextPrefix, result);
  });
  return result;
}

function normalizeRows(parsed: unknown, flattenNested: boolean): Array<Record<string, string>> {
  if (Array.isArray(parsed)) {
    if (parsed.length === 0) return [];
    if (parsed.every((item) => item && typeof item === "object" && !Array.isArray(item))) {
      return parsed.map((item) => flattenValue(item, flattenNested));
    }
    if (parsed.every((item) => Array.isArray(item))) {
      return parsed.map((item) =>
        Object.fromEntries(item.map((cell, index) => [`column_${index + 1}`, typeof cell === "string" ? cell : JSON.stringify(cell)])),
      );
    }
    return parsed.map((item) => ({ value: typeof item === "string" ? item : JSON.stringify(item) }));
  }

  if (parsed && typeof parsed === "object") {
    return [flattenValue(parsed, flattenNested)];
  }

  return [{ value: typeof parsed === "string" ? parsed : JSON.stringify(parsed) }];
}

function escapeCsvValue(value: string, delimiter: Delimiter) {
  if (value.includes('"')) value = value.replace(/"/g, '""');
  if (value.includes("\n") || value.includes("\r") || value.includes('"') || value.includes(delimiter)) {
    return `"${value}"`;
  }
  return value;
}

function convertJsonToCsv(input: string, delimiter: Delimiter, includeHeaders: boolean, flattenNested: boolean) {
  const parsed = JSON.parse(input);
  const rows = normalizeRows(parsed, flattenNested);
  if (rows.length === 0) {
    return { csv: "", rowCount: 0, columnCount: 0 };
  }

  const columns: string[] = [];
  rows.forEach((row) => {
    Object.keys(row).forEach((key) => {
      if (!columns.includes(key)) columns.push(key);
    });
  });

  const lines: string[] = [];
  if (includeHeaders) {
    lines.push(columns.map((column) => escapeCsvValue(column, delimiter)).join(delimiter));
  }

  rows.forEach((row) => {
    lines.push(columns.map((column) => escapeCsvValue(row[column] ?? "", delimiter)).join(delimiter));
  });

  return {
    csv: lines.join("\n"),
    rowCount: rows.length,
    columnCount: columns.length,
  };
}

export default function JsonToCsvConverter() {
  const [input, setInput] = useState(`[
  {
    "id": 1,
    "title": "Formatter",
    "category": "developer",
    "live": true
  },
  {
    "id": 2,
    "title": "Minifier",
    "category": "developer",
    "live": false
  }
]`);
  const [delimiter, setDelimiter] = useState<Delimiter>(",");
  const [includeHeaders, setIncludeHeaders] = useState(true);
  const [flattenNested, setFlattenNested] = useState(true);
  const [copiedLabel, setCopiedLabel] = useState("");

  const result = useMemo(() => {
    try {
      return { ...convertJsonToCsv(input, delimiter, includeHeaders, flattenNested), error: "" };
    } catch (error) {
      return {
        csv: "",
        rowCount: 0,
        columnCount: 0,
        error: error instanceof Error ? error.message : "Invalid JSON input.",
      };
    }
  }, [delimiter, flattenNested, includeHeaders, input]);

  const previewLines = result.csv ? result.csv.split(/\r?\n/).slice(0, 6).join("\n") : "";

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
    "tags": ["frontend", "launch"],
    "active": true
  },
  {
    "id": 2,
    "profile": {
      "name": "Bob Chen",
      "department": "Operations"
    },
    "tags": ["support"],
    "active": false
  }
]`);
    setDelimiter(",");
    setIncludeHeaders(true);
    setFlattenNested(true);
  };

  const clearAll = () => setInput("");

  return (
    <UtilityToolPageShell
      title="Online JSON to CSV Converter"
      seoTitle="Online JSON to CSV Converter - Convert JSON Arrays to CSV Online"
      seoDescription="Free JSON to CSV converter with header control, nested-object flattening, delimiter options, live preview, and spreadsheet-ready output."
      canonical="https://usonlinetools.com/developer/online-json-to-csv"
      categoryName="Developer Tools"
      categoryHref="/category/developer"
      heroDescription="Convert JSON arrays and objects into spreadsheet-ready CSV directly in the browser. This free JSON to CSV converter helps developers, analysts, QA teams, and content operations turn API payloads, config exports, fixtures, and structured records into a tabular format that is easier to import into spreadsheets, BI tools, and CSV-driven workflows."
      heroIcon={<ArrowRightLeft className="w-3.5 h-3.5" />}
      calculatorLabel="JSON to CSV Converter"
      calculatorDescription="Paste JSON, choose delimiter and header options, flatten nested records when needed, and copy CSV output instantly."
      calculator={
        <div className="space-y-5">
          <div className="grid grid-cols-1 xl:grid-cols-[300px_1fr] gap-5">
            <div className="space-y-4 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
              <div>
                <label htmlFor="csv-delimiter" className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Delimiter</label>
                <select id="csv-delimiter" value={delimiter} onChange={(event) => setDelimiter(event.target.value as Delimiter)} className="tool-calc-input w-full">
                  <option value=",">Comma</option>
                  <option value=";">Semicolon</option>
                  <option value={"	"}>Tab</option>
                </select>
              </div>

              <label className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-sm text-foreground">
                <input type="checkbox" checked={includeHeaders} onChange={(event) => setIncludeHeaders(event.target.checked)} className="h-4 w-4 rounded border-border" />
                Include header row
              </label>

              <label className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-sm text-foreground">
                <input type="checkbox" checked={flattenNested} onChange={(event) => setFlattenNested(event.target.checked)} className="h-4 w-4 rounded border-border" />
                Flatten nested objects
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
                    <span className="text-sm text-muted-foreground">Rows</span>
                    <span className="text-sm font-bold text-foreground">{result.rowCount}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2.5">
                    <span className="text-sm text-muted-foreground">Columns</span>
                    <span className="text-sm font-bold text-foreground">{result.columnCount}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2.5">
                    <span className="text-sm text-muted-foreground">CSV size</span>
                    <span className="text-sm font-bold text-foreground">{result.csv.length} chars</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-blue-500/20 bg-card p-4">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Converter Note</p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  CSV works best with flat tabular data. When nested records appear, flattening turns paths such as `profile.name` into spreadsheet-friendly columns, which is usually the most practical export shape for analysts and operations teams.
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
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">CSV Output</p>
                    <button onClick={() => copyValue("output", result.csv)} className="text-xs font-bold text-blue-600 hover:text-blue-700" disabled={!result.csv}>
                      {copiedLabel === "output" ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <textarea
                    readOnly
                    value={result.csv}
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
                      { label: "CSV Output", value: result.csv },
                      { label: "TSV Variant", value: result.csv && delimiter !== "\t" ? result.csv.replaceAll(delimiter, "\t") : result.csv },
                      { label: "Download Helper", value: `const csv = ${JSON.stringify(result.csv)};` },
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
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3">CSV Preview</p>
                    <pre className="overflow-x-auto rounded-xl bg-slate-950 p-4 text-xs leading-relaxed text-slate-100">
                      <code>{previewLines || "No output yet."}</code>
                    </pre>
                  </div>

                  <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Workflow Context</p>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      JSON-to-CSV conversion is most useful when API data, fixtures, or config records need to move into spreadsheets, audits, imports, or analyst workflows where rows and columns are easier to inspect than nested JSON objects.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      howSteps={[
        { title: "Paste the JSON array or object you want to export", description: "This tool works best with arrays of objects, which map naturally to CSV rows. It also supports a single object, arrays of arrays, and arrays of primitives so you can still get a useful export even when the source is not shaped perfectly like a spreadsheet dataset." },
        { title: "Choose your delimiter and whether headers should be included", description: "Comma-separated output is the default for most spreadsheet tools, but semicolon and tab-separated output are also useful in regional workflows and import systems. Header rows should usually stay enabled because they make the CSV far easier to understand once it is opened in Excel, Sheets, or a BI tool." },
        { title: "Flatten nested objects when the source data is deeper than one level", description: "CSV is inherently flat, so nested JSON needs a strategy. Flattening creates column names like `profile.department` instead of leaving nested objects embedded as opaque blobs. That is often the right export shape for analytics, operations, and spreadsheet review because it keeps the structure readable across columns." },
        { title: "Review the CSV and copy the final output", description: "The side-by-side layout and preview panel let you confirm the export shape before you paste it into a spreadsheet or import pipeline. That matters because field order, delimiter choice, and flattened keys can affect how downstream tools interpret the data." },
      ]}
      interpretationCards={[
        { title: "CSV is optimized for tabular workflows, not nested structure", description: "If the source JSON is deeply nested, some meaning will either be flattened into dotted columns or serialized into string cells. That is normal because CSV is designed for rows and columns rather than object trees." },
        { title: "Flattening is usually the most spreadsheet-friendly choice", description: "When nested objects become keys such as `profile.name` or `meta.status`, the result is easier to filter, sort, and audit in a spreadsheet than a raw JSON string stored inside one cell.", className: "bg-cyan-500/5 border-cyan-500/20" },
        { title: "Headers are usually worth keeping", description: "A header row gives structure to the export and makes the CSV immediately usable in spreadsheet and import workflows. Disabling headers can still be useful when the target system expects raw row data only.", className: "bg-violet-500/5 border-violet-500/20" },
        { title: "Validation errors matter before export", description: "If the JSON is invalid, there is no reliable CSV to generate. A good converter should fail clearly so you do not copy a broken export into a spreadsheet, import pipeline, or documentation example.", className: "bg-amber-500/5 border-amber-500/20" },
      ]}
      examples={[
        { scenario: "Convert an array of records", input: "[{ id: 1, name: 'A' }]", output: "CSV rows with headers" },
        { scenario: "Flatten nested profile data", input: "{ profile: { name: 'Alice' } }", output: "Columns like profile.name" },
        { scenario: "Export primitive arrays", input: "[1,2,3]", output: "Single value column" },
        { scenario: "Create tab-separated output", input: "Valid JSON array", output: "Spreadsheet-friendly TSV rows" },
      ]}
      whyChoosePoints={[
        "This JSON to CSV converter is built as a practical export tool rather than a placeholder page. It validates JSON, handles arrays and objects, supports delimiter choice, can flatten nested fields, and produces spreadsheet-ready CSV that is usable immediately in common operational workflows.",
        "The page also follows the stronger structure used across the implemented developer tools. The working converter comes first, but it is backed by interpretation guidance, examples, internal links, and FAQ content that explain how JSON records map into tabular exports and where flattening helps most.",
        "JSON-to-CSV conversion is a common bridge task between developer and analyst workflows. APIs, fixtures, logs, and config records often start in JSON but need to move into spreadsheets, BI tools, reviews, or import systems that are much easier to operate with rows and columns.",
        "Flattening support matters because many real payloads are not perfectly flat. A converter that only handles simple one-level objects becomes much less useful the moment profile data, metadata, tags, or nested configuration shows up. This page handles that transition more pragmatically.",
        "Everything runs in the browser, which is the right tradeoff when the JSON contains internal records, staging exports, support payloads, or client-side fixture data that should not leave your machine just to become a CSV file.",
      ]}
      faqs={[
        { q: "What kind of JSON works best for CSV conversion?", a: "Arrays of objects work best because each object becomes a row and each key becomes a column. The tool also supports single objects, arrays of arrays, and arrays of primitive values, but tabular datasets are the most natural fit." },
        { q: "Why flatten nested objects?", a: "Because CSV is flat. Flattening converts nested properties into dotted column names such as `profile.name`, which is usually easier to work with in spreadsheets and imports than storing the nested object as raw JSON inside one cell." },
        { q: "Can this create TSV instead of CSV?", a: "Yes. You can switch the delimiter to a tab character and generate tab-separated output, which is useful for spreadsheet imports and workflows that prefer TSV." },
        { q: "What happens to arrays in the JSON?", a: "Primitive arrays are joined into a readable cell string, while more complex arrays are serialized as JSON strings inside the cell. That keeps the export usable without pretending CSV can fully represent nested array structures." },
        { q: "Should I include headers?", a: "Usually yes. Headers make the export easier to understand and far more usable in spreadsheets and BI tools. Turn them off only if the target system specifically expects row data without a header line." },
        { q: "Why did the converter fail?", a: "The most common reason is invalid JSON syntax. Because the converter parses the payload before exporting, malformed input will raise a validation error instead of producing a misleading CSV result." },
        { q: "Who uses a JSON to CSV converter most often?", a: "Developers, analysts, QA teams, operations staff, agencies, and support engineers use it when API payloads, fixtures, or structured records need to move into spreadsheets or other tabular workflows." },
        { q: "What is the difference between JSON to CSV and CSV to JSON?", a: "JSON to CSV converts structured object data into rows and columns for spreadsheets or imports. CSV to JSON does the reverse and turns flat delimited rows into structured arrays or objects that are easier to use in APIs and applications." },
      ]}
      relatedTools={[
        { title: "CSV to JSON Converter", slug: "csv-to-json-converter", icon: <Table2 className="w-4 h-4" />, color: 205, benefit: "Convert tabular data back into structured JSON" },
        { title: "JSON Formatter", slug: "json-formatter", icon: <Braces className="w-4 h-4" />, color: 170, benefit: "Clean JSON before exporting it" },
        { title: "JSON Minifier", slug: "json-minifier", icon: <FileCode2 className="w-4 h-4" />, color: 145, benefit: "Switch to compact payload workflows" },
        { title: "JavaScript Formatter", slug: "javascript-formatter", icon: <Globe className="w-4 h-4" />, color: 28, benefit: "Format related code around data exports" },
        { title: "Markdown Previewer", slug: "online-markdown-previewer", icon: <ScanText className="w-4 h-4" />, color: 280, benefit: "Document export examples after conversion" },
        { title: "Hash Generator", slug: "hash-generator", icon: <ArrowRightLeft className="w-4 h-4" />, color: 330, benefit: "Compare payload fingerprints when needed" },
      ]}
      ctaTitle="Need More Data Conversion Tools?"
      ctaDescription="Keep converting, formatting, minifying, and validating structured data with adjacent developer utilities in the same tool hub."
      ctaHref="/category/developer"
    />
  );
}
