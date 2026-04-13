import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { SITE_URL, createBreadcrumbSchema } from "@/lib/seo";

export default function About() {
  const schema = [
    {
      "@type": "AboutPage",
      name: "About US Online Tools",
      url: `${SITE_URL}/about`,
      description:
        "Learn what US Online Tools is, how the site works, and why the calculators, converters, and generators are built for fast browser-based use.",
    },
    createBreadcrumbSchema([
      { name: "Home", item: SITE_URL },
      { name: "About", item: `${SITE_URL}/about` },
    ]),
  ];

  return (
    <Layout>
      <SEO
        title="About US Online Tools"
        description="Learn what US Online Tools is, how the site works, and why the calculators, converters, and generators are built for fast browser-based use."
        canonical="/about"
        schema={schema}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <header className="mb-10">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary mb-3">About</p>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground mb-4">
            About US Online Tools
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
            US Online Tools is a browser-based collection of free calculators, converters, generators,
            and utility tools designed to solve everyday tasks quickly without forcing users through
            signup flows, paywalls, or bloated software installs.
          </p>
        </header>

        <div className="space-y-10 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-2xl font-black text-foreground mb-3">What the site covers</h2>
            <p>
              The library spans practical categories such as{" "}
              <Link href="/category/math" className="text-primary font-bold hover:underline">
                math
              </Link>
              ,{" "}
              <Link href="/category/finance" className="text-primary font-bold hover:underline">
                finance
              </Link>
              ,{" "}
              <Link href="/category/conversion" className="text-primary font-bold hover:underline">
                conversion
              </Link>
              ,{" "}
              <Link href="/category/time-date" className="text-primary font-bold hover:underline">
                time and date
              </Link>
              ,{" "}
              <Link href="/category/developer" className="text-primary font-bold hover:underline">
                developer tools
              </Link>
              , and{" "}
              <Link href="/category/seo" className="text-primary font-bold hover:underline">
                SEO utilities
              </Link>
              . The goal is breadth without sacrificing clarity: each page should help users finish a
              task in a few steps and understand the result they get back.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-foreground mb-3">How the tools work</h2>
            <p>
              Most tool logic on this site runs directly in the browser. That keeps interactions fast
              and makes the experience work well on desktop and mobile without relying on heavy server
              round trips for routine calculations and formatting tasks.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-foreground mb-3">What the site is optimized for</h2>
            <p>
              The focus is on speed, straightforward UX, and practical utility. Pages are designed to
              be accessible from search, easy to share, and internally linked so visitors can move from
              one related task to the next without hunting through multiple sites.
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
}
