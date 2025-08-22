import { Router } from 'express';
import { prisma } from '../prisma';
import { signToken } from '../auth/jwt';

export const auth = Router();

// Simple email-only login: creates user if doesn't exist, returns JWT
auth.post('/login', async (req, res) => {
	const { email, role } = req.body ?? {};
	if (!email) return res.status(400).json({ error: 'email is required' });
	const user = await prisma.user.upsert({
		where: { email },
		update: { role },
		create: { email, role },
	});
	const token = signToken({ sub: user.id, email: user.email, role: (user as any).role });
	return res.json({ token, user });
});


