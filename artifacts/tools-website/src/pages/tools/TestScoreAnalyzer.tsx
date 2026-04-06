import { useMemo, useState } from "react";
import { BarChart3, Sigma, Target } from "lucide-react";
import StudentToolPageShell from "./StudentToolPageShell";
import { formatPercent, getLetterGrade } from "./studentGradeUtils";

function parseScores(input: string) {
  return input
    .split(/[\s,]+/)
    .map((part) => parseFloat(part))
    .filter((value) => Number.isFinite(value));
}

export default function TestScoreAnalyzer() {
  const [scoresInput, setScoresInput] = useState("72, 85, 90, 66, 78, 88, 94");
  const [passMark, setPassMark] = useState("60");

  const result = useMemo(() => {
    const scores = parseScores(scoresInput);
    const threshold = parseFloat(passMark);
    if (scores.length === 0 || !Number.isFinite(threshold)) return null;

    const sorted = [...scores].sort((a, b) => a - b);
    const total = sorted.reduce((sum, value) => sum + value, 0);
    const mean = total / sorted.length;
    const median =
      sorted.length % 2 === 1
        ? sorted[Math.floor(sorted.length / 2)]
        : (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2;
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    const range = max - min;
    const variance = sorted.reduce((sum, value) => sum + (value - mean) ** 2, 0) / sorted.length;
    const standardDeviation = Math.sqrt(variance);
    const passing = sorted.filter((value) => value >= threshold).length;
    const passRate = (passing / sorted.length) * 100;
    const gradeBand = getLetterGrade(mean);

    return {
      count: sorted.length,
      mean,
      median,
      min,
      max,
      range,
      standardDeviation,
      passing,
      passRate,
      gradeBand,
    };
  }, [passMark, scoresInput]);

  return (
    <StudentToolPageShell
      title="Test Score Analyzer"
      seoTitle="Test Score Analyzer - Analyze Class Or Practice Test Scores"
      seoDescription="Analyze a list of test scores with average, median, range, standard deviation, and pass rate using this free test score analyzer."
      canonical="https://usonlinetools.com/education/test-score-analyzer"
      heroDescription="Turn a raw list of test scores into useful class or revision statistics. Analyze average, median, spread, pass rate, and score consistency in one place."
      heroIcon={<BarChart3 className="w-3.5 h-3.5" />}
      calculatorLabel="Score Statistics"
      calculatorDescription="Analyze performance trends from a list of test or mock-exam scores."
      calculator={
        <div className="space-y-5">
          <div className="rounded-2xl border border-indigo-500/15 bg-indigo-500/5 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Sigma className="w-4 h-4 text-indigo-500" />
              <h3 className="text-lg font-bold text-foreground">Analyze test scores</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_180px] gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Scores</label>
                <textarea value={scoresInput} onChange={(event) => setScoresInput(event.target.value)} className="tool-calc-input min-h-[150px] w-full resize-y" placeholder="72, 85, 90, 66, 78" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Pass Mark %</label>
                <input type="number" min="0" max="100" value={passMark} onChange={(event) => setPassMark(event.target.value)} className="tool-calc-input w-full" placeholder="60" />
              </div>
            </div>
          </div>

          {result ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-2xl border border-indigo-500/20 bg-background p-5 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Average Score</p>
                  <p className="text-5xl font-black text-indigo-600 dark:text-indigo-400">{formatPercent(result.mean)}%</p>
                </div>
                <div className="rounded-2xl border border-violet-500/20 bg-background p-5 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Median Score</p>
                  <p className="text-5xl font-black text-violet-600 dark:text-violet-400">{formatPercent(result.median)}%</p>
                </div>
                <div className="rounded-2xl border border-cyan-500/20 bg-background p-5 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Pass Rate</p>
                  <p className="text-5xl font-black text-cyan-600 dark:text-cyan-400">{formatPercent(result.passRate)}%</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Lowest</p>
                  <p className="text-2xl font-black text-foreground">{formatPercent(result.min)}%</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Highest</p>
                  <p className="text-2xl font-black text-foreground">{formatPercent(result.max)}%</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Range</p>
                  <p className="text-2xl font-black text-foreground">{formatPercent(result.range)} pts</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Std Dev</p>
                  <p className="text-2xl font-black text-foreground">{formatPercent(result.standardDeviation)}</p>
                </div>
              </div>

              <div className="rounded-2xl border border-violet-500/15 bg-violet-500/5 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-violet-500" />
                  <p className="font-bold text-foreground">Performance summary</p>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  This set contains <span className="font-bold text-foreground">{result.count}</span> scores. Based on the average, the group is currently performing at approximately an{" "}
                  <span className="font-bold text-foreground">{result.gradeBand.grade}</span> level with{" "}
                  <span className="font-bold text-foreground">{result.passing}</span> scores at or above the pass mark.
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Enter at least one valid score and a pass mark to analyze the results.</p>
          )}
        </div>
      }
      howToTitle="How to Use the Test Score Analyzer"
      howToIntro="This tool works for class marks, mock exams, quiz sets, or personal revision scores when you want more than a simple average."
      howSteps={[
        { title: "Paste the score list", description: "Add scores separated by commas, spaces, or line breaks. The analyzer reads all valid numbers automatically." },
        { title: "Set the pass threshold", description: "Choose the score that counts as a pass so the analyzer can calculate pass rate accurately." },
        { title: "Review both average and spread", description: "The mean shows general performance, while range and standard deviation show how tightly clustered or spread out the scores are." },
      ]}
      formulaTitle="Score Analysis Metrics"
      formulaIntro="Good score analysis looks beyond one average and checks how the whole score set behaves."
      formulaCards={[
        { label: "Mean", formula: "Mean = sum(All Scores) / Number Of Scores", detail: "The average score gives the general performance level of the set." },
        { label: "Standard Deviation", formula: "Std Dev = sqrt(Variance)", detail: "This measures how tightly or widely scores are spread around the mean." },
      ]}
      examplesTitle="Test Score Analyzer Examples"
      examplesIntro="These examples show how statistics can make raw score sets more useful."
      examples={[
        { title: "Class Snapshot", value: "Average + Pass Rate", detail: "Teachers and students often first want to know the class average and how many scores cleared the pass threshold." },
        { title: "Score Spread", value: "Range + Std Dev", detail: "A wide spread suggests inconsistent performance, while a small spread suggests more uniform results." },
        { title: "Median Check", value: "Middle Score", detail: "The median helps when one or two very high or very low results distort the average." },
      ]}
      contentTitle="Why Test Score Analysis Matters"
      contentIntro="A single percentage can hide too much. Score analysis helps students and teachers understand not just how well a group performed, but how consistent that performance was."
      contentSections={[
        { title: "Why average alone can mislead", paragraphs: ["A high average does not always mean the group is stable. A few very high scores can lift the mean while weaker results stay hidden.", "That is why median, range, and pass rate are useful alongside the average."] },
        { title: "Why spread changes interpretation", paragraphs: ["Two groups can have the same mean but very different consistency. One might cluster tightly around the average while the other varies dramatically.", "Standard deviation helps reveal whether the results are predictable or widely scattered."] },
        { title: "How students can use this personally", paragraphs: ["You can track your own mock or practice scores over time and see whether performance is not only rising but also becoming more stable.", "That makes the tool useful for revision monitoring, not just classroom analysis."] },
      ]}
      faqs={[
        { q: "What is the difference between mean and median?", a: "The mean is the average of all scores, while the median is the middle score in the ordered list. Median is often more stable when outliers exist." },
        { q: "Why use standard deviation for test scores?", a: "It helps show whether scores are clustered near the average or spread far apart, which changes how the average should be interpreted." },
        { q: "Can I analyze my own mock exam results?", a: "Yes. The tool works for personal score history as well as classroom or group results." },
        { q: "What if I paste scores with commas and line breaks mixed together?", a: "That is fine. The analyzer accepts common separators such as spaces, commas, and new lines." },
      ]}
      relatedTools={[
        { title: "Score Calculator", href: "/education/score-calculator", benefit: "Build the raw score set before analyzing it." },
        { title: "Class Average Calculator", href: "/education/class-average-calculator", benefit: "Review simpler group metrics in a course context." },
        { title: "Exam Score Predictor", href: "/education/exam-score-predictor", benefit: "Estimate where future exam performance could place you overall." },
      ]}
      quickFacts={[
        { label: "Best For", value: "Score Trends", detail: "Useful for classes, mock exams, and personal practice tests." },
        { label: "Core Output", value: "Stats Summary", detail: "Shows mean, median, range, standard deviation, and pass rate." },
        { label: "Key Insight", value: "Spread Matters", detail: "Averages mean more when you also understand score consistency." },
      ]}
    />
  );
}
