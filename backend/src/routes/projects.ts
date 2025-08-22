import { Router } from 'express';
import { prisma } from '../prisma';

export const projects = Router();

projects.get('/', async (_req, res) => {
	const items = await prisma.project.findMany({ include: { parcels: true } });
	res.json(items);
});

projects.post('/', async (req, res) => {
	const { name, description, ownerId, boundary } = req.body ?? {};
	const created = await prisma.project.create({
		data: { name, description, ownerId, boundary },
	});
	res.status(201).json(created);
});


