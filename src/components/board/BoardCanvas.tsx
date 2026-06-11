import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import AddIcon from '@mui/icons-material/Add';
import { useBoardStore } from '../../store/boardStore';
import { JourneyColumn } from './JourneyColumn';
import { EmptyState } from '../shared/EmptyState';
import { Button } from '../shared/Button';
import { JOURNEY_GAP, BOARD_INSET } from './boardLayout';

interface BoardCanvasProps {
  mapId: string;
}

// Canvas holding journeys in a single horizontally-scrollable row.
export function BoardCanvas({ mapId }: BoardCanvasProps) {
  const journeys = useBoardStore((s) => s.journeys);
  const addJourney = useBoardStore((s) => s.addJourney);

  const mapJourneys = journeys
    .filter((j) => j.mapId === mapId)
    .sort((a, b) => a.order - b.order);

  if (mapJourneys.length === 0) {
    return (
      <EmptyState
        icon="🧭"
        title="Let's get started"
        description="Add your first journey to begin mapping out steps."
        action={<Button onClick={() => addJourney(mapId)}>+ Add Journey</Button>}
      />
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: JOURNEY_GAP,
        pl: BOARD_INSET,
      }}
    >
      {mapJourneys.map((journey, index) => (
        <Box key={journey.id} sx={{ flexShrink: 0 }}>
          <JourneyColumn journey={journey} index={index} />
        </Box>
      ))}

      {/* Add journey cell — compact plus-only tile */}
      <ButtonBase
        onClick={() => addJourney(mapId)}
        aria-label="Add Journey"
        sx={{
          flexShrink: 0,
          width: 32,
          height: 32,
          borderRadius: 2,
          border: '1px dashed',
          borderColor: 'grey.300',
          color: 'text.disabled',
          transition: 'border-color 0.2s, background-color 0.2s, color 0.2s',
          '&:hover': { borderColor: 'primary.main', bgcolor: 'primary.lighter', color: 'primary.main' },
        }}
      >
        <AddIcon fontSize="small" />
      </ButtonBase>
    </Box>
  );
}
