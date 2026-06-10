'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useEffect } from 'react';

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export function BottomSheet({ open, onClose, children, title }: BottomSheetProps) {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="bd"
            className="fixed inset-0 z-40 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={onClose}
          />

          <motion.div
            key="sheet"
            className="fixed bottom-0 left-0 right-0 z-50 bg-surface overflow-hidden"
            style={{
              borderRadius: '20px 20px 0 0',
              maxHeight: '88dvh',
              overflowY: 'auto',
              paddingBottom: 'env(safe-area-inset-bottom, 16px)',
            }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 400, damping: 40 }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2 sticky top-0 bg-surface z-10">
              <div
                className="rounded-pill bg-sep-opaque"
                style={{ width: 36, height: 4, backgroundColor: '#D1D1D6' }}
              />
            </div>

            {title && (
              <div className="px-5 pb-3 pt-1">
                <h2 style={{ fontSize: 17, fontWeight: 600, color: '#1C1C1E', letterSpacing: '-0.01em' }}>
                  {title}
                </h2>
              </div>
            )}

            <div className="px-5 pb-6 pt-2">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
