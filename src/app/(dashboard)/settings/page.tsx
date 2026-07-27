"use client";

import { useTutorStore } from "@/store/tutor-store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Lock, Save } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const tutorProfile = useTutorStore(state => state.tutorProfile);
  const updateTutorProfile = useTutorStore(state => state.updateTutorProfile);
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (tutorProfile) {
      setName(tutorProfile.name);
      setEmail(tutorProfile.email);
      setPassword(tutorProfile.password || "");
    } else {
      router.push('/auth');
    }
  }, [tutorProfile, router]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateTutorProfile({
      name,
      email,
      password
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  if (!tutorProfile) return null;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Настройки Профиля</h1>
        <p className="text-muted-foreground">
          Управление вашей учетной записью репетитора.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Личные данные</CardTitle>
          <CardDescription>Измените информацию о себе, чтобы ученики видели актуальные данные.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSave}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Ваше имя</Label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="name" 
                  className="pl-9"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email (Логин)</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="email" 
                  type="email" 
                  className="pl-9"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Изменить пароль</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="password" 
                  type="password" 
                  className="pl-9"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between items-center border-t p-6">
            {isSaved ? (
              <p className="text-sm font-medium text-emerald-600">Изменения сохранены!</p>
            ) : (
              <p className="text-sm text-muted-foreground">Эти данные используются для входа.</p>
            )}
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" />
              Сохранить
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
