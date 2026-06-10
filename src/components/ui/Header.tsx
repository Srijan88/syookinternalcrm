'use client';

import { motion } from 'motion/react';
import { ChevronLeft } from 'lucide-react';

interface HeaderProps {
  title: string;
  onBack?: () => void;
  right?: React.ReactNode;
}

export function Header({ title, onBack, right }: HeaderProps) {
  return (
    <header
      className="flex items-center justify-between px-4 bg-surface sticky top-0 z-10"
      style={{
        height: 52,
        borderBottom: '0.5px solid rgba(60,60,67,0.18)',
      }}
    >
      {/* Left */}
      <div style={{ width: 72 }}>
        {onBack && (
          <motion.button
            onClick={onBack}
            className="flex items-center gap-0.5 text-accent"
            style={{ fontSize: 17, fontWeight: 400, color: '#1A4F9C', letterSpacing: '-0.01em' }}
            whileTap={{ opacity: 0.5 }}
            transition={{ duration: 0.08 }}
          >
            <ChevronLeft size={22} strokeWidth={2} style={{ color: '#1A4F9C' }} />
            Back
          </motion.button>
        )}
      </div>

      {/* Title */}
      <h1
        className="absolute left-1/2 -translate-x-1/2"
        style={{ fontSize: 17, fontWeight: 600, color: '#1C1C1E', letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}
      >
        {title}
      </h1>

      {/* Right */}
      <div style={{ width: 72, display: 'flex', justifyContent: 'flex-end' }}>
        {right}
      </div>
    </header>
  );
}
