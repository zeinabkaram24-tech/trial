export type StudyRole = "visitor" | "student" | "admin";

export function canEdit(role: StudyRole) {
  return role === "admin";
}

export function calculateProgress(completed: number, total: number) {
  if (total <= 0) return 0;
  return Math.round((completed / total) * 100);
}
