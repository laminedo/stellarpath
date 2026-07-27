import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/helpers';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function GlassCard({ children, className, hover = true }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={hover ? { y: -6, scale: 1.01 } : undefined}
      className={cn(
        'rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg',
        'shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-shadow duration-300',
        hover && 'hover:border-nebula-purple/40 hover:shadow-[0_12px_40px_rgba(139,92,246,0.25)]',
        className
      )}
    >
      {children}
    </motion.div>
  );
}
