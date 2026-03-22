import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, ArrowRight,
  Zap, CheckCircle2, Smartphone, Shield, Clock,
  Lightbulb, Copy, Check, Code, Search, Globe, Tag,
  FileCode, Eye, Share2, Settings,
} from "lucide-react";
import { getToolPath } from "@/data/tools";

// ── FAQ Item Component ──
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-primary/40 transition-colors">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left"
      >
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-primary">
          <ChevronDown className="w-5 h-5" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 text-muted-foreground leading-relaxed border-t border-border pt-4">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Related Tool Card ──
const RELATED_TOOLS = [
  { title: "Open Graph Tag Generator", slug: "open-graph-generator", icon: <Share2 className="w-5 h-5" />, color: 152 },
  { title: "Twitter Card Generator", slug: "twitter-card-generator", icon: <Tag className="w-5 h-5" />, color: 210 },
  { title: "Schema Markup Generator", slug: "schema-markup-generator", icon: <FileCode className="w-5 h-5" />, color: 340 },
  { title: "Robots.txt Generator", slug: "robots-txt-generator", icon: <Settings className="w-5 h-5" />, color: 25 },
  { title: "SERP Preview Tool", slug: "google-serp-preview", icon: <Eye className="w-5 h-5" />, color: 265 },
  { title: "Canonical Tag Generator", slug: "canonical-tag-generator", icon: <Globe className="w-5 h-5" />, color: 45 },
];

// ── Main Component ──
export default function MetaTagGenerator() {
  const [pageTitle, setPageTitle] = useState("");
  const [metaDesc, setMetaDesc] = useState("");
  const [keywords, setKeywords] = useState("");
  const [author, setAuthor] = useState("");
  const [robotsIndex, setRobotsIndex] = useState("index");
  const [robotsFollow, setRobotsFollow] = useState("follow");
  const [canonicalUrl, setCanonicalUrl] = useState("");
  const [ogTitle, setOgTitle] = useState("");
  const [ogDescription, setOgDescription] = useState("");
  const [ogImage, setOgImage] = useState("");
  const [ogType, setOgType] = useState("website");
  const [copied, setCopied] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const generatedTags = useMemo(() => {
    const lines: string[] = [];
    lines.push('<meta charset="UTF-8">');
    lines.push('<meta name="viewport" content="width=device-width, initial-scale=1.0">');
    if (pageTitle) lines.push(`<title>${pageTitle}</title>`);
    if (metaDesc) lines.push(`<meta name="description" content="${metaDesc}">`);
    if (keywords) lines.push(`<meta name="keywords" content="${keywords}">`);
    if (author) lines.push(`<meta name="author" content="${author}">`);
    lines.push(`<meta name="robots" content="${robotsIndex}, ${robotsFollow}">`);
    if (canonicalUrl) lines.push(`<link rel="canonical" href="${canonicalUrl}">`);
    if (ogTitle || pageTitle) lines.push(`<meta property="og:title" content="${ogTitle || pageTitle}">`);
    if (ogDescription || metaDesc) lines.push(`<meta property="og:description" content="${ogDescription || metaDesc}">`);
    if (ogImage) lines.push(`<meta property="og:image" content="${ogImage}">`);
    lines.push(`<meta property="og:type" content="${ogType}">`);
    if (canonicalUrl) lines.push(`<meta property="og:url" content="${canonicalUrl}">`);
    return lines.join("\n");
  }, [pageTitle, metaDesc, keywords, author, robotsIndex, robotsFollow, canonicalUrl, ogTitle, ogDescription, ogImage, ogType]);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(generatedTags);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Syntax-highlighted rendering
  const renderHighlightedTag = (line: string, i: number) => {
    const tagMatch = line.match(/^<(\/?[\w-]+)/);
    const attrMatches = [...line.matchAll(/(\w[\w-]*)="([^"]*)"/g)];
    if (!tagMatch) return <div key={i} className="text-gray-300">{line}</div>;

    const parts: React.ReactNode[] = [];
    let lastIdx = 0;
    const tagName = tagMatch[1];
    const tagStart = line.indexOf(tagName);

    parts.push(<span key="lt" className="text-gray-400">&lt;</span>);
    parts.push(<span key="tag" className="text-red-400">{tagName}</span>);
    lastIdx = tagStart + tagName.length;

    attrMatches.forEach((m, j) => {
      const attrIdx = line.indexOf(m[0], lastIdx);
      parts.push(<span key={`sp-${j}`} className="text-gray-300">{line.slice(lastIdx, attrIdx)}</span>);
      parts.push(<span key={`attr-${j}`} className="text-yellow-300">{m[1]}</span>);
      parts.push(<span key={`eq-${j}`} className="text-gray-400">=&quot;</span>);
      parts.push(<span key={`val-${j}`} className="text-green-300">{m[2]}</span>);
      parts.push(<span key={`q-${j}`} className="text-gray-400">&quot;</span>);
      lastIdx = attrIdx + m[0].length;
    });

    const isSelfClosing = line.endsWith(">");
    if (isSelfClosing) {
      parts.push(<span key="gt" className="text-gray-400">&gt;</span>);
    }

    // Handle <title>content</title>
    const titleMatch = line.match(/<title>(.+)<\/title>/);
    if (titleMatch) {
      return (
        <div key={i} className="leading-relaxed">
          <span className="text-gray-400">&lt;</span>
          <span className="text-red-400">title</span>
          <span className="text-gray-400">&gt;</span>
          <span className="text-gray-100">{titleMatch[1]}</span>
          <span className="text-gray-400">&lt;/</span>
          <span className="text-red-400">title</span>
          <span className="text-gray-400">&gt;</span>
        </div>
      );
    }

    return <div key={i} className="leading-relaxed">{parts}</div>;
  };

  // SERP Preview
  const serpTitle = pageTitle || "Page Title Will Appear Here";
  const serpUrl = canonicalUrl || "https://example.com/your-page";
  const serpDesc = metaDesc || "Your meta description will appear here. It should be compelling and include relevant keywords to improve click-through rate from search results.";

  return (
    <Layout>
      <SEO
        title="Meta Tag Generator - Free SEO Meta Tags Generator Online"
        description="Free online meta tag generator. Create SEO-optimized HTML meta tags including title, description, keywords, Open Graph tags, and robots directives. Instant results, no signup."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        {/* ── BREADCRUMB ── */}
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-primary" strokeWidth={3} />
          <Link href="/category/seo" className="text-muted-foreground hover:text-foreground transition-colors">SEO Tools</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-primary" strokeWidth={3} />
          <span className="text-foreground">Meta Tag Generator</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* ── LEFT COLUMN ── */}
          <div className="lg:col-span-2 space-y-10">

            {/* ── 1. PAGE HEADER ── */}
            <section>
              <div className="inline-flex items-center gap-1.5 bg-lime-500/10 text-lime-600 dark:text-lime-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
                <Search className="w-3.5 h-3.5" />
                SEO Tools
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight leading-[1.1] mb-3">
                Meta Tag Generator
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                Generate SEO-optimized HTML meta tags for your website in seconds. Improve search rankings, social sharing previews, and click-through rates with perfectly formatted meta tags.
              </p>
            </section>

            {/* ── 2. QUICK ACTION ── */}
            <section className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/15">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-bold text-foreground text-sm">Fill in your page details</p>
                <p className="text-muted-foreground text-sm">Meta tags are generated in real-time as you type. Copy the code when ready.</p>
              </div>
            </section>

            {/* ── 3. TOOL SECTION ── */}
            <section className="space-y-5" id="calculator">
              {/* Basic Meta Tags */}
              <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-lime-500/10 text-lime-600 dark:text-lime-400 flex items-center justify-center flex-shrink-0 font-bold text-sm">1</div>
                  <h3 className="text-lg font-bold text-foreground">Basic Meta Tags</h3>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-sm font-semibold text-foreground">Page Title</label>
                    <span className={`text-xs font-mono ${pageTitle.length > 60 ? "text-red-500" : "text-muted-foreground"}`}>
                      {pageTitle.length}/60
                    </span>
                  </div>
                  <input
                    type="text"
                    placeholder="My Awesome Website - Best Tool for SEO"
                    className="tool-calc-input w-full"
                    value={pageTitle}
                    onChange={e => setPageTitle(e.target.value)}
                  />
                  {pageTitle.length > 60 && (
                    <p className="text-xs text-red-500 mt-1">Title exceeds 60 characters. Google may truncate it in search results.</p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-sm font-semibold text-foreground">Meta Description</label>
                    <span className={`text-xs font-mono ${metaDesc.length > 160 ? "text-red-500" : "text-muted-foreground"}`}>
                      {metaDesc.length}/160
                    </span>
                  </div>
                  <textarea
                    placeholder="A compelling description of your page that includes target keywords..."
                    className="tool-calc-input w-full min-h-[80px] resize-y"
                    value={metaDesc}
                    onChange={e => setMetaDesc(e.target.value)}
                  />
                  {metaDesc.length > 160 && (
                    <p className="text-xs text-red-500 mt-1">Description exceeds 160 characters. Search engines may truncate it.</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-semibold text-foreground block mb-1.5">Keywords (comma separated)</label>
                  <input
                    type="text"
                    placeholder="seo tools, meta tags, html generator"
                    className="tool-calc-input w-full"
                    value={keywords}
                    onChange={e => setKeywords(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-foreground block mb-1.5">Author</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="tool-calc-input w-full"
                    value={author}
                    onChange={e => setAuthor(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-foreground block mb-1.5">Robots - Indexing</label>
                    <select
                      className="tool-calc-input w-full"
                      value={robotsIndex}
                      onChange={e => setRobotsIndex(e.target.value)}
                    >
                      <option value="index">index</option>
                      <option value="noindex">noindex</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-foreground block mb-1.5">Robots - Following</label>
                    <select
                      className="tool-calc-input w-full"
                      value={robotsFollow}
                      onChange={e => setRobotsFollow(e.target.value)}
                    >
                      <option value="follow">follow</option>
                      <option value="nofollow">nofollow</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-foreground block mb-1.5">Canonical URL</label>
                  <input
                    type="url"
                    placeholder="https://example.com/your-page"
                    className="tool-calc-input w-full"
                    value={canonicalUrl}
                    onChange={e => setCanonicalUrl(e.target.value)}
                  />
                </div>
              </div>

              {/* Open Graph Tags */}
              <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 font-bold text-sm">2</div>
                  <h3 className="text-lg font-bold text-foreground">Open Graph Tags</h3>
                </div>

                <div>
                  <label className="text-sm font-semibold text-foreground block mb-1.5">og:title (defaults to Page Title)</label>
                  <input
                    type="text"
                    placeholder={pageTitle || "Open Graph Title"}
                    className="tool-calc-input w-full"
                    value={ogTitle}
                    onChange={e => setOgTitle(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-foreground block mb-1.5">og:description (defaults to Meta Description)</label>
                  <textarea
                    placeholder={metaDesc || "Open Graph description for social sharing..."}
                    className="tool-calc-input w-full min-h-[60px] resize-y"
                    value={ogDescription}
                    onChange={e => setOgDescription(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-foreground block mb-1.5">og:image URL</label>
                  <input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    className="tool-calc-input w-full"
                    value={ogImage}
                    onChange={e => setOgImage(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-foreground block mb-1.5">og:type</label>
                  <select
                    className="tool-calc-input w-full"
                    value={ogType}
                    onChange={e => setOgType(e.target.value)}
                  >
                    <option value="website">website</option>
                    <option value="article">article</option>
                    <option value="product">product</option>
                    <option value="profile">profile</option>
                    <option value="video.other">video</option>
                    <option value="music.song">music</option>
                  </select>
                </div>
              </div>

              {/* Generated Code Output */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0 font-bold text-sm">3</div>
                    <h3 className="text-lg font-bold text-foreground">Generated Meta Tags</h3>
                  </div>
                  <button
                    onClick={copyCode}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-bold rounded-lg text-sm hover:-translate-y-0.5 active:translate-y-0 transition-transform"
                  >
                    {copiedCode ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Code</>}
                  </button>
                </div>
                <div className="bg-gray-900 rounded-xl p-5 overflow-x-auto font-mono text-sm">
                  {generatedTags.split("\n").map((line, i) => renderHighlightedTag(line, i))}
                </div>
              </div>

              {/* ── 4. Result Insight / SERP Preview ── */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border rounded-2xl p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Eye className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-bold text-foreground">Google SERP Preview</h3>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-xl p-5 border border-border">
                  <div className="text-blue-600 dark:text-blue-400 text-lg font-medium leading-snug hover:underline cursor-pointer truncate">
                    {serpTitle}
                  </div>
                  <div className="text-green-700 dark:text-green-400 text-sm mt-0.5 truncate">
                    {serpUrl}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 text-sm mt-1 leading-relaxed line-clamp-2">
                    {serpDesc}
                  </div>
                </div>
                <div className="flex gap-2 items-start mt-3">
                  <Lightbulb className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    This is how your page may appear in Google search results. Keep your title under 60 characters and description under 160 characters for optimal display.
                  </p>
                </div>
              </motion.div>
            </section>

            {/* ── 5. HOW IT WORKS ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="how-it-works">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How It Works</h2>
              <div className="space-y-5">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-lime-500/10 text-lime-600 dark:text-lime-400 flex items-center justify-center flex-shrink-0 font-bold text-sm">1</div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1">Enter Your Page Information</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">Fill in your page title, meta description, keywords, and other relevant details. Character counters help you stay within recommended limits for search engines.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 font-bold text-sm">2</div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1">Configure Open Graph & Robots</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">Set up Open Graph tags for social media sharing previews and configure robots directives to control how search engines crawl and index your page.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0 font-bold text-sm">3</div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1">Copy & Paste Into Your HTML</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">Click the Copy Code button and paste the generated meta tags into the <code className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">&lt;head&gt;</code> section of your HTML document. Preview how it looks in Google search results.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* ── 6. REAL-LIFE EXAMPLES ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="examples">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Real-Life Examples</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/15">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="w-4 h-4 text-blue-500" />
                    <h4 className="font-bold text-foreground text-sm">Blog Post SEO</h4>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">Writing a blog post about cooking? Set your title to include primary keywords, write a compelling 155-character description, and add Open Graph image for <strong className="text-foreground">social sharing</strong>.</p>
                </div>
                <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/15">
                  <div className="flex items-center gap-2 mb-2">
                    <Code className="w-4 h-4 text-purple-500" />
                    <h4 className="font-bold text-foreground text-sm">Product Landing Page</h4>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">Launching a SaaS product? Use og:type "product", include pricing keywords in description, and set a canonical URL to avoid <strong className="text-foreground">duplicate content issues</strong>.</p>
                </div>
                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
                  <div className="flex items-center gap-2 mb-2">
                    <Search className="w-4 h-4 text-emerald-500" />
                    <h4 className="font-bold text-foreground text-sm">Local Business Website</h4>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">Running a local bakery? Include city name in your title, mention services in meta description, and use <strong className="text-foreground">location-based keywords</strong> for better local SEO rankings.</p>
                </div>
                <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/15">
                  <div className="flex items-center gap-2 mb-2">
                    <FileCode className="w-4 h-4 text-amber-500" />
                    <h4 className="font-bold text-foreground text-sm">Portfolio Website</h4>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">Building a portfolio? Set author meta tag, use noindex for draft pages, and add a high-quality og:image that showcases your <strong className="text-foreground">best work</strong> when shared.</p>
                </div>
              </div>
            </section>

            {/* ── 7. BENEFITS ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="benefits">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Why Use This Generator?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { icon: <Zap className="w-4 h-4" />, text: "Real-time meta tag generation as you type" },
                  { icon: <CheckCircle2 className="w-4 h-4" />, text: "Character counters for optimal SEO length" },
                  { icon: <Shield className="w-4 h-4" />, text: "Complete Open Graph support for social sharing" },
                  { icon: <Smartphone className="w-4 h-4" />, text: "Google SERP preview to see how it looks" },
                  { icon: <Clock className="w-4 h-4" />, text: "No signup needed — free forever" },
                  { icon: <Code className="w-4 h-4" />, text: "Syntax-highlighted code output with copy" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="text-primary">{item.icon}</div>
                    <span className="text-sm font-medium text-foreground">{item.text}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* ── 9. SEO CONTENT ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-4">What Are Meta Tags and Why Do They Matter?</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p>
                  Meta tags are snippets of HTML code placed in the <code className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">&lt;head&gt;</code> section of a web page that provide structured metadata about the page's content. While invisible to visitors, meta tags are critical for search engine optimization (SEO) because they tell search engines like Google, Bing, and Yahoo what your page is about, how to display it in search results, and whether to index it.
                </p>
                <p>
                  The most important meta tags for SEO include the title tag, meta description, robots directive, and canonical URL. The title tag appears as the clickable headline in search results and is one of the strongest on-page ranking factors. The meta description, while not a direct ranking factor, significantly impacts click-through rates by providing a compelling preview of your page content.
                </p>

                <h3 className="text-xl font-bold text-foreground pt-2">Open Graph Tags for Social Media</h3>
                <p>
                  Open Graph (OG) meta tags were created by Facebook to control how your content appears when shared on social media platforms. When someone shares your URL on Facebook, LinkedIn, Twitter, or messaging apps, these platforms read your OG tags to generate a rich preview card with a title, description, and image. Without Open Graph tags, social platforms will try to guess this information, often resulting in poorly formatted or unappealing previews that reduce engagement.
                </p>

                <h3 className="text-xl font-bold text-foreground pt-2">Best Practices for Meta Tags</h3>
                <ul className="space-y-2 ml-1">
                  {[
                    "Keep page titles under 60 characters to prevent truncation in search results",
                    "Write meta descriptions between 120-160 characters with a clear call to action",
                    "Include primary keywords naturally in both title and description",
                    "Use canonical URLs to prevent duplicate content penalty across multiple URLs",
                    "Set appropriate robots directives for pages you want indexed vs. private pages",
                    "Always include Open Graph image tags — posts with images get significantly more engagement",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* ── 10. FAQ ── */}
            <section id="faq">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem
                  q="What are meta tags and why do I need them?"
                  a="Meta tags are HTML elements that provide metadata about your webpage to search engines and social platforms. They help search engines understand your content, control how your page appears in search results, and determine how your links look when shared on social media. Properly optimized meta tags can significantly improve your SEO rankings and click-through rates."
                />
                <FaqItem
                  q="What is the ideal length for a meta title and description?"
                  a="Google typically displays up to 60 characters for title tags and 155-160 characters for meta descriptions. Our generator includes real-time character counters to help you stay within these limits. Going over may result in your text being truncated with '...' in search results."
                />
                <FaqItem
                  q="Do keywords meta tags still matter for SEO?"
                  a="Google has officially stated that it does not use the keywords meta tag as a ranking factor. However, some other search engines like Bing may still consider them as a minor signal. It's generally not harmful to include them, but they shouldn't be your primary SEO focus."
                />
                <FaqItem
                  q="What are Open Graph tags and do I need them?"
                  a="Open Graph tags control how your page appears when shared on social media platforms like Facebook, LinkedIn, and Twitter. They define the title, description, image, and type of content shown in social preview cards. If you want your content to look professional when shared, OG tags are essential."
                />
                <FaqItem
                  q="What does the robots meta tag do?"
                  a="The robots meta tag tells search engine crawlers how to handle your page. 'index' allows the page to appear in search results, while 'noindex' prevents it. 'follow' tells crawlers to follow links on the page, and 'nofollow' tells them not to. Use 'noindex' for private pages like login screens or admin panels."
                />
                <FaqItem
                  q="Where do I put meta tags in my HTML?"
                  a="Meta tags go inside the <head> section of your HTML document, before the closing </head> tag. Copy the generated code from this tool and paste it between your <head> and </head> tags. If you're using a CMS like WordPress, there are SEO plugins like Yoast that handle this for you."
                />
              </div>
            </section>

            {/* ── 11. FINAL CTA ── */}
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-8 text-primary-foreground">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Explore More SEO Tools</h2>
                <p className="text-primary-foreground/80 mb-6 max-w-lg">
                  Boost your website's search engine performance with our complete suite of free SEO tools — from Open Graph generators to SERP previews and schema markup.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary font-bold rounded-xl hover:-translate-y-0.5 transition-transform"
                >
                  Explore All Tools <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </section>
          </div>

          {/* ── RIGHT SIDEBAR ── */}
          <div className="space-y-6">
            <div className="sticky top-28 space-y-6">

              {/* ── 8. RELATED TOOLS ── */}
              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="text-lg font-black text-foreground tracking-tight mb-4">Related Tools</h3>
                <div className="space-y-2">
                  {RELATED_TOOLS.map((tool) => (
                    <Link
                      key={tool.slug}
                      href={getToolPath(tool.slug)}
                      className="group flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-all"
                    >
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-white flex-shrink-0"
                        style={{ background: `linear-gradient(135deg, hsl(${tool.color} 70% 55%), hsl(${tool.color} 75% 42%))` }}
                      >
                        {tool.icon}
                      </div>
                      <span className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors leading-snug">
                        {tool.title}
                      </span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary ml-auto opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Share Card */}
              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="text-lg font-black text-foreground tracking-tight mb-2">Share This Tool</h3>
                <p className="text-sm text-muted-foreground mb-4">Help others generate better meta tags.</p>
                <button
                  onClick={copyLink}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform"
                >
                  {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Link</>}
                </button>
              </div>

              {/* Quick Links */}
              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="text-lg font-black text-foreground tracking-tight mb-4">On This Page</h3>
                <div className="space-y-1.5">
                  {["Calculator", "How It Works", "Examples", "Benefits", "FAQ"].map((label) => (
                    <a
                      key={label}
                      href={`#${label.toLowerCase().replace(/\s/g, "-")}`}
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary font-medium py-1 transition-colors"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/30" />
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
