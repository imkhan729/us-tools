import { useMemo, useState } from "react";
import { Copy, FileCode2, ListTree, RefreshCw, ScanSearch, SplitSquareVertical, Wand2 } from "lucide-react";
import UtilityToolPageShell from "./UtilityToolPageShell";
import { getCanonicalToolPath } from "@/data/tools";

type DiffKind = "same" | "removed" | "added";
type DiffRow = {
  kind: DiffKind;
  left: string;
  right: string;
};

function buildDiff(leftText: string, rightText: string) {
  const leftLines = leftText.replace(/\r/g, "").split("\n");
  const rightLines = rightText.replace(/\r/g, "").split("\n");
  const rows = Array.from({ length: leftLines.length + 1 }, () => Array(rightLines.length + 1).fill(0));

  for (let leftIndex = leftLines.length - 1; leftIndex >= 0; leftIndex -= 1) {
    for (let rightIndex = rightLines.length - 1; rightIndex >= 0; rightIndex -= 1) {
      rows[leftIndex][rightIndex] =
        leftLines[leftIndex] === rightLines[rightIndex]
          ? rows[leftIndex + 1][rightIndex + 1] + 1
          : Math.max(rows[leftIndex + 1][rightIndex], rows[leftIndex][rightIndex + 1]);
    }
  }

  const diff: DiffRow[] = [];
  let leftIndex = 0;
  let rightIndex = 0;

  while (leftIndex < leftLines.length && rightIndex < rightLines.length) {
    if (leftLines[leftIndex] === rightLines[rightIndex]) {
      diff.push({ kind: "same", left: leftLines[leftIndex], right: rightLines[rightIndex] });
      leftIndex += 1;
      rightIndex += 1;
    } else if (rows[leftIndex + 1][rightIndex] >= rows[leftIndex][rightIndex + 1]) {
      diff.push({ kind: "removed", left: leftLines[leftIndex], right: "" });
      leftIndex += 1;
    } else {
      diff.push({ kind: "added", left: "", right: rightLines[rightIndex] });
      rightIndex += 1;
    }
  }

  while (leftIndex < leftLines.length) {
    diff.push({ kind: "removed", left: leftLines[leftIndex], right: "" });
    leftIndex += 1;
  }

  while (rightIndex < rightLines.length) {
    diff.push({ kind: "added", left: "", right: rightLines[rightIndex] });
    rightIndex += 1;
  }

  return diff;
}

const LEFT_SAMPLE = `name: Ava Stone
role: admin
scope: read:tools
status: active`;

const RIGHT_SAMPLE = `name: Ava Stone
role: editor
scope: read:tools write:reports
status: active
region: us-east-1`;

export default function TextDiffChecker() {
  const [leftText, setLeftText] = useState(LEFT_SAMPLE);
  const [rightText, setRightText] = useState(RIGHT_SAMPLE);
  const [copiedLabel, setCopiedLabel] = useState("");

  const rows = useMemo(() => buildDiff(leftText, rightText), [leftText, rightText]);
  const stats = useMemo(
    () => ({
      same: rows.filter((row) => row.kind === "same").length,
      removed: rows.filter((row) => row.kind === "removed").length,
      added: rows.filter((row) => row.kind === "added").length,
    }),
    [rows],
  );

  const unifiedPreview = useMemo(
    () =>
      rows
        .map((row) => {
          if (row.kind === "same") return `  ${row.left}`;
          if (row.kind === "removed") return `- ${row.left}`;
          return `+ ${row.right}`;
        })
        .join("\n"),
    [rows],
  );

  const copyValue = async (label: string, value: string) => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopiedLabel(label);
    window.setTimeout(() => setCopiedLabel(""), 1800);
  };

  const loadSample = () => {
    setLeftText(LEFT_SAMPLE);
    setRightText(RIGHT_SAMPLE);
  };

  const clearAll = () => {
    setLeftText("");
    setRightText("");
  };

  return (
    <UtilityToolPageShell
      title="Text Diff Checker"
      seoTitle="Text Diff Checker - Compare Two Texts Online"
      seoDescription="Free text diff checker with side-by-side line comparison, added and removed line highlighting, and unified diff preview."
      canonical={`https://usonlinetools.com${getCanonicalToolPath("diff-checker")}`}
      categoryName="Developer Tools"
      categoryHref="/category/developer"
      heroDescription="Compare two text blocks line by line in the browser and inspect what changed with a practical diff checker built for docs, config files, payloads, logs, prompts, and copied code snippets. This page focuses on quick review and change visibility instead of making you compare long text manually."
      heroIcon={<SplitSquareVertical className="w-3.5 h-3.5" />}
      calculatorLabel="Diff Workspace"
      calculatorDescription="Paste the original and updated text, review the line-by-line diff, and copy a unified change summary instantly."
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
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3">Diff Stats</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2.5"><span className="text-sm text-muted-foreground">Unchanged</span><span className="text-sm font-bold text-foreground">{stats.same}</span></div>
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2.5"><span className="text-sm text-muted-foreground">Removed</span><span className="text-sm font-bold text-rose-600">{stats.removed}</span></div>
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2.5"><span className="text-sm text-muted-foreground">Added</span><span className="text-sm font-bold text-emerald-600">{stats.added}</span></div>
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2.5"><span className="text-sm text-muted-foreground">Compared rows</span><span className="text-sm font-bold text-foreground">{rows.length}</span></div>
                </div>
              </div>

              <div className="rounded-2xl border border-blue-500/20 bg-card p-4">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Comparison Note</p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  This diff checker focuses on line-level review, which is usually the fastest way to understand config changes, edited prompts, copied snippets, or before-and-after content blocks.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Original Text</p>
                    <p className="text-xs text-muted-foreground">{leftText.length} characters</p>
                  </div>
                  <textarea value={leftText} onChange={(event) => setLeftText(event.target.value)} spellCheck={false} className="tool-calc-textarea min-h-[260px]" />
                </div>

                <div className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Updated Text</p>
                    <p className="text-xs text-muted-foreground">{rightText.length} characters</p>
                  </div>
                  <textarea value={rightText} onChange={(event) => setRightText(event.target.value)} spellCheck={false} className="tool-calc-textarea min-h-[260px]" />
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Side-by-Side Diff</p>
                  <button onClick={() => copyValue("unified", unifiedPreview)} className="text-xs font-bold text-blue-600 hover:text-blue-700">
                    {copiedLabel === "unified" ? "Copied" : "Copy Unified Diff"}
                  </button>
                </div>
                <div className="overflow-x-auto rounded-2xl border border-border">
                  <div className="grid grid-cols-[44px_1fr_44px_1fr] bg-muted/40 px-3 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                    <div>#</div><div>Original</div><div>#</div><div>Updated</div>
                  </div>
                  <div>
                    {rows.map((row, index) => {
                      const classes =
                        row.kind === "removed"
                          ? "bg-rose-500/5"
                          : row.kind === "added"
                            ? "bg-emerald-500/5"
                            : "bg-card";

                      return (
                        <div key={`${index}-${row.kind}-${row.left}-${row.right}`} className={`grid grid-cols-[44px_1fr_44px_1fr] border-t border-border ${classes}`}>
                          <div className="px-3 py-2 font-mono text-xs text-muted-foreground">{row.left ? index + 1 : ""}</div>
                          <div className="px-3 py-2 font-mono text-xs text-foreground whitespace-pre-wrap break-words">{row.left}</div>
                          <div className="px-3 py-2 font-mono text-xs text-muted-foreground">{row.right ? index + 1 : ""}</div>
                          <div className="px-3 py-2 font-mono text-xs text-foreground whitespace-pre-wrap break-words">{row.right}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[1.08fr_0.92fr] gap-4">
                <div className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Unified Preview</p>
                    <button onClick={() => copyValue("preview", unifiedPreview)} className="text-xs font-bold text-blue-600 hover:text-blue-700">
                      {copiedLabel === "preview" ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <textarea readOnly value={unifiedPreview} spellCheck={false} className="tool-calc-textarea tool-calc-output min-h-[220px]" />
                </div>

                <div className="space-y-4">
                  <div className="rounded-2xl border border-border bg-card p-5">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3">Copy-Ready Snippets</p>
                    <div className="space-y-3">
                      {[
                        { label: "Before text", value: leftText },
                        { label: "After text", value: rightText },
                        { label: "Unified diff", value: unifiedPreview },
                      ].map((item) => (
                        <div key={item.label} className="rounded-xl border border-border bg-muted/40 p-3">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">{item.label}</p>
                            <button onClick={() => copyValue(item.label, item.value)} className="text-xs font-bold text-blue-600 hover:text-blue-700" disabled={!item.value}>
                              {copiedLabel === item.label ? "Copied" : "Copy"}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Practical Tip</p>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      When a change looks larger than expected, compare line endings, spacing, and blank lines first. Many surprising diffs turn out to be formatting drift rather than meaningful content changes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      howSteps={[
        { title: "Paste the original and updated text side by side", description: "A diff checker is most useful when both versions are visible at once. That reduces guesswork and makes it easier to reason about what changed between two prompts, config files, docs blocks, copied payloads, or code-adjacent text snippets." },
        { title: "Review the line-by-line changes before looking at the summary", description: "Seeing which lines were removed, added, or left unchanged gives you the clearest first-pass understanding of the edit. That matters because raw unified diff syntax can be compact, but a side-by-side view is often faster for humans when the goal is quick review rather than patch application." },
        { title: "Use the stats to understand the size of the change", description: "The counts for unchanged, removed, and added rows give you a quick sense of whether you are looking at a small edit or a large rewrite. That context is useful when reviewing generated text, migration output, environment configs, or any other content where scope matters before you inspect every single row." },
        { title: "Copy the unified preview when you need a portable summary", description: "Once the comparison is clear, the unified diff preview gives you a compact output you can paste into tickets, comments, chat, docs, or release notes. That keeps the comparison useful beyond the page itself and turns the checker into something you can use in actual review workflows." },
      ]}
      interpretationCards={[
        { title: "Unchanged rows anchor the review", description: "Seeing what stayed the same is almost as important as seeing what changed because it helps you understand whether the edit was localized or whether the structure shifted throughout the whole document." },
        { title: "Removed rows usually explain intent just as much as added rows", description: "When a line disappears, that can be as meaningful as any new content. Side-by-side diffs make it easier to spot deleted keys, dropped options, or removed phrases without losing the surrounding context.", className: "bg-cyan-500/5 border-cyan-500/20" },
        { title: "Line-based diffing is often the right default for configs and docs", description: "Character-level diffing can be useful, but line-level comparison is usually easier to read first for configuration files, payload snapshots, note drafts, and text-based workflows where meaning tends to align with lines.", className: "bg-violet-500/5 border-violet-500/20" },
        { title: "Formatting-only changes can still create noisy diffs", description: "Blank lines, indentation, and line ending changes can make a diff appear larger than the logical change really was. Reviewing the side-by-side output helps separate structural edits from cosmetic ones.", className: "bg-amber-500/5 border-amber-500/20" },
      ]}
      examples={[
        { scenario: "Compare environment config lines", input: "Before vs after YAML-like text", output: "Added region and changed role are obvious" },
        { scenario: "Review prompt edits", input: "Two prompt versions", output: "Line changes show what instructions moved" },
        { scenario: "Check docs revisions", input: "Old section and updated section", output: "Added and removed lines stand out quickly" },
        { scenario: "Inspect generated output drift", input: "Original export and regenerated export", output: "Unified diff summary for review" },
      ]}
      whyChoosePoints={[
        "This text diff checker is built as a practical review tool rather than a placeholder. It compares two inputs line by line, shows the result side by side, counts unchanged and changed rows, and gives you a unified preview that can be copied into other workflows. That makes it useful for actual editing, review, and debugging tasks instead of only for visual demonstration.",
        "The page is designed around the way people really inspect text changes. Side-by-side comparison gives fast visual clarity, while the unified summary makes the result portable. Having both on one page is useful because some situations call for immediate visual inspection and others call for a compact diff you can paste into a ticket, issue, or review comment.",
        "This kind of tool is especially valuable when you are comparing generated content, prompts, configs, logs, environment values, docs drafts, or export snapshots. In those workflows the files may be too small to justify a full repository workflow but still too large to compare reliably by eye. A line-level checker is the pragmatic middle ground.",
        "Counting added and removed lines also helps scope the review. If the stats show one changed line, you can inspect narrowly. If they show a broad drift, you know to slow down and look for formatting or structure changes that may have wider impact than the visible content suggests.",
        "Everything runs locally in the browser, which is the right default when the compared text includes internal prompts, config values, support notes, customer-facing drafts, or other material that should not be uploaded to a third-party service just to spot the differences.",
      ]}
      faqs={[
        { q: "What does a text diff checker do?", a: "A text diff checker compares two versions of text and highlights what stayed the same, what was removed, and what was added. It helps you review edits without scanning both versions manually." },
        { q: "Why use line-by-line comparison?", a: "Because line-level differences are usually the fastest to understand for configs, docs, prompts, payload snapshots, and other structured text workflows. It gives a clear overview before you need finer-grained comparison." },
        { q: "What is a unified diff preview?", a: "A unified diff preview is a compact text summary of the comparison where unchanged lines are shown with neutral prefixes and changed lines are marked as additions or removals. It is useful for sharing and review notes." },
        { q: "Can formatting changes create misleading diffs?", a: "Yes. Changes in blank lines, indentation, spacing, or line endings can make a diff look larger than the logical edit really was. Reviewing the side-by-side view helps you separate cosmetic changes from meaningful ones." },
        { q: "Who uses a text diff checker most often?", a: "Developers, QA teams, support engineers, technical writers, SEO teams, and content editors all use text diff checkers when reviewing revised prompts, configs, docs, payloads, or generated output." },
        { q: "Is this the same as a Git diff?", a: "It serves a similar review purpose, but it is a lightweight browser-based line diff for pasted text rather than a repository-aware source control tool. It is useful when you want fast comparison without a full Git workflow." },
        { q: "What kinds of text work best with this tool?", a: "It works especially well with line-oriented content such as configs, notes, prompts, markdown, logs, copied API payloads, environment blocks, and small text snippets that changed between versions." },
        { q: "Does the compared text leave the browser?", a: "No. The comparison happens locally in the browser, which makes the tool suitable for internal text and drafts that you would rather not upload elsewhere just to inspect changes." },
      ]}
      relatedTools={[
        { title: "Regex Tester", slug: "regex-tester", icon: <ScanSearch className="w-4 h-4" />, color: 150, benefit: "Check patterns before or after text edits" },
        { title: "String Escape & Unescape", slug: "string-escape-unescape", icon: <Copy className="w-4 h-4" />, color: 210, benefit: "Compare text before and after escaping workflows" },
        { title: "JSON Formatter", slug: "json-formatter", icon: <FileCode2 className="w-4 h-4" />, color: 265, benefit: "Clean structured text before comparing" },
        { title: "Markdown Previewer", slug: "online-markdown-previewer", icon: <SplitSquareVertical className="w-4 h-4" />, color: 28, benefit: "Review content changes after diffing markdown" },
        { title: "Markdown to HTML Converter", slug: "markdown-to-html", icon: <Wand2 className="w-4 h-4" />, color: 330, benefit: "Compare transformed content across workflow steps" },
        { title: "JSON Validator", slug: "json-validator", icon: <ListTree className="w-4 h-4" />, color: 185, benefit: "Validate changed payloads after review" },
      ]}
      ctaTitle="Need More Comparison and Cleanup Tools?"
      ctaDescription="Keep comparing, transforming, validating, and formatting text workflows with adjacent developer tools in the same hub."
      ctaHref="/category/developer"
    />
  );
}
