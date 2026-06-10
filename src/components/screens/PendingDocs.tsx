'use client';

import { motion } from 'motion/react';
import { FileClock, Paperclip } from 'lucide-react';
import { Header } from '@/components/ui/Header';
import { StageChip } from '@/components/ui/StageChip';
import { AttachDocumentSheet } from '@/components/sheets/AttachDocumentSheet';
import { useApp } from '@/context/AppContext';

const EASE = [0.25, 1, 0.5, 1] as [number, number, number, number];

export function PendingDocs() {
  const { goBack, pendingDocDeals, openSheet, setPendingAttachDealId, activeSheet } = useApp();

  function handleAttach(dealId: string) {
    setPendingAttachDealId(dealId);
    openSheet('ATTACH_FROM_PENDING');
  }

  return (
    <div className="flex flex-col bg-bg" style={{ height: '100%' }}>
      <Header title="Pending Documents" onBack={goBack} />

      <div className="flex-1 overflow-y-auto">
        {pendingDocDeals.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center"
            style={{ height: 280, gap: 10 }}
          >
            <FileClock size={36} strokeWidth={1.3} style={{ color: '#D1D1D6' }} />
            <p style={{ fontSize: 15, color: '#AEAEB2' }}>All documents up to date</p>
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
            {pendingDocDeals.map((deal, i) => (
              <div key={deal.id}>
                {i > 0 && (
                  <div style={{ height: '0.5px', background: 'rgba(60,60,67,0.18)', marginLeft: 16 }} />
                )}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04, duration: 0.3, ease: EASE }}
                  style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}
                >
                  <div className="flex-1 min-w-0">
                    <p
                      className="truncate"
                      style={{
                        fontSize: 15,
                        fontWeight: 500,
                        color: '#1C1C1E',
                        letterSpacing: '-0.01em',
                        marginBottom: 5,
                      }}
                    >
                      {deal.account}
                    </p>
                    <div className="flex items-center gap-2">
                      <StageChip stage={deal.stage} size="sm" />
                      <span style={{ fontSize: 12, color: '#92400E', fontWeight: 500 }}>
                        Doc needed
                      </span>
                    </div>
                  </div>

                  <motion.button
                    onClick={() => handleAttach(deal.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 5,
                      height: 34,
                      paddingLeft: 12,
                      paddingRight: 12,
                      borderRadius: 999,
                      background: '#E6EDF8',
                      fontSize: 13,
                      fontWeight: 600,
                      color: '#1A4F9C',
                      flexShrink: 0,
                      letterSpacing: '-0.01em',
                    }}
                    whileTap={{ scale: 0.94 }}
                    transition={{ duration: 0.08 }}
                  >
                    <Paperclip size={13} strokeWidth={2} />
                    Attach
                  </motion.button>
                </motion.div>
              </div>
            ))}
          </div>
        )}
        <div style={{ height: 16 }} />
      </div>

      {activeSheet === 'ATTACH_FROM_PENDING' && <AttachDocumentSheet />}
    </div>
  );
}
