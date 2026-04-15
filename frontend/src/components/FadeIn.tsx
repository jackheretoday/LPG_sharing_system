import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface FadeInProps {
  children: ReactNode;
  delayMs: number;
  durationMs: number;
  className?: string;
}

export function FadeIn({ children, delayMs, durationMs, className = "" }: FadeInProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: durationMs / 1000,
        delay: delayMs / 1000,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  );
}
