import { Router } from 'express';
import { prisma } from '../prisma';
import { z } from 'zod';

export const parcels = Router();

parcels.get('/', async (_req, res) => {
	const items = await prisma.parcel.findMany({ include: { project: true } });
	res.json(items);
});

const createParcelSchema = z.object({
	projectId: z.string().uuid(),
	name: z.string().optional(),
	areaHa: z.number().optional(),
	geometry: z.any().optional(),
});

parcels.post('/', async (req, res) => {
	try {
		const parsed = createParcelSchema.parse(req.body ?? {});
		const project = await prisma.project.findUnique({ where: { id: parsed.projectId } });
		if (!project) {
			return res.status(400).json({ error: 'projectId does not exist' });
		}
		const created = await prisma.parcel.create({
			data: {
				projectId: parsed.projectId,
				name: parsed.name,
				areaHa: parsed.areaHa,
				geometry: parsed.geometry,
			},
		});
		return res.status(201).json(created);
	} catch (err: any) {
		if (err?.name === 'ZodError') {
			return res.status(400).json({ error: 'Invalid request', issues: err.issues });
		}
		return res.status(500).json({ error: 'Failed to create parcel' });
	}
});


