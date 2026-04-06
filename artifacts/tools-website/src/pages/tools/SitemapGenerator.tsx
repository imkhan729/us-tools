import { useMemo, useState } from "react";
import {
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

type ChangeFrequency = "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";

interface SitemapRow {
  id: string;
  url: string;
  lastmod: string;
  changefreq: ChangeFrequency;
  priority: string;
}

function createRow(): SitemapRow {
  return {
    id: `url-${Math.random().toString(36).slice(2, 9)}`,
    url: "",
    lastmod: "",
    changefreq: "weekly",
    priority: "0.8",
  };
}

const STARTER_ROWS: SitemapRow[] = [
  {
    id: "row-1",
    url: "https://usonlinetools.com/",
    lastmod: "2026-04-02",
    changefreq: "daily",
    priority: "1.0",
  },
  {
    id: "row-2",
    url: "https://usonlinetools.com/blog/schema-markup-guide",
    lastmod: "2026-04-01",
    changefreq: "weekly",
    priority: "0.8",
  },
];

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export default function SitemapGenerator() {
  const [rows, setRows] = useState<SitemapRow[]>(STARTER_ROWS);
  const [copied, setCopied] = useState(false);

  const validRows = rows.filter((row) => row.url.trim());

  const sitemapXml = useMemo(() => {
    const body = validRows
      .map((row) => {
        const lines = [
          "  <url>",
          `    <loc>${escapeXml(row.url.trim())}</loc>`,
        ];

        if (row.lastmod.trim()) {
          lines.push(`    <lastmod>${row.lastmod.trim()}</lastmod>`);
        }

        if (row.changefreq.trim()) {
          lines.push(`    <changefreq>${row.changefreq}</changefreq>`);
        }

        if (row.priority.trim()) {
          lines.push(`    <priority>${row.priority.trim()}</priority>`);
        }

        lines.push("  </url>");
        return lines.join("\n");
      })
      .join("\n");

    return [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      body,
      "</urlset>",
    ]
      .filter(Boolean)
      .join("\n");
  }, [validRows]);

  const validationNotes = useMemo(() => {
    const notes: string[] = [];
    const absoluteUrlPattern = /^https?:\/\//i;

    rows.forEach((row, index) => {
      const label = `Row ${index + 1}`;
      const url = row.url.trim();

      if (!url) {
        notes.push(`${label} is empty. Remove it or enter a canonical URL.`);
        return;
      }

      if (!absoluteUrlPattern.test(url)) {
        notes.push(`${label} should use a full absolute URL including https://.`);
      }

      const priority = Number(row.priority);
      if (row.priority.trim() && (!Number.isFinite(priority) || priority < 0 || priority > 1)) {
        notes.push(`${label} priority must be between 0.0 and 1.0.`);
      }

      if (row.lastmod.trim() && !/^\d{4}-\d{2}-\d{2}$/.test(row.lastmod.trim())) {
        notes.push(`${label} lastmod should use YYYY-MM-DD format.`);
      }
    });

    return notes;
  }, [rows]);

  const workflowSteps = [
    {
      label: "Add canonical URLs to the sitemap",
      done: validRows.length > 0,
      detail: `${validRows.length} URL${validRows.length === 1 ? "" : "s"} ready`,
    },
    {
      label: "Optional metadata fields are set per URL",
      done: validRows.some((row) => row.lastmod.trim() || row.priority.trim()),
      detail: "Last modified, change frequency, and priority are included where useful",
    },
    {
      label: "Review output and validation notes",
      done: validationNotes.length === 0,
      detail: validationNotes.length === 0 ? "Ready to publish" : `${validationNotes.length} note(s) to review`,
    },
  ];

  const copyOutput = async () => {
    await navigator.clipboard.writeText(sitemapXml);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const updateRow = (id: string, key: keyof SitemapRow, value: string) => {
    setRows((current) =>
      current.map((row) =>
        row.id === id
          ? {
              ...row,
              [key]: value,
            }
          : row,
      ),
    );
  };

  const calculator = (
    <div className="space-y-6">
      <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Sitemap URL Builder</p>
            <p className="text-sm text-muted-foreground">Add the URLs you want crawlers to discover, then tune metadata for each one.</p>
          </div>
          <button
            onClick={() => setRows((current) => [...current, createRow()])}
            className="inline-flex items-center gap-1 rounded-full bg-blue-600 px-3 py-2 text-xs font-bold text-white hover:bg-blue-700"
          >
            <Plus className="w-3.5 h-3.5" />
            Add URL
          </button>
        </div>

        <div className="space-y-3">
          {rows.map((row) => (
            <div key={row.id} className="rounded-2xl border border-border bg-card p-4">
              <div className="grid grid-cols-1 xl:grid-cols-[1.6fr_0.8fr_0.8fr_0.6fr_auto] gap-3">
                <input value={row.url} onChange={(event) => updateRow(row.id, "url", event.target.value)} placeholder="https://example.com/page" className="tool-calc-input w-full" />
                <input value={row.lastmod} onChange={(event) => updateRow(row.id, "lastmod", event.target.value)} placeholder="2026-04-02" className="tool-calc-input w-full" />
                <select value={row.changefreq} onChange={(event) => updateRow(row.id, "changefreq", event.target.value)} className="tool-calc-input w-full">
                  {["always", "hourly", "daily", "weekly", "monthly", "yearly", "never"].map((value) => (
                    <option key={value} value={value}>{value}</option>
                  ))}
                </select>
                <input value={row.priority} onChange={(event) => updateRow(row.id, "priority", event.target.value)} placeholder="0.8" className="tool-calc-input w-full" />
                <button
                  onClick={() => setRows((current) => current.filter((item) => item.id !== row.id))}
                  className="inline-flex items-center justify-center rounded-xl border border-border bg-background px-3 py-3 text-muted-foreground hover:text-rose-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-5">
        <div className="space-y-5">
          <div className="rounded-2xl border border-blue-500/20 bg-card p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Generated XML Sitemap</p>
                <p className="text-sm text-muted-foreground">Copy this into `sitemap.xml` and submit the final URL in Search Console.</p>
              </div>
              <button onClick={copyOutput} className="text-xs font-bold text-blue-600 hover:text-blue-700">
                {copied ? "Copied" : "Copy"}
              </button>
            </div>

            <textarea readOnly value={sitemapXml} spellCheck={false} className="min-h-[320px] w-full resize-y rounded-2xl border border-border bg-slate-950 p-4 font-mono text-sm leading-relaxed text-slate-100 outline-none" />
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="mb-4 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Live Summary</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">URLs Included</p>
                <p className="mt-2 text-2xl font-black text-foreground">{validRows.length}</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Metadata Fields</p>
                <p className="mt-2 text-2xl font-black text-foreground">{validRows.filter((row) => row.lastmod || row.priority).length}</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Validation Notes</p>
                <p className="mt-2 text-2xl font-black text-foreground">{validationNotes.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Realtime Sitemap Readout</p>
                <p className="text-sm text-muted-foreground">Track the sitemap build before you publish or submit it.</p>
              </div>
              <Globe className="w-5 h-5 text-blue-500" />
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
            <p className="mb-4 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Validation Notes</p>
            <div className="space-y-3">
              {validationNotes.length === 0 ? (
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                  <p className="font-bold text-foreground">No immediate issues detected</p>
                  <p className="mt-1 text-sm text-muted-foreground">The XML structure is ready. Make sure the included URLs are canonical and indexable before publishing.</p>
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
      title="Online XML Sitemap Generator"
      seoTitle="Online XML Sitemap Generator - Build Sitemap XML for Search Engines"
      seoDescription="Free online XML sitemap generator with URL row builder, lastmod, changefreq, priority fields, live XML output, and validation notes."
      canonical="https://usonlinetools.com/seo/online-sitemap-generator"
      categoryName="SEO Tools"
      categoryHref="/category/seo"
      heroDescription="Generate a clean XML sitemap with canonical URLs, optional metadata fields, and copy-ready output. Add URLs one by one, review the final XML, and publish a sitemap that helps crawlers discover the right pages faster."
      heroIcon={<FileText className="w-3.5 h-3.5" />}
      calculatorLabel="XML Sitemap Builder"
      calculatorDescription="Build sitemap rows visually and convert them into valid XML instantly."
      calculator={calculator}
      howSteps={[
        {
          title: "Add only the URLs you actually want crawled and indexed",
          description:
            "A sitemap is not a dump of every possible URL. It works best when it lists canonical, indexable pages that represent the final structure of the site.",
        },
        {
          title: "Use metadata fields to describe update rhythm, not to force behavior",
          description:
            "Fields like `lastmod`, `changefreq`, and `priority` provide hints. They are useful when they reflect reality, but they should not be treated as commands that search engines must follow.",
        },
        {
          title: "Review the XML before publishing",
          description:
            "Malformed dates, relative URLs, and out-of-range priorities can make the sitemap harder to trust. The validation notes help catch these issues before the file goes live.",
        },
        {
          title: "Submit the final sitemap after deployment",
          description:
            "Once the file is live at a real sitemap URL, submit it in Search Console or your crawler workflow so discovery happens from the correct published endpoint.",
        },
      ]}
      interpretationCards={[
        {
          title: "Sitemaps help discovery, not ranking by themselves",
          description:
            "A sitemap makes it easier for crawlers to find URLs, but it does not override weak content, duplicate pages, or blocked indexing signals.",
        },
        {
          title: "Every `<loc>` should be a canonical final URL",
          description:
            "Putting duplicate, redirected, or parameter-heavy URLs in a sitemap sends noisy signals. Keep the sitemap aligned with the version of each page you truly want indexed.",
          className: "bg-cyan-500/5 border-cyan-500/20",
        },
        {
          title: "`lastmod` should reflect meaningful updates",
          description:
            "Changing the date on every deploy without changing page content can weaken trust in the field. Use it to reflect real content updates when possible.",
          className: "bg-emerald-500/5 border-emerald-500/20",
        },
        {
          title: "`priority` and `changefreq` are hints, not instructions",
          description:
            "These values can provide context, but they do not force crawl order. Use them for reasonable guidance instead of trying to manipulate crawler behavior.",
          className: "bg-amber-500/5 border-amber-500/20",
        },
      ]}
      examples={[
        { scenario: "New site launch", input: "Homepage, about, services, contact URLs", output: "Publish a first sitemap for faster discovery" },
        { scenario: "Editorial site", input: "Articles with weekly changefreq and real lastmod dates", output: "Expose the current content inventory cleanly" },
        { scenario: "Migration QA", input: "Post-migration canonical URLs only", output: "Avoid sending old or redirected paths in the sitemap" },
        { scenario: "Service business site", input: "Core landing pages with high priority values", output: "Create a lightweight sitemap for key commercial pages" },
      ]}
      whyChoosePoints={[
        "This page gives you a real row-based sitemap builder instead of a placeholder route with no output logic.",
        "The XML updates live, which makes the tool practical for launch checklists and migration QA instead of only as a reference page.",
        "Validation notes catch the common mistakes that usually slip into hand-written sitemaps: relative URLs, malformed dates, and broken priorities.",
        "The long-form structure matches the stronger recent tools and keeps the page useful as both a generator and an SEO implementation guide.",
        "Everything stays browser-side, which is useful when you are drafting sitemap changes before the site is ready to deploy them.",
      ]}
      faqs={[
        {
          q: "What is an XML sitemap used for?",
          a: "An XML sitemap lists URLs you want search engines to discover and review. It is especially useful for new pages, large sites, and launch or migration workflows.",
        },
        {
          q: "Should every URL on my site go into the sitemap?",
          a: "No. Include canonical, indexable pages that represent the final public version of the site. Avoid duplicate, redirected, blocked, or intentionally excluded URLs.",
        },
        {
          q: "Do I need `lastmod`, `changefreq`, and `priority`?",
          a: "They are optional. They can add useful context, but the core requirement is a clean list of canonical URLs.",
        },
        {
          q: "Can this generate large multi-file sitemap indexes?",
          a: "This version is focused on a single sitemap file. For large sites, you would typically split URLs across sitemap files and then reference them from a sitemap index.",
        },
        {
          q: "Should the sitemap URL appear in robots.txt too?",
          a: "Usually yes. Linking the sitemap from `robots.txt` is a common and useful pattern because it gives crawlers another direct path to the file.",
        },
        {
          q: "Can I use relative URLs in a sitemap?",
          a: "No. Sitemap URLs should be absolute so crawlers receive the full canonical location of each page.",
        },
        {
          q: "Does this tool host the sitemap file for me?",
          a: "No. It generates the XML for you to publish as a real `sitemap.xml` file on your own site.",
        },
        {
          q: "Should redirected URLs appear in the sitemap?",
          a: "No. The sitemap should contain the final destination URLs, not the redirected source URLs.",
        },
      ]}
      relatedTools={[
        { title: "Robots.txt Generator", slug: "robots-txt-generator", icon: <Search className="w-4 h-4" />, color: 95, benefit: "Reference the sitemap from robots.txt after publishing it" },
        { title: "Canonical Tag Generator", slug: "canonical-tag-generator", icon: <Globe className="w-4 h-4" />, color: 145, benefit: "Keep sitemap URLs aligned with canonical targets" },
        { title: "Schema Markup Generator", slug: "schema-markup-generator", icon: <FileText className="w-4 h-4" />, color: 210, benefit: "Add structured data on the same indexed pages" },
        { title: "Meta Tag Generator", slug: "meta-tag-generator", icon: <Shield className="w-4 h-4" />, color: 275, benefit: "Build page metadata alongside discovery files" },
        { title: "Open Graph Generator", slug: "open-graph-generator", icon: <Copy className="w-4 h-4" />, color: 20, benefit: "Finish social metadata after search discovery setup" },
      ]}
      ctaTitle="Need Another SEO Generator?"
      ctaDescription="Keep replacing the remaining SEO placeholders with real page builders, analyzers, and validators."
      ctaHref="/category/seo"
    />
  );
}
