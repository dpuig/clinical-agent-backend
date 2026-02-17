'use client';

import React, { useState } from 'react';
import { Box, Typography, Zoom, IconButton, useTheme, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Orb from '@/components/voice/Orb';
import LiveWaveform from '@/components/voice/LiveWaveform';
import AmbientRecorderFAB from '@/components/voice/AmbientRecorderFAB';
import ClinicalResultView from '@/components/clinical/ClinicalResultView';
import { useRouter } from 'next/navigation';

type RecorderState = 'idle' | 'listening' | 'processing';

export default function AIModePage() {
	const router = useRouter();
	const theme = useTheme();
	const [recorderState, setRecorderState] = useState<RecorderState>('idle');
	const [sessionFinished, setSessionFinished] = useState(false);

	const toggleRecording = () => {
		if (recorderState === 'idle') {
			setRecorderState('listening');
		} else if (recorderState === 'listening') {
			setRecorderState('processing');
			// Simulate AI Processing
			setTimeout(() => {
				setRecorderState('idle');
				setSessionFinished(true);
			}, 2000);
		}
	};

	const handleReset = () => {
		setSessionFinished(false);
		setRecorderState('idle');
	};

	return (
		<Box
			sx={{
				height: '100vh',
				bgcolor: 'background.default',
				display: 'flex',
				flexDirection: 'column',
				position: 'relative',
				overflow: 'hidden'
			}}
		>
			{/* Top Bar */}
			<Box sx={{ p: 2, display: 'flex', alignItems: 'center', zIndex: 10, justifyContent: 'space-between' }}>
				<Box sx={{ display: 'flex', alignItems: 'center' }}>
					<IconButton onClick={() => router.back()} color="inherit">
						<ArrowBackIcon />
					</IconButton>
					<Typography variant="h6" sx={{ ml: 2, fontWeight: 500, color: 'text.primary' }}>
						AI Clinical Assistant
					</Typography>
				</Box>
				{sessionFinished && (
					<Button onClick={handleReset} variant="outlined" size="small">
						New Session
					</Button>
				)}
			</Box>

			{/* Main Content Area */}
			<Box sx={{ flexGrow: 1, position: 'relative', overflow: 'hidden' }}>

				{/* AI Voice Interface (Orb) - Visible when NOT finished */}
				{!sessionFinished && (
					<Box
						sx={{
							height: '100%',
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'center',
							position: 'relative'
						}}
					>
						{/* Orb Container */}
						<Box sx={{ width: '100%', height: '50vh', position: 'relative' }}>
							<Orb isListening={recorderState === 'listening'} />
						</Box>

						{/* Greeting / Status */}
						<Zoom in={recorderState === 'idle'}>
							<Box sx={{ textAlign: 'center', mt: -4, mb: 4, zIndex: 10 }}>
								<Typography variant="h3" sx={{ fontWeight: 400, color: 'text.primary' }}>
									How can I help?
								</Typography>
								<Typography variant="body1" sx={{ color: 'text.secondary', mt: 1 }}>
									Tap the microphone to start listening
								</Typography>
							</Box>
						</Zoom>

						{/* Processing State */}
						<Zoom in={recorderState === 'processing'}>
							<Box sx={{ textAlign: 'center', mt: -4, mb: 4, zIndex: 10, position: 'absolute' }}>
								<Typography variant="h4" sx={{ fontWeight: 400, color: 'primary.main' }}>
									Processing...
								</Typography>
							</Box>
						</Zoom>

						{/* Waveform */}
						<Box sx={{ width: '100%', maxWidth: 600, height: 80, mb: 4, opacity: recorderState === 'listening' ? 1 : 0.5 }}>
							<LiveWaveform isListening={recorderState === 'listening'} />
						</Box>

						{/* Bottom Controls */}
						<Box sx={{ p: 4, pb: 8, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
							<AmbientRecorderFAB
								state={recorderState}
								onPress={toggleRecording}
							/>
						</Box>
					</Box>
				)}

				{/* Clinical Result View - Visible when finished */}
				{sessionFinished && (
					<Zoom in={sessionFinished}>
						<Box sx={{ height: '100%', width: '100%', overflow: 'hidden' }}>
							<ClinicalResultView />
						</Box>
					</Zoom>
				)}

			</Box>
		</Box>
	);
}
