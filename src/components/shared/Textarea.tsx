import TextField, { type TextFieldProps } from '@mui/material/TextField';

// Multiline TextField wrapper. Keeps the original `rows` prop (mapped to
// minRows so the field can still grow).
export function Textarea({ rows = 3, ...props }: TextFieldProps & { rows?: number }) {
  return <TextField fullWidth multiline minRows={rows} {...props} />;
}
