import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, Link as LinkIcon, ArrowRight,
  Zap, Smartphone, Shield, Lightbulb, Copy, Check,
  BadgeCheck, Lock, Code, FileText, Settings
} from "lucide-react";

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-slate-500/40 transition-colors">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-slate-500">
          <ChevronDown className="w-5 h-5" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div key="a" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} className="overflow-hidden">
            <p className="px-5 pb-5 text-muted-foreground leading-relaxed border-t border-border pt-4">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const generateSlug = (text: string, separator: string = "-", options: any) => {
  if (!text) return "";
  let slug = text;

  // Preserve mixed case or convert to lower/uppercase
  if (options.casing === "lowercase") {
    slug = slug.toLowerCase();
  } else if (options.casing === "uppercase") {
    slug = slug.toUpperCase();
  }

  // Remove accents
  if (options.removeAccents) {
    slug = slug.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  // Strip special chars
  // Replace anything that is not a letter/number with separator
  slug = slug.replace(/[^a-zA-Z0-9]+/g, separator);

  // Remove leading/trailing separators
  if (slug.startsWith(separator)) slug = slug.substring(separator.length);
  if (slug.endsWith(separator)) slug = slug.substring(0, slug.length - separator.length);

  return slug;
};

const RELATED = [
  { title: "URL Encoder/Decoder", slug: "url-encoder-decoder", cat: "developer", icon: <LinkIcon className="w-5 h-5" />,   color: 217, benefit: "Safely encode URL strings" },
  { title: "HTML Formatter",      slug: "html-formatter",      cat: "developer", icon: <Code className="w-5 h-5" />,       color: 160, benefit: "Format your webpage code" },
  { title: "Duplicate Line Remover", slug: "duplicate-line-remover", cat: "productivity", icon: <FileText className="w-5 h-5" />, color: 20, benefit: "Clean up raw text lists" },
];

export default function SlugGenerator() {
  const [text, setText] = useState("");
  const [separator, setSeparator] = useState("-");
  const [casing, setCasing] = useState("lowercase");
  const [removeAccents, setRemoveAccents] = useState(true);

  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const slug = useMemo(() => generateSlug(text, separator, { casing, removeAccents }), [text, separator, casing, removeAccents]);

  const copyResult = () => {
    if (!slug) return;
    navigator.clipboard.writeText(slug);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };
  const copyLink = () => { navigator.clipboard.writeText(window.location.href); setLinkCopied(true); setTimeout(() => setLinkCopied(false), 2000); };

  return (
    <Layout>
      <SEO
        title="URL Slug Generator – Create SEO Friendly Permalinks | US Online Tools"
        description="Free URL slug generator. Convert any string or title into a clean, SEO-friendly, readable URL slug instantly. Built for writers, marketers, and developers."
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-slate-500" strokeWidth={3} />
          <Link href="/category/developer" className="text-muted-foreground hover:text-foreground transition-colors">Developer Tools</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-slate-500" strokeWidth={3} />
          <span className="text-foreground">URL Slug Generator</span>
        </nav>

        {/* HERO */}
        <section className="rounded-2xl overflow-hidden border border-slate-500/15 bg-gradient-to-br from-slate-500/5 via-card to-gray-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <LinkIcon className="w-3.5 h-3.5" /> Developer Tools
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">URL Slug Generator</h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Convert any blog title, news headline, or random text string into a perfectly clean, SEO-optimized URL slug. Customize the separator, casing, and symbol filtering automatically in real time.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20"><BadgeCheck className="w-3.5 h-3.5" /> 100% Free</span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20"><Zap className="w-3.5 h-3.5" /> Instant Preview</span>
            <span className="inline-flex items-center gap-1.5 bg-pink-500/10 text-pink-600 dark:text-pink-400 font-bold text-xs px-3 py-1.5 rounded-full border border-pink-500/20"><Lock className="w-3.5 h-3.5" /> No Signup</span>
            <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs px-3 py-1.5 rounded-full border border-cyan-500/20"><Smartphone className="w-3.5 h-3.5" /> Mobile Ready</span>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">

            {/* TOOL WIDGET */}
            <section>
              <div className="rounded-2xl overflow-hidden border border-slate-500/20 shadow-lg shadow-slate-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-slate-500 to-gray-400" />
                <div className="bg-card p-6 md:p-8 space-y-5">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-500 to-gray-400 flex items-center justify-center flex-shrink-0">
                      <Settings className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Text to Slug Converter</p>
                      <p className="text-sm text-muted-foreground">Generated slug outputs below instantly.</p>
                    </div>
                  </div>

                  <div className="tool-calc-card" style={{ "--calc-hue": 210 } as React.CSSProperties}>
                    <div className="mb-6">
                      <label className="text-xs font-bold text-muted-foreground mb-1.5 uppercase tracking-widest block">Original Title Header / Text</label>
                      <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Type or paste the title of your article..."
                        className="w-full h-32 p-4 rounded-xl font-mono text-sm bg-background border border-border focus:border-slate-500 outline-none resize-none transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
                      <div>
                        <label className="text-xs font-bold text-muted-foreground mb-1.5 uppercase tracking-widest block">Separator</label>
                        <select
                          value={separator}
                          onChange={(e) => setSeparator(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-background border border-border outline-none transition-all focus:border-slate-500"
                        >
                          <option value="-">Hyphen (-)</option>
                          <option value="_">Underscore (_)</option>
                          <option value="+">Plus (+)</option>
                          <option value="">None</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-muted-foreground mb-1.5 uppercase tracking-widest block">Casing Type</label>
                        <select
                          value={casing}
                          onChange={(e) => setCasing(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-background border border-border outline-none transition-all focus:border-slate-500"
                        >
                          <option value="lowercase">lowercase</option>
                          <option value="uppercase">UPPERCASE</option>
                          <option value="preserve">Preserve Case</option>
                        </select>
                      </div>
                      <div className="flex items-center gap-2 mt-6">
                        <input
                          type="checkbox"
                          id="accents"
                          checked={removeAccents}
                          onChange={(e) => setRemoveAccents(e.target.checked)}
                          className="w-4 h-4 text-slate-500 focus:ring-slate-500 border-gray-300 rounded"
                        />
                        <label htmlFor="accents" className="text-sm font-bold text-foreground">Remove Accents &amp; Diacritics (é → e)</label>
                      </div>
                    </div>

                    {/* Results */}
                    {slug && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                        <div className="p-6 rounded-xl bg-slate-500/5 border border-slate-500/20">
                          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3 border-b border-slate-500/10 pb-2">Generated URL Slug</p>
                          <p className="text-xl md:text-2xl font-mono text-foreground break-all">{slug}</p>
                        </div>

                        <button onClick={copyResult} className="w-full flex items-center justify-center gap-2 py-3 bg-slate-600 text-white font-bold text-sm rounded-xl hover:bg-slate-700 transition-colors mt-2">
                          {copied ? <><Check className="w-4 h-4" /> Copied to Clipboard!</> : <><Copy className="w-4 h-4" /> Copy Generated Slug</>}
                        </button>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="how-to-use">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">What is a URL Slug?</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                A slug is the exact part of your URL that specifically identifies a webpage within a domain in an easy-to-read format. For example, in <code>example.com/blog/what-is-a-slug</code>, the slug is <code>what-is-a-slug</code>.
              </p>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">Why optimize slugs?</strong> Search engines like Google interpret the words located inside your URL to understand webpage context. Clean, readable URL strings containing targeted keywords rank substantially better than non-descriptive numeric URL paths (like <code>?p=123</code>).</p>
                <p><strong className="text-foreground">Why Hyphens (-) vs Underscores (_)?</strong> Google officially recommends using hyphens (-) instead of underscores (_) to separate words inside slugs. Hyphens are explicitly treated as word separators by search crawler bots. This generator defaults to hyphens to maximize SEO.</p>
              </div>
            </section>

            {/* FAQ */}
            <section id="faq">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">FAQ</h2>
              <div className="space-y-3">
                <FaqItem q="Does changing a slug impact SEO?" a="Yes. If you change a live page's slug, the URL changes. This generates a 404 error on the old URL unless you create a 301 Redirect pointing the old slug to your newly generated one. Always 301 redirect!" />
                <FaqItem q="Are emojis allowed in URLs?" a="Technically modern browsers format emojis in URLs using punycode, but it is highly advised NOT to use emojis in slugs. Emojis break readability and introduce extreme accessibility/screen-reader complications. This tool scrubs them cleanly." />
              </div>
            </section>
          </div>

          {/* SIDEBAR */}
          <div className="space-y-6">
            <div className="sticky top-28 space-y-6">
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight mb-3 uppercase">Related Tools</h3>
                <div className="space-y-0.5">
                  {RELATED.map(t => (
                    <Link key={t.slug} href={`/${t.cat}/${t.slug}`} className="group flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-muted transition-all">
                      <div className="w-7 h-7 rounded-md flex items-center justify-center text-white flex-shrink-0 [&>svg]:w-3.5 [&>svg]:h-3.5" style={{ background: `linear-gradient(135deg, hsl(${t.color} 70% 55%), hsl(${t.color} 75% 42%))` }}>{t.icon}</div>
                      <div className="flex-1 min-w-0"><p className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors truncate">{t.title}</p><p className="text-[10px] text-muted-foreground/60 truncate">{t.benefit}</p></div>
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-slate-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-3">On This Page</h3>
                <div className="space-y-0.5">
                  {["Calculator","How to Use","FAQ"].map(label => (
                    <a key={label} href={`#${label.toLowerCase().replace(/\s/g,"-")}`} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-slate-500 font-medium py-1.5 transition-colors">
                      <div className="w-1 h-1 rounded-full bg-slate-500/40 flex-shrink-0" />{label}
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
