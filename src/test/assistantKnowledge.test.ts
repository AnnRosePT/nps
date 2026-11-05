import { describe, it, expect } from "vitest";
import { resolveAssistantQuery, getDefaultWelcomeMessage, KNOWLEDGE_BASE } from "@/lib/assistantKnowledge";

describe("assistantKnowledge", () => {
  it("returns default welcome message when query is empty or whitespace", () => {
    expect(resolveAssistantQuery("")).toBe(getDefaultWelcomeMessage());
    expect(resolveAssistantQuery("   ")).toBe(getDefaultWelcomeMessage());
  });

  it("resolves tax benefits question including Section 80CCD", () => {
    const response = resolveAssistantQuery("how much tax can I save under 80ccd?");
    expect(response).toContain("Section 80CCD(1B)");
    expect(response).toContain("₹50,000");
  });

  it("resolves withdrawal questions correctly", () => {
    const response = resolveAssistantQuery("can I withdraw my money before 60?");
    expect(response).toContain("Premature Exit");
    expect(response).toContain("Annuity");
  });

  it("resolves Hindi phrases for withdrawal and NPS explanation", () => {
    const hindiWithdraw = resolveAssistantQuery("pension nikalna kab allowed hai?");
    expect(hindiWithdraw).toContain("Normal Superannuation");

    const hindiNps = resolveAssistantQuery("nps kya hai?");
    expect(hindiNps).toContain("PFRDA");
  });

  it("resolves Tier 1 vs Tier 2 differences", () => {
    const response = resolveAssistantQuery("what is difference between tier 1 and tier 2");
    expect(response).toContain("Tier 1 (Retirement Account)");
    expect(response).toContain("Tier 2 (Savings Account)");
  });

  it("redirects calculation questions to Pension Simulator", () => {
    const response = resolveAssistantQuery("how much corpus will I have at 60?");
    expect(response).toContain("Pension Simulator");
  });

  it("has valid knowledge items with keywords and responses", () => {
    expect(KNOWLEDGE_BASE.length).toBeGreaterThanOrEqual(6);
    KNOWLEDGE_BASE.forEach((item) => {
      expect(item.keywords.length).toBeGreaterThan(0);
      expect(item.response.length).toBeGreaterThan(20);
    });
  });
});
