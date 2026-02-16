import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';
import { Colors } from '@/constants/Colors';
import { Spacing, Shadows, Shapes } from '@/src/theme/layout';
import { useTheme } from '@/app/ctx';

interface Patient {
	name: string;
	age: number;
	gender: string;
	history: string[];
	lastVisit: string;
}

interface PatientContextCardProps {
	patient: Patient;
}

export function PatientContextCard({ patient }: PatientContextCardProps) {
	const [expanded, setExpanded] = useState(false);
	const { activeTheme } = useTheme();
	const theme = Colors[activeTheme];

	return (
		<TouchableOpacity activeOpacity={0.9} onPress={() => setExpanded(!expanded)}>
			<View
				style={[
					styles.card,
					{
						backgroundColor: theme.surfaceVariant,
						borderColor: theme.outline,
					},
					Shadows.level1,
				]}
			>
				<View style={styles.header}>
					<View>
						<ThemedText type="headlineMedium" style={{ color: theme.onSurfaceVariant }}>
							{patient.name}
						</ThemedText>
						<ThemedText type="bodyLarge" style={{ color: theme.onSurfaceVariant }}>
							{patient.age}y • {patient.gender}
						</ThemedText>
					</View>
					<View style={[styles.badge, { backgroundColor: theme.secondaryContainer }]}>
						<ThemedText type="labelLarge" style={{ color: theme.onSecondaryContainer }}>
							Inpatient
						</ThemedText>
					</View>
				</View>

				<View style={styles.content}>
					<View style={styles.row}>
						<ThemedText type="titleMedium" style={{ color: theme.primary }}>History: </ThemedText>
						<ThemedText type="bodyLarge" numberOfLines={expanded ? undefined : 1} style={{ flex: 1 }}>
							{patient.history.join(', ')}
						</ThemedText>
					</View>
					<View style={styles.row}>
						<ThemedText type="titleMedium" style={{ color: theme.primary }}>Last Visit: </ThemedText>
						<ThemedText type="bodyLarge">
							{patient.lastVisit}
						</ThemedText>
					</View>
				</View>
			</View>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	card: {
		borderRadius: Shapes.cornerMedium,
		padding: Spacing.medium,
		marginVertical: Spacing.medium,
		borderWidth: 0.5, // Subtle border
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		marginBottom: Spacing.medium,
	},
	badge: {
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: Shapes.cornerFull,
	},
	content: {
		gap: 8,
	},
	row: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		gap: 4
	}
});
