'use client';

import { motion } from 'motion/react';
import { Home, LayoutList, FileText, User } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Screen } from '@/lib/types';

const ACCENT = '#2563EB';
const MUTED  = '#9CA3AF';

interface Tab {
  key: string;
  label: string;
  icon: React.ElementType;
  target?: Screen;
}

const TABS: Tab[] = [
  { key: 'home',      label: 'Home',       icon: Home,       target: 'HOME' },
  { key: 'pipeline',  label: 'Open Deals', icon: LayoutList, target: 'PIPELINE_LIST' },
  { key: 'documents', label: 'Docs',       icon: FileText,   target: 'PENDING_DOCS' },
  { key: 'profile',   label: 'Profile',    icon: User },
];

function resolveActiveTab(screen: Screen): string {
  if (screen === 'PIPELINE_LIST' || screen === 'DEAL_DETAIL') return 'pipeline';
  if (screen === 'PENDING_DOCS') return 'documents';
  return 'home';
}

export function BottomNav() {
  const { screen, navigate } = useApp();
  const activeKey = resolveActiveTab(screen);

  return (
    <nav
      style={{
        /* Normal flow — sits at the bottom of the PhoneFrame flex column.
           No position:fixed needed; the layout keeps it anchored. */
        height: 58,
        flexShrink: 0,
        background: '#FFFFFF',
        borderTop: '1px solid #E5E7EB',
        display: 'flex',
        alignItems: 'stretch',
        zIndex: 40,
      }}
    >
      {TABS.map(({ key, label, icon: Icon, target }) => {
        const isActive = activeKey === key;
        return (
          <motion.button
            key={key}
            onClick={() => target && navigate(target)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 3,
              background: 'none',
              position: 'relative',
            }}
            whileTap={{ scale: 0.86 }}
            transition={{ duration: 0.08 }}
          >
            {isActive && (
              <motion.span
                layoutId="nav-indicator"
                style={{
                  position: 'absolute',
                  top: 0,
                  width: 32,
                  height: 2,
                  borderRadius: '0 0 2px 2px',
                  background: ACCENT,
                }}
                transition={{ type: 'spring', stiffness: 500, damping: 40 }}
              />
            )}
            <Icon
              size={21}
              strokeWidth={isActive ? 2.2 : 1.7}
              style={{ color: isActive ? ACCENT : MUTED }}
            />
            <span
              style={{
                fontSize: 10,
                fontWeight: isActive ? 600 : 400,
                color: isActive ? ACCENT : MUTED,
                letterSpacing: '0.01em',
              }}
            >
              {label}
            </span>
          </motion.button>
        );
      })}
    </nav>
  );
}
