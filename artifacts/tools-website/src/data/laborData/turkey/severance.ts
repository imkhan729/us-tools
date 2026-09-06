export const turkeySeveranceData = {
  lastVerified: "6 Eylül 2026",
  stampTaxRate: 0.00759,
  rules: {
    minimumServiceDays: 365,
    annualDays: 365,
    annualWageDays: 30,
  },
  ceilings: [
    { from: "2025-01-01", to: "2025-06-30", amount: 46655.43 },
    { from: "2025-07-01", to: "2025-12-31", amount: 53919.68 },
    { from: "2026-01-01", to: "2026-06-30", amount: 64948.77 },
    { from: "2026-07-01", to: "2026-12-31", amount: 73729.87 },
  ],
  sources: [
    "Çalışma ve Sosyal Güvenlik Bakanlığı kıdem tazminatı tavanı",
    "Çalışma Genel Müdürlüğü İş Kanunu sıkça sorulan sorular",
    "Gelir İdaresi Başkanlığı damga vergisi oranları",
  ],
} as const;

export type TurkeyCeilingPeriod = (typeof turkeySeveranceData.ceilings)[number];

function parsePlainDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const [, year, month, day] = match;
  return { year: Number(year), month: Number(month), day: Number(day) };
}

function toSortable(date: string) {
  const parsed = parsePlainDate(date);
  if (!parsed) return null;
  return parsed.year * 10000 + parsed.month * 100 + parsed.day;
}

export function getTurkeySeveranceCeiling(terminationDate: string): TurkeyCeilingPeriod | null {
  const target = toSortable(terminationDate);
  if (!target) return null;
  return turkeySeveranceData.ceilings.find((period) => {
    const from = toSortable(period.from);
    const to = toSortable(period.to);
    return from !== null && to !== null && target >= from && target <= to;
  }) ?? null;
}
