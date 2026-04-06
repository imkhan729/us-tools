import { useMemo, useState } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  AtSign,
  BadgeCheck,
  Check,
  ChevronDown,
  ChevronRight,
  Copy,
  Image as ImageIcon,
  Link2,
  Shield,
  Smartphone,
  Sparkles,
  Twitter,
  Zap,
} from "lucide-react";

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-sky-500/40 transition-colors">
      <button
        onClick={() => setOpen((value) => !value)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left"
      >
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 text-sky-500"
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
    title: "Open Graph Tag Generator",
    href: "/seo/open-graph-generator",
    benefit: "Create the companion OG tags for other social platforms.",
    icon: <Sparkles className="w-4 h-4" />,
  },
  {
    title: "Google SERP Preview",
    href: "/seo/serp-preview-tool",
    benefit: "Keep the search snippet aligned with the social preview.",
    icon: <Link2 className="w-4 h-4" />,
  },
  {
    title: "Meta Tag Generator",
    href: "/seo/meta-tag-generator",
    benefit: "Generate the core metadata before the social tags.",
    icon: <AtSign className="w-4 h-4" />,
  },
];

export default function TwitterCardGenerator() {
  const [cardType, setCardType] = useState("summary_large_image");
  const [title, setTitle] = useState("Twitter Card Generator | Create X Preview Tags");
  const [description, setDescription] = useState(
    "Generate Twitter Card tags for X with title, description, image, URL, and account handles."
  );
  const [imageUrl, setImageUrl] = useState("https://usonlinetools.com/twitter-card-preview.jpg");
  const [pageUrl, setPageUrl] = useState("https://usonlinetools.com/seo/twitter-card-generator");
  const [siteHandle, setSiteHandle] = useState("@usonlinetools");
  const [creatorHandle, setCreatorHandle] = useState("@usonlinetools");
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const generatedCode = useMemo(() => {
    const lines = [
      `<meta name="twitter:card" content="${escapeAttribute(cardType)}">`,
      `<meta name="twitter:title" content="${escapeAttribute(title.trim())}">`,
      `<meta name="twitter:description" content="${escapeAttribute(description.trim())}">`,
      `<meta name="twitter:url" content="${escapeAttribute(pageUrl.trim())}">`,
    ];

    if (imageUrl.trim()) {
      lines.push(`<meta name="twitter:image" content="${escapeAttribute(imageUrl.trim())}">`);
    }
    if (siteHandle.trim()) {
      lines.push(`<meta name="twitter:site" content="${escapeAttribute(siteHandle.trim())}">`);
    }
    if (creatorHandle.trim()) {
      lines.push(`<meta name="twitter:creator" content="${escapeAttribute(creatorHandle.trim())}">`);
    }

    return lines.join("\n");
  }, [cardType, creatorHandle, description, imageUrl, pageUrl, siteHandle, title]);

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
        title="Twitter Card Generator - Create X Meta Tags | US Online Tools"
        description="Free Twitter Card generator. Create X card tags with title, description, image, and profile handles. Includes live preview and copyable markup."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight className="w-4 h-4 mx-2 text-sky-500" strokeWidth={3} />
          <Link href="/category/seo" className="text-muted-foreground hover:text-foreground transition-colors">
            SEO Tools
          </Link>
          <ChevronRight className="w-4 h-4 mx-2 text-sky-500" strokeWidth={3} />
          <span className="text-foreground">Twitter Card Generator</span>
        </nav>

        <section className="rounded-2xl overflow-hidden border border-sky-500/15 bg-gradient-to-br from-sky-500/5 via-card to-blue-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-sky-500/10 text-sky-600 dark:text-sky-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Twitter className="w-3.5 h-3.5" />
            SEO Tools
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">
            Twitter Card Generator
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Generate X card markup so your links look controlled and deliberate when shared on Twitter/X. Choose the card type, handles, and image fields, then copy the tags directly into your page head.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20">
              <BadgeCheck className="w-3.5 h-3.5" />
              100% Free
            </span>
            <span className="inline-flex items-center gap-1.5 bg-sky-500/10 text-sky-600 dark:text-sky-400 font-bold text-xs px-3 py-1.5 rounded-full border border-sky-500/20">
              <Zap className="w-3.5 h-3.5" />
              Instant Output
            </span>
            <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs px-3 py-1.5 rounded-full border border-cyan-500/20">
              <Smartphone className="w-3.5 h-3.5" />
              Feed Preview Ready
            </span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20">
              <Shield className="w-3.5 h-3.5" />
              Browser-Based
            </span>
          </div>
          <p className="text-xs text-muted-foreground/70 font-medium">
            Works best for article links, product pages, campaign URLs, and creator content shares
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">
            <section>
              <div className="rounded-2xl overflow-hidden border border-sky-500/20 shadow-lg shadow-sky-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-sky-500 to-blue-400" />
                <div className="bg-card p-6 md:p-8 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-blue-400 flex items-center justify-center flex-shrink-0">
                      <Twitter className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">X Card Builder</p>
                      <p className="text-sm text-muted-foreground">Choose a card type and generate the complete tag set.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-6">
                    <div className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">Card Type</label>
                          <select value={cardType} onChange={(event) => setCardType(event.target.value)} className="tool-calc-input w-full">
                            <option value="summary_large_image">summary_large_image</option>
                            <option value="summary">summary</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">Page URL</label>
                          <input type="text" value={pageUrl} onChange={(event) => setPageUrl(event.target.value)} className="tool-calc-input w-full" />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">Card Title</label>
                        <input type="text" value={title} onChange={(event) => setTitle(event.target.value)} className="tool-calc-input w-full" />
                      </div>

                      <div>
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">Card Description</label>
                        <textarea value={description} onChange={(event) => setDescription(event.target.value)} className="tool-calc-input w-full min-h-[120px] resize-y" />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        <div>
                          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">Image URL</label>
                          <input type="text" value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} className="tool-calc-input w-full" />
                        </div>
                        <div>
                          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">Site Handle</label>
                          <input type="text" value={siteHandle} onChange={(event) => setSiteHandle(event.target.value)} className="tool-calc-input w-full" />
                        </div>
                        <div>
                          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">Creator Handle</label>
                          <input type="text" value={creatorHandle} onChange={(event) => setCreatorHandle(event.target.value)} className="tool-calc-input w-full" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="rounded-2xl border border-border bg-background overflow-hidden">
                        <div className={`${cardType === "summary_large_image" ? "aspect-[1.91/1]" : "aspect-[3/1.6]"} bg-muted/40 border-b border-border flex items-center justify-center`}>
                          {imageUrl.trim() ? (
                            <div className="w-full h-full flex items-center justify-center px-4 text-center text-sm text-muted-foreground">
                              <div>
                                <ImageIcon className="w-8 h-8 mx-auto mb-2 text-sky-500" />
                                <p className="break-all">{imageUrl}</p>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center text-muted-foreground">
                              <ImageIcon className="w-8 h-8 mx-auto mb-2" />
                              <p className="text-sm">Card image preview area</p>
                            </div>
                          )}
                        </div>
                        <div className="p-4 space-y-2">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Twitter className="w-3.5 h-3.5 text-sky-500" />
                            <span>{siteHandle || "@site"}</span>
                          </div>
                          <p className="text-base font-bold text-foreground leading-snug">{title || "Twitter Card title preview"}</p>
                          <p className="text-sm text-muted-foreground leading-relaxed">{description || "Twitter Card description preview."}</p>
                          <p className="text-xs text-muted-foreground break-all">{pageUrl || "https://example.com/page"}</p>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-border bg-zinc-950 text-sky-300 p-4">
                        <div className="flex items-center justify-between gap-3 mb-3">
                          <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Generated X Card Code</p>
                          <button
                            onClick={copyCode}
                            className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
                              copied ? "bg-emerald-500 text-white" : "bg-sky-500 text-white hover:bg-sky-600"
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
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Use the Twitter Card Generator</h2>
              <ol className="space-y-5">
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Select the card type that matches your content</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Use `summary_large_image` when the image should dominate the preview. Use `summary` when you want a smaller thumbnail card instead.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Fill in the text, image, URL, and profile handles</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      The handle fields are optional, but they are useful when you want brand attribution or creator attribution to appear in the card context.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Copy the tags and validate after deployment</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Paste the generated tags into the page head, publish the page, then use X&apos;s validator or a direct share test if you need to refresh the cached preview.
                    </p>
                  </div>
                </li>
              </ol>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Card Rules and Implementation Notes</h2>
              <p className="text-muted-foreground text-sm mb-6">These are the most important parts of a practical Twitter Card setup.</p>

              <div className="space-y-4">
                <div className="p-5 rounded-xl border border-sky-500/20 bg-sky-500/5">
                  <p className="font-bold text-foreground mb-2">Choose the image format based on the share goal</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    `summary_large_image` usually performs better for content where the image carries meaning. `summary` is more compact and works well for simple resource pages or smaller media assets.
                  </p>
                </div>
                <div className="p-5 rounded-xl border border-blue-500/20 bg-blue-500/5">
                  <p className="font-bold text-foreground mb-2">Keep the copy tighter than your on-page content</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    X card space is limited. Strong cards get to the point quickly and still make sense even when a user only sees the image, title, and the first part of the description.
                  </p>
                </div>
                <div className="p-5 rounded-xl border border-cyan-500/20 bg-cyan-500/5">
                  <p className="font-bold text-foreground mb-2">Use absolute URLs for both page and image fields</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Like Open Graph tags, Twitter Card scrapers work best when the URLs are complete and public. Relative image paths frequently cause fetch failures.
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Quick Examples</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p>
                  <strong className="text-foreground">Blog post:</strong> Use a clear headline, a short summary, and the featured image with `summary_large_image` so the post stands out in fast-moving feeds.
                </p>
                <p>
                  <strong className="text-foreground">Tool or product launch:</strong> Use a benefit-focused title, one-line description, and the product hero image. Add the brand handle in `twitter:site` for a cleaner association.
                </p>
                <p>
                  <strong className="text-foreground">Creator content page:</strong> Include a creator handle when the link points to content strongly associated with one person or host rather than just the site brand.
                </p>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Why Use This Twitter Card Generator?</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p>
                  <strong className="text-foreground">It gives you dedicated X control instead of relying on fallback behavior.</strong> X can fall back to Open Graph tags, but explicit Twitter Card tags let you tune the result more directly.
                </p>
                <p>
                  <strong className="text-foreground">It helps you keep the share preview consistent with the page itself.</strong> The preview card and output block live side by side, which makes it easier to spot mismatches before release.
                </p>
                <p>
                  <strong className="text-foreground">It stays lightweight and local.</strong> No login, no external API, and no data handoff. You just generate the tags and move on.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem
                  q="Do I still need Open Graph tags if I already have Twitter Card tags?"
                  a="Usually yes. Open Graph helps other platforms, while Twitter Card tags give you direct control on X. Most production pages publish both."
                />
                <FaqItem
                  q="What is the difference between `twitter:site` and `twitter:creator`?"
                  a="`twitter:site` usually identifies the brand or publisher account. `twitter:creator` identifies the individual author or creator when that distinction matters."
                />
                <FaqItem
                  q="Can I leave the handle fields blank?"
                  a="Yes. They are optional. The core card still works with card type, title, description, URL, and image."
                />
                <FaqItem
                  q="Should my Twitter Card title match the SEO title exactly?"
                  a="Not necessarily. You can tighten it or make it more social-friendly as long as it still represents the same page honestly."
                />
                <FaqItem
                  q="Why is the shared preview not updating right away?"
                  a="X may cache the old card. After deploying the new tags, run a validator or reshare test to trigger a refresh."
                />
                <FaqItem
                  q="Does X always use `summary_large_image` when I set it?"
                  a="Usually, but rendering can still vary based on platform behavior, image fetch success, and the current product surface inside X."
                />
              </div>
            </section>

            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-sky-500 to-blue-500 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Finish the Full SEO Preview Stack</h2>
                <p className="text-white/85 mb-6 max-w-xl">
                  Once your X card is ready, generate the Open Graph version and compare the search snippet so the page stays consistent across both search and social.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/seo/open-graph-generator" className="inline-flex items-center gap-2 rounded-xl bg-white text-sky-700 px-5 py-3 font-bold">
                    Open Graph Generator
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link href="/seo/serp-preview-tool" className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-5 py-3 font-bold text-white">
                    SERP Preview
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section className="bg-card border border-border rounded-2xl p-5">
              <h3 className="text-sm font-black uppercase tracking-widest text-foreground mb-4">Card Essentials</h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex gap-3">
                  <Twitter className="w-4 h-4 text-sky-500 mt-0.5 flex-shrink-0" />
                  <span>Choose `summary` or `summary_large_image` first.</span>
                </div>
                <div className="flex gap-3">
                  <ImageIcon className="w-4 h-4 text-sky-500 mt-0.5 flex-shrink-0" />
                  <span>Use a public absolute image URL.</span>
                </div>
                <div className="flex gap-3">
                  <AtSign className="w-4 h-4 text-sky-500 mt-0.5 flex-shrink-0" />
                  <span>Add brand and creator handles only when they are real and relevant.</span>
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
                    className="flex items-start gap-3 p-3 rounded-xl border border-border hover:border-sky-500/40 hover:bg-sky-500/5 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center flex-shrink-0">
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
                  linkCopied ? "bg-emerald-500 text-white" : "bg-sky-500 text-white hover:bg-sky-600"
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
