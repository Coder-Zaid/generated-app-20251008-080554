import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { toast } from 'sonner';
import { chatService } from '@/lib/chat';
import type { Message, SessionInfo } from '../../worker/types';
interface ChatState {
  sessions: SessionInfo[];
  activeSessionId: string | null;
  messages: Message[];
  streamingMessage: string;
  isLoading: boolean;
  isFetchingSessions: boolean;
  isCreatingSession: boolean;
  actions: {
    fetchSessions: () => Promise<void>;
    createSession: () => Promise<void>;
    switchSession: (sessionId: string) => Promise<void>;
    deleteSession: (sessionId: string) => Promise<void>;
    clearAllSessions: () => Promise<void>;
    sendMessage: (message: string) => Promise<void>;
  };
}
export const useChatStore = create<ChatState>()(
  immer((set, get) => ({
    sessions: [],
    activeSessionId: null,
    messages: [],
    streamingMessage: '',
    isLoading: false,
    isFetchingSessions: true,
    isCreatingSession: false,
    actions: {
      fetchSessions: async () => {
        set({ isFetchingSessions: true });
        const response = await chatService.listSessions();
        if (response.success && response.data) {
          set((state) => {
            state.sessions = response.data!;
            if (!get().activeSessionId && response.data!.length > 0) {
              const latestSession = response.data![0];
              state.activeSessionId = latestSession.id;
              chatService.switchSession(latestSession.id);
              get().actions.switchSession(latestSession.id);
            } else if (response.data!.length === 0 && !get().isCreatingSession) {
              get().actions.createSession();
            }
          });
        }
        set({ isFetchingSessions: false });
      },
      createSession: async () => {
        if (get().isCreatingSession) return;
        set({ isCreatingSession: true });
        const response = await chatService.createSession('New Chat');
        if (response.success && response.data) {
          const newSessionId = response.data.sessionId;
          chatService.switchSession(newSessionId);
          set((state) => {
            state.activeSessionId = newSessionId;
            state.messages = [];
            state.streamingMessage = '';
          });
          await get().actions.fetchSessions();
        }
        set({ isCreatingSession: false });
      },
      switchSession: async (sessionId: string) => {
        chatService.switchSession(sessionId);
        set((state) => {
          state.activeSessionId = sessionId;
          state.messages = [];
          state.streamingMessage = '';
          state.isLoading = true;
        });
        const response = await chatService.getMessages();
        if (response.success && response.data) {
          set((state) => {
            state.messages = response.data!.messages;
          });
        }
        set({ isLoading: false });
      },
      deleteSession: async (sessionId: string) => {
        await chatService.deleteSession(sessionId);
        set((state) => {
          state.sessions = state.sessions.filter((s) => s.id !== sessionId);
          if (state.activeSessionId === sessionId) {
            state.activeSessionId = null;
            state.messages = [];
          }
        });
        if (get().sessions.length === 0) {
          await get().actions.createSession();
        } else if (!get().activeSessionId) {
          await get().actions.switchSession(get().sessions[0].id);
        }
      },
      clearAllSessions: async () => {
        const response = await chatService.clearAllSessions();
        if (response.success) {
          toast.success("All sessions have been cleared.");
          set({ sessions: [], messages: [], activeSessionId: null });
          await get().actions.createSession();
        } else {
          toast.error("Failed to clear sessions. Please try again.");
        }
      },
      sendMessage: async (message: string) => {
        if (get().isLoading || !message.trim()) return;
        const userMessage: Message = {
          id: crypto.randomUUID(),
          role: 'user',
          content: message,
          timestamp: Date.now(),
        };
        set((state) => {
          state.isLoading = true;
          state.messages.push(userMessage);
          state.streamingMessage = '';
        });
        if (get().messages.length === 1) {
            const activeSessionId = get().activeSessionId;
            if (activeSessionId) {
                await chatService.createSession(undefined, activeSessionId, message);
                await get().actions.fetchSessions();
            }
        }
        try {
          const result = await chatService.sendMessage(message);
          if (!result.success && result.error) {
              toast.error(result.error);
          }
          if (result.success && result.data) {
            set((state) => {
              state.messages = result.data!.messages;
            });
          }
        } catch (error) {
          console.error("Failed to send message:", error);
          toast.error("I'm having trouble connecting right now. Please try again.");
          const errorMessage: Message = {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: "I'm having trouble connecting right now. Please try again in a moment.",
            timestamp: Date.now(),
          };
          set(state => {
            state.messages.push(errorMessage);
          });
        } finally {
          set((state) => {
            state.isLoading = false;
            state.streamingMessage = '';
          });
        }
      },
    },
  }))
);