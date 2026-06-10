'use client';

import { motion } from 'motion/react';
import { Play } from 'lucide-react';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { useApp } from '@/context/AppContext';

interface ResumeConfirmSheetProps {
  dealId?: string;
}

export function ResumeConfirmSheet({ dealId }: ResumeConfirmSheetProps) {
  const { activeSheet, closeSheet, resumeDeal, deals } = useApp();
  const open = activeSheet === 'RESUME_CONFIRM';
  const deal = dealId ? deals.find(d => d.id === dealId) : null;

  function handleConfirm() {
    if (deal) resumeDeal(deal.id);
  }

  return (
    <BottomSheet open={open} onClose={closeSheet}>
      <div style={{ marginBottom: 24, paddingTop: 4 }}>
        <h2
          style={{
            fontSize: 20,
            fontWeight: 600,
            color: '#1C1C1E',
            letterSpacing: '-0.02em',
            marginBottom: 8,
            lineHeight: 1.25,
          }}
        >
          Resume {deal?.account}?
        </h2>
        <p style={{ fontSize: 15, color: '#6C6C70', lineHeight: 1.5 }}>
          This deal will return to{' '}
          <span style={{ fontWeight: 500, color: '#1C1C1E' }}>
            {deal?.previousStage ?? 'its previous stage'}
          </span>{' '}
          and appear in your pipeline.
        </p>
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <motion.button
          onClick={closeSheet}
          style={{
            flex: 1, height: 50, borderRadius: 14,
            background: '#F2F2F7', fontSize: 16, fontWeight: 500,
            color: '#1C1C1E', letterSpacing: '-0.01em',
          }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.08 }}
        >
          Cancel
        </motion.button>
        <motion.button
          onClick={handleConfirm}
          style={{
            flex: 1, height: 50, borderRadius: 14,
            background: '#1A4F9C', fontSize: 16, fontWeight: 600,
            color: '#FFFFFF', letterSpacing: '-0.01em',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
          }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.08 }}
        >
          <Play size={14} strokeWidth={2.5} fill="currentColor" />
          Resume
        </motion.button>
      </div>
    </BottomSheet>
  );
}
