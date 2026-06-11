import { Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';
import { Sidebar } from './Sidebar';
import { CreateProjectModal } from '../modals/CreateProjectModal';
import { CreateStoryMapModal } from '../modals/CreateStoryMapModal';
import { EditProjectModal } from '../modals/EditProjectModal';
import { ConfirmDeleteModal } from '../modals/ConfirmDeleteModal';

// Root shell: fixed sidebar on the left, routed page content on the right.
// Shared modals live here so they're reachable from any page.
export function AppLayout() {
  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', bgcolor: 'grey.100' }}>
      <Sidebar />
      <Box component="main" sx={{ display: 'flex', flex: 1, flexDirection: 'column', overflow: 'hidden' }}>
        <Outlet />
      </Box>
      <CreateProjectModal />
      <CreateStoryMapModal />
      <EditProjectModal />
      <ConfirmDeleteModal />
    </Box>
  );
}
