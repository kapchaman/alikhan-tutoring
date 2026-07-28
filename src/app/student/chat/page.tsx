"use client";

import { useState, useEffect } from "react";
import { useTutorStore } from "@/store/tutor-store";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, BookOpen } from "lucide-react";
import { format } from "date-fns";

export default function StudentChatPage() {
  const activeUserId = useTutorStore(state => state.activeUserId);
  const messages = useTutorStore(state => state.messages);
  const sendMessage = useTutorStore(state => state.sendMessage);

  const [newMessage, setNewMessage] = useState("");
  const fetchMessages = useTutorStore(state => state.fetchMessages);

  // Poll for new messages every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchMessages();
    }, 3000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  if (!activeUserId) return null;
  
  const currentMessages = messages.filter(m => m.studentId === activeUserId)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    sendMessage({
      studentId: activeUserId,
      senderId: activeUserId, // Ученик шлет от своего имени
      text: newMessage,
    });
    
    setNewMessage("");
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
      {/* Main Chat Area */}
      <Card className="flex-1 flex flex-col overflow-hidden">
        {/* Chat Header */}
        <div className="p-4 border-b flex items-center gap-3 bg-muted/20">
          <Avatar className="bg-primary/20">
            <AvatarFallback className="bg-primary/10 text-primary">
              <BookOpen className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold text-sm">Твой Репетитор</h2>
            <p className="text-xs text-emerald-600 font-medium">Онлайн</p>
          </div>
        </div>
        
        {/* Messages */}
        <ScrollArea className="flex-1 p-4 bg-slate-50/50 dark:bg-transparent">
          <div className="space-y-4">
            {currentMessages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-muted-foreground text-sm py-20">
                Задайте вопрос вашему репетитору...
              </div>
            ) : (
              currentMessages.map(msg => {
                const isMe = msg.senderId === activeUserId;
                return (
                  <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <div 
                      className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
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
              placeholder="Напишите репетитору..." 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" size="icon" disabled={!newMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
