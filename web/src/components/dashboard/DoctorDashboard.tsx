'use client';

import React from 'react';
import {
   Box,
   Typography,
   Paper,
   Stack,
   Avatar,
   Chip,
   IconButton,
   Divider,
} from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

const MOCK_PATIENTS = [
   { id: 1, name: 'Sophia Hayes', condition: 'Hypertension', status: 'Inpatient', avatarUrl: 'https://i.pravatar.cc/150?u=1' },
   { id: 2, name: 'Owen Darnell', condition: 'Post-Op Recovery', status: 'Critical', avatarUrl: 'https://i.pravatar.cc/150?u=2' },
   { id: 3, name: 'Emma Larkin', condition: 'Migraine', status: 'Outpatient', avatarUrl: 'https://i.pravatar.cc/150?u=3' },
   { id: 4, name: 'Liam Grayson', condition: 'Arrhythmia', status: 'Inpatient', avatarUrl: 'https://i.pravatar.cc/150?u=4' },
];

export default function DoctorDashboard() {
   return (
      <Box>
         {/* Welcome Header (Standard Text) */}
         <Box sx={{ mb: 6, textAlign: 'center' }}>
            <Avatar
               sx={{ width: 80, height: 80, mx: 'auto', mb: 2, bgcolor: 'transparent' }}
            >
               <LocalHospitalIcon sx={{ fontSize: 64, color: 'primary.main' }} />
            </Avatar>
            <Typography variant="h4" fontWeight="400" sx={{ color: '#1F1F1F' }}>
               Clinical Dashboard
            </Typography>
            <Typography variant="body1" sx={{ color: '#444746', mt: 1 }}>
               Overview of your assigned patients and daily tasks
            </Typography>
         </Box>

         {/* M3 Outlined Container */}
         <Paper
            variant="outlined"
            sx={{
               borderRadius: 3, // 12px (M3 Standard)
               borderColor: '#C4C7C5', // M3 Outline Variant
               overflow: 'hidden',
               mb: 3,
               bgcolor: 'transparent' // Often M3 containers on surface are transparent or lightly colored
            }}
         >
            <Box sx={{ p: 2, px: 3 }}>
               <Typography variant="h6" fontWeight="400" sx={{ color: '#1F1F1F' }}>Active Patients</Typography>
               <Typography variant="body2" sx={{ color: '#444746' }}>Real-time status updates</Typography>
            </Box>

            {/* List Items */}
            <Stack>
               {MOCK_PATIENTS.map((patient) => (
                  <Box
                     key={patient.id}
                     sx={{
                        p: 2,
                        px: 3,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        cursor: 'pointer',
                        '&:hover': { bgcolor: '#F0F4F8' }, // Hover state
                        borderTop: '1px solid',
                        borderColor: '#E0E3E1'
                     }}
                  >
                     <Avatar src={patient.avatarUrl} sx={{ width: 40, height: 40 }} />
                     <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="body1" fontWeight="500" sx={{ color: '#1F1F1F' }}>{patient.name}</Typography>
                        <Stack direction="row" alignItems="center" gap={1}>
                           <Typography variant="body2" sx={{ color: '#444746' }}>{patient.condition}</Typography>
                           <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: '#444746' }} />
                           <Typography variant="caption" sx={{ color: '#444746' }}>{patient.status}</Typography>
                        </Stack>
                     </Box>
                     <ArrowForwardIosIcon sx={{ color: '#444746', fontSize: 16 }} />
                  </Box>
               ))}
            </Stack>
            <Box sx={{ p: 2, textAlign: 'center', borderTop: '1px solid #E0E3E1' }}>
               <Typography
                  variant="button"
                  color="primary"
                  fontWeight="600"
                  sx={{ textTransform: 'none', fontSize: '0.9rem', borderRadius: 4, px: 2, py: 1, '&:hover': { bgcolor: 'primary.light', bgOpacity: 0.1 } }}
               >
                  See all patients (12)
               </Typography>
            </Box>
         </Paper>

      </Box>
   );
}
