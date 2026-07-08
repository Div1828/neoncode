import { Router, Request, Response } from "express";
import { prisma } from "../index";

const router = Router();

// GET /api/chat/:roomId - Fetch all messages for a room
router.get("/:roomId", async (req: Request, res: Response): Promise<any> => {
  try {
    const { roomId } = req.params;
    if (typeof roomId !== "string") {
      res.status(400).json({ error: "Invalid Room ID" });
      return;
    }

    const room = await prisma.room.findUnique({ where: { roomId } });
    if (!room) {
      return res.json([]);
    }

    const messages = await prisma.message.findMany({
      where: { roomId: room.id },
      orderBy: { createdAt: "asc" },
      include: { author: true },
    });

    return res.json(messages);
  } catch (error) {
    console.error("Fetch chat messages error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/chat/:roomId - Post a new message to a room
router.post("/:roomId", async (req: Request, res: Response): Promise<any> => {
  try {
    const { roomId } = req.params;
    const { username, content } = req.body;

    if (typeof roomId !== "string" || !username || !content) {
      return res.status(400).json({ error: "Invalid payload parameters" });
    }

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let room = await prisma.room.findUnique({ where: { roomId } });
    if (!room) {
      room = await prisma.room.create({
        data: { roomId, currentCode: "" },
      });
    }

    const message = await prisma.message.create({
      data: {
        content,
        authorId: user.id,
        roomId: room.id,
      },
      include: { author: true },
    });

    return res.status(201).json(message);
  } catch (error) {
    console.error("Create chat message error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
