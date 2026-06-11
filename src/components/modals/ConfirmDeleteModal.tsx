import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useProjectStore } from '../../store/projectStore';
import { useBoardStore } from '../../store/boardStore';
import { Modal } from '../shared/Modal';
import { Button } from '../shared/Button';

// Reusable destructive-action confirm. The target lives in projectStore;
// on confirm we dispatch the matching delete (cascades handled in the stores).
export function ConfirmDeleteModal() {
  const target = useProjectStore((s) => s.confirmDeleteTarget);
  const clear = useProjectStore((s) => s.setConfirmDeleteTarget);

  const deleteProject = useProjectStore((s) => s.deleteProject);
  const deleteStoryMap = useProjectStore((s) => s.deleteStoryMap);
  const deleteJourney = useBoardStore((s) => s.deleteJourney);
  const deleteStep = useBoardStore((s) => s.deleteStep);
  const deleteRelease = useBoardStore((s) => s.deleteRelease);
  const deleteStory = useBoardStore((s) => s.deleteStory);

  const handleConfirm = () => {
    if (!target) return;
    switch (target.type) {
      case 'project':
        deleteProject(target.id);
        break;
      case 'storyMap':
        deleteStoryMap(target.id);
        break;
      case 'journey':
        deleteJourney(target.id);
        break;
      case 'step':
        deleteStep(target.id);
        break;
      case 'release':
        deleteRelease(target.id);
        break;
      case 'story':
        deleteStory(target.id);
        break;
    }
    clear(null);
  };

  return (
    <Modal isOpen={!!target} onClose={() => clear(null)} title="Confirm delete">
      <Typography variant="body2" color="text.secondary">
        {target?.label}
        <br />
        This can't be undone.
      </Typography>
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <Button variant="ghost" onClick={() => clear(null)}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleConfirm}>
          Delete
        </Button>
      </Box>
    </Modal>
  );
}
