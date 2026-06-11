import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { StoryMap } from '../../types';
import { useProjectStore } from '../../store/projectStore';
import { useBoardStore } from '../../store/boardStore';
import { Card } from '../shared/Card';
import { ThreeDotMenu } from '../shared/ThreeDotMenu';
import { InlineEditInput, type InlineEditHandle } from '../shared/InlineEditInput';
import { formatDate } from '../../lib/dateFormat';

interface StoryMapCardProps {
  storyMap: StoryMap;
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <Box>
      <Typography sx={{ fontSize: 18, fontWeight: 700, lineHeight: 1, color: 'text.primary' }}>
        {value}
      </Typography>
      <Typography
        sx={{
          mt: 0.5,
          fontSize: 11,
          fontWeight: 500,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          color: 'text.disabled',
        }}
      >
        {label}
      </Typography>
    </Box>
  );
}

export function StoryMapCard({ storyMap }: StoryMapCardProps) {
  const navigate = useNavigate();
  const updateStoryMap = useProjectStore((s) => s.updateStoryMap);
  const setConfirmDeleteTarget = useProjectStore((s) => s.setConfirmDeleteTarget);
  const titleRef = useRef<InlineEditHandle>(null);

  // Counts derived from the board store (single source of truth).
  const journeyCount = useBoardStore((s) => s.journeys.filter((j) => j.mapId === storyMap.id).length);
  const stepCount = useBoardStore((s) => s.steps.filter((st) => st.mapId === storyMap.id).length);
  const releaseCount = useBoardStore((s) => s.releases.filter((r) => r.mapId === storyMap.id).length);
  const storyCount = useBoardStore((s) => s.stories.filter((st) => st.mapId === storyMap.id).length);

  const open = () => navigate(`/board/${storyMap.id}`);

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={open}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          open();
        }
      }}
      sx={{ cursor: 'pointer', '&:hover': { borderColor: 'primary.light' } }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1, mb: 2.5 }}>
        <Box component="span" sx={{ minWidth: 0, flex: 1 }} onClick={(e) => e.stopPropagation()}>
          <InlineEditInput
            ref={titleRef}
            value={storyMap.name}
            onSave={(name) => updateStoryMap(storyMap.id, { name })}
            ariaLabel="Story map name"
            sx={{ display: 'block', fontSize: 16, fontWeight: 600, color: 'text.primary' }}
          />
        </Box>
        <ThreeDotMenu
          onRename={() => titleRef.current?.beginEdit()}
          onDelete={() =>
            setConfirmDeleteTarget({
              type: 'storyMap',
              id: storyMap.id,
              label: `Delete story map “${storyMap.name}”?`,
            })
          }
        />
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          columnGap: 1.5,
          rowGap: 2,
          mb: 2.5,
        }}
      >
        <Stat label="Journeys" value={journeyCount} />
        <Stat label="Steps" value={stepCount} />
        <Stat label="Releases" value={releaseCount} />
        <Stat label="Stories" value={storyCount} />
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pt: 2,
          borderTop: '1px solid',
          borderColor: 'divider',
          fontSize: 12,
          color: 'text.secondary',
        }}
      >
        <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75 }}>
          <Box
            component="span"
            sx={{
              width: 20,
              height: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              bgcolor: 'primary.lighter',
              color: 'primary.dark',
              fontSize: 10,
              fontWeight: 600,
            }}
          >
            {storyMap.createdBy.charAt(0)}
          </Box>
          {storyMap.createdBy}
        </Box>
        <span>{formatDate(storyMap.createdAt)}</span>
      </Box>
    </Card>
  );
}
