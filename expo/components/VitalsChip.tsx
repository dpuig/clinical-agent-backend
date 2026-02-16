import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from './themed-text';
import { Colors } from '@/constants/Colors';
import { useTheme } from '@/app/ctx';

interface VitalsChipProps {
	label: string;
	value: string;
	isAbnormal?: boolean;
}

export function VitalsChip({ label, value, isAbnormal }: VitalsChipProps) {
	const { activeTheme } = useTheme();
	const theme = Colors[activeTheme];

	return (
		<View
			style={[
				styles.container,
				{
					borderColor: isAbnormal ? theme.error : theme.outline,
					backgroundColor: isAbnormal ? theme.errorContainer : theme.surface,
				},
			]}
		>
			<ThemedText
				type="labelLarge"
				style={{ color: isAbnormal ? theme.onErrorContainer : theme.onSurfaceVariant }}
			>
				{label}
			</ThemedText>
			<ThemedText
				type="titleMedium"
				style={{ color: isAbnormal ? theme.onErrorContainer : theme.onSurface }}
			>
				{value}
			</ThemedText>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderRadius: 8, // corner-medium (8dp for chips)
		borderWidth: 1,
		alignItems: 'center',
		minWidth: 80,
	},
});
