'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { useApp } from '@/context/AppContext';
import { HOLD_REASONS } from '@/lib/types';

export function PutOnHoldSheet() {
  const { activeSheet, closeSheet, selectedDeal, putOnHold } = useApp();
  const open = activeSheet === 'PUT_ON_HOLD';

  const [selected, setSelected] = useState<string | null>(null);
  const [otherText, setOtherText] = useState('');
  const [inputFocused, setInputFocused] = useState(false);

  const canConfirm = selected !== null || otherText.trim().length > 0;

  function handleChip(reason: string) {
    setSelected(reason === selected ? null : reason);
    setOtherText('');
  }

  function handleOther(val: string) {
    setOtherText(val);
    if (val.trim()) setSelected(null);
  }

  function handleConfirm() {
    if (!selectedDeal || !canConfirm) return;
    putOnHold(selectedDeal.id, otherText.trim() || selected!);
    reset();
  }

  function reset() {
    setSelected(null);
    setOtherText('');
    setInputFocused(false);
  }

  function handleClose() {
    closeSheet();
    reset();
  }

  return (
    <BottomSheet open={open} onClose={handleClose}>
      {/* Title + subtitle */}
      <div style={{ marginBottom: 18 }}>
        <h2 style={{
          fontSize: 19, fontWeight: 700, color: '#111827',
          letterSpacing: '-0.025em', marginBottom: 5, lineHeight: 1.25,
        }}>
          Put {selectedDeal?.account} on hold
        </h2>
        <p style={{ fontSize: 13.5, color: '#6B7280', lineHeight: 1.55 }}>
          Choose a reason. You can resume this deal any time.
        </p>
      </div>

      {/* Reason chips — fixed 36px height, wrap */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
        {HOLD_REASONS.map((reason) => {
          const isActive = selected === reason;
          return (
            <motion.button
              key={reason}
              onClick={() => handleChip(reason)}
              style={{
                height: 36,
                paddingLeft: 14,
                paddingRight: 14,
                borderRadius: 18,
                border: `1.5px solid ${isActive ? '#111827' : '#E5E7EB'}`,
                background: isActive ? '#111827' : 'transparent',
                fontSize: 13,
                fontWeight: isActive ? 500 : 400,
                color: isActive ? '#FFFFFF' : '#374151',
                letterSpacing: '-0.01em',
                transition: 'border-color 0.15s, background 0.15s, color 0.15s',
                display: 'flex',
                alignItems: 'center',
                lineHeight: 1,
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.08 }}
            >
              {reason}
            </motion.button>
          );
        })}
      </div>

      {/* Other reason */}
      <div style={{ marginBottom: 22 }}>
        <p style={{ fontSize: 11.5, fontWeight: 500, color: '#9CA3AF', marginBottom: 7, letterSpacing: '0.015em', textTransform: 'uppercase' }}>
          Other reason
        </p>
        <input
          type="text"
          value={otherText}
          onChange={e => handleOther(e.target.value)}
          onFocus={() => setInputFocused(true)}
          onBlur={() => setInputFocused(false)}
          placeholder="Describe the situation..."
          style={{
            width: '100%', height: 44, borderRadius: 12,
            border: `1.5px solid ${inputFocused ? '#2563EB' : 'transparent'}`,
            background: '#F3F4F6',
            paddingLeft: 13, paddingRight: 13,
            fontSize: 14.5, color: '#111827',
            outline: 'none',
            transition: 'border-color 0.15s',
          }}
        />
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: 10 }}>
        <motion.button
          onClick={handleClose}
          style={{
            flex: 1, height: 50, borderRadius: 12,
            border: '1.5px solid #E5E7EB', background: 'transparent',
            fontSize: 15, fontWeight: 500, color: '#374151',
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
            flex: 1, height: 50, borderRadius: 12,
            background: canConfirm ? '#111827' : '#E5E7EB',
            fontSize: 15, fontWeight: 600,
            color: canConfirm ? '#FFFFFF' : '#9CA3AF',
            letterSpacing: '-0.01em',
            transition: 'background 0.25s, color 0.25s',
          }}
          whileTap={canConfirm ? { scale: 0.97 } : {}}
          transition={{ duration: 0.08 }}
        >
          Hold deal
        </motion.button>
      </div>
    </BottomSheet>
  );
}
