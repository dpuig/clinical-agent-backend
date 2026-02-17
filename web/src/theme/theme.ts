import { createTheme, ThemeOptions } from '@mui/material/styles';
import { Inter } from 'next/font/google';

const inter = Inter({
	weight: ['300', '400', '500', '700'],
	subsets: ['latin'],
	display: 'swap',
});

// Common Typography & Components (Shared between modes)
const baseTheme: ThemeOptions = {
	typography: {
		fontFamily: inter.style.fontFamily,
		h1: {
			fontWeight: 400,
			fontSize: '3.5625rem', // 57px
			lineHeight: 1.12,
		},
		h2: {
			fontWeight: 400,
			fontSize: '2.8125rem', // 45px
			lineHeight: 1.15,
		},
		h3: {
			fontWeight: 400,
			fontSize: '1.75rem', // 28px
			lineHeight: 1.28,
		},
		h4: {
			fontWeight: 500,
			fontSize: '1.5rem', // 24px
			lineHeight: 1.33,
		},
		h5: {
			fontWeight: 500,
			fontSize: '1.375rem',
			lineHeight: 1.2,
		},
		h6: {
			fontWeight: 500,
			fontSize: '1.25rem', // 20px
		},
		subtitle1: {
			fontWeight: 500,
			fontSize: '1rem',
			lineHeight: 1.5,
			letterSpacing: '0.15px',
		},
		body1: {
			fontWeight: 400,
			fontSize: '1rem',
			lineHeight: 1.5,
			letterSpacing: '0.5px',
		},
		body2: {
			fontWeight: 400,
			fontSize: '0.875rem',
			lineHeight: 1.43,
			letterSpacing: '0.25px',
		},
		button: {
			fontWeight: 500,
			textTransform: 'none',
		},
	},
	shape: {
		borderRadius: 12,
	},
	components: {
		MuiButton: {
			styleOverrides: {
				root: {
					borderRadius: 20,
					textTransform: 'none',
					boxShadow: 'none',
				},
				containedPrimary: {
					// Colors handled by palette, just ensuring structure
				}
			},
		},
		MuiCard: {
			styleOverrides: {
				root: {
					borderRadius: 16,
					boxShadow: 'none',
					backgroundImage: 'none', // Critical for M3 dark mode to avoid elevation overlay
				},
			},
		},
		MuiPaper: {
			styleOverrides: {
				rounded: {
					borderRadius: 16,
				},
				root: {
					backgroundImage: 'none',
				}
			}
		},
		MuiDrawer: {
			styleOverrides: {
				paper: {
					backgroundImage: 'none',
					borderRight: 'none', // handled by color
				}
			}
		}
	},
};

export const getTheme = (mode: 'light' | 'dark') => {
	return createTheme({
		...baseTheme,
		palette: {
			mode,
			...(mode === 'light'
				? {
					// LIGHT MODE (Existing Bio-Digital Slate)
					primary: {
						main: '#006684',
						light: '#BDE9FF', // primaryContainer
						dark: '#001F2A', // onPrimaryContainer
						contrastText: '#FFFFFF', // onPrimary
					},
					secondary: {
						main: '#4D616C',
						light: '#D0E6F2', // secondaryContainer
						dark: '#081E27', // onSecondaryContainer
						contrastText: '#FFFFFF', // onSecondary
					},
					error: {
						main: '#BA1A1A',
						light: '#FFDAD6', // errorContainer
						dark: '#410002', // onErrorContainer
						contrastText: '#FFFFFF', // onError
					},
					background: {
						default: '#F5FAFD', // Surface
						paper: '#F5FAFD',   // Surface
					},
					text: {
						primary: '#191C1D', // onSurface
						secondary: '#40484C', // onSurfaceVariant
					},
					divider: '#70787D', // Outline
				}
				: {
					// DARK MODE (Refined)
					primary: {
						main: '#4FD8EB', // Tone 80
						light: '#004F66', // primaryContainer (Tone 30)
						dark: '#BEECF5', // onPrimaryContainer (Tone 90)
						contrastText: '#003645', // onPrimary (Tone 20)
					},
					secondary: {
						main: '#B3CAD5', // Tone 80
						light: '#354A53', // secondaryContainer
						dark: '#CFE6F1', // onSecondaryContainer
						contrastText: '#1E333C', // onSecondary
					},
					error: {
						main: '#FFB4AB',
						light: '#93000A',
						dark: '#FFDAD6',
						contrastText: '#690005',
					},
					background: {
						default: '#191C1D', // Neutral Tone 10 (Deepest Background)
						paper: '#202324',   // Slightly lighter for Cards/Surfaces (Custom fix for visibility)
					},
					text: {
						primary: '#E1E3E3', // onSurface
						secondary: '#C0C8CD', // onSurfaceVariant
					},
					divider: '#8A9296', // Outline
				}
			),
		},
		components: {
			...baseTheme.components,
			// Dynamic overrides
			MuiCard: {
				styleOverrides: {
					root: {
						// @ts-ignore
						...baseTheme.components?.MuiCard?.styleOverrides?.root,
						backgroundColor: mode === 'light' ? '#F5FAFD' : '#202324', // Match paper
						border: `1px solid ${mode === 'light' ? '#70787D' : '#8A9296'}`,
					}
				}
			},
			MuiPaper: {
				styleOverrides: {
					// @ts-ignore
					...baseTheme.components?.MuiPaper?.styleOverrides,
					root: {
						// @ts-ignore
						...baseTheme.components?.MuiPaper?.styleOverrides?.root,
						backgroundImage: 'none',
						backgroundColor: mode === 'light' ? '#F5FAFD' : '#202324', // Use lighter surface in dark mode
						...(mode === 'dark' && {
							border: '1px solid #8A9296', // Ensure papers have outline in dark mode if desired, or relying on color diff
						}),
						// Remove border for specific papers if needed by checking props, but here we apply globally for safety
						// or relying on component Usage.
						// Actually, better to just rely on color diff + optional border. 
						// Let's add border to all Papers in dark mode to be distinct like Mobile Modal.
						border: mode === 'dark' ? '1px solid #8A9296' : 'none',
					}
				}
			}
		}
	});
};

