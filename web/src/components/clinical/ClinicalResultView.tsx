'use client';

import React, { useState } from 'react';
import {
	Box,
	Paper,
	Typography,
	Grid,
	TextField,
	Button,
	Stack,
	Divider,
	IconButton,
	useTheme,
	alpha
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import ShareIcon from '@mui/icons-material/Share';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import MedicalEntityChip, { EntityType } from './MedicalEntityChip';

// Mock Data Structure for the Result
interface CheckupResult {
	patientName: string;
	date: string;
	subjective: string;
	objective: string;
	assessment: string;
	plan: string;
	entities: { label: string; type: EntityType }[];
}

const MOCK_RESULT: CheckupResult = {
	patientName: 'Sophia Hayes',
	date: new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
	subjective: "Patient reports compliant with medication but experiencing mild dizziness in the mornings. No chest pain or shortness of breath. Sleeping well, averaging 7 hours.",
	objective: "BP 130/85, HR 72, Regular rhythm. Lungs clear to auscultation. No edema.",
	assessment: "Hypertension, controlled. Dizziness likely orthostatic or medication side effect.",
	plan: "1. Continue Lisinopril 10mg.\n2. Advise slow position changes.\n3. Monitor BP at home in mornings.\n4. Follow up in 3 months.",
	entities: [
		{ label: 'Hypertension', type: 'condition' },
		{ label: 'Lisinopril', type: 'medication' },
		{ label: 'Dizziness', type: 'condition' },
		{ label: 'BP 130/85', type: 'observation' },
	]
};

export default function ClinicalResultView() {
	const theme = useTheme();
	const [isEditing, setIsEditing] = useState(false);
	const [note, setNote] = useState(MOCK_RESULT);

	const handleSave = () => {
		setIsEditing(false);
		// In real app, save to backend
	};

	return (
		<Box sx={{ height: '100%', overflow: 'auto', p: 2 }}>
			<Grid container spacing={3} sx={{ height: '100%' }}>
				{/* Left Column: SOAP Note */}
				<Grid size={{ xs: 12, md: 8 }}>
					<Paper
						elevation={0}
						sx={{
							p: 4,
							bgcolor: theme.palette.background.paper,
							border: `1px solid ${theme.palette.divider}`,
							borderRadius: 3,
							height: '100%',
							display: 'flex',
							flexDirection: 'column'
						}}
					>
						<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
							<Box>
								<Typography variant="h5" fontWeight="600" color="primary">
									Clinical Encounter Note
								</Typography>
								<Typography variant="body2" color="text.secondary">
									{note.patientName} • {note.date}
								</Typography>
							</Box>
							<Stack direction="row" spacing={1}>
								<IconButton onClick={() => setIsEditing(!isEditing)} color={isEditing ? 'primary' : 'default'}>
									{isEditing ? <SaveIcon /> : <EditIcon />}
								</IconButton>
								<IconButton>
									<ContentCopyIcon />
								</IconButton>
								<IconButton>
									<ShareIcon />
								</IconButton>
							</Stack>
						</Box>

						<Divider sx={{ mb: 3 }} />

						<Stack spacing={3} sx={{ flex: 1, overflow: 'auto' }}>
							<Section
								title="Subjective"
								content={note.subjective}
								isEditing={isEditing}
								onChange={(val) => setNote({ ...note, subjective: val })}
							/>
							<Section
								title="Objective"
								content={note.objective}
								isEditing={isEditing}
								onChange={(val) => setNote({ ...note, objective: val })}
							/>
							<Section
								title="Assessment"
								content={note.assessment}
								isEditing={isEditing}
								onChange={(val) => setNote({ ...note, assessment: val })}
							/>
							<Section
								title="Plan"
								content={note.plan}
								isEditing={isEditing}
								onChange={(val) => setNote({ ...note, plan: val })}
							/>
						</Stack>

						{isEditing && (
							<Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
								<Button variant="contained" onClick={handleSave} startIcon={<SaveIcon />}>
									Save Note
								</Button>
							</Box>
						)}
					</Paper>
				</Grid>

				{/* Right Column: Entities & Insights */}
				<Grid size={{ xs: 12, md: 4 }}>
					<Stack spacing={3}>
						<Paper
							elevation={0}
							sx={{
								p: 3,
								bgcolor: theme.palette.mode === 'light' ? alpha(theme.palette.primary.main, 0.04) : theme.palette.background.paper,
								border: `1px solid ${theme.palette.divider}`,
								borderRadius: 3,
							}}
						>
							<Typography variant="h6" gutterBottom fontWeight="500">
								Extracted Entities
							</Typography>
							<Typography variant="body2" color="text.secondary" paragraph>
								Automatically detected from conversation.
							</Typography>
							<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
								{note.entities.map((entity, idx) => (
									<MedicalEntityChip key={idx} label={entity.label} type={entity.type} />
								))}
							</Box>
						</Paper>

						<Paper
							elevation={0}
							sx={{
								p: 3,
								bgcolor: theme.palette.background.paper,
								border: `1px solid ${theme.palette.divider}`,
								borderRadius: 3,
							}}
						>
							<Typography variant="h6" gutterBottom fontWeight="500">
								AI Insights
							</Typography>
							<Typography variant="body2" color="text.secondary" paragraph>
								• Medication adherence seems high.
							</Typography>
							<Typography variant="body2" color="text.secondary" paragraph>
								• Blood pressure is slightly elevated compared to last visit (125/80).
							</Typography>
						</Paper>
					</Stack>
				</Grid>
			</Grid>
		</Box>
	);
}

const Section = ({ title, content, isEditing, onChange }: { title: string, content: string, isEditing: boolean, onChange: (val: string) => void }) => (
	<Box>
		<Typography variant="subtitle2" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1, mb: 1, fontSize: '0.75rem' }}>
			{title}
		</Typography>
		{isEditing ? (
			<TextField
				fullWidth
				multiline
				variant="outlined"
				value={content}
				onChange={(e) => onChange(e.target.value)}
				sx={{
					'& .MuiOutlinedInput-root': {
						bgcolor: 'background.default'
					}
				}}
			/>
		) : (
			<Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
				{content}
			</Typography>
		)}
	</Box>
);
