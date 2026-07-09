import { Router, Request, Response } from "express";
import { prisma } from "../index";

const router = Router();

// Retrieve persisted code state for a room, upserting to ensure it exists and linking the user
router.get("/room/:roomId", async (req: Request, res: Response): Promise<any> => {
  try {
    const { roomId } = req.params;
    const { username } = req.query;
    if (typeof roomId !== "string") {
      res.status(400).json({ error: "Invalid Room ID" });
      return;
    }

    const room = await prisma.room.upsert({
      where: { roomId },
      update: username ? {
        users: {
          connect: { username: username as string }
        }
      } : {},
      create: {
        roomId,
        currentCode: "",
        input: "",
        output: "",
        users: username ? {
          connect: { username: username as string }
        } : undefined
      }
    });

    return res.json({ code: room.currentCode, input: room.input, output: room.output });
  } catch (error) {
    console.error("Fetch room error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Retrieve all rooms associated with a user
router.get("/user-rooms/:username", async (req: Request, res: Response): Promise<any> => {
  try {
    const username = req.params.username as string;
    if (!username) {
      res.status(400).json({ error: "Username is required" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        rooms: {
          orderBy: { createdAt: "desc" }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({ rooms: user.rooms });
  } catch (error) {
    console.error("Fetch user rooms error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
