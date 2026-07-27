"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, User, GraduationCap, Lock, Mail } from "lucide-react";
import { useTutorStore } from "@/store/tutor-store";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AuthPage() {
  const router = useRouter();
  const setActiveUser = useTutorStore(state => state.setActiveUser);
  const updateTutorProfile = useTutorStore(state => state.updateTutorProfile);
  const students = useTutorStore(state => state.students);
  const tutorProfile = useTutorStore(state => state.tutorProfile);
  const activeRole = useTutorStore(state => state.activeRole);
  
  const [isMounted, setIsMounted] = useState(false);

  // Состояния для форм входа
  const [tutorEmail, setTutorEmail] = useState("");
  const [tutorPassword, setTutorPassword] = useState("");
  const [tutorError, setTutorError] = useState("");

  const [studentName, setStudentName] = useState("");
  const [studentError, setStudentError] = useState("");

  // Состояния для регистрации
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  
  useEffect(() => {
    setIsMounted(true);
    // Если уже авторизован и профиль существует, перекидываем
    if (activeRole === 'tutor' && tutorProfile) {
      router.push('/');
    } else if (activeRole === 'student') {
      router.push('/student');
    }
  }, [activeRole, tutorProfile, router]);

  if (!isMounted) return null;

  const handleTutorRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPassword) return;
    
    updateTutorProfile({
      name: regName,
      email: regEmail,
      password: regPassword, // В реальном приложении пароли хешируются на бекенде!
    });
    setActiveUser('tutor');
    router.push('/');
  };

  const handleTutorLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setTutorError("");
    
    if (tutorProfile && tutorEmail === tutorProfile.email && tutorPassword === tutorProfile.password) {
      setActiveUser('tutor');
      router.push('/');
    } else {
      setTutorError("Неверный email или пароль.");
    }
  };

  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setStudentError("");
    
    const foundStudent = students.find(
      s => s.name.toLowerCase() === studentName.trim().toLowerCase()
    );

    if (foundStudent) {
      setActiveUser('student', foundStudent.id);
      router.push('/student');
    } else {
      setStudentError("Ученик с таким именем не найден.");
    }
  };

  // Удален ранний возврат, теперь табы всегда показываются

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-4">
            <BookOpen className="text-primary-foreground h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-center">
            Вход в систему
          </CardTitle>
          <CardDescription className="text-center">
            Выберите вашу роль для входа
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="tutor" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="tutor">Я Репетитор</TabsTrigger>
              <TabsTrigger value="student">Я Ученик</TabsTrigger>
            </TabsList>
            
            {/* Форма входа/регистрации для Репетитора */}
            <TabsContent value="tutor">
              {!tutorProfile ? (
                <form onSubmit={handleTutorRegister} className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    <p className="text-sm text-muted-foreground">
                      Создайте профиль администратора платформы.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="regName">Ваше имя</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="regName" 
                        placeholder="Иван Иванов" 
                        className="pl-9"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="regEmail">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="regEmail" 
                        type="email" 
                        placeholder="admin@example.com" 
                        className="pl-9"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="regPassword">Придумайте пароль</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="regPassword" 
                        type="password" 
                        className="pl-9"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full mt-4">
                    Зарегистрироваться
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleTutorLogin} className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    <p className="text-sm text-muted-foreground">
                      Вход для администратора платформы.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="admin@tutor.com" 
                      value={tutorEmail}
                      onChange={(e) => setTutorEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Пароль</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      value={tutorPassword}
                      onChange={(e) => setTutorPassword(e.target.value)}
                    />
                  </div>
                  {tutorError && (
                    <p className="text-sm text-destructive">{tutorError}</p>
                  )}
                  <Button type="submit" className="w-full">
                    Войти
                  </Button>
                </form>
              )}
            </TabsContent>

            {/* Форма входа для Ученика */}
            <TabsContent value="student">
              <form onSubmit={handleStudentLogin} className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-5 w-5 text-blue-500" />
                  <p className="text-sm text-muted-foreground">
                    Введите ваше полное имя, чтобы войти в личный кабинет.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="studentName">Имя и Фамилия</Label>
                  <Input 
                    id="studentName" 
                    placeholder="Например: Алексей Иванов" 
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                  />
                </div>
                {studentError && (
                  <p className="text-sm text-destructive">{studentError}</p>
                )}
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                  Найти мой кабинет
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
