import { Router, Request, Response } from "express";
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { prisma } from "../index";

const router = Router();

router.post("/run", async (req: Request, res: Response): Promise<any> => {
  const { code, roomId } = req.body;
  if (code === undefined) {
    res.status(400).json({ error: "Code is required" });
    return;
  }

  // Persist code state to Postgres room model
  if (roomId) {
    try {
      await prisma.room.upsert({
        where: { roomId },
        update: { currentCode: code },
        create: { roomId, currentCode: code },
      });
    } catch (dbErr) {
      console.error("Prisma upsert error:", dbErr);
    }
  }

  const id = Math.random().toString(36).substring(7);
  const tempDir = path.join(__dirname, "../../temp");
  
  // Ensure temp directory exists
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  const cppFile = path.join(tempDir, `temp_${id}.cpp`);
  const exeFile = path.join(tempDir, `temp_${id}`);

  // Write C++ code to temporary file
  fs.writeFile(cppFile, code, (err) => {
    if (err) {
      console.error("Error writing temp C++ file:", err);
      res.status(500).json({ error: "Failed to write temporary source file" });
      return;
    }

    // Compile and execute
    exec(`g++ "${cppFile}" -o "${exeFile}" && "${exeFile}"`, (execErr, stdout, stderr) => {
      // Clean up C++ file
      fs.unlink(cppFile, (unlinkErr) => {
        if (unlinkErr) console.error("Error deleting C++ source file:", unlinkErr);
      });

      // Clean up compiled executable
      fs.unlink(exeFile, () => {
        // Executable might not exist if compilation failed
      });

      if (execErr) {
        res.json({ stdout, stderr: stderr || execErr.message });
        return;
      }

      res.json({ stdout, stderr });
    });
  });
});

export default router;
