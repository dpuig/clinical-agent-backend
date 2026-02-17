'use client';

import React from 'react';
import {
	Box,
	Typography,
	List,
	ListItem,
	ListItemAvatar,
	Avatar,
	ListItemText,
	IconButton,
	Button,
	Paper,
	Divider,
	Stack
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/NotificationsNone';
import AddIcon from '@mui/icons-material/Add';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MicNoneIcon from '@mui/icons-material/MicNone';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export default function RightPanel() {
	return (
		<Box
			sx={{
				width: 320,
				height: 'calc(100vh - 32px)',
				m: 2,
				ml: 0,
				display: 'flex',
				flexDirection: 'column',
				gap: 3,
				position: 'sticky',
				top: 16,
			}}
		>
			{/* Quick Actions */}
			<Paper
				elevation={0}
				sx={{
					p: 3,
					borderRadius: 6,
					bgcolor: 'white',
					border: '1px solid',
					borderColor: 'divider',
				}}
			>
				<Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
					<Typography variant="h6" fontWeight="700">Quick Actions</Typography>
					<IconButton size="small"><AddIcon /></IconButton>
				</Stack>

				<Stack spacing={2}>
					<Button
						variant="contained"
						startIcon={<AddIcon />}
						fullWidth
						sx={{
							borderRadius: 4,
							py: 1.5,
							bgcolor: '#191C1D',
							color: 'white',
							'&:hover': { bgcolor: '#000' }
						}}
					>
						New Patient
					</Button>
					<Button
						variant="outlined"
						startIcon={<MicNoneIcon />}
						fullWidth
						sx={{ borderRadius: 4, py: 1.5 }}
					>
						Record Note
					</Button>
				</Stack>
			</Paper>

			{/* Notifications / Updates */}
			<Paper
				elevation={0}
				sx={{
					flexGrow: 1,
					p: 3,
					borderRadius: 6,
					bgcolor: 'white',
					border: '1px solid',
					borderColor: 'divider',
					display: 'flex',
					flexDirection: 'column'
				}}
			>
				<Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
					<Typography variant="h6" fontWeight="700">Updates</Typography>
					<Box sx={{ bgcolor: '#E1EBF1', borderRadius: 4, px: 1.5, py: 0.5 }}>
						<Typography variant="caption" fontWeight="bold" color="primary">4 New</Typography>
					</Box>
				</Stack>

				<List sx={{ flexGrow: 1, overflow: 'auto' }}>
					<ListItem alignItems="flex-start" disableGutters sx={{ py: 1.5, borderBottom: '1px solid #f0f0f0' }}>
						<ListItemAvatar>
							<Avatar sx={{ bgcolor: '#E1EBF1', color: '#006684' }}><NotificationsIcon /></Avatar>
						</ListItemAvatar>
						<ListItemText
							primary="Lab Results Ready"
							secondary="Sophia Hayes - Blood Panel"
							primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem' }}
							secondaryTypographyProps={{ fontSize: '0.8rem' }}
						/>
						<Box sx={{ width: 8, height: 8, bgcolor: 'error.main', borderRadius: '50%', mt: 1 }} />
					</ListItem>

					<ListItem alignItems="flex-start" disableGutters sx={{ py: 1.5, borderBottom: '1px solid #f0f0f0' }}>
						<ListItemAvatar>
							<Avatar sx={{ bgcolor: '#FFF0EA', color: '#B04F23' }}><CalendarMonthIcon /></Avatar>
						</ListItemAvatar>
						<ListItemText
							primary="Upcoming Consult"
							secondary="14:00 - Owen Darnell"
							primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem' }}
							secondaryTypographyProps={{ fontSize: '0.8rem' }}
						/>
					</ListItem>
				</List>

				<Button endIcon={<ArrowForwardIosIcon sx={{ fontSize: '12px !important' }} />} sx={{ mt: 2, alignSelf: 'flex-start' }}>
					View All
				</Button>
			</Paper>
		</Box>
	);
}
