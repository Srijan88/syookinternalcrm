'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Header } from '@/components/ui/Header';
import { StageChip } from '@/components/ui/StageChip';
import { useApp } from '@/context/AppContext';
import { daysSince } from '@/lib/utils';
import { Stage } from '@/lib/types';

const EASE = [0.25, 1, 0.5, 1] as [number, number, number, number];

type FilterKey = 'All' | Exclude<Stage, 'Won'>;

// Won is excluded — open deals only
const FILTERS: FilterKey[] = ['All', 'Contacted', 'Demo Completed', 'Proposal Sent'];

const FILTER_LABELS: Record<FilterKey, string> = {
  'All': 'All',
  'Contacted': 'Contacted',
  'Demo Completed': 'Demo',
  'Proposal Sent': 'Proposal',
};

export function PipelineList() {
  const { goBack, navigate, pipelineDeals } = useApp();
  const [activeFilter, setActiveFilter] = useState<FilterKey>('All');

  // Only show non-Won deals in open pipeline
  const openDeals = pipelineDeals.filter(d => d.stage !== 'Won');
  const filtered = activeFilter === 'All'
    ? openDeals
    : openDeals.filter(d => d.stage === activeFilter);

  const countFor = (f: FilterKey) =>
    f === 'All' ? openDeals.length : openDeals.filter(d => d.stage === f).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#F8F7F5' }}>
      <Header title="Open Deals" onBack={goBack} />

      {/* ── Horizontal pill filter bar ── */}
      <div
        style={{
          display: 'flex',
          gap: 6,
          paddingLeft: 16,
          paddingRight: 16,
          paddingTop: 12,
          paddingBottom: 8,
          overflowX: 'auto',
          flexShrink: 0,
        }}
      >
        {FILTERS.map((f) => {
          const isActive = activeFilter === f;
          const count = countFor(f);
          return (
            <motion.button
              key={f}
              onClick={() => setActiveFilter(f)}
              style={{
                position: 'relative',
                flexShrink: 0,
                height: 32,
                paddingLeft: 13,
                paddingRight: 13,
                borderRadius: 999,
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                overflow: 'hidden',
                border: `1px solid ${isActive ? 'transparent' : '#E5E7EB'}`,
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.08 }}
            >
              {/* Sliding fill */}
              {isActive && (
                <motion.span
                  layoutId="filter-pill"
                  style={{
                    position: 'absolute', inset: 0,
                    background: '#111827',
                    borderRadius: 999,
                  }}
                  transition={{ type: 'spring', stiffness: 500, damping: 38 }}
                />
              )}
              <span style={{
                position: 'relative', zIndex: 1,
                fontSize: 13, fontWeight: isActive ? 600 : 400,
                color: isActive ? '#FFFFFF' : '#6B7280',
                letterSpacing: '-0.01em',
                whiteSpace: 'nowrap',
              }}>
                {FILTER_LABELS[f]}
              </span>
              <span style={{
                position: 'relative', zIndex: 1,
                fontSize: 11, fontWeight: 600,
                color: isActive ? 'rgba(255,255,255,0.65)' : '#9CA3AF',
              }}>
                {count}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* ── Deal list ── */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 16 }}>
        {filtered.length === 0 ? (
          <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ fontSize: 14, color: '#9CA3AF' }}>No deals in this stage</p>
          </div>
        ) : (
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.18, ease: EASE }}
            style={{
              margin: '4px 16px 0',
              background: '#FFFFFF',
              borderRadius: 14,
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
            }}
          >
            {filtered.map((deal, i) => {
              const daysAgo = daysSince(deal.lastActivityDate);
              const isStale = daysAgo >= 7;
              return (
                <div key={deal.id}>
                  {i > 0 && <div style={{ height: '0.5px', background: '#E5E7EB', marginLeft: 16 }} />}
                  <motion.button
                    onClick={() => navigate('DEAL_DETAIL', deal.id)}
                    className="w-full text-left"
                    style={{
                      padding: '12px 14px 11px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      borderLeft: isStale ? '3px solid #D97706' : '3px solid transparent',
                    }}
                    whileTap={{ backgroundColor: '#F8F7F5' }}
                    transition={{ duration: 0.06 }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 5 }}>
                        <p style={{
                          fontSize: 14, fontWeight: 600, color: '#111827',
                          letterSpacing: '-0.02em', lineHeight: 1.2,
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>
                          {deal.account}
                        </p>
                        {deal.hasPendingDocument && (
                          <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#D97706', flexShrink: 0 }} />
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <StageChip stage={deal.stage} size="sm" />
                        <span style={{ fontSize: 11, color: isStale ? '#D97706' : '#9CA3AF', fontWeight: isStale ? 600 : 400 }}>
                          {daysAgo === 0 ? 'Today' : `${daysAgo}d ago`}
                        </span>
                      </div>
                    </div>

                    <div style={{ flexShrink: 0, textAlign: 'right' }}>
                      <p style={{ fontSize: 13.5, fontWeight: 600, color: '#111827', letterSpacing: '-0.02em' }}>
                        {deal.value}
                      </p>
                    </div>
                  </motion.button>
                </div>
              );
            })}
          </motion.div>
        )}
        <div style={{ height: 16 }} />
      </div>
    </div>
  );
}
