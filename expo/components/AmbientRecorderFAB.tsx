
import React, { useEffect } from 'react';
import { StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withSpring,
	withRepeat,
	withTiming,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { Shadows } from '@/src/theme/layout';
import { useTheme } from '@/app/ctx';

interface AmbientRecorderFABProps {
	onPress: () => void;
	state: 'idle' | 'listening' | 'processing';
}

export function AmbientRecorderFAB({ onPress, state }: AmbientRecorderFABProps) {
	const { activeTheme } = useTheme();
	const theme = Colors[activeTheme];

	const borderRadius = useSharedValue(16); // cornerLarge
	const scale = useSharedValue(1);

	useEffect(() => {
		if (state === 'listening') {
			borderRadius.value = withSpring(48); // cornerFull (half of 96dp)
			scale.value = withRepeat(withTiming(1.05, { duration: 1000 }), -1, true); // Pulse effect
		} else {
			borderRadius.value = withSpring(28); // cornerLarge (28dp)
			scale.value = withSpring(1);
		}
	}, [state, borderRadius, scale]);

	const animatedStyle = useAnimatedStyle(() => {
		return {
			borderRadius: borderRadius.value,
			transform: [{ scale: scale.value }],
			backgroundColor: state === 'listening' ? theme.tertiaryContainer : theme.primaryContainer, // Use tertiary for active
		} as ViewStyle;
	});

	return (
		<TouchableOpacity activeOpacity={0.8} onPress={onPress}>
			<Animated.View style={[styles.container, animatedStyle, Shadows.level5]}>
				<Ionicons
					name={state === 'listening' ? 'stop' : state === 'processing' ? 'hourglass' : 'mic'}
					size={40} // Larger icon
					color={state === 'listening' ? theme.onTertiaryContainer : theme.onPrimaryContainer}
				/>
			</Animated.View>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	container: {
		width: 96, // Larger touch target
		height: 96,
		justifyContent: 'center',
		alignItems: 'center',
	},
});
