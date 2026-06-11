import TextField, { type TextFieldProps } from '@mui/material/TextField';

// Thin wrapper over MUI TextField that preserves the original call sites
// (label, placeholder, value, onChange, id, autoFocus, aria-invalid, …).
export function Input(props: TextFieldProps) {
  return <TextField fullWidth size="small" {...props} />;
}
