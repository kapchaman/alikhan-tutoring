"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTutorStore } from "@/store/tutor-store";
import { format, addDays, startOfWeek } from "date-fns";
import { ru } from "date-fns/locale";
import { Video, ChevronLeft, ChevronRight } from "lucide-react";

export default function StudentSchedulePage() {
  const activeUserId = useTutorStore(state => state.activeUserId);
  const schedule = useTutorStore(state => state.schedule);
  const students = useTutorStore(state => state.students);
  
  const student = students.find(s => s.id === activeUserId);
  const mySchedule = schedule.filter(s => s.studentId === activeUserId);

  const [currentWeekStart, setCurrentWeekStart] = useState<Date | null>(null);
  
  useEffect(() => {
    setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }));
  }, []);

  if (!student || !currentWeekStart) return null;

  const nextWeek = () => setCurrentWeekStart(prev => prev ? addDays(prev, 7) : new Date());
  const prevWeek = () => setCurrentWeekStart(prev => prev ? addDays(prev, -7) : new Date());

  // Генерируем дни недели (Пн-Вс)
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(currentWeekStart, i));
  // Рабочие часы с 9:00 до 21:00
  const hours = Array.from({ length: 13 }).map((_, i) => i + 9);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Мое расписание</h1>
        <p className="text-muted-foreground">
          Твои запланированные уроки на неделю.
        </p>
      </div>

      <Card>
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold">
              {format(currentWeekStart, "d MMMM", { locale: ru })} - {format(addDays(currentWeekStart, 6), "d MMMM yyyy", { locale: ru })}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={prevWeek}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={() => setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }))}>
              Сегодня
            </Button>
            <Button variant="outline" size="icon" onClick={nextWeek}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <CardContent className="p-0 overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Header row (Days) */}
            <div className="grid grid-cols-8 border-b bg-muted/20">
              <div className="p-3 border-r text-center text-sm font-medium text-muted-foreground">Время</div>
              {weekDays.map((day, i) => (
                <div key={i} className="p-3 border-r text-center">
                  <div className="text-xs uppercase text-muted-foreground font-semibold">{format(day, "EEE", { locale: ru })}</div>
                  <div className="text-xl font-bold mt-1">{format(day, "d")}</div>
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="relative h-[800px] overflow-y-auto">
              <div className="grid grid-cols-8 absolute inset-0">
                {/* Time column */}
                <div className="border-r bg-background">
                  {hours.map(hour => (
                    <div key={hour} className="h-16 border-b text-xs text-muted-foreground text-center pt-2">
                      {hour}:00
                    </div>
                  ))}
                </div>
                
                {/* Day columns */}
                {weekDays.map((day, dayIdx) => (
                  <div key={dayIdx} className="border-r relative">
                    {hours.map(hour => (
                      <div key={hour} className="h-16 border-b border-muted/50 border-dashed" />
                    ))}
                    
                    {/* Render lessons for this day */}
                    {mySchedule
                      .filter(lesson => new Date(lesson.start).getDate() === day.getDate() && new Date(lesson.start).getMonth() === day.getMonth())
                      .map(lesson => {
                        const lessonStart = new Date(lesson.start);
                        const lessonEnd = new Date(lesson.end);
                        const startHour = lessonStart.getHours() + lessonStart.getMinutes() / 60;
                        const endHour = lessonEnd.getHours() + lessonEnd.getMinutes() / 60;
                        const duration = endHour - startHour;
                        
                        if (startHour < 9 || startHour > 21) return null;

                        const top = (startHour - 9) * 4; 
                        const height = duration * 4;

                        return (
                          <div 
                            key={lesson.id} 
                            className="absolute left-1 right-1 rounded-md border border-primary/20 bg-primary/10 p-2 text-xs shadow-sm hover:z-10 hover:shadow-md transition-all"
                            style={{ top: `${top}rem`, height: `${height}rem` }}
                          >
                            <div className="font-semibold text-primary truncate">
                              {format(lessonStart, "HH:mm")} - {format(lessonEnd, "HH:mm")}
                            </div>
                            <div className="font-medium mt-1 truncate">{student.subject}</div>
                            
                            <a 
                              href={lesson.meetLink} 
                              target="_blank" 
                              rel="noreferrer"
                              className="mt-2 inline-flex w-full justify-center items-center rounded bg-primary/20 hover:bg-primary/30 px-2 py-1 text-primary transition-colors"
                            >
                              <Video className="mr-1 h-3 w-3" /> Войти
                            </a>
                          </div>
                        );
                      })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
