import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useSeniorMode } from '@/contexts/SeniorModeContext';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe, Eye, User, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';

const languages = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'ml', label: 'മലയാളം' },
  { code: 'ta', label: 'தமிழ்' },
];

export function Navbar() {
  const { t, i18n } = useTranslation();
  const { seniorMode, toggleSeniorMode } = useSeniorMode();

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b border-border bg-card px-4 md:px-6" role="banner">
      <SidebarTrigger className="shrink-0" aria-label="Toggle sidebar" />

      <Link to="/" className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <span className="text-sm font-bold text-primary-foreground">NPS</span>
        </div>
        <span className="hidden font-display text-lg font-bold text-foreground sm:inline-block">
          {t('app_name')}
        </span>
      </Link>

      <div className="ml-auto flex items-center gap-3">
        {/* Senior Mode Toggle */}
        <div className="hidden items-center gap-2 md:flex">
          <Eye className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <label htmlFor="senior-toggle" className="text-sm text-muted-foreground cursor-pointer">
            {t('landing.senior_mode')}
          </label>
          <Switch
            id="senior-toggle"
            checked={seniorMode}
            onCheckedChange={toggleSeniorMode}
            aria-label={t('landing.senior_mode')}
          />
        </div>

        {/* Language Switcher */}
        <Select value={i18n.language} onValueChange={(val) => i18n.changeLanguage(val)}>
          <SelectTrigger className="w-[130px] gap-2" aria-label={t('common.language')}>
            <Globe className="h-4 w-4" aria-hidden="true" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {languages.map((lang) => (
              <SelectItem key={lang.code} value={lang.code}>
                {lang.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Login */}
        <Button variant="outline" size="sm" asChild className="gap-2">
          <Link to="/login">
            <LogIn className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">{t('nav.login')}</span>
          </Link>
        </Button>
      </div>
    </header>
  );
}
