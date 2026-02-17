'use client';

import * as React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import NextAppDirEmotionCacheProvider from './EmotionCache';
import { getTheme } from './theme';
import { ThemeContextProvider, useThemeContext } from '@/context/ThemeContext';

function ThemeWrapper({ children }: { children: React.ReactNode }) {
	const { activeTheme } = useThemeContext();
	const theme = React.useMemo(() => getTheme(activeTheme), [activeTheme]);

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			{children}
		</ThemeProvider>
	);
}

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
	return (
		<NextAppDirEmotionCacheProvider options={{ key: 'mui' }}>
			<ThemeContextProvider>
				<ThemeWrapper>{children}</ThemeWrapper>
			</ThemeContextProvider>
		</NextAppDirEmotionCacheProvider>
	);
}
