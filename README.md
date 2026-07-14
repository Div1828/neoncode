# ⚡ NeonCode

NeonCode is an ultra-premium, retro-futuristic cyberpunk collaborative C++ editor designed for competitive programming and real-time multiplayer coding. Built with custom CRT scanline overlays, neon text glows, shifting digital grid backgrounds, and a high-performance C++ compilation engine, NeonCode delivers an immersive terminal hacking atmosphere.

---

## 🚀 Key Features

* **Cyberpunk Visual Engine:** Built using Custom Google Fonts (`Orbitron`, `Fira Code`), CRT scanline layers, glowing holographic borders, and dynamically animated background grids behind the editors.
* **CP-Optimized Workspace:** A split-screen layout displaying `main.cpp` (C++ source editor), `input.txt` (editable standard input), and `output.txt` (read-only execution output).
* **Real-Time Collaboration:** Real-time synchronization of code edits, inputs, and outputs across all connected peers using WebSockets (Socket.io). Includes a glowing **Uplinks** indicator showing active room members.
* **Secure Comms Feed:** Integrated persistent chat widget for real-time encrypted messaging with fellow room hackers.
* **Tab-Specific JWT Authentication:** Isolated session storage tracking auth tokens, enabling local multiplayer testing across different browser tabs under different identities.
* **Database Persistence & Hydration:** Full workspace saving and recovery (code, input, output) stored in PostgreSQL via Prisma 7.
* **Room Selector Lobby:** A secure portal selection screen that displays success indicators, room ID joining/generation, and a list of previous **Decrypted Past Portals** linked to your account.
* **C++ Execution Engine:** Backend runner executing C++ compiles securely on the host using standard input redirection:
  ```bash
  g++ main.cpp -o main && ./main < input.txt
  ```

---

## 🛠️ Technology Stack

* **Frontend:** React, Vite, Monaco Editor (`@monaco-editor/react`), Material-UI (MUI), Lucide Icons, Socket.io-client.
* **Backend:** Node.js, Express, Socket.io, Prisma 7, PostgreSQL (Neon / pg.Pool adapter), bcrypt, jsonwebtoken.

---
