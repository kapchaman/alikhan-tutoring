"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, BookOpen, Clock, TrendingUp, Calendar as CalendarIcon, Video } from "lucide-react";
import { useTutorStore } from "@/store/tutor-store";
import { format, isThisWeek, startOfWeek, endOfWeek } from "date-fns";
import { ru } from "date-fns/locale";

export default function DashboardPage() {
  const students = useTutorStore(state => state.students);
  const schedule = useTutorStore(state => state.schedule);
  const homeworks = useTutorStore(state => state.homeworks);

  // Находим ближайший урок (который в будущем)
  const now = new Date();
  const nextLesson = schedule
    .filter(lesson => new Date(lesson.start) > now)
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())[0];
  
  // Расчет реальной статистики
  const totalStudents = students.length;
  const pendingHomeworksCount = homeworks?.filter(h => h.status === 'pending').length || 0;
  
  const lessonsThisWeek = schedule.filter(lesson => isThisWeek(new Date(lesson.start), { weekStartsOn: 1 }));
  const lessonsToday = schedule.filter(lesson => new Date(lesson.start).toDateString() === now.toDateString()).length;
  
  // Расчет дохода за неделю
  let weeklyIncome = 0;
  lessonsThisWeek.forEach(lesson => {
    const student = students.find(s => s.id === lesson.studentId);
    if (student) {
      weeklyIncome += student.pricePerLesson || 0;
    }
  });

  const weekStart = format(startOfWeek(now, { weekStartsOn: 1 }), "d MMM", { locale: ru });
  const weekEnd = format(endOfWeek(now, { weekStartsOn: 1 }), "d MMM", { locale: ru });
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Сводка на сегодня</h1>
        <p className="text-muted-foreground">
          Добро пожаловать обратно! Вот что вас ждет сегодня.
        </p>
      </div>

      {/* Таймер до следующего урока */}
      {nextLesson && (
        <Card className="bg-gradient-to-br from-primary/90 to-primary/70 text-primary-foreground border-none shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-xl font-medium">
              <Clock className="h-5 w-5" />
              Следующий урок
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h3 className="text-3xl font-bold">{nextLesson.title.split(' - ')[1]}</h3>
                <p className="text-primary-foreground/80 mt-1 flex items-center gap-1.5">
                  <BookOpen className="h-4 w-4" />
                  {nextLesson.title.split(' - ')[0]}
                </p>
                <div className="flex items-center gap-2 mt-4">
                  <Badge variant="secondary" className="bg-background/20 hover:bg-background/30 text-primary-foreground border-none">
                    {format(nextLesson.start, "HH:mm")} - {format(nextLesson.end, "HH:mm")}
                  </Badge>
                  <span className="text-sm opacity-90">
                    {format(nextLesson.start, "d MMMM, EEEE", { locale: ru })}
                  </span>
                </div>
              </div>
              <a 
                href={nextLesson.meetLink} 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-background text-primary shadow hover:bg-background/90 h-10 px-4 py-2"
              >
                <Video className="mr-2 h-4 w-4" />
                Google Meet
              </a>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Статистика */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего учеников</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">Активных учеников</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Уроков на неделе</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lessonsThisWeek.length}</div>
            <p className="text-xs text-muted-foreground">{lessonsToday} урока(ов) сегодня</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Задания на проверку</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingHomeworksCount}</div>
            <p className="text-xs text-muted-foreground">Требуют вашего внимания</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Доход (За неделю)</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{weeklyIncome.toLocaleString('ru-RU')} ₸</div>
            <p className="text-xs text-muted-foreground">{weekStart} - {weekEnd}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Предстоящие уроки */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Предстоящие уроки</CardTitle>
            <CardDescription>Расписание на ближайшие дни.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {schedule.map((lesson) => (
                <div key={lesson.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 flex-col items-center justify-center rounded bg-primary/10 text-primary">
                      <span className="text-xs font-semibold">{format(new Date(lesson.start), "d")}</span>
                      <span className="text-[10px] uppercase">{format(new Date(lesson.start), "MMM", { locale: ru })}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium leading-none">{lesson.title}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {format(new Date(lesson.start), "HH:mm")} - {format(new Date(lesson.end), "HH:mm")}
                      </p>
                    </div>
                  </div>
                  <a 
                    href={lesson.meetLink} 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
                  >
                    <Video className="mr-2 h-3.5 w-3.5" />
                    Meet
                  </a>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Ученики требующие внимания */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Требуют внимания</CardTitle>
            <CardDescription>Несданные ДЗ и пропуски.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {students.filter(s => s.pendingHomeworks > 0).map(student => (
                <div key={student.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={student.avatarUrl} alt={student.name} />
                      <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium leading-none">{student.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{student.subject}</p>
                    </div>
                  </div>
                  <Badge variant="destructive">
                    {student.pendingHomeworks} ДЗ
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
