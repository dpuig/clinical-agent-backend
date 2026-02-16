import React from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
	themeMode: ThemeMode;
	setThemeMode: (mode: ThemeMode) => void;
	activeTheme: 'light' | 'dark';
}

const ThemeContext = React.createContext<ThemeContextType>({
	themeMode: 'system',
	setThemeMode: () => { },
	activeTheme: 'light',
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const systemScheme = useSystemColorScheme();
	const [themeMode, setThemeMode] = React.useState<ThemeMode>('system');

	const activeTheme = themeMode === 'system' ? (systemScheme ?? 'light') : themeMode;

	return (
		<ThemeContext.Provider value={{ themeMode, setThemeMode, activeTheme }}>
			{children}
		</ThemeContext.Provider>
	);
}

export const useTheme = () => React.useContext(ThemeContext);

// Required by Expo Router to identify this as a valid route file (even though it's a context)
export default function () { return null; }
