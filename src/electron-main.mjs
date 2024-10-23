import { app, BrowserWindow } from 'electron';
import * as server from "./server.mjs";

let mainWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
        },
    });

    if (process.env.NODE_ENV === 'development') {
        // setTimeout(() => {
        mainWindow.loadURL('http://localhost:5173');  // 開發環境指向 Vite 伺服器
        // }, 1000);
    };
});

app.on('window-all-closed', () => {
    server.kill();
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('before-quit', () => {
    server.kill();
});
