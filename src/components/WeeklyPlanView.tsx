import React, { useEffect, useState, useRef } from 'react';
import {
  Layers,
  BookOpen,
  Calendar,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  FileText,
  Bookmark,
  Printer,
  ChevronDown,
  Upload,
  Download,
  Eye,
  X,
  File,
  Sparkles,
  Paperclip,
  Copy
} from 'lucide-react';
import { WeeklyPlanItem, SchoolClass, UserRole } from '../types';
import { SubjectBadge, getSubjectInfo } from './SubjectBadge';
import { SUBJECTS, BLOCKS, WEEKS } from '../data/initialData';
import { extractTextFromPdf } from '../lib/timetableParser';
import { parseWeeklyPlanText } from '../lib/weeklyPlanParser';

interface WeeklyPlanViewProps {
  currentRole: UserRole;
  selectedClass: SchoolClass;
  selectedBlock: string;
  onSelectBlock: (b: string) => void;
  selectedWeek: string;
  onSelectWeek: (w: string) => void;
  weeklyPlans: WeeklyPlanItem[];
  onUpdateWeeklyPlans: (data: WeeklyPlanItem[]) => void;
  onOpenPrint: () => void;
}

export const WeeklyPlanView: React.FC<WeeklyPlanViewProps> = ({
  currentRole,
  selectedClass,
  selectedBlock,
  onSelectBlock,
  selectedWeek,
  onSelectWeek,
  weeklyPlans,
  onUpdateWeeklyPlans,
  onOpenPrint
}) => {
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');

  // Admin Modal
  const [editingPlan, setEditingPlan] = useState<{ isOpen: boolean; item?: WeeklyPlanItem }>({ isOpen: false });

  // Form states
  const [formSubject, setFormSubject] = useState(SUBJECTS[0].id);
  const [formTheme, setFormTheme] = useState('');
  const [formObjectives, setFormObjectives] = useState('');
  const [formVocabulary, setFormVocabulary] = useState('');
  const [formResources, setFormResources] = useState('');
  const [formAssessment, setFormAssessment] = useState('');
  const [formHomework, setFormHomework] = useState('');
  const [formClasswork, setFormClasswork] = useState('');
  const [formTomorrowNote, setFormTomorrowNote] = useState('');
  const [formExtractedText, setFormExtractedText] = useState('');

  // File Attachment States for Weekly Plan (PDF / Word)
  const [formFileName, setFormFileName] = useState('');
  const [formFileType, setFormFileType] = useState<'pdf' | 'word' | 'doc'>('pdf');
  const [formFileSize, setFormFileSize] = useState('');
  const [formFileDataUrl, setFormFileDataUrl] = useState<string | undefined>(undefined);

  const [dictationOpen, setDictationOpen] = useState(false);
  const [dictationSubject, setDictationSubject] = useState(SUBJECTS[0].id);
  const [dictationFile, setDictationFile] = useState<{ name: string; type: 'pdf' | 'word' | 'image'; size: string; dataUrl: string } | null>(null);

  // Plan File Preview Modal
  const [previewPlanItem, setPreviewPlanItem] = useState<WeeklyPlanItem | null>(null);
  const [copiedNotification, setCopiedNotification] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    const pending = weeklyPlans.filter((plan) => plan.fileType === 'pdf' && plan.fileDataUrl && !plan.extractedText);
    if (!pending.length) return;
    void Promise.all(pending.map(async (plan) => {
      try {
        const text = await extractTextFromPdf(plan.fileDataUrl!);
        const extracted = parseWeeklyPlanText(text);
        return { ...plan, extractedText: extracted.extractedText, classworkNote: extracted.classworkNote, homeworkNote: extracted.homeworkNote || plan.homeworkNote, tomorrowNote: extracted.tomorrowNote };
      } catch {
        return plan;
      }
    })).then((processed) => {
      if (cancelled) return;
      const byId = new Map(processed.map((plan) => [plan.id, plan]));
      onUpdateWeeklyPlans(weeklyPlans.map((plan) => byId.get(plan.id) || plan));
    });
    return () => { cancelled = true; };
  }, [weeklyPlans, onUpdateWeeklyPlans]);

  // Filter items matching block, week, and class
  const filteredPlans = weeklyPlans.filter((p) => {
    const matchBlock = p.blockId === selectedBlock;
    const matchWeek = p.weekId === selectedWeek;
    const matchClass = p.classId === 'all' || p.classId === selectedClass;
    const matchSubject = selectedSubjectFilter === 'all' || p.subjectId === selectedSubjectFilter;
    return matchBlock && matchWeek && matchClass && matchSubject;
  });

  const handleOpenAddModal = (asFileUpload = false) => {
    setEditingPlan({ isOpen: true });
    setFormSubject(SUBJECTS[0].id);
    setFormTheme('');
    setFormObjectives('');
    setFormVocabulary('');
    setFormResources('');
    setFormAssessment('');
    setFormHomework('');
    setFormClasswork('');
    setFormTomorrowNote('');
    setFormExtractedText('');
    setFormFileName('');
    setFormFileType('pdf');
    setFormFileSize('');
    setFormFileDataUrl(undefined);

    if (asFileUpload) {
      setTimeout(() => {
        fileInputRef.current?.click();
      }, 150);
    }
  };

  const handleOpenEditModal = (item: WeeklyPlanItem) => {
    setEditingPlan({ isOpen: true, item });
    setFormSubject(item.subjectId);
    setFormTheme(item.unitOrTheme);
    setFormObjectives((item.learningObjectives || []).join('\n'));
    setFormVocabulary((item.vocabulary || []).join(', '));
    setFormResources(item.resourcesNote || '');
    setFormAssessment(item.assessmentNote || '');
    setFormHomework(item.homeworkNote || '');
    setFormClasswork(item.classworkNote || '');
    setFormTomorrowNote(item.tomorrowNote || '');
    setFormExtractedText(item.extractedText || '');
    setFormFileName(item.fileName || '');
    setFormFileType(item.fileType || 'pdf');
    setFormFileSize(item.fileSize || '');
    setFormFileDataUrl(item.fileDataUrl);
  };

  // Handle local PDF or Word file upload
  const handlePickLocalPlanFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFormFileName(file.name);
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
    setFormFileSize(`${sizeInMB} MB`);

    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext === 'doc' || ext === 'docx') {
      setFormFileType('word');
    } else {
      setFormFileType('pdf');
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setFormFileDataUrl(dataUrl);
      if (ext !== 'doc' && ext !== 'docx') {
        void extractTextFromPdf(dataUrl).then((text) => {
          const extracted = parseWeeklyPlanText(text);
          setFormExtractedText(extracted.extractedText);
          if (extracted.classworkNote) setFormClasswork(extracted.classworkNote);
          if (extracted.homeworkNote) setFormHomework(extracted.homeworkNote);
          if (extracted.tomorrowNote) setFormTomorrowNote(extracted.tomorrowNote);
        }).catch(() => undefined);
      }
    };
    reader.readAsDataURL(file);

    // Auto fill theme title if empty
    if (!formTheme) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' ');
      setFormTheme(cleanName);
    }
  };

  const handlePickDictationFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.split('.').pop()?.toLowerCase();
    const type: 'pdf' | 'word' | 'image' = file.type.startsWith('image/') ? 'image' : ext === 'doc' || ext === 'docx' ? 'word' : 'pdf';
    const reader = new FileReader();
    reader.onload = () => setDictationFile({ name: file.name, type, size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`, dataUrl: reader.result as string });
    reader.readAsDataURL(file);
  };

  const handleSaveDictation = () => {
    if (!dictationFile) return;
    onUpdateWeeklyPlans(weeklyPlans.map((plan) =>
      plan.blockId === selectedBlock && plan.weekId === selectedWeek && plan.subjectId === dictationSubject
        ? { ...plan, dictationFileName: dictationFile.name, dictationFileType: dictationFile.type, dictationFileSize: dictationFile.size, dictationFileDataUrl: dictationFile.dataUrl }
        : plan
    ));
    setDictationFile(null);
    setDictationOpen(false);
  };

  const handleSavePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTheme.trim()) return;

    const objectivesList = formObjectives
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const vocabList = formVocabulary
      .split(/[,،]+/)
      .map((s) => s.trim())
      .filter(Boolean);

    const newRecord: WeeklyPlanItem = {
      id: editingPlan.item?.id || `wp-${Date.now()}`,
      blockId: selectedBlock,
      weekId: selectedWeek,
      classId: 'all',
      subjectId: formSubject,
      unitOrTheme: formTheme.trim(),
      learningObjectives: objectivesList.length > 0 ? objectivesList : ['متابعة محتوى وخطة الوحدة المعتمدة'],
      vocabulary: vocabList.length > 0 ? vocabList : undefined,
      resourcesNote: formResources.trim() || undefined,
      assessmentNote: formAssessment.trim() || undefined,
      homeworkNote: formHomework.trim() || undefined,
      classworkNote: formClasswork.trim() || undefined,
      tomorrowNote: formTomorrowNote.trim() || undefined,
      extractedText: formExtractedText.trim() || undefined,
      fileName: formFileName.trim() || `${formSubject}_Plan_${selectedBlock}_${selectedWeek}.${formFileType === 'word' ? 'docx' : 'pdf'}`,
      fileType: formFileType,
      fileSize: formFileSize || '1.5 MB',
      fileDataUrl: formFileDataUrl
    };

    const index = weeklyPlans.findIndex((p) => p.id === newRecord.id);
    let updatedList: WeeklyPlanItem[];
    if (index >= 0) {
      updatedList = [...weeklyPlans];
      updatedList[index] = newRecord;
    } else {
      updatedList = [newRecord, ...weeklyPlans];
    }

    onUpdateWeeklyPlans(updatedList);
    setEditingPlan({ isOpen: false });
  };

  const handleDeletePlan = (id: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه الخطة؟')) return;
    const updated = weeklyPlans.filter((p) => p.id !== id);
    onUpdateWeeklyPlans(updated);
  };

  // Download plan file
  const handleDownloadPlanFile = (plan: WeeklyPlanItem) => {
    if (plan.fileDataUrl) {
      const link = document.createElement('a');
      link.href = plan.fileDataUrl;
      link.download = plan.fileName || `${plan.subjectId}-weekly-plan.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      return;
    }

    const sub = getSubjectInfo(plan.subjectId);
    const content = `===============================================================
مدارس النيل المصرية الدولية - فرع المنيا (Nile Egyptian Schools)
Weekly Plan - Grade 2
===============================================================
المادة: ${sub.nameAr} (${sub.nameEn})
الوحدة والموضوع: ${plan.unitOrTheme}
Block: ${plan.blockId} | الأسبوع: ${plan.weekId}
Class: ${plan.classId === 'all' ? 'All Classes (2A, 2B, 2C)' : `Class ${plan.classId}`}
الملف: ${plan.fileName || 'Plan.pdf'} (${plan.fileSize || '1.5 MB'})

مخرجات وأهداف التعلم المستهدفة:
${(plan.learningObjectives || []).map((o, i) => `${i + 1}. ${o}`).join('\n')}

المفردات الأساسية:
${(plan.vocabulary || []).join(' - ')}

الكتب والمصادر:
${plan.resourcesNote || 'كتب منهج النيل الدولي المعتمد.'}

ملاحظات التقييم:
${plan.assessmentNote || 'المتابعة اليومية والتقييم المستمر.'}
===============================================================
`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = plan.fileName || `${sub.nameEn}_WeeklyPlan_${plan.blockId}.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  // Print plan
  const handlePrintSinglePlan = (plan: WeeklyPlanItem) => {
    const sub = getSubjectInfo(plan.subjectId);
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
      <head>
        <meta charset="UTF-8">
        <title>خطة ${plan.unitOrTheme} - مدارس النيل المصرية الدولية</title>
        <style>
          @page { size: A4 portrait; margin: 15mm; }
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 20px; color: #0f172a; line-height: 1.6; }
          .header { border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; }
          .title { font-size: 16pt; font-weight: bold; }
          .box { border: 1px solid #cbd5e1; border-radius: 8px; padding: 16px; margin-bottom: 16px; background: #f8fafc; }
          .sec-title { font-size: 11pt; font-weight: bold; color: #1e293b; margin-bottom: 6px; }
          ul { margin: 0; padding-right: 20px; font-size: 10.5pt; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="title">مدارس النيل المصرية الدولية - فرع المنيا</div>
            <div>Weekly Plan • Grade 2</div>
          </div>
          <div style="font-weight:bold; font-size:12pt; background:#0f172a; color:white; padding:6px 12px; border-radius:6px;">
            ${sub.nameAr} - ${sub.nameEn}
          </div>
        </div>

        <div class="box">
          <div style="font-size:13pt; font-weight:bold; margin-bottom:4px;">${plan.unitOrTheme}</div>
          <div style="font-size:10pt; color:#64748b;">Block: ${plan.blockId} • الأسبوع: ${plan.weekId} • الملف: ${plan.fileName || 'WeeklyPlan.pdf'}</div>
        </div>

        <div class="box">
          <div class="sec-title">🎯 أهداف ومخرجات التعلم:</div>
          <ul>
            ${(plan.learningObjectives || []).map((o) => `<li>${o}</li>`).join('')}
          </ul>
        </div>

        ${plan.vocabulary && plan.vocabulary.length > 0 ? `
          <div class="box">
            <div class="sec-title">🔤 الكلمات والمصطلحات الأساسية:</div>
            <div>${plan.vocabulary.join(' • ')}</div>
          </div>
        ` : ''}

        ${plan.resourcesNote ? `
          <div class="box">
            <div class="sec-title">📖 المصادر والكتب:</div>
            <div>${plan.resourcesNote}</div>
          </div>
        ` : ''}

        ${plan.assessmentNote ? `
          <div class="box" style="background:#fffbeb; border-color:#fef3c7;">
            <div class="sec-title" style="color:#92400e;">📝 ملاحظات التقييم:</div>
            <div>${plan.assessmentNote}</div>
          </div>
        ` : ''}

        <div style="margin-top:40px; display:flex; justify-content:space-between; font-size:10pt; color:#64748b; border-top:1px solid #e2e8f0; padding-top:12px;">
          <div>معتمد من الإدارة الأكاديمية - مدارس النيل بالمنيا</div>
          <div>تاريخ الطباعة: ${new Date().toLocaleDateString('ar-EG')}</div>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 400);
  };

  const currentBlockObj = BLOCKS.find((b) => b.id === selectedBlock);
  const currentWeekObj = WEEKS.find((w) => w.id === selectedWeek);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center font-bold">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                Weekly Plan (Curriculum Plans)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {currentBlockObj?.nameAr} • {currentWeekObj?.nameAr} • Grade 2 (Class 2A, 2B, 2C)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              id="btn-print-weekly-plan"
              type="button"
              onClick={onOpenPrint}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>طباعة Weekly Plan</span>
            </button>

            {currentRole === 'admin' && (
              <>
                {/* File upload button explicitly requested by user */}
                <button
                  id="btn-add-plan-file"
                  type="button"
                  onClick={() => handleOpenAddModal(true)}
                  className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                  title="رفع ملف PDF أو Word"
                >
                  <Upload className="w-4 h-4" />
                  <span>+ رفع ملف (PDF / Word)</span>
                </button>

                <button
                  id="btn-add-plan-item"
                  type="button"
                  onClick={() => handleOpenAddModal(false)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ إضافة مادة</span>
                </button>
                <button
                  id="btn-admin-dictation"
                  type="button"
                  onClick={() => setDictationOpen(true)}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                  title="رفع ورقة Dictation لتظهر في Homework"
                >
                  <FileText className="w-4 h-4" />
                  <span>Dictation</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Block & Week Pickers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-100">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1">
              Block:
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {BLOCKS.map((block) => (
                <button
                  key={block.id}
                  id={`plan-block-btn-${block.id}`}
                  type="button"
                  onClick={() => onSelectBlock(block.id)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all border ${
                    selectedBlock === block.id
                      ? 'bg-emerald-500 text-white border-emerald-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {block.nameAr}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1">
              Week:
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {WEEKS.map((week) => (
                <button
                  key={week.id}
                  id={`plan-week-btn-${week.id}`}
                  type="button"
                  onClick={() => onSelectWeek(week.id)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all border ${
                    selectedWeek === week.id
                      ? 'bg-emerald-500 text-white border-emerald-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {week.nameAr}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Subjects Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 mt-4 pt-4 border-t border-slate-100">
          <span className="text-[11px] font-bold text-slate-400 shrink-0 ml-1">فلترة المادة:</span>
          <button
            id="sub-filter-all"
            type="button"
            onClick={() => setSelectedSubjectFilter('all')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${
              selectedSubjectFilter === 'all'
                ? 'bg-slate-900 text-white border-slate-900 font-bold shadow-xs'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            جميع المواد
          </button>
          {SUBJECTS.map((sub) => {
            const isSelected = selectedSubjectFilter === sub.id;
            return (
              <button
                key={sub.id}
                id={`sub-filter-${sub.id}`}
                type="button"
                onClick={() => setSelectedSubjectFilter(sub.id)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${
                  isSelected
                    ? `${sub.color} border-current shadow-xs font-bold`
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {sub.nameEn}
              </button>
            );
          })}
        </div>
      </div>

      {/* Weekly Plan Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPlans.length === 0 ? (
          <div className="col-span-2 bg-white rounded-2xl p-12 text-center border border-slate-200">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-700 text-base mb-1">
              لا توجد خطة معتمدة لهذا الأسبوع أو المادة المختارة
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
              يمكنك رفع الخطة كملف PDF أو Word أو كتابة محتوى الخطة مباشرة.
            </p>
            {currentRole === 'admin' && (
              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenAddModal(true)}
                  className="bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs flex items-center gap-1.5"
                >
                  <Upload className="w-4 h-4" />
                  <span>+ رفع خطة كملف (PDF / Word)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenAddModal(false)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs"
                >
                  + كتابة خطة مادة
                </button>
              </div>
            )}
          </div>
        ) : (
          filteredPlans.map((plan) => {
            const sub = getSubjectInfo(plan.subjectId);
            return (
              <div
                key={plan.id}
                id={`plan-card-${plan.id}`}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 transition-all overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Card Header */}
                  <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <SubjectBadge subjectId={plan.subjectId} size="md" />
                      <span className="text-[11px] font-bold text-slate-400">
                        {plan.classId === 'all' ? 'All Classes (Grade 2)' : `Class ${plan.classId}`}
                      </span>
                    </div>

                    {currentRole === 'admin' && (
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(plan)}
                          className="p-1 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-md"
                          title="تعديل الخطة"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeletePlan(plan.id)}
                          className="p-1 text-slate-500 hover:text-red-700 hover:bg-red-50 rounded-md"
                          title="حذف الخطة"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="p-5 space-y-4">
                    {/* Weekly Plan Title */}
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-base leading-snug">
                        Weekly Plan - {sub.nameEn} ({plan.unitOrTheme})
                      </h3>
                    </div>

                    {/* Attached File Badge / Box (PDF or Word) */}
                    <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-9 h-9 rounded-lg bg-white border border-emerald-300 text-emerald-700 flex items-center justify-center shrink-0">
                          {plan.fileType === 'word' ? (
                            <File className="w-5 h-5 text-blue-600" />
                          ) : (
                            <FileText className="w-5 h-5 text-red-600" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-800 truncate">
                            {plan.fileName || `${sub.nameEn}_WeeklyPlan.pdf`}
                          </div>
                          <div className="text-[10px] text-slate-500 flex items-center gap-1.5">
                            <span className="font-semibold uppercase bg-emerald-100 text-emerald-800 px-1 rounded">
                              {plan.fileType === 'word' ? 'Word' : 'PDF'}
                            </span>
                            <span>•</span>
                            <span>{plan.fileSize || '1.5 MB'}</span>
                            <span>•</span>
                            <span>خطة رسمية معتمدة</span>
                          </div>
                        </div>
                      </div>

                      {/* Download & Preview Actions for the Plan File */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => setPreviewPlanItem(plan)}
                          className="p-1.5 bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors shadow-2xs cursor-pointer"
                          title="معاينة ملف الخطة"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">معاينة</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDownloadPlanFile(plan)}
                          className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors shadow-2xs cursor-pointer"
                          title="تحميل ملف الخطة"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">تحميل</span>
                        </button>
                      </div>
                    </div>

                    {/* Learning Objectives */}
                    <div>
                      <span className="text-xs font-bold text-slate-700 block mb-2">
                        🎯 مخرجات وأهداف التعلم المستهدفة:
                      </span>
                      <ul className="space-y-1.5">
                        {plan.learningObjectives?.map((obj, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0"></span>
                            <span className="leading-relaxed">{obj}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Key Vocabulary */}
                    {plan.vocabulary && plan.vocabulary.length > 0 && (
                      <div>
                        <span className="text-xs font-bold text-slate-700 block mb-1.5">
                          🔤 الكلمات والمصطلحات الأساسية:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {plan.vocabulary.map((v, idx) => (
                            <span
                              key={idx}
                              className="bg-slate-100 text-slate-800 text-[11px] font-semibold px-2.5 py-0.5 rounded-md border border-slate-200"
                            >
                              {v}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer: Resources & Assessment */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 text-xs space-y-1.5">
                  {plan.resourcesNote && (
                    <div className="text-slate-600 flex items-start gap-1.5">
                      <span className="font-bold text-slate-800 shrink-0">📖 الكتب والمصادر:</span>
                      <span className="leading-relaxed">{plan.resourcesNote}</span>
                    </div>
                  )}
                  {plan.assessmentNote && (
                    <div className="text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200/60 font-medium flex items-start gap-1.5">
                      <span className="font-bold shrink-0">📝 التقييم والاختبار:</span>
                      <span>{plan.assessmentNote}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {dictationOpen && currentRole === 'admin' && (
        <div className="fixed inset-0 bg-slate-950/70 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-slate-900 flex items-center gap-2"><FileText className="w-5 h-5 text-rose-600" /> Dictation</h3>
              <button type="button" onClick={() => setDictationOpen(false)} className="p-1 rounded-lg hover:bg-slate-100"><X className="w-4 h-4" /></button>
            </div>
            <p className="text-xs text-slate-600">ارفع ورقة الإملاء للمادة. ستظهر تلقائيًا في Homework لكل الأيام لهذا الأسبوع.</p>
            <select value={dictationSubject} onChange={(e) => setDictationSubject(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold">
              {SUBJECTS.map((s) => <option key={s.id} value={s.id}>{s.nameEn}</option>)}
            </select>
            <input type="file" accept=".pdf,.doc,.docx,image/*" onChange={handlePickDictationFile} className="w-full text-xs" />
            {dictationFile && <div className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 rounded-xl p-3">{dictationFile.name} • {dictationFile.size}</div>}
            <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
              <button type="button" onClick={() => setDictationOpen(false)} className="px-4 py-2 text-xs font-bold text-slate-600 rounded-xl hover:bg-slate-100">إلغاء</button>
              <button type="button" disabled={!dictationFile} onClick={handleSaveDictation} className="px-4 py-2 text-xs font-bold text-white bg-rose-600 disabled:opacity-50 rounded-xl">حفظ Dictation</button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: PREVIEW PLAN FILE ================= */}
      {previewPlanItem && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 z-50 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full h-[90vh] shadow-2xl border border-slate-200 flex flex-col justify-between overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-slate-900 text-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold">
                  {previewPlanItem.fileType === 'word' ? (
                    <File className="w-5 h-5 text-blue-400" />
                  ) : (
                    <FileText className="w-5 h-5 text-red-400" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <SubjectBadge subjectId={previewPlanItem.subjectId} size="sm" />
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-500/30 text-emerald-200 uppercase font-mono">
                      {previewPlanItem.fileName || 'WeeklyPlan.pdf'}
                    </span>
                  </div>
                  <h3 className="font-black text-white text-sm sm:text-base mt-0.5">
                    Weekly Plan - {getSubjectInfo(previewPlanItem.subjectId).nameEn} ({previewPlanItem.unitOrTheme})
                  </h3>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handlePrintSinglePlan(previewPlanItem)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">طباعة</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewPlanItem(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body: If actual file data is attached, display the file itself */}
            <div className="flex-1 bg-slate-100 p-4 overflow-auto">
              {previewPlanItem.fileDataUrl ? (
                previewPlanItem.fileType === 'word' ? (
                  <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center max-w-md mx-auto my-12 shadow-sm">
                    <File className="w-16 h-16 text-blue-600 mx-auto mb-3" />
                    <h4 className="font-bold text-slate-900 text-base mb-1">{previewPlanItem.fileName}</h4>
                    <p className="text-xs text-slate-500 mb-4 font-mono">{previewPlanItem.fileSize || 'مستند Word'}</p>
                    <p className="text-xs text-slate-600 mb-6">
                      ملف وورد رسمي معتمد لخطة الأسبوع. يمكنك فتحه في برنامج Word أو تحميله مباشرة.
                    </p>
                    <a
                      href={previewPlanItem.fileDataUrl}
                      download={previewPlanItem.fileName || 'WeeklyPlan.docx'}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>فتح / تحميل ملف Word المعتمد</span>
                    </a>
                  </div>
                ) : previewPlanItem.fileDataUrl.startsWith('data:image/') ? (
                  <div className="flex items-center justify-center min-h-full">
                    <img
                      src={previewPlanItem.fileDataUrl}
                      alt={previewPlanItem.fileName || 'Weekly Plan'}
                      className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-lg border border-slate-200"
                    />
                  </div>
                ) : (
                  <iframe
                    src={previewPlanItem.fileDataUrl}
                    title={previewPlanItem.fileName || 'Weekly Plan PDF'}
                    className="w-full h-[75vh] rounded-xl border border-slate-200 shadow-sm bg-white"
                  />
                )
              ) : (
                <div className="max-w-2xl mx-auto space-y-4 my-2 p-1">
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                    <div className="text-xs font-bold text-slate-700 mb-3 flex items-center justify-between">
                      <span>🎯 أهداف ومخرجات التعلم:</span>
                      <button
                        type="button"
                        onClick={() => {
                          const text = (previewPlanItem.learningObjectives || []).join('\n');
                          navigator.clipboard.writeText(text);
                          setCopiedNotification(true);
                          setTimeout(() => setCopiedNotification(false), 2000);
                        }}
                        className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>{copiedNotification ? 'تم النسخ ✓' : 'نسخ الأهداف'}</span>
                      </button>
                    </div>
                    <ul className="space-y-2">
                      {(previewPlanItem.learningObjectives || []).map((o, idx) => (
                        <li key={idx} className="text-xs text-slate-700 flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0"></span>
                          <span>{o}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {previewPlanItem.vocabulary && previewPlanItem.vocabulary.length > 0 && (
                    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                      <div className="text-xs font-bold text-slate-700 mb-2">🔤 الكلمات والمصطلحات:</div>
                      <div className="flex flex-wrap gap-1.5">
                        {previewPlanItem.vocabulary.map((v, i) => (
                          <span
                            key={i}
                            className="bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-800"
                          >
                            {v}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {previewPlanItem.resourcesNote && (
                    <div className="text-xs text-slate-700 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                      <span className="font-bold">📖 المصادر والكتب:</span> {previewPlanItem.resourcesNote}
                    </div>
                  )}

                  {previewPlanItem.assessmentNote && (
                    <div className="text-xs text-amber-900 bg-amber-50 p-4 rounded-2xl border border-amber-200 shadow-xs">
                      <span className="font-bold">📝 التقييم والاختبارات:</span> {previewPlanItem.assessmentNote}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDownloadPlanFile(previewPlanItem)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>تحميل الملف</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setPreviewPlanItem(null)}
                className="px-5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Add/Edit Modal */}
      {editingPlan.isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-black text-slate-900 mb-2">
              {editingPlan.item ? 'تعديل الخطة الأسبوعية للمادة' : 'إضافة خطة أسبوعية جديدة (ملف أو محتوى)'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              يمكنك رفع ملف PDF أو Word أو كتابة محتوى الخطة مباشرة لجميع الفصول والطلاب.
            </p>

            <form onSubmit={handleSavePlan} className="space-y-4">
              {/* File Upload Box */}
              <div className="bg-emerald-50/70 border border-dashed border-emerald-300 rounded-2xl p-4 text-center">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePickLocalPlanFile}
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-white hover:bg-emerald-100 text-emerald-800 font-bold px-4 py-2 rounded-xl text-xs border border-emerald-300 shadow-2xs inline-flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Upload className="w-4 h-4 text-emerald-600" />
                  <span>رفع ملف الخطة (PDF أو Word)</span>
                </button>
                {formFileName ? (
                  <p className="text-xs text-emerald-900 font-bold mt-2">
                    الملف المرفق: {formFileName} ({formFileSize})
                  </p>
                ) : (
                  <p className="text-[11px] text-slate-400 mt-1">
                    يمكنك إرفاق ملف الخطة الأصلي بصيغة PDF أو مستند Word
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">المادة الدراسية:</label>
                  <select
                    value={formSubject}
                    onChange={(e) => setFormSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  >
                    {SUBJECTS.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.nameEn} ({s.nameAr})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Class:</label>
                  <input
                    type="text"
                    disabled
                    value="Grade 2 (2A, 2B, 2C)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 text-xs font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  عنوان الوحدة أو موضوع الأسبوع (Unit / Theme):
                </label>
                <input
                  type="text"
                  placeholder="مثال: Unit 2: Community Helpers أو المحور الأول: من أكون؟"
                  value={formTheme}
                  onChange={(e) => setFormTheme(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  أهداف ومخرجات التعلم (اكتب كل هدف في سطر منفصل):
                </label>
                <textarea
                  placeholder="الهدف الأول...&#10;الهدف الثاني...&#10;الهدف الثالث..."
                  value={formObjectives}
                  onChange={(e) => setFormObjectives(e.target.value)}
                  rows={3}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  الكلمات والمصطلحات الأساسية (مفصولة بفاصلة):
                </label>
                <input
                  type="text"
                  placeholder="مثال: Community, Helper, Firefighter, Clinic"
                  value={formVocabulary}
                  onChange={(e) => setFormVocabulary(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    المصادر والكتب:
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: كتاب التلميذ ص 20"
                    value={formResources}
                    onChange={(e) => setFormResources(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    ملاحظات التقييم:
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: كويز يوم الأربعاء"
                    value={formAssessment}
                    onChange={(e) => setFormAssessment(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Homework:
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: حل صفحة 25"
                    value={formHomework}
                    onChange={(e) => setFormHomework(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Classwork / Session:</label>
                  <input
                    type="text"
                    placeholder="يُملأ تلقائيًا من ملف الخطة"
                    value={formClasswork}
                    onChange={(e) => setFormClasswork(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tomorrow Notes:</label>
                  <input
                    type="text"
                    placeholder="ملاحظات وتجهيزات الغد من الملف"
                    value={formTomorrowNote}
                    onChange={(e) => setFormTomorrowNote(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingPlan({ isOpen: false })}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  {editingPlan.item ? 'حفظ التعديلات' : 'حفظ ونشر الخطة'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
