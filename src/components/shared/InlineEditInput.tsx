import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';
import type { SxProps, Theme } from '@mui/material/styles';

export interface InlineEditHandle {
  beginEdit: () => void;
}

interface InlineEditInputProps {
  value: string;
  onSave: (next: string) => void;
  ariaLabel?: string;
  /** Styling for the text + input (applied to both for a seamless swap). */
  sx?: SxProps<Theme>;
}

// Reusable inline editor: text that becomes a focused input on click.
// Enter / blur saves (when non-empty); Escape reverts. Empty submit reverts.
// Parents can trigger edit mode imperatively via the ref's beginEdit().
export const InlineEditInput = forwardRef<InlineEditHandle, InlineEditInputProps>(
  function InlineEditInput({ value, onSave, ariaLabel, sx }, ref) {
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(value);
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({ beginEdit: () => setEditing(true) }), []);

    // Keep the draft in sync when the value changes from elsewhere.
    useEffect(() => {
      if (!editing) setDraft(value);
    }, [value, editing]);

    // Focus + select all when entering edit mode.
    useEffect(() => {
      if (editing) {
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    }, [editing]);

    const commit = () => {
      const trimmed = draft.trim();
      if (trimmed && trimmed !== value) onSave(trimmed);
      else setDraft(value); // revert on empty or unchanged
      setEditing(false);
    };

    const cancel = () => {
      setDraft(value);
      setEditing(false);
    };

    if (editing) {
      return (
        <InputBase
          inputRef={inputRef}
          value={draft}
          fullWidth
          inputProps={{ 'aria-label': ariaLabel }}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              commit();
            } else if (e.key === 'Escape') {
              e.preventDefault();
              cancel();
            }
          }}
          sx={{
            font: 'inherit',
            px: 0.75,
            py: 0.25,
            borderRadius: 1,
            bgcolor: 'grey.100',
            border: '1px solid',
            borderColor: 'divider',
            transition: 'border-color 0.2s, box-shadow 0.2s',
            '&.Mui-focused': {
              borderColor: 'grey.400',
              boxShadow: (theme) => `0 0 0 3px ${theme.palette.action.hover}`,
            },
            ...sx,
            // Always keep typed text dark/readable on the light edit background,
            // even when the display text inherits a light color (e.g. the white
            // journey-header title). Must come after `...sx` to win.
            color: 'text.primary',
          }}
        />
      );
    }

    return (
      <Box
        component="span"
        role="button"
        tabIndex={0}
        title="Click to edit"
        onClick={() => setEditing(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') setEditing(true);
        }}
        sx={{ cursor: 'text', ...sx }}
      >
        {value}
      </Box>
    );
  }
);
