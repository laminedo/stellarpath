import React from 'react';
import { motion } from 'framer-motion';

export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="mx-auto w-full max-w-6xl px-4 pb-28 pt-6"
    >
      {children}
    </motion.main>
  );
}

export function DisclaimerFooter() {
  return (
    <footer className="mx-auto w-full max-w-6xl px-4 pb-24 pt-8 text-center text-xs text-white/30">
      For entertainment and self-reflection purposes only. Not scientifically validated. · Your data never leaves this browser.
    </footer>
  );
}
