import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { FileText, FileCheck, Award, Download, ExternalLink } from 'lucide-react';

const documents = [
  { key: 'nps_statement', icon: FileText, status: 'available' },
  { key: 'kyc_docs', icon: FileCheck, status: 'available' },
  { key: 'pension_cert', icon: Award, status: 'pending' },
];

export default function DigiLockerPage() {
  const { t } = useTranslation();

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-bold text-foreground">{t('digilocker.title')}</h1>
        <Button className="gap-2 senior-btn-boost">
          <ExternalLink className="h-4 w-4" />
          {t('digilocker.fetch')}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {documents.map((doc, i) => (
          <motion.div
            key={doc.key}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="gov-card flex flex-col items-center text-center"
          >
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <doc.icon className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mb-2 font-display text-lg font-semibold text-foreground">{t(`digilocker.${doc.key}`)}</h3>
            <span className={`gov-badge mb-4 ${doc.status === 'available' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
              {doc.status === 'available' ? 'Available' : 'Pending'}
            </span>
            <Button variant="outline" size="sm" className="gap-2" disabled={doc.status !== 'available'}>
              <Download className="h-4 w-4" />
              Download
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
