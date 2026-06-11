import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface HeaderProps {
  title: ReactNode;
  subtitle?: string;
  actions?: ReactNode;
  /** Optional element rendered before the title (e.g. a back arrow). */
  leading?: ReactNode;
}

// Reusable top header area for pages.
export function Header({ title, subtitle, actions, leading }: HeaderProps) {
  return (
    <Box
      component="header"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        px: 4,
        py: 2.5,
        borderBottom: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
        {leading && <Box sx={{ flexShrink: 0 }}>{leading}</Box>}
        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="h6"
            component="h1"
            noWrap
            sx={{ fontWeight: 700, letterSpacing: '-0.01em' }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary" noWrap sx={{ mt: 0.25 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
      </Box>
      {actions && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>{actions}</Box>
      )}
    </Box>
  );
}
