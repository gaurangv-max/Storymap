import { useState, type MouseEvent } from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import type { SxProps, Theme } from '@mui/material/styles';

interface ThreeDotMenuProps {
  onRename?: () => void;
  onDelete?: () => void;
  /** Label for the rename/edit action (default "Rename"). */
  renameLabel?: string;
  /** Hide the trigger until the parent row is hovered (or the menu is open). */
  revealOnHover?: boolean;
  /** Style overrides for the trigger button. */
  triggerSx?: SxProps<Theme>;
}

// Reusable "⋯" trigger + dropdown. Same public API as before; MUI Menu
// handles click-outside + Escape internally.
export function ThreeDotMenu({
  onRename,
  onDelete,
  renameLabel = 'Rename',
  revealOnHover = false,
  triggerSx,
}: ThreeDotMenuProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const openMenu = (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };
  const closeMenu = (e?: object) => {
    (e as MouseEvent)?.stopPropagation?.();
    setAnchorEl(null);
  };
  const run = (fn?: () => void) => (e: MouseEvent) => {
    e.stopPropagation();
    setAnchorEl(null);
    fn?.();
  };

  return (
    <>
      <IconButton
        size="small"
        aria-label="Actions"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={openMenu}
        className={revealOnHover ? 'reveal-on-hover' : undefined}
        sx={{
          color: 'text.secondary',
          // When reveal-on-hover is on, stay hidden unless the menu is open.
          // The parent row sets `& .reveal-on-hover { opacity: 1 }` on :hover.
          ...(revealOnHover && { opacity: open ? 1 : 0, transition: 'opacity 0.15s' }),
          ...triggerSx,
        }}
      >
        <MoreVertIcon fontSize="small" />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={closeMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ list: { dense: true } }}
      >
        {onRename && (
          <MenuItem onClick={run(onRename)}>
            <ListItemIcon sx={{ color: 'text.secondary' }}>
              <EditOutlinedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>{renameLabel}</ListItemText>
          </MenuItem>
        )}
        {onDelete && (
          <MenuItem onClick={run(onDelete)} sx={{ color: 'error.main' }}>
            <ListItemIcon sx={{ color: 'error.main' }}>
              <DeleteOutlineIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItem>
        )}
      </Menu>
    </>
  );
}
