"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTutorStore } from "@/store/tutor-store";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Calendar,
  Users,
  BookOpen,
  MessageSquare,
  Settings,
  LogOut
} from "lucide-react";

const navItems = [
  { title: "Главная", href: "/", icon: LayoutDashboard },
  { title: "Расписание", href: "/schedule", icon: Calendar },
  { title: "Ученики", href: "/students", icon: Users },
  { title: "Задания", href: "/homeworks", icon: BookOpen },
  { title: "Чат", href: "/chat", icon: MessageSquare },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useTutorStore(state => state.logout);

  const handleLogout = () => {
    logout();
    router.push('/auth');
  };

  return (
    <aside className="hidden w-64 flex-col border-r bg-card md:flex">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-xl font-bold text-primary-foreground">A</span>
          </div>
          <span className="text-lg">Alikhan Tutor</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                  isActive
                    ? "bg-muted text-primary"
                    : "text-muted-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.title}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="mt-auto p-4 border-t">
        <nav className="grid items-start text-sm font-medium space-y-1">
          <Link
            href="/settings"
            className={cn("flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary", pathname === "/settings" ? "bg-muted text-primary" : "text-muted-foreground")}
          >
            <Settings className="h-4 w-4" />
            Настройки
          </Link>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-destructive hover:bg-destructive/10"
          >
            <LogOut className="h-4 w-4" />
            Выйти
          </button>
        </nav>
      </div>
    </aside>
  );
}
