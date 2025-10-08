import { motion } from 'framer-motion';
import { Bot, User, Lightbulb, Target, HeartHandshake } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Message } from '../../worker/types';
interface ChatMessageProps {
  message: Message;
}
const ClarityItem = ({ icon, title, content }: { icon: React.ReactNode; title: string; content: string }) => (
  <div className="flex items-start gap-3">
    <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-white/10 text-indigo">
      {icon}
    </div>
    <div>
      <h4 className="font-semibold text-sm text-indigo mb-1">{title}</h4>
      <p className="text-white/80 text-sm">{content}</p>
    </div>
  </div>
);
export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn('flex items-start gap-4', isUser ? 'justify-end' : 'justify-start')}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-indigo flex items-center justify-center flex-shrink-0">
          <Bot className="w-5 h-5 text-white" />
        </div>
      )}
      <div
        className={cn(
          'max-w-md lg:max-w-2xl p-4 rounded-2xl text-white/90',
          isUser
            ? 'bg-indigo rounded-br-none'
            : 'bg-white/5 border border-white/10 backdrop-blur-lg rounded-bl-none'
        )}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
        {message.clarityOutput && (
          <div className="mt-4 pt-4 border-t border-white/10 space-y-4">
            <ClarityItem
              icon={<HeartHandshake size={16} />}
              title="Emotional Summary"
              content={message.clarityOutput.summary.replace('🪞', '').trim()}
            />
            <ClarityItem
              icon={<Lightbulb size={16} />}
              title="Core Insight"
              content={message.clarityOutput.insight.replace('💡', '').trim()}
            />
            <ClarityItem
              icon={<Target size={16} />}
              title="Grounded Suggestion"
              content={message.clarityOutput.suggestion.replace('🌱', '').trim()}
            />
          </div>
        )}
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-teal flex items-center justify-center flex-shrink-0">
          <User className="w-5 h-5 text-charcoal" />
        </div>
      )}
    </motion.div>
  );
}