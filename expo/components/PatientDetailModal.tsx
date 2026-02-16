import React from 'react';
import { StyleSheet, View, Modal, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { Spacing, Shapes } from '@/src/theme/layout';
import { PatientContextCard } from './PatientContextCard';
import { VitalsChip } from './VitalsChip';
import { ThemedText } from './themed-text';
import { useTheme } from '@/app/ctx';

interface PatientDetailModalProps {
	visible: boolean;
	onClose: () => void;
	patient: any;
	vitals: any[];
}

export function PatientDetailModal({ visible, onClose, patient, vitals }: PatientDetailModalProps) {
	const { activeTheme } = useTheme();
	const theme = Colors[activeTheme];

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
						borderWidth: activeTheme === 'dark' ? 1 : 0
					}
				]}>
					{/* Handle/Header */}
					<View style={styles.header}>
						<View style={[styles.handle, { backgroundColor: theme.outline }]} />
						<TouchableOpacity onPress={onClose} style={styles.closeButton}>
							<Ionicons name="close" size={24} color={theme.onSurfaceVariant} />
						</TouchableOpacity>
					</View>

					<View style={styles.content}>
						<ThemedText type="headlineMedium" style={{ marginBottom: Spacing.medium }}>Patient Context</ThemedText>

						<PatientContextCard patient={patient} />

						<ThemedText type="titleMedium" style={{ marginTop: Spacing.medium, marginBottom: 8 }}>Current Vitals</ThemedText>
						<View style={styles.vitalsGrid}>
							{vitals.map((vital, index) => (
								<VitalsChip key={index} {...vital} />
							))}
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
		shadowOffset: {
			width: 0,
			height: -2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
		minHeight: '50%',
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
	vitalsGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 8,
	}
});
