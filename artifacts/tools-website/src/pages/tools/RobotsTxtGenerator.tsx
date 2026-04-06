import { useMemo, useState } from "react";
import {
  Bot,
  CheckCircle2,
  CircleDashed,
  Copy,
  FileText,
  Globe,
  Plus,
  Search,
  Shield,
  Trash2,
} from "lucide-react";
import UtilityToolPageShell from "./UtilityToolPageShell";

type RuleDirective = "Allow" | "Disallow";

interface RuleRow {
  id: string;
  userAgent: string;
  directive: RuleDirective;
  path: string;
}

const STARTER_RULES: RuleRow[] = [
  { id: "rule-1", userAgent: "*", directive: "Disallow", path: "/admin/" },
  { id: "rule-2", userAgent: "*", directive: "Disallow", path: "/checkout/" },
  { id: "rule-3", userAgent: "*", directive: "Disallow", path: "/search" },
];

function createRule(): RuleRow {
  return {
    id: `rule-${Math.random().toString(36).slice(2, 9)}`,
    userAgent: "*",
    directive: "Disallow",
    path: "/",
  };
}

export default function RobotsTxtGenerator() {
  const [siteUrl, setSiteUrl] = useState("https://usonlinetools.com");
  const [sitemapEnabled, setSitemapEnabled] = useState(true);
  const [crawlDelay, setCrawlDelay] = useState("");
  const [rules, setRules] = useState<RuleRow[]>(STARTER_RULES);
  const [copied, setCopied] = useState(false);

  const sitemapUrl = useMemo(() => {
    const trimmed = siteUrl.trim().replace(/\/+$/, "");
    return trimmed ? `${trimmed}/sitemap.xml` : "";
  }, [siteUrl]);

  const applyProductionPreset = () => {
    setRules([
      { id: "prod-1", userAgent: "*", directive: "Disallow", path: "/admin/" },
      { id: "prod-2", userAgent: "*", directive: "Disallow", path: "/checkout/" },
      { id: "prod-3", userAgent: "*", directive: "Disallow", path: "/search" },
      { id: "prod-4", userAgent: "*", directive: "Allow", path: "/" },
    ]);
    setCrawlDelay("");
  };

  const applyStagingPreset = () => {
    setRules([
      { id: "stage-1", userAgent: "*", directive: "Disallow", path: "/" },
    ]);
    setCrawlDelay("");
  };

  const applyContentPreset = () => {
    setRules([
      { id: "content-1", userAgent: "*", directive: "Allow", path: "/" },
      { id: "content-2", userAgent: "*", directive: "Disallow", path: "/wp-admin/" },
      { id: "content-3", userAgent: "*", directive: "Disallow", path: "/preview/" },
      { id: "content-4", userAgent: "Googlebot-Image", directive: "Allow", path: "/uploads/" },
    ]);
    setCrawlDelay("");
  };

  const groupedRules = useMemo(() => {
    const groups = new Map<string, RuleRow[]>();

    rules.forEach((rule) => {
      const agent = rule.userAgent.trim() || "*";
      const next = groups.get(agent) ?? [];
      next.push(rule);
      groups.set(agent, next);
    });

    return Array.from(groups.entries());
  }, [rules]);

  const robotsText = useMemo(() => {
    const sections = groupedRules.map(([agent, entries]) => {
      const body = entries
        .filter((entry) => entry.path.trim())
        .map((entry) => `${entry.directive}: ${entry.path.trim()}`)
        .join("\n");

      const lines = [`User-agent: ${agent}`];
      if (body) {
        lines.push(body);
      }
      if (crawlDelay.trim()) {
        lines.push(`Crawl-delay: ${crawlDelay.trim()}`);
      }

      return lines.join("\n");
    });

    if (sitemapEnabled && sitemapUrl) {
      sections.push(`Sitemap: ${sitemapUrl}`);
    }

    return sections.join("\n\n");
  }, [crawlDelay, groupedRules, sitemapEnabled, sitemapUrl]);

  const validationNotes = useMemo(() => {
    const notes: string[] = [];
    const absoluteUrlPattern = /^https?:\/\//i;

    if (!siteUrl.trim()) {
      notes.push("Enter the main site URL so the sitemap reference is complete.");
    } else if (!absoluteUrlPattern.test(siteUrl.trim())) {
      notes.push("Use a full absolute site URL including https:// for the sitemap line.");
    }

    rules.forEach((rule, index) => {
      const path = rule.path.trim();
      if (!path) {
        notes.push(`Rule ${index + 1} is empty. Remove it or enter a path.`);
      } else if (path !== "/" && !path.startsWith("/")) {
        notes.push(`Rule ${index + 1} should usually start with "/".`);
      }
    });

    const stagingLock = rules.some((rule) => rule.userAgent.trim() === "*" && rule.directive === "Disallow" && rule.path.trim() === "/");
    if (!stagingLock && rules.length === 1 && rules[0]?.directive === "Disallow") {
      notes.push("If this file is for staging, block the whole site with `Disallow: /`.");
    }

    return notes;
  }, [rules, siteUrl]);

  const workflowSteps = [
    {
      label: "Set the site URL and sitemap destination",
      done: Boolean(siteUrl.trim()),
      detail: siteUrl.trim() || "Missing site URL",
    },
    {
      label: "Choose a rule preset or build custom crawler directives",
      done: rules.some((rule) => rule.path.trim()),
      detail: `${rules.length} rule${rules.length === 1 ? "" : "s"} in the file`,
    },
    {
      label: "Review crawler behavior before publishing",
      done: validationNotes.length === 0,
      detail: validationNotes.length === 0 ? "Ready to copy" : `${validationNotes.length} note(s) to review`,
    },
  ];

  const copyOutput = async () => {
    await navigator.clipboard.writeText(robotsText);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const updateRule = (id: string, key: keyof RuleRow, value: string) => {
    setRules((current) =>
      current.map((rule) =>
        rule.id === id
          ? {
              ...rule,
              [key]: value,
            }
          : rule,
      ),
    );
  };

  const calculator = (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <button onClick={applyProductionPreset} className="rounded-full border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:border-blue-500/40 hover:bg-muted">
          Production Preset
        </button>
        <button onClick={applyStagingPreset} className="rounded-full border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:border-blue-500/40 hover:bg-muted">
          Staging Lock Preset
        </button>
        <button onClick={applyContentPreset} className="rounded-full border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:border-blue-500/40 hover:bg-muted">
          Content Site Preset
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.35fr_0.95fr] gap-5">
        <div className="space-y-5">
          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Site URL</label>
                <input value={siteUrl} onChange={(event) => setSiteUrl(event.target.value)} placeholder="https://example.com" className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Crawl Delay</label>
                <input value={crawlDelay} onChange={(event) => setCrawlDelay(event.target.value)} placeholder="Optional, e.g. 5" className="tool-calc-input w-full" />
              </div>
            </div>

            <label className="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground">
              <input type="checkbox" checked={sitemapEnabled} onChange={(event) => setSitemapEnabled(event.target.checked)} />
              Include sitemap line
            </label>

            {sitemapEnabled ? (
              <div className="mt-4 rounded-xl border border-border bg-card p-4">
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Live Sitemap Reference</p>
                <p className="mt-2 font-mono text-sm text-foreground break-all">{sitemapUrl || "Enter site URL first"}</p>
              </div>
            ) : null}
          </div>

          <div className="rounded-2xl border border-blue-500/20 bg-card p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Crawler Rules</p>
                <p className="text-sm text-muted-foreground">Group directives by user-agent and build the file visually.</p>
              </div>
              <button
                onClick={() => setRules((current) => [...current, createRule()])}
                className="inline-flex items-center gap-1 rounded-full bg-blue-600 px-3 py-2 text-xs font-bold text-white hover:bg-blue-700"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Rule
              </button>
            </div>

            <div className="space-y-3">
              {rules.map((rule) => (
                <div key={rule.id} className="rounded-2xl border border-border bg-muted/30 p-4">
                  <div className="grid grid-cols-1 md:grid-cols-[0.9fr_0.8fr_1.2fr_auto] gap-3">
                    <input value={rule.userAgent} onChange={(event) => updateRule(rule.id, "userAgent", event.target.value)} placeholder="*" className="tool-calc-input w-full" />
                    <select value={rule.directive} onChange={(event) => updateRule(rule.id, "directive", event.target.value)} className="tool-calc-input w-full">
                      <option value="Allow">Allow</option>
                      <option value="Disallow">Disallow</option>
                    </select>
                    <input value={rule.path} onChange={(event) => updateRule(rule.id, "path", event.target.value)} placeholder="/admin/" className="tool-calc-input w-full" />
                    <button
                      onClick={() => setRules((current) => current.filter((item) => item.id !== rule.id))}
                      className="inline-flex items-center justify-center rounded-xl border border-border bg-card px-3 py-3 text-muted-foreground hover:text-rose-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Realtime Publishing Readout</p>
                <p className="text-sm text-muted-foreground">Track the file build as the core sections fill in.</p>
              </div>
              <Bot className="w-5 h-5 text-blue-500" />
            </div>

            <div className="space-y-3">
              {workflowSteps.map((step) => (
                <div key={step.label} className="rounded-2xl border border-border bg-card p-4">
                  <div className="flex items-start gap-3">
                    {step.done ? <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" /> : <CircleDashed className="mt-0.5 h-5 w-5 text-muted-foreground" />}
                    <div>
                      <p className="font-bold text-foreground">{step.label}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{step.detail}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Generated robots.txt</p>
                <p className="text-sm text-muted-foreground">Copy this output into the root-level `robots.txt` file.</p>
              </div>
              <button onClick={copyOutput} className="text-xs font-bold text-blue-600 hover:text-blue-700">
                {copied ? "Copied" : "Copy"}
              </button>
            </div>

            <textarea readOnly value={robotsText} spellCheck={false} className="min-h-[260px] w-full resize-y rounded-2xl border border-border bg-slate-950 p-4 font-mono text-sm leading-relaxed text-slate-100 outline-none" />
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="mb-4 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Validation Notes</p>
            <div className="space-y-3">
              {validationNotes.length === 0 ? (
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                  <p className="font-bold text-foreground">No immediate issues detected</p>
                  <p className="mt-1 text-sm text-muted-foreground">The file structure is ready for copy-and-paste. Double-check that the sitemap line and blocked paths match your actual environment.</p>
                </div>
              ) : (
                validationNotes.map((note) => (
                  <div key={note} className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                    <p className="text-sm text-muted-foreground">{note}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <UtilityToolPageShell
      title="Online Robots.txt Generator"
      seoTitle="Online Robots.txt Generator - Build Crawl Rules and Sitemap Lines"
      seoDescription="Free online robots.txt generator with crawler rule builder, sitemap support, production and staging presets, and live copy-ready output."
      canonical="https://usonlinetools.com/seo/online-robots-txt-generator"
      categoryName="SEO Tools"
      categoryHref="/category/seo"
      heroDescription="Build a crawl-ready `robots.txt` file with common presets, custom allow and disallow rules, optional sitemap output, and a real-time preview. Use it for production launches, staging lockouts, and SEO housekeeping without writing the file from scratch."
      heroIcon={<Search className="w-3.5 h-3.5" />}
      calculatorLabel="Robots.txt Builder"
      calculatorDescription="Assemble crawler directives visually and copy the final text instantly."
      calculator={calculator}
      howSteps={[
        {
          title: "Start with the environment, not with individual paths",
          description:
            "A staging site and a production site need very different crawl rules. Choose the right preset first so you do not accidentally publish a production file that blocks the whole site.",
        },
        {
          title: "Add or edit rules by user-agent and path",
          description:
            "Each row lets you target a crawler and define whether a path should be allowed or disallowed. This is easier to audit than writing the file freehand from memory.",
        },
        {
          title: "Include the sitemap line if the file is for a live site",
          description:
            "A sitemap reference helps crawlers find the URL inventory faster. The generator builds the sitemap URL from your site URL automatically so the file stays consistent.",
        },
        {
          title: "Review the final output before publishing",
          description:
            "Robots mistakes are high impact. Use the validation notes and the final preview to catch malformed paths, missing URLs, or a staging lockout before the file goes live.",
        },
      ]}
      interpretationCards={[
        {
          title: "`Disallow: /` blocks the entire site for that crawler",
          description:
            "This is useful on staging, but dangerous on production. Treat it as an environment-level lock, not a casual line to leave behind.",
        },
        {
          title: "`Allow` and `Disallow` are crawl directives, not index guarantees",
          description:
            "A robots file tells crawlers where they may fetch, but it does not replace canonical tags, redirects, or page-level noindex directives.",
          className: "bg-cyan-500/5 border-cyan-500/20",
        },
        {
          title: "The sitemap line should point to a real live sitemap URL",
          description:
            "Adding a sitemap reference is useful only if the target file exists and contains the URLs you actually want discovered.",
          className: "bg-emerald-500/5 border-emerald-500/20",
        },
        {
          title: "User-agent grouping controls which rules apply together",
          description:
            "When rules are grouped under the same crawler, they form one instruction block. Mixing crawlers carelessly can create harder-to-audit files.",
          className: "bg-amber-500/5 border-amber-500/20",
        },
      ]}
      examples={[
        { scenario: "Production ecommerce site", input: "Disallow admin, checkout, and search URLs", output: "Clean crawl access with public pages still open" },
        { scenario: "Staging environment", input: "Disallow `/` for `*`", output: "Block crawler access before launch" },
        { scenario: "Content site", input: "Allow `/`, block preview URLs, include sitemap", output: "Simple robots file for editorial publishing" },
        { scenario: "Custom image crawl rule", input: "Allow `/uploads/` for `Googlebot-Image`", output: "Targeted crawler-specific directive block" },
      ]}
      whyChoosePoints={[
        "This page gives you a real rule builder and generated file output instead of a placeholder route.",
        "The presets cover the most common practical cases: production, staging lockout, and content-site publishing.",
        "The sitemap line, crawl-delay field, and validation checks make the tool useful for real deployment work rather than only for syntax demos.",
        "The long-form structure matches the stronger recent tools, so the page works as both a generator and an implementation reference.",
        "Everything stays browser-side, which is useful when planning crawl rules for unreleased migrations or internal environments.",
      ]}
      faqs={[
        {
          q: "What does a robots.txt file do?",
          a: "A robots.txt file gives crawlers instructions about which paths they may or may not crawl on a site. It usually lives at the root, such as `https://example.com/robots.txt`.",
        },
        {
          q: "Can robots.txt remove a page from Google?",
          a: "Not reliably by itself. Robots rules manage crawling, not guaranteed indexing. For index control, use the appropriate page-level or site-level signals as well.",
        },
        {
          q: "Should I block staging with robots.txt?",
          a: "Yes, a staging environment often uses `Disallow: /` for `User-agent: *`, but you should also protect staging with authentication when possible.",
        },
        {
          q: "Do I need a sitemap line in robots.txt?",
          a: "It is not mandatory, but it is a useful and common addition for live sites because it points crawlers to your sitemap inventory quickly.",
        },
        {
          q: "What is crawl-delay?",
          a: "Crawl-delay is a directive some crawlers may respect to slow request frequency. Support varies, so it should be used deliberately rather than as a default.",
        },
        {
          q: "Should paths start with a slash?",
          a: "Usually yes. Using a leading slash keeps the rule anchored to the site path structure and avoids malformed entries.",
        },
        {
          q: "Can I create crawler-specific rules here?",
          a: "Yes. Each rule row includes a user-agent field so you can group rules for `*`, Googlebot-specific crawlers, or other named bots.",
        },
        {
          q: "Does this tool publish the file to my site automatically?",
          a: "No. It generates the text for you to copy into the actual root-level `robots.txt` file on your site.",
        },
      ]}
      relatedTools={[
        { title: "Canonical Tag Generator", slug: "canonical-tag-generator", icon: <Globe className="w-4 h-4" />, color: 90, benefit: "Keep crawl signals aligned with preferred URLs" },
        { title: "Schema Markup Generator", slug: "schema-markup-generator", icon: <FileText className="w-4 h-4" />, color: 145, benefit: "Add structured data after crawl rules are set" },
        { title: "Meta Tag Generator", slug: "meta-tag-generator", icon: <Search className="w-4 h-4" />, color: 210, benefit: "Build on-page metadata for the same page" },
        { title: "Open Graph Generator", slug: "open-graph-generator", icon: <Bot className="w-4 h-4" />, color: 275, benefit: "Create sharing metadata alongside search directives" },
        { title: "Twitter Card Generator", slug: "twitter-card-generator", icon: <Shield className="w-4 h-4" />, color: 15, benefit: "Finish social metadata after the crawl setup" },
      ]}
      ctaTitle="Need Another Technical SEO Tool?"
      ctaDescription="Continue replacing the remaining SEO placeholders with real generators and analyzers."
      ctaHref="/category/seo"
    />
  );
}
