import {
  SubjectInfo,
  ClassTimetable,
  WeeklyPlanItem,
  DailyFollowUp,
  StudentPersonalTask,
  SchoolMaterialFile
} from '../types';

export const SUBJECTS: SubjectInfo[] = [
  {
    id: 'english',
    nameAr: 'اللغة الإنجليزية',
    nameEn: 'English',
    color: 'bg-blue-50 text-blue-800',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200',
    iconName: 'BookOpen'
  },
  {
    id: 'arabic',
    nameAr: 'اللغة العربية',
    nameEn: 'Arabic',
    color: 'bg-emerald-50 text-emerald-800',
    textColor: 'text-emerald-700',
    borderColor: 'border-emerald-200',
    iconName: 'Feather'
  },
  {
    id: 'math',
    nameAr: 'الرياضيات',
    nameEn: 'Math',
    color: 'bg-indigo-50 text-indigo-800',
    textColor: 'text-indigo-700',
    borderColor: 'border-indigo-200',
    iconName: 'Calculator'
  },
  {
    id: 'science',
    nameAr: 'العلوم',
    nameEn: 'Science',
    color: 'bg-teal-50 text-teal-800',
    textColor: 'text-teal-700',
    borderColor: 'border-teal-200',
    iconName: 'FlaskConical'
  },
  {
    id: 'social',
    nameAr: 'الدراسات الاجتماعية',
    nameEn: 'Social Studies',
    color: 'bg-amber-50 text-amber-900',
    textColor: 'text-amber-800',
    borderColor: 'border-amber-200',
    iconName: 'Compass'
  },
  {
    id: 'french',
    nameAr: 'اللغة الفرنسية',
    nameEn: 'French',
    color: 'bg-rose-50 text-rose-800',
    textColor: 'text-rose-700',
    borderColor: 'border-rose-200',
    iconName: 'Languages'
  },
  {
    id: 'ict',
    nameAr: 'تكنولوجيا المعلومات',
    nameEn: 'ICT',
    color: 'bg-cyan-50 text-cyan-800',
    textColor: 'text-cyan-700',
    borderColor: 'border-cyan-200',
    iconName: 'Laptop'
  },
  {
    id: 'art',
    nameAr: 'التربية الفنية',
    nameEn: 'Art',
    color: 'bg-purple-50 text-purple-800',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-200',
    iconName: 'Palette'
  },
  {
    id: 'pe',
    nameAr: 'التربية البدنية',
    nameEn: 'PE',
    color: 'bg-orange-50 text-orange-800',
    textColor: 'text-orange-700',
    borderColor: 'border-orange-200',
    iconName: 'Activity'
  },
  {
    id: 'ethics',
    nameAr: 'التربية الدينية والقيم',
    nameEn: 'Religion & Ethics',
    color: 'bg-lime-50 text-lime-900',
    textColor: 'text-lime-800',
    borderColor: 'border-lime-200',
    iconName: 'Heart'
  }
];

export const BLOCKS = [
  { id: 'block1', nameAr: 'بلوك 1 (Block 1)', weeksCount: 4, current: true },
  { id: 'block2', nameAr: 'بلوك 2 (Block 2)', weeksCount: 4, current: false },
  { id: 'block3', nameAr: 'بلوك 3 (Block 3)', weeksCount: 4, current: false },
];

export const WEEKS = [
  { id: 'week1', nameAr: 'الأسبوع 1 (Week 1)', isCurrent: false },
  { id: 'week2', nameAr: 'الأسبوع 2 (Week 2)', isCurrent: true },
  { id: 'week3', nameAr: 'الأسبوع 3 (Week 3)', isCurrent: false },
  { id: 'week4', nameAr: 'الأسبوع 4 (Week 4)', isCurrent: false },
];

export const PERIOD_TIMES = [
  { periodNum: 1, time: '08:00 - 08:45' },
  { periodNum: 2, time: '08:45 - 09:30' },
  { periodNum: 3, time: '10:00 - 10:45' },
  { periodNum: 4, time: '10:45 - 11:30' },
  { periodNum: 5, time: '11:30 - 12:15' },
  { periodNum: 6, time: '12:45 - 01:30' },
  { periodNum: 7, time: '01:30 - 02:15' },
];

export const INITIAL_TIMETABLES: ClassTimetable[] = [
  {
    classId: '2A',
    days: [
      {
        dayNameAr: 'الأحد',
        dayNameEn: 'Sunday',
        periods: [
          { id: 'p-2a-sun-1', periodNum: 1, time: '08:00 - 08:45', subjectId: 'english', teacher: 'Ms. Sarah' },
          { id: 'p-2a-sun-2', periodNum: 2, time: '08:45 - 09:30', subjectId: 'math', teacher: 'Mr. Ahmed' },
          { id: 'p-2a-sun-3', periodNum: 3, time: '10:00 - 10:45', subjectId: 'arabic', teacher: 'أ. فاطمة' },
          { id: 'p-2a-sun-4', periodNum: 4, time: '10:45 - 11:30', subjectId: 'science', teacher: 'Ms. Mona' },
          { id: 'p-2a-sun-5', periodNum: 5, time: '11:30 - 12:15', subjectId: 'ict', teacher: 'Eng. Tamer' },
          { id: 'p-2a-sun-6', periodNum: 6, time: '12:45 - 01:30', subjectId: 'french', teacher: 'Mme. Claire' },
          { id: 'p-2a-sun-7', periodNum: 7, time: '01:30 - 02:15', subjectId: 'ethics', teacher: 'أ. فاطمة' }
        ]
      },
      {
        dayNameAr: 'الإثنين',
        dayNameEn: 'Monday',
        periods: [
          { id: 'p-2a-mon-1', periodNum: 1, time: '08:00 - 08:45', subjectId: 'math', teacher: 'Mr. Ahmed' },
          { id: 'p-2a-mon-2', periodNum: 2, time: '08:45 - 09:30', subjectId: 'english', teacher: 'Ms. Sarah' },
          { id: 'p-2a-mon-3', periodNum: 3, time: '10:00 - 10:45', subjectId: 'science', teacher: 'Ms. Mona' },
          { id: 'p-2a-mon-4', periodNum: 4, time: '10:45 - 11:30', subjectId: 'arabic', teacher: 'أ. فاطمة' },
          { id: 'p-2a-mon-5', periodNum: 5, time: '11:30 - 12:15', subjectId: 'social', teacher: 'أ. محمد محمود' },
          { id: 'p-2a-mon-6', periodNum: 6, time: '12:45 - 01:30', subjectId: 'art', teacher: 'Ms. Nour' },
          { id: 'p-2a-mon-7', periodNum: 7, time: '01:30 - 02:15', subjectId: 'english', teacher: 'Ms. Sarah' }
        ]
      },
      {
        dayNameAr: 'الثلاثاء',
        dayNameEn: 'Tuesday',
        periods: [
          { id: 'p-2a-tue-1', periodNum: 1, time: '08:00 - 08:45', subjectId: 'arabic', teacher: 'أ. فاطمة' },
          { id: 'p-2a-tue-2', periodNum: 2, time: '08:45 - 09:30', subjectId: 'english', teacher: 'Ms. Sarah' },
          { id: 'p-2a-tue-3', periodNum: 3, time: '10:00 - 10:45', subjectId: 'math', teacher: 'Mr. Ahmed' },
          { id: 'p-2a-tue-4', periodNum: 4, time: '10:45 - 11:30', subjectId: 'pe', teacher: 'Coach Yasser' },
          { id: 'p-2a-tue-5', periodNum: 5, time: '11:30 - 12:15', subjectId: 'science', teacher: 'Ms. Mona' },
          { id: 'p-2a-tue-6', periodNum: 6, time: '12:45 - 01:30', subjectId: 'french', teacher: 'Mme. Claire' },
          { id: 'p-2a-tue-7', periodNum: 7, time: '01:30 - 02:15', subjectId: 'arabic', teacher: 'أ. فاطمة' }
        ]
      },
      {
        dayNameAr: 'الأربعاء',
        dayNameEn: 'Wednesday',
        periods: [
          { id: 'p-2a-wed-1', periodNum: 1, time: '08:00 - 08:45', subjectId: 'science', teacher: 'Ms. Mona' },
          { id: 'p-2a-wed-2', periodNum: 2, time: '08:45 - 09:30', subjectId: 'math', teacher: 'Mr. Ahmed' },
          { id: 'p-2a-wed-3', periodNum: 3, time: '10:00 - 10:45', subjectId: 'english', teacher: 'Ms. Sarah' },
          { id: 'p-2a-wed-4', periodNum: 4, time: '10:45 - 11:30', subjectId: 'arabic', teacher: 'أ. فاطمة' },
          { id: 'p-2a-wed-5', periodNum: 5, time: '11:30 - 12:15', subjectId: 'ict', teacher: 'Eng. Tamer' },
          { id: 'p-2a-wed-6', periodNum: 6, time: '12:45 - 01:30', subjectId: 'social', teacher: 'أ. محمد محمود' },
          { id: 'p-2a-wed-7', periodNum: 7, time: '01:30 - 02:15', subjectId: 'math', teacher: 'Mr. Ahmed' }
        ]
      },
      {
        dayNameAr: 'الخميس',
        dayNameEn: 'Thursday',
        periods: [
          { id: 'p-2a-thu-1', periodNum: 1, time: '08:00 - 08:45', subjectId: 'english', teacher: 'Ms. Sarah' },
          { id: 'p-2a-thu-2', periodNum: 2, time: '08:45 - 09:30', subjectId: 'arabic', teacher: 'أ. فاطمة' },
          { id: 'p-2a-thu-3', periodNum: 3, time: '10:00 - 10:45', subjectId: 'math', teacher: 'Mr. Ahmed' },
          { id: 'p-2a-thu-4', periodNum: 4, time: '10:45 - 11:30', subjectId: 'science', teacher: 'Ms. Mona' },
          { id: 'p-2a-thu-5', periodNum: 5, time: '11:30 - 12:15', subjectId: 'art', teacher: 'Ms. Nour' },
          { id: 'p-2a-thu-6', periodNum: 6, time: '12:45 - 01:30', subjectId: 'french', teacher: 'Mme. Claire' },
          { id: 'p-2a-thu-7', periodNum: 7, time: '01:30 - 02:15', subjectId: 'pe', teacher: 'Coach Yasser' }
        ]
      }
    ]
  },
  {
    classId: '2B',
    days: [
      {
        dayNameAr: 'الأحد',
        dayNameEn: 'Sunday',
        periods: [
          { id: 'p-2b-sun-1', periodNum: 1, time: '08:00 - 08:45', subjectId: 'arabic', teacher: 'أ. مريم' },
          { id: 'p-2b-sun-2', periodNum: 2, time: '08:45 - 09:30', subjectId: 'english', teacher: 'Mr. David' },
          { id: 'p-2b-sun-3', periodNum: 3, time: '10:00 - 10:45', subjectId: 'math', teacher: 'Ms. Hoda' },
          { id: 'p-2b-sun-4', periodNum: 4, time: '10:45 - 11:30', subjectId: 'ict', teacher: 'Eng. Tamer' },
          { id: 'p-2b-sun-5', periodNum: 5, time: '11:30 - 12:15', subjectId: 'science', teacher: 'Mr. Bassem' },
          { id: 'p-2b-sun-6', periodNum: 6, time: '12:45 - 01:30', subjectId: 'social', teacher: 'أ. دعاء' },
          { id: 'p-2b-sun-7', periodNum: 7, time: '01:30 - 02:15', subjectId: 'ethics', teacher: 'أ. مريم' }
        ]
      },
      {
        dayNameAr: 'الإثنين',
        dayNameEn: 'Monday',
        periods: [
          { id: 'p-2b-mon-1', periodNum: 1, time: '08:00 - 08:45', subjectId: 'english', teacher: 'Mr. David' },
          { id: 'p-2b-mon-2', periodNum: 2, time: '08:45 - 09:30', subjectId: 'math', teacher: 'Ms. Hoda' },
          { id: 'p-2b-mon-3', periodNum: 3, time: '10:00 - 10:45', subjectId: 'arabic', teacher: 'أ. مريم' },
          { id: 'p-2b-mon-4', periodNum: 4, time: '10:45 - 11:30', subjectId: 'french', teacher: 'Mme. Claire' },
          { id: 'p-2b-mon-5', periodNum: 5, time: '11:30 - 12:15', subjectId: 'science', teacher: 'Mr. Bassem' },
          { id: 'p-2b-mon-6', periodNum: 6, time: '12:45 - 01:30', subjectId: 'pe', teacher: 'Coach Yasser' },
          { id: 'p-2b-mon-7', periodNum: 7, time: '01:30 - 02:15', subjectId: 'art', teacher: 'Ms. Nour' }
        ]
      },
      {
        dayNameAr: 'الثلاثاء',
        dayNameEn: 'Tuesday',
        periods: [
          { id: 'p-2b-tue-1', periodNum: 1, time: '08:00 - 08:45', subjectId: 'science', teacher: 'Mr. Bassem' },
          { id: 'p-2b-tue-2', periodNum: 2, time: '08:45 - 09:30', subjectId: 'arabic', teacher: 'أ. مريم' },
          { id: 'p-2b-tue-3', periodNum: 3, time: '10:00 - 10:45', subjectId: 'english', teacher: 'Mr. David' },
          { id: 'p-2b-tue-4', periodNum: 4, time: '10:45 - 11:30', subjectId: 'math', teacher: 'Ms. Hoda' },
          { id: 'p-2b-tue-5', periodNum: 5, time: '11:30 - 12:15', subjectId: 'french', teacher: 'Mme. Claire' },
          { id: 'p-2b-tue-6', periodNum: 6, time: '12:45 - 01:30', subjectId: 'ict', teacher: 'Eng. Tamer' },
          { id: 'p-2b-tue-7', periodNum: 7, time: '01:30 - 02:15', subjectId: 'social', teacher: 'أ. دعاء' }
        ]
      },
      {
        dayNameAr: 'الأربعاء',
        dayNameEn: 'Wednesday',
        periods: [
          { id: 'p-2b-wed-1', periodNum: 1, time: '08:00 - 08:45', subjectId: 'math', teacher: 'Ms. Hoda' },
          { id: 'p-2b-wed-2', periodNum: 2, time: '08:45 - 09:30', subjectId: 'science', teacher: 'Mr. Bassem' },
          { id: 'p-2b-wed-3', periodNum: 3, time: '10:00 - 10:45', subjectId: 'arabic', teacher: 'أ. مريم' },
          { id: 'p-2b-wed-4', periodNum: 4, time: '10:45 - 11:30', subjectId: 'english', teacher: 'Mr. David' },
          { id: 'p-2b-wed-5', periodNum: 5, time: '11:30 - 12:15', subjectId: 'art', teacher: 'Ms. Nour' },
          { id: 'p-2b-wed-6', periodNum: 6, time: '12:45 - 01:30', subjectId: 'english', teacher: 'Mr. David' },
          { id: 'p-2b-wed-7', periodNum: 7, time: '01:30 - 02:15', subjectId: 'math', teacher: 'Ms. Hoda' }
        ]
      },
      {
        dayNameAr: 'الخميس',
        dayNameEn: 'Thursday',
        periods: [
          { id: 'p-2b-thu-1', periodNum: 1, time: '08:00 - 08:45', subjectId: 'arabic', teacher: 'أ. مريم' },
          { id: 'p-2b-thu-2', periodNum: 2, time: '08:45 - 09:30', subjectId: 'english', teacher: 'Mr. David' },
          { id: 'p-2b-thu-3', periodNum: 3, time: '10:00 - 10:45', subjectId: 'science', teacher: 'Mr. Bassem' },
          { id: 'p-2b-thu-4', periodNum: 4, time: '10:45 - 11:30', subjectId: 'math', teacher: 'Ms. Hoda' },
          { id: 'p-2b-thu-5', periodNum: 5, time: '11:30 - 12:15', subjectId: 'social', teacher: 'أ. دعاء' },
          { id: 'p-2b-thu-6', periodNum: 6, time: '12:45 - 01:30', subjectId: 'pe', teacher: 'Coach Yasser' },
          { id: 'p-2b-thu-7', periodNum: 7, time: '01:30 - 02:15', subjectId: 'french', teacher: 'Mme. Claire' }
        ]
      }
    ]
  },
  {
    classId: '2C',
    days: [
      {
        dayNameAr: 'الأحد',
        dayNameEn: 'Sunday',
        periods: [
          { id: 'p-2c-sun-1', periodNum: 1, time: '08:00 - 08:45', subjectId: 'math', teacher: 'Mr. Kareem' },
          { id: 'p-2c-sun-2', periodNum: 2, time: '08:45 - 09:30', subjectId: 'arabic', teacher: 'أ. سمر' },
          { id: 'p-2c-sun-3', periodNum: 3, time: '10:00 - 10:45', subjectId: 'english', teacher: 'Ms. Laila' },
          { id: 'p-2c-sun-4', periodNum: 4, time: '10:45 - 11:30', subjectId: 'science', teacher: 'Ms. Reham' },
          { id: 'p-2c-sun-5', periodNum: 5, time: '11:30 - 12:15', subjectId: 'french', teacher: 'Mme. Claire' },
          { id: 'p-2c-sun-6', periodNum: 6, time: '12:45 - 01:30', subjectId: 'ict', teacher: 'Eng. Tamer' },
          { id: 'p-2c-sun-7', periodNum: 7, time: '01:30 - 02:15', subjectId: 'ethics', teacher: 'أ. سمر' }
        ]
      },
      {
        dayNameAr: 'الإثنين',
        dayNameEn: 'Monday',
        periods: [
          { id: 'p-2c-mon-1', periodNum: 1, time: '08:00 - 08:45', subjectId: 'science', teacher: 'Ms. Reham' },
          { id: 'p-2c-mon-2', periodNum: 2, time: '08:45 - 09:30', subjectId: 'arabic', teacher: 'أ. سمر' },
          { id: 'p-2c-mon-3', periodNum: 3, time: '10:00 - 10:45', subjectId: 'math', teacher: 'Mr. Kareem' },
          { id: 'p-2c-mon-4', periodNum: 4, time: '10:45 - 11:30', subjectId: 'english', teacher: 'Ms. Laila' },
          { id: 'p-2c-mon-5', periodNum: 5, time: '11:30 - 12:15', subjectId: 'social', teacher: 'أ. حسام' },
          { id: 'p-2c-mon-6', periodNum: 6, time: '12:45 - 01:30', subjectId: 'pe', teacher: 'Coach Yasser' },
          { id: 'p-2c-mon-7', periodNum: 7, time: '01:30 - 02:15', subjectId: 'art', teacher: 'Ms. Nour' }
        ]
      },
      {
        dayNameAr: 'الثلاثاء',
        dayNameEn: 'Tuesday',
        periods: [
          { id: 'p-2c-tue-1', periodNum: 1, time: '08:00 - 08:45', subjectId: 'english', teacher: 'Ms. Laila' },
          { id: 'p-2c-tue-2', periodNum: 2, time: '08:45 - 09:30', subjectId: 'math', teacher: 'Mr. Kareem' },
          { id: 'p-2c-tue-3', periodNum: 3, time: '10:00 - 10:45', subjectId: 'science', teacher: 'Ms. Reham' },
          { id: 'p-2c-tue-4', periodNum: 4, time: '10:45 - 11:30', subjectId: 'arabic', teacher: 'أ. سمر' },
          { id: 'p-2c-tue-5', periodNum: 5, time: '11:30 - 12:15', subjectId: 'french', teacher: 'Mme. Claire' },
          { id: 'p-2c-tue-6', periodNum: 6, time: '12:45 - 01:30', subjectId: 'ict', teacher: 'Eng. Tamer' },
          { id: 'p-2c-tue-7', periodNum: 7, time: '01:30 - 02:15', subjectId: 'arabic', teacher: 'أ. سمر' }
        ]
      },
      {
        dayNameAr: 'الأربعاء',
        dayNameEn: 'Wednesday',
        periods: [
          { id: 'p-2c-wed-1', periodNum: 1, time: '08:00 - 08:45', subjectId: 'arabic', teacher: 'أ. سمر' },
          { id: 'p-2c-wed-2', periodNum: 2, time: '08:45 - 09:30', subjectId: 'english', teacher: 'Ms. Laila' },
          { id: 'p-2c-wed-3', periodNum: 3, time: '10:00 - 10:45', subjectId: 'math', teacher: 'Mr. Kareem' },
          { id: 'p-2c-wed-4', periodNum: 4, time: '10:45 - 11:30', subjectId: 'science', teacher: 'Ms. Reham' },
          { id: 'p-2c-wed-5', periodNum: 5, time: '11:30 - 12:15', subjectId: 'art', teacher: 'Ms. Nour' },
          { id: 'p-2c-wed-6', periodNum: 6, time: '12:45 - 01:30', subjectId: 'social', teacher: 'أ. حسام' },
          { id: 'p-2c-wed-7', periodNum: 7, time: '01:30 - 02:15', subjectId: 'english', teacher: 'Ms. Laila' }
        ]
      },
      {
        dayNameAr: 'الخميس',
        dayNameEn: 'Thursday',
        periods: [
          { id: 'p-2c-thu-1', periodNum: 1, time: '08:00 - 08:45', subjectId: 'math', teacher: 'Mr. Kareem' },
          { id: 'p-2c-thu-2', periodNum: 2, time: '08:45 - 09:30', subjectId: 'english', teacher: 'Ms. Laila' },
          { id: 'p-2c-thu-3', periodNum: 3, time: '10:00 - 10:45', subjectId: 'arabic', teacher: 'أ. سمر' },
          { id: 'p-2c-thu-4', periodNum: 4, time: '10:45 - 11:30', subjectId: 'french', teacher: 'Mme. Claire' },
          { id: 'p-2c-thu-5', periodNum: 5, time: '11:30 - 12:15', subjectId: 'pe', teacher: 'Coach Yasser' },
          { id: 'p-2c-thu-6', periodNum: 6, time: '12:45 - 01:30', subjectId: 'science', teacher: 'Ms. Reham' },
          { id: 'p-2c-thu-7', periodNum: 7, time: '01:30 - 02:15', subjectId: 'social', teacher: 'أ. حسام' }
        ]
      }
    ]
  }
];

export const INITIAL_WEEKLY_PLANS: WeeklyPlanItem[] = [
  // Block 1 - Week 2
  {
    id: 'wp-b1-w2-eng',
    blockId: 'block1',
    weekId: 'week2',
    classId: 'all',
    subjectId: 'english',
    unitOrTheme: 'Unit 2: My Wonderful Community & Helpers',
    learningObjectives: [
      'Identify community helpers (firefighter, doctor, police officer, teacher)',
      'Use simple present tense to describe daily routines and jobs',
      'Phonics focus: Long "a" sound (ai, ay patterns like rain, day)',
      'Read and comprehend the story "A Day in Our Town"'
    ],
    vocabulary: ['Community', 'Helper', 'Firefighter', 'Clinic', 'Neighborhood', 'Safe'],
    resourcesNote: 'Student Book pp. 24-31 + Activity Workbook pp. 18-22',
    assessmentNote: 'Spelling dictation on Thursday & short reading comprehension check.'
  },
  {
    id: 'wp-b1-w2-arab',
    blockId: 'block1',
    weekId: 'week2',
    classId: 'all',
    subjectId: 'arabic',
    unitOrTheme: 'المحور الأول: من أكون؟ - درس "أنا أستطيع"',
    learningObjectives: [
      'قراءة قصة "أنا أستطيع" قراءة جهرية صحيحة معبرة',
      'اكتشاف معاني المفردات الجديدة من السياق (واثق، ماهر، استطاع)',
      'التمييز بين التاء المربوطة والتاء المفتوحة والهاء في أواخر الكلمات',
      'التدريب على التعبير الشفهي عن الثقة بالنفس والمحاولة دون يأس'
    ],
    vocabulary: ['واثق', 'يستطيع', 'ماهر', 'فوز', 'استعداد'],
    resourcesNote: 'كتاب اللغة العربية من صفحة 22 إلى 29 + كشكول الحصة',
    assessmentNote: 'إملاء الكلمات التي تنتهي بتاء مربوطة ومفتوحة يوم الأربعاء.'
  },
  {
    id: 'wp-b1-w2-math',
    blockId: 'block1',
    weekId: 'week2',
    classId: 'all',
    subjectId: 'math',
    unitOrTheme: 'Chapter 2: Two-Digit Addition with Regrouping & Place Value',
    learningObjectives: [
      'Understand regrouping (carrying over) from ones to tens column',
      'Solve two-digit word problems related to real-life shopping scenarios',
      'Use base-ten blocks (flats and rods) to model addition visually',
      'Mental math warm-up: Adding doubles (e.g. 15 + 15, 20 + 20)'
    ],
    vocabulary: ['Regrouping', 'Place Value', 'Tens', 'Ones', 'Sum', 'Addition'],
    resourcesNote: 'Cambridge Primary Math Learner Book 2, pp. 34-42',
    assessmentNote: 'Weekly Math Quiz on Thursday covering 2-digit regrouping.'
  },
  {
    id: 'wp-b1-w2-sci',
    blockId: 'block1',
    weekId: 'week2',
    classId: 'all',
    subjectId: 'science',
    unitOrTheme: 'Unit 1: Living Things and Habitats - Desert & River Nile Life',
    learningObjectives: [
      'Recognize how plants and animals adapt to survive along the River Nile and Minya environments',
      'Investigate plant parts (roots, stem, leaves, flower) and their functions',
      'Conduct hands-on experiment: Observing water movement through celery stalk'
    ],
    vocabulary: ['Habitat', 'Adaptation', 'Absorb', 'Roots', 'Nile River', 'Nutrients'],
    resourcesNote: 'Science Lab Manual + Nile Schools Cambridge Science Activity Book 2',
    assessmentNote: 'Lab journal check during class on Wednesday.'
  },
  {
    id: 'wp-b1-w2-soc',
    blockId: 'block1',
    weekId: 'week2',
    classId: 'all',
    subjectId: 'social',
    unitOrTheme: 'الوحدة الأولى: محافظتي عروس الصعيد (المنيا)',
    learningObjectives: [
      'التعرف على معالم محافظة المنيا وموقعها على نهر النيل',
      'التمييز بين البيئة الريفية والبيئة الحضرية في المحافظة',
      'رسم خريطة مبسطة لمعالم المنيا وتحديد نهر النيل'
    ],
    vocabulary: ['محافظة المنيا', 'نهر النيل', 'عروس الصعيد', 'معالم', 'خريطة'],
    resourcesNote: 'كتاب الدراسات الاجتماعية + كشكول الأنشطة صفحة 15-18',
    assessmentNote: 'نشاط تلوين خريطة المنيا ومشاركتها في الفصل.'
  },
  {
    id: 'wp-b1-w2-fre',
    blockId: 'block1',
    weekId: 'week2',
    classId: 'all',
    subjectId: 'french',
    unitOrTheme: 'Unité 1 : Les salutations et ma trousse d\'école',
    learningObjectives: [
      'Saluer et se présenter en français (Bonjour, Je m\'appelle...)',
      'Nommer les fournitures scolaires (le stylo, le crayon, la règle, la gomme)',
      'Utiliser les articles définis (le, la, les)'
    ],
    vocabulary: ['Bonjour', 'Le stylo', 'Le crayon', 'La gomme', 'La règle'],
    resourcesNote: 'Livre de français "Alex et Zoé 2" pp. 12-15',
    assessmentNote: 'Évaluation orale de prononciation jeudi.'
  },
  {
    id: 'wp-b1-w2-ict',
    blockId: 'block1',
    weekId: 'week2',
    classId: 'all',
    subjectId: 'ict',
    unitOrTheme: 'Unit 1: Computer Hardware & Healthy Digital Habits',
    learningObjectives: [
      'Distinguish between input devices (keyboard, mouse) and output devices (screen, printer)',
      'Practice safe typing posture and mouse grip in computer lab',
      'Use Paint program to draw geometric shapes and color them'
    ],
    vocabulary: ['Hardware', 'Keyboard', 'Mouse', 'Monitor', 'Printer', 'Click'],
    resourcesNote: 'Computer Lab 1 - Practical Hands-on',
    assessmentNote: 'Practical mini-exercise in Paint program.'
  }
];

export const INITIAL_DAILY_FOLLOW_UPS: DailyFollowUp[] = [
  {
    id: 'dfu-2a-today',
    date: '2026-09-09',
    classId: '2A',
    blockId: 'block1',
    weekId: 'week2',
    dayNameAr: 'الأربعاء',
    classwork: [
      {
        id: 'cw-1',
        subjectId: 'math',
        lessonTitle: 'الجمع بإعادة التسمية (Addition with Regrouping)',
        details: 'تم شرح مفهوم تجميع العشرات عندما يزيد ناتج الآحاد عن 9، وحل التدريبات على السبورة وفي كراسة التدريبات.',
        pages: 'كتاب التلميذ ص 36 و 37'
      },
      {
        id: 'cw-2',
        subjectId: 'english',
        lessonTitle: 'Phonics: Long "a" sound & Story Reading',
        details: 'Explained long "a" (ai & ay spellings like train, day). Read the first two pages of "A Day in Our Town" with student roleplay.',
        pages: 'Student Book pp. 26-27'
      },
      {
        id: 'cw-3',
        subjectId: 'arabic',
        lessonTitle: 'قصة أنا أستطيع - قراءة وتحليل المفردات',
        details: 'قراءة النص ومناقشة فكرة عدم الاستسلام، واستخراج الكلمات التي بها مد بالألف والتاء المربوطة.',
        pages: 'كتاب الوزارة ص 24 - 25'
      },
      {
        id: 'cw-4',
        subjectId: 'science',
        lessonTitle: 'أجزاء النبات ووظائف الجذور والساق',
        details: 'تم فحص نبات حقيقي داخل الفصل وملاحظة الجذور والساق والأوراق، وشرح كيف يمتص النبات الماء.',
        pages: 'Science Workbook p. 19'
      },
      {
        id: 'cw-5',
        subjectId: 'ict',
        lessonTitle: 'التعامل مع الفأرة ووحدات الإدخال',
        details: 'تدريب عملي في معمل الحاسب على الضغط المزدوج وسحب وإفلات العناصر داخل برنامج الرسام.',
        pages: 'التدريب العملي بمعمل الحاسب'
      }
    ],
    homework: [
      {
        id: 'hw-1',
        subjectId: 'math',
        assignment: 'حل المسائل من 1 إلى 6 في كراسة الأنشطة ص 38.',
        dueDate: 'غداً الخميس',
        pages: 'ص 38 تدريب 1 إلى 6',
        instructions: 'يرجى كتابة خطوات إعادة التسمية في مربع العشرات بوضوح.'
      },
      {
        id: 'hw-2',
        subjectId: 'english',
        assignment: 'Complete the Phonics worksheet: circle the words with (ai) and (ay).',
        dueDate: 'Thursday morning',
        pages: 'Workbook p. 20',
        instructions: 'Write 2 simple sentences using the words: "rain" and "play".'
      },
      {
        id: 'hw-3',
        subjectId: 'arabic',
        assignment: 'نسخ الفقرة الأولى من درس "أنا أستطيع" في كشكول الواجب بخط النسخ الجميل.',
        dueDate: 'غداً الخميس',
        pages: 'كشكول الواجب',
        instructions: 'مراعاة وضع التشكيل والالتزام بالسطر.'
      },
      {
        id: 'hw-4',
        subjectId: 'french',
        assignment: 'حفظ كلمات أدوات المقلمة (le stylo, le crayon, la gomme) ونطقها.',
        dueDate: 'الأسبوع القادم',
        pages: 'Livre p. 13'
      }
    ],
    tomorrowPreparations: [
      {
        id: 'prep-1',
        subjectId: 'math',
        item: 'إحضار كتاب الماث (Learner Book) وكشكول المربعات ومسطرة 20 سم.',
        category: 'books',
        isImportant: true
      },
      {
        id: 'prep-2',
        subjectId: 'pe',
        item: 'ارتداء الزي الرياضي المدرسي الرسمي الخاص بمدارس النيل وكوتشي رياضي مناسب لحصة التربية البدنية (PE).',
        category: 'clothes',
        isImportant: true
      },
      {
        id: 'prep-3',
        subjectId: 'art',
        item: 'إحضار كراسة الرسم وألوان خشب ومقص أطفال غير حاد لحصة التربية الفنية.',
        category: 'tools',
        isImportant: false
      },
      {
        id: 'prep-4',
        subjectId: 'science',
        item: 'إحضار كشكول الساينس ومراجعة أسئلة ص 19 استعداداً لمناقشة تجربة امتصاص الماء.',
        category: 'books',
        isImportant: false
      }
    ]
  },
  {
    id: 'dfu-2b-today',
    date: '2026-09-09',
    classId: '2B',
    blockId: 'block1',
    weekId: 'week2',
    dayNameAr: 'الأربعاء',
    classwork: [
      {
        id: 'cw-2b-1',
        subjectId: 'math',
        lessonTitle: 'Two-Digit Addition Regrouping Practice',
        details: 'Solving problems on board and practice in workbooks with partner check.',
        pages: 'Workbook pp. 35-36'
      },
      {
        id: 'cw-2b-2',
        subjectId: 'english',
        lessonTitle: 'Reading & Vocabulary - Helpers in town',
        details: 'Matched community helpers with their vehicles and tools. Practiced dialogs.',
        pages: 'Student Book pp. 25-26'
      },
      {
        id: 'cw-2b-3',
        subjectId: 'arabic',
        lessonTitle: 'التاء المفتوحة والتاء المربوطة',
        details: 'شرح الفرق الصوتي عند الوقف وعند الوصل مع تدريبات تطبيقية.',
        pages: 'كتاب المدرسة ص 26'
      }
    ],
    homework: [
      {
        id: 'hw-2b-1',
        subjectId: 'math',
        assignment: 'Solve page 37 in Math Activity Book (Questions 1 to 5).',
        dueDate: 'غداً الخميس'
      },
      {
        id: 'hw-2b-2',
        subjectId: 'arabic',
        assignment: 'كتابة 3 كلمات بها تاء مربوطة و3 كلمات بها تاء مفتوحة في كشكول الحصة.',
        dueDate: 'غداً الخميس'
      }
    ],
    tomorrowPreparations: [
      {
        id: 'prep-2b-1',
        subjectId: 'pe',
        item: 'الالتزام بارتداء الزي الرياضي المدرسي لحصة التربية البدنية.',
        category: 'clothes',
        isImportant: true
      },
      {
        id: 'prep-2b-2',
        subjectId: 'science',
        item: 'إحضار كشكول الساينس وقلم رصاص وممحاة لمتابعة تجربة النبات.',
        category: 'books',
        isImportant: false
      }
    ]
  },
  {
    id: 'dfu-2c-today',
    date: '2026-09-09',
    classId: '2C',
    blockId: 'block1',
    weekId: 'week2',
    dayNameAr: 'الأربعاء',
    classwork: [
      {
        id: 'cw-2c-1',
        subjectId: 'arabic',
        lessonTitle: 'قراءة وتحليل قصة أنا أستطيع',
        details: 'مناقشة أهداف الدرس والكلمات الجديدة وكتابة شبكة المفردات.',
        pages: 'كتاب الوزارة ص 23-24'
      },
      {
        id: 'cw-2c-2',
        subjectId: 'math',
        lessonTitle: 'Place value & addition',
        details: 'Mental math warm up followed by double-digit regrouping exercises.',
        pages: 'Student book p. 36'
      }
    ],
    homework: [
      {
        id: 'hw-2c-1',
        subjectId: 'arabic',
        assignment: 'نسخ سطرين من القصة وقراءة ص 24 قراءة جيدة مع ولي الأمر.',
        dueDate: 'غداً الخميس'
      },
      {
        id: 'hw-2c-2',
        subjectId: 'english',
        assignment: 'Workbook page 21 sentences 1-4.',
        dueDate: 'غداً الخميس'
      }
    ],
    tomorrowPreparations: [
      {
        id: 'prep-2c-1',
        subjectId: 'pe',
        item: 'الزي الرياضي الكامل لحصة التربية البدنية.',
        category: 'clothes',
        isImportant: true
      },
      {
        id: 'prep-2c-2',
        subjectId: 'french',
        item: 'إحضار كتاب وكشكول اللغة الفرنسية.',
        category: 'books',
        isImportant: false
      }
    ]
  }
];

export const INITIAL_STUDENT_TASKS: StudentPersonalTask[] = [
  {
    id: 'task-1',
    studentName: 'عمر أحمد',
    classId: '2A',
    title: 'مراجعة جدول ضرب 2 و 3 لمسابقة الحساب الذهني',
    subjectId: 'math',
    completed: true,
    dueDate: '2026-09-10',
    createdAt: '2026-09-08'
  },
  {
    id: 'task-2',
    studentName: 'عمر أحمد',
    classId: '2A',
    title: 'تجهيز صور لرجال الإطفاء والأطباء لمشروع الإنجليزي',
    subjectId: 'english',
    completed: false,
    dueDate: '2026-09-11',
    createdAt: '2026-09-09'
  },
  {
    id: 'task-3',
    studentName: 'عمر أحمد',
    classId: '2A',
    title: 'تحضير قراءة قصة أنا أستطيع لنيل نجمة القراءة في طابور الصباح',
    subjectId: 'arabic',
    completed: false,
    dueDate: '2026-09-10',
    createdAt: '2026-09-09'
  }
];

export const INITIAL_MATERIALS: SchoolMaterialFile[] = [
  {
    id: 'mat-1',
    title: 'English - Unit 2 Phonics & Community Helpers Activity Sheet',
    subjectId: 'english',
    classId: 'all',
    blockId: 'block1',
    weekId: 'week2',
    fileType: 'pdf',
    fileName: 'English_Grade2_Unit2_CommunityHelpers_Phonics.pdf',
    fileSize: '1.8 MB',
    uploadDate: '2026-09-08',
    uploadedBy: 'Ms. Sarah (Head of English)',
    description: 'ورقة عمل تدريبية تفاعلية تتضمن تدريبات الصوتيات (Long a: ai, ay) ومفردات المهن والمجتمع وتدريب القراءة لقصة A Day in Our Town.',
    previewSummary: `Nile Egyptian Schools - Minya Branch
Department of English Language - Grade 2 (2A, 2B, 2C)
Academic Year: 2026 / 2027

Unit 2: My Wonderful Community & Helpers
Phonics Focus: The Long 'a' vowel sound (ai, ay patterns)

Section 1: Phonics Detective!
Circle the words that have the long 'a' sound:
[ rain , train , cat , day , play , map , wait , say ]

Section 2: Vocabulary & Helpers
Match the community worker to their workplace and tool:
1. Firefighter  --> Fire Station  --> Water Hose
2. Doctor       --> Hospital      --> Stethoscope
3. Teacher      --> School        --> Books and Whiteboard
4. Police       --> Police Post   --> Patrol Car

Section 3: Reading Comprehension Practice
Read short story "A Day in Our Town" and answer true/false questions.`
  },
  {
    id: 'mat-2',
    title: 'Math - 2-Digit Addition with Regrouping Practice Booklets',
    subjectId: 'math',
    classId: 'all',
    blockId: 'block1',
    weekId: 'week2',
    fileType: 'pdf',
    fileName: 'Math_Grade2_Addition_Regrouping_Chapter2.pdf',
    fileSize: '2.4 MB',
    uploadDate: '2026-09-08',
    uploadedBy: 'Mr. Ahmed (Math Coordinator)',
    description: 'كتيب تدريبات الجمع بإعادة التسمية (Carrying Over) مع مسائل لفظية ونماذج رسومية لمكعبات العشرات والآحاد.',
    previewSummary: `Nile Egyptian Schools - Minya Branch
Cambridge Primary Mathematics - Grade 2
Chapter 2: Two-Digit Addition with Regrouping (Tens & Ones)

Rule to Remember:
"When the ones column adds up to 10 or more, carry 1 ten over to the tens door!"

Sample Practice Problems:
1)  27 + 15 = ___  (7 + 5 = 12 -> 2 in ones, 1 carried to tens -> 1 + 2 + 1 = 4 -> Answer: 42)
2)  38 + 24 = ___
3)  49 + 16 = ___
4)  56 + 27 = ___

Word Problem:
Omar has 28 Nile school stamps. Laila gave him 17 more stamps.
How many stamps does Omar have in total?
Working: 28 + 17 = 45 stamps.`
  },
  {
    id: 'mat-3',
    title: 'Science - Living Things & Plant Parts Experiment Manual',
    subjectId: 'science',
    classId: 'all',
    blockId: 'block1',
    weekId: 'week2',
    fileType: 'pdf',
    fileName: 'Science_Grade2_PlantParts_LabExperiment.pdf',
    fileSize: '3.1 MB',
    uploadDate: '2026-09-07',
    uploadedBy: 'Ms. Mona (Science Teacher)',
    description: 'دليل تجارب معمل الساينس لملاحظة امتصاص النبات للماء ووظائف الجذور والساق على ضفاف نهر النيل بالمنيا.',
    previewSummary: `Nile Egyptian Schools - Minya Branch
Cambridge Science Primary 2 - Unit 1: Living Things & Habitats

Lab Guide: How Does Water Travel Through a Plant?
Materials Needed:
- Fresh celery stalk with leafy top
- Transparent cup with clean water
- 5 drops of red or blue food coloring

Steps:
1. Place celery stalk in colored water.
2. Observe after 2 hours and after 24 hours.
3. Draw your observations in your science log.

Key Scientific Concept:
The stem acts like small straws (xylem tubes) that pull water and nutrients from roots up to leaves and flowers.`
  },
  {
    id: 'mat-4',
    title: 'اللغة العربية - مذكرة قصة "أنا أستطيع" والتمييز بين التاء والهاء',
    subjectId: 'arabic',
    classId: 'all',
    blockId: 'block1',
    weekId: 'week2',
    fileType: 'pdf',
    fileName: 'Arabic_Grade2_Story_AnaAstaeea_TaaRules.pdf',
    fileSize: '1.4 MB',
    uploadDate: '2026-09-07',
    uploadedBy: 'أ. فاطمة (معلمة أولى لغة عربية)',
    description: 'مذكرة مراجعة لغوية تشمل أسئلة الفهم القرائي وشبكة المفردات وقواعد التاء المربوطة والمفتوحة والهاء في أواخر الكلمات.',
    previewSummary: `مدارس النيل المصرية الدولية - فرع المنيا
قسم اللغة العربية - الصف الثاني الابتدائي (Grade 2)

المحور الأول: من أكون؟
الدرس الأول: قصة "أنا أستطيع"

أولاً: معاني المفردات:
- واثق: متأكد ومطمئن.
- ماهر: بارع ومتقن.
- استطاع: قدر وتمكن.

ثانياً: القاعدة الذهبية للتاء المربوطة (ـة / ة) والتاء المفتوحة (ت):
- التاء المربوطة: تنطق هاء عند الوقف (مدرسة)، وتنطق تاء عند الوصل (مدرسةُ النيل).
- التاء المفتوحة: تنطق تاء دائماً في الوقف والوصل (بيتْ / بيتُنا).

تدريب: صنف الكلمات التالية (حديقة - بنت - كُرة - زيت - مياه - شجرة).`
  },
  {
    id: 'mat-5',
    title: 'Weekly Master Plan - Block 1 Week 2 Official Guide',
    subjectId: 'english',
    classId: 'all',
    blockId: 'block1',
    weekId: 'week2',
    fileType: 'sheet',
    fileName: 'Nile_Minya_Grade2_WeeklyPlan_B1_W2.pdf',
    fileSize: '950 KB',
    uploadDate: '2026-09-06',
    uploadedBy: 'Academic Coordinator',
    description: 'الوثيقة المعتمدة للخطة الأسبوعية الشاملة لجميع المواد الدراسية لفصول 2A و 2B و 2C.',
    previewSummary: `Nile Egyptian Schools - Minya Branch
Weekly Master Curriculum Plan - Block 1 (Week 2)
Grade 2 (Classes 2A, 2B, 2C)

Summary of Learning Tracks:
- English: Phonics long 'a', Community Helpers story reading.
- Math: 2-digit addition with regrouping, word problem scenarios.
- Science: Plant structures, water transport lab demonstration.
- Arabic: درس أنا أستطيع، التاء المربوطة والمفتوحة، تعبير شفهي.
- French: Les salutations et la trousse d'école.
- ICT: Computer hardware inputs & mouse drawing skills.`
  },
  {
    id: 'mat-6',
    title: 'Social Studies - معالم محافظة المنيا عروس الصعيد وخريطة النيل',
    subjectId: 'social',
    classId: 'all',
    blockId: 'block1',
    weekId: 'week2',
    fileType: 'image',
    fileName: 'Minya_Landmarks_Map_Grade2.png',
    fileSize: '1.9 MB',
    uploadDate: '2026-09-06',
    uploadedBy: 'أ. محمد محمود',
    description: 'خريطة وصور ملونة لمعالم محافظة المنيا ونهر النيل والبيئة الزراعية والحضرية للطلاب.',
    previewSummary: `مدارس النيل المصرية الدولية - فرع المنيا
مادة الدراسات الاجتماعية والتربية الوطنية - الصف الثاني الابتدائي

الوحدة الأولى: محافظتي عروس الصعيد (المنيا)
أهم معالم المحافظة:
1. كورنيش النيل بالمنيا
2. كوبري المنيا العلوي
3. تل العمارنة وآثار المنيا التاريخية
4. البيئة الزراعية الغنية على ضفاف نهر النيل الخالد

نشاط التلميذ: تلوين مسار نهر النيل باللون الأزرق وكتابة اسم مدرستك على الخريطة.`
  }
];
