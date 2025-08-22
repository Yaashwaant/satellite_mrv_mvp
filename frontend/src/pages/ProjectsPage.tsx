import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert, Button, Paper, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import api from '../lib/api';
import { useAuth, hasRole } from '../lib/auth';

type Project = {
	id: string;
	name: string;
	description?: string;
	ownerId: string;
};

export default function ProjectsPage() {
	const qc = useQueryClient();
	const { role } = useAuth();
	const projects = useQuery<Project[]>({
		queryKey: ['projects'],
		queryFn: async () => (await api.get('/projects')).data,
	});

	const [name, setName] = useState('');
	const [ownerEmail, setOwnerEmail] = useState('');

	const createProject = useMutation({
		mutationFn: async () => (await api.post('/projects', { name, ownerEmail })).data,
		onSuccess: () => { setName(''); setOwnerEmail(''); qc.invalidateQueries({ queryKey: ['projects'] }); },
	});

	return (
		<Stack spacing={2}>
			<Typography variant="h5">Projects</Typography>
			{hasRole(role, ['ADMIN', 'PROJECT_DEVELOPER']) && (
			<Paper sx={{ p: 2 }}>
				<Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
					<TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
					<TextField label="Owner Email" value={ownerEmail} onChange={(e) => setOwnerEmail(e.target.value)} fullWidth />
					<Button variant="contained" onClick={() => createProject.mutate()} disabled={!name || !ownerEmail}>Create</Button>
				</Stack>
				{createProject.isError && <Alert severity="error">Failed to create project</Alert>}
			</Paper>
			)}
			<Stack spacing={1}>
				{projects.data?.map((p) => (
					<Paper key={p.id} sx={{ p: 2 }}>
						<Typography variant="subtitle1">{p.name}</Typography>
						<Typography variant="body2">Owner: {p.ownerId}</Typography>
					</Paper>
				))}
			</Stack>
		</Stack>
	);
}


