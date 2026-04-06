import { useMemo, useState } from "react";
import { BarChart3, GraduationCap, Target } from "lucide-react";
import StudentToolPageShell from "./StudentToolPageShell";
import { formatPercent } from "./studentGradeUtils";

function parseScores(input: string) {
  return input
    .split(/[\s,]+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => Number(item))
    .filter((value) => Number.isFinite(value));
}

export default function ClassAverageCalculator() {
  const [scores, setScores] = useState("78, 84, 91, 66, 88, 73, 95, 81");
  const [passMark, setPassMark] = useState("60");

  const result = useMemo(() => {
    const values = parseScores(scores);
    const passing = parseFloat(passMark);
    if (values.length === 0) return null;

    const total = values.reduce((sum, value) => sum + value, 0);
    const average = total / values.length;
    const highest = Math.max(...values);
    const lowest = Math.min(...values);
    const passCount = values.filter((value) => value >= passing).length;

    return {
      count: values.length,
      average,
      highest,
      lowest,
      passCount,
      passRate: (passCount / values.length) * 100,
    };
  }, [passMark, scores]);

  return (
    <StudentToolPageShell
      title="Class Average Calculator"
      seoTitle="Class Average Calculator - Calculate Group Score Averages"
      seoDescription="Calculate class average from a list of student scores. Find the average, highest score, lowest score, and pass rate with this free class average calculator."
      canonical="https://usonlinetools.com/education/class-average-calculator"
      heroDescription="Calculate the average score for a class or group, see the highest and lowest results, and estimate pass rate from a simple list of student marks."
      heroIcon={<GraduationCap className="w-3.5 h-3.5" />}
      calculatorLabel="Group Score Average"
      calculatorDescription="Paste or type student scores separated by commas, spaces, or new lines."
      calculator={
        <div className="space-y-5">
          <div className="rounded-2xl border border-indigo-500/15 bg-indigo-500/5 p-5">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-4 h-4 text-indigo-500" />
              <h3 className="text-lg font-bold text-foreground">Class score list</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Scores</label>
                <textarea value={scores} onChange={(event) => setScores(event.target.value)} className="tool-calc-input min-h-[140px] w-full" placeholder="78, 84, 91, 66" />
              </div>
              <div className="max-w-xs">
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Pass Mark</label>
                <input type="number" min="0" max="100" value={passMark} onChange={(event) => setPassMark(event.target.value)} className="tool-calc-input w-full" placeholder="60" />
              </div>
            </div>
          </div>

          {result ? (
            <div className="space-y-4">
              <div className="rounded-2xl border border-indigo-500/20 bg-background p-5 text-center">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Class Average</p>
                <p className="text-5xl font-black text-indigo-600 dark:text-indigo-400">{formatPercent(result.average)}%</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Students</p>
                  <p className="text-2xl font-black text-foreground">{result.count}</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Highest</p>
                  <p className="text-2xl font-black text-foreground">{formatPercent(result.highest)}%</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Lowest</p>
                  <p className="text-2xl font-black text-foreground">{formatPercent(result.lowest)}%</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Pass Rate</p>
                  <p className="text-2xl font-black text-foreground">{formatPercent(result.passRate)}%</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Add at least one valid numeric score to calculate the class average.</p>
          )}

          <div className="rounded-2xl border border-violet-500/15 bg-violet-500/5 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-4 h-4 text-violet-500" />
              <h3 className="text-lg font-bold text-foreground">Helpful note</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              This tool works well for teacher summaries, study groups, and student self-checks. Separate scores with commas, spaces, or line breaks.
            </p>
          </div>
        </div>
      }
      howToTitle="How to Use the Class Average Calculator"
      howToIntro="This calculator is built for any situation where you need to summarize a group's scores quickly, whether that group is a classroom, a study circle, or a project team."
      howSteps={[
        {
          title: "Paste the list of scores",
          description: "Enter scores separated by commas, spaces, or line breaks. The calculator reads any clean numeric list and ignores the separators.",
        },
        {
          title: "Set a pass mark if you want pass-rate insight",
          description: "If your class uses a threshold like 40%, 50%, or 60%, enter it so the calculator can estimate how many students passed.",
        },
        {
          title: "Use the summary to interpret class performance",
          description: "The result gives you the class average plus supporting details like student count, highest score, lowest score, and pass rate.",
        },
      ]}
      formulaTitle="Class Average Formulas"
      formulaIntro="Class averages are based on simple descriptive statistics, but those few numbers can quickly reveal how a group performed overall."
      formulaCards={[
        {
          label: "Average Score",
          formula: "Average = Sum Of All Scores / Number Of Scores",
          detail: "Add every student score together and divide by the number of students in the list.",
        },
        {
          label: "Pass Rate",
          formula: "Pass Rate = (Students At Or Above Pass Mark / Total Students) x 100",
          detail: "This shows what share of the class met the selected threshold, which is often useful for quick performance summaries.",
        },
      ]}
      examplesTitle="Class Average Examples"
      examplesIntro="These examples show how class-average summaries help interpret a score list more clearly than raw marks alone."
      examples={[
        {
          title: "Balanced Class",
          value: "82.0%",
          detail: "A class average near the low 80s often indicates generally strong performance with room for improvement in weaker areas.",
        },
        {
          title: "Wide Spread",
          value: "95 to 52",
          detail: "A large gap between the highest and lowest score may point to uneven preparation or different support needs.",
        },
        {
          title: "Pass Rate",
          value: "87.5%",
          detail: "Pass rate quickly shows whether most students cleared the threshold even if the class average looks only moderate.",
        },
      ]}
      contentTitle="Why Class Average Matters"
      contentIntro="The class average is one of the fastest ways to summarize a group's performance, but it is most useful when read alongside other numbers like pass rate and score spread."
      contentSections={[
        {
          title: "Why average alone is not enough",
          paragraphs: [
            "A class average can hide variation. Two classes might both average 75%, but one could be tightly grouped while the other has a few very high and very low scores.",
            "That is why supporting numbers like highest score, lowest score, and pass rate are useful context.",
          ],
        },
        {
          title: "When class average is useful",
          paragraphs: [
            "Teachers and tutors can use class average to spot whether an exam was too hard, too easy, or broadly on target. Students can use it to understand how their own score compares with the group.",
            "It is also useful for study groups that want a quick summary of mock test results or practice quiz outcomes.",
          ],
        },
        {
          title: "How to avoid misleading input",
          paragraphs: [
            "Make sure all scores are on the same scale before averaging them. Mixing raw marks out of 50 with percentages out of 100 will distort the result.",
            "If assessments use different totals, convert them to percentages first or use a score calculator that tracks earned and total marks together.",
          ],
        },
      ]}
      faqs={[
        {
          q: "How do I calculate class average?",
          a: "Add all student scores together and divide by the number of scores. That gives the mean average for the class.",
        },
        {
          q: "What is the difference between class average and pass rate?",
          a: "Class average shows the mean score of the group. Pass rate shows what percentage of students reached or exceeded a chosen pass threshold.",
        },
        {
          q: "Can I paste scores on separate lines?",
          a: "Yes. This calculator accepts commas, spaces, and line breaks, so you can paste a score list in the format you already have.",
        },
        {
          q: "Should I average raw marks or percentages?",
          a: "Use the same scale for every entry. If different students have scores from assessments with different totals, convert them first before averaging.",
        },
      ]}
      relatedTools={[
        { title: "Score Calculator", href: "/education/score-calculator", benefit: "Add earned and total marks across multiple assessments." },
        { title: "Marks Percentage Calculator", href: "/education/marks-percentage-calculator", benefit: "Convert a raw score to percentage before averaging." },
        { title: "Weighted Grade Calculator", href: "/education/weighted-grade-calculator", benefit: "Calculate course grades when assessments have different weights." },
      ]}
      quickFacts={[
        { label: "Best For", value: "Group Results", detail: "Useful for classes, study groups, and teacher summaries." },
        { label: "Core Output", value: "Mean Score", detail: "Also shows student count, highest, lowest, and pass rate." },
        { label: "Input Style", value: "Flexible List", detail: "Accepts commas, spaces, and line breaks." },
      ]}
    />
  );
}
