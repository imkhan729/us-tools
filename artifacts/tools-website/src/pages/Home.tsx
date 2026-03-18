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
  Paintbrush
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
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={`${import.meta.env.BASE_URL}images/hero-bg.png`} 
            alt="" 
            className="w-full h-full object-cover opacity-20 mix-blend-screen"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/80 to-background"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-card border-primary/30 mb-8">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-white">Lighting Fast & 100% Client-side</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tight mb-6">
              The ultimate toolkit for <br className="hidden md:block" />
              <span className="neon-text">modern creators.</span>
            </h1>
            
            <p className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Stop bookmarking dozens of websites. ToolsHub brings you everything you need in one beautiful, ad-free interface.
            </p>

            <div className="max-w-2xl mx-auto relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary via-secondary to-accent rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative glass-card flex items-center p-2 rounded-2xl">
                <Search className="w-6 h-6 text-muted-foreground ml-4" />
                <input 
                  type="text" 
                  placeholder="Search for tools (e.g., 'password', 'color')..."
                  className="w-full bg-transparent border-none text-white px-4 py-4 focus:outline-none placeholder:text-muted-foreground/70 text-lg"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tools Grid Section */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Featured Tools</h2>
              <p className="text-muted-foreground">Everything you need, right at your fingertips.</p>
            </div>
            <div className="mt-6 md:mt-0 flex flex-wrap gap-2">
              {['All', 'Calculators', 'Generators', 'Converters', 'Text'].map((cat) => (
                <button key={cat} className="px-4 py-2 rounded-full text-sm font-medium glass-card hover:bg-white/10 transition-colors text-white">
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {filteredTools.length === 0 ? (
            <div className="text-center py-20 glass-card rounded-3xl">
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-medium text-white">No tools found</h3>
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
                    className="block group h-full glass-card p-6 rounded-3xl border border-white/5 hover:border-white/20 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        {tool.icon}
                      </div>
                      <span className="text-xs font-medium px-3 py-1 rounded-full bg-white/5 text-muted-foreground group-hover:text-white transition-colors">
                        {tool.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/70 transition-all">
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
      
      {/* Features Grid */}
      <section className="py-24 border-t border-white/5 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl glass-card flex items-center justify-center text-primary">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">100% Private</h3>
              <p className="text-muted-foreground">All tools run locally in your browser. No data is ever sent to our servers.</p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl glass-card flex items-center justify-center text-secondary">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">Blazing Fast</h3>
              <p className="text-muted-foreground">Built with React and optimized for immediate interactivity without reloads.</p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl glass-card flex items-center justify-center text-accent">
                <Paintbrush className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">Beautifully Designed</h3>
              <p className="text-muted-foreground">A premium user experience that makes working with utilities a joy.</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
