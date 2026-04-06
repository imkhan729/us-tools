import { useMemo, useState } from "react";
import { GraduationCap, Percent, Scale, Target } from "lucide-react";
import StudentToolPageShell from "./StudentToolPageShell";
import { formatPercent, getLetterGrade } from "./studentGradeUtils";

type ScaleOption = "4" | "5" | "10" | "custom";

function getScaleValue(option: ScaleOption, customScale: string) {
  if (option === "4") return 4;
  if (option === "5") return 5;
  if (option === "10") return 10;

  const parsed = parseFloat(customScale);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

export default function MarksToGpaConverter() {
  const [marksPercentage, setMarksPercentage] = useState("87.6");
  const [scaleOption, setScaleOption] = useState<ScaleOption>("4");
  const [customScale, setCustomScale] = useState("7");
  const [targetGpa, setTargetGpa] = useState("3.5");

  const scaleValue = getScaleValue(scaleOption, customScale);

  const result = useMemo(() => {
    const percentage = parseFloat(marksPercentage);
    const desiredGpa = parseFloat(targetGpa);

    if (!Number.isFinite(percentage) || percentage < 0 || percentage > 100 || scaleValue === null) {
      return null;
    }

    const convertedGpa = (percentage / 100) * scaleValue;
    const gpaOnFourPointScale = (percentage / 100) * 4;
    const targetPercentage = Number.isFinite(desiredGpa) ? (desiredGpa / scaleValue) * 100 : null;
    const band = getLetterGrade(percentage);

    return {
      convertedGpa,
      gpaOnFourPointScale,
      targetPercentage,
      differenceToTarget: targetPercentage === null ? null : targetPercentage - percentage,
      band,
      scaleValue,
    };
  }, [marksPercentage, scaleValue, targetGpa]);

  return (
    <StudentToolPageShell
      title="Marks to GPA Converter"
      seoTitle="Marks to GPA Converter - Convert Percentage Marks to GPA"
      seoDescription="Convert marks percentage to GPA on 4.0, 5.0, 10.0, or custom scales. Free marks to GPA converter with instant results, grade insight, and target planning."
      canonical="https://usonlinetools.com/education/marks-to-gpa-converter"
      heroDescription="Convert percentage marks to GPA on common academic scales, compare the result with a 4.0 scale equivalent, and estimate the marks percentage needed for a target GPA."
      heroIcon={<GraduationCap className="w-3.5 h-3.5" />}
      calculatorLabel="Marks To GPA"
      calculatorDescription="Convert a percentage score into GPA on a selected scale and estimate the marks needed for a target GPA."
      calculator={
        <div className="space-y-5">
          <div className="rounded-2xl border border-indigo-500/15 bg-indigo-500/5 p-5">
            <div className="mb-4 flex items-center gap-2">
              <Scale className="h-4 w-4 text-indigo-500" />
              <h3 className="text-lg font-bold text-foreground">Convert percentage marks</h3>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Marks Percentage</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={marksPercentage}
                  onChange={(event) => setMarksPercentage(event.target.value)}
                  className="tool-calc-input w-full"
                  placeholder="87.6"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">GPA Scale</label>
                <select value={scaleOption} onChange={(event) => setScaleOption(event.target.value as ScaleOption)} className="tool-calc-input w-full">
                  <option value="4">4.0 scale</option>
                  <option value="5">5.0 scale</option>
                  <option value="10">10.0 scale</option>
                  <option value="custom">Custom scale</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Custom Scale Max</label>
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={customScale}
                  onChange={(event) => setCustomScale(event.target.value)}
                  className="tool-calc-input w-full"
                  placeholder="7"
                  disabled={scaleOption !== "custom"}
                />
              </div>
            </div>

            {result ? (
              <div className="mt-5 space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-indigo-500/20 bg-background p-5 text-center">
                    <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Converted GPA</p>
                    <p className="text-5xl font-black text-indigo-600 dark:text-indigo-400">{formatPercent(result.convertedGpa)}</p>
                    <p className="mt-2 text-sm text-muted-foreground">On a {result.scaleValue.toFixed(result.scaleValue % 1 === 0 ? 1 : 2)} scale</p>
                  </div>
                  <div className="rounded-2xl border border-violet-500/20 bg-background p-5 text-center">
                    <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">4.0 Equivalent</p>
                    <p className="text-5xl font-black text-violet-600 dark:text-violet-400">{formatPercent(result.gpaOnFourPointScale)}</p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {result.band.grade} grade band · {result.band.note}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  <div className="rounded-xl border border-border bg-card p-4 text-center">
                    <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Input Marks</p>
                    <p className="text-2xl font-black text-foreground">{formatPercent(parseFloat(marksPercentage))}%</p>
                  </div>
                  <div className="rounded-xl border border-border bg-card p-4 text-center">
                    <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Letter Grade</p>
                    <p className="text-2xl font-black text-foreground">{result.band.grade}</p>
                  </div>
                  <div className="rounded-xl border border-border bg-card p-4 text-center">
                    <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Scale Used</p>
                    <p className="text-2xl font-black text-foreground">{result.scaleValue}</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">Enter a valid percentage from 0 to 100 and a GPA scale above 0.</p>
            )}
          </div>

          <div className="rounded-2xl border border-violet-500/15 bg-violet-500/5 p-5">
            <div className="mb-3 flex items-center gap-2">
              <Target className="h-4 w-4 text-violet-500" />
              <h3 className="text-lg font-bold text-foreground">Target GPA planner</h3>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_2fr]">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Target GPA</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={targetGpa}
                  onChange={(event) => setTargetGpa(event.target.value)}
                  className="tool-calc-input w-full"
                  placeholder="3.5"
                />
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">Marks needed for target</p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {result && result.targetPercentage !== null
                    ? result.targetPercentage <= 100
                      ? `You need about ${formatPercent(result.targetPercentage)}% marks to reach a GPA of ${formatPercent(parseFloat(targetGpa))} on the selected scale.`
                      : `A GPA of ${formatPercent(parseFloat(targetGpa))} is above the selected scale or would require more than 100% marks.`
                    : "Enter a valid target GPA to estimate the percentage marks needed on this scale."}
                </p>
                {result && result.differenceToTarget !== null && result.targetPercentage !== null && result.targetPercentage <= 100 && (
                  <p className="mt-3 text-sm font-semibold text-foreground">
                    {result.differenceToTarget <= 0
                      ? `You are ahead of the target by ${formatPercent(Math.abs(result.differenceToTarget))} percentage points.`
                      : `You are ${formatPercent(result.differenceToTarget)} percentage points below the target.`}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      }
      howToTitle="How to Use the Marks to GPA Converter"
      howToIntro="Use this converter when you already know your marks percentage but need to express the result as GPA on a 4.0, 5.0, 10.0, or custom academic scale."
      howSteps={[
        {
          title: "Enter your marks percentage",
          description: "Start with a percentage score such as 72%, 87.6%, or 91%. If you only know your raw marks, convert them to a percentage first.",
        },
        {
          title: "Choose the GPA scale your school or application uses",
          description: "Many institutions use a 4.0 scale, but some use 5.0, 10.0, or a custom scale. Select the correct scale before interpreting the result.",
        },
        {
          title: "Use the result as an estimate unless your institution publishes a fixed table",
          description: "Some schools use direct percentage-to-GPA formulas, while others map bands to GPA values. This tool gives a clean scale conversion and letter-grade context for planning.",
        },
      ]}
      formulaTitle="Marks to GPA Formulas"
      formulaIntro="The simplest conversion treats GPA as a scaled version of percentage marks. That produces a quick estimate for common academic applications."
      formulaCards={[
        {
          label: "Basic Conversion",
          formula: "GPA = (Marks % / 100) x GPA Scale",
          detail: "If your marks are 80% and your institution uses a 4.0 scale, the estimated GPA is 3.2.",
        },
        {
          label: "Reverse Conversion",
          formula: "Required Marks % = (Target GPA / GPA Scale) x 100",
          detail: "This helps you work backward from a target GPA to the percentage marks required on the selected scale.",
        },
      ]}
      examplesTitle="Marks to GPA Examples"
      examplesIntro="These examples show how the same percentage can look different depending on the scale being used."
      examples={[
        {
          title: "4.0 Scale",
          value: "3.50 GPA",
          detail: "A marks percentage of 87.5% converts to an estimated 3.5 on a 4.0 scale.",
        },
        {
          title: "5.0 Scale",
          value: "4.38 GPA",
          detail: "The same 87.5% score converts to 4.38 on a 5.0 scale.",
        },
        {
          title: "10.0 Scale",
          value: "8.75 GPA",
          detail: "On a 10.0 scale, the output stays closer to the original percentage value.",
        },
      ]}
      contentTitle="Why Students Convert Marks to GPA"
      contentIntro="Marks percentages and GPA scales are both common ways of reporting performance, but they serve different systems. Converting between them helps with admissions, transcript comparison, and academic planning."
      contentSections={[
        {
          title: "Why percentage and GPA are both used",
          paragraphs: [
            "Schools often issue results as percentages, while universities, scholarship applications, and international evaluations may ask for GPA instead.",
            "A quick conversion helps students compare results across systems without manually recalculating the scale every time.",
          ],
        },
        {
          title: "Why conversions can vary between institutions",
          paragraphs: [
            "Some institutions use a direct formula, while others assign GPA values by grade band. That means two schools can treat the same percentage differently.",
            "Use this tool for clean estimation, but compare the final number with your institution's official transcript policy when precision matters.",
          ],
        },
        {
          title: "When a custom scale is useful",
          paragraphs: [
            "Custom scales are helpful when applications, overseas institutions, or internal grading systems use a nonstandard maximum such as 7.0 or 12.0.",
            "The custom option lets you keep the same workflow without rewriting the calculation manually.",
          ],
        },
      ]}
      faqs={[
        {
          q: "How do I convert marks percentage to GPA?",
          a: "Divide the marks percentage by 100 and multiply by the GPA scale. For example, 85% on a 4.0 scale becomes 3.4.",
        },
        {
          q: "Is this conversion exact for every school?",
          a: "No. Some schools use fixed conversion tables instead of a direct formula. This calculator gives a practical estimate unless your institution publishes different rules.",
        },
        {
          q: "What GPA scale should I choose?",
          a: "Use the same scale requested by your school, transcript evaluator, or application form. The most common options are 4.0, 5.0, and 10.0.",
        },
        {
          q: "Why does the page also show a letter grade?",
          a: "The letter-grade band gives extra context for the percentage so you can see how the score typically reads in a US-style grading system.",
        },
      ]}
      relatedTools={[
        { title: "Marks Percentage Calculator", href: "/education/marks-percentage-calculator", benefit: "Convert raw marks into a percentage before GPA conversion." },
        { title: "GPA Calculator", href: "/education/gpa-calculator", benefit: "Calculate GPA from course grades and credits." },
        { title: "CGPA Calculator", href: "/education/cgpa-calculator", benefit: "Combine semester GPAs into one cumulative result." },
      ]}
      quickFacts={[
        { label: "Best For", value: "Transcript Conversion", detail: "Useful for admissions, applications, and quick academic comparisons." },
        { label: "Core Output", value: "GPA Estimate", detail: "Shows GPA on the selected scale plus a 4.0 equivalent." },
        { label: "Important Note", value: "School Rules Vary", detail: "Always verify your institution's official conversion policy for final reporting." },
      ]}
    />
  );
}
