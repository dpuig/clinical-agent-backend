import React, { useEffect } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { Canvas, Path, LinearGradient, vec, Skia } from '@shopify/react-native-skia';
import { Colors } from '@/constants/Colors';
import { useSharedValue, withRepeat, withTiming, Easing, useDerivedValue } from 'react-native-reanimated';
import { useTheme } from '@/app/ctx';

interface LiveWaveformContainerProps {
	isListening: boolean;
}

export function LiveWaveformContainer({ isListening }: LiveWaveformContainerProps) {
	const { activeTheme } = useTheme();
	const theme = Colors[activeTheme];
	const { width } = useWindowDimensions();
	const height = 64;

	const progress = useSharedValue(0);

	useEffect(() => {
		if (isListening) {
			progress.value = withRepeat(withTiming(100, { duration: 10000, easing: Easing.linear }), -1, false);
		} else {
			progress.value = withTiming(0);
		}
	}, [isListening, progress]);

	const path = useDerivedValue(() => {
		const p = Skia.Path.Make();
		const midY = height / 2;
		p.moveTo(0, midY);

		const actualAmplitude = isListening ? 20 : 2;
		const frequency = isListening ? 0.05 : 0.02;
		const phase = progress.value * 2; // Continuous movement

		for (let x = 0; x <= width; x += 5) {
			const y = midY + Math.sin((x * frequency) + phase) * actualAmplitude;
			p.lineTo(x, y);
		}
		return p;
	}, [isListening, width]);

	return (
		<View style={styles.container}>
			<Canvas style={{ width, height }}>
				<Path path={path} style="stroke" strokeWidth={3} color={theme.primary}>
					<LinearGradient
						start={vec(0, 0)}
						end={vec(width, 0)}
						colors={[theme.primary, theme.tertiary, theme.primary]}
					/>
				</Path>
			</Canvas>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		height: 64,
		justifyContent: 'center',
		alignItems: 'center',
		overflow: 'hidden',
	},
});
