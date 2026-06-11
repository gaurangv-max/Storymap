import Box from '@mui/material/Box';
import type { SxProps, Theme } from '@mui/material/styles';

interface LogoProps {
  /** Which logo asset to show — 'black' for light backgrounds, 'white' for dark. */
  variant?: 'black' | 'white';
  /** Rendered height in px (width scales with the SVG aspect ratio). */
  height?: number;
  sx?: SxProps<Theme>;
}

// Renders the provided "Software Co" logo SVGs from /public (unchanged).
export function Logo({ variant = 'black', height = 28, sx }: LogoProps) {
  return (
    <Box
      component="img"
      src={variant === 'white' ? '/logo-white.svg' : '/logo-black.svg'}
      alt="Software Co"
      sx={[
        { height, width: 'auto', display: 'block', userSelect: 'none' },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    />
  );
}
