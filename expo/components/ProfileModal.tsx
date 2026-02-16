import React from 'react';
import { StyleSheet, View, Modal, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { Spacing, Shapes } from '@/src/theme/layout';
import { ThemedText } from './themed-text';
import { useTheme, ThemeMode } from '@/app/ctx';
import { useAuth } from '@/app/auth';

interface ProfileModalProps {
	visible: boolean;
	onClose: () => void;
}

export function ProfileModal({ visible, onClose }: ProfileModalProps) {
	const { activeTheme, themeMode, setThemeMode } = useTheme();
	const { signOut } = useAuth();
	const theme = Colors[activeTheme];

	const renderThemeOption = (mode: ThemeMode, icon: keyof typeof Ionicons.glyphMap, label: string) => {
		const isSelected = themeMode === mode;
		return (
			<TouchableOpacity
				style={[
					styles.themeOption,
					{
						borderColor: isSelected ? theme.primary : theme.outline,
						backgroundColor: isSelected ? theme.primaryContainer : 'transparent'
					}
				]}
				onPress={() => setThemeMode(mode)}
			>
				<Ionicons
					name={icon}
					size={24}
					color={isSelected ? theme.onPrimaryContainer : theme.onSurface}
				/>
				<ThemedText style={{
					marginTop: 8,
					color: isSelected ? theme.onPrimaryContainer : theme.onSurface
				}}>
					{label}
				</ThemedText>
			</TouchableOpacity>
		);
	};

	return (
		<Modal
			animationType="slide"
			transparent={true}
			visible={visible}
			onRequestClose={onClose}
		>
			<View style={styles.centeredView}>
				<View style={styles.overlay}>
					<TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} activeOpacity={1} />
				</View>

				<View style={[
					styles.modalView,
					{
						backgroundColor: theme.surface,
						shadowColor: '#000',
						borderColor: theme.outline,
						borderWidth: activeTheme === 'dark' ? 1 : 0, // Add border in dark mode for separation
					}
				]}>
					{/* Header / Handle */}
					<View style={styles.header}>
						<View style={[styles.handle, { backgroundColor: theme.outline }]} />
						<TouchableOpacity onPress={onClose} style={styles.closeButton}>
							<Ionicons name="close" size={24} color={theme.onSurfaceVariant} />
						</TouchableOpacity>
					</View>

					<View style={styles.content}>
						<View style={styles.profileHeader}>
							<View style={[styles.avatarLarge, { backgroundColor: theme.primaryContainer }]}>
								<ThemedText type="headlineMedium" style={{ color: theme.onPrimaryContainer }}>JD</ThemedText>
							</View>
							<ThemedText type="headlineMedium" style={{ marginTop: Spacing.medium }}>Dr. Jane Doe</ThemedText>
							<ThemedText style={{ color: theme.onSurfaceVariant }}>Cardiology</ThemedText>
						</View>

						<View style={styles.section}>
							<ThemedText type="titleMedium" style={{ marginBottom: Spacing.medium }}>Appearance</ThemedText>
							<View style={styles.themeRow}>
								{renderThemeOption('light', 'sunny', 'Light')}
								{renderThemeOption('dark', 'moon', 'Dark')}
								{renderThemeOption('system', 'settings-sharp', 'System')}
							</View>
						</View>
						<View style={styles.section}>
							<ThemedText type="titleMedium" style={{ marginBottom: Spacing.medium }}>Account</ThemedText>
							<TouchableOpacity
								style={[styles.logoutButton, { borderColor: theme.error }]}
								onPress={() => {
									onClose();
									signOut();
								}}
							>
								<Ionicons name="log-out-outline" size={24} color={theme.error} />
								<ThemedText style={{ color: theme.error, marginLeft: 12, fontWeight: '600' }}>
									Log Out
								</ThemedText>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	centeredView: {
		flex: 1,
		justifyContent: 'flex-end',
	},
	overlay: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: 'rgba(0,0,0,0.4)',
	},
	modalView: {
		borderTopLeftRadius: Shapes.cornerLarge,
		borderTopRightRadius: Shapes.cornerLarge,
		padding: Spacing.large,
		shadowOffset: { width: 0, height: -2 },
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
		minHeight: '45%',
	},
	header: {
		alignItems: 'center',
		marginBottom: Spacing.medium,
		position: 'relative',
	},
	handle: {
		width: 40,
		height: 4,
		borderRadius: 2,
		opacity: 0.4,
	},
	closeButton: {
		position: 'absolute',
		right: 0,
		top: -10,
		padding: 8
	},
	content: {
		paddingBottom: 40,
	},
	profileHeader: {
		alignItems: 'center',
		marginBottom: Spacing.large * 2,
	},
	avatarLarge: {
		width: 80,
		height: 80,
		borderRadius: 40,
		justifyContent: 'center',
		alignItems: 'center',
	},
	section: {
		marginTop: Spacing.medium,
	},
	themeRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		gap: Spacing.medium,
	},
	themeOption: {
		flex: 1,
		alignItems: 'center',
		padding: Spacing.medium,
		borderRadius: Shapes.cornerMedium, // Squircle-ish
		borderWidth: 1,
	},
	logoutButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		padding: Spacing.medium,
		borderRadius: Shapes.cornerMedium,
		borderWidth: 1,
		marginTop: Spacing.small,
	}
});
