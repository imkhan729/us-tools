import { useMemo, useState } from "react";
import { AlertTriangle, Braces, CheckCircle2, Copy, FileJson, GitBranch, RefreshCw, Search, Wand2 } from "lucide-react";
import UtilityToolPageShell from "./UtilityToolPageShell";

type MatchNode = {
  path: string;
  value: unknown;
};

type Segment =
  | { type: "property"; key: string }
  | { type: "properties"; keys: string[] }
  | { type: "index"; index: number }
  | { type: "indices"; indices: number[] }
  | { type: "wildcard" }
  | { type: "recursiveProperty"; key: string }
  | { type: "recursiveWildcard" };

function getRootType(value: unknown) {
  if (Array.isArray(value)) return "array";
  if (value === null) return "null";
  return typeof value;
}

function appendPropertyPath(basePath: string, key: string) {
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(key) ? `${basePath}.${key}` : `${basePath}[${JSON.stringify(key)}]`;
}

function appendIndexPath(basePath: string, index: number) {
  return `${basePath}[${index}]`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readIdentifier(path: string, start: number) {
  const match = path.slice(start).match(/^[A-Za-z_$][A-Za-z0-9_$]*/);
  if (!match) return null;
  return { value: match[0], next: start + match[0].length };
}

function findClosingBracket(path: string, start: number) {
  let quote = "";

  for (let index = start + 1; index < path.length; index += 1) {
    const char = path[index];
    const previous = path[index - 1];

    if (quote) {
      if (char === quote && previous !== "\\") quote = "";
      continue;
    }

    if (char === "'" || char === '"') {
      quote = char;
      continue;
    }

    if (char === "]") return index;
  }

  return -1;
}

function parseBracketTokens(content: string) {
  const values: Array<string | number> = [];
  let index = 0;

  while (index < content.length) {
    while (index < content.length && /[\s,]/.test(content[index])) index += 1;
    if (index >= content.length) break;

    const char = content[index];
    if (char === "'" || char === '"') {
      const quote = char;
      index += 1;
      let value = "";

      while (index < content.length) {
        const current = content[index];
        if (current === quote && content[index - 1] !== "\\") {
          index += 1;
          values.push(value);
          break;
        }

        if (current === "\\" && index + 1 < content.length) {
          value += content[index + 1];
          index += 2;
          continue;
        }

        value += current;
        index += 1;
      }

      continue;
    }

    const numberMatch = content.slice(index).match(/^-?\d+/);
    if (numberMatch) {
      values.push(Number(numberMatch[0]));
      index += numberMatch[0].length;
      continue;
    }

    throw new Error(`Unsupported bracket selector near "${content.slice(index)}". Use quoted keys, indexes, wildcards, or unions.`);
  }

  return values;
}

function parseBracketSelector(content: string): Segment {
  if (!content) throw new Error("Empty bracket selector is not supported.");
  if (content === "*") return { type: "wildcard" };

  const values = parseBracketTokens(content);
  if (!values.length) throw new Error("Unsupported bracket selector.");

  if (values.every((value) => typeof value === "number")) {
    return values.length === 1 ? { type: "index", index: values[0] as number } : { type: "indices", indices: values as number[] };
  }

  if (values.every((value) => typeof value === "string")) {
    return values.length === 1 ? { type: "property", key: values[0] as string } : { type: "properties", keys: values as string[] };
  }

  throw new Error("Mixed unions are not supported. Use only key unions or only index unions in one selector.");
}

function parseJsonPath(expression: string) {
  const path = expression.trim();
  if (!path) throw new Error("Enter a JSONPath expression.");
  if (!path.startsWith("$")) throw new Error('JSONPath must start with "$".');

  const segments: Segment[] = [];
  let index = 1;

  while (index < path.length) {
    const char = path[index];
    if (/\s/.test(char)) {
      index += 1;
      continue;
    }

    if (path.startsWith("..", index)) {
      index += 2;
      if (path[index] === "*") {
        segments.push({ type: "recursiveWildcard" });
        index += 1;
        continue;
      }

      const identifier = readIdentifier(path, index);
      if (!identifier) throw new Error(`Expected a property name after ".." at position ${index + 1}.`);
      segments.push({ type: "recursiveProperty", key: identifier.value });
      index = identifier.next;
      continue;
    }

    if (char === ".") {
      index += 1;
      if (path[index] === "*") {
        segments.push({ type: "wildcard" });
        index += 1;
        continue;
      }

      const identifier = readIdentifier(path, index);
      if (!identifier) throw new Error(`Expected a property name after "." at position ${index + 1}.`);
      segments.push({ type: "property", key: identifier.value });
      index = identifier.next;
      continue;
    }

    if (char === "[") {
      const end = findClosingBracket(path, index);
      if (end === -1) throw new Error('Missing closing "]" in JSONPath expression.');
      segments.push(parseBracketSelector(path.slice(index + 1, end).trim()));
      index = end + 1;
      continue;
    }

    throw new Error(`Unexpected token "${char}" at position ${index + 1}.`);
  }

  return segments;
}

function walkChildren(node: MatchNode, visitor: (child: MatchNode) => void) {
  if (Array.isArray(node.value)) {
    node.value.forEach((item, index) => {
      const child = { path: appendIndexPath(node.path, index), value: item };
      visitor(child);
      walkChildren(child, visitor);
    });
    return;
  }

  if (isRecord(node.value)) {
    Object.entries(node.value).forEach(([key, value]) => {
      const child = { path: appendPropertyPath(node.path, key), value };
      visitor(child);
      walkChildren(child, visitor);
    });
  }
}

function evaluateSegment(nodes: MatchNode[], segment: Segment) {
  const next: MatchNode[] = [];

  nodes.forEach((node) => {
    switch (segment.type) {
      case "property":
        if (isRecord(node.value) && Object.prototype.hasOwnProperty.call(node.value, segment.key)) {
          next.push({ path: appendPropertyPath(node.path, segment.key), value: node.value[segment.key] });
        }
        break;
      case "properties":
        if (isRecord(node.value)) {
          const record = node.value;
          segment.keys.forEach((key) => {
            if (Object.prototype.hasOwnProperty.call(record, key)) {
              next.push({ path: appendPropertyPath(node.path, key), value: record[key] });
            }
          });
        }
        break;
      case "index":
        if (Array.isArray(node.value) && segment.index >= 0 && segment.index < node.value.length) {
          next.push({ path: appendIndexPath(node.path, segment.index), value: node.value[segment.index] });
        }
        break;
      case "indices":
        if (Array.isArray(node.value)) {
          const list = node.value;
          segment.indices.forEach((value) => {
            if (value >= 0 && value < list.length) {
              next.push({ path: appendIndexPath(node.path, value), value: list[value] });
            }
          });
        }
        break;
      case "wildcard":
        if (Array.isArray(node.value)) {
          node.value.forEach((item, index) => next.push({ path: appendIndexPath(node.path, index), value: item }));
        } else if (isRecord(node.value)) {
          const record = node.value;
          Object.entries(record).forEach(([key, value]) => next.push({ path: appendPropertyPath(node.path, key), value }));
        }
        break;
      case "recursiveProperty":
        if (isRecord(node.value) && Object.prototype.hasOwnProperty.call(node.value, segment.key)) {
          next.push({ path: appendPropertyPath(node.path, segment.key), value: node.value[segment.key] });
        }
        walkChildren(node, (child) => {
          if (isRecord(child.value) && Object.prototype.hasOwnProperty.call(child.value, segment.key)) {
            next.push({ path: appendPropertyPath(child.path, segment.key), value: child.value[segment.key] });
          }
        });
        break;
      case "recursiveWildcard":
        walkChildren(node, (child) => next.push(child));
        break;
    }
  });

  return next;
}

function runJsonPath(root: unknown, expression: string) {
  const segments = parseJsonPath(expression);
  const matches = segments.reduce<MatchNode[]>((nodes, segment) => evaluateSegment(nodes, segment), [{ path: "$", value: root }]);
  return { segments, matches };
}

const SAMPLE_JSON = `{
  "store": {
    "book": [
      { "title": "Sayings of the Century", "author": "Nigel Rees", "price": 8.95, "tags": ["classic", "reference"] },
      { "title": "Sword of Honour", "author": "Evelyn Waugh", "price": 12.99, "tags": ["fiction", "war"] },
      { "title": "Moby Dick", "author": "Herman Melville", "price": 8.99, "isbn": "0-553-21311-3" }
    ],
    "bicycle": { "color": "red", "price": 19.95 }
  },
  "users": [
    { "id": 1, "name": "Ava", "email": "ava@example.com" },
    { "id": 2, "name": "Leo", "email": "leo@example.com" }
  ]
}`;

const QUICK_PATHS = [
  "$.store.book[*].title",
  "$..price",
  "$.users[*].email",
  "$..book[0,2].author",
  "$..tags[*]",
  "$..*",
];

export default function JsonPathTester() {
  const [input, setInput] = useState(SAMPLE_JSON);
  const [expression, setExpression] = useState("$.store.book[*].title");
  const [copiedLabel, setCopiedLabel] = useState("");

  const analysis = useMemo(() => {
    try {
      const parsed = JSON.parse(input);
      try {
        const query = runJsonPath(parsed, expression);
        return {
          jsonError: "",
          pathError: "",
          parsed,
          matches: query.matches,
          segments: query.segments.length,
        };
      } catch (error) {
        return {
          jsonError: "",
          pathError: error instanceof Error ? error.message : "Invalid JSONPath expression.",
          parsed,
          matches: [] as MatchNode[],
          segments: 0,
        };
      }
    } catch (error) {
      return {
        jsonError: error instanceof Error ? error.message : "Invalid JSON input.",
        pathError: "",
        parsed: null,
        matches: [] as MatchNode[],
        segments: 0,
      };
    }
  }, [expression, input]);

  const matchedValues = analysis.matches.length ? JSON.stringify(analysis.matches.map((item) => item.value), null, 2) : "";
  const matchedPaths = analysis.matches.map((item) => item.path).join("\n");
  const firstMatch = analysis.matches.length ? JSON.stringify(analysis.matches[0].value, null, 2) : "";
  const rootType = analysis.parsed === null ? "invalid" : getRootType(analysis.parsed);

  const copyValue = async (label: string, value: string) => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopiedLabel(label);
    window.setTimeout(() => setCopiedLabel(""), 1800);
  };

  const loadSample = () => {
    setInput(SAMPLE_JSON);
    setExpression("$.store.book[*].title");
  };

  const clearAll = () => {
    setInput("");
    setExpression("$");
  };

  return (
    <UtilityToolPageShell
      title="Online JSONPath Tester"
      seoTitle="Online JSONPath Tester - Query JSON Data Online"
      seoDescription="Free JSONPath tester with live JSON parsing, path evaluation, matched paths, matched values, and quick examples for JSON query debugging."
      canonical="https://usonlinetools.com/developer/online-json-path-tester"
      categoryName="Developer Tools"
      categoryHref="/category/developer"
      heroDescription="Query JSON data live in the browser with a practical JSONPath tester built for debugging payloads, docs examples, fixtures, config blobs, and API responses. Paste JSON, enter a JSONPath expression, and inspect both the matched values and the exact paths that were returned."
      heroIcon={<Search className="w-3.5 h-3.5" />}
      calculatorLabel="JSONPath Query Workspace"
      calculatorDescription="Paste JSON, test expressions live, and inspect matched values and exact result paths without leaving the page."
      calculator={
        <div className="space-y-5">
          <div className="grid grid-cols-1 xl:grid-cols-[300px_1fr] gap-5">
            <div className="space-y-4 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
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
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3">Query Status</p>
                <div className={`rounded-2xl border p-4 ${!analysis.jsonError && !analysis.pathError ? "border-emerald-500/20 bg-emerald-500/5" : "border-rose-500/20 bg-rose-500/5"}`}>
                  <div className="flex items-start gap-3">
                    {!analysis.jsonError && !analysis.pathError ? <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5" /> : <AlertTriangle className="w-5 h-5 text-rose-600 mt-0.5" />}
                    <div>
                      <p className="font-bold text-foreground mb-1">{!analysis.jsonError && !analysis.pathError ? "Query ready" : "Needs attention"}</p>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {analysis.jsonError || analysis.pathError || "The JSON parsed successfully and the JSONPath expression was evaluated against it."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-4">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3">Result Stats</p>
                <div className="space-y-2">
                  {[
                    { label: "Root type", value: rootType },
                    { label: "Path segments", value: String(analysis.segments) },
                    { label: "Matches", value: String(analysis.matches.length) },
                    { label: "First path", value: analysis.matches[0]?.path ?? "n/a" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2.5">
                      <span className="text-sm text-muted-foreground">{item.label}</span>
                      <span className="text-sm font-bold text-foreground text-right break-all">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-4">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3">Quick Expressions</p>
                <div className="space-y-2">
                  {QUICK_PATHS.map((path) => (
                    <button key={path} onClick={() => setExpression(path)} className="w-full rounded-xl border border-border bg-muted/40 px-3 py-2.5 text-left font-mono text-xs text-foreground hover:bg-muted">
                      {path}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-blue-500/20 bg-card p-4">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Supported Syntax</p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  This tester supports root selectors, dot notation, quoted bracket notation, indexes, wildcards, key unions, index unions, recursive property lookup, and recursive wildcards.
                </p>
                <pre className="mt-3 overflow-x-auto rounded-xl bg-slate-950 p-3 text-xs leading-relaxed text-slate-100">
                  <code>{`$  .name  ['name']  [0]  [*]  ['a','b']  [0,2]  ..price  ..*`}</code>
                </pre>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">JSONPath Expression</p>
                  <GitBranch className="w-4 h-4 text-blue-600" />
                </div>
                <input
                  value={expression}
                  onChange={(event) => setExpression(event.target.value)}
                  placeholder="$.store.book[*].title"
                  className="w-full rounded-2xl border border-border bg-background px-4 py-3 font-mono text-sm text-foreground outline-none"
                />
              </div>

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
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Matched Values</p>
                    <button onClick={() => copyValue("values", matchedValues)} className="text-xs font-bold text-blue-600 hover:text-blue-700" disabled={!matchedValues}>
                      {copiedLabel === "values" ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <textarea
                    readOnly
                    value={matchedValues || (!analysis.jsonError && !analysis.pathError ? "[]" : "")}
                    spellCheck={false}
                    className="min-h-[360px] w-full rounded-2xl border border-border bg-slate-950 p-4 font-mono text-sm leading-relaxed text-slate-100 outline-none resize-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-4">
                <div className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Matched Paths</p>
                    <button onClick={() => copyValue("paths", matchedPaths)} className="text-xs font-bold text-blue-600 hover:text-blue-700" disabled={!matchedPaths}>
                      {copiedLabel === "paths" ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <textarea
                    readOnly
                    value={matchedPaths || "No matched paths yet."}
                    spellCheck={false}
                    className="min-h-[240px] w-full rounded-2xl border border-border bg-slate-950 p-4 font-mono text-sm leading-relaxed text-slate-100 outline-none resize-none"
                  />
                </div>

                <div className="space-y-4">
                  <div className="rounded-2xl border border-border bg-card p-5">
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">First Match</p>
                      <button onClick={() => copyValue("first", firstMatch)} className="text-xs font-bold text-blue-600 hover:text-blue-700" disabled={!firstMatch}>
                        {copiedLabel === "first" ? "Copied" : "Copy"}
                      </button>
                    </div>
                    <textarea
                      readOnly
                      value={firstMatch || "No first match available."}
                      spellCheck={false}
                      className="min-h-[240px] w-full rounded-2xl border border-border bg-slate-950 p-4 font-mono text-sm leading-relaxed text-slate-100 outline-none resize-none"
                    />
                  </div>

                  <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <FileJson className="w-4 h-4 text-emerald-600" />
                      <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Debugging Tip</p>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      When a query returns zero matches, first confirm the JSON root shape, then simplify the path one segment at a time. Testing `$.store`, then `$.store.book`, then `$.store.book[*]` is usually faster than guessing at the full expression.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-4">Result Preview</p>
                <div className="space-y-3">
                  {analysis.matches.length ? (
                    analysis.matches.slice(0, 8).map((item) => (
                      <div key={`${item.path}-${JSON.stringify(item.value)}`} className="rounded-xl border border-border bg-muted/40 p-3">
                        <p className="font-mono text-xs text-blue-600 break-all">{item.path}</p>
                        <pre className="mt-2 overflow-x-auto rounded-xl bg-slate-950 p-3 text-xs leading-relaxed text-slate-100">
                          <code>{JSON.stringify(item.value, null, 2)}</code>
                        </pre>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-xl border border-border bg-muted/40 p-4 text-sm leading-relaxed text-muted-foreground">
                      {!analysis.jsonError && !analysis.pathError ? "The expression ran successfully but returned no matches." : "Fix the JSON or the JSONPath expression to see matched nodes here."}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      howSteps={[
        { title: "Paste the JSON payload you want to query", description: "JSONPath only makes sense when the underlying JSON is valid, so the tool starts by parsing the payload. That mirrors how JSONPath is used in real work: against API responses, config exports, fixtures, event bodies, and documentation samples that already exist as JSON. Once the input parses, the tester can safely evaluate selectors against the real structure instead of relying on string matching or guesswork." },
        { title: "Enter the JSONPath expression and refine it incrementally", description: "Most JSONPath debugging gets easier when you build the expression step by step. Start at the root, then add properties, then arrays, then wildcards or recursive segments only when you need them. That is why this page keeps the expression field separate from the JSON body and shows the results live. It encourages the same iterative workflow people use when debugging payloads in Postman, browser tools, automation systems, or API documentation examples." },
        { title: "Inspect both matched values and matched paths", description: "A lot of JSONPath tools stop after returning values, but paths matter too. If you know a query returned three strings but not where they came from, you still have to inspect the JSON manually. Showing exact result paths makes it easier to verify whether the expression targeted the intended branch of the payload, whether a recursive query went too wide, or whether a wildcard selected more nodes than you expected." },
        { title: "Copy the values, paths, or first match into the next workflow", description: "Once the expression is correct, the next step is often to reuse the result somewhere else. You might copy matched values into tests, save the matched paths for docs, or grab the first result to compare it with another environment. Good JSONPath tooling should make that handoff easy instead of treating query testing as an isolated toy feature with no practical output." },
      ]}
      interpretationCards={[
        { title: "A valid JSONPath expression can still return zero matches", description: "That usually means the syntax is fine but the path does not align with the actual payload shape. Zero matches are not always errors. They can also be useful signals when you are checking whether a key exists, whether an array contains a branch, or whether a recursive selector is reaching the section you expected." },
        { title: "Matched paths are the fastest way to understand selector scope", description: "If a wildcard or recursive selector returns too many values, the list of exact paths tells you immediately where the query widened. That is often more helpful than looking only at the values, especially when the same scalar value appears in multiple branches of a large document.", className: "bg-cyan-500/5 border-cyan-500/20" },
        { title: "Recursive descent is powerful but easy to overuse", description: "Expressions like `$..price` or `$..*` are useful when exploring a payload, but they can also pull in far more nodes than intended. In production workflows, recursive selectors are usually best for discovery first and for carefully reviewed extraction second.", className: "bg-violet-500/5 border-violet-500/20" },
        { title: "Stable query debugging starts with the real payload shape", description: "Before assuming a JSONPath is wrong, confirm whether the JSON starts with an object or an array, whether the keys are nested exactly as expected, and whether the data is actually present in the environment you are querying. A lot of query confusion turns out to be payload-shape confusion.", className: "bg-amber-500/5 border-amber-500/20" },
      ]}
      examples={[
        { scenario: "List all book titles", input: "$.store.book[*].title", output: "Array of titles from the book list" },
        { scenario: "Find all prices anywhere", input: "$..price", output: "Book prices plus bicycle price" },
        { scenario: "Extract every user email", input: "$.users[*].email", output: "One email value per user object" },
        { scenario: "Inspect all descendants", input: "$..*", output: "Every child node below the root" },
      ]}
      whyChoosePoints={[
        "This JSONPath tester is built as a real query-debugging tool instead of a placeholder route. It parses the JSON, evaluates a practical set of JSONPath selectors in the browser, shows the exact matched values, and surfaces the matched paths so you can confirm that the expression is actually walking the structure you intended. That combination is what makes JSONPath useful in day-to-day developer work rather than just in demos.",
        "The page is also designed around how people actually debug selectors. Most developers do not arrive with the perfect query on the first try. They iterate. They simplify. They compare one branch with another. They check whether the payload is an object or array. The layout supports that workflow with live evaluation, quick starter expressions, copy helpers, and a visible separation between the JSON body, the expression, and the query results.",
        "Showing matched paths is especially important. In large JSON documents, duplicate values are common, and recursive selectors can produce results from multiple branches that look similar at first glance. A tester that hides the path context forces you back into manual inspection. A tester that gives you both the value and its JSONPath-style location is far better for debugging automation, support cases, documentation examples, and API contracts.",
        "This implementation is intentionally transparent about supported syntax. It covers the selectors that solve a large share of real querying work: root, dot notation, quoted bracket notation, indexes, wildcards, unions, and recursive lookup. That is a pragmatic balance for an in-browser utility page because it provides serious value without pretending to support every dialect-specific extension that users might find in a particular library or platform.",
        "Everything runs locally in the browser, which is the right default when the payload contains internal configs, sample customer data, staging responses, or unpublished docs examples. You can test and refine JSONPath queries without sending the JSON anywhere, and that privacy-preserving behavior fits the same practical, developer-first workflow that the rest of the implemented data tools are aiming for.",
      ]}
      faqs={[
        { q: "What is JSONPath used for?", a: "JSONPath is used to query structured JSON data. It lets you target nested properties, iterate arrays, use wildcards, and search recursively so you can extract the nodes you care about from a larger payload." },
        { q: "Why does my JSONPath expression return no results?", a: "Usually because the payload shape is different from what you assumed, the expression is targeting the wrong root branch, or a selector segment is too specific. Zero matches do not always mean invalid syntax. They often mean the query and the data do not line up." },
        { q: "What syntax does this tester support?", a: "This tester supports root selectors, dot notation, quoted bracket notation, indexes, wildcards, unions of keys or indexes, recursive property lookup, and recursive wildcard lookup. It is built for practical query debugging rather than for every possible library-specific JSONPath extension." },
        { q: "Is JSONPath the same everywhere?", a: "No. Different tools and libraries vary a bit, especially around advanced filters and scripting features. That is why it is important to know which subset your current environment supports. This page focuses on a practical core that maps well to common JSONPath usage." },
        { q: "Why show both matched values and matched paths?", a: "Because values alone can be ambiguous in large payloads. Paths give you the exact location of each match, which makes it easier to verify selector scope, debug recursive queries, and explain results to other people in code reviews or support discussions." },
        { q: "Can I use this for API responses and fixtures?", a: "Yes. That is one of the main use cases. JSONPath is commonly used to inspect API responses, automation payloads, fixtures, exports, and configuration objects when you need to pull out specific nested values." },
        { q: "What should I do when recursive selectors return too much data?", a: "Start broad to discover the structure, then narrow the query with explicit properties or indexes. Recursive descent is excellent for exploration, but it is usually best to tighten the expression once you know which branch actually matters." },
        { q: "Does my JSON leave the browser?", a: "No. The JSON parsing and JSONPath evaluation happen in the browser on your machine, which makes the tool suitable for private payloads, staging responses, and internal examples that you do not want to send to a third-party service." },
      ]}
      relatedTools={[
        { title: "JSON Validator", slug: "json-validator", icon: <Braces className="w-4 h-4" />, color: 205, benefit: "Confirm the payload parses before querying it" },
        { title: "JSON Formatter", slug: "json-formatter", icon: <FileJson className="w-4 h-4" />, color: 170, benefit: "Beautify payloads before building selectors" },
        { title: "JSON Minifier", slug: "json-minifier", icon: <Copy className="w-4 h-4" />, color: 145, benefit: "Compact valid JSON after query work is finished" },
        { title: "JSON to CSV Converter", slug: "json-to-csv", icon: <GitBranch className="w-4 h-4" />, color: 28, benefit: "Move selected structured data into tabular exports" },
        { title: "JSON to XML Converter", slug: "json-to-xml", icon: <Search className="w-4 h-4" />, color: 280, benefit: "Transform validated JSON into XML once the shape is confirmed" },
        { title: "JavaScript Formatter", slug: "javascript-formatter", icon: <Wand2 className="w-4 h-4" />, color: 330, benefit: "Clean adjacent extraction code around your queries" },
      ]}
      ctaTitle="Need More JSON Query and Conversion Tools?"
      ctaDescription="Move from JSONPath testing into validation, formatting, minification, and adjacent developer workflows without leaving the tool hub."
      ctaHref="/category/developer"
    />
  );
}
