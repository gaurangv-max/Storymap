import { useRef } from 'react';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import type { Journey } from '../../types';
import { useBoardStore } from '../../store/boardStore';
import { useProjectStore } from '../../store/projectStore';
import { InlineEditInput, type InlineEditHandle } from '../shared/InlineEditInput';
import { ThreeDotMenu } from '../shared/ThreeDotMenu';
import { StepCard } from './StepCard';
import { COLUMN_WIDTH, CARD_HEIGHT, STEP_GAP } from './boardLayout';

interface JourneyColumnProps {
  journey: Journey;
  /** Zero-based position of this journey on the board (for step numbering). */
  index: number;
}

const dashedButtonSx = {
  borderRadius: 2,
  border: '1px dashed',
  borderColor: 'grey.300',
  py: 1.25,
  fontSize: 12,
  fontWeight: 700,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.04em',
  color: 'text.disabled',
  transition: 'border-color 0.2s, background-color 0.2s, color 0.2s',
  '&:hover': { borderColor: 'primary.main', bgcolor: 'primary.lighter', color: 'primary.main' },
};

export function JourneyColumn({ journey, index }: JourneyColumnProps) {
  const updateJourney = useBoardStore((s) => s.updateJourney);
  const addStep = useBoardStore((s) => s.addStep);
  const steps = useBoardStore((s) => s.steps);
  const setConfirmDeleteTarget = useProjectStore((s) => s.setConfirmDeleteTarget);
  const titleRef = useRef<InlineEditHandle>(null);

  const journeySteps = steps
    .filter((s) => s.journeyId === journey.id)
    .sort((a, b) => a.order - b.order);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 1.5, width: 'fit-content' }}>
      {/* Journey header — sized to one step width; whitespace beyond it. */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          width: COLUMN_WIDTH,
          borderRadius: 2,
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          px: 1.75,
          py: 1.25,
          boxShadow: 1,
        }}
      >
        <Box component="span" sx={{ minWidth: 0, flex: 1 }}>
          <InlineEditInput
            ref={titleRef}
            value={journey.title}
            onSave={(title) => updateJourney(journey.id, { title })}
            ariaLabel="Journey title"
            sx={{ display: 'block', fontSize: 14, fontWeight: 600, color: 'common.white' }}
          />
        </Box>
        <ThreeDotMenu
          triggerSx={{ color: 'rgba(255,255,255,0.85)', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)', color: '#fff' } }}
          onRename={() => titleRef.current?.beginEdit()}
          onDelete={() =>
            setConfirmDeleteTarget({
              type: 'journey',
              id: journey.id,
              label: `Delete journey “${journey.title}” and its steps?`,
            })
          }
        />
      </Box>

      {/* Steps — horizontal row; the journey expands to fit all its steps.
          With no steps yet, show the dashed "Add Step" tile so the first step
          can be created. Once steps exist, new steps are added via the "+"
          affordance that appears when hovering a step's right edge. */}
      {journeySteps.length === 0 ? (
        <ButtonBase
          onClick={() => addStep(journey.id, journey.mapId)}
          sx={{ ...dashedButtonSx, width: COLUMN_WIDTH, height: CARD_HEIGHT }}
        >
          + Add Step
        </ButtonBase>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'stretch', gap: STEP_GAP }}>
          {journeySteps.map((step, stepIndex) => {
            const isLast = stepIndex === journeySteps.length - 1;
            return (
              <Box
                key={step.id}
                sx={{
                  position: 'relative',
                  flex: `0 0 ${COLUMN_WIDTH}px`,
                  width: COLUMN_WIDTH,
                  ...(isLast && {
                    '&:hover .add-step-affordance': { opacity: 1, pointerEvents: 'auto' },
                  }),
                }}
              >
                <StepCard step={step} number={`${index + 1}.${stepIndex}`} />
                {isLast && (
                  <IconButton
                    className="add-step-affordance"
                    size="small"
                    aria-label="Add step"
                    onClick={() => addStep(journey.id, journey.mapId)}
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      right: -18,
                      transform: 'translateY(-50%)',
                      zIndex: 2,
                      width: 26,
                      height: 26,
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText',
                      boxShadow: 2,
                      opacity: 0,
                      pointerEvents: 'none',
                      transition: 'opacity 0.15s',
                      '&:hover': { bgcolor: 'primary.dark' },
                    }}
                  >
                    <AddIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                )}
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
}
