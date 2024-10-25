import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import getPort, { portNumbers } from "get-port";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectName = 'CIB';

const app = express();
// const port = 5173;
const staticPath = path.join(__dirname, "..", "dist", projectName);

// Serve static files from the specified directory
app.use(express.static(staticPath));

//hash router
app.get('*', (req, res) => {
    // Adjusted to send a specific file, e.g., index.html
    res.sendFile(path.join(staticPath, 'index.html'), {
        headers: { 'Content-Type': 'text/html' }
    });
});

const port = await getPort({ port: portNumbers(40000, 50000) });

const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);

    process.send({ port });
});

// Handle shutdown
process.on('SIGTERM', () => {
    console.log('Received SIGTERM. Closing server...');
    server.close(() => {
        console.log('Server closed.');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('Received SIGINT. Closing server...');
    server.close(() => {
        console.log('Server closed.');
        process.exit(0);
    });
});
