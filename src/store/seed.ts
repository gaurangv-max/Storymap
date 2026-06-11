import type { Project, StoryMap, Journey, Step, Release, Story } from '../types';

// Sample data used to populate the store on first load (when localStorage
// is empty). Realistic but simple — enough to see the UI with content.

export const seedProjects: Project[] = [
  {
    id: 'proj-mobile-banking',
    name: 'Mobile Banking App',
    description: 'Consumer banking app — onboarding, payments, and account management.',
    createdAt: '2026-05-02T09:00:00.000Z',
  },
  {
    id: 'proj-marketplace',
    name: 'Artisan Marketplace',
    description: 'Two-sided marketplace connecting local makers with buyers.',
    createdAt: '2026-05-18T14:30:00.000Z',
  },
  {
    id: 'proj-fitness',
    name: 'Fitness Tracker',
    description: 'Habit and workout tracking with weekly progress summaries.',
    createdAt: '2026-06-01T08:15:00.000Z',
  },
];

export const seedStoryMaps: StoryMap[] = [
  {
    id: 'map-onboarding',
    projectId: 'proj-mobile-banking',
    name: 'Onboarding & KYC Flow',
    createdAt: '2026-05-03T10:00:00.000Z',
    createdBy: 'You',
  },
  {
    id: 'map-payments',
    projectId: 'proj-mobile-banking',
    name: 'Payments & Transfers',
    createdAt: '2026-05-10T11:20:00.000Z',
    createdBy: 'You',
  },
  {
    id: 'map-seller',
    projectId: 'proj-marketplace',
    name: 'Seller Onboarding',
    createdAt: '2026-05-19T16:00:00.000Z',
    createdBy: 'You',
  },
  {
    id: 'map-checkout',
    projectId: 'proj-marketplace',
    name: 'Buyer Checkout',
    createdAt: '2026-05-25T13:45:00.000Z',
    createdBy: 'You',
  },
  {
    id: 'map-workout',
    projectId: 'proj-fitness',
    name: 'Workout Logging',
    createdAt: '2026-06-02T09:30:00.000Z',
    createdBy: 'You',
  },
];

// ─── Seed board data (for "Onboarding & KYC Flow") ───────────────
// Gives the first map real content so its dashboard counts are non-zero
// and opening it shows a populated board. Other maps start empty.

const MAP = 'map-onboarding';

export const seedJourneys: Journey[] = [
  { id: 'jny-discover', mapId: MAP, title: 'Discover', order: 0 },
  { id: 'jny-signup', mapId: MAP, title: 'Sign Up', order: 1 },
  { id: 'jny-verify', mapId: MAP, title: 'Verify Identity', order: 2 },
  { id: 'jny-start', mapId: MAP, title: 'Get Started', order: 3 },
];

const step = (
  id: string,
  journeyId: string,
  title: string,
  order: number
): Step => ({
  id,
  journeyId,
  mapId: MAP,
  title,
  order,
  description: '',
  attachments: [],
  comments: [],
});

export const seedSteps: Step[] = [
  step('stp-1', 'jny-discover', 'Land on website', 0),
  step('stp-2', 'jny-discover', 'Compare plans', 1),
  step('stp-3', 'jny-signup', 'Enter email', 0),
  step('stp-4', 'jny-signup', 'Create password', 1),
  step('stp-5', 'jny-signup', 'Accept terms', 2),
  step('stp-6', 'jny-verify', 'Upload ID', 0),
  step('stp-7', 'jny-verify', 'Take a selfie', 1),
  step('stp-8', 'jny-verify', 'Await approval', 2),
  step('stp-9', 'jny-start', 'Link first account', 0),
  step('stp-10', 'jny-start', 'Tour the dashboard', 1),
];

export const seedReleases: Release[] = [
  { id: 'rel-mvp', mapId: MAP, name: 'Release 1 — MVP', order: 0 },
  { id: 'rel-fast', mapId: MAP, name: 'Release 2 — Fast Follow', order: 1 },
];

const story = (
  id: string,
  releaseId: string,
  stepId: string,
  title: string,
  order: number,
  comments: Story['comments'] = []
): Story => ({
  id,
  releaseId,
  stepId,
  mapId: MAP,
  title,
  description: '',
  order,
  attachments: [],
  comments,
  createdAt: '2026-05-03T10:00:00.000Z',
});

export const seedStories: Story[] = [
  story('sty-1', 'rel-mvp', 'stp-3', 'Email + password sign up', 0, [
    {
      id: 'cmt-demo-1',
      author: 'Leslie Alexander',
      text: "Let's confirm whether KYC documents need annual re-verification or only at signup — it changes how much we build into the MVP approval queue.",
      createdAt: '2020-03-09T10:00:00.000Z',
    },
  ]),
  story('sty-2', 'rel-mvp', 'stp-6', 'Basic ID upload', 0),
  story('sty-3', 'rel-mvp', 'stp-8', 'Manual approval queue', 0),
  story('sty-4', 'rel-fast', 'stp-7', 'Selfie liveness check', 0),
  story('sty-5', 'rel-fast', 'stp-8', 'Auto-approval for low risk', 0),
];
