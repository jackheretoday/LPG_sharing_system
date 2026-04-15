import { motion } from 'framer-motion';

interface AnimatedHeadingProps {
  text: string;
  className?: string;
}

export function AnimatedHeading({ text, className = "" }: AnimatedHeadingProps) {
  // Split lines on \n, then char by char
  const lines = text.split('\n');
  
  return (
    <h1 className={className} style={{ letterSpacing: '-0.04em' }}>
      {lines.map((line, lineIndex) => (
        <span key={lineIndex} className="block">
          {line.split('').map((char, charIndex) => {
            // Use \u00A0 for spaces to maintain layout
            const charContent = char === ' ' ? '\u00A0' : char;
            
            return (
              <motion.span
                key={`${lineIndex}-${charIndex}`}
                className="inline-block"
                initial={{ opacity: 0, x: -18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.2 + (lineIndex * line.length + charIndex) * 0.03, // 200ms init delay + 30ms charDelay
                  ease: "easeOut"
                }}
              >
                {charContent}
              </motion.span>
            );
          })}
        </span>
      ))}
    </h1>
  );
}
