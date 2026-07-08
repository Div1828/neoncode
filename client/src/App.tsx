import { useState, useEffect, useRef } from "react";
import { Box, Typography, Button, TextField, List, ListItem, ListItemText, Avatar, IconButton } from "@mui/material";
import Editor from "@monaco-editor/react";
import { Play, Send, Terminal as TerminalIcon, MessageSquare, Cpu, ShieldAlert, LogOut } from "lucide-react";
import { io } from "socket.io-client";
import Auth from "./Auth";

// Establish socket connection to backend
const socket = io("http://localhost:3001");

// Boilerplate C++ code
const DEFAULT_CPP_CODE = `#include <iostream>

int main() {
    std::cout << "⚡ NEONCODE ENGINE v1.0 ⚡" << std::endl;
    std::cout << "System ready. Write your C++ code here." << std::endl;
    return 0;
}
`;

interface ChatMessage {
  id: number;
  user: string;
  avatar: string;
  text: string;
  time: string;
}

export default function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [username, setUsername] = useState<string | null>(localStorage.getItem("username"));
  const [code, setCode] = useState<string | undefined>(DEFAULT_CPP_CODE);
  const [output, setOutput] = useState<string>(
    "[SYSTEM-CORE] Initializing compiler modules...\n[DATALINK] Connecting to cloud Postgres...\n[STATUS] Terminal active. Press RUN CODE to compile.\n"
  );
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [roomId, setRoomId] = useState("");

  const isRemoteChange = useRef(false);

  // Initialize Room ID from query parameter or generate new one
  useEffect(() => {
    if (!token) return;
    const params = new URLSearchParams(window.location.search);
    let room = params.get("room");
    if (!room) {
      room = Math.random().toString(36).substring(2, 8);
      window.history.replaceState(null, "", `?room=${room}`);
    }
    setRoomId(room);
  }, [token]);

  // Join room and listen for remote code updates
  useEffect(() => {
    if (!token || !roomId) return;
    socket.emit("join_room", roomId);

    socket.on("receive_code", (newCode: string) => {
      isRemoteChange.current = true;
      setCode(newCode);
    });

    return () => {
      socket.off("receive_code");
    };
  }, [roomId, token]);

  const handleCodeChange = (value: string | undefined) => {
    setCode(value);
    
    // Crucial Anti-Loop Logic
    if (isRemoteChange.current) {
      isRemoteChange.current = false;
      return;
    }
    
    if (value !== undefined && roomId) {
      socket.emit("code_change", { roomId, code: value });
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !username) return;
    const msg: ChatMessage = {
      id: Date.now(),
      user: username,
      avatar: username.charAt(0).toUpperCase(),
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setChatMessages([...chatMessages, msg]);
    setNewMessage("");
  };

  const handleRunCode = async () => {
    if (!code) return;
    setOutput((prev) => prev + `\n$ g++ main.cpp -o main && ./main\n[COMPILING & EXECUTING...]\n`);
    try {
      const response = await fetch("http://localhost:3001/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });
      const data = await response.json();
      if (data.stderr) {
        setOutput((prev) => prev + `\n[STDERR]\n${data.stderr}\n`);
      } else {
        setOutput((prev) => prev + `${data.stdout || ""}\n[PROCESS COMPLETED WITH EXIT CODE 0]\n`);
      }
    } catch (err: any) {
      setOutput((prev) => prev + `\n[SYSTEM ERROR] Failed to contact compile agent: ${err.message}\n`);
    }
  };

  const handleAuthSuccess = (newToken: string, newUsername: string) => {
    setToken(newToken);
    setUsername(newUsername);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setToken(null);
    setUsername(null);
  };

  // Guard routing / show login
  if (!token) {
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        backgroundColor: "#050512",
        color: "#e2e8f0",
        position: "relative",
      }}
    >
      {/* Top Header Panel */}
      <Box
        component="header"
        sx={{
          height: "65px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 3,
          backgroundColor: "rgba(7, 7, 24, 0.8)",
          backdropFilter: "blur(12px)",
          borderBottom: "2px solid #00f0ff",
          boxShadow: "0 0 20px rgba(0, 240, 255, 0.35)",
          zIndex: 10,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Cpu size={24} color="#00f0ff" style={{ filter: "drop-shadow(0 0 5px #00f0ff)" }} />
          <Typography
            variant="h5"
            sx={{
              color: "primary.main",
              animation: "glitch 2s infinite steps(2)",
              letterSpacing: "4px",
              fontWeight: 900,
            }}
          >
            NeonCode
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          {/* Matrix connection status indicator */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: "#39ff14",
                boxShadow: "0 0 10px #39ff14, 0 0 18px #39ff14",
                animation: "blink-matrix 1.2s infinite",
              }}
            />
            <Typography
              variant="caption"
              sx={{
                fontFamily: "'Fira Code', monospace",
                color: "#39ff14",
                fontWeight: 700,
                letterSpacing: "1.5px",
                textShadow: "0 0 5px rgba(57, 255, 20, 0.6)",
              }}
            >
              LIVE HACK LINK
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              backgroundColor: "rgba(0, 240, 255, 0.05)",
              border: "1px solid rgba(0, 240, 255, 0.4)",
              boxShadow: "0 0 10px rgba(0, 240, 255, 0.2)",
              px: 2,
              py: 0.5,
            }}
          >
            <Typography variant="body2" sx={{ fontFamily: "'Fira Code', monospace", color: "primary.main", fontWeight: 700 }}>
              PORTAL: {roomId}
            </Typography>
          </Box>

          {/* User logout */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="body2" sx={{ fontFamily: "'Fira Code', monospace", color: "text.primary", fontSize: "0.85rem", fontWeight: 600 }}>
              {username}
            </Typography>
            <IconButton
              color="secondary"
              onClick={handleLogout}
              sx={{
                borderRadius: "0px",
                border: "1px solid rgba(255, 0, 60, 0.3)",
                p: 0.75,
                backgroundColor: "rgba(255, 0, 60, 0.02)",
                "&:hover": {
                  backgroundColor: "rgba(255, 0, 60, 0.15)",
                  boxShadow: "0 0 8px rgba(255, 0, 60, 0.4)",
                },
              }}
            >
              <LogOut size={16} />
            </IconButton>
          </Box>
        </Box>
      </Box>

      {/* Main Workspace Layout */}
      <Box
        sx={{
          display: "flex",
          flex: 1,
          height: "calc(100vh - 65px)",
          width: "100%",
          overflow: "hidden",
          p: 1.5,
          gap: 1.5,
          zIndex: 2,
        }}
      >
        {/* Left Pane - Editor (70% width) - Holographic Glass Layout */}
        <Box
          sx={{
            width: "70%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "rgba(5, 5, 20, 0.8)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(0, 240, 255, 0.3)",
            boxShadow: "inset 0 0 20px rgba(0, 240, 255, 0.08), 0 0 15px rgba(0, 240, 255, 0.1)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 2,
              py: 1.2,
              backgroundColor: "rgba(14, 14, 40, 0.7)",
              borderBottom: "1px solid rgba(0, 240, 255, 0.2)",
            }}
          >
            <Typography variant="body2" sx={{ fontFamily: "'Fira Code', monospace", color: "primary.main", fontWeight: 700 }}>
              main.cpp
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "0.75rem", fontFamily: "'Fira Code', monospace" }}>
              C++ • MATRIX-FEED
            </Typography>
          </Box>
          <Box sx={{ flex: 1, width: "100%", height: "100%", p: 0.5 }}>
            <Editor
              height="100%"
              theme="vs-dark"
              defaultLanguage="cpp"
              value={code}
              onChange={handleCodeChange}
              options={{
                fontSize: 14,
                fontFamily: "'Fira Code', monospace",
                minimap: { enabled: false },
                scrollbar: {
                  vertical: "visible",
                  horizontal: "visible",
                },
                padding: { top: 10 },
                lineNumbersMinChars: 3,
                renderLineHighlight: "all",
              }}
            />
          </Box>
        </Box>

        {/* Right Pane - Sidebar (30% width) */}
        <Box
          sx={{
            width: "30%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
          }}
        >
          {/* Chat Section - Holographic Glass Layout */}
          <Box
            sx={{
              flex: 1.2,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              backgroundColor: "rgba(5, 5, 20, 0.8)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(0, 240, 255, 0.3)",
              boxShadow: "0 0 15px rgba(0, 240, 255, 0.05)",
            }}
          >
            <Box
              sx={{
                p: 2,
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                borderBottom: "1px solid rgba(0, 240, 255, 0.2)",
                backgroundColor: "rgba(0, 240, 255, 0.03)",
              }}
            >
              <MessageSquare size={18} color="#00f0ff" style={{ filter: "drop-shadow(0 0 3px #00f0ff)" }} />
              <Typography
                variant="subtitle2"
                sx={{
                  color: "primary.main",
                  textTransform: "uppercase",
                  fontWeight: 700,
                }}
              >
                Secure Comms Feed
              </Typography>
            </Box>

            {/* Message Area */}
            <Box
              sx={{
                flex: 1,
                overflowY: "auto",
                p: 2,
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
              }}
            >
              {chatMessages.length === 0 ? (
                <Box sx={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "center", opacity: 0.4 }}>
                  <Typography variant="body2" sx={{ fontFamily: "'Fira Code', monospace" }}>
                    [NO TRANSMISSIONS DETECTED]
                  </Typography>
                </Box>
              ) : (
                <List disablePadding>
                  {chatMessages.map((msg) => (
                    <ListItem
                      key={msg.id}
                      alignItems="flex-start"
                      disablePadding
                      sx={{ mb: 2 }}
                    >
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          mr: 1.5,
                          backgroundColor: msg.user === username ? "secondary.main" : "primary.main",
                          color: "#050512",
                          fontWeight: 800,
                          fontSize: "0.85rem",
                          boxShadow: `0 0 8px ${msg.user === username ? "#ff003c" : "#00f0ff"}`
                        }}
                      >
                        {msg.avatar}
                      </Avatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: msg.user === username ? "secondary.main" : "primary.main" }}>
                              {msg.user}
                            </Typography>
                            <Typography variant="caption" sx={{ color: "text.secondary", fontFamily: "monospace" }}>
                              {msg.time}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Typography
                            variant="body2"
                            sx={{ color: "#cbd5e1", mt: 0.5, wordBreak: "break-word", fontFamily: "'Fira Code', monospace", fontSize: "0.8rem" }}
                          >
                            {msg.text}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>

            {/* Chat Input */}
            <Box
              sx={{
                p: 1.5,
                borderTop: "1px solid rgba(0, 240, 255, 0.2)",
                display: "flex",
                gap: 1,
                backgroundColor: "rgba(6, 6, 20, 0.9)",
              }}
            >
              <TextField
                size="small"
                fullWidth
                placeholder="Secure uplink broadcast..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "rgba(0, 240, 255, 0.02)",
                    borderRadius: "0px",
                    fontFamily: "'Fira Code', monospace",
                    fontSize: "0.85rem",
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
              <IconButton
                color="primary"
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                sx={{
                  borderRadius: "0px",
                  border: "1px solid #00f0ff",
                  backgroundColor: "rgba(0, 240, 255, 0.05)",
                  "&:hover": {
                    backgroundColor: "rgba(0, 240, 255, 0.2)",
                    boxShadow: "0 0 10px rgba(0, 240, 255, 0.5)",
                  },
                }}
              >
                <Send size={18} />
              </IconButton>
            </Box>
          </Box>

          {/* Terminal / Run Section - Holographic Glass Layout with custom border styling */}
          <Box
            sx={{
              flex: 0.8,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              backgroundColor: "rgba(5, 5, 20, 0.8)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(0, 240, 255, 0.3)",
              borderLeft: "3px solid #ff003c",
              borderBottom: "3px solid #39ff14",
              boxShadow: "0 0 15px rgba(255, 0, 60, 0.15), 0 0 15px rgba(57, 255, 20, 0.1)",
            }}
          >
            {/* Terminal Header & Action Button */}
            <Box
              sx={{
                p: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "rgba(10, 7, 21, 0.7)",
                borderBottom: "1px solid rgba(255, 0, 60, 0.2)",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <TerminalIcon size={18} color="#ff003c" style={{ filter: "drop-shadow(0 0 3px #ff003c)" }} />
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: "secondary.main",
                    textShadow: "0 0 5px rgba(255, 0, 60, 0.4)",
                  }}
                >
                  SYSTEM CORE CONSOLE
                </Typography>
              </Box>

              <Button
                variant="contained"
                onClick={handleRunCode}
                startIcon={<Play size={14} />}
                sx={{
                  backgroundColor: "#ff003c",
                  color: "#ffffff",
                  px: 2.5,
                  py: 0.5,
                  fontSize: "0.75rem",
                  boxShadow: "0 0 12px rgba(255, 0, 60, 0.5)",
                  animation: "pulseGlow 2s infinite", // Permanent pulseGlow animation
                  "&:hover": {
                    backgroundColor: "#ff003c",
                  },
                }}
              >
                Run Code
              </Button>
            </Box>

            {/* Monospace Output */}
            <Box
              sx={{
                flex: 1,
                backgroundColor: "rgba(3, 3, 9, 0.9)",
                p: 2,
                overflowY: "auto",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Typography
                component="pre"
                sx={{
                  margin: 0,
                  fontFamily: "'Fira Code', monospace",
                  fontSize: "0.8rem",
                  color: "#39ff14",
                  textShadow: "0 0 5px #39ff14, 0 0 15px rgba(57, 255, 20, 0.6)", // High-brightness phosphor monitor glow
                  whiteSpace: "pre-wrap",
                  lineHeight: 1.6,
                }}
              >
                {output}
              </Typography>

              {/* Critical warning hint */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mt: 2,
                  pt: 1,
                  borderTop: "1px dashed rgba(255, 0, 60, 0.3)",
                }}
              >
                <ShieldAlert size={14} color="#ff003c" />
                <Typography
                  variant="caption"
                  sx={{
                    fontFamily: "'Fira Code', monospace",
                    color: "secondary.main",
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                  }}
                >
                  [CRITICAL] EXECUTE RUN CODE TO PERMANENTLY COMMIT STATE TO CLOUD POSTGRES
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
