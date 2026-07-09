import { useState } from "react";
import { Box, Typography, Button, TextField, Paper, Alert } from "@mui/material";
import { Cpu, ShieldAlert } from "lucide-react";

interface AuthProps {
  onAuthSuccess: (token: string, username: string) => void;
}

export default function Auth({ onAuthSuccess }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Username and password are required");
      return;
    }

    setError("");
    setLoading(true);

    const endpoint = isLogin ? "/auth/login" : "/auth/register";
    try {
      const response = await fetch(`http://localhost:3001${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("username", data.username);
      onAuthSuccess(data.token, data.username);
    } catch (err: any) {
      setError(err.message || "Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        width: "100vw",
        backgroundColor: "#050512",
        position: "relative",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "400px",
          p: 4,
          backgroundColor: "rgba(5, 5, 20, 0.8)",
          backdropFilter: "blur(20px)",
          border: "2px solid #00f0ff",
          boxShadow: "0 0 25px rgba(0, 240, 255, 0.35), inset 0 0 15px rgba(0, 240, 255, 0.1)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Cpu size={28} color="#00f0ff" style={{ filter: "drop-shadow(0 0 5px #00f0ff)" }} />
          <Typography
            variant="h5"
            sx={{
              color: "primary.main",
              textShadow: "0 0 8px #00f0ff, 0 0 20px rgba(0, 240, 255, 0.6)",
              fontWeight: 900,
              letterSpacing: "3px",
              fontFamily: "'Orbitron', sans-serif",
            }}
          >
            NeonCode
          </Typography>
        </Box>

        <Typography
          variant="h6"
          sx={{
            color: "secondary.main",
            fontFamily: "'Orbitron', sans-serif",
            fontWeight: 700,
            letterSpacing: "1px",
            textTransform: "uppercase",
          }}
        >
          {isLogin ? "System Access" : "Create Node Identity"}
        </Typography>

        {error && (
          <Alert
            severity="error"
            icon={<ShieldAlert size={18} />}
            sx={{
              width: "100%",
              backgroundColor: "rgba(255, 0, 60, 0.1)",
              border: "1px solid #ff003c",
              color: "#ff003c",
              fontFamily: "monospace",
              fontSize: "0.75rem",
              borderRadius: 0,
            }}
          >
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 2.5 }}>
          <TextField
            fullWidth
            label="USERNAME"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
            slotProps={{
              inputLabel: {
                style: { color: "rgba(0, 240, 255, 0.7)", fontFamily: "'Orbitron', sans-serif", fontSize: "0.8rem", letterSpacing: "1px" },
              }
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "rgba(0, 240, 255, 0.02)",
                borderRadius: "0px",
                fontFamily: "'Fira Code', monospace",
                color: "#e2e8f0",
                "& fieldset": {
                  borderColor: "rgba(0, 240, 255, 0.3)",
                },
                "&:hover fieldset": {
                  borderColor: "rgba(0, 240, 255, 0.6)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "primary.main",
                  boxShadow: "0 0 10px rgba(0, 240, 255, 0.3)",
                },
              },
            }}
          />

          <TextField
            fullWidth
            label="PASSWORD"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            slotProps={{
              inputLabel: {
                style: { color: "rgba(0, 240, 255, 0.7)", fontFamily: "'Orbitron', sans-serif", fontSize: "0.8rem", letterSpacing: "1px" },
              }
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "rgba(0, 240, 255, 0.02)",
                borderRadius: "0px",
                fontFamily: "'Fira Code', monospace",
                color: "#e2e8f0",
                "& fieldset": {
                  borderColor: "rgba(0, 240, 255, 0.3)",
                },
                "&:hover fieldset": {
                  borderColor: "rgba(0, 240, 255, 0.6)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "primary.main",
                  boxShadow: "0 0 10px rgba(0, 240, 255, 0.3)",
                },
              },
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{
              backgroundColor: "#ff003c",
              color: "#ffffff",
              py: 1.2,
              fontFamily: "'Orbitron', sans-serif",
              fontSize: "0.85rem",
              fontWeight: 900,
              boxShadow: "0 0 15px rgba(255, 0, 60, 0.5)",
              animation: "pulseGlow 2.5s infinite",
              "&:hover": {
                backgroundColor: "#ff003c",
              },
            }}
          >
            {loading ? "INITIALIZING..." : isLogin ? "AUTHORIZE ACCESS" : "GENERATE IDENTITY"}
          </Button>
        </Box>

        <Button
          fullWidth
          variant="text"
          onClick={() => setIsLogin(!isLogin)}
          disabled={loading}
          sx={{
            color: "primary.main",
            fontFamily: "'Orbitron', sans-serif",
            fontSize: "0.75rem",
            fontWeight: 700,
            letterSpacing: "1px",
            "&:hover": {
              backgroundColor: "transparent",
              textShadow: "0 0 5px #00f0ff",
            },
          }}
        >
          {isLogin ? "SWITCH TO GENERATE IDENTITY" : "SWITCH TO AUTHORIZE ACCESS"}
        </Button>
      </Paper>
    </Box>
  );
}
