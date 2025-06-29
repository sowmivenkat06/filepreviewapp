import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

// Re-create __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve frontend files from the root
app.use(express.static(__dirname));

// Catch-all route for React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Frontend running on http://localhost:${PORT}`);
});
