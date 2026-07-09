import { Router, Request, Response } from "express";
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { prisma } from "../index";

const router = Router();

router.post("/run", async (req: Request, res: Response): Promise<any> => {
  const { code, roomId, input } = req.body;
  if (code === undefined) {
    res.status(400).json({ error: "Code is required" });
    return;
  }

  // Persist code and input state to Postgres room model
  if (roomId) {
    try {
      await prisma.room.upsert({
        where: { roomId },
        update: { currentCode: code, input: input || "" },
        create: { roomId, currentCode: code, input: input || "", output: "" },
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
  const inFile = path.join(tempDir, `temp_${id}.in`);

  // Write C++ code and standard input to temporary files
  fs.writeFile(cppFile, code, (err) => {
    if (err) {
      console.error("Error writing temp C++ file:", err);
      res.status(500).json({ error: "Failed to write temporary source file" });
      return;
    }

    fs.writeFile(inFile, input || "", (inputErr) => {
      if (inputErr) {
        console.error("Error writing temp input file:", inputErr);
        res.status(500).json({ error: "Failed to write temporary input file" });
        return;
      }

      // Compile and execute redirecting standard input
      exec(`g++ "${cppFile}" -o "${exeFile}" && "${exeFile}" < "${inFile}"`, async (execErr, stdout, stderr) => {
        // Clean up C++ file
        fs.unlink(cppFile, (unlinkErr) => {
          if (unlinkErr) console.error("Error deleting C++ source file:", unlinkErr);
        });

        // Clean up input file
        fs.unlink(inFile, (unlinkErr) => {
          if (unlinkErr) console.error("Error deleting input file:", unlinkErr);
        });

        // Clean up compiled executable
        fs.unlink(exeFile, () => {
          // Executable might not exist if compilation failed
        });

        const finalStderr = stderr || (execErr ? execErr.message : "");
        const finalOutput = finalStderr ? `\n[STDERR]\n${finalStderr}` : stdout;

        // Save output to Postgres room model
        if (roomId) {
          try {
            await prisma.room.update({
              where: { roomId },
              data: { output: finalOutput },
            });
          } catch (dbErr) {
            console.error("Prisma update output error:", dbErr);
          }
        }

        res.json({ stdout, stderr: finalStderr });
      });
    });
  });
});

export default router;
