"use client";

import { Bell, Menu, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState, useRef, useEffect } from "react";
import { useTutorStore } from "@/store/tutor-store";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function Header() {
  const logout = useTutorStore(state => state.logout);
  const router = useRouter();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/auth');
  };

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 relative">
      <Sheet>
        <SheetTrigger render={<Button variant="outline" size="icon" className="shrink-0 md:hidden" />}>
          <Menu className="h-5 w-5" />
          <span className="sr-only">Меню навигации</span>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex h-14 items-center border-b px-4 font-semibold text-primary">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground mr-2">
              <span className="text-xl font-bold">A</span>
            </div>
            Alikhan Tutor
          </div>
          <nav className="flex-1 p-4 space-y-1">
            <Link href="/" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-primary">
              Главная
            </Link>
            <Link href="/schedule" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-primary">
              Расписание
            </Link>
            <Link href="/students" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-primary">
              Ученики
            </Link>
            <Link href="/homeworks" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-primary">
              Задания
            </Link>
            <Link href="/chat" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-primary">
              Чат
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
      
      <div className="w-full flex-1">
        <form>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Поиск учеников или заданий..."
              className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
            />
          </div>
        </form>
      </div>
      
      <div className="relative" ref={notifRef}>
        <Button 
          variant="outline" 
          size="icon" 
          className="ml-auto h-8 w-8 rounded-full"
          onClick={() => setIsNotifOpen(!isNotifOpen)}
        >
          <Bell className="h-4 w-4" />
          <span className="sr-only">Уведомления</span>
        </Button>
        {isNotifOpen && (
          <div className="absolute right-0 top-full mt-2 w-64 rounded-md border bg-popover text-popover-foreground shadow-md z-50 p-4">
            <h4 className="font-medium text-sm mb-2">Уведомления</h4>
            <div className="text-sm text-muted-foreground">У вас пока нет новых уведомлений.</div>
          </div>
        )}
      </div>

      <div className="relative" ref={profileRef}>
        <button 
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <User className="h-5 w-5" />
          <span className="sr-only">Меню профиля</span>
        </button>
        {isProfileOpen && (
          <div className="absolute right-0 top-full mt-2 w-48 rounded-md border bg-popover text-popover-foreground shadow-md z-50 py-1">
            <div className="px-2 py-1.5 text-sm font-semibold">Мой аккаунт</div>
            <div className="-mx-1 my-1 h-px bg-border" />
            <Link 
              href="/settings" 
              className="block px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
              onClick={() => setIsProfileOpen(false)}
            >
              Настройки
            </Link>
            <div className="block px-2 py-1.5 text-sm text-muted-foreground">
              Поддержка
            </div>
            <div className="-mx-1 my-1 h-px bg-border" />
            <button 
              onClick={handleLogout} 
              className="w-full text-left block px-2 py-1.5 text-sm text-destructive hover:bg-destructive/10"
            >
              Выйти
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
