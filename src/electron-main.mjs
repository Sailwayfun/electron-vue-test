import { app, BrowserWindow } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { fork } from 'node:child_process';

let mainWindow;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serverProcess = fork(path.join(__dirname, 'server.mjs'), {
    shell: true,
});

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
        },
    });

    serverProcess.on('message', (message) => {
        if (message === 'server-started') {
            mainWindow.loadURL('http://localhost:5173');
        }
    });
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
