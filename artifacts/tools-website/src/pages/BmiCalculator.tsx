import { useState } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { Activity, Scale } from "lucide-react";

export default function BmiCalculator() {
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [height, setHeight] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [weight, setWeight] = useState("");

  const calcBmi = () => {
    if (unit === "metric") {
      const h = parseFloat(height) / 100;
      const w = parseFloat(weight);
      if (!h || !w || h <= 0) return null;
      return w / (h * h);
    } else {
      const totalIn = parseFloat(heightFt) * 12 + parseFloat(heightIn || "0");
      const w = parseFloat(weight);
      if (!totalIn || !w) return null;
      return (w / (totalIn * totalIn)) * 703;
    }
  };

  const bmi = calcBmi();

  const getCategory = (bmi: number) => {
    if (bmi < 18.5) return { label: "Underweight", color: "text-blue-500", bar: "bg-blue-500", pct: 15 };
    if (bmi < 25)   return { label: "Normal weight", color: "text-emerald-500", bar: "bg-emerald-500", pct: 40 };
    if (bmi < 30)   return { label: "Overweight", color: "text-yellow-500", bar: "bg-yellow-500", pct: 65 };
    return { label: "Obese", color: "text-red-500", bar: "bg-red-500", pct: 90 };
  };

  const cat = bmi ? getCategory(bmi) : null;

  const inputCls = "w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-foreground font-medium focus:outline-none focus:border-primary transition-colors";

  const ToolUI = (
    <div className="space-y-6">
      {/* Unit toggle */}
      <div className="flex rounded-xl border-2 border-border overflow-hidden">
        {(["metric", "imperial"] as const).map(u => (
          <button
            key={u}
            onClick={() => setUnit(u)}
            className={`flex-1 py-3 font-black uppercase text-sm tracking-wider transition-colors ${unit === u ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground"}`}
          >
            {u === "metric" ? "Metric (cm / kg)" : "Imperial (ft / lb)"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Height */}
        <div>
          <label className="block text-sm font-bold uppercase tracking-wider text-foreground mb-2">
            Height {unit === "metric" ? "(cm)" : "(ft & in)"}
          </label>
          {unit === "metric" ? (
            <input type="number" placeholder="e.g. 175" className={inputCls} value={height} onChange={e => setHeight(e.target.value)} />
          ) : (
            <div className="flex gap-2">
              <input type="number" placeholder="ft" className={inputCls} value={heightFt} onChange={e => setHeightFt(e.target.value)} />
              <input type="number" placeholder="in" className={inputCls} value={heightIn} onChange={e => setHeightIn(e.target.value)} />
            </div>
          )}
        </div>
        {/* Weight */}
        <div>
          <label className="block text-sm font-bold uppercase tracking-wider text-foreground mb-2">
            Weight {unit === "metric" ? "(kg)" : "(lbs)"}
          </label>
          <input type="number" placeholder={unit === "metric" ? "e.g. 70" : "e.g. 154"} className={inputCls} value={weight} onChange={e => setWeight(e.target.value)} />
        </div>
      </div>

      {/* Result */}
      {bmi && cat ? (
        <div className="bg-muted/40 rounded-xl p-6 border-2 border-border space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Your BMI</p>
              <p className="text-5xl font-black text-foreground mt-1">{bmi.toFixed(1)}</p>
            </div>
            <div className={`text-right`}>
              <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Category</p>
              <p className={`text-2xl font-black mt-1 ${cat.color}`}>{cat.label}</p>
            </div>
          </div>
          {/* bar */}
          <div className="space-y-1">
            <div className="h-3 rounded-full bg-gradient-to-r from-blue-400 via-emerald-400 via-yellow-400 to-red-400 relative overflow-hidden">
              <div
                className="absolute top-0 bottom-0 w-1 bg-foreground rounded-full shadow"
                style={{ left: `${Math.min(cat.pct, 97)}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              <span>Underweight</span><span>Normal</span><span>Overweight</span><span>Obese</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-muted/30 rounded-xl p-8 text-center border-2 border-dashed border-border">
          <Activity className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="font-bold text-muted-foreground">Enter your height and weight to calculate BMI</p>
        </div>
      )}

      {/* Reference table */}
      <div className="rounded-xl border-2 border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="py-3 px-4 text-left font-black uppercase tracking-wider text-foreground">BMI Range</th>
              <th className="py-3 px-4 text-left font-black uppercase tracking-wider text-foreground">Category</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {[
              { range: "Below 18.5", label: "Underweight", color: "text-blue-500" },
              { range: "18.5 – 24.9", label: "Normal weight", color: "text-emerald-500" },
              { range: "25.0 – 29.9", label: "Overweight", color: "text-yellow-500" },
              { range: "30.0 and above", label: "Obese", color: "text-red-500" },
            ].map(r => (
              <tr key={r.range} className="bg-card">
                <td className="py-3 px-4 font-mono font-bold text-foreground">{r.range}</td>
                <td className={`py-3 px-4 font-bold ${r.color}`}>{r.label}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <ToolPageLayout
      title="BMI Calculator"
      description="Calculate your Body Mass Index instantly using metric or imperial units."
      tool={ToolUI}
      howToUse={
        <>
          <p>Use the BMI Calculator to find your Body Mass Index in seconds:</p>
          <ol>
            <li><strong>Choose your unit system</strong> — switch between Metric (cm/kg) or Imperial (ft/lb).</li>
            <li><strong>Enter your height</strong> — in centimeters, or feet and inches.</li>
            <li><strong>Enter your weight</strong> — in kilograms or pounds.</li>
            <li><strong>Read your result</strong> — your BMI score and category appear instantly.</li>
          </ol>
          <p>BMI is a screening tool, not a medical diagnosis. Always consult a healthcare professional for personalized advice.</p>
        </>
      }
      faq={[
        { q: "What is a healthy BMI?", a: "A BMI between 18.5 and 24.9 is considered normal weight for most adults. Below 18.5 is underweight, 25–29.9 is overweight, and 30+ is obese." },
        { q: "Is BMI accurate for everyone?", a: "BMI is a useful screening tool but doesn't account for muscle mass, bone density, age, or sex. Athletes may have a high BMI without being overweight." },
        { q: "What is the BMI formula?", a: "Metric: BMI = weight(kg) ÷ height(m)². Imperial: BMI = (weight(lb) ÷ height(in)²) × 703." },
        { q: "Can children use this calculator?", a: "This calculator is designed for adults (age 20+). BMI for children and teens is calculated differently using age and sex percentile charts." },
      ]}
      related={[
        { title: "BMR Calculator", path: "/tools/bmr-calculator", icon: <Activity className="w-5 h-5" /> },
        { title: "Calorie Intake Calculator", path: "/tools/calorie-intake-calculator", icon: <Activity className="w-5 h-5" /> },
        { title: "Ideal Weight Calculator", path: "/tools/ideal-weight-calculator", icon: <Scale className="w-5 h-5" /> },
      ]}
    />
  );
}
