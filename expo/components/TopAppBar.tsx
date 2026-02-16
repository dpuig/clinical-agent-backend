import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { Spacing } from '@/src/theme/layout';
import { ThemedText } from './themed-text';
import { useTheme } from '@/app/ctx';

interface TopAppBarProps {
	onMenuPress: () => void;
	onProfilePress: () => void;
	title?: string;
}

export function TopAppBar({ onMenuPress, onProfilePress, title }: TopAppBarProps) {
	const { activeTheme } = useTheme();
	const theme = Colors[activeTheme];

	return (
		<View style={styles.container}>
			<TouchableOpacity onPress={onMenuPress} style={styles.iconButton}>
				<Ionicons name="menu" size={28} color={theme.onSurface} />
			</TouchableOpacity>

			{title && (
				<ThemedText type="titleMedium" style={{ flex: 1, textAlign: 'center' }}>
					{title}
				</ThemedText>
			)}

			<TouchableOpacity onPress={onProfilePress} style={[styles.profileButton, { borderColor: theme.outline }]}>
				{/* Placeholder for Profile Photo - using a simple colored view if no image */}
				<View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: theme.primaryContainer, justifyContent: 'center', alignItems: 'center' }}>
					<ThemedText style={{ color: theme.onPrimaryContainer, fontWeight: 'bold' }}>JD</ThemedText>
				</View>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: Spacing.medium,
		paddingVertical: Spacing.medium,
		height: 64,
	},
	iconButton: {
		padding: 8,
	},
	profileButton: {
		padding: 4,
		borderRadius: 20,
		borderWidth: 1,
	},
});
