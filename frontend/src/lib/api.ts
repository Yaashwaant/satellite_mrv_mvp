import axios from 'axios';
import { useAuth } from './auth';

const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});

export default api;

// Attach Authorization header when available
export function attachAuthInterceptor(getToken: () => string | null) {
	api.interceptors.request.use((config) => {
		const token = getToken();
		if (token) {
			config.headers = config.headers ?? {};
			(config.headers as any).Authorization = `Bearer ${token}`;
		}
		return config;
	});
}


