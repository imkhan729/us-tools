export interface LetterGradeBand {
  min: number;
  grade: string;
  gpa: number;
  note: string;
}

export const LETTER_GRADE_SCALE: LetterGradeBand[] = [
  { min: 97, grade: "A+", gpa: 4.0, note: "Excellent" },
  { min: 93, grade: "A", gpa: 4.0, note: "Excellent" },
  { min: 90, grade: "A-", gpa: 3.7, note: "Excellent" },
  { min: 87, grade: "B+", gpa: 3.3, note: "Very good" },
  { min: 83, grade: "B", gpa: 3.0, note: "Very good" },
  { min: 80, grade: "B-", gpa: 2.7, note: "Good" },
  { min: 77, grade: "C+", gpa: 2.3, note: "Good" },
  { min: 73, grade: "C", gpa: 2.0, note: "Satisfactory" },
  { min: 70, grade: "C-", gpa: 1.7, note: "Satisfactory" },
  { min: 67, grade: "D+", gpa: 1.3, note: "Below average" },
  { min: 63, grade: "D", gpa: 1.0, note: "Below average" },
  { min: 60, grade: "D-", gpa: 0.7, note: "Marginal pass" },
  { min: 0, grade: "F", gpa: 0.0, note: "Failing" },
];

export function getLetterGrade(percentage: number) {
  return LETTER_GRADE_SCALE.find((band) => percentage >= band.min) ?? LETTER_GRADE_SCALE[LETTER_GRADE_SCALE.length - 1];
}

export function formatPercent(value: number, maximumFractionDigits = 2) {
  return value.toLocaleString("en-US", { maximumFractionDigits });
}
