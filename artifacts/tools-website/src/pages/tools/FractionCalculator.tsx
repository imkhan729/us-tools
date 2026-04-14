import { useMemo, useState } from "react";
import { ArrowRightLeft, Calculator, Percent, Scale, Sigma } from "lucide-react";
import UtilityToolPageShell from "./UtilityToolPageShell";

interface FractionValue {
  n: number;
  d: number;
}

function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);

  while (y !== 0) {
    const remainder = x % y;
    x = y;
    y = remainder;
  }

  return x || 1;
}

function normalizeFraction(numerator: number, denominator: number): FractionValue | null {
  if (!Number.isInteger(numerator) || !Number.isInteger(denominator) || denominator === 0) {
    return null;
  }

  const divisor = gcd(numerator, denominator);
  const sign = denominator < 0 ? -1 : 1;

  return {
    n: (numerator / divisor) * sign,
    d: Math.abs(denominator / divisor),
  };
}

function formatFraction(value: FractionValue | null): string {
  if (!value) return "--";
  if (value.d === 1) return `${value.n}`;
  return `${value.n}/${value.d}`;
}

function formatMixed(value: FractionValue | null): string {
  if (!value) return "--";

  const sign = value.n < 0 ? "-" : "";
  const whole = Math.trunc(Math.abs(value.n) / value.d);
  const remainder = Math.abs(value.n) % value.d;

  if (remainder === 0) return `${value.n}`;
  if (whole === 0) return `${sign}${remainder}/${value.d}`;
  return `${sign}${whole} ${remainder}/${value.d}`;
}

function formatDecimal(value: FractionValue | null): string {
  if (!value) return "--";
  return (value.n / value.d).toLocaleString("en-US", { maximumFractionDigits: 6 });
}

function operateFractions(left: FractionValue, right: FractionValue, operation: "+" | "-" | "*" | "/"): FractionValue | null {
  if (operation === "+") return normalizeFraction(left.n * right.d + right.n * left.d, left.d * right.d);
  if (operation === "-") return normalizeFraction(left.n * right.d - right.n * left.d, left.d * right.d);
  if (operation === "*") return normalizeFraction(left.n * right.n, left.d * right.d);
  if (right.n === 0) return null;
  return normalizeFraction(left.n * right.d, left.d * right.n);
}

export default function FractionCalculator() {
  const [simpleNumerator, setSimpleNumerator] = useState("24");
  const [simpleDenominator, setSimpleDenominator] = useState("36");
  const [operation, setOperation] = useState<"+" | "-" | "*" | "/">("+");
  const [leftNumerator, setLeftNumerator] = useState("1");
  const [leftDenominator, setLeftDenominator] = useState("2");
  const [rightNumerator, setRightNumerator] = useState("3");
  const [rightDenominator, setRightDenominator] = useState("4");

  const simplified = useMemo(() => {
    const numerator = Number(simpleNumerator);
    const denominator = Number(simpleDenominator);

    if (!Number.isFinite(numerator) || !Number.isFinite(denominator)) return null;
    return normalizeFraction(numerator, denominator);
  }, [simpleDenominator, simpleNumerator]);

  const operationResult = useMemo(() => {
    const left = normalizeFraction(Number(leftNumerator), Number(leftDenominator));
    const right = normalizeFraction(Number(rightNumerator), Number(rightDenominator));

    if (!left || !right) return null;
    return operateFractions(left, right, operation);
  }, [leftDenominator, leftNumerator, operation, rightDenominator, rightNumerator]);

  return (
    <UtilityToolPageShell
      title="Fraction Calculator"
      seoTitle="Fraction Calculator - Simplify and Calculate Fractions"
      seoDescription="Free online fraction calculator. Simplify fractions and perform fraction addition, subtraction, multiplication, and division instantly."
      canonical="https://usonlinetools.com/math/fraction-calculator"
      categoryName="Math & Calculators"
      categoryHref="/category/math"
      heroDescription="Use this browser-based fraction calculator to simplify fractions, convert improper fractions into mixed numbers, and solve fraction addition, subtraction, multiplication, and division without opening separate tools."
      heroIcon={<Calculator className="w-3.5 h-3.5" />}
      calculatorLabel="2 Fraction Workflows"
      calculatorDescription="Simplify a single fraction or calculate with two fractions. Results update instantly as you type."
      calculator={
        <div className="space-y-5">
          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4 md:p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-blue-500 text-white flex items-center justify-center">
                <Scale className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Simplify Fraction</p>
                <p className="text-sm text-muted-foreground">Enter whole-number numerator and denominator.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-3 items-center">
              <input className="tool-calc-input" type="number" step="1" value={simpleNumerator} onChange={(e) => setSimpleNumerator(e.target.value)} placeholder="Numerator" />
              <div className="text-center text-sm font-black text-muted-foreground">/</div>
              <input className="tool-calc-input" type="number" step="1" value={simpleDenominator} onChange={(e) => setSimpleDenominator(e.target.value)} placeholder="Denominator" />
            </div>

            {simplified ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                <div className="tool-calc-result">
                  <p className="text-xs text-muted-foreground">Simplified</p>
                  <p className="text-2xl font-black text-blue-600">{formatFraction(simplified)}</p>
                </div>
                <div className="tool-calc-result">
                  <p className="text-xs text-muted-foreground">Mixed Number</p>
                  <p className="text-2xl font-black text-blue-600">{formatMixed(simplified)}</p>
                </div>
                <div className="tool-calc-result">
                  <p className="text-xs text-muted-foreground">Decimal</p>
                  <p className="text-2xl font-black text-blue-600">{formatDecimal(simplified)}</p>
                </div>
              </div>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">Use whole numbers and a non-zero denominator to calculate.</p>
            )}
          </div>

          <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-4 md:p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-cyan-500 text-white flex items-center justify-center">
                <ArrowRightLeft className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Fraction Operations</p>
                <p className="text-sm text-muted-foreground">Add, subtract, multiply, or divide two fractions.</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {(["+", "-", "*", "/"] as const).map((symbol) => (
                <button
                  key={symbol}
                  type="button"
                  onClick={() => setOperation(symbol)}
                  className={`px-4 py-2 rounded-xl border text-sm font-bold transition-colors ${
                    operation === symbol ? "bg-cyan-500 text-white border-cyan-500" : "border-border text-muted-foreground hover:border-cyan-500/40"
                  }`}
                >
                  {symbol}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-border bg-background/80 p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Fraction A</p>
                <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-center">
                  <input className="tool-calc-input" type="number" step="1" value={leftNumerator} onChange={(e) => setLeftNumerator(e.target.value)} placeholder="Numerator" />
                  <div className="text-center text-sm font-black text-muted-foreground">/</div>
                  <input className="tool-calc-input" type="number" step="1" value={leftDenominator} onChange={(e) => setLeftDenominator(e.target.value)} placeholder="Denominator" />
                </div>
              </div>

              <div className="rounded-xl border border-border bg-background/80 p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Fraction B</p>
                <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-center">
                  <input className="tool-calc-input" type="number" step="1" value={rightNumerator} onChange={(e) => setRightNumerator(e.target.value)} placeholder="Numerator" />
                  <div className="text-center text-sm font-black text-muted-foreground">/</div>
                  <input className="tool-calc-input" type="number" step="1" value={rightDenominator} onChange={(e) => setRightDenominator(e.target.value)} placeholder="Denominator" />
                </div>
              </div>
            </div>

            {operationResult ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                <div className="tool-calc-result">
                  <p className="text-xs text-muted-foreground">Result</p>
                  <p className="text-2xl font-black text-cyan-600">{formatFraction(operationResult)}</p>
                </div>
                <div className="tool-calc-result">
                  <p className="text-xs text-muted-foreground">Mixed</p>
                  <p className="text-2xl font-black text-cyan-600">{formatMixed(operationResult)}</p>
                </div>
                <div className="tool-calc-result">
                  <p className="text-xs text-muted-foreground">Decimal</p>
                  <p className="text-2xl font-black text-cyan-600">{formatDecimal(operationResult)}</p>
                </div>
              </div>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">Enter valid whole-number fractions. Division by a zero fraction is not allowed.</p>
            )}
          </div>
        </div>
      }
      howSteps={[
        { title: "Enter one fraction to simplify", description: "Type a whole-number numerator and denominator to reduce a fraction to lowest terms and see its mixed-number and decimal forms." },
        { title: "Switch to a fraction operation", description: "Use the operator buttons to choose addition, subtraction, multiplication, or division for two fractions." },
        { title: "Read the simplified answer", description: "The result is automatically reduced, so you can copy the clean fraction or use the decimal form right away." },
      ]}
      interpretationCards={[
        { title: "The simplified fraction is the exact answer", description: "This is the reduced form with the sign normalized and no common factor left in the numerator and denominator." },
        { title: "Mixed numbers are easier to read for improper fractions", description: "If the numerator is larger than the denominator, the calculator also shows the whole-number-plus-fraction version.", className: "bg-cyan-500/5 border-cyan-500/20" },
        { title: "Decimal output is rounded for quick use", description: "The decimal card is useful for estimates, but the fraction card remains the precise answer.", className: "bg-violet-500/5 border-violet-500/20" },
      ]}
      examples={[
        { scenario: "Simplify", input: "24/36", output: "2/3" },
        { scenario: "Addition", input: "1/2 + 3/4", output: "5/4" },
        { scenario: "Division", input: "2/3 ÷ 5/6", output: "4/5" },
      ]}
      whyChoosePoints={[
        "This page targets the exact missing fraction-calculator search intent instead of forcing users through separate fraction-conversion tools.",
        "The layout follows the same strong calculator-first structure as the better percentage-style pages: live widget first, then examples, interpretation, FAQ, and related tools.",
        "Everything runs in the browser, so students, teachers, and shoppers can simplify or compare fractions without sending data anywhere.",
      ]}
      faqs={[
        { q: "Can I use decimals in this fraction calculator?", a: "This version expects whole numbers for the numerator and denominator so the fraction math stays exact and simplified correctly." },
        { q: "Why is a negative sign shown only once?", a: "The calculator normalizes fractions so the denominator stays positive and the sign moves to the numerator or whole-number part." },
        { q: "What happens if the denominator is zero?", a: "A denominator of zero is undefined, so the calculator does not return a result until you enter a valid denominator." },
        { q: "Does the result auto-simplify?", a: "Yes. Every valid result is reduced to lowest terms automatically." },
      ]}
      relatedTools={[
        { title: "Decimal to Fraction Calculator", slug: "decimal-to-fraction-calculator", icon: <Percent className="w-4 h-4" />, color: 210, benefit: "Turn decimals into reduced fractions" },
        { title: "Fraction to Decimal Calculator", slug: "fraction-to-decimal-calculator", icon: <Sigma className="w-4 h-4" />, color: 265, benefit: "Convert exact fractions to decimals" },
        { title: "Ratio Calculator", slug: "ratio-calculator", icon: <Scale className="w-4 h-4" />, color: 150, benefit: "Simplify ratios in the same workflow" },
        { title: "Percentage Calculator", slug: "percentage-calculator", icon: <Percent className="w-4 h-4" />, color: 330, benefit: "Move from fractions into percent form" },
        { title: "Proportion Calculator", slug: "proportion-calculator", icon: <Calculator className="w-4 h-4" />, color: 40, benefit: "Solve related fraction and ratio equations" },
      ]}
      ctaTitle="Need More Math Tools?"
      ctaDescription="Continue into percentage, ratio, decimal, and proportion calculators to handle the rest of the same worksheet or shopping workflow."
      ctaHref="/category/math"
    />
  );
}
