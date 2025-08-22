import { useMutation } from '@tanstack/react-query';
import { Alert, Button, Paper, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import api from '../lib/api';

export default function StacPage() {
	const [bbox, setBbox] = useState('');
	const [collections, setCollections] = useState('sentinel-2-l2a');
	const [datetime, setDatetime] = useState('2024-01-01/2024-02-01');

	const search = useMutation({
		mutationFn: async () => (await api.post('/stac/search', {
			bbox: bbox ? bbox.split(',').map((s) => Number(s.trim())) : undefined,
			collections: collections ? collections.split(',').map((s) => s.trim()) : undefined,
			datetime: datetime || undefined,
			limit: 5,
		})).data,
	});

	return (
		<Stack spacing={2}>
			<Typography variant="h5">STAC Search (Planetary Computer)</Typography>
			<Paper sx={{ p: 2 }}>
				<Stack spacing={2}>
					<TextField label="BBOX (minLon,minLat,maxLon,maxLat)" value={bbox} onChange={(e) => setBbox(e.target.value)} fullWidth />
					<TextField label="Collections (comma separated)" value={collections} onChange={(e) => setCollections(e.target.value)} fullWidth />
					<TextField label="Datetime (e.g., 2024-01-01/2024-02-01)" value={datetime} onChange={(e) => setDatetime(e.target.value)} fullWidth />
					<Button variant="contained" onClick={() => search.mutate()}>Search</Button>
					{search.isError && <Alert severity="error">Search failed</Alert>}
				</Stack>
			</Paper>
			{search.data && (
				<Paper sx={{ p: 2 }}>
					<Typography variant="subtitle1">Results</Typography>
					<pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(search.data, null, 2)}</pre>
				</Paper>
			)}
		</Stack>
	);
}


