import { useMemo, useState } from "react";
import { BarChart3, Calculator, Target } from "lucide-react";
import StudentToolPageShell from "./StudentToolPageShell";
import { formatPercent } from "./studentGradeUtils";

function estimateSectionScore(correct: number, total: number) {
  const percentage = total > 0 ? correct / total : 0;
  const rawScaled = 200 + percentage * 600;
  return Math.max(200, Math.min(800, Math.round(rawScaled / 10) * 10));
}

function getPercentileBand(totalScore: number) {
  if (totalScore >= 1550) return "99th percentile estimate";
  if (totalScore >= 1500) return "98th percentile estimate";
  if (totalScore >= 1450) return "96th percentile estimate";
  if (totalScore >= 1400) return "94th percentile estimate";
  if (totalScore >= 1350) return "91st percentile estimate";
  if (totalScore >= 1300) return "87th percentile estimate";
  if (totalScore >= 1250) return "81st percentile estimate";
  if (totalScore >= 1200) return "75th percentile estimate";
  if (totalScore >= 1150) return "68th percentile estimate";
  if (totalScore >= 1100) return "61st percentile estimate";
  if (totalScore >= 1050) return "54th percentile estimate";
  if (totalScore >= 1000) return "47th percentile estimate";
  if (totalScore >= 950) return "40th percentile estimate";
  if (totalScore >= 900) return "32nd percentile estimate";
  if (totalScore >= 850) return "24th percentile estimate";
  return "Below 24th percentile estimate";
}

export default function SatScoreCalculator() {
  const [readingCorrect, setReadingCorrect] = useState("44");
  const [readingTotal, setReadingTotal] = useState("54");
  const [mathCorrect, setMathCorrect] = useState("36");
  const [mathTotal, setMathTotal] = useState("44");

  const result = useMemo(() => {
    const rwCorrect = parseFloat(readingCorrect);
    const rwTotal = parseFloat(readingTotal);
    const mCorrect = parseFloat(mathCorrect);
    const mTotal = parseFloat(mathTotal);

    if (
      !Number.isFinite(rwCorrect) ||
      !Number.isFinite(rwTotal) ||
      !Number.isFinite(mCorrect) ||
      !Number.isFinite(mTotal) ||
      rwTotal <= 0 ||
      mTotal <= 0 ||
      rwCorrect < 0 ||
      mCorrect < 0 ||
      rwCorrect > rwTotal ||
      mCorrect > mTotal
    ) {
      return null;
    }

    const readingScore = estimateSectionScore(rwCorrect, rwTotal);
    const mathScore = estimateSectionScore(mCorrect, mTotal);
    const totalScore = readingScore + mathScore;

    return {
      readingScore,
      mathScore,
      totalScore,
      readingAccuracy: (rwCorrect / rwTotal) * 100,
      mathAccuracy: (mCorrect / mTotal) * 100,
      percentileBand: getPercentileBand(totalScore),
      benchmarkStatus:
        readingScore >= 480 && mathScore >= 530
          ? "Meeting both commonly used college-readiness benchmarks"
          : readingScore >= 480 || mathScore >= 530
            ? "Meeting one benchmark and close on the other"
            : "Below the usual benchmark range",
      combinedAccuracy: ((rwCorrect + mCorrect) / (rwTotal + mTotal)) * 100,
    };
  }, [mathCorrect, mathTotal, readingCorrect, readingTotal]);

  return (
    <StudentToolPageShell
      title="SAT Score Calculator"
      seoTitle="SAT Score Calculator - Estimate Section Scores, Total Score, And Percentile"
      seoDescription="Estimate SAT Reading and Writing, Math, and total scores from section accuracy using this free SAT score calculator."
      canonical="https://usonlinetools.com/education/sat-score-calculator"
      heroDescription="Estimate an SAT-style total score from section accuracy and use the result as a planning guide while practicing. This tool is designed for score estimation, not official score reporting."
      heroIcon={<Target className="w-3.5 h-3.5" />}
      calculatorLabel="SAT Score Estimator"
      calculatorDescription="Turn section accuracy into estimated Reading and Writing, Math, and total SAT scores."
      calculator={
        <div className="space-y-5">
          <div className="rounded-2xl border border-indigo-500/15 bg-indigo-500/5 p-5">
            <div className="mb-4 flex items-center gap-2">
              <Calculator className="h-4 w-4 text-indigo-500" />
              <h3 className="text-lg font-bold text-foreground">Enter section performance</h3>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="mb-4 text-sm font-bold text-foreground">Reading and Writing</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Correct</label>
                    <input type="number" min="0" value={readingCorrect} onChange={(event) => setReadingCorrect(event.target.value)} className="tool-calc-input w-full" placeholder="44" />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Total</label>
                    <input type="number" min="1" value={readingTotal} onChange={(event) => setReadingTotal(event.target.value)} className="tool-calc-input w-full" placeholder="54" />
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-4">
                <p className="mb-4 text-sm font-bold text-foreground">Math</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Correct</label>
                    <input type="number" min="0" value={mathCorrect} onChange={(event) => setMathCorrect(event.target.value)} className="tool-calc-input w-full" placeholder="36" />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Total</label>
                    <input type="number" min="1" value={mathTotal} onChange={(event) => setMathTotal(event.target.value)} className="tool-calc-input w-full" placeholder="44" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {result ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-indigo-500/20 bg-background p-5 text-center">
                  <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Reading and Writing</p>
                  <p className="text-5xl font-black text-indigo-600 dark:text-indigo-400">{result.readingScore}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{formatPercent(result.readingAccuracy, 1)}% correct</p>
                </div>
                <div className="rounded-2xl border border-violet-500/20 bg-background p-5 text-center">
                  <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Math</p>
                  <p className="text-5xl font-black text-violet-600 dark:text-violet-400">{result.mathScore}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{formatPercent(result.mathAccuracy, 1)}% correct</p>
                </div>
                <div className="rounded-2xl border border-emerald-500/20 bg-background p-5 text-center">
                  <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Estimated Total</p>
                  <p className="text-5xl font-black text-emerald-600 dark:text-emerald-400">{result.totalScore}</p>
                  <p className="mt-2 text-sm text-muted-foreground">Range: 400 to 1600</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Percentile Band</p>
                  <p className="text-lg font-black text-foreground">{result.percentileBand}</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Benchmark Check</p>
                  <p className="text-sm font-semibold text-foreground">{result.benchmarkStatus}</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Combined Accuracy</p>
                  <p className="text-2xl font-black text-foreground">{formatPercent(result.combinedAccuracy, 1)}%</p>
                </div>
              </div>

              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
                <div className="mb-2 flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-amber-500" />
                  <p className="font-bold text-foreground">Estimator note</p>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  SAT conversions vary by test form and scoring curve. This page gives a planning estimate based on section accuracy so you can benchmark practice performance, not an official score report.
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Enter valid correct and total counts for both sections to estimate a score.</p>
          )}
        </div>
      }
      howToTitle="How to Use the SAT Score Calculator"
      howToIntro="This tool estimates a likely SAT score from how many questions you answered correctly in each section."
      howSteps={[
        { title: "Enter Reading and Writing correct and total questions", description: "Use the results from a full practice set or a section drill if you want a quick estimate." },
        { title: "Enter Math correct and total questions", description: "The math section estimate is calculated separately so you can see whether the score profile is balanced or uneven." },
        { title: "Use the total as a planning estimate", description: "Treat the result as a practice benchmark rather than an official score because test-form curves vary." },
      ]}
      formulaTitle="SAT Estimate Logic"
      formulaIntro="Official SAT scoring depends on test-form conversion tables, but practice estimates can still be useful when they are based on clear section accuracy inputs."
      formulaCards={[
        { label: "Section Accuracy", formula: "Accuracy = Correct Questions / Total Questions x 100", detail: "Each section starts with a percent-correct measure based on the practice performance you entered." },
        { label: "Estimated Section Score", formula: "Estimated Score = 200 + (Accuracy x 600)", detail: "This estimator maps section accuracy onto the 200 to 800 score scale and rounds to the nearest 10 for a practical benchmark." },
      ]}
      examplesTitle="SAT Score Examples"
      examplesIntro="These examples show how students often use score estimates while preparing."
      examples={[
        { title: "Balanced Practice", value: "1300+", detail: "Strong performance across both sections tends to produce a stable total estimate in the competitive range." },
        { title: "Math-Heavy Profile", value: "Higher Math", detail: "Many students see a clear gap between Math and Reading and Writing scores, which helps guide revision priorities." },
        { title: "Benchmark Check", value: "Section Signals", detail: "Section-level estimates can show whether you are close to common readiness benchmarks even before test day." },
      ]}
      contentTitle="Why SAT Score Estimation Helps"
      contentIntro="Practice performance becomes much easier to manage when you can translate raw section results into a rough score target."
      contentSections={[
        { title: "Why estimates are useful", paragraphs: ["Students often track many practice sets, but raw correct counts are hard to compare unless they are converted into a common score scale.", "An estimate helps you judge whether your preparation trend is moving toward the target range."] },
        { title: "Why estimates are not official", paragraphs: ["Actual SAT forms use score conversion tables that can vary, so no raw-score calculator can promise an exact official result.", "That is why this page is best used for planning and progress tracking rather than final score certainty."] },
        { title: "How to use the section breakdown", paragraphs: ["If one section is clearly lower than the other, you know where study time will produce the biggest gain.", "Balanced preparation usually improves total score more reliably than repeatedly practicing only your strongest area."] },
      ]}
      faqs={[
        { q: "Is this an official SAT score calculator?", a: "No. It is an estimate tool designed for practice planning and score-range tracking." },
        { q: "Why are the section scores rounded?", a: "The SAT uses scaled section scores, so the estimate rounds to the nearest 10 to feel closer to the real scoring format." },
        { q: "Can I use practice-test results here?", a: "Yes. That is the main use case for the estimator." },
        { q: "Why does the tool mention percentiles as estimates?", a: "Percentile standing can change across testing groups and reporting sets, so the page provides an approximate planning band rather than an official ranking." },
      ]}
      relatedTools={[
        { title: "Test Score Analyzer", href: "/education/test-score-analyzer", benefit: "Analyze multiple practice test scores and trends." },
        { title: "Revision Planner Tool", href: "/education/revision-planner-tool", benefit: "Allocate more study weight to weaker SAT sections." },
        { title: "Typing Speed Test", href: "/education/typing-speed-test", benefit: "Improve comfort with timed computer-based work." },
      ]}
      quickFacts={[
        { label: "Best For", value: "Practice Estimation", detail: "Useful for mock tests, drills, and prep milestones." },
        { label: "Core Output", value: "Section and Total Score", detail: "Shows estimated section scores, total score, and an approximate percentile band." },
        { label: "Important Limit", value: "Not Official", detail: "Actual score conversions can vary by test form." },
      ]}
    />
  );
}
