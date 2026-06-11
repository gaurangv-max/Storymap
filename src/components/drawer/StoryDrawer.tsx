import { useBoardStore } from '../../store/boardStore';
import { DetailsDrawer } from './DetailsDrawer';

// Story details modal — a thin wrapper that feeds the active story's data and
// store actions into the shared DetailsDrawer.
export function StoryDrawer() {
  const story = useBoardStore((s) => s.stories.find((st) => st.id === s.activeStoryId));
  const closeStoryDrawer = useBoardStore((s) => s.closeStoryDrawer);
  const updateStory = useBoardStore((s) => s.updateStory);
  const addComment = useBoardStore((s) => s.addComment);
  const addAttachment = useBoardStore((s) => s.addAttachment);
  const deleteAttachment = useBoardStore((s) => s.deleteAttachment);

  return (
    <DetailsDrawer
      open={!!story}
      heading="Story Details"
      resetKey={story?.id ?? ''}
      title={story?.title ?? ''}
      description={story?.description ?? ''}
      comments={story?.comments ?? []}
      attachments={story?.attachments ?? []}
      onClose={closeStoryDrawer}
      onSaveTitle={(title) => story && updateStory(story.id, { title })}
      onSaveDescription={(description) => story && updateStory(story.id, { description })}
      onAddComment={(text) => story && addComment(story.id, text)}
      onAddAttachment={(att) => story && addAttachment(story.id, att)}
      onDeleteAttachment={(id) => story && deleteAttachment(story.id, id)}
    />
  );
}
