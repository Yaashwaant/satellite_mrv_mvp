import jwt, { type Secret, type SignOptions } from 'jsonwebtoken';

const JWT_SECRET: Secret = (process.env.JWT_SECRET || 'dev-secret-change-me') as Secret;

export type JwtPayload = {
	sub: string;
	email?: string;
	role?: string;
};

export function signToken(payload: JwtPayload, expiresIn: string | number = '7d'): string {
	const options: SignOptions = { expiresIn };
	return jwt.sign(payload, JWT_SECRET, options);
}

export function verifyToken(token: string): JwtPayload {
	return jwt.verify(token, JWT_SECRET) as JwtPayload;
}


