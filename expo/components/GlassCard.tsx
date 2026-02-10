import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, ViewStyle, useColorScheme, Platform, View, TouchableOpacity, StyleProp } from 'react-native';

import { useTheme } from '@/app/ctx';

interface GlassCardProps {
	children: React.ReactNode;
	style?: StyleProp<ViewStyle>;
	intensity?: number;
	onPress?: () => void;
	width?: number | string;
	height?: number | string;
}

export function GlassCard({ children, style, intensity = 20, onPress, width, height }: GlassCardProps) {
	const { activeTheme } = useTheme(); // Use app theme context
	const isDark = activeTheme === 'dark';

	const Container = onPress ? TouchableOpacity : View;

	const content = (
		<View style={[styles.innerContainer, { width: width as any, height: height as any }]}>
			{isDark ? (
				<LinearGradient
					colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.05)']}
					start={{ x: 0, y: 0 }}
					end={{ x: 1, y: 1 }}
					style={StyleSheet.absoluteFill}
				/>
			) : (
				<View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(255, 255, 255, 0.6)' }]} />
			)}

			{/* Platform specific blur since expo-blur behaves differently */}
			{Platform.OS === 'ios' && (
				<BlurView
					intensity={intensity}
					tint={isDark ? 'dark' : 'light'}
					style={StyleSheet.absoluteFill}
				/>
			)}

			{/* Content */}
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				{children}
			</View>
		</View>
	);

	const containerStyle: ViewStyle = {
		borderRadius: 24,
		borderWidth: 1,
		borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(150, 150, 150, 0.2)', // Adjusted grey for light mode
		overflow: 'hidden',
		shadowColor: isDark ? undefined : '#000',
		shadowOffset: isDark ? undefined : { width: 0, height: 4 },
		shadowOpacity: isDark ? undefined : 0.05,
		shadowRadius: isDark ? undefined : 10,
		elevation: isDark ? undefined : 2, // Android shadow
	};

	return (
		<Container onPress={onPress} activeOpacity={0.8} style={[containerStyle, style]}>
			{content}
		</Container>
	);
}

const styles = StyleSheet.create({
	innerContainer: {
		padding: 16,
		// Ensure blur sits behind content but over background?
		// Actually standard BlurView usage is View -> BlurView (absolute) -> Content
		// Or BlurView wraps content.
		// Here we use absolute positioning for backgrounds.
	},
});
