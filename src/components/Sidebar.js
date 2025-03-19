import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Box,
  Typography,
  Collapse,
  Avatar,
  Tooltip
} from "@mui/material";
import {
  ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  Group as GroupIcon,
  MenuBook as MenuBookIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  CalendarMonth as CalendarIcon,
  ExpandLess,
  ExpandMore,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon
} from "@mui/icons-material";

const Sidebar = ({ closeSidebar, open }) => {
  const location = useLocation();
  const [academicsOpen, setAcademicsOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);

  const handleAcademicsClick = () => {
    setAcademicsOpen(!academicsOpen);
  };

  const handleAdminClick = () => {
    setAdminOpen(!adminOpen);
  };

  // Check if a path is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  const menuItems = [
    // { 
    //   text: "Dashboard", 
    //   icon: <DashboardIcon />, 
    //   path: "/dashboard" 
    // },
    { 
      text: "Students", 
      icon: <PersonIcon />, 
      path: "/student",
      active: isActive("/student")
    },
    // { 
    //   text: "Teachers", 
    //   icon: <GroupIcon />, 
    //   path: "/teachers" 
    // },
    // { 
    //   text: "Calendar", 
    //   icon: <CalendarIcon />, 
    //   path: "/calendar" 
    // },
    // {
    //   text: "Academics",
    //   icon: <MenuBookIcon />,
    //   expandable: true,
    //   open: academicsOpen,
    //   onClick: handleAcademicsClick,
    //   subItems: [
    //     { text: "Courses", path: "/courses" },
    //     { text: "Assignments", path: "/assignments" },
    //     { text: "Grades", path: "/grades" }
    //   ]
    // },
    // { 
    //   text: "Reports", 
    //   icon: <AssessmentIcon />, 
    //   path: "/reports" 
    // },
    // {
    //   text: "Administration",
    //   icon: <SettingsIcon />,
    //   expandable: true,
    //   open: adminOpen,
    //   onClick: handleAdminClick,
    //   subItems: [
    //     { text: "User Management", path: "/users" },
    //     { text: "Settings", path: "/settings" },
    //     { text: "System Logs", path: "/logs" }
    //   ]
    // }
  ];

  return (
    <Drawer
      variant="temporary"
      open={open}
      onClose={closeSidebar}
      ModalProps={{
        keepMounted: true,
      }}
      sx={{
        '& .MuiDrawer-paper': {
          width: 280,
          boxSizing: 'border-box',
          borderRight: '1px solid rgba(0, 0, 0, 0.12)',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px',
          borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <SchoolIcon sx={{ color: 'primary.main', mr: 1 }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Student Portal
          </Typography>
        </Box>
        <IconButton onClick={closeSidebar}>
          <ChevronLeftIcon />
        </IconButton>
      </Box>

      <List sx={{ padding: 1 }} component="nav">
        {menuItems.map((item, index) => (
          <React.Fragment key={item.text}>
            {item.expandable ? (
              <>
                <ListItem disablePadding>
                  <ListItemButton onClick={item.onClick}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.text} />
                    {item.open ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                </ListItem>
                <Collapse in={item.open} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.subItems.map((subItem) => (
                      <ListItem key={subItem.text} disablePadding>
                        <ListItemButton
                          component={Link}
                          to={subItem.path}
                          onClick={closeSidebar}
                          sx={{ pl: 4 }}
                          selected={isActive(subItem.path)}
                        >
                          <ListItemText primary={subItem.text} />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              </>
            ) : (
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  onClick={closeSidebar}
                  selected={item.active}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            )}
            {(index === 3 || index === 5) && <Divider sx={{ my: 1 }} />}
          </React.Fragment>
        ))}
      </List>

      <Box
        sx={{
          borderTop: '1px solid rgba(0, 0, 0, 0.12)',
          marginTop: 'auto',
          padding: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ width: 40, height: 40, mr: 2, bgcolor: 'primary.main' }}>
            <AccountCircleIcon />
          </Avatar>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Admin User
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Administrator
            </Typography>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;