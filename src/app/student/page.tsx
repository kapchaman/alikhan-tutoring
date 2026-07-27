"use client";

import { useTutorStore } from "@/store/tutor-store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Video, Clock, CheckCircle2, AlertCircle, Calendar } from "lucide-react";
import { format, isAfter, isToday, isTomorrow } from "date-fns";
import { ru } from "date-fns/locale";
import Link from "next/link";

export default function StudentDashboard() {
  const activeUserId = useTutorStore(state => state.activeUserId);
  const students = useTutorStore(state => state.students);
  const schedule = useTutorStore(state => state.schedule);
  const homeworks = useTutorStore(state => state.homeworks);
  
  const student = students.find(s => s.id === activeUserId);
  if (!student) return null;

  // Мои уроки (в будущем)
  const myLessons = schedule
    .filter(l => l.studentId === student.id && isAfter(new Date(l.start), new Date()))
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
    
  const nextLesson = myLessons[0];

  // Мои ДЗ
  const pendingHomeworks = homeworks.filter(h => h.studentId === student.id && h.status === 'pending');

  const getDayText = (date: Date) => {
    if (isToday(date)) return "Сегодня";
    if (isTomorrow(date)) return "Завтра";
    return format(date, "d MMMM", { locale: ru });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Привет, {student.name.split(' ')[0]}!</h1>
        <p className="text-muted-foreground">
          Добро пожаловать в твой личный кабинет. Вот твои задачи на сегодня.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Карточка следующего урока */}
        <Card className="col-span-1 lg:col-span-2 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
            <Video className="w-32 h-32" />
          </div>
          <CardHeader>
            <CardTitle className="text-primary flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Твой следующий урок
            </CardTitle>
          </CardHeader>
          <CardContent>
            {nextLesson ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-2xl font-bold">{getDayText(new Date(nextLesson.start))}</h3>
                  <p className="text-lg text-muted-foreground">
                    в {format(new Date(nextLesson.start), "HH:mm")} ({student.subject})
                  </p>
                </div>
                <div className="pt-2">
                  <a 
                    href={nextLesson.meetLink} 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 py-2"
                  >
                    <Video className="mr-2 h-4 w-4" />
                    Подключиться к Google Meet
                  </a>
                </div>
              </div>
            ) : (
              <div className="py-4">
                <p className="text-muted-foreground">Пока нет запланированных уроков.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Статистика ДЗ */}
        <Card>
          <CardHeader>
            <CardTitle>Домашние задания</CardTitle>
            <CardDescription>Твой прогресс</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
                <div className="flex items-center gap-2 text-amber-700">
                  <AlertCircle className="h-5 w-5" />
                  <span className="font-medium">На проверку</span>
                </div>
                <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
                  {pendingHomeworks.length}
                </Badge>
              </div>
              
              <Link href="/student/homeworks" className={buttonVariants({ variant: "outline", className: "w-full" })}>
                Перейти к заданиям
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Список предстоящих уроков */}
      {myLessons.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Остальные уроки</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myLessons.slice(1, 4).map(lesson => (
                <div key={lesson.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="bg-muted p-2 rounded-md">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">{getDayText(new Date(lesson.start))}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(lesson.start), "HH:mm")} - {format(new Date(lesson.end), "HH:mm")}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary">{student.subject}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
