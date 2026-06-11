import { useRef } from 'react';
import Box from '@mui/material/Box';
import type { Story } from '../../types';
import { useBoardStore } from '../../store/boardStore';
import { useProjectStore } from '../../store/projectStore';
import { InlineEditInput, type InlineEditHandle } from '../shared/InlineEditInput';
import { ThreeDotMenu } from '../shared/ThreeDotMenu';
import { CARD_HEIGHT } from './boardLayout';

interface StoryCardProps {
  story: Story;
}

// White card with a pink top border. Clicking the card opens the details
// drawer; clicking the title edits it inline (without opening the drawer).
export function StoryCard({ story }: StoryCardProps) {
  const updateStory = useBoardStore((s) => s.updateStory);
  const openStoryDrawer = useBoardStore((s) => s.openStoryDrawer);
  const setConfirmDeleteTarget = useProjectStore((s) => s.setConfirmDeleteTarget);
  const titleRef = useRef<InlineEditHandle>(null);

  const open = () => openStoryDrawer(story.id);

  return (
    <Box
      role="button"
      tabIndex={0}
      onClick={open}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          open();
        }
      }}
      sx={{
        height: CARD_HEIGHT,
        width: '100%',
        overflow: 'hidden',
        cursor: 'pointer',
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        borderTop: '3px solid',
        borderTopColor: 'secondary.main',
        bgcolor: 'background.paper',
        p: 1.25,
        boxShadow: (theme) => theme.customShadows.z1,
        transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          borderColor: 'secondary.light',
          boxShadow: (theme) => theme.customShadows.z16,
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.5 }}>
        {/* Stop propagation so editing the title doesn't open the drawer. */}
        <Box component="span" sx={{ flex: 1, minWidth: 0 }} onClick={(e) => e.stopPropagation()}>
          <InlineEditInput
            ref={titleRef}
            value={story.title}
            onSave={(title) => updateStory(story.id, { title })}
            ariaLabel="Story title"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              fontSize: 14,
              fontWeight: 500,
              color: 'text.primary',
            }}
          />
        </Box>
        <ThreeDotMenu
          onRename={() => titleRef.current?.beginEdit()}
          onDelete={() =>
            setConfirmDeleteTarget({ type: 'story', id: story.id, label: `Delete story “${story.title}”?` })
          }
        />
      </Box>
    </Box>
  );
}
