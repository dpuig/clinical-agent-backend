import React from 'react';
import { useRouter, useSegments } from 'expo-router';

// Mock User Interface
export interface User {
	id: string;
	name: string;
	role: string;
	email: string;
}

interface AuthContextType {
	user: User | null;
	signIn: () => void;
	signOut: () => void;
	isLoading: boolean;
}

const AuthContext = React.createContext<AuthContextType>({
	user: null,
	signIn: () => { },
	signOut: () => { },
	isLoading: false,
});

// This hook can be used to access the user info.
export function useAuth() {
	return React.useContext(AuthContext);
}

// This hook will protect the route access based on user authentication.
function useProtectedRoute(user: User | null) {
	const segments = useSegments();
	const router = useRouter();

	React.useEffect(() => {
		const inAuthGroup = segments[0] === '(auth)' || segments[0] === 'login';

		if (
			// If the user is not signed in and the initial segment is not anything in the auth group.
			!user &&
			!inAuthGroup
		) {
			// Redirect to the sign-in page.
			router.replace('/login');
		} else if (user && inAuthGroup) {
			// Redirect away from the sign-in page.
			router.replace('/');
		}
	}, [user, segments]);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = React.useState<User | null>(null);
	const [isLoading, setIsLoading] = React.useState(false);

	useProtectedRoute(user);

	const signIn = () => {
		setIsLoading(true);
		// Simulate API call
		setTimeout(() => {
			setUser({
				id: '123',
				name: 'Dr. Jane Doe',
				role: 'Cardiologist',
				email: 'jane.doe@hospital.org',
			});
			setIsLoading(false);
		}, 1000);
	};

	const signOut = () => {
		setUser(null);
	};

	return (
		<AuthContext.Provider
			value={{
				signIn,
				signOut,
				user,
				isLoading,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}
