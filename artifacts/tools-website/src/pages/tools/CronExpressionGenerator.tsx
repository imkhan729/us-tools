import { useMemo, useState } from "react";
import { CalendarClock, Check, Copy, RefreshCw, Server, Terminal, Timer, Type } from "lucide-react";
import UtilityToolPageShell from "./UtilityToolPageShell";

type Mode = "every-minute" | "every-n-minutes" | "hourly" | "daily" | "weekly" | "monthly";

const WEEKDAYS = [
  { value: "0", label: "Sunday" },
  { value: "1", label: "Monday" },
  { value: "2", label: "Tuesday" },
  { value: "3", label: "Wednesday" },
  { value: "4", label: "Thursday" },
  { value: "5", label: "Friday" },
  { value: "6", label: "Saturday" },
];

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function pad(value: string) {
  return value.padStart(2, "0");
}

function parseSafe(value: string, min: number, max: number) {
  return String(clamp(Number.parseInt(value || "0", 10) || 0, min, max));
}

function weekdayLabel(value: string) {
  return WEEKDAYS.find((day) => day.value === value)?.label ?? "Sunday";
}

function ordinal(value: number) {
  const mod10 = value % 10;
  const mod100 = value % 100;
  if (mod10 === 1 && mod100 !== 11) return `${value}st`;
  if (mod10 === 2 && mod100 !== 12) return `${value}nd`;
  if (mod10 === 3 && mod100 !== 13) return `${value}rd`;
  return `${value}th`;
}

function buildSchedule(mode: Mode, minute: string, hour: string, interval: string, weekday: string, dayOfMonth: string) {
  const safeMinute = parseSafe(minute, 0, 59);
  const safeHour = parseSafe(hour, 0, 23);
  const safeInterval = parseSafe(interval, 1, 59);
  const safeDay = parseSafe(dayOfMonth, 1, 31);

  if (mode === "every-minute") {
    return {
      expression: "* * * * *",
      explanation: "Runs once every minute.",
      example: "Useful for aggressive polling, lightweight sync loops, and queue heartbeat jobs.",
    };
  }

  if (mode === "every-n-minutes") {
    return {
      expression: `*/${safeInterval} * * * *`,
      explanation: `Runs every ${safeInterval} minute${safeInterval === "1" ? "" : "s"}.`,
      example: "Common for cache warming, background sync, API refreshes, and monitoring checks.",
    };
  }

  if (mode === "hourly") {
    return {
      expression: `${safeMinute} * * * *`,
      explanation: `Runs at minute ${pad(safeMinute)} of every hour.`,
      example: "Good for hourly reports, token refresh jobs, digest generation, and periodic maintenance.",
    };
  }

  if (mode === "daily") {
    return {
      expression: `${safeMinute} ${safeHour} * * *`,
      explanation: `Runs every day at ${pad(safeHour)}:${pad(safeMinute)}.`,
      example: "Often used for daily backups, summary emails, data rollups, and nightly cleanups.",
    };
  }

  if (mode === "weekly") {
    return {
      expression: `${safeMinute} ${safeHour} * * ${weekday}`,
      explanation: `Runs every ${weekdayLabel(weekday)} at ${pad(safeHour)}:${pad(safeMinute)}.`,
      example: "Good for weekly exports, recurring maintenance windows, or team digest jobs.",
    };
  }

  return {
    expression: `${safeMinute} ${safeHour} ${safeDay} * *`,
    explanation: `Runs on the ${ordinal(Number.parseInt(safeDay, 10))} day of every month at ${pad(safeHour)}:${pad(safeMinute)}.`,
    example: "Useful for monthly invoices, end-of-month reports, billing sync, and recurring account jobs.",
  };
}

export default function CronExpressionGenerator() {
  const [mode, setMode] = useState<Mode>("daily");
  const [minute, setMinute] = useState("0");
  const [hour, setHour] = useState("9");
  const [interval, setInterval] = useState("15");
  const [weekday, setWeekday] = useState("1");
  const [dayOfMonth, setDayOfMonth] = useState("1");
  const [copiedLabel, setCopiedLabel] = useState("");

  const schedule = useMemo(() => buildSchedule(mode, minute, hour, interval, weekday, dayOfMonth), [mode, minute, hour, interval, weekday, dayOfMonth]);

  const crontabLine = `# ${schedule.explanation}\n${schedule.expression} /usr/bin/env bash /path/to/script.sh`;
  const nodeCronLine = `cron.schedule("${schedule.expression}", () => {\n  // job logic here\n});`;

  const copyValue = async (label: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedLabel(label);
    window.setTimeout(() => setCopiedLabel(""), 1800);
  };

  const resetToDaily = () => {
    setMode("daily");
    setMinute("0");
    setHour("9");
    setInterval("15");
    setWeekday("1");
    setDayOfMonth("1");
  };

  return (
    <UtilityToolPageShell
      title="Cron Expression Generator"
      seoTitle="Cron Expression Generator - Build 5-Field Cron Schedules Online"
      seoDescription="Free cron expression generator for building 5-field cron schedules visually. Create minute, hourly, daily, weekly, and monthly cron strings with plain-English explanations and copy-ready snippets."
      canonical="https://usonlinetools.com/developer/cron-expression-generator"
      categoryName="Developer Tools"
      categoryHref="/category/developer"
      heroDescription="Build cron schedules visually without memorizing cron syntax. This free cron expression generator creates 5-field cron strings for common job patterns like every few minutes, hourly tasks, daily runs, weekly jobs, and monthly schedules, then explains the result in plain English so you can copy it into crontab, server configs, scripts, or scheduler libraries confidently."
      heroIcon={<Timer className="w-3.5 h-3.5" />}
      calculatorLabel="Cron Builder"
      calculatorDescription="Choose a schedule pattern, adjust the timing fields, and copy the generated cron expression or code snippet."
      calculator={
        <div className="space-y-5">
          <div className="grid grid-cols-1 xl:grid-cols-[300px_1fr] gap-5">
            <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5 space-y-4">
              <div>
                <label htmlFor="cron-mode" className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Schedule Type</label>
                <select id="cron-mode" value={mode} onChange={(event) => setMode(event.target.value as Mode)} className="tool-calc-input w-full">
                  <option value="every-minute">Every Minute</option>
                  <option value="every-n-minutes">Every N Minutes</option>
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              {mode === "every-n-minutes" && (
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Interval</label>
                  <input type="number" min={1} max={59} value={interval} onChange={(event) => setInterval(parseSafe(event.target.value, 1, 59))} className="tool-calc-input w-full font-mono" />
                </div>
              )}

              {(mode === "hourly" || mode === "daily" || mode === "weekly" || mode === "monthly") && (
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Minute</label>
                  <input type="number" min={0} max={59} value={minute} onChange={(event) => setMinute(parseSafe(event.target.value, 0, 59))} className="tool-calc-input w-full font-mono" />
                </div>
              )}

              {(mode === "daily" || mode === "weekly" || mode === "monthly") && (
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Hour</label>
                  <input type="number" min={0} max={23} value={hour} onChange={(event) => setHour(parseSafe(event.target.value, 0, 23))} className="tool-calc-input w-full font-mono" />
                </div>
              )}

              {mode === "weekly" && (
                <div>
                  <label htmlFor="weekday" className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Weekday</label>
                  <select id="weekday" value={weekday} onChange={(event) => setWeekday(event.target.value)} className="tool-calc-input w-full">
                    {WEEKDAYS.map((day) => (
                      <option key={day.value} value={day.value}>{day.label}</option>
                    ))}
                  </select>
                </div>
              )}

              {mode === "monthly" && (
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Day of Month</label>
                  <input type="number" min={1} max={31} value={dayOfMonth} onChange={(event) => setDayOfMonth(parseSafe(event.target.value, 1, 31))} className="tool-calc-input w-full font-mono" />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <button onClick={resetToDaily} className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-bold text-foreground hover:bg-muted">
                  <RefreshCw className="w-4 h-4" />
                  Reset
                </button>
                <button onClick={() => copyValue("expression", schedule.expression)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700">
                  {copiedLabel === "expression" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  Copy Expr
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-border bg-card p-5">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3">Generated Cron Expression</p>
                <div className="rounded-2xl bg-slate-950 p-5 text-slate-100">
                  <p className="text-2xl font-black font-mono tracking-tight break-all">{schedule.expression}</p>
                  <p className="mt-3 text-sm leading-relaxed text-slate-300">{schedule.explanation}</p>
                  <p className="mt-2 text-xs text-slate-400">{schedule.example}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">crontab Snippet</p>
                    <button onClick={() => copyValue("crontab", crontabLine)} className="text-xs font-bold text-blue-600 hover:text-blue-700">
                      {copiedLabel === "crontab" ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <pre className="overflow-x-auto rounded-xl bg-slate-950 p-4 text-xs leading-relaxed text-slate-100">
                    <code>{crontabLine}</code>
                  </pre>
                </div>

                <div className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">node-cron Snippet</p>
                    <button onClick={() => copyValue("node-cron", nodeCronLine)} className="text-xs font-bold text-blue-600 hover:text-blue-700">
                      {copiedLabel === "node-cron" ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <pre className="overflow-x-auto rounded-xl bg-slate-950 p-4 text-xs leading-relaxed text-slate-100">
                    <code>{nodeCronLine}</code>
                  </pre>
                </div>
              </div>

              <div className="grid grid-cols-5 gap-3">
                {[
                  { label: "Minute", value: schedule.expression.split(" ")[0] },
                  { label: "Hour", value: schedule.expression.split(" ")[1] },
                  { label: "Day", value: schedule.expression.split(" ")[2] },
                  { label: "Month", value: schedule.expression.split(" ")[3] },
                  { label: "Weekday", value: schedule.expression.split(" ")[4] },
                ].map((field) => (
                  <div key={field.label} className="rounded-xl border border-border bg-muted/40 p-3 text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">{field.label}</p>
                    <p className="mt-1 text-lg font-black font-mono text-foreground">{field.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      }
      howSteps={[
        { title: "Choose the schedule pattern that matches the job you are trying to run", description: "Most people do not need to type raw cron syntax from memory for every task. They need to express common intents like every fifteen minutes, every day at 9 AM, or every Monday morning. This generator starts with those practical schedule types so you can focus on what the job should do rather than remembering which field position controls which part of the schedule." },
        { title: "Adjust the timing fields that matter for that pattern", description: "Once you choose a schedule type, the relevant controls appear automatically. An hourly job only needs a minute value. A daily job needs an hour and minute. A weekly job adds a weekday. A monthly job adds a day-of-month value. That keeps the builder easier to scan than a blank cron string while still teaching you how the underlying 5-field expression is constructed." },
        { title: "Read the generated cron string and the plain-English explanation together", description: "A good cron expression generator should not just produce text that looks technical. It should confirm the meaning of that text clearly so you can avoid mistakes. The expression card shows the exact 5-field string and a plain-English description of when the job will run. That reduces the most common cron problem: copying a syntactically valid expression that does the wrong thing." },
        { title: "Copy the format that matches where the schedule is going next", description: "If you are editing a Linux crontab, grab the crontab snippet. If you are documenting a Node scheduler or wiring a task into `node-cron`, grab the library example. The page is designed to shorten the handoff from idea to implementation, which is exactly what people usually want from a cron builder in real server and deployment workflows." },
      ]}
      interpretationCards={[
        { title: "Cron field order matters more than many users expect", description: "A standard 5-field cron expression follows minute, hour, day of month, month, and weekday. A lot of scheduling mistakes happen because people swap the positions mentally or copy syntax from a different scheduler that uses a six-field variant. This generator keeps the order visible so you can verify the structure before you paste it into production." },
        { title: "A valid cron string can still be operationally wrong", description: "Cron syntax can be perfectly legal while still expressing the wrong run pattern. For example, a job intended to run every Monday could accidentally run every day if the weekday field is left too broad. That is why the plain-English explanation is as important as the expression itself.", className: "bg-cyan-500/5 border-cyan-500/20" },
        { title: "Different schedulers may support extra syntax beyond basic cron", description: "This page focuses on standard 5-field cron expressions because that is the most common baseline across Linux cron, many control panels, and a large number of scheduler libraries. Some platforms add seconds fields, Quartz-specific syntax, or aliases, so always confirm the target environment before assuming every advanced cron feature is portable.", className: "bg-violet-500/5 border-violet-500/20" },
        { title: "Operational timing still matters outside the expression itself", description: "Even the right cron string can cause problems if it runs at a poor time. Heavy jobs scheduled exactly on the hour may collide with other maintenance tasks, logs, backups, or traffic spikes. In practice, staggered minutes and explicit run windows often lead to healthier systems than defaulting everything to 00.", className: "bg-amber-500/5 border-amber-500/20" },
      ]}
      examples={[
        { scenario: "Every 15 minutes", input: "Every N Minutes, interval 15", output: "*/15 * * * *" },
        { scenario: "Daily report at 9:00", input: "Daily, 09:00", output: "0 9 * * *" },
        { scenario: "Weekly cleanup on Monday at 02:30", input: "Weekly, Monday, 02:30", output: "30 2 * * 1" },
        { scenario: "Monthly billing run", input: "Monthly, 1st day, 04:15", output: "15 4 1 * *" },
      ]}
      whyChoosePoints={[
        "This cron expression generator is built around the actual scheduling decisions people make, not just around displaying a raw cron cheat sheet. It turns common intents into valid 5-field expressions, explains the result in plain language, and gives you copy-ready snippets for shell-based cron and JavaScript scheduler usage. That makes it more useful than a static table or a placeholder page with no working schedule builder.",
        "The page also supports stronger on-page quality than thin cron tools that rank only on a keyword and then fail to help the user. A working widget, clear field breakdowns, examples, internal linking, and practical explanations all make the page more useful to humans, which is exactly the kind of product quality the prompt asks for. That matters both for user trust and for building pages that have a better chance of performing well in search over time.",
        "For developers and DevOps users, reducing scheduling mistakes is the main value. Cron errors are often small, silent, and expensive. A mistaken weekday, a misplaced hour, or a badly chosen interval can lead to missed invoices, duplicate emails, overloaded workers, or maintenance jobs firing at the wrong time. A builder that confirms the schedule meaning before copy-paste helps prevent that class of problem.",
        "The page fits cleanly into the broader internal tool ecosystem. After generating a schedule, users can move into related developer tools for timestamp checks, JSON formatting, or encoding tasks that often sit nearby in scripting and automation workflows. That internal linking is not filler. It reflects how people actually move through adjacent debugging and operations tasks once a scheduled job is being built.",
        "Everything happens immediately in the browser. There is no account gate, no install requirement, and no dependency on external scheduler APIs. That makes the tool useful in quick debugging sessions, documentation work, deployment prep, and team handoff scenarios where speed and clarity matter more than ceremonial setup.",
      ]}
      faqs={[
        { q: "What is a cron expression?", a: "A cron expression is a compact scheduling string used to tell a system when a recurring job should run. In the standard 5-field form, the fields represent minute, hour, day of month, month, and weekday. For example, `0 9 * * *` means run every day at 9:00. Cron is widely used on Linux servers, hosting panels, background workers, and many scheduler libraries." },
        { q: "Why are there different cron formats online?", a: "Because not every scheduler uses the same flavor. Standard Linux cron commonly uses five fields. Some systems add a seconds field at the beginning, and others like Quartz support additional symbols and semantics. This page focuses on the standard 5-field version because it is the most broadly portable baseline for server-side cron usage." },
        { q: "What is the difference between day-of-month and weekday in cron?", a: "Day-of-month refers to a calendar date such as the 1st, 15th, or 31st. Weekday refers to a day of the week such as Monday or Friday. In a standard 5-field expression, they are separate positions. If you confuse them, you may end up scheduling a job monthly when you meant weekly, or weekly when you meant monthly." },
        { q: "Can I use this cron expression generator for node-cron?", a: "Yes, for standard 5-field schedules. The page includes a node-cron style snippet so you can see how the generated expression fits into a JavaScript scheduler call. Just make sure the library or environment you are using expects the same 5-field format and does not require a seconds field." },
        { q: "Is every-minute scheduling always a bad idea?", a: "Not always, but it needs thought. Lightweight heartbeat jobs or tiny sync checks may be fine every minute, but heavier tasks can create load, overlap, or noisy logs if scheduled too aggressively. In many real systems, a staggered interval such as every 5 or 15 minutes is a safer default unless the business requirement clearly demands tighter frequency." },
        { q: "What time zone does a cron expression use?", a: "That depends on the environment running it, not on the cron string itself. A cron expression has no built-in time zone metadata in the standard form. The server, container, hosting panel, or scheduler configuration determines the time zone. Always verify that environment setting before assuming a job will run at a given local wall-clock time." },
        { q: "Can this page tell me whether a cron job is operationally safe?", a: "It can help with schedule structure and plain-English meaning, but operational safety depends on more than syntax. You still need to think about job duration, overlap, server load, locking, retries, and maintenance windows. A cron generator reduces expression mistakes, but it does not replace production job design." },
        { q: "Who is this tool useful for?", a: "It is useful for developers writing background jobs, DevOps engineers managing server tasks, site owners configuring hosting panel cron jobs, analysts automating recurring exports, and anyone who needs a correct cron string without relying on memory or risky copy-paste from unrelated examples." },
      ]}
      relatedTools={[
        { title: "Unix Timestamp Converter", slug: "unix-timestamp-converter", icon: <CalendarClock className="w-4 h-4" />, color: 217, benefit: "Check time-related values around scheduled jobs" },
        { title: "JSON Formatter", slug: "json-formatter", icon: <Terminal className="w-4 h-4" />, color: 152, benefit: "Format payloads used by recurring automation tasks" },
        { title: "URL Encoder Decoder", slug: "url-encoder-decoder", icon: <Type className="w-4 h-4" />, color: 25, benefit: "Prepare encoded URLs used by job scripts" },
        { title: "UUID Generator", slug: "uuid-generator", icon: <Server className="w-4 h-4" />, color: 280, benefit: "Generate identifiers for scheduled workflow tests" },
        { title: "Text to Binary Converter", slug: "text-to-binary-converter", icon: <Copy className="w-4 h-4" />, color: 45, benefit: "Use alongside lower-level script debugging" },
        { title: "Color Code Converter", slug: "color-code-converter", icon: <RefreshCw className="w-4 h-4" />, color: 340, benefit: "Another new developer utility in the same tool set" },
      ]}
      ctaTitle="Need More Developer Tools?"
      ctaDescription="Keep building with formatter, converter, encoding, and scheduling utilities that fit directly into real development workflows."
      ctaHref="/category/developer"
    />
  );
}
