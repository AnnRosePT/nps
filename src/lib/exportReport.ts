import { PensionResult } from './pensionCalculator';

/**
 * Generates an exportable CSV string containing complete NPS projection data.
 */
export function generatePensionCSV(result: PensionResult): string {
  const lines: string[] = [];

  // Metadata headers
  lines.push('NPS SAATHI - RETIREMENT PROJECTION REPORT');
  lines.push(`Generated On,"${new Date().toLocaleDateString('en-IN')}"`);
  lines.push(`Current Age,${result.currentAge}`);
  lines.push(`Retirement Age,${result.retirementAge}`);
  lines.push(`Total Investment Tenure (Years),${result.investmentYears}`);
  lines.push(`Projected Total Corpus (INR),${result.totalCorpus}`);
  lines.push(`Total Self Contribution (INR),${result.totalInvestment}`);
  lines.push(`Total Compound Interest Earned (INR),${result.totalInterest}`);
  lines.push(`Estimated Monthly Pension (INR),${result.monthlyPension}`);
  lines.push(`Lump Sum Payout (60% Tax-Free) (INR),${result.lumpSumAmount}`);
  lines.push(`Annuity Payout (40%) (INR),${result.annuityAmount}`);
  lines.push(`Annual Section 80CCD(1B) Tax Savings (INR),${result.annualTaxSavings}`);
  lines.push('');

  // Table header
  lines.push('Year,Age,Total Invested (INR),Projected Corpus (INR),Interest Earned (INR)');

  // Year breakdown rows
  result.yearlyBreakdown.forEach((row, idx) => {
    const interest = Math.max(0, row.corpus - row.invested);
    lines.push(`${idx + 1},${row.age},${row.invested},${row.corpus},${interest}`);
  });

  return lines.join('\n');
}

/**
 * Initiates browser file download for text/CSV.
 */
export function triggerFileDownload(filename: string, content: string, mimeType = 'text/csv;charset=utf-8;'): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
