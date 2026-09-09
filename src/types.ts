export type SchoolClass = '2A' | '2B' | '2C';

export type UserRole = 'visitor' | 'student' | 'admin';

export interface SubjectInfo {
  id: string;
  nameAr: string;
  nameEn: string;
  color: string;
  textColor: string;
  borderColor: string;
  iconName: string;
}

export interface PeriodSlot {
  id: string;
  periodNum: number;
  time: string;
  subjectId: string;
  teacher?: string;
  room?: string;
}

export interface DaySchedule {
  dayNameAr: 'الأحد' | 'الإثنين' | 'الثلاثاء' | 'الأربعاء' | 'الخميس';
  dayNameEn: string;
  periods: PeriodSlot[];
}

export interface ClassTimetable {
  classId: SchoolClass;
  days: DaySchedule[];
}

export interface WeeklyPlanItem {
  id: string;
  blockId: string; // 'block1' | 'block2' | 'block3' | 'block4'
  weekId: string;  // 'week1' | 'week2' | 'week3' | ...
  classId: SchoolClass | 'all';
  subjectId: string;
  unitOrTheme: string;
  learningObjectives: string[];
  vocabulary?: string[];
  resourcesNote?: string;
  assessmentNote?: string;
  // File attachments for PDF or Word
  fileName?: string;
  fileType?: 'pdf' | 'word' | 'doc';
  fileSize?: string;
  fileDataUrl?: string;
}

export interface ClassworkRecord {
  id: string;
  subjectId: string;
  lessonTitle: string;
  details: string;
  pages?: string;
}

export interface HomeworkRecord {
  id: string;
  subjectId: string;
  assignment: string;
  dueDate?: string;
  pages?: string;
  instructions?: string;
}

export interface TomorrowPreparationItem {
  id: string;
  subjectId?: string;
  item: string;
  category: 'books' | 'tools' | 'clothes' | 'general';
  isImportant?: boolean;
}

export interface DailyFollowUp {
  id: string;
  date: string; // YYYY-MM-DD
  classId: SchoolClass;
  blockId: string;
  weekId: string;
  dayNameAr: string;
  classwork: ClassworkRecord[];
  homework: HomeworkRecord[];
  tomorrowPreparations: TomorrowPreparationItem[];
}

export interface StudentPersonalTask {
  id: string;
  studentName: string;
  classId: SchoolClass;
  title: string;
  subjectId?: string;
  completed: boolean;
  dueDate?: string;
  createdAt: string;
  notes?: string;
}

export interface StudentProfile {
  name: string;
  classId: SchoolClass;
}

export interface SchoolMaterialFile {
  id: string;
  title: string;
  subjectId: string;
  classId: SchoolClass | 'all';
  blockId?: string;
  weekId?: string;
  fileType: 'pdf' | 'doc' | 'image' | 'sheet';
  fileName: string;
  fileSize: string;
  uploadDate: string;
  uploadedBy?: string;
  description?: string;
  fileDataUrl?: string;
  previewSummary?: string;
}
