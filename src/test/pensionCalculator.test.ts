import { describe, it, expect } from "vitest";
import { calculatePension, RISK_PROFILES } from "@/lib/pensionCalculator";

describe("pensionCalculator", () => {
  it("calculates expected corpus and monthly pension for standard 30-year-old contributor", () => {
    const result = calculatePension({
      currentAge: 30,
      monthlyContribution: 5000,
      expectedAnnualReturn: 10,
    });

    expect(result.currentAge).toBe(30);
    expect(result.retirementAge).toBe(60);
    expect(result.investmentYears).toBe(30);
    expect(result.totalInvestment).toBe(5000 * 30 * 12); // 18,00,000
    expect(result.totalCorpus).toBeGreaterThan(result.totalInvestment);
    expect(result.monthlyPension).toBeGreaterThan(0);
    expect(result.lumpSumAmount + result.annuityAmount).toBe(result.totalCorpus);
  });

  it("handles 0% annual return without division-by-zero error", () => {
    const result = calculatePension({
      currentAge: 40,
      monthlyContribution: 2000,
      expectedAnnualReturn: 0,
    });

    const expectedTotal = 2000 * 20 * 12;
    expect(result.totalInvestment).toBe(expectedTotal);
    expect(result.totalCorpus).toBe(expectedTotal);
    expect(result.totalInterest).toBe(0);
  });

  it("calculates 80CCD(1B) annual tax savings capped at ₹50,000", () => {
    const lowContribution = calculatePension({
      currentAge: 25,
      monthlyContribution: 1000, // 12,000 per year
      expectedAnnualReturn: 8,
    });
    // 12,000 * 31.2% = 3,744
    expect(lowContribution.annualTaxSavings).toBe(3744);

    const highContribution = calculatePension({
      currentAge: 25,
      monthlyContribution: 10000, // 1,20,000 per year, capped at 50,000
      expectedAnnualReturn: 8,
    });
    // 50,000 * 31.2% = 15,600
    expect(highContribution.annualTaxSavings).toBe(15600);
  });

  it("produces higher returns for aggressive profile than conservative", () => {
    const conservative = calculatePension({
      currentAge: 28,
      monthlyContribution: 5000,
      expectedAnnualReturn: RISK_PROFILES.conservative.rate,
    });
    const aggressive = calculatePension({
      currentAge: 28,
      monthlyContribution: 5000,
      expectedAnnualReturn: RISK_PROFILES.aggressive.rate,
    });

    expect(aggressive.totalCorpus).toBeGreaterThan(conservative.totalCorpus);
    expect(aggressive.monthlyPension).toBeGreaterThan(conservative.monthlyPension);
  });

  it("clamps invalid current ages cleanly", () => {
    const young = calculatePension({
      currentAge: 10,
      monthlyContribution: 1000,
      expectedAnnualReturn: 8,
    });
    expect(young.currentAge).toBe(18);

    const senior = calculatePension({
      currentAge: 70,
      monthlyContribution: 1000,
      expectedAnnualReturn: 8,
    });
    expect(senior.currentAge).toBe(65);
  });
});
