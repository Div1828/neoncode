import { Router, Request, Response } from "express";
import { prisma } from "../index";

const router = Router();

// Retrieve persisted code state for a room
router.get("/room/:roomId", async (req: Request, res: Response): Promise<any> => {
  try {
    const { roomId } = req.params;
    if (typeof roomId !== "string") {
      res.status(400).json({ error: "Invalid Room ID" });
      return;
    }

    const room = await prisma.room.findUnique({
      where: { roomId },
    });

    if (!room) {
      return res.json({ code: null, input: null, output: null });
    }

    return res.json({ code: room.currentCode, input: room.input, output: room.output });
  } catch (error) {
    console.error("Fetch room error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
