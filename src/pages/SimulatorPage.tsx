import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Calculator, IndianRupee, TrendingUp, ShieldCheck, PieChart, Sparkles, Download } from 'lucide-react';
import { calculatePension, RISK_PROFILES, type PensionResult } from '@/lib/pensionCalculator';
import { formatINR } from '@/lib/utils';
import { generatePensionCSV, triggerFileDownload } from '@/lib/exportReport';
import { toast } from 'sonner';

export default function SimulatorPage() {
  const { t } = useTranslation();
  const [age, setAge] = useState(30);
  const [salary, setSalary] = useState(50000);
  const [contribution, setContribution] = useState(5000);
  const [risk, setRisk] = useState<'conservative' | 'balanced' | 'aggressive'>('balanced');
  const [result, setResult] = useState<PensionResult | null>(null);

  const calculate = useCallback(() => {
    setResult(
      calculatePension({
        currentAge: age,
        monthlyContribution: contribution,
        expectedAnnualReturn: RISK_PROFILES[risk].rate,
      })
    );
  }, [age, contribution, risk]);

  const scenarioData = [
    {
      name: t('simulator.conservative'),
      corpus: calculatePension({ currentAge: age, monthlyContribution: contribution, expectedAnnualReturn: RISK_PROFILES.conservative.rate }).totalCorpus,
      pension: calculatePension({ currentAge: age, monthlyContribution: contribution, expectedAnnualReturn: RISK_PROFILES.conservative.rate }).monthlyPension,
    },
    {
      name: t('simulator.balanced'),
      corpus: calculatePension({ currentAge: age, monthlyContribution: contribution, expectedAnnualReturn: RISK_PROFILES.balanced.rate }).totalCorpus,
      pension: calculatePension({ currentAge: age, monthlyContribution: contribution, expectedAnnualReturn: RISK_PROFILES.balanced.rate }).monthlyPension,
    },
    {
      name: t('simulator.aggressive'),
      corpus: calculatePension({ currentAge: age, monthlyContribution: contribution, expectedAnnualReturn: RISK_PROFILES.aggressive.rate }).totalCorpus,
      pension: calculatePension({ currentAge: age, monthlyContribution: contribution, expectedAnnualReturn: RISK_PROFILES.aggressive.rate }).monthlyPension,
    },
  ];

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">{t('simulator.title')}</h1>
        <p className="mt-1 text-muted-foreground senior-text-boost">{t('simulator.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Form */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="gov-card space-y-6">
          <div className="space-y-2">
            <Label htmlFor="age" className="text-base font-medium">{t('simulator.age')}: {age}</Label>
            <Slider id="age" min={18} max={58} step={1} value={[age]} onValueChange={([v]) => setAge(v)} className="mt-2" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="salary" className="text-base font-medium">{t('simulator.salary')}</Label>
            <Input id="salary" type="number" value={salary} onChange={(e) => setSalary(Number(e.target.value))} className="text-lg" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contribution" className="text-base font-medium">{t('simulator.contribution')}</Label>
            <Input id="contribution" type="number" value={contribution} onChange={(e) => setContribution(Number(e.target.value))} className="text-lg" />
          </div>

          <div className="space-y-2">
            <Label className="text-base font-medium">{t('simulator.risk')}</Label>
            <Select value={risk} onValueChange={(v) => setRisk(v as typeof risk)}>
              <SelectTrigger className="text-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="conservative">{t('simulator.conservative')}</SelectItem>
                <SelectItem value="balanced">{t('simulator.balanced')}</SelectItem>
                <SelectItem value="aggressive">{t('simulator.aggressive')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={calculate} size="lg" className="w-full gap-2 text-lg senior-btn-boost">
            <Calculator className="h-5 w-5" />
            {t('simulator.calculate')}
          </Button>
        </motion.div>

        {/* Results */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          {result && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="gov-card text-center">
                  <IndianRupee className="mx-auto mb-2 h-8 w-8 text-primary" />
                  <div className="text-sm text-muted-foreground">{t('simulator.projected_corpus')}</div>
                  <div className="mt-1 text-2xl font-bold text-primary">{formatINR(result.totalCorpus)}</div>
                </div>
                <div className="gov-card text-center">
                  <TrendingUp className="mx-auto mb-2 h-8 w-8 text-success" />
                  <div className="text-sm text-muted-foreground">{t('simulator.monthly_pension')}</div>
                  <div className="mt-1 text-2xl font-bold text-success">{formatINR(result.monthlyPension)}</div>
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="gov-card grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-xs text-muted-foreground">Total Invested</div>
                  <div className="text-sm font-semibold text-foreground mt-1">{formatINR(result.totalInvestment)}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Interest Earned</div>
                  <div className="text-sm font-semibold text-success mt-1">{formatINR(result.totalInterest)}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Lump Sum (60%)</div>
                  <div className="text-sm font-semibold text-primary mt-1">{formatINR(result.lumpSumAmount)}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Tax Savings/yr</div>
                  <div className="text-sm font-semibold text-accent mt-1">{formatINR(result.annualTaxSavings)}</div>
                </div>
              </div>

              {/* Export Action */}
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const csv = generatePensionCSV(result);
                    triggerFileDownload(`nps-pension-projection-age-${result.currentAge}.csv`, csv);
                    toast.success('Retirement projection report exported to CSV!');
                  }}
                  className="gap-2 text-xs"
                >
                  <Download className="h-3.5 w-3.5" />
                  Export Projection (CSV)
                </Button>
              </div>
            </div>
          )}

          <div className="gov-card">
            <h3 className="mb-4 font-display text-lg font-semibold text-foreground">{t('simulator.scenario_comparison')}</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={scenarioData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 88%)" />
                  <XAxis dataKey="name" tick={{ fontSize: 13 }} />
                  <YAxis tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} tick={{ fontSize: 13 }} />
                  <Tooltip formatter={(value: number) => [formatINR(value), '']} contentStyle={{ borderRadius: '0.75rem' }} />
                  <Legend />
                  <Bar dataKey="corpus" name="Corpus" fill="hsl(214, 80%, 32%)" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="pension" name="Monthly Pension" fill="hsl(142, 71%, 35%)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
