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
              The library spans 16 core categories including{" "}
              <Link href="/category/math" className="text-primary font-bold hover:underline">
                math
              </Link>
              ,{" "}
              <Link href="/category/finance" className="text-primary font-bold hover:underline">
                finance
              </Link>
              ,{" "}
              <Link href="/category/conversion" className="text-primary font-bold hover:underline">
                unit conversion
              </Link>
              ,{" "}
              <Link href="/category/construction" className="text-primary font-bold hover:underline">
                construction & material estimation
              </Link>
              ,{" "}
              <Link href="/category/health" className="text-primary font-bold hover:underline">
                health & fitness
              </Link>
              ,{" "}
              <Link href="/category/time-date" className="text-primary font-bold hover:underline">
                time & date
              </Link>
              ,{" "}
              <Link href="/category/developer" className="text-primary font-bold hover:underline">
                developer utilities
              </Link>
              ,{" "}
              <Link href="/category/security" className="text-primary font-bold hover:underline">
                security tools
              </Link>
              ,{" "}
              <Link href="/category/pdf" className="text-primary font-bold hover:underline">
                PDF manipulation
              </Link>
              , and{" "}
              <Link href="/category/image" className="text-primary font-bold hover:underline">
                image processing
              </Link>
              . The goal is complete utility without sacrificing clarity: each page helps users finish a
              task in a few steps and understand the exact calculation method behind the result.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-foreground mb-3">Methodology & Calculation Accuracy</h2>
            <p className="mb-4">
              Our calculation engines and conversion utilities are built following verified industry and academic standards:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong className="text-foreground">Standard Mathematical & Scientific Models:</strong> Financial formulas follow standard compound interest, amortization, and net present value equations. Scientific and unit conversions adhere to standard International System of Units (SI) and NIST conversion ratios.
              </li>
              <li>
                <strong className="text-foreground">Official Technical RFCs:</strong> Developer tools adhere to official standards, including RFC 4648 (Base64 encoding), RFC 4122 (UUID generation), RFC 8259 (JSON specification), and standard W3C CSS / HTML formatting specs.
              </li>
              <li>
                <strong className="text-foreground">Precision & Floating-Point Handling:</strong> Numerical calculations are guarded against common floating-point rounding errors through explicit precision rounding and boundary validations.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black text-foreground mb-3">Local Browser Processing & Privacy Architecture</h2>
            <p className="mb-4">
              We operate on a privacy-first, client-side execution model:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong className="text-foreground">Zero Remote Data Storage:</strong> Tool calculations, text manipulation, image processing, password generation, and document conversions run directly inside your web browser using modern JavaScript and Web APIs.
              </li>
              <li>
                <strong className="text-foreground">No Account or Personal Information Needed:</strong> We never require registration, login credentials, or tracking cookies to access any tool or calculator on the site.
              </li>
              <li>
                <strong className="text-foreground">Instantaneous Response:</strong> Local processing removes server latency, giving instant real-time results as you type or adjust sliders.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black text-foreground mb-3">Continuous Quality & Feedback</h2>
            <p>
              Tools are regularly reviewed against updated formulas, browser standards, and user feedback. If you identify a formula discrepancy, edge case, or have a suggestion for an additional calculator or converter, please review our{" "}
              <Link href="/terms-of-service" className="text-primary font-bold hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy-policy" className="text-primary font-bold hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
}
