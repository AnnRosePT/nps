import { describe, it, expect } from "vitest";

function calculateLifecycleAllocation(age: number, maxEquity: 75 | 50 | 25) {
  if (age <= 35) {
    const equity = maxEquity;
    const debt = 100 - maxEquity;
    const corporate = Math.round(debt * 0.6);
    const govt = debt - corporate;
    return { equity, corporate, govt };
  }
  const yearsPast35 = Math.min(20, age - 35);
  const minEquity = maxEquity === 75 ? 15 : maxEquity === 50 ? 10 : 5;
  const equityReduction = ((maxEquity - minEquity) / 20) * yearsPast35;
  const equity = Math.round(maxEquity - equityReduction);
  const remaining = 100 - equity;
  const corporate = Math.round(remaining * (maxEquity === 75 ? 0.3 : 0.5));
  const govt = remaining - corporate;
  return { equity, corporate, govt };
}

describe("schemes & lifecycle allocations", () => {
  it("keeps max equity until age 35 for LC75", () => {
    const alloc = calculateLifecycleAllocation(30, 75);
    expect(alloc.equity).toBe(75);
    expect(alloc.equity + alloc.corporate + alloc.govt).toBe(100);
  });

  it("reduces equity gradually past age 35 for LC75", () => {
    const at45 = calculateLifecycleAllocation(45, 75);
    expect(at45.equity).toBeLessThan(75);
    expect(at45.equity).toBeGreaterThan(15);
    expect(at45.equity + at45.corporate + at45.govt).toBe(100);
  });

  it("reaches minimum equity floor at age 55+", () => {
    const at55 = calculateLifecycleAllocation(55, 75);
    expect(at55.equity).toBe(15);

    const at60 = calculateLifecycleAllocation(60, 50);
    expect(at60.equity).toBe(10);
  });
});
