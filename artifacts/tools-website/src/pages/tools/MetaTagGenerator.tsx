import { useState } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, Check, ArrowRight,
  Zap, Shield, Copy, Tags, FileCode2,
  Image as ImageIcon, Share2, Search, Webhook
} from "lucide-react";

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-lime-500/40 transition-colors">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-lime-500">
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

const RELATED = [
  { title: "SLUG Generator", slug: "slug-generator", cat: "developer", icon: <Webhook className="w-5 h-5"/>, color: 170, benefit: "SEO-friendly URLs" },
  { title: "Keywords Density",slug: "keyword-density-checker",cat: "seo", icon: <Search className="w-5 h-5"/>, color: 100, benefit: "Analyze keyword spam" },
  { title: "Open Graph Gen",  slug: "open-graph-generator", cat: "seo", icon: <Share2 className="w-5 h-5"/>, color: 90,  benefit: "Social media snippets" },
];

export default function MetaTagGenerator() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [keywords, setKeywords] = useState("");
  const [author, setAuthor] = useState("");
  const [robotsIndex, setRobotsIndex] = useState("index");
  const [robotsFollow, setRobotsFollow] = useState("follow");
  const [language, setLanguage] = useState("English");
  
  const [copied, setCopied] = useState(false);

  const generateTags = () => {
    let output = `<!-- Primary Meta Tags -->\n`;
    if (title) output += `<title>${title}</title>\n<meta name="title" content="${title}">\n`;
    if (desc) output += `<meta name="description" content="${desc}">\n`;
    if (keywords) output += `<meta name="keywords" content="${keywords}">\n`;
    if (author) output += `<meta name="author" content="${author}">\n`;
    
    // Robots
    output += `<meta name="robots" content="${robotsIndex}, ${robotsFollow}">\n`;
    
    // Optional Lang
    if (language !== "No Language Tag") {
       output += `<meta name="language" content="${language}">\n`;
    }
    
    // Core HTML
    output += `<meta http-equiv="Content-Type" content="text/html; charset=utf-8">\n`;

    return output;
  };

  const copyResult = () => {
    const code = generateTags();
    if (code.trim() === "<!-- Primary Meta Tags -->\n<meta name=\"robots\" content=\"index, follow\">\n<meta name=\"language\" content=\"English\">\n<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\">\n") return;
    navigator.clipboard.writeText(code);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const generatedCode = generateTags();
  const isEmpty = generatedCode === `<!-- Primary Meta Tags -->\n<meta name="robots" content="index, follow">\n<meta name="language" content="English">\n<meta http-equiv="Content-Type" content="text/html; charset=utf-8">\n`;

  return (
    <Layout>
      <SEO
        title="Meta Tag Generator – Create SEO HTML Tags Instantly"
        description="Free online Meta Tag Generator. Provide a title, description, and keywords to quickly construct valid HTML <head> meta tags fully optimized for Google indexing."
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-lime-500" strokeWidth={3} />
          <Link href="/category/seo" className="text-muted-foreground hover:text-foreground transition-colors">SEO Tools</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-lime-500" strokeWidth={3} />
          <span className="text-foreground">Meta Tag Generator</span>
        </nav>

        {/* HERO */}
        <section className="rounded-2xl overflow-hidden border border-lime-500/15 bg-gradient-to-br from-lime-500/5 via-card to-green-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-lime-500/10 text-lime-600 dark:text-lime-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Tags className="w-3.5 h-3.5" /> HTML SEO Tag Builder
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">Meta Tag Generator</h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Automatically compile structural {'<head>'} meta tags optimized directly for Google's internal indexing spiders. Construct title attributes, content descriptions, mapping keywords, and strict indexing `no-follow` bot crawler directives.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-sky-500/10 text-sky-600 dark:text-sky-400 font-bold text-xs px-3 py-1.5 rounded-full border border-sky-500/20"><FileCode2 className="w-3.5 h-3.5" /> Perfect Syntax</span>
            <span className="inline-flex items-center gap-1.5 bg-lime-500/10 text-lime-600 dark:text-lime-400 font-bold text-xs px-3 py-1.5 rounded-full border border-lime-500/20"><Zap className="w-3.5 h-3.5" /> Client Side Output</span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20"><Shield className="w-3.5 h-3.5" /> W3C Compliant</span>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">

            {/* INTEGRATED BUILDER */}
            <section>
              <div className="rounded-2xl overflow-hidden border border-lime-500/20 shadow-lg shadow-lime-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-lime-400 to-green-600" />
                <div className="bg-card p-6 md:p-8 space-y-6">
                  
                  {/* Title & Desc */}
                  <div className="space-y-5">
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest block">Page Title (Meta Title)</label>
                        <span className={`text-xs font-bold ${title.length > 60 ? 'text-red-500' : 'text-lime-500'}`}>{title.length} / 60</span>
                      </div>
                      <input type="text" placeholder="e.g. Utility Hub | Free Developer and SEO Web Utilities" className="tool-calc-input w-full bg-background" value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest block">Page Description</label>
                        <span className={`text-xs font-bold ${(desc.length < 50 && desc.length > 0) ? 'text-yellow-500' : desc.length > 160 ? 'text-red-500' : 'text-lime-500'}`}>{desc.length} / 160</span>
                      </div>
                      <textarea placeholder="e.g. Free collection of beautifully built, robust developer tools including JSON formatters, text manipulation, calculators, and SEO tag builders." className="tool-calc-input w-full min-h-[100px] resize-y bg-background" value={desc} onChange={(e) => setDesc(e.target.value)} />
                    </div>
                  </div>

                  {/* Keywords & Author */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-xs font-bold text-muted-foreground mb-1.5 uppercase tracking-widest block">Meta Keywords (Comma Sep)</label>
                      <input type="text" placeholder="e.g. seo tools, meta generator, formatting" className="tool-calc-input w-full bg-background" value={keywords} onChange={(e) => setKeywords(e.target.value)} />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-muted-foreground mb-1.5 uppercase tracking-widest block">Author / Brand</label>
                      <input type="text" placeholder="e.g. John Doe, Acme Corp" className="tool-calc-input w-full bg-background" value={author} onChange={(e) => setAuthor(e.target.value)} />
                    </div>
                  </div>

                  <hr className="border-border !my-8" />

                  {/* Robots & Localization */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 border border-border rounded-xl p-5 bg-muted/20">
                     <div>
                      <label className="text-xs font-bold text-foreground mb-2 uppercase tracking-widest block">Index (Search Engine)</label>
                      <select className="tool-calc-input w-full bg-card" value={robotsIndex} onChange={(e)=>setRobotsIndex(e.target.value)}>
                        <option value="index">Index (Recommended)</option>
                        <option value="noindex">No Index</option>
                      </select>
                     </div>
                     <div>
                      <label className="text-xs font-bold text-foreground mb-2 uppercase tracking-widest block">Follow (Spiders)</label>
                      <select className="tool-calc-input w-full bg-card" value={robotsFollow} onChange={(e)=>setRobotsFollow(e.target.value)}>
                        <option value="follow">Follow (Recommended)</option>
                        <option value="nofollow">No Follow</option>
                      </select>
                     </div>
                     <div>
                      <label className="text-xs font-bold text-foreground mb-2 uppercase tracking-widest block">Content Language</label>
                      <select className="tool-calc-input w-full bg-card" value={language} onChange={(e)=>setLanguage(e.target.value)}>
                        <option>English</option>
                        <option>Spanish</option>
                        <option>French</option>
                        <option>German</option>
                        <option>No Language Tag</option>
                      </select>
                     </div>
                  </div>

                  {/* Generated Block */}
                  <div className="mt-8">
                     <div className="flex justify-between items-center mb-2">
                       <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest block">Generated HTML Syntax</label>
                     </div>
                     <div className="relative group">
                        <textarea
                          readOnly
                          value={generatedCode}
                          className="w-full h-56 font-mono text-sm p-4 bg-zinc-950 text-lime-400 border border-border rounded-xl focus:ring-2 focus:ring-lime-500/50 transition-all select-all resize-none shadow-inner"
                        />
                        <button onClick={copyResult} className={`absolute bottom-4 right-4 p-3 rounded-lg flex items-center gap-2 font-bold text-sm transition-all shadow-md ${copied ? 'bg-emerald-500 text-white' : 'bg-lime-500 text-zinc-950 hover:bg-lime-400'}`}>
                           {copied ? <><Check className="w-4 h-4" /> Copied</> : <><Copy className="w-4 h-4" /> Copy Snippet</>}
                        </button>
                     </div>
                  </div>

                </div>
              </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="meta-documentation">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Optimizing Meta Tags for Search Engines</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Meta tags exist strictly inside the HTML {'<head>'} block of your raw webpage. They provide crucial algorithmic data directly to Google, Bing, and Social Media scrapers, indicating exactly what the page content resolves to without forcing the crawler to ingest all the {'<body>'} text.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                <div className="p-5 border border-border rounded-xl bg-muted/30 relative">
                   <div className="absolute top-0 right-0 p-3"><Tags className="w-8 h-8 text-lime-500/20" /></div>
                   <h3 className="text-sm font-bold text-foreground mb-2 uppercase tracking-widest">Title Limitations</h3>
                   <p className="text-sm text-muted-foreground leading-relaxed">Ensure your Meta Title stays under ~60 alphanumeric characters. Google completely truncates titles stretching past 60 characters with ellipses `(...)` on Mobile SERPs, drastically hurting Organic CTR.</p>
                </div>
                <div className="p-5 border border-border rounded-xl bg-muted/30 relative">
                   <div className="absolute top-0 right-0 p-3"><Tags className="w-8 h-8 text-lime-500/20" /></div>
                   <h3 className="text-sm font-bold text-foreground mb-2 uppercase tracking-widest">Description Caps</h3>
                   <p className="text-sm text-muted-foreground leading-relaxed">Keep your `meta name="description"` between 50 and 160 characters. Provide an immediate actionable summary prompting immediate user-clicks in search query lists. Avoid repeating the Title string here.</p>
                </div>
              </div>
            </section>

            {/* QUICK EXAMPLES */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="indexing-spiders">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Indexing Spider Directives</h2>
              <p className="text-muted-foreground bg-muted p-4 rounded-xl mb-6">
                Crawlers like `GoogleBot` rigidly follow the internal directives supplied via `{'<meta name="robots">'}`. The two primary arguments instruct exactly how the bot interacts with local domain propagation vs external link traversal:
              </p>
              
              <div className="space-y-4">
                <div className="flex gap-4 items-start p-4 hover:bg-muted/30 rounded-xl transition-colors">
                  <div className="bg-sky-500/10 text-sky-500 p-2.5 rounded-lg flex-shrink-0"><Search className="w-5 h-5"/></div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1 text-sm uppercase tracking-widest">Index vs NoIndex</h4>
                    <p className="text-sm text-muted-foreground">`Index` commands the scraper to permanently ingest and display your Page in public searches. `NoIndex` commands the bot to immediately drop the page, strictly hiding it from Google Search.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start p-4 hover:bg-muted/30 rounded-xl transition-colors">
                  <div className="bg-teal-500/10 text-teal-500 p-2.5 rounded-lg flex-shrink-0"><Share2 className="w-5 h-5"/></div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1 text-sm uppercase tracking-widest">Follow vs NoFollow</h4>
                    <p className="text-sm text-muted-foreground">`Follow` allows search spiders to follow the `ahref` hyperlink targets mapping outside of your page, spreading your SEO juice. `NoFollow` strictly isolates link-juice preventing SEO leakage to external URL links.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* FAQ */}
            <section id="faq">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">FAQ</h2>
              <div className="space-y-3">
                <FaqItem q="Are the exact Meta Keywords still heavily ranked by Google?" a="Officially, Google drastically devalued the meta keywords tag back in 2009 due to immense keyword stuffing abuse. However, certain obscure international search engines (like Yandex and Baidu) alongside internal site-hosted crawlers still aggressively parse it for categorization." />
                <FaqItem q="Do I explicitly need to define the Language encoding?" a="It's highly recommended. Defining the language metadata acts as a fallback hint directly to Chrome Translate and accessibility screen readers, ensuring the browser accurately interprets special foreign characters without brute-forcing detection." />
                <FaqItem q="Where exactly do I paste these HTML outputs?" a="In your raw HTML file architecture, you must paste the entirety of the generated block physically inside the closing <head> tags, completely separate and isolated from the main visual <body> payload." />
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
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-lime-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-3">On This Page</h3>
                <div className="space-y-0.5">
                  {["Generator Builder", "Optimizing Layout", "Crawler Directives", "FAQ"].map(label => (
                    <a key={label} href={`#${label.toLowerCase().replace(/\s/g,"-")}`} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-lime-500 font-medium py-1.5 transition-colors">
                      <div className="w-1 h-1 rounded-full bg-lime-500/40 flex-shrink-0" />{label}
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
