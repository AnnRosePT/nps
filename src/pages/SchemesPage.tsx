import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Building2, PieChart, ShieldAlert, CheckCircle2, TrendingUp, Percent, ArrowUpDown } from 'lucide-react';

interface FundManager {
  name: string;
  tag: string;
  aum: string;
  fiveYearReturn: number;
  threeYearReturn: number;
  rating: string;
}

const fundManagers: FundManager[] = [
  { name: 'HDFC Pension Management Co.', tag: 'Top Equity Return', aum: '₹78,400 Cr', fiveYearReturn: 13.4, threeYearReturn: 14.8, rating: '★★★★★' },
  { name: 'ICICI Prudential Pension Fund', tag: 'Consistent Performer', aum: '₹64,200 Cr', fiveYearReturn: 13.1, threeYearReturn: 14.2, rating: '★★★★★' },
  { name: 'SBI Pension Funds Pvt Ltd', tag: 'Largest AUM', aum: '₹4,12,000 Cr', fiveYearReturn: 12.8, threeYearReturn: 13.9, rating: '★★★★★' },
  { name: 'Kotak Mahindra Pension Fund', tag: 'High Growth', aum: '₹24,500 Cr', fiveYearReturn: 13.0, threeYearReturn: 14.1, rating: '★★★★☆' },
  { name: 'UTI Retirement Solutions Ltd', tag: 'PSU Trust', aum: '₹2,45,000 Cr', fiveYearReturn: 12.4, threeYearReturn: 13.5, rating: '★★★★☆' },
  { name: 'LIC Pension Fund Ltd', tag: 'Sovereign Heritage', aum: '₹3,15,000 Cr', fiveYearReturn: 12.2, threeYearReturn: 13.2, rating: '★★★★☆' },
];

export default function SchemesPage() {
  const { t } = useTranslation();
  const [selectedAge, setSelectedAge] = useState(30);

  // Auto Choice Lifecycle asset allocation dynamic calculation
  const getLifecycleAllocation = (age: number, maxEquity: 75 | 50 | 25) => {
    if (age <= 35) {
      const equity = maxEquity;
      const debt = 100 - maxEquity;
      const corporate = Math.round(debt * 0.6);
      const govt = debt - corporate;
      return { equity, corporate, govt };
    }
    // Tapering phase from age 36 to 55
    const yearsPast35 = Math.min(20, age - 35);
    const minEquity = maxEquity === 75 ? 15 : maxEquity === 50 ? 10 : 5;
    const equityReduction = ((maxEquity - minEquity) / 20) * yearsPast35;
    const equity = Math.round(maxEquity - equityReduction);
    const remaining = 100 - equity;
    const corporate = Math.round(remaining * (maxEquity === 75 ? 0.3 : 0.5));
    const govt = remaining - corporate;
    return { equity, corporate, govt };
  };

  const lc75 = getLifecycleAllocation(selectedAge, 75);
  const lc50 = getLifecycleAllocation(selectedAge, 50);
  const lc25 = getLifecycleAllocation(selectedAge, 25);

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">NPS Schemes & Fund Managers</h1>
        <p className="mt-1 text-muted-foreground senior-text-boost">
          Compare Pension Fund Managers (PFMs), understand asset allocations, and preview Auto Choice lifecycle rebalancing.
        </p>
      </div>

      <Tabs defaultValue="pfm" className="space-y-6">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 max-w-lg h-auto p-1">
          <TabsTrigger value="pfm" className="py-2.5 text-sm">Fund Managers</TabsTrigger>
          <TabsTrigger value="lifecycle" className="py-2.5 text-sm">Lifecycle Funds (Auto)</TabsTrigger>
          <TabsTrigger value="assets" className="py-2.5 text-sm">Asset Classes (Active)</TabsTrigger>
        </TabsList>

        {/* Tab 1: Pension Fund Managers */}
        <TabsContent value="pfm" className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {fundManagers.map((pfm, idx) => (
              <motion.div
                key={pfm.name}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="h-full border border-border shadow-sm hover:border-primary/50 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant="secondary" className="text-xs bg-primary/10 text-primary font-medium">
                        {pfm.tag}
                      </Badge>
                      <span className="text-xs text-amber-500 font-mono tracking-widest">{pfm.rating}</span>
                    </div>
                    <CardTitle className="text-base font-bold mt-2 text-foreground">{pfm.name}</CardTitle>
                    <CardDescription className="text-xs">AUM: {pfm.aum}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-3">
                    <div className="flex items-center justify-between text-sm border-t border-border/50 pt-2">
                      <span className="text-muted-foreground">5-Year Return (Equity):</span>
                      <span className="font-semibold text-success flex items-center gap-1">
                        <TrendingUp className="h-3.5 w-3.5" />
                        {pfm.fiveYearReturn}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">3-Year Return (Equity):</span>
                      <span className="font-semibold text-foreground">{pfm.threeYearReturn}%</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex items-start gap-3 text-sm text-foreground">
            <Building2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">PFRDA Regulation Note</p>
              <p className="text-muted-foreground text-xs mt-0.5">
                Subscribers can switch their Pension Fund Manager (PFM) once every financial year for free without any capital gains tax or penalties.
              </p>
            </div>
          </div>
        </TabsContent>

        {/* Tab 2: Auto Choice Lifecycle Rebalancing */}
        <TabsContent value="lifecycle" className="space-y-6">
          <div className="gov-card space-y-6">
            <div>
              <h2 className="font-display text-xl font-bold text-foreground">Interactive Lifecycle Rebalancer</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Drag the age slider below to see how your portfolio automatically reduces equity and moves to safe debt as you near retirement.
              </p>
            </div>

            <div className="space-y-2 max-w-md">
              <label className="text-sm font-semibold text-foreground">
                Subscriber Age: <span className="text-primary font-bold text-base">{selectedAge} years</span>
              </label>
              <Slider
                min={20}
                max={60}
                step={1}
                value={[selectedAge]}
                onValueChange={([val]) => setSelectedAge(val)}
                className="pt-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground font-mono">
                <span>Age 20</span>
                <span>Age 35 (De-risking starts)</span>
                <span>Age 60</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {/* LC75 */}
              <div className="rounded-xl border border-border p-4 space-y-3 bg-card">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-foreground">LC75 (Aggressive)</h3>
                  <Badge variant="outline" className="text-xs">Max 75% Equity</Badge>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between font-medium">
                    <span className="text-primary">Equity (Class E):</span>
                    <span className="font-bold">{lc75.equity}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-600 dark:text-blue-400">Corporate Debt (Class C):</span>
                    <span>{lc75.corporate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-emerald-600 dark:text-emerald-400">Govt Bonds (Class G):</span>
                    <span>{lc75.govt}%</span>
                  </div>
                </div>
                <div className="h-2 w-full flex rounded-full overflow-hidden bg-muted">
                  <div style={{ width: `${lc75.equity}%` }} className="bg-primary" />
                  <div style={{ width: `${lc75.corporate}%` }} className="bg-blue-500" />
                  <div style={{ width: `${lc75.govt}%` }} className="bg-emerald-500" />
                </div>
              </div>

              {/* LC50 */}
              <div className="rounded-xl border-2 border-primary/40 p-4 space-y-3 bg-card shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-foreground">LC50 (Moderate - Default)</h3>
                  <Badge className="text-xs bg-primary text-primary-foreground">Recommended</Badge>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between font-medium">
                    <span className="text-primary">Equity (Class E):</span>
                    <span className="font-bold">{lc50.equity}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-600 dark:text-blue-400">Corporate Debt (Class C):</span>
                    <span>{lc50.corporate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-emerald-600 dark:text-emerald-400">Govt Bonds (Class G):</span>
                    <span>{lc50.govt}%</span>
                  </div>
                </div>
                <div className="h-2 w-full flex rounded-full overflow-hidden bg-muted">
                  <div style={{ width: `${lc50.equity}%` }} className="bg-primary" />
                  <div style={{ width: `${lc50.corporate}%` }} className="bg-blue-500" />
                  <div style={{ width: `${lc50.govt}%` }} className="bg-emerald-500" />
                </div>
              </div>

              {/* LC25 */}
              <div className="rounded-xl border border-border p-4 space-y-3 bg-card">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-foreground">LC25 (Conservative)</h3>
                  <Badge variant="outline" className="text-xs">Max 25% Equity</Badge>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between font-medium">
                    <span className="text-primary">Equity (Class E):</span>
                    <span className="font-bold">{lc25.equity}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-600 dark:text-blue-400">Corporate Debt (Class C):</span>
                    <span>{lc25.corporate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-emerald-600 dark:text-emerald-400">Govt Bonds (Class G):</span>
                    <span>{lc25.govt}%</span>
                  </div>
                </div>
                <div className="h-2 w-full flex rounded-full overflow-hidden bg-muted">
                  <div style={{ width: `${lc25.equity}%` }} className="bg-primary" />
                  <div style={{ width: `${lc25.corporate}%` }} className="bg-blue-500" />
                  <div style={{ width: `${lc25.govt}%` }} className="bg-emerald-500" />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Tab 3: Active Choice Asset Classes */}
        <TabsContent value="assets" className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card className="border border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base text-primary">Class E — Equity</CardTitle>
                  <Badge variant="secondary">Up to 75% Allocation</Badge>
                </div>
                <CardDescription>Invests in top index shares (Nifty 50, Sensex) for highest compounding growth.</CardDescription>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground space-y-1">
                <p>• Historical average return: 12% - 14% p.a.</p>
                <p>• Suitable for investors under 50 with long horizons.</p>
              </CardContent>
            </Card>

            <Card className="border border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base text-blue-600 dark:text-blue-400">Class C — Corporate Debt</CardTitle>
                  <Badge variant="secondary">Up to 100% Allocation</Badge>
                </div>
                <CardDescription>Invests in high-grade rated corporate debentures and bonds of PSUs and financial institutions.</CardDescription>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground space-y-1">
                <p>• Historical average return: 8% - 9.5% p.a.</p>
                <p>• Provides stable periodic interest income with moderate credit safety.</p>
              </CardContent>
            </Card>

            <Card className="border border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base text-emerald-600 dark:text-emerald-400">Class G — Government Securities</CardTitle>
                  <Badge variant="secondary">Up to 100% Allocation</Badge>
                </div>
                <CardDescription>Invests in Central and State Government bonds with zero default risk.</CardDescription>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground space-y-1">
                <p>• Historical average return: 7.5% - 8.5% p.a.</p>
                <p>• Sovereign guarantee with maximum capital protection.</p>
              </CardContent>
            </Card>

            <Card className="border border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base text-purple-600 dark:text-purple-400">Class A — Alternative Assets</CardTitle>
                  <Badge variant="secondary">Max 5% Cap</Badge>
                </div>
                <CardDescription>Invests in REITs, InvITs, and alternative infrastructure instruments.</CardDescription>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground space-y-1">
                <p>• Diversification tool for experienced investors.</p>
                <p>• Capped strictly at 5% to preserve capital safety.</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
