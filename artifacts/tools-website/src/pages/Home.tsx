import { SEO } from "@/components/SEO";
import { Layout } from "@/components/Layout";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  Calculator, 
  KeyRound, 
  Type, 
  CalendarDays, 
  Palette,
  Search,
  ArrowRight,
  Zap,
  ShieldCheck,
  Smartphone,
  Ban,
  RefreshCw,
  SearchCheck,
  CheckCircle,
  BarChart,
  Code
} from "lucide-react";
import { useState } from "react";

const TOOLS = [
  {
    title: "Percentage Calculator",
    description: "Easily calculate percentages, increases, and decreases.",
    icon: <Calculator className="w-8 h-8" />,
    path: "/tools/percentage-calculator",
    color: "from-blue-500 to-cyan-400",
    category: "Calculators"
  },
  {
    title: "Password Generator",
    description: "Create strong, secure, and random passwords instantly.",
    icon: <KeyRound className="w-8 h-8" />,
    path: "/tools/password-generator",
    color: "from-purple-500 to-indigo-500",
    category: "Generators"
  },
  {
    title: "Word Counter",
    description: "Count words, characters, and estimate reading time.",
    icon: <Type className="w-8 h-8" />,
    path: "/tools/word-counter",
    color: "from-orange-500 to-red-500",
    category: "Text"
  },
  {
    title: "Age Calculator",
    description: "Calculate precise age and countdown to next birthday.",
    icon: <CalendarDays className="w-8 h-8" />,
    path: "/tools/age-calculator",
    color: "from-emerald-400 to-teal-500",
    category: "Calculators"
  },
  {
    title: "Color Converter",
    description: "Convert colors between HEX, RGB, and HSL formats.",
    icon: <Palette className="w-8 h-8" />,
    path: "/tools/color-converter",
    color: "from-pink-500 to-rose-400",
    category: "Converters"
  }
];

const CATEGORIES = [
  { name: "Calculators", icon: <Calculator />, count: "12 tools", color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" },
  { name: "Generators", icon: <Zap />, count: "8 tools", color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400" },
  { name: "Converters", icon: <RefreshCw />, count: "15 tools", color: "bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400" },
  { name: "Text Tools", icon: <Type />, count: "10 tools", color: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400" },
  { name: "Math Tools", icon: <BarChart />, count: "9 tools", color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" },
  { name: "SEO Tools", icon: <SearchCheck />, count: "6 tools", color: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400" }
];

export default function Home() {
  const [search, setSearch] = useState("");

  const filteredTools = TOOLS.filter(t => 
    t.title.toLowerCase().includes(search.toLowerCase()) || 
    t.description.toLowerCase().includes(search.toLowerCase()) ||
    t.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <SEO 
        title="200+ Free Online Tools" 
        description="A beautiful, fast, and free collection of web utilities. Calculators, converters, generators and more." 
      />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden bg-background">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-card border-primary/20 mb-8 text-primary shadow-sm bg-primary/5">
              <Zap className="w-4 h-4" />
              <span className="text-sm font-semibold">Lighting Fast & 100% Client-side</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-foreground tracking-tight mb-6">
              The ultimate toolkit for <br className="hidden md:block" />
              <span className="neon-text">modern creators.</span>
            </h1>
            
            <p className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Stop bookmarking dozens of websites. US Online Tools brings you everything you need in one beautiful, ad-free interface.
            </p>

            <div className="max-w-2xl mx-auto relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
              <div className="relative glass-card flex items-center p-2 rounded-2xl bg-card">
                <Search className="w-6 h-6 text-muted-foreground ml-4" />
                <input 
                  type="text" 
                  placeholder="Search for tools (e.g., 'password', 'color')..."
                  className="w-full bg-transparent border-none text-foreground px-4 py-4 focus:outline-none placeholder:text-muted-foreground/70 text-lg"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section A: Stats Bar */}
      <section className="py-10 bg-primary text-primary-foreground border-y border-primary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-primary-foreground/20">
            <div>
              <div className="text-3xl md:text-4xl font-black mb-1">200+</div>
              <div className="text-primary-foreground/80 font-medium">Tools</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-black mb-1">1M+</div>
              <div className="text-primary-foreground/80 font-medium">Users</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-black mb-1">100%</div>
              <div className="text-primary-foreground/80 font-medium">Free</div>
            </div>
            <div>
              <div className="text-xl md:text-2xl font-black mb-1 mt-1">No Signup</div>
              <div className="text-primary-foreground/80 font-medium">Required</div>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Grid Section */}
      <section className="py-24 relative z-10 bg-muted/30" id="tools">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Featured Tools</h2>
              <p className="text-muted-foreground">Everything you need, right at your fingertips.</p>
            </div>
            <div className="mt-6 md:mt-0 flex flex-wrap gap-2">
              {['All', 'Calculators', 'Generators', 'Converters', 'Text'].map((cat) => (
                <button key={cat} className="px-4 py-2 rounded-full text-sm font-medium bg-background border border-border hover:border-primary/50 hover:text-primary transition-colors text-foreground shadow-sm">
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {filteredTools.length === 0 ? (
            <div className="text-center py-20 glass-card rounded-3xl">
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-medium text-foreground">No tools found</h3>
              <p className="text-muted-foreground">Try a different search term.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTools.map((tool, idx) => (
                <motion.div
                  key={tool.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Link 
                    href={tool.path}
                    className="block group h-full glass-card p-6 rounded-3xl hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        {tool.icon}
                      </div>
                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        {tool.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {tool.title}
                    </h3>
                    <p className="text-muted-foreground mb-6 line-clamp-2">
                      {tool.description}
                    </p>
                    <div className="flex items-center text-sm font-medium text-primary opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                      Open Tool <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* Section B: Tool Categories Showcase */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Explore Categories</h2>
            <p className="text-muted-foreground text-lg">Find exactly what you need from our neatly organized collections of utilities.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CATEGORIES.map((cat, idx) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="glass-card p-6 rounded-3xl flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${cat.color} group-hover:scale-110 transition-transform`}>
                    {cat.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-lg">{cat.name}</h3>
                    <p className="text-sm text-muted-foreground">{cat.count}</p>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors text-muted-foreground">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section C: Why Choose US Online Tools? */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Why Choose US Online Tools?</h2>
            <p className="text-muted-foreground text-lg">We built this platform to be the exact opposite of the ad-heavy, slow, and clunky tools you're used to.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="glass-card p-8 rounded-3xl">
              <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 flex items-center justify-center mb-6">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">100% Free Forever</h3>
              <p className="text-muted-foreground">No paywalls, no premium subscriptions, no hidden limits. Everything is free to use.</p>
            </div>
            
            <div className="glass-card p-8 rounded-3xl">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 flex items-center justify-center mb-6">
                <Code className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">No Registration</h3>
              <p className="text-muted-foreground">Don't want to create another account? Neither do we. Start using any tool instantly.</p>
            </div>

            <div className="glass-card p-8 rounded-3xl">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Privacy First</h3>
              <p className="text-muted-foreground">Your data never leaves your device. All tools execute locally inside your browser.</p>
            </div>

            <div className="glass-card p-8 rounded-3xl">
              <div className="w-12 h-12 rounded-xl bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400 flex items-center justify-center mb-6">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Mobile Friendly</h3>
              <p className="text-muted-foreground">Designed to work flawlessly on your phone, tablet, or desktop computer.</p>
            </div>

            <div className="glass-card p-8 rounded-3xl">
              <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 flex items-center justify-center mb-6">
                <Ban className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">No Ads</h3>
              <p className="text-muted-foreground">Enjoy a clean, distraction-free interface without annoying popups or banners.</p>
            </div>

            <div className="glass-card p-8 rounded-3xl">
              <div className="w-12 h-12 rounded-xl bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400 flex items-center justify-center mb-6">
                <RefreshCw className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Regular Updates</h3>
              <p className="text-muted-foreground">We continuously add new tools and improve existing ones based on your feedback.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section D: How It Works */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">How It Works</h2>
            <p className="text-muted-foreground text-lg">Three simple steps to boost your productivity.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-border z-0"></div>
            
            <div className="relative z-10 text-center flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-background border-4 border-border flex items-center justify-center text-3xl font-black text-primary mb-6 shadow-sm">1</div>
              <h3 className="text-2xl font-bold text-foreground mb-3">Find Your Tool</h3>
              <p className="text-muted-foreground">Use the search bar or browse our categories to find the exact utility you need.</p>
            </div>
            
            <div className="relative z-10 text-center flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-background border-4 border-primary flex items-center justify-center text-3xl font-black text-primary mb-6 shadow-sm">2</div>
              <h3 className="text-2xl font-bold text-foreground mb-3">Enter Your Data</h3>
              <p className="text-muted-foreground">Input your text, numbers, or files. Everything stays secure on your device.</p>
            </div>
            
            <div className="relative z-10 text-center flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-primary border-4 border-primary text-primary-foreground flex items-center justify-center text-3xl font-black mb-6 shadow-md">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">Get Instant Results</h3>
              <p className="text-muted-foreground">Watch results update in real-time as you type. Copy and use immediately.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section E: Popular Tool Categories (SEO text) */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 text-center">Your Go-To Resource for Online Utilities</h2>
            <p className="text-muted-foreground leading-relaxed text-center">
              US Online Tools is your comprehensive platform for free online utilities designed to save you time. 
              Whether you're a developer needing a <Link href="/tools/color-converter" className="text-primary hover:underline">Color Converter</Link>, 
              a student using our <Link href="/tools/percentage-calculator" className="text-primary hover:underline">Percentage Calculator</Link>, 
              a writer depending on our precise <Link href="/tools/word-counter" className="text-primary hover:underline">Word Counter</Link>, 
              or anyone looking for a secure <Link href="/tools/password-generator" className="text-primary hover:underline">Password Generator</Link> and 
              an easy-to-use <Link href="/tools/age-calculator" className="text-primary hover:underline">Age Calculator</Link> — we have you covered. 
              Our commitment is to provide fast, privacy-focused, and completely free web tools for everyone.
            </p>
          </div>
        </div>
      </section>

      {/* Section F: CTA Banner */}
      <section className="py-24 bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card rounded-3xl p-10 md:p-16 text-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 border-primary/20 relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-black text-foreground mb-6 tracking-tight">
                Bookmark <span className="text-primary">usonlinetools.com</span> and never struggle with online tasks again.
              </h2>
              <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                Join over 1 million users who trust our suite of free online utilities every month.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href="#tools" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-1">
                  Explore All Tools
                </a>
                <button 
                  onClick={() => navigator.clipboard.writeText(window.location.href)}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-background border border-border text-foreground font-bold text-lg hover:border-primary/50 hover:text-primary transition-all shadow-sm"
                >
                  Share with Friends
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}