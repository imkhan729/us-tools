import { useMemo, useState } from "react";
import { Activity, Calculator, HeartPulse, Ruler, Scale, Stethoscope } from "lucide-react";
import UtilityToolPageShell from "./UtilityToolPageShell";

function fmt(n: number, digits = 3) {
  return n.toLocaleString("en-US", { maximumFractionDigits: digits });
}

export default function BodySurfaceAreaCalculator() {
  const [heightCm, setHeightCm] = useState("175");
  const [weightKg, setWeightKg] = useState("72");

  const result = useMemo(() => {
    const h = Number(heightCm);
    const w = Number(weightKg);
    if (!Number.isFinite(h) || !Number.isFinite(w)) return null;
    if (h <= 0 || w <= 0) return null;
    const bsa = Math.sqrt((h * w) / 3600);
    return { h, w, bsa };
  }, [heightCm, weightKg]);

  return (
    <UtilityToolPageShell
      title="Body Surface Area Calculator"
      seoTitle="Body Surface Area Calculator - BSA"
      seoDescription="Free online body surface area calculator using height and weight. Estimate BSA quickly with Mosteller formula."
      canonical="https://usonlinetools.com/health/online-body-surface-area-calculator"
      categoryName="Health & Fitness"
      categoryHref="/category/health"
      heroDescription="Calculate body surface area (BSA) using the Mosteller formula for quick clinical estimates, medication guidance discussions, and health reference planning."
      heroIcon={<Stethoscope className="w-3.5 h-3.5" />}
      calculatorLabel="BSA Calculator"
      calculatorDescription="Enter height in centimeters and weight in kilograms to estimate body surface area in square meters."
      calculator={
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input className="tool-calc-input" type="number" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} placeholder="Height (cm)" />
            <input className="tool-calc-input" type="number" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} placeholder="Weight (kg)" />
          </div>
          {result ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="tool-calc-result">
                <p className="text-xs text-muted-foreground">BSA</p>
                <p className="text-2xl font-black text-blue-600">{fmt(result.bsa)} m²</p>
              </div>
              <div className="tool-calc-result">
                <p className="text-xs text-muted-foreground">Height</p>
                <p className="text-2xl font-black text-blue-600">{fmt(result.h, 1)} cm</p>
              </div>
              <div className="tool-calc-result">
                <p className="text-xs text-muted-foreground">Weight</p>
                <p className="text-2xl font-black text-blue-600">{fmt(result.w, 1)} kg</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Enter valid positive height and weight values.</p>
          )}
        </div>
      }
      howSteps={[
        { title: "Enter height in centimeters", description: "Use your current height measurement in cm for best consistency with standard BSA formulas." },
        { title: "Enter weight in kilograms", description: "Use your current body weight in kg for a representative estimate." },
        { title: "Read BSA output in square meters", description: "The result gives body surface area (m²), a reference metric used in several clinical contexts." },
      ]}
      interpretationCards={[
        { title: "BSA is an estimate, not a diagnosis", description: "BSA supports calculations and planning but does not replace medical assessment." },
        { title: "Mosteller formula is widely used", description: "It is simple and practical for quick BSA estimation from height and weight.", className: "bg-cyan-500/5 border-cyan-500/20" },
        { title: "Always confirm with clinicians for treatment decisions", description: "Medication dosing and treatment protocols must be reviewed by licensed professionals.", className: "bg-violet-500/5 border-violet-500/20" },
      ]}
      examples={[
        { scenario: "Adult average profile", input: "Height 175 cm | Weight 72 kg", output: "1.871 m² BSA" },
        { scenario: "Smaller frame", input: "Height 160 cm | Weight 54 kg", output: "1.549 m² BSA" },
        { scenario: "Larger frame", input: "Height 185 cm | Weight 92 kg", output: "2.174 m² BSA" },
      ]}
      whyChoosePoints={[
        "This BSA calculator is fast and accurate for Mosteller-based estimates often referenced in clinical and fitness contexts.",
        "The page is structured with the same robust content pattern as your percentage calculator family for stronger SEO quality.",
        "Everything calculates locally in-browser with no signup and no data sharing by default.",
      ]}
      faqs={[
        { q: "What is body surface area (BSA)?", a: "BSA is the measured or estimated total surface area of the human body, usually expressed in square meters (m²)." },
        { q: "Which formula is used here?", a: "This calculator uses the Mosteller formula: BSA = sqrt((height in cm x weight in kg) / 3600)." },
        { q: "Why is BSA used in healthcare?", a: "BSA is often used as a reference value in certain medication dosing and clinical assessments." },
        { q: "Can I use BSA alone for health decisions?", a: "No. BSA is only one metric and should be interpreted with clinical guidance and full context." },
      ]}
      relatedTools={[
        { title: "BMI Calculator", slug: "online-bmi-calculator", icon: <Scale className="w-4 h-4" />, color: 150, benefit: "Check body mass index quickly" },
        { title: "BMR Calculator", slug: "online-bmr-calculator", icon: <Activity className="w-4 h-4" />, color: 210, benefit: "Estimate resting calorie needs" },
        { title: "Calorie Calculator", slug: "calorie-calculator", icon: <HeartPulse className="w-4 h-4" />, color: 265, benefit: "Plan daily calorie targets" },
        { title: "Ideal Weight Calculator", slug: "ideal-weight-calculator", icon: <Ruler className="w-4 h-4" />, color: 28, benefit: "Estimate healthy target ranges" },
        { title: "Heart Rate Calculator", slug: "heart-rate-calculator", icon: <Calculator className="w-4 h-4" />, color: 330, benefit: "Track training heart zones" },
      ]}
      ctaTitle="Need More Health Tools?"
      ctaDescription="Explore BMI, BMR, calorie, and heart rate tools for complete body metrics planning."
      ctaHref="/category/health"
    />
  );
}

