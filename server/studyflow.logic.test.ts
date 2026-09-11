import { describe, expect, it } from "vitest";
import { calculateProgress, canEdit } from "../shared/studyflow";

describe("StudyFlow business rules", () => {
  it("allows edits only for the admin role", () => {
    expect(canEdit("admin")).toBe(true);
    expect(canEdit("student")).toBe(false);
    expect(canEdit("visitor")).toBe(false);
  });

  it("calculates a safe rounded progress percentage", () => {
    expect(calculateProgress(1, 6)).toBe(17);
    expect(calculateProgress(6, 6)).toBe(100);
    expect(calculateProgress(0, 0)).toBe(0);
  });
});
