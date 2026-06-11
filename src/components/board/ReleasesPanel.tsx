import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import { useBoardStore } from '../../store/boardStore';
import { ReleaseSection } from './ReleaseSection';

interface ReleasesPanelProps {
  mapId: string;
}

// Renders the pink dotted "Add Release" line followed by the stacked
// release bands for this map.
export function ReleasesPanel({ mapId }: ReleasesPanelProps) {
  const releases = useBoardStore((s) => s.releases);
  const journeys = useBoardStore((s) => s.journeys);
  const steps = useBoardStore((s) => s.steps);
  const addRelease = useBoardStore((s) => s.addRelease);

  const mapReleases = releases
    .filter((r) => r.mapId === mapId)
    .sort((a, b) => a.order - b.order);

  // The backbone columns (journeys → ordered steps) that every release aligns
  // its story columns to. Same order as the BoardCanvas backbone above.
  const columns = journeys
    .filter((j) => j.mapId === mapId)
    .sort((a, b) => a.order - b.order)
    .map((journey) => ({
      journey,
      steps: steps.filter((s) => s.journeyId === journey.id).sort((a, b) => a.order - b.order),
    }));

  return (
    <Box sx={{ mt: 5 }}>
      {/* Pink dotted line with the Add Release button at its start. */}
      <Box sx={{ mb: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <ButtonBase
          onClick={() => addRelease(mapId)}
          sx={{
            flexShrink: 0,
            borderRadius: 1.25,
            border: '1px solid',
            borderColor: 'secondary.main',
            bgcolor: 'secondary.lighter',
            color: 'secondary.main',
            px: 1.5,
            py: 0.75,
            fontSize: 12,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            transition: 'background-color 0.2s, color 0.2s',
            '&:hover': { bgcolor: 'secondary.main', color: 'secondary.contrastText' },
          }}
        >
          + Add Release
        </ButtonBase>
        <Box sx={{ flex: 1, borderTop: '2px dashed', borderColor: 'secondary.main', opacity: 0.6 }} />
      </Box>

      {/* Stacked releases */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {mapReleases.map((release) => (
          <ReleaseSection key={release.id} release={release} columns={columns} />
        ))}
      </Box>
    </Box>
  );
}
