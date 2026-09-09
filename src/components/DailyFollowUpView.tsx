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
  Check,
  Table,
  LayoutGrid,
  Layers,
  FileSpreadsheet
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
  const [followUpLayoutMode, setFollowUpLayoutMode] = useState<'columns' | 'table'>('columns');

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
      {/* ================= UNIFIED FRAME (الفريم الموحد للهوم ورك والكلاس ورك وتجهيزات الغد) ================= */}
      <div id="unified-daily-frame" className="bg-white rounded-3xl border-2 border-slate-300 shadow-md overflow-hidden">
        
        {/* Frame Master Header Bar */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 border-b-2 border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-xs">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-black text-white">
                  الفريم الموحد لسجل المتابعة اليومية
                </h3>
                <span className="bg-sky-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                  Class {selectedClass}
                </span>
                <span className="bg-slate-800 text-amber-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-slate-700">
                  {currentRecord.dayNameAr} ({currentRecord.date})
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Switcher: 3-Column Frame vs Official Table Sheet */}
            <div className="bg-slate-800 p-1 rounded-xl border border-slate-700 flex items-center gap-1 text-xs">
              <button
                id="view-mode-columns-btn"
                type="button"
                onClick={() => setFollowUpLayoutMode('columns')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                  followUpLayoutMode === 'columns'
                    ? 'bg-amber-400 text-slate-950 shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="عرض الفريم الثلاثي المتكامل"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>الفريم الثلاثي الموحد</span>
              </button>
              <button
                id="view-mode-table-btn"
                type="button"
                onClick={() => setFollowUpLayoutMode('table')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                  followUpLayoutMode === 'table'
                    ? 'bg-amber-400 text-slate-950 shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="عرض شيت الجدول المنسق كما في الملف المعتمد"
              >
                <Table className="w-3.5 h-3.5" />
                <span>شيت الجدول المنسق</span>
              </button>
            </div>

            <button
              id="frame-print-btn"
              type="button"
              onClick={onOpenPrint}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-600 transition-colors"
              title="طباعة الفريم الموحد"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">طباعة الفريم</span>
            </button>
          </div>
        </div>

        {/* View Mode 1: 3 Columns sharing the same frame container down to the bottom */}
        {followUpLayoutMode === 'columns' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x lg:divide-x-reverse divide-slate-200 bg-slate-50/20">
            
            {/* ================= COLUMN 1: جزء خاص بـ Homework ================= */}
            <div className="flex flex-col h-full bg-white">
              <div className="bg-red-700 text-white p-4 flex items-center justify-between border-b border-red-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-red-800 text-white flex items-center justify-center font-bold shadow-xs">
                    <CheckSquare className="w-4 h-4" />
                  </div>
                  <h3 className="font-black text-sm text-white">
                    الهوم ورك ({hwCount})
                  </h3>
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
                    className="flex items-center gap-1 bg-red-800 hover:bg-red-900 text-white font-bold px-2.5 py-1 rounded-lg text-xs shadow-xs transition-colors border border-red-600"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>إضافة واجب</span>
                  </button>
                )}
              </div>

              {/* Homework Items List extending down */}
              <div className="p-4 space-y-3 flex-1 bg-slate-50/30">
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
                        className={`bg-white rounded-xl p-3.5 border transition-all shadow-xs ${
                          isDone
                            ? 'border-emerald-300 bg-emerald-50/20'
                            : 'border-slate-200 hover:border-red-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <SubjectBadge subjectId={hw.subjectId} size="sm" />

                          <div className="flex items-center gap-1.5">
                            {hw.dueDate && (
                              <span className="text-[10px] font-bold bg-amber-50 text-amber-900 px-2 py-0.5 rounded border border-amber-200">
                                {hw.dueDate}
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
                                  className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded"
                                  title="تعديل الواجب"
                                >
                                  <Edit2 className="w-3 h-3" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteHw(hw.id)}
                                  className="p-1 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded"
                                  title="حذف الواجب"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Homework description from weekly plan */}
                        <p className={`text-xs font-semibold leading-relaxed ${isDone ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                          {hw.assignment}
                        </p>

                        {hw.pages && hw.pages !== hw.assignment && (
                          <div className="mt-1.5">
                            <span className="text-[11px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-100">
                              {hw.pages}
                            </span>
                          </div>
                        )}

                        {/* Interactive Student Checkbox */}
                        {currentRole === 'student' && (
                          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-end">
                            <button
                              type="button"
                              onClick={() => onToggleHwCompletion(hw.id)}
                              className={`flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg transition-colors ${
                                isDone
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-slate-100 text-slate-700 hover:bg-emerald-100 hover:text-emerald-800'
                              }`}
                            >
                              {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
                              <span>{isDone ? 'تم الحل ✓' : 'تأشير الإنجاز'}</span>
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* ================= COLUMN 2: الكلاس ورك (Classwork) ================= */}
            <div className="flex flex-col h-full bg-white">
              <div className="bg-sky-800 text-white p-4 flex items-center justify-between border-b border-sky-900">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-sky-900 text-sky-200 flex items-center justify-center font-bold shadow-xs">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <h3 className="font-black text-sm text-white">
                    الكلاس ورك ({cwCount})
                  </h3>
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
                    className="flex items-center gap-1 bg-sky-900 hover:bg-sky-950 text-white font-bold px-2.5 py-1 rounded-lg text-xs shadow-xs transition-colors border border-sky-700"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>إضافة درس</span>
                  </button>
                )}
              </div>

              {/* Classwork Items List extending down */}
              <div className="p-4 space-y-3 flex-1 bg-slate-50/30">
                {currentRecord.classwork?.length === 0 ? (
                  <div className="bg-white rounded-xl p-6 text-center text-xs text-slate-400 border border-slate-200">
                    لم يتم رصد دروس اليوم بعد.
                  </div>
                ) : (
                  currentRecord.classwork?.map((cw) => (
                    <div
                      key={cw.id}
                      className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-xs hover:border-sky-300 transition-all group"
                    >
                      <div className="flex items-center justify-between mb-1.5">
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

                      <h4 className="font-bold text-slate-900 text-xs mb-1">{cw.lessonTitle}</h4>
                      {cw.details && <p className="text-[11px] text-slate-600 leading-relaxed mb-1.5">{cw.details}</p>}

                      {cw.pages && (
                        <div className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded-md">
                          <span>الصفحات:</span>
                          <span className="text-slate-900 font-bold">{cw.pages}</span>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* ================= COLUMN 3: تجهيزات ومستلزمات الغد ================= */}
            <div className="flex flex-col h-full bg-white">
              {/* Header with Day Selector */}
              <div className="bg-emerald-800 text-white p-4 flex flex-wrap items-center justify-between gap-2 border-b border-emerald-900">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-900 text-emerald-200 flex items-center justify-center font-bold shadow-xs">
                    <Package className="w-4 h-4" />
                  </div>
                  <h3 className="font-black text-sm text-white">
                    تجهيزات الغد ({tomorrowPeriods.length})
                  </h3>
                </div>

                {/* Day Selector for Tomorrow's Schedule */}
                <div className="flex items-center gap-1 bg-emerald-950/60 p-1 rounded-xl">
                  {['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'].map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => setSelectedTomorrowDay(day)}
                      className={`px-2 py-0.5 text-[11px] font-bold rounded-lg transition-colors ${
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

            {/* Content area stretching down */}
            <div className="p-4 space-y-4 flex-1 bg-slate-50/30">

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
        </div>
      </div>
    ) : (
    /* ================= VIEW MODE 2: EXACT OFFICIAL SHEET TABLE FORMAT ================= */
    <div className="p-4 sm:p-6 bg-white overflow-x-auto">
      <div className="text-center mb-4 pb-3 border-b border-slate-200">
        <h4 className="font-black text-slate-900 text-base">
          مدارس النيل المصرية الدولية - فرع المنيا (Nile Egyptian Schools)
        </h4>
        <p className="text-xs text-slate-600 font-semibold mt-1">
          سجل المتابعة اليومية الرسمي للصف الثاني الابتدائي • فصل {selectedClass} • يوم {currentRecord.dayNameAr} ({currentRecord.date})
        </p>
      </div>

      <table className="w-full border-collapse border-2 border-slate-300 text-right text-xs">
        <thead>
          <tr className="bg-slate-800 text-white font-black text-center">
            <th className="border-2 border-slate-400 p-2.5 w-36">المادة الدراسية</th>
            <th className="border-2 border-slate-400 p-2.5">ما تم تدريسه داخل الفصل (Classwork)</th>
            <th className="border-2 border-slate-400 p-2.5">الواجبات المنزلية المطلوبة (Homework)</th>
            <th className="border-2 border-slate-400 p-2.5 w-72">تجهيزات ومستلزمات الغد (الكتب والكشاكيل)</th>
          </tr>
        </thead>
        <tbody>
          {Array.from(
            new Set([
              ...currentRecord.classwork.map((c) => c.subjectId),
              ...currentRecord.homework.map((h) => h.subjectId)
            ])
          ).map((subId, idx) => {
            const cw = currentRecord.classwork.find((c) => c.subjectId === subId);
            const hw = currentRecord.homework.find((h) => h.subjectId === subId);
            const kit = SUBJECT_PACKING_KIT[subId] || {
              book: 'كتاب المادة',
              notebook: 'كشكول الحصة',
              tools: 'الأدوات المقررة'
            };
            const isDone = hw ? completedHwMap[hw.id] : false;

            return (
              <tr
                key={subId}
                className={`hover:bg-slate-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}
              >
                {/* Subject Column */}
                <td className="border-2 border-slate-300 p-3 align-top font-bold">
                  <SubjectBadge subjectId={subId} size="md" />
                </td>

                {/* Classwork Column */}
                <td className="border-2 border-slate-300 p-3 align-top">
                  {cw ? (
                    <div className="space-y-1">
                      <p className="font-bold text-slate-900">{cw.lessonTitle}</p>
                      <p className="text-slate-600 leading-relaxed text-[11px]">{cw.details}</p>
                      {cw.pages && (
                        <span className="inline-block bg-sky-50 text-sky-800 text-[10px] font-bold px-2 py-0.5 rounded-md border border-sky-200 mt-1">
                          {cw.pages}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-slate-400 italic text-[11px]">- لا يوجد رصد للحصة -</span>
                  )}
                </td>

                {/* Homework Column */}
                <td className="border-2 border-slate-300 p-3 align-top">
                  {hw ? (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-1 flex-wrap mb-1">
                        <p className={`font-bold text-slate-900 ${isDone ? 'line-through text-slate-400' : ''}`}>
                          {hw.assignment}
                        </p>
                        {hw.dueDate && (
                          <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-md">
                            تسليم: {hw.dueDate}
                          </span>
                        )}
                      </div>

                        {hw.pages && (
                          <p className="text-[10px] text-slate-600 font-semibold">{hw.pages}</p>
                        )}

                      {currentRole === 'student' && (
                        <button
                          type="button"
                          onClick={() => onToggleHwCompletion(hw.id)}
                          className={`mt-2 flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg transition-colors ${
                            isDone
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-100 text-slate-700 hover:bg-emerald-50'
                          }`}
                        >
                          {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
                          <span>{isDone ? 'تم الحل بنجاح ✓' : 'تأشير إتمام الواجب'}</span>
                        </button>
                      )}
                    </div>
                  ) : (
                    <span className="text-slate-400 italic text-[11px]">- لا يوجد واجب منزلي -</span>
                  )}
                </td>

                {/* Tomorrow Kit Column */}
                <td className="border-2 border-slate-300 p-3 align-top">
                  <div className="space-y-1 text-[11px]">
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <span className="font-bold text-slate-900">📚 الكتاب:</span>
                      <span>{kit.book}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <span className="font-bold text-slate-900">📓 الكشكول:</span>
                      <span>{kit.notebook}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <span className="font-bold text-slate-900">✏️ الأدوات:</span>
                      <span>{kit.tools}</span>
                    </div>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="bg-slate-100 font-bold text-slate-700 text-center border-t-2 border-slate-300">
            <td colSpan={4} className="p-3 text-xs">
              <div className="flex flex-wrap items-center justify-around gap-4">
                <div>توقيع المعلم المختص: ..............................</div>
                <div>توقيع ولي الأمر: ..............................</div>
                <div>اعتماد إدارة مدرسة النيل بالمنيا: [ختم رسمي متاح]</div>
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  )}

  {/* Frame Master Footer Bar */}
  <div className="bg-slate-100 px-5 py-3 border-t-2 border-slate-200 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-3">
    <div className="flex items-center gap-2">
      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
      <span className="font-bold text-slate-800">
        سجل المتابعة اليومي معتمد ومحدث لفرع المنيا
      </span>
      <span className="text-slate-400">|</span>
      <span>
        إجمالي: {cwCount} كلاس ورك • {hwCount} واجبات • {tomorrowPeriods.length} حصص غداً
      </span>
    </div>

    <div className="text-[11px] font-semibold text-slate-500">
      فصل {selectedClass} • نظام المتابعة الإلكترونية الموحدة لمدارس النيل
    </div>
  </div>

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
