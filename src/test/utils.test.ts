import { describe, it, expect } from "vitest";
import { formatINR, formatCompactINR, formatPercentage, cn } from "@/lib/utils";

describe("utils", () => {
  describe("cn", () => {
    it("merges classes correctly", () => {
      expect(cn("px-2 py-1", "bg-primary")).toBe("px-2 py-1 bg-primary");
      expect(cn("p-4", "p-2")).toBe("p-2");
    });
  });

  describe("formatINR", () => {
    it("formats Indian numbers with rupee symbol and Indian groupings", () => {
      const formatted = formatINR(100000);
      expect(formatted).toContain("1,00,000");
    });

    it("handles zero and invalid inputs gracefully", () => {
      expect(formatINR(0)).toBe("₹0");
      expect(formatINR(NaN)).toBe("₹0");
    });
  });

  describe("formatCompactINR", () => {
    it("formats Crores correctly", () => {
      expect(formatCompactINR(15000000)).toBe("₹1.50 Cr");
    });

    it("formats Lakhs correctly", () => {
      expect(formatCompactINR(250000)).toBe("₹2.50 Lakh");
    });

    it("formats thousands correctly", () => {
      expect(formatCompactINR(5500)).toBe("₹5.5k");
    });

    it("formats zero", () => {
      expect(formatCompactINR(0)).toBe("₹0");
    });
  });

  describe("formatPercentage", () => {
    it("formats percentages with 1 decimal place", () => {
      expect(formatPercentage(8.5)).toBe("8.5%");
      expect(formatPercentage(10)).toBe("10.0%");
    });
  });
});
