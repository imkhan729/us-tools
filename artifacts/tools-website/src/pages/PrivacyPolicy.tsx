import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";

export default function PrivacyPolicy() {
  return (
    <Layout>
      <SEO
        title="Privacy Policy"
        description="Read the privacy policy for US Online Tools, including how browser-based tools process data and what limited information may be collected by hosting infrastructure."
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <header className="mb-10">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary mb-3">Legal</p>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
            This policy explains, at a high level, how US Online Tools handles information when you
            browse the site and use its browser-based utilities.
          </p>
        </header>

        <div className="space-y-10 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-2xl font-black text-foreground mb-3">Tool inputs</h2>
            <p>
              Most calculator, converter, and generator inputs are processed locally in your browser as
              part of the client-side application. In normal use, that means the values you type into a
              tool are intended to stay on your device rather than being submitted to an application
              server for processing.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-foreground mb-3">Basic technical data</h2>
            <p>
              Like most websites, the hosting platform or CDN used to deliver the site may log standard
              technical request data such as IP address, browser details, requested URL, and timestamp
              for security, uptime, and performance purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-foreground mb-3">Cookies and local storage</h2>
            <p>
              The app may use browser storage for basic experience settings such as theme preference.
              That storage is used to improve usability rather than to build advertising profiles.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-foreground mb-3">Third-party content</h2>
            <p>
              Some pages may load third-party assets such as fonts or shared images. Those providers may
              receive standard browser request data when that content is requested by your browser.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-foreground mb-3">Policy updates</h2>
            <p>
              This page may be updated as the site evolves, especially if additional integrations,
              analytics, or account features are introduced in the future.
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
}
