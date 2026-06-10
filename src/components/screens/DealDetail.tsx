'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, Plus, PauseCircle, ArrowUpCircle, ChevronRight, Trash2, AlertCircle } from 'lucide-react';
import { Header } from '@/components/ui/Header';
import { StageChip } from '@/components/ui/StageChip';
import { UpdateStageSheet } from '@/components/sheets/UpdateStageSheet';
import { AttachDocumentSheet } from '@/components/sheets/AttachDocumentSheet';
import { PutOnHoldSheet } from '@/components/sheets/PutOnHoldSheet';
import { useApp } from '@/context/AppContext';
import { formatDate, daysSince } from '@/lib/utils';

const EASE = [0.25, 1, 0.5, 1] as [number, number, number, number];

function SectionLabel({ label }: { label: string }) {
  return (
    <p style={{
      fontSize: 12,
      fontWeight: 600,
      color: '#6B7280',
      letterSpacing: '0.01em',
      marginBottom: 6,
      marginTop: 22,
      paddingLeft: 2,
    }}>
      {label}
    </p>
  );
}

export function DealDetail() {
  const { goBack, selectedDeal, openSheet, deleteDocument } = useApp();
  // docId pending delete confirmation; null = none
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  if (!selectedDeal) return null;

  const daysAgo = daysSince(selectedDeal.lastActivityDate);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#F8F7F5' }}>
      <Header title={selectedDeal.account} onBack={goBack} />

      <div
        style={{ flex: 1, overflowY: 'auto', paddingBottom: 24, paddingLeft: 16, paddingRight: 16 }}
        onClick={() => { if (pendingDeleteId) setPendingDeleteId(null); }}
      >

        {/* ── Hero card ── */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: EASE }}
          style={{
            background: '#FFFFFF',
            borderRadius: 14,
            padding: '16px 16px 14px',
            marginTop: 14,
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          }}
        >
          <p style={{
            fontSize: 30, fontWeight: 700, color: '#111827',
            letterSpacing: '-0.04em', lineHeight: 1, marginBottom: 8,
          }}>
            {selectedDeal.value}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <StageChip stage={selectedDeal.stage} isOnHold={selectedDeal.isOnHold} size="md" />
            {selectedDeal.isOnHold && selectedDeal.holdReason && (
              <span style={{ fontSize: 12, color: '#6B7280' }}>{selectedDeal.holdReason}</span>
            )}
          </div>
          <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 8, letterSpacing: '-0.005em' }}>
            Last activity {daysAgo === 0 ? 'today' : `${daysAgo}d ago`}
          </p>
        </motion.div>

        {/* ── Documents ── */}
        <SectionLabel label="Documents" />
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, delay: 0.05, ease: EASE }}
          style={{
            background: '#FFFFFF',
            borderRadius: 14,
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          }}
        >
          {selectedDeal.documents.length === 0 ? (
            <div style={{ padding: '18px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <FileText size={16} strokeWidth={1.5} style={{ color: '#D1D5DB' }} />
              <p style={{ fontSize: 13.5, color: '#9CA3AF' }}>No documents yet</p>
            </div>
          ) : (
            selectedDeal.documents.map((doc, i) => {
              const isPending = pendingDeleteId === doc.id;
              return (
                <div key={doc.id}>
                  {i > 0 && <div style={{ height: '0.5px', background: isPending ? '#FEE2E2' : '#E5E7EB', marginLeft: 50 }} />}
                  <motion.div
                    animate={{ backgroundColor: isPending ? '#FFF5F5' : '#FFFFFF' }}
                    transition={{ duration: 0.18 }}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px' }}
                  >
                    {/* File icon */}
                    <div style={{
                      width: 32, height: 32, borderRadius: 8,
                      background: isPending ? '#FEE2E2' : '#EFF6FF',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      transition: 'background 0.18s',
                    }}>
                      {isPending
                        ? <AlertCircle size={14} strokeWidth={1.8} style={{ color: '#EF4444' }} />
                        : <FileText size={14} strokeWidth={1.8} style={{ color: '#2563EB' }} />
                      }
                    </div>

                    {/* Name + date */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p className="truncate" style={{
                        fontSize: 13.5, fontWeight: 500, letterSpacing: '-0.01em',
                        color: isPending ? '#EF4444' : '#111827',
                        transition: 'color 0.18s',
                      }}>
                        {doc.filename}
                      </p>
                      <AnimatePresence mode="wait" initial={false}>
                        {isPending ? (
                          <motion.p
                            key="confirm"
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={{ duration: 0.14 }}
                            style={{ fontSize: 11.5, color: '#EF4444', marginTop: 1 }}
                          >
                            Tap delete to confirm
                          </motion.p>
                        ) : (
                          <motion.p
                            key="date"
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 4 }}
                            transition={{ duration: 0.14 }}
                            style={{ fontSize: 11.5, color: '#9CA3AF', marginTop: 1 }}
                          >
                            {formatDate(doc.uploadedAt)}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Delete button */}
                    <motion.button
                      onClick={() => {
                        if (isPending) {
                          deleteDocument(selectedDeal.id, doc.id);
                          setPendingDeleteId(null);
                        } else {
                          setPendingDeleteId(doc.id);
                        }
                      }}
                      style={{
                        width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: isPending ? '#EF4444' : 'transparent',
                        transition: 'background 0.18s',
                      }}
                      whileTap={{ scale: 0.88 }}
                      transition={{ duration: 0.08 }}
                      aria-label="Delete document"
                    >
                      <Trash2 size={14} strokeWidth={1.8} style={{ color: isPending ? '#FFFFFF' : '#D1D5DB' }} />
                    </motion.button>
                  </motion.div>
                </div>
              );
            })
          )}

          {/* Attach row */}
          <div style={{ height: '0.5px', background: '#E5E7EB', marginLeft: selectedDeal.documents.length > 0 ? 50 : 0 }} />
          <motion.button
            onClick={() => openSheet('ATTACH_DOCUMENT')}
            className="w-full flex items-center gap-3"
            style={{ padding: '11px 14px' }}
            whileTap={{ backgroundColor: '#F8F7F5' }}
            transition={{ duration: 0.06 }}
          >
            <div style={{
              width: 32, height: 32, borderRadius: 8, background: '#F3F4F6',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Plus size={16} strokeWidth={2.2} style={{ color: '#2563EB' }} />
            </div>
            <span style={{ fontSize: 13.5, fontWeight: 500, color: '#2563EB', letterSpacing: '-0.01em' }}>
              Attach document
            </span>
          </motion.button>
        </motion.div>

        {/* ── Actions ── */}
        {!selectedDeal.isOnHold && (
          <>
            <SectionLabel label="Actions" />
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, delay: 0.08, ease: EASE }}
              style={{
                background: '#FFFFFF',
                borderRadius: 14,
                overflow: 'hidden',
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
              }}
            >
              {/* Update Stage */}
              <motion.button
                onClick={() => openSheet('UPDATE_STAGE')}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center',
                  gap: 12, padding: '13px 14px', textAlign: 'left',
                }}
                whileTap={{ backgroundColor: '#F8F7F5' }}
                transition={{ duration: 0.06 }}
              >
                <div style={{
                  width: 34, height: 34, borderRadius: 10, background: '#EFF6FF',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <ArrowUpCircle size={16} strokeWidth={1.8} style={{ color: '#2563EB' }} />
                </div>
                <span style={{
                  flex: 1, fontSize: 14, fontWeight: 600, color: '#111827',
                  letterSpacing: '-0.015em',
                }}>
                  Update stage
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 3, flexShrink: 0 }}>
                  <span style={{
                    fontSize: 12, color: '#9CA3AF',
                    letterSpacing: '-0.01em',
                    background: '#F3F4F6',
                    borderRadius: 6,
                    paddingLeft: 7, paddingRight: 7, paddingTop: 3, paddingBottom: 3,
                  }}>
                    {selectedDeal.stage}
                  </span>
                  <ChevronRight size={14} strokeWidth={2} style={{ color: '#D1D5DB' }} />
                </div>
              </motion.button>

              <div style={{ height: '0.5px', background: '#E5E7EB', marginLeft: 60 }} />

              {/* Put on Hold */}
              <motion.button
                onClick={() => openSheet('PUT_ON_HOLD')}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center',
                  gap: 12, padding: '13px 14px', textAlign: 'left',
                }}
                whileTap={{ backgroundColor: '#F8F7F5' }}
                transition={{ duration: 0.06 }}
              >
                <div style={{
                  width: 34, height: 34, borderRadius: 10, background: '#F3F4F6',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <PauseCircle size={16} strokeWidth={1.8} style={{ color: '#6B7280' }} />
                </div>
                <span style={{
                  flex: 1, fontSize: 14, fontWeight: 600, color: '#111827',
                  letterSpacing: '-0.015em',
                }}>
                  Put on hold
                </span>
                <ChevronRight size={14} strokeWidth={2} style={{ color: '#D1D5DB', flexShrink: 0 }} />
              </motion.button>
            </motion.div>
          </>
        )}
      </div>

      <UpdateStageSheet />
      <AttachDocumentSheet />
      <PutOnHoldSheet />
    </div>
  );
}
