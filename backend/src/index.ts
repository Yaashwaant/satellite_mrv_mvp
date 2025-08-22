import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { env } from './config/env';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

const port = env.PORT;
app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});
