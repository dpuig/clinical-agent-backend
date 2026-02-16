/**
 * Bio-Digital Slate Theme - Clinical Agent
 * See implementation_plan.md for details.
 */

const tintColorLight = '#006684';
const tintColorDark = '#D0BCFF';

export const Colors = {
	light: {
		text: '#191C1D',
		background: '#F5FAFD', // Surface
		tint: tintColorLight,
		icon: '#006684',
		tabIconDefault: '#70787D',
		tabIconSelected: tintColorLight,

		// M3 Bio-Digital Slate Roles
		primary: '#006684',
		onPrimary: '#FFFFFF',
		primaryContainer: '#BDE9FF',
		onPrimaryContainer: '#001F2A',
		secondary: '#4D616C',
		onSecondary: '#FFFFFF',
		secondaryContainer: '#D0E6F2', // Approximation based on palette
		onSecondaryContainer: '#081E27',
		tertiary: '#64548F', // Recalculated for 'D9C7EF' container usually
		onTertiary: '#FFFFFF',
		tertiaryContainer: '#D9C7EF',
		onTertiaryContainer: '#201144',
		error: '#BA1A1A',
		onError: '#FFFFFF',
		errorContainer: '#FFDAD6',
		onErrorContainer: '#410002',
		outline: '#70787D',
		surface: '#F5FAFD',
		onSurface: '#191C1D',
		surfaceVariant: '#E1EBF1',
		onSurfaceVariant: '#40484C',
	},
	dark: {
		text: '#E1E3E3',
		background: '#191C1D', // Neutral Tone 10
		tint: '#4FD8EB', // Primary Tone 80
		icon: '#4FD8EB', // Primary Tone 80
		tabIconDefault: '#8A9296', // Outline equivalent
		tabIconSelected: '#4FD8EB',

		// M3 Roles (Dark - Accurate Bio-Digital Slate)
		primary: '#4FD8EB', // Tone 80
		onPrimary: '#003645', // Tone 20
		primaryContainer: '#004F66', // Tone 30
		onPrimaryContainer: '#BEECF5', // Tone 90
		secondary: '#B3CAD5', // Tone 80
		onSecondary: '#1E333C', // Tone 20
		secondaryContainer: '#354A53', // Tone 30
		onSecondaryContainer: '#CFE6F1', // Tone 90
		tertiary: '#D0BCFF', // Tone 80
		onTertiary: '#381E72', // Tone 20
		tertiaryContainer: '#4F378B', // Tone 30
		onTertiaryContainer: '#EADDFF', // Tone 90
		error: '#FFB4AB',
		onError: '#690005',
		errorContainer: '#93000A',
		onErrorContainer: '#FFDAD6',
		outline: '#8A9296',
		surface: '#191C1D',
		onSurface: '#E1E3E3',
		surfaceVariant: '#40484C',
		onSurfaceVariant: '#C0C8CD',
	},
};
