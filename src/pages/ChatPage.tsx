import { useEffect } from 'react';
import { SessionSidebar } from '@/components/SessionSidebar';
import { ChatView } from '@/components/ChatView';
import { useChatStore } from '@/hooks/useChatStore';
import { Toaster } from '@/components/ui/sonner';
export function ChatPage() {
  const fetchSessions = useChatStore((state) => state.actions.fetchSessions);
  useEffect(() => {
    document.documentElement.classList.add('dark');
    fetchSessions();
  }, [fetchSessions]);
  return (
    <div className="h-full w-full flex">
      <Toaster theme="dark" richColors />
      <SessionSidebar />
      <ChatView />
    </div>
  );
}