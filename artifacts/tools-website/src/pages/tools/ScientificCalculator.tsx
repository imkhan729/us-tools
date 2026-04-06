import { useMemo, useState } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { getToolPath } from "@/data/tools";
import { Link } from "wouter";
import {
  ArrowRight,
  BadgeCheck,
  Calculator,
  Check,
  ChevronRight,
  Copy,
  Lock,
  Shield,
  Smartphone,
  Zap,
} from "lucide-react";

type Mode =
  | "standard"
  | "scientific"
  | "calculus"
  | "programmer"
  | "fractions"
  | "equations"
  | "matrices"
  | "converter";
type Angle = "deg" | "rad";
type Unit = "mm" | "cm" | "m" | "km" | "in" | "ft" | "yd" | "mi";
type BitOp = "AND" | "OR" | "XOR" | "LSH" | "RSH";
type Matrix2 = [[number, number], [number, number]];

const TABS: Mode[] = [
  "standard",
  "scientific",
  "calculus",
  "programmer",
  "fractions",
  "equations",
  "matrices",
  "converter",
];

const MODE_LABELS: Record<Mode, string> = {
  standard: "Standard",
  scientific: "Scientific",
  calculus: "Calculus",
  programmer: "Programmer",
  fractions: "Fractions",
  equations: "Equations",
  matrices: "Matrices",
  converter: "Converter",
};

const SCIENTIFIC_KEYS = [
  "sin(",
  "cos(",
  "tan(",
  "ln(",
  "log(",
  "sqrt(",
  "(",
  ")",
  "^",
  "PI",
  "E",
  "DEL",
  "7",
  "8",
  "9",
  "/",
  "%",
  "AC",
  "4",
  "5",
  "6",
  "*",
  "M+",
  "MR",
  "1",
  "2",
  "3",
  "-",
  "MC",
  "Ans",
  "0",
  ".",
  "fact(",
  "+",
  "=",
];

const BASIC_KEYS = [
  "AC",
  "DEL",
  "%",
  "/",
  "7",
  "8",
  "9",
  "*",
  "4",
  "5",
  "6",
  "-",
  "1",
  "2",
  "3",
  "+",
  "0",
  ".",
  "Ans",
  "=",
];

const UNIT_FACTORS: Record<Unit, number> = {
  mm: 0.001,
  cm: 0.01,
  m: 1,
  km: 1000,
  in: 0.0254,
  ft: 0.3048,
  yd: 0.9144,
  mi: 1609.344,
};

const SAFE_IDENTIFIERS = new Set([
  "sin",
  "cos",
  "tan",
  "asin",
  "acos",
  "atan",
  "ln",
  "log",
  "sqrt",
  "abs",
  "exp",
  "fact",
  "mod",
  "ncr",
  "npr",
  "PI",
  "E",
  "x",
]);

const RELATED_TOOLS = [
  {
    title: "Percentage Calculator",
    slug: "percentage-calculator",
    color: 217,
    benefit: "Percentage workflows",
    icon: <span className="text-[10px] font-black">%</span>,
  },
  {
    title: "Matrix Calculator",
    slug: "online-matrix-calculator",
    color: 274,
    benefit: "Matrix operations",
    icon: <span className="text-[10px] font-black">Mx</span>,
  },
  {
    title: "Logarithm Calculator",
    slug: "logarithm-calculator",
    color: 28,
    benefit: "Log and ln values",
    icon: <span className="text-[10px] font-black">log</span>,
  },
  {
    title: "Quadratic Equation Solver",
    slug: "online-quadratic-equation-solver",
    color: 340,
    benefit: "Polynomial roots",
    icon: <span className="text-[10px] font-black">x2</span>,
  },
  {
    title: "Exponents Calculator",
    slug: "exponents-calculator",
    color: 158,
    benefit: "Powers and roots",
    icon: <span className="text-[10px] font-black">xn</span>,
  },
  {
    title: "Standard Deviation Calculator",
    slug: "online-standard-deviation-calculator",
    color: 205,
    benefit: "Variance and spread",
    icon: <span className="text-[10px] font-black">sd</span>,
  },
];

const formatNumber = (value: number) => {
  if (!Number.isFinite(value)) {
    return "Error";
  }

  if ((Math.abs(value) >= 1e12 || Math.abs(value) < 1e-8) && value !== 0) {
    return value.toExponential(8);
  }

  return parseFloat(value.toPrecision(12)).toString();
};

const parseNumber = (value: string) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : NaN;
};

function factorial(value: number) {
  if (!Number.isInteger(value) || value < 0 || value > 170) {
    throw new Error("Factorial supports integers from 0 to 170.");
  }

  let total = 1;
  for (let index = 2; index <= value; index += 1) {
    total *= index;
  }

  return total;
}

function permutation(n: number, r: number) {
  if (!Number.isInteger(n) || !Number.isInteger(r) || n < 0 || r < 0 || r > n) {
    throw new Error("Invalid nPr values.");
  }

  let total = 1;
  for (let index = 0; index < r; index += 1) {
    total *= n - index;
  }

  return total;
}

function combination(n: number, r: number) {
  return permutation(n, r) / factorial(r);
}

function greatestCommonDivisor(a: number, b: number) {
  let x = Math.abs(a);
  let y = Math.abs(b);

  while (y) {
    const next = y;
    y = x % y;
    x = next;
  }

  return x || 1;
}

function evaluateExpression(raw: string, angle: Angle, xValue?: number) {
  let expression = raw.trim();
  if (!expression) {
    throw new Error("Enter an expression.");
  }

  expression = expression
    .replace(/\s+/g, "")
    .replace(/π/g, "PI")
    .replace(/\^/g, "**")
    .replace(/(\d+(?:\.\d+)?)%/g, "($1/100)")
    .replace(/\)%/g, ")/100")
    .replace(/(\d|\)|PI|E|x)(?=\()/g, "$1*")
    .replace(
      /(\d|\)|PI|E|x)(?=(sin|cos|tan|asin|acos|atan|ln|log|sqrt|abs|exp|fact|mod|ncr|npr|PI|E|x))/g,
      "$1*",
    )
    .replace(/(PI|E|x|\))(?=\d)/g, "$1*");

  if (typeof xValue === "number") {
    expression = expression.replace(/\bx\b/g, `(${xValue})`);
  }

  if (/\bx\b/.test(expression)) {
    throw new Error("Set a value for x.");
  }

  if (/[^0-9A-Za-z_+\-*/().,%]/.test(expression)) {
    throw new Error("Unsupported symbol detected.");
  }

  const identifiers = expression.match(/[A-Za-z_]\w*/g) ?? [];
  for (const identifier of identifiers) {
    if (!SAFE_IDENTIFIERS.has(identifier)) {
      throw new Error(`Unsupported function: ${identifier}`);
    }
  }

  const toRadians = (value: number) => (angle === "deg" ? (value * Math.PI) / 180 : value);
  const toDegrees = (value: number) => (angle === "deg" ? (value * 180) / Math.PI : value);

  const scope = {
    PI: Math.PI,
    E: Math.E,
    sin: (value: number) => Math.sin(toRadians(value)),
    cos: (value: number) => Math.cos(toRadians(value)),
    tan: (value: number) => Math.tan(toRadians(value)),
    asin: (value: number) => toDegrees(Math.asin(value)),
    acos: (value: number) => toDegrees(Math.acos(value)),
    atan: (value: number) => toDegrees(Math.atan(value)),
    ln: (value: number) => Math.log(value),
    log: (value: number) => Math.log10(value),
    sqrt: (value: number) => Math.sqrt(value),
    abs: (value: number) => Math.abs(value),
    exp: (value: number) => Math.exp(value),
    fact: (value: number) => factorial(value),
    mod: (a: number, b: number) => a % b,
    ncr: (n: number, r: number) => combination(n, r),
    npr: (n: number, r: number) => permutation(n, r),
  };

  const fn = Function(
    ...Object.keys(scope),
    `"use strict"; return (${expression});`,
  ) as (...args: unknown[]) => unknown;

  const result = Number(fn(...Object.values(scope)));
  if (!Number.isFinite(result) || Number.isNaN(result)) {
    throw new Error("Expression is undefined.");
  }

  return result;
}

export default function ScientificCalculator() {
  const pageHeading = "Online Scientific Calculator";
  const canonical = "https://usonlinetools.com/math/online-scientific-calculator";

  const [mode, setMode] = useState<Mode>("scientific");
  const [angle, setAngle] = useState<Angle>("deg");
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("0");
  const [error, setError] = useState("");
  const [memory, setMemory] = useState(0);
  const [history, setHistory] = useState<Array<{ expression: string; result: string }>>([]);
  const [copied, setCopied] = useState(false);

  const [functionInput, setFunctionInput] = useState("sin(x)");
  const [derivativeAt, setDerivativeAt] = useState("0");
  const [lowerLimit, setLowerLimit] = useState("0");
  const [upperLimit, setUpperLimit] = useState("3.14159265");
  const [calculusOutput, setCalculusOutput] = useState("");

  const [programmerValue, setProgrammerValue] = useState("255");
  const [bitwiseA, setBitwiseA] = useState("12");
  const [bitwiseB, setBitwiseB] = useState("5");
  const [bitwiseOperation, setBitwiseOperation] = useState<BitOp>("AND");

  const [fractionA, setFractionA] = useState({ n: "1", d: "2" });
  const [fractionB, setFractionB] = useState({ n: "1", d: "3" });
  const [fractionOperation, setFractionOperation] = useState<"+" | "-" | "*" | "/">("+");

  const [quadratic, setQuadratic] = useState({ a: "1", b: "0", c: "0" });
  const [matrixA, setMatrixA] = useState<Matrix2>([
    [1, 2],
    [3, 4],
  ]);
  const [matrixB, setMatrixB] = useState<Matrix2>([
    [5, 6],
    [7, 8],
  ]);

  const [converterValue, setConverterValue] = useState("1");
  const [fromUnit, setFromUnit] = useState<Unit>("m");
  const [toUnit, setToUnit] = useState<Unit>("ft");

  const runCalculation = () => {
    try {
      const computed = evaluateExpression(expression, angle);
      const nextResult = formatNumber(computed);
      setResult(nextResult);
      setError("");
      setHistory((current) =>
        [{ expression, result: nextResult }, ...current].slice(0, 10),
      );
      return computed;
    } catch (err) {
      setResult("Error");
      setError(err instanceof Error ? err.message : "Invalid expression.");
      return null;
    }
  };

  const pressKey = (key: string) => {
    if (key === "AC") {
      setExpression("");
      setResult("0");
      setError("");
      return;
    }

    if (key === "DEL") {
      setExpression((current) => current.slice(0, -1));
      return;
    }

    if (key === "=") {
      runCalculation();
      return;
    }

    if (key === "Ans") {
      if (result !== "Error") {
        setExpression((current) => current + result);
      }
      return;
    }

    if (key === "MR") {
      setExpression((current) => current + formatNumber(memory));
      return;
    }

    if (key === "MC") {
      setMemory(0);
      return;
    }

    if (key === "M+") {
      const computed = runCalculation();
      if (computed !== null) {
        setMemory((current) => current + computed);
      }
      return;
    }

    setExpression((current) => current + key);
    setError("");
  };

  const calculateDerivative = () => {
    const x = parseNumber(derivativeAt);
    if (!Number.isFinite(x)) {
      setCalculusOutput("Enter a valid x value.");
      return;
    }

    try {
      const step = Math.max(1e-5, Math.abs(x) * 1e-5);
      const derivative =
        (evaluateExpression(functionInput, angle, x + step) -
          evaluateExpression(functionInput, angle, x - step)) /
        (2 * step);
      setCalculusOutput(`f'(x) at ${formatNumber(x)} = ${formatNumber(derivative)}`);
    } catch (err) {
      setCalculusOutput(err instanceof Error ? err.message : "Derivative failed.");
    }
  };

  const calculateIntegral = () => {
    const lower = parseNumber(lowerLimit);
    const upper = parseNumber(upperLimit);

    if (!Number.isFinite(lower) || !Number.isFinite(upper)) {
      setCalculusOutput("Enter valid lower and upper limits.");
      return;
    }

    try {
      const slices = 600;
      const step = (upper - lower) / slices;
      let sum =
        evaluateExpression(functionInput, angle, lower) +
        evaluateExpression(functionInput, angle, upper);

      for (let index = 1; index < slices; index += 1) {
        sum +=
          (index % 2 ? 4 : 2) *
          evaluateExpression(functionInput, angle, lower + index * step);
      }

      setCalculusOutput(
        `Integral ${formatNumber(lower)} to ${formatNumber(upper)} = ${formatNumber(
          (step / 3) * sum,
        )}`,
      );
    } catch (err) {
      setCalculusOutput(err instanceof Error ? err.message : "Integral failed.");
    }
  };

  const programmerResult = useMemo(() => {
    const value = Math.trunc(parseNumber(programmerValue));
    const a = Math.trunc(parseNumber(bitwiseA));
    const b = Math.trunc(parseNumber(bitwiseB));

    if (![value, a, b].every(Number.isFinite)) {
      return null;
    }

    let bitwise = 0;
    if (bitwiseOperation === "AND") bitwise = a & b;
    if (bitwiseOperation === "OR") bitwise = a | b;
    if (bitwiseOperation === "XOR") bitwise = a ^ b;
    if (bitwiseOperation === "LSH") bitwise = a << b;
    if (bitwiseOperation === "RSH") bitwise = a >> b;

    return {
      dec: String(value),
      hex: `0x${(value >>> 0).toString(16).toUpperCase()}`,
      bin: `0b${(value >>> 0).toString(2)}`,
      oct: `0o${(value >>> 0).toString(8)}`,
      bitwise,
    };
  }, [programmerValue, bitwiseA, bitwiseB, bitwiseOperation]);

  const fractionResult = useMemo(() => {
    const n1 = parseNumber(fractionA.n);
    const d1 = parseNumber(fractionA.d);
    const n2 = parseNumber(fractionB.n);
    const d2 = parseNumber(fractionB.d);

    if (![n1, d1, n2, d2].every(Number.isFinite) || d1 === 0 || d2 === 0) {
      return null;
    }

    let numerator = 0;
    let denominator = 1;

    if (fractionOperation === "+") {
      numerator = n1 * d2 + n2 * d1;
      denominator = d1 * d2;
    }
    if (fractionOperation === "-") {
      numerator = n1 * d2 - n2 * d1;
      denominator = d1 * d2;
    }
    if (fractionOperation === "*") {
      numerator = n1 * n2;
      denominator = d1 * d2;
    }
    if (fractionOperation === "/") {
      numerator = n1 * d2;
      denominator = d1 * n2;
    }

    if (denominator === 0) {
      return null;
    }

    const divisor = greatestCommonDivisor(numerator, denominator);
    return {
      numerator: numerator / divisor,
      denominator: denominator / divisor,
      decimal: numerator / denominator,
    };
  }, [fractionA, fractionB, fractionOperation]);

  const quadraticResult = useMemo(() => {
    const a = parseNumber(quadratic.a);
    const b = parseNumber(quadratic.b);
    const c = parseNumber(quadratic.c);

    if (![a, b, c].every(Number.isFinite) || a === 0) {
      return null;
    }

    const discriminant = b * b - 4 * a * c;
    if (discriminant >= 0) {
      const root1 = (-b + Math.sqrt(discriminant)) / (2 * a);
      const root2 = (-b - Math.sqrt(discriminant)) / (2 * a);
      return {
        discriminant,
        roots: `${formatNumber(root1)}, ${formatNumber(root2)}`,
      };
    }

    const real = -b / (2 * a);
    const imaginary = Math.sqrt(-discriminant) / (2 * a);
    return {
      discriminant,
      roots: `${formatNumber(real)} + ${formatNumber(imaginary)}i, ${formatNumber(
        real,
      )} - ${formatNumber(imaginary)}i`,
    };
  }, [quadratic]);

  const matrixResult = useMemo(() => {
    const [a11, a12] = matrixA[0];
    const [a21, a22] = matrixA[1];
    const [b11, b12] = matrixB[0];
    const [b21, b22] = matrixB[1];

    const add: Matrix2 = [
      [a11 + b11, a12 + b12],
      [a21 + b21, a22 + b22],
    ];

    const multiply: Matrix2 = [
      [a11 * b11 + a12 * b21, a11 * b12 + a12 * b22],
      [a21 * b11 + a22 * b21, a21 * b12 + a22 * b22],
    ];

    const determinant = a11 * a22 - a12 * a21;
    const inverse =
      determinant === 0
        ? null
        : ([
            [a22 / determinant, -a12 / determinant],
            [-a21 / determinant, a11 / determinant],
          ] as Matrix2);

    return { add, multiply, determinant, inverse };
  }, [matrixA, matrixB]);

  const convertedValue = useMemo(() => {
    const value = parseNumber(converterValue);
    if (!Number.isFinite(value)) {
      return "Invalid";
    }

    return formatNumber((value * UNIT_FACTORS[fromUnit]) / UNIT_FACTORS[toUnit]);
  }, [converterValue, fromUnit, toUnit]);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layout>
      <SEO
        title="Online Scientific Calculator - Standard, Programmer, Matrix, and Calculus Modes"
        description="Free online scientific calculator with arithmetic, trigonometry, logarithms, fractions, equations, matrices, programmer conversions, and basic calculus tools in one page."
        canonical={canonical}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight className="w-4 h-4 mx-2 text-blue-500" strokeWidth={3} />
          <Link
            href="/category/math"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Math &amp; Calculators
          </Link>
          <ChevronRight className="w-4 h-4 mx-2 text-blue-500" strokeWidth={3} />
          <span className="text-foreground">{pageHeading}</span>
        </nav>

        <section className="rounded-2xl overflow-hidden border border-blue-500/15 bg-gradient-to-br from-blue-500/5 via-card to-cyan-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Calculator className="w-3.5 h-3.5" />
            Math &amp; Calculators
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-4xl">
            {pageHeading}
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-3xl">
            Use this online scientific calculator for classroom math, engineering checks,
            programming conversions, and fast technical calculations. It combines everyday
            arithmetic with scientific functions, fractions, equations, matrices, unit
            conversion, and lightweight calculus tools in one browser-based workspace.
          </p>

          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20">
              <BadgeCheck className="w-3.5 h-3.5" /> 100% Free
            </span>
            <span className="inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs px-3 py-1.5 rounded-full border border-blue-500/20">
              <Zap className="w-3.5 h-3.5" /> Multi-Mode Suite
            </span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20">
              <Lock className="w-3.5 h-3.5" /> No Signup
            </span>
            <span className="inline-flex items-center gap-1.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-xs px-3 py-1.5 rounded-full border border-violet-500/20">
              <Shield className="w-3.5 h-3.5" /> Privacy First
            </span>
            <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs px-3 py-1.5 rounded-full border border-cyan-500/20">
              <Smartphone className="w-3.5 h-3.5" /> Mobile Ready
            </span>
          </div>

          <p className="text-xs text-muted-foreground/60 font-medium">
            Category: Math &amp; Calculators &nbsp;&middot;&nbsp; Last updated: April 2026
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-8">
            <section id="calculator" className="bg-card border border-border rounded-2xl p-5 md:p-7 shadow-sm">
              <div className="max-w-md mx-auto mb-5">
                <label
                  htmlFor="calculator-mode"
                  className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2"
                >
                  Calculator Mode
                </label>
                <select
                  id="calculator-mode"
                  value={mode}
                  onChange={(event) => setMode(event.target.value as Mode)}
                  className="w-full h-11 rounded-xl border border-border bg-card px-3 text-sm font-bold tracking-wide focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                >
                  {TABS.map((tab) => (
                    <option key={tab} value={tab}>
                      {MODE_LABELS[tab]}
                    </option>
                  ))}
                </select>
              </div>
              {(mode === "standard" || mode === "scientific") && (
                <div className="max-w-[980px] mx-auto rounded-xl border border-slate-400 bg-gradient-to-br from-zinc-200 to-zinc-300 p-3 md:p-4 shadow-inner">
                  <div className="h-1 rounded bg-blue-500 mb-2" />
                  <div className="space-y-2 mb-2">
                    <div className="h-10 rounded border border-slate-400 bg-zinc-100 px-3 font-mono text-right text-sm flex items-center justify-end overflow-hidden">
                      {expression || "0"}
                    </div>
                    <div className="h-11 rounded border border-slate-400 bg-zinc-100 px-3 font-mono text-right text-3xl flex items-center justify-end overflow-hidden">
                      {result}
                    </div>
                  </div>

                  {mode === "scientific" && (
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <button
                        onClick={() => pressKey("mod(")}
                        className="h-8 px-2 rounded border border-slate-400 bg-slate-100 text-xs font-bold"
                      >
                        mod
                      </button>
                      <label className="inline-flex items-center gap-1 text-xs">
                        <input
                          type="radio"
                          checked={angle === "deg"}
                          onChange={() => setAngle("deg")}
                        />
                        Deg
                      </label>
                      <label className="inline-flex items-center gap-1 text-xs">
                        <input
                          type="radio"
                          checked={angle === "rad"}
                          onChange={() => setAngle("rad")}
                        />
                        Rad
                      </label>
                      <button
                        onClick={() => pressKey("MC")}
                        className="h-8 px-2 rounded border border-slate-400 bg-slate-100 text-xs font-bold ml-auto"
                      >
                        MC
                      </button>
                      <button
                        onClick={() => pressKey("MR")}
                        className="h-8 px-2 rounded border border-slate-400 bg-slate-100 text-xs font-bold"
                      >
                        MR
                      </button>
                      <button
                        onClick={() => pressKey("M+")}
                        className="h-8 px-2 rounded border border-slate-400 bg-slate-100 text-xs font-bold"
                      >
                        M+
                      </button>
                    </div>
                  )}

                  <div
                    className={`grid ${
                      mode === "scientific"
                        ? "grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6"
                        : "grid-cols-4"
                    } gap-2`}
                  >
                    {(mode === "scientific" ? SCIENTIFIC_KEYS : BASIC_KEYS).map((key) => (
                      <button
                        key={key}
                        onClick={() => pressKey(key)}
                        className={`h-10 rounded border text-sm font-bold ${
                          key === "="
                            ? "bg-emerald-500 text-white border-emerald-600"
                            : key === "AC" || key === "DEL"
                              ? "bg-red-500 text-white border-red-600"
                              : "bg-slate-100 border-slate-400 text-slate-800"
                        }`}
                      >
                        {key}
                      </button>
                    ))}
                  </div>

                  {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
                  <p className="mt-2 text-[11px] text-slate-700">Memory: {formatNumber(memory)}</p>
                </div>
              )}

              {mode === "calculus" && (
                <div className="max-w-[980px] mx-auto grid grid-cols-1 xl:grid-cols-2 gap-4 mt-5">
                  <div className="relative overflow-hidden rounded-xl border border-blue-200/60 dark:border-blue-900/40 bg-gradient-to-br from-blue-50/70 via-background to-cyan-50/60 dark:from-blue-950/20 dark:to-cyan-950/20 p-4">
                    <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-blue-500/10" />
                    <div className="relative z-10">
                      <p className="text-[11px] font-bold uppercase tracking-widest text-blue-700 dark:text-blue-300 mb-3">
                        Differential and Integral
                      </p>
                      <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-1 block">
                        Function f(x)
                      </label>
                      <input
                        className="tool-calc-input w-full mb-3 font-mono"
                        value={functionInput}
                        onChange={(event) => setFunctionInput(event.target.value)}
                        placeholder="Example: sin(x) + x^2"
                      />

                      <div className="grid grid-cols-[1fr_auto] gap-2 mb-2">
                        <input
                          className="tool-calc-input"
                          value={derivativeAt}
                          onChange={(event) => setDerivativeAt(event.target.value)}
                          placeholder="Derivative at x"
                        />
                        <button
                          onClick={calculateDerivative}
                          className="h-10 px-4 rounded-lg border border-blue-300/60 bg-blue-500/10 hover:bg-blue-500/20 text-blue-700 dark:text-blue-300 font-bold transition-colors"
                        >
                          Derivative
                        </button>
                      </div>

                      <div className="grid grid-cols-3 gap-2 mb-3">
                        <input
                          className="tool-calc-input"
                          value={lowerLimit}
                          onChange={(event) => setLowerLimit(event.target.value)}
                          placeholder="Lower"
                        />
                        <input
                          className="tool-calc-input"
                          value={upperLimit}
                          onChange={(event) => setUpperLimit(event.target.value)}
                          placeholder="Upper"
                        />
                        <button
                          onClick={calculateIntegral}
                          className="h-10 rounded-lg border border-cyan-300/70 bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-700 dark:text-cyan-300 font-bold transition-colors"
                        >
                          Integral
                        </button>
                      </div>

                      <div className="rounded-lg border border-border bg-background/80 px-3 py-2 min-h-[42px] flex items-center">
                        <p className="text-xs text-muted-foreground break-words">
                          {calculusOutput || "Run derivative or integral to see output here."}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-border bg-gradient-to-br from-muted/40 to-background p-4">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
                      History
                    </p>
                    <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                      {history.length === 0 ? (
                        <div className="rounded-lg border border-dashed border-border px-3 py-5 text-center text-xs text-muted-foreground">
                          No calculations yet. Evaluate an expression to build history.
                        </div>
                      ) : (
                        history.map((entry, index) => (
                          <button
                            key={`${entry.expression}-${index}`}
                            onClick={() => {
                              setExpression(entry.expression);
                              setResult(entry.result);
                              setError("");
                            }}
                            className="w-full text-left px-3 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
                          >
                            <p className="text-xs text-muted-foreground truncate">
                              {entry.expression}
                            </p>
                            <p className="text-sm font-bold truncate">{entry.result}</p>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}

              {mode === "programmer" && (
                <div className="p-3 rounded border bg-muted/40">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
                    <div>
                      <p className="text-xs font-bold mb-1">Integer</p>
                      <input
                        className="tool-calc-input w-full"
                        value={programmerValue}
                        onChange={(event) => setProgrammerValue(event.target.value)}
                      />
                    </div>
                    <div>
                      <p className="text-xs font-bold mb-1">Bitwise</p>
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          className="tool-calc-input"
                          value={bitwiseA}
                          onChange={(event) => setBitwiseA(event.target.value)}
                        />
                        <select
                          className="tool-calc-input"
                          value={bitwiseOperation}
                          onChange={(event) => setBitwiseOperation(event.target.value as BitOp)}
                        >
                          <option>AND</option>
                          <option>OR</option>
                          <option>XOR</option>
                          <option>LSH</option>
                          <option>RSH</option>
                        </select>
                        <input
                          className="tool-calc-input"
                          value={bitwiseB}
                          onChange={(event) => setBitwiseB(event.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {programmerResult && (
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
                      <div className="p-2 rounded border bg-card">
                        <p className="text-xs text-muted-foreground">DEC</p>
                        <p className="font-mono">{programmerResult.dec}</p>
                      </div>
                      <div className="p-2 rounded border bg-card">
                        <p className="text-xs text-muted-foreground">HEX</p>
                        <p className="font-mono">{programmerResult.hex}</p>
                      </div>
                      <div className="p-2 rounded border bg-card">
                        <p className="text-xs text-muted-foreground">BIN</p>
                        <p className="font-mono break-all">{programmerResult.bin}</p>
                      </div>
                      <div className="p-2 rounded border bg-card">
                        <p className="text-xs text-muted-foreground">OCT</p>
                        <p className="font-mono">{programmerResult.oct}</p>
                      </div>
                      <div className="p-2 rounded border bg-card">
                        <p className="text-xs text-muted-foreground">Bitwise</p>
                        <p className="font-mono">{programmerResult.bitwise}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {mode === "fractions" && (
                <div className="p-3 rounded border bg-muted/40">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        className="tool-calc-input"
                        value={fractionA.n}
                        onChange={(event) =>
                          setFractionA((current) => ({ ...current, n: event.target.value }))
                        }
                        placeholder="n1"
                      />
                      <input
                        className="tool-calc-input"
                        value={fractionA.d}
                        onChange={(event) =>
                          setFractionA((current) => ({ ...current, d: event.target.value }))
                        }
                        placeholder="d1"
                      />
                    </div>
                    <select
                      className="tool-calc-input"
                      value={fractionOperation}
                      onChange={(event) =>
                        setFractionOperation(event.target.value as "+" | "-" | "*" | "/")
                      }
                    >
                      <option value="+">+</option>
                      <option value="-">-</option>
                      <option value="*">*</option>
                      <option value="/">/</option>
                    </select>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        className="tool-calc-input"
                        value={fractionB.n}
                        onChange={(event) =>
                          setFractionB((current) => ({ ...current, n: event.target.value }))
                        }
                        placeholder="n2"
                      />
                      <input
                        className="tool-calc-input"
                        value={fractionB.d}
                        onChange={(event) =>
                          setFractionB((current) => ({ ...current, d: event.target.value }))
                        }
                        placeholder="d2"
                      />
                    </div>
                  </div>

                  {fractionResult ? (
                    <p className="text-sm">
                      {fractionResult.numerator}/{fractionResult.denominator} (
                      {formatNumber(fractionResult.decimal)})
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground">Enter valid fractions.</p>
                  )}
                </div>
              )}

              {mode === "equations" && (
                <div className="p-3 rounded border bg-muted/40">
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    <input
                      className="tool-calc-input"
                      value={quadratic.a}
                      onChange={(event) =>
                        setQuadratic((current) => ({ ...current, a: event.target.value }))
                      }
                      placeholder="a"
                    />
                    <input
                      className="tool-calc-input"
                      value={quadratic.b}
                      onChange={(event) =>
                        setQuadratic((current) => ({ ...current, b: event.target.value }))
                      }
                      placeholder="b"
                    />
                    <input
                      className="tool-calc-input"
                      value={quadratic.c}
                      onChange={(event) =>
                        setQuadratic((current) => ({ ...current, c: event.target.value }))
                      }
                      placeholder="c"
                    />
                  </div>

                  {quadraticResult ? (
                    <div className="text-sm">
                      <p>Discriminant = {formatNumber(quadraticResult.discriminant)}</p>
                      <p>Roots: {quadraticResult.roots}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Enter valid a, b, and c values with a not equal to 0.
                    </p>
                  )}
                </div>
              )}

              {mode === "matrices" && (
                <div className="p-3 rounded border bg-muted/40">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
                    <div>
                      <p className="text-xs mb-1">Matrix A</p>
                      <div className="grid grid-cols-2 gap-2">
                        {matrixA.flat().map((value, index) => (
                          <input
                            key={index}
                            type="number"
                            className="tool-calc-input"
                            value={value}
                            onChange={(event) =>
                              setMatrixA((current) => {
                                const next = [[...current[0]], [...current[1]]] as Matrix2;
                                next[Math.floor(index / 2)][index % 2] = Number(
                                  event.target.value,
                                );
                                return next;
                              })
                            }
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs mb-1">Matrix B</p>
                      <div className="grid grid-cols-2 gap-2">
                        {matrixB.flat().map((value, index) => (
                          <input
                            key={index}
                            type="number"
                            className="tool-calc-input"
                            value={value}
                            onChange={(event) =>
                              setMatrixB((current) => {
                                const next = [[...current[0]], [...current[1]]] as Matrix2;
                                next[Math.floor(index / 2)][index % 2] = Number(
                                  event.target.value,
                                );
                                return next;
                              })
                            }
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="text-sm space-y-1">
                    <p>
                      A + B: [{matrixResult.add[0][0]}, {matrixResult.add[0][1]}] [
                      {matrixResult.add[1][0]}, {matrixResult.add[1][1]}]
                    </p>
                    <p>
                      A * B: [{matrixResult.multiply[0][0]}, {matrixResult.multiply[0][1]}] [
                      {matrixResult.multiply[1][0]}, {matrixResult.multiply[1][1]}]
                    </p>
                    <p>det(A): {formatNumber(matrixResult.determinant)}</p>
                    <p>
                      inv(A):{" "}
                      {matrixResult.inverse
                        ? `[${formatNumber(matrixResult.inverse[0][0])}, ${formatNumber(
                            matrixResult.inverse[0][1],
                          )}] [${formatNumber(matrixResult.inverse[1][0])}, ${formatNumber(
                            matrixResult.inverse[1][1],
                          )}]`
                        : "Not invertible"}
                    </p>
                  </div>
                </div>
              )}

              {mode === "converter" && (
                <div className="p-3 rounded border bg-muted/40">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                    <input
                      className="tool-calc-input"
                      value={converterValue}
                      onChange={(event) => setConverterValue(event.target.value)}
                    />
                    <select
                      className="tool-calc-input"
                      value={fromUnit}
                      onChange={(event) => setFromUnit(event.target.value as Unit)}
                    >
                      {Object.keys(UNIT_FACTORS).map((unit) => (
                        <option key={unit}>{unit}</option>
                      ))}
                    </select>
                    <select
                      className="tool-calc-input"
                      value={toUnit}
                      onChange={(event) => setToUnit(event.target.value as Unit)}
                    >
                      {Object.keys(UNIT_FACTORS).map((unit) => (
                        <option key={unit}>{unit}</option>
                      ))}
                    </select>
                    <div className="tool-calc-input bg-muted/50 flex items-center">
                      {convertedValue}
                    </div>
                  </div>
                </div>
              )}
            </section>
            <section id="how-to-use" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">
                How to Use the Scientific Calculator
              </h2>

              <ol className="space-y-5">
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold text-sm mt-0.5">
                    1
                  </div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Choose the right mode first</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Use Standard for quick arithmetic, Scientific for trig, powers, and logs,
                      Calculus for derivative or integral estimates, Programmer for base and
                      bitwise checks, Fractions for ratio-style math, Equations for quadratics,
                      Matrices for 2x2 operations, and Converter for quick unit changes.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold text-sm mt-0.5">
                    2
                  </div>
                  <div>
                    <p className="font-bold text-foreground mb-1">
                      Enter values and review live output
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      In Scientific mode, type directly into the expression line or use the
                      keypad. If you are working with trig functions, set DEG or RAD before
                      evaluating. The result display updates as you work through each expression,
                      and the memory keys help you chain multi-step calculations faster.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold text-sm mt-0.5">
                    3
                  </div>
                  <div>
                    <p className="font-bold text-foreground mb-1">
                      Use the history and specialist panels
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      The calculus panel gives quick step outputs for derivative and integral
                      estimates, while the history panel stores recent expressions so you can
                      reuse earlier work without retyping. That makes the tool practical for
                      study sessions, debugging, and engineering spot checks.
                    </p>
                  </div>
                </li>
              </ol>
            </section>

            <section
              id="result-interpretation"
              className="bg-card border border-border rounded-2xl p-6 md:p-8"
            >
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">
                Result Interpretation
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                Use these checkpoints to validate what the calculator is showing:
              </p>

              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                  <p className="font-bold text-foreground mb-1">Scientific expressions</p>
                  <p className="text-sm text-muted-foreground">
                    If a trig result looks wrong, the first thing to verify is angle mode. Many
                    unexpected outputs come from mixing degree input with radian mode.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20">
                  <p className="font-bold text-foreground mb-1">Derivative and integral output</p>
                  <p className="text-sm text-muted-foreground">
                    Derivatives report local slope at a chosen x value, while integrals estimate
                    signed area across an interval. These are numerical approximations, so they
                    are ideal for checks and intuition, not formal symbolic proofs.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/20">
                  <p className="font-bold text-foreground mb-1">Programmer and matrix modes</p>
                  <p className="text-sm text-muted-foreground">
                    Bitwise results work on integers only, and matrix inversion appears only when
                    the determinant is not zero. If inverse is unavailable, the matrix is singular.
                  </p>
                </div>
              </div>
            </section>

            <section id="quick-examples" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">
                Quick Examples
              </h2>

              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/60">
                      <th className="text-left px-4 py-3 font-bold text-foreground">Mode</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Input</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Result</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="px-4 py-3 text-muted-foreground">Scientific</td>
                      <td className="px-4 py-3 font-mono text-foreground">
                        sin(30)^2 + cos(30)^2
                      </td>
                      <td className="px-4 py-3 font-bold text-blue-600">1</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-muted-foreground">Calculus</td>
                      <td className="px-4 py-3 font-mono text-foreground">f(x)=sin(x), x=0</td>
                      <td className="px-4 py-3 font-bold text-blue-600">Approx. derivative = 1</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-muted-foreground">Programmer</td>
                      <td className="px-4 py-3 font-mono text-foreground">255</td>
                      <td className="px-4 py-3 font-bold text-blue-600">0xFF, 0b11111111</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-muted-foreground">Fractions</td>
                      <td className="px-4 py-3 font-mono text-foreground">1/2 + 1/3</td>
                      <td className="px-4 py-3 font-bold text-blue-600">5/6</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-muted-foreground">Equations</td>
                      <td className="px-4 py-3 font-mono text-foreground">x^2 - 5x + 6</td>
                      <td className="px-4 py-3 font-bold text-blue-600">x = 2, x = 3</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-muted-foreground">Matrices</td>
                      <td className="px-4 py-3 font-mono text-foreground">A=[[1,2],[3,4]]</td>
                      <td className="px-4 py-3 font-bold text-blue-600">det(A) = -2</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section id="why-choose-this" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">
                Why Choose This Calculator Suite?
              </h2>

              <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                <p>
                  <span className="font-semibold text-foreground">Multiple math workflows in one place.</span>{" "}
                  Instead of opening separate tools for trig, equations, fractions, base
                  conversion, and matrix work, this page keeps those tasks under one consistent
                  interface with one visual language.
                </p>
                <p>
                  <span className="font-semibold text-foreground">Practical for real work.</span>{" "}
                  Expression input, history recall, memory keys, and quick specialist panels make
                  the calculator useful for students, developers, analysts, and engineers who need
                  faster validation without opening a desktop app.
                </p>
                <p>
                  <span className="font-semibold text-foreground">Built for privacy and speed.</span>{" "}
                  Calculations run in the browser, so there is no account barrier, no upload step,
                  and no waiting for server-side processing just to finish a math check.
                </p>
              </div>
            </section>

            <section id="faq" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">
                Frequently Asked Questions
              </h2>

              <div className="space-y-3">
                <div className="p-4 rounded-xl border border-border bg-muted/30">
                  <p className="font-bold text-foreground mb-1">
                    Does this include the main calculator types people use most often?
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Yes. It combines standard, scientific, calculus, programmer, fractions,
                    equations, matrices, and unit conversion modes in one page.
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-border bg-muted/30">
                  <p className="font-bold text-foreground mb-1">
                    How are derivative and integral results calculated?
                  </p>
                  <p className="text-sm text-muted-foreground">
                    The page uses numerical approximation methods: central difference for
                    derivative estimates and Simpson&apos;s rule for integral estimates.
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-border bg-muted/30">
                  <p className="font-bold text-foreground mb-1">
                    Can I use keyboard-style expressions instead of clicking every button?
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Yes. You can type expressions directly into the display line and then use the
                    keypad only when it is faster or more convenient.
                  </p>
                </div>
              </div>
            </section>

            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black mb-2">Need More Math Tools?</h2>
                <p className="text-white/80 mb-6 max-w-lg">
                  Explore more calculators across the utility hub for percentages, statistics,
                  finance, and conversion workflows.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 font-bold rounded-xl"
                >
                  Explore All Tools <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <div className="sticky top-28 space-y-6">
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black mb-3 uppercase">Related Tools</h3>
                <div className="space-y-0.5">
                  {RELATED_TOOLS.map((tool) => (
                    <Link
                      key={tool.slug}
                      href={getToolPath(tool.slug)}
                      className="group flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-muted"
                    >
                      <div
                        className="w-7 h-7 rounded-md flex items-center justify-center text-white flex-shrink-0"
                        style={{
                          background: `linear-gradient(135deg, hsl(${tool.color} 70% 55%), hsl(${tool.color} 75% 42%))`,
                        }}
                      >
                        {tool.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-muted-foreground group-hover:text-foreground truncate">
                          {tool.title}
                        </p>
                        <p className="text-[10px] text-muted-foreground/60 truncate">
                          {tool.benefit}
                        </p>
                      </div>
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-blue-500 opacity-0 group-hover:opacity-100" />
                    </Link>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black uppercase mb-1.5">Share This Tool</h3>
                <p className="text-xs text-muted-foreground mb-3">
                  Copy and share this calculator suite.
                </p>
                <button
                  onClick={copyLink}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-400 text-white text-sm font-bold rounded-xl"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy Link
                    </>
                  )}
                </button>
              </div>

              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black uppercase mb-3">On This Page</h3>
                <div className="space-y-0.5">
                  {[
                    "Calculator",
                    "How to Use",
                    "Result Interpretation",
                    "Quick Examples",
                    "Why Choose This",
                    "FAQ",
                  ].map((label) => (
                    <a
                      key={label}
                      href={`#${label.toLowerCase().replace(/\s/g, "-")}`}
                      className="flex items-center gap-2 text-xs text-muted-foreground hover:text-blue-500 font-medium py-1.5"
                    >
                      <div className="w-1 h-1 rounded-full bg-blue-500/40" />
                      {label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
