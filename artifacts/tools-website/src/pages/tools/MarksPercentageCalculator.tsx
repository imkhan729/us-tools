import { useMemo, useState } from "react";
import { BookOpen, Calculator, Target } from "lucide-react";
import StudentToolPageShell from "./StudentToolPageShell";
import { formatPercent } from "./studentGradeUtils";

export default function MarksPercentageCalculator() {
  const [obtained, setObtained] = useState("438");
  const [total, setTotal] = useState("500");
  const [target, setTarget] = useState("60");

  const result = useMemo(() => {
    const earned = parseFloat(obtained);
    const possible = parseFloat(total);
    const targetPercent = parseFloat(target);

    if (!Number.isFinite(earned) || !Number.isFinite(possible) || possible <= 0 || earned < 0 || earned > possible) {
      return null;
    }

    const percentage = (earned / possible) * 100;
    const remainingMarks = possible - earned;
    const requiredForTarget = Number.isFinite(targetPercent) ? (targetPercent / 100) * possible : null;
    const additionalNeeded = requiredForTarget === null ? null : Math.max(0, requiredForTarget - earned);

    return {
      percentage,
      earned,
      possible,
      remainingMarks,
      requiredForTarget,
      additionalNeeded,
      targetPercent,
    };
  }, [obtained, target, total]);

  return (
    <StudentToolPageShell
      title="Marks Percentage Calculator"
      seoTitle="Marks Percentage Calculator - Convert Marks To Percentage"
      seoDescription="Convert obtained marks to percentage instantly. Calculate exam percentage, target marks, and remaining marks with this free online marks percentage calculator."
      canonical="https://usonlinetools.com/education/marks-percentage-calculator"
      heroDescription="Convert obtained marks to a percentage in seconds, check how many marks you still need for a target score, and understand the exact relationship between earned marks and total marks."
      heroIcon={<BookOpen className="w-3.5 h-3.5" />}
      calculatorLabel="Marks To Percentage"
      calculatorDescription="Find your exam percentage and target marks from a simple score pair."
      calculator={
        <div className="space-y-5">
          <div className="rounded-2xl border border-indigo-500/15 bg-indigo-500/5 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Calculator className="w-4 h-4 text-indigo-500" />
              <h3 className="text-lg font-bold text-foreground">Convert marks to percentage</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Obtained Marks</label>
                <input type="number" min="0" value={obtained} onChange={(event) => setObtained(event.target.value)} className="tool-calc-input w-full" placeholder="438" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Total Marks</label>
                <input type="number" min="1" value={total} onChange={(event) => setTotal(event.target.value)} className="tool-calc-input w-full" placeholder="500" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Target Percentage</label>
                <input type="number" min="1" max="100" value={target} onChange={(event) => setTarget(event.target.value)} className="tool-calc-input w-full" placeholder="60" />
              </div>
            </div>

            {result ? (
              <div className="space-y-4">
                <div className="rounded-2xl border border-indigo-500/20 bg-background p-5 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Marks Percentage</p>
                  <p className="text-5xl font-black text-indigo-600 dark:text-indigo-400">{formatPercent(result.percentage)}%</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="rounded-xl border border-border bg-card p-4 text-center">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Obtained</p>
                    <p className="text-2xl font-black text-foreground">{result.earned}</p>
                  </div>
                  <div className="rounded-xl border border-border bg-card p-4 text-center">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Total</p>
                    <p className="text-2xl font-black text-foreground">{result.possible}</p>
                  </div>
                  <div className="rounded-xl border border-border bg-card p-4 text-center">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Remaining</p>
                    <p className="text-2xl font-black text-foreground">{result.remainingMarks}</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Enter valid marks. Obtained marks cannot be greater than the total marks.</p>
            )}
          </div>

          <div className="rounded-2xl border border-violet-500/15 bg-violet-500/5 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-4 h-4 text-violet-500" />
              <h3 className="text-lg font-bold text-foreground">Target marks planner</h3>
            </div>
            {result && result.requiredForTarget !== null ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Marks Needed For {formatPercent(result.targetPercent, 0)}%</p>
                  <p className="text-3xl font-black text-violet-600 dark:text-violet-400">{formatPercent(result.requiredForTarget)}</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Additional Marks Needed</p>
                  <p className="text-3xl font-black text-foreground">{formatPercent(result.additionalNeeded ?? 0)}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Add a target percentage to calculate the marks needed.</p>
            )}
          </div>
        </div>
      }
      howToTitle="How to Use the Marks Percentage Calculator"
      howToIntro="The marks percentage formula is simple, but students often need more than a raw percentage. This page also helps estimate target marks for a pass requirement or a higher score goal."
      howSteps={[
        {
          title: "Enter obtained marks",
          description: "Use the exact marks you earned in the test, exam, assignment, or subject. If your result is a combined score, enter the combined total you achieved.",
        },
        {
          title: "Enter the maximum possible marks",
          description: "This is the highest score available for the same exam or subject. The calculator needs the full total to convert your score into a percentage accurately.",
        },
        {
          title: "Check your percentage and target marks",
          description: "The result section gives your marks percentage instantly. If you enter a target percentage, the planner also shows the marks required to reach that level.",
        },
      ]}
      formulaTitle="Marks Percentage Formulas"
      formulaIntro="Marks percentage is one of the most searched academic calculations because schools, colleges, and job applications often ask for a score in percentage terms."
      formulaCards={[
        {
          label: "Marks To Percentage",
          formula: "Percentage = (Obtained Marks / Total Marks) x 100",
          detail: "This converts a raw score into a percentage scale. If you score 438 out of 500, the result is 87.6%.",
        },
        {
          label: "Marks Needed For A Target",
          formula: "Required Marks = (Target % / 100) x Total Marks",
          detail: "Use this formula to estimate how many marks correspond to a target percentage such as 60%, 75%, or 90%.",
        },
      ]}
      examplesTitle="Marks Percentage Examples"
      examplesIntro="These examples reflect typical student use cases across school, university, and entrance-exam preparation."
      examples={[
        {
          title: "Board Exam Score",
          value: "87.6%",
          detail: "Scoring 438 out of 500 converts to 87.6%, which is often reported as 88% when rounded to the nearest whole number.",
        },
        {
          title: "Pass Requirement",
          value: "240 marks",
          detail: "If the total is 400 and the passing percentage is 60%, you need 240 marks to meet the requirement.",
        },
        {
          title: "College Admission",
          value: "72.5%",
          detail: "A score of 145 out of 200 equals 72.5%, which can be compared more easily against cutoffs and admission criteria.",
        },
      ]}
      contentTitle="Why Marks Percentage Matters"
      contentIntro="Percentage format makes exam and subject scores easier to compare across different total marks. That is why schools and universities rely on percentages for transcripts, cutoffs, and performance summaries."
      contentSections={[
        {
          title: "Why marks are often converted to percentages",
          paragraphs: [
            "A raw score like 73 out of 80 looks strong, but it is not easy to compare against 438 out of 500 until both are converted to percentages. Percentage format creates a common scale.",
            "Percentages are also useful for admission forms, scholarship criteria, merit lists, and employer screening when institutions use different mark totals.",
          ],
        },
        {
          title: "When rounding can change interpretation",
          paragraphs: [
            "Some institutions round 87.6% to 88%, while others keep one or two decimal places. Always check whether your school rounds percentages before assigning grades or divisions.",
            "When percentages are close to a threshold such as 59.5% or 89.5%, rounding policy can affect pass status, grade bands, or distinctions.",
          ],
        },
        {
          title: "Marks percentage versus grade percentage",
          paragraphs: [
            "Marks percentage is purely arithmetic: obtained marks compared to total marks. Grade percentage goes a step further and maps that score to grade bands such as A, B, or C.",
            "If you need both a score percentage and a letter grade, use the related percentage grade calculator after computing your marks percentage.",
          ],
        },
      ]}
      faqs={[
        {
          q: "How do I calculate percentage from marks?",
          a: "Divide the obtained marks by the total marks, then multiply by 100. For example, 438 divided by 500 times 100 equals 87.6%.",
        },
        {
          q: "Can obtained marks be higher than total marks?",
          a: "No. If obtained marks are higher than total marks, either the total is wrong or you may be mixing two different scoring systems.",
        },
        {
          q: "Why use percentages instead of raw marks?",
          a: "Percentages make scores comparable across exams with different totals. A percentage is easier to interpret for cutoffs, grades, and performance reporting.",
        },
        {
          q: "Does this calculator round percentages automatically?",
          a: "The calculator shows a precise percentage up to two decimal places for clarity. You can round manually based on your institution's rules.",
        },
      ]}
      relatedTools={[
        { title: "Percentage Grade Calculator", href: "/education/percentage-grade-calculator", benefit: "Turn a score percentage into a letter grade and GPA value." },
        { title: "Attendance Percentage Calculator", href: "/education/attendance-percentage-calculator", benefit: "Track class attendance and target recovery." },
        { title: "Weighted Grade Calculator", href: "/education/weighted-grade-calculator", benefit: "Calculate assignment-based course grades." },
      ]}
      quickFacts={[
        { label: "Best For", value: "Exam Scores", detail: "Useful for tests, board exams, subject totals, and report cards." },
        { label: "Core Output", value: "Score %", detail: "Also estimates marks required for a target percentage." },
        { label: "Use Case", value: "Admissions", detail: "Helps compare academic scores across different total marks." },
      ]}
    />
  );
}
