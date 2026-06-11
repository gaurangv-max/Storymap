import { useState, type FormEvent } from 'react';
import Box from '@mui/material/Box';
import { useProjectStore } from '../../store/projectStore';
import { Modal } from '../shared/Modal';
import { Input } from '../shared/Input';
import { Textarea } from '../shared/Textarea';
import { Button } from '../shared/Button';

export function CreateProjectModal() {
  const isOpen = useProjectStore((s) => s.isCreateProjectModalOpen);
  const closeModal = useProjectStore((s) => s.closeCreateProjectModal);
  const addProject = useProjectStore((s) => s.addProject);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const reset = () => {
    setName('');
    setDescription('');
    setError('');
  };

  const handleClose = () => {
    reset();
    closeModal();
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Project name is required.');
      return;
    }
    addProject(name, description);
    reset();
    closeModal();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create Project">
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
        <Input
          id="project-name"
          label="Project name"
          placeholder="e.g. Mobile Banking App"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (error) setError('');
          }}
          error={!!error}
          helperText={error}
          autoFocus
        />
        <Textarea
          id="project-description"
          label="Description"
          placeholder="What is this project about?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button type="button" variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit">Create Project</Button>
        </Box>
      </Box>
    </Modal>
  );
}
