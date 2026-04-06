import { useMemo, useState } from "react";
import { Clock, GraduationCap, Plus, Trash2 } from "lucide-react";
import StudentToolPageShell from "./StudentToolPageShell";
import { formatPercent } from "./studentGradeUtils";

interface HomeworkTask {
  id: number;
  name: string;
  minutes: string;
}

let nextHomeworkTaskId = 4;

function addMinutesToTime(startTime: string, minutesToAdd: number) {
  const [hours, minutes] = startTime.split(":").map(Number);
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return "";
  const total = hours * 60 + minutes + minutesToAdd;
  const normalized = ((total % (24 * 60)) + (24 * 60)) % (24 * 60);
  const outHours = Math.floor(normalized / 60).toString().padStart(2, "0");
  const outMinutes = (normalized % 60).toString().padStart(2, "0");
  return `${outHours}:${outMinutes}`;
}

export default function HomeworkTimeCalculator() {
  const [tasks, setTasks] = useState<HomeworkTask[]>([
    { id: 1, name: "Math worksheet", minutes: "35" },
    { id: 2, name: "Science reading", minutes: "25" },
    { id: 3, name: "Essay draft", minutes: "50" },
  ]);
  const [startTime, setStartTime] = useState("16:00");
  const [breakMinutes, setBreakMinutes] = useState("5");

  const result = useMemo(() => {
    const valid = tasks.filter((task) => task.minutes !== "");
    if (valid.length === 0) return null;

    const totalTaskMinutes = valid.reduce((sum, task) => {
      const minutes = parseFloat(task.minutes);
      return Number.isFinite(minutes) && minutes >= 0 ? sum + minutes : sum;
    }, 0);

    const breakTime = Math.max(0, parseFloat(breakMinutes) || 0);
    const totalBreakMinutes = Math.max(0, valid.length - 1) * breakTime;
    const totalMinutes = totalTaskMinutes + totalBreakMinutes;
    const finishTime = addMinutesToTime(startTime, totalMinutes);

    return {
      taskCount: valid.length,
      totalTaskMinutes,
      totalBreakMinutes,
      totalMinutes,
      pomodoros: Math.ceil(totalTaskMinutes / 25),
      finishTime,
    };
  }, [breakMinutes, startTime, tasks]);

  const updateTask = (id: number, field: keyof HomeworkTask, value: string) => {
    setTasks((current) => current.map((task) => (task.id === id ? { ...task, [field]: value } : task)));
  };

  const addTask = () => {
    setTasks((current) => [...current, { id: nextHomeworkTaskId++, name: "", minutes: "" }]);
  };

  const removeTask = (id: number) => {
    setTasks((current) => current.filter((task) => task.id !== id));
  };

  return (
    <StudentToolPageShell
      title="Homework Time Calculator"
      seoTitle="Homework Time Calculator - Estimate Total Homework Time"
      seoDescription="Estimate how long your homework will take with this free homework time calculator. Add tasks, break times, and a start time to plan your evening schedule."
      canonical="https://usonlinetools.com/education/homework-time-calculator"
      heroDescription="Estimate how long homework will take, include breaks between tasks, and see an expected finish time so you can plan study sessions more realistically."
      heroIcon={<GraduationCap className="w-3.5 h-3.5" />}
      calculatorLabel="Homework Schedule"
      calculatorDescription="Add homework tasks with estimated minutes and get a realistic time total."
      calculator={
        <div className="space-y-5">
          <div className="rounded-2xl border border-indigo-500/15 bg-indigo-500/5 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-indigo-500" />
              <h3 className="text-lg font-bold text-foreground">Homework tasks</h3>
            </div>

            <div className="overflow-x-auto">
              <div className="min-w-[560px]">
                <div className="grid grid-cols-[2fr_1fr_auto] gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground px-1 mb-2">
                  <span>Task</span>
                  <span>Minutes</span>
                  <span />
                </div>
                <div className="space-y-2">
                  {tasks.map((task) => (
                    <div key={task.id} className="grid grid-cols-[2fr_1fr_auto] gap-2 items-center">
                      <input type="text" value={task.name} onChange={(event) => updateTask(task.id, "name", event.target.value)} className="tool-calc-input text-sm" placeholder="Homework task" />
                      <input type="number" value={task.minutes} onChange={(event) => updateTask(task.id, "minutes", event.target.value)} className="tool-calc-input text-sm text-center" placeholder="30" min="0" />
                      <button onClick={() => removeTask(task.id)} className="w-10 h-10 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-red-500 hover:border-red-500/30 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button onClick={addTask} className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition-colors">
              <Plus className="w-4 h-4" /> Add task
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Start Time</label>
                <input type="time" value={startTime} onChange={(event) => setStartTime(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Break Between Tasks (min)</label>
                <input type="number" min="0" value={breakMinutes} onChange={(event) => setBreakMinutes(event.target.value)} className="tool-calc-input w-full" placeholder="5" />
              </div>
            </div>
          </div>

          {result ? (
            <div className="space-y-4">
              <div className="rounded-2xl border border-indigo-500/20 bg-background p-5 text-center">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Total Homework Time</p>
                <p className="text-5xl font-black text-indigo-600 dark:text-indigo-400">{formatPercent(result.totalMinutes, 0)} min</p>
                <p className="text-sm text-muted-foreground mt-2">Estimated finish time: {result.finishTime || "--:--"}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Tasks</p>
                  <p className="text-2xl font-black text-foreground">{result.taskCount}</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Study Time</p>
                  <p className="text-2xl font-black text-foreground">{formatPercent(result.totalTaskMinutes, 0)} min</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Break Time</p>
                  <p className="text-2xl font-black text-foreground">{formatPercent(result.totalBreakMinutes, 0)} min</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Pomodoro Blocks</p>
                  <p className="text-2xl font-black text-foreground">{result.pomodoros}</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Add at least one task with a time estimate to calculate homework duration.</p>
          )}
        </div>
      }
      howToTitle="How to Use the Homework Time Calculator"
      howToIntro="Homework feels unpredictable when students estimate everything mentally. This calculator turns homework tasks into a clearer total with optional breaks and a realistic finish time."
      howSteps={[
        {
          title: "List each homework task separately",
          description: "Add homework tasks one by one, such as reading, worksheets, problem sets, or writing assignments, then estimate how many minutes each task will take.",
        },
        {
          title: "Include breaks and start time",
          description: "Short breaks matter when planning an evening schedule. Add a break length and start time to estimate when you will actually finish.",
        },
        {
          title: "Use the total to plan your night",
          description: "The result helps you decide when to start, whether the workload fits your evening, and whether tasks should be split across multiple days.",
        },
      ]}
      formulaTitle="Homework Time Formulas"
      formulaIntro="Homework planning works best when task time and break time are handled separately, then combined into a full schedule estimate."
      formulaCards={[
        {
          label: "Total Task Time",
          formula: "Task Time = sum(All Task Minutes)",
          detail: "This is the time spent actively working on homework tasks without breaks.",
        },
        {
          label: "Full Schedule Time",
          formula: "Total Time = Task Time + Break Time",
          detail: "Break time is added between tasks so the overall plan reflects a more realistic after-school workload.",
        },
      ]}
      examplesTitle="Homework Time Examples"
      examplesIntro="These examples show why homework often takes longer than students expect once breaks and multiple task types are included."
      examples={[
        {
          title: "Three Tasks",
          value: "110 min",
          detail: "A worksheet, reading, and writing task can easily add up to nearly two hours of active work.",
        },
        {
          title: "With Breaks",
          value: "120 min",
          detail: "Adding two 5-minute breaks turns 110 minutes of work into 120 minutes of scheduled time.",
        },
        {
          title: "Pomodoro View",
          value: "5 blocks",
          detail: "Breaking the work into five 25-minute blocks can make a heavy homework load feel more manageable.",
        },
      ]}
      contentTitle="Why Homework Time Is Often Misjudged"
      contentIntro="Students often underestimate homework because they focus only on the first task, not the full chain of reading, writing, problem-solving, and break time across the evening."
      contentSections={[
        {
          title: "Why task-level estimates help",
          paragraphs: [
            "A homework list feels vague until each task has its own time estimate. Breaking work into pieces makes the plan easier to trust and easier to improve over time.",
            "It also helps students and parents see whether the issue is one long task or many medium-size tasks adding up.",
          ],
        },
        {
          title: "Why break time matters",
          paragraphs: [
            "Breaks are part of a realistic schedule. Ignoring them can make a homework plan look shorter than it really is, especially when there are several task switches.",
            "A short pause between tasks often improves focus and makes the full workload more sustainable.",
          ],
        },
        {
          title: "Using finish time to plan evenings",
          paragraphs: [
            "An estimated finish time is useful for deciding whether homework fits before dinner, sports practice, tutoring, or bedtime.",
            "If the finish time is too late, that is a signal to start earlier, shorten breaks, or move part of the work to another day.",
          ],
        },
      ]}
      faqs={[
        {
          q: "How do I estimate homework time?",
          a: "List each task, estimate how many minutes each one will take, add optional break time, and total everything together.",
        },
        {
          q: "Why does homework usually take longer than expected?",
          a: "Students often forget transitions, breaks, reading time, and the mental reset required between different subjects. Those extra minutes add up quickly.",
        },
        {
          q: "Should I include breaks in my homework plan?",
          a: "Yes. A realistic homework plan usually includes short breaks, especially when multiple tasks are scheduled back to back.",
        },
        {
          q: "Can this help with after-school planning?",
          a: "Yes. The finish-time estimate helps students and families plan evenings around homework, meals, activities, and sleep.",
        },
      ]}
      relatedTools={[
        { title: "Study Planner Calculator", href: "/education/study-planner-calculator", benefit: "Build a bigger revision plan beyond daily homework." },
        { title: "Reading Speed Calculator", href: "/education/reading-speed-calculator", benefit: "Estimate reading-heavy homework more accurately." },
        { title: "Score Calculator", href: "/education/score-calculator", benefit: "Track assignment scores once the homework is completed." },
      ]}
      quickFacts={[
        { label: "Best For", value: "Evening Planning", detail: "Useful for homework scheduling after school or college." },
        { label: "Core Output", value: "Total Minutes", detail: "Also shows break time, finish time, and pomodoro estimate." },
        { label: "Key Reminder", value: "Estimate Honestly", detail: "More realistic task times make the schedule far more useful." },
      ]}
    />
  );
}
