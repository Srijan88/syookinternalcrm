'use client';

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { initialDeals, WON_COUNT } from '@/lib/mockData';
import { Deal, Screen, SheetType, Stage } from '@/lib/types';
import { TODAY, daysSince } from '@/lib/utils';

interface AppContextType {
  deals: Deal[];
  screen: Screen;
  selectedDealId: string | null;
  activeSheet: SheetType;
  pendingNewStage: Stage | null;
  pendingAttachDealId: string | null;

  navigate: (screen: Screen, dealId?: string) => void;
  goBack: () => void;
  openSheet: (sheet: SheetType) => void;
  closeSheet: () => void;
  setPendingNewStage: (stage: Stage | null) => void;
  setPendingAttachDealId: (id: string | null) => void;

  /** Update stage only — no document prompt */
  updateStage: (dealId: string, newStage: Stage) => void;
  /** Attach a document to a deal (no stage change) */
  attachDocument: (dealId: string, filename: string) => void;
  /** Delete a single document from a deal */
  deleteDocument: (dealId: string, docId: string) => void;
  /** Legacy: update stage AND attach doc in one action (used from pending-docs flow) */
  updateStageAndAttach: (dealId: string, newStage: Stage, filename: string | null) => void;
  putOnHold: (dealId: string, reason: string) => void;
  resumeDeal: (dealId: string) => void;

  selectedDeal: Deal | null;
  pipelineDeals: Deal[];
  /** Deals with zero documents attached */
  pendingDocDeals: Deal[];
  onHoldDeals: Deal[];
  wonCount: number;
  inactiveDeals: Deal[];
  bellCount: number;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [deals, setDeals] = useState<Deal[]>(initialDeals);
  const [screen, setScreen] = useState<Screen>('HOME');
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);
  const [activeSheet, setActiveSheet] = useState<SheetType>(null);
  const [pendingNewStage, setPendingNewStage] = useState<Stage | null>(null);
  const [pendingAttachDealId, setPendingAttachDealId] = useState<string | null>(null);
  // screenHistory value is only read inside setter callbacks (prev), never directly
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [screenHistory, setScreenHistory] = useState<Screen[]>([]);

  const navigate = useCallback((s: Screen, dealId?: string) => {
    setScreenHistory(prev => [...prev, screen]);
    setScreen(s);
    if (dealId !== undefined) setSelectedDealId(dealId);
  }, [screen]);

  const goBack = useCallback(() => {
    setScreenHistory(prev => {
      const history = [...prev];
      const previous = history.pop() ?? 'HOME';
      setScreen(previous);
      return history;
    });
    setActiveSheet(null);
  }, []);

  const openSheet = useCallback((sheet: SheetType) => setActiveSheet(sheet), []);
  const closeSheet = useCallback(() => {
    setActiveSheet(null);
    setPendingNewStage(null);
  }, []);

  /** Instant stage update — no document prompt */
  const updateStage = useCallback((dealId: string, newStage: Stage) => {
    setDeals(prev => prev.map(d => {
      if (d.id !== dealId) return d;
      return { ...d, stage: newStage, lastActivityDate: TODAY.toISOString() };
    }));
    setActiveSheet(null);
    setPendingNewStage(null);
  }, []);

  /** Attach document to a deal without changing its stage */
  const attachDocument = useCallback((dealId: string, filename: string) => {
    setDeals(prev => prev.map(d => {
      if (d.id !== dealId) return d;
      return {
        ...d,
        documents: [...d.documents, { id: `doc-${Date.now()}`, filename, uploadedAt: TODAY.toISOString() }],
        hasPendingDocument: false,
        lastActivityDate: TODAY.toISOString(),
      };
    }));
    setActiveSheet(null);
  }, []);

  /** Delete a single document from a deal */
  const deleteDocument = useCallback((dealId: string, docId: string) => {
    setDeals(prev => prev.map(d => {
      if (d.id !== dealId) return d;
      return { ...d, documents: d.documents.filter(doc => doc.id !== docId) };
    }));
  }, []);

  const updateStageAndAttach = useCallback((
    dealId: string,
    newStage: Stage,
    filename: string | null
  ) => {
    setDeals(prev => prev.map(d => {
      if (d.id !== dealId) return d;
      const docs = filename
        ? [...d.documents, { id: `doc-${Date.now()}`, filename, uploadedAt: TODAY.toISOString() }]
        : d.documents;
      return {
        ...d,
        stage: newStage,
        lastActivityDate: TODAY.toISOString(),
        hasPendingDocument: filename === null,
        documents: docs,
      };
    }));
    setActiveSheet(null);
    setPendingNewStage(null);
  }, []);

  const putOnHold = useCallback((dealId: string, reason: string) => {
    setDeals(prev => prev.map(d => {
      if (d.id !== dealId) return d;
      return { ...d, isOnHold: true, holdReason: reason, previousStage: d.stage, lastActivityDate: TODAY.toISOString(), daysPaused: 0 };
    }));
    setActiveSheet(null);
  }, []);

  const resumeDeal = useCallback((dealId: string) => {
    setDeals(prev => prev.map(d => {
      if (d.id !== dealId) return d;
      return { ...d, isOnHold: false, holdReason: undefined, stage: d.previousStage ?? d.stage, previousStage: undefined, lastActivityDate: TODAY.toISOString(), daysPaused: undefined };
    }));
    setActiveSheet(null);
  }, []);

  // Derived data
  const pipelineDeals = useMemo(() =>
    deals.filter(d => !d.isOnHold).sort((a, b) => daysSince(b.lastActivityDate) - daysSince(a.lastActivityDate)),
    [deals]
  );

  /** A deal needs a document if it has zero documents attached */
  const pendingDocDeals = useMemo(() =>
    deals.filter(d => d.documents.length === 0 && !d.isOnHold),
    [deals]
  );

  const onHoldDeals = useMemo(() => deals.filter(d => d.isOnHold), [deals]);

  const inactiveDeals = useMemo(() =>
    deals.filter(d => !d.isOnHold && daysSince(d.lastActivityDate) >= 7),
    [deals]
  );

  const selectedDeal = useMemo(() =>
    selectedDealId ? (deals.find(d => d.id === selectedDealId) ?? null) : null,
    [deals, selectedDealId]
  );

  const bellCount = inactiveDeals.length;

  const value: AppContextType = {
    deals, screen, selectedDealId, activeSheet, pendingNewStage, pendingAttachDealId,
    navigate, goBack, openSheet, closeSheet, setPendingNewStage, setPendingAttachDealId,
    updateStage, attachDocument, deleteDocument, updateStageAndAttach, putOnHold, resumeDeal,
    selectedDeal, pipelineDeals, pendingDocDeals, onHoldDeals, wonCount: WON_COUNT, inactiveDeals, bellCount,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
