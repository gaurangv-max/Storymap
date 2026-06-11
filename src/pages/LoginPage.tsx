import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { Logo } from '../components/shared/Logo';
import { signIn } from '../lib/auth';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';

// Standalone sign-in page recreating the Minimals (Amplify) sign-in form.
// Client-side only — submitting navigates to the dashboard. No backend/auth.
export function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    signIn();
    navigate('/');
  };

  // Light, glass-readable styling for the inputs (white text + light borders).
  const fieldSx = {
    '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
    '& .MuiInputLabel-root.Mui-focused': { color: '#fff' },
    '& .MuiOutlinedInput-root': {
      color: '#fff',
      '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.6)' },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#fff' },
    },
    '& .MuiOutlinedInput-input::placeholder': { color: 'rgba(255, 255, 255, 0.5)', opacity: 1 },
    '& .MuiInputAdornment-root .MuiIconButton-root': { color: 'rgba(255, 255, 255, 0.7)' },
  };

  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#011022',
        p: 2,
      }}
    >
      {/* Background video */}
      <Box
        component="video"
        src="/waves.mp4"
        autoPlay
        loop
        muted
        playsInline
        sx={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
          // Keep the video on its own GPU layer so it never throttles when idle.
          transform: 'translateZ(0)',
          willChange: 'transform',
          pointerEvents: 'none',
        }}
      />

      <Card
        sx={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: 448,
          p: { xs: 3, sm: 5 },
          // Liquid glass — clearer, less frosted, bright rim + specular highlight
          bgcolor: 'rgba(255, 255, 255, 0.25)',
          backdropFilter: 'blur(10px) saturate(180%) brightness(1.08)',
          WebkitBackdropFilter: 'blur(10px) saturate(180%) brightness(1.08)',
          border: '1px solid rgba(255, 255, 255, 0.45)',
          boxShadow:
            'inset 0 1px 1px rgba(255, 255, 255, 0.7), inset 0 -1px 1px rgba(255, 255, 255, 0.15), 0 12px 40px rgba(0, 0, 0, 0.45)',
          transform: 'translateZ(0)',
          // Continuously nudge the blur by an imperceptible amount so the
          // browser never idles (and freezes) the backdrop over the video.
          animation: 'glassKeepAlive 4s ease-in-out infinite alternate',
          '@keyframes glassKeepAlive': {
            from: {
              backdropFilter: 'blur(10px) saturate(180%) brightness(1.08)',
              WebkitBackdropFilter: 'blur(10px) saturate(180%) brightness(1.08)',
            },
            to: {
              backdropFilter: 'blur(10.5px) saturate(180%) brightness(1.08)',
              WebkitBackdropFilter: 'blur(10.5px) saturate(180%) brightness(1.08)',
            },
          },
        }}
      >
        {/* Logo */}
        <Box sx={{ mb: 5 }}>
          <Logo variant="white" height={30} />
        </Box>

        {/* Heading */}
        <Stack spacing={0.5} sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#fff' }}>
            Sign in to your account
          </Typography>
          <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.72)' }}>
              Don't have an account?
            </Typography>
            <Link
              component="button"
              type="button"
              variant="subtitle2"
              underline="hover"
              sx={{ color: '#FFB6C1', '&:hover': { color: '#FF9DB2' } }}
            >
              Get started
            </Link>
          </Stack>
        </Stack>

        {/* Form */}
        <Stack component="form" spacing={3} onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email address"
            type="email"
            autoComplete="email"
            sx={fieldSx}
          />

          <Stack spacing={1.5}>
            <TextField
              fullWidth
              label="Password"
              placeholder="6+ characters"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              sx={fieldSx}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((v) => !v)}
                        edge="end"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? (
                          <VisibilityOffOutlinedIcon />
                        ) : (
                          <VisibilityOutlinedIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
            <Link
              component="button"
              type="button"
              variant="body2"
              underline="none"
              sx={{ alignSelf: 'flex-end', color: 'rgba(255, 255, 255, 0.72)' }}
            >
              Forgot password?
            </Link>
          </Stack>

          <Button
            type="submit"
            fullWidth
            size="large"
            variant="contained"
            sx={{
              minHeight: 48,
              bgcolor: '#fff',
              color: 'text.primary',
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.86)' },
            }}
          >
            Sign in
          </Button>
        </Stack>
      </Card>
    </Box>
  );
}
