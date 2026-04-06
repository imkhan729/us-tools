import { useMemo, useState } from "react";
import { BookOpen, CalendarDays, Clock3, Plus, Trash2 } from "lucide-react";
import StudentToolPageShell from "./StudentToolPageShell";
import { formatPercent } from "./studentGradeUtils";

interface ScheduleBlock {
  id: number;
  subject: string;
  day: string;
  start: string;
  end: string;
  type: "class" | "lab" | "study";
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

let nextScheduleId = 4;

function timeToMinutes(value: string) {
  const [hours, minutes] = value.split(":").map(Number);
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return null;
  return hours * 60 + minutes;
}

function formatHourValue(hours: number) {
  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);

  if (wholeHours === 0) return `${minutes} min`;
  if (minutes === 0) return `${wholeHours} hr`;
  return `${wholeHours} hr ${minutes} min`;
}

export default function SchoolSchedulePlanner() {
  const [blocks, setBlocks] = useState<ScheduleBlock[]>([
    { id: 1, subject: "Math", day: "Monday", start: "08:30", end: "10:00", type: "class" },
    { id: 2, subject: "Biology Lab", day: "Wednesday", start: "13:00", end: "15:00", type: "lab" },
    { id: 3, subject: "History Review", day: "Thursday", start: "17:00", end: "18:30", type: "study" },
  ]);

  const result = useMemo(() => {
    const validBlocks = blocks
      .map((block) => {
        const start = timeToMinutes(block.start);
        const end = timeToMinutes(block.end);
        if (!block.subject.trim() || start === null || end === null || end <= start) {
          return null;
        }

        return {
          ...block,
          durationHours: (end - start) / 60,
        };
      })
      .filter((block): block is ScheduleBlock & { durationHours: number } => block !== null);

    if (validBlocks.length === 0) return null;

    const dailyTotals = DAYS.reduce<Record<string, number>>((accumulator, day) => {
      accumulator[day] = 0;
      return accumulator;
    }, {});

    let studyBlocks = 0;

    for (const block of validBlocks) {
      dailyTotals[block.day] += block.durationHours;
      if (block.type === "study") studyBlocks += 1;
    }

    const busiestDay = DAYS.reduce((bestDay, day) =>
      dailyTotals[day] > dailyTotals[bestDay] ? day : bestDay,
    "Monday");

    return {
      totalWeeklyHours: validBlocks.reduce((sum, block) => sum + block.durationHours, 0),
      averageDayHours: validBlocks.reduce((sum, block) => sum + block.durationHours, 0) / DAYS.length,
      classCount: validBlocks.length,
      studyBlocks,
      busiestDay,
      dailyTotals,
    };
  }, [blocks]);

  const updateBlock = (id: number, field: keyof ScheduleBlock, value: string) => {
    setBlocks((current) => current.map((block) => (block.id === id ? { ...block, [field]: value } : block)));
  };

  const addBlock = () => {
    setBlocks((current) => [
      ...current,
      { id: nextScheduleId++, subject: "", day: "Monday", start: "09:00", end: "10:00", type: "class" },
    ]);
  };

  const removeBlock = (id: number) => {
    setBlocks((current) => current.filter((block) => block.id !== id));
  };

  return (
    <StudentToolPageShell
      title="School Schedule Planner"
      seoTitle="School Schedule Planner - Plan Weekly Classes, Labs, And Study Blocks"
      seoDescription="Build a weekly school timetable with class times, lab sessions, and study blocks using this free school schedule planner."
      canonical="https://usonlinetools.com/education/school-schedule-planner"
      heroDescription="Map your week before it becomes chaotic. Add classes, labs, and study blocks to see how many hours your schedule really demands and which day carries the heaviest load."
      heroIcon={<CalendarDays className="w-3.5 h-3.5" />}
      calculatorLabel="Weekly Timetable Planner"
      calculatorDescription="Organize classes and study sessions into a realistic weekly schedule."
      calculator={
        <div className="space-y-5">
          <div className="rounded-2xl border border-indigo-500/15 bg-indigo-500/5 p-5">
            <div className="mb-4 flex items-center gap-2">
              <Clock3 className="h-4 w-4 text-indigo-500" />
              <h3 className="text-lg font-bold text-foreground">Build your weekly schedule</h3>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-[1.7fr_1fr_0.8fr_0.8fr_0.9fr_auto] gap-2 px-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                <span>Subject</span>
                <span>Day</span>
                <span>Start</span>
                <span>End</span>
                <span>Type</span>
                <span />
              </div>

              {blocks.map((block) => (
                <div key={block.id} className="grid grid-cols-[1.7fr_1fr_0.8fr_0.8fr_0.9fr_auto] items-center gap-2">
                  <input
                    type="text"
                    value={block.subject}
                    onChange={(event) => updateBlock(block.id, "subject", event.target.value)}
                    className="tool-calc-input text-sm"
                    placeholder="Subject or block name"
                  />
                  <select value={block.day} onChange={(event) => updateBlock(block.id, "day", event.target.value)} className="tool-calc-input text-sm">
                    {DAYS.map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                  <input type="time" value={block.start} onChange={(event) => updateBlock(block.id, "start", event.target.value)} className="tool-calc-input text-sm" />
                  <input type="time" value={block.end} onChange={(event) => updateBlock(block.id, "end", event.target.value)} className="tool-calc-input text-sm" />
                  <select value={block.type} onChange={(event) => updateBlock(block.id, "type", event.target.value)} className="tool-calc-input text-sm">
                    <option value="class">Class</option>
                    <option value="lab">Lab</option>
                    <option value="study">Study</option>
                  </select>
                  <button
                    onClick={() => removeBlock(block.id)}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-red-500/30 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <button onClick={addBlock} className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-indigo-600 transition-colors hover:text-indigo-700 dark:text-indigo-400">
              <Plus className="h-4 w-4" /> Add schedule block
            </button>
          </div>

          {result ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Weekly Hours</p>
                  <p className="text-2xl font-black text-foreground">{formatPercent(result.totalWeeklyHours, 1)}</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Blocks</p>
                  <p className="text-2xl font-black text-foreground">{result.classCount}</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Study Sessions</p>
                  <p className="text-2xl font-black text-foreground">{result.studyBlocks}</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Busiest Day</p>
                  <p className="text-lg font-black text-indigo-600 dark:text-indigo-400">{result.busiestDay}</p>
                </div>
              </div>

              <div className="rounded-2xl border border-violet-500/15 bg-violet-500/5 p-5">
                <div className="mb-3 flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-violet-500" />
                  <p className="font-bold text-foreground">Daily hour breakdown</p>
                </div>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {DAYS.map((day) => (
                    <div key={day} className="rounded-xl border border-border bg-card p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-bold text-foreground">{day}</p>
                        <p className="text-sm font-semibold text-muted-foreground">{formatHourValue(result.dailyTotals[day])}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  Your schedule averages <span className="font-bold text-foreground">{formatPercent(result.averageDayHours, 1)} hours</span> per day across the full week.
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Enter valid subject names and time ranges to build the schedule summary.</p>
          )}
        </div>
      }
      howToTitle="How to Use the School Schedule Planner"
      howToIntro="A timetable becomes much more useful when it shows both fixed class commitments and the study sessions needed around them."
      howSteps={[
        { title: "Add every class, lab, or study block", description: "Treat the planner like a real weekly map so you can see both mandatory sessions and the revision time you still need to protect." },
        { title: "Enter the correct day and time range", description: "The tool converts each time block into hours, which makes it easier to compare how demanding different days are." },
        { title: "Review the daily totals", description: "Look for overloaded days and move study blocks if one part of the week becomes unrealistic." },
      ]}
      formulaTitle="Schedule Planning Metrics"
      formulaIntro="This planner uses simple time-block math to turn individual sessions into a weekly workload summary."
      formulaCards={[
        { label: "Block Duration", formula: "Duration = End Time - Start Time", detail: "Each class or study session is converted into hours so it can contribute to the daily and weekly totals." },
        { label: "Weekly Hours", formula: "Weekly Hours = sum(All Scheduled Block Durations)", detail: "Adding every class, lab, and study block together gives a realistic view of the weekly commitment." },
      ]}
      examplesTitle="Schedule Planner Examples"
      examplesIntro="These examples show how students often use a timetable planner beyond just recording class times."
      examples={[
        { title: "Lecture Week", value: "14 to 18 hrs", detail: "A standard college or school timetable often starts with class time and then adds a few protected review blocks." },
        { title: "Lab Heavy Day", value: "2 to 4 hrs", detail: "One long lab can make a midweek day much heavier than the rest of the timetable." },
        { title: "Study Balance", value: "3 sessions", detail: "Adding study blocks directly into the schedule helps prevent revision from becoming last-minute work." },
      ]}
      contentTitle="Why Weekly Schedule Planning Helps"
      contentIntro="Students often know what classes they have, but they do not always see how the full week behaves once labs, commute gaps, and review sessions are included."
      contentSections={[
        { title: "Why timetable visibility matters", paragraphs: ["A written weekly plan makes overloaded days obvious before they turn into missed homework, rushed meals, or poor revision habits.", "It also helps you spot lighter days where focused study blocks fit naturally."] },
        { title: "Why study blocks belong in the schedule", paragraphs: ["If study time is not scheduled, it usually gets pushed aside by more urgent tasks. Adding it to the timetable protects time for preparation and review.", "That is especially useful during exam periods or heavy project weeks."] },
        { title: "How to use the busiest-day signal", paragraphs: ["The busiest-day result is not a grade. It is a planning signal that shows where the week may need adjustment.", "If one day becomes much heavier than the rest, consider moving optional work or study blocks to another part of the week."] },
      ]}
      faqs={[
        { q: "Can I use this for both school and college schedules?", a: "Yes. The planner works for any weekly academic timetable that uses fixed sessions and study blocks." },
        { q: "Should I include homework time as study blocks?", a: "Yes. Adding homework or review sessions makes the weekly schedule more realistic than listing classes alone." },
        { q: "What if a block ends before it starts?", a: "The planner treats that as invalid, so make sure the end time is later than the start time." },
        { q: "Does this store my timetable permanently?", a: "No. The planner works in the current browser session and does not save a permanent account-based timetable." },
      ]}
      relatedTools={[
        { title: "Semester Planner Tool", href: "/education/semester-planner-tool", benefit: "Compare timetable hours with your wider semester workload." },
        { title: "Study Planner Calculator", href: "/education/study-planner-calculator", benefit: "Turn course demands into weekly study targets." },
        { title: "Flashcard Timer Tool", href: "/education/flashcard-timer-tool", benefit: "Run timed revision sessions inside the schedule you create." },
      ]}
      quickFacts={[
        { label: "Best For", value: "Weekly Timetables", detail: "Useful for classes, labs, revision blocks, and structured routines." },
        { label: "Core Output", value: "Daily and Weekly Hours", detail: "Shows total hours, busiest day, and study-session count." },
        { label: "Planning Benefit", value: "Load Visibility", detail: "Helps you see overload before the week actually starts." },
      ]}
    />
  );
}
