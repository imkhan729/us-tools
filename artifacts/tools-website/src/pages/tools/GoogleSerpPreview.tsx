import { useMemo, useState } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronDown,
  ChevronRight,
  Copy,
  Eye,
  FileText,
  Link2,
  Search,
  Shield,
  Smartphone,
  Sparkles,
  Type,
  Zap,
} from "lucide-react";

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-lime-500/40 transition-colors">
      <button
        onClick={() => setOpen((value) => !value)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left"
      >
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 text-lime-500"
        >
          <ChevronDown className="w-5 h-5" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 pt-1 text-muted-foreground leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function clipText(value: string, limit: number) {
  if (!value.trim()) return "";
  if (value.length <= limit) return value;
  return `${value.slice(0, Math.max(0, limit - 1)).trimEnd()}…`;
}

function cleanUrlForPreview(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "example.com/your-page";
  return trimmed.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

function escapeAttribute(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

const RELATED_TOOLS = [
  {
    title: "Open Graph Tag Generator",
    href: "/seo/open-graph-generator",
    benefit: "Generate social preview tags for Facebook and LinkedIn.",
    icon: <Sparkles className="w-4 h-4" />,
  },
  {
    title: "Twitter Card Generator",
    href: "/seo/twitter-card-generator",
    benefit: "Create X card markup with image and handle fields.",
    icon: <FileText className="w-4 h-4" />,
  },
  {
    title: "Meta Tag Generator",
    href: "/seo/meta-tag-generator",
    benefit: "Build the rest of your base title and description tags.",
    icon: <Type className="w-4 h-4" />,
  },
  {
    title: "Canonical Tag Generator",
    href: "/seo/canonical-tag-generator",
    benefit: "Prepare a clean canonical URL for the same page.",
    icon: <Link2 className="w-4 h-4" />,
  },
];

export default function GoogleSerpPreview() {
  const [title, setTitle] = useState("Free Google SERP Preview Tool for SEO Metadata Reviews");
  const [description, setDescription] = useState(
    "Preview how your page title, meta description, and URL may look in Google Search before you publish or update the page."
  );
  const [url, setUrl] = useState("https://usonlinetools.com/seo/serp-preview-tool");
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const titleLength = title.length;
  const descriptionLength = description.length;

  const titleTone =
    titleLength === 0 ? "text-muted-foreground" : titleLength <= 60 ? "text-emerald-500" : titleLength <= 70 ? "text-amber-500" : "text-rose-500";
  const descriptionTone =
    descriptionLength === 0
      ? "text-muted-foreground"
      : descriptionLength <= 155
        ? "text-emerald-500"
        : descriptionLength <= 170
          ? "text-amber-500"
          : "text-rose-500";

  const previewTitle = useMemo(
    () => clipText(title.trim() || "Your page title will appear here", 62),
    [title]
  );
  const previewDescription = useMemo(
    () =>
      clipText(
        description.trim() || "Write a clear meta description so users know what the page offers before they click.",
        158
      ),
    [description]
  );
  const previewUrl = useMemo(() => cleanUrlForPreview(url), [url]);

  const generatedSnippet = useMemo(() => {
    const lines = [];
    if (title.trim()) lines.push(`<title>${escapeAttribute(title.trim())}</title>`);
    if (description.trim()) lines.push(`<meta name="description" content="${escapeAttribute(description.trim())}">`);
    if (url.trim()) lines.push(`<link rel="canonical" href="${escapeAttribute(url.trim())}">`);
    return lines.join("\n");
  }, [description, title, url]);

  const copySnippet = () => {
    if (!generatedSnippet) return;
    navigator.clipboard.writeText(generatedSnippet);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const copyPageLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setLinkCopied(true);
    window.setTimeout(() => setLinkCopied(false), 1800);
  };

  return (
    <Layout>
      <SEO
        title="Google SERP Preview Tool - Preview Title and Meta Description | US Online Tools"
        description="Free Google SERP preview tool. Test your page title, meta description, and URL before publishing. Instant browser-based preview with copyable markup."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight className="w-4 h-4 mx-2 text-lime-500" strokeWidth={3} />
          <Link href="/category/seo" className="text-muted-foreground hover:text-foreground transition-colors">
            SEO Tools
          </Link>
          <ChevronRight className="w-4 h-4 mx-2 text-lime-500" strokeWidth={3} />
          <span className="text-foreground">Google SERP Preview</span>
        </nav>

        <section className="rounded-2xl overflow-hidden border border-lime-500/15 bg-gradient-to-br from-lime-500/5 via-card to-emerald-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-lime-500/10 text-lime-600 dark:text-lime-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Search className="w-3.5 h-3.5" />
            SEO Tools
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">
            Google SERP Preview
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Preview your SEO title, meta description, and display URL before you publish. Adjust the copy live and see whether your search snippet still looks clean, clickable, and complete.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20">
              <BadgeCheck className="w-3.5 h-3.5" />
              100% Free
            </span>
            <span className="inline-flex items-center gap-1.5 bg-lime-500/10 text-lime-600 dark:text-lime-400 font-bold text-xs px-3 py-1.5 rounded-full border border-lime-500/20">
              <Zap className="w-3.5 h-3.5" />
              Live Preview
            </span>
            <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs px-3 py-1.5 rounded-full border border-cyan-500/20">
              <Smartphone className="w-3.5 h-3.5" />
              Mobile Ready
            </span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20">
              <Shield className="w-3.5 h-3.5" />
              Client-Side
            </span>
          </div>
          <p className="text-xs text-muted-foreground/70 font-medium">
            Category: SEO Tools · Use it before publishing titles, descriptions, and canonical URLs
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">
            <section>
              <div className="rounded-2xl overflow-hidden border border-lime-500/20 shadow-lg shadow-lime-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-lime-500 to-emerald-400" />
                <div className="bg-card p-6 md:p-8 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-lime-500 to-emerald-400 flex items-center justify-center flex-shrink-0">
                      <Eye className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Live Search Snippet Preview</p>
                      <p className="text-sm text-muted-foreground">Edit your metadata and preview the snippet instantly.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-[1.15fr_0.85fr] gap-6">
                    <div className="space-y-5">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">SEO Title</label>
                          <span className={`text-xs font-bold ${titleTone}`}>{titleLength} / 60</span>
                        </div>
                        <input
                          type="text"
                          value={title}
                          onChange={(event) => setTitle(event.target.value)}
                          placeholder="Enter the page title"
                          className="tool-calc-input w-full"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Meta Description</label>
                          <span className={`text-xs font-bold ${descriptionTone}`}>{descriptionLength} / 155</span>
                        </div>
                        <textarea
                          value={description}
                          onChange={(event) => setDescription(event.target.value)}
                          placeholder="Summarize the page in one strong sentence"
                          className="tool-calc-input w-full min-h-[124px] resize-y"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">Page URL</label>
                        <input
                          type="text"
                          value={url}
                          onChange={(event) => setUrl(event.target.value)}
                          placeholder="https://example.com/page"
                          className="tool-calc-input w-full"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="rounded-xl border border-border bg-muted/30 p-4">
                          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Title Status</p>
                          <p className={`text-sm font-bold ${titleTone}`}>
                            {titleLength === 0 ? "Add a title" : titleLength <= 60 ? "Good length" : titleLength <= 70 ? "May truncate" : "Too long"}
                          </p>
                        </div>
                        <div className="rounded-xl border border-border bg-muted/30 p-4">
                          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Description Status</p>
                          <p className={`text-sm font-bold ${descriptionTone}`}>
                            {descriptionLength === 0
                              ? "Add a description"
                              : descriptionLength <= 155
                                ? "Good length"
                                : descriptionLength <= 170
                                  ? "Borderline"
                                  : "Too long"}
                          </p>
                        </div>
                        <div className="rounded-xl border border-border bg-muted/30 p-4">
                          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Display URL</p>
                          <p className="text-sm font-bold text-foreground break-all">{previewUrl}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="rounded-2xl border border-border bg-background p-5">
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Search Result Preview</p>
                        <div className="space-y-2">
                          <p className="text-[22px] leading-7 text-[#1a0dab] dark:text-sky-400">{previewTitle}</p>
                          <div className="flex items-center gap-2 text-sm text-[#188038] dark:text-emerald-400">
                            <span className="w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center">
                              <Link2 className="w-3 h-3" />
                            </span>
                            <span className="break-all">{previewUrl}</span>
                          </div>
                          <p className="text-[15px] leading-6 text-muted-foreground">{previewDescription}</p>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-border bg-zinc-950 text-lime-400 p-4">
                        <div className="flex items-center justify-between gap-3 mb-3">
                          <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Copyable Meta Snippet</p>
                          <button
                            onClick={copySnippet}
                            className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
                              copied ? "bg-emerald-500 text-white" : "bg-lime-500 text-zinc-950 hover:bg-lime-400"
                            }`}
                          >
                            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            {copied ? "Copied" : "Copy"}
                          </button>
                        </div>
                        <textarea
                          readOnly
                          value={generatedSnippet || "<title></title>\n<meta name=\"description\" content=\"\">\n<link rel=\"canonical\" href=\"\">"}
                          className="w-full h-44 bg-transparent text-sm font-mono resize-none outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Use the Google SERP Preview</h2>
              <ol className="space-y-5">
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-lime-500/10 text-lime-600 dark:text-lime-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Paste or draft your title, description, and final URL</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Start with the real page copy you plan to publish. The preview updates as you type, so you can shorten overlong titles or descriptions before they look cramped in search.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-lime-500/10 text-lime-600 dark:text-lime-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Watch the length indicators instead of guessing</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Green generally means your snippet is in a safe range. Amber means you are close to truncation. Red means the text is likely too long and should be tightened.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-lime-500/10 text-lime-600 dark:text-lime-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Copy the final markup into your page head</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Once the snippet looks right, copy the generated <code>&lt;title&gt;</code>, description meta tag, and canonical link. Then paste them into your page template, CMS SEO field, or head component.
                    </p>
                  </div>
                </li>
              </ol>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Snippet Rules and Interpretation</h2>
              <p className="text-muted-foreground text-sm mb-6">Use these guidelines to decide whether the preview is publish-ready.</p>

              <div className="space-y-4">
                <div className="p-5 rounded-xl border border-lime-500/20 bg-lime-500/5">
                  <p className="font-bold text-foreground mb-2">Title tags should be tight, specific, and front-loaded</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Put the main keyword and page promise near the beginning. If the title trails off into the brand name or filler phrase, Google may trim the part you actually wanted users to see.
                  </p>
                </div>
                <div className="p-5 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
                  <p className="font-bold text-foreground mb-2">Descriptions are click copy, not ranking magic</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Meta descriptions do not guarantee rankings, but they still influence click-through rate. A strong description should clearly state what the page offers and why the searcher should choose it.
                  </p>
                </div>
                <div className="p-5 rounded-xl border border-cyan-500/20 bg-cyan-500/5">
                  <p className="font-bold text-foreground mb-2">The display URL should still look trustworthy and readable</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Users scan the domain and path fast. Short, descriptive slugs read better than long parameter-heavy URLs, even when Google rewrites parts of the display line.
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Quick Examples</h2>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/60">
                      <th className="text-left px-4 py-3 font-bold text-foreground">Page Type</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Title Direction</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground hidden md:table-cell">Description Direction</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="px-4 py-3 text-foreground font-medium">Blog article</td>
                      <td className="px-4 py-3 text-muted-foreground">Lead with topic + practical outcome</td>
                      <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">Explain the takeaway in one sentence and invite the click</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-foreground font-medium">Product page</td>
                      <td className="px-4 py-3 text-muted-foreground">Product name + differentiator</td>
                      <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">Summarize benefits, specs, or shipping promise</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-foreground font-medium">Local service page</td>
                      <td className="px-4 py-3 text-muted-foreground">Service + city or region</td>
                      <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">Mention coverage area, trust signal, or booking action</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Why Use This SERP Preview Tool?</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p>
                  <strong className="text-foreground">It removes guesswork before you publish.</strong> Most SEO title and description mistakes are basic length or clarity issues. Seeing the preview before the page goes live catches those problems early.
                </p>
                <p>
                  <strong className="text-foreground">It works entirely in your browser.</strong> You can test client metadata, internal drafts, or unreleased pages without sending the copy anywhere else.
                </p>
                <p>
                  <strong className="text-foreground">It also gives you the ready-to-paste markup.</strong> That makes it useful both as a preview tool and as a lightweight metadata builder for static pages, CMS templates, or head components.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem
                  q="Does Google always show my exact title and description?"
                  a="No. Google may rewrite titles or descriptions based on the query, the device, or the page content. This preview is still useful because it helps you optimize the source metadata you control."
                />
                <FaqItem
                  q="What title length should I target?"
                  a="There is no fixed universal cutoff, but keeping the title around 50 to 60 characters is usually a safe working range for many English-language snippets."
                />
                <FaqItem
                  q="What meta description length should I target?"
                  a="A practical target is roughly 120 to 155 characters. Some results show more or less, but that range usually keeps the message readable without heavy truncation."
                />
                <FaqItem
                  q="Should I include my brand name in the title?"
                  a="Usually yes, but only if the title still fits. Put the core keyword and page promise first, then add the brand at the end if there is room."
                />
                <FaqItem
                  q="Does the canonical URL affect the snippet?"
                  a="Not directly like the title or description, but it helps search engines understand which URL version should be treated as the main page."
                />
                <FaqItem
                  q="Can I use this for pages that are not indexed yet?"
                  a="Yes. It is a drafting tool, so it works well for staging pages, content plans, and pages that have not been crawled yet."
                />
              </div>
            </section>

            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-lime-500 to-emerald-400 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Build the Rest of the Snippet Stack</h2>
                <p className="text-white/85 mb-6 max-w-xl">
                  After the SERP preview looks right, generate the matching Open Graph and Twitter Card tags so the same page also looks clean when shared on social platforms.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/seo/open-graph-generator" className="inline-flex items-center gap-2 rounded-xl bg-white text-emerald-700 px-5 py-3 font-bold">
                    Open Graph Generator
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link href="/seo/twitter-card-generator" className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-5 py-3 font-bold text-white">
                    Twitter Card Generator
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section className="bg-card border border-border rounded-2xl p-5">
              <h3 className="text-sm font-black uppercase tracking-widest text-foreground mb-4">Quick Checklist</h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex gap-3">
                  <Type className="w-4 h-4 text-lime-500 mt-0.5 flex-shrink-0" />
                  <span>Keep the title focused and usually under about 60 characters.</span>
                </div>
                <div className="flex gap-3">
                  <FileText className="w-4 h-4 text-lime-500 mt-0.5 flex-shrink-0" />
                  <span>Write a description that explains the page and earns the click.</span>
                </div>
                <div className="flex gap-3">
                  <Link2 className="w-4 h-4 text-lime-500 mt-0.5 flex-shrink-0" />
                  <span>Use the final canonical URL, not a temporary or tracking URL.</span>
                </div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-5">
              <h3 className="text-sm font-black uppercase tracking-widest text-foreground mb-4">Related Tools</h3>
              <div className="space-y-3">
                {RELATED_TOOLS.map((tool) => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className="flex items-start gap-3 p-3 rounded-xl border border-border hover:border-lime-500/40 hover:bg-lime-500/5 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-lg bg-lime-500/10 text-lime-600 dark:text-lime-400 flex items-center justify-center flex-shrink-0">
                      {tool.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-foreground text-sm">{tool.title}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{tool.benefit}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-5">
              <h3 className="text-sm font-black uppercase tracking-widest text-foreground mb-4">Share This Tool</h3>
              <button
                onClick={copyPageLink}
                className={`w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-bold text-sm transition-colors ${
                  linkCopied ? "bg-emerald-500 text-white" : "bg-lime-500 text-zinc-950 hover:bg-lime-400"
                }`}
              >
                {linkCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {linkCopied ? "Copied Link" : "Copy Page Link"}
              </button>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
}
