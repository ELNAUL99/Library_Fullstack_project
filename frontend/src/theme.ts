import { createTheme } from "@mui/material/styles";

// Warm bookstore palette — inspired by the reference mockup.
// Cream background, near-black text, coral/peach primary.
const palette = {
  cream: "#faf5ef",
  paper: "#ffffff",
  ink: "#1a1a1a",
  inkMuted: "#6b6b6b",
  coral: "#e0805f",
  coralDark: "#c96945",
  coralLight: "#fbe7d9",
  brown: "#4a3a2e",
  divider: "#efe9df",
};

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: palette.coral, dark: palette.coralDark, contrastText: "#ffffff" },
    secondary: { main: palette.brown, contrastText: "#ffffff" },
    background: {
      default: palette.cream,
      paper: palette.paper,
    },
    text: {
      primary: palette.ink,
      secondary: palette.inkMuted,
    },
    divider: palette.divider,
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
    h2: { fontWeight: 800, letterSpacing: "-0.02em" },
    h3: { fontWeight: 800, letterSpacing: "-0.015em" },
    h4: { fontWeight: 800, letterSpacing: "-0.01em" },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: palette.paper,
          color: palette.ink,
          boxShadow: "none",
          borderBottom: `1px solid ${palette.divider}`,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          background: palette.paper,
          border: `1px solid ${palette.divider}`,
          boxShadow: "0 1px 2px rgba(26,26,26,0.04), 0 4px 12px rgba(26,26,26,0.04)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          paddingLeft: 18,
          paddingRight: 18,
        },
        containedPrimary: {
          boxShadow: "none",
          "&:hover": { boxShadow: "0 4px 10px rgba(224,128,95,0.35)" },
        },
        outlinedPrimary: {
          borderColor: palette.coral,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
        filledPrimary: {
          background: palette.coralLight,
          color: palette.coralDark,
        },
        outlinedPrimary: {
          borderColor: palette.coral,
          color: palette.coralDark,
        },
        outlinedSecondary: {
          borderColor: palette.brown,
          color: palette.brown,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          background: palette.paper,
        },
      },
    },
  },
});

export default theme;
