import { useMemo, useState } from "react";
import { ArrowRightLeft, Clock3, Hourglass, Timer } from "lucide-react";
import UtilityToolPageShell from "./UtilityToolPageShell";

function parseTime(value: string): number | null {
  const parts = value.split(":");
  if (parts.length !== 2) return null;

  const hours = Number(parts[0]);
  const minutes = Number(parts[1]);

  if (!Number.isInteger(hours) || !Number.isInteger(minutes)) return null;
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;

  return hours * 60 + minutes;
}

function formatClock(totalMinutes: number): { label: string; offset: number } {
  const minutesInDay = 24 * 60;
  const offset = Math.floor(totalMinutes / minutesInDay);
  let normalized = totalMinutes % minutesInDay;

  if (normalized < 0) normalized += minutesInDay;

  const hours = Math.floor(normalized / 60);
  const minutes = normalized % 60;

  return {
    label: `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`,
    offset,
  };
}

function formatDuration(totalMinutes: number): string {
  const sign = totalMinutes < 0 ? "-" : "";
  const absolute = Math.abs(totalMinutes);
  const hours = Math.floor(absolute / 60);
  const minutes = absolute % 60;
  return `${sign}${hours}h ${minutes}m`;
}

export default function TimeCalculator() {
  const [startTime, setStartTime] = useState("09:15");
  const [endTime, setEndTime] = useState("17:45");
  const [allowOvernight, setAllowOvernight] = useState(true);
  const [baseTime, setBaseTime] = useState("08:30");
  const [deltaHours, setDeltaHours] = useState("2");
  const [deltaMinutes, setDeltaMinutes] = useState("45");
  const [decimalHours, setDecimalHours] = useState("7.5");

  const difference = useMemo(() => {
    const start = parseTime(startTime);
    const end = parseTime(endTime);

    if (start === null || end === null) return null;

    let minutes = end - start;
    if (allowOvernight && minutes < 0) minutes += 24 * 60;

    return {
      minutes,
      decimalHours: minutes / 60,
    };
  }, [allowOvernight, endTime, startTime]);

  const adjustedTime = useMemo(() => {
    const start = parseTime(baseTime);
    const hours = Number(deltaHours);
    const minutes = Number(deltaMinutes);

    if (start === null || !Number.isFinite(hours) || !Number.isFinite(minutes)) return null;

    const total = start + hours * 60 + minutes;
    return formatClock(total);
  }, [baseTime, deltaHours, deltaMinutes]);

  const decimalBreakdown = useMemo(() => {
    const value = Number(decimalHours);
    if (!Number.isFinite(value)) return null;

    const sign = value < 0 ? -1 : 1;
    const absolute = Math.abs(value);
    const wholeHours = Math.trunc(absolute);
    const minutes = Math.round((absolute - wholeHours) * 60);
    const totalMinutes = sign * (wholeHours * 60 + minutes);

    return {
      hoursLabel: `${sign < 0 ? "-" : ""}${wholeHours}h ${minutes}m`,
      totalMinutes,
    };
  }, [decimalHours]);

  return (
    <UtilityToolPageShell
      title="Time Calculator"
      seoTitle="Time Calculator - Difference, Add Time, and Decimal Hours"
      seoDescription="Free online time calculator. Find the time between two times, add or subtract time, and convert decimal hours instantly."
      canonical="https://usonlinetools.com/time-date/time-calculator"
      categoryName="Time & Date"
      categoryHref="/category/time-date"
      heroDescription="Use this browser-based time calculator to find the time between two clock values, add or subtract hours and minutes, and convert decimal hours into a readable hours-and-minutes format."
      heroIcon={<Clock3 className="w-3.5 h-3.5" />}
      calculatorLabel="3 Time Calculators in 1"
      calculatorDescription="Cover the most common time calculations from one page instead of switching between separate tools."
      calculator={
        <div className="space-y-5">
          <div className="rounded-2xl border border-orange-500/20 bg-orange-500/5 p-4 md:p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-orange-500 text-white flex items-center justify-center">
                <Hourglass className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Time Between Two Times</p>
                <p className="text-sm text-muted-foreground">Useful for shifts, travel windows, and event planning.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground block mb-2">Start Time</label>
                <input className="tool-calc-input w-full" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground block mb-2">End Time</label>
                <input className="tool-calc-input w-full" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
              </div>
              <label className="flex items-center gap-2 rounded-xl border border-border bg-background/80 px-4 py-3 text-sm font-medium text-foreground">
                <input type="checkbox" checked={allowOvernight} onChange={(e) => setAllowOvernight(e.target.checked)} />
                Treat end time as next day if needed
              </label>
            </div>

            {difference ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                <div className="tool-calc-result">
                  <p className="text-xs text-muted-foreground">Duration</p>
                  <p className="text-2xl font-black text-orange-600">{formatDuration(difference.minutes)}</p>
                </div>
                <div className="tool-calc-result">
                  <p className="text-xs text-muted-foreground">Decimal Hours</p>
                  <p className="text-2xl font-black text-orange-600">{difference.decimalHours.toLocaleString("en-US", { maximumFractionDigits: 2 })}</p>
                </div>
                <div className="tool-calc-result">
                  <p className="text-xs text-muted-foreground">Total Minutes</p>
                  <p className="text-2xl font-black text-orange-600">{difference.minutes}</p>
                </div>
              </div>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">Enter valid times to calculate the duration.</p>
            )}
          </div>

          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4 md:p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-blue-500 text-white flex items-center justify-center">
                <ArrowRightLeft className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Add or Subtract Time</p>
                <p className="text-sm text-muted-foreground">Use negative numbers to subtract hours or minutes.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground block mb-2">Base Time</label>
                <input className="tool-calc-input w-full" type="time" value={baseTime} onChange={(e) => setBaseTime(e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground block mb-2">Hours</label>
                <input className="tool-calc-input w-full" type="number" value={deltaHours} onChange={(e) => setDeltaHours(e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground block mb-2">Minutes</label>
                <input className="tool-calc-input w-full" type="number" value={deltaMinutes} onChange={(e) => setDeltaMinutes(e.target.value)} />
              </div>
            </div>

            {adjustedTime ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                <div className="tool-calc-result">
                  <p className="text-xs text-muted-foreground">New Time</p>
                  <p className="text-2xl font-black text-blue-600">{adjustedTime.label}</p>
                </div>
                <div className="tool-calc-result">
                  <p className="text-xs text-muted-foreground">Day Offset</p>
                  <p className="text-2xl font-black text-blue-600">
                    {adjustedTime.offset === 0 ? "Same day" : adjustedTime.offset > 0 ? `+${adjustedTime.offset} day` : `${adjustedTime.offset} day`}
                  </p>
                </div>
              </div>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">Enter a valid base time and numeric hour/minute offsets.</p>
            )}
          </div>

          <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-4 md:p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-cyan-500 text-white flex items-center justify-center">
                <Timer className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Decimal Hours Converter</p>
                <p className="text-sm text-muted-foreground">Turn payroll-style decimal hours into clock-friendly values.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3 items-end">
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground block mb-2">Decimal Hours</label>
                <input className="tool-calc-input w-full" type="number" step="0.01" value={decimalHours} onChange={(e) => setDecimalHours(e.target.value)} />
              </div>
              <div className="rounded-xl border border-border bg-background/80 px-4 py-3 text-sm text-muted-foreground">Examples: 7.5, 8.25, -1.75</div>
            </div>

            {decimalBreakdown ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                <div className="tool-calc-result">
                  <p className="text-xs text-muted-foreground">Hours and Minutes</p>
                  <p className="text-2xl font-black text-cyan-600">{decimalBreakdown.hoursLabel}</p>
                </div>
                <div className="tool-calc-result">
                  <p className="text-xs text-muted-foreground">Total Minutes</p>
                  <p className="text-2xl font-black text-cyan-600">{decimalBreakdown.totalMinutes}</p>
                </div>
              </div>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">Enter a valid decimal hour value to convert it.</p>
            )}
          </div>
        </div>
      }
      howSteps={[
        { title: "Choose the time workflow you need", description: "Use the first panel for a duration, the second for adding or subtracting time, and the third for decimal-hour conversion." },
        { title: "Enter time values in the relevant inputs", description: "Type clock times with the time pickers and use numeric fields for hour, minute, or decimal adjustments." },
        { title: "Read the result card that matches your use case", description: "The page shows hours and minutes, decimal hours, total minutes, and day offsets where they matter." },
      ]}
      interpretationCards={[
        { title: "Overnight mode changes negative durations into next-day results", description: "If your end time is earlier than your start time, turning overnight mode on treats the end time as the following day." },
        { title: "Decimal hours are not the same as clock minutes", description: "For example, 7.5 hours means 7 hours and 30 minutes, not 7 hours and 50 minutes.", className: "bg-blue-500/5 border-blue-500/20" },
        { title: "Day offset matters when adding large values", description: "If you add enough hours to cross midnight, the calculator marks whether the result lands on the same day or a later one.", className: "bg-cyan-500/5 border-cyan-500/20" },
      ]}
      examples={[
        { scenario: "Work shift", input: "09:00 to 17:30", output: "8h 30m" },
        { scenario: "Add time", input: "08:30 + 2h 45m", output: "11:15" },
        { scenario: "Decimal conversion", input: "7.5 hours", output: "7h 30m" },
      ]}
      whyChoosePoints={[
        "This tool targets the broad time-calculator intent with a more useful widget mix than a single narrow form.",
        "The structure matches the same proven percentage-style format: strong above-the-fold calculator section first, followed by interpretation, examples, and supporting content.",
        "It stays fully browser-based, which makes it fast for payroll checks, scheduling, and shift math on mobile or desktop.",
      ]}
      faqs={[
        { q: "What if the end time is earlier than the start time?", a: "Enable the overnight option to treat the end time as the next day. This is useful for evening or overnight shifts." },
        { q: "Can I subtract time instead of adding it?", a: "Yes. In the add-or-subtract panel, use negative hours or minutes to move backward from the base time." },
        { q: "Why does 8.25 hours become 8h 15m?", a: "The decimal part is a fraction of an hour. A quarter of an hour equals 15 minutes." },
        { q: "Is this good for payroll calculations?", a: "Yes for quick time math and decimal-hour conversion. For overtime pay rules, use a dedicated payroll or overtime calculator as needed." },
      ]}
      relatedTools={[
        { title: "Time Duration Calculator", slug: "time-duration-calculator", icon: <Hourglass className="w-4 h-4" />, color: 28, benefit: "Handle longer duration calculations" },
        { title: "Time Addition Calculator", slug: "time-addition-calculator", icon: <ArrowRightLeft className="w-4 h-4" />, color: 210, benefit: "Focus on multi-value time sums" },
        { title: "Time Subtraction Calculator", slug: "time-subtraction-calculator", icon: <Timer className="w-4 h-4" />, color: 265, benefit: "Subtract clock values directly" },
        { title: "Hourly Time Calculator", slug: "hourly-time-calculator", icon: <Clock3 className="w-4 h-4" />, color: 150, benefit: "Move into wage and hours workflows" },
        { title: "Overtime Calculator", slug: "overtime-calculator", icon: <Clock3 className="w-4 h-4" />, color: 330, benefit: "Estimate premium-hour pay" },
      ]}
      ctaTitle="Need More Time Tools?"
      ctaDescription="Use shift, overtime, countdown, and timezone calculators to extend the same scheduling workflow."
      ctaHref="/category/time-date"
    />
  );
}
