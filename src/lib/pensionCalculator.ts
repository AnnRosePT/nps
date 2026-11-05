/**
 * NPS Saathi Pension Calculator Engine
 * Handles compound interest accumulation, annuity breakdown, and tax savings projections.
 */

export interface PensionInput {
  currentAge: number;
  retirementAge?: number;
  monthlyContribution: number;
  expectedAnnualReturn: number; // e.g. 8 for 8%, 10 for 10%
  annuityPercent?: number;       // default 40 (min 40% mandatory in NPS)
  annuityReturnRate?: number;    // default 6%
}

export interface YearProjection {
  age: number;
  invested: number;
  corpus: number;
}

export interface PensionResult {
  currentAge: number;
  retirementAge: number;
  investmentYears: number;
  totalInvestment: number;
  totalInterest: number;
  totalCorpus: number;
  lumpSumPercent: number;
  lumpSumAmount: number;
  annuityPercent: number;
  annuityAmount: number;
  monthlyPension: number;
  annualTaxSavings: number; // under 80CCD(1B) up to ₹50,000 for 30% tax bracket
  yearlyBreakdown: YearProjection[];
}

export const RISK_PROFILES = {
  conservative: { label: 'Conservative (Low Equity)', rate: 8 },
  balanced: { label: 'Balanced (Moderate Equity)', rate: 10 },
  aggressive: { label: 'Aggressive (High Equity)', rate: 12 },
} as const;

/**
 * Calculates NPS corpus accumulation and monthly pension payout.
 */
export function calculatePension(input: PensionInput): PensionResult {
  const currentAge = Math.max(18, Math.min(input.currentAge, 65));
  const retirementAge = input.retirementAge && input.retirementAge > currentAge ? input.retirementAge : 60;
  const investmentYears = Math.max(1, retirementAge - currentAge);
  const totalMonths = investmentYears * 12;
  const monthlyContribution = Math.max(0, input.monthlyContribution);
  const annualReturn = Math.max(0, input.expectedAnnualReturn);
  const monthlyRate = annualReturn / 12 / 100;

  let corpus = 0;
  const yearlyBreakdown: YearProjection[] = [];

  if (monthlyRate === 0) {
    corpus = monthlyContribution * totalMonths;
    for (let yr = 1; yr <= investmentYears; yr++) {
      yearlyBreakdown.push({
        age: currentAge + yr,
        invested: monthlyContribution * yr * 12,
        corpus: monthlyContribution * yr * 12,
      });
    }
  } else {
    // Future Value of Annuity formula: P * [((1 + r)^n - 1) / r] * (1 + r)
    corpus = monthlyContribution * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate);

    // Calculate progression at each year
    for (let yr = 1; yr <= investmentYears; yr++) {
      const monthsSoFar = yr * 12;
      const corpusAtYear = monthlyContribution * ((Math.pow(1 + monthlyRate, monthsSoFar) - 1) / monthlyRate) * (1 + monthlyRate);
      yearlyBreakdown.push({
        age: currentAge + yr,
        invested: Math.round(monthlyContribution * monthsSoFar),
        corpus: Math.round(corpusAtYear),
      });
    }
  }

  const roundedCorpus = Math.round(corpus);
  const totalInvestment = Math.round(monthlyContribution * totalMonths);
  const totalInterest = Math.max(0, roundedCorpus - totalInvestment);

  const annuityPercent = Math.min(100, Math.max(40, input.annuityPercent ?? 40));
  const lumpSumPercent = 100 - annuityPercent;

  const annuityAmount = Math.round(roundedCorpus * (annuityPercent / 100));
  const lumpSumAmount = Math.round(roundedCorpus * (lumpSumPercent / 100));

  const annuityRate = (input.annuityReturnRate ?? 6) / 100;
  // Monthly pension from annuity payout + systematic withdrawal plan representation
  const monthlyPension = Math.round((annuityAmount * annuityRate) / 12);

  // Section 80CCD(1B) provides an exclusive deduction of up to ₹50,000 for NPS
  // Assuming standard 31.2% tax slab (30% + 4% cess) for max benefit demonstration
  const eligibleDeduction = Math.min(50000, monthlyContribution * 12);
  const annualTaxSavings = Math.round(eligibleDeduction * 0.312);

  return {
    currentAge,
    retirementAge,
    investmentYears,
    totalInvestment,
    totalInterest,
    totalCorpus: roundedCorpus,
    lumpSumPercent,
    lumpSumAmount,
    annuityPercent,
    annuityAmount,
    monthlyPension,
    annualTaxSavings,
    yearlyBreakdown,
  };
}
