'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { useApp } from '@/context/AppContext';
import { Stage } from '@/lib/types';

// Open stages only — Won excluded from stage picker per product spec
const OPEN_STAGES: Stage[] = ['Contacted', 'Demo Completed', 'Proposal Sent', 'Won'];

const stageColors: Record<Stage, string> = {
  'Contacted':      '#6B7280',
  'Demo Completed': '#2563EB',
  'Proposal Sent':  '#D97706',
  'Won':            '#16A34A',
};

export function UpdateStageSheet() {
  const { activeSheet, closeSheet, updateStage, selectedDeal } = useApp();
  const open = activeSheet === 'UPDATE_STAGE';

  const currentStage = selectedDeal?.stage ?? 'Contacted';
  const [selected, setSelected] = useState<Stage>(currentStage);

  function handleConfirm() {
    if (selectedDeal && selected !== currentStage) {
      updateStage(selectedDeal.id, selected);
    }
  }

  const canConfirm = selected !== currentStage;

  return (
    <BottomSheet open={open} onClose={closeSheet} title="Move to stage">
      <div style={{ marginBottom: 20 }}>
        {OPEN_STAGES.map((stage, i) => {
          const isCurrent = stage === currentStage;
          const isSelected = stage === selected;
          const dotColor = stageColors[stage];
          return (
            <div key={stage}>
              {i > 0 && <div style={{ height: '0.5px', background: '#E5E7EB', marginLeft: 20 }} />}
              <motion.button
                onClick={() => setSelected(stage)}
                className="w-full flex items-center gap-3 text-left"
                style={{ padding: '13px 0' }}
                whileTap={{ opacity: 0.6 }}
                transition={{ duration: 0.08 }}
              >
                <div style={{
                  width: 20, height: 20, borderRadius: '50%',
                  border: `2px solid ${isSelected ? dotColor : '#E5E7EB'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  transition: 'border-color 0.15s',
                }}>
                  {isSelected && (
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: dotColor }} />
                  )}
                </div>
                <span style={{ fontSize: 15, fontWeight: 400, color: '#111827', letterSpacing: '-0.01em', flex: 1 }}>
                  {stage}
                </span>
                {isCurrent && (
                  <span style={{ fontSize: 11.5, color: '#9CA3AF', fontWeight: 500 }}>Current</span>
                )}
                {isSelected && !isCurrent && (
                  <CheckCircle2 size={16} strokeWidth={2} style={{ color: dotColor }} />
                )}
              </motion.button>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <motion.button
          onClick={closeSheet}
          style={{
            flex: 1, height: 48, borderRadius: 12,
            border: '1.5px solid #E5E7EB', background: 'transparent',
            fontSize: 15, fontWeight: 500, color: '#374151', letterSpacing: '-0.01em',
          }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.08 }}
        >
          Cancel
        </motion.button>
        <motion.button
          onClick={handleConfirm}
          disabled={!canConfirm}
          style={{
            flex: 1, height: 48, borderRadius: 12,
            background: canConfirm ? '#2563EB' : '#E5E7EB',
            fontSize: 15, fontWeight: 600, color: canConfirm ? '#FFFFFF' : '#9CA3AF',
            letterSpacing: '-0.01em', transition: 'background 0.2s, color 0.2s',
          }}
          whileTap={canConfirm ? { scale: 0.97 } : {}}
          transition={{ duration: 0.08 }}
        >
          Confirm
        </motion.button>
      </div>
    </BottomSheet>
  );
}
