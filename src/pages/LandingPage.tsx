import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import heroFamily from '@/assets/hero-family.png';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { BookOpen, Bot, Mic, TrendingUp, ArrowRight, Shield, Users, IndianRupee } from 'lucide-react';

const features = [
  { icon: BookOpen, titleKey: 'landing.feature_1_title', descKey: 'landing.feature_1_desc' },
  { icon: Bot, titleKey: 'landing.feature_2_title', descKey: 'landing.feature_2_desc' },
  { icon: Mic, titleKey: 'landing.feature_3_title', descKey: 'landing.feature_3_desc' },
  { icon: TrendingUp, titleKey: 'landing.feature_4_title', descKey: 'landing.feature_4_desc' },
];

const stats = [
  { icon: Users, value: '4.7 Cr+', label: 'NPS Subscribers' },
  { icon: IndianRupee, value: '₹12.8L Cr', label: 'Assets Under Management' },
  { icon: Shield, value: '100%', label: 'Government Regulated' },
];

export default function LandingPage() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-primary px-4 py-20 md:py-28" role="banner">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 25% 50%, hsl(var(--accent)) 0%, transparent 50%), radial-gradient(circle at 75% 50%, hsl(var(--info)) 0%, transparent 50%)'
        }} />
        <div className="container relative mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="gov-badge mb-6 bg-primary-foreground/15 text-primary-foreground inline-block">
              🇮🇳 {t('tagline')}
            </span>
            <h1 className="mb-6 font-display text-4xl font-extrabold leading-tight tracking-tight text-primary-foreground md:text-5xl lg:text-6xl">
              {t('landing.hero_title')}
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-accessible-lg text-primary-foreground/85 senior-text-boost">
              {t('landing.hero_subtitle')}
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90 senior-btn-boost text-lg px-8 py-6 rounded-xl shadow-lg">
                <Link to="/dashboard">
                  {t('landing.cta')}
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="gap-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 text-lg px-8 py-6 rounded-xl">
                <a href="#what-is-nps">
                  {t('landing.cta_learn')}
                </a>
              </Button>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mx-auto mt-12 max-w-2xl overflow-hidden rounded-2xl shadow-2xl"
          >
            <img src={heroFamily} alt="Happy grandparents with grandchildren planning their future" className="w-full h-auto object-cover" />
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border bg-card py-8">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex items-center justify-center gap-3 text-center"
              >
                <stat.icon className="h-8 w-8 text-primary" />
                <div>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="gov-section bg-background">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, i) => (
              <motion.div
                key={feature.titleKey}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="gov-card flex flex-col items-center text-center"
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                  <feature.icon className="h-7 w-7 text-primary" aria-hidden="true" />
                </div>
                <h3 className="mb-2 font-display text-lg font-semibold text-foreground">{t(feature.titleKey)}</h3>
                <p className="text-sm text-muted-foreground senior-text-boost">{t(feature.descKey)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What is NPS */}
      <section id="what-is-nps" className="gov-section bg-secondary/50">
        <div className="container mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-6 font-display text-3xl font-bold text-foreground">{t('landing.what_is_nps')}</h2>
            <p className="text-accessible-lg text-muted-foreground leading-relaxed senior-text-boost">
              {t('landing.nps_explanation')}
            </p>
            <div className="mt-8">
              <Button asChild size="lg" className="gap-2 senior-btn-boost">
                <Link to="/simulator">
                  <Calculator className="h-5 w-5" />
                  {t('nav.simulator')}
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function Calculator(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="16" height="20" x="4" y="2" rx="2" /><line x1="8" x2="16" y1="6" y2="6" /><line x1="16" x2="16" y1="14" y2="18" /><path d="M16 10h.01" /><path d="M12 10h.01" /><path d="M8 10h.01" /><path d="M12 14h.01" /><path d="M8 14h.01" /><path d="M12 18h.01" /><path d="M8 18h.01" />
    </svg>
  );
}
