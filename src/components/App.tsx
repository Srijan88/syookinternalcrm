'use client';

import { AnimatePresence, motion } from 'motion/react';
import { AppProvider, useApp } from '@/context/AppContext';
import { PhoneFrame } from '@/components/PhoneFrame';
import { HomeScreen } from '@/components/screens/HomeScreen';
import { PipelineList } from '@/components/screens/PipelineList';
import { DealDetail } from '@/components/screens/DealDetail';
import { PendingDocs } from '@/components/screens/PendingDocs';
import { OnHoldList } from '@/components/screens/OnHoldList';
import { InactiveDeals } from '@/components/screens/InactiveDeals';
import { BottomNav } from '@/components/BottomNav';

function AppRouter() {
  const { screen } = useApp();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={screen}
        initial={{ opacity: 0, x: screen === 'HOME' ? -16 : 16 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: screen === 'HOME' ? 16 : -16 }}
        transition={{ duration: 0.2, ease: [0.25, 1, 0.5, 1] }}
        style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}
      >
        {screen === 'HOME'           && <HomeScreen />}
        {screen === 'PIPELINE_LIST'  && <PipelineList />}
        {screen === 'DEAL_DETAIL'    && <DealDetail />}
        {screen === 'PENDING_DOCS'   && <PendingDocs />}
        {screen === 'ON_HOLD'        && <OnHoldList />}
        {screen === 'INACTIVE_DEALS' && <InactiveDeals />}
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <AppProvider>
      <PhoneFrame>
        {/*
          Flex column that owns the full height between the status-bar spacer
          (added by PhoneFrame) and the home indicator (added by PhoneFrame).
          – Top section: scrollable screen area (flex: 1, overflow hidden so
            each screen manages its own internal scroll)
          – Bottom section: BottomNav in normal flow — never scrolls away
        */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div style={{ flex: 1, overflow: 'hidden', minHeight: 0, position: 'relative' }}>
            <AppRouter />
          </div>
          <BottomNav />
        </div>
      </PhoneFrame>
    </AppProvider>
  );
}
