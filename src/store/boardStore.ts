import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Journey, Step, Release, Story, Attachment, Comment } from '../types';
import { generateId } from '../lib/idgen';
import { seedJourneys, seedSteps, seedReleases, seedStories } from './seed';

interface BoardState {
  // Flat arrays, relations by id (per planning doc §8).
  journeys: Journey[];
  steps: Step[];
  releases: Release[];
  stories: Story[];

  // ─── UI state (not persisted) ─────────────────────
  activeStoryId: string | null;
  openStoryDrawer: (id: string) => void;
  closeStoryDrawer: () => void;
  activeStepId: string | null;
  openStepDrawer: (id: string) => void;
  closeStepDrawer: () => void;

  // ─── Journey actions ──────────────────────────────
  addJourney: (mapId: string) => void;
  updateJourney: (id: string, patch: Partial<Pick<Journey, 'title'>>) => void;
  deleteJourney: (id: string) => void; // cascades its steps

  // ─── Step actions ─────────────────────────────────
  addStep: (journeyId: string, mapId: string) => void;
  updateStep: (id: string, patch: Partial<Pick<Step, 'title' | 'description'>>) => void;
  deleteStep: (id: string) => void; // cascades its stories (same column)
  addStepAttachment: (stepId: string, attachment: Attachment) => void;
  deleteStepAttachment: (stepId: string, attachmentId: string) => void;
  addStepComment: (stepId: string, text: string) => void;

  // ─── Release actions ──────────────────────────────
  addRelease: (mapId: string) => void;
  updateRelease: (id: string, patch: Partial<Pick<Release, 'name'>>) => void;
  deleteRelease: (id: string) => void; // cascades its stories

  // ─── Story actions ────────────────────────────────
  addStory: (releaseId: string, stepId: string, mapId: string) => void;
  updateStory: (id: string, patch: Partial<Pick<Story, 'title' | 'description'>>) => void;
  deleteStory: (id: string) => void;
  addAttachment: (storyId: string, attachment: Attachment) => void;
  deleteAttachment: (storyId: string, attachmentId: string) => void;
  addComment: (storyId: string, text: string) => void;

  // ─── Cross-store cascade ──────────────────────────
  // Removes all board rows for a map (called when a map/project is deleted).
  deleteMapData: (mapId: string) => void;
}

export const useBoardStore = create<BoardState>()(
  persist(
    (set) => ({
      journeys: seedJourneys,
      steps: seedSteps,
      releases: seedReleases,
      stories: seedStories,

      activeStoryId: null,
      openStoryDrawer: (id) => set({ activeStoryId: id }),
      closeStoryDrawer: () => set({ activeStoryId: null }),
      activeStepId: null,
      openStepDrawer: (id) => set({ activeStepId: id }),
      closeStepDrawer: () => set({ activeStepId: null }),

      addJourney: (mapId) =>
        set((state) => {
          const order = state.journeys.filter((j) => j.mapId === mapId).length;
          const journey: Journey = {
            id: generateId(),
            mapId,
            title: 'New Journey',
            order,
          };
          return { journeys: [...state.journeys, journey] };
        }),

      updateJourney: (id, patch) =>
        set((state) => ({
          journeys: state.journeys.map((j) => (j.id === id ? { ...j, ...patch } : j)),
        })),

      deleteJourney: (id) =>
        set((state) => {
          const removedStepIds = new Set(
            state.steps.filter((s) => s.journeyId === id).map((s) => s.id)
          );
          return {
            journeys: state.journeys.filter((j) => j.id !== id),
            steps: state.steps.filter((s) => s.journeyId !== id), // cascade steps
            stories: state.stories.filter((s) => !removedStepIds.has(s.stepId)), // + their stories
          };
        }),

      addStep: (journeyId, mapId) =>
        set((state) => {
          const order = state.steps.filter((s) => s.journeyId === journeyId).length;
          const step: Step = {
            id: generateId(),
            journeyId,
            mapId,
            title: 'Untitled Step',
            order,
            description: '',
            attachments: [],
            comments: [],
          };
          return { steps: [...state.steps, step] };
        }),

      updateStep: (id, patch) =>
        set((state) => ({
          steps: state.steps.map((s) => (s.id === id ? { ...s, ...patch } : s)),
        })),

      deleteStep: (id) =>
        set((state) => ({
          steps: state.steps.filter((s) => s.id !== id),
          stories: state.stories.filter((s) => s.stepId !== id), // cascade column's stories
        })),

      addStepAttachment: (stepId, attachment) =>
        set((state) => ({
          steps: state.steps.map((s) =>
            s.id === stepId ? { ...s, attachments: [...s.attachments, attachment] } : s
          ),
        })),

      deleteStepAttachment: (stepId, attachmentId) =>
        set((state) => ({
          steps: state.steps.map((s) =>
            s.id === stepId
              ? { ...s, attachments: s.attachments.filter((a) => a.id !== attachmentId) }
              : s
          ),
        })),

      addStepComment: (stepId, text) =>
        set((state) => {
          const trimmed = text.trim();
          if (!trimmed) return state;
          const comment: Comment = {
            id: generateId(),
            author: 'You',
            text: trimmed,
            createdAt: new Date().toISOString(),
          };
          return {
            steps: state.steps.map((s) =>
              s.id === stepId ? { ...s, comments: [...s.comments, comment] } : s
            ),
          };
        }),

      addRelease: (mapId) =>
        set((state) => {
          const count = state.releases.filter((r) => r.mapId === mapId).length;
          const release: Release = {
            id: generateId(),
            mapId,
            name: `Release ${count + 1}`,
            order: count,
          };
          return { releases: [...state.releases, release] };
        }),

      updateRelease: (id, patch) =>
        set((state) => ({
          releases: state.releases.map((r) => (r.id === id ? { ...r, ...patch } : r)),
        })),

      deleteRelease: (id) =>
        set((state) => ({
          releases: state.releases.filter((r) => r.id !== id),
          stories: state.stories.filter((s) => s.releaseId !== id), // cascade
        })),

      addStory: (releaseId, stepId, mapId) =>
        set((state) => {
          // Order within the release + step column (the grid cell).
          const order = state.stories.filter(
            (s) => s.releaseId === releaseId && s.stepId === stepId
          ).length;
          const story: Story = {
            id: generateId(),
            releaseId,
            stepId,
            mapId,
            title: 'Untitled Story',
            description: '',
            order,
            attachments: [],
            comments: [],
            createdAt: new Date().toISOString(),
          };
          return { stories: [...state.stories, story] };
        }),

      updateStory: (id, patch) =>
        set((state) => ({
          stories: state.stories.map((s) => (s.id === id ? { ...s, ...patch } : s)),
        })),

      deleteStory: (id) =>
        set((state) => ({ stories: state.stories.filter((s) => s.id !== id) })),

      addAttachment: (storyId, attachment) =>
        set((state) => ({
          stories: state.stories.map((s) =>
            s.id === storyId ? { ...s, attachments: [...s.attachments, attachment] } : s
          ),
        })),

      deleteAttachment: (storyId, attachmentId) =>
        set((state) => ({
          stories: state.stories.map((s) =>
            s.id === storyId
              ? { ...s, attachments: s.attachments.filter((a) => a.id !== attachmentId) }
              : s
          ),
        })),

      addComment: (storyId, text) =>
        set((state) => {
          const trimmed = text.trim();
          if (!trimmed) return state; // ignore empty comments
          const comment: Comment = {
            id: generateId(),
            author: 'You', // personal-use app, no auth — author is always the current user
            text: trimmed,
            createdAt: new Date().toISOString(),
          };
          return {
            stories: state.stories.map((s) =>
              s.id === storyId ? { ...s, comments: [...s.comments, comment] } : s
            ),
          };
        }),

      deleteMapData: (mapId) =>
        set((state) => ({
          journeys: state.journeys.filter((j) => j.mapId !== mapId),
          steps: state.steps.filter((s) => s.mapId !== mapId),
          releases: state.releases.filter((r) => r.mapId !== mapId),
          stories: state.stories.filter((s) => s.mapId !== mapId),
        })),
    }),
    {
      name: 'storymap-board',
      version: 4,
      // Run on load when the persisted version is older than `version`.
      // v1 → v2: stories gained a `stepId`. Backfill any pre-existing story by
      // placing it under the first step of its map so old boards still render.
      // v2 → v3: comments gained an `author`. Backfill old comments with "You".
      // v3 → v4: steps gained detail fields (description/attachments/comments).
      migrate: (persisted) => {
        const state = persisted as BoardState;
        if (state && Array.isArray(state.stories) && Array.isArray(state.steps)) {
          const firstStepOfMap = (mapId: string) =>
            state.steps
              .filter((s) => s.mapId === mapId)
              .sort((a, b) => a.order - b.order)[0]?.id ?? '';
          state.stories = state.stories.map((s) => {
            const withStep = s.stepId ? s : { ...s, stepId: firstStepOfMap(s.mapId) };
            const comments = (withStep.comments ?? []).map((c) =>
              c.author ? c : { ...c, author: 'You' }
            );
            return { ...withStep, comments };
          });
          state.steps = state.steps.map((s) => ({
            ...s,
            description: s.description ?? '',
            attachments: s.attachments ?? [],
            comments: (s.comments ?? []).map((c) => (c.author ? c : { ...c, author: 'You' })),
          }));
        }
        return state;
      },
      partialize: (state) => ({
        journeys: state.journeys,
        steps: state.steps,
        releases: state.releases,
        stories: state.stories,
      }),
    }
  )
);
