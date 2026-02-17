'use client';

import React from 'react';
import { Box, IconButton, useTheme, keyframes } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';

type RecorderState = 'idle' | 'listening' | 'processing';

interface AmbientRecorderFABProps {
	state: RecorderState;
	onPress: () => void;
}

// Pulse animation for listening state
const pulse = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(0, 102, 132, 0.4); }
  70% { transform: scale(1.05); box-shadow: 0 0 0 15px rgba(0, 102, 132, 0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(0, 102, 132, 0); }
`;

export default function AmbientRecorderFAB({ state, onPress }: AmbientRecorderFABProps) {
	const theme = useTheme();

	const isListening = state === 'listening';
	const isProcessing = state === 'processing';

	return (
		<Box
			onClick={onPress}
			sx={{
				width: 80,
				height: 80,
				borderRadius: 40, // Circle
				bgcolor: isListening ? theme.palette.error.main : theme.palette.primary.main,
				color: 'white',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				cursor: 'pointer',
				transition: 'all 0.3s ease',
				animation: isListening ? `${pulse} 2s infinite` : 'none',
				'&:hover': {
					bgcolor: isListening ? theme.palette.error.dark : theme.palette.primary.dark,
					transform: 'scale(1.05)',
				},
				boxShadow: theme.shadows[4]
			}}
		>
			{isListening ? (
				<StopIcon sx={{ fontSize: 32 }} />
			) : (
				<MicIcon sx={{ fontSize: 32 }} />
			)}
		</Box>
	);
}
