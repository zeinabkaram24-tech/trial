import mammoth from 'mammoth';
import { extractTextFromPdf } from './timetableParser';

export const WEEKLY_PLAN_PARSER_VERSION = 5;

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
  homework: /(?:h\s*o\s*m\s*e\s*w\s*o\s*r\s*k|home\s*work|assignment|واجب(?:ات)?|الواجب(?:ات)?|hw)\s*[:：\-–]?/i,
  tomorrow: /(?:t\s*o\s*m\s*o\s*r\s*r\s*o\s*w(?:['’]s)?|next\s*day|preparation|what\s*to\s*bring|school\s*bag|materials?\s*(?:needed|required)|تجهيزات\s*(?:الغد|لبكرة)|مستلزمات\s*(?:الغد|لبكرة)|ملاحظات\s*الغد|غدًا|غدا|اليوم\s*التالي)\s*[:：\-–]?/i,
  // Do not match generic words such as "lesson" or "session": they often
  // occur in the PDF title and caused the title/details to be misclassified.
  classwork: /(?:c\s*l\s*a\s*s\s*s\s*w\s*o\s*r\s*k|class\s*work|what\s+we\s+learned|تم\s*تدريسه|ما\s*تم\s*تدريسه|نشاط\s*اليوم)\s*[:：\-–]?/i
};

const ALL_HEADERS = Object.values(HEADER_PATTERNS);

function normalize(text: string): string {
  return text
    .replace(/\u0000/g, ' ')
    .replace(/\r\n?/g, '\n')
    .replace(/[\u200e\u200f]/g, '')
    .trim();
}

function clean(value: string): string | undefined {
  const result = value.replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
  return result || undefined;
}

function findHeader(text: string, pattern: RegExp): RegExpExecArray | null {
  const flags = pattern.flags.includes('g') ? pattern.flags : `${pattern.flags}g`;
  return new RegExp(pattern.source, flags).exec(text);
}

function classify(text: string): WeeklyPlanDayContent {
  const found = Object.entries(HEADER_PATTERNS)
    .map(([kind, pattern]) => {
      const match = findHeader(text, pattern);
      return match ? { kind: kind as keyof WeeklyPlanDayContent, index: match.index, end: match.index + match[0].length } : null;
    })
    .filter((item): item is { kind: keyof WeeklyPlanDayContent; index: number; end: number } => Boolean(item))
    .sort((a, b) => a.index - b.index);

  const result: WeeklyPlanDayContent = {};
  found.forEach((header, index) => {
    const next = found[index + 1]?.index ?? text.length;
    const content = clean(text.slice(header.end, next));
    if (content) result[header.kind] = content;
  });

  // Never use the entire document as classwork. A PDF commonly starts with a
  // title such as "Weekly Lesson Plan"; treating that title as the lesson is
  // precisely the misleading behaviour this parser must avoid.
  return result;
}

function dayFromAlias(value: string) {
  const normalized = value.toLowerCase().replace(/[.:：\-–]/g, '').trim();
  return DAY_NAMES.find((day) => day.aliases.some((alias) => alias.toLowerCase() === normalized));
}

function splitByDay(text: string): Record<string, WeeklyPlanDayContent> {
  const result: Record<string, WeeklyPlanDayContent> = {};
  const lines = text.split('\n');
  const sections: Array<{ day: string; start: number; end: number }> = [];
  lines.forEach((line, index) => {
    const match = line.match(/^\s*(الأحد|الاحد|الإثنين|الاثنين|الثلاثاء|الأربعاء|الاربعاء|الخميس|Sunday|Sun|Monday|Mon|Tuesday|Tue|Wednesday|Wed|Thursday|Thu)\s*(?:[:：\-–]|$)/i);
    const day = match ? dayFromAlias(match[1]) : undefined;
    if (day) sections.push({ day: day.ar, start: index, end: lines.length });
  });
  sections.forEach((section, index) => {
    section.end = sections[index + 1]?.start ?? lines.length;
    const dayText = lines.slice(section.start + 1, section.end).join('\n');
    const content = classify(dayText);
    if (content.classworkNote || content.homeworkNote || content.tomorrowNote) result[section.day] = content;
  });
  return result;
}

export function parseWeeklyPlanText(text: string): WeeklyPlanExtractedContent {
  const normalized = normalize(text);
  const overall = classify(normalized);
  return {
    extractedText: normalized,
    classworkNote: overall.classworkNote,
    homeworkNote: overall.homeworkNote,
    tomorrowNote: overall.tomorrowNote,
    dayContent: splitByDay(normalized)
  };
}

function dataUrlToArrayBuffer(dataUrl: string): ArrayBuffer {
  const raw = dataUrl.split(',')[1] || dataUrl;
  const binary = atob(raw);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return bytes.buffer;
}

export async function extractWeeklyPlanText(dataUrl: string, fileType?: string): Promise<string> {
  if (fileType === 'word' || fileType === 'doc' || /word|document|msword/i.test(dataUrl.slice(0, 100))) {
    const result = await mammoth.extractRawText({ arrayBuffer: dataUrlToArrayBuffer(dataUrl) });
    return result.value;
  }
  return extractTextFromPdf(dataUrl);
}

export function buildClassworkFromWeeklyPlan(plan: { classworkNote?: string; unitOrTheme: string }): string {
  return plan.classworkNote || plan.unitOrTheme;
}
