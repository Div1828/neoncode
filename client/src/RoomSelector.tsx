import { useState, useEffect } from "react";
import { Box, Typography, Button, TextField, Paper, Divider } from "@mui/material";
import { ShieldAlert, Zap, LogIn } from "lucide-react";

interface RoomSelectorProps {
  username: string;
  onJoin: (roomId: string) => void;
}

export default function RoomSelector({ username, onJoin }: RoomSelectorProps) {
  const [roomInput, setRoomInput] = useState("");
  const [pastRooms, setPastRooms] = useState<Array<{ roomId: string; createdAt: string }>>([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/user-rooms/${username}`);
        if (response.ok) {
          const data = await response.json();
          setPastRooms(data.rooms || []);
        }
      } catch (err) {
        console.error("Failed to fetch user rooms:", err);
      }
    };
    fetchRooms();
  }, [username]);

  const handleJoin = () => {
    if (roomInput.trim()) {
      onJoin(roomInput.trim());
    }
  };

  const handleGenerate = () => {
    const newRoom = Math.random().toString(36).substring(2, 8);
    onJoin(newRoom);
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
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Paper
        elevation={24}
        sx={{
          p: 4,
          width: 450,
          display: "flex",
          flexDirection: "column",
          gap: 3,
          backgroundColor: "rgba(5, 5, 20, 0.85)",
          backdropFilter: "blur(20px)",
          border: "2px solid #00f0ff",
          boxShadow: "0 0 25px rgba(0, 240, 255, 0.3)",
          borderRadius: 0, // Cyberpunk sharp edges
          position: "relative",
        }}
      >
        {/* Corner Decals */}
        <Box sx={{ position: "absolute", top: 0, left: 0, width: 20, height: 20, borderTop: "3px solid #ff003c", borderLeft: "3px solid #ff003c" }} />
        <Box sx={{ position: "absolute", bottom: 0, right: 0, width: 20, height: 20, borderBottom: "3px solid #ff003c", borderRight: "3px solid #ff003c" }} />

        <Box sx={{ textAlign: "center", mb: 1 }}>
          <ShieldAlert size={40} color="#ff003c" style={{ filter: "drop-shadow(0 0 8px #ff003c)", marginBottom: "8px" }} />
          <Typography
            variant="subtitle1"
            sx={{
              color: "secondary.main",
              fontFamily: "'Fira Code', monospace",
              fontWeight: 800,
              letterSpacing: "1px",
              textShadow: "0 0 5px rgba(255, 0, 60, 0.5)",
            }}
          >
            [SYSTEM_LOGIN: SUCCESS]
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: "primary.main",
              fontFamily: "'Orbitron', sans-serif",
              fontWeight: 900,
              mt: 1,
              letterSpacing: "2px",
            }}
          >
            WELCOME, {username.toUpperCase()}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          <TextField
            fullWidth
            placeholder="ENTER SECTOR ID..."
            variant="outlined"
            value={roomInput}
            onChange={(e) => setRoomInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleJoin()}
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "rgba(0, 240, 255, 0.05)",
                fontFamily: "'Fira Code', monospace",
                color: "#00f0ff",
                borderRadius: 0,
                "& fieldset": {
                  borderColor: "rgba(0, 240, 255, 0.4)",
                  borderWidth: "1px",
                },
                "&:hover fieldset": {
                  borderColor: "rgba(0, 240, 255, 0.8)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#00f0ff",
                  boxShadow: "inset 0 0 10px rgba(0, 240, 255, 0.2)",
                },
              },
              "& .MuiInputBase-input::placeholder": {
                color: "rgba(0, 240, 255, 0.4)",
                opacity: 1,
              },
            }}
          />
          <Button
            variant="contained"
            fullWidth
            onClick={handleJoin}
            disabled={!roomInput.trim()}
            startIcon={<LogIn size={18} />}
            sx={{
              backgroundColor: "primary.main",
              color: "#050512",
              fontFamily: "'Orbitron', sans-serif",
              fontWeight: 800,
              borderRadius: 0,
              py: 1.2,
              letterSpacing: "1px",
              "&:hover": {
                backgroundColor: "#00c0cc",
                boxShadow: "0 0 15px rgba(0, 240, 255, 0.6)",
              },
              "&:disabled": {
                backgroundColor: "rgba(0, 240, 255, 0.2)",
                color: "rgba(0, 240, 255, 0.4)",
              },
            }}
          >
            JOIN SECURE PORTAL
          </Button>
        </Box>

        {pastRooms.length > 0 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography
              variant="caption"
              sx={{
                fontFamily: "'Fira Code', monospace",
                color: "secondary.main",
                fontWeight: 700,
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}
            >
              [SECURE DECRYPTED PAST PORTALS]
            </Typography>
            <Box
              sx={{
                maxHeight: "130px",
                overflowY: "auto",
                border: "1px dashed rgba(0, 240, 255, 0.2)",
                p: 1,
                display: "flex",
                flexDirection: "column",
                gap: 1,
              }}
            >
              {pastRooms.map((room) => (
                <Box
                  key={room.roomId}
                  onClick={() => onJoin(room.roomId)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    px: 1.5,
                    py: 1,
                    backgroundColor: "rgba(0, 240, 255, 0.02)",
                    border: "1px solid rgba(0, 240, 255, 0.2)",
                    cursor: "pointer",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      backgroundColor: "rgba(0, 240, 255, 0.1)",
                      borderColor: "primary.main",
                      boxShadow: "0 0 8px rgba(0, 240, 255, 0.3)",
                    },
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: "'Fira Code', monospace",
                      color: "#00f0ff",
                      fontWeight: 700,
                    }}
                  >
                    PORTAL: {room.roomId}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "text.secondary",
                      fontSize: "0.7rem",
                    }}
                  >
                    {new Date(room.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        <Box sx={{ display: "flex", alignItems: "center", gap: 2, my: 0.5 }}>
          <Divider sx={{ flex: 1, borderColor: "rgba(0, 240, 255, 0.2)" }} />
          <Typography sx={{ color: "rgba(0, 240, 255, 0.5)", fontFamily: "'Fira Code', monospace", fontSize: "0.8rem" }}>
            OR
          </Typography>
          <Divider sx={{ flex: 1, borderColor: "rgba(0, 240, 255, 0.2)" }} />
        </Box>

        <Button
          variant="outlined"
          fullWidth
          onClick={handleGenerate}
          startIcon={<Zap size={18} />}
          sx={{
            borderColor: "secondary.main",
            color: "secondary.main",
            fontFamily: "'Orbitron', sans-serif",
            fontWeight: 800,
            borderRadius: 0,
            py: 1.2,
            letterSpacing: "1px",
            borderWidth: "2px",
            "&:hover": {
              borderColor: "#ff003c",
              backgroundColor: "rgba(255, 0, 60, 0.1)",
              boxShadow: "0 0 15px rgba(255, 0, 60, 0.4)",
              borderWidth: "2px",
            },
          }}
        >
          GENERATE NEW SECTOR
        </Button>
      </Paper>
    </Box>
  );
}
