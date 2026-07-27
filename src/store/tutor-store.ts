import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Student {
  id: string;
  name: string;
  grade: string;
  subject: string;
  nextLesson?: string;
  pendingHomeworks: number;
  avatarUrl: string;
  pricePerLesson: number;
}

export interface Lesson {
  id: string;
  title: string;
  start: Date;
  end: Date;
  studentId: string;
  meetLink: string;
}

export interface Homework {
  id: string;
  title: string;
  description: string;
  studentId: string;
  status: 'pending' | 'completed';
  dueDate: Date;
}

export interface ChatMessage {
  id: string;
  studentId: string;
  senderId: string; // 'tutor' or studentId
  text: string;
  timestamp: Date;
}

export interface TutorProfile {
  name: string;
  email: string;
  password?: string; // Только для мока!
}

type Role = 'tutor' | 'student' | null;

interface TutorStore {
  students: Student[];
  schedule: Lesson[];
  homeworks: Homework[];
  messages: ChatMessage[];
  
  tutorProfile: TutorProfile | null;
  activeRole: Role;
  activeUserId: string | null;
  
  updateTutorProfile: (profile: TutorProfile) => void;
  setActiveUser: (role: Role, id?: string) => void;
  logout: () => void;
  
  addStudent: (student: Omit<Student, 'id'>) => void;
  deleteStudent: (id: string) => void;
  
  addLesson: (lesson: Omit<Lesson, 'id'>) => void;
  deleteLesson: (id: string) => void;
  
  addHomework: (homework: Omit<Homework, 'id' | 'status'>) => void;
  completeHomework: (id: string) => void;
  deleteHomework: (id: string) => void;
  
  sendMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
}

const initialStudents: Student[] = [];
const initialSchedule: Lesson[] = [];
const initialHomeworks: Homework[] = [];
const initialMessages: ChatMessage[] = [];

export const useTutorStore = create<TutorStore>()(
  persist(
    (set) => ({
      students: initialStudents,
      schedule: initialSchedule,
      homeworks: initialHomeworks,
      messages: initialMessages,
      
      tutorProfile: null,
      activeRole: null,
      activeUserId: null,
      
      updateTutorProfile: (profile) => set({ tutorProfile: profile }),
      setActiveUser: (role, id = null) => set({ activeRole: role, activeUserId: id }),
      logout: () => set({ activeRole: null, activeUserId: null }),
      
      addStudent: (student) => set((state) => ({
        students: [...state.students, { ...student, id: Math.random().toString(36).substring(7) }]
      })),
      
      deleteStudent: (id) => set((state) => ({
        students: state.students.filter(s => s.id !== id),
        schedule: state.schedule.filter(l => l.studentId !== id),
        homeworks: state.homeworks.filter(h => h.studentId !== id)
      })),
      
      addLesson: (lesson) => set((state) => ({
        schedule: [...state.schedule, { ...lesson, id: Math.random().toString(36).substring(7) }]
      })),
      
      deleteLesson: (id) => set((state) => ({
        schedule: state.schedule.filter(l => l.id !== id)
      })),
      
      addHomework: (homework) => set((state) => {
        const newHomework = { ...homework, id: Math.random().toString(36).substring(7), status: 'pending' as const };
        return {
          homeworks: [...state.homeworks, newHomework],
          students: state.students.map(s => 
            s.id === homework.studentId ? { ...s, pendingHomeworks: s.pendingHomeworks + 1 } : s
          )
        };
      }),
      
      completeHomework: (id) => set((state) => {
        const hw = state.homeworks.find(h => h.id === id);
        if (!hw || hw.status === 'completed') return state;
        
        return {
          homeworks: state.homeworks.map(h => h.id === id ? { ...h, status: 'completed' } : h),
          students: state.students.map(s => 
            s.id === hw.studentId && s.pendingHomeworks > 0 ? { ...s, pendingHomeworks: s.pendingHomeworks - 1 } : s
          )
        };
      }),

      deleteHomework: (id) => set((state) => {
        const hw = state.homeworks.find(h => h.id === id);
        if (!hw) return state;
        
        return {
          homeworks: state.homeworks.filter(h => h.id !== id),
          students: hw.status === 'pending' 
            ? state.students.map(s => s.id === hw.studentId && s.pendingHomeworks > 0 ? { ...s, pendingHomeworks: s.pendingHomeworks - 1 } : s)
            : state.students
        };
      }),
      
      sendMessage: (message) => set((state) => ({
        messages: [...state.messages, { ...message, id: Math.random().toString(36).substring(7), timestamp: new Date() }]
      })),
    }),
    {
      name: 'tutoring-storage',
    }
  )
);
