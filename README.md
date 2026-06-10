# Syook Internal CRM Prototype – Mobile Deal Action Hub

A mobile-first CRM prototype built as part of the Syook Product Manager Challenge.

## Overview

This prototype focuses on helping field sales associates manage active deals while on the move.

Instead of building a full CRM, the solution focuses on a single problem:

> Prevent deals from losing momentum by making deal status, missing documents, client-side blockers, and inactive deals visible in one lightweight mobile workflow.

The primary user is a field sales associate who spends most of the day between customer meetings, demos, follow-ups, and document sharing.

---

## Problem Statement

Sales associates currently lack a simple mobile workflow to:

- Track active deals
- Identify deals missing documents
- Mark deals blocked by external client factors
- Surface deals that have gone inactive

As a result, deal progress can become fragmented and difficult to manage.

---

## Solution

The **Mobile Deal Action Hub** combines the most important day-to-day sales workflows into a single mobile experience.

### Included in V1

#### Open Deals (My Pipeline)
- View active deals
- See stage, value, and last activity
- Open deal details
- Update deal stage

#### Pending Documents
- View deals with no attached documents
- Attach documents directly from the deal screen
- Remove previously attached documents

#### On Hold
- Pause a deal due to external client-side blockers
- Capture hold reason
- Resume the deal to its previous stage

#### Inactive Deals
- Surface deals with no stage update for 7+ days
- Accessible via notification bell
- Excludes deals that are On Hold

#### Won Deals
- Display-only count on the home screen
- Not included in active workflow

---

## Product Rules

- Stage updates do not require document uploads
- Document management is separate from stage movement
- Pending Documents = deals with zero attached documents
- Inactive status is based on stage activity only
- Document uploads do not reset inactivity tracking
- On Hold deals are excluded from inactive reminders

---

## Out of Scope (V1)

- Team performance dashboards
- Leaderboards and top-performer tracking
- Deal reassignment workflows
- Authentication and permissions
- Backend integrations
- Document approval workflows
- Push notifications
- Audit logs and notes

---

## Technology Stack

- Next.js
- React
- TypeScript
- Tailwind CSS

---

## Running Locally

Clone the repository:

```bash
git clone https://github.com/Srijan88/syookinternalcrm.git
cd syookinternalcrm
