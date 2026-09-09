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
    id: 'music',
    nameAr: 'الموسيقى',
    nameEn: 'Music',
    color: 'bg-pink-50 text-pink-800',
    textColor: 'text-pink-700',
    borderColor: 'border-pink-200',
    iconName: 'Music2'
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
  { id: 'block1', nameAr: 'Block 1', weeksCount: 4, current: true },
  { id: 'block2', nameAr: 'Block 2', weeksCount: 4, current: false },
  { id: 'block3', nameAr: 'Block 3', weeksCount: 4, current: false },
  { id: 'block4', nameAr: 'Block 4', weeksCount: 4, current: false },
];

export const WEEKS = [
  { id: 'week1', nameAr: 'Week 1', isCurrent: false },
  { id: 'week2', nameAr: 'Week 2', isCurrent: true },
  { id: 'week3', nameAr: 'Week 3', isCurrent: false },
  { id: 'week4', nameAr: 'Week 4', isCurrent: false },
];

export const PERIOD_TIMES = [
  { periodNum: 1, time: '07:45 - 08:35' },
  { periodNum: 2, time: '08:35 - 09:25' },
  { periodNum: 3, time: '09:45 - 10:35' },
  { periodNum: 4, time: '10:35 - 11:25' },
  { periodNum: 5, time: '11:25 - 12:15' },
  { periodNum: 6, time: '12:15 - 13:05' },
  { periodNum: 7, time: '13:25 - 14:15' },
  { periodNum: 8, time: '14:15 - 15:05' },
];

export const INITIAL_TIMETABLES: ClassTimetable[] = [
  {
    classId: '2A',
    days: [
      {
        dayNameAr: 'الأحد',
        dayNameEn: 'Sunday',
        periods: [
          { id: 'p-2a-sun-1', periodNum: 1, time: '07:45 - 08:35', subjectId: 'pe', teacher: 'Coach Yasser' },
          { id: 'p-2a-sun-2', periodNum: 2, time: '08:35 - 09:25', subjectId: 'social', teacher: 'أ. محمد محمود' },
          { id: 'p-2a-sun-3', periodNum: 3, time: '09:45 - 10:35', subjectId: 'ict', teacher: 'Eng. Tamer' },
          { id: 'p-2a-sun-4', periodNum: 4, time: '10:35 - 11:25', subjectId: 'art', teacher: 'Ms. Nour' },
          { id: 'p-2a-sun-5', periodNum: 5, time: '11:25 - 12:15', subjectId: 'english', teacher: 'Ms. Sarah' },
          { id: 'p-2a-sun-6', periodNum: 6, time: '12:15 - 13:05', subjectId: 'english', teacher: 'Ms. Sarah' },
          { id: 'p-2a-sun-7', periodNum: 7, time: '13:25 - 14:15', subjectId: 'arabic', teacher: 'أ. فاطمة' },
          { id: 'p-2a-sun-8', periodNum: 8, time: '14:15 - 15:05', subjectId: 'math', teacher: 'Mr. Ahmed' }

        ]
      },
      {
        dayNameAr: 'الإثنين',
        dayNameEn: 'Monday',
        periods: [
          { id: 'p-2a-mon-1', periodNum: 1, time: '07:45 - 08:35', subjectId: 'music', teacher: 'Music Teacher' },
          { id: 'p-2a-mon-2', periodNum: 2, time: '08:35 - 09:25', subjectId: 'math', teacher: 'Mr. Ahmed' },
          { id: 'p-2a-mon-3', periodNum: 3, time: '09:45 - 10:35', subjectId: 'pe', teacher: 'Coach Yasser' },
          { id: 'p-2a-mon-4', periodNum: 4, time: '10:35 - 11:25', subjectId: 'science', teacher: 'Ms. Mona' },
          { id: 'p-2a-mon-5', periodNum: 5, time: '11:25 - 12:15', subjectId: 'arabic', teacher: 'أ. فاطمة' },
          { id: 'p-2a-mon-6', periodNum: 6, time: '12:15 - 13:05', subjectId: 'arabic', teacher: 'أ. فاطمة' },
          { id: 'p-2a-mon-7', periodNum: 7, time: '13:25 - 14:15', subjectId: 'ict', teacher: 'Eng. Tamer' },
          { id: 'p-2a-mon-8', periodNum: 8, time: '14:15 - 15:05', subjectId: 'english', teacher: 'Ms. Sarah' }

        ]
      },
      {
        dayNameAr: 'الثلاثاء',
        dayNameEn: 'Tuesday',
        periods: [
          { id: 'p-2a-tue-1', periodNum: 1, time: '07:45 - 08:35', subjectId: 'english', teacher: 'Ms. Sarah' },
          { id: 'p-2a-tue-2', periodNum: 2, time: '08:35 - 09:25', subjectId: 'english', teacher: 'Ms. Sarah' },
          { id: 'p-2a-tue-3', periodNum: 3, time: '09:45 - 10:35', subjectId: 'math', teacher: 'Mr. Ahmed' },
          { id: 'p-2a-tue-4', periodNum: 4, time: '10:35 - 11:25', subjectId: 'math', teacher: 'Mr. Ahmed' },
          { id: 'p-2a-tue-5', periodNum: 5, time: '11:25 - 12:15', subjectId: 'ethics', teacher: 'أ. فاطمة' },
          { id: 'p-2a-tue-6', periodNum: 6, time: '12:15 - 13:05', subjectId: 'french', teacher: 'Mme. Claire' },
          { id: 'p-2a-tue-7', periodNum: 7, time: '13:25 - 14:15', subjectId: 'art', teacher: 'Ms. Nour' },
          { id: 'p-2a-tue-8', periodNum: 8, time: '14:15 - 15:05', subjectId: 'arabic', teacher: 'أ. فاطمة' }

        ]
      },
      {
        dayNameAr: 'الأربعاء',
        dayNameEn: 'Wednesday',
        periods: [
          { id: 'p-2a-wed-1', periodNum: 1, time: '07:45 - 08:35', subjectId: 'math', teacher: 'Mr. Ahmed' },
          { id: 'p-2a-wed-2', periodNum: 2, time: '08:35 - 09:25', subjectId: 'science', teacher: 'Ms. Mona' },
          { id: 'p-2a-wed-3', periodNum: 3, time: '09:45 - 10:35', subjectId: 'ict', teacher: 'Eng. Tamer' },
          { id: 'p-2a-wed-4', periodNum: 4, time: '10:35 - 11:25', subjectId: 'social', teacher: 'أ. محمد محمود' },
          { id: 'p-2a-wed-5', periodNum: 5, time: '11:25 - 12:15', subjectId: 'french', teacher: 'Mme. Claire' },
          { id: 'p-2a-wed-6', periodNum: 6, time: '12:15 - 13:05', subjectId: 'arabic', teacher: 'أ. فاطمة' },
          { id: 'p-2a-wed-7', periodNum: 7, time: '13:25 - 14:15', subjectId: 'english', teacher: 'Ms. Sarah' },
          { id: 'p-2a-wed-8', periodNum: 8, time: '14:15 - 15:05', subjectId: 'english', teacher: 'Ms. Sarah' }

        ]
      },
      {
        dayNameAr: 'الخميس',
        dayNameEn: 'Thursday',
        periods: [
          { id: 'p-2a-thu-1', periodNum: 1, time: '07:45 - 08:35', subjectId: 'english', teacher: 'Ms. Sarah' },
          { id: 'p-2a-thu-2', periodNum: 2, time: '08:35 - 09:25', subjectId: 'music', teacher: 'Music Teacher' },
          { id: 'p-2a-thu-3', periodNum: 3, time: '09:45 - 10:35', subjectId: 'ethics', teacher: 'أ. فاطمة' },
          { id: 'p-2a-thu-4', periodNum: 4, time: '10:35 - 11:25', subjectId: 'arabic', teacher: 'أ. فاطمة' },
          { id: 'p-2a-thu-5', periodNum: 5, time: '11:25 - 12:15', subjectId: 'french', teacher: 'Mme. Claire' },
          { id: 'p-2a-thu-6', periodNum: 6, time: '12:15 - 13:05', subjectId: 'math', teacher: 'Mr. Ahmed' },
          { id: 'p-2a-thu-7', periodNum: 7, time: '13:25 - 14:15', subjectId: 'social', teacher: 'أ. محمد محمود' },
          { id: 'p-2a-thu-8', periodNum: 8, time: '14:15 - 15:05', subjectId: 'science', teacher: 'Ms. Mona' }

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
          { id: 'p-2c-sun-1', periodNum: 1, time: '07:45 - 08:35', subjectId: 'math', teacher: 'Mr. Ahmed' },
          { id: 'p-2c-sun-2', periodNum: 2, time: '08:35 - 09:25', subjectId: 'math', teacher: 'Mr. Ahmed' },
          { id: 'p-2c-sun-3', periodNum: 3, time: '09:45 - 10:35', subjectId: 'french', teacher: 'Mme. Claire' },
          { id: 'p-2c-sun-4', periodNum: 4, time: '10:35 - 11:25', subjectId: 'english', teacher: 'Ms. Sarah' },
          { id: 'p-2c-sun-5', periodNum: 5, time: '11:25 - 12:15', subjectId: 'ict', teacher: 'Eng. Tamer' },
          { id: 'p-2c-sun-6', periodNum: 6, time: '12:15 - 13:05', subjectId: 'arabic', teacher: 'أ. فاطمة' },
          { id: 'p-2c-sun-7', periodNum: 7, time: '13:25 - 14:15', subjectId: 'social', teacher: 'أ. محمد محمود' },
          { id: 'p-2c-sun-8', periodNum: 8, time: '14:15 - 15:05', subjectId: 'pe', teacher: 'Coach Yasser' }

        ]
      },
      {
        dayNameAr: 'الإثنين',
        dayNameEn: 'Monday',
        periods: [
          { id: 'p-2c-mon-1', periodNum: 1, time: '07:45 - 08:35', subjectId: 'arabic', teacher: 'أ. فاطمة' },
          { id: 'p-2c-mon-2', periodNum: 2, time: '08:35 - 09:25', subjectId: 'arabic', teacher: 'أ. فاطمة' },
          { id: 'p-2c-mon-3', periodNum: 3, time: '09:45 - 10:35', subjectId: 'social', teacher: 'أ. محمد محمود' },
          { id: 'p-2c-mon-4', periodNum: 4, time: '10:35 - 11:25', subjectId: 'english', teacher: 'Ms. Sarah' },
          { id: 'p-2c-mon-5', periodNum: 5, time: '11:25 - 12:15', subjectId: 'science', teacher: 'Ms. Mona' },
          { id: 'p-2c-mon-6', periodNum: 6, time: '12:15 - 13:05', subjectId: 'art', teacher: 'Ms. Nour' },
          { id: 'p-2c-mon-7', periodNum: 7, time: '13:25 - 14:15', subjectId: 'french', teacher: 'Mme. Claire' },
          { id: 'p-2c-mon-8', periodNum: 8, time: '14:15 - 15:05', subjectId: 'math', teacher: 'Mr. Ahmed' }

        ]
      },
      {
        dayNameAr: 'الثلاثاء',
        dayNameEn: 'Tuesday',
        periods: [
          { id: 'p-2c-tue-1', periodNum: 1, time: '07:45 - 08:35', subjectId: 'pe', teacher: 'Coach Yasser' },
          { id: 'p-2c-tue-2', periodNum: 2, time: '08:35 - 09:25', subjectId: 'arabic', teacher: 'أ. فاطمة' },
          { id: 'p-2c-tue-3', periodNum: 3, time: '09:45 - 10:35', subjectId: 'science', teacher: 'Ms. Mona' },
          { id: 'p-2c-tue-4', periodNum: 4, time: '10:35 - 11:25', subjectId: 'math', teacher: 'Mr. Ahmed' },
          { id: 'p-2c-tue-5', periodNum: 5, time: '11:25 - 12:15', subjectId: 'ethics', teacher: 'أ. فاطمة' },
          { id: 'p-2c-tue-6', periodNum: 6, time: '12:15 - 13:05', subjectId: 'ict', teacher: 'Eng. Tamer' },
          { id: 'p-2c-tue-7', periodNum: 7, time: '13:25 - 14:15', subjectId: 'english', teacher: 'Ms. Sarah' },
          { id: 'p-2c-tue-8', periodNum: 8, time: '14:15 - 15:05', subjectId: 'english', teacher: 'Ms. Sarah' }

        ]
      },
      {
        dayNameAr: 'الأربعاء',
        dayNameEn: 'Wednesday',
        periods: [
          { id: 'p-2c-wed-1', periodNum: 1, time: '07:45 - 08:35', subjectId: 'english', teacher: 'Ms. Sarah' },
          { id: 'p-2c-wed-2', periodNum: 2, time: '08:35 - 09:25', subjectId: 'english', teacher: 'Ms. Sarah' },
          { id: 'p-2c-wed-3', periodNum: 3, time: '09:45 - 10:35', subjectId: 'french', teacher: 'Mme. Claire' },
          { id: 'p-2c-wed-4', periodNum: 4, time: '10:35 - 11:25', subjectId: 'social', teacher: 'أ. محمد محمود' },
          { id: 'p-2c-wed-5', periodNum: 5, time: '11:25 - 12:15', subjectId: 'music', teacher: 'Music Teacher' },
          { id: 'p-2c-wed-6', periodNum: 6, time: '12:15 - 13:05', subjectId: 'arabic', teacher: 'أ. فاطمة' },
          { id: 'p-2c-wed-7', periodNum: 7, time: '13:25 - 14:15', subjectId: 'math', teacher: 'Mr. Ahmed' },
          { id: 'p-2c-wed-8', periodNum: 8, time: '14:15 - 15:05', subjectId: 'music', teacher: 'Music Teacher' }

        ]
      },
      {
        dayNameAr: 'الخميس',
        dayNameEn: 'Thursday',
        periods: [
          { id: 'p-2c-thu-1', periodNum: 1, time: '07:45 - 08:35', subjectId: 'ict', teacher: 'Eng. Tamer' },
          { id: 'p-2c-thu-2', periodNum: 2, time: '08:35 - 09:25', subjectId: 'science', teacher: 'Ms. Mona' },
          { id: 'p-2c-thu-3', periodNum: 3, time: '09:45 - 10:35', subjectId: 'ethics', teacher: 'أ. فاطمة' },
          { id: 'p-2c-thu-4', periodNum: 4, time: '10:35 - 11:25', subjectId: 'english', teacher: 'Ms. Sarah' },
          { id: 'p-2c-thu-5', periodNum: 5, time: '11:25 - 12:15', subjectId: 'english', teacher: 'Ms. Sarah' },
          { id: 'p-2c-thu-6', periodNum: 6, time: '12:15 - 13:05', subjectId: 'math', teacher: 'Mr. Ahmed' },
          { id: 'p-2c-thu-7', periodNum: 7, time: '13:25 - 14:15', subjectId: 'arabic', teacher: 'أ. فاطمة' },
          { id: 'p-2c-thu-8', periodNum: 8, time: '14:15 - 15:05', subjectId: 'art', teacher: 'Ms. Nour' }

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
  // ===================== BLOCK 1 SHEETS =====================
  {
    id: 'mat-b1-arab',
    title: 'شيت اللغة العربية',
    subjectId: 'arabic',
    classId: 'all',
    blockId: 'block1',
    weekId: 'week2',
    fileType: 'pdf',
    fileName: 'Arabic_Sheet_Grade2_Block1.pdf',
    fileSize: '1.8 MB',
    uploadDate: '2026-09-08',
    uploadedBy: 'أ. فاطمة (معلمة أولى لغة عربية)',
    description: 'شيت مادة اللغة العربية لبلوك 1',
    previewSummary: `مدارس النيل المصرية الدولية - فرع المنيا
قسم اللغة العربية - الصف الثاني الابتدائي (Grade 2)
شيت تدريبات وتطبيقات: بلوك 1 (Block 1 Sheet)

المحور الأول: من أكون؟ | الدرس: قصة "أنا أستطيع"
اسم الطالب: ....................................... الفصل: 2 ( ... )

أولاً: اقرأ الفقرة ثم أجب:
"في فناء المدرسة وقف المعلم ليختار من التلاميذ فريقاً لكرة القدم. اختار المعلم التلميذ آدم. لكن آدم قال: أعتذر يا معلمي، لا أحب أن أكون سبباً في الخسارة."
1. استخرج من الفقرة:
   - كلمة بها مد بالألف: (................)
   - كلمة بها لام قمرية: (................)
   - كلمة بها تنوين بالكسر: (................)
2. لماذا اعتذر آدم للمعلم؟
   ................................................................................................

ثانياً: ميز بين التاء المربوطة (ـة / ة) والتاء المفتوحة (ت) والهاء (ـه / ه):
ضع كل كلمة في مكانها المناسب بالجدول:
(مدرسة - صوت - مياه - بيت - زهرة - وجه - حديقة - زيت)

ثالثاً: رتب الكلمات لتكون جملة مفيدة:
(ماهر - في - آدم - السلة - كرة - لاعب)
--> ................................................................................................

ختم واعتماد قسم اللغة العربية - فرع المنيا`
  },
  {
    id: 'mat-b1-math',
    title: 'Math Worksheet',
    subjectId: 'math',
    classId: 'all',
    blockId: 'block1',
    weekId: 'week2',
    fileType: 'pdf',
    fileName: 'Math_Sheet_Grade2_Block1.pdf',
    fileSize: '2.4 MB',
    uploadDate: '2026-09-08',
    uploadedBy: 'Mr. Ahmed (Math Coordinator)',
    description: 'شيت مادة الرياضيات لبلوك 1',
    previewSummary: `Nile Egyptian Schools - Minya Branch
Department of Mathematics - Grade 2 (Classes 2A, 2B, 2C)
Official Worksheet: Block 1 Practice Sheet

Student Name: __________________________ Class: 2 [    ]
Topic: 2-Digit Addition with Regrouping (Tens & Ones)

★ Section 1: Calculate the following with regrouping:
  1)   37 + 25 = [ ____ ]    (Think: 7 + 5 = 12 -> 2 in ones, 1 to tens!)
  2)   48 + 36 = [ ____ ]
  3)   59 + 17 = [ ____ ]
  4)   64 + 28 = [ ____ ]
  5)   73 + 19 = [ ____ ]

★ Section 2: Place Value Models
Color the base-ten flats (10s) blue and cubes (1s) green to represent 54 + 28.

★ Section 3: Word Problems (Critical Thinking)
Farida collected 38 Nile lotus flowers. Her brother Youssef gave her 27 more flowers.
How many flowers does Farida have altogether?
Number sentence: ______________________________________
Final Answer: [ ________ ] lotus flowers.

Teacher Signature: Mr. Ahmed & Math Dept - Nile Egyptian Schools Minya`
  },
  {
    id: 'mat-b1-eng',
    title: 'English Worksheet',
    subjectId: 'english',
    classId: 'all',
    blockId: 'block1',
    weekId: 'week2',
    fileType: 'pdf',
    fileName: 'English_Sheet_Grade2_Block1.pdf',
    fileSize: '2.1 MB',
    uploadDate: '2026-09-08',
    uploadedBy: 'Ms. Sarah (Head of English)',
    description: 'شيت مادة اللغة الإنجليزية لبلوك 1',
    previewSummary: `Nile Egyptian Schools - Minya Branch
Department of English - Grade 2 (2A, 2B, 2C)
Block 1 Worksheet: Phonics & Reading Comprehension

Student Name: _________________________ Date: ________________

★ Part 1: Phonics Detective (The Long 'a' sound)
Words with [ai] or [ay] make the long 'a' sound!
Circle only the words with the long 'a' sound:
[  train  •  cat  •  rain  •  play  •  man  •  day  •  wait  •  hat  ]

★ Part 2: Community Helpers & Tools
Fill in the blanks with: [ Firefighter / Doctor / Teacher / Policeman ]
1. The ____________ helps us stay safe and directs traffic.
2. The ____________ uses a stethoscope to listen to our heartbeat.
3. The ____________ puts out fires using a big water hose.
4. The ____________ teaches us to read, write, and explore in school.

★ Part 3: Short Story Comprehension
"Samy went to the Minya Riverbank with his family. He saw birds flying over the Nile and waved at the friendly ferry boat captain."
Question: Where did Samy go?
Answer: ____________________________________________________

Grade 2 English Dept - NES Minya Approved`
  },
  {
    id: 'mat-b1-sci',
    title: 'Science Worksheet',
    subjectId: 'science',
    classId: 'all',
    blockId: 'block1',
    weekId: 'week2',
    fileType: 'pdf',
    fileName: 'Science_Sheet_Grade2_Block1.pdf',
    fileSize: '2.8 MB',
    uploadDate: '2026-09-07',
    uploadedBy: 'Ms. Mona (Science Teacher)',
    description: 'شيت مادة العلوم والساينس لبلوك 1',
    previewSummary: `Nile Egyptian Schools - Minya Branch
Cambridge Primary Science - Grade 2
Block 1 Worksheet: Plant Structures & Habitats

Student Name: __________________________ Class: 2 [    ]

★ Part 1: Plant Anatomy
Label the diagram with the following words:
[  Roots  •  Stem  •  Leaves  •  Flower  ]
1. Which part anchors the plant in the soil? [ ________________ ]
2. Which part absorbs sunlight to make plant food? [ ________________ ]
3. Which part transports water up to the leaves? [ ________________ ]

★ Part 2: The Celery Water Lab Observation
We placed a celery stalk in water colored with red food dye:
- After 2 hours: Red dots appeared inside the celery stem.
- After 24 hours: The leaves turned light red!
Conclusion: The stem contains tiny tubes (xylem) that carry water upwards against gravity.

Science Department - Nile Egyptian Schools Minya`
  },
  {
    id: 'mat-b1-soc',
    title: 'شيت الدراسات الاجتماعية',
    subjectId: 'social',
    classId: 'all',
    blockId: 'block1',
    weekId: 'week2',
    fileType: 'pdf',
    fileName: 'Social_Studies_Sheet_Grade2_Block1.pdf',
    fileSize: '1.6 MB',
    uploadDate: '2026-09-07',
    uploadedBy: 'أ. محمد محمود (معلم الدراسات)',
    description: 'شيت مادة الدراسات الاجتماعية لبلوك 1',
    previewSummary: `مدارس النيل المصرية الدولية - فرع المنيا
مادة الدراسات الاجتماعية - الصف الثاني الابتدائي
شيت تدريبات بلوك 1: محافظتي عروس الصعيد

اسم الطالب: ....................................... الفصل: 2 ( ... )

السؤال الأول: ضع علامة (✓) أو (✗):
1. تقع محافظة المنيا على ضفاف نهر النيل في صعيد مصر. (   )
2. البيئة في المنيا تشمل أراضي زراعية خصبة ومناطق أثرية هامة. (   )
3. يمر نهر النيل بجوار مدرستنا في محافظة المنيا. (   )

السؤال الثاني: اكتب تحت كل صورة المعلم المناسب:
(كورنيش النيل بالمنيا - كوبري المنيا العلوي - تل العمارنة)

السؤال الثالث: نشاط تلوين:
لون مجرى نهر النيل باللون الأزرق، والأراضي الزراعية باللون الأخضر، وحدد موقع مدينتك الجميلة المنيا.`
  },
  {
    id: 'mat-b1-ict',
    title: 'ICT Worksheet',
    subjectId: 'ict',
    classId: 'all',
    blockId: 'block1',
    weekId: 'week2',
    fileType: 'pdf',
    fileName: 'ICT_Sheet_Grade2_Block1.pdf',
    fileSize: '1.3 MB',
    uploadDate: '2026-09-06',
    uploadedBy: 'Eng. Tamer (ICT Dept)',
    description: 'شيت مادة تكنولوجيا المعلومات والكمبيوتر لبلوك 1',
    previewSummary: `Nile Egyptian Schools - Minya Branch
Department of Information & Communication Technology (ICT)
Block 1 Worksheet: Computer Hardware Basics

Student Name: __________________________ Class: 2 [    ]

★ Exercise 1: Input vs. Output Devices
Classify each item as [ INPUT ] or [ OUTPUT ]:
1. Keyboard: [ ________________ ]
2. Computer Screen (Monitor): [ ________________ ]
3. Mouse: [ ________________ ]
4. Color Printer: [ ________________ ]

★ Exercise 2: Healthy Screen Habits
Draw a smiley face next to the good habits:
(  ) Sitting with a straight back and screen at eye level.
(  ) Taking a 5-minute break every 20 minutes.
(  ) Touching computer cables with wet hands.

NES Minya ICT Lab Approved`
  },
  {
    id: 'mat-b1-fre',
    title: 'Fiche de Français',
    subjectId: 'french',
    classId: 'all',
    blockId: 'block1',
    weekId: 'week2',
    fileType: 'pdf',
    fileName: 'French_Sheet_Grade2_Block1.pdf',
    fileSize: '1.1 MB',
    uploadDate: '2026-09-06',
    uploadedBy: 'Mme. Claire (Professeur de français)',
    description: 'شيت مادة اللغة الفرنسية لبلوك 1',
    previewSummary: `Écoles Égyptiennes du Nil - Branche de Minya
Département de Français - Grade 2 (2A, 2B, 2C)
Fiche d'activités : Bloc 1

Nom de l'élève : _______________________ Classe : 2 [    ]

★ Activité 1 : Relie les salutations avec la bonne image :
1. Bonjour !               --> [ Le soleil du matin ]
2. Bonsoir !               --> [ La lune et les étoiles ]
3. Au revoir !             --> [ La main qui salue ]

★ Activité 2 : Ma trousse scolaire (Écris le mot correspondant) :
[  un stylo  •  un crayon  •  une règle  •  une gomme  ]
1. Pour effacer : ______________________
2. Pour tracer une ligne droite : ______________________
3. Pour écrire avec de l'encre bleue : ______________________

Département de français - NES Minya`
  }
];
