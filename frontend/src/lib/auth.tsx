import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from './api';

type AuthContextValue = {
	token: string | null;
	role: string | null;
	email: string | null;
	login: (email: string, role?: string) => Promise<void>;
	logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
	const [role, setRole] = useState<string | null>(() => localStorage.getItem('role'));
	const [email, setEmail] = useState<string | null>(() => localStorage.getItem('email'));

	useEffect(() => {
		if (token) localStorage.setItem('token', token); else localStorage.removeItem('token');
		if (role) localStorage.setItem('role', role); else localStorage.removeItem('role');
		if (email) localStorage.setItem('email', email); else localStorage.removeItem('email');
	}, [token, role, email]);

	const login = async (emailInput: string, roleInput?: string) => {
		const res = await api.post('/auth/login', { email: emailInput, role: roleInput });
		const t = res.data?.token as string;
		const r = (res.data?.user?.role || roleInput || null) as string | null;
		setToken(t);
		setRole(r);
		setEmail(emailInput);
	};

	const logout = () => {
		setToken(null);
		setRole(null);
		setEmail(null);
	};

	const value = useMemo(() => ({ token, role, email, login, logout }), [token, role, email]);
	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error('useAuth must be used within AuthProvider');
	return ctx;
}

export function hasRole(role: string | null, allowed: string[]) {
	return !!role && allowed.includes(role);
}


