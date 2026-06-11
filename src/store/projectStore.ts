import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Project, StoryMap, DeleteTarget } from '../types';
import { generateId } from '../lib/idgen';
import { seedProjects, seedStoryMaps } from './seed';
import { useBoardStore } from './boardStore';

interface ProjectState {
  // ─── Persisted data ───────────────────────────────
  projects: Project[];
  storyMaps: StoryMap[];
  selectedProjectId: string | null;

  // ─── UI state (not persisted) ─────────────────────
  isCreateProjectModalOpen: boolean;
  isCreateStoryMapModalOpen: boolean;
  editingProjectId: string | null; // drives the Edit Project Details modal
  confirmDeleteTarget: DeleteTarget | null;

  // ─── Project actions ──────────────────────────────
  addProject: (name: string, description: string) => void;
  updateProject: (id: string, patch: Partial<Pick<Project, 'name' | 'description'>>) => void;
  selectProject: (id: string) => void;
  deleteProject: (id: string) => void; // cascades maps + their board data

  // ─── Story map actions ────────────────────────────
  addStoryMap: (projectId: string, name: string) => StoryMap;
  updateStoryMap: (id: string, patch: Partial<Pick<StoryMap, 'name'>>) => void;
  deleteStoryMap: (id: string) => void; // cascades its board data

  // ─── Modal controls ───────────────────────────────
  openCreateProjectModal: () => void;
  closeCreateProjectModal: () => void;
  openCreateStoryMapModal: () => void;
  closeCreateStoryMapModal: () => void;
  openEditProjectModal: (id: string) => void;
  closeEditProjectModal: () => void;
  setConfirmDeleteTarget: (target: DeleteTarget | null) => void;
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      projects: seedProjects,
      storyMaps: seedStoryMaps,
      selectedProjectId: seedProjects[0]?.id ?? null,

      isCreateProjectModalOpen: false,
      isCreateStoryMapModalOpen: false,
      editingProjectId: null,
      confirmDeleteTarget: null,

      addProject: (name, description) =>
        set((state) => {
          const project: Project = {
            id: generateId(),
            name: name.trim(),
            description: description.trim(),
            createdAt: new Date().toISOString(),
          };
          return {
            projects: [...state.projects, project],
            selectedProjectId: project.id,
          };
        }),

      updateProject: (id, patch) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id
              ? {
                  ...p,
                  ...(patch.name !== undefined ? { name: patch.name.trim() } : {}),
                  ...(patch.description !== undefined
                    ? { description: patch.description.trim() }
                    : {}),
                }
              : p
          ),
        })),

      selectProject: (id) => set({ selectedProjectId: id }),

      deleteProject: (id) => {
        const state = get();
        const maps = state.storyMaps.filter((m) => m.projectId === id);
        // Cascade: clear each map's board data in the board store.
        maps.forEach((m) => useBoardStore.getState().deleteMapData(m.id));

        const remainingProjects = state.projects.filter((p) => p.id !== id);
        set({
          projects: remainingProjects,
          storyMaps: state.storyMaps.filter((m) => m.projectId !== id),
          // Keep a valid selection.
          selectedProjectId:
            state.selectedProjectId === id
              ? remainingProjects[0]?.id ?? null
              : state.selectedProjectId,
        });
      },

      addStoryMap: (projectId, name) => {
        const storyMap: StoryMap = {
          id: generateId(),
          projectId,
          name: name.trim(),
          createdAt: new Date().toISOString(),
          createdBy: 'You',
        };
        set((state) => ({ storyMaps: [...state.storyMaps, storyMap] }));
        return storyMap;
      },

      updateStoryMap: (id, patch) =>
        set((state) => ({
          storyMaps: state.storyMaps.map((m) => (m.id === id ? { ...m, ...patch } : m)),
        })),

      deleteStoryMap: (id) => {
        useBoardStore.getState().deleteMapData(id); // cascade board data
        set((state) => ({ storyMaps: state.storyMaps.filter((m) => m.id !== id) }));
      },

      openCreateProjectModal: () => set({ isCreateProjectModalOpen: true }),
      closeCreateProjectModal: () => set({ isCreateProjectModalOpen: false }),
      openCreateStoryMapModal: () => set({ isCreateStoryMapModalOpen: true }),
      closeCreateStoryMapModal: () => set({ isCreateStoryMapModalOpen: false }),
      openEditProjectModal: (id) => set({ editingProjectId: id }),
      closeEditProjectModal: () => set({ editingProjectId: null }),
      setConfirmDeleteTarget: (target) => set({ confirmDeleteTarget: target }),
    }),
    {
      name: 'storymap-data',
      version: 1,
      migrate: (persisted) => persisted as ProjectState,
      // Persist domain data + the last-selected project. Modal/confirm
      // UI state always starts fresh.
      partialize: (state) => ({
        projects: state.projects,
        storyMaps: state.storyMaps,
        selectedProjectId: state.selectedProjectId,
      }),
    }
  )
);
