import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from './themed-text';
import { Colors } from '@/constants/Colors';
import { Spacing, Shapes } from '@/src/theme/layout';
import { useTheme } from '@/app/ctx';

interface DiagnosisStreamItemProps {
	message: string;
	type: 'ai' | 'doctor';
}

export function DiagnosisStreamItem({ message, type }: DiagnosisStreamItemProps) {
	const { activeTheme } = useTheme();
	const theme = Colors[activeTheme];

	const isAI = type === 'ai';

	return (
		<View
			style={[
				styles.container,
				{
					alignSelf: isAI ? 'flex-start' : 'flex-end',
					backgroundColor: isAI ? theme.secondaryContainer : 'transparent',
					borderColor: isAI ? 'transparent' : theme.outline,
					borderWidth: isAI ? 0 : 1,
					borderTopLeftRadius: isAI ? 2 : Shapes.cornerMedium, // Sharp corner for AI
					borderTopRightRadius: isAI ? Shapes.cornerMedium : 2, // Sharp corner for Doctor
				},
			]}
		>
			<ThemedText
				type="bodyLarge"
				style={{
					color: isAI ? theme.onSecondaryContainer : theme.onSurface,
				}}
			>
				{message}
			</ThemedText>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		maxWidth: '80%',
		padding: Spacing.medium,
		borderRadius: Shapes.cornerMedium,
		marginVertical: 4,
	},
});
