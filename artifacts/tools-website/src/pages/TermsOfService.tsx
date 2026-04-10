import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";

export default function TermsOfService() {
  return (
    <Layout>
      <SEO
        title="Terms of Service"
        description="Review the terms of service for using US Online Tools, including acceptable use, informational disclaimers, and site availability limitations."
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <header className="mb-10">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary mb-3">Legal</p>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground mb-4">
            Terms of Service
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
            These terms describe the general rules for accessing and using US Online Tools.
          </p>
        </header>

        <div className="space-y-10 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-2xl font-black text-foreground mb-3">Informational use</h2>
            <p>
              The calculators, converters, and generators on this site are provided for general
              informational and productivity purposes. Results should be reviewed before being used for
              legal, medical, tax, safety-critical, or other high-stakes decisions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-foreground mb-3">Acceptable use</h2>
            <p>
              You agree not to misuse the site, interfere with its operation, attempt unauthorized
              access, or use the tools in ways that violate applicable law or the rights of others.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-foreground mb-3">Availability and changes</h2>
            <p>
              Tools, pages, and features may be updated, replaced, removed, or temporarily unavailable
              without notice as the site evolves.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-foreground mb-3">No warranty</h2>
            <p>
              The site is provided on an “as is” and “as available” basis without any guarantee that a
              tool will be error-free, uninterrupted, or suitable for every use case.
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
}
