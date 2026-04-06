import { useMemo, useState } from "react";
import { BookOpen, Calculator, PiggyBank } from "lucide-react";
import StudentToolPageShell from "./StudentToolPageShell";
import { formatPercent } from "./studentGradeUtils";

export default function ScholarshipCalculator() {
  const [annualTuition, setAnnualTuition] = useState("18000");
  const [scholarshipPercent, setScholarshipPercent] = useState("35");
  const [extraAid, setExtraAid] = useState("1500");
  const [years, setYears] = useState("4");

  const result = useMemo(() => {
    const tuition = parseFloat(annualTuition);
    const scholarship = parseFloat(scholarshipPercent);
    const grantAid = parseFloat(extraAid);
    const studyYears = parseFloat(years);

    if (
      !Number.isFinite(tuition) ||
      !Number.isFinite(scholarship) ||
      !Number.isFinite(grantAid) ||
      !Number.isFinite(studyYears) ||
      tuition < 0 ||
      scholarship < 0 ||
      scholarship > 100 ||
      grantAid < 0 ||
      studyYears <= 0
    ) {
      return null;
    }

    const scholarshipAmount = (scholarship / 100) * tuition;
    const totalAidPerYear = scholarshipAmount + grantAid;
    const netTuitionPerYear = Math.max(0, tuition - totalAidPerYear);
    const totalSavings = totalAidPerYear * studyYears;
    const netProgramTuition = netTuitionPerYear * studyYears;

    return {
      scholarshipAmount,
      totalAidPerYear,
      netTuitionPerYear,
      totalSavings,
      netProgramTuition,
    };
  }, [annualTuition, scholarshipPercent, extraAid, years]);

  return (
    <StudentToolPageShell
      title="Scholarship Calculator"
      seoTitle="Scholarship Calculator - Estimate Tuition Savings"
      seoDescription="Estimate annual and total tuition savings from scholarships and extra aid with this free online scholarship calculator."
      canonical="https://usonlinetools.com/education/scholarship-calculator"
      heroDescription="Estimate how much a scholarship could reduce your tuition bill per year and across your full degree, including extra grant or aid amounts."
      heroIcon={<BookOpen className="w-3.5 h-3.5" />}
      calculatorLabel="Tuition Savings Estimator"
      calculatorDescription="Calculate yearly scholarship value, total aid, and the net tuition still left to pay."
      calculator={
        <div className="space-y-5">
          <div className="rounded-2xl border border-indigo-500/15 bg-indigo-500/5 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Calculator className="w-4 h-4 text-indigo-500" />
              <h3 className="text-lg font-bold text-foreground">Estimate scholarship savings</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Annual Tuition</label>
                <input type="number" min="0" value={annualTuition} onChange={(event) => setAnnualTuition(event.target.value)} className="tool-calc-input w-full" placeholder="18000" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Scholarship Percentage</label>
                <input type="number" min="0" max="100" value={scholarshipPercent} onChange={(event) => setScholarshipPercent(event.target.value)} className="tool-calc-input w-full" placeholder="35" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Extra Aid Per Year</label>
                <input type="number" min="0" value={extraAid} onChange={(event) => setExtraAid(event.target.value)} className="tool-calc-input w-full" placeholder="1500" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Years Of Study</label>
                <input type="number" min="1" value={years} onChange={(event) => setYears(event.target.value)} className="tool-calc-input w-full" placeholder="4" />
              </div>
            </div>

            {result ? (
              <div className="space-y-4">
                <div className="rounded-2xl border border-indigo-500/20 bg-background p-5 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Total Aid Per Year</p>
                  <p className="text-5xl font-black text-indigo-600 dark:text-indigo-400">${formatPercent(result.totalAidPerYear)}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="rounded-xl border border-border bg-card p-4 text-center">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Scholarship Value</p>
                    <p className="text-2xl font-black text-foreground">${formatPercent(result.scholarshipAmount)}</p>
                  </div>
                  <div className="rounded-xl border border-border bg-card p-4 text-center">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Net Tuition / Year</p>
                    <p className="text-2xl font-black text-foreground">${formatPercent(result.netTuitionPerYear)}</p>
                  </div>
                  <div className="rounded-xl border border-border bg-card p-4 text-center">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Program Savings</p>
                    <p className="text-2xl font-black text-foreground">${formatPercent(result.totalSavings)}</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Enter valid tuition, scholarship, aid, and study years.</p>
            )}
          </div>

          <div className="rounded-2xl border border-violet-500/15 bg-violet-500/5 p-5">
            <div className="flex items-center gap-2 mb-3">
              <PiggyBank className="w-4 h-4 text-violet-500" />
              <h3 className="text-lg font-bold text-foreground">Degree-level view</h3>
            </div>
            {result ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Total Savings Over Program</p>
                  <p className="text-3xl font-black text-violet-600 dark:text-violet-400">${formatPercent(result.totalSavings)}</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Net Tuition Over Program</p>
                  <p className="text-3xl font-black text-foreground">${formatPercent(result.netProgramTuition)}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Add your tuition and scholarship figures to estimate full-program savings.</p>
            )}
          </div>
        </div>
      }
      howToTitle="How to Use the Scholarship Calculator"
      howToIntro="Scholarship offers are easier to understand when you convert them from percentages and award letters into actual annual and multi-year tuition savings."
      howSteps={[
        {
          title: "Enter the annual tuition amount",
          description: "Use the yearly tuition for the school or program you are evaluating. If you are comparing options, calculate each school separately.",
        },
        {
          title: "Enter the scholarship percentage and any extra aid",
          description: "Use the published scholarship percentage and add any fixed grant or aid amount you expect each year.",
        },
        {
          title: "Check yearly and full-program savings",
          description: "The calculator shows how much aid applies each year and how much tuition remains over the entire degree period.",
        },
      ]}
      formulaTitle="Scholarship Formulas"
      formulaIntro="Scholarship offers can look generous in percentage form, but students usually need to know the actual dollar impact on tuition."
      formulaCards={[
        {
          label: "Scholarship Amount",
          formula: "Scholarship Value = Annual Tuition x Scholarship %",
          detail: "A 35% scholarship on $18,000 tuition reduces the tuition bill by $6,300 per year before any extra aid is added.",
        },
        {
          label: "Net Tuition",
          formula: "Net Tuition = Annual Tuition - Scholarship Amount - Extra Aid",
          detail: "This reveals the tuition still left to pay each year after all listed aid is applied.",
        },
      ]}
      examplesTitle="Scholarship Examples"
      examplesIntro="These examples reflect the kinds of comparisons students make when reviewing financial-aid packages."
      examples={[
        {
          title: "Annual Scholarship",
          value: "$6,300",
          detail: "Thirty-five percent of an $18,000 annual tuition bill equals $6,300 in scholarship value each year.",
        },
        {
          title: "Total Aid / Year",
          value: "$7,800",
          detail: "Adding $1,500 in extra annual aid brings the total yearly tuition reduction to $7,800.",
        },
        {
          title: "4-Year Savings",
          value: "$31,200",
          detail: "Over four years, that level of aid reduces tuition costs by a total of $31,200.",
        },
      ]}
      contentTitle="Why Scholarship Calculations Matter"
      contentIntro="Scholarship offers are often presented in ways that sound impressive but do not immediately show the real financial impact. A calculator makes the offer easier to compare across schools and degree lengths."
      contentSections={[
        {
          title: "Why percentage awards can be misleading",
          paragraphs: [
            "A 50% scholarship sounds stronger than a fixed grant, but its actual value depends entirely on the tuition base it is applied to.",
            "Two schools can offer similar scholarship percentages while producing very different net costs because their tuition fees differ so much.",
          ],
        },
        {
          title: "Why total-program savings are important",
          paragraphs: [
            "Students often focus only on the first year, but a scholarship's real value is usually spread across the entire degree.",
            "Looking at multi-year savings helps families compare offers more accurately and make better long-term financial decisions.",
          ],
        },
        {
          title: "Limits of this estimate",
          paragraphs: [
            "This tool focuses on tuition reduction only. It does not include housing, books, transportation, or fees unless you intentionally add those figures yourself.",
            "Some scholarships change after the first year or require GPA renewal conditions. Always verify whether the same award continues throughout the program.",
          ],
        },
      ]}
      faqs={[
        {
          q: "What does the scholarship calculator estimate?",
          a: "It estimates the yearly and full-program tuition savings from a scholarship percentage plus any extra annual aid amount you enter.",
        },
        {
          q: "Can I include grants in the extra aid field?",
          a: "Yes. The extra aid field is meant for fixed yearly support such as grants, allowances, or other tuition-reducing awards.",
        },
        {
          q: "Does the calculator include living costs?",
          a: "No. It calculates tuition impact only unless you add other costs into the tuition number yourself for rough comparison purposes.",
        },
        {
          q: "What if my scholarship changes each year?",
          a: "Use separate calculations for each year or run the tool with an average estimate if you only need a rough overall projection.",
        },
      ]}
      relatedTools={[
        { title: "GPA Calculator", href: "/education/gpa-calculator", benefit: "Estimate the GPA you may need to maintain merit-based aid." },
        { title: "CGPA Calculator", href: "/education/cgpa-calculator", benefit: "Track long-term academic performance across semesters." },
        { title: "Final Grade Calculator", href: "/education/final-grade-calculator", benefit: "Work out the exam score needed to protect GPA-linked scholarships." },
      ]}
      quickFacts={[
        { label: "Best For", value: "College Costs", detail: "Useful when comparing aid offers from schools or degree programs." },
        { label: "Core Output", value: "Tuition Savings", detail: "Shows yearly aid, yearly net tuition, and total program savings." },
        { label: "Comparison Use", value: "Aid Packages", detail: "Makes percentage awards easier to compare with fixed grants." },
      ]}
    />
  );
}
