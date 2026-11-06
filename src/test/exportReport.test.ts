import { describe, it, expect } from "vitest";
import { generatePensionCSV } from "@/lib/exportReport";
import { calculatePension } from "@/lib/pensionCalculator";

describe("exportReport", () => {
  it("generates a formatted CSV with metadata and yearly rows", () => {
    const result = calculatePension({
      currentAge: 30,
      monthlyContribution: 5000,
      expectedAnnualReturn: 10,
    });

    const csv = generatePensionCSV(result);

    expect(csv).toContain("NPS SAATHI - RETIREMENT PROJECTION REPORT");
    expect(csv).toContain("Current Age,30");
    expect(csv).toContain("Retirement Age,60");
    expect(csv).toContain("Projected Total Corpus (INR)");
    expect(csv).toContain("Year,Age,Total Invested (INR),Projected Corpus (INR),Interest Earned (INR)");

    const lines = csv.split("\n");
    // Header lines + blank + table header + 30 yearly rows
    expect(lines.length).toBeGreaterThanOrEqual(35);

    // Verify first yearly row (Year 1, Age 31)
    const firstRow = lines.find((l) => l.startsWith("1,31,"));
    expect(firstRow).toBeDefined();

    // Verify last yearly row (Year 30, Age 60)
    const lastRow = lines.find((l) => l.startsWith("30,60,"));
    expect(lastRow).toBeDefined();
  });
});
