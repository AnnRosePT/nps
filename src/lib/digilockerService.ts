/**
 * DigiLocker Integration Service (NPS Saathi)
 * Handles secure document verification, Aadhaar/PAN e-KYC matching,
 * and PRAN certificate generation.
 */

export interface DigiLockerDoc {
  id: string;
  name: string;
  key: string;
  issuer: string;
  docNumber: string;
  issueDate: string;
  status: 'verified' | 'available' | 'pending';
  fileType: 'pdf' | 'xml';
}

export const INITIAL_DOCUMENTS: DigiLockerDoc[] = [
  {
    id: 'doc-nps-stmt',
    name: 'NPS e-PRAN Statement',
    key: 'nps_statement',
    issuer: 'PFRDA / Protean CRA',
    docNumber: 'PRAN-1100-8492-3819',
    issueDate: '01 Nov 2026',
    status: 'verified',
    fileType: 'pdf',
  },
  {
    id: 'doc-aadhaar',
    name: 'Aadhaar e-KYC Document',
    key: 'kyc_docs',
    issuer: 'UIDAI',
    docNumber: 'XXXX-XXXX-4819',
    issueDate: '15 May 2024',
    status: 'verified',
    fileType: 'xml',
  },
  {
    id: 'doc-pan',
    name: 'PAN Verification Record',
    key: 'pan_record',
    issuer: 'Income Tax Department',
    docNumber: 'ABCDE1234F',
    issueDate: '10 Aug 2023',
    status: 'verified',
    fileType: 'pdf',
  },
  {
    id: 'doc-pension-cert',
    name: 'Pension Entitlement Certificate',
    key: 'pension_cert',
    issuer: 'Central Recordkeeping Agency (CRA)',
    docNumber: 'CERT-2026-NPS-782',
    issueDate: 'Pending Maturity',
    status: 'pending',
    fileType: 'pdf',
  },
];

/**
 * Validates a 6-digit mock DigiLocker / Aadhaar OTP.
 */
export function verifyOtp(otp: string): { success: boolean; message: string } {
  const cleanOtp = otp.trim();
  if (cleanOtp.length !== 6 || !/^\d+$/.test(cleanOtp)) {
    return { success: false, message: 'Please enter a valid 6-digit numeric OTP.' };
  }
  if (cleanOtp === '123456' || cleanOtp === '000000') {
    return { success: true, message: 'OTP verified successfully with DigiLocker gateway.' };
  }
  // Standard acceptance for testing simulation
  return { success: true, message: 'Verification successful.' };
}

/**
 * Generates downloadable certificate text content.
 */
export function generateCertificateContent(doc: DigiLockerDoc): string {
  return `=====================================================
GOVERNMENT OF INDIA - DIGILOCKER VERIFIED DOCUMENT
=====================================================
Document Name: ${doc.name}
Document Ref:  ${doc.docNumber}
Issued By:     ${doc.issuer}
Issued Date:   ${doc.issueDate}
Status:        DIGITALLY SIGNED & VERIFIED (PFRDA)

This document is issued under the Information Technology
(Preservation and Retention of Information by Intermediaries
Providing Digital Locker Facilities) Rules, 2016.
=====================================================`;
}
