import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#050512", // Pitch dark midnight blue
      paper: "rgba(10, 10, 30, 0.8)", // Holographic glass background base
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
    fontFamily: '"Fira Code", monospace',
    h5: {
      fontFamily: '"Orbitron", sans-serif',
      fontWeight: 900,
      letterSpacing: "2.5px",
    },
    h6: {
      fontFamily: '"Orbitron", sans-serif',
      fontWeight: 700,
      letterSpacing: "1.5px",
    },
    subtitle2: {
      fontFamily: '"Orbitron", sans-serif',
      fontWeight: 700,
      letterSpacing: "1px",
    },
    button: {
      fontFamily: '"Orbitron", sans-serif',
      fontWeight: 900,
      letterSpacing: "1.5px",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        body {
          background-color: #050512;
          background-image: 
            linear-gradient(rgba(0, 240, 255, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 240, 255, 0.02) 1px, transparent 1px);
          background-size: 30px 30px;
          background-attachment: fixed;
          position: relative;
          overflow-x: hidden;
          font-family: "Fira Code", monospace;
        }

        /* CRT Scanline Overlay using body::after */
        body::after {
          content: " ";
          display: block;
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          background: linear-gradient(
            rgba(18, 16, 16, 0) 50%, 
            rgba(0, 0, 0, 0.25) 50%
          );
          background-size: 100% 4px;
          z-index: 99999;
          pointer-events: none;
          opacity: 0.45;
        }

        /* Glitch Animation Keyframes */
        @keyframes glitch {
          0%, 100% {
            text-shadow: 
              0.04em 0 0 rgba(255, 0, 60, 0.75),
              -0.04em -0.02em 0 rgba(0, 240, 255, 0.75),
              -0.02em 0.04em 0 rgba(57, 255, 20, 0.75);
          }
          15% {
            text-shadow: 
              0.04em 0.02em 0 rgba(255, 0, 60, 0.75),
              0.02em -0.04em 0 rgba(0, 240, 255, 0.75),
              -0.04em 0.02em 0 rgba(57, 255, 20, 0.75);
          }
          45% {
            text-shadow: 
              -0.04em -0.02em 0 rgba(255, 0, 60, 0.75),
              0.04em 0.02em 0 rgba(0, 240, 255, 0.75),
              -0.02em -0.04em 0 rgba(57, 255, 20, 0.75);
          }
          65% {
            text-shadow: 
              0.02em 0.04em 0 rgba(255, 0, 60, 0.75),
              -0.04em 0.02em 0 rgba(0, 240, 255, 0.75),
              0.04em -0.02em 0 rgba(57, 255, 20, 0.75);
          }
          85% {
            text-shadow: 
              -0.02em -0.04em 0 rgba(255, 0, 60, 0.75),
              -0.02em -0.02em 0 rgba(0, 240, 255, 0.75),
              -0.04em 0.04em 0 rgba(57, 255, 20, 0.75);
          }
        }

        /* Pulse Glow Animation Keyframes */
        @keyframes pulseGlow {
          0%, 100% {
            box-shadow: 0 0 10px rgba(255, 0, 60, 0.5), inset 0 0 5px rgba(255, 0, 60, 0.25);
            border-color: rgba(255, 0, 60, 0.5);
          }
          50% {
            box-shadow: 0 0 25px rgba(255, 0, 60, 0.95), inset 0 0 12px rgba(255, 0, 60, 0.6);
            border-color: rgba(255, 0, 60, 0.95);
          }
        }

        /* Matrix Scroll Animation Keyframes */
        @keyframes matrixScroll {
          0% {
            background-position: 0% 0%;
          }
          100% {
            background-position: 0% 100%;
          }
        }

        @keyframes blink-matrix {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }

        .matrix-blink {
          animation: blink-matrix 1.5s infinite;
        }

        /* Custom scrollbars for cyber look */
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        ::-webkit-scrollbar-track {
          background: #050512;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(0, 240, 255, 0.3);
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 240, 255, 0.6);
        }
      `,
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "0px",
          fontWeight: 900,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          borderRadius: "0px",
        },
      },
    },
  },
});

export default theme;
