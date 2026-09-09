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
  Filter
} from 'lucide-react';
import {
  SchoolClass,
  DailyFollowUp,
  WeeklyPlanItem,
  ClassTimetable,
  SchoolMaterialFile
} from '../types';
import { exportAllDataToJSON } from '../lib/storage';
import { SUBJECTS, BLOCKS, WEEKS } from '../data/initialData';
import { SubjectBadge, getSubjectInfo } from './SubjectBadge';

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
  materials,
  onUpdateMaterials
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [adminTab, setAdminTab] = useState<'materials' | 'plans' | 'overview'>('materials');

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
    }

    setIsPlanModalOpen(false);
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
                إضافة وحذف وتعديل الماتيريال والمذكرات والخطط الأسبوعية لفصول Grade 2
              </p>
            </div>
          </div>

          {/* Quick Direct Add Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
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

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
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
          <Calendar className="w-4 h-4" />
          <span>الأقسام العامة والروابط</span>
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
    </div>
  );
};
