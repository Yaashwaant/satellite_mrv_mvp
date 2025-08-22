import { Router } from 'express';
import { prisma } from '../prisma';
import { z } from 'zod';
import { requireAuth, requireRole } from '../auth/middleware';

export const projects = Router();

projects.get('/', async (_req, res) => {
	const items = await prisma.project.findMany({ include: { parcels: true } });
	res.json(items);
});

const createProjectSchema = z.object({
	name: z.string().min(1),
	description: z.string().optional(),
	boundary: z.any().optional(),
	ownerId: z.string().uuid().optional(),
	ownerEmail: z.string().email().optional(),
}).refine((d) => !!d.ownerId || !!d.ownerEmail, {
	message: 'Either ownerId or ownerEmail is required',
});

projects.post('/', requireAuth, requireRole(['ADMIN', 'PROJECT_DEVELOPER']), async (req, res) => {
	try {
		const parsed = createProjectSchema.parse(req.body ?? {});

		let resolvedOwnerId: string | undefined = parsed.ownerId;
		if (!resolvedOwnerId && parsed.ownerEmail) {
			const existing = await prisma.user.findUnique({ where: { email: parsed.ownerEmail } });
			if (existing) {
				resolvedOwnerId = existing.id;
			} else {
				const createdUser = await prisma.user.create({ data: { email: parsed.ownerEmail } });
				resolvedOwnerId = createdUser.id;
			}
		}

		if (!resolvedOwnerId) {
			return res.status(400).json({ error: 'ownerId is invalid or missing, and ownerEmail not provided' });
		}

		// Verify owner exists if ownerId was provided directly
		if (parsed.ownerId) {
			const exists = await prisma.user.findUnique({ where: { id: parsed.ownerId } });
			if (!exists) {
				return res.status(400).json({ error: 'ownerId does not exist' });
			}
		}

		const created = await prisma.project.create({
			data: {
				name: parsed.name,
				description: parsed.description,
				ownerId: resolvedOwnerId,
				boundary: parsed.boundary,
			},
		});
		return res.status(201).json(created);
	} catch (err: any) {
		if (err?.name === 'ZodError') {
			return res.status(400).json({ error: 'Invalid request', issues: err.issues });
		}
		return res.status(500).json({ error: 'Failed to create project' });
	}
});


