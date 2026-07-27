"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useTutorStore } from "@/store/tutor-store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Trash2, BookPlus } from "lucide-react";

import { useRouter } from "next/navigation";

export default function StudentsPage() {
  const router = useRouter();
  const students = useTutorStore(state => state.students);
  const addStudent = useTutorStore(state => state.addStudent);
  const deleteStudent = useTutorStore(state => state.deleteStudent);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: "",
    grade: "",
    subject: "",
    pricePerLesson: "",
  });

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.name || !newStudent.subject) return;

    addStudent({
      name: newStudent.name,
      grade: newStudent.grade,
      subject: newStudent.subject,
      pricePerLesson: Number(newStudent.pricePerLesson) || 0,
      pendingHomeworks: 0,
      avatarUrl: "",
    });
    
    setNewStudent({ name: "", grade: "", subject: "", pricePerLesson: "" });
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ученики</h1>
          <p className="text-muted-foreground">
            Управление списком учеников и их домашними заданиями.
          </p>
        </div>
        
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger className={buttonVariants({ variant: "default" })}>
            <Plus className="mr-2 h-4 w-4" />
            Добавить ученика
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleAddStudent}>
              <DialogHeader>
                <DialogTitle>Новый ученик</DialogTitle>
                <DialogDescription>
                  Введите данные нового ученика, чтобы добавить его в систему.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    ФИО
                  </Label>
                  <Input 
                    id="name" 
                    value={newStudent.name}
                    onChange={e => setNewStudent({...newStudent, name: e.target.value})}
                    placeholder="Иван Иванов" 
                    className="col-span-3" 
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="subject" className="text-right">
                    Предмет
                  </Label>
                  <Input 
                    id="subject"
                    value={newStudent.subject}
                    onChange={e => setNewStudent({...newStudent, subject: e.target.value})}
                    placeholder="Математика" 
                    className="col-span-3" 
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="grade" className="text-right">
                    Класс
                  </Label>
                  <Input 
                    id="grade" 
                    value={newStudent.grade}
                    onChange={e => setNewStudent({...newStudent, grade: e.target.value})}
                    placeholder="10 класс" 
                    className="col-span-3" 
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="price" className="text-right">
                    Ставка за урок
                  </Label>
                  <Input 
                    id="price" 
                    type="number"
                    value={newStudent.pricePerLesson}
                    onChange={e => setNewStudent({...newStudent, pricePerLesson: e.target.value})}
                    placeholder="5000" 
                    className="col-span-3" 
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Сохранить</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {students.map((student) => (
          <Card key={student.id} className="relative group">
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 border">
                  <AvatarImage src={student.avatarUrl} alt={student.name} />
                  <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{student.name}</CardTitle>
                  <CardDescription>{student.grade} • {student.subject} • {student.pricePerLesson} ₸</CardDescription>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => deleteStudent(student.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mt-2 pt-4 border-t">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Долги по ДЗ:</span>
                  <Badge variant={student.pendingHomeworks > 0 ? "destructive" : "secondary"}>
                    {student.pendingHomeworks}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => router.push('/homeworks')}
                    title="Управление ДЗ"
                  >
                    <BookPlus className="h-4 w-4 mr-2" />
                    Задания
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
