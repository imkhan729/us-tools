import { useParams } from "wouter";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { TOOL_CATEGORIES, type Tool } from "@/data/tools";
import { ChevronRight, ArrowRight,
  Calculator, DollarSign, Ruler, Clock, Heart, HardHat, Type, BookOpen, Gamepad2,
  Percent, TrendingUp, CreditCard, PiggyBank, ReceiptText, Landmark, BarChart3, Scale, Hash,
  Divide, Sigma, Infinity, FlaskConical, Dices, AlignLeft, FileText, Globe, Thermometer,
  Weight, Timer, AlarmClock, BicepsFlexed, Apple, Droplets, Activity, Building2,
  PaintBucket, Grid3x3, SquareStack, Swords, Trophy, Zap, Shuffle, ListOrdered,
  Binary, Link2, QrCode, KeyRound, Wrench
} from "lucide-react";

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string; light: string }> = {
  "math":         { bg: "bg-blue-500",    text: "text-blue-500",    border: "border-blue-500",    light: "bg-blue-50 dark:bg-blue-950/30" },
  "finance":      { bg: "bg-emerald-500", text: "text-emerald-500", border: "border-emerald-500", light: "bg-emerald-50 dark:bg-emerald-950/30" },
  "conversion":   { bg: "bg-purple-500",  text: "text-purple-500",  border: "border-purple-500",  light: "bg-purple-50 dark:bg-purple-950/30" },
  "time-date":    { bg: "bg-orange-500",  text: "text-orange-500",  border: "border-orange-500",  light: "bg-orange-50 dark:bg-orange-950/30" },
  "health":       { bg: "bg-red-500",     text: "text-red-500",     border: "border-red-500",     light: "bg-red-50 dark:bg-red-950/30" },
  "construction": { bg: "bg-yellow-500",  text: "text-yellow-600",  border: "border-yellow-500",  light: "bg-yellow-50 dark:bg-yellow-950/30" },
  "productivity": { bg: "bg-teal-500",    text: "text-teal-500",    border: "border-teal-500",    light: "bg-teal-50 dark:bg-teal-950/30" },
  "education":    { bg: "bg-indigo-500",  text: "text-indigo-500",  border: "border-indigo-500",  light: "bg-indigo-50 dark:bg-indigo-950/30" },
  "gaming":       { bg: "bg-pink-500",    text: "text-pink-500",    border: "border-pink-500",    light: "bg-pink-50 dark:bg-pink-950/30" },
};

const CATEGORY_ICONS_LG: Record<string, React.ReactNode> = {
  "math": <Calculator className="w-8 h-8" />,
  "finance": <DollarSign className="w-8 h-8" />,
  "conversion": <Ruler className="w-8 h-8" />,
  "time-date": <Clock className="w-8 h-8" />,
  "health": <Heart className="w-8 h-8" />,
  "construction": <HardHat className="w-8 h-8" />,
  "productivity": <Type className="w-8 h-8" />,
  "education": <BookOpen className="w-8 h-8" />,
  "gaming": <Gamepad2 className="w-8 h-8" />,
};

const TOOL_ICON_MAP: Record<string, React.ReactNode> = {
  "percentage-calculator": <Percent className="w-4 h-4" />,
  "percentage-increase-calculator": <TrendingUp className="w-4 h-4" />,
  "percentage-decrease-calculator": <TrendingUp className="w-4 h-4 rotate-180" />,
  "ratio-calculator": <Scale className="w-4 h-4" />,
  "average-calculator": <BarChart3 className="w-4 h-4" />,
  "scientific-calculator": <FlaskConical className="w-4 h-4" />,
  "standard-deviation-calculator": <Sigma className="w-4 h-4" />,
  "power-calculator": <Zap className="w-4 h-4" />,
  "logarithm-calculator": <Infinity className="w-4 h-4" />,
  "factorial-calculator": <Hash className="w-4 h-4" />,
  "prime-number-checker": <Hash className="w-4 h-4" />,
  "lcm-calculator": <ListOrdered className="w-4 h-4" />,
  "gcd-calculator": <ListOrdered className="w-4 h-4" />,
  "random-number-generator": <Dices className="w-4 h-4" />,
  "mean-median-mode-calculator": <BarChart3 className="w-4 h-4" />,
  "simple-interest-calculator": <Percent className="w-4 h-4" />,
  "compound-interest-calculator": <TrendingUp className="w-4 h-4" />,
  "loan-emi-calculator": <Landmark className="w-4 h-4" />,
  "discount-calculator": <ReceiptText className="w-4 h-4" />,
  "profit-margin-calculator": <TrendingUp className="w-4 h-4" />,
  "savings-calculator": <PiggyBank className="w-4 h-4" />,
  "tip-calculator": <ReceiptText className="w-4 h-4" />,
  "salary-calculator": <CreditCard className="w-4 h-4" />,
  "tax-calculator": <ReceiptText className="w-4 h-4" />,
  "mortgage-payment-calculator": <Landmark className="w-4 h-4" />,
  "gst-calculator": <ReceiptText className="w-4 h-4" />,
  "inflation-calculator": <TrendingUp className="w-4 h-4" />,
  "commission-calculator": <DollarSign className="w-4 h-4" />,
  "investment-growth-calculator": <TrendingUp className="w-4 h-4" />,
  "budget-calculator": <PiggyBank className="w-4 h-4" />,
  "temperature-converter": <Thermometer className="w-4 h-4" />,
  "weight-converter": <Weight className="w-4 h-4" />,
  "length-converter": <Ruler className="w-4 h-4" />,
  "area-converter": <Grid3x3 className="w-4 h-4" />,
  "color-converter": <SquareStack className="w-4 h-4" />,
  "number-base-converter": <Binary className="w-4 h-4" />,
  "currency-converter": <DollarSign className="w-4 h-4" />,
  "data-storage-converter": <Binary className="w-4 h-4" />,
  "speed-converter": <Zap className="w-4 h-4" />,
  "volume-converter": <FlaskConical className="w-4 h-4" />,
  "age-calculator": <Clock className="w-4 h-4" />,
  "date-difference-calculator": <Clock className="w-4 h-4" />,
  "time-zone-converter": <Globe className="w-4 h-4" />,
  "countdown-timer": <AlarmClock className="w-4 h-4" />,
  "unix-timestamp-converter": <Timer className="w-4 h-4" />,
  "bmi-calculator": <Activity className="w-4 h-4" />,
  "bmr-calculator": <Activity className="w-4 h-4" />,
  "tdee-calculator": <BicepsFlexed className="w-4 h-4" />,
  "calorie-intake-calculator": <Apple className="w-4 h-4" />,
  "water-intake-calculator": <Droplets className="w-4 h-4" />,
  "ideal-weight-calculator": <Scale className="w-4 h-4" />,
  "sleep-calculator": <AlarmClock className="w-4 h-4" />,
  "heart-rate-calculator": <Heart className="w-4 h-4" />,
  "concrete-volume-calculator": <Building2 className="w-4 h-4" />,
  "paint-calculator": <PaintBucket className="w-4 h-4" />,
  "brick-calculator": <Building2 className="w-4 h-4" />,
  "flooring-calculator": <Grid3x3 className="w-4 h-4" />,
  "tile-calculator": <Grid3x3 className="w-4 h-4" />,
  "word-counter": <FileText className="w-4 h-4" />,
  "character-counter": <AlignLeft className="w-4 h-4" />,
  "password-generator": <KeyRound className="w-4 h-4" />,
  "text-case-converter": <Type className="w-4 h-4" />,
  "lorem-ipsum-generator": <AlignLeft className="w-4 h-4" />,
  "url-encoder-decoder": <Link2 className="w-4 h-4" />,
  "base64-encoder-decoder": <Binary className="w-4 h-4" />,
  "json-formatter": <FileText className="w-4 h-4" />,
  "text-reverser": <Shuffle className="w-4 h-4" />,
  "qr-code-generator": <QrCode className="w-4 h-4" />,
  "uuid-generator": <Hash className="w-4 h-4" />,
  "gpa-calculator": <BookOpen className="w-4 h-4" />,
  "grade-calculator": <BookOpen className="w-4 h-4" />,
  "binary-converter": <Binary className="w-4 h-4" />,
  "roman-numeral-converter": <Binary className="w-4 h-4" />,
  "roblox-tax-calculator": <Gamepad2 className="w-4 h-4" />,
  "minecraft-circle-calculator": <Grid3x3 className="w-4 h-4" />,
  "valorant-sensitivity-calculator": <Swords className="w-4 h-4" />,
  "dnd-dice-roller": <Dices className="w-4 h-4" />,
  "pokemon-damage-calculator": <Trophy className="w-4 h-4" />,
  "blox-fruits-calculator": <Swords className="w-4 h-4" />,
};

function getIcon(slug: string) {
  return TOOL_ICON_MAP[slug] ?? <Wrench className="w-4 h-4" />;
}

function ToolCard({ tool, colorClass }: { tool: Tool; colorClass: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.25 }}
      whileHover={{ y: -3 }}
      className="h-full"
    >
      <Link
        href={`/tools/${tool.slug}`}
        className="group flex flex-col h-full min-h-[88px] p-4 rounded-xl bg-card border border-border
          shadow-[0_2px_8px_hsl(var(--foreground)/0.05)]
          hover:shadow-[0_8px_24px_hsl(var(--foreground)/0.12)]
          hover:border-primary/50 transition-all duration-200 relative overflow-hidden"
      >
        <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary rounded-l-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        <div className="flex items-start gap-3">
          <div className={`w-9 h-9 rounded-lg ${colorClass} flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200`}>
            {getIcon(tool.slug)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors leading-snug">{tool.title}</p>
            <p className="text-xs text-muted-foreground leading-tight mt-0.5 line-clamp-2">{tool.description}</p>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all flex-shrink-0" />
        </div>
        {tool.implemented && (
          <div className="mt-2 pl-12">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />Live
            </span>
          </div>
        )}
      </Link>
    </motion.div>
  );
}

export default function CategoryPage() {
  const params = useParams<{ id: string }>();
  const catId = params.id;
  const category = TOOL_CATEGORIES.find(c => c.id === catId);

  if (!category) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-32 text-center">
          <h1 className="text-4xl font-black uppercase text-foreground mb-4">Category Not Found</h1>
          <Link href="/" className="text-primary font-bold hover:underline">← Back to Home</Link>
        </div>
      </Layout>
    );
  }

  const colors = CATEGORY_COLORS[catId] ?? CATEGORY_COLORS["math"];
  const liveCount = category.tools.filter(t => t.implemented).length;
  const otherCategories = TOOL_CATEGORIES.filter(c => c.id !== catId);

  return (
    <Layout>
      <SEO
        title={`${category.name} — Free Online Tools`}
        description={`${category.description}. ${category.tools.length} free online ${category.name.toLowerCase()} tools. No signup required.`}
      />

      {/* ── HEADER BANNER ── */}
      <section className={`${colors.light} border-b-4 border-border`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Breadcrumb */}
          <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4 mx-2 text-primary" strokeWidth={3} />
            <span className="text-foreground">{category.name}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className={`w-20 h-20 rounded-2xl ${colors.bg} text-white flex items-center justify-center border-4 border-foreground shadow-[4px_4px_0px_0px_hsl(var(--foreground))] flex-shrink-0`}>
              {CATEGORY_ICONS_LG[catId]}
            </div>
            <div>
              <h1 className="text-5xl md:text-6xl font-black text-foreground tracking-tighter uppercase leading-none mb-3">
                {category.name}
              </h1>
              <p className="text-lg text-muted-foreground font-medium max-w-2xl">{category.description}</p>
            </div>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap gap-6 mt-8">
            {[
              { label: "Total Tools", value: category.tools.length },
              { label: "Live Now", value: liveCount },
              { label: "Free to Use", value: "100%" },
              { label: "Signup Required", value: "None" },
            ].map(s => (
              <div key={s.label} className="bg-card border-2 border-border rounded-xl px-5 py-3 flex items-center gap-3">
                <span className={`text-2xl font-black ${colors.text}`}>{s.value}</span>
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TOOLS GRID ── */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className={`text-3xl font-black uppercase tracking-tight text-foreground border-l-8 ${colors.border} pl-4`}>
              All {category.name}
            </h2>
            <span className="text-sm font-bold text-muted-foreground bg-card border-2 border-border px-3 py-1 rounded-full">
              {category.tools.length} tools
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {category.tools.map(tool => (
              <ToolCard key={tool.slug} tool={tool} colorClass={`${colors.bg}/10 ${colors.text}`} />
            ))}
          </div>
        </div>
      </section>

      {/* ── OTHER CATEGORIES ── */}
      <section className="py-16 bg-muted/30 border-t-4 border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black uppercase tracking-tight text-foreground border-l-8 border-primary pl-4 mb-8">
            Browse Other Categories
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {otherCategories.map(cat => {
              const c = CATEGORY_COLORS[cat.id] ?? CATEGORY_COLORS["math"];
              return (
                <Link
                  key={cat.id}
                  href={`/category/${cat.id}`}
                  className="group flex items-center gap-3 p-4 rounded-xl bg-card border border-border hover:border-primary/50 hover:shadow-[0_4px_16px_hsl(var(--foreground)/0.1)] transition-all duration-200"
                >
                  <div className={`w-10 h-10 rounded-lg ${c.bg}/10 ${c.text} flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors`}>
                    {CATEGORY_ICONS_LG[cat.id]}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors truncate">{cat.name}</p>
                    <p className="text-xs text-muted-foreground">{cat.tools.length} tools</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </Layout>
  );
}
