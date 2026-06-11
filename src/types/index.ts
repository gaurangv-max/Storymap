// Core TypeScript interfaces for StoryMap.
// These mirror the data model in the planning document (§8).
// Only the entities needed for the base setup are filled in now;
// board entities (Journey, Step, Release, Story) will be added later.

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string; // ISO date string
}

export interface StoryMap {
  id: string;
  projectId: string;
  name: string;
  createdAt: string; // ISO date string
  createdBy: string; // hardcoded "You" for MVP (no auth)
  // Counts are derived from the board store (not stored here) — see StoryMapCard.
}

// ─── Board entities ─────────────────────────────────────────────

export interface Journey {
  id: string;
  mapId: string;
  title: string;
  order: number; // display order across the board
}

export interface Step {
  id: string;
  journeyId: string;
  mapId: string; // denormalized for easy "all steps for map X" queries
  title: string;
  order: number; // order within its journey
  // Display number ("1.0") is derived: journeyIndex.stepOrder — never stored.
  // Steps carry the same detail fields as stories (opened in the drawer).
  description: string;
  attachments: Attachment[];
  comments: Comment[];
}

export interface Release {
  id: string;
  mapId: string;
  name: string;
  order: number; // vertical stacking order
}

export interface Story {
  id: string;
  releaseId: string;
  stepId: string; // which step column this story sits under (grid alignment)
  mapId: string; // denormalized
  title: string;
  description: string;
  order: number; // within its release + step column
  attachments: Attachment[];
  comments: Comment[];
  createdAt: string;
}

export interface Attachment {
  id: string;
  name: string;
  type: string; // MIME type
  dataUrl: string; // base64 data URL
  uploadedAt: string;
}

export interface Comment {
  id: string;
  author: string; // display name of who posted (e.g. "You")
  text: string;
  createdAt: string;
}

// ─── Delete confirmation target ─────────────────────────────────

export type DeleteTargetType =
  | 'project'
  | 'storyMap'
  | 'journey'
  | 'step'
  | 'release'
  | 'story';

export interface DeleteTarget {
  type: DeleteTargetType;
  id: string;
  label: string; // shown in the modal, e.g. "Delete journey "Onboarding"?"
}
