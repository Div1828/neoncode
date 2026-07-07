import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#0a0a1a", // Deep midnight blue
      paper: "#111122",   // Slightly lighter panel color
    },
    primary: {
      main: "#00f0ff",     // Neon Cyan
    },
    secondary: {
      main: "#ff003c",     // Neon Magenta
    },
    text: {
      primary: "#e2e8f0",
      secondary: "#94a3b8",
    },
  },
  typography: {
    fontFamily: '"Outfit", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 700,
      letterSpacing: "1px",
      textTransform: "uppercase",
    },
    h6: {
      fontWeight: 600,
      letterSpacing: "0.5px",
    },
    body1: {
      fontSize: "0.95rem",
    },
    body2: {
      fontSize: "0.85rem",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "uppercase",
          borderRadius: "4px",
          fontWeight: 700,
          letterSpacing: "1px",
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
  },
});

export default theme;
