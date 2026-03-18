import { ReactNode } from "react";
import { Layout } from "./Layout";
import { SEO } from "./SEO";
import { Link } from "wouter";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface ToolPageLayoutProps {
  title: string;
  description: string;
  tool: ReactNode;
  howToUse: ReactNode;
  faq: Array<{ q: string; a: string }>;
  related: Array<{ title: string; path: string; icon: ReactNode }>;
}

export function ToolPageLayout({ title, description, tool, howToUse, faq, related }: ToolPageLayoutProps) {
  return (
    <Layout>
      <SEO title={title} description={description} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Breadcrumbs */}
        <nav className="flex items-center text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 opacity-50" />
          <span className="text-white">Tools</span>
          <ChevronRight className="w-4 h-4 mx-2 opacity-50" />
          <span className="text-primary truncate">{title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Tool Area */}
          <div className="lg:col-span-2 space-y-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">{title}</h1>
              <p className="text-lg text-muted-foreground">{description}</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="relative z-10"
            >
              {tool}
            </motion.div>

            <motion.section 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="glass-card p-8 rounded-3xl"
            >
              <h2 className="text-2xl font-bold text-white mb-6">How to use this tool</h2>
              <div className="prose prose-invert max-w-none text-muted-foreground">
                {howToUse}
              </div>
            </motion.section>

            <motion.section 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-white">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {faq.map((item, index) => (
                  <div key={index} className="glass-card p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                    <h3 className="text-lg font-semibold text-white mb-2">{item.q}</h3>
                    <p className="text-muted-foreground">{item.a}</p>
                  </div>
                ))}
              </div>
            </motion.section>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-8">
            <div className="sticky top-28">
              <div className="glass-card p-6 rounded-3xl relative overflow-hidden">
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/20 rounded-full blur-3xl"></div>
                <h3 className="text-xl font-bold text-white mb-6">Related Tools</h3>
                <div className="space-y-4">
                  {related.map((item, index) => (
                    <Link 
                      key={index} 
                      href={item.path}
                      className="group flex items-center p-3 rounded-xl hover:bg-white/5 transition-all border border-transparent hover:border-white/10"
                    >
                      <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        {item.icon}
                      </div>
                      <span className="ml-4 font-medium text-muted-foreground group-hover:text-white transition-colors">
                        {item.title}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
              
              <div className="mt-8 glass-card p-6 rounded-3xl bg-gradient-to-br from-secondary/10 to-accent/10 border-secondary/20">
                <h3 className="text-lg font-bold text-white mb-2">Love this tool?</h3>
                <p className="text-sm text-muted-foreground mb-4">Share it with your friends and colleagues to help them save time!</p>
                <button 
                  onClick={() => navigator.clipboard.writeText(window.location.href)}
                  className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-colors border border-white/10"
                >
                  Copy Link
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
