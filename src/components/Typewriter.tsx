import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
const sentence = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      delay: 0.5,
      staggerChildren: 0.08,
    },
  },
};
const letter = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
  },
};
const cursorVariants = {
  blinking: {
    opacity: [0, 1, 0],
    transition: {
      duration: 1,
      repeat: Infinity,
      repeatDelay: 0,
      times: [0, 0.5, 1]
    }
  }
};
export function Typewriter({ text, className }: { text: string; className?: string }) {
  return (
    <motion.div
      className={cn("flex items-center justify-center", className)}
      variants={sentence}
      initial="hidden"
      animate="visible"
    >
      {text.split('').map((char, index) => (
        <motion.span key={char + '-' + index} variants={letter}>
          {char}
        </motion.span>
      ))}
      <motion.span
        variants={cursorVariants}
        animate="blinking"
        className="inline-block w-0.5 h-5 ml-2 bg-teal"
      />
    </motion.div>
  );
}