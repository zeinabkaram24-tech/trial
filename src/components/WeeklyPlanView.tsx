import React, { useState } from 'react';
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
  ChevronDown
} from 'lucide-react';
import { WeeklyPlanItem, SchoolClass, UserRole } from '../types';
import { SubjectBadge, getSubjectInfo } from './SubjectBadge';
import { SUBJECTS, BLOCKS, WEEKS } from '../data/initialData';

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

  // Filter items matching block, week, and class
  const filteredPlans = weeklyPlans.filter((p) => {
    const matchBlock = p.blockId === selectedBlock;
    const matchWeek = p.weekId === selectedWeek;
    const matchClass = p.classId === 'all' || p.classId === selectedClass;
    const matchSubject = selectedSubjectFilter === 'all' || p.subjectId === selectedSubjectFilter;
    return matchBlock && matchWeek && matchClass && matchSubject;
  });

  const handleOpenAddModal = () => {
    setEditingPlan({ isOpen: true });
    setFormSubject(SUBJECTS[0].id);
    setFormTheme('');
    setFormObjectives('');
    setFormVocabulary('');
    setFormResources('');
    setFormAssessment('');
  };

  const handleOpenEditModal = (item: WeeklyPlanItem) => {
    setEditingPlan({ isOpen: true, item });
    setFormSubject(item.subjectId);
    setFormTheme(item.unitOrTheme);
    setFormObjectives((item.learningObjectives || []).join('\n'));
    setFormVocabulary((item.vocabulary || []).join(', '));
    setFormResources(item.resourcesNote || '');
    setFormAssessment(item.assessmentNote || '');
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
      learningObjectives: objectivesList.length > 0 ? objectivesList : ['متابعة محتوى الوحدة'],
      vocabulary: vocabList.length > 0 ? vocabList : undefined,
      resourcesNote: formResources.trim() || undefined,
      assessmentNote: formAssessment.trim() || undefined
    };

    const index = weeklyPlans.findIndex((p) => p.id === newRecord.id);
    let updatedList: WeeklyPlanItem[];
    if (index >= 0) {
      updatedList = [...weeklyPlans];
      updatedList[index] = newRecord;
    } else {
      updatedList = [...weeklyPlans, newRecord];
    }

    onUpdateWeeklyPlans(updatedList);
    setEditingPlan({ isOpen: false });
  };

  const handleDeletePlan = (id: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه الخطة؟')) return;
    const updated = weeklyPlans.filter((p) => p.id !== id);
    onUpdateWeeklyPlans(updated);
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
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-900">
                  الخطة الأسبوعية الشاملة (Weekly Plan)
                </h2>
                <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  {currentBlockObj?.nameAr} • {currentWeekObj?.nameAr}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                مقرر مدارس النيل المصرية الدولية - جريد 2 (فصول 2A، 2B، 2C)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {currentRole === 'admin' && (
              <button
                id="admin-add-weekly-plan-btn"
                type="button"
                onClick={handleOpenAddModal}
                className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-3.5 py-2 rounded-xl text-xs shadow-xs transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة خطة مادة</span>
              </button>
            )}

            <button
              id="weekly-plan-print-btn"
              type="button"
              onClick={onOpenPrint}
              className="flex items-center gap-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>طباعة الخطة</span>
            </button>
          </div>
        </div>

        {/* Subject Filter Bar */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-semibold text-slate-500 whitespace-nowrap ml-1">تصفية المواد:</span>
          <button
            id="sub-filter-all"
            type="button"
            onClick={() => setSelectedSubjectFilter('all')}
            className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              selectedSubjectFilter === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            كل المواد ({weeklyPlans.filter((p) => p.blockId === selectedBlock && p.weekId === selectedWeek).length})
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
              يمكن للمسؤول (الأدمن) إضافة وتنزيل الخطة الأسبوعية لهذا البلوك من زر "إضافة خطة مادة".
            </p>
            {currentRole === 'admin' && (
              <button
                type="button"
                onClick={handleOpenAddModal}
                className="bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs"
              >
                + إضافة خطة دراسية الآن
              </button>
            )}
          </div>
        ) : (
          filteredPlans.map((plan) => {
            const sub = getSubjectInfo(plan.subjectId);
            return (
              <div
                key={plan.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 transition-all overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Card Header */}
                  <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <SubjectBadge subjectId={plan.subjectId} size="md" />
                      <span className="text-[11px] font-bold text-slate-400">
                        {plan.classId === 'all' ? 'لكل فصول جريد 2' : `فصل ${plan.classId}`}
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
                    {/* Unit / Theme Title */}
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                        الوحدة والموضوع (Unit & Topic)
                      </span>
                      <h3 className="font-extrabold text-slate-900 text-base leading-snug">
                        {plan.unitOrTheme}
                      </h3>
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

      {/* Admin Add/Edit Modal */}
      {editingPlan.isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-black text-slate-900 mb-4">
              {editingPlan.item ? 'تعديل الخطة الأسبوعية للمادة' : 'إضافة خطة أسبوعية جديدة'}
            </h3>
            <form onSubmit={handleSavePlan} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">المادة الدراسية:</label>
                  <select
                    value={formSubject}
                    onChange={(e) => setFormSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  >
                    {SUBJECTS.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.nameEn} ({s.nameAr})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">الفصل المستهدف:</label>
                  <input
                    type="text"
                    disabled
                    value="فصول جريد 2 (2A, 2B, 2C)"
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
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
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
                  rows={4}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  required
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
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  الكتب والصفحات والمصادر (اختياري):
                </label>
                <input
                  type="text"
                  placeholder="مثال: Student Book pp. 24-31 + Activity Book pp. 18-22"
                  value={formResources}
                  onChange={(e) => setFormResources(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ملاحظات التقييم والاختبارات القصيرة (اختياري):
                </label>
                <input
                  type="text"
                  placeholder="مثال: إملاء كلمات درس كذا يوم الأربعاء، أو كويز ماث يوم الخميس"
                  value={formAssessment}
                  onChange={(e) => setFormAssessment(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingPlan({ isOpen: false })}
                  className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs"
                >
                  حفظ في الخطة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
