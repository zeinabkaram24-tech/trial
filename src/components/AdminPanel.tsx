import React, { useState, useRef } from 'react';
import {
  ShieldCheck,
  Download,
  Upload,
  RotateCcw,
  Calendar,
  Layers,
  BookOpen,
  FolderOpen,
  Plus,
  Trash2,
  Edit2,
  Search,
  FileText,
  FileSpreadsheet,
  Image as ImageIcon,
  AlertTriangle,
  CheckCircle2,
  X,
  Eye,
  Filter,
  Clock,
  Sparkles,
  Package,
  GraduationCap
} from 'lucide-react';
import {
  SchoolClass,
  DailyFollowUp,
  WeeklyPlanItem,
  ClassTimetable,
  SchoolMaterialFile,
  PeriodSlot
} from '../types';
import { exportAllDataToJSON } from '../lib/storage';
import { SUBJECTS, BLOCKS, WEEKS, PERIOD_TIMES, INITIAL_TIMETABLES } from '../data/initialData';
import { SubjectBadge, getSubjectInfo } from './SubjectBadge';

const SUBJECT_PACKING_KIT: Record<string, { book: string; notebook: string; tools: string }> = {
  english: {
    book: "Cambridge Primary English Learner's Book",
    notebook: 'كشكول إنجليزي مسطر 4 أسطر',
    tools: 'مقلمة، قلم رصاص HB، ممحاة'
  },
  math: {
    book: "Cambridge Primary Math Learner's Book",
    notebook: 'كشكول ماث مربعات Grid',
    tools: 'مسطرة 20 سم، قلم رصاص، ممحاة'
  },
  science: {
    book: "Cambridge Primary Science Learner's Book",
    notebook: 'كشكول الساينس للأنشطة والتجارب',
    tools: 'ألوان خشبية للرسم التوضيحي'
  },
  arabic: {
    book: 'كتاب تواصل (اللغة العربية) وكراسة الأنشطة',
    notebook: 'كشكول عربي مسطر سطرين',
    tools: 'قلم رصاص + ممحاة'
  },
  social: {
    book: 'كتاب الدراسات الاجتماعية والمواطنة',
    notebook: 'كشكول الدراسات الاجتماعية',
    tools: 'ألوان خشبية ومسطرة'
  },
  french: {
    book: "Alex et Zoé (Livre de l'élève)",
    notebook: 'كشكول اللغة الفرنسية',
    tools: 'أقلام رصاص وممحاة'
  },
  ict: {
    book: 'كتاب تكنولوجيا المعلومات والاتصالات ICT',
    notebook: 'كشكول الحاسب الآلي',
    tools: 'جاهزية الحصة بمعمل الحاسب'
  },
  art: {
    book: 'كراسة الرسم والتصميم (Sketchbook)',
    notebook: 'ملف الأعمال الفنية',
    tools: 'ألوان خشبية، شمعية، مسطرة، صمغ'
  },
  pe: {
    book: 'لا يوجد كتاب (نشاط رياضي بدني)',
    notebook: 'لا يوجد كشكول',
    tools: 'الزي الرياضي الكامل والحذاء الرياضي'
  },
  ethics: {
    book: 'كتاب التربية الدينية / القيم وبناء الشخصية',
    notebook: 'كشكول القيم والدين',
    tools: 'قلم رصاص وممحاة'
  }
};

interface AdminPanelProps {
  selectedClass: SchoolClass;
  onSelectClass: (c: SchoolClass) => void;
  selectedBlock?: string;
  selectedWeek?: string;
  onNavigateToTab: (tab: 'daily' | 'weekly' | 'timetable' | 'materials') => void;
  onResetData: () => void;
  onImportData: (importedJson: any) => void;
  dailyFollowUps: DailyFollowUp[];
  weeklyPlans: WeeklyPlanItem[];
  onUpdateWeeklyPlans: (plans: WeeklyPlanItem[]) => void;
  timetables: ClassTimetable[];
  onUpdateTimetables: (timetables: ClassTimetable[]) => void;
  materials: SchoolMaterialFile[];
  onUpdateMaterials: (materials: SchoolMaterialFile[]) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  selectedClass,
  onSelectClass,
  selectedBlock = 'block1',
  selectedWeek = 'week2',
  onNavigateToTab,
  onResetData,
  onImportData,
  dailyFollowUps,
  weeklyPlans,
  onUpdateWeeklyPlans,
  timetables,
  onUpdateTimetables,
  materials,
  onUpdateMaterials
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [adminTab, setAdminTab] = useState<'materials' | 'plans' | 'timetables' | 'overview'>('materials');

  // Live Sync feedback alert
  const [syncAlert, setSyncAlert] = useState<string | null>(null);

  const triggerSyncAlert = (msg: string) => {
    setSyncAlert(msg);
    setTimeout(() => {
      setSyncAlert(null);
    }, 4500);
  };

  // Timetable Management States
  const [timetableClass, setTimetableClass] = useState<SchoolClass>(selectedClass);
  const [timetableDay, setTimetableDay] = useState<string>('الأحد');
  const [isPeriodModalOpen, setIsPeriodModalOpen] = useState(false);
  const [editingPeriodId, setEditingPeriodId] = useState<string | null>(null);
  const [periodClassTarget, setPeriodClassTarget] = useState<SchoolClass | 'all'>(selectedClass);
  const [periodDay, setPeriodDay] = useState<string>('الأحد');
  const [periodNumber, setPeriodNumber] = useState<number>(1);
  const [periodSubject, setPeriodSubject] = useState<string>(SUBJECTS[0].id);
  const [periodTime, setPeriodTime] = useState<string>('08:00 - 08:45');
  const [periodTeacher, setPeriodTeacher] = useState<string>('');
  const [periodRoom, setPeriodRoom] = useState<string>('');

  // Search & Filter States for Materials
  const [materialSearch, setMaterialSearch] = useState('');
  const [materialSubjectFilter, setMaterialSubjectFilter] = useState('all');
  const [materialClassFilter, setMaterialClassFilter] = useState<string>('all');

  // Search & Filter States for Weekly Plans
  const [planSearch, setPlanSearch] = useState('');
  const [planSubjectFilter, setPlanSubjectFilter] = useState('all');
  const [planClassFilter, setPlanClassFilter] = useState<string>('all');
  const [planBlockFilter, setPlanBlockFilter] = useState<string>('all');
  const [planWeekFilter, setPlanWeekFilter] = useState<string>('all');

  // Modal States for Materials
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<SchoolMaterialFile | null>(null);
  const [materialTitle, setMaterialTitle] = useState('');
  const [materialSubject, setMaterialSubject] = useState(SUBJECTS[0].id);
  const [materialClass, setMaterialClass] = useState<SchoolClass | 'all'>('all');
  const [materialType, setMaterialType] = useState<'pdf' | 'doc' | 'image' | 'sheet'>('pdf');
  const [materialFileName, setMaterialFileName] = useState('');
  const [materialFileSize, setMaterialFileSize] = useState('1.8 MB');
  const [materialDesc, setMaterialDesc] = useState('');
  const [materialPreview, setMaterialPreview] = useState('');

  // Modal States for Weekly Plans
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<WeeklyPlanItem | null>(null);
  const [planSubject, setPlanSubject] = useState(SUBJECTS[0].id);
  const [planClass, setPlanClass] = useState<SchoolClass | 'all'>('all');
  const [planBlock, setPlanBlock] = useState(selectedBlock);
  const [planWeek, setPlanWeek] = useState(selectedWeek);
  const [planUnitTitle, setPlanUnitTitle] = useState('');
  const [planObjectivesText, setPlanObjectivesText] = useState('');
  const [planVocabText, setPlanVocabText] = useState('');
  const [planResources, setPlanResources] = useState('');
  const [planAssessment, setPlanAssessment] = useState('');

  // Import JSON handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        onImportData(json);
        alert('تم استيراد بيانات الجداول والخطط بنجاح!');
      } catch (err) {
        alert('ملف غير صالح، يرجى اختيار ملف JSON صحيح تم تصديره من النظام.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ================= MATERIAL ACTIONS =================
  const handleOpenAddMaterial = () => {
    setEditingMaterial(null);
    setMaterialTitle('');
    setMaterialSubject(SUBJECTS[0].id);
    setMaterialClass('all');
    setMaterialType('pdf');
    setMaterialFileName('Worksheet-Grade2.pdf');
    setMaterialFileSize('1.5 MB');
    setMaterialDesc('');
    setMaterialPreview('');
    setIsMaterialModalOpen(true);
  };

  const handleOpenEditMaterial = (item: SchoolMaterialFile) => {
    setEditingMaterial(item);
    setMaterialTitle(item.title);
    setMaterialSubject(item.subjectId);
    setMaterialClass(item.classId);
    setMaterialType(item.fileType);
    setMaterialFileName(item.fileName);
    setMaterialFileSize(item.fileSize);
    setMaterialDesc(item.description || '');
    setMaterialPreview(item.previewSummary || '');
    setIsMaterialModalOpen(true);
  };

  const handleDeleteMaterial = (id: string, title: string) => {
    if (window.confirm(`هل أنت متأكد من حذف الملف "${title}" من مكتبة الماتيريال؟`)) {
      const updated = materials.filter((m) => m.id !== id);
      onUpdateMaterials(updated);
      triggerSyncAlert(`تم حذف الملف "${title}" بنجاح وتحديث واجهة الزائر والطالب فوراً ✓`);
    }
  };

  const handleSaveMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!materialTitle.trim()) {
      alert('يرجى كتابة عنوان المذكرة أو الملف');
      return;
    }

    if (editingMaterial) {
      // Edit existing
      const updated = materials.map((m) => {
        if (m.id === editingMaterial.id) {
          return {
            ...m,
            title: materialTitle.trim(),
            subjectId: materialSubject,
            classId: materialClass,
            fileType: materialType,
            fileName: materialFileName || m.fileName,
            fileSize: materialFileSize || m.fileSize,
            description: materialDesc.trim(),
            previewSummary: materialPreview.trim() || undefined
          };
        }
        return m;
      });
      onUpdateMaterials(updated);
      triggerSyncAlert(`تم تعديل المذكرة "${materialTitle.trim()}" بنجاح وتحديثها فوراً للزوار والطلاب ✓`);
    } else {
      // Add new
      const newMat: SchoolMaterialFile = {
        id: 'mat-' + Date.now(),
        title: materialTitle.trim(),
        subjectId: materialSubject,
        classId: materialClass,
        fileType: materialType,
        fileName: materialFileName || `${materialSubject}-revision.pdf`,
        fileSize: materialFileSize || '2.1 MB',
        uploadDate: new Date().toISOString().split('T')[0],
        uploadedBy: 'إدارة المدرسة (Admin)',
        description: materialDesc.trim(),
        previewSummary: materialPreview.trim() || undefined
      };
      onUpdateMaterials([newMat, ...materials]);
      triggerSyncAlert(`تمت إضافة المذكرة "${materialTitle.trim()}" بنجاح ونزولها فوراً في واجهة الزائر والطالب ✓`);
    }

    setIsMaterialModalOpen(false);
  };

  // Local file upload inside modal
  const handlePickLocalMaterialFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMaterialFileName(file.name);
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
    setMaterialFileSize(`${sizeInMB} MB`);

    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') setMaterialType('pdf');
    else if (ext === 'doc' || ext === 'docx') setMaterialType('doc');
    else if (ext === 'xls' || ext === 'xlsx') setMaterialType('sheet');
    else if (['jpg', 'jpeg', 'png', 'webp'].includes(ext || '')) setMaterialType('image');

    if (!materialTitle) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '');
      setMaterialTitle(cleanName);
    }
  };

  // ================= WEEKLY PLAN ACTIONS =================
  const handleOpenAddPlan = () => {
    setEditingPlan(null);
    setPlanSubject(SUBJECTS[0].id);
    setPlanClass('all');
    setPlanBlock(selectedBlock);
    setPlanWeek(selectedWeek);
    setPlanUnitTitle('');
    setPlanObjectivesText('');
    setPlanVocabText('');
    setPlanResources('');
    setPlanAssessment('');
    setIsPlanModalOpen(true);
  };

  const handleOpenEditPlan = (plan: WeeklyPlanItem) => {
    setEditingPlan(plan);
    setPlanSubject(plan.subjectId);
    setPlanClass(plan.classId);
    setPlanBlock(plan.blockId);
    setPlanWeek(plan.weekId);
    setPlanUnitTitle(plan.unitOrTheme);
    setPlanObjectivesText(plan.learningObjectives.join('\n'));
    setPlanVocabText((plan.vocabulary || []).join(', '));
    setPlanResources(plan.resourcesNote || '');
    setPlanAssessment(plan.assessmentNote || '');
    setIsPlanModalOpen(true);
  };

  const handleDeletePlan = (id: string, title: string) => {
    if (window.confirm(`هل أنت متأكد من حذف الخطة الأسبوعية "${title}"؟`)) {
      const updated = weeklyPlans.filter((p) => p.id !== id);
      onUpdateWeeklyPlans(updated);
      triggerSyncAlert('تم حذف الخطة الأسبوعية بنجاح وتحديث واجهة الزائر والطالب فوراً ✓');
    }
  };

  const handleSavePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!planUnitTitle.trim()) {
      alert('يرجى كتابة عنوان الوحدة أو المحور الدراسي');
      return;
    }

    const objectives = planObjectivesText
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const vocab = planVocabText
      .split(',')
      .map((w) => w.trim())
      .filter((w) => w.length > 0);

    if (editingPlan) {
      // Edit
      const updated = weeklyPlans.map((p) => {
        if (p.id === editingPlan.id) {
          return {
            ...p,
            subjectId: planSubject,
            classId: planClass,
            blockId: planBlock,
            weekId: planWeek,
            unitOrTheme: planUnitTitle.trim(),
            learningObjectives: objectives.length > 0 ? objectives : ['تغطية أهداف الوحدة بحسب منهج النيل المعتمد'],
            vocabulary: vocab.length > 0 ? vocab : undefined,
            resourcesNote: planResources.trim() || undefined,
            assessmentNote: planAssessment.trim() || undefined
          };
        }
        return p;
      });
      onUpdateWeeklyPlans(updated);
      triggerSyncAlert('تم تحديث الخطة الأسبوعية بنجاح وتفعيلها فوراً لجميع الفصول والزوار ✓');
    } else {
      // Add new
      const newPlan: WeeklyPlanItem = {
        id: 'wp-' + Date.now(),
        subjectId: planSubject,
        classId: planClass,
        blockId: planBlock,
        weekId: planWeek,
        unitOrTheme: planUnitTitle.trim(),
        learningObjectives: objectives.length > 0 ? objectives : ['تغطية أهداف الوحدة بحسب منهج النيل المعتمد'],
        vocabulary: vocab.length > 0 ? vocab : undefined,
        resourcesNote: planResources.trim() || undefined,
        assessmentNote: planAssessment.trim() || undefined
      };
      onUpdateWeeklyPlans([newPlan, ...weeklyPlans]);
      triggerSyncAlert('تمت إضافة الخطة الأسبوعية بنجاح ونزولها فوراً في جدول الخطط الأسبوعية ✓');
    }

    setIsPlanModalOpen(false);
  };

  // ================= TIMETABLE CRUD ACTIONS =================
  const handleOpenAddPeriod = (day?: string) => {
    setEditingPeriodId(null);
    setPeriodClassTarget(timetableClass);
    const targetDay = day || timetableDay;
    setPeriodDay(targetDay);

    // Calculate next period number
    const targetTT = timetables.find((t) => t.classId === timetableClass) || timetables[0];
    const targetDaySchedule = targetTT?.days.find((d) => d.dayNameAr === targetDay);
    const existing = targetDaySchedule?.periods || [];
    const maxPeriod = existing.length > 0 ? Math.max(...existing.map((p) => p.periodNum)) : 0;
    const nextNum = maxPeriod >= 7 ? 8 : maxPeriod + 1;
    setPeriodNumber(nextNum);

    const defaultTime = PERIOD_TIMES.find((pt) => pt.periodNum === nextNum)?.time || '08:00 - 08:45';
    setPeriodTime(defaultTime);
    setPeriodSubject(SUBJECTS[0].id);
    setPeriodTeacher('');
    setPeriodRoom('');
    setIsPeriodModalOpen(true);
  };

  const handleOpenEditPeriod = (targetClass: SchoolClass, dayName: string, slot: PeriodSlot) => {
    setEditingPeriodId(slot.id);
    setPeriodClassTarget(targetClass);
    setPeriodDay(dayName);
    setPeriodNumber(slot.periodNum);
    setPeriodSubject(slot.subjectId);
    setPeriodTime(slot.time);
    setPeriodTeacher(slot.teacher || '');
    setPeriodRoom(slot.room || '');
    setIsPeriodModalOpen(true);
  };

  const handleDeletePeriod = (targetClass: SchoolClass, dayName: string, periodId: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه الحصة من الجدول؟ سيتم تفعيل الحذف فوراً لجميع الطلاب والزوار وجدول الحقيبة.')) {
      return;
    }
    const updatedTimetables = timetables.map((tt) => {
      if (tt.classId === targetClass) {
        return {
          ...tt,
          days: tt.days.map((d) => {
            if (d.dayNameAr === dayName) {
              return {
                ...d,
                periods: d.periods.filter((p) => p.id !== periodId)
              };
            }
            return d;
          })
        };
      }
      return tt;
    });
    onUpdateTimetables(updatedTimetables);
    triggerSyncAlert('تم حذف الحصة من الجدول بنجاح وتحديث واجهات الطلاب والزوار فوراً ✓');
  };

  const handleResetClassTimetable = (targetClass: SchoolClass) => {
    if (!window.confirm(`هل أنت متأكد من رغبتك في استعادة الجدول الدراسي النموذجي لفصل ${targetClass}؟`)) {
      return;
    }
    const initialForClass = INITIAL_TIMETABLES.find((t) => t.classId === targetClass);
    if (!initialForClass) return;

    const updatedTimetables = timetables.map((tt) => {
      if (tt.classId === targetClass) {
        return JSON.parse(JSON.stringify(initialForClass));
      }
      return tt;
    });
    onUpdateTimetables(updatedTimetables);
    triggerSyncAlert(`تمت استعادة الجدول النموذجي لفصل ${targetClass} بنجاح وتفعيله فوراً ✓`);
  };

  const handleSavePeriod = (e: React.FormEvent) => {
    e.preventDefault();

    const targetClasses: SchoolClass[] =
      periodClassTarget === 'all' ? ['2A', '2B', '2C'] : [periodClassTarget];

    let updatedTimetables = [...timetables];

    targetClasses.forEach((cls) => {
      updatedTimetables = updatedTimetables.map((tt) => {
        if (tt.classId !== cls) return tt;

        const updatedDays = tt.days.map((day) => {
          if (day.dayNameAr !== periodDay) return day;

          let updatedPeriods: PeriodSlot[];

          if (editingPeriodId) {
            // Editing existing period
            updatedPeriods = day.periods.map((p) => {
              if (p.id === editingPeriodId) {
                return {
                  ...p,
                  periodNum: Number(periodNumber),
                  time: periodTime.trim(),
                  subjectId: periodSubject,
                  teacher: periodTeacher.trim() || undefined,
                  room: periodRoom.trim() || undefined
                };
              }
              return p;
            });
          } else {
            // Check if slot with same periodNum already exists
            const exists = day.periods.find((p) => p.periodNum === Number(periodNumber));
            if (exists) {
              updatedPeriods = day.periods.map((p) => {
                if (p.periodNum === Number(periodNumber)) {
                  return {
                    ...p,
                    time: periodTime.trim(),
                    subjectId: periodSubject,
                    teacher: periodTeacher.trim() || undefined,
                    room: periodRoom.trim() || undefined
                  };
                }
                return p;
              });
            } else {
              const newSlot: PeriodSlot = {
                id: `p-${cls.toLowerCase()}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
                periodNum: Number(periodNumber),
                time: periodTime.trim(),
                subjectId: periodSubject,
                teacher: periodTeacher.trim() || undefined,
                room: periodRoom.trim() || undefined
              };
              updatedPeriods = [...day.periods, newSlot];
            }
          }

          updatedPeriods.sort((a, b) => a.periodNum - b.periodNum);
          return { ...day, periods: updatedPeriods };
        });

        return { ...tt, days: updatedDays };
      });
    });

    onUpdateTimetables(updatedTimetables);
    setIsPeriodModalOpen(false);
    triggerSyncAlert('تم حفظ وتحديث الحصة في الجدول فوراً لجميع الطلاب والزوار وجدول الحقيبة المدرسية ✓');
  };

  // ================= FILTERED LISTS =================
  const filteredMaterials = materials.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(materialSearch.toLowerCase()) ||
      m.fileName.toLowerCase().includes(materialSearch.toLowerCase()) ||
      (m.description || '').toLowerCase().includes(materialSearch.toLowerCase());
    const matchesSubject = materialSubjectFilter === 'all' || m.subjectId === materialSubjectFilter;
    const matchesClass = materialClassFilter === 'all' || m.classId === 'all' || m.classId === materialClassFilter;
    return matchesSearch && matchesSubject && matchesClass;
  });

  const filteredPlans = weeklyPlans.filter((p) => {
    const matchesSearch =
      p.unitOrTheme.toLowerCase().includes(planSearch.toLowerCase()) ||
      p.learningObjectives.some((obj) => obj.toLowerCase().includes(planSearch.toLowerCase())) ||
      (p.vocabulary || []).some((v) => v.toLowerCase().includes(planSearch.toLowerCase()));
    const matchesSubject = planSubjectFilter === 'all' || p.subjectId === planSubjectFilter;
    const matchesClass = planClassFilter === 'all' || p.classId === 'all' || p.classId === planClassFilter;
    const matchesBlock = planBlockFilter === 'all' || p.blockId === planBlockFilter;
    const matchesWeek = planWeekFilter === 'all' || p.weekId === planWeekFilter;
    return matchesSearch && matchesSubject && matchesClass && matchesBlock && matchesWeek;
  });

  const totalPeriodsCount = timetables.reduce(
    (acc, tt) => acc + tt.days.reduce((dAcc, d) => dAcc + d.periods.length, 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Top Banner with Direct Action Buttons */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 text-slate-950 rounded-3xl p-6 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-slate-950 text-amber-400 flex items-center justify-center font-black shadow-lg">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black tracking-tight">
                  لوحة تحكم وإدارة المسؤول (Admin)
                </h2>
                <span className="bg-slate-950 text-amber-300 text-[11px] font-black px-2.5 py-0.5 rounded-full">
                  صلاحيات كاملة
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-900 mt-1">
                إضافة وحذف وتعديل الماتيريال والمذكرات والخطط الأسبوعية وجداول الحصص لفصول Grade 2
              </p>
            </div>
          </div>

          {/* Quick Direct Add Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Button requested by user: Add to Timetable directly */}
            <button
              id="admin-btn-add-period"
              type="button"
              onClick={() => handleOpenAddPeriod()}
              className="flex items-center gap-1.5 bg-indigo-700 hover:bg-indigo-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md transition-all hover:scale-102"
            >
              <Calendar className="w-4 h-4" />
              <span>+ إضافة حصة للجدول الدراسي</span>
            </button>

            <button
              id="admin-btn-add-material"
              type="button"
              onClick={handleOpenAddMaterial}
              className="flex items-center gap-1.5 bg-purple-700 hover:bg-purple-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md transition-all hover:scale-102"
            >
              <Plus className="w-4 h-4" />
              <span>+ إضافة مادة / مذكرة جديدة</span>
            </button>

            <button
              id="admin-btn-add-plan"
              type="button"
              onClick={handleOpenAddPlan}
              className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md transition-all hover:scale-102"
            >
              <Plus className="w-4 h-4" />
              <span>+ إضافة خطة أسبوعية جديدة</span>
            </button>

            <button
              type="button"
              onClick={exportAllDataToJSON}
              className="flex items-center gap-1 bg-slate-950/80 hover:bg-slate-950 text-amber-300 font-bold px-3 py-2 rounded-xl text-xs transition-colors"
              title="تصدير نسخة احتياطية من كل البيانات"
            >
              <Download className="w-3.5 h-3.5" />
              <span>نسخة احتياطية</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1 bg-white/80 hover:bg-white text-slate-900 font-bold px-3 py-2 rounded-xl text-xs transition-colors"
              title="استيراد نسخة احتياطية"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>استيراد</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />
          </div>
        </div>
      </div>

      {/* Live Sync Status Banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2.5 text-emerald-950">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span className="font-black text-sm">المزامنة الفورية المباشرة مفعلة (Live Instant Sync):</span>
          <span className="text-emerald-800 font-medium">
            أي إضافة أو تعديل أو حذف في الماتيريال أو الخطط أو جداول الحصص ينزل فوراً في واجهة الزائر وواجهة الطالب وتجهيزات الحقيبة المدرسية بدون الحاجة لإعادة تحميل الصفحة.
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-emerald-200 text-emerald-900 font-black px-2.5 py-1 rounded-lg text-[11px] border border-emerald-300">
            ✓ تحديث فوري ومحفوظ
          </span>
        </div>
      </div>

      {/* Sync Alert Toast Notification */}
      {syncAlert && (
        <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-xl border border-emerald-500/50 flex items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-2.5 text-xs font-bold text-emerald-300">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{syncAlert}</span>
          </div>
          <button
            type="button"
            onClick={() => setSyncAlert(null)}
            className="text-slate-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 flex-wrap">
        <button
          id="admin-tab-timetables"
          type="button"
          onClick={() => setAdminTab('timetables')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            adminTab === 'timetables'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>إدارة وتعديل جداول الحصص</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
            adminTab === 'timetables' ? 'bg-indigo-800 text-white' : 'bg-slate-100 text-slate-600'
          }`}>
            {totalPeriodsCount} حصة مجدولة
          </span>
        </button>

        <button
          id="admin-tab-materials"
          type="button"
          onClick={() => setAdminTab('materials')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            adminTab === 'materials'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FolderOpen className="w-4 h-4" />
          <span>إدارة وحذف الماتيريال والمذكرات</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
            adminTab === 'materials' ? 'bg-purple-800 text-white' : 'bg-slate-100 text-slate-600'
          }`}>
            {materials.length}
          </span>
        </button>

        <button
          id="admin-tab-plans"
          type="button"
          onClick={() => setAdminTab('plans')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            adminTab === 'plans'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>إدارة وحذف الخطط الأسبوعية</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
            adminTab === 'plans' ? 'bg-emerald-800 text-white' : 'bg-slate-100 text-slate-600'
          }`}>
            {weeklyPlans.length}
          </span>
        </button>

        <button
          id="admin-tab-overview"
          type="button"
          onClick={() => setAdminTab('overview')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            adminTab === 'overview'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>نظرة عامة وإحصائيات سريعة</span>
        </button>
      </div>

      {/* ================= TAB 1: MATERIALS MANAGEMENT ================= */}
      {adminTab === 'materials' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="font-black text-lg text-slate-900 flex items-center gap-2">
                  <FolderOpen className="w-5 h-5 text-purple-600" />
                  <span>إدارة ملفات ومذكرات المواد (Materials & Library)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  أضف مذكرات جديدة، أو عدل عليها، أو احذف أي ملف لم يعد مطلوباً.
                </p>
              </div>

              <button
                type="button"
                onClick={handleOpenAddMaterial}
                className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-xs transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>+ إضافة ملف ماتيريال جديد</span>
              </button>
            </div>

            {/* Filter Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                <input
                  type="text"
                  placeholder="بحث في المذكرات والملفات..."
                  value={materialSearch}
                  onChange={(e) => setMaterialSearch(e.target.value)}
                  className="w-full pr-9 pl-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <select
                  value={materialSubjectFilter}
                  onChange={(e) => setMaterialSubjectFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">جميع المواد (All Subjects)</option>
                  {SUBJECTS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.nameEn} ({s.nameAr})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <select
                  value={materialClassFilter}
                  onChange={(e) => setMaterialClassFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">جميع الفصول (2A, 2B, 2C)</option>
                  <option value="2A">فصل 2A فقط</option>
                  <option value="2B">فصل 2B فقط</option>
                  <option value="2C">فصل 2C فقط</option>
                </select>
              </div>
            </div>
          </div>

          {/* Materials List Table / Cards */}
          <div className="space-y-3">
            {filteredMaterials.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-slate-400">
                <FolderOpen className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p className="text-sm font-bold text-slate-600">لا توجد ملفات تطابق البحث أو الفلتر</p>
                <button
                  type="button"
                  onClick={handleOpenAddMaterial}
                  className="mt-3 text-xs bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold px-3.5 py-1.5 rounded-lg"
                >
                  + إضافة أول ملف ماتيريال الآن
                </button>
              </div>
            ) : (
              filteredMaterials.map((item) => {
                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:border-purple-300 transition-all flex flex-wrap items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 border border-purple-100">
                        {item.fileType === 'pdf' ? (
                          <FileText className="w-5 h-5 text-red-500" />
                        ) : item.fileType === 'sheet' ? (
                          <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                        ) : item.fileType === 'image' ? (
                          <ImageIcon className="w-5 h-5 text-sky-600" />
                        ) : (
                          <FileText className="w-5 h-5 text-blue-600" />
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <SubjectBadge subjectId={item.subjectId} size="sm" />
                          <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-md">
                            {item.classId === 'all' ? 'جميع فصول جريد 2' : `فصل ${item.classId}`}
                          </span>
                          <span className="bg-slate-100 text-slate-500 text-[10px] px-2 py-0.5 rounded-md uppercase font-mono">
                            {item.fileType} • {item.fileSize}
                          </span>
                        </div>

                        <h4 className="font-black text-sm text-slate-900">{item.title}</h4>
                        <p className="text-xs text-slate-500 mt-0.5 font-mono">{item.fileName}</p>
                        {item.description && (
                          <p className="text-xs text-slate-600 mt-1 line-clamp-1">{item.description}</p>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons: Edit and Delete */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEditMaterial(item)}
                        className="flex items-center gap-1 bg-slate-100 hover:bg-purple-100 text-slate-700 hover:text-purple-800 font-bold px-3 py-1.5 rounded-xl text-xs transition-colors"
                        title="تعديل بيانات الملف"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>تعديل</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteMaterial(item.id, item.title)}
                        className="flex items-center gap-1 bg-red-50 hover:bg-red-600 text-red-700 hover:text-white font-bold px-3 py-1.5 rounded-xl text-xs transition-colors"
                        title="حذف الملف من الماتيريال"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>حذف</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 2: WEEKLY PLANS MANAGEMENT ================= */}
      {adminTab === 'plans' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="font-black text-lg text-slate-900 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-emerald-600" />
                  <span>إدارة الخطط الأسبوعية (Weekly Plans)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  إضافة وحذف وتعديل الخطط الدراسية لكل مادة وأسبوع وبلوك.
                </p>
              </div>

              <button
                type="button"
                onClick={handleOpenAddPlan}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-xs transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>+ إضافة خطة أسبوعية جديدة</span>
              </button>
            </div>

            {/* Filter Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                <input
                  type="text"
                  placeholder="بحث في الخطط والوحدات..."
                  value={planSearch}
                  onChange={(e) => setPlanSearch(e.target.value)}
                  className="w-full pr-9 pl-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <select
                  value={planSubjectFilter}
                  onChange={(e) => setPlanSubjectFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="all">جميع المواد (All Subjects)</option>
                  {SUBJECTS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.nameEn} ({s.nameAr})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <select
                  value={planBlockFilter}
                  onChange={(e) => setPlanBlockFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="all">جميع البلوكات (All Blocks)</option>
                  {BLOCKS.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.nameAr}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <select
                  value={planWeekFilter}
                  onChange={(e) => setPlanWeekFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="all">جميع الأسابيع (All Weeks)</option>
                  {WEEKS.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.nameAr}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Plans List Cards */}
          <div className="space-y-3">
            {filteredPlans.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-slate-400">
                <Layers className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p className="text-sm font-bold text-slate-600">لا توجد خطط أسبوعية تطابق البحث أو الفلتر</p>
                <button
                  type="button"
                  onClick={handleOpenAddPlan}
                  className="mt-3 text-xs bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold px-3.5 py-1.5 rounded-lg"
                >
                  + إضافة خطة أسبوعية الآن
                </button>
              </div>
            ) : (
              filteredPlans.map((plan) => {
                const blockObj = BLOCKS.find((b) => b.id === plan.blockId);
                const weekObj = WEEKS.find((w) => w.id === plan.weekId);

                return (
                  <div
                    key={plan.id}
                    className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:border-emerald-300 transition-all"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <SubjectBadge subjectId={plan.subjectId} size="md" />
                        <span className="bg-slate-100 text-slate-700 text-xs font-bold px-2.5 py-0.5 rounded-lg">
                          {plan.classId === 'all' ? 'جميع فصول 2' : `فصل ${plan.classId}`}
                        </span>
                        <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold px-2.5 py-0.5 rounded-lg">
                          {blockObj?.nameAr || plan.blockId} • {weekObj?.nameAr || plan.weekId}
                        </span>
                      </div>

                      {/* Edit and Delete Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEditPlan(plan)}
                          className="flex items-center gap-1 bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800 font-bold px-3 py-1.5 rounded-xl text-xs transition-colors"
                          title="تعديل بيانات الخطة"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>تعديل</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeletePlan(plan.id, plan.unitOrTheme)}
                          className="flex items-center gap-1 bg-red-50 hover:bg-red-600 text-red-700 hover:text-white font-bold px-3 py-1.5 rounded-xl text-xs transition-colors"
                          title="حذف الخطة الأسبوعية"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>حذف</span>
                        </button>
                      </div>
                    </div>

                    <h4 className="font-black text-sm text-slate-900 mb-1">{plan.unitOrTheme}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                      {plan.learningObjectives.join(' • ')}
                    </p>

                    {plan.vocabulary && plan.vocabulary.length > 0 && (
                      <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                        <span className="text-[11px] font-bold text-slate-400">الكلمات:</span>
                        {plan.vocabulary.map((w, idx) => (
                          <span
                            key={idx}
                            className="bg-slate-50 text-slate-600 text-[10px] px-2 py-0.5 rounded border border-slate-200 font-mono"
                          >
                            {w}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 3: OVERVIEW & QUICK LINKS ================= */}
      {adminTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 block">فصول جريد 2</span>
              <span className="text-2xl font-black text-slate-900">3 فصول</span>
              <span className="text-[11px] text-sky-600 font-bold mt-1 block">2A و 2B و 2C</span>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 block">الخطط الأسبوعية</span>
              <span className="text-2xl font-black text-emerald-700">{weeklyPlans.length}</span>
              <span className="text-[11px] text-slate-500 mt-1 block">خطة معتمدة بالبلوكات</span>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 block">ملفات الماتيريال</span>
              <span className="text-2xl font-black text-purple-700">{materials.length}</span>
              <span className="text-[11px] text-slate-500 mt-1 block">مذكرات وملازم مرفوعة</span>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 block">سجلات المتابعة</span>
              <span className="text-2xl font-black text-indigo-700">{dailyFollowUps.length}</span>
              <span className="text-[11px] text-slate-500 mt-1 block">تقارير يومية مسجلة</span>
            </div>
          </div>

          {/* Quick Navigation Action Cards for Admin */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold mb-3">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-base text-slate-900 mb-1">
                  إدارة المتابعة اليومية
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  إدخال الهوم ورك والواجبات، وما تم تدريسه في الحصص، وتجهيزات ومستلزمات الغد.
                </p>
              </div>

              <button
                type="button"
                onClick={() => onNavigateToTab('daily')}
                className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
              >
                إدارة المتابعة اليومية →
              </button>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold mb-3">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-base text-slate-900 mb-1">
                  إدارة الخطط الأسبوعية
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  تنزيل وتحديث الخطط لكل مادة (English, Math, Science, Arabic, إلخ) أسبوعياً.
                </p>
              </div>

              <button
                type="button"
                onClick={() => onNavigateToTab('weekly')}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
              >
                إدارة الخطط الأسبوعية →
              </button>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold mb-3">
                  <Calendar className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-base text-slate-900 mb-1">
                  إدارة جداول الحصص
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  تعديل توزيع الحصص اليومية، أسماء المعلمين، وتوقيت الحصص لفصول 2A، 2B، 2C.
                </p>
              </div>

              <button
                type="button"
                onClick={() => onNavigateToTab('timetable')}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
              >
                تعديل جداول الحصص →
              </button>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold mb-3">
                  <FolderOpen className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-base text-slate-900 mb-1">
                  رفع وإدارة الماتيريال
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  رفع ملفات ومذكرات المواد مع أيقونات فتح، معاينة، تحميل، وطباعة لكل ملف.
                </p>
              </div>

              <button
                type="button"
                onClick={() => onNavigateToTab('materials')}
                className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
              >
                رفع وإدارة الماتيريال →
              </button>
            </div>
          </div>

          {/* Reset Defaults */}
          <div className="bg-red-50/50 rounded-2xl p-5 border border-red-200 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center font-bold shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-red-950">إعادة ضبط البيانات للوضع الافتراضي</h4>
                <p className="text-xs text-red-700 mt-0.5">
                  يعيد الجداول والخطط والمتابعة إلى النموذج الأساسي لمدارس النيل فرع المنيا.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                if (window.confirm('هل أنت متأكد من رغبتك في إعادة ضبط البيانات؟ سيتم مسح أي تعديلات شخصية والعودة للبيانات الافتراضية.')) {
                  onResetData();
                }
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>استعادة البيانات الافتراضية</span>
            </button>
          </div>
        </div>
      )}

      {/* ================= TAB: TIMETABLE MANAGEMENT ================= */}
      {adminTab === 'timetables' && (
        <div className="space-y-5">
          {/* Controls Bar: Class Selector & Day Selector */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-black text-lg text-slate-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-indigo-600" />
                  <span>إدارة وتعديل جداول الحصص الأسبوعية</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  إضافة الحصص، تعديل المواد والمعلمين، وتحديث توقيتات الحصص لفصول 2A و 2B و 2C
                </p>
              </div>

              {/* Class Selection Buttons */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 px-2">الفصل:</span>
                {(['2A', '2B', '2C'] as SchoolClass[]).map((cls) => (
                  <button
                    key={cls}
                    type="button"
                    onClick={() => {
                      setTimetableClass(cls);
                      onSelectClass(cls);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                      timetableClass === cls
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                    }`}
                  >
                    فصل {cls}
                  </button>
                ))}
              </div>
            </div>

            {/* Days Tabs */}
            <div className="flex items-center gap-2 border-t border-slate-100 pt-3 flex-wrap">
              <span className="text-[11px] font-bold text-slate-500">اختر اليوم:</span>
              {['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'].map((dayName) => {
                const daySlotCount =
                  timetables
                    .find((t) => t.classId === timetableClass)
                    ?.days.find((d) => d.dayNameAr === dayName)?.periods.length || 0;
                const isSelected = timetableDay === dayName;
                return (
                  <button
                    key={dayName}
                    type="button"
                    onClick={() => setTimetableDay(dayName)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    <span>{dayName}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                        isSelected ? 'bg-indigo-800 text-white' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {daySlotCount}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Day View Header & Action Buttons */}
          {(() => {
            const currentTT = timetables.find((t) => t.classId === timetableClass) || timetables[0];
            const currentDayObj = currentTT?.days.find((d) => d.dayNameAr === timetableDay) || currentTT?.days[0];
            const activePeriods = currentDayObj?.periods || [];

            return (
              <>
                <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white rounded-2xl p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-xs flex items-center justify-center font-black text-indigo-200 border border-white/10">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-lg font-black tracking-tight">
                          جدول حصص يوم {timetableDay} - فصل {timetableClass}
                        </h4>
                        <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full">
                          {activePeriods.length} حصص مجدولة
                        </span>
                      </div>
                      <p className="text-xs text-indigo-200/80 mt-0.5">
                        مدارس النيل المصرية الدولية - فرع المنيا • العام الدراسي 2026/2027
                      </p>
                    </div>
                  </div>

                  {/* Direct Add Buttons for Timetable */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => handleOpenAddPeriod(timetableDay)}
                      className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all hover:scale-102"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ إضافة حصة لهذا اليوم ({timetableDay})</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        handleOpenAddPeriod(timetableDay);
                        setPeriodClassTarget('all');
                      }}
                      className="flex items-center gap-1.5 px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition-colors"
                      title="إضافة الحصة لجميع الفصول دفعة واحدة"
                    >
                      <span>+ إضافة لجميع الفصول (2A, 2B, 2C)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleResetClassTimetable(timetableClass)}
                      className="flex items-center gap-1 px-3 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-500/30 font-bold text-xs rounded-xl transition-colors"
                      title="استعادة الجدول النموذجي لهذا الفصل"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>استعادة الافتراضي</span>
                    </button>
                  </div>
                </div>

                {/* Periods Cards List */}
                {activePeriods.length === 0 ? (
                  <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                    <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <h4 className="font-bold text-slate-800 text-base mb-1">
                      لا توجد حصص مجدولة ليوم {timetableDay} في فصل {timetableClass}
                    </h4>
                    <p className="text-xs text-slate-500 mb-4 max-w-md mx-auto">
                      يمكنك الآن الضغط على زر إضافة حصة لإدراج الحصة الأولى وتحديد المادة والتوقيت واسم المعلم ومستلزمات الحقيبة المدرسية.
                    </p>
                    <button
                      type="button"
                      onClick={() => handleOpenAddPeriod(timetableDay)}
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                    >
                      + إضافة أول حصة ليوم {timetableDay}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activePeriods.map((slot) => {
                      const kit = SUBJECT_PACKING_KIT[slot.subjectId] || {
                        book: 'كتاب المادة المعتمد',
                        notebook: 'كشكول المادة',
                        tools: 'الأدوات المدرسية والمقلمة'
                      };

                      return (
                        <div
                          key={slot.id}
                          className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:border-indigo-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                        >
                          {/* Left: Period Number & Time & Subject */}
                          <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
                            {/* Period Badge */}
                            <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex flex-col items-center justify-center shrink-0">
                              <span className="text-[10px] font-bold text-indigo-600">حصة</span>
                              <span className="text-base font-black text-indigo-950 leading-none">
                                {slot.periodNum}
                              </span>
                            </div>

                            {/* Subject and Details */}
                            <div className="space-y-1.5 min-w-0 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <SubjectBadge subjectId={slot.subjectId} showIcon size="md" />
                                <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md">
                                  <Clock className="w-3 h-3 text-slate-400" />
                                  <span>{slot.time}</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-3 text-xs text-slate-600 flex-wrap">
                                <div className="flex items-center gap-1 font-medium">
                                  <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                                  <span>المعلم:</span>
                                  <span className="font-bold text-slate-800">
                                    {slot.teacher || 'معلم المادة المعتمد'}
                                  </span>
                                </div>

                                <span className="text-slate-300">•</span>

                                <div className="flex items-center gap-1 font-medium">
                                  <span>القاعة / المكان:</span>
                                  <span className="font-bold text-slate-800">
                                    {slot.room || `فصل ${timetableClass}`}
                                  </span>
                                </div>
                              </div>

                              {/* Packing Kit requirements summary */}
                              <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500 flex-wrap">
                                <span className="font-bold text-slate-600 flex items-center gap-1">
                                  <Package className="w-3 h-3 text-slate-400" />
                                  تجهيزات الحقيبة:
                                </span>
                                <span className="bg-slate-50 border border-slate-200 px-2 py-0.5 rounded text-slate-700">
                                  📖 {kit.book}
                                </span>
                                <span className="bg-slate-50 border border-slate-200 px-2 py-0.5 rounded text-slate-700">
                                  📓 {kit.notebook}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Right: Actions */}
                          <div className="flex items-center gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 justify-end">
                            <button
                              type="button"
                              onClick={() => handleOpenEditPeriod(timetableClass, timetableDay, slot)}
                              className="flex items-center gap-1 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition-colors"
                              title="تعديل الحصة وتوقيتها ومعلمها"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              <span>تعديل الحصة</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeletePeriod(timetableClass, timetableDay, slot.id)}
                              className="flex items-center gap-1 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-xs font-bold transition-colors"
                              title="حذف الحصة من الجدول"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>حذف</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            );
          })()}
        </div>
      )}

      {/* ================= MODAL: ADD / EDIT MATERIAL ================= */}
      {isMaterialModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                  <FolderOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-slate-900">
                    {editingMaterial ? 'تعديل ملف الماتيريال' : 'رفع وإضافة مذكرة / ماتيريال جديد'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    مكتبة مدارس النيل المصرية الدولية فرع المنيا - Grade 2
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMaterialModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMaterial} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  عنوان الملف / المذكرة: <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: مذكرة مراجعة Math Block 1 أو قصة اللغة العربية"
                  value={materialTitle}
                  onChange={(e) => setMaterialTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">المادة الدراسية:</label>
                  <select
                    value={materialSubject}
                    onChange={(e) => setMaterialSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                  >
                    {SUBJECTS.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.nameEn} ({s.nameAr})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">الفصل المستهدف:</label>
                  <select
                    value={materialClass}
                    onChange={(e) => setMaterialClass(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                  >
                    <option value="all">جميع فصول جريد 2 (2A, 2B, 2C)</option>
                    <option value="2A">فصل 2A فقط</option>
                    <option value="2B">فصل 2B فقط</option>
                    <option value="2C">فصل 2C فقط</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">نوع المستند:</label>
                  <select
                    value={materialType}
                    onChange={(e) => setMaterialType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                  >
                    <option value="pdf">ملف PDF (أكروبات)</option>
                    <option value="doc">مستند Word</option>
                    <option value="sheet">جدول بيانات Excel</option>
                    <option value="image">صورة / خريطة توضيحية</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">اختيار ملف من الجهاز:</label>
                  <input
                    type="file"
                    onChange={handlePickLocalMaterialFile}
                    className="w-full px-2 py-1.5 rounded-xl border border-slate-300 text-xs file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">اسم الملف (File Name):</label>
                  <input
                    type="text"
                    value={materialFileName}
                    onChange={(e) => setMaterialFileName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">الحجم التقريبي:</label>
                  <input
                    type="text"
                    value={materialFileSize}
                    onChange={(e) => setMaterialFileSize(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">وصف المذكرة والملاحظات:</label>
                <textarea
                  rows={2}
                  placeholder="وصف مختصر لمحتوى الملف وما يغطيه من دروس وأسئلة..."
                  value={materialDesc}
                  onChange={(e) => setMaterialDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  نص المعاينة السريعة (يظهر داخل نافذة المعاينة بالبرنامج):
                </label>
                <textarea
                  rows={3}
                  placeholder="يمكنك كتابة ملخص أو أهم النقاط لكي يستطيع الطالب وولي الأمر قراءتها سريعاً دون تحميل الملف..."
                  value={materialPreview}
                  onChange={(e) => setMaterialPreview(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsMaterialModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-xl font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-xs"
                >
                  {editingMaterial ? 'حفظ التعديلات' : 'رفع وحفظ في الماتيريال ✓'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD / EDIT WEEKLY PLAN ================= */}
      {isPlanModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-slate-900">
                    {editingPlan ? 'تعديل الخطة الأسبوعية' : 'إضافة خطة أسبوعية جديدة'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    نظام الخطط المعتمد لمدارس النيل فرع المنيا
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPlanModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePlan} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">المادة الدراسية:</label>
                  <select
                    value={planSubject}
                    onChange={(e) => setPlanSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                  >
                    {SUBJECTS.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.nameEn} ({s.nameAr})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">الفصل المستهدف:</label>
                  <select
                    value={planClass}
                    onChange={(e) => setPlanClass(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                  >
                    <option value="all">جميع فصول جريد 2 (All Grade 2)</option>
                    <option value="2A">فصل 2A فقط</option>
                    <option value="2B">فصل 2B فقط</option>
                    <option value="2C">فصل 2C فقط</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">البلوك الدراسي:</label>
                  <select
                    value={planBlock}
                    onChange={(e) => setPlanBlock(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                  >
                    {BLOCKS.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.nameAr}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">الأسبوع:</label>
                  <select
                    value={planWeek}
                    onChange={(e) => setPlanWeek(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                  >
                    {WEEKS.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.nameAr}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  عنوان الوحدة أو الموضوع (Unit / Theme): <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: Unit 2: Two-Digit Addition or أنا أستطيع"
                  value={planUnitTitle}
                  onChange={(e) => setPlanUnitTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  الأهداف التعليمية (Learning Objectives):
                </label>
                <p className="text-[11px] text-slate-400 mb-1">اكتب كل هدف في سطر منفصل</p>
                <textarea
                  rows={4}
                  placeholder={`الهدف الأول\nالهدف الثاني\nالهدف الثالث`}
                  value={planObjectivesText}
                  onChange={(e) => setPlanObjectivesText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  الكلمات والمفردات الجديدة (Vocabulary):
                </label>
                <p className="text-[11px] text-slate-400 mb-1">افصل بين كل كلمة بفاصلة (,)</p>
                <input
                  type="text"
                  placeholder="Community, Helper, Firefighter, Clinic"
                  value={planVocabText}
                  onChange={(e) => setPlanVocabText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">المصادر والصفحات:</label>
                  <input
                    type="text"
                    placeholder="Student Book pp. 24-30 + Workbook"
                    value={planResources}
                    onChange={(e) => setPlanResources(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ملاحظة التقييم والاختبار:</label>
                  <input
                    type="text"
                    placeholder="إملاء يوم الخميس + تقييم أسبوعي"
                    value={planAssessment}
                    onChange={(e) => setPlanAssessment(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPlanModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-xl font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs"
                >
                  {editingPlan ? 'حفظ التعديل' : 'إضافة الخطة الأسبوعية ✓'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD / EDIT TIMETABLE PERIOD ================= */}
      {isPeriodModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-slate-900">
                    {editingPeriodId ? 'تعديل بيانات الحصة في الجدول' : 'إضافة حصة جديدة إلى جدول الحصص'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    مدارس النيل المصرية الدولية فرع المنيا - Grade 2
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPeriodModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePeriod} className="space-y-4">
              {/* Notice of Live Sync */}
              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3 text-xs text-indigo-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>
                  <strong>تأكيد النشر المباشر:</strong> بمجرد الحفظ، تنزل الحصة فوراً في واجهة الزائر وواجهة الطالب وتجهيزات الحقيبة المدرسية وطباعة الجدول.
                </span>
              </div>

              {/* Class target & Day */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    الفصل المستهدف:
                  </label>
                  <select
                    value={periodClassTarget}
                    onChange={(e) => setPeriodClassTarget(e.target.value as SchoolClass | 'all')}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                  >
                    <option value="2A">فصل 2A فقط</option>
                    <option value="2B">فصل 2B فقط</option>
                    <option value="2C">فصل 2C فقط</option>
                    <option value="all">★ تطبيق على جميع فصول جريد 2 (2A, 2B, 2C)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    اليوم الدراسي:
                  </label>
                  <select
                    value={periodDay}
                    onChange={(e) => setPeriodDay(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                  >
                    <option value="الأحد">الأحد (Sunday)</option>
                    <option value="الإثنين">الإثنين (Monday)</option>
                    <option value="الثلاثاء">الثلاثاء (Tuesday)</option>
                    <option value="الأربعاء">الأربعاء (Wednesday)</option>
                    <option value="الخميس">الخميس (Thursday)</option>
                  </select>
                </div>
              </div>

              {/* Period Number and Subject */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    رقم الحصة:
                  </label>
                  <select
                    value={periodNumber}
                    onChange={(e) => {
                      const num = Number(e.target.value);
                      setPeriodNumber(num);
                      const matchingTime = PERIOD_TIMES.find((pt) => pt.periodNum === num);
                      if (matchingTime) {
                        setPeriodTime(matchingTime.time);
                      }
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <option key={num} value={num}>
                        الحصة {num}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    المادة الدراسية:
                  </label>
                  <select
                    value={periodSubject}
                    onChange={(e) => setPeriodSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                  >
                    {SUBJECTS.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.nameAr} ({s.nameEn})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Time slot */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  توقيت الحصة:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <select
                    onChange={(e) => {
                      if (e.target.value) setPeriodTime(e.target.value);
                    }}
                    className="sm:col-span-1 px-3 py-2 rounded-xl border border-slate-300 text-xs bg-slate-50"
                  >
                    <option value="">اختر توقيت معتمد...</option>
                    {PERIOD_TIMES.map((pt) => (
                      <option key={pt.periodNum} value={pt.time}>
                        حصة {pt.periodNum}: {pt.time}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    required
                    value={periodTime}
                    onChange={(e) => setPeriodTime(e.target.value)}
                    placeholder="مثال: 08:00 - 08:45"
                    className="sm:col-span-2 px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                  />
                </div>
              </div>

              {/* Teacher & Room */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    اسم المعلم / المعلمة (اختياري):
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: Ms. Sarah أو Mr. Ahmed أو أ. فاطمة"
                    value={periodTeacher}
                    onChange={(e) => setPeriodTeacher(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    القاعة / المعمل (اختياري):
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: معمل العلوم Science Lab أو Room 204"
                    value={periodRoom}
                    onChange={(e) => setPeriodRoom(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>

              {/* Packing list preview for this subject */}
              {(() => {
                const kit = SUBJECT_PACKING_KIT[periodSubject] || {
                  book: 'كتاب المادة المعتمد',
                  notebook: 'كشكول المادة',
                  tools: 'الأدوات المدرسية والمقلمة'
                };
                return (
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs space-y-1">
                    <span className="font-bold text-slate-700 block text-[11px]">
                      مستلزمات الحقيبة المدرسية التلقائية لهذه المادة:
                    </span>
                    <div className="text-slate-600 text-[11px] grid grid-cols-1 sm:grid-cols-3 gap-1">
                      <div>📚 {kit.book}</div>
                      <div>📓 {kit.notebook}</div>
                      <div>✏️ {kit.tools}</div>
                    </div>
                  </div>
                );
              })()}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPeriodModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-xl font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl shadow-xs"
                >
                  {editingPeriodId ? 'حفظ تعديل الحصة ✓' : 'حفظ وإدراج الحصة في الجدول ✓'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
