import { useMemo, useState } from "react";
import { BookOpen, Percent, Target } from "lucide-react";
import StudentToolPageShell from "./StudentToolPageShell";
import { formatPercent } from "./studentGradeUtils";

export default function AttendancePercentageCalculator() {
  const [attended, setAttended] = useState("42");
  const [total, setTotal] = useState("48");
  const [target, setTarget] = useState("90");

  const result = useMemo(() => {
    const attendedClasses = parseFloat(attended);
    const totalClasses = parseFloat(total);
    const targetPercent = parseFloat(target);

    if (!Number.isFinite(attendedClasses) || !Number.isFinite(totalClasses) || totalClasses <= 0 || attendedClasses < 0 || attendedClasses > totalClasses) {
      return null;
    }

    const attendance = (attendedClasses / totalClasses) * 100;
    const missedClasses = totalClasses - attendedClasses;

    let classesNeeded: number | null = null;
    let plannerMessage = "Enter a target attendance to see how many future classes you need to attend in a row.";

    if (Number.isFinite(targetPercent) && targetPercent > 0 && targetPercent < 100) {
      const targetRatio = targetPercent / 100;
      const rawNeeded = (targetRatio * totalClasses - attendedClasses) / (1 - targetRatio);
      classesNeeded = Math.max(0, Math.ceil(rawNeeded));
      plannerMessage =
        classesNeeded === 0
          ? `You are already at or above ${formatPercent(targetPercent)}%.`
          : `Attend the next ${classesNeeded} class${classesNeeded === 1 ? "" : "es"} in a row to reach ${formatPercent(targetPercent)}%.`;
    } else if (targetPercent >= 100) {
      classesNeeded = attendedClasses === totalClasses ? 0 : null;
      plannerMessage = attendedClasses === totalClasses ? "You are currently at 100% attendance." : "A 100% target is no longer possible because you have already missed classes.";
    }

    return {
      attendance,
      missedClasses,
      attendedClasses,
      totalClasses,
      classesNeeded,
      plannerMessage,
    };
  }, [attended, target, total]);

  return (
    <StudentToolPageShell
      title="Attendance Percentage Calculator"
      seoTitle="Attendance Percentage Calculator - Free Class Attendance Tracker"
      seoDescription="Calculate attendance percentage, absences, and the classes you need to attend to reach a target attendance rate. Free online attendance percentage calculator for students."
      canonical="https://usonlinetools.com/education/attendance-percentage-calculator"
      heroDescription="Calculate your class attendance percentage instantly, see how many classes you have missed, and plan how many upcoming classes you need to attend to hit your target attendance."
      heroIcon={<BookOpen className="w-3.5 h-3.5" />}
      calculatorLabel="Attendance Planner"
      calculatorDescription="Track current attendance and estimate what it will take to reach your target."
      calculator={
        <div className="space-y-5">
          <div className="rounded-2xl border border-indigo-500/15 bg-indigo-500/5 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Percent className="w-4 h-4 text-indigo-500" />
              <h3 className="text-lg font-bold text-foreground">Current attendance</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Classes Attended</label>
                <input type="number" min="0" value={attended} onChange={(event) => setAttended(event.target.value)} className="tool-calc-input w-full" placeholder="42" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Total Classes</label>
                <input type="number" min="1" value={total} onChange={(event) => setTotal(event.target.value)} className="tool-calc-input w-full" placeholder="48" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Target Attendance %</label>
                <input type="number" min="1" max="100" value={target} onChange={(event) => setTarget(event.target.value)} className="tool-calc-input w-full" placeholder="90" />
              </div>
            </div>

            {result ? (
              <div className="space-y-4">
                <div className="rounded-2xl border border-indigo-500/20 bg-background p-5 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Attendance Percentage</p>
                  <p className="text-5xl font-black text-indigo-600 dark:text-indigo-400">{formatPercent(result.attendance)}%</p>
                </div>

                <div className="h-3 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-400" style={{ width: `${Math.min(result.attendance, 100)}%` }} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="rounded-xl border border-border bg-card p-4 text-center">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Attended</p>
                    <p className="text-2xl font-black text-foreground">{result.attendedClasses}</p>
                  </div>
                  <div className="rounded-xl border border-border bg-card p-4 text-center">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Missed</p>
                    <p className="text-2xl font-black text-foreground">{result.missedClasses}</p>
                  </div>
                  <div className="rounded-xl border border-border bg-card p-4 text-center">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Attendance Ratio</p>
                    <p className="text-2xl font-black text-foreground">{result.attendedClasses}:{result.totalClasses}</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Enter valid class counts. Attended classes cannot be greater than total classes.</p>
            )}
          </div>

          <div className="rounded-2xl border border-violet-500/15 bg-violet-500/5 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-4 h-4 text-violet-500" />
              <h3 className="text-lg font-bold text-foreground">Target planner</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {result ? result.plannerMessage : "Add your attendance figures above to see a target plan."}
            </p>
            {result && result.classesNeeded !== null && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Classes Needed</p>
                  <p className="text-3xl font-black text-violet-600 dark:text-violet-400">{result.classesNeeded}</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Current Gap To Target</p>
                  <p className="text-3xl font-black text-foreground">{Math.max(0, parseFloat(target || "0") - result.attendance).toFixed(2)}%</p>
                </div>
              </div>
            )}
          </div>
        </div>
      }
      howToTitle="How to Use the Attendance Percentage Calculator"
      howToIntro="This attendance calculator is designed for the two most common student questions: what is my current attendance percentage, and how many classes do I need to attend to hit a required threshold."
      howSteps={[
        {
          title: "Enter attended and total classes",
          description: "Use the number of classes you were present for and the total number of classes held so far. If your school marks labs and lectures separately, calculate each one separately unless the institution combines them.",
        },
        {
          title: "Add your target percentage if your school requires one",
          description: "Many schools require 75%, 80%, or 90% attendance. Enter that requirement to see whether you are already safe or how many future classes you must attend to recover.",
        },
        {
          title: "Read both the current result and the planner",
          description: "The calculator shows your present attendance rate, missed classes, and a target plan. This makes it useful for both academic reporting and day-to-day attendance decisions.",
        },
      ]}
      formulaTitle="Attendance Formulas"
      formulaIntro="Attendance percentage is a simple percentage calculation, but planning back to a target percentage requires a second formula that accounts for future classes."
      formulaCards={[
        {
          label: "Current Attendance",
          formula: "Attendance % = (Classes Attended / Total Classes) x 100",
          detail: "If you attended 42 of 48 classes, your attendance is 87.5%. This is the same formula most school portals use.",
        },
        {
          label: "Classes Needed For A Target",
          formula: "Needed = ceil((Target x Total - Attended) / (1 - Target))",
          detail: "Convert the target to a decimal first. The formula estimates how many future classes you must attend consecutively to reach the threshold.",
        },
      ]}
      examplesTitle="Attendance Examples"
      examplesIntro="These examples cover the scenarios students search for most often: checking a current percentage and figuring out how much recovery is still possible."
      examples={[
        {
          title: "Regular Semester",
          value: "87.5%",
          detail: "Attending 42 out of 48 classes gives you 87.5% attendance, which is already above many 75% or 80% policies.",
        },
        {
          title: "Borderline Case",
          value: "75.0%",
          detail: "Attending 30 of 40 classes leaves very little room for future absences if your school requires 75% minimum attendance.",
        },
        {
          title: "Target Recovery",
          value: "6 classes",
          detail: "If you attended 32 of 40 classes and need 85%, you must attend the next 6 classes in a row to recover to the target.",
        },
      ]}
      contentTitle="What Makes Attendance Percentage Important"
      contentIntro="Attendance percentage affects far more than a simple classroom metric. Many schools, universities, and training programs link attendance directly to eligibility, exam access, and academic standing."
      contentSections={[
        {
          title: "Why students check attendance percentage",
          paragraphs: [
            "Attendance percentage is often used to decide whether a student can sit for exams, remain in good standing, or avoid formal warnings. That is why clear and accurate attendance tracking matters.",
            "A percentage is easier to interpret than raw counts because it shows your attendance relative to all classes held, even if your class schedule changes over time.",
          ],
        },
        {
          title: "When an attendance planner is more useful than a simple calculator",
          paragraphs: [
            "Students usually do not just want to know where they stand right now. They want to know whether they can still recover to a required threshold before the term ends.",
            "A target planner helps you estimate whether a goal like 85% or 90% is still realistic and how disciplined your next few weeks need to be.",
          ],
        },
        {
          title: "Important limitations",
          paragraphs: [
            "Schools do not all count attendance the same way. Some count only scheduled sessions, while others distinguish excused and unexcused absences. Always compare your result with your school's official policy.",
            "This calculator gives an arithmetic estimate. It does not account for institutional rules such as grace attendance, medical exemptions, or attendance weighting across lecture and lab sections.",
          ],
        },
      ]}
      faqs={[
        {
          q: "How do I calculate attendance percentage?",
          a: "Divide the number of classes you attended by the total number of classes held, then multiply by 100. For example, 42 attended classes out of 48 total classes equals 87.5%.",
        },
        {
          q: "What attendance percentage is usually required?",
          a: "Requirements vary by school, but common minimum attendance thresholds are 75%, 80%, and 90%. Always check your institution's official handbook or portal.",
        },
        {
          q: "Can I still reach 100% attendance after missing classes?",
          a: "No. Once you miss a class, your final attendance cannot return to 100% unless the institution excludes that class from the attendance count.",
        },
        {
          q: "Why does the target planner show a large number of classes needed?",
          a: "If your current attendance is well below the target, every future class changes the percentage only a little. That is why recovery becomes harder the later you start fixing attendance.",
        },
      ]}
      relatedTools={[
        { title: "Marks Percentage Calculator", href: "/education/marks-percentage-calculator", benefit: "Convert marks to a clean percentage result." },
        { title: "Percentage Grade Calculator", href: "/education/percentage-grade-calculator", benefit: "Turn a score into a percentage grade and letter grade." },
        { title: "Final Grade Calculator", href: "/education/final-grade-calculator", benefit: "See what score you need on your final exam." },
      ]}
      quickFacts={[
        { label: "Best For", value: "Students", detail: "Useful for schools, colleges, coaching centers, and training programs." },
        { label: "Core Output", value: "Attendance %", detail: "Shows current attendance, missed classes, and target recovery planning." },
        { label: "Works On", value: "Any Device", detail: "Runs in the browser without accounts or downloads." },
      ]}
    />
  );
}
