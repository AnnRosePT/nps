import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';
import { LogIn, UserPlus, Shield } from 'lucide-react';

export default function LoginPage() {
  const { t } = useTranslation();
  const [isRegister, setIsRegister] = useState(false);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md gov-card"
      >
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary">
            <Shield className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            {isRegister ? t('auth.register') : t('auth.login')}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{t('app_name')}</p>
        </div>

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          {isRegister && (
            <>
              <div className="space-y-2">
                <Label htmlFor="name" className="text-base">{t('auth.name')}</Label>
                <Input id="name" type="text" className="h-12 text-base" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-base">{t('auth.phone')}</Label>
                <Input id="phone" type="tel" className="h-12 text-base" />
              </div>
            </>
          )}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-base">{t('auth.email')}</Label>
            <Input id="email" type="email" className="h-12 text-base" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-base">{t('auth.password')}</Label>
            <Input id="password" type="password" className="h-12 text-base" />
          </div>

          {!isRegister && (
            <div className="text-right">
              <button type="button" className="text-sm text-primary hover:underline">{t('auth.forgot')}</button>
            </div>
          )}

          <Button type="submit" size="lg" className="w-full gap-2 text-lg senior-btn-boost">
            {isRegister ? <UserPlus className="h-5 w-5" /> : <LogIn className="h-5 w-5" />}
            {isRegister ? t('auth.register') : t('auth.login')}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="text-sm text-primary hover:underline"
          >
            {isRegister ? t('auth.has_account') : t('auth.no_account')}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
