import { useState } from "react";
import { Box, Typography, Button, TextField, List, ListItem, ListItemText, Avatar, IconButton } from "@mui/material";
import Editor from "@monaco-editor/react";
import { Play, Send, Terminal as TerminalIcon, MessageSquare, Code, Cpu } from "lucide-react";

// Boilerplate C++ code
const DEFAULT_CPP_CODE = `#include <iostream>

int main() {
    std::cout << "⚡ NEONCODE ENGINE v1.0 ⚡" << std::endl;
    std::cout << "Compile & Execute Success!" << std::endl;
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
  const [code, setCode] = useState<string | undefined>(DEFAULT_CPP_CODE);
  const [output, setOutput] = useState<string>(
    "[NEON-OS v1.0.4] Initializing compiler...\n[STATUS] Compiler ready. Click 'RUN CODE' to execute your program.\n"
  );
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: 1, user: "Kaelen", avatar: "K", text: "Yo, did you finish the search algorithm?", time: "18:42" },
    { id: 2, user: "Vesper", avatar: "V", text: "Almost, just debugging the memory allocation.", time: "18:43" },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    const msg: ChatMessage = {
      id: Date.now(),
      user: "You",
      avatar: "U",
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setChatMessages([...chatMessages, msg]);
    setNewMessage("");
  };

  const handleRunCode = () => {
    setOutput((prev) => prev + `\n$ g++ main.cpp -o main && ./main\n⚡ NEONCODE ENGINE v1.0 ⚡\nCompile & Execute Success!\n[PROCESS COMPLETED WITH EXIT CODE 0]\n`);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        backgroundColor: "background.default",
        color: "text.primary",
      }}
    >
      {/* Top Navigation */}
      <Box
        component="header"
        sx={{
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 3,
          backgroundColor: "#070715",
          borderBottom: "2px solid rgba(0, 240, 255, 0.3)",
          boxShadow: "0 0 15px rgba(0, 240, 255, 0.15)",
          zIndex: 10,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Cpu size={24} color="#00f0ff" />
          <Typography
            variant="h5"
            sx={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 800,
              color: "primary.main",
              textShadow: "0 0 8px rgba(0, 240, 255, 0.6)",
              letterSpacing: "2px",
            }}
          >
            NeonCode
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              backgroundColor: "rgba(0, 240, 255, 0.05)",
              border: "1px dashed rgba(0, 240, 255, 0.4)",
              px: 2,
              py: 0.5,
              borderRadius: 1,
            }}
          >
            <Typography variant="body2" sx={{ fontFamily: "monospace", color: "primary.main" }}>
              ROOM: NEON-77-X
            </Typography>
          </Box>
          <Button
            variant="outlined"
            size="small"
            color="primary"
            startIcon={<Code size={16} />}
            sx={{
              borderWidth: "1px",
              boxShadow: "0 0 8px rgba(0, 240, 255, 0.1)",
            }}
          >
            Share Room
          </Button>
        </Box>
      </Box>

      {/* Main Workspace Layout */}
      <Box
        sx={{
          display: "flex",
          flex: 1,
          height: "calc(100vh - 60px)",
          width: "100%",
          overflow: "hidden",
        }}
      >
        {/* Left Pane - Editor (70% width) */}
        <Box
          sx={{
            width: "70%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            borderRight: "1px solid rgba(0, 240, 255, 0.15)",
            position: "relative",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 2,
              py: 1,
              backgroundColor: "background.paper",
              borderBottom: "1px solid rgba(0, 240, 255, 0.1)",
            }}
          >
            <Typography variant="body2" sx={{ fontFamily: "monospace", color: "primary.main" }}>
              main.cpp
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "0.75rem" }}>
              C++ • UTF-8
            </Typography>
          </Box>
          <Box sx={{ flex: 1, width: "100%", height: "100%" }}>
            <Editor
              height="100%"
              theme="vs-dark"
              defaultLanguage="cpp"
              value={code}
              onChange={(value) => setCode(value)}
              options={{
                fontSize: 14,
                fontFamily: "Fira Code, monospace",
                minimap: { enabled: false },
                scrollbar: {
                  vertical: "visible",
                  horizontal: "visible",
                },
                padding: { top: 15 },
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
            backgroundColor: "background.paper",
          }}
        >
          {/* Chat Section */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              borderBottom: "1px solid rgba(0, 240, 255, 0.15)",
            }}
          >
            <Box
              sx={{
                p: 2,
                display: "flex",
                alignItems: "center",
                gap: 1,
                borderBottom: "1px solid rgba(0, 240, 255, 0.1)",
                backgroundColor: "rgba(0, 240, 255, 0.02)",
              }}
            >
              <MessageSquare size={18} color="#00f0ff" />
              <Typography
                variant="subtitle2"
                sx={{
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 700,
                  color: "primary.main",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                Secure Chat Channel
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
              <List disablePadding>
                {chatMessages.map((msg) => (
                  <ListItem
                    key={msg.id}
                    alignItems="flex-start"
                    disablePadding
                    sx={{ mb: 1.5 }}
                  >
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        mr: 1.5,
                        backgroundColor: msg.user === "You" ? "secondary.main" : "primary.main",
                        color: "#0a0a1a",
                        fontWeight: 700,
                        fontSize: "0.85rem",
                      }}
                    >
                      {msg.avatar}
                    </Avatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: msg.user === "You" ? "secondary.main" : "primary.main" }}>
                            {msg.user}
                          </Typography>
                          <Typography variant="caption" sx={{ color: "text.secondary" }}>
                            {msg.time}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Typography
                          variant="body2"
                          sx={{ color: "text.primary", mt: 0.5, wordBreak: "break-word" }}
                        >
                          {msg.text}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Box>

            {/* Chat Input */}
            <Box
              sx={{
                p: 1.5,
                borderTop: "1px solid rgba(0, 240, 255, 0.1)",
                display: "flex",
                gap: 1,
                backgroundColor: "#080816",
              }}
            >
              <TextField
                size="small"
                fullWidth
                placeholder="Type transmission..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "rgba(255, 255, 255, 0.03)",
                    "& fieldset": {
                      borderColor: "rgba(0, 240, 255, 0.2)",
                    },
                    "&:hover fieldset": {
                      borderColor: "rgba(0, 240, 255, 0.4)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "primary.main",
                    },
                  },
                }}
              />
              <IconButton
                color="primary"
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                sx={{
                  backgroundColor: "rgba(0, 240, 255, 0.1)",
                  "&:hover": {
                    backgroundColor: "rgba(0, 240, 255, 0.2)",
                  },
                }}
              >
                <Send size={18} />
              </IconButton>
            </Box>
          </Box>

          {/* Terminal / Run Section */}
          <Box
            sx={{
              height: "40%",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* Terminal Header & Action Button */}
            <Box
              sx={{
                p: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "rgba(255, 0, 60, 0.02)",
                borderBottom: "1px solid rgba(255, 0, 60, 0.15)",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <TerminalIcon size={18} color="#ff003c" />
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 700,
                    color: "secondary.main",
                    letterSpacing: "1px",
                  }}
                >
                  SYSTEM CONSOLE
                </Typography>
              </Box>

              <Button
                variant="contained"
                color="secondary"
                size="small"
                onClick={handleRunCode}
                startIcon={<Play size={14} />}
                sx={{
                  px: 2,
                  boxShadow: "0 0 12px rgba(255, 0, 60, 0.4)",
                  "&:hover": {
                    boxShadow: "0 0 20px rgba(255, 0, 60, 0.7)",
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
                backgroundColor: "#03030b",
                p: 2,
                overflowY: "auto",
              }}
            >
              <Typography
                component="pre"
                sx={{
                  margin: 0,
                  fontFamily: "Fira Code, monospace",
                  fontSize: "0.8rem",
                  color: "#39ff14",
                  textShadow: "0 0 5px rgba(57, 255, 20, 0.3)",
                  whiteSpace: "pre-wrap",
                  lineHeight: 1.6,
                }}
              >
                {output}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
