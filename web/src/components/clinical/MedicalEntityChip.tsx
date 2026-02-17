import React from 'react';
import { Chip, ChipProps, useTheme, alpha } from '@mui/material';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
import HealingIcon from '@mui/icons-material/Healing';
import VisibilityIcon from '@mui/icons-material/Visibility';

export type EntityType = 'condition' | 'medication' | 'observation' | 'procedure';

interface MedicalEntityChipProps extends Omit<ChipProps, 'color'> {
	label: string;
	type: EntityType;
}

export default function MedicalEntityChip({ label, type, sx, ...props }: MedicalEntityChipProps) {
	const theme = useTheme();

	const getEntityConfig = (type: EntityType) => {
		switch (type) {
			case 'condition':
				return {
					icon: <HealingIcon style={{ fontSize: 18 }} />,
					color: theme.palette.error.main,
					bgColor: alpha(theme.palette.error.main, 0.1),
					borderColor: alpha(theme.palette.error.main, 0.3),
				};
			case 'medication':
				return {
					icon: <LocalPharmacyIcon style={{ fontSize: 18 }} />,
					color: theme.palette.primary.main,
					bgColor: alpha(theme.palette.primary.main, 0.1),
					borderColor: alpha(theme.palette.primary.main, 0.3),
				};
			case 'procedure':
				return {
					icon: <VisibilityIcon style={{ fontSize: 18 }} />, // Using visibility as placeholder or maybe a different one
					color: theme.palette.secondary.main,
					bgColor: alpha(theme.palette.secondary.main, 0.1),
					borderColor: alpha(theme.palette.secondary.main, 0.3),
				};
			default:
				return {
					icon: <VisibilityIcon style={{ fontSize: 18 }} />,
					color: theme.palette.text.secondary,
					bgColor: alpha(theme.palette.text.secondary, 0.1),
					borderColor: alpha(theme.palette.divider, 0.5),
				};
		}
	};

	const config = getEntityConfig(type);

	return (
		<Chip
			icon={React.cloneElement(config.icon as React.ReactElement<any>, { style: { color: config.color, fontSize: 18 } })}
			label={label}
			variant="outlined"
			sx={{
				borderColor: config.borderColor,
				bgcolor: config.bgColor,
				color: theme.palette.text.primary,
				fontWeight: 500,
				borderRadius: '8px',
				'& .MuiChip-icon': {
					color: config.color,
				},
				...sx,
			}}
			{...props}
		/>
	);
}
