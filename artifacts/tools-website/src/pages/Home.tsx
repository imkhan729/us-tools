import { SEO } from "@/components/SEO";
import { Layout } from "@/components/Layout";
import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  Search, ArrowRight, Zap, ShieldCheck, Smartphone, Ban,
  Calculator, KeyRound, Type, CalendarDays, Palette,
  DollarSign, Ruler, Clock, Heart, HardHat, BookOpen, Gamepad2,
  Wrench, Star, Users, ChevronRight
} from "lucide-react";
import { useState, useMemo } from "react";
import { TOOL_CATEGORIES, ALL_TOOLS, type Tool } from "@/data/tools";

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
};

const TOOL_ICON_MAP: Record<string, React.ReactNode> = {
  "percentage-calculator": <Calculator className="w-5 h-5" />,
  "password-generator": <KeyRound className="w-5 h-5" />,
  "word-counter": <Type className="w-5 h-5" />,
  "age-calculator": <CalendarDays className="w-5 h-5" />,
  "color-converter": <Palette className="w-5 h-5" />,
};

const HERO_TILES = [
  { label: "PASSWORDS", color: "bg-[#FF6B35]", icon: <KeyRound className="w-10 h-10 text-white" /> },
  { label: "CALCULATORS", color: "bg-[#00D4AA]", icon: <Calculator className="w-10 h-10 text-foreground" /> },
  { label: "TEXT TOOLS", color: "bg-[#FFD23F]", icon: <Type className="w-10 h-10 text-foreground" /> },
  { label: "CONVERTERS", color: "bg-foreground", icon: <Ruler className="w-10 h-10 text-background" /> },
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
};

function ToolCard({ tool }: { tool: Tool }) {
  const icon = TOOL_ICON_MAP[tool.slug] || <Wrench className="w-5 h-5" />;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
    >
      <Link
        href={`/tools/${tool.slug}`}
        className="group flex items-center gap-3 p-3 rounded-lg bg-card border-2 border-border hover:border-primary hover:-translate-y-0.5 transition-all duration-200 hover:shadow-[2px_2px_0px_0px_hsl(var(--foreground)/0.15)]"
      >
        <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 border border-primary/20 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors leading-tight">
            {tool.title}
          </p>
          {tool.implemented && (
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">Live ✓</span>
          )}
        </div>
        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all flex-shrink-0" />
      </Link>
    </motion.div>
  );
}

export default function Home() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredTools = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q && activeCategory === "all") return null;
    return ALL_TOOLS.filter(t => {
      const matchesSearch = !q || t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q);
      const matchesCat = activeCategory === "all" || TOOL_CATEGORIES.find(c => c.id === activeCategory)?.name === t.category;
      return matchesSearch && matchesCat;
    });
  }, [search, activeCategory]);

  const totalTools = ALL_TOOLS.length;
  const liveTools = ALL_TOOLS.filter(t => t.implemented).length;

  return (
    <Layout>
      <SEO
        title="Free Online Tools - US Online Tools"
        description={`${totalTools}+ free online tools including calculators, converters, generators, and utilities. No signup required. 100% free at usonlinetools.com.`}
      />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden border-b-4 border-foreground">
        <div className="absolute inset-0 hero-gradient opacity-60 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 md:pt-10 md:pb-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary border-2 border-primary font-bold uppercase text-sm px-4 py-2 rounded-full mb-6">
              <Zap className="w-4 h-4" /> {totalTools}+ Free Tools — No Signup
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
          {/* Right — tile grid */}
          <div className="hidden lg:grid grid-cols-2 gap-3">
            {HERO_TILES.map((tile, i) => (
              <motion.div
                key={tile.label}
                initial={{ opacity: 0, y: 20, rotate: i % 2 === 0 ? -2 : 2 }}
                animate={{ opacity: 1, y: 0, rotate: i % 2 === 0 ? -2 : 2 }}
                whileHover={{ y: -8, scale: 1.04, rotate: 0, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.96 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className={`${tile.color} rounded-2xl border-4 border-foreground hard-shadow p-5 flex flex-col items-center justify-center cursor-pointer`}
                style={{ height: "150px" }}
              >
                {tile.icon}
                <span className="mt-2 font-black uppercase tracking-wider text-xs">{tile.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section className="bg-foreground text-background py-8 border-b-4 border-primary">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 divide-x divide-background/20">
          {[
            { number: `${totalTools}+`, label: "Tools Available" },
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
      <section id="all-tools" className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search tools (e.g. 'BMI', 'Roblox', 'Mortgage')..."
                className="w-full pl-12 pr-4 py-3 bg-card border-2 border-border rounded-xl text-foreground placeholder:text-muted-foreground font-medium focus:outline-none focus:border-primary transition-colors"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => { setActiveCategory("all"); setSearch(""); }}
                className={`px-4 py-2 rounded-full font-bold uppercase text-xs tracking-wider border-2 transition-colors ${activeCategory === "all" ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border hover:border-primary hover:text-primary"}`}
              >
                All
              </button>
              {TOOL_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => { setActiveCategory(cat.id); setSearch(""); }}
                  className={`px-4 py-2 rounded-full font-bold uppercase text-xs tracking-wider border-2 transition-colors ${activeCategory === cat.id ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border hover:border-primary hover:text-primary"}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Search Results */}
          {filteredTools !== null && (
            <div>
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-6">
                {filteredTools.length} result{filteredTools.length !== 1 ? "s" : ""} found
              </p>
              {filteredTools.length === 0 ? (
                <div className="text-center py-20 bg-card border-2 border-dashed border-border rounded-xl">
                  <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-black uppercase text-foreground">No tools found</h3>
                  <p className="text-muted-foreground mt-2">Try a different search term.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {filteredTools.map(tool => <ToolCard key={tool.slug} tool={tool} />)}
                </div>
              )}
            </div>
          )}

          {/* All categories (default) */}
          {filteredTools === null && (
            <div className="space-y-16">
              {TOOL_CATEGORIES.map(cat => (
                <div key={cat.id} id={cat.id}>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg ${CATEGORY_COLORS[cat.id]} flex items-center justify-center border-2 border-foreground`}>
                        {CATEGORY_ICONS[cat.id]}
                      </div>
                      <div>
                        <h2 className={`text-2xl font-black uppercase tracking-tight text-foreground border-l-4 ${CATEGORY_BG[cat.id]} pl-3`}>
                          {cat.name}
                        </h2>
                        <p className="text-sm text-muted-foreground font-medium">{cat.tools.length} tools</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveCategory(cat.id)}
                      className="hidden sm:flex items-center gap-2 text-sm font-bold text-primary hover:underline uppercase tracking-wider"
                    >
                      View All <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {cat.tools.map(tool => <ToolCard key={tool.slug} tool={tool} />)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CATEGORIES SHOWCASE ── */}
      <section id="categories" className="py-20 bg-muted/30 border-t-4 border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-4xl font-black uppercase tracking-tighter text-foreground border-l-8 border-primary pl-4">
              Browse by Category
            </h2>
            <p className="text-muted-foreground font-medium mt-2 ml-5">
              {TOOL_CATEGORIES.length} categories · {totalTools}+ tools total
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {TOOL_CATEGORIES.map((cat, i) => (
              <motion.button
                key={cat.id}
                onClick={() => { setActiveCategory(cat.id); document.getElementById("all-tools")?.scrollIntoView({ behavior: "smooth" }); }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
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
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section className="py-20 bg-background border-t-4 border-border">
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
      <section className="py-20 bg-foreground text-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-black uppercase tracking-tighter text-primary text-center mb-16">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {[
              { n: "01", title: "Find Your Tool", desc: "Search or browse by category to find the tool you need from our library of 120+ utilities." },
              { n: "02", title: "Enter Your Data", desc: "Type in your values — no forms, no sign-ups, no loading screens. Just instant results." },
              { n: "03", title: "Get Results", desc: "See your answer instantly. Copy, share, or bookmark the result with a single click." },
            ].map(({ n, title, desc }, i) => (
              <motion.div
                key={n}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center"
              >
                <div className="text-8xl font-black text-primary leading-none mb-4">{n}</div>
                <h3 className="text-2xl font-black uppercase tracking-tight text-background mb-3">{title}</h3>
                <p className="text-background/70 font-medium">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SEO CONTENT ── */}
      <section className="py-16 bg-background border-t-4 border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-l-8 border-primary pl-6 bg-card border-2 border-border rounded-r-xl p-8">
            <h2 className="text-2xl font-black uppercase tracking-tight text-foreground mb-4">
              About US Online Tools
            </h2>
            <p className="text-muted-foreground font-medium leading-relaxed mb-4">
              <strong className="text-foreground">US Online Tools</strong> (usonlinetools.com) is your go-to source for free, fast, and private online utilities. Whether you need a{" "}
              <Link href="/tools/percentage-calculator" className="text-primary font-bold hover:underline">Percentage Calculator</Link>,{" "}
              <Link href="/tools/password-generator" className="text-primary font-bold hover:underline">Password Generator</Link>,{" "}
              <Link href="/tools/bmi-calculator" className="text-primary font-bold hover:underline">BMI Calculator</Link>,{" "}
              <Link href="/tools/loan-emi-calculator" className="text-primary font-bold hover:underline">Loan EMI Calculator</Link>,{" "}
              <Link href="/tools/color-converter" className="text-primary font-bold hover:underline">Color Converter</Link>, or a{" "}
              <Link href="/tools/gpa-calculator" className="text-primary font-bold hover:underline">GPA Calculator</Link>{" "}
              — we have everything covered across {TOOL_CATEGORIES.length} categories.
            </p>
            <p className="text-muted-foreground font-medium leading-relaxed">
              All tools run entirely in your browser with no data collection, no registration, and no hidden fees. From finance calculators like the{" "}
              <Link href="/tools/compound-interest-calculator" className="text-primary font-bold hover:underline">Compound Interest Calculator</Link> to gaming tools like the{" "}
              <Link href="/tools/roblox-tax-calculator" className="text-primary font-bold hover:underline">Roblox Tax Calculator</Link>,{" "}
              usonlinetools.com is built for everyone.
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="bg-primary border-t-4 border-foreground py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-primary-foreground mb-4">
            Bookmark usonlinetools.com
          </h2>
          <p className="text-primary-foreground/80 font-medium text-xl mb-8">
            Never struggle with online tasks again. {totalTools}+ tools, all free, all instant.
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
    </Layout>
  );
}
