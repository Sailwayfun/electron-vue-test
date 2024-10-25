import { app, BrowserWindow } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { fork } from 'node:child_process';

let mainWindow;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let serverProcess;

function restartServer() {
    if (serverProcess) {
        serverProcess.kill();
    }
    setTimeout(() => {
        startServer();
    }, 1000); // 延遲一秒重啟
}

function startServer() {
    serverProcess = fork(path.join(__dirname, 'server.mjs'), {
        shell: true,
    });

    // Handle messages from server process
    serverProcess.on('message', (message) => {
        if (message.port) {
            mainWindow.loadURL(`http://localhost:${message.port}`);
        }
    });

    // Restart server on error
    serverProcess.on('error', (error) => {
        console.error('Server encountered an error:', error);
        restartServer();
    });

    // Restart server on unexpected exit
    serverProcess.on('exit', (code, signal) => {
        if (code !== 0) {
            console.warn(`Server exited with code ${code}. Restarting...`);
            restartServer();
        }
    });
}

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
        },
    });

    if (process.env.NODE_ENV === 'development') {
        mainWindow.loadURL('http://localhost:5173');
    } else {
        startServer();
    }
});

// Handle app close events
app.on('window-all-closed', () => {
    serverProcess.kill();
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('before-quit', () => {
    serverProcess.kill();
});
