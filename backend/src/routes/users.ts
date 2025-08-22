import { Router } from 'express';
import { prisma } from '../prisma';

export const users = Router();

// List users from Postgres (Prisma)
users.get('/db', async (_req, res) => {
	const items = await prisma.user.findMany();
	res.json(items);
});

// Create a user in Postgres (Prisma)
users.post('/db', async (req, res) => {
	const { email, name, role } = req.body ?? {};
	if (!email) {
		return res.status(400).json({ error: 'email is required' });
	}
	const existing = await prisma.user.findUnique({ where: { email } });
	if (existing) return res.status(200).json(existing);
	const created = await prisma.user.create({ data: { email, name, role } });
	res.status(201).json(created);
});


