import { app, BrowserWindow } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { type ChildProcess, fork } from "node:child_process";

let mainWindow: BrowserWindow | null = null;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let serverProcess: ChildProcess | null = null;

function restartServer() {
  if (serverProcess) {
    serverProcess.kill();
  }
  setTimeout(() => {
    startServer();
  }, 1000); // 延遲一秒重啟
}

function startServer() {
  serverProcess = fork(path.join(__dirname, "server.js")); //shell option is ignored by node by default

  // Handle messages from server process
  serverProcess.on("message", (message: { port: number }) => {
    if (message.port) {
      mainWindow?.loadURL(`http://localhost:${message.port}`);
    }
  });

  // Restart server on error
  serverProcess.on("error", (error) => {
    console.error("Server encountered an error:", error);
    restartServer();
  });

  // Restart server on unexpected exit
  serverProcess.on("exit", (code, signal) => {
    if (code !== 0) {
      console.warn(`Server exited with code ${code}. Restarting...`);
      restartServer();
    }
  });
}

app.on("ready", () => {
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (process.env.NODE_ENV === "development") {
    mainWindow.loadURL("http://localhost:5173");
  } else {
    startServer();
  }
});

// Handle app close events
app.on("window-all-closed", () => {
  if (serverProcess) {
    serverProcess.kill();
  }
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("before-quit", () => {
  if (serverProcess) {
    serverProcess.kill();
  }
});
