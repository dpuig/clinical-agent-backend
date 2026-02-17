'use client';

import React, { useState } from 'react';
import {
	Box,
	Button,
	Container,
	Paper,
	Typography,
	TextField,
	Stack,
	Divider,
	Alert
} from '@mui/material';
import { useAuth } from '@/context/AuthContext';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import SecurityIcon from '@mui/icons-material/Security';

export default function LoginPage() {
	const { login, isLoading } = useAuth();
	const [error, setError] = useState('');

	const handleLogin = async (role: 'doctor' | 'admin') => {
		try {
			await login(role);
		} catch (err) {
			setError('Authentication failed');
		}
	};

	return (
		<Box
			sx={{
				minHeight: '100vh',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				bgcolor: 'background.default',
			}}
		>
			<Container maxWidth="sm">
				<Paper
					elevation={0}
					variant="outlined"
					sx={{
						p: 4,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						borderColor: 'divider',
						// Use theme-aware background with some transparency if desired, but safest is solid or correct token
						bgcolor: 'background.paper',
						opacity: 0.95, // slight transparency if needed, or remove for solid
					}}
				>
					<Box
						sx={{
							width: 64,
							height: 64,
							bgcolor: 'primary.main',
							borderRadius: 2,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							mb: 2,
						}}
					>
						<LocalHospitalIcon sx={{ fontSize: 40, color: 'white' }} />
					</Box>

					<Typography component="h1" variant="h4" fontWeight="500" gutterBottom>
						Clinical Agent
					</Typography>

					<Typography variant="body1" color="text.secondary" gutterBottom>
						Enterprise Access Portal
					</Typography>

					{error && <Alert severity="error" sx={{ width: '100%', mt: 2 }}>{error}</Alert>}

					<Stack spacing={2} sx={{ width: '100%', mt: 4 }}>
						<Button
							fullWidth
							variant="contained"
							size="large"
							startIcon={<SecurityIcon />}
							onClick={() => handleLogin('doctor')}
							disabled={isLoading}
							sx={{ height: 56 }}
						>
							Sign in as Doctor (SSO)
						</Button>

						<Divider>OR</Divider>

						<Button
							fullWidth
							variant="outlined"
							size="large"
							onClick={() => handleLogin('admin')}
							disabled={isLoading}
							sx={{ height: 56 }}
						>
							System Administrator Login
						</Button>
					</Stack>

					<Typography variant="caption" color="text.secondary" sx={{ mt: 4 }}>
						Protected System - Authorized Personnel Only
					</Typography>
				</Paper>
			</Container>
		</Box>
	);
}
