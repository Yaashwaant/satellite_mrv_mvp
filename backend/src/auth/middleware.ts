import { NextFunction, Request, Response } from 'express';
import { verifyToken } from './jwt';

declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace Express {
		interface Request {
			user?: { id: string; email?: string; role?: string };
		}
	}
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
	const header = req.headers.authorization || '';
	const token = header.startsWith('Bearer ') ? header.slice(7) : undefined;
	if (!token) return res.status(401).json({ error: 'Missing bearer token' });
	try {
		const payload = verifyToken(token);
		req.user = { id: payload.sub, email: payload.email, role: payload.role };
		return next();
	} catch {
		return res.status(401).json({ error: 'Invalid token' });
	}
}

export function requireRole(roles: string[]) {
	return (req: Request, res: Response, next: NextFunction) => {
		if (!req.user?.role) return res.status(403).json({ error: 'Forbidden' });
		if (!roles.includes(req.user.role)) return res.status(403).json({ error: 'Forbidden' });
		return next();
	};
}


