export const brazilLaborTax2026 = {
  lastVerified: "6 de setembro de 2026",
  inssCeiling: 8475.55,
  inssBands: [
    { upTo: 1621, rate: 0.075 },
    { upTo: 2902.84, rate: 0.09 },
    { upTo: 4354.27, rate: 0.12 },
    { upTo: 8475.55, rate: 0.14 },
  ],
  irrfBands: [
    { upTo: 2428.8, rate: 0, deduction: 0 },
    { upTo: 2826.65, rate: 0.075, deduction: 182.16 },
    { upTo: 3751.05, rate: 0.15, deduction: 394.16 },
    { upTo: 4664.68, rate: 0.225, deduction: 675.49 },
    { upTo: Infinity, rate: 0.275, deduction: 908.73 },
  ],
  dependentDeduction: 189.59,
  simplifiedDeduction: 607.2,
  irrfReduction: {
    fullUntil: 5000,
    partialUntil: 7350,
    fullReduction: 312.89,
    fixed: 978.62,
    factor: 0.133145,
  },
  fgtsRates: { withoutCause: 0.4, agreement: 0.2 },
  fgtsWithdrawalAgreement: 0.8,
  vacation: {
    absenceEntitlement: [
      { id: "0-5", label: "0 a 5 faltas", maxAbsences: 5, days: 30 },
      { id: "6-14", label: "6 a 14 faltas", maxAbsences: 14, days: 24 },
      { id: "15-23", label: "15 a 23 faltas", maxAbsences: 23, days: 18 },
      { id: "24-32", label: "24 a 32 faltas", maxAbsences: 32, days: 12 },
      { id: "33+", label: "Mais de 32 faltas", maxAbsences: Infinity, days: 0 },
    ],
    paymentDeadlineDaysBeforeStart: 2,
    maxAbonoFraction: 1 / 3,
    taxClassification: {
      enjoyedVacation: { inss: true, irrf: true },
      enjoyedVacationThird: { inss: true, irrf: true },
      abonoPrincipal: { inss: false, irrf: false },
      abonoThird: { inss: false, irrf: true },
      thirteenthAdvance: { inss: false, irrf: false },
    },
  },
} as const;

export function calculateBrazilInss2026(gross: number) {
  const taxable = Math.min(Math.max(0, gross), brazilLaborTax2026.inssCeiling);
  let previousLimit = 0;
  let contribution = 0;
  for (const band of brazilLaborTax2026.inssBands) {
    const bandAmount = Math.max(0, Math.min(taxable, band.upTo) - previousLimit);
    contribution += bandAmount * band.rate;
    previousLimit = band.upTo;
    if (taxable <= band.upTo) break;
  }
  return contribution;
}

export function calculateBrazilIrrf2026(grossTaxable: number, legalDeductions: number, useBestDeduction = true) {
  const legalBase = Math.max(0, grossTaxable - legalDeductions);
  const simplifiedBase = Math.max(0, grossTaxable - brazilLaborTax2026.simplifiedDeduction);
  const base = useBestDeduction && simplifiedBase < legalBase ? simplifiedBase : legalBase;
  const deductionMethod = base === simplifiedBase && useBestDeduction ? "Desconto simplificado" : "Deduções legais";
  const band = brazilLaborTax2026.irrfBands.find((item) => base <= item.upTo) ?? brazilLaborTax2026.irrfBands[brazilLaborTax2026.irrfBands.length - 1];
  const raw = Math.max(0, base * band.rate - band.deduction);
  let reduction = 0;
  if (grossTaxable <= brazilLaborTax2026.irrfReduction.fullUntil) {
    reduction = Math.min(raw, brazilLaborTax2026.irrfReduction.fullReduction);
  } else if (grossTaxable <= brazilLaborTax2026.irrfReduction.partialUntil) {
    reduction = Math.max(0, brazilLaborTax2026.irrfReduction.fixed - brazilLaborTax2026.irrfReduction.factor * grossTaxable);
  }
  return {
    base,
    raw,
    reduction: Math.min(raw, reduction),
    due: Math.max(0, raw - Math.min(raw, reduction)),
    deductionMethod,
  };
}
