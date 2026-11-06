import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { FileText, FileCheck, Award, Download, ExternalLink, ShieldCheck, CheckCircle2, Lock, KeyRound } from 'lucide-react';
import { INITIAL_DOCUMENTS, verifyOtp, generateCertificateContent, type DigiLockerDoc } from '@/lib/digilockerService';
import { toast } from 'sonner';

export default function DigiLockerPage() {
  const { t } = useTranslation();
  const [docs, setDocs] = useState<DigiLockerDoc[]>(INITIAL_DOCUMENTS);
  const [isFetching, setIsFetching] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<DigiLockerDoc | null>(null);
  const [otpInput, setOtpInput] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleFetchFromDigiLocker = () => {
    setIsFetching(true);
    toast.info('Connecting to DigiLocker Secure Gateway...');
    setTimeout(() => {
      setIsFetching(false);
      toast.success('All documents synchronized with DigiLocker!');
    }, 1200);
  };

  const handleDownload = (doc: DigiLockerDoc) => {
    if (doc.status === 'pending') {
      setSelectedDoc(doc);
      return;
    }
    const content = generateCertificateContent(doc);
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${doc.key}-verified.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Downloaded verified ${doc.name}`);
  };

  const handleVerifyOtp = () => {
    setIsVerifying(true);
    const result = verifyOtp(otpInput);
    setTimeout(() => {
      setIsVerifying(false);
      if (result.success && selectedDoc) {
        setDocs((prev) =>
          prev.map((d) => (d.id === selectedDoc.id ? { ...d, status: 'verified' } : d))
        );
        toast.success(result.message);
        setSelectedDoc(null);
        setOtpInput('');
      } else {
        toast.error(result.message);
      }
    }, 800);
  };

  const iconMap: Record<string, any> = {
    nps_statement: FileText,
    kyc_docs: FileCheck,
    pan_record: ShieldCheck,
    pension_cert: Award,
  };

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">{t('digilocker.title')}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Access, verify, and download your government-authenticated NPS certificates & identity records.
          </p>
        </div>
        <Button
          onClick={handleFetchFromDigiLocker}
          disabled={isFetching}
          className="gap-2 senior-btn-boost"
        >
          <ExternalLink className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
          {isFetching ? 'Synchronizing...' : t('digilocker.fetch')}
        </Button>
      </div>

      {/* DigiLocker Trust Banner */}
      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 flex items-center gap-3 text-sm text-foreground">
        <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
        <div>
          <span className="font-semibold">MeitY Certified Integration: </span>
          <span className="text-muted-foreground">
            All records retrieved here are legally recognized at par with original physical documents under the IT Act, 2000.
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {docs.map((doc, i) => {
          const Icon = iconMap[doc.key] || FileText;
          return (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="gov-card flex flex-col justify-between"
            >
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <span
                    className={`gov-badge ${
                      doc.status === 'verified'
                        ? 'bg-success/10 text-success'
                        : 'bg-warning/10 text-warning'
                    }`}
                  >
                    {doc.status === 'verified' ? 'Verified' : 'Pending OTP'}
                  </span>
                </div>

                <h3 className="font-display text-base font-semibold text-foreground mb-1">
                  {doc.name}
                </h3>
                <p className="text-xs text-muted-foreground mb-1">{doc.issuer}</p>
                <p className="text-xs font-mono text-muted-foreground/80 mb-4">{doc.docNumber}</p>
              </div>

              <Button
                variant={doc.status === 'verified' ? 'outline' : 'default'}
                size="sm"
                className="w-full gap-2 mt-2"
                onClick={() => handleDownload(doc)}
              >
                {doc.status === 'verified' ? (
                  <>
                    <Download className="h-4 w-4" />
                    Download
                  </>
                ) : (
                  <>
                    <KeyRound className="h-4 w-4" />
                    Verify with OTP
                  </>
                )}
              </Button>
            </motion.div>
          );
        })}
      </div>

      {/* OTP Verification Modal */}
      <Dialog open={!!selectedDoc} onOpenChange={(open) => !open && setSelectedDoc(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              DigiLocker OTP Verification
            </DialogTitle>
            <DialogDescription>
              Enter the 6-digit Aadhaar OTP sent to your registered mobile number to authenticate{' '}
              <span className="font-semibold text-foreground">{selectedDoc?.name}</span>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="otp-input" className="text-sm font-medium text-foreground">
                6-Digit OTP (Mock: 123456)
              </label>
              <Input
                id="otp-input"
                maxLength={6}
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value)}
                placeholder="123456"
                className="text-center tracking-widest text-lg font-mono"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setSelectedDoc(null)}>
              Cancel
            </Button>
            <Button onClick={handleVerifyOtp} disabled={otpInput.length !== 6 || isVerifying}>
              {isVerifying ? 'Verifying...' : 'Authenticate & Issue'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
