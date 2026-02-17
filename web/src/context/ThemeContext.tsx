'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
	themeMode: ThemeMode;
	setThemeMode: (mode: ThemeMode) => void;
	activeTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType>({
	themeMode: 'system',
	setThemeMode: () => { },
	activeTheme: 'light',
});

export function ThemeContextProvider({ children }: { children: React.ReactNode }) {
	const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
	const [themeMode, setThemeModeState] = useState<ThemeMode>('system');

	// Load preference on mount
	useEffect(() => {
		const savedMode = localStorage.getItem('themeMode') as ThemeMode;
		if (savedMode) {
			setThemeModeState(savedMode);
		}
	}, []);

	const setThemeMode = (mode: ThemeMode) => {
		setThemeModeState(mode);
		localStorage.setItem('themeMode', mode);
	};

	const activeTheme = useMemo(() => {
		if (themeMode === 'system') {
			return prefersDarkMode ? 'dark' : 'light';
		}
		return themeMode;
	}, [themeMode, prefersDarkMode]);

	return (
		<ThemeContext.Provider value={{ themeMode, setThemeMode, activeTheme }}>
			{children}
		</ThemeContext.Provider>
	);
}

export const useThemeContext = () => useContext(ThemeContext);
