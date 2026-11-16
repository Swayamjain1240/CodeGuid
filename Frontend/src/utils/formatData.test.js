import { describe, expect, it } from "vitest";
import { formatDate, timeAgo } from "./formatData.js";

describe("formatData", () => {
  it("formats a real timestamp instead of returning N/A", () => {
    const formatted = formatDate("2026-01-15T10:30:00.000Z");

    expect(formatted).not.toBe("N/A");
    expect(formatted).toMatch(/Jan 1[45], 2026/);
  });

  it("returns N/A for missing or invalid dates", () => {
    expect(formatDate(null)).toBe("N/A");
    expect(formatDate(undefined)).toBe("N/A");
    expect(formatDate("not-a-date")).toBe("N/A");
  });

  it("computes minute and hour buckets without throwing", () => {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString();

    expect(timeAgo(fiveMinutesAgo)).toBe("5m ago");
    expect(timeAgo(threeHoursAgo)).toBe("3h ago");
    expect(timeAgo("")).toBe("");
    expect(timeAgo("not-a-date")).toBe("");
  });
});
