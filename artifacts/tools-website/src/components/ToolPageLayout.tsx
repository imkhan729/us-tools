import { ReactNode } from "react";
import { Layout } from "./Layout";
import { SEO } from "./SEO";
import { Link } from "wouter";
import { ChevronRight } from "lucide-react";

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
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Breadcrumbs */}
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-5 h-5 mx-2 text-primary" strokeWidth={3} />
          <span className="text-muted-foreground">Tools</span>
          <ChevronRight className="w-5 h-5 mx-2 text-primary" strokeWidth={3} />
          <span className="text-foreground truncate">{title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Tool Area */}
          <div className="lg:col-span-2 space-y-12">
            <div className="space-y-4 border-l-8 border-primary pl-6 py-2">
              <h1 className="text-5xl md:text-6xl font-black text-foreground tracking-tighter uppercase leading-none">{title}</h1>
              <p className="text-xl font-medium text-muted-foreground max-w-2xl">{description}</p>
            </div>

            <div className="relative z-10 bg-card border-2 border-border rounded-xl p-6 sm:p-8">
              {tool}
            </div>

            <section className="bg-card border-2 border-border p-8 rounded-xl">
              <h2 className="text-3xl font-black text-foreground uppercase tracking-tight mb-6">How to use this tool</h2>
              <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground font-medium">
                {howToUse}
              </div>
            </section>

            <section className="space-y-8">
              <h2 className="text-3xl font-black text-foreground uppercase tracking-tight">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {faq.map((item, index) => (
                  <div key={index} className="bg-card p-6 rounded-xl border-2 border-border hover:border-primary transition-colors">
                    <h3 className="text-xl font-bold text-foreground mb-3">{item.q}</h3>
                    <p className="text-muted-foreground font-medium">{item.a}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-8">
            <div className="sticky top-28">
              <div className="bg-card p-6 rounded-xl border-2 border-border">
                <h3 className="text-xl font-black uppercase tracking-tight text-foreground mb-6">Related Tools</h3>
                <div className="space-y-4">
                  {related.map((item, index) => (
                    <Link 
                      key={index} 
                      href={item.path}
                      className="group flex items-center p-3 rounded-xl hover:bg-muted transition-all border-2 border-transparent hover:border-foreground"
                    >
                      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-foreground group-hover:text-primary transition-colors border-2 border-transparent group-hover:border-primary">
                        {item.icon}
                      </div>
                      <span className="ml-4 font-bold text-muted-foreground group-hover:text-foreground transition-colors">
                        {item.title}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
              
              <div className="mt-8 bg-primary p-6 rounded-xl border-4 border-foreground text-primary-foreground hard-shadow">
                <h3 className="text-2xl font-black uppercase tracking-tight mb-2">Love this tool?</h3>
                <p className="text-primary-foreground/90 font-medium mb-6">Share it with your friends and colleagues to help them save time!</p>
                <button 
                  onClick={() => navigator.clipboard.writeText(window.location.href)}
                  className="w-full py-4 bg-background text-foreground font-black uppercase tracking-wider rounded-xl border-2 border-foreground hard-shadow hover:-translate-y-1 active:translate-y-1 transition-transform"
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