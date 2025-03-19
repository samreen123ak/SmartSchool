import React, { useState } from "react";
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Button, 
  Avatar, 
  Menu, 
  MenuItem, 
  Tooltip, 
  Box, 
  useMediaQuery, 
  useTheme,
  Divider
} from "@mui/material";
import { 
  Menu as MenuIcon, 
  Notifications as NotificationsIcon, 
  Settings as SettingsIcon, 
  Logout as LogoutIcon, 
  Person as PersonIcon,
  School as SchoolIcon
} from "@mui/icons-material";

const Header = ({ toggleSidebar }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("auth");
    window.location.href = "/login";
  };

  return (
    <AppBar position="static" color="default" elevation={1} sx={{ backgroundColor: "white" }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleSidebar}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <SchoolIcon sx={{ color: "primary.main", mr: 1 }} />
            <Typography
              variant="h6"
              component="div"
              sx={{ 
                fontWeight: 600,
                display: { xs: "none", sm: "block" }
              }}
            >
              Student Management
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          {!isMobile && (
            <Tooltip title="Notifications">
              <IconButton color="inherit" sx={{ ml: 1 }}>
                <NotificationsIcon />
              </IconButton>
            </Tooltip>
          )}
          
          <Tooltip title="Account settings">
            <IconButton
              onClick={handleProfileMenuOpen}
              size="small"
              sx={{ ml: 1 }}
              aria-controls={open ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.main" }}>
                <PersonIcon fontSize="small" />
              </Avatar>
            </IconButton>
          </Tooltip>
        </Box>

        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleMenuClose}
          onClick={handleMenuClose}
          PaperProps={{
            elevation: 3,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.1))",
              mt: 1.5,
              minWidth: 200,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
              Admin User
            </Typography>
            <Typography variant="body2" color="text.secondary">
              admin@example.com
            </Typography>
          </Box>
          
          <Divider />
          
          {/* <MenuItem onClick={handleMenuClose}>
            <PersonIcon fontSize="small" sx={{ mr: 2 }} />
            My Profile
          </MenuItem>
          
          <MenuItem onClick={handleMenuClose}>
            <SettingsIcon fontSize="small" sx={{ mr: 2 }} />
            Settings
          </MenuItem>
          
          <Divider /> */}
          
          <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
            <LogoutIcon fontSize="small" sx={{ mr: 2 }} />
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;