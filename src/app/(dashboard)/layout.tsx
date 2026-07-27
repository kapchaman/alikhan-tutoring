"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { useTutorStore } from "@/store/tutor-store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const activeRole = useTutorStore(state => state.activeRole);
  const tutorProfile = useTutorStore(state => state.tutorProfile);
  const isLoaded = useTutorStore(state => state.isLoaded);
  const fetchData = useTutorStore(state => state.fetchData);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isLoaded) {
      fetchData();
    }
  }, [isLoaded, fetchData]);

  useEffect(() => {
    if (mounted && isLoaded) {
      if (activeRole !== 'tutor' || !tutorProfile) {
        router.push('/auth');
      }
    }
  }, [mounted, isLoaded, activeRole, tutorProfile, router]);

  if (!mounted || !isLoaded || activeRole !== 'tutor' || !tutorProfile) {
    return <div className="h-screen w-full flex items-center justify-center bg-background">Загрузка...</div>;
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[256px_1fr]">
      <Sidebar />
      <div className="flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8 bg-muted/20">
          {children}
        </main>
      </div>
    </div>
  );
}
