import { useMemo, useState } from "react";
import { Calculator, GraduationCap, Plus, Trash2 } from "lucide-react";
import StudentToolPageShell from "./StudentToolPageShell";
import { formatPercent } from "./studentGradeUtils";

interface ScoreItem {
  id: number;
  name: string;
  earned: string;
  total: string;
}

let nextScoreItemId = 4;

export default function ScoreCalculator() {
  const [items, setItems] = useState<ScoreItem[]>([
    { id: 1, name: "Quiz 1", earned: "18", total: "20" },
    { id: 2, name: "Assignment", earned: "42", total: "50" },
    { id: 3, name: "Midterm", earned: "74", total: "100" },
  ]);

  const result = useMemo(() => {
    const valid = items.filter((item) => item.earned !== "" && item.total !== "");
    if (valid.length === 0) return null;

    let totalEarned = 0;
    let totalPossible = 0;

    for (const item of valid) {
      const earned = parseFloat(item.earned);
      const total = parseFloat(item.total);
      if (!Number.isFinite(earned) || !Number.isFinite(total) || total <= 0 || earned < 0) return null;
      totalEarned += earned;
      totalPossible += total;
    }

    return {
      totalEarned,
      totalPossible,
      percentage: (totalEarned / totalPossible) * 100,
      completedItems: valid.length,
    };
  }, [items]);

  const updateItem = (id: number, field: keyof ScoreItem, value: string) => {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const addItem = () => {
    setItems((current) => [...current, { id: nextScoreItemId++, name: "", earned: "", total: "" }]);
  };

  const removeItem = (id: number) => {
    setItems((current) => current.filter((item) => item.id !== id));
  };

  return (
    <StudentToolPageShell
      title="Score Calculator"
      seoTitle="Score Calculator - Add Total Scores Across Assessments"
      seoDescription="Calculate total earned score, total possible score, and overall percentage across multiple quizzes, assignments, or tests with this free score calculator."
      canonical="https://usonlinetools.com/education/score-calculator"
      heroDescription="Add multiple assessment scores together, calculate the total points earned, total points possible, and overall percentage, and keep a simple running score summary for any course."
      heroIcon={<GraduationCap className="w-3.5 h-3.5" />}
      calculatorLabel="Multi-Assessment Score"
      calculatorDescription="Track earned and total points across quizzes, assignments, tests, or projects."
      calculator={
        <div className="space-y-5">
          <div className="rounded-2xl border border-indigo-500/15 bg-indigo-500/5 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Calculator className="w-4 h-4 text-indigo-500" />
              <h3 className="text-lg font-bold text-foreground">Assessment score table</h3>
            </div>

            <div className="overflow-x-auto">
              <div className="min-w-[620px]">
                <div className="grid grid-cols-[2fr_1fr_1fr_auto] gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground px-1 mb-2">
                  <span>Assessment</span>
                  <span>Earned</span>
                  <span>Total</span>
                  <span />
                </div>

                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.id} className="grid grid-cols-[2fr_1fr_1fr_auto] gap-2 items-center">
                      <input type="text" value={item.name} onChange={(event) => updateItem(item.id, "name", event.target.value)} className="tool-calc-input text-sm" placeholder="Assessment name" />
                      <input type="number" value={item.earned} onChange={(event) => updateItem(item.id, "earned", event.target.value)} className="tool-calc-input text-sm text-center" placeholder="18" min="0" />
                      <input type="number" value={item.total} onChange={(event) => updateItem(item.id, "total", event.target.value)} className="tool-calc-input text-sm text-center" placeholder="20" min="1" />
                      <button onClick={() => removeItem(item.id)} className="w-10 h-10 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-red-500 hover:border-red-500/30 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button onClick={addItem} className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition-colors">
              <Plus className="w-4 h-4" /> Add assessment
            </button>
          </div>

          {result ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-indigo-500/20 bg-background p-5 text-center">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Overall Percentage</p>
                <p className="text-5xl font-black text-indigo-600 dark:text-indigo-400">{formatPercent(result.percentage)}%</p>
              </div>
              <div className="rounded-2xl border border-violet-500/20 bg-background p-5 text-center">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Total Score</p>
                <p className="text-5xl font-black text-violet-600 dark:text-violet-400">{formatPercent(result.totalEarned)} / {formatPercent(result.totalPossible)}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Enter at least one valid earned and total score pair.</p>
          )}
        </div>
      }
      howToTitle="How to Use the Score Calculator"
      howToIntro="This score calculator is useful when you want a simple total across multiple assessments without dealing with weighting rules."
      howSteps={[
        {
          title: "Enter each assessment separately",
          description: "Add quizzes, tests, assignments, or projects as separate rows. For each one, enter the earned score and the total possible score.",
        },
        {
          title: "Use the total percentage for a running summary",
          description: "The calculator adds all earned points and all possible points, then converts the combined result into a percentage.",
        },
        {
          title: "Use a weighted calculator only when the course requires weights",
          description: "If the syllabus says some assessments count more than others, use a weighted grade calculator instead of a simple score total.",
        },
      ]}
      formulaTitle="Score Calculator Formula"
      formulaIntro="A score calculator combines points across multiple assessments and converts the result into one overall percentage."
      formulaCards={[
        {
          label: "Total Earned Points",
          formula: "Total Earned = sum(All Earned Scores)",
          detail: "Add together the points you earned from every quiz, test, assignment, or project.",
        },
        {
          label: "Overall Percentage",
          formula: "Percentage = (Total Earned / Total Possible) x 100",
          detail: "After totaling earned and possible points, convert the combined score into a percentage for easier interpretation.",
        },
      ]}
      examplesTitle="Score Calculator Examples"
      examplesIntro="These examples show where a simple score calculator is more useful than either a single-test calculator or a weighted grade tool."
      examples={[
        {
          title: "Three Assessments",
          value: "134 / 170",
          detail: "Combining 18/20, 42/50, and 74/100 gives 134 out of 170 total points.",
        },
        {
          title: "Overall Result",
          value: "78.8%",
          detail: "That same total converts to 78.8%, which gives a clearer picture than separate raw scores alone.",
        },
        {
          title: "Best Fit",
          value: "Simple totals",
          detail: "Use this calculator when all scores contribute through points, not through custom course weights.",
        },
      ]}
      contentTitle="When A Score Calculator Is The Right Tool"
      contentIntro="A score calculator is ideal when you want a straightforward combined result from several assessments without applying grade weights or letter-grade rules."
      contentSections={[
        {
          title: "Why score totals are useful",
          paragraphs: [
            "Some teachers and courses effectively use point accumulation, where every earned point contributes to the final result. In that case, adding total earned and total possible points is the correct method.",
            "This approach is especially practical for progress checks during a semester or study program.",
          ],
        },
        {
          title: "How score total differs from weighted grade",
          paragraphs: [
            "A score calculator treats each point equally. A weighted grade calculator treats each assessment according to a predefined percentage of the course.",
            "If the syllabus gives different importance to different assessments, a weighted method is more accurate.",
          ],
        },
        {
          title: "Common mistake to avoid",
          paragraphs: [
            "Do not average percentages from different assessments unless they all have the same total or the same weight. Total points give a more accurate combined score when assessment sizes differ.",
            "For example, 9/10 and 45/100 should not be averaged as two equal percentages if you want a true combined score.",
          ],
        },
      ]}
      faqs={[
        {
          q: "How do I calculate total score percentage?",
          a: "Add all earned scores together, add all possible scores together, and divide total earned by total possible. Multiply by 100 to get the overall percentage.",
        },
        {
          q: "When should I use a score calculator instead of a weighted grade calculator?",
          a: "Use a score calculator when your course is based on total points. Use a weighted grade calculator when each assessment has an official course weight.",
        },
        {
          q: "Can I calculate quiz and assignment scores together?",
          a: "Yes, as long as you want a combined points-based total and the course does not apply separate percentage weights to those categories.",
        },
        {
          q: "Why not just average the percentages?",
          a: "Averaging percentages can be misleading when assessments have different total points. Total earned versus total possible is more accurate for points-based grading.",
        },
      ]}
      relatedTools={[
        { title: "Class Average Calculator", href: "/education/class-average-calculator", benefit: "Analyze a group of scores once you have totals or percentages." },
        { title: "Weighted Grade Calculator", href: "/education/weighted-grade-calculator", benefit: "Use this if assessments have different course weights." },
        { title: "Final Grade Calculator", href: "/education/final-grade-calculator", benefit: "Estimate the score still needed after your current total." },
      ]}
      quickFacts={[
        { label: "Best For", value: "Point Totals", detail: "Useful for quizzes, tests, assignments, and mixed assessment sets." },
        { label: "Core Output", value: "Overall %", detail: "Shows total earned points, total possible points, and combined percentage." },
        { label: "Use Another Tool When", value: "Weights Apply", detail: "Weighted courses need a weighted grade calculator instead." },
      ]}
    />
  );
}
