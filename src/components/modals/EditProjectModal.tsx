import { useEffect, useState, type FormEvent } from 'react';
import Box from '@mui/material/Box';
import { useProjectStore } from '../../store/projectStore';
import { Modal } from '../shared/Modal';
import { Input } from '../shared/Input';
import { Textarea } from '../shared/Textarea';
import { Button } from '../shared/Button';

// "Edit Project Details" panel — opened from a project's three-dot menu.
// Pre-fills the form with the project's current name + description and saves
// edits via updateProject.
export function EditProjectModal() {
  const editingProjectId = useProjectStore((s) => s.editingProjectId);
  const project = useProjectStore((s) =>
    s.projects.find((p) => p.id === s.editingProjectId)
  );
  const closeModal = useProjectStore((s) => s.closeEditProjectModal);
  const updateProject = useProjectStore((s) => s.updateProject);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  // Load the project's values whenever the edit target changes.
  useEffect(() => {
    if (project) {
      setName(project.name);
      setDescription(project.description);
      setError('');
    }
  }, [editingProjectId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!project) return;
    if (!name.trim()) {
      setError('Project name is required.');
      return;
    }
    updateProject(project.id, { name, description });
    closeModal();
  };

  return (
    <Modal isOpen={!!editingProjectId} onClose={closeModal} title="Edit Project Details">
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
        <Input
          id="edit-project-name"
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
          id="edit-project-description"
          label="Description"
          placeholder="What is this project about?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button type="button" variant="ghost" onClick={closeModal}>
            Cancel
          </Button>
          <Button type="submit">Save Changes</Button>
        </Box>
      </Box>
    </Modal>
  );
}
