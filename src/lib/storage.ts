import {
  ClassTimetable,
  WeeklyPlanItem,
  DailyFollowUp,
  StudentPersonalTask,
  SchoolMaterialFile,
  SchoolClass
} from '../types';
import {
  INITIAL_TIMETABLES,
  INITIAL_WEEKLY_PLANS,
  INITIAL_DAILY_FOLLOW_UPS,
  INITIAL_STUDENT_TASKS,
  INITIAL_MATERIALS
} from '../data/initialData';

const STORAGE_KEYS = {
  TIMETABLES: 'nile_minya_timetables_v2',
  WEEKLY_PLANS: 'nile_minya_weekly_plans_v1',
  DAILY_FOLLOW_UPS: 'nile_minya_daily_follow_ups_v1',
  STUDENT_TASKS: 'nile_minya_student_tasks_v1',
  COMPLETED_HW: 'nile_minya_completed_hw_v1',
  MATERIALS: 'nile_minya_materials_v4',
  CURRENT_BLOCK: 'nile_minya_cur_block',
  CURRENT_WEEK: 'nile_minya_cur_week',
  SELECTED_CLASS: 'nile_minya_cur_class',
  CURRENT_STUDENT: 'nile_minya_cur_student'
};

export const getStoredTimetables = (): ClassTimetable[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TIMETABLES);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load timetables from storage', e);
  }
  return INITIAL_TIMETABLES;
};

export const saveStoredTimetables = (data: ClassTimetable[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.TIMETABLES, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save timetables to storage', e);
  }
};

export const getStoredWeeklyPlans = (): WeeklyPlanItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WEEKLY_PLANS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load weekly plans from storage', e);
  }
  return INITIAL_WEEKLY_PLANS;
};

export const saveStoredWeeklyPlans = (data: WeeklyPlanItem[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.WEEKLY_PLANS, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save weekly plans to storage', e);
  }
};

export const getStoredDailyFollowUps = (): DailyFollowUp[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DAILY_FOLLOW_UPS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load daily follow-ups from storage', e);
  }
  return INITIAL_DAILY_FOLLOW_UPS;
};

export const saveStoredDailyFollowUps = (data: DailyFollowUp[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.DAILY_FOLLOW_UPS, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save daily follow-ups to storage', e);
  }
};

export const getStoredStudentTasks = (): StudentPersonalTask[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STUDENT_TASKS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load student tasks from storage', e);
  }
  return INITIAL_STUDENT_TASKS;
};

export const saveStoredStudentTasks = (data: StudentPersonalTask[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.STUDENT_TASKS, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save student tasks to storage', e);
  }
};

export const getStoredCompletedHw = (): Record<string, boolean> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.COMPLETED_HW);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load completed homework from storage', e);
  }
  return {};
};

export const saveStoredCompletedHw = (data: Record<string, boolean>): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.COMPLETED_HW, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save completed homework to storage', e);
  }
};

export const getStoredMaterials = (): SchoolMaterialFile[] => {
  try {
    // Purge any old cache keys that had dummy materials for Block 2 & Block 3
    localStorage.removeItem('nile_minya_materials_v1');
    localStorage.removeItem('nile_minya_materials_v2');

    const raw = localStorage.getItem(STORAGE_KEYS.MATERIALS);
    if (raw) {
      const list: SchoolMaterialFile[] = JSON.parse(raw);
      // Strictly remove any unrequested materials (PE, ethics/religion, art)
      // And strictly ensure Block 2, 3, 4 are empty unless user actually uploaded a custom file
      const cleanList = list.filter((m) => {
        if (['pe', 'ethics', 'religion', 'art'].includes(m.subjectId)) return false;
        // User requested: Block 2 and Block 3 must be completely empty until user uploads
        if (m.blockId === 'block2' || m.blockId === 'block3' || m.blockId === 'block4') {
          return Boolean(m.fileDataUrl); // Only keep if user manually uploaded a real file
        }
        return true;
      });
      if (cleanList.length > 0) return cleanList;
    }
  } catch (e) {
    console.error('Failed to load materials from storage', e);
  }
  // Default: INITIAL_MATERIALS only has block1 items; blocks 2, 3, 4 are completely empty
  return INITIAL_MATERIALS.filter((m) => m.blockId === 'block1');
};

export const saveStoredMaterials = (data: SchoolMaterialFile[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.MATERIALS, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save materials to storage', e);
  }
};

export const exportAllDataToJSON = (): void => {
  const exportPayload = {
    version: '1.0',
    schoolName: 'مدرسة النيل المصرية الدولية - فرع المنيا',
    grade: 'Grade 2 (2A, 2B, 2C)',
    exportDate: new Date().toISOString(),
    timetables: getStoredTimetables(),
    weeklyPlans: getStoredWeeklyPlans(),
    dailyFollowUps: getStoredDailyFollowUps(),
    studentTasks: getStoredStudentTasks(),
    materials: getStoredMaterials()
  };

  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `nile_minya_grade2_backup_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
};

export const resetAllDataToDefault = (): void => {
  localStorage.removeItem(STORAGE_KEYS.TIMETABLES);
  localStorage.removeItem(STORAGE_KEYS.WEEKLY_PLANS);
  localStorage.removeItem(STORAGE_KEYS.DAILY_FOLLOW_UPS);
  localStorage.removeItem(STORAGE_KEYS.STUDENT_TASKS);
  localStorage.removeItem(STORAGE_KEYS.COMPLETED_HW);
  localStorage.removeItem(STORAGE_KEYS.MATERIALS);
};
