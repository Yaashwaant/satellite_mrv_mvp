import { Router } from 'express';
import { prisma } from '../prisma';

export const parcels = Router();

parcels.get('/', async (_req, res) => {
	const items = await prisma.parcel.findMany({ include: { project: true } });
	res.json(items);
});

parcels.post('/', async (req, res) => {
	const { projectId, name, areaHa, geometry } = req.body ?? {};
	const created = await prisma.parcel.create({
		data: { projectId, name, areaHa, geometry },
	});
	res.status(201).json(created);
});


