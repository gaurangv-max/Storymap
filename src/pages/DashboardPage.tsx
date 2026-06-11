import { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useProjectStore } from '../store/projectStore';
import { Header } from '../components/layout/Header';
import { StoryMapCard } from '../components/dashboard/StoryMapCard';
import { EmptyState } from '../components/shared/EmptyState';
import { Button } from '../components/shared/Button';
import { SearchInput } from '../components/shared/SearchInput';

export function DashboardPage() {
  const projects = useProjectStore((s) => s.projects);
  const storyMaps = useProjectStore((s) => s.storyMaps);
  const selectedProjectId = useProjectStore((s) => s.selectedProjectId);
  const openCreateProjectModal = useProjectStore((s) => s.openCreateProjectModal);
  const openCreateStoryMapModal = useProjectStore((s) => s.openCreateStoryMapModal);

  const [search, setSearch] = useState('');

  // Clear the search box when switching projects.
  useEffect(() => {
    setSearch('');
  }, [selectedProjectId]);

  const selectedProject = useMemo(
    () => projects.find((p) => p.id === selectedProjectId) ?? null,
    [projects, selectedProjectId]
  );

  const mapsForProject = useMemo(
    () => storyMaps.filter((m) => m.projectId === selectedProjectId),
    [storyMaps, selectedProjectId]
  );

  // Filter by title (case-insensitive). No debounce needed at MVP scale.
  const filteredMaps = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return mapsForProject;
    return mapsForProject.filter((m) => m.name.toLowerCase().includes(query));
  }, [mapsForProject, search]);

  // No project selected (e.g. none exist yet).
  if (!selectedProject) {
    return (
      <>
        <Header title="Dashboard" />
        <Box sx={{ flex: 1, overflowY: 'auto', p: 4 }}>
          <EmptyState
            icon="📁"
            title="No project selected"
            description="Create a project to start organizing your story maps."
            action={<Button onClick={openCreateProjectModal}>+ Create Project</Button>}
          />
        </Box>
      </>
    );
  }

  return (
    <>
      <Header title={selectedProject.name} subtitle={selectedProject.description} />

      <Box sx={{ flex: 1, overflowY: 'auto', p: 4 }}>
        {/* Toolbar: search + create */}
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ width: '100%', maxWidth: 320 }}>
            <SearchInput
              id="storymap-search"
              placeholder="Search story maps…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Box>
          <Box sx={{ ml: 'auto' }}>
            <Button onClick={openCreateStoryMapModal}>+ Create Story Map</Button>
          </Box>
        </Box>

        {/* Section heading */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Story Maps
          </Typography>
          <Typography variant="body2" color="text.secondary">
            All story maps inside this project
          </Typography>
        </Box>

        {/* Grid / empty states */}
        {mapsForProject.length === 0 ? (
          <EmptyState
            icon="🗺️"
            title="No story maps yet"
            description="Create your first story map for this project."
            action={<Button onClick={openCreateStoryMapModal}>+ Create Story Map</Button>}
          />
        ) : filteredMaps.length === 0 ? (
          <EmptyState
            icon="🔍"
            title="No matches"
            description="No story maps match your search."
          />
        ) : (
          <Box
            sx={{
              display: 'grid',
              gap: 2.5,
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(4, 1fr)',
              },
            }}
          >
            {filteredMaps.map((map) => (
              <StoryMapCard key={map.id} storyMap={map} />
            ))}
          </Box>
        )}
      </Box>
    </>
  );
}
