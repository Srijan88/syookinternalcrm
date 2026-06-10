'use client';

import { motion } from 'motion/react';
import {
  Bell, Briefcase, FileWarning, CirclePause, Trophy,
  ChevronRight, BadgeCheck, FileText, Building2, TrendingUp,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { todayLabel, daysSince } from '@/lib/utils';
import { Screen } from '@/lib/types';

const SPRING = [0.25, 1, 0.5, 1] as [number, number, number, number];

interface CardCfg {
  label: string;
  count: number;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  countColor: string;
  target?: Screen;
}

export function HomeScreen() {
  const { navigate, pipelineDeals, pendingDocDeals, onHoldDeals, wonCount, bellCount } = useApp();

  const cards: CardCfg[] = [
    {
      label: 'Open Deals',
      count: pipelineDeals.length,
      icon: Briefcase,
      iconBg: '#EFF6FF',
      iconColor: '#2563EB',
      countColor: '#2563EB',
      target: 'PIPELINE_LIST',
    },
    {
      label: 'Missing Docs',
      count: pendingDocDeals.length,
      icon: FileWarning,
      iconBg: '#FFF1F2',
      iconColor: '#E11D48',
      countColor: '#E11D48',
      target: 'PENDING_DOCS',
    },
    {
      label: 'On Hold',
      count: onHoldDeals.length,
      icon: CirclePause,
      iconBg: '#FFFBEB',
      iconColor: '#D97706',
      countColor: '#D97706',
      target: 'ON_HOLD',
    },
    {
      label: 'Won Deals',
      count: wonCount,
      icon: Trophy,
      iconBg: '#F0FDF4',
      iconColor: '#16A34A',
      countColor: '#16A34A',
    },
  ];

  return (
    /*
     * Outer: fixed height column, no scroll — header + cards always visible.
     * Inner scroll area: only the Missing Documents list scrolls.
     */
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#F8F7F5', overflow: 'hidden' }}>

      {/* ══ NON-SCROLLING TOP SECTION: gradient header + 2×2 cards ══ */}
      <div style={{ flexShrink: 0 }}>

      {/* ── Compact gradient header ── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32, ease: SPRING }}
        style={{
          background: 'linear-gradient(148deg, #0B2559 0%, #1A4F9C 55%, #2563EB 100%)',
          paddingTop: 52,
          paddingLeft: 20,
          paddingRight: 20,
          paddingBottom: 24,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Single subtle orb — low opacity */}
        <div style={{
          position: 'absolute', right: -30, top: -30,
          width: 160, height: 160, borderRadius: '50%',
          background: 'rgba(255,255,255,0.04)',
          pointerEvents: 'none',
        }} />

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 5, fontWeight: 500 }}>
              {todayLabel()}
            </p>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: 7 }}>
              Priya Singh
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}>
              {[
                { icon: TrendingUp, text: 'Sales Associate' },
                { icon: Building2, text: 'Syook' },
                { icon: BadgeCheck, text: '781101SY' },
              ].map(({ icon: Icon, text }, i) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  {i > 0 && <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>·</span>}
                  <Icon size={11} strokeWidth={1.8} style={{ color: 'rgba(255,255,255,0.7)' }} />
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', letterSpacing: '-0.01em' }}>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bell */}
          <motion.button
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1, ease: SPRING }}
            onClick={() => navigate('INACTIVE_DEALS')}
            style={{
              position: 'relative', width: 38, height: 38, borderRadius: '50%',
              background: 'rgba(255,255,255,0.13)',
              border: '1px solid rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, marginTop: 2,
            }}
            whileTap={{ scale: 0.88 }}
          >
            <Bell size={17} strokeWidth={1.8} style={{ color: '#FFFFFF' }} />
            {bellCount > 0 && (
              <motion.span
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.4, delay: 0.6 }}
                style={{
                  position: 'absolute', top: -3, right: -3,
                  minWidth: 17, height: 17, borderRadius: 9,
                  background: '#EF4444', color: '#fff',
                  fontSize: 10, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  paddingLeft: 3, paddingRight: 3,
                  border: '2px solid #1A4F9C',
                }}
              >
                {bellCount}
              </motion.span>
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* ── 2×2 card grid — overlaps header ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 10,
          margin: '14px 16px 0',
        }}
      >
        {cards.map((card, i) => {
          const Icon = card.icon;
          const tappable = Boolean(card.target);
          return (
            <motion.button
              key={card.label}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, delay: i * 0.015, ease: SPRING }}
              onClick={() => card.target && navigate(card.target)}
              disabled={!tappable}
              style={{
                background: '#FFFFFF',
                borderRadius: 16,
                padding: '13px 13px 11px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                boxShadow: '0 1px 3px rgba(0,0,0,0.07), 0 0 0 0.5px rgba(0,0,0,0.04)',
                textAlign: 'left',
                cursor: tappable ? 'pointer' : 'default',
              }}
              whileTap={tappable ? { scale: 0.96, backgroundColor: '#F9F9FB' } : {}}
            >
              <div style={{
                width: 34, height: 34, borderRadius: 10,
                background: card.iconBg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 10,
              }}>
                <Icon size={17} strokeWidth={1.7} style={{ color: card.iconColor }} />
              </div>
              <span style={{ fontSize: 11, color: '#6B7280', letterSpacing: '-0.005em', marginBottom: 3, fontWeight: 500, lineHeight: 1.2 }}>
                {card.label}
              </span>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', width: '100%' }}>
                <span style={{ fontSize: 26, fontWeight: 700, color: '#111827', letterSpacing: '-0.045em', lineHeight: 1 }}>
                  {card.count}
                </span>
                {tappable && (
                  <ChevronRight size={14} strokeWidth={2} style={{ color: '#D1D5DB', marginBottom: 2, flexShrink: 0 }} />
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      </div>{/* end NON-SCROLLING TOP SECTION */}

      {/* ══ SCROLLABLE BOTTOM SECTION: Missing Documents list ══ */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 16 }}>

      {/* ── Missing Documents ── */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1, ease: SPRING }}
        style={{ margin: '16px 16px 0' }}
      >
        {/* Section header */}
        <motion.button
          className="w-full text-left"
          onClick={() => navigate('PENDING_DOCS')}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 8,
            padding: '0 2px',
          }}
          whileTap={{ opacity: 0.6 }}
          transition={{ duration: 0.06 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{
              width: 20, height: 20, borderRadius: 6,
              background: '#FFF1F2',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <FileWarning size={11} strokeWidth={2} style={{ color: '#E11D48' }} />
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#111827', letterSpacing: '-0.01em' }}>
              Missing documents
            </span>
            {pendingDocDeals.length > 0 && (
              <span style={{
                fontSize: 10, fontWeight: 700,
                color: '#E11D48',
                background: '#FFF1F2',
                borderRadius: 999,
                paddingLeft: 6, paddingRight: 6, paddingTop: 1, paddingBottom: 1,
              }}>
                {pendingDocDeals.length}
              </span>
            )}
          </div>
          <span style={{ fontSize: 12, color: '#E11D48', fontWeight: 500 }}>
            See all
          </span>
        </motion.button>

        {/* List card */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: 14,
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          border: '1px solid #FFE4E6',
        }}>
          {pendingDocDeals.length === 0 ? (
            <div style={{ padding: '20px 16px', textAlign: 'center', color: '#9CA3AF', fontSize: 13 }}>
              All documents up to date
            </div>
          ) : (
            pendingDocDeals.slice(0, 5).map((deal, i) => {
              const daysAgo = daysSince(deal.lastActivityDate);
              return (
                <div key={deal.id}>
                  {i > 0 && <div style={{ height: '0.5px', background: '#FFE4E6', marginLeft: 56 }} />}
                  <motion.button
                    onClick={() => navigate('DEAL_DETAIL', deal.id)}
                    className="w-full text-left"
                    style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10 }}
                    whileTap={{ backgroundColor: '#F8F7F5' }}
                    transition={{ duration: 0.06 }}
                  >
                    <div style={{
                      width: 30, height: 30, borderRadius: 8,
                      background: '#FFF1F2',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <FileText size={13} strokeWidth={1.8} style={{ color: '#E11D48' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13.5, fontWeight: 500, color: '#111827', letterSpacing: '-0.01em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {deal.account}
                      </p>
                      <p style={{ fontSize: 11.5, color: '#9CA3AF', marginTop: 1 }}>
                        {deal.stage} · {daysAgo === 0 ? 'Today' : `${daysAgo}d ago`}
                      </p>
                    </div>
                    <ChevronRight size={13} strokeWidth={2} style={{ color: '#D1D5DB', flexShrink: 0 }} />
                  </motion.button>
                </div>
              );
            })
          )}
        </div>
      </motion.div>

      </div>{/* end SCROLLABLE BOTTOM SECTION */}
    </div>
  );
}
