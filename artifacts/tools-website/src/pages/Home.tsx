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
    color: "bg-[#00D4AA]",
    category: "Calculators"
  },
  {
    title: "Password Generator",
    description: "Create strong, secure, and random passwords instantly.",
    icon: <KeyRound className="w-8 h-8" />,
    path: "/tools/password-generator",
    color: "bg-[#FF6B35]",
    category: "Generators"
  },
  {
    title: "Word Counter",
    description: "Count words, characters, and estimate reading time.",
    icon: <Type className="w-8 h-8" />,
    path: "/tools/word-counter",
    color: "bg-[#FFD23F]",
    category: "Text"
  },
  {
    title: "Age Calculator",
    description: "Calculate precise age and countdown to next birthday.",
    icon: <CalendarDays className="w-8 h-8" />,
    path: "/tools/age-calculator",
    color: "bg-[#00D4AA]",
    category: "Calculators"
  },
  {
    title: "Color Converter",
    description: "Convert colors between HEX, RGB, and HSL formats.",
    icon: <Palette className="w-8 h-8" />,
    path: "/tools/color-converter",
    color: "bg-[#FFD23F]",
    category: "Converters"
  }
];

const CATEGORIES = [
  { name: "Calculators", icon: <Calculator />, count: "12 tools", color: "bg-[#FF6B35] text-white" },
  { name: "Generators", icon: <Zap />, count: "8 tools", color: "bg-[#00D4AA] text-black" },
  { name: "Converters", icon: <RefreshCw />, count: "15 tools", color: "bg-[#FFD23F] text-black" },
  { name: "Text Tools", icon: <Type />, count: "10 tools", color: "bg-[#A742F5] text-white" },
  { name: "Math Tools", icon: <BarChart />, count: "9 tools", color: "bg-[#FF3366] text-white" },
  { name: "SEO Tools", icon: <SearchCheck />, count: "6 tools", color: "bg-[#3366FF] text-white" }
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
        title="Your #1 Source for Free Online Tools" 
        description="A bold, fast, and free collection of web utilities. Calculators, converters, generators and more." 
      />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 lg:pt-32 lg:pb-32 overflow-hidden bg-background">
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-background to-background dark:from-background dark:to-background pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[100px]"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left side text */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-left"
            >
              <h1 className="text-6xl md:text-7xl lg:text-[5.5rem] font-black text-foreground tracking-tighter leading-[1.05] uppercase mb-8">
                Your #1 Source <br />
                For <span className="bg-primary text-primary-foreground px-2">Free</span> <br />
                Online Tools
              </h1>
              
              <p className="text-2xl font-medium text-muted-foreground mb-10 max-w-lg">
                Stop bookmarking dozens of websites. US Online Tools brings you everything you need in one beautiful, ad-free interface.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <a href="#tools" className="px-8 py-5 rounded-xl bg-primary text-primary-foreground font-black text-xl uppercase tracking-wider hard-shadow border-2 border-foreground text-center transition-transform active:translate-y-1">
                  Explore Tools
                </a>
                <a href="#categories" className="px-8 py-5 rounded-xl bg-transparent border-4 border-foreground text-foreground font-black text-xl uppercase tracking-wider text-center hover:bg-foreground hover:text-background transition-colors">
                  Browse Categories
                </a>
              </div>

              <div className="relative flex items-center p-2 rounded-xl bg-card border-4 border-foreground hard-shadow max-w-lg">
                <Search className="w-8 h-8 text-muted-foreground ml-4" strokeWidth={3} />
                <input 
                  type="text" 
                  placeholder="Search tools..."
                  className="w-full bg-transparent border-none text-foreground px-4 py-4 focus:outline-none placeholder:text-muted-foreground/70 text-xl font-bold uppercase"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </motion.div>

            {/* Right side abstract mosaic */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
              className="hidden lg:grid grid-cols-2 gap-4 rotate-3"
            >
              <div className="bg-[#FF6B35] p-8 rounded-xl border-4 border-foreground hard-shadow flex flex-col items-center justify-center text-white aspect-square hover:-rotate-6 transition-transform">
                <KeyRound className="w-16 h-16 mb-4" />
                <span className="font-black text-xl uppercase tracking-wider">Passwords</span>
              </div>
              <div className="bg-[#00D4AA] p-8 rounded-xl border-4 border-foreground hard-shadow flex flex-col items-center justify-center text-black aspect-square translate-y-8 hover:rotate-6 transition-transform">
                <Calculator className="w-16 h-16 mb-4" />
                <span className="font-black text-xl uppercase tracking-wider">Calculators</span>
              </div>
              <div className="bg-[#FFD23F] p-8 rounded-xl border-4 border-foreground hard-shadow flex flex-col items-center justify-center text-black aspect-square hover:-rotate-3 transition-transform">
                <Type className="w-16 h-16 mb-4" />
                <span className="font-black text-xl uppercase tracking-wider">Text</span>
              </div>
              <div className="bg-foreground p-8 rounded-xl border-4 border-foreground hard-shadow flex flex-col items-center justify-center text-background aspect-square translate-y-8 hover:rotate-3 transition-transform">
                <RefreshCw className="w-16 h-16 mb-4" />
                <span className="font-black text-xl uppercase tracking-wider">Converters</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="py-12 bg-[#111111] dark:bg-black text-white border-y-4 border-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x-2 divide-gray-800">
            <div>
              <div className="text-5xl font-black mb-2 text-primary">200+</div>
              <div className="text-gray-300 font-bold uppercase tracking-widest text-sm">Tools Available</div>
            </div>
            <div>
              <div className="text-5xl font-black mb-2 text-[#00D4AA]">0</div>
              <div className="text-gray-300 font-bold uppercase tracking-widest text-sm">Data Collected</div>
            </div>
            <div>
              <div className="text-5xl font-black mb-2 text-[#FFD23F]">100%</div>
              <div className="text-gray-300 font-bold uppercase tracking-widest text-sm">Free Forever</div>
            </div>
            <div>
              <div className="text-5xl font-black mb-2 text-[#A742F5]">5★</div>
              <div className="text-gray-300 font-bold uppercase tracking-widest text-sm">Rated by Users</div>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Grid Section */}
      <section className="py-24 bg-background relative z-10" id="tools">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between">
            <div className="border-l-8 border-primary pl-6">
              <h2 className="text-4xl md:text-5xl font-black text-foreground mb-2 uppercase tracking-tight">Featured Tools</h2>
              <p className="text-xl text-muted-foreground font-medium">Everything you need, instantly.</p>
            </div>
            <div className="mt-8 md:mt-0 flex flex-wrap gap-3">
              {['All', 'Calculators', 'Generators', 'Converters', 'Text'].map((cat) => (
                <button key={cat} className="px-6 py-3 rounded-full text-sm font-black uppercase tracking-wider bg-card border-2 border-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all text-foreground">
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {filteredTools.length === 0 ? (
            <div className="text-center py-24 bg-card border-4 border-foreground rounded-xl border-dashed">
              <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" strokeWidth={3} />
              <h3 className="text-2xl font-black uppercase text-foreground mb-2">No tools found</h3>
              <p className="text-lg font-medium text-muted-foreground">Try a different search term.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                    className="block group h-full bg-card border-2 border-border hover:border-foreground p-8 rounded-xl hover:-rotate-1 transition-all duration-300 hard-shadow-primary"
                  >
                    <div className="flex justify-between items-start mb-8">
                      <div className={`w-16 h-16 rounded-xl ${tool.color} border-2 border-foreground flex items-center justify-center text-foreground group-hover:scale-110 transition-transform duration-300`}>
                        {tool.icon}
                      </div>
                      <span className="text-xs font-black uppercase tracking-wider px-4 py-2 rounded-full border-2 border-border text-muted-foreground group-hover:border-foreground group-hover:text-foreground transition-colors">
                        {tool.category}
                      </span>
                    </div>
                    <h3 className="text-2xl font-black text-foreground mb-3 uppercase tracking-tight">
                      {tool.title}
                    </h3>
                    <p className="text-muted-foreground font-medium mb-8 text-lg">
                      {tool.description}
                    </p>
                    <div className="flex items-center text-sm font-black uppercase tracking-wider text-primary opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                      Open Tool <ArrowRight className="w-5 h-5 ml-2" strokeWidth={3} />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="py-24 bg-muted/50" id="categories">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-l-8 border-foreground pl-6 mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-foreground mb-2 uppercase tracking-tight">Tool Categories</h2>
            <p className="text-xl text-muted-foreground font-medium">Explore by type.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CATEGORIES.map((cat, idx) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`${cat.color} p-8 border-4 border-foreground hard-shadow rounded-xl flex items-center justify-between group cursor-pointer hover:-translate-y-2 transition-transform`}
              >
                <div className="flex items-center space-x-6">
                  <div className="w-16 h-16 bg-background/20 rounded-xl flex items-center justify-center border-2 border-transparent group-hover:scale-110 transition-transform">
                    {cat.icon}
                  </div>
                  <div>
                    <h3 className="font-black text-2xl uppercase tracking-tight">{cat.name}</h3>
                    <p className="text-lg font-bold opacity-80">{cat.count}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-l-8 border-primary pl-6 mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-foreground mb-2 uppercase tracking-tight">Why US Online Tools?</h2>
            <p className="text-xl text-muted-foreground font-medium">No fluff, just tools.</p>
          </div>
          
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row items-center gap-8 bg-card border-2 border-border p-8 rounded-xl hover:border-primary transition-colors">
              <div className="w-24 h-24 shrink-0 rounded-xl bg-primary text-primary-foreground border-4 border-foreground flex items-center justify-center text-4xl font-black hard-shadow">
                1
              </div>
              <div>
                <h3 className="text-2xl font-black text-foreground mb-2 uppercase">100% Free Forever</h3>
                <p className="text-lg text-muted-foreground font-medium">No paywalls, no premium subscriptions, no hidden limits. Everything is free to use.</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row-reverse items-center gap-8 bg-card border-2 border-border p-8 rounded-xl hover:border-[#00D4AA] transition-colors">
              <div className="w-24 h-24 shrink-0 rounded-xl bg-[#00D4AA] text-black border-4 border-foreground flex items-center justify-center text-4xl font-black hard-shadow">
                2
              </div>
              <div className="text-left md:text-right">
                <h3 className="text-2xl font-black text-foreground mb-2 uppercase">No Registration</h3>
                <p className="text-lg text-muted-foreground font-medium">Don't want to create another account? Neither do we. Start using any tool instantly.</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-8 bg-card border-2 border-border p-8 rounded-xl hover:border-[#FFD23F] transition-colors">
              <div className="w-24 h-24 shrink-0 rounded-xl bg-[#FFD23F] text-black border-4 border-foreground flex items-center justify-center text-4xl font-black hard-shadow">
                3
              </div>
              <div>
                <h3 className="text-2xl font-black text-foreground mb-2 uppercase">Privacy First</h3>
                <p className="text-lg text-muted-foreground font-medium">Your data never leaves your device. All tools execute locally inside your browser.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-muted/50 border-y-4 border-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black text-foreground mb-6 uppercase tracking-tighter">How It Works</h2>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start gap-12 relative">
            <div className="hidden md:block absolute top-16 left-[15%] right-[15%] h-2 border-t-4 border-dashed border-foreground z-0"></div>
            
            <div className="relative z-10 flex-1 text-center group">
              <div className="text-8xl font-black text-primary mb-6 transition-transform group-hover:-translate-y-2">01</div>
              <h3 className="text-3xl font-black text-foreground mb-4 uppercase">Find</h3>
              <p className="text-lg text-muted-foreground font-medium">Search or browse our categories.</p>
            </div>
            
            <div className="relative z-10 flex-1 text-center group">
              <div className="text-8xl font-black text-[#00D4AA] mb-6 transition-transform group-hover:-translate-y-2">02</div>
              <h3 className="text-3xl font-black text-foreground mb-4 uppercase">Input</h3>
              <p className="text-lg text-muted-foreground font-medium">Enter your data securely on your device.</p>
            </div>
            
            <div className="relative z-10 flex-1 text-center group">
              <div className="text-8xl font-black text-[#FFD23F] mb-6 transition-transform group-hover:-translate-y-2">03</div>
              <h3 className="text-3xl font-black text-foreground mb-4 uppercase">Result</h3>
              <p className="text-lg text-muted-foreground font-medium">Get instant real-time results.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SEO text block */}
      <section className="py-24 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-card border-4 border-foreground p-10 md:p-12 rounded-xl border-l-[16px] border-l-primary hard-shadow">
            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-6 uppercase tracking-tight">Your Go-To Resource</h2>
            <p className="text-lg font-medium text-muted-foreground leading-relaxed">
              US Online Tools is your comprehensive platform for free online utilities designed to save you time. 
              Whether you're a developer needing a <Link href="/tools/color-converter" className="text-foreground underline decoration-primary decoration-4 font-bold hover:text-primary">Color Converter</Link>, 
              a student using our <Link href="/tools/percentage-calculator" className="text-foreground underline decoration-[#00D4AA] decoration-4 font-bold hover:text-[#00D4AA]">Percentage Calculator</Link>, 
              a writer depending on our precise <Link href="/tools/word-counter" className="text-foreground underline decoration-[#FFD23F] decoration-4 font-bold hover:text-[#FFD23F]">Word Counter</Link>, 
              or anyone looking for a secure <Link href="/tools/password-generator" className="text-foreground underline decoration-primary decoration-4 font-bold hover:text-primary">Password Generator</Link> and 
              an easy-to-use <Link href="/tools/age-calculator" className="text-foreground underline decoration-[#00D4AA] decoration-4 font-bold hover:text-[#00D4AA]">Age Calculator</Link> — we have you covered. 
              Our commitment is to provide fast, privacy-focused, and completely free web tools for everyone.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-24 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary p-12 md:p-20 text-center rounded-xl border-4 border-foreground hard-shadow relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-black text-primary-foreground mb-6 tracking-tighter uppercase leading-[1.1]">
                Stop Struggling with<br/>Online Tasks
              </h2>
              <p className="text-2xl text-primary-foreground/90 font-medium mb-12 max-w-2xl mx-auto">
                Join over 1 million users who trust our suite of free online utilities every month.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <a href="#tools" className="w-full sm:w-auto px-10 py-5 rounded-xl bg-foreground text-background font-black text-xl uppercase tracking-wider hard-shadow border-2 border-foreground hover:-translate-y-1 active:translate-y-1 transition-transform">
                  Explore Tools
                </a>
                <button 
                  onClick={() => navigator.clipboard.writeText(window.location.href)}
                  className="w-full sm:w-auto px-10 py-5 rounded-xl bg-transparent border-4 border-foreground text-foreground font-black text-xl uppercase tracking-wider hover:bg-foreground hover:text-background transition-colors"
                >
                  Share Site
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}