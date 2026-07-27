"use client";

import { useTutorStore } from "@/store/tutor-store";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { CheckCircle2, Clock, Send } from "lucide-react";

export default function StudentHomeworksPage() {
  const activeUserId = useTutorStore(state => state.activeUserId);
  const homeworks = useTutorStore(state => state.homeworks);
  const completeHomework = useTutorStore(state => state.completeHomework);

  if (!activeUserId) return null;
  
  const myHomeworks = homeworks.filter(h => h.studentId === activeUserId);
  const pendingHomeworks = myHomeworks.filter(h => h.status === 'pending');
  const completedHomeworks = myHomeworks.filter(h => h.status === 'completed');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Мои Задания</h1>
        <p className="text-muted-foreground">
          Список твоих домашних заданий от репетитора.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Pending */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Clock className="text-amber-500 h-5 w-5" />
              Нужно выполнить
            </h2>
            <Badge variant="outline">{pendingHomeworks.length}</Badge>
          </div>
          <div className="space-y-3">
            {pendingHomeworks.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">Ура! Все задания выполнены.</p>
            ) : (
              pendingHomeworks.map(hw => (
                <Card key={hw.id} className="border-l-4 border-l-amber-500 relative">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{hw.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm">{hw.description}</p>
                    <p className="text-xs text-muted-foreground mt-2 font-medium text-amber-700">
                      Сдать до: {format(new Date(hw.dueDate), 'dd.MM.yyyy')}
                    </p>
                  </CardContent>
                  <CardFooter className="pt-2">
                    {/* Кнопка "Сдать" (в реальности должна быть загрузка файла, но пока мы просто меняем статус) */}
                    <Button 
                      size="sm" 
                      className="w-full bg-primary" 
                      onClick={() => completeHomework(hw.id)}
                    >
                      <Send className="mr-2 h-4 w-4" /> Отметить как выполненное
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
              <p className="text-sm text-muted-foreground italic">Здесь будут твои выполненные задания.</p>
            ) : (
              completedHomeworks.map(hw => (
                <Card key={hw.id} className="opacity-75 relative">
                  <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-base line-through text-muted-foreground">{hw.title}</CardTitle>
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{hw.description}</p>
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
