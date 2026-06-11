import { useRef } from 'react';
import Box from '@mui/material/Box';
import type { Step } from '../../types';
import { useBoardStore } from '../../store/boardStore';
import { useProjectStore } from '../../store/projectStore';
import { InlineEditInput, type InlineEditHandle } from '../shared/InlineEditInput';
import { ThreeDotMenu } from '../shared/ThreeDotMenu';
import { CARD_HEIGHT } from './boardLayout';

interface StepCardProps {
  step: Step;
  /** Derived display number, e.g. "1.0". */
  number: string;
}

// White card with a blue top border, a small number badge, and an
// inline-editable title. Clicking the card opens the step details drawer;
// clicking the title edits it inline (without opening the drawer).
export function StepCard({ step, number }: StepCardProps) {
  const updateStep = useBoardStore((s) => s.updateStep);
  const openStepDrawer = useBoardStore((s) => s.openStepDrawer);
  const setConfirmDeleteTarget = useProjectStore((s) => s.setConfirmDeleteTarget);
  const titleRef = useRef<InlineEditHandle>(null);

  const open = () => openStepDrawer(step.id);

  return (
    <Box
      role="button"
      tabIndex={0}
      onClick={open}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          open();
        }
      }}
      sx={{
        height: CARD_HEIGHT,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        cursor: 'pointer',
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        borderTop: '3px solid',
        borderTopColor: 'primary.main',
        bgcolor: 'background.paper',
        p: 1.5,
        boxShadow: (theme) => theme.customShadows.z1,
        transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          borderColor: 'primary.light',
          boxShadow: (theme) => theme.customShadows.z16,
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 0.5 }}>
        <Box
          component="span"
          sx={{
            display: 'inline-block',
            borderRadius: 1,
            bgcolor: 'primary.lighter',
            color: 'primary.dark',
            px: 0.75,
            py: 0.25,
            fontSize: 11,
            fontWeight: 700,
          }}
        >
          {number}
        </Box>
        <ThreeDotMenu
          onRename={() => titleRef.current?.beginEdit()}
          onDelete={() =>
            setConfirmDeleteTarget({ type: 'step', id: step.id, label: `Delete step “${step.title}”?` })
          }
        />
      </Box>
      {/* Stop propagation so editing the title doesn't open the drawer. */}
      <Box component="span" sx={{ mt: 0.5, minWidth: 0 }} onClick={(e) => e.stopPropagation()}>
        <InlineEditInput
          ref={titleRef}
          value={step.title}
          onSave={(title) => updateStep(step.id, { title })}
          ariaLabel="Step title"
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            fontSize: 14,
            fontWeight: 500,
            color: 'text.primary',
          }}
        />
      </Box>
    </Box>
  );
}
