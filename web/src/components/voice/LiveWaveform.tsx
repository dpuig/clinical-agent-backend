'use client';

import React, { useRef, useEffect } from 'react';
import { Box, useTheme } from '@mui/material';

interface LiveWaveformProps {
	isListening: boolean;
}

export default function LiveWaveform({ isListening }: LiveWaveformProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const theme = useTheme();

	// Animation refs
	const progressRef = useRef(0);
	const requestRef = useRef<number>(0);

	const animate = (time: number) => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		// Resize canvas to match display size
		if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
			canvas.width = canvas.clientWidth;
			canvas.height = canvas.clientHeight;
		}
		const { width, height } = canvas;
		const midY = height / 2;

		ctx.clearRect(0, 0, width, height);

		// Update progress
		progressRef.current += 0.05;

		// Draw Wave
		ctx.beginPath();
		ctx.moveTo(0, midY);

		const amplitude = isListening ? 20 : 2;
		const frequency = isListening ? 0.05 : 0.02;
		const phase = progressRef.current;

		for (let x = 0; x <= width; x += 5) {
			const y = midY + Math.sin(x * frequency + phase) * amplitude;
			ctx.lineTo(x, y);
		}

		// Gradient Stroke
		const gradient = ctx.createLinearGradient(0, 0, width, 0);
		gradient.addColorStop(0, theme.palette.primary.main);
		gradient.addColorStop(0.5, theme.palette.secondary.light);
		gradient.addColorStop(1, theme.palette.primary.main);

		ctx.strokeStyle = gradient;
		ctx.lineWidth = 3;
		ctx.lineCap = 'round';
		ctx.stroke();

		requestRef.current = requestAnimationFrame(animate);
	};

	useEffect(() => {
		requestRef.current = requestAnimationFrame(animate);
		return () => cancelAnimationFrame(requestRef.current);
	}, [isListening, theme]); // Re-bind if listing/theme changes

	return (
		<Box
			sx={{
				width: '100%',
				height: 64,
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				overflow: 'hidden'
			}}
		>
			<canvas
				ref={canvasRef}
				style={{ width: '100%', height: '100%' }}
			/>
		</Box>
	);
}
