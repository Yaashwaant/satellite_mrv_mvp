import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

export type JwtPayload = {
	sub: string;
	email?: string;
	role?: string;
};

export function signToken(payload: JwtPayload, expiresIn: string = '7d'): string {
	return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export function verifyToken(token: string): JwtPayload {
	return jwt.verify(token, JWT_SECRET) as JwtPayload;
}


