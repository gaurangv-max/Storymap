import MuiButton, { type ButtonProps as MuiButtonProps } from '@mui/material/Button';

type Variant = 'primary' | 'ghost' | 'danger';

// Keep the original public API (variant: primary | ghost | danger) but render
// a themed MUI Button underneath.
export interface ButtonProps extends Omit<MuiButtonProps, 'variant' | 'color'> {
  variant?: Variant;
}

export function Button({ variant = 'primary', sx, ...props }: ButtonProps) {
  if (variant === 'ghost') {
    return (
      <MuiButton
        variant="text"
        color="inherit"
        sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' }, ...sx }}
        {...props}
      />
    );
  }

  return (
    <MuiButton
      variant="contained"
      color={variant === 'danger' ? 'error' : 'primary'}
      sx={sx}
      {...props}
    />
  );
}
