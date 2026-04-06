import { useMemo, useState } from "react";
import { AlertTriangle, Bug, CheckCircle2, Copy, ListTree, RefreshCw, Replace, Search, Wand2 } from "lucide-react";
import UtilityToolPageShell from "./UtilityToolPageShell";

type MatchInfo = {
  index: number;
  value: string;
  groups: string[];
  namedGroups: Array<{ name: string; value: string }>;
};

type HighlightPart = {
  type: "text" | "match";
  value: string;
  key: string;
};

const SAMPLE_TEXT = `Name: Ava Stone
Email: ava@example.com
Phone: +1 (555) 010-2026
Order: INV-2026-104
Backup email: ava.stone@work.test`;

const SAMPLE_PATTERN = String.raw`([A-Za-z0-9._%+-]+)@([A-Za-z0-9.-]+\.[A-Za-z]{2,})`;

function buildFlags(flags: Record<string, boolean>) {
  return Object.entries(flags)
    .filter(([, enabled]) => enabled)
    .map(([flag]) => flag)
    .join("");
}

function collectMatches(regex: RegExp, text: string) {
  const matches: MatchInfo[] = [];

  if (regex.global || regex.sticky) {
    const cloned = new RegExp(regex.source, regex.flags);
    let result: RegExpExecArray | null = cloned.exec(text);

    while (result) {
      matches.push({
        index: result.index,
        value: result[0],
        groups: result.slice(1).map((item) => item ?? ""),
        namedGroups: Object.entries(result.groups ?? {}).map(([name, value]) => ({ name, value: value ?? "" })),
      });

      if (result[0] === "") cloned.lastIndex += 1;
      result = cloned.exec(text);
    }
  } else {
    const result = regex.exec(text);
    if (result) {
      matches.push({
        index: result.index,
        value: result[0],
        groups: result.slice(1).map((item) => item ?? ""),
        namedGroups: Object.entries(result.groups ?? {}).map(([name, value]) => ({ name, value: value ?? "" })),
      });
    }
  }

  return matches;
}

function buildHighlightParts(text: string, matches: MatchInfo[]) {
  if (!matches.length) {
    return [{ type: "text", value: text, key: "all" }] as HighlightPart[];
  }

  const parts: HighlightPart[] = [];
  let cursor = 0;

  matches.forEach((match, index) => {
    if (match.index > cursor) {
      parts.push({ type: "text", value: text.slice(cursor, match.index), key: `text-${index}-${cursor}` });
    }

    parts.push({
      type: "match",
      value: text.slice(match.index, match.index + match.value.length),
      key: `match-${index}-${match.index}`,
    });

    cursor = match.index + match.value.length;
  });

  if (cursor < text.length) {
    parts.push({ type: "text", value: text.slice(cursor), key: `tail-${cursor}` });
  }

  return parts;
}

export default function RegexTester() {
  const [pattern, setPattern] = useState(SAMPLE_PATTERN);
  const [flags, setFlags] = useState({
    g: true,
    i: false,
    m: false,
    s: false,
    u: false,
    y: false,
  });
  const [text, setText] = useState(SAMPLE_TEXT);
  const [replacement, setReplacement] = useState("$1 [domain: $2]");
  const [copiedLabel, setCopiedLabel] = useState("");

  const flagString = useMemo(() => buildFlags(flags), [flags]);

  const analysis = useMemo(() => {
    try {
      const regex = new RegExp(pattern, flagString);
      const matches = collectMatches(regex, text);
      const replacementPreview = replacement ? text.replace(regex, replacement) : text;

      return {
        error: "",
        regex,
        matches,
        replacementPreview,
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Invalid regular expression.",
        regex: null as RegExp | null,
        matches: [] as MatchInfo[],
        replacementPreview: "",
      };
    }
  }, [flagString, pattern, replacement, text]);

  const matchCount = analysis.matches.length;
  const firstMatch = analysis.matches[0];
  const highlightParts = useMemo(() => buildHighlightParts(text, analysis.matches), [analysis.matches, text]);

  const copyValue = async (label: string, value: string) => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopiedLabel(label);
    window.setTimeout(() => setCopiedLabel(""), 1800);
  };

  const loadSample = () => {
    setPattern(SAMPLE_PATTERN);
    setFlags({ g: true, i: false, m: false, s: false, u: false, y: false });
    setText(SAMPLE_TEXT);
    setReplacement("$1 [domain: $2]");
  };

  const clearAll = () => {
    setPattern("");
    setText("");
    setReplacement("");
  };

  return (
    <UtilityToolPageShell
      title="Regex Tester"
      seoTitle="Regex Tester - Test Regular Expressions Online"
      seoDescription="Free regex tester with live pattern matching, flag controls, highlighted matches, capture-group inspection, and replacement preview."
      canonical="https://usonlinetools.com/developer/regex-tester"
      categoryName="Developer Tools"
      categoryHref="/category/developer"
      heroDescription="Test regular expressions locally in the browser with live matching, flag toggles, replacement preview, highlighted results, and capture-group inspection. This regex tester is built for real debugging work across validation rules, parsers, search patterns, data cleanup, and developer tooling workflows."
      heroIcon={<Bug className="w-3.5 h-3.5" />}
      calculatorLabel="Regex Test Workspace"
      calculatorDescription="Enter a pattern, choose flags, test against source text, inspect matches and groups, and preview replacements instantly."
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
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3">Pattern Flags</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { key: "g", label: "Global" },
                    { key: "i", label: "Ignore case" },
                    { key: "m", label: "Multiline" },
                    { key: "s", label: "Dotall" },
                    { key: "u", label: "Unicode" },
                    { key: "y", label: "Sticky" },
                  ].map((item) => (
                    <label key={item.key} className="flex items-center gap-2 rounded-xl border border-border bg-muted/40 px-3 py-2.5 text-sm text-foreground">
                      <input
                        type="checkbox"
                        checked={flags[item.key as keyof typeof flags]}
                        onChange={(event) => setFlags((current) => ({ ...current, [item.key]: event.target.checked }))}
                        className="h-4 w-4 rounded border-border"
                      />
                      {item.label}
                    </label>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-4">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3">Regex Status</p>
                <div className={`rounded-2xl border p-4 ${analysis.error ? "border-rose-500/20 bg-rose-500/5" : "border-emerald-500/20 bg-emerald-500/5"}`}>
                  <div className="flex items-start gap-3">
                    {analysis.error ? <AlertTriangle className="w-5 h-5 text-rose-600 mt-0.5" /> : <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5" />}
                    <div>
                      <p className="font-bold text-foreground mb-1">{analysis.error ? "Pattern error" : "Regex ready"}</p>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {analysis.error || "The regular expression compiled successfully and the current matches are shown live below."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-4">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3">Result Stats</p>
                <div className="space-y-2">
                  {[
                    { label: "Flags", value: flagString || "none" },
                    { label: "Matches", value: String(matchCount) },
                    { label: "First index", value: firstMatch ? String(firstMatch.index) : "n/a" },
                    { label: "Capture groups", value: firstMatch ? String(firstMatch.groups.length + firstMatch.namedGroups.length) : "0" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2.5">
                      <span className="text-sm text-muted-foreground">{item.label}</span>
                      <span className="text-sm font-bold text-foreground break-all text-right">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-blue-500/20 bg-card p-4">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Tester Note</p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  This tester follows JavaScript regular expression behavior. That makes it useful for front-end validation, Node.js scripts, browser automation, search and replace tooling, and many app-level text workflows.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-border bg-card p-5">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_160px] gap-4">
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Pattern</label>
                    <input
                      value={pattern}
                      onChange={(event) => setPattern(event.target.value)}
                      placeholder="([A-Za-z0-9._%+-]+)@([A-Za-z0-9.-]+\.[A-Za-z]{2,})"
                      spellCheck={false}
                      className="w-full rounded-2xl border border-border bg-background px-4 py-3 font-mono text-sm text-foreground outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Replacement</label>
                    <input
                      value={replacement}
                      onChange={(event) => setReplacement(event.target.value)}
                      placeholder="$1"
                      spellCheck={false}
                      className="w-full rounded-2xl border border-border bg-background px-4 py-3 font-mono text-sm text-foreground outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Test Text</p>
                    <p className="text-xs text-muted-foreground">{text.length} characters</p>
                  </div>
                  <textarea
                    value={text}
                    onChange={(event) => setText(event.target.value)}
                    placeholder="Paste test text here..."
                    spellCheck={false}
                    className="min-h-[320px] w-full rounded-2xl border border-border bg-background p-4 font-mono text-sm leading-relaxed text-foreground outline-none resize-none"
                  />
                </div>

                <div className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Highlighted Matches</p>
                    <button onClick={() => copyValue("matches", analysis.matches.map((item) => item.value).join("\n"))} className="text-xs font-bold text-blue-600 hover:text-blue-700" disabled={!analysis.matches.length}>
                      {copiedLabel === "matches" ? "Copied" : "Copy Matches"}
                    </button>
                  </div>
                  <div className="min-h-[320px] whitespace-pre-wrap break-words rounded-2xl border border-border bg-background p-4 font-mono text-sm leading-relaxed text-foreground">
                    {highlightParts.map((part) =>
                      part.type === "match" ? (
                        <mark key={part.key} className="rounded bg-amber-300/70 px-0.5 text-foreground dark:bg-amber-500/40">
                          {part.value}
                        </mark>
                      ) : (
                        <span key={part.key}>{part.value}</span>
                      ),
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-4">
                <div className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Match Details</p>
                    <button onClick={() => copyValue("regex", pattern ? `/${pattern}/${flagString}` : "")} className="text-xs font-bold text-blue-600 hover:text-blue-700" disabled={!pattern}>
                      {copiedLabel === "regex" ? "Copied" : "Copy Regex"}
                    </button>
                  </div>
                  <div className="space-y-3">
                    {analysis.matches.length ? (
                      analysis.matches.slice(0, 8).map((match, index) => (
                        <div key={`${match.index}-${index}`} className="rounded-xl border border-border bg-muted/40 p-3">
                          <div className="flex items-center justify-between gap-3">
                            <p className="font-mono text-xs text-blue-600">Match {index + 1}</p>
                            <p className="text-xs text-muted-foreground">Index {match.index}</p>
                          </div>
                          <pre className="mt-2 overflow-x-auto rounded-xl bg-slate-950 p-3 text-xs leading-relaxed text-slate-100">
                            <code>{match.value}</code>
                          </pre>
                          {(match.groups.length > 0 || match.namedGroups.length > 0) && (
                            <div className="mt-3 space-y-2">
                              {match.groups.map((group, groupIndex) => (
                                <div key={`g-${groupIndex}`} className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-3 py-2">
                                  <span className="text-xs font-mono text-muted-foreground">${groupIndex + 1}</span>
                                  <span className="text-xs font-mono text-foreground break-all text-right">{group}</span>
                                </div>
                              ))}
                              {match.namedGroups.map((group) => (
                                <div key={group.name} className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-3 py-2">
                                  <span className="text-xs font-mono text-muted-foreground">{group.name}</span>
                                  <span className="text-xs font-mono text-foreground break-all text-right">{group.value}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="rounded-xl border border-border bg-muted/40 p-4 text-sm leading-relaxed text-muted-foreground">
                        {analysis.error ? "Fix the regular expression to inspect matches." : "The current pattern compiled successfully but returned no matches for the test text."}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-2xl border border-border bg-card p-5">
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Replacement Preview</p>
                      <button onClick={() => copyValue("replacement", analysis.replacementPreview)} className="text-xs font-bold text-blue-600 hover:text-blue-700" disabled={!analysis.replacementPreview}>
                        {copiedLabel === "replacement" ? "Copied" : "Copy"}
                      </button>
                    </div>
                    <textarea
                      readOnly
                      value={analysis.replacementPreview || "Replacement preview will appear here when the regex compiles successfully."}
                      spellCheck={false}
                      className="min-h-[210px] w-full rounded-2xl border border-border bg-slate-950 p-4 font-mono text-sm leading-relaxed text-slate-100 outline-none resize-none"
                    />
                  </div>

                  <div className="rounded-2xl border border-border bg-card p-5">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-4">Copy-Ready Snippets</p>
                    <div className="space-y-3">
                      {[
                        { label: "JS Test", value: pattern ? `/${pattern}/${flagString}.test(text)` : "" },
                        { label: "JS Match", value: pattern ? `text.match(/${pattern}/${flagString})` : "" },
                        { label: "JS Replace", value: pattern ? `text.replace(/${pattern}/${flagString}, ${JSON.stringify(replacement)})` : "" },
                      ].map((item) => (
                        <div key={item.label} className="rounded-xl border border-border bg-muted/40 p-3">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">{item.label}</p>
                            <button onClick={() => copyValue(item.label, item.value)} className="text-xs font-bold text-blue-600 hover:text-blue-700" disabled={!item.value}>
                              {copiedLabel === item.label ? "Copied" : "Copy"}
                            </button>
                          </div>
                          <pre className="mt-2 overflow-x-auto rounded-xl bg-slate-950 p-3 text-xs leading-relaxed text-slate-100">
                            <code>{item.value || "Available when a pattern is present."}</code>
                          </pre>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      howSteps={[
        { title: "Enter the regular expression pattern and choose flags", description: "The pattern field is where you define what should match, while the flags tell the engine how to behave. Global matching changes whether you collect every match or only the first. Ignore-case changes letter sensitivity. Multiline changes how anchors behave. Seeing those switches directly in the UI mirrors how people actually debug regexes in editors, browser tools, and JavaScript code." },
        { title: "Paste the source text you want to test against", description: "A regex is only as useful as the text it is run on. Real testing needs realistic source material such as emails, logs, URLs, IDs, markdown, config values, phone numbers, or exported text. That is why the tool keeps the test text large and editable instead of limiting you to toy inputs. When the sample text resembles production data, the regex feedback becomes much more trustworthy." },
        { title: "Review highlighted matches, indexes, and capture groups", description: "A good regex tester should show more than a yes or no result. You need to know exactly what matched, where it matched, and what the capture groups extracted. Highlighted text makes it easy to confirm selector scope. Indexes make it easier to debug anchors and spacing. Capture group inspection tells you whether the groups are returning the pieces you intended to reuse later in validation, parsing, or replacement logic." },
        { title: "Check the replacement preview before you use it in code", description: "A lot of regex work ends in replace operations rather than in simple matching. Being able to test a replacement string against the same live pattern is practical because it closes the loop immediately. You can see whether references like `$1` and `$2` produce the output you want before the expression ever reaches a script, migration step, editor macro, or front-end validation rule." },
      ]}
      interpretationCards={[
        { title: "A valid regex can still be the wrong regex", description: "If a pattern compiles but matches the wrong part of the text, the problem is not syntax anymore. It is scope. That is why highlighted matches and indexes matter as much as error reporting." },
        { title: "Global mode changes the practical behavior a lot", description: "Without the global flag, JavaScript regex workflows often return only the first match. With it, the same pattern can surface every matching segment in the text. That distinction affects validation, extraction, and replacement logic directly.", className: "bg-cyan-500/5 border-cyan-500/20" },
        { title: "Capture groups are usually where the real value lives", description: "In many production regex use cases, the full match is only the first step. The actual goal is to extract the pieces inside the match such as username, domain, date parts, or ID segments. Group inspection helps you confirm those inner pieces quickly.", className: "bg-violet-500/5 border-violet-500/20" },
        { title: "Replacement testing catches a different class of mistakes", description: "A regex may match correctly and still produce bad output in a replace step because the replacement tokens are wrong or the grouping does not line up. Previewing replacements reduces that risk before the expression reaches code or content operations.", className: "bg-amber-500/5 border-amber-500/20" },
      ]}
      examples={[
        { scenario: "Extract email addresses", input: "([A-Za-z0-9._%+-]+)@...", output: "Matched emails plus username and domain groups" },
        { scenario: "Find invoice IDs", input: "INV-\\d{4}-\\d{3}", output: "Only invoice-style IDs are highlighted" },
        { scenario: "Replace phones with a mask", input: "\\d", output: "Preview shows masked digits after replace" },
        { scenario: "Debug line anchors", input: "^Error", output: "Use multiline mode to match every error line" },
      ]}
      whyChoosePoints={[
        "This regex tester is built as a real debugging workspace rather than a placeholder route. It compiles JavaScript regular expressions locally, exposes the important flags directly, highlights exact matches in the source text, shows match indexes and capture groups, and lets you test replacement output in the same session. That combination is what makes regex tooling genuinely useful during development instead of merely demonstrative.",
        "The page is structured around how regex work actually happens. Developers rarely stop at asking whether a pattern is valid. They want to know whether it is too broad, too narrow, whether capture groups are aligned correctly, whether anchors behave as expected, and whether the eventual replacement step is safe. Putting those checks together on one page shortens the debugging loop considerably.",
        "Regex testing is especially valuable in validation and cleanup workflows where silent mistakes are expensive. A pattern that looks plausible can still match the wrong branch of a log line, strip too much text during a migration, or let malformed input slip through a validator. Highlighted matches and group inspection make those mistakes easier to catch before the pattern reaches application code or editor automation.",
        "This tool also makes a practical tradeoff by following JavaScript regex behavior. That matters because many front-end forms, browser scripts, Node.js utilities, editor extensions, and automation tasks rely on the JavaScript regex engine directly. Testing against the same model in the browser gives you a more trustworthy preview than a tool that behaves like a different regex dialect.",
        "Everything runs locally in the browser, which is the right default when you are testing patterns against private logs, internal data exports, client text, auth artifacts, or unpublished content. Regex testing often involves sensitive text, and local execution keeps the workflow fast without sending that text anywhere else just to inspect the matches.",
      ]}
      faqs={[
        { q: "What is a regex tester used for?", a: "A regex tester is used to check how a regular expression behaves against real text. It helps you confirm whether the pattern compiles, what it matches, where it matches, what the capture groups contain, and how replacements will behave." },
        { q: "Why are flags important in regex testing?", a: "Flags change how the regex engine behaves. For example, global mode can return every match, ignore-case changes letter sensitivity, multiline affects anchors, and dotall changes how the dot character handles line breaks. A pattern can behave very differently depending on the selected flags." },
        { q: "Why does my regex compile but return no matches?", a: "That usually means the syntax is valid but the pattern does not line up with the actual source text. The text may have different spacing, casing, punctuation, line structure, or character classes than you expected." },
        { q: "Why inspect capture groups separately from the full match?", a: "Because many regex workflows need the inner pieces rather than only the full matched string. Capture groups let you extract components such as usernames, domains, prefixes, suffixes, IDs, or date parts for later validation or replacement." },
        { q: "What does the replacement preview help with?", a: "It helps you verify that replacement tokens such as `$1` and `$2` are wired correctly and that the final transformed output looks right before you use the regex in code, migrations, editor macros, or search-and-replace operations." },
        { q: "Does this tester use the JavaScript regex engine?", a: "Yes. It is designed around JavaScript regular expression behavior, which makes it especially useful for front-end code, Node.js scripts, browser tooling, and JavaScript-based automation." },
        { q: "Can I test invalid patterns safely here?", a: "Yes. If the pattern is invalid, the page reports the compilation error instead of trying to run the expression. That makes it a practical place to debug syntax before the regex reaches a real script or application." },
        { q: "Who uses a regex tester most often?", a: "Developers, QA teams, technical writers, data migration teams, automation engineers, and support teams all use regex testers when cleaning data, validating input, searching logs, transforming text, or building extraction rules." },
      ]}
      relatedTools={[
        { title: "String Escape & Unescape", slug: "string-escape-unescape", icon: <Replace className="w-4 h-4" />, color: 150, benefit: "Prepare escaped text for regex-heavy code workflows" },
        { title: "Text Diff Checker", slug: "diff-checker", icon: <ListTree className="w-4 h-4" />, color: 210, benefit: "Compare before-and-after text once replacements are done" },
        { title: "JSON Validator", slug: "json-validator", icon: <CheckCircle2 className="w-4 h-4" />, color: 265, benefit: "Validate extracted payload fragments after cleanup" },
        { title: "JavaScript Formatter", slug: "javascript-formatter", icon: <Bug className="w-4 h-4" />, color: 28, benefit: "Clean adjacent regex code snippets in JS workflows" },
        { title: "Markdown to HTML Converter", slug: "markdown-to-html", icon: <Copy className="w-4 h-4" />, color: 330, benefit: "Work on adjacent content transformations after matching" },
        { title: "URL Encoder & Decoder", slug: "url-encoder-decoder", icon: <Search className="w-4 h-4" />, color: 185, benefit: "Inspect encoded strings in text-processing workflows" },
      ]}
      ctaTitle="Need More Text and Parsing Tools?"
      ctaDescription="Keep validating, matching, transforming, and formatting developer text workflows with adjacent tools in the same hub."
      ctaHref="/category/developer"
    />
  );
}
