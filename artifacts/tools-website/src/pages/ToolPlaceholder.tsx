import { useParams, Link } from "wouter";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { getToolBySlug, getRelatedTools, getToolPath, TOOL_CATEGORIES } from "@/data/tools";
import { ChevronRight, Wrench, Clock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function ToolPlaceholder() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const tool = getToolBySlug(slug);

  if (!tool) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-24 text-center">
          <h1 className="text-4xl font-black text-foreground uppercase">Tool Not Found</h1>
          <p className="text-muted-foreground mt-4 text-lg">This tool doesn't exist yet.</p>
          <Link href="/" className="inline-block mt-8 px-8 py-4 bg-primary text-primary-foreground font-black uppercase rounded-xl border-2 border-foreground hard-shadow">
            Go Home
          </Link>
        </div>
      </Layout>
    );
  }

  const related = getRelatedTools(slug, tool.category, 5);
  const category = TOOL_CATEGORIES.find(c => c.name === tool.category);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": tool.title,
    "url": `https://usonlinetools.com/tools/${tool.slug}`,
    "description": tool.metaDescription,
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "Any",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
  };

  return (
    <Layout>
      <SEO
        title={`${tool.title} - Free Online Tool`}
        description={tool.metaDescription}
        structuredData={structuredData}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Breadcrumbs */}
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-5 h-5 mx-2 text-primary" strokeWidth={3} />
          <Link href={`/#${category?.id}`} className="text-muted-foreground hover:text-foreground transition-colors">
            {tool.category}
          </Link>
          <ChevronRight className="w-5 h-5 mx-2 text-primary" strokeWidth={3} />
          <span className="text-foreground truncate">{tool.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Title */}
            <div className="space-y-4 border-l-8 border-primary pl-6 py-2">
              <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter uppercase leading-none">
                {tool.title}
              </h1>
              <p className="text-lg font-medium text-muted-foreground max-w-2xl">{tool.description}</p>
            </div>

            {/* Coming Soon Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-card border-4 border-dashed border-primary/40 rounded-xl p-12 text-center"
            >
              <div className="w-20 h-20 bg-primary/10 border-4 border-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Wrench className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-3xl font-black uppercase text-foreground mb-3">Tool Coming Soon</h2>
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary font-bold uppercase text-sm px-4 py-2 rounded-full border-2 border-primary mb-6">
                <Clock className="w-4 h-4" /> Under Development
              </div>
              <p className="text-muted-foreground text-lg font-medium max-w-md mx-auto mb-8">
                The <strong className="text-foreground">{tool.title}</strong> is currently being built. 
                Check back soon — it will be live at <span className="text-primary font-bold">usonlinetools.com</span>.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-black uppercase tracking-wider rounded-xl border-2 border-foreground hard-shadow hover:-translate-y-1 transition-transform"
              >
                Browse Available Tools <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>

            {/* About This Tool */}
            <section className="bg-card border-2 border-border rounded-xl p-8">
              <h2 className="text-2xl font-black text-foreground uppercase tracking-tight mb-4">
                About {tool.title}
              </h2>
              <p className="text-muted-foreground font-medium text-lg leading-relaxed mb-4">
                The <strong className="text-foreground">{tool.title}</strong> on <a href="https://usonlinetools.com" className="text-primary hover:underline font-bold">usonlinetools.com</a> is a free, browser-based utility designed to help you {tool.description.toLowerCase()} No registration required — simply open the tool and get instant results.
              </p>
              <p className="text-muted-foreground font-medium leading-relaxed">
                All calculations are performed locally in your browser. Your data is never sent to any server, making this a 100% private tool. It works on all devices including mobile, tablet, and desktop.
              </p>
            </section>

            {/* How It Will Work */}
            <section className="bg-card border-2 border-border rounded-xl p-8">
              <h2 className="text-2xl font-black text-foreground uppercase tracking-tight mb-6">
                How to Use This Tool
              </h2>
              <div className="space-y-4">
                {[
                  { step: "1", text: `Open the ${tool.title} on usonlinetools.com` },
                  { step: "2", text: "Enter your values in the input fields provided" },
                  { step: "3", text: "Results are calculated instantly as you type" },
                  { step: "4", text: "Copy or share your results with one click" },
                ].map(({ step, text }) => (
                  <div key={step} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary text-primary-foreground font-black text-lg rounded-lg flex items-center justify-center flex-shrink-0 border-2 border-foreground">
                      {step}
                    </div>
                    <p className="text-muted-foreground font-medium pt-2">{text}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* FAQ */}
            <section className="space-y-4">
              <h2 className="text-2xl font-black text-foreground uppercase tracking-tight">Frequently Asked Questions</h2>
              {[
                {
                  q: `Is the ${tool.title} free to use?`,
                  a: `Yes, the ${tool.title} on usonlinetools.com is completely free. There are no hidden fees, subscriptions, or paywalls.`
                },
                {
                  q: "Do I need to create an account?",
                  a: "No registration or sign-up is required. All tools on usonlinetools.com are available instantly without any account."
                },
                {
                  q: "Is my data safe?",
                  a: "Absolutely. All calculations happen directly in your browser. No data is ever sent to our servers or stored anywhere."
                },
                {
                  q: "Does this tool work on mobile?",
                  a: `Yes, the ${tool.title} is fully responsive and works perfectly on smartphones, tablets, and desktop computers.`
                },
              ].map((item, i) => (
                <div key={i} className="bg-card p-6 rounded-xl border-2 border-border hover:border-primary transition-colors">
                  <h3 className="text-lg font-bold text-foreground mb-2">{item.q}</h3>
                  <p className="text-muted-foreground font-medium">{item.a}</p>
                </div>
              ))}
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="sticky top-28">
              {related.length > 0 && (
                <div className="bg-card p-6 rounded-xl border-2 border-border mb-8">
                  <h3 className="text-lg font-black uppercase tracking-tight text-foreground mb-5">
                    Related Tools
                  </h3>
                  <div className="space-y-3">
                    {related.map((item, index) => (
                      <Link
                        key={index}
                        href={getToolPath(item.slug)}
                        className="group flex items-center p-3 rounded-xl hover:bg-muted transition-all border-2 border-transparent hover:border-foreground"
                      >
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center border-2 border-primary/20 group-hover:border-primary flex-shrink-0">
                          <Wrench className="w-4 h-4 text-primary" />
                        </div>
                        <span className="ml-3 font-bold text-sm text-muted-foreground group-hover:text-foreground transition-colors leading-tight">
                          {item.title}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Category link */}
              {category && (
                <div className="bg-card border-2 border-border rounded-xl p-6 mb-8">
                  <h3 className="text-lg font-black uppercase tracking-tight text-foreground mb-2">Category</h3>
                  <Link href={`/#${category.id}`} className="inline-flex items-center gap-2 text-primary font-bold hover:underline">
                    {category.name} <ArrowRight className="w-4 h-4" />
                  </Link>
                  <p className="text-sm text-muted-foreground mt-2">{category.tools.length} tools available</p>
                </div>
              )}

              <div className="bg-primary p-6 rounded-xl border-4 border-foreground text-primary-foreground hard-shadow">
                <h3 className="text-xl font-black uppercase tracking-tight mb-2">Love this tool?</h3>
                <p className="text-primary-foreground/90 font-medium mb-5">
                  Share usonlinetools.com with your friends and colleagues!
                </p>
                <button
                  onClick={() => navigator.clipboard.writeText(window.location.href)}
                  className="w-full py-3 bg-background text-foreground font-black uppercase tracking-wider rounded-xl border-2 border-foreground hard-shadow hover:-translate-y-1 active:translate-y-1 transition-transform text-sm"
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
