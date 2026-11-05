import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { IndianRupee, Calendar, TrendingUp, PiggyBank, ShieldCheck, Lightbulb } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const projectionData = [
  { age: 30, corpus: 200000 },
  { age: 35, corpus: 850000 },
  { age: 40, corpus: 2100000 },
  { age: 45, corpus: 4200000 },
  { age: 50, corpus: 7500000 },
  { age: 55, corpus: 10200000 },
  { age: 60, corpus: 14500000 },
];

const dashboardCards = [
  { key: 'nps_balance', value: '₹14,52,380', icon: IndianRupee, color: 'bg-primary/10 text-primary' },
  { key: 'monthly_pension', value: '₹32,450', icon: TrendingUp, color: 'bg-success/10 text-success' },
  { key: 'retirement_age', value: '60', icon: Calendar, color: 'bg-info/10 text-info' },
  { key: 'contributions', value: '₹8,64,000', icon: PiggyBank, color: 'bg-warning/10 text-warning' },
  { key: 'risk_profile', value: 'Balanced', icon: ShieldCheck, color: 'bg-accent/10 text-accent' },
];

export default function DashboardPage() {
  const { t } = useTranslation();

  return (
    <div className="p-4 md:p-8 space-y-8">
      <h1 className="font-display text-3xl font-bold text-foreground">{t('dashboard.title')}</h1>

      {/* Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {dashboardCards.map((card, i) => (
          <motion.div
            key={card.key}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="gov-card"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${card.color}`}>
                <card.icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <span className="text-sm text-muted-foreground senior-text-boost">{t(`dashboard.${card.key}`)}</span>
            </div>
            <div className="text-2xl font-bold text-foreground">{card.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="gov-card"
      >
        <h2 className="mb-6 font-display text-xl font-semibold text-foreground">{t('dashboard.projection_title')}</h2>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={projectionData} margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
              <defs>
                <linearGradient id="corpusGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(214, 80%, 32%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(214, 80%, 32%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 88%)" />
              <XAxis dataKey="age" label={{ value: 'Age', position: 'bottom' }} tick={{ fontSize: 14 }} />
              <YAxis tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} tick={{ fontSize: 14 }} />
              <Tooltip
                formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, 'Corpus']}
                labelFormatter={(label) => `Age: ${label}`}
                contentStyle={{ borderRadius: '0.75rem', border: '1px solid hsl(214, 20%, 88%)' }}
              />
              <Area type="monotone" dataKey="corpus" stroke="hsl(214, 80%, 32%)" strokeWidth={3} fill="url(#corpusGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* AI Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="gov-card"
      >
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="h-5 w-5 text-accent" />
          <h2 className="font-display text-xl font-semibold text-foreground">{t('dashboard.recommendations')}</h2>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start gap-3 rounded-lg bg-secondary/50 p-4">
              <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/20 text-xs font-bold text-accent">
                {i}
              </div>
              <p className="text-sm text-foreground senior-text-boost">{t(`dashboard.rec_${i}`)}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
