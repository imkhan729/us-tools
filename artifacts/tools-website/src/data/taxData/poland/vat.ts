export type PolandVatRate = {
  label: string;
  value: number | null;
  type: "standard" | "reduced" | "zero" | "exempt";
  description: string;
};

export const polandVatData = {
  lastVerifiedIso: "2026-09-05",
  lastVerifiedDisplay: "5 września 2026",
  defaultRate: 23,
  standardRates: [
    { label: "23%", value: 23, type: "standard", description: "podstawowa stawka VAT" },
    { label: "8%", value: 8, type: "reduced", description: "obniżona stawka VAT dla określonych towarów/usług" },
    { label: "5%", value: 5, type: "reduced", description: "obniżona stawka VAT dla określonych towarów" },
    { label: "0%", value: 0, type: "zero", description: "stawka zerowa przy spełnieniu warunków" },
    { label: "ZW", value: null, type: "exempt", description: "zwolnienie z VAT, nie stawka 0%" },
  ] satisfies PolandVatRate[],
  source: {
    name: "Ministerstwo Finansów / podatki.gov.pl",
    url: "https://www.podatki.gov.pl/podatki-firmowe/vat/stawki-i-limity",
  },
  temporaryRateNote:
    "Czasowe preferencje sektorowe, takie jak okresowe obniżki VAT na określone paliwa, nie są dodawane jako stałe presety w ogólnym kalkulatorze.",
};
