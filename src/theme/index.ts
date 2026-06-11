import { createTheme, alpha, type Shadows } from '@mui/material/styles';

// ─── Centralized MUI theme — extracted from the Figma "Minimal_Web" design
// system (file RJJDzj9SvaQG43EYkNMa0o). All values below are taken from the
// Figma variables/tokens, not guessed. ────────────────────────────────────

// Grey scale (Figma: Grey/100…900)
const GREY = {
  100: '#F9FAFB',
  200: '#F4F6F8',
  300: '#DFE3E8',
  400: '#C4CDD5',
  500: '#919EAB',
  600: '#637381',
  700: '#454F5B',
  800: '#212B36',
  900: '#161C24',
};

// Channel used by Minimal shadows + transparencies (Grey/500 = #919EAB)
const GREY_CH = '145, 158, 171';

// Primary is now blue (#3366FF). Shades follow the Minimal blue ramp.
const PRIMARY = {
  lighter: '#D6E4FF',
  light: '#84A9FF',
  main: '#3366FF',
  dark: '#1939B7',
  darker: '#091A7A',
  contrastText: '#FFFFFF',
};

// Secondary is now pink (#E55BAC). Shades derived as tints/shades of the main.
const SECONDARY = {
  lighter: '#FAE3F1',
  light: '#F2A4D3',
  main: '#E55BAC',
  dark: '#A8377C',
  darker: '#6B1A4F',
  contrastText: '#FFFFFF',
};

const INFO = {
  lighter: '#CAFDF5',
  light: '#61F3F3',
  main: '#00B8D9',
  dark: '#006C9C',
  darker: '#003768',
  contrastText: '#FFFFFF',
};

const SUCCESS = {
  lighter: '#D8FBDE',
  light: '#86E8AB',
  main: '#36B37E',
  dark: '#1B806A',
  darker: '#0A5554',
  contrastText: '#FFFFFF',
};

const WARNING = {
  lighter: '#FFF5CC',
  light: '#FFD666',
  main: '#FFAB00',
  dark: '#B76E00',
  darker: '#7A4100',
  contrastText: GREY[800],
};

const ERROR = {
  lighter: '#FFE9D5',
  light: '#FFAC82',
  main: '#FF5630',
  dark: '#B71D18',
  darker: '#7A0916',
  contrastText: '#FFFFFF',
};

// Minimal light-mode shadows (geometry from Figma Shadows/*, colored with the
// Grey/500 channel + the alphas read from the same effects).
export const customShadows = {
  z1: `0 1px 2px 0 rgba(${GREY_CH}, 0.16)`,
  z8: `0 8px 16px 0 rgba(${GREY_CH}, 0.16)`,
  z12: `0 12px 24px -4px rgba(${GREY_CH}, 0.16)`,
  z16: `0 16px 32px -4px rgba(${GREY_CH}, 0.16)`,
  z24: `0 24px 48px 0 rgba(${GREY_CH}, 0.16)`,
  card: `0 0 2px 0 rgba(${GREY_CH}, 0.2), 0 12px 24px -4px rgba(${GREY_CH}, 0.12)`,
  dialog: `-40px 40px 80px -8px rgba(${GREY_CH}, 0.24)`,
  dropdown: `0 0 2px 0 rgba(${GREY_CH}, 0.24), -20px 20px 40px -4px rgba(${GREY_CH}, 0.24)`,
  primary: `0 8px 16px 0 ${alpha(PRIMARY.main, 0.24)}`,
  secondary: `0 8px 16px 0 ${alpha(SECONDARY.main, 0.24)}`,
  error: `0 8px 16px 0 ${alpha(ERROR.main, 0.24)}`,
};

// Build the 25-level MUI shadows array from the Figma z-elevations.
function buildShadows(): string[] {
  const c = (a: number) => `rgba(${GREY_CH}, ${a})`;
  const levels = [
    'none',
    `0 1px 2px 0 ${c(0.16)}`,
    `0 1px 2px 0 ${c(0.16)}`,
    `0 1px 2px 0 ${c(0.16)}`,
    `0 4px 8px 0 ${c(0.16)}`,
    `0 4px 8px 0 ${c(0.16)}`,
    `0 4px 8px 0 ${c(0.16)}`,
    `0 4px 8px 0 ${c(0.16)}`,
    `0 8px 16px 0 ${c(0.16)}`,
    `0 8px 16px 0 ${c(0.16)}`,
    `0 8px 16px 0 ${c(0.16)}`,
    `0 8px 16px 0 ${c(0.16)}`,
    `0 12px 24px -4px ${c(0.16)}`,
    `0 12px 24px -4px ${c(0.16)}`,
    `0 12px 24px -4px ${c(0.16)}`,
    `0 12px 24px -4px ${c(0.16)}`,
    `0 16px 32px -4px ${c(0.16)}`,
    `0 16px 32px -4px ${c(0.16)}`,
    `0 16px 32px -4px ${c(0.16)}`,
    `0 16px 32px -4px ${c(0.16)}`,
    `0 20px 40px -4px ${c(0.16)}`,
    `0 20px 40px -4px ${c(0.16)}`,
    `0 20px 40px -4px ${c(0.16)}`,
    `0 20px 40px -4px ${c(0.16)}`,
    `0 24px 48px 0 ${c(0.16)}`,
  ];
  return levels;
}

const pxToRem = (px: number) => `${px / 16}rem`;

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: PRIMARY,
    secondary: SECONDARY,
    info: INFO,
    success: SUCCESS,
    warning: WARNING,
    error: ERROR,
    grey: GREY,
    common: { black: '#000000', white: '#FFFFFF' },
    divider: alpha(GREY[500], 0.2),
    text: {
      primary: GREY[800],
      secondary: GREY[600],
      disabled: GREY[500],
    },
    background: {
      paper: '#FFFFFF',
      default: '#FFFFFF',
    },
    action: {
      active: GREY[600],
      hover: alpha(GREY[500], 0.08),
      selected: alpha(GREY[500], 0.16),
      disabled: alpha(GREY[500], 0.8),
      disabledBackground: alpha(GREY[500], 0.24),
      focus: alpha(GREY[500], 0.24),
      hoverOpacity: 0.08,
      disabledOpacity: 0.48,
    },
  },

  shape: { borderRadius: 8 },

  customShadows,
  shadows: buildShadows() as unknown as Shadows,

  typography: {
    fontFamily: "'Public Sans', system-ui, -apple-system, 'Segoe UI', sans-serif",
    fontWeightRegular: 400,
    fontWeightMedium: 600,
    fontWeightBold: 700,
    h1: { fontWeight: 800, lineHeight: 80 / 64, fontSize: pxToRem(40), letterSpacing: 0 },
    h2: { fontWeight: 800, lineHeight: 64 / 48, fontSize: pxToRem(32) },
    h3: { fontWeight: 700, lineHeight: 1.5, fontSize: pxToRem(24) },
    h4: { fontWeight: 700, lineHeight: 1.5, fontSize: pxToRem(20) },
    h5: { fontWeight: 700, lineHeight: 1.5, fontSize: pxToRem(18) },
    h6: { fontWeight: 700, lineHeight: 28 / 18, fontSize: pxToRem(17) },
    subtitle1: { fontWeight: 600, lineHeight: 1.5, fontSize: pxToRem(16) },
    subtitle2: { fontWeight: 600, lineHeight: 22 / 14, fontSize: pxToRem(14) },
    body1: { fontWeight: 400, lineHeight: 1.5, fontSize: pxToRem(16) },
    body2: { fontWeight: 400, lineHeight: 22 / 14, fontSize: pxToRem(14) },
    caption: { fontWeight: 400, lineHeight: 1.5, fontSize: pxToRem(12) },
    overline: {
      fontWeight: 700,
      lineHeight: 1.5,
      fontSize: pxToRem(12),
      textTransform: 'uppercase',
    },
    button: { fontWeight: 700, lineHeight: 24 / 14, fontSize: pxToRem(14), textTransform: 'none' },
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: GREY[100] },
        '*::-webkit-scrollbar': { width: 10, height: 10 },
        '*::-webkit-scrollbar-thumb': {
          background: GREY[400],
          borderRadius: 8,
          border: '2px solid transparent',
          backgroundClip: 'content-box',
        },
        '*::-webkit-scrollbar-thumb:hover': {
          background: GREY[500],
          backgroundClip: 'content-box',
        },
      },
    },

    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 8 },
        sizeLarge: { minHeight: 48 },
        sizeMedium: { minHeight: 36 },
        sizeSmall: { minHeight: 30 },
      },
      variants: [
        {
          props: { variant: 'contained', color: 'primary' },
          style: { '&:hover': { boxShadow: customShadows.primary } },
        },
        {
          props: { variant: 'contained', color: 'secondary' },
          style: { '&:hover': { boxShadow: customShadows.secondary } },
        },
        {
          props: { variant: 'contained', color: 'error' },
          style: { '&:hover': { boxShadow: customShadows.error } },
        },
      ],
    },

    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: { backgroundImage: 'none' },
        rounded: { borderRadius: 16 },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          position: 'relative',
          borderRadius: 16,
          zIndex: 0,
          boxShadow: customShadows.card,
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: alpha(GREY[500], 0.2),
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: GREY[800],
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: GREY[800],
          },
          '&.Mui-error .MuiOutlinedInput-notchedOutline': {
            borderColor: ERROR.main,
          },
          '&.Mui-disabled .MuiOutlinedInput-notchedOutline': {
            borderColor: alpha(GREY[500], 0.2),
          },
        },
      },
    },

    MuiInputLabel: {
      styleOverrides: {
        root: { '&.Mui-focused': { color: GREY[800] } },
      },
    },

    MuiChip: {
      styleOverrides: { root: { borderRadius: 8, fontWeight: 600 } },
    },

    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: 10,
          boxShadow: customShadows.dropdown,
        },
      },
    },

    MuiPopover: {
      styleOverrides: {
        paper: {
          borderRadius: 10,
          boxShadow: customShadows.dropdown,
        },
      },
    },

    MuiMenuItem: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          marginInline: 6,
          '&.Mui-selected': {
            backgroundColor: alpha(PRIMARY.main, 0.08),
            '&:hover': { backgroundColor: alpha(PRIMARY.main, 0.16) },
          },
        },
      },
    },

    MuiDialog: {
      styleOverrides: {
        paper: { borderRadius: 16, boxShadow: customShadows.dialog },
      },
    },

    MuiDrawer: {
      styleOverrides: {
        paper: { backgroundImage: 'none' },
      },
    },

    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '&.Mui-selected': {
            backgroundColor: alpha(PRIMARY.main, 0.08),
            color: PRIMARY.main,
            '&:hover': { backgroundColor: alpha(PRIMARY.main, 0.16) },
          },
        },
      },
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: { backgroundColor: GREY[800], borderRadius: 8, fontSize: 12 },
        arrow: { color: GREY[800] },
      },
    },
  },
});

// ─── Type augmentation for the custom shadows key ───────────────
declare module '@mui/material/styles' {
  interface Theme {
    customShadows: typeof customShadows;
  }
  interface ThemeOptions {
    customShadows?: typeof customShadows;
  }
}
