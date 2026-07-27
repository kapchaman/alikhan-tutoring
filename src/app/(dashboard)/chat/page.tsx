"use client";

import { useState } from "react";
import { useTutorStore } from "@/store/tutor-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Search } from "lucide-react";
import { format } from "date-fns";

export default function ChatPage() {
  const students = useTutorStore(state => state.students);
  const messages = useTutorStore(state => state.messages);
  const sendMessage = useTutorStore(state => state.sendMessage);

  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(students[0]?.id || null);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStudents = students.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
  
  const currentMessages = messages.filter(m => m.studentId === selectedStudentId)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  const selectedStudent = students.find(s => s.id === selectedStudentId);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedStudentId) return;

    sendMessage({
      studentId: selectedStudentId,
      senderId: 'tutor', // Мы сидим за репетитора
      text: newMessage,
    });
    
    setNewMessage("");
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col md:flex-row gap-4">
      {/* Sidebar - Contacts */}
      <Card className="w-full md:w-80 flex flex-col overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="font-semibold mb-4">Чаты</h2>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Поиск ученика..." 
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {filteredStudents.length === 0 && (
              <p className="text-center text-sm text-muted-foreground mt-4">Ничего не найдено</p>
            )}
            {filteredStudents.map(student => {
              const studentMessages = messages.filter(m => m.studentId === student.id);
              const lastMessage = studentMessages.length > 0 
                ? studentMessages[studentMessages.length - 1] 
                : null;
                
              return (
                <button
                  key={student.id}
                  onClick={() => setSelectedStudentId(student.id)}
                  className={`w-full flex items-center gap-3 p-2 rounded-lg text-left transition-colors ${
                    selectedStudentId === student.id ? 'bg-primary/10' : 'hover:bg-muted'
                  }`}
                >
                  <Avatar>
                    <AvatarImage src={student.avatarUrl} alt={student.name} />
                    <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm truncate">{student.name}</span>
                      {lastMessage && (
                        <span className="text-[10px] text-muted-foreground">
                          {format(new Date(lastMessage.timestamp), 'HH:mm')}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {lastMessage ? (lastMessage.senderId === 'tutor' ? 'Вы: ' + lastMessage.text : lastMessage.text) : 'Нет сообщений'}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        </ScrollArea>
      </Card>

      {/* Main Chat Area */}
      <Card className="flex-1 flex flex-col overflow-hidden">
        {selectedStudent ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b flex items-center gap-3 bg-muted/20">
              <Avatar>
                <AvatarImage src={selectedStudent.avatarUrl} alt={selectedStudent.name} />
                <AvatarFallback>{selectedStudent.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold text-sm">{selectedStudent.name}</h2>
                <p className="text-xs text-muted-foreground">{selectedStudent.subject} • {selectedStudent.grade}</p>
              </div>
            </div>
            
            {/* Messages */}
            <ScrollArea className="flex-1 p-4 bg-slate-50/50 dark:bg-transparent">
              <div className="space-y-4">
                {currentMessages.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-muted-foreground text-sm py-20">
                    Напишите первое сообщение...
                  </div>
                ) : (
                  currentMessages.map(msg => {
                    const isMe = msg.senderId === 'tutor';
                    return (
                      <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                        <div 
                          className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                            isMe 
                              ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                              : 'bg-muted rounded-tl-sm'
                          }`}
                        >
                          {msg.text}
                        </div>
                        <span className="text-[10px] text-muted-foreground mt-1 mx-1">
                          {format(new Date(msg.timestamp), 'HH:mm')}
                        </span>
                      </div>
                    )
                  })
                )}
              </div>
            </ScrollArea>
            
            {/* Input */}
            <div className="p-3 border-t bg-background">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input 
                  placeholder="Введите сообщение..." 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" size="icon" disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            Выберите чат из списка слева
          </div>
        )}
      </Card>
    </div>
  );
}
