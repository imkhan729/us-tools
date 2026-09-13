import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link, useLocation } from "wouter";
import { AlertCircle, ArrowLeft, Search, Calculator, Sparkles, FolderOpen, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { DISPLAY_ALL_TOOLS, DISPLAY_TOOL_CATEGORIES, getCanonicalToolPath } from "@/data/tools";

const POPULAR_TOOLS = [
  { title: "Percentage Calculator", slug: "percentage-calculator", category: "Math & Calculators" },
  { title: "Compound Interest Calculator", slug: "online-compound-interest-calculator", category: "Finance & Cost" },
  { title: "Loan EMI Calculator", slug: "online-loan-emi-calculator", category: "Finance & Cost" },
  { title: "BMI Calculator", slug: "online-bmi-calculator", category: "Health & Fitness" },
  { title: "Word Counter", slug: "online-word-counter", category: "Productivity & Text" },
  { title: "JSON Formatter", slug: "json-formatter", category: "Developer Tools" },
  { title: "Base64 Encoder/Decoder", slug: "base64-encoder-decoder", category: "Developer Tools" },
  { title: "Concrete Calculator", slug: "concrete-calculator", category: "Construction & DIY" },
];

export default function NotFound() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q || q.length < 2) return [];
    return DISPLAY_ALL_TOOLS.filter(
      (tool) =>
        tool.title.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.category.toLowerCase().includes(q)
    ).slice(0, 6);
  }, [searchQuery]);

  return (
    <Layout>
      <SEO
        title="404 - Page Not Found"
        description="The requested tool or page could not be found on US Online Tools. Search 400+ free online calculators and utilities."
        noindex
      />
      <div className="min-h-[75vh] w-full px-4 py-12 max-w-5xl mx-auto flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full text-center mb-8"
        >
          <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-500/20">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-foreground mb-3">404 — Page Not Found</h1>
          <p className="text-muted-foreground max-w-xl mx-auto text-base sm:text-lg mb-8">
            The page or tool you are looking for does not exist, was renamed, or has moved to a canonical URL.
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto relative mb-10">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search 400+ online tools, calculators & converters..."
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-base shadow-sm"
              />
            </div>
            {searchResults.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-card border border-border rounded-2xl shadow-xl overflow-hidden z-20 text-left">
                {searchResults.map((tool) => (
                  <Link
                    key={tool.slug}
                    href={getCanonicalToolPath(tool.slug)}
                    className="flex items-center justify-between p-3.5 hover:bg-muted/50 border-b border-border/50 last:border-0 transition-colors"
                  >
                    <div>
                      <div className="font-medium text-foreground text-sm">{tool.title}</div>
                      <div className="text-xs text-muted-foreground">{tool.category}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Popular Tools */}
        <div className="w-full mb-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Popular Tools & Calculators</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {POPULAR_TOOLS.map((tool) => (
              <Link
                key={tool.slug}
                href={getCanonicalToolPath(tool.slug)}
                className="p-3.5 rounded-xl bg-card border border-border/70 hover:border-primary/50 hover:bg-muted/40 transition-all text-left group"
              >
                <div className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors truncate">
                  {tool.title}
                </div>
                <div className="text-xs text-muted-foreground truncate">{tool.category}</div>
              </Link>
            ))}
          </div>
        </div>

        {/* Browse Categories */}
        <div className="w-full mb-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <FolderOpen className="w-4 h-4 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Browse Categories</h2>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto">
            {DISPLAY_TOOL_CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.id}`}
                className="px-3.5 py-1.5 rounded-lg bg-muted/60 hover:bg-primary hover:text-primary-foreground text-xs font-medium text-muted-foreground transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Home Button */}
        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Homepage
        </Link>
      </div>
    </Layout>
  );
}

