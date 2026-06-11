import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { useProjectStore } from '../../store/projectStore';
import { Button } from '../shared/Button';
import { ThreeDotMenu } from '../shared/ThreeDotMenu';
import { Logo } from '../shared/Logo';

export function Sidebar() {
  const navigate = useNavigate();
  const projects = useProjectStore((s) => s.projects);
  const selectedProjectId = useProjectStore((s) => s.selectedProjectId);
  const selectProject = useProjectStore((s) => s.selectProject);
  const openModal = useProjectStore((s) => s.openCreateProjectModal);
  const openEditProjectModal = useProjectStore((s) => s.openEditProjectModal);
  const setConfirmDeleteTarget = useProjectStore((s) => s.setConfirmDeleteTarget);

  const handleSelect = (id: string) => {
    selectProject(id);
    navigate('/');
  };

  return (
    <Box
      component="aside"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: 256,
        height: '100%',
        borderRight: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      {/* Logo */}
      <Box sx={{ display: 'flex', alignItems: 'center', px: 2.5, py: 3 }}>
        <Logo variant="black" height={22} />
      </Box>

      {/* Project list */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: 1.5 }}>
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            px: 1,
            pt: 1,
            pb: 0.5,
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'text.disabled',
          }}
        >
          Projects
        </Typography>

        {projects.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ px: 1, py: 2 }}>
            Create a project to get started.
          </Typography>
        ) : (
          <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            {projects.map((project) => {
              const active = project.id === selectedProjectId;
              return (
                <ListItem
                  key={project.id}
                  disablePadding
                  secondaryAction={
                    <ThreeDotMenu
                      revealOnHover
                      renameLabel="Edit"
                      onRename={() => openEditProjectModal(project.id)}
                      onDelete={() =>
                        setConfirmDeleteTarget({
                          type: 'project',
                          id: project.id,
                          label: `Delete project “${project.name}” and all its story maps?`,
                        })
                      }
                    />
                  }
                  sx={{
                    '& .MuiListItemSecondaryAction-root': { right: 4 },
                    // Reveal the three-dot menu only while hovering the row.
                    '&:hover .reveal-on-hover': { opacity: 1 },
                  }}
                >
                  <ListItemButton
                    selected={active}
                    onClick={() => handleSelect(project.id)}
                    sx={{ borderRadius: 2, pr: 5 }}
                  >
                    <ListItemText
                      primary={project.name}
                      slotProps={{
                        primary: {
                          noWrap: true,
                          sx: { fontSize: 14, fontWeight: active ? 600 : 500 },
                        },
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        )}
      </Box>

      {/* Create project */}
      <Box sx={{ p: 1.5, borderTop: '1px solid', borderColor: 'divider' }}>
        <Button onClick={openModal} fullWidth>
          + Create Project
        </Button>
      </Box>
    </Box>
  );
}
