'use client';

import { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Upload, FileCheck } from 'lucide-react';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { useApp } from '@/context/AppContext';

export function AttachDocumentSheet() {
  const {
    activeSheet, closeSheet,
    attachDocument, pendingAttachDealId, selectedDealId,
  } = useApp();

  const open = activeSheet === 'ATTACH_DOCUMENT' || activeSheet === 'ATTACH_FROM_PENDING';
  const isFromPending = activeSheet === 'ATTACH_FROM_PENDING';
  const dealId = isFromPending ? (pendingAttachDealId ?? '') : (selectedDealId ?? '');

  const [file, setFile] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) setFile(f.name);
  }

  function handleAttach() {
    if (!file || !dealId) return;
    attachDocument(dealId, file);
    setFile(null);
  }

  function handleClose() {
    closeSheet();
    setFile(null);
  }

  return (
    <BottomSheet open={open} onClose={handleClose} title="Add document">
      <p style={{ fontSize: 13.5, color: '#6B7280', marginBottom: 18, lineHeight: 1.55 }}>
        Attach a PDF, image, or document to this deal.
      </p>

      {/* Drop zone */}
      <motion.button
        onClick={() => fileRef.current?.click()}
        style={{
          width: '100%', borderRadius: 12,
          border: `1.5px dashed ${file ? '#2563EB' : '#D1D5DB'}`,
          background: file ? '#EFF6FF' : '#F8F7F5',
          padding: '24px 16px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 9,
          marginBottom: 20, transition: 'all 0.2s',
        }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.08 }}
      >
        {file ? (
          <>
            <FileCheck size={26} strokeWidth={1.5} style={{ color: '#2563EB' }} />
            <p style={{ fontSize: 13, fontWeight: 500, color: '#2563EB', textAlign: 'center', wordBreak: 'break-all', lineHeight: 1.4 }}>{file}</p>
            <p style={{ fontSize: 12, color: '#9CA3AF' }}>Tap to change</p>
          </>
        ) : (
          <>
            <Upload size={24} strokeWidth={1.5} style={{ color: '#9CA3AF' }} />
            <p style={{ fontSize: 14, fontWeight: 500, color: '#6B7280' }}>Select file</p>
            <p style={{ fontSize: 12, color: '#9CA3AF' }}>PDF, image, doc, spreadsheet</p>
          </>
        )}
      </motion.button>

      <input ref={fileRef} type="file" accept="*/*" className="hidden" onChange={handleChange} />

      <div style={{ display: 'flex', gap: 10 }}>
        <motion.button
          onClick={handleClose}
          style={{
            flex: 1, height: 48, borderRadius: 12,
            border: '1.5px solid #E5E7EB', background: 'transparent',
            fontSize: 15, fontWeight: 500, color: '#374151',
          }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.08 }}
        >
          Cancel
        </motion.button>
        <motion.button
          onClick={handleAttach}
          disabled={!file}
          style={{
            flex: 1, height: 48, borderRadius: 12,
            background: file ? '#2563EB' : '#E5E7EB',
            fontSize: 15, fontWeight: 600,
            color: file ? '#FFFFFF' : '#9CA3AF',
            transition: 'background 0.2s, color 0.2s',
          }}
          whileTap={file ? { scale: 0.97 } : {}}
          transition={{ duration: 0.08 }}
        >
          Attach
        </motion.button>
      </div>
    </BottomSheet>
  );
}
