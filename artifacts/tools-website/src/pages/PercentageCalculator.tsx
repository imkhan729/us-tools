import { useState } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { Calculator, Percent } from "lucide-react";

export default function PercentageCalculator() {
  const [calc1, setCalc1] = useState({ x: "", y: "" });
  const [calc2, setCalc2] = useState({ x: "", y: "" });
  const [calc3, setCalc3] = useState({ x: "", y: "" });

  const getResult1 = () => {
    const x = parseFloat(calc1.x);
    const y = parseFloat(calc1.y);
    if (isNaN(x) || isNaN(y)) return "--";
    return ((x / 100) * y).toLocaleString('en-US', { maximumFractionDigits: 4 });
  };

  const getResult2 = () => {
    const x = parseFloat(calc2.x);
    const y = parseFloat(calc2.y);
    if (isNaN(x) || isNaN(y) || y === 0) return "--";
    return ((x / y) * 100).toLocaleString('en-US', { maximumFractionDigits: 4 });
  };

  const getResult3 = () => {
    const x = parseFloat(calc3.x);
    const y = parseFloat(calc3.y);
    if (isNaN(x) || isNaN(y) || x === 0) return "--";
    const change = ((y - x) / Math.abs(x)) * 100;
    return `${change > 0 ? '+' : ''}${change.toLocaleString('en-US', { maximumFractionDigits: 4 })}`;
  };

  const ToolUI = (
    <div className="space-y-6">
      {/* What is X% of Y? */}
      <div className="glass-card p-6 md:p-8 rounded-3xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <h3 className="text-xl font-bold text-white mb-6 relative z-10 flex items-center">
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center mr-3">1</div>
          What is X% of Y?
        </h3>
        <div className="flex flex-col md:flex-row items-center gap-4 relative z-10">
          <span className="text-white font-medium">What is</span>
          <div className="relative">
            <input 
              type="number" 
              className="glass-input w-24 px-4 py-3 pl-10"
              value={calc1.x}
              onChange={(e) => setCalc1(prev => ({ ...prev, x: e.target.value }))}
            />
            <Percent className="w-4 h-4 text-muted-foreground absolute left-3 top-4" />
          </div>
          <span className="text-white font-medium">of</span>
          <input 
            type="number" 
            className="glass-input w-32 px-4 py-3"
            value={calc1.y}
            onChange={(e) => setCalc1(prev => ({ ...prev, y: e.target.value }))}
          />
          <span className="text-white font-medium mx-2">=</span>
          <div className="flex-1 w-full bg-background/50 rounded-xl px-6 py-3 border border-white/5 font-mono text-xl text-primary font-bold shadow-inner">
            {getResult1()}
          </div>
        </div>
      </div>

      {/* X is what % of Y? */}
      <div className="glass-card p-6 md:p-8 rounded-3xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <h3 className="text-xl font-bold text-white mb-6 relative z-10 flex items-center">
          <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center mr-3">2</div>
          X is what percent of Y?
        </h3>
        <div className="flex flex-col md:flex-row items-center gap-4 relative z-10">
          <input 
            type="number" 
            className="glass-input w-32 px-4 py-3"
            value={calc2.x}
            onChange={(e) => setCalc2(prev => ({ ...prev, x: e.target.value }))}
          />
          <span className="text-white font-medium">is what % of</span>
          <input 
            type="number" 
            className="glass-input w-32 px-4 py-3"
            value={calc2.y}
            onChange={(e) => setCalc2(prev => ({ ...prev, y: e.target.value }))}
          />
          <span className="text-white font-medium mx-2">=</span>
          <div className="flex-1 w-full bg-background/50 rounded-xl px-6 py-3 border border-white/5 font-mono text-xl text-purple-400 font-bold shadow-inner">
            {getResult2()}%
          </div>
        </div>
      </div>

      {/* Percentage change */}
      <div className="glass-card p-6 md:p-8 rounded-3xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <h3 className="text-xl font-bold text-white mb-6 relative z-10 flex items-center">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center mr-3">3</div>
          Percentage change from X to Y
        </h3>
        <div className="flex flex-col md:flex-row items-center gap-4 relative z-10">
          <span className="text-white font-medium">From</span>
          <input 
            type="number" 
            className="glass-input w-32 px-4 py-3"
            value={calc3.x}
            onChange={(e) => setCalc3(prev => ({ ...prev, x: e.target.value }))}
          />
          <span className="text-white font-medium">to</span>
          <input 
            type="number" 
            className="glass-input w-32 px-4 py-3"
            value={calc3.y}
            onChange={(e) => setCalc3(prev => ({ ...prev, y: e.target.value }))}
          />
          <span className="text-white font-medium mx-2">=</span>
          <div className="flex-1 w-full bg-background/50 rounded-xl px-6 py-3 border border-white/5 font-mono text-xl text-emerald-400 font-bold shadow-inner">
            {getResult3()}%
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <ToolPageLayout
      title="Percentage Calculator"
      description="Easily calculate percentages, increases, and decreases with this free online tool."
      tool={ToolUI}
      howToUse={
        <>
          <p>Our percentage calculator is divided into three distinct tools:</p>
          <ol>
            <li><strong>What is X% of Y:</strong> Useful for finding discount amounts, tipping at a restaurant, or calculating tax. Just enter the percentage you want to find, and the total amount.</li>
            <li><strong>X is what percent of Y:</strong> Ideal for finding test scores, grades, or finding out what portion of a budget has been spent.</li>
            <li><strong>Percentage Change:</strong> Perfect for tracking stock growth, sales metrics, or weight loss. It tells you exactly how much a value increased or decreased in percentage terms.</li>
          </ol>
        </>
      }
      faq={[
        { q: "How do I calculate a percentage in my head?", a: "To find 10% of a number, simply move the decimal point one place to the left. For 5%, take half of 10%. For 20%, double 10%." },
        { q: "Is this calculator free?", a: "Yes, 100% free with no ads or tracking." },
      ]}
      related={[
        { title: "Age Calculator", path: "/tools/age-calculator", icon: <Calculator className="w-5 h-5" /> },
      ]}
    />
  );
}
