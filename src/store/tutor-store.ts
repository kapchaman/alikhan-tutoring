import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabase/client';

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
  senderId: string;
  text: string;
  timestamp: Date;
}

export interface TutorProfile {
  name: string;
  email: string;
  password?: string;
}

type Role = 'tutor' | 'student' | null;

interface TutorStore {
  isLoaded: boolean;
  students: Student[];
  schedule: Lesson[];
  homeworks: Homework[];
  messages: ChatMessage[];
  
  tutorProfile: TutorProfile | null;
  activeRole: Role;
  activeUserId: string | null;
  
  fetchData: () => Promise<void>;
  fetchMessages: () => Promise<void>;
  updateTutorProfile: (profile: TutorProfile) => Promise<void>;
  setActiveUser: (role: Role, id?: string) => void;
  logout: () => void;
  
  addStudent: (student: Omit<Student, 'id' | 'pendingHomeworks'>) => Promise<void>;
  deleteStudent: (id: string) => Promise<void>;
  
  addLesson: (lesson: Omit<Lesson, 'id'>) => Promise<void>;
  deleteLesson: (id: string) => Promise<void>;
  
  addHomework: (homework: Omit<Homework, 'id' | 'status'>) => Promise<void>;
  completeHomework: (id: string) => Promise<void>;
  deleteHomework: (id: string) => Promise<void>;
  
  sendMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => Promise<void>;
}

export const useTutorStore = create<TutorStore>()(
  persist(
    (set, get) => ({
      isLoaded: false,
      students: [],
      schedule: [],
      homeworks: [],
      messages: [],
      
      tutorProfile: null,
      activeRole: null,
      activeUserId: null,
      
      fetchData: async () => {
        try {
          const [studentsRes, scheduleRes, homeworksRes, profilesRes, messagesRes] = await Promise.all([
            supabase.from('students').select('*'),
            supabase.from('lessons').select('*'),
            supabase.from('homeworks').select('*'),
            supabase.from('tutor_profiles').select('*'),
            supabase.from('messages').select('*')
          ]);

          const dbStudents = studentsRes.data || [];
          const dbSchedule = scheduleRes.data || [];
          const dbHomeworks = homeworksRes.data || [];
          const dbProfiles = profilesRes.data || [];
          const dbMessages = messagesRes.data || [];

          const homeworks: Homework[] = dbHomeworks.map((h: any) => ({
            id: h.id,
            title: h.title,
            description: h.description || '',
            studentId: h.student_id,
            status: h.status,
            dueDate: h.due_date ? new Date(h.due_date) : new Date()
          }));

          const students: Student[] = dbStudents.map((s: any) => ({
            id: s.id,
            name: s.name,
            grade: s.grade || '',
            subject: s.subject,
            pricePerLesson: Number(s.price_per_lesson),
            avatarUrl: s.avatar_url || '',
            pendingHomeworks: homeworks.filter(h => h.studentId === s.id && h.status === 'pending').length
          }));

          const schedule: Lesson[] = dbSchedule.map((l: any) => ({
            id: l.id,
            title: l.title,
            start: new Date(l.start_time),
            end: new Date(l.end_time),
            studentId: l.student_id,
            meetLink: l.meet_link || ''
          }));

          const profile = dbProfiles.length > 0 ? {
            name: dbProfiles[0].name,
            email: dbProfiles[0].email,
            password: dbProfiles[0].password
          } : null;

          const messages: ChatMessage[] = dbMessages.map((m: any) => ({
            id: m.id,
            studentId: m.student_id,
            senderId: m.sender_id,
            text: m.text,
            timestamp: new Date(m.timestamp)
          }));

          set({ students, schedule, homeworks, messages, tutorProfile: profile, isLoaded: true });
        } catch (e) {
          console.error(e);
        }
      },
      
      fetchMessages: async () => {
        try {
          const { data } = await supabase.from('messages').select('*');
          if (data) {
            const messages: ChatMessage[] = data.map((m: any) => ({
              id: m.id,
              studentId: m.student_id,
              senderId: m.sender_id,
              text: m.text,
              timestamp: new Date(m.timestamp)
            }));
            set({ messages });
          }
        } catch (e) {
          console.error(e);
        }
      },
      
      updateTutorProfile: async (profile) => {
        // Проверяем, есть ли уже профиль
        const { data } = await supabase.from('tutor_profiles').select('id').limit(1).single();
        if (data) {
          await supabase.from('tutor_profiles').update({
            name: profile.name,
            email: profile.email,
            password: profile.password
          }).eq('id', data.id);
        } else {
          await supabase.from('tutor_profiles').insert({
            name: profile.name,
            email: profile.email,
            password: profile.password
          });
        }
        set({ tutorProfile: profile });
      },
      
      setActiveUser: (role, id) => set({ activeRole: role, activeUserId: id ?? null }),
      logout: () => set({ activeRole: null, activeUserId: null }),
      
      addStudent: async (student) => {
        const { data, error } = await supabase.from('students').insert({
          name: student.name,
          grade: student.grade,
          subject: student.subject,
          price_per_lesson: student.pricePerLesson,
          avatar_url: student.avatarUrl
        }).select().single();
        
        if (data) {
          const newStudent = { ...student, id: data.id, pendingHomeworks: 0 };
          set((state) => ({ students: [...state.students, newStudent] }));
        }
      },
      
      deleteStudent: async (id) => {
        await supabase.from('students').delete().eq('id', id);
        set((state) => ({
          students: state.students.filter(s => s.id !== id),
          schedule: state.schedule.filter(l => l.studentId !== id),
          homeworks: state.homeworks.filter(h => h.studentId !== id)
        }));
      },
      
      addLesson: async (lesson) => {
        const { data } = await supabase.from('lessons').insert({
          title: lesson.title,
          start_time: lesson.start.toISOString(),
          end_time: lesson.end.toISOString(),
          student_id: lesson.studentId,
          meet_link: lesson.meetLink
        }).select().single();

        if (data) {
          set((state) => ({
            schedule: [...state.schedule, { ...lesson, id: data.id }]
          }));
        }
      },
      
      deleteLesson: async (id) => {
        await supabase.from('lessons').delete().eq('id', id);
        set((state) => ({
          schedule: state.schedule.filter(l => l.id !== id)
        }));
      },
      
      addHomework: async (homework) => {
        const { data } = await supabase.from('homeworks').insert({
          title: homework.title,
          description: homework.description,
          student_id: homework.studentId,
          status: 'pending',
          due_date: homework.dueDate ? homework.dueDate.toISOString() : null
        }).select().single();

        if (data) {
          const newHomework = { ...homework, id: data.id, status: 'pending' as const };
          set((state) => ({
            homeworks: [...state.homeworks, newHomework],
            students: state.students.map(s => 
              s.id === homework.studentId ? { ...s, pendingHomeworks: s.pendingHomeworks + 1 } : s
            )
          }));
        }
      },
      
      completeHomework: async (id) => {
        const hw = get().homeworks.find(h => h.id === id);
        if (!hw || hw.status === 'completed') return;
        
        await supabase.from('homeworks').update({ status: 'completed' }).eq('id', id);
        
        set((state) => ({
          homeworks: state.homeworks.map(h => h.id === id ? { ...h, status: 'completed' } : h),
          students: state.students.map(s => 
            s.id === hw.studentId && s.pendingHomeworks > 0 ? { ...s, pendingHomeworks: s.pendingHomeworks - 1 } : s
          )
        }));
      },

      deleteHomework: async (id) => {
        const hw = get().homeworks.find(h => h.id === id);
        if (!hw) return;
        
        await supabase.from('homeworks').delete().eq('id', id);
        
        set((state) => ({
          homeworks: state.homeworks.filter(h => h.id !== id),
          students: hw.status === 'pending' 
            ? state.students.map(s => s.id === hw.studentId && s.pendingHomeworks > 0 ? { ...s, pendingHomeworks: s.pendingHomeworks - 1 } : s)
            : state.students
        }));
      },
      
      sendMessage: async (message) => {
        const { data } = await supabase.from('messages').insert({
          student_id: message.studentId,
          sender_id: message.senderId,
          text: message.text
        }).select().single();
        
        if (data) {
          const newMessage: ChatMessage = {
            id: data.id,
            studentId: data.student_id,
            senderId: data.sender_id,
            text: data.text,
            timestamp: new Date(data.timestamp)
          };
          set((state) => ({
            messages: [...state.messages, newMessage]
          }));
        }
      },
    }),
    {
      name: 'tutoring-auth',
      partialize: (state) => ({ activeRole: state.activeRole, activeUserId: state.activeUserId }), // Сохраняем только сессию авторизации
    }
  )
);
