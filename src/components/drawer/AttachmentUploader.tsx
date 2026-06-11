import { useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import IconButton from '@mui/material/IconButton';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import CloseIcon from '@mui/icons-material/Close';
import type { Attachment } from '../../types';
import { generateId } from '../../lib/idgen';
import { ATTACHMENT_WARN_BYTES, formatBytes, isStorageNearlyFull } from '../../lib/storage';

interface AttachmentUploaderProps {
  attachments: Attachment[];
  onAddAttachment: (attachment: Attachment) => void;
  onDeleteAttachment: (attachmentId: string) => void;
}

// "Images" section — matches the Figma upload dropzone. Local-only: reads the
// selected file as a base64 data URL (no backend) and stores it on the entity.
// Warns (does not block) on large files or when localStorage is getting full.
// Entity-agnostic — used for both stories and steps.
export function AttachmentUploader({
  attachments,
  onAddAttachment,
  onDeleteAttachment,
}: AttachmentUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [warning, setWarning] = useState('');

  const handleFile = (file: File) => {
    const messages: string[] = [];
    if (file.size > ATTACHMENT_WARN_BYTES) {
      messages.push(`“${file.name}” is ${formatBytes(file.size)} — large files fill up storage fast.`);
    }

    const reader = new FileReader();
    reader.onload = () => {
      onAddAttachment({
        id: generateId(),
        name: file.name,
        type: file.type,
        dataUrl: String(reader.result),
        uploadedAt: new Date().toISOString(),
      });
      if (isStorageNearlyFull()) {
        messages.push('Storage is nearly full. Consider removing large attachments.');
      }
      setWarning(messages.join(' '));
    };
    reader.readAsDataURL(file);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography
        sx={{ mb: 1, fontSize: 14, fontWeight: 600, lineHeight: '22px', color: 'text.secondary' }}
      >
        Images
      </Typography>

      {/* Dashed upload dropzone (Figma "Upload file"). */}
      <ButtonBase
        onClick={() => inputRef.current?.click()}
        sx={{
          width: '100%',
          height: 106,
          flexDirection: 'column',
          gap: 0.5,
          borderRadius: '12px',
          border: '1px dashed rgba(145, 158, 171, 0.48)',
          bgcolor: 'rgba(145, 158, 171, 0.08)',
          color: 'text.disabled',
          transition: 'border-color 0.2s, background-color 0.2s, color 0.2s',
          '&:hover': { borderColor: 'primary.main', bgcolor: 'primary.lighter', color: 'primary.main' },
        }}
      >
        <CloudUploadOutlinedIcon sx={{ fontSize: 32 }} />
        <Typography sx={{ fontSize: 14, lineHeight: '22px' }}>Upload file</Typography>
      </ButtonBase>
      <input
        ref={inputRef}
        type="file"
        accept="image/*,application/pdf,.doc,.docx,.txt"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = '';
        }}
      />

      {warning && (
        <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'warning.main' }}>
          {warning}
        </Typography>
      )}

      {/* Preview thumbnails — small rounded squares with a corner remove button. */}
      {attachments.length > 0 && (
        <Box sx={{ mt: 1.5, display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
          {attachments.map((att) => (
            <Box key={att.id} sx={{ position: 'relative' }}>
              {att.type.startsWith('image/') ? (
                <Box
                  component="img"
                  src={att.dataUrl}
                  alt={att.name}
                  sx={{ width: 49, height: 49, borderRadius: '8px', border: '1px solid', borderColor: 'divider', objectFit: 'cover' }}
                />
              ) : (
                <Box
                  sx={{
                    width: 49,
                    height: 49,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '8px',
                    border: '1px solid',
                    borderColor: 'divider',
                    fontSize: 11,
                    textTransform: 'uppercase',
                    color: 'text.secondary',
                  }}
                >
                  {att.name.split('.').pop()}
                </Box>
              )}
              <IconButton
                aria-label={`Remove ${att.name}`}
                onClick={() => onDeleteAttachment(att.id)}
                sx={{
                  position: 'absolute',
                  right: -6,
                  top: -6,
                  width: 18,
                  height: 18,
                  bgcolor: 'rgba(33,43,54,0.72)',
                  color: 'common.white',
                  '&:hover': { bgcolor: 'text.primary' },
                }}
              >
                <CloseIcon sx={{ fontSize: 12 }} />
              </IconButton>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
