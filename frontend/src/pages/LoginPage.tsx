import { Alert, Button, Paper, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useAuth } from '../lib/auth';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
	const { login } = useAuth();
	const nav = useNavigate();
	const [email, setEmail] = useState('admin@example.com');
	const [role, setRole] = useState('ADMIN');
	const [error, setError] = useState<string | null>(null);

	const onSubmit = async () => {
		try {
			await login(email, role);
			nav('/');
		} catch (e) {
			setError('Login failed');
		}
	};

	return (
		<Stack spacing={2}>
			<Typography variant="h5">Login</Typography>
			<Paper sx={{ p: 2 }}>
				<Stack spacing={2}>
					<TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
					<TextField label="Role (ADMIN or PROJECT_DEVELOPER)" value={role} onChange={(e) => setRole(e.target.value)} fullWidth />
					<Button variant="contained" onClick={onSubmit}>Login</Button>
					{error && <Alert severity="error">{error}</Alert>}
				</Stack>
			</Paper>
		</Stack>
	);
}


