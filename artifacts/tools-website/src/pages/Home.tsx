import { SEO } from "@/components/SEO";
import { Layout } from "@/components/Layout";
import { Link } from "wouter";
import {
  Search, ArrowRight, Zap, ShieldCheck, Smartphone, Ban,
  Calculator, KeyRound, Type, DollarSign, Ruler, Clock, Heart, HardHat,
  BookOpen, Gamepad2, Star, Users, ImageIcon, FileImage,
  Braces, PenTool, Share2, Search as SearchIcon, ShieldAlert,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { DISPLAY_TOOL_CATEGORIES, SITE_TOOL_COUNT, getCanonicalToolPath, getToolPath, type Tool } from "@/data/tools";
import {
  SITE_URL,
  createCollectionPageSchema,
} from "@/lib/seo";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  "math": <Calculator className="w-7 h-7" />,
  "finance": <DollarSign className="w-7 h-7" />,
  "conversion": <Ruler className="w-7 h-7" />,
  "time-date": <Clock className="w-7 h-7" />,
  "health": <Heart className="w-7 h-7" />,
  "construction": <HardHat className="w-7 h-7" />,
  "productivity": <Type className="w-7 h-7" />,
  "education": <BookOpen className="w-7 h-7" />,
  "gaming": <Gamepad2 className="w-7 h-7" />,
  "image": <ImageIcon className="w-7 h-7" />,
  "pdf": <FileImage className="w-7 h-7" />,
  "developer": <Braces className="w-7 h-7" />,
  "css-design": <PenTool className="w-7 h-7" />,
  "seo": <SearchIcon className="w-7 h-7" />,
  "security": <ShieldAlert className="w-7 h-7" />,
  "social-media": <Share2 className="w-7 h-7" />,
};

const CATEGORY_ICON_SM: Record<string, React.ReactNode> = {
  "Math & Calculators": <Calculator className="w-4 h-4" />,
  "Finance & Cost": <DollarSign className="w-4 h-4" />,
  "Conversion Tools": <Ruler className="w-4 h-4" />,
  "Time & Date": <Clock className="w-4 h-4" />,
  "Health & Fitness": <Heart className="w-4 h-4" />,
  "Construction & DIY": <HardHat className="w-4 h-4" />,
  "Productivity & Text": <Type className="w-4 h-4" />,
  "Student & Education": <BookOpen className="w-4 h-4" />,
  "Gaming Calculators": <Gamepad2 className="w-4 h-4" />,
  "Image Tools": <ImageIcon className="w-4 h-4" />,
  "PDF Tools": <FileImage className="w-4 h-4" />,
  "Developer Tools": <Braces className="w-4 h-4" />,
  "CSS & Design Tools": <PenTool className="w-4 h-4" />,
  "SEO Tools": <SearchIcon className="w-4 h-4" />,
  "Security & Encryption": <ShieldAlert className="w-4 h-4" />,
  "Social Media Tools": <Share2 className="w-4 h-4" />,
};

const CATEGORY_ICON_BY_ID: Record<string, React.ReactNode> = {
  "math": <Calculator className="w-3.5 h-3.5" />,
  "finance": <DollarSign className="w-3.5 h-3.5" />,
  "conversion": <Ruler className="w-3.5 h-3.5" />,
  "time-date": <Clock className="w-3.5 h-3.5" />,
  "health": <Heart className="w-3.5 h-3.5" />,
  "construction": <HardHat className="w-3.5 h-3.5" />,
  "productivity": <Type className="w-3.5 h-3.5" />,
  "education": <BookOpen className="w-3.5 h-3.5" />,
  "gaming": <Gamepad2 className="w-3.5 h-3.5" />,
  "image": <ImageIcon className="w-3.5 h-3.5" />,
  "pdf": <FileImage className="w-3.5 h-3.5" />,
  "developer": <Braces className="w-3.5 h-3.5" />,
  "css-design": <PenTool className="w-3.5 h-3.5" />,
  "seo": <SearchIcon className="w-3.5 h-3.5" />,
  "security": <ShieldAlert className="w-3.5 h-3.5" />,
  "social-media": <Share2 className="w-3.5 h-3.5" />,
};

const HERO_TILES = [
  { label: "CALCULATORS", hue: 217, icon: <Calculator className="w-8 h-8" /> },
  { label: "CONVERTERS", hue: 152, icon: <Ruler className="w-8 h-8" /> },
  { label: "FINANCE", hue: 25, icon: <DollarSign className="w-8 h-8" /> },
  { label: "HEALTH", hue: 340, icon: <Heart className="w-8 h-8" /> },
  { label: "PASSWORDS", hue: 265, icon: <KeyRound className="w-8 h-8" /> },
  { label: "TEXT TOOLS", hue: 175, icon: <Type className="w-8 h-8" /> },
];

const CATEGORY_COLORS: Record<string, string> = {
  "math": "bg-blue-500 text-white",
  "finance": "bg-emerald-500 text-white",
  "conversion": "bg-purple-500 text-white",
  "time-date": "bg-orange-500 text-white",
  "health": "bg-red-500 text-white",
  "construction": "bg-yellow-500 text-foreground",
  "productivity": "bg-teal-500 text-white",
  "education": "bg-indigo-500 text-white",
  "gaming": "bg-pink-500 text-white",
  "image": "bg-cyan-500 text-white",
  "pdf": "bg-rose-500 text-white",
  "developer": "bg-slate-500 text-white",
  "css-design": "bg-fuchsia-500 text-white",
  "seo": "bg-lime-500 text-foreground",
  "security": "bg-amber-500 text-foreground",
  "social-media": "bg-violet-500 text-white",
};

const CATEGORY_BG: Record<string, string> = {
  "math": "border-blue-500",
  "finance": "border-emerald-500",
  "conversion": "border-purple-500",
  "time-date": "border-orange-500",
  "health": "border-red-500",
  "construction": "border-yellow-500",
  "productivity": "border-teal-500",
  "education": "border-indigo-500",
  "gaming": "border-pink-500",
  "image": "border-cyan-500",
  "pdf": "border-rose-500",
  "developer": "border-slate-500",
  "css-design": "border-fuchsia-500",
  "seo": "border-lime-500",
  "security": "border-amber-500",
  "social-media": "border-violet-500",
};

// 18 unique color hues for card themes
const CARD_HUES = [
  217,  // blue
  265,  // purple
  152,  // emerald
  25,   // orange
  340,  // rose
  175,  // teal
  45,   // amber
  290,  // violet
  120,  // green
  355,  // red
  195,  // cyan
  310,  // fuchsia
  60,   // yellow-green
  230,  // royal blue
  15,   // vermillion
  165,  // mint
  275,  // lavender
  85,   // lime
];

// Badge labels (cycle through)
const CARD_BADGES = [
  "FREE", "\u26A1 POPULAR", "\u2713 VERIFIED", "FREE",
  "\uD83D\uDD25 HOT", "NEW", "PRO", "\u2605 4.9", "\uD83D\uDEE1 SECURE",
  "\u2728 TOP", "FAST", "\u2764 LOVED", "EASY", "\u26A1 QUICK",
  "TRUSTED", "\u2B50 5.0", "BEST", "SMART",
];

const HOMEPAGE_CATEGORY_PREVIEW_LIMIT = 4;
const OFFSCREEN_SECTION_STYLE = {
  contentVisibility: "auto",
  containIntrinsicSize: "900px",
} as const;

// Extract subtitle from title (e.g., "Simple Interest Calculator" → ["Simple Interest", "Calculator"])
function splitToolTitle(title: string): [string, string] {
  const subtitleWords = ["Calculator", "Converter", "Generator", "Checker", "Planner", "Counter", "Timer", "Tool", "Tracker", "Analyzer", "Estimator", "Remover", "Roller"];
  const lastSpace = title.lastIndexOf(" ");
  if (lastSpace === -1) return [title, ""];
  const lastWord = title.slice(lastSpace + 1);
  if (subtitleWords.includes(lastWord)) return [title.slice(0, lastSpace), lastWord];
  return [title, ""];
}

function ToolCard({ tool, colorIndex }: { tool: Tool; colorIndex: number }) {
  const hue = CARD_HUES[colorIndex % CARD_HUES.length];
  const badge = CARD_BADGES[colorIndex % CARD_BADGES.length];
  const icon = CATEGORY_ICON_SM[tool.category] ?? <Calculator className="w-5 h-5" />;
  const [mainTitle, subtitle] = splitToolTitle(tool.title);

  return (
    <div className="h-full">
      <Link
        href={getToolPath(tool.slug)}
        className="tool-card-active group"
        style={{ "--card-hue": hue } as React.CSSProperties}
      >
        <div className="flex items-start gap-3.5 flex-1">
          <div className="tool-icon-circle">
            {icon}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-bold text-[15px] text-foreground leading-tight">{mainTitle}</p>
            {subtitle && <p className="text-sm font-semibold text-muted-foreground">{subtitle}</p>}
            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{tool.description}</p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-auto pt-3">
          <span className="tool-badge">{badge}</span>
          <span className="tool-open-btn">
            Open Tool <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </Link>
    </div>
  );
}


export default function Home() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [showDeferredSections, setShowDeferredSections] = useState(false);

  const homepageCategories = useMemo(() => DISPLAY_TOOL_CATEGORIES, []);

  const homepageTools = useMemo(
    () => homepageCategories.flatMap((category) => category.tools),
    [homepageCategories],
  );

  const filteredTools = useMemo(() => {
    const raw = search.trim();
    const q = raw.toLowerCase();
    if (!q && activeCategory === "all") return null;

    const scoreTool = (t: Tool): number => {
      if (!q) return 1;
      const title = t.title.toLowerCase();
      // Only match against the title — never description or category
      if (!title.includes(q)) return 0;
      // Rank by match quality
      if (title === q) return 100;
      if (title.startsWith(q)) return 90;
      const titleWords = title.split(/\s+/);
      if (titleWords.some(w => w === q)) return 85;       // exact word in title
      if (titleWords.some(w => w.startsWith(q))) return 80; // word starts with query
      return 70; // query appears somewhere inside the title
    };

    const catName = activeCategory !== "all" ? homepageCategories.find(c => c.id === activeCategory)?.name : null;
    return homepageTools
      .map(t => ({ tool: t, score: scoreTool(t) }))
      .filter(({ tool, score }) => {
        const matchesSearch = !q || score > 0;
        const matchesCat = !catName || tool.category === catName;
        return matchesSearch && matchesCat;
      })
      .sort((a, b) => b.score - a.score)
      .map(({ tool }) => tool);
  }, [search, activeCategory, homepageCategories, homepageTools]);

  const totalTools = homepageTools.length;
  const displayCount = SITE_TOOL_COUNT;
  const liveTools = homepageTools.filter(t => t.implemented).length;
  const homeSchema = [
    createCollectionPageSchema({
      canonicalUrl: SITE_URL,
      name: "US Online Tools Home",
      description: `${displayCount} free online tools including calculators, converters, generators, and utilities.`,
    }),
  ];

  useEffect(() => {
    const loadDeferredSections = () => setShowDeferredSections(true);

    if ("requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(loadDeferredSections, { timeout: 1200 });
      return () => window.cancelIdleCallback(idleId);
    }

    const timeoutId = window.setTimeout(loadDeferredSections, 350);
    return () => window.clearTimeout(timeoutId);
  }, []);

  return (
    <Layout>
      <SEO
        title="Free Online Tools - US Online Tools"
        description={`${displayCount} free online tools including calculators, converters, generators, and utilities. No signup required. 100% free at usonlinetools.com.`}
        schema={homeSchema}
      />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden border-b-4 border-foreground">
        <div className="absolute inset-0 hero-gradient opacity-60 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 md:pt-10 md:pb-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary border-2 border-primary font-bold uppercase text-sm px-4 py-2 rounded-full mb-6">
              <Zap className="w-4 h-4" /> {displayCount} Free Tools — No Signup
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-foreground tracking-tighter leading-[0.9] uppercase mb-4">
              YOUR #1 SOURCE FOR{" "}
              <span className="inline-block bg-primary text-primary-foreground px-3 py-1 rotate-[-1deg] mt-1">FREE</span>{" "}
              ONLINE TOOLS
            </h1>
            <p className="text-lg text-muted-foreground font-medium mb-6 max-w-lg">
              Stop bookmarking dozens of sites. US Online Tools brings every calculator, converter, and generator you need — all in one place, always free.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#all-tools" className="px-6 py-3 bg-primary text-primary-foreground font-black uppercase tracking-wider rounded-xl border-2 border-foreground hard-shadow hover:-translate-y-1 transition-transform">
                Explore Tools
              </a>
              <a href="#categories" className="px-6 py-3 bg-background text-foreground font-black uppercase tracking-wider rounded-xl border-2 border-foreground hard-shadow hover:-translate-y-1 transition-transform">
                Browse Categories
              </a>
            </div>
          </div>
          {/* Right — 3D glossy square tile grid */}
          <div className="hidden lg:grid grid-cols-3 gap-5 max-w-md ml-auto">
            {HERO_TILES.map((tile) => (
              <div
                key={tile.label}
                className="hero-tile cursor-pointer"
                style={{ "--tile-hue": tile.hue } as React.CSSProperties}
              >
                <div className="hero-tile-icon">
                  {tile.icon}
                </div>
                <span className="hero-tile-label">{tile.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section className="bg-foreground text-background py-8 border-b-4 border-primary">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 divide-x divide-background/20">
          {[
            { number: `${displayCount}`, label: "Tools Available" },
            { number: "0", label: "Data Collected" },
            { number: "100%", label: "Free Forever" },
            { number: `${liveTools}`, label: "Live Tools" },
          ].map(({ number, label }) => (
            <div key={label} className="px-6 py-2 text-center">
              <div className="text-4xl font-black text-primary">{number}</div>
              <div className="text-sm font-bold uppercase tracking-wider text-background/70 mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SEARCH + FILTERS ── */}
      <section id="all-tools" className="relative py-16 bg-background overflow-hidden">
        {/* Subtle dot grid background */}
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, hsl(var(--border)) 1px, transparent 1px)", backgroundSize: "28px 28px", opacity: 0.4 }} />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary/3 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Search heading */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/30 font-bold text-xs uppercase tracking-widest px-4 py-2 rounded-full mb-5">
              <Search className="w-3.5 h-3.5" />
              Instant Search
            </div>
            <h2 className="text-4xl md:text-[3.25rem] font-black tracking-tighter text-foreground leading-tight">
              Find the{" "}
              <span className="relative inline-block">
                <span className="text-primary">Perfect Tool</span>
                <svg className="absolute -bottom-1 left-0 w-full" height="6" viewBox="0 0 200 6" fill="none" preserveAspectRatio="none">
                  <path d="M0 5 Q50 0 100 5 Q150 10 200 5" stroke="hsl(var(--primary))" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.5" />
                </svg>
              </span>
            </h2>
            <p className="text-muted-foreground font-medium mt-4 text-lg">
              {displayCount} free tools at your fingertips
            </p>
            <p className="text-sm text-muted-foreground/80 mt-3">
              The homepage shows fast-loading previews. Use search or category pages for the full library.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative max-w-2xl mx-auto mb-10">
            <div className={`flex items-center bg-card border-2 rounded-2xl transition-all duration-200 shadow-sm ${search ? "border-primary shadow-[0_0_0_4px_hsl(var(--primary)/0.12)]" : "border-border hover:border-primary/50"}`}>
              <div className="flex items-center justify-center w-14 h-14 flex-shrink-0">
                <Search className={`w-5 h-5 transition-colors ${search ? "text-primary" : "text-muted-foreground"}`} />
              </div>
              <input
                type="text"
                placeholder={`Search tools — try 'ROI', 'BMI', 'gradient'...`}
                className="flex-1 bg-transparent py-4 pr-2 text-foreground placeholder:text-muted-foreground font-medium focus:outline-none text-base"
                value={search}
                onChange={e => setSearch(e.target.value)}
                autoComplete="off"
                spellCheck={false}
              />
              {search ? (
                <button
                  onClick={() => setSearch("")}
                  className="mr-3 w-8 h-8 flex items-center justify-center rounded-full bg-primary/10 hover:bg-primary hover:text-primary-foreground text-primary transition-all flex-shrink-0 font-black text-base"
                  aria-label="Clear search"
                >
                  ×
                </button>
              ) : (
                <div className="hidden md:flex items-center gap-0.5 mr-4 text-[11px] text-muted-foreground font-bold border border-border rounded-md px-2 py-1 flex-shrink-0 bg-muted/60 select-none">
                  <span>⌘</span><span>K</span>
                </div>
              )}
            </div>

            {/* Live result count badge */}
            {search && filteredTools !== null && (
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[11px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full shadow-sm whitespace-nowrap">
                {filteredTools.length} result{filteredTools.length !== 1 ? "s" : ""} found
              </div>
            )}
          </div>

          {/* Category pills */}
          <div className="mb-14 mt-8">
            {/* 17 items: ALL TOOLS col-span-2 → 3 perfect rows of 6 on desktop */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
              <button
                onClick={() => { setActiveCategory("all"); setSearch(""); }}
                className={`col-span-2 md:col-span-2 lg:col-span-2 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full text-[13px] font-bold border-2 transition-all duration-150 ${
                  activeCategory === "all"
                    ? "bg-primary text-primary-foreground border-primary shadow-[0_3px_0_0_hsl(var(--primary)/0.5)]"
                    : "bg-card text-foreground border-border hover:border-primary/60 hover:text-primary"
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                ALL TOOLS
                <span className={`text-[11px] font-black px-1.5 py-0.5 rounded-full ${activeCategory === "all" ? "bg-primary-foreground/20" : "bg-muted"}`}>
                  {totalTools}
                </span>
              </button>
              {homepageCategories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => { setActiveCategory(cat.id); setSearch(""); }}
                  className={`inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-full text-[13px] font-bold border-2 transition-all duration-150 ${
                    activeCategory === cat.id
                      ? "bg-primary text-primary-foreground border-primary shadow-[0_3px_0_0_hsl(var(--primary)/0.5)]"
                      : "bg-card text-foreground border-border hover:border-primary/60 hover:text-primary"
                  }`}
                >
                  {CATEGORY_ICON_BY_ID[cat.id]}
                  <span className="truncate">{cat.name.toUpperCase()}</span>
                  <span className={`text-[11px] font-black px-1.5 py-0.5 rounded-full flex-shrink-0 ${activeCategory === cat.id ? "bg-primary-foreground/20" : "bg-muted"}`}>
                    {cat.tools.length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Search Results */}
          {filteredTools !== null && (
            <div>
              {filteredTools.length === 0 ? (
                <div className="text-center py-20 glass-card rounded-2xl">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <Search className="w-7 h-7 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-black text-foreground">No tools found</h3>
                  <p className="text-muted-foreground mt-2">Try a different search term or browse categories above.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTools.map((tool, i) => <ToolCard key={tool.slug} tool={tool} colorIndex={i} />)}
                </div>
              )}
            </div>
          )}

          {/* All categories (default) */}
          {filteredTools === null && (
            <div className="space-y-16">
              {homepageCategories.slice(0, showDeferredSections ? homepageCategories.length : 6).map(cat => (
                  <div key={cat.id} id={cat.id} style={OFFSCREEN_SECTION_STYLE}>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg ${CATEGORY_COLORS[cat.id]} flex items-center justify-center border-2 border-foreground`}>
                          {CATEGORY_ICONS[cat.id]}
                        </div>
                        <div>
                          <h2 className={`text-2xl font-black uppercase tracking-tight text-foreground border-l-4 ${CATEGORY_BG[cat.id]} pl-3`}>
                            {cat.name}
                          </h2>
                          <p className="text-sm text-muted-foreground font-medium">
                            Top {Math.min(HOMEPAGE_CATEGORY_PREVIEW_LIMIT, cat.tools.length)} of {cat.tools.length} tools
                          </p>
                        </div>
                      </div>
                      <Link
                        href={`/category/${cat.id}`}
                        className="hidden sm:flex items-center gap-2 text-sm font-bold text-primary hover:underline uppercase tracking-wider"
                      >
                        VIEW ALL <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {cat.tools.slice(0, HOMEPAGE_CATEGORY_PREVIEW_LIMIT).map((tool, i) => (
                        <ToolCard key={tool.slug} tool={tool} colorIndex={i} />
                      ))}
                    </div>

                    <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 mt-6 py-3 text-sm text-muted-foreground font-medium">
                      <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-500" /> 100% Free Tools</span>
                      <span className="inline-flex items-center gap-1.5"><Zap className="w-4 h-4 text-amber-500" /> Instant Results</span>
                      <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-blue-500" /> No Signup Required</span>
                      <span className="inline-flex items-center gap-1.5"><Smartphone className="w-4 h-4 text-purple-500" /> Mobile Friendly</span>
                    </div>
                  </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CATEGORIES SHOWCASE ── */}
      {showDeferredSections ? (
        <>
      <section id="categories" className="py-20 bg-muted/30 border-t-4 border-border" style={OFFSCREEN_SECTION_STYLE}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-4xl font-black uppercase tracking-tighter text-foreground border-l-8 border-primary pl-4">
              Browse by Category
            </h2>
            <p className="text-muted-foreground font-medium mt-2 ml-5">
              {homepageCategories.length} categories · {displayCount} tools total
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {homepageCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => { setActiveCategory(cat.id); document.getElementById("all-tools")?.scrollIntoView({ behavior: "smooth" }); }}
                className="group text-left bg-card border-2 border-border hover:border-primary rounded-xl p-6 hard-shadow hover:-translate-y-1 transition-all duration-200 cursor-pointer"
              >
                <div className={`w-12 h-12 rounded-xl ${CATEGORY_COLORS[cat.id]} flex items-center justify-center border-2 border-foreground mb-4`}>
                  {CATEGORY_ICONS[cat.id]}
                </div>
                <h3 className="text-lg font-black uppercase tracking-tight text-foreground mb-1 group-hover:text-primary transition-colors">
                  {cat.name}
                </h3>
                <p className="text-sm text-muted-foreground font-medium mb-3">{cat.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground bg-muted px-3 py-1 rounded-full">
                    {cat.tools.length} tools
                  </span>
                  <ArrowRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section className="py-20 bg-background border-t-4 border-border" style={OFFSCREEN_SECTION_STYLE}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-black uppercase tracking-tighter text-foreground">
              Why Choose US Online Tools?
            </h2>
            <p className="text-muted-foreground font-medium mt-3 max-w-2xl mx-auto">
              Built for simplicity, speed, and privacy. Everything you need, nothing you don't.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <Zap className="w-7 h-7" />, color: "bg-[#FFD23F] text-foreground", title: "100% Free Forever", desc: "No paywalls, no subscriptions, no credit cards. Every tool is free." },
              { icon: <Users className="w-7 h-7" />, color: "bg-[#FF6B35] text-white", title: "No Registration", desc: "Start using any tool instantly. We never ask for your email or personal info." },
              { icon: <ShieldCheck className="w-7 h-7" />, color: "bg-[#00D4AA] text-white", title: "Privacy First", desc: "All tools run in your browser. Your data never leaves your device." },
              { icon: <Smartphone className="w-7 h-7" />, color: "bg-indigo-500 text-white", title: "Mobile Friendly", desc: "Fully responsive. Works perfectly on any phone, tablet, or desktop." },
              { icon: <Ban className="w-7 h-7" />, color: "bg-red-500 text-white", title: "No Annoying Ads", desc: "Clean, distraction-free experience. No pop-ups or interruptions." },
              { icon: <Star className="w-7 h-7" />, color: "bg-pink-500 text-white", title: "Always Growing", desc: "New tools added regularly. Bookmark usonlinetools.com and check back often." },
            ].map(({ icon, color, title, desc }) => (
              <div key={title} className="bg-card border-2 border-border rounded-xl p-6 hover:border-primary transition-colors hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
                <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center border-2 border-foreground mb-4`}>
                  {icon}
                </div>
                <h3 className="text-lg font-black uppercase tracking-tight text-foreground mb-2">{title}</h3>
                <p className="text-muted-foreground font-medium text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 bg-foreground text-background" style={OFFSCREEN_SECTION_STYLE}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-black uppercase tracking-tighter text-primary text-center mb-16">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {[
              { n: "01", title: "Find Your Tool", desc: "Search or browse by category to find the tool you need from our library of 120+ utilities." },
              { n: "02", title: "Enter Your Data", desc: "Type in your values — no forms, no sign-ups, no loading screens. Just instant results." },
              { n: "03", title: "Get Results", desc: "See your answer instantly. Copy, share, or bookmark the result with a single click." },
            ].map(({ n, title, desc }) => (
              <div
                key={n}
                className="text-center"
              >
                <div className="text-8xl font-black text-primary leading-none mb-4">{n}</div>
                <h3 className="text-2xl font-black uppercase tracking-tight text-background mb-3">{title}</h3>
                <p className="text-background/70 font-medium">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SEO CONTENT ── */}
      <section className="py-16 bg-background border-t-4 border-border" style={OFFSCREEN_SECTION_STYLE}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-l-8 border-primary pl-6 bg-card border-2 border-border rounded-r-xl p-8">
            <h2 className="text-2xl font-black uppercase tracking-tight text-foreground mb-4">
              About US Online Tools
            </h2>
            <p className="text-muted-foreground font-medium leading-relaxed mb-4">
              <strong className="text-foreground">US Online Tools</strong> (usonlinetools.com) is your go-to source for free, fast, and private online utilities. Whether you need a{" "}
              <Link href={getCanonicalToolPath("percentage-calculator")} className="text-primary font-bold hover:underline">Percentage Calculator</Link>,{" "}
              <Link href={getCanonicalToolPath("password-generator")} className="text-primary font-bold hover:underline">Password Generator</Link>,{" "}
              <Link href={getCanonicalToolPath("bmi-calculator")} className="text-primary font-bold hover:underline">BMI Calculator</Link>,{" "}
              <Link href={getCanonicalToolPath("loan-emi-calculator")} className="text-primary font-bold hover:underline">Loan EMI Calculator</Link>,{" "}
              <Link href={getCanonicalToolPath("color-converter")} className="text-primary font-bold hover:underline">Color Converter</Link>, or a{" "}
              <Link href={getCanonicalToolPath("gpa-calculator")} className="text-primary font-bold hover:underline">GPA Calculator</Link>{" "}
              — we have everything covered across {homepageCategories.length} categories.
            </p>
            <p className="text-muted-foreground font-medium leading-relaxed">
              All tools run entirely in your browser with no data collection, no registration, and no hidden fees. From finance calculators like the{" "}
              <Link href={getCanonicalToolPath("compound-interest-calculator")} className="text-primary font-bold hover:underline">Compound Interest Calculator</Link> to gaming tools like the{" "}
              <Link href={getCanonicalToolPath("roblox-tax-calculator")} className="text-primary font-bold hover:underline">Roblox Tax Calculator</Link>,{" "}
              usonlinetools.com is built for everyone.
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="bg-primary border-t-4 border-foreground py-16" style={OFFSCREEN_SECTION_STYLE}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-primary-foreground mb-4">
            Bookmark usonlinetools.com
          </h2>
          <p className="text-primary-foreground/80 font-medium text-xl mb-8">
            Never struggle with online tasks again. {displayCount} tools, all free, all instant.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="#all-tools" className="px-8 py-4 bg-background text-foreground font-black uppercase tracking-wider rounded-xl border-2 border-foreground hard-shadow hover:-translate-y-1 transition-transform">
              Explore All Tools
            </a>
            <button
              onClick={() => navigator.clipboard.writeText("https://usonlinetools.com")}
              className="px-8 py-4 bg-primary-foreground/10 text-primary-foreground font-black uppercase tracking-wider rounded-xl border-2 border-primary-foreground hover:-translate-y-1 transition-transform"
            >
              Copy Site URL
            </button>
          </div>
        </div>
      </section>
        </>
      ) : null}
    </Layout>
  );
}
