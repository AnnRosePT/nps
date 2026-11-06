import { describe, it, expect } from "vitest";
import { verifyOtp, generateCertificateContent, INITIAL_DOCUMENTS } from "@/lib/digilockerService";

describe("digilockerService", () => {
  it("contains initial set of essential government documents", () => {
    expect(INITIAL_DOCUMENTS.length).toBeGreaterThanOrEqual(3);
    const keys = INITIAL_DOCUMENTS.map((d) => d.key);
    expect(keys).toContain("nps_statement");
    expect(keys).toContain("kyc_docs");
    expect(keys).toContain("pan_record");
  });

  describe("verifyOtp", () => {
    it("accepts valid 6-digit numeric OTP", () => {
      const result = verifyOtp("123456");
      expect(result.success).toBe(true);
      expect(result.message).toContain("successfully");
    });

    it("rejects non-numeric OTPs", () => {
      const result = verifyOtp("12a456");
      expect(result.success).toBe(false);
      expect(result.message).toContain("6-digit numeric OTP");
    });

    it("rejects OTPs with invalid lengths", () => {
      expect(verifyOtp("123").success).toBe(false);
      expect(verifyOtp("1234567").success).toBe(false);
    });
  });

  describe("generateCertificateContent", () => {
    it("formats text certificate with PFRDA legal citations and document number", () => {
      const doc = INITIAL_DOCUMENTS[0];
      const cert = generateCertificateContent(doc);
      expect(cert).toContain("GOVERNMENT OF INDIA - DIGILOCKER VERIFIED DOCUMENT");
      expect(cert).toContain(doc.name);
      expect(cert).toContain(doc.docNumber);
      expect(cert).toContain("PFRDA");
      expect(cert).toContain("2016");
    });
  });
});
