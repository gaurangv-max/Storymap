import TextField, { type TextFieldProps } from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';

// Search field matching the Figma "Minimal_Web" search component
// (node 5796:133417): outlined, 8px radius, border rgba(145,158,171,0.32),
// leading 24px search icon, 16px Public Sans text, grey placeholder.
export function SearchInput(props: TextFieldProps) {
  return (
    <TextField
      fullWidth
      placeholder="Search"
      {...props}
      slotProps={{
        ...props.slotProps,
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchRoundedIcon sx={{ fontSize: 24, color: 'text.disabled' }} />
            </InputAdornment>
          ),
          ...(props.slotProps?.input as object),
        },
      }}
      sx={[
        {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            pl: '14px',
            pr: '14px',
            // Idle border per Figma (Grey/500 @ 32%).
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(145, 158, 171, 0.32)',
            },
          },
          '& .MuiInputAdornment-root': { mr: 1 }, // 8px gap
          '& .MuiOutlinedInput-input': {
            px: 0,
            py: '8px',
            fontSize: 16,
            lineHeight: '24px',
            height: 24,
            '&::placeholder': { color: 'text.disabled', opacity: 1 },
          },
        },
        ...(Array.isArray(props.sx) ? props.sx : [props.sx]),
      ]}
    />
  );
}
