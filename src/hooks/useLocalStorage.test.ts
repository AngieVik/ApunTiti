import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import useLocalStorage from "../hooks/useLocalStorage";

describe("useLocalStorage", () => {
  const key = "test-key";
  const initialValue = "initial";

  beforeEach(() => {
    window.localStorage.clear();
    vi.clearAllMocks();
  });

  it("should return initial value if no value in localStorage", () => {
    const { result } = renderHook(() => useLocalStorage(key, initialValue));
    expect(result.current[0]).toBe(initialValue);
  });

  it("should return stored value if value exists in localStorage", () => {
    window.localStorage.setItem(key, JSON.stringify("stored"));
    const { result } = renderHook(() => useLocalStorage(key, initialValue));
    expect(result.current[0]).toBe("stored");
  });

  it("should update localStorage when state changes", () => {
    const { result } = renderHook(() => useLocalStorage(key, initialValue));

    act(() => {
      result.current[1]("new-value");
    });

    expect(result.current[0]).toBe("new-value");
    expect(window.localStorage.getItem(key)).toBe(JSON.stringify("new-value"));
  });

  it("should accept a function as updater", () => {
    const { result } = renderHook(() => useLocalStorage<number>("count", 0));

    act(() => {
      result.current[1]((prev) => prev + 1);
    });

    expect(result.current[0]).toBe(1);
    expect(window.localStorage.getItem("count")).toBe(JSON.stringify(1));
  });
});
