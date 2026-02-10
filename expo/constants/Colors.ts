/**
 * Neural Violet Theme - Expo Client
 * See docs/frontend/mobile_ui_ux_spec.md for details.
 */

const tintColorLight = '#6750A4';
const tintColorDark = '#D0BCFF';

export const Colors = {
	light: {
		text: '#1C1B1F',
		background: '#FFFBFE', // Clean White
		tint: tintColorLight,
		icon: '#6750A4',
		tabIconDefault: '#6750A4',
		tabIconSelected: tintColorLight,

		// M3 Roles
		primary: '#6750A4',
		onPrimary: '#FFFFFF',
		primaryContainer: '#EADDFF',
		onPrimaryContainer: '#21005D',
		secondary: '#625B71',
		secondaryContainer: '#E8DEF8',
		tertiary: '#7D5260',
		tertiaryContainer: '#FFD8E4',
		error: '#B3261E',
		outline: '#79747E',
		surface: '#FFFBFE',
	},
	dark: {
		text: '#E6E1E5',
		background: '#0B0E14', // Deep Space (Matches Flutter)
		tint: tintColorDark,
		icon: '#D0BCFF',
		tabIconDefault: '#D0BCFF',
		tabIconSelected: tintColorDark,

		// M3 Roles
		primary: '#D0BCFF',
		onPrimary: '#381E72',
		primaryContainer: '#4F378B',
		onPrimaryContainer: '#EADDFF',
		secondary: '#CCC2DC',
		secondaryContainer: '#4A4458',
		tertiary: '#EFB8C8',
		tertiaryContainer: '#633B48',
		error: '#F2B8B5',
		outline: '#938F99',
		surface: '#1C1B1F',
	},
};
