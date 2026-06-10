'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { PauseCircle, Play } from 'lucide-react';
import { Header } from '@/components/ui/Header';
import { StageChip } from '@/components/ui/StageChip';
import { ResumeConfirmSheet } from '@/components/sheets/ResumeConfirmSheet';
import { useApp } from '@/context/AppContext';

const EASE = [0.25, 1, 0.5, 1] as [number, number, number, number];

export function OnHoldList() {
  const { goBack, onHoldDeals, openSheet } = useApp();
  const [resumeDealId, setResumeDealId] = useState<string | undefined>(undefined);

  function handleResume(dealId: string) {
    setResumeDealId(dealId);
    openSheet('RESUME_CONFIRM');
  }

  return (
    <div className="flex flex-col bg-bg" style={{ height: '100%' }}>
      <Header title="On Hold" onBack={goBack} />

      <div className="flex-1 overflow-y-auto">
        {onHoldDeals.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center"
            style={{ height: 280, gap: 10 }}
          >
            <PauseCircle size={36} strokeWidth={1.3} style={{ color: '#D1D1D6' }} />
            <p style={{ fontSize: 15, color: '#AEAEB2' }}>No deals on hold</p>
          </div>
        ) : (
          <div
            className="mx-4 mt-4"
            style={{
              background: '#FFFFFF',
              borderRadius: 14,
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
            }}
          >
            {onHoldDeals.map((deal, i) => (
              <div key={deal.id}>
                {i > 0 && (
                  <div style={{ height: '0.5px', background: 'rgba(60,60,67,0.18)', marginLeft: 16 }} />
                )}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04, duration: 0.3, ease: EASE }}
                  style={{ padding: '14px 16px' }}
                >
                  {/* Top row: name + paused duration */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <p
                      style={{
                        fontSize: 15,
                        fontWeight: 500,
                        color: '#1C1C1E',
                        letterSpacing: '-0.01em',
                        lineHeight: 1.3,
                      }}
                      className="flex-1 min-w-0 truncate"
                    >
                      {deal.account}
                    </p>
                    <span style={{ fontSize: 12, color: '#AEAEB2', flexShrink: 0 }}>
                      {deal.daysPaused ?? 0}d paused
                    </span>
                  </div>

                  {/* Stage + reason */}
                  <div style={{ marginBottom: 12 }}>
                    <StageChip stage={deal.stage} isOnHold size="sm" />
                    <p style={{ fontSize: 13, color: '#6C6C70', marginTop: 5, lineHeight: 1.4 }}>
                      {deal.holdReason}
                    </p>
                  </div>

                  {/* Resume button */}
                  <motion.button
                    onClick={() => handleResume(deal.id)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      height: 36,
                      paddingLeft: 16,
                      paddingRight: 16,
                      borderRadius: 999,
                      background: '#1A4F9C',
                      fontSize: 13,
                      fontWeight: 600,
                      color: '#FFFFFF',
                      letterSpacing: '-0.01em',
                    }}
                    whileTap={{ scale: 0.94 }}
                    transition={{ duration: 0.08 }}
                  >
                    <Play size={12} strokeWidth={2.5} fill="currentColor" />
                    Resume Deal
                  </motion.button>
                </motion.div>
              </div>
            ))}
          </div>
        )}
        <div style={{ height: 16 }} />
      </div>

      <ResumeConfirmSheet dealId={resumeDealId} />
    </div>
  );
}
