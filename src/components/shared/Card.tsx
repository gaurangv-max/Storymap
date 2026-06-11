import MuiCard, { type CardProps as MuiCardProps } from '@mui/material/Card';

// Generic white surface. Renders a themed MUI Card and keeps the original
// passthrough props (onClick, role, tabIndex, onKeyDown, className, sx).
export function Card({ children, sx, ...props }: MuiCardProps) {
  return (
    <MuiCard
      sx={{
        p: 2.5,
        transition: 'box-shadow 0.2s, transform 0.2s',
        '&:hover': { boxShadow: (theme) => theme.customShadows.z16 },
        ...sx,
      }}
      {...props}
    >
      {children}
    </MuiCard>
  );
}
