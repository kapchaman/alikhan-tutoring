"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTutorStore } from "@/store/tutor-store";
import { format, addDays, startOfWeek } from "date-fns";
import { ru } from "date-fns/locale";
import { Video, Calendar as CalendarIcon, Users, Plus, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function SchedulePage() {
  const schedule = useTutorStore(state => state.schedule);
  const students = useTutorStore(state => state.students);
  const addLesson = useTutorStore(state => state.addLesson);
  const deleteLesson = useTutorStore(state => state.deleteLesson);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date('2026-07-27T00:00:00+05:00'));
  
  const [newLesson, setNewLesson] = useState({
    studentId: "",
    date: format(new Date(), 'yyyy-MM-dd'),
    startTime: "15:00",
    endTime: "16:00",
    meetLink: "",
    isRecurring: false,
    weeksCount: "4",
  });

  const handleAddLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLesson.studentId || !newLesson.date) return;

    const student = students.find(s => s.id === newLesson.studentId);
    if (!student) return;

    const start = new Date(`${newLesson.date}T${newLesson.startTime}:00`);
    const end = new Date(`${newLesson.date}T${newLesson.endTime}:00`);
    const meetLink = newLesson.meetLink || `https://meet.google.com/${Math.random().toString(36).substring(2, 5)}-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 5)}`;

    if (newLesson.isRecurring) {
      const weeks = parseInt(newLesson.weeksCount) || 4;
      for (let i = 0; i < weeks; i++) {
        addLesson({
          title: `${student.subject} - ${student.name}`,
          start: addDays(start, i * 7),
          end: addDays(end, i * 7),
          studentId: student.id,
          meetLink,
        });
      }
    } else {
      addLesson({
        title: `${student.subject} - ${student.name}`,
        start,
        end,
        studentId: student.id,
        meetLink,
      });
    }
    
    setIsAddModalOpen(false);
    setNewLesson({ ...newLesson, studentId: "", isRecurring: false, weeksCount: "4" });
  };

  const nextWeek = () => setCurrentWeekStart(addDays(currentWeekStart, 7));
  const prevWeek = () => setCurrentWeekStart(addDays(currentWeekStart, -7));

  // Генерируем дни недели (Пн-Вс)
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(currentWeekStart, i));
  // Рабочие часы с 9:00 до 21:00
  const hours = Array.from({ length: 13 }).map((_, i) => i + 9);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Расписание</h1>
          <p className="text-muted-foreground">
            Управляйте своими уроками и свободным временем.
          </p>
        </div>

        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger className={buttonVariants({ variant: "default" })}>
            <Plus className="mr-2 h-4 w-4" />
            Добавить урок
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleAddLesson}>
              <DialogHeader>
                <DialogTitle>Новый урок</DialogTitle>
                <DialogDescription>
                  Запланируйте новый урок с учеником.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="student" className="text-right">
                    Ученик
                  </Label>
                  <Select value={newLesson.studentId} onValueChange={(v) => setNewLesson({...newLesson, studentId: v || ""})}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Выберите ученика" />
                    </SelectTrigger>
                    <SelectContent>
                      {students.map(s => (
                        <SelectItem key={s.id} value={s.id}>{s.name} ({s.subject})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">
                    Дата
                  </Label>
                  <Input 
                    id="date" 
                    type="date"
                    value={newLesson.date}
                    onChange={e => setNewLesson({...newLesson, date: e.target.value})}
                    className="col-span-3" 
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="startTime" className="text-right">
                    Время
                  </Label>
                  <div className="col-span-3 flex items-center gap-2">
                    <Input 
                      id="startTime" 
                      type="time"
                      value={newLesson.startTime}
                      onChange={e => setNewLesson({...newLesson, startTime: e.target.value})}
                      required
                    />
                    <span>-</span>
                    <Input 
                      id="endTime" 
                      type="time"
                      value={newLesson.endTime}
                      onChange={e => setNewLesson({...newLesson, endTime: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="meetLink" className="text-right">
                    Google Meet
                  </Label>
                  <Input 
                    id="meetLink" 
                    type="url"
                    value={newLesson.meetLink}
                    onChange={e => setNewLesson({...newLesson, meetLink: e.target.value})}
                    placeholder="https://meet.google.com/..."
                    className="col-span-3" 
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4 pt-2 border-t">
                  <div className="col-span-4 flex items-center space-x-2">
                    <input 
                      type="checkbox"
                      id="recurring" 
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      checked={newLesson.isRecurring}
                      onChange={(e) => setNewLesson({...newLesson, isRecurring: e.target.checked})}
                    />
                    <label
                      htmlFor="recurring"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Повторять еженедельно
                    </label>
                  </div>
                </div>

                {newLesson.isRecurring && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="weeksCount" className="text-right text-sm">
                      Длительность
                    </Label>
                    <Select value={newLesson.weeksCount} onValueChange={(v) => setNewLesson({...newLesson, weeksCount: v || "4"})}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="4">4 недели (1 месяц)</SelectItem>
                        <SelectItem value="8">8 недель (2 месяца)</SelectItem>
                        <SelectItem value="12">12 недель (3 месяца)</SelectItem>
                        <SelectItem value="24">24 недели (Полгода)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button type="submit">Добавить</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
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
                    {schedule
                      .filter(lesson => new Date(lesson.start).getDate() === day.getDate() && new Date(lesson.start).getMonth() === day.getMonth())
                      .map(lesson => {
                        const lessonStart = new Date(lesson.start);
                        const lessonEnd = new Date(lesson.end);
                        const startHour = lessonStart.getHours() + lessonStart.getMinutes() / 60;
                        const endHour = lessonEnd.getHours() + lessonEnd.getMinutes() / 60;
                        const duration = endHour - startHour;
                        
                        // Если урок выходит за рамки сетки (до 9 или после 21), можно скрыть или ограничить, но для простоты рендерим:
                        if (startHour < 9 || startHour > 21) return null;

                        const top = (startHour - 9) * 4; // 1 час = 4rem (h-16 = 64px)
                        const height = duration * 4;

                        return (
                          <div 
                            key={lesson.id} 
                            className="absolute left-1 right-1 rounded-md border border-primary/20 bg-primary/10 p-2 text-xs shadow-sm group overflow-hidden hover:z-10 hover:shadow-md transition-all"
                            style={{ top: `${top}rem`, height: `${height}rem` }}
                          >
                            <div className="flex justify-between items-start">
                              <span className="font-semibold text-primary truncate">
                                {format(lessonStart, "HH:mm")} - {format(lessonEnd, "HH:mm")}
                              </span>
                              <button 
                                onClick={() => deleteLesson(lesson.id)}
                                className="opacity-0 group-hover:opacity-100 text-destructive hover:bg-destructive/10 rounded p-0.5"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                            <div className="font-medium mt-1 truncate">{lesson.title.split(' - ')[0]}</div>
                            <div className="text-muted-foreground truncate">{lesson.title.split(' - ')[1]}</div>
                            <a 
                              href={lesson.meetLink} 
                              target="_blank" 
                              rel="noreferrer"
                              className="mt-2 inline-flex items-center text-[10px] text-blue-600 hover:underline"
                            >
                              <Video className="mr-1 h-3 w-3" /> Meet
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
