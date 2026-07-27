"use client";

import { useState } from "react";
import { useTutorStore, Homework } from "@/store/tutor-store";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { CheckCircle2, Clock, Trash2, Plus } from "lucide-react";

export default function HomeworksPage() {
  const homeworks = useTutorStore(state => state.homeworks);
  const students = useTutorStore(state => state.students);
  const addHomework = useTutorStore(state => state.addHomework);
  const completeHomework = useTutorStore(state => state.completeHomework);
  const deleteHomework = useTutorStore(state => state.deleteHomework);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newHomework, setNewHomework] = useState({
    title: "",
    description: "",
    studentId: "",
    dueDate: format(new Date(), 'yyyy-MM-dd'),
  });

  const handleAddHomework = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHomework.studentId || !newHomework.title) return;

    addHomework({
      title: newHomework.title,
      description: newHomework.description,
      studentId: newHomework.studentId,
      dueDate: new Date(newHomework.dueDate),
    });
    
    setIsAddModalOpen(false);
    setNewHomework({ title: "", description: "", studentId: "", dueDate: format(new Date(), 'yyyy-MM-dd') });
  };

  const getStudentName = (id: string) => students.find(s => s.id === id)?.name || "Неизвестный ученик";
  
  const pendingHomeworks = homeworks.filter(h => h.status === 'pending');
  const completedHomeworks = homeworks.filter(h => h.status === 'completed');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Задания</h1>
          <p className="text-muted-foreground">
            Управление домашними заданиями учеников.
          </p>
        </div>

        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger className={buttonVariants({ variant: "default" })}>
            <Plus className="mr-2 h-4 w-4" />
            Добавить задание
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleAddHomework}>
              <DialogHeader>
                <DialogTitle>Новое задание</DialogTitle>
                <DialogDescription>
                  Назначьте домашнее задание ученику.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="student" className="text-right">Ученик</Label>
                  <Select value={newHomework.studentId} onValueChange={(v) => setNewHomework({...newHomework, studentId: v || ""})}>
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
                  <Label htmlFor="title" className="text-right">Тема</Label>
                  <Input 
                    id="title" 
                    value={newHomework.title}
                    onChange={e => setNewHomework({...newHomework, title: e.target.value})}
                    placeholder="Например: Решение уравнений"
                    className="col-span-3" 
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="desc" className="text-right">Описание</Label>
                  <Input 
                    id="desc" 
                    value={newHomework.description}
                    onChange={e => setNewHomework({...newHomework, description: e.target.value})}
                    placeholder="Стр. 45, номера 1-5"
                    className="col-span-3" 
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="dueDate" className="text-right">Срок</Label>
                  <Input 
                    id="dueDate" 
                    type="date"
                    value={newHomework.dueDate}
                    onChange={e => setNewHomework({...newHomework, dueDate: e.target.value})}
                    className="col-span-3" 
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Назначить</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Pending */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Clock className="text-amber-500 h-5 w-5" />
              На проверку
            </h2>
            <Badge variant="outline">{pendingHomeworks.length}</Badge>
          </div>
          <div className="space-y-3">
            {pendingHomeworks.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">Нет активных заданий</p>
            ) : (
              pendingHomeworks.map(hw => (
                <Card key={hw.id} className="border-l-4 border-l-amber-500 group relative">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-2 right-2 h-6 w-6 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive"
                    onClick={() => deleteHomework(hw.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{hw.title}</CardTitle>
                    <p className="text-xs text-muted-foreground">{getStudentName(hw.studentId)}</p>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm">{hw.description}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Срок: {format(new Date(hw.dueDate), 'dd.MM.yyyy')}
                    </p>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <Button size="sm" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => completeHomework(hw.id)}>
                      <CheckCircle2 className="mr-2 h-4 w-4" /> Принять ДЗ
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Completed */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <CheckCircle2 className="text-emerald-500 h-5 w-5" />
              Завершено
            </h2>
            <Badge variant="outline">{completedHomeworks.length}</Badge>
          </div>
          <div className="space-y-3">
            {completedHomeworks.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">Нет завершенных заданий</p>
            ) : (
              completedHomeworks.map(hw => (
                <Card key={hw.id} className="opacity-75 group relative">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-2 right-2 h-6 w-6 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive"
                    onClick={() => deleteHomework(hw.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base strike-through">{hw.title}</CardTitle>
                    <p className="text-xs text-muted-foreground">{getStudentName(hw.studentId)}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm line-through text-muted-foreground">{hw.description}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
