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
  Globe,
  Image as ImageIcon,
  Link2,
  Share2,
  Shield,
  Smartphone,
  Sparkles,
  Tags,
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

function escapeAttribute(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

const RELATED_TOOLS = [
  {
    title: "Google SERP Preview",
    href: "/seo/serp-preview-tool",
    benefit: "Check title and description presentation in search results.",
    icon: <Globe className="w-4 h-4" />,
  },
  {
    title: "Twitter Card Generator",
    href: "/seo/twitter-card-generator",
    benefit: "Generate matching X card tags for the same page.",
    icon: <Share2 className="w-4 h-4" />,
  },
  {
    title: "Meta Tag Generator",
    href: "/seo/meta-tag-generator",
    benefit: "Create base title and meta description markup.",
    icon: <Tags className="w-4 h-4" />,
  },
  {
    title: "Schema Markup Generator",
    href: "/seo/schema-markup-generator",
    benefit: "Add structured data after your sharing tags are ready.",
    icon: <Sparkles className="w-4 h-4" />,
  },
];

export default function OpenGraphGenerator() {
  const [ogTitle, setOgTitle] = useState("Open Graph Tag Generator | Free Social Preview Builder");
  const [ogDescription, setOgDescription] = useState(
    "Generate Open Graph tags for Facebook, LinkedIn, and other social previews with clean, copyable markup."
  );
  const [ogImage, setOgImage] = useState("https://usonlinetools.com/og-preview.jpg");
  const [ogUrl, setOgUrl] = useState("https://usonlinetools.com/seo/open-graph-generator");
  const [siteName, setSiteName] = useState("US Online Tools");
  const [ogType, setOgType] = useState("website");
  const [ogLocale, setOgLocale] = useState("en_US");
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const generatedCode = useMemo(() => {
    const lines = [
      `<meta property="og:title" content="${escapeAttribute(ogTitle.trim())}">`,
      `<meta property="og:description" content="${escapeAttribute(ogDescription.trim())}">`,
      `<meta property="og:type" content="${escapeAttribute(ogType)}">`,
      `<meta property="og:url" content="${escapeAttribute(ogUrl.trim())}">`,
      `<meta property="og:site_name" content="${escapeAttribute(siteName.trim())}">`,
      `<meta property="og:locale" content="${escapeAttribute(ogLocale)}">`,
    ];

    if (ogImage.trim()) {
      lines.push(`<meta property="og:image" content="${escapeAttribute(ogImage.trim())}">`);
    }

    return lines.join("\n");
  }, [ogDescription, ogImage, ogLocale, ogTitle, ogType, ogUrl, siteName]);

  const copyCode = () => {
    navigator.clipboard.writeText(generatedCode);
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
        title="Open Graph Tag Generator - Create OG Meta Tags | US Online Tools"
        description="Free Open Graph tag generator. Create Facebook and LinkedIn sharing tags instantly with browser-based preview and copyable code."
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
          <span className="text-foreground">Open Graph Tag Generator</span>
        </nav>

        <section className="rounded-2xl overflow-hidden border border-lime-500/15 bg-gradient-to-br from-lime-500/5 via-card to-green-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-lime-500/10 text-lime-600 dark:text-lime-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Share2 className="w-3.5 h-3.5" />
            SEO Tools
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">
            Open Graph Tag Generator
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Generate the Open Graph markup that controls how your page looks when someone shares it on Facebook, LinkedIn, Slack, Discord, and other platforms that read OG tags.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20">
              <BadgeCheck className="w-3.5 h-3.5" />
              100% Free
            </span>
            <span className="inline-flex items-center gap-1.5 bg-lime-500/10 text-lime-600 dark:text-lime-400 font-bold text-xs px-3 py-1.5 rounded-full border border-lime-500/20">
              <Zap className="w-3.5 h-3.5" />
              Instant Code
            </span>
            <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs px-3 py-1.5 rounded-full border border-cyan-500/20">
              <Smartphone className="w-3.5 h-3.5" />
              Share Preview Focused
            </span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20">
              <Shield className="w-3.5 h-3.5" />
              Browser-Based
            </span>
          </div>
          <p className="text-xs text-muted-foreground/70 font-medium">
            Best for homepage shares, article links, campaign landing pages, and product URLs
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">
            <section>
              <div className="rounded-2xl overflow-hidden border border-lime-500/20 shadow-lg shadow-lime-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-lime-500 to-green-400" />
                <div className="bg-card p-6 md:p-8 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-lime-500 to-green-400 flex items-center justify-center flex-shrink-0">
                      <Share2 className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Open Graph Builder</p>
                      <p className="text-sm text-muted-foreground">Fill in the core OG fields and copy ready-to-paste markup.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-6">
                    <div className="space-y-5">
                      <div>
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">OG Title</label>
                        <input type="text" value={ogTitle} onChange={(event) => setOgTitle(event.target.value)} className="tool-calc-input w-full" />
                      </div>
                      <div>
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">OG Description</label>
                        <textarea
                          value={ogDescription}
                          onChange={(event) => setOgDescription(event.target.value)}
                          className="tool-calc-input w-full min-h-[120px] resize-y"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">Page URL</label>
                          <input type="text" value={ogUrl} onChange={(event) => setOgUrl(event.target.value)} className="tool-calc-input w-full" />
                        </div>
                        <div>
                          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">OG Image URL</label>
                          <input type="text" value={ogImage} onChange={(event) => setOgImage(event.target.value)} className="tool-calc-input w-full" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        <div>
                          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">Site Name</label>
                          <input type="text" value={siteName} onChange={(event) => setSiteName(event.target.value)} className="tool-calc-input w-full" />
                        </div>
                        <div>
                          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">OG Type</label>
                          <select value={ogType} onChange={(event) => setOgType(event.target.value)} className="tool-calc-input w-full">
                            <option value="website">website</option>
                            <option value="article">article</option>
                            <option value="product">product</option>
                            <option value="profile">profile</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">Locale</label>
                          <select value={ogLocale} onChange={(event) => setOgLocale(event.target.value)} className="tool-calc-input w-full">
                            <option value="en_US">en_US</option>
                            <option value="en_GB">en_GB</option>
                            <option value="ar_QA">ar_QA</option>
                            <option value="fr_FR">fr_FR</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="rounded-2xl border border-border bg-background overflow-hidden">
                        <div className="aspect-[1.91/1] bg-muted/40 flex items-center justify-center border-b border-border">
                          {ogImage.trim() ? (
                            <div className="w-full h-full flex items-center justify-center px-4 text-center text-sm text-muted-foreground">
                              <div>
                                <ImageIcon className="w-8 h-8 mx-auto mb-2 text-lime-500" />
                                <p className="break-all">{ogImage}</p>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center text-muted-foreground">
                              <ImageIcon className="w-8 h-8 mx-auto mb-2" />
                              <p className="text-sm">OG image preview area</p>
                            </div>
                          )}
                        </div>
                        <div className="p-4 space-y-2">
                          <p className="text-xs uppercase tracking-wide text-muted-foreground">{siteName || "Site Name"}</p>
                          <p className="text-lg font-bold text-foreground leading-snug">{ogTitle || "Open Graph title preview"}</p>
                          <p className="text-sm text-muted-foreground leading-relaxed">{ogDescription || "Open Graph description preview."}</p>
                          <p className="text-xs text-muted-foreground break-all">{ogUrl || "https://example.com/page"}</p>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-border bg-zinc-950 text-lime-400 p-4">
                        <div className="flex items-center justify-between gap-3 mb-3">
                          <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Generated OG Code</p>
                          <button
                            onClick={copyCode}
                            className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
                              copied ? "bg-emerald-500 text-white" : "bg-lime-500 text-zinc-950 hover:bg-lime-400"
                            }`}
                          >
                            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            {copied ? "Copied" : "Copy"}
                          </button>
                        </div>
                        <textarea readOnly value={generatedCode} className="w-full h-52 bg-transparent text-sm font-mono resize-none outline-none" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Use the Open Graph Generator</h2>
              <ol className="space-y-5">
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-lime-500/10 text-lime-600 dark:text-lime-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Enter the title, description, URL, and image you want social platforms to read</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      These are the fields most platforms look for first when building a rich preview card from your page.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-lime-500/10 text-lime-600 dark:text-lime-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Check the card preview and make sure the copy still reads cleanly</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      The preview is a planning aid, not a perfect clone of every platform. It helps you spot obvious issues before you paste the tags into production.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-lime-500/10 text-lime-600 dark:text-lime-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Copy the code block into the page head</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Add the generated tags to the same page that owns the URL. After deployment, use platform debuggers to refresh the cache if the old preview still appears.
                    </p>
                  </div>
                </li>
              </ol>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Tag Guide and Output Notes</h2>
              <p className="text-muted-foreground text-sm mb-6">These are the fields that matter most in a basic Open Graph implementation.</p>

              <div className="space-y-4">
                <div className="p-5 rounded-xl border border-lime-500/20 bg-lime-500/5">
                  <p className="font-bold text-foreground mb-2">`og:title` and `og:description` control the message</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Keep them concise and specific. The OG title does not need to exactly match the SEO title, but it should still represent the same page promise.
                  </p>
                </div>
                <div className="p-5 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
                  <p className="font-bold text-foreground mb-2">`og:image` is often the most important visual element</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Use a stable absolute image URL. If the image is missing, many platforms fall back to a poor preview or no image card at all.
                  </p>
                </div>
                <div className="p-5 rounded-xl border border-cyan-500/20 bg-cyan-500/5">
                  <p className="font-bold text-foreground mb-2">`og:url` should match the final canonical page version</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Avoid temporary URLs, preview links, or tracking variants. Sharing tags are more reliable when the URL is the same one you want indexed and shared.
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Quick Examples</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p>
                  <strong className="text-foreground">Homepage share:</strong> Use `website` with a broad value proposition, brand name, and a clean hero image that represents the product or company.
                </p>
                <p>
                  <strong className="text-foreground">Article share:</strong> Use `article` with the article headline, summary, and a featured image that matches the content and still reads well in social feeds.
                </p>
                <p>
                  <strong className="text-foreground">Campaign landing page:</strong> Keep the description sharper and more action-oriented than a normal SEO description because the share context often behaves more like an ad impression.
                </p>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Why Use This Open Graph Generator?</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p>
                  <strong className="text-foreground">It gives you the critical tags without extra noise.</strong> Most sites only need the core Open Graph fields to dramatically improve their social previews.
                </p>
                <p>
                  <strong className="text-foreground">It keeps the workflow local and fast.</strong> You can prepare sharing tags for client work, unpublished content, or internal QA without pushing the text through another service.
                </p>
                <p>
                  <strong className="text-foreground">It fits naturally with the rest of your metadata stack.</strong> Pair it with your meta description, canonical tag, and Twitter Card tags so the same page looks consistent across search and social.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem
                  q="Do Open Graph tags affect Google rankings?"
                  a="Not directly in the same way title tags and page content do. Open Graph tags are mainly for social sharing previews, but they still improve how your links are presented when people share them."
                />
                <FaqItem
                  q="Should my Open Graph title match my SEO title exactly?"
                  a="It can, but it does not have to. Many teams keep them similar while writing a slightly more social-friendly version for the OG title."
                />
                <FaqItem
                  q="Do I need an absolute image URL?"
                  a="Yes. Relative paths often fail in scrapers. Use the full URL so social platforms can fetch the image reliably."
                />
                <FaqItem
                  q="Why does the old preview still show after I update the tags?"
                  a="Platforms cache previews. After deploying changes, use the relevant debugger or card validator to force a refresh."
                />
                <FaqItem
                  q="What OG type should I use?"
                  a="Use `website` for general pages, `article` for posts or news content, and a more specific type only if your implementation actually needs it."
                />
                <FaqItem
                  q="Can I use this together with Twitter Card tags?"
                  a="Yes. Many sites publish both. Twitter can read Open Graph tags as a fallback, but dedicated Twitter Card tags give you more control on X."
                />
              </div>
            </section>

            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-lime-500 to-green-400 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Need Matching X Card Tags Too?</h2>
                <p className="text-white/85 mb-6 max-w-xl">
                  Generate the companion Twitter Card markup so the same page keeps a consistent preview when it is shared on X.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/seo/twitter-card-generator" className="inline-flex items-center gap-2 rounded-xl bg-white text-green-700 px-5 py-3 font-bold">
                    Open Twitter Card Generator
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section className="bg-card border border-border rounded-2xl p-5">
              <h3 className="text-sm font-black uppercase tracking-widest text-foreground mb-4">Required OG Fields</h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex gap-3">
                  <Share2 className="w-4 h-4 text-lime-500 mt-0.5 flex-shrink-0" />
                  <span>`og:title` and `og:description` for the message.</span>
                </div>
                <div className="flex gap-3">
                  <Link2 className="w-4 h-4 text-lime-500 mt-0.5 flex-shrink-0" />
                  <span>`og:url` for the final page location.</span>
                </div>
                <div className="flex gap-3">
                  <ImageIcon className="w-4 h-4 text-lime-500 mt-0.5 flex-shrink-0" />
                  <span>`og:image` for a strong visual card preview.</span>
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
