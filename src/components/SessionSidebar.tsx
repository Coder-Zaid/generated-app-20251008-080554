import { Plus, MessageSquare, Trash2 } from 'lucide-react';
import { useChatStore } from '@/hooks/useChatStore';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
export function SessionSidebar() {
  const sessions = useChatStore((state) => state.sessions);
  const activeSessionId = useChatStore((state) => state.activeSessionId);
  const isFetchingSessions = useChatStore((state) => state.isFetchingSessions);
  const actions = useChatStore((state) => state.actions);
  return (
    <aside className="w-72 min-w-[288px] bg-black/10 border-r border-white/10 p-4 flex flex-col h-full backdrop-blur-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Sessions</h2>
        <Button
          variant="ghost"
          size="icon"
          className="text-indigo hover:bg-indigo/20 hover:text-white"
          onClick={actions.createSession}
        >
          <Plus className="w-5 h-5" />
        </Button>
      </div>
      <ScrollArea className="flex-1 -mr-4 pr-4">
        <div className="space-y-2">
          {isFetchingSessions ? (
            <>
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </>
          ) : (
            sessions.map((session) => (
              <div
                key={session.id}
                className={cn(
                  'group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors',
                  activeSessionId === session.id
                    ? 'bg-indigo/20 text-white'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                )}
                onClick={() => actions.switchSession(session.id)}
              >
                <div className="flex items-center space-x-3 truncate">
                  <MessageSquare className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate text-sm font-medium">{session.title}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-7 h-7 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20 hover:text-red-400"
                  onClick={(e) => {
                    e.stopPropagation();
                    actions.deleteSession(session.id);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
      <div className="mt-4 pt-4 border-t border-white/10">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="w-full bg-red-500/20 text-red-400 hover:bg-red-500/30 hover:text-red-300">
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All Sessions
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete all your chat sessions and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={actions.clearAllSessions}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </aside>
  );
}