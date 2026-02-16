import React, { useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

interface ToastProps {
	message: string;
	type?: 'success' | 'error' | 'info';
	visible: boolean;
	onDismiss: () => void;
	isDark: boolean;
}

export function Toast({ message, type = 'info', visible, onDismiss, isDark }: ToastProps) {
	useEffect(() => {
		if (visible) {
			const timer = setTimeout(onDismiss, 3000);
			return () => clearTimeout(timer);
		}
	}, [visible]);

	if (!visible) return null;

	const bg = isDark ? '#1E1E1E' : '#FFFFFF';
	const text = isDark ? '#FFFFFF' : '#000000';
	const border = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';

	let iconName: keyof typeof MaterialIcons.glyphMap = 'info-outline';
	let iconColor = isDark ? '#ccc' : '#666';

	if (type === 'success') {
		iconName = 'check-circle';
		iconColor = '#4caf50';
	} else if (type === 'error') {
		iconName = 'error-outline';
		iconColor = '#f44336';
	}

	return (
		<Animated.View
			entering={FadeInUp.springify()}
			exiting={FadeOutUp}
			style={[
				styles.container,
				{ backgroundColor: bg, borderColor: border }
			]}
		>
			<MaterialIcons name={iconName} size={24} color={iconColor} />
			<Text style={[styles.text, { color: text }]}>{message}</Text>
		</Animated.View>
	);
}

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		top: 60, // Below header
		left: 20,
		right: 20,
		padding: 16,
		borderRadius: 12,
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
		borderWidth: 1,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.15,
		shadowRadius: 12,
		elevation: 4,
		zIndex: 9999,
	},
	text: {
		fontSize: 14,
		fontWeight: '500',
		flex: 1,
	},
});
