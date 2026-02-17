'use client';

import React from 'react';
import {
	Box,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Typography,
	Avatar,
	Divider,
	useTheme,
	alpha
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import { useAuth } from '@/context/AuthContext';

const NAV_ITEMS = [
	{ label: 'Dashboard', icon: <DashboardIcon />, href: '/' },
	{ label: 'Patients', icon: <PeopleIcon />, href: '/patients' },
	{ label: 'Schedule', icon: <CalendarTodayIcon />, href: '/schedule' },
	{ label: 'Settings', icon: <SettingsIcon />, href: '/settings' },
];

export default function Sidebar() {
	const theme = useTheme();
	const { user, logout } = useAuth();
	const activeRoute = '/'; // Mock active route for visual state

	return (
		<Box
			sx={{
				width: 280,
				height: '95vh',
				m: 2,
				borderRadius: 4,
				display: 'flex',
				flexDirection: 'column',
				bgcolor: '#191C1D', // Dark Surface (Bio-Digital Slate Dark)
				color: '#E1E3E3', // OnSurface
				boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
				overflow: 'hidden',
				position: 'sticky',
				top: 16,
			}}
		>
			{/* Brand Header */}
			<Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
				<Box
					sx={{
						width: 40,
						height: 40,
						borderRadius: 2,
						bgcolor: theme.palette.primary.main,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<LocalHospitalIcon sx={{ color: 'white' }} />
				</Box>
				<Typography variant="h6" fontWeight="bold" sx={{ color: '#E1E3E3' }}>
					Clinical AI
				</Typography>
			</Box>

			{/* Navigation Links */}
			<List sx={{ px: 2, flexGrow: 1 }}>
				{NAV_ITEMS.map((item) => (
					<ListItem key={item.label} disablePadding sx={{ mb: 1 }}>
						<ListItemButton
							selected={item.href === activeRoute}
							sx={{
								borderRadius: 3,
								py: 1.5,
								'&.Mui-selected': {
									bgcolor: alpha(theme.palette.primary.light, 0.15),
									'&:hover': {
										bgcolor: alpha(theme.palette.primary.light, 0.25),
									},
								},
								'&:hover': {
									bgcolor: alpha('#E1E3E3', 0.05),
								},
							}}
						>
							<ListItemIcon
								sx={{
									minWidth: 40,
									color: item.href === activeRoute ? theme.palette.primary.light : '#8A9296',
								}}
							>
								{item.icon}
							</ListItemIcon>
							<ListItemText
								primary={item.label}
								primaryTypographyProps={{
									fontWeight: item.href === activeRoute ? 600 : 400,
									color: item.href === activeRoute ? '#E1E3E3' : '#C0C8CD',
								}}
							/>
						</ListItemButton>
					</ListItem>
				))}
			</List>

			{/* User Footer */}
			<Box sx={{ p: 2, bgcolor: alpha('#000', 0.2) }}>
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						p: 1.5,
						borderRadius: 3,
						bgcolor: alpha('#E1E3E3', 0.05),
					}}
				>
					<Avatar
						sx={{
							width: 40,
							height: 40,
							bgcolor: theme.palette.secondary.main,
							mr: 2
						}}
					>
						{user?.name.charAt(0)}
					</Avatar>
					<Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
						<Typography variant="subtitle2" noWrap sx={{ color: '#E1E3E3', fontWeight: 600 }}>
							{user?.name}
						</Typography>
						<Typography variant="caption" noWrap sx={{ color: '#8A9296', display: 'block' }}>
							{user?.role === 'admin' ? 'Administrator' : 'Cardiologist'}
						</Typography>
					</Box>
					<ListItemIcon
						onClick={logout}
						sx={{
							minWidth: 'auto',
							color: theme.palette.error.light,
							cursor: 'pointer',
							p: 1,
							borderRadius: '50%',
							'&:hover': { bgcolor: alpha(theme.palette.error.main, 0.1) }
						}}
					>
						<LogoutIcon fontSize="small" />
					</ListItemIcon>
				</Box>
			</Box>
		</Box>
	);
}
