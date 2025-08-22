import { AppBar, Box, Container, Link as MuiLink, Toolbar, Typography } from '@mui/material';
import { Link, Route, Routes } from 'react-router-dom';
import ProjectsPage from './pages/ProjectsPage';
import ParcelsPage from './pages/ParcelsPage';
import StacPage from './pages/StacPage';

export default function App() {
	return (
		<Box>
			<AppBar position="static">
				<Toolbar>
					<Typography variant="h6" sx={{ flexGrow: 1 }}>Satellite MRV</Typography>
					<MuiLink component={Link} to="/" color="inherit" sx={{ mr: 2 }}>Projects</MuiLink>
					<MuiLink component={Link} to="/parcels" color="inherit" sx={{ mr: 2 }}>Parcels</MuiLink>
					<MuiLink component={Link} to="/stac" color="inherit">STAC</MuiLink>
				</Toolbar>
			</AppBar>
			<Container sx={{ mt: 3 }}>
				<Routes>
					<Route path="/" element={<ProjectsPage />} />
					<Route path="/parcels" element={<ParcelsPage />} />
					<Route path="/stac" element={<StacPage />} />
				</Routes>
			</Container>
		</Box>
	);
}


