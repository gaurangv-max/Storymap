import type { ReactNode } from 'react';
import Chip from '@mui/material/Chip';
import type { SxProps, Theme } from '@mui/material/styles';

type Tone = 'primary' | 'accent' | 'neutral';

interface BadgeProps {
  children: ReactNode;
  tone?: Tone;
  sx?: SxProps<Theme>;
}

const toneSx: Record<Tone, object> = {
  primary: { bgcolor: 'primary.light', color: 'primary.main' },
  accent: { bgcolor: 'secondary.main', color: 'secondary.contrastText' },
  neutral: { bgcolor: 'grey.100', color: 'text.secondary' },
};

// Small count/label pill. Renders a themed MUI Chip.
export function Badge({ children, tone = 'neutral', sx }: BadgeProps) {
  return (
    <Chip
      label={children}
      size="small"
      sx={[{ fontWeight: 600 }, toneSx[tone], ...(Array.isArray(sx) ? sx : [sx])]}
    />
  );
}
