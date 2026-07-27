"use client";

import { useTutorStore } from "@/store/tutor-store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Calendar, Home, MessageSquare, BookOpen, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const activeRole = useTutorStore(state => state.activeRole);
  const activeUserId = useTutorStore(state => state.activeUserId);
  const students = useTutorStore(state => state.students);
  const logout = useTutorStore(state => state.logout);
  
  const student = students.find(s => s.id === activeUserId);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (activeRole !== 'student' || !activeUserId) {
      router.push('/auth');
    }
  }, [activeRole, activeUserId, router]);

  if (!mounted || activeRole !== 'student' || !student) {
    return <div className="h-screen w-full flex items-center justify-center bg-background">Загрузка...</div>;
  }

  const handleLogout = () => {
    logout();
    router.push('/auth');
  };

  const navItems = [
    { name: "Главная", href: "/student", icon: Home },
    { name: "Мое Расписание", href: "/student/schedule", icon: Calendar },
    { name: "Мои Задания", href: "/student/homeworks", icon: BookOpen },
    { name: "Связь с Репетитором", href: "/student/chat", icon: MessageSquare },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar for Student */}
      <aside className="w-64 border-r bg-muted/40 hidden md:flex flex-col">
        <div className="h-14 border-b flex items-center px-4 font-semibold text-primary">
          <BookOpen className="mr-2 h-5 w-5" />
          Личный кабинет
        </div>
        
        <div className="p-4 border-b bg-background">
          <p className="text-xs text-muted-foreground mb-1">Вы вошли как:</p>
          <p className="font-semibold">{student.name}</p>
          <p className="text-xs text-muted-foreground">{student.subject} • {student.grade}</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  pathname === item.href 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:bg-muted hover:text-primary"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t">
          <Button variant="outline" className="w-full justify-start text-muted-foreground hover:text-destructive" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Выйти
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header (simplified) */}
        <header className="h-14 border-b bg-muted/40 flex items-center justify-between px-4 md:hidden">
          <div className="font-semibold text-primary flex items-center">
            <BookOpen className="mr-2 h-5 w-5" />
            Личный кабинет
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
          </Button>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8 bg-muted/20">
          {children}
        </main>
      </div>
    </div>
  );
}
