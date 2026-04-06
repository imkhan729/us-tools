import { useMemo, useState } from "react";
import { BookOpen, Clock3, Target } from "lucide-react";
import StudentToolPageShell from "./StudentToolPageShell";
import { formatPercent } from "./studentGradeUtils";

export default function StudyHoursTracker() {
  const [targetHours, setTargetHours] = useState("60");
  const [completedHours, setCompletedHours] = useState("22");
  const [daysElapsed, setDaysElapsed] = useState("10");
  const [planLengthDays, setPlanLengthDays] = useState("30");

  const result = useMemo(() => {
    const target = parseFloat(targetHours);
    const completed = parseFloat(completedHours);
    const elapsed = parseFloat(daysElapsed);
    const planDays = parseFloat(planLengthDays);

    if (
      !Number.isFinite(target) ||
      !Number.isFinite(completed) ||
      !Number.isFinite(elapsed) ||
      !Number.isFinite(planDays) ||
      target < 0 ||
      completed < 0 ||
      elapsed < 0 ||
      planDays <= 0 ||
      elapsed > planDays
    ) {
      return null;
    }

    const remainingHours = Math.max(0, target - completed);
    const remainingDays = Math.max(0, planDays - elapsed);
    const completionPercent = target === 0 ? 0 : (completed / target) * 100;
    const averagePerDaySoFar = elapsed > 0 ? completed / elapsed : 0;
    const neededPerDay = remainingDays > 0 ? remainingHours / remainingDays : remainingHours;
    const onTrack = remainingHours === 0 || neededPerDay <= Math.max(averagePerDaySoFar, 0.01);

    return {
      remainingHours,
      remainingDays,
      completionPercent,
      averagePerDaySoFar,
      neededPerDay,
      onTrack,
    };
  }, [targetHours, completedHours, daysElapsed, planLengthDays]);

  return (
    <StudentToolPageShell
      title="Study Hours Tracker"
      seoTitle="Study Hours Tracker - Track Progress Against Your Study Goal"
      seoDescription="Track completed study hours, monitor progress against your target, and see how many hours per day you still need with this free study hours tracker."
      canonical="https://usonlinetools.com/education/study-hours-tracker"
      heroDescription="Track your completed study time, compare it with your planned total, and see the daily pace you still need to hit your study target on time."
      heroIcon={<BookOpen className="w-3.5 h-3.5" />}
      calculatorLabel="Study Progress Tracker"
      calculatorDescription="Measure completed hours, progress percentage, and the remaining pace needed to finish on schedule."
      calculator={
        <div className="space-y-5">
          <div className="rounded-2xl border border-indigo-500/15 bg-indigo-500/5 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Clock3 className="w-4 h-4 text-indigo-500" />
              <h3 className="text-lg font-bold text-foreground">Track current study progress</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Target Study Hours</label>
                <input type="number" min="0" value={targetHours} onChange={(event) => setTargetHours(event.target.value)} className="tool-calc-input w-full" placeholder="60" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Completed Hours</label>
                <input type="number" min="0" value={completedHours} onChange={(event) => setCompletedHours(event.target.value)} className="tool-calc-input w-full" placeholder="22" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Days Elapsed</label>
                <input type="number" min="0" value={daysElapsed} onChange={(event) => setDaysElapsed(event.target.value)} className="tool-calc-input w-full" placeholder="10" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Plan Length In Days</label>
                <input type="number" min="1" value={planLengthDays} onChange={(event) => setPlanLengthDays(event.target.value)} className="tool-calc-input w-full" placeholder="30" />
              </div>
            </div>

            {result ? (
              <div className="space-y-4">
                <div className="rounded-2xl border border-indigo-500/20 bg-background p-5 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Completion Progress</p>
                  <p className="text-5xl font-black text-indigo-600 dark:text-indigo-400">{formatPercent(result.completionPercent)}%</p>
                </div>

                <div className="h-3 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-400" style={{ width: `${Math.min(result.completionPercent, 100)}%` }} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="rounded-xl border border-border bg-card p-4 text-center">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Hours Remaining</p>
                    <p className="text-2xl font-black text-foreground">{formatPercent(result.remainingHours)}</p>
                  </div>
                  <div className="rounded-xl border border-border bg-card p-4 text-center">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Days Remaining</p>
                    <p className="text-2xl font-black text-foreground">{formatPercent(result.remainingDays, 0)}</p>
                  </div>
                  <div className="rounded-xl border border-border bg-card p-4 text-center">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Avg Per Day So Far</p>
                    <p className="text-2xl font-black text-foreground">{formatPercent(result.averagePerDaySoFar)}</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Enter valid study hours and a plan length. Days elapsed cannot be greater than total plan days.</p>
            )}
          </div>

          <div className="rounded-2xl border border-violet-500/15 bg-violet-500/5 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-4 h-4 text-violet-500" />
              <h3 className="text-lg font-bold text-foreground">Remaining pace</h3>
            </div>
            {result ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Hours Needed Per Day</p>
                  <p className="text-3xl font-black text-violet-600 dark:text-violet-400">{formatPercent(result.neededPerDay)}</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Status</p>
                  <p className="text-3xl font-black text-foreground">{result.onTrack ? "On Track" : "Behind Pace"}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Fill in the tracker above to see the daily pace you still need.</p>
            )}
          </div>
        </div>
      }
      howToTitle="How to Use the Study Hours Tracker"
      howToIntro="Tracking study time is useful only when it shows whether you are ahead, on pace, or falling behind. This tracker combines a completed-hours log with a remaining-hours planner."
      howSteps={[
        {
          title: "Enter your total study goal",
          description: "Use the total number of hours you want to complete over the full study plan, revision period, or exam-prep window.",
        },
        {
          title: "Enter hours completed and time already used",
          description: "Add the study hours you have actually finished and how many days of the plan have already passed.",
        },
        {
          title: "Use the remaining pace figure",
          description: "The tracker shows how many hours per day you now need to stay on schedule, which is more actionable than just knowing the total left.",
        },
      ]}
      formulaTitle="Study Tracking Formulas"
      formulaIntro="A study-hours tracker is essentially a progress calculator. The important outputs are percentage completed, remaining work, and the pace now required to still finish on time."
      formulaCards={[
        {
          label: "Completion Percentage",
          formula: "Completion % = (Completed Hours / Target Hours) x 100",
          detail: "This shows how much of your total study plan you have already finished.",
        },
        {
          label: "Required Daily Pace",
          formula: "Hours Needed Per Day = Remaining Hours / Remaining Days",
          detail: "This turns the unfinished study load into a daily target you can use immediately.",
        },
      ]}
      examplesTitle="Study Tracker Examples"
      examplesIntro="These are common progress-check scenarios during a revision month or exam-preparation cycle."
      examples={[
        {
          title: "Monthly Goal",
          value: "60 hours",
          detail: "A student planning 60 study hours over a month can check progress at any point and adjust if needed.",
        },
        {
          title: "Progress Check",
          value: "36.7%",
          detail: "Completing 22 of 60 hours means the student has finished 36.7% of the total target.",
        },
        {
          title: "Catch-Up Pace",
          value: "1.9 hrs/day",
          detail: "If 38 hours remain over 20 days, the student needs roughly 1.9 study hours per day from now on.",
        },
      ]}
      contentTitle="Why Tracking Study Hours Matters"
      contentIntro="Students often plan study time optimistically and only realize they are behind when the exam is close. Tracking hours early exposes that gap before it becomes difficult to recover."
      contentSections={[
        {
          title: "Why completed hours are only part of the picture",
          paragraphs: [
            "Logging study time is helpful, but the raw number can be misleading if you do not compare it to the original goal and timeline.",
            "A tracker becomes much more useful when it translates completed hours into progress percentage and remaining pace.",
          ],
        },
        {
          title: "Why average pace matters",
          paragraphs: [
            "Your average hours per day so far reveal whether your plan was realistic. If the new required pace is much higher than your historical average, you may need to revise your goal.",
            "This is especially useful for students balancing school, work, and other obligations because it shows whether the plan still fits real life.",
          ],
        },
        {
          title: "How to make the tracker more accurate",
          paragraphs: [
            "Update completed hours consistently instead of estimating from memory at the end of the week. Frequent updates make the remaining pace more trustworthy.",
            "You can also break the tracker into separate subjects if one course needs much more revision than another.",
          ],
        },
      ]}
      faqs={[
        {
          q: "What does the study hours tracker calculate?",
          a: "It calculates your progress toward a study-hours goal, the hours still remaining, and the average hours per day you need for the rest of the plan.",
        },
        {
          q: "Why do I need both days elapsed and plan length?",
          a: "Because the tracker uses both numbers to estimate how much time is already gone and how many days remain to finish the study target.",
        },
        {
          q: "What if I already finished my target hours?",
          a: "The tracker will show zero remaining hours and a completion percentage of 100% or more, which means your plan is already complete.",
        },
        {
          q: "Should I count passive reading as study hours?",
          a: "You can, but the tracker is more useful when the hours reflect focused revision, practice problems, note review, or other active learning sessions.",
        },
      ]}
      relatedTools={[
        { title: "Study Planner Calculator", href: "/education/study-planner-calculator", benefit: "Turn study targets into a structured daily schedule." },
        { title: "Learning Time Calculator", href: "/education/learning-time-calculator", benefit: "Estimate how long a larger learning goal will take overall." },
        { title: "Exam Countdown Timer", href: "/education/exam-countdown-timer", benefit: "Track how many days remain before the exam deadline." },
      ]}
      quickFacts={[
        { label: "Best For", value: "Progress Tracking", detail: "Useful for revision plans, challenge goals, and monthly study targets." },
        { label: "Core Output", value: "Hours Left", detail: "Also shows completion percentage and the daily hours still required." },
        { label: "Signals", value: "Pace Check", detail: "Helps you spot whether you are on track or already behind." },
      ]}
    />
  );
}
