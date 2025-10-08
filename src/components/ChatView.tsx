import React, { useEffect, useRef, useState } from 'react';
import { Send, BrainCircuit } from 'lucide-react';
import { useChatStore } from '@/hooks/useChatStore';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage } from './ChatMessage';
import { ProgressIndicator } from './ProgressIndicator';
import { motion, AnimatePresence } from 'framer-motion';
function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-4 justify-start"
    >
      <div className="w-8 h-8 rounded-full bg-indigo flex items-center justify-center flex-shrink-0">
        <BotIconWithPulse />
      </div>
      <div className="bg-white/5 border border-white/10 backdrop-blur-lg rounded-bl-none p-4 rounded-2xl">
        <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-white/80 rounded-full animate-pulse [animation-delay:0s]" />
            <div className="w-2 h-2 bg-white/80 rounded-full animate-pulse [animation-delay:0.2s]" />
            <div className="w-2 h-2 bg-white/80 rounded-full animate-pulse [animation-delay:0.4s]" />
        </div>
      </div>
    </motion.div>
  );
}
const BotIconWithPulse = () => (
    <div className="relative">
        <BrainCircuit className="w-5 h-5 text-white" />
        <span className="absolute top-0 right-0 -mr-1 -mt-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-teal"></span>
        </span>
    </div>
);
const WelcomeMessage = () => (
  <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
    <BrainCircuit className="w-16 h-16 text-indigo mb-4" />
    <h2 className="text-2xl font-semibold text-white mb-2">Welcome to Neuro</h2>
    <p className="max-w-md">
      This is a safe space to untangle your thoughts. What's on your mind today?
    </p>
  </div>
);
export function ChatView() {
  const messages = useChatStore((state) => state.messages);
  const isLoading = useChatStore((state) => state.isLoading);
  const actions = useChatStore((state) => state.actions);
  const [input, setInput] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('div');
      if (viewport) {
        viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' });
      }
    }
  }, [messages]);
  const handleSend = () => {
    if (input.trim()) {
      actions.sendMessage(input);
      setInput('');
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  const showProgress = messages.length >= 4 && messages.length < 10;
  return (
    <main className="flex-1 flex flex-col h-full bg-charcoal/80 backdrop-blur-md">
      <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
        {messages.length === 0 && !isLoading ? (
          <WelcomeMessage />
        ) : (
          <div className="max-w-4xl mx-auto space-y-6 pb-4">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            {isLoading && <TypingIndicator />}
          </div>
        )}
      </ScrollArea>
      <div className="p-6 border-t border-white/10 bg-charcoal">
        <div className="max-w-4xl mx-auto space-y-4">
          <AnimatePresence>
            {showProgress && <ProgressIndicator />}
          </AnimatePresence>
          <div className="relative">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Share your thoughts here..."
              className="bg-white/5 border-white/10 rounded-xl p-4 pr-16 min-h-[52px] resize-none text-white placeholder:text-gray-500 focus:ring-1 focus:ring-indigo"
              rows={1}
              disabled={isLoading}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <Button
                size="icon"
                className="bg-teal text-charcoal hover:bg-teal/80"
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <p className="text-xs text-center text-gray-500">
            Neuro is an AI assistant and not a replacement for a therapist. AI interactions are subject to usage limits.
          </p>
        </div>
      </div>
    </main>
  );
}