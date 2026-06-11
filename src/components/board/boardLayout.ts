// Shared layout constants for the story-map board so the backbone (journeys +
// steps) and the release rows (stories) line up into the same column grid.
// Both the steps and the stories use COLUMN_WIDTH × CARD_HEIGHT boxes, and the
// same horizontal gaps, so every story sits directly under its step.

export const COLUMN_WIDTH = 200; // px — width of a step / story box
export const CARD_HEIGHT = 100; // px — height of a step / story box
export const STEP_GAP = 1; // theme spacing (8px) between columns within a journey
export const JOURNEY_GAP = 3; // theme spacing (24px) between journeys
// Left inset applied to BOTH the backbone and the release grid so the first
// column isn't flush against the edge — applied equally to keep them aligned.
export const BOARD_INSET = 2; // theme spacing (16px)
