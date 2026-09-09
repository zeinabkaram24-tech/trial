import mammoth from 'mammoth';
import { extractTextFromPdf } from './timetableParser';

export interface WeeklyPlanDayContent {
  classworkNote?: string;
  homeworkNote?: string;
  tomorrowNote?: string;
}

export interface WeeklyPlanExtractedContent {
  extractedText: string;
  classworkNote?: string;
  homeworkNote?: string;
  tomorrowNote?: string;
  dayContent: Record<string, WeeklyPlanDayContent>;
}

const DAY_NAMES = [
  { ar: 'الأحد', aliases: ['الأحد', 'الاحد', 'sunday', 'sun'] },
  { ar: 'الإثنين', aliases: ['الإثنين', 'الاثنين', 'monday', 'mon'] },
  { ar: 'الثلاثاء', aliases: ['الثلاثاء', 'tuesday', 'tue'] },
  { ar: 'الأربعاء', aliases: ['الأربعاء', 'الاربعاء', 'wednesday', 'wed'] },
  { ar: 'الخميس', aliases: ['الخميس', 'thursday', 'thu'] }
];

const HEADER_PATTERNS = {
  homework: /(?:^|\n)\s*(?:homework|home\s*work|assignment|واجب(?:ات)?|الواجب(?:ات)?)\s*[:\-]?\s*/i,
  tomorrow: /(?:^|\n)\s*(?:tomorrow|next day|preparation|notes?|materials? needed|ملاحظات|تجهيزات|مستلزمات|غدًا|غدا|اليوم التالي)\s*[:\-]?\s*/i,
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
  const stops = otherHeaders.map((header) => header.exec(remaining)?.index).filter((index): index is number => index !== undefined);
  return clean(remaining.slice(0, stops.length ? Math.min(...stops) : remaining.length));
}

function classify(text: string): WeeklyPlanDayContent {
  const headers = Object.values(HEADER_PATTERNS);
  return {
    classworkNote: section(text, HEADER_PATTERNS.classwork, headers.filter((h) => h !== HEADER_PATTERNS.classwork)),
    homeworkNote: section(text, HEADER_PATTERNS.homework, headers.filter((h) => h !== HEADER_PATTERNS.homework)),
    tomorrowNote: section(text, HEADER_PATTERNS.tomorrow, headers.filter((h) => h !== HEADER_PATTERNS.tomorrow))
  };
}

function splitByDay(text: string): Record<string, WeeklyPlanDayContent> {
  const result: Record<string, WeeklyPlanDayContent> = {};
  const dayPattern = new RegExp(`(?:^|\\n)\\s*(${DAY_NAMES.flatMap((day) => day.aliases).join('|')})\\s*[:\\-]?\\s*`, 'gim');
  const matches = [...text.matchAll(dayPattern)];
  matches.forEach((match, index) => {
    const alias = match[1]?.toLowerCase();
    const day = DAY_NAMES.find((item) => item.aliases.some((candidate) => candidate.toLowerCase() === alias));
    if (!day || match.index === undefined) return;
    const start = (match.index || 0) + match[0].length;
    const end = index + 1 < matches.length ? (matches[index + 1].index || text.length) : text.length;
    result[day.ar] = classify(text.slice(start, end));
  });
  return result;
}

export function parseWeeklyPlanText(text: string): WeeklyPlanExtractedContent {
  const normalized = text.replace(/\r/g, '\n');
  const overall = classify(normalized);
  return { extractedText: normalized.trim(), ...overall, dayContent: splitByDay(normalized) };
}

function dataUrlToArrayBuffer(dataUrl: string): ArrayBuffer {
  const raw = dataUrl.split(',')[1] || dataUrl;
  const bytes = Uint8Array.from(atob(raw), (char) => char.charCodeAt(0));
  return bytes.buffer;
}

export async function extractWeeklyPlanText(dataUrl: string, fileType?: string): Promise<string> {
  if (fileType === 'word' || fileType === 'doc' || /word|document|msword/i.test(dataUrl.slice(0, 80))) {
    const result = await mammoth.extractRawText({ arrayBuffer: dataUrlToArrayBuffer(dataUrl) });
    return result.value;
  }
  return extractTextFromPdf(dataUrl);
}

export function buildClassworkFromWeeklyPlan(plan: { classworkNote?: string; unitOrTheme: string }): string {
  return plan.classworkNote || plan.unitOrTheme;
}
