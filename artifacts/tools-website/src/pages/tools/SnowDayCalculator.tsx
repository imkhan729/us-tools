import { useMemo, useState } from "react";
import { BookOpen, Clock3, CloudSnow, School, Wind } from "lucide-react";
import UtilityToolPageShell from "./UtilityToolPageShell";

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export default function SnowDayCalculator() {
  const [snowfall, setSnowfall] = useState("7");
  const [ice, setIce] = useState("0.2");
  const [temperature, setTemperature] = useState("28");
  const [wind, setWind] = useState("18");
  const [schoolStart, setSchoolStart] = useState("07:30");
  const [roadType, setRoadType] = useState<"urban" | "suburban" | "rural">("suburban");

  const result = useMemo(() => {
    const snow = Number(snowfall);
    const iceAmount = Number(ice);
    const temp = Number(temperature);
    const windSpeed = Number(wind);
    const startHour = Number(schoolStart.split(":")[0] ?? "7");

    if (![snow, iceAmount, temp, windSpeed, startHour].every(Number.isFinite)) return null;

    const snowScore = Math.min(Math.max(snow, 0), 14) / 14 * 50;
    const iceScore = Math.min(Math.max(iceAmount, 0), 1.5) / 1.5 * 22;
    const coldScore = temp <= 32 ? Math.min(32 - temp, 25) / 25 * 12 : -Math.min(temp - 32, 20) / 20 * 10;
    const windScore = Math.min(Math.max(windSpeed, 0), 40) / 40 * 8;
    const startScore = startHour <= 6 ? 8 : startHour <= 7 ? 6 : startHour <= 8 ? 3 : 0;
    const roadScore = roadType === "rural" ? 10 : roadType === "suburban" ? 6 : 2;
    const probability = clamp(Math.round(snowScore + iceScore + coldScore + windScore + startScore + roadScore), 1, 99);

    const recommendation =
      probability >= 80
        ? "Closure looks likely"
        : probability >= 60
          ? "Delay or closure is plausible"
          : probability >= 35
            ? "Delay is more realistic than a full closure"
            : "School is more likely to stay open";

    return {
      probability,
      recommendation,
      delayChance: clamp(Math.round(probability * 0.72), 1, 95),
      severity: probability >= 80 ? "High" : probability >= 60 ? "Elevated" : probability >= 35 ? "Moderate" : "Low",
    };
  }, [ice, roadType, schoolStart, snowfall, temperature, wind]);

  return (
    <UtilityToolPageShell
      title="Snow Day Calculator"
      seoTitle="Snow Day Calculator - Estimate School Closure Chance"
      seoDescription="Free online snow day calculator. Estimate school closure probability from snowfall, ice, temperature, wind, and road conditions."
      canonical="https://usonlinetools.com/education/snow-day-calculator"
      categoryName="Student & Education"
      categoryHref="/category/education"
      heroDescription="Estimate the chance of a snow day with a lightweight browser-based model that combines snowfall, ice, temperature, wind, school start time, and road conditions. It is built for quick planning, not official district forecasting."
      heroIcon={<CloudSnow className="w-3.5 h-3.5" />}
      calculatorLabel="Weather-Based Estimate"
      calculatorDescription="Adjust the local conditions and the model updates the closure probability instantly."
      calculator={
        <div className="space-y-5">
          <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-4 md:p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground block mb-2">Forecast Snowfall (inches)</label>
                <input className="tool-calc-input w-full" type="number" step="0.1" value={snowfall} onChange={(e) => setSnowfall(e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground block mb-2">Ice / Freezing Rain (inches)</label>
                <input className="tool-calc-input w-full" type="number" step="0.01" value={ice} onChange={(e) => setIce(e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground block mb-2">Temperature (deg F)</label>
                <input className="tool-calc-input w-full" type="number" value={temperature} onChange={(e) => setTemperature(e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground block mb-2">Wind Speed (mph)</label>
                <input className="tool-calc-input w-full" type="number" value={wind} onChange={(e) => setWind(e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground block mb-2">School Start Time</label>
                <input className="tool-calc-input w-full" type="time" value={schoolStart} onChange={(e) => setSchoolStart(e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground block mb-2">Road Type</label>
                <select className="tool-calc-input w-full" value={roadType} onChange={(e) => setRoadType(e.target.value as "urban" | "suburban" | "rural")}>
                  <option value="urban">Urban / city routes</option>
                  <option value="suburban">Suburban mix</option>
                  <option value="rural">Rural roads / long bus routes</option>
                </select>
              </div>
            </div>

            {result ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                  <div className="tool-calc-result">
                    <p className="text-xs text-muted-foreground">Snow Day Probability</p>
                    <p className="text-2xl font-black text-indigo-600">{result.probability}%</p>
                  </div>
                  <div className="tool-calc-result">
                    <p className="text-xs text-muted-foreground">Delay Probability</p>
                    <p className="text-2xl font-black text-indigo-600">{result.delayChance}%</p>
                  </div>
                  <div className="tool-calc-result">
                    <p className="text-xs text-muted-foreground">Severity Band</p>
                    <p className="text-2xl font-black text-indigo-600">{result.severity}</p>
                  </div>
                </div>

                <div className="mt-4 rounded-xl border border-indigo-500/20 bg-background/80 p-4">
                  <p className="text-sm font-bold text-foreground mb-1">{result.recommendation}</p>
                  <p className="text-sm text-muted-foreground">
                    This estimate is a planning aid based on the conditions you entered. Always follow your school or district announcement for the actual decision.
                  </p>
                </div>
              </>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">Enter local conditions to estimate the chance of a snow day.</p>
            )}
          </div>
        </div>
      }
      howSteps={[
        { title: "Enter the local forecast", description: "Start with the expected snowfall, any ice accumulation, temperature, and wind for the overnight or morning window." },
        { title: "Add context for buses and roads", description: "Early start times and rural roads increase the chance of a closure or delay because travel conditions matter more." },
        { title: "Use the probability as a planning estimate", description: "Treat the result as a quick expectation tool, then confirm with official school alerts in the morning." },
      ]}
      interpretationCards={[
        { title: "Ice can matter more than snow", description: "A smaller amount of freezing rain can create more dangerous roads than a moderate snowfall total, so it has a strong weight in the model." },
        { title: "Rural districts often close sooner", description: "Long bus routes, untreated roads, and wider travel areas can push a district toward delay or closure faster than dense urban systems.", className: "bg-cyan-500/5 border-cyan-500/20" },
        { title: "This is not an official forecast", description: "Districts also factor staffing, plowing progress, and local policy, so real closures can differ from the estimate.", className: "bg-violet-500/5 border-violet-500/20" },
      ]}
      examples={[
        { scenario: "Heavy overnight storm", input: "10 in snow, 0.2 in ice, 24 F, rural roads", output: "High closure chance" },
        { scenario: "Light snow in the city", input: "2 in snow, no ice, 33 F, urban roads", output: "Low closure chance" },
        { scenario: "Mixed winter weather", input: "4 in snow, 0.3 in ice, 29 F, suburban roads", output: "Delay or closure possible" },
      ]}
      whyChoosePoints={[
        "Snow day calculators are a strong missing long-tail fit for the education section because the site already serves school, exam, and schedule workflows.",
        "The page keeps the same percentage-style structure with a live browser tool first, then interpretation notes, examples, and FAQ content underneath.",
        "It is intentionally lightweight and transparent, which makes it easy to use on mobile before bed or during a fast morning weather check.",
      ]}
      faqs={[
        { q: "Is this an official school closure prediction?", a: "No. It is a planning estimate based on the conditions you enter and should not replace school or district announcements." },
        { q: "Why do road type and start time matter?", a: "Earlier start times leave less time for roads to be treated, and rural routes typically involve longer travel on less-serviced roads." },
        { q: "Can a district close with low snowfall totals?", a: "Yes. Ice, wind, extreme cold, and local transportation conditions can all increase the chance of closure or delay." },
        { q: "Does this work outside the United States?", a: "Yes as a rough estimate, but local snow-response policies vary a lot, so the accuracy depends on how your area handles winter weather." },
      ]}
      relatedTools={[
        { title: "Study Time Calculator", slug: "study-time-calculator", icon: <BookOpen className="w-4 h-4" />, color: 225, benefit: "Plan what to do if the day stays open" },
        { title: "Homework Time Calculator", slug: "homework-time-calculator", icon: <School className="w-4 h-4" />, color: 280, benefit: "Map backup study time at home" },
        { title: "Event Countdown Timer", slug: "event-countdown-timer", icon: <Clock3 className="w-4 h-4" />, color: 160, benefit: "Track the next school break or exam" },
        { title: "Countdown Timer", slug: "countdown-timer", icon: <Clock3 className="w-4 h-4" />, color: 25, benefit: "Set a live timer for weather checks" },
        { title: "Time Zone Converter", slug: "online-time-zone-converter", icon: <Wind className="w-4 h-4" />, color: 330, benefit: "Coordinate plans with family in other regions" },
      ]}
      ctaTitle="Need More School Tools?"
      ctaDescription="Move into GPA, homework, study, and exam tools to keep the rest of your school planning in one place."
      ctaHref="/category/education"
    />
  );
}
