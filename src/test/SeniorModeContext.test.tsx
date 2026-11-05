import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { SeniorModeProvider, useSeniorMode } from "@/contexts/SeniorModeContext";
import React from "react";

describe("SeniorModeContext", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = "";
  });

  it("defaults to seniorMode false", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <SeniorModeProvider>{children}</SeniorModeProvider>
    );
    const { result } = renderHook(() => useSeniorMode(), { wrapper });

    expect(result.current.seniorMode).toBe(false);
    expect(document.documentElement.classList.contains("senior-mode")).toBe(false);
  });

  it("toggles seniorMode and updates document class and localStorage", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <SeniorModeProvider>{children}</SeniorModeProvider>
    );
    const { result } = renderHook(() => useSeniorMode(), { wrapper });

    act(() => {
      result.current.toggleSeniorMode();
    });

    expect(result.current.seniorMode).toBe(true);
    expect(document.documentElement.classList.contains("senior-mode")).toBe(true);
    expect(localStorage.getItem("seniorMode")).toBe("true");

    act(() => {
      result.current.toggleSeniorMode();
    });

    expect(result.current.seniorMode).toBe(false);
    expect(document.documentElement.classList.contains("senior-mode")).toBe(false);
    expect(localStorage.getItem("seniorMode")).toBe("false");
  });
});
