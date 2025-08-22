import { Router } from 'express';
import { z } from 'zod';

export const stac = Router();

const searchSchema = z.object({
	bbox: z.array(z.number()).length(4).optional(),
	collections: z.array(z.string()).optional(),
	datetime: z.string().optional(),
	limit: z.number().int().min(1).max(100).optional(),
});

const STAC_URL = 'https://planetarycomputer.microsoft.com/api/stac/v1/search';

stac.post('/search', async (req, res) => {
	try {
		const body = searchSchema.parse(req.body ?? {});
		const resp = await fetch(STAC_URL, {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({
				bbox: body.bbox,
				collections: body.collections,
				datetime: body.datetime,
				limit: body.limit ?? 10,
			}),
		});
		if (!resp.ok) {
			const text = await resp.text();
			return res.status(502).json({ error: 'STAC upstream error', status: resp.status, detail: text });
		}
		const json = await resp.json();
		return res.json(json);
	} catch (err: any) {
		if (err?.name === 'ZodError') {
			return res.status(400).json({ error: 'Invalid request', issues: err.issues });
		}
		return res.status(500).json({ error: 'Failed to query STAC' });
	}
});
