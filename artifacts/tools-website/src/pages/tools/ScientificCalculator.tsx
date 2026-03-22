import { useState, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { Delete, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ── Safe expression evaluator ─────────────────────────────────────────────────
function safeEval(expr: string): string {
  try {
    // Replace math functions
    let e = expr
      .replace(/×/g, "*")
      .replace(/÷/g, "/")
      .replace(/\^/g, "**")
      .replace(/√\(/g, "Math.sqrt(")
      .replace(/sin\(/g, "Math.sin(")
      .replace(/cos\(/g, "Math.cos(")
      .replace(/tan\(/g, "Math.tan(")
      .replace(/asin\(/g, "Math.asin(")
      .replace(/acos\(/g, "Math.acos(")
      .replace(/atan\(/g, "Math.atan(")
      .replace(/log\(/g, "Math.log10(")
      .replace(/ln\(/g, "Math.log(")
      .replace(/abs\(/g, "Math.abs(")
      .replace(/ceil\(/g, "Math.ceil(")
      .replace(/floor\(/g, "Math.floor(")
      .replace(/π/g, "Math.PI")
      .replace(/e(?![0-9+\-])/g, "Math.E")
      .replace(/(\d+)!/g, (_, n) => factorial(parseInt(n)).toString());

    // Trig degree mode
    if (/Math\.(sin|cos|tan)\(/.test(e)) {
      e = e
        .replace(/Math\.sin\(/g, "Math.sin(Math.PI/180*")
        .replace(/Math\.cos\(/g, "Math.cos(Math.PI/180*")
        .replace(/Math\.tan\(/g, "Math.tan(Math.PI/180*");
    }

    // Safety check
    if (/[^0-9+\-*/.()%^a-zA-Z_,\s]/.test(e)) return "Error";
    // eslint-disable-next-line no-new-func
    const result = Function(`"use strict"; return (${e})`)();
    if (!isFinite(result) || isNaN(result)) return "Error";
    // Format
    if (Math.abs(result) >= 1e12 || (Math.abs(result) < 1e-7 && result !== 0)) {
      return result.toExponential(6);
    }
    return parseFloat(result.toPrecision(12)).toString();
  } catch {
    return "Error";
  }
}

function factorial(n: number): number {
  if (n < 0 || n > 170) return NaN;
  if (n <= 1) return 1;
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

// ── Button grid definition ────────────────────────────────────────────────────
type BtnDef = { label: string; value: string; type: "num" | "op" | "fn" | "ctrl" | "eq"; wide?: boolean };

const BUTTONS: BtnDef[][] = [
  [
    { label: "AC", value: "AC", type: "ctrl" },
    { label: "⌫", value: "DEL", type: "ctrl" },
    { label: "%", value: "%", type: "op" },
    { label: "÷", value: "÷", type: "op" },
  ],
  [
    { label: "sin", value: "sin(", type: "fn" },
    { label: "cos", value: "cos(", type: "fn" },
    { label: "tan", value: "tan(", type: "fn" },
    { label: "×", value: "×", type: "op" },
  ],
  [
    { label: "x²", value: "^2", type: "fn" },
    { label: "xⁿ", value: "^", type: "op" },
    { label: "√", value: "√(", type: "fn" },
    { label: "−", value: "-", type: "op" },
  ],
  [
    { label: "log", value: "log(", type: "fn" },
    { label: "ln", value: "ln(", type: "fn" },
    { label: "!", value: "!", type: "fn" },
    { label: "+", value: "+", type: "op" },
  ],
  [
    { label: "π", value: "π", type: "fn" },
    { label: "e", value: "e", type: "fn" },
    { label: "(", value: "(", type: "op" },
    { label: ")", value: ")", type: "op" },
  ],
  [
    { label: "7", value: "7", type: "num" },
    { label: "8", value: "8", type: "num" },
    { label: "9", value: "9", type: "num" },
    { label: "=", value: "=", type: "eq" },
  ],
  [
    { label: "4", value: "4", type: "num" },
    { label: "5", value: "5", type: "num" },
    { label: "6", value: "6", type: "num" },
    { label: "=", value: "=", type: "eq" },
  ],
  [
    { label: "1", value: "1", type: "num" },
    { label: "2", value: "2", type: "num" },
    { label: "3", value: "3", type: "num" },
    { label: "=", value: "=", type: "eq" },
  ],
  [
    { label: "0", value: "0", type: "num", wide: true },
    { label: ".", value: ".", type: "num" },
    { label: "=", value: "=", type: "eq" },
  ],
];

// Flatten for rendering but use custom grid
const ROWS: BtnDef[][] = [
  [
    { label: "AC",  value: "AC",  type: "ctrl" },
    { label: "⌫",   value: "DEL", type: "ctrl" },
    { label: "%",   value: "%",   type: "op" },
    { label: "÷",   value: "÷",   type: "op" },
  ],
  [
    { label: "sin", value: "sin(", type: "fn" },
    { label: "cos", value: "cos(", type: "fn" },
    { label: "tan", value: "tan(", type: "fn" },
    { label: "×",   value: "×",   type: "op" },
  ],
  [
    { label: "x²",  value: "^2",  type: "fn" },
    { label: "xⁿ",  value: "^",   type: "op" },
    { label: "√",   value: "√(",  type: "fn" },
    { label: "−",   value: "-",   type: "op" },
  ],
  [
    { label: "log", value: "log(", type: "fn" },
    { label: "ln",  value: "ln(", type: "fn" },
    { label: "n!",  value: "!",   type: "fn" },
    { label: "+",   value: "+",   type: "op" },
  ],
  [
    { label: "π",   value: "π",   type: "fn" },
    { label: "e",   value: "e",   type: "fn" },
    { label: "(",   value: "(",   type: "op" },
    { label: ")",   value: ")",   type: "op" },
  ],
  [
    { label: "7",  value: "7", type: "num" },
    { label: "8",  value: "8", type: "num" },
    { label: "9",  value: "9", type: "num" },
    { label: "=",  value: "=", type: "eq"  },
  ],
  [
    { label: "4",  value: "4", type: "num" },
    { label: "5",  value: "5", type: "num" },
    { label: "6",  value: "6", type: "num" },
  ],
  [
    { label: "1",  value: "1", type: "num" },
    { label: "2",  value: "2", type: "num" },
    { label: "3",  value: "3", type: "num" },
  ],
  [
    { label: "0",  value: "0",  type: "num", wide: true },
    { label: ".",  value: ".",  type: "num" },
  ],
];

function btnColor(type: BtnDef["type"]) {
  switch (type) {
    case "eq":   return "bg-[hsl(var(--calc-hue),80%,45%)] hover:bg-[hsl(var(--calc-hue),80%,38%)] text-white";
    case "op":   return "bg-[hsl(var(--calc-hue),40%,30%)] hover:bg-[hsl(var(--calc-hue),40%,25%)] text-white";
    case "fn":   return "bg-[hsl(var(--calc-hue),30%,22%)] hover:bg-[hsl(var(--calc-hue),30%,18%)] text-[hsl(var(--calc-hue),80%,75%)]";
    case "ctrl": return "bg-red-600/80 hover:bg-red-600 text-white";
    default:     return "bg-[hsl(var(--calc-hue),20%,20%)] hover:bg-[hsl(var(--calc-hue),20%,28%)] text-white";
  }
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-[hsl(var(--border))] rounded-xl overflow-hidden">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left font-semibold hover:bg-[hsl(var(--muted))] transition-colors">
        <span>{q}</span>
        {open ? <ChevronUp size={18} className="shrink-0" /> : <ChevronDown size={18} className="shrink-0" />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
            <p className="px-5 pb-4 text-[hsl(var(--muted-foreground))] leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const FAQS = [
  { q: "What is the order of operations (PEMDAS)?", a: "PEMDAS stands for Parentheses, Exponents, Multiplication/Division (left to right), Addition/Subtraction (left to right). This determines the order in which parts of a mathematical expression are evaluated." },
  { q: "How does this scientific calculator handle trigonometry?", a: "Trig functions (sin, cos, tan) use degrees by default. So sin(90) = 1, cos(0) = 1, tan(45) ≈ 1. For radians, convert manually: radians = degrees × π/180." },
  { q: "What is e (Euler's number)?", a: "e ≈ 2.71828 is the base of natural logarithms. It appears in compound interest, population growth, and many natural phenomena. The natural log ln(x) is the inverse of eˣ." },
  { q: "What is log vs ln?", a: "log (base-10 logarithm) asks 'what power of 10 gives this number?' — log(100) = 2. ln (natural logarithm) uses base e — ln(e) = 1. Scientific calculators use this convention universally." },
  { q: "How do I calculate factorials?", a: "n! = n × (n−1) × … × 2 × 1. For example, 5! = 120. Type a number then press n! (or type 5! in the expression). 0! = 1 by definition. This calculator supports up to 170!." },
  { q: "What is √ (square root)?", a: "√x is the number that, when multiplied by itself, equals x. √25 = 5 because 5² = 25. For other roots, use the exponent: cube root of 8 = 8^(1/3) = 2." },
];

const LD_JSON = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "WebApplication", "name": "Scientific Calculator", "description": "Free online scientific calculator with sin, cos, tan, log, ln, exponents, square root, factorial, π and e.", "applicationCategory": "UtilityApplication", "operatingSystem": "Any", "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" } },
    { "@type": "FAQPage", "mainEntity": FAQS.map(f => ({ "@type": "Question", "name": f.q, "acceptedAnswer": { "@type": "Answer", "text": f.a } })) },
  ],
};

export default function ScientificCalculator() {
  const [expr, setExpr] = useState("0");
  const [history, setHistory] = useState<{ expr: string; result: string }[]>([]);
  const [justCalc, setJustCalc] = useState(false);

  const press = useCallback((btn: BtnDef) => {
    if (btn.value === "AC") { setExpr("0"); setJustCalc(false); return; }
    if (btn.value === "DEL") { setExpr(p => p.length > 1 ? p.slice(0, -1) : "0"); setJustCalc(false); return; }
    if (btn.value === "=") {
      const result = safeEval(expr);
      setHistory(h => [{ expr, result }, ...h].slice(0, 10));
      setExpr(result);
      setJustCalc(true);
      return;
    }
    setExpr(p => {
      const cur = (justCalc && !["÷","×","-","+","^","%"].includes(btn.value)) ? btn.value : (p === "0" && btn.type === "num" ? btn.value : p + btn.value);
      setJustCalc(false);
      return cur;
    });
  }, [expr, justCalc]);

  const displayExpr = expr.length > 22 ? "…" + expr.slice(-22) : expr;

  return (
    <>
      <Helmet>
        <title>Scientific Calculator Online – Free sin, cos, log, √ | US Online Tools</title>
        <meta name="description" content="Free online scientific calculator. Calculate sin, cos, tan, log, ln, square root, exponents, factorial, π, and e. Works on any device." />
        <meta name="keywords" content="scientific calculator, online calculator, sin cos tan calculator, log calculator, square root calculator, exponent calculator, free calculator" />
        <link rel="canonical" href="https://us-online.tools/math/scientific-calculator" />
        <script type="application/ld+json">{JSON.stringify(LD_JSON)}</script>
      </Helmet>

      <div className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]" style={{"--calc-hue": "220"} as React.CSSProperties}>

        <section className="bg-gradient-to-br from-[hsl(220,70%,14%)] to-[hsl(220,60%,22%)] text-white py-14 px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3">Scientific Calculator</h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">Trig, logarithms, exponents, factorials, constants — all in your browser. No download required.</p>
        </section>

        <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Calculator */}
            <div className="w-full lg:w-auto lg:min-w-[360px]">
              <div className="rounded-2xl overflow-hidden shadow-2xl bg-[hsl(220,25%,10%)] border border-[hsl(220,30%,20%)]">
                {/* Display */}
                <div className="p-4 pb-2 text-right">
                  <p className="text-[hsl(220,40%,55%)] text-xs min-h-[1.2em] truncate font-mono">
                    {history[0] ? `${history[0].expr} =` : ""}
                  </p>
                  <p className="text-white text-3xl font-bold font-mono tracking-wider mt-1 min-h-[2em] break-all">
                    {displayExpr}
                  </p>
                </div>

                {/* Buttons */}
                <div className="p-3 space-y-2">
                  {ROWS.map((row, ri) => (
                    <div key={ri} className="grid gap-2" style={{ gridTemplateColumns: row.some(b => b.wide) ? "2fr 1fr 1fr" : ri >= 5 && ri <= 8 ? "1fr 1fr 1fr" + (ri === 5 ? " 2fr" : "") : "1fr 1fr 1fr 1fr" }}>
                      {/* Rows 5 has '=' spanning rows 5-8 */}
                      {row.map((btn, bi) => (
                        <button
                          key={bi}
                          onClick={() => press(btn)}
                          className={`rounded-xl py-4 text-lg font-bold transition-all active:scale-95 ${btnColor(btn.type)} ${btn.wide ? "col-span-2" : ""}`}
                        >
                          {btn.label === "⌫" ? <Delete size={18} className="mx-auto" /> : btn.label}
                        </button>
                      ))}
                    </div>
                  ))}
                  {/* Standalone equals spanning last 4 rows */}
                  <button
                    onClick={() => press({ label: "=", value: "=", type: "eq" })}
                    className={`w-full rounded-xl py-4 text-lg font-bold transition-all active:scale-95 ${btnColor("eq")}`}
                    style={{ display: "none" }}
                  />
                </div>
              </div>
            </div>

            {/* History + Tips */}
            <div className="flex-1 space-y-5">
              {/* History */}
              <div className="tool-calc-card rounded-2xl p-5">
                <h3 className="font-bold text-sm mb-3 text-[hsl(var(--muted-foreground))]">CALCULATION HISTORY</h3>
                {history.length === 0 ? (
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">Your calculations will appear here.</p>
                ) : (
                  <div className="space-y-2">
                    {history.map((h, i) => (
                      <div key={i} className="tool-calc-result rounded-lg p-3 cursor-pointer hover:opacity-80" onClick={() => setExpr(h.result)}>
                        <p className="text-xs text-[hsl(var(--muted-foreground))] truncate">{h.expr}</p>
                        <p className="font-bold tool-calc-number">{h.result}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Reference */}
              <div className="tool-calc-card rounded-2xl p-5">
                <h3 className="font-bold text-sm mb-3 text-[hsl(var(--muted-foreground))]">FUNCTION REFERENCE</h3>
                <div className="space-y-1.5 text-sm font-mono">
                  {[
                    ["sin(x)", "Sine of x (degrees)"],
                    ["cos(x)", "Cosine of x (degrees)"],
                    ["tan(x)", "Tangent of x (degrees)"],
                    ["log(x)", "Base-10 logarithm"],
                    ["ln(x)",  "Natural logarithm (base e)"],
                    ["√(x)",   "Square root of x"],
                    ["x^n",    "x raised to power n"],
                    ["n!",     "Factorial of n"],
                    ["π",      "3.14159265…"],
                    ["e",      "2.71828182…"],
                  ].map(([fn, desc]) => (
                    <div key={fn} className="flex gap-3">
                      <span className="text-[hsl(var(--calc-hue),70%,60%)] w-20 shrink-0">{fn}</span>
                      <span className="text-[hsl(var(--muted-foreground))]">{desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* How to Use */}
          <section className="prose prose-neutral dark:prose-invert max-w-none">
            <h2 className="text-2xl font-bold mb-4">How to Use the Scientific Calculator</h2>
            <p>This online scientific calculator supports all standard operations. Click buttons or use keyboard input to build your expression, then press <strong>=</strong> to evaluate. Results are stored in the history panel for easy reference.</p>

            <h3 className="text-xl font-bold mt-6 mb-3">Trigonometric Functions</h3>
            <p>All trig functions (sin, cos, tan) use <strong>degrees</strong>. To calculate sin(π/6): use sin(30) = 0.5. To work in radians, you can multiply by 180/π manually.</p>
            <div className="tool-calc-result rounded-xl p-4 my-3 text-sm font-mono">
              <p>sin(30) = 0.5 &nbsp;&nbsp;&nbsp; cos(60) = 0.5 &nbsp;&nbsp;&nbsp; tan(45) = 1</p>
              <p>sin(90) = 1 &nbsp;&nbsp;&nbsp;&nbsp; cos(0) = 1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; tan(0) = 0</p>
            </div>

            <h3 className="text-xl font-bold mt-6 mb-3">Logarithms</h3>
            <p>Use <strong>log(x)</strong> for base-10 logarithm and <strong>ln(x)</strong> for the natural logarithm. Examples: log(1000) = 3, ln(e) = 1, log(100) = 2.</p>

            <h3 className="text-xl font-bold mt-6 mb-3">Exponents and Roots</h3>
            <p>Use <strong>^</strong> for powers: 2^10 = 1024. For roots, √ computes the square root, or use fractional exponents: 8^(1/3) = 2 (cube root of 8).</p>

            <h3 className="text-xl font-bold mt-6 mb-3">Constants π and e</h3>
            <p>Press π to insert 3.14159265…, and e to insert 2.71828182…. These can be used in any expression: 2×π×5 = 31.4159 (circumference of circle with radius 5).</p>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="text-2xl font-bold mb-5">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {FAQS.map(f => <FaqItem key={f.q} q={f.q} a={f.a} />)}
            </div>
          </section>

          {/* Related */}
          <section>
            <h2 className="text-xl font-bold mb-4">Related Tools</h2>
            <div className="flex flex-wrap gap-3">
              {[
                { label: "Average Calculator", href: "/math/average-calculator" },
                { label: "Standard Deviation Calculator", href: "/math/standard-deviation-calculator" },
                { label: "Percentage Calculator", href: "/math/percentage-calculator" },
                { label: "Fraction to Decimal", href: "/math/fraction-to-decimal-calculator" },
                { label: "Percentage Change Calculator", href: "/math/percentage-change-calculator" },
              ].map(t => (
                <a key={t.href} href={t.href} className="px-4 py-2 rounded-full border border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))] transition-colors text-sm font-medium">{t.label}</a>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
