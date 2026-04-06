import { useMemo, useState, type CSSProperties } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ChevronDown,
  Timer,
  Clock,
  Zap,
  BadgeCheck,
  Lock,
  Shield,
  Smartphone,
  Lightbulb,
  Plus,
  Trash2,
  Copy,
  Check,
  FileText,
  ArrowRight,
  AlarmClock,
  CalendarClock,
  Briefcase,
} from "lucide-react";

type Task = { id: string; name: string; startTime: string; endTime: string };
type TaskWithDuration = Task & {
  durationMinutes: number;
  formattedDuration: string;
  overnight: boolean;
};

const RELATED_TOOLS = [
  { title: "Shift Hours Calculator", slug: "shift-hours-calculator", icon: <CalendarClock className="w-5 h-5" />, benefit: "Track work shifts and breaks" },
  { title: "Deadline Calculator", slug: "deadline-calculator", icon: <AlarmClock className="w-5 h-5" />, benefit: "Plan due dates and schedules" },
  { title: "Hourly Time Calculator", slug: "hourly-time-calculator", icon: <Clock className="w-5 h-5" />, benefit: "Convert totals into worked hours" },
  { title: "Hourly Pay Calculator", slug: "hourly-time-calculator", icon: <Briefcase className="w-5 h-5" />, benefit: "Turn logged time into billable value" },
];

function formatDuration(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
}

function getDuration(startTime: string, endTime: string) {
  const [sh, sm] = startTime.split(":").map(Number);
  const [eh, em] = endTime.split(":").map(Number);
  if ([sh, sm, eh, em].some(Number.isNaN)) return { minutes: 0, overnight: false };

  let start = sh * 60 + sm;
  let end = eh * 60 + em;
  let overnight = false;
  if (end < start) {
    end += 1440;
    overnight = true;
  }
  return { minutes: end - start, overnight };
}

function useTimeTracker() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", name: "Planning", startTime: "09:00", endTime: "10:15" },
    { id: "2", name: "Client work", startTime: "10:30", endTime: "13:00" },
    { id: "3", name: "Admin", startTime: "14:00", endTime: "14:45" },
  ]);

  const addTask = () => {
    setTasks((current) => [
      ...current,
      { id: `${Date.now()}-${current.length}`, name: "New task", startTime: "15:00", endTime: "15:30" },
    ]);
  };

  const updateTask = (id: string, field: keyof Task, value: string) => {
    setTasks((current) => current.map((task) => (task.id === id ? { ...task, [field]: value } : task)));
  };

  const removeTask = (id: string) => {
    setTasks((current) => current.filter((task) => task.id !== id));
  };

  const stats = useMemo(() => {
    let totalMinutes = 0;
    let overnightEntries = 0;

    const computedTasks: TaskWithDuration[] = tasks.map((task) => {
      const duration = getDuration(task.startTime, task.endTime);
      totalMinutes += duration.minutes;
      if (duration.overnight) overnightEntries += 1;
      return {
        ...task,
        durationMinutes: duration.minutes,
        formattedDuration: formatDuration(duration.minutes),
        overnight: duration.overnight,
      };
    });

    const averageMinutes = computedTasks.length ? Math.round(totalMinutes / computedTasks.length) : 0;
    return {
      tasks: computedTasks,
      totalMinutes,
      totalFormatted: formatDuration(totalMinutes),
      averageFormatted: formatDuration(averageMinutes),
      taskCount: computedTasks.length,
      overnightEntries,
    };
  }, [tasks]);

  return { tasks, addTask, updateTask, removeTask, stats };
}

function ResultInsight({
  totalFormatted,
  taskCount,
  averageFormatted,
  overnightEntries,
}: {
  totalFormatted: string;
  taskCount: number;
  averageFormatted: string;
  overnightEntries: number;
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 rounded-xl bg-orange-500/5 border border-orange-500/20">
      <div className="flex gap-2 items-start">
        <Lightbulb className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-foreground/80 leading-relaxed">
          You are tracking <strong className="text-foreground">{taskCount}</strong> entries totaling{" "}
          <strong className="text-foreground">{totalFormatted}</strong>, with an average block of{" "}
          <strong className="text-foreground">{averageFormatted}</strong>.
          {overnightEntries > 0 ? ` ${overnightEntries} entry${overnightEntries > 1 ? "s" : ""} cross midnight and are calculated automatically.` : " No entries currently cross midnight."}
        </p>
      </div>
    </motion.div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-orange-500/40 transition-colors">
      <button onClick={() => setOpen((value) => !value)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-orange-500">
          <ChevronDown className="w-5 h-5" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div key="answer" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} className="overflow-hidden">
            <p className="px-5 pb-5 text-muted-foreground leading-relaxed border-t border-border pt-4">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function TimeTrackingCalculator() {
  const calc = useTimeTracker();
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const copySummary = async () => {
    const summary = calc.stats.tasks
      .map((task) => `${task.name}: ${task.startTime} - ${task.endTime}${task.overnight ? " (overnight)" : ""} = ${task.formattedDuration}`)
      .join("\n");
    await navigator.clipboard.writeText(`${summary}\n\nTotal tracked time: ${calc.stats.totalFormatted}\nAverage task length: ${calc.stats.averageFormatted}`);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <Layout>
      <SEO
        title="Time Tracking Calculator - Track Task Hours Online, Free | US Online Tools"
        description="Free online time tracking calculator. Log start and end times for multiple tasks, total worked hours instantly, and handle overnight entries automatically. No signup required."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-orange-500" strokeWidth={3} />
          <Link href="/category/time-date" className="text-muted-foreground hover:text-foreground transition-colors">Time &amp; Date</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-orange-500" strokeWidth={3} />
          <span className="text-foreground">Time Tracking Calculator</span>
        </nav>

        <section className="rounded-2xl overflow-hidden border border-orange-500/15 bg-gradient-to-br from-orange-500/5 via-card to-amber-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Timer className="w-3.5 h-3.5" /> Time &amp; Date
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">Time Tracking Calculator</h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Track start and end times for multiple tasks, total your work hours instantly, and keep a clean record for billing, timesheets, study sessions, and daily productivity reviews.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20"><BadgeCheck className="w-3.5 h-3.5" /> 100% Free</span>
            <span className="inline-flex items-center gap-1.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold text-xs px-3 py-1.5 rounded-full border border-orange-500/20"><Zap className="w-3.5 h-3.5" /> Instant Totals</span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20"><Lock className="w-3.5 h-3.5" /> No Signup</span>
            <span className="inline-flex items-center gap-1.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-xs px-3 py-1.5 rounded-full border border-violet-500/20"><Shield className="w-3.5 h-3.5" /> Privacy First</span>
            <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs px-3 py-1.5 rounded-full border border-cyan-500/20"><Smartphone className="w-3.5 h-3.5" /> Mobile Ready</span>
          </div>
          <p className="text-xs text-muted-foreground/60 font-medium">Category: Time &amp; Date · Last updated: March 2026</p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">
            <section className="space-y-5">
              <div className="rounded-2xl overflow-hidden border border-orange-500/20 shadow-lg shadow-orange-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 to-amber-400" />
                <div className="bg-card p-6 md:p-8 space-y-5">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center flex-shrink-0"><Clock className="w-4 h-4 text-white" /></div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Multi-task time tracker</p>
                      <p className="text-sm text-muted-foreground">Add tasks, edit time blocks, and totals update as you type.</p>
                    </div>
                  </div>

                  <div className="tool-calc-card" style={{ "--calc-hue": 25 } as CSSProperties}>
                    <div className="flex items-center gap-3 mb-5">
                      <div className="tool-calc-number">1</div>
                      <h2 className="text-lg font-bold text-foreground">Log tasks and total your tracked hours</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
                      <div className="rounded-xl border border-orange-500/15 bg-orange-500/5 p-4"><p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Total tracked time</p><p className="text-2xl font-black text-orange-600 dark:text-orange-400">{calc.stats.totalFormatted}</p></div>
                      <div className="rounded-xl border border-border bg-muted/30 p-4"><p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Entries</p><p className="text-2xl font-black text-foreground">{calc.stats.taskCount}</p></div>
                      <div className="rounded-xl border border-border bg-muted/30 p-4"><p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Average block</p><p className="text-2xl font-black text-foreground">{calc.stats.averageFormatted}</p></div>
                    </div>
                    <div className="space-y-3">
                      {calc.stats.tasks.map((task) => (
                        <div key={task.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center p-4 rounded-xl bg-muted/30 border border-border">
                          <div className="md:col-span-5"><input value={task.name} onChange={(event) => calc.updateTask(task.id, "name", event.target.value)} className="tool-calc-input w-full text-left" placeholder="Task name" /></div>
                          <div className="md:col-span-2"><input type="time" value={task.startTime} onChange={(event) => calc.updateTask(task.id, "startTime", event.target.value)} className="tool-calc-input w-full" /></div>
                          <div className="md:col-span-2"><input type="time" value={task.endTime} onChange={(event) => calc.updateTask(task.id, "endTime", event.target.value)} className="tool-calc-input w-full" /></div>
                          <div className="md:col-span-2"><div className="tool-calc-result text-orange-600 dark:text-orange-400">{task.formattedDuration}{task.overnight ? <span className="block text-[10px] font-bold text-muted-foreground mt-1">Overnight</span> : null}</div></div>
                          <div className="md:col-span-1 flex md:justify-end"><button type="button" onClick={() => calc.removeTask(task.id)} className="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-border text-muted-foreground hover:text-red-500 hover:border-red-500/40 transition-colors" aria-label={`Remove ${task.name}`}><Trash2 className="w-4 h-4" /></button></div>
                        </div>
                      ))}
                    </div>
                    <button type="button" onClick={calc.addTask} className="mt-4 w-full flex items-center justify-center gap-2 py-4 rounded-xl border-2 border-dashed border-border text-muted-foreground hover:border-orange-500/50 hover:text-orange-500 transition-all font-bold text-sm"><Plus className="w-4 h-4" /> Add task line</button>
                    <ResultInsight totalFormatted={calc.stats.totalFormatted} taskCount={calc.stats.taskCount} averageFormatted={calc.stats.averageFormatted} overnightEntries={calc.stats.overnightEntries} />
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Use the Time Tracking Calculator</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">This tool follows the same people-first approach as the main calculator templates on the site: direct inputs, instant results, plain-English guidance, and practical examples instead of filler text.</p>
              <ol className="space-y-5 mb-8">
                <li className="flex gap-4"><div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div><div><p className="font-bold text-foreground mb-1">Name each task clearly</p><p className="text-muted-foreground text-sm leading-relaxed">Use labels that still make sense later, such as "Client call," "Design review," or "Night audit." Clear names make summaries more useful for managers, invoices, and personal reporting.</p></div></li>
                <li className="flex gap-4"><div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div><div><p className="font-bold text-foreground mb-1">Enter real start and end times</p><p className="text-muted-foreground text-sm leading-relaxed">Each row calculates duration instantly. If the end time is earlier than the start time, the calculator treats it as an overnight entry and rolls the finish into the next day automatically.</p></div></li>
                <li className="flex gap-4"><div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div><div><p className="font-bold text-foreground mb-1">Review the totals and copy the summary</p><p className="text-muted-foreground text-sm leading-relaxed">Use the totals for timesheets, freelance billing, study planning, or productivity reviews. The copy action gives you a clean summary you can paste anywhere.</p></div></li>
              </ol>
              <div className="p-5 rounded-xl bg-muted/60 border border-border">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Core formulas</p>
                <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                  <p><code className="px-2 py-1.5 bg-background rounded text-xs font-mono">Duration = End Time - Start Time</code></p>
                  <p><code className="px-2 py-1.5 bg-background rounded text-xs font-mono">If End &lt; Start, add 24 hours</code></p>
                  <p><code className="px-2 py-1.5 bg-background rounded text-xs font-mono">Total Tracked Time = Sum of all durations</code></p>
                </div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Result Categories &amp; Interpretation</h2>
              <p className="text-muted-foreground text-sm mb-6">How to read your logged time and what the patterns may mean.</p>
              <div className="space-y-3">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20"><div className="w-3 h-3 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5" /><div><p className="font-bold text-foreground mb-1">Short blocks under 30 minutes</p><p className="text-sm text-muted-foreground leading-relaxed">Useful for email, admin, quick calls, and interruptions. If your day is mostly short blocks, you may be losing focus time.</p></div></div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20"><div className="w-3 h-3 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" /><div><p className="font-bold text-foreground mb-1">Focused blocks from 30 to 120 minutes</p><p className="text-sm text-muted-foreground leading-relaxed">This range is common for productive work sessions like coding, studying, writing, and client delivery.</p></div></div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-orange-500/5 border border-orange-500/20"><div className="w-3 h-3 rounded-full bg-orange-500 flex-shrink-0 mt-1.5" /><div><p className="font-bold text-foreground mb-1">Long blocks over 2 hours</p><p className="text-sm text-muted-foreground leading-relaxed">Long sessions can be valid, but they are also where forgotten stop times create inflated totals. Review them before sending a timesheet.</p></div></div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-violet-500/5 border border-violet-500/20"><div className="w-3 h-3 rounded-full bg-violet-500 flex-shrink-0 mt-1.5" /><div><p className="font-bold text-foreground mb-1">Overnight entries</p><p className="text-sm text-muted-foreground leading-relaxed">Important for hospitality, healthcare, security, support, transport, and late production work. The calculator handles these correctly.</p></div></div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Quick Examples</h2>
              <div className="overflow-x-auto rounded-xl border border-border mb-6">
                <table className="w-full text-sm">
                  <thead><tr className="bg-muted/60"><th className="text-left px-4 py-3 font-bold text-foreground">Scenario</th><th className="text-left px-4 py-3 font-bold text-foreground">Start</th><th className="text-left px-4 py-3 font-bold text-foreground">End</th><th className="text-left px-4 py-3 font-bold text-foreground">Result</th><th className="text-left px-4 py-3 font-bold text-foreground hidden sm:table-cell">Use case</th></tr></thead>
                  <tbody className="divide-y divide-border">
                    <tr className="hover:bg-muted/30 transition-colors"><td className="px-4 py-3 text-muted-foreground">Client meeting</td><td className="px-4 py-3 font-mono text-foreground">09:00</td><td className="px-4 py-3 font-mono text-foreground">10:30</td><td className="px-4 py-3 font-bold text-orange-600 dark:text-orange-400">1h 30m</td><td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Freelance billing</td></tr>
                    <tr className="hover:bg-muted/30 transition-colors"><td className="px-4 py-3 text-muted-foreground">Study block</td><td className="px-4 py-3 font-mono text-foreground">19:15</td><td className="px-4 py-3 font-mono text-foreground">20:45</td><td className="px-4 py-3 font-bold text-orange-600 dark:text-orange-400">1h 30m</td><td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Revision planning</td></tr>
                    <tr className="hover:bg-muted/30 transition-colors"><td className="px-4 py-3 text-muted-foreground">Night support shift</td><td className="px-4 py-3 font-mono text-foreground">22:00</td><td className="px-4 py-3 font-mono text-foreground">02:00</td><td className="px-4 py-3 font-bold text-orange-600 dark:text-orange-400">4h</td><td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Overnight work</td></tr>
                    <tr className="hover:bg-muted/30 transition-colors"><td className="px-4 py-3 text-muted-foreground">Admin catch-up</td><td className="px-4 py-3 font-mono text-foreground">14:10</td><td className="px-4 py-3 font-mono text-foreground">14:35</td><td className="px-4 py-3 font-bold text-orange-600 dark:text-orange-400">25m</td><td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Email and paperwork</td></tr>
                  </tbody>
                </table>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">Example 1 - Freelance work log:</strong> A consultant tracks a 90-minute strategy session and copies the result directly into an invoice note.</p>
                <p><strong className="text-foreground">Example 2 - Study planning:</strong> A student logs evening revision sessions to compare planned study time against what actually happened.</p>
                <p><strong className="text-foreground">Example 3 - Overnight operations:</strong> A support engineer logs work from 10:00 PM to 2:00 AM and gets a correct 4-hour total without manual adjustments.</p>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Why Choose This Time Tracking Calculator?</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">Fast enough for real daily use.</strong> You can open the page, log a few rows, and get a usable total in seconds without setting up a workspace or account.</p>
                <p><strong className="text-foreground">Built for practical timekeeping.</strong> The page handles multiple entries, overnight shifts, and copy-ready summaries, which covers the most common manual logging needs.</p>
                <p><strong className="text-foreground">Private by default.</strong> The calculations happen locally in the browser, which matters when task names include client work, staffing details, or internal operations.</p>
                <p><strong className="text-foreground">Consistent with the site-wide calculator template.</strong> The layout, guidance, and supporting content now follow the same structure used by the main Percentage Calculator page.</p>
              </div>
              <div className="mt-6 p-4 rounded-xl border border-border bg-muted/30">
                <p className="text-sm text-muted-foreground leading-relaxed"><strong className="text-foreground">Note:</strong> This tool is intended for simple manual tracking and quick reporting. Review entries before using them in payroll, compliance, or formal records.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem q="How does this time tracking calculator work?" a="You enter a task name, a start time, and an end time for each row. The calculator converts each pair into minutes, calculates a duration, and adds all rows together for the total." />
                <FaqItem q="Can I track more than one task?" a="Yes. Add as many task rows as you need. This is useful for consultants, shift workers, students, and anyone splitting a day across several activities." />
                <FaqItem q="What happens if a task goes past midnight?" a="If the end time is earlier than the start time, the calculator assumes the task continues into the next day and adds 24 hours before calculating the duration." />
                <FaqItem q="Does this tool include breaks automatically?" a="No. If you want breaks excluded, leave a gap between tasks or add separate entries before and after the break." />
                <FaqItem q="Can I use this for invoices or timesheets?" a="Yes. The copy-summary action is designed for that. It creates a plain-text log you can paste into invoices, spreadsheets, or manager updates." />
                <FaqItem q="Is my data saved anywhere?" a="No. Entries are handled in the browser while the page is open. Refreshing the page resets the list, and no account is required." />
              </div>
            </section>

            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Need More Time Tools?</h2>
                <p className="text-white/80 mb-6 max-w-lg">Explore more calculators for shift hours, deadlines, and time totals so you can move from raw logs to planning and reporting faster.</p>
                <Link href="/category/time-date" className="inline-flex items-center gap-2 bg-white text-orange-600 px-5 py-3 rounded-xl font-black text-sm hover:translate-x-0.5 transition-transform">Browse Time &amp; Date Tools <ArrowRight className="w-4 h-4" /></Link>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <div className="sticky top-28 space-y-6">
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-3">Actions</h3>
                <button onClick={copySummary} className="w-full flex items-center justify-center gap-2 py-2.5 bg-orange-600 text-white text-xs font-black uppercase rounded-xl hover:-translate-y-0.5 transition-transform shadow-lg shadow-orange-600/20 mb-3">{copiedSummary ? <><Check className="w-4 h-4" /> Copied summary</> : <><Copy className="w-4 h-4" /> Copy summary</>}</button>
                <button onClick={copyLink} className="w-full flex items-center justify-center gap-2 py-2.5 border border-border text-foreground text-xs font-black uppercase rounded-xl hover:border-orange-500/40 transition-colors">{copiedLink ? <><Check className="w-4 h-4" /> Copied link</> : <><FileText className="w-4 h-4" /> Copy page link</>}</button>
              </div>
              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="text-[10px] font-black uppercase text-muted-foreground mb-4 tracking-widest">Related tools</h3>
                <div className="space-y-4">
                  {RELATED_TOOLS.map((tool) => (
                    <Link key={tool.title} href={`/time-date/${tool.slug}`} className="flex items-start gap-3 group">
                      <div className="w-8 h-8 rounded bg-muted flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-colors">{tool.icon}</div>
                      <div><p className="text-xs font-bold text-muted-foreground group-hover:text-foreground">{tool.title}</p><p className="text-[11px] text-muted-foreground/80 leading-relaxed">{tool.benefit}</p></div>
                    </Link>
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
