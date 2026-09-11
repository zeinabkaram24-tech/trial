import { useEffect, useMemo, useState } from "react";
import {
  Archive,
  ArrowDownToLine,
  Bell,
  BookOpen,
  CalendarDays,
  Check,
  ChevronDown,
  ClipboardCheck,
  Clock3,
  Download,
  FileText,
  Heart,
  Home as HomeIcon,
  LayoutDashboard,
  Library,
  LockKeyhole,
  LogIn,
  Menu,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  Star,
  Trash2,
  UserRound,
  UsersRound,
  X,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { calculateProgress, canEdit } from "@shared/studyflow";

type Role = "visitor" | "student" | "admin";
type Section = "home" | "schedule" | "materials" | "admin";
type TaskType = "homework" | "classwork" | "tomorrow";

type Task = {
  id: number;
  type: TaskType;
  subject: string;
  title: string;
  detail: string;
  due: string;
  time: string;
  color: string;
  icon: string;
  completed: boolean;
  reactions: number;
};

type Material = {
  id: number;
  subject: string;
  title: string;
  kind: string;
  size: string;
  updated: string;
  color: string;
};

const subjects = [
  { name: "English", color: "#7c6cf5", soft: "#eeebff", icon: "🇬🇧" },
  { name: "Arabic", color: "#ee7f5b", soft: "#fff0e9", icon: "🪶" },
  { name: "Science", color: "#45b7a0", soft: "#e5f7f2", icon: "🧪" },
  { name: "Math", color: "#efb84a", soft: "#fff5d9", icon: "🧮" },
  { name: "Social Studies", color: "#4c91d8", soft: "#e8f2fc", icon: "🌍" },
  { name: "French", color: "#eb6f9a", soft: "#ffebf2", icon: "🇫🇷" },
  { name: "ICT", color: "#6687d8", soft: "#edf0ff", icon: "💻" },
];

const initialTasks: Task[] = [
  { id: 1, type: "homework", subject: "Math", title: "Solve Unit 3 exercises", detail: "Pages 42 to 45", due: "Today", time: "Before 8:00 PM", color: "#efb84a", icon: "🧮", completed: false, reactions: 12 },
  { id: 2, type: "homework", subject: "English", title: "Write about your weekend", detail: "Write an 80-word paragraph", due: "Tomorrow", time: "Before 9:00 PM", color: "#7c6cf5", icon: "🇬🇧", completed: false, reactions: 8 },
  { id: 3, type: "classwork", subject: "Science", title: "Summarize the digestive system lesson", detail: "Use the attached review sheet", due: "Today", time: "Period 4", color: "#45b7a0", icon: "🧪", completed: true, reactions: 17 },
  { id: 4, type: "classwork", subject: "Arabic", title: "Grammar exercises", detail: "Object — questions 1, 2, and 3", due: "Today", time: "Period 5", color: "#ee7f5b", icon: "🪶", completed: false, reactions: 6 },
  { id: 5, type: "tomorrow", subject: "French", title: "Review lesson vocabulary", detail: "Review the new words before class", due: "Tomorrow", time: "First Period", color: "#eb6f9a", icon: "🇫🇷", completed: false, reactions: 4 },
  { id: 6, type: "tomorrow", subject: "Social Studies", title: "Bring a map of Egypt", detail: "A small task to start class", due: "Tomorrow", time: "Period 2", color: "#4c91d8", icon: "🌍", completed: false, reactions: 9 },
];

const initialMaterials: Material[] = [
  { id: 1, subject: "Math", title: "Review Unit 3", kind: "PDF", size: "2.4 MB", updated: "2 days ago", color: "#efb84a" },
  { id: 2, subject: "English", title: "Vocabulary — Unit 4", kind: "PDF", size: "1.8 MB", updated: "3 days ago", color: "#7c6cf5" },
  { id: 3, subject: "Science", title: "The digestive system", kind: "Images", size: "4 Images", updated: "This week", color: "#45b7a0" },
  { id: 4, subject: "Arabic", title: "Grammar workbook", kind: "PDF", size: "5.1 MB", updated: "This week", color: "#ee7f5b" },
  { id: 5, subject: "Social Studies", title: "Map of Egypt", kind: "Images", size: "1.2 MB", updated: "1 week ago", color: "#4c91d8" },
  { id: 6, subject: "French", title: "Les mots importants", kind: "PDF", size: "1.6 MB", updated: "1 week ago", color: "#eb6f9a" },
];

const schedule = [
  { day: "Sunday", date: "September 14", lessons: [{ subject: "French", teacher: "Doaa Fekry", icon: "🇫🇷", color: "#eb6f9a", time: "07:45" }, { subject: "Math", teacher: "Maryem Sameer", icon: "🧮", color: "#efb84a", time: "08:35" }, { subject: "Arabic", teacher: "Marwa Mamdouh", icon: "🪶", color: "#ee7f5b", time: "09:45" }, { subject: "Science", teacher: "Salma Ahmed", icon: "🧪", color: "#45b7a0", time: "10:35" }, { subject: "English", teacher: "Ala'a", icon: "🇬🇧", color: "#7c6cf5", time: "11:25" }, { subject: "ICT", teacher: "Mariam", icon: "💻", color: "#6687d8", time: "13:25" }] },
  { day: "Monday", date: "September 15", lessons: [{ subject: "Social Studies", teacher: "Manar Hassan", icon: "🌍", color: "#4c91d8", time: "07:45" }, { subject: "PE", teacher: "Rana", icon: "🏀", color: "#ff8d73", time: "08:35" }, { subject: "English", teacher: "Ala'a", icon: "🇬🇧", color: "#7c6cf5", time: "09:45" }, { subject: "English", teacher: "Ala'a", icon: "🇬🇧", color: "#7c6cf5", time: "10:35" }, { subject: "Math", teacher: "Maryem Sameer", icon: "🧮", color: "#efb84a", time: "11:25" }, { subject: "French", teacher: "Doaa Fekry", icon: "🇫🇷", color: "#eb6f9a", time: "13:25" }] },
  { day: "Tuesday", date: "September 16", lessons: [{ subject: "Math", teacher: "Maryem Sameer", icon: "🧮", color: "#efb84a", time: "07:45" }, { subject: "Arts", teacher: "Walid Ahmed Fouad", icon: "🎨", color: "#bf77da", time: "08:35" }, { subject: "ICT", teacher: "Mariam", icon: "💻", color: "#6687d8", time: "09:45" }, { subject: "French", teacher: "Doaa Fekry", icon: "🇫🇷", color: "#eb6f9a", time: "10:35" }, { subject: "Religion", teacher: "Marwa Mamdouh", icon: "📚", color: "#8ebf74", time: "11:25" }, { subject: "Arabic", teacher: "Marwa Mamdouh", icon: "🪶", color: "#ee7f5b", time: "12:15" }] },
  { day: "Wednesday", date: "September 17", lessons: [{ subject: "English", teacher: "Ala'a", icon: "🇬🇧", color: "#7c6cf5", time: "07:45" }, { subject: "Social Studies", teacher: "Manar Hassan", icon: "🌍", color: "#4c91d8", time: "08:35" }, { subject: "Arabic", teacher: "Marwa Mamdouh", icon: "🪶", color: "#ee7f5b", time: "09:45" }, { subject: "Arabic", teacher: "Marwa Mamdouh", icon: "🪶", color: "#ee7f5b", time: "10:35" }, { subject: "Math", teacher: "Maryem Sameer", icon: "🧮", color: "#efb84a", time: "11:25" }, { subject: "Science", teacher: "Salma Ahmed", icon: "🧪", color: "#45b7a0", time: "13:25" }] },
  { day: "Thursday", date: "September 18", lessons: [{ subject: "Arabic", teacher: "Marwa Mamdouh", icon: "🪶", color: "#ee7f5b", time: "07:45" }, { subject: "Social Studies", teacher: "Manar Hassan", icon: "🌍", color: "#4c91d8", time: "08:35" }, { subject: "Religion", teacher: "Mariam", icon: "📚", color: "#8ebf74", time: "09:45" }, { subject: "Math", teacher: "Maryem Sameer", icon: "🧮", color: "#efb84a", time: "10:35" }, { subject: "English", teacher: "Ala'a", icon: "🇬🇧", color: "#7c6cf5", time: "11:25" }, { subject: "ICT", teacher: "Mariam", icon: "💻", color: "#6687d8", time: "13:25" }] },
];

const roleMeta: Record<Role, { label: string; eyebrow: string; icon: typeof UserRound }> = {
  visitor: { label: "Visitor", eyebrow: "Quick browsing", icon: UsersRound },
  student: { label: "Student", eyebrow: "Your space", icon: UserRound },
  admin: { label: "Admin", eyebrow: "Full control", icon: ShieldCheck },
};

function useStoredState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) as T : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue] as const;
}

function IconBadge({ icon, color, size = "md" }: { icon: string; color: string; size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: "h-9 w-9 text-lg", md: "h-12 w-12 text-2xl", lg: "h-16 w-16 text-3xl" };
  return <div className={`${sizes[size]} shrink-0 rounded-2xl flex items-center justify-center`} style={{ backgroundColor: `${color}19` }}>{icon}</div>;
}

function SectionTitle({ eyebrow, title, action, onAction }: { eyebrow: string; title: string; action?: string; onAction?: () => void }) {
  return <div className="section-heading">
    <div><div className="eyebrow">{eyebrow}</div><h2>{title}</h2></div>
    {action && <button className="text-button" onClick={onAction}>{action}<ArrowDownToLine size={15} /></button>}
  </div>;
}

function TaskCard({ task, role, onToggle, onReact, onDelete }: { task: Task; role: Role; onToggle: () => void; onReact: () => void; onDelete?: () => void }) {
  return <article className={`task-card ${task.completed ? "is-done" : ""}`}>
    <div className="task-card-top"><IconBadge icon={task.icon} color={task.color} />
      <div className="task-copy"><div className="task-subject" style={{ color: task.color }}>{task.subject}</div><h3>{task.title}</h3><p>{task.detail}</p></div>
      <button className="more-btn" aria-label="Options"><MoreHorizontal size={18} /></button>
    </div>
    <div className="task-card-bottom"><div className="task-due"><Clock3 size={14} /> <span>{task.due} · {task.time}</span></div>
      <div className="task-actions">
        {role === "admin" && onDelete && <button className="icon-btn danger" onClick={onDelete} title="Delete"><Trash2 size={16} /></button>}
        {role === "visitor" ? <button className="reaction locked" onClick={() => toast("Log in as a student to react to tasks") }><LockKeyhole size={15} /> React</button> : <button className={`reaction ${task.reactions > 0 ? "liked" : ""}`} onClick={onReact}><Heart size={15} fill={task.reactions > 0 ? "currentColor" : "none"} /> {task.reactions}</button>}
        {role === "student" && <button className={`done-btn ${task.completed ? "done" : ""}`} onClick={onToggle}>{task.completed ? <><Check size={14} /> Done</> : "Done"}</button>}
      </div>
    </div>
  </article>;
}

function HomeView({ tasks, role, setSection, toggleTask, reactTask, deleteTask }: { tasks: Task[]; role: Role; setSection: (s: Section) => void; toggleTask: (id: number) => void; reactTask: (id: number) => void; deleteTask: (id: number) => void }) {
  const homework = tasks.filter(t => t.type === "homework");
  const classwork = tasks.filter(t => t.type === "classwork");
  const tomorrow = tasks.filter(t => t.type === "tomorrow");
  const doneCount = tasks.filter(t => t.completed).length;
  return <>
    <section className="hero-panel">
      <div className="hero-orb orb-one" /><div className="hero-orb orb-two" />
      <div className="hero-content"><div className="hero-kicker"><Sparkles size={15} /> G2B School · New week, new achievements</div><h1>Hello <span>Noor</span>,<br />Ready to make progress?</h1><p>Everything you need to study, organized in one place.</p><div className="hero-actions"><button className="primary-btn" onClick={() => setSection("schedule")}>View your schedule <CalendarDays size={17} /></button><button className="soft-btn" onClick={() => setSection("materials")}>Materials <BookOpen size={17} /></button></div></div>
      <div className="hero-stats"><div className="mini-progress"><div className="progress-ring"><span>{doneCount}<small>/ {tasks.length}</small></span></div><div><b>Weekly tasks</b><p>Keep up the great work!</p></div></div><div className="hero-note"><Star size={16} fill="currentColor" /><span>You are doing great!</span></div></div>
    </section>
    <div className="quick-grid"><button onClick={() => setSection("schedule")}><span className="quick-icon purple"><CalendarDays size={20} /></span><span><b>Schedule</b><small>Weekly lessons</small></span><ChevronDown size={17} /></button><button onClick={() => setSection("materials")}><span className="quick-icon green"><Library size={20} /></span><span><b>Materials</b><small>Files and reviews</small></span><ChevronDown size={17} /></button><button onClick={() => setSection("home")}><span className="quick-icon orange"><ClipboardCheck size={20} /></span><span><b>Tasks</b><small>{doneCount} completed tasks</small></span><ChevronDown size={17} /></button></div>
    <section className="content-section"><SectionTitle eyebrow="Due today" title="Homework" action="All homework" onAction={() => setSection("home")} /><div className="task-grid">{homework.map(task => <TaskCard key={task.id} task={task} role={role} onToggle={() => toggleTask(task.id)} onReact={() => reactTask(task.id)} onDelete={() => deleteTask(task.id)} />)}</div></section>
    <section className="content-section"><SectionTitle eyebrow="From the weekly plan" title="Classwork" action="View all" onAction={() => setSection("home")} /><div className="task-grid">{classwork.map(task => <TaskCard key={task.id} task={task} role={role} onToggle={() => toggleTask(task.id)} onReact={() => reactTask(task.id)} onDelete={() => deleteTask(task.id)} />)}</div></section>
    <section className="content-section tomorrow-section"><SectionTitle eyebrow="Tomorrow notes" title="Tomorrow" action="Edit notes" onAction={() => role === "admin" ? setSection("admin") : toast("Notes are added by Admin from the control panel")} /><div className="tomorrow-list">{tomorrow.map(task => <TaskCard key={task.id} task={task} role={role} onToggle={() => toggleTask(task.id)} onReact={() => reactTask(task.id)} onDelete={() => deleteTask(task.id)} />)}</div></section>
  </>;
}

function ScheduleView() {
  const [selectedDay, setSelectedDay] = useState(0);
  const current = schedule[selectedDay];
  return <section className="page-section"><SectionTitle eyebrow="Weekly plan" title="Class schedule" action="Download schedule" onAction={() => toast("Schedule download is ready")} /><div className="schedule-intro"><div><span className="pill purple-pill"><CalendarDays size={15} /> Current week</span><h3>G2B · Study schedule</h3><p>All your classes and teachers at a glance.</p></div><div className="schedule-legend"><span><i className="legend-dot" style={{ background: "#7c6cf5" }} /> Core subject</span><span><i className="legend-dot" style={{ background: "#45b7a0" }} /> Review</span></div></div><div className="day-tabs">{schedule.map((day, index) => <button key={day.day} className={selectedDay === index ? "active" : ""} onClick={() => setSelectedDay(index)}><b>{day.day}</b><small>{day.date}</small></button>)}</div><div className="lesson-board"><div className="lesson-board-head"><span>Period</span><span>Subject and teacher</span><span>Time</span></div>{current.lessons.map((lesson, index) => <div className="lesson-row" key={`${lesson.subject}-${index}`}><div className="lesson-number">0{index + 1}</div><div className="lesson-main"><IconBadge icon={lesson.icon} color={lesson.color} size="sm" /><div><b>{lesson.subject}</b><span>{lesson.teacher}</span></div></div><div className="lesson-time"><Clock3 size={14} /> {lesson.time}</div></div>)}</div></section>;
}

function MaterialsView({ materials, role, onDelete }: { materials: Material[]; role: Role; onDelete: (id: number) => void }) {
  const [filter, setFilter] = useState("All");
  const filtered = filter === "All" ? materials : materials.filter(m => m.subject === filter);
  return <section className="page-section"><SectionTitle eyebrow="Study library" title="Materials" action={role === "admin" ? "Add file" : undefined} onAction={() => toast("Use the Admin dashboard to add files")} /><div className="materials-banner"><div className="banner-icon"><Archive size={23} /></div><div><b>Everything you need before class</b><p>Summaries, maps, and teacher files organized by subject.</p></div><Search size={20} /></div><div className="filter-row">{["All", ...subjects.map(s => s.name)].map(item => <button key={item} className={filter === item ? "active" : ""} onClick={() => setFilter(item)}>{item}</button>)}</div><div className="materials-grid">{filtered.map(material => <article className="material-card" key={material.id}><div className="material-top"><div className="file-icon" style={{ background: `${material.color}18`, color: material.color }}><FileText size={22} /></div><span className="file-kind">{material.kind}</span></div><div className="material-subject" style={{ color: material.color }}>{material.subject}</div><h3>{material.title}</h3><p>{material.size} <span>·</span> {material.updated}</p><div className="material-actions"><button className="download-btn" onClick={() => toast(`Downloading ${material.title}`)}><Download size={16} /> Download</button>{role === "admin" && <button className="icon-btn danger" onClick={() => onDelete(material.id)}><Trash2 size={16} /></button>}{role === "visitor" && <span className="visitor-note"><LockKeyhole size={13} /> Log in to download</span>}</div></article>)}</div></section>;
}

function AdminView({ tasks, materials, onAddTask, onDeleteTask, onAddMaterial, onDeleteMaterial }: { tasks: Task[]; materials: Material[]; onAddTask: (task: Task) => void; onDeleteTask: (id: number) => void; onAddMaterial: (material: Material) => void; onDeleteMaterial: (id: number) => void }) {
  const [modal, setModal] = useState<"task" | "material" | null>(null);
  const [taskType, setTaskType] = useState<TaskType>("homework");
  const [subject, setSubject] = useState(subjects[0]);
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [due, setDue] = useState("Today");
  const [materialTitle, setMaterialTitle] = useState("");
  const [materialKind, setMaterialKind] = useState("PDF");
  const [materialSubject, setMaterialSubject] = useState(subjects[0]);
  const submitTask = () => { if (!title.trim()) return toast("Enter the task name first"); onAddTask({ id: Date.now(), type: taskType, subject: subject.name, title, detail: detail || "New task from the weekly plan", due, time: taskType === "tomorrow" ? "Tomorrow" : "By the end of today", color: subject.color, icon: subject.icon, completed: false, reactions: 0 }); setTitle(""); setDetail(""); setModal(null); toast("Task added and published for students"); };
  const submitMaterial = () => { if (!materialTitle.trim()) return toast("Enter the file name first"); onAddMaterial({ id: Date.now(), subject: materialSubject.name, title: materialTitle, kind: materialKind, size: "New file", updated: "Now", color: materialSubject.color }); setMaterialTitle(""); setModal(null); toast("Material added to the library"); };
  return <section className="page-section admin-page"><div className="admin-heading"><div><div className="eyebrow">Control center</div><h2>Admin dashboard</h2><p>Changes here appear instantly for students and visitors.</p></div><div className="admin-lock"><ShieldCheck size={17} /> Editing access enabled</div></div><div className="admin-stats"><div><span className="stat-symbol purple-bg"><ClipboardCheck size={19} /></span><span><b>{tasks.length}</b><small>Total tasks</small></span></div><div><span className="stat-symbol green-bg"><Library size={19} /></span><span><b>{materials.length}</b><small>Study files</small></span></div><div><span className="stat-symbol orange-bg"><UsersRound size={19} /></span><span><b>24</b><small>Active students</small></span></div></div><div className="admin-actions"><button className="admin-action-card purple-card" onClick={() => setModal("task")}><span><Plus size={20} /></span><div><b>Add task</b><small>Homework or classwork</small></div></button><button className="admin-action-card green-card" onClick={() => setModal("material")}><span><Plus size={20} /></span><div><b>Upload material</b><small>Review files and summaries</small></div></button></div><div className="admin-table-card"><div className="table-title"><div><b>Recently added tasks</b><small>Quick review of published content</small></div><Settings2 size={19} /></div>{tasks.slice(0, 6).map(task => <div className="admin-row" key={task.id}><IconBadge icon={task.icon} color={task.color} size="sm" /><div><b>{task.title}</b><span>{task.subject} · {task.type === "homework" ? "Homework" : task.type === "classwork" ? "Classwork" : "Tomorrow"}</span></div><button className="icon-btn danger" onClick={() => onDeleteTask(task.id)}><Trash2 size={16} /></button></div>)}</div><div className="admin-table-card"><div className="table-title"><div><b>Published materials</b><small>Remove files that are no longer needed</small></div><Library size={19} /></div>{materials.slice(0, 6).map(material => <div className="admin-row" key={material.id}><div className="file-icon small-file" style={{ background: `${material.color}18`, color: material.color }}><FileText size={18} /></div><div><b>{material.title}</b><span>{material.subject} · {material.kind}</span></div><button className="icon-btn danger" onClick={() => onDeleteMaterial(material.id)}><Trash2 size={16} /></button></div>)}</div>{modal && <div className="modal-backdrop" onClick={() => setModal(null)}><div className="modal-card" onClick={event => event.stopPropagation()}><button className="modal-close" onClick={() => setModal(null)}><X size={18} /></button><div className="modal-icon">{modal === "task" ? <ClipboardCheck size={22} /> : <Library size={22} />}</div><div className="eyebrow">Add new item</div><h3>{modal === "task" ? "Add a task for students" : "Upload new material"}</h3>{modal === "task" ? <><div className="segmented">{([["homework", "Homework"], ["classwork", "Classwork"], ["tomorrow", "Tomorrow"]] as [TaskType, string][]).map(([value, label]) => <button key={value} className={taskType === value ? "active" : ""} onClick={() => setTaskType(value)}>{label}</button>)}</div><label>Subject<select value={subject.name} onChange={e => setSubject(subjects.find(s => s.name === e.target.value) || subjects[0])}>{subjects.map(s => <option key={s.name}>{s.name}</option>)}</select></label><label>Task name<input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Solve Unit 3 exercises" /></label><label>Short details<textarea value={detail} onChange={e => setDetail(e.target.value)} placeholder="Describe what students need to do" /></label><label>Timing<select value={due} onChange={e => setDue(e.target.value)}><option>Today</option><option>Tomorrow</option><option>This week</option></select></label><button className="primary-btn full-btn" onClick={submitTask}>Publish task <Plus size={16} /></button></> : <><label>Subject<select value={materialSubject.name} onChange={e => setMaterialSubject(subjects.find(s => s.name === e.target.value) || subjects[0])}>{subjects.map(s => <option key={s.name}>{s.name}</option>)}</select></label><label>File name<input value={materialTitle} onChange={e => setMaterialTitle(e.target.value)} placeholder="e.g. Unit 4 summary" /></label><label>File type<select value={materialKind} onChange={e => setMaterialKind(e.target.value)}><option>PDF</option><option>Images</option><option>Video</option><option>Word file</option></select></label><div className="upload-placeholder"><ArrowDownToLine size={22} /><b>Drop your file here</b><span>or click to choose a file from your device</span></div><button className="primary-btn full-btn" onClick={submitMaterial}>Add to library <Plus size={16} /></button></>}</div></div>}</section>;
}

export default function Home() {
  const [role, setRole] = useStoredState<Role>("studyflow-role-v2", "student");
  const [section, setSection] = useState<Section>("home");
  const [studentName, setStudentName] = useStoredState("studyflow-student-v2", "Noor");
  const [tasks, setTasks] = useStoredState<Task[]>("studyflow-tasks-v2", initialTasks);
  const [materials, setMaterials] = useStoredState<Material[]>("studyflow-materials-v2", initialMaterials);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const activeRole = roleMeta[role];
  const progress = useMemo(() => calculateProgress(tasks.filter(t => t.completed).length, tasks.length), [tasks]);
  const toggleTask = (id: number) => { if (role !== "student") return toast("Log in as a student to track your progress"); setTasks(list => list.map(item => item.id === id ? { ...item, completed: !item.completed } : item)); };
  const reactTask = (id: number) => { if (role !== "student") return toast("Reactions are available to students only"); setTasks(list => list.map(item => item.id === id ? { ...item, reactions: item.reactions + 1 } : item)); };
  const deleteTask = (id: number) => { if (!canEdit(role)) return; setTasks(list => list.filter(item => item.id !== id)); toast("Task deleted"); };
  const deleteMaterial = (id: number) => { if (!canEdit(role)) return; setMaterials(list => list.filter(item => item.id !== id)); toast("File deleted"); };
  const navItems: { id: Section; label: string; icon: typeof HomeIcon }[] = [{ id: "home", label: "Home", icon: HomeIcon }, { id: "schedule", label: "Schedule", icon: CalendarDays }, { id: "materials", label: "Materials", icon: Library }];
  return <div className="app-shell" dir="ltr"><aside className={`sidebar ${mobileNav ? "open" : ""}`}><div className="brand"><span className="brand-mark"><Zap size={21} fill="currentColor" /></span><span><b>G2B School</b><small>StudyFlow</small></span></div><div className="role-card"><div className="role-avatar"><activeRole.icon size={19} /></div><div><small>{activeRole.eyebrow}</small><b>{role === "student" ? studentName : activeRole.label}</b></div><button onClick={() => setShowRoleMenu(!showRoleMenu)}><ChevronDown size={16} /></button>{showRoleMenu && <div className="role-menu">{(Object.keys(roleMeta) as Role[]).map(item => { const Icon = roleMeta[item].icon; return <button key={item} onClick={() => { setRole(item); setShowRoleMenu(false); setSection(item === "admin" ? "admin" : "home"); }}>{<Icon size={16} />}{roleMeta[item].label}{item === role && <Check size={15} />}</button>; })}</div>}</div><nav className="sidebar-nav"><span className="nav-label">Your space</span>{navItems.map(item => { const Icon = item.icon; return <button key={item.id} className={section === item.id ? "active" : ""} onClick={() => { setSection(item.id); setMobileNav(false); }}><Icon size={18} />{item.label}{item.id === "home" && <span className="nav-dot" />}</button>; })}<span className="nav-label second">Management</span><button className={section === "admin" ? "active" : ""} onClick={() => { if (role !== "admin") { toast("Admin dashboard is available to Admin only"); return; } setSection("admin"); setMobileNav(false); }}><LayoutDashboard size={18} />Admin dashboard{role !== "admin" && <LockKeyhole size={13} className="nav-lock" />}</button></nav><div className="sidebar-bottom"><div className="weekly-mini"><div className="mini-head"><span>Weekly progress</span><b>{progress}%</b></div><div className="line-progress"><i style={{ width: `${progress}%` }} /></div><small>A small step every day ✨</small></div><button className="sidebar-settings"><Settings2 size={17} /> Settings <ChevronDown size={14} /></button></div></aside><main className="main-content"><header className="topbar"><button className="mobile-menu" onClick={() => setMobileNav(!mobileNav)}><Menu size={21} /></button><div className="breadcrumb"><span>G2B School</span><i>/</i><b>{section === "home" ? "Home" : section === "schedule" ? "Schedule" : section === "materials" ? "Materials" : "Admin dashboard"}</b></div><div className="topbar-actions"><button className="icon-btn notification" onClick={() => toast("No new notifications") }><Bell size={19} /><i /></button><div className="profile-chip"><div className="profile-avatar">{role === "admin" ? "A" : studentName.charAt(0)}</div><div><b>{role === "student" ? studentName : activeRole.label}</b><small>{role === "admin" ? "Content manager" : role === "visitor" ? "Browse only" : "Student · G2B"}</small></div><ChevronDown size={14} /></div></div></header><div className="content-wrap"><div className="mobile-welcome"><div><div className="eyebrow">Wednesday, September 17 2026</div><h1>Good evening, {role === "student" ? studentName : activeRole.label} 👋</h1></div><button className="soft-btn" onClick={() => setRole(role === "visitor" ? "student" : "visitor")}><UserRound size={16} /> Switch role</button></div>{section === "home" && <HomeView tasks={tasks} role={role} setSection={setSection} toggleTask={toggleTask} reactTask={reactTask} deleteTask={deleteTask} />}{section === "schedule" && <ScheduleView />}{section === "materials" && <MaterialsView materials={materials} role={role} onDelete={deleteMaterial} />}{section === "admin" && role === "admin" && <AdminView tasks={tasks} materials={materials} onAddTask={task => setTasks(list => [task, ...list])} onDeleteTask={deleteTask} onAddMaterial={material => setMaterials(list => [material, ...list])} onDeleteMaterial={deleteMaterial} />}{section === "admin" && role !== "admin" && <div className="empty-access"><LockKeyhole size={36} /><h2>Admin dashboard is locked</h2><p>Switch the role from the menu and choose Admin to edit content.</p><button className="primary-btn" onClick={() => setRole("admin")}>Enter as Admin <LogIn size={16} /></button></div>}</div></main></div>;
}
