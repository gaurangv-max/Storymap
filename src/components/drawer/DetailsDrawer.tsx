import { useEffect, useRef, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import type { Attachment, Comment } from '../../types';
import { Button } from '../shared/Button';
import { Modal } from '../shared/Modal';
import { sanitizeHtml } from '../../lib/sanitizeHtml';
import { InlineEditInput } from '../shared/InlineEditInput';
import { RichTextEditor } from './RichTextEditor';
import { CommentSection } from './CommentSection';
import { AttachmentUploader } from './AttachmentUploader';

interface DetailsDrawerProps {
  open: boolean;
  /** Heading text, e.g. "Story Details" / "Step Details". */
  heading: string;
  /** Identity of the open entity — used to reload the description buffer. */
  resetKey: string;
  title: string;
  description: string;
  comments: Comment[];
  attachments: Attachment[];
  onClose: () => void;
  onSaveTitle: (title: string) => void;
  onSaveDescription: (html: string) => void;
  onAddComment: (text: string) => void;
  onAddAttachment: (attachment: Attachment) => void;
  onDeleteAttachment: (attachmentId: string) => void;
}

// Centered details modal recreated from the Figma design
// (file sKsAuLWUzZPECcbFCKChUm, node 3906:3653). Title saves instantly; the
// rich-text description is buffered and committed on "Save Changes". Comments
// and attachments save immediately. Shared by both stories and steps.
export function DetailsDrawer({
  open,
  heading,
  resetKey,
  title,
  description: savedDescription,
  comments,
  attachments,
  onClose,
  onSaveTitle,
  onSaveDescription,
  onAddComment,
  onAddAttachment,
  onDeleteAttachment,
}: DetailsDrawerProps) {
  const [description, setDescription] = useState('');
  const [confirmDiscardOpen, setConfirmDiscardOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load buffer when the open entity changes. Sanitize the seed so saving an
  // item with pre-existing unsafe markup (without editing) writes back clean.
  useEffect(() => {
    setDescription(sanitizeHtml(savedDescription));
    setSaved(false);
  }, [resetKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // Clear any pending "Saved ✓" timer on unmount.
  useEffect(() => () => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
  }, []);

  const isDirty = description !== savedDescription;

  // Closing with unsaved edits routes through a custom confirm popup instead
  // of the browser's native window.confirm dialog.
  const requestClose = () => {
    if (isDirty) {
      setConfirmDiscardOpen(true);
      return;
    }
    onClose();
  };

  const discardAndClose = () => {
    setConfirmDiscardOpen(false);
    onClose();
  };

  const handleSave = () => {
    onSaveDescription(description);
    // Show a brief "Saved ✓" confirmation, then close the drawer.
    setSaved(true);
    saveTimer.current = setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <Dialog
      open={open}
      onClose={requestClose}
      maxWidth={false}
      slotProps={{
        paper: {
          sx: {
            width: 1011,
            maxWidth: '95vw',
            maxHeight: '95vh',
            m: 2,
            p: 3,
            borderRadius: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            boxShadow:
              '0px 0px 1px rgba(145,158,171,0.2), 0px 12px 12px rgba(145,158,171,0.12)',
          },
        },
      }}
    >
      {open && (
        <>
          {/* Scrollable content */}
          <Box
            sx={{ display: 'flex', flexDirection: 'column', gap: 3, overflowY: 'auto', minHeight: 0 }}
          >
            {/* Header: heading + close-square */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <Typography
                sx={{ fontSize: 24, fontWeight: 700, lineHeight: '36px', color: 'text.primary' }}
              >
                {heading}
              </Typography>
              <IconButton
                aria-label="Close"
                onClick={requestClose}
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '8px',
                  color: 'text.secondary',
                  bgcolor: 'rgba(145,158,171,0.16)',
                  '&:hover': { bgcolor: 'rgba(145,158,171,0.28)' },
                }}
              >
                <CloseIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Box>

            {/* Title (editable, styled as the Figma "Title Here") */}
            <InlineEditInput
              value={title}
              onSave={onSaveTitle}
              ariaLabel="Title"
              sx={{ display: 'block', fontSize: 24, fontWeight: 700, lineHeight: '36px', color: 'text.primary' }}
            />

            {/* Description (rich-text editor) */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography
                sx={{ fontSize: 14, fontWeight: 600, lineHeight: '22px', color: 'text.secondary' }}
              >
                Description
              </Typography>
              <RichTextEditor
                value={description}
                onChange={setDescription}
                placeholder="Write something awesome..."
              />
            </Box>

            {/* Two-column row: Add Comment (left) + Images (right) */}
            <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <CommentSection comments={comments} onAddComment={onAddComment} />
              <Box sx={{ width: 353, maxWidth: '100%', flexShrink: 0 }}>
                <AttachmentUploader
                  attachments={attachments}
                  onAddAttachment={onAddAttachment}
                  onDeleteAttachment={onDeleteAttachment}
                />
              </Box>
            </Box>
          </Box>

          {/* Save Changes (bottom-right), with a brief "Saved ✓" confirmation. */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              onClick={handleSave}
              disabled={saved}
              startIcon={saved ? <CheckIcon /> : undefined}
              sx={saved ? { '&.Mui-disabled': { bgcolor: 'success.main', color: 'common.white' } } : undefined}
            >
              {saved ? 'Saved' : 'Save Changes'}
            </Button>
          </Box>

          {/* Custom "discard changes?" confirmation (replaces window.confirm) */}
          <Modal
            isOpen={confirmDiscardOpen}
            onClose={() => setConfirmDiscardOpen(false)}
            title="Discard changes?"
          >
            <Typography variant="body2" color="text.secondary">
              Sure you want to cancel and discard the unsaved changes?
            </Typography>
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Button variant="ghost" onClick={() => setConfirmDiscardOpen(false)}>
                Keep editing
              </Button>
              <Button variant="danger" onClick={discardAndClose}>
                Discard
              </Button>
            </Box>
          </Modal>
        </>
      )}
    </Dialog>
  );
}
