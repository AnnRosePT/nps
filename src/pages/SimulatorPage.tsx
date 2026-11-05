import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Calculator, IndianRupee, TrendingUp } from 'lucide-react';

interface SimResult {
  corpus: number;
  monthlyPension: number;
}

function calculatePension(age: number, contribution: number, riskReturn: number): SimResult {
  const years = 60 - age;
  const months = years * 12;
  const monthlyRate = riskReturn / 12 / 100;
  const corpus = contribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
  const annuityRate = 0.06;
  const monthlyPension = (corpus * 0.4 * annuityRate) / 12 + (corpus * 0.6) / (20 * 12);
  return { corpus: Math.round(corpus), monthlyPension: Math.round(monthlyPension) };
}

const riskReturns = { conservative: 8, balanced: 10, aggressive: 12 };

export default function SimulatorPage() {
  const { t } = useTranslation();
  const [age, setAge] = useState(30);
  const [salary, setSalary] = useState(50000);
  const [contribution, setContribution] = useState(5000);
  const [risk, setRisk] = useState<'conservative' | 'balanced' | 'aggressive'>('balanced');
  const [result, setResult] = useState<SimResult | null>(null);

  const calculate = useCallback(() => {
    setResult(calculatePension(age, contribution, riskReturns[risk]));
  }, [age, contribution, risk]);

  const scenarioData = [
    {
      name: t('simulator.conservative'),
      corpus: calculatePension(age, contribution, 8).corpus,
      pension: calculatePension(age, contribution, 8).monthlyPension,
    },
    {
      name: t('simulator.balanced'),
      corpus: calculatePension(age, contribution, 10).corpus,
      pension: calculatePension(age, contribution, 10).monthlyPension,
    },
    {
      name: t('simulator.aggressive'),
      corpus: calculatePension(age, contribution, 12).corpus,
      pension: calculatePension(age, contribution, 12).monthlyPension,
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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="gov-card text-center">
                <IndianRupee className="mx-auto mb-2 h-8 w-8 text-primary" />
                <div className="text-sm text-muted-foreground">{t('simulator.projected_corpus')}</div>
                <div className="mt-1 text-2xl font-bold text-primary">₹{result.corpus.toLocaleString('en-IN')}</div>
              </div>
              <div className="gov-card text-center">
                <TrendingUp className="mx-auto mb-2 h-8 w-8 text-success" />
                <div className="text-sm text-muted-foreground">{t('simulator.monthly_pension')}</div>
                <div className="mt-1 text-2xl font-bold text-success">₹{result.monthlyPension.toLocaleString('en-IN')}</div>
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
                  <Tooltip formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, '']} contentStyle={{ borderRadius: '0.75rem' }} />
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
