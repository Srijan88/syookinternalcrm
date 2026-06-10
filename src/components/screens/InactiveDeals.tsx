'use client';

import { motion } from 'motion/react';
import { BellRing, ChevronRight } from 'lucide-react';
import { Header } from '@/components/ui/Header';
import { StageChip } from '@/components/ui/StageChip';
import { useApp } from '@/context/AppContext';
import { daysSince } from '@/lib/utils';

const EASE = [0.25, 1, 0.5, 1] as [number, number, number, number];

export function InactiveDeals() {
  const { goBack, navigate, inactiveDeals } = useApp();

  return (
    <div className="flex flex-col bg-bg" style={{ height: '100%' }}>
      <Header title="Needs Attention" onBack={goBack} />

      {/* Banner */}
      <div
        className="mx-4 mt-4"
        style={{
          background: '#FEF3C7',
          borderRadius: 10,
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <BellRing size={15} strokeWidth={2} style={{ color: '#92400E', flexShrink: 0 }} />
        <p style={{ fontSize: 13, color: '#92400E', fontWeight: 500, lineHeight: 1.4 }}>
          No stage change in 7 or more days
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {inactiveDeals.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center"
            style={{ height: 240, gap: 10 }}
          >
            <BellRing size={36} strokeWidth={1.3} style={{ color: '#D1D1D6' }} />
            <p style={{ fontSize: 15, color: '#AEAEB2' }}>All deals are active</p>
          </div>
        ) : (
          <div
            className="mx-4 mt-3"
            style={{
              background: '#FFFFFF',
              borderRadius: 14,
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
            }}
          >
            {inactiveDeals.map((deal, i) => {
              const daysAgo = daysSince(deal.lastActivityDate);
              return (
                <div key={deal.id}>
                  {i > 0 && (
                    <div style={{ height: '0.5px', background: 'rgba(60,60,67,0.18)', marginLeft: 16 }} />
                  )}
                  <motion.button
                    onClick={() => navigate('DEAL_DETAIL', deal.id)}
                    className="w-full text-left"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04, duration: 0.3, ease: EASE }}
                    style={{ padding: '13px 16px', display: 'flex', alignItems: 'center', gap: 12 }}
                    whileTap={{ backgroundColor: '#F2F2F7' }}
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
                      <StageChip stage={deal.stage} size="sm" />
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: '#B91C1C',
                          background: '#FEE2E2',
                          borderRadius: 999,
                          paddingLeft: 8,
                          paddingRight: 8,
                          paddingTop: 3,
                          paddingBottom: 3,
                        }}
                      >
                        {daysAgo}d
                      </span>
                      <ChevronRight size={15} strokeWidth={2} style={{ color: '#AEAEB2' }} />
                    </div>
                  </motion.button>
                </div>
              );
            })}
          </div>
        )}
        <div style={{ height: 16 }} />
      </div>
    </div>
  );
}
