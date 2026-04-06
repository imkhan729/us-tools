import { useMemo, useState } from "react";
import { GraduationCap, Percent, Target } from "lucide-react";
import StudentToolPageShell from "./StudentToolPageShell";
import { formatPercent, getLetterGrade, LETTER_GRADE_SCALE } from "./studentGradeUtils";

export default function PercentageGradeCalculator() {
  const [score, setScore] = useState("87");
  const [total, setTotal] = useState("100");
  const [passMark, setPassMark] = useState("60");

  const result = useMemo(() => {
    const earned = parseFloat(score);
    const possible = parseFloat(total);
    const passing = parseFloat(passMark);

    if (!Number.isFinite(earned) || !Number.isFinite(possible) || possible <= 0 || earned < 0 || earned > possible) {
      return null;
    }

    const percentage = (earned / possible) * 100;
    const band = getLetterGrade(percentage);
    const nextBand = [...LETTER_GRADE_SCALE].reverse().find((item) => item.min > percentage);
    const marksNeededForNextBand = nextBand ? Math.max(0, Math.ceil((nextBand.min / 100) * possible - earned)) : 0;

    return {
      percentage,
      band,
      passing,
      passed: percentage >= passing,
      nextBand,
      marksNeededForNextBand,
    };
  }, [passMark, score, total]);

  return (
    <StudentToolPageShell
      title="Percentage Grade Calculator"
      seoTitle="Percentage Grade Calculator - Score To Letter Grade Converter"
      seoDescription="Calculate percentage grade from marks and convert it to a letter grade with GPA value. Free percentage grade calculator for tests, assignments, and exams."
      canonical="https://usonlinetools.com/education/percentage-grade-calculator"
      heroDescription="Convert a test score or assignment score into a percentage grade, letter grade, GPA equivalent, and pass or fail result in one clear student-friendly calculator."
      heroIcon={<GraduationCap className="w-3.5 h-3.5" />}
      calculatorLabel="Percentage To Grade"
      calculatorDescription="Calculate score percentage, letter grade, GPA equivalent, and pass status."
      calculator={
        <div className="space-y-5">
          <div className="rounded-2xl border border-indigo-500/15 bg-indigo-500/5 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Percent className="w-4 h-4 text-indigo-500" />
              <h3 className="text-lg font-bold text-foreground">Score to percentage grade</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Score</label>
                <input type="number" min="0" value={score} onChange={(event) => setScore(event.target.value)} className="tool-calc-input w-full" placeholder="87" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Total</label>
                <input type="number" min="1" value={total} onChange={(event) => setTotal(event.target.value)} className="tool-calc-input w-full" placeholder="100" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Pass Mark %</label>
                <input type="number" min="0" max="100" value={passMark} onChange={(event) => setPassMark(event.target.value)} className="tool-calc-input w-full" placeholder="60" />
              </div>
            </div>

            {result ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-indigo-500/20 bg-background p-5 text-center">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Percentage Grade</p>
                    <p className="text-5xl font-black text-indigo-600 dark:text-indigo-400">{formatPercent(result.percentage)}%</p>
                  </div>
                  <div className="rounded-2xl border border-violet-500/20 bg-background p-5 text-center">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Letter Grade</p>
                    <p className="text-5xl font-black text-violet-600 dark:text-violet-400">{result.band.grade}</p>
                    <p className="text-sm text-muted-foreground mt-2">GPA {result.band.gpa.toFixed(1)} · {result.band.note}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="rounded-xl border border-border bg-card p-4 text-center">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Pass / Fail</p>
                    <p className="text-2xl font-black text-foreground">{result.passed ? "Pass" : "Fail"}</p>
                  </div>
                  <div className="rounded-xl border border-border bg-card p-4 text-center">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Pass Mark</p>
                    <p className="text-2xl font-black text-foreground">{formatPercent(result.passing, 0)}%</p>
                  </div>
                  <div className="rounded-xl border border-border bg-card p-4 text-center">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Next Grade Gap</p>
                    <p className="text-2xl font-black text-foreground">{result.nextBand ? `${result.marksNeededForNextBand} marks` : "Top band"}</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Enter a valid score and total. Score cannot be greater than the total.</p>
            )}
          </div>

          <div className="rounded-2xl border border-violet-500/15 bg-violet-500/5 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-4 h-4 text-violet-500" />
              <h3 className="text-lg font-bold text-foreground">Grade improvement insight</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {result?.nextBand
                ? `You need ${result.marksNeededForNextBand} more mark${result.marksNeededForNextBand === 1 ? "" : "s"} to reach ${result.nextBand.grade} on this score scale.`
                : "You are already in the highest grade band used by this calculator."}
            </p>
          </div>
        </div>
      }
      howToTitle="How to Use the Percentage Grade Calculator"
      howToIntro="Use this page when you want more than a raw percentage. It converts a score into a percentage grade, then maps that percentage to a letter grade and GPA value."
      howSteps={[
        {
          title: "Enter your earned score and the maximum score",
          description: "For example, if you scored 87 out of 100 or 44 out of 50, use those exact values. The calculator converts them into the percentage scale automatically.",
        },
        {
          title: "Set a passing threshold if needed",
          description: "Different schools and programs use different passing marks. If your institution uses 50%, 60%, or another threshold, set that number so the result matches your context.",
        },
        {
          title: "Use the grade conversion carefully",
          description: "This tool uses a common US-style letter grade scale. If your school uses a custom policy, compare the percentage first and then verify the official conversion rule.",
        },
      ]}
      formulaTitle="Percentage Grade Formulas"
      formulaIntro="Grade conversion starts with the same percentage formula used in basic math, then applies a grading scale to interpret the result."
      formulaCards={[
        {
          label: "Percentage Grade",
          formula: "Percentage = (Score / Total) x 100",
          detail: "This converts a raw score to a standard percentage. A score of 44 out of 50 becomes 88%.",
        },
        {
          label: "Letter Grade Mapping",
          formula: "Grade = band that contains the percentage",
          detail: "Once the percentage is known, the score is mapped to a grade band such as A, B, C, or F. Institutions may use different cutoffs, so always verify local policy.",
        },
      ]}
      examplesTitle="Percentage Grade Examples"
      examplesIntro="These examples show why students often need both the raw percentage and the converted grade label."
      examples={[
        {
          title: "Quiz Result",
          value: "88% = B+",
          detail: "A score of 44 out of 50 converts to 88%, which typically maps to a B+ on a common US grading scale.",
        },
        {
          title: "Strong Final Exam",
          value: "94% = A",
          detail: "A score of 94 out of 100 falls into the A range and usually corresponds to a 4.0 GPA value.",
        },
        {
          title: "Near Pass",
          value: "59% = F",
          detail: "A score below a 60% pass mark is commonly treated as failing, even when it feels close to a passing threshold.",
        },
      ]}
      contentTitle="How Percentage Grades Are Used"
      contentIntro="Percentage grade calculators are useful because many institutions report both raw scores and converted grade labels. Students need both formats for applications, planning, and performance tracking."
      contentSections={[
        {
          title: "Why percentage and grade both matter",
          paragraphs: [
            "A percentage gives precise performance detail, while a letter grade provides a familiar summary. Both are useful because a single grade band can include a wide range of percentages.",
            "For example, two students may both receive a B, but one could be at 83% and another at 89%. The percentage gives the finer distinction.",
          ],
        },
        {
          title: "Why grade scales vary",
          paragraphs: [
            "Not every school uses the same grade bands. Some systems treat 90% as an A-, while others treat it as an A. Some international systems use distinctions instead of letter grades.",
            "This calculator uses a clear and common default scale for quick estimates, but official transcripts should always follow your institution's published grading policy.",
          ],
        },
        {
          title: "When a grade improvement estimate helps",
          paragraphs: [
            "Students often want to know not just their current grade, but how close they are to the next grade band. That can help with decisions about retakes, extra credit, or study priorities.",
            "A small mark gap near a grade boundary can be much easier to close than students assume, especially on high-total assignments or exams.",
          ],
        },
      ]}
      faqs={[
        {
          q: "How do I convert marks to a percentage grade?",
          a: "Divide your score by the total possible score and multiply by 100. Then compare the percentage to your institution's grade scale to find the letter grade.",
        },
        {
          q: "Is the grade scale the same at every school?",
          a: "No. This calculator uses a common default scale, but many schools and countries use different cutoffs. Always verify the official policy when precision matters.",
        },
        {
          q: "What is the difference between percentage grade and marks percentage?",
          a: "Marks percentage is the raw percentage from score over total. Percentage grade usually includes an interpretation layer such as letter grade, GPA, or pass/fail status.",
        },
        {
          q: "Can I use this for college and school exams?",
          a: "Yes, as long as you treat the letter-grade output as a practical estimate unless you know your institution uses the same grade scale.",
        },
      ]}
      relatedTools={[
        { title: "Marks Percentage Calculator", href: "/education/marks-percentage-calculator", benefit: "Calculate percentage from raw marks only." },
        { title: "Weighted Grade Calculator", href: "/education/weighted-grade-calculator", benefit: "Combine quizzes, homework, and exams into one course grade." },
        { title: "Final Grade Calculator", href: "/education/final-grade-calculator", benefit: "Estimate the score needed to reach your target grade." },
      ]}
      quickFacts={[
        { label: "Best For", value: "Tests & Exams", detail: "Useful for quizzes, assignments, finals, and report-card planning." },
        { label: "Core Output", value: "Grade + GPA", detail: "Shows percentage, letter grade, GPA value, and pass/fail status." },
        { label: "Important Note", value: "Scale Varies", detail: "Always compare the final grade band with your institution's official policy." },
      ]}
    />
  );
}
