import { useEffect, useRef, useState, type ReactNode } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import StrikethroughSIcon from '@mui/icons-material/StrikethroughS';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import LinkIcon from '@mui/icons-material/Link';
import { sanitizeHtml } from '../../lib/sanitizeHtml';

interface RichTextEditorProps {
  /** Current HTML value. */
  value: string;
  /** Fires with the editor's HTML whenever content changes. */
  onChange: (html: string) => void;
  placeholder?: string;
}

type Align = 'left' | 'center' | 'right';

// A contentEditable div is considered empty when it has no text and at most a
// stray <br>/empty wrapper that browsers leave behind after deleting everything.
function isHtmlEmpty(html: string): boolean {
  const stripped = html
    .replace(/<br\s*\/?>/gi, '')
    .replace(/<div>\s*<\/div>/gi, '')
    .replace(/&nbsp;/gi, '')
    .replace(/<[^>]*>/g, '')
    .trim();
  return stripped.length === 0;
}

const toolBtnSx = {
  width: 30,
  height: 30,
  borderRadius: '6px',
  color: 'text.secondary',
  '&:hover': { bgcolor: 'action.hover', color: 'text.primary' },
  '&[aria-pressed="true"]': { bgcolor: 'action.selected', color: 'text.primary' },
} as const;

const iconSx = { fontSize: 18 } as const;

// Rich-text description editor recreated from the Figma "Editor" component.
// Uses the native execCommand API (no extra dependency) so Bold / Italic /
// Underline / Strikethrough / numbered + bulleted lists / alignment / links
// all work. Content is stored as an HTML string on the story description.
export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [, forceRender] = useState(0);
  const [align, setAlign] = useState<Align>('left');
  const refresh = () => forceRender((n) => n + 1);

  // Push external value changes (e.g. switching stories) into the DOM without
  // clobbering the caret while the user is typing. Sanitize first so stored or
  // pasted markup can never execute when injected via innerHTML.
  useEffect(() => {
    const el = ref.current;
    const clean = sanitizeHtml(value || '');
    if (el && el.innerHTML !== clean) el.innerHTML = clean;
  }, [value]);

  const emit = () => onChange(sanitizeHtml(ref.current?.innerHTML ?? ''));

  const exec = (command: string, arg?: string) => {
    ref.current?.focus();
    document.execCommand(command, false, arg);
    emit();
    refresh();
  };

  const isActive = (command: string): boolean => {
    try {
      return document.queryCommandState(command);
    } catch {
      return false;
    }
  };

  const cycleAlign = () => {
    const next: Align = align === 'left' ? 'center' : align === 'center' ? 'right' : 'left';
    setAlign(next);
    exec(next === 'left' ? 'justifyLeft' : next === 'center' ? 'justifyCenter' : 'justifyRight');
  };

  const addLink = () => {
    const url = window.prompt('Enter a URL (https://…)');
    if (!url) return;
    const href = /^https?:\/\//i.test(url) ? url : `https://${url}`;
    exec('createLink', href);
  };

  const AlignIcon =
    align === 'center' ? FormatAlignCenterIcon : align === 'right' ? FormatAlignRightIcon : FormatAlignLeftIcon;

  const empty = isHtmlEmpty(value);

  return (
    <Box
      sx={{
        height: 430,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '8px',
        border: '1px solid',
        borderColor: 'divider',
        overflow: 'hidden',
      }}
    >
      {/* Toolbar — exactly the controls shown in the Figma design. */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          px: 1.5,
          py: 0.75,
          borderBottom: '1px solid',
          borderColor: 'divider',
          flexWrap: 'wrap',
        }}
      >
        <ToolGroup>
          <ToolButton label="Bold" active={isActive('bold')} onClick={() => exec('bold')}>
            <FormatBoldIcon sx={iconSx} />
          </ToolButton>
          <ToolButton label="Italic" active={isActive('italic')} onClick={() => exec('italic')}>
            <FormatItalicIcon sx={iconSx} />
          </ToolButton>
          <ToolButton label="Underline" active={isActive('underline')} onClick={() => exec('underline')}>
            <FormatUnderlinedIcon sx={iconSx} />
          </ToolButton>
          <ToolButton
            label="Strikethrough"
            active={isActive('strikeThrough')}
            onClick={() => exec('strikeThrough')}
          >
            <StrikethroughSIcon sx={iconSx} />
          </ToolButton>
        </ToolGroup>

        <ToolGroup>
          <ToolButton
            label="Numbered list"
            active={isActive('insertOrderedList')}
            onClick={() => exec('insertOrderedList')}
          >
            <FormatListNumberedIcon sx={iconSx} />
          </ToolButton>
          <ToolButton
            label="Bulleted list"
            active={isActive('insertUnorderedList')}
            onClick={() => exec('insertUnorderedList')}
          >
            <FormatListBulletedIcon sx={iconSx} />
          </ToolButton>
        </ToolGroup>

        <ToolGroup>
          <ToolButton label={`Align ${align}`} onClick={cycleAlign}>
            <AlignIcon sx={iconSx} />
          </ToolButton>
        </ToolGroup>

        <ToolGroup>
          <ToolButton label="Insert link" onClick={addLink}>
            <LinkIcon sx={iconSx} />
          </ToolButton>
        </ToolGroup>
      </Box>

      {/* Editable content area. */}
      <Box sx={{ position: 'relative', flex: 1, minHeight: 0 }}>
        {empty && (
          <Box
            aria-hidden
            sx={{
              position: 'absolute',
              top: 12,
              left: 16,
              pointerEvents: 'none',
              color: 'text.disabled',
              fontSize: 16,
              lineHeight: '24px',
            }}
          >
            {placeholder}
          </Box>
        )}
        <Box
          ref={ref}
          contentEditable
          suppressContentEditableWarning
          role="textbox"
          aria-multiline="true"
          aria-label="Description"
          onInput={() => {
            emit();
            refresh();
          }}
          onPaste={(e) => {
            // Intercept paste so raw HTML never lands in the live DOM (where an
            // <img onerror> would fire). Insert a sanitized version instead.
            e.preventDefault();
            const html = e.clipboardData.getData('text/html');
            if (html) {
              document.execCommand('insertHTML', false, sanitizeHtml(html));
            } else {
              document.execCommand('insertText', false, e.clipboardData.getData('text/plain'));
            }
            emit();
            refresh();
          }}
          onKeyUp={refresh}
          onMouseUp={refresh}
          sx={{
            height: '100%',
            overflowY: 'auto',
            px: 2,
            py: 1.5,
            fontSize: 16,
            lineHeight: '24px',
            color: 'text.primary',
            outline: 'none',
            '& ul, & ol': { pl: 3, my: 1 },
            '& a': { color: 'primary.main', textDecoration: 'underline' },
            '& p': { m: 0 },
          }}
        />
      </Box>
    </Box>
  );
}

function ToolGroup({ children }: { children: ReactNode }) {
  return <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>{children}</Box>;
}

function ToolButton({
  label,
  active,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <Tooltip title={label} arrow>
      <IconButton
        aria-label={label}
        aria-pressed={active ? 'true' : 'false'}
        // Use onMouseDown so the editor keeps its selection when the button is clicked.
        onMouseDown={(e) => {
          e.preventDefault();
          onClick();
        }}
        sx={toolBtnSx}
      >
        {children}
      </IconButton>
    </Tooltip>
  );
}
