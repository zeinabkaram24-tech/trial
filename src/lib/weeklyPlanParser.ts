export interface WeeklyPlanExtractedContent {
  extractedText: string;
  classworkNote?: string;
  homeworkNote?: string;
  tomorrowNote?: string;
}

const HEADER_PATTERNS = {
  homework: /(?:^|\n)\s*(?:homework|home\s*work|واجب(?:ات)?|الواجب(?:ات)?|homework assignment)\s*[:\-]?\s*/i,
  tomorrow: /(?:^|\n)\s*(?:tomorrow|next day|preparation|notes?|ملاحظات|تجهيزات|مستلزمات|غدًا|غدا|اليوم التالي)\s*[:\-]?\s*/i,
  classwork: /(?:^|\n)\s*(?:classwork|class work|lesson|session|what we learned|تم تدريسه|ما تم تدريسه|الدرس|الحصة)\s*[:\-]?\s*/i
};

function clean(value: string): string | undefined {
  const result = value.replace(/\s+/g, ' ').trim();
  return result || undefined;
}

function section(text: string, start: RegExp, otherHeaders: RegExp[]): string | undefined {
  const match = start.exec(text);
  if (!match || match.index === undefined) return undefined;
  const remaining = text.slice(match.index + match[0].length);
  const stops = otherHeaders
    .map((header) => header.exec(remaining)?.index)
    .filter((index): index is number => index !== undefined);
  const end = stops.length ? Math.min(...stops) : remaining.length;
  return clean(remaining.slice(0, end));
}

export function parseWeeklyPlanText(text: string): WeeklyPlanExtractedContent {
  const normalized = text.replace(/\r/g, '\n');
  const allHeaders = Object.values(HEADER_PATTERNS);
  return {
    extractedText: normalized.trim(),
    homeworkNote: section(normalized, HEADER_PATTERNS.homework, allHeaders.filter((h) => h !== HEADER_PATTERNS.homework)),
    tomorrowNote: section(normalized, HEADER_PATTERNS.tomorrow, allHeaders.filter((h) => h !== HEADER_PATTERNS.tomorrow)),
    classworkNote: section(normalized, HEADER_PATTERNS.classwork, allHeaders.filter((h) => h !== HEADER_PATTERNS.classwork))
  };
}

export function buildClassworkFromWeeklyPlan(plan: { classworkNote?: string; unitOrTheme: string }): string {
  return plan.classworkNote || plan.unitOrTheme;
}
