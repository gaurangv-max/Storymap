import { useNavigate, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useProjectStore } from '../store/projectStore';
import { useBoardStore } from '../store/boardStore';
import { Header } from '../components/layout/Header';
import { InlineEditInput } from '../components/shared/InlineEditInput';
import { BoardCanvas } from '../components/board/BoardCanvas';
import { ReleasesPanel } from '../components/board/ReleasesPanel';
import { StoryDrawer } from '../components/drawer/StoryDrawer';
import { StepDrawer } from '../components/drawer/StepDrawer';
import { EmptyState } from '../components/shared/EmptyState';
import { Button } from '../components/shared/Button';

export function StoryMapBoardPage() {
  const { mapId } = useParams<{ mapId: string }>();
  const navigate = useNavigate();
  const storyMap = useProjectStore((s) => s.storyMaps.find((m) => m.id === mapId));
  const updateStoryMap = useProjectStore((s) => s.updateStoryMap);
  const addJourney = useBoardStore((s) => s.addJourney);

  if (!storyMap) {
    return (
      <>
        <Header
          title="Story Map"
          actions={
            <Button variant="ghost" startIcon={<ArrowBackIcon />} onClick={() => navigate('/')}>
              Back
            </Button>
          }
        />
        <Box sx={{ flex: 1, overflow: 'auto', p: 4 }}>
          <EmptyState
            icon="❓"
            title="Story map not found"
            description="This map may have been deleted."
            action={<Button onClick={() => navigate('/')}>Back to dashboard</Button>}
          />
        </Box>
      </>
    );
  }

  return (
    <>
      <Header
        leading={
          <Button variant="ghost" startIcon={<ArrowBackIcon />} onClick={() => navigate('/')}>
            Back
          </Button>
        }
        title={
          <InlineEditInput
            value={storyMap.name}
            onSave={(name) => updateStoryMap(storyMap.id, { name })}
            ariaLabel="Story map name"
            sx={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.01em', color: 'text.primary' }}
          />
        }
        actions={<Button onClick={() => addJourney(storyMap.id)}>+ Add Journey</Button>}
      />
      <Box sx={{ flex: 1, overflow: 'auto', bgcolor: 'grey.100', p: 3 }}>
        <Box
          sx={{
            // Grow to the full board width so the backbone + release bands share
            // one horizontal scroll and their columns stay aligned.
            width: 'max-content',
            minWidth: '100%',
            minHeight: '100%',
            borderRadius: 4,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            p: 3,
            boxShadow: (theme) => theme.customShadows.card,
          }}
        >
          <BoardCanvas mapId={storyMap.id} />
          <ReleasesPanel mapId={storyMap.id} />
        </Box>
      </Box>
      <StoryDrawer />
      <StepDrawer />
    </>
  );
}
