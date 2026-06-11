import { useBoardStore } from '../../store/boardStore';
import { DetailsDrawer } from './DetailsDrawer';

// Step details modal — same UI/behaviour as the story drawer, fed by the
// active step's data and the step-specific store actions.
export function StepDrawer() {
  const step = useBoardStore((s) => s.steps.find((st) => st.id === s.activeStepId));
  const closeStepDrawer = useBoardStore((s) => s.closeStepDrawer);
  const updateStep = useBoardStore((s) => s.updateStep);
  const addStepComment = useBoardStore((s) => s.addStepComment);
  const addStepAttachment = useBoardStore((s) => s.addStepAttachment);
  const deleteStepAttachment = useBoardStore((s) => s.deleteStepAttachment);

  return (
    <DetailsDrawer
      open={!!step}
      heading="Step Details"
      resetKey={step?.id ?? ''}
      title={step?.title ?? ''}
      description={step?.description ?? ''}
      comments={step?.comments ?? []}
      attachments={step?.attachments ?? []}
      onClose={closeStepDrawer}
      onSaveTitle={(title) => step && updateStep(step.id, { title })}
      onSaveDescription={(description) => step && updateStep(step.id, { description })}
      onAddComment={(text) => step && addStepComment(step.id, text)}
      onAddAttachment={(att) => step && addStepAttachment(step.id, att)}
      onDeleteAttachment={(id) => step && deleteStepAttachment(step.id, id)}
    />
  );
}
