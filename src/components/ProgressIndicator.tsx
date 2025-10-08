import { useChatStore } from '@/hooks/useChatStore';
import { Progress } from '@/components/ui/progress';
import { BrainCircuit } from 'lucide-react';
import { motion } from 'framer-motion';
export function ProgressIndicator() {
  const messages = useChatStore((state) => state.messages);
  const messageCount = messages.length;
  // Progress starts after 4 messages and completes at 10
  const startCount = 4;
  const endCount = 10;
  const progress = Math.max(0, Math.min(100, ((messageCount - startCount) / (endCount - startCount)) * 100));
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="flex items-center gap-3 px-1"
    >
      <BrainCircuit className="w-5 h-5 text-indigo flex-shrink-0" />
      <div className="w-full">
        <p className="text-xs text-gray-400 mb-1.5">Nearing a reflection point...</p>
        <Progress value={progress} className="h-1.5" />
      </div>
    </motion.div>
  );
}