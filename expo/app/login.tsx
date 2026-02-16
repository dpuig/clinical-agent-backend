import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/Colors';
import { Spacing, Shapes } from '@/src/theme/layout';
import { useTheme } from '@/app/ctx';
import { useAuth } from '@/app/auth';

export default function LoginScreen() {
	const { activeTheme } = useTheme();
	const theme = Colors[activeTheme];
	const { signIn, isLoading } = useAuth();

	return (
		<SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
			<View style={styles.content}>
				{/* Enterprise Branding Area */}
				<View style={styles.header}>
					<View style={[styles.logoPlaceholder, { backgroundColor: theme.primaryContainer }]}>
						<Ionicons name="medical" size={48} color={theme.primary} />
					</View>
					<ThemedText type="displayMedium" style={{ marginTop: Spacing.large, textAlign: 'center' }}>
						Clinical Board
					</ThemedText>
					<ThemedText type="bodyLarge" style={{ marginTop: Spacing.small, color: theme.onSurfaceVariant, textAlign: 'center' }}>
						Enterprise Workspace
					</ThemedText>
				</View>

				{/* Login Actions */}
				<View style={styles.actions}>
					<TouchableOpacity
						style={[
							styles.ssoButton,
							{
								backgroundColor: theme.primary,
								opacity: isLoading ? 0.7 : 1,
							}
						]}
						onPress={signIn}
						disabled={isLoading}
					>
						<Ionicons name="shield-checkmark" size={24} color={theme.onPrimary} style={{ marginRight: 12 }} />
						<ThemedText type="titleMedium" style={{ color: theme.onPrimary, fontWeight: '600' }}>
							{isLoading ? 'Authenticating...' : 'Sign in with SSO'}
						</ThemedText>
					</TouchableOpacity>

					<ThemedText style={{ marginTop: Spacing.large, color: theme.outline, fontSize: 12, textAlign: 'center' }}>
						Authorized Personnel Only
					</ThemedText>
				</View>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	content: {
		flex: 1,
		justifyContent: 'center',
		padding: Spacing.large * 2,
	},
	header: {
		alignItems: 'center',
		marginBottom: Spacing.large * 4,
	},
	logoPlaceholder: {
		width: 96,
		height: 96,
		borderRadius: Shapes.cornerMedium,
		justifyContent: 'center',
		alignItems: 'center',
	},
	actions: {
		width: '100%',
	},
	ssoButton: {
		flexDirection: 'row',
		height: 56,
		borderRadius: Shapes.cornerFull,
		alignItems: 'center',
		justifyContent: 'center',
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	}
});
