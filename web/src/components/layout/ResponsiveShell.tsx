'use client';

import React from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  BottomNavigation,
  BottomNavigationAction,
  useMediaQuery,
  useTheme,
  Tooltip,
  InputBase,
  alpha,
  Paper,
  Menu,
  MenuItem,
  Divider
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import SettingsSystemDaydreamIcon from '@mui/icons-material/SettingsSystemDaydream';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '@/context/AuthContext';
import { useThemeContext, ThemeMode } from '@/context/ThemeContext';
import { usePathname, useRouter } from 'next/navigation';

const NAV_WIDTH_DRAWER = 300; // Standard M3 Drawer width is often 360, but 300 fits well.
const NAV_WIDTH_RAIL = 80;

const NAV_ITEMS = [
  { label: 'Dashboard', icon: <DashboardIcon />, href: '/' },
  { label: 'Patients', icon: <PeopleIcon />, href: '/patients' },
  { label: 'Schedule', icon: <CalendarTodayIcon />, href: '/schedule' },
  { label: 'AI Mode', icon: <AutoAwesomeIcon />, href: '/ai-mode' },
  { label: 'Settings', icon: <SettingsIcon />, href: '/settings' },
];

export default function ResponsiveShell({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  const { themeMode, setThemeMode } = useThemeContext();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg')); // > 1200px
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg')); // 600px - 1200px
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // < 600px

  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleThemeChange = (mode: ThemeMode) => {
    setThemeMode(mode);
    handleClose();
  };

  const handleLogout = () => {
    handleClose();
    logout();
  };

  if (!user || pathname === '/login') {
    return <>{children}</>;
  }

  // M3 Drawer/Rail Content
  const NavDrawerContent = ({ rail = false }) => (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.default', borderRight: `1px solid ${theme.palette.divider}` }}>
      {/* M3 Header */}
      {!rail && (
        <Box sx={{ p: 3, pl: 4, display: 'flex', alignItems: 'center', gap: 2, minHeight: 64 }}>
          {/* Logo could go here, or just spacing */}
          <LocalHospitalIcon sx={{ color: 'primary.main' }} />
          <Typography variant="h6" fontWeight="500" sx={{ color: 'text.secondary' }}>
            Clinical Agent
          </Typography>
        </Box>
      )}
      {rail && (
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', mb: 2, minHeight: 64, alignItems: 'center' }}>
          <LocalHospitalIcon sx={{ color: 'primary.main' }} />
        </Box>
      )}

      {/* M3 Navigation Items */}
      <List sx={{ px: 1.5, flexGrow: 1 }}>
        {NAV_ITEMS.map((item) => (
          <ListItem key={item.label} disablePadding sx={{ mb: 0.5, display: 'block' }}>
            <ListItemButton
              selected={pathname === item.href}
              onClick={() => router.push(item.href)}
              sx={{
                minHeight: 56, // M3 specs for touch targets
                justifyContent: rail ? 'center' : 'initial',
                px: rail ? 0 : 3,
                borderRadius: 4, // 32px height -> 16px radius, full pill often 28px/56px height
                '&.Mui-selected': {
                  bgcolor: 'primary.light', // M3 Secondary Container
                  color: 'primary.dark', // On Secondary Container
                  '&:hover': { bgcolor: 'primary.light' },
                  '& .MuiListItemIcon-root': { color: 'primary.dark' }
                }
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: rail ? 0 : 2,
                  justifyContent: 'center',
                  color: pathname === item.href ? 'primary.dark' : 'text.secondary'
                }}
              >
                {item.icon}
              </ListItemIcon>
              {!rail && (
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: pathname === item.href ? 600 : 500,
                    fontSize: '0.9rem',
                    color: pathname === item.href ? 'primary.dark' : 'text.primary'
                  }}
                />
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Footer / User Profile */}
      <Box sx={{ p: 2, textAlign: rail ? 'center' : 'left' }}>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>

      {/* TOP BAR / SEARCH */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          bgcolor: 'transparent',
          color: 'text.primary',
          width: { lg: `calc(100% - ${NAV_WIDTH_DRAWER}px)`, sm: `calc(100% - ${NAV_WIDTH_RAIL}px)` },
          ml: { lg: `${NAV_WIDTH_DRAWER}px`, sm: `${NAV_WIDTH_RAIL}px` },
          top: 0
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: 3 }}>
          {isMobile && <IconButton edge="start"><MenuIcon /></IconButton>}

          {/* Search Field (M3 Style) */}


          {/* User Profile */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 'auto' }}>
            <Tooltip title="Account settings">
              <IconButton
                onClick={handleMenu}
                size="small"
                aria-controls={open ? 'account-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
              >
                <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32, fontSize: 14 }}>
                  {user.name.charAt(0)}
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                  mt: 1.5,
                  '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  '&::before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <Box sx={{ px: 2, py: 1 }}>
                <Typography variant="subtitle2" noWrap>{user.name}</Typography>
                <Typography variant="caption" color="text.secondary" noWrap>{user.email}</Typography>
              </Box>
              <Divider />
              <MenuItem onClick={() => handleThemeChange('light')} selected={themeMode === 'light'}>
                <ListItemIcon>
                  <Brightness7Icon fontSize="small" />
                </ListItemIcon>
                Light
              </MenuItem>
              <MenuItem onClick={() => handleThemeChange('dark')} selected={themeMode === 'dark'}>
                <ListItemIcon>
                  <Brightness4Icon fontSize="small" />
                </ListItemIcon>
                Dark
              </MenuItem>
              <MenuItem onClick={() => handleThemeChange('system')} selected={themeMode === 'system'}>
                <ListItemIcon>
                  <SettingsSystemDaydreamIcon fontSize="small" />
                </ListItemIcon>
                System
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* NAVIGATION DRAWERS */}
      {isDesktop && (
        <Drawer
          variant="permanent"
          sx={{
            width: NAV_WIDTH_DRAWER,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: NAV_WIDTH_DRAWER, boxSizing: 'border-box', border: 'none', bgcolor: '#F0F4F8' },
          }}
        >
          <NavDrawerContent />
        </Drawer>
      )}

      {isTablet && (
        <Drawer
          variant="permanent"
          sx={{
            width: NAV_WIDTH_RAIL,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: NAV_WIDTH_RAIL, boxSizing: 'border-box', border: 'none', bgcolor: '#F0F4F8' },
          }}
        >
          <NavDrawerContent rail />
        </Drawer>
      )}

      {/* MAIN CONTENT AREA */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          pt: 10,
          width: { sm: `calc(100% - ${isDesktop ? NAV_WIDTH_DRAWER : NAV_WIDTH_RAIL}px)` },
          mb: isMobile ? 8 : 0,
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 900 }}> {/* Constrained width like Google Account */}
          {children}
        </Box>
      </Box>

      {/* MOBILE BOTTOM NAV */}
      {isMobile && (
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100 }} elevation={3}>
          <BottomNavigation
            value={pathname}
            onChange={(e, v) => router.push(v)}
            showLabels
          >
            {NAV_ITEMS.map(item => (
              <BottomNavigationAction
                key={item.href}
                label={item.label}
                value={item.href}
                icon={item.icon}
              />
            ))}
          </BottomNavigation>
        </Paper>
      )}
    </Box>
  );
}
