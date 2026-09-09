import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Download,
  Printer,
  Edit3,
  Check,
  UserCheck,
  Building,
  Coffee
} from 'lucide-react';
import { ClassTimetable, SchoolClass, UserRole, PeriodSlot, DaySchedule } from '../types';
import { SubjectBadge, getSubjectInfo } from './SubjectBadge';
import { SUBJECTS, PERIOD_TIMES } from '../data/initialData';

interface TimetableViewProps {
  currentRole: UserRole;
  selectedClass: SchoolClass;
  onSelectClass: (cls: SchoolClass) => void;
  timetables: ClassTimetable[];
  onUpdateTimetables: (data: ClassTimetable[]) => void;
  onOpenPrint: () => void;
}

export const TimetableView: React.FC<TimetableViewProps> = ({
  currentRole,
  selectedClass,
  onSelectClass,
  timetables,
  onUpdateTimetables,
  onOpenPrint
}) => {
  const currentTimetable = timetables.find((t) => t.classId === selectedClass) || timetables[0];
  const [activeDayIndex, setActiveDayIndex] = useState<number>(0); // 0 = Sunday
  const [viewMode, setViewMode] = useState<'grid' | 'day'>('grid');

  // Admin slot edit modal
  const [editingSlot, setEditingSlot] = useState<{
    isOpen: boolean;
    dayNameAr?: string;
    slot?: PeriodSlot;
  }>({ isOpen: false });

  const [editSubject, setEditSubject] = useState('');
  const [editTeacher, setEditTeacher] = useState('');
  const [editRoom, setEditRoom] = useState('');

  const handleOpenEditSlot = (dayNameAr: string, slot: PeriodSlot) => {
    if (currentRole !== 'admin') return;
    setEditingSlot({
      isOpen: true,
      dayNameAr,
      slot
    });
    setEditSubject(slot.subjectId);
    setEditTeacher(slot.teacher || '');
    setEditRoom(slot.room || '');
  };

  const handleSaveSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSlot.slot || !editingSlot.dayNameAr) return;

    const updatedTimetables = timetables.map((tt) => {
      if (tt.classId === selectedClass) {
        const updatedDays = tt.days.map((day) => {
          if (day.dayNameAr === editingSlot.dayNameAr) {
            const updatedPeriods = day.periods.map((p) => {
              if (p.id === editingSlot.slot?.id) {
                return {
                  ...p,
                  subjectId: editSubject,
                  teacher: editTeacher.trim() || undefined,
                  room: editRoom.trim() || undefined
                };
              }
              return p;
            });
            return { ...day, periods: updatedPeriods };
          }
          return day;
        });
        return { ...tt, days: updatedDays };
      }
      return tt;
    });

    onUpdateTimetables(updatedTimetables);
    setEditingSlot({ isOpen: false });
  };

  const handleDeleteSlot = (dayNameAr: string, slotId: string) => {
    if (!window.confirm('هل أنت متأكد من رغبتك في حذف هذه الحصة من الجدول الدراسي؟')) return;
    const updatedTimetables = timetables.map((tt) => {
      if (tt.classId === selectedClass) {
        const updatedDays = tt.days.map((day) => {
          if (day.dayNameAr === dayNameAr) {
            return {
              ...day,
              periods: day.periods.filter((p) => p.id !== slotId)
            };
          }
          return day;
        });
        return { ...tt, days: updatedDays };
      }
      return tt;
    });

    onUpdateTimetables(updatedTimetables);
    setEditingSlot({ isOpen: false });
  };

  const currentDaySchedule = currentTimetable.days[activeDayIndex] || currentTimetable.days[0];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center justify-center font-bold">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-900">
                  جدول الحصص الأسبوعي - Class {selectedClass}
                </h2>
                <span className="bg-indigo-100 text-indigo-900 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  جريد 2 (Grade 2)
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                مدرسة النيل المصرية الدولية فرع المنيا • العام الدراسي 2026/2027
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Class Toggle Buttons */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl">
              {(['2A', '2B', '2C'] as SchoolClass[]).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => onSelectClass(c)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedClass === c
                      ? 'bg-sky-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Class {c}
                </button>
              ))}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                الجدول الكامل
              </button>
              <button
                type="button"
                onClick={() => setViewMode('day')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  viewMode === 'day' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                يوم بيوم
              </button>
            </div>

            <button
              type="button"
              onClick={onOpenPrint}
              className="flex items-center gap-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>طباعة الجدول</span>
            </button>
          </div>
        </div>

        {currentRole === 'admin' && (
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2 text-xs text-amber-900 bg-amber-50 p-3 rounded-xl border border-amber-200">
            <div className="flex items-center gap-2">
              <span className="font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-md text-[11px]">
                صلاحية الأدمن
              </span>
              <span>
                يمكنك النقر مباشرة على أي حصة في الجدول لتعديل المادة أو حذفها، مع إمكانية إضافة وتعديل الحصص بالكامل من تبويب لوحة الإدارة.
              </span>
            </div>
            <span className="text-emerald-700 font-bold bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-md text-[10px]">
              ✓ المزامنة المباشرة مع الزوار والطلاب مفعلة
            </span>
          </div>
        )}
      </div>

      {/* VIEW MODE: FULL GRID */}
      {viewMode === 'grid' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse text-xs min-w-[760px]">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="p-3.5 font-bold border-b border-slate-800 text-center w-28">
                    اليوم / الحصة
                  </th>
                  {PERIOD_TIMES.map((pt, idx) => (
                    <th
                      key={pt.periodNum}
                      className="p-3 font-bold border-b border-slate-800 text-center"
                    >
                      <div>الحصة {pt.periodNum}</div>
                      <div className="text-[10px] font-normal text-slate-300 tracking-tighter">
                        {pt.time}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {currentTimetable.days.map((day, dIdx) => (
                  <tr key={day.dayNameAr} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3.5 font-black text-slate-900 bg-slate-50 border-l border-slate-200 text-center">
                      <div className="text-sm">{day.dayNameAr}</div>
                      <div className="text-[10px] font-medium text-slate-400">{day.dayNameEn}</div>
                    </td>

                    {day.periods.map((slot) => {
                      const sub = getSubjectInfo(slot.subjectId);
                      return (
                        <td
                          key={slot.id}
                          className="p-2 align-top text-center border-l border-slate-100"
                        >
                          <div
                            onClick={() => handleOpenEditSlot(day.dayNameAr, slot)}
                            className={`p-2.5 rounded-xl border ${sub.borderColor} ${sub.color} h-full flex flex-col justify-between transition-all ${
                              currentRole === 'admin'
                                ? 'cursor-pointer hover:shadow-md hover:scale-[1.02] ring-1 ring-transparent hover:ring-amber-400'
                                : ''
                            }`}
                          >
                            <div>
                              <div className="font-black text-xs text-slate-900 mb-0.5">
                                {sub.nameEn}
                              </div>
                              <div className="text-[10px] opacity-75 font-medium">
                                {sub.nameAr}
                              </div>
                            </div>

                            {slot.teacher && (
                              <div className="mt-2 pt-1 border-t border-black/5 text-[10px] text-slate-600 font-semibold truncate">
                                {slot.teacher}
                              </div>
                            )}

                            {currentRole === 'admin' && (
                              <div className="mt-1 text-[9px] text-amber-900 font-bold opacity-0 group-hover:opacity-100">
                                ✎ تعديل
                              </div>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Legend */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between flex-wrap gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-600">
              <Clock className="w-4 h-4 text-slate-500" />
              <span>مواعيد الحصص: 45 دقيقة لكل حصة، استراحة أولى بعد الحصة 2، واستراحة الغداء بعد الحصة 5.</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-sky-500"></span>
              <span className="text-slate-700 font-medium">جدول معتمد لمدارس النيل - فرع المنيا</span>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE: DAY BY DAY */}
      {viewMode === 'day' && (
        <div className="space-y-4">
          {/* Day Selector Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {currentTimetable.days.map((day, idx) => (
              <button
                key={day.dayNameAr}
                type="button"
                onClick={() => setActiveDayIndex(idx)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                  activeDayIndex === idx
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {day.dayNameAr} ({day.dayNameEn})
              </button>
            ))}
          </div>

          {/* Day Periods Timeline */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <h3 className="font-extrabold text-base text-slate-900 mb-4 flex items-center gap-2">
              <span>حصص يوم {currentDaySchedule.dayNameAr}</span>
              <span className="text-xs font-normal text-slate-500">
                - Class {selectedClass}
              </span>
            </h3>

            <div className="space-y-3">
              {currentDaySchedule.periods.map((slot, pIdx) => {
                const sub = getSubjectInfo(slot.subjectId);
                return (
                  <div
                    key={slot.id}
                    className={`p-4 rounded-xl border flex flex-wrap items-center justify-between gap-3 transition-all ${
                      sub.borderColor
                    } ${sub.color} ${
                      currentRole === 'admin'
                        ? 'cursor-pointer hover:shadow-xs'
                        : ''
                    }`}
                    onClick={() => handleOpenEditSlot(currentDaySchedule.dayNameAr, slot)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/80 shadow-xs flex flex-col items-center justify-center font-black text-slate-800">
                        <span className="text-[10px] text-slate-400 font-semibold">حصة</span>
                        <span className="text-base leading-none">{slot.periodNum}</span>
                      </div>
                      <div>
                        <div className="font-black text-sm text-slate-900">
                          {sub.nameEn}
                        </div>
                        <div className="text-xs text-slate-600 font-medium">
                          {sub.nameAr}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-1.5 bg-white/80 px-2.5 py-1 rounded-lg text-slate-700 font-semibold">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>{slot.time}</span>
                      </div>

                      {slot.teacher && (
                        <div className="flex items-center gap-1.5 bg-white/80 px-2.5 py-1 rounded-lg text-slate-700 font-semibold">
                          <UserCheck className="w-3.5 h-3.5 text-slate-500" />
                          <span>المعلم: {slot.teacher}</span>
                        </div>
                      )}

                      {currentRole === 'admin' && (
                        <button
                          type="button"
                          className="bg-amber-400 hover:bg-amber-300 text-slate-950 px-2.5 py-1 rounded-lg text-xs font-bold shadow-xs"
                        >
                          تعديل الحصة
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Admin Slot Edit Modal */}
      {editingSlot.isOpen && editingSlot.slot && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-base font-black text-slate-900 mb-1">
              تعديل بيانات الحصة {editingSlot.slot.periodNum}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Class {selectedClass} • يوم {editingSlot.dayNameAr} ({editingSlot.slot.time})
            </p>

            <form onSubmit={handleSaveSlot} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  المادة المقررة:
                </label>
                <select
                  value={editSubject}
                  onChange={(e) => setEditSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                >
                  {SUBJECTS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.nameEn} ({s.nameAr})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  اسم المعلم / المعلمة:
                </label>
                <input
                  type="text"
                  placeholder="مثال: Ms. Sarah أو أ. فاطمة"
                  value={editTeacher}
                  onChange={(e) => setEditTeacher(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  القاعة / المعمل (اختياري):
                </label>
                <input
                  type="text"
                  placeholder="مثال: فصل 2A، معمل الحاسب 1، معمل العلوم"
                  value={editRoom}
                  onChange={(e) => setEditRoom(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100 flex-wrap">
                {editingSlot.slot && (
                  <button
                    type="button"
                    onClick={() => {
                      if (editingSlot.dayNameAr && editingSlot.slot) {
                        handleDeleteSlot(editingSlot.dayNameAr, editingSlot.slot.id);
                      }
                    }}
                    className="px-3 py-2 text-xs text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl font-bold transition-colors"
                  >
                    حذف الحصة من الجدول
                  </button>
                )}
                <div className="flex items-center gap-2 mr-auto">
                  <button
                    type="button"
                    onClick={() => setEditingSlot({ isOpen: false })}
                    className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs"
                  >
                    تحديث الحصة في الجدول ✓
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
