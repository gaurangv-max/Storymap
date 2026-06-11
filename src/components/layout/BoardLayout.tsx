import { Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';
import { ConfirmDeleteModal } from '../modals/ConfirmDeleteModal';

// Full-screen layout for the story map board — no projects sidebar.
// Still mounts the shared delete-confirmation modal so board deletes
// (journeys, steps, releases, stories) keep working.
export function BoardLayout() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden',
        bgcolor: 'grey.100',
      }}
    >
      <Outlet />
      <ConfirmDeleteModal />
    </Box>
  );
}
