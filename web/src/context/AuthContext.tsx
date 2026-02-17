'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export type UserRole = 'doctor' | 'admin';

export interface User {
	id: string;
	name: string;
	email: string;
	role: UserRole;
}

interface AuthContextType {
	user: User | null;
	login: (role: UserRole) => Promise<void>;
	logout: () => void;
	isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	const pathname = usePathname();

	useEffect(() => {
		// Basic route protection
		const isPublic = pathname === '/login';
		if (!user && !isPublic && !isLoading) {
			router.push('/login');
		}
	}, [user, pathname, isLoading, router]);


	const login = async (role: UserRole) => {
		setIsLoading(true);
		// Simulate API delay
		await new Promise((resolve) => setTimeout(resolve, 1000));

		const mockUser: User = {
			id: role === 'admin' ? 'admin-1' : 'doc-1',
			name: role === 'admin' ? 'System Administrator' : 'Dr. Jane Doe',
			email: role === 'admin' ? 'admin@clinical-agent.com' : 'jane.doe@hospital.org',
			role: role,
		};

		setUser(mockUser);
		setIsLoading(false);
		router.push('/');
	};

	const logout = () => {
		setUser(null);
		router.push('/login');
	};

	return (
		<AuthContext.Provider value={{ user, login, logout, isLoading }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
}
