import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert, Button, Paper, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import api from '../lib/api';
import { useAuth, hasRole } from '../lib/auth';

type Parcel = { id: string; name?: string; projectId: string; areaHa?: number };

export default function ParcelsPage() {
	const qc = useQueryClient();
	const { role } = useAuth();
	const parcels = useQuery<Parcel[]>({
		queryKey: ['parcels'],
		queryFn: async () => (await api.get('/parcels')).data,
	});

	const [projectId, setProjectId] = useState('');
	const [name, setName] = useState('');
	const [areaHa, setAreaHa] = useState('');

	const createParcel = useMutation({
		mutationFn: async () => (await api.post('/parcels', { projectId, name, areaHa: areaHa ? Number(areaHa) : undefined })).data,
		onSuccess: () => { setName(''); setAreaHa(''); qc.invalidateQueries({ queryKey: ['parcels'] }); },
	});

	return (
		<Stack spacing={2}>
			<Typography variant="h5">Parcels</Typography>
			{hasRole(role, ['ADMIN', 'PROJECT_DEVELOPER']) && (
			<Paper sx={{ p: 2 }}>
				<Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
					<TextField label="Project ID" value={projectId} onChange={(e) => setProjectId(e.target.value)} fullWidth />
					<TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
					<TextField label="Area (ha)" value={areaHa} onChange={(e) => setAreaHa(e.target.value)} fullWidth />
					<Button variant="contained" onClick={() => createParcel.mutate()} disabled={!projectId}>Create</Button>
				</Stack>
				{createParcel.isError && <Alert severity="error">Failed to create parcel</Alert>}
			</Paper>
			)}
			<Stack spacing={1}>
				{parcels.data?.map((p) => (
					<Paper key={p.id} sx={{ p: 2 }}>
						<Typography variant="subtitle1">{p.name || 'Unnamed Parcel'}</Typography>
						<Typography variant="body2">Project: {p.projectId}</Typography>
						{typeof p.areaHa === 'number' && <Typography variant="body2">Area: {p.areaHa} ha</Typography>}
					</Paper>
				))}
			</Stack>
		</Stack>
	);
}


