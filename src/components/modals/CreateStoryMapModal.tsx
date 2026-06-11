import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import { useProjectStore } from '../../store/projectStore';
import { Modal } from '../shared/Modal';
import { Input } from '../shared/Input';
import { Button } from '../shared/Button';

export function CreateStoryMapModal() {
  const navigate = useNavigate();
  const isOpen = useProjectStore((s) => s.isCreateStoryMapModalOpen);
  const closeModal = useProjectStore((s) => s.closeCreateStoryMapModal);
  const addStoryMap = useProjectStore((s) => s.addStoryMap);
  const selectedProjectId = useProjectStore((s) => s.selectedProjectId);

  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const reset = () => {
    setName('');
    setError('');
  };

  const handleClose = () => {
    reset();
    closeModal();
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId) return;
    if (!name.trim()) {
      setError('Story map name is required.');
      return;
    }
    const map = addStoryMap(selectedProjectId, name);
    reset();
    closeModal();
    navigate(`/board/${map.id}`);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create Story Map">
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
        <Input
          id="storymap-name"
          label="Story map name"
          placeholder="e.g. Onboarding & KYC Flow"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (error) setError('');
          }}
          error={!!error}
          helperText={error}
          autoFocus
        />
        <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button type="button" variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit">Create Story Map</Button>
        </Box>
      </Box>
    </Modal>
  );
}
