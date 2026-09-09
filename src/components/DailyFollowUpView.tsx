import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  CheckSquare,
  Package,
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  Plus,
  Edit2,
  Trash2,
  AlertCircle,
  Sparkles,
  Share2,
  Printer,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Check
} from 'lucide-react';
import {
  DailyFollowUp,
  SchoolClass,
  UserRole,
  ClassworkRecord,
  HomeworkRecord,
  TomorrowPreparationItem,
  ClassTimetable,
  PeriodSlot
} from '../types';
import { SubjectBadge, getSubjectInfo } from './SubjectBadge';
import { SUBJECTS, INITIAL_TIMETABLES } from '../data/initialData';

const NEXT_DAY_MAP: Record<string, string> = {
  'الأحد': 'الإثنين',
  'الإثنين': 'الثلاثاء',
  'الثلاثاء': 'الأربعاء',
  'الأربعاء': 'الخميس',
  'الخميس': 'الأحد'
};

const SUBJECT_PACKING_KIT: Record<string, { book: string; notebook: string; tools: string }> = {
  english: {
    book: "كتاب Cambridge Primary English (Learner's Book + Activity Book)",
    notebook: 'كشكول إنجليزي مسطر (4 أسطر)',
    tools: 'مقلمة، قلم رصاص HB، ممحاة، براية'
  },
  math: {
    book: "كتاب Cambridge Primary Math (Learner's Book + Workbook)",
    notebook: 'كشكول ماث مربعات (Grid Notebook)',
    tools: 'مسطرة 20 سم، قلم رصاص، ممحاة'
  },
  science: {
    book: "كتاب Cambridge Primary Science (Learner's Book)",
    notebook: 'كشكول الساينس للأنشطة والتجارب',
    tools: 'ألوان خشبية للرسومات التوضيحية'
  },
  arabic: {
    book: 'كتاب تواصل (اللغة العربية) + كراسة الأنشطة',
    notebook: 'كشكول عربي مسطر سطرين',
    tools: 'قلم رصاص + ممحاة'
  },
  social: {
    book: 'كتاب الدراسات الاجتماعية والمواطنة',
    notebook: 'كشكول الدراسات الاجتماعية',
    tools: 'ألوان خشبية ومسطرة'
  },
  french: {
    book: "كتاب الفرنسية (Alex et Zoé - Livre de l'élève)",
    notebook: 'كشكول الفرنساوي',
    tools: 'أقلام رصاص وممحاة'
  },
  ict: {
    book: 'كتاب تكنولوجيا المعلومات والاتصالات ICT',
    notebook: 'كشكول الحاسب الآلي',
    tools: 'جاهزية الحصة بمعمل الحاسب الآلي'
  },
  art: {
    book: 'كراسة الرسم والتصميم (Sketchbook)',
    notebook: 'ملف حفظ الأعمال الفنية (Portfolio)',
    tools: 'علبة ألوان خشبية وفلوماستر + مقص أطفال آمن + قلم صمغ'
  },
  pe: {
    book: 'لا يوجد كتاب دراسي (حصة عملية رياضية)',
    notebook: 'لا يوجد كشكول',
    tools: 'الزي الرياضي الرسمي لمدارس النيل + حذاء رياضي (كوتشي) + زجاجة ماء'
  },
  ethics: {
    book: 'كتاب التربية الدينية والقيم',
    notebook: 'كشكول الدين والقيم والأخلاق',
    tools: 'قلم رصاص وممحاة'
  },
  religion: {
    book: 'كتاب التربية الدينية',
    notebook: 'كشكول التربية الدينية',
    tools: 'قلم رصاص وممحاة'
  }
};

interface DailyFollowUpViewProps {
  currentRole: UserRole;
  selectedClass: SchoolClass;
  selectedBlock: string;
  selectedWeek: string;
  dailyFollowUps: DailyFollowUp[];
  onUpdateDailyFollowUps: (data: DailyFollowUp[]) => void;
  completedHwMap: Record<string, boolean>;
  onToggleHwCompletion: (hwId: string) => void;
  studentName?: string;
  onOpenPrint: () => void;
  timetables?: ClassTimetable[];
}

export const DailyFollowUpView: React.FC<DailyFollowUpViewProps> = ({
  currentRole,
  selectedClass,
  selectedBlock,
  selectedWeek,
  dailyFollowUps,
  onUpdateDailyFollowUps,
  completedHwMap,
  onToggleHwCompletion,
  studentName,
  onOpenPrint,
  timetables
}) => {
  // Find current follow-up or create one
  const currentRecord = dailyFollowUps.find(
    (d) => d.classId === selectedClass && d.blockId === selectedBlock && d.weekId === selectedWeek
  ) || dailyFollowUps.find((d) => d.classId === selectedClass) || dailyFollowUps[0];

  const defaultTomorrow = NEXT_DAY_MAP[currentRecord.dayNameAr] || 'الخميس';
  const [selectedTomorrowDay, setSelectedTomorrowDay] = useState<string>(defaultTomorrow);

  useEffect(() => {
    if (NEXT_DAY_MAP[currentRecord.dayNameAr]) {
      setSelectedTomorrowDay(NEXT_DAY_MAP[currentRecord.dayNameAr]);
    }
  }, [currentRecord.dayNameAr]);

  const activeTimetable =
    timetables?.find((t) => t.classId === selectedClass) ||
    INITIAL_TIMETABLES.find((t) => t.classId === selectedClass);
  const tomorrowDaySchedule = activeTimetable?.days.find((d) => d.dayNameAr === selectedTomorrowDay);
  const tomorrowPeriods = tomorrowDaySchedule?.periods || [];

  const [packedPeriods, setPackedPeriods] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(`nile_packed_periods_${selectedClass}`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const togglePeriodPacked = (periodId: string) => {
    setPackedPeriods((prev) => {
      const updated = { ...prev, [periodId]: !prev[periodId] };
      try {
        localStorage.setItem(`nile_packed_periods_${selectedClass}`, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const packAllTomorrowPeriods = () => {
    const updated: Record<string, boolean> = { ...packedPeriods };
    tomorrowPeriods.forEach((p) => {
      updated[p.id] = true;
    });
    setPackedPeriods(updated);
    try {
      localStorage.setItem(`nile_packed_periods_${selectedClass}`, JSON.stringify(updated));
    } catch {}
  };

  const resetTomorrowBag = () => {
    const updated: Record<string, boolean> = { ...packedPeriods };
    tomorrowPeriods.forEach((p) => {
      delete updated[p.id];
    });
    setPackedPeriods(updated);
    try {
      localStorage.setItem(`nile_packed_periods_${selectedClass}`, JSON.stringify(updated));
    } catch {}
  };

  const packedTomorrowCount = tomorrowPeriods.filter((p) => packedPeriods[p.id]).length;
  const bagReadyPercent = tomorrowPeriods.length > 0 ? Math.round((packedTomorrowCount / tomorrowPeriods.length) * 100) : 0;

  const [activeSection, setActiveSection] = useState<'all' | 'classwork' | 'homework' | 'preparations'>('all');

  // Admin Modal States
  const [editingCw, setEditingCw] = useState<{ isOpen: boolean; item?: ClassworkRecord }>({ isOpen: false });
  const [editingHw, setEditingHw] = useState<{ isOpen: boolean; item?: HomeworkRecord }>({ isOpen: false });
  const [editingPrep, setEditingPrep] = useState<{ isOpen: boolean; item?: TomorrowPreparationItem }>({ isOpen: false });

  // Form states
  const [cwSubject, setCwSubject] = useState(SUBJECTS[0].id);
  const [cwTitle, setCwTitle] = useState('');
  const [cwDetails, setCwDetails] = useState('');
  const [cwPages, setCwPages] = useState('');

  const [hwSubject, setHwSubject] = useState(SUBJECTS[0].id);
  const [hwAssignment, setHwAssignment] = useState('');
  const [hwDueDate, setHwDueDate] = useState('غداً');
  const [hwPages, setHwPages] = useState('');
  const [hwInstructions, setHwInstructions] = useState('');

  const [prepSubject, setPrepSubject] = useState('');
  const [prepItem, setPrepItem] = useState('');
  const [prepCategory, setPrepCategory] = useState<'books' | 'tools' | 'clothes' | 'general'>('books');
  const [prepImportant, setPrepImportant] = useState(false);

  // Local packed checklist state for student/parent tonight
  const [packedItems, setPackedItems] = useState<Record<string, boolean>>({});

  const togglePacked = (id: string) => {
    setPackedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (!currentRecord) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center border border-slate-200">
        <p className="text-slate-500">لا توجد بيانات متابعة مسجلة لهذا اليوم أو الفصل بعد.</p>
      </div>
    );
  }

  // Admin Handlers
  const handleSaveCw = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cwTitle.trim()) return;

    const newRecord: ClassworkRecord = {
      id: editingCw.item?.id || `cw-${Date.now()}`,
      subjectId: cwSubject,
      lessonTitle: cwTitle.trim(),
      details: cwDetails.trim(),
      pages: cwPages.trim() || undefined
    };

    const updatedFollowUps = dailyFollowUps.map((record) => {
      if (record.id === currentRecord.id) {
        const existingList = record.classwork || [];
        const index = existingList.findIndex((x) => x.id === newRecord.id);
        let updatedList: ClassworkRecord[];
        if (index >= 0) {
          updatedList = [...existingList];
          updatedList[index] = newRecord;
        } else {
          updatedList = [...existingList, newRecord];
        }
        return { ...record, classwork: updatedList };
      }
      return record;
    });

    onUpdateDailyFollowUps(updatedFollowUps);
    setEditingCw({ isOpen: false });
    setCwTitle('');
    setCwDetails('');
    setCwPages('');
  };

  const handleDeleteCw = (id: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الدرس؟')) return;
    const updatedFollowUps = dailyFollowUps.map((record) => {
      if (record.id === currentRecord.id) {
        return { ...record, classwork: (record.classwork || []).filter((x) => x.id !== id) };
      }
      return record;
    });
    onUpdateDailyFollowUps(updatedFollowUps);
  };

  const handleSaveHw = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hwAssignment.trim()) return;

    const newRecord: HomeworkRecord = {
      id: editingHw.item?.id || `hw-${Date.now()}`,
      subjectId: hwSubject,
      assignment: hwAssignment.trim(),
      dueDate: hwDueDate.trim() || 'غداً',
      pages: hwPages.trim() || undefined,
      instructions: hwInstructions.trim() || undefined
    };

    const updatedFollowUps = dailyFollowUps.map((record) => {
      if (record.id === currentRecord.id) {
        const existingList = record.homework || [];
        const index = existingList.findIndex((x) => x.id === newRecord.id);
        let updatedList: HomeworkRecord[];
        if (index >= 0) {
          updatedList = [...existingList];
          updatedList[index] = newRecord;
        } else {
          updatedList = [...existingList, newRecord];
        }
        return { ...record, homework: updatedList };
      }
      return record;
    });

    onUpdateDailyFollowUps(updatedFollowUps);
    setEditingHw({ isOpen: false });
    setHwAssignment('');
    setHwDueDate('غداً');
    setHwPages('');
    setHwInstructions('');
  };

  const handleDeleteHw = (id: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الواجب؟')) return;
    const updatedFollowUps = dailyFollowUps.map((record) => {
      if (record.id === currentRecord.id) {
        return { ...record, homework: (record.homework || []).filter((x) => x.id !== id) };
      }
      return record;
    });
    onUpdateDailyFollowUps(updatedFollowUps);
  };

  const handleSavePrep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prepItem.trim()) return;

    const newRecord: TomorrowPreparationItem = {
      id: editingPrep.item?.id || `prep-${Date.now()}`,
      subjectId: prepSubject || undefined,
      item: prepItem.trim(),
      category: prepCategory,
      isImportant: prepImportant
    };

    const updatedFollowUps = dailyFollowUps.map((record) => {
      if (record.id === currentRecord.id) {
        const existingList = record.tomorrowPreparations || [];
        const index = existingList.findIndex((x) => x.id === newRecord.id);
        let updatedList: TomorrowPreparationItem[];
        if (index >= 0) {
          updatedList = [...existingList];
          updatedList[index] = newRecord;
        } else {
          updatedList = [...existingList, newRecord];
        }
        return { ...record, tomorrowPreparations: updatedList };
      }
      return record;
    });

    onUpdateDailyFollowUps(updatedFollowUps);
    setEditingPrep({ isOpen: false });
    setPrepItem('');
    setPrepSubject('');
    setPrepCategory('books');
    setPrepImportant(false);
  };

  const handleDeletePrep = (id: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا العنصر؟')) return;
    const updatedFollowUps = dailyFollowUps.map((record) => {
      if (record.id === currentRecord.id) {
        return { ...record, tomorrowPreparations: (record.tomorrowPreparations || []).filter((x) => x.id !== id) };
      }
      return record;
    });
    onUpdateDailyFollowUps(updatedFollowUps);
  };

  // Metrics
  const cwCount = currentRecord.classwork?.length || 0;
  const hwCount = currentRecord.homework?.length || 0;
  const prepCount = currentRecord.tomorrowPreparations?.length || 0;

  // Calculate completed homework for the student
  const completedHwCount = currentRecord.homework?.filter((h) => completedHwMap[h.id])?.length || 0;

  return (
    <div className="space-y-6">
      {/* Top Banner Card for Daily Follow-up */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-700 border border-sky-100 flex items-center justify-center font-bold">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-900">
                  تقرير المتابعة اليومية - Class {selectedClass}
                </h2>
                <span className="bg-sky-100 text-sky-800 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  {currentRecord.dayNameAr}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                مدرسة النيل المصرية الدولية فرع المنيا • جريد 2 • التاريخ: {currentRecord.date}
              </p>
            </div>
          </div>

          {/* Quick Filter Pill Buttons (All, Homework, Classwork, Tomorrow Prep) */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            <button
              id="filter-all-btn"
              type="button"
              onClick={() => setActiveSection('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeSection === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              عرض الكل ({cwCount + hwCount + prepCount})
            </button>
            <button
              id="filter-homework-btn"
              type="button"
              onClick={() => setActiveSection('homework')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeSection === 'homework'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Homework ({hwCount})
            </button>
            <button
              id="filter-classwork-btn"
              type="button"
              onClick={() => setActiveSection('classwork')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeSection === 'classwork'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Classwork ({cwCount})
            </button>
            <button
              id="filter-prep-btn"
              type="button"
              onClick={() => setActiveSection('preparations')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeSection === 'preparations'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              تجهيزات الغد ({prepCount})
            </button>
          </div>
        </div>

        {/* Student Homework Progress Bar if student role or student name present */}
        {currentRole === 'student' && hwCount > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <div>
                <span className="text-xs font-bold text-slate-800">
                  إنجاز واجبات اليوم يا {studentName || 'بطل'}:
                </span>
                <span className="text-xs font-black text-emerald-700 mr-2">
                  {completedHwCount} من أصل {hwCount} واجبات مكتملة
                </span>
              </div>
            </div>
            <div className="w-48 bg-slate-200 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-emerald-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${Math.round((completedHwCount / hwCount) * 100)}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Grid of the 3 Requested Core Modules (Order: 1. Homework, 2. Classwork, 3. Preparations) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ================= SECTION 1: جزء خاص بـ Homework ================= */}
        {(activeSection === 'all' || activeSection === 'homework') && (
          <div className={`space-y-4 ${activeSection === 'homework' ? 'lg:col-span-3' : ''}`}>
            <div className="bg-amber-800 text-white p-4 rounded-2xl flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-700 text-amber-200 flex items-center justify-center font-bold">
                  <CheckSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-sm">1. Homework</h3>
                  <p className="text-[11px] text-amber-200">الواجبات والمهام المطلوبة ومواعيد التسليم</p>
                </div>
              </div>

              {currentRole === 'admin' && (
                <button
                  id="admin-add-hw-btn"
                  type="button"
                  onClick={() => {
                    setEditingHw({ isOpen: true });
                    setHwSubject(SUBJECTS[0].id);
                    setHwAssignment('');
                    setHwDueDate('غداً');
                    setHwPages('');
                    setHwInstructions('');
                  }}
                  className="flex items-center gap-1 bg-amber-300 hover:bg-amber-200 text-slate-950 font-bold px-2.5 py-1 rounded-lg text-xs shadow-xs transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>إضافة واجب</span>
                </button>
              )}
            </div>

            {/* Homework Items List */}
            <div className="space-y-3">
              {currentRecord.homework?.length === 0 ? (
                <div className="bg-white rounded-xl p-6 text-center text-xs text-slate-400 border border-slate-200">
                  لا توجد واجبات منزلية مسجلة اليوم.
                </div>
              ) : (
                currentRecord.homework?.map((hw) => {
                  const isDone = completedHwMap[hw.id];
                  return (
                    <div
                      key={hw.id}
                      className={`bg-white rounded-xl p-4 border transition-all shadow-xs group ${
                        isDone
                          ? 'border-emerald-300 bg-emerald-50/20'
                          : 'border-slate-200 hover:border-amber-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <SubjectBadge subjectId={hw.subjectId} size="sm" />

                        <div className="flex items-center gap-2">
                          {hw.dueDate && (
                            <span className="text-[11px] font-semibold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md">
                              التسليم: {hw.dueDate}
                            </span>
                          )}

                          {currentRole === 'admin' && (
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingHw({ isOpen: true, item: hw });
                                  setHwSubject(hw.subjectId);
                                  setHwAssignment(hw.assignment);
                                  setHwDueDate(hw.dueDate || 'غداً');
                                  setHwPages(hw.pages || '');
                                  setHwInstructions(hw.instructions || '');
                                }}
                                className="p-1 text-slate-500 hover:text-amber-700 hover:bg-amber-50 rounded-md"
                                title="تعديل الواجب"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteHw(hw.id)}
                                className="p-1 text-slate-500 hover:text-red-700 hover:bg-red-50 rounded-md"
                                title="حذف الواجب"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Assignment Content */}
                      <p className={`text-xs font-semibold leading-relaxed mb-2 ${isDone ? 'line-through text-slate-500' : 'text-slate-800'}`}>
                        {hw.assignment}
                      </p>

                      {hw.instructions && (
                        <p className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100 mb-2">
                          💡 <span className="font-semibold">إرشاد للمعلم/ولي الأمر:</span> {hw.instructions}
                        </p>
                      )}

                      {/* Interactive Student Checkbox */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                        {currentRole === 'student' ? (
                          <button
                            type="button"
                            onClick={() => onToggleHwCompletion(hw.id)}
                            className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg transition-colors ${
                              isDone
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-100 text-slate-700 hover:bg-emerald-100 hover:text-emerald-800'
                            }`}
                          >
                            {isDone ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                            <span>{isDone ? 'تم حل الواجب بنجاح ✓' : 'اضغط للتأشير عند الانتهاء'}</span>
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400">
                            {currentRole === 'visitor' ? 'وضع الزائر: للعرض فقط' : 'مسجل في تقرير المتابعة'}
                          </span>
                        )}

                        {hw.pages && (
                          <span className="text-[11px] text-slate-500 font-medium">
                            {hw.pages}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ================= SECTION 2: Classwork ================= */}
        {(activeSection === 'all' || activeSection === 'classwork') && (
          <div className={`space-y-4 ${activeSection === 'classwork' ? 'lg:col-span-3' : ''}`}>
            <div className="bg-sky-900 text-white p-4 rounded-2xl flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-sky-800 text-sky-200 flex items-center justify-center font-bold">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-sm">2. Classwork</h3>
                  <p className="text-[11px] text-sky-200">الدروس والأنشطة التي نُفذت داخل الحصة</p>
                </div>
              </div>

              {currentRole === 'admin' && (
                <button
                  id="admin-add-cw-btn"
                  type="button"
                  onClick={() => {
                    setEditingCw({ isOpen: true });
                    setCwSubject(SUBJECTS[0].id);
                    setCwTitle('');
                    setCwDetails('');
                    setCwPages('');
                  }}
                  className="flex items-center gap-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-2.5 py-1 rounded-lg text-xs shadow-xs transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>إضافة درس</span>
                </button>
              )}
            </div>

            {/* Classwork Items List */}
            <div className="space-y-3">
              {currentRecord.classwork?.length === 0 ? (
                <div className="bg-white rounded-xl p-6 text-center text-xs text-slate-400 border border-slate-200">
                  لم يتم رصد دروس اليوم بعد.
                </div>
              ) : (
                currentRecord.classwork?.map((cw) => (
                  <div
                    key={cw.id}
                    className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs hover:border-sky-300 transition-all group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <SubjectBadge subjectId={cw.subjectId} size="sm" />
                      {currentRole === 'admin' && (
                        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingCw({ isOpen: true, item: cw });
                              setCwSubject(cw.subjectId);
                              setCwTitle(cw.lessonTitle);
                              setCwDetails(cw.details);
                              setCwPages(cw.pages || '');
                            }}
                            className="p-1 text-slate-500 hover:text-sky-700 hover:bg-sky-50 rounded-md"
                            title="تعديل الدرس"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCw(cw.id)}
                            className="p-1 text-slate-500 hover:text-red-700 hover:bg-red-50 rounded-md"
                            title="حذف الدرس"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm mb-1">{cw.lessonTitle}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed mb-2">{cw.details}</p>

                    {cw.pages && (
                      <div className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 text-[11px] font-semibold px-2.5 py-1 rounded-md">
                        <span>الصفحات:</span>
                        <span className="text-slate-900 font-bold">{cw.pages}</span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ================= SECTION 3: جزء تجهيزات لغد وجدول الحقيبة المدرسية ================= */}
        {(activeSection === 'all' || activeSection === 'preparations') && (
          <div className={`space-y-4 ${activeSection === 'preparations' ? 'lg:col-span-3' : ''}`}>
            {/* Header with Day Selector */}
            <div className="bg-emerald-900 text-white p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-800 text-emerald-200 flex items-center justify-center font-bold">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-sm">3. تجهيزات لغد وجدول الحقيبة المدرسية</h3>
                  <p className="text-[11px] text-emerald-200">
                    جدول حصص الغد بالترتيب والكتب والكشاكيل والأدوات المطلوبة لترتيب الحقيبة
                  </p>
                </div>
              </div>

              {/* Day Selector for Tomorrow's Schedule */}
              <div className="flex items-center gap-1 bg-emerald-950/60 p-1 rounded-xl">
                {['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'].map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => setSelectedTomorrowDay(day)}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors ${
                      selectedTomorrowDay === day
                        ? 'bg-amber-400 text-slate-950 shadow-xs'
                        : 'text-emerald-200 hover:text-white hover:bg-emerald-800/60'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            {/* Bag Readiness Progress & Quick Batch Actions */}
            <div className="bg-white rounded-2xl p-4 border border-emerald-200 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-xs">
                    🎒
                  </span>
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-900">
                      جدول حصص يوم ({selectedTomorrowDay}) - Class {selectedClass}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      ترتيب الحقيبة المدرسية الليلة: تم تجهيز {packedTomorrowCount} من {tomorrowPeriods.length} حصص ({bagReadyPercent}%)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={packAllTomorrowPeriods}
                    className="flex items-center gap-1 px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold text-[11px] rounded-lg transition-colors"
                    title="تأكيد وضع جميع حصص الغد في الحقيبة"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>تجهيز كل الحصص ✓</span>
                  </button>

                  <button
                    type="button"
                    onClick={resetTomorrowBag}
                    className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] rounded-lg transition-colors"
                    title="إعادة ضبط علامات الحقيبة"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>إعادة ضبط</span>
                  </button>

                  {currentRole === 'admin' && (
                    <button
                      id="admin-add-prep-btn"
                      type="button"
                      onClick={() => {
                        setEditingPrep({ isOpen: true });
                        setPrepItem('');
                        setPrepSubject('');
                        setPrepCategory('books');
                        setPrepImportant(false);
                      }}
                      className="flex items-center gap-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-2.5 py-1 rounded-lg text-[11px] shadow-xs transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>إضافة طلب خاص</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${bagReadyPercent}%` }}
                />
              </div>
            </div>

            {/* Periods Schedule & Kit List */}
            <div className="space-y-3">
              {tomorrowPeriods.length === 0 ? (
                <div className="bg-white rounded-2xl p-6 text-center text-xs text-slate-400 border border-slate-200">
                  لا توجد حصص مسجلة لهذا اليوم.
                </div>
              ) : (
                tomorrowPeriods.map((period) => {
                  const isPeriodPacked = !!packedPeriods[period.id];
                  const kit = SUBJECT_PACKING_KIT[period.subjectId] || {
                    book: 'الكتاب المدرسي المعتمد',
                    notebook: 'كشكول المادة',
                    tools: 'الأدوات والمقلمة المدرسية'
                  };

                  return (
                    <div
                      key={period.id}
                      className={`bg-white rounded-2xl p-4 border transition-all shadow-xs ${
                        isPeriodPacked
                          ? 'border-emerald-300 bg-emerald-50/20'
                          : 'border-slate-200 hover:border-emerald-300'
                      }`}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        {/* Period & Subject Info */}
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                              isPeriodPacked
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {period.periodNum}
                          </div>

                          <div>
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <SubjectBadge subjectId={period.subjectId} size="sm" />
                              <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1 font-mono">
                                <Clock className="w-3 h-3 text-slate-400" />
                                <span>{period.time}</span>
                              </span>
                              {period.teacher && (
                                <span className="text-[11px] text-slate-400">
                                  • {period.teacher}
                                </span>
                              )}
                            </div>

                            {/* Kit Supplies Breakdown */}
                            <div className="mt-2 space-y-1 text-xs">
                              <div className="flex items-center gap-1.5 text-slate-800">
                                <span className="text-emerald-700 font-bold shrink-0">📚 الكتاب:</span>
                                <span className={isPeriodPacked ? 'line-through text-slate-400' : 'font-medium'}>
                                  {kit.book}
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5 text-slate-800">
                                <span className="text-sky-700 font-bold shrink-0">📓 الكشكول:</span>
                                <span className={isPeriodPacked ? 'line-through text-slate-400' : 'font-medium'}>
                                  {kit.notebook}
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5 text-slate-600 text-[11px]">
                                <span className="text-amber-700 font-bold shrink-0">✏️ الأدوات:</span>
                                <span className={isPeriodPacked ? 'line-through text-slate-400' : ''}>
                                  {kit.tools}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Interactive Packed Checkbox Button */}
                        <button
                          type="button"
                          onClick={() => togglePeriodPacked(period.id)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                            isPeriodPacked
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800 border border-slate-200'
                          }`}
                        >
                          {isPeriodPacked ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-400" />
                          )}
                          <span>
                            {isPeriodPacked ? 'تم وضعها في الحقيبة ✓' : 'وضع في الحقيبة'}
                          </span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Special Additional Items / Alerts (زي رياضي، أدوات خاصة، تسليمات) */}
            <div className="mt-6 pt-5 border-t border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-extrabold text-xs text-slate-800 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>تنبيهات ومستلزمات خاصة إضافية للغد ({currentRecord.tomorrowPreparations?.length || 0})</span>
                </h4>
                {currentRole === 'admin' && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingPrep({ isOpen: true });
                      setPrepItem('');
                      setPrepSubject('');
                      setPrepCategory('clothes');
                      setPrepImportant(false);
                    }}
                    className="text-[11px] font-bold text-emerald-700 hover:underline"
                  >
                    + إضافة تنبيه خاص
                  </button>
                )}
              </div>

              <div className="space-y-2.5">
                {currentRecord.tomorrowPreparations?.length === 0 ? (
                  <div className="bg-slate-50 rounded-xl p-4 text-center text-xs text-slate-400 border border-slate-200">
                    لا توجد تنبيهات استثنائية للغد. فقط التزم بجدول الحصص الموضح بالأعلى.
                  </div>
                ) : (
                  currentRecord.tomorrowPreparations?.map((prep) => {
                    const isPacked = packedItems[prep.id];
                    return (
                      <div
                        key={prep.id}
                        className={`bg-white rounded-xl p-3.5 border transition-all shadow-xs ${
                          prep.isImportant ? 'border-amber-300 bg-amber-50/20' : 'border-slate-200'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            {prep.subjectId && <SubjectBadge subjectId={prep.subjectId} size="sm" />}
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${
                                prep.category === 'clothes'
                                  ? 'bg-orange-100 text-orange-800'
                                  : prep.category === 'tools'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {prep.category === 'clothes'
                                ? 'زي مدرسي/رياضي'
                                : prep.category === 'tools'
                                ? 'أدوات ومقلمة'
                                : 'كتب وكشاكيل'}
                            </span>

                            {prep.isImportant && (
                              <span className="bg-red-100 text-red-800 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                <span>مهم جداً</span>
                              </span>
                            )}
                          </div>

                          {currentRole === 'admin' && (
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingPrep({ isOpen: true, item: prep });
                                  setPrepItem(prep.item);
                                  setPrepSubject(prep.subjectId || '');
                                  setPrepCategory(prep.category);
                                  setPrepImportant(!!prep.isImportant);
                                }}
                                className="p-1 text-slate-500 hover:text-emerald-700 rounded-md"
                                title="تعديل"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeletePrep(prep.id)}
                                className="p-1 text-slate-500 hover:text-red-700 rounded-md"
                                title="حذف"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>

                        <div className="flex items-start gap-2.5 mt-1.5">
                          <button
                            type="button"
                            onClick={() => togglePacked(prep.id)}
                            className={`mt-0.5 transition-colors ${
                              isPacked ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'
                            }`}
                          >
                            {isPacked ? (
                              <CheckCircle2 className="w-4 h-4 fill-emerald-100" />
                            ) : (
                              <Circle className="w-4 h-4" />
                            )}
                          </button>

                          <p
                            className={`text-xs font-semibold cursor-pointer ${
                              isPacked ? 'text-slate-400 line-through' : 'text-slate-800'
                            }`}
                            onClick={() => togglePacked(prep.id)}
                          >
                            {prep.item}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ================= ADMIN MODALS ================= */}

      {/* Classwork Modal */}
      {editingCw.isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-base font-black text-slate-900 mb-4">
              {editingCw.item ? 'تعديل Classwork' : 'إضافة Classwork'}
            </h3>
            <form onSubmit={handleSaveCw} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">المادة الدراسية:</label>
                <select
                  value={cwSubject}
                  onChange={(e) => setCwSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                >
                  {SUBJECTS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.nameEn} ({s.nameAr})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">عنوان الدرس / الموضوع:</label>
                <input
                  type="text"
                  placeholder="مثال: الجمع بإعادة التسمية أو Phonics: Long a"
                  value={cwTitle}
                  onChange={(e) => setCwTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">تفاصيل ما تم شرحه وحله داخل الفصل:</label>
                <textarea
                  placeholder="اكتب شرحاً مختصراً لما تم تنفيذه في الحصة مع الطلاب..."
                  value={cwDetails}
                  onChange={(e) => setCwDetails(e.target.value)}
                  rows={3}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">الصفحات بالكتاب أو الكشكول (اختياري):</label>
                <input
                  type="text"
                  placeholder="مثال: كتاب التلميذ ص 36 و 37"
                  value={cwPages}
                  onChange={(e) => setCwPages(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingCw({ isOpen: false })}
                  className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-xs"
                >
                  حفظ في المتابعة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Homework Modal */}
      {editingHw.isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-base font-black text-slate-900 mb-4">
              {editingHw.item ? 'تعديل Homework' : 'إضافة Homework'}
            </h3>
            <form onSubmit={handleSaveHw} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">المادة الدراسية:</label>
                <select
                  value={hwSubject}
                  onChange={(e) => setHwSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                >
                  {SUBJECTS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.nameEn} ({s.nameAr})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">المطلوب في الواجب:</label>
                <textarea
                  placeholder="مثال: حل التدريبات 1 إلى 5 في كراسة الأنشطة صفحة 38..."
                  value={hwAssignment}
                  onChange={(e) => setHwAssignment(e.target.value)}
                  rows={3}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  required
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">موعد التسليم:</label>
                  <input
                    type="text"
                    placeholder="مثال: غداً الخميس أو الأحد القادم"
                    value={hwDueDate}
                    onChange={(e) => setHwDueDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">الصفحات / المرجع:</label>
                  <input
                    type="text"
                    placeholder="مثال: ص 38 بالكتاب"
                    value={hwPages}
                    onChange={(e) => setHwPages(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">ملاحظات وإرشادات للحل (اختياري):</label>
                <input
                  type="text"
                  placeholder="مثال: الرجاء كتابة خطوات الحل بخط واضح"
                  value={hwInstructions}
                  onChange={(e) => setHwInstructions(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingHw({ isOpen: false })}
                  className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-xs"
                >
                  حفظ الواجب
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tomorrow Preparation Modal */}
      {editingPrep.isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-base font-black text-slate-900 mb-4">
              {editingPrep.item ? 'تعديل تجهيزات الغد' : 'إضافة مستلزمات وتجهيزات للغد'}
            </h3>
            <form onSubmit={handleSavePrep} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">المادة المرتبطة (اختياري):</label>
                <select
                  value={prepSubject}
                  onChange={(e) => setPrepSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">بدون مادة محددة (عام / كل المواد)</option>
                  {SUBJECTS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.nameEn} ({s.nameAr})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">المطلوب تجهيزه أو إحضاره:</label>
                <textarea
                  placeholder="مثال: إحضار كشكول الساينس ومسطرة، أو ارتداء الزي الرياضي لحصة الـ PE..."
                  value={prepItem}
                  onChange={(e) => setPrepItem(e.target.value)}
                  rows={3}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  required
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">تصنيف المستلزم:</label>
                  <select
                    value={prepCategory}
                    onChange={(e) => setPrepCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="books">كتب وكشاكيل</option>
                    <option value="tools">أدوات ومقلمة ورسم</option>
                    <option value="clothes">زي مدرسي / رياضي</option>
                    <option value="general">عام / تعليمات إضافية</option>
                  </select>
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={prepImportant}
                      onChange={(e) => setPrepImportant(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-xs font-bold text-red-700">تنبيه هام ومستعجل</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingPrep({ isOpen: false })}
                  className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs"
                >
                  حفظ التجهيز
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
