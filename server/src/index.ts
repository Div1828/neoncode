import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { PrismaClient } from "./generated/prisma";
import dotenv from "dotenv";

import authRouter from "./routes/auth";
import executeRouter from "./routes/execute";
import roomRouter from "./routes/room";
import chatRouter from "./routes/chat";

import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);

// Configure CORS
app.use(cors());
app.use(express.json());

// Mount routers
app.use("/auth", authRouter);
app.use(executeRouter);
app.use("/api", roomRouter);
app.use("/api/chat", chatRouter);

// Integrate Socket.io
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Initialize Prisma Client with pg adapter
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
export const prisma = new PrismaClient({ adapter });

// Basic test route
app.get("/health", (_req, res) => {
  res.json({ status: "ok", message: "NeonCode server active" });
});

const roomUsers = new Map<string, Set<string>>();

// Socket.io connection setup
io.on("connection", (socket) => {
  console.log(`A user connected: ${socket.id}`);
  
  socket.on("join_room", ({ roomId, username }: { roomId: string; username: string }) => {
    socket.join(roomId);
    socket.data.roomId = roomId;
    socket.data.username = username;

    if (!roomUsers.has(roomId)) {
      roomUsers.set(roomId, new Set());
    }
    if (username) {
      roomUsers.get(roomId)!.add(username);
    }

    console.log(`User ${username} joined room: ${roomId}`);
    io.to(roomId).emit("room_users", Array.from(roomUsers.get(roomId)!));
  });

  socket.on("code_change", ({ roomId, code }: { roomId: string; code: string }) => {
    socket.to(roomId).emit("receive_code", code);
  });

  socket.on("input_change", ({ roomId, input }: { roomId: string; input: string }) => {
    socket.to(roomId).emit("receive_input", input);
  });

  socket.on("output_change", ({ roomId, output }: { roomId: string; output: string }) => {
    socket.to(roomId).emit("receive_output", output);
  });

  socket.on("chat_message", ({ roomId, message }: { roomId: string; message: any }) => {
    socket.to(roomId).emit("receive_chat", message);
  });

  socket.on("disconnect", () => {
    const { roomId, username } = socket.data;
    if (roomId && username && roomUsers.has(roomId)) {
      const users = roomUsers.get(roomId)!;
      users.delete(username);
      if (users.size === 0) {
        roomUsers.delete(roomId);
      } else {
        io.to(roomId).emit("room_users", Array.from(users));
      }
    }
    console.log(`User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`NeonCode server running on port ${PORT}`);
});
