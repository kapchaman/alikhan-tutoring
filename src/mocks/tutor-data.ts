export const mockStudents = [
  {
    id: '1',
    name: 'Алексей Иванов',
    grade: '10 класс',
    subject: 'Математика',
    nextLesson: '2026-07-28T15:00:00+05:00',
    pendingHomeworks: 2,
    avatarUrl: 'https://i.pravatar.cc/150?u=1',
  },
  {
    id: '2',
    name: 'Мария Смирнова',
    grade: '11 класс',
    subject: 'Информатика',
    nextLesson: '2026-07-29T16:30:00+05:00',
    pendingHomeworks: 0,
    avatarUrl: 'https://i.pravatar.cc/150?u=2',
  },
  {
    id: '3',
    name: 'Иван Петров',
    grade: '9 класс',
    subject: 'Математика',
    nextLesson: '2026-07-28T18:00:00+05:00',
    pendingHomeworks: 1,
    avatarUrl: 'https://i.pravatar.cc/150?u=3',
  },
];

export const mockSchedule = [
  {
    id: '1',
    title: 'Математика - Алексей Иванов',
    start: new Date('2026-07-28T15:00:00+05:00'),
    end: new Date('2026-07-28T16:00:00+05:00'),
    studentId: '1',
    zoomLink: 'https://zoom.us/j/123456789',
  },
  {
    id: '2',
    title: 'Информатика - Мария Смирнова',
    start: new Date('2026-07-29T16:30:00+05:00'),
    end: new Date('2026-07-29T18:00:00+05:00'),
    studentId: '2',
    zoomLink: 'https://zoom.us/j/987654321',
  },
  {
    id: '3',
    title: 'Математика - Иван Петров',
    start: new Date('2026-07-28T18:00:00+05:00'),
    end: new Date('2026-07-28T19:00:00+05:00'),
    studentId: '3',
    zoomLink: 'https://zoom.us/j/111222333',
  },
];

export const mockStats = {
  totalStudents: 12,
  lessonsThisWeek: 15,
  pendingHomeworks: 8,
  revenueThisMonth: 125000,
};
