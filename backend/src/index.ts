import express from 'express';

const app = express();
const PORT = 3001;

app.use(express.json());

app.get('/', (_req, res) => {
  res.json({ status: 'ok', message: 'Backend running' });
});

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
