'use client';

import React from 'react';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '@/context/AuthContext';
import DoctorDashboard from '@/components/dashboard/DoctorDashboard';
import AdminDashboard from '@/components/dashboard/AdminDashboard';

export default function Home() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return null; // Redirect handled by AuthProvider
  }

  if (user.role === 'admin') {
    return <AdminDashboard />;
  }

  return <DoctorDashboard />;
}
