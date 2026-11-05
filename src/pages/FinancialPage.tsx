import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Banknote, TrendingUp, IndianRupee, PieChart, Link2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const financialData = [
  { name: 'Bank Accounts', value: 450000, color: 'hsl(214, 80%, 32%)' },
  { name: 'Investments', value: 780000, color: 'hsl(142, 71%, 35%)' },
  { name: 'NPS Balance', value: 1452380, color: 'hsl(38, 92%, 50%)' },
];

const totalCorpus = financialData.reduce((sum, d) => sum + d.value, 0);

export default function FinancialPage() {
  const { t } = useTranslation();

  const items = [
    { key: 'bank_accounts', value: '₹4,50,000', icon: Banknote, color: 'bg-primary/10 text-primary' },
    { key: 'investments', value: '₹7,80,000', icon: TrendingUp, color: 'bg-success/10 text-success' },
    { key: 'nps_balance', value: '₹14,52,380', icon: IndianRupee, color: 'bg-warning/10 text-warning' },
  ];

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-bold text-foreground">{t('financial.title')}</h1>
        <Button variant="outline" className="gap-2 senior-btn-boost">
          <Link2 className="h-4 w-4" />
          {t('financial.aa_connect')}
        </Button>
      </div>

      {/* Total Corpus */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="gov-card text-center">
        <PieChart className="mx-auto mb-2 h-8 w-8 text-primary" />
        <div className="text-sm text-muted-foreground">{t('financial.total_corpus')}</div>
        <div className="mt-1 text-3xl font-bold text-foreground">₹{totalCorpus.toLocaleString('en-IN')}</div>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Cards */}
        <div className="space-y-4">
          {items.map((item, i) => (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="gov-card flex items-center gap-4"
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${item.color}`}>
                <item.icon className="h-6 w-6" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">{t(`financial.${item.key}`)}</div>
                <div className="text-xl font-bold text-foreground">{item.value}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pie Chart */}
        <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="gov-card">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPie>
                <Pie data={financialData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} innerRadius={60} paddingAngle={3}>
                  {financialData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`} />
              </RechartsPie>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            {financialData.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: d.color }} />
                {d.name}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
