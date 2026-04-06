import { useMemo, useState } from "react";
import { Braces, Copy, Database, FileCode2, RefreshCw, ScanText, TerminalSquare, Wand2 } from "lucide-react";
import UtilityToolPageShell from "./UtilityToolPageShell";

const MAJOR_KEYWORDS = [
  "SELECT",
  "FROM",
  "WHERE",
  "GROUP BY",
  "ORDER BY",
  "HAVING",
  "LIMIT",
  "OFFSET",
  "INSERT INTO",
  "VALUES",
  "UPDATE",
  "SET",
  "DELETE FROM",
  "INNER JOIN",
  "LEFT JOIN",
  "RIGHT JOIN",
  "FULL JOIN",
  "JOIN",
  "ON",
  "UNION ALL",
  "UNION",
];

function protectSql(sql: string) {
  const placeholders: string[] = [];
  const protectedSql = sql.replace(/(--[^\n]*|\/\*[\s\S]*?\*\/|'(?:''|[^'])*'|"(?:\\"|[^"])*"|`(?:\\`|[^`])*`)/g, (match) => {
    const token = `__SQL_TOKEN_${placeholders.length}__`;
    placeholders.push(match);
    return token;
  });

  return { protectedSql, placeholders };
}

function restoreSql(sql: string, placeholders: string[]) {
  return placeholders.reduce((current, value, index) => current.replaceAll(`__SQL_TOKEN_${index}__`, value), sql);
}

function formatSql(input: string, indentSize: number, uppercaseKeywords: boolean) {
  const trimmed = input.trim();
  if (!trimmed) return "";

  const { protectedSql, placeholders } = protectSql(trimmed);
  let output = protectedSql.replace(/\s+/g, " ").trim();

  MAJOR_KEYWORDS.forEach((keyword) => {
    const pattern = new RegExp(`\\b${keyword.replace(/\s+/g, "\\s+")}\\b`, "gi");
    output = output.replace(pattern, `\n${uppercaseKeywords ? keyword : keyword.toLowerCase()}`);
  });

  output = output
    .replace(/\s*,\s*/g, ",\n")
    .replace(/\(\s*/g, "(\n")
    .replace(/\s*\)/g, "\n)")
    .replace(/\n{2,}/g, "\n")
    .trim();

  let depth = 0;
  const lines = output.split("\n").map((line) => line.trim()).filter(Boolean);

  const formatted = lines
    .map((line) => {
      if (line.startsWith(")")) depth = Math.max(0, depth - 1);
      const padded = `${" ".repeat(depth * indentSize)}${line}`;
      if (line.endsWith("(")) depth += 1;
      return padded;
    })
    .join("\n");

  return restoreSql(formatted, placeholders);
}

const SAMPLE_SQL = `select u.id,u.email,o.total,o.created_at from users u left join orders o on o.user_id = u.id where u.status = 'active' and o.total > 50 order by o.created_at desc limit 25;`;

export default function SqlFormatter() {
  const [input, setInput] = useState(SAMPLE_SQL);
  const [indentSize, setIndentSize] = useState(2);
  const [uppercaseKeywords, setUppercaseKeywords] = useState(true);
  const [copiedLabel, setCopiedLabel] = useState("");

  const output = useMemo(() => formatSql(input, indentSize, uppercaseKeywords), [indentSize, input, uppercaseKeywords]);
  const stats = useMemo(
    () => ({
      lines: output ? output.split("\n").length : 0,
      chars: output.length,
      keywords: (output.match(/\b(SELECT|FROM|WHERE|JOIN|ORDER BY|GROUP BY|HAVING|LIMIT|UPDATE|INSERT INTO|DELETE FROM)\b/gi) || []).length,
    }),
    [output],
  );

  const copyValue = async (label: string, value: string) => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopiedLabel(label);
    window.setTimeout(() => setCopiedLabel(""), 1800);
  };

  const loadSample = () => {
    setInput(SAMPLE_SQL);
    setIndentSize(2);
    setUppercaseKeywords(true);
  };

  const clearAll = () => setInput("");

  return (
    <UtilityToolPageShell
      title="SQL Formatter"
      seoTitle="SQL Formatter - Format SQL Queries Online"
      seoDescription="Free SQL formatter with clause-aware line breaks, indent controls, uppercase keyword toggles, and copy-ready SQL output."
      canonical="https://usonlinetools.com/developer/sql-formatter"
      categoryName="Developer Tools"
      categoryHref="/category/developer"
      heroDescription="Format raw SQL into cleaner readable queries directly in the browser. This SQL formatter is built for debugging, query reviews, tickets, migration notes, docs, and handoffs where compressed or messy SQL needs to become readable again before it can be trusted or discussed."
      heroIcon={<TerminalSquare className="w-3.5 h-3.5" />}
      calculatorLabel="SQL Formatting Workspace"
      calculatorDescription="Paste SQL, choose indentation and keyword style, then copy a cleaner clause-based query instantly."
      calculator={
        <div className="space-y-5">
          <div className="grid grid-cols-1 xl:grid-cols-[300px_1fr] gap-5">
            <div className="space-y-4 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
              <div>
                <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Indent Size</label>
                <select value={String(indentSize)} onChange={(event) => setIndentSize(Number(event.target.value))} className="tool-calc-input w-full">
                  <option value="2">2 spaces</option>
                  <option value="4">4 spaces</option>
                </select>
              </div>

              <label className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
                <input type="checkbox" checked={uppercaseKeywords} onChange={(event) => setUppercaseKeywords(event.target.checked)} className="mt-1 h-4 w-4 rounded border-border" />
                <span>
                  <span className="block text-sm font-bold text-foreground">Uppercase keywords</span>
                  <span className="block text-sm leading-relaxed text-muted-foreground">Keep core SQL clauses in uppercase for review readability.</span>
                </span>
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
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3">Output Stats</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2.5"><span className="text-sm text-muted-foreground">Lines</span><span className="text-sm font-bold text-foreground">{stats.lines}</span></div>
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2.5"><span className="text-sm text-muted-foreground">Characters</span><span className="text-sm font-bold text-foreground">{stats.chars}</span></div>
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2.5"><span className="text-sm text-muted-foreground">Detected clauses</span><span className="text-sm font-bold text-foreground">{stats.keywords}</span></div>
                </div>
              </div>

              <div className="rounded-2xl border border-blue-500/20 bg-card p-4">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Formatter Note</p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  This formatter focuses on clause readability and review-friendly output. It is especially useful when SQL was copied from logs, dashboards, ORM output, tickets, or minified exports.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">SQL Input</p>
                    <p className="text-xs text-muted-foreground">{input.length} characters</p>
                  </div>
                  <textarea value={input} onChange={(event) => setInput(event.target.value)} spellCheck={false} className="min-h-[320px] w-full rounded-2xl border border-border bg-background p-4 font-mono text-sm leading-relaxed text-foreground outline-none resize-none" />
                </div>

                <div className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Formatted Output</p>
                    <button onClick={() => copyValue("output", output)} className="text-xs font-bold text-blue-600 hover:text-blue-700" disabled={!output}>
                      {copiedLabel === "output" ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <textarea readOnly value={output} spellCheck={false} className="min-h-[320px] w-full rounded-2xl border border-border bg-slate-950 p-4 font-mono text-sm leading-relaxed text-slate-100 outline-none resize-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[1.08fr_0.92fr] gap-4">
                <div className="rounded-2xl border border-border bg-card p-5">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-4">Copy-Ready Snippets</p>
                  <div className="space-y-3">
                    {[
                      { label: "Formatted SQL", value: output },
                      { label: "JS string", value: `const sql = ${JSON.stringify(output)};` },
                      { label: "Migration note", value: `-- reviewed query\n${output}` },
                    ].map((item) => (
                      <div key={item.label} className="rounded-xl border border-border bg-muted/40 p-3">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">{item.label}</p>
                          <button onClick={() => copyValue(item.label, item.value)} className="text-xs font-bold text-blue-600 hover:text-blue-700" disabled={!item.value}>
                            {copiedLabel === item.label ? "Copied" : "Copy"}
                          </button>
                        </div>
                        <pre className="mt-2 overflow-x-auto rounded-xl bg-slate-950 p-3 text-xs leading-relaxed text-slate-100"><code>{item.value || "Available after formatting."}</code></pre>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-2xl border border-border bg-card p-5">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3">Best Uses</p>
                    <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
                      <p className="rounded-xl border border-border bg-muted/40 px-3 py-2.5">Clean ORM output before review.</p>
                      <p className="rounded-xl border border-border bg-muted/40 px-3 py-2.5">Reformat copied dashboard queries.</p>
                      <p className="rounded-xl border border-border bg-muted/40 px-3 py-2.5">Prepare readable SQL for tickets and docs.</p>
                      <p className="rounded-xl border border-border bg-muted/40 px-3 py-2.5">Inspect joins and filters more safely.</p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Practical Tip</p>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      Formatting is often the quickest way to spot a broken join, duplicated filter, or missing clause because structure becomes visible again once the query is no longer compressed into a single line.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      howSteps={[
        { title: "Paste the SQL exactly as it appears in your workflow", description: "The most useful formatting pass starts from the real query, not an idealized example. That means copied SQL from logs, dashboards, ORM output, support tickets, scripts, or console tools. When the formatter works on the real source, it becomes much easier to see whether the structure actually matches your intent." },
        { title: "Choose indentation and keyword style for readability", description: "Formatting preferences matter because readable SQL is easier to review, discuss, and copy back into code or tickets. Indent size affects scan speed, while uppercase keywords make clause boundaries stand out more clearly in many teams. Exposing both controls helps the output fit existing habits instead of forcing manual cleanup afterward." },
        { title: "Review the reformatted clauses before you trust the query", description: "Formatting is not only cosmetic. It is also a debugging step. Once clauses like SELECT, FROM, JOIN, WHERE, ORDER BY, and LIMIT are separated cleanly, mistakes that were hard to spot in compressed SQL become much easier to notice. That is why SQL formatting is often the first thing people do before explaining or reviewing a query." },
        { title: "Copy the cleaned query into the next workflow", description: "The value of a formatter shows up after the page. The cleaned SQL often goes straight into a code review, migration note, issue comment, PR discussion, shared doc, or a safer follow-up edit. Copy-ready output and snippets turn the formatter into something directly useful rather than just visually tidy." },
      ]}
      interpretationCards={[
        { title: "Formatting makes logic easier to inspect", description: "Readable SQL exposes its structure. That makes it easier to reason about which columns are selected, how joins are connected, where filters apply, and whether ordering or limits appear in the right place." },
        { title: "Keyword casing helps clause boundaries stand out", description: "Uppercase keywords are not required by SQL itself, but they make many queries easier to scan quickly during debugging and review because the structural words stop blending into identifiers and values.", className: "bg-cyan-500/5 border-cyan-500/20" },
        { title: "Pretty SQL is still the same SQL", description: "A formatter changes presentation, not intent. That is exactly why it is useful. It helps humans inspect the same query more safely without changing its underlying logic.", className: "bg-violet-500/5 border-violet-500/20" },
        { title: "Comments and strings should survive the format pass intact", description: "A practical SQL formatter should respect quoted values and comment blocks while reorganizing the surrounding structure, because those segments often carry business meaning or debugging context.", className: "bg-amber-500/5 border-amber-500/20" },
      ]}
      examples={[
        { scenario: "Clean a minified select query", input: "select ... from ... where ...", output: "Readable multi-line query" },
        { scenario: "Expose join structure", input: "left join orders o on ...", output: "Join and ON clause become easier to review" },
        { scenario: "Prepare SQL for a ticket", input: "Dashboard-copied single-line SQL", output: "Readable shared query for review" },
        { scenario: "Check filter placement", input: "where and order clauses compressed", output: "Clause order becomes obvious" },
      ]}
      whyChoosePoints={[
        "This SQL formatter is built as a practical readability tool rather than a placeholder. It formats messy queries into clause-oriented output, preserves review-friendly indentation, supports uppercase keyword toggles, and gives copy-ready results for tickets, code, and docs. That makes it useful in actual day-to-day debugging and communication workflows.",
        "The page is designed around how people really use SQL formatting. Most queries that need formatting come from logs, dashboards, ORM output, migration notes, or copied support snippets. In those situations the first goal is not aesthetic polish. It is understanding. A clearer layout makes it much easier to inspect joins, filters, ordering, and query scope before further edits happen.",
        "Formatting also improves collaboration. SQL discussions in pull requests, tickets, Slack threads, and documentation go much faster when the query is readable. Reviewers can comment on actual logic instead of spending time mentally re-parsing a long single-line statement just to understand where one clause ends and the next begins.",
        "This kind of tool is especially helpful for mixed teams where not everyone lives in SQL all day. A product engineer, support engineer, analyst, or technical writer may only need to inspect a query occasionally. Good formatting reduces the cognitive cost of that inspection and makes the query less intimidating to work with.",
        "Everything runs locally in the browser, which is the right default when the query includes internal table names, private schema details, customer-specific filters, or unpublished migration logic. Formatting should not require sending the query elsewhere just to make it readable again.",
      ]}
      faqs={[
        { q: "What does an SQL formatter do?", a: "An SQL formatter restructures a query so clauses, lists, joins, and filters become easier to read. It does not change the intended logic of the query. It changes the presentation so humans can inspect it more safely." },
        { q: "Why format SQL if the database can already run it?", a: "Because readable SQL is easier to review, debug, explain, and maintain. Formatting helps humans spot issues in joins, conditions, ordering, and scope that are hard to see in compressed single-line queries." },
        { q: "Does formatting change the result of the query?", a: "It should not. A formatter is meant to improve readability while preserving the underlying statement. That is why preserving strings, comments, and clause order matters." },
        { q: "When is an SQL formatter most useful?", a: "It is especially useful when SQL comes from logs, ORMs, dashboards, query builders, tickets, or exported scripts in a compressed form that is technically valid but difficult for people to read quickly." },
        { q: "Why do teams often uppercase SQL keywords?", a: "Uppercase keywords make structural clauses stand out from identifiers and values. That visual separation often improves scan speed and makes large queries easier to discuss in code reviews or tickets." },
        { q: "Can this help with debugging as well as readability?", a: "Yes. Formatting is often the first debugging step because it makes the query structure visible again. Once the structure is readable, logic mistakes are easier to spot." },
        { q: "Who uses an SQL formatter most often?", a: "Developers, analysts, QA teams, support engineers, data teams, and technical writers all use SQL formatters when reviewing, explaining, or documenting queries that need to become readable again." },
        { q: "Does the SQL leave the browser?", a: "No. The formatting happens locally in the browser, which is useful when the query contains internal schema details or customer-specific logic that should stay on your machine." },
      ]}
      relatedTools={[
        { title: "JSON Formatter", slug: "json-formatter", icon: <Braces className="w-4 h-4" />, color: 150, benefit: "Clean structured payloads alongside query output" },
        { title: "Regex Tester", slug: "regex-tester", icon: <ScanText className="w-4 h-4" />, color: 210, benefit: "Work on adjacent text parsing rules" },
        { title: "Text Diff Checker", slug: "diff-checker", icon: <Copy className="w-4 h-4" />, color: 265, benefit: "Compare before-and-after query revisions" },
        { title: "String Escape & Unescape", slug: "string-escape-unescape", icon: <Database className="w-4 h-4" />, color: 28, benefit: "Handle escaped SQL-adjacent strings in code" },
        { title: "JavaScript Formatter", slug: "javascript-formatter", icon: <Wand2 className="w-4 h-4" />, color: 330, benefit: "Clean surrounding code when SQL lives inside scripts" },
        { title: "HTML Formatter & Beautifier", slug: "html-formatter", icon: <FileCode2 className="w-4 h-4" />, color: 185, benefit: "Keep other markup-based outputs readable too" },
      ]}
      ctaTitle="Need More Query and Formatting Tools?"
      ctaDescription="Keep formatting, validating, comparing, and cleaning developer text with adjacent utilities in the same tool hub."
      ctaHref="/category/developer"
    />
  );
}
