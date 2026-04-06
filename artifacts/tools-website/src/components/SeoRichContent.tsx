type FormulaItem = {
  expression: string;
  explanation: string;
};

type UseCaseItem = {
  title: string;
  description: string;
};

interface SeoRichContentProps {
  toolName: string;
  primaryKeyword: string;
  intro: string;
  formulas: FormulaItem[];
  useCases: UseCaseItem[];
  tips: string[];
}

export function SeoRichContent({
  toolName,
  primaryKeyword,
  intro,
  formulas,
  useCases,
  tips,
}: SeoRichContentProps) {
  return (
    <section id="detailed-guide" className="bg-card border border-border rounded-2xl p-6 md:p-8">
      <h2 className="text-2xl font-black text-foreground tracking-tight mb-4">
        Detailed {toolName} Guide
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-4">{intro}</p>
      <p className="text-muted-foreground leading-relaxed mb-6">
        This {primaryKeyword} is designed for real-world calculations where speed,
        clarity, and accuracy matter. The goal is to help users solve the math
        correctly, understand the result, and apply it in business, education,
        engineering, and day-to-day decision making.
      </p>

      <div className="p-5 rounded-xl bg-muted/60 border border-border mb-6">
        <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">
          Core Formulas and Logic
        </h3>
        <div className="space-y-3">
          {formulas.map((item, idx) => (
            <div key={`${item.expression}-${idx}`} className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <div className="min-w-0">
                <code className="px-2 py-1.5 bg-background rounded text-xs font-mono inline-block mb-2 break-all">
                  {item.expression}
                </code>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.explanation}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-black text-foreground tracking-tight mb-4">
          Real-World Use Cases
        </h3>
        <div className="space-y-3">
          {useCases.map((item) => (
            <div key={item.title} className="p-4 rounded-xl border border-border bg-muted/30">
              <p className="font-bold text-foreground mb-1">{item.title}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-black text-foreground tracking-tight mb-4">
          Accuracy Tips and Common Mistakes
        </h3>
        <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed">
          {tips.map((tip, idx) => (
            <li key={`${idx}-${tip}`} className="flex gap-2">
              <span className="text-primary font-bold mt-0.5">*</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
