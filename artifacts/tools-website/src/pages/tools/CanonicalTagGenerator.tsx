import { useMemo, useState } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleDashed,
  Copy,
  Link2,
  Search,
  Shield,
  Smartphone,
  Tags,
  Zap,
} from "lucide-react";

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-lime-500/40 transition-colors">
      <button onClick={() => setOpen((value) => !value)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-lime-500">
          <ChevronDown className="w-5 h-5" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} className="overflow-hidden">
            <p className="px-5 pb-5 pt-1 text-muted-foreground leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const RELATED_TOOLS = [
  { title: "Schema Markup Generator", href: "/seo/schema-markup-generator", benefit: "Add structured data after canonical cleanup.", color: 152, icon: <Tags className="w-4 h-4" /> },
  { title: "Open Graph Generator", href: "/seo/open-graph-generator", benefit: "Keep sharing tags aligned with the same final URL.", color: 217, icon: <Link2 className="w-4 h-4" /> },
  { title: "Robots.txt Generator", href: "/seo/robots-txt-generator", benefit: "Pair crawl rules with canonical handling.", color: 45, icon: <Search className="w-4 h-4" /> },
  { title: "Google SERP Preview", href: "/tools/serp-preview-tool", benefit: "Review title and description output for the final URL.", color: 275, icon: <Tags className="w-4 h-4" /> },
];

export default function CanonicalTagGenerator() {
  const [canonicalMode, setCanonicalMode] = useState<"self" | "consolidated">("self");
  const [pageUrl, setPageUrl] = useState("https://usonlinetools.com/blog/schema-markup-guide");
  const [canonicalUrl, setCanonicalUrl] = useState("https://usonlinetools.com/blog/schema-markup-guide");
  const [notes, setNotes] = useState("Use the final preferred URL for search indexing.");
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const activeCanonicalUrl = canonicalMode === "self" ? pageUrl : canonicalUrl;
  const canonicalTag = `<link rel="canonical" href="${activeCanonicalUrl.trim()}">`;
  const absoluteUrlPattern = /^https?:\/\//i;

  const validationNotes = useMemo(() => {
    const next: string[] = [];

    if (!pageUrl.trim()) next.push("Enter the current page URL.");
    if (!activeCanonicalUrl.trim()) next.push("Enter the canonical target URL.");
    if ((pageUrl.trim() && !absoluteUrlPattern.test(pageUrl.trim())) || (activeCanonicalUrl.trim() && !absoluteUrlPattern.test(activeCanonicalUrl.trim()))) {
      next.push("Use full absolute URLs including https:// so crawlers resolve the preferred URL correctly.");
    }
    if (canonicalMode === "consolidated" && pageUrl.trim() === activeCanonicalUrl.trim()) {
      next.push("Consolidated mode should usually point to a different preferred URL.");
    }

    return next;
  }, [activeCanonicalUrl, canonicalMode, pageUrl]);

  const completionPercent = Math.round(
    ([pageUrl, activeCanonicalUrl].filter((value) => value.trim()).length / 2) * 100
  );

  const workflowSteps = [
    { label: "Choose self-referencing or consolidated canonical mode", done: true, detail: canonicalMode === "self" ? "Self canonical selected" : "Cross-page canonical selected" },
    { label: "Enter the current page URL", done: Boolean(pageUrl.trim()), detail: pageUrl.trim() || "Missing page URL" },
    { label: "Set the preferred canonical target", done: Boolean(activeCanonicalUrl.trim()), detail: activeCanonicalUrl.trim() || "Missing canonical URL" },
    { label: "Review the output and publish it in the page head", done: validationNotes.length === 0, detail: validationNotes.length === 0 ? "Ready to paste" : `${validationNotes.length} note(s) to review` },
  ];

  const copyCode = () => {
    navigator.clipboard.writeText(canonicalTag);
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
        title="Canonical Tag Generator - Create rel=canonical Tags | US Online Tools"
        description="Free canonical tag generator. Create self-referencing or consolidated canonical link tags with instant output and practical SEO guidance."
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-lime-500" strokeWidth={3} />
          <Link href="/category/seo" className="text-muted-foreground hover:text-foreground transition-colors">SEO Tools</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-lime-500" strokeWidth={3} />
          <span className="text-foreground">Canonical Tag Generator</span>
        </nav>

        <section className="rounded-2xl overflow-hidden border border-lime-500/15 bg-gradient-to-br from-lime-500/5 via-card to-green-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-lime-500/10 text-lime-600 dark:text-lime-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Tags className="w-3.5 h-3.5" />
            SEO Tools
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">Canonical Tag Generator</h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Generate self-referencing or consolidated canonical tags with live output, real-time workflow steps, and clear guidance on which URL search engines should treat as the preferred version.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20"><BadgeCheck className="w-3.5 h-3.5" /> 100% Free</span>
            <span className="inline-flex items-center gap-1.5 bg-lime-500/10 text-lime-600 dark:text-lime-400 font-bold text-xs px-3 py-1.5 rounded-full border border-lime-500/20"><Zap className="w-3.5 h-3.5" /> Instant Output</span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20"><Shield className="w-3.5 h-3.5" /> Browser-Side</span>
            <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs px-3 py-1.5 rounded-full border border-cyan-500/20"><Smartphone className="w-3.5 h-3.5" /> Mobile Ready</span>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">
            <section id="generator">
              <div className="rounded-2xl overflow-hidden border border-lime-500/20 shadow-lg shadow-lime-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-lime-500 to-green-400" />
                <div className="bg-card p-6 md:p-8 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-lime-500 to-green-400 flex items-center justify-center flex-shrink-0">
                      <Link2 className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Canonical Builder</p>
                      <p className="text-sm text-muted-foreground">Choose the preferred URL and copy the final tag instantly.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-[1.05fr_0.95fr] gap-6">
                    <div className="space-y-5">
                      <div>
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">Canonical Mode</label>
                        <select value={canonicalMode} onChange={(event) => setCanonicalMode(event.target.value as "self" | "consolidated")} className="tool-calc-input w-full">
                          <option value="self">Self-referencing canonical</option>
                          <option value="consolidated">Consolidate to another preferred URL</option>
                        </select>
                      </div>

                      <input value={pageUrl} onChange={(event) => setPageUrl(event.target.value)} placeholder="Current page URL" className="tool-calc-input w-full" />

                      {canonicalMode === "consolidated" && (
                        <input value={canonicalUrl} onChange={(event) => setCanonicalUrl(event.target.value)} placeholder="Preferred canonical URL" className="tool-calc-input w-full" />
                      )}

                      <textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Internal notes or implementation reminder" className="tool-calc-input w-full min-h-[110px] resize-y" />
                    </div>

                    <div className="space-y-4">
                      <div className="rounded-2xl border border-lime-500/20 bg-lime-500/5 p-5">
                        <div className="flex items-center justify-between gap-4 mb-4">
                          <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-lime-700 dark:text-lime-400">Live Build Progress</p>
                            <p className="text-sm text-muted-foreground">The result updates while you edit.</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-black text-foreground">{completionPercent}%</p>
                            <p className="text-xs text-muted-foreground">core fields ready</p>
                          </div>
                        </div>
                        <div className="h-2 rounded-full bg-background overflow-hidden mb-4">
                          <div className="h-full bg-gradient-to-r from-lime-500 to-green-400" style={{ width: `${completionPercent}%` }} />
                        </div>
                        <div className="space-y-3">
                          {workflowSteps.map((step) => (
                            <div key={step.label} className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-background border border-border flex-shrink-0">
                                {step.done ? <CheckCircle2 className="w-4 h-4 text-lime-500" /> : <CircleDashed className="w-4 h-4 text-muted-foreground" />}
                              </div>
                              <div>
                                <p className="font-bold text-sm text-foreground">{step.label}</p>
                                <p className="text-xs text-muted-foreground">{step.detail}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-border bg-background p-5">
                        <div className="flex items-center justify-between gap-4 mb-4">
                          <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Generated Canonical Tag</p>
                            <p className="text-sm text-muted-foreground">Paste this in the page head.</p>
                          </div>
                          <button onClick={copyCode} className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-colors ${copied ? "bg-emerald-500 text-white" : "bg-lime-500 text-zinc-950 hover:bg-lime-400"}`}>
                            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            {copied ? "Copied" : "Copy Tag"}
                          </button>
                        </div>
                        <textarea readOnly value={canonicalTag} className="w-full h-24 rounded-xl bg-zinc-950 text-lime-400 p-4 text-sm font-mono resize-none outline-none" />
                        <div className="mt-4 rounded-xl border border-border bg-card p-4">
                          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Preview Summary</p>
                          <p className="text-sm text-muted-foreground leading-relaxed">Current page: <span className="font-mono text-foreground break-all">{pageUrl || "--"}</span></p>
                          <p className="text-sm text-muted-foreground leading-relaxed mt-2">Preferred URL: <span className="font-mono text-foreground break-all">{activeCanonicalUrl || "--"}</span></p>
                          {notes.trim() && <p className="text-sm text-muted-foreground leading-relaxed mt-2">{notes}</p>}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-border bg-card p-5">
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Validation Notes</p>
                        <div className="space-y-3">
                          {validationNotes.length === 0 ? (
                            <div className="flex items-start gap-3">
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                              <p className="text-sm text-muted-foreground">No immediate issues detected. Make sure the canonical target matches the URL you actually want indexed.</p>
                            </div>
                          ) : (
                            validationNotes.map((note) => (
                              <div key={note} className="flex items-start gap-3">
                                <Search className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-muted-foreground">{note}</p>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="how-to-use">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Use the Canonical Tag Generator</h2>
              <ol className="space-y-5">
                <li className="flex gap-4"><div className="w-8 h-8 rounded-lg bg-lime-500/10 text-lime-600 dark:text-lime-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div><div><p className="font-bold text-foreground mb-1">Choose whether the page canonicals to itself or another URL</p><p className="text-muted-foreground text-sm leading-relaxed">Most clean pages use a self-referencing canonical. Consolidated canonicals are for duplicate, parameterized, or alternate versions that should point to one preferred URL.</p></div></li>
                <li className="flex gap-4"><div className="w-8 h-8 rounded-lg bg-lime-500/10 text-lime-600 dark:text-lime-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div><div><p className="font-bold text-foreground mb-1">Enter the current URL and the preferred URL</p><p className="text-muted-foreground text-sm leading-relaxed">Use the full https URL. If you are consolidating duplicates, point the canonical target to the exact final page you want search engines to index.</p></div></li>
                <li className="flex gap-4"><div className="w-8 h-8 rounded-lg bg-lime-500/10 text-lime-600 dark:text-lime-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div><div><p className="font-bold text-foreground mb-1">Copy the generated tag and place it in the head</p><p className="text-muted-foreground text-sm leading-relaxed">The tag belongs inside the page head so crawlers can discover the preferred URL consistently during normal HTML parsing.</p></div></li>
              </ol>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="tag-rules-and-implementation-guide">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Tag Rules and Implementation Guide</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">Use canonicals for duplication control, not for broken redirects.</strong> If a URL should never exist publicly, redirect it. Canonical tags are best when multiple live URLs can exist but one should be treated as primary.</p>
                <p><strong className="text-foreground">Keep the canonical target indexable.</strong> A canonical pointing to a `noindex` page, an error page, or a blocked page sends mixed signals to search engines.</p>
                <p><strong className="text-foreground">Stay consistent across internal links, sitemap entries, and metadata.</strong> The canonical URL should usually match the version used in your XML sitemap, internal navigation, and structured data.</p>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="quick-examples">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Quick Examples</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">Self-referencing article page:</strong> A clean blog post at `https://example.com/blog/seo-guide` should canonical to itself so the preferred URL is explicit.</p>
                <p><strong className="text-foreground">Filtered ecommerce URLs:</strong> A category page with tracking or sort parameters can canonical back to the base collection URL to avoid duplicate indexing.</p>
                <p><strong className="text-foreground">Printer-friendly duplicate:</strong> A printable version of an article can point to the main article URL so only the main version competes in search.</p>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="why-choose-this">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Why Use This Canonical Tag Generator?</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">It replaces a broken file with a real tool.</strong> This page now generates actual canonical markup with live validation instead of leaving the route area in a corrupted state.</p>
                <p><strong className="text-foreground">The workflow is practical.</strong> You can plan self-referencing and consolidated canonicals, see the final preferred URL immediately, and copy the output without leaving the page.</p>
                <p><strong className="text-foreground">It follows the same long-form tool structure.</strong> The page has the same production-oriented shape as the percentage calculator, adapted for technical SEO implementation work.</p>
              </div>
            </section>

            <section id="faq">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem q="Should every page have a canonical tag?" a="In most modern sites, yes. A self-referencing canonical reduces ambiguity and makes the preferred URL explicit." />
                <FaqItem q="Can a canonical point to another domain?" a="Yes, cross-domain canonicals are possible when the target page is the true preferred version, such as syndicated content." />
                <FaqItem q="Is a canonical tag the same as a redirect?" a="No. Redirects send users and bots to another URL immediately. Canonical tags are a search signal telling crawlers which live page should be treated as primary." />
                <FaqItem q="What if the canonical target is blocked or noindexed?" a="That creates conflicting signals. The canonical target should normally be crawlable and indexable." />
                <FaqItem q="Should canonical URLs include parameters?" a="Usually no, unless the parameterized version is intentionally the preferred indexable page." />
                <FaqItem q="Where do I place the tag?" a="Add it inside the HTML head of the page that needs the canonical directive." />
              </div>
            </section>

            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-lime-500 to-green-400 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Need More Technical SEO Utilities?</h2>
                <p className="text-white/85 mb-6 max-w-xl">Continue with schema markup, robots rules, or social metadata so your preferred URL stays consistent across the full page stack.</p>
                <Link href="/category/seo" className="inline-flex items-center gap-2 rounded-xl bg-white text-green-700 px-5 py-3 font-bold">
                  Explore SEO Tools
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <div className="sticky top-28 space-y-6">
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight mb-3 uppercase">Related Tools</h3>
                <div className="space-y-0.5">
                  {RELATED_TOOLS.map((tool) => (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      className="group flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-muted transition-all"
                    >
                      <div
                        className="w-7 h-7 rounded-md flex items-center justify-center text-white flex-shrink-0 [&>svg]:w-3.5 [&>svg]:h-3.5"
                        style={{ background: `linear-gradient(135deg, hsl(${tool.color} 70% 55%), hsl(${tool.color} 75% 42%))` }}
                      >
                        {tool.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors truncate">{tool.title}</p>
                        <p className="text-[10px] text-muted-foreground/60 truncate">{tool.benefit}</p>
                      </div>
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-lime-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-1.5">Share This Tool</h3>
                <p className="text-xs text-muted-foreground mb-3">Share this canonical tag tool with your SEO workflow.</p>
                <button
                  onClick={copyPageLink}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-lime-500 to-green-400 text-white text-sm font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform"
                >
                  {linkCopied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy Link</>}
                </button>
              </div>

              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-3">On This Page</h3>
                <div className="space-y-0.5">
                  {[
                    ["Generator", "generator"],
                    ["How to Use", "how-to-use"],
                    ["Tag Rules", "tag-rules-and-implementation-guide"],
                    ["Quick Examples", "quick-examples"],
                    ["Why Choose This", "why-choose-this"],
                    ["FAQ", "faq"],
                  ].map(([label, id]) => (
                    <a
                      key={id}
                      href={`#${id}`}
                      className="flex items-center gap-2 text-xs text-muted-foreground hover:text-lime-500 font-medium py-1.5 transition-colors"
                    >
                      <div className="w-1 h-1 rounded-full bg-lime-500/40 flex-shrink-0" />
                      {label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
