/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  SchoolClass,
  UserRole,
  StudentProfile,
  StudentPersonalTask,
  DailyFollowUp,
  WeeklyPlanItem,
  ClassTimetable,
  SchoolMaterialFile
} from './types';
import {
  getStoredTimetables,
  saveStoredTimetables,
  getStoredWeeklyPlans,
  saveStoredWeeklyPlans,
  getStoredDailyFollowUps,
  saveStoredDailyFollowUps,
  getStoredStudentTasks,
  saveStoredStudentTasks,
  getStoredCompletedHw,
  saveStoredCompletedHw,
  getStoredMaterials,
  saveStoredMaterials,
  resetAllDataToDefault
} from './lib/storage';
import { Header } from './components/Header';
import { DailyFollowUpView } from './components/DailyFollowUpView';
import { WeeklyPlanView } from './components/WeeklyPlanView';
import { TimetableView } from './components/TimetableView';
import { MaterialsView } from './components/MaterialsView';
import { StudentSpace } from './components/StudentSpace';
import { AdminPanel } from './components/AdminPanel';
import { PrintModal } from './components/PrintModal';
import {
  GraduationCap,
  ShieldCheck,
  Eye,
  User,
  Heart,
  Sparkles
} from 'lucide-react';

export default function App() {
  // State Initialization
  const [currentRole, setCurrentRole] = useState<UserRole>('visitor');
  const [selectedClass, setSelectedClass] = useState<SchoolClass>('2A');
  const [selectedBlock, setSelectedBlock] = useState<string>('block1');
  const [selectedWeek, setSelectedWeek] = useState<string>('week2');
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(() => {
    try {
      const saved = localStorage.getItem('nile_minya_cur_student');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'timetable' | 'materials' | 'student' | 'admin'>('daily');

  const [timetables, setTimetables] = useState<ClassTimetable[]>(getStoredTimetables);
  const [weeklyPlans, setWeeklyPlans] = useState<WeeklyPlanItem[]>(getStoredWeeklyPlans);
  const [dailyFollowUps, setDailyFollowUps] = useState<DailyFollowUp[]>(getStoredDailyFollowUps);
  const [studentTasks, setStudentTasks] = useState<StudentPersonalTask[]>(getStoredStudentTasks);
  const [completedHwMap, setCompletedHwMap] = useState<Record<string, boolean>>(getStoredCompletedHw);
  const [materials, setMaterials] = useState<SchoolMaterialFile[]>(getStoredMaterials);

  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // Sync to Storage
  useEffect(() => {
    saveStoredTimetables(timetables);
  }, [timetables]);

  useEffect(() => {
    saveStoredWeeklyPlans(weeklyPlans);
  }, [weeklyPlans]);

  useEffect(() => {
    saveStoredDailyFollowUps(dailyFollowUps);
  }, [dailyFollowUps]);

  useEffect(() => {
    saveStoredStudentTasks(studentTasks);
  }, [studentTasks]);

  useEffect(() => {
    saveStoredCompletedHw(completedHwMap);
  }, [completedHwMap]);

  useEffect(() => {
    saveStoredMaterials(materials);
  }, [materials]);

  // Instant multi-tab and cross-window sync listener
  useEffect(() => {
    const handleStorageEvent = (e: StorageEvent) => {
      try {
        if (e.key === 'nile_minya_timetables_v1' && e.newValue) {
          setTimetables(JSON.parse(e.newValue));
        } else if (e.key === 'nile_minya_weekly_plans_v1' && e.newValue) {
          setWeeklyPlans(JSON.parse(e.newValue));
        } else if (e.key === 'nile_minya_daily_follow_ups_v1' && e.newValue) {
          setDailyFollowUps(JSON.parse(e.newValue));
        } else if ((e.key === 'nile_minya_materials_v2' || e.key === 'nile_minya_materials_v1') && e.newValue) {
          setMaterials(JSON.parse(e.newValue));
        } else if (e.key === 'nile_minya_student_tasks_v1' && e.newValue) {
          setStudentTasks(JSON.parse(e.newValue));
        } else if (e.key === 'nile_minya_completed_hw_v1' && e.newValue) {
          setCompletedHwMap(JSON.parse(e.newValue));
        }
      } catch (err) {
        console.error('Storage sync error', err);
      }
    };
    window.addEventListener('storage', handleStorageEvent);
    return () => window.removeEventListener('storage', handleStorageEvent);
  }, []);

  useEffect(() => {
    if (studentProfile) {
      localStorage.setItem('nile_minya_cur_student', JSON.stringify(studentProfile));
    } else {
      localStorage.removeItem('nile_minya_cur_student');
    }
  }, [studentProfile]);

  // Handlers for Student Tasks
  const handleAddStudentTask = (task: Omit<StudentPersonalTask, 'id' | 'createdAt'>) => {
    const newTask: StudentPersonalTask = {
      ...task,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setStudentTasks((prev) => [newTask, ...prev]);
  };

  const handleToggleStudentTask = (taskId: string) => {
    setStudentTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleDeleteStudentTask = (taskId: string) => {
    setStudentTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  // Toggle Completed Homework
  const handleToggleHwCompletion = (hwId: string) => {
    setCompletedHwMap((prev) => ({
      ...prev,
      [hwId]: !prev[hwId]
    }));
  };

  // Reset to default
  const handleResetData = () => {
    resetAllDataToDefault();
    setTimetables(getStoredTimetables());
    setWeeklyPlans(getStoredWeeklyPlans());
    setDailyFollowUps(getStoredDailyFollowUps());
    setStudentTasks(getStoredStudentTasks());
    setMaterials(getStoredMaterials());
    setCompletedHwMap({});
    alert('تمت استعادة البيانات الافتراضية بنجاح.');
  };

  // Import JSON backup
  const handleImportData = (json: any) => {
    if (json.timetables) setTimetables(json.timetables);
    if (json.weeklyPlans) setWeeklyPlans(json.weeklyPlans);
    if (json.dailyFollowUps) setDailyFollowUps(json.dailyFollowUps);
    if (json.studentTasks) setStudentTasks(json.studentTasks);
    if (json.materials) setMaterials(json.materials);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      {/* App Header & Navigation */}
      <Header
        currentRole={currentRole}
        onChangeRole={setCurrentRole}
        selectedClass={selectedClass}
        onSelectClass={setSelectedClass}
        selectedBlock={selectedBlock}
        onSelectBlock={setSelectedBlock}
        selectedWeek={selectedWeek}
        onSelectWeek={setSelectedWeek}
        studentProfile={studentProfile}
        onUpdateStudentProfile={setStudentProfile}
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        onOpenPrint={() => setIsPrintModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {/* Banner for Visitors informing about view-only nature */}
        {currentRole === 'visitor' && (
          <div className="mb-5 bg-sky-50 border border-sky-200 text-sky-900 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-sky-600 shrink-0" />
              <span>
                <strong>واجهة الزائر / ولي الأمر مفعلة:</strong> يمكنك تصفح جداول الحصص والخطط الأسبوعية والواجبات المدرسية وتجهيزات الغد لجريد 2 بحرية كاملة، أو تسجيل الدخول كأدمن من الشريط العلوي للتعديل والإضافة.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsPrintModalOpen(true)}
              className="bg-white hover:bg-sky-100 text-sky-800 font-bold px-3 py-1.5 rounded-lg border border-sky-300 shadow-2xs transition-colors shrink-0"
            >
              طباعة تقرير المتابعة
            </button>
          </div>
        )}

        {/* Tab 1: Daily Follow-up */}
        {activeTab === 'daily' && (
          <DailyFollowUpView
            currentRole={currentRole}
            selectedClass={selectedClass}
            selectedBlock={selectedBlock}
            selectedWeek={selectedWeek}
            dailyFollowUps={dailyFollowUps}
            onUpdateDailyFollowUps={setDailyFollowUps}
            completedHwMap={completedHwMap}
            onToggleHwCompletion={handleToggleHwCompletion}
            studentName={studentProfile?.name}
            onOpenPrint={() => setIsPrintModalOpen(true)}
            timetables={timetables}
          />
        )}

        {/* Tab 2: Weekly Plan */}
        {activeTab === 'weekly' && (
          <WeeklyPlanView
            currentRole={currentRole}
            selectedClass={selectedClass}
            selectedBlock={selectedBlock}
            onSelectBlock={setSelectedBlock}
            selectedWeek={selectedWeek}
            onSelectWeek={setSelectedWeek}
            weeklyPlans={weeklyPlans}
            onUpdateWeeklyPlans={setWeeklyPlans}
            onOpenPrint={() => setIsPrintModalOpen(true)}
          />
        )}

        {/* Tab 3: Timetable */}
        {activeTab === 'timetable' && (
          <TimetableView
            currentRole={currentRole}
            selectedClass={selectedClass}
            onSelectClass={setSelectedClass}
            timetables={timetables}
            onUpdateTimetables={setTimetables}
            onOpenPrint={() => setIsPrintModalOpen(true)}
          />
        )}

        {/* Tab 4: Materials & Books Library (الماتيريال والمذكرات المدرسية) */}
        {activeTab === 'materials' && (
          <MaterialsView
            currentRole={currentRole}
            selectedClass={selectedClass}
            selectedBlock={selectedBlock}
            selectedWeek={selectedWeek}
            materials={materials}
            onUpdateMaterials={setMaterials}
          />
        )}

        {/* Tab 5: Student Space */}
        {activeTab === 'student' && (
          <StudentSpace
            studentProfile={studentProfile}
            onUpdateStudentProfile={setStudentProfile}
            tasks={studentTasks}
            onAddTask={handleAddStudentTask}
            onToggleTask={handleToggleStudentTask}
            onDeleteTask={handleDeleteStudentTask}
            dailyFollowUps={dailyFollowUps}
            completedHwMap={completedHwMap}
            onToggleHwCompletion={handleToggleHwCompletion}
          />
        )}

        {/* Tab 5: Admin Panel (Only if admin role) */}
        {activeTab === 'admin' && currentRole === 'admin' && (
          <AdminPanel
            selectedClass={selectedClass}
            onSelectClass={setSelectedClass}
            selectedBlock={selectedBlock}
            selectedWeek={selectedWeek}
            onNavigateToTab={setActiveTab}
            onResetData={handleResetData}
            onImportData={handleImportData}
            dailyFollowUps={dailyFollowUps}
            weeklyPlans={weeklyPlans}
            onUpdateWeeklyPlans={setWeeklyPlans}
            timetables={timetables}
            onUpdateTimetables={setTimetables}
            materials={materials}
            onUpdateMaterials={setMaterials}
          />
        )}
      </main>

      {/* Official Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-slate-900 text-amber-400 flex items-center justify-center font-bold">
              <GraduationCap className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-800">
              مدارس النيل المصرية الدولية - فرع المنيا
            </span>
            <span>•</span>
            <span>نظام المتابعة المدرسية لجريد 2 (2A - 2B - 2C)</span>
          </div>

          <div className="flex items-center gap-4">
            <span>البلوكات والأسابيع الدراسية المعتمدة</span>
            <span>•</span>
            <span>العام الدراسي 2026 / 2027</span>
          </div>
        </div>
      </footer>

      {/* Printable Report Modal */}
      <PrintModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        selectedClass={selectedClass}
        selectedBlock={selectedBlock}
        selectedWeek={selectedWeek}
        dailyFollowUps={dailyFollowUps}
        weeklyPlans={weeklyPlans}
        timetables={timetables}
      />
    </div>
  );
}
