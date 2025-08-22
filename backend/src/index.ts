import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import { jsonDb } from './db/jsonDb';
import { projects } from './routes/projects';
import { parcels } from './routes/parcels';
import { users } from './routes/users';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/users', (_req, res) => {
  const users = jsonDb.getUsers();
  res.json(users);
});

app.post('/users', (req, res) => {
  const user = req.body ?? {};
  const created = jsonDb.addUser({
    id: Date.now().toString(),
    ...user,
  });
  res.status(201).json(created);
});

app.use('/projects', projects);
app.use('/parcels', parcels);
app.use('/users', users);

const port = env.PORT;
app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});
