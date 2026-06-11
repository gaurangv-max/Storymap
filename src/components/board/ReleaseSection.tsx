import { useRef } from 'react';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import type { Journey, Release, Step } from '../../types';
import { useBoardStore } from '../../store/boardStore';
import { useProjectStore } from '../../store/projectStore';
import { InlineEditInput, type InlineEditHandle } from '../shared/InlineEditInput';
import { ThreeDotMenu } from '../shared/ThreeDotMenu';
import { Badge } from '../shared/Badge';
import { StoryCard } from './StoryCard';
import { COLUMN_WIDTH, STEP_GAP, JOURNEY_GAP, BOARD_INSET } from './boardLayout';

interface ReleaseSectionProps {
  release: Release;
  /** Backbone columns (journeys → ordered steps) — the grid this release fills. */
  columns: { journey: Journey; steps: Step[] }[];
}

// A release band. Stories are arranged into columns that line up with the
// step backbone above: each story sits under the step it belongs to.
export function ReleaseSection({ release, columns }: ReleaseSectionProps) {
  const updateRelease = useBoardStore((s) => s.updateRelease);
  const addStory = useBoardStore((s) => s.addStory);
  const stories = useBoardStore((s) => s.stories);
  const setConfirmDeleteTarget = useProjectStore((s) => s.setConfirmDeleteTarget);
  const titleRef = useRef<InlineEditHandle>(null);

  const releaseStories = stories.filter((s) => s.releaseId === release.id);
  const storyCount = releaseStories.length;

  const storiesForStep = (stepId: string) =>
    releaseStories.filter((s) => s.stepId === stepId).sort((a, b) => a.order - b.order);

  // Stories whose step was deleted/renamed away — keep them visible (at the
  // same 200×100 size) in a trailing "Unassigned" column rather than dropping
  // or stretching them.
  const validStepIds = new Set(columns.flatMap((c) => c.steps.map((s) => s.id)));
  const orphanStories = releaseStories
    .filter((s) => !validStepIds.has(s.stepId))
    .sort((a, b) => a.order - b.order);

  return (
    <Box
      component="section"
      sx={{
        width: '100%',
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: (theme) => theme.customShadows.z1,
      }}
    >
      {/* Release header bar — spans the full board width. */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          bgcolor: 'secondary.lighter',
          px: 2,
          py: 1.5,
        }}
      >
        <ThreeDotMenu
          onRename={() => titleRef.current?.beginEdit()}
          onDelete={() =>
            setConfirmDeleteTarget({
              type: 'release',
              id: release.id,
              label: `Delete release “${release.name}” and its stories?`,
            })
          }
        />
        <InlineEditInput
          ref={titleRef}
          value={release.name}
          onSave={(name) => updateRelease(release.id, { name })}
          ariaLabel="Release name"
          sx={{ fontSize: 14, fontWeight: 700, color: 'text.primary' }}
        />
        <Badge tone="accent" sx={{ ml: 'auto' }}>
          {`${storyCount} ${storyCount === 1 ? 'Story' : 'Stories'}`}
        </Badge>
      </Box>

      {/* Story grid — columns aligned to the step backbone above. */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          gap: JOURNEY_GAP,
          bgcolor: 'grey.100',
          py: 2,
          px: BOARD_INSET,
        }}
      >
        {columns.map(({ journey, steps }) => (
          <Box key={journey.id} sx={{ display: 'flex', flexDirection: 'row', gap: STEP_GAP }}>
            {steps.map((step) => (
              <Box
                key={step.id}
                sx={{
                  width: COLUMN_WIDTH,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: STEP_GAP,
                  '&:hover .add-story-affordance': { opacity: 1, pointerEvents: 'auto' },
                }}
              >
                {storiesForStep(step.id).map((story) => (
                  <StoryCard key={story.id} story={story} />
                ))}

                <ButtonBase
                  className="add-story-affordance"
                  onClick={() => addStory(release.id, step.id, release.mapId)}
                  sx={{
                    width: '100%',
                    height: 38,
                    borderRadius: 2,
                    border: '1px dashed',
                    borderColor: 'grey.300',
                    fontSize: 12,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    color: 'text.disabled',
                    opacity: 0,
                    pointerEvents: 'none',
                    transition: 'opacity 0.15s, border-color 0.2s, background-color 0.2s, color 0.2s',
                    '&:hover': {
                      borderColor: 'secondary.main',
                      bgcolor: 'secondary.lighter',
                      color: 'secondary.main',
                    },
                  }}
                >
                  + Add Story
                </ButtonBase>
              </Box>
            ))}
          </Box>
        ))}

        {/* Stories whose step no longer exists — shown at the same size. */}
        {orphanStories.length > 0 && (
          <Box sx={{ width: COLUMN_WIDTH, display: 'flex', flexDirection: 'column', gap: STEP_GAP }}>
            <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 700 }}>
              Unassigned
            </Typography>
            {orphanStories.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}
