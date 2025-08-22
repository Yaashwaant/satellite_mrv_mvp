import fs from 'fs';
import path from 'path';

type DatabaseShape = {
	users: Array<Record<string, unknown>>;
	projects: unknown[];
	parcels: unknown[];
	metrics: unknown[];
	estimates: unknown[];
	reports: unknown[];
	verifications: unknown[];
	images: unknown[];
	logs: unknown[];
};

const databaseFilePath = path.join(process.cwd(), 'data', 'db.json');

function ensureDatabaseFileExists(): void {
	const directoryPath = path.dirname(databaseFilePath);
	if (!fs.existsSync(directoryPath)) {
		fs.mkdirSync(directoryPath, { recursive: true });
	}
	if (!fs.existsSync(databaseFilePath)) {
		const initialData: DatabaseShape = {
			users: [],
			projects: [],
			parcels: [],
			metrics: [],
			estimates: [],
			reports: [],
			verifications: [],
			images: [],
			logs: [],
		};
		fs.writeFileSync(databaseFilePath, JSON.stringify(initialData, null, 2), 'utf8');
	}
}

function readDatabase(): DatabaseShape {
	ensureDatabaseFileExists();
	const rawContent = fs.readFileSync(databaseFilePath, 'utf8');
	try {
		const parsed = JSON.parse(rawContent) as Partial<DatabaseShape>;
		return {
			users: parsed.users ?? [],
			projects: parsed.projects ?? [],
			parcels: parsed.parcels ?? [],
			metrics: parsed.metrics ?? [],
			estimates: parsed.estimates ?? [],
			reports: parsed.reports ?? [],
			verifications: parsed.verifications ?? [],
			images: parsed.images ?? [],
			logs: parsed.logs ?? [],
		};
	} catch {
		return {
			users: [],
			projects: [],
			parcels: [],
			metrics: [],
			estimates: [],
			reports: [],
			verifications: [],
			images: [],
			logs: [],
		};
	}
}

function writeDatabase(updatedData: DatabaseShape): void {
	fs.writeFileSync(databaseFilePath, JSON.stringify(updatedData, null, 2), 'utf8');
}

export const jsonDb = {
	getUsers(): Array<Record<string, unknown>> {
		const db = readDatabase();
		return db.users;
	},

	addUser(user: Record<string, unknown>): Record<string, unknown> {
		const db = readDatabase();
		db.users.push(user);
		writeDatabase(db);
		return user;
	},
};


