export type Stage = 'Contacted' | 'Demo Completed' | 'Proposal Sent' | 'Won';

export const STAGES: Stage[] = ['Contacted', 'Demo Completed', 'Proposal Sent', 'Won'];

export const HOLD_REASONS = [
  'Awaiting client budget approval',
  'Decision-maker unavailable',
  'Procurement / legal review',
  'Client requested pause',
  'Awaiting internal approval',
] as const;

export type HoldReason = typeof HOLD_REASONS[number];

export interface DealDocument {
  id: string;
  filename: string;
  uploadedAt: string; // ISO date string
}

export interface Deal {
  id: string;
  account: string;
  value: string;
  stage: Stage;
  isOnHold: boolean;
  holdReason?: string;
  previousStage?: Stage;
  lastActivityDate: string; // ISO date — updated on stage change, hold, unhalt
  documents: DealDocument[];
  hasPendingDocument: boolean;
  daysPaused?: number;
}

export type Screen =
  | 'HOME'
  | 'PIPELINE_LIST'
  | 'DEAL_DETAIL'
  | 'PENDING_DOCS'
  | 'ON_HOLD'
  | 'INACTIVE_DEALS';

export type SheetType =
  | 'UPDATE_STAGE'
  | 'ATTACH_DOCUMENT'
  | 'PUT_ON_HOLD'
  | 'RESUME_CONFIRM'
  | 'ATTACH_FROM_PENDING'
  | null;
