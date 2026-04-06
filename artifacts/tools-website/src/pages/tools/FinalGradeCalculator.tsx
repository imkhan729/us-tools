import { useMemo, useState } from "react";
import { Calculator, GraduationCap, Target } from "lucide-react";
import StudentToolPageShell from "./StudentToolPageShell";
import { formatPercent, getLetterGrade } from "./studentGradeUtils";

export default function FinalGradeCalculator() {
  const [currentGrade, setCurrentGrade] = useState("84");
  const [targetGrade, setTargetGrade] = useState("90");
  const [finalWeight, setFinalWeight] = useState("30");

  const result = useMemo(() => {
    const current = parseFloat(currentGrade);
    const target = parseFloat(targetGrade);
    const finalExamWeight = parseFloat(finalWeight);

    if (!Number.isFinite(current) || !Number.isFinite(target) || !Number.isFinite(finalExamWeight) || finalExamWeight <= 0 || finalExamWeight >= 100) {
      return null;
    }

    const weightDecimal = finalExamWeight / 100;
    const needed = (target - current * (1 - weightDecimal)) / weightDecimal;
    const boundedGrade = Math.max(0, Math.min(needed, 100));

    return {
      needed,
      boundedGrade,
      achievable: needed <= 100,
      alreadySecured: needed <= 0,
      neededBand: getLetterGrade(boundedGrade),
    };
  }, [currentGrade, finalWeight, targetGrade]);

  return (
    <StudentToolPageShell
      title="Final Grade Calculator"
      seoTitle="Final Grade Calculator - What Score Do I Need On My Final"
      seoDescription="Calculate the final exam score you need to reach your target course grade. Free final grade calculator with instant pass, target, and exam planning results."
      canonical="https://usonlinetools.com/education/final-grade-calculator"
      heroDescription="Find the score you need on your final exam to reach a target course grade. This final grade calculator helps students plan realistic goals before the exam day arrives."
      heroIcon={<GraduationCap className="w-3.5 h-3.5" />}
      calculatorLabel="Final Exam Planner"
      calculatorDescription="Estimate the exam score needed to hit your target course grade."
      calculator={
        <div className="space-y-5">
          <div className="rounded-2xl border border-indigo-500/15 bg-indigo-500/5 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Calculator className="w-4 h-4 text-indigo-500" />
              <h3 className="text-lg font-bold text-foreground">Final exam score needed</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Current Course Grade %</label>
                <input type="number" min="0" max="100" value={currentGrade} onChange={(event) => setCurrentGrade(event.target.value)} className="tool-calc-input w-full" placeholder="84" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Target Course Grade %</label>
                <input type="number" min="0" max="100" value={targetGrade} onChange={(event) => setTargetGrade(event.target.value)} className="tool-calc-input w-full" placeholder="90" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Final Exam Weight %</label>
                <input type="number" min="1" max="99" value={finalWeight} onChange={(event) => setFinalWeight(event.target.value)} className="tool-calc-input w-full" placeholder="30" />
              </div>
            </div>

            {result ? (
              <div className="space-y-4">
                <div className="rounded-2xl border border-indigo-500/20 bg-background p-5 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Required Final Exam Score</p>
                  <p className={`text-5xl font-black ${result.alreadySecured ? "text-emerald-600 dark:text-emerald-400" : result.achievable ? "text-indigo-600 dark:text-indigo-400" : "text-red-600 dark:text-red-400"}`}>
                    {result.alreadySecured ? "0%" : result.achievable ? `${formatPercent(result.needed)}%` : ">100%"}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="rounded-xl border border-border bg-card p-4 text-center">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Current Grade</p>
                    <p className="text-2xl font-black text-foreground">{formatPercent(parseFloat(currentGrade), 0)}%</p>
                  </div>
                  <div className="rounded-xl border border-border bg-card p-4 text-center">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Target Grade</p>
                    <p className="text-2xl font-black text-foreground">{formatPercent(parseFloat(targetGrade), 0)}%</p>
                  </div>
                  <div className="rounded-xl border border-border bg-card p-4 text-center">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Final Weight</p>
                    <p className="text-2xl font-black text-foreground">{formatPercent(parseFloat(finalWeight), 0)}%</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Enter valid percentages. The final exam weight must be between 1% and 99%.</p>
            )}
          </div>

          <div className="rounded-2xl border border-violet-500/15 bg-violet-500/5 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-4 h-4 text-violet-500" />
              <h3 className="text-lg font-bold text-foreground">Interpretation</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {result
                ? result.alreadySecured
                  ? `You have already secured your target grade. Even scoring 0% on the final would still leave you at or above ${formatPercent(parseFloat(targetGrade), 0)}%.`
                  : result.achievable
                    ? `You need about ${formatPercent(result.needed)}% on the final, which is roughly a ${result.neededBand.grade} performance on a typical letter-grade scale.`
                    : `Your target is mathematically out of reach with the current grade and final weight. You would need more than 100% on the final.`
                : "Enter your course grade details to see whether your target is realistic."}
            </p>
          </div>
        </div>
      }
      howToTitle="How to Use the Final Grade Calculator"
      howToIntro="Final grade calculators are useful when you know your current standing in a course but need to understand what final-exam performance would get you to a target result."
      howSteps={[
        {
          title: "Enter your current course grade",
          description: "Use the current weighted grade shown in your course portal or syllabus tracker. This should represent your performance before the final exam is added.",
        },
        {
          title: "Add your target and the final exam weight",
          description: "Enter the final course grade you want, then the percentage weight of the final exam. The exam weight matters because it determines how much the final can move the overall result.",
        },
        {
          title: "Use the result to set a realistic exam goal",
          description: "If the required score is over 100%, your goal is mathematically impossible under the current assumptions. If the score is low or zero, you may already be safe.",
        },
      ]}
      formulaTitle="Final Grade Formula"
      formulaIntro="The required final-exam score comes from solving a weighted average equation. This lets you work backward from your desired course result."
      formulaCards={[
        {
          label: "Weighted Final Formula",
          formula: "Target = Current x (1 - Final Weight) + Final x Final Weight",
          detail: "This equation combines your current course grade and your final exam performance according to the final's weight in the course.",
        },
        {
          label: "Solve For Final",
          formula: "Final = (Target - Current x (1 - Weight)) / Weight",
          detail: "This rearranged version gives the exam score you need. Use the exam weight as a decimal, such as 0.30 for a 30% final.",
        },
      ]}
      examplesTitle="Final Grade Examples"
      examplesIntro="These examples show why final-exam planning is one of the most common academic calculator use cases."
      examples={[
        {
          title: "Reach An A-",
          value: "97.3%",
          detail: "If your current grade is 84%, your target is 90%, and the final counts 30%, you need about 97.3% on the final.",
        },
        {
          title: "Already Safe",
          value: "0%",
          detail: "If your current grade is high and the final weight is small, you may already have enough points to secure the target.",
        },
        {
          title: "Unreachable Goal",
          value: ">100%",
          detail: "A required score above 100% means the target is impossible unless the grading system includes extra credit or another adjustment.",
        },
      ]}
      contentTitle="Why Final Grade Planning Matters"
      contentIntro="Students search for final grade calculators because uncertainty before a major exam can be high. A clear target helps convert vague stress into a concrete study objective."
      contentSections={[
        {
          title: "Why backward planning helps",
          paragraphs: [
            "Knowing the exact score needed on a final exam can make study planning more focused. Instead of guessing whether you need a good exam or an exceptional one, you get a precise target.",
            "That clarity helps with time allocation, revision priorities, and deciding whether your course target is realistic.",
          ],
        },
        {
          title: "What makes a target realistic",
          paragraphs: [
            "A required score in the 60% to 80% range is often manageable for students who are already performing steadily. A target in the high 90s usually means there is very little room for mistakes.",
            "If the calculator shows a score above 100%, the issue is usually not effort but arithmetic: the course structure no longer leaves enough remaining weight to reach the goal.",
          ],
        },
        {
          title: "Important assumptions",
          paragraphs: [
            "This calculator assumes your current grade is accurate and that the final exam is the only remaining graded component. If homework, projects, or participation are still pending, use a weighted grade calculator instead.",
            "Always match the result against your syllabus and instructor policy, especially if the course includes curving, drops, or extra credit.",
          ],
        },
      ]}
      faqs={[
        {
          q: "How do I calculate what I need on my final?",
          a: "Use your current course grade, your target course grade, and the weight of the final exam. The calculator solves the weighted average formula to find the required score.",
        },
        {
          q: "What does it mean if I need more than 100%?",
          a: "It means your target is mathematically impossible under the current assumptions. You would need extra credit, a grading curve, or a different target.",
        },
        {
          q: "What if the calculator says I need 0%?",
          a: "That means you have already secured your target grade. Even a zero on the final would not pull your overall course grade below the target threshold.",
        },
        {
          q: "Can I use this if other assignments are still left?",
          a: "Only if your current grade already accounts for those assignments. Otherwise, a weighted grade calculator will be more accurate.",
        },
      ]}
      relatedTools={[
        { title: "Weighted Grade Calculator", href: "/education/weighted-grade-calculator", benefit: "Build your current course grade from all graded components." },
        { title: "Percentage Grade Calculator", href: "/education/percentage-grade-calculator", benefit: "Convert the required score into a letter-grade estimate." },
        { title: "Attendance Percentage Calculator", href: "/education/attendance-percentage-calculator", benefit: "Track class attendance requirements alongside grade planning." },
      ]}
      quickFacts={[
        { label: "Best For", value: "Exam Planning", detail: "Useful before finals, end-of-term tests, and major weighted assessments." },
        { label: "Core Output", value: "Needed Score", detail: "Shows whether your target is achievable, already secured, or impossible." },
        { label: "Important Note", value: "Needs Accurate Inputs", detail: "Current grade and final weight must match the course syllabus." },
      ]}
    />
  );
}
