import { useState } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { Thermometer, Ruler } from "lucide-react";

type Unit = "C" | "F" | "K" | "R";
const UNITS: { key: Unit; label: string; full: string }[] = [
  { key: "C", label: "°C", full: "Celsius" },
  { key: "F", label: "°F", full: "Fahrenheit" },
  { key: "K", label: "K",  full: "Kelvin" },
  { key: "R", label: "°R", full: "Rankine" },
];

function toC(val: number, from: Unit): number {
  if (from === "C") return val;
  if (from === "F") return (val - 32) * 5 / 9;
  if (from === "K") return val - 273.15;
  return (val - 491.67) * 5 / 9;
}

function fromC(c: number, to: Unit): number {
  if (to === "C") return c;
  if (to === "F") return c * 9 / 5 + 32;
  if (to === "K") return c + 273.15;
  return (c + 273.15) * 9 / 5;
}

const REFERENCES = [
  { label: "Absolute zero", C: -273.15 },
  { label: "Water freezes", C: 0 },
  { label: "Body temperature", C: 37 },
  { label: "Room temperature", C: 22 },
  { label: "Water boils", C: 100 },
];

export default function TemperatureConverter() {
  const [value, setValue] = useState("");
  const [from, setFrom] = useState<Unit>("C");

  const inputVal = parseFloat(value);
  const celsius = isNaN(inputVal) ? null : toC(inputVal, from);

  const converted = (to: Unit) => celsius !== null ? fromC(celsius, to) : null;

  const fmt = (n: number | null) => {
    if (n === null) return "—";
    return n.toLocaleString("en-US", { maximumFractionDigits: 4 });
  };

  const inputCls = "w-full px-4 py-4 rounded-xl border-2 border-border bg-background text-foreground font-bold text-2xl focus:outline-none focus:border-primary transition-colors text-center";

  const ToolUI = (
    <div className="space-y-6">
      {/* From unit selector */}
      <div>
        <label className="block text-sm font-black uppercase tracking-wider text-foreground mb-2">Convert from</label>
        <div className="grid grid-cols-4 gap-2">
          {UNITS.map(u => (
            <button
              key={u.key}
              onClick={() => setFrom(u.key)}
              className={`py-3 rounded-xl border-2 font-black text-sm transition-all ${from === u.key ? "bg-primary text-primary-foreground border-primary shadow-[2px_2px_0px_0px_hsl(var(--foreground))]" : "bg-card text-foreground border-border hover:border-primary"}`}
            >
              <span className="text-lg">{u.label}</span>
              <br />
              <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">{u.full}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div>
        <label className="block text-sm font-black uppercase tracking-wider text-foreground mb-2">
          Enter temperature in {UNITS.find(u => u.key === from)?.full}
        </label>
        <input
          type="number"
          placeholder="e.g. 100"
          className={inputCls}
          value={value}
          onChange={e => setValue(e.target.value)}
        />
      </div>

      {/* Results */}
      <div className="grid grid-cols-2 gap-3">
        {UNITS.filter(u => u.key !== from).map(u => {
          const val = converted(u.key);
          return (
            <div key={u.key} className="bg-card border-2 border-border rounded-xl p-5 text-center hover:border-primary transition-colors">
              <p className="text-xs font-black uppercase tracking-wider text-muted-foreground mb-1">{u.full}</p>
              <p className="text-3xl font-black text-foreground">
                {val !== null ? fmt(val) : "—"}
              </p>
              <p className="text-sm font-bold text-primary mt-0.5">{u.label}</p>
            </div>
          );
        })}
      </div>

      {/* Reference table */}
      <div className="rounded-xl border-2 border-border overflow-hidden">
        <div className="bg-muted/50 px-4 py-3 border-b border-border">
          <p className="font-black uppercase tracking-wider text-sm text-foreground">Common References</p>
        </div>
        <div className="divide-y divide-border">
          {REFERENCES.map(ref => (
            <div key={ref.label} className="grid grid-cols-5 text-sm px-4 py-2.5 bg-card">
              <span className="col-span-1 font-bold text-muted-foreground text-xs leading-tight">{ref.label}</span>
              <span className="font-mono font-bold text-foreground text-center">{ref.C}°C</span>
              <span className="font-mono font-bold text-foreground text-center">{fmt(fromC(ref.C, "F"))}°F</span>
              <span className="font-mono font-bold text-foreground text-center">{fmt(fromC(ref.C, "K"))}K</span>
              <span className="font-mono font-bold text-foreground text-center">{fmt(fromC(ref.C, "R"))}°R</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <ToolPageLayout
      title="Temperature Converter"
      description="Convert between Celsius, Fahrenheit, Kelvin, and Rankine instantly with this free online temperature converter."
      tool={ToolUI}
      howToUse={
        <>
          <p>Converting temperatures is quick and easy:</p>
          <ol>
            <li><strong>Select your input unit</strong> — choose Celsius, Fahrenheit, Kelvin, or Rankine.</li>
            <li><strong>Type your temperature</strong> — the other three units update instantly.</li>
            <li><strong>Use the reference table</strong> — see common temperatures like boiling point and body temperature as a quick guide.</li>
          </ol>
        </>
      }
      faq={[
        { q: "How do I convert Celsius to Fahrenheit?", a: "Multiply by 9/5, then add 32. Example: 100°C × 9/5 + 32 = 212°F." },
        { q: "What is absolute zero?", a: "Absolute zero is the lowest possible temperature — 0 K (Kelvin), which equals −273.15°C or −459.67°F. At this point, molecular motion theoretically stops." },
        { q: "What is the difference between Kelvin and Celsius?", a: "Kelvin and Celsius have the same size degree, but different starting points. K = °C + 273.15. Kelvin is used in science because it starts at absolute zero." },
        { q: "What is Rankine?", a: "Rankine is an absolute temperature scale like Kelvin but based on Fahrenheit degrees. It's used primarily in some engineering fields in the United States." },
      ]}
      related={[
        { title: "Length Converter", path: "/tools/length-converter", icon: <Ruler className="w-5 h-5" /> },
        { title: "Weight Converter", path: "/tools/weight-converter", icon: <Thermometer className="w-5 h-5" /> },
        { title: "Speed Converter", path: "/tools/speed-converter", icon: <Ruler className="w-5 h-5" /> },
      ]}
    />
  );
}
