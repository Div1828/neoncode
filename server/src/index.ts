import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { PrismaClient } from "./generated/prisma/client";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);

// Configure CORS
app.use(cors());
app.use(express.json());

// Integrate Socket.io
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Initialize Prisma Client
export const prisma = new PrismaClient({} as any);

// Basic test route
app.get("/health", (_req, res) => {
  res.json({ status: "ok", message: "NeonCode server active" });
});

// Socket.io connection setup
io.on("connection", (socket) => {
  console.log(`A user connected: ${socket.id}`);
  
  socket.on("join_room", (roomId: string) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room: ${roomId}`);
  });

  socket.on("code_change", ({ roomId, code }: { roomId: string; code: string }) => {
    socket.to(roomId).emit("receive_code", code);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`NeonCode server running on port ${PORT}`);
});
