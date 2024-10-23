import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectName = 'CIB';

const app = express();
const port = 5173;
const staticPath = path.join(__dirname, "..", "dist", projectName);

app.use(express.static(staticPath));

//hash router
app.get('*', (req, res) => {
    res.sendFile(staticPath);
});

const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

export const kill = () => {
    server.close(() => {
        console.log('Server closed');
    });
};
