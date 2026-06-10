import { Stage } from '@/lib/types';

interface StageChipProps {
  stage: Stage;
  isOnHold?: boolean;
  size?: 'sm' | 'md';
}

const stageConfig: Record<Stage, { bg: string; color: string }> = {
  'Contacted':      { bg: '#F3F4F6', color: '#6B7280' },
  'Demo Completed': { bg: '#EFF6FF', color: '#2563EB' },
  'Proposal Sent':  { bg: '#FFFBEB', color: '#D97706' },
  'Won':            { bg: '#F0FDF4', color: '#16A34A' },
};

export function StageChip({ stage, isOnHold, size = 'md' }: StageChipProps) {
  const cfg = isOnHold
    ? { bg: '#F3F4F6', color: '#6B7280' }
    : stageConfig[stage];

  const label = isOnHold ? 'On Hold' : stage;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        backgroundColor: cfg.bg,
        color: cfg.color,
        borderRadius: 999,
        fontWeight: 500,
        letterSpacing: '-0.01em',
        fontSize: size === 'sm' ? 11.5 : 12.5,
        paddingTop: size === 'sm' ? 2 : 3,
        paddingBottom: size === 'sm' ? 2 : 3,
        paddingLeft: size === 'sm' ? 8 : 10,
        paddingRight: size === 'sm' ? 8 : 10,
        lineHeight: 1.4,
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  );
}
