'use client';

import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Stack,
  Avatar,
  Divider,
} from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SecurityIcon from '@mui/icons-material/Security';
import GroupIcon from '@mui/icons-material/Group';

const MOCK_USERS = [
  { id: 1, name: 'Dr. Jane Doe', role: 'Doctor' },
  { id: 2, name: 'Dr. Gregory House', role: 'Doctor' },
];

export default function AdminDashboard() {
  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Stack direction="row" justifyContent="center" gap={1} mb={2}>
          <AdminPanelSettingsIcon sx={{ fontSize: 64, color: 'primary.main' }} />
        </Stack>
        <Typography variant="h4" fontWeight="400" sx={{ color: '#1F1F1F' }}>
          Admin Console
        </Typography>
        <Typography variant="body1" sx={{ color: '#444746', mt: 1 }}>
          Manage organization users, settings and security
        </Typography>
      </Box>

      {/* User Management Card */}
      <Paper
        variant="outlined"
        sx={{
          borderRadius: 3, // 12px
          borderColor: '#C4C7C5',
          overflow: 'hidden',
          mb: 3,
          bgcolor: 'transparent'
        }}
      >
        <Box sx={{ p: 2, px: 3 }}>
          <Typography variant="h6" fontWeight="400" sx={{ color: '#1F1F1F' }}>Users & Permissions</Typography>
        </Box>

        <Stack>
          <Box
            sx={{
              p: 2, px: 3, display: 'flex', alignItems: 'center', gap: 2, cursor: 'pointer',
              '&:hover': { bgcolor: '#F0F4F8' }, borderTop: '1px solid #E0E3E1'
            }}
          >
            <GroupIcon sx={{ color: '#444746' }} />
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="body1" fontWeight="500" sx={{ color: '#1F1F1F' }}>Manage Users</Typography>
              <Typography variant="body2" sx={{ color: '#444746' }}>Add, remove, or edit access for 15 users</Typography>
            </Box>
            <ArrowForwardIosIcon sx={{ color: '#444746', fontSize: 16 }} />
          </Box>

          {MOCK_USERS.map((user) => (
            <Box
              key={user.id}
              sx={{
                p: 2,
                px: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                cursor: 'pointer',
                '&:hover': { bgcolor: '#F0F4F8' },
                borderTop: '1px solid #E0E3E1'
              }}
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main', fontSize: 14 }}>{user.name[0]}</Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="body1" fontWeight="500" sx={{ color: '#1F1F1F' }}>{user.name}</Typography>
                <Typography variant="caption" sx={{ color: '#444746' }}>{user.role}</Typography>
              </Box>
              <ArrowForwardIosIcon sx={{ color: '#444746', fontSize: 16 }} />
            </Box>
          ))}
        </Stack>
      </Paper>

      {/* Security Card */}
      <Paper
        variant="outlined"
        sx={{
          borderRadius: 3,
          borderColor: '#C4C7C5',
          mb: 3,
          bgcolor: 'transparent'
        }}
      >
        <Box
          sx={{
            p: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            cursor: 'pointer',
            '&:hover': { bgcolor: '#F0F4F8' }
          }}
        >
          <SecurityIcon sx={{ color: '#444746' }} />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" fontWeight="400" sx={{ color: '#1F1F1F' }}>Security Checkup</Typography>
            <Typography variant="body2" sx={{ color: '#444746' }}>Review recent activity and sign-in attempts</Typography>
          </Box>
          <ArrowForwardIosIcon sx={{ color: '#444746', fontSize: 16 }} />
        </Box>
      </Paper>
    </Box>
  );
}
